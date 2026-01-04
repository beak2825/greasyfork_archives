// ==UserScript==
// @name         百年树人网学习辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  百年树人网视频部分学习辅助，全自动学习。
// @author       You
// @match        http://www.bcvet.cn/*
// @icon         https://www.google.com/s2/favicons?domain=teacherplus.cn
// @grant        none
// @license      No license
// @downloadURL https://update.greasyfork.org/scripts/452461/%E7%99%BE%E5%B9%B4%E6%A0%91%E4%BA%BA%E7%BD%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/452461/%E7%99%BE%E5%B9%B4%E6%A0%91%E4%BA%BA%E7%BD%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {

    let isOpen = false;
    //-------------------------------
    //看课
    function KanKe()
    {
        // 查看播放是否结束，如结束则切换视频
        var isOver = document.querySelectorAll(".title")[1].getElementsByTagName("span")[0].innerText;
        //console.log(isOver);
        //console.log(window.localStorage.getItem("listPageHref"));
        if(isOver == '已完成')
        {
            console.log("本课视频学习完成，即将返回！");
            var backUrl = window.localStorage.getItem("listPageHref");
            window.location.href = backUrl;
            isOpen = false;
        }
    }

    //-------------------------------
    // 开始
    function start(){
        if(location.pathname.match("/page")){
            console.log("视频学习页");
            KanKe()
        }
        else if(location.pathname == '/webv3/'){
            console.log("课程列表页");
            //存储当前课程列表页地址以备后面视频学习页返回
            window.localStorage.setItem("listPageHref",location.href);
            var btn = document.querySelectorAll(".list___3DG86.uncompleted___2tFj8.pd___1Qjg5 > div > div").length;
            if(btn > 0 && isOpen == false)
            {
                //console.log(btn);
                isOpen = true;
                console.log(isOpen)
                document.querySelectorAll(".list___3DG86.uncompleted___2tFj8.pd___1Qjg5 > div > div")[1].click();
            }
            //window.close();
        }
        else {
            //setTimeout(start,10000);
        }
    }

    //__________________________________
    //程序从此处开始执行：
    console.log("脚本正常加载");
    //setTimeout(start,1000);
    isOpen = false;
    setInterval(start,5000);
    //setInterval(KanKe,1000);
})();