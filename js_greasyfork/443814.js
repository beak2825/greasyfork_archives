// ==UserScript==
// @name         Twitter tweet?id= redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects broken twitter notifications
// @author       Compu
// @match        *://*.twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/443814/Twitter%20tweetid%3D%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/443814/Twitter%20tweetid%3D%20redirect.meta.js
// ==/UserScript==
var oldHref = document.location.href;
const regex = /&cxt\=.*/
if (window.location.href.indexOf('twitter.com/tweet?id=') > -1) {
    window.location.replace(window.location.toString().replace('/tweet?id=', '/anyuser/status/').replace(regex, ''));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('twitter.com/tweet?id=') > -1) {
                    window.location.replace(window.location.toString().replace('/tweet?id=', '/anyuser/status/').replace(regex, ''));
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