// ==UserScript==
// @name         Hummingbird Forum Fix
// @namespace    Moose Edition
// @version      v2.1
// @description  Fix Activity Feed on Forum Profile
// @author       anonymoose
// @grant        none
// @include https://forums.hummingbird.me/users*
// @include http://forums.hummingbird.me/users*
// @include *hummingbird.me/*
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/16501/Hummingbird%20Forum%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16501/Hummingbird%20Forum%20Fix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var siteTitle = document.title;var text="t";var username = $(".username").html(); 
if (siteTitle.match("Hummingbird Forums")) {$("div.profile-navigation").find("li.nav-link:first").find("a").attr("href", "https://hummingbird.me/users/" + username);
    var fallback = setInterval(function(){ var username = $(".username").html();$("div.profile-navigation").find("li.nav-link:first").find("a").attr("href", "https://hummingbird.me/users/" + username);stablizeSite("es");
}, 10);}