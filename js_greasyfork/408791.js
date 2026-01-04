/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               My Free MP3+
// @namespace          http://tampermonkey.net/My Free MP3 Plus
// @version            0.2.6.2
// @description        解锁MyFreeMP3的QQ音乐、酷狗音乐、酷我音乐，过广告拦截器检测，所有下载全部转为页面内直链下载
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @require            https://greasyfork.org/scripts/456034-basic-functions-for-userscripts/code/script.js?version=1226884
// @require            https://fastly.jsdelivr.net/npm/mp3tag.js@3.7.1/dist/mp3tag.min.js
// @require            https://update.greasyfork.org/scripts/482519/1297737/buffer.js
// @require            https://update.greasyfork.org/scripts/482520/1298549/metaflacjs.js
// @match              http*://tool.liumingye.cn/music_old/*
// @match              http*://tools.liumingye.cn/music_old/*
// @match              http*://tool.liumingye.cn/music/*
// @match              http*://tools.liumingye.cn/music/*
// @connect            kugou.com
// @connect            *
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @icon               data:image/png;base64,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
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/408791/My%20Free%20MP3%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/408791/My%20Free%20MP3%2B.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global pop MP3Tag BufferExport Metaflac */

(async function() {
    'use strict';

	const CONST = {
		Text: {
			DownloadError: '下载遇到错误，请重试',
			MergeMetadata: ['[ ]下载时自动合成歌名、艺术家、封面和歌词到歌曲文件里', '[✔]下载时自动合成歌名、艺术家、封面和歌词到歌曲文件里']
		}
	};
	const FileType = await import('https://fastly.jsdelivr.net/npm/file-type@18.7.0/+esm');

	// Main loader
	main();

	function main() {
		// Collect all funcs from page objs
		const pages = [music, music_old, setting].map(f => f());
		const func_immediate = [], func_load = [];
		for (const page of pages) {
			page.regurl.test(location.href) &&
				page.funcs.forEach(funcobj => (funcobj.onload ? func_load : func_immediate).push(funcobj.func));
		}

		// Exec
		const exec = funcs => funcs.forEach(func => func());
		exec(func_immediate);
		document.readyState !== 'complete' ? $AEL(window, 'load', exec.bind(null, func_load)) : exec(func_load);
	}

	// 新版页面
	function music() {
		return {
			regurl: /^https?:\/\/tools?\.liumingye\.cn\/music\//,
			funcs: [{
				func: downloadInPage,
				onload: false
			}]
		}

		function downloadInPage() {
			const hooker = new Hooker();

			const xhrs = [];
			const hookedURLs = ['https://api.liumingye.cn/m/api/search', 'https://api.liumingye.cn/m/api/home/recommend', 'https://api.liumingye.cn/m/api/top/song'];

			const openHooerId = hooker.hook(XMLHttpRequest.prototype, 'open', false, false, {
				dealer(_this, args) {
					if (hookedURLs.some(url => args[1].includes(url))) {
						xhrs.push(_this);
					}
					return [_this, args];
				}
			});

			const sendHooerId = hooker.hook(XMLHttpRequest.prototype, 'send', false, false, {
				dealer(_this, args) {
					if (xhrs.includes(_this)) {
						const callbackName = 'onloadend' in _this ? 'onloadend' : 'onreadystatechange';
						const callback = _this[callbackName];
						_this[callbackName] = function() {
							const json = JSON.parse(this.response);
							json.data.list.forEach(song => song.quality.forEach((q, i) => typeof q !== 'number' && (song.quality[i] = parseInt(q.name, 10))));
							rewriteResponse(this, json);
							callback.apply(this, arguments);
						}
						xhrs.splice(xhrs.indexOf(_this), 1);
					}
					return [_this, args];
				}
			});
		}
	}

	// 旧版页面
	function music_old() {
		return {
			regurl: /^https?:\/\/tools?\.liumingye\.cn\/music_old\//,
			funcs: [{
				func: unlockTencent,
				onload: true
			}, {
				func: downloadInPage,
				onload: true
			}, {
				func: bypassAdkillerDetector,
				onload: false
			}]
		};

		// 解锁QQ音乐、酷狗音乐、酷我音乐函数
		function unlockTencent() {
			// 模拟双击
			const search_title = $('#search .home-title');
			const eDblclick = new Event('dblclick');
			search_title.dispatchEvent(eDblclick);
			// 去除双击事件
			const p = search_title.parentElement;
			const new_search_title = $CrE('div');
			new_search_title.className = search_title.className;
			new_search_title.innerHTML = search_title.innerHTML;
			p.removeChild(search_title);
			p.insertBefore(new_search_title, p.children[0]);
		}

		// Hook掉下载按钮实现全部下载均采用页面内下载方式（重写下载逻辑）
		function downloadInPage() {
			$AEL(document.body, 'click', onclick, {capture: true});

			function onclick(e) {
				const elm = e.target;
				const parent = elm ? elm.parentElement : null;
				match(elm);
				match(parent);

				function match(elm) {
					const tag = elm.tagName.toUpperCase();
					const clList = [...elm.classList];
					if (tag === 'A' && clList.includes('download') || clList.includes('pic_download')) {
						e.stopPropagation();
						e.preventDefault();;
						download(elm);
					}
				}
			}

			function download(a) {
				const elm_data = a.parentElement.previousElementSibling;
				const url = elm_data.value;
				const name = $("#name").value;
				const objPop = pop.download(name, 'download');
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					responseType: 'blob',
					onprogress: function(e) {
						e.lengthComputable /*&& c*/ && (pop.size(objPop, bytesToSize(e.loaded) + " / " + bytesToSize(e.total)),
														pop.percent(objPop, 100 * (e.loaded / e.total) >> 0))
					},
					onerror: function(e) {
						console.log(e);
						window.open(url);
					},
					onload: async function(response) {
						let blob = response.response;
						const filetype = await FileType.fileTypeFromBuffer(await readAsArrayBuffer(blob));
						const ext = filetype?.ext || getExtname(elm_data.id, blob.type.split(';')[0]);
						try {
							GM_getValue('merge-metadata', false) && filetype?.ext === 'mp3' && (blob = await tagMP3(blob, getCurDlTag()));
							GM_getValue('merge-metadata', false) && filetype?.ext === 'flac' && (blob = await tagFLAC(blob, getCurDlTag()));
						} catch(err) {
							pop.text(objPop, CONST.Text.DownloadError);
							setTimeout(() => pop.close(objPop), 3000);
							DoLog(LogLevel.Error, err, 'error');
							throw err;
						}
						saveFile(blob, `${name}.${ext}`, filetype?.mime);
						pop.finished(objPop);
						setTimeout(pop.close.bind(pop, objPop), 2000);
					}
				});

				function getExtname(...args) {
					const map = {
						url_dsd: "flac",
						url_flac: "flac",
						url_ape: "ape",
						url_320: "mp3",
						url_128: "mp3",
						url_m4a: "m4a",
						url_lrc: "lrc",
						'image/png': 'png',
						'image/jpg': 'jpg',
						'image/gif': 'gif',
						'image/bmp': 'bmp',
						'image/jpeg': 'jpeg',
						'image/webp': 'webp',
						'image/tiff': 'tiff',
						'image/vnd.microsoft.icon': 'ico',
					};
					return map[args.find(a => map[a])];
				}

				function bytesToSize(a) {
					if (0 === a) {
						return "0 B";
					}
					var b = 1024
					, c = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
					, d = Math.floor(Math.log(a) / Math.log(b));
					return (a / Math.pow(b, d)).toFixed(2) + " " + c[d]
				}
			}

			function getCurDlTag() {
				const tag = {
					cover: $('#pic').value,
					lyric: $('#url_lrc').value
				};
				const dlname = JSON.parse(localStorage.configure).data.dlname.split(' - ');
				const filename = $('#name').value.split(' - ');
				const name_singer = [0, 1].reduce((o, i) => ((o[dlname[i]] = filename[i], o)), {});
				tag.name = name_singer['{name}'];
				tag.artist = name_singer['{singer}'];
				return tag;
			}
		}

		// 过广告拦截器检测
		function bypassAdkillerDetector() {
			/*
		// 拦截广告拦截检测器的setTimeout延迟启动器
		// 优点：不用考虑#music_tool是否存在，不用反复执行；缺点：需要在setTimeout启动器注册前执行，如果脚本加载缓慢，就来不及了
		const setTimeout = unsafeWindow.setTimeout;
		unsafeWindow.setTimeout = function(func, time) {
			if (func && func.toString().includes('$("#music_tool").html()')) {
				func = function() {};
			}
			setTimeout.call(this, func, time);
		}
		*/
			/*
		// 拦截广告拦截检测器的innerHTML检测
		// 优点：对浏览器API没有影响，对DOM影响极小，在检测前执行即可；缺点：需要#music_tool存在，需要反复检测执行，影响性能，稳定性差
		const bypasser = () => {
			const elm = $('#music_tool');
			elm && Object.defineProperty($('#music_tool'), 'innerHTML', {get: () => '<iframe></iframe>'});
		};
		setTimeout(bypasser, 2000);
		bypasser();
		*/
			// 在页面添加干扰元素
			// 优点：对浏览器API没有影响，对DOM几乎没有影响，在检测前执行即可，不用考虑#music_tool是否存在，不用反复执行；缺点：可能影响广告功能（乐
			document.body.firstChild.insertAdjacentHTML('beforebegin', '<ins id="music_tool" style="display: none !important;">sometext</ins>');
		}
	}

	function setting() {
		return {
			regurl: /^https?:\/\/tools?\.liumingye\.cn\/music(_old)?\//,
			funcs: [{
				func: makeSettings,
				onload: false
			}]
		};

		function makeSettings() {
			makeBooleanSettings([{
				text: CONST.Text.MergeMetadata,
				key: 'merge-metadata',
				defaultValue: false,
			}]);
		}
	}

	// Write MP3 tags
	function tagMP3(blob, tag) {
		return new Promise(async (resolve, reject) => {
			try {
				const buffer = await readAsArrayBuffer(blob);

				// MP3Tag Usage
				const mp3tag = new MP3Tag(buffer);
				mp3tag.read();
				mp3tag.tags.v2.TIT2 = tag.name || '';
				mp3tag.tags.v2.TPE1 = tag.artist || '';

				const AM = new AsyncManager();
				AM.onfinish = () => resolve(new Blob([mp3tag.save()], { type: blob.type }));

				// Lyric
				AM.add();
				GM_xmlhttpRequest({
					method: 'GET',
					url: tag.lyric,
					timeout: 5 * 1000,
					onload: res => {
						const lyric = res.responseText;//.split(/[\r\n\t ]+/g).filter(line => /^\[\d+:\d+.\d+\][^\[\]]*$/.test(line)).join('\n');
						mp3tag.tags.v2.USLT = [{
							language: 'eng',
							descriptor: '',
							text: lyric
						}];
						AM.finish();
					},
					ontimeout: err => reject(err),
					onerror: err => reject(err)
				});

				// Cover
				AM.add();
				GM_xmlhttpRequest({
					method: 'GET',
					url: tag.cover,
					responseType: 'blob',
					timeout: 5 * 1000,
					onload: async res => {
						const blob = res.response;
						const imagebuffer = await readAsArrayBuffer(blob);
						const imageBytes = new Uint8Array(imagebuffer);
						mp3tag.tags.v2.APIC = [{
							format: blob.type,
							type: 3,
							description: '',
							data: imageBytes
						}]
						AM.finish();
					},
					ontimeout: err => reject(err),
					onerror: err => reject(err)
				});

				AM.finishEvent = true;
			} catch (err) {
				reject(err);
			}
		});
	}

	function tagFLAC(blob, tag) {
		return new Promise(async (resolve, reject) => {
			try {
				const buf = BufferExport.Buffer.from(await readAsArrayBuffer(blob));
				const flac = new Metaflac(buf);

				flac.removeTag('TITLE');
				flac.removeTag('ARTIST');
				flac.setTag(`TITLE=${tag.name}`);
				flac.setTag(`ARTIST=${tag.artist}`);

				const AM = new AsyncManager();
				AM.onfinish = () => resolve(new Blob([flac.save()], { type: blob.type }));

				// Lyric
				AM.add();
				GM_xmlhttpRequest({
					method: 'GET',
					url: tag.lyric,
					timeout: 5 * 1000,
					onload: res => {
						const lyric = res.responseText;//.split(/[\r\n\t ]+/g).filter(line => /^\[\d+:\d+.\d+\][^\[\]]*$/.test(line)).join('\n');
						flac.removeTag('LYRICS');
						flac.setTag(`LYRICS=${lyric}`);
						AM.finish();
					},
					ontimeout: err => reject(err),
					onerror: err => reject(err)
				});

				// Cover
				AM.add();
				GM_xmlhttpRequest({
					method: 'GET',
					url: tag.cover,
					responseType: 'blob',
					timeout: 5 * 1000,
					onload: async res => {
						const blob = res.response;
						const arraybuffer = await readAsArrayBuffer(blob);
						const imagebuffer = BufferExport.Buffer.from(arraybuffer);
						await flac.importPictureFromBuffer(imagebuffer);
						AM.finish();
					},
					ontimeout: err => reject(err),
					onerror: err => reject(err)
				});

				AM.finishEvent = true;
			} catch(err) {
				reject(err);
			}
		});
	}

	function readAsArrayBuffer(file) {
		return new Promise(function (resolve, reject) {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	}

	// Save url/Blob/File to file
	function saveFile(dataURLorBlob, filename, mimeType=null) {
		let url = dataURLorBlob, isObjURL = false;
		if (typeof url !== 'string') {
			const mimedBlob = new Blob([dataURLorBlob], { type: mimeType || dataURLorBlob.type });
			url = URL.createObjectURL(mimedBlob);
			isObjURL = true;
		}

		if (GM_info.scriptHandler === 'Tampermonkey' && GM_info.downloadMode !== 'disabled') {
			GM_download({ name: filename, url, onload: revoke });
		} else {
			const a = $CrE('a');
			a.href = url;
			a.download = filename;
			a.click();
			revoke();
		}

		function revoke() {
			isObjURL && setTimeout(() => URL.revokeObjectURL(url));
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

	function makeBooleanSettings(settings) {
		for (const setting of settings) {
			makeBooleanMenu(setting.text, setting.key, setting.defaultValue, setting.callback, setting.initCallback);
		}

		function makeBooleanMenu(texts, key, defaultValue=false, callback=null, initCallback=false) {
			const initialVal = GM_getValue(key, defaultValue);
			const initialText = texts[initialVal + 0];
			let id = GM_registerMenuCommand(initialText, onClick/*, {
				autoClose: false
			}*/);
			initCallback && callback(key, initialVal);

			function onClick() {
				const newValue = !GM_getValue(key, defaultValue);
				const newText = texts[newValue + 0];
				GM_setValue(key, newValue);
				GM_unregisterMenuCommand(id);
				id = GM_registerMenuCommand(newText, onClick/*, {
					autoClose: false
				}*/);

				typeof callback === 'function' && callback(key, newValue);
			}
		}
	}

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
})();