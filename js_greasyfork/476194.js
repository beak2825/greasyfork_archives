// ==UserScript==
// @name         fandom redirector
// @namespace    https://miigon.net
// @version      0.3
// @license      public domain
// @description  redirects some fandom sites (minecraft, terraria, pathofexile, yugioh,etc) to their corresponding replacement site.
// @author       Miigon
// @match        https://terraria.fandom.com/*
// @match        https://minecraft.fandom.com/*
// @match        https://pathofexile.fandom.com/*
// @match        https://yugioh.fandom.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476194/fandom%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/476194/fandom%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const replacement_rules = {
        "terraria.fandom.com": "terraria.wiki.gg",
        "minecraft.fandom.com/wiki/": "minecraft.wiki/w/",
        "minecraft.fandom.com": "minecraft.wiki",
        // "phoenixsc": "peenixsc",
        "pathofexile.fandom.com": "poewiki.net",
        "yugioh.fandom.com": "yugipedia.com",
    };
    let href = window.location.href;
    let og_href = href;
    for (const [key, value] of Object.entries(replacement_rules)){
        href = href.replace(key, value);
    }
    if(href != og_href) window.location.href = href;
})();