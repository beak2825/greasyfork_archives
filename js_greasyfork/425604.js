// ==UserScript==
// @name         补充
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  视频自动播放静音
// @author       shaojs
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @match        https://*.xuexi.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.0.3/dist/umd/supabase.min.js
// @grant        GM_download
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/425604/%E8%A1%A5%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/425604/%E8%A1%A5%E5%85%85.meta.js
// ==/UserScript==
(async function() {
  'use strict';
  async function video_play_muted(){
    if ($('video')!=null){
      console.info("找到播放组件")
      setTimeout('document.querySelector("video").play()', 3000 );
      console.info("播放组件静音")
      setTimeout('document.querySelector("video").muted = true', 3000 );
    }else{
      console.info("未找播放组件")
      setInterval(video_play_muted(),3000);
    }
    //if(ocument.querySelector("video").muted == false)
    
  }
  video_play_muted();
  
  setTimeout('document.querySelector("video").play()', 3000 );
  console.info("播放组件静音")
  setTimeout('document.querySelector("video").muted = true', 3000 );
  
})();