// ==UserScript==
// @name        radio.garden: bypass region restrictions (e.g. UK)
// @namespace   assuka.radio.garden
// @match       https://*.radio.garden/*
// @grant       none
// @version     1.0
// @author      Assuka
// @license MIT
// @description Intercepts and changes the geo request (they clearly wanted this to be possible) allowing for spoofing of country.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/533145/radiogarden%3A%20bypass%20region%20restrictions%20%28eg%20UK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533145/radiogarden%3A%20bypass%20region%20restrictions%20%28eg%20UK%29.meta.js
// ==/UserScript==

window.fetch = new Proxy(window.fetch, {
  apply: (target, that, args) => {
    const originalFetchPromise = target.apply(that, args);

    const modifiedPromise = originalFetchPromise.then(async (res) => {
      if (/api\/geo/.test(res.url)) {
        const clonedRes = res.clone();
        const data = await clonedRes.json();

        data.country_code = 'US';
        data.region_code = 'CA'; // California
        data.city = 'Los Angeles';

        const headers = new Headers(res.headers);
        headers.delete('Content-Length');

        return new Response(JSON.stringify(data), {
          status: res.status,
          statusText: res.statusText,
          headers: headers
        });
      }

      return res;
    });

    return modifiedPromise;
  }
});