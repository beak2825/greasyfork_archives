// ==UserScript==
// @name         Microsoft Edge Ad Blocker
// @namespace    http://microsoft.com/
// @version      0.3
// @description  This is blocker for Edge ads on Microsoft websites. DISCLAIMER! Author isn't affiliated with Google, Apple and other Microsoft haters. Suсk it! We all love Microsoft, but sometimes their pushes are a bit annoying
// @author       Kenya-West
// @match        https://*.live.com/*
// @match        http*://*.office.com/*
// @match        http*://*.microsoft.com/*
// @match        http*://*.xbox.com/*
// @match        http*://*.skype.com/*
// @match        http*://*.mixer.com/*
// @match        http*://*.outlook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30975/Microsoft%20Edge%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/30975/Microsoft%20Edge%20Ad%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var adList = [
        "#epb",
        "#edgePromotion",
        "ohp-announcement",
        ".ms-bgc-ns.notificationBarSlideIn"
    ];

    for (var i = 0; i < adList.length; i++) {
        try {
            document.querySelector(adList[i]).style.display = "none";
            console.log("Microsoft Edge Ad Blocker successfully blocker the banner '" + adList[i] + "'"); //production::enable
        } catch (err) {}
    }
})();