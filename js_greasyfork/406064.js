// ==UserScript==
// @name         Yahoo Finance - Remove Ads in News section below Portfolio Section
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes the ads that are sprinkled the news section below your portfolio items (note: i wait 10seconds before removing since that is more reliable)
// @author       You
// @include      http://finance.yahoo.com/*
// @include      https://finance.yahoo.com/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/406064/Yahoo%20Finance%20-%20Remove%20Ads%20in%20News%20section%20below%20Portfolio%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/406064/Yahoo%20Finance%20-%20Remove%20Ads%20in%20News%20section%20below%20Portfolio%20Section.meta.js
// ==/UserScript==

(function() {
    $(function(){
        console.log('page done loading... still have to wait 5seconds or so as some content still dynamically coming in maybe');
        setTimeout(()=> {
            'use strict';
            console.log('######################################');
            console.log('Yahoo Finance Ad Blocker');
            var ad_divs = document.querySelectorAll('li[class^="W("]');
            console.log(ad_divs);
            ad_divs.forEach(e => e.parentNode.removeChild(e));
        }, 10000);
    });
})();