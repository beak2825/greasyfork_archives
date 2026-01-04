// ==UserScript==
// @name         抖音一键清屏
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  //抖音一键清屏
// @author       梦呓萤殇
// @match        https://www.douyin.com/
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452208/%E6%8A%96%E9%9F%B3%E4%B8%80%E9%94%AE%E6%B8%85%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/452208/%E6%8A%96%E9%9F%B3%E4%B8%80%E9%94%AE%E6%B8%85%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    var qingping = document.getElementsByClassName('xg-switch');
    var wei = "xg-switch"; // 未清屏状态
    var wei1 = "xg-switch xg-switch-checked"; // 清屏状态
    var isCleared = false;
    var lastClearTime = 0;
    var minClearInterval = 1000; // 最小清屏间隔时间（毫秒）

    // 添加监听器以检测页面变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var currentTime = Date.now();
            if (currentTime - lastClearTime >= minClearInterval) {
                clearScreen();
                lastClearTime = currentTime;
            }
        });
    });

    // 开始监听 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

    function clearScreen() {
        try {
            if (qingping.length > 0 && qingping[0].className == wei) {
                qingping[0].click();
                console.log("清屏了");
                isCleared = true;
            } else if (qingping.length > 0 && qingping[0].className == wei1) {
                if (isCleared) {
                    console.log("已清屏");
                    isCleared = false;
                }
            }
        } catch (error) {
            console.error("清屏操作时出现错误:", error);
        }
    }
})();
