// ==UserScript==
// @name        优课在线自动挂机
// @namespace   https://osu.ppy.sh/u/376831
// @include     *www.uooconline.com/learn/*
// @version     1.0
// @description 优课在线自动挂机脚本，支持失去焦点继续播放、自动播放下一节
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24768/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/24768/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==
$(document).ready(function () {
  setInterval(function () {
    var btn = $('div.btn.btn-danger.next');
    btn.click();
  }, 1000);
});