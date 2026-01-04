// ==UserScript==
// @name         Dodo Product Collector
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Автоматический сбор информации о продуктах из административной панели Dodo Pizza с обработкой по частям для избежания ошибок памяти.
// @author       You
// @match        https://dodopizza.design-terminal.io/admin/products*
// @match        https://dodopizza.design-terminal.io/admin/products/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538913/Dodo%20Product%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/538913/Dodo%20Product%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Глобальная конфигурация и переменные состояния
    const CONFIG = {
        productPageUrlBase: 'https://dodopizza.design-terminal.io/admin/products/',
        debug: true, // Включить/выключить подробные логи
    };

    const collectedData = []; // Массив для хранения данных о продуктах

    // --- Начало служебных функций ---
    function log(message) {
        if (CONFIG.debug) {
            console.log('[DodoProductCollector]', message);
        }
    }

    function escapeCSVField(field) {
        if (field === null || typeof field === 'undefined') {
            return '""';
        }
        const stringField = String(field);
        // Экранируем двойные кавычки и оборачиваем поле в двойные кавычки
        return '"' + stringField.replace(/"/g, '""') + '"';
    }

    function formatFullDataToCSV() {
        // Add header row
        const header = '"Name","ID","Parent ID","Entities"';
        const rows = collectedData.map(product => {
            const name = escapeCSVField(product.name);
            const id = escapeCSVField(product.id);
            const parentId = escapeCSVField(product.parentId);
            const entities = escapeCSVField(product.entities.join('\n'));
            return `${name},${id},${parentId},${entities}`;
        });
        return [header, ...rows].join('\r\n');
    }

    function formatDataToCSV() { // This function is now an alias for the full format
        return formatFullDataToCSV();
    }

    function formatSimpleDataToCSV(data) {
        // Add header row
        const header = '"Name","ID","Parent ID"';
        const rows = data.map(product => {
            const name = escapeCSVField(product.name);
            const id = escapeCSVField(product.id);
            const parentId = escapeCSVField(product.parentId);
            return `${name},${id},${parentId}`;
        });
        return [header, ...rows].join('\r\n');
    }

    function handleOutputData(text) {
        // 1. Копирование в буфер обмена (существующая функциональность)
        GM_setClipboard(text);
        alert('Data copied to clipboard and offered for download!');
        log('Data copied and offered for download: \n' + text);

        // 2. Создание и загрузка CSV файла
        try {
            const blob = new Blob(["\uFEFF" + text], { type: 'text/csv;charset=utf-8;' }); // \uFEFF (BOM) для лучшей совместимости с Excel
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            link.download = `dodo_products_${year}-${month}-${day}_${hours}-${minutes}.csv`;

            document.body.appendChild(link); // Необходимо для Firefox
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            log('CSV file successfully offered for download.');
        } catch (e) {
            log('Error creating CSV file for download: ' + e);
            alert('An error occurred while trying to create the download file.');
        }
    }

    // --- Конец служебных функций ---


    // --- Начало основной логики ---

    function extractProductDataFromPage(doc = document) {
        log('Extracting data from product page...');
        let productName = null;
        let productId = null;
        let parentId = null;
        const entities = [];

        // 1. Имя (Name)
        const nameLabel = Array.from(doc.querySelectorAll('label')).find(label => label.textContent.trim() === 'Name');
        if (nameLabel && nameLabel.nextSibling && nameLabel.nextSibling.nodeType === Node.TEXT_NODE) {
            productName = nameLabel.nextSibling.textContent.trim();
            log('Name found: ' + productName);
        } else if (nameLabel && nameLabel.parentElement && nameLabel.parentElement.childNodes.length > 1) {
            for (let i = 0; i < nameLabel.parentElement.childNodes.length; i++) {
                if (nameLabel.parentElement.childNodes[i] === nameLabel) {
                    if (nameLabel.parentElement.childNodes[i+1] && nameLabel.parentElement.childNodes[i+1].tagName === 'BR' && nameLabel.parentElement.childNodes[i+2] && nameLabel.parentElement.childNodes[i+2].nodeType === Node.TEXT_NODE) {
                         productName = nameLabel.parentElement.childNodes[i+2].textContent.trim();
                         log('Name found (via BR): ' + productName);
                         break;
                    }
                }
            }
        }
         if (!productName) log('Name not found.');


        // 2. ID Продукта (ID)
        const idLabel = Array.from(doc.querySelectorAll('label')).find(label => label.textContent.trim() === 'ID');
        if (idLabel) {
            let nextElement = idLabel.nextElementSibling;
            if (nextElement && nextElement.tagName === 'BR') {
                nextElement = nextElement.nextElementSibling;
            }
            if (nextElement && nextElement.tagName === 'CODE') {
                productId = nextElement.textContent.trim();
                log('ID found: ' + productId);
            } else {
                 log('<code> tag for ID not found near label.');
            }
        }
        if (!productId) log('ID not found.');


        // 2.1. Parent ID
        const parentIdLabel = Array.from(doc.querySelectorAll('label')).find(label => label.textContent.trim() === 'Parent ID');
        if (parentIdLabel) {
            let nextElement = parentIdLabel.nextElementSibling;
            if (nextElement && nextElement.tagName === 'BR') {
                nextElement = nextElement.nextElementSibling;
            }
            if (nextElement && nextElement.tagName === 'CODE') {
                parentId = nextElement.textContent.trim();
                log('Parent ID found: ' + parentId);
            } else {
                 log('<code> tag for Parent ID not found near label.');
            }
        }
        if (!parentId) log('Parent ID not found.');


        // 3. Сущности (Entities) - из секции "As value source for"
        const sectionTitleElement = Array.from(doc.querySelectorAll('h2.section__headline span'))
            .find(span => span.textContent.trim() === 'As value source for');

        if (sectionTitleElement) {
            const section = sectionTitleElement.closest('section.section');
            if (section) {
                const links = section.querySelectorAll('table tbody tr td:nth-child(3) a.link');
                links.forEach(link => {
                    entities.push(link.textContent.trim());
                });
                log('Entities found: ' + entities.join(', '));
            } else {
                log('Section "As value source for" not found.');
            }
        } else {
            log('Section header "As value source for" not found.');
        }

        if (productName && productId) {
             return {
                name: productName,
                id: productId,
                parentId: parentId,
                entities: entities
            };
        } else {
            log('Could not extract product name or ID. Data will not be saved.');
            return null;
        }
    }

    async function processProductPage(productUrl) {
        log('Processing product page (iframe method): ' + productUrl);
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none'; // Скрытый iframe

            function cleanup() {
                try {
                    iframe.src = 'about:blank';
                } catch(e) { /* ignore */ }
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 50);
            }

            let timeoutHandle = setTimeout(() => {
                cleanup();
                reject('General iframe load timeout for ' + productUrl);
            }, 30000);

            iframe.onload = function() {
                log('Iframe loaded for: ' + productUrl);
                clearTimeout(timeoutHandle);

                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc) {
                        throw new Error('Failed to get document from iframe');
                    }

                    // Ждем появления ключевых элементов
                    let attempts = 0;
                    const maxAttempts = 40; // Ждать до 20 секунд
                    const intervalId = setInterval(() => {
                        attempts++;
                        const nameLabel = Array.from(iframeDoc.querySelectorAll('label')).find(label => label.textContent.trim() === 'Name');
                        const idLabel = Array.from(iframeDoc.querySelectorAll('label')).find(label => label.textContent.trim() === 'ID');

                        if (nameLabel || idLabel || attempts >= maxAttempts) {
                            clearInterval(intervalId);
                             if (nameLabel || idLabel) {
                                 const productData = extractProductDataFromPage(iframeDoc);
                                 resolve(productData);
                             } else {
                                reject('Timeout waiting for content in iframe for ' + productUrl);
                            }
                            cleanup();
                        }
                    }, 500);

                } catch (e) {
                    cleanup();
                    reject('Error accessing iframe: ' + e);
                }
            };

            iframe.onerror = function() {
                clearTimeout(timeoutHandle);
                cleanup();
                reject('Error loading iframe for ' + productUrl);
            };

            document.body.appendChild(iframe);
            iframe.src = productUrl; // Запускаем загрузку
        });
    }

    // --- ИЗМЕНЕНИЕ: Функция переписана для последовательной обработки с паузами, чтобы избежать падений по памяти ---
    function collectAllProductData(productLinks) {
        return new Promise((resolve) => {
            const allProductData = [];
            const collectButton = document.getElementById('fullCollectBtn');
            let i = 0;

            function processNextProduct() {
                // Условие выхода из рекурсии
                if (i >= productLinks.length) {
                    log('Data collection finished. Collected ' + allProductData.length + ' records.');
                    collectedData.length = 0; // Очищаем перед добавлением новых
                    collectedData.push(...allProductData);
                    if (collectedData.length > 0) {
                        const csvData = formatFullDataToCSV();
                        handleOutputData(csvData);
                    } else {
                        alert('Failed to collect data for any product.');
                    }
                    resolve(); // Завершаем Promise
                    return;
                }

                const link = productLinks[i];
                if (collectButton) {
                    collectButton.textContent = `Collecting... (${i + 1}/${productLinks.length})`;
                }

                // Обрабатываем один продукт
                processProductPage(link)
                    .then(productData => {
                        if (productData) {
                            allProductData.push(productData);
                        }
                    })
                    .catch(error => {
                        log('Error processing product ' + link + ': ' + error);
                        // Не останавливаем весь процесс из-за одной ошибки
                    })
                    .finally(() => {
                        i++;
                        // Вызываем следующую итерацию через setTimeout, чтобы дать браузеру "передышку"
                        setTimeout(processNextProduct, 150); // Пауза в 150 мс
                    });
            }

            processNextProduct(); // Запускаем первую итерацию
        });
    }

    // --- Конец функций для первой кнопки ---


    // --- Новая функция для сбора URL всех страниц ---
    async function getAllPageUrls() {
        const paginationContainer = document.querySelector('p.pagination');
        if (!paginationContainer) {
            log('Pagination not found. Assuming single page.');
            return [window.location.href];
        }

        const pageSelector = paginationContainer.querySelector('select');
        const lastPageLink = paginationContainer.querySelector('a:last-of-type');
        let totalPages = 1;

        if (pageSelector && pageSelector.options.length > 0) {
            totalPages = pageSelector.options.length;
            log(`Found ${totalPages} pages in pagination selector.`);
        } else if (lastPageLink) {
             // Fallback if selector is not present, try to deduce from links
             const url = new URL(lastPageLink.href);
             const pageParam = parseInt(url.searchParams.get('page'), 10);
             if (!isNaN(pageParam)) {
                // Assuming the last link is 'Next', so total pages might be pageParam or more.
                // This is less reliable. For now, let's assume the selector is the primary source.
                // A more robust solution would be needed if the selector is often missing.
                totalPages = pageParam; // A guess
                log(`Deduced ${totalPages} pages from last link (less reliable).`);
             }
        }

        const urls = [];
        const baseUrl = new URL(window.location.href);

        for (let i = 1; i <= totalPages; i++) {
            baseUrl.searchParams.set('page', i);
            urls.push(baseUrl.href);
        }

        log(`Generated ${urls.length} page URLs to process.`);
        return urls;
    }


    function addCollectButtonAfterTitle(titleElement) {
        log('Element .main-layout__title-text found. Adding button...');
        let collectButton = document.getElementById('dodoCollectDataBtn');
        if (!collectButton) {
            collectButton = document.createElement('button');
            collectButton.id = 'dodoCollectDataBtn';
            collectButton.textContent = 'Collect Full Product Data (incl. Entities)';
            // Убираем стили для фиксированного позиционирования
            // collectButton.style.position = 'fixed';
            // collectButton.style.top = '10px';
            // collectButton.style.right = '10px';
            // collectButton.style.zIndex = '9999';

            // Добавляем базовые стили, чтобы кнопка была заметна
            // collectButton.style.padding = '8px 12px';
            // collectButton.style.backgroundColor = '#ff6900';
            // collectButton.style.color = 'white';
            // collectButton.style.border = 'none';
            // collectButton.style.borderRadius = '5px';
            // collectButton.style.cursor = 'pointer';
            collectButton.style.marginLeft = '10px'; // Небольшой отступ от заголовка
            collectButton.style.verticalAlign = 'bottom';

            // Вставляем кнопку после элемента titleElement
            if (titleElement.parentNode) {
                titleElement.parentNode.insertBefore(collectButton, titleElement.nextSibling);
            } else {
                // Резервный вариант, если у titleElement нет родителя (маловероятно)
                document.body.appendChild(collectButton);
                log('Fallback: Collect button added to body as titleElement had no parent.');
            }

            collectButton.onclick = async function() {
                alert('Data collection is starting. This may take some time, especially on multiple pages. Please do not close this tab.');
                collectedData.length = 0;
                collectButton.disabled = true;

                const allPagesUrls = await getAllPageUrls();
                const allProductLinks = [];

                for (let i = 0; i < allPagesUrls.length; i++) {
                    const pageUrl = allPagesUrls[i];
                    log(`Processing page ${i + 1}/${allPagesUrls.length}: ${pageUrl}`);
                    collectButton.textContent = `Scanning pages... (${i + 1}/${allPagesUrls.length})`;

                    try {
                         const response = await fetch(pageUrl);
                         const text = await response.text();
                         const parser = new DOMParser();
                         const doc = parser.parseFromString(text, 'text/html');

                         const potentialLinks = doc.querySelectorAll('a[href*="/admin/products/"]');
                         const productLinkRegex = /^\/admin\/products\/([a-zA-Z0-9_.-]+)$/;

                         potentialLinks.forEach(a => {
                             const href = a.getAttribute('href');
                             if (href) {
                                 const match = href.match(productLinkRegex);
                                 if (match && match[1] !== 'create') {
                                     const fullUrl = new URL(href, window.location.origin).href;
                                     if (!allProductLinks.includes(fullUrl)) {
                                         allProductLinks.push(fullUrl);
                                     }
                                 }
                             }
                         });
                         log(`Found ${allProductLinks.length} unique product links so far.`);
                    } catch (error) {
                        log(`Error fetching or parsing page ${pageUrl}: ${error}`);
                        alert(`An error occurred while processing page ${i + 1}. Please check the console for details.`);
                    }
                }

                log('Found a total of ' + allProductLinks.length + ' product links across all pages.');

                if (allProductLinks.length > 0) {
                    await collectAllProductData(allProductLinks);
                } else {
                    alert('No product page links found on any page.');
                    log('Product links not found.');
                    collectButton.disabled = false;
                    collectButton.textContent = 'Collect Full Product Data (incl. Entities)';
                }
            };
            log('Button "Collect Full Product Data (incl. Entities)" added/updated after title.');
        } else {
             log('Button "Collect Full Product Data (incl. Entities)" already exists.');
             // Если кнопка уже есть, но была создана другим способом (например, старая версия скрипта),
             // можно ее переместить или обновить стили. Пока просто логируем.
        }
    }

    // --- Функции для второй кнопки (копирование только Name и ID) ---
    function addMinimalCopyButton(titleElement) {
        const buttonId = 'quickCollectBtn';

        // Если кнопка уже существует, ничего не делаем, чтобы разорвать цикл перерисовки.
        if (document.getElementById(buttonId)) {
            return;
        }
        log(`Button "${buttonId}" is missing, creating it.`);

        const button = document.createElement('button');
        button.textContent = 'Quick Collect (Name, ID, Parent ID) from All Pages';
        button.id = buttonId;
        button.style.marginLeft = '10px';
        button.style.verticalAlign = 'bottom';

        button.onclick = collectAllPagesSimpleData;

        if (titleElement.parentNode) {
            titleElement.parentNode.insertBefore(button, titleElement.nextSibling);
        } else {
            document.body.appendChild(button);
            log('Fallback: "Quick Collect" button added to body.');
        }
        log('Button "Quick Collect" added.');
    }

    function scrapeTableDataFromDoc(doc) {
        const table = doc.querySelector('.admin-products-view__products-table');
        if (!table) {
            log('Table .admin-products-view__products-table not found on the processed page.');
            return [];
        }

        const headerCells = Array.from(table.querySelectorAll('thead th'));
        const columnIndexes = {};
        headerCells.forEach((th, i) => {
            const text = th.innerText.trim().toLowerCase();
            if (text.includes('name')) columnIndexes.name = i;
            else if (text === 'id') columnIndexes.id = i;
            else if (text === 'parent id') columnIndexes.parentId = i;
        });

        if (typeof columnIndexes.name === 'undefined' || typeof columnIndexes.id === 'undefined') {
            log('Could not identify Name and/or ID columns on the processed page.');
            return [];
        }

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const data = [];

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) continue;

            const name = cells[columnIndexes.name]?.innerText.trim() || '';
            const id = cells[columnIndexes.id]?.innerText.trim() || '';
            const parentId = typeof columnIndexes.parentId !== 'undefined' ? (cells[columnIndexes.parentId]?.innerText.trim() || '') : '';
            const linkElement = cells[columnIndexes.name]?.querySelector('a[href*="/admin/products/"]');
            const url = linkElement ? new URL(linkElement.getAttribute('href'), window.location.origin).href : '';

            data.push({ name, id, parentId, url, entities: [] }); // Добавляем URL и пустой массив для entities
        }
        return data;
    }


    async function processListPageInIframe(pageUrl) {
        log('Processing list page in iframe: ' + pageUrl);
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';

            function cleanup() {
                try {
                    iframe.src = 'about:blank';
                } catch(e) { /* ignore */ }
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 50);
            }

            const timeoutHandle = setTimeout(() => {
                cleanup();
                reject(`Timeout loading iframe for ${pageUrl}`);
            }, 30000); // 30-second timeout

            iframe.onload = () => {
                log(`Iframe loaded for: ${pageUrl}`);
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (!iframeDoc) {
                        throw new Error('Could not get iframe document.');
                    }

                    // Wait for the table to appear
                    let attempts = 0;
                    const maxAttempts = 40; // 20 seconds
                    const intervalId = setInterval(() => {
                        attempts++;
                        const table = iframeDoc.querySelector('.admin-products-view__products-table');

                        if (table || attempts >= maxAttempts) {
                            clearInterval(intervalId);
                            if (table) {
                                log('Table found in iframe.');
                                const productData = scrapeTableDataFromDoc(iframeDoc);
                                resolve(productData);
                            } else {
                                log('Timeout waiting for table in iframe.');
                                resolve([]);
                            }
                            clearTimeout(timeoutHandle);
                            cleanup();
                        }
                    }, 500);

                } catch (e) {
                    clearTimeout(timeoutHandle);
                    cleanup();
                    reject(`Error processing iframe content for ${pageUrl}: ${e}`);
                }
            };

            iframe.onerror = () => {
                clearTimeout(timeoutHandle);
                cleanup();
                reject(`Error loading iframe for ${pageUrl}`);
            };

            document.body.appendChild(iframe);
            iframe.src = pageUrl;
        });
    }

    async function collectAllPagesSimpleData() {
        log('Starting simple data collection from all pages.');
        const collectButton = document.getElementById('copyMinimalProductDataBtn');

        const pageUrls = await getAllPageUrls();
        if (pageUrls.length === 0) {
            alert('Could not determine pages to process.');
            return;
        }

        alert(`Starting data collection from ${pageUrls.length} pages. This may take some time. The collected data will be downloaded as a CSV file at the end.`);

        const collectedProducts = [];
        if(collectButton) collectButton.disabled = true;

        for (let i = 0; i < pageUrls.length; i++) {
            const pageUrl = pageUrls[i];
            log(`Processing page ${i + 1}/${pageUrls.length}: ${pageUrl}`);
            if(collectButton) collectButton.textContent = `Scanning pages... (${i + 1}/${pageUrls.length})`;

            try {
                const pageData = await processListPageInIframe(pageUrl);

                if (pageData.length > 0) {
                    collectedProducts.push(...pageData);
                }
                log(`Found ${pageData.length} products on this page. Total so far: ${collectedProducts.length}.`);

            } catch (error) {
                log(`Error fetching or parsing page ${pageUrl}: ${error}`);
                alert(`An error occurred while processing page ${i + 1}. Please check the console for details.`);
                // Break the loop on error to prevent further issues
                break;
            }
        }

        log(`Finished scanning. Found a total of ${collectedProducts.length} products.`);

        if (collectedProducts.length > 0) {
            const csvData = formatSimpleDataToCSV(collectedProducts);
            handleOutputData(csvData);
        } else {
            alert('No products found on any page.');
        }

        if(collectButton) {
            collectButton.disabled = false;
            collectButton.textContent = 'Collect All Products (Name, ID, Parent ID)';
        }
    }

    // --- Конец функций для второй кнопки ---


    // --- Функции для ТРЕТЬЕЙ кнопки (ПОЛНЫЙ сбор) ---
    function addFullCollectButton(titleElement) {
        const buttonId = 'fullCollectBtn';

        // Если кнопка уже существует, ничего не делаем, чтобы разорвать цикл перерисовки.
        if (document.getElementById(buttonId)) {
            return;
        }
        log(`Button "${buttonId}" is missing, creating it.`);

        const button = document.createElement('button');
        button.textContent = 'Full Collect from All Pages (incl. Entities)';
        button.id = buttonId;
        button.style.marginLeft = '10px';
        button.style.backgroundColor = '#28a745'; // Зеленый цвет для отличия
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '4px 8px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.verticalAlign = 'bottom';

        button.onclick = collectAllProductsFullData;

        // Вставляем ее после второй кнопки
        const quickButton = document.getElementById('quickCollectBtn');
        if (quickButton && quickButton.parentNode) {
            quickButton.parentNode.insertBefore(button, quickButton.nextSibling);
        } else if (titleElement.parentNode) {
            titleElement.parentNode.insertBefore(button, titleElement.nextSibling);
        } else {
            document.body.appendChild(button);
            log('Fallback: "Full Collect" button added to body.');
        }
        log('Button "Full Collect" added.');
    }

    // --- ИЗМЕНЕНИЕ: Полностью переписанная функция для двухэтапного сбора ---
    async function collectAllProductsFullData() {
        log('Starting NEW 2-STAGE FULL data collection run.');

        // Очистка старых данных на случай, если предыдущий запуск был прерван
        localStorage.removeItem('dodoCollectorState');

        const fullCollectBtn = document.getElementById('fullCollectBtn');
        if(fullCollectBtn) fullCollectBtn.disabled = true;

        alert('Starting FULL data collection.\n\nStage 1: Quickly collecting basic data from all list pages. The page will reload after this stage.');

        // --- ЭТАП 1: Быстрый сбор базовых данных со всех страниц ---
        let allProducts = [];
        const pageUrls = await getAllPageUrls();

        for (let i = 0; i < pageUrls.length; i++) {
            const pageUrl = pageUrls[i];
            if(fullCollectBtn) fullCollectBtn.textContent = `Stage 1: Scanning Pages... (${i + 1}/${pageUrls.length})`;

            try {
                const pageData = await processListPageInIframe(pageUrl);
                if (pageData) {
                    allProducts.push(...pageData);
                }
            } catch (error) {
                log(`Error processing product list page ${pageUrl}: ${error}`);
                alert('An error occurred during Stage 1. The process will stop. Check console for details.');
                if(fullCollectBtn) {
                    fullCollectBtn.disabled = false;
                    fullCollectBtn.textContent = 'Full Collect from All Pages (incl. Entities)';
                }
                return;
            }
        }
        log(`Stage 1 finished. Found ${allProducts.length} products. Saving state and reloading.`);

        // Сохраняем состояние и перезагружаем страницу для начала Этапа 2
        const state = {
            inProgress: true,
            currentChunkIndex: 0,
            allProducts: allProducts,
            totalProducts: allProducts.length
        };
        localStorage.setItem('dodoCollectorState', JSON.stringify(state));

        // Добавляем небольшую задержку, чтобы гарантировать запись в localStorage перед перезагрузкой
        setTimeout(() => window.location.reload(), 200);
    }

    async function continueFullCollection() {
        const fullCollectBtn = document.getElementById('fullCollectBtn');
        let state;
        try {
            state = JSON.parse(localStorage.getItem('dodoCollectorState'));
        } catch (e) {
            log('Could not parse state from localStorage.');
            if (fullCollectBtn) fullCollectBtn.disabled = false;
            return;
        }

        if (!state || !state.inProgress) {
            log('No collection in progress.');
            if (fullCollectBtn) fullCollectBtn.disabled = false;
            return;
        }

        // Немедленно обновляем UI, чтобы показать, что процесс продолжается
        if (fullCollectBtn) {
            fullCollectBtn.disabled = true;
            fullCollectBtn.textContent = `Resuming...`;
        }

        const CHUNK_SIZE = 10; // ИЗМЕНЕНО: Уменьшаем размер чанка для большей стабильности
        const { currentChunkIndex, allProducts, totalProducts } = state;
        const startIndex = currentChunkIndex * CHUNK_SIZE;

        if (startIndex >= totalProducts) {
            log('All chunks processed. Finalizing.');

            // Удаляем старые кнопки, чтобы не мешались
            const quickBtn = document.getElementById('quickCollectBtn');
            if(quickBtn) quickBtn.remove();
            // Используем уже объявленную переменную fullCollectBtn
            if(fullCollectBtn) fullCollectBtn.remove();

            // Создаем новую, заметную кнопку для скачивания
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '✅ Download Result';
            downloadBtn.style.position = 'fixed';
            downloadBtn.style.top = '10px';
            downloadBtn.style.right = '10px';
            downloadBtn.style.zIndex = '9999';
            downloadBtn.style.padding = '10px 20px';
            downloadBtn.style.fontSize = '16px';
            downloadBtn.style.backgroundColor = '#ffc107'; // Желтый
            downloadBtn.style.color = 'black';
            downloadBtn.style.border = '1px solid black';
            downloadBtn.style.borderRadius = '5px';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

            downloadBtn.onclick = () => {
                collectedData.length = 0;
                collectedData.push(...allProducts);
                if (collectedData.length > 0) {
                    const csvData = formatFullDataToCSV();
                    handleOutputData(csvData);
                } else {
                    alert('No product data could be collected.');
                }
                localStorage.removeItem('dodoCollectorState');
                // После клика убираем кнопку скачивания и перезагружаем, чтобы вернуть исходные кнопки
                downloadBtn.remove();
                window.location.reload();
            };

            document.body.appendChild(downloadBtn);

            alert('Collection finished! A yellow "Download Result" button has appeared in the top-right corner. Click it to get your file.');
            return;
        }

        // --- ОБРАБОТКА ОЧЕРЕДНОГО ЧАНКА ---
        const endIndex = Math.min(startIndex + CHUNK_SIZE, totalProducts);
        const currentChunk = allProducts.slice(startIndex, endIndex);

        // Используем уже объявленную переменную fullCollectBtn
        if (fullCollectBtn) {
            fullCollectBtn.disabled = true;
            fullCollectBtn.textContent = `Stage 2: Enriching... (${startIndex + 1}-${endIndex}/${totalProducts})`;
        }

        for (let i = 0; i < currentChunk.length; i++) {
            const product = currentChunk[i];
            if(fullCollectBtn) fullCollectBtn.textContent = `Stage 2: Enriching... (${startIndex + i + 1}/${totalProducts})`;

            if (!product.url) {
                log(`Skipping product "${product.name}" because it has no URL.`);
                continue;
            }

            try {
                const productPageData = await processProductPage(product.url);
                if (productPageData && productPageData.entities) {
                    // Обновляем оригинальный объект в allProducts
                    allProducts[startIndex + i].entities = productPageData.entities;
                }
                await new Promise(resolve => setTimeout(resolve, 200)); // Пауза
            } catch (error) {
                log(`Error enriching product "${product.name}" (${product.url}): ${error}`);
            }
        }

        // Сохраняем обновленное состояние и готовимся к следующей перезагрузке
        state.currentChunkIndex = currentChunkIndex + 1;
        state.allProducts = allProducts; // Сохраняем обновленный массив
        localStorage.setItem('dodoCollectorState', JSON.stringify(state));

        log(`Chunk ${currentChunkIndex + 1} processed. Reloading for next chunk.`);
        // Добавляем небольшую задержку, чтобы гарантировать запись в localStorage перед перезагрузкой
        setTimeout(() => window.location.reload(), 200);
    }


    // --- Конец функций для третьей кнопки ---


    function handleProductListPage() {
        log('Product list page detected. Using MutationObserver to ensure buttons are present.');

        let continuationChecked = false;

        const observer = new MutationObserver(() => {
            const titleElement = document.querySelector(".main-layout__title-text");

            if (titleElement) {
                // Кнопки добавляются идемпотентно (проверяют и удаляют себя внутри)
                addMinimalCopyButton(titleElement);
                addFullCollectButton(titleElement);

                // Логику продолжения сбора выполняем только один раз
                if (!continuationChecked) {
                    continuationChecked = true;
                    // Даем кнопкам мгновение, чтобы появиться в DOM перед проверкой
                    setTimeout(continueFullCollection, 100);
                }
            }
        });

        // Начинаем следить за изменениями во всем body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Новая функция для немедленного добавления кнопки на страницу продукта
    function addProductDetailButtonIfMissing() {
        if (!document.getElementById('dodoCollectSingleBtn')) {
            log('Adding button "Collect Data from This Page" to product page.');
            const collectSingleButton = document.createElement('button');
            collectSingleButton.id = 'dodoCollectSingleBtn';
            collectSingleButton.textContent = 'Collect Data from This Page';
            collectSingleButton.style.position = 'fixed';
            collectSingleButton.style.top = '50px';
            collectSingleButton.style.right = '10px';
            collectSingleButton.style.zIndex = '9998';
            collectSingleButton.style.padding = '8px';
            collectSingleButton.style.backgroundColor = '#007bff';
            collectSingleButton.style.color = 'white';
            collectSingleButton.style.border = 'none';
            collectSingleButton.style.borderRadius = '5px';
            collectSingleButton.style.cursor = 'pointer';
            document.body.appendChild(collectSingleButton);

            collectSingleButton.onclick = function() {
                const productData = extractProductDataFromPage(document);
                if (productData) {
                    collectedData.length = 0;
                    collectedData.push(productData);
                    const csvData = formatFullDataToCSV();
                    handleOutputData(csvData);
                } else {
                    alert('Failed to extract data from the current page. The page may not have fully loaded yet.');
                }
            };
            log('Button "Collect Data from This Page" added.');
        }
    }

    log('Dodo Product Collector script started.');

    function main() {
        const currentPath = window.location.pathname;
        const productListRegex = /^\/admin\/products\/?(?:\?.*)?$/;
        const productDetailRegex = /^\/admin\/products\/([a-zA-Z0-9_.-]+)(?:\/?(?:\?.*)?)$/;

        if (productDetailRegex.test(currentPath)) {
            const match = currentPath.match(productDetailRegex);
            if (match && match[1] && match[1] !== 'create') {
                 log('Product detail page detected. Identifier: ' + match[1]);
                 // Вызываем новую функцию для немедленного добавления кнопки
                 addProductDetailButtonIfMissing();
            } else {
                log('Product list page detected (similar URL, but not a product detail page).');
                handleProductListPage();
            }
        } else if (productListRegex.test(currentPath) || window.location.href.includes('/admin/products?countryId=')) {
             log('Product list page detected.');
             handleProductListPage();
        } else {
            log('Current page does not match product list or product detail page. URL: ' + window.location.href);
        }
    }

    // Запускаем основную логику после загрузки DOM, чтобы убедиться, что waitForKeyElements доступен
    // и основные элементы страницы присутствуют, хотя бы для добавления кнопок.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();