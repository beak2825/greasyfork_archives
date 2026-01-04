// ==UserScript==
// @name         GeoGuessr Duels Avatar Deleter
// @description  Deletes the ending animation screen with the avatars after a duel
// @version      1.0
// @author       Tyow#3742
// @match        *://*.geoguessr.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1011193
// @downloadURL https://update.greasyfork.org/scripts/465740/GeoGuessr%20Duels%20Avatar%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/465740/GeoGuessr%20Duels%20Avatar%20Deleter.meta.js
// ==/UserScript==

const checkGameMode = () => {
	return (location.pathname.startsWith("/duels/"));
}

const checkState = () => {
    if (!checkGameMode()) { return; }
    const gameFinishedAvatarContainer = document.querySelector('.game-finished_avatarContainer__S63IS');
    const lobbyAvatarContainer = document.querySelector('.lobby_avatarContainer__kN2RK');

    if(gameFinishedAvatarContainer) {
	gameFinishedAvatarContainer.remove()
    }
    if (lobbyAvatarContainer) {
        lobbyAvatarContainer.remove()
    }
}

new MutationObserver(async (mutations) => {
    if (!checkGameMode()) { return; }
    checkState();
}).observe(document.body, { subtree: true, childList: true });