// ==UserScript==
// @name         Baidu
// @version      0.0
// @description  Optimizing Baidu Home Page
// @author       Boyden
// @match        *://*.baidu.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/85182
// @downloadURL https://update.greasyfork.org/scripts/25832/Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/25832/Baidu.meta.js
// ==/UserScript==

(function() {
   var nav = document.getElementById("s_wrap");
    if(nav!==null&&nav.parentNode!==null)
        nav.parentNode.removeChild(nav);

   var title = document.getElementsByTagName("title");
   title[0].innerHTML="百度";
    
    var search = document.getElementById("su");
    if(search!==null&&search.parentNode!==null)
        search.value="搜索";
})();