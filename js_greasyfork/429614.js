/*jshint esversion: 8, multistr: true */
/* globals OLCore, OLSettings, OLi18n, unsafeWindow, GM_listValues, GM_setClipboard, GM_setValue, GM_getValue, GM_deleteValue, GM_addStyle */

// ==UserScript==
// @name           OnlineligaLineupHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.5.6
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
// @downloadURL https://update.greasyfork.org/scripts/429614/OnlineligaLineupHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/429614/OnlineligaLineupHelper.meta.js
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
 * 0.2.1 09.06.2022 Bugfix player export before training
 * 0.2.2 09.06.2022 TM Spieler in neuem Tab öffnen
 * 0.2.3 10.06.2022 Team: open player in new tab
 * 0.3.0 25.06.2022 + Export: Settings for individual export format
 *                  + show next opponent
 *                  + optional: sort player by surname and lineup, highlight players by positions (team settings)
 * 0.3.1 02.07.2022 Bugfix Position order for export
 * 0.3.2 04.07.2022 Bugfix Position language for export
 * 0.3.3 13.07.2022 Multiple player export settings (alt/ctrl)
 * 0.3.4 21.07.2022 Bugfix Export from Offer
 * 0.3.5 13.02.2023 Bugfix Export operating time export
 * 0.4.0 23.08.2023 Age on lineup
 * 0.5.0 20.11.2024 OL 2.0
 * 0.5.1 25.11.2024 Exportbutton in Headline for mobile access
 * 0.5.2 26.11.2024 prevent multiple Exportbuttons
 * 0.5.3 15.12.2024 Fix: Form = 0 on injury
 * 0.5.4 28.12.2024 Fix: Kaderexport
 *                  Fix: sort player names
 *                  show duration of injury/outs
 * 0.5.5 29.12.2024 adjust ban/injury icon
 * 0.5.6 30.10.2025 fix: duration display
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;
    const gmValues = GM_listValues();
    const tbLang = OLSettings.get("ToolboxLanguage", OLi18n.shortLang);

    const Lineup = {squad:[]};

    const Tactic = {};

    const Export = {};

    const Team = {};

    let teamData;

    /*****
     * Export
     ****/

    Export.Settings = {};
    Export.Settings.Values = {};
    Export.positionVal = {};

    Export.positionVal[t("ST")]=0;
    Export.positionVal[t("OM")]=0;
    Export.positionVal[t("DM")]=0;
    Export.positionVal[t("AV")]=0;
    Export.positionVal[t("IV")]=0;
    Export.positionVal[t("TW")]=0;

    Export.Settings.mode = "normal";

    Export.Settings.load = function(mode){

        const rawSettings = OLSettings.get("SquadExport");
        let popupSettingsObj = OLCore.JSON.tryParse(rawSettings);
        if (popupSettingsObj === null){
            popupSettingsObj = Export.Settings.Default;
            popupSettingsObj.normal = rawSettings;
        }

        const settingsArr = popupSettingsObj[mode].split('|');
        const settingsAttr = settingsArr[0];
        const settingsPos = settingsArr[1];
        const settingsExt = settingsArr[2];
        const settingsPvt = settingsArr[3];

        Export.positionVal[t("ST")]=0;
        Export.positionVal[t("OM")]=0;
        Export.positionVal[t("DM")]=0;
        Export.positionVal[t("AV")]=0;
        Export.positionVal[t("IV")]=0;
        Export.positionVal[t("TW")]=0;

        let posValue = 5;

        for (const p of settingsPos.split(',')){
            const pos = t(OLCore.Base.val2pos[parseInt(p,10)]);
            Export.positionVal[pos] = posValue--;
        }

        Export.Settings.Values = {
            properties: settingsAttr.split(',').map(p => parseInt(p,10)),
            positions: settingsPos.split(',').map(p => parseInt(p,10)),
            extData: settingsExt.toString() === "1",
            unpivot: settingsPvt.toString() === "1"
        };

    };

    Export.Settings.save = function(){

        const attr = $("#TB_expSetAttr").val();
        const attrNum = [];
        const invalidAttr = [];
        for (const a of attr.replace(/\s/g,"").split(',').filter(t => t.length)){
            const propId = OLi18n.propExpId(a);
            if (!propId){
                invalidAttr.push(a);
            } else {
                attrNum.push(propId);
            }
        }
        if (invalidAttr.length){
            alert(tt("Ungültige Attribute") + ": " + invalidAttr.join(','));
            return;
        }

        const pos = $("#TB_expSetPos").val();
        const posNum = [];
        const invalidPos = [];
        for (const a of pos.replace(/\s/g,"").split(',').filter(t => t.length)){
            const posId = OLi18n.getPosVal(a);
            if (!posId){
                invalidPos.push(a);
            } else {
                posNum.push(posId);
            }
        }
        if (invalidPos.length){
            alert(tt("Ungültige Positionen") + ": " + invalidPos.join(','));
            return;
        }

        const ext = Export.Settings.extToggle.TB_getValue();
        const pvt = Export.Settings.pvtToggle.TB_getValue();

        let exportSettings = OLSettings.get("SquadExport");
        let settingsObj = OLCore.JSON.tryParse(exportSettings);
        if (settingsObj === null){
            settingsObj = Export.Settings.Default;
            settingsObj.normal = exportSettings;
        }

        // JSON.parse(OLSettings.get("SquadExport"));
        settingsObj[Export.Settings.mode] = `${attrNum.join(',')}|${posNum.join(',')}|${ext?1:0}|${pvt?1:0}`;

        OLSettings.set("SquadExport",JSON.stringify(settingsObj));

        $("div#TB_SettingsPopup_SquadExport").remove();

    };

    Export.Settings.attrHelp = function(){
        let helpText = "";
        for (const p of Object.keys(OLi18n.ExportProps)){
            const pr = OLi18n.propExp(p);
            helpText += `${pr}: ${tt(OLi18n.ExportProps[p].nam) || OLi18n.prop(p) || OLi18n.prop(p-100) + " (Ups)" || "N/A"}\n`;
        }
        console.log(helpText);
        OLCore.UI.popup($(`<div style="padding:5px;"><textarea readonly="readonly" cols="40" rows="20">${helpText}</textarea></div>`),{title: tt("Attribute")});
    };

    Export.Settings.generator = function(opt){
        Export.Settings.mode = opt.mode;

        Export.Settings.load(opt.mode);

        let saveTimeoutHandle;

        const cont = $(`<div style="padding:5px;">
          <div><label title="${tt('Attributreihenfolge kommasepariert')}" style="margin-bottom:0"><span class="ol-font-standard">${tt("Attributreihenfolge")}</span></label><span id="TB_expSetAttrHelp" class="fa fa-question-circle" style="cursor:pointer;margin-left:5px" title="${tt("Klick für Hilfe")}" /></div>
          <textarea id="TB_expSetAttr" rows="3" cols="40"/>
          <div><label title="${tt('Positionsreihenfolge kommasepariert')}" style="margin-bottom:0"><span class="ol-font-standard">${tt("Positionsreihenfolge")}</span></label></div>
          <div style="width:100%"><input id="TB_expSetPos" style="width:100%" /></div>
        </div>`);

        cont.find("span#TB_expSetAttrHelp").on("click", Export.Settings.attrHelp);

        cont.find("textarea#TB_expSetAttr").eq(0).val(Export.Settings.Values.properties.map(p => OLi18n.propExp(parseInt(p,10))).join(','));
        cont.find("input#TB_expSetPos").eq(0).val(Export.Settings.Values.positions.map(p => tt(OLCore.Base.val2pos[parseInt(p,10)])).join(','));

        /*
        function evt_settingsSave(){
            if (saveTimeoutHandle){
                window.clearTimeout(saveTimeoutHandle);
            }
            saveTimeoutHandle = window.setTimeout(Export.Settings.save, 1000);
        }
        cont.find("textarea#TB_expSetAttr").on('keydown', evt_settingsSave);
        cont.find("input#TB_expSetPos").on('keydown', evt_settingsSave);
        */
        function evt_setDirty(){
            $("button#TB_exportSettingsSave").css("background-color", "#ff4949");
        }
        cont.find("textarea#TB_expSetAttr").on('keydown', evt_setDirty);
        cont.find("input#TB_expSetPos").on('keydown', evt_setDirty);

        Export.Settings.extToggle = OLCore.UI.toggle({
            id: "TB_expSetExtTgl",
            name: tt("Genaue Skillwerte"),
            descr: tt("Skillwerte mit Nachkommastellen exportieren"),
            initValue: Export.Settings.Values.extData,
            data: {short: "SquadExport"},
            ctrl: "right",
            callback: evt_setDirty
        });
        Export.Settings.extToggle.appendTo(cont);

        Export.Settings.pvtToggle = OLCore.UI.toggle({
            id: "TB_expSetPvtTgl",
            name: tt("Zeilendarstellung"),
            descr: tt("Werte werden untereinander geschrieben"),
            initValue: Export.Settings.Values.unpivot,
            data: {short: "SquadExport"},
            ctrl: "right",
            callback: evt_setDirty
        });
        Export.Settings.pvtToggle.appendTo(cont);

        const saveBtn = OLCore.UI.button({
            fa:"save",
            title: tt("Speichern"),
            id: "TB_exportSettingsSave"
            //style: "background:red;"
        });
        saveBtn.on("click", Export.Settings.save);
        const div = $('<div style="width:100%;padding-top:3px;display:flex;justify-content:right" />').appendTo(cont);
        saveBtn.appendTo(div);

        return cont;
    };

    Export.Settings.Default = {
        "normal": "200,201,202,203,28,204,9,7,16,20,19,14,15,21,8,17,18,1,6,5,4,3,2|8,16,32,64,128,256|1|0",
        "ctrl": "200,201,202,203,28,204,9,7,16,20,19,14,15,21,8,17,18,1,6,5,4,3,2,109,107,116,120,119,114,115,121,108,117,118,101,106,105,104,103,102|8,16,32,64,128,256|1|0",
        "alt": "200,28,204,109,107,116,120,119,114,115,121,108,117,118,101,106,105,104,103,102|8,16,32,64,128,256|1|0"
    }

    Export.playersToStringUnpivot = function(players, withHeadlines){

        function fsSkill(skill){
            return OLi18n.ExportProps[skill].FS;
        }

        function twSkill(skill){
            return OLi18n.ExportProps[skill].TW;
        }

        players.sort( (a, b) => (b.positionValue - a.positionValue) || a.name.localeCompare(b.name));
        const tab = [];
        const props = Export.Settings.Values.properties;
        for (const pl of players){
            const plPos = pl.attributes[201];
            tab.push(props
                     .filter(p => (plPos === t("TW") && twSkill(p)) || (plPos !== t("TW") && fsSkill(p)))
                     .map(p => (withHeadlines ? OLi18n.propName(p) + "\t" : "") + pl.attributes[p])
                     .join("\r\n")
                    );
        }
        return tab.join("\r\n");
    };

    Export.playersToString = function(players, withHeadlines){
        players.sort( (a, b) => (b.positionValue - a.positionValue) || a.name.localeCompare(b.name));
        const tab = [];
        const props = Export.Settings.Values.properties;
        if (withHeadlines){
            tab.push(props.map(p => OLi18n.propName(p)).join("\t"));
        }
        for (const pl of players){
            tab.push(props.map(p => pl.attributes[p]).join("\t"));
        }
        return tab.join("\r\n");
    };

    Export.createCopyButton = function(){
        if ($('#TB_Lineup_Copy').length) return;
        const btnCont = $(`<div id="TB_Lineup_Copy" style="margin-left:6px;position:relative;z-index:10;display:inline-flex;">`);
        btnCont.appendTo("div.ol-font-pattern-header");
        const copyBtn = OLCore.UI.button({
            copy: true,
            title: tt("Einstellungen für den Kaderexport&#010;Shift halten für Überschriften#010;(Strg/Alt halten für alternative Einstellungen)")
        });
        btnCont.append(copyBtn);
        copyBtn.on('click',Export.parseLineup);
    };

    Export.createCopyButtonPV = function(){
        if ($("#btnExportKaderPV").length){
            return;
        }
        $(`<div style="float:left; margin-left:12px;">
            <button style="padding-left:12px; padding-right:12px;float:none;margin-bottom:4px;" class="ol-button ol-button-copy" id="btnExportKaderPV" title="${tt('Export für Kaderbewertung')}">Export</button>
            <button id="btnOpenPlayerInNewTab" title="${tt('Spieler in neuem Tab öffnen')}" class="ol-button ol-button-copy" style="padding: 0; width: 32px; height: 32px; vertical-align: middle; text-align: center;"><span class="fa fa-plus-square"></span></button>
        </div>`)
            .insertAfter("div#playerView button.ol-transferlist-back-button");
        $("div#playerView").on('click','#btnExportKaderPV',Export.parseLineupPV);
        $("div#playerView").on('click','#btnOpenPlayerInNewTab', Export.openPlayerInNewTab);
    };

    Export.parseLineupPV = function(event){
        const players = [], player = {};

        const cont = $("div#playerView");

        const mode = event.altKey ? "alt" : (event.ctrlKey ? "ctrl" : "normal");
        Export.Settings.load(mode);

        const player_attributes = {};
        player.positionValue = 0;

        const playerInfoDiv = cont.find("div.player-complete-name.ol-team-settings-line-up-playername");
        player.name = playerInfoDiv.children("span.hidden-xs").eq(0).text();
        player_attributes[200] = player.name;
        const positions = $.trim(playerInfoDiv.children("span").last().children("span").eq(0).text().replace(/ /g,"")).split(",");
        player.form = 3;
        player_attributes[204] = player.form;
        player_attributes[211] = OLCore.Base.week;
        player_attributes[212] = OLCore.Base.matchDay;
        player_attributes[213] = OLCore.Base.season;

        for (var i = 0; i < 3; i++){
            player_attributes[(201 + i)] = positions[i] ? OLi18n.tbstext(positions[i]) : '';
            player.positionValue += positions[i] ? Math.pow(Export.positionVal[positions[i]], 2-i) : 0;
        }

        cont.find("div.ol-player-overview-player-attr > div.row").each(function(){
            var attr_name, attr_value;
            attr_name = $.trim($(this).find("div.ol-player-overview-player-attr-label").text());
            attr_value = OLCore.getNum($(this).find("div.ol-player-overview-player-attr-value-bar-bg").children("div").eq(0).text());
            player_attributes[parseInt(OLi18n.propId(attr_name),10)] = parseInt(attr_value,10);
        });

        const dataPlayerAttributes = cont.find("section.ol-value-pie-section[data-player-attributes]").eq(0);
        let dataPlayerAttributeObj = {}
        if (dataPlayerAttributes.length){
            dataPlayerAttributeObj = OLCore.JSON.tryParse(dataPlayerAttributes.attr("data-player-attributes"));
            Object.keys(dataPlayerAttributeObj).forEach((k,i) => {
                dataPlayerAttributeObj[k] = dataPlayerAttributeObj[k].value;
        });
        }

        player.attributes = Object.assign(player_attributes, dataPlayerAttributeObj);

        players.push(player);

        GM_setClipboard(Export.playersToString(players));
        OLCore.info(tt("Spielerdaten in die Zwischenablage kopiert"));
    };

    Export.openPlayerInNewTab = function(){
        var playerId = $(".ol-transferlist-player-profile-button").attr("onclick").match(/\d+/);
        const url = `/player/overview?playerId=${playerId}`;
        window.open(url, "_blank");
    };

    Export.fetchPlayerDetails = async function(playerid){
        const url = `/team/training/details/results/player?playerId=${playerid}`;
        //const url = `/player/quickoverview?playerId=${playerid}`;
        const details = await OLCore.get(url);
        return details;
    };

    Export.parseLineup = async function(event){

        teamData = teamData || await OLCore.Api.getSquad();

        const withHeadlines = event.shiftKey;
        const mode = event.altKey ? "alt" : (event.ctrlKey ? "ctrl" : "normal");

        Export.Settings.load(mode);

        const withExtData = Export.Settings.Values.extData;
        const unpivot = Export.Settings.Values.unpivot;
        const players = [];
        const cont = $("div#selectedLineUp");
        let hasForm = false;

        for (const wrapper of $(cont).find("div.row.ol-team-lineup-averages-row:has(div.ol-lineup-player-data-pies)")) {
            const data = {attributes: {}};
            const playerInfoDiv = $(wrapper).find("div.ol-lineup-row-player-info-playername > div").eq(0);
            const playerIsInjured = playerInfoDiv.attr("data-injury") === 'true';
            const playerIsBannedL = playerInfoDiv.attr("data-ban-league") === 'true';
            const playerIsBannedF = playerInfoDiv.attr("data-ban-friendly") === 'true';
            const playerPositionsNum = playerInfoDiv.attr("data-player-positions");
            const playerPositions = OLCore.playerPositions2Array(playerPositionsNum);
            const playerId = playerInfoDiv.attr("data-player-id");
            let position, attr;
            data.name = $(wrapper).find("span.ol-team-position-complete-name").eq(0).contents().last().text();
            data.attributes[200] = data.name;
            data.id = playerId;
            data.attributes[210] = data.id;
            attr = $.parseJSON($(wrapper).find("section#0[data-player-attributes][data-fitness=1]").attr("data-player-attributes"));
            $.each(attr,function(key,value){
                data.attributes[parseInt(key,10)] = value.value;
            });
            data.positionValue = playerPositionsNum;
            for (var i = 0; i < 3; i++){
                position = $(wrapper).find("div.ol-lineup-row-player-info-block span.lineUpPosition")[i];
                data.attributes[(201 + i)] = playerPositions[i] ? OLi18n.tbstext(playerPositions[i]) : '';                
            }
            //data.form = parseInt($(wrapper).find("div.ol-lineup-player-form-clip > section").attr("data-value"),10);
            
            const formDataValue = $(wrapper).find("section.ol-lineup-player-condition-wrapper")?.attr("data-value");
            const formDataString = $(wrapper).find("section.ol-lineup-player-condition-wrapper > div")?.eq(0)?.text()?.trim();
            data.form = formDataValue; //OLCore.getNum($(wrapper).find("div.ol-form-pie > span.ol-value-pie-value").text());
            if (formDataString === "?") { data.form = '';}            
            hasForm = hasForm || data.form > 0;
            data.attributes[204] = data.form;
            data.attributes[211] = OLCore.Base.week;
            data.attributes[212] = OLCore.Base.matchDay;
            data.attributes[213] = OLCore.Base.season;
            data.attributes[214] = OLi18n.tbNum(teamData.playerObj[data.id].rating);
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
            const trainingData = await OLCore.get("/team/training");

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

        const listValues = GM_listValues();
        const playerIds = players.map(p => parseInt(p.id,10));
        for (const val of listValues.filter(v => {return /PLAYER_DETAIL\|\d+\|S\d+W\d+/.test(v);})){
            const playerid = parseInt(val.split('|')[1],10);
            const sw = val.split('|')[2];
            if (playerIds.indexOf(playerid) === -1 || sw !== OLCore.Base.seasonWeek ){
                GM_deleteValue(val);
            }
        }
        if (withExtData) {
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
                player.attributeCache = JSON.parse(GM_getValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|${formState}`) || null);
                if (!player.attributeCache && formState === 2 && friendlyPlayer.indexOf(player.id) === -1){
                    player.attributeCache = JSON.parse(GM_getValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|0`) || null);
                }
                if (!player.attributeCache) {
                    console.log(`Fetching Data for player ${player.id}`);
                    if (player.id > 0) {
                        await OLCore.sleep(100);
                        const details = await Export.fetchPlayerDetails(player.id);
                        const lsText = $(details).find('div.ol-training-playerdetails-head-title').text();
                        const lsMatch = lsText.match(/\((.*)\)/);
                        let Leistungsstand = '';
                        if (lsMatch){
                            Leistungsstand = lsMatch[1];
                            const rgxL = new RegExp(`${t("Ligaspiel")}: (\\d+) min`,"i");
                            const rgxF = new RegExp(`${t("Friendly")}: (\\d+) min`,"i");
                            const matchMinMatch = Leistungsstand.match(rgxL);
                            const friendlyMinMatch = Leistungsstand.match(rgxF);
                            player.attributes[205] = matchMinMatch? parseInt(matchMinMatch[1],10) || 0 : 0;
                            player.attributes[206] = friendlyMinMatch? parseInt(friendlyMinMatch[1],10) || 0 : 0;
                            player.attributes[208] = player.form > 0 ? 1 : 0;
                        }
                        player.attributes[207] = Leistungsstand;
                        //const fitnessSpan = $(details).find('div.training-result-fitness').parent().find('span.ol-value-bar-layer-2')[0];
                        //player.attributes[28] = OLi18n.tbNum(parseFloat(fitnessSpan.style.left) + parseFloat(fitnessSpan.style.width), { maximumFractionDigits: 4 });
                        for (const detail of $(details).find('div.ol-training-results-attribute-row div.ol-value-progress-bar')) {
                            const attr_name = $(detail).find('div.ol-value-progress-bar-name').eq(0).text().trim();
                                if (attr_name){
                                const attr_value_div = $(detail).find('div.ol-value-progress-bar-value')[0];
                                const attr_value = OLi18n.tbNum(((parseFloat(attr_value_div.style.opacity) - 0.2)/0.008), { maximumFractionDigits: 4 });
                                    const progress_positive = $(detail).find('div.ol-player-progress-bar-sub-progress-positive').length;
                                    const progress_negative = $(detail).find('div.ol-player-progress-bar-sub-progress-negative').length;
                                    const attr_change = progress_positive > 0 ? progress_positive : (progress_negative > 0 ? -progress_negative : 0);
                                    player.attributes[parseInt(OLi18n.propId(attr_name))] = attr_value;
                                    player.attributes[(parseInt(OLi18n.propId(attr_name),10) + 100)] = attr_change;
                                }
                            }
                        }
                    GM_setValue(`PLAYER_DETAIL|${player.id}|${OLCore.Base.seasonWeek}|${formState}`, JSON.stringify(player.attributes));
                } else {
                    player.attributes = player.attributeCache;
                    player.name = player.attributes[200] || player.name;
                    console.log(`Cache Hit for player ${player.name}`);
                }
            }
        }
        if (waitDialog){
            $(waitDialog).dialog('close');
            $(waitDialog).dialog('destroy');
        }
        const playersString = unpivot ? Export.playersToStringUnpivot(players, withHeadlines) : Export.playersToString(players, withHeadlines);
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

        const friendlyLineupNum = OLCore.getNum($("button.ol-button.ol-team-settings-line-up-header-friendly").attr("onclick"));
        const activeLineupNum = parseInt($("div#selectedLineUp").attr("data-active"),10);
        isFriendly = (activeLineupNum === friendlyLineupNum);

        leagueVal = isFriendly ? getLeagueVal() : getActiveVal();
        friendlyVal = isFriendly ? getActiveVal() : getFriendlyVal();
        avgLeague = Math.round(leagueVal/(isFriendly ? numLeague : numActive));
        avgFriendly = Math.round(friendlyVal/(isFriendly ? numActive : numFriendly));

        $("div#pitch").children("div").eq(0).append(`<div style="position:absolute; z-index:1; right:0px;" title="${tt("Durchschnitt Liga")}" id="avgL" />`);
        $("div#pitch").children("div").eq(0).append(`<div style="position:absolute; z-index:1; right:0px; top: 15px" title="${tt("Durchschnitt Friendly")}" id="avgF" />`);

    };

    Lineup.init = function(){

        function showMw(mr){
            const tgt = mr.find(m => m.attributeName === "style");
            if (tgt && tgt.target){
                console.log("OPACITY", $(tgt.target).css("opacity"));
            }
        }

        if (OLSettings.get('LineupFitness')){
            Lineup.showMWFitness();
            //const mo = new MutationObserver(showMw);
            //mo.observe($("span.ol-value-bar-small-label-special-type")[0], { attributes: true, attributeOldValue: true });
        }
        Lineup.initL();

        Lineup.nextOpponentButton();
    };

    Lineup.showMobileUsage = function(){
        $("div.ol-team-settings-player-lineup-state > span").removeClass("hidden-sm");
        $("div.ol-team-settings-player-lineup-state > span").removeClass("hidden-xs");
    };

    Lineup.doSortPlayerDropdown = function(list, opt){
        opt = opt || {};
        opt.playerType = opt.playerType || "squad";
        const matchType = $("div#dropdownTactics").length ? window.getComputedStyle($("div#dropdownTactics").find("button.ol-dropdown-btn")[0], ":after")['content'].replace(/"/g,'') : null;
        const players = list.children("li");
        const sortPlayers = Array.prototype.sort.bind(players);
        const sortedPlayers = OLSettings.get("sortPlayerSurname") ? sortPlayers(function(a,b){
            const aPlayer = $(a).children("a").contents().last().text().trim().replace(/\s+/g,'|').split('|');
            const bPlayer = $(b).children("a").contents().last().text().trim().replace(/\s+/g,'|').split('|');
            return aPlayer[1] + aPlayer[0] < bPlayer[1] + bPlayer[0] ? -1 : 1;
        }) : players;
        let classSelector = "";
        if (matchType && OLSettings.get("sortPlayerSubstitution")){
            const pullClass = matchType === "F" ? "right" : "left";
            classSelector = `span.ol-player-squad-display.pull-${pullClass}${opt.playerType==="substitute"?".player-substitute-display":":not(.player-substitute-display)"}`;
            sortedPlayers.sort(function(a,b){
                const aFind = $(a).find(classSelector).length;
                const bFind = $(b).find(classSelector).length;
                return bFind - aFind;
            });
        };
        list.append(players);
        if (matchType){
            list.find(classSelector).last().parent().parent().parent().css("border-bottom","1px solid black");
        }
    };

    Lineup.highlightPlayerDropdownSubstitutes = function(list, playerOutTypes){
        list.children("li").each(function(i,li){
            if ($(li).children("a").contents().last().text().trim().match(/\((.*)\)/)[1].trim().replace(/\s+/g,'').split(',').filter(l => playerOutTypes.includes(l)).length){
                $(li).children("a").removeClass("playerDropDownMinor");
                $(li).children("a").addClass("playerDropDownMajor");
            } else {
                $(li).children("a").removeClass("playerDropDownMajor");
                $(li).children("a").addClass("playerDropDownMinor");
            }
        });
    };

    function refreshChangeIn(rec){
        if (!OLSettings.get("sortPlayerSubstitution")){
            return;
        }
        const outDropDown = $(rec[0].target);
        const inDropDown = outDropDown.parent().parent().parent().parent().next().find("ul");
        const matchType = $("div#dropdownTactics").length ? window.getComputedStyle($("div#dropdownTactics").find("button.ol-dropdown-btn")[0], ":after")['content'].replace(/"/g,'') : null;
        const playerOutTypes = outDropDown.contents().last().text().trim().match(/\((.*)\)/)[1].trim().replace(/\s+/g,'').split(',');
        Lineup.highlightPlayerDropdownSubstitutes(inDropDown, playerOutTypes);
    }
    Lineup.changeOutMO = new MutationObserver(refreshChangeIn);

    function sortDropdownPlayer(dd){
        if (!OLSettings.get("sortPlayerSurname") && !OLSettings.get("sortPlayerSubstitution")){
            return;
        }
        const labelDiv = $(dd).parent().parent().prev();
        const isChangeIn = labelDiv.text().trim() === t("Spieler rein");
        const isChangeOut = labelDiv.text().trim() === t("Spieler raus");
        if (isChangeIn){
            Lineup.doSortPlayerDropdown($(dd), {playerType: "substitute"});
            if (OLSettings.get("sortPlayerSubstitution")){
                const playerOut = labelDiv.parent().prev().find("span.ol-dropdown-text");
                const playerOutTypes = playerOut.contents().last().text().trim().match(/\((.*)\)/)[1].trim().replace(/\s*/g,'').split(',');
                Lineup.highlightPlayerDropdownSubstitutes($(dd), playerOutTypes);
            }
        } else if (isChangeOut){
            if (OLSettings.get("sortPlayerSubstitution")) {
                Lineup.changeOutMO.observe($(dd).prev().children()[0], { characterData: true, childList: true});
            }
            Lineup.doSortPlayerDropdown($(dd), {playerType: "squad"});
        }	else {
            Lineup.doSortPlayerDropdown($(dd), {playerType: "squad"});
        }
    }

    function sortStandardPlayer(standardList){

        if (!OLSettings.get("sortPlayerSurname")){
            return;
        }

        function doSortGroupRows(list){
            const players = list.children("section.setplay-entry-players-row");
            const sortPlayers = Array.prototype.sort.bind(players);
            const sortedPlayers = sortPlayers(function(a,b){
                const aPlayer = $(a).find("div.ol-setplay-entry-playername span.hidden-xs").text().trim().replace(/\s+/g,'|').split('|');
                const bPlayer = $(b).find("div.ol-setplay-entry-playername span.hidden-xs").text().trim().replace(/\s+/g,'|').split('|');
                return aPlayer[1] + aPlayer[0] < bPlayer[1] + bPlayer[0] ? -1 : 1;
            });
            list.append(players);
        }

        doSortGroupRows(standardList);

    }

    /*
     * Nächster Gegner
     */

    GM_addStyle(`
     div.team-header-wrapper > div.ol-page-content > button.Toolbox_NextOpponentButton{
      position: absolute;
      width: min-content;
      padding: 0 10px !important;
      white-space: nowrap;
      left: 10px;
      bottom: -5px;
      z-index: 100;
    }
    body.ol-sm div.team-header-wrapper > div.ol-page-content >  button.Toolbox_NextOpponentButton, body.ol-xs div.team-header-wrapper > div.ol-page-content > button.Toolbox_NextOpponentButton{
      right: 10px;
      left: auto;
      top: 0;
    }
    div.Toolbox_nextMatchButton {
      transition: all .4s ease-in-out;
      -moz-transition: all .4s ease-in-out;
      -webkit-transition: all .4s ease-in-out;
      -o-transition: all .4s ease-in-out;
      cursor:pointer; position: relative; float: right; width: 25px; height: 25px; padding:4px 2px 2px 2px; margin: 5px; text-align: center; display: inline-block;}
    .ol-nav-slim div.Toolbox_nextMatchButton {right: 115px;}
    .Toolbox_nextMatchPopup {
      width: 600px;
      height: min-content;
      /*height: 410px;*/
      margin-left: 0;
     }
     .ol-xs .Toolbox_nextMatchPopup {
      width: 400px;
      height: min-content;
     }
     .Toolbox_nextMatchPopup .ol-team-settings-pitch-wrapper{
       margin-top: 0;
     }
     .Toolbox_nextMatchPopup .team-system-headline {
       margin-top: 0;
       padding-top: 0;
     }
     .Toolbox_nextMatchPopup .ol-statistics-lineup-user {
				display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        margin-bottom: 5px;
        font-weight: 700;
     }
		 .Toolbox_nextMatchPopup .ol-pitch-preview {
				display: none;
		 }
		 .Toolbox_nextMatchPopup .ol-position-rating-container {
				display: none;
		 }
     .Toolbox_nextMatchPopup .matchreport-lineup-headline {
       font-size: 20px;
     }
     div.Toolbox_nextMatchPopup div.ol-team-settings-player-name > span.ol-team-position-short-name {
       display: inline-block;
     }
     .ol-xs .Toolbox_nextMatchPopup .ol-pitch-preview.ol-team-settings-pitch-wrapper.ol-paragraph {
       height: 70%
     }
     .ol-xs .Toolbox_nextMatchPopup .ol-pitch-preview.ol-team-settings-pitch-wrapper.ol-paragraph > .ol-team-settings-pitch.matchreport-playing-field {
       top: 10px;
     }
     .ol-xs .Toolbox_nextMatchPopup div.ol-statistics-lineup-user > span:nth-child(2) {
       font-size: 12px;
     }
     div.ol-statistics-lineup-user {
       white-space: nowrap;
     }
     div.ol-statistics-lineup-user > span {
       white-space: nowrap;
     }
     div.ol-statistics-lineup-user > .Toolbox_SUN_S, div.ol-statistics-lineup-user > .Toolbox_SUN_W {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: #1c913e;
        color: white;
        margin-right: 2px;
        width: 18px;
     }
     div.ol-statistics-lineup-user > .Toolbox_SUN_U, div.ol-statistics-lineup-user > .Toolbox_SUN_D {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: #838383;
        color: white;
        margin-right: 2px;
        width: 18px;
     }
     div.ol-statistics-lineup-user > .Toolbox_SUN_N, div.ol-statistics-lineup-user > .Toolbox_SUN_L {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: #ff4949;
        color: white;
        margin-right: 2px;
        width: 18px;
     }
     div.ol-statistics-lineup-user > span.Toolbox_Popup_Teaminfo {
       font-size: 12pt;
       margin-left: 5px;
       margin-right: 10px;
     }
     .ol-xs div.ol-statistics-lineup-user > span.Toolbox_Popup_Teaminfo {
       font-size: 12px;
       margin-left: 0;
     }
    `);

    Lineup.nextMatchPopup = null;

    Lineup.nextOpponentButton = function (){

        async function showNextMatchOpponent(){

            if (Lineup.nextMatchPopup){
                Lineup.nextMatchPopup.close();
                return;
            }

            if (!Lineup.nextMatchPopup){
                Lineup.nextMatchPopup = {close:function(){console.log("FAKE CLOSE");}};
            }

            async function fetchNextOpponentData(oppId){
                const cacheData = OLCore.getMatchdayValue("NextOpponentData");
                if (cacheData){
                    return JSON.parse(cacheData);
                }
                const opponentInfo = await OLCore.Api.getTeamInfo(oppId);
                const opponentData = {
                    r: opponentInfo.rank,
                    g: opponentInfo.guv.join('/'),
                    t: opponentInfo.goals.replace(/ /g,''),
                    p: opponentInfo.points
                };
                if (opponentInfo.last10){
                    const sun = opponentInfo.last10.slice(-5).map(function(m){
                        const result = `${m.goals_player1} : ${m.goals_player2}`;
                        let display = t("U");
                        if (m.player1 === oppId && m.goals_player1 > m.goals_player2) {
                            display = t("S");
                        }
                        else if (m.player1 === oppId && m.goals_player1 < m.goals_player2) {
                            display = t("N");
                        }
                        else if (m.player2 === oppId && m.goals_player1 > m.goals_player2) {
                            display = t("N");
                        }
                        else if (m.player2 === oppId && m.goals_player1 < m.goals_player2) {
                            display = t("S");
                        }
                        return {r: result, d: display};
                    });
                    opponentData.sun = sun;
                }
                OLCore.setMatchdayValue("NextOpponentData",JSON.stringify(opponentData));
                return opponentData;
            }

            const teamInfo = await OLCore.Api.getTeamInfo();
            console.log("getTeamInfo", teamInfo);
            if (teamInfo.nextMatch){
                const progressIndicator = OLCore.UI.progressIndicator();
                const lineupData = await OLCore.get(`/match/lineup?season=${teamInfo.nextMatch.season}&matchId=${teamInfo.nextMatch.id}`);
                const pitches = $(lineupData).find(".statistics-lineup-wrapper");
                const pitch = teamInfo.nextMatch.location === 'H' ? pitches.eq(1) : pitches.eq(0);
                pitch.addClass("Toolbox_nextMatchPopup");
                const nextOpponentData = await fetchNextOpponentData(teamInfo.nextMatch.opponent);
                pitch.find(".ol-statistics-lineup-user").append(`<span class="Toolbox_Popup_Teaminfo">[${teamInfo.nextMatch.location}]&nbsp;&nbsp;(${nextOpponentData.r}.) ${nextOpponentData.g}&nbsp;&nbsp;${nextOpponentData.t}&nbsp;&nbsp;${nextOpponentData.p} P.</span>`);
                for (const m of nextOpponentData.sun){
                    pitch.find(".ol-statistics-lineup-user").append(`<div class="Toolbox_SUN_${m.d}" title="${m.r}">${m.d}</div>`);
                }
                progressIndicator.end();
                Lineup.nextMatchPopup = OLCore.UI.popup(pitch, {align: "fixed", title: tt("Nächster Gegner (Liga)"), css:{"z-index": 999, "overflow": "hidden"}, on: {close: function(){Lineup.nextMatchPopup = null;}}});
                OLCore.Lib.avgStatsPitch(pitch);
                const toggleSpan = $(`<span class="fa fa-caret-down" style="margin-left:5px;cursor:pointer;"></span>`).appendTo(".Toolbox_nextMatchPopup .matchreport-lineup-headline");
                $(".Toolbox_nextMatchPopup .ol-pitch-preview").css("margin-bottom","30px");
                function spanToggle(){
                    $(".Toolbox_nextMatchPopup .ol-pitch-preview").toggle();
                    $(".Toolbox_nextMatchPopup .ol-position-rating-container").toggle();
                    if (toggleSpan.hasClass("fa-caret-down")){
                        toggleSpan.removeClass("fa-caret-down");
                        toggleSpan.addClass("fa-caret-up");
                    } else {
                        toggleSpan.removeClass("fa-caret-up");
                        toggleSpan.addClass("fa-caret-down");
                    }
                }
                toggleSpan.on("click",spanToggle);
            }
        }

        const nmb = OLCore.UI.button({text:tt('Nächster Gegner'), class:'Toolbox_NextOpponentButton'});
        //nmb.appendTo("div#ol-root > div.team-header-wrapper > div.ol-page-content");
        nmb.on('click', showNextMatchOpponent);
    };

    Lineup.showAge = function(){
        GM_addStyle(`
           span.TB_Lineup_Age {
             font-size: smaller;
           }
        `)
        $(".ol-team-settings-line-up-rows .ol-team-settings-player-drag-and-drop").css("margin-left", "0px");
        $(".ol-team-settings-player-drag-and-drop").each(function(i,el){
            const playerId = parseInt($(el).attr("data-player-id"),10);
            const playerDiv = $(`div#playerListId${playerId}`);
            if (!playerDiv.length) return;
            const attrDiv = playerDiv.find("div.ol-gui-lineup-attr[data-player-attributes]");
            if (!attrDiv.length) return;
            const attr = OLCore.JSON.tryParse(attrDiv.attr("data-player-attributes"));
            if (!attr) return;
            const age = attr[OLCore.Base.propId.age].value;
            $(el).find("div.ol-team-settings-player-name > span.ol-team-position-last-name").prepend(`<span class="TB_Lineup_Age">(${age}) </span>`);
            $(el).find("div.ol-team-settings-player-name > span.ol-team-position-short-name").prepend(`<span class="TB_Lineup_Age">(${age}) </span>`);
            $(el).find("div.ol-team-settings-player-name > span.ol-team-position-complete-name").prepend(`<span class="TB_Lineup_Age">(${age}) </span>`);
        });
    };

    Lineup.showCondDura = async function(){
        GM_addStyle(`
            span.TB_CondDura {
                color: red;
                font-size: 140%;
                vertical-align: middle;
                margin-right: -14px;
                padding-bottom: 3px;
            }
            .ol-lineup-player-details-row span.icon-icon_injury.ol-player-out-injury-icon {
                background-position: -1306px -972px;
            }
            .ol-lineup-player-details-row span.icon-icon_redcard {
                background-position: -1306px -892px;
            }
            .ol-lineup-player-details-row span.icon-icon_yellowredcard {
                background-position: -1306px -732px;
            }
            .ol-lineup-player-details-row span.icon-icon_yellowcard {
                background-position: -1306px -772px;
            }
            .ol-xs span.ol-player-out, .ol-sm span.ol-player-out {
                padding-top: 5px;
            }
        `);
        for (const r of [...$("div#collapseOtherCollapse div.ol-lineup-player-details-row.lineup-player-locked")]) {
            const row = $(r);
            const playerId = parseInt(row.attr("id").replace("playerListId",""),10);
            const pqo = await OLCore.Api.getPlayerQuickOverview(playerId);
            const condDura = pqo.conditionDura;
            const spanOut = row.find(".ol-player-out").eq(0);
            $(`<span class="TB_CondDura">${condDura}</span>`).prependTo(spanOut);
        }
    }

    /*
      Tactic
      */

    Tactic.init = function(){
        Lineup.nextOpponentButton();
    };

    /*********
     * Team
     *********/

    Team.showPlayerInNewWindow = function(div){
        div = div || $("div#olTeamOverviewContent");
        OLCore.UI.preventMiddleClick(div);
        const divId = div.attr("id");
        $(div).find("span.ol-player-name:visible").each(function(i,nam){

            const playerId = OLCore.getNum($(nam).attr("onclick"));

            function openPlayerInNewWindow(e){
                if (e.which !== 2) return;
                window.open(`/#url=player/overview?playerId=${playerId}`,"_blank");
            }
            if (divId === 'teamSquad'){
                $(nam).parent().parent().parent().on('mouseup', openPlayerInNewWindow);
            } else {
                $(nam).on('mouseup', openPlayerInNewWindow);
            }
        });
        $(div).find("span.teamoverview-squad-playername.text-overflow.visible").each(function(i,nam){

            const playerId = OLCore.getNum($(nam).attr("onclick"));

            function openPlayerInNewWindow(e){
                if (e.which !== 2) return;
                window.open(`/#url=player/overview?playerId=${playerId}`,"_blank");
            }
            $(nam).on('mouseup', openPlayerInNewWindow);
        });
    };

    async function init(){

        GM_addStyle(".playerDropDownMinor {color: grey !important; font-style:italic;}");
        GM_addStyle(".playerDropDownMajor {font-weight:bold !important;}");
        //GM_addStyle(".playerDropDownMajor {font-weight:bold;}");

        GM_addStyle(".ui-dialog { z-index: 1000 !important ;}");
        GM_addStyle(".lineup_export_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");

        GM_addStyle(" \ .lds-spinner { \   color: official; \   display: inline-block; \   position: relative; \   width: 80px; \   height: 80px; \   vertical-align: middle; \   text-align:center;  \ } \ .lds-spinner div { \   transform-origin: 40px 40px; \   animation: lds-spinner 1.2s linear infinite; \ } \ .lds-spinner div:after { \   content: \" \"; \   display: block; \   position: absolute; \   top: 3px; \   left: 37px; \   width: 6px; \   height: 18px; \   border-radius: 20%; \   background: #fff; \ } \ .lds-spinner div:nth-child(1) { \   transform: rotate(0deg); \   animation-delay: -1.1s; \ } \ .lds-spinner div:nth-child(2) { \   transform: rotate(30deg); \   animation-delay: -1s; \ } \ .lds-spinner div:nth-child(3) { \   transform: rotate(60deg); \   animation-delay: -0.9s; \ } \ .lds-spinner div:nth-child(4) { \   transform: rotate(90deg); \   animation-delay: -0.8s; \ } \ .lds-spinner div:nth-child(5) { \   transform: rotate(120deg); \   animation-delay: -0.7s; \ } \ .lds-spinner div:nth-child(6) { \   transform: rotate(150deg); \   animation-delay: -0.6s; \ } \ .lds-spinner div:nth-child(7) { \   transform: rotate(180deg); \   animation-delay: -0.5s; \ } \ .lds-spinner div:nth-child(8) { \   transform: rotate(210deg); \   animation-delay: -0.4s; \ } \ .lds-spinner div:nth-child(9) { \   transform: rotate(240deg); \   animation-delay: -0.3s; \ } \ .lds-spinner div:nth-child(10) { \   transform: rotate(270deg); \   animation-delay: -0.2s; \ } \ .lds-spinner div:nth-child(11) { \   transform: rotate(300deg); \   animation-delay: -0.1s; \ } \ .lds-spinner div:nth-child(12) { \   transform: rotate(330deg); \   animation-delay: 0s; \ } \ @keyframes lds-spinner { \   0% { \     opacity: 1; \   } \   100% { \     opacity: 0; \   } \ }");

        const oldSettings = OLSettings.get("SquadExport");
        if (typeof oldSettings === "string"){
            Export.Settings.Default.normal = oldSettings;
        }

        OLSettings.add({name: "Kaderexport", short: "SquadExport", descr: tt("Einstellungen für den Kaderexport&#010;(Strg/Alt halten für alternative Einstellungen)"), type: "popup", default: JSON.stringify(Export.Settings.Default), settingsId: 'main', generator: Export.Settings.generator});
        OLSettings.add({name: "Alter Aufstellung", short: "AgeLineup", descr: "Alter bei Aufstellung anzeigen", default: false, type: "toggle", settingsId: 'main'});

        function WFKE_lineupPlayerList(){
        if (OLSettings.get("mobileLineupState")){
                Lineup.showMobileUsage();
            }
            // no rating in squadData (OL 2.0)
            //Lineup.showRatingDropdown();
        }

        function WFKE_lineUpTableContainer(){
            if (OLSettings.get("AgeLineup")){
                Lineup.showAge();
            }
            Export.createCopyButton();
            Lineup.showCondDura();
        }

        OLCore.waitForKeyElements (
            "div#lineUpPlayerList",
            WFKE_lineupPlayerList
        )

        OLCore.waitForKeyElements (
            "div#lineUpTableContainer",
            WFKE_lineUpTableContainer
        );

        function WFKE_Export_createCopyButtonPV(){
            Export.createCopyButtonPV();
        }

        OLCore.waitForKeyElements (
            "div#playerViewContent",
            WFKE_Export_createCopyButtonPV
        );

        OLCore.waitForKeyElements (
            "div#playingFieldContainer",
            Lineup.init
        );

        OLCore.waitForKeyElements (
            "div.tactics-settings-titFle",
            Tactic.init
        );

        OLCore.waitForKeyElements (
            "div.ol-dropdown.dropdown.dropdownPlayer ul",
            sortDropdownPlayer
        );

        OLCore.waitForKeyElements (
            "div.setplay-player-overlay",
            sortStandardPlayer
        );

        function WFKE_Team_showPlayerInNewWindow(){
            Team.showPlayerInNewWindow();
        }

        function WFKE_Team_showPlayerInNewWindow2(el){
            Team.showPlayerInNewWindow(el);
        }

        OLCore.waitForKeyElements(
            "div.team-overview-squad-head-first-row",
            WFKE_Team_showPlayerInNewWindow
        );

        OLCore.waitForKeyElements(
            "div#teamSquad",
            WFKE_Team_showPlayerInNewWindow2
        );

    }

    init();

})();
