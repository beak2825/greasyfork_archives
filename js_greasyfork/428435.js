// ==UserScript==
// @name         去除rmdown广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove rmdown ad
// @author       You
// @match        http://www.rmdown.com/link.php?hash=212b3e382df193ef5b0db7512d087d3d3aa732b120f
// @icon         https://www.google.com/s2/favicons?domain=rmdown.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428435/%E5%8E%BB%E9%99%A4rmdown%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/428435/%E5%8E%BB%E9%99%A4rmdown%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    for (var i=2;i<20;i++){
    let ad=document.querySelector("body > form > table > tbody > tr:nth-child(2) > td > a:nth-child(i)");
    ad.parentNode.removeChild(ad);}
})();