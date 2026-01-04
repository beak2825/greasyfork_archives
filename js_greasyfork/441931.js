// ==UserScript==
// @name         Fextra Life Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the sidebar
// @author       Jonathan
// @match        https://eldenring.wiki.fextralife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fextralife.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441931/Fextra%20Life%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/441931/Fextra%20Life%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const elem = document.getElementById('sidebar-wrapper')
    if (elem) { elem.remove();};
    GM_addStyle('#wrapper { padding-left: 0px !important;}');
})();