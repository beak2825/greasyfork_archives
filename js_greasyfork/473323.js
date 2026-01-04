// ==UserScript==
// @name        Webproxy redirect to proxysite
// @namespace   webproxy_redirect
// @description Skips the home page and goes straight to the login page
// @include     https://webproxy.to/
// @version     0.1
// @grant       none
// @license     WTFPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/473323/Webproxy%20redirect%20to%20proxysite.user.js
// @updateURL https://update.greasyfork.org/scripts/473323/Webproxy%20redirect%20to%20proxysite.meta.js
// ==/UserScript==


document.location = 'https://www.proxysite.com/';
