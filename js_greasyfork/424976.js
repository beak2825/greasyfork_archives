// ==UserScript==
// @name         研修网挂机
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  研修网，定时检测停止计时弹窗并点击
// @author       Marta Pease
// @icon         https://srt-read-online.3ren.cn/basebusiness/headimg/20200711/1594463211851X00rZyPRV8-23.png
// @match        *://ipx.yanxiu.com/grain/course/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424976/%E7%A0%94%E4%BF%AE%E7%BD%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424976/%E7%A0%94%E4%BF%AE%E7%BD%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==


(function() {
    var int1=window.setInterval(clock1,15000)

    function clock1()
    {
        if ($("video")[0]!=undefined){
            //alert('1');
            $("video")[0].muted=true;
            //$("video")[0].loop=true;
            $("video")[0].playbackRate=0.1;
            window.clearInterval(int1);
        }
    }

    setInterval(function() {
        console.log('检测中')
        var clockTip=$('.alarmClock-wrapper')[0];
        //检查是否弹出10分钟的提示，有则点击
        if (clockTip.style.display=="")
            clockTip.click();
    }, 2000);

})();

