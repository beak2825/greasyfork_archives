// ==UserScript==
// @name         Force Warpcast to mark hasCompletedRegistration
// @namespace    http://tampermonkey.net/
// @version      2024-08-23
// @description  Forces Warpcast.com to work with FIDs that don't own a Warpcast account.
// @author       andrei0x309
// @match        https://warpcast.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506726/Force%20Warpcast%20to%20mark%20hasCompletedRegistration.user.js
// @updateURL https://update.greasyfork.org/scripts/506726/Force%20Warpcast%20to%20mark%20hasCompletedRegistration.meta.js
// ==/UserScript==


(function() {
  const originalFetch = window.fetch;
  function interceptFetch(originalFetch) {
    return async function (input, init) {
      const url = new URL(input);
      let response = await originalFetch(input, init);
      if(url.pathname.includes('v2/onboarding-state')) {
        const data = await response.json();
        data.result.state.hasCompletedRegistration = true;
        response = new Response(JSON.stringify(data), response);
      }
      return response;
    };
  }
  window.fetch = interceptFetch(originalFetch);
  console.info('Intercepting v2/onboarding-state')
})();
