// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Убирание запрета правого клика
// @author       You
// @match        https://www.webtoons.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423787/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/423787/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].removeAttribute("oncontextmenu");
    }
})();