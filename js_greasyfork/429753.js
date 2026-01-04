// ==UserScript==
// @name         去除水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove mask
// @author       daizp
// @match        https://db1.it.zhaopin.com/sqlquery/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429753/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/429753/%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dom = document.getElementsByClassName('mask_div');
    for(var i=0,len=dom.length; i<len; i++){
        dom[i].style.visibility = 'hidden';
    }
})();