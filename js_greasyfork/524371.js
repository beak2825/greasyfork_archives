// ==UserScript==
// @name         Max Max
// @namespace    ccn0
// @version      5
// @description  Quality of life changes to Max.com
// @author       CCN0
// @license      MIT
// @match        *://*.hbomax.com/*
// @icon         https://external-content.duckduckgo.com/ip3/www.max.com.ico
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524371/Max%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/524371/Max%20Max.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
    [class^="Title-Beam-Web-Ent"],
    [class^="SeasonEpisode-Beam-Web-Ent"],
    [class^="Subtitle-Beam-Web-Ent"],
    [data-testid^="player-ux-scrubber-timestamp"],
    [data-testid^="player-ux-scrubber-position"] {
        opacity: 0.5;
        user-select: text;
    }

    [data-testid^="player-ux-scrubber-track"] {
        opacity: 0.2;
    }

    [class^="ControlsFooterBottom-Beam-Web-Ent"] {
        margin-bottom: -20px;
        margin-top: -10px;
    }

    [class^="TopGradient-Beam-Web-Ent"],
    [class^="BottomGradient-Beam-Web-Ent"],
    [class^="RatingsAdvisoriesContainer-Beam-Web-Ent"] {
        opacity: 0;
    }

    [class^="SeasonEpisodeSubtitleContainer-Beam-Web-Ent"] {
        height: 10px;
    }
    `);
    function maxMaxMax() {
        var skipbutton = document.querySelector('[data-testid="player-ux-skip-button"]');
        if (skipbutton) {skipbutton.click()};

        function removeElements(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        };


        if (location.href.includes('/video/watch')) {
            const svgbuttons = document.querySelectorAll('svg');
            svgbuttons.forEach(element => {
                element.style.opacity = "0.5";
        });}

        removeElements('[class^="ControlsFooterBottomLeft-Beam-Web-Ent"]');
    };

    setInterval(maxMaxMax,500);
})();
