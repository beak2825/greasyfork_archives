// ==UserScript==
// @name        mirrorVideo
// @name:zh-CN  视频镜像器
// @namespace   leizingyiu.net
// @match       *://*.*/*
// @grant       GM_registerMenuCommand
// @version     2022/10/23 03:12:18
// @author      leizingyiu
// @description 点一下，把视频左右反过来
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/453560/mirrorVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/453560/mirrorVideo.meta.js
// ==/UserScript==

function mirrorVideo(){
  let styleId='yiu_video_mirror';
  if(document.getElementById(styleId)){
    document.body.removeChild(document.getElementById(styleId));
  }else{
let style=document.createElement('style');
style.id=styleId;
style.innerHTML=`video{transform: scale(-1,1);}`;
document.body.appendChild(style);}
}

GM_registerMenuCommand ('mirror videos', mirrorVideo, 'V');