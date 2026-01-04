// ==UserScript==
// @name		   HWM_MapMove
// @namespace	   HWM_MapMove
// @version		   0.49
// @description	   Сложный маршрут по карте без транспорта
// @author		   ZingerY
// @homepage	   http://ilovemycomp.narod.ru/HWM_MapMove.user.js
// @icon		   http://ilovemycomp.narod.ru/VaultBoyIco16.ico
// @icon64		   http://ilovemycomp.narod.ru/VaultBoyIco64.png
// @encoding	   utf-8
// @include		   https://www.heroeswm.ru/map.php*
// @include		   https://www.heroeswm.ru/object-info.php*
// @grant		   GM_xmlhttpRequest
// @grant		   GM_log
// @grant		   GM_listValues
// @grant		   GM_setValue
// @grant		   GM_getValue
// @grant		   GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/393979/HWM_MapMove.user.js
// @updateURL https://update.greasyfork.org/scripts/393979/HWM_MapMove.meta.js
// ==/UserScript==
 
(function() {
	var script_name = GM_info.script.name;
	var script_ver = GM_info.script.version;
	var obj_to, cur_sector;
	// Граф всех возможных путей перемещения по карте
	var hwm_map = [null,[null,null,["1-2",1],["1-3",1],["1-4",1.4],["1-5",1],["1-3-6",2],["1-7",1.4],["1-8",1],["1-3-9",2.4],["1-5-10",2],["1-11",1.4],["1-12",1.4],["1-8-13",2.4],["1-2-14",2],["1-2-15",2.4],["1-4-16",2.8],["1-2-14-17",3],["1-2-14-18",3.4],["1-5-19",2.4],["1-5-10-20",3.4],["1-5-19-21",3.8],["1-5-10-20-22",4.8],["1-12-23",2.8],["1-3-24",2.4],null,["1-5-26",2.4],["1-8-27",2]],
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
	var map_arr = {
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
		21: [52,53,"Fishing village","FsV","Рыбачье село"],
		22: [52,54,"Kingdom Castle","KiC","Замок Королевства"],
		23: [48,48,"Ungovernable Steppe","UnS","Непокорная Степь"],
		24: [51,48,"Crystal Garden","CrG","Кристальный Сад"],
		25: [0,0,"East Island","EsI","Восточный Остров"],
		26: [49,52,"The Wilderness","ThW","Дикие земли"],
		27: [48,50,"Sublime Arbor","SbA","Великое Древо"],
		length: 28,
	};
	if (typeof GM_getValue != 'function') {
		this.GM_getValue=function (key,def) {return localStorage[key] || def;};
		this.GM_setValue=function (key,value) {return localStorage[key]=value;};
		this.GM_deleteValue=function (key) {return delete localStorage[key];};
	}
	var transport = {moveTime: 120, diffRoute: false, checkTrans: false, dateEnd: Date.now()};
	transport.dateEnd = GM_getValue("dateEnd", Date.now());
	transport.checkTrans = GM_getValue("checkTrans", false);
	transport.diffRoute = GM_getValue("diffRoute", false);
	transport.moveTime = GM_getValue("moveTime", 120);
	checkTransport();
	cur_sector = GM_getValue("MoveTo_cur_sector", false);
	// Добавление кнопки перемещения на предприятие
	if (location.pathname=='/object-info.php') {
		var table = document.querySelector('table[width="600"]');
		if (table) {
			var check = /Вы находитесь в другом секторе/.test(table.innerHTML);
			if (check) {
				var parent = document.querySelector("a[href*='map.php?cx='][href*='&cy='][href*='&st=mn']");
				var cx_cy = /cx=(\d+)&cy=(\d+)/.exec( parent );
				for ( var i=1; i < map_arr.length; i++ ) {
					if ( cx_cy[1]==map_arr[i][0] && cx_cy[2]==map_arr[i][1] ) {
						var text_horse = "Перейти в " + map_arr[i][4] + " (" + map_arr[i][2] + ").";
						var add_transp = document.createElement('span');
						add_transp.id = "horse_obj";
						add_transp.style.cursor = "pointer";
						add_transp.innerHTML = '<img src="' + img_horse() + '" alt="' + text_horse + '" title="' + text_horse + '" align="absmiddle" height="15" width="15">&nbsp;&nbsp;';
						add_transp.onclick = function() {
							GM_setValue( "MoveTo_obj_to", "" + location.pathname + location.search );
							onMove(GetSectorNum());
						};
						parent.parentNode.insertBefore(add_transp, parent.previousSibling);
						break;
					}
				}
			}
		}
	}
	// Снятие артов перед перемещением
	var reArt = GM_getValue("reArt", true);
 
	var n = document.querySelector("#inside_map");
	if (n) {
		// Определение текущего сектора
		if(location.pathname == '/map.php' && location.search == '') {
			cur_sector = GetSectorNum();
			GM_setValue("MoveTo_cur_sector", cur_sector);
		} else {
			cur_sector = GM_getValue("MoveTo_cur_sector", false);
		}
        n.style.flexWrap = 'wrap';
        var main = document.createElement("div");
        main.style.order = '10';
        main.style.width = '50%';
        n.appendChild(main);
		var title = document.createElement("div");
		title.style.textAlign = 'center';
		title.innerHTML = script_name+" <b style='color: #0070FF'>"+script_ver+"</b>";
		main.appendChild(title);
		var setting = document.createElement("div");
		setting.innerHTML = "<input id='reArt' type='checkbox' "+(reArt?"checked":"")+">Снимать все вещи перед перемещением";
		setting.style.textAlign = 'center';
		main.appendChild(setting);
		var input = document.querySelector("#reArt");
		input.onclick = function() {
			GM_setValue("reArt", this.checked);
			reArt = this.checked;
		};
		var tElem = document.createElement("div");
		tElem.style.margin = '0px -10px';
		var str = "<table>";
		for (var y = 48; y < 55; y++ ) {
			str += "<tr>";
			for(var x = 48; x < 54; x++)
				str += "<td id='s_"+x+"_"+y+"'></td>";
			str += "</tr>";
		}
		str += "</table>";
		tElem.innerHTML = str;
		main.appendChild(tElem);
 
		for (var j = 1; j < map_arr.length; j++) {
			if (j == 25) continue;
			var elem = document.createElement("div");
			elem.title = "Перейти в "+map_arr[j][4];
			elem.dataset.sector = j;
			elem.style.cursor = "pointer";
			elem.style.fontWeight = "bold";
			elem.style.textAlign = "center";
			elem.style.border = "1px solid #000";
			elem.style.padding = "3px";
			if (j == cur_sector) {
				elem.style.color = "red";
			} else {
				elem.onclick = function () {
					onMove(this.dataset.sector);
				}
			}
			elem.onmouseenter = function () {
				this.style.border = "1px solid #fff";
			};
			elem.onmouseleave = function () {
				this.style.border = "1px solid #000";
			};
			//elem.classList.add("map_sector");
			elem.innerHTML = map_arr[j][4];
			var tbtd = document.querySelector("#s_"+map_arr[j][0]+"_"+map_arr[j][1]);
			tbtd.appendChild(elem);
		}
 
 
		var goSector = GM_getValue("Moving", null);
		if (goSector && cur_sector) {
			if (goSector == cur_sector) {
				GM_deleteValue("Moving");
				goSector = false;
			} else if (cur_sector in hwm_map && goSector in hwm_map[cur_sector] && hwm_map[cur_sector][goSector]) {
				var way = hwm_map[cur_sector][goSector][0];
				var nextSector = way.split('-')[1];
				moveTo(cur_sector,nextSector);
			}
		}
		// Перемещение к объекту после прибытия
		if (!goSector) {
			obj_to = GM_getValue("MoveTo_obj_to");
			var nomove = document.querySelector("tr[valign=top]>td>center");
			if (nomove && obj_to) {
				GM_deleteValue("MoveTo_obj_to");
				setTimeout(function() { window.location = obj_to; }, 300);
			}
		}
	}
	// Начало перемещения по кнопке
	function onMove(toSector) {
		GM_setValue("Moving",toSector);
		if (reArt) {
			reMoveArts();
		}
		if (transport.diffRoute) {
			moveTo(cur_sector,toSector);
			return;
		}
		if(cur_sector in hwm_map && toSector in hwm_map[cur_sector]) {
			var way = hwm_map[cur_sector][toSector][0];
			var nextSector = way.split('-')[1];
			moveTo(cur_sector,nextSector);
		}
	}
	// Получение номера текущего сектора
	function GetSectorNum() {
		var parent = document.querySelector("a[href*='map.php?cx='][href*='&cy='][href*='&st=mn']");
		var cx_cy = /cx=(\d+)&cy=(\d+)/.exec( parent );
		for ( var i=1; i < map_arr.length; i++ ) {
			if ( cx_cy[1]==map_arr[i][0] && cx_cy[2]==map_arr[i][1] ) {
				return i;
			}
		}
	}
	// Получение rand числа для отправки в запросе
	function getrandom(k1, k2, k3) {
		var loc1 = ((k1 * 153 + k2 * 234) % 333 * 234 + k3 % 346234 - 142) % 10000 / 10000;
		return loc1;
	}
	// Запрос для передвижения
	function moveTo(sector_start,sector_end) {
		var randomnum = Math.random();
		GM_xmlhttpRequest(
			{
				method: 'GET',
				url: "https://www.heroeswm.ru/move_sector.php?id="+sector_end+"&rand="+getrandom(sector_start, sector_end, randomnum),
				headers: {
					"Pragma": "no-cache",
					"Cache-Control": "no-cache",
					"X-Requested-With": "ShockwaveFlash/25.0.0.171",
					"Upgrade-Insecure-Requests": "1",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
					"Referer": "https://www.heroeswm.ru/map.php"
				},
				onload: function(result) {
					if (result) {
						setInterval(function() {document.location.href = document.location.href;}, 1000);
					}
				}
			});
	}
	// Запрос на снятие всех артов
	function reMoveArts() {
		GM_xmlhttpRequest({
				method: 'GET',
				url: "https://www.heroeswm.ru/inventory.php?all_off=100&js=1&rand=" + Math.random() * 1000000, 
				onload: function(result) {
					if (result) {
						console.log("done");
					}
				}
			});
	}
	// Проверка транспорта
	function checkTransport() {
		if (transport.dateEnd > Date.now()) return;
		GM_xmlhttpRequest({
				method: 'GET',
				url: "https://www.heroeswm.ru/shop.php?cat=transport",
				responseType: "document",
				onload: function(result) {
					var doc = result.response;
					var table = doc.querySelector('table.wbwhite[cellpadding="5"]');
					for (let row of table.rows) {
						if(row.cells[6].innerText.trim()) {
							transport.moveTime = Number.parseInt(row.cells[2].innerText);
							transport.diffRoute = !row.cells[3].innerText;
							transport.checkTrans = true;
							break;
						}
					}
					if (transport.checkTrans) {
						GM_setValue("checkTrans", transport.checkTrans);
						GM_setValue("diffRoute", transport.diffRoute);
						GM_setValue("moveTime", transport.moveTime);
						GM_xmlhttpRequest({
							method: 'GET',
							url: "https://www.heroeswm.ru/home.php",
							responseType: "document",
							onload: function(result) {
								var doc = result.response;
								var dateTitle = doc.querySelector("img[src*='transport']");
								if (!dateTitle) return;
								dateTitle = dateTitle.title.split(' ');
								var dateArr = dateTitle[2].split('-');
								var temp = dateArr[0];
								dateArr[0] = dateArr[1];
								dateArr[1] = temp;
								var date = new Date(dateArr.join('-') + ' ' + dateTitle[3]);
								transport.dateEnd = date.getTime();
								GM_setValue("dateEnd", transport.dateEnd);
								console.log(transport);
							}
						});
					}
				}
			});
	}
	// Иконка лошадки
	function img_horse() {
		return "data:image/png;base64,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";
	}
})();