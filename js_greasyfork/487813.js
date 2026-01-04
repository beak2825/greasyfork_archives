// ==UserScript==
// @name         Přesměrování 1xmobi.com
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  Přesměruje na 1xstavka.ru
// @author       JK
// @match        https://1xmobi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1xmobi.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487813/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%201xmobicom.user.js
// @updateURL https://update.greasyfork.org/scripts/487813/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%201xmobicom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentPath = window.location.pathname;

    window.location.href = "https://1xstavka.ru" + currentPath;
})();