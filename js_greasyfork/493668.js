// ==UserScript==
// @name         Crack webtrn.cn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  test
// @author       You
// @match        https://xzzf-kfkc.webtrn.cn/learnspace/learn/learn/templateeight/index.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8.165
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493668/Crack%20webtrncn.user.js
// @updateURL https://update.greasyfork.org/scripts/493668/Crack%20webtrncn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     var a = Number.parseInt(jwplayer("container").getDuration())
for(var i=10;i<a;i=i+10){
     console.log(i);
     $.fn.videoLearnRecord({interval: true,playComplete: false,courseId: courseId,itemId: itemId,position: i,videoTotalTime: videoTime});
}
$.fn.videoLearnRecord({playComplete: true,async: false,courseId: courseId,itemId: itemId,position: Number.parseInt(jwplayer('container').getDuration()),videoTotalTime: videoTime});
alert("《"+$('.s_pointti')[0].innerHTML+"》学习完毕");

})();