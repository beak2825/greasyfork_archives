// ==UserScript==
// @name         去除页面离开提示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除关闭页面时的提示
// @author       kakasearch
// @include      *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/449188/%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E7%A6%BB%E5%BC%80%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449188/%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E7%A6%BB%E5%BC%80%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
 $(function(){
 $(window).unbind('beforeunload');
 window.onbeforeunload = null;
 })
    // Your code here...
})();