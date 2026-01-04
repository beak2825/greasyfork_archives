// ==UserScript==
// @name         WebNovel Nav Arrows
// @description  Bind arrow keys (left/right) to Previous/Next Chapter links
// @version      1.1.2
// @author       PixelTech
// @license      MIT
// @namespace    https://greasyfork.org/en/scripts/406139-webnovel-nav-arrows
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406139/WebNovel%20Nav%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/406139/WebNovel%20Nav%20Arrows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Key = {
        LEFT: "ArrowLeft",
        RIGHT: "ArrowRight"
    };

    var prev_link, next_link;
    var host = window.location.host;
    var pathname = window.location.pathname;
    var path = pathname.substring(0,pathname.lastIndexOf("/"));
    var subdomain = host.split ('.')[1];

    if (subdomain.length <= 3) {
        var subdomain =  host.split('.')[0]
    }

    // For Debug
    console.log("WebNovel Nav Arrows --- Detected Host: " + host);
    console.log("WebNovel Nav Arrows --- Subdomain Match: " + subdomain);
    console.log("WebNovel Nav Arrows --- Pathname Match: " + path);

    if (subdomain.includes("wuxiaworld")) {
        var l = document.querySelectorAll("next > a");
        var i = l.length;
        for (i = 0; i < l.length; i++) {
            if (String(l[i]).includes(path)) {
                next_link = l[i];
                console.log("WebNovel Nav Arrows --- Next Link: " + next_link); // For Debug
            }
        }
        var l = document.querySelectorAll("prev > a");
        var i = l.length;
        for (i = 0; i < l.length; i++) {
            if (String(l[i]).includes(path)) {
                prev_link = l[i];
                console.log("WebNovel Nav Arrows --- Prev Link: " + prev_link); // For Debug
            }
        }
    }

    if (!subdomain.includes("wuxiaworld")) {
        var l = document.getElementsByTagName('a'); //Find all links
        var i = l.length;
        for (i = 0; i < l.length; i++) {
            if ((l[i].innerHTML.match(/Next*/) || l[i].innerHTML.match(/NEXT*/)) && String(l[i]).includes(path)) { //Match iterations that contain Next* IF that iteration includes the matching domain (helps with redirected WordPress sites)
                next_link = l[i];
                console.log("WebNovel Nav Arrows --- Next Link: " + next_link); // For Debug
            }
            if ((l[i].innerHTML.match(/Prev*/) || l[i].innerHTML.match(/PREV*/) || l[i].innerHTML.match(/Last*/)) && String(l[i]).includes(path)) {    //Match iterations that contain Prev* or Last* IF that iteration includes the matching domain (helps with redirected WordPress sites)
                prev_link = l[i];
                console.log("WebNovel Nav Arrows --- Previous Link: " + prev_link); // For Debug
            }
        }
    }

    //-- Should override any keybinds set by site or browser
    function handleKeyboardEvent(event) {
        switch (event.key){
            case Key.LEFT:
            prev_link.click();
            break;
            case Key.RIGHT:
            next_link.click();
            break;
            default:
            break;
        }
    }

    document.addEventListener('keydown', handleKeyboardEvent, true); //

})();