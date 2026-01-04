// ==UserScript==
// @name         Story faucet humanity bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       rikaray
// @description  humanity bypass 
// @icon         https://faucet.story.foundation/favicon.png
// @match        https://faucet.story.foundation/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507968/Story%20faucet%20humanity%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/507968/Story%20faucet%20humanity%20bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    if (args[1]?.headers?.Accept === 'text/x-component') {
      return originalFetch.apply(this, args).then((response) => {
        const clonedResponse = response.clone();

        return clonedResponse.text().then((text) => {
          const modifiedText = text.replace(
            /1:\{"data":"[\d.]+","result":true\}/,
            '1:{"data":"25","result":true}',
          );

          return new Response(modifiedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        });
      });
    }

    return originalFetch.apply(this, args);
  };
})();

