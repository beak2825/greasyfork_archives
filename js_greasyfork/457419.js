// ==UserScript==
// @name         Reddit Mobile Banner Kill
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Removes the banner prompting to open reddit in the mobile app. This script only does anything on mobile browsers that support Tampermonkey
// @author       Zoidy
// @license      MIT
// @match        *://*.reddit.com/*
// @match        *://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457419/Reddit%20Mobile%20Banner%20Kill.user.js
// @updateURL https://update.greasyfork.org/scripts/457419/Reddit%20Mobile%20Banner%20Kill.meta.js
// ==/UserScript==

(function() {
    console.log("Reddit mobile app banner kill loaded!");

    //Top button on homepage
    $(".TopNav__useAppButton").hide();
    $("#get-app").hide();
    $("li.TopNav__promoButton").hide();

    var id = setInterval(function() {
        //View in app or continue in browser (version A)
        $("button.XPromoPopupRpl__actionButton:contains('Continue')").click(); //click the continue button. Should hide banner for the rest of the session
        $("div.XPromoPopupRpl").parent().hide();                               //Hide the banner in case clicking continue doesn't work
        $("div.XPromoBottomBar").hide();                                       //hide the other 'open in app' banner
        $("body").removeClass("scroll-disabled");

        //View in app or continue in browser (version B - a different popup appears sometimes)
        try{
            $("#secondary-button",
				$("xpromo-bottom-sheet",
					$("xpromo-app-selector",
						$("shreddit-async-loader",
							$("shreddit-experience-tree.theme-beta")[0].shadowRoot
						)[0].shadowRoot
					)[0].shadowRoot
				)[0].shadowRoot
            ).click();
        }catch(e){}

        //View in app or continue in browser (version B)
        try{
            $("#secondary-button",
				$("xpromo-bottom-sheet",
					$("xpromo-app-selector",
						$("shreddit-async-loader",
							$("shreddit-experience-tree.theme-beta")[0].shadowRoot
						)[0].shadowRoot
					)[0].shadowRoot
				)[0]
             ).click();
        }catch(e){}

        //See Reddit in... (new version C)
        try{
            $('button#secondary-button',
				$('xpromo-app-selector',
					$('shreddit-async-loader[paint-group="xpromo"][bundlename="app_selector"]')[0].shadowRoot
				)[0].shadowRoot
             ).click()
        }catch(e){}

        //Top button on homepage. hide again, they sometimes reappear
        $(".TopNav__useAppButton").hide();
        $("#get-app").hide();

        //Top button on child pages
        $("shreddit-async-loader[bundlename='top_button'][paint-group='xpromo']").hide();

        //"This Page looks better in the app"
        try{
            $("xpromo-bottom-bar",
				$("shreddit-async-loader[bundlename='bottom_bar_xpromo']")[0].shadowRoot
			).hide();
        }catch(e){}

        //"View Reddit in app bottom banner"
        try{
            $("#xpromo-bottom-sheet button").click();
        }catch(e){}
    }, 200);

    //keep the hiding code running for a while since things reappear.
    setTimeout(function(){
        clearInterval(id);
        console.log("Reddit mobile app banner kill ended!");
    },7000);
})();