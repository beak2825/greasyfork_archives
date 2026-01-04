// ==UserScript==
// @name         搭伙
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快速點餐
// @author       Yich
// @match        https://imenu.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imenu.com.tw
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js
// @downloadURL https://update.greasyfork.org/scripts/520331/%E6%90%AD%E4%BC%99.user.js
// @updateURL https://update.greasyfork.org/scripts/520331/%E6%90%AD%E4%BC%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義要隱藏的文字
    var arr = ["小白兔暖暖包", "海苔堅果棒","🥤","團購","餃子","肉圓","燒臘","烤吐司","小火鍋","炒麵","捲餅","麵線","春和捲食","福星麵館"];
    //將常用的店家排序在前面
    var topStore = ["池上便當","弍食穗","蛋白盒子"];

    // 隱藏 h5 中特定文字的元素
    function hideElements(jNode) {
        arr.forEach(text => {
            jNode.filter(`:contains('${text}')`).each(function() {
                const element = $(this);
                element.hide();
                const par = element.closest('span[class^="menu-tab-"]');
                if(par.length) {
                    par.css('display','none');
                }
            });
        });
    }

    // 隱藏 meal-header 中包含特定文字的 h2 與其上層 category
    function hideHeaders(jNode) {
        jNode.each(function() {
            var h2 = $(this);
            if (arr.some(text => h2.text().includes(text))) {
                h2.closest('.meal-header').css('display','none');
                var categoryDiv = h2.closest('div[class^="category-id-"]');
                if (categoryDiv.length) {
                    categoryDiv.css('display','none');
                }
            }
        });
        moveFrequencyStore();
    }

    // 隱藏公告
    function hidePopup() {

        const buttonElement = document.querySelector('.el-drawer__close-btn');
        if (buttonElement) {
            buttonElement.click(); // 模擬按下按鈕
        }
    }

    //將常用的店家移到前面
    function moveFrequencyStore(){
        // 想要排序在前的店家列表


        // 取得「菜單頁，餐點分類標籤」區塊
        const categoryBar = document.querySelector('section[ui_name="菜單頁，餐點分類標籤"] .category-bar .tag-group');
        // 取得「菜單頁，餐點列表」區塊
        const mealList = document.querySelector('section[ui_name="菜單頁，餐點列表"].meal-list');

        if (!categoryBar || !mealList) {
            console.log("找不到指定的區塊");
            return;
        }

        // 我們將符合 topStore 名稱的 item 推入一個暫存的陣列，稍後統一排序
        const matchedItems = [];

        //找出這家店的id
        topStore.forEach(name => {
            // 從 categoryBar 找到符合 name 的 h5
            const h5Candidates = categoryBar.querySelectorAll('h5');
            const h5 = Array.from(h5Candidates).find(h => h.textContent.trim().includes(name));
            if (h5) {
                const span = h5.closest('span[class^="menu-tab-"]');
                if (span) {
                    // span 的 class 應該像 "menu-tab-112514"
                    const spanClass = Array.from(span.classList).find(c => c.startsWith('menu-tab-'));
                    if (spanClass) {
                        // 從 class 中取得 id
                        const id = spanClass.replace('menu-tab-', '');
                        matchedItems.push({ name, id, span });
                    }
                }
            }
        });
        //console.log(matchedItems);
        // matchedItems 中現在有 {name, id, span} 物件
        // 我們需要根據 matchedItems 的順序將對應的 category-id-xxxx 移動

        matchedItems.forEach(item => {
            const { id, span } = item;

            // 找出對應的 category-id-x
            const categoryDiv = mealList.querySelector(`.category-id-${id}`);
            if (categoryDiv) {
                // 將該 categoryDiv 移到 mealList 最前面
                mealList.insertBefore(categoryDiv, mealList.firstChild);
            }

            // 將 span 移到 categoryBar 最前面
            categoryBar.insertBefore(span, categoryBar.firstChild);
        });
    }

    // 使用 waitForKeyElements 偵測並處理目標元素
    waitForKeyElements("h5", hideElements);
    waitForKeyElements("section.meal-header h2", hideHeaders);
    waitForKeyElements('div[aria-modal="true"][aria-label="店家公告"]', hidePopup);
})();
