// ==UserScript==
// @name         贴吧图片自动展开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动展开贴吧图片
// @author       refcell
// @license      MIT
// @match        *://tieba.baidu.com/p/*
// @icon         https://tieba.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440129/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/440129/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

document.addEventListener('DOMNodeInserted', function (e) {
  try {
    $('.replace_tip').click()
  } catch (error) {
    //alert(error);
  }
})