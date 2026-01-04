// ==UserScript==
// @author            Hunlongyu
// @name              『净网卫士』 Docsmall 图片压缩
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       对 docsmall 图片批量压缩网站，进行精简。
// @version           0.0.1
// @include           *://docsmall.com/image-compress
// @grant             GM_addStyle
// @grant             GM_log
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/408945/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20Docsmall%20%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/408945/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20Docsmall%20%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let css = `
    #app-main{background: linear-gradient(225deg,#80a0c4,#386fb4);}
    #header, #footer{display: none;}
    .show-google-ads-feed{display: none;}
    .section.description{display: none;}
    .page-image-compress .section-articles{display: none;}
    .page-image-compress .section-description{display: none;}
    .section-main.image-compress{background: none}
  `
  try {
    GM_addStyle(css)
  } catch (e) {
    GM_log(new Error('GM_addStyle stopped working！'))
  }
})()