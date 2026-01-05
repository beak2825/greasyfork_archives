// ==UserScript==
// @name       KrustyHack jQuery Hightlight Nofollow
// @namespace  http://www.nicolashug.com
// @version    0.1
// @description  simply highlight nofollow links on a page with jQuery
// @match      *://*/*
// @copyright  2014+,  KrustyHack
// @downloadURL https://update.greasyfork.org/scripts/4677/KrustyHack%20jQuery%20Hightlight%20Nofollow.user.js
// @updateURL https://update.greasyfork.org/scripts/4677/KrustyHack%20jQuery%20Hightlight%20Nofollow.meta.js
// ==/UserScript==

function getScript(url, success) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0],
        done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            // callback function provided as param
            success();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        };
    };
    head.appendChild(script);
};
getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', function() {
    if (typeof jQuery == 'undefined') {
        console.log("NojQuery at all... :(");
    } else {
        // jQuery loaded! Make sure to use .noConflict just in case
        console.log("jQuery loaded");
        jQuery.noConflict();
        jQuery(document).ready(function($) {
            $("a[rel='nofollow']").css({
                "background-color": "red",
                "color": "white"
            });
        });
    }
});