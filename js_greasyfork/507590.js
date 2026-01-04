// ==UserScript==
// @name         SHEIN FORM AUTO FILL FOR [MJ]
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Auto-fill script for SHEIN
// @author       Henry
// @match        https://sso.geiwohuo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geiwohuo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507590/SHEIN%20FORM%20AUTO%20FILL%20FOR%20%5BMJ%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/507590/SHEIN%20FORM%20AUTO%20FILL%20FOR%20%5BMJ%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const listURL = "https://sso.geiwohuo.com/#/spmp/commdities/list";
    const editURL = "https://sso.geiwohuo.com/#/spmp/commoditiesInfo/edit";
    const currentURL = window.location.href;

    const sizeGroup1 = [
        { "searchStr": "16×24英寸（40×60厘米）", "str": "16×24英寸（40×60厘米） 16×24inch(40×60cm)", "price": 39.99, "weight": 700, "long": 62, "width": 42, "height": 3, "stock": 30 },
        { "searchStr": "12×18英寸（30×45厘米）", "str": "12×18英寸（30×45厘米） 12×18inch(30×45cm)", "price": 22.6, "weight": 600, "long": 47, "width": 32, "height": 3, "stock": 30 },
        { "searchStr": "20×30英寸（50×75厘米）", "str": "20×30英寸（50×75厘米） 20×30inch(50×75cm)", "price": 45, "weight": 1350, "long": 77, "width": 52, "height": 3, "stock": 30 },
        { "searchStr": "24×36英寸（60×90厘米）", "str": "24×36英寸（60×90厘米） 24×36inch(60×90cm)", "price": 48, "weight": 2010, "long": 92, "width": 62, "height": 3, "stock": 30 },
        { "searchStr": "28×40英寸（70×100厘米）", "str": "28×40英寸（70×100厘米） 28×40inch(70×100cm)", "price": 60, "weight": 2500, "long": 102, "width": 72, "height": 3, "stock": 30 },
    ];

    const sizeGroup2 = [
        { "searchStr": "12×24英寸（30×60厘米）", "str": "12×24英寸（30×60厘米） 12×24inch(30×60cm)", "price": 35.99, "weight": 450, "long": 62, "width": 32, "height": 3, "stock": 30 },
        { "searchStr": "16×32英寸（40×80厘米）", "str": "16×32英寸（40×80厘米） 16×32inch(40×80cm)", "price": 45, "weight": 800, "long": 82, "width": 42, "height": 3, "stock": 30 },
        { "searchStr": "20×40英寸（50×100厘米）", "str": "20×40英寸（50×100厘米） 20×40inch(50×100cm)", "price": 58, "weight": 2300, "long": 102, "width": 52, "height": 3, "stock": 30 },
        { "searchStr": "24×48英寸（60×120厘米）", "str": "24×48英寸（60×120厘米） 24×48inch(60×120cm)", "price": 67, "weight": 2700, "long": 122, "width": 62, "height": 3, "stock": 30 },
    ];

    const sizeGroup3 = [
        { "searchStr": "16×16英寸（40×40厘米）", "str": "16×16英寸（40×40厘米） 16×16inch(40×40cm)", "price": 37, "weight": 450, "long": 42, "width": 42, "height": 3, "stock": 30 },
        { "searchStr": "20×20英寸（50×50厘米）", "str": "20×20英寸（50×50厘米） 20×20inch(50×50cm)", "price": 34, "weight": 800, "long": 52, "width": 52, "height": 3, "stock": 30 },
        { "searchStr": "24×24英寸（60×60厘米）", "str": "24×24英寸（60×60厘米） 24×24inch(60×60cm)", "price": 41.99, "weight": 1300, "long": 62, "width": 62, "height": 3, "stock": 30 },
        { "searchStr": "28×28英寸（70×70厘米）", "str": "28×28英寸（70×70厘米） 28×28inch(70×70cm)", "price": 47, "weight": 1500, "long": 72, "width": 72, "height": 3, "stock": 30 },
    ];

    const sizeGroupSizeStr1 = sizeGroup1.map(item => item.str).join(',');
    const sizeGroupSizeStr2 = sizeGroup2.map(item => item.str).join(',');
    const sizeGroupSizeStr3 = sizeGroup3.map(item => item.str).join(',');

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (currentURL.startsWith(listURL)) {
                // document.body.appendChild(btnStart);
            } else if (currentURL.startsWith(editURL)) {
                document.body.appendChild(btnAdd);
            }
        }, 2000);
    });

    // START button
    const btnStart = document.createElement("button");
    btnStart.textContent = "START";
    setButtonStyle(btnStart);

    btnStart.onclick = function () {
        const foundButtons = document.querySelectorAll('button[data-apmclick="商品列表页面-已发布商品-商品列表-编辑/复色"]');
        foundButtons.forEach((btn, index) => {
            setTimeout(() => triggerClick(btn), index * 2000);
        });
    };

    // ADD button
    const btnAdd = document.createElement("button");
    btnAdd.textContent = "ADD";
    setButtonStyle(btnAdd);

    btnAdd.onclick = async function () {
        try {
            setButtonEnabled(btnAdd, false);
            const exitSizeSpans = document.querySelectorAll('.so-form-item.other_spec div[class^="style__specValues"] .so-select-input.so-select-ellipsis.so-select-full');
            const exitSizes = Array.from(exitSizeSpans, span => span.textContent);
            console.log("===> Existing Sizes: ", exitSizes);

            if (!exitSizes.length) {
                console.log('===> Unable to determine size group');
                setButtonEnabled(btnAdd, true);
                return;
            }

            const toBeAddSizes = getToBeAddSizes(exitSizes);
            console.log("===> Sizes to Add: ", toBeAddSizes);

            if (!toBeAddSizes.length) {
                console.log('===> No sizes to add');
                setButtonEnabled(btnAdd, true);
                return;
            }

            await addSize(toBeAddSizes);
            // Then add size stock info
            await addSizeStock(toBeAddSizes);
            setTimeout(async () => {
                // Then add size detail info in supply information
                await addSizeDetailInfo(toBeAddSizes)
            }, 1500);

        } catch (error) {
            console.error("===> Error in adding sizes: ", error);
        } finally {
            setButtonEnabled(btnAdd, true);
        }
    };

    async function moveToSupplyInfo() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                const supplyInformationDiv = document.querySelector('div[id="userguide_commodities_info_supply_weight_table"]');
                if (supplyInformationDiv) {
                    supplyInformationDiv.scrollIntoView({ behavior: 'smooth' });
                    // Add a delay to allow time for the scroll animation and rendering to complete
                    // setTimeout(() => {
                    resolve();
                    // }, 2000); // Adjust this timeout if necessary
                } else {
                    console.error("===> Supply information div not found!");
                    resolve(); // Proceed anyway to avoid blocking, but log an error
                }
            });
        })
    }

    // Trigger a click event
    function triggerClick(element) {
        if (element) {
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            element.dispatchEvent(event);
        }
    }

    // Get sizes that need to be added
    function getToBeAddSizes(exitSizes) {
        let filteredSizes = [];
        const exitSizesStr = exitSizes.join(',');
        console.log('===> exitSizesStr: ', exitSizesStr);

        if (sizeGroupSizeStr1.includes(exitSizes[0])) {
            filteredSizes = sizeGroup1.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr2.includes(exitSizes[0])) {
            filteredSizes = sizeGroup2.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr3.includes(exitSizes[0])) {
            filteredSizes = sizeGroup3.filter(size => !exitSizesStr.includes(size.searchStr));
        }

        return filteredSizes;
    }

    // Add sizes one by one in sequence without relying on setTimeout for stability
    async function addSize(toBeAddSizes) {
        for (const [index, size] of toBeAddSizes.entries()) {
            try {
                await addSingleSize(size); // Wait for each size to be added before moving to the next
            } catch (error) {
                console.error(`===> Failed to add size: ${size.searchStr}`, error);
            }
        }
    }

    async function addSingleSize(size) {
        return new Promise((resolve, reject) => {
            try {
                let pollCount = 0; // Initialize poll counter
                const maxPollCount = 20; // Set maximum number of polls (20 * 500ms = 10 seconds)

                const pollForSelectInput = setInterval(() => {
                    const lastSpecItem = document.querySelector('div.so-form-item.other_spec div[class^="style__specValues"] > div:last-child .so-input.so-select');
                    if (!lastSpecItem) {
                        console.log('===> Waiting for lastSpecItem to be available...');
                        pollCount++;
                        if (pollCount >= maxPollCount) {
                            clearInterval(pollForSelectInput);
                            reject(new Error(`Timeout: lastSpecItem not found for size ${size.searchStr}`));
                        }
                        return;
                    }

                    // Trigger click to open the dropdown
                    const dropdownTrigger = lastSpecItem.querySelector('.so-select-drop-down');
                    if (dropdownTrigger) {
                        triggerClick(dropdownTrigger); // Click to open dropdown
                        console.log('===> Dropdown triggered for size:', size.searchStr);
                    } else {
                        console.error('===> Dropdown trigger not found.');
                        clearInterval(pollForSelectInput);
                        reject(new Error('Dropdown trigger not found.'));
                        return;
                    }

                    // Poll for select input to be available after dropdown is opened
                    const selectInput = lastSpecItem.querySelector('span.so-select-input.so-select-full');
                    if (selectInput) {
                        clearInterval(pollForSelectInput); // Stop polling once the select input is found

                        // Simulate input event and assign the size's searchStr
                        selectInput.textContent = size.searchStr;
                        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                        selectInput.dispatchEvent(inputEvent);

                        // Find the corresponding option and click
                        setTimeout(() => {
                            const option = document.querySelector(`span[title="${size.str}"]`);
                            if (option) {
                                console.log(`===> Selecting size: ${size.str}`);
                                triggerClick(option);
                                resolve(); // Resolve the promise once the size is selected
                            } else {
                                console.log(`===> Option not found for: ${size.str}`);
                                resolve(); // Option not found, but resolve to avoid blocking
                            }
                        }, 1000);
                    } else {
                        console.log('===> Waiting for select input to be available...');
                        pollCount++; // Increment poll counter
                        if (pollCount >= maxPollCount) {
                            clearInterval(pollForSelectInput); // Stop polling after reaching the limit
                            console.error(`===> Timeout: Select input not found after polling for size ${size.searchStr}.`);
                            reject(new Error(`Timeout: Select input not found for size ${size.searchStr}`));
                        }
                    }
                }, 500); // Poll every 500ms for the select input
            } catch (error) {
                console.error("===> Error adding single size: ", error);
                reject(error);
            }
        });
    }


    async function findSupplyInfoTableBody(maxRetries = 5, delay = 1000) {
        let attempt = 0;

        return new Promise((resolve, reject) => {
            const tryFindTableBody = async () => {
                moveToSupplyInfo();
                console.log(`===> Attempt ${attempt + 1} to find 【SupplyInfo】 table body`);

                const tableBody = document.querySelector('div[id="userguide_commodities_info_supply_weight_table"] .so-table-body tbody');
                if (tableBody) {
                    console.log('===> 【SupplyInfo】 Table body found!');
                    return resolve(tableBody);
                } else {
                    attempt++;
                    if (attempt >= maxRetries) {
                        console.error('===> 【SupplyInfo】 Table body not found after maximum retries!');
                        return reject(new Error('【SupplyInfo】 Table body not found after retries'));
                    } else {
                        console.warn(`Retrying to find 【SupplyInfo】 table body in ${delay}ms...`);
                        setTimeout(tryFindTableBody, delay);
                    }
                }
            };

            tryFindTableBody();
        });
    }


    // Add size detail info one by one in sequence
    async function addSizeDetailInfo(toBeAddSizes) {
        return new Promise((resolve, reject) => {
            findSupplyInfoTableBody(5, 1000)
                .then(async tableBody => {
                    console.log('===> Proceeding with table body:', tableBody);
                    const rows = tableBody.querySelectorAll('tr');
                    for (const size of toBeAddSizes) {
                        await addSingleSizeDetailInfo(size, rows); // Wait for each size detail to be added
                    }
                })
                .catch(error => {
                    console.error('===> Error:', error);
                });
            resolve();
        });
    }

    async function addSingleSizeDetailInfo(size, rows) {
        return new Promise((resolve, reject) => {
            try {
                let pollCount = 0; // Initialize poll counter
                const maxPollCount = 20; // Set maximum number of polls (20 * 500ms = 10 seconds)

                const pollForRow = setInterval(() => {
                    const sizeRow = Array.from(rows).find(row => {
                        const sizeCell = row.querySelector('td.so-table-fixed-left.so-table-fixed-last div');
                        return sizeCell && sizeCell.innerText.includes(size.searchStr);
                    });

                    if (sizeRow) {
                        clearInterval(pollForRow); // Stop polling once the row is found
                        fillNewRow(sizeRow, size); // Fill the row with the size data
                        resolve(); // Resolve the promise once the row is filled
                    } else {
                        console.log(`===> Row for size ${size.searchStr} not found, polling...`);

                        pollCount++; // Increment poll counter
                        if (pollCount >= maxPollCount) {
                            clearInterval(pollForRow); // Stop polling after reaching the limit
                            console.error(`===> Timeout: Row for size ${size.searchStr} not found after polling.`);
                            reject(new Error(`Timeout: Row for size ${size.searchStr} not found`));
                        }
                    }
                }, 500); // Poll every 500ms for the size row
            } catch (error) {
                console.error("===> Error adding size detail info: ", error);
                reject(error);
            }
        });
    }

    function inputValue(inputEle, val) {
        if (inputEle) {
            inputEle.focus();
            inputEle.value = val;
            inputEle.dispatchEvent(new Event('input', { bubbles: true }));
            inputEle.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }


    function fillNewRow(row, sizeData) {
        // Fill price
        const priceInput = row.querySelector('div[class^="supplier_priceClass"] input');
        inputValue(priceInput, sizeData.price);

        // Fill weight
        const weightInput = row.querySelector('div[class^="weightClass"] input');
        inputValue(weightInput, sizeData.weight);

        // Fill dimensions (length, width, height)
        const lengthInput = row.querySelector('div[class^="lengthClass"] input');
        const widthInput = row.querySelector('div[class^="widthClass"] input');
        const heightInput = row.querySelector('div[class^="heightClass"] input');
        if (lengthInput && widthInput && heightInput) {
            inputValue(lengthInput, sizeData.long);
            inputValue(widthInput, sizeData.width);
            inputValue(heightInput, sizeData.height);
        }

        // Select "cm" in the unit dropdown
        const unitSel = row.querySelector('.so-select-inner.so-select-drop-down');
        if (unitSel) {
            const dataId = unitSel.dataset.id;
            triggerClick(unitSel);

            // Polling mechanism to wait for the dropdown to appear and select the unit
            const pollForDropdown = setInterval(() => {
                const dropdown = document.querySelector(`.so-list-absolute-wrapper.so-select-drop-down.so-select-auto-adapt div[data-id="${dataId}"]`);
                if (dropdown) {
                    clearInterval(pollForDropdown); // Stop polling once the dropdown appears

                    const cmOption = dropdown.querySelector('.so-select-option[title="cm"]');
                    if (cmOption) {
                        console.log('===> Selecting cm');
                        triggerClick(cmOption); // Click the cm option
                    } else {
                        console.warn('cm option not found');
                    }
                } else {
                    console.log('===> Dropdown not found, polling...');
                }
            }, 500); // Poll every 500ms for the dropdown
        } else {
            console.warn('Unit selector not found');
        }
    }

    async function moveToEle(ele) {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                if (ele) {
                    ele.scrollIntoView({ behavior: 'smooth' });
                    resolve();
                } else {
                    console.error("===> Element not found!\n", ele);
                    resolve(); // Proceed anyway to avoid blocking, but log an error
                }
            });
        })
    }

    async function findSizeStockTableBody(maxRetries = 5, delay = 1000) {
        let attempt = 0;
        const ele = document.querySelector('div.so-form-item.so-form-required.stock');

        return new Promise((resolve, reject) => {
            const tryFindTableBody = async () => {
                moveToEle(ele);
                console.log(`===> Attempt ${attempt + 1} to find 【SizeStock】 table body`);

                const tableBody = ele.querySelector('div.so-form-item.so-form-required.stock .so-table-body tbody');
                if (tableBody) {
                    console.log('===> 【SizeStock】 Table body found!');
                    return resolve(tableBody);
                } else {
                    attempt++;
                    if (attempt >= maxRetries) {
                        console.error('===> 【SizeStock】 Table body not found after maximum retries!');
                        return reject(new Error('【SizeStock】 Table body not found after retries'));
                    } else {
                        console.warn(`Retrying to find 【SizeStock】 table body in ${delay}ms...`);
                        setTimeout(tryFindTableBody, delay);
                    }
                }
            };

            tryFindTableBody();
        });
    }

    async function addSizeStock(toBeAddSizes) {
        try {
            const tableBody = await findSizeStockTableBody(5, 1000); // Await table body fetch
            console.log('===> Proceeding with table body:', tableBody);

            const rows = tableBody.querySelectorAll('tr'); // Get all rows in the table

            for (const size of toBeAddSizes) {
                const sizeRow = Array.from(rows).find(row => {
                    const sizeCell = row.querySelector('td.so-table-fixed-left.so-table-fixed-last div');
                    return sizeCell && sizeCell.innerText.includes(size.searchStr);
                });

                if (sizeRow) {
                    fillStock(sizeRow, size); // Fill the row with the size data
                } else {
                    console.error(`===> Row for size ${size.searchStr} not found`);
                }
            }
        } catch (error) {
            console.error('===> Error in addSizeStock:', error);
        }
        // findSizeStockTableBody(5, 1000)
        //     .then(tableBody => {
        //         console.log('===> Proceeding with table body:', tableBody);
        //         const rows = tableBody.querySelectorAll('tr');
        //         for (const size of toBeAddSizes) {
        //             const sizeRow = Array.from(rows).find(row => {
        //                 const sizeCell = row.querySelector('td.so-table-fixed-left.so-table-fixed-last div');
        //                 return sizeCell && sizeCell.innerText.includes(size.searchStr);
        //             });

        //             if (sizeRow) {
        //                 fillStock(sizeRow, size); // Fill the row with the size data
        //             } else {
        //                 console.error(`===> Row for size ${size.searchStr} not found`);
        //             }
        //         }
        //     })
        //     .catch(error => {
        //         console.error('===> Error:', error);
        //     });
    }

    function fillStock(row, sizeData) {
        const priceInput = row.querySelector('div[class^="style__warehouseListBox"] input');
        inputValue(priceInput, sizeData.stock);
    }


    // Common button style function
    function setButtonStyle(button) {
        button.style.position = "fixed";
        button.style.bottom = "88px";
        button.style.left = "88px";
        button.style.zIndex = 1000;
        button.style.backgroundColor = "#4CAF50"; // Green background color
        button.style.color = "#fff"; // White text color
        button.style.border = "none"; // Remove border
        button.style.padding = "10px 20px"; // Larger padding for better clickability
        button.style.borderRadius = "50%"; // Rounded corners
        button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Subtle shadow for depth
        button.style.cursor = "pointer"; // Pointer cursor on hover
        button.style.fontSize = "36px"; // Slightly larger font size
        button.style.textAlign = "center"; // Center text inside the button
        button.style.transition = "background-color 0.3s, transform 0.3s"; // Smooth transition for hover effects

        // Hover effect
        button.onmouseover = function () {
            if (!button.disabled) { // Only add hover effect if the button is not disabled
                button.style.backgroundColor = "#45a049"; // Darker green on hover
                button.style.transform = "scale(1.05)"; // Slight zoom-in effect
            }
        };
        button.onmouseout = function () {
            if (!button.disabled) { // Revert to original style if not disabled
                button.style.backgroundColor = "#4CAF50";
                button.style.transform = "scale(1)";
            }
        };

        // Apply disabled style
        if (button.disabled) {
            button.style.backgroundColor = "#ddd"; // Gray background when disabled
            button.style.color = "#888"; // Lighter text color when disabled
            button.style.cursor = "not-allowed"; // Not allowed cursor for disabled button
            button.style.boxShadow = "none"; // No shadow when disabled
        }
    }


    function setButtonEnabled(button, enabled) {
        button.disabled = !enabled;
        setButtonStyle(button);
    }

})();