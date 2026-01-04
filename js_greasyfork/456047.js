// ==UserScript==
// @name         remove gray
// @namespace    haxif
// @version      0.2
// @description  移除灰色
// @author       Frost
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456047/remove%20gray.user.js
// @updateURL https://update.greasyfork.org/scripts/456047/remove%20gray.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        if(document.getElementsByClassName("gray").length>0)
        {
            document.getElementsByClassName("gray")[0].className = "";
        }
        document.getElementsByTagName('html')[0].style['-webkit-filter']='none';
    }, 1000)
})();