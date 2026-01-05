// ==UserScript==
// @name         Enough of Donald Drumpf!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downvote /r/The_Donald
// @author       You
// @match        https://www.reddit.com/r/hillaryclinton*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25313/Enough%20of%20Donald%20Drumpf%21.user.js
// @updateURL https://update.greasyfork.org/scripts/25313/Enough%20of%20Donald%20Drumpf%21.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {
        setTimeout(function(){
            $('.sitetable .arrow.down').click();
        }, 500);
    });
})();