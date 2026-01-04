// ==UserScript==
// @name         onlinegit delete name
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  delete name
// @author       z6os
// @match        *://*.onlinegit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlinegit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473254/onlinegit%20delete%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/473254/onlinegit%20delete%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
    document.querySelector("body > section > header > div > div > ul > li.el-menu-right.el-submenu > div.el-submenu__title").remove();
    }
})();