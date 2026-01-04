// ==UserScript==
// @name         Twitter Interests: Uncheck All
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  Unchecks all Interests on the Twitter/X Interests page
// @author       You
// @match        https://twitter.com/settings/your_twitter_data/twitter_interests
// @match        https://x.com/settings/your_twitter_data/twitter_interests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496090/Twitter%20Interests%3A%20Uncheck%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/496090/Twitter%20Interests%3A%20Uncheck%20All.meta.js
// ==/UserScript==

(function() {
        setTimeout(() => {
            var checkboxes = [];
            // we only really want to find those that are checked/ticked
            // so instead of looping over all of them (with an interval)
            // only loop over the checked ones, and put them into
            // the checkboxes array
            document.querySelectorAll('input[type="checkbox"]').forEach((c) => {
                if (c.checked) {
                    checkboxes[checkboxes.length] = c;
                }
            });
            var i = 0;

            var loopId = setInterval(() => {
                var e = checkboxes[i++];
                if (i % 10 == 0) { console.log("Running... (" + i + ")") } // added in to make it give some idea that it's working...
                if (e !== undefined) {
                    if (e.checked) {
                        console.log(e);
                        e.parentElement.click();
                    }
                } else {
                    clearInterval(loopId);
                }
            }, 650); // seems to be a good interval to not overload the API
        }, 4000);
})();