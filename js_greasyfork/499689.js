// ==UserScript==
// @name           Direct Links - taodung.com
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      2
// @description   Change download links to direct links
// @author       JRem
// @include      https://taodung.com/*
// @include      https://nsw2u.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499689/Direct%20Links%20-%20taodungcom.user.js
// @updateURL https://update.greasyfork.org/scripts/499689/Direct%20Links%20-%20taodungcom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const links = document.querySelectorAll('a[href]');

  for (const link of links) {
    const url = new URL(link.href);

    // Check for both http://ouo.io/qs/ and https://ipamod.com/redirect-to/ patterns
    if ((url.origin === 'http://ouo.io' && url.pathname.startsWith('/qs/')) ||
        (url.origin === 'http://ouo.io' && url.pathname.startsWith('/st/')) ||
        (url.pathname.startsWith('/redirect-to/')) ||
        (url.origin === 'https://ipamod.com' && url.pathname.startsWith('/redirect-to/'))) {
      let encodedUrl;

      if ((url.origin === 'http://ouo.io') ||
         (url.pathname.startsWith('/redirect-to/')))
          {
        // Extract encoded URL from http://ouo.io/qs/ links
        const parts = url.href.split('?s=');
        encodedUrl = parts.length > 1 ? parts[1] : '';
      } else {
        // Extract encoded URL from https://ipamod.com/redirect-to/ links
        encodedUrl = url.searchParams.get('url');
      }

      let decodedUrl;

      try {
        decodedUrl = decodeURIComponent(encodedUrl);
      } catch (error) {
        console.error('Error decoding URL:', error);
        continue; // Skip to next link if decoding fails
      }

      link.href = decodedUrl;
    }
  }
})();