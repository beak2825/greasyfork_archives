// ==UserScript==
// @name        Hide header from google cache version of a site
// @namespace   Joshua Williams
// @version     1.1
// @author      Joshua Williams <joshuasrwilliams@gmail.com>
// @license MIT
// @description Hides the google cache header on sites.
// @match       *://webcache.googleusercontent.com*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491937/Hide%20header%20from%20google%20cache%20version%20of%20a%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/491937/Hide%20header%20from%20google%20cache%20version%20of%20a%20site.meta.js
// ==/UserScript==
 
(function() {
  document.querySelector('[class*=google-cache-hdr]').style.display = 'none'
})();