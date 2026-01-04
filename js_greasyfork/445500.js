// ==UserScript==
// @name         YouTube Hidden Tag Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display hidden tags above Video's title
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/445500/YouTube%20Hidden%20Tag%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/445500/YouTube%20Hidden%20Tag%20Viewer.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

var timer_id;

const get_tags = () => {
    const tags = [];
    document.querySelectorAll('meta[property="og:video:tag"]').forEach(
        x=>tags.push(x.content)
    );
    return tags;
};

const main = () => {
    const tag_area = document.getElementById("super-title");
    if(tag_area !== null) {
        clearInterval(timer_id);
        const tags = get_tags();
        const tag_elm = document.createElement('p');
        tag_elm.textContent = `tags: [${tags.join(", ")}]`;
        tag_area.appendChild(tag_elm);
    }
};

window.addEventListener('load', function() {
    timer_id = setInterval(main, 1000);
}, false);
