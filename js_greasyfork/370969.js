// ==UserScript==
// @name         伊莉
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://www.eyny.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370969/%E4%BC%8A%E8%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/370969/%E4%BC%8A%E8%8E%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setatarget(1);
    document.getElementsByClassName('unchk')[0].click();
})();