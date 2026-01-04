// ==UserScript==
// @name         salesDrive_Name_material
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  скрипт для salesdrive з умовною індексацією товарів, де "Дизайнерська робота над макетом" не впливає на індексацію
// @author       LanNet
// @match        https://e-oboi.salesdrive.me/ua/index.html?formId=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesdrive.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505722/salesDrive_Name_material.user.js
// @updateURL https://update.greasyfork.org/scripts/505722/salesDrive_Name_material.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateProductNames() {
        const orderElement = document.querySelector('h1.left.ng-binding.ng-scope');
        if (!orderElement) return;

        const orderText = orderElement.textContent || '';
        const orderNumberMatch = orderText.match(/\d+/);
        if (!orderNumberMatch) return;
        const orderNumber = orderNumberMatch[0];

        const items = document.querySelectorAll('tbody tr.price-to-order');
        if (items.length === 0) return;

        // Визначаємо, чи є "Подарункова Упаковка"
        let hasGiftPackaging = false;
        items.forEach(item => {
            const materialElement = item.querySelector('.link-product-field.ng-binding.ng-scope');
            if (!materialElement) return;
            const materialText = materialElement.textContent.trim().toLowerCase();
            if (materialText.includes('подарункова упаковка')) {
                hasGiftPackaging = true;
            }
        });

        // Фільтруємо елементи, що не містять небажаних слів
        const filteredItems = Array.from(items).filter(item => {
            const materialElement = item.querySelector('.link-product-field.ng-binding.ng-scope');
            const materialText = materialElement ? materialElement.textContent.toLowerCase() : '';
            return materialElement &&
                   !materialText.includes('дизайнерська робота над макетом') &&
                   !materialText.includes('захисний лак') &&
                   !materialText.includes('подарункова упаковка');
        });
        const isMultipleItems = filteredItems.length > 1;
        let itemCounter = 1;

        items.forEach(item => {
            const materialElement = item.querySelector('.link-product-field.ng-binding.ng-scope');
            if (!materialElement) return;
            const materialText = materialElement.textContent.trim().toLowerCase();

            // Пропускаємо небажані описи
            if (materialText.includes('дизайнерська робота над макетом') ||
                materialText.includes('захисний лак') ||
                materialText.includes('подарункова упаковка')) {
                return;
            }

            let generatedNameElement = item.querySelector('.generated-name');
            if (!generatedNameElement) {
                generatedNameElement = document.createElement('div');
                generatedNameElement.classList.add('generated-name');
                generatedNameElement.style.display = 'none';

                const copyButton = document.createElement('button');
                copyButton.textContent = '📋';
                copyButton.style.marginLeft = '0px';
                copyButton.style.cursor = 'pointer';
                copyButton.style.display = 'contents';

                const tooltip = document.createElement('span');
                tooltip.className = 'tooltiptext';
                tooltip.style.visibility = 'hidden';
                tooltip.style.backgroundColor = '#555';
                tooltip.style.color = '#fff';
                tooltip.style.textAlign = 'center';
                tooltip.style.borderRadius = '5px';
                tooltip.style.padding = '5px';
                tooltip.style.position = 'absolute';
                tooltip.style.zIndex = '1';
                tooltip.style.bottom = '100%';
                tooltip.style.left = '50%';
                tooltip.style.marginLeft = '-60px';
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.3s';

                const container = document.createElement('div');
                container.style.display = 'contents';
                container.style.alignItems = 'center';
                container.classList.add('tooltip');
                container.appendChild(copyButton);
                container.appendChild(generatedNameElement);
                container.appendChild(tooltip);

                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(generatedNameElement.textContent);
                    tooltip.textContent = generatedNameElement.textContent;
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    setTimeout(() => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 2000);
                });

                const materialParent = materialElement.parentNode;
                materialParent.insertBefore(container, materialElement);
            }

            updateFileName(item, orderNumber, itemCounter, isMultipleItems, hasGiftPackaging);
            itemCounter++;
        });
    }

    function updateFileName(item, orderNumber, itemCounter, isMultipleItems, hasGiftPackaging) {
        const materialElement = item.querySelector('.link-product-field.ng-binding.ng-scope');
        const descriptionElement = item.querySelector('.underline-description-label .ng-binding');
        const generatedNameElement = item.querySelector('.generated-name');
        if (!materialElement || !descriptionElement || !generatedNameElement) return;

        const materialText = materialElement.textContent.trim().toLowerCase();
        let materialFormatted = '';

        if (materialText.includes('фотокартина')) {
            materialFormatted = 'полотно';
            const regexPatterns = [
                /фотокартина\s*(\d+)\s*\/\s*(\d+)/i,
                /фотокартина\s*(\d+)\s*[xх]\s*(\d+)/i,
                /фотокартина\s*(\d+)\s*(\d+)/i,
            ];
            let width = '', height = '';
            for (const pattern of regexPatterns) {
                const match = materialText.match(pattern);
                if (match) {
                    width = match[1];
                    height = match[2];
                    break;
                }
            }
            let finalName = `${materialFormatted}_${width}х${height}`;
            if (hasGiftPackaging) {
                finalName += '_подарункова упаковка';
            }
            finalName += `_${orderNumber}`;
            if (isMultipleItems) {
                finalName += `-${itemCounter}`;
            }
            generatedNameElement.textContent = finalName;
            return;
        }

       if (materialText.includes('живопис')) {
            materialFormatted = 'Freska_fox';
        } else if (materialText.includes('безшовні') && materialText.includes('(max)')) {
            materialFormatted = 'bezshovni_MAX';
        } else if (materialText.includes('безшовні')) {
            materialFormatted = 'bezshovni';
        } else if (materialText.includes('холст')) {
            materialFormatted = 'Xolst_fox';
        } else if (materialText.includes('пісок')) {
            materialFormatted = 'Pisok_fox';
        } else if (materialText.includes('класік')) {
            materialFormatted = 'bravo-holst';
        } else if (materialText.includes('самоклеючі')) {
            materialFormatted = 'samokleuchi';
        } else if (materialText.includes('еко') && materialText.includes('гладь')) {
            materialFormatted = 'UV_Eco_Fliz';
        }

        let lacquerFormatted = '';
        if (materialText.includes('глянц')) {
            lacquerFormatted = 'Lak-glanc';
        } else if (materialText.includes('мат')) {
            lacquerFormatted = 'Lak-mat';
        } else if (materialText.includes('блестки')) {
            lacquerFormatted = 'Lak-blestki';
        }
        let finalMaterial = lacquerFormatted ? `${lacquerFormatted}_${materialFormatted}` : materialFormatted;

        const descriptionText = descriptionElement.textContent || '';
        const regexPatterns = [
            /(?:\(\s*ш\s*\)\s*(\d+)\s*х\s*\(\s*в\s*\)\s*(\d+))/i,
            /(\d+)\s*[xх]\s*(\d+)/i,
            /ширина\s*(\d+)\s*х\s*висота\s*(\d+)/i,
        ];
        let width = '', height = '';
        for (const pattern of regexPatterns) {
            const match = descriptionText.match(pattern);
            if (match) {
                width = match[1];
                height = match[2];
                break;
            }
        }
        let finalName = isMultipleItems
            ? `${orderNumber}-${itemCounter}_${finalMaterial}_${width}x${height}`
            : `${orderNumber}_${finalMaterial}_${width}x${height}`;
        generatedNameElement.textContent = finalName;

        const textarea = item.querySelector('textarea[ng-model="item.description"]');
        if (textarea) {
            textarea.addEventListener('input', () => {
                const newDescription = textarea.value;
                let newWidth = '', newHeight = '';
                for (const pattern of regexPatterns) {
                    const match = newDescription.match(pattern);
                    if (match) {
                        newWidth = match[1];
                        newHeight = match[2];
                        break;
                    }
                }
                let updatedName = isMultipleItems
                    ? `${orderNumber}-${itemCounter}_${finalMaterial}_${newWidth}x${newHeight}`
                    : `${orderNumber}_${finalMaterial}_${newWidth}x${newHeight}`;
                generatedNameElement.textContent = updatedName;
            });
        }
    }

    // Додаємо дебаунс, щоб уникнути частих викликів через MutationObserver
    let debounceTimer;
    const observer = new MutationObserver(mutations => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            generateProductNames();
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    generateProductNames();
})();

(function() {
    'use strict';

    function generateProductNames() {
        const orderRows = document.querySelectorAll('tr[ng-repeat="order in viewModel.orders track by viewModel.trackParameter(order)"]');
        orderRows.forEach(row => {
            const idElement = row.querySelector('div[attr-field-name="id"]');
            if (!idElement) return;
            let orderNumber = idElement.textContent.trim().replace(/\s+/g, '');
            const productsContainer = row.querySelector('div.products-inner');
            if (!productsContainer) return;
            if (productsContainer.dataset.processed === "true") return;

            const productDescriptions = productsContainer.innerHTML.split(/<br\s*\/?>/i);
            let hasGiftPackaging = false;
            productDescriptions.forEach(productDescription => {
                if (productDescription.trim().toLowerCase().includes('подарункова упаковка')) {
                    hasGiftPackaging = true;
                }
            });

            const filteredItems = productDescriptions.filter(pd => {
                const txt = pd.toLowerCase();
                return !txt.includes('дизайнерська робота над макетом') &&
                       !txt.includes('захисний лак') &&
                       !txt.includes('подарункова упаковка');
            });
            const isMultipleItems = filteredItems.length > 1;
            let itemCounter = 1;
            productsContainer.innerHTML = '';

            productDescriptions.forEach(productDescription => {
                const productText = productDescription.trim();
                if (productText.toLowerCase().includes('дизайнерська робота над макетом') ||
                    productText.toLowerCase().includes('захисний лак') ||
                    productText.toLowerCase().includes('подарункова упаковка')) {
                    productsContainer.insertAdjacentHTML('beforeend', `<div>${productText}</div>`);
                    return;
                }
                const finalName = updateFileName(row, productText, orderNumber, itemCounter, isMultipleItems, hasGiftPackaging);
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.marginBottom = '3px';

                const copyButton = document.createElement('button');
                copyButton.textContent = '📋';
                copyButton.style.marginRight = '3px';
                copyButton.style.cursor = 'pointer';
                copyButton.style.display = 'contents';

                const tooltip = document.createElement('span');
                tooltip.className = 'tooltiptext';
                tooltip.style.visibility = 'hidden';
                tooltip.style.backgroundColor = '#555';
                tooltip.style.color = '#fff';
                tooltip.style.textAlign = 'center';
                tooltip.style.borderRadius = '5px';
                tooltip.style.padding = '5px';
                tooltip.style.position = 'absolute';
                tooltip.style.zIndex = '1';
                tooltip.style.bottom = '100%';
                tooltip.style.left = '50%';
                tooltip.style.marginLeft = '-60px';
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.3s';

                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(finalName);
                    tooltip.textContent = finalName;
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    setTimeout(() => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 2000);
                });

                const productTextDiv = document.createElement('div');
                productTextDiv.textContent = productText;
                productTextDiv.style.display = 'contents';

                container.appendChild(copyButton);
                container.appendChild(productTextDiv);
                container.appendChild(tooltip);
                productsContainer.appendChild(container);
                itemCounter++;
            });
            productsContainer.dataset.processed = "true";
        });
    }

    function updateFileName(row, productText, orderNumber, itemCounter, isMultipleItems, hasGiftPackaging) {
        let materialFormatted = '';
        if (productText.toLowerCase().includes('фотокартина')) {
            materialFormatted = 'полотно';
            const regexPatterns = [
                /(\d+)\s*\/\s*(\d+)/i,
                /(\d+)\s*[xх]\s*(\d+)/i,
            ];
            let width = '', height = '';
            for (const pattern of regexPatterns) {
                const match = productText.match(pattern);
                if (match) {
                    width = match[1];
                    height = match[2];
                    break;
                }
            }
            let finalName = `${materialFormatted}_${width}х${height}`;
            if (hasGiftPackaging) {
                finalName += '_подарункова упаковка';
            }
            finalName += `_${orderNumber}`;
            if (isMultipleItems) {
                finalName += `-${itemCounter}`;
            }
            return finalName;
        }
         if (productText.toLowerCase().includes('живопис')) {
            materialFormatted = 'Freska_fox';
        } else if (productText.toLowerCase().includes('безшовні') && productText.toLowerCase().includes('(max)')) {
            materialFormatted = 'bezshovni_MAX';
        } else if (productText.toLowerCase().includes('безшовні')) {
            materialFormatted = 'bezshovni';
        } else if (productText.toLowerCase().includes('холст')) {
            materialFormatted = 'Xolst_fox';
        } else if (productText.toLowerCase().includes('пісок')) {
            materialFormatted = 'Pisok_fox';
        } else if (productText.toLowerCase().includes('класік')) {
            materialFormatted = 'bravo-holst';
        } else if (productText.toLowerCase().includes('самоклеючі')) {
            materialFormatted = 'samokleuchi';
        } else if (productText.toLowerCase().includes('еко') && productText.toLowerCase().includes('гладь')) {
            materialFormatted = 'UV_Eco_Fliz';
        }

        let lacquerFormatted = '';
        if (productText.toLowerCase().includes('глянц')) {
            lacquerFormatted = 'Lak-glanc';
        } else if (productText.toLowerCase().includes('мат')) {
            lacquerFormatted = 'Lak-mat';
        } else if (productText.toLowerCase().includes('блестки')) {
            lacquerFormatted = 'Lak-blestki';
        }
        let finalMaterial = lacquerFormatted ? `${lacquerFormatted}_${materialFormatted}` : materialFormatted;

        const regexPatterns = [
            /(?:\(\s*ш\s*\)\s*(\d+)\s*х\s*\(\s*в\s*\)\s*(\d+))/i,
            /(\d+)\s*[xх]\s*(\d+)/i,
            /ширина\s*(\d+)\s*х\s*висота\s*(\d+)/i,
        ];
        let width = '', height = '';
        for (const pattern of regexPatterns) {
            const match = productText.match(pattern);
            if (match) {
                width = match[1];
                height = match[2];
                break;
            }
        }
        return isMultipleItems
            ? `${orderNumber}-${itemCounter}_${finalMaterial}_${width}x${height}`
            : `${orderNumber}_${finalMaterial}_${width}x${height}`;
    }

    let debounceTimer;
    const observer = new MutationObserver(mutations => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            generateProductNames();
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    generateProductNames();
})();
