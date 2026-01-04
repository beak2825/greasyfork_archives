// ==UserScript==
// @name           Pmz adblocker
// @namespace      pmzad
// @license        None
// @description    Pornmz remove adblocker
// @author         TheOnlyOne
// @include        *://*.pornmz.*/*
// @include        *://*.pornmz.*.*/*
// @include        *://*/*.pornmz.*/*
// @include        *://*/*.pornmz.*.*/*

// @version        1.4
// @downloadURL https://update.greasyfork.org/scripts/444047/Pmz%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/444047/Pmz%20adblocker.meta.js
// ==/UserScript==

function OneCodeToRuleThemAll () {
    'use strict';
    var vergsion = '1.0';

    $(document).ready(function(){



        var elements = $('div[id^="chp_ads_block_modal"]').filter(
            function(){
                return this.id.match(/\d+$/);
            }
        );

        console.log(elements);
            
    });
}

OneCodeToRuleThemAll();