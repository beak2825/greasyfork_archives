// ==UserScript==
// @name         Replace Worlds 2024 twitch.tv riotgames channel with caedrel
// @namespace    https://greasyfork.org/en/scripts/511571
// @version      1.2
// @description  Earn lolesports rewards/drops while watching a certain ratking. Only works with the Twitch provider.
// @author       aureliony
// @match        https://lolesports.com/live/worlds/riotgames
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolesports.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511571/Replace%20Worlds%202024%20twitchtv%20riotgames%20channel%20with%20caedrel.user.js
// @updateURL https://update.greasyfork.org/scripts/511571/Replace%20Worlds%202024%20twitchtv%20riotgames%20channel%20with%20caedrel.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function replaceFrames() {
    while (true) {
        // Replace stream window
        let iframe = document.querySelector("#video-player-twitch > iframe");
        if (iframe && iframe.src.indexOf("?channel=riotgames") != -1) {
            iframe.src = iframe.src.replace("?channel=riotgames", "?channel=caedrel");
        }
        // Replace chat window
        let chatEmbed = document.getElementById("riotgames");
        if (chatEmbed && chatEmbed.src.indexOf("embed/riotgames") != -1) {
            chatEmbed.src = chatEmbed.src.replace("embed/riotgames", "embed/caedrel");
        }
        await sleep(250);
    }
}

replaceFrames();
