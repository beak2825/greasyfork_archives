// ==UserScript==
// @name        [Recommended] Roblox's cleanest designed game filter
// @namespace   Made for fun, thought people would like it, so here ya go :D
// @license GNU GPLv3
// @match       *://*.roblox.com/*
// @grant       none
// @version     2.0
// @author      Lexi the elf (greasy fork)
// @description Automatically filters and removes roblox games containing certain phrases or words. (By default is set to RNG game's)
// @downloadURL https://update.greasyfork.org/scripts/493506/%5BRecommended%5D%20Roblox%27s%20cleanest%20designed%20game%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/493506/%5BRecommended%5D%20Roblox%27s%20cleanest%20designed%20game%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function replaceElements() {
        const targetStrings = ["RNG"];
        const selector = targetStrings.map(str => `img[alt*="${str}" i], img[title*="${str}" i]`).join(',');
        const elements = document.querySelectorAll(selector);
        elements.forEach(img => {
            const aParent = img.closest('a.game-card-link');
            if (aParent) {
                const replacementHTML = `
                    <a class="game-card-link" href="https://www.roblox.com/games/refer?PlaceId=15854820298&amp;Position=1&amp;PageType=Profile">
                        <div class="featured-game-icon-container">
                            <span class="thumbnail-2d-container brief-game-icon">
                                <img class="" src="https://tr.rbxcdn.com/5c89de1a6d50e50f4bb3ffb104a0d595/768/432/Image/Png" alt="content removed" title="content removed">
                            </span>
                        </div>
                        <div class="info-container">
                            <div class="game-card-name game-name-title" title="removed">404 Game Not found</div>
                            <div class="wide-game-tile-metadata">
                                <div class="base-metadata">
                                    <div class="game-card-info" data-testid="game-tile-stats-rating">
                                        <span class="info-label icon-votes-gray"></span>
                                        <span class="info-label vote-percentage-label">removed by script</span>
                                    </div>
                                </div>
                                <div class="hover-metadata"></div>
                            </div>
                        </div>
                    </a>
                `;
                const replacementNode = new DOMParser().parseFromString(replacementHTML, 'text/html').body.firstChild;
                aParent.parentNode.replaceChild(replacementNode, aParent);
            }
        });
    }

    setInterval(replaceElements, 20);
})();