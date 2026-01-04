// ==UserScript==
// @name         隐藏 Baidu 置顶热搜
// @namespace    http://tampermonkey.net/
// @version      2024-07-16
// @description  Hide No.1 in Baidu 
// @author       You
// @match        https://*.baidu.com
// @match        https://*.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500666/%E9%9A%90%E8%97%8F%20Baidu%20%E7%BD%AE%E9%A1%B6%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/500666/%E9%9A%90%E8%97%8F%20Baidu%20%E7%BD%AE%E9%A1%B6%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    // Your code here...
    $(document).ready(function() {
        if($('i.c-color-red')){
            $('i.c-color-red').parent().parent().hide()
        }
        if($('div.toplist1-tr_1MWDu:first')){
            $('div.toplist1-tr_1MWDu:first').hide()
        }

    })
})();