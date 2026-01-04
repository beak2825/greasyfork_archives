// ==UserScript==
// @name         OldStyleXcarBBS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Return to old style Xcarbbs
// @author       bg7lgb@gmail.com
// @match        http://www.xcar.com.cn/bbs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390519/OldStyleXcarBBS.user.js
// @updateURL https://update.greasyfork.org/scripts/390519/OldStyleXcarBBS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var back_old_link =document.getElementsByClassName("back_old_link");

    if (back_old_link.length) {
        back_old_link[0].click();
    }
})();