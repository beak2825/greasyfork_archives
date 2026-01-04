// ==UserScript==
// @name         Terabox Premium Unlocker
// @namespace    terabox.lovedolove
// @version      1.0.3
// @description  Enables all VIP (Premium) features on Terabox by simulating an active premium membership.
// @match        https://dm.terabox.com/*
// @require      https://update.greasyfork.org/scripts/455943/1270016/ajaxHooker.js
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/vtcn761um75q267xs2zgfsa9wlig
// @homepage     https://greasyfork.org/en/scripts/543870-terabox-premium-unlocker
// @supportURL   https://greasyfork.org/en/scripts/543870-terabox-premium-unlocker/feedback
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543870/Terabox%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/543870/Terabox%20Premium%20Unlocker.meta.js
// ==/UserScript==
/* global ajaxHooker*/
(function () {
  "use strict";

  // Hooking AJAX request to unlock premium
  ajaxHooker.hook((request) => {
    if (request.url.includes("/membership/proxy/user")) {
      request.response = (res) => {
        const json = JSON.parse(res.responseText);
        if (json.error_code === 0 && json.data) {
          let a = json.data.member_info;

          // Unlock VIP features
          a.is_vip = 1;
          a.vip_left_time = 9999999999; // Long duration for VIP
          a.vip_end_time = 9999999999; // Far future expiry
          a.vip_end_time_without_grace = 9999999999;
          a.can_cancel_renew = 1;
          a.is_auto_renew = 1;
          a.raw_price = 0;
          a.renew_price = 0;
          a.renew_time = 9999999999;
          a.show_grace_tips = 0;

          // Ensure support for VIP in country info
          json.data.cur_country.support_vip = 1;
          json.data.reg_country.support_vip = 1;

          // Modify reminder to avoid expiry warnings
          json.data.reminder.vip_expire_time = 9999999999;

          res.responseText = JSON.stringify(json);
        }
      };
    }
  });
})();
