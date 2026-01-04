// ==UserScript==
// @name         Prevent Notion from opening two windows with one click
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Not sure if it's my own problem or if it's a bug in Notion, in Board view mode if any URL properties are displayed and clicking on them opens two pages with the same address in the browser.
// @author       Dylan
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.notion.so
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452210/Prevent%20Notion%20from%20opening%20two%20windows%20with%20one%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/452210/Prevent%20Notion%20from%20opening%20two%20windows%20with%20one%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastSeconds = -1;
    let lastTargets = []

    document.addEventListener('click', function(event) {
        if (event.target.tagName == 'A' && "href" in event.target.attributes) {
            let href = event.target.attributes.href.value;
            let seconds = new Date().getSeconds();

            if (seconds == lastSeconds) {
                if (lastTargets.includes(href)) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    lastTargets.push(href);
                }
            } else {
                lastSeconds = seconds;

                if (event.target.tagName == 'A') {
                    lastTargets = [href]
                }
            }
        }

    }, true);
})();