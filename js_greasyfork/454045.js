// ==UserScript==
// @name         NicePT ATTK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NicePT AuToThanKs
// @author       h
// @match        https://www.nicept.net/details.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicept.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454045/NicePT%20ATTK.user.js
// @updateURL https://update.greasyfork.org/scripts/454045/NicePT%20ATTK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn=document.querySelector('#saythanks');
    btn.click();
})();