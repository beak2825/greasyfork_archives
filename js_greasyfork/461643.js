// ==UserScript==
// @name        WNACG排版增强
// @namespace   Violentmonkey Scripts
// @match       https://www.wnacg.com/photos-view-id-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @grant       none
// @license MIT
// @version     0.51
// @author      Miroku
// @description 压缩bread高度，扩充图片高度
// @downloadURL https://update.greasyfork.org/scripts/461643/WNACG%E6%8E%92%E7%89%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461643/WNACG%E6%8E%92%E7%89%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


  console.log("loading script...")
  var imageElement = document.querySelector("#photo_body .photo");
  imageElement.style.maxHeight = "90vh";

  var bread = document.querySelector("#bread");
  bread.style.padding = "0";
  bread.style.margin = "0";
