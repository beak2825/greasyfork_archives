// ==UserScript==
// @name         九色去广告
// @name:zh      九色去广告
// @namespace    ovnrain.jiuseRemoveAd
// @version      1.0.8
// @description  jiuse610 去广告
// @icon         https://jiuse610.com/favicon.ico
// @author       ovnrain <ovnrain@gmail.com>
// @match        https://jiuse610.com/*
// @match        https://*.jiuse970.com/*
// @match        https://*.jiuse980.com/*
// @match        https://*.jiuse990.com/*
// @match        https://*.91porny.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445526/%E4%B9%9D%E8%89%B2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445526/%E4%B9%9D%E8%89%B2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
     .mobile-adv {
       display: none;
     }
   `);

  var pathname = location.pathname;

  if (pathname === '/') {
    GM_addStyle(`
      #main > .jsv:nth-child(1),
      #main > .container-fluid:nth-child(2),
      #main > .container-fluid:nth-child(3) {
        display: none !important;
      }
    `);
    return;
  }

  if (
    /^\/video\/category/.test(pathname) ||
    /^\/videos?$/.test(pathname) ||
    /^\/search/.test(pathname) ||
    /^\/author\//.test(pathname)
  ) {
    GM_addStyle(`
      #main > .container-fluid:nth-child(1),
      #main > .container-fluid:nth-child(3),
      #main > .jsv:nth-child(2),
      #main > .jsv:nth-child(4) {
        display: none;
      }
    `);
    return;
  }

  if (/^\/videos?\//.test(pathname)) {
    GM_addStyle(`
      #main > .container-fluid,
      #main > .jsv,
      .jsv-pr,
      #videoShowPage .left .adv-layer {
        display: none;
      }
    `);
    return;
  }
})();
