// ==UserScript==
// @name         VIBDataListInsertion
// @namespace    https://jirehlov.com
// @version      0.1.8
// @description  Add VIB Rank, stars, VIB_score decimal, and rating count to anime list based on API data
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/.*
// @author       Jirehlov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476249/VIBDataListInsertion.user.js
// @updateURL https://update.greasyfork.org/scripts/476249/VIBDataListInsertion.meta.js
// ==/UserScript==
(async function () {
	'use strict';
	let isTraversing = true;
	async function addVIBData(innerElement) {
		if (innerElement.getAttribute('data-vib-processed') === 'true') {
			return;
		}
		const aElement = innerElement.parentElement.querySelector('a[href^="/subject/"]');
		if (!aElement) {
			return;
		}
		const match = aElement.getAttribute('href').match(/\/(\d+)$/);
		if (!match) {
			return;
		}
		const id = match[1];
		const apiUrl = `https://api.jirehlov.com/vib/${ id }`;
		const response = await fetch(apiUrl, { redirect: 'manual' });
		if (response.ok) {
			const data = await response.json();
			const {VIB_rank, VIB_score, VIB_enum} = data;
			const vibRankElement = document.createElement('span');
			vibRankElement.classList.add('rank', 'vibrank');
			vibRankElement.innerHTML = `<small>VIB Rank </small>${ VIB_rank }`;
			vibRankElement.style.right = '85px';
			const starsElement = document.createElement('span');
			starsElement.classList.add('starstop-s');
			const starCount = Math.round(VIB_score);
			starsElement.innerHTML = `<span class="starlight stars${ starCount }"></span>`;
			const vibScoreDecimal = parseFloat(VIB_score).toFixed(1);
			const ratingInfoElement = document.createElement('p');
			ratingInfoElement.classList.add('rateInfo');
			const rankElement = innerElement.querySelector('.rank');
			if (rankElement) {
				rankElement.insertAdjacentElement('afterend', vibRankElement);
			} else {
				innerElement.appendChild(vibRankElement);
			}
			ratingInfoElement.appendChild(starsElement);
			ratingInfoElement.innerHTML += `<small class="fade"> ${ vibScoreDecimal }</small> <span class="tip_j vibenum">(${ VIB_enum }人VIB评分)</span>`;
			innerElement.appendChild(ratingInfoElement);
			innerElement.setAttribute('data-vib-processed', 'true');
		} else {
			innerElement.setAttribute('data-vib-processed', 'true');
			return;
		}
	}
	function observeDOMChanges() {
		const browserFullContainer = document.querySelector('.browserFull');
		if (!browserFullContainer) {
			return;
		}
		const mutationObserver = new MutationObserver(async mutations => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					const addedLiElements = Array.from(mutation.addedNodes).filter(node => node.nodeName === 'LI');
					if (mutation.addedNodes.length > 0) {
						isTraversing = true;
						await processElementWithDelay(addedLiElements);
						isTraversing = false;
					}
				}
			}
		});
		mutationObserver.observe(browserFullContainer, {
			childList: true,
			attributes: false,
			subtree: false
		});
	}
	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function processElementWithDelay(elements) {
		return new Promise(async (resolve, reject) => {
			try {
				for (const [index, liElement] of elements.entries()) {
					const innerElement = liElement.querySelector('.inner');
					if (innerElement) {
						await delay((index + 1) * 10);
						addVIBData(innerElement);
					}
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
	let ascendingOrder = true;
	function sortBy(property) {
		const browserFullContainer = document.querySelector('.browserFull');
		if (!browserFullContainer) {
			return;
		}
		const liElements = Array.from(browserFullContainer.querySelectorAll('.browserFull > li'));
		liElements.sort((a, b) => {
			const elementA = a.querySelector(property);
			const elementB = b.querySelector(property);
			if (!elementA && !elementB) {
				return 0;
			}
			if (!elementA) return 1;
			if (!elementB) return -1;
			const contentA = elementA.textContent;
			const contentB = elementB.textContent;
			const matchA = contentA.match(/\d+/);
			const matchB = contentB.match(/\d+/);
			const valueA = parseInt(matchA[0]);
			const valueB = parseInt(matchB[0]);
			if (isNaN(valueA) || isNaN(valueB)) {
				return 0;
			}
			const isEnumSort = property === '.vibenum';
			const direction = ascendingOrder ? -1 : 1;
			return (valueA - valueB) * (isEnumSort ? -1 : 1) * direction;
		});
		while (browserFullContainer.firstChild) {
			browserFullContainer.removeChild(browserFullContainer.firstChild);
		}
		liElements.forEach((liElement, index) => {
			browserFullContainer.appendChild(liElement);
		});
		const sortButton = document.querySelector(property === '.vibrank' ? '.vibBtn' : '.vibEnumBtn');
		if (sortButton) {
			sortButton.textContent = `${ property === '.vibrank' ? 'VIB评分排序' : 'VIB人数排序' } ${ ascendingOrder ? '\u2191' : '\u2193' }`;
		}
		ascendingOrder = !ascendingOrder;
	}
	observeDOMChanges();
	isTraversing = true;
	const initialLiElements = document.querySelectorAll('.browserFull li');
	await processElementWithDelay(initialLiElements);
	isTraversing = false;
	const browserToolsElement = document.getElementById('browserTools');
	if (browserToolsElement) {
		const vibSortButton = document.createElement('a');
		vibSortButton.classList.add('chiiBtn', 'vibBtn');
		vibSortButton.href = 'javascript:;';
		vibSortButton.textContent = 'VIB评分排序';
		browserToolsElement.appendChild(vibSortButton);
		const vibSortEnumButton = document.createElement('a');
		vibSortEnumButton.classList.add('chiiBtn', 'vibEnumBtn');
		vibSortEnumButton.href = 'javascript:;';
		vibSortEnumButton.textContent = 'VIB人数排序';
		browserToolsElement.appendChild(vibSortEnumButton);
	}
	const vibSortButton = document.querySelector('.vibBtn');
	if (vibSortButton) {
		vibSortButton.addEventListener('click', function () {
			if (isTraversing) {
				return;
			}
			sortBy('.vibrank');
		});
	}
	const vibSortEnumButton = document.querySelector('.vibEnumBtn');
	if (vibSortEnumButton) {
		vibSortEnumButton.addEventListener('click', function () {
			if (isTraversing) {
				return;
			}
			sortBy('.vibenum');
		});
	}
}());