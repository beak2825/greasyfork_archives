/*jshint esversion: 8, multistr: true */
/* globals OLCore, OLSettings */

// ==UserScript==
// @name           OnlineligaLineupHelper_RWK
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.2.0
// @license        LGPLv3
// @description    Zusatzinfos rund um die Aufstellung bei Onlineliga.de
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444356/OnlineligaLineupHelper_RWK.user.js
// @updateURL https://update.greasyfork.org/scripts/444356/OnlineligaLineupHelper_RWK.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 20.07.2021 Release
 * 0.1.1 23.07.2021 Toggle permanent fitness
 * 0.1.2 03.09.2021 Bugfix lastMatch
 *                  correct L-Value calculation
 * 0.1.3 13.10.2021 OLSettings integration
 * 0.1.4 28.10.2021 optional mobile player state
 * 0.1.5 03.11.2021 Bugfix export
 * 0.1.6 13.11.2021 Bugfix export
 * 0.1.7 09.01.2022 + average lineup values
 * 0.2.0 24.01.2022 i18n support
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;
    const gmValues = GM_listValues();
    const tbLang = OLSettings.get("ToolboxLanguage", OLi18n.shortLang);

    const Lineup = {squad:[]};

    const Export = {};

    /*****
     * Export
     ****/

     Export.positionVal = {};
     Export.positionVal[t("ST")]=5;
     Export.positionVal[t("OM")]=4;
     Export.positionVal[t("DM")]=3;
     Export.positionVal[t("AV")]=2;
     Export.positionVal[t("IV")]=1;
     Export.positionVal[t("TW")]=0;

    Export.attributeNames = {
        'LEISTUNGSSTAND': tt('Leistungsstand'),
        'FITNESS': tt('Fitness'), 
        'MATCHTIME': tt('Ligaspiel'), 
        'FRIENDLYTIME': tt('Friendly'), 
        'TRAINING': tt('Training')
    };

    Export.playersToStringUnpivot = function(players){

        function isFieldPlayerSkill(skill){
						if (!isNaN(skill)){
							return ![1,2,3,4,5,6].includes(Number(skill));
						}
            return skill.toLowerCase() !== t('Linie').toLowerCase() &&
                   skill.toLowerCase() !== t('Libero').toLowerCase() &&
                   skill.toLowerCase() !== t('Fuss').toLowerCase() &&
                   skill.toLowerCase() !== t('Spieleröffnung').toLowerCase() &&
                   skill.toLowerCase() !== t('Rauslaufen / 1 zu 1').toLowerCase() &&
                   skill.toLowerCase() !== t('Strafraum').toLowerCase();
        }

        function isGoalKeeperSkill(skill){
						if (!isNaN(skill)){
							return [1,2,3,4,5,6,28,39].includes(Number(skill));
						}
            return skill.toLowerCase() === t('Linie').toLowerCase() ||
                   skill.toLowerCase() === t('Libero').toLowerCase() ||
                   skill.toLowerCase() === t('Fuss').toLowerCase() ||
                   skill.toLowerCase() === t('Spieleröffnung').toLowerCase() ||
                   skill.toLowerCase() === t('Rauslaufen / 1 zu 1').toLowerCase() ||
                   skill.toLowerCase() === t('Strafraum').toLowerCase() ||
                   skill.toLowerCase() === t('Talent').toLowerCase() ||
                   skill.toLowerCase() === t('Leistungsstand').toLowerCase() ||
                   skill.toLowerCase() === t('Fitness').toLowerCase() ||
                   skill.toLowerCase() === "friendlytime" ||
                   skill.toLowerCase() === "matchtime" ||
                   skill.toLowerCase() === "training" ;
        }

        players.sort( (a, b) => (a.positionValue - b.positionValue) || a.name.localeCompare(b.name));
        const tab = [];
        for (const p of players){
            tab.push(`${p.name}\tForm\t${p.form || ''}`);
            p.extended = p.extended || { attributeDetails: {}};
            const ext = p.extended.attributeDetails;
            const pos = p.positions[0].toUpperCase();
            for (const x of Object.keys(ext)){
                if (pos === t("TW") && isGoalKeeperSkill(x)) {
                    tab.push(`${p.name}\t${(Export.attributeNames[x] || (OLi18n.Properties[x] ? OLi18n.Properties[x][tbLang] : x))}\t${ext[x]}`);
                } else if (pos !== t("TW") && isFieldPlayerSkill(x)){
                    tab.push(`${p.name}\t${(Export.attributeNames[x] || (OLi18n.Properties[x] ? OLi18n.Properties[x][tbLang] : x))}\t${ext[x]}`);
                }
            }
        }
        return tab.join("\r\n");
    };

    Export.playersToString = function(players, withExtData, withHeadlines, upsOnly){
        players.sort( (a, b) => (b.positionValue - a.positionValue) || a.name.localeCompare(b.name));
        const tab = [];
        if (withHeadlines){
            let headline = tt("Name");
            if (!upsOnly) {
                headline += "\tPosition\tPosition 2\tPosition 3";
            }
            headline += "\tFitness\tForm";
            if (!upsOnly) {
                headline += `\t${tt("Kondition")}\t${tt("Schnelligkeit")}\t${tt("Technik")}\t${tt("Schusstechnik")}\t${tt("Schusskraft")}\t${tt("Kopfball")}\t${tt("Zweikampf")}\t${tt("Taktikverständnis / Taktiktreue")}\t${tt("Athletik")}\t${tt("Linker Fuß")}\t${tt("Rechter Fuß")}\t${tt("Linie")}\t${tt("Libero")}\t${tt("Fuss")}\t${tt("Spieleröffnung")}\t${tt("Rauslaufen / 1 zu 1")}\t${tt("Strafraum")}`;
            }
            if (withExtData || upsOnly) {
                headline += `\t${tt("Kondition")}\t${tt("Schnelligkeit")}\t${tt("Technik")}\t${tt("Schusstechnik")}\t${tt("Schusskraft")}\t${tt("Kopfball")}\t${tt("Zweikampf")}\t${tt("Taktikverständnis / Taktiktreue")}\t${tt("Athletik")}\t${tt("Linker Fuß")}\t${tt("Rechter Fuß")}\t${tt("Linie")}\t${tt("Libero")}\t${tt("Fuss")}\t${tt("Spieleröffnung")}\t${tt("Rauslaufen / 1 zu 1")}\t${tt("Strafraum")}`;
            }
            tab.push(headline);
        }
        for (const p of players){
            p.extended = p.extended || { attributeDetails: {}};
            const ext = p.extended.attributeDetails;
            let formatted = p.name;
            if (!upsOnly) {
                formatted += "\t" +
                      p.positions.map(pos => OLi18n.translate(pos)).join("\t");
            }
            const propId = OLCore.Base.propId;
            formatted += "\t" +
                  (ext[propId.fitness] || p.attributes[propId.fitness] || 0) + "\t" +
                  p.form;
            if (!upsOnly) {
                formatted += "\t" +
                  (ext[propId.endurance] || p.attributes[propId.endurance] || 0) + "\t" +
                  (ext[propId.speed] || p.attributes[propId.speed] || 0) + "\t" +
                  (ext[propId.technique] || p.attributes[propId.technique] || 0) + "\t" +
                  (ext[propId.shooting] || p.attributes[propId.shooting] || 0) + "\t" +
                  (ext[propId.shootingPower] || p.attributes[propId.shootingPower] || 0) + "\t" +
                  (ext[propId.header] || p.attributes[propId.header] || 0) + "\t" +
                  (ext[propId.duel] || p.attributes[propId.duel] || 0) + "\t" +
                  (ext[propId.tactics] || p.attributes[propId.tactics] || 0) + "\t" +
                  (ext[propId.athleticism] || p.attributes[propId.athleticism] || 0) + "\t" +
                  (ext[propId.leftFoot] || p.attributes[propId.leftFoot] || 0) + "\t" +
                  (ext[propId.rightFoot] || p.attributes[propId.rightFoot] || 0) + "\t" +
                  (ext[propId.reflexes] || p.attributes[propId.reflexes] || 0) + "\t" +
                  (ext[propId.sweeper] || p.attributes[propId.sweeper] || 0) + "\t" +
                  (ext[propId.kicking] || p.attributes[propId.kicking] || 0) + "\t" +
                  (ext[propId.buildUp] || p.attributes[propId.buildUp] || 0) + "\t" +
                  (ext[propId.oneOnOne] || p.attributes[propId.oneOnOne] || 0) + "\t" +
                  (ext[propId.penaltyArea] || p.attributes[propId.penaltyArea] || 0);
            }
            if (withExtData || upsOnly){
                const prgr = p.extended.attributeProgress || {};
                formatted += "\t" +
                (prgr[propId.endurance] || 0) + "\t" +
                (prgr[propId.speed] || 0) + "\t" +
                (prgr[propId.technique] || 0) + "\t" +
                (prgr[propId.shooting] || 0) + "\t" +
                (prgr[propId.shootingPower] || 0) + "\t" +
                (prgr[propId.header] || 0) + "\t" +
                (prgr[propId.duel] || 0) + "\t" +
                (prgr[propId.tactics] || 0) + "\t" +
                (prgr[propId.athleticism] || 0) + "\t" +
                (prgr[propId.leftFoot] || 0) + "\t" +
                (prgr[propId.rightFoot] || 0) + "\t" +
                (prgr[propId.reflexes] || 0) + "\t" +
                (prgr[propId.sweeper] || 0) + "\t" +
                (prgr[propId.kicking] || 0) + "\t" +
                (prgr[propId.buildUp] || 0) + "\t" +
                (prgr[propId.oneOnOne] || 0) + "\t" +
                (prgr[propId.penaltyArea] || 0);
            }
            tab.push(formatted);
        }
        return tab.join("\r\n");
    };

    Export.createCopyButton = function(){
        //<button style="padding-left:5px; padding-right:12px;" class="ol-button ol-button-copy" id="btnExportSettings" title="Export für Kaderbewertung"><span class="fa fa-cog" /></button>
        $("div#maximizeButton").next().css("position","relative");
        $(`<div style="float:left; margin-left:6px;position:relative;z-index:10;">
          <button style="padding-left:10px; padding-right:10px;" class="ol-button ol-button-copy" id="btnExportKader" title="${tt('Export für Kaderbewertung&#010;Strg halten für erweiterte Daten (+Skillups)&#010;Shift halten für Überschriften')}"><span class="fa fa-clipboard" /></button>
          </div>`).insertBefore("div#positionFilter");
        $("button#btnExportKader").on('click',Export.parseLineupPivot);
        $("button#btnExportKader").on('contextmenu',Export.parseLineupUnpivot);
    };

    Export.createCopyButtonPV = function(){
        if ($("#btnExportKaderPV").length){
            return;
        }
        $(`<div style="float:left; margin-left:12px;"><button style="padding-left:12px; padding-right:12px;" class="ol-button ol-button-copy" id="btnExportKaderPV" title="${tt('Export für Kaderbewertung')}">Export</button></div>`).insertAfter("div#playerViewContent div.back-to-transfer");
        $("div#playerViewContent").on('click','#btnExportKaderPV',Export.parseLineupPV);
    };

    Export.parseLineupPV = function(){

        const players = [], player = {};

        player.attributes = {};
        player.positions = [];
        player.positionValue = 0;

        player.name = $("span.player-complete-name.ol-team-settings-line-up-playername span.hidden-xs").text();
        const positions = $.trim($("span.player-postition").text().replace(/ /g,"")).split(",");
        player.form = 3;

        for (var i = 0; i < 3; i++){
            player.positions[i] = positions[i] || '';
            player.positionValue += positions[i] ? Math.pow(Export.positionVal[positions[i]], 2-i) : 0;
        }

        $("div.player-attributes-bar").each(function(){
            var attr_name, attr_value;
            attr_name = $.trim($(this).find("div.player-attributes-bar-name").text());
            attr_value = $.trim($(this).find("span.ol-value-bar-small-label-value").text());
            player.attributes[OLi18n.propId(attr_name)] = parseInt(attr_value,10);
            player.attributes[attr_name.toUpperCase()] = parseInt(attr_value,10);
        });

        players.push(player);

        GM_setClipboard(Export.playersToString(players));
        OLCore.info(tt("Spielerdaten in die Zwischenablage kopiert"));
    };

    Export.fetchPlayerDetails = async function(playerid){
        const url = `/team/training/details/results/player?playerId=${playerid}`;
        //const url = `/player/quickoverview?playerId=${playerid}`;
        const details = await OLCore.get(url);
        return details;
    };

    Export.parseLineupUnpivot = async function(event){
        event.preventDefault();
        await Export.parseLineup(event, true);
        return false;
    };

    Export.parseLineupPivot = async function(event){
        await Export.parseLineup(event, false);
        return false;
    };

    Export.parseLineup = async function(event, unpivot){

        const withExtData = true; //event.ctrlKey || unpivot;
        const withHeadlines = event.shiftKey;
        const upsOnly = event.altKey;
        const attributes = {};
        const players = [];
        const cont = $("div#lineUpTableContainer");
        let hasForm = false;

        for (const dpa of $(cont).find("div#dropdownPlayerAttribute li[data-value]")){
            const name = $(dpa)[0].innerText;
            const value = $(dpa).attr("data-value");
            const type = $(dpa).attr("data-player-type");
            attributes[value] = {"name": name, "type": type};
        }

        for (const wrapper of $(cont).find("div.ol-team-settings-line-up-row-background-wrapper")) {
            const data = {};
            let position, attr;
            data.name = $(wrapper).find("span.ol-team-position-complete-name").text();
            data.id = parseInt(wrapper.parentNode.id.replace("playerListId",""), 10);
            data.attributes = {};
            attr = $.parseJSON($(wrapper).find("div.ol-gui-lineup-attr").attr("data-player-attributes"));
            $.each(attr,function(key,value){
                data.attributes[key] = value.value;
            });
            data.positions = [];
            data.positionValue = 0;
            for (var i = 0; i < 3; i++){
                position = $(wrapper).find("div.ol-team-settings-player-lineup-position span.lineUpPosition")[i];
                data.positions[i] = position ? $(position)[0].innerText : '';
                data.positionValue += position && Export.positionVal[$(position)[0].innerText] ? Math.pow(Export.positionVal[$(position)[0].innerText], 2-i) : 0;
            }
            var formBar = $(wrapper).find("div.ol-settings-row-value-bar-daily-conditions");
            if (formBar.find("div:first-child").hasClass("ol-player-daily-condition-neutral-injury")) {
                data.form = 0;
            } else if (formBar.find("div:first-child").hasClass("ol-player-daily-condition-neutral-unknown")) {
                data.form = '';
            } else {
                data.form = formBar.find("div:first-child").find("div").length;
            }
            hasForm = hasForm || data.form > 0;
            players.push(data);
        }
        // 0 = vor Training/ vor Friendly
        // 2 = vor Training/ nach Friendly
        // 1 = nach Training/ nach Friendly (legacy value)
        let formState = hasForm ? '1' : '0';
        let friendlyDone = false;
        const friendlyPlayer = [];
        const matchPlayer = [];

        let waitDialog;

        //Fetch Trainingsdata
        if (!hasForm){

            waitDialog = $(`<div id="lineup_export_wait" class="lineup_export_popup">${tt("Lade Daten")} <span id="player_export_load_num"></span><div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>`).dialog({
                classes: {},
                hide: { effect: "fade" },
                show: { effect: "fade" }
            });
            const trainingData = await OLCore.get("team/training");

            const matchColumn = $(trainingData).find('div.ol-training-day[data-day = "saturday0"]').find('div.ol-training-day-column[data-day = "saturday0"]:first-child > div.ol-training-weektable-matchblock[data-matchid]');

            const matchUsages = matchColumn.find('div.ol-training-weektable-matchblock-usages-row.ol-training-weektable-matchblock-usages-row-other');
            matchUsages.each(function(){
                const spanClick = $(this).find('span.player-quick-overview-launcher').attr("onclick");
                const matchPlayerIdMatch = spanClick.match(/{'?playerId'?:\s*(\d+)\s*}/);
                if (matchPlayerIdMatch){
                    matchPlayer.push(parseInt(matchPlayerIdMatch[1],10)||0);
                }
            });

            const friendlyColumn = $(trainingData).find('div.ol-training-day[data-day = "friendly"]').find('div.ol-training-day-column[data-day = "friendly"]:first-child > div.ol-training-weektable-matchblock[data-matchState]');
            friendlyDone = friendlyColumn.attr("data-matchState");
            if (friendlyDone === 'done'){
                formState = 2;
            }
            const friendlyUsages = friendlyColumn.find('div.ol-training-weektable-matchblock-usages-row.ol-training-weektable-matchblock-usages-row-other');
            friendlyUsages.each(function(){
                const spanClick = $(this).find('span.player-quick-overview-launcher').attr("onclick");
                const friendlyPlayerIdMatch = spanClick.match(/{'?playerId'?:\s*(\d+)\s*}/);
                if (friendlyPlayerIdMatch){
                    friendlyPlayer.push(parseInt(friendlyPlayerIdMatch[1],10)||0);
                }
            });
        }

        /*
        if (!hasForm){
            alert('Bitte Training zuerst durchführen');
            return;
        }
        */
        const listValues = GM_listValues();
        const playerIds = players.map(p => parseInt(p.id,10));
        for (const val of listValues.filter(v => {return /PLAYER_DETAIL\|\d+\|S\d+W\d+/.test(v);})){
            const playerid = parseInt(val.split('|')[1],10);
            const sw = val.split('|')[2];
            if (playerIds.indexOf(playerid) === -1 || sw !== OLCore.Base.seasonWeek ){
                GM_deleteValue(val);
            }
        }
        if (withExtData || upsOnly) {
            const pLen = players.length;
            let i = 0;
            if (!waitDialog) {
                waitDialog = $('<div id="lineup_export_wait" class="lineup_export_popup">Lade Daten <span id="player_export_load_num"></span><div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>').dialog({
                    classes: {},
                    hide: { effect: "fade" },
                    show: { effect: "fade" }
                });
            }
            for (const player of players){
                i++;
                $("#player_export_load_num").text(`${i}/${pLen}`);
                player.extended = JSON.parse(GM_getValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|${formState}`) || null);
                if (!player.extended && formState === 2 && friendlyPlayer.indexOf(player.id) === -1){
                    player.extended = JSON.parse(GM_getValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|0`) || null);
                }
                if (!player.extended) {
                    console.log(`Fetching Data for player ${player.id}`);
                    player.extended = { attributeDetails: {}, attributeProgress: {} };
                    if (player.id > 0) {
                        await OLCore.sleep(100);
                        const details = await Export.fetchPlayerDetails(player.id);
                        const lsText = $(details).find('div.ol-training-playerdetails-head-title').text();
                        const lsMatch = lsText.match(/\((.*)\)/);
                        let Leistungsstand = '';
                        if (lsMatch){
                            Leistungsstand = lsMatch[1];
                            const rgxL = new RegExp(`${t("Ligaspiel")}: (\\d+) min\\.`,"i");
                            const rgxF = new RegExp(`${t("Friendly")}: (\\d+) min\\.`,"i");
                            const matchMinMatch = Leistungsstand.match(rgxL);
                            const friendlyMinMatch = Leistungsstand.match(rgxF);
                            player.extended.attributeDetails.MATCHTIME = matchMinMatch? parseInt(matchMinMatch[1],10) || 0 : 0;
                            player.extended.attributeDetails.FRIENDLYTIME = friendlyMinMatch? parseInt(friendlyMinMatch[1],10) || 0 : 0;
                            player.extended.attributeDetails.TRAINING = player.form > 0 ? 1 : 0;
                        }
                        player.extended.attributeDetails.LEISTUNGSSTAND = Leistungsstand;
                        const fitnessSpan = $(details).find('div.training-result-fitness').parent().find('span.ol-value-bar-layer-2')[0];
                        player.extended.attributeDetails[28] = OLi18n.tbNum(OLCore.round(parseFloat(fitnessSpan.style.left) + parseFloat(fitnessSpan.style.width),4));
                        for (const detail of $(details).find('div.ol-training-results-attribute-row').find('div[data-pid]')) {
                            if (parseInt($(detail).attr("data-pid"),10) > 0){
                                const attr_name = $(detail).find('span')[0].innerText.trim();
                                if (attr_name){
                                    const attr_value_span = $(detail).find('span.ol-value-bar-layer-2')[0];
                                    const attr_value = OLi18n.tbNum(OLCore.round(parseFloat(attr_value_span.style.left) + parseFloat(attr_value_span.style.width),4));
                                    const progress_positive = $(detail).find('div.ol-player-progress-bar-sub-progress-positive').length;
                                    const progress_negative = $(detail).find('div.ol-player-progress-bar-sub-progress-negative').length;
                                    const attr_change = progress_positive > 0 ? progress_positive : (progress_negative > 0 ? -progress_negative : 0);
                                    player.extended.attributeDetails[OLi18n.propId(attr_name)] = attr_value;
                                    player.extended.attributeProgress[OLi18n.propId(attr_name)] = attr_change;
                                    Export.attributeNames[OLi18n.propId(attr_name)] = attr_name;
                                }
                            }
                        }
                        /*
                        const ext_player_name = $(details).find('span.ol-team-settings-line-up-playername').text();
                        player.name = ext_player_name;
                        for (const detail of $(details).find('.col-lg-6.col-md-6.col-sm-6')) {
                            const attr_name = $(detail).find('span.player-attributes-bar-playername').text().trim();
                            if (attr_name) {
                                const attr_value_span = $(detail).find('span.ol-value-bar-layer-2')[0];
                                const attr_value = OLCore.round(parseFloat(attr_value_span.style.left) + parseFloat(attr_value_span.style.width),4).toString().replace(".",",");
                                //const attr_base = $(detail).find('span.ol-value-bar-small-label-value').last().text().trim();
                                //const attr_sub = $(detail).find('div.ol-value-bar-sub-progress-wrapper').length? 9 - $(detail).find('div.ol-player-daily-condition-neutral-1').length : -1;
                                const progress_positive = $(detail).find('div.ol-player-progress-bar-sub-progress-positive').length;
                                const progress_negative = $(detail).find('div.ol-player-progress-bar-sub-progress-negative').length;
                                const attr_change = progress_positive > 0 ? progress_positive : (progress_negative > 0 ? -progress_negative : 0);
                                player.extended.attributeDetails[attr_name.toUpperCase()] = attr_value; //attr_base + (attr_sub > -1 ? ',' + attr_sub : '');
                                player.extended.attributeProgress[attr_name.toUpperCase()] = attr_change;
                                player.extended.attributeNames[attr_name.toUpperCase()] = attr_name;
                                player.extended.name = ext_player_name;
                            }
                        }
                        */
                    }
                    GM_setValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|${formState}`, JSON.stringify(player.extended));
                } else {
                    player.name = player.extended.name || player.name;
                    console.log(`Cache Hit for player ${player.id}`);
                }
            }
        }
        if (waitDialog){
            $(waitDialog).dialog('close');
            $(waitDialog).dialog('destroy');
        }
        const playersString = unpivot ? Export.playersToStringUnpivot(players) : Export.playersToString(players, withExtData, withHeadlines, upsOnly);
        GM_setClipboard(playersString);
        OLCore.info(tt("Spielerdaten in die Zwischenablage kopiert"));
    };

    /*****
     * Lineup
     *******/

    Lineup.showMWFitness = function(){
        const attributes = {};
        let fitnessStyle = GM_getValue("LINEUP_FITNESS_STYLE") || "LEFT";

        Lineup.squad = [];

        if (Object.keys(attributes).length === 0){
            for (const dpa of $("div#lineUpTableContainer").find("div#dropdownPlayerAttribute li[data-value]")){
                const name = $(dpa).text();
                const value = $(dpa).attr("data-value");
                const type = $(dpa).attr("data-player-type");
                attributes[name.toLowerCase()] = {"name": name, "value": value, "type": type};
                attributes[parseInt(value, 10) || value] = {"name": name, "value": value, "type": type};
            }
        }


        function showFitnessMW(){
            $(".lineup_fitnessrow").remove();
            $("div.ol-team-settings-line-up-row.visible").each(function(i, el){
                const ogla = $(el).find(".ol-gui-lineup-attr");
                if (ogla.length === 0){
                    return;
                }
                const playerId = parseInt(($(el).attr("id")||"").replace("playerListId",""),10);
                const attr = $.parseJSON(ogla.attr("data-player-attributes"));
                const mw = parseInt(attr[attributes[OLCore.Base.propId.marketValue].value].value,10);
                let fit = parseInt(attr[attributes[OLCore.Base.propId.fitness].value].value,10);
                const newId = $(el).attr("id").replace("playerListId","fit");
                $(el).attr("data-marketValue",mw);
                $(el).attr("data-fitness",fit);
                if (fitnessStyle === "RIGHT"){
                    $(el).prepend(`<div class="lineup_fitnessrow" style="width:${100-fit}%;position:absolute;overflow:hidden;height:100%;right:0;background:red;opacity:0.2">`);
                } else if (fitnessStyle === "LEFT"){
                    $(el).prepend(`<div class="lineup_fitnessrow" style="width:${fit}%;position:absolute;overflow:hidden;height:100%;">
                     <div id="${newId}" style="position:absolute;width:${10000/fit}%;background:linear-gradient(to right, red, grey, green);height:100%;opacity:0.2;"></div></div>`);
                }
                $(el).find("span.ol-value-bar-small-label-special-type").html(`<span style="margin-right: 5px;">${OLCore.num2Cur(mw)}</span>`);
                Lineup.squad.push({id: playerId, value: mw});
            });
        }

        function switchFitnessStyle(){
            switch(fitnessStyle){
                case "LEFT":
                    fitnessStyle = "RIGHT";
                    break;
                case "RIGHT":
                    fitnessStyle = "NONE";
                    break;
                case "NONE":
                    fitnessStyle = "LEFT";
            }
            GM_setValue("LINEUP_FITNESS_STYLE", fitnessStyle);
            showFitnessMW();
        }

        const tgl = $('<div style="position:absolute;right:0;bottom:0;cursor:pointer;">F</div>').appendTo("#ol-bg-pattern");
        tgl.on("click",switchFitnessStyle);
        showFitnessMW();
        //GM_addStyle(`#${newId}::before {position:absolute; width: ${fit}%; content: '', height:100%}`);
    };

    Lineup.initL = async function(){

        let leagueVal = 0,
            friendlyVal = 0,
            numFriendly = 0,
            numLeague = 0,
            numActive = 0,
            avgLeague = 0,
            avgFriendly = 0,
            isFriendly = false, 
            lastLineupValue = 0, 
            pi, 
            calcTimeout;

        const api = OLCore.Api;

        function getLeagueVal(){
            let ret = 0;
            numLeague = 0;
            $("#collapseLineUp").children("div:has(span.ol-is-in-league-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numLeague++;
            });
            $("#collapseSub").children("div:has(span.ol-is-in-league-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numLeague++;
            });
            $("#collapseOther").children("div:has(span.ol-is-in-league-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numLeague++;
            });
            return ret;
        }

        function getFriendlyVal(){
            
            let ret = 0;
            numFriendly = 0;

            $("#collapseLineUp").children("div:has(span.ol-is-in-friendly-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numFriendly++;
            });
            $("#collapseSub").children("div:has(span.ol-is-in-friendly-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numFriendly++;
            });
            $("#collapseOther").children("div:has(span.ol-is-in-friendly-line-up)").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numFriendly++;
            });
            return ret;
        }

        function getActiveVal(){
            let ret = 0;
            numActive = 0;
            $("#collapseLineUp").children("div").each(function(i, el){
                ret += parseInt($(el).attr("data-marketValue"),10);
                numActive++;
            });
            return ret;
        }

        async function calcL(reInit){
						if (pi) {
              pi.end();
              pi = null;
            }
            pi = OLCore.UI.progressIndicator("div#lineup_L", {clear:true});
            if (reInit){
                const friendlyLineupNum = OLCore.getNum($("button.ol-button.ol-team-settings-line-up-header-friendly").attr("onclick"));
                const activeLineupNum = parseInt($("div#selectedLineUp").attr("data-active"),10);
                isFriendly = (activeLineupNum === friendlyLineupNum);
                leagueVal = isFriendly ? getLeagueVal() : getActiveVal();
                friendlyVal = isFriendly ? getActiveVal() : getFriendlyVal();
                avgLeague = Math.round(leagueVal/(isFriendly ? numLeague : numActive));
                avgFriendly = Math.round(friendlyVal/(isFriendly ? numActive : numFriendly));
            }
            if (isFriendly){
                friendlyVal = getActiveVal();
                avgFriendly = Math.round(friendlyVal/numActive);
            } else {
                leagueVal = getActiveVal();
                avgLeague = Math.round(leagueVal/numActive);
            }
            const LVal = await OLCore.XApi.getL({friendlyLineupValue: friendlyVal, actLeagueLineupValue: leagueVal, useCache: true});
						if (pi) {
						pi.end();
            }
            pi = null;
            $("div#lineup_L").html(`${LVal.realL}% (${LVal.nextL}%)`);
            $("div#avgL").html(`L: &Oslash; ${OLCore.num2Cur(avgLeague)}`);
            $("div#avgF").html(`F: &Oslash; ${OLCore.num2Cur(avgFriendly)}`);
        }

        function calcLT(){
          if (calcTimeout){
            window.clearTimeout(calcTimeout);
          }
            const ms = 1000;
          calcTimeout = window.setTimeout(function(){calcL(true);}, ms);
        }

        const friendlyLineupNum = OLCore.getNum($("button.ol-button.ol-team-settings-line-up-header-friendly").attr("onclick"));
        const activeLineupNum = parseInt($("div#selectedLineUp").attr("data-active"),10);
        isFriendly = (activeLineupNum === friendlyLineupNum);

        leagueVal = isFriendly ? getLeagueVal() : getActiveVal();
        friendlyVal = isFriendly ? getActiveVal() : getFriendlyVal();
        avgLeague = Math.round(leagueVal/(isFriendly ? numLeague : numActive));
        avgFriendly = Math.round(friendlyVal/(isFriendly ? numActive : numFriendly));
				
        const helptext = tt("Links: MW Friendly/&Oslash; MW Ligaspiele&#010;Rechts (in Klammern): MW Friendly/&Oslash; (MW Ligaspiele + MW Ligaaufstellung*)&#010;&#010;* aktive Aufstellung, wenn &quot;Friendly Startaufstellung&quot; nicht aktiv ist");

        $("div#pitch").children("div").eq(0).append(`<div style="position:absolute; z-index:1" title="${tt("Marktwert Friendly Aufstellung zu Marktwert Ligaaufstellungen (+ aktuelle Ligaaufstellung) (L-Wert)")}" id="lineup_L" />
        <div title="${helptext}" style="display:inline-block;position:absolute; left: -15px; top: 3px;" class="fa fa-question-circle"/>`);
        $("div#pitch").children("div").eq(0).append(`<div style="position:absolute; z-index:1; right:0px;" title="${tt("Durchschnitt Liga")}" id="avgL" />`);
        $("div#pitch").children("div").eq(0).append(`<div style="position:absolute; z-index:1; right:0px; top: 15px" title="${tt("Durchschnitt Friendly")}" id="avgF" />`);
        //$("div#pitch").children("div").eq(0).append(`<div style="position:absolute; top:5%; z-index:1" title="MW letzte Ligaaufstellung" id="lineup_L0"></div>`);
        //$("div#pitch").children("div").eq(0).append(`<div style="position:absolute; top:10%; z-index:1" title="MW aktive Aufstellung (wenn Friendly inaktiv)/Ligaaufstellung (wenn Friendly aktiv)" id="lineup_L1"></div>`);
        //$("div#pitch").children("div").eq(0).append(`<div style="position:absolute; top:15%; z-index:1" title="MW Friendlyaufstellung" id="lineup_L2"></div>`);

        calcL();

        Lineup.mutationObserver = new MutationObserver(calcLT);
        Lineup.mutationObserverT = new MutationObserver(calcLT);
        Lineup.mutationObserver.observe($("div#collapseLineUp")[0], { childList: true });
        Lineup.mutationObserverT.observe($("#selectedLineUp")[0], { attributes: true });
    };

    Lineup.init = function(){
        if (OLSettings.get('LineupFitness')){
        Lineup.showMWFitness();
        }
        Lineup.initL();
    };

    Lineup.showMobileUsage = function(){
        $("div.ol-team-settings-player-lineup-state > span").removeClass("hidden-sm");
        $("div.ol-team-settings-player-lineup-state > span").removeClass("hidden-xs");
    };

    function init(){

        GM_addStyle(".ui-dialog { z-index: 1000 !important ;}");
        GM_addStyle(".lineup_export_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");

        GM_addStyle(" \ .lds-spinner { \   color: official; \   display: inline-block; \   position: relative; \   width: 80px; \   height: 80px; \   vertical-align: middle; \   text-align:center;  \ } \ .lds-spinner div { \   transform-origin: 40px 40px; \   animation: lds-spinner 1.2s linear infinite; \ } \ .lds-spinner div:after { \   content: \" \"; \   display: block; \   position: absolute; \   top: 3px; \   left: 37px; \   width: 6px; \   height: 18px; \   border-radius: 20%; \   background: #fff; \ } \ .lds-spinner div:nth-child(1) { \   transform: rotate(0deg); \   animation-delay: -1.1s; \ } \ .lds-spinner div:nth-child(2) { \   transform: rotate(30deg); \   animation-delay: -1s; \ } \ .lds-spinner div:nth-child(3) { \   transform: rotate(60deg); \   animation-delay: -0.9s; \ } \ .lds-spinner div:nth-child(4) { \   transform: rotate(90deg); \   animation-delay: -0.8s; \ } \ .lds-spinner div:nth-child(5) { \   transform: rotate(120deg); \   animation-delay: -0.7s; \ } \ .lds-spinner div:nth-child(6) { \   transform: rotate(150deg); \   animation-delay: -0.6s; \ } \ .lds-spinner div:nth-child(7) { \   transform: rotate(180deg); \   animation-delay: -0.5s; \ } \ .lds-spinner div:nth-child(8) { \   transform: rotate(210deg); \   animation-delay: -0.4s; \ } \ .lds-spinner div:nth-child(9) { \   transform: rotate(240deg); \   animation-delay: -0.3s; \ } \ .lds-spinner div:nth-child(10) { \   transform: rotate(270deg); \   animation-delay: -0.2s; \ } \ .lds-spinner div:nth-child(11) { \   transform: rotate(300deg); \   animation-delay: -0.1s; \ } \ .lds-spinner div:nth-child(12) { \   transform: rotate(330deg); \   animation-delay: 0s; \ } \ @keyframes lds-spinner { \   0% { \     opacity: 1; \   } \   100% { \     opacity: 0; \   } \ }");

        if (OLSettings.get("mobileLineupState")){
            OLCore.waitForKeyElements (
                "div#lineUpPlayerList",
                Lineup.showMobileUsage
            )
        }

        OLCore.waitForKeyElements (
            "div#lineUpTableContainer",
            Export.createCopyButton
        );

				function WFFE_Export_createCopyButtonPV(){
					Export.createCopyButtonPV();
				}

        OLCore.waitForKeyElements (
            "div#playerViewContent",
            WFFE_Export_createCopyButtonPV
        );

        OLCore.waitForKeyElements (
            "div#playingFieldContainer",
            Lineup.init
        );
    }

       init();

})();