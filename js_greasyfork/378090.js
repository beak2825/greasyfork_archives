// ==UserScript==
// @name         Tweetdeck: Wider Columns
// @version      1.01
// @description  Exactly what it says on the tin.
// @author       twitter.com/RotomDex
// @namespace    https://greasyfork.org/users/248719
// @match        http://*tweetdeck.twitter.com/*
// @match        https://*tweetdeck.twitter.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/378090/Tweetdeck%3A%20Wider%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/378090/Tweetdeck%3A%20Wider%20Columns.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)}

addGlobalStyle('.is-wide-columns .column{width:420px !important;}'); //adjust width:##px to however wide you want the columns