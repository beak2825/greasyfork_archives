// ==UserScript==
// @name         jianshu filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去头去尾
// @author       longslee
// @match        https://www.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405954/jianshu%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/405954/jianshu%20filter.meta.js
// ==/UserScript==

+function() {
    'use strict';
    // Your code here...
    //document.getElementById('btn-readmore').click();
    //https://greasyfork.org/
    document.getElementsByClassName('_1CSgtu')[0].style.display="none";
    document.getElementsByClassName('_2xr8G8')[0].style.display="none";

}();