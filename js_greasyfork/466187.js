// ==UserScript==
// @name         moegirl-width-plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  增大萌娘百科页面宽度
// @author       Y_jun
// @match        *://*.moegirl.org.cn/*
// @license      MIT
// @icon         https://em-content.zobj.net/thumbs/160/apple/354/left-right-arrow_2194-fe0f.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466187/moegirl-width-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/466187/moegirl-width-plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var container = document.getElementsByClassName("moe-flexible-container");
    // console.log(container);
    container[1].style.minWidth = "75%";
    container[2].style.minWidth = "75%";
})();