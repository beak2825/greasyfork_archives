// ==UserScript==
// @name         Worm, Ward, Pact, and Twig web serial comments spoiler protector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables character tags and hides all comments in Wildbow's web serials.
// @author       ShareDVI
// @match        http://parahumans.wordpress.com/*
// @match        http://parahumans.net/*
// @match        http://www.parahumans.net/*
// @match        http://pactwebserial.wordpress.com/*
// @match        http://twigserial.wordpress.com/*
// @match        https://parahumans.wordpress.com/*
// @match        https://parahumans.net/*
// @match        https://www.parahumans.net/*
// @match        https://pactwebserial.wordpress.com/*
// @match        https://twigserial.wordpress.com/*
// @include      parahumans.wordpress.com/*
// @include      parahumans.net/*
// @include      pactwebserial.wordpress.com/*
// @include      twigserial.wordpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32012/Worm%2C%20Ward%2C%20Pact%2C%20and%20Twig%20web%20serial%20comments%20spoiler%20protector.user.js
// @updateURL https://update.greasyfork.org/scripts/32012/Worm%2C%20Ward%2C%20Pact%2C%20and%20Twig%20web%20serial%20comments%20spoiler%20protector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery("#comments").before("<b style='color:green; font-size:150%'>Spoiler protection: all comments hidden!</b>");
    if (Math.floor(Math.random() * 50) < 1) {
        jQuery("#comments").before("<b style='color:green; font-size:100%'>Also, thank you for being wholesome ^_^</b><br>");
    }
    // Filter all comments newer than days
    jQuery("#comments").hide().remove()
    //jQuery("article.comment").filter(function(i,e) {return Date.parse(jQuery(e).find("time").attr("datetime")) >= chapter + 2*86400*1000;}).hide().remove();
    // Delete tags
    jQuery("a[rel=tag]").hide().remove();
    // How many days ahead are allowed
    //var DAYS = 2;
    // Get chapter release date, thank gods of semantic web
    //var chapter = Date.parse(jQuery("time.entry-date").attr("datetime"));
    // If something went wrong, better kill all comments
    //if(!chapter) chapter=0;
    // Add warning so that you know it's enabled
})();