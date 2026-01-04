// ==UserScript==
// @name        Report Helper
// @version     1
// @description Ease farm evaluating report
// @author      ScriptAdam
// @namespace   ScriptAdam
// @license     MIT
// @include     https://*.klanlar.org/game.php?*&screen=report*view*
// @icon        https://img.icons8.com/cotton/64/000000/x-file.png
// @downloadURL https://update.greasyfork.org/scripts/461558/Report%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461558/Report%20Helper.meta.js
// ==/UserScript==

// Dont want to lookup game data for speeds
const world = document.URL.slice(8, 12);
const worldSpeed = 2;
const unitSpeed = 1 * worldSpeed;
const prodBuilding = [
	5, 30, 35, 41, 47, 55, 64, 74, 86, 100, 117, 136, 158, 184, 214, 249, 289, 337, 391, 455, 530, 616, 717, 833, 969,
	1127, 1311, 1525, 1774, 2063, 2400,
];
const storage = [
	0, 1000, 1229, 1512, 1859, 2285, 2810, 3454, 4247, 5222, 6420, 7893, 9705, 11932, 14670, 18037, 22177, 27266, 33523,
	41217, 50675, 62305, 76604, 94184, 115798, 142373, 175047, 215219, 264611, 325337, 400000,
];
const hide = [0, 150, 200, 267, 356, 474, 632, 843, 1125, 1500, 2000];
const production = prodBuilding.map((res) => res * worldSpeed);
const walkLC = 10 * unitSpeed;
const level = { wood: 0, stone: 0, iron: 0, storage: 0, hide: 0 };
const spy = { wood: 0, stone: 0, iron: 0 };
let attId, defId;

getBuildings();
getResources();
calcHaul();
prepTab();

function prepTab() {
	const lightPerHour = Math.ceil((production[level.wood] + production[level.stone] + production[level.iron]) / 80);
	const lightTotal = Math.ceil((spy.wood + spy.stone + spy.iron) / 80);

	const commandHourly =
		"https://" +
		world +
		".klanlar.org/game.php?village=" +
		attId +
		"&screen=place&target=" +
		defId +
		"&spy=1&light=" +
		lightPerHour;

	const commandTotal =
		"https://" +
		world +
		".klanlar.org/game.php?village=" +
		attId +
		"&screen=place&target=" +
		defId +
		"&spy=1&light=" +
		lightTotal;

	const tab = `
	<table style="border: 1px solid #ded3b9; width: 100%">
	<tr>
		<th>Saatlik:</th>
		<td style="text-align: center">
			<span class="nowrap"> <span class="icon header wood"></span>${production[level.wood]}</span>
			<span class="nowrap"> <span class="icon header stone"></span>${production[level.stone]}</span>
			<span class="nowrap"> <span class="icon header iron"></span>${production[level.iron]}</span>
		</td>
		<td>
			<span class="nowrap">
				<img
					src="https://dstr.innogamescdn.com/asset/0c86ab31/graphic/unit/unit_light.png"
					width="16px"
					class="faded"
				/>
				<i>${lightPerHour}</i>
				<a href="${commandHourly}" class="farm_icon farm_icon_a" style="float: right"></a>
			</span>
		</td>
	</tr>
	<tr>
		<th>Toplam:</th>
		<td style="text-align: center">
			<span style="width: 100%">
				<span class="icon header storage"></span>
				<b>${spy.wood + spy.stone + spy.iron}</b>
			</span>
		</td>
		<td>
			<span class="nowrap">
				<img src="https://dstr.innogamescdn.com/asset/0c86ab31/graphic/unit/unit_light.png" width="16px" />
				<i>${lightTotal}</i>
				<a href="${commandTotal}" class="farm_icon farm_icon_c" style="float: right"></a>
			</span>
		</td>
	</tr>
</table>
`;

	document.getElementById("attack_spy_resources").insertAdjacentHTML("afterbegin", tab);
}

// fill level object
function getBuildings() {
	const buildings = JSON.parse(document.getElementById("attack_spy_building_data").value);
	for (const building of buildings) {
		level[building.id] = building.level;
	}
}

// fill spy object
function getResources() {
	const spied = document.querySelector("#attack_spy_resources > tbody > tr > td").innerText.match(/[0-9.]+/g);
	if (!spied) return;
	spy.wood = parseInt(spied[0].replaceAll(".", ""));
	spy.stone = parseInt(spied[1].replaceAll(".", ""));
	spy.iron = parseInt(spied[2].replaceAll(".", ""));
}

function getWalkTime() {
	const coordsRegex = /[0-9]{3}\|[0-9]{3}/g;
	attId = document.querySelector("#attack_info_att .village_anchor").dataset.id;
	const attCoord = document.querySelector("#attack_info_att .village_anchor").innerText.match(coordsRegex)[0];
	defId = document.querySelector("#attack_info_def .village_anchor").dataset.id;
	const defCoord = document.querySelector("#attack_info_def .village_anchor").innerText.match(coordsRegex)[0];
	return (calculateDistance(attCoord, defCoord) * walkLC) / 60;
}

function calculateDistance(from, to) {
	const [x1, y1] = from.split("|");
	const [x2, y2] = to.split("|");
	const deltaX = Math.abs(x1 - x2);
	const deltaY = Math.abs(y1 - y2);
	return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function getReportAge() {
	const reportDateTimeArr = document.getElementsByClassName("small grey")[0].parentElement.innerText.split(" ");
	const reportTimeArr = reportDateTimeArr[3].split(":");
	let reportDateTime = new Date();
	reportDateTime.setHours(reportTimeArr[0]);
	reportDateTime.setMinutes(reportTimeArr[1]);
	reportDateTime.setSeconds(reportTimeArr[2]);
	const now = new Date();
	const yesterday = !(reportDateTimeArr[1].slice(0, 2) == now.getDate());
	const timeDiff = new Date(now - reportDateTime);
	return yesterday * 24 + timeDiff / 1000 / 60 / 60;
}

// Refactor this shit
function calcHaul() {
	const timeDiff = getReportAge() + getWalkTime();
	spy.wood = parseInt(
		Math.min(spy.wood + timeDiff * production[level.wood], storage[level.storage] - hide[level.hide])
	);
	spy.stone = parseInt(
		Math.min(spy.stone + timeDiff * production[level.stone], storage[level.storage] - hide[level.hide])
	);
	spy.iron = parseInt(
		Math.min(spy.iron + timeDiff * production[level.iron], storage[level.storage] - hide[level.hide])
	);
}
