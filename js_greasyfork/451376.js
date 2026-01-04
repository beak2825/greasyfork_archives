// ==UserScript==
// @name         BAND 图片保存
// @namespace    https://me.penclub.club
// @version      0.1.4
// @description  让 Band 可以右键保存和复制图片
// @author       lixiang810
// @match        https://band.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=band.us
// @grant        none
// @license      AGPL-3.0-or-later
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/451376/BAND%20%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451376/BAND%20%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styl = document.createElement('style');
    styl.innerHTML = `.cComment .commentBody .photo::after {
  display: none;
}
.uCollage .collageImage::after {
  display: none;
}
.lyPhotoViewer .photoViewer .photoContent .preventSaveContent {
  display: none;
}
.lyPhotoViewer .photoViewer .photoContent .btnArea {
  position: static;
}
.photoItemLink::after {
  display: none;
}
`;
    document.body.appendChild(styl);
})();