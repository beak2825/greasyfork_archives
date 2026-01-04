// ==UserScript==
// @name        DoujinStyle Auto Redirect to download
// @namespace   Violentmonkey Scripts
// @match       https://doujinstyle.com/?p=page&type=1&id=*
// @grant       none
// @version     1.1
// @author      moh
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=doujinstyle.com
// @description REQUIRES https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/ or similar addon that modifies CORS headers to work!
// @downloadURL https://update.greasyfork.org/scripts/532473/DoujinStyle%20Auto%20Redirect%20to%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/532473/DoujinStyle%20Auto%20Redirect%20to%20download.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const form = document.querySelector('mainbar form');
  const result = await fetch(form.action, {
      "headers": {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      "body": (new URLSearchParams(new FormData(form))) + '&download_link=',
      "method": "POST",
    "redirect": "follow"
  });
  window.location = result.url;

})();
