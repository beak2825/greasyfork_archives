// ==UserScript==
// @name         csdn精简个人目录页-精简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383014/csdn%E7%B2%BE%E7%AE%80%E4%B8%AA%E4%BA%BA%E7%9B%AE%E5%BD%95%E9%A1%B5-%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/383014/csdn%E7%B2%BE%E7%AE%80%E4%B8%AA%E4%BA%BA%E7%9B%AE%E5%BD%95%E9%A1%B5-%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==   如果文章页下方的推荐也去掉了，请在设置中添加相应的排除即可

(function() {
    'use strict';
    document.domain="csdn.net";
    window.addEventListener ("load", pageFullyLoaded);
     function pageFullyLoaded () {
           $('.content').each(function(e,a) {
             a.remove();
           }
    )}
    // Your code here...
})();