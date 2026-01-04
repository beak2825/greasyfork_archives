// ==UserScript==
// @name         Force X/Twitter to xcancel.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects x.com and twitter.com to xcancel.com (preserves path, query, and hash). Skips OAuth to avoid breaking auth flows.
// @author       you
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545699/Force%20XTwitter%20to%20xcancelcom.user.js
// @updateURL https://update.greasyfork.org/scripts/545699/Force%20XTwitter%20to%20xcancelcom.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const host = window.location.host;
  const path = window.location.pathname || '/';
  const search = window.location.search || '';
  const hash = window.location.hash || '';
  const href = window.location.href;

  const isOnXOrTwitter = host === 'x.com' || host === 'twitter.com';
  const isOAuthUrl = () => {
    // Keep this conservative: do NOT redirect OAuth/authorize flows.
    // Common paths: /i/oauth2/authorize, /oauth, /oauth2
    const p = path.toLowerCase();
    return p.includes('/i/oauth2/authorize') || p === '/oauth' || p.startsWith('/oauth2');
  };

  const redirectToXCancel = () => {
    const newUrl = `https://xcancel.com${path}${search}${hash}`;
    if (newUrl !== href) {
      window.location.replace(newUrl);
    }
  };

  if (isOnXOrTwitter) {
    if (isOAuthUrl()) {
      // Do not modify OAuth flows to prevent breaking logins/app authorization.
      return;
    }
    redirectToXCancel();
  }
})();
