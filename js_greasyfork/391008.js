// ==UserScript==
// @name         IsThereAnyDeal with thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Displaying game thumbnails next to the deals
// @author       Zoltan Wacha - steampeek.hu (find similar games)
// @match        https://isthereanydeal.com/*
// @exclude      https://isthereanydeal.com/waitlist/*
// @exclude      https://isthereanydeal.com/collection/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391008/IsThereAnyDeal%20with%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/391008/IsThereAnyDeal%20with%20thumbnails.meta.js
// ==/UserScript==

var refreshTimer = null;

let observer = new MutationObserver(mutationsList => {
	for (let mutation of mutationsList)
	{
		if (mutation.type === 'childList')
		{
			clearTimeout(refreshTimer);
            refreshTimer = setTimeout(function () {
                updateThumbs();
            }, 250);
		}
	}
});

observer.observe(document, {childList: true, subtree: true});

function GM_main ($) {
    $("body").prepend("<style>.itadthumb{width:96px;height:36px;background-repeat:no-repeat;background-position:center;background-size:contain;display:inline-block;margin:0 10px 0 0;flex:none;} .itadthumb.nothumb{background-color: #6f6f6f;background-size: 50%;opacity: 0.1;background-image:url(https://d2uym1p5obf9p8.cloudfront.net/images/logo.png)} .itadthumb.placeholder{opacity: 0.3;background-size: 65%;} .gameinfocontainer{flex:1;}</style>");

    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
        updateThumbs();
    }, 250);
}

function updateThumbs() {
    let thumbadded = false;
    let lnk = null;
    let steamid = null;

    $("#games > .game:not(.thumbnailhandled)").each(function(index) {
        {
            thumbadded = false;
            lnk = $(this).find('.noticeable').attr('href');

            $(this).wrapInner("<div class='gameinfocontainer'></div>");

            if($(this).data("steamid") && $(this).data("steamid").startsWith('app'))
            {
                steamid = $(this).data("steamid");
                steamid = steamid.replace("app", "apps");

                if(steamid)
                {
                    $(this).prepend("<a href='"+lnk+"' class='itadthumb' style='background-image:url(https://steamcdn-a.akamaihd.net/steam/"+steamid+"/capsule_184x69.jpg)'></a>");
                    thumbadded = true;
                }
            }

            if(!thumbadded)
            {
                $(this).prepend("<a href='"+lnk+"' class='itadthumb nothumb'></a>");
            }

            $(this).css("display", "flex");
            $(this).css("align-items", "center");

            $(this).addClass("thumbnailhandled");
        }
    });
}

if (typeof jQuery === "function") {
    GM_main(jQuery);
}