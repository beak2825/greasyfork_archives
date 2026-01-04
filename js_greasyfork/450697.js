// ==UserScript==
// @name         Item quality checker for Orna.RPG
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Let you easily calculate item quality in official Orna Codex page.
// @author       RplusTW
// @match        https://playorna.com/codex/items/*/
// @match        https://playorna.com/codex/items/*/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playorna.com
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.17
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450697/Item%20quality%20checker%20for%20OrnaRPG.user.js
// @updateURL https://update.greasyfork.org/scripts/450697/Item%20quality%20checker%20for%20OrnaRPG.meta.js
// ==/UserScript==

let autoInit = GM_getValue('autoInit') || false;

GM_registerMenuCommand('Auto Init. ?', toggleAutoInit, 'A');
function toggleAutoInit() {
	autoInit = window.confirm('Enable Auto initialize for debuff checker?')
	GM_setValue('autoInit', autoInit);
}

window.addEventListener('load', async function() {
	'use strict';

	if (autoInit) {
		init();
	} else {
		document.querySelector('.codex-page-icon')?.addEventListener('dblclick', init, { once: true, });
	}

	async function init() {
		var s = document.createElement('script');
		s.setAttribute('src', 'https://cdn.jsdelivr.net/npm/lil-gui@0.17');
		document.body.appendChild(s);
		s.onload = scriptOnload;
	}
}, false);

async function scriptOnload() {
	let GUI = window.lil.GUI;
	let urlPath = location.href.match(/items\/([^/]+)/);
	let assessUrl = `https://orna.guide/search?searchstr=${urlPath?.[1].replace(/\W/g, ' ')}`;
	let gid = '';
	let data = {
		'%': 100,
		'assess_guide': () => { window.open(assessUrl, 'guide'); },
		'assess_api': () => { initAssess(gid); },
	}

	let div = document.createElement('div');
	div.id = 'gui-div';
	let statsDiv = document.querySelector('.codex-stats');
	statsDiv.after(div);
	div.style = `display:flex;justify-content:center;flex-wrap:wrap;`;
	var gui = new GUI({
		autoPlace: false,
		container: div,
	});
	let stats = getStatValues(statsDiv);
	console.log({stats});
	stats?.forEach(stat => {
		data[stat.prop] = stat.value;
		gui.add(
			data, stat.prop,
			~~(stat.value * 0.7),
			stat.value * 2,
			1
		)
		.onChange(_v => {
			quality.setValue(~~(100 * _v / stat.value))
		});
	});
	let quality = gui.add(data, '%', 70, 200);

	let assessFolder = gui.addFolder( 'Assess' );
	assessFolder.close();

	let assessOnGuide = assessFolder.add(data, 'assess_guide').name(`🔍 on Orna.Guide `);

	let itemInfo = await getItemInfo();
	gid = itemInfo.id;
	if (gid) {
		assessUrl = `https://orna.guide/items?show=${gid}`;
		assessOnGuide.name(`🔍 ${itemInfo.name} on Orna.Guide 🔗`);

		let assessByAPI = assessFolder.add(data, 'assess_api').name(`Assess ${itemInfo.name} Here! 🌟`);
	}
}

function getStatValues(statDom) {
	let statDivs = [...statDom.querySelectorAll('.codex-stat')];
	if (!statDivs?.length) {
		return null;
	}

	return statDivs.map(div => {
		let info = div.textContent.trim().match(/(\D+)(\d+)/);
		let prop = info?.[1].trim().replace(':', '').toLowerCase();
		let value = +info?.[2];
		return {
			prop,
			value,
		};
	});
}

function initAssess(gid) {
	if (window.assessInited) {
		return;
	}
	window.assessInited = true;

	let divForm = document.createElement('div');
	let resultBox = document.createElement('details');
	resultBox.style = 'width:100%';
	let optionsHtml = ['level', 'attack', 'defense', 'magic', 'resistance', 'hp', 'mana', 'dexterity', 'ward', 'crit', ]
		.map(i => genLabel(i)).join('');


	divForm.innerHTML = `
		<details open>
			<form id="assess-form" class="lil-gui">
				${genLabel('id', gid, 'readonly')}
				${optionsHtml}
				<div class="controller">
					<div class="widget"><input type="submit"></div>
					<div class="widget"></div>
					<div class="widget"><input type="reset"></div>
				</div>
			</form>
		</details>`;

	document.querySelector('#gui-div').appendChild(divForm);
	document.querySelector('#gui-div').appendChild(resultBox);

	let form = divForm.querySelector('#assess-form');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = {};
		for (const pair of new FormData(form)) {
			if (pair[1]) {
				formData[pair[0]] = +pair[1];
			}
		}

		fetch('https://orna.guide/api/v1/assess', {
			method: 'post',
			body: JSON.stringify(formData),
		}).then(r => r.json())
			.then(d => {
				resultBox.innerHTML = genAssessTable(d);
				resultBox.open = true;
			});
	});
}

function genAssessTable(data) {
	let stats = data.stats;
	let props = Object.keys(stats);
	let title = document.querySelector('h1.herotext')?.textContent || '';

	let ths = props.map(prop => genTd(prop, 'th')).join('');

	let tbody = stats[props[0]].values.map((_i, index) => {
		let tds = props.map(prop => {
			return genTd(stats[prop].values[index]);
		}).join('');
		return `<tr>
			${genTd(index + 1)}
			${tds}
		</tr>`
	}).join('');

	props.map(prop => {
		stats[prop].values
	});

	return `
		<table style="margin:auto;text-transform:capitalize;">
			<caption>${title} ${data.quality * 100}%</caption>
			<style>details th {border-bottom:1px dotted #fff6;}</style>
			<tr>
				<th>Lv</th>
				${ths}
			</tr>
			${data.quality * 1 ? tbody : ''}
		</table>
	`;
}

function genTd(str, tag = 'td') {
	return `<${tag}>${str}</${tag}>`;
}

function genLabel(prop = '', value = '', attr) {
	return `
		<label class="controller number">
			<div class="name" style="text-transform:capitalize;">${prop}</div>
			<div class="widget">
				<input type="number" value="${value}" name="${prop}" ${attr} />
			</div>
		</label>`;
}

async function getItemInfo() {
	let info = await getEnInfo();
	let name = info.title;
	if (!name) {
		return false;
	}
	let itemData = await postData('https://orna.guide/api/v1/item', {name});
	if (itemData?.length !== 1) {
		return false;
	}
	return {
		id: itemData[0]?.id,
		name,
	};
}

function postData(url, data) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	}).then(res => res.json());
}

function getEnURL() {
	let a = document.createElement('a');
	a.href = location.href;
	a.search = 'lang=en';
	a.href = `https://api.allorigins.win/raw?url=${encodeURIComponent(a.href)}`;
	// a.href = 'https://api.codetabs.com/v1/proxy?quest=' + a.href;
	// a.href = ' https://fast-dawn-89938.herokuapp.com/' + a.href;
	return a.href;
}

async function getEnInfo() {
	let html = await fetch(getEnURL()).then(res => res.text());
	let doc = document.implementation.createHTMLDocument();
	doc.body.innerHTML = html;
	let h1 = doc.querySelector('h1.herotext');
	return {
		title: h1.textContent.trim(),
		// stats: getStatValues(doc.querySelector('.codex-stats')),
	};
}
