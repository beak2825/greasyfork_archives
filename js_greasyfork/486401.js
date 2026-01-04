// ==UserScript==
// @name         IMVU Products Catalog CSS
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  Add CSS to Products catalog (old imvu site) for more readability.
// @author       Evehne
// @license      MIT
// @match        https://*.imvu.com/shop/web_search.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imvu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486401/IMVU%20Products%20Catalog%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/486401/IMVU%20Products%20Catalog%20CSS.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var e = document.querySelector('body');
    e.innerHTML +=`<style>
      .not-purchasable {
        opacity: 0.7 !important;
      }
      .not-purchasable .content-wrapper,
      .not-purchasable .ft .buttons li.own{
        background: none !important;
        background-color: #db4747 !important;
      }
      .not-purchasable .ft .buttons li.own{
         border-bottom-left-radius: 6px;
         border-bottom-right-radius: 6px;
      }
      .not-purchasable .ft .buttons li.own span{
        left: auto !important;
        font-size: 7pt !important;
        color: black !important;
        padding-left: 12px !important;
      }
    </style>`;
})();