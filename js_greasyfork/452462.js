// ==UserScript==
// @name         C证续证-学习辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  C证续证视频部分学习辅助，全自动学习。
// @author       You
// @match        http://zjxlypzx.sunplus.wang/study/stydy.html*
// @icon         https://www.google.com/s2/favicons?domain=teacherplus.cn
// @grant        none
// @license      No license
// @downloadURL https://update.greasyfork.org/scripts/452462/C%E8%AF%81%E7%BB%AD%E8%AF%81-%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/452462/C%E8%AF%81%E7%BB%AD%E8%AF%81-%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

window.onload = (function() {

    //--------------------------------------
    // 获取未学习课程进行点击并开始学习
    function GetCourse()
    {
        var itemAll = document.querySelectorAll(".training-left.training-left-study > ul > li > img");

        console.log("开始获取课程！");
        console.log(itemAll.length);
        for(var i = 0;i<itemAll.length;i++)
        {
            if(i >= itemAll.length){
                console.log("所有视频播放完毕！");
                return;
            }
            //获取当前课程观看进度是否已完成
            var img = document.querySelectorAll(".training-left.training-left-study > ul > li > img")[i].src.indexOf('check');
            if(img == -1)//非check为未学习完成
            {
                console.log("即将播放第 " + (i+1) + " 项");
                //检查是否被选中
                var statu = document.querySelectorAll(".training-left.training-left-study > ul > li > a")[i].className.indexOf("active1");
                if(statu == -1)
                {
                    document.querySelectorAll(".training-left.training-left-study > ul > li > img")[i].click();
                    //console.log("已点击");
                    //while(document.getElementsByTagName("video")[0].ended)
                    //{
                        //console.log("点击开始");
                        //window.onload = document.getElementsByTagName("video")[0].play();
                    //}
                    break;
                }
            }
        }
    }

    //-------------------------------
    //看课
    function KanKe()
    {
        //console.log(document.getElementsByTagName("video")[0].ended);
        // 查看播放是否结束，如结束则切换视频
        if(document.getElementsByTagName("video")[0].ended)
        {
            console.log("看课部分点击开始");
            setTimeout(GetCourse,1000);
        }
        // 查看播放状态是否为暂停状态，为暂停则进行播放
        if(document.getElementsByTagName("video")[0].paused)
        {
            window.onload = document.getElementsByTagName("video")[0].play();
        }
    }

    //__________________________________
    //程序从此处开始执行：
    console.log("脚本正常加载");
    setTimeout(GetCourse,1000);
    setInterval(KanKe,1000);
})();