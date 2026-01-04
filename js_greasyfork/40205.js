// ==UserScript==
// @name         智慧树刷课程(美化版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  功能:自动跳过题目,自动看下一节视频,自动调用1.5倍速，自动静音!
// @author       HDQ (hdqyf.club)
// @match        *://study.zhihuishu.com/learning/videoList;jsessionid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40205/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E7%A8%8B%28%E7%BE%8E%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40205/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E7%A8%8B%28%E7%BE%8E%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==



function timeCount()
{
    if(document.getElementById('popbox_title')) {
        var x = document.getElementsByClassName('popbtn_cancel');
        window.clearInterval();
        x[0].click();
        console.log('关闭窗口');
    }
}

var time=0;
var divs = document.createElement("div");
divs.id='mybutton';
divs.style.position='fixed';
divs.style.left='300px';
divs.style.top='65px';
divs.style.width='84px';
divs.style.height='84px';
divs.style.backgroundImage="url('https://s1.ax1x.com/2018/04/03/CSbRvn.png')";
divs.onmouseover=function(){
   divs.style.transform="rotate(360deg)";
   divs.style.transition="all 1.6s";
};

divs.onmouseout=function(){
   divs.style.transform="rotate(0deg)";
   divs.style.transition="all 1.6s";
};

document.body.appendChild(divs);

divs.onclick=function(){
    setTimeout(function(){
        console.log('切换到1.5倍');
        document.getElementsByClassName('speedTab15')[0].click();
        console.log('已静音');
        document.getElementsByClassName('volumeIcon')[0].click();
    },1000);
    if(time===0){
        alert('已经启动,可以最小化了');
    }else{
        console.log('第二次初始化');
    }

    //视频播放暂停
    document.getElementById("vjs_mediaplayer_html5_api").onpause = function() {
        console.log('已暂停');
        window.setInterval(timeCount(),700);
    };

    //视频播放结束
    document.getElementById("vjs_mediaplayer_html5_api").onended=function(){
        console.log('已结束');
        setTimeout(function(){
            document.getElementById('nextBtn').click();
            setTimeout(function(){
                time=1;
                divs.click();
            },5000);
        },2500);
    };
};