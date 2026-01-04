// ==UserScript==
// @name         VIBRankFetch
// @namespace    https://jirehlov.com
// @version      0.1.3
// @description  条目页显示VIB排名
// @include      /^https?://(bangumi|bgm|chii).(tv|in)/subject/.*$/
// @author       Jirehlov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474718/VIBRankFetch.user.js
// @updateURL https://update.greasyfork.org/scripts/474718/VIBRankFetch.meta.js
// ==/UserScript==
(function () {
	'use strict';
	function getVIB(id) {
		return fetch(`https://api.jirehlov.com/vib/${ id }`, {
			method: 'GET',
			redirect: 'manual'
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			} else {
				throw new Error('VIB api errors');
			}
		});
	}
	const idMatch = window.location.pathname.match(/\/subject\/(\d+)/);
	if (idMatch) {
		const id = idMatch[1];
		getVIB(id).then(response => {
			const vibRank = response.VIB_rank;
			const vibScore = response.VIB_score;
			if (vibRank !== null && vibRank !== 0) {
				const globalScore = document.querySelector('.global_score');
				if (globalScore) {
					const firstDiv = globalScore.querySelector('div');
					if (firstDiv) {
						const spanElement = document.createElement('span');
						spanElement.style.display = 'block';
						spanElement.classList.add('ScoreBlock');
						while (globalScore.firstChild !== firstDiv) {
							spanElement.appendChild(globalScore.firstChild);
						}
						globalScore.insertBefore(spanElement, firstDiv);
						const clonedSpanElement = spanElement.cloneNode(true);
						globalScore.insertBefore(clonedSpanElement, firstDiv);
						const ins1 = document.createElement('span');
						ins1.textContent = '表面评分 ';
						spanElement.prepend(ins1);
						const ins2 = document.createElement('span');
						ins2.textContent = 'VIB评分 ';
						clonedSpanElement.prepend(ins2);
						clonedSpanElement.children[1].textContent = Number(vibScore).toFixed(4);
						const stringOptions = [
							'不忍直视',
							'很差',
							'差',
							'较差',
							'不过不失',
							'还行',
							'推荐',
							'力荐',
							'神作',
							'超神作'
						];
						const selectedString = stringOptions[Math.round(vibScore) - 1];
						clonedSpanElement.children[3].textContent = selectedString;
						const vibDiv = document.createElement('div');
						vibDiv.innerHTML = '<small class="grey">VIB Ranked:</small><small class="alarm">#' + vibRank + '</small>';
						vibDiv.style.marginLeft = '38px';
						globalScore.insertBefore(vibDiv, firstDiv);
					}
				}
			}
		});
	}
}());