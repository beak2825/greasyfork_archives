// ==UserScript==
// @name         RoJoin
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  (NO LONGER WORKING DUE TO ROBLOX PATCHING) Allows you to join to any player in a Roblox game.
// @author       ryi3r
// @license      MIT
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507063/RoJoin.user.js
// @updateURL https://update.greasyfork.org/scripts/507063/RoJoin.meta.js
// ==/UserScript==
 
/*
The original script was made by PoseidonCoder.
You can find the original script in their Github.
 
The modified version (this script) was made by me, ryi3r.
Hook me up on Discord if you find any issues, my tag is `ryi3r`.
*/
 
"use strict";
 
let isRunning = false;
 
const delay = ms => new Promise(res => setTimeout(res, ms));
 
const getJson = (url, args = {}) => {
    if (!args.headers)
        args.headers = {};
    return fetch(url, args)
        .then((r) => r.json())
        .catch((e) => console.log("error:", e));
};
 
const inst = document.getElementById("running-game-instances-container");
if (inst) {
    const div = document.createElement("div");
    div.classList = "section";
 
    const header = document.createElement("h2");
    header.innerText = "RoJoin 1.1";
    div.appendChild(header);
 
    const img = document.createElement("img");
    img.height = "40";
    img.style = "margin-top: -6px; margin-bottom: 4px;";
    img.style.display = "none";
    div.appendChild(img);
 
    const form = document.createElement("form");
    div.appendChild(form);
 
    const input = document.createElement("input");
    input.classList = "input-field";
    input.placeholder = "Username";
    input.addEventListener("input", (e) => {
        search.disabled = e.target.value.length === 0;
        searchById.disabled = isNaN(e.target.value);
    });
    form.appendChild(input);
 
    const search = document.createElement("button");
    search.classList = "btn-primary-md";
    search.style = "margin-left: 4px;";
    search.innerText = "Search";
    search.disabled = true;
    form.appendChild(search);

    const searchById = document.createElement("button");
    searchById.classList = "btn-primary-md";
    searchById.style = "margin-left: 4px;";
    searchById.innerText = "Search by ID";
    searchById.disabled = true;
    form.appendChild(searchById);
 
 
    const status = document.createElement("p");
    form.appendChild(status);
 
    const join = document.createElement("button");
    join.style.display = "none";
    join.innerText = "Join";
    join.classList = "btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width";
    div.appendChild(join);
 
    const copy = document.createElement("button");
    copy.style = "margin-left: 4px;";
    copy.style.display = "none";
    copy.innerText = "Copy Join Link";
    copy.classList = "btn-control-xs rg-btn btn-primary-md btn-min-width";
    div.appendChild(copy);
 
    inst.insertBefore(div, inst.firstChild);
 
    const placeId = location.href.match(/\d+/)[0];
 
    async function runSearcher(userId, username)
    {
        if (isRunning)
            return;
 
        isRunning = true;
        try {
            join.style.display = "none";
            copy.style.display = "none";
 
            status.innerText = "Loading...";
            
            if (userId === null) {
                try {
                    const profileData = await fetch(`https://www.roblox.com/users/profile?username=${username}`);
                    if (!profileData.ok)
                        throw `User "${input.value}" not found`;
                    userId = profileData.url.match(/\d+/)[0];
                }
                catch (e) {
                    console.log("error:", e);
                    status.innerText = `Error: ${e}`;
                    img.style.display = "none";
                    return;
                }
            }
            const userThumb = (await getJson(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&format=Png&size=150x150`)).data[0].imageUrl;
            img.src = userThumb.split("/").slice(0, -1).join("/") + "/isCircular";
            img.style.display = "";
 
            let cursor = null;
            let found = false;
 
            let serversSearched = 0;
            let serversStatus = "";
 
            while (true) {
                // i'm not sure if there's another api for this, but if not maybe checking the 5 users at a time roblox
                // gives us would not be a bad idea, but it may be really slow...
                // if anyone knows let me know!
                let url = `https://games.roblox.com/v1/games/${placeId}/servers/0?limit=100`;
                if (cursor)
                    url += "&cursor=" + cursor;
                const servers = await getJson(url, {
                    "credentials": "omit", // this may be slower, but will find the player if they're on a public server.
                }).catch(() => null);
 
                if (servers !== undefined && servers.data !== undefined) {
                    for (let i = 0; i < servers.data.length; i++) {
                        const place = servers.data[i];
                        if (!found) {
                            serversSearched++;
                            serversStatus = `Servers searched: ${serversSearched}`;
                            status.innerText = serversStatus;
 
                            console.log(place);
                            if (place.playerTokens.length === 0)
                                return;
 
                            let data;
                            while (true) {
                                let body = [];
 
                                place.playerTokens.forEach((token) => {
                                    body.push({
                                        requestId: `0:${token}:AvatarHeadshot:150x150:png:regular`,
                                        type: "AvatarHeadShot",
                                        targetId: 0,
                                        token,
                                        format: "png",
                                        size: "150x150",
                                    });
                                });
                                try {
                                    data = await getJson("https://thumbnails.roblox.com/v1/batch", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Accept: "application/json",
                                        },
                                        body: JSON.stringify(body),
                                    });
                                    break;
                                } catch (e) {
                                    console.log("Error:", e);
                                    await delay(1000);
                                }
                            }
                            if (!data.data)
                                status.innerText = "Error: " + data;
                            else {
                                for (let k = 0; k < data.data.length; k++) {
                                    const thumb = data.data[k];
                                    if (thumb && thumb.imageUrl === userThumb) {
                                        found = true;
 
                                        status.innerText = `User found\n${serversStatus}\n${place.playing} of ${place.maxPlayers} people max`;
                                        join.style.display = "";
                                        join.onclick = () => {
                                            window.Roblox.GameLauncher.joinGameInstance(
                                                placeId,
                                                place.id,
                                            );
                                        };
                                        copy.style.display = "";
                                        copy.onclick = () => {
                                            copy.innerText = "Copied!";
                                            navigator.clipboard.writeText(`https://www.roblox.com/games/start?placeId=${placeId}&gameId=${place.id}`).finally(() => {
                                                delay(1000).then(() => {
                                                    copy.innerText = "Copy Join Link";
                                                });
                                            });
                                        };
                                        break;
                                    }
                                }
                            }
                        } else
                            break;
                    }
 
                    cursor = servers.nextPageCursor;
                    if (!cursor || found)
                        break;
                    else {
                        let amount = 5;
                        while (amount > 0) {
                            let secDef = "seconds";
                            if (amount === 1)
                                secDef = "second";
                            status.innerText = `Waiting ${amount} ${secDef}...\n${serversStatus}`;
                            amount--;
                            await delay(1000);
                        }
                        status.innerText = `Continuing...\n${serversStatus}`;
                    }
                } else
                    await delay(1000); // Probably got rate limited...
            }
 
            if (!found)
                status.innerText = `User not found within the checked servers\n${serversStatus}`;
        } finally {
            isRunning = false;
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
 
        //console.log(event);
        if (event.submitter.innerText === "Search by ID")
            await runSearcher(input.value, null);
        else
            await runSearcher(null, input.value);
    });
}