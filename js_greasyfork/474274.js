// ==UserScript==
// @name         BgmSyncF
// @version      0.4
// @namespace    https://jirehlov.com
// @description  https://bgm.tv/group/topic/386575
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/user/.+/
// @author       Jirehlov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474274/BgmSyncF.user.js
// @updateURL https://update.greasyfork.org/scripts/474274/BgmSyncF.meta.js
// ==/UserScript==
(function () {
	'use strict';
	const isUserPage = /^\/user\/[^/]+$/.test(window.location.pathname);
	if (!isUserPage) {
		return;
	}
	const limit = 50;
	let guess = 1000000;
	let totalItems = 0;
	let allData = [];
	let calculateButton;
	let buttonCounter = 0;
	let contextMenu = null;
	let settingsLink = null;
	const [username, page = '', subpage = ''] = (() => {
		const {pathname} = window.location;
		if (/^\/user/.test(pathname)) {
			return pathname.match(/\/user\/(\w+)\/?(\w+)?\/?(\w+)?/).slice(1, 4);
		}
		return [
			'',
			'',
			''
		];
	})();
	if (!username) {
		throw new Error('Username is not detected');
	}
	let likes = 0;
	let totalsub = 0;
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
	let collectStatus = {};
	let subject_type_index = 0;
	let percentageBarDiv = null;
	const nameDiv = document.querySelector('.name');
	const realname = nameDiv.querySelector('a').textContent;
	function setLocalStorageWithExpiration(key, value, expirationTimeInDays) {
		const expirationTimestamp = Date.now() + expirationTimeInDays * 24 * 60 * 60 * 1000;
		const dataToStore = {
			value,
			expiration: expirationTimestamp
		};
		localStorage.setItem(key, JSON.stringify(dataToStore));
	}
	function getLocalStorage(key) {
		const storedData = localStorage.getItem(key);
		if (storedData) {
			const data = JSON.parse(storedData);
			if (data.expiration && data.expiration > Date.now()) {
				return data.value;
			}
			localStorage.removeItem(key);
		}
		return null;
	}
	function confirmCacheRefresh() {
		const refreshCache = confirm('是否强制刷新缓存\uFF1F非必要请勿频繁刷新\uFF01');
		if (refreshCache) {
			localStorage.removeItem(`${ username }_totalsub`);
			localStorage.removeItem(`${ username }_likes`);
			likes = 0;
			totalsub = 0;
			subject_type_index = 0;
			allData = [];
			changeButtonText('计算全站同步率');
			calculateButton.removeEventListener('dblclick', confirmCacheRefresh);
		}
	}
	async function fetchData(collection_type, offset) {
		const url = `https://api.bgm.tv/v0/users/${ username }/collections?subject_type=${ subject_type[subject_type_index] }&type=${ collection_type }&limit=${ limit }&offset=${ offset }`;
		const headers = { 'Accept': 'application/json' };
		const response = await fetch(url, { headers });
		const data = await response.json();
		return data;
	}
	async function main() {
		const cachedtotalsub = getLocalStorage(`${ username }_totalsub`);
		const cachedlikes = getLocalStorage(`${ username }_likes`);
		if (cachedtotalsub !== null && cachedlikes !== null) {
			totalsub = cachedtotalsub;
			likes = cachedlikes;
			changeButtonText('已命中缓存');
			let syncRate = 0;
			if (totalsub > 0) {
				syncRate = likes / totalsub * 100;
			}
			updateUI();
			calculateButton.addEventListener('dblclick', confirmCacheRefresh);
		} else {
			calculateButton.style.pointerEvents = 'none';
			totalsub = 0;
			changeButtonText('计算中');
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
						updateButtonText();
					}
				}
			}
			if (settingsLink !== null) {
				for (const item of allData) {
					const subjectId = item.subject_id;
					collectStatus[subjectId] = 'collect';
				}
				localStorage.setItem('bangumi_subject_collectStatus', JSON.stringify(collectStatus));
			}
			for (const item of allData) {
				const rate = item.rate === 0 ? 7 : parseFloat(item.rate || 0);
				const score = Math.round(parseFloat(item.subject && item.subject.score !== undefined ? item.subject.score : 0));
				if (Math.abs(rate - score) === 0) {
					likes++;
				}
				totalsub++;
			}
			changeButtonText('计算全站同步率');
			calculateButton.style.pointerEvents = 'auto';
			setLocalStorageWithExpiration(`${ username }_totalsub`, totalsub, 7);
			setLocalStorageWithExpiration(`${ username }_likes`, likes, 7);
			let syncRate = 0;
			if (totalsub > 0) {
				syncRate = likes / totalsub * 100;
			}
			updateUI();
		}
	}
	function updateUI() {
		let synchronizeDiv = document.querySelector('.userSynchronize');
		if (!synchronizeDiv) {
			const userBoxDiv = document.querySelector('.user_box.clearit');
			if (userBoxDiv) {
				synchronizeDiv = document.createElement('div');
				synchronizeDiv.className = 'userSynchronize';
				userBoxDiv.appendChild(synchronizeDiv);
			}
		}
		let percentageBarDiv = document.querySelector('.BgmSyncF');
		if (!percentageBarDiv) {
			const synchronizeDiv = document.querySelector('.userSynchronize');
			if (synchronizeDiv) {
				percentageBarDiv = document.createElement('div');
				percentageBarDiv.className = 'BgmSyncF';
				synchronizeDiv.appendChild(percentageBarDiv);
			}
		}
		if (percentageBarDiv) {
			let syncRate = 0;
			if (totalsub > 0) {
				syncRate = likes / totalsub * 100;
			}
			const percentageBar = `
        <h3>${ realname }与全站的同步率</h3>
        <small class="hot">/ ${ likes }个同分条目</small>
        <p class="bar">
            <span class="percent_text rr">${ syncRate.toFixed(2) }%</span>
            <span class="percent" style="width:${ syncRate.toFixed(2) }%"></span>
        </p>
    `;
			percentageBarDiv.innerHTML = percentageBar;
		}
		console.log(`Number of items with same rate and score: ${ likes }`);
		console.log(`Number of items in total: ${ totalsub }`);
		console.log(`Sync rate: ${ (likes / totalsub).toFixed(2) }`);
	}
	function changeButtonText(newText) {
		const span = document.querySelector('.chiiBtn > span.BgmSyncFButton');
		if (span) {
			span.textContent = newText;
		}
	}
	function updateButtonText() {
		if (buttonCounter < 5) {
			changeButtonText('计算中' + '.'.repeat(buttonCounter));
			buttonCounter++;
		} else {
			changeButtonText('计算中');
			buttonCounter = 1;
		}
	}
	function addButton() {
		const link = document.createElement('a');
		const span = document.createElement('span');
		span.textContent = '计算全站同步率';
		span.className = 'BgmSyncFButton';
		link.href = 'javascript:void(0)';
		link.className = 'chiiBtn';
		link.addEventListener('click', main);
		link.appendChild(span);
		const actionsDiv = document.querySelector('.nameSingle > .inner > .actions');
		settingsLink = actionsDiv.querySelector('a[href="/settings"]');
		actionsDiv.appendChild(link);
		calculateButton = link;
	}
	addButton();
	async function downloadJSON(data, filename) {
		if (data.length === 0) {
			alert('没有数据可下载\uFF0C请刷新缓存后重试\u3002');
			return;
		}
		try {
			const json = JSON.stringify(data);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			link.click();
		} catch (error) {
			alert('意外错误\uFF01');
			console.error(error);
		}
	}
	document.addEventListener('contextmenu', event => {
		const target = event.target;
		if (target === calculateButton || target.parentElement === calculateButton) {
			event.preventDefault();
			closeContextMenu();
			contextMenu = document.createElement('div');
			contextMenu.className = 'context-menu';
			contextMenu.style.position = 'absolute';
			contextMenu.style.left = event.pageX + 'px';
			contextMenu.style.top = event.pageY + 'px';
			contextMenu.style.backgroundColor = '#333';
			contextMenu.style.border = '0px';
			contextMenu.style.padding = '0px';
			contextMenu.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
			const jsonOption = document.createElement('div');
			jsonOption.textContent = '下载JSON';
			jsonOption.style.cursor = 'pointer';
			jsonOption.style.padding = '8px 12px';
			jsonOption.style.color = 'white';
			jsonOption.addEventListener('click', () => {
				const timestamp = new Date().toISOString().replace(/:/g, '-');
				const filename = `BgmSyncFdata_${ username }_${ timestamp }.json`;
				downloadJSON(allData, filename);
				closeContextMenu();
			});
			jsonOption.addEventListener('mouseenter', () => {
				jsonOption.style.backgroundColor = '#444';
			});
			jsonOption.addEventListener('mouseleave', () => {
				jsonOption.style.backgroundColor = '#333';
			});
			contextMenu.appendChild(jsonOption);
			document.body.appendChild(contextMenu);
			const removeMenu = () => {
				closeContextMenu();
				document.removeEventListener('click', removeMenu);
			};
			document.addEventListener('click', removeMenu);
		}
	});
	function closeContextMenu() {
		if (contextMenu) {
			contextMenu.remove();
			contextMenu = null;
		}
	}
}());