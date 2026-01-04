// ==UserScript==
// @name         小狸视频 
// @namespace    Violentmonkey Scripts
// @homepage     http://shiyulanxuan.gitee.io/beaver_videos/#/
// @description  视频解析脚本
// @supportURL   http://shiyulanxuan.gitee.io/beaver_videos/#/
// @match        *://*/*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://v.youku.com/v_*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/adv*
// @include      *v.qq.com/x/cover/*
// @include      *v.qq.com/x/page/*
// @include      *v.qq.com/*play*
// @include      *v.qq.com/cover*
// @grant        none
// @version      1.0
// @author       落花人独立
// @description  2020/8/15 下午10:48:59
// @downloadURL https://update.greasyfork.org/scripts/408861/%E5%B0%8F%E7%8B%B8%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/408861/%E5%B0%8F%E7%8B%B8%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
  
window.setTimeout(function() {
  var url = window.location.href;
  var newElement=`<iframe src="https://vip.mpos.ren/v/?url=${url}" height="100%" width="100%" scrolling="no"></iframe>`;
  var tenvideo_player = document.getElementById('tenvideo_player');
  if(tenvideo_player)
  {
    tenvideo_player.innerHTML=newElement;
    alert("【腾讯视频】正在解析...");
  }
  else if(url.indexOf("www.iqiyi.com")>=0)
  {
      alert("爱奇艺");
  }
}, 5000);
