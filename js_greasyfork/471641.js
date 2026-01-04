// ==UserScript==
// @name         =w=
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  =w= to replace x
// @author       You
// @match        https://*.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471641/%3Dw%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/471641/%3Dw%3D.meta.js
// ==/UserScript==

(function() {
    setInterval(() => {
        document.querySelector("[aria-label = \"Twitter\"]").innerHTML = `<a href="/home" aria-label="Twitter" role="link" class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1niwhzg r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1loqt21 r-19yznuf r-64el8z r-1ny4l3l r-o7ynqc r-6416eg r-lrvibr" style=""><div dir="ltr" class="css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0" style="color: rgb(239, 243, 244);"><span class="css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-1inkyih r-rjixqe r-bcqeeo r-qvutc0">=w=</span></div></a>`;
    }, 25);
})();