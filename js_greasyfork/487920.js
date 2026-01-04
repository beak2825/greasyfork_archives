// ==UserScript==
// @name         NoSankuaiWatermark
// @version      2024-02-21 12:01
// @description  Remove the watermark in *.sankuai.com
// @author       sankuai
// @match        https://*.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1264748
// @downloadURL https://update.greasyfork.org/scripts/487920/NoSankuaiWatermark.user.js
// @updateURL https://update.greasyfork.org/scripts/487920/NoSankuaiWatermark.meta.js
// ==/UserScript==
(function() {
   'use strict';
   GM_addStyle(`
     #brant-watermark-visible, .home-page__md, body, .with-wm, .popover_content {
       background-image: none!important;
     }
   `);
})();