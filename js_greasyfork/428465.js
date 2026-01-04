// ==UserScript==
// @name         TraktorForum
// @namespace    http://traktor.mojforum.si
// @version      1.0
// @description  Označi forume kot prebrane now works.
// @author       Freza
// @match        http://traktor.mojforum.si/*
// @icon         https://www.google.com/s2/favicons?domain=mojforum.si
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/428465/TraktorForum.user.js
// @updateURL https://update.greasyfork.org/scripts/428465/TraktorForum.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.forumlink[style*="font-size:10px "]').remove();
    $('.bodyline div.center').remove();
    $('a.gensmall[href*="traktor.html?mark=forums"]').attr("href", "http://traktor.mojforum.si/index.php?hash=7c324e24&mark=forums&mark_time="+Math.floor(Date.now()/1000))
    //https://mopedist.si/index.php?hash=7c324e24&mark=forums&mark_time=1624466929
    //http://traktor.mojforum.si/traktor.html?mark=forums
})();