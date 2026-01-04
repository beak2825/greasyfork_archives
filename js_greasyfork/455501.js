// ==UserScript==
// @name        为蜜柑计划 Mikan 在“复制磁链”右侧添加“打开磁链”按钮
// @namespace   Dreace
// @match       http*://mikanani.me/*
// @grant       none
// @license     MIT
// @version     1.2
// @author      -
// @description 使用外部应用打开磁力链接
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2

// @downloadURL https://update.greasyfork.org/scripts/455501/%E4%B8%BA%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20Mikan%20%E5%9C%A8%E2%80%9C%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%E2%80%9D%E5%8F%B3%E4%BE%A7%E6%B7%BB%E5%8A%A0%E2%80%9C%E6%89%93%E5%BC%80%E7%A3%81%E9%93%BE%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455501/%E4%B8%BA%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20Mikan%20%E5%9C%A8%E2%80%9C%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%E2%80%9D%E5%8F%B3%E4%BE%A7%E6%B7%BB%E5%8A%A0%E2%80%9C%E6%89%93%E5%BC%80%E7%A3%81%E9%93%BE%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

let hack = () => {
  for(let a of document.querySelectorAll('.magnet-link')){
    if(a.classList.contains("processed")) {
      continue;
    }
    a.classList.add("processed");
    b = a.cloneNode();
    b.href = b.dataset.clipboardText;
    delete b.dataset.clipboardText;
    b.text="[打开磁链]";
    a.parentElement.insertBefore(b, a.nextSibling);
  }
  VM.observe(document.body, hack);
  return true;
};

hack();
