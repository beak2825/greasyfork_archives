// ==UserScript==
// @name         Antifandom redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fandom sucks. Here's a script to automatically redirect from fandom.com to antifandom.com.
// @author       ctsp
// @match        *://*.fandom.com/*
// @icon         https://www.fandom.com/f2/assets/favicons/favicon-32x32.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514360/Antifandom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/514360/Antifandom%20redirect.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('.fandom.com/') > -1 && !window.location.href.includes('www')) {
    window.location.replace(window.location.toString().replace('.fandom.com/', '.antifandom.com/'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                if (window.location.href.indexOf('.fandom.com/') > -1 && !window.location.href.includes('www')) {
                    window.location.replace(window.location.toString().replace('.fandom.com/', '.antifandom.com/'));
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