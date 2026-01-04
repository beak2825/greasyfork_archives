// ==UserScript==
// @name         Youtube 預讀取全部播放清單
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  播放清單數量超過100個，可預先讀取全部影片
// @author       Shanlan(o3-mini)
// @match        https://www.youtube.com/playlist?list=*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542612/Youtube%20%E9%A0%90%E8%AE%80%E5%8F%96%E5%85%A8%E9%83%A8%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/542612/Youtube%20%E9%A0%90%E8%AE%80%E5%8F%96%E5%85%A8%E9%83%A8%E6%92%AD%E6%94%BE%E6%B8%85%E5%96%AE.meta.js
// ==/UserScript==

(function(){
let u="";
setInterval(()=>{
  if(u!==location.href){
    u=location.href;
    if(u.includes("/playlist?list=")){
      document.getElementById("exportTabTextList")?.remove();
      let bi=setInterval(()=>{
        let t=document.querySelectorAll("div.yt-page-header-view-model__page-header-content,div.thumbnail-and-metadata-wrapper.style-scope.ytd-playlist-header-renderer");
        if(t.length&&!document.getElementById("exportTabTextList")){
          let btn=document.createElement("button");
          btn.id="exportTabTextList";
          btn.textContent="清單全部讀取";
          btn.style="font-family:Roboto,Arial,sans-serif;font-size:13px;margin-top:10px;";
          t[t.length-1].parentNode.insertBefore(btn,t[t.length-1].nextSibling);
          btn.onclick=()=>{
            let si=setInterval(()=>{
              if(document.querySelectorAll("ytd-continuation-item-renderer.ytd-playlist-video-list-renderer").length)
                window.scrollTo(0,document.documentElement.scrollHeight);
              else {
                window.scrollTo(0,document.documentElement.scrollHeight);
                setTimeout(()=>{window.scrollTo(0,0);},300);
                clearInterval(si);
              }
            },100);
          };
          clearInterval(bi);
        }
      },100);
    }
  }
},100);
})();