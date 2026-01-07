// ==UserScript==
// @name        chuni-net - display level
// @namespace   esterTion
// @license     MIT
// @match       https://chunithm-net-eng.com/*
// @match       https://new.chunithm-net.com/*
// @match       https://chunithm.wahlap.com/*
// @grant       GM.xmlHttpRequest
// @version     1.0.7
// @author      esterTion
// @description Display song levels on chunithm-net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/475949/chuni-net%20-%20display%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/475949/chuni-net%20-%20display%20level.meta.js
// ==/UserScript==

(async function() {

const host = location.hostname
const server = host === 'new.chunithm-net.com' ? 'jp' : host === 'chunithm-net-eng.com' ? 'ex' : host === 'chunithm.wahlap.com' ? 'cn' : ''
if (!server) throw new Error('unknown server')

// createElement
function _(e,t,i){var a=null;if("text"===e)return document.createTextNode(t);a=document.createElement(e);for(var n in t)if("style"===n)for(var o in t.style)a.style[o]=t.style[o];else if("className"===n)a.className=t[n];else if("event"===n)for(var o in t.event)a.addEventListener(o,t.event[o]);else a.setAttribute(n,t[n]);if(i)if("string"==typeof i)a.innerHTML=i;else if(Array.isArray(i))for(var l=0;l<i.length;l++)null!=i[l]&&a.appendChild(i[l]);return a}

const localStorageTimeKey = 'CNDL_music_level_info_time'
const localStorageDataKey = 'CNDL_music_level_info'
let musicLevelInfo = {}
function loadLocalInfo() {
	if (!localStorage[localStorageDataKey]) return
	musicLevelInfo = JSON.parse(localStorage[localStorageDataKey])
}
function checkUpdateForLocalInfo() {
	const today = getDateStringForUpdate()
	if (!localStorage[localStorageTimeKey] || localStorage[localStorageTimeKey] !== today) {
		downloadInfo(today)
	}
}
async function downloadInfo(today) {
	console.log('downloading music info')
	switch (server) {
		case 'jp': {
			const resp = await Promise.all([
				fetchJson('https://estertion.win/__private__/chuni-jp-base-music.json'),
				fetchJson('https://estertion.win/__private__/chuni-jp-doc-music.json'),
				fetchJson('https://chunithm.sega.jp/storage/json/music.json'),
			])
			fillInfo(resp[0])
			fillInfoNonMatch(resp[1])
			fillInfoNonMatch(resp[2])
			break;
		}
		case 'ex': {
			const resp = await Promise.all([
				fetchJson('https://estertion.win/__private__/chuni-intl-option-music.json'),
				fetchJson('https://chunithm.sega.com/assets/data/music.json'),
			])
			fillInfo(resp[0])
			fillInfoNonMatch(resp[1])
			break;
		}
		case 'cn': {
			await fetchJson('https://estertion.win/__private__/chuni-chn-music.json').then(fillInfo)
			break;
		}
	}
	localStorage[localStorageDataKey] = JSON.stringify(musicLevelInfo)
	localStorage[localStorageTimeKey] = today
	console.log('stored music info: ', Object.keys(musicLevelInfo).length, 'entries')
	addLevelToPage()
}
function fillInfoNonMatch(list) {
	fillInfo(list, false)
}
function fillInfo(list, alwaysOverwrite = true) {
	list.forEach(i => {
		if (i.we_kanji) return
		const title = i.title.trim()
		const music = {}
		if (musicLevelInfo[title]) {
			Object.assign(music, musicLevelInfo[title])
		}
		Object.assign(music, Object.fromEntries(
			Object.keys(i).filter(k => k.startsWith('lev_')&&i[k]!=='').filter(k => alwaysOverwrite || isDifferentLevelTag(music[k.substring(4)], i[k])).map(k => ([k.substring(4), i[k]]))
		))
		musicLevelInfo[title] = music
	})
}
function isDifferentLevelTag(l1, l2) {
	if (!l1 || !l2) return true
	if (l1.indexOf('.') !== -1 && l2.indexOf('.') === -1) return false
	if (l1.indexOf('.') === -1 && l2.indexOf('.') !== -1) return true
	return Math.floor(l1.replace(/\+/, '.5')*2) !== Math.floor(l2.replace(/\+/, '.5')*2)
}

function getDateStringForUpdate() {
	const d = new Date
	d.setTime(d.getTime() + d.getTimezoneOffset() * 60e3 + {jp:11,ex:11,cn:10}[server]*3600e3)
	return [d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate()].join('/')
}
function fetchJson(url) {
	return new Promise((res, rej) => {
		GM.xmlHttpRequest({
			url: url + '?_=' + Date.now(),
			responseType: 'json',
			method: 'GET',

			onload: r => res(r.response),
			onerror: e => rej(e),
		})
	})
}

function addLevelToPage() {
	[...document.querySelectorAll('.CNDL_level_container')].forEach(i => i.remove());
	[...document.querySelectorAll('.play_track_block+.play_musicdata_block .play_musicdata_title')].forEach(addLevelToPlaylog);
	[...document.querySelectorAll('.course_musicdata_title_text')].forEach(addLevelToCourse);
	[...document.querySelectorAll('.musiclist_box .music_title')].forEach(addLevelToList);
	[...document.querySelectorAll('.music_box .play_musicdata_icon')].forEach(addLevelToDetail);
	[...document.querySelectorAll('.CNDL_level_container')].forEach(i => i.textContent===''&&i.remove());
}
function addLevelToPlaylog(titleDiv) {
	const difImg = titleDiv.parentNode.parentNode.querySelector('.play_track_result img')
	const path = difImg.getAttribute('src').split('/').pop().split('?')[0]
	const dif = getDifFromPath(path)
	if (!dif) return
	const levelDiv = _('div', {style:{float:'right',padding:'5px 0',height:'42px',lineHeight:'30px',fontFamily:'Arial'}})
	titleDiv.parentNode.insertBefore(levelDiv, titleDiv)
	addLevelToContainer(titleDiv.textContent.trim(), dif, levelDiv)
}
function addLevelToCourse(titleDiv) {
	const difImg = titleDiv.parentNode.parentNode.querySelector('.course_musicdata_track_diff img,.course_musicdata_diff img')
	const path = difImg.getAttribute('src').split('/').pop().split('?')[0]
	const dif = getDifFromPath(path)
	if (!dif) return
	const levelDiv = _('div', {style:{float:'right',fontFamily:'Arial',fontWeight:'initial'}})
	titleDiv.insertBefore(levelDiv, titleDiv.lastChild)
	addLevelToContainer(titleDiv.textContent.trim(), dif, levelDiv)
}
function addLevelToList(titleDiv) {
	const dif = getDifFromClass(titleDiv.parentNode)
	if (!dif) return
	const levelDiv = _('div', {style:{float:'right',fontFamily:'Arial',fontWeight:'initial'}})
	titleDiv.insertBefore(levelDiv, titleDiv.lastChild)
	addLevelToContainer(titleDiv.textContent.trim(), dif, levelDiv)
}
function addLevelToDetail(iconDiv) {
	const difDiv = iconDiv.parentNode.parentNode.firstElementChild
	const dif = getDifFromClass(difDiv)
	if (!dif) return
	const levelDiv = _('span', {style:{paddingLeft: '1em',fontFamily:'Arial',fontWeight:'initial'}})
	difDiv.appendChild(levelDiv)
	addLevelToContainer(document.querySelector('.play_musicdata_title').textContent.trim(), dif, levelDiv)
}
function addLevelToContainer(title, dif, levelDiv) {
	levelDiv.className = 'CNDL_level_container'
	if (!musicLevelInfo[title]) return
	if (!musicLevelInfo[title][dif]) return
	levelDiv.textContent = musicLevelInfo[title][dif]
}
function getDifFromPath(path) {
	switch (path) {
		case 'musiclevel_basic.png': { return 'bas' }
		case 'musiclevel_advanced.png': { return 'adv' }
		case 'musiclevel_expert.png': { return 'exp' }
		case 'musiclevel_master.png': { return 'mas' }
		case 'musiclevel_ultimate.png': { return 'ult' }
	}
	return null
}
function getDifFromClass(div) {
	const divClass = [...div.classList].filter(i => i.startsWith('bg_') || i.startsWith('title_'))
	if (!divClass.length) return null
	switch (divClass[0]) {
		case 'bg_basic': { return 'bas' }
		case 'bg_advanced': { return 'adv' }
		case 'bg_expert': { return 'exp' }
		case 'bg_master': { return 'mas' }
		case 'bg_ultima': { return 'ult' }

		case 'title_basic': { return 'bas' }
		case 'title_advanced': { return 'adv' }
		case 'title_expert': { return 'exp' }
		case 'title_master': { return 'mas' }
		case 'title_ultima': { return 'ult' }
	}
	return null
}
function fixEmblemOverflow() {
	const style = _('style', {}, `#wrap{overflow:hidden}`)
	document.head.appendChild(style)
}
function fixPageWidth() {
	const meta = document.querySelector('meta[name="viewport"]')
	if (screen.width <= 552) {
		meta.setAttribute('content', 'width=552,user-scalable=yes')
	} else {
		meta.setAttribute('content', 'width=device-width,user-scalable=yes')
	}
}

fixEmblemOverflow()
fixPageWidth()
window.addEventListener('resize', fixPageWidth)
loadLocalInfo()
checkUpdateForLocalInfo()
addLevelToPage()

})()
