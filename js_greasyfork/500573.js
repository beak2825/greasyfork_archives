// ==UserScript==
// @name         Plain Text for CS Trade Rules
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to toggle between plain text with/without images and normal html on CS Trade Rules
// @author       OreozHere
// @match        *://www.chickensmoothie.com/trades/edittrade.php?partner=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500573/Plain%20Text%20for%20CS%20Trade%20Rules.user.js
// @updateURL https://update.greasyfork.org/scripts/500573/Plain%20Text%20for%20CS%20Trade%20Rules.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function plainTextWithImages(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const elements = tempDiv.querySelectorAll('*');
        elements.forEach(element => {
            if (element.tagName !== 'IMG') {
                element.removeAttribute('style');
            }
        });

        return tempDiv.innerHTML;
    }

    function plainTextNoSpecial(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        tempDiv.querySelectorAll('*').forEach(element => {
            element.removeAttribute('style');
        });

        tempDiv.querySelectorAll('img').forEach(img => img.remove());

        return tempDiv.innerHTML;
    }

    function toggleMessage(event) {
        event.preventDefault();
        const messageDiv = event.target.closest('.rulessection').querySelector('.message');
        const originalHTML = messageDiv.getAttribute('data-original-html');
        const plainTextWithImagesHTML = plainTextWithImages(originalHTML);
        const plainTextNoSpecialHTML = plainTextNoSpecial(originalHTML);

        if (messageDiv.getAttribute('data-display-mode') === 'plain-text-with-images') {
            messageDiv.innerHTML = plainTextNoSpecialHTML;
            messageDiv.setAttribute('data-display-mode', 'plain-text-no-special');
        } else if (messageDiv.getAttribute('data-display-mode') === 'plain-text-no-special') {
            messageDiv.innerHTML = originalHTML;
            messageDiv.setAttribute('data-display-mode', 'normal');
        } else {
            messageDiv.innerHTML = plainTextWithImagesHTML;
            messageDiv.setAttribute('data-display-mode', 'plain-text-with-images');
        }
    }

    const messages = document.querySelectorAll('.rulessection');

    messages.forEach(message => {
        const header = message.querySelector('.header');
        const messageDiv = message.querySelector('.message');

        messageDiv.setAttribute('data-original-html', messageDiv.innerHTML);

        const toggleButton = document.createElement('button');
        toggleButton.innerText = ' Toggle Display ';
        toggleButton.style.marginLeft = '10px';
        toggleButton.title = 'Toggles Display Mode';
        toggleButton.addEventListener('click', toggleMessage);

        const hideButton = header.querySelector('.clicktohide');
        header.insertBefore(toggleButton, hideButton.nextSibling);

        messageDiv.innerHTML = messageDiv.getAttribute('data-original-html');
        messageDiv.setAttribute('data-display-mode', 'normal');
    });
})();
