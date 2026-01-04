// ==UserScript==
// @name         Monster debuff checker for Orna.RPG
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Let you check monster's debuff in official Orna Codex page.
// @author       RplusTW
// @match        https://playorna.com/codex/raids/*/*
// @match        https://playorna.com/codex/bosses/*/*
// @match        https://playorna.com/codex/followers/*/*
// @match        https://playorna.com/codex/monsters/*/*
// @match        https://playorna.com/codex/classes/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playorna.com
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.17
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      playorna.com
// @connect      orna.guide
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451018/Monster%20debuff%20checker%20for%20OrnaRPG.user.js
// @updateURL https://update.greasyfork.org/scripts/451018/Monster%20debuff%20checker%20for%20OrnaRPG.meta.js
// ==/UserScript==

let autoInit = GM_getValue('autoInit') || false;

GM_registerMenuCommand('Auto Init. ?', toggleAutoInit, 'A');
function toggleAutoInit() {
	autoInit = window.confirm('Enable Auto initialize for debuff checker?')
	GM_setValue('autoInit', autoInit);
}


window.addEventListener('load', function() {
	if (autoInit) {
		init();
	} else {
		document.querySelector('.codex-page-icon')?.addEventListener('dblclick', init, { once: true, });
	}
}, false);


async function GET(url) {
	// console.log('GET', {url});
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			anonymous: true,
			onload: (response) => {
				resolve(response)
			},
			onerror: (response) => {
				reject(response)
			},
		});
	})
}

async function init() {
	let style = document.createElement('style');
	style.textContent = `.cus-checker{opacity:.3}.cus-checker:checked{opacity:.75}.cus-checker:checked+*{opacity:.5}`;
	document.head.append(style);
	collapsePage();
	let monster = await getEnInfo();
	linkToGuide(monster);
	initEffects(monster.effects);
	initStatus(monster.title);
}

function linkToGuide(monster) {
	let h1 = document.querySelector('h1.herotext');
	h1.innerHTML += ` <a href="https://orna.guide/search?searchstr=${monster.title || ''}" target="guide" title="check in orna.guide">🔍</a>`;
}

function collapsePage() {
	let tags = [...document.querySelectorAll('.codex-page h4, .codex-page h4 ~ div')];
	if (!tags.length) { return; }

	let box = null;

	let sections = tags.reduce((all, tag) => {
		if (tag.tagName === 'H4') {
			all[all.length] = [
				tag,
				[]
			];
		} else if (tag.tagName === 'DIV') {
			all[all.length - 1][1].push(genDetailsItem('', tag.innerHTML));
			tag.remove();
		}
		return all;
	}, []);

	sections.forEach(section => {
		section[0].insertAdjacentHTML(
			'beforebegin',
			genDetailsWrapper(
				genDetails(
					section[0].textContent.trim(),
					section[1].join('')
				)
			)
		);
		section[0].remove();
	});
}

function initEffects(effects) {
	let box = document.querySelector('.codex-page');
	let html = '';
	// console.log(effects);
	for (let prop in effects) {
		// effects[prop] = slimEffects(effects[prop]);
		html += genEffectHtml(prop, slimEffects(effects[prop]));
	};
	box.innerHTML += `<hr>${genDetailsWrapper(html)}`;
}

function genEffectHtml(prop, effects) {
	let items = effects.map(eff => genDetailsItem(eff[0], `
		<span>
			${eff[0]},
			<sub>${eff[1].join()}%</sub>
		</span>
	`)).join('');

	return genDetails(prop, items);
}

function initStatus(name) {
	let tier = Number(document.querySelector('.codex-page-meta')?.textContent?.match(/★(\d+)/)?.[1]);
	fetch('https://orna.guide/api/v1/monster', {
		method: 'post',
		body: JSON.stringify({
			name,
			tier: tier || null,
		}),
	}).then(r => r.json())
		.then(d => {
			if (d.length !== 1) {
				return;
			}
			// spawns
			let catas = [
				'immune_to',
				'immune_to_status',
				'resistant_to',
				'weak_to',
			];

			let data = d[0];
			let box = document.querySelector('.codex-page');

			if (data.immune_to_status) {
				data.immune_to_status.sort(sortStatus);
			}
			let html = genDetailsWrapper(
				catas.map(cata => !data[cata] ? '' :
					genDetails(
						_(cata),
						data[cata].map(i => genDetailsItem(_(i))).join(''),
					)
				).join('')
			)
			box.innerHTML += `<hr>${html}`;
		});
}

function sortStatus(a, b) {
	return statusOrder.findIndex(s => s === a) - statusOrder.findIndex(s => s === b);
}

function genStatusHtml(prop, effects) {
	let items = effects.map(eff => genDetailsItem(eff[0], `
		<span>
			${eff[0]},
			<sub>${eff[1].join()}%</sub>
		</span>
	`)).join('');

	return genDetails(prop, items);
}

function genDetailsItem(name, ctx = name) {
	return `
		<li>
			<label>
				<input type="checkbox" value="${name}" class="cus-checker">
				<span>${ctx}</span>
			</label>
		</li>
	`;
}

function genDetailsWrapper(html) {
	return `<div style="display:flex;justify-content:space-evenly;flex-wrap:wrap;">${html}</div>`
}

function genDetails(title, listHtml) {
	return `
		<details open style="width:fit-content;">
			<summary style="text-transform:capitalize;">
				${title}
			</summary>
			<ul style="list-style:none;text-align:start;padding:0;">${listHtml}</ul>
		</details>`
}

function slimEffects(effects) {
	let eff = effects.reduce((all, e) => {
		let o = e.match(/^(\D+)\s\((\d+)/) || [,e, 100];
		all[o[1]] = all[o[1]] || [];
		all[o[1]].push(+o[2]);
		return all;
	}, {});

	return Object.keys(eff).map(prop => {
		return [prop, [...new Set(eff[prop])].sort().reverse()];
	}).sort((a, b) => a[0].localeCompare(b[0]));
	return eff;
}

async function getEnInfo() {
	let html = await getUrlSource(getURL(location.href, 'en'));
	let h1 = parseHtml(html, 'h1.herotext');
	let title = h1[0].textContent.trim();
	let data = itemParse(html);
	let skillWord = skillWords.find(str => data[str]);
	let skills = itemParse(html)[skillWord];
	let effects = await parseSkillEffect(skills);
	return {
		title,
		skills,
		effects,
	};
}

async function parseSkillEffect(skills) {
	// getURL()
	let sources = await Promise.all(
		skills.map( skill => getUrlSource(getURL(skill.url)) )
	);

	let effects = skills.reduce((all, skill, index) => {
		skill.effect = itemParse(sources[index]);
		// console.log(skill.effect);
		for (let prop in skill.effect) {
			if (!all[prop]) {
				all[prop] = [];
			}
			let _es = skill.effect[prop].map(e => e.title);
			all[prop] = all[prop].concat(_es);
		}
		return all;
	}, {});

	return effects;
}

async function getUrlSource(url) {
	return GET(url).then(res => res.responseText)
	// return fetch(url).then(res => {
	// 	if (res.ok) {
	// 		return res.text();
	// 	}
	// 	window.open(res.url);
	// });
}

function parseHtml(html, selectoor = '') {
	let doc = document.implementation.createHTMLDocument();
	doc.body.innerHTML = html;
	return [...doc.querySelectorAll(selectoor)];
}

function itemParse(html) {
	let dataDivs = parseHtml(html, '.codex-page h4, .codex-page h4 ~ div');
	let data = dataDivs.reduce((all, div) => {
		if (div.tagName === 'H4') {
			let _prop = div.textContent.replace(/[:：]/, '').trim().toLowerCase();
			all.currentProp = _prop;
			all[_prop] = all[_prop] || [];
		} else if (div.tagName === 'DIV') {
			let icon = div.querySelector('img')?.src;
			if (!div.querySelector('a[href^="/codex/classes/"]')) { // sucks learning-by
				all[all.currentProp].push({
					icon: div.querySelector('img')?.src,
					url: div.querySelector('a')?.href,
					title: div.textContent.trim(),
				});
			}
		}
		return all;
	}, {});
	delete data.currentProp;
	for (let i in data) {
		if (!data[i]?.length) {
			delete data[i];
		}
	}
	return data;
}

function getURL(url = location.href, lang = unsafeWindow.LANG_CODE) {
	if (lang === 'en') {
		let a = document.createElement('a');
		a.href = url;
		a.search = `lang=en`;
		// return `https://cors-anywhere.herokuapp.com/${a.href}`;
		// a.href = 'https://api.codetabs.com/v1/proxy?quest=' + a.href;
		return a.href;
		// return `https://api.allorigins.win/raw?url=${encodeURIComponent(a.href)}`;
	}
	return url;
}

const skillWords = [
  "Skills",
  "Compétences ",
  "Habilidades",
  "Fähigkeiten",
  "Умения",
  "技能",
  "Umiejętności",
  "Készségek",
  "Навички",
  "Abilità",
  "스킬",
  "スキル"
].map(str => str.toLowerCase());


let i18n = {
	langs: 					['zh', 'en', ],
	words: {
		'immune_to': 	['免疫', 'Immune'],
		'immune_to_status': ['狀態免疫', 'Status Immunity'],
		'resistant_to': ['抗性', 'Resists'],
		'weak_to': 		['弱點', 'Weakness'],
		'Water': 			['水',],
		'Fire': 			['火',],
		'Earthen': 		['土',],
		'Lightning': 	['雷',],
		'Dark': 			['暗',],
		'Dragon': 		['龍',],
		'Arcane': 		['奧',],
		'Holy': 			['聖',],
		'Physical': 	['物',],
		'Asleep': 		['入睡',],
		'Bleeding': 	['流血',],
		'Blight': 		['枯萎',],
		'Blind': 			['致盲',],
		'Burning': 		['燃燒',],
		'Confused': 	['迷惑',],
		'Cursed': 		['詛咒',],
		'Dark Sigil': ['暗之印記',],
		'Darkblight': ['暗黑疫病',],
		'Doom': 			['厄運'],
		'Foresight ↓': ['預知 ↓'],
		'Frozen': ['冰凍'],
		'Lulled': ['恍惚'],
		'Paralyzed': ['麻痺'],
		'Petrified': ['石化'],
		'Poisoned': ['中毒'],
		'Rot': ['腐敗'],
		'Starstruck': ['暈星'],
		'Stasis': ['停滯'],
		'Stunned': ['暈眩'],
		'Toxic': ['劇毒'],
		'Windswept': ['逆風'],
	},
};

const statusOrder = [
  'Poisoned',
  'Bleeding',
  'Burning',
  'Frozen',
  'Paralyzed',
  'Rot',
  'Cursed',
  'Toxic',
  'Blind',
  'Asleep',
  'Lulled',
  'Drenched',
  'Stunned',
  'Blight',
  'Petrified',
  'Stasis',
  'Doom',
  'Confused',
]

let langIndex = i18n.langs.findIndex(
		lang => lang === unsafeWindow.LANG_CODE?.replace(/-.+/, '')
	);

// get i18n
function _(key) {
	return i18n.words[key]?.[langIndex] || key;
}
