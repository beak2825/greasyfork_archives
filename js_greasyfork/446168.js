// ==UserScript==
// @name         Konachan去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除Konachan里站的广告
// @author       Zsedczy
// @match        https://konachan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=konachan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446168/Konachan%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/446168/Konachan%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var iframes=document.getElementsByTagName("iframe");
    for(var i=0;i<iframes.length;i++)
    {
        iframes[i].remove();
    }
    var iframes1=document.getElementsByTagName("iframe");
    for(var j=0;j<iframes1.length;j++)
    {
        iframes1[j].remove();
    }
    var iframes2=document.getElementsByTagName("iframe");
    for(var k=0;k<iframes2.length;k++)
    {
        iframes2[k].remove();
    }
    var iframes3=document.getElementsByTagName("iframe");
    for(var l=0;l<iframes3.length;l++)
    {
        iframes3[l].remove();
    }
})();