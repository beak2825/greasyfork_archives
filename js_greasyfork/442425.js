// ==UserScript==
// @name         Autobuilder for Diep.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press tab and then type in you tier 4 tank you will upgrade to. It will then match you with a good build for that tank.
// @author       GKRPLAYZ
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442425/Autobuilder%20for%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/442425/Autobuilder%20for%20Diepio.meta.js
// ==/UserScript==



(function() {
    document.body.onkeydown=function(e){
        //open build menu = tab button
        if(e.keyCode===9){
            var tank=prompt("What tank are you using?");
            tank=tank.toLowerCase();
            switch(tank){
                case "annihilator":
                    input.execute("game_stats_build 111113333334455555666667777888888");
                    break;
                case "auto 5":
                    input.execute("game_stats_build 444444455555556666666777778888888");
                    break;
                case "auto gunner":
                    input.execute("game_stats_build 444445555555666666677777778888888");
                    break;
                case "auto smasher":
                    input.execute("game_stats_build 111222222223333333445566668888888");
                    break;
                case "auto trapper":
                    input.execute("game_stats_build 222444445555555666666677777778888");
                    break;
                case "battleship":
                    input.execute("game_stats_build 112224444444555555566666668888888");
                    break;
                case "booster":
                    input.execute("game_stats_build 312312312312312312312886688688686");
                    break;
                case "factory":
                    input.execute("game_stats_build 233444444455555556666666777777788");
                    break;
                case "fighter":
                    input.execute("game_stats_build 312312312312312312312886688688686");
                    break;
                case "gunner trapper":
                    input.execute("game_stats_build 223334444444555555566666667777777");
                    break;
                case "hybrid":
                    input.execute("game_stats_build 111444444455555566666677778888888");
                    break;
                case "landmine":
                    input.execute("game_stats_build 111111111122222222223333333333444");
                    break;
                case "manager":
                    input.execute("game_stats_build 111224444444555555566666668888888");
                    break;
                case "mega trapper":
                    input.execute("game_stats_build 111111122222223333333556677788888");
                    break;
                case "necromancer":
                    input.execute("game_stats_build 113344444445555555666666677777778");
                    break;
                case "octo tank":
                    input.execute("game_stats_build 112334444444555556666666777777788");
                    break;
                case "overlord":
                    input.execute("game_stats_build 111112223333444444455555556666666");
                    break;
                case "overtrapper":
                    input.execute("game_stats_build 1112333444445555555566666667777777");
                    break;
                case "penta shot":
                    input.execute("game_stats_build 666666677777775555555888811112222");
                    break;
                case "predator":
                    input.execute("game_stats_build 112334444444555555566666667777777");
                    break;
                case "ranger":
                    input.execute("game_stats_build 112334444444555555566666668888888");
                    break;
                case "rocketeer":
                    input.execute("game_stats_build 223334444444555555566666667777777");
                    break;
                case "skimmer":
                    input.execute("game_stats_build 222334444445555555666666677777778");
                    break;
                case "spike":
                    input.execute("game_stats_build 111222222222233333333334444444444");
                    break;
                case "sprayer":
                    input.execute("game_stats_build 112444444455555556666666777777788");
                    break;
                case "spread shot":
                    input.execute("game_stats_build 666666677777775555555888811112222");
                    break;
                case "stalker":
                    input.execute("game_stats_build 111222223333344445555666667788888");
                    break;
                case "streamliner":
                    input.execute("game_stats_build 112224444444555555566666667777777");
                    break;
                case "tri-trapper":
                    input.execute("game_stats_build 112225555555666666677777778888888");
                    break;
                case "triple twin":
                    input.execute("game_stats_build 112222444555555566666667777777888");
                    break;
                case "triplet":
                    input.execute("game_stats_build 666666677777775555555888811112222");
                    break;
                default:
                    alert("That's not a tank");
                    break;
            }
        }
    };
})();