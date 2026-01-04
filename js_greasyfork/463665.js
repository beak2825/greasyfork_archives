// ==UserScript==
// @name         Auto Like & RT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Like & RT Tweets
// @author       WhySai
// @match        https://twitter.com/intent/like?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463665/Auto%20Like%20%20RT.user.js
// @updateURL https://update.greasyfork.org/scripts/463665/Auto%20Like%20%20RT.meta.js
// ==/UserScript==

function tweet() {
    document.querySelector("[data-testid=like]").click();
    console.log("Liked Tweet");
    document.querySelector("[data-testid=retweet]").click();
    console.log("Clicked Retweet");
    document.querySelector("[data-testid=retweetConfirm]").click();
    console.log("Confirmed Retweet");
}

setTimeout(tweet, 6000);