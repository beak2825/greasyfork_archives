// ==UserScript==
// @name         MineAutoBuilder
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Obvious from the name, innit?
// @author       tanavast
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=supplies*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398767/MineAutoBuilder.user.js
// @updateURL https://update.greasyfork.org/scripts/398767/MineAutoBuilder.meta.js
// ==/UserScript==

(function () {

    setInterval(function(){
        location.href = location.href;
    }, 60000 + Math.random() * 120000)

    if ($("#productionboxbuildingcomponent .idle").text() != "") {
        var resourceEnergy = parseInt($("#resources_energy").text().trim(), 10);
        if (resourceEnergy < 0)
            setTimeout(buildSolarPlant, Math.random() * 2000);
        else
            setTimeout(buildMines, Math.random() * 2000);
    }

    function buildSolarPlant() {
        $(".solarPlant button").trigger("click");
    }

    function buildMines() {
        var metalLevel =
            parseInt($(".metalMine > .level").text(), 10);
        var crystalLevel =
            parseInt($(".crystalMine > .level").text(), 10);
        var deuteriumLevel =
            parseInt($(".deuteriumSynthesizer > .level").text(), 10);

        var levelsArraySorted = {
            metal: metalLevel,
            crystal: crystalLevel,
            deuterium: deuteriumLevel
        }

        var lowestLevel = "metal";
        if (levelsArraySorted[lowestLevel] > levelsArraySorted["crystal"])
            lowestLevel = "crystal";
        if (levelsArraySorted[lowestLevel] > levelsArraySorted["deuterium"])
            lowestLevel = "deuterium";

        switch (lowestLevel) {
            case "metal": $(".metalMine button").trigger("click"); break;
            case "crystal": $(".crystalMine button").trigger("click"); break;
            case "deuterium": $(".deuteriumSynthesizer button").trigger("click"); break;
        }
    }
})();