// ==UserScript==
// @name         Mark D3 mobs in task reroll
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  Adds "D3" to tasks with D3 mobs
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543540/Mark%20D3%20mobs%20in%20task%20reroll.user.js
// @updateURL https://update.greasyfork.org/scripts/543540/Mark%20D3%20mobs%20in%20task%20reroll.meta.js
// ==/UserScript==

(function() {
	function whilePresent (selector, callback) {
		function check () {
			const el = document.querySelector(selector);
			setTimeout(check, 1000/15); // Schedule first to allow the callback to throw
			if (el) {
				callback(el);
			}
		}
		check();
	}

	const dungeonMobs = {
		"D3": [
			"Abyssal Imp",
			"Novice Sorcerer",
			"Flame Sorcerer",
			"Ice Sorcerer",
			"Black Bear",
			"Magnetic Golem",
			"Panda",
			"Stalactite Golem",
			"Soul Hunter",
			"Elementalist",
			"Polar Bear",
			"Grizzly Bear",
		],
	};

	function addDungeonMark (el) {
		el.querySelectorAll(".RandomTask_name__1hl1b").forEach((taskNameEl) => {
			for (let d in dungeonMobs) {
				const mobs = dungeonMobs[d];
				if (!taskNameEl.querySelector(".userscript-task-reroll") && mobs.some((m) => taskNameEl.textContent.includes(m))) {
					const template = `
						<span class="userscript-task-reroll" style="font-size: 13px; color: orange; font-weight: 500;">
						${d}
						</span>
					`;

					taskNameEl.querySelector(".userscript-task-reroll")?.remove();
					taskNameEl.insertAdjacentHTML("beforeend", template);

				}
			}
		});
	}

	whilePresent(".TasksPanel_taskList__2xh4k", addDungeonMark);
})();
