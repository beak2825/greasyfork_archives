// ==UserScript==
// @name		   hwmTransporter
// @author		   Tamozhnya1
// @namespace	   Tamozhnya1
// @version		   13.6
// @description	   Перемещения по карте, поиск работы и засады с любой страницы
// @include		   *.heroeswm.ru/*
// @include		   *.lordswm.com/*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/465372/hwmTransporter.user.js
// @updateURL https://update.greasyfork.org/scripts/465372/hwmTransporter.meta.js
// ==/UserScript==

if(!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") > -1)) {
    this.GM_getValue = function(key, def) { return localStorage[key] || def; };
    this.GM_setValue = function(key, value) { localStorage[key] = value; };
    this.GM_deleteValue = function(key) { return delete localStorage[key]; };
}
this.GM_listValues = this.GM_listValues || function() { return Object.keys(localStorage); };
const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
if(!playerIdMatch) {
    return;
}
const PlayerId = playerIdMatch[1];
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const ChallengeState = { Thrown: 1, Battle: 2 };
var finalResultDiv;
const isHeartOnPage = document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const mooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");

// Граф всех возможных путей перемещения по карте
const routes = [null,
[null,null,["1-2",1],["1-3",1],["1-4",1.4],["1-5",1],["1-3-6",2],["1-7",1.4],["1-8",1],["1-3-9",2.4],["1-5-10",2],["1-11",1.4],["1-12",1.4],["1-8-13",2.4],["1-2-14",2],["1-2-15",2.4],["1-4-16",2.8],["1-2-14-17",3],["1-2-14-18",3.4],["1-5-19",2.4],["1-5-10-20",3.4],["1-5-19-21",3.8],["1-5-10-20-22",4.8],["1-12-23",2.8],["1-3-24",2.4],null,["1-5-26",2.4],["1-8-27",2]],
[null,["2-1",1],null,["2-3",1.4],["2-4",1],["2-5",1.4],["2-3-6",2.4],["2-1-7",2.4],["2-1-8",2],["2-3-9",2.8],["2-5-10",2.4],["2-11",1],["2-1-12",2.4],["2-1-8-13",3.4],["2-14",1],["2-15",1.4],["2-4-16",2.4],["2-14-17",2],["2-14-18",2.4],["2-11-19",2],["2-11-19-20",3],["2-11-19-21",3.4],["2-11-19-20-22",4.4],["2-3-9-23",3.8],["2-4-24",2],null,["2-5-26",2.8],["2-1-8-27",3]],
[null,["3-1",1],["3-2",1.4],null,["3-4",1],["3-1-5",2],["3-6",1],["3-1-7",2.4],["3-8",1.4],["3-9",1.4],["3-1-5-10",3],["3-1-11",2.4],["3-12",1],["3-12-13",2],["3-2-14",2.4],["3-4-15",2],["3-4-16",2.4],["3-2-14-17",3.4],["3-4-15-18",3],["3-1-5-19",3.4],["3-1-5-10-20",4.4],["3-1-5-19-21",4.8],["3-1-5-19-21-22",5.8],["3-9-23",2.4],["3-24",1.4],null,["3-1-5-26",3.4],["3-8-27",2.4]],
[null,["4-1",1.4],["4-2",1],["4-3",1],null,["4-1-5",2.4],["4-6",1.4],["4-1-7",2.8],["4-1-8",2.4],["4-3-9",2.4],["4-1-5-10",3.4],["4-2-11",2],["4-3-12",2],["4-3-12-13",3],["4-14",1.4],["4-15",1],["4-16",1.4],["4-14-17",2.4],["4-15-18",2],["4-2-11-19",3],["4-2-11-19-20",4],["4-2-11-19-21",4.4],["4-2-11-19-20-22",5.4],["4-3-9-23",3.4],["4-24",1],null,["4-1-5-26",3.8],["4-1-8-27",3.4]],
[null,["5-1",1],["5-2",1.4],["5-1-3",2],["5-1-4",2.4],null,["5-1-3-6",3],["5-7",1],["5-8",1.4],["5-1-3-9",3.4],["5-10",1],["5-11",1],["5-1-12",2.4],["5-8-13",2.8],["5-2-14",2.4],["5-2-15",2.8],["5-1-4-16",3.8],["5-2-14-17",3.4],["5-2-14-18",3.8],["5-19",1.4],["5-10-20",2.4],["5-19-21",2.8],["5-10-20-22",3.8],["5-1-12-23",3.8],["5-1-3-24",3.4],null,["5-26",1.4],["5-7-27",2.4]],
[null,["6-3-1",2],["6-3-2",2.4],["6-3",1],["6-4",1.4],["6-3-1-5",3],null,["6-3-1-7",3.4],["6-3-8",2.4],["6-9",1],["6-3-1-5-10",4],["6-3-1-11",3.4],["6-12",1.4],["6-9-13",2.4],["6-4-14",2.8],["6-4-15",2.4],["6-4-16",2.8],["6-4-14-17",3.8],["6-4-15-18",3.4],["6-3-1-5-19",4.4],["6-3-1-5-10-20",5.4],["6-3-1-5-19-21",5.8],["6-3-1-5-10-20-22",6.8],["6-9-23",2],["6-24",1],null,["6-3-1-5-26",4.4],["6-12-27",2.8]],
[null,["7-1",1.4],["7-1-2",2.4],["7-1-3",2.4],["7-1-4",2.8],["7-5",1],["7-1-3-6",3.4],null,["7-8",1],["7-8-12-9",3],["7-10",1.4],["7-5-11",2],["7-8-12",2],["7-8-13",2.4],["7-1-2-14",3.4],["7-1-2-15",3.8],["7-1-4-16",4.2],["7-1-2-14-17",4.4],["7-1-2-14-18",4.8],["7-5-19",2.4],["7-10-20",2.8],["7-5-19-21",3.8],["7-10-20-22",4.2],["7-8-12-23",3.4],["7-1-3-24",3.8],null,["7-26",1],["7-27",1.4]],
[null,["8-1",1],["8-1-2",2],["8-3",1.4],["8-1-4",2.4],["8-5",1.4],["8-3-6",2.4],["8-7",1],null,["8-12-9",2],["8-5-10",2.4],["8-1-11",2.4],["8-12",1],["8-13",1.4],["8-1-2-14",3],["8-1-2-15",3.4],["8-1-4-16",3.8],["8-1-2-14-17",4],["8-1-2-14-18",4.4],["8-5-19",2.8],["8-5-10-20",3.8],["8-5-19-21",4.2],["8-5-10-20-22",5.2],["8-12-23",2.4],["8-3-24",2.8],null,["8-7-26",2],["8-27",1]],
[null,["9-3-1",2.4],["9-3-2",2.8],["9-3",1.4],["9-3-4",2.4],["9-3-1-5",3.4],["9-6",1],["9-12-8-7",3],["9-12-8",2],null,["9-3-1-5-10",4.4],["9-3-1-11",3.8],["9-12",1],["9-13",1.4],["9-3-2-14",3.8],["9-3-4-15",3.4],["9-3-4-16",3.8],["9-3-2-14-17",4.8],["9-3-4-15-18",4.4],["9-3-1-5-19",4.8],["9-3-1-5-10-20",5.8],["9-3-1-5-19-21",6.2],["9-3-1-5-10-20-22",7.2],["9-23",1],["9-6-24",2],null,["9-12-8-7-26",4],["9-12-27",2.4]],
[null,["10-5-1",2],["10-5-2",2.4],["10-5-1-3",3],["10-5-1-4",3.4],["10-5",1],["10-5-1-3-6",4],["10-7",1.4],["10-5-8",2.4],["10-5-1-3-9",4.4],null,["10-11",1.4],["10-5-1-12",3.4],["10-5-8-13",3.8],["10-11-14",2.8],["10-5-2-15",3.8],["10-5-1-4-16",4.8],["10-11-14-17",3.8],["10-11-14-18",4.2],["10-19",1],["10-20",1.4],["10-19-21",2.4],["10-20-22",2.8],["10-5-1-12-23",4.8],["10-5-1-3-24",4.4],null,["10-26",1],["10-7-27",2.8]],
[null,["11-1",1.4],["11-2",1],["11-1-3",2.4],["11-2-4",2],["11-5",1],["11-1-3-6",3.4],["11-5-7",2],["11-1-8",2.4],["11-1-3-9",3.8],["11-10",1.4],null,["11-1-12",2.8],["11-1-8-13",3.8],["11-14",1.4],["11-2-15",2.4],["11-2-4-16",3.4],["11-14-17",2.4],["11-14-18",2.8],["11-19",1],["11-19-20",2],["11-19-21",2.4],["11-19-20-22",3.4],["11-1-12-23",4.2],["11-2-4-24",3],null,["11-5-26",2.4],["11-5-7-27",3.4]],
[null,["12-1",1.4],["12-1-2",2.4],["12-3",1],["12-3-4",2],["12-1-5",2.4],["12-6",1.4],["12-8-7",2],["12-8",1],["12-9",1],["12-1-5-10",3.4],["12-1-11",2.8],null,["12-13",1],["12-1-2-14",3.4],["12-3-4-15",3],["12-3-4-16",3.4],["12-1-2-14-17",4.4],["12-3-4-15-18",4],["12-1-5-19",3.8],["12-1-5-10-20",4.8],["12-1-5-19-21",5.2],["12-1-5-10-20-22",6.2],["12-23",1.4],["12-3-24",2.4],null,["12-8-7-26",3],["12-27",1.4]],
[null,["13-8-1",2.4],["13-8-1-2",3.4],["13-12-3",2],["13-12-3-4",3],["13-8-5",2.8],["13-9-6",2.4],["13-8-7",2.4],["13-8",1.4],["13-9",1.4],["13-8-5-10",3.8],["13-8-1-11",3.8],["13-12",1],null,["13-8-1-2-14",4.4],["13-12-3-4-15",4],["13-12-3-4-16",4.4],["13-8-1-2-14-17",5.4],["13-12-3-4-15-18",5],["13-8-5-19",4.2],["13-8-5-10-20",5.2],["13-8-5-19-21",5.6],["13-8-5-10-20-22",6.6],["13-23",1],["13-9-6-24",3.4],null,["13-8-7-26",3.4],["13-27",1]],
[null,["14-2-1",2],["14-2",1],["14-2-3",2.4],["14-4",1.4],["14-2-5",2.4],["14-4-6",2.8],["14-2-1-7",3.4],["14-2-1-8",3],["14-2-3-9",3.8],["14-11-10",2.8],["14-11",1.4],["14-2-1-12",3.4],["14-2-1-8-13",4.4],null,["14-15",1],["14-15-16",2],["14-17",1],["14-18",1.4],["14-11-19",2.4],["14-11-19-20",3.4],["14-11-19-21",3.8],["14-11-19-20-22",4.8],["14-2-3-9-23",4.8],["14-4-24",2.4],null,["14-2-5-26",3.8],["14-2-1-8-27",4]],
[null,["15-2-1",2.4],["15-2",1.4],["15-4-3",2],["15-4",1],["15-2-5",2.8],["15-4-6",2.4],["15-2-1-7",3.8],["15-2-1-8",3.4],["15-4-3-9",3.4],["15-2-5-10",3.8],["15-2-11",2.4],["15-4-3-12",3],["15-4-3-12-13",4],["15-14",1],null,["15-16",1],["15-17",1.4],["15-18",1],["15-2-11-19",3.4],["15-2-11-19-20",4.4],["15-2-11-19-21",4.8],["15-2-11-19-21-22",5.8],["15-4-3-9-23",4.4],["15-24",1.4],null,["15-2-5-26",4.2],["15-2-1-8-27",4.4]],
[null,["16-4-1",2.8],["16-4-2",2.4],["16-4-3",2.4],["16-4",1.4],["16-4-1-5",3.8],["16-4-6",2.8],["16-4-1-7",4.2],["16-4-1-8",3.8],["16-4-3-9",3.8],["16-4-1-5-10",4.8],["16-4-2-11",3.4],["16-4-3-12",3.4],["16-4-3-12-13",4.4],["16-15-14",2],["16-15",1],null,["16-15-17",2.4],["16-18",1.4],["16-4-2-11-19",4.4],["16-4-2-11-19-20",5.4],["16-4-2-11-19-21",5.8],["16-4-2-11-19-20-22",6.8],["16-4-3-9-23",4.8],["16-4-24",2.4],null,["16-4-1-5-26",5.2],["16-4-1-8-27",4.8]],
[null,["17-14-2-1",3],["17-14-2",2],["17-14-2-3",3.4],["17-14-4",2.4],["17-14-2-5",3.4],["17-14-4-6",3.8],["17-14-2-1-7",4.4],["17-14-2-1-8",4],["17-14-2-3-9",4.8],["17-14-11-10",3.8],["17-14-11",2.4],["17-14-2-1-12",4.4],["17-14-2-1-8-13",5.4],["17-14",1],["17-15",1.4],["17-15-16",2.4],null,["17-18",1],["17-14-11-19",3.4],["17-14-11-19-20",4.4],["17-14-11-19-21",4.8],["17-14-11-19-21-22",5.8],["17-14-2-3-9-23",5.8],["17-15-24",2.8],null,["17-14-2-5-26",4.8],["17-14-2-1-8-27",5]],
[null,["18-14-2-1",3.4],["18-14-2",2.4],["18-15-4-3",3],["18-15-4",2],["18-14-2-5",3.8],["18-15-4-6",3.4],["18-14-2-1-7",4.8],["18-14-2-1-8",4.4],["18-15-4-3-9",4.4],["18-14-11-10",4.2],["18-14-11",2.8],["18-15-4-3-12",4],["18-15-4-3-12-13",5],["18-14",1.4],["18-15",1],["18-16",1.4],["18-17",1],null,["18-14-11-19",3.8],["18-14-11-19-20",4.8],["18-14-11-19-21",5.2],["18-14-11-19-20-22",6.2],["18-15-4-3-9-23",5.4],["18-15-24",2.4],null,["18-14-2-5-26",5.2],["18-14-2-1-8-27",5.4]],
[null,["19-5-1",2.4],["19-11-2",2],["19-5-1-3",3.4],["19-11-2-4",3],["19-5",1.4],["19-5-1-3-6",4.4],["19-5-7",2.4],["19-5-8",2.8],["19-5-1-3-9",4.8],["19-10",1],["19-11",1],["19-5-1-12",3.8],["19-5-8-13",4.2],["19-11-14",2.4],["19-11-2-15",3.4],["19-11-2-4-16",4.4],["19-11-14-17",3.4],["19-11-14-18",3.8],null,["19-20",1],["19-21",1.4],["19-20-22",2.4],["19-5-1-12-23",5.2],["19-11-2-4-24",4],null,["19-10-26",2],["19-5-7-27",3.8]],
[null,["20-10-5-1",3.4],["20-19-11-2",3],["20-10-5-1-3",4.4],["20-19-11-2-4",4],["20-10-5",2.4],["20-10-5-1-3-6",5.4],["20-10-7",2.8],["20-10-5-8",3.8],["20-10-5-1-12-9",5.8],["20-10",1.4],["20-19-11",2],["20-10-5-1-12",4.8],["20-10-5-8-13",5.2],["20-19-11-14",3.4],["20-19-11-2-15",4.4],["20-19-11-2-4-16",5.4],["20-19-11-14-17",4.4],["20-19-11-14-18",4.8],["20-19",1],null,["20-21",1],["20-22",1.4],["20-10-5-1-12-23",6.2],["20-19-11-2-4-24",5],null,["20-10-26",2.4],["20-10-7-27",4.2]],
[null,["21-19-5-1",3.8],["21-19-11-2",3.4],["21-19-5-1-3",4.8],["21-19-11-2-4",4.4],["21-19-5",2.8],["21-19-5-1-3-6",5.8],["21-19-5-7",3.8],["21-19-5-8",4.2],["21-19-5-1-3-9",6.2],["21-19-10",2.4],["21-19-11",2.4],["21-19-5-1-12",5.2],["21-19-5-8-13",5.6],["21-19-11-14",3.8],["21-19-11-2-15",4.8],["21-19-11-2-4-16",5.8],["21-19-11-14-17",4.8],["21-19-11-14-18",5.2],["21-19",1.4],["21-20",1],null,["21-22",1],["21-19-5-1-12-23",6.6],["21-19-11-2-4-24",5.4],null,["21-19-10-26",3.4],["21-19-5-7-27",5.2]],
[null,["22-20-10-5-1",4.8],["22-20-19-11-2",4.4],["22-20-10-5-1-3",5.8],["22-20-19-11-2-4",5.4],["22-20-10-5",3.8],["22-20-10-5-1-3-6",6.8],["22-20-10-7",4.2],["22-20-10-5-8",5.2],["22-20-10-5-1-12-9",7.2],["22-20-10",2.8],["22-20-19-11",3.4],["22-20-10-5-1-12",6.2],["22-20-10-5-8-13",6.6],["22-20-19-11-14",4.8],["22-20-19-11-2-15",5.8],["22-20-19-11-2-4-16",6.8],["22-20-19-11-14-17",5.8],["22-20-19-11-14-18",6.2],["22-20-19",2.4],["22-20",1.4],["22-21",1],null,["22-20-10-5-1-12-23",7.6],["22-20-19-11-2-4-24",6.4],null,["22-20-10-26",3.8],["22-20-10-7-27",5.6]],
[null,["23-12-1",2.8],["23-9-3-2",3.8],["23-9-3",2.4],["23-9-3-4",3.4],["23-12-1-5",3.8],["23-9-6",2],["23-12-8-7",3.4],["23-12-8",2.4],["23-9",1],["23-12-1-5-10",4.8],["23-12-1-11",4.2],["23-12",1.4],["23-13",1],["23-9-3-2-14",4.8],["23-9-3-4-15",4.4],["23-9-3-4-16",4.8],["23-9-3-2-14-17",5.8],["23-9-3-4-15-18",5.4],["23-12-1-5-19",5.2],["23-12-1-5-10-20",6.2],["23-12-1-5-19-21",6.6],["23-12-1-5-10-20-22",7.6],null,["23-9-6-24",3],null,["23-12-8-7-26",4.4],["23-13-27",2]],
[null,["24-3-1",2.4],["24-4-2",2],["24-3",1.4],["24-4",1],["24-3-1-5",3.4],["24-6",1],["24-3-1-7",3.8],["24-3-8",2.8],["24-6-9",2],["24-3-1-5-10",4.4],["24-4-2-11",3],["24-3-12",2.4],["24-6-9-13",3.4],["24-4-14",2.4],["24-15",1.4],["24-4-16",2.4],["24-15-17",2.8],["24-15-18",2.4],["24-4-2-11-19",4],["24-4-2-11-19-20",5],["24-4-2-11-19-21",5.4],["24-4-2-11-19-20-22",6.4],["24-6-9-23",3],null,null,["24-3-1-5-26",4.8],["24-3-8-27",3.8]],
[],
[null,["26-5-1",2.4],["26-5-2",2.8],["26-5-1-3",3.4],["26-5-1-4",3.8],["26-5",1.4],["26-5-1-3-6",4.4],["26-7",1],["26-7-8",2],["26-7-8-12-9",4],["26-10",1],["26-5-11",2.4],["26-7-8-12",3],["26-7-8-13",3.4],["26-5-2-14",3.8],["26-5-2-15",4.2],["26-5-1-4-16",5.2],["26-5-2-14-17",4.8],["26-5-2-14-18",5.2],["26-10-19",2],["26-10-20",2.4],["26-10-19-21",3.4],["26-10-20-22",3.8],["26-7-8-12-23",4.4],["26-5-1-3-24",4.8],null,null,["26-7-27",2.4]],
[null,["27-8-1",2],["27-8-1-2",3],["27-8-3",2.4],["27-8-1-4",3.4],["27-7-5",2.4],["27-12-6",2.8],["27-7",1.4],["27-8",1],["27-12-9",2.4],["27-7-10",2.8],["27-7-5-11",3.4],["27-12",1.4],["27-13",1],["27-8-1-2-14",4],["27-8-1-2-15",4.4],["27-8-1-4-16",4.8],["27-8-1-2-14-17",5],["27-8-1-2-14-18",5.4],["27-7-5-19",3.8],["27-7-10-20",4.2],["27-7-5-19-21",5.2],["27-7-10-20-22",5.6],["27-13-23",2],["27-8-3-24",3.8],null,["27-7-26",2.4]]];
// Номера, названия и координаты секторов
const locations = {
    1: [50,50,"Empire Capital","EmC","Столица Империи"],
    2: [51,50,"East River","EsR","Восточная Река"],
    3: [50,49,"Tiger Lake","TgL","Тигриное Озеро"],
    4: [51,49,"Rogues' Wood","RgW","Лес Разбойников"],
    5: [50,51,"Wolf Dale","WoD","Долина Волков"],
    6: [50,48,"Peaceful Camp","PcC","Мирный Лагерь"],
    7: [49,51,"Lizard Lowland","LzL","Равнина Ящеров"],
    8: [49,50,"Green Wood","GrW","Зеленый Лес"],
    9: [49,48,"Eagle Nest","EgN","Орлиное Гнездо"],
    10: [50,52,"Portal Ruins","PoR","Руины Портала"],
    11: [51,51,"Dragons' Caves","DrC","Пещеры Драконов"],
    12: [49,49,"Shining Spring","ShS","Сияющий Родник"],
    13: [48,49,"Sunny City","SnC","Солнечный Город"],
    14: [52,50,"Magma Mines","MgM","Магма Шахты"],
    15: [52,49,"Bear Mountain","BrM","Медвежья Гора"],
    16: [52,48,"Fairy Trees","FrT","Магический Лес"],
    17: [53,50,"Harbour City","HrC","Портовый Город"],
    18: [53,49,"Mythril Coast","MfC","Мифриловый Берег"],
    19: [51,52,"Great Wall","GtW","Великая Стена"],
    20: [51,53,"Titans' Valley","TiV","Равнина Титанов"],
    21: [52,53,"Fishing Village","FsV","Рыбачье село"],
    22: [52,54,"Kingdom Castle","KiC","Замок Королевства"],
    23: [48,48,"Ungovernable Steppe","UnS","Непокорная Степь"],
    24: [51,48,"Crystal Garden","CrG","Кристальный Сад"],
    25: [53,52,"East Island","EsI","Восточный Остров"],
    26: [49,52,"The Wilderness","ThW","Дикие земли"],
    27: [48,50,"Sublime Arbor","SbA","Великое Древо"],
    101: [48, 53, "Watchers' guild", "", "Гильдия стражей", { Url: "/task_guild.php", Color: "DarkGoldenRod" }],
    102: [48, 54, "Leaders' Guild", "", "Гильдия лидеров", { Url: "/leader_guild.php", Color: "DarkGoldenRod" }],
    103: [49, 54, "Adventurers' guild", "", "Гильдия искателей", { Url: "/campaign_list.php", Color: "DarkGoldenRod" }],
    104: [50, 54, "Thieves' guild", "", "Гильдия воров", { Url: "/thief_guild.php", Color: "DarkGoldenRod" }],
    105: [51, 54, "Smith", "", "Кузница", { Url: "/mod_workbench.php?type=repair", Color: "DarkGoldenRod" }],
    106: [53, 51, "Repeat last ambush", "", "Повторить последнюю засаду"],
    107: [52, 51, "Find nearest production", "", "Найти ближайшее производство"],
    108: [53, 48, "Toggle top settings", "", "Переключить верхние настройки"],
    109: [53, 54, "Toggle bottom settings", "", "Переключить нижние настройки"]
};
const objectLocations = { 0 : 0
, 5: 1, 9: 1, 6: 1, 7: 1, 4: 1, 3: 1, 8: 1, 165: 1, 10: 1, 11: 1, 12: 1, 32: 1, 34: 1, 38: 1
, 238: 2, 300: 2, 75: 2, 26: 2, 258: 2, 279: 2, 25: 2, 23: 2, 33: 2, 342: 2, 24: 2, 36: 2, 87: 2, 89: 2, 321: 2, 28: 2
, 239: 3, 16: 3, 15: 3, 13: 3, 259: 3, 343: 3, 280: 3, 84: 3, 301: 3, 224: 3, 27: 3, 39: 3, 14: 3, 31: 3, 35: 3, 322: 3
, 344: 4, 281: 4, 302: 4, 260: 4, 19: 4, 21: 4, 22: 4, 323: 4, 18: 4, 20: 4, 30: 4, 37: 4, 78: 4, 90: 4, 225: 4, 240: 4
, 282: 5, 74: 5, 226: 5, 43: 5, 44: 5, 303: 5, 85: 5, 45: 5, 46: 5, 47: 5, 48: 5, 86: 5, 241: 5, 261: 5, 324: 5, 345: 5
, 50: 6, 283: 6, 262: 6, 304: 6, 73: 6, 49: 6, 141: 6, 51: 6, 79: 6, 53: 6, 54: 6, 55: 6, 52: 6, 82: 6, 325: 6, 346: 6
, 56: 7, 326: 7, 59: 7, 64: 7, 284: 7, 58: 7, 60: 7, 61: 7, 63: 7, 80: 7, 83: 7, 242: 7, 263: 7, 57: 7, 305: 7, 347: 7
, 285: 8, 243: 8, 68: 8, 88: 8, 69: 8, 67: 8, 71: 8, 72: 8, 76: 8, 77: 8, 81: 8, 70: 8, 264: 8, 306: 8, 327: 8, 348: 8
, 244: 9, 328: 9, 227: 9, 265: 9, 286: 9, 94: 9, 349: 9, 139: 9, 307: 9, 101: 9, 98: 9, 95: 9, 119: 9, 120: 9, 140: 9, 97: 9
, 163: 10, 329: 10, 350: 10, 99: 10, 100: 10, 102: 10, 118: 10, 211: 10, 217: 10, 287: 10, 308: 10, 93: 10, 228: 10, 266: 10, 245: 10, 92: 10
, 167: 11, 169: 11, 168: 11, 210: 11, 172: 11, 170: 11, 209: 11, 171: 11, 218: 11, 229: 11, 246: 11, 267: 11, 288: 11, 309: 11, 330: 11, 351: 11
, 247: 12, 331: 12, 289: 12, 219: 12, 117: 12, 108: 12, 111: 12, 110: 12, 109: 12, 112: 12, 113: 12, 114: 12, 230: 12, 268: 12, 310: 12, 352: 12
, 104: 13, 311: 13, 269: 13, 220: 13, 116: 13, 248: 13, 332: 13, 106: 13, 107: 13, 115: 13, 213: 13, 231: 13, 103: 13, 290: 13, 105: 13, 353: 13
, 270: 14, 122: 14, 312: 14, 249: 14, 216: 14, 333: 14, 164: 14, 291: 14, 121: 14, 135: 14, 142: 14, 143: 14, 144: 14, 145: 14, 232: 14, 354: 14
, 313: 15, 334: 15, 124: 15, 125: 15, 214: 15, 136: 15, 123: 15, 146: 15, 147: 15, 148: 15, 149: 15, 215: 15, 250: 15, 271: 15, 292: 15, 355: 15
, 335: 16, 233: 16, 272: 16, 251: 16, 126: 16, 134: 16, 153: 16, 151: 16, 127: 16, 152: 16, 150: 16, 212: 16, 221: 16, 293: 16, 314: 16, 356: 16
, 131: 17, 252: 17, 273: 17, 315: 17, 294: 17, 336: 17, 162: 17, 161: 17, 160: 17, 132: 17, 133: 17, 222: 17, 234: 17, 158: 17, 159: 17, 357: 17
, 358: 18, 235: 18, 253: 18, 130: 18, 129: 18, 137: 18, 138: 18, 154: 18, 128: 18, 155: 18, 156: 18, 157: 18, 274: 18, 295: 18, 316: 18, 337: 18
, 192: 19, 202: 19, 179: 19, 173: 19, 193: 19, 194: 19, 195: 19, 201: 19, 178: 19, 203: 19, 254: 19, 275: 19, 296: 19, 317: 19, 338: 19, 359: 19
, 191: 20, 176: 20, 177: 20, 187: 20, 188: 20, 189: 20, 190: 20, 206: 20, 207: 20, 208: 20, 255: 20, 276: 20, 297: 20, 318: 20, 339: 20, 360: 20
, 174: 21, 199: 21, 197: 21, 166: 21, 361: 21, 198: 21, 196: 21, 200: 21, 223: 21, 236: 21, 256: 21, 277: 21, 298: 21, 319: 21, 340: 21, 175: 21
, 186: 22, 184: 22, 320: 22, 185: 22, 183: 22, 362: 22, 182: 22, 180: 22, 204: 22, 205: 22, 237: 22, 257: 22, 278: 22, 299: 22, 341: 22, 181: 22
, 365: 23, 364: 23, 370: 23, 363: 23, 369: 23, 366: 23, 371: 23, 372: 23, 373: 23, 374: 23, 375: 23, 376: 23, 377: 23, 378: 23, 379: 23, 380: 23
, 367: 24, 392: 24, 390: 24, 388: 24, 383: 24, 384: 24, 385: 24, 386: 24, 387: 24, 368: 24, 389: 24, 381: 24, 391: 24, 382: 24, 393: 24, 394: 24
, 395: 26, 409: 26, 399: 26, 397: 26, 398: 26, 400: 26, 401: 26, 402: 26, 403: 26, 404: 26, 405: 26, 406: 26, 407: 26, 408: 26, 396: 26, 410: 26
, 411: 27, 419: 27, 413: 27, 414: 27, 415: 27, 416: 27, 417: 27, 418: 27, 412: 27, 420: 27, 421: 27, 422: 27, 423: 27, 424: 27, 425: 27, 426: 27
 };

const minX = 48;
const maxX = 53;
const minY = 48;
const maxY = 54;
let isInBattle = false;
let tryGetAmbushStateTimer;
const DefaultTravelingTime = 40;
let AmbushMinutesInterval = 60;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const GoTo = isEn ? "Go to" : "Перейти в";
const Second = isEn ? "sec." : "с.";
const YourPremiumMountUntil = isEn ? "Your premium mount  until" : "Ваш премиум транспорт";
const YourMountUntil = isEn ? "Your mount until" : "Ваш транспорт до";
const Until = isEn ? " until " : " до ";
const UndressBeforeMove = isEn ? "Undress before move" : "Раздеться перед перемещением";
const NotUseComplexRoute = isEn ? "Not use complex route" : "Не использовать сложный маршрут";
const HideMapName = isEn ? "Hide map" : "Скрыть карту";
const HideHuntName = isEn ? "Hide hunt" : "Скрыть охоты";
const HideRightBlockName = isEn ? "Hide right block" : "Скрыть правый блок";
const ComplexRouteName = isEn ? "Complex route" : "Сложный маршрут";
const MountUntilName = isEn ? "Mount until" : "Транспорт до";
const BreakTravelingName = isEn ? "Break traveling" : "Прервать путешествие";
const TravelingNotEnabled = isEn ? "Traveling not enabled" : "Путешествие не доступно";
const YouAreInAChallenge = isEn ? "You are in a challenge. Your actions are limited!" : "Вы находитесь в заявке на бой. Ваши действия ограничены!";
const How = isEn ? "How?" : "Как?";
const YouAreHere = isEn ? "You're already here" : "Ты уже здесь";
const AmbushMaySettedOnAdjacentSector = isEn ? "Ambush may setted on adjacent sector" : "Засада ставится на соседний сектор";
const ItIsTooEarly = isEn ? "It is too early" : "Ещё рано";
const Legend = isEn ? "Click: moving, ctrl(mdl)+click: ambush, alt+click: sector info" : "Click: движение, ctrl(mdl)+click: засада, alt+click: просмотр";
const MoveHere = isEn ? "Move here" : "Перейти сюда";
const YouAreInADifferentLocation = isEn ? "You are in a different location." : "Вы находитесь в другом районе.";
const TravelingTimeName = isEn ? "Traveling time" : "Время пути";
const Antithief = isEn ? "Antithief" : "Антивор";
const AmbushingName = isEn ? "You are in ambush" : "Вы в засаде";
const CheckMountName = isEn ? "Check mount" : "Проверить транспорт";
const LoadName = isEn ? "Load" : "Грузить";
const PremiunAccountName = isEn ? "Abu" : "Абу";
const locationNamesLocalizedColumn = isEn ? 2 : 4;
const AmbushResult = { NotFound: 0, Win: 1, Fail: 2 };
const factoryTypes = ["mn", "fc", "sh"];
const Mining = isEn ? "Mining" : "Добыча";
const Machining = isEn ? "Machining" : "Обработка";
const Production = isEn ? "Production" : "Производство";
const PopupAlwaysName = isEn ? "Popup always" : "Всегда всплывающая";
const HideBattlesDayWithName = isEn ? "Hide battles day with..." : "Скрыть день боёв с...";
const FindNearestMiningName = isEn ? "Find nearest mining" : "Найти ближайшую добычу";
const FindNearestManufactureName = isEn ? "Find nearest manufacture" : "Найти ближайшую обработку";
const FindNearestProductionName = isEn ? "Find nearest production" : "Найти ближайшее производство";
const MoveToWorkAfterFindName = isEn ? "Move to work after find" : "Сразу идти на предприятие";
const ShowLocationNumbersName = isEn ? "Show location numbers" : "Номера локаций";
const JobFinding = isEn ? "Job finding" : "Поиск работы";

const win = window.wrappedJSObject || unsafeWindow;
let playerLocationNumber = getPlayerLocationNumber();
if(!playerLocationNumber) {
    return; // При первом запуске скрипта, если мы не на карте, неизвестна текущая локация игрока
}
let MountInfo;
var AmbushMoratoriumPanel;

const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;
const resourcesPath1 = `${location.protocol}//${location.host.replace("www", "dcdn1")}`;
const resourcesPath2 = `${location.protocol}//${location.host.replace("www", "dcdn2")}`;
const resourcesPath3 = `${location.protocol}//${location.host.replace("www", "dcdn3")}`;

main();
async function main(forceGetMountInfo) {
    initUserName();
    // if(location.pathname == "/object-info.php") {
        // const codeInput = document.querySelector("input#code");
        // if(codeInput) {
            // console.log(codeInput)
            // codeInput.dispatchEvent(new MouseEvent('mousedown'))
            // codeInput.focus();
            // codeInput.select();
        // }
    // }
    if(location.pathname == "/home.php" && document.querySelector("img[src*='i/icons/attr_defense.png']") && !document.querySelector("a[href*='home.php?skipn=1']")) {
        setValue("IsDeer", document.querySelector("img[src*='deer2.png']") ? true : false);
        const starImage = document.querySelector("img[src$='i/star_extend.png']") || document.querySelector("img[src$='i/star.png']");
        if(starImage) {
            const abuBlessInfo = starImage.title || starImage.getAttribute("hint");
            const time_prem = /(\d+-\d+-\d+ \d+:\d+)/.exec(abuBlessInfo);
            if(time_prem) {
                const transportEndDate = parseDate(time_prem[1], true).getTime();
                if(!getPlayerBool("IsPremiunAccount") || Math.abs(parseInt(getPlayerValue("TransportEndDate", 0)) - transportEndDate) > 70000) {
                    forceGetMountInfo = true;
                }
            }
        }
    }
    MountInfo = await getMountInfo(forceGetMountInfo);
    AmbushMinutesInterval *= 1 - (MountInfo.IsPremiunAccount ? 0.3 : 0);
    AmbushMinutesInterval *= 1 - (MountInfo.IsDeer ? 0.4 : 0);

    tryGetAmbushState();
    if(!isHeartOnPage) {
        return;
    }
    healthTimer();
    requestServerTime();
    checkActivity();
    setActivity();
    if(/map.php/.test(location.href)) {
        if(mooving) {
            drawStopButton();
            return;
        }
        setPlayerValue("LastObservingLocationNumber", location.search != '' ? getLocationNumberFromMapUrlByXy(location.href) : playerLocationNumber);
        loadFactories();
    }
    drawMap();
    processMoving();
    checkAmbushResult();
    if(location.pathname == '/object-info.php') {
        const objectLocationReference = document.querySelector("center a[href^='map.php?cx='][href*='&cy=']");
        //console.log(`objectLocationReference: ${objectLocationReference}`);
        const moveHereReference = getMoveToObjectReference(location.pathname + location.search, objectLocationReference); // Добавление кнопки перемещения на предприятие
    }
    if(location.pathname == '/ecostat_details.php' || location.pathname == '/home.php') {
        const objs = document.querySelectorAll("a[href*='object-info.php?id=']");
        const doubledHash = [];
        for(let obj of objs) {
            if(!doubledHash.includes(obj.href)) {
                const moveHereReference = getMoveToObjectReference(obj.href, obj);
                doubledHash.push(obj.href);
            }
        }
    }
    if(location.pathname == '/ecostat.php') {
        const table = document.querySelector("div#tableDiv > table")
        observe(table, function() {
            for(const tooltipDiv of document.querySelectorAll("div[name=ecostatDetailsTooltipDiv]")) {
                const objectInfoRefsAll = Array.from(tooltipDiv.querySelectorAll("div#tableDiv tr > td:first-child > a[href^='object-info.php']"));
                objectInfoRefsAll.forEach(x => getMoveToObjectReference(x.href, x));
            }
        });
    }
    if(location.pathname == '/group_wars.php') {
        addMoveToMapObjectReferences();
    }
    if(location.pathname == '/mercenary_guild.php') {
        const colorElement = document.querySelector("font[color='#E65054']");
        if(colorElement?.querySelector("b").innerText == YouAreInADifferentLocation) {
            const lastObservingLocationNumber = parseInt(getPlayerValue("LastObservingLocationNumber", 0));
            if([2, 6, 16, 21].includes(lastObservingLocationNumber)) {
                const ref = getMoveToMapObjectReference(location.href, colorElement, lastObservingLocationNumber);
            } else {
                const nearestLocations = getLocationsSortedByDistance();
                //console.log(`nearestLocations: ${nearestLocations}`);
                for(const nearestLocation of nearestLocations) {
                    if([2, 6, 16, 21].includes(parseInt(nearestLocation))) {
                        const ref = getMoveToMapObjectReference(location.href, colorElement, nearestLocation);
                        break;
                    }
                }
            }
        }
    }
    if(location.pathname == '/pirate_event.php') {
        const tableDiv = document.getElementById("tableDiv");
        addMoveToMapObjectReferences(tableDiv);
    }
    processHouseInfo();
    checkPatrolling();
}
function checkActivity() {
    checkTurnedOn();
    setTimeout(checkActivity, 1000);
}
function setActivity() {
    checkTurnedOn();
    setValue("LastActivityDate", Date.now());
    setTimeout(setActivity, 60 * 1000);
}
function checkTurnedOn() {
    const computerTurnedOn = parseInt(getValue("LastActivityDate", 0)) + 5 * 60 * 1000 < Date.now();
    if(computerTurnedOn) {
        checkAmbushResult(true);
    }
}
function addMoveToMapObjectReferences(element) {
    element = element || document;
    const locationRefs = element.querySelectorAll("a[href^='map.php?cx=']");
    for(let locationRef of locationRefs) {
        const locationNumber = getLocationNumberByCoordinate(getUrlParamValue(locationRef.href, "cx"), getUrlParamValue(locationRef.href, "cy"));
        const ref = getMoveToMapObjectReference(location.href, locationRef, locationNumber);
    }
}
function getObjectLocations() {
    const objs = document.querySelectorAll("a[href*='object-info.php?id=']");
    let absentList = "";
    for(let obj of objs) {
        const objectId = getUrlParamValue(obj.href, "id");
        if(!objectLocations[objectId]) {
            objectLocations[objectId] = playerLocationNumber;
            absentList += `, ${objectId}: ${playerLocationNumber}`;
        }
    }
    if(absentList != "") {
        console.log(absentList);
    }
    //console.log(absentList);
}
function drawStopButton() {
    if(mooving && getPlayerValue("TargetLocationNumber")) {
        const insideMap = document.querySelector("#inside_map");
        const mapMoving = addElement("div", { id: "mapMoving" }, insideMap);
        if((!MountInfo.ComplexRoute || getPlayerBool("IgnoreComplexRoute"))) {
            let targetLocationNumber = parseInt(getPlayerValue("TargetLocationNumber"));
            let route = routes[playerLocationNumber][targetLocationNumber][0];
            let nextLocationNumber = route.split('-')[1];
            if(nextLocationNumber != targetLocationNumber) {
                const stopMovingButton = addElement("div", { id: "stopMovingButton", class: "home_button2 btn_hover2 map_btn_width", style: "width: 300px;", innerHTML: BreakTravelingName }, mapMoving);
                stopMovingButton.addEventListener("click", stopMoving);
            }
        }
        if(getPlayerBool("IsPatrolling")) {
            const togglePatrollingButton = addElement("div", { id: "togglePatrollingButton", class: "home_button2 btn_hover2 map_btn_width", style: "width: 300px;", innerHTML: getPlayerBool("IsPatrolling") ? (isEn ? "Stop patrolling" : "Остановить патрулирование") : (isEn ? "Start patrolling" : "Начать патрулирование") }, mapMoving);
            togglePatrollingButton.addEventListener("click", togglePatrolling);
        }
    }
}
async function toggleAntithief(toggleAntithiefCheckbox) {
    const toggleKey = getPlayerValue("ToggleAntithiefKey");
    if(toggleKey && MountInfo.AntithiefControlled) {
        const toggleVar = toggleAntithiefCheckbox.checked ? "t_on" : "t_off";
        //console.log(`toggleKey: ${toggleKey}, url: /shop.php?${toggleVar}=${toggleKey}&cat=transport`);
        await getRequest(`/shop.php?${toggleVar}=${toggleKey}&cat=transport`);
    }
}
function toggleHuntBlock() {
    const map_hunt_block_div = document.getElementById("map_hunt_block_div");
    if(map_hunt_block_div) {
        const mapRightBlock = document.getElementById("map_right_block");
        let mapRightBlockHeight = mapRightBlock.offsetHeight;
        if(getPlayerBool("HideHuntBlock")) {
            mapRightBlockHeight -= map_hunt_block_div.offsetHeight;
        }
        map_hunt_block_div.style.display = getPlayerBool("HideHuntBlock") ? "none" : "block";
        if(!getPlayerBool("HideHuntBlock")) {
            mapRightBlockHeight += map_hunt_block_div.offsetHeight;
        }
        mapRightBlock.style.height = `${mapRightBlockHeight}px`;
    }
}
function toggleBattlesDayWith() {
    const battlesDayTable = [...document.querySelectorAll("div#map_right_block_inside > table.wbwhite.rounded_table.map_table_margin")].find(x =>
        !x.innerHTML.includes("mercenary_guild.php")
        && !x.innerHTML.includes("pirate_event.php")
        && !x.innerHTML.includes(isEn ? "Valentine's Card thieves" : "Похитители валентинок")
    );
    if(battlesDayTable) {
        battlesDayTable.style.display = getPlayerBool("HideBattlesDayWithBlock") ? "none" : "";
    }
}
function toggleRightBlock() {
    const mapRightBlock = document.getElementById("map_right_block");
    if(mapRightBlock) {
        mapRightBlock.style.display = getPlayerBool("HideRightBlock") ? "none" : "block";
    }
}
function toggleViewImages() {
    Array.from(document.querySelectorAll("a[name=locationViewImage]")).forEach(x => x.style.display = getPlayerBool("showLocationViewImages") ? "block" : "none");
}
async function tryGetAmbushState() {
    if(location.pathname == '/map.php') {
        //const ambushDiv = Array.from(document.querySelectorAll("div#map_right_block .wbwhite.rounded_table")).find(x => x.innerHTML.includes(AmbushingName));
        const ambushDiv = document.querySelector("div#map_right_block div#rtdiv");
        if(ambushDiv) {
            setPlayerValue("ChallengeState", ChallengeState.Thrown);
            deletePlayerValue("AmbushSuspendExpireDate");
            if(getPlayerBool("NewAmbushTimer")) {
                const ambushPath = getAmbushDirection();
                setTimeout("clearTimeout(Timer)", 0); // Останавливаем таймер разработчиков
                let hwmTransporterLeftThief = document.getElementById("hwmTransporterLeftThief");
                if(!hwmTransporterLeftThief) {
                    //ambushDiv.style.whiteSpace = "nowrap";
                    ambushDiv.innerHTML = `<img id="hwmTransporterLeftThief" src="https://dcdn.heroeswm.ru/i/portraits/thiefwarrioranip33.png" style="width: 16px; height: 16px; transition-duration: 0.8s;" /><a href="map.php"><span id="hwmTransporterAmbushStateTime">00</span> с.</a><span title="${isEn ? "Average waiting time" : "Среднее время ожидания" }">[${Math.round(parseFloat(getValue(`AmbushAverageTime${ambushPath}`, 0)))}]</span><img id="hwmTransporterRightThief" src="https://dcdn.heroeswm.ru/i/portraits/thiefwarrioranip33.png" style="width: 16px; height: 16px; display: none; transition-duration: 0.8s;" />`;
                    hwmTransporterLeftThief = document.getElementById("hwmTransporterLeftThief");
                }
                if(!getPlayerValue("AmbushBeginDate")) {
                    setPlayerValue("AmbushBeginDate", getServerTime());
                    isInBattle = false;
                }
                const ambushStateTime = Math.round((getServerTime() - parseInt(getPlayerValue("AmbushBeginDate"))) / 1000);
                if(isInBattle) {
                    deletePlayerValue("AmbushBeginDate");
                    setAmbushStatistics(ambushPath, ambushStateTime);
                    //console.log(location.href);
                    window.location.href = location.origin + "/map.php";
                    return;
                }
                const thiefPositionDuration = 3; // 3 секунды вор стоит в одной позиции
                const thiefPosition = Math.floor(ambushStateTime / thiefPositionDuration) % 4;
                hwmTransporterLeftThief.style.display = thiefPosition == 0 || thiefPosition == 3 ? "" : "none";
                ambushDiv.querySelector("img#hwmTransporterRightThief").style.display = thiefPosition == 1 || thiefPosition == 2 ? "" : "none";

                hwmTransporterLeftThief.style.transform = thiefPosition == 0 || thiefPosition == 1 ? "rotateY(180deg)" : "none";
                ambushDiv.querySelector("img#hwmTransporterRightThief").style.transform = thiefPosition == 0 || thiefPosition == 1 ? "rotateY(180deg)" : "none";

                ambushDiv.querySelector("span#hwmTransporterAmbushStateTime").innerText = ambushStateTime.toString().padStart(2, '0');
                if(ambushStateTime % 5 == 0) {
                    inBattle();
                }
                setTimeout(tryGetAmbushState, 1000);//                tryGetAmbushStateTimer = setTimeout(function() { tryGetAmbushState(); }, 1000);
            }
        } else {
            deletePlayerValue("AmbushBeginDate");
            if(getPlayerValue("ChallengeState") == ChallengeState.Thrown) {
                deletePlayerValue("ChallengeState");
            }
        }
    }
    if(location.pathname == '/war.php') {
        const warId = getUrlParamValue(location.href, "warid");
        const lt = getUrlParamValue(location.href, "lt");
        finalResultDiv = document.getElementById("finalresult_text");
        if(lt != "-1" && finalResultDiv.innerHTML.length <= 10 && getPlayerValue("ChallengeState") == ChallengeState.Thrown) {
            deletePlayerValue("AmbushBeginDate");
            setPlayerValue("ChallengeState", ChallengeState.Battle);
            observe(finalResultDiv, parseBattleResultPanel);
        }
    }
}
function getAmbushDirection() {
    const ambushDiv = document.querySelector("div#map_right_block div#rtdiv");
    if(ambushDiv) {
        const ambushTable = getParent(ambushDiv, "table");
        const text = isEn ? "You are in ambush. Looking for opponent. " : "Вы в засаде, идет поиск противника. ";
        const ambushPathExec = new RegExp(`${text}\\((.+&lt;-&gt;.+)\\)`).exec(ambushTable.innerHTML);
        if(ambushPathExec) {
            const ambushPath = ambushPathExec[1].replace("&lt;", "").replace("&gt;", "");
            //console.log(`ambushPath: ${ambushPath}`);
            return ambushPath;
        }
    }
}
function setAmbushStatistics(ambushPath, ambushTime) {
    ambushTime = Math.min(ambushTime, 45); // В фоне таймер может идти дольше максимума в 45 сек.
    const ambushAverageTime = parseFloat(getValue(`AmbushAverageTime${ambushPath}`, 0));
    const ambushAmount = parseInt(getValue(`AmbushAmount${ambushPath}`, 0));
    const newAmbushAmount = ambushAmount + 1;
    const newAmbushAverageTime = Math.round((ambushAverageTime + (ambushTime - ambushAverageTime) / newAmbushAmount) * 10000) / 10000;
    //console.log(`ambushAverageTime: ${ambushAverageTime}, ambushAmount: ${ambushAmount}, newAmbushAmount: ${newAmbushAmount}, newAmbushAverageTime: ${newAmbushAverageTime}`);
    setValue(`AmbushAmount${ambushPath}`, newAmbushAmount);
    setValue(`AmbushAverageTime${ambushPath}`, newAmbushAverageTime);
    return newAmbushAverageTime;
}
function getAllAmbushStatistics() {
    const timeKeys = getStorageKeys(x => x.startsWith("AmbushAverageTime"));
    const result = [];
    for(const timeKey of timeKeys) {
        const ambushPath = timeKey.replace(/^AmbushAverageTime/, "");
        const ambushAverageTime = getValue(timeKey);
        const ambushAmount = getValue(`AmbushAmount${ambushPath}`);
        result.push({ AmbushPath: ambushPath, AmbushAmount: ambushAmount, AmbushAverageTime: ambushAverageTime});
    }
    //console.log(result)
    return result;
}
function showAmbushWaitingStatistics(container) {
    const allAmbushStatistics = getAllAmbushStatistics();
    const ambushWaitingStatisticsTable = document.getElementById("ambushWaitingStatisticsTable") || addElement("table", { id: "ambushWaitingStatisticsTable" }, container);
    let tableHtml = "";
    if(allAmbushStatistics.length > 0) {
        for(const item of allAmbushStatistics) {
            tableHtml += `
<tr><td id="${`${item.AmbushPath}`}" name="clearStatistics" title="${isEn ? "Clear statistics on path" : "Очистить статистику по направлению"}" onclick="">${item.AmbushPath}</td><td title="${isEn ? "Ambush amount" : "Количество засад" }">${item.AmbushAmount}</td><td title="${isEn ? "Average waiting time" : "Среднее время ожидания" }">${item.AmbushAverageTime}</td></tr>`;
        }
    } else {
        tableHtml = isEn ? "Statistics is empty" : "Статистика пуста";
    }
    ambushWaitingStatisticsTable.innerHTML = tableHtml;
    Array.from(ambushWaitingStatisticsTable.querySelectorAll("[name='clearStatistics']")).forEach(x => x.addEventListener("click", function() { if(window.confirm(isEn ? "Is clear?" : "Очистить?")) { deleteValue(`AmbushAmount${x.id}`); deleteValue(`AmbushAverageTime${x.id}`); } }));
    //Array.from(ambushWaitingStatisticsTable.querySelectorAll("[name='clearStatistics']")).forEach(x => x.addEventListener("click", function() { if(window.confirm(isEn ? "Is clear?" : "Очистить?")) { clearAllAmbushStatistics(); } }));
}
function clearAllAmbushStatistics() {
    const timeKeys = getStorageKeys(x => x.startsWith("AmbushAverageTime"));
    for(const timeKey of timeKeys) {
        const ambushPath = timeKey.replace(/^AmbushAverageTime/, "");
        deleteValue(timeKey);
        deleteValue(`AmbushAmount${ambushPath}`);
    }
}
function parseBattleResultPanel() {
    if(getPlayerValue("ChallengeState") == ChallengeState.Battle && finalResultDiv.innerHTML.length > 10) {
        deletePlayerValue("ChallengeState");
        const bolds = finalResultDiv.querySelectorAll("font b");
        let result = "fail";
        for(const bold of bolds) {
            if(bold.innerHTML == (isEn ? "Victorious:" : "Победившая сторона:")) {
                if(bold.parentNode.nextSibling.nextSibling.firstChild.innerText == getPlayerValue("UserName")) {
                    result = "win";
                }
                break;
            }
        }
        if(result == "fail") {
            setPlayerValue("AmbushSuspendExpireDate", getServerTime() + AmbushMinutesInterval * 60 * 1000);
        }
    }
}
async function checkAmbushResult(force = false) {
    const afterAmbushUnknownResult = getPlayerValue("ChallengeState") == ChallengeState.Battle; // После засады был бой
    if(afterAmbushUnknownResult && !isFullHealth() && !force) {
        setPlayerValue("AmbushSuspendExpireDate", getServerTime() + AmbushMinutesInterval * 60 * 1000);
    } else {
        let doc;
        if(location.pathname == '/pl_warlog.php') {
            const page = getUrlParamValue(location.href, "page");
            const id = getUrlParamValue(location.href, "id");
            if(id == PlayerId && (!page || page == 0)) {
                doc = document;
            }
        }
        if(doc || afterAmbushUnknownResult || force) {
            doc = doc || await getRequest(`/pl_warlog.php?id=${PlayerId}`);
            processWarlog(doc);
        }
    }
    if(afterAmbushUnknownResult) {
        deletePlayerValue("ChallengeState");
    }
    refreshAmbushMoratoriumPanel();
}
function getHealth() {
    const health_amount = document.getElementById("health_amount");
    let health;
    if(health_amount) {
        health = parseInt(health_amount.innerText);
    } else {
        health = win.heart;
    }
    return health;
}
function isFullHealth() {
    const healthRestoreTime = parseInt(getPlayerValue("HealthRestoreTime", 0));
    return healthRestoreTime < getServerTime();
}
function healthTimer() {
    if(isHeartOnPage) {
        const health_amount = document.getElementById("health_amount");
        let heart; // 78
        let maxHeart; // 100
        let timeHeart; // 405
        if(health_amount) {
            const res = /top_line_draw_canvas_heart\((\d+), (\d+), ([\d\.]+)\);/.exec(document.body.innerHTML); // top_line_draw_canvas_heart(0, 100, 405.5);
            if(res) {
                heart = parseInt(res[1]);
                maxHeart = parseInt(res[2]);
                timeHeart = parseFloat(res[3]);
            }
        } else {
            heart = win.heart;
            maxHeart = win.max_heart;
            timeHeart = win.time_heart;
        }
        //console.log(`healthTimer heart: ${heart}, maxHeart: ${maxHeart}, timeHeart: ${timeHeart}`);
        let restSeconds = timeHeart * (maxHeart - heart) / maxHeart;
        if(restSeconds > 0) {
            setPlayerValue("HealthRestoreTime", getServerTime() + restSeconds * 1000);
        } else {
            deletePlayerValue("HealthRestoreTime");
        }
    }
    expireHealthRestoreTime();
}
function expireHealthRestoreTime() {
    const healthRestoreTime = parseInt(getPlayerValue("HealthRestoreTime", 0));
    if(healthRestoreTime > 0) {
        if(getServerTime() > healthRestoreTime) {
            deletePlayerValue("HealthRestoreTime");
            drawAmbushMarks();
        } else {
            setTimeout(expireHealthRestoreTime, 1000);
        }
    }
}
function processWarlog(doc) {
    const lastAmbushRef = Array.from(doc.querySelectorAll("a[href*='warlog.php?warid=']")).find(x => {
        if(x.nextSibling.textContent == ": • ") {
            return true;
        }
        const rowElements = getSequentialsUntil(x, "br");
        //console.log(rowElements);
        const ranger = rowElements.find(y => y.textContent.includes(isEn ? "Ranger" : "Рейнджер"));
        //console.log(`ranger: ${ranger}`);
        return ranger ? true : false;
    });
    let lastAmbushResult = AmbushResult.NotFound;
    if(lastAmbushRef) {
        let currentElement = lastAmbushRef;
        lastAmbushResult = AmbushResult.Fail;
        while(currentElement && currentElement.tagName.toLowerCase() != "br") {
            //console.log(currentElement);
            if(currentElement.tagName.toLowerCase() == "b" && currentElement.innerHTML.includes(getPlayerValue("UserName"))) {
                lastAmbushResult = AmbushResult.Win;
                break;
            }
            currentElement = nextSequentialElement(currentElement);
        }
        var lastAmbushTime = parseDate(lastAmbushRef.innerText).getTime();
        var newAmbushSuspendExpireDate = lastAmbushTime + (AmbushMinutesInterval + 1) * 60 * 1000;
    }
    // Если есть неустаревшее поражение
    if(lastAmbushResult == AmbushResult.Fail && newAmbushSuspendExpireDate > getServerTime()) {
        // Если нет старого значения AmbushSuspendExpireDate или расхождение с новым из лога больше минуты, то установим новое
        if(!getPlayerValue("AmbushSuspendExpireDate") || Math.abs(parseInt(getPlayerValue("AmbushSuspendExpireDate")) - newAmbushSuspendExpireDate) > 60 * 1000) {
            setPlayerValue("AmbushSuspendExpireDate", newAmbushSuspendExpireDate);
        }
    } else {
        deletePlayerValue("AmbushSuspendExpireDate");
    }
}
function fromTimeSpanToString(timeSpan) {
    if(timeSpan) {
        return (new Date(parseInt(timeSpan))).toLocaleString();
    }
}
async function inBattle() {
    let result = false;
    const doc = await getRequest("/forum_thread.php?id=1");
    if(isNewInterface) {
        result = doc.querySelector("div.mm_item_red > a[href='home.php']") ? true : false;
    } else {
        result = doc.querySelector("a[href='home.php'][style='text-decoration: none;color: #ff0000;']") ? true : false;
    }
    isInBattle = result;
    return result;
}
async function getCurrentBattle() {
    const doc = await getRequest("/pl_info.php?id=${PlayerId}");
    return doc.querySelector("a[href^='warlog.php']")?.href;
}
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
function truncDateTimeToMinutes(dateTime) {
    const coeff = 1000 * 60;
    return new Date(Math.floor(dateTime.getTime() / coeff) * coeff);
}
function refreshAmbushMoratoriumPanel() {
    if(getPlayerValue("AmbushSuspendExpireDate")) {
        const ambushMoratoriumEndDate = parseInt(getPlayerValue("AmbushSuspendExpireDate"));
        if(ambushMoratoriumEndDate > getServerTime()) {
            if(!getPlayerValue("thiefTimeoutEnd")) {
                setPlayerValue("thiefTimeoutEnd", ambushMoratoriumEndDate);
            }
            const formatedTime = formatInterval(ambushMoratoriumEndDate - getServerTime());
            setAmbushMoratoriumPanelValue(formatedTime);
            setTimeout(refreshAmbushMoratoriumPanel, 1000);
        } else {
            setAmbushMoratoriumPanelValue();
            deletePlayerValue("AmbushSuspendExpireDate");
            if(getPlayerBool("ThievesGuildNotifications")) {
                GM.notification("Вы можете устроить засаду", "ГВД", "https://dcdn.heroeswm.ru/i/portraits/thiefwarrioranip33.png", function() { window.focus(); getURL("/map.php"); });
            }
            drawAmbushMarks();
        }
    } else {
        setAmbushMoratoriumPanelValue();
        drawAmbushMarks();
    }
}
function setAmbushMoratoriumPanelValue(value) {
    if(AmbushMoratoriumPanel) {
        AmbushMoratoriumPanel.innerText = value || "";
    }
}
function formatInterval(interval) {
    let diff = interval;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const mimutes = Math.floor(diff / 1000 / 60);
    diff -= mimutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);
    const formatedTime = (hours > 0 ? hours + ":" : "") + ( (mimutes < 10) ? '0' : '' ) + mimutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    return formatedTime;
}
function drawMap() {
    const insideMap = document.querySelector("#inside_map");
    const jsmap = document.querySelector("#jsmap");
    const isHideMap = getPlayerBool("HideMap");
    const mapRightBlock = document.getElementById("map_right_block");
    if(jsmap) {
        jsmap.style.display = isHideMap ? "none" : "block";
    }
    toggleRightBlock();
    toggleBattlesDayWith();
    toggleHuntBlock();
    if(insideMap && (!getPlayerBool("PopupAlways") || isMobileInterface)) {
        mapRightBlock.style.removeProperty('height');
        let mapMovingContainer = insideMap;
        let mapMovingStyle = "";
        if(isMobileInterface) {
            insideMap.style.flexWrap = "wrap";
            //insideMap.style.justifyContent = "normal";
            addElement("div", { style: "flex-basis: 100%; height: 0;"}, insideMap);
            mapMovingStyle = "order: 4;";
        } else {
            mapMovingContainer = addElement("div", { style: "order: 1;" }, insideMap);
            mapMovingContainer.appendChild(jsmap);
            insideMap.style.gap = "10px";
        }
        drawMapCore(mapMovingContainer, mapMovingStyle);
    } else {
        const mapHeight = 350;
        const mapWidth = 500;
        const zIndex = isMobileDevice ? 110 : 10;
        const mapActivatorDiv = addElement("div", { style: `position: fixed; width: ${isMobileDevice ? 20 : 5}px; height: ${isMobileDevice ? 90 : window.innerHeight - 50}px; top: 50px; left: 0; background-color: #FFCCCB; opacity: 80%; z-index: ${zIndex + 1};` }, document.body);
        const mapContainerDiv = addElement("div", { style: `position: fixed; width: ${mapWidth}px; height: ${mapHeight}px; top: 40%; left: 0; transform: translate(-100%, -50%); transition-duration: 0.3s; z-index: ${zIndex};` }, document.body, "afterbegin");
        const mapMoving = drawMapCore(mapContainerDiv, "box-shadow: 1px 1px 5px #333;"); //, `height: ${innerMapHeight}px`
        let timer;
        if(isMobileDevice) {
            mapActivatorDiv.addEventListener("click", function(event) {
                //console.log(`left: ${mapContainerDiv.style.left}, top: ${mapContainerDiv.style.top}`)
                if(mapContainerDiv.getBoundingClientRect().left < 0) {
                    mapContainerDiv.style.transform = "translate(0%, -50%)";
                } else {
                    mapContainerDiv.style.transform = "translate(-100%, -50%)";
                }
            });
        } else {
            mapActivatorDiv.addEventListener("mouseover", function(event) { timer = setTimeout(function() { mapContainerDiv.style.transform = "translate(0%, -50%)"; }, 100); });
            mapActivatorDiv.addEventListener("mouseout", function(event) { timer = setTimeout(function() { mapContainerDiv.style.transform = "translate(-100%, -50%)"; }, 300); });
            mapContainerDiv.addEventListener("mouseover", function(event) { clearTimeout(timer); });
            mapContainerDiv.addEventListener("mouseout", function(event) { timer = setTimeout(function() { mapContainerDiv.style.transform = "translate(-100%, -50%)"; }, 100); });
        }
    }
}
function drawMapCore(parentNode, mainStyle) {
    let mapMoving = document.getElementById("mapMoving");
    if(mapMoving) {
        mapMoving.parentNode.removeChild(mapMoving);
    }
    const workImageSize = 25;
    mapMoving = addElement("div", { id: "mapMoving", style: (mainStyle || "") + "border: 1mm ridge rgba(211, 220, 50, .6); background: linear-gradient(0.15turn, #3f87a6, #ebf8e1, #f69d3c 80%);" }, parentNode);
    mapMoving.innerHTML = `
<div id="hwmTransporterTopSettings" style="position: relative; text-align: center; font-size: 9px;">
    <span style="font-size: 9px;">${ (MountInfo.EndDate > 0 ? `${MountInfo.ComplexRoute ? ComplexRouteName + ", " : ""}${MountInfo.IsPremiunAccount ? PremiunAccountName + ", " : ""}${MountUntilName}: ${(new Date(MountInfo.EndDate)).toLocaleString()}, ` : "") + `${TravelingTimeName}: ${MountInfo.TravelingTime} ${Second}` }</span>
    ${ MountInfo.AntithiefControlled ? `, <input id='toggleAntithiefCheckbox' type='checkbox' ${MountInfo.Antithief ? "checked" : ""}>${Antithief}` : "" }
    <div id="checkMountButton" title="${CheckMountName}" style="display: inline-block;">
        <img src="https://dcdn2.heroeswm.ru/i/pl_info/btn_reset.png" style="height: 12px; wigth: 12px;">
    </div>
    <br />
    <input id='removeArtsBeforeMovingCheckbox' type='checkbox' ${getPlayerBool("removeArtsBeforeMoving") ? "checked" : ""}>${UndressBeforeMove}
    <input id='IgnoreComplexRouteCheckbox' type='checkbox' ${getPlayerBool("IgnoreComplexRoute") ? "checked" : ""}>${NotUseComplexRoute}
    <input id='HideMapCheckbox' type='checkbox' ${getPlayerBool("HideMap") ? "checked" : ""}>${HideMapName}
    <br />
    <input id='HideHuntBlockCheckbox' type='checkbox' ${getPlayerBool("HideHuntBlock") ? "checked" : ""}>${HideHuntName}
    <input id='HideRightBlockCheckbox' type='checkbox' ${getPlayerBool("HideRightBlock") ? "checked" : ""}>${HideRightBlockName}
    <input id='popupAlwaysCheckbox' type='checkbox' ${getPlayerBool("PopupAlways") ? "checked" : ""}>${PopupAlwaysName}
    <input id='showLocationNumbersCheckbox' type='checkbox' ${getPlayerBool("ShowLocationNumbers") ? "checked" : ""}>${ShowLocationNumbersName}
</div>
<div>
    <table id="hwmMapMoveTable" style="">
    </table>
</div>
<div id="hwmTransporterBottomSettings" style="position: relative; text-align: left; font-size: 9px;">
    <!--<div id="findNearestProductionBigButton" title="${FindNearestProductionName}" style="float: right;">
        <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_production.png" style="scale: 1.5;">
    </div>-->
    ${LoadName}<input id='loadMiningCheckbox' type='checkbox' ${getPlayerBool("Load" + factoryTypes[0]) ? "checked" : ""}>${Mining}
    <input id='loadMachiningCheckbox' type='checkbox' ${getPlayerBool("Load" + factoryTypes[1]) ? "checked" : ""}>${Machining}
    <input id='loadProductionCheckbox' type='checkbox' ${getPlayerBool("Load" + factoryTypes[2]) ? "checked" : ""}>${Production}
    <input id='showLocationViewImagesCheckbox' type='checkbox' ${getPlayerBool("showLocationViewImages") ? "checked" : ""}>${isEn ? "View" : "Просмотр"}
    <input id='HideBattlesDayWithBlockCheckbox' type='checkbox' ${getPlayerBool("HideBattlesDayWithBlock") ? "checked" : ""}>${HideBattlesDayWithName}
    <br/>
    <span style="font-size: 9px;">${Legend}, PlayerSector: ${playerLocationNumber}${playerLocationNumber != getPlayerValue("LastObservingLocationNumber") ? ", View: " + getPlayerValue("LastObservingLocationNumber") : ""}</span>
    <!--<span id="ClickMe">ClickMe</span>-->
    <br/>
    <input id='ambushIconsCheckbox' type='checkbox' ${getPlayerBool("ambushIcons") ? "checked" : ""}>${isEn ? "Ambush icons" : "Иконки засад"}
    <input id='thievesGuildNotificationsCheckbox' type='checkbox' ${getPlayerBool("ThievesGuildNotifications") ? "checked" : ""}>${isEn ? "Thieves guild notifications" : "Оповещение о засаде"}
    <input id='newAmbushTimerCheckbox' type='checkbox' ${getPlayerBool("NewAmbushTimer") ? "checked" : ""}><span id="showAmbushWaitingStatisticsSpan" title="${isEn ? "Show ambush waiting statistics" : "Показать статистику ожидания в засаде"}">${isEn ? "New ambush timer" : "Новый таймер засад"}</span>
    <br/>
    <input id='patrolRouteEnabledCheckbox' type='checkbox' ${getPlayerBool("PatrolRouteEnabled") ? "checked" : ""}>${isEn ? "Setup patrol" : "Настроить патрулирование"}
    ${isEn ? "Pause: " : "Пауза: "}<input id='patrollingPauseInput' type='number' value='${getPlayerValue("PatrollingPause", 5)}' style="width: 50px;" onfocus="this.select();">
    <input id=togglePatrollingButton type="button" value="${getPlayerBool("IsPatrolling") ? (isEn ? "Stop patrolling" : "Остановить патрулирование") : (isEn ? "Start patrolling" : "Начать патрулирование")}" title="${JSON.parse(getPlayerValue("PatrolRoute", "[]")).join("->")}" style="font-size: 9px;" />
    <br />
    <b>${JobFinding}:</b>
    <div id="findNearestMiningButton" title="${FindNearestMiningName}" style="display: inline-block;">
        <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_mining.png" style="width: ${workImageSize}px; height: ${workImageSize}px; vertical-align: middle;">
    </div>
    <div id="findNearestManufactureButton" title="${FindNearestManufactureName}" style="display: inline-block;">
        <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_manufacture.png" style="width: ${workImageSize}px; height: ${workImageSize}px; vertical-align: middle;">
    </div>
    <div id="findNearestProductionButton" title="${FindNearestProductionName}" style="display: inline-block;">
        <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_production.png" style="width: ${workImageSize}px; height: ${workImageSize}px; vertical-align: middle;">
    </div>
    <input id='minSalaryNumber' type='number' title="${isEn ? "Min salary: " : "Минимальная зарплата: "}" value='${getPlayerValue("MinSalary", "")}' style="width: 50px;" onfocus="this.select();">
    <input id='moveToWorkAfterFindCheckbox' type='checkbox' ${getPlayerBool("MoveToWorkAfterFind") ? "checked" : ""} style="vertical-align: middle;"><lable for=moveToWorkAfterFindCheckbox style="vertical-align: middle;">${MoveToWorkAfterFindName}</lable>
    <span id="workFindingMessageSpan"/>
</div>`;
    mapMoving.querySelector("#removeArtsBeforeMovingCheckbox").addEventListener("click", function() { setPlayerValue("removeArtsBeforeMoving", this.checked); });
    mapMoving.querySelector("#IgnoreComplexRouteCheckbox").addEventListener("click", function() { setPlayerValue("IgnoreComplexRoute", this.checked); });
    mapMoving.querySelector("#HideMapCheckbox").addEventListener("click", function() { setPlayerValue("HideMap", this.checked); window.location.reload(); });
    if(MountInfo.AntithiefControlled) {
        mapMoving.querySelector("#toggleAntithiefCheckbox").addEventListener("click", function() { toggleAntithief(this); });
    }
    mapMoving.querySelector("#HideHuntBlockCheckbox").addEventListener("click", function() { setPlayerValue("HideHuntBlock", this.checked); toggleHuntBlock(); });
    mapMoving.querySelector("#HideRightBlockCheckbox").addEventListener("click", function() { setPlayerValue("HideRightBlock", this.checked); toggleRightBlock(); });
    mapMoving.querySelector("#checkMountButton").addEventListener("click", function() { main(true); });

    mapMoving.querySelector("#loadMiningCheckbox").addEventListener("click", function() { setPlayerValue("Load" + factoryTypes[0], this.checked); });
    mapMoving.querySelector("#loadMachiningCheckbox").addEventListener("click", function() { setPlayerValue("Load" + factoryTypes[1], this.checked); });
    mapMoving.querySelector("#loadProductionCheckbox").addEventListener("click", function() { setPlayerValue("Load" + factoryTypes[2], this.checked); });
    mapMoving.querySelector("#popupAlwaysCheckbox").addEventListener("click", function() { setPlayerValue("PopupAlways", this.checked); window.location.reload(); });
    mapMoving.querySelector("#showLocationNumbersCheckbox").addEventListener("click", function() { setPlayerValue("ShowLocationNumbers", this.checked); window.location.reload(); });
    mapMoving.querySelector("#showLocationViewImagesCheckbox").addEventListener("click", function() { setPlayerValue("showLocationViewImages", this.checked); toggleViewImages(); });
    mapMoving.querySelector("#HideBattlesDayWithBlockCheckbox").addEventListener("click", function() { setPlayerValue("HideBattlesDayWithBlock", this.checked); toggleBattlesDayWith(); });

    //mapMoving.querySelector("#ClickMe").addEventListener("click", function() { getObjectLocations(); });

    mapMoving.querySelector("#moveToWorkAfterFindCheckbox").addEventListener("click", function() { setPlayerValue("MoveToWorkAfterFind", this.checked); });
    mapMoving.querySelector("#minSalaryNumber").addEventListener("change", function() { setPlayerValue("MinSalary", parseInt(this.value)); });
    mapMoving.querySelector("#findNearestMiningButton").addEventListener("click", function() { findNearestWork("mn"); });
    mapMoving.querySelector("#findNearestManufactureButton").addEventListener("click", function() { findNearestWork("fc"); });
    mapMoving.querySelector("#findNearestProductionButton").addEventListener("click", function() { findNearestWork("sh"); });
    //mapMoving.querySelector("#findNearestProductionBigButton").addEventListener("click", function() { findNearestWork("sh"); });
    
    mapMoving.querySelector("#ambushIconsCheckbox").addEventListener("click", function() { setPlayerValue("ambushIcons", this.checked); });
    mapMoving.querySelector("#thievesGuildNotificationsCheckbox").addEventListener("click", function() { setPlayerValue("ThievesGuildNotifications", this.checked); });

    mapMoving.querySelector("#patrolRouteEnabledCheckbox").addEventListener("click", function() { setPlayerValue("PatrolRouteEnabled", this.checked); togglePatrolRoute(); });
    mapMoving.querySelector("#patrollingPauseInput").addEventListener("change", function() { setPlayerValue("PatrollingPause", parseInt(this.value)); });
    mapMoving.querySelector("#togglePatrollingButton").addEventListener("click", togglePatrolling);

    mapMoving.querySelector("#newAmbushTimerCheckbox").addEventListener("click", function() { setPlayerValue("NewAmbushTimer", this.checked); });
    mapMoving.querySelector("#showAmbushWaitingStatisticsSpan").addEventListener("click", function() { showAmbushWaitingStatistics(mapMoving); });

    const table = mapMoving.querySelector("#hwmMapMoveTable");
    const now = new Date();
    for(let y = minY; y <= maxY; y++) {
        const tableRow = addElement("tr", {}, table);
        for(let x = minX; x <= maxX; x++) {
            let cellStyle = "";
            let locationNumber = getLocationNumberByCoordinate(x, y);
            const tableCell = addElement("td", { id: `transporterLocation${locationNumber}` }, tableRow);
            if(locationNumber) {
                const loc = locations[locationNumber];
                tableCell.innerHTML = `${loc[locationNamesLocalizedColumn].replace(" ", "<br>")} ${ getPlayerBool("ShowLocationNumbers") ? `(${locationNumber})` : "" }`;
                tableCell.style = `position: relative; cursor: pointer; font-size: 10px; font-weight: bold; text-align: center; border: 1px solid #000; padding: 3px; color: ${locationNumber == playerLocationNumber ? "red" : "black"};`;
                if(locationNumber < 100) {
                    let routeTime = "";
                    const routeSettings = routes[playerLocationNumber][locationNumber];
                    if(routeSettings) {
                        const routeLength = routeSettings[1];
                        routeTime = `\n${TravelingTimeName} ${routeLength * MountInfo.TravelingTime} ${Second}`;
                    }
                    tableCell.title = `${GoTo} ${loc[locationNamesLocalizedColumn]}${routeTime}`;
                    tableCell.addEventListener("mouseenter", function() { this.style.border = "1px solid #fff"; });
                    tableCell.addEventListener("mouseleave", function() { this.style.border = "1px solid #000"; });
                    tableCell.addEventListener("click", function(e) { if(e.altKey) { getURL(`/map.php?cx=${x}&cy=${y}`); } else if(e.ctrlKey) { setThiefAmbush(locationNumber); } else { tryMoving(locationNumber); } });
                    tableCell.addEventListener("auxclick", function(e) { e.stopPropagation();/*if(e.which === 2) { e.preventDefault(); }*/ if(e.button == 1) { setThiefAmbush(locationNumber); } }); // console.log(`e.which: ${e.which}, e.button: ${e.button}`);
                    const sectorViewReference = addElement("a", { href: `/map.php?cx=${x}&cy=${y}`, innerHTML: "🔍", style: `display: ${getPlayerBool("showLocationViewImages") ? "block" : "none"}; text-decoration: none; position: absolute; left: 1px; bottom: 1px;`, title: `${isEn ? "View" : "Просмотр"}`, name: "locationViewImage" }, tableCell);
                    sectorViewReference.addEventListener("click", function(e) { e.stopPropagation(); })

                    if([2, 6, 16, 21].includes(parseInt(locationNumber))) {
                        getMoveToMapObjectReference('/mercenary_guild.php', tableCell, locationNumber, "https://dcdn.heroeswm.ru/i/btns/job_fl_btn_mercenary.png", "position: absolute; bottom: 2px; right: 2px; display: block; width: 16px; height: 16px;", 14);
                    }
                    const guestInfo = getGuestInfo(locationNumber);
                    const guestInfoKeys = Object.keys(guestInfo);
                    if(guestInfoKeys.length > 0) {
                        const guestInfoTitles = guestInfoKeys.map(x => `${guestInfo[x].HostInfo} до ${(new Date(guestInfo[x].ExpireDate)).toLocaleString()}`);
                        const guestReference = addElement("a", { href: `/house_info.php?id=${guestInfoKeys[0]}`, style: "display: block; float: left;", title: guestInfoTitles.join("\n") }, tableCell);
                        guestReference.addEventListener("click", function(e) { e.stopPropagation(); })
                        addElement("img", { style: "border: 0;", src: "https://dcdn.heroeswm.ru/i/btns/job_fl_btn_houses.png", style: "width: 16px; height: 16px;" }, guestReference);
                    }
                } else if(locationNumber == 106) {
                    tableCell.innerHTML = "<div id=repeatLastAmbushHolder></div>";
                    tableCell.style = "cursor: pointer; text-align: center;";
                } else if(locationNumber == 107) {
                    tableCell.innerHTML = `<div title="${FindNearestProductionName}" style="position: relative;">
        <img src="https://dcdn.heroeswm.ru/i/btns/job_fl_btn_production.png" style="height: 48px;">
        <div id=workSearchingLocationNumberDiv style="position: absolute; right: 0px; bottom: 0px; width: 50px; height: 30px; vertical-align: middle; text-align: center; font-size: 16px; font-weight: bold; color: #f5c140; text-shadow: 0px 0px 2px #000, 0px 0px 2px #000; "></div>
    </div>`;
                    tableCell.style = "cursor: pointer; text-align: center;";
                    tableCell.addEventListener("click", function() { findNearestWork("sh"); });
                } else {
                    //console.log(`locationNumber: ${locationNumber}, x: ${x}, y: ${y}`);
                    if(loc[5]) {
                        tableCell.style.color = loc[5].Color;
                        tableCell.addEventListener("click", function() { getURL(loc[5].Url); });
                    }
                    if(x == 50 && y == 54) {
                        addElement("br", {}, tableCell);
                        AmbushMoratoriumPanel = addElement("span", { id: "AmbushMoratoriumPanel" }, tableCell);
                    }
                    if(x == 51 && y == 54) {
                        addElement("br", {}, tableCell);
                        addElement("span", { id: "SmithMoratoriumPanel" }, tableCell);
                    }
                    if(x == 53 && y == 48) {
                        tableCell.innerHTML = "";
                        const spoiler = addElement("div", { id: `hwmTransporterTopSettingsSpoiler`, title: loc[locationNamesLocalizedColumn], style: "display: inline-block; cursor: pointer;", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">` }, tableCell);
                        spoiler.addEventListener("click", function() { setPlayerValue(this.id, !getPlayerBool(this.id)); bindPlayerInfoSpolers(this.id); });
                    }
                    if(x == 53 && y == 54) {
                        tableCell.innerHTML = "";
                        const spoiler = addElement("div", { id: `hwmTransporterBottomSettingsSpoiler`, title: loc[locationNamesLocalizedColumn], style: "display: inline-block; cursor: pointer;", innerHTML: `<img src="https://dcdn.heroeswm.ru/i/inv_im/btn_expand.svg" style="vertical-align: middle;">` }, tableCell);
                        spoiler.addEventListener("click", function() { setPlayerValue(this.id, !getPlayerBool(this.id)); bindPlayerInfoSpolers(this.id); });
                    }
                }
            }
        }
    }
    processMercenaryTaskLocation();
    createPatrolRoute();
    bindPlayerInfoSpolers();
    return mapMoving;
}
function bindPlayerInfoSpolers(togglingSpoilerId) {
    const spoilerIds = togglingSpoilerId ? [togglingSpoilerId] : ["hwmTransporterTopSettingsSpoiler", "hwmTransporterBottomSettingsSpoiler"];
    for(const spoilerId of spoilerIds) {
        const spoiler = document.getElementById(spoilerId);
        if(spoiler) {
            const spoiled = getPlayerBool(spoilerId);
            spoiler.querySelector("img").style.transform = spoiled ? 'rotate(0deg)' : 'rotate(90deg)';
            const panel = document.getElementById(spoilerId.replace("Spoiler", ""));
            panel.style.display = spoiled ? "none" : "";
        }
    }
}
function drawAmbushMarks() {
    if(!getPlayerBool("ambushIcons")) {
        return;
    }
    for(const locationNumber of Object.keys(locations).filter(x => parseInt(x) < 100)) {
        const routeSettings = routes[playerLocationNumber][locationNumber];
        const tableCell = document.getElementById(`transporterLocation${locationNumber}`);
        const thiefwarrioranip33 = tableCell.querySelector("img[src*='thiefwarrioranip33']");
        if(routeSettings && routeSettings[1] < 2 && !getPlayerValue("AmbushSuspendExpireDate") && !getPlayerValue("ChallengeState") && isFullHealth()) {
            if(!thiefwarrioranip33) {
                const ambushImage = addElement("img", { src: "https://dcdn.heroeswm.ru/i/portraits/thiefwarrioranip33.png", style: "width: 16px; height: 16px;", title: `${isEn ? "Ambush" : "Засада"}` }, tableCell);
                ambushImage.addEventListener("click", function(e) { e.stopPropagation(); setThiefAmbush(locationNumber); });
            }
        } else {
            if(thiefwarrioranip33) {
                thiefwarrioranip33.remove();
            }
        }
    }
    const repeatLastAmbushHolder = document.getElementById("repeatLastAmbushHolder");
    const thiefwarrioranip33 = repeatLastAmbushHolder.querySelector("img[src*='thiefwarrioranip33']");
    if(!getPlayerValue("AmbushSuspendExpireDate") && !getPlayerValue("ChallengeState") && isFullHealth()) {
        const lastAmbushDirections = JSON.parse(getPlayerValue("lastAmbushDirections", "[]"));
        const lastAmbushDirection = lastAmbushDirections.find(x => x.thiefLocation == playerLocationNumber);
        if(!thiefwarrioranip33 && lastAmbushDirection) {
            repeatLastAmbushHolder.addEventListener("click", setThiefAmbush);
            const ambushImage = addElement("img", { src: "https://dcdn.heroeswm.ru/i/portraits/thiefwarrioranip33.png", style: "height: 48px;", title: isEn ? "Repeat last ambush" : "Повторить последнюю засаду" }, repeatLastAmbushHolder);
        }
    } else {
        if(thiefwarrioranip33) {
            repeatLastAmbushHolder.removeEventListener("click", setThiefAmbush);
            thiefwarrioranip33.remove();
        }
    }
}
async function processMercenaryTaskLocation() {
    const mercenaryTaskLocation = await getMercenaryTaskLocation();
    if(mercenaryTaskLocation) {
        addElement("img", { src: "https://dcdn2.heroeswm.ru/i/cssmap/map_sectors_naim.png", style: "width: 16px; height: 16px;", title: `${isEn ? "Mercenary guild task" : "Задание гильдии наемников"}` }, document.getElementById(`transporterLocation${mercenaryTaskLocation}`));
    }
}
function getMercenaryTaskLocation() {
    return new Promise((resolve, reject) => {
        if(location.pathname == '/map.php') {
            setTimeout(function() {
                if(win.naim_type == 'fight') {
                    setPlayerValue("MercenaryTaskLocation", win.naim_sector);
                } else {
                    deletePlayerValue("MercenaryTaskLocation");
                }
                resolve(getPlayerValue("MercenaryTaskLocation"));
            }, 300);
        } else {
            resolve(getPlayerValue("MercenaryTaskLocation"));
        }
    });
}
async function findNearestWork(factoryType) {
    const movingEnabled = await varifyMovingEnabled();
    let notEmptyLocationsSortedByDistance = [playerLocationNumber];
    if(movingEnabled) {
        notEmptyLocationsSortedByDistance = getLocationsSortedByDistance();
    }
    notEmptyLocationsSortedByDistance = notEmptyLocationsSortedByDistance.filter(x => !getValue(`LastDetectedEmptyFactoriesDate_${factoryType}${x}`));
    const workFindingMessageSpan = document.querySelector("span#workFindingMessageSpan");
    const workSearchingLocationNumberDiv = document.querySelector("div#workSearchingLocationNumberDiv");
    for(const locationNumber of notEmptyLocationsSortedByDistance) {
        workFindingMessageSpan.innerText = `${isEn ? "Viewing" : "Поиск в "} ${locationNumber}...`;
        workSearchingLocationNumberDiv.innerText = locations[locationNumber][3];
        var findedWorkObject = await findWorkInLocation(factoryType, locationNumber);
        if(findedWorkObject) {
            if(getPlayerBool("MoveToWorkAfterFind")) {
                tryMoving(locationNumber, findedWorkObject.href);
            } else {
                getURL(findedWorkObject.href);
            }
            workFindingMessageSpan.innerText = "";
            workSearchingLocationNumberDiv.innerText = "";
            break;
        }
    }
    if(!findedWorkObject) {
        workFindingMessageSpan.innerText = isEn ? "Vacancy not found" : "Вакансий не найдено";
        workSearchingLocationNumberDiv.innerText = isEn ? "nf" : "нет";
    }
}
async function findWorkInLocation(factoryType, locationNumber) {
    const x = locations[locationNumber][0];
    const y = locations[locationNumber][1];
    const doc = await getRequest(`/map.php?cx=${x}&cy=${y}&st=${factoryType}`);
    const objectRefs = doc.querySelectorAll("a[href^='object-info.php?id=']");
    //console.log(`objectRefs: ${objectRefs.length}`);
    for(const objectRef of objectRefs) {
        //console.log(`objectRef.innerText: ${objectRef.innerText}, ${objectRef.innerText.includes("\u00bb\u00bb\u00bb")}`);
        if(objectRef.innerText.includes("\u00bb\u00bb\u00bb") && !objectRef.querySelector("font")) {
            const salary = parseInt(objectRef.parentNode.previousElementSibling.querySelector("b").innerHTML);
            const minSalary = parseInt(getPlayerValue("MinSalary", 0));
            //console.log(`minSalary: ${minSalary}, salary: ${salary}, objectRef: ${objectRef}`);
            if(minSalary == 0 || salary >= minSalary) {
                return objectRef;
            }
        }
    }
}
function getRequest(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: "text/html; charset=windows-1251",
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getLocationsSortedByDistance(locationNumber = playerLocationNumber) {
    if(locationNumber in routes && routes[locationNumber]) {
        const playerLocationRoutes = routes[locationNumber];
        const availableLocationsDistance = { };
        availableLocationsDistance[locationNumber] = 0;
        for(let i = 0; i < playerLocationRoutes.length; i++) {
            if(playerLocationRoutes[i]) {
                availableLocationsDistance[i] = playerLocationRoutes[i][1];
            }
        }
        const locationsSortedByDistance = Object.keys(availableLocationsDistance).sort(function(a,b) { return availableLocationsDistance[a] - availableLocationsDistance[b]; });
        //console.log(locationsSortedByDistance);
        return locationsSortedByDistance;
    }
}
function getLocationNumberByCoordinate(x, y) {
    for(let locationNumber in locations) {
        if(locations[locationNumber][0] == x && locations[locationNumber][1] == y) {
            return locationNumber;
        }
    }
}
function processMoving() {
    let targetLocationNumber = parseInt(getPlayerValue("TargetLocationNumber"));
    if(getPlayerValue("LastMoveTryFrom") == playerLocationNumber && targetLocationNumber != playerLocationNumber) {
        stopMoving(); // Мы не смогли уйти из локации, поэтому останавливаем движение; и мы не движемся на объект в этой же локации
        return;
    }
    let arrived = false;
    if(targetLocationNumber) {
        if(targetLocationNumber == playerLocationNumber) {
            deletePlayerValue("TargetLocationNumber");
            deletePlayerValue("LastMoveTryFrom");
            deletePlayerValue("LastMoveTryTo");
            arrived = true;
        } else {
            goToNextRoutePoint();
        }
    }
    // Перемещение к объекту после прибытия
    if(arrived) {
        let enterObjectOnArrived = getPlayerValue("EnterObjectOnArrived");
        if(enterObjectOnArrived) {
            deletePlayerValue("EnterObjectOnArrived");
            getURL(enterObjectOnArrived);
            //setTimeout(function() { window.location = enterObjectOnArrived; }, 300);
        }
    }
}
function tryMoving(targetLocationNumber, enterObjectOnArrived) {
    const isMoovingToAdjacentLocation = getIsMoovingToAdjacentLocation(targetLocationNumber);
    //console.log(`targetLocationNumber: ${targetLocationNumber}, enterObjectOnArrived: ${enterObjectOnArrived}`);
    //alert(`isMoovingToAdjacentLocation: ${isMoovingToAdjacentLocation}, MountInfo.ComplexRoute: ${MountInfo.ComplexRoute}`);
    if(!MountInfo.ComplexRoute && !isMoovingToAdjacentLocation) {
        alert(isEn ? "Without a complex route, you can only move to a neighboring location" : "Без сложного маршрута можно перемещаться только в соседнюю локацию");
        return;
    }
    if(targetLocationNumber == playerLocationNumber && !enterObjectOnArrived) {
        alert(YouAreHere);
        return;
    }
    if(targetLocationNumber == 25) {
        alert(How);
        return;
    }
    checkMovingEnabledAndGo(targetLocationNumber, enterObjectOnArrived);
}
function getIsMoovingToAdjacentLocation(targetLocationNumber) {
    return targetLocationNumber == playerLocationNumber || (routes[playerLocationNumber] && routes[playerLocationNumber][targetLocationNumber] ? (routes[playerLocationNumber][targetLocationNumber][1] < 2) : false);
}
async function varifyMovingEnabled() {
    let movingEnabled = true;
    if(/map.php/.test(location.href)) {
        const mapNavigator = document.querySelector("#map_navigator");
        movingEnabled = (Array.from(mapNavigator.querySelectorAll("div[id*='dbut']")).find(x => x.style.display == "block")) ? true : false;
    } else {
        const doc = await getRequest("/one_to_one.php");
        const invNote = Array.from(doc.querySelectorAll("font[color='#E65054']")).find(x => x.innerText == (isEn ? "You are already in a challenge!" : "Вы уже в заявке!"));
        movingEnabled = !invNote ? true : false;
    }
    return movingEnabled;
}
async function checkMovingEnabledAndGo(targetLocationNumber, enterObjectOnArrived) {
    let movingEnabled = true;
    if(targetLocationNumber != playerLocationNumber) {
        movingEnabled = await varifyMovingEnabled();
    }
    if(movingEnabled) {
        undressAndGo(targetLocationNumber, enterObjectOnArrived);
    } else {
        alert(YouAreInAChallenge);
    }
}
async function undressAndGo(targetLocationNumber, enterObjectOnArrived) {
    if(getPlayerBool("removeArtsBeforeMoving") && targetLocationNumber != playerLocationNumber) {
        await getRequest("/inventory.php?all_off=100");
    }
    startMoving(targetLocationNumber, enterObjectOnArrived);
}
function startMoving(targetLocationNumber, enterObjectOnArrived) {
    setPlayerValue("TargetLocationNumber", targetLocationNumber);
    if(enterObjectOnArrived) {
        setPlayerValue("EnterObjectOnArrived", enterObjectOnArrived);
    }
    goToNextRoutePoint();
}
function goToNextRoutePoint() {
    const targetLocationNumber = parseInt(getPlayerValue("TargetLocationNumber"));
    let nextRoutePoint;
    if(MountInfo.ComplexRoute && !getPlayerBool("IgnoreComplexRoute") || targetLocationNumber == playerLocationNumber) {
        nextRoutePoint = targetLocationNumber;
    } else if(playerLocationNumber in routes && targetLocationNumber in routes[playerLocationNumber] && routes[playerLocationNumber][targetLocationNumber]) {
        const route = routes[playerLocationNumber][targetLocationNumber][0];
        nextRoutePoint = route.split('-')[1];
    }
    if(nextRoutePoint) {
        setPlayerValue("LastMoveTryFrom", playerLocationNumber);
        setPlayerValue("LastMoveTryTo", nextRoutePoint);
        //getURL(`/move_sector.php?id=${nextRoutePoint}&rand=${Math.random()}`);
        if(playerLocationNumber != nextRoutePoint) {
            getURL(`/move_sector.php?id=${nextRoutePoint}&rand=${Math.random()}`);
        } else if(getPlayerValue("EnterObjectOnArrived")) {
            processMoving();
        }
    }
}
function stopMoving() {
    deletePlayerValue("TargetLocationNumber");
    deletePlayerValue("EnterObjectOnArrived");
    deletePlayerValue("LastMoveTryFrom");
    deletePlayerValue("LastMoveTryTo");
}
function getPlayerLocationNumber() {
    if(location.pathname == '/map.php' && location.search == '') {
        // Если мы на карте без параметров, т.е. на локации, где сами находимся. Если мы не в пути, тогда видим предприятия. Мы можем обновить текущее положение игрока.
        const minesRef = document.querySelector("a[href*='map.php?cx='][href*='&cy='][href*='&st=mn']"); // Берем из ссылки на заголовке шахт данной локации
        if(minesRef) {
            const locationNumber = getLocationNumberFromMapUrlByXy(minesRef.href);
            if(locationNumber) {
                setPlayerValue("PlayerLocationNumber", locationNumber);
                return locationNumber;
            }
        }
    }
    return parseInt(getPlayerValue("PlayerLocationNumber")); // Иначе, возьмем из кеша. Там будет пусто только при первом запуске скрипта, когда мы не просматриваем карту.
}
function getLocationNumberFromMapUrlByXy(href) {
    const x = getUrlParamValue(href, "cx");
    const y = getUrlParamValue(href, "cy");
    for(let locationNumber in locations) {
        if(x == locations[locationNumber][0] && y == locations[locationNumber][1]) {
            return locationNumber;
        }
    }
}
function getMoveToObjectReference(objectUrl, parentNode) {
    const objectId = getUrlParamValue(objectUrl, "id");
    const objectLocationNumber = objectLocations[objectId];
    //console.log(`objectId: ${objectId}, objectLocationNumber: ${objectLocationNumber}, parentNode: ${parentNode}`);
    return getMoveToMapObjectReference(objectUrl, parentNode, objectLocationNumber);
}
function getMoveToMapObjectReference(objectUrl, parentNode, objectLocationNumber, image, imageStyle, size = 12) {
    //if(objectLocationNumber==16)console.log(`objectLocationNumber: ${objectLocationNumber}, playerLocationNumber: ${playerLocationNumber}, image: ${image}, objectUrl: ${objectUrl}, parentNode: ${parentNode}`);
    if(parentNode.parentNode.querySelector(`span[name=moveToMapObjectReference][targetLocationNumber='${objectLocationNumber}']`)) {
        return null;
    }
    if(objectLocationNumber != playerLocationNumber || image) {
        let routeTime = "";
        const routeSettings = routes[playerLocationNumber][objectLocationNumber];
        if(routeSettings) {
            const routeLength = routeSettings[1];
            routeTime = `\n${TravelingTimeName} ${routeLength * MountInfo.TravelingTime} ${Second}`;
        }
        const moveHereReference = addElement('span', { name: "moveToMapObjectReference", targetLocationNumber: objectLocationNumber, style: "cursor: pointer;", innerHTML: `<img src="${image || getHorseImageData()}" alt="${MoveHere}" title="${MoveHere + routeTime}" align="absmiddle" style="max-height: ${size}px; max-width: ${size}px; display: inline-block;${imageStyle || ""}">&nbsp;&nbsp;` });
        moveHereReference.onclick = function(e) { tryMoving(objectLocationNumber, objectUrl); e.stopPropagation(); };
        //console.log(`objectUrl: ${objectUrl}, moveHereReference: ${moveHereReference}, routeTime: ${routeTime}, parentNode: ${parentNode}, parentNode.nextSibling: ${parentNode.nextSibling}, parentNode.nextElementSibling: ${parentNode.nextElementSibling}, parentNode.parentNode: ${parentNode.parentNode}, parentNode.previousSibling: ${parentNode.previousSibling}`);
        if(image) {
            parentNode.appendChild(moveHereReference);
        } else {
            parentNode.insertAdjacentElement("afterend", moveHereReference);
        }
        return moveHereReference;
    }
}
async function setThiefAmbush(locationNumber) {
    if(!locationNumber || !Number(locationNumber)) {
        const lastAmbushDirections = JSON.parse(getPlayerValue("lastAmbushDirections", "[]"));
        const lastAmbushDirection = lastAmbushDirections.find(x => x.thiefLocation == playerLocationNumber);
        //console.log(lastAmbushDirection)
        locationNumber = lastAmbushDirection.ambushDirection;
    }
    if(checkSectorForAmbush(locationNumber)) {
        if(getPlayerValue("AmbushSuspendExpireDate")) {
            alert(`${ItIsTooEarly}`);
        } else {
            const lastAmbushDirections = JSON.parse(getPlayerValue("lastAmbushDirections", "[]"));
            let lastAmbushDirection = lastAmbushDirections.find(x => x.thiefLocation == playerLocationNumber);
            if(lastAmbushDirection) {
                lastAmbushDirection.ambushDirection = locationNumber;
            } else {
                lastAmbushDirections.push({ thiefLocation: playerLocationNumber, ambushDirection: locationNumber });
            }
            setPlayerValue("lastAmbushDirections", JSON.stringify(lastAmbushDirections));
            await postRequest("/thief_ambush.php", `id=${locationNumber}&with_who=0`);
            getURL("/map.php");
        }
    } else {
        alert(AmbushMaySettedOnAdjacentSector);
    }
}
function checkSectorForAmbush(locationNumber) {
    if(!locationNumber) {
        return false;
    }
    if(playerLocationNumber in routes && locationNumber in routes[playerLocationNumber] && routes[playerLocationNumber][locationNumber]) {
        const route = routes[playerLocationNumber][locationNumber][0];
        const nextRoutePoint = route.split('-')[1];
        return nextRoutePoint == locationNumber;
    }
    return false;
}
function resetMountInfo() {
    deletePlayerValue("TravelingTime");
    deletePlayerValue("ComplexRoute");
    deletePlayerValue("TransportEndDate");
    deletePlayerValue("Antithief");
    deletePlayerValue("AntithiefControlled");
    deletePlayerValue("ToggleAntithiefKey");
    deletePlayerValue("IsPremiunAccount");
}
async function getMountInfo(force = false) {
    let endDate = parseInt(getPlayerValue("TransportEndDate", 0));
    if(endDate <= getServerTime() || force || location.pathname == "/shop.php" && getUrlParamValue(location.href, "cat") == "transport") {
        if(endDate <= getServerTime()) {
            resetMountInfo();
        }
        const doc = location.pathname == "/shop.php" && getUrlParamValue(location.href, "cat") == "transport" ? document : await getRequest("/shop.php?cat=transport");
        const mounts = doc.querySelectorAll('div.s_art_r');
        //console.log(["mounts", mounts.length]);
        const mountsInfoGeted = mounts.length > 0; // Если 0, то мы в пути и на страницу магазина нас не пускают. Поэтому используем старые данные о транспорте
        if(mountsInfoGeted) {
            let isPremiunAccount = false;
            for(const mount of mounts) {
                if(mount.innerHTML.includes(YourPremiumMountUntil) || mount.innerHTML.includes(YourMountUntil)) {
                    var mountRow = mount;
                    isPremiunAccount = mount.innerHTML.includes(YourPremiumMountUntil);
                    break;
                }
            }
            if(mountRow) {
                resetMountInfo();
                setPlayerValue("IsPremiunAccount", isPremiunAccount);
                const mountExpireTimeDiv = mountRow.querySelector('div.s_art_note_transport') || mountRow.querySelector('div.s_art_name.s_transport_name');
                const dateString = (mountExpireTimeDiv.querySelector('span') || mountExpireTimeDiv).innerText.split(Until)[1];
                setPlayerValue("TransportEndDate", parseDate(dateString).getTime());
                const transportOptions = mountRow.querySelectorAll("div.s_art_prop_transport");
                for(let transportOption of transportOptions) {
                    if(transportOption.innerHTML.includes(TravelingTimeName)) {
                        const timeValue = /(\d{1,2})/.exec(transportOption.innerHTML);
                        setPlayerValue("TravelingTime", timeValue[1]);
                    }
                    if(transportOption.innerHTML.includes(ComplexRouteName)) {
                        setPlayerValue("ComplexRoute", transportOption.querySelector("img.s_art_prop_transport_amount_image[src*='check_yes']") ? true : false);
                    }
                    if(transportOption.innerHTML.includes(Antithief)) {
                        let antithiefControlImage = transportOption.querySelector("img.s_art_prop_transport_amount_image[src*='check_on']");
                        antithiefControlImage = antithiefControlImage || transportOption.querySelector("img.s_art_prop_transport_amount_image[src*='check_off']");
                        setPlayerValue("Antithief", antithiefControlImage ? true : false);
                        setPlayerValue("AntithiefControlled", antithiefControlImage ? true : false);
                        if(antithiefControlImage) {
                            setPlayerValue("ToggleAntithiefKey", getUrlParamValue(antithiefControlImage.parentNode.href, "t_on") || getUrlParamValue(antithiefControlImage.parentNode.href, "t_off"));
                        }
                    }
                }
            }
        }
    }
    const mountInfo = {
        TravelingTime: parseInt(getPlayerValue("TravelingTime", DefaultTravelingTime)),
        ComplexRoute: getPlayerBool("ComplexRoute") || getBool("IsDeer"),
        EndDate: parseInt(getPlayerValue("TransportEndDate", 0)),
        Antithief: getPlayerBool("Antithief"),
        AntithiefControlled: getPlayerBool("AntithiefControlled"),
        IsPremiunAccount: getPlayerBool("IsPremiunAccount"),
        IsDeer: getBool("IsDeer")
    };
    if(mountInfo.IsDeer) {
        const deerTravelingTime = DefaultTravelingTime * 0.2;
        if(mountInfo.TravelingTime > deerTravelingTime) {
            mountInfo.TravelingTime = deerTravelingTime;
        }
    }
    //console.log(mountInfo);
    return mountInfo;
}
function processHouseInfo() {
    if(location.pathname == '/house_info.php') {
        const houseId = getUrlParamValue(location.href, "id");
        const hostDiv = document.querySelector("div#tt");
        const container = getParent(hostDiv, "table");
        const loc = container.querySelector("a[href^='map.php?cx=']");
        const locationNumber = getLocationNumberFromMapUrlByXy(loc.href);
        const ownerName = container.querySelector("a[href^='pl_info.php?id=']").querySelector("b").innerText;
        const hostName = hostDiv.querySelector("b").innerText;
        let maxExpireDate;
        const guestRoomDivs = container.querySelectorAll("div[id^='gr']");
        for(const guestRoomDiv of guestRoomDivs) {
            const playerReference = guestRoomDiv.querySelector(`a[href='pl_info.php?id=${PlayerId}']`)
            if(playerReference && playerReference.nextSibling) {
                const re = /(\d{2}:\d{2} \d{2}-\d{2})/.exec(playerReference.nextSibling.nodeValue);
                if(re) {
                    const expireDate = parseDate(re[1], true);
                    if(!maxExpireDate || maxExpireDate < expireDate) {
                        maxExpireDate = expireDate;
                    }
                }
            }
        }
        const guestInfo = getGuestInfo(locationNumber);
        if(maxExpireDate) {
            guestInfo[houseId] = { HostInfo: `${ownerName} (${hostName})`, ExpireDate: maxExpireDate.toJSON() };
        }
        setPlayerValue(`GuestInfo${locationNumber}`, JSON.stringify(guestInfo));
        //console.log(guestInfo);
    }
}
function getGuestInfo(locationNumber) {
    if(getPlayerValue(`GuestInfo${locationNumber}`)) {
        const now = new Date();
        const guestInfo = JSON.parse(getPlayerValue(`GuestInfo${locationNumber}`));
        for(const guestInfoKey in guestInfo) {
            if(new Date(guestInfo[guestInfoKey].ExpireDate) < now) {
                var repackNeeded = true;
                delete guestInfo[guestInfoKey];
            }
        }
        const newKeys = Object.keys(guestInfo);
        if(repackNeeded) {
            if(newKeys.length == 0) {
                deletePlayerValue(`GuestInfo${locationNumber}`);
            } else {
                setPlayerValue(`GuestInfo${locationNumber}`, JSON.stringify(guestInfo));
            }
        }
        if(newKeys.length > 0) {
            return guestInfo;
        }
    }
    return {};
}
function createPatrolRoute() {
    const transporterLocations = Array.from(document.querySelectorAll("td[id^=transporterLocation]")).filter(x => parseInt(x.id.replace("transporterLocation", "")) < 100);
    const patrolRouteEnabled = getPlayerBool("PatrolRouteEnabled");
    transporterLocations.forEach(x => addElement("input", { type: "checkbox", id: `patrolRouteCheckbox${x.id.replace("transporterLocation", "")}`, name: "patrolRouteCheckbox", style: `float: left; ${patrolRouteEnabled ? "" : "display: none;"}` }, x));
    //transporterLocations.forEach(x => addElement("input", x, { type: "checkbox", id: `patrolRouteCheckbox${x.id.replace("transporterLocation", "")}`, name: "patrolRouteCheckbox", style: `position: absolute; top: ${x.getBoundingClientRect().top + 1}px; left: ${x.getBoundingClientRect().left + 1}px;${patrolRouteEnabled ? "" : "display: none;"}` }));
    const patrolRouteCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox][name=patrolRouteCheckbox]"));
    //console.log(patrolRouteCheckboxes);
    const patrolRoute = JSON.parse(getPlayerValue("PatrolRoute", "[]"));
    patrolRouteCheckboxes.forEach(x => {
        x.checked = patrolRoute.includes(parseInt(x.id.replace("patrolRouteCheckbox", "")));
        x.addEventListener("click", function(e) { e.stopPropagation(); repackPatrolRoute(); });
    });
}
function togglePatrolRoute() {
    const patrolRouteEnabled = getPlayerBool("PatrolRouteEnabled");
    const patrolRouteCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox][name=patrolRouteCheckbox]"));
    patrolRouteCheckboxes.forEach(x => { x.style.display = patrolRouteEnabled ? "" : "none"; });
}
function repackPatrolRoute() {
    const checkedPatrolRouteCheckboxes = Array.from(document.querySelectorAll("input:checked[type=checkbox][name=patrolRouteCheckbox]"));
    //console.log(checkedPatrolRouteCheckboxes);
    let patrolRouteLocations = checkedPatrolRouteCheckboxes.map(x => parseInt(x.id.replace("patrolRouteCheckbox", "")));
    //console.log(patrolRouteLocations);
    const patrolRoute = [];
    let currentRoutePoint;
    let i = 0;
    while(patrolRouteLocations.length > 0) {
        const nearestLocations = currentRoutePoint ? getLocationsSortedByDistance(currentRoutePoint).slice(1) : [patrolRouteLocations[0]];
        //console.log(`currentRoutePoint: ${currentRoutePoint}`);
        //console.log(nearestLocations);
        for(const nearestLocation of nearestLocations) {
            const index = patrolRouteLocations.indexOf(parseInt(nearestLocation));
            if(index > -1) {
                patrolRoute.push(patrolRouteLocations[index]);
                currentRoutePoint = patrolRouteLocations[index];
                patrolRouteLocations.splice(index, 1);
                //console.log(patrolRouteLocations);
                break;
            }
        }
        i++;
        if(i > 26) {
            break;
        }
    }
    //console.log(patrolRoute);
    setPlayerValue("PatrolRoute", JSON.stringify(patrolRoute));
    document.getElementById("togglePatrollingButton").title = JSON.parse(getPlayerValue("PatrolRoute", "[]")).join("->");
}
function togglePatrolling() {
    if(getPlayerBool("IsPatrolling")) {
        deletePlayerValue("IsPatrolling");
    } else {
        setPlayerValue("IsPatrolling", true);
    }
    checkPatrolling();
    document.getElementById("togglePatrollingButton").value = getPlayerBool("IsPatrolling") ? (isEn ? "Stop patrolling" : "Остановить патрулирование") : (isEn ? "Start patrolling" : "Начать патрулирование");
}
function checkPatrolling() {
    // Идем в патрулирование если, либо нет охот, либо они скрыты
    if(getPlayerBool("IsPatrolling") && !mooving && (getPlayerBool("HideHuntBlock") || document.getElementById("next_ht_new"))) {
        const patrolRoute = JSON.parse(getPlayerValue("PatrolRoute", "[]"));
        if(patrolRoute.length > 1) {
            let nextLocation;
            const index = patrolRoute.indexOf(parseInt(playerLocationNumber));
            if(index > -1) {
                nextLocation = index < patrolRoute.length - 1 ? patrolRoute[index + 1] : patrolRoute[0];
            } else {
                nextLocation = patrolRoute[0];
            }
            if(nextLocation) {
                //console.log(`nextLocation: ${nextLocation}, start in ${getPlayerValue("PatrollingPause", 5)} seconds`);
                setTimeout(function() { if(getPlayerBool("IsPatrolling")) { tryMoving(nextLocation); } }, parseInt(getPlayerValue("PatrollingPause", 5)) * 1000);
            }
        }
    }
}
function getHorseImageData() { 
    return resourcesPath3 + "/i/combat/map/navigator_btn_horseman.png";
    //return "data:image/png;base64,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";
}
// API
function getServerTime() { return Date.now() - parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
// dateString - игровое время, взятое со страниц игры. Оно всегда московское
// Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function getURL(url) { window.location.href = url; }
async function loadFactories() {
    let selectedJobDiv = document.querySelector("div.job_fl_btn.show_hint.job_fl_btn_selected");
    if(!selectedJobDiv) {
        return; // Мы в пути
    }
    let currentFactoryType = getUrlParamValue(selectedJobDiv.parentNode.href, "st");
    const viewingLocationNumber = getLocationNumberFromMapUrlByXy(selectedJobDiv.parentNode.href);
    let indexOfCurrentFactoryType = factoryTypes.indexOf(currentFactoryType);
    if(indexOfCurrentFactoryType == -1) {
        return;
    }
    const mapRightBlock = document.getElementById("map_right_block");
    //const mapRightBlockInside = document.getElementById("map_right_block_inside");
    //console.log(`${mapRightBlock.id}, offsetHeight: ${mapRightBlock.offsetHeight}, height: ${mapRightBlock.style.height}`);
    //console.log(`${mapRightBlockInside.id}, offsetHeight: ${mapRightBlockInside.offsetHeight}, height: ${mapRightBlockInside.style.height}`);
    let mapRightBlockHeight = mapRightBlock.offsetHeight;
    let mainFactoriesTable = mapRightBlock.querySelector("table.wb");
    if(!mainFactoriesTable) {
        return;
    }
    let mapRef = document.querySelector("a[href^='map.php?cx=']");
    let x = getUrlParamValue(mapRef.href, "cx");
    let y = getUrlParamValue(mapRef.href, "cy");
    let factoriesTableContainer = mainFactoriesTable.parentNode;
    const factoryTables = { };
    factoryTables[currentFactoryType] = mainFactoriesTable;
    for(const factoryType of factoryTypes) {
        if(factoryType != currentFactoryType && getPlayerBool("Load" + factoryType) && getValue(`LastDetectedEmptyFactoriesDate_${factoryType}${viewingLocationNumber}`, 0) + 1000 * 60 * 60 * 24 * 30 < Date.now()) {
            const doc = await getRequest(`/map.php?cx=${x}&cy=${y}&st=${factoryType}`);
            const docMapRightBlock = doc.getElementById("map_right_block");
            factoryTables[factoryType] = docMapRightBlock.querySelector("table.wb");
        }
    }
    for(let i = 0; i < factoryTypes.length; i++) {
        let tableElement = factoryTables[factoryTypes[i]];
        if(!tableElement) {
            continue;
        }
        const isTableEmpty = tableElement.rows.length <= 2 && (tableElement.rows.length < 2 || tableElement.rows[1].cells.length == 0);
        if(isTableEmpty) {
            setValue(`LastDetectedEmptyFactoriesDate_${factoryTypes[i]}${viewingLocationNumber}`, Date.now());
        } else if(getValue(`LastDetectedEmptyFactoriesDate_${factoryTypes[i]}${viewingLocationNumber}`)) {
            deleteValue(`LastDetectedEmptyFactoriesDate_${factoryTypes[i]}${viewingLocationNumber}`);
        }
        if(!isTableEmpty) {
            if(indexOfCurrentFactoryType < i) {
                factoriesTableContainer.appendChild(tableElement)
                mapRightBlockHeight += tableElement.offsetHeight;
            }
            if(indexOfCurrentFactoryType > i) {
                factoriesTableContainer.insertBefore(tableElement, mainFactoriesTable);
                mapRightBlockHeight += tableElement.offsetHeight;
            }
        } else if(indexOfCurrentFactoryType == i) {
            mapRightBlockHeight -= mainFactoriesTable.offsetHeight;
            factoriesTableContainer.removeChild(mainFactoriesTable); // Если текущий список предприятий - пустой, то уберем его
        }
    }
    mapRightBlock.style.height = `${mapRightBlockHeight}px`;
}
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function observe(target, handler, config = { childList: true, subtree: true }) {
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        observer.observe(target, config);
    });
    ob.observe(target, config);
}
async function initUserName() {
    if(getValue("TransporterUserName")) {
        deleteValue("UserName");
        deleteValue("TransporterUserName");
    }
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function getStorageKeys(filter) { return listValues().filter(filter); }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return GM_getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { GM_setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return GM_deleteValue(`${key}${PlayerId}`); };
function listValues() { return GM_listValues(); }
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
