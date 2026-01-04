// ==UserScript==
// @name        微信公众号文章阅读页面优化
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/s*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/10/18 08:51:46
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513006/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513006/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 等待网页完成加载
window.addEventListener('load', function () {
    // 加载完成后执行的代码
    setTimeout(() => {
        document.querySelector('#js_pc_qr_code').setAttribute("style", "display: none !important;")
    }, 1000)
    document.querySelector('.rich_media_area_primary_inner').setAttribute('style', "max-width: 61%;")
}, false);
