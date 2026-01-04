// ==UserScript==
// @name         cleanGoogleAds
// @namespace    http://tampermonkey.net/
// @version      0.35
// @description  clean Google Baidu doubbleclick related Ads
// @author       mooring@codernotes.club
// @match        https://*/*
// @match        http://*/*
// @exclude      https://www.google.com/recaptcha/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/427779/cleanGoogleAds.user.js
// @updateURL https://update.greasyfork.org/scripts/427779/cleanGoogleAds.meta.js
// ==/UserScript==

(function() {
    var css = `
        ins[class*="google"],ins[class*="adsbygoogle"],
        .adsbygoogle.adsbygoogle.adsbygoogle.adsbygoogle.adsbygoogle,
        iframe[href*="baidu.com"],[id*="BAIDU"],[id="carbonads"],
        [class*="-ad-zone"],#pagead,.ad.ad-ea,
        .ezoic-ad,.ezo_ad,.ez-stuck,.ez-video-wrap,
        iframe[src*="doubleclick.net"],iframe[src*="google.com"],
        [href*="googleadservices"],[id*="google"],iframe[src*="google"],
        [data-google-av-adk],[data-google-av-metadata],[class*="GoogleActiveViewElement"]
        {display:none!important;transform:scale(.00001)!important;height: 0!important;min-height: 0!important;}
        tr[role="row"][class~="zA"]{pointer-events:none;opacity:0.1!important}
        tr[role="row"][class~="zA"][jslog*="; 1:"]{pointer-events: auto;opacity:unset!important;}
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.querySelector('head').appendChild(style)
})();