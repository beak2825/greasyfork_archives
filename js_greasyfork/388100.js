// ==UserScript==
// @name         PTT reformat for Evernote
// @namespace    https://greasyfork.org/zh-TW/users/79288
// @version      1.8
// @description  原始的 PTT 網頁用 Evernote Web Clipper 擷取，圖片會跑版，此為替換原本的自動開圖區塊
// @author       jlhg
// @match        https://www.ptt.cc/bbs/*/*.html
// @match        https://www.ptt.cc/man/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388100/PTT%20reformat%20for%20Evernote.user.js
// @updateURL https://update.greasyfork.org/scripts/388100/PTT%20reformat%20for%20Evernote.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let imageStyle = "max-height:none;max-width:800px";

  ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG', '.gif', '.GIF'].forEach(function(ext) {
    let images = document.querySelectorAll('a[href$="' + ext + '"]');
    for (let i = 0; i < images.length; i++) {
      let imageUrl = images[i].href;
      images[i].innerHTML += '<br><img src="' + imageUrl + '" style="'+ imageStyle + '" referrerpolicy="no-referrer"><br>';
      images[i].style.boxShadow = 'none';
    }
  });

  let images = document.querySelectorAll('a[href^="https://imgur.com/"]');
  for (let i = 0; i < images.length; i++) {
    if (images[i].href.indexOf("https://imgur.com/a/") >= 0 || /\.(jpg|png)$/i.test(images[i].href)) {
      continue;
    }

    images[i].innerHTML += '<br><img src="' + images[i].href + '.jpg" style="' + imageStyle + '" referrerpolicy="no-referrer"><br>';
    images[i].style.boxShadow = 'none';
  }

  let richcontents = document.querySelectorAll('.richcontent');
  for (let i = 0; i < richcontents.length; i++) {
    richcontents[i].remove();
  }
})();
