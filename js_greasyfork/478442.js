// ==UserScript==
// @name         Backloggery-Exporter
// @namespace    https://backloggery.com/
// @version      1.2
// @description  Export game data from Backloggery
// @author       xdpirate
// @license      GPLv3
// @match        https://backloggery.com/games.php?user=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backloggery.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478442/Backloggery-Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/478442/Backloggery-Exporter.meta.js
// ==/UserScript==

function exportGames(exportType) {
    let gameElements = document.querySelectorAll("section.gamebox");
    let games = [];

    for(let i = 0; i < gameElements.length; i++) {
        if(!gameElements[i].classList.contains("systemend")) {
            let game = {};

            // game.name - Name of the game
            game.name = gameElements[i].querySelector("h2 > b").innerText;

            if(!game.name.includes("▲")) { // Skip if it's a compilation box without a game attached
                // game.compilation - Game compilation
                if(gameElements[i].parentNode.id.startsWith("comp")) {
                    game.compilation = gameElements[i].parentNode.closest("section.gamebox").querySelector("h2 > b").innerText.replace("▲","").trim();
                } else if(gameElements[i].querySelector("h2 > b + span[id^=arrow]")) {
                    game.compilation = game.name;
                } else {
                    game.compilation = "undefined";
                }

                // game.system - Platform/game console the game is on
                game.system = gameElements[i].querySelector("div.gamerow > b").innerText;
                
                // game.originalSystem - Platform/console the game originally appeared on
                if(game.system.includes("(")) {
                    game.originalSystem = game.system.match(/\((.+)\)/)[1];
                    game.system = game.system.match(/(.+) \(.+/)[1];
                } else {
                    game.originalSystem = "undefined";
                }
                
                // game.region - The game's region
                if(gameElements[i].querySelector("h2 > b + img[class=lift]")) {
                    game.region = gameElements[i].querySelector("h2 > b + img[class=lift]").title;
                } else {
                    game.region = "default";
                }

                // game.ownership - Ownership status of the game
                let ownershipElem = gameElements[i].querySelector("div.gamerow > img[src*=own_]");
                if(ownershipElem) {
                    if(ownershipElem.src.includes("own_other.gif")) {
                        game.ownership = "Other";
                    } else {
                        game.ownership = gameElements[i].querySelector("div.gamerow > img[src*=own_]").title;
                    }
                } else {
                    game.ownership = "Owned";
                }

                // game.status - Completion status of the game
                let status = gameElements[i].querySelector(`h2 > a[href*="games.php"] > img`).alt;
                if(status == "(-)") {
                    game.status = "Null";
                } else if(status == "(C)") {
                    game.status = "Completed";
                } else if(status == "(B)") {
                    game.status = "Beaten";
                } else if(status == "(U)") {
                    game.status = "Unfinished";
                } else if(status == "(M)") {
                    game.status = "Mastered";
                } else if(status == "(u)") {
                    game.status = "Unplayed";
                }

                // game.achievementsEarned - Achievements earned
                // game.achievementsTotal - Achievements total
                let achiElement = gameElements[i].querySelector("div.gamerow > span.info > img[src*=ribbon]");
                if(achiElement) {
                    game.achievementsEarned = achiElement.nextElementSibling.innerText.match(/Achievements: ([0-9]+) \/ [0-9]+/)[1];
                    game.achievementsTotal = achiElement.nextElementSibling.innerText.match(/Achievements: [0-9]+ \/ ([0-9]+)/)[1];
                } else {
                    game.achievementsEarned = "undefined";
                    game.achievementsTotal = "undefined";
                }

                // game.onlineInfo - Online info for the game
                let onlineElem = gameElements[i].querySelector("div.gamerow > span.info > img[src*=online_info]");
                if(onlineElem) {
                    game.onlineInfo = onlineElem.nextElementSibling.innerText;
                } else {
                    game.onlineInfo = "undefined";
                }

                // game.progressNote - Progress note string for the game
                let progNoteElem = gameElements[i].querySelector("div.gamerow:nth-of-type(2)");
                if(progNoteElem) {
                    game.progressNote = progNoteElem.innerText;
                } else {
                    game.progressNote = "undefined";
                }

                // game.rating - Star rating of the game on a 5-point scale
                let ratingElem = gameElements[i].querySelector("div.gamerow > img.lift[src*=stars]");
                if(ratingElem) {
                    if(ratingElem.src.includes("1_5stars.gif")) {
                        game.rating = "1";
                    } else if(ratingElem.src.includes("2_5stars.gif")) {
                        game.rating = "2";
                    } else if(ratingElem.src.includes("3_5stars.gif")) {
                        game.rating = "3";
                    } else if(ratingElem.src.includes("4_5stars.gif")) {
                        game.rating = "4";
                    } else if(ratingElem.src.includes("5_5stars.gif")) {
                        game.rating = "5";
                    }
                } else {
                    game.rating = "undefined";
                }

                // game.comments - Extended comments on a game
                let commentsElem = gameElements[i].querySelector("div.gamerow[id^=comments]");
                if(commentsElem) {
                    game.comments = commentsElem.innerText;
                } else {
                    game.comments = "undefined";
                }

                // game.nowPlaying - Whether the game is marked as now playing
                if(gameElements[i].classList.contains("nowplaying")) {
                    game.nowPlaying = true;
                } else {
                    game.nowPlaying = false;
                }

                console.log(game);
                games.push(game);
            }
        }
    }

    let element = document.createElement('a');
    if(exportType == "json") {
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(games)));
    } else if(exportType == "csv") {
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSONtoCSV(games)));
    }

    element.setAttribute("download", `${GM_info.script.name}-${Date.now()}.${exportType}`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function JSONtoCSV(jsonData) {
    const jsonKeys = [];
    for (const key in jsonData[0]) {
        jsonKeys.push(key);
    }
    var json2CSV = jsonKeys.join(',') + '\n';

    for (var i = 0; i < jsonData.length; i++) {
        var row = '';
        for(const key of jsonKeys) {
            if (row !== '') {
                row += ',';
            }
            row += "\"" + String(jsonData[i][key]).replaceAll("\"","\"\"") + "\"";
        }
        json2CSV += row + '\n';
    }

    return json2CSV;
}

async function expandComps() {
    let openers = document.querySelectorAll("span.lessmore");

    for(let i = 0; i < openers.length; i++) { 
        openers[i].click();
        let percentage = Math.floor(((i+1)/openers.length)*100);
        document.querySelector("#spanProgress").innerText = `${percentage}% (${i+1}/${openers.length})`;
        document.querySelector("#progbar").value = percentage;
        await new Promise(r => setTimeout(r, 500));
    }

    document.querySelector("#loadingBar").style.display = "none";
    document.querySelector("#divExportBtns").style.display = "block";
}

window.setTimeout(function() {
    let exporterDiv = document.createElement("div");
    exporterDiv.innerHTML = `
        <div style="border: 1px solid; border-radius: 10px; padding: 10px; margin: 10px;">
            <b>Backloggery Exporter</b><br />
            <div id="divExportBtns" style="display: none;">
                <input type="button" value="Export as JSON" id="btnExportJSON" name="btnExportJSON" /> 
                <input type="button" value="Export as CSV" id="btnExportCSV" name="btnExportCSV" />
            </div>
            <div id="loadingBar">
                Expanding compilations, please wait...<br />
                <span id="spanProgress">0%</span><br />
                <progress id="progbar" max="100">
            </div>
        </div>
    `;
    document.querySelector("#intro").insertAdjacentElement("beforeend", exporterDiv);

    document.querySelector("#btnExportJSON").onclick = function() {
        exportGames("json");
    };
    
    document.querySelector("#btnExportCSV").onclick = function() {
        exportGames("csv");
    };

    expandComps();
}, 1500);
