// ==UserScript==
// @name Twitch helper
// @icon https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @description Auto claim bonus and automatically restart the player if an error occurs
// @author Murka
// @version 0.4
// @match *://www.twitch.tv/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/445835/Twitch%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445835/Twitch%20helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {

    const getReload = () => {
        try {
            const button = document.querySelector("[data-a-target='player-overlay-content-gate']").children[2].firstChild;
            if (button.firstChild.children.length === 2) return button;
        } catch(err) {}
    }

    const getBonus = () => {
        try {
            return document.querySelector("div[class*='claimable-bonus__icon']").parentElement.parentElement.parentElement;
        } catch(err) {}
    }

    setInterval(() => {
        const bonus = getBonus();
		const reloadPlayer = getReload();
		if (bonus) bonus.click();
		if (reloadPlayer) reloadPlayer.click();
    }, 500);

})();