// ==UserScript==
// @name     	TTR Calculator
// @version  	1.3.1
// @description Zeigt den TTR eines Spielers ohne Premium an
// @author   	CennoxX
// @namespace	https://greasyfork.org/users/21515
// @homepage 	https://github.com/CennoxX/userscripts
// @supportURL  https://github.com/CennoxX/userscripts/issues/new?title=[TTR%20Calculator]%20
// @match    	https://www.mytischtennis.de/*
// @icon     	https://www.google.com/s2/favicons?sz=64&domain=https://www.mytischtennis.de
// @grant window.onurlchange
// @license  	MIT
// @downloadURL https://update.greasyfork.org/scripts/490573/TTR%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/490573/TTR%20Calculator.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* eslint curly: "off" */
/* eslint no-eval: "off" */
/* eslint no-loop-func: "off" */
/* eslint no-return-assign: "off" */
/* eslint indent: "off" */

(async() => {
    document.body.style.zoom = "0.7";
    const qttrIndex = 6;
    const plusMinusIndex = 7;

    if (window.onurlchange === null)
        window.addEventListener("urlchange", async () => { main() });

    main();

    if (location.pathname.includes("rankings/ttr-historie")){
        calculateTtrHistory();
    }

    function calculateTtrHistory(){
        const th = document.querySelectorAll("table thead th")[qttrIndex];
        th.innerHTML = th.innerHTML.replace(/^QTTR$/, "TTR");
        applyCalculationToTable();
        let scheduled = false;
        const observer = new MutationObserver(() => {
            if (!scheduled) {
                scheduled = true;
                requestAnimationFrame(() => { applyCalculationToTable(); scheduled = false });
            }
        });
        observer.observe(document.querySelector("table"), { childList: true, subtree: true });
    }

    function applyCalculationToTable() {
        const rows = Array.from(document.querySelectorAll("table tbody tr"));
        let ttr = parseInt(rows[0].children[qttrIndex].textContent.trim());
        rows[0].children[qttrIndex].textContent = ttr;
        for (let i = 1; i < rows.length; i++) {
            const prevRow = rows[i - 1];
            const row = rows[i];
            const diffCell = prevRow.children[plusMinusIndex];
            const diffText = diffCell.textContent.trim().replace("+","").replace("−","-");
            const diff = parseInt(diffText);
            ttr -= diff;
            row.children[qttrIndex].textContent = ttr;
        }
    }

    async function main(){
        if ((location.pathname.includes("click-tt/spieler")) || location.pathname.includes("community/external-profile"))
        {
            setTimeout(()=>{
                var externalProfile = document.querySelector('[href^="/community/external-profile"], [href^="/click-tt/spieler/P13389801C"]');
                var link = document.createElement("a");
                link.setAttribute("data-discover", "");
                link.className = "px-9 hover:underline text-center";
                link.href = externalProfile.href.replace("community/external-profile", "rankings/ttr-historie");
                link.textContent = "TTR-Historie";
                externalProfile.parentNode.append(link);
            }, 1000);
        }

        if (location.pathname.includes("click-tt/mein-clicktt/tabelle")){
            setTimeout(()=>{
                var planLink = document.querySelector('#schedule ~ div [href^="/click-tt/mein-clicktt/spielplan"]');
                planLink["onclick"] = null;
                planLink.href = document.querySelector('[href^="/click-tt/mein-clicktt/spielplan/"]').href;
            }, 1000);
        }

        if (!location.pathname.includes("rankings/ttr-historie") && !(location.pathname.includes("click-tt") && location.pathname.includes("spieler")))
            return;

        var resp = await fetch(location.href + (location.search ? "&" : "?") + "_data");
        var playerData = null;
        if (location.pathname.includes("/spieler/")){
            playerData = (await resp.json()).data.player_infos;
        } else if (location.pathname.includes("rankings/ttr-historie")){
            var data = await resp.text();
            var jsonData = JSON.parse("{" + data.split("\n\n")[1].slice(6));
            playerData = Object.values(jsonData)[0];
        }
        var [lastName, firstName] = playerData.person_name?.split(", ") ?? [playerData.lastname, playerData.firstname];
        document.title = `${firstName} ${lastName} | ${document.title}`;
        requestAnimationFrame(() => {
            var ttrs = document.querySelectorAll(".subgrid--mytt .backdrop-blur-3xl.absolute, .ttrCalc");
            if (ttrs && [...ttrs].find(i => i.nextElementSibling.innerHTML != playerData.ttr))
            {
                ttrs.forEach(ttr => {
                    ttr.classList.remove("backdrop-blur-3xl", "md:backdrop-blur-lg", "bg-white/40");
                    ttr.classList.add("ttrCalc");
                    ttr.nextElementSibling.innerHTML = playerData.ttr;
                });
                var max_ttr = document.querySelector(".subgrid--mytt > div:nth-child(4) .absolute, .ttrMaxCalc");
                if (max_ttr)
                {
                    max_ttr.classList.remove("backdrop-blur-3xl", "md:backdrop-blur-lg", "bg-white/40");
                    max_ttr.classList.add("ttrMaxCalc");
                    max_ttr.nextElementSibling.innerHTML = playerData?.max_ttr;
                }
            }
        });
    }
})()