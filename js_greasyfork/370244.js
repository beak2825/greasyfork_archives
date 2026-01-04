// ==UserScript==
// @name         虎牙直播旧版网页全屏
// @namespace    http://www.huya.com/
// @version      0.2
// @description  剧场模式时屏蔽礼物栏，并开启弹幕输入框，屏蔽右下角订阅和暂停时左下角二维码
// @author       gesla
// @match        http*://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370244/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%97%A7%E7%89%88%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/370244/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%97%A7%E7%89%88%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

'use strict'
const css = `
body.mode-page-full .room-player-wrap .room-player-main #player-wrap
  {
    height: 100% !important;
    width: 100% !important;
  }

body.mode-page-full .room-player-wrap .room-player-main #player-ctrl-wrap
  {
    bottom: -60px !important;
    padding:0 !important;
  }

body.mode-page-full .room-player-wrap .room-player-main:hover #player-ctrl-wrap
  {
    bottom: 0 !important;
  }

body.mode-page-full .room-player-wrap .room-player-main #player-full-input
  {
    display:block !important;
  }

#player-subscribe-wap
{
display:none !important;
}
#player-ctrl-wrap .player-app-qrcode
{
display:none !important;
}
#huya-ab .banner-ab-warp
{
display:none !important;
}
`
let style = document.createElement('style')
style.innerHTML = css
document.querySelector('head').appendChild(style)

function timer($el,cb){
    let time=setInterval(()=>{
        if($el.length>0){
            clearInterval(time);
            $el[0].click();
            cb();
        }
    },1);
}
(function() {
      $('body').on('keydown',event=>{
          if(event.keyCode===13){
              $("#player-full-input-btn").click();
          }
      });
  }
 )();

