/* global $: true */
/* global unsafeWindow: true */


// ==UserScript==
// @name        Geocaching.com + GeoCoord
// @require     https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js?version=251319
// @namespace   geocoord
// @version     1.1
// @description Add link to www.geocoord.nl on geocache pages
// @include     http://www.geocaching.com/*
// @include     https://www.geocaching.com/*
// @exclude     https://www.geocaching.com/profile/profilecontent.html
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393186/Geocachingcom%20%2B%20GeoCoord.user.js
// @updateURL https://update.greasyfork.org/scripts/393186/Geocachingcom%20%2B%20GeoCoord.meta.js
// ==/UserScript==


(function() {

   'use strict';

    var cfg = new MonkeyConfig({
        title: 'Configuratie Link naar GeoCoord',
        menuCommand: true,
        params: {
            open_in_new_tab: {
                type: 'checkbox',
                default: false
            }
        }
    });

    var open_in_new_tab = cfg.get('open_in_new_tab');

   var geocoordURL = 'https://www.geocoord.nl/forum/index.php?action=search2&search=';
   var path = window.location.pathname;
   var gccode = $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();

   if (window.top == window.self &&
        ( (path.match(/^\/geocache\/.*/) !== null) ||
        (path.match(/^\/seek\/cache_details\.aspx.*/) !== null))) {

      if (open_in_new_tab) {
            $('#ctl00_ContentBody_GeoNav_logButton').after('<a target="_blank" id="linkToGeoCoord" class="btn btn-primary" style="margin-top: 14px; background-color: #17a2b8" href="' + geocoordURL + gccode + '">GeoCoord</a>');
        } else {
            $('#ctl00_ContentBody_GeoNav_logButton').after('<a id="linkToGeoCoord" class="btn btn-primary" style="margin-top: 14px; background-color: #17a2b8" href="' + geocoordURL + gccode + '">GeoCoord</a>');
        }
   }

}());
