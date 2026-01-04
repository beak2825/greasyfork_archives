// ==UserScript==
// @name         126AdsClean
// @version      0.12
// @description  clean mail.yeah
// @match        *://*.126.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1354338
// @downloadURL https://update.greasyfork.org/scripts/504413/126AdsClean.user.js
// @updateURL https://update.greasyfork.org/scripts/504413/126AdsClean.meta.js
// ==/UserScript==

function removeAds() {
  const selectors = [
    ".gWel-bottom",
    ".nui-closeable",
    ".gWel-warning",
    ".mail_collaboration_receive .dvmailrecompanel",
    ".mail_collaboration_receive .dvAssistantPanel"
  ];

  document.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());

  document.querySelectorAll("[id$='dvmailrecompanel'], [id$='dvAssistantPanel']").forEach((el) => el.remove());
}

(function () {
  setInterval(removeAds, 200);
})();
