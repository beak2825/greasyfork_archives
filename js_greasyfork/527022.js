// ==UserScript==
// @name         AntiFlip
// @version      2025-02-14
// @description  Disable Flipping in HF
// @author       NovoDev
// @match        https://hackforums.net/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1435467
// @downloadURL https://update.greasyfork.org/scripts/527022/AntiFlip.user.js
// @updateURL https://update.greasyfork.org/scripts/527022/AntiFlip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function getUsername() {
        const usernameElement = getElementByXPath('/html/body/div[3]/div[1]/div[2]/div[1]/div/span/strong/a');
        return usernameElement ? usernameElement.textContent : 'Unknown';
    }

    function simulateClick(element) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    function isConvoPage() {
        return window.location.href.includes('/convo.php');
    }

    const inputField = getElementByXPath('//*[@id="comment"]');
    const sendButton = getElementByXPath('/html/body/div[3]/div[3]/div/div[3]/div[3]/div/div[2]/div[4]/form/div/input');
    const username = getUsername();

    if (isConvoPage() && inputField && sendButton) {
        inputField.addEventListener('input', function(event) {
            const text = inputField.value;

            if (text.match(/\/(flip|jackpot)/i)) {
                if (text.toLowerCase().includes('/flip')) {
                    inputField.value = `${username} just tried to flip! but his script disabled flipping.`;
                } else if (text.toLowerCase().includes('/jackpot')) {
                    inputField.value = `${username} just tried to hit the jackpot! but his script disabled jackpot.`;
                }
                simulateClick(sendButton);
            }
        });
    }
})();