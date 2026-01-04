// ==UserScript==
// @name         翼狐去水印
// @namespace    yh
// @version      1.1
// @author       Bob
// @match        *://www.yiihuu.com/*
// @grant        none
// @license MIT
// @description 2022/06/8 上午01:33:36
// @downloadURL https://update.greasyfork.org/scripts/446149/%E7%BF%BC%E7%8B%90%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/446149/%E7%BF%BC%E7%8B%90%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var c = document.getElementsByClassName("login-text")[0];
    c.parentNode.removeChild(c);


setInterval(function () {

    if(document.getElementsByClassName("p-in")[0])
    {
        console.log("ok")
        var e = document.querySelector('div[class^="pv-video-player"]');
        e.append(document.getElementsByClassName("pv-video")[0]);
    }
    else{


    }



}, 500);


    // Your code here...
})();