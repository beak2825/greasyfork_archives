// ==UserScript==
// @name         タイトル入力補助［テスト用］
// @namespace    http://tampermonkey.net/
// @version      1.09.07
// @description  本登録時にタイトルを送信し収集。収集されたデータからワード候補を表示。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518942/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/518942/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9%EF%BC%BB%E3%83%86%E3%82%B9%E3%83%88%E7%94%A8%EF%BC%BD.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const url = 'https://raw.githubusercontent.com/NEL227/my-data-repo/main/data/NGwords.txt';
    const dbName = 'ngWordsDB';
    const storeName = 'ngWordsStore';
    const keyName = 'ngWords';

    let ngWords = [];
    let isButtonAdded = false;

    const db = await openDatabase();

    try {
        const cachedData = await getFromDB(db, storeName, keyName);
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const now = new Date();

        if (cachedData && now - new Date(cachedData.timestamp) <= oneDayInMillis) {
            ngWords = cachedData.words;
        }
    } catch (error) {}

    initMainScript(ngWords);

    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            const newWords = text.split('\n').map(word => word.trim()).filter(word => word);

            if (JSON.stringify(newWords) !== JSON.stringify(ngWords)) {
                ngWords = newWords;
                await saveToDB(db, storeName, { id: keyName, words: ngWords, timestamp: new Date() });
            }
        }
    } catch (error) {}

    function openDatabase() {
        return new Promise((resolve) => {
            const request = indexedDB.open(dbName, 1);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            };
        });
    }

    function getFromDB(db, store, key) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([store], 'readonly');
            const objectStore = transaction.objectStore(store);
            const request = objectStore.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject();
        });
    }

    function saveToDB(db, store, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([store], 'readwrite');
            const objectStore = transaction.objectStore(store);
            const request = objectStore.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }

    function initMainScript(ngWords) {
        (function() {
            'use strict';

            const jsonURL = 'https://raw.githubusercontent.com/NEL227/my-data-repo/main/data/sorted_data.json';

            GM_addStyle(`
#popup {
    position: fixed;
    top: 1%;
    left: 0.5%;
    width: 400px;
    height: 800px;
    max-width: 100%;
    max-height: 98%;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10000;
    overflow-y: auto;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}
 
#popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    height: 20px;
    position: sticky;
    top: -11px;
    background-color: white;
    z-index: 10;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}
 
#popup-content {
    height: auto;
    overflow-y: visible;
    box-sizing: border-box;
}
 
#popup-close {
    cursor: pointer;
    background: transparent;
    color: black;
    border: none;
    font-size: 24px;
    padding: 10px;
    position: absolute;
    top: -11px;
    left: 1px;
    line-height: 1;
    border-radius: 5px;
    position: sticky;
    z-index: 11;
}
 
#popup-content ul {
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    margin: 0;
}
 
#popup-content ul li {
    padding: 3px;
    padding-right: 5px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
 
.add-word-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
}
 
.add-word-button::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}
 
.add-word-button::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}
 
.add-word-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
 
.add-word-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
 
#show-subwords-button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 3px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 5px;
    display: block;
    width: 100px;
    text-align: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
}
 
#show-subwords-button:hover:not(.disabled) {
    background-color: #388E3C;
}
 
#show-subwords-button:active:not(.disabled) {
    transform: translateY(2px);
}
 
#show-subwords-button.disabled {
    background-color: #ccc;
    cursor: default;
}
 
#show-subwords-button.active {
    background-color: #4CAF50;
    color: #ffffff;
    cursor: default;
}
 
#settings-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 5px;
    margin-top: 5.5px;
}
#settings-button::before {
    content: '⚙️';
    font-size: 14px;
    display: block;
    position: relative;
    top: -0.5px;
 
}
 
#settings-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
 
#settings-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
 
#settings-popup {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10001;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}
 
#settings-popup label {
    display: block;
    margin-bottom: 5px;
}
 
#settings-popup input,
#settings-popup button {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 5px;
    margin-bottom: 10px;
    display: block;
}
 
#settings-popup button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: block;
}
 
#settings-popup button:hover {
    background-color: #388E3C;
}
 
#settings-popup button:active {
    transform: translateY(2px);
}
 
td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"]) {
    position: relative;
    padding-top: 30px;
}
 
.button-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.9);
    z-index: 999;
}
 
#show-subwords-button.disabled.active {
    background-color: #388E3C;
}
    `);

            const popup = document.createElement('div');
            popup.id = 'popup';
            popup.innerHTML = `
    <button id="popup-close">×</button>
    <div id="popup-header"></div>
    <div id="popup-content"><ul></ul></div>
`;
            document.body.appendChild(popup);

            const settingsButton = document.createElement('button');
            settingsButton.id = 'settings-button';
            settingsButton.title = '設定';
            settingsButton.className = 'add-word-button';

            const settingsPopup = document.createElement('div');
            settingsPopup.id = 'settings-popup';
            settingsPopup.innerHTML = `
    <label for="popup-width">横幅 (px):</label>
    <input type="number" id="popup-width" value="400" step="10" />
    <label for="popup-height">高さ (px):</label>
    <input type="number" id="popup-height" value="800" step="10" />
    <button id="apply-settings">適用</button>
`;
            document.body.appendChild(settingsPopup);

            function fetchJSON(callback) {
                const cacheLifetime = 24 * 60 * 60 * 1000;

                getFromIndexedDB()
                    .then(cachedData => {
                    const now = new Date().getTime();

                    if (cachedData && (now - cachedData.timestamp < cacheLifetime)) {
                        callback(cachedData.data);
                    } else {
                        fetch(jsonURL, {
                            method: 'GET',
                            cache: 'no-cache'
                        })
                            .then(response => response.json())
                            .then(data => {
                            saveToIndexedDB(data)
                                .catch(error => console.error('データの保存中にエラーが発生しました:', error));

                            callback(data);
                        })
                            .catch(error => console.error('JSONデータの取得中にエラーが発生しました:', error));
                    }
                })
                    .catch(error => console.error('IndexedDBからのデータ取得中にエラーが発生しました:', error));
            }

            function handleData(data) {
                const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                const button = document.getElementById('show-subwords-button');

                if (inputField) {
                    let inputValue = inputField.value.trim();
                    let words = inputValue.split(/\s+/);
                    let mainWord = '';

                    if (words.length > 0) {
                        mainWord = words[0];

                        if (mainWord.endsWith('用') && words.length > 1) {
                            let secondWord = words[1];

                            if (!secondWord.endsWith('用')) {
                                mainWord = mainWord + secondWord.replace(/\s+/g, '');
                            }
                        }
                    }

                    if (data[mainWord]) {
                        const popupHeader = document.getElementById('popup-header');
                        if (popupHeader) {
                            popupHeader.textContent = `「${mainWord}」`;
                        }

                        const popupContent = document.getElementById('popup-content').querySelector('ul');

                        const updateSubwords = (currentInputValue) => {
                            const inputWords = currentInputValue.split(/\s+/);

                            const subwords = Object.entries(data[mainWord])
                            .filter(([subword]) => !ngWords.includes(subword))
                            .sort(([, aCount], [, bCount]) => bCount - aCount)
                            .map(([subword]) => {
                                const existsInInput = inputWords.includes(subword);
                                return `
                    <li style="color: ${existsInInput ? 'green' : 'black'};">
                        ${subword}
<button class="add-word-button" data-word="${subword}"></button>
</li>
`;
                            })
                            .join('');

                            popupContent.innerHTML = subwords;

                            document.querySelectorAll('.add-word-button').forEach(button => {
                                button.addEventListener('click', (event) => {
                                    const word = event.target.getAttribute('data-word');

                                    const text = inputField.value || '';
                                    const start = inputField.selectionStart || 0;
                                    const end = inputField.selectionEnd || 0;

                                    const before = text.slice(0, start) || '';
                                    const after = text.slice(end) || '';

                                    const needsSpaceBefore = (before && before.length > 0 && before[before.length - 1] !== ' ') || false;
                                    const needsSpaceAfter = (after && after.length > 0 && after[0] !== ' ') || false;

                                    inputField.value = before + (needsSpaceBefore ? ' ' : '') + word + (needsSpaceAfter ? ' ' : '') + after;
                                    inputField.setSelectionRange(start + word.length + (needsSpaceBefore ? 1 : 0), start + word.length + (needsSpaceBefore ? 1 : 0));
                                    inputField.focus();

                                    updateSubwords(inputField.value.trim());
                                });
                            });
                        };

                        updateSubwords(inputValue);

                        inputField.addEventListener('input', () => {
                            updateSubwords(inputField.value.trim());
                        });

                        const popup = document.getElementById('popup');
                        if (popup) {
                            popup.style.display = 'block';
                            if (button) {
                                button.textContent = '表示中';
                                button.classList.add('disabled', 'active');
                                button.disabled = true;
                            }
                        }
                    } else {
                        if (button) {
                            button.textContent = '登録なし';
                            button.classList.add('disabled');
                            button.classList.remove('active');
                            button.disabled = true;
                        }
                    }
                }
            }

            function initDB() {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open('jsonCacheDB', 1);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains('jsonData')) {
                            db.createObjectStore('jsonData', { keyPath: 'id' });
                        }
                    };

                    request.onsuccess = (event) => {
                        resolve(event.target.result);
                    };

                    request.onerror = (event) => {
                        reject('IndexedDBの初期化に失敗しました');
                    };
                });
            }

            function saveToIndexedDB(data) {
                return initDB().then(db => {
                    return new Promise((resolve, reject) => {
                        const transaction = db.transaction(['jsonData'], 'readwrite');
                        const store = transaction.objectStore('jsonData');
                        const cacheData = {
                            id: 'jsonData',
                            timestamp: new Date().getTime(),
                            data: data
                        };
                        store.put(cacheData);

                        transaction.oncomplete = () => resolve();
                        transaction.onerror = () => reject('データの保存に失敗しました');
                    });
                });
            }

            function getFromIndexedDB() {
                return initDB().then(db => {
                    return new Promise((resolve, reject) => {
                        const transaction = db.transaction(['jsonData'], 'readonly');
                        const store = transaction.objectStore('jsonData');
                        const request = store.get('jsonData');

                        request.onsuccess = (event) => {
                            resolve(event.target.result);
                        };

                        request.onerror = () => reject('データの取得に失敗しました');
                    });
                });
            }

            function adjustButtonContainerStyle() {
                const url = window.location.href;
                const buttonContainer = document.querySelector('.button-container');

                if (buttonContainer) {
                    if (url.includes('registered_mainedit')) {
                        buttonContainer.style.bottom = '31.5px';
                        buttonContainer.style.left = `1px`;
                    } else {
                        buttonContainer.style.bottom = '51px';
                        buttonContainer.style.left = `1px`;
                    }
                }
            }

            function addShowSubwordsButton() {
                const tdElement = document.querySelector('td[colspan="3"][scope="row"]');
                const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');

                if (!inputField) return;

                if (!tdElement || tdElement.querySelector('.button-container')) return;

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const showSubwordsButton = document.createElement('button');
                showSubwordsButton.id = 'show-subwords-button';
                showSubwordsButton.textContent = 'ワード候補';

                const settingsButton = document.createElement('button');
                settingsButton.id = 'settings-button';
                settingsButton.title = '設定';
                settingsButton.className = 'settings-button';

                buttonContainer.appendChild(showSubwordsButton);
                buttonContainer.appendChild(settingsButton);

                tdElement.appendChild(buttonContainer);

                if (typeof adjustButtonContainerStyle === 'function') {
                    adjustButtonContainerStyle();
                } else {
                    console.warn('adjustButtonContainerStyle 関数が見つかりません。スタイル調整をスキップします。');
                }

                showSubwordsButton.addEventListener('click', (event) => {
                    if (event.isTrusted) {
                        if (!showSubwordsButton.classList.contains('disabled')) {
                            event.preventDefault();
                            event.stopPropagation();
                            if (typeof fetchJSON === 'function' && typeof handleData === 'function') {
                                fetchJSON(data => handleData(data));
                            } else {
                                console.error('fetchJSON または handleData 関数が見つかりません');
                            }
                        }
                    }
                });

                settingsButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (typeof toggleSettingsPopup === 'function') {
                        toggleSettingsPopup();
                    } else {
                        console.error('toggleSettingsPopup 関数が見つかりません');
                    }
                });
            }

            function toggleSettingsPopup() {
                const settingsPopup = document.getElementById('settings-popup');
                if (settingsPopup) {
                    settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
                }
            }

            function closePopup() {
                const popup = document.getElementById('popup');
                const showSubwordsButton = document.getElementById('show-subwords-button');
                if (popup) {
                    popup.style.display = 'none';
                    if (showSubwordsButton) {
                        showSubwordsButton.textContent = 'ワード候補';
                        showSubwordsButton.classList.remove('disabled', 'active');
                        showSubwordsButton.disabled = false;
                    }
                }
            }

            function applySettings() {
                const width = document.getElementById('popup-width').value || 400;
                const height = document.getElementById('popup-height').value || 800;

                const popup = document.getElementById('popup');
                if (popup) {
                    popup.style.width = `${width}px`;
                    popup.style.height = `${height}px`;
                }

                localStorage.setItem('popupWidth', width);
                localStorage.setItem('popupHeight', height);
            }

            function closeSettingsOnClickOutside(event) {
                const settings = document.getElementById('settings-popup');
                const settingsButton = document.getElementById('settings-button');
                if (settings && !settings.contains(event.target) && event.target !== settingsButton) {
                    settings.style.display = 'none';
                }
            }

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closePopup();
                }
            });

            document.addEventListener('click', function(event) {
                if (event.target.id === 'popup-close') {
                    closePopup();
                } else if (event.target.id === 'apply-settings') {
                    applySettings();
                }
            });

            settingsButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleSettingsPopup();
            });

            document.addEventListener('click', closeSettingsOnClickOutside);

            const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
            if (inputField) {
                inputField.addEventListener('input', () => {
                    const button = document.getElementById('show-subwords-button');
                    const popup = document.getElementById('popup');

                    if (button && button.textContent === '登録なし') {
                        button.textContent = 'ワード候補';
                        button.classList.remove('disabled');
                        button.disabled = false;
                    }

                    if (popup && popup.style.display === 'block') {
                        button.textContent = '表示中（更新）';
                        button.classList.remove('disabled');
                        button.classList.add('active');
                        button.disabled = false;
                    }
                });
            }

            window.addEventListener('load', () => {
                if (!isButtonAdded) {
                    addShowSubwordsButton();
                    isButtonAdded = true;
                }

                const savedWidth = localStorage.getItem('popupWidth');
                const savedHeight = localStorage.getItem('popupHeight');

                if (savedWidth && savedHeight) {
                    const popup = document.getElementById('popup');
                    if (popup) {
                        popup.style.width = `${savedWidth}px`;
                        popup.style.height = `${savedHeight}px`;
                        document.getElementById('popup-width').value = savedWidth;
                        document.getElementById('popup-height').value = savedHeight;
                    }
                }

                fetchJSON(data => {
                });
            });

            //送信機能
            const API_URL = 'https://my-data-repo.vercel.app/api/github-proxy';

            const INPUT_SELECTOR = '#TbMainproductDaihyoSyohinName';
            const BUTTON_SELECTOR = '#saveAndSkuStock';

            function getFileShaAndContent(callback) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${API_URL}`,
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            const sha = data.sha;
                            const existingContent = data.content;
                            callback(sha, existingContent);
                        } else {
                            console.error("ファイルの取得に失敗しました:", response.responseText);
                            callback(null, null);
                        }
                    },
                    onerror: function(error) {
                        console.error("エラーが発生しました:", error);
                        callback(null, null);
                    }
                });
            }

            function uploadData(retryCount = 0) {
                const inputElement = document.querySelector(INPUT_SELECTOR);
                if (inputElement) {
                    const newData = inputElement.value;

                    getFileShaAndContent(function(sha, existingContent) {
                        if (sha !== null) {
                            const updatedContent = existingContent + "\n" + newData;

                            GM_xmlhttpRequest({
                                method: "PUT",
                                url: API_URL,
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                data: JSON.stringify({
                                    sha: sha,
                                    newData: updatedContent
                                }),
                                onload: function(response) {
                                    if (response.status === 200) {
                                        console.log("データ送信成功");
                                    } else if (response.status === 422 && retryCount < 3) {
                                        console.warn("競合確認...リトライ中");
                                        setTimeout(() => uploadData(retryCount + 1), 1000);
                                    } else {
                                        console.error("データ送信失敗:", response.responseText);
                                    }
                                },
                                onerror: function(error) {
                                    console.error("Error:", error);
                                    if (retryCount < 3) {
                                        setTimeout(() => uploadData(retryCount + 1), 1000);
                                    }
                                }
                            });
                        }
                    });
                }
            }

            function setupButtonListener() {
                const buttonElement = document.querySelector(BUTTON_SELECTOR);
                if (buttonElement) {
                    buttonElement.addEventListener('click', uploadData);
                }
            }

            setupButtonListener();

        })();
    }
})();