// ==UserScript==
// @name         Reddit upvote /r/the_donald
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downvote /r/politics. This script is breaking the ToS of the site it runs on as can be seen here: https://reddit.zendesk.com/hc/en-us/articles/205192985 This is an exact copy of the downvote /r/the_donald script. 
// @author       You
// @match        https://www.reddit.com/r/the_donald*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38850/Reddit%20upvote%20rthe_donald.user.js
// @updateURL https://update.greasyfork.org/scripts/38850/Reddit%20upvote%20rthe_donald.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.up').click();
        }, 500);
    });
})();