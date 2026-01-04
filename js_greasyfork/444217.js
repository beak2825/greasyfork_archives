// ==UserScript==
// @name         Google Meet Auto Join
// @description  Join Google Meet automatically!
// @homepage     https://braunson.ca
// @namespace    https://braunson.ca
// @version      1.0
// @license      MIT
// @author       Braunson Yager
// @match        *://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=meet.google.com
// @namespace    https://greasyfork.org/users/867326
// @grant        none
// @run-at       documet-end
// @downloadURL https://update.greasyfork.org/scripts/444217/Google%20Meet%20Auto%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/444217/Google%20Meet%20Auto%20Join.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addEventListener("load",function () {
        var elements = document.querySelectorAll("[data-is-muted=false][role]");
        if (elements.length === 0) return;
        elements.forEach(function(el) {
            console.log(el);
            el.click();
        });
        setInterval(function() {
            let spans = document.getElementsByTagName('span');
            for (let span of spans) {
                if (span.innerText === 'Join now') {
                    span.click();
                }
            }
        }, 1E3); // 1000
    });
})();