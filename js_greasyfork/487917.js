// ==UserScript==
// @name         樱花去暂停广告
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  樱花去除暂停广告!
// @author       天宇大哥
// @match        https://tup.iyinghua.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyinghua.io
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487917/%E6%A8%B1%E8%8A%B1%E5%8E%BB%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/487917/%E6%A8%B1%E8%8A%B1%E5%8E%BB%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

GM_addStyle(`
     #adv_wrap_hh{
         display:none!important;
     }
     .dplayer-paused .dplayer-controller{
         display:none;
     }
     .dplayer-paused .dplayer-controller-mask{
         display:none;
     }
     .showtime{
        transition:1s;
        position: absolute;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: rgba(0,0,0,.5);
        top: 8px;
        right: 26px;
        color: #fff;
        font-size: 16px;
        padding: 0 10px;
        border-radius:4px;
     }

   `);
function triggerClick(node){
    if (document.createEvent) {
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        node.dispatchEvent(evt);
    } else if (document.createEventObject) {
        node.fireEvent('onclick') ;
    } else if (typeof node.onclick == 'function') {
        node.onclick();
    }
}
function setLs(name,value){
    localStorage.setItem(name,value);
}
function getLs(name){
    return localStorage.getItem(name);
}
function delLs(name){
    localStorage.removeItem(name);
}
//秒转分秒
function secondsToMinutesAndSeconds(sec) {
    sec = parseInt(sec);
    var minutes = Math.floor(sec / 60);
    var seconds = sec % 60;
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
(function() {
    let videoM = document.querySelector(".dplayer-video-wrap");
    videoM.ondblclick = function(){
        //双击全屏
        let fullDom = document.querySelector(".dplayer-full-icon");
        triggerClick(fullDom);
    }
    console.log(location.href,333);
    let myTime = [];
    let myUrl = location.href;
    //没找到
    if(!dplayer){
        return;
    }

    let myTimeStr = getLs("myTime");
    if(myTimeStr){
        myTime = JSON.parse(myTimeStr);
        if(myTime){
            //找到当前存储播放时间
            let myObj = myTime.find(item=>item.url == myUrl);
            if(myObj){
                //读取到当前时间
                dplayer.seek(myObj.time);
                //加个窗口显示一下
                let playDom = document.querySelector(".dplayer-video-wrap");
                let boxDom = document.createElement("div");
                boxDom.className = "showtime";
                let res = `上次看到 ${secondsToMinutesAndSeconds(myObj.time)}`;
                boxDom.innerHTML = res;
                playDom.appendChild(boxDom);
                setTimeout(function(){
                    boxDom.style.opacity = 0;
                    console.log(12345);
                },5000);
            }
        }
    }
    console.log(myTime,111222);

    //dplayer
    console.log(dplayer);
    //dplayer.pause();
    //播放时间
    //dplayer.video.currentTime
    //dp.seek(time)

    dplayer.on('play', function() {
        console.log('video started!');
    });
    //暂停监听
    dplayer.on('pause', function() {
        console.log('video paused!');
        //暂停时获取播放时间
        console.log(dplayer.video.currentTime);
        //往回倒5秒
        let currentTime = dplayer.video.currentTime - 5;
        //存入本地
        let isMyUrl = myTime.some(item=>item.url == myUrl);
        console.log(isMyUrl,333444);
        if(isMyUrl){
            //有替换
            let myObj = myTime.find(item=>item.url == myUrl);
            myObj.time = currentTime;
        }else{
            //没有添加
            //通过url作为标识
            let obj = {
                url:myUrl,
                time:currentTime,
            }
            myTime.push(obj);
        }
        console.log(myTime,444555);
        //存入本地
        let res = JSON.stringify(myTime);
        setLs("myTime",res);
    });

    dplayer.on('ended', function() {
        console.log('video ended!');
    });

    dplayer.on('seeked', function() {
        console.log('video position changed!');
    });

    dplayer.on('volumechange', function() {
        console.log('volume changed!');
    });

    dplayer.on('fullscreen', function() {
        console.log('fullscreen mode changed!');
    });

})();