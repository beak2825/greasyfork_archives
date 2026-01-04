// ==UserScript==
// @name         SHEIN FORM AUTO FILL V2
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Auto-fill script for SHEIN
// @author       Henry
// @match        https://sso.geiwohuo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geiwohuo.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508410/SHEIN%20FORM%20AUTO%20FILL%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/508410/SHEIN%20FORM%20AUTO%20FILL%20V2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`#kd-fieldset{position:fixed;bottom:160px;left:125px;display:block;flex-direction:column;align-items:center;z-index:1000}
        .kd-sel-label{font-size:20px;display:block;margin-bottom:6px;}.kd-sel-label:last-of-type{margin-bottom:0;}`);

    const listURL = "https://sso.geiwohuo.com/#/spmp/commdities/list";
    const editURL = "https://sso.geiwohuo.com/#/spmp/commoditiesInfo/edit";
    const sizeJsonURL = "file://C:/shein/size.json";
    const currentURL = window.location.href;

    let sizeGroup1 = [];
    let sizeGroup2 = [];
    let sizeGroup3 = [];
    let sizeGroup4 = [];
    let sizeGroup5 = [];
    let sizeGroup6 = [];

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (currentURL.startsWith(listURL)) {
                // document.body.appendChild(btnStart);
            } else if (currentURL.startsWith(editURL)) {
                getLatestSizeGroupInfo();
                document.body.appendChild(btnAdd);
            }
        }, 1500);
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

    btnAdd.onclick = async function autoFill() {
        try {
            await getLatestSizeGroupInfo();

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


    function updateOptions(sizeDataJson) {
        const fieldsetExit = document.getElementById('kd-fieldset');
        if (fieldsetExit) {
            fieldsetExit.parentNode.removeChild(fieldsetExit);
        }

        const fieldset = document.createElement('fieldset');
        fieldset.id = 'kd-fieldset';

        for (const key in sizeDataJson) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'kd-options';
            input.value = key;
            input.id = `kd_option_${key}`;
            if (key === getCurrSelKey(sizeDataJson)) {
                input.checked = true;
            }

            const label = document.createElement('label');
            label.htmlFor = `kd_option_${key}`;
            label.textContent = key;
            label.className = 'kd-sel-label';

            fieldset.appendChild(input);
            fieldset.appendChild(label);
        }

        document.body.appendChild(fieldset);

        const options = document.getElementsByName('kd-options');
        for (const option of options) {
            option.addEventListener('change', () => {
                console.log(`===> 当前 size 组: ${option.value}`);
                GM_setValue('A_KD_SelectedSizeGroup', option.value);
                getLatestSizeGroupInfo();
            });
        }
    }


    function getCurrSelKey(sizeDataJson) {
        let val = GM_getValue('A_KD_SelectedSizeGroup');
        if (!val) {
            val = Object.keys(sizeDataJson)[0];
            GM_setValue('A_KD_SelectedSizeGroup', val);
            console.log("===> curr selVal: ", val);
        }
        return val;
    }

    async function getLatestSizeGroupInfo() {
        return new Promise(async resolve => {
            // Size info get from json file
            const sizeDataJson = await getJsonFromFile(sizeJsonURL);
            console.log("===> sizeDataJson: ", sizeDataJson)
            if (!sizeDataJson) {
                console.log('===> check json file!!!');
            }

            updateOptions(sizeDataJson);

            sizeGroup1 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup1;
            sizeGroup2 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup2;
            sizeGroup3 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup3;
            sizeGroup4 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup4;
            sizeGroup5 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup5;
            sizeGroup6 = sizeDataJson[getCurrSelKey(sizeDataJson)].sizeGroup6;
            console.log('===> curr size group: ', sizeGroup1, sizeGroup2, sizeGroup3, sizeGroup4, sizeGroup5, sizeGroup6);

            resolve();
        });
    }

    // Fetch JSON from file
    async function getJsonFromFile(url) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "post",
                responseType: 'arraybuffer',
                url: url,
                headers: { "Content-Type": "text/json,charset=utf-8" },
                onload: data => resolve(JSON.parse(new TextDecoder().decode(data.response))),
                onerror: error => resolve(error)
            });
        });
    }

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
            // const event = new MouseEvent("click", {
            //     bubbles: true,
            //     cancelable: true,
            //     view: window,
            // });
            // element.dispatchEvent(event);
            element.click();
        }
    }

    // Get sizes that need to be added
    function getToBeAddSizes(exitSizes) {
        const sizeGroupSizeStr1 = sizeGroup1.map(item => item.str).join(',');
        const sizeGroupSizeStr2 = sizeGroup2.map(item => item.str).join(',');
        const sizeGroupSizeStr3 = sizeGroup3.map(item => item.str).join(',');
        const sizeGroupSizeStr4 = sizeGroup4.map(item => item.str).join(',');
        const sizeGroupSizeStr5 = sizeGroup5.map(item => item.str).join(',');
        const sizeGroupSizeStr6 = sizeGroup6.map(item => item.str).join(',');

        let filteredSizes = [];
        const exitSizesStr = exitSizes.join(',');
        console.log('===> exitSizesStr: ', exitSizesStr);

        if (sizeGroupSizeStr1.includes(exitSizes[0])) {
            filteredSizes = sizeGroup1.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr2.includes(exitSizes[0])) {
            filteredSizes = sizeGroup2.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr3.includes(exitSizes[0])) {
            filteredSizes = sizeGroup3.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr4.includes(exitSizes[0])) {
            filteredSizes = sizeGroup4.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr5.includes(exitSizes[0])) {
            filteredSizes = sizeGroup5.filter(size => !exitSizesStr.includes(size.searchStr));
        } else if (sizeGroupSizeStr6.includes(exitSizes[0])) {
            filteredSizes = sizeGroup6.filter(size => !exitSizesStr.includes(size.searchStr));
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
                        dropdownTrigger;
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