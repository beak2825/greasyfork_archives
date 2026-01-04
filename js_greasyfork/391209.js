// ==UserScript==
// @name         广播挂件
// @namespace    https://greasyfork.org/users/385498
// @version      0.3
// @description  播放中国之声广播
// @author       syb | 7P_LonG
// @include https://fanyi.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391209/%E5%B9%BF%E6%92%AD%E6%8C%82%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/391209/%E5%B9%BF%E6%92%AD%E6%8C%82%E4%BB%B6.meta.js
// ==/UserScript==



(function() {
    'use strict';
    //仅挂载到百度翻译下，因为如所有页面均加载插件，请求超过一定次数时，貌似chrome会做限制。
const tipid = 'radio-text';//提示框id
const wintip = `<div id="radio-wrapper"
	style="position: fixed;right: 10px;top: 50px;background: #eee;
		width: 50px;height: 50px;z-index:99999;border:1px solid #999;">
	<p class="btn-ctrl" style="background: greenyellow;">play</p>
	<p id="radio-text"></p>
	<audio id="radio-player" src="" preload="auto" ></audio>
</div>`;
        const win = document.createElement('div');
        win.innerHTML = wintip;
        document.getElementsByTagName('body')[0].append(win);
        const show = (e)=>{
            e = e.toString();
            document.getElementById(tipid).textContent= e;
        };
const srcArr = [
    '//ngcdn001.cnr.cn/live/zgzs/index.m3u8',
    '//rtmpcnr001.cnr.cn/live/zgzs/playlist.m3u8',
    '//lhttp.qingting.fm/live/386/64k.mp3'
];
let isOn = false;
const wrapper = document.getElementById("radio-wrapper");
const audio = document.getElementById('radio-player');
const btn = wrapper.querySelector(".btn-ctrl");
const errfn = function(e){
    console.log(e)
    if(srcArr.length === 0){
         console.log('全资源失效');
        audio.removeEventListener('error',errfn);
         return false;
    }
    audio.src = srcArr.shift();
    if(isOn){audio.play()}
};
audio.src = srcArr[0];
audio.addEventListener('error',errfn);

btn.addEventListener('click',function(){
    isOn = true;
    if(audio.paused === true){
        audio.play()
    }else{
        audio.pause()
        btn.textContent= 'play';
    }
    setTimeout(function(){
        if(!audio.paused){
            btn.textContent= 'stop';
        }
    },1000)
});
})();