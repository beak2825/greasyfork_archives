// ==UserScript==
// @name         Force Zoom Browser Mode
// @namespace    github.com/weebney
// @version      0.1
// @description  Forces Zoom in the browser without unnecessary hoop-jumping.
// @author       Fuim
// @match        *://*.zoom.us/*
// @icon         https://st1.zoom.us/zoom.ico
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/443636/Force%20Zoom%20Browser%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/443636/Force%20Zoom%20Browser%20Mode.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('zoom.us/j/') > -1) {
    window.location.replace(window.location.toString().replace('/j/', '/wc/join/'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('zoom.us/j') > -1) {
                    window.location.replace(window.location.toString().replace('/j', '/wc/join'));
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