// ==UserScript==
// @name (Microsoft Rewards) Bing to Google
// @description Changes from Bing to Google
// @include http://*.bing.com/search?*
// @include https://*.bing.com/search?*
// @version 0.0.0.5
// @icon https://rewards.bing.com/rewards.png
// @author JAS1998
// @copyright 2023+ , JAS1998 (https://greasyfork.org/users/4792)
// @namespace https://greasyfork.org/users/4792
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/465684/%28Microsoft%20Rewards%29%20Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/465684/%28Microsoft%20Rewards%29%20Bing%20to%20Google.meta.js
// ==/UserScript==
 
/* jshint esversion: 9 */
 
var referrer = document.referrer;
 
if (!referrer.includes('rewards.bing.com') && !referrer.includes('.bing.com/search?q=')) {
    var googlesearch = "https://google.com/search?" + document.URL.match(/q\=[^&]*/);
    if (googlesearch != document.URL) {
        location.replace(googlesearch);
    }
}

function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

if (isMobile()) {
    googlesearch = "https://google.com/search?hl=de&site=webhp&source=hp&ei=1R3VUYDfOcHDtAbbhYDoCA&q=" + document.URL.match(/q\=[^&]*/);
    if (googlesearch != document.URL) {
        location.replace(googlesearch);
    }
}
