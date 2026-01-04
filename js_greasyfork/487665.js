// ==UserScript==
// @name         Json.cn-clean
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  json.cn 广告屏蔽
// @author       半块苹果
// @match        https://www.json.cn/**
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487665/Jsoncn-clean.user.js
// @updateURL https://update.greasyfork.org/scripts/487665/Jsoncn-clean.meta.js
// ==/UserScript==

window.onload = function () {
  // 全屏
  const bodyElement = document.querySelector('body');
  bodyElement.classList.add('format-fullscreen');

  // 添加 placeholder
  var j = document.getElementById('json-src');
  var alt = '在这里输入 json 数据';
  if (j) {
    j.setAttribute('placeholder', alt);
  }

  // 移除广告和弹窗
  var topLinkArea = document.getElementsByClassName('top-link-area');
  var dialog = document.getElementsByClassName('modal-dialog');
  if (topLinkArea) {
    topLinkArea[0].parentNode.removeChild(topLinkArea[0]);
  }
  if (dialog) {
    dialog[0].parentNode.removeChild(dialog[0]);
  }
};