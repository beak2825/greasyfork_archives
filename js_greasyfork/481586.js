// ==UserScript==
// @name         MyKirito Auto Reload and Click
// @namespace    https://github.com/JCxYIS/mykirito_autoscript
// @version      1.3
// @description  自動重新整理 MyKirito 網頁以解決連續點擊問題，並在必要時點擊「認真對決」按鈕
// @author       Skywalker
// @match        https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481586/MyKirito%20Auto%20Reload%20and%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/481586/MyKirito%20Auto%20Reload%20and%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var continuousInvalidClick = 0;
    var reloadInterval = 1; // 重新整理間隔時間（單位：分鐘）
    var clickTimeout = 500; // 按下「認真對決」按鈕後的等待時間（單位：毫秒）

    setInterval(function() {
        // 檢查是否需要重新整理
        if (continuousInvalidClick >= 1) {
            console.log("無效點擊達 1 次。重新整理頁面中...");
            location.reload(true);
        }
    }, reloadInterval * 60 * 1000); // 每隔指定的時間檢查一次

    // 監聽點擊事件，更新連續無效點擊次數
    document.addEventListener('click', function(event) {
        var target = event.target;
        if (target.tagName === 'BUTTON' && target.disabled) {
            continuousInvalidClick++;
            if (continuousInvalidClick >= 2) {
                console.log("無效點擊達 2 次，準備重新整理...");
                location.reload(true);
            }
        }
    });

    // 等待 MyKirito 網頁加載完成後，再尋找「認真對決」按鈕
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var addedNodes = mutation.addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                var addedNode = addedNodes[i];
                if (addedNode.tagName === 'BUTTON' && addedNode.textContent.includes('認真對決')) {
                    console.log("發現「認真對決」按鈕");
                    // 自動點擊「認真對決」按鈕
                    setTimeout(function() {
                        addedNode.click();
                        console.log("已點擊「認真對決」按鈕");
                        // 停止觀察
                        observer.disconnect();
                    }, clickTimeout);
                    return;
                }
            }
        });
    });

    // 開始觀察 document.body 的變化
    observer.observe(document.body, { childList: true, subtree: true });
})();
