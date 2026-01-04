// ==UserScript==
// @name         MAL block reviews
// @namespace    none
// @version      0.1
// @description  block review user
// @author       chicoxin
// @match        https://myanimelist.net/anime/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30282/MAL%20block%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/30282/MAL%20block%20reviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // config list of usernames for block their reviews
    // example: ["username0", "username2", "usermane3"]
    var blockUsers = [];

    blockUsers.forEach(function(e){
        $(".borderDark a[href*="+e+"]").closest(".borderDark").css("display","none");
        console.log("delete review of " + e);
    });

    console.log("ITS DONE!");
})();