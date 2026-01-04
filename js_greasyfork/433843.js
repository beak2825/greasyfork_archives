// ==UserScript==
// @name         HDRezka.M3U
// @namespace    my
// @version      0.1
// @description  зОхватить мир!
// @author       H.
// @match        *://hdrezka.tv/*
// @match        *://rezka.ag/*
// @match        *://rezkery.com/*
// @match        *://hdrezka-ag.com/*
// @icon         https://www.google.com/s2/favicons?domain=rezkery.com
// @run-at       document-start
// @grant        unsafeWindow
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433843/HDRezkaM3U.user.js
// @updateURL https://update.greasyfork.org/scripts/433843/HDRezkaM3U.meta.js
// ==/UserScript==

console.log('-------- START --------');
var window = unsafeWindow;
function log(data) {console.log(data)}
console.clear()

// Ожидание элементов Ajax
function waitElements(selector, callback, wait, iframeSelector) {
	var targetsFound;
	var target = (typeof iframeSelector == 'undefined') ? $(selector) : $(iframeSelector).contents().find(selector);
	if (target && target.length > 0) {
		targetsFound = true;
		target.each(function() {
			var thisTarget = $(this);
			var alreadyFound = thisTarget.data('alreadyFound') || false;
			if (!alreadyFound) {
				var cancelFound = callback(thisTarget);
				if (cancelFound) {
					targetsFound = false;
				} else {
					thisTarget.data('alreadyFound', true);
				}
			}
		});
	} else {
		targetsFound = false;
	}
	var controlObj = waitElements.controlObj || {};
	var controlKey = selector.replace(/[^\w]/g, "_");
	var timeControl = controlObj[controlKey];
	if (targetsFound && wait && timeControl) {
		clearInterval(timeControl);
		delete controlObj[controlKey]
	} else {
		if (!timeControl) {
			timeControl = setInterval(function() {
					log('--- waitElement ---')
					waitElements(selector, callback, wait, iframeSelector);
				}, 500  );
			controlObj[controlKey] = timeControl;
		}
	}
	waitElements.controlObj = controlObj;
}

// ОБЪЕКТ ФУНКЦИЙ
var HDRezka = {
	// проверка авторизации
	getAuth() {
		if( $('#saves-count').length == 1 ) {
			Auth = true;
			HDRezka.getWatched();
		}
	},
	// получить список просмотренного
	getWatched() {
		// Опросить счётчик просмотренного. Получить текущие данные о просмотрах и внести имзенения.
		window.watched = (localStorage.HDRezka == undefined) ? localStorage.HDRezka = JSON.stringify({counter:0,video:{}}) : JSON.parse(localStorage.HDRezka);
		// Опросить счётчик просмотренного (и внести) имзенения. Контролиь над текущим положением дел на странице по клику или через опрос?
		if ( Number($('#saves-count').text()) !== window.watched.counter ) {
			log('на счётчике: '+Number($('#saves-count').text())+'  а было: '+window.watched.counter);

			var settings = {
				"url": "//hdrezka.tv/continue/",
				"method": "GET",
			};
			$.ajax(settings).done(function (re) {
				let doc = new DOMParser();
				doc = doc.parseFromString(re, 'text/html');
				let table = $('#videosaves-list', doc);
				table = table.find('.b-videosaves__list_item').not(':first'); // log(table);
				// как? лучше сократить запрос? через jquery и нужно ли?
				//item
				let watched = {};
				let id;
				$.each(table, function(i, item){
					// получить ID из ссылки. Можно и URL но для этого нужно сравинть скорости.
					id = $(this).find('.title a').attr('href');
					id = id.split('/').filter(element => element !== '');
					id = id[id.length - 1];
					id = id.split('-').shift(); // Number() нужно ли приводить к числу?
					var url = new URL( $(this).find('.title a').attr('href') ); // (для ленты нового на глагне) корректное преобразование
					let data = {
						status: $(this).hasClass('watched-row'),
						title: $(this).find('.title').text().trim(),
						data_id: $(this).find('.controls-holder a:last').data('id'),  // save-id параметр нужен для отметки "просмотрено и закончено"
						url: url.pathname
					};
					watched[id] = data; // лучше по ID? но оставить в базе url?
				});
				window.watched = {counter: Object.keys(watched).length, video: watched};
				localStorage.HDRezka = JSON.stringify( window.watched );
			});
		}
	},
	//
	Home(e) {
		$('.b-seriesupdate__block_list iframe').closest('.b-seriesupdate__block_list_item').remove();
	},
	//
	reDesignHTMLandParse() {
		log('Remove Right Block')
		// модификация страницы
		$('.b-content__columns.pdt > div[id]').remove();
		$('.b-content__columns.pdt').css({'padding-right':'inherit'})
		// модификация плеера
		$('#cdnplayer-container').css({height: '540px', width: 'inherit'}) // 960px
		$('#cdnplayer').css({height: '540px', width: 'inherit'}) //960px
		// если есть на торрентах — удалить блямбу и добавить иконку
		let torrent = $('.b-post__status__tracker__download').attr('href');
		if( torrent != undefined ) {
			$('.b-post__status__tracker__download').closest('div').remove()
			$('#send-video-issue').before(`<a href="${torrent}" target="_blank" class="download">
				<i class="down">
					<svg viewBox="0 0 24 24" fill="#FBBC05"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
				</i></a>`)};
		$('.b-post__rating_table + div[id]').remove();
		$('.share-list,.share-label').remove();
		$('.b-post__social_holder').append( $('.b-post__rating_table') )
		// Получить переменные из <SCRIPT> и всё только ради ID переводчиков
		$(document).ready(function() { // дождаться загрузки документа
			let button_txt;
			document.querySelectorAll('body script').forEach(function(item, i, arr) {
				if (item.innerHTML.search(/initCDNSeriesEvents|initCDNMoviesEvents/) != -1) {
					// зачем пыжиться с функцией, если уж резать регуляркой то до массива.
					let current = item.innerHTML.replace(/\); }\); \$\(function \(\) \{ sof\.tv\.initWatchingEvents.*/, ']');
					//сериал/фильм.
					current = current.replace(/.*initCDNSeriesEvents\(/, '[');
					current = current.replace(/.*initCDNMoviesEvents\(/, '[');
					current = eval(current); // извлекаем переменные
					// фильм или сериал по кол-ву переменных
					if (current.length == 5) {
						videoData = {type:'film',cdn:current}
						button_txt = 'MP4';
					} else {
						videoData = {type:'soap',cdn:current}
						button_txt = 'M3U';
					}
					// Добавить кнопку — m3u / mp4
					$('.b-post__actions td:last').after(`
					<td><div class="b-sideactions__reviews">
						<button id="m3u-button" class="btn btn-action m3u" type="button">${button_txt}</button>
					</div></td>`);
				}
			});
		});
	},
	//
	reDesignDirectory(items) {
		// если есть Авторизация, то ожидаем список отсмотренного.
		if(Auth) {
			log('TRUE AUTH')
			let wait = setInterval(function(){
				if(window.watched != undefined){
					clearInterval(wait);
					items.find('.b-content__inline_item').each(function(i, el) {
						let id = $(el).data('id');
						if ( window.watched.video[id] != undefined) {
							$(el).addClass( `${window.watched.video[id].status}` );
						}
						$(el).find('.entity').remove();
					});
				}
			}, 10);
		}
	},
	// ADD CSS
	addCSS() {

		$('head').append(`<style id="myHDRezka">

			/* ------------------------ Удалить рекламу и правый сайдбар ------------------------*/
			body > noindex {display:none !important;}

			.b-content__main + div[id] {display:none;}
			.b-content__inline_items + div[id] {display:none;}
			.b-post__social_holder_wrapper + div[id] {display:none !important;}
			#vk_groups {display:none;}
			#page_wrap {display:none;}
			.b-post__mixedtext + div[id] {display:none;}

			/* мусорное */
			.b-post__support_holder {display:none;}
			.b-post__mixedtext {display:none;}
			.tg-info-block_holder {display:none;}
			.share-label {display:none;}
			#user-network-issues + a {display:none;}
			#send-video-issue .append {display:none;}

			/* ------------------------ Мои добавления CSS ------------------------*/

			.b-post__actions {margin-bottom: .5em;}
			.b-sideactions__fav .add-favorite {border-radius: 0;}
			.pllst {display: flex;}
			.pllst a {color: #3572ab; text-align: center; flex-grow: 1; background-color: #cae5ff; line-height: 2em; margin-right: 4px; border: 1px solid #93c3f1; border-radius: 3px; text-decoration: none; user-select: none;}
			.pllst a:last-child {margin-right: 0;}

			/* кнопка m3u*/
			.btn-action.m3u {background-color: #3572ab; border: 1px solid #5a6fb3; border-radius: 0 3px 3px 0;}

			/* над видосом */
			.b-post__lastepisodeout {display: none;}

			/* body.has-brand #wrapper {background-color: #7b7b7b !important;} */


			/* ------------------------ ОБЩИЙ CSS ------------------------*/

			/* TOPHEAD подписки на соцсети */
			.b-tophead__subscribe-dropdown {display: none;}
			.tumbler__wrapper {margin-left: 0;}

			.b-tophead-dropdown a {padding: 0 4px; line-height: 40px; border-top: 1px dotted #999;}
			.b-tophead-dropdown {padding: 0 4px 0 15px;}

			/* размеры контента 1000px по умолчанию */

			body.active-brand.pp {padding-top: 0px !important;}
			body.active-brand #wrapper {width: 1200px;}


			/* При авторизации меняется */
			body.has-brand #wrapper {background-color: #efefef !important; width: 1200px; margin: 0 auto;}
			body.has-brand #footer {width: 1200px; margin: 0 auto;}
			.b-wrapper {width: calc(100% - 20px)}
			body.active-brand #footer {width: 1200px;}
			.b-sidetitle.mm, .b-post__mtitle {margin-bottom: .7rem;}
			.b-content__section_description {font-size: 1rem; line-height: 1.4rem;}
			.b-content__filters_types, .b-content__main_filters_link, .b-content__filters_types .filter-link {font-size: 15px;}


			/*	универсализация размера контента !!!
				.has-brand {width: 1200px;	margin: 0 auto;}
				.b-wrapper {padding: 0 10px; width: calc(100% - 20px)}
				*/


			/* КОЛЛЕКЦИИ — collections */
			.b-content__collections_list.clearfix:before {
				content: inherit;
				display: table;
				/*margin-left: -8px;*/
			}
			.b-content__collections_list {margin-left: 0; display: flex; gap: 8px; flex-wrap: wrap;
			}
			.b-content__collections_item {
				cursor: pointer;
				float: left;
				position: relative;
				margin-left: 0;
				margin-bottom: 0;
				flex-basis: calc((100% - 24px)/4);
				height: 167px;
				box-sizing: border-box;
			}
			.b-content__collections_item .cover {width: 100%; height: auto;}

			/* слайдер */
			.b-newest_slider {width: inherit;}
			.b-newest_slider .cntrl.next {right: 10px;}
			.b-newest_slider .cntrl.prev {left: 10px;}
			.b-newest_slider__wrapper {padding-left: initial;}

			/* одни и те же коллекции выжирающие место. скрыть или удалить? */
			.b-collections__newest {display: none;}

			/* описание директории */
			.b-content__description p, .b-content__description div {margin: .8rem 0;}
			.b-content__description {font-size: 1rem; margin-bottom: 1rem; line-height: 1.6rem;}

			/* описание фильма */
			.b-post__description_text { font-size: 1rem; margin-bottom: 1rem; line-height: 1.4rem;}

			/* комментарии	*/

			body.active-brand .comments-form {margin-bottom: 1rem;}
			.b-addcomment td {padding-top: 0;}
			.addcomment-layer {padding-bottom: 0;}

			.b-comment {font-size: .9rem;}
			.b-comment .info {margin-bottom: .2rem;}
			.b-comment .name {font-size: .9rem;}
			.b-comment .date {font-size: .8rem;}
			.b-comment .share-link {font-size: .8rem;}
			.b-comment .text {margin-bottom: .3rem;}
			.b-comment__quoteuser, .b-comment__like_it {font-size: .8rem;}


			/* ГЛАВНАЯ/CATEGORY */

			/* слайдер */
			.b-newest_slider {padding: 20px 54px 0;	}
			.b-newest_slider__inner {margin-left: 0;}
			.b-newest_slider__list {display: flex; gap: 8px;}
			.b-newest_slider__list .b-content__inline_item {display: block; float: initial; margin: 0; margin-left: initial; width: initial; flex-basis: 129px;}

			/* новое + лента*/
			.b-content__inline_inner_main {padding-right: 0;}
			.b-content__inline_inner_main .b-content__inline_items {float: left; display: flex; flex-wrap: wrap; width: calc( 100%/3*2 ); gap: 8px;}
			.b-content__inline_inner_main .b-content__inline_item {flex-basis: calc( (100% - 34px) /4 );}
			.b-content__inline_sidebar {float: right; box-sizing: border-box; margin: 0 0 40px; padding-top: 0; width: calc( 100%/3 );}

			/* таблица с последними поступлениями */
			.b-seriesupdate__block_date {padding: 7px 8px;}
			.b-seriesupdate__block_list_item_inner .cell-1 {padding-left: 8px;}
			.b-seriesupdate__block_list_item_inner .cell-2 {padding-right: 8px;}

			/* ------------------------ CATEGORY ------------------------*/

			.b-content__inline_items {float: inherit; width: inherit; display: flex; gap: 8px; flex-wrap: wrap;}
			.b-content__inline_item {box-sizing: border-box; display: initial; margin: 0 0px 20px; width: inherit; flex-basis: calc( (100% - 40px) / 6 );}
			.b-content__inline_inner {margin-left: 0;}
			.b-content__inline_inner_mainprobar {margin-left: 0;padding-right: 0;}
			.b-content__inline_inner_mainprobar .b-content__inline_item {margin-left: 0 !important;}

			/* ПРЕВЬЮХИ стандартное*/
			.b-content__inline_item-cover {border: 1px solid #ddd; padding: 2px; border-radius: 4px; overflow: hidden;}
			.b-content__inline_item-cover img {width: 100%; height: auto;}

			/* ПРЕВЬЮХИ цветовое моё */
			.b-content__inline_item.true .b-content__inline_item-link {background-color: #00ffa73b;}
			.b-content__inline_item.false .b-content__inline_item-link {background-color: #ff53534d;}
			.b-content__inline_item.true .b-content__inline_item-cover {border: 1px solid #00ffa73b;}
			.b-content__inline_item.false .b-content__inline_item-cover {border: 1px solid #ff53534d;}

			/* название подпись */
				.b-content__inline_item-link {
				padding: 6px 4px;
				margin-top: 4px;
				border-radius: 4px;
				/*height: 100%;*/
				/* border-top: 4px solid #ffe0e0; */
			}

			/* пагинатор */
			.b-navigation {display: block; width: 100%; font-size: 1rem; line-height: 1.4rem;}

			/* ПЛЮШКИ НА ПРЕВЬШКЕ ВИДЕО */
			.b-content__inline_item .trailer {height: 26px; top: 3px; left: 3px; width: 26px;}
			.b-content__inline_item .trailer:after {left: 3px;}
			.b-content__inline_item .trailer b {font-size: 9px; padding-top: 5px; padding-left: 10px;}
			.b-content__inline_item .trailer:before {left: 9px;}
			/* огромная кнопка */
			.b-content__inline_item .play {display: none;}


			/* ------------------------ .HTML PLAYER ------------------------*/

			/* требует ряда перДелок*/

			.b-content__columns {padding-right: 0;}

			.b-sidelist__holder .b-sidelist {width: 100% !important;display: flex;gap: 8px;}

			.b-post .b-sidelist {margin-left: 0;}
			.b-post .b-sidelist .b-content__inline_item {margin-left: 0 !important;flex-basis: calc( (100% - 64px) / 9 );}

			.b-sidecover {margin-bottom: 8px;}

			/* под видосом желитзна фона социалок*/
			.b-post__social_holder {background: #2d2d2d;height: 42px;line-height: 42px;padding: inherit;}
			.b-post__social_holder .share-list {display: none;}

			/* абуза на коммент */
			.b-comment__report {display: none;}

			/* меняем вид Торрентов, если есть*/
			.download {border-radius: 0;transition: background-color 0.2s linear;border: 0float: right;height: 42px;width: 42px;margin: 0;position: absolute;top: 0;right: 42px;outline: 0;}

			.down svg {height: 34px;margin: 4px;opacity: .7;}

			/* abuse */
			.b-post__support_holder_report {height: 42px;width: 42px;}

			/* размеры элементов */
			.b-player {padding-top: 0;}

			/* переводчики */
			.b-translators__block {padding-top: 8px;padding-left: 8px;padding-bottom: 8px;}
			.b-translators__list {display: flex;gap: 2px;flex-wrap: wrap;}
			.b-translator__item {min-width: initial;max-width: initial;margin: initial;box-sizing: border-box;border: 1px solid #151515;flex-basis: calc( (100% - 8px)/5 );}

			.b-simple_seasons__list {padding: 8px;}

			.b-simple_episodes__list {padding: 0 8px 8px;display: flex;gap: 2px;flex-wrap: wrap;}
			.b-simple_episodes__list.clearfix:before {content:initial;}
			.b-simple_episode__item {background: #2d2d2d;color: #fff;cursor: pointer;font-size: 14px;margin: initial;min-width: initial;padding: 6px;box-sizing: border-box;border: 1px solid black;flex-basis: calc( (100% - 18px)/10 );}

			.b-sidelist .b-content__inline_item {width: 114px;}

			.b-post__rating_table td:first-child {width: 8%;color: #9e9e9e;}

			.b-post__rating .votes {color: #9e9e9e;}

			.b-post__status_wrapper {width: 942px;}

			/* Персоны */
			.b-person__career .b-sidelist {display: flex; gap: 8px; flex-wrap: wrap;}
			.b-person__career .b-content__inline_item {flex-basis: calc( (100% - 40px) / 6 ) !important;}

			/* FAVORITES */
			.b-favorites_content__sidebar {float: initial;margin-bottom: 40px;margin-right: 0;width: initial;}
			.b-favorites_content__cats_list_item {display: inline-block;}

		</style>`);
	},
	// если нет перевода, то подставить страну? например СССР по родине фильма.
	createPlayList() {
		All = {};
		videoData.title_ru = $('h1[itemprop]').text();
		videoData.title_dop = $('.b-post__origtitle').text();
		// !!! через переменные, дабы избежать перезаписывания  undefined-ом
		let translator_id = $('#translators-list>.active').data('translator_id');
		let title_trans = $('#translators-list>.active').attr('title');

		if (translator_id == undefined && title_trans == undefined) {
			$('.b-post__info tr').each(function() {
				if ( $(this).find('td:first').text() == 'В переводе:' ) {
					title_trans =  ($(this).find('td:last').text());
					videoData.title_trans = title_trans; // добавляем в глобалку  переводчика
				}
				translator_id = videoData.cdn[1]
			});
		} else {
			videoData.title_trans = title_trans;
		}
		let episode_list = $('.b-simple_episodes__list:not([style="display: none;"]) > li');
		let counter = episode_list.length;

		episode_list.each(function () {
			let episode = $(this).data('episode_id');
			HDRezka.getPlaylist( counter, translator_id, $(this).data() );
			log('counter.each '+counter)
		});
	},
	// POST запросы для сериалов
	getPlaylist( counter, translator_id, query ) {

		let settings = {
			'url': 'http://hdrezka.tv/ajax/get_cdn_series/',
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			'data': {
				'id': query.id,
				'translator_id': translator_id,
				'season': query.season_id,
				'episode': query.episode_id,
				'action': "get_stream"
			},
			dataType: 'json',
		};

		$.ajax(settings).done(function (re) {
			let urls = re.url;

			urls = urls.split(',')
			let tmp = new Object();
			urls.forEach(function(item, i) {
				let result = item.split(' or ');
				let res = result[0].replace(/\[(.*)\]http.+$/, '$1');
				tmp[res] = result[1];
			});
			All[query.episode_id] = tmp; // поскольку номер эпизода с единицы и асинхронка

			// если все ключи (серии собраны)
			if ( Object.keys(All).length == counter) {
				console.log('----- m3u -----')
				log(videoData.title_ru+' : '+videoData.title_dop+' : '+videoData.title_trans); //log(All)
				// удаление уже сформированного плейлиста на случай повторного клика
				$('.pllst').remove();
				// подготовить плейлисты согласно имеющихся разрешений
				let playlists = {};
				$.each(All[1], function(size){
					playlists[size] = [
						`#EXTM3U`,
						`#PLAYLIST: ${videoData.title_ru} (${videoData.title_dop}) [${videoData.title_trans}, ${size}] `,
					];
				});
				$.each(All, function(ser){
					$.each(All[ser], function(size, url){
						playlists[size].push(`#EXTINF:-1, ${ser} серия ${videoData.title_trans}`);
						playlists[size].push(url);
					});
				});
				// создание M3U из собранных масивов
				var $pllst = $('<div class="pllst"></div>');
				console.log( playlists );
				$.each(playlists, function(size, playlist){
					var m3u = $(`<a>${size}</a>`);
					playlist = playlist.join("\n");
					m3u.attr({'href':'data:text/plain;charset=utf-8,'+encodeURIComponent(playlist), 'download':`${videoData.title_ru} [${videoData.title_trans}, ${size}].m3u`})
					$pllst.append(m3u);
				});
				// удаление ссылок на случай повторного запроса/клика
				All = [];
				$('.b-post__actions').after( $pllst );
			}
		});
	},
	// формирование ссылок на видео
	createLinkVideo() {
		$('.pllst').remove(); // удаление уже сформированного m3u на случай повторного клика
		let title_ru = $('h1[itemprop]').text();
		let title_dop = $('.b-post__origtitle').text();
		let title_trans = $('#translators-list>.active').attr('title');
		let $pllst = $('<div class="pllst"></div>');
		let streams = CDNPlayerInfo.streams.split(',')
		let data = new Object();
		streams.forEach(function(item) {
			let result = item.split(' or ');
			let size = result[0].replace(/\[(.*)\]http.+$/, '$1');
			let url = result[1];
			let $link = $(`<a>${size}</a>`);
			$link.attr({'href':url});
			$pllst.append($link);
		});
		$('.b-post__actions').after( $pllst );
	}
}


/* ########## HDREZKA START ########## */
// ГЛОБАЛКИ
let watched; // инфа о просмотренном
let videoData;
let All;
let Auth;

// Start;
// Добавляем общий CSS к странице
waitElements('head [type="text/css"]', HDRezka.addCSS, true);
// Запрос списка просмотренного // счётчик по факту авторизации
waitElements('#top-head', HDRezka.getAuth, true);

// Парсинг текущего URL
var location =  window.location.pathname.split('/').filter(element => element !== '');
location = location[location.length - 1];

// Маршрутизация действий   ... выбивает ошибку на главной КТО ИМЕННО?
if (location === undefined) {
	log(`ГЛАВНАЯ`);
	waitElements('.b-seriesupdate__block_list_item', HDRezka.Home, true); // b-seriesupdate__block_list >

} else if ( !location.endsWith('html') && location!='collections' && location!='continue') {
	log(`директория /${location}/ с превьюхами но не /collections/ и не /continue/`)
	//waitElements('.b-content__inline_items', HDRezka.reDesignDirectory, true); // ДОЖДАТЬСЯ в том числе и рекламы? или проще сделать отдельный блок в общем!!  HDRezka.addCSS
	waitElements('.b-content__inline_items', HDRezka.reDesignDirectory, true);

} else if ( location.endsWith('html') && location!='support.html' && location!='abuse.html') {
	log(`это HTML, но не support.html и не abuse.html`)
	// ожидаем... появление контента по появлению социалки справа, но можно и без  div[id]'
	waitElements('.b-content__columns.pdt', HDRezka.reDesignHTMLandParse, true);
}

//! НЕ ЗАБЫТЬ О СУБТИТРАХ (в том числе на русском!).

$(document).on('click', '#m3u-button', function(e) {
	console.clear();
	if (videoData.type == 'film') {
		HDRezka.createLinkVideo();
	} else {
		HDRezka.createPlayList(); //
	}
});

// при смене переводчика удалить кнопки? вроде как уже реализовано в функции
$(document).on('click', '#translators-list', function(e) {
	//e.preventDefault();
	$('.pllst').remove();
	//HDRezka.createLinkVideo(); // дабы дважды не вставать
});
