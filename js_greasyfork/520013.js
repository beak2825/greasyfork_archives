// ==UserScript==
// @name         无名小站去广告
// @namespace    GYING AD BLOCK
// @version      2024-12-07 -8
// @description  NO AD IN GYING
// @author       You
// @license      AGPL-3.0
// @match        https://www.gying.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520013/%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/520013/%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  setTimeout(() => {
    const HMhrefleft = document.querySelector("#HMhrefleft");
    const HMhrefright = document.querySelector("#HMhrefright");
    if (!HMhrefleft || !HMhrefright) return;
    HMhrefleft.parentNode.parentNode.removeChild(HMhrefleft.parentNode);
    HMhrefright.parentNode.parentNode.removeChild(HMhrefright.parentNode);
  }, 200);
})();
