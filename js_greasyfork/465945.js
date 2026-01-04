// ==UserScript==
// @name         融优学堂
// @namespace    https://www.livedu.com.cn/
// @version      1.0
// @description  融优学堂自动刷课
// @author       BoBppy
// @match        *://*.livedu.com.cn/*
// @match        *://livedu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livedu.com.cn
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/465945/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/465945/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

function judgePlay(){
    for (let i = 1; i <= 6; i++) {
        let videoElem = document.getElementById('zwshow').contentWindow.document.getElementById(`myVideo_${i}`);
        let spIndexElem = document.getElementById('zwshow').contentWindow.document.getElementById(`sp_index_${i}`);
        if(videoElem != null && spIndexElem.innerHTML != '已完成'){
            if(videoElem.currentTime == 0){
                console.log("当前视频未播放");
                document.querySelectorAll("#video-img > a")[i-1].click();
                videoElem.muted=true;
                videoElem.play();
                //imgElem.click();
            } else {
                console.log(`2.当前正在播放视频${i}`);
            }
        }
    }
}

function judgeJump(){
    for (let i = 1; i <= 6; i++) {
        let spIndexElem = document.getElementById('zwshow').contentWindow.document.getElementById(`sp_index_${i}`);
        if(spIndexElem != null){
            if(spIndexElem.innerHTML == '已完成'){
                console.log(`视频${i}已经观看完成`);
                if(i == 6 || document.getElementById('zwshow').contentWindow.document.getElementById(`sp_index_${i+1}`) == null){
                    document.getElementById("downz").click();
                }
            } else {
                console.log(`1.正在持续观看视频${i}`);
                break;
            }
        } else if(i == 1){
            console.log("1.程序出现错误，请于作者联系反馈或自行查错修正代码");
            break;
        }
    }
}


function judgeTest(){
    //判断是否有测验
    if(document.getElementById('zwshow').contentWindow.document.querySelector("body > div.xx-main-box > div > div.tiele-h5") == null){;}
    else{return 1;}
}

function autoPlayVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.addEventListener('pause', function() {
                video.muted=true;
                video.play();
            });
        }
        video.muted=true;
        video.play();
    }

(function() {
    'use strict';
    //反禁用调试
    window.onload = null;
    document.onkeydown = null;
    document.oncontextmenu = null;

    //下面有多种方式可屏蔽检测切屏

    //方法一：移除页面监听器visibilitychange
    /*
    var originalAddEventListener = document.addEventListener;
    document.addEventListener = function(eventName, eventHandler, useCapture, wantsUntrusted) {
        //只有当eventName不是'visibilitychange'时才调用原生的函数
        if (eventName !== 'visibilitychange') {
            originalAddEventListener.call(document, eventName, eventHandler, useCapture, wantsUntrusted);
        }
    };*/

    //方法二：使visibilityState始终返回visible
    Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: false, configurable: false});
    Object.defineProperty(document, 'hidden', {value: false, writable: false, configurable: false});

    //方法三：删除自动暂停
    document.body.innerHTML = document.body.innerHTML.replace(/video.pause()/g, 'video.play()');

    //方法四：劫持addEventListener
    //EventTarget.prototype.addEventListener=function (){console.log('我被劫持了')};

    console.log("脚本开始运行");
    var time_1 = 0;
    autoPlayVideo();

    //每隔一分钟执行一次判断程序
    var inter = setInterval(function(){
        judgeJump();
        judgePlay();
        judgeTest();
        time_1++;
        //为避免出现未知错误，脚本单次最大运行时间为200分钟
        if(time_1 >= 200){
            clearInterval(inter);
            console.log("，超出最大时间限制，已退出脚本");
        }
        //有测验则退出脚本
        else if(judgeTest()==1){
            clearInterval(inter);
            console.log("检测到有测验，已退出脚本。请完成测验后，手动进入下一节课程刷并新页面继续执行脚本");
        }

        else {console.log ("3.当前脚本已运行" + time_1 + "分钟");}
    }, 60000);
})();
