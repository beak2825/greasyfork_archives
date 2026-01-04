// ==UserScript==
// @name         微信公众号网页宽屏显示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove PageNote elements
// @author       Alex
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/488140/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488140/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  var richMedia = document.querySelector('#page-content .rich_media_area_primary_inner');
  if (richMedia) {
    richMedia.classList.remove('rich_media_area_primary_inner');
  }
})();