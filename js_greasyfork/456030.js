// ==UserScript==
// @name              『净网卫士』 腾讯天气
// @author            Hunlongyu
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       页面精简，去除广告，只保留主要功能的部分。
// @version           0.0.1
// @match             https://tianqi.qq.com/
// @grant             GM_addStyle
// @grant             GM_log
// @run-at            document-start
// @supportURL        https://gist.github.com/Hunlongyu/0a0475a7a838f096c21e8d1a867fa931
// @downloadURL https://update.greasyfork.org/scripts/456030/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20%E8%85%BE%E8%AE%AF%E5%A4%A9%E6%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/456030/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20%E8%85%BE%E8%AE%AF%E5%A4%A9%E6%B0%94.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let css = `
    #ct-pop-mobile{display:none !important;}
    #ct-footer{display:none !important;}
  `
  try {
    GM_addStyle(css)
  } catch (e) {
    GM_log(new Error('GM_addStyle stopped working！'))
  }
})()