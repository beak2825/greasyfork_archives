// ==UserScript==
// @name         Reddit Upvote 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Upvote /r/The_Donald
// @author       MagaBaby!
// @match        reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393936/Reddit%20Upvote.user.js
// @updateURL https://update.greasyfork.org/scripts/393936/Reddit%20Upvote.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.up').click();
        }, 500);
    });
})();