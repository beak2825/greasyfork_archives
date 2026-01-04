// ==UserScript==
// @name         SharePoint Auto View Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Switch to View Modo in SharePoint
// @author       Hanai
// @match        https://*.sharepoint.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharepoint.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461839/SharePoint%20Auto%20View%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/461839/SharePoint%20Auto%20View%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/&action=default&/.test(window.location.href)) {
        window.location.replace(window.location.href.replace('&action=default&', '&action=view&'))
    }
})();