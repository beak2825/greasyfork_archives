// ==UserScript==
// @name        Disable R34-Video Age Verification
// @namespace   https://greasyfork.org/en/users/1229931-aeos7
// @match       https://rule34video.com/*
// @grant       none
// @version     1.0.2
// @author      AEOS7
// @description Disables age verification pop-up on rule34video.com
// @downloadURL https://update.greasyfork.org/scripts/515486/Disable%20R34-Video%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/515486/Disable%20R34-Video%20Age%20Verification.meta.js
// ==/UserScript==

//!document.cookie.match('kt_rt_popAccess') ? (document.cookie = 'kt_rt_popAccess=1; path=/;', location.reload()) : null;
document.querySelector("input.button").click();