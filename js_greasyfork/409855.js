// ==UserScript==
// @author            Hunlongyu
// @name              『净网卫士』 apowersoft 图片压缩
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       对 apowersoft 图片批量压缩网站，进行精简。
// @version           0.0.1
// @include           *://*.apowersoft.cn/compress-image-online
// @grant             GM_addStyle
// @grant             GM_log
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/409855/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20apowersoft%20%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/409855/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20apowersoft%20%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let css = `
    .header, .subheader{display: none !important;}
    #app{padding-top: 0;}
    .main{min-height: 100% !important;}
    .main-write > h2, .main-write > .describe, .main-write > .rating{display: none !important;}
    .btn-group{display: none !important;}
    .onecont{display: none !important;}
    .content-box{display: none !important;}
    .footer{display: none !important;}
  `
  try {
    GM_addStyle(css)
  } catch (e) {
    GM_log(new Error('GM_addStyle stopped working！'))
  }
})()