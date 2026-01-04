/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               MyFreeMP3 API
// @namespace          PY-DNG userscripts
// @version            0.1.8
// @description        Music API for http://tool.liumingye.cn/music/ and http://tool.liumingye.cn/music_old/
// @author             PY-DNG
// @license            MIT
// ==/UserScript==

/* global md5 */

var Mfapi = (function __MAIN__() {
    'use strict';

	detectDom('head', head => loadMd5Script());

	return (function() {
		return {
			search,
			old: {
				search: search_old,
				link: link_old,
				encode: encode_old
			},
			new: {
				search: search_new,
				link: link_new,
				encode: encode_new
			}
		};

		function search(details, retry=3) {
			const onerror = details.onerror || function() {};
			const reqOld = onerror => req(search_old, dealResponse_old, onerror, 'old');
			const reqNew = onerror => req(search_new, dealResponse_new, onerror, 'new');
			({
				old: () => reqOld(onerror),
				new: () => reqNew(onerror),
				auto: () => reqNew(err => reqOld(err => --retry ? search(details, retry) : onerror(err)))
			})[details.api || 'new']();

			function req(request, dealer, onerror, api) {
				request({
					text: getApiRes('text', api), page: getApiRes('page', api), type: getApiRes('type', api),
					callback: json => details.callback(dealer(json)),
					onerror: onerror
				}, 1);

				function getApiRes(prop, api) {
					const res = details[prop];
					return isObject(res) && res.hasOwnProperty(api) ? res[api] : res;
				}
			}

			function dealResponse_old(json) {
				return {
					list: json.data.list.map(song => ({
						name: song.name,
						artist: song.artist.split(','),
						cover: song.cover,
						lrc: song.lrc,
						quality: song.quality.map(q => typeof q === 'number' ? q : parseInt(q.name)),
						url: song.quality.reduce((url, q) => {
							url[q] = link_old(song, q);
							return url;
						}, {})
					})),
					noMore: !json.more,
					api: 'old'
				};
			}

			function dealResponse_new(json) {
				checkQuality();
				const newJson = {
					list: json.data.list.map(song => ({
						name: song.name,
						artist: song.artist.map(a => a.name),
						cover: (song.pic || song.album?.pic).replace(/[@\?][^@\?]*$/, ''),
						lrc: song.lyric ? `https://api.liumingye.cn/m/api/lyric/id/${encodeURIComponent(song.lyric)}/name/${encodeURIComponent(song.name)} - ${encodeURIComponent(song.artist.map(a => a.name).join(','))}` : null,
						quality: song.quality.map(q => typeof q === 'number' ? q : parseInt(q.name)).sort((q1, q2) => q1 - q2),
						url: new Proxy({}, {
							get: (target, property, receiver) => {
								const quality = parseInt(property, 10);
								return link_new(song, quality);
							},
							has: (target, property) => {
								const quality = parseInt(property, 10);
								return newJson.quality.includes(quality);
							},
							ownKeys: target => {
								return song.quality.map(q => q.toString());
							}
						}),
					})),
					noMore: !json.data.list.length,
					api: 'new'
				};
				return newJson;

				function checkQuality() {
					let alerted = false;
					json.data.list.forEach(song => song.quality.forEach(q => {
						const valid = typeof q === 'number' || (typeof q === 'object' && q !== null && typeof q.name === 'string' && /^\d+$/.test(q.name));
						if (!valid) {
							const str = JSON.stringify(q);
							if (str.length > 20) {
								str = str.substring(0, 20-3) + '...';
							}
							console.log(q);
							!alerted && alert(`MyFreeMP3 API: 该音频音质格式为（${str}），当前尚未支持，请向开发者反馈`);
							alerted = true;
						}
					}));
				}
			}
		}

		function search_old(details, retry=3) {
			const text = details.text;
			const page = details.page || '1';
			const type = details.type || 'YQD';
			const callback = details.callback;
			const onerror = details.onerror || function() {};
			if (!text || !callback) {
				throw new Error('Argument text or callback missing');
			}

			//const url = 'http://59.110.45.28/m/api/search';
			const url = 'http://api2.liumingye.cn/m/api/search';
			GM_xmlhttpRequest({
				method: 'POST',
				url: url,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Referer': 'https://tools.liumingye.cn/music_old/'
				},
				data: encode_old('text='+text+'&page='+page+'&type='+type),
				timeout: 10 * 1000,
				onload: function(res) {
					let json;
					try {
						json = JSON.parse(res.responseText);
						if (json.code !== 200) {
							throw new Error('dataerror');
						} else {
							callback(json);
						}
					} catch(err) {
						--retry ? search_old(details, retry) : onerror(err);
						return false;
					}
				},
				onerror: err => --retry ? search_old(details, retry) : onerror(err),
				ontimeout: err => --retry ? search_old(details, retry) : onerror(err)
			});
		}

		function link_old(song, quality) {
			!song.quality.includes(quality) && (quality = Math.max.apply(Math, song.quality));
			const qname = ({
				96: 'url_m4a',
				128: 'url_128',
				320: 'url_320',
				2000: 'url_flac'
			})[quality];
			if (!qname) { setTimeout(e => alert(`MyFreeMP3 API: 该音频格式为${quality.toString()}，当前尚未支持，请向开发者反馈`)); throw new Error('Unsupported MF3 quality name'); }
			return song[qname];
		}

		function encode_old(plainText) {
			const now = new Date().getTime();
			const md5Data = md5('<G6sX,Lk~^2:Y%4Z');
			let left = md5(md5Data.substr(0, 16));
			let right = md5(md5Data.substr(16, 32));
			let nowMD5 = md5(now).substr(-4);
			let Var_10 = (left + md5((left + nowMD5)));
			let Var_11 = Var_10.length;
			let Var_12 = ((((now / 1000 + 86400) >> 0) + md5((plainText + right)).substr(0, 16)) + plainText);
			let Var_13 = '';
			for (let i = 0, Var_15 = Var_12.length;
				 (i < Var_15); i++) {
				let Var_16 = Var_12.charCodeAt(i);
				if ((Var_16 < 128)) {
					Var_13 += String.fromCharCode(Var_16);
				} else if ((Var_16 > 127) && (Var_16 < 2048)) {
					Var_13 += String.fromCharCode(((Var_16 >> 6) | 192));
					Var_13 += String.fromCharCode(((Var_16 & 63) | 128));
				} else {
					Var_13 += String.fromCharCode(((Var_16 >> 12) | 224));
					Var_13 += String.fromCharCode((((Var_16 >> 6) & 63) | 128));
					Var_13 += String.fromCharCode(((Var_16 & 63) | 128));
				}
			}
			let Var_17 = Var_13.length;
			let Var_18 = [];
			for (let i = 0; i <= 255; i++) {
				Var_18[i] = Var_10[(i % Var_11)].charCodeAt();
			}
			let Var_19 = [];
			for (let Var_04 = 0;
				 (Var_04 < 256); Var_04++) {
				Var_19.push(Var_04);
			}
			for (let Var_20 = 0, Var_04 = 0;
				 (Var_04 < 256); Var_04++) {
				Var_20 = (((Var_20 + Var_19[Var_04]) + Var_18[Var_04]) % 256);
				let Var_21 = Var_19[Var_04];
				Var_19[Var_04] = Var_19[Var_20];
				Var_19[Var_20] = Var_21;
			}
			let Var_22 = '';
			for (let Var_23 = 0, Var_20 = 0, Var_04 = 0;
				 (Var_04 < Var_17); Var_04++) {
				let Var_24 = '0|2|4|3|5|1'.split('|'),
					Var_25 = 0;
				while (true) {
					switch (Var_24[Var_25++]) {
						case '0':
							Var_23 = ((Var_23 + 1) % 256);
							continue;
						case '1':
							Var_22 += String.fromCharCode(Var_13[Var_04].charCodeAt() ^ Var_19[((Var_19[Var_23] + Var_19[Var_20]) % 256)]);
							continue;
						case '2':
							Var_20 = ((Var_20 + Var_19[Var_23]) % 256);
							continue;
						case '3':
							Var_19[Var_23] = Var_19[Var_20];
							continue;
						case '4':
							var Var_21 = Var_19[Var_23];
							continue;
						case '5':
							Var_19[Var_20] = Var_21;
							continue;
					}
					break;
				}
			}
			let Var_26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			for (var Var_27, Var_28, Var_29 = 0, Var_30 = Var_26, Var_31 = ''; Var_22.charAt((Var_29 | 0)) || (Var_30 = '=', (Var_29 % 1)); Var_31 += Var_30.charAt((63 & (Var_27 >> (8 - ((Var_29 % 1) * 8)))))) {
				Var_28 = Var_22.charCodeAt(Var_29 += 0.75);
				Var_27 = ((Var_27 << 8) | Var_28);
			}
			Var_22 = (nowMD5 + Var_31.replace(/=/g, '')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
			return (('data=' + Var_22) + '&v=2');
		}

		function search_new(details, retry=3) {
			const callback = details.callback;
			const onerror = details.onerror || function() {};
			const data = {
				type: details.type || 'YQD',
				text: details.text,
				page: details.page || 1
			};
			doSearch();

			function doSearch() {
				// Set properties
				['_t', 'v', 'token'].forEach(key => delete data[key]);
				data.v = "beta";
				data._t = Date.now();
				data.token = encode_new(encodeURIComponent(JSON.stringify(data)));

				// Request
				GM_xmlhttpRequest({
					method: 'POST',
					url: 'https://api.liumingye.cn/m/api/search',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Origin': 'https://tool.liumingye.cn',
						'content-type': 'application/json;charset=UTF-8',
					},
					responseType: 'json',
					data: JSON.stringify(data),
					timeout: 10 * 1000,
					onload: res => callback(res.response),
					onerror: err => --retry ? doSearch() : onerror(err),
					ontimeout: err => --retry ? doSearch() : onerror(err)
				});
			}
		}

		function link_new(song, quality) {
			!song.quality.includes(quality) && (quality = Math.max.apply(Math, song.quality));
			const params = {
				id: song.hash || song.id,
				quality,
				_t: Date.now()
			};
			params.token = encode_new(encodeURIComponent(JSON.stringify(params, (k, v) => {
				return typeof v === 'number' ? v.toString() : v;
			})));
			const paramsStr = (function() {
				let str = '';
				for (const [key, value] of Object.entries(params)) {
					str += `&${key.toString()}=${value.toString()}`;
				}
				str = str.slice(1);
				return str;
			}) ();
			const url = 'https://api.liumingye.cn/m/api/link?' + paramsStr;
			return url;
		}

		function encode_new() {
            // 感谢 snyssss 提供的新算法
            if (!encode_new.encode) {
                encode_new.encode = (function () {
                    const version = "20240531.";
                    const defaultKey =
                          "4b9qrOXu305U5Ex5U1yYv69jZO5EbznZq9nWaY5e5NW2GImw27aEBjL4OgW01Tpy";

                    const customAlphabet =
                          "hQxDsS6geBiG1MTOPZzoHkt8Wyf4AnLU7FqJbp+0N=udc2j/VY9aICrmX3Rvl5KwE";

                    return (value, key = defaultKey) => {
                        const xor = value.replace(/./g, (char, index) =>
                                                  String.fromCharCode(
                            char.charCodeAt(0) ^ key.charCodeAt(index % key.length)
                        )
                                                 );

                        const base64 = btoa(xor);

                        const result = base64.replace(/./g, (char) => {
                            const standardAlphabet =
                                  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

                            if (char === standardAlphabet[standardAlphabet.length - 1]) {
                                return char;
                            }

                            return customAlphabet[standardAlphabet.indexOf(char)];
                        });

                        return version + md5(result);
                    };
                })();
            }
            return encode_new.encode.apply(this, arguments);
		}
	}) ();

	function loadMd5Script() {
		const s = document.createElement('script');
		s.src = 'https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.js';
		document.head.appendChild(s);
	}

	// Get callback when specific dom/element loaded
	// detectDom({[root], selector, callback[, once]}) | detectDom(selector, callback) | detectDom(root, selector, callback) | detectDom(root, selector, callback, once)
	function detectDom() {
		const [root, selector, callback, once] = parseArgs([...arguments], [
			function(args, defaultValues) {
				const arg = args[0];
				return ['root', 'selector', 'callback', 'once'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i]);
			},
			[2,3],
			[1,2,3],
			[1,2,3,4]
		], [document, '', e => Err('detectDom: callback not found'), true]);

		if ($(root, selector)) {
			for (const elm of $All(root, selector)) {
				callback(elm);
				if (once) {
					return null;
				}
			}
		}

		const observer = new MutationObserver(mCallback);
		observer.observe(root, {
			childList: true,
			subtree: true
		});

		function mCallback(mutationList, observer) {
			const addedNodes = mutationList.reduce((an, mutation) => ((an.push.apply(an, mutation.addedNodes), an)), []);
			const addedSelectorNodes = addedNodes.reduce((nodes, anode) => {
				if (anode.matches && anode.matches(selector)) {
					nodes.add(anode);
				}
				const childMatches = anode.querySelectorAll ? $All(anode, selector) : [];
				for (const cm of childMatches) {
					nodes.add(cm);
				}
				return nodes;
			}, new Set());
			for (const node of addedSelectorNodes) {
				callback(node);
				if (once) {
					observer.disconnect();
					break;
				}
			}
		}

		return observer;
	}

	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}

	function parseArgs(args, rules, defaultValues=[]) {
		// args and rules should be array, but not just iterable (string is also iterable)
		if (!Array.isArray(args) || !Array.isArray(rules)) {
			throw new TypeError('parseArgs: args and rules should be array')
		}

		// fill rules[0]
		(!Array.isArray(rules[0]) || rules[0].length === 1) && rules.splice(0, 0, []);

		// max arguments length
		const count = rules.length - 1;

		// args.length must <= count
		if (args.length > count) {
			throw new TypeError(`parseArgs: args has more elements(${args.length}) longer than ruless'(${count})`);
		}

		// rules[i].length should be === i if rules[i] is an array, otherwise it should be a function
		for (let i = 1; i <= count; i++) {
			const rule = rules[i];
			if (Array.isArray(rule)) {
				if (rule.length !== i) {
					throw new TypeError(`parseArgs: rules[${i}](${rule}) should have ${i} numbers, but given ${rules[i].length}`);
				}
				if (!rule.every((num) => (typeof num === 'number' && num <= count))) {
					throw new TypeError(`parseArgs: rules[${i}](${rule}) should contain numbers smaller than count(${count}) only`);
				}
			} else if (typeof rule !== 'function') {
				throw new TypeError(`parseArgs: rules[${i}](${rule}) should be an array or a function.`)
			}
		}

		// Parse
		const rule = rules[args.length];
		let parsed;
		if (Array.isArray(rule)) {
			parsed = [...defaultValues];
			for (let i = 0; i < rule.length; i++) {
				parsed[rule[i]-1] = args[i];
			}
		} else {
			parsed = rule(args, defaultValues);
		}
		return parsed;
	}

	function isObject(val) {
		return typeof val === 'object' && val !== null;
	}

	// type: [Error, TypeError]
	function Err(msg, type=0) {
		throw new [Error, TypeError][type]((typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + msg);
	}
})();