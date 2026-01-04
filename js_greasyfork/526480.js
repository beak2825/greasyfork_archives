// ==UserScript==
// @name         Run JS in URL | RU
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Даёт возможность запускать JS код используя URL
// @author       Belogvardeec
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526480/Run%20JS%20in%20URL%20%7C%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/526480/Run%20JS%20in%20URL%20%7C%20RU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function executeCodeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('console');

        if (code) {
            try {
                const decodedCode = decodeURIComponent(code);
                eval(decodedCode); // использование eval для выполнения кода
            } catch (error) {
                console.error('Ошибка:', error);
            }
        }
    }

    // Выполнить основную функцию
    executeCodeFromUrl();

    console.log('JS in URL has been launched');
})();
