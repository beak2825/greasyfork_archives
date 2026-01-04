// ==UserScript==
// @name         Uta-Net 恢復複製操作
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=xu3u04u48
// @version      2025-05-25
// @description  解決無法複製歌詞的困擾
// @author       xu3u04u48
// @match        https://www.uta-net.com/song/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uta-net.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537213/Uta-Net%20%E6%81%A2%E5%BE%A9%E8%A4%87%E8%A3%BD%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/537213/Uta-Net%20%E6%81%A2%E5%BE%A9%E8%A4%87%E8%A3%BD%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
  document.body.oncopy = null;
  document.body.oncut = null;
  document.body.oncontextmenu = null;
  document.body.onselectstart = null;
  document.body.onmousedown = null;
  document.body.onmouseup = null;
  document.body.onkeydown = null;
  document.body.onkeypress = null;
  document.body.onkeyup = null;

  var elem = document.querySelector('.moviesong');
  if (elem) {
    elem.style.userSelect = 'text';
    elem.style.webkitUserSelect = 'text';
    elem.style.msUserSelect = 'text';
    elem.style.pointerEvents = 'auto';
    elem.replaceWith(elem.cloneNode(true));
  }

  // 移除所有帶 user-select: none 的元素限制
  Array.from(document.querySelectorAll('*')).forEach(e=>{
    e.style.userSelect='text';
    e.style.webkitUserSelect='text';
    e.style.msUserSelect='text';
  });

})();