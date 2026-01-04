// ==UserScript==
// @name         Twitter redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitter to Tumblr Redirect
// @author       SaishoVibes
// @match        *://*.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=tumblr.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/475050/Twitter%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/475050/Twitter%20redirect.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('twitter.com/') > -1) {
    window.location.replace(window.location.toString().replace('twitter', 'tumblr'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('twitter.com/') > -1) {
                    window.location.replace(window.location.toString().replace('twitter', 'tumblr'));
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