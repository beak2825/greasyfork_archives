// ==UserScript==
// @name         VarageSale - Hide Abandoned Ads
// @description  Hide search results where "last activity" was "years ago" (since VarageSale won't)
// @version      0.1
// @author       mica
// @namespace    greasyfork.org/users/12559
// @match        https://www.varagesale.com/*/search?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465752/VarageSale%20-%20Hide%20Abandoned%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/465752/VarageSale%20-%20Hide%20Abandoned%20Ads.meta.js
// ==/UserScript==

var items = 0;
setInterval(function() {
    if (document.getElementsByClassName('item').length > items) {
        Array.from(document.getElementsByTagName('time')).forEach(time => {
            if (time.innerText.includes('years ago')) {
                time.closest('#items').remove();
            }
        });
        items = document.getElementsByClassName('item').length;
    }
}, 900);
