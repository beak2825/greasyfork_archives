// ==UserScript==
// @name         丽水的神
// @namespace    挂机就好了
// @version      创世0.01
// @description  挂机就好了
// @author       谢  vx: cldfc9527
// @match        *://px.ls12333.cn/PersonalTrain/Index
// @grant        需要什么权限（GM_addStyle添加css样式权限）
// @grant        GM_addStyle
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @original-script https://greasyfork.org/scripts/369625
// @original-author wyn665817
// @original-script https://scriptcat.org/script-show-page/10/code
// @original-author coder_tq
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/442536/%E4%B8%BD%E6%B0%B4%E7%9A%84%E7%A5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/442536/%E4%B8%BD%E6%B0%B4%E7%9A%84%E7%A5%9E.meta.js
// ==/UserScript==

window.onload=function() {
    'use strict';
console.log("准备开始,等待五秒,获取数据中")
    // Your code here...
}

 $(document).ready(function() {

        setTimeout("$('.personalTrainStudy:eq(0)').trigger('click')",5000);
        $(document).ready(function() {
            window.setTimeout(function(){ study(); } ,5000);
        });
})


function study(){

    var jdtone=$('.yellow:eq(2)').text();jdtone=jdtone.replace("%","");//获取第一课程进度
    var videobtn=$('img:visible').length;
    var studybtn=$('.personalTrainStudy').length;

    if(jdtone<100){
        console.log("课程数：",$('.personalTrainStudy').length)
        console.log("可播放按钮：",$('img:visible').length-2)
        console.log("第一课程进度：",$('.yellow:eq(2)').text());
        console.log("第一课程未完成，即将开始学习","第一课程第",videobtn-2,"节课");
        var ck= (videobtn-2)*2;
        $('img:eq('+ck+')').trigger('click');
        console.log("已经开始自动播放啦，Q快去干别的事情吧");
    }
    else  if(jdtone==100||jdttwo<100){

       $('.item:eq(0)').remove()
       console.log("使用超能力已将第一课程隐藏，刷新进度可重现");
       setTimeout("$('.personalTrainStudy:eq(0)').trigger('click')",5000);
       $(document).ready(function() {
           window.setTimeout(function(){
               studytwo();
           } ,5000);
       });
    }
}


function studytwo(){

    var videobtntwo=$('img:visible').length-2;
    console.log("课程数：",$('.personalTrainStudy').length)
    console.log("可播放按钮：",$('img:visible').length-2)
    console.log("第二课程进度：",$('.yellow:eq(2)').text());
    console.log("第二课程未完成，即将开始学习","第二课程第",videobtntwo,"节课");
    var cktwo= videobtntwo*2;
    $('img:eq('+cktwo+')').trigger('click');
    console.log("已经开始自动播放啦，Q快去干别的事情吧");
}


//定时刷新页面，实现自动播放
window.onload=function() {
    'use strict';
    var title, time;

    config(ready);

    // 配置
    function config(callback) {
        sessionStorage.oixmRefreshTime=648 //添加行，赋值刷新时间为300秒，阻止弹出设置窗口
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("请设置要自动刷新的间隔时间（秒）：", 648));
            if (isNaN(time)) return;
            sessionStorage.oixmRefreshTime = time;
        } else {
            time = parseInt(sessionStorage.oixmRefreshTime);
        }
        callback();
    }

    // Ready
    function ready() {
        title = document.title;
        loop();
    }

    // 循环时间
    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            location.reload();
            return;
        }
        time--;
        setTimeout(loop, 1000);
    }

    // 格式化时间
    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

    // 补零
    function pad(n) {
        return ("00" + n).slice(-2);
    }


}();




