// ==UserScript==
// @name         Poezja polska menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Włącz menu na poezji polskiej
// @author       You
// @match        http://www.poezja-polska.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poezja-polska.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445820/Poezja%20polska%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/445820/Poezja%20polska%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.oncontextmenu = () => {return true}
})();