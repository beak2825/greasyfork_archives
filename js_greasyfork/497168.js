// ==UserScript==
// @name        新标签页中打开链接
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      glman
// @license      GPL-3.0 License
// @run-at       document-en
// @description 使页面上所有链接在新标签页中打开
// @downloadURL https://update.greasyfork.org/scripts/497168/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/497168/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function(){
  // 创建一个新的<base>标签
  var baseTag = document.createElement('base');

  // 设置target属性为"_blank"
  baseTag.target = '_blank';

  // 找到页面的<head>部分
  var head = document.head || document.getElementsByTagName('head')[0];

  // 将<base>标签插入到<head>中
  head.appendChild(baseTag);
})()
