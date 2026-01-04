
// ==UserScript==
// @name         voat upvote /v/theawakening
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Upvote /v/theawakening
// @author       You
// @match        https://voat.co/v/theawakening*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372180/voat%20upvote%20vtheawakening.user.js
// @updateURL https://update.greasyfork.org/scripts/372180/voat%20upvote%20vtheawakening.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.up').click();
        }, 500);
    });
})();