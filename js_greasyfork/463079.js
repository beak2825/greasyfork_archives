// ==UserScript==
// @name         Stat Mod
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  This mod allows you to see tierlist values of your character such as DPS, Burst, eHP, Build Score and Rank
// @author       Daria
// @license      MIT
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463079/Stat%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/463079/Stat%20Mod.meta.js
// ==/UserScript==

const ranks = ["F", "E", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "S", "SS"]
const rankColors = ["#9f46c6", "#5a46c6", "#467bc6", "#46c0c6", "#46c695", "#46c661", "#81c646", "#b8c646", "#c6ba46", "#c69346", "#c67546", "#c66446", "#c65746", "#740000", "#910c0c"]
const sheetIDs = ["1ZltP6iegg8ON6ypbim7KbayYB35NvmWQqU0RlitTjE0", "1k3nb7xaTJmh4zxYRH_45JoWtnh5H0fkOiqdbiklPYPg", "1z7JHoIZdOPrj_VYSGLxoJVw1RA1Nfptj8AClcUXc6O0", "1LibjJwlpYdnHlRZV8ns_m_y2VeZaZHFZF8cpSr3jY7A"]
let rankMetrics = []
const classes = [" Warrior", " Mage", " Archer", " Shaman"]


window.addEventListener('load', function() {
    'use strict';
    let entered = false
    let interval = setInterval(function() {
        let statColumns = document.getElementsByClassName("statcol panel-black svelte-ggsnc")
        let update
        if (statColumns.length > 0 && !entered) {
            entered = true;
            let column = "X"
            if(document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].getElementsByTagName("span")[5].textContent == " Warrior"){
                column = "AG"
            }
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetIDs[classes.indexOf(document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].getElementsByTagName("span")[5].textContent)]}/values/data!${column}6:${column}21?key=AIzaSyDiSyzf40CaBHAKOrzDd5Ut193MuSlpW_Y`;
            fetch(url).then(data => data.json()).then(data => {
                rankMetrics = data.values
                statColumns[4].removeChild(statColumns[4].childNodes[0])
                statColumns[4].removeChild(statColumns[4].childNodes[0])
                statColumns[4].removeChild(statColumns[4].childNodes[0])
                statColumns[4].removeChild(statColumns[4].childNodes[0])
                statColumns[4].removeChild(statColumns[4].childNodes[4])
                statColumns[4].removeChild(statColumns[4].childNodes[4])
                let dps = document.createElement("span")
                dps.textContent = "DPS"
                dps.id = "dpsTextAdded"
                dps.style.color = "cyan"
                let dpsValue = document.createElement("span")
                dpsValue.id = "dpsValueAdded"
                dpsValue.className = "statnumber textprimary"
                let dpsn = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent)) / 2 * (1 + parseFloat(statColumns[3].childNodes[7].textContent) / 100) * (1 + parseFloat(statColumns[3].childNodes[9].textContent) / 100))
                dpsValue.textContent = dpsn
                //---------------------------
                let burst = document.createElement("span")
                burst.textContent = "Burst"
                burst.id = "burstTextAdded"
                burst.style.color = "cyan"
                let burstValue = document.createElement("span")
                burstValue.className = "statnumber textprimary"
                burstValue.id = "burstValueAdded"
                let burstn = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent)) / 2 * (1 + parseFloat(statColumns[3].childNodes[7].textContent) / 100))
                burstValue.textContent = burstn
                //----------------------------
                let ehp = document.createElement("span")
                ehp.textContent = "Effective HP"
                ehp.style.color = "cyan"
                ehp.id = "ehpTextAdded"
                let ehpValue = document.createElement("span")
                ehpValue.className = "statnumber textprimary"
                ehpValue.id = "ehpValueAdded"
                let ehpn = Math.round(parseFloat(statColumns[2].childNodes[1].textContent) * 100 / ((100 - 87 * (1 - Math.pow(Math.E, -1 * parseFloat(statColumns[2].childNodes[9].textContent) * 0.0022)))) * 125 / (125 - parseFloat(statColumns[2].childNodes[11].textContent.substring(0, statColumns[2].childNodes[11].textContent.length - 1))))
                ehpValue.textContent = ehpn
                //------------------------------
                let bs = document.createElement("span")
                bs.textContent = "Build Score"
                bs.style.color = "cyan"
                bs.id = "bsTextAdded"
                let bsValue = document.createElement("span")
                bsValue.className = "statnumber textprimary"
                bsValue.id = "bsValueAdded"
                let bsn = buildScore()
                bsValue.textContent = bsn
                statColumns[4].insertBefore(burstValue, statColumns[4].childNodes[0])
                statColumns[4].insertBefore(burst, statColumns[4].childNodes[0])
                statColumns[4].insertBefore(dpsValue, statColumns[4].childNodes[0])
                statColumns[4].insertBefore(dps, statColumns[4].childNodes[0])
                statColumns[4].insertBefore(ehpValue, statColumns[4].childNodes[0])
                statColumns[4].insertBefore(ehp, statColumns[4].childNodes[0])
                statColumns[4].append(bs, bsValue)
                update = setInterval(function(){
                    if(statColumns.length == 0){
                        clearInterval(update)
                    }
                    let dpsn = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent)) / 2 * (1 + parseFloat(statColumns[3].childNodes[7].textContent) / 100) * (1 + parseFloat(statColumns[3].childNodes[9].textContent) / 100))
                    let burstn = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent)) / 2 * (1 + parseFloat(statColumns[3].childNodes[7].textContent) / 100))
                    let ehpn = Math.round(parseFloat(statColumns[2].childNodes[1].textContent) * 100 / ((100 - 87 * (1 - Math.pow(Math.E, -1 * parseFloat(statColumns[2].childNodes[9].textContent) * 0.0022)))) / (1 - parseFloat(statColumns[2].childNodes[11].textContent.substring(0, statColumns[2].childNodes[11].textContent.length - 1)) / 100 * (document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].getElementsByTagName("span")[5].textContent == " Warrior" ? 0.6 : 0.45)))
                    let bsn = buildScore()
                    document.getElementById("dpsValueAdded").textContent = dpsn
                    document.getElementById("burstValueAdded").textContent = burstn
                    document.getElementById("ehpValueAdded").textContent = ehpn
                    document.getElementById("bsValueAdded").textContent = bsn
                }, 100)
            });
        } else if (statColumns.length == 0 && entered){
            entered = false;
            clearInterval(update)
        }
    }, 1)
});
function buildScore(){
    let statColumns = document.getElementsByClassName("statcol panel-black svelte-ggsnc")
    let cclass = document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].getElementsByTagName("span")[5].textContent
    let prestige = document.querySelector(".textprestige").textContent.split(" ")[1].split(",").length == 1 ? parseInt(document.querySelector(".textprestige").textContent.split(" ")[1].split(",")[0]) : parseInt(document.querySelector(".textprestige").textContent.split(" ")[1].split(",")[0]) * 1000 + parseInt(document.querySelector(".textprestige").textContent.split(" ")[1].split(",")[1])
    let damageBonus = (prestige < 48000 ? 10 : 0) + (prestige < 16000 ? 10 : 0)
    let dps = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent) + damageBonus) / 2 * (1 + (parseFloat(statColumns[3].childNodes[7].textContent) + (prestige < 36000 ? 5 : 0)) / 100) * (1 + (parseFloat(statColumns[3].childNodes[9].textContent) + (prestige < 40000 ? 3 : 0)) / 100))
    let burst = Math.round((parseFloat(statColumns[3].childNodes[1].textContent) + parseFloat(statColumns[3].childNodes[3].textContent) + damageBonus) / 2 * (1 + (parseFloat(statColumns[3].childNodes[7].textContent) + (prestige < 36000 ? 5 : 0)) / 100))
    let ehp = Math.round((parseFloat(statColumns[2].childNodes[1].textContent) + (prestige < 28000 ? 30 : 0) + (prestige < 44000 ? 30 : 0)) * 100 / ((100 - 87 * (1 - Math.pow(Math.E, -1 * parseFloat(statColumns[2].childNodes[9].textContent) * 0.0022)))) / (1 - parseFloat(statColumns[2].childNodes[11].textContent.substring(0, statColumns[2].childNodes[11].textContent.length - 1)) / 100 * (document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].getElementsByTagName("span")[5].textContent == " Warrior" ? 0.6 : 0.45)))
    let damage
    let hybrid
    let tank
    let haste
    let mit
    let health
    switch (cclass){
        case " Mage":
            damage = l((dps + burst)/2,2)
            hybrid = (l(ehp,5) + l(burst, 5) + l(dps, 4))/3
            tank = (l(ehp,2.5) + l(burst, 6) + l(dps, 6))/3
            rank(((damage/3)+tank+hybrid)*225/3, 1)
            return Math.round(((damage/3)+tank+hybrid)*225/3 * 100) / 100
        case " Archer":
            damage = (l(dps,2) + l(burst,2))/2
            hybrid = (l(ehp,5) + l(burst, 5) + l(dps, 4))/3
            tank = (l(ehp,2.5) + l(burst, 6) + l(dps, 6))/3
            rank(((damage/3)+tank+hybrid)*226/3, 2)
            return Math.round(((damage/3)+tank+hybrid)*226/3 * 100) / 100
        case " Warrior":
            mit = (1-Math.exp(-parseFloat(document.getElementsByClassName("statcol panel-black svelte-ggsnc")[2].childNodes[9].textContent)*0.0022))*0.87 + (((parseFloat(document.getElementsByClassName("statcol panel-black svelte-ggsnc")[2].childNodes[11].textContent)/100)*0.6))
            haste = parseFloat(document.getElementsByClassName("statcol panel-black svelte-ggsnc")[3].childNodes[9].textContent) + (prestige < 40000 ? 3 : 0)
            damage = (l(ehp, 5) + l(dps, 2) + l(burst, 2))/3
            tank = (l(ehp,2) + l(mit*100, 2) + l(haste, 6))/3
            hybrid = (l(ehp,5) + l(dps, 4) + l(burst, 5) + l(mit*100, 5))/4
            rank((damage+(tank/3)+hybrid)*210/3, 0)
            return Math.round((damage+(tank/3)+hybrid)*210/3 * 100) / 100
        case " Shaman":
            haste = parseFloat(statColumns[3].childNodes[9].textContent + (prestige < 40000 ? 3 : 0));
            health = parseFloat(statColumns[2].childNodes[1].textContent) + (prestige < 44000 ? 30 : 0) + (prestige < 28000 ? 30 : 0);
            damage = (l(dps, 2) + l(burst, 2) + l(ehp, 10))/3;
            tank = (l(dps, 10) + l(burst, 11) + l(ehp, 2) + l(ehp/health*60, 7) + l(haste*8, 16))/5;
            hybrid = (l(dps, 3) + l(burst, 4) + l(ehp, 6) + l(ehp/health*50, 10) + l(haste*8, 9))/5;
            rank(((damage/1.75)+(tank)+hybrid)*235/3, 3)
            return Math.round(((damage/1.75)+(tank)+hybrid)*235/3 * 100) / 100;
    }
    return "-"
}

function rank(bs, pclass){
    let rankValue
    if(document.getElementById("rank") == null){
        document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].childNodes[12].remove()
        document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].childNodes[12].remove()
        let rankText = document.createElement("span")
        rankText.textContent = "Rank"
        rankText.style.color = "cyan"
        rankValue = document.createElement("span")
        rankValue.id = "rank"
        document.getElementsByClassName("statcol panel-black svelte-ggsnc")[0].append(rankText, rankValue)
    } else {
        rankValue = document.querySelector("#rank")
    }
    	for(let i = 1; i < rankMetrics.length; i++){
            if(rankMetrics[i][0] > bs){
                rankValue.textContent = ranks[i - 1]
                rankValue.style = "color:" + rankColors[15 - i]
                return
            }
        }
        rankValue.textContent = "SS"
        rankValue.style = "color:#c646a0"
}

function l(y, x) {
  return Math.log(y) / Math.log(x);
}