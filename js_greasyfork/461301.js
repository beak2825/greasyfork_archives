// ==UserScript==
// @name douyin.com - 2025.10.29
// @namespace github.com/openstyles/stylus
// @version 1.1.0
// @description A new userstyle
// @author Me
// @license 无
// @grant GM_addStyle
// @run-at document-start
// @match *://*.douyin.com/*
// @match https://www.douyin.com/
// @match https://www.douyin.com/?*
// @match https://www.douyin.com/search/*
// @downloadURL https://update.greasyfork.org/scripts/461301/douyincom%20-%2020251029.user.js
// @updateURL https://update.greasyfork.org/scripts/461301/douyincom%20-%2020251029.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "douyin.com" || location.hostname.endsWith(".douyin.com"))) {
  css += `
  /*整个抖音域名都生效*/
  /*隐藏右上角*/
  pace-island > div:first-child > div:nth-child(-n+3) {
      /*现在应该只剩【通知】【私信】【投稿】【个人头像】*/
      display: none;
  }

  /*眼不见为净*/
  footer,
  [data-e2e="user-info"] + div > div:last-child,       /*个人资料旁边的下载抖音按钮2025.10.29*/

  [data-e2e="search-history-container"] + div,    /*【打开搜索框】猜你想看 词条*/
  [data-e2e="search-guess-container"],            /*【打开搜索框】猜你想看 词条*/
  [data-e2e="search-guess-container"] + div,      /*【打开搜索框】抖音热点 文字*/
  [data-e2e="search-hot-container"],              /*【打开搜索框】抖音热点 词条*/
  #douyin-navigation,                             /* 【右边框】*/
  #douyin-sidebar                                 /* 右下角的意见反馈*/
  {
      display: none !important;
  }


  /*视频左边*/
  .dySwiperSlide.page-recommend-container[data-e2e="feed-item"]{
      margin-left: 5px;
  }




  /*-------------------下面是配套脚本自定义样式--------------------------*/
  /*下载按钮*/
  #downloadLink {
      color: white;
  }

  /*生成的到刷视频按钮的样式*/
  #ikun {
      opacity: 90%;
      z-index: 504;
      position: fixed;
      right: 5px;
      bottom: 80px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      box-shadow: 0 0 5px #999;
      cursor: pointer;
      background-image: url(data:image/png;base64,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);
      background-repeat: no-repeat;
      background-size: 100%;
      background-color: #4a4949;
  }

  /*说明快捷键---------样式--------------*/
  .shortcut {
      z-index: 501;
      position: fixed;
      right: 5px;
      top: 90px;
      width: 50px;
      height: 40px;
      opacity: 30%;
      border-radius: 50%;
      color: #fff;
      font-size: 10px;
      line-height: 40px;
      cursor: pointer;
      box-shadow: 0 0px 6px 3px #7b849c87;
      /*阴影     水平偏移 垂直偏移  模糊  阴影大小*/
      transition: all 0.5s;
      /*过渡效果2023.1.31*/
  }
  .shortcut:hover,
  .shortcut:hover .shortcut-info {
      opacity: 80%;
      display: block;
  }
  .shortcut-info {
      display: none;
      position: absolute;
      top: 40px;
      right: 0px;
      width: 130px;
      padding: 10px;
      border-radius: 5px;
      background-color: rgb(242, 242, 242);
      font-size: 12px;
      color: #6a5acd;
      z-index: 999;
      text-align: left;
      /* 文字靠左 */
      line-height: 1.2;
      /* 设置行高 */
  }
  `;
}
if (location.href.startsWith("https://www.douyin.com/?") || location.href === "https://www.douyin.com/") {
  css += `
  /*刷视频 页面生效  */

  /*广告标签*/
  [class="RA5iG98_"] {
      background-color: red;
      width: 40%;
  }


  [class="xgplayer-dynamic-bg"]:before {
      content: '...................直播...............';
      text-align: center;
      font-size: 110px;
      width: 100%;
      height: 100%;
      background-color: red;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999999
  }

  /*广告卡片*/
  #ki2nq0ug {
      width: 100vw;
      height: 100vh;
      background-color: #d4904d;
      position: relative
  }

  /*广告小图标*/
  span[style="background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.5);"]:before {
      content: '...................广告...............';
      text-align: center;
      box-shadow: 100px 119px 900px 100px #0046ff;
      background-color: #d4904d;
      width: 100vw;
      height: 100vh;

      overflow: visible;
      z-index: 9999999;
  }
  `;
}
if (location.href.startsWith("https://www.douyin.com/search/")) {
  css += `
  /*搜索视频 页面生效  */
  #ikun {
      right: 250px;
      bottom: 125px;
      width: 39px;
      height: 39px;
  }

  /* 充砖石、客户端 */
  .QUUswvJ3 {
      display: none!important;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
