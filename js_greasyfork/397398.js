// ==UserScript==
// @name        品葱网二逼水印移除 pincong.rocks
// @namespace   bluefountain@sina.com
// @include      *://pincong.rocks/*
// @version     1.1
// @grant       GM_addStyle
// @run-at      document-start
// @description 移除品葱网影响阅读的水印


GM_addStyle ( `
.aw-content-wrap {
background: none !important;
background-image: none !important;
background-color: #fff !important;
` );
// @downloadURL https://update.greasyfork.org/scripts/397398/%E5%93%81%E8%91%B1%E7%BD%91%E4%BA%8C%E9%80%BC%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4%20pincongrocks.user.js
// @updateURL https://update.greasyfork.org/scripts/397398/%E5%93%81%E8%91%B1%E7%BD%91%E4%BA%8C%E9%80%BC%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4%20pincongrocks.meta.js
// ==/UserScript==