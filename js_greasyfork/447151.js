// ==UserScript==
// @name         YouTube Watch Later Autoplay Disabler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes videos in Watch Later list redirect to their standalone versions. Based on code by Fuim from their script 'Youtube shorts redirect'
// @author       AudenWolf
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/447151/YouTube%20Watch%20Later%20Autoplay%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/447151/YouTube%20Watch%20Later%20Autoplay%20Disabler.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('&list=WL') > -1) {
    window.location.replace(window.location.toString().replace('&list=WL', ''));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('&list=WL') > -1) {
                    window.location.replace(window.location.toString().replace('&list=WL', ''));
                }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};