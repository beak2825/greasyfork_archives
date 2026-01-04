// ==UserScript==
// @name         New Userscript
// @namespace    https://www.baidu.com/
// @version      0.1
// @description  第一个油猴脚本
// @author       You
// @match        *://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476609/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/476609/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isDeleted = false;
    var intervalTimer = setInterval(function() {
        if ($("#hotsearch-content-wrapper").length) {
            $("#hotsearch-content-wrapper").remove();
            clearInterval(intervalTimer);
        }
    }, 4);
})();