// ==UserScript==
// @name         HKG Agar Tool - Script blocker (Firefox ONLY)
// @namespace    scriptblock
// @version      1.0.0
// @description  Blocking agar default game logic in firefox
// @author       Num JAI
// @match        http://agar.io/*
// @run-at       document-start
// @grant        none
 
// @downloadURL https://update.greasyfork.org/scripts/15755/HKG%20Agar%20Tool%20-%20Script%20blocker%20%28Firefox%20ONLY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/15755/HKG%20Agar%20Tool%20-%20Script%20blocker%20%28Firefox%20ONLY%29.meta.js
// ==/UserScript==
var injectedScript = '';
var script = document.createElement('script');
script.type = 'text/javascript';
 
injectedScript += 'i18n_lang="en";i18n_dict={"en":{"connecting":"Connecting","connect_help":"If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.","play":"Play","spectate":"Spectate","login_and_play":"Login and play","play_as_guest":"Play as guest","share":"Share","advertisement":"Advertisement","privacy_policy":"Privacy Policy","terms_of_service":"Terms of Service","changelog":"Changelog","instructions_mouse":"Move your mouse to control your cell","instructions_space":"Press <b>Space</b> to split","instructions_w":"Press <b>W</b> to eject some mass","gamemode_ffa":"FFA","gamemode_teams":"Teams","gamemode_experimental":"Experimental","region_select":" -- Select a Region -- ","region_us_east":"US East","region_us_west":"US West","region_north_america":"North America","region_south_america":"South America","region_europe":"Europe","region_turkey":"Turkey","region_poland":"Poland","region_east_asia":"East Asia","region_russia":"Russia","region_china":"China","region_oceania":"Oceania","region_australia":"Australia","region_players":"players","option_no_skins":"No skins","option_no_names":"No names","option_dark_theme":"Dark theme","option_no_colors":"No colors","option_show_mass":"Show mass","leaderboard":"Leaderboard","unnamed_cell":"An unnamed cell","last_match_results":"Last match results","score":"Score","leaderboard_time":"Leaderboard Time","mass_eaten":"Mass Eaten","top_position":"Top Position","position_1":"First","position_2":"Second","position_3":"Third","position_4":"Fourth","position_5":"Fifth","position_6":"Sixth","position_7":"Seventh","position_8":"Eighth","position_9":"Ninth","position_10":"Tenth","player_cells_eaten":"Player Cells Eaten","survival_time":"Survival Time","games_played":"Games played","highest_mass":"Highest mass","total_cells_eaten":"Total cells eaten","total_mass_eaten":"Total mass eaten","longest_survival":"Longest survival","logout":"Logout","stats":"Stats","shop":"Shop","party":"Party","party_description":"Play with your friends in the same map","create_party":"Create","creating_party":"Creating party...","join_party":"Join","back_button":"Back","joining_party":"Joining party...","joined_party_instructions":"You are now playing with this party:","party_join_error":"There was a problem joining that party, please make sure the code is correct, or try creating another party","login_tooltip":"Login with Facebook and get:<br /><br /><br />Start the game with more mass!<br />Level up to get even more starting mass!","create_party_instructions":"Give this link to your friends:","join_party_instructions":"Your friend should have given you a code, type it here:","continue":"Continue","option_skip_stats":"Skip stats","stats_food_eaten":"food eaten","stats_highest_mass":"highest mass","stats_time_alive":"time alive","stats_leaderboard_time":"leaderboard time","stats_cells_eaten":"cells eaten","stats_top_position":"top position","":""},"?":{}};i18n_lang=(window.navigator.userLanguage||window.navigator.language||"en").split("-")[0];if(!i18n_dict.hasOwnProperty(i18n_lang))i18n_lang="en";i18n=i18n_dict[i18n_lang];';
script.text = injectedScript;
document.getElementsByTagName('head')[0].appendChild(script);
 
var re = /\(function\(d,e\)/;
 
window.addEventListener('beforescriptexecute', function (e) {
        if (re.test(e.target.text)) {
                e.stopPropagation();
                e.preventDefault();
        }
}, true);