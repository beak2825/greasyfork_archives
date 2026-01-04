// ==UserScript==
// @name         Auto Like Bilibili videos
// @namespace    http://www.callmsn.top
// @version      1.0
// @description  Auto click on the "Like it" button when watching bilibili videos and donate one coin
// @author       Alston
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396748/Auto%20Like%20Bilibili%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/396748/Auto%20Like%20Bilibili%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // auto like video after 20s
    setTimeout(function(){document.querySelectorAll('.ops>.like:not(.on)')[0].click()}, 20000);
    // auto donate one coin after 4 min
    setTimeout(function(){
        document.querySelectorAll('.ops>.coin:not(.on)')[0].click();
        setTimeout(function(){document.querySelectorAll('.mc-box.left-con')[0].click()}, 200);
        setTimeout(function(){document.querySelectorAll('.coin-bottom>.bi-btn')[0].click()}, 200);
    }, 240000)
})();