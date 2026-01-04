// ==UserScript==
// @name         CSDN展开
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  CSDN不用展开直接查看全文
// @author       Johu
// @match        *://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428627/CSDN%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/428627/CSDN%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('article_content').style.height= 'auto'
    if(document.getElementsByClassName('hide-article-box')[0]){
       document.getElementsByClassName('hide-article-box')[0].style.display = 'none' 
    }
    document.getElementById('article_content').contentEditable = true
})();