// ==UserScript==
// @name        Show "reminds me of" as percentage on fragrantica
// @namespace   Violentmonkey Scripts
// @match       https://www.fragrantica.com/perfume/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      owittek
// @description 2/6/2025, 8:11:41 PM
// @downloadURL https://update.greasyfork.org/scripts/535459/Show%20%22reminds%20me%20of%22%20as%20percentage%20on%20fragrantica.user.js
// @updateURL https://update.greasyfork.org/scripts/535459/Show%20%22reminds%20me%20of%22%20as%20percentage%20on%20fragrantica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        const remindsMeLikes = document.getElementsByClassName('cell small-12 medium-12 large-12');
        if (remindsMeLikes.length > 0) {
            observer.disconnect();

            for (const likeBox of remindsMeLikes) {
                const { children } = likeBox;

                const [likes, dislikes] = [...children].map((child) => +child.innerText);

                const clonedNode = children[0].cloneNode(true);
                likeBox.prepend(clonedNode);

                const percentageSpan = children[1].querySelector(".num-votes-sp span");

                if (percentageSpan) {
                    percentageSpan.style = "font-size: 0.61rem;";
                    percentageSpan.innerText = `${(likes/(likes + dislikes) * 100).toFixed(2)}`;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
