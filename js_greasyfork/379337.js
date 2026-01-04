// ==UserScript==
// @name         Hide GOG heroes
// @description  Hide hero images from the redesigned GOG game pages. Puts the price box back in the old place. This changes should make the desktop browsing experience more pleasant.
// @namespace    https://github.com/BattleMage
// @homepageURL  https://github.com/BattleMage/gog-anti-hero
// @version      0.3
// @author       BattleMage
// @match        https://www.gog.com/game/*
// @match        https://www.gog.com/*/game/*
// @grant        GM_addStyle
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/379337/Hide%20GOG%20heroes.user.js
// @updateURL https://update.greasyfork.org/scripts/379337/Hide%20GOG%20heroes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.productcard-player {display:none;}');
    GM_addStyle('.product-actions {position: relative; width: auto; right: auto;}');
    GM_addStyle('@media (min-width: 737px) { .productcard-basics {padding-top: 65px;} }');

    let productPrice = document.querySelector('div.product-actions.hide-when-content-is-expanded[product-actions]');
    let sideColumn = document.getElementsByClassName('layout-side-col')[0];
    let whyGog = sideColumn.getElementsByClassName('why-gog')[0];
    let summarySection = document.getElementsByClassName('layout-side-col')[0].getElementsByClassName('content-summary-section')[0];
    sideColumn.insertBefore(
        productPrice,
        whyGog
    );
})();
