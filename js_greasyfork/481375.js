// ==UserScript==
// @name         Arxiv跳转翻译
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Jump to translation from any arxiv papaers!
// @author       ziuch
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/pdf/*
// @icon         https://static.arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481375/Arxiv%E8%B7%B3%E8%BD%AC%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/481375/Arxiv%E8%B7%B3%E8%BD%AC%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  if (window.top !== window.self) {
    return
  }
  function _appendCss(css, name) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.setAttribute("data-component", name);
    style.innerHTML = css;
    head.appendChild(style);

      // Create a new style element
      var style1 = document.createElement('style');
      style.type = 'text/css';

      // Define your keyframes and other CSS as a string
      var keyFrames = `
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.125);
        opacity: 0.85;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}`;

      // Set the innerHTML of the style element to your CSS string
      style1.innerHTML = keyFrames;

      // Append the style element to the head of the document
      document.head.appendChild(style1);

  }
  function addStyle() {
    //debugger;
    let via_markdown_css = `.via-markdown-btn{display: inline-block; vertical-align: middle; height: 50px; width:50px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 18px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}.via-markdown-btn-sm{height: 20px; line-height: 20px; padding: 0 6px; font-size: 18px;}`;
    _appendCss(via_markdown_css, "btn");
  }
  //创建复制按钮
  function addBtn() {
    var btn = document.createElement('button');
    btn.style = "top: 280px;left:8px; position: fixed;z-index:1000;cursor:pointer;background:rgba(179, 27, 27,0.9);height: 50px;wight:50px;border-radius: 50%; animation: pulse 2s infinite;font-size: 16px;"
    btn.className = "via-markdown-btn via-markdown-btn-sm"
    btn.innerHTML = "翻译"
    btn.id = "translateBtn"
    document.body.appendChild(btn);
  }
  addStyle();
  addBtn();
  let isclick = false; // 防止过快重复点击
  var $btn = document.getElementById("translateBtn")
  $btn.addEventListener("click", jump);
  document.addEventListener("dblclick",jump);
  function jump() {
      if (!isclick) {
          var url = `${document.URL}`
          console.log("orgin => " + url);
          // 使用 replace 方法进行替换
          var target_url = url.replace('arxiv', 'ar5iv');
          console.log("new => " + target_url);
          window.open(target_url);
      }
  }
})();