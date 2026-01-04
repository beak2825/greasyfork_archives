// ==UserScript==
// @name         哔哩哔哩bilibili默认关闭弹幕
// @description  Bilibili html5播放器默认关闭弹幕
// @author       cngege
// @version      2022.5.03.01
// @namespace    cngege
// @icon         https://www.bilibili.com/favicon.ico
// @icon64       https://s1.ax1x.com/2020/06/17/NV4aEq.png
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/blackboard/newplayer.html*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389919/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/389919/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

let geturl = ()=>{return window.location.href;}

(function() {
    let url = geturl();
    let isgo = true;        //本页面是否判断弹幕开关状态 并作出响应
    let Const = 0;          //记录一个页面中已循环次数，超过三十次则本页面不再循环判断是否关闭弹幕
    let DebugLog = false;
    //go();
    let go = ()=>
    {
        Const++;
        let 弹幕 = $(".bilibili-player-video-danmaku-switch .bui-switch-dot");
        if(!弹幕.length){
            弹幕 = $(".bpx-player-dm-switch .bui-switch-dot");
        }
        //判断弹幕开关是否是打开的 并关闭
            //if(DebugLog){console.log(弹幕.css("left"))}

        if(弹幕.css("left") == "30px" || 弹幕.css("left") == "100%"){
            $('.bui-switch-input').click();//向弹幕开关发送点击消息
            if(DebugLog){console.log("向弹幕开关发送点击消息")}
        }
        if(弹幕.css("left") == "2px"){
           isgo = false;
           if(DebugLog){console.log("检测到弹幕开关关闭");}
           return;
        }
        if(Const>30){isgo = true;return;}
        setTimeout(go,300);
    }
    setInterval(()=>
    {
        if(isgo || url!=geturl()){
           if(url!=geturl()){
               Const = 0;
           }
           url=geturl();
           isgo = false;
           go();
        }
    },1000)

    function geturl(){
        return window.location.href;
    }
})();