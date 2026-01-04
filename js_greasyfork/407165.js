// ==UserScript==
// @name         21tb_study
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  2024
// @author       perdow
// @match        http*://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407165/21tb_study.user.js
// @updateURL https://update.greasyfork.org/scripts/407165/21tb_study.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function lll() {
        document.getElementsByClassName('title')[0].innerText = "BOT FOR YOU"
    }

    function sudu1() {
        document.querySelector('iframe').contentWindow.document.querySelectorAll('video')[0].volume = 0;
    }
    setInterval(sudu1, 100);

    function sudu2() {
        document.querySelector('iframe').contentWindow.document.querySelectorAll('video')[0].playbackRate = 7;
    }
    setInterval(sudu2, 5000);

    function enterCourse() {
        document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item')[document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish').length].click();
        //window.location.reload()
    }
    var myTimer = setInterval(enterCourse, 50000);

})();