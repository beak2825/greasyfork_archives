// ==UserScript==
// @name         GBF_隐藏掉没有终突的召唤石
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  隐藏没有突破的召唤石
// @author       Moo_asdsasd5
// @license MIT
// @match        http://game.granbluefantasy.jp/
// @icon         https://www.google.com/s2/favicons?domain=game.granbluefantasy.jp
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
/* globals $ */
// @downloadURL https://update.greasyfork.org/scripts/432327/GBF_%E9%9A%90%E8%97%8F%E6%8E%89%E6%B2%A1%E6%9C%89%E7%BB%88%E7%AA%81%E7%9A%84%E5%8F%AC%E5%94%A4%E7%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/432327/GBF_%E9%9A%90%E8%97%8F%E6%8E%89%E6%B2%A1%E6%9C%89%E7%BB%88%E7%AA%81%E7%9A%84%E5%8F%AC%E5%94%A4%E7%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(
    `
         .btn-supporter[data-supporter-evolution="3"], .btn-supporter[data-supporter-evolution="4"], .btn-supporter[data-supporter-max="0"] {
              display:none!important
         }
    `
    )

    setInterval(function(){
      //黄龙
      $('.btn-supporter[data-supporter-evolution="3"]').has('[data-image="2040157000"]').attr( "style", "display: block !important;" )
      //麒麟
      $('.btn-supporter[data-supporter-evolution="3"]').has('[data-image="2040158000"]').attr( "style", "display: block !important;" )
      //兔子
      $('.btn-supporter[data-supporter-evolution="4"]').has('[data-image="2040114000"]').attr( "style", "display: block !important;" )

    }, 500)
    // Your code here...
})();