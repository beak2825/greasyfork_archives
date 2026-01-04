// ==UserScript==
// @name         ディレクトリチェック
// @namespace    http://tampermonkey.net/
// @version      2024/12/13
// @description  ディレクトリの検索機能を追加。現在入力されているディレクトリの詳細を表示。存在しないIDや数字以外が入力されている場合は赤枠で表示。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/500532/%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/500532/%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .paste-button-directory {
        background-color: #ffffff;
        color: #4CAF50;
        border: 1px solid #4CAF50;
        padding: 3px;
        cursor: pointer;
        font-size: 12px;
        border-radius: 6px;
        transition: background-color 0.2s ease, transform 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-left: 5px;
        position: relative;
        vertical-align: middle;
        transform: scale(0.95);
    }

    .paste-button-directory::before {
        content: '📑';
        font-size: 14px;
        display: block;
        position: relative;
        top: -1px;
        left: 1px;
    }

    .paste-button-directory:hover {
        background-color: #4CAF50;
        color: #ffffff;
        transform: scale(0.95) translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .paste-button-directory:active {
        background-color: #388E3C;
        transform: scale(0.95) translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .paste-button-directory::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        left: -5px;
        z-index: 0;
    }
    .help-icon {
    font-size: 13px;
    margin-left: 0;
    cursor: pointer;
    vertical-align: super;
   }
   .help-icon:hover {
       color: #000;
   }
        `);

    const targetInputSelector1 = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
    const targetInputSelector2 = 'input[name="data[TbMainproduct][NEディレクトリID]"]';

    const popupStyle = `
        position: absolute;
        background-color: #f9f9f9;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 4px 10px;
        z-index: 1001;
        display: none;
    `;

    const createPopup = () => {
        const popup = document.createElement('div');
        popup.setAttribute('style', popupStyle);

        const contentDiv = document.createElement('div');
        popup.appendChild(contentDiv);
        document.body.appendChild(popup);
        return { popup, contentDiv };
    };

    const { popup: popup1, contentDiv: contentDiv1 } = createPopup();
    const { popup: popup2, contentDiv: contentDiv2 } = createPopup();

    const checkInputValue = (inputElement, dataMap) => {
        const value = inputElement.value;
        const isNumeric = /^\d+$/.test(value);
        const hasSpaces = /(^\s|\s$)/.test(value);
        const matches = dataMap[value.trim()] || [];

        if (value !== '' && (hasSpaces || !isNumeric || (matches.length === 0 && value !== ''))) {
            inputElement.style.border = '2px solid red';
        } else {
            inputElement.style.border = '';
        }
    };

    const addInputListener = (selector, dataMap, popup, contentDiv) => {
        const inputElement = document.querySelector(selector);
        if (!inputElement) return;

        const updatePopup = (value) => {
            const matches = dataMap[value.trim()] || [];
            if (matches.length > 0) {
                contentDiv.innerHTML = matches.map(description => `<div>${description}</div>`).join('');
                popup.style.display = 'flex';
                const rect = inputElement.getBoundingClientRect();
                const popupHeight = popup.offsetHeight;

                if (selector === targetInputSelector1) {
                    popup.style.top = `${rect.bottom + window.scrollY}px`;
                } else if (selector === targetInputSelector2) {
                    popup.style.top = `${rect.top + window.scrollY - popupHeight}px`;
                }
                popup.style.left = `${rect.left + window.scrollX}px`;
            } else {
                contentDiv.innerHTML = '';
                popup.style.display = 'none';
            }
        };

        checkInputValue(inputElement, dataMap);
        let blurTimeout;

        inputElement.addEventListener('focus', function(event) {
            if (blurTimeout) clearTimeout(blurTimeout);
            updatePopup(event.target.value);
        });

        inputElement.addEventListener('input', function(event) {
            updatePopup(event.target.value);
        });

        inputElement.addEventListener('blur', function(event) {
            blurTimeout = setTimeout(() => {
                popup.style.display = 'none';
            }, 800);
            checkInputValue(event.target, dataMap);
        });

        document.addEventListener('click', function(event) {
            if (!popup.contains(event.target) && !inputElement.contains(event.target)) {
                popup.style.display = 'none';
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                popup.style.display = 'none';
            }
        });
    };

    const openIndexedDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DirectoryDB', 1);
            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('directories')) {
                    db.createObjectStore('directories', { keyPath: 'id' });
                }
            };
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function(event) {
                console.error('IndexedDBエラー: ' + event.target.errorCode);
                reject('IndexedDBエラー: ' + event.target.errorCode);
            };
        });
    };

    const getDataFromIndexedDB = (db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['directories'], 'readonly');
            const objectStore = transaction.objectStore('directories');
            const request = objectStore.get('directoryData');
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function(event) {
                console.error('IndexedDBからデータ取得中にエラーが発生しました');
                reject('IndexedDBからデータ取得中にエラーが発生しました');
            };
        });
    };

    const saveDataToIndexedDB = (db, data) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['directories'], 'readwrite');
            const objectStore = transaction.objectStore('directories');

            const request = objectStore.put({ id: 'directoryData', ...data });

            transaction.onerror = (event) => {
                console.error("IndexedDBへのデータ保存中にエラーが発生しました:", event.target.error);
                reject(event.target.error);
            };

            transaction.oncomplete = () => {
                resolve();
            };
        });
    };

    const needsUpdate = (lastUpdated) => {
        const now = Date.now();
        const lastUpdatedDate = new Date(lastUpdated);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const lastUpdateDay = lastUpdatedDate.getDay();
        const currentDay = new Date().getDay();

        const lastUpdateWasMonday = lastUpdateDay === 1;
        const todayIsMonday = currentDay === 1;

        return !lastUpdated || (now - lastUpdated > oneWeek) || !lastUpdateWasMonday || todayIsMonday;
    };

    const fetchAndUpdateData = async (db) => {
        try {
            const response = await fetch('https://nel227.github.io/my-data-repo/directories.json');
            const data = await response.json();

            const lastUpdated = data.lastUpdated;

            await saveDataToIndexedDB(db, { data, lastUpdated });
            return { data, lastUpdated };
        } catch (error) {
            console.error("データの取得または保存中にエラーが発生しました:", error);
            return null;
        }
    };

    const fetchData = async () => {
        try {
            const db = await openIndexedDB();
            let directoryData = await getDataFromIndexedDB(db);

            if (!directoryData || needsUpdate(directoryData.lastUpdated)) {
                directoryData = await fetchAndUpdateData(db);
            }

            if (directoryData && directoryData.data) {
                const yahooDirectory = directoryData.data.YahooDirectory || {};
                const neDirectory = directoryData.data.NEDirectory || {};

                addInputListener(targetInputSelector1, yahooDirectory, popup1, contentDiv1);
                addInputListener(targetInputSelector2, neDirectory, popup2, contentDiv2);
            } else {
                console.error('データが正しく取得されませんでした。デフォルトの空データを使用します。');
                const emptyData = {};
                addInputListener(targetInputSelector1, emptyData, popup1, contentDiv1);
                addInputListener(targetInputSelector2, emptyData, popup2, contentDiv2);
            }
        } catch (error) {
            console.error('データの取得中にエラーが発生しました:', error);
        }
    };

    fetchData();

    const createSearchWindow = () => {
        const searchWindow = document.createElement('div');
        searchWindow.setAttribute('style', `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 85vw;
        height: 90vh;
        background-color: #fff;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 2vh;
        z-index: 10001;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: none;
        overflow: hidden;
        transform: translate(-50%, -50%);
    `);

        const idDisplay = document.createElement('div');
        idDisplay.setAttribute('style', `
        font-size: 14px;
        color: #555;
        padding-top: 8.5vh;
        padding-bottom: 2vh;
    `);

        searchWindow.appendChild(idDisplay);

        const getDetailsById = async (id) => {
            const db = await openIndexedDB();
            const directoryData = await getDataFromIndexedDB(db);

            const neDirectory = directoryData.data.NEDirectory || {};
            const yahooDirectory = directoryData.data.YahooDirectory || {};
            const trimmedId = id.trim();

            for (const [key, descriptions] of Object.entries(neDirectory)) {
                if (key === trimmedId) {
                    return descriptions;
                }
            }
            for (const [key, descriptions] of Object.entries(yahooDirectory)) {
                if (key === trimmedId) {
                    return descriptions;
                }
            }
            return null;
        };

        const updateIdDisplay = async () => {
            const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
            const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

            const neId = neIdInput ? neIdInput.value : '未入力';
            const yahooId = yahooIdInput ? yahooIdInput.value : '未入力';

            const neDetails = await getDetailsById(neId);
            const yahooDetails = await getDetailsById(yahooId);

            const formatDetails = (details, id) => {
                return details ? details.map(path => path.split(' > ').join(' > ')).join('<br>') + ` (ID: ${id})` : '未入力、またはIDが見つかりません。';
            };

            idDisplay.innerHTML = `
        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            NE: ${formatDetails(neDetails, neId)}
        </div>
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            Ya: ${formatDetails(yahooDetails, yahooId)}
        </div>
    `;
        };

        const addInputListenersNeYahoo = () => {
            const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
            const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

            if (neIdInput) {
                neIdInput.addEventListener('input', updateIdDisplay);
            }
            if (yahooIdInput) {
                yahooIdInput.addEventListener('input', updateIdDisplay);
            }
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.setAttribute('style', `
        position: absolute;
        top: -5px;
        right: 0;
        cursor: pointer;
        background: transparent;
        color: black;
        border: none;
        font-size: 24px;
        padding: 10px;
        line-height: 1;
        border-radius: 5px;
        z-index: 1001;
        margin: 0;
        display: block;
    `);

        searchWindow.appendChild(closeButton);

        closeButton.addEventListener('click', () => {
            searchWindow.style.display = 'none';
        });

        const lastUpdatedElement = document.createElement('div');
        lastUpdatedElement.id = 'lastUpdated';
        lastUpdatedElement.setAttribute('style', 'margin-bottom: 10px; font-size: 14px; color: #555;');
        searchWindow.appendChild(lastUpdatedElement);

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', '検索キーワード (半角スペースでアンド検索)');
        searchInput.setAttribute('id', 'search-input');
        searchInput.setAttribute('style', `
        position: absolute;
        top: 4.5vh;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 50px);
        padding: 1vh;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1vh;
        background: #fff;
        z-index: 1002;
    `);

        searchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            updateSearchResults(query);

        });

        const filterContainer = document.createElement('div');
        filterContainer.setAttribute('style', `
        position: absolute;
        top: 9.5vh;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 1vh;
        z-index: 1001;
        background: #fff;
        padding: 1vh;
    `);

        const neCheckboxLabel = document.createElement('label');
        neCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

        const neCheckbox = document.createElement('input');
        neCheckbox.setAttribute('type', 'checkbox');
        neCheckbox.setAttribute('id', 'ne-directory-checkbox');
        neCheckbox.setAttribute('style', 'margin-right: 10px;');
        neCheckbox.checked = true;

        const neLabelText = document.createElement('span');
        neLabelText.textContent = 'NEディレクトリを表示';
        neLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

        neCheckboxLabel.appendChild(neCheckbox);
        neCheckboxLabel.appendChild(neLabelText);

        const yahooCheckboxLabel = document.createElement('label');
        yahooCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

        const yahooCheckbox = document.createElement('input');
        yahooCheckbox.setAttribute('type', 'checkbox');
        yahooCheckbox.setAttribute('id', 'yahoo-directory-checkbox');
        yahooCheckbox.setAttribute('style', 'margin-right: 10px;');
        yahooCheckbox.checked = true;

        const yahooLabelText = document.createElement('span');
        yahooLabelText.textContent = 'Yahooディレクトリを表示';
        yahooLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

        yahooCheckboxLabel.appendChild(yahooCheckbox);
        yahooCheckboxLabel.appendChild(yahooLabelText);

        filterContainer.appendChild(neCheckboxLabel);
        filterContainer.appendChild(yahooCheckboxLabel);

        neCheckbox.addEventListener('change', () => {
            const searchQuery = document.getElementById('search-input').value;
            updateSearchResults(searchQuery);
        });

        yahooCheckbox.addEventListener('change', () => {
            const searchQuery = document.getElementById('search-input').value;
            updateSearchResults(searchQuery);
        });

        const searchResults = document.createElement('div');
        searchResults.setAttribute('style', `
        position: relative;
        max-height: 66vh;
        font-size: 14px;
        top: -1.2vh;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        overflow-y: auto;
        z-index: 1000;
    `);

        searchWindow.appendChild(closeButton);
        searchWindow.appendChild(searchInput);
        searchWindow.appendChild(filterContainer);
        searchWindow.appendChild(idDisplay);
        searchWindow.appendChild(searchResults);
        document.body.appendChild(searchWindow);

        const applyFilters = () => {
            const neResults = searchResults.querySelectorAll('.NE-result');
            const yahooResults = searchResults.querySelectorAll('.Yahoo-result');
            const neChecked = neCheckbox.checked;
            const yahooChecked = yahooCheckbox.checked;

            let neVisible = false;
            let yahooVisible = false;

            neResults.forEach(result => {
                if (neChecked) {
                    result.style.display = 'block';
                    neVisible = true;
                } else {
                    result.style.display = 'none';
                }
            });

            yahooResults.forEach(result => {
                if (yahooChecked) {
                    result.style.display = 'block';
                    yahooVisible = true;
                } else {
                    result.style.display = 'none';
                }
            });

            const neTitle = searchResults.querySelector('.NE-title');
            if (neTitle) {
                neTitle.style.display = neVisible ? 'block' : 'none';
            }

            const yahooTitle = searchResults.querySelector('.Yahoo-title');
            if (yahooTitle) {
                yahooTitle.style.display = yahooVisible ? 'block' : 'none';
            }
        };

        neCheckbox.addEventListener('change', applyFilters);
        yahooCheckbox.addEventListener('change', applyFilters);

        searchResults.addEventListener('click', (event) => {
            if (event.target.classList.contains('paste-button-directory')) {
                const value = event.target.getAttribute('data-value');
                const directoryType = event.target.getAttribute('data-directory');

                let inputSelector = '';

                if (directoryType === 'yahoo') {
                    inputSelector = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
                } else if (directoryType === 'ne') {
                    inputSelector = 'input[name="data[TbMainproduct][NEディレクトリID]"]';
                }

                const input = document.querySelector(inputSelector);
                if (input) {
                    input.value = value;

                    let message = event.target.nextElementSibling;
                    if (!message || !message.classList.contains('paste-message')) {
                        message = document.createElement('span');
                        message.className = 'paste-message';
                        message.setAttribute('style', `
                        margin-left: 10px;
                        color: green;
                        font-size: 14px;
                        display: inline-block;
                    `);
                        event.target.parentNode.insertBefore(message, event.target.nextSibling);
                    }
                    updateIdDisplay();
                    message.textContent = 'ペーストが完了しました！'

                    setTimeout(() => {
                        message.textContent = '';
                    }, 1700);
                }
            }
        });

        return {
            searchWindow,
            searchInput,
            searchResults,
            applyFilters,
            lastUpdatedElement,
            updateIdDisplay,
            addInputListenersNeYahoo
        };
    };

    const { searchWindow, searchInput, searchResults, applyFilters, lastUpdatedElement, updateIdDisplay, addInputListenersNeYahoo } = createSearchWindow();

    const fetchDataAndUpdateUI = async () => {
        const db = await openIndexedDB();
        const directoryData = await getDataFromIndexedDB(db);

        const tooltip = document.createElement('div');
        tooltip.setAttribute('style', `
        position: absolute;
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        display: none;
        z-index: 10002;
    `);

        const lastUpdated = directoryData && directoryData.lastUpdated
        ? new Date(directoryData.lastUpdated).toLocaleString("ja-JP", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'データなし';

        tooltip.textContent = `ディレクトリ最終更新日時: ${lastUpdated}`;

        document.body.appendChild(tooltip);

        lastUpdatedElement.textContent = '？';
        lastUpdatedElement.style.fontSize = "12px";
        lastUpdatedElement.style.cursor = "pointer";
        lastUpdatedElement.style.display = 'inline-block';
        lastUpdatedElement.style.width = 'auto';
        lastUpdatedElement.style.height = 'auto';
        lastUpdatedElement.style.padding = '0';

        lastUpdatedElement.addEventListener('click', (event) => {
            const rect = lastUpdatedElement.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + window.scrollY}px`;
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.display = 'block';
        });

        document.addEventListener('click', (event) => {
            if (!lastUpdatedElement.contains(event.target) && !tooltip.contains(event.target)) {
                tooltip.style.display = 'none';
            }
        });
    };

    const openSearchWindow = async () => {
        searchWindow.style.display = 'block';
        await fetchDataAndUpdateUI();
        await updateIdDisplay();
        addInputListenersNeYahoo();
    };

    const closeSearchWindow = () => {
        searchWindow.style.display = 'none';
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSearchWindow();
        }
    });

    const performSearch = async (queries, directoryData) => {
        const results = [];
        const lowercaseQueries = queries.map(query => query.toLowerCase().trim());

        for (const [key, descriptions] of Object.entries(directoryData)) {
            descriptions.forEach(description => {
                if (lowercaseQueries.every(query => description.toLowerCase().includes(query))) {
                    results.push({ key, description: description.trim() });
                }
            });
        }

        return results;
    };

    const updateSearchResults = async (query) => {
        try {
            const db = await openIndexedDB();
            const directoryData = await getDataFromIndexedDB(db);

            searchResults.innerHTML = '';

            if (directoryData && directoryData.data) {
                const yahooDirectory = directoryData.data.YahooDirectory || {};
                const neDirectory = directoryData.data.NEDirectory || {};

                const queries = query.split(/\s+/).map(q => q.trim()).filter(q => q.length > 0);
                const excludeQueries = queries.filter(q => q.startsWith('-') && q.length > 1).map(q => q.substring(1));
                const includeQueries = queries.filter(q => !q.startsWith('-'));

                const yahooResults = await performSearch(includeQueries, yahooDirectory);
                const neResults = await performSearch(includeQueries, neDirectory);

                let isFilteringFullData = false;

                const filteredYahooResults = yahooResults.filter(result =>
                                                                 !excludeQueries.some(exclude => result.description.includes(exclude))
                                                                );
                const filteredNeResults = neResults.filter(result =>
                                                           !excludeQueries.some(exclude => result.description.includes(exclude))
                                                          );

                let totalResults = 0;

                const neCheckbox = document.querySelector('#ne-directory-checkbox');
                const yahooCheckbox = document.querySelector('#yahoo-directory-checkbox');

                const createClickablePath = (description, isYahooFiltering, highlightPartIndex = null) => {
                    const pathParts = description.split(' > ');

                    const displayPathParts = isYahooFiltering ? pathParts.slice(1) : pathParts;

                    return displayPathParts.map((part, index) => `
        <span class="path-part" data-part="${part}" data-index="${index}" data-description="${description}"
              style="cursor: pointer; ${highlightPartIndex !== null && index <= highlightPartIndex ? 'color: #007bff; font-weight: bold;' : ''}"
              title="ダブルクリックで絞り込み">
            ${part}
        </span>
        ${index < displayPathParts.length - 1 ? ' > ' : ''}
    `).join('');
                };

                const addPathClickHandlers = () => {
                    const pathParts = searchResults.querySelectorAll('.path-part');
                    pathParts.forEach(part => {
                        part.addEventListener('dblclick', (event) => {
                            const clickedPart = event.target.getAttribute('data-part');
                            const fullDescription = event.target.getAttribute('data-description');
                            const directory = event.target.closest('.search-result').classList.contains('NE-result') ? 'ne' : 'yahoo';
                            let partIndex = parseInt(event.target.getAttribute('data-index'));

                            if (directory === 'yahoo' && !isFilterActive) {
                                partIndex -= 1;
                            }

                            filterResultsByPart(clickedPart, fullDescription, partIndex, directory);
                        });
                    });
                };

                let isFilterActive = false;

                const addClearFilterButton = (parentElement, query) => {
                    const clearFilterButton = document.createElement('button');
                    clearFilterButton.innerText = '解除';
                    clearFilterButton.classList.add('clear-filter-button');
                    clearFilterButton.addEventListener('click', () => {
                        updateSearchResults(query);
                        isFilterActive = false;
                    });

                    clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                    clearFilterButton.style.border = '1px solid #007bff';
                    clearFilterButton.style.color = '#007bff';
                    clearFilterButton.style.fontSize = '0.85em';
                    clearFilterButton.style.padding = '5px 10px';
                    clearFilterButton.style.cursor = 'pointer';
                    clearFilterButton.style.marginLeft = '15px';
                    clearFilterButton.style.borderRadius = '3px';
                    clearFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                    clearFilterButton.addEventListener('mouseover', () => {
                        clearFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                        clearFilterButton.style.borderColor = '#007bff';
                    });
                    clearFilterButton.addEventListener('mouseout', () => {
                        clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        clearFilterButton.style.borderColor = '#007bff';
                    });

                    parentElement.appendChild(clearFilterButton);
                    isFilterActive = true;
                };

                const addToggleFilterButton = (parentElement, query, part, fullDescription, partIndex, directory) => {
                    const toggleFilterButton = document.createElement('button');
                    toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                    toggleFilterButton.classList.add('toggle-filter-button');

                    toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                    toggleFilterButton.style.border = '1px solid #007bff';
                    toggleFilterButton.style.color = '#007bff';
                    toggleFilterButton.style.fontSize = '0.85em';
                    toggleFilterButton.style.padding = '5px 10px';
                    toggleFilterButton.style.cursor = 'pointer';
                    toggleFilterButton.style.marginLeft = '15px';
                    toggleFilterButton.style.borderRadius = '3px';
                    toggleFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                    toggleFilterButton.addEventListener('mouseover', () => {
                        toggleFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                        toggleFilterButton.style.borderColor = '#007bff';
                    });
                    toggleFilterButton.addEventListener('mouseout', () => {
                        toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        toggleFilterButton.style.borderColor = '#007bff';
                    });

                    toggleFilterButton.addEventListener('click', () => {
                        isFilteringFullData = !isFilteringFullData;
                        toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                        filterResultsByPart(part, fullDescription, partIndex, directory);
                    });

                    parentElement.appendChild(toggleFilterButton);
                };

                const filterResultsByPart = async (part, fullDescription, partIndex, directory) => {
                    const allResults = isFilteringFullData
                    ? (directory === 'ne' ? await performSearch([], neDirectory) : await performSearch([], yahooDirectory))
                    : (directory === 'ne' ? neResults : yahooResults);

                    const pathParts = fullDescription.split(' > ');

                    const filteredPathParts = directory === 'yahoo'
                    ? pathParts.slice(1, parseInt(partIndex) + 2)
                    : pathParts.slice(0, parseInt(partIndex) + 1);

                    const fullPathToMatch = filteredPathParts.join(' > ');

                    const matchingResults = allResults.filter(result => {
                        const resultPathParts = result.description.split(' > ');
                        const adjustedDescription = directory === 'yahoo'
                        ? resultPathParts.slice(1).join(' > ')
                        : result.description;

                        if (directory === 'yahoo') {
                            return adjustedDescription.startsWith(fullPathToMatch);
                        } else {
                            return adjustedDescription.startsWith(fullPathToMatch) &&
                                (adjustedDescription.length === fullPathToMatch.length || adjustedDescription[fullPathToMatch.length] === ' ');
                        }
                    });

                    if (matchingResults.length > 2000) {
                        searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                        const messageElement = searchResults.querySelector('div');
                        addClearFilterButton(messageElement, query);
                        return;
                    }

                    searchResults.innerHTML = `
        ${directory === 'ne' && matchingResults.length > 0 ? `
            <div class="sticky-title NE-title">
                NE ディレクトリの検索結果 (${matchingResults.length}件)
            </div>
            ${matchingResults.map(result => `
                <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                    ${createClickablePath(result.description, false, parseInt(partIndex))} (ID: ${result.key})
                    <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                </div>
            `).join('')}
        ` : ''}
${directory === 'yahoo' && matchingResults.length > 0 ? `
    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${matchingResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能を使用した結果、ディレクトリの意味がわからなくなるケースがあれば、ご報告ください。">?</span>
    </div>
    ${matchingResults.map(result => `
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
            ${createClickablePath(result.description, true, parseInt(partIndex))} (ID: ${result.key})
            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
        </div>
    `).join('')}
` : ''}
`;

                    addPathClickHandlers();

                    const titleElement = document.querySelector(`.${directory === 'ne' ? 'NE-title' : 'Yahoo-title'}`);
                    if (titleElement) {
                        addToggleFilterButton(titleElement, query, part, fullDescription, partIndex, directory);
                        addClearFilterButton(titleElement, query);
                    }
                };

                if (filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked) {
                    totalResults += filteredNeResults.length;
                }

                if (filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked) {
                    totalResults += filteredYahooResults.length;
                }

                if (totalResults === 0) {
                    searchResults.innerHTML = '<div>検索結果が見つかりませんでした。</div>';
                } else if (totalResults > 2000) {
                    searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                } else {
                    searchResults.innerHTML = `
                ${filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked ? `
                    <div class="sticky-title NE-title">NE ディレクトリの検索結果 (${filteredNeResults.length}件)</div>
                    ${filteredNeResults.map(result => `
                        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                        </div>
                    `).join('')}` : ''}
${filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked ? `
                    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${filteredYahooResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能を使用した結果、ディレクトリの意味がわからなくなるケースがあれば、ご報告ください。">?</span>
    </div>
                    ${filteredYahooResults.map(result => `
                        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
                        </div>
                    `).join('')}` : ''}
`;

                    addPathClickHandlers();
                }
            } else {
                searchResults.innerHTML = '<div>データが正しく取得されませんでした。</div>';
            }
        } catch (error) {
            console.error('検索中にエラーが発生しました:', error);
        }
    };

    GM_addStyle(`
    .sticky-title {
        position: sticky;
        top: -10px;
        left: 0;
        width: calc(100% + 0px);
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fff;
        z-index: 1001;
        padding: 0.5em 20px;
        font-weight: normal;
        margin: 0;
        color: #993;
        font-family: 'Gill Sans', 'Lucida Grande', Helvetica, Arial, sans-serif;
        font-size: 150%;
        display: block;
        text-align: center;
    }

.sticky-title::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 10px)
    height: 100%;
    background: #fff;
    z-index: -1;
}
`);

    const inputElement = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');

    const tdElement = inputElement.closest('td');

    const inputDivs = tdElement.querySelectorAll('div.input.text');

    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('style', `
    position: relative;
`);

    inputDivs.forEach(inputDiv => {
        inputDiv.setAttribute('style', `
    width: calc(100% - 40px);
display: inline-block;
`);
        containerDiv.appendChild(inputDiv);
    });

    const searchButton = document.createElement('button');
    searchButton.textContent = '🔍';

    searchButton.setAttribute('style', `
   position: absolute;
top: 50%;
transform: translateY(-50%);
                      right: 1px;
                      background: rgba(255, 255, 255, 0.1);
color: #ffffff;
border: none;
border-radius: 5px;
padding: 10px;
font-size: 16px;
font-weight: bold;
text-align: center;
cursor: pointer;
z-index: 999;
transition: all 0.3s ease-in-out;
`);

    searchButton.addEventListener('mouseover', () => {
        searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
        searchButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
        searchButton.style.transform = 'scale(1.05) translateY(-50%)';
    });

    searchButton.addEventListener('mouseout', () => {
        searchButton.style.background = 'rgba(255, 255, 255, 0)';
        searchButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0)';
        searchButton.style.transform = 'translateY(-50%)';
    });

    searchButton.addEventListener('mousedown', () => {
        searchButton.style.background = 'rgba(0, 123, 255, 0.5)';
        searchButton.style.transform = 'scale(0.95) translateY(-50%)';
    });

    searchButton.addEventListener('mouseup', () => {
        searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
        searchButton.style.transform = 'scale(1.05) translateY(-50%)';
    });

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openSearchWindow();
        updateIdDisplay();
    });

    containerDiv.appendChild(searchButton);

    tdElement.innerHTML = '';
    tdElement.appendChild(containerDiv);

})();