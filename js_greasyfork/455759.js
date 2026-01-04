// ==UserScript==
// @name         家庭教育
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoplay
// @author       Hui
// @match        https://www.cfept.com/newSpecial/courseDetail.html?specialId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cfept.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455759/%E5%AE%B6%E5%BA%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455759/%E5%AE%B6%E5%BA%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){
    if(document.querySelector('video').paused==true);
    document.querySelector('video').play();
    document.querySelector('video').playbackRate=4;
    document.querySelector('video').muted=true;
    document.querySelector('video').addEventListener('ended',function(){
        document.querySelector(".nextBtn").click();
    },false)
},2000)
    // Your code here...
})();