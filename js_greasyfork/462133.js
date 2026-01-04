// ==UserScript==
// @name                PikPak Region Check Bypass
// @name:zh-CN          绕过PikPak区域限制
// @namespace           https://greasyfork.org/scripts/462133-pikpak-region-check-bypass
// @version             1.0
// @description         Bypass PikPak's Region Check in China
// @description:zh-CN   绕过PikPak中国区域限制
// @author              GForkMe
// @license GPL-3.0-or-later
// @match               *://*.mypikpak.net/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/462133/PikPak%20Region%20Check%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/462133/PikPak%20Region%20Check%20Bypass.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * @param {string} cookie String of form "<key>=<value>"
   * @param {array} cookies
   * @returns {boolean}
   */
  function hasCookie(cookie, cookies) {
    for (let c of cookies) {
      if (c.includes(cookie)) {
        return true;
      }
    }
    return false;
  }
  try {
    let cookie = "pp_access_to_visit=true";
    if (hasCookie(cookie, document.cookie.split(";"))) {
      console.log("Cookie has been set.");
    } else {
      document.cookie = cookie + ";path=/";
      if (hasCookie(cookie, document.cookie.split(";"))) {
        console.log("Cookie set succeeded");
      } else {
        throw new Error("Cookie set failed");
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
