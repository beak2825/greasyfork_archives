// ==UserScript==
// @name         Remove Ads Slots in YouTube Main Page
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @license      MIT
// @author       CY Fung
// @match        https://www.youtube.com/*
// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/cyfung1031/userscript-supports@8fac46500c5a916e6ed21149f6c25f8d1c56a6a3/library/ytZara.js
// @description  to remove ads slots in YouTube main page
// @downloadURL https://update.greasyfork.org/scripts/469376/Remove%20Ads%20Slots%20in%20YouTube%20Main%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/469376/Remove%20Ads%20Slots%20in%20YouTube%20Main%20Page.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const wm = new WeakSet();

  const removeAdsSlot = async (grid) => {
    const td = grid.data;
    if (td && !wm.has(td)) {
      const md = Object.assign({}, td);
      md.contents = md.contents.filter(content => {
        let isadSlotRenderer = ((((content || 0).richItemRenderer || 0).content || 0).adSlotRenderer || null) !== null;
        return isadSlotRenderer ? false : true;
      });
      wm.add(md);
      grid.data = md;
    }
  };

  ytZara.ytProtoAsync("ytd-rich-grid-renderer").then((proto) => {
    proto.dataChanged = ((dataChanged) => {
      return function () {
        removeAdsSlot(this);
        return dataChanged.apply(this, arguments);
      }
    })(proto.dataChanged);
  });

})();