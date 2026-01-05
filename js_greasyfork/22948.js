// ==UserScript==
// @name        LinkedIn Redirect to Google Cache
// @description Redirects all pages under a domain+subdomains (currently LinkedIn) to Google Cache. Not really tested. Will break LinkedIn. Probably don't install.
// @namespace   jimbo1qaz
// @include     /^https?://(?:[a-zA-Z0-9\-]+\.)*linkedin\.com\//
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/22948/LinkedIn%20Redirect%20to%20Google%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/22948/LinkedIn%20Redirect%20to%20Google%20Cache.meta.js
// ==/UserScript==
// @run-at      document-start
// @run-at      document-end
// @run-at      document-idle

document.location = 'https://webcache.googleusercontent.com/search?q=cache:' + document.location;