// ==UserScript==
// @name         247Sports Blacklist
// @namespace    https://247sports.com/
// @version      0.11
// @description  Allows hiding posts from annoying users
// @author       revets
// @match        http*://*247sports.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371180/247Sports%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/371180/247Sports%20Blacklist.meta.js
// ==/UserScript==
(function () {'use strict';var blacklist = [

    /* ******EDIT THE FOLLOWING LINE. COMMA-SEPARATED USERNAMES IN QUOTES.*/

    "GusFring505", "PaulDrakeLives","example 3",

    ];/* ****** IF YOU WISH TO HIDE POSTS THAT QUOTE A BLACKLISTED USER, 
              CHANGE false TO true IN THE LINE BELOW */
    var killQuotes=false;

    /* *******NO MORE EDITING REQUIRED */

    for (var BLL of blacklist) {
        $("li[data-alias='"+BLL+"']").remove();
        $("a.g_usrnm:contains('"+BLL+"')").closest("ul").remove();
        if(killQuotes) $("div.message>blockquote a[href='/User/"+BLL+"']").closest("li").remove();
    }
})();