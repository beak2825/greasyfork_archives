// ==UserScript==
// @name        FreeJump
// @namespace   xanderwang.site
// @include      *://*
// @grant       none
// @version     1.0
// @author      xanderwang
// @license MIT
// @description 2024/3/23 12:14:00
// @downloadURL https://update.greasyfork.org/scripts/490621/FreeJump.user.js
// @updateURL https://update.greasyfork.org/scripts/490621/FreeJump.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function openNewTab(linkUrl) {
    // alert(`open: ${linkUrl}`)
    // 使用window.open打开新的标签页
    window.open(linkUrl, '_blank');
    // 阻止默认的链接跳转行为（如果需要）
    return false;
  }
  let aTags = document.getElementsByTagName('a')
  for (let index = 0; index < aTags.length; index++) {
    let linkUrl = aTags[index].href
    const parts = linkUrl.split('=http');
    if (parts.length > 1) {
      console.log(`find: ${linkUrl}`)
      let site = decodeURIComponent(parts[1].split(' ')[0])
      linkUrl = `http${site}`;
      console.log(`final:${linkUrl}`)
      aTags[index].onclick = openNewTab(linkUrl);
    }
    aTags[index].href = linkUrl
  }

})(); //(function(){})() 表示该函数立即执行