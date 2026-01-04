// ==UserScript==
// @name         取消网站变灰效果
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  取消网页变灰（黑白）效果
// @author       dioxide
// @match        https://*/*
// @exclude      https://message.bilibili.com/*
// @exclude      https://space.bilibili.com/*
// @exclude      https://*.douyin.com/*
// @exclude      https://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455694/%E5%8F%96%E6%B6%88%E7%BD%91%E7%AB%99%E5%8F%98%E7%81%B0%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455694/%E5%8F%96%E6%B6%88%E7%BD%91%E7%AB%99%E5%8F%98%E7%81%B0%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
       html.gray {
             -webkit-filter:grayscale(0) !important;
        }
        html{
             -webkit-filter: grayscale(0)!important;
             -moz-filter: grayscale(0)!important;
             -ms-filter: grayscale(0)!important;
             -o-filter: grayscale(0)!important;
              filter: grayscale(0)important!;
        }
        body{
            filter:grayscale(0)!important;
        }
        .tb-allpage-filter{
             -webkit-filter:grayscale(0) !important;
        }
        .itcauecng{
            -webkit-filter: grayscale(0)!important;
            filter: grayscale(0)!important;
        }
        html.gray-mode {
             filter: grayscale(0)!important;
            -webkit-filter: grayscale(0)!important;
         }
         element.style {
                filter: grayscale(0)!important;
           }
    `
    GM_addStyle(css)
})();