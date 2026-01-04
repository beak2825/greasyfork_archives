// ==UserScript==
// @name         WaniKani Burn Celebration
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Turns the background dark grey when you burn an item in WaniKani
// @author       You
// @match        https://www.wanikani.com/subjects/review
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481845/WaniKani%20Burn%20Celebration.user.js
// @updateURL https://update.greasyfork.org/scripts/481845/WaniKani%20Burn%20Celebration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let banner = document.getElementsByClassName("character-header__srs-container")[0];
    let bannerText = document.getElementsByClassName("character-header__srs-text")[0];
    let header = document.getElementsByClassName("character-header")[0];

    let observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
            if (banner.getAttribute("data-hidden") === "false" && mutation.oldValue === "true") {
                // I include both "Burn" and "Burned" here since WaniKani seems inconsistent with which one they use.
                console.log("what?");
                if(bannerText.innerHTML === "Burn" || bannerText.innerHTML === "Burned"){
                    header.style.backgroundImage = "linear-gradient(to bottom, rgb(70, 70, 70), rgb(55, 55, 55))";
                }
            } else if (banner.getAttribute("data-hidden") === "true" && mutation.oldValue === "false") {
                header.style.backgroundImage = "";
            }
        }
    });

    observer.observe(banner, {
        attributeFilter: ["data-hidden"],
        attributeOldValue: true
    });
})();