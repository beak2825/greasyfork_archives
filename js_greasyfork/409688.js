// ==UserScript==
// @name         Add All-Good Buttons into YouTube
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  [WIP][!!!NOT WORKING!!!]Add a button which push all good buttons of a video and comments at once
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/409688/Add%20All-Good%20Buttons%20into%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/409688/Add%20All-Good%20Buttons%20into%20YouTube.meta.js
// ==/UserScript==

var D = document;

// create button
var btn = D.createElement('button');
btn.type = 'button';
btn.onclick = function() {
    D.getElementsByClassName(
        "style-scope ytd-toggle-button-renderer " +
        "style-text"
    )[0].click();
    a = D.getElementsByClassName(
        "style-scope ytd-toggle-button-renderer " +
        "style-default-active size-default"
    );
    for(var i = 0; a.length > i ; i++ ){ a[i].click() }
};
btn.appendChild(D.createTextNode('Push All'));

// add button
D.getElementsByClassName(
    "style-scope ytd-video-primary-info-renderer"
)[0].appendChild(btn);