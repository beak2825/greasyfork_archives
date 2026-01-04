// ==UserScript==
// @name         toutiao better
// @namespace    http://www.netroby.com/
// @version      0.8
// @description  make toutiao better
// @author       www.netroby.com
// @match        https://www.toutiao.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383996/toutiao%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/383996/toutiao%20better.meta.js
// ==/UserScript==

(function() {
    console.log(window.location.pathname);
    'use strict';
    jQuery.noConflict();
    if (window.location.pathname == "/") {
        jQuery("div.container").css("width", "1400px").css("margin", "0 auto");
        jQuery("div.ugcBox").hide();
        
        jQuery("div.bui-right").css("float", "right").css("margin-top", "-34px").css("width", "730px");
        jQuery("div.index-content").css("width", "660px");
        jQuery("div.index-channel").css("display", "none");
        jQuery("div.index-channel").css("width", "10px").css("margin-right", 0);
        jQuery("div#rightModule").html("<iframe name=\"vctx\" id=\"vctx\" style=\"width:100%;height:750px;border:0\"></iframe>");
        function linkOiframe() {
            jQuery("a.link").each(function( index ) {
                jQuery(this).attr("target", "vctx");
            });
            jQuery("div.refresh-mode").click(function () {
                jQuery(document).scrollTop(-1);
                jQuery("div.index-content").scrollTop(-1);
            });
            var cilink = jQuery("div.title-box>a.link:eq(3)").attr("href");
            var cisrc = jQuery("#vctx").attr("src");
            if (cisrc == undefined) {
                console.log(cisrc);
                jQuery("#vctx").attr("src", cilink);
            }
        }
        jQuery("body").on("DOMSubtreeModified", "div.feed-infinite-wrapper", function() {
            console.log("Dom changed");
            linkOiframe();
        });

        jQuery("div.index-content").height(window.innerHeight-40);
        jQuery("div.index-content").css("overflow-y", "scroll");
        jQuery("#vctx").height(window.innerHeight+12);
        jQuery(".toolbar").hide();

        jQuery("body").css("overflow", "hidden");
    }else {
        jQuery("div.index-left").css("display", "none");
        jQuery("div.index-right").css("display", "none");
    }

    // Your code here...
})();