// ==UserScript==
// @name         跨境买家中心弹框
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跨境买家中心弹框去除。
// @author       glk
// @include      https://csp.aliexpress.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487422/%E8%B7%A8%E5%A2%83%E4%B9%B0%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/487422/%E8%B7%A8%E5%A2%83%E4%B9%B0%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function () {
  setInterval(() => {
    const targetEls = document.getElementsByClassName("next-overlay-wrapper")
    if (targetEls) {
        Array.from(targetEls).forEach(i => i.parentNode.removeChild(i))
    }
    document.body.style.overflow = "revert"
  }, 1000)
})();
