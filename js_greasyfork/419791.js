// ==UserScript==
// @name         时间锁
// @namespace    https://github.com/Jie-Qiao
// @version      0.4
// @description  根据何同学的时间锁设计的网页版，网页添加请修改下方'@match'项，可添加或减少你需要的match网站.
// @author       Jie Qiao
// @match        https://www.zhihu.com/*
// @match        https://weibo.com/*
// @match        https://www.douban.com/*
// @match        https://www.bilibili.com/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/419791/%E6%97%B6%E9%97%B4%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/419791/%E6%97%B6%E9%97%B4%E9%94%81.meta.js
// ==/UserScript==


var time=0;
var remained=false;
(function() {
    'use strict';
time = prompt("你为什么要打开网站？\n你要看多长时间？\n你还能去做什么？\n\n请设置浏览时间(分钟)", "5");
    if(time == null){
        window.close();
    }
    time=time*60*1000;
    setInterval(tick,1000)
    // Your code here...
})();


function tick() {
    time=time-1000;
    if(time<=0){
     var r=confirm("时间结束，是否退出："+document.title);
            if (r==true)
    {
        time=0;
        window.close();
    }
    else
    {
        time = prompt("设置继续浏览时长", "1");
        if (time <=1){
            remained=true;
        }else{
            remained=false;
        }
        time=time*60*1000;
    }
    }
    if (time<=60*1000 && remained==false){
        alert("还剩1分钟");
        remained=true;
    }

}