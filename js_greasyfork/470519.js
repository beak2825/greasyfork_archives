// ==UserScript==
// @name         抖音一键清屏和删除点赞评论等按钮
// @namespace    http://tampermonkey.net/
// @version      3.2（报废版）
// @description  抖音一键清屏和删除特定代码
// @author       梦呓萤殇
// @match        https://www.douyin.com/
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470519/%E6%8A%96%E9%9F%B3%E4%B8%80%E9%94%AE%E6%B8%85%E5%B1%8F%E5%92%8C%E5%88%A0%E9%99%A4%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA%E7%AD%89%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/470519/%E6%8A%96%E9%9F%B3%E4%B8%80%E9%94%AE%E6%B8%85%E5%B1%8F%E5%92%8C%E5%88%A0%E9%99%A4%E7%82%B9%E8%B5%9E%E8%AF%84%E8%AE%BA%E7%AD%89%E6%8C%89%E9%92%AE.meta.js
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

    // 创建一个 MutationObserver 实例，用于监视页面变化
    var observer2 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                // 检查节点是否是要删除的代码段
                if (
                    node instanceof HTMLElement &&
                    node.classList.contains('OFZHdvpl') &&
                    node.classList.contains('immersive-player-switch-on-hide-interaction-area')
                ) {
                    // 删除代码段节点
                    node.remove();
                }
            });
        });
    });

    // 启动 MutationObserver，监视整个文档的变化
    observer2.observe(document, { childList: true, subtree: true });
})();
