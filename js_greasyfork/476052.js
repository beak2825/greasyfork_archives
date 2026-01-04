// ==UserScript==
// @name         继续学习
// @namespace    kai
// @version      1.0
// @description  监控继续学习弹窗并模拟鼠标点击按钮
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/476052/%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/476052/%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监控弹窗
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                var button = document.querySelector('button[type="button"]');
                if (button) {
                    button.click();
                }
            }
        });
    });

    // 配置观察选项
    var config = { childList: true, subtree: true };

    // 开始观察
    observer.observe(document.body, config);
})();