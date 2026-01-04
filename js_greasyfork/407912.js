// ==UserScript==
// @name         Twitter Rainbow Stream
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make your Twetter Stream electrifying!
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://twitter.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407912/Twitter%20Rainbow%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/407912/Twitter%20Rainbow%20Stream.meta.js
// ==/UserScript==

function rainbow(selector) {
    const colors = 'to right, red, orange, yellow, green, aqua, blue, purple';
    $(selector).css('cssText', `background: linear-gradient(${colors}) !important`);
}
function selectRainbow() {
    rainbow('body');
    rainbow('div.r-f9dfq4');
    rainbow('div.r-ry3cjt');
    rainbow('div.r-m611by');
    rainbow('div.r-1j3t67a');
    rainbow('div.r-my5ep6');
    rainbow('div.r-my5ep6');
    rainbow('div.r-1h3ijdo');
    rainbow('div.r-1jgb5lz');
    rainbow('div.r-1uu6nss');
    rainbow('div.r-1i9ubto');
    rainbow('a.r-my5ep6');
    rainbow('div.r-e84r5y');
    rainbow('div.r-14lw9ot');
    rainbow('article.r-6416eg');
    rainbow('a.r-6416eg');
    rainbow('div.r-1f1sjgu');
}
setInterval(selectRainbow)