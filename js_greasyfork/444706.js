// ==UserScript==
// @name        YouTube nuisance remover
// @namespace   Violentmonkey Scripts
// @license     MIT
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.8
// @author      pepo_boyii
// @description Removes the channel watermark, along with the video thumbnails, homepage ads, and channel links at the end of videos.
// @downloadURL https://update.greasyfork.org/scripts/444706/YouTube%20nuisance%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/444706/YouTube%20nuisance%20remover.meta.js
// ==/UserScript==

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function killVideoAds(){
    const clear = (() => {
    const defined = v => v !== null && v !== undefined;
    const timeout = setInterval(() => {
        const ad = [...document.querySelectorAll('.ad-showing')][0];
        if (defined(ad)) {
            const video = document.querySelector('video');
            if (defined(video)) {
                video.currentTime = video.duration;
            }
        }
    }, 500);
    return function() {
        clearTimeout(timeout);
    }
    })();
}

const elements = ["ytp-ce-channel", // Channel profile at the end of videos.
"ytp-ce-video", // Video thumbnails at the end of videos.
"branding-img", // Channel watermark.
"ytp-paid-content-overlay-link", // "This video contains paid promotions" overlay.
"ytd-display-ad-renderer", // Ads on homepage.
"ytd-banner-promo-renderer", // YouTube promotion banner in homepage.
"ytd-promoted-sparkles-web-renderer", // Ads on top of suggested videos.
"ytd-action-companion-ad-renderer", // Ditto.
"ytd-merch-shelf-renderer", // Merch mini-store below video description.
"ytp-cards-button", // The "i" icon with suggested videos that shows up during playback.
"ytp-cards-teaser", // Ditto.
"ytd-promoted-sparkles-text-search-renderer", // Ads on top of search results.
"ytd-compact-promoted-video-renderer", // Promoted videos on suggested sidebar.
"ytd-statement-banner-renderer", // YouTube featured banner in homepage.
"ytd-mealbar-promo-renderer", // YouTube Premium banner ad.
"video-ads", // Ad banners in videos.
"ytp-suggested-action-badge", // "View products" bubble.
"ytd-promoted-video-renderer", // Ads in search results.
"yt-mealbar-promo-renderer", // Premium ads in lower-left corner.
"style-scope ytd-video-masthead-ad-v3-renderer", // Video ads in homepage.
"ytd-ad-slot-renderer", // More ads in homepage.
                 ]

function execute(){
    killVideoAds() // Video ads.
    for (let x in elements){
        removeElementsByClass(elements[x])
    }
}

var html = document.getElementsByTagName("html")[0].innerHTML

function checkChange(){
    if (html == document.getElementsByTagName("html")[0].innerHTML){
    }
    else{
        execute();
        html = document.getElementsByTagName("html")[0].innerHTML
    }    
}

window.addEventListener('load', function(){
    setInterval(() => { checkChange(); }, 2000);  
})