/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* eslint-disable curly */
/* eslint-disable no-sequences */

// ==UserScript==
// @name               Baidu Translate
// @name:zh-CN         百度翻译
// @name:en            Baidu Translate
// @namespace          PY-DNG APIS
// @version            0.2.7
// @description        Baidu translate api support for userscripts. No need for baidu's token.
// @description:zh-CN  用户脚本版的百度翻译API支持，无需申请token，@require即用
// @description:en     Baidu translate api support for userscripts. No need for baidu's token.
// @author             PY-DNG
// @license            MIT
// @icon               data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPzbt074plC+9Y0e9PWIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1jR70+KZQvvzbuEwAAAAAAAAAAAAAAAD6wYWE9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//rBhYQAAAAA/Nu4TPWIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//zbuEz4plC+9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/+KZQvvaOIPL1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1jh/y9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/2kyr//vDh//vRpP/3okf/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//aRJv////////////7w4f/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/3oET//u/g//7v4P/2lCz/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9o8i/////////////vDh//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//ekS/////////////aWMP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/2jyL////////////96tb/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/96RL////////////9pYw//WIFP/1iBT/96NJ//ecO//2mDP/9pIn//WNHv////////////3q1v/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/3pEv////////////2ljD/9YgU//m5df////////////////////////////////////////v3//3n0P/948j//N/A//zdvf/817H//Nex//ixZP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//ekS/////////////aWMP/1iBT/9o8i//aYM//3n0L/96BD//elTf/4qFT////////////+8ub/+bt4//rAhP/7zJr//Ny5//3r2P/94sb/9Y0d//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/96RL////////////9pYw//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP////////////3s2f/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/3pEv////////////2ljD/9YgU//WIFP/2kCX/+saO//m9ff/5tWz/+Kxc/////////////vLl//aOIP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//ekS/////////////aWMP/1iBT/9YgU//rGjv/+7+D//vfu//748P////////////////////////////////////////////rHkP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/96RL////////////9pYw//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFf////////////727f/3okf/+KtZ//mzav/5tGv/9YgV//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/3pEv////////////2ljD/9po3//rGjv/4qlb/9Y4f//WIFP/1iBT/9YgU/////////////vjx//WIFP/1iBT/9pg0//m3cP/6x5D/9Y0d//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//ekS/////////////aWMP/1iBT/+KdS//3kyv///Pn//N6+//m1bf/2jyP//eXM//rEiv/2mjf/+bl0//3o0v/////////////////82rb/9Y0d//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/817H//Nex//zXsf/817H//OHD////////////9pYw//WIFP/1iBT/9YgU//irWv/969j///////758//6xYz/+bJn//7x5P/////////////////////////////////+7dz/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU///////////////////////////////////////2ljD/9YgU//WIFP/1iBT/9YgU//WKGP/5vHv///r1////////////////////////+fT//N28//rCh//4rFz/9po3//WLGv/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9pgz//aYM//2mDP/9pgz//aYM//2mDP/9pgz//WKGP/1iBT/9YgU//WIFP/1iBT/9YgU//WJF//83r7//////////////////eLF//WMHP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/+8uY///////+7t7//efP////////////+9Km//WJF//1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//irWv//////+9Wr//aOIP/2jiD//eXM////////////+86e//WIFf/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//rDiP/+9+///vfv//m2bv/1iBT/9YgU//WIFP/1jh///vLm//rJlf/1iBX/9YgU//WIFP/2kyn//vPn////////////+sWN//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/+seQ////////////+bl1//WIFP/2kCX//vLm//758////fv//efQ//zhxP/82bP/+9Gk//rJlP/82bT///////////////7//eLF//aXMv/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/6x5D////////////5uXX/9YgU//aYM//4sGL/+LBj//m4cv/5vHr/+sOJ//vLmP/70qb//Nm0//zfwP/+9Or////////////6xo//9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WMHP/2kCT/9pAk//WLGv/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WNHv/837//+r+B//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/2jiDy9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9o4g8vimUL71iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/4plC+/Ny5TPWIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//zbuEwAAAAA+sGFhPWIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/6wYWEAAAAAAAAAAAAAAAA/Nu4TPimUL71jh/y9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WIFP/1iBT/9YgU//WOH/L4plC+/Ny5TAAAAAAAAAAA4AAAB4AAAAGAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAeAAAAc=
// @grant              GM_xmlhttpRequest
// @connect            fanyi.baidu.com
// ==/UserScript==

/* Usage:
** baidu_translate(details): details = {
       text: <string> Text you want to translate.
	         Required argument, no default value.
       callback: <function> Callback function when translation succeed,
	             e.g. function(result) {console.log(result);}.
				 Argument `result` will be <string> translate result.
	             Required argument, no default value.
       [src]: <string> Source language; e.g. 'zh' for Chinese, 'en' for English, 'ja' for Japanese, ....
	          Default: Auto detect.
       [dst]: <string> Destination language,
	          Default: 'zh'.
       [split]: <number> Text spliting max length, just leave blank if you don't know what this means.
	            What it is: Baidu has limited that up to 5000 letters can be translated each single API
	            request, so the translate function will split text by about every ${split} letters, and
				translates each of them with a single API request then concatenate the translate result
				together again. Don't worry if any sentence to be splited, actually the translate
				function splits text with '\n' first, then concatenate the '\n'-splited strings as long
				as possible while keeping its length <= ${split}.
	            Default: 5000
       [onerror]: <function> Callback function when translation failed,
	              e.g. function(reason) {console.log(reason);}.
				  Argument: `reason` may be anything that causes its failure, just for debugging and do
				  not use it in production.
	              Default: function() {}.
       [retry]: <number> Times to retry before onerror function being called or an error being thrown,
	            Default: 3.
   }
** Or:
** baidu_translate(text, src, dst, callback, onerror, split, retry)
**
** Overloads:
** baidu_translate(text, src, dst, callback, onerror, split)
** baidu_translate(text, dst, callback, onerror, split)
** baidu_translate(text, callback, onerror, split)
** baidu_translate(text, callback, onerror)
** baidu_translate(text, callback)
*/

let baidu_translate, bdTransReady;
[baidu_translate, bdTransReady] = (function() {
	const BDT = new BaiduTranslateAPI();
	return [baidu_translate, bdTransReady];

	function baidu_translate() {
		// Check BDT ready
		if (!BDT.gtk || !BDT.token) {
			//throw new Error('BaiduTranslateAPI not ready');
			return false;
		}

		// Get argument
		const [text, src, dst, callback, onerror, split, retry] = parseArgs([...arguments], [
			function(args, defaultValues) {
				const details = args[0];
				const parsed = [...defaultValues];
				details.hasOwnProperty('text') && (parsed[0] = details.text);
				details.hasOwnProperty('src') && (parsed[1] = details.src);
				details.hasOwnProperty('dst') && (parsed[2] = details.dst);
				details.hasOwnProperty('callback') && (parsed[3] = details.callback);
				details.hasOwnProperty('onerror') && (parsed[4] = details.onerror);
				details.hasOwnProperty('split') && (parsed[5] = details.split);
				details.hasOwnProperty('retry') && (parsed[6] = details.retry);
				return parsed;
			},
			[1,4],
			[1,4,5],
			[1,4,5,6],
			[1,3,4,5,6],
			[1,2,3,4,5,6],
			[1,2,3,4,5,6,7]
		], ['', undefined, undefined, function() {}, function() {}, 5000, 3]);

		// Split lines
		const textarr = text.replaceAll('\r\n', '\n').replaceAll('\n\r', '\n').replaceAll('\r', '\n').split('\n');
		if (textarr.some((t) => (t.length > split))) {
			throw new Error('Some paragraph is longer than given split length (' + split + ')');
		}

		// Prepare
		const AM = new AsyncManager();
		const result = [];
		AM.onfinish = function() {
			callback(result.map(re => '\n'.repeat(re.newline_begin) + re.dst + '\n'.repeat(re.newline_end)).join('\n'));
		}

		// Send requests
		let index = 0;
		while (textarr.length > 0) {
			// Join translate api paragraph
			let para = '';
			while (textarr.length > 0 && para.length + textarr[0].length < split) {
				para += '\n' + textarr.shift();
			}
			para = para.substr(1);

			// Whether this paragraph contains \n at beginning
			const countNewLine = str => str.split('').filter(t => t === '\n').length;
			const newline_begin = countNewLine(para.match(/^\s*/) ? para.match(/^\s*/)[0] : '');
			const newline_end = countNewLine(para.match(/^\s*/) ? para.match(/\s*$/)[0] : '');
			result[index] = {src: para, dst: null, newline_begin, newline_end};

			// API request
			AM.add();
			BDT.translate({
				text: para,
				args: [index],
				src: src,
				dst: dst,
				onerror: onerror,
				retry: retry,
				callback: function(json, i) {
					const temp_result = json.trans_result.data.reduce(function(pre, cur) {
						return (pre.push('\n'.repeat(cur.prefixWrap) + cur.dst), pre);
					}, []).join('\n');
					result[i].dst = temp_result;
					AM.finish();
				}
			});
			index++;
		}
		AM.finishEvent = true;

		return true;
	}

	function bdTransReady(callback) {
		bdTransReady.callbacks = bdTransReady.callbacks || [];
		bdTransReady.callbacks.push(callback);
		BDT.oninit = dispatchCallback;

		function dispatchCallback() {
			bdTransReady.callbacks.forEach(cb => cb());
			bdTransReady.callbacks.splice(0, Infinity);
		}
	}

	function BaiduTranslateAPI() {
		const BT = this;
		BT.gtk = BT.token = null;
		BT.inited = false;

		let oninit=function() {};
		Object.defineProperty(BT, 'oninit', {
			enumerable: true,
			set: (f) => (typeof f === 'function' && (oninit = f) && BT.inited && oninit()),
			get: () => (oninit)
		});

		init();

		BT.calcSign = calcSign;
		BT.translate = translate;

		async function translate(details) {
			const callback = details.callback;
			const text = details.text;
			const src = details.src || await langDetect(text);
			const dst = details.dst || 'zh';
			const onerror = details.onerror || function() {};
			const retry = details.retry || 0;
			const args = details.args || [];

			GM_xmlhttpRequest({
				method: 'POST',
				url: 'https://fanyi.baidu.com/v2transapi',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: toQueryString({
					'from': src,
					'to': dst,
					'query': text,
					'simple_means_flag': 3,
					'sign': calcSign(text),
					'token': BT.token
				}),
				onload: function(response) {
					response.status !== 200 && Err(response);
					const json = JSON.parse(response.responseText);
					json.error && Err(json);
					callback.apply(null, [json].concat(args));

					function Err(e) {
						!_onerror(e) && console.log('Retrying...\nleft: ' + (retry-1).toString());
						console.log(e);
						throw new Error('Server returned with an error (logged above)');
					}
				},
				onerror: _onerror,
				ontimeout: _onerror,
				onabort: _onerror,
			});

			// Returns true for error, false for retry
			function _onerror(e) {
				console.log('sign = ' + calcSign(text));
				if (retry > 0) {
					setTimeout(retryRequest.bind(null, e), 500);
					return false;
				}
				onerror(e);
				return true;
			}

			function retryRequest(e) {
				translate({
					callback: callback,
					text: text,
					src: src,
					dst: dst,
					onerror: onerror,
					retry: retry - 1,
					args: args
				});
			}
		}

		function langDetect(text) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'POST',
					url: 'https://fanyi.baidu.com/langdetect',
					headers: {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: toQueryString({'query': text}),
					onload: function(response) {
						const json = JSON.parse(response.responseText);
						resolve(json.lan);
					},
					onerror: function(e) {reject(e)},
					ontimeout: function(e) {reject(e)},
					onabort: function(e) {reject(e)},
				});
			});
		}

		// Calc sign based on query-text and gtk
			function calcSign(query) {
				function e(t, e) {
					(null == e || e > t.length) && (e = t.length);
					for (var n = 0, r = new Array(e); n < e; n++)
						r[n] = t[n];
					return r
				}
				function n(t, e) {
					for (var n = 0; n < e.length - 2; n += 3) {
						var r = e.charAt(n + 2);
						r = "a" <= r ? r.charCodeAt(0) - 87 : Number(r),
						r = "+" === e.charAt(n + 1) ? t >>> r : t << r,
						t = "+" === e.charAt(n) ? t + r & 4294967295 : t ^ r
					}
					return t
				}
				var r = null;
				var token = function(t, _gtk) {
					var o, i = t.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
					if (null === i) {
						var a = t.length;
						a > 30 && (t = "".concat(t.substr(0, 10)).concat(t.substr(Math.floor(a / 2) - 5, 10)).concat(t.substr(-10, 10)))
					} else {
						for (var s = t.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), c = 0, u = s.length, l = []; c < u; c++)
							"" !== s[c] && l.push.apply(l, function(t) {
								if (Array.isArray(t))
									return e(t)
							}(o = s[c].split("")) || function(t) {
								if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
									return Array.from(t)
							}(o) || function(t, n) {
								if (t) {
									if ("string" == typeof t)
										return e(t, n);
									var r = Object.prototype.toString.call(t).slice(8, -1);
									return "Object" === r && t.constructor && (r = t.constructor.name),
									"Map" === r || "Set" === r ? Array.from(t) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? e(t, n) : void 0
								}
							}(o) || function() {
								throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
							}()),
							c !== u - 1 && l.push(i[c]);
						var p = l.length;
						p > 30 && (t = l.slice(0, 10).join("") + l.slice(Math.floor(p / 2) - 5, Math.floor(p / 2) + 5).join("") + l.slice(-10).join(""))
					}
					for (var h = (_gtk || "").split("."), f = Number(h[0]) || 0, m = Number(h[1]) || 0, g = [], y = 0, v = 0; v < t.length; v++) {
						var _ = t.charCodeAt(v);
						_ < 128 ? g[y++] = _ : (_ < 2048 ? g[y++] = _ >> 6 | 192 : (55296 == (64512 & _) && v + 1 < t.length && 56320 == (64512 & t.charCodeAt(v + 1)) ? (_ = 65536 + ((1023 & _) << 10) + (1023 & t.charCodeAt(++v)),
						g[y++] = _ >> 18 | 240,
						g[y++] = _ >> 12 & 63 | 128) : g[y++] = _ >> 12 | 224,
						g[y++] = _ >> 6 & 63 | 128),
						g[y++] = 63 & _ | 128)
					}
					for (var b = f, w = '+-a^+6', k = '+-3^+b+-f', x = 0; x < g.length; x++)
						b = n(b += g[x], w);
					return b = n(b, k),
					(b ^= m) < 0 && (b = 2147483648 + (2147483647 & b)),
					"".concat((b %= 1e6).toString(), ".").concat(b ^ f)
				}

				return token(query, BT.gtk);
			}

		function toQueryString(obj) {
			const USP = new URLSearchParams();
			for (const [key, value] of Object.entries(obj)) {
				USP.append(key, value);
			}
			return USP.toString();
		}

		// Request token and gtk
		function init() {
			// Request twice, make sure gtk is latest,
			// or may get 998 error while requesting translate API
			requestIndex(requestIndex.bind(null, function(html) {
				BT.token = html.match(/token: ["'](.*?)["'],/)[1];
				BT.gtk = html.match(/window.gtk = ["'](.*?)["'];/)[1];
				BT.inited = true;
				oninit();
			}));

			function requestIndex(callback) {
				const url = 'https://fanyi.baidu.com';
				GM_xmlhttpRequest({
					method: 'GET',
					headers: {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
					},
					url: url,
					onload: function(response) {
						callback(response.responseText);
					}
				});
			}
		}
	}

	function AsyncManager() {
		const AM = this;

		// Ongoing xhr count
		this.taskCount = 0;

		// Whether generate finish events
		let finishEvent = false;
		Object.defineProperty(this, 'finishEvent', {
			configurable: true,
			enumerable: true,
			get: () => (finishEvent),
			set: (b) => {
				finishEvent = b;
				b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
			}
		});

		// Add one task
		this.add = () => (++AM.taskCount);

		// Finish one task
		this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
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
}) ();