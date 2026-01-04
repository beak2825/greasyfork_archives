// ==UserScript==
// @name        No political BS on a collaborative open source project that isnt't owned by anyone - 9front.org
// @namespace   Violentmonkey Scripts
// @match       *://9front.org/*
// @match       *://*only9fans.com/*
// @license     MIT-0
// @version     1.1
// @author      xplshn
// @description Makes the 9front.org site more sensible and usable
// @downloadURL https://update.greasyfork.org/scripts/525374/No%20political%20BS%20on%20a%20collaborative%20open%20source%20project%20that%20isnt%27t%20owned%20by%20anyone%20-%209frontorg.user.js
// @updateURL https://update.greasyfork.org/scripts/525374/No%20political%20BS%20on%20a%20collaborative%20open%20source%20project%20that%20isnt%27t%20owned%20by%20anyone%20-%209frontorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the specific <a> elements
    const linksToRemove = [
        "movies/Dead_Kennedys_-Nazi_Punks_Fuck_Off_lyrics.mp4",
        "https://blacklivesmatter.com",
        "https://duckduckgo.com/?t=ffab&q=From+the+Don+to+the+Dnepr%3A+Soviet+Offensive+Operations%2C+December+1942+-+August+1943",
        "https://www.plannedparenthood.org",
        "https://thebaffler.com/salvos/sans-merci-nathanson",
        "http://plan9.stanleylieber.com/werc/werc-propaganda/jpg/icon03.jpg"
    ];

    linksToRemove.forEach(link => {
        const anchorTags = document.querySelectorAll(`a[href="${link}"]`);
        anchorTags.forEach(anchor => anchor.remove());
    });

    // Change the favicon
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement("link");
    favicon.type = "image/x-icon";
    favicon.rel = "icon";
    favicon.href = "https://plan9.io/plan9/img/plan9bunnysmwhite.jpg";
    document.head.appendChild(favicon);
})();


