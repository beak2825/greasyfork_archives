// ==UserScript==
// @author            Hunlongyu
// @name              『净网卫士』 Tiny图片压缩
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       对 tinypng 和 tinyjpg 图片批量压缩网站，进行精简。
// @version           0.1.1
// @include           *://tinyjpg.com/*
// @include           *://tinypng.com/*
// @grant             GM_addStyle
// @grant             GM_log
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/33384/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20Tiny%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/33384/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20Tiny%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let css = `
    #top>nav{display: none;}
    .highlight{display: none;}
    .customerlogos{display: none;}
    footer{display: none;}
    .gopro{display: none;}
    #top{height: 100vh;}
    .upload{height: 100%;}
    #dropbox{display: none;}
    .share{display: none;}
  `
  try {
    GM_addStyle(css)
  } catch (e) {
    GM_log(new Error('GM_addStyle stopped working！'))
  }
})()
