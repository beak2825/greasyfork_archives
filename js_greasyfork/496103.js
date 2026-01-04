// ==UserScript==
// @name        kijiji.ca Ad Remover
// @namespace   kijiji Ad Remover
// @match       https://*.kijiji.ca/*
// @grant       none
// @version     1.1
// @author      Jeff Byers <jeff@jeffbyers.com>
// @license     GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright   Copyright (C) 2024, by Jeff Byers <jeff@jeffbyers.com>
// @description Removes ads, sponsored listings, and top banner on Kijiji.
// @icon        https://webapp-static.ca-kijiji-production.classifiedscloud.io/1.27.6/_next/static/media/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/496103/kijijica%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/496103/kijijica%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    console.log('Loading Kijiji.ca Ad Remover...');
    'use strict';
    const $ = window.$;

    function hideStuff() {
        $('.third-party').css('display', 'none');
        $('#AdsenseTop').css('display', 'none');
        $('div#InlineBanner').css('display', 'none');
        $('[data-fes-id="admarktTopSpot"]').css('display', 'none');
        $('.top-feature').css('display', 'none');

        //top-ads-top-bar
        $('.top-ads-top-bar').css('display', 'none');

        //srp-bottom-links
        $('.srp-bottom-links').css('display', 'none');

        //kill ebay
        $(".fes-pagelet > [data-fes-id*='Tree']").css('display', 'none');

        // kill shopping carousel
        $('[data-testid="shopping-ads-carousel"]').css('display', 'none');

        // kill front page hero banner
        $('[data-testid="browse-hero-module"]').css('display', 'none');

        // search result leaderboard space
        $('#gpt-leaderboard-top').css('display', 'none');

        // search result leaderboard space
        $('#gpt-leaderboard-top').css('display', 'none');

        $('[data-testid="gpt-leaderboard-top"]').parent('div').parent('div').remove();
    }

    // keep checking for new stuff to kill
    setInterval(hideStuff, 250);

    console.log('Loaded Kijiji.ca Ad Remover');
})();