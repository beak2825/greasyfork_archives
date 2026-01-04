// ==UserScript==
// @name         👑  Patricien FREE 1v9  👑
// @namespace    MACRObooster
// @version      1.2.1
// @description  ##Importer des builds, des skins pour 1v9##🆕🆓 et Boostez votre macrogame, gagnez des LP 🪅
// @author       尸闩セ尺讠⼕长 闩㇄㠪乂闩𝓝ᗪ尺㠪
// @match        *://probuildstats.com/*
// @icon         https://cdn.shopify.com/s/files/1/0573/8181/4410/files/Nouveau_projet_7_61df1dec-44bc-48ab-b74d-82862d969cdb_32x32.png

// @downloadURL https://update.greasyfork.org/scripts/442268/%F0%9F%91%91%20%20Patricien%20FREE%201v9%20%20%F0%9F%91%91.user.js
// @updateURL https://update.greasyfork.org/scripts/442268/%F0%9F%91%91%20%20Patricien%20FREE%201v9%20%20%F0%9F%91%91.meta.js
// ==/UserScript==
(function(PROBUILD) {
    document.querySelector("#masthead").style.display = "none";
    if(document.URL.indexOf("/champion/") > -1) {
        var Mythics = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-mythics > div.side-column_grid-item.top-items > div:nth-child(1) > div.item-image.mythic-item.completed-item > img").src;/*mythics*/
        var Items = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-items > div.side-column_grid-item.top-items > div:nth-child(1) > div.item-image.completed-item > img").src;/*items*/
        var Items2 = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-items > div.side-column_grid-item.top-items > div:nth-child(2) > div.item-image.completed-item > img").src;
        var Skills = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-skills > div.side-column_grid-item.top-items > div:nth-child(1) > div.item-image.completed-item > img").src;/*skills*/
        var sMythics = Mythics.substring(59,63);//ID
        var sItems = Items.substring(59,63);//ID
        var sItems2 = Items2.substring(59,63);//ID
        var sSkills = Skills.substring(59,63);//ID

        var Build = '{"associatedChampions":[],"associatedMaps":[11],"blocks":[{"hideIfSummonerSpell":"","items":[{"count":1,"id":"'+sMythics+'"},{"count":1,"id":"'+sItems+'"},{"count":1,"id":"'+sSkills+'"}],"showIfSummonerSpell":"","type":"@15"}],"map":"SR","mode":"any","preferredItemSlots":[],"sortrank":9999,"startedFrom":"blank","title":"Ma page","type":"custom"}';
        navigator.clipboard.writeText(Build)

        alert("build copié !\n\n🖱️clic-droit dans le script\npour l'importer");
    };
})

();
//  var Build = '{"title":"Shadow","associatedMaps":[11],"associatedChampions":[],"blocks":[{"items":[{"id":"'+sMythics+'","count":1},{"id":"'+sItems+'","count":1},{"id":"'+sSkills+'","count":1}],"type":"@15min"},{"items":[{"id":"'+sItems2+'","count":1}],"type":"Midgame"}]}';
