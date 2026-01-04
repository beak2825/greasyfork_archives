// ==UserScript==
// @name         Better Web (beta)
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Block Porn Sites, Horoscope Sites, Gambling Sites, Betting Sites
// @license      GNU GPLv3
// @author       Yusuf Sameh
// @match        https://greasyfork.org/en/scripts?q=porn+blocker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @include https://*.pornhub.com/*
// @include https://*.xhamster.com/*
// @include https://*.xvideos.com/*
// @include https://*.thegay.com/*
// @include https://*.gay.bingo/*
// @include https://*.thisvid.com/*
// @include https://*.youporn.com/*
// @include https://*.stripchat.com/*
// @include https://*.slot.com/*
// @include https://*.casino.org/*
// @include https://*.slotomania.com/*
// @include https://*.bet365.com/*
// @include https://*.betmgm.com/*
// @include https://*.fanduel.com/*
// @include https://*.draftkings.com/*
// @include https://*.caesars.com/*
// @include https://*.betus.com/*
// @include https://*.bovada.lv/*
// @include https://*.betonline.ag/*
// @include https://*.mybookie.ag/*
// @include https://*.sportsbetting.ag/*
// @include https://*.betfair.com/*
// @include https://*.paddypower.com/*
// @include https://*.skybet.com/*
// @include https://*.betfred.com/*
// @include https://*.boylesports.com/*
// @include https://*.coral.co.uk/*
// @include https://*.ladbrokes.com/*
// @include https://*.williamhill.com/*
// @include https://*.unibet.com/*
// @include https://*.888sport.com/*
// @include https://*.betvictor.com/*
// @include https://*.betway.com/*
// @include https://*.sportingbet.com/*
// @include https://*.bet-at-home.com/*
// @include https://*.intertops.eu/*
// @include https://*.sbobet.com/*
// @include https://*.pinbet88.com/*
// @include https://*.melbet.com/*
// @include https://*.1xbet.com/*
// @include      *pornhub*
// @include      *dick*
// @include      *pussy*
// @include      *cum*
// @include      *nude*
// @include      *nudity*
// @include      *ome*
// @include      *porn*
// @include      *houseparty*
// @include      *sex*
// @include      *gay*
// @include      *feet*
// @include      *male slave*
// @include      *telonym*
// @include      *kik*
// @include      *rule34*
// @include      *xhamster*
// @include      *yolo*
// @include      *fuck*
// @include      *suck*
// @include      *tinder*
// @include      *periscope*
// @include      *ask.fm*
// @include      *4chan*
// @include      *8chan*
// @include      *chatroulette*
// @include      *youporn*
// @include      *hentai*
// @include      *daddy*
// @include      *xx*
// @include      *nsfw*
// @include      *gambling*
// @include      *777*
// @include      *777slots*
// @include      *blackjack*
// @include      *poker*
// @include      *casino games*
// @include      *casino*
// @include      *jackpot*
// @include      *free slots*
// @include      *horoscope*

// @run-at document-start
// @namespace https://greasyfork.org/users/12417
// @downloadURL https://update.greasyfork.org/scripts/513984/Better%20Web%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513984/Better%20Web%20%28beta%29.meta.js
// ==/UserScript==

function block() // Function will block the website.
{
    var current = window.location.href;
    window.history.back(); // Attempt to go back (if it's opened in a tab with no tab history)
    if (window.location.href == current) // If it's still there
    {
        window.close(); // Attempt to close page
        if (window.location.href == current) // If it's still there (if it's the only tab)
        {
            window.location.href = "about://newtab"; // Go to a new tab; always works!
        }
    }
}
// ==/UserScript==

(function() {
    'use strict';
    block();
    // Your code here...
})();