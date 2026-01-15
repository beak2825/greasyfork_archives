// ==UserScript==
// @name         Komica 檔案區工具
// @namespace    https://chat.openai.com/
// @version      3.1.2
// @description  這個腳本可以讓使用者自定義最小回覆數，按回覆數排序並且高亮顯示回覆數大於一定數值的貼文,還能隱藏發文者讓頁面更美觀,修正chrome最新版無法使用問題
// @author       ChatGPT & Gemini
// @match        https://*.komica1.org/*/pixmicat.php?*load=mod_threadlist*
// @icon https://www.google.com/s2/favicons?sz=64&domain=komica1.org
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474082/Komica%20%E6%AA%94%E6%A1%88%E5%8D%80%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/474082/Komica%20%E6%AA%94%E6%A1%88%E5%8D%80%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 使用 Tampermonkey 專屬儲存 API ---
    // 這樣即使瀏覽器封鎖了網頁的 localStorage，設定依然能被記住
    function getSetting(key, defaultVal) {
        return GM_getValue(key, defaultVal);
    }

    function saveSetting(key, val) {
        GM_setValue(key, val);
    }

    // --- 樣式區 (還原原始樣式) ---
    GM_addStyle(`
        #custom-options-container {
            position: fixed;
            left: 0;
            bottom: 20px;
            z-index: 1000;
            transition: transform 0.3s ease;
            transform: translateX(-210px);
        }
        #custom-options-panel {
            background-color: white;
            color: red;
            padding: 20px;
            border-radius: 20px;
            width: 190px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-family: sans-serif;
        }
        #custom-toggle-btn {
            position: absolute;
            right: -50px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 0 10px 10px 0;
            cursor: pointer;
            font-weight: bold;
        }
        .highlight-yellow { background-color: yellow !important; }
        .highlight-green { background-color: #D8FAD8 !important; }
        .opt-row { display: flex; align-items: center; gap: 5px; margin-top: 10px; }
    `);

    function start() {
        const table = document.querySelector('table[align="center"][width="97%"], #contents > table > tbody');
        if (!table) {
            setTimeout(start, 500);
            return;
        }

        const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
        const headerCells = Array.from(table.querySelectorAll('th'));
        const responseIndex = headerCells.findIndex(th => th.textContent.trim() === '回應');
        const posterIndex = headerCells.findIndex(th => th.textContent.trim() === '發文者');

        // 從 Tampermonkey 儲存空間讀取
        let minRepliesToShow = getSetting('minRepliesToShow', 0);
        let sortByReplies = getSetting('sortByReplies', false);
        let hidePoster = getSetting('hidePoster', false);

        // --- 建立 UI ---
        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'custom-options-container';

        const optionsPanel = document.createElement('div');
        optionsPanel.id = 'custom-options-panel';
        optionsPanel.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div>
                    <label for="min-replies-to-show">最小回應數</label>
                    <select id="min-replies-to-show">
                        <option value="0" ${minRepliesToShow === 0 ? 'selected' : ''}>0</option>
                        <option value="10" ${minRepliesToShow === 10 ? 'selected' : ''}>10</option>
                        <option value="30" ${minRepliesToShow === 30 ? 'selected' : ''}>30</option>
                        <option value="50" ${minRepliesToShow === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${minRepliesToShow === 100 ? 'selected' : ''}>100</option>
                    </select>
                </div>
                <div class="opt-row">
                    <label style="margin: 0;">按回應數排序</label>
                    <input type="checkbox" id="sort-by-replies" ${sortByReplies ? 'checked' : ''}>
                </div>
                <div class="opt-row">
                    <label style="margin: 0;">隱藏發文者</label>
                    <input type="checkbox" id="hide-poster" ${hidePoster ? 'checked' : ''}>
                </div>
            </div>
        `;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'custom-toggle-btn';
        toggleButton.textContent = '設定';

        optionsContainer.appendChild(optionsPanel);
        optionsContainer.appendChild(toggleButton);
        document.body.appendChild(optionsContainer);

        toggleButton.addEventListener('click', () => {
            const isVisible = optionsContainer.style.transform === 'translateX(0px)';
            optionsContainer.style.transform = isVisible ? 'translateX(-210px)' : 'translateX(0px)';
            toggleButton.textContent = isVisible ? '設定' : '收起';
        });

        const updateUI = () => {
            rows.forEach(row => {
                const replies = parseInt(row.cells[responseIndex]?.textContent.trim()) || 0;
                row.style.display = replies >= minRepliesToShow ? '' : 'none';

                row.classList.remove('highlight-yellow', 'highlight-green');
                row.style.fontWeight = 'normal';
                if (replies >= 100) {
                    row.classList.add('highlight-yellow');
                    row.style.fontWeight = 'bold';
                } else if (replies >= 50) {
                    row.classList.add('highlight-green');
                    row.style.fontWeight = 'bold';
                }

                if (posterIndex !== -1 && row.cells[posterIndex]) {
                    row.cells[posterIndex].style.display = hidePoster ? 'none' : '';
                }
            });

            if (posterIndex !== -1 && headerCells[posterIndex]) {
                headerCells[posterIndex].style.display = hidePoster ? 'none' : '';
            }

            if (sortByReplies) {
                const sortedRows = [...rows].sort((a, b) => {
                    const r1 = parseInt(a.cells[responseIndex]?.textContent.trim()) || 0;
                    const r2 = parseInt(b.cells[responseIndex]?.textContent.trim()) || 0;
                    return r2 - r1;
                });
                sortedRows.forEach(r => table.appendChild(r));
            } else {
                // 若不排序，則依原始順序重新添加
                rows.forEach(r => table.appendChild(r));
            }

            // 確保連結新視窗開啟
            document.querySelectorAll('a[href^="pixmicat.php?res="]').forEach(link => {
                link.target = '_blank';
                link.rel = 'noopener';
            });
        };

        // 監聽並使用 GM_setValue 儲存
        document.getElementById('min-replies-to-show').onchange = (e) => {
            minRepliesToShow = parseInt(e.target.value);
            saveSetting('minRepliesToShow', minRepliesToShow);
            updateUI();
        };
        document.getElementById('sort-by-replies').onchange = (e) => {
            sortByReplies = e.target.checked;
            saveSetting('sortByReplies', sortByReplies);
            updateUI();
        };
        document.getElementById('hide-poster').onchange = (e) => {
            hidePoster = e.target.checked;
            saveSetting('hidePoster', hidePoster);
            updateUI();
        };

        updateUI();
    }

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start);

})();