// ==UserScript==
// @name         Remove gmail left app bar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  In March 2022, Google added a new left column in gmail for apps. If you'd like to hide that column, use this script.
// @author       You
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441561/Remove%20gmail%20left%20app%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/441561/Remove%20gmail%20left%20app%20bar.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
/* Folder column: Make less wide. Previous setting was 256px. Please change the width to your liking. */
addGlobalStyle('.aqn { min-width: 156px!important; }');

/* Folder column: remove padding */
addGlobalStyle('.at9 { padding-right:0!important; padding-left:0!important; margin-right:0!important; margin-left:0!important; }');
addGlobalStyle('.aib { padding-left:0!important; margin-left:0!important; }');

/* Left app column: hide */
addGlobalStyle('div.aeN { display:none; }');

/* Left app column for Google Chat: show */
/* The column now shows up, but the names of the people are hidden. Ugh. */
addGlobalStyle('div.aeN.WR.anZ.nH.oy8Mbf.nn { display:block; }');