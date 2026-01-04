// ==UserScript==
// @name         EFLession循环播放脚本
// @namespace    com.uestc.rjw
// @version      0.1
// @encoding    utf-8
// @description  EFLession课程中心循环播放脚本
// @author       rjw
// @include      http://www.englishtown.cn/community/dailylesson/lesson.aspx*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370238/EFLession%E5%BE%AA%E7%8E%AF%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/370238/EFLession%E5%BE%AA%E7%8E%AF%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var repeats = document.getElementsByClassName('repeatBtn');
        if(repeats != undefined && repeats.length > 0){
            repeats[0].click();
        }
    }, 10000);
})();