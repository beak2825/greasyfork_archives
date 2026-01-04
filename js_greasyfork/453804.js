/* eslint-disable no-multi-spaces */
/* eslint-disable dot-notation */

// ==UserScript==
// @name               网易云音乐-MyFreeMP3扩展
// @name:zh-CN         网易云音乐-MyFreeMP3扩展
// @name:en            Netease Music - MyFreeMP3 Extender
// @namespace          163Music-MyFreeMP3-Extender
// @version            2.1
// @description        利用MyFreeMP3扩展网易云音乐功能
// @description:zh-CN  利用MyFreeMP3扩展网易云音乐功能
// @description:en     Extend netease music with MyFreeMP3
// @author             PY-DNG
// @license            GPL-v3
// @match              http*://music.163.com/*
// @connect            59.110.45.28
// @connect            liumingye.cn
// @connect            *
// @connect            music.163.net
// @connect            music.126.net
// @require            https://greasyfork.org/scripts/456034-basic-functions-for-userscripts/code/script.js?version=1226884
// @require            https://greasyfork.org/scripts/457199/code/script.js?version=1132840
// @require            https://greasyfork.org/scripts/457244/code/script.js?version=1132550
// @require            https://update.greasyfork.org/scripts/474021/1465958/MyFreeMP3%20API.js
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABYZJREFUWEfFl3lQ1VUUxz+/92SRfRPZRFxK0UA0U3LSsAz33cqSVDIn0zR1nDQap6Yxtz9s0dEoR53E3JXUMKXScdBKS0kkNEUFHoKyySrw4P2ae+E9RX7vgTYN56/f755z7/2ee8/5nnMVWikZBHo7oE5QYSgo4UAXwKVxegVwA9SLCpyoQUkMJbeoNUsrLRldJyhcRf0AmAzYtWTfqDcC+xWUVV0xXLQ1xyqAy/i42uGwFngbaBGolU1UIN5Izfs9KSzXstFc+CrBvXXUJwLdW+lxS2bXTOgnPEF2+sOGzQDcIDDShHIMVLeWVn00vVKmQx3ehdzfHpzXBECD56Yzj7O5XY9uOAyIwFR8l3vJp1BrRRg087fMhG7QgydhAdB45+cf59g9P1mC5/KFlt2MV2+Q98Ir1BnytA7pmpGafuaYsADIJHATMMfWseq9PXGbO0OalKz4AlQVx0H9CTgtwgVq0y5j1z0Epb0jxR+u4e7K9daW+6obue8IpQTQmGqptqLdZep4fDauROfpLhfNCuhHfd4dPOLm4/XpUqp//ZNbg8Zj3+tJXGZMofTzzVJvLTsUlAiRohJAJoE7ganWrD2WzcNrlaACqL9dQMmKLynbsFX+u82bic+GFdReuoIh7MVHictd3ch9TREMZw/isjRJxnXGy3TY9plcuPLAUQpiF2Mqa0hpu67BuC2cjfv8WPlfvnU31SnnqNz3g8XGBiJjLfgr1wmYpaJs1jLU+/vS6copdK4uVHyXyJ2Y+fLeFXs7vFbH4fZuLIpdu2ZT64tKKFqwXM6xJQrqW0omAQmgTNMy9F73Ee6LZlOXZSCn11DUqnvSrOPeeJynjJbf1SlnG4Jx8EDExopej86jgUIK58ZRtulbGxjUHUomgYKrw5pZ6fV0zjuPvoM3hXOWURafIE2cJ4+i476vUevqKIhZQMXuQziNHIpf0nbq8wvICX2eDlvW4TxxBNTXY+g/itrUZgRo3i5NABAXaq5qFhz2T/UgKO1n+Z/lEya9E+KfvJP2wwZzd+1GipeulGMi7UKK01EcHTBERGPMuEpASiIOz/ShKukX8kdPt3YKFQKAKBjNxGnMMPwOb6Mu5xbZwQMs+s6FaQg+yB04hpqzInMbJODkPhyfj6Rg1hLKt+ySIAVYTCayfPtYHHh4I6sAXKZNxDdhPcbL18gJjboP4HYqel8fbj03kerT5yzjHQ9uxnnCCIoWfSw5AL2eLqUZKM5O5EW/LulZS6xegdOIKPyOJmAqLeemR6hlrt/3W3AaF03lnsPcflWSmYyToL9PoPfxIn9kDFU/npTjnTLPyFQVdsJeQ+QVaAZhu0A/gg1/yDmGvsMtgeQQ2Y9AQb06nRyrSU3HaXgUImWNVzIxhA+zFKKQokvovDxkDIhY0BARhNbTMOivZOzDQyldv1XmtVlcp0/BJ36NDDqz1N3MIX/sTMmIQuwjehN04Zj8zg7qT11uvsb+6g6bROQ25w18Nq1CNdaR2zea2vR/LIsIj50nj0bv5SE9rzx0HPVe9f2Y2P8NzpNGykAVAat5/4KIbFGxYLnA1OOywBivZ5M3ZJIVT5oub64PYjR/XCxVh5O19m+gYqGxVYzsw3oSkHIQnZurJJqCNxdTdfSEtkfOTrIyur83S+rLt+2RtcOKNBQjoWypHIvA80/abinFNb9foHJ/ErVpGTJLxHU4DonEJWaS5AghlXuPyNqh3RmhNinHjadgsyFpF+Qv+wGnsS9Z80iOC0DFcasbaoCqyXHCrGlDIkZa25I5PB2OICnHqGexC+mE4mBPfUmpTMmqIz9RkXAAU0WlLZDaLZmY8V+aUpvHYlEq1ptSs02btuVmEG36MDGDaNOn2YP32WaP04eD6v96nv8LNmVLjadPDdEAAAAASUVORK5CYII=
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @run-at             document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453804/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90-MyFreeMP3%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453804/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90-MyFreeMP3%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global md5 pop */
/* global Mfapi */

(function __MAIN__() {
    'use strict';
	const CONST = {
		Text: {
			V5NOCANQU: '要听龙叔的话，V5不能屈，听完歌快去给你网易爸爸充VIP吧',
			SongNotFound: '没有找到歌曲资源',
			ErrorOccured: `<span style="color: orange;">pageFunc Error</span>`,
			DownloadSetting: {
				Lrc: {
					Text: ['[x]同时下载歌词', '[√]同时下载歌词'],
					Tip: ['已关闭：下载歌曲时自动下载歌词', '已开启：下载歌曲时自动下载歌词']
				},
				Cover: {
					Text: ['[x]同时下载封面', '[√]同时下载封面'],
					Tip: ['已关闭：下载歌曲时自动下载封面', '已开启：下载歌曲时自动下载封面']
				}
			}
		},
		Number: {
			Interval_Fastest: 1,
			Interval_Fast: 50,
			Interval_Balanced: 500,
			MaxSearchPage: 3,
		},
		TYPE_INFO: {
			2000: 'flac',
			320: 'mp3',
			128: 'mp3'
		}
	}

	// Prepare
	const WEAPI = new Weapi();
	const PV = new Privileger();

	// function DoLog() [}
	// Arguments: level=LogLevel.Info, logContent, trace=false
	const [LogLevel, DoLog] = (function() {
		const LogLevel = {
			None: 0,
			Error: 1,
			Success: 2,
			Warning: 3,
			Info: 4,
		};

		return [LogLevel, DoLog];
		function DoLog() {
			// Get window
			const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

			const LogLevelMap = {};
			LogLevelMap[LogLevel.None] = {
				prefix: '',
				color: 'color:#ffffff'
			}
			LogLevelMap[LogLevel.Error] = {
				prefix: '[Error]',
				color: 'color:#ff0000'
			}
			LogLevelMap[LogLevel.Success] = {
				prefix: '[Success]',
				color: 'color:#00aa00'
			}
			LogLevelMap[LogLevel.Warning] = {
				prefix: '[Warning]',
				color: 'color:#ffa500'
			}
			LogLevelMap[LogLevel.Info] = {
				prefix: '[Info]',
				color: 'color:#888888'
			}
			LogLevelMap[LogLevel.Elements] = {
				prefix: '[Elements]',
				color: 'color:#000000'
			}

			// Current log level
			DoLog.logLevel = (win.isPY_DNG && win.userscriptDebugging) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

			// Log counter
			DoLog.logCount === undefined && (DoLog.logCount = 0);

			// Get args
			let [level, logContent, trace] = parseArgs([...arguments], [
				[2],
				[1,2],
				[1,2,3]
			], [LogLevel.Info, 'DoLog initialized.', false]);

			// Log when log level permits
			if (level <= DoLog.logLevel) {
				let msg = '%c' + LogLevelMap[level].prefix + (typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + (LogLevelMap[level].prefix ? ' ' : '');
				let subst = LogLevelMap[level].color;

				switch (typeof(logContent)) {
					case 'string':
						msg += '%s';
						break;
					case 'number':
						msg += '%d';
						break;
					default:
						msg += '%o';
						break;
				}

				if (++DoLog.logCount > 512) {
					console.clear();
					DoLog.logCount = 0;
				}
				console[trace ? 'trace' : 'log'](msg, subst, logContent);
			}
		}
	}) ();

	main();
	function main() {
		// Wait for document.body
		if (!document.body) {
			setTimeout(main, CONST.Number.Interval_Fast);
			return false;
		}

		// Commons
		hookPlay();
		playlistDownload();

		// Page functions
		const ITM = unsafeWindow.ITM = new IntervalTaskManager();
		const pageChangeDetecter = (function(callback, emitOnInit=false) {
			let href = location.href;
			emitOnInit && callback(null, href);
			return function detecter() {
				const new_href = location.href;
				if (href !== new_href) {
					ITM.removeTask(ITM.tasks.indexOf(pageChangeDetecter));
					callback(href, new_href);
					href = new_href;
					ITM.addTask(inject_iframe);
				}
			}
		}) (deliverPageFuncs, true);
		ITM.time = CONST.Number.Interval_Fast;
		ITM.addTask(inject_iframe);
		ITM.start();

		function inject_iframe() {
			const ifr = $('#g_iframe') || {};
			const oWin = ifr.contentWindow;
			const oDoc = ifr.contentDocument;
			if (oWin && oDoc && oWin.location && oWin.location.host === 'music.163.com') {
				const AEL = getPureAEL();
				AEL.call(oWin, 'unload', function() {
					ITM.addTask(pageChangeDetecter);
				});
				ITM.removeTask(ITM.tasks.indexOf(inject_iframe));
			}
		}

		function deliverPageFuncs(href, new_href) {
			const pageFuncs = [{
				reg: /^https?:\/\/music\.163\.com\/#\/song\?.+$/,
				func: pageSong,
				checker: function() {
					const ifr = $('#g_iframe'); if (!ifr) {return false;}
					const oDoc = ifr.contentDocument; if (!oDoc) {return false;}
					const elm = !!$(oDoc, '.cnt>.m-info');
					return elm;
				}
			},{
				reg: /^https?:\/\/music\.163\.com\/#\/(artist|album|discover\/toplist)\?.+$/,
				func: replacePredata,
				sync: false
			},{
				reg: /^https?:\/\/music\.163\.com\/#\/(my\/m\/music\/)?playlist\?.+$/,
				func: replacePredata_encoded,
				sync: false
			},{
				reg: /^https?:\/\/music\.163\.com\//,
				func: listDownload,
				checker: function() {
					const ifr = $('#g_iframe'); if (!ifr) {return false;}
					const oDoc = ifr.contentDocument; if (!oDoc) {return false;}
					return !!oDoc.body;
				}
			},{
				reg: /^https?:\/\/music\.163\.com\/#\/album\?.+$/,
				func: pageAlbum,
				checker: function() {
					const ifr = $('#g_iframe'); if (!ifr) {return false;}
					const oDoc = ifr.contentDocument; if (!oDoc) {return false;}
					const elm = !!$(oDoc, '#content-operation');
					return elm;
				}
			},{
				reg: /^https?:\/\/music\.163\.com\//,
				func: settings
			}];
			for (const pageFunc of pageFuncs) {
				wrap(pageFunc);
			}
			for (const pageFunc of pageFuncs) {
				test_exec(pageFunc);
			}

			function wrap(pageFunc) {
				pageFunc.name = pageFunc.name || pageFunc.func.name;
				pageFunc.func = (function(func) {
					return function wrapper() {
						try {
							return func();
						} catch(err) {
							DoLog(LogLevel.Error, `Error executing pageFunc ${pageFunc.name}`);
							DoLog(LogLevel.Error, err, true);
							showErr(CONST.Text.ErrorOccured, true);
						}
					}
				}) (pageFunc.func);
			}

			function test_exec(pageFunc) {
				pageFunc.reg.test(location.href) && ((((pageFunc.sync || !pageFunc.hasOwnProperty('sync')) ? iframeDocSync() : true) && (pageFunc.checker ? ({
					'string': () => ($(pageFunc.checker)),
					'function': pageFunc.checker,
				})[typeof pageFunc.checker]() : true)) ? true : (setTimeout(test_exec.bind(null, pageFunc), CONST.Number.Interval_Balanced), DoLog(`waiting: ${location.href}, ${pageFunc.name}`), false)) && (DoLog('Exec ' + pageFunc.name), pageFunc.func(href, new_href));
			}
		}
	}

	function hookPlay() {
		// Access Checker: core_fbc43dc690327907cf6fdad6d52f7c31.js?:formatted:8988('l6f.tt2x = function(bi7b, action) {')
		// Play
		const APIH = new APIHooker();

		APIH.hook(/\/weapi\/v3\/song\/detail(\?[a-zA-Z0-9=_]+)?$/, function(xhr) {
			const json = JSON.parse(xhr.response);
			json.privileges.forEach(privilege => PV.fix(privilege));
			rewriteResponse(xhr, json);
			return true;
		});
		APIH.hook(/\/weapi\/v1\/play\/record(\?[a-zA-Z0-9=_]+)?$/, function(xhr) {
			const json = JSON.parse(xhr.response);
			(json.allData || []).concat(json.weekData || []).forEach(data => PV.fix(data.song.privilege));
			rewriteResponse(xhr, json);
			return true;
		});
		APIH.hook(/\/weapi\/v6\/playlist\/detail(\/?\?[a-zA-Z0-9=_]+)?$/, function(xhr) {
			const json = JSON.parse(xhr.response);
			json.privileges.forEach(privilege => PV.fix(privilege));
			rewriteResponse(xhr, json);
			return true;
		});
		APIH.hook(/\/weapi\/song\/enhance\/player\/url\/v1(\?[a-zA-Z0-9=_]+)?$/, function(xhr, _this, args, onreadystatechange) {
			const ifr = $('#g_iframe');
			const oDoc = ifr.contentDocument;

			// Get data
			const json = JSON.parse(xhr.response);
			const data = json['data'][0];

			// Only hook unplayable songs
			if (data['url']) {return true};

			search(data.id, function(song) {
				song ? reqSong(song) : showTip(CONST.Text.SongNotFound);

				function reqSong(song) {
					const qualities = Object.keys(CONST.TYPE_INFO).map(n => parseInt(n, 10)).sort((q1, q2) => q2 - q1);
					const q = qualities.find(q => song.quality.includes(q));
					const abort = GM_xmlhttpRequest({
						method: 'GET',
						url: song.url[q],
						onprogress: load,
						onload: load
					}).abort;

					function load(e) {
						// Abort request first
						abort();

						// Check if finalUrl differ from original url
						if (song.url === e.finalUrl) {
							DoLog(LogLevel.Warning, 'Searched song returned a useless url');
							showTip(CONST.Text.SongNotFound);
						}

						// modify xhr and continue stack
						data['code'] = 200;
						data['br'] = PV.levelData[data.id].plRate;
						data['level'] = PV.levelData[data.id].plLevel;
						data['type'] = 'mp3';
						data['url'] = e.finalUrl;
						rewriteResponse(xhr, json);
						continueStack();
					}
				}
			});

			// Suspend stack until search & find the song
			return false;

			function continueStack() {
				onreadystatechange.apply(_this, args);;
			}
		});

		function rewriteResponse(xhr, json) {
			const response = JSON.stringify(json);
			const propDesc = {
				value: response,
				writable: false,
				configurable: true,
				enumerable: true
			};
			Object.defineProperties(xhr, {
				'response': propDesc,
				'responseText': propDesc
			});
		}
	}

	function listDownload() {
		const iframe = $('#g_iframe');
		const oDoc = iframe.contentDocument;
		const body = oDoc.body;
		if (!body) {
			DoLog(LogLevel.Warning, 'listDownload: list not found');
			return false;
		}

		const AEL = getPureAEL();
		AEL.call(body, 'click', function(e) {
			const elm = e.target;
			if (elm.getAttribute('data-res-action') === 'download') {
				e.stopPropagation();
				downloadSong(elm.getAttribute('data-res-id') * 1);
			}
		}, {capture: true});

		function $T(elm, selector) {
			const e = $(elm, selector);
			return e ? e.innerText : null;
		}
	}

	function playlistDownload() {
		const AEL = getPureAEL();
		AEL.call(document.body, 'click', function(e) {
			const elm = e.target;
			if (elm.getAttribute('data-action') === 'download') {
				e.stopPropagation();
				downloadSong(elm.getAttribute('data-id') * 1);
			}
		}, {capture: true});
	}

	function pageSong() {
		const ifr = $('#g_iframe');
		const oDoc = ifr.contentDocument;
		const name = $(oDoc, '.tit>em').innerText;
		const artist = $(oDoc, '.cnt>.des>span>a').innerText;
		const cover = $(oDoc, '.u-cover>img.j-img').src;
		const AEL = getPureAEL();

		// GUI
		if ($(oDoc, '.vip-song')) {
			// vip song
			const content_operation = $(oDoc, '#content-operation');
			const vip_group = $(content_operation, '.u-vip-btn-group');
			const vip_play = $(vip_group || content_operation, 'a[data-res-action="play"]');
			const vip_add = $(vip_group || content_operation, 'a[data-res-action="addto"]');
			const vip_download = $(content_operation, '.u-btn-vip-download');

			// Style
			vip_play.classList.remove('u-btni-vipply');
			vip_play.classList.remove('u-btni-openvipply');
			vip_play.classList.add('u-btni-addply');
			vip_add && vip_add.classList.remove('u-btni-vipadd');
			vip_add && vip_add.classList.add('u-btni-add');
			vip_download.classList.remove('u-btn-vip-download');
			if (vip_group) {
				vip_add && content_operation.insertAdjacentElement('afterbegin', vip_add);
				content_operation.insertAdjacentElement('afterbegin', vip_play);
				content_operation.removeChild(vip_group);
			}

			// Text
			vip_play.title = CONST.Text.V5NOCANQU;
			vip_play.children[0].childNodes[1].nodeValue = '播放';
		}
		if ($(oDoc, '.u-btni-play-dis')) {
			// Copyright song
			// Data
			const cpr_play = $(oDoc, '.u-btni-play-dis');
			const cpr_fav = cpr_play.nextElementSibling;
			cpr_play.setAttribute('data-res-id', cpr_fav.getAttribute('data-res-id'));
			cpr_play.setAttribute('data-res-type', cpr_fav.getAttribute('data-res-type'));
			cpr_play.setAttribute('data-res-action', 'play');

			// Style
			cpr_play.classList.remove('u-btni-play-dis');
		}

		// Download
		const dlButton = $(oDoc, '#content-operation>a[data-res-action="download"]');
		AEL.call(dlButton, 'click', dlOnclick, {useCapture: true});

		function dlOnclick(e) {
			e.stopPropagation();
			downloadSong(dlButton.getAttribute('data-res-id') * 1);
		}
	}

	function pageAlbum() {
		const iframe = $('#g_iframe');
		const oDoc = iframe.contentDocument;
		const oWin = iframe.contentWindow;

		// GUI
		if ($(oDoc, '.vip-album')) {
			const content_operation = $(oDoc, '#content-operation');
			const vip_group = $(content_operation, '.u-vip-btn-group');
			const vip_play = $(vip_group || content_operation, 'a[data-res-action="play"]');
			const vip_add = $(vip_group || content_operation, 'a[data-res-action="addto"]');

			// Style
			vip_play.classList.remove('u-btni-vipply');
			vip_play.classList.remove('u-btni-openvipply');
			vip_play.classList.add('u-btni-addply');
			vip_add && vip_add.classList.remove('u-btni-vipadd');
			vip_add && vip_add.classList.add('u-btni-add');
			if (vip_group) {
				vip_add && content_operation.insertAdjacentElement('afterbegin', vip_add);
				content_operation.insertAdjacentElement('afterbegin', vip_play);
				content_operation.removeChild(vip_group);
			}

			// Text
			vip_play.title = CONST.Text.V5NOCANQU;
			vip_play.children[0].childNodes[1].nodeValue = '播放';
		}
	}

	function settings() {
		const DS = CONST.Text.DownloadSetting
		makeBooleanMenu(DS.Lrc.Text, DS.Lrc.Tip, 'lrc');
		makeBooleanMenu(DS.Cover.Text, DS.Cover.Tip, 'cover');

		function makeBooleanMenu(texts, tips, key) {
			const initialText = texts[GM_getValue(key, false) + 0];
			let id = GM_registerMenuCommand(initialText, onClick/*, {
				autoClose: false
			}*/);

			function onClick() {
				const newValue = !GM_getValue(key, false);
				const newText = texts[newValue + 0];
				GM_setValue(key, newValue);
				GM_unregisterMenuCommand(id);
				id = GM_registerMenuCommand(newText, onClick/*, {
					autoClose: false
				}*/);
				pop.info(tips[newValue + 0]);
			}
		}
	}

	function replacePredata() {
		const iframe = $('#g_iframe');
		const oDoc = iframe.contentDocument;
		const oWin = iframe.contentWindow;
		const envReady = oDoc && iframeDocSync();
		const elmData = oDoc && $(oDoc, '#song-list-pre-data');
		if (!elmData) {
			// No elmData found.
			if (envReady && $(oDoc, '#song-list-pre-cache table')) {
				// Too late. Data has already been dealed.
				DoLog(LogLevel.Error, 'Predata hook failed.');
				DoLog([$(oDoc, '#song-list-pre-cache table'), oDoc.URL, oWin.location.href]);
			} else {
				// Data has not been loaded!
				DoLog('No predata found');
				if (envReady) {
					// Hook Element.prototype.getElementsByTagName to make changeValue called.
					DoLog('Environment ready, hooking getElementsByTagName...');
					const hooker = new Hooker();
					const id = hooker.hook(oWin, 'Element.prototype.getElementsByTagName', false, false, {
						dealer: function(_this, args) {
							if (_this.id === 'song-list-pre-cache' && args[0] === 'textarea') {
								const elmData = $(_this, 'textarea');
								changeValue(elmData);
								hooker.unhook(id);
								DoLog('Value changed, getElementsByTagName unhooked...');
							}
							return [_this, args];
						}
					}).id;
					DoLog(LogLevel.Success, 'getElementsByTagName Hooked...');
				} else {
					// Environment not ready yet, wait for it
					DoLog('Environment not ready, waiting...');
					setTimeout(replacePredata, CONST.Number.Interval_Fastest);
				}
			}
			return false;
		} else {
			// elmData Found! Go change value directly.
			DoLog('Changing value directly');
			changeValue(elmData);
		}

		function changeValue(elmData) {
			const list = JSON.parse(elmData.value);
			list.forEach(song => PV.fix(song.privilege));
			elmData.value = JSON.stringify(list);

			DoLog(LogLevel.Success, 'Predata replaced');
		}
	}

	function replacePredata_encoded() {
		const iframe = $('#g_iframe');
		const oDoc = iframe.contentDocument;
		const oWin = iframe.contentWindow;
		const envReady = oDoc && iframeDocSync();
		const elmData = oDoc && $(oDoc, '#song-list-pre-data');
		if (!elmData) {
			// No elmData found.
			if (envReady && $(oDoc, '#song-list-pre-cache table')) {
				// Too late. Data has already been dealed.
				DoLog(LogLevel.Error, 'Predata hook failed.');
				DoLog([$(oDoc, '#song-list-pre-cache table'), oDoc.URL, oWin.location.href]);
			} else {
				// Data has not been loaded!
				DoLog('No predata found');
				if (envReady) {
					// Hook Element.prototype.getElementsByTagName to make changeValue called.
					DoLog('Environment ready, hooking getElementsByTagName...');
					const hooker = new Hooker();
					const id = hooker.hook(oWin, 'Element.prototype.getElementsByTagName', false, false, {
						dealer: function(_this, args) {
							if (_this.id === 'song-list-pre-cache' && args[0] === 'textarea') {
								const elmData = $(_this, 'textarea');
								changeValue(elmData);
								hooker.unhook(id);
								DoLog('Value changed, getElementsByTagName unhooked...');
							}
							return [_this, args];
						}
					}).id;
					DoLog(LogLevel.Success, 'getElementsByTagName Hooked...');
				} else {
					// Environment not ready yet, wait for it
					DoLog('Environment not ready, waiting...');
					setTimeout(replacePredata_encoded, CONST.Number.Interval_Fastest);
				}
			}
			return false;
		} else {
			// elmData Found! Go change value directly.
			DoLog('Changing value directly');
			changeValue(elmData);
		}

		function changeValue(elmData) {
			// Decrypt text
			const decode = Object.values(unsafeWindow.NEJ.P('nej.u')).find(f => f.toString().match(/function\([a-z0-9]+,[a-z0-9]+\)\{return [a-z0-9]+\.[a-z0-9]+\([a-z0-9]+\.[a-z0-9]+\([a-z0-9]+\),[a-z0-9]+\)\}/i));
			const decrypt = (str, key) => decode(str, key);
			const request = Object.values(unsafeWindow.NEJ.P('nej.j')).find(f => f.toString().includes('.replace("api","weapi")'));
			let encrypStr, position;
			request("/m/api/encryption/param/get", {
				sync: true,
				type: "json",
				query: {},
				method: "get",
				onload: function(data) {
					encrypStr = data.encrypStr;
					position = parseInt(data.position, 10);
				}
			});
			const str = elmData.value.slice(0, position) + elmData.value.slice(position + encrypStr.length);
			const key = 'undefined' + $(oDoc, '#m-playlist .j-img').dataset.key + $(oDoc, '#song-list-pre-cache a').getAttribute('href').slice(9,12);
			const text = decodeURIComponent(decrypt(str, key));

			// Parse & modify json data
			const data = JSON.parse(text);
			data.forEach(song => PV.fix(song.pv))

			// Hook JSON.parse
			const hooker = new Hooker();
			const id = hooker.hook(oWin, 'JSON.parse', false, false, {
				dealer: function(_this, args) {
					if (args[0] === text) {
						hooker.map[id].config.hook_return.value = data;
						hooker.unhook(id);
						DoLog('Value changed, JSON.parse unhooked...');
						DoLog(data);
					}
					return [_this, args];
				}
			}).id;
			DoLog(LogLevel.Success, 'JSON.parse Hooked...');

			/*Object.defineProperty(elmData, 'value', {
				get: e => {debugger;}
			});*/
		}
	}

	function Privileger() {
		const P = this;
		const levelData = {};
		P.levelData = MakeReadonlyObj(levelData);
		P.fix = fix;

		function fix(privilege) {
			const RATES = {
				'none': 0,
				'standard': 128000,
				'exhigh': 320000,
				'lossless': 999000,
			};

			const dlLevel = privilege.downloadMaxBrLevel;
			const dlRate = RATES[dlLevel];
			const plLevel = privilege.playMaxBrLevel;
			const plRate = RATES[plLevel];
			privilege.dlLevel = dlLevel; // Download
			privilege.dl = dlRate;       // Download
			privilege.plLevel = plLevel; // Play
			privilege.pl = plRate;       // Play
			privilege.st = 0;            // Copyright
			levelData[privilege.id] = {dlLevel, dlRate, plLevel, plRate};
		}
	}

	function downloadSong(id) {
		const qualities = Object.keys(CONST.TYPE_INFO).map(n => parseInt(n, 10)).sort((q1, q2) => q2 - q1);
		search(id, function(song) {
			if (song) {
				const q = qualities.find(q => song.quality.includes(q));
				const fname = `${song.name} - ${song.artist.join(',')}`;
				const ext = CONST.TYPE_INFO[q];
				const coverPath = new URL(song.cover).pathname;
				const coverExt = coverPath.match(/\.[a-zA-Z]+?$/) ? coverPath.match(/\.[a-zA-Z]+?$/)[0] : '.jpg';
				song.url[q] && dl(song.url[q], `${fname}.${ext}`, false);
				song.lrc && GM_getValue('lrc', false) && dl(song.lrc, `${fname}.lrc`, false);
				song.cover && GM_getValue('cover', false) && dl(song.cover, fname + coverExt, false);
			} else {
				showTip(CONST.Text.SongNotFound);
				DoLog(LogLevel.Warning, 'No search result matched.');
			}
		});
	}

	function search(id, callback) {
		// Get NeateaseMusic music info
		WEAPI.song_detail(id, function(data) {
			// Get info
			const song = data.songs[0];
			const name = song.name || '';
			const artist = song.ar.map((ar) => (ar.name)).join(',') || '';
			const cover = song.al.picUrl || '';

			// Gather info
			const fname = replaceText('{$NAME} - {$ARTIST}', {'{$NAME}': name, '{$ARTIST}': artist});
			const cpath = getUrlPath(cover);

			// Search MyFreeMP3
			search_song();

			function search_song(page=1, api='new') {
				const fullList = [];
				doSearch(page, api);

				function doSearch(page, api) {
					Mfapi.search({
						text: fname,
						page: page,
						type: {
							old: 'YQB',
							new: 'YQD'
						},
						callback: onsearch,
						api
					});
				}

				function onsearch(json) {
					fullList.push.apply(fullList, json.list);
					const song = get_song(json.list, json.noMore || page >= 3);
					song ? callback(song) : doSearch(page+1, json.api);

					function get_song(list, force=false) {
						const exact = list.find(song => getUrlPath(song.cover) === cpath);
						const bestMatch = fullList.reduce((best, song) => {
							const nameMed = calcMed(song.name, name);
							const artistMed = calcMed(song.artist.join(','), artist);
							const med = nameMed + artistMed;
							if (med < best.med) {
								best.med = med;
								best.songs = [song];
							} else if (med === best.med) {
								best.songs.push(song);
							}
							return best;
						}, { med: Infinity, songs: [] });
						if (exact) {
							DoLog(['exact matched', exact]);
							return exact;
						} else if (bestMatch.med === 0) {
							DoLog(['name and artist matched', bestMatch.songs]);
							return getBestQualitySong(bestMatch);
						} else if (force) {
							DoLog(['matched', bestMatch]);
							return getBestQualitySong(bestMatch);
						} else {
							DoLog('not found');
							return null;
						}

						function getBestQualitySong(bestMatch) {
							return bestMatch.songs.reduce((best, cur) => Math.max(...best.quality) > Math.max(...cur.quality) ? best : cur);
						}
					}
				}
			}
		});
	}

	function Weapi() {
		const W = this;
		W.song_detail = song_detail;
		W.encrypt = encrypt;

		function song_detail(id, callback, onerror) {
			const data = {c: JSON.stringify([{id: id}]), csrfToken: ''};
			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://music.163.com/weapi/v3/song/detail?csrf_token=');
			xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			xhr.onerror = onerror;
			xhr.onload = function(e) {
				try {
					callback(JSON.parse(xhr.responseText));
				} catch(err) {
					if (onerror) {
						onerror(err);
					} else {
						throw err;
					}
				}
			};
			xhr.send(encrypt(data));
		};

		function encrypt(data) {
			const json = JSON.stringify(data);
			const encryted = unsafeWindow.asrsea(json, "010001", "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7", "0CoJUm6Qyw8W8jud");
			const xhr_text = 'params=' + encodeURIComponent(encryted.encText) + '&encSecKey=' + encodeURIComponent(encryted.encSecKey);
			return xhr_text;
		}
	}

	function dl(url, name) {
		const pop_id = pop.download(name, 'download');
		$('#pop-container').style.bottom = ($('.m-playbar').style.top.match(/\d+/)[0]*1 + 10).toString() + 'px';
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			responseType: 'blob',
			onprogress: function(e) {
				e.lengthComputable /*&& c*/ && (pop.size(pop_id, bytesToSize(e.loaded) + " / " + bytesToSize(e.total)),
												pop.percent(pop_id, 100 * (e.loaded / e.total) >> 0))
			},
			onload: function(res) {
				const ourl = URL.createObjectURL(res.response);
				const a = document.createElement('a');
				a.download = name;
				a.href = ourl;
				a.click();
				setTimeout(function() {
					URL.revokeObjectURL(ourl);
				}, 0);
				pop.finished(pop_id);
				setTimeout(pop.close.bind(pop, pop_id), 2000);
			}
		});

		function bytesToSize(a) {
			if (0 === a) {return "0 B";}
			var b = 1024
			, c = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
			, d = Math.floor(Math.log(a) / Math.log(b));
			return (a / Math.pow(b, d)).toFixed(2) + " " + c[d];
		}
	}

	function showErr(text, html) {
		unsafeWindow.isPY_DNG && showTip(text, html);
	}

	function showTip(text, html=false) {
		const elm = $('span.tip');
		elm[html ? 'innerHTML' : 'innerText'] = text;
		elm.style.display = '';
		setTimeout(e => (elm.style.display = 'none'), 3000);
	}

	function dl_browser(url, name) {
		const a = $CrE('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	function dl_GM(url, name, path=true) {
		name = path ? name : replaceOSSep(name);
		GM_download({
			url: url,
			name: name
		});
	}

	function replaceOSSep(text) {
		const sep = getOSSep();
		const rpl = ({'\\': '＼', '/': '／'})[sep];
		return text.replaceAll(sep, rpl);
	}

	function getOSSep() {
		return ({
			'Windows': '\\',
			'Mac': '/',
			'Linux': '/',
			'Null': '-'
		})[getOS()];
	}

	function getOS() {
		const info = (navigator.platform || navigator.userAgent).toLowerCase();
		const test = (s) => (info.includes(s));
		const map = {
			'Windows': ['window', 'win32', 'win64', 'win86'],
			'Mac': ['mac', 'os x'],
			'Linux': ['linux']
		}
		for (const [sys, strs] of Object.entries(map)) {
			if (strs.some(test)) {
				return sys;
			}
		}
		return 'Null';
	}

	function MakeReadonlyObj(val) {
		return isObject(val) ? new Proxy(val, {
			get: function(target, property, receiver) {
				return MakeReadonlyObj(target[property]);
			},
			set: function(target, property, value, receiver) {
				return true;
			},
			has: function(target, prop) {}
		}) : val;

		function isObject(value) {
			return ['object', 'function'].includes(typeof value) && value !== null;
		}
	}

	// Get the pathname of a given url
	function getUrlPath(url) {
		return typeof url === 'string' ? new URL(url).pathname : null;
	}

	function iframeDocSync() {
		const iframe = $('#g_iframe');
		const oDoc = iframe && iframe.contentDocument;
		if (oDoc) {
			const top_path = document.URL.replace(/^https?:\/\/music\.163\.com\/(#\/)?/, '').replace(/^my\/m\//, '').replace('/m/', '/').replace('/#/', '/');
			const ifr_path = oDoc.URL.replace(/^https?:\/\/music\.163\.com\/?/, '').replace(/^my\/#\//, '').replace('/m/', '/').replace('/#/', '/').replace(/^discover$/, '');
			return top_path === ifr_path;
		} else {
			return false;
		}
	}

	// Get unpolluted addEventListener
	function getPureAEL(parentDocument=document) {
		const ifr = makeIfr(parentDocument);

		const oWin = ifr.contentWindow;
		const oDoc = ifr.contentDocument;

		const AEL = oWin.XMLHttpRequest.prototype.addEventListener;
		return AEL;
	}

	// Get unpolluted removeEventListener
	function getPureREL(parentDocument=document) {
		const ifr = makeIfr(parentDocument);

		const oWin = ifr.contentWindow;
		const oDoc = ifr.contentDocument;

		const REL = oWin.XMLHttpRequest.prototype.removeEventListener;
		return REL;
	}

	function makeIfr(parentDocument=document) {
		const ifr = $CrE(parentDocument, 'iframe');
		ifr.srcdoc = '<html></html>';
		ifr.style.width = ifr.style.height = ifr.style.border = ifr.style.padding = ifr.style.margin = '0';
		parentDocument.body.appendChild(ifr);
		return ifr;
	}

	function APIHooker() {
		const AH = this;
		const hooker = new Hooker();
		const hooker_hooks = [];
		const hooks = [];
		const addEventListener = (function() {
			const AEL = getPureAEL();
			return function() {
				const args = Array.from(arguments);
				const _this = args.shift();
				AEL.apply(_this, args);
			}
		}) ();
		const removeEventListener = (function() {
			const REL = getPureREL();
			return function() {
				const args = Array.from(arguments);
				const _this = args.shift();
				REL.apply(_this, args);
			}
		}) ();

		AH.hook = hook;
		AH.unhook = unhook;
		AH.pageOnchange = recover;

		inject();
		setInterval(inject, CONST.Number.Interval_Balanced);

		function hook(urlMatcher, xhrDealer) {
			return hooks.push({
				id: hooks.length,
				matcher: urlMatcher,
				dealer: xhrDealer,
				xhrs: []
			}) - 1;
		}

		function unhook(id) {
			hooks.splice(id, 1);
		}

		function inject() {
			const iframe = $('#g_iframe');
			const oWin = iframe ? iframe.contentWindow : null;

			const hook_dealers = {
				open: function(_this, args) {
					const xhr = _this;
					for (const hook of hooks) {
						matchUrl(args[1], hook.matcher) && hook.xhrs.push(xhr);
					}
					return [_this, args];
				},
				send: function(_this, args) {
					const xhr = _this;
					for (const hook of hooks) {
						if (hook.xhrs.includes(xhr)) {
							// After first readystatechange event, change onreadystatechange to our onProgress function
							let onreadystatechange;
							addEventListener(xhr, 'readystatechange', function(e) {
								onreadystatechange = xhr.onreadystatechange;
								xhr.onreadystatechange = onProgress;
							}, {
								capture: false,
								passive: true,
								once: true
							});

							// Recieves last 3 readystatechange event, apply dealer function, and continue onreadystatechange stack
							function onProgress(e) {
								let args = Array.from(arguments);

								// When onload, apply xhr dealer
								let continueStack = true;
								if (xhr.status === 200 && xhr.readyState === 4) {
									continueStack = hook.dealer(xhr, this, args, onreadystatechange);
								}

								continueStack && typeof onreadystatechange === 'function' && onreadystatechange.apply(this, args);
							}
						}
					}
					return [_this, args];
				},
			}
			let do_inject = false;

			// Hook open: filter all xhr that should be hooked
			try {
				if (window.XMLHttpRequest.prototype.open.name !== 'hooker') {
					hooker_hooks.push(hooker.hook(window, 'XMLHttpRequest.prototype.open', false, false, {
						dealer: hook_dealers.open
					}));
					do_inject = true;
				}
				if (oWin && oWin.XMLHttpRequest.prototype.open.name !== 'hooker') {
					hooker_hooks.push(hooker.hook(oWin, 'XMLHttpRequest.prototype.open', false, false, {
						dealer: hook_dealers.open
					}));
					do_inject = true;
				}

				// Hook send: change eventListeners for each hooked xhr, and apply xhr dealer
				if (window.XMLHttpRequest.prototype.send.name !== 'hooker') {
					hooker_hooks.push(hooker.hook(window, 'XMLHttpRequest.prototype.send', false, false, {
						dealer: hook_dealers.send
					}));
					do_inject = true;
				}
				if (oWin && oWin.XMLHttpRequest.prototype.send.name !== 'hooker') {
					hooker_hooks.push(hooker.hook(oWin, 'XMLHttpRequest.prototype.send', false, false, {
						dealer: hook_dealers.send
					}));
					do_inject = true;
				}
			} catch(err) {}

			do_inject && DoLog(LogLevel.Success, 'Hooker injected');
		}

		function recover() {
			hooker_hooks.forEach((hook) => (hooker.unhook(hook.id)));

			DoLog(LogLevel.Success, 'Hooker removed');
		}

		function matchUrl(url, matcher) {
			if (matcher instanceof RegExp) {
				return !!url.match(matcher);
			}
			if (typeof matcher === 'function') {
				return matcher(url);
			}
		}

		function idmaker() {
			let i = 0;
			return function() {
				return i++;
			}
		}
	}

	function Hooker() {
		const H = this;
		const makeid = idmaker();
		const map = H.map = {};
		H.hook = hook;
		H.unhook = unhook;

		function hook(base, path, log=false, apply_debugger=false, hook_return=false) {
			// target
			path = arrPath(path);
			let parent = base;
			for (let i = 0; i < path.length - 1; i++) {
				const prop = path[i];
				parent = parent[prop];
			}
			const prop = path[path.length-1];
			const target = parent[prop];

			// Only hook functions
			if (typeof target !== 'function') {
				throw new TypeError('hooker.hook: Hook functions only');
			}
			// Check args valid
			if (hook_return) {
				if (typeof hook_return !== 'object' || hook_return === null) {
					throw new TypeError('hooker.hook: Argument hook_return should be false or an object');
				}
				if (!hook_return.hasOwnProperty('value') && typeof hook_return.dealer !== 'function') {
					throw new TypeError('hooker.hook: Argument hook_return should contain one of following properties: value, dealer');
				}
				if (hook_return.hasOwnProperty('value') && typeof hook_return.dealer === 'function') {
					throw new TypeError('hooker.hook: Argument hook_return should not contain both of  following properties: value, dealer');
				}
			}

			// hooker function
			const hooker = function hooker() {
				let _this = this === H ? null : this;
				let args = Array.from(arguments);
				const config = map[id].config;
				const hook_return = config.hook_return;

				// hook functions
				config.log && console.log([base, path.join('.')], _this, args);
				if (config.apply_debugger) {debugger;}
				if (hook_return && typeof hook_return.dealer === 'function') {
					[_this, args] = hook_return.dealer(_this, args);
				}

				// continue stack
				return hook_return && hook_return.hasOwnProperty('value') ? hook_return.value : target.apply(_this, args);
			}
			parent[prop] = hooker;

			// Id
			const id = makeid();
			map[id] = {
				id: id,
				prop: prop,
				parent: parent,
				target: target,
				hooker: hooker,
				config: {
					log: log,
					apply_debugger: apply_debugger,
					hook_return: hook_return
				}
			};

			return map[id];
		}

		function unhook(id) {
			// unhook
			try {
				const hookObj = map[id];
				hookObj.parent[hookObj.prop] = hookObj.target;
				delete map[id];
			} catch(err) {
				console.error(err);
				DoLog(LogLevel.Error, 'unhook error');
			}
		}

		function arrPath(path) {
			return Array.isArray(path) ? path : path.split('.')
		}

		function idmaker() {
			let i = 0;
			return function() {
				return i++;
			}
		}
	}

	function IntervalTaskManager() {
		const tasks = this.tasks = [];
		this.time = 500;
		this.interval = -1;
		defineProperty(this, 'working', {
			get: () => (this.interval >= 0)
		});

		this.addTask = function(fn) {
			tasks.push(fn);
		}

		this.removeTask = function(fn_idx) {
			const idx = typeof fn_idx === 'number' ? fn_idx : tasks.indexOf(fn_idx)
			tasks.splice(idx, 1)
		}

		this.clearTasks = function() {
			tasks.splice(0, Infinity)
		}

		this.start = function() {
			if (!this.working) {
				this.interval = setInterval(this.do, this.time);
				return true;
			} else {
				return false;
			}
		}

		this.stop = function() {
			if (this.working) {
				clearInterval(this.interval);
				this.interval = -1;
				return true;
			} else {
				return false;
			}
		}

		this.do = function() {
			for (const task of tasks) {
				task();
			}
		}
	}

	function defineProperty(obj, prop, desc) {
		desc.configurable = false;
		desc.enumerable = true;
		Object.defineProperty(obj, prop, desc);
	}

	// Calculate 2 strings' similarity, return number lower means more similarity
	// MED: Minimal Edit Distance
	function calcMed(str1, str2) {
		// Create metrix
		const metrix = [];
		for (let i = 0; i < str1.length+1; i++) {
			metrix[i] = [];
		}

		// Fill metrix headers
		for (let i = 0; i < str1.length+1; i++) {
			metrix[i][0] = i;
		}
		for (let j = 0; j < str2.length+1; j++) {
			metrix[0][j] = j;
		}

		// Calc metrix grids
		for (let i = 1; i < str1.length+1; i++) {
			for (let j = 1; j < str2.length+1; j++) {
				const d1 = metrix[i-1][j] + 1;
				const d2 = metrix[i][j-1] + 1;
				const d3 = metrix[i-1][j-1] + (str1.charAt(i-1) === str2.charAt(j-1) ? 0 : 2);
				metrix[i][j] = Math.min(d1, d2, d3);
			}
		}

		return metrix[str1.length][str2.length];
	}
})();