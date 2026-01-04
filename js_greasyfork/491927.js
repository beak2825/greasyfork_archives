// ==UserScript==
// @name        Join Game Button
// @namespace   Violentmonkey Scripts
// @match       https://solario.lol/users/*/profile
// @grant       none
// @version     1.0
// @author      script
// @description Add's a "Join Game" button to users' profiles.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491927/Join%20Game%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491927/Join%20Game%20Button.meta.js
// ==/UserScript==

if (document.querySelector("#main > div > div.row.mb-2 > div.col-md-7.d-flex > div.image-container > div").classList.contains("status-icon-green")) {
    const parser = new DOMParser();

    const joinButton = document.createElement("button");
    joinButton.className = "btn btn-success gamelaunch-btn me-2 text-white";
    joinButton.innerText = "Join Game";
    document.querySelector("#main > div > div.row.mb-2 > div.col-md-5 > div > div.d-flex.justify-content-end.me-3.mt-4").prepend(joinButton)

    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `<div class="position-absolute w-100 h-100 justify-content-center align-items-center" id="transparent-background-top" style="top: 0;left: 0;background-color: rgba(0,0,0,0.5);display: none;">
        <div class="m-auto rounded-2 p-2 position-relative" style="background-color: rgb(30,30,30); box-shadow: 0 0 10px #333333; min-width: 400px; min-height: 255px; ">
            <div class="d-flex w-100">
                <img src="/static/img/SyntaxLogo.png" width="90px" height="90px" class="ms-auto me-auto" style="margin-top: 46px;">
            </div>
            <div id="launch-loading-bar">
                <p class="m-0 w-100 text-center text-white">Solario is now loading. Get ready to play!</p>
                <div class="ps-2 pe-2">
                <div class="progress mt-2" style="min-height: 20px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>
                </div></div>
            </div>
            <div id="launch-download-btn" style="display: none;">
                <p class="m-0 w-100 text-center text-white">You're moments away from getting into the game!</p>
                <div class="ps-3 pe-3 mt-2">
                    <a class="w-100 btn btn-success text-decoration-none" href="/download">Download and Install Solario</a>
                </div>
            </div>
            <div class="position-absolute" style="top: 10px; right: 10px;">
                <button class="btn btn-close" id="close-launcher-btn"></button>
            </div>
        </div>
    </div>`;
    document.body.appendChild(loadingDiv);

    const backgroundTop = document.getElementById("transparent-background-top");
    const closeButton = document.getElementById("close-launcher-btn");
    const loadingBar = document.getElementById("launch-loading-bar");
    const downloadButton = document.getElementById("launch-download-btn");

    closeButton.addEventListener("click", function() {
        backgroundTop.style.display = "none";
    });
    closeButton.style.display = "none";

    async function getServer(playerId) {
        const response = await fetch("/games");
        const html = await response.text();
        const doc = parser.parseFromString(html, "text/html");
        const games = doc.querySelector("body > div.w-100.ps-4.pe-4.ms-auto.me-auto > div.p-2.w-100.place-card-container").children;
        
        for (const game of games) {
            const playing = parseInt(game.querySelector(":scope > div > div.p-1 > div.d-flex.align-items-center > p").innerText);
            const year = game.querySelector(":scope > div > div.position-relative > div > div").innerText;
            
            if (playing > 0) {
                const gameResponse = await fetch(game.href);
                const gameHtml = await gameResponse.text();
                const gameDoc = parser.parseFromString(gameHtml, "text/html");
                const servers = gameDoc.querySelector("#nav-servers > div.w-100").children;

                for (const server of servers) {
                    const serverData = server.querySelector(":scope > div.d-flex.align-items-center.w-100 > div.ms-auto > button").dataset;
                    serverData.year = year;
                    const ids = Array.from(server.querySelectorAll(":scope > div.d-flex.p-1.mt-2 > a")).map(a => a.href.match("/users/([0-9]+)/")[1]);

                    if (ids.includes(playerId.toString())) {
                        return serverData;
                    }
                }
            }
        }
        return null;
    }

    async function generateAuthTicket() {
        const response = await fetch("/Login/NewAuthTicket", {
            method: "POST"
        });
        return await response.text();
    }

    joinButton.addEventListener("click", async () => {
        const server = await getServer(window.location.href.match("/users/([0-9]+)/")[1]);

        backgroundTop.style.display = "flex";
        loadingBar.style.display = "block";
        downloadButton.style.display = "none";
        closeButton.style.display = "none";

        const placeid = server.placeid;
        const authTicket = await generateAuthTicket();
        const authticket2 = await generateAuthTicket();
        const clientyear = server.year;

        let joinScriptUrl = `https://solario.lol/Game/placelauncher.ashx?placeId=${placeid}&t=${authticket2}`;

        if (clientyear == "2014") {
            joinScriptUrl = `http://solario.lol/game/2014Join.lua?placeId=${placeid}`;
        }
        
        joinScriptUrl += `&jobId=${server.jobid}`;
        
        let needsExtraFowardSlash = false;
        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            if (parseInt(navigator.userAgent.toLowerCase().split("firefox/")[1]) > 121) {
                needsExtraFowardSlash = true;
            }
        }

        window.location.href = `syntax-player://${ needsExtraFowardSlash ? '/' : ''  }1+launchmode:play+gameinfo:${authTicket}+placelauncherurl:${joinScriptUrl}+k:l+clientyear:${clientyear}`

        setTimeout(() => {
            loadingBar.style.display = "none";
            downloadButton.style.display = "block";
            closeButton.style.display = "block";
            setTimeout(() => {
                backgroundTop.style.display = "none";
            }, 6000);
        }, 4000);
    });
}