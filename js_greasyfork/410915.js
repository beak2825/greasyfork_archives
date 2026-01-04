// ==UserScript==
// @name         bjjnts自动点击
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       https://www.bjjnts.cn/lessonStudy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410915/bjjnts%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/410915/bjjnts%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ClickOK(){
            $($.find("a.layui-layer-btn0")[0]).trigger( "click" );
    }
    function AutoNext(){
        video.addEventListener('ended', function(e) {
            var nextLesson = lessonNum + 1;
            $('.lesson-'+nextLesson+' .course_study_menuschedule').trigger( "click" );
        });
    }
    setInterval(ClickOK, 2000);
    setTimeout(AutoNext,2000);
})();