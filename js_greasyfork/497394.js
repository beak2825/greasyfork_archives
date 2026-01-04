// ==UserScript==
// @name         powerline.io remove annoying names
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  removes annoying names from the leaderboard
// @author       You
// @match        https://powerline.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=powerline.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497394/powerlineio%20remove%20annoying%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/497394/powerlineio%20remove%20annoying%20names.meta.js
// ==/UserScript==






(function() {
    'use strict';

    console.log('running powerline script');

    let headText = document.head.outerHTML;
    let bodyText = document.body.outerHTML;

    bodyText = bodyText.replace('function Ba(a){""==a&&(a="<Unnamed>");return a}',
`function Ba(a) {
    if (a == "" || a.includes('\\ufdfd') || a.includes('\\ua9c5') || a.includes('\\u102a') || a.includes('\\u2e3b')) {
        a = "<Unnamed>";
    }
    return a;
}`);

    const html = document.createElement('html');
    html.innerHTML += headText + bodyText;

    document.write('');
    document.write('<!DOCTYPE html><!--powerline script html loaded-->' + html.outerHTML);
    document.close();
})();