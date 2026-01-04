// ==UserScript==
// @name         Halo Editor To Rtl
// @namespace    editorRtl
// @version      1.0.0
// @description  ئاساسلىقى Halo رامكىسىنىڭ سۈكۈتتىكى تەھرىرلىگۈچىنى ئۇيغۇرچىغا ماسلاشتۇرۇش ئۈچۈن ئىشلىتىتلىدۇ.
// @author       ئابدۇكېرېم غۇجابدۇللا
// @homepage     https://www.darwish.top/
// @match       */console/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/490076/Halo%20Editor%20To%20Rtl.user.js
// @updateURL https://update.greasyfork.org/scripts/490076/Halo%20Editor%20To%20Rtl.meta.js
// ==/UserScript==

(function() {
    // Function to toggle button text and append ID
    function toggleTextAndId() {
        var button = document.getElementById('myButton');
        var targetElement = document.querySelector('.editor.border-t');
        var contentElement = document.querySelector('.editor-content.markdown-body.flex-1.relative.bg-white.overflow-y-auto');
        var bgWhiteElement = document.querySelector('.h-full.border-l.bg-white');

        if (button.textContent === 'RTL') {
            button.textContent = 'LTR';
            // Append 'ugStyle' to the existing ID of the target element
            targetElement.id += 'ugStyle';
            // Add font-family rule to the content element
            contentElement.style.fontFamily = "'UKIJ Ekran'";
            // Change border width property
            bgWhiteElement.style.borderRightWidth = '1px';
            bgWhiteElement.style.borderLeftWidth = '0'; // Reset border-left-width
        } else {
            button.textContent = 'RTL';
            // Remove 'ugStyle' from the ID of the target element
            targetElement.id = targetElement.id.replace('ugStyle', '').trim();
            // Remove font-family rule from the content element
            contentElement.style.fontFamily = '';
            // Reset border width property
            bgWhiteElement.style.borderLeftWidth = '1px';
            bgWhiteElement.style.borderRightWidth = '0'; // Reset border-right-width
        }
    }

    // Create a link element for the main stylesheet
    var mainLink = document.createElement('link');
    mainLink.rel = 'stylesheet';
    mainLink.type = 'text/css';
    mainLink.href = 'https://www.darwish.top/themes/theme-Joe3/assets/css/ugStyle.css';
    document.head.appendChild(mainLink);

    // Create a style element for additional CSS rules
    var style = document.createElement('style');
    var css = '#myButton { padding:10px 15px;color:#ffffff; position: fixed; bottom: 20px; right: 20px; z-index: 9999;background-color: #056b00;border-radius: 22px; }';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Create a button element
    var button = document.createElement('button');
    button.textContent = 'RTL';
    button.id = 'myButton';
    button.onclick = toggleTextAndId; // Add event listener to toggle button text and ID
    document.body.appendChild(button);
})();