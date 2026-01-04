// ==UserScript==
// @name         Google redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在新窗口打开Google搜索结果
// @author       dlutor
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414002/Google%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/414002/Google%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var search_div=document.getElementById('search').getElementsByClassName('MjjYud');
    for (var i=0,len=search_div.length;i<len;i++){
        search_div[i].getElementsByTagName('a')[0].target='_blank';
    }
    // Your code here...
})();