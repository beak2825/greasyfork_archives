// ==UserScript==
// @name         GeocachingPremiumOnlyLOG
// @version      1.1
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @description  Allow Basic Members to log a Premiom Member caches.
// @author       Peter Badida
// @copyright    2018+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/GeocachingPremiumOnlyLOG
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://www.geocaching.com/favicon.ico
// @include      *.geocaching.com/geocache/GC*
// @grant        none
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @downloadURL https://update.greasyfork.org/scripts/372008/GeocachingPremiumOnlyLOG.user.js
// @updateURL https://update.greasyfork.org/scripts/372008/GeocachingPremiumOnlyLOG.meta.js
// ==/UserScript==
'use strict';

var create = false;
var pmo_text = "THIS IS A GEOCACHING PREMIUM MEMBER ONLY GEOCACHE";
var banners;  // Premium Member Only banners on the website
var target;   // banner-like element with pmo_text
var link;     // replacement for the PMO banner
var li;       // single element on Difficulty/Terrain/... bar

banners = document.getElementsByClassName("premium-upgrade-widget");
if (banners.length > 0) {
    create = true;
}

// make sure the script doesn't take any additional resources
// than needed if the Cache isn't PMO i.e. execute only if found
if(create) {
    // create a LI element for the UL parent bar
    li = document.createElement("LI");

    // create a hyperlink with the URL for logging PMO Cache
    link = document.createElement("A");
    link.href = "https://www.geocaching.com/play/geocache/";
    link.href += document.getElementsByClassName("li__gccode")[0].innerText;
    link.href += "/log";

    // style the link a little
    link.innerText="LOG Premium Member Cache!";
    link.style.color = "#04c8d6";
    link.style.fontWeight="bold"

    // put the link into LI element
    li.appendChild(link);

    // append link on the Difficulty/Terrain/... bar
    target = document.getElementsByClassName("ul__hide-details")[0];
    target.appendChild(li);
}
