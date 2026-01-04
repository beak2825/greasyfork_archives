// ==UserScript==
// @name           Hero Wars CSV Export
// @namespace      http://tampermonkey.net/
// @version        0.0.12
// @description    A script for intercepting data for the Hero Wars game and converting it to csv.
// @description:zh 一个脚本，用于截取英雄战争游戏的数据并将其转换为csv。
// @description:ja Hero Warsゲームのデータを傍受してcsvに変換するためのスクリプト。
// @description:ru Скрипт для перехвата данных для игры Hero Wars и преобразования их в csv.
// @description:es Un script para interceptar datos para el juego Hero Wars y convertirlos a csv.
// @description:pt Um script para interceptar dados para o jogo Hero Wars e convertê-los em csv.
// @author         EnterBrain42
// @match          https://www.hero-wars.com/*
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.hero-wars.com
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM_registerMenuCommand
// @grant          GM_setClipboard
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/491628/Hero%20Wars%20CSV%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/491628/Hero%20Wars%20CSV%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function(open) {
        function jsonResponseHandler(jsonResponse) {
            //console.log(typeof jsonResponse);
            //var jsonResponse = JSON.parse(jsonResponseText);
            if (Array.isArray(jsonResponse.results)){
                jsonResponse.results.forEach(function(item, i, arr) {
                    //console.log( item );
                    if ("result" in item && typeof item.result === 'object' && item.result !== null){
                        if ("response" in item.result && typeof item.result.response === 'object' && item.result.response !== null){
                            //console.log( item.result.response );
                            //guild teams
                            if ("teams" in item.result.response && typeof item.result.response.teams === 'object' && item.result.response.teams !== null){
                                console.log("Guild Teams");
                                var clanTeams = JSON.stringify(item.result.response.teams);
                                clanTeams = clanTeams.replace(/^\{/g,'[');
                                clanTeams = clanTeams.replace(/\}$/g,']');
                                clanTeams = clanTeams.replace(/,"userId":\d+/g,'');
                                clanTeams = clanTeams.replace(/"(\d+)":\{"clanDefence_titans"(.*?)\},"clanDefence_heroes"/g,'{"userId":$1,"clanDefence_titans"$2,"totems":[],"clanDefence_heroes"');
                                clanTeams = clanTeams.replace(/\},"clanDefence_heroes"/g,',"totems":[],"clanDefence_heroes"');
                                clanTeams = clanTeams.replace(/("element":"(light)","elementSpiritLevel":\d+,"elementSpiritStar":[^0])(,.*?\}\},"totems":\[)/g,'$1$3"$2",');
                                clanTeams = clanTeams.replace(/("element":"(dark)","elementSpiritLevel":\d+,"elementSpiritStar":[^0])(,.*?\}\},"totems":\[)/g,'$1$3"$2",');
                                clanTeams = clanTeams.replace(/("element":"(earth)","elementSpiritLevel":\d+,"elementSpiritStar":[^0])(,.*?\}\},"totems":\[)/g,'$1$3"$2",');
                                clanTeams = clanTeams.replace(/("element":"(fire)","elementSpiritLevel":\d+,"elementSpiritStar":[^0])(,.*?\}\},"totems":\[)/g,'$1$3"$2",');
                                clanTeams = clanTeams.replace(/("element":"(water)","elementSpiritLevel":\d+,"elementSpiritStar":[^0])(,.*?\}\},"totems":\[)/g,'$1$3"$2",');
                                clanTeams = clanTeams.replace(/,\],"clanDefence_heroes"/g,'],"clanDefence_heroes"');
                                clanTeams = clanTeams.replace(/"\d+":\{"id":\d+,"level":\d+,"star":\d+,"element":"\w+","elementSpiritLevel":\d+,"elementSpiritStar":\d+,"power":(\d+)\}/g,'$1');
                                clanTeams = clanTeams.replace(/\{"units":\{(.*?)\}/g,'[$1]');
                                clanTeams = clanTeams.replace(/"banner":null\}/g,'"pet":0,"banner":[0,0,0]');
                                clanTeams = clanTeams.replace(/"banner":\{"id":\d+,"slots":[\[\{](.*?)[\]\}]\}\}/g,function (match, p1, offset, string) {
                                    var resultString = p1.replace(/"\d+":/g,'');
                                    if (resultString == '') { resultString = "0"; }
                                    var resultStringArr = resultString.split(',');
                                    while (resultStringArr.length < 3) { // выводит 0, затем 1, затем 2
                                        resultStringArr.push(0);
                                    }
                                    resultString = resultStringArr.join();
                                    return '"pet":0,"banner":['+resultString+']';
                                });
                                clanTeams = clanTeams.replace(/"\d+":\{"id":\d+,"level":\d+,"color":\d+,"star":\d+,"power":(\d+)[\]\}]/g,'$1');
                                clanTeams = clanTeams.replace(/,"\d+":\{"id":\d+,"level":\d+,"color":\d+,"star":\d+,"type":"pet","power":(\d+)\}\},"pet":0/g,'],"pet":$1');
                                clanTeams = clanTeams.replace(/\},"pet":0/g,'],"pet":0');
                                GM.setValue("clanTeams", clanTeams);
                                //console.log(clanTeams);
                            }
                            //My Heroes
                            if (item.ident == 'heroGetAll'){
                                console.log("My Heroes");
                                var heroGetAll = JSON.stringify(item.result.response);
                                heroGetAll = heroGetAll.replace(/^\{/g,'[');
                                heroGetAll = heroGetAll.replace(/\}$/g,']');
                                heroGetAll = heroGetAll.replace(/"\d+":\{"id"/g,'{"id"');
                                heroGetAll = heroGetAll.replace(/"slots":[\{\[].*?[\}\]],/g,'');
                                heroGetAll = heroGetAll.replace(/"skills":\{(.*?)\}/g,function (match, p1, offset, string) {
                                    var resultString = p1.replace(/"\d+":(\d+)/g,'$1');
                                    return '"skills":"'+resultString+'"';
                                });
                                heroGetAll = heroGetAll.replace(/"skins":\{(.*?)\}/g,function (match, p1, offset, string) {
                                    var resultString = p1.replace(/"(\d+)":(\d+)/g,'$1-$2');
                                    return '"skins":"'+resultString+'"';
                                });
                                heroGetAll = heroGetAll.replace(/"skins":\[\]/g,'"skins":""');
                                heroGetAll = heroGetAll.replace(/\{"level":(\d+),"star":(\d+)\}/g,'"$2-$1"');
                                heroGetAll = heroGetAll.replace(/"ascensions":\{"\d+":(.*?)\}/g,'"ascensions":$1');
                                heroGetAll = heroGetAll.replace(/"titanCoinsSpent":.*?,/g,'');
                                heroGetAll = heroGetAll.replace(/"currentSkin":\d+,/g,'');
                                heroGetAll = heroGetAll.replace(/"scale":\d+,/g,'');
                                heroGetAll = heroGetAll.replace(/"petId":\d+,/g,'');
                                GM.setValue("heroGetAll", heroGetAll);
                                //console.log(heroGetAll);
                            }
                            //clanGetInfo
                            if (item.ident == 'clanGetInfo'){
                                console.log("Guild Members clanGetInfo");
                                var guild_members = {};
                                for (const [key, value] of Object.entries(item.result.response.clan.members)) {
                                    guild_members[key] = {'id':value.id,'name':value.name,'level':value.level,'lastLoginTime':value.lastLoginTime};
                                }
                                //console.log(JSON.stringify(guild_members));
                                GM.setValue("guild_members", JSON.stringify(guild_members));
                                var clanMembers = JSON.stringify(item.result.response.clan.members);
                                clanMembers = clanMembers.replace(/^\{/g,'[');
                                clanMembers = clanMembers.replace(/\}$/g,']');
                                clanMembers = clanMembers.replace(/"\d+":\{"id"/g,'{"id"');
                                GM.setValue("clanMembers", clanMembers);
                                //console.log(clanMembers);
                            }
                            //guild war enemySlots
                            if ("enemySlots" in item.result.response && typeof item.result.response.enemySlots === 'object' && item.result.response.enemySlots !== null){
                                console.log("Guild War Enemy Slots");
                                var enemySlots = JSON.stringify(item.result.response.enemySlots);
                                enemySlots = enemySlots.replace(/^\{/g,'[');
                                enemySlots = enemySlots.replace(/\}$/g,']');
                                enemySlots = enemySlots.replace(/"(\d+)":\{"team":\[\],"attackerId":.*?\}/g,'{"idSlot":"$1","typeSlot":"null","team":[0,0,0,0,0,0],"id":"null","name":"null"}');
                                enemySlots = enemySlots.replace(/\{*?"\d+":\{"state":.*?"power":(\d+),"type":"(.*?)".*?\}+/g,'{"power":$1,"type":"$2"}');
                                enemySlots = enemySlots.replace(/"(\d+)":\{"team":\[\{"power":(\d+),"type":"(.*?)"\}(.*?\]),"attackerId":.*?"id":"(\d+)","name":"(.*?)".*?pointsFarmed":(\d+),.*?\}/g,'{"idSlot":"$1","typeSlot":"$3","team":[{"power":$2,"type":"$3"}$4,"id":"$5","name":"$6","pointsFarmed":"$7"}');
                                enemySlots = enemySlots.replace(/\{"power":(.*?),"type":".*?"\}/g,'$1');
                                GM.setValue("enemySlots", enemySlots);
                                //console.log(enemySlots);
                            }
                            //guild war ourSlots
                            if ("ourSlots" in item.result.response && typeof item.result.response.ourSlots === 'object' && item.result.response.ourSlots !== null){
                                console.log("Guild War Enemy Slots");
                                var ourSlots = JSON.stringify(item.result.response.ourSlots);
                                ourSlots = ourSlots.replace(/^\{/g,'[');
                                ourSlots = ourSlots.replace(/\}$/g,']');
                                ourSlots = ourSlots.replace(/"(\d+)":\{"team":\[\],"attackerId":.*?\}/g,'{"idSlot":"$1","typeSlot":"null","team":[0,0,0,0,0,0],"id":"null","name":"null"}');
                                ourSlots = ourSlots.replace(/\{*?"\d+":\{"state":.*?"power":(\d+),"type":"(.*?)".*?\}+/g,'{"power":$1,"type":"$2"}');
                                ourSlots = ourSlots.replace(/"(\d+)":\{"team":\[\{"power":(\d+),"type":"(.*?)"\}(.*?\]),"attackerId":.*?"id":"(\d+)","name":"(.*?)".*?pointsFarmed":(\d+),.*?\}/g,'{"idSlot":"$1","typeSlot":"$3","team":[{"power":$2,"type":"$3"}$4,"id":"$5","name":"$6","pointsFarmed":"$7"}');
                                ourSlots = ourSlots.replace(/\{"power":(.*?),"type":".*?"\}/g,'$1');
                                GM.setValue("ourSlots", ourSlots);
                                //console.log(ourSlots);
                            }
                            //guild members
                            //if ("clan" in item.result.response && typeof item.result.response.clan === 'object' && item.result.response.clan !== null && "members" in item.result.response.clan){
                            //    console.log("Guild Members");
                            //    var clanMembers = JSON.stringify(item.result.response.clan.members);
                            //    clanMembers = clanMembers.replace(/^\{/g,'[');
                            //    clanMembers = clanMembers.replace(/\}$/g,']');
                            //    clanMembers = clanMembers.replace(/"\d+":\{"id"/g,'{"id"');
                            //    GM.setValue("clanMembers", clanMembers);
                            //    //console.log(clanMembers);
                            //}
                            //guild stat
                            if ("stat" in item.result.response && Array.isArray(item.result.response.stat)){
                                console.log("Guild Stats");
                                var clanStats = JSON.stringify(item.result.response.stat);
                                GM.setValue("clanStats", clanStats);
                                //console.log(clanStats);
                            }
                            //console.log(item.result);
                        }
                    }
                });
                //console.log(this.responseText);
            }
        }
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && (this.responseType == 'json' || this.responseType == '') && this.status == 200 && this.responseURL == "https://heroes-wb.nextersglobal.com/api/") {
                    let jsonResponse = this.response;
                    if (typeof jsonResponse === 'string'){
                        jsonResponse = JSON.parse(jsonResponse);
                    }
                    setTimeout(jsonResponseHandler, 1, jsonResponse);
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
    function jsonToCSV(data){
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        function replacerArrayCSV(match, p1, offset, string) {
            var resultArrayCSV = p1.replace(/"/g,'');
            //console.log(resultArrayCSV);
            return '"'+resultArrayCSV+'"';
        }
        var csv = [
            header.join(','), // header row first
            ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n');

        csv = csv.replace(/\[(.*?)\]/g,replacerArrayCSV);
        csv = csv.replace(/\{(.*?)\}/g,replacerArrayCSV);
        return csv;
    };
    GM_registerMenuCommand('Copy Last Guild-Power-GW-CSV', async () => {
        let count_after = await GM.getValue('clanTeams');
        GM_setClipboard(jsonToCSV(JSON.parse(count_after)));
    });
    GM_registerMenuCommand('Copy Last Guild-Stats-CSV', async () => {
        let guild_members = JSON.parse(await GM.getValue('guild_members'));
        let clanStats = JSON.parse(await GM.getValue('clanStats'));
        let newGuildMembers = [];
        for (const [key, value] of Object.entries(clanStats)) {
            newGuildMembers.push ({
                'id':guild_members[value.id].id,
                'name':guild_members[value.id].name,
                'level':guild_members[value.id].level,
                'lastLoginTime':guild_members[value.id].lastLoginTime,
                'activity':value.activity,
                'dungeonActivity':value.dungeonActivity,
                'adventureStat':value.adventureStat,
                'clanWarStat':value.clanWarStat,
                'clanGifts':value.clanGifts,
                'prestigeStat':value.prestigeStat
            });
        }
        //console.log(JSON.stringify(newGuildMembers));
        //console.log(clanMembers);
        GM_setClipboard(jsonToCSV(newGuildMembers));
    });
    //GM_registerMenuCommand('Copy Last clanStatsGifts', async () => {
    //    let count_after = await GM.getValue('clanStats');
    //    GM_setClipboard(jsonToCSV(JSON.parse(count_after)));
    //});
    GM_registerMenuCommand('Copy Last GW-Enemy-CSV', async () => {
        let count_after = await GM.getValue('enemySlots');
        GM_setClipboard(jsonToCSV(JSON.parse(count_after)));
    });
    GM_registerMenuCommand('Copy Last GW-Guild-CSV', async () => {
        let count_after = await GM.getValue('ourSlots');
        GM_setClipboard(jsonToCSV(JSON.parse(count_after)));
    });
    GM_registerMenuCommand('Copy Last All-You-Heroes-CSV', async () => {
        let count_after = await GM.getValue('heroGetAll');
        GM_setClipboard(jsonToCSV(JSON.parse(count_after)));
    });
})();