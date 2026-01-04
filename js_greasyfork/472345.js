// ==UserScript==
// @name         LZTLogoutAccidentalProtection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  При нажатии на ссылку содержащую xfToken вас перенаправит на страницу с предупреждением
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472345/LZTLogoutAccidentalProtection.user.js
// @updateURL https://update.greasyfork.org/scripts/472345/LZTLogoutAccidentalProtection.meta.js
// ==/UserScript==

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.href.includes('/logout') && event.target.href.includes('xfToken')) {
        event.preventDefault();
        window.location.href = 'https://zelenka.guru/logout';
    }
});
