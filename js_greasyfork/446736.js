// ==UserScript==
// @name         Remove "More Tweets" on Twitter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the "More Tweets" section on Twitter when opening a tweet from an external source. Also shows all replies by default (no "Show more replies" button).
// @author       Nish
// @match        twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gladly.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446736/Remove%20%22More%20Tweets%22%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/446736/Remove%20%22More%20Tweets%22%20on%20Twitter.meta.js
// ==/UserScript==

if(window.localStorage) {
    if(!localStorage.getItem('moreTweetsReload')) {
        localStorage.setItem('moreTweetsReload', true);
        console.log(localStorage.getItem('moreTweetsReload'));
        window.location.replace(location.origin + location.pathname);
    }
    else {
        localStorage.removeItem('moreTweetsReload');
    }
}