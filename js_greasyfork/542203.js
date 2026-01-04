// ==UserScript==
// @name         FMP NT Seacher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NT seacher filiter
// @match        https://footballmanagerproject.com/Matches/LeagueTransfers?leagueid=*
// @match        https://www.footballmanagerproject.com/Matches/LeagueTransfers?leagueid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542203/FMP%20NT%20Seacher.user.js
// @updateURL https://update.greasyfork.org/scripts/542203/FMP%20NT%20Seacher.meta.js
// ==/UserScript==

const div = document.getElementById("seasonSelectorDiv");
const button = document.createElement("button");
button.className = 'btn btn-primary w-200';
button.textContent = "筛选";
button.addEventListener("click", () => only_show('cn',140));
div.appendChild(button);

function only_show(nation_code,rating_limit){
    const table = document.getElementById("trxList");
    const tabletr = table.getElementsByTagName("tr");
    const ids = new Set();
    for (let i = 1; i < tabletr.length; i++) {
        const secondTd = tabletr[i].cells[1];
        if (secondTd) {
            const img = secondTd.querySelector("img");
            if (img) {
                const county_png=img.src.split("/")[5];
                const county=county_png.split(".")[0];
                if (county !== nation_code) {
                    tabletr[i].style.display = "none";
                }
                else {
                    if (ids.has(tabletr[i].id)) {
                        tabletr[i].style.display = "none";
                    } else {
                        ids.add(tabletr[i].id);
                        const id = parseInt(tabletr[i].id.replace(/\D+/g, ""), 10);
                        $.ajax({
                            "url": "/Players/GetTooltipData",
                            type: "GET",
                            data: {
                                refid: "td"+id,
                                playerid: id
                            },
                            success: function (result) {
                                if(result.playerTooltipData.rating<rating_limit){
                                    tabletr[i].style.display = "none";
                                }
                                else{
                                    tabletr[i].cells[2].children[0].title=result.playerTooltipData.rating;
                                }
                            },
                            error: function (xhr, resp, text) {
                                console.log(xhr, resp, text);
                            }
                        });
                    }
                }
            }
        }
    }
}
