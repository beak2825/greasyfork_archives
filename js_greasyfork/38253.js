// ==UserScript==
// @name		Inoreader Column View Content Scroller
// @namespace		http://www.inoreader.com/
// @version		0.11
// @description		Step to next or prev article in column view with scrolling over the content area
// @author       	Zoltan Wacha
// @include		http://*.inoreader.com/*
// @include		https://*.inoreader.com/*
// @grant        	none
// @downloadURL https://update.greasyfork.org/scripts/38253/Inoreader%20Column%20View%20Content%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/38253/Inoreader%20Column%20View%20Content%20Scroller.meta.js
// ==/UserScript==

function GM_main ($) {
    console.log ('jQuery is installed with no conflicts! The version is: ' + $.fn.jquery);

    $(document).on("mousewheel DOMMouseScroll", "div#three_way_contents", function(e) {
        var elem = $(e.currentTarget);
        if(e.originalEvent.wheelDelta > 0)
        {
            if (elem.scrollTop() == 0)
            {
                //console.log("top");
                $("#sb_rp_prev_article").trigger("click");
            }
        }
        else
        {
            if (elem[0].scrollHeight - Math.round(elem.scrollTop()) == elem.outerHeight())
            {
                //console.log("bottom");
                $("#sb_rp_next_article").trigger("click");
                e.preventDefault();
                e.stopPropagation();
            }
        }
    })
}

if (typeof jQuery === "function") {
    console.log ("Running with local copy of jQuery!");
    GM_main (jQuery);
}