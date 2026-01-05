// ==UserScript==
// @name         Reddit downvote /r/The_Donald
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Downvote /r/The_Donald. This script is breaking the ToS of the site it runs on as can be seen here: https://reddit.zendesk.com/hc/en-us/articles/205192985
// @author       You
// @match        https://www.reddit.com/r/The_Donald*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24527/Reddit%20downvote%20rThe_Donald.user.js
// @updateURL https://update.greasyfork.org/scripts/24527/Reddit%20downvote%20rThe_Donald.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.down').click();
        }, 500);
    });
})();