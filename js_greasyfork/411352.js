// ==UserScript==
// @name         阅读加宽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阅读加宽，尽量避免水平的滚动条；适用于 知乎、思否、stackoverflow、掘进、简书
// @author       You
// @include      *://www.zhihu.com/question*
// @include      *://segmentfault.com*
// @include      *://stackoverflow.com*
// @include      *://juejin.im/post*
// @include      *://www.jianshu.com/p*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411352/%E9%98%85%E8%AF%BB%E5%8A%A0%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/411352/%E9%98%85%E8%AF%BB%E5%8A%A0%E5%AE%BD.meta.js
// ==/UserScript==

(function () {
  var style_zhihu = `
  .Question-main { width: 95%; }
  .ListShortcut { width: calc(100% - 320px); }
  .Question-mainColumn { width: 100%; }`;

  var style_segmentfault = `
  #sf-article { width: calc(98% - 80px); max-width: 100% !important; margin-left: 80px; }`;

  var style_stackoverflow = `
  .container { max-width: calc(98% - 80px) !important; }
  #content { max-width: 100% !important; }
  `;

  var style_juejin = `
  .container { max-width: calc(100% - 150px);margin-left: 100px; }
  .main-area { width: calc(100% - 260px) !important; }
  .article-suspended-panel { margin-left: -5rem !important; }
  `;

  var style_jianshu = `
  #__next div[role='main'] {
    width: calc(100% - 100px) !important;
    margin-left: 50px !important;
  }
  #__next div[role='main'] > div{
    flex: 1;
  }
  #__next >div:nth-of-type(2) {
    left: 10px !important;
  }
  `;

  console.log("插件开始加载样式...");
  console.log(location.host);
  var head = document.querySelector("head");
  var style = document.createElement("style");

  var host = location.host;
  if (host.indexOf("segmentfault.com") > -1) {
    style.innerHTML = style_segmentfault;
  } else if (host.indexOf("zhihu.com") > -1) {
    style.innerHTML = style_zhihu;
  } else if (host.indexOf("stackoverflow.com") > -1) {
    style.innerHTML = style_stackoverflow;
  } else if (host.indexOf("juejin.im") > -1) {
    style.innerHTML = style_juejin;
  } else if (host.indexOf("www.jianshu.com") > -1) {
    style.innerHTML = style_jianshu;
  }

  head.appendChild(style);
})();
