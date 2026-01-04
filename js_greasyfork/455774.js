// ==UserScript==
// @name         新浪微博彩色版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  微博彩色页面
// @author       jianjia
// @license MIT
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455774/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%BD%A9%E8%89%B2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455774/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%BD%A9%E8%89%B2%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle(`
html,
.grayTheme {
        -webkit-filter: grayscale(0) !important;
        -moz-filter: grayscale(0) !important;
        -ms-filter: grayscale(0) !important;
        -o-filter: grayscale(0) !important;
        filter: grayscale(0) !important;
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=0);
      }
      html{
      filter: grayscale(0) !important;
      }

`)