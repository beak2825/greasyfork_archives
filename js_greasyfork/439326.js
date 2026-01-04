// ==UserScript==
// @name         Enable RightClick
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script enables right click on lernpass.ch where itis blockes
// @author       You
// @match        *://*.lernpassplus.ch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lernpassplus.ch
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439326/Enable%20RightClick.user.js
// @updateURL https://update.greasyfork.org/scripts/439326/Enable%20RightClick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ["oncontextmenu", "onkeyup", "onkeydown", "onselectstart"].forEach((s) => {document.querySelector("#Pagebody").removeAttribute(s)})
})();