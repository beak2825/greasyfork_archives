// ==UserScript==
// @name         Stats Counter
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @include      https://s157-en.ogame.gameforge.com/game/index.php?page=overview*
// @include      https://s157-en.ogame.gameforge.com/game/index.php?page=resources*
// @include      https://s157-en.ogame.gameforge.com/game/index.php?page=research*
// @include      https://s157-en.ogame.gameforge.com/game/index.php?page=defense*
// @include      https://s157-en.ogame.gameforge.com/game/index.php?page=shipyard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377042/Stats%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/377042/Stats%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);

    
})();

function init()
{


    // OPTIONS
    var ENABLE_RAW_PRODUCTION_COUNTING = true;
    var ENABLE_AFFORDABLE_MINE_COUNTING = true;
    var ENABLE_AFFORDABLE_DEFENSE_COUNTING = true;
    var ENABLE_FLEET_POINTS_COUNTING = true;
    var ENABLE_DEBRIS_FROM_FIELD_COUNTING = true;
    var ENABLE_DEFENSE_POINTS_COUNTING = true;
    var ENABLE_NUMBER_OF_SHIPS_DESTROYED_BY_DEFENSE = true;


    // THESE ARE THE VARIABLES YOU SHOULD SET IF YOU USE THIS IN THE DIFFERENT UNIVERSE
    var UNIVERSE_ECO_SPEED = 6;
    var LINK_TO_OVERVIEW_PAGE = "https://s157-en.ogame.gameforge.com/game/index.php?page=overview";
    var LINK_TO_RESOURCES_PAGE = "https://s157-en.ogame.gameforge.com/game/index.php?page=resources";
    var LINK_TO_RESEARCH_PAGE = "https://s157-en.ogame.gameforge.com/game/index.php?page=research";
    var LINK_TO_DEFENCE_PAGE = "https://s157-en.ogame.gameforge.com/game/index.php?page=defense";
    var LINK_TO_SHIPYARD_PAGE = "https://s157-en.ogame.gameforge.com/game/index.php?page=shipyard";


    var full_planet_info = localStorage.getItem("full_planet_info");

    if (full_planet_info == null) // script is launched the first time
    {

        console.log("full planet info is not present. Setting it up now");
        var planetList = document.getElementById("planetList").children;
        full_planet_info = [];
        var i = 0;
        for (i = 0; i < planetList.length; i++)
        {

            full_planet_info[i] = planetList[i].children[0].children[2].innerText;
        }

        for (i = 0; i < planetList.length; i++)
        {

           full_planet_info[(i*5)+planetList.length] = 0;
            full_planet_info[(i*5)+planetList.length+1] = 0;
            full_planet_info[(i*5)+planetList.length+2] = 0;
            full_planet_info[(i*5)+planetList.length+3] = 0;
            full_planet_info[(i*5)+planetList.length+4] = 0;
        }
        localStorage.setItem("planetCount", planetList.length);
        console.log(full_planet_info);
        localStorage.setItem("full_planet_info", JSON.stringify(full_planet_info));
        localStorage.setItem("plasmaLevel", "0");
        localStorage.setItem("astroLevel", "0");

        // this refreshes the page to make all changes valid!
        document.location.reload(true);
    }
    full_planet_info = JSON.parse(full_planet_info);
    console.log(full_planet_info);
    var plasmaLevel = localStorage.getItem("plasmaLevel");
    var planetCount = localStorage.getItem("planetCount");
    // Define Behaviour on every individual page


    // Shipyard page
    if (window.location.href.includes(LINK_TO_SHIPYARD_PAGE))
    {
       if ( ENABLE_FLEET_POINTS_COUNTING )
       {
       var ships = document.getElementsByClassName("level");

       var lfs = ships[0].innerText.replace(/\D/g, "");
       var hfs = ships[1].innerText.replace(/\D/g, "");
        var cruisers = ships[2].innerText.replace(/\D/g, "");
        var battleships = ships[3].innerText.replace(/\D/g, "");
        var battlecruisers = ships[4].innerText.replace(/\D/g, "");
        var bombers = ships[5].innerText.replace(/\D/g, "");
        var destroyers = ships[6].innerText.replace(/\D/g, "");
        var death_stars = ships[7].innerText.replace(/\D/g, "");
        var small_cargo = ships[8].innerText.replace(/\D/g, "");
        var large_cargo = ships[9].innerText.replace(/\D/g, "");
        var colony_ship = ships[10].innerText.replace(/\D/g, "");
        var recycler = ships[11].innerText.replace(/\D/g, "");
        var probe = ships[12].innerText.replace(/\D/g, "");
        var sat = ships[13].innerText.replace(/\D/g, "");

        var total_points = parseInt(lfs)*4000 + parseInt(hfs)*10000 + parseInt(cruisers)*29000 + parseInt(battleships)*60000 + parseInt(battlecruisers)*85000 + parseInt(bombers)*90000 + parseInt(destroyers)*125000
        + parseInt(death_stars)*10000000 + parseInt(small_cargo)*4000 + parseInt(large_cargo)*12000 + parseInt(colony_ship)*40000 + parseInt(recycler)*18000 + parseInt(probe)*1000 + parseInt(sat)*2500;

        total_points = total_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        var block_of_text = document.createElement("p");
        block_of_text.style = "white-space: pre;";
        var text = document.createTextNode("Your total fleet points on this planet: " + total_points + "\n\n");
        block_of_text.appendChild(text);

        document.getElementById("inhalt").appendChild(block_of_text);

       }

        if( ENABLE_DEBRIS_FROM_FIELD_COUNTING)
        {
        var total_df_metal = parseInt(lfs)*1200 + parseInt(hfs)*2400 + parseInt(cruisers)*8000 + parseInt(battleships)*18000 + parseInt(battlecruisers)*12000 + parseInt(bombers)*20000 + parseInt(destroyers)*24000
        + parseInt(death_stars)*2000000 + parseInt(small_cargo)*800 + parseInt(large_cargo)*2400 + parseInt(colony_ship)*4000 + parseInt(recycler)*4000;

        var total_df_crystal = parseInt(lfs)*400 + parseInt(hfs)*1600 + parseInt(cruisers)*2800 + parseInt(battleships)*6000 + parseInt(battlecruisers)*16000 + parseInt(bombers)*10000 + parseInt(destroyers)*20000
        + parseInt(death_stars)*1600000 + parseInt(small_cargo)*800 + parseInt(large_cargo)*2400 + parseInt(colony_ship)*8000 + parseInt(recycler)*2400 + parseInt(probe)*400 + parseInt(sat)*800;




        block_of_text = document.createElement("p");
        block_of_text.style = "white-space: pre;";
        text = document.createTextNode("Total debris field from this planet's fleet: " + total_df_metal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + total_df_crystal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal" + "\n\n");
        block_of_text.appendChild(text);

        document.getElementById("inhalt").appendChild(block_of_text);

        }


    }

    // Defence page
    if (window.location.href.includes(LINK_TO_DEFENCE_PAGE))
    {
        if (ENABLE_DEFENSE_POINTS_COUNTING)
        {

        var defenses = document.getElementsByClassName("level");


        var rocket_launchers = defenses[0].innerText.replace(/\D/g, "");
        var light_lasers = defenses[1].innerText.replace(/\D/g, "");
        var heavy_lasers = defenses[2].innerText.replace(/\D/g, "");
        var gauss_cannons = defenses[3].innerText.replace(/\D/g, "");
        var ion_cannons = defenses[4].innerText.replace(/\D/g, "");
        var plasma_turrets = defenses[5].innerText.replace(/\D/g, "");
        var small_shield = defenses[6].innerText.replace(/\D/g, "");
        var large_shield = defenses[7].innerText.replace(/\D/g, "");

        var def_total_points = parseInt(rocket_launchers)*2000 + parseInt(light_lasers)*2000 + parseInt(heavy_lasers)*8000 + parseInt(gauss_cannons)*37000 + parseInt(ion_cannons)*8000 + parseInt(plasma_turrets)*130000 + parseInt(small_shield)*20000 + parseInt(large_shield)*100000;

        def_total_points = def_total_points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


        block_of_text = document.createElement("p");
        block_of_text.style = "white-space: pre;";
        text = document.createTextNode("Your total defense points on this planet: " + def_total_points + "\n\n");
        block_of_text.appendChild(text);

        document.getElementById("inhalt").appendChild(block_of_text);
        }

        if ( ENABLE_NUMBER_OF_SHIPS_DESTROYED_BY_DEFENSE )
        {
        bombers= Math.floor(plasma_turrets * 0.375)
        battlecruisers = Math.floor(plasma_turrets * 0.4054)
        battleships = Math.floor(plasma_turrets * 0.48387)
        cruisers = parseInt(plasma_turrets) + Math.floor(gauss_cannons * 0.4);
        var heavy_fighters = parseInt(plasma_turrets) + parseInt(gauss_cannons);
        var light_fighters = parseInt(plasma_turrets) + parseInt(gauss_cannons) + Math.floor(heavy_lasers*0.60975);

        var destroyed_points_text = "This planet's defenses are capable of 100%-destroying\n"
        + bombers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " bombers (" + (bombers*(50000-50000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (bombers*(25000-25000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal + "
        + (bombers*15000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " deuterium loss)\n"
        + battlecruisers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " battlecruisers (" + (battlecruisers*(30000-30000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (battlecruisers*(40000-40000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal + "
        + (battlecruisers*15000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " deuterium loss)\n"
        + battleships.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " battleships (" + (battleships*(45000-45000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (battlecruisers*(15000-15000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal loss)\n"
        + cruisers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " cruisers (" + (cruisers*(20000-20000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (cruisers*(7000-7000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal + "
        + (cruisers*2000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " deuterium loss)\n"
        + heavy_fighters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " heavy fighters (" + (heavy_fighters*(6000-6000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (heavy_fighters*(4000-4000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal loss)\n"
        + light_fighters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " light fighters (" + (light_fighters*(3000-3000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " metal + " + (light_fighters*(1000-1000*0.4)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " crystal loss)";




        block_of_text = document.createElement("p");
        block_of_text.style = "white-space: pre;";
        text = document.createTextNode(destroyed_points_text);
        block_of_text.appendChild(text);

        document.getElementById("inhalt").appendChild(block_of_text);

        }

    }


    // Resources page
    if(window.location.href.includes(LINK_TO_RESOURCES_PAGE))
    {
// Define planet's index in the local array
        var current_planet_index = 0;
        for (i = 0; i < planetCount; i++)
        {

            if(document.getElementById("planetList").children[i].children[0].className.includes("active"))
            {
               current_planet_index = full_planet_info.indexOf(document.getElementById("planetList").children[i].children[0].children[2].innerText);
                break;
            }
        }

        // Get mine levels and clear them from invalid symbols
        var mine_levels = document.getElementsByClassName("level");
        console.log(mine_levels);
        var metal_mine_level = mine_levels[0].innerText.replace(/\D/g, "");
        var crystal_mine_level = mine_levels[1].innerText.replace(/\D/g, "");
        var deut_synth_level = mine_levels[2].innerText.replace(/\D/g, "");
        var thermoplant_level = mine_levels[4].innerText.replace(/\D/g, "");


        //Load mine levels into the full_planet_info array
        full_planet_info[parseInt(planetCount) + (current_planet_index * 3)] = parseInt(metal_mine_level);
        full_planet_info[parseInt(planetCount) + (current_planet_index * 3) + 1] = parseInt(crystal_mine_level);
        full_planet_info[parseInt(planetCount) + (current_planet_index * 3) + 2] = parseInt(deut_synth_level);
        full_planet_info[parseInt(planetCount)*5+(current_planet_index)] = parseInt(thermoplant_level);

        // Save changes
         localStorage.setItem("full_planet_info", JSON.stringify(full_planet_info));
    }

    // Research page
    if(window.location.href.includes(LINK_TO_RESEARCH_PAGE))
    {

       plasmaLevel = document.getElementsByClassName("level")[4].innerText.replace(/\D/g, "");
       localStorage.setItem("plasmaLevel", plasmaLevel);
    }

    // Overview page
    if(window.location.href.includes(LINK_TO_OVERVIEW_PAGE))
    {
        current_planet_index = 0;
        for (i = 0; i < planetCount; i++)
        {

            if(document.getElementById("planetList").children[i].children[0].className.includes("active"))
            {
               current_planet_index = full_planet_info.indexOf(document.getElementById("planetList").children[i].children[0].children[2].innerText);
                break;
            }
        }

            var average_temp_string = "";

            var planet_details_children_count = document.getElementById("planetDetails").children[0].children[0].children.length;
            if (planet_details_children_count == 5)
            {
              average_temp_string = document.getElementById("planetDetails").children[0].children[0].children[1].children[1].children[0].textContent;
                console.log("defined the string as " + average_temp_string);
            } else {
                console.log("ago is present");
                average_temp_string = document.getElementById("planetDetails").children[0].children[0].children[7].children[1].children[0].textContent;
                console.log("defined the string as " + average_temp_string);
            }


        var min_temp = "";
        var max_temp = "";
        var min_set = false;
        for (i = 0; i < average_temp_string.length; i++)
        {
               if (["-", "0","1","2","3","4","5","6","7","8","9"].indexOf(average_temp_string[i]) != -1 && !min_set)
               { min_temp += average_temp_string[i]; console.log("Adding " + average_temp_string[i] + " to min_temp"); }
               else if (["-", "0","1","2","3","4","5","6","7","8","9"].indexOf(average_temp_string[i]) == -1 && !min_set)
               { min_set = true; console.log("min_temp's definition finished"); }
               else if (["-", "0","1","2","3","4","5","6","7","8","9"].indexOf(average_temp_string[i]) != -1 && min_set)
               { max_temp += average_temp_string[i]; console.log("Adding " + average_temp_string[i] + " to max_temp"); }
        }


        console.log("Temperature defintions finished");
        console.log("parseInt(min_temp) yields " + parseInt(min_temp));
        console.log("parseInt(max_temp) yields " + parseInt(max_temp));

        full_planet_info[parseInt(planetCount)+(parseInt(planetCount)*3)+parseInt(current_planet_index)] = Math.floor((parseInt(max_temp) + parseInt(min_temp)) / 2);
        localStorage.setItem("full_planet_info", JSON.stringify(full_planet_info));

        if (ENABLE_RAW_PRODUCTION_COUNTING)
        {
        var producable_resources_metal = 0;
        var producable_resources_crystal = 0;
        var producable_resources_deut = 0;
        for(var i1 = 0; i1 < planetCount; i1++)
        {
           producable_resources_metal = producable_resources_metal + 30 * (1 + plasmaLevel/100) * UNIVERSE_ECO_SPEED * full_planet_info[parseInt(planetCount) + (i1*3)] * Math.pow(1.1, full_planet_info[parseInt(planetCount) + (i1*3)]) + 30 * UNIVERSE_ECO_SPEED; //full_planet_info[planetCount + (i*3)]

           producable_resources_crystal += 15*UNIVERSE_ECO_SPEED+20*UNIVERSE_ECO_SPEED*(1+plasmaLevel*0.0066)*full_planet_info[parseInt(planetCount) + (i1*3)+1]*Math.pow(1.1, full_planet_info[parseInt(planetCount) + (i1*3)+1]);

           producable_resources_deut += UNIVERSE_ECO_SPEED*(20*full_planet_info[parseInt(planetCount) + (i1*3)+2]*Math.pow(1.1, full_planet_info[parseInt(planetCount) + (i1*3)+2]))*(0.68-0.002*full_planet_info[(parseInt(planetCount)*4+i1)]) + 0.0033 * (UNIVERSE_ECO_SPEED*(20*full_planet_info[parseInt(planetCount) + (i1*3)+2]*Math.pow(1.1, full_planet_info[parseInt(planetCount) + (i1*3)+2]))*(0.68-0.002*full_planet_info[(parseInt(planetCount)*4+i1)])) - 10*UNIVERSE_ECO_SPEED*full_planet_info[parseInt(planetCount)*5+i1]*Math.pow(1.1,full_planet_info[parseInt(planetCount)*5+i1]);
        }

        var debugging_info = "";
        if (isNaN(producable_resources_deut))
        {
            debugging_info = "ERROR RIGHT AFTER COUNTING THE DEUTERIUM PRODUCTION";
        }

        if (isNaN(Math.floor(producable_resources_deut)))
        {
            debugging_info = "ERROR WHILE TRYING TO FLOOR PRODUCABLE DEUT";
        }



        var para1 = document.createElement("p");
        para1.style = "white-space: pre;"
        var text_node = document.createTextNode("Raw resource production (hourly): " + Math.floor(producable_resources_metal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "; " + Math.floor(producable_resources_crystal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "; " + Math.floor(parseFloat(producable_resources_deut)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "\n"
                                               + "\Raw resource production (daily): " + (Math.floor(producable_resources_metal)*24).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "; " + (Math.floor(producable_resources_crystal)*24).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "; " + (Math.floor(parseFloat(producable_resources_deut))*24).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "\n\n");
para1.appendChild(text_node);
        var target = document.getElementById("overviewBottom");
        target.appendChild(para1);

        }

        if (ENABLE_AFFORDABLE_MINE_COUNTING)
        {
        var mine_stat_display = "With this production you can afford:\n";

        for (i = 0; i < planetCount; i++)
        {

            var metal_mine_cost_metal = Math.floor(60 * Math.pow(1.5, full_planet_info[parseInt(planetCount) + (i*3)]+1));//full_planet_info[parseInt(planetCount) + (i*3)]
            var metal_mine_cost_crystal = Math.floor(15 * Math.pow(1.5, full_planet_info[parseInt(planetCount) + (i*3)]+1));

            var toAdd = "" + Math.floor(Math.min(producable_resources_metal*24/metal_mine_cost_metal, producable_resources_crystal*24/metal_mine_cost_crystal)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " level " + (full_planet_info[parseInt(planetCount) + (i*3)]+1) + " metal mines daily\n"
            if (!mine_stat_display.includes(toAdd)) { mine_stat_display += toAdd; }

            var crystal_mine_cost_metal = Math.floor(48*Math.pow(1.6, full_planet_info[parseInt(planetCount) + (i*3)+1]+1));
            var crystal_mine_cost_crystal = Math.floor(24*Math.pow(1.6, full_planet_info[parseInt(planetCount) + (i*3)+1]+1));

            toAdd = "" + Math.floor(Math.min(producable_resources_metal*24/crystal_mine_cost_metal, producable_resources_crystal*24/crystal_mine_cost_crystal)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " level " + (full_planet_info[parseInt(planetCount) + (i*3)+1]+1) + " crystal mines daily\n"
            if (!mine_stat_display.includes(toAdd)) { mine_stat_display += toAdd; }

            var deut_mine_cost_metal = Math.floor(225 * Math.pow(1.5, full_planet_info[parseInt(planetCount) + (i*3)+2]+1));//full_planet_info[parseInt(planetCount) + (i*3)]
            var deut_mine_cost_crystal = Math.floor(75 * Math.pow(1.5, full_planet_info[parseInt(planetCount) + (i*3)+2]+1));

            toAdd = "" + Math.floor(Math.min(producable_resources_metal*24/deut_mine_cost_metal, producable_resources_crystal*24/deut_mine_cost_crystal)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " level " + (full_planet_info[parseInt(planetCount) + (i*3)+2]+1) + " deuterium mines daily\n"
            if (!mine_stat_display.includes(toAdd)) { mine_stat_display += toAdd; }
        }

        para1 = document.createElement("p");
        text_node = document.createTextNode(mine_stat_display + "\n\n");
        para1.style = "white-space: pre;"
        para1.appendChild(text_node);
        target.appendChild(para1);
        }

        if (ENABLE_AFFORDABLE_DEFENSE_COUNTING)
        {
        mine_stat_display = "You can build\n" + Math.floor(producable_resources_metal*24/2000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " rocket launchers/\n" + Math.floor(Math.min(producable_resources_metal*24/1500, producable_resources_crystal*24/500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " light lasers/\n" +  Math.floor(Math.min(producable_resources_metal*24/6000, producable_resources_crystal*24/2000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " heavy lasers/\n" + Math.floor(Math.min(Math.min(producable_resources_metal*24/20000, producable_resources_crystal*24/15000), producable_resources_deut*24/2000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " gauss cannons/\n" + Math.floor(Math.min(Math.min(producable_resources_metal*24/50000, producable_resources_crystal*24/50000), producable_resources_deut*24/30000)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " plasma turrets daily!";
        para1 = document.createElement("p");
        text_node = document.createTextNode(mine_stat_display);
        para1.style = "white-space: pre;"
        para1.appendChild(text_node);
        target.appendChild(para1);
        }
    }


}
