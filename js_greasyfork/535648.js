// ==UserScript==
// @name Bilibili 極簡模式
// @namespace http://tampermonkey.net/
// @version 5.5
// @description B站寬螢幕 (支援直式影片)
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www.bilibili.com/video/.*)$/
// @include /^(?:https://www.bilibili.com/list/.*)$/
// @include /^(?:https://www.bilibili.com/history)$/
// @downloadURL https://update.greasyfork.org/scripts/535648/Bilibili%20%E6%A5%B5%E7%B0%A1%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535648/Bilibili%20%E6%A5%B5%E7%B0%A1%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
.win.video-info-container{  margin-top: -1%}

.main-content { /*history width*/
    width: 80%!important;
    max-width: 100% ;}

/* 基礎播放器設定 */
#playerWrap {
  height: initial;
  margin-top: -1%;
}

/* 影片播放器核心容器 */
video,
#bilibili-player{
  width:  auto;
  height: auto;
  max-height: calc(100vh - 140px);
  object-fit: contain;
}

/* 影片比例控制系統 */
.scroll-sticky.left-container,.playlist-container--left{
  width: 100%;
}
/* 新版右側欄位 - 動態高度適配 */
.right-container{
  right: 0;
  height: auto;
  max-height: none;
  z-index: 1000;
  opacity: 0;
  background: rgba(0, 0, 0, 0.85);
  transition: 0.0s ease; /* 特效 */
}
@media (width >= 1920px) { /* 高於此寬度保留右區塊 */
.right-container {
    position: absolute ;
      opacity: 1;}
#playerWrap {
    width: 98%;}
.video-toolbar-container{margin-top:2%}}/*修復讚、幣bar寬螢幕時位移的問題*/
        
@media (width < 1919px) { /* 低於此寬度移除右區塊 */
.right-container,.playlist-container--right{
  position: absolute !important;
  clip-path: polygon(70% 4%, 100% 4%, 100% 20%, 70% 20%);}
.playlist-container--right{
  right: 0;
  height: auto;
  max-height: none;
  z-index: 1000;
  opacity: 0;
  background: rgba(0, 0, 0, 0.85);
  transition: 0.0s ease; /* 特效 */}}

/* 主標題欄隱藏效果 */
#biliMainHeader,
.mini-header.bili-header__bar{
  position: absolute !important;
  height: auto;
  top: 0;
  z-index: 1000;
  opacity: 0;
  background: rgba(0, 0, 0, 0.85);
  clip-path: polygon(0% 0, 200% 0%, 200% 100%, 0% 100%);}

/* 懸停觸發展開效果 */
.right-container:hover,.playlist-container--right:hover,#biliMainHeader:hover,.mini-header.bili-header__bar:hover {opacity: 1;clip-path: none;}

/* 修改全螢幕部分代碼 */
:fullscreen #bilibili-player,
:fullscreen video {max-height: none !important;}.slide-ad-exp{display:none}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
