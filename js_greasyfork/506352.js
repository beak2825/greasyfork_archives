// ==UserScript==
// @name         YouTube Autoplay Disable
// @version      1
// @description  Stop YouTube autoplay after video ending
// @author       https://github.com/cptwilson
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      WTFPL
// @namespace https://greasyfork.org/users/51812
// @downloadURL https://update.greasyfork.org/scripts/506352/YouTube%20Autoplay%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/506352/YouTube%20Autoplay%20Disable.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function clickCancelAutoplay() {
      document.querySelectorAll('button[aria-label="Cancel autoplay"]').forEach(element => {
          element.click();
      });
  }
  new MutationObserver(clickCancelAutoplay).observe(document.body, { childList: true, subtree: true, attributes: true});
})();

