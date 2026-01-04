// ==UserScript==
// @name        视频速度 / videoSpeed
// @namespace   leizingyiu.net
// @match       *://*.*/*
// @grant       none
// @version     2023.08.22
// @author      leizingyiu
// @description 在视频播放页面，点击 alt + v，然后输入需要的速度数字，回车即可调整视频播放速度 ; 请自行在其中一个require前添加@，或者将引用部分复制过来。
// @license      GNU AGPLv3
// @require https://greasyfork.org/scripts/473644-multikeys/code/multiKeys.js?version=1238968
// @downloadURL https://update.greasyfork.org/scripts/473641/%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%20%20videoSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/473641/%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%20%20videoSpeed.meta.js
// ==/UserScript==

function videoSpeed(){
if(document.querySelector('video')){
  let s=window.prompt('视频速度 / video speed:',2);
  if(isFinite( Number(s))===false){
    alert('请输入数字 / pls enter Number');
    throw('请输入数字 / pls enter Number');
  }else{
    document.querySelector('video').playbackRate=s;
  }
}else{
  alert('找不到视频 / cant fint video')
}
void 0 ;
}

const m = new multiKeys();
m.registerIgnore('control', 'meta');
m.register(['alt', 'v'],
    () => {
        console.log('alt v');
        videoSpeed();
    },
    () => {
        // console.log('release a')
    },
    false);