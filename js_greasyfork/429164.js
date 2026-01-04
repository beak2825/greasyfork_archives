// ==UserScript==
// @name		seasonvar.ru
// @namespace	M3U
// @version		0.3
// @description	take over the world!
// @author		Hitler
// @license		MIT
// @match		*://seasonvar.ru/*
// @icon		http://seasonvar.ru/favicon.ico
// @grant		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429164/seasonvarru.user.js
// @updateURL https://update.greasyfork.org/scripts/429164/seasonvarru.meta.js
// ==/UserScript==

console.clear();
var window = unsafeWindow;

// reDesign + небольшая косметика
$('body>style:first').remove();
$('.header_icon').remove();
$('#player_msoc .yashare-auto-init, #player_msoc script').remove();
$('head').append(`<style>body {padding: 0 !important}</style>`);

// add Button
function ifAddButton() {
	if (window.location.pathname.match(/serial-/)) {
		var timesRun = 0;
		var interval = setInterval(function(){
			if(window.pl != undefined){
				clearInterval(interval);
				if ( $('ul.pgs-trans').length == 1 ) {
					$('ul.pgs-trans').prepend('<li data-playlist="m3u" style="background: #013300;">M3U</li>');
				} else {
					$('.pgs-player-inside').append('<ul class="pgs-trans"><li data-playlist="m3u" style="background: #013300;">M3U</li><li data-click="translate" data-translate="0" data-translate-percent="100" class="act">Стандартный</li></ul>');
				}
			}
		}, 500); 
	}
}

ifAddButton();

let playlist = [];
let translate; // название студии и ID
let serial; // полное название для плейлиста внутри и имя файла
let SD;
let HD;
let dataSize; // всего ключей в объекте-плейлисте
let quality; // document.cookie -  hdq=1 (обычное SD)

// 1.
function getPlayList(){
	translate = document.querySelector('.pgs-trans > li.act');
	GM_xmlhttpRequest({
		url: window.pl[translate.dataset.translate],
		method: 'GET',
		responseType: 'json',
		onload: function(data) {
			data = JSON.parse(data.responseText); //
			console.log(data);
			let pack = $('#htmlPlayer_playlist > pjsdiv:first').text();
			// Получить название сериала из закголовка и подчистить его от мусора
			serial = $('h1').text().replace(/^Сериал | онлайн/g, '');
			serial = serial.replace(/  /g, ' ').replace(/\//g, ' _ ');
			serial = serial.replace(/(\d+ сезон)/g, '($1)');
			// дописать переводчиков
			serial += ` [${translate.textContent.trim()}]` ;
			console.log('serial: ', serial);
			// Проверка на наличие разделов
			if (data[0].folder !== undefined) {
				data.forEach(function(item, i) {
					if (item.title == pack) {
						playlist = ['#EXTM3U',`#PLAYLIST:${serial} [${data[i].title}]`,];
						serial += ` [${data[i].title}]`;
						data = data[i].folder;
					}
				});
			} else {
				playlist = ['#EXTM3U','#PLAYLIST:'+serial,];
			}
			garbageClear(data);
		},
		error: function(data) {
			console.log('error:');
			console.log(data)
		}
	});
}
// 2. декодировать, убрать лишнее, склеить! 
function garbageClear(data) {
	for (key in data) {
		data[key].title = data[key].title.replace(/<br>/g, ' '); 
		data[key].file = atob( data[key].file.replace(/^#2|\/\/b2xvbG8=/g, '') ); 
	}
	SD = data;
	if (quality != undefined) {
		generateM3U(SD);
	} else {
		generateLink720p();
	}
}
// b. CREATE HD
function getHeadHD(hdk,url) {
	console.log(hdk,url);
	HD[hdk].file = url;
	if (--dataSize === 0) {
		console.log('SD',SD);
		console.log('HD',HD);
		generateM3U(HD);
	}
}
// a. CREATE HD 
function generateLink720p() {
	HD = JSON.parse(JSON.stringify(SD));
	dataSize = HD.length;

	for (key in HD) {
		let hdk = key;
		if ( HD[key].title.includes('/HD') ) {
			console.log(`${key} содержит HD`);
			let newURL = HD[key].file.replace(/.+\/7f_/g, 'http://data-hd.datalock.ru/fi2lm/4626aee26e6e44334f2e64cea6747354/1541811549/834600/hd_');
			GM_xmlhttpRequest({
				url: newURL,
				method: "HEAD",
				onload: function(re) {
					if (re.status === 200) {
						getHeadHD(hdk, re.finalUrl);
					} else {
						getHeadHD(hdk, HD[hdk].file);
					}
				}
			});
		} else {
			console.log(`${key} всего лишь SD`);
			getHeadHD(hdk, HD[hdk].file);
		}
	}
}
// 3. Создание плейлиста
function generateM3U(all) {
	for (k in all) {
		playlist.push( '#EXTINF:-1, ' + all[k].title); 
		playlist.push(all[k].file); 
	}
	if (popup == true) {
		$('#svmodal-in').css({'background-color': 'antiquewhite',});
		$('#svmodal-in').append(`<br>`)
		for (key in all) {
			console.log( all[key] );
			$('#svmodal-in').append(`<a href="${all[key].file}" target="_blank">${all[key].title}</a><br>`)
		}
	} else {
		playlist = playlist.join("\n");
		createFile();
	}
}
// 4. Создание ссылки-файла.
function createFile() {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:audio/x-mpegurl;charset=UTF-8,' + encodeURIComponent(playlist));
	element.setAttribute('download', `${serial}.m3u` );
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

let popup;
$(document).on('click', '[data-playlist="m3u"]', function(e){
	popup = false;
	document.cookie.split('; ').forEach(function(item, i) {
		if (item == 'hdq=1') { quality = true }
	});
	getPlayList();
});

$(document).on('click', '[data-click="extPlayerGetCode"]', function(e){
	popup = true;
	getPlayList();
});

// передобавить сслыку для M3U
$(document).on('mousedown', 'pjsdiv#htmlPlayer_control_hdout', function(e){
	ifAddButton();
});