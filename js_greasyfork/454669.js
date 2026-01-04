// ==UserScript==
// @name         哔哩哔哩手机直接看
// @version      7.8
// @description  优化哔哩哔哩手机网页视频观看体验
// @author       ChatGPT
// @run-at       document-start
// @match        https://m.bilibili.com/*
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/454669/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%8B%E6%9C%BA%E7%9B%B4%E6%8E%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454669/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%89%8B%E6%9C%BA%E7%9B%B4%E6%8E%A5%E7%9C%8B.meta.js
// ==/UserScript==

// 监听 copy 事件
document.addEventListener('copy', function(event) {
   // 获取复制的文本
   var text = window.getSelection().toString();
   // 判断文本是否以 "2233" 开头，如果是则禁止复制
   if (text.startsWith('2233')) {
     console.log('Copying is not allowed for this content!');
     event.preventDefault();
     return;
   }
   // 将复制的文本保存到剪贴板中
   navigator.clipboard.writeText(text)
     .then(function() {
       console.log('Copied to clipboard successfully!');
     })
     .catch(function(error) {
       console.error('Failed to copy to clipboard: ', error);
     });
});
setTimeout(function(){
  var el = document.querySelector('.dialog-close');
  if (el) {
    el.click();
  }
}, 2000);

setTimeout(() => {
  document.addEventListener('copy', function(event) {
  var text = window.getSelection().toString();
  if (text.startsWith('2233 ')) {
    var link = text.substring(text.indexOf('http'));
    var bv = link.match(/BV[^\?]+/);
    if (bv && location.href.indexOf(bv[0]) === -1) {
      event.preventDefault();
      setTimeout(function() {
        window.location.assign(link);
      }, 100);
      return;
    }
  }
});
}, 1500); // 延迟1.5秒执行

(function() {try{if (document) {if (typeof document.hmcwwtvsiq !== 'undefined' && document.hmcwwtvsiq !== null)return;var heads = document.getElementsByTagName('head');if (heads.length > 0) {var head = heads[0];var style = document.createElement('style');head.appendChild(style);style.textContent = ".open-app.weakened,DIV.mplayer-poster-call-app.mplayer-play-btn-call-app,DIV.open-app-bar,SPAN.bili-app,DIV.mplayer-ending-panel-recommend,DIV.v-overlay--show,DIV.ralated-video-title,DIV.launch-app-btn.m-video-main-launchapp.visible-open-app-btn.natural-margin,DIV.launch-app-btn.m-space-float-openapp,DIV.launch-app-btn.related-openapp,.launch-app-btn.home-float-openapp,.m-video2-float-openapp,.nav-open-app-img,.mplayer-fullscreen-call-app,div.mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-speed,div.openapp-mask,DIV.openapp-content,DIV.bottom-tabs,i.icon,div.m-video2-awaken-btn,div.launch-app-btn.icon-spread,DIV.mplayer-control-btn.mplayer-control-btn-callapp.mplayer-control-btn-quality,DIV.mplayer-widescreen-callapp,wx-open-launch-app.wx-open-app-btn.update-extinfo,DIV.mplayer-comment-text-callapp.mplayer-comment-text { display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px; }";document.hmcwwtvsiq = 1;}}}catch(fjgytsugdrtes){}})();

setTimeout(function(){
document.querySelector("DIV.btn.light")?.click();
}, 500);
setTimeout(function() { var titleTextElements = document.querySelectorAll("DIV.title-wrapper,H1.title-text,DIV.share-video-info *"); titleTextElements.forEach(function(element) { element.onclick = function(event) { event.preventDefault(); event.stopPropagation(); return false; }; }); }, 3000);

const style = document.createElement('style');
  style.innerHTML = `
    div.to-see {
  transform: scale(1.5);
}
  `;
  document.head.appendChild(style);