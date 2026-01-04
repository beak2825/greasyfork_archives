// ==UserScript==
// @name        Gmail Redirect
// @namespace   https://xpuls3.github.io/
// @include     /^https?:\/\/(?:www\.)?google\.com\/search\?.*&q=gma?i?l?(?:&.+)?$/
// @grant none
// @run-at      document-start
// @version     1.0
// @author      Puls3
// @description Redirects to Gmail!
// @downloadURL https://update.greasyfork.org/scripts/404039/Gmail%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/404039/Gmail%20Redirect.meta.js
// ==/UserScript==

window.location = "https://mail.google.com/mail/u/0/";