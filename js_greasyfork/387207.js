// ==UserScript==
// @name         AppleDaily No Member
// @version      0.3
// @namespace    http://tampermonkey.net/
// @description  The apple has been bad already.
// @author       Anti-Apple
// @run-at       document-body
// @match        *://*.appledaily.com/*
// @match        *://*.nextmedia.com/*
// @match        *://*.nextdigital.com.hk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387207/AppleDaily%20No%20Member.user.js
// @updateURL https://update.greasyfork.org/scripts/387207/AppleDaily%20No%20Member.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newLoad = function() {
        window.omo_currentuser = {
            isLoggedIn: true, 
            currentAccount: null, 
            currentProfile: null, 
            currentCdnToken: null, 
            snsTokens: Array(0)};
        window.omo_userentitled = true;
    };
    window.ureadLoad = window.ureadCheckCookie = newLoad;

    var newBlocking = function() {
        if (isBlockedContent === null) {
            // hard content
            var isBlockedPromise = isBlockedHardContentPromise(OMOSDK);
            return new Promise(function(resolve, reject) {
                isBlockedPromise
                    .then(function(blocked) {
                        isBlockedContent = false;
                        resolve(isBlockedContent);
                    })
                    .catch(function(err) {
                        isBlockedContent = false;
                        resolve(isBlockedContent);
                    });
            });
        } else {
            return Promise.resolve(isBlockedContent);
        }
    };
    window.isBlockedContentPromise = newBlocking;

    window.omoUserType = 2;

    window.setInterval(function() {
        var matches = document.querySelectorAll(".adaver_box, #div-ad-top, #adHeaderTop, #adFlashLink, *[id^='adRectangle'], #adTextLink, *[id^='divSkyscraper'], *[id^='div-ad-'], *[id^='google_ads'], .anv-ad-content");
        matches.forEach(function(element){
            element.parentNode.removeChild(element);
        });
        window.omoUserType = 2;
        window.ureadLoad = window.ureadCheckCookie = newLoad;
        window.isBlockedContentPromise = newBlocking;
    });
})();