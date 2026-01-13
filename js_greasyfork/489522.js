// ==UserScript==
// @name        chuni-net - display chara level
// @namespace   esterTion
// @license     MIT
// @match       https://chunithm-net-eng.com/*
// @match       https://new.chunithm-net.com/*
// @match       https://chunithm.wahlap.com/*
// @version     1.0.9
// @author      esterTion
// @description Display character level exp on chunithm-net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/489522/chuni-net%20-%20display%20chara%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/489522/chuni-net%20-%20display%20chara%20level.meta.js
// ==/UserScript==

(async function() {

const host = location.hostname
const server = host === 'new.chunithm-net.com' ? 'jp' : host === 'chunithm-net-eng.com' ? 'ex' : host === 'chunithm.wahlap.com' ? 'cn' : ''
if (!server) throw new Error('unknown server')
const isOldExp = server === 'cn' && Date.now() < 1727218800000

const expData = [
	   0,
	  20,  20,  20,  20,  20,    20,  20,  20,  20, 100, // 10
	 100, 100, 100, 100, 150,   150, 150, 150, 150, 200, // 20
	 200, 200, 200, 200, 300,   300, 300, 300, 300, 400, // 30
	 400, 400, 400, 400, 500,   500, 500, 500, 500, 600, // 40
	 600, 600, 600, 600, 700,   700, 700, 700, 700, 900, // 50

	 900, 900, 900, 900,1100,  1100,1100,1100,1100,1300, // 60
	1300,1300,1300,1300,1500,  1500,1500,1500,1500,1700, // 70
	1700,1700,1700,1700,1900,  1900,1900,1900,1900,2100, // 80
	2100,2100,2100,2100,2300,  2300,2300,2300,2300,2500, // 90
	2500,2500,2500,2500,2700,  2700,2700,2700,2700,3000, // 100

	3000,3000,3000,3000,3300,  3300,3300,3300,3300,3600, // 110
	3600,3600,3600,3600,3900,  3900,3900,3900,3900,4200, // 120
	4200,4200,4200,4200,4500,  4500,4500,4500,4500,4800, // 130
	4800,4800,4800,4800,5100,  5100,5100,5100,5100,5400, // 140
	5400,5400,5400,5400,5700,  5700,5700,5700,5700,6100, // 150

	6100,6100,6100,6100,6500,  6500,6500,6500,6500,6900, // 160
	6900,6900,6900,6900,7300,  7300,7300,7300,7300,7700, // 170
	7700,7700,7700,7700,8100,  8100,8100,8100,8100,8500, // 180
	8500,8500,8500,8500,8900,  8900,8900,8900,8900,9300, // 190
	9300,9300,9300,9300,9700,  9700,9700,9700,9700,Infinity, // 200
]
const trophyData = [
	1,
	1,1,1,1,1, 1,1,1,1,1, // 10
	1,1,1,1,1, 1,1,1,1,1, // 20
	1,1,1,1,2, 2,2,2,2,2, // 30
	2,2,2,2,2, 2,2,2,2,2, // 40
	2,2,2,2,2, 2,2,2,2,101, // 50
	3,3,3,3,3, 3,3,3,3,3, // 60
	3,3,3,3,3, 3,3,3,3,3, // 70
	3,3,3,3,4, 4,4,4,4,4, // 80
	4,4,4,4,4, 4,4,4,4,4, // 90
	4,4,4,4,4, 4,4,4,4,101, // 100
	5,5,5,5,5, 5,5,5,5,5, // 110
	5,5,5,5,5, 5,5,5,5,5, // 120
	5,5,5,5,6, 6,6,6,6,6, // 130
	6,6,6,6,6, 6,6,6,6,6, // 140
	6,6,6,6,6, 6,6,6,6,102, // 150
	7,7,7,7,7, 7,7,7,7,7, // 160
	7,7,7,7,7, 7,7,7,7,7, // 170
	7,7,7,7,8, 8,8,8,8,8, // 180
	8,8,8,8,8, 8,8,8,8,8, // 190
	8,8,8,8,8, 0,0,0,0,0, // 200
]

// createElement
function _(e,t,i){var a=null;if("text"===e)return document.createTextNode(t);a=document.createElement(e);for(var n in t)if("style"===n)for(var o in t.style)a.style[o]=t.style[o];else if("className"===n)a.className=t[n];else if("event"===n)for(var o in t.event)a.addEventListener(o,t.event[o]);else a.setAttribute(n,t[n]);if(i)if("string"==typeof i)a.innerHTML=i;else if(Array.isArray(i))for(var l=0;l<i.length;l++)null!=i[l]&&a.appendChild(i[l]);return a}

function addLevelToPage() {
	[...document.querySelectorAll('.character_gage_base img')].forEach(addLevelToCurrentCharacter);
	[...document.querySelectorAll('.character_list_gage_base img')].forEach(addLevelToCharacterList);
	[...document.querySelectorAll('.avatar_point_num img')].forEach(addAvatarPointGrid);
	[document.querySelector('.character_list_gage_base img')].forEach(cloneCharacterToLevelList);
	addStyle()
}
function addLevelToCurrentCharacter(img) {
	const barContainer = img.parentNode.parentNode
	const levelImgs = barContainer.parentNode.querySelectorAll('.character_lv_box_num img')
	const isAtBarrier = barContainer.parentNode.querySelector('.character_lv_box_max') !== null
	const level = levelNumImageToNum(levelImgs) - (isAtBarrier ? 1 : 0)
	const levelExp = expData[level] / (isOldExp ? 10 : 1)
	barContainer.appendChild(_('div', { className: 'CNDCL_exp large' }, [
		_('text', getLevelInfoText(img.width, 374, levelExp))
	]))

	// 突破企鹅数
	if (location.pathname.endsWith('/collection/') && trophyData[level]) {
		const trophyImgs = [...document.querySelectorAll('.genkai_block_img img')].map(i=>i.src)
		const trophyCount = trophyData[level]
		barContainer.parentNode.querySelector('.character_lv_block').appendChild(_('table', { style: {
			position: 'absolute', left: '2px'
		} }, [
			_('tr', {}, [
				_('td', {}, [_('text', 'Next:')]),
				_('td', { rowspan: 2 }, [_('img', { src: trophyImgs[trophyCount > 100 ? 3 : 2], style: { width: '50px' } })])
			]),
			_('tr', {}, [
				_('td', { align: 'right' }, [_('text', `${trophyCount % 100} ×`)])
			])
		]))
	}
}
const characterListOnPage = []
function addLevelToCharacterList(img) {
	const barContainer = img.parentNode.parentNode
	const levelImgs = barContainer.parentNode.parentNode.querySelectorAll('.character_list_rank_num img')
	const isAtBarrier = barContainer.parentNode.querySelector('.character_list_rank_max') !== null
	const level = levelNumImageToNum(levelImgs) - (isAtBarrier ? 1 : 0)
	const levelExp = expData[level] / (isOldExp ? 10 : 1)
	const box = barContainer.parentNode.parentNode.parentNode.parentNode
	if (box.hasAttribute('name')) {
		characterListOnPage.push({
			node: box,
			level,
			levelReal: level + (1 - img.width / 270)
		})
	}
	barContainer.appendChild(_('div', { className: 'CNDCL_exp list' }, [
		_('text', getLevelInfoText(img.width, 270, levelExp))
	]))
}

function getLevelInfoText(filledWidth, totalWidth, levelExp) {
	filledWidth = totalWidth - filledWidth
	const lowerBound = Math.ceil(Math.max(filledWidth - 1, 0) / totalWidth * levelExp)
	const upperBound = Math.floor(Math.min(filledWidth + 1, totalWidth) / totalWidth * levelExp)
	const percent = (filledWidth / totalWidth * 100).toFixed(2)
	if (lowerBound === upperBound) return `${lowerBound}/${levelExp} ${percent}%`
	return `${lowerBound}~${upperBound}/${levelExp} ${percent}%`
}

function levelNumImageToNum(imgs) {
	return parseInt([...imgs].map(i => i.src.match(/(\d)\.png/)?.[1] ?? 0).join(''))
}

function addAvatarPointGrid(img) {
	if (server === 'jp') return
	img.parentNode.parentNode.appendChild(_('div', { className: 'avatar_point_grid' }, [
		_('img', { src: '/mobile/images/avatarpoint_gauge_line.png' })
	]))
}

function cloneCharacterToLevelList(n) {
	if (!n) return;
	// if (document.querySelector('.favorite_setting_block,.btn_change_favorite')) return;
	if (!/collection\/characterList/.test(location.href)) return;
	characterListOnPage.sort((a,b) => a.levelReal - b.levelReal)
	const p = characterListOnPage[0].node.parentNode
	const count = {}
	characterListOnPage.forEach(c => {
		const node = p.appendChild(c.node.cloneNode(true))
		node.style.display = ''
		node.dataset.levelCategory = getLevelCategory(c.levelReal)
		node.removeAttribute('name')
		count[node.dataset.levelCategory] = (count[node.dataset.levelCategory] || 0) + 1
	})
	LVL_CATEGORIES.forEach(c => {
		document.querySelector('select').appendChild(_('option', { value: c }, [_('text', `${c} (${count[c] || 0})`)]))
	})
	document.querySelector('select').addEventListener('change', e => {
		document.body.dataset.cndclCategory = e.target.value
	})
}
const LVL_CATEGORIES = [
	'LVL_1',
	'LVL_2_9',
	'LVL_10_14',
	'LVL_15',
	'LVL_16_24',
	'LVL_25',
	'LVL_26_49',
	'LVL_50',
	'LVL_51_99',
	'LVL_100_',
]
function getLevelCategory(lvl) {
	if (lvl < 2) return LVL_CATEGORIES[0]
	if (lvl < 10) return LVL_CATEGORIES[1]
	if (lvl < 15) return LVL_CATEGORIES[2]
	if (lvl < 16) return LVL_CATEGORIES[3]
	if (lvl < 25) return LVL_CATEGORIES[4]
	if (lvl < 26) return LVL_CATEGORIES[5]
	if (lvl < 50) return LVL_CATEGORIES[6]
	if (lvl < 51) return LVL_CATEGORIES[7]
	if (lvl < 100) return LVL_CATEGORIES[8]
	return LVL_CATEGORIES[9]
}

function addStyle() {
	document.head.appendChild(_('style', {}, [_('text', `
.CNDCL_exp {
	position: absolute;
	z-index: 20;
	height: 100%;
	font-size: 16px;
	line-height: 28px;
	margin-left: 0.5em;
	font-weight: bold;
	text-shadow: 1px 1px 2px white, 0 0 1em white, 0 0 0.2em white;
	color: black;
}
.CNDCL_exp.large {
	line-height: 38px;
	font-size: inherit;
}
.CNDCL_exp.list {
	transform: scaleX(0.9);
  transform-origin: left center;
}
`)]))
	document.head.appendChild(_('style', {}, [_('text', LVL_CATEGORIES.map((c) => `body:not([data-cndcl-category="${c}"]) [data-level-category="${c}"] { display: none; }`).join('\n'))]))
}

addLevelToPage()
})()