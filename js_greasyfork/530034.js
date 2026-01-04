// ==UserScript==
// @name         MSN.com news - redirect to original site
// @namespace    http://tampermonkey.net/
// @version      2025-05-14
// @description  Automatically redirect MSN news pages to the original source site.
// @author       Jamie Landeg-Jones
// @match        https://www.msn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msn.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530034/MSNcom%20news%20-%20redirect%20to%20original%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/530034/MSNcom%20news%20-%20redirect%20to%20original%20site.meta.js
// ==/UserScript==

// Props to the hints from this post: joeytwiddle@github - https://github.com/Tampermonkey/tampermonkey/issues/1279#issuecomment-875386821

// "run-at document-start" is needed for this to work with TamperMonkey on Firefox.
// Without this, the default is to wait until DOMContentLoaded, which as far as I
// can see, is later than "document-start" but still earlier than necessary, so I
// don't know why FireFox needs this. Thanks to reddit user "AchernarB" for this fix:
// https://old.reddit.com/r/duckduckgo/comments/17ym4q1/how_do_i_disable_the_msn_amp_redirects_for_news/mhh57w0/
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event

(function() {
    'use strict';

    function redirect_to_article()
      {
        let numAttempts = 0;
        let doneit = 0;

        let tryNow = function()
          {
            let link_tags = document.getElementsByTagName ('link');

            for (let loop=0; loop < link_tags.length; loop++)
              {
                if (link_tags[loop].rel && link_tags[loop].rel == 'canonical')
                  {
                    const new_url = link_tags[loop].href;

                    doneit = 1;

                    if (new_url.match ("^https://(www\.)?msn.com/"))
                      console.info ('MSN Redirect: Ignoring redirect (same site): ' + new_url);
                     else
                      {
                        console.info ('MSN Redirect: Redirecting to ' + new_url);
                        window.location = new_url
                      }
                  }
              }

            if (!doneit)
              {
                if (numAttempts++ >= 20)
                  console.warn ('Giving up after 20 attempts. Could not find canonical link');
                 else
                  {
                    console.info ('MSN Redirect: Retrying, attempt ' + numAttempts.toString() + ' of 20.');
                    setTimeout (tryNow, 250 * Math.pow (1.1, numAttempts));
                  }
              }
          }
        tryNow();
      }

     // Run the filter when the page loads
    window.addEventListener ('load', redirect_to_article);
})();
