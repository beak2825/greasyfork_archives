// ==UserScript==
// @name         RCOI autoupdate
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Update at random time
// @author       NickKolok
// @match        http://res11.rcoi.net/*
// @icon         https://www.google.com/s2/favicons?domain=rcoi.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428153/RCOI%20autoupdate.user.js
// @updateURL https://update.greasyfork.org/scripts/428153/RCOI%20autoupdate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout('document.location.reload();',60*1000*(1+Math.random()));

})();