// ==UserScript==
// @name         Digikala Loader Fix
// @namespace    *digikala.com/*
// @version      0.2
// @description  Fixes loading bug on Digikala.com
// @author       Alireza Ahmadi
// @include        *digikala.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428299/Digikala%20Loader%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/428299/Digikala%20Loader%20Fix.meta.js
// ==/UserScript==
function withRetry(job, maxDuration) {
  function retry(retryCount) {
    const delay = 2 ** retryCount
    if (delay > maxDuration) {
      return;
    }
    setTimeout(() => {
      job(retry.bind(null, retryCount + 1));
    }, delay);
  }

  job(retry.bind(null, 0));
}

(function () {
  "use strict";

  Framework.hideLoader = function () {
    setTimeout(function () {
      if ($('[data-remodal-id="loader"]').length) {
        withRetry((retry) => {
          const modal = $('[data-remodal-id="loader"]').remodal();
          if (modal.getState() === "opening") {
            retry();
          } else {
            modal.close();
          }
        }, 2500);
      }
    }, 500);
  };
})();
