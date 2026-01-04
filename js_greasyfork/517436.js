// ==UserScript==
// @name     Telegram-mini-app-start
// @name:ja     テレグラムミニアプリ自動スタート
// @match    https://web.telegram.org/*
// @namespace    https://blog.nyanco.me/telegram-mini-app-play-btn-auto-click/
// @version      1.0
// @description  A super simple hack script that automatically clicks the start button of the Telegram mini app! Let's enjoy it little by little!
// @description:ja  テレグラムのミニアプリのスタートボタンを自動クリックする超シンプルなハックスクリプト！少しずつ楽しよう！
// @author       Nikutama(https://x.com/MeatBallCat2929)
// @match    https://web.telegram.org/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517436/Telegram-mini-app-start.user.js
// @updateURL https://update.greasyfork.org/scripts/517436/Telegram-mini-app-start.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        console.log('Page has been fully loaded');

        // Execute with a slight delay (adjust as needed)
        setTimeout(function() {
            // Get button element using XPath
            var xpath = "//div[contains(@class, 'new-message-bot-commands')]";
            var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var button = result.singleNodeValue;

            // Click the button if it exists
            if (button) {
                console.log('Button found. Clicking.');
                button.click();
            } else {
                console.log('Button not found.');
            }
        }, 2000); // Execute after x seconds (adjust as needed) 1000 = 1 second
    });
})();