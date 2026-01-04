// ==UserScript==
// @name        TaxBattlesCalculator
// @author      Loafoant
// @namespace   clan
// @description Calculate stats on Tax Battles
// @include     https://www.heroeswm.ru/clan_info.php*
// @include     https://www.lordswm.com/clan_info.php*
// @version     1.0.1
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/437063/TaxBattlesCalculator.user.js
// @updateURL https://update.greasyfork.org/scripts/437063/TaxBattlesCalculator.meta.js
// ==/UserScript==

let clanLogLink = Array.from(document.getElementsByTagName("a")).find((link) =>
	link.href.includes("clan_log.php")
);
let date = new Date();
let today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
	2,
	"0"
)}-${String(date.getDate()).padStart(2, "0")}`;
var myform = document.createElement("form");
myform.id = "scanForm";
myform.innerHTML = `
    <table>
      <tr>
        <td bgcolor="#6b6c6a" align="center" colspan="2">
          <b style="color:white;">Calculate tax battles</b>
        </td>
      </tr>
      <tr>
        <td>From: </td>
        <td>
          <input type="date" id="startTime" required max="${today}" />
        </td>
      </tr>
      <tr>
        <td>To: </td>
        <td>
          <input type="date" id="endTime" required max="${today}" />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <center>
            <button id="startScan" type="submit">Start</button>
          </center>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <center>
            <div id="notice-tax-battles"></div>
          </center>
        </td>
      </tr>
    </table>
    `;
clanLogLink.parentNode.appendChild(myform);

const CLAN_URI = document.location.pathname.slice(1) + document.location.search;
let STATS_BY_PLAYER = {};

const notice = document.getElementById("notice-tax-battles");

async function scanTaxLog(startTime, endTime) {
	STATS_BY_PLAYER = {};
	let allHistoryLinks = [];
	for (let scanPage = 0; scanPage < 10000; scanPage++) {
		notice.textContent = `Scanning page ${scanPage}`;
		let url = `${document.location.origin}/taxlog.php?page=${scanPage}`;
		let html = await fetch(url)
			.then((response) => response.text())
			.catch((error) => {
				console.log(error);
				return "<html></html>";
			});
		let dom = new DocumentFragment();
		let div = document.createElement("html");
		div.innerHTML = html;
		dom.appendChild(div);
		let clanTaxBattles = Array.from(
			dom.querySelectorAll("a[href*='show_history']")
		).filter((history) => {
			let battleRow = history.parentNode.parentNode.parentNode;
			return battleRow.querySelector(`a[href="${CLAN_URI}"]`) != null;
		});
		let battlesInTimeRange = clanTaxBattles.filter((history) => {
			let battleRow = history.parentNode.parentNode.parentNode;
			let [battleDate] = battleRow.firstChild.firstChild.textContent.split(" ");
			let battleTime = Number(battleDate.replaceAll("-", ""));
			return battleTime >= startTime && battleTime <= endTime;
		});
		battlesInTimeRange.forEach((a) => {
			allHistoryLinks.push(a.href);
		});
		if (battlesInTimeRange.length === 0) {
			break;
		}
	}
	notice.textContent = `Scanned within time range. Found ${allHistoryLinks.length} battles. Starting to collect stats`;
	for (let index = 0; index < allHistoryLinks.length; index++) {
		await scanBattleHistory(allHistoryLinks[index]);
	}
	notice.textContent = `Collected all stats for ${
		Object.keys(STATS_BY_PLAYER).length
	} players. Generating report`;
	let stats =
		"Player, Wins, Losses\n" +
		Object.entries(STATS_BY_PLAYER)
			.map(([player, stats]) => {
				return [player, ...stats].join(",");
			})
			.join("\n");
	downloadCSV(stats, `tax_${startTime}-${endTime}.csv`);
}

async function scanBattleHistory(link) {
	let dom = new DocumentFragment();
	let div = document.createElement("html");
	let html = await fetch(link)
		.then((response) => response.text())
		.catch((error) => {
			console.error(error);
			return "<html></html>";
		});
	div.innerHTML = html;
	dom.appendChild(div);
	let clanPlayers = Array.from(
		dom.querySelectorAll(`a[href*="pl_info.php"`)
	).filter((player) => {
		let clanLink = player.parentNode.firstChild;
		let clanUri = clanLink.pathname.slice(1) + clanLink.search;
		return clanUri === CLAN_URI;
	});
	clanPlayers.forEach((player) => {
		let [wins, losses] = STATS_BY_PLAYER[player.textContent] ?? [0, 0];
		let isVictor = player.querySelector("b") !== null;
		STATS_BY_PLAYER[player.textContent] = isVictor
			? [wins + 1, losses]
			: [wins, losses + 1];
	});
}

function downloadCSV(csvStr, filename) {
	let hiddenElement = document.createElement("a");
	hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvStr);
	hiddenElement.target = "_blank";
	hiddenElement.download = filename;
	hiddenElement.click();
}

const scanForm = document.getElementById("scanForm");

scanForm.addEventListener("submit", (event) => {
	event.stopPropagation();
	event.preventDefault();
	let startTime = Number(event.target.startTime.value.replaceAll("-", ""));
	let endTime = Number(event.target.endTime.value.replaceAll("-", ""));
	scanTaxLog(startTime, endTime);
});
