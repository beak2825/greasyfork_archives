// ==UserScript==
// @name         Plain Text for CS Forums
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to toggle between plain text with/without images and normal html on CS Forum Posts
// @author       OreozHere
// @match        *://www.chickensmoothie.com/Forum/viewtopic.php?f=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500580/Plain%20Text%20for%20CS%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/500580/Plain%20Text%20for%20CS%20Forums.meta.js
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
        const postBody = event.target.closest('.postbody');
        const contentDiv = postBody.querySelector('.content');

        if (!contentDiv) return;

        const originalHTML = contentDiv.getAttribute('data-original-html');
        const plainTextWithImagesHTML = plainTextWithImages(originalHTML);
        const plainTextNoSpecialHTML = plainTextNoSpecial(originalHTML);

        if (contentDiv.getAttribute('data-display-mode') === 'plain-text-with-images') {
            contentDiv.innerHTML = plainTextNoSpecialHTML;
            contentDiv.setAttribute('data-display-mode', 'plain-text-no-special');
        } else if (contentDiv.getAttribute('data-display-mode') === 'plain-text-no-special') {
            contentDiv.innerHTML = originalHTML;
            contentDiv.setAttribute('data-display-mode', 'normal');
        } else {
            contentDiv.innerHTML = plainTextWithImagesHTML;
            contentDiv.setAttribute('data-display-mode', 'plain-text-with-images');
        }
    }

    const postBodies = document.querySelectorAll('div.postbody');

    postBodies.forEach(postBody => {
        const contentDiv = postBody.querySelector('.content');

        if (contentDiv) {
            const originalHTML = contentDiv.innerHTML;

            contentDiv.setAttribute('data-original-html', originalHTML);
            contentDiv.setAttribute('data-display-mode', 'normal');

            const toggleButton = document.createElement('button');
            toggleButton.textContent = ' Display ';
            toggleButton.title = 'Toggles Display Mode';
            toggleButton.style.margin = '3px 0 3px 5px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.addEventListener('click', toggleMessage);

            const ulProfileIcons = postBody.querySelector('ul.profile-icons');
            if (ulProfileIcons) {
                const firstIcon = ulProfileIcons.querySelector('li');
                if (firstIcon) {
                    ulProfileIcons.insertBefore(toggleButton, firstIcon);
                } else {
                    ulProfileIcons.appendChild(toggleButton);
                }
            }
        }
    });
})();
