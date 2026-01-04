// ==UserScript==
// @name         Rainbow background у выделяемого текста
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zelenka
// @author       Здравствуйте
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469991/Rainbow%20background%20%D1%83%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D1%8F%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/469991/Rainbow%20background%20%D1%83%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D1%8F%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('selectionchange', function() {
        var style = document.createElement('style');
        var colors = ['rgba(255, 0, 0, 0.3)', 'rgba(255, 127, 0, 0.3)', 'rgba(255, 255, 0, 0.3)', 'rgba(0, 255, 0, 0.3)', 'rgba(0, 0, 255, 0.3)', 'rgba(75, 0, 130, 0.3)', 'rgba(139, 0, 255, 0.3)'];
        var randomColorIndex = Math.floor(Math.random() * colors.length);
        var randomColor = colors[randomColorIndex];

        style.innerHTML = '::selection { background-color: ' + randomColor + '; color: white; }';

        var existingStyle = document.getElementById('rainbow-selection-style');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }

        style.id = 'rainbow-selection-style';
        document.head.appendChild(style);
    });
})();
