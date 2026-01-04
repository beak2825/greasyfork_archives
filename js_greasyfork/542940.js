// ==UserScript==
// @name         Noto Sans for Google
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.0.1
// @description  Replaces Arial, Roboto, and Open Sans with the locally installed Noto Sans font on Google websites.
// @author       TheSina
// @match        *://*.google.*/*
// @exclude      *://*.google.*/recaptcha/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542940/Noto%20Sans%20for%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/542940/Noto%20Sans%20for%20Google.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        @font-face {
            font-family: 'Arial';
            src: local('Noto Sans');
        }
        @font-face {
            font-family: 'Roboto';
            src: local('Noto Sans');
        }
        @font-face {
            font-family: 'Open Sans';
            src: local('Noto Sans');
        }
    `);
})();
