/*jshint esversion: 10 */
/* globals olUid, OLi18n, GM_addStyle, unsafeWindow, GM_getValue, GM_setValue, GM_listValues, GM_deleteValue */

// ==UserScript==
// @name           OLCore
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.7.4
// @license        LGPLv3
// @description    Core functions for www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/424896/OLCore.user.js
// @updateURL https://update.greasyfork.org/scripts/424896/OLCore.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 08.04.2021 Release
 * 0.1.1 12.04.2021 + euroValue
 * 0.1.2 15.04.2021 + API
 * 0.1.3 19.04.2021 + API.getSquad .getTeamInfo .getMatchLineup
 * 0.1.4 29.04.2021 + convertNumber
 * 0.1.5 08.05.2021 + API.NLZ
 * 0.1.6 10.05.2021   Bugfix Matchday
 * 0.1.7 12.05.2021 + YouthPlayer
 * 0.1.8 23.05.2021 minor bugfixes
 * 0.2.0 03.06.2021 + matchReport
                    + playerOverview
 * 0.2.1 04.07.2021 + matchStatistics
                    + matchLineup
                    + i18n (Support for other countries)
 * 0.2.2 09.07.2021 Bugfix lineup parsing
 * 0.2.3 09.07.2021 fixed currency display
 * 0.2.4 10.07.2021 Bugfix lineup parsing
 * 0.2.5 13.07.2021 Bugfix calling URL with invalid params
 * 0.2.6 19.07.2021 minor bugfixes
 * 0.2.7 28.08.2021 + XApi (L-Value)
                    extend teamHistory
 * 0.2.8 07.09.2021 Bugfix L Value
 * 0.2.9 23.09.2021 Bugfix L Value
 * 0.2.10 25.09.2021 Bugfix L Value
 * 0.3.0 08.10.2021 + UI.popup
 * 0.3.1 25.10.2021 minor Bugfixes
 * 0.3.2 26.10.2021 make popup draggable
 * 0.3.3 03.11.2021 Bugfix L-Value (remove Quali-matches from calculation)
 * 0.3.4 10.11.2021 Bugfix friendlyPlayed
 * 0.3.5 14.11.2021 Bugfix salary on offer
 * 0.3.6 16.11.2021 extend playerOverview
 * 0.3.7 09.12.2021 + UI.button
 * 0.4.0 05.01.2022 + store seasonValues
                    extend teamInfo
                    + XApi.getRank(s)
                    + Api.getMatchDay
                    + XApi.getLeagueSchedule
                    + XApi.getFriendlySchedule
 * 0.4.1 13.01.2022 Bugfix OLCore.Api.getTeamInfo
 * 0.5.0 24.01.2022 i18n Support
                    + UI.dropDown
                    new L-Value (as of Season 18)
 * 0.5.1 10.06.2022 + UI.preventMiddleClick
 * 0.5.2 27.06.2022 Bugfixes Button and Popup
 * 0.5.3 02.07.2022 sysLang for dictionary
 * 0.5.4 13.07.2022 + JSON.tryParse
                    Bugfix Team Selector #matchResult
 * 0.5.5 01.08.2022 uk format for endDate in getOffer
 * 0.6.0 29.10.2022 + class OLDate
                    extend week2matchDay
                    Bugfix LeagueSchedule
 * 0.6.1 12.12.2022 Bugfix LeagueSchedule
 * 0.6.2 13.01.2023 OLCore.UI.saveBar
 * 0.6.3 20.02.2023 bugfix lineup stats 4321KO
 * 0.6.4 08.07.2023 bugfix enddate
 * 0.7.0 17.11.2024 OL 2.0
 * 0.7.1 26.11.2024 some Api Migration
 * 0.7.2 15.12.2024 Fix: getOffer
 * 0.7.3 19.12.2024 + OLcore.playerPositions2Array
 *                  + getPlayerQuickOverview
 * 0.7.4 30.10.2025 Fix: LeagueSchedule
 *********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;

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
    class OLDate extends Date{

        locale = 'de-DE';

        addDays(days) {
            var result = new OLDate(this.valueOf());
            result.setDate(result.getDate() + days);
            [result.season, result.week] = OLDate.dateToSeasonWeek(result);
            return result;
        }

        static gapDays(){
            const tld = location.host.split(".").splice(-1)[0];
            switch(tld){
                case 'de':
                    return 5;
                    break;
                case 'at':
                    return 3;
                    break;
                case 'ch':
                    return 3;
                    break;
                case 'uk':
                    return 3;
                    break;
            }
        }

        static zeroDate(){
            const tld = location.host.split(".").splice(-1)[0];
            switch(tld){
                case 'de':
                    return new OLDate('z','2020-01-15T12:00:00');
                    break;
                case 'at':
                    return new OLDate('z','2021-06-29T12:00:00');
                    break;
                case 'ch':
                    return new OLDate('z','2021-06-29T12:00:00');
                    break;
                case 'uk':
                    return new OLDate('z','2021-11-08T12:00:00');
                    break;
            }
        }

        static dateToSeasonWeek(dt){
            const zeroDate = OLDate.zeroDate();
            const diffTime = dt - zeroDate;
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            diffDays -= 3; //for all countries because of breaks
            if (location.host.split(".").splice(-1)[0] === 'de' && diffDays > 88){
                diffDays -= 2;
            }
            const season = 1 + Math.floor(diffDays/44);
            const week = 1 + diffDays % 44;
            return [season, week];
        }

        toSeasonWeek(){
            return OLDate.dateToSeasonWeek(this);
        }

        tld2Locale(tld){
            switch(tld){
                case 'de':
                    this.locale = 'de-DE';
                    break;
                case 'at':
                    this.locale = 'de-AT';
                    break;
                case 'ch':
                    this.locale = 'de-CH';
                    break;
                case 'uk':
                    this.locale = 'en-GB';
                    break;
                case 'us':
                    this.locale = 'en-US';
                    break;
            }
        }

        constructor(){
            const aLen = arguments.length;
            const tld = location.host.split(".").splice(-1)[0];
            let zeroDate;
            if (aLen === 0){
                super();
                this.season = OLCore.Base.season;
                this.week = OLCore.Base.week;
            }
            if (aLen === 2 && arguments[0] === 'z'){
                super(arguments[1]);
                this.season = 1;
                this.week = 1;
                this.tld2Locale(tld);
                return;
            } else {
                zeroDate = OLDate.zeroDate();
            }
            if (aLen === 1 && typeof arguments[0] === 'string'){
                const val = arguments[0];
                if (/^\d{3,}$/.test(val)){
                    const season = Math.floor(Number(val)/100);
                    const week = Number(val)%100;
                    super(zeroDate.addDays((44*(season-1))+(week-1)+OLDate.gapDays()));
                    this.season = season;
                    this.week = week;
                } else {
                    super(...arguments);
                    [this.season, this.week] = OLDate.dateToSeasonWeek(this);
                }
            } else if (aLen === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
                const season = arguments[0];
                const week = arguments[1];
                super(zeroDate.addDays((44*(season-1))+(week-1)+OLDate.gapDays()));
                this.season = season;
                this.week = week;
            } else if (aLen && arguments[0] !== 'z') {
                super(...arguments);
                [this.season, this.week] = OLDate.dateToSeasonWeek(this);
            }
            this.tld2Locale(tld);
            this.setHours(12);
            this.setMinutes(0);
            this.setSeconds(0);
            this.setMilliseconds(0);
        }

        toMdWString(){
            let mdShort = 'ST';
            if (this.locale.substr(0,2) === 'en'){
                mdShort = 'MD';
            }
            const w2m = OLCore.week2matchDay(this.week, {'noMatchDay':'pauseShort'});
            const md = isNaN(w2m) ? w2m : `${mdShort}${w2m}`;
            return `${md} / W${this.week}`;
        }

        toWdString(locale){
            locale = locale || this.locale;
            return this.toLocaleDateString(locale, {year: "numeric", month: "2-digit", day: "2-digit", weekday: "short"});
        }

        toWdShortString(locale){
            locale = locale || this.locale;
            return this.toLocaleDateString(locale, {month: "2-digit", day: "2-digit", weekday: "short"}).replace(/[.,]+ /," ");
        }

        toString(locale){
            locale = locale || this.locale;
            return this.toLocaleDateString(locale, {year: "numeric", month: "2-digit", day: "2-digit"});
        }

        toShortString(locale){
            locale = locale || this.locale;
            return this.toLocaleDateString(locale, {month: "2-digit", day: "2-digit"});
        }
    }

    /***
     * Helper Functions
     ***/

    OLCore.getNum = function(value,idx){
        if (!value && value !== 0){
            return NaN;
        }
        let rx = new RegExp(escapeRegExp(OLi18n.groupSeparator), "g");
        value = value.replace(rx,"");
        rx = new RegExp(escapeRegExp(OLi18n.decimalSeparator), "g");
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

    OLCore.JSON = {};
    OLCore.JSON.tryParse = function(str){
        try {
            return JSON.parse(str);
        } catch {
            return null;
        }
    };

    /***
     * Conversions
     ***/

    OLCore.week2matchDay = function(week, opt){
        //legacy
        if (opt && (typeof opt !== 'object')){
            opt = {noMatchDay: 'last'}
        }
        opt = opt || {};
        opt.noMatchDay = opt.noMatchDay || 'none';
        week = parseInt(week,10);
        if (week < 18) {
            return week;
        }
        if (week < 21) {
            switch(opt.noMatchDay){
                case 'last':
                    return 18;
                    break;
                case 'pause':
                    return t("Winterpause");
                    break;
                case 'pauseShort':
                    return t("WP");
                    break;
                default:
                    return undefined;
                    break;
            }
        }
        if (week < 38) {
            return week-3;
        }
        switch(opt.noMatchDay){
            case 'last':
                return 35;
                break;
            case 'pause':
                return t("Sommerpause");
                break;
            case 'pauseShort':
                return t("SP");
                break;
            default:
                return undefined;
                break;
        }
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
            return OLi18n.tbNum(val);
        }
        return val;
    };

    OLCore.num2Cur = function(val){
        const parts = OLi18n.currencyFormat.formatToParts(val);
        const out = [];
        let cur = "", lit = " ", dec = "", frac = "";
        for (const p of parts){
            switch(p.type){
                case "group":
                    out.push(OLi18n.groupSeparator);
                    break;
                case "currency":
                    cur = p.value;
                    break;
                case "literal":
                    lit = p.value;
                    break;
                case "decimal":
                    dec = OLi18n.decimalSeparator;
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
        if (OLi18n.currencySymbolAfter){
            out.push(lit + cur);
        } else {
            out.unshift(cur + lit);
        }
        return out.join('');
    };

    OLCore.playerPositions2Array = function(pos){        
        const out = [];
        if (!pos){
            return out;
        }
        const posNumArray = Object.keys(OLCore.Base.val2pos).sort((a,b) => b-a);
        for (const k of posNumArray){
            if ((pos & Number(k)) > 0){
                out.push(OLCore.Base.val2pos[k]);
            }
        }
        return out;
    };

    OLCore.playerPositions2String = function(pos){        
        return OLCore.playerPositions2Array(pos)?.join(", ") || [];
    };

    /***
     * OL Base Data
     ***/

    OLCore.Base = {};

    const swNums = OLCore.getNum($('span.ol-navigation-season-display-font').eq(0).text(),-1);
    OLCore.Base.seasonWeek = `S${swNums[0]}W${swNums[1]}`; //$('span.ol-navigation-season-display-font')[0].innerText.replace('SAISON ','S').replace(' - WOCHE ', 'W');
    OLCore.Base.season = swNums[0];
    OLCore.Base.week = swNums[1];
    const leagueTextDiv = $("div#navLeagueText");
    const leagueText = $("div#navLeagueText").text().trim();
    if (leagueText !== "") {
        OLCore.Base.league = leagueText;
    OLCore.Base.leagueLevel = OLCore.getNum(OLCore.Base.league);
    OLCore.Base.leagueId = OLCore.getNum($("div#navLeagueText").children().eq(0).attr("onclick"),2);
    }
    OLCore.Base.rawSeasonWeek = (OLCore.Base.season * 100) + OLCore.Base.week;
    OLCore.Base.matchDay = OLCore.week2matchDay(OLCore.Base.week, true);
    OLCore.Base.rawMatchDay = (OLCore.Base.season * 100) + OLCore.Base.matchDay;
    OLCore.Base.userId = olUid;
    OLCore.Base.userName = $("div#subnav_settings").find("input[name='username']").attr("value");
    OLCore.Base.teamName = $("div.ol-mobile-nav-team-name").text() ? $("div.ol-mobile-nav-team-name").text().replace(/^\s+/,'').replace(/\s+$/,'') : undefined;
    OLCore.Base.teamColorNumber = $("div.matchday-date-flip").attr("class") ? $("div.matchday-date-flip").attr("class").match(/color-(\d+)/)[1] : 1;
    OLCore.Base.teamColor = $("div.matchday-date-flip").css("border-color");
    OLCore.Base.pos2val = {"TW": 256, "AV": 128, "IV": 64, "DM": 32, "OM": 16, "ST": 8};
    OLCore.Base.val2pos = {256: "TW", 128: "AV", 64: "IV", 32: "DM", 16: "OM", 8: "ST"};
    OLCore.Base.Formations = {}
    OLCore.Base.sysLang = 'de';

    OLCore.Base.propId = {
        total: 0,
        reflexes: 1,
        penaltyArea: 2,
        oneOnOne: 3,
        buildUp: 4,
        kicking: 5,
        sweeper: 6,
        speed: 7,
        athleticism: 8,
        endurance: 9,
        header: 14,
        duel: 15,
        technique: 16,
        leftFoot: 17,
        rightFoot: 18,
        shootingPower: 19,
        shooting: 20,
        tactics: 21,
        age: 24,
        nation: 25,
        talent: 26,
        height: 27,
        fitness: 28,
        weight: 35,
        birthday: 37,
        marketValue: 38,
        talent: 39
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
        if (!olUid) return;
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = value;
        GM_setValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
    };

    OLCore.setMatchdayValueId = function(short, id, value){
        if (!olUid) return;
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = matchdayData[today][short] || {};
        matchdayData[today][short][id] = value;
        GM_setValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
    };

    OLCore.getMatchdayValue = function(short){
        if (!olUid) return;
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        GM_setValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
        return matchdayData[today][short];
    };

    OLCore.getMatchdayValueId = function(short, id){
        if (!olUid) return;
        const today = OLCore.Base.rawSeasonWeek.toString();
        const matchdayData = JSON.parse(GM_getValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(matchdayData)){
            if (parseInt(k) < OLCore.Base.rawSeasonWeek){
                delete matchdayData[k];
            }
        }
        matchdayData[today] = matchdayData[today] || {};
        matchdayData[today][short] = matchdayData[today][short] || {};
        GM_setValue(`MatchdayData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(matchdayData));
        return matchdayData[today][short][id];
    };


    OLCore.setSeasonValue = function(short, value){
        if (!olUid) return;
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = value;
        GM_setValue(`seasonData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
    };

    OLCore.setSeasonValueId = function(short, id, value, season){
        if (!olUid) return;
        season = season || OLCore.Base.season;
        const thisSeason = season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = seasonData[thisSeason][short] || {};
        seasonData[thisSeason][short][id] = value;
        GM_setValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
    };

    OLCore.getSeasonValue = function(short){
        if (!olUid) return;
        const thisSeason = OLCore.Base.season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        GM_setValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
        return seasonData[thisSeason][short];
    };

    OLCore.getSeasonValueId = function(short, id, season){
        if (!olUid) return;
        season = season || OLCore.Base.season;
        const thisSeason = season.toString();
        const seasonData = JSON.parse(GM_getValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`) || "{}");
        for (const k of Object.keys(seasonData)){
            if (parseInt(k) < OLCore.Base.season){
                delete seasonData[k];
            }
        }
        seasonData[thisSeason] = seasonData[thisSeason] || {};
        seasonData[thisSeason][short] = seasonData[thisSeason][short] || {};
        GM_setValue(`SeasonData|${OLi18n.topLevelDomain}|${olUid}`, JSON.stringify(seasonData));
        return seasonData[thisSeason][short][id];
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

    GM_addStyle(`
      div.Toolbox_dropdown_wrapper_normal {
        display: inline-block; position:relative; height: 35px;
      }
      div.Toolbox_dropdown_wrapper_normal::before{
        content:'';display: inline-block;width: 35px;height: 35px;position: absolute;background-color: black;border-radius: 2px;top: -0px;right: -4px;border-top-right-radius: 5px;border-bottom-right-radius: 5px;pointer-events: none;
      }
      div.Toolbox_dropdown_wrapper_normal::after {
        content:'';display: inline-block;border-top: 8px dashed;border-top: 8px solid;border-right: 8px solid transparent;border-left: 8px solid transparent;position: absolute;color: white;right: 6px;top: 14px;pointer-events: none;
      }
      div.Toolbox_dropdown_wrapper_small {
        display: inline-block; position:relative; height: 25px;
      }
      div.Toolbox_dropdown_wrapper_small::before{
        content:'';display: inline-block;width: 25px;height: 25px;position: absolute;background-color: black;border-radius: 2px;top: -0px;right: -4px;border-top-right-radius: 5px;border-bottom-right-radius: 5px;pointer-events: none;
      }
      div.Toolbox_dropdown_wrapper_small::after {
        content:'';display: inline-block;border-top: 8px dashed;border-top: 5px solid;border-right: 5px solid transparent;border-left: 5px solid transparent;position: absolute;color: white;right: 4px;top: 10px;pointer-events: none;
      }
      div.Toolbox_dropdown_wrapper_normal > select{
        -moz-appearance: none;-webkit-appearance: none;appearance: none;border: 1px solid #000;border-radius: 4px;padding-left: 5px;padding-right:35px;width: inherit;height: 100%;color: #000;
      }
      div.Toolbox_dropdown_wrapper_small > select{
        -moz-appearance: none;-webkit-appearance: none;appearance: none;border: 1px solid #000;border-radius: 4px;padding-left: 5px;padding-right:25px;width: inherit;height: 100%;color: #000;
      }
      button.TB_Button {
         display: flex;
         justify-content: center;
         align-items: center;
      }
    `);

    OLCore.UI.dropDown = function(opt){
        opt = opt || {};
        opt.options = opt.options || [];
        opt.style = opt.style || "normal";
        const options = opt.options.map(o => `<option value="${o.value}"${opt.defaultValue===o.value?' selected="selected"':''}>${o.text}</option>`);
        const dropDown = `<div class="Toolbox_dropdown_wrapper_${opt.style}" id="liveticker_select-wrapper" style="width: ${opt.width || 'auto'};">
          <select>${options.join("")}</select>
        </div>`;
        if (opt.out === "text"){
            return dropDown;
        }
        return $(dropDown);
    };

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
        return $(`<button class="ol-button ol-button-${opt.buttonClass} TB_Button${opt.class? ' '+opt.class: ''}"${opt.style?' style="' + opt.style + '"':''}${opt.id?' id="' + opt.id + '"':''} title="${opt.title || opt.text}">${opt.html || opt.text}</button>`);
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
       div.olcore_ui_toggle_cont_right {width:100%}
       div.olcore_ui_toggle_left { height: 30px;}
       div.olcore_ui_toggle_right { height: 30px; width:100%}
       label.olcore_ui_toggle_label_left {margin-left: 50px; margin-top: 5px;}
       label.olcore_ui_toggle_label_right {margin-top: 5px; margin-right: 50px;}
       i.olcore_ui_toggle_i_left {display: inline-block; right: 0}
       i.olcore_ui_toggle_i_right {display: inline-block; right:40px;}
       body.ol-sm label.olcore_ui_toggle_label,body.ol-xs label.olcore_ui_toggle_label {margin-left: 5px; margin-top: 5px;}
       span.olcore_ui_toggle_span {white-space:nowrap;}
       div.olcore_ui_toggle_checkbox.ol-checkbox.slider {max-width:none;}
    `);

    OLCore.UI.toggle = function(opt){
        opt = opt || {};
        opt.data = opt.data || {};
        opt.callback = opt.callback || {};
        opt.ctrl = opt.ctrl || "left";
        const inputData = " " +Object.keys(opt.data).map(k => `data-${k}="${opt.data[k]}"`).join(' ');
        const ret = $(`<div class="olcore_ui_toggle_cont_${opt.ctrl}">
               <div id="buttonToggle-${opt.id}" class="olcore_ui_toggle_${opt.ctrl} olcore_ui_toggle_checkbox ol-checkbox slider">
                 <label title="${opt.descr}" for="toggle-${opt.id}" class="olcore_ui_toggle_label_${opt.ctrl}">
                   <input id="toggle-${opt.id}" class="OLToggleSwitch"${inputData} data-value="1" type="checkbox" value="${opt.initValue === true ? 2 : 1}" name="optradio" onchange="$(\'#toggle-${opt.id}-1, #toggle-${opt.id}-2\').toggle(); $(this).val(($(this).val() % 2) + 1);" ${opt.initValue?'checked=""':''} />
                   <i class="olcore_ui_toggle_i_${opt.ctrl} ol-state-primary-color-${OLCore.Base.teamColorNumber}" />
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
        ret.TB_getValue = function(){
            return ret.find(`#toggle-${opt.id}`).val() === "2";
        }
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
      background-color: rgba(0,0,0,0.5);
    }

    .OLCorePopupContent{
      border-radius: 0 0 6px 6px;
      max-height: 80vh;
      /*overflow:auto;
      scrollbar-width: thin;*/
    }

    .OLCorePopupContent_scroll{
      border-radius: 0 0 6px 6px;
      max-height: 80vh;
      overflow:auto;
      scrollbar-width: thin;
    }

    .OLCorePopupPop {
      position: relative;
      /*margin: auto; //knallt im IE, anscheinend nicht nötig*/
      cursor: default;
      max-width: calc(100% - 60px);
      /*max-height: calc(100% - 120px);*/
      overflow: auto;
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
      box-shadow: 0 10px 6px -6px #999999;
      box-sizing: border-box;
    }

       /* Hide scrollbar for Chrome, Safari and Opera */
     .OLCorePopupPop::-webkit-scrollbar {
         display: none;
     }

    .OLCorePopupPop_center, .OLCorePopupPop_absolute {
      position: absolute;
      top: 50%;
      left: 50%;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .OLCorePopupPop_fixed {
      position: fixed;
      top: 300px;
      left: 50%;
      -ms-transform: translate(-50%, 0%);
      -webkit-transform: translate(-50%, 0%);
      -moz-transform: translate(-50%, 0%);
      transform: translate(-50%, 0%);
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
      /*s-display: flex;*/
      /*display: flex;*/
      /*justify-content: space-between;*/
      /*align-items: center;*/
      font-weight: normal;
      z-index: 1; /*sonst liegt title nicht über body und mouseover bei virtuellen geht nicht*/
      box-sizing: border-box;
    }
    `);

    OLCore.UI.popup = function(content, opt){
        opt = opt || {};
        opt.css = opt.css || {};
        opt.on = opt.on || {};

        for (const no of Object.keys(opt.on)){
            if (!Array.isArray(opt.on[no])){
                const tmp = opt.on[no];
                opt.on[no] = [tmp];
            }
        }

        for (const o of Object.keys(opt.on)){
            if (!Array.isArray(opt.on[o])){
                opt.on[o] = [opt.on[o]];
            }
        }

        const title = opt.title || '&nbsp;';
        const width = opt.width || 'auto';
        const zIndex = opt.zIndex || opt.css["z-index"] || '99999';
        let align = opt.align || 'center';
        if (align !== 'right' && align !== 'fixed' && align !== 'left'){
            align = 'center';
        }
        let pop = $(`<div class="OLCorePopupPop_${align} OLCorePopupPop"${opt.id?' id="' + opt.id + '"':''}/>`);
        const popTitle = $(`<div class="OLCorePopupTitle">${title}</div>`);
        const popClose = $(`<span style="position:absolute; right:10px; padding-top:3px;cursor:pointer;" class="fa fa-close" />`);
        const popCont = $(`<div class="OLCorePopupContent${opt.scroll?'_scroll':''}" style="width:${width}"></div>`);

        if (typeof content === 'string'){
            popCont.html(content);
        } else if (typeof content === 'object' && content.length){
            popCont.append(content);
        }

        function closePopup(){
            pop.remove();
            if (opt.on.close){
                for(const f of opt.on.close){
                    if (typeof f === 'function'){
                        f();
                    }
                }
            }
        }

        popClose.click(closePopup);

        if (!opt.autoclose && opt.autoclose !== 0){
            popClose.appendTo(popTitle);
        } else {
            if (typeof opt.autoclose !== "number"){
                opt.autoclose = 1000;
            }
            opt.on.open = opt.on.open || [];
            opt.on.open.push(function(){
                window.setTimeout(closePopup, opt.autoclose);
            });
        }
        if (!opt.noTitle){
            popTitle.appendTo(pop);
        }
        popCont.appendTo(pop);
        pop.appendTo("body");

        pop.css("z-index",zIndex);

        for (const k of Object.keys(opt.css)){
            pop.css(k, opt.css[k]);
        }

        const popup = pop[0];
        const offset = { x: 0, y: 0 };

        function popupMove(e){
            var top = Math.max(e.clientY - offset.y,0);
            var left = Math.max(e.clientX - offset.x,0);
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

        if (opt.on.open){
            for(const f of opt.on.open){
                if (typeof f === 'function'){
                    f();
                }
            }
        }

        return {
            close: function(){
                if (opt.on.close){
                    for(const f of opt.on.close){
                        if (typeof f === 'function'){
                            f();
                        }
                    }
                }
                pop.remove();
            },
            on: function(what, f){opt.on[what] = opt.on[what] || []; opt.on[what].push(f);}
        };
    };

    OLCore.UI.progressIndicator = function(target, opt){
        opt = opt || {};

        const $target = $(target || "body");
        const ends = [];

        if ($target.length === 0){
            const pi = $('<div class="Toolbox_ProgressIndicator" />').appendTo("body");
            ends.push(function(){pi.remove()});
        } if (opt.overlay) {
            $target.each(function(i, tgt){

                const piCont = $('<div style="position:absolute;background-color:rgba(0, 0, 0, 0)" />').appendTo("body");

                piCont.css("left", $(tgt).offset().left);
                piCont.css("top", $(tgt).offset().top);
                piCont.css("width", $(tgt).width());
                piCont.css("height", $(tgt).height());

                $('<div class="Toolbox_ProgressIndicator" style="position:relative;" />').appendTo(piCont);

                ends.push(function(){piCont.remove()});
            });
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
                    'backgroundImage':`url(${OLi18n.loaderImage})`,
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
        //const pi = $(`<img src="${OLi18n.loaderImage}" style="position:fixed;z-index:999999; left: 50%; top: 50%;" />`).appendTo(target);;
        function end(){
            for (const e of ends){
                e();
            }
        }
        return {
            end: end
        };
    };

    GM_addStyle(`
    .savebar_cont {font-family: Roboto,sans-serif;}
    .tb_flex_wrap {display:flex;justify-content:left;align-items:center;flex-wrap:wrap}
    .tb_main_border {border: 3px solid #000; border-radius: 4px;}
    .savebar_cont button.ol-button { width:31px; height:31px; margin-left: 2px; }
    .savebar_cont select { -moz-appearance: none; -webkit-appearance: none; appearance: none; border: 1px solid #000; border-radius: 4px; padding-left: 5px; margin-top:2px; height: 31px; color: #000;font-family: Roboto,sans-serif; font-size:13pt}
    .tb_select-wrapper {display: inline-block; position:relative; margin-right:2px; height: 35px;}
    .tb_select-wrapper::before {content:''; display: inline-block; width: 31px; height: 31px; position: absolute; background-color: black; border-radius: 2px; top: 2px; right: -2px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; pointer-events: none;}
    .tb_select-wrapper::after {content:''; display: inline-block; border-top: 8px dashed; border-top: 8px solid; border-right: 8px solid transparent; border-left: 8px solid transparent; position: absolute; color: white; left: 328px; top: 14px; pointer-events: none;}
    .tb_ol-button > span {color:#FFF;display:flex;justify-content:center;align-items:center;}
    `);

    OLCore.UI.saveBar = function(opt){
        opt = opt || {};
        opt.on = opt.on || {};
        opt.width = Number(opt.width) || 350;
        opt.fetchData = typeof opt.fetchData === 'function' ? opt.fetchData : function(){console.warn("No fetch function defined")};

        const t = OLi18n.text;
        const tt = OLi18n.tbtext;

        const mainDiv = $(`<div id="${opt.id}_cont" class="tb_flex_wrap tb_main_border savebar_cont" />`);
        if (opt.title){
            $(`<span>${opt.title}</span>`).appendTo(mainDiv);
        }
        const selectBox = $(`<select id="${opt.id}_select"/>`).appendTo($(`<div style="width:${opt.width}px" class="tb_select-wrapper"></div>`).appendTo(mainDiv));
        selectBox.css("width",`${opt.width+3}px`);
        const loadBtn = $(`<button id="${opt.id}_btn_load" title="${tt("Auswahl neu laden")}" class="ol-button ol-button-rectangle tb_ol-button"><span class="fa fa-refresh" /></button>`).appendTo(mainDiv);
        const saveBtn = $(`<button id="${opt.id}_btn_load" title="${tt("Einstellungen speichern")}" class="ol-button ol-button-rectangle tb_ol-button"><span class="fa fa-floppy-o" /></button>`).appendTo(mainDiv);
        const delBtn = $(`<button id="${opt.id}_btn_load" title="${tt("Aktuellen Eintrag löschen")}" class="ol-button ol-button-rectangle tb_ol-button" style="background:red"><span class="fa fa-trash-o" /></button>`).appendTo(mainDiv);
        const delAllBtn = $(`<button id="${opt.id}_btn_load" title="${tt("Alle gespeicherten Einstellungen löschen")}" class="ol-button ol-button-rectangle tb_ol-button" style="background:darkred"><span class="fa fa-trash" /></button>`).appendTo(mainDiv);

        const savedValues = GM_listValues().filter(v => !!GM_getValue(v)).filter(v => v.startsWith(`saveBar_${opt.id}|${OLi18n.tld}|`));
        selectBox
            .append($("<option />")
                    .attr("value", "")
                    .text(` -- ${tt("Auswahl")} -- `));
        for (const val of savedValues){
            const selValue = val.split("|").pop();
            selectBox
                .append($("<option />")
                        .attr("value", val)
                        .text(selValue));
        }
        selectBox.change(function(evt){
            const selectedValue = $(evt.target).val();
            if (!selectedValue){
                return;
            }
            const storedValue = GM_getValue(selectedValue);
            opt.on.change(storedValue);
        });

        function evt_clickSave(){

            const actEntry = selectBox.val() !== '' ? selectBox.children('option:selected').eq(0).text() : '';
            const newEntry = prompt(tt("Speichern unter"), actEntry);
            if (newEntry){

                if (typeof opt.on.beforeSave === 'function'){
                    opt.on.beforeSave();
                }
                const valueData = opt.fetchData();
                const valueString = typeof valueData === 'string' ? valueData : JSON.stringify(valueData);

                const entryVal = `saveBar_${opt.id}|${OLi18n.tld}|${newEntry.replace("|","_")}`;

                const matchingOption = selectBox.children('option').filter(function () {
                    let oldVal = this.value;
                    const newVal = entryVal;
                    return oldVal.toLowerCase() === newVal.toLowerCase();
                } );

                if (matchingOption.length){
                    let matchingValue = matchingOption.attr("value");
                    GM_setValue(matchingValue, valueString);
                    selectBox.children("option[value='" + matchingValue + "']").eq(0).text(newEntry);
                } else {
                    GM_setValue(entryVal, valueString);
                    selectBox
                        .append($("<option />")
                                .attr("value", entryVal)
                                .text(newEntry));
                }
                selectBox.val(entryVal);
                if (typeof opt.on.save === 'function'){
                    opt.on.save();
                }
            } else if (newEntry === ''){
                alert(tt("Name darf nicht leer sein"));
            }
        }

        function evt_clickDel(){
            if (confirm(tt("Eintrag löschen?"))){
                if (typeof opt.on.beforeDelete === 'function'){
                    opt.on.beforeDelete();
                }
                const selectedValue = selectBox.val();
                selectBox.children("option[value='" + selectedValue + "']").remove();
                GM_deleteValue(selectedValue);
                selectBox.val('');
                selectBox.trigger('change');
                if (typeof opt.on.delete === 'function'){
                    opt.on.delAll();
                }
            }
        }

        function evt_clickDelAll(){
            if (confirm(tt("Alle gespeicherten Einstellungen löschen?")) && confirm(tt("Wirklich ALLE ALLE gespeicherten Einstellungen löschen?"))){
                for (const v of GM_listValues().filter(l => l.startsWith('saveBar_${opt.id}|'))){
                    if (v.startsWith(`saveBar_${opt.id}|${OLi18n.tld}|`)){
                        selectBox.children("option[value='" + v + "']").remove();
                        GM_deleteValue(v);
                    }
                }
                selectBox.val('');
                selectBox.trigger('change');
                if (typeof opt.on.deleteAll === 'function'){
                    opt.on.delAll();
                }
            }
        }

        saveBtn.click(evt_clickSave);
        delBtn.click(evt_clickDel);
        delAllBtn.click(evt_clickDelAll);

        return mainDiv;
    }

    GM_addStyle(".ui-dialog { z-index: 1000 !important ;}");
    GM_addStyle(".olcore_info_popup {width:auto; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");

    OLCore.info = function(string){
        OLCore.UI.popup(`<div style="display:flex;justify-content:center;text-align:center;align-items:center;width:auto; padding:20px; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px;:">${string}</div>`,{
            autoclose: true,
            noTitle: true,
            align: "fixed",
            css: {"background-color": "transparent", "box-shadow":"none"}
        });
        /*
        $(`<div id="olcore_info_popup" class="olcore_info_popup">${string}</div>`).dialog({
            classes: {},
            hide: { effect: "fade" },
            show: { effect: "fade" },
            open: function(event, ui) {
                setTimeout(function(){
                   // $('#olcore_info_popup').dialog('close');
                    //$('#olcore_info_popup').remove();
                }, 1000);
            }
        });
        */

    };

    OLCore.UI.preventMiddleClick = function(el){
        $(el).on('mousedown', function(e){
            if (e.button === 1) {
                e.preventDefault();
                return false;
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
        const isPlayed = $(fData).find("div.ol-friendly-offers-table-row:first-child .text-matchresult").text().toUpperCase() === t("SPIELBERICHT");
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

        $(teamData).find("div.row.league-match-overview-wrapper").each(function(i,el){
            const type = $(el).children("div").eq(0).text().trim();
            const link = $(el).find("div.team-overview-matches > div:nth-child(2)").attr("onclick");
            if (link){
                const match = OLCore.getNum(link,-1);
                const teamSpans = $(el).find("div.team-overview-matches span.ol-team-name");
                const teamIds = [OLCore.getNum($(teamSpans[0]).attr("onclick")), OLCore.getNum($(teamSpans[1]).attr("onclick"))];
                const opponentId = teamIds[0] === userId ? teamIds[1] : teamIds[0];
                const location = teamIds[0] === userId ? 'H' : 'A';
                if (type === t("LIGA AKTUELL")){
                    teamInfo.lastMatch = {id: match[1], season: match[0], location: location, opponent: opponentId};
                }
                if (type === t("NÄCHSTES LIGASPIEL")){
                    teamInfo.nextMatch = {id: match[1], season: match[0], location: location, opponent: opponentId};
                }
                if (type === t("FRIENDLY AKTUELL")){
                    teamInfo.lastFriendly = {id: match[1], season: match[0], location: location, opponent: opponentId};
                }
                if (type === t("NÄCHSTES FRIENDLY")){
                    teamInfo.lastFriendly = {id: match[1], season: match[0], location: location, opponent: opponentId};
                }
            }
        });
        const last10MatchesMatch = $(teamData).find("#olTeamOverviewContent > script").text().match(/'(\[[^\]]*\])'/);
        if (last10MatchesMatch){
            teamInfo.last10 = JSON.parse(last10MatchesMatch[1]);
        }
        const pop = parseFloat($(teamData).find("span.ol-popularity-widget-value").eq(0).text());
        teamInfo.popularity = pop;
        const leagueDiv = $(teamData).find("div.ol-tf-league");
        teamInfo.leagueName = leagueDiv.children("span").eq(0).text().trim();
        teamInfo.leagueLevel = OLCore.getNum(teamInfo.leagueName);
        teamInfo.leagueId = OLCore.getNum(leagueDiv.attr("onclick"),2);
        const leagueRow = $(teamData).find(`td > span.ol-team-name.ol-bold[onclick*=' ${userId} ']`).parent().parent();
        const rank = OLCore.Base.week === 1 ? 1 : OLCore.getNum(leagueRow.children().eq(1).text());
        const points = OLCore.Base.week === 1 ? 0 : OLCore.getNum(leagueRow.children().last().text());
        const goals = OLCore.Base.week === 1 ? "0 : 0" : leagueRow.children().eq(8).text();
        const guv = OLCore.Base.week === 1 ? [0,0,0] : [OLCore.getNum(leagueRow.children().eq(5).text()),OLCore.getNum(leagueRow.children().eq(6).text()), OLCore.getNum(leagueRow.children().eq(7).text())];
        teamInfo.rank = rank;
        teamInfo.points = points;
        teamInfo.goals = goals;
        teamInfo.guv = guv;

        if (userId === OLCore.Base.userId && !OLCore.Base.league) {
            OLCore.Base.league = teamInfo.leagueName;
            OLCore.Base.leagueLevel = teamInfo.leagueLevel;
            OLCore.Base.leagueId = teamInfo.leagueId;
        }

        return teamInfo;
    };

    OLCore.Api.getTeamHistory = async function (userId, season){
        const teamHistory = {};
        const histData = await OLCore.get(`/team/overview/history/season?userId=${userId}&season=${season}`);
        const matches = [];
        let teamName;

        $(histData).filter("div.collapse-row").each(function(i,el){
            const row = $(el);
            const matchDay = row.find("span.team-overview-history-matchday.hidden-sm").text().trim().replace(/\s/g,'').split("/");
            const location = OLCore.getNum(row.find("span.ol-team-name").eq(0).attr("onclick")) === userId ? "H" : "A";
            let result = row.find("div.team-overview-history-result").text().trim().replace(/\s/g,'');
            result = result.substring(0, result.indexOf("("));
            const goals = result.split(":").map(r => Number(r));
            const winner = goals[0] > goals[1] ? "H" : (goals[0] < goals[1] ? "A" : "N");
            const opponentSpan = row.find("span.ol-team-name:not(.ol-bold)");
            const ownSpan = row.find("span.ol-team-name.ol-bold");
            const opponentTeam = { id: OLCore.getNum(opponentSpan.attr("onclick")), name: opponentSpan.text().trim()};
            const ownTeam = { id: OLCore.getNum(ownSpan.attr("onclick")), name: ownSpan.text().trim()};
            if (!teamName) {
                teamName = ownTeam.name;
            }
            const rowData = {
                fixture: `${row.find("span.ol-team-name").eq(0).text().trim()} - ${row.find("span.ol-team-name").eq(1).text().trim()}`,
                type: (row.hasClass("ol-friendly") ? "F" : (matchDay[0].toLowerCase() === t("quali.")?"Q":"L")),
                matchId: OLCore.getNum(row.find("a.team-overview-history-matchreport-button").attr("onclick"), 1),
                opponent: opponentTeam,
                self: ownTeam,
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
        teamHistory.teamName = teamName;
        return teamHistory;
    };

    OLCore.Api.getSquad = async function (userId){

        function parseOverviewSquad(squadData){
            const rows = $(squadData).find("div.squad-player-wrapper.row");
            const teamValue = $(squadData).find('div.ol-quadruple-banner-row:nth-child(2) > div > span:nth-child(2)').text();
            const playerArray = [];
            const playerData = {};
            rows.each(function(){
                const player = {};
                const row = $(this);
                const nameDiv = row.children("div").eq(0).children("div").eq(0);
                const nameSpan = nameDiv.children("span").eq(0);
                const iconSpan = nameDiv.children("span").eq(1);
                const statDataDiv = row.children("div").eq(0).children("div").eq(1);

                player.id = parseInt(nameSpan.attr("onclick").match(/{\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1],10);
                player.name = nameSpan.children("span").eq(0).text().trim();
                player.new = iconSpan.find("span.ol-new-player").length === 1;
                player.aggressiveLeader = iconSpan.find("div.statusAgressiveLeader").length === 1;
                if (iconSpan.find("div.statusCard").length){
                    const outTypeClass = $(iconSpan.find("div.statusCard")[0]).children().eq(0).attr("class");
                    if (outTypeClass.match(/icon-icon_(\w+)\b/)){
                        player.outType = outTypeClass.match(/icon-icon_(\w+)\b/)[1];
                    }
                    //missing in OL2.0
                    //player.outDuration = parseInt(nameDiv.find("span.ol-player-out-duration").text(), 10);
                }
                if (iconSpan.find("div.statusTransferOffer").length){
                    try {
                        player.offerId = parseInt(iconSpan.find("div.statusTransferOffer").children("a").eq(0).attr("data-content").match(/openBidOverviewAndShowOfferView\((\d+)\)/)[1], 10);
                    } catch (e) {}
                }
                player.lineup = 0; // 0 = not lined up, 1= League lineUp, 2 = League Sub, 4 = Friendly lineup, 8 = Friendly Sub
                if (iconSpan.find("div#leagueLineUpPlayer.statusLeague:not(.statusBench)").length){
                    player.lineup += 1;
                }
                if (iconSpan.find("div#leagueLineUpPlayer.statusLeague.statusBench").length){
                    player.lineup += 2;
                }
                if (iconSpan.find("div#friendlyLineUpPlayer.statusLeague:not(.statusBench)").length){
                    player.lineup += 4;
                }
                if (iconSpan.find("div#friendlyLineUpPlayer.statusLeague.statusBench").length){
                    player.lineup += 8;
                }

                player.nation = iconSpan.find("a.ol-flag-popup").attr("data-content").match(/<b>(.*)<\/b>/)[1];
                player.age = parseInt(statDataDiv.children("div").eq(1).children("div").eq(1).text(),10);
                player.positions = statDataDiv.children("div").eq(0).children("div").eq(1).text().replace(/\s+/g,'').split(',');
                player.apps = parseInt(statDataDiv.children("div").eq(2).children("div").eq(1).text(),10);
                player.goals = parseInt(statDataDiv.children("div").eq(3).children("div").eq(1).text(),10);
                player.assi = parseInt(statDataDiv.children("div").eq(4).children("div").eq(1).text(),10);
                player.value = OLCore.getNum(statDataDiv.children("div").eq(5).children("div").eq(1).text());
                //missing in OL2.0 (it is in the "Saisonbilanz" only for own team)
                //player.rating = OLCore.getNum(subrow2.children("div").eq(6).text());
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
                if (subRow1.find(`span:contains("${t("Vereinslos")}")`).length){
                    entry.newTeam = 0;
                }
            }
            if (subRow2.find("span.ol-team-name").length){
                entry.oldTeam = parseInt(subRow2.find("span.ol-team-name").attr("onclick").match(/{\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
            } else {
                if (subRow2.find(`span:contains("${t("Vereinslos")}")`).length){
                    entry.oldTeam = 0;
                } else
                    if (subRow2.find(`span:contains("${t("Heimatverein")}")`).length){
                        entry.oldTeam = -1;
                    }
            }
            entry.transferFeeText = subRow2.children("div").eq(3).text();
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

    OLCore.Api.getPlayerQuickOverview = async function (playerId) {
        const player = {};
        const playerData = await OLCore.get(`/player/quickoverview?playerId=${playerId}`);
        const dataCols = $(playerData).find("div.ol-player-overview-info-block-wrapper");
        dataCols.each(function(i, col){
            const attr = t($(col).find("div.ol-player-overview-info-block > div").eq(0).text().trim());
            const valueDiv = $(col).find("div.ol-player-overview-info-block > div").eq(1);
            const value = valueDiv.text().trim();
            if (attr){
                switch (attr) {
                    case t("Zustand"):
                        const iconDiv = valueDiv.children("div").eq(0);
                        player.conditionText = value;
                        player.banned = iconDiv.hasClass("icon-icon_redcard") || iconDiv.hasClass("icon-icon_yellowredcard");
                        player.injured = iconDiv.hasClass("icon-icon_injury");
                        player.conditionDuraShort = player.banned || player.injured ? value.match(/^(\d+ \w).*$/)?.[1]?.replace?.(/\s/g,'') : null;
                        player.conditionDura = OLCore.getNum(value);
                        break;
                    case t("Ø-Note"):
                        player.rating = OLCore.getNum(value);
                        break;
                    case t("Alter"):
                        player.age = OLCore.getNum(value);
                        break;
                    case t("Größe"):
                        player.height = OLCore.getNum(value);
                        break;
                    case t("Spiele/Tore"):
                        const st_nums = OLCore.getNum(value, -1);
                        player.matches = st_nums[0];
                        player.goals = st_nums[1];
                        break;     
                    case t("Gelb/Rot"):
                        const gr_nums = OLCore.getNum(value, -1);
                        player.yellow = gr_nums[0];
                        player.red = gr_nums[1];
                        break;     
                    default:
                        break;
                }
            }
        });

        const dataPlayerAttributesSection = $(playerData).find("div.ol-quickoverview-valuepie-wrapper > div > section#0").eq(0);
        if (dataPlayerAttributesSection.length){
            player.attributes = {};
            const dataPlayerAttributes = OLCore.JSON.tryParse(dataPlayerAttributesSection.attr("data-player-attributes"));
            player.attributes = {...dataPlayerAttributes};            
            for (const k of Object.keys(OLCore.Base.propId)){
                player.attributes[k] = dataPlayerAttributes[OLCore.Base.propId[k]];
            }
        }

        player.fitnessHistory = [...$("section#sectionPlayerFitness span.flagValue")].map(f => OLCore.getNum($(f).text()));
        player.formHistory = [...$("section#sectionPlayerForm div.legend.pull-left > div.pull-left")].map(f =>  5 - $(f).find("div.white").length);

        player.skills = {};
        const attrCols = $(playerData).find("section#sectionPlayerAttributes > div.ol-player-overview-player-attr > div.row");
        attrCols.each(function(i,col){            
            const attr = $(col).children("div").eq(0).text().trim();
            const value = OLCore.getNum($(col).children("div").eq(1).children("div").eq(0).children("div").eq(0).text().trim());
            player.skills[attr] = value;
        });
        return player;
    };
    
    OLCore.Api.getPlayerOverview = async function(playerId){
        const playerData = await OLCore.get(`/player/overview?playerId=${playerId}`);
        const dataCols = $(playerData).find("#playerOverviewContent > div:nth-child(1) div.ol-player-overview-info-block-wrapper");
        const gameStatsCols = $(playerData).find("#playerOverviewContent > div:nth-child(2) .player-info-stats-mobile:last-child > div:not(:nth-child(1)) > div:nth-child(1)");
        // const dataCols = $(playerData).find("div.container.playeroverviewtablestriped > div.row > div.col-md-6 > div.row");
        const player = {attributes:{},skills:{}};
        dataCols.each(function(i, col){
            const attr = t($(col).find("div.ol-player-overview-info-block > div").eq(0).text().trim());
            const value = $(col).find("div.ol-player-overview-info-block > div").eq(1).text().trim();
            if (attr){
                player.attributes[attr.trim()] = value ? value.trim() : null;
                if (attr === t("Marktwert")){
                    player.marketValue = OLCore.getNum(value);
                }
                if (attr === t("Jahresgehalt")){
                    player.salary = OLCore.getNum(value);
                }
            }
        });
        player.stats = gameStatsCols.eq(0).text();
        player.cards = gameStatsCols.eq(1).text();
        
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
        if (!leagueId && !OLCore.Base.leagueId){
            await OLCore.Api.getTeamInfo();
        }
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
        const matchData = window.location.href.endsWith(`/friendly?season=${season}&matchId=${matchId}`) && $("div#ol-pitch-position").length ? $("div#olTeamOverviewContent").children() : await OLCore.get(`/friendly/lineup?season=${season}&matchId=${matchId}`);
        const matchLineup = {"home" : {"lineup":[], "substitutions": []}, "away" : {"lineup":[], "substitutions": []}};
        const userIdA = $(matchData).find("div#matchdayresult span.pointer[onclick*='/team/overview']");
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

        const matchURL = new URL(window.location.href);
        const searchParams = matchURL.hash && matchURL.hash.startsWith("#url=/") ? new URLSearchParams(matchURL.hash.substring(matchURL.hash.indexOf("?"))) : matchURL.searchParams;
        season = season || searchParams.get("season");
        matchId = matchId || searchParams.get("matchId");

        const isAct = Number(season) === Number(searchParams.get("season")) && Number(matchId) === Number(searchParams.get("matchId"));

        if (!season || !matchId){
            console.log('[OLCore.Api.getMatchLineup] invalid params');
            return userId ? matchLineup.home : matchLineup;
        }

        const matchLineup = {"home" : {"lineup":[], "substitutions": [], "players": {}}, "away" : {"lineup":[], "substitutions": [], "players": {}}};

        const matchData = $("div.statistics-lineup-wrapper").length === 2 && isAct ? $("div#matchContent").children() : await OLCore.get(`/match/lineup?season=${season}&matchId=${matchId}`);
        const userIdSpan = $(matchData).find("div.timeline-teamname-wrapper > span[onclick]");
        const formations = $(matchData).find("div.team-system-headline");
        const pitches = $(matchData).find("div.ol-team-settings-pitch-position-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];
        if (pitches.length === 0){
            return null;
        }
        const dura = OLCore.getNum($($(matchData).find("div.icon-icon_finalwhistle").parent().attr("data-content")).find("b").eq(0).text());
        matchLineup.dura = dura;
        matchLineup.home.dura = dura;
        matchLineup.away.dura = dura;
        matchLineup.home.userId = parseInt($(userIdSpan[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchLineup.away.userId = parseInt($(userIdSpan[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1],10);
        matchLineup.home.formation = formations.eq(0).text().trim();
        matchLineup.away.formation = formations.eq(1).text().trim();
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
            const red = $(el).find("div.icon-lineup_icon_red");
            const yellowred = $(el).find("div.icon-lineup_icon_yellowred");
            const yellow = $(el).find("div.icon-lineup_icon_yellow");
            if (red.length){
                playerData.red = OLCore.getNum($(red.parent().attr("title") || red.parent().attr("data-original-title") || red.parent().attr("data-content")).find("b").text());
            }
            if (yellowred.length){
                playerData.yellowred = OLCore.getNum($(yellowred.parent().attr("title") || yellowred.parent().attr("data-original-title") || yellowred.parent().attr("data-content")).find("b").text());
            }
            if (yellow.length){
                playerData.yellow = OLCore.getNum($(yellow.parent().attr("title") || yellow.parent().attr("data-original-title") || yellow.parent().attr("data-content")).find("b").text());
            }
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
            const red = $(el).find("div.icon-lineup_icon_red");
            const yellowred = $(el).find("div.icon-lineup_icon_yellowred");
            const yellow = $(el).find("div.icon-lineup_icon_yellow");
            if (red.length){
                playerData.red = OLCore.getNum($(red.parent().attr("title") || red.parent().attr("data-original-title") || red.parent().attr("data-content")).find("b").text());
            }
            if (yellowred.length){
                playerData.yellowred = OLCore.getNum($(yellowred.parent().attr("title") || yellowred.parent().attr("data-original-title") || yellowred.parent().attr("data-content")).find("b").text());
            }
            if (yellow.length){
                playerData.yellow = OLCore.getNum($(yellow.parent().attr("title") || yellow.parent().attr("data-original-title") || yellow.parent().attr("data-content")).find("b").text());
            }
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
            const red = $(el).find("div.icon-lineup_icon_red");
            const yellowred = $(el).find("div.icon-lineup_icon_yellowred");
            const yellow = $(el).find("div.icon-lineup_icon_yellow");
            const subData = {
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            };
            if (red.length){
                subData.red = OLCore.getNum($(red.parent().attr("title") || red.parent().attr("data-original-title") || red.parent().attr("data-content")).find("b").text());
            }
            if (yellowred.length){
                subData.yellowred = OLCore.getNum($(yellowred.parent().attr("title") || yellowred.parent().attr("data-original-title") || yellowred.parent().attr("data-content")).find("b").text());
            }
            if (yellow.length){
                subData.yellow = OLCore.getNum($(yellow.parent().attr("title") || yellow.parent().attr("data-original-title") || yellow.parent().attr("data-content")).find("b").text());
            }
            matchLineup.home.substitutions.push(subData);
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

            const red = $(el).find("div.icon-lineup_icon_red");
            const yellowred = $(el).find("div.icon-lineup_icon_yellowred");
            const yellow = $(el).find("div.icon-lineup_icon_yellow");
            const subData = {
                "minute": min,
                "in" : {"id":playerIdIn,"name":playerNameIn,"rating":playerRatingIn},
                "out" : {"id":playerIdOut,"name":playerNameOut,"rating":playerRatingOut}
            };
            if (red.length){
                subData.red = OLCore.getNum($(red.parent().attr("title") || red.parent().attr("data-original-title") || red.parent().attr("data-content")).find("b").text());
            }
            if (yellowred.length){
                subData.yellowred = OLCore.getNum($(yellowred.parent().attr("title") || yellowred.parent().attr("data-original-title") || yellowred.parent().attr("data-content")).find("b").text());
            }
            if (yellow.length){
                subData.yellow = OLCore.getNum($(yellow.parent().attr("title") || yellow.parent().attr("data-original-title") || yellow.parent().attr("data-content")).find("b").text());
            }
            matchLineup.away.substitutions.push(subData);
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
        const matchURL = new URL(window.location.href);
        const searchParams = matchURL.hash && matchURL.hash.startsWith("#url=/") ? new URLSearchParams(matchURL.hash.substring(matchURL.hash.indexOf("?"))) : matchURL.searchParams;
        season = season || searchParams.get("season");
        matchId = matchId || searchParams.get("matchId");

        const isAct = Number(season) === Number(searchParams.get("season")) && Number(matchId) === Number(searchParams.get("matchId"));

        const matchData = $("div.ol-match-report-line.ol-match-statistic").length && isAct? $("div#matchContent").children() : await OLCore.get(`/match/statistic?season=${season}&matchId=${matchId}`);

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
        matchStatistics.home.teamName = userIdSpan.eq(0).text().trim();
        matchStatistics.away.teamName = userIdSpan.eq(1).text().trim();
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
        for (const td of $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("TORE")}")`).next().find("tbody > tr > td:first-child")){
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
        for (const td of $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("TORE")}")`).next().find("tbody > tr > td:nth-child(2)")){
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
        for (const td of $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("KARTEN")}")`).next().find("tbody > tr > td:first-child")){
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
        for (const td of $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("KARTEN")}")`).next().find("tbody > tr > td:nth-child(2)")){
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
        const possession = $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("BALLBESITZ")}")`).next().find("tbody > tr > td");
        const duels = $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("ZWEIKÄMPFE")}")`).next().find("tbody > tr > td");
        const chances = $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("TORCHANCEN")}")`).next().find("tbody > tr > td");
        const corners = $(matchData).find(`div.ol-match-report-headline-wrapper:contains("${t("ECKBÄLLE")}")`).next().find("tbody > tr > td");
        const homestats = {
            possession: parseInt(possession.eq(0).text(),10),
            duels: parseInt(duels.eq(0).text(),10),
            shots: parseInt(chances.eq(0).text(),10),
            chances: OLCore.getNum(chances.eq(0).text(),1),
            corners: parseInt(corners.eq(0).text(),10)
        };
        const awaystats = {
            possession: parseInt(possession.eq(1).text(),10),
            duels: parseInt(duels.eq(1).text(),10),
            shots: parseInt(chances.eq(1).text(),10),
            chances: OLCore.getNum(chances.eq(1).text(),1),
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
        const clickData = $(offerData).find("button.ol-transferlist-player-profile-button").attr("onclick");
        const playerId = clickData ? parseInt(clickData.match(/\bplayerId\s*:\s*(\d+)/)[1],10) : 0;
        const overview = $(offerData).find("div.ol-transferlist-playerview-offer div.ol-player-overview-info-wrapper").eq(0);
        const overviewChilds = $(overview).find("div.ol-player-overview-info-block > div:nth-child(2)");
        const playerData = $(offerData).find("div.ol-transferlist-playerview-offer-player-details div.ol-player-overview-info-wrapper").eq(0);
        const playerDataChilds = $(playerData).find("div.ol-player-overview-info-block > div:nth-child(2)");
        const marketvalue = OLCore.getNum(overviewChilds.eq(0).text());
        const minFee = OLCore.getNum(overviewChilds.eq(4).text());
        const salarySuggestion = OLCore.getNum(overviewChilds.eq(3).text());
        //const endDate = $(offerData).find(".transfer-auction-end-date").eq(0).contents().last().text().trim().match(/\d[\d/\.\s:]+\d/)[0];
        const endDateDiv = $(offerData)?.find(".transfer-auction-end-date")?.eq(0);
        let endDate = null;
        if (endDateDiv.length){
            const endDateUTC = endDateDiv.attr("data-utc");
            const endDateFormat = endDateDiv.attr("data-time_format");
            endDate = olRealtimeHelper.formatDatePHP(new Date(endDateUTC), endDateFormat);
        }
        const salary = OLCore.getNum(overviewChilds.eq(1).text());
        const bidCount = OLCore.getNum($(offerData).find("div.ol-transferlist-playerview-offer > div.ol-offer-detailsrow > div.ol-transferlist-offer-details:nth-child(2) > div:nth-child(2)").eq(0).text().trim());
        const age = OLCore.getNum(playerDataChilds.eq(2).text());
        const avg = OLCore.getNum($(offerData).find("span.ol-value-pie-value").eq(0).text().trim());
        const talentText = $(offerData).find(".ol-transferlist-playerview-player-attr > .ol-player-overview-info-wrapper > .ol-player-overview-player-attr > div.row").last();
        const talent = OLCore.getNum($(talentText).find("div > .ol-player-overview-player-attr-value-bar-bg > div").text());
        const talentDetermined = !$(talentText).find(".ol-player-overview-player-attr-label > div").text().includes(t("wird noch ermittelt"));
        const name = $(offerData).find("div.ol-transferlist-offer-playername > div.player-complete-name > span:nth(0)").text();
        const pos = $(offerData).find("div.ol-transferlist-offer-playername > div.player-complete-name > span:nth(2) span:nth(0)").text().replace(/\s/g,"").split(",");
        const nation = playerDataChilds.eq(0).text().trim();

        //TODO: still to fix all the bid data
        const bids = [];
        $(offerData).find(".row.transfer-player-list-table-row").each(function(i,row){
            if (i === 0){
                return;
            }
            const bid = {};
            bid.accepted = $(row).find(".transfer-done").length > 0;
            bid.state = $(row).find(".transfer-done").text() || $(row).find(".player-declines").text().trim();
            bid.league = $(row).find(".transfer-offer-overview-league").text().trim();
            bid.leagueLevel = OLCore.getNum($(row).find(".transfer-offer-overview-league").text().trim());
            bid.team = $(row).find(".ol-team-name").text().trim();
            bid.contract = $(row).find(".transfer-allbids-contract").text().trim();
            bid.salary = $(row).find(".transfer-allbids-salary").text().trim();
            bid.fee = $(row).find(".transfer-allbids-fee").text().trim();
            bid.date = $(row).find(".transfer-allbids-date").text().trim();
            bids.push(bid);
        });

        return {
            "playerId": playerId,
            "playerName": name,
            "nation": nation,
            "minFee": minFee,
            "marketvalue": marketvalue,
            "salarySuggestion": salarySuggestion,
            "endDate": endDate,
            "salary": salary,
            "bidCount": bidCount,
            "age": age,
            "avg": avg,
            "talent": talent,
            "talentDetermined": talentDetermined,
            "pos": pos,
            "bids": bids
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
        const acaDiv = $(acadamyData).find("div.ol-infrastructure-status-wrapper").eq(0);
        const effDiv = $(acadamyData).find("div.ol-infrastructure-status-wrapper").eq(1);
        const extDiv = $(acadamyData).find("div.ol-infrastructure-status-wrapper").eq(2);

        acadamy.value = OLCore.getNum($(acadamy).find("span#currentConstructionValue").attr("data-value"));
        acadamy.fixCosts = OLCore.getNum($(acadamy).find("div#data-current-running-costs").attr("data-current-running-costs")); 
        acadamy.progress = OLCore.getNum(acaDiv.find("span.ol-value-pie-value").text());
        acadamy.state = ''; //TODO
        acadamy.overallValue = acadamy.value;
        acadamy.overallFixCosts = acadamy.fixCosts;
        acadamy.effinciency = OLCore.getNum(effDiv.find("span.ol-value-pie-value").text());

        // TDOD
        extension = {
            "value": OLCore.getNum(extDiv.find("div.ol-infrastructure-text > div").eq(0).text()),
            "fixCosts": OLCore.getNum(extDiv.find("div.ol-infrastructure-text > div").eq(1).text()),
            "progress": OLCore.getNum(extDiv.find("span.ol-value-pie-value").text()),
            "state": '' //TODO
        };

        acadamy.overallValue += extension.value;
        acadamy.overallFixCosts += extension.fixCosts;
/*
        $(acadamyData).find("div.ol-youth-player-wizard-sub-header.pull-left").each(function(i,el){
            const par = $(el.parentNode);
            if ($(el).text() === t("Leistungszentrum")){
                const valSpan = par.find('span.ol-value-bar-layer-2')[0];
                const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
                acadamy.value = OLCore.getNum(par.children("span#currentConstructionValue").eq(0).attr("data-value"));
                acadamy.fixCosts = OLCore.getNum(par.children("div.ol-youth-player-annual-overall-cost").eq(0).text());
                acadamy.progress = progress;
                acadamy.state = par.children("div.ol-youth-player-wizard-sub-header.pull-right.ol-youth-player-academy-value-bar").eq(0).text();
                acadamy.overallValue = acadamy.value;
                acadamy.overallFixCosts = acadamy.fixCosts;
            } else if ($(el).text() === t("Effizienz")){
                const valSpan = $(el).next().find('span.ol-value-bar-layer-2')[0];
                const progress = Math.round(parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width));
                acadamy.effinciency = progress;
            } else if ($(el).text() === t("Erweiterung")){
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
*/
        return {
            "acadamy" : acadamy,
            "extension" : extension
        };
    };

    OLCore.Api.NLZ.getYouthPlayer = async function(youthPlayerId){
        let playerData = await OLCore.get(`/office/youthplayer/contract?youthPlayerId=${youthPlayerId}`);
        playerData = $(playerData);

        const playerOverviewData = playerData.find("section.ol-player-overview-info-wrapper > div.row > div.ol-player-overview-info-block-wrapper > ol-player-overview-info-block > div:last-child");
        const name = playerData.find("div.ol-player-overview-player-name").text().trim();
        const feet = playerOverviewData.eq(1).text().trim();
        const positions = playerData.find("div.ol-player-overview-player-positions").text().trim().split(",");
        const overall = OLCore.getNum(playerOverviewData.eq(0).text().trim());
        const countryData = playerData.find("a.friendly-info-popup.ol-flag-popup").attr("data-content");
        const country = $(countryData).length ? $(countryData).text() : countryData;
        const age = OLCore.getNum(playerData.find("div.ol-player-overview-team > div > span").eq(0).text().trim());
        const height = parseFloat(playerOverviewData.eq(2).text().trim());
        const marketValue = OLCore.getNum(playerOverviewData.eq(3).text().trim());
        const attributes = {};
        playerData.find("div.ol-player-overview-player-attr > div.row").each(function(i, el){
            const attributeName = $(el).find("div.ol-player-overview-player-attr-label").text().trim();
            const attributeValue = OLCore.getNum($(el).find("div.ol-player-overview-player-attr-value-bar-bg > div.text-center").text().trim());
            attributes[attributeName] = attributeValue;
        });
        const salary = OLCore.getNum(playerData.find("input#inputSalary").attr("value"));
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
        let allAvgLineupValueNew = 0;
        let allPlayersValue = 0;
        let cnt = 0;
        let cntNew = 0;

        if (avgLineupHistoryValues && opt.useCache){
            allAvgLineupValue = avgLineupHistoryValues.allAvgLineupValue;
            cnt = avgLineupHistoryValues.cnt;
            allAvgLineupValueNew = avgLineupHistoryValues.allAvgLineupValueNew || 0;
            cntNew = avgLineupHistoryValues.cntNew || 0;
        } else {
            avgLineupHistoryValues = {};
            const teamHistory = await OLCore.Api.getTeamHistory(userId, lastMatchSeason);
            const weekLimit = opt.friendlyWeek || OLCore.Base.week;
            const leagueMatches = teamHistory.matches.filter(m => (m.type === "L" && m.week <= weekLimit));
            if (opt.debug) {
                console.log(`++++++++++ Start L-Wert Berechnung für ${teamHistory.teamName} +++++++++++++++`);
            }
            for (const match of leagueMatches){
                const matchLineup = await OLCore.Api.getMatchLineup(lastMatchSeason, match.matchId, userId);
                if (matchLineup){
                    if (opt.debug) {
                        console.log(`### Spiel ${cnt+1}: ${match.fixture} ### `);
                    }
                    const lineupPlayers = squadData.playerArr.filter(p => matchLineup.lineup.map(l => l.playerId).includes(p.id));
                    if (lineupPlayers.length){
                        const playersCount = lineupPlayers.length;
                        let lineupValue = lineupPlayers.map(a => a.value).reduce((pv, cv) => pv + cv, 0);
                        const avgLineupValue = lineupValue/playersCount;
                        allAvgLineupValue += avgLineupValue;
                        cnt++;
                    }
                    const matchPlayers = squadData.playerArr.filter(p => Object.keys(matchLineup.players).map(pl => Number(pl)).includes(p.id));
                    if (matchPlayers.length){
                        const matchDura = matchLineup.dura;
                        let playersCount = 0.0;
                        let playersValue = 0;
                        for (const player of matchPlayers){
                            const opTime = (matchLineup.players[player.id].out || matchDura) - (matchLineup.players[player.id].in || 0);
                            const playerValue = player.value * (opTime/matchDura);
                            if (opt.debug) {
                                console.log(`${player.name} ${opTime}' ${OLCore.num2Cur(playerValue)} [${player.value} * (${opTime}/${matchDura})]`);
                            }
                            playersValue += playerValue;
                            playersCount += (opTime/matchDura);
                        }
                        const avgPlayersValaue = playersValue/playersCount;
                        allPlayersValue += playersValue;
                        if (opt.debug) {
                            console.log('------------------------------------------------------');
                            console.log(`MW aller Spieler: ${OLCore.num2Cur(playersValue)}`);
                            console.log(`Anzahl relevanter Spieler: ${playersCount}`);
                            console.log(`MW Durchschnitt: ${OLCore.num2Cur(avgPlayersValaue)} [${OLCore.num2Cur(playersValue)}/${playersCount}]`);
                            console.log('------------------------------------------------------');
                            console.log('------------------------------------------------------');
                        }
                        allAvgLineupValueNew += avgPlayersValaue;
                        cntNew++;
                    }
                }
            }
            avgLineupHistoryValues.allAvgLineupValue = allAvgLineupValue;
            avgLineupHistoryValues.cnt = cnt;
            avgLineupHistoryValues.allAvgLineupValueNew = allAvgLineupValueNew;
            avgLineupHistoryValues.cntNew = cntNew;
            OLCore.setMatchdayValueId("avgLineupHistoryValues", userId, JSON.stringify(avgLineupHistoryValues));
        }
        const realLQOld = cnt === 0 ? avgFriendlyLineupValue : Math.round(allAvgLineupValue/cnt);
        const nextLQOld = Math.round((allAvgLineupValue+avgActLeagueLineupValue)/(cnt+1));
        const realLQNew = cntNew === 0 ? avgFriendlyLineupValue : Math.round(allAvgLineupValueNew/cntNew);
        const nextLQNew = Math.round((allAvgLineupValueNew+avgActLeagueLineupValue)/(cntNew+1));

        if (opt.debug) {
            console.log('------------------------------------------------------');
            console.log(`MW aktuelles Friendly: ${OLCore.num2Cur(friendlyLineupValue)}`);
            console.log(`MW Durchschnitt aktuelles Friendly: ${OLCore.num2Cur(avgFriendlyLineupValue)} [${OLCore.num2Cur(friendlyLineupValue)}/11]`);
            console.log(`Anzahl relevanter Ligaspiele: ${cntNew}`);
            console.log(`Summe aller (${cntNew}) Durchschnittswerte je Spiel: ${OLCore.num2Cur(allAvgLineupValueNew)}`);
            console.log(`MW Durchschnitt über alle bisherigen Ligaspiele: ${OLCore.num2Cur(realLQNew)} [${OLCore.num2Cur(allAvgLineupValueNew)}/${cntNew}]`);
            console.log(`L-Wert: ${OLCore.roundL(avgFriendlyLineupValue*100/realLQNew)} [${OLCore.num2Cur(avgFriendlyLineupValue)}*100/${OLCore.num2Cur(realLQNew)}]`);
            console.log('------------------------------------------------------');
            console.log('------------------------------------------------------');
        }

        const realLOld = OLCore.roundL(avgFriendlyLineupValue*100/realLQOld);
        const nextLOld = OLCore.roundL(avgFriendlyLineupValue*100/nextLQOld);
        const realLNew = OLCore.roundL(avgFriendlyLineupValue*100/realLQNew);
        const nextLNew = OLCore.roundL(avgFriendlyLineupValue*100/nextLQNew);


        return {
            realL: realLNew,
            nextL: nextLNew
        };
    };

    OLCore.XApi.getRank = async function(season, leagueId, matchDay, userId){
        season = season || OLCore.Base.season;
        if (!leagueId && !OLCore.Base.leagueId){
            await OLCore.Api.getTeamInfo();
        }
        leagueId = leagueId || OLCore.Base.leagueId;
        matchDay = matchDay || OLCore.Base.matchDay;
        userId = userId || OLCore.Base.userId;
        if (matchDay > 34){
            if (season > OLCore.Base.season) return 1;
            matchDay = 34;
        }
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
        if (!leagueId && !OLCore.Base.leagueId){
            await OLCore.Api.getTeamInfo();
        }
        leagueId = leagueId || OLCore.Base.leagueId;
        matchDay = matchDay || OLCore.Base.matchDay;
        userIds = userIds || [];
        if (matchDay > 34){
            matchDay = 34;
        }
        const matchDayData = (season > OLCore.Base.season) ? false : await OLCore.Api.getMatchDay(season, leagueId, matchDay);
        for (const userId of userIds){
            if (matchDayData && matchDayData.table){
                const teamData = matchDayData.table.find(m => m.teamId === userId);
                if (teamData){
                    ranks[userId] = teamData.rank;
                } else {
                    ranks[userId] = undefined;
                }
            } else if (season > OLCore.Base.season){
                ranks[userId] = 1;
            } else {
                ranks[userId] = undefined;
            }
        }
        return ranks;
    };

    OLCore.XApi.getLeagueSchedule = async function(userId){
        userId = userId || OLCore.Base.userId;
        let leagueId, leagueLevel;
        if (userId !== OLCore.Base.userId || !OLCore.Base.leagueId){
            const teamInfo = await OLCore.Api.getTeamInfo(userId);
            leagueId = teamInfo.leagueId;
            leagueLevel = teamInfo.leagueLevel;
        } else {
            leagueId = OLCore.Base.leagueId;
            leagueLevel = OLCore.Base.leagueLevel;
        }
        let season = OLCore.Base.season;
        if (OLCore.Base.week > 37 && (leagueLevel < 3 || OLCore.Base.week > 39)) {
                season += 1;
        };
        let leagueSchedule = OLCore.getSeasonValueId("LeagueSchedule", userId, season);
        if (leagueSchedule){
            const tmpSched = JSON.parse(leagueSchedule);
            if (tmpSched.find(ls => ls.location === 'X')){
                leagueSchedule = undefined;
            }
        }
        if (leagueSchedule){
            const sched = JSON.parse(leagueSchedule);
            if (sched.length === 34){
                return sched;
            }
        }
        const schedule = [];
        let matchDay = 1;

        while (matchDay < 35){

            const matchDayData = await OLCore.get(`/matchdaytable/leaguetable?season=${season}&matchday=${matchDay}&leagueLevel=${leagueLevel}&leagueId=${leagueId}&stateId=2&leagueMatchday=1&type=1&nav=true&navId=matchdayTable`);
        const teamTableSpan = $(matchDayData).find(`div#leagueFound span.ol-team-name[onclick*=' ${userId} ']`);
            const matchDiv = teamTableSpan.closest('.ol-matchdaytable-team-row');
            const matchId = OLCore.getNum(matchDiv.attr("data-match-id"));
            let opponent = {}, location = 'X';
            $(matchDiv).find('span.ol-team-name[onclick]').each(function(i,sp){
                sp = $(sp);
                const spanUserId = OLCore.getNum(sp.attr("onclick"));
                if (spanUserId !== userId){
                    opponent = {
                        id: spanUserId,
                        name: sp.text().trim()
                    };
                    location = i===0?'A':'H';
        }
            });
            const entry = {
                matchDay: matchDay,
                matchId: matchId,
                location: location,
                opponent: opponent
            };

            schedule.push(entry);
            matchDay++;
        }
        OLCore.setSeasonValueId("LeagueSchedule", userId, JSON.stringify(schedule), season);
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
                finished: matchStatus.toUpperCase() === t("SPIELBERICHT")? 1 : 0
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

    /****************
     * OLCore.Lib (shared functions for multiple modules)
     ***************/

    OLCore.Lib = {};

    OLCore.Lib.avgStatsPitch = function(pitch){
        const numOpt = { maximumFractionDigits: 1, minimumFractionDigits: 1 };
        $(`<div class="ol-position-rating-container ol-state-color-light-${OLCore.Base.teamColorNumber} style="position:relative;top:0">
    <div style="max-width: 557px; margin: 0 auto;">
        <span class="ol-team-position-rating-space"><span class="ol-position-rating-position">Defensive</span><div class="ol-position-rating-number" style="width:44px"><span class="ol-system-part-avg ol-system-part-avg-2 systemPartAverageValue2">${OLi18n.tbNum('0', numOpt)}</span>%</div></span>
        <span class="ol-team-position-rating-space"><span class="ol-position-rating-position">Mittelfeld</span><div class="ol-position-rating-number" style="width:44px"><span class="ol-system-part-avg ol-system-part-avg-3 systemPartAverageValue3">${OLi18n.tbNum('0', numOpt)}</span>%</div></span>
        <span class="ol-team-position-rating-space"><span class="ol-position-rating-position">Offensive</span><div class="ol-position-rating-number" style="width:44px"><span class="ol-system-part-avg ol-system-part-avg-5 systemPartAverageValue5">${OLi18n.tbNum('0', numOpt)}</span>%</div></span>
        <span class="ol-team-position-rating-space ol-team-position-rating-overall" style="float:right;"><span class="ol-position-rating-position">Gesamt</span><div class="ol-pitch-average-rating-overall" style=""><span class="ol-pitch-average-rating systemPartAverageValue0">${OLi18n.tbNum('0', numOpt)}</span>%</div></span>
        <div style="clear:both;"></div>
    </div>
</div>`).insertBefore($(pitch).find("div.ol-pitch-preview.ol-team-settings-pitch-wrapper"));
        const formationStr = $(pitch).find(".team-system-headline").text();
        const formation = OLCore.Base.Formations[formationStr];
        if (!formation){
            console.warn(`Formation ${formationStr} unbekannt`);
            return;
        }
        const formationDataPositionTypes = formation.positions.map(p => p.dataPositionType);
        const p = [0,0,0,0,0,0];
        const n = [0,0,0,0,0,0];
        $(pitch).find("div.ol-pitch-position").each(function(i,e){
            const dp = parseInt($(e).attr("data-position"),10);
            const dpt = formationDataPositionTypes[dp-1];
            const total = parseInt($(e).find(".ol-lineup-player-average").text()) || 0;
            p[0] += total;
            n[0]++;
            for (const t of dpt){
                p[t] += total;
                n[t]++;
            }
        });
        $(pitch).find("span.systemPartAverageValue0").text(n[0] > 0 ? OLi18n.tbNum(p[0]/n[0], numOpt) : OLi18n.tbNum('0', numOpt));
        $(pitch).find("span.systemPartAverageValue2").text(n[2] > 0 ? OLi18n.tbNum(p[2]/n[2], numOpt) : OLi18n.tbNum('0', numOpt));
        $(pitch).find("span.systemPartAverageValue3").text(n[3] > 0 ? OLi18n.tbNum(p[3]/n[3], numOpt) : OLi18n.tbNum('0', numOpt));
        $(pitch).find("span.systemPartAverageValue5").text(n[5] > 0 ? OLi18n.tbNum(p[5]/n[5], numOpt) : OLi18n.tbNum('0', numOpt));
    }

    OLCore.initialize = function(){
        const tt = OLi18n.tbtext;
        OLCore.Base.Formations[t("4-4-2 Raute")] = {id: 14, short: tt("442R"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ZDM"), dataPositionType: [3]}, {short: ("LAV"), dataPositionType: [2,3]}, {short: ("RAV"), dataPositionType: [2,3]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("ROM"), dataPositionType: [3]}, {short: ("ZOM"), dataPositionType: [3]}, {short: ("ST(L)"), dataPositionType: [5]}, {short: ("ST(R)"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-4-2 Flach")] = {id: 15, short: tt("442Fla"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("RDM"), dataPositionType: [3]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("ROM"), dataPositionType: [3]}, {short: ("LDM"), dataPositionType: [3]}, {short: ("ST(L)"), dataPositionType: [5]}, {short: ("ST(R)"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-4-2 Flügel")] = {id: 16, short: tt("442Flü"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ZOM"), dataPositionType: [2,3,5]}, {short: ("LAV"), dataPositionType: [0,2]}, {short: ("RAV"), dataPositionType: [0,2]}, {short: ("LOM"), dataPositionType: [0,3]}, {short: ("ROM"), dataPositionType: [0,3]}, {short: ("DM"), dataPositionType: [2]}, {short: ("ST(L)"), dataPositionType: [5]}, {short: ("ST(R)"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-3-3 Halb offensiv, Konter")] = {id: 20, short: tt("433HO"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST"), dataPositionType: [5]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("ROM"), dataPositionType: [3]}, {short: ("DM"), dataPositionType: [3]}, {short: ("LST"), dataPositionType: [5]}, {short: ("RST"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-3-3 Offensiv")] = {id: 21, short: tt("433O"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST"), dataPositionType: [5]}, {short: ("LAV"), dataPositionType: [3,5]}, {short: ("RAV"), dataPositionType: [3,5]}, {short: ("LOM"), dataPositionType: [3,5]}, {short: ("ROM"), dataPositionType: [3,5]}, {short: ("DM"), dataPositionType: [3,5]}, {short: ("LST"), dataPositionType: [5]}, {short: ("RST"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-2-3-1 Kontrollierte Offensive")] = {id: 22, short: tt("4231KO"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST"), dataPositionType: [5]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("LDM"), dataPositionType: [3]}, {short: ("ZOM"), dataPositionType: [5]}, {short: ("RDM"), dataPositionType: [3]}, {short: ("LOM"), dataPositionType: [5]}, {short: ("ROM"), dataPositionType: [5]}]};
        OLCore.Base.Formations[t("4-2-3-1 Defensiv, Konter")] = {id: 23, short: tt("4231DK"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST"), dataPositionType: [5]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("ZDM(L)"), dataPositionType: [3]}, {short: ("ZOM"), dataPositionType: [3]}, {short: ("ZDM(R)"), dataPositionType: [3]}, {short: ("LDM"), dataPositionType: [3]}, {short: ("RDM"), dataPositionType: [3]}]};
        OLCore.Base.Formations[t("4-1-4-1 Defensiv, Konter")] = {id: 24, short: tt("4141DK"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST"), dataPositionType: [5]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("ZOM(L)"), dataPositionType: [3]}, {short: ("ZOM(R)"), dataPositionType: [3]}, {short: ("DM"), dataPositionType: [3,5]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("ROM"), dataPositionType: [3]}]};
        OLCore.Base.Formations[t("3-5-2 Dreierkette, Kompaktes Mittelfeld")] = {id: 25, short: tt("352"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("ZIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("ST(R)"), dataPositionType: [5]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("ROM"), dataPositionType: [3]}, {short: ("ST(L)"), dataPositionType: [5]}, {short: ("ZOM"), dataPositionType: [3]}, {short: ("LDM"), dataPositionType: [3]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("RDM"), dataPositionType: [3]}]};
        OLCore.Base.Formations[t("3-4-3 Dreierkette (offensiv)")] = {id: 26, short: tt("343"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("ZIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("RST"), dataPositionType: [5]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("ROM"), dataPositionType: [3]}, {short: ("LST"), dataPositionType: [5]}, {short: ("ST"), dataPositionType: [5]}, {short: ("ZOM(L)"), dataPositionType: [3]}, {short: ("LOM"), dataPositionType: [3]}, {short: ("ZOM(R)"), dataPositionType: [3]}]};
        OLCore.Base.Formations[t("4-1-5-0 Falsche Neun")] = {id: 27, short: tt("4150"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("DM"), dataPositionType: [2,3]}, {short: ("RST"), dataPositionType: [3,5]}, {short: ("LOM"), dataPositionType: [3,5]}, {short: ("ZOM"), dataPositionType: [3,5]}, {short: ("ROM"), dataPositionType: [3,5]}, {short: ("LST"), dataPositionType: [3,5]}]};
        OLCore.Base.Formations[t("4-2-4-0 Falsche Neun")] = {id: 28, short: tt("4240"), positions: [{short: tt("TW"), dataPositionType: [1]}, {short: ("RAV"), dataPositionType: [2]}, {short: ("LAV"), dataPositionType: [2]}, {short: ("LIV"), dataPositionType: [2]}, {short: ("RIV"), dataPositionType: [2]}, {short: ("LDM"), dataPositionType: [2,3]}, {short: ("ROM"), dataPositionType: [3,5]}, {short: ("RDM"), dataPositionType: [2,3]}, {short: ("ZOM(R)"), dataPositionType: [3,5]}, {short: ("ZOM(L)"), dataPositionType: [3,5]}, {short: ("LOM"), dataPositionType: [3,5]}]};
    }

    OLCore.OLDate = OLDate;

    window.OLCore = OLCore;
    window.waitForKeyElements = OLCore.waitForKeyElements;

})();