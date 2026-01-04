// ==UserScript==
// @name         完美看看-通过剧名自动跳过片头
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  按对应视频的剧名可以跳过对应时长。
// @author       weiv
// @match        https://www.wanmeikk.film/dplayer.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanmeikk.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451077/%E5%AE%8C%E7%BE%8E%E7%9C%8B%E7%9C%8B-%E9%80%9A%E8%BF%87%E5%89%A7%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/451077/%E5%AE%8C%E7%BE%8E%E7%9C%8B%E7%9C%8B-%E9%80%9A%E8%BF%87%E5%89%A7%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

// weiv 2022-07-24 记录一下，如果找不到需要播放视频的上下文的时候可以使用如下方式：
// 在调试工具中，选择能够获取到视频播放 video 对象的上下文，肯定不是 top。
// 然后在控制台里面输入： window.location 就可以看到地址这些信息。主要就看看 href ，或者 origin + pathname 的值，就例如上面的。

const 动漫跳过时间表 = {"灵剑尊": [160, 585, 1],
                 "万界神主": [125, 449, 1],
                 "万界仙踪": [120, 429, 1],
                 "妖神记": [115, 428, 1],
                 "完美世界": [125, 1063, 1],
                 "斗罗大陆": [150, 1817, 1],
                 "斗破苍穹": [120, 12000, 1],
                 "斗破苍穹 年番": [144, 12000, 1],
                 "凡人修仙传": [130, 1124, 1],
                 "武动乾坤第三季": [123, 1716, 1],
                 "镜·双城": [105, 1200, 1],
                 "山海经之兵主奇魂": [120, 1200, 1],
                 "少年歌行风花雪月篇": [25, 1200, 1],
                 "我叫赵甲第": [94, 1557, 1],
                 "没有工作的一年": [125, 3747, 1],
                 "龙蛇演义": [152, 1908, 1],
                 "吞噬星空": [180, 1289, 1],
                 "沉香如屑": [90, 3526, 1.5],
                 "沉香如屑·沉香重华": [90, 3526, 1.5],
                 "苍兰诀": [110, 3526, 1.5],
                 "星汉灿烂·月升沧海": [90, 3341, 1.5]
                };

// 初始化全屏状态，只有第一次的时候会显示全屏。
let initFullScreen = false;

const title_prefix = "title";
const command_prefix = "command";

let 剧名;

// 这里获取到 video 播放器的对象。
const video = document.querySelector("#player > div.dplayer-video-wrap > video");

function 全屏(){

    // 0.实现全屏

    // video.webkitRequestFullScreen()

    document.querySelector("#player > div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-full > button.dplayer-icon.dplayer-full-icon").click();
}

function 定时器判断是否开始播放() {
    return setInterval(()=> {
        console.log('每一秒判断播放状态！');
        video.autofocus = true
        video.focus();

        if(isFullscreenEnabled()) {
            console.log('判断是否已经是全屏');
            document.body.pressKey('Tab');
        }

    }, 1000);
}

// const interval_id = 定时器判断是否开始播放();

video.addEventListener('playing', function () { //播放中
    console.log("播放中, 关闭定时器！");
    // clearInterval(interval_id);
    if(!initFullScreen) {
        initFullScreen = true;
        全屏();
        handleEvent();
    }
});


video.addEventListener('waitin', function () { //加载
    console.log("加载中");
});

// 注册消息事件监听，接受父元素给的数据
window.addEventListener('message', (e) => {
    let datas = e.data;
    console.log('iframe=' + datas);
    if (datas.indexOf(title_prefix) >= 0) {
        console.log('说明获取到了剧名， 然后就可以通过剧名自动跳过广告了。');
        剧名 = datas.replace(title_prefix, "");
        // 说明获取到了剧名， 然后就可以通过剧名自动跳过广告了。
        const j_time = 动漫跳过时间表[剧名][0];
        console.log("获取到的跳过时间是：", j_time);
        跳过指定时间(j_time);

        定时器判断当前播放时间是否大于片尾时间(动漫跳过时间表[剧名][1]);

        倍速播放(动漫跳过时间表[剧名][2]);
    } else {
        console.log('这里没有获取到剧名！继续获取会导致暂停之后又播放到开始位置。。。');
        // handleEvent();
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
        video.currentTime = j_time;
    }else{
        video.currentTime = j_time;
        video.play();
    }
}

// 开启倍速播放
function 倍速播放(playRate) {
    video.playbackRate = playRate
}

// 监听按键
window.document.onkeydown=function(event) {
    const key = event.key;
    console.log("按下的是：",key);
    // 如果是按下的n 键，就发消息给父页面，点击下一集。
    if("n" === key) {
        window.parent.postMessage(command_prefix + 'next', '*');
    } else if("g" === key) {
        console.log('打印一下按get(g)的时候播放到的秒数：', video.currentTime);
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

HTMLElement.prototype.pressKey = function(e) {
    var doc = document.createEvent("UIEvents");
    doc.key = e;
    doc.initEvent("keydown", true, true);
    this.dispatchEvent(doc);
}

/**
 * [isFullscreenEnabled 判断全屏模式是否是可用]
 * @return [支持则返回true,不支持返回false]
 */
function isFullscreenEnabled(){
    return document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled || false;
}







