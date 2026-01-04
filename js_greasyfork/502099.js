// ==UserScript==
// @name         bd level check
// @description  checks for non max bds
// @author       Miro
// @include      https://*.grepolis.com/game/*
// @version      2.3.0
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/502099/bd%20level%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/502099/bd%20level%20check.meta.js
// ==/UserScript==

(async function() {

    // wait for page to load
    var sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

    const farmTownRelations = Object.values(MM.getModels().FarmTownPlayerRelation);
    const allTowns = Object.values(ITowns.getTowns());
    const associations = [];

    bd_check = {};

    bd_check.add_data = function() {
        if (associations.length > 0 && $('#bd_level_check').size() == 0) {
            let associations_html = '';
            for (const association of associations) {
                associations_html += "<li>Boerendorp level: " + association.FarmTownLevel + " for Town: <a href='#' class='gp_town_link' onclick='bd_check.jump_and_open_bd_window(" + association.TownId + "," +association.FarmTownId + ")'>" + association.townName + "</a><br></li>"
            }
            $('<div id="bd_level_check" style="width=400px; height:500px; overflow-y:scroll; left-margin:auto; overflow-x:auto;"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold"></div><ul>' + associations_html + '</ul>').insertAfter($('#farm_town_wrapper'));
            $('#bd_level_check').parent().parent().parent().width('1200px');

            let window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_FARM_TOWN_OVERVIEWS);
            window.setPosition(['center', 'center']);
        }
    }

    bd_check.check_bd_max = function() {
        associations.length = 0;
        for (const farmTownRelation of farmTownRelations) {
            const farmTownId = farmTownRelation.getFarmTownId();
            let farmTownLevel = farmTownRelation.attributes.expansion_stage;

            if (farmTownLevel == 1 && farmTownRelation.upgrade_cost == 1) {
                farmTownLevel = 0;
            }

            if (farmTownLevel < 6) {
                const farmTown = MM.getModels().FarmTown[farmTownId];
                if (farmTown) {
                    const [matchingTown] = allTowns.filter(t => t.getIslandCoordinateX() === farmTown.getIslandX() && t.getIslandCoordinateY() === farmTown.getIslandY());
                    if (matchingTown) associations.push({ townName: matchingTown.name, TownId: matchingTown.id, FarmTownId: farmTownId , FarmTownLevel:  farmTownLevel, islandX: farmTown.getIslandX(), islandY: farmTown.getIslandY() });
                }
            }
        }
    }

    bd_check.jump_and_open_bd_window = async function(town_id, farm_town_id) {
        HelperTown.townSwitch(town_id);
        await sleep(100);
        WMap.mapJump(ITowns.getTown(town_id), true);
        FarmTownWindowFactory.openWindow(farm_town_id);
    }
    bd_check.check_bd_max();
    setInterval(bd_check.check_bd_max, 1000 * 60 * 10);
    let bd_interval = setInterval(bd_check.add_data, 200);
})();