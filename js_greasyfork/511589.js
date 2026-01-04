// ==UserScript==
// @name         GAMES4U.ORG Quick Access Button for Steam
// @version      1.0
// @description  Instantly access GAMES4U.ORG for game-related information and resources directly from Steam's purchase section.
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        GM_xmlhttpRequest
// @homepageURL https://greasyfork.org/en/scripts/511589-games4u-org-quick-access-button-for-steam
// @namespace https://greasyfork.org/users/1290286
// @downloadURL https://update.greasyfork.org/scripts/511589/GAMES4UORG%20Quick%20Access%20Button%20for%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/511589/GAMES4UORG%20Quick%20Access%20Button%20for%20Steam.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const headerEl = document.querySelector('.apphub_HeaderStandardTop');
    if (!headerEl) return;

    let itemID = window.location.pathname.split('/')[2];
    let games4uUrl = `https://games4u.org/?s=${itemID}`;

    let el = document.createElement('div');
    el.classList.add('apphub_OtherSiteInfo');
    el.style['margin-left'] = '1rem';

    el.innerHTML = `
    <a class="btnv6_blue_hoverfade btn_medium" href="${games4uUrl}" target="_blank">
        <span>View on GAMES4U.ORG</span>
    </a>
    `;

    const existingEl = document.querySelector('.apphub_OtherSiteInfo');
    if (existingEl) {
        headerEl.insertBefore(el, existingEl);
    } else {
        headerEl.appendChild(el);
    }

})();