// ==UserScript==
// @name        墨刀可操作控件高亮（改）
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     2.0
// @author      YoumiyaHina
// @description 新版墨刀不适用旧版脚本，做了个修改，增加了颜色替换和透明度调整
// @include      *://*.modao.cc/*
// @include      *modao.cc/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/477656/%E5%A2%A8%E5%88%80%E5%8F%AF%E6%93%8D%E4%BD%9C%E6%8E%A7%E4%BB%B6%E9%AB%98%E4%BA%AE%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477656/%E5%A2%A8%E5%88%80%E5%8F%AF%E6%93%8D%E4%BD%9C%E6%8E%A7%E4%BB%B6%E9%AB%98%E4%BA%AE%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

setInterval(function() {
  var elements = document.getElementsByClassName("region");

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
    elements[i].style.backgroundColor = "rgba(0, 0, 250, 0.3)"
  }
}, 100);
