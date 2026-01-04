// ==UserScript==
// @name         网课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除自动暂停
// @author       You
// @match        http://zhdj.cqupt.edu.cn/ybdy/lesson/play?v_id=*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383396/%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/383396/%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var $ = window.jQuery;
    setTimeout(function(){
    alert("此代码仅供交流和学习，禁止用于任何商业用途！");
    setInterval( function (){
        var player = $(".plyr--setup")[0];
        var duration = player.plyr.getDuration();
        var div_alert = $(".public_submit");
        var current_time = player.plyr.getCurrentTime()
        if(current_time < duration)
        {
            if(div_alert.text() !== "")
            {
                div_alert.click();
                console.log("ok");
            }
        }
    },10000);
    },5000);

})();