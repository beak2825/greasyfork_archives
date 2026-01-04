// ==UserScript==
// @name         Website Redirects
// @description  Redirect specified websites to designated locations while preserving paths and query parameters
// @version      0.0.1
// @author       0x96EA
// @namespace    https://github.com/0x96EA/userscripts/website-redirects
// @homepageURL https://github.com/0x96EA/userscripts
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547444/Website%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/547444/Website%20Redirects.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const logPrefix = '[Website Redirects]';
  const logger = {
    error: console.error.bind(console, logPrefix),
    log: console.log.bind(console, logPrefix),
    // NOTE: debug logging is opt in
    info: localStorage.getItem('userscript-addon-logging')
      ? console.info.bind(console, logPrefix)
      : () => {},
    warn: localStorage.getItem('userscript-addon-logging')
      ? console.warn.bind(console, logPrefix)
      : () => {},
  };

  logger.info('Starting...');

  // Define your redirects here
  const redirects = {
    // 'reddit.com': 'https://old.reddit.com',
    // Add more redirects as needed
  };

  // Get the current host and pathname
  const {
    host: currentHost,
    pathname: currentPath,
    search: currentSearch,
    href: currentUrl,
  } = window.location;

  logger.info(`Current host: ${currentHost}`);
  logger.info(`Current URL: ${currentUrl}`);

  // Function to check if current host matches any redirect pattern
  function findRedirectUrl(host) {
    // First try exact match
    if (redirects[host]) {
      return redirects[host];
    }

    // Then try matching without subdomain (e.g., www.reddit.com -> reddit.com)
    for (const redirectHost in redirects) {
      if (host.endsWith(`.${redirectHost}`) || host === redirectHost) {
        return redirects[redirectHost];
      }
    }

    return null;
  }

  // Check if the current host matches any redirect
  const redirectBaseUrl = findRedirectUrl(currentHost);

  if (redirectBaseUrl) {
    // Construct the new URL with the original path and query parameters
    const fullRedirectUrl = `${redirectBaseUrl}${currentPath}${currentSearch}`;

    // Prevent infinite redirects by checking if we're already on the target domain
    const redirectHostname = new URL(redirectBaseUrl).hostname;
    if (currentHost === redirectHostname) {
      logger.info(
        `Already on target domain ${redirectHostname}, skipping redirect`,
      );
      return;
    }

    logger.log(`Redirecting...\nFrom: ${currentUrl}\nTo: ${fullRedirectUrl}`);

    // Redirect to the new location
    window.location.replace(fullRedirectUrl);
  } else {
    logger.warn(`No redirect found for host: ${currentHost}`);
  }
})();
