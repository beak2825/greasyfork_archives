// ==UserScript==
// @name         Hentai Heroes Seasons++
// @namespace    http://tampermonkey.net/
// @version      0.89
// @description  Displays more described info about seasons opponents and allows you to sort girls by name, class and rarity when selecting your battle team. By addition, it gives you an option to save and load 3 different girl teams, to later use in game.
// @author       randomfapper34
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413668/Hentai%20Heroes%20Seasons%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/413668/Hentai%20Heroes%20Seasons%2B%2B.meta.js
// ==/UserScript==

var $ = window.jQuery;
var storage = window.localStorage;
var arenaGirls = undefined;
var girlsData  = undefined;
var totalTooltips = 80;
var sheet = (function() {
	var style = document.createElement('style');
	document.head.appendChild(style);
	return style.sheet;
})();

$(document).ready(function() {

    if (window.location.pathname.indexOf('battle') != -1) {
        updateFilterGirlData("default");
        $("#cancel_team").after('<button id="arena_filter" class="blue_text_button">Filter</button>');
        $("#cancel_team").before(createFilterBox("default"));
        createFilterEvents();
    }

    if (window.location.pathname.indexOf('season-arena') != -1) {
        $('#contains_all section').css('top', '60px');
        $('#season-arena .season_arena_block.battle_hero').css('height', '100%');
        updateFilterGirlData("seasons");
        $("h3.season_hero_harem_text").after('<button id="arena_filter" class="blue_button_L" style="position: absolute; top: 5px; right: 10px;">Filter</button>');
        $("#battle_team_girlslist").before(createFilterBox("seasons"));
        createFilterEvents();
        upgradeSeasonsInfo();
    }

    sheet.insertRule('.personal_info.hero {'
                     + 'margin-top: 5px; }');

    sheet.insertRule('#season-arena .season_arena_block .hero_stats div {'
                     + 'margin: 0; }');

});

/* ======================================
              Seasons Upgrades
   ====================================== */


function getPlayerStats(currentTeam) {
    var i, vals = {};
    vals = {
        damage: "",
        def_carac1: "",
        def_carac2: "",
        def_carac3: "",
        ego: "",
        orgasm: ""
    };

    var ac = alpha_caracs[currentTeam[0]];
    for (i in ac) {
        vals[i] = number_format_lang(ac[i]);
    }
    if (currentTeam[1] && currentTeam[2]) {
        var bonus = alpha_caracs[currentTeam[1]].bonus + alpha_caracs[currentTeam[2]].bonus;
        var subcars = ["damage", "def_carac1", "def_carac2", "def_carac3"];
        for (i in subcars) {
            i = subcars[i];
            vals[i] += "-" + number_format_lang(ac[i] + bonus);
        }
    }

    return vals;
}

function upgradeSeasonsInfo() {
    //update defense info for player
    var playerData = getPlayerStats(team);
    var totalDefenses = createDefenseInfo(1, playerData.def_carac1) + createDefenseInfo(2, playerData.def_carac2) + createDefenseInfo(3, playerData.def_carac3);
    $('.battle_hero .hero_stats div:eq(1)').replaceWith(totalDefenses);

    //update defense info for opponents
    $('.season_arena_block.opponent').each(function() {
        var opponent = $(this);
        var personalData = opponent.find('.personal_info > img').attr('onclick');
        var regex = new RegExp('id:\\s*?(\\d+)', 'g');
        var playerID = regex.exec(personalData)[1];
        var params = {
            class: "Leagues",
            action: "get_opponent_info",
            opponent_id: playerID
        };

        hh_ajax(params, function(data) {
            var regex = new RegExp("playerLeaguesData = ({.*?});", "i")
            var playerData = data.html.match(regex)[1];
            var opponentData = JSON.parse(playerData);
            var caracs = [convertToDefenseFormat(opponentData.caracs.def_carac1, opponentData.caracs.def_carac1_max),
                          convertToDefenseFormat(opponentData.caracs.def_carac2, opponentData.caracs.def_carac2_max),
                          convertToDefenseFormat(opponentData.caracs.def_carac3, opponentData.caracs.def_carac3_max)];
            var totalDefenses = createDefenseInfo(1, caracs[0], true) + createDefenseInfo(2, caracs[1], true) + createDefenseInfo(3, caracs[2], true);
            opponent.find('.hero_stats div:eq(1)').replaceWith(totalDefenses);
        });
    });
}

function convertToDefenseFormat(min, max) {
    return Math.ceil(min).toLocaleString('en-IN') + '-' + Math.ceil(max).toLocaleString('en-IN');
}

function createHomepageSeasonInfo() {
    var totalHTML = '<div class="h_container_univ" style="margin: 4px 0px 2px 2px;">'
    + '<img style="width: 20px;" src="https://hh2.hh-content.com/pictures/design/ic_kiss.png">'
    + '<div id="kisses_ind" class="tier_bar_container" style="position: relative; padding: 1px; margin-left: 2px;">'
    + '<div id="kisses_bar" class="tier_bar bordeaux_gradient" style="width: 100%;"></div>'
    + '<div class="white_text centered_s"> <div id="kisses_data" style="font-size: 12px;"><span id="current_kisses">10</span>/<span id="max_kisses">10</span></div> </div></div>'
    + '<div style="width: 100px;"><span id="scriptSeasonsTimer" style="font-size: 12px;">36m 17s</span></div>';

    totalHTML += '</div>';

    return totalHTML;
}

function createDefenseInfo(carac, defenseData, forOpponent) {
    var heroType = '';
    var heroClass = ''
    var extraClass = '';
    ++totalTooltips;
    if (forOpponent) extraClass = ' text_small';

    if (carac == 1) {
        heroType = 'Shagger';
        heroClass = 'Hardcore';
    }
    else if (carac == 2) {
        heroType = 'Lover';
        heroClass = 'Charm';
    }
    else if (carac == 3) {
        heroType = 'Expert';
        heroClass = 'Know-how';
    }

    var totalHTML = '<div hh_title="Defense against ' + heroType + ', specialist in ' + heroClass + '" tooltip-id="tooltip_' + totalTooltips + '">'
    + '<span carac="def' + carac + '"><span class="pull_right' + extraClass + '">' + defenseData + '</span></span>';

    totalHTML += '</div>';

    return totalHTML;
}

/* ======================================
              Team Filtering
   ====================================== */

function updateFilterGirlData(type) {
    if (type == "seasons") arenaGirls = $("#battle_team_girlslist div.change_team_girls");
    else                   arenaGirls = $("#battle_team_girlslist div.girl");

    girlsData = $.map(arenaGirls, function(girl, index) {
        return JSON.parse($(girl).attr("new-girl-tooltip-data"));
    });
}

function createFilterEvents() {
    $("#arena_filter").on('click', function() {
        if (typeof arenaGirls === 'undefined' || typeof girlsData === 'undefined') return;
        var currentBoxDisplay = $("#arena_filter_box").css('display');
        $("#arena_filter_box").css('display', currentBoxDisplay == "none" ? 'block' : 'none');
    });
    $("#sort_class").on('change', sortGirls);
    $("#sort_rarity").on('change', sortGirls);
    $("#sort_name").get(0).oninput = sortGirls;
    $("#save_team").on('click', saveTeam);
    $("#load_team").on('click', loadTeam);
}

function sortGirls() {
    var sorterClass = $("#sort_class").get(0).selectedIndex;
    var sorterRarity = $("#sort_rarity").get(0).value;
    var sorterName = $("#sort_name").get(0).value;
    var nameRegex = new RegExp(sorterName, "i");

    var girlsSorted = $.map(girlsData, function(girl, index) {
        var matchesClass  = (girl.class == sorterClass) || (sorterClass == 0);
        var matchesRarity = (girl.rarity == sorterRarity) || (sorterRarity == 'all');
        var matchesName   = (girl.Name.search(nameRegex) > -1);

        return (matchesClass && matchesRarity && matchesName) ? index : null;
    });

    $.each(arenaGirls, function(index, girlElem) {
        $(girlElem).css('display', $.inArray(index, girlsSorted) > -1 ? 'block' : 'none');
    });

    //update scroll display
    $("#battle_team_girlslist").css('padding-left', '5px');
    $("#battle_team_girlslist").css('overflow', '');
    $("#battle_team_girlslist").css('overflow', 'hidden');
}

function saveTeam() {
    var selectedGirls = $(".team_girl .girl");
    var selectedIds = $.map(selectedGirls, function(girl, index) {
        return $(girl).attr("id_girl");
    });
    var teamUsed = $("#save_team_select").get(0).selectedIndex;
    storage.setItem('arenaSavedTeam' + teamUsed, JSON.stringify(selectedIds));
}

function loadTeam() {
    var teamUsed = $("#load_team_select").get(0).selectedIndex;
    var teamSaved = storage.getItem('arenaSavedTeam' + teamUsed);
    if (teamSaved == null || typeof teamSaved == 'undefined') return;

    var selectedIds = JSON.parse(teamSaved);
    if (Array.isArray(selectedIds)) {
        $.each(arenaGirls, function(index, girlElem) {
            var girlId = $(girlElem).attr("id_girl");
            $(girlElem).css('display', $.inArray(girlId, selectedIds) > -1 ? 'block' : 'none');
        });

        //update scroll display
        $("#battle_team_girlslist").css('overflow', '');
        $("#battle_team_girlslist").css('overflow', 'hidden');
    }
}

function createFilterBox(type) {
    var totalHTML = '<div id="arena_filter_box" class="form-wrapper" style="';
    if (type == "default") totalHTML += 'bottom: 45px; ';
    else                   totalHTML += 'top: 58px; right: 10px; ';
    totalHTML += 'position: absolute; width: 275px; z-index: 99; border-radius: 8px 10px 10px 8px; background-color: #1e261e; box-shadow: rgba(255, 255, 255, 0.73) 0px 0px; padding: 5px; border: 1px solid #ffa23e; display: none;">';

    totalHTML += '<div class="form-control"><div class="input-group">'
    + '<label class="head-group" for="sort_name">Searched name</label>'
    + '<input type="text" autocomplete="off" id="sort_name" placeholder="Girl name" icon="search">'
    + '</div></div>';

    totalHTML += '<div class="form-control"><div class="select-group">'
    + '<label class="head-group" for="sort_class">Searched class</label>'
    + '<select name="sort_class" id="sort_class" icon="down-arrow">'
    + '<option value="all" selected="selected">All</option><option value="hardcore">Hardcore</option><option value="charm">Charm</option><option value="knowhow">Know-how</option>'
    + '</select></div></div>';

    totalHTML += '<div class="form-control"><div class="select-group">'
    + '<label class="head-group" for="sort_rarity">Searched rarity</label>'
    + '<select name="sort_rarity" id="sort_rarity" icon="down-arrow">'
    + '<option value="all" selected="selected">All</option><option value="starting">Starting</option><option value="common">Common</option><option value="rare">Rare</option><option value="epic">Epic</option><option value="legendary">Legendary</option>'
    + '</select></div></div>';

    totalHTML += '<div class="form-control"><button id="save_team" class="blue_text_button" style="margin-top: 10px; padding: 5px 20px; width: 50%;">Save as</button>'
    + '<div class="select-group" style="display: inline-block; float: right; width: 45%;">'
    + '<label class="head-group" for="save_team_select">Team number</label>'
    + '<select name="save_team_select" id="save_team_select" icon="down-arrow">'
    + '<option value="1" selected="selected">Team 1</option><option value="2">Team 2</option><option value="3">Team 3</option>'
    + '</select></div></div>';

    totalHTML += '<div class="form-control"><button id="load_team" class="blue_text_button" style="margin-top: 10px; padding: 5px 20px; width: 50%;">Load from</button>'
    + '<div class="select-group" style="display: inline-block; float: right; width: 45%;">'
    + '<label class="head-group" for="load_team_select">Team number</label>'
    + '<select name="load_team_select" id="load_team_select" icon="down-arrow">'
    + '<option value="1" selected="selected">Team 1</option><option value="2">Team 2</option><option value="3">Team 3</option>'
    + '</select></div></div>';

    totalHTML += '</div>';

    return totalHTML;
}
