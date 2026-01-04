// ==UserScript==
// @name         Betterbook
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Facebook, but better!
// @author       hosma
// @match        https://www.facebook.com/
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371749/Betterbook.user.js
// @updateURL https://update.greasyfork.org/scripts/371749/Betterbook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var post_div=$('div[role="feed"] div>div[data-testid="fbfeed_story"]'); // idk doesnt work for everything figure it out lole
        var dir = 'left'; // up, down, left, right
        var speed = '20';

        post_div.wrap('<marquee direction="'+ dir +'" scrollamount="'+ speed +'"></marquee>');
    }, 2000);
})();