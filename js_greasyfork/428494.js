// ==UserScript==
// @name         AddOpenSteamButton
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  add SteamOpenButton to steam app page
// @author       KBT
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428494/AddOpenSteamButton.user.js
// @updateURL https://update.greasyfork.org/scripts/428494/AddOpenSteamButton.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // javascript:location='steam://openurl/'+location

    function addOpenSteamButton() {
      const anchor = makeOpenSteamButton();
      setOpenSteamButton(anchor);
    }

    function makeOpenSteamButton() {
        const anchor = document.createElement('a');
        anchor.className = 'btnv6_blue_hoverfade btn_medium'
        anchor.href = 'steam://openurl/' + location;
        const aSpan = document.createElement('span');
        aSpan.textContent = "Steamで開く";

        anchor.appendChild(aSpan);
        return anchor;
    }

    function setOpenSteamButton(element) {
        const infoElement = document.querySelector('.apphub_OtherSiteInfo');
        if(!infoElement) {
            console.error('info not found.')
            return;
        };
        infoElement.insertBefore(element, infoElement.firstChild);
    }

    addOpenSteamButton();
})();