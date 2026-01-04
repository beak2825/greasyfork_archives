// ==UserScript==
// @name         Yahoo.com news - redirect to original site
// @namespace    http://tampermonkey.net/
// @version      2025-03-20
// @description  Automatically redirect Yahoo news pages to the original source site.
// @author       Jamie Landeg-Jones
// @match        https://*.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530315/Yahoocom%20news%20-%20redirect%20to%20original%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/530315/Yahoocom%20news%20-%20redirect%20to%20original%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirect_to_article()
      {
        let link_tags = document.getElementsByTagName ('link');

        for (let loop=0; loop < link_tags.length; loop++)
          {
            if (link_tags[loop].rel && link_tags[loop].rel == 'canonical')
              {
                const new_url = link_tags[loop].href;

                if (new_url.match ("^https://(.*\.)?yahoo.com/"))
                  console.info ('Yahoo Redirect: Ignoring redirect (same site): ' + new_url);
                 else
                  {
                    console.info ('Yahoo Redirect: Redirecting to ' + new_url);
                    window.location = new_url
                  }
              }
          }
        }

     // Run the filter when the page loads
    window.addEventListener ('load', redirect_to_article);
})();
