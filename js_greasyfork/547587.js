// ==UserScript==
// @name        TM Player Squad - Extra Columns
// @namespace   https://trophymanager.com
// @match       https://trophymanager.com/*
// @grant       none
// @version     1.0.19
// @author      rafatrace
// @description Add extra columns to the player squad page
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547587/TM%20Player%20Squad%20-%20Extra%20Columns.user.js
// @updateURL https://update.greasyfork.org/scripts/547587/TM%20Player%20Squad%20-%20Extra%20Columns.meta.js
// ==/UserScript==

(function () {
    'use strict';

		/**
		 * Add extra columns to the player squad page
		 */
		const addExtraColumns = () => {
			// Add extra columns to the header
			const headers = document.querySelectorAll('#sq tr.header')
			Array.from(headers).map((header) => {
				const columnHeaders = header.querySelectorAll('th');
				if (columnHeaders.length > 0) {
					const lastColumnHeader = columnHeaders[columnHeaders.length - 1];
					lastColumnHeader.classList.add('border');
				}
				header.insertAdjacentHTML('beforeend', `<th class="border skill" title="Skill Index" style="cursor: pointer;"><div class="border skill">SI</div></th>`);
				header.insertAdjacentHTML('beforeend', `<th class="skill" title="Routine" style="cursor: pointer;"><div class="border skill">Rou</div></th>`);
				       
				// Add click event to each existing <th>
				columnHeaders.forEach((th) => {
						th.addEventListener('click', function() {
								addExtraColumns()
						});
				});
			})

			// Add data to each player row for the new columns
			players_ar.map((player) => {
				const playerLink = document.querySelector(`a[player_link="${player.id}"]`);
				if(playerLink) {
					// Prepare columns
					const tableRow = playerLink.parentElement.parentElement.parentElement
					const columns = tableRow.querySelectorAll('td');
					
					if (columns.length > 0) {
						const lastColumn = columns[columns.length - 1];
						lastColumn.classList.add('border');
					}
					
					// Adds skill index column
					const readableSI = player.asi.toLocaleString('en-US');
					tableRow.insertAdjacentHTML('beforeend', `<td class="border skill">${readableSI}</td>`);
					tableRow.insertAdjacentHTML('beforeend', `<td class="skill subtle">${player.routine}</td>`);
				}
			})
		}

		/**
		 * Add on click events to toggle A team and B team players
		 */
		const aTeamToggleButton = document.querySelector('#toggle_a_team');
		aTeamToggleButton.onclick = () => {
			toggle_players('a_team');
			addExtraColumns();
		}

		const bTeamToggleButton = document.querySelector('#toggle_b_team');
		bTeamToggleButton.onclick = () => {
			toggle_players('b_team');
			addExtraColumns();
		}

		/**
		 * On initial load, add extra columns
		 */
		addExtraColumns();
})();