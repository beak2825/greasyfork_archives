// ==UserScript==
// @name         喜马拉雅清爽模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  for me.
// @author       You
// @match        https://www.ximalaya.com/sound/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.ximalaya.com
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478766/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/478766/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        document.getElementsByClassName('xm-comment')[0].style.display='none';
        document.getElementsByClassName('dl-pc')[0].style.display='none';
        document.getElementsByClassName('search-album-box')[0].style.display='none';
        //document.getElementsByClassName('side')[0].style.display='none';
        document.getElementsByClassName('sound-operate')[0].style.display='none';
        document.getElementsByClassName('float-bar')[0].style.display='none';
        document.getElementsByClassName('bread-crumb-wrap')[0].style.display='none';
        document.getElementsByClassName('container')[0].style.display='none';
        document.getElementsByClassName('recommend-list')[0].style.display='none';
        //rootFooter
        document.getElementById('rootFooter').style.display='none';
            },100);
})();