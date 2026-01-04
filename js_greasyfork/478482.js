// ==UserScript==
// @name         LOLZ_Symp
// @namespace    LOLZ_Symp
// @version      0.1
// @description  Change like to sympathy
// @author       el9in
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/478482/LOLZ_Symp.user.js
// @updateURL https://update.greasyfork.org/scripts/478482/LOLZ_Symp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.like2Icon { background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16.73 2C14.86 2 13.21 2.80925 12 4.31214C10.79 2.80925 9.14 2 7.27 2C3.86 2 1 5.00578 1 8.5896C1 8.82081 1 9.05202 1 9.28329C1.44 14.7167 6.94 19.2254 10.13 21.422C10.68 21.7688 11.34 22 12 22C12.66 22 13.32 21.7688 13.87 21.422C17.06 19.2254 22.56 14.7167 23 9.39882C23 9.16765 23 8.93641 23 8.7052C23 5.00578 20.14 2 16.73 2ZM20.8 9.05202C20.47 13.6764 14.97 17.8381 12.66 19.3411C12.22 19.5722 11.78 19.5722 11.34 19.3411C9.03 17.7226 3.64 13.5607 3.2 8.93641C3.2 8.93641 3.2 8.7052 3.2 8.5896C3.2 6.27746 5.07 4.31214 7.27 4.31214C8.92 4.31214 10.35 5.3526 11.01 6.85549C11.12 7.31792 11.56 7.54913 12 7.54913C12.44 7.54913 12.88 7.31792 12.99 6.85549C13.65 5.3526 15.08 4.31214 16.73 4.31214C18.93 4.31214 20.8 6.27746 20.8 8.5896C20.8 8.7052 20.8 8.93641 20.8 9.05202Z' fill='%238C8C8C'/%3E%3C/svg%3E%0A") }`;
    document.head.appendChild(style);
})();