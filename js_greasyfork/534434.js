// ==UserScript==
// @name         Steam - Add SteamDB Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a link to SteamDB on the game page in Steam
// @author       k3kzia
// @match        https://store.steampowered.com/app/*
// @icon         https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534434/Steam%20-%20Add%20SteamDB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/534434/Steam%20-%20Add%20SteamDB%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const appIdMatch = url.match(/\/app\/(\d+)/);
    if (!appIdMatch) return;

    const appId = appIdMatch[1];
    const steamDbUrl = `https://steamdb.info/app/${appId}/`;

    function createSteamDbLink() {
        const link = document.createElement('a');
        link.className = 'linkbar';
        link.href = steamDbUrl;
        link.target = '_blank';
        link.rel = 'noreferrer noopener';
        link.innerHTML = 'SteamDB <img src="https://store.cloudflare.steamstatic.com/public/images/v5/ico_external_link.gif" border="0" align="bottom">';
        return link;
    }

    const detailsBlock = document.querySelector('.details_block[style="padding-top: 14px;"]');
    if (detailsBlock) {
        detailsBlock.appendChild(document.createElement('br'));
        detailsBlock.appendChild(createSteamDbLink());
    }

    const errorBox = document.getElementById('error_box');
    if (errorBox) {
        const linkContainer = document.createElement('div');
        linkContainer.style.marginTop = '15px';
        linkContainer.style.textAlign = 'center';

        const steamDbLink = createSteamDbLink();
        steamDbLink.style.display = 'inline-block';
        steamDbLink.style.margin = '10px 0';

        linkContainer.appendChild(steamDbLink);
        errorBox.appendChild(linkContainer);

        const style = document.createElement('style');
        style.textContent = `
            #error_box a.linkbar {
                color: #67c1f5;
                text-decoration: none;
            }
            #error_box a.linkbar:hover {
                color: #fff;
            }
        `;
        document.head.appendChild(style);
    }
})();