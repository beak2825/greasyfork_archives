// ==UserScript==
// @name         百度翻译去广告
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @icon         https://fanyi.baidu.com/favicon.ico
// @description  移除百度翻译中的广告
// @author       WingKing
// @homepageURL  https://github.com/
// @match        *://*.baidu.com/*
// @grant        none
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_listValues
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433207/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433207/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// const dom = {};
// dom.query = jQuery.noConflict(true);
// dom.query(document).ready(function ($) {
//     'use strict';
    
//     // 百度翻译
//     if (location.href.indexOf('fanyi.baidu.com') > 0) {
//         $("#sideAdContainer").remove();
//         $(".spread-wrap").remove();
//         $("#sideBannerContainer").remove();
//         $('.manual-trans-btn').remove();
//         $('.products-list').remove();
//         $('.simultaneous-interpretation').remove();
//         $('.trans-machine').remove();
//         $('.manual-trans-info').remove();
//         $('.download-guide').remove();
//         $('.extra-wrap').remove();
//         $('.footer').remove();
//         $("#app-read").remove();
//     }

// });

/*
请把下面的JSON添加到数据中
{
  " .products-list": {},
  "#app-read": {},
  "#sideAdContainer": {},
  "#sideBannerContainer": {},
  ".app-side-link": {},
  ".download-guide": {},
  ".extra-wrap": {},
  ".footer": {},
  ".manual-trans-btn": {},
  ".manual-trans-info": {},
  ".simultaneous-interpretation": {},
  ".spread-wrap": {},
  ".trans-machine": {}
}
*/

;(function () {
  $ = jQuery.noConflict(true)

  const keys = GM_listValues()
  const hideElements = []
  const elements = []

  keys.forEach(key => {
    const properties = GM_getValue(key)

    if (properties && Object.keys(properties).length > 0) {
      const temp = []
      for (const iterator in properties) {
        temp.push(`${iterator}:${properties[iterator]}!important`)
      }

      elements.push(`${key}{${temp.join(';')}}`)
    } else {
      hideElements.push(key)
    }
  })

  const css =
    hideElements.join(',') + `{display:none !important;}` + elements.join('')

  loadStyle(css)
  
  function loadStyle(css) {
    var style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    style.appendChild(document.createTextNode(css))
    var head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
  }
})()

