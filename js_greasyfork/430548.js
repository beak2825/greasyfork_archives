// ==UserScript==
// @name         百度贴吧图片自动展开
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  百度贴吧的图片自动展开
// @author       tlj
// @match        *://tieba.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430548/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/430548/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==



jQuery(function($) {
  $('div.replace_tip').click()
});
