// ==UserScript==
// @name         ReplaceBanners - WMT
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  try to take over the world!
// @author       You
// @match        https://www.walmart.com/*
// @grant        none
// @locale  en-us
// @downloadURL https://update.greasyfork.org/scripts/39201/ReplaceBanners%20-%20WMT.user.js
// @updateURL https://update.greasyfork.org/scripts/39201/ReplaceBanners%20-%20WMT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dereksBannerLoc = 'https://i.imgur.com/8CeDWu3.png';
    let dereksShortBannerLoc = 'https://i.imgur.com/hGWd1Na.png';
    let derekOtherBannerLoc = 'https://i.imgur.com/6ZxevUC.png';

    let invisionAppLoc = 'https://asurion.invisionapp.com/share/SRG4W2D6FKZ#/screens/282512605_WMT-SmartLife-Landing';
    let bannerContainer = document.querySelector('.banner-image-container');
    if(bannerContainer){
        if(bannerContainer.querySelector('a')){bannerContainer.querySelector('a').href = invisionAppLoc;}
        bannerContainer.querySelector('img').src = dereksBannerLoc;
    }
    let homePageBanner = document.querySelector('.ClickThroughImage');
    if(homePageBanner){
        if(document.querySelector('.ClickThroughImage').parentNode){document.querySelector('.ClickThroughImage').parentNode.href = invisionAppLoc;}
        homePageBanner.src = dereksBannerLoc;
    }
    let GroupLevelBannerContainer = document.querySelector('.shorter-pov-frame');
    if(GroupLevelBannerContainer){
        if(GroupLevelBannerContainer.querySelector('a')){GroupLevelBannerContainer.querySelector('a').href = invisionAppLoc;}
        GroupLevelBannerContainer.querySelector('img').src = derekOtherBannerLoc;
    }
})();