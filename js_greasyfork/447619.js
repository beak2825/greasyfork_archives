// ==UserScript==
// @name         替换逼站源
// @namespace    https://github.com/shadowdreamer/jioben
// @version      0.1
// @description  通过本地或者在线视频替换b站播放视频
// @author       cure_dovahkiin
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447619/%E6%9B%BF%E6%8D%A2%E9%80%BC%E7%AB%99%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/447619/%E6%9B%BF%E6%8D%A2%E9%80%BC%E7%AB%99%E6%BA%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function insertBtn(){
    let localBtn = document.createElement('div');
    localBtn.className="watch-info ops replace_video_source"
    localBtn.innerHTML=`
      <a>本地源  </a>
    `
    localBtn.onclick = function(){
      let picker = document.createElement('input');
      picker.type='file'
      picker.onchange=function(ev){
        console.log(ev);
        const file = ev.target.files?.[0];
        if(!file)return;
        let url = URL.createObjectURL(file)
        replaceResouce(url)
      };
      document.body.append(picker);
      picker.click()
    };


    let onlineBtn = document.createElement('div');
    onlineBtn.className="watch-info ops"
    onlineBtn.innerHTML=`
      <a>在线源</a>
    `;
    onlineBtn.onclick = function(){
      let url = prompt('输入在线源,确保可播放');
      replaceResouce(url)
    };

    const bar = document.querySelector('#toolbar_module,#arc_toolbar_report');
    bar && bar.append(localBtn);
    bar && bar.append(onlineBtn);
  };
  function replaceResouce(url){
    const vdo = document.querySelector('.bpx-player-video-wrap video, .bilibili-player-video video')
    vdo.src = url;
  }

  function init(){
    insertBtn();
    setTimeout(()=>{
      let target = document.querySelector('.replace_video_source');
      if(!target){
        init()
      }
    },2000)
  };
  setTimeout(() => {
    init()
  }, 2000);
})();
