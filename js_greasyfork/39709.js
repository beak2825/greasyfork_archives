// ==UserScript==
// @name           Smile@Amazon
// @name:de        Smile@Amazon
// @description    Redirects Amazon shopping sites that offer Smile to their Smile representation
// @description:de Leitet Amazon Shopping Seiten die Smile anbieten zu ihrem Smile Äquivalent um
// @namespace      zScript
// @match          https://www.amazon.com/*
// @match          https://www.amazon.co.uk/*
// @match          https://www.amazon.de/*
// @icon           https://www.amazon.com/favicon.ico
// @version        1.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/39709/Smile%40Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/39709/Smile%40Amazon.meta.js
// ==/UserScript==

// I created this script because any other Script redirecting to Amazon Smile has one or another flaw
// Most Scripts check for only one TLD like .COM, this script should work for all domains Tampermonkey supports.
// As Amazon redirects its shopping site always to the HTTPS protocol and the WWW subdomain, i only include httpS://WWW.amazon...
// As Amazon prevents to be included in Frames from other sites, i only prevent redirection if the top window is already smile.amazon
// This way i leave (i)frames created by smile.amazon the way Amazon created them, hoping they know what they're doing.

// VERSION 1.1 (13.10.2018)
// It came to my attention that not every Amazon site offers Smile. As far as I found out only .com .de and .co.uk offer Smile.
// I changed the script so Amazon Sites not offering Smile will work with this script.
// VERSION 1.2 (13.10.2018)
// removed unnecessary regex to distinguish between http and https as Amazon switches always to https 
// VERSION 1.3 (04.10.2022)
// switched from @include to @match 
// VERSION 1.4 (06.10.2022)
// @match didn't work as @include - should work aqgain now, sorry

(function() {
    'use strict';
    if(top.location.href.match(/^https:\/\/smile\.amazon\.[^/]+\//i) === null){
        window.location.replace(window.location.href.replace(/^https:\/\/www\./i, "https://smile."));
    }
})();
