// ==UserScript==
// @name         Temtem Wiki Redirect
// @namespace    https://temtem.fandom.com/
// @version      0.1
// @description  Redirect
// @author       trashgaylie
// @match        https://temtem.fandom.com/*
// @icon         https://temtem.wiki.gg/images/e/e6/Site-logo.png
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/476048/Temtem%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/476048/Temtem%20Wiki%20Redirect.meta.js
// ==/UserScript==

// Original Code by Fuim https://greasyfork.org/en/scripts/439993-youtube-shorts-redirect
// Only incoming and outgoing URLs replaced

var oldHref = document.location.href;
if (window.location.href.indexOf('https://temtem.fandom.com/') > -1) {
    window.location.replace(window.location.toString().replace('https://temtem.fandom.com/', 'https://temtem.wiki.gg/'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('https://temtem.fandom.com/') > -1) {
                    window.location.replace(window.location.toString().replace('https://temtem.fandom.com/', 'https://temtem.wiki.gg/'));
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