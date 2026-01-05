// ==UserScript==
// @name         Ceca za google
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/23987/Ceca%20za%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/23987/Ceca%20za%20google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#hplogo").replaceWith("<img src='https://i1.rgstatic.net/ii/profile.image/AS%3A365639052087297@1464186551439_l/Svetlana_Cvetanovic.png'></img>");
    $(".metropolitanlogo").replaceWith("<img src='https://i1.rgstatic.net/ii/profile.image/AS%3A365639052087297@1464186551439_l/Svetlana_Cvetanovic.png' style='margin-top:-100px'></img>");
    $(".logo").replaceWith("<img src='https://i1.rgstatic.net/ii/profile.image/AS%3A365639052087297@1464186551439_l/Svetlana_Cvetanovic.png'></img>");
    $(".ImgLoginBanner").replaceWith("<img src='https://i1.rgstatic.net/ii/profile.image/AS%3A365639052087297@1464186551439_l/Svetlana_Cvetanovic.png'></img>");
    $(".fb_logo").replaceWith("<img src='https://i1.rgstatic.net/ii/profile.image/AS%3A365639052087297@1464186551439_l/Svetlana_Cvetanovic.png' style='margin-top:-75px'></img>");
})();
