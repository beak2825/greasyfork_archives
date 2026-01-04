// ==UserScript==
// @name         mtggoldfish.com万智牌卡名查询翻译
// @namespace    kaws
// @version      1.6
// @description  万智牌卡名查询翻译
// @author       kaws
// @match        https://www.mtggoldfish.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtggoldfish.com

// @connect      www.mtggoldfish.com
// @connect      mtgch.com

// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_setClipboard

// @run-at       document-idle

// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545590/mtggoldfishcom%E4%B8%87%E6%99%BA%E7%89%8C%E5%8D%A1%E5%90%8D%E6%9F%A5%E8%AF%A2%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/545590/mtggoldfishcom%E4%B8%87%E6%99%BA%E7%89%8C%E5%8D%A1%E5%90%8D%E6%9F%A5%E8%AF%A2%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
	'use strict';

	$('body').append(
		'<div class="p-mtg" style="position: fixed; top: 50px; right: 0;padding: 0 20px;background: #f7f7f7;width: 300px;border-radius: 10px;color: #333;display: none"></div><div class="p-toast" style="position: fixed; top: 50px; right: 30%;padding: 20px;background: #f7f7f7;border-radius: 10px;width: 40%;color: #333;text-align: center;display: none"></div>'
	);

	let _res = null;
	let loading = false;
	const $ptoast = $('.p-toast');
	const $deckTable = $('.tab-content');
	const lands = ['Forest', 'Island', 'Mountain', 'Plains', 'Swamp', 'Wastes'];
	const landsZHS = ['树林', '海岛', '山脉', '平原', '沼泽', '荒野'];
	const bg = { U: '#aae0fa', B: '#cbc2bf', W: '#fffbd5', R: '#f9aa8f', G: '#9bd3ae' };

	const spNameList = { 'Bartolome del Presidio': 'Bartolomé del Presidio' };

	const mtgDB = 'mtgDb';
	const mtgStore = 'mtgStore';
	let req = null;
	let db = null;

	$deckTable
		.on('mouseenter', '.card_name a', function (e) {
			if (loading) return;
			const $this = $(this);
			const $pmtg = $('.p-mtg');
			let cardName = $this.text().split(' // ')[0].trim();
			setPos();
			if (lands.includes(cardName)) {
				$pmtg.css({
					background: `#f7f7f7`
				});
				$pmtg.html(`<div style="padding: 10px 0;border-bottom: 1px solid #ccc">卡牌名称：${landsZHS[lands.indexOf(cardName)]}</div><div style="padding: 10px 0">类别：地</div>`);
				return;
			} else {
				$pmtg.html('<div style="color: #f60">加载中...</div>');
			}
			if (spNameList[cardName]) {
				cardName = spNameList[cardName];
			}
			loading = true;
			getDb(cardName, item => {
				initHtml(item);
			});
			return;
		})
		.on('mouseleave', '.card_name a', function () {
			_res?.abort();
			loading = false;
			$('.p-mtg').empty().hide();
			return;
		});

	function setPos() {
		setTimeout(() => {
			const $pop = $('.popover');
      const $pmtg = $('.p-mtg');
			if ($pop.length === 0) return;
			const xy = $pop.get(0).getBoundingClientRect();
			const offsetX = xy.left + $pop.width() + 20;
			const offsetY = xy.top;
			let left = offsetX;
			let top = offsetY;
			$pmtg.css({ left, top, right: 'auto' }).show();
      const pmtgRect = $pmtg.get(0).getBoundingClientRect();
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      if (pmtgRect.right > winWidth) {
        left = winWidth - pmtgRect.width - 410;
        $pmtg.css({ left, right: 'auto' });
      }
      if (pmtgRect.bottom > winHeight) {
        top = winHeight - pmtgRect.height - 20;
        $pmtg.css({ top });
      }
		}, 300);
	}

	function initHtml(item) {
		const matches = [];
		const regex = /\{([^}]+)\}/g;
		let match;
		while ((match = regex.exec(item.mana_cost_html)) !== null) {
			if (!matches.includes(match[1])) {
				matches.push(match[1]);
			}
		}
		const colors = [];
		matches.forEach(c => {
			if (bg[c]) {
				colors.push(bg[c]);
			}
		});
		let html = `<div style="padding: 10px 0;border-bottom: 1px solid #ccc">卡牌名称：${item.display_name_zh}/${
			item.display_name
		}</div><div style="padding: 10px 0;border-bottom: 1px solid #ccc">类别：${item.display_type_line}</div><div style="padding: 10px 0;${
			item.other_faces.length > 0 ? 'border-bottom: 1px solid #ccc' : ''
		}">规则叙述：${item.oracle_text_html}</div>`;
		if (item.other_faces.length > 0) {
			item.other_faces.forEach(face => {
				html += `<div style="padding: 10px 0;border-bottom: 1px solid #ccc">卡牌名称：${item.display_name_zh}/${
					item.display_name
				}</div><div style="padding: 10px 0;border-bottom: 1px solid #ccc">类别：${item.display_type_line}</div><div style="padding: 10px 0;${
					item.other_faces.length > 0 ? 'border-bottom: 1px solid #ccc' : ''
				}">规则叙述：${item.oracle_text_html}</div>`;
			});
		}
		if (colors.length > 1) {
			$('.p-mtg').css({
				background: `linear-gradient(to right, ${colors.join(', ')})`
			});
		} else {
			$('.p-mtg').css({
				background: `${colors[0]}`
			});
		}
		$('.p-mtg').html(html);
		loading = false;
	}
	function initIndexDb() {
		req = indexedDB.open(mtgDB);
		req.onerror = function () {
			console.log('open db failed');
		};
		req.onsuccess = function (e) {
			console.log('open db success');
			db = e.target.result;
		};
		req.onupgradeneeded = function (e) {
			console.log('upgrade db success');
			db = e.target.result;
			if (!db.objectStoreNames.contains(mtgStore)) {
				const store = db.createObjectStore(mtgStore, { autoIncrement: true });
				store.createIndex('display_name', 'display_name', {
					unique: false
				});
			}
		};
	}
	function addDb(cardName) {
		const _url = `https://mtgch.com/api/v1/result?q=name:"${cardName}"&page=1&page_size=100&order=-released_at&unique=oracle_id&priority_chinese=true&view=1`;
		_res = GM.xmlHttpRequest({
			method: 'GET',
			url: _url,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			onload: r => {
				const resJson = JSON.parse(r.responseText);
				console.log(resJson);
				$ptoast.text('loaded').fadeIn();
				setTimeout(() => {
					$ptoast.fadeOut();
				}, 2000);
				let resItem = null;
				if (resJson.items.length > 1) {
					resItem = resJson.items.filter(item => item.display_name === cardName)?.[0];
				} else {
					resItem = resJson.items[0];
				}
				if (!resItem) {
					console.log(`not found: ${cardName}`);
					loading = false;
					return;
				}
				initHtml(resItem);
				db.transaction([mtgStore], 'readwrite').objectStore(mtgStore).add(resItem);
				loading = false;
			}
		});
	}
	function getDb(cardName, cb) {
		const store = db.transaction([mtgStore], 'readwrite').objectStore(mtgStore);
		const index = store.index('display_name');
		const res = index.get(cardName);
		res.onsuccess = function (e) {
			if (e.target.result) {
				typeof cb === 'function' && cb(e.target.result);
			} else {
				addDb(cardName);
			}
		};
	}
	initIndexDb();
})();
