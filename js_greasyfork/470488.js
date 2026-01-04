// ==UserScript==
// @name         YouTube Improver
// @namespace    -
// @version      2.1
// @description  Remove ads and improves some stuff
// @author       Carolina Reaper
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @connect      googlevideo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470488/YouTube%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/470488/YouTube%20Improver.meta.js
// ==/UserScript==
// Start Injection
let inject1 = Date.now();
console.log("Injecting Script, YouTube Improver.");

// Prevent video loading from a timestamp
if (location.href.includes("&t=")) {
    location.href = location.href.split("&t=")[0];
};

// Set classes to remove
let classes = ["ytd-banner-promo-renderer-background", "style-scope ytd-banner-promo-renderer"];

// Create a new interval
setInterval(function() {
    // Increase transparancy on captions
    let captions = document.getElementsByClassName("caption-window");
    for (let e = 0; e < captions.length; e++) captions[e].style.backgroundColor = "rgba(0, 0, 0, 0)";

    // Remove classes
    classes.forEach(function(currentClass) {
        let elements = document.getElementsByClassName(currentClass);
        for (let e = 0; e < elements.length; e++) elements[e].remove();
    });

    // Remove on main page
    let ads = document.getElementsByTagName("ytd-ad-slot-renderer");
    for (let e = 0; e < ads.length; e++) ads[e].remove();
});

// Skip ads on videos
function closeAd() {
    let css = '.video-ads, .video-ads .ad-container .adDisplay,#player-ads, .ytp-ad-module, .ytp-ad-image-overlay { display: none!important; }';
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));

    head.appendChild(style);
};

let skipInterval, skipAd = function() {
    let skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button") || document.querySelector(".videoAdUiSkipButton ");
    if (skipButton) {
        skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button") || document.querySelector(".videoAdUiSkipButton ");
        skipButton.click();
        if (skipInterval) clearTimeout(skipInterval);
        skipInterval = setTimeout(skipAd, 5e2);
    } else {
        if (skipInterval) clearTimeout(skipInterval);
        skipInterval = setTimeout(skipAd, 5e2);
    };
};

closeAd();
skipAd();

// Complete Injection
let injectionTime = Date.now() - inject1;
console.log("Injection Complete, YouTube Improver.\nInjection Time: " + injectionTime + "ms");