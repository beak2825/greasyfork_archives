// ==UserScript==
// @name         Reddit Upvote /r/The_Donald
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Upvote /r/The_Donald
// @author       MagaBaby!
// @match        https://www.reddit.com/r/The_Donald*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26761/Reddit%20Upvote%20rThe_Donald.user.js
// @updateURL https://update.greasyfork.org/scripts/26761/Reddit%20Upvote%20rThe_Donald.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.up').click();
        }, 500);
    });
})();