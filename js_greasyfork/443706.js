// ==UserScript==

// @name         Importer un set PRO | Pat®️
// @version      0.7.2
// @description  try to take over the map!
// @author       尸闩セ尺讠⼕长 闩㇄㠪乂闩𝓝ᗪ尺㠪
// @match        *://patricien.fr/*
// @match        *://probuildstats.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=probuildstats.com
// @namespace https://greasyfork.org/users/894736
// @downloadURL https://update.greasyfork.org/scripts/443706/Importer%20un%20set%20PRO%20%7C%20Pat%C2%AE%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/443706/Importer%20un%20set%20PRO%20%7C%20Pat%C2%AE%EF%B8%8F.meta.js
// ==/UserScript==

(function(WriteSetIntoClipboard) {
    var Mythique = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-mythics > div.side-column_grid-item.top-items > div > div.item-image.mythic-item > img").src.substring(59,63);
    var Objet1 = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-items > div.side-column_grid-item.top-items > div:nth-child(1) > div.item-image.completed-item > img").src.substring(59,63);
    var Objet2 = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-items > div.side-column_grid-item.top-items > div:nth-child(2) > div.item-image.completed-item > img").src.substring(59,63);
    var Objet3 = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-items > div.side-column_grid-item.top-items > div:nth-child(3) > div.item-image.completed-item > img").src.substring(59,63);
    var Boots = document.querySelector("#main-content > div > div > div.champion-page_content > div.champion-page_top-bar > div.champion-skills > div.side-column_grid-item.top-items > div:nth-child(1) > div.item-image.completed-item > img").src.substring(59,63);
    navigator.clipboard.writeText('{"title":"BUILD Patricien","associatedMaps":[11],"associatedChampions":[],"blocks":[{"items":[{"id":"'+Mythique+'","count":1},{"id":"'+Objet1+'","count":1},{"id":"'+Objet2+'","count":1}],"type":"Objets populaires"}]}')
    //Copie ID d'objet @Presse-papier

    // Your code here...

    alert("👇 Importez le set copié  ⇢  Build#"+Mythique+Objet1+Objet2+Objet3+Boots+"\nsur 🕹 League of Legends !\n\n.--. .- - .-. .. -.-. -.-  .- .-.. . -..- .- -. -.. .-. .\n🎒 Collection | OBJETS\n\(⭹) Importer des sets d'ojets\n..--- .---- -..-. .---- .---- -..-. .---- ----. ----. .....");
})();