// ==UserScript==

// @name         CSDN自动点赞
// @icon         chrome://favicon/http://blog.csdn.net/
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  学习练习脚本，安装此脚本，每次浏览其他人csdn博客会自动点赞!
// @author       Zero
// @match        https://blog.csdn.net/*
// @match        *://blog.csdn.net/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/401284/CSDN%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/401284/CSDN%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //没有点赞,自动点赞

    if(document.getElementsByClassName("is-like")[0].innerHTML.search("点赞") != -1){
        document.getElementsByClassName("is-like")[0].click();
    }
})();