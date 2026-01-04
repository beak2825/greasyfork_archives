// ==UserScript==
// @name         Prime Gaming hide claimed games
// @namespace    https://github.com/pabli24
// @version      0.12
// @description  Hide claimed games on gaming.amazon.com
// @author       Pabli
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/439573-prime-gaming-hide-claimed-games
// @match        *://gaming.amazon.com/
// @match        *://gaming.amazon.com/home*
// @match        *://gaming.amazon.com/?ingress*
// @icon         https://d2u4zldaqlyj2w.cloudfront.net/b5de57e6-cb6b-4c8e-8461-029f631faee4/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439573/Prime%20Gaming%20hide%20claimed%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/439573/Prime%20Gaming%20hide%20claimed%20games.meta.js
// ==/UserScript==

// UserStyle version with more futures https://userstyles.world/style/9719/prime-gaming-hide-claimed-games

(function() {

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            const claimed = document.querySelectorAll('.offer-list__content__grid>.tw-block');
            claimed.forEach(claimed => {
                const collectedBtn = claimed.querySelector('.tw-c-text-alert-success');
                if (collectedBtn) {
                    claimed.remove();
                }
            });
        }
    });
});
observer.observe(document.getElementById("root"), { childList: true, subtree: true });

GM_addStyle(`
.home > .tw-flex > .tw-placeholder-wrapper,
.prime-root-minimal__alert__container,
.featured-content-banner,
.featured-content-shoveler,
.featured-content,
[data-a-target="offer-section-TOP_PICKS"],
[data-a-target="offer-section-FGWP"],
[data-a-target="offer-section-EXPIRING"],
[data-a-target="offer-section-RECOMMENDED"],
[data-a-target="offer-section-WEB_GAMES"],
.event-container,
.tw-placeholder-wrapper,
.offer-list__content .swiper-button,
.sub-credit-promotion-banner {
    display: none !important
}
`);

})();