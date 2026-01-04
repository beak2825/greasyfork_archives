// ==UserScript==
// @name         My Firefox Greasemonkey Script
// @namespace    http://your-namespace.example.com
// @version      0.1
// @description  My awesome userscript
// @author       You
// @license MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480091/My%20Firefox%20Greasemonkey%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/480091/My%20Firefox%20Greasemonkey%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.style.position = 'fixed';
    toolbar.style.top = '0';
    toolbar.style.left = '0';
    toolbar.style.zIndex = '9999';
    toolbar.style.background = '#fff';
    toolbar.style.padding = '10px';

    // Hide/show button
    const hideButton = document.createElement('button');
    hideButton.textContent = '隐藏';
    hideButton.onclick = toggleToolbar;
    toolbar.appendChild(hideButton);

    // Disable animations button
    const disableAnimationButton = document.createElement('button');
    disableAnimationButton.textContent = '禁用动画';
    disableAnimationButton.onclick = disableAnimations;
    toolbar.appendChild(disableAnimationButton);

    // Font size button
    const fontSizeButton = document.createElement('button');
    fontSizeButton.textContent = '字号';
    fontSizeButton.onclick = showFontSizeMenu;
    toolbar.appendChild(fontSizeButton);

    // Black on white button
    const blackOnWhiteButton = document.createElement('button');
    blackOnWhiteButton.textContent = '白底黑字';
    blackOnWhiteButton.onclick = setBlackOnWhite;
    toolbar.appendChild(blackOnWhiteButton);

    // White on black button
    const whiteOnBlackButton = document.createElement('button');
    whiteOnBlackButton.textContent = '黑底白字';
    whiteOnBlackButton.onclick = setWhiteOnBlack;
    toolbar.appendChild(whiteOnBlackButton);

    // Scroll up button
    const scrollUpButton = document.createElement('button');
    scrollUpButton.textContent = '向上';
    scrollUpButton.onclick = scrollUp;
    toolbar.appendChild(scrollUpButton);

    // Scroll down button
    const scrollDownButton = document.createElement('button');
    scrollDownButton.textContent = '向下';
    scrollDownButton.onclick = scrollDown;
    toolbar.appendChild(scrollDownButton);

    document.body.appendChild(toolbar);

    // Functions
    function toggleToolbar() {
        toolbar.style.display = (toolbar.style.display === 'none' || toolbar.style.display === '') ? 'block' : 'none';
    }

    function disableAnimations() {
        document.styleSheets[0].insertRule('* { transition: none !important; animation: none !important; }', 0);
    }

    function showFontSizeMenu() {
        const fontSizeMenu = document.createElement('div');
        fontSizeMenu.style.position = 'fixed';
        fontSizeMenu.style.top = '50px';
        fontSizeMenu.style.left = '0';
        fontSizeMenu.style.zIndex = '9999';
        fontSizeMenu.style.background = '#fff';
        fontSizeMenu.style.padding = '10px';

        const percentages = ['75%', '90%', '100%', '125%', '150%', '175%', '200%'];

        percentages.forEach((percentage) => {
            const button = document.createElement('button');
            button.textContent = percentage;
            button.onclick = () => setFontSize(percentage);
            fontSizeMenu.appendChild(button);
        });

        document.body.appendChild(fontSizeMenu);
    }

    function setFontSize(percentage) {
        document.body.style.fontSize = percentage;
    }

    function setBlackOnWhite() {
        document.body.style.color = '#000';
        document.body.style.backgroundColor = '#fff';
    }

    function setWhiteOnBlack() {
        document.body.style.color = '#fff';
        document.body.style.backgroundColor = '#000';
    }

    function scrollUp() {
        window.scrollBy(0, -window.innerHeight * 0.8);
    }

    function scrollDown() {
        window.scrollBy(0, window.innerHeight * 0.8);
    }

})();