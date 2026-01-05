// ==UserScript==
// @name         Kiss Cartoon/Anime Adblock Fixer
// @namespace    https://twitter.com/Grimmdev
// @version      1.0
// @description  Kiss Cartoon/Anime doesn't like adblock, so we fix that and make them like it!
// @author       Sean Loper
// @match        http://kissanime.com/*
// @match        http://kisscartoon.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10735/Kiss%20CartoonAnime%20Adblock%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/10735/Kiss%20CartoonAnime%20Adblock%20Fixer.meta.js
// ==/UserScript==

isBlockAds2 = false;
isBlockAds = false;

$(function () {
    setTimeout(FixBlock(), 1000);
});

function FixBlock()
{
    isBlockAds = false;
    isBlockAds2 = false;
}