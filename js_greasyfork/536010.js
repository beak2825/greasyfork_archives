// ==UserScript==
// @name        Songsterr Premium - songsterr.com
// @namespace   https://github.com/Thibb1
// @match       https://songsterr.com/*
// @match       https://www.songsterr.com/*
// @grant       none
// @run-at      document-start
// @version     1.3.1
// @author      Thibb1
// @description Unlock all premium features on Songsterr
// @license     GPL
// @website     https://greasyfork.org/it/scripts/469079-songsterr-premium-songsterr-com
// @downloadURL https://update.greasyfork.org/scripts/536010/Songsterr%20Premium%20-%20songsterrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/536010/Songsterr%20Premium%20-%20songsterrcom.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const _fetch = window.fetch;
  const newFetch = async function (input, init) {
    const response = await _fetch(input, init);
    if (response.headers.get('content-type')?.includes('application/json') && response.url == "https://www.songsterr.com/auth/profile") {
      Object.defineProperty(response, 'json', {
        value: async () => {
          const d = await response.clone().json();
          d.plan = "plus";
          return d;
        },
      });
    }
    return response;
  };
  try {
    window.fetch = newFetch;
  } catch {
    fetch = newFetch;
  }
  window.addEventListener("DOMContentLoaded", (event) => {
    const a = document.body.querySelector('#state');
    a.textContent = a.textContent.replace('hasPlus":false', 'hasPlus":true');
    a.textContent = a.textContent.replace('"plan":"free"', '"plan":"plus"');
  });
  window.addEventListener('load', () => {
    const b = document.querySelector('#showroom') ?? document.querySelector('#showroom_header');
    b?.removeAttribute('id');
    b?.removeAttribute('class');
  });
})();