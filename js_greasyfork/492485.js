// ==UserScript==
// @name         WideMode
// @namespace    http://tampermonkey.net/
// @version      2024-04-14(1)
// @description  Change column number from 2 to 1 for better reading experience
// @author       You
// @match        https://baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      https://update.greasyfork.org/scripts/481939/1293842/jquery-360minjs.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492485/WideMode.user.js
// @updateURL https://update.greasyfork.org/scripts/492485/WideMode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('div[class~="grid-cols-2"]').each(function() {
        $(this).removeClass("grid-cols-2");
        $(this).addClass("grid-cols-1");
    });
    $('iframe').each(function(){
        $(this).remove();
    });
})();