// ==UserScript==
// @name Komica 檔案區自定義篩選與排序工具
// @namespace https://chat.openai.com/
// @description 這個腳本可以讓使用者自定義最小回覆數，按回覆數排序並且高亮顯示回覆數大於一定數值的貼文，新增隱藏發文者功能，新增設定隱藏標籤，修正隱藏發文者刷新失效，修正點擊開新分頁刷新失效。
// @version      3.0.7
// @author ChatGPT
// @match https://*.komica1.org/*/pixmicat.php?mode=module&load=mod_threadlist*
// @icon https://www.google.com/s2/favicons?sz=64&domain=komica.org
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474082/Komica%20%E6%AA%94%E6%A1%88%E5%8D%80%E8%87%AA%E5%AE%9A%E7%BE%A9%E7%AF%A9%E9%81%B8%E8%88%87%E6%8E%92%E5%BA%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/474082/Komica%20%E6%AA%94%E6%A1%88%E5%8D%80%E8%87%AA%E5%AE%9A%E7%BE%A9%E7%AF%A9%E9%81%B8%E8%88%87%E6%8E%92%E5%BA%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 從 localStorage 中獲取設定
    let minRepliesToShow = parseInt(localStorage.getItem('minRepliesToShow')) || 0;
    let sortByReplies = localStorage.getItem('sortByReplies') === 'true';
    let hidePoster = localStorage.getItem('hidePoster') === 'true';

    // 選擇表格並獲取行與欄索引
    const table = document.querySelector('table[align="center"][width="97%"], #contents > table > tbody');
    if (!table) return; // 若表格不存在，終止腳本
    const rows = Array.from(table.querySelectorAll('tr:not(:first-child)'));
    const headerCells = Array.from(table.querySelectorAll('th'));
    const responseIndex = headerCells.findIndex(th => th.textContent.trim() === '回應');
    const posterIndex = headerCells.findIndex(th => th.textContent.trim() === '發文者');
    let rowsArray = [];

    // 創建漂浮框容器
    const optionsContainer = document.createElement('div');
    optionsContainer.style.position = 'fixed';
    optionsContainer.style.left = '0';
    optionsContainer.style.bottom = '20px';
    optionsContainer.style.zIndex = '1000';
    optionsContainer.style.transition = 'transform 0.3s ease';
    optionsContainer.style.transform = 'translateX(-210px)'; // 預設隱藏

    // 創建設定面板
    const optionsPanel = document.createElement('div');
    optionsPanel.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div>
                <label for="min-replies-to-show">最小回應數</label>
                <select id="min-replies-to-show" name="min-replies-to-show">
                    <option value="0" ${minRepliesToShow === 0 ? 'selected' : ''}>0</option>
                    <option value="10" ${minRepliesToShow === 10 ? 'selected' : ''}>10</option>
                    <option value="30" ${minRepliesToShow === 30 ? 'selected' : ''}>30</option>
                    <option value="50" ${minRepliesToShow === 50 ? 'selected' : ''}>50</option>
                    <option value="100" ${minRepliesToShow === 100 ? 'selected' : ''}>100</option>
                </select>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
                <label for="sort-by-replies" style="margin: 0;">按回應數排序</label>
                <input type="checkbox" id="sort-by-replies" name="sort-by-replies" ${sortByReplies ? 'checked' : ''}>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
                <label for="hide-poster" style="margin: 0;">隱藏發文者</label>
                <input type="checkbox" id="hide-poster" name="hide-poster" ${hidePoster ? 'checked' : ''}>
            </div>
        </div>
    `;
    optionsPanel.style.backgroundColor = 'white';
    optionsPanel.style.color = 'red';
    optionsPanel.style.padding = '20px';
    optionsPanel.style.borderRadius = '20px';
    optionsPanel.style.width = '190px';
    optionsPanel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // 創建展開/收起按鈕
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '設定';
    toggleButton.style.position = 'absolute';
    toggleButton.style.right = '-50px';
    toggleButton.style.top = '50%';
    toggleButton.style.transform = 'translateY(-50%)';
    toggleButton.style.backgroundColor = '#ff4444';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.padding = '10px';
    toggleButton.style.borderRadius = '0 10px 10px 0';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontWeight = 'bold';

    // 將面板和按鈕添加到容器
    optionsContainer.appendChild(optionsPanel);
    optionsContainer.appendChild(toggleButton);
    document.body.appendChild(optionsContainer);

    // 按鈕點擊切換顯示/隱藏
    let isPanelVisible = false;
    toggleButton.addEventListener('click', () => {
        isPanelVisible = !isPanelVisible;
        optionsContainer.style.transform = isPanelVisible ? 'translateX(0)' : 'translateX(-210px)';
        toggleButton.textContent = isPanelVisible ? '收起' : '設定';
    });

    // 獲取輸入元素
    const minRepliesToShowInput = document.getElementById('min-replies-to-show');
    const sortByRepliesInput = document.getElementById('sort-by-replies');
    const hidePosterInput = document.getElementById('hide-poster');

    // 應用最小回覆數篩選
    function applyMinRepliesFilter() {
        rows.forEach(row => {
            const replies = parseInt(row.cells[responseIndex]?.textContent.trim()) || 0;
            row.style.display = replies >= minRepliesToShow ? '' : 'none';
        });
    }

    // 應用隱藏發文者
    function applyHidePoster() {
        if (posterIndex === -1) return; // 若無發文者欄位，跳過
        const displayStyle = hidePoster ? 'none' : '';
        rows.forEach(row => {
            if (row.cells[posterIndex]) row.cells[posterIndex].style.display = displayStyle;
        });
        if (headerCells[posterIndex]) headerCells[posterIndex].style.display = displayStyle;
    }

    // 設置回覆連結新視窗開啟
    function setReplyLinksTarget() {
        const replyLinks = document.querySelectorAll('a[href^="pixmicat.php?res="]');
        replyLinks.forEach(link => {
            link.target = '_blank';
            link.rel = 'noopener'; // 安全考慮
        });
    }

    // 初始應用篩選、隱藏發文者和連結設定
    applyMinRepliesFilter();
    applyHidePoster();
    setReplyLinksTarget();

    // 最小回覆數變更事件
    minRepliesToShowInput.addEventListener('change', (event) => {
        minRepliesToShow = parseInt(event.target.value);
        localStorage.setItem('minRepliesToShow', minRepliesToShow);
        applyMinRepliesFilter();
    });

    // 排序方式變更事件
    sortByRepliesInput.addEventListener('change', (event) => {
        sortByReplies = event.target.checked;
        localStorage.setItem('sortByReplies', sortByReplies);
        if (sortByReplies) {
            sortRows();
        } else {
            restoreRowOrder();
        }
    });

    // 隱藏發文者變更事件
    hidePosterInput.addEventListener('change', (event) => {
        hidePoster = event.target.checked;
        localStorage.setItem('hidePoster', hidePoster);
        applyHidePoster();
    });

    // 恢復原始行順序
    function restoreRowOrder() {
        rows.forEach(row => table.appendChild(row));
    }

    // 按回覆數排序
    function sortRows() {
        rowsArray = Array.from(rows);
        rowsArray.sort((row1, row2) => {
            const response1 = parseInt(row1.cells[responseIndex]?.textContent.trim()) || 0;
            const response2 = parseInt(row2.cells[responseIndex]?.textContent.trim()) || 0;
            return response2 - response1;
        });
        rowsArray.forEach(row => table.appendChild(row));
    }

    // 初始化排序
    if (sortByReplies) sortRows();

    // 添加高亮樣式
    const style = document.createElement('style');
    style.innerHTML = `
        .highlight-yellow { background-color: yellow  }
        .highlight-green { background-color: #D8FAD8; }
    `;
    document.head.appendChild(style);

    // 應用高亮
    rows.forEach(row => {
        const replies = parseInt(row.cells[responseIndex]?.textContent.trim()) || 0;
        if (replies >= 100) {
            row.classList.remove('ListRow1_bg', 'ListRow2_bg');
            row.classList.add('highlight-yellow');
            row.style.fontWeight = 'bold';
        } else if (replies >= 50) {
            row.classList.remove('ListRow1_bg', 'ListRow2_bg');
            row.classList.add('highlight-green');
            row.style.fontWeight = 'bold';
        }
    });

    // 頁面加載完成後應用設定
    window.addEventListener('load', () => {
        // 設置下拉選單和勾選框
        minRepliesToShowInput.value = minRepliesToShow;
        sortByRepliesInput.checked = sortByReplies;
        hidePosterInput.checked = hidePoster;

        // 應用篩選、隱藏和連結設定
        applyMinRepliesFilter();
        applyHidePoster();
        setReplyLinksTarget();

        // 延遲再次設置連結，處理動態載入
        setTimeout(setReplyLinksTarget, 1000);

        // 恢復排序
        if (!sortByReplies) restoreRowOrder();
    });

    // 動態監聽回覆連結點擊
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a[href^="pixmicat.php?res="]');
        if (target) {
            event.preventDefault();
            window.open(target.href, '_blank');
        }
    });
})();