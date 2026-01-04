// ==UserScript==
// @name         Disable Notifications API
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      GNU AGPLv3
// @description  Disable Notifications API where sites may show popup notifications message at bottom-right of the web browser. Any sites which require Notifications API may cause the web browser to ask user for a permission to display notifications. This script disables both the notifications and the permission prompt. It is intended for users who find them annoying.
// @author       jcunews
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/39518/Disable%20Notifications%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/39518/Disable%20Notifications%20API.meta.js
// ==/UserScript==

(function() {
  window.Notification = {
    get permission() {
      return "denied";
    },
    set permission(a) {
      return "denied";
    },
    requestPermission: function(fn) {
      if ("function" === typeof fn) {
        fn("denied");
        return;
      } else {
        return {
          then: function(fn) {
            fn("denied");
            return this;
          }
        };
      }
    }
  };
})();
