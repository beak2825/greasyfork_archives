/*jshint esversion: 10 */
/* globals olUid */
 
// ==UserScript==
// @name           OLCore2
// @version        0.1
// @license        LGPLv3
// @description    Core functions for www.onlineliga.de (OFA)
// @author         arthurbecs
// @match          https://www.onlineliga.de
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// ==/UserScript==
 
/*********************************************
 * 0.1 Release
 *********************************************/
(function() {
    'use strict';
 
    const $ = unsafeWindow.jQuery;
 
    /****
     * CoreHelper
     ****/
 
    function escapeRegExp(stringToGoIntoTheRegex) {
        return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
 
    const OLCore = {};
 
    /***
     * Classes
     ***/
    class OLDate{
        constructor(val, type){
            switch (type.toLowerCase()){
                case "date":
                    break;
                case "datestr":
                    break;
                case "rawmatchdate":
                    break;
                case "rawseasonweek":
                    break;
            }
        }
    }
 
    /***
     * Helper Functions
     ***/
 
    OLCore.getNum = function(value,idx){
        if (!value && value !== 0){
            return NaN;
        }
        let rx = new RegExp(escapeRegExp(OLCore.I18n.groupSeparator), "g");
        value = value.replace(rx,"");
        rx = new RegExp(escapeRegExp(OLCore.I18n.decimalSeparator), "g");
        value = value.replace(rx,".");
        const m = value.match(/(-?\d+(\.\d+)?)/g);
        if (m && m.length){
            const f = m.map(n => parseFloat(n));
            return idx === -1 ? f : (idx >=0 ? f[idx] : f[0]);
        }
        return NaN;
    };
 
    OLCore.convertNumber = function(text, isOnlyNumber = false, canBeNegative = true){
        if (!text) {
            return text;
        }
        if(isOnlyNumber){
            if(canBeNegative){
                return text.replace(/[^0-9-]/g, '');
            }
            return text.replace(/[^0-9]/g, '');
        }
 
        if(canBeNegative){
            return text.replace(/[^0-9.,-]/g, '');
        }
 
        return text.replace(/[^0-9.,]/g, '');
    };
 
    OLCore.round = function (number, digits){
        digits = digits || 0;
        const ten = Math.pow(10,digits);
        return Math.round((number + Number.EPSILON) * ten) / ten;
    };
 
    OLCore.roundL = function (number){
        const digits = 1;
        const ten = Math.pow(10,digits);
        if (Math.ceil(number) - number <= 0.1 && Math.ceil(number) - number > 0){
          number = Math.ceil(number) - 0.1;
        }
        const rnd = Math.round((number + Number.EPSILON) * ten) / ten;
        return rnd;
    };
 
    OLCore.guid = function(){
        function S4() {
            return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
 
    OLCore.waitForKeyElementsStore = {};
    OLCore.waitForKeyElements = function(selectorTxt, actionFunction, bTriggerOnce, bWaitOnce, bRecursiveCall){
 
        const store = OLCore.waitForKeyElementsStore;
 
        function addFunctionToStore (){
            if (!Array.isArray(store[selectorTxt])){
                store[selectorTxt] = [];
            }
            if (!store[selectorTxt].map(f => f.name).includes(actionFunction.name)){
                store[selectorTxt].push(actionFunction);
            }
        }
 
        if (!bRecursiveCall){
            addFunctionToStore();
        }
 
        const targetNodes = $(selectorTxt);
        let btargetsFound = false;
 
        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s). Go through each and act if they are new. */
            targetNodes.each(function (i, e) {
                const jThis = $(e);
                const alreadyFound = jThis.data('alreadyFound') || false;
 
                if (!alreadyFound) {
                    //--- Call the payload functions.
                    let cancelFound;
                    if (!bTriggerOnce || i === 0){
                        for (const func of store[selectorTxt]){
                            cancelFound = func(jThis);
                        }
                    }
                    if (cancelFound) {
                        btargetsFound = false;
                    } else {
                        jThis.data('alreadyFound', true);
                    }
                }
            });
        }
        else {
            btargetsFound = false;
        }
 
        //--- Get the timer-control variable for this selector.
        const controlObj = OLCore.waitForKeyElements.controlObj || {};
        const controlKey = selectorTxt.replace(/[^\w]/g, "_");
        let timeControl = controlObj[controlKey];
 
        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () { OLCore.waitForKeyElements(selectorTxt, actionFunction, bTriggerOnce, bWaitOnce, true);}, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        OLCore.waitForKeyElements.controlObj = controlObj;
    };
 
    /***
     * i18n
     ***/
 
    OLCore.I18n = {};
 
    const bodyLocaleInfo = $("body").eq(0).attr("data-localeinfo");
    const localeInfo = bodyLocaleInfo ? JSON.parse(bodyLocaleInfo) : {};
 
    const tmpHost = location.host.split(".");
    OLCore.I18n.topLevelDomain = tmpHost.length > 1 ? tmpHost[2].toLowerCase() : "de";
    switch(OLCore.I18n.topLevelDomain.toLowerCase()){
        case "de":
            OLCore.I18n.lang = "de-DE";
            OLCore.I18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLCore.I18n.groupSeparator = localeInfo.thousandSep || ".";
            OLCore.I18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLCore.I18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLCore.I18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            break;
        case "at":
            OLCore.I18n.lang = "de-AT";
            OLCore.I18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLCore.I18n.groupSeparator = localeInfo.thousandSep || ".";
            OLCore.I18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLCore.I18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLCore.I18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 0;
            break;
        case "ch":
            OLCore.I18n.lang = "de-CH";
            OLCore.I18n.decimalSeparator = localeInfo.decimalPoint || ".";
            OLCore.I18n.groupSeparator = localeInfo.thousandSep || ",";
            OLCore.I18n.currency = localeInfo.currencySymbolLong || "CHF";
            OLCore.I18n.currencySymbol = localeInfo.currencySymbol || "CHF";
            OLCore.I18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
            break;
        default:
            OLCore.I18n.lang = "de-DE";
            OLCore.I18n.decimalSeparator = localeInfo.decimalPoint || ",";
            OLCore.I18n.groupSeparator = localeInfo.thousandSep || ".";
            OLCore.I18n.currency = localeInfo.currencySymbolLong || "EUR";
            OLCore.I18n.currencySymbol = localeInfo.currencySymbol || "\u20ac";
            OLCore.I18n.currencySymbolAfter = localeInfo.currencySymbolAfter || 1;
    }
    OLCore.I18n.tld = OLCore.I18n.topLevelDomain.toLowerCase();
    OLCore.I18n.numberFormat = new Intl.NumberFormat(OLCore.I18n.lang);
    OLCore.I18n.currencyFormat = new Intl.NumberFormat(OLCore.I18n.lang, { style: 'currency', currency: OLCore.I18n.currency });
    OLCore.I18n.loaderImage = `/imgs/loading-${OLCore.I18n.tld}.gif`;
 
    OLCore.I18n.Dict = {"at": {}, "ch": {},"de": {}};
    OLCore.I18n.Dict.at.matchDay = "Runde";
    OLCore.I18n.Dict.ch.matchDay = "Spieltag";
    OLCore.I18n.Dict.de.matchDay = "Spieltag";
 
    OLCore.dict = function(text){
        return OLCore.I18n.Dict[OLCore.I18n.topLevelDomain][text] ? OLCore.I18n.Dict[OLCore.I18n.topLevelDomain][text] : text;
    };
 
    /***
     * OL Base Data
     ***/
 
    OLCore.Base = {};
 
    const swNums = OLCore.getNum($('span.ol-navigation-season-display-font').eq(0).text(),-1);
    OLCore.Base.seasonWeek = `S${swNums[0]}W${swNums[1]}`; //$('span.ol-navigation-season-display-font')[0].innerText.replace('SAISON ','S').replace(' - WOCHE ', 'W');
 
    OLCore.Base.season = swNums[0];
    OLCore.Base.week = swNums[1];
    OLCore.Base.league = $("div#navLeagueText").text();
    OLCore.Base.leagueLevel = OLCore.getNum(OLCore.Base.league);
    OLCore.Base.leagueId = OLCore.getNum($("div#navLeagueText").children().eq(0).attr("onclick"),2);
    OLCore.Base.rawSeasonWeek = (OLCore.Base.season * 100) + OLCore.Base.week;
    OLCore.Base.matchDay = $("span.ol-banner-time-regular").length ? OLCore.getNum($("span.ol-banner-time-regular")[0].innerText.replace(/\. Spieltag/i,"")) : 35;
    OLCore.Base.rawMatchDay = (OLCore.Base.season * 100) + OLCore.Base.matchDay;
    OLCore.Base.userId = olUid;
    OLCore.Base.userName = $("span.forum-button-wrapper").find("input[name='username']").attr("value");
    OLCore.Base.teamName = $("div.ol-nav-team-name").text() ? $("div.ol-nav-team-name").text().replace(/^\s+/,'').replace(/\s+$/,'') : undefined;
    OLCore.Base.teamColorNumber = $("div.matchday-date-flip").attr("class") ? $("div.matchday-date-flip").attr("class").match(/color-(\d+)/)[1] : 1;
    OLCore.Base.pos2val = {"TW": 256, "AV": 128, "IV": 64, "DM": 32, "OM": 16, "ST": 8};
    OLCore.Base.val2pos = {256: "TW", 128: "AV", 64: "IV", 32: "DM", 16: "OM", 8: "ST"};
    OLCore.Base.Formations = {
        "4-4-2 Raute": {id: 14, short: "442R", positions: ["TW", "LIV", "RIV", "ZDM", "LAV", "RAV", "LOM", "ROM", "ZOM", "ST(L)", "ST(R)"]},
        "4-4-2 Flach": {id: 15, short: "442Fla", positions: ["TW", "LIV", "RIV", "RDM", "LAV", "RAV", "LOM", "ROM", "LDM", "ST(L)", "ST(R)"]},
        "4-4-2 Flügel": {id: 16, short: "442Flü", positions: ["TW", "LIV", "RIV", "ZOM", "LAV", "RAV", "LOM", "ROM", "DM", "ST(L)", "ST(R)"]},
        "4-3-3 Halb offensiv, Konter": {id: 20, short: "433HO", positions: ["TW", "LIV", "RIV", "ST", "LAV", "RAV", "LOM", "ROM", "DM", "LST", "RST"]},
        "4-3-3 Offensiv": {id: 21, short: "433O", positions: ["TW", "LIV", "RIV", "ST", "LAV", "RAV", "LOM", "ROM", "DM", "LST", "RST"]},
        "4-2-3-1 Kontrollierte Offensive": {id: 22, short: "4231KO", positions: ["TW", "LIV", "RIV", "ST", "LAV", "RAV", "LDM", "ZOM", "RDM", "LOM", "ROM"]},
        "4-2-3-1 Defensiv, Konter": {id: 23, short: "4231DK", positions: ["TW", "LIV", "RIV", "ST", "LAV", "RAV", "ZDM(L)", "ZOM", "ZDM(R)", "LDM", "RDM"]},
        "4-1-4-1 Defensiv, Konter": {id: 24, short: "4141DK", positions: ["TW", "LIV", "RIV", "ST", "LAV", "RAV", "ZOM(L)", "ZOM(R)", "DM", "LOM", "ROM"]},
        "3-5-2 Dreierkette, Kompaktes Mittelfeld": {id: 25, short: "352", positions: ["TW", "ZIV", "RIV", "ST(R)", "LIV", "ROM", "ST(L)", "ZOM", "LDM", "LOM", "RDM"]},
        "3-4-3 Dreierkette (offensiv)": {id: 26, short: "343", positions: ["TW", "ZIV", "RIV", "RST", "LIV", "ROM", "LST", "ST", "ZOM(L)", "LOM", "ZOM(R)"]},
        "4-1-5-0 Falsche Neun": {id: 27, short: "4150", positions: ["TW", "RAV", "LAV", "LIV", "RIV", "DM", "RST", "LOM", "ZOM", "ROM", "LST"]},
        "4-2-4-0 Falsche Neun": {id: 28, short: "4240", positions: ["TW", "RAV", "LAV", "LIV", "RIV", "LDM", "ROM", "RDM", "ZOM(R)", "ZOM(L)", "LOM"]}
    };
 
    /***
     * Networking
     ***/
    OLCore.get = function(url, data, success, dataType){return $.get(url, data, success, dataType);};
    OLCore.getScript = function(url, success) {return $.getScript(url, success);};
 
    /***
     * Processing
     ***/
    OLCore.sleep = function(milliseconds){
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
 
    /***
     * Storage
     ***/
    OLCore.setMatchdayValue = function(short, value){
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = value;
        GM_setValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
    };
 
    OLCore.setMatchdayValueId = function(short, id, value){
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = matchdayData[today][short] || {};
        matchdayData[today][short][id] = value;
        GM_setValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
    };
 
    OLCore.getMatchdayValue = function(short){
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        GM_setValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
        return matchdayData[today][short];
    };
 
    OLCore.getMatchdayValueId = function(short, id){
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = matchdayData[today][short] || {};
        GM_setValue(`MatchdayData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
        return matchdayData[today][short][id];
    };
 
 
    OLCore.setSeasonValue = function(short, value){
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = value;
        GM_setValue(`seasonData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
    };
 
    OLCore.setSeasonValueId = function(short, id, value){
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = seasonData[thisSeason][short] || {};
        seasonData[thisSeason][short][id] = value;
        GM_setValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
    };
 
    OLCore.getSeasonValue = function(short){
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        GM_setValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
        return seasonData[thisSeason][short];
    };
 
    OLCore.getSeasonValueId = function(short, id){
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = seasonData[thisSeason][short] || {};
        GM_setValue(`SeasonData|${OLCore.I18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
        return seasonData[thisSeason][short][id];
    };
 
    /***
     * Conversions
     ***/
 
    OLCore.week2matchDay = function(week, lastMatchDay){
        week = parseInt(week,10);
        if (week < 18) {
            return week;
        }
        if (week < 21) {
            return lastMatchDay ? 18 : undefined;
        }
        if (week < 38) {
            return week-3;
        }
        return lastMatchDay ? 35 : undefined;
    };
 
    OLCore.matchDay2week = function(matchDay){
        matchDay = parseInt(matchDay,10);
        if (matchDay < 18) {
            return matchDay;
        }
        return matchDay+3;
    };
 
    OLCore.numVal = function(val){
        if (typeof val === 'number'){
            return val.toLocaleString(OLCore.I18n.lang);
        }
        return val;
    };
 
    OLCore.num2Cur = function(val){
        const parts = OLCore.I18n.currencyFormat.formatToParts(val);
        const out = [];
        let cur, lit, dec, frac;
        for (const p of parts){
            switch(p.type){
                case "group":
                    out.push(OLCore.I18n.groupSeparator);
                    break;
                case "currency":
                    cur = p.value;
                    break;
                case "literal":
                    lit = p.value;
                    break;
                case "decimal":
                    dec = OLCore.I18n.decimalSeparator;
                    break;
                case "fraction":
                    frac = p.value;
                    break;
                default:
                    out.push(p.value);
                    break;
            }
        }
        if (parseInt(frac,10) !== 0){
            out.push(dec + frac);
        }
        if (OLCore.I18n.currencySymbolAfter){
            out.push(lit + cur);
        } else {
            out.unshift(cur + lit);
        }
        return out.join('');
    };
 
    OLCore.playerPositions2String = function(pos){
        if (!pos){
            return '';
        }
        const out = [];
        for (const k of Object.keys(OLCore.Base.val2pos)){
            if ((pos & Number(k)) > 0){
                out.push(OLCore.Base.val2pos[k]);
            }
        }
        return out.join(", ");
    };
 
    /***
     * UI
     ***/
    OLCore.addStyle = function(css, id){
        let head, style;
        if ($("#"+id).length) {
            return;
        }
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        if(id){ style.id = id; }
        head.appendChild(style);
    };
 
    OLCore.euroValue = function(val){
        return OLCore.num2Cur(val);
    };
 
    OLCore.UI = OLCore.UI || {};
 
    OLCore.UI.button = function(opt){
      opt = opt || {text: ''};
			if (opt.copy){
				opt.fa = opt.fa || "clipboard";
				opt.buttonClass = "copy";
			}			
      if (opt.fa){
        opt.html = `<span class="fa fa-${opt.fa}"/>`;
      }
			opt.buttonClass = opt.buttonClass || "rectangle";
      return $(`<button class="ol-button ol-button-${opt.buttonClass}" title="${opt.title || opt.text}">${opt.html || opt.text}</button>`);
    }
 
    GM_addStyle(`
      .Toolbox_ProgressIndicator{
        width:100px;
        height:100px;
        position: fixed;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background:url(../../imgs/loading-de.gif) 2px center;
        z-index: 1000 !important;
        border-radius: 10px;
      }
    `);
 
    GM_addStyle(`
       div.olcore_ui_toggle { height: 30px;}
       label.olcore_ui_toggle_label {margin-left: 50px; margin-top: 5px;}
       body.ol-sm label.olcore_ui_toggle_label,body.ol-xs label.olcore_ui_toggle_label {margin-left: 5px; margin-top: 5px;}
       span.olcore_ui_toggle_span {white-space:nowrap;}
       div.olcore_ui_toggle_checkbox.ol-checkbox.slider {max-width:none;}
    `);
 
    OLCore.UI.toggle = function(opt){
        opt = opt || {};
        opt.data = opt.data || {};
        opt.callback = opt.callback || {};
        const inputData = " " +Object.keys(opt.data).map(k => `data-${k}="${opt.data[k]}"`).join(' ');
        const ret = $(`<div>
               <div id="buttonToggle-${opt.id}" class="olcore_ui_toggle olcore_ui_toggle_checkbox ol-checkbox slider">
                 <label title="${opt.descr}" for="toggle-${opt.id}" class="olcore_ui_toggle_label">
                   <input id="toggle-${opt.id}" class="OLToggleSwitch"${inputData} data-value="1" type="checkbox" value="${opt.initValue === true ? 2 : 1}" name="optradio" onchange="$(\'#toggle-${opt.id}-1, #toggle-${opt.id}-2\').toggle(); $(this).val(($(this).val() % 2) + 1);" ${opt.initValue?'checked=""':''} />
                   <i style="display: inline-block; right:0; left:0;"/>
                   <span class="ol-font-standard olcore_ui_toggle_span">
                     <span id="toggle-${opt.id}-1" class="filter-active" style="display: ${opt.initValue ? 'inline' : 'none'};">${opt.name}</span>
                     <span id="toggle-${opt.id}-2" class="filter-not-active" style="display: ${opt.initValue ? 'none' : 'inline'};">${opt.name}</span>
                   </span>
                 </label>
               </div>
               </div>`);
        $("body").on('click', `input#toggle-${opt.id}`, function(evt){
            const inp = evt.currentTarget;
            const isChecked = inp.checked;
            if (typeof opt.callback === 'function'){
                opt.callback(isChecked);
            }
        });
        return ret;
    };
 
    GM_addStyle(`.OLCorePopupVeil {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      -ms-display: flex;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      background-color: rgba(0,0,0,0.5);
    }
 
    .OLCorePopupPop {
      position: relative;
      /*margin: auto; //knallt im IE, anscheinend nicht nötig*/
      cursor: default;
      max-width: calc(100% - 60px);
      max-height: calc(100% - 120px);
      overflow: auto;
      overflow: overlay;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
      /*
      min-height: 30px;
      overflow-y: scroll;
      overflow-x: visible;
      pointer-events: auto;
      background-color: #f1f1f1;
      */
      background-color: #ffffff;
      border-radius: 6px;
      z-index: 99999;
      box-shadow: 0 10px 6px -6px #999999;
      box-sizing: border-box;
    }
 
       /* Hide scrollbar for Chrome, Safari and Opera */
     .OLCorePopupPop::-webkit-scrollbar {
         display: none;
     }
 
    .OLCorePopupPop_center {
      position: fixed;
      top: 50%;
      left: 50%;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .OLCorePopupPop_left {
      position: fixed;
      top: 50%;
      left: 10%;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .OLCorePopupPop_right {
      position: fixed;
      top: 50%;
      right: 0;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .OLCorePopupPop.animate {
      -ms-transition: all 0.5s cubic-bezier(0.5, -0.3, 0.5, 1.3);
      transition: all 0.5s cubic-bezier(0.5, -0.3, 0.5, 1.3);
    }
    .OLCorePopupTitle {
			cursor: move;
      padding:6px;
      font-size:18px;
      font-weight:bold;
      /*width:100%;*/
      background-color:#5e8daa;
      color:white;
      white-space: nowrap;
      border-radius:6px 6px 0 0;
      /*box-shadow: 0 0 2px 1px #000000;*/
      text-align: left;
      -ms-display: flex;
      display: flex;
      justify-content: space-between;
      /*align-items: center;*/
      font-weight: normal;
      z-index: 1; /*sonst liegt title nicht über body und mouseover bei virtuellen geht nicht*/
      box-sizing: border-box; /*180302 Testweise eingebaut */
      /*180302 muss bei box-sizing raus/größer: height: 20px;*/
    }
    .OLCorePopupContent{
      border-radius: 0 0 6px 6px;
    }
    `);
 
    OLCore.UI.popup = function(content, opt){
        opt = opt || {};
        const title = opt.title || '&nbsp;';
        const width = opt.width || 'auto';
        let align = opt.align || 'center';
        if (align !== 'right' && align !== 'left'){
            align = 'center';
        }
        const pop = $(`<div class="OLCorePopupPop OLCorePopupPop_${align}" />`);
        const popTitle = $(`<div class="OLCorePopupTitle">${title}</div>`);
        const popClose = $(`<span style="position:absolute; right:10px; padding-top:3px;cursor:pointer;" class="fa fa-close" />`);
        const popCont = $(`<div class="OLCorePopupContent" style="width:${width}"></div>`);
 
        if (typeof content === 'string'){
            popCont.html(content);
        } else if (typeof content === 'object' && content.length){
            popCont.append(content);
        }
 
        popClose.click(function(){pop.remove();});
 
        popClose.appendTo(popTitle);
        popTitle.appendTo(pop);
        popCont.appendTo(pop);
        pop.appendTo("body");
 
        const popup = pop[0];
        const offset = { x: 0, y: 0 };
 
        function popupMove(e){
            popup.style.position = 'absolute';
            var top = e.clientY - offset.y;
            var left = e.clientX - offset.x;
            popup.style.top = top + 'px';
            popup.style.left = left + 'px';
        }
 
        function mouseUp()
        {
            window.removeEventListener('mousemove', popupMove, true);
        }
 
        function mouseDown(e){
            offset.x = e.clientX - popup.offsetLeft;
            offset.y = e.clientY - popup.offsetTop;
            window.addEventListener('mousemove', popupMove, true);
        }
 
        popTitle[0].addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);
        return {
            close: function(){pop.remove();}
        };
    };
 
    OLCore.UI.progressIndicator = function(target, opt){
        opt = opt || {};
 
        const $target = $(target || "body");
        const ends = [];
 
        if (!target){          
            const pi = $('<div class="Toolbox_ProgressIndicator" />').appendTo("body");
            ends.push(function(){pi.remove()});          
        } else {
        $target.each(function(i, tgt){
            if (opt.clear){
                $(tgt).html("");
                if ($(tgt).width() * $(tgt).height() === 0){
                    $(tgt).html("&nbsp;&nbsp;&nbsp;&nbsp;");
                }
            }
            const saveStyle = {
                'backgroundImage':tgt.style.backgroundImage,
                'backgroundRepeat':tgt.style.backgroundRepeat,
                'backgroundPosition':tgt.style.backgroundPosition,
                'backgroundSize':tgt.style.backgroundSize
            };
 
            $(tgt).css({
                'backgroundImage':`url(${OLCore.I18n.loaderImage})`,
                'backgroundRepeat':'no-repeat',
                'backgroundPosition':'center',
                'backgroundSize':'contain'
            });
 
            ends.push(function(){
                tgt.style.backgroundImage = saveStyle.backgroundImage;
                tgt.style.backgroundRepeat = saveStyle.backgroundRepeat;
                tgt.style.backgroundPosition = saveStyle.backgroundPosition;
                tgt.style.backgroundSize = saveStyle.backgroundSize;
            });
        });
        }
        //const pi = $(`<img src="${OLCore.I18n.loaderImage}" style="position:fixed;z-index:999999; left: 50%; top: 50%;" />`).appendTo(target);;
        function end(){
            for (const e of ends){
                e();
            }
        }
        return {
            end: end
        };
    };
 
    GM_addStyle(".ui-dialog { z-index: 1000 !important ;}");
    GM_addStyle(".olcore_info_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");
 
    OLCore.info = function(string){
        $(`<div id="olcore_info_popup" class="olcore_info_popup">${string}</div>`).dialog({
            classes: {},
            hide: { effect: "fade" },
            show: { effect: "fade" },
            open: function(event, ui) {
                setTimeout(function(){
                    $('#olcore_info_popup').dialog('close');
                    $('#olcore_info_popup').remove();
                }, 1000);
            }
        });
    };
 
    /***
     * API
     ***/
    OLCore.Api = {};
 
    OLCore.Api.friendlyPlayed = async function(){
        if (OLCore.getMatchdayValue("isFriendlyPlayed")){
            return true;
        }
        const fData = await OLCore.get("/friendlies/offers");
        const isPlayed = $(fData).find("div.ol-friendly-offers-table-row:first-child .text-matchresult").text().toUpperCase() === "SPIELBERICHT";
        OLCore.setMatchdayValue("isFriendlyPlayed", isPlayed);
        return isPlayed;
    };
 
    /* Team */
    OLCore.Api.getTeamInfo = async function (userId){
        userId = userId || OLCore.Base.userId;
        const teamData = window.location.href.endsWith(`team/overview?userId=${userId}`) || window.location.href.endsWith(`team/overview/info?userId=${userId}`) ?
                           $("div#ol-root").children() :
                           await OLCore.get(`/team/overview?userId=${userId}`);
        const teamInfo = {Overview:{}};
        teamInfo.userId = userId;
 
        const matchLink = $(teamData).find("div.row.league-match-overview-wrapper:has(div:first-child:contains('LIGA AKTUELL')) div.team-overview-current-match-result[onclick]");
        if (matchLink.length === 1){
            const matchIdMatch = matchLink.attr("onclick").match(/\s*'?season'?\s*:\s*(\d+)\s*,\s*'?matchId'?\s*:\s*(\d+)\s*}/);
            teamInfo.lastMatch = { id: parseInt(matchIdMatch[2],10), season:  parseInt(matchIdMatch[1],10)};
        }
        const pop = parseFloat($(teamData).find("span.ol-popularity-widget-value").eq(0).text());
        teamInfo.popularity = pop;
        const leagueDiv = $(teamData).find("div.ol-tf-league");
        teamInfo.leagueLevel = OLCore.getNum(leagueDiv.children("span").eq(0).text());
        teamInfo.leagueId = OLCore.getNum(leagueDiv.attr("onclick"),2);
        const rank = OLCore.getNum($(teamData).find(`td > span.ol-team-name.ol-bold[onclick*=' ${userId} ']`).parent().parent().children().eq(1).text());
        teamInfo.rank = rank;
        return teamInfo;
    };
 
    OLCore.Api.getTeamHistory = async function (userId, season){
        const teamHistory = {};
        const histData = await OLCore.get(`/team/overview/history/season?userId=${userId}&season=${season}`);
        const matches = [];
 
        $(histData).filter("div.collapse-row").each(function(i,el){
            const row = $(el);
            const matchDay = row.find("span.team-overview-history-matchday.hidden-sm").text().trim().replace(/\s/g,'').split("/");
            const location = OLCore.getNum(row.find("span.ol-team-name").eq(0).attr("onclick")) === userId ? "H" : "A";
            let result = row.find("div.team-overview-history-result").text().trim().replace(/\s/g,'');
            result = result.substring(0, result.indexOf("("));
            const goals = result.split(":").map(r => Number(r));
            const winner = goals[0] > goals[1] ? "H" : (goals[0] < goals[1] ? "A" : "N");
            const rowData = {
                type: (row.hasClass("ol-friendly") ? "F" : (matchDay[0].toLowerCase() === "quali."?"Q":"L")),
                matchId: OLCore.getNum(row.find("a.team-overview-history-matchreport-button").attr("onclick"), 1),
                opponent: { id: OLCore.getNum(row.find("span.ol-team-name:not(.ol-bold)").attr("onclick")), name: row.find("span.ol-team-name:not(.ol-bold)").text().trim()} ,
                location: location,
                result: result,
                outcome: winner === "N" ? "draw" : (winner === location ? "win" : "loss"),
                matchDay: matchDay[0].toLowerCase() === "friendly" ? null : parseInt(matchDay[0],10),
                week: parseInt(matchDay[1],10)
            };
            matches.push(rowData);
        });
 
        const lastLeague = $(histData).filter("div.ol-league").last();
        if (lastLeague.length === 0){
            return {lastMatch: null, matches: []};
        }
        const matchIdMatch = lastLeague.find("a.team-overview-history-matchreport-button").attr("onclick").match(/\s*'?season'?\s*:\s*(\d+)\s*,\s*'?matchId'?\s*:\s*(\d+)\s*}/);
        teamHistory.lastMatch = { id: parseInt(matchIdMatch[2],10), season:  parseInt(matchIdMatch[1],10)};
        teamHistory.matches = matches;
        return teamHistory;
    };
 
    OLCore.Api.getSquad = async function (userId){
 
        function parseOverviewSquad(squadData){
            const rows = $(squadData).filter("div.team-overview-squad-row").has("span.ol-player-name");
            const teamValue = $(squadData).find('span.bandarole-team-value > span.pull-right').text();
            const playerArray = [];
            const playerData = {};
            rows.each(function(){
                const player = {};
                const row = $(this);
                const subrow1 = row.children("div").eq(0).children().eq(0);
                const subrow2 = row.children("div").eq(1).children().eq(0);
                const nameDiv = subrow1.children("div.team-overview-squad-player-name").eq(0);
                const nameSpan = $(nameDiv.find("span.ol-player-name[onclick]")[0]);
                const lineupSpan = $(nameDiv.find("span.team-overview-player-lineup-mark")[0]);
 
                if (nameDiv.find("div.icon-icon_player_transfer").length){
                    try {
                        player.offerId = parseInt(nameDiv.children("a").eq(0).attr("data-content").match(/openBidOverviewAndShowOfferView\((\d+)\)/)[1], 10);
                    } catch (e) {}
                }
                player.id = parseInt(nameSpan.attr("onclick").match(/{\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
                player.name = nameSpan.text();
                player.new = nameDiv.find("span.ol-new-player").length === 1;
                player.aggressiveLeader = nameDiv.find("span.lineup-editor-aggressive-leader").length === 1;
                if (nameDiv.find("span.ol-player-out").length){
                    const outTypeClass = $(nameDiv.find("span.ol-player-out")[0]).children().eq(0).attr("class");
                    if (outTypeClass.match(/icon-icon_(\w+)\b/)){
                        player.outType = outTypeClass.match(/icon-icon_(\w+)\b/)[1];
                    }
                    player.outDuration = parseInt(nameDiv.find("span.ol-player-out-duration").text(), 10);
                }
 
                player.lineup = 0; // 0 = not lined up, 1= League lineUp, 2 = League Sub, 4 = Friendly lineup, 8 = Friendly Sub
                if (lineupSpan.find("span.ol-player-squad-display.pull-left:not(.player-substitute-display)").length){
                    player.lineup += 1;
                }
                if (lineupSpan.find("span.ol-player-squad-display.player-substitute-display.pull-left").length){
                    player.lineup += 2;
                }
                if (lineupSpan.find("span.ol-player-squad-display.pull-right:not(.player-substitute-display)").length){
                    player.lineup += 4;
                }
                if (lineupSpan.find("span.ol-player-squad-display.player-substitute-display.pull-right").length){
                    player.lineup += 8;
                }
 
                player.nation = subrow1.children("div.team-overview-squad-nationality-cell").eq(0).children("span.nationality-no-wrap").text();
                player.age = parseInt(subrow1.children("div#sqaudAge").text(),10);
                player.positions = subrow1.children("div.team-squad-overview-position").text().replace(/\s+/g,'').split(',');
 
                player.apps = parseInt(subrow2.children("div").eq(0).text(), 10);
                player.goals = parseInt(subrow2.children("div").eq(1).text(), 10);
                player.assi = parseInt(subrow2.children("div").eq(2).text(), 10);
                player.value = OLCore.getNum(subrow2.children("div").eq(5).text());
                player.rating = OLCore.getNum(subrow2.children("div").eq(6).text());
                playerArray.push(player);
                playerData[player.id] = player;
            });
            return {
                playerArr: playerArray,
                playerObj: playerData,
                teamVal: OLCore.getNum(teamValue),
                leagueLineup: function(){return playerArray.filter(p => (p.lineup & 1) > 0);},
                leagueSubs: function(){return playerArray.filter(p => (p.lineup & 2) > 0);},
                friendlyLineup: function(){return playerArray.filter(p => (p.lineup & 4) > 0);},
                friendlySubs: function(){return playerArray.filter(p => (p.lineup & 8) > 0);}
            };
        }
 
        function parseTeamSquad(){
            const rows = $("div.row.squad-overview-mobile-rows").has("span.ol-player-name");
            const teamValue = $('span.team-squad-mobile-bandarole.bandarole-right.banderole-center > span.pull-right').text();
            const playerArray = [];
            const playerData = {};
            rows.each(function(){
                const player = {};
                const row = $(this);
                const subrow1 = row.children("div").eq(0).children().eq(0);
                const subrow2 = row.children("div").eq(1).children().eq(0);
                const nameDiv = subrow1.children("div.squad-overview-player-column").eq(0);
                const nameSpan = $(nameDiv.find("span.ol-player-name[onclick]")[0]);
                const lineupSpan = $(nameDiv.find("span.team-overview-player-lineup-mark")[0]);
 
                if (nameDiv.find("div.icon-icon_player_transfer").length){
                    try {
                        player.offerId = parseInt($(nameDiv.find("div.icon-icon_player_transfer")[0].parentNode).attr("data-content").match(/openBidOverviewAndShowOfferView\((\d+)\)/)[1], 10);
                    } catch (e) {}
                }
                player.id = parseInt(nameSpan.attr("onclick").match(/{\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
                player.playerId = player.id;
                player.name = nameSpan.text();
                player.new = nameDiv.find("span.ol-new-player").length === 1;
                player.aggressiveLeader = nameDiv.find("span.aggressive-leader-popup-wrapper").length === 1;
                if (nameDiv.find("span.ol-player-out").length){
                    const outTypeClass = $(nameDiv.find("span.ol-player-out")[0]).children().eq(0).attr("class");
                    if (outTypeClass.match(/icon-icon_(\w+)\b/)){
                        player.outType = outTypeClass.match(/icon-icon_(\w+)\b/)[1];
                    }
                    player.outDuration = parseInt(nameDiv.find("span.ol-player-out-duration").text(), 10);
                }
 
                player.lineup = 0; // 0 = not lined up, 1= League lineUp, 2 = League Sub, 4 = Friendly lineup, 8 = Friendly Sub
                if (lineupSpan.find("span.ol-player-squad-display.pull-left:not(.player-substitute-display)").length){
                    player.lineup += 1;
                }
                if (lineupSpan.find("span.ol-player-squad-display.player-substitute-display.pull-left").length){
                    player.lineup += 2;
                }
                if (lineupSpan.find("span.ol-player-squad-display.pull-right:not(.player-substitute-display)").length){
                    player.lineup += 4;
                }
                if (lineupSpan.find("span.ol-player-squad-display.player-substitute-display.pull-right").length){
                    player.lineup += 8;
                }
 
                player.nation = subrow1.children("div.squad-overview-nationality-column").eq(0).children("span.ol-squad-country-name").text();
                player.age = parseInt(subrow1.children("div.squad-overview-player-age").text(),10);
                player.positions = subrow1.children("div.positionCell").text().replace(/\s+/g,'').split(',');
 
                player.apps = parseInt(subrow2.children("div").eq(0).text(), 10);
                player.goals = parseInt(subrow2.children("div").eq(1).text(), 10);
                player.assi = parseInt(subrow2.children("div").eq(2).text(), 10);
                player.value = OLCore.getNum(subrow2.children("div").eq(4).text());
                player.rating = OLCore.getNum(subrow2.children("div").eq(5).text());
                playerArray.push(player);
                playerData[player.id] = player;
            });
            return {
                playerArr: playerArray,
                playerObj: playerData,
                teamVal: OLCore.getNum(teamValue),
                leagueLineup: function(){return playerArray.filter(p => (p.lineup & 1) > 0);},
                leagueSubs: function(){return playerArray.filter(p => (p.lineup & 2) > 0);},
                friendlyLineup: function(){return playerArray.filter(p => (p.lineup & 4) > 0);},
                friendlySubs: function(){return playerArray.filter(p => (p.lineup & 8) > 0);}
            };
        }
 
        userId = userId || olUid;
 
        if (userId === olUid && $("div.row.squad-overview-mobile-rows").length){
          return parseTeamSquad();
        }
 
        const squadData = window.location.href.endsWith(`team/overview/squad?userId=${userId}`) ?
                           $("div#olTeamOverviewContent").children() :
                           await OLCore.get(`/team/overview/squad?userId=${userId}`);
 
        return parseOverviewSquad(squadData);
    };
 
    /* Player */
    OLCore.Api.getTransferHistory = async function(playerId){
      const hist = await OLCore.get(`/player/transferhistory?playerId=${playerId}`);
      const entries = [];
      $(hist).find("div.row.player-marketvalue-table").each(function(){
        const row = $(this);
        const subRow1 = row.children().eq(0).children().eq(0);
        const subRow2 = row.children().eq(1).children().eq(0);
        const entry = {};
        entry.season = parseInt(subRow1.children("div").eq(0).text(),10);
        entry.matchDay = parseInt(subRow1.children("div").eq(2).children("small").text().match(/(\d+)\./)[1],10);
        if (subRow1.find("span.ol-team-name").length){
          entry.newTeam = parseInt(subRow1.find("span.ol-team-name").attr("onclick").match(/{\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        } else {
          if (subRow1.find('span:contains("Vereinslos")').length){
            entry.newTeam = 0;
          }
        }
        if (subRow2.find("span.ol-team-name").length){
          entry.oldTeam = parseInt(subRow2.find("span.ol-team-name").attr("onclick").match(/{\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        } else {
          if (subRow2.find('span:contains("Vereinslos")').length){
            entry.oldTeam = 0;
          } else
          if (subRow2.find('span:contains("Heimatverein")').length){
            entry.oldTeam = -1;
          }
        }
        entry.transferFeeText = $(subRow2.find('div:contains("€")')[0]).text();
        entry.transferFee = OLCore.getNum(entry.transferFeeText);
        entries.push(entry);
      });
      return entries;
    };
 
    OLCore.Api.getPerformanceData = async function(playerId, season, userId){
        season = season || OLCore.Base.season;
        userId = userId || OLCore.Base.userId;
        const performanceData = [];
        const perfData = await OLCore.get(`/player/performancedata/season?playerId=${playerId}&season=${season}&userId=${userId}`);
        $(perfData).filter("div.row.player-overview-performance-table.player-overview-performance-table-grid-row").each(function(i, el){
            const subRow0 = $($(el).find("div.player-performance-sub-row > div.row")[0]);
            const subRow1 = $($(el).find("div.player-performance-sub-row > div.row")[1]);
            const date = subRow0.children("div").eq(0).text().replace(/ /g,"").split("/");
            const matchDay = parseInt(date[0],10);
            const week = parseInt(date[1],10);
            const teams = $.makeArray($(el).find("span.ol-team-name")).map(a => a.innerText.replace(/^\s+/,'').replace(/\s+$/,''));
            const cardCol = subRow1.children("div").eq(4);
            let card = null;
            let homeGoals = null;
            let awayGoals = null;
            if (cardCol.children("div").length && cardCol.children("div").eq(0).attr("class").match(/icon-icon_(\w+)\b/)){
                card = cardCol.children("div").eq(0).attr("class").match(/icon-icon_(\w+)\b/)[1];
            }
            const result = subRow1.children("div").eq(8).text();
            if (result.match(/\s*\d+\s*:\s*\d+\s*/)){
                homeGoals = parseInt(result.split(":")[0],10);
                awayGoals = parseInt(result.split(":")[1],10);
            }
            const matchPlace = teams[0] === OLCore.Base.teamName ? "Home" : "Away";
            const opponent = teams[0] === OLCore.Base.teamName ? teams[1] : teams[0];
            const rating = parseFloat(subRow1.find("div.player-performance-rating").text());
            const goals = parseInt(subRow1.children("div").eq(2).text(),10);
            const assists = parseInt(subRow1.children("div").eq(3).text(),10);
            const _in = parseInt(subRow1.children("div").eq(6).text(),10) || -1;
            const _out = parseInt(subRow1.children("div").eq(7).text(),10) || -1;
            const outcome = (teams[0] === OLCore.Base.teamName && homeGoals > awayGoals) || (teams[1] === OLCore.Base.teamName && homeGoals < awayGoals) ? "win" : (
                            (teams[0] === OLCore.Base.teamName && homeGoals < awayGoals) || (teams[1] === OLCore.Base.teamName && homeGoals > awayGoals) ? "loss" : "draw"
            );
            const data = {
                "type" : matchDay ? "L" : "F",
                "matchDay" : matchDay ? matchDay : -1,
                "week" : week,
                "matchPlace" : matchPlace,
                "opponent" : opponent,
                "rating" : rating,
                "goals" : goals,
                "assists" : assists,
                "card" : card,
                "in" : _in,
                "out" : _out,
                "result": result,
                "outcome" : outcome
            };
            performanceData.push(data);
        });
        return performanceData;
    };
 
    OLCore.Api.getPlayerOverview = async function(playerId){
        const playerData = await OLCore.get(`/player/overview?playerId=${playerId}`);
        const dataCols = $(playerData).find("div.container.playeroverviewtablestriped > div.row > div.col-md-6 > div.row");
        const player = {attributes:{},skills:{}};
        dataCols.each(function(i, col){
            const attr = $(col).children("div").eq(0).text().trim();
            const value = $(col).children("div").eq(1).text().trim();
            if (attr){
                player.attributes[attr.trim()] = value ? value.trim() : null;
                if (attr === "Marktwert"){
                    player.marketValue = OLCore.getNum(value);
                }
                if (attr === "Jahresgehalt"){
                    player.salary = OLCore.getNum(value);
                }
            }
        });
        const attrCols = $(playerData).find(".player-attribute-overview div.col-md-6.col-lg-6");
        attrCols.each(function(i,col){
            const attr = $(col).find("div.player-info-abilitys-headline").text().trim();
            const value = OLCore.getNum($(col).find("span.ol-value-bar-small-label-value").text());
            player.skills[attr] = value;
        });
        return player;
    };
 
    /* Matchday */
 
    OLCore.Api.getMatchDay = async function(season, leagueId, matchDay){
        season = season || OLCore.Base.season;
        leagueId = leagueId || OLCore.Base.leagueId;
        matchDay = matchDay || OLCore.Base.matchDay;
        if (isNaN(matchDay) || matchDay < 1 || matchDay > 34){
            console.error("[OLCore.Api.getMatchDay] Invalid Matchday", matchDay);
            return;
        }
        const matchDayData = await OLCore.get(`/matchdaytable/matchdaytable?season=${season}&matchday=${matchDay}&leagueId=${leagueId}`);
        const table = [];
        let lastRank = 1;
        $(matchDayData).find("div#ol-table-content tbody > tr").each(function(i,tr){
            const rankNum = OLCore.getNum($(tr).children("td").eq(1).text());
            if (rankNum > 0){
                lastRank = rankNum;
            }
            const rank = rankNum > 0 ? rankNum : lastRank;
            const teamName = $(tr).find("span.ol-team-name").contents().eq(0).text().trim();
            const teamIdStr = OLCore.convertNumber($(tr).find("span.ol-team-name, span.ol-team-name-inactive").attr("onclick"), true);
            const rowMatch = tr.innerText.replace(/[\n ]{2,}/g,'\t').match(/^\t(\d*)\.+\t([^\t]+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+) : (\d+)\t(-?\d+)\t(\d+)\t$/);
            const teamId = parseInt(teamIdStr, 10);
            table.push({
                rank: rank,
                teamName: teamName,
                teamId: teamId
            });
        });
        return {
            table: table
        };
    };
 
    /* Match */
 
    OLCore.Api.getFriendlyLineup = async function(season, matchId, userId){
        const matchData = window.location.href.endsWith(`/friendly?season=${season}&matchId=${matchId}`) && $("div#ol-pitch-position").length ?
              $("div#olTeamOverviewContent").children() :
        await OLCore.get(`/friendly/lineup?season=${season}&matchId=${matchId}`);
        const matchLineup = {"home" : {"lineup":[], "substitutions": []}, "away" : {"lineup":[], "substitutions": []}};
        const userIdA = $(matchData).find("div#matchdayresult > div.ol-page-content > div.row >  div.col-md-4 > a[onclick]");
        matchLineup.home.userId = parseInt($(userIdA[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchLineup.away.userId = parseInt($(userIdA[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        const pitches = $(matchData).find("div#matchContent div.ol-team-settings-pitch-position-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];
        $(pitch0).find("div.ol-pitch-position").each(function(i,e){
            const pos = $(this);
            const playerId = parseInt(e.parentNode.localName === "a" && e.parentNode.hasAttribute("onclick") ?
                                      $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] :
                                      $(e).find("div[data-player-id]").attr("data-player-id"),10);
            const pos2 = $(this).find("div.ol-team-settings-player-drag-and-drop.match-report-pitch-player-wrapper");
            const playerData = {
                positionShort : pos.attr("data-player-position"),
                positionIndex : pos.attr("data-player-position-index"),
                positionMapping : pos.attr("data-mapping"),
                positionId : pos.attr("data-position"),
                playerType : pos2.length ? pos2.attr("data-player-type") : undefined,
                playerId : playerId
            };
            const ratingSpan = pos.find("span.match-done.ol-team-settings-pitch-position-avg-value");
            if (ratingSpan.length){
                playerData.rating = parseFloat(ratingSpan.text());
            }
            matchLineup.home.lineup.push(playerData);
        });
        $(pitch1).find("div.ol-pitch-position").each(function(i,e){
            const pos = $(this);
            const playerId = parseInt(e.parentNode.localName === "a" && e.parentNode.hasAttribute("onclick") ?
                                      $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] :
                                      $(e).find("div[data-player-id]").attr("data-player-id"),10);
            const pos2 = $(this).find("div.ol-team-settings-player-drag-and-drop.match-report-pitch-player-wrapper");
            const playerData = {
                positionShort : pos.attr("data-player-position"),
                positionIndex : pos.attr("data-player-position-index"),
                positionMapping : pos.attr("data-mapping"),
                positionId : pos.attr("data-position"),
                playerType : pos2.length ? pos2.attr("data-player-type") : undefined,
                playerId : playerId
            };
            const ratingSpan = pos.find("span.match-done.ol-team-settings-pitch-position-avg-value");
            if (ratingSpan.length){
                playerData.rating = parseFloat(ratingSpan.text());
            }
            matchLineup.away.lineup.push(playerData);
        });
        matchLineup[matchLineup.home.userId] = matchLineup.home;
        matchLineup[matchLineup.away.userId] = matchLineup.away;
        if (userId > 0 && matchLineup[userId]){
            return matchLineup[userId];
        }
        return matchLineup;
    };
 
    OLCore.Api.getMatchLineup = async function(season, matchId, userId){
 
        const matchLineup = {"home" : {"lineup":[], "substitutions": [], "players": {}}, "away" : {"lineup":[], "substitutions": [], "players": {}}};
 
        if (!season || !matchId){
            console.log('[OLCore.Api.getMatchLineup] invalid params');
            return userId ? matchLineup.home : matchLineup;
        }
 
        const matchData = window.location.href.endsWith(`/match?season=${season}&matchId=${matchId}`) && $("div#ol-pitch-position").length ?
                           $("div#olTeamOverviewContent").children() :
                           await OLCore.get(`/match/lineup?season=${season}&matchId=${matchId}`);
        const userIdSpan = $(matchData).find("div.timeline-teamname-wrapper > span[onclick]");
        const formations = $(matchData).find("div.team-system-headline");
        const pitches = $(matchData).find("div.ol-team-settings-pitch-position-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];
        if (pitches.length === 0){
          return null;
        }
        matchLineup.home.userId = parseInt($(userIdSpan[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchLineup.away.userId = parseInt($(userIdSpan[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchLineup.home.formation = formations.eq(0).text();
        matchLineup.away.formation = formations.eq(1).text();
        $(pitch0).find("div.ol-pitch-position").each(function(i,el){
            const playerId = parseInt(el.parentNode.localName === "a" && el.parentNode.hasAttribute("onclick") ?
                                      $(el.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] :
                                      $(el).find("div[data-player-id]").attr("data-player-id"),10);
            const pos = $(el).find("div.ol-team-settings-player-drag-and-drop.match-report-pitch-player-wrapper");
            const playerPositions = OLCore.playerPositions2String(parseInt(pos.attr("data-player-positions"),10));
            const position = {
                short: $(el).attr("data-player-position"),
                index: $(el).attr("data-player-position-index"),
                mapping: $(el).attr("data-mapping"),
                id: $(el).attr("data-position"),
                playerPositions: playerPositions,
                wrong: pos.hasClass("ol-pitch-wrong-player-position")
            };
            const playerData = {
                position : position,
                playerType : pos.length ? pos.attr("data-player-type") : undefined,
                playerId : playerId,
                rating : parseFloat($(el).find("span.match-done.ol-team-settings-pitch-position-avg-value").text()),
                injury : $(el).find("div.icon-icon_cross_red").length > 0,
                ord : i
            };
            const ratingSpan = pos.find("span.match-done.ol-team-settings-pitch-position-avg-value");
            if (ratingSpan.length){
                playerData.rating = parseFloat(ratingSpan.text());
            }
            matchLineup.home.lineup.push(playerData);
            matchLineup.home.players[playerId] = playerData;
        });
        $(pitch1).find("div.ol-pitch-position").each(function(i,el){
            const playerId = parseInt(el.parentNode.localName === "a" && el.parentNode.hasAttribute("onclick") ?
                                      $(el.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] :
                                      $(el).find("div[data-player-id]").attr("data-player-id"),10);
            const pos = $(el).find("div.ol-team-settings-player-drag-and-drop.match-report-pitch-player-wrapper");
            const playerPositions = OLCore.playerPositions2String(parseInt(pos.attr("data-player-positions"),10));
            const position = {
                short: $(el).attr("data-player-position"),
                index: $(el).attr("data-player-position-index"),
                mapping: $(el).attr("data-mapping"),
                id: $(el).attr("data-position"),
                playerPositions: playerPositions,
                wrong: $(pos).hasClass("ol-pitch-wrong-player-position")
            };
            const playerData = {
                position : position,
                playerType : pos.length ? pos.attr("data-player-type") : undefined,
                playerId : playerId,
                rating : parseFloat($(el).find("span.match-done.ol-team-settings-pitch-position-avg-value").text()),
                injury : $(el).find("div.icon-icon_cross_red").length > 0,
                ord : i
            };
            const ratingSpan = pos.find("span.match-done.ol-team-settings-pitch-position-avg-value");
            if (ratingSpan.length){
                playerData.rating = parseFloat(ratingSpan.text());
            }
            matchLineup.away.lineup.push(playerData);
            matchLineup.away.players[playerId] = playerData;
        });
        const subs = $(matchData).find("div.substitution_wrapper");
        const sub0 = subs[0];
        const sub1 = subs[1];
        $(sub0).find("div.match-substitution-minute").each(function(i,el){
            const min = parseInt($(el).text(),10);
            const subInfo = $(el).next();
            const subIn = subInfo.find("div.matchresult-substitution").eq(0);
            const playerIdIn = parseInt(subIn.attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
            const playerMatchIn = subIn.text().trim().match(/^(.*\S)\s*\((.*)\)$/);
            const playerNameIn = playerMatchIn[1];
            const playerRatingIn = parseFloat(playerMatchIn[2]);
            const subOut = subInfo.find("div.matchresult-substitution").eq(1);
            const playerIdOut = parseInt(subOut.attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
            const playerMatchOut = subOut.text().trim().match(/^(.*\S)\s*\((.*)\)$/);
            const playerNameOut = playerMatchOut[1];
            const playerRatingOut = parseFloat(playerMatchOut[2]);
            matchLineup.home.substitutions.push({
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            });
            matchLineup.home.players[playerIdOut] = matchLineup.home.players[playerIdOut] || {};
            matchLineup.home.players[playerIdOut].out = min;
            matchLineup.home.players[playerIdIn] = {in: min, rating: playerRatingIn, playerId: playerIdIn, playerName: playerNameIn};
            matchLineup.home.players[playerIdIn].position = matchLineup.home.players[playerIdOut].position;
        });
        $(sub1).find("div.match-substitution-minute").each(function(i,el){
            const min = parseInt($(el).text(),10);
            const subInfo = $(el).next();
            const subIn = subInfo.find("div.matchresult-substitution").eq(0);
            const playerIdIn = parseInt(subIn.attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
            const playerMatchIn = subIn.text().trim().match(/^(.*\S)\s*\((.*)\)$/);
            const playerNameIn = playerMatchIn[1];
            const playerRatingIn = parseFloat(playerMatchIn[2]);
            const subOut = subInfo.find("div.matchresult-substitution").eq(1);
            const playerIdOut = parseInt(subOut.attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
            const playerMatchOut = subOut.text().trim().match(/^(.*\S)\s*\((.*)\)$/);
            const playerNameOut = playerMatchOut[1];
            const playerRatingOut = parseFloat(playerMatchOut[2]);
            matchLineup.away.substitutions.push({
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            });
            matchLineup.away.players[playerIdOut] = matchLineup.away.players[playerIdOut] || {};
            matchLineup.away.players[playerIdOut].out = min;
            matchLineup.away.players[playerIdIn] = {in: min, rating: playerRatingIn, playerId: playerIdIn, playerName: playerNameIn};
            matchLineup.away.players[playerIdIn].position = matchLineup.away.players[playerIdOut].position;
        });
        matchLineup[matchLineup.home.userId] = matchLineup.home;
        matchLineup[matchLineup.away.userId] = matchLineup.away;
        if (userId > 0 && matchLineup[userId]){
            return matchLineup[userId];
        }
        return matchLineup;
    };
 
    OLCore.Api.getMatchStatistics = async function(season, matchId, userId){
        const matchData = window.location.href.endsWith(`/match?season=${season}&matchId=${matchId}`) && $("div.ol-match-statistic").length ?
                           $("div#matchContent").children() :
                           await OLCore.get(`/match/statistic?season=${season}&matchId=${matchId}`);
        const matchStatistics = {
            "home" : {
                lineup: [],
                substitutions: [],
                reserve: [],
                goals: [],
                cards: [],
                players: {}
            },
            "away" : {
                lineup: [],
                substitutions: [],
                reserve: [],
                goals: [],
                cards: [],
                players: {}
            }
        };
        const userIdSpan = $(matchData).find("div.timeline-teamname-wrapper > span[onclick]");
        matchStatistics.home.userId = parseInt($(userIdSpan[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchStatistics.away.userId = parseInt($(userIdSpan[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        $(matchData).find("tr.ol-match-statistic-grade").children("td").eq(0).children("span.hidden-xs").each(function(i,el){
            const gradeMatch = $(el).html().match(/playerId:\s*(\d+).*>(.*)<\/span>\s*\((.*)\)/);
            if (gradeMatch){
                const playerId = parseInt(gradeMatch[1],10);
                const playerName = gradeMatch[2];
                const rating = parseFloat(gradeMatch[3]);
                const playerData = {"playerId": playerId, "playerName": playerName, "rating": rating, "goals" : 0, "assists" : 0};
                matchStatistics.home.lineup.push(playerData);
                matchStatistics.home.players[playerId] = playerData;
            }
        });
        for (const sub of $(matchData).find("tr.ol-match-statistic-substitutions > td:nth-child(1)").html().matchAll(/<span>(\d+)<span.*?playerId:\s*(\d+).*?>(.*?)<\/span>.*?\((.*?)\).*?playerId:\s*(\d+).*?>(.*?)<\/span>.*?\((.*?)\)/gs)){
            const min = parseInt(sub[1],10);
            const playerIdIn = parseInt(sub[2],10);
            const playerNameIn = sub[3];
            const playerRatingIn = parseFloat(sub[4]);
            const playerIdOut = parseInt(sub[5],10);
            const playerNameOut = sub[6];
            const playerRatingOut = parseFloat(sub[7]);
            matchStatistics.home.substitutions.push({
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            });
            matchStatistics.home.players[playerIdOut] = matchStatistics.home.players[playerIdOut] || {};
            matchStatistics.home.players[playerIdOut].out = min;
            matchStatistics.home.players[playerIdIn] = {in: min, rating: playerRatingIn, playerId: playerIdIn, playerName: playerNameIn, "goals" : 0, "assists" : 0};
        }
        $(matchData).find("tr.ol-match-statistic-squad > td:nth-child(1) > span").each(function(i,el){
            const m = $(el).html().match(/playerId:\s*(\d+).*>(.*)<\/span>/);
            if (m){
                matchStatistics.home.reserve.push({
                    "id": parseInt(m[1],10),
                    "name" : m[2]
                });
            }
        });
        matchStatistics.home.trainer = $(matchData).find("tr.matchreport-trainer-name > td:nth-child(1) div.ol-user-name").text().trim();
 
        $(matchData).find("tr.ol-match-statistic-grade").children("td").eq(1).children("span.hidden-xs").each(function(i,el){
            const gradeMatch = $(el).html().match(/playerId:\s*(\d+).*>(.*)<\/span>\s*\((.*)\)/);
            if (gradeMatch){
                const playerId = parseInt(gradeMatch[1],10);
                const playerName = gradeMatch[2];
                const rating = parseFloat(gradeMatch[3]);
                const playerData = {"playerId": playerId, "playerName": playerName, "rating": rating, "goals" : 0, "assists" : 0};
                matchStatistics.away.lineup.push(playerData);
                matchStatistics.away.players[playerId] = playerData;
            }
        });
        for (const sub of $(matchData).find("tr.ol-match-statistic-substitutions > td:nth-child(2)").html().matchAll(/<span>(\d+)<span.*?playerId:\s*(\d+).*?>(.*?)<\/span>.*?\((.*?)\).*?playerId:\s*(\d+).*?>(.*?)<\/span>.*?\((.*?)\)/gs)){
            const min = parseInt(sub[1],10);
            const playerIdIn = parseInt(sub[2],10);
            const playerNameIn = sub[3];
            const playerRatingIn = parseFloat(sub[4]);
            const playerIdOut = parseInt(sub[5],10);
            const playerNameOut = sub[6];
            const playerRatingOut = parseFloat(sub[7]);
            matchStatistics.away.substitutions.push({
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            });
            matchStatistics.away.players[playerIdOut] = matchStatistics.away.players[playerIdOut] || {};
            matchStatistics.away.players[playerIdOut].out = min;
            matchStatistics.away.players[playerIdIn] = {in: min, rating: playerRatingIn, playerId: playerIdIn, playerName: playerNameIn, "goals" : 0, "assists" : 0};
        }
        $(matchData).find("tr.ol-match-statistic-squad > td:nth-child(2) > span").each(function(i,el){
            const m = $(el).html().match(/playerId:\s*(\d+).*>(.*)<\/span>/);
            if (m){
                matchStatistics.away.reserve.push({
                    "id": parseInt(m[1],10),
                    "name" : m[2]
                });
            }
        });
        matchStatistics.away.trainer = $(matchData).find("tr.matchreport-trainer-name > td:nth-child(2) div.ol-user-name").text().trim();
        /* Tore */
        //home
        for (const td of $(matchData).find('div.ol-match-report-headline-wrapper:contains("TORE")').next().find("tbody > tr > td:first-child")){
            if ($(td).children("span").length){
                const goalEntry = {};
                goalEntry.text = $(td).children("span").eq(0).text();
                const scoreArray = [...$(td).children("span").eq(1).html().matchAll(/\bplayerId\s*:\s*(\d+)/g)];
                goalEntry.scorer = scoreArray.length ? parseInt(scoreArray[0][1],10) : null;
                goalEntry.assist = scoreArray.length > 1 ? parseInt(scoreArray[1][1],10) : null;
                goalEntry.minute = parseInt($(td).children("span").eq(2).text(),10);
                matchStatistics.home.goals.push(goalEntry);
                if (matchStatistics.home.players[goalEntry.scorer]) {
                    matchStatistics.home.players[goalEntry.scorer].goals += 1;
                }
                if (goalEntry.assist > 0 && matchStatistics.home.players[goalEntry.assist]){
                    matchStatistics.home.players[goalEntry.assist].assists += 1;
                }
            }
        }
        //away
        for (const td of $(matchData).find('div.ol-match-report-headline-wrapper:contains("TORE")').next().find("tbody > tr > td:nth-child(2)")){
            if ($(td).children("span").length){
                const goalEntry = {};
                goalEntry.text = $(td).children("span").eq(0).text();
                const scoreArray = [...$(td).children("span").eq(1).html().matchAll(/\bplayerId\s*:\s*(\d+)/g)];
                goalEntry.scorer = scoreArray.length ? parseInt(scoreArray[0][1],10) : null;
                goalEntry.assist = scoreArray.length > 1 ? parseInt(scoreArray[1][1],10) : null;
                goalEntry.minute = parseInt($(td).children("span").eq(2).text(),10);
                matchStatistics.away.goals.push(goalEntry);
                if (matchStatistics.away.players[goalEntry.scorer]) {
                    matchStatistics.away.players[goalEntry.scorer].goals += 1;
                }
                if (goalEntry.assist > 0 && matchStatistics.away.players[goalEntry.assist]){
                    matchStatistics.away.players[goalEntry.assist].assists += 1;
                }
            }
        }
        /* Karten */
        //home
        for (const td of $(matchData).find('div.ol-match-report-headline-wrapper:contains("KARTEN")').next().find("tbody > tr > td:first-child")){
            if ($(td).children("span").length){
                const cardEntry = {};
                cardEntry.type = $(td).children("span").eq(0).children("div").eq(0).attr("class").replace("icon-icon_","").replace("card","");
                const cardArray = [...$(td).children("span").eq(1).html().matchAll(/\bplayerId\s*:\s*(\d+)/g)];
                cardEntry.playerId = cardArray.length ? parseInt(cardArray[0][1],10) : null;
                const nArray = [...$(td).children("span").eq(1).html().matchAll(/\b\(\s*(\d)\.\s*Gelbe Karte\s*\)/g)];
                cardEntry.nth = nArray.length ? parseInt(nArray[0][1],10) : null;
                cardEntry.minute = parseInt($(td).children("span").eq(2).text(),10);
                matchStatistics.home.cards.push(cardEntry);
                matchStatistics.home.players[cardEntry.playerId][cardEntry.type] = cardEntry.minute;
            }
        }
        //away
        for (const td of $(matchData).find('div.ol-match-report-headline-wrapper:contains("KARTEN")').next().find("tbody > tr > td:nth-child(2)")){
            if ($(td).children("span").length){
                const cardEntry = {};
                cardEntry.type = $(td).children("span").eq(0).children("div").eq(0).attr("class").replace("icon-icon_","").replace("card","");
                const cardArray = [...$(td).children("span").eq(1).html().matchAll(/\bplayerId\s*:\s*(\d+)/g)];
                cardEntry.playerId = cardArray.length ? parseInt(cardArray[0][1],10) : null;
                const nArray = [...$(td).children("span").eq(1).html().matchAll(/\b\(\s*(\d)\.\s*Gelbe Karte\s*\)/g)];
                cardEntry.nth = nArray.length ? parseInt(nArray[0][1],10) : null;
                cardEntry.minute = parseInt($(td).children("span").eq(2).text(),10);
                matchStatistics.away.cards.push(cardEntry);
                matchStatistics.away.players[cardEntry.playerId][cardEntry.type] = cardEntry.minute;
            }
        }
        /* Match-Statistiken */
        // home
        const possession = $(matchData).find('div.ol-match-report-headline-wrapper:contains("BALLBESITZ")').next().find("tbody > tr > td");
        const duels = $(matchData).find('div.ol-match-report-headline-wrapper:contains("ZWEIKÄMPFE")').next().find("tbody > tr > td");
        const chances = $(matchData).find('div.ol-match-report-headline-wrapper:contains("TORCHANCEN")').next().find("tbody > tr > td");
        const corners = $(matchData).find('div.ol-match-report-headline-wrapper:contains("ECKBÄLLE")').next().find("tbody > tr > td");
        const homestats = {
            possession: parseInt(possession.eq(0).text(),10),
            duels: parseInt(duels.eq(0).text(),10),
            chances: parseInt(chances.eq(0).text(),10),
            corners: parseInt(corners.eq(0).text(),10)
        };
        const awaystats = {
            possession: parseInt(possession.eq(1).text(),10),
            duels: parseInt(duels.eq(1).text(),10),
            chances: parseInt(chances.eq(1).text(),10),
            corners: parseInt(corners.eq(1).text(),10)
        };
        const final = $(matchData).find("a.timeline-result").has("div.icon-icon_finalwhistle").eq(0).attr("data-content");
        if (final){
            const lastMinute = OLCore.getNum($(final).children().eq(0).text());
            matchStatistics.final = lastMinute;
        }
        matchStatistics.home.stats = homestats;
        matchStatistics.away.stats = awaystats;
        matchStatistics.own = matchStatistics.home.userId === userId ? matchStatistics.home : matchStatistics.away;
        matchStatistics.opp = matchStatistics.home.userId === userId ? matchStatistics.away : matchStatistics.home;
        return matchStatistics;
    };
 
    /* Transfermarkt */
 
    OLCore.Api.getOffer = async function(offerId){
        const offerData = await OLCore.get(`/transferlist/getplayerview?offerId=${offerId}`);
        const clickData = $(offerData).find("span.player-steckbrief").attr("onclick");
        const playerId = clickData ? parseInt(clickData.match(/\bplayerId\s*:\s*(\d+)/)[1],10) : 0;
        const minFee = OLCore.getNum($(offerData).find("div.transfer-overview-player-price").eq(0).children("div").eq(4).text());
        return {
            "playerId": playerId,
            "minFee" : minFee
        };
    };
 
    /* NLZ */
 
    OLCore.Api.NLZ = {};
 
    OLCore.Api.NLZ.getScouting = async function(){
        const scoutData = await OLCore.get("/office/youthplayer/scouting");
        const progressData = [];
        $(scoutData).find("div#ol-youth-player-wizard-current-state div.ol-youth-player-wizard-sub-header.pull-left").each(function(i,el){
            const quota = parseInt(el.innerText,10);
            const valSpan = $(el.parentNode).find('span.ol-value-bar-layer-2')[0];
            const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
            progressData.push({"quota" : quota, "progress": progress});
        });
        const fixCosts = OLCore.getNum($(scoutData).find("div.ol-youth-player-overall-sum-annual").text());
        const prio = [];
 
        $(scoutData).find("div#ol-youth-player-wizard-scouting-details div.ol-dropdown-state-bg-progress").each(function(i,el){
            const progress = $(el).next().length && $(el).next().text().match(/px\)\s*\*\s*(\d+\.\d+)/) ? $(el).next().text().match(/px\)\s*\*\s*(\d+\.\d+)/)[1] : null;
            if (progress) {
                const pObj = {
                    "progress": parseFloat(progress),
                    "position": OLCore.Base.val2pos[parseInt($(el).attr("id").replace("ol-progress-",""),10)]
                };
                prio.push(pObj);
            }
        });
 
        return {
            "progress" : progressData,
            "fixCosts" : fixCosts,
            "prio" : prio
        };
    };
 
    OLCore.Api.NLZ.getStaff = async function(){
        const staffData = await OLCore.get("/office/youthplayer/staff");
        const progressData = [];
        $(staffData).find("div.ol-youth-player-wizard-sub-header.pull-left").each(function(i,el){
            const quota = parseInt(el.innerText,10);
            const valSpan = $(el.parentNode).find('span.ol-value-bar-layer-2')[0];
            const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
            progressData.push({"quota" : quota, "progress": progress});
        });
        const fixCosts = OLCore.getNum($(staffData).find("div.ol-youth-player-overall-sum-annual").text());
 
        return {
            "progress" : progressData,
            "fixCosts" : fixCosts
        };
    };
 
    OLCore.Api.NLZ.getAcademy = async function(){
        const acadamyData = await OLCore.get("/office/youthplayer/academy");
        const acadamy = {};
        let extension;
        $(acadamyData).find("div.ol-youth-player-wizard-sub-header.pull-left").each(function(i,el){
            const par = $(el.parentNode);
            if ($(el).text() === "Leistungszentrum"){
                const valSpan = par.find('span.ol-value-bar-layer-2')[0];
                const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
                acadamy.value = OLCore.getNum(par.children("span#currentConstructionValue").eq(0).attr("data-value"));
                acadamy.fixCosts = OLCore.getNum(par.children("div.ol-youth-player-annual-overall-cost").eq(0).text());
                acadamy.progress = progress;
                acadamy.state = par.children("div.ol-youth-player-wizard-sub-header.pull-right.ol-youth-player-academy-value-bar").eq(0).text();
                acadamy.overallValue = acadamy.value;
                acadamy.overallFixCosts = acadamy.fixCosts;
            } else if ($(el).text() === "Effizienz"){
                const valSpan = $(el).next().find('span.ol-value-bar-layer-2')[0];
                const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
                acadamy.effinciency = progress;
            } else if ($(el).text() === "Erweiterung"){
                const valSpan = par.find('span.ol-value-bar-layer-2')[0];
                const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
                extension = {
                    "value": OLCore.getNum(par.children().eq(4).text()),
                    "fixCosts": OLCore.getNum(par.children("div.ol-youth-player-annual-overall-cost").eq(0).text()),
                    "progress": progress,
                    "state": par.children("div.ol-youth-player-wizard-sub-header.pull-right.ol-youth-player-academy-value-bar").eq(0).text()
                };
                acadamy.overallValue += extension.value;
                acadamy.overallFixCosts += extension.fixCosts;
            }
        });
        return {
            "acadamy" : acadamy,
            "extension" : extension
        };
    };
 
    OLCore.Api.NLZ.getYouthPlayer = async function(youthPlayerId){
        const playerData = await OLCore.get(`/office/youthplayer/contract?youthPlayerId=${youthPlayerId}`);
        const name = $(playerData).find("span.ol-team-settings-line-up-playername").text();
        const feet = $(playerData).find("span.ol-team-settings-line-up-foot").text().replace(/^\s+|\s+$/g,'');
        const positions = $(playerData).find("span.lineUpPosition").text().replace(/\s+/g,'').split(",");
        const overall = parseInt($(playerData).find("span.player-overall-box.player-overall").text(),10);
        const country = $(playerData).find("div.player-nationality").children("span").eq(0).attr("title");
        const age = parseInt($(playerData).find("div.player-age").children("div").eq(0).text(),10);
        const height = parseFloat($(playerData).find("div.player-height").children("div").eq(0).text());
        const marketValue = OLCore.getNum($(playerData).find("div.player-goals").children("div").eq(0).text());
        const attributes = {};
        $(playerData).find("div.row > div.youth-player-attribute-container").each(function(i, el){
            const attributeName = $(el).children("div.row").children("div").eq(0).text().replace(/^\s+|\s+$/g,'');
            const attr_value_span = $(el).find("span.ol-value-bar-layer-2")[0];
            const attributeValue = OLCore.round(parseFloat(attr_value_span.style.left) + parseFloat(attr_value_span.style.width),4).toString().replace(".",",");
            attributes[attributeName] = attributeValue;
        });
        const salary = OLCore.getNum($(playerData).find("input#inputSalary").attr("value"));
        return {
            name: name,
            feet: feet,
            positions: positions,
            overall: overall,
            country: country,
            age: age,
            height: height,
            marketValue: marketValue,
            attributes: attributes,
            salary: salary
        };
    };
 
    /***
     * extended API (uses Api)
     ***/
 
    OLCore.XApi = {};
 
    OLCore.XApi.getL = async function(opt, userId){
        opt = opt || {};
        userId = userId || opt.userId || OLCore.Base.userId;
        const lastMatchSeason = OLCore.Base.season; //OLCore.Base.matchDay === 1 ? OLCore.Base.season - 1: OLCore.Base.season;
        let friendlyLineupValue = 0, actLeagueLineupValue = 0;
 
        const squadData = opt.squadData || await OLCore.Api.getSquad(userId);
        const friendlyPlayers = opt.friendlyPlayers ? opt.friendlyPlayers : squadData.friendlyLineup().map(f => f.id);
 
        friendlyLineupValue = opt.friendlyLineupValue || squadData.playerArr
            .filter(p => friendlyPlayers.includes(p.id))
            .map(a => a.value)
            .reduce((pv, cv) => pv + cv, 0);
        actLeagueLineupValue = opt.actLeagueLineupValue || squadData.leagueLineup()
            .map(a => a.value)
            .reduce((pv, cv) => pv + cv, 0);
        const actLeagueLineupCount = squadData.leagueLineup().length;
        const friendlyLineupCount = friendlyPlayers.length;
        const avgFriendlyLineupValue = friendlyLineupValue/friendlyLineupCount;
        const avgActLeagueLineupValue = actLeagueLineupValue/actLeagueLineupCount;
 
        let avgLineupHistoryValues = JSON.parse(OLCore.getMatchdayValueId("avgLineupHistoryValues", userId) || "null");
        let allAvgLineupValue = 0;
        let cnt = 0;
        let realLQ, nextLQ;
 
        if (avgLineupHistoryValues){
            allAvgLineupValue = avgLineupHistoryValues.allAvgLineupValue;
            cnt = avgLineupHistoryValues.cnt;
        } else {
            avgLineupHistoryValues = {};
            const teamHistory = await OLCore.Api.getTeamHistory(userId, lastMatchSeason);
            const weekLimit = opt.friendlyWeek || OLCore.Base.week;
            const leagueMatches = teamHistory.matches.filter(m => (m.type === "L" && m.week <= weekLimit));
            for (const match of leagueMatches){
                const matchLineup = await OLCore.Api.getMatchLineup(lastMatchSeason, match.matchId, userId);
                if (matchLineup){
                  const lineupPlayers = squadData.playerArr.filter(p => matchLineup.lineup.map(l => l.playerId).includes(p.id));
                  if (lineupPlayers.length){
                    const playersCount = lineupPlayers.length;
                    let lineupValue = lineupPlayers.map(a => a.value).reduce((pv, cv) => pv + cv, 0);
                    const avgLineupValue = lineupValue/playersCount;
                    allAvgLineupValue += avgLineupValue;
                    cnt++;
                  }
                }
            }
            avgLineupHistoryValues.allAvgLineupValue = allAvgLineupValue;
            avgLineupHistoryValues.cnt = cnt;
            OLCore.setMatchdayValueId("avgLineupHistoryValues", userId, JSON.stringify(avgLineupHistoryValues));
        }
        realLQ = cnt === 0 ? 100 : Math.round(allAvgLineupValue/cnt);
        nextLQ = Math.round((allAvgLineupValue+avgActLeagueLineupValue)/(cnt+1));
 
        return {realL: OLCore.roundL(avgFriendlyLineupValue*100/realLQ), nextL: OLCore.roundL(avgFriendlyLineupValue*100/nextLQ)};
    };
 
    OLCore.XApi.getRank = async function(season, leagueId, matchDay, userId){
        season = season || OLCore.Base.season;
        leagueId = leagueId || OLCore.Base.leagueId;
        matchDay = matchDay || OLCore.Base.matchDay;
        userId = userId || OLCore.Base.userId;
        const matchDayData = await OLCore.Api.getMatchDay(season, leagueId, matchDay);
        if (matchDayData && matchDayData.table){
            const teamData = matchDayData.table.find(m => m.teamId === userId);
            if (teamData){
                return teamData.rank;
            }
        }
        return undefined;
    };
 
    OLCore.XApi.getRanks = async function(season, leagueId, matchDay, userIds){
        const ranks = {};
        season = season || OLCore.Base.season;
        leagueId = leagueId || OLCore.Base.leagueId;
        matchDay = matchDay || OLCore.Base.matchDay;
        userIds = userIds || [];
        const matchDayData = await OLCore.Api.getMatchDay(season, leagueId, matchDay);
        for (const userId of userIds){
            if (matchDayData && matchDayData.table){
                const teamData = matchDayData.table.find(m => m.teamId === userId);
                if (teamData){
                    ranks[userId] = teamData.rank;
                } else {
                    ranks[userId] = undefined;
                }
            } else {
                ranks[userId] = undefined;
            }
        }
        return ranks;
    };
 
    OLCore.XApi.getLeagueSchedule = async function(userId){
        userId = userId || OLCore.Base.userId;
        let leagueId = OLCore.Base.leagueId;
        let leagueLevel = OLCore.Base.leagueLevel;
        if (userId !== OLCore.Base.userId){
            const teamInfo = OLCore.Api.getTeamInfo(userId);
            leagueId = teamInfo.leagueId;
            leagueLevel = teamInfo.leagueLevel;
        }
        let leagueSchedule = OLCore.getSeasonValueId("LeagueSchedule", userId);
        if (leagueSchedule){
            return JSON.parse(leagueSchedule);
        }
        const schedule = [];
        let matchDay = 1;
        const matchDayData = await OLCore.get(`/matchdaytable/leaguetable?season=${OLCore.Base.season}&matchday=${matchDay}&leagueLevel=${leagueLevel}&leagueId=${leagueId}&stateId=&leagueMatchday=0&type=1&nav=true&navId=matchdayTable`);
        const teamTableSpan = $(matchDayData).find(`div#leagueFound table.table span.ol-team-name[onclick*=' ${userId} ']`);
        let matchLink = teamTableSpan.parent().parent().children("td").eq(7).children("a").eq(0);
        if (!matchLink.length){
            return schedule;
        }
        let nextMatchId = OLCore.getNum(matchLink.attr("onclick"),1);
 
        while (matchDay < 35){
            const entry = {matchDay: matchDay, matchId: nextMatchId};
            let matchData = await OLCore.get(`/match?season=${OLCore.Base.season}&matchId=${nextMatchId}`);
            const userLink = $(matchData).find(`div#matchdayresult a[onclick*=' ${userId} ']`).eq(0);
            const userLinkIdx = userLink.parent().index();
            entry.location = userLinkIdx === 0 ? "H" : (userLinkIdx === 2 ? "A" : "X");
            const opponentLink = userLink.parent().parent().children("div").eq(userLinkIdx === 0 ? 2 : 0).children("a").last();
            entry.opponent = {
                id: OLCore.getNum(opponentLink.attr("onclick")),
                name: opponentLink.children("div").eq(1).text().trim()
            }
            let nextMatchLink = userLink.prev();
            nextMatchId = OLCore.getNum(nextMatchLink.attr("href"),1);
            schedule.push(entry);
            matchDay++;
        }
        /*
      for (let i = 1; i < 35; i++){
        const entry = {};
        entry.matchDay = i;
        const matchDayData = await OLCore.get(`/matchdaytable/leaguetable?season=${OLCore.Base.season}&matchday=${i}&leagueLevel=${leagueLevel}&leagueId=${leagueId}&stateId=&leagueMatchday=0&type=1&nav=true&navId=matchdayTable`);
        const teamTableSpan = $(matchDayData).find(`div#leagueFound table.table span.ol-team-name[onclick*=' ${userId} ']`);
        if (teamTableSpan){
          const tdIdx = teamTableSpan.parent().index();
          entry.location = tdIdx === 2 ? "H" : (tdIdx === 5 ? "A" : "X");
          const opponentSpan = teamTableSpan.parent().parent().children("td").eq(tdIdx === 2 ? 5 : 2).children("span").eq(0);
          entry.opponent = {
            id: OLCore.getNum(opponentSpan.attr("onclick")),
            name: opponentSpan.contents().eq(0).text().trim()
          }
        }
        schedule.push(entry);
      }
      */
        OLCore.setSeasonValueId("LeagueSchedule", userId, JSON.stringify(schedule));
        return schedule;      
    };
 
    OLCore.XApi.getFriendlySchedule = async function(){
        const schedule = [];
        const friendlyData = await OLCore.get("/friendlies/offers");
        $(friendlyData).find("div.friendly-matchresult-button-wrapper").each(function(i,el){
            const row = $(el).parent().parent();
            const matchStatus = $(el).find("span.text-matchresult").eq(0).text().trim();
            const matchId = OLCore.getNum(row.find("a.friendly-matchresult-button").attr("onclick"), 1);
            const week = OLCore.getNum(row.find("div.ol-friendly-offers-table-col-time").eq(0).children("span").children("span").eq(0).text());
            const entry = {
                week: week, 
                matchId: matchId,
                finished: matchStatus.toUpperCase() === "SPIELBERICHT"? 1 : 0
            };
            entry.location = row.children("div").eq(2).text().trim().substring(0,1);
            const opponentSpan = row.find("div.ol-friendly-direct-user-offer span.ol-team-name").eq(0);
            entry.opponent = {
                id : OLCore.getNum(opponentSpan.attr("onclick")),
                name: opponentSpan.contents().eq(0).text().trim()
            };
            schedule.push(entry);
        });
        return schedule; 
    }
 
    window.OLCore = OLCore;
    window.waitForKeyElements = OLCore.waitForKeyElements;
 
})();