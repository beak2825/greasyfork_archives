// ==UserScript==
// @name         chatgpt自动点击继续按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在对话中检测停止并自动点击继续，可以自定义间隔时间
// @author       mellow，chatgpt
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469352/chatgpt%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/469352/chatgpt%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义循环检测的间隔时间（毫秒）
    var interval = 500;

    function checkAndClickButton() {
        var buttons = document.querySelectorAll('button.btn.relative.btn-neutral.border-0.md\\:border');
        for (var i = 0; i < buttons.length; i++) {
            var buttonText = buttons[i].innerText.trim();
            if (buttonText === 'Continue generating') {
                buttons[i].click();
                break; 
            }
        }
    }

    setInterval(checkAndClickButton, interval);
})();
