// ==UserScript==
// @name         maelstroom.net 強化器
// @namespace    Tast
// @version      0.15
// @description  maelstroom.net 強化
// @author       Tast
// @match        *://maelstroom.net/*
// @grant		 GM_getValue
// @grant		 GM_setValue
// @grant		 GM_getResourceURL
// @grant		 GM_registerMenuCommand
// @grant		 GM_xmlhttpRequest
// @run-at 		 document-start
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require 	 https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require 	 https://update.greasyfork.org/scripts/482599/1298245/smart%20table.js
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @resource 	 JQUI	https://code.jquery.com/ui/1.12.0-rc.2/themes/smoothness/jquery-ui.css
// @resource 	 css-smart-table	https://raw.githubusercontent.com/vigivl/smart-table/master/smart-table.css
// @downloadURL https://update.greasyfork.org/scripts/482600/maelstroomnet%20%E5%BC%B7%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482600/maelstroomnet%20%E5%BC%B7%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==
//======================================================================================================================

// @require 	 https://code.jquery.com/ui/1.12.0-rc.2/jquery-ui.min.js

// https://www.netyea.com/state-117.html
// http://www.htmleaf.com/jQuery/Table/smart-table.html
// https://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
// https://medium.com/itsems-frontend/javascript-es6-spread-rest-operator-de8e0e020792
// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions
// https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/arrow_function.html

//======================================================================================================================

let localization = {};
localization.MainPage = {
	 "Books / Circumstance :" 		: "書籍 / 特殊環境 :"
	,"Difficulty :" 				: "難度 :"
	,"Exact Circumstance :"			: "特殊環境精確條件 :"
	,"Flash Missions Only :"		: "只有閃擊任務 :"
	,"Filter Low-Int missions :"	: "過濾低強度任務 :"
	,"Filter Hazardous missions :"	: "過濾高難度任務 :"
	,"Discord Timestamps :"			: "使用時間戳格式 :"
	,">No Filter<"					: ">無過濾<"
	,">Requires Circumstance<"		: ">包括特殊環境<"
	,">Requires Book<"				: ">包括書籍<"
	,">Requires Either<"			: ">特殊環境和書籍都不要<"
	,">Requires Both<"				: ">特殊環境和書籍都要<"
	,">Sedition<"					: ">1.暴動<"
	,">Uprising<"					: ">2.起義<"
	,">Malice<"						: ">3.惡毒<"
	,">Heresy<"						: ">4.叛亂<"
	,">Damnation<"					: ">5.詛咒<"
	,">Hi-Intensity Shock Troop Gauntlet<"	: ">高強度突擊兵試煉<"
	,">Shock Troop Gauntlet<"				: ">突擊兵試煉<"
	,">Hi-Intensity Engagement Zone<"		: ">高強度交戰區<"
	,">Elite Resistance<"					: ">精英抵抗軍<"
	,">Hi-Intensity Ventilation Purge<"		: ">高強度起霧<"
	,">Ventilation Purge<"					: ">清掃通風/起霧<"
	,">Low-Intensity Shock Troop Gauntlet<"	: ">低強度突擊兵試煉<"
	,">Low-Intensity Engagement Zone<"		: ">低強度交戰區<"
	,">Low-Intensity Ventilation Purge<"	: ">低強度起霧<"
	,">Power Supply/Hunting Ground/Snipers<": ">關燈/狗場/狙擊<"
	,"value=\"Filter Missions\""			: "value=\"開始過濾任務\""
};
localization.Map_name = {
	 "Archivum Sycorax"				: "[破壞] 塞科拉克斯檔案館"
	,"Ascension Riser 31"			: "[突襲] 31號升降機"
	,"Chasm Logistratum"			: "[突襲] 深淵後勤處"
	,"Chasm Station HL-16-11"		: "[刺殺] 隘口站 HL-16-11"
	,"Comms-Plex 154/2f"			: "[破壞] 通信站 154/2f"
	,"Consignment Yard HL-17-36"	: "[突襲] 託運站 HL-17-36"
	,"Enclavum Baross"				: "[打擊] 巴羅斯飛地"
	,"Excise Vault Spireside-13"	: "[突襲] 切除倉庫頂樓13層"
	,"Hab Dreyko"					: "[調查] 德雷克居住區"
	,"Magistrati Oubliette TM8-707"	: "[刺殺] 法庭密牢 TM8-707"
	,"Mercantile HL-70-04"			: "[突襲] HL-70-04貿易區"
	,"Power Matrix HL-17-36"		: "[修復] 能量矩陣 HL-17-36"
	,"Refinery Delta-17"			: "[擾亂] D17-精煉廠"
	,"Relay Station TRS-150"		: "[擾亂] 中繼站 TRS-150"
	,"Silo Cluster 18-66/a"			: "[打擊] 水倉 18-66/a"
	,"Smelter Complex HL-17-36"		: "[打擊] 冶煉廠大樓 HL-17-36"
	,"Vigil Station Oblivium"		: "[破壞] 遺忘守夜站"
	,"Warren 6-19"					: "[擾亂] 窄巷區6-19"

	,"km_enforcer_twins"			: "[刺殺] 雙頭犬攻勢 (特別任務)"
};
localization.Map_type = {
	 "Repair"		: "修復(Repair)"
	,"Assassination": "刺殺(Assassination)"
	,"Strike"		: "打擊(Strike)"
	,"Disruption"	: "擾亂(Disruption)"
	,"Espionage"	: "破壞(Espionage)"
	,"Raid"			: "突襲(Raid)"
	,"Investigation": "調查(Investigation)"
};
localization.Difficulty = {
	 "Sedition"	: "1.暴動(Sedition)"
	,"Uprising"	: "2.起義(Uprising)"
	,"Malice"	: "3.惡毒(Malice)"
	,"Heresy"	: "4.叛亂(Heresy)"
	,"Damnation": "5.詛咒(Damnation)"
};
localization.Book_type = {
	"No books"			: "沒有書啦"
   ,"Recover Scriptures": "聖書"
   ,"Seize Grimoires"	: "魔法書"
};
localization.Circumstance = {
	 "Default" 					: "----"

	, "Hi-Intensity Shock Troop Gauntlet": "高強度突擊兵試煉"
	, "Hi-Intensity Sniper Gauntlet"     : "高強度狙擊手試煉"

	, "toxic_gas_twins_01"          : "雙子吸毒啦"
	, "toxic_gas_more_resistance_01": "高強度毒氣"
	, "toxic_gas_less_resistance_01": "低強度毒氣"
	, "toxic_gas_01"                : "正常強度毒氣"

	, "high_flash_mission_16"       : "高強度專家-瘟疫毒氣-狗場-變種"
	, "flash_mission_18"            : "專家-毒氣-專家巨獸-狙擊"

	, "Shock Troop Gauntlet"     : "突擊兵試煉"
	, "Shock Troop"              : "突擊兵"
	, "Hi-Intensity"             : "高強度"
	, "Low-Intensity"            : "低強度"
	, "Engagement Zone"          : "交戰區"
	, "Gauntlet"                 : "試煉"
	, "Power Supply Interruption": "關燈"
	, "Hunting Grounds"          : "狗場"
	, "Monstrous"                : "巨獸"
	, "Mutants"                  : "變種"
	, "Poxbursters"              : "自爆"
	, "Extra Grenades & Barrels" : "多手雷多桶"
	, "Extra Barrels"            : "多桶"
	, "Extra Grenades"           : "多手雷"
	, "Barrels"                  : "多桶"
	, "Nurgle-Blessed"           : "納祝"
	, "Scab Enemies Only"        : "血痂"
	, "Cooldowns Reduced"        : "技冷"
	, "With Snipers"             : "狙擊"
	, "Snipers"                  : "狙擊"
	, "Ventilation Purge"        : "起霧"
	, "Melee"                    : "近戰"
	, "Ranged"                   : "遠程"
};

function localization_for_Circumstance(text){
	Object.keys(localization.Circumstance).forEach(key => {
		text = text.replaceAll(key, localization.Circumstance[key]);
	});
	return text;
};

function Info_localization(info_text){
	Object.keys(localization).forEach(key => {
		Object.keys(localization[key]).forEach(subkey => {
			//console.error(subkey, localization[key][subkey]);
			if(info_text.match(subkey)){
				info_text = info_text.replaceAll(subkey, localization[key][subkey] );
			};
		});
	});

	// localization.Map_type.forEach((item, index) => {});
	return info_text;
};

//Info_RePresent("km_enforcer_twins · Malice · toxic_gas_twins_01 · No books · Started 8.1hrs ago");
function Info_RePresent(info_text){
	//console.info("Info_RePresent", info_text);
	let text_splitted = info_text.split(" · ");
	let info_object = {
		 Map_type		: "--"
		,Difficulty		: "--"
		,Circumstance	: "--"
		,Book_type		: "--"
	};

	for(let i = 1; i < text_splitted.length - 1; i++){
		//console.info(i, text_splitted[i]);
		let is_key_Detected = false;
		$.each(localization, (key, value) => { 
			//console.info(key, value);
			let is_SubKey_Detected = false;
			$.each(localization[key], (subkey, subvalue) => { 
				//console.info(subkey, subvalue);
				if(localization[key][text_splitted[i]]){
					//console.info(text_splitted[i], localization[key][text_splitted[i]]);
					//info_object[key] = localization[key][text_splitted[i]];
					info_object[key] = text_splitted[i];
					//console.info(key, localization[key][text_splitted[i]]);
					is_SubKey_Detected = true;
					//return false;
				};
			});
			if(is_SubKey_Detected) return false;
		});
		if(is_key_Detected) break;

		/*
		Object.keys(localization).forEach(key => { // Map_name, Map_type, Difficulty, Book_type, Circumstance
			Object.keys(localization[key]).forEach(subkey => {
				console.info(subkey, localization[key][subkey]);
			});
		});
		*/
	};

	//console.info(info_object);
	info_text = `${text_splitted[0]} · ${info_object.Map_type} · ${info_object.Difficulty} · ${info_object.Circumstance} · ${info_object.Book_type} · ${text_splitted[text_splitted.length - 1]}`;
	//console.info(info_text);
	return info_text;
};

$("document").ready(() => {
	$('head').append(`
	<link rel="stylesheet" href="${GM_getResourceURL("css-smart-table")}" type="text/css" />
	<script>
			function triggerCopy(element) {
			//const element = document.querySelector(e);
			const storage = document.createElement('textarea');
			storage.value = element.innerHTML;
			element.appendChild(storage);
			storage.select();
			storage.setSelectionRange(0, 99999);
			document.execCommand('copy');
			element.removeChild(storage);
		}
	</script>
	`);
});

// https://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
/*
var getTextNodesIn = el => {
    return $(el).find(":not(iframe)").addBack().contents().filter(() => {
        return this.nodeType == 3;
    });
};
*/

// km_enforcer_twins · Malice · toxic_gas_twins_01 · No books · Started 8.1hrs ago
// km_enforcer_twins · Malice · toxic_gas_twins_01 · Started <t:1702986660:R>
const regex_mission_info1 = /(?<Map_name>.+) · (?<Map_type>.+) · (?<Difficulty>.+) · (?<Circumstance>.+) · (?<Book_type>.+) · Started (?:(?<Hour>.+)hrs ago|&lt;t:(?<Timestamp>\d+):R&gt;)/;
const regex_mission_uuid = /\/mmtimport (?<uuid>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/;

let pageLauncher = {};
pageLauncher["error"] = () => {
	console.error("no function for this page: " + window.location.href);
};

pageLauncher["maelstroom.net"] = () => {
	let bodyHTML = $("body").html();
	$.each(localization.MainPage, (key, value) => { 
		bodyHTML = bodyHTML.replaceAll(key, value);
	});
	$("body").html(bodyHTML);
	bodyHTML = null;
};

pageLauncher["filtered.php"] = () => {
	let mission_text_by_line = $("body").html().split("<br>");

	let missions_info = [];
	let missions_uuid = [];
	let missions_counter = { info:0, uuid:0 };
	let parse_fail_the_emperor = "";

	let x = 0;
	while (x < mission_text_by_line.length){
		let line0_info = mission_text_by_line[x] 	 || "";
		let line1_uuid = mission_text_by_line[x + 1] || "";
		
		if(line0_info.split(" · ").length <= 5 && line0_info.split(" · ").length >= 2){
			//console.error("length", line0_info.split(" · ").length);
			line0_info = Info_RePresent(line0_info);
		};

		let info = regex_mission_info1.exec(line0_info);
		let uuid = regex_mission_uuid.exec(line1_uuid);
		if(info) missions_counter.info++;
		if(uuid) missions_counter.uuid++;
		if(info && uuid){
			//console.info(info + " - " + line0_info);
			//console.info(uuid + " - " + line1_uuid);
			info.groups.Book_type = info.groups.Book_type || "--";
			missions_info.push(info);
			missions_uuid.push(uuid);
		}
		else if(line1_uuid.match("\/mmt ")){
			console.error(info + " - " + line0_info);
			console.error(uuid + " - " + line1_uuid);
			parse_fail_the_emperor += `${line0_info}<br>${line1_uuid}<br>`;
		}
		//console.error("-------------");

		x += 2;
	}

	if(!missions_info.length){
		console.error("missing information for missions_info");
		return;
	}
	else console.info("missions info parsed: " + missions_counter.info + " -> " + missions_info.length);

	if(!missions_uuid.length){
		console.error("missing information for missions_uuid");
		return;
	}
	else console.info("missions uuid parsed: " + missions_counter.uuid + " -> " + missions_uuid.length);

	//======================================================================================================================
	//======================================================================================================================

	$("body").html(`
	<table class="st-table">
	<thead>
		<tr>
			<th>任務名稱</th>
			<th>任務種類</th>
			<th>任務難度</th>
			<th>特殊環境</th>
			<th>書籍類型</th>
			<th class="st-number">任務時間</th>
			<th>任務代碼</th>
		</tr>
	</thead>
	<tbody id="missions_tbody">
	</tbody>
	</table>   
	<div id="mission_info_parse_failed">
		${Info_localization(parse_fail_the_emperor)}
	</div>
	`);

	let tbody_append_element = "";
	for (let i = 0 ; i < missions_info.length ; i++){
		//let Hour = missions_info[i].groups.Hour.match(".") ? missions_info[i].groups.Hour : missions_info[i].groups.Hour + ".0"
		//parseFloat(info.groups.Hour.replace("-",""));
		//console.log(Hour);

		let Hour = missions_info[i].groups.Hour ? missions_info[i].groups.Hour + " 小時前" : null;
		let DateTime = 
			moment(missions_info[i].groups.Timestamp * 1000)
			.format(`[<font color="darkblue">]YYYY.MM.DD[</font>][&nbsp;&nbsp;&nbsp;][<font color="darkgreen">]HH:mm[</font>]`);

		tbody_append_element += `
		<tr>
			<td>${localization.Map_name[missions_info[i].groups.Map_name] || missions_info[i].groups.Map_name}</td>
			<td>${localization.Map_type[missions_info[i].groups.Map_type] || missions_info[i].groups.Map_type}</td>
			<td>${localization.Difficulty[missions_info[i].groups.Difficulty] || missions_info[i].groups.Difficulty}</td>
			<td>${localization_for_Circumstance(missions_info[i].groups.Circumstance)}</td>
			<td>${localization.Book_type[missions_info[i].groups.Book_type] || missions_info[i].groups.Book_type}</td>
			<td>${Hour||DateTime||missions_info[i].groups.Timestamp}</td>
			<td><a onclick="triggerCopy(this);" href="javascript:void();">${missions_uuid[i].groups.uuid}</a></td>
		</tr>`
	}

	$("#missions_tbody").append(tbody_append_element);

	$('.st-table').smartTable({
		 filterOn: true
		,hideColumnOn: false
		,paginationPerPage: 3000
		,zebraClass: "zebra-odd-bg"
	});

	mission_text_by_line   = null;
	parse_fail_the_emperor = null;
	tbody_append_element   = null;
};

$(window).bind('load', () => {
	let pageName = /^.+:\/\/(?:(?<base>maelstroom.net)(?:\/$|$)|.+\/(?<php>.+\.php))/.exec(window.location.href);
	pageLauncher[pageName.groups.php || pageName.groups.base || "error"]();
});


/*
// https://stackoverflow.com/questions/1549779/is-it-possible-to-use-workers-in-a-greasemonkey-script
var blob = new Blob(["onmessage = function(e){postMessage('whats up?');console.log(e.data)}"], {type: 'text/javascript'})

var url = URL.createObjectURL(blob)

var worker = new Worker(url)

worker.onmessage = function(e){
  console.log(e.data) 
}

worker.postMessage('hey there!')
*/