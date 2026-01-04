// ==UserScript==
// @name         YouTube 頻道直播自動開啟（台灣地震監視）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動開啟台灣地震監視頻道「直播」分頁的地震直播影片
// @author       shanlan(ChatGPT o3-mini)
// @match        https://www.youtube.com/channel/UCa32OtZqhDqDqCHeWO477qg/streams
// @match        https://www.youtube.com/@%E5%8F%B0%E7%81%A3%E5%9C%B0%E9%9C%87%E7%9B%A3%E8%A6%96/streams
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544042/YouTube%20%E9%A0%BB%E9%81%93%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8B%95%E9%96%8B%E5%95%9F%EF%BC%88%E5%8F%B0%E7%81%A3%E5%9C%B0%E9%9C%87%E7%9B%A3%E8%A6%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544042/YouTube%20%E9%A0%BB%E9%81%93%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8B%95%E9%96%8B%E5%95%9F%EF%BC%88%E5%8F%B0%E7%81%A3%E5%9C%B0%E9%9C%87%E7%9B%A3%E8%A6%96%EF%BC%89.meta.js
// ==/UserScript==

(function(){
'use strict';
if(!location.pathname.endsWith('/streams')) return;
function tryOpen(){
  const items=document.querySelectorAll('ytd-rich-item-renderer');
  for(const it of items){
    const a=it.querySelector('ytd-thumbnail[is-live-video] a#thumbnail');
    if(!a || !a.href) continue;
    const title = (a.getAttribute('aria-label')||'') || (it.querySelector('#video-title,yt-formatted-string#video-title')?.textContent||'');
    if(title.includes('地震')){ location.href=a.href; return true; }
  }
  return false;
}
if(!tryOpen()){
  const interval=setInterval(()=>{ if(tryOpen()) clearInterval(interval); },200);
}
})();