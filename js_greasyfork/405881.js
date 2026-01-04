// ==UserScript==
// @name         Auto-WikiLang (AWL)
// @namespace    http://www.greasyfork.org/
// @version      0.5.1
// @description  An automatic wikipedia language changer! Auto-WikiLang (AWL) is a small script that automatically changes wikipedia's and wiktionary's language to your language. If you have any errors or suggestions, please contact me at cyanide711(at)gmail(dot)com
// @author       Jack Gaynor

// @match        https://*.wikipedia.org/*
// @exclude      https://en.wikipedia.org/*
// Change the above to fit your language

// @match        https://*.wiktionary.org/*
// @exclude      https://en.wiktionary.org/*
// Change the above to fit your language

// Now works with wiktionary!

// @grant        none
// @icon         https://i.imgur.com/A75OqHr.png
// @downloadURL https://update.greasyfork.org/scripts/405881/Auto-WikiLang%20%28AWL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405881/Auto-WikiLang%20%28AWL%29.meta.js
// ==/UserScript==

if (location.hostname.includes("wikipedia.org")){
    location.hostname = "en.wikipedia.org"; //change me to your language
}
if (location.hostname.includes("wiktionary.org")){
    location.hostname = "en.wiktionary.org"; //change me to your language
}