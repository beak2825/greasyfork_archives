// ==UserScript==

// @author         Silentio [upd: ElMarado]
// @collaborator   style: sw.East
// @namespace      https://greasyfork.org/ru/users/3065-чеширский-котъ

// @name           : HWM : Progress Bar : Silentios Mod :
// @name:en        : HWM : Progress Bar : Silentios Mod :
// @description    Показывает уровень Гильдий, Левела, Умелки Фракций  в виде прогресс бара
// @description:en Add progress bar for Combat, Faction and Guilds levels

// @icon           http://i.imgur.com/GScgZzY.jpg
// @version        2.1.2
// @encoding 	   utf-8

// @include        *//178.248.235.15/home.php*
// @include        *//178.248.235.15/pl_info.php*
// @include        *//*.heroeswm.*/home.php*
// @include        *//*.heroeswm.*/pl_info.php*
// @include        *//www.lordswm.com/home.php*
// @include        *//www.lordswm.com/pl_info.php*

// @compatible     chrome Chrome + TamperMonkey
// @compatible     firefox Firefox + TamperMonkey
// @compatible     opera Opera + TamperMonkey

// @copyright      2013-2021 @sw_East
// @license        MIT

// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand


// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/19900/%3A%20HWM%20%3A%20Progress%20Bar%20%3A%20Silentios%20Mod%20%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/19900/%3A%20HWM%20%3A%20Progress%20Bar%20%3A%20Silentios%20Mod%20%3A.meta.js
// ==/UserScript==

/*
 * This script is licensed under the
 * Creative Commons Attribution-NonCommercial-ShareAlike 2.5 Italy License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/2.5/it/
 */

// Funzione principale, eseguita al caricamento di tutta la pagina

function main(e){

    var lang_en = new Array();
    var lang_uk = lang_en;
    var lang_us = lang_en;
    var lang_com = lang_en;

    lang_en['Knight']               = 'Knight';
    lang_en['Knight2']              = 'Knight';
    lang_en['Necromancer']          = 'Necromancer';
    lang_en['Necromancer2']         = 'Necromancer';
    lang_en['Wizard']               = 'Wizard';
    lang_en['Wizard2']              = 'Wizard';
    lang_en['Elf']                  = 'Elf';
    lang_en['Elf2']                 = 'Elf';
    lang_en['Barbarian']            = 'Barbarian';
    lang_en['Barbarian2']           = 'Barbarian';
    lang_en['Barbarian3']           = 'Barbarian';
    lang_en['Dark elf'] 	        = 'Dark elf';
    lang_en['Dark elf2'] 	        = 'Tamer dark elf';
    lang_en['Demon']                = 'Demon';
    lang_en['Demon2']               = 'Demon';
    lang_en['Dwarf']                = 'Dwarf';
    lang_en['StBarbar']             = 'Tribal';
    lang_en['Pharaoh']              = 'Pharaoh';
    lang_en['Combat level']         = 'Combat level';
    lang_en['Hunters\' guild']      = 'Hunters\' guild';
    lang_en['Laborers\' guild']     = 'Laborers\' guild';
    lang_en['Gamblers\' guild']     = 'Gamblers\' guild';
    lang_en['Thieves\' guild']      = 'Thieves\' guild';
    lang_en['Rangers\' guild']      = 'Rangers\' guild';
    lang_en['Mercenaries\' guild']  = 'Mercenaries\' guild';
    lang_en['Tactics\' guild']      = 'Commanders\' guild';
    lang_en['Watchers\' guild']	    = 'Watchers\' guild';
    lang_en['Adventurers\' guild']  = 'Adventurers\' guild';
    lang_en['Leaders\' guild']      = 'Leaders\' Guild';
    lang_en['Smiths\' guild']       = 'Smiths\' guild';
    lang_en['Enchanters\' guild']   = 'Enchanters\' guild';
    lang_en['Progress Bar']         = 'Progress Bar';
    lang_en['Toggle']               = 'Toggle';
    lang_en['Show all factions']    = ustring('Ћв®Ўа ¦ вм ўбҐ да ЄжЁЁ');
    lang_en['Show active faction']  = ustring('Ћв®Ўа ¦ вм в®«мЄ®  ЄвЁў­го');


    var lang_ru = new Array();
    lang_ru['Knight']			    = ustring('ђлж ам');
    lang_ru['Knight2']			    = ustring('ђлж ам бўҐв ');
    lang_ru['Necromancer']		    = ustring('ЌҐЄа®¬ ­в');
    lang_ru['Necromancer2']		    = ustring('ЌҐЄа®¬ ­в - Ї®ўҐ«ЁвҐ«м б¬ҐавЁ');
    lang_ru['Wizard']			    = ustring('Њ Ј');
    lang_ru['Wizard2']			    = ustring('Њ Ј-а §агиЁвҐ«м');
    lang_ru['Elf']			        = ustring('ќ«мд');
    lang_ru['Elf2']			        = ustring('ќ«мд-§ Є«Ё­ вҐ«м');
    lang_ru['Barbarian']		    = ustring('‚ аў а');
    lang_ru['Barbarian2']		    = ustring('‚ аў а Єа®ўЁ');
    lang_ru['Barbarian3']		    = ustring('‚ аў а-и ¬ ­');
    lang_ru['Dark elf']			    = ustring('’Ґ¬­л© н«мд');
    lang_ru['Dark elf2']		    = ustring('’Ґ¬­л© н«мд-гЄа®вЁвҐ«м');
    lang_ru['Demon']			    = ustring('„Ґ¬®­');
    lang_ru['Demon2']			    = ustring('„Ґ¬®­ вм¬л');
    lang_ru['Dwarf']			    = ustring('ѓ­®¬');
    lang_ru['StBarbar']			    = ustring('‘вҐЇ­®© ў аў а');
    lang_ru['Pharaoh']			    = ustring('” а ®­');
    lang_ru['Combat level']		    = ustring('Ѓ®Ґў®© га®ўҐ­м');
    lang_ru['Hunters\' guild']		= ustring('ѓЁ«м¤Ёп Ће®в­ЁЄ®ў');
    lang_ru['Laborers\' guild']		= ustring('ѓЁ«м¤Ёп ђ Ў®зЁе');
    lang_ru['Gamblers\' guild']		= ustring('ѓЁ«м¤Ёп Љ авҐ¦­ЁЄ®ў');
    lang_ru['Thieves\' guild']		= ustring('ѓЁ«м¤Ёп ‚®а®ў');
    lang_ru['Rangers\' guild']		= ustring('ѓЁ«м¤Ёп ђҐ©­¤¦Ґа®ў');
    lang_ru['Mercenaries\' guild']	= ustring('ѓЁ«м¤Ёп Ќ Ґ¬­ЁЄ®ў');
    lang_ru['Tactics\' guild']		= ustring('ѓЁ«м¤Ёп ’ ЄвЁЄ®ў');
    lang_ru['Watchers\' guild']		= ustring('ѓЁ«м¤Ёп ‘ва ¦Ґ©');
    lang_ru['Adventurers\' guild']	= ustring('ѓЁ«м¤Ёп €бЄ вҐ«Ґ©');
    lang_ru['Leaders\' guild']		= ustring('ѓЁ«м¤Ёп ‹Ё¤Ґа®ў');
    lang_ru['Smiths\' guild']		= ustring('ѓЁ«м¤Ёп Љг§­Ґж®ў');
    lang_ru['Enchanters\' guild']	= ustring('ѓЁ«м¤Ёп Ћаг¦Ґ©­ЁЄ®ў');
    lang_ru['Progress Bar']		    = ustring('Џа®ЈаҐбб');
    lang_ru['Toggle']			    = ustring('гЎа вм/Ї®Є § вм');

    if ( location.hostname.match('lordswm') ) {
    var language=lang_en;
    } else {
    language=lang_ru;
    }
    //Factions'
    var nFactions = 10;
    var factions = [ //Ї®ап¤®Є ЇҐаўле 10 да ЄжЁ© ­Ґ ¬Ґ­пвм
    [T('Knight'),0],
    [T('Necromancer'),1],
    [T('Wizard'),2],
    [T('Elf'),3],
    [T('Barbarian'),4],
    [T('Dark elf'),5],
    [T('Demon'),6],
    [T('Dwarf'),7],
    [T('StBarbar'),8],
    [T('Pharaoh'),9],

    [T('Knight2'),0],
    [T('Necromancer2'),1],
    [T('Wizard2'),2],
    [T('Elf2'),3],
    [T('Barbarian2'),4],
    [T('Barbarian3'),4],
    [T('Dark elf2'),5],
    [T('Demon2'),6]
    ];

    //Combat experience table (23 levels)
    var combat_exp_lvl = [
        0,1500,4500,15000,32000,90000,190000,400000,860000,1650000,
        3000000,5000000,8500000,14500000,25000000,43000000,70000000,108000000,160000000,230000000,325000000,500000000,800000000
    ];

    //Racial skill table (14 levels)
    var racial_skill_lvl = [
        20,50,90,160,280,500,900,1600,2900,5300,9600,17300,35000,70000
    ];

    //Hunters' Guild (13 levels)
    var hunters_guild_lvl = [
        16,60,180,400,700,1200,2000,3000,4300,6000,8000,10500,13100
    ];

    //Laborers' Guild (17 levels)
    var laborers_guild_lvl = [
        90,180,360,720,1500,3000,5000,8000,12000,17000,23000,30000,38000,47000,57000,70000,90000
    ];

    //Gamblers' Guild (20 levels)
    var gamblers_guild_lvl = [
        10,30,60,100,150,210,280,360,450,550,660,800,1000,1300,2000,3000,6000,10000,17000,25000,
    ];

    //Thieves' Guild (22 levels)
    var thieves_guild_lvl = [
        50,120,240,400,600,840,1200,2000,3000,4300,6000,8000,10800,14000,17600,21600,26000,30800,36600,43600,52600,65000
    ];

    //Rangers' Guild (13 levels)
    var rangers_guild_lvl = [
        100,240,480,800,1200,1680,2400,4000,6000,8600,12000,16000,21600
    ];

    //Mercenaries' Guild (15 levels)
    var mercenaries_guild_lvl = [
        50,120,300,600,1000,1500,2200,3000,4000,5500,7800,11000,14500,18200,22200
    ];

    //Tactics Guild (13 levels)
    var tactics_guild_lvl = [
    150,350,750,1400,2200,3200,4300,5600,7000,8500,10000,11700,14500
    ];

    //Watchers' Guild (8 levels)
    var watchers_guild_lvl = [
        60,200,450,850,1500,2700,4500,7200
    ];

    //Adventurers' Guild (3 levels)
    var adventurers_guild_lvl = [
        1600,3600,8100
    ];

    //Leaders' Guild (12 levels)
    var leaders_guild_lvl = [
        80, 180, 300, 440, 600, 780, 990, 1230, 1500, 2200, 7000, 10000
    ];
    //Smiths' Guild (9 levels)
    var smiths_guild_lvl = [
        30,80,165,310,555,970,1680,2885,5770
    ];

    //Enchanters' Guild (5 levels)
    var enchanters_guild_lvl = [
        104,588,2200,7000,10000
    ];

    //Enchanters' Guild branches (11 levels)
    var enchanters_guild_branches_lvl = [
        8,29,71,155,295,505,799,1191,1695,6000,12000
    ];

    /**
 * ============= Style =============
 */

GM_addStyle ( `

.silentios_progress {
    position: relative;
    width: 200px;
    margin: 3px 0 3px 8px;
    background-color: #727272;
    height: 5px;
    padding: 0 auto;
}
.silentios_progress_bar {
    height: 5px;
    margin: 0 0 -1px 0;
    max-width: 200px;
    background-color: #8bc34a;
    padding: 0 auto;
    -webkit-animation: animate-positive 1s;
    animation: animate-positive 1s;
}
.silentios_bar_perc {
    background-color: #fff;
    color: #455a64;
    font-size: 9px;
    margin-top: -9px;
    padding: 0 1px;
    text-align: center;
    height: 9px;
    width: 30px;
}
.color_bar_perc {padding: 0 1px;}
.tooltip {position: relative;}
.tooltip .tooltiptext {
    visibility: hidden;
    width: 60px;
    background-color: #727272;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    top: -10px;
    bottom: auto;
    left: 105%;
}
.tooltip .tooltiptext::after {
    content: " ";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #727272 transparent transparent;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
@-webkit-keyframes animate-positive{0%{ width: 0}}
@keyframes animate-positive{0%{width: 0}}

` );
/* Style End */

    var XPFirst = XPathResult.FIRST_ORDERED_NODE_TYPE;         // Costante per il primo elemento per XPath
    var XPList  = XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;    // Costante per una lista di elementi per XPath

    function init() {
        //Option Menu
        GM_setValue("SHOW_ONLY_ACTIVE_FACTION_PROGRESS_BAR", false);

        makeMenuToggle("SHOW_HUNTERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Hunters\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_LABORERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Laborers\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_GAMBLERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Gamblers\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_THIEVES_PROGRESS_BAR", true, T('Toggle') +" "+ T('Thieves\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_RANGERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Rangers\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_MERCENARIES_PROGRESS_BAR", true, T('Toggle') +" "+ T('Mercenaries\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_TACTICS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Tactics\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_WATCHERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Watchers\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_ADVENTURES_PROGRESS_BAR", true, T('Toggle') +" "+ T('Adventurers\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_LEADERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Leaders\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_SMITHS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Smiths\' guild'), T('Progress Bar'));
        makeMenuToggle("SHOW_ENCHANTERS_PROGRESS_BAR", true, T('Toggle') +" "+ T('Enchanters\' guild'), T('Progress Bar'));
    }
//'
    function find(xpath, xpres,startnode){
        if (!startnode) {startnode=document;}
        var ret = document.evaluate(xpath, startnode, null, xpres, null);
        return  xpres == XPFirst ? ret.singleNodeValue : ret;
    }

    function insertAfter(newChild, refChild) {
        node.parentNode.insertBefore(newChild, refChild.nextSibling);
    }

    function elem(tag, content){
        var ret = document.createElement(tag);
        ret.innerHTML = content;
        return ret;
    }

    function T(testo){
        if (language[testo] == undefined) return lang_en[testo]; else return language[testo];
    }

    function makeMenuToggle(key, defaultValue, label, prefix) {
        window[key] = GM_getValue(key, defaultValue);

        GM_registerMenuCommand((prefix ? prefix+": " : "") + label, function() {
            GM_setValue(key, !window[key]);
            location.reload();
        });
    }

    function makeProgressBar(exp_attuale, lvl_attuale, exp_lvls){
        if (lvl_attuale=="") {
            for (var i=0; i <= exp_lvls.length; i++) {
                if (exp_lvls[i] > exp_attuale || i == exp_lvls.length) {
                    lvl_attuale = i;
                    break;
                }
            }
        }

        var exp_necessaria = exp_lvls[lvl_attuale];
        if (lvl_attuale == 0) {
            var perc = parseFloat(exp_attuale * 300 / exp_necessaria).toFixed(6);
        } else if (lvl_attuale == exp_lvls.length) {
                perc = 300;
        } else {
            exp_attuale = exp_attuale - exp_lvls[lvl_attuale-1];
            exp_necessaria = exp_necessaria - exp_lvls[lvl_attuale-1];
                //perc = Math.round(exp_attuale * 300 / exp_necessaria);
            perc = parseFloat(exp_attuale * 300 / exp_necessaria).toFixed(6);
        }
        var perc_text_round = Math.round(perc / 300 * 100);
        var perc_text = parseFloat(perc / 300 * 100).toFixed(2);
        var progress_bar_html = "<div class=\"silentios_progress tooltip\">"+
                                    "<span class=\"tooltiptext\">" + perc_text + "%</span>"+
                                    "<div class=\"silentios_progress_bar\" style=\"width:" + perc_text + "%\"></div>"+
                                    "<div class=\"silentios_bar_perc color_bar_perc\" style=\"margin-left:"+ perc_text +"%\">" + perc_text_round +" %</div>"+
                                "</div>";
        return progress_bar_html;
    }

    function showExpBar(){
        var tabelle = find("//table", XPList);
        var player_info = "";
        var skill_info = "";
        var player_faction = "";
    var temp;

        if (location.href.indexOf('home.php') != -1) {
            for (var i = 25; i < tabelle.snapshotLength; i++){

                if (!tabelle.snapshotItem(i)) continue;
                if (!tabelle.snapshotItem(i).childNodes[0]) continue;
                if (!tabelle.snapshotItem(i).childNodes[0].childNodes[0]) continue;

                //Player Info
                if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0]) {
                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf(T('Combat level') +":") > 0) {
                        player_info = tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0];
                    }
                }

                //Skill Info
                if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1]) {
                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1].innerHTML.indexOf(T('Knight') +":") > 0) {
                        skill_info = tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1];
                    }
                }

        //Faction Info
                if (player_faction == "") {
                   if(tabelle.snapshotItem(i).childNodes[0].childNodes[0].innerHTML.search(/title\=\"(.*?)\"/) > 0) {
                        player_faction = RegExp.$1;
            var not_fr = true;
            for (var j=0; j < factions.length; j++){
                if (factions[j][0] == player_faction)  { not_fr = false; break; }
            }
            if (not_fr) {player_faction="";}
                    }
                }

                if (player_info !="" && skill_info != "" && player_faction != "") break;
            }


        } else if (location.href.indexOf('pl_info.php') != -1) {
            for (i = 25; i < tabelle.snapshotLength; i++){
                if (!tabelle.snapshotItem(i)) continue;
                if (!tabelle.snapshotItem(i).childNodes[0]) continue;
                temp=tabelle.snapshotItem(i).childNodes[0];

                //Player Info
                if (temp.childNodes[2]) {
                    if (temp.childNodes[2].childNodes[0]) {
                        if (temp.childNodes[2].childNodes[0].textContent.indexOf(T('Combat level') +":") > 0) {
                            player_info = temp.childNodes[2].childNodes[0];
                        }
                    }
                }
                //Skill Info
                if (temp.childNodes[1]) {
                    if (temp.childNodes[1].childNodes[1]) {
                        if (temp.childNodes[1].childNodes[1].textContent.indexOf(T('Knight')) > 0) {
                            skill_info = temp.childNodes[1].childNodes[1];
                        }
                    }
                }

                //Faction Info
                if (player_faction == "") {
                    if (temp.childNodes[0]) {
                        if (temp.childNodes[0].childNodes[0]) {
                            if (temp.childNodes[0].childNodes[0].innerHTML.search(/\.png\" title\=\"(.*?)\"/) > 0) {
                                player_faction = RegExp.$1;
//alert(player_faction+'\n\n'+tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0].innerHTML);
                not_fr = true;
                for (j=0; j < factions.length; j++){
                    if (factions[j][0] == player_faction)  { not_fr = false; break; }
                }
                if (not_fr) {player_faction="";}
                            }
                        }
                    }
                }

                if (player_info !="" && skill_info != "" && player_faction != "") break;
            }

        }

        //========== Combat Level
        var lvl_info = player_info.textContent.split("\u00BB")[1];
        lvl_info.search(/(.*)\((.*)\)(.*)/);
        var lvl_attuale = eval(RegExp.$1.replace(T('Combat level') +": ",""));

        var exp_attuale =lvl_info.substring(lvl_info.indexOf("(")+1,lvl_info.indexOf(")")).replace(/,{1,}/g,"")*1;

        var progress_bar_html = makeProgressBar(exp_attuale, lvl_attuale, combat_exp_lvl);
        player_info.innerHTML = player_info.innerHTML.replace("</font><br><br>", "</font>"+ progress_bar_html +"<br>");
        player_info.innerHTML = player_info.innerHTML.replace("</font><br>", "</font>"+ progress_bar_html +"<br>");

        var skills = skill_info.innerHTML.split(">&nbsp;&nbsp;");

        //========== Player Faction(s)
    var active_faction_index;

            for(var faction_index=0; faction_index<nFactions; faction_index++){
                lvl_info = skills[faction_index];
                lvl_info.search(/\((\d*.?\d*)\)/);
                exp_attuale = RegExp.$1;

                progress_bar_html = makeProgressBar(exp_attuale, "", racial_skill_lvl);

                if (faction_index<nFactions-1) {
                    var next_faction = factions[faction_index + 1][0];
                        skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ next_faction, progress_bar_html +"&nbsp;&nbsp;"+ next_faction);
                        skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;<b>"+ next_faction, progress_bar_html +"&nbsp;&nbsp;<b>"+ next_faction);
                } else {
                    skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Hunters\' guild'), progress_bar_html +"<br>&nbsp;&nbsp;"+ T('Hunters\' guild'));
                }
            }
//        }


        //========== Hunters' guild
        if (GM_getValue("SHOW_HUNTERS_PROGRESS_BAR", true)) {
            lvl_info = skills[10];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", hunters_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Laborers\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Laborers\' guild'));
        }


        //========== Laborers' guild
        if (GM_getValue("SHOW_LABORERS_PROGRESS_BAR", true)) {
            lvl_info = skills[11];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", laborers_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Gamblers\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Gamblers\' guild'));
        }


        //========== Gamblers' guild
        if (GM_getValue("SHOW_GAMBLERS_PROGRESS_BAR", true)) {
            lvl_info = skills[12];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", gamblers_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Thieves\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Thieves\' guild'));
        }


        //========== Thieves' guild
        if (GM_getValue("SHOW_THIEVES_PROGRESS_BAR", true)) {
            lvl_info = skills[13];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", thieves_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Rangers\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Rangers\' guild'));
        }

        //========== Rangers' guild
        if (GM_getValue("SHOW_RANGERS_PROGRESS_BAR", true)) {
            lvl_info = skills[14];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", rangers_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Mercenaries\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Mercenaries\' guild'));
        }

       //========== Mercenaries' guild
        if (GM_getValue("SHOW_MERCENARIES_PROGRESS_BAR", true)) {
            lvl_info = skills[15];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", mercenaries_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Tactics\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Tactics\' guild'));
        }


        //========== Tactics' guild
        if (GM_getValue("SHOW_TACTICS_PROGRESS_BAR", true)) {
        lvl_info = skills[16];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", tactics_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Watchers\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Watchers\' guild'));
        }

        //========== Watchers' guild
        if (GM_getValue("SHOW_WATCHERS_PROGRESS_BAR", true)) {
            lvl_info = skills[17];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;
            progress_bar_html = makeProgressBar(exp_attuale, "", watchers_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Adventurers\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Adventurers\' guild'));
        }

        //========== Adventurers' guild
        if (GM_getValue("SHOW_ADVENTURES_PROGRESS_BAR", true)) {
            lvl_info = skills[18];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;
            progress_bar_html = makeProgressBar(exp_attuale, "", adventurers_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Leaders\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Leaders\' guild'));
        }

        //========== Leaders' guild
        if (GM_getValue("SHOW_LEADERS_PROGRESS_BAR", true)) {
            lvl_info = skills[19];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;
            progress_bar_html = makeProgressBar(exp_attuale, "", leaders_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ T('Smiths\' guild'), progress_bar_html +"&nbsp;&nbsp;"+ T('Smiths\' guild'));
        }

        //========== Smiths' guild
        if (GM_getValue("SHOW_SMITHS_PROGRESS_BAR", true)) {
            lvl_info = skills[20];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;

            progress_bar_html = makeProgressBar(exp_attuale, "", smiths_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace('<div id="home_2">', progress_bar_html +'<div id="home_2">');
        }


        //========== Enchanters' guild
        if (GM_getValue("SHOW_ENCHANTERS_PROGRESS_BAR", true)) {
            lvl_info = skills[21];
            lvl_info.search(/\((\d*.?\d*)\)/);
            exp_attuale = RegExp.$1;
        progress_bar_html = makeProgressBar(exp_attuale, "", enchanters_guild_lvl);
            skill_info.innerHTML = skill_info.innerHTML.replace("<div id=\"mod_guild\">", progress_bar_html +"<div id=\"mod_guild\">");
        }

    }

    init();

    // Azioni specifiche per alcune pagine
    if (location.href.indexOf('home.php') != -1)        showExpBar();
    if (location.href.indexOf('pl_info.php') != -1)     showExpBar();
};
//****************************************************
/** ЃЁЎ«Ё®вҐЄ  о­ЁЄ®¤
*
* ђҐ «Ё§гҐв дг­ЄжЁЁ а Ў®вл б о­ЁЄ®¤®¬.
* @file lib_unicode.js
* @version 1.1.0
* @author DrunkenStranger
* @link http://userscripts.org/users/362572
* @license GPL
*/
function uchar(s) {
    switch (s[0]) {
        case "Ђ": return "\u0410";
        case "Ѓ": return "\u0411";
        case "‚": return "\u0412";
        case "ѓ": return "\u0413";
        case "„": return "\u0414";
        case "…": return "\u0415";
        case "†": return "\u0416";
        case "‡": return "\u0417";
        case "€": return "\u0418";
        case "‰": return "\u0419";
        case "Љ": return "\u041a";
        case "‹": return "\u041b";
        case "Њ": return "\u041c";
        case "Ќ": return "\u041d";
        case "Ћ": return "\u041e";
        case "Џ": return "\u041f";
        case "ђ": return "\u0420";
        case "‘": return "\u0421";
        case "’": return "\u0422";
        case "“": return "\u0423";
        case "”": return "\u0424";
        case "•": return "\u0425";
        case "–": return "\u0426";
        case "—": return "\u0427";
        case "": return "\u0428";
        case "™": return "\u0429";
        case "љ": return "\u042a";
        case "›": return "\u042b";
        case "њ": return "\u042c";
        case "ќ": return "\u042d";
        case "ћ": return "\u042e";
        case "џ": return "\u042f";
        case " ": return "\u0430";
        case "Ў": return "\u0431";
        case "ў": return "\u0432";
        case "Ј": return "\u0433";
        case "¤": return "\u0434";
        case "Ґ": return "\u0435";
        case "¦": return "\u0436";
        case "§": return "\u0437";
        case "Ё": return "\u0438";
        case "©": return "\u0439";
        case "Є": return "\u043a";
        case "«": return "\u043b";
        case "¬": return "\u043c";
        case "­": return "\u043d";
        case "®": return "\u043e";
        case "Ї": return "\u043f";
        case "а": return "\u0440";
        case "б": return "\u0441";
        case "в": return "\u0442";
        case "г": return "\u0443";
        case "д": return "\u0444";
        case "е": return "\u0445";
        case "ж": return "\u0446";
        case "з": return "\u0447";
        case "и": return "\u0448";
        case "й": return "\u0449";
        case "к": return "\u044a";
        case "л": return "\u044b";
        case "м": return "\u044c";
        case "н": return "\u044d";
        case "о": return "\u044e";
        case "п": return "\u044f";
        case "р": return "\u0401";
        case "с": return "\u0451";
        default: return s[0];
    }
}

function ustring(s) {
    s = String(s);
    var result = "";
    for (var i = 0; i < s.length; i++) result += uchar(s[i]);
    return result;
}
//****************************************************

main(false);