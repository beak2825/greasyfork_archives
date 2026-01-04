// ==UserScript==
// @name         Doska.ru and SS.com helper
// @namespace    http://blog.vienalga.net/
// @version      0.1 PoC
// @description  This script disables Anti-Adblock and Clipboard madness
// @author       Cukurgalva
// @match        https://www.doska.ru/*
// @match        https://www.ss.com/*
// @match        https://www.ss.ee/*
// @match        https://www.ss.lt/*
// @match        https://www.ss.lv/*
// @match        https://www.ss.pl/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/32958/Doskaru%20and%20SScom%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/32958/Doskaru%20and%20SScom%20helper.meta.js
// ==/UserScript==

(function(win, doc) {
    'use strict';

    doc.body.removeEventListener('copy', win.add_link_to_selection);
    setInterval(function(){
        win.AD_BLOCKER = false;
    }, 1000);

})(this.unsafeWindow || this, document);