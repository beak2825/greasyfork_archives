// ==UserScript==
// @name         MBox去水印
// @namespace    mb
// @version      1.3
// @author       Bob
// @match        *://www.magesbox.com/course/*
// @grant        none
// @description 2021/12/9 上午11:39:36
// @downloadURL https://update.greasyfork.org/scripts/436789/MBox%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436789/MBox%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var c = document.getElementsByClassName("left")[0];
    c.removeChild(document.getElementsByClassName("left-top")[0])
setInterval(function () {

    if(document.getElementsByClassName("newdiv")[0])
    {
        
    }
    else{
        console.log("ok")
        var e = document.getElementsByClassName("player")[0].firstChild;
        e.append(document.getElementsByClassName("pv-video")[0]);

    }



}, 500);


    // Your code here...
})();