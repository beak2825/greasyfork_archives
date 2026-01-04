// ==UserScript==
// @name         Cybozu ChatGAI Keyboard shortcut
// @namespace    https://github.com/forestsheep911/gai-short-cut
// @version      0.1.2
// @description  It's too much trouble if you can only use the mouse to click.
// @author       Bxu
// @copyright    Bxu
// @license      MIT
// @match        https://chatgai.dev.cybozu.co.jp/*
// @run-at       document-idle
// @icon         https://img.icons8.com/officel/16/bot.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482277/Cybozu%20ChatGAI%20Keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/482277/Cybozu%20ChatGAI%20Keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const sendBtn = document.getElementsByClassName('btn mx-1')[0]
            if (sendBtn) {
                sendBtn.click();
            }
        }
    });
})();