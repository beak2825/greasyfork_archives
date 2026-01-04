// ==UserScript==
// @name         Telegra.ph Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change theme to dark mode on telegra.ph
// @author       YourName
// @match        https://telegra.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497147/Telegraph%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/497147/Telegraph%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const darkBackgroundColor = '#121212';
    const darkTextColor = '#E0E0E0';

    document.body.style.backgroundColor = darkBackgroundColor;
    document.body.style.color = darkTextColor;

    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, div, blockquote');
    elements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)') {
            element.style.backgroundColor = darkBackgroundColor;
        }
        element.style.color = darkTextColor;
    });
})();
