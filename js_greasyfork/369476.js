// ==UserScript==
// @name           Archive.org comfort audiobook player
// @name:ru        Archive.org удобные аудиокниги
// @description    Adds some hotkeys and stop timer
// @description:ru Добавляет горячие клавиши и таймер остановки
// @namespace      archive.org
// @version        0.0.2.3
// @author         AHOHNMYC
// @match          https://archive.org/embed/*
// @match          https://archive.org/details/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/369476/Archiveorg%20comfort%20audiobook%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/369476/Archiveorg%20comfort%20audiobook%20player.meta.js
// ==/UserScript==

/* Добавляет кнопку для перехода в Embedded-mode, в который вживлены:
 * * Пробел для Паузы/Прололжения
 * * Поддержка медиа-кнопок (работают только когда вкладка активна)
 * * Ползунок для остановки через определённое количество времени (например, для того чтобы засыпать под книгу :з)
 */

const defaultStopValue = 60*30;

const lang = {
	en: 'Stop after',
	ru: 'Остановка через',
};

const navLng = navigator.language.substr(0,2);
const STOP_AFTER = lang[navLng] ? lang[navLng] : lang.en;
delete lang;
delete navLng;

if (/^\/embed/.test(location.pathname)) {
	document.title = document.title.replace(' : Free Download, Borrow, and Streaming : Internet Archive','');

	initStopController();

	document.body.style.backgroundColor = 'black';
	document.body.style.overflow = 'auto';
	document.body.style.position = 'relative';
	setTimeout(()=>{
		document.querySelector('[aria-label="Cast media with AirPlay / Chromecast"]').style.display = 'none';
		document.querySelector('[aria-label="More Formats from Internet Archive"]').style.display = 'none';

		document.getElementById`jw6`.style.position = 'fixed';
		document.getElementById`jw6`.style.zIndex = 1;
		const listStyle = document.getElementById`jw6__list`.style;
		listStyle.height = '';
		listStyle.top = '33px';
		listStyle.position = 'relative';
	}, 500);
} else {
	addEmbedButton();
}

function addEmbedButton() {
	const newButton = document.querySelector('.action-buttons').appendChild(document.createElement('div'));
	newButton.classList.add('topinblock');
	newButton = newButton.appendChild(document.createElement('a'));
	newButton.classList.add('button');
	newButton.dataOriginalTitle = 'Embed';
	newButton.textContent = 'Embed';
	newButton.href = '/embed' + location.pathname.match(/^\/details(\/[^\/]+)/)[1] + '?playlist=true';
}

function initStopController() {
	document.addEventListener('keydown', e=>{
//		if (k=='MediaPlayPause' || k==' ') document.querySelector('.jwplay button').click();
//		if (k=='MediaTrackPrevious') document.querySelector('.jwprev button').click();
//		if (k=='MediaTrackNext') document.querySelector('.jwnext button').click();
		const k=e.key;
		if (k=='MediaPlayPause' || k==' ') {
			e.preventDefault();
			const el = document.getElementsByTagName`video`[0];
			el[el.paused ? 'play' : 'pause']();
		}
		const currTrackNumber = document.querySelector('.playing .n').textContent -1;
		const maxTrackNumber = document.getElementById`jw6__list`.childElementCount -1;
		if (k=='MediaTrackPrevious') {
			if (currTrackNumber === 0) return;
			window.Play('jw6').playN(currTrackNumber -1);
		}
		if (k=='MediaTrackNext') {
			if (currTrackNumber === maxTrackNumber) return;
			window.Play('jw6').playN(currTrackNumber +1);
		}

	});
	function addEl(el, newEl) { return el.appendChild(document.createElement(newEl)); }

	const mainEl = addEl(document.body, 'div');
	const button = addEl(mainEl, 'button');
	addEl(mainEl, 'br');
	const timer = addEl(mainEl, 'input');

	const timerC = {
		state: false,
		start: ()=>{
			this.interval = setInterval(()=>{
				timer.value--;
				timerC.updateTablo();
				if (timer.valueAsNumber) return;
//				const el = document.querySelector('.jwplay');
//				if ( el && el.classList.contains('jwtoggle') ) el.querySelector('button').click();
				document.getElementsByTagName`video`[0].pause();
				timerC.toggle();
			}, 1000);
		},
		stop: ()=>{ clearInterval(this.interval); },
		toggle: ()=>{
			timerC[(timerC.state?'stop':'start')]();
			timerC.state = !timerC.state;
			timerC.updateTablo();
		},
		updateTablo: ()=>{
			const m = Math.trunc(timer.value/60),
				  s = timer.value%60;
			button.textContent = (timerC.state? STOP_AFTER+' ':'') + (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
		}
	};


	mainEl.style = 'position: fixed; top:0; left:0; z-index:1';

	timer.type = 'range';
	timer.min = 0;
	timer.max = 60*90;
	timer.value = defaultStopValue;

	timer.style.width = '900px';
	timer.style.display = 'none';
	mainEl.addEventListener('mouseover', ()=>{timer.style.display = '';});
	mainEl.addEventListener('mouseout', ()=>{timer.style.display = 'none';});

	['change', 'mousemove'].forEach(trigger=>{ timer.addEventListener(trigger, timerC.updateTablo); });

	button.addEventListener('click', timerC.toggle);

	timerC.updateTablo();
}