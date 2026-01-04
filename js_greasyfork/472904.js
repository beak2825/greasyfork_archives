// ==UserScript==
// @name         Simpleicons.org Dynamic Colors
// @namespace    https://github.com/appel/userscripts
// @version      0.0.3
// @description  Allows you to customize the color of the svg before download.
// @author       Ap
// @match        https://simpleicons.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472904/Simpleiconsorg%20Dynamic%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/472904/Simpleiconsorg%20Dynamic%20Colors.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isColorDark(hexcolor) {
        const r = parseInt(hexcolor.substr(1, 2), 16);
        const g = parseInt(hexcolor.substr(3, 2), 16);
        const b = parseInt(hexcolor.substr(5, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }

    function expandHex(hex) {
        if (hex.length === 4) {
            return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        return hex;
    }

    function addCustomColorButton() {
        const iconColorButton = document.querySelector('#icon-color');
        if (iconColorButton && !document.querySelector('.custom-color-btn')) {
            const customColorButton = document.createElement('button');
            customColorButton.innerText = 'Custom color';
            customColorButton.classList.add('custom-color-btn');
            customColorButton.style.cssText = "position:absolute;top:10px;right:10px;width:fit-content;font-family:var(--font-family-stylized);font-size:13px;color:var(--color-button-text);background:#000;border-radius:4px;padding:4px 8px;cursor:pointer;";
            customColorButton.addEventListener('click', function () {
                const hexcode = prompt('Please enter hex code for color.');
                if (hexcode && /^#?([0-9A-Fa-f]{3}){1,2}$/.test(hexcode)) {
                    let formattedHexcode = hexcode.startsWith("#") ? hexcode : `#${hexcode}`;
                    formattedHexcode = expandHex(formattedHexcode);
                    const downloadLink = document.querySelector('#icon-download-color-svg');
                    if (downloadLink) {
                        const svgFillRegex = /%23[0-9A-Fa-f]{6}/i;
                        if (svgFillRegex.test(downloadLink.href)) {
                            downloadLink.href = downloadLink.href.replace(svgFillRegex, `%23${formattedHexcode.slice(1)}`);
                            downloadLink.setAttribute("download", downloadLink.getAttribute("download").replace("-color.svg", `-${formattedHexcode.slice(1)}.svg`));
                        }
                    }
                    iconColorButton.innerText = formattedHexcode;
                    iconColorButton.style.background = formattedHexcode;
                    if (isColorDark(formattedHexcode)) {
                        iconColorButton.style.color = "#ffffff";
                    } else {
                        iconColorButton.style.color = "#000000";
                    }
                } else {
                    alert('Invalid hex code. Please enter a valid hex color.');
                }
            });
            iconColorButton.insertAdjacentElement('afterend', customColorButton);
        }
    }

    const observer = new MutationObserver(addCustomColorButton);
    observer.observe(document.body, { childList: true, subtree: true });

    addCustomColorButton();

})();
