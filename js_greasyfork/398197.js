// ==UserScript==
// @name         堆糖下载原图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wlor
// @match        https://www.duitang.com/album/?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398197/%E5%A0%86%E7%B3%96%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/398197/%E5%A0%86%E7%B3%96%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function append_download_btn() {
  let picList = $('.woo-pcont .woo');
  for (let i = 0; i < picList.length; i++) {
    let no_btn = picList.eq(i).find(".download_btn").length === 0;
    if (no_btn) {
      let original_url = picList.eq(i).find('.mbpho>.a>img').attr('src').replace(/\.thumb\.400_0/, "");
      let button = document.createElement("a");
      button.className = "download_btn";
      button.innerText = "下载原图";
      button.style.position = "absolute";
      button.style.right = "0";
      button.style.top = "0";
      button.style.zIndex = "9";
      button.style.backgroundColor = "rgba(0,0,0,.5)";
      button.style.color = "#fff";
      button.style.padding = "0 10px";
      button.style.height = "30px";
      button.style.lineHeight = "30px";
      button.style.cursor = "pointer";
      button.href = original_url;
      button.target="_blank"
      picList.eq(i).append(button);
    }
  }
};

function debounce(fn, wait) {
  var timeout = null;
  return function () {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  }
}

window.addEventListener('scroll', debounce(append_download_btn, 500));

append_download_btn()


    // Your code here...
})();