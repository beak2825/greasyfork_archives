// ==UserScript==
// @name         小鹅通PC页面优化
// @namespace    http://tampermonkey.net/
// @description   小鹅通 pc 页面优化
// @author        zhuxin
// @license       MIT
// @description  try to take over the world!
// @author       You
// @match        https://appuwwsm6cl6690.h5.xiaoeknow.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @version 0.0.1.20220618155014
// @downloadURL https://update.greasyfork.org/scripts/446662/%E5%B0%8F%E9%B9%85%E9%80%9APC%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446662/%E5%B0%8F%E9%B9%85%E9%80%9APC%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

;(function () {
  // Your code here...
  const css = `
      .page-layout{
          position: absolute;
      }
      .safe-area-inset-bottom{
          position: absolute !important;
      }
      .distribute , .btn-menu {
          right: 20px !important;
      }
      .video_out_wrapper , .video-player-wrapper{
          height: 0 !important;
      }
      .video_wrapper{
          position: fixed !important;
          width: 62% !important;
          height: 800px !important;
          right: 150px !important;
          top: 200px !important;
      }
    `
  const style = document.createElement("style")
  style.innerHTML = css
  document.head.appendChild(style)
})()
