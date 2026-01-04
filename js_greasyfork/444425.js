// ==UserScript==
// @name         通过剧名自动跳过片头
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  按对应视频的剧名可以跳过对应时长。
// @author       weiv
// @match        *://dp.1010dy.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1010dy.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444425/%E9%80%9A%E8%BF%87%E5%89%A7%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/444425/%E9%80%9A%E8%BF%87%E5%89%A7%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

const 动漫跳过时间表 = {"灵剑尊": [160, 585],
                 "万界神主": [125, 0],
                 "万界仙踪": [120, 0],
                 "妖神记": [115, 0],
                 "完美世界": [125, 0],
                 "斗罗大陆": [150, 0],
                 "斗破苍穹": [120, 0],
                 "凡人修仙传": [120, 0],
                 "武动乾坤第三季": [123, 0],
                 "镜·双城": [105, 0],
                 "山海经之兵主奇魂": [120, 0],
                 "少年歌行风花雪月篇": [25, 0],
                 "我叫赵甲第": [94, 0],
                 "没有工作的一年": [125, 0]
                };

// 初始化全屏状态，只有第一次的时候会显示全屏。
let initFullScreen = false;

const title_prefix = "title";
const command_prefix = "command";

let 剧名;

// 这里获取到 video 播放器的对象。
const video = document.querySelector("#player > div.yzmplayer-video-wrap > video");

function 全屏(){
    document.querySelector("#player > div.yzmplayer-controller > div.controller-box > div.yzmplayer-icons.yzmplayer-icons-right > div.yzmplayer-full > button.yzmplayer-icon.yzmplayer-full-icon").click();
}

video.addEventListener('playing', function () { //播放中
    console.log("播放中");
    if(!initFullScreen) {
        initFullScreen = true;
        全屏();
        handleEvent();
    }
});

// 注册消息事件监听，接受父元素给的数据
window.addEventListener('message', (e) => {
    let datas = e.data;
    console.log('iframe=' + datas);
    if (datas.indexOf(title_prefix) >= 0) {
        剧名 = datas.replace(title_prefix, "");
        // 说明获取到了剧名， 然后就可以通过剧名自动跳过广告了。
        const j_time = 动漫跳过时间表[剧名][0];
        console.log("获取到的跳过时间是：", j_time);
        跳过指定时间(j_time);

        定时器判断当前播放时间是否大于片尾时间(动漫跳过时间表[剧名][1]);
    }
}, false);
// 向父级询问剧名。
function handleEvent() {
    // 向父页面发消息
    window.parent.postMessage(command_prefix + 'get_title', '*');
}

// 跳过指定时间
function 跳过指定时间(j_time) {
    if(video.currentTime>=1){
        video.currentTime += j_time;
    }else{
        video.currentTime += j_time;
        video.play();
    }
}

// 监听按键
window.document.onkeydown=function(event) {
    const key = event.key;
    console.log("按下的是：",key);
    // 如果是按下的n 键，就发消息给父页面，点击下一集。
    if("n" === key) {
        window.parent.postMessage(command_prefix + 'next', '*');
        // console.log('打印一下按n的时候播放到的秒数：', video.currentTime);
    }
};

function 定时器判断当前播放时间是否大于片尾时间(endTime) {
    const intval = setInterval(()=>{
        const video_currentTime = video.currentTime;
        if (video_currentTime >= endTime) {
            console.log('这里就停止定时器了，并跳转下一集!',video_currentTime);
            clearInterval(intval);
            window.parent.postMessage(command_prefix + 'next', '*');
        }
    }, 1000);
}

