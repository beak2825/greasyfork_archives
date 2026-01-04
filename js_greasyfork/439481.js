// ==UserScript==
// @name         manga-raw.club Ads Space Remove
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Removes ads space from manga-raw.club
// @author       Root Android and Ethical Hacker
// @match        https://www.manga-raw.club/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439481/manga-rawclub%20Ads%20Space%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/439481/manga-rawclub%20Ads%20Space%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ads = 0;
    let fads= setInterval(remove,500);
    function remove(){
        ads++;
        $(".page-in").find('[style]').addBack().css('height','auto');
        $("ins").parents('div').css('height','auto');
        $(".ad-container").remove();
        $(".adsbygoogle").remove();
        $(".adsbox").remove();
        $("body.nightmode .novel-cover img").css("filter",'none')
        if(ads > 100 ) clearInterval(fads);
    }


})();