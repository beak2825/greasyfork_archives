// ==UserScript==
// @name         Remove gradient elements from the media control overlay on Max.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove the annoying gradient element from the control overlay which is shown on a mouse movement
// @author       Behike
// @match        *://play.max.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=max.com
// @grant window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503177/Remove%20gradient%20elements%20from%20the%20media%20control%20overlay%20on%20Maxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/503177/Remove%20gradient%20elements%20from%20the%20media%20control%20overlay%20on%20Maxcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => waitAndRemove());
    }
})();

function waitAndRemove() {
    waitForElm("[class^='BottomGradient-Beam-Web-Ent']").then((elm) => {
        console.log(elm);
        console.log('Bottom gradient element removed.');
        elm.remove()
    });
    waitForElm("[class^='TopGradient-Beam-Web-Ent']").then((elm) => {
        console.log(elm);
        console.log('Top gradient element removed.');
        elm.remove()
    });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}