// ==UserScript==
// @name        click thx
// @name:zh-CN  感谢解锁
// @name:zh-TW  感謝解鎖
// @namespace   https://oursogo.com
// @match       https://oursogo.com/thread*
// @match       https://oursogo.com/forum.php?mod=viewthread&tid=*
// @grant       none
// @version     2024-08-31 07:37
// @icon        https://oursogo.com/static/image/common/bbs.ico
// @author      qq
// @description 感謝解鎖
// @description:zh-CN  解锁感谢
// @description:zh-TW  解鎖感謝
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505950/%E6%84%9F%E8%B0%A2%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/505950/%E6%84%9F%E8%B0%A2%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

setTimeout(function(){
  let thx = document.querySelector('div.locked a[onclick*="thanks"]');
  if (!!thx) {
    thx.click();
    setInterval(function(){

      let sendthx = document.querySelector('div.pns button');
      if (!!sendthx){
        sendthx.click();

      }
    }, 500);
  }

}, 2500);