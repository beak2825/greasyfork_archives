// ==UserScript==
// @name         Catbox.moe to ChanWiki Converter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Convert Catbox.moe links to ChanWiki gallery and image formats and copy to clipboard
// @match        https://catbox.moe/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502164/Catboxmoe%20to%20ChanWiki%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/502164/Catboxmoe%20to%20ChanWiki%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(text, icon) {
        const button = document.createElement('button');
        button.innerHTML = `<span style="margin-right: 5px;">${icon}</span>${text}`;
        button.style.marginRight = '10px';
        button.style.padding = '8px 16px';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.color = '#ffffff';
        button.style.backgroundColor = '#2c3e50';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.style.display = 'flex';
        button.style.alignItems = 'center';

        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#34495e';
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#2c3e50';
        });

        return button;
    }

    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';

    const imageButton = createButton('Save as image', '🖼️');

    const galleryButton = createButton('Save as gallery', '🖼️🖼️');

    function getMatches() {
        const regex = /https:\/\/files\.catbox\.moe\/[a-zA-Z0-9]+\.[a-zA-Z]+/g;
        const pageText = document.body.innerText;
        return pageText.match(regex);
    }

    function showCopiedMessage(button, originalText, originalIcon) {
        const originalBackground = button.style.backgroundColor;
        button.innerHTML = '<span style="margin-right: 5px;">✅</span>Copied!';
        button.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            button.innerHTML = `<span style="margin-right: 5px;">${originalIcon}</span>${originalText}`;
            button.style.backgroundColor = originalBackground;
        }, 2000);
    }

    imageButton.addEventListener('click', function() {
        const matches = getMatches();
        let imageText = '';
        if (matches) {
            matches.forEach(url => {
                imageText += `{{ObrazekNowy|l=${url}|float=right}}\n`;
            });
            copyToClipboard(imageText.trim());
            showCopiedMessage(imageButton, 'Save as image', '🖼️');
        } else {
            this.innerHTML = '<span style="margin-right: 5px;">❌</span>No links found';
            setTimeout(() => {
                this.innerHTML = '<span style="margin-right: 5px;">🖼️</span>Save as image';
            }, 2000);
        }
    });

    galleryButton.addEventListener('click', function() {
        const matches = getMatches();
        let galleryText = '';
        if (matches) {
            matches.forEach(url => {
                galleryText += `{{Obrazek2|l=${url}}}\n`;
            });
            copyToClipboard(galleryText.trim());
            showCopiedMessage(galleryButton, 'Save as gallery', '🖼️🖼️');
        } else {
            this.innerHTML = '<span style="margin-right: 5px;">❌</span>No links found';
            setTimeout(() => {
                this.innerHTML = '<span style="margin-right: 5px;">🖼️🖼️</span>Save as gallery';
            }, 2000);
        }
    });

    buttonContainer.appendChild(imageButton);
    buttonContainer.appendChild(galleryButton);

    document.body.appendChild(buttonContainer);
})();