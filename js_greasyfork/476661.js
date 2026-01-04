// ==UserScript==
// @name         CharWhoIWouldveknow
// @namespace    https://jirehlov.com
// @version      0.2.5
// @description  show voiced characters that are from subjects in your collections
// @author       Jirehlov
// @include        /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/person\/\d+\/works\/voice+/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476661/CharWhoIWouldveknow.user.js
// @updateURL https://update.greasyfork.org/scripts/476661/CharWhoIWouldveknow.meta.js
// ==/UserScript==

(function () {
	let collectStatus = {};
	const limit = 50;
	let guess = 1000000;
	let totalItems = 0;
	let allData = [];
	let username = null;
	let updatingData = false;
	let getLi = null;
	let numCollected = 0;
	let numNotCollected = 0;
	if (localStorage.getItem('bangumi_subject_collectStatus')) {
		collectStatus = JSON.parse(localStorage.getItem('bangumi_subject_collectStatus'));
	}
	const idBadgerNeue = document.querySelector('.idBadgerNeue');
	if (idBadgerNeue) {
		const avatarLink = idBadgerNeue.querySelector('.avatar');
		if (avatarLink) {
			const href = avatarLink.getAttribute('href');
			username = href.substring(href.lastIndexOf('/') + 1);
		}
	}
	let subject_type = [
		1,
		2,
		3,
		4,
		6
	];
	let collection_type = [
		1,
		2,
		3,
		4,
		5
	];
	let subject_type_index = 0;
	function isSubjectCollected(subjectId) {
		return collectStatus[subjectId] === 'collect';
	}
	function findSubjectId(element) {
		const aElement = element.querySelector('a');
		if (aElement) {
			const href = aElement.getAttribute('href');
			const subjectIdMatch = href.match(/\/subject\/(\d+)/);
			if (subjectIdMatch) {
				return subjectIdMatch[1];
			}
		}
		return null;
	}
	async function copyListItemIfMultipleClearitItems() {
		const browserList = document.querySelectorAll('.browserList > li');
		for (const browserListItem of browserList) {
			browserListItem.classList.add('filteredchars1');
			const clearitItems = browserListItem.querySelectorAll('.innerRightList.rr li.clearit');
			if (clearitItems.length > 1) {
				const clone1 = browserListItem.cloneNode(true);
				const clone2 = browserListItem.cloneNode(true);
				clone1.classList.remove('filteredchars1');
				clone2.classList.remove('filteredchars1');
				clone1.classList.add('filteredchars2');
				clone2.classList.add('filteredchars3');
				clone1.style.display = 'none';
				clone2.style.display = 'none';
				browserListItem.parentNode.insertBefore(clone1, browserListItem.nextSibling);
				browserListItem.parentNode.insertBefore(clone2, browserListItem.nextSibling);
				const clearitItems2 = clone1.querySelectorAll('.innerRightList.rr li.clearit');
				for (const clearitItem of clearitItems2) {
					const subjectId = findSubjectId(clearitItem);
					if (subjectId && !isSubjectCollected(subjectId)) {
						clearitItem.remove();
					}
				}
				const clearitItems3 = clone2.querySelectorAll('.innerRightList.rr li.clearit');
				for (const clearitItem of clearitItems3) {
					const subjectId = findSubjectId(clearitItem);
					if (subjectId && isSubjectCollected(subjectId)) {
						clearitItem.remove();
					}
				}
				if (clone1.querySelectorAll('.innerRightList.rr li.clearit').length === 0) {
					clone1.remove();
				}
				if (clone2.querySelectorAll('.innerRightList.rr li.clearit').length === 0) {
					clone2.remove();
				}
			} else {
				const clearitItem = browserListItem.querySelector('.innerRightList.rr li.clearit');
				const subjectId = findSubjectId(clearitItem);
				if (subjectId) {
					browserListItem.classList.add(isSubjectCollected(subjectId) ? 'filteredchars2' : 'filteredchars3');
				}
			}
			await new Promise(resolve => setTimeout(resolve, 1));
		}
	}
	function checkCharactersInPage(filterType) {
		const browserListItems = document.querySelectorAll('.browserList > li');
		browserListItems.forEach(item => {
			if (filterType === 1 && item.classList.contains('filteredchars1')) {
				item.style.display = 'block';
			} else if (filterType === 2 && item.classList.contains('filteredchars2')) {
				item.style.display = 'block';
			} else if (filterType === 3 && item.classList.contains('filteredchars3')) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		});
	}
	function countCollectedAndNotCollected() {
		const filteredChars2Items = document.querySelectorAll('.filteredchars2 .innerRightList.rr li.clearit');
		const filteredChars3Items = document.querySelectorAll('.filteredchars3 .innerRightList.rr li.clearit');
		numCollected = filteredChars2Items.length;
		numNotCollected = filteredChars3Items.length;
	}
	function createFilterButtons() {
		const subjectFilterElement = document.querySelector('.subjectFilter');
		if (subjectFilterElement) {
			const groupedUL = document.createElement('ul');
			groupedUL.className = 'grouped clearit';
			const titleLi = document.createElement('li');
			titleLi.classList.add('title');
			titleLi.innerHTML = '<span>收藏状态</span>';
			const collectedLi = document.createElement('li');
			collectedLi.innerHTML = `<a href="javascript:;" class="l"><span>已收藏 (${ numCollected })</span></a>`;
			collectedLi.addEventListener('click', () => {
				checkCharactersInPage(2);
			});
			const notCollectedLi = document.createElement('li');
			notCollectedLi.innerHTML = `<a href="javascript:;" class="l"><span>未收藏 (${ numNotCollected })</span></a>`;
			notCollectedLi.addEventListener('click', () => {
				checkCharactersInPage(3);
			});
			const allLi = document.createElement('li');
			allLi.innerHTML = '<a href="javascript:;" class="l"><span>全部</span></a>';
			allLi.addEventListener('click', () => {
				checkCharactersInPage(1);
			});
			getLi = document.createElement('li');
			getLi.innerHTML = '<a href="javascript:;" class="l"><span>收藏数据有误\uFF1F单击手动刷新</span></a>';
			getLi.addEventListener('click', () => {
				getData();
			});
			groupedUL.appendChild(titleLi);
			groupedUL.appendChild(allLi);
			groupedUL.appendChild(collectedLi);
			groupedUL.appendChild(notCollectedLi);
			groupedUL.appendChild(getLi);
			subjectFilterElement.appendChild(groupedUL);
		}
	}
	async function fetchData(collection_type, offset) {
		const url = `https://api.bgm.tv/v0/users/${ username }/collections?subject_type=${ subject_type[subject_type_index] }&type=${ collection_type }&limit=${ limit }&offset=${ offset }`;
		const headers = { 'Accept': 'application/json' };
		const response = await fetch(url, { headers });
		const data = await response.json();
		return data;
	}
	async function getData() {
		if (updatingData) return;
		updatingData = true;
		console.log(`Update started.`);
		if (getLi) {
			getLi.innerHTML = '<a href="javascript:;" class="l"><span>更新中</span></a>';
			getLi.removeEventListener('click', getData);
			getLi.style.pointerEvents = 'none';
		}
		for (let ct = 1; ct < collection_type.length; ct++) {
			for (let i = 0; i < subject_type.length; i++) {
				subject_type_index = i;
				const initialData = await fetchData(ct, guess);
				if ('description' in initialData && initialData.description.includes('equal to')) {
					totalItems = parseInt(initialData.description.split('equal to ')[1]);
					console.log(`Updated totalItems to: ${ totalItems }`);
				} else {
					totalItems = 0;
				}
				for (let offset = 0; offset < totalItems; offset += limit) {
					const data = await fetchData(ct, offset);
					allData.push(...data.data);
					console.log(`Fetched ${ offset + 1 }-${ offset + limit } items...`);
				}
			}
		}
		for (const item of allData) {
			const subjectId = item.subject_id;
			collectStatus[subjectId] = 'collect';
		}
		localStorage.setItem('bangumi_subject_collectStatus', JSON.stringify(collectStatus));
		updatingData = false;
		if (getLi) {
			getLi.innerHTML = '<a href="javascript:;" class="l"><span>更新结束</span></a>';
		}
		console.log(`Update completed.`);
	}
	(async () => {
		await copyListItemIfMultipleClearitItems();
		countCollectedAndNotCollected();
		createFilterButtons();
	})();
}());