// ==UserScript==
// @name         Trianglify Free Download
// @namespace    https://www.zerodream.net/
// @version      0.1
// @description  Trianglify 免费下载脚本，下载高清图片无需付费
// @author       Akkariin
// @match        https://trianglify.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390834/Trianglify%20Free%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/390834/Trianglify%20Free%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("Preview_actions__36lSK")[0].innerHTML = `<button class="Preview_ActionButton__AOO_a" onclick="var width = document.querySelectorAll('.Sidebar_row__1k8qe input')[0].value;var height = document.querySelectorAll('.Sidebar_row__1k8qe input')[1].value;var range1 = document.querySelectorAll('input[type=\\'range\\']')[0].value;var range2 = document.querySelectorAll('input[type=\\'range\\']')[1].value;var oA = document.createElement('a');oA.download = 'Pixel-' + range1 + '-' + range2 + '-' + width + 'x' + height + '.png';oA.href = document.querySelector('canvas').toDataURL('image/png');document.body.appendChild(oA);oA.click();oA.remove();"><svg viewBox="0 0 512 512" class="icons_icon__37Bm-"><path d="M288 144v16h112v272H112V160h112v-16H96v304h320V144z"></path><path d="M193.1 252.3l-11.6 11.6 74.5 74.5 74.5-74.5-11.6-11.6-54.7 54.7V64h-16.4v243z"></path></svg> Download</button>`;
})();
