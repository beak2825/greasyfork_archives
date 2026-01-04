// ==UserScript==
// @name       自动展开百度贴吧帖子的图片
// @namespace  tency
// @version    0.2
// @description  自动展开百度贴吧帖子的图片，方便浏览图片帖
// @match      *://tieba.baidu.com/p/*
// @copyright  2014+, LYY
// @downloadURL https://update.greasyfork.org/scripts/396083/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/396083/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

jQuery(function($) {
  $('div.replace_tip').click()
});