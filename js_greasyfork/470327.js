// ==UserScript==
// @name         YouTube: Remove all ads!
// @description  Removes all ads on YouTube, including unskippable ones.
// @name:ar      YouTube: إزالة جميع الإعلانات.
// @description:ar يزيل جميع الإعلانات على YouTube ، بما في ذلك الإعلانات غير القابلة للتخطي.
// @name:fr      YouTube: supprimez toutes les annonces.
// @description:fr Supprimez toutes les publicités sur YouTube, y compris celles qui ne peuvent pas être ignorées.
// @version      1.0
// @author       Midnight
// @namespace    https://google.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/470327/YouTube%3A%20Remove%20all%20ads%21.user.js
// @updateURL https://update.greasyfork.org/scripts/470327/YouTube%3A%20Remove%20all%20ads%21.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const log = console.log;

  const removeAd = () => {
    const adContainer = document.querySelector(".ytd-ad-container");
    if (adContainer) {
      adContainer.remove();
    }
  };

  window.addEventListener("DOMContentLoaded", removeAd);
})();
