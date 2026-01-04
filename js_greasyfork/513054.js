// ==UserScript==
// @name        华尔街见闻快讯去尾巴
// @namespace   Violentmonkey Scripts
// @match       https://wallstreetcn.com/live/*
// @version     1.0
// @author      LX
// @license     GPL
// @description 2024/10/16 18:18:18
// @downloadURL https://update.greasyfork.org/scripts/513054/%E5%8D%8E%E5%B0%94%E8%A1%97%E8%A7%81%E9%97%BB%E5%BF%AB%E8%AE%AF%E5%8E%BB%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/513054/%E5%8D%8E%E5%B0%94%E8%A1%97%E8%A7%81%E9%97%BB%E5%BF%AB%E8%AE%AF%E5%8E%BB%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

document.addEventListener('copy', function(e) {
  let sele = window.getSelection ? window.getSelection() : window.document.getSelection();
  let n = sele.focusNode;
  let txt = '';
  if (n.nodeType === Node.ELEMENT_NODE) {
    console.log(n.querySelector('div.live-item_more'));
    title = n.querySelector('div.live-item_title').textContent;
    base_txt = n.querySelector('div.live-item_html').textContent;
    more_txt = n.querySelector('div.live-item_more').textContent;
    if (more_txt) {
      more_txt_list = more_txt.split('\n');
      more_txt_clean = ''
      for (var k=0; k<more_txt_list.length; k++) {
        txt_clean = more_txt_list[k].trim();
        console.log(k, txt_clean, txt_clean.length);
        if (txt_clean.length > 0)  {
          more_txt_clean += '\n' + txt_clean;
        }
      }
    }
    txt = title.trim() + base_txt.trim() + more_txt_clean;
  } else {
    s = sele.getRangeAt(0);
    r = s.cloneRange();
    txt = s.toString() + r.toString();
  }
  // console.log(txt);
});