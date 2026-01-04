// ==UserScript==
// @name         Steam Price Trackers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416934/Steam%20Price%20Trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/416934/Steam%20Price%20Trackers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const appName = document.querySelector('.apphub_AppName').textContent;
    const appNameEncoded = encodeURIComponent(appName).replace(/%20/g, '+');

    const appId = location.href.match(/https:\/\/store\.steampowered\.com\/app\/(\d+)\//)[1];

    const priceTrackerNode = document.createElement('template');
    const priceTrackerHtml = `
        <div class="price_trackers">
            <div class="block responsive_apppage_details_left">
                <a class="btnv6_blue_hoverfade btn_medium" target="_blank" href="https://www.steamprices.com/cn/app/${appId}" style="display: block; margin-bottom: 6px;">
                    <span>SteamPrices</span>
                </a>
                <a class="btnv6_blue_hoverfade btn_medium" target="_blank" href="https://isthereanydeal.com/search/?q=${appNameEncoded}" style="display: block; margin-bottom: 6px;">
                    <span>IsThereAnyDeal</span>
                </a>
            </div>
        </div>
    `;
    priceTrackerNode.innerHTML = priceTrackerHtml.trim();

    const gameMetaData = document.querySelector('.game_meta_data');
    gameMetaData.insertBefore(priceTrackerNode.content.firstChild, gameMetaData.firstChild);
})();
