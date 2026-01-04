// ==UserScript==
// @name         小鹅通视频变宽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让视频更容易观看
// @author       You
// @match        https://*.h5.xiaoeknow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoeknow.com
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443572/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%A7%86%E9%A2%91%E5%8F%98%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443572/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%A7%86%E9%A2%91%E5%8F%98%E5%AE%BD.meta.js
// ==/UserScript==

const setFn = () => {
  setTimeout(() => {
    if($('.video_out_wrapper').css('position')) {
      $('.video_out_wrapper').css({'transform': 'scale(3.2)', 'transform-origin': 'top', 'z-index': '999'})
    } else {
      setFn()
    }
  }, 100)
}
;(function () {
  'use strict'
  $(document).ready(() => {
    setFn()
  })
})()