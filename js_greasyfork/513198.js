// Created by depso 😼
// This plugin allows UWP to be launched from the Roblox website

// [🎇] Please install TamperMonkey in-order to run this extension
// https://www.tampermonkey.net/


// ==UserScript==
// @name         UWP for the Roblox website
// @version      1.0
// @description  Launch the UWP version of Roblox instead of the web version
// @author       Depso
// @match        https://*.roblox.com/*
// @match        https://roblox.com/*
// @icon         https://cdn.discordapp.com/avatars/1085827557410209832/a73faa8fc4865cbb14a5bb72f95d5e3d.webp?size=80
// @license      MIT
// @run-at       document-start
// @grant        GM_xmlhttpRequest

// @namespace https://greasyfork.org/users/1383225
// @downloadURL https://update.greasyfork.org/scripts/513198/UWP%20for%20the%20Roblox%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/513198/UWP%20for%20the%20Roblox%20website.meta.js
// ==/UserScript==

const Protocall = "roblox://experiences/start";

// roblox-player:// - Web protocall
// roblox:// - UWP protocall
// robloxmobile:// - Mobile protocall


const GameJoin = function(placeId) {
    window.location.href = `${Protocall}?placeId=${placeId}`;
};
const JoinGameServer = function(placeId, gameId) {
    window.location = `${Protocall}?placeId=${placeId}&gameInstanceId=${gameId}`;
};
const JoinPrivateGame = function(placeId, accessCode, linkCode) {
    window.location = `${Protocall}?placeId=${placeId}&accessCode=${accessCode}&linkCode=${linkCode}`;
};
const FollowUserToExperience = function(userId) {
    //window.location.href = `${Protocall}?userId=${userId}`;

    GM_xmlhttpRequest({
        method: "POST",
        url: `https://presence.roblox.com/v1/presence/users`,
        responseType: "json",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "userIds": [userId]
        }),
        onload: function(res) {
            const json = res.response.userPresences[0]
            const placeId = json.placeId;
            const jobId = json.gameId;
            JoinGameServer(placeId,jobId)
        }
    });
};

(async () => {
    'use strict';

    while (typeof(Roblox) == "undefined" || typeof(Roblox.GameLauncher) == "undefined") {
        await new Promise(resolve => setTimeout(resolve))
    };

    Roblox.GameLauncher.joinMultiplayerGame = GameJoin;
    Roblox.GameLauncher.followPlayerIntoGame = FollowUserToExperience;
    Roblox.GameLauncher.joinGameInstance = JoinGameServer;
    Roblox.GameLauncher.joinPrivateGame = JoinPrivateGame;
})()