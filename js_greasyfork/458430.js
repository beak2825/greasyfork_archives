// ==UserScript==
// @name        Open raw pdf file
// @namespace   Violentmonkey Scripts
// @match       https://*knowunity.de/*
// @grant       none
// @version     1.0
// @author      jside
// @description Click on show content (Inhalt ansehen) and wait for new tab to open
// @downloadURL https://update.greasyfork.org/scripts/458430/Open%20raw%20pdf%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/458430/Open%20raw%20pdf%20file.meta.js
// ==/UserScript==


const { fetch: originalFetch } = window;

window.fetch = async (...args) => { // hook all fetch requests
    let [resource, config ] = args;

    if (resource.endsWith('.pdf')){ // intercept all requests that get a pdf file
      console.log('[UserScript] ' + resource)
      // create new tab with raw pdf
      window.open(resource, '_blank'); // open in new tab
    }

    const response = await originalFetch(resource, config);
    // response interceptor here
    return response;
};
