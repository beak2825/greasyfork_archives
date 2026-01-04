// ==UserScript==
// @name         Hasten_player
// @namespace    Yoncms/Hxpxw
// @version      1.1
// @description  突破视频观看速度以及进度条无法拖动的限制，极速完成观看任务！
// @author       Yoncms/扬克姆斯
// @match        http://pt.hxpxw.net/els/html/courseStudyItem/courseStudyItem.learn.do*
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448292/Hasten_player.user.js
// @updateURL https://update.greasyfork.org/scripts/448292/Hasten_player.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var
      d=document,
      k = d.querySelector('.cl-menubar'),
      Time = 2e3+2e2+2;
    k.style.background = '#e33e33';
    k.onclick = function( ){
      k.style.background = '#343434';
      var 
        p = d.querySelector('iframe').contentDocument.querySelector('video').player,
        t = p.getCurrentTime(),
        z = p.getDuration(),
        timer = setInterval(function ( ){
          (t>z+10 || new Date().getFullYear()-Time>0) && clearInterval( timer );
          p.seek( t++ );
        }, 8 );
    };
})();