/* eslint-disable no-multi-spaces */
/* eslint-disable no-useless-call */

// ==UserScript==
// @name                    SingleFile - 单文件保存网页
// @name:en                 SingleFile - Webpage downloader
// @name:en-US              SingleFile - Webpage downloader
// @name:en-UK              SingleFile - Webpage downloader
// @name:zh                 SingleFile - 单文件保存网页
// @name:zh-CN              SingleFile - 单文件保存网页
// @name:zh-Hans            SingleFile - 单文件保存网页
// @name:zh-TW              SingleFile - 單檔案保存網頁
// @namespace               SingleFile
// @version                 2.2
// @description             将当前网页保存为一个.html网页文件
// @description:en          Save webpages into one .html file
// @description:en-US       Save webpages into one .html file
// @description:en-UK       Save webpages into one .html file
// @description:zh          将当前网页保存为一个.html网页文件
// @description:zh-CN       将当前网页保存为一个.html网页文件
// @description:zh-Hans     将当前网页保存为一个.html网页文件
// @description:zh-TW       將當前網頁保存為一個.html網頁檔案
// @author                  PY-DNG
// @license                 MIT
// @include                 *
// @connect                 *
// @icon                    data:image/png;base64,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
// @grant                   GM_xmlhttpRequest
// @grant                   GM_registerMenuCommand
// @grant                   GM_unregisterMenuCommand
// @grant                   GM_info
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419798/SingleFile%20-%20%E5%8D%95%E6%96%87%E4%BB%B6%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/419798/SingleFile%20-%20%E5%8D%95%E6%96%87%E4%BB%B6%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arguments: level=LogLevel.Info, logContent, asObject=false
    // Needs one call "DoLog();" to get it initialized before using it!
    function DoLog() {
        // Global log levels set
        window.LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        }
        window.LogLevelMap = {};
        window.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
        window.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
        window.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
        window.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
        window.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
        window.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

        // Current log level
        DoLog.logLevel = (unsafeWindow ? unsafeWindow.isPY_DNG : window.isPY_DNG) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

        // Log counter
        DoLog.logCount === undefined && (DoLog.logCount = 0);
        if (++DoLog.logCount > 512) {
            console.clear();
            DoLog.logCount = 0;
        }

        // Get args
        let level, logContent, asObject;
        switch (arguments.length) {
            case 1:
                level = LogLevel.Info;
                logContent = arguments[0];
                asObject = false;
                break;
            case 2:
                level = arguments[0];
                logContent = arguments[1];
                asObject = false;
                break;
            case 3:
                level = arguments[0];
                logContent = arguments[1];
                asObject = arguments[2];
                break;
            default:
                level = LogLevel.Info;
                logContent = 'DoLog initialized.';
                asObject = false;
                break;
        }

        // Log when log level permits
        if (level <= DoLog.logLevel) {
            let msg = '%c' + LogLevelMap[level].prefix;
            let subst = LogLevelMap[level].color;

            if (asObject) {
                msg += ' %o';
            } else {
                switch(typeof(logContent)) {
                    case 'string': msg += ' %s'; break;
                    case 'number': msg += ' %d'; break;
                    case 'object': msg += ' %o'; break;
                }
            }

            console.log(msg, subst, logContent);
        }
    }
    DoLog();

	bypassXB();
	GM_PolyFill('default');

	// Inner consts with i18n
	const CONST = {
		Number: {
			Max_XHR: 20,
			MaxUrlLength: 4096
		},
		Text: {
			'zh-CN': {
				SavePage: '保存此网页',
				Saving: '保存中{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'zh-Hans': {
				SavePage: '保存此网页',
				Saving: '保存中{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'zh': {
				SavePage: '保存此网页',
				Saving: '保存中{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'zh-TW': {
				SavePage: '保存此網頁',
				Saving: '保存中{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'en-US': {
				SavePage: 'Save this webpage',
				Saving: 'Saving, please wait{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'en-UK': {
				SavePage: 'Save this webpage',
				Saving: 'Saving, please wait{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'en': {
				SavePage: 'Save this webpage',
				Saving: 'Saving, please wait{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			},
			'default': {
				SavePage: 'Save this webpage',
				Saving: 'Saving, please wait{A}',
				About: '<!-- Web Page Saved By {SCNM} Ver.{VRSN}, Author {ATNM} -->\n<!-- Page URL: {LINK} -->'
					.replaceAll('{SCNM}', GM_info.script.name)
					.replaceAll('{VRSN}', GM_info.script.version)
					.replaceAll('{ATNM}', GM_info.script.author)
					.replaceAll('{LINK}', location.href)
			}
		}
	}

	// Get i18n code
	let i18n = navigator.language;
	if (!Object.keys(CONST.Text).includes(i18n)) {i18n = 'default';}

	// XHRHOOK
	GMXHRHook(CONST.Number.Max_XHR);

	main()
	function main() {
		// GUI
		let button = GM_registerMenuCommand(CONST.Text[i18n].SavePage, onclick);
		const SAnime = new SavingAnime;
		SAnime.model = CONST.Text[i18n].Saving;
		SAnime.callback = function(text) {
			GM_unregisterMenuCommand(button);
			button = GM_registerMenuCommand(text, () => {});
		}

		function onclick() {
			SAnime.start();
			Generate_Single_File({
				onfinish: (FinalHTML) => {
					saveTextToFile(FinalHTML, 'SingleFile - {Title} - {Time}.html'.replace('{Title}', document.title).replace('{Time}', getTime('-', '-')));
					GM_unregisterMenuCommand(button);
					SAnime.stop();
					button = GM_registerMenuCommand(CONST.Text[i18n].SavePage, onclick);
				}
			});
		}

		function SavingAnime() {
			const SA = this;
			SA.model = '{A}';
			SA.time = 1000;
			SA.index = 0;
			SA.frames = ['...  ', ' ... ', '  ...', '.  ..', '..  .'];
			SA.callback = (frametext) => {console.log(frametext);};

			SA.nextframe = function() {
				SA.index++;
				SA.index > SA.frames.length-1 && (SA.index = 0);
				SA.callback(SA.model.replace('{A}', SA.frames[SA.index]));
				return true;
			};

			SA.start = function() {
				if (SA.interval) {return false;}
				SA.index = 0;
				SA.interval = setInterval(SA.nextframe, SA.time);
				return true;
			}

			SA.stop = function() {
				if (!SA.interval) {return false;}
				clearInterval(SA.interval);
				SA.interval = 0;
				return true;
			}
		};
	}

	function Generate_Single_File(details) {
		// Init DOM
		const html = document.querySelector('html').outerHTML;
		const dom = (new DOMParser()).parseFromString(html, 'text/html');

		// Functions
		const _J = (args) => {const a = []; for (let i = 0; i < args.length; i++) {a.push(args[i]);}; return a;};
		const $ = function() {return dom.querySelector.apply(dom, _J(arguments))};
		const $_ = function() {return dom.querySelectorAll.apply(dom, _J(arguments))};
		const $C = function() {return dom.createElement.apply(dom, _J(arguments))};
		const $A = (a,b) => (a.appendChild(b));
		const $I = (a,b) => (b.parentElement ? b.parentElement.insertBefore(a, b) : null);
		const $R = (e) => (e.parentElement ? e.parentElement.removeChild(e) : null);
		const ishttp = (s) => (!/^[^\/:]*:/.test(s) || /^https?:\/\//.test(s));
		const ElmProps = new (function() {
			const props = this.props = {};
			const cssMap = this.cssMap = new Map();

			this.getCssPath = function(elm) {
				return cssMap.get(elm) || (cssMap.set(elm, cssPath(elm)), cssMap.get(elm));
			}

			this.add = function(elm, type, value) {
				const path = cssPath(elm);
				const EPList = props[path] = props[path] || [];
				const EProp = {};
				EProp.type = type;
				EProp.value = value;
				EPList.push(EProp);
			}
		});

		// Hook GM_xmlhttpRequest
		const AM = new AsyncManager();
		AM.onfinish = function() {
			// Add applyProps script
			const script = $C('script');
			script.innerText = "window.addEventListener('load', function(){({FUNC})({PROPS});})"
				.replace('{PROPS}', JSON.stringify(ElmProps.props))
				.replace('{FUNC}', `function(c){const funcs={Canvas:{DataUrl:function(a,b){const img=new Image();const ctx=a.getContext('2d');img.onload=()=>{ctx.drawImage(img,0,0)};img.src=b}},Input:{Value:function(a,b){a.value=b}}};for(const[cssPath,propList]of Object.entries(c)){const elm=document.querySelector(cssPath);for(const prop of propList){const type=prop.type;const value=prop.value;const funcPath=type.split('.');let func=funcs;for(let i=0;i<funcPath.length;i++){func=func[funcPath[i]]}func(elm,value)}}}`);
			$A(dom.head, script);

			// Generate html
			const FinalHTML = '{ABOUT}\n\n{HTML}'.replace('{ABOUT}', CONST.Text[i18n].About).replace('{HTML}', dom.querySelector('html').outerHTML)

			DoLog(LogLevel.Success, 'Single File Generation Complete.')
			DoLog([dom, FinalHTML]);
			details.onfinish(FinalHTML)
		};

		// Change document.characterSet to utf8
		DoLog('SingleFile: Setting charset');
		if (document.characterSet !== 'UTF-8') {
			const meta = $('meta[http-equiv="Content-Type"][content*="charset"]');
			meta && (meta.content = meta.content.replace(/charset\s*=\s*[^;\s]*/i, 'charset=UTF-8'));
		}

		// Clear scripts
		DoLog('SingleFile: Clearing scripts');
		for (const script of $_('script')) {
			$R(script);
		}

		// Clear inline-scripts
		DoLog('SingleFile: Clearing inline scripts');
		for (const elm of $_('*')) {
			const ISKeys = ['onabort', 'onerror', 'onresize', 'onscroll', 'onunload', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onbegin', 'onend', 'onrepeat'];
			for (const key of ISKeys) {
				elm.removeAttribute(key);
				elm[key] = undefined;
			}
		}

		// Clear preload-scripts
		DoLog('SingleFile: Clearing preload scripts');
		for (const link of $_('link[rel*=modulepreload]')) {
			$R(link);
		}

		// Remove "Content-Security-Policy" meta header
		DoLog('SingleFile: Removing "Content-Security-Policy" meta headers');
		for (const m of $_('meta[http-equiv="Content-Security-Policy"]')) {
			$R(m);
		}

		// Deal styles
		/*
		DoLog('SingleFile: Dealing linked stylesheets');
		for (const link of $_('link[rel="stylesheet"]')) {
			if (!link.href) {continue;}
			const href = link.href;
			AM.add();
			requestText(href, (t, l) => {
				const s = $C('style');
				s.innerText = t;
				$I(s, l);
				$R(l);
				AM.finish();
			}, link);
		}
		*/

		// Deal Style url(http) links
		DoLog('SingleFile: Dealing style urls');
		for (const link of $_('link[rel*=stylesheet][href]')) {
			dealLinkedStyle(link)
		}
		for (const elm of $_('style')) {
			elm.innerText && dealStyle(elm.innerText, (style, elm) => (elm.innerHTML = style), elm);
		}

		// Deal <link>s
		DoLog('SingleFile: Dealing links');
		for (const link of $_('link[href]')) {
			// Only deal http[s] links
			if (!link.href) {continue;}
			if (!ishttp(link.href)) {continue;}

			// Only deal links that rel includes one of the following:
			//   icon, apple-touch-icon, apple-touch-startup-image, prefetch, preload, prerender, manifest, stylesheet
			// And in the same time NOT includes any of the following:
			//   alternate
			let deal = false;
			const accepts = ['icon', 'apple-touch-icon', 'apple-touch-startup-image', 'prefetch', 'preload', 'prerender', 'manifest', 'stylesheet'];
			const excludes = ['alternate']
			const rels = link.rel.split(' ');
			for (const rel of rels) {
				deal = deal || (accepts.includes(rel) && !excludes.includes(rel));
			}
			if (!deal) {continue;}

			// Save original href to link.ohref
			link.ohref = link.href;

			AM.add();
			requestDataURL(link.href, function(durl, link) {
				link.href = durl;

				// Deal style if links to a stylesheet
				if (rels.includes('stylesheet')) {
					dealLinkedStyle(link);
				}
				AM.finish();
			}, link);
		}

		// Deal images' and sources' src
		DoLog('SingleFile: Dealing images\' & sources\' src');
		for (const img of $_('img[src], source[src]')) {
			// Get full src
			if (img.src.length > CONST.Number.MaxUrlLength) {continue;}
			if (!img.src) {continue;}
			if (!ishttp(img.src)) {continue;}
			const src = fullurl(img.src);

			// Get original img element
			const path = ElmProps.getCssPath(img);
			const oimg = document.querySelector(path);

			// Get data url
			let url;
			try {
				if (!oimg.complete) {throw new Error();}
				url = img2url(oimg);
				img.src = url;
			} catch (e) {
				if (img.src) {
					AM.add();
					requestDataURL(src, (url) => {
						img.src = url;
						AM.finish();
					});
				}
			}
		}

		// Deal images' and sources' srcset
		DoLog('SingleFile: Dealing images\' & sources\' srcset');
		for (const img of $_('img[srcset], source[srcset]')) {
			// Check if empty
			if (!img.srcset) {continue;}

			// Get all srcs list
			const list = img.srcset.split(',');
			for (let i = 0; i < list.length; i++) {
				const srcitem = list[i].trim();
				if (srcitem.length > CONST.Number.MaxUrlLength) {continue;}
				if (!srcitem) {continue}
				const parts = srcitem.replaceAll(/(\s){2,}/g, '$1').split(' ');
				if (!ishttp(parts[0])) {continue};
				const src = fullurl(parts[0]);

				list[i] = {
					src: src,
					rest: parts.slice(1, parts.length).join(' '),
					parts: parts,
					dataurl: null,
					string: null
				};
			}

			// Get all data urls into list
			const S_AM = new AsyncManager();
			const dlist = [];
			S_AM.onfinish = function() {
				img.srcset = dlist.join(',');
				AM.finish();
			}
			AM.add();
			for (const srcobj of list) {
				S_AM.add();
				requestDataURL(srcobj.src, (url, srcobj) => {
					srcobj.dataurl = url;
					srcobj.string = [srcobj.dataurl, srcobj.rest].join(' ');
					dlist.push(srcobj.string);
					S_AM.finish();
				}, srcobj);
			}
			S_AM.finishEvent = true;
		}

		// Deal canvases
		DoLog('SingleFile: Dealing canvases');
		for (const cvs of $_('canvas')) {
			let url;
			try {
				url = img2url(cvs);
				ElmProps.add(cvs, 'Canvas.DataUrl', url);
			} catch (e) {}
		}

		// Deal background-images
		DoLog('SingleFile: Dealing background-images');
		for (const elm of $_('*')) {
			const urlReg = /^\s*url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)\s*$/;
			const bgImage = elm.style.backgroundImage;
			if (!bgImage) {continue;}
			if (bgImage.length > CONST.Number.MaxUrlLength) {continue;}
			if (bgImage === 'url("https://images.weserv.nl/?url=https://ae01.alicdn.com/kf/H3bbe45ee0a3841ec9644e1ea9aa157742.jpg")') {debugger;}
			if (bgImage && urlReg.test(bgImage)) {
				// Get full image url
				let url = bgImage.match(urlReg)[1];
				if (/^data:/.test(url)) {continue;}
				url = fullurl(url);

				// Get image
				AM.add();
				requestDataURL(url, function(durl, elm) {
					elm.style.backgroundImage = 'url({U})'.replace('{U}', durl);
					AM.finish();
				}, elm);
			}
		}

		// Deal input/textarea/progress values
		DoLog('SingleFile: Dealing values');
		for (const elm of $_('input,textarea,progress')) {
			// Query origin element's value
			const cssPath = ElmProps.getCssPath(elm);
			const oelm = document.querySelector(cssPath);

			// Add to property map
			oelm.value && ElmProps.add(elm, 'Input.Value', oelm.value);
		}

		// Get favicon.ico if no icon found
		DoLog('SingleFile: Dealing favicon.ico');
		if (!$('link[rel*=icon]')) {
			const I_AM = new AsyncManager();
			GM_xmlhttpRequest({
				method: 'GET',
				url: getHost() + 'favicon.ico',
				responseType: 'blob',
				onload: (e) => {
					if (e.status >= 200 && e.status < 300) {
						blobToDataURL(e.response, (durl) => {
							const icon = $C('link');
							icon.rel = 'icon';
							icon.href = durl;
							$A(dom.head, icon);
						});
					}
					I_AM.finish();
				}
			})
		}

		// Start generating the finish event
		DoLog('SingleFile: Waiting for async tasks to be finished');
		AM.finishEvent = true;

		function dealStyle(style, callback, args=[]) {
			const re = /url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)/;
			const rg = /url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)/g;
			const replace = (durl, urlexp, arg1, arg2, arg3) => {
				// Replace style text
				const durlexp = 'url("{D}")'.replace('{D}', durl);
				style = style.replaceAll(urlexp, durlexp);

				// Get args
				const args = [style];
				for (let i = 2; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				callback.apply(null, args);
				AM.finish();
			};

			const all = style.match(rg);
			if (!all) {return;}
			for (const urlexp of all) {
				// Check url
				if (urlexp.length > CONST.Number.MaxUrlLength) {continue;}
				const osrc = urlexp.match(re)[1];
				const baseurl = args instanceof HTMLLinkElement && args.ohref ? args.ohref : location.href;
				if (!ishttp(osrc)) {continue;}
				const src = fullurl(osrc, baseurl);

				// Request
				AM.add();
				requestDataURL(src, replace, [urlexp].concat(args));
			}
		}
		function dealLinkedStyle(link) {
			if (!link.href || !/^data:/.test(link.href)) {return;}
			const durl = link.href;
			const blob = dataURLToBlob(durl);
			const reader = new FileReader();
			reader.onload = () => {
				dealStyle(reader.result, (style, link) => {
					const blob = new Blob([style],{type:"text/css"});
					AM.add();
					blobToDataURL(blob, function(durl, link) {
						link.href = durl;
						AM.finish();
					}, link)
				}, link);
				AM.finish();
			}
			AM.add();
			reader.readAsText(blob);
		}
	}

	// This function is expected to be used on output html
	function applyProps(props) {
		const funcs = {
			Canvas: {
				DataUrl: function(elm, value) {
					const img = new Image();
					const ctx = elm.getContext('2d');
					img.onload = () => {ctx.drawImage(img, 0, 0);};
					img.src = value;
				}
			},
			Input: {
				Value: function(elm, value) {
					elm.value = value;
				}
			}
		};

		for (const [cssPath, propList] of Object.entries(props)) {
			const elm = document.querySelector(cssPath);
			for (const prop of propList) {
				const type = prop.type;
				const value = prop.value;

				// Get function
				const funcPath = type.split('.');
				let func = funcs;
				for (let i = 0; i < funcPath.length; i++) {
					func = func[funcPath[i]];
				}

				// Call function
				func(elm, value);
			}
		}
	}

	function fullurl(url, baseurl=location.href) {
		if (/^\/{2,}/.test(url)) {url = location.protocol + url;}
		if (!/^https?:\/\//.test(url)) {
			const base = baseurl.replace(/(.+\/).*?$/, '$1');;
			const a = document.createElement('a');
			a.href = base + url;
			url = a.href;
		}
		return url;
	}

	function cssPath(el) {
		if (!(el instanceof Element)) return;
		var path = [];
		while (el.nodeType === Node.ELEMENT_NODE) {
			var selector = el.nodeName.toLowerCase();
			if (el.id) {
				selector += '#' + el.id;
				path.unshift(selector);
				break;
			} else {
				var sib = el,
					nth = 1;
				while (sib = sib.previousElementSibling) {
					if (sib.nodeName.toLowerCase() == selector) nth++;
				}
				if (nth != 1) selector += ":nth-of-type(" + nth + ")";
			}
			path.unshift(selector);
			el = el.parentNode;
		}
		return path.join(" > ");
	}

	function requestText(url, callback, args=[]) {
		GM_xmlhttpRequest({
            method:       'GET',
            url:          url,
            responseType: 'text',
            onload:       function(response) {
                const text = response.responseText;
				const argvs = [text].concat(args);
                callback.apply(null, argvs);
            }
        })
	}

	function requestDataURL(url, callback, args=[]) {
		GM_xmlhttpRequest({
            method:       'GET',
            url:          url,
            responseType: 'blob',
            onload:       function(response) {
                const blob = response.response;
				blobToDataURL(blob, function(url) {
					const argvs = [url].concat(args);
					callback.apply(null, argvs);
				})
            }
        })
	}

	function blobToDataURL(blob, callback, args=[]) {
		const reader = new FileReader();
		reader.onload = function () {
			callback.apply(null, [reader.result].concat(args));
		}
		reader.readAsDataURL(blob);
	}

	function dataURLToBlob(dataurl) {
		let arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new Blob([u8arr], { type: mime })
	}

	function XHRFinisher() {
		const XHRF = this;

		// Ongoing xhr count
		this.xhrCount = 0;

		// Whether generate finish events
		this.finishEvent = false;

		// Original xhr
		this.GM_xmlhttpRequest = GM_xmlhttpRequest;

		// xhr provided for outer scope
		GM_xmlhttpRequest = function(details) {
			DoLog('XHRFinisher: Requesting ' + details.url);

			// Hook functions that will be called when xhr stops
			details.onload = wrap(details.onload)
			details.ontimeout = wrap(details.ontimeout)
			details.onerror = wrap(details.onerror)
			details.onabort = wrap(details.onabort)

			// Count increase
			XHRF.xhrCount++;

			// Start xhr
			XHRF.GM_xmlhttpRequest(details);

			function wrap(ofunc) {
				return function(e) {
					DoLog('XHRFinisher: Request ' + details.url + ' finish. ' + (XHRF.xhrCount-1).toString() + ' requests rest. ');
					ofunc(e);
					--XHRF.xhrCount === 0 && XHRF.finishEvent && XHRF.onfinish && XHRF.onfinish();
				}
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

	function img2url(img) {
		const cvs = document.createElement('canvas');
		const ctx = cvs.getContext('2d');
		cvs.width = img.width;
		cvs.height = img.height;
		ctx.drawImage(img, 0, 0)
		return cvs.toDataURL();
	}

	// Get a time text like 1970-01-01 00:00:00
	// if dateSpliter provided false, there will be no date part. The same for timeSpliter.
    function getTime(dateSpliter='-', timeSpliter=':') {
        const d = new Date();
		let fulltime = ''
		fulltime += dateSpliter ? fillNumber(d.getFullYear(), 4) + dateSpliter + fillNumber((d.getMonth() + 1), 2) + dateSpliter + fillNumber(d.getDate(), 2) : '';
		fulltime += dateSpliter && timeSpliter ? ' ' : '';
		fulltime += timeSpliter ? fillNumber(d.getHours(), 2) + timeSpliter + fillNumber(d.getMinutes(), 2) + timeSpliter + fillNumber(d.getSeconds(), 2) : '';
        return fulltime;
    }

	// Just stopPropagation and preventDefault
	function destroyEvent(e) {
		if (!e) {return false;};
		if (!e instanceof Event) {return false;};
		e.stopPropagation();
		e.preventDefault();
	}

	// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
	// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
	// (If the request is invalid, such as url === '', will return false and will NOT make this request)
	// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
	// Requires: function delItem(){...} & function uniqueIDMaker(){...}
	function GMXHRHook(maxXHR=5) {
		const GM_XHR = GM_xmlhttpRequest;
		const getID = uniqueIDMaker();
		let todoList = [], ongoingList = [];
		GM_xmlhttpRequest = safeGMxhr;

		function safeGMxhr() {
			// Get an id for this request, arrange a request object for it.
			const id = getID();
			const request = {id: id, args: arguments, aborter: null};

			// Deal onload function first
			dealEndingEvents(request);

			/* DO NOT DO THIS! KEEP ITS ORIGINAL PROPERTIES!
			// Stop invalid requests
			if (!validCheck(request)) {
				return false;
			}
			*/

			// Judge if we could start the request now or later?
			todoList.push(request);
			checkXHR();
			return makeAbortFunc(id);

			// Decrease activeXHRCount while GM_XHR onload;
			function dealEndingEvents(request) {
				const e = request.args[0];

				// onload event
				const oriOnload = e.onload;
				e.onload = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnload ? oriOnload.apply(null, arguments) : function() {};
				}

				// onerror event
				const oriOnerror = e.onerror;
				e.onerror = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnerror ? oriOnerror.apply(null, arguments) : function() {};
				}

				// ontimeout event
				const oriOntimeout = e.ontimeout;
				e.ontimeout = function() {
					reqFinish(request.id);
					checkXHR();
					oriOntimeout ? oriOntimeout.apply(null, arguments) : function() {};
				}

				// onabort event
				const oriOnabort = e.onabort;
				e.onabort = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnabort ? oriOnabort.apply(null, arguments) : function() {};
				}
			}

			// Check if the request is invalid
			function validCheck(request) {
				const e = request.args[0];

				if (!e.url) {
					return false;
				}

				return true;
			}

			// Call a XHR from todoList and push the request object to ongoingList if called
			function checkXHR() {
				if (ongoingList.length >= maxXHR) {return false;};
				if (todoList.length === 0) {return false;};
				const req = todoList.shift();
				const reqArgs = req.args;
				const aborter = GM_XHR.apply(null, reqArgs);
				req.aborter = aborter;
				ongoingList.push(req);
				return req;
			}

			// Make a function that aborts a certain request
			function makeAbortFunc(id) {
				return function() {
					let i;

					// Check if the request haven't been called
					for (i = 0; i < todoList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: haven't been called
							delItem(todoList, i);
							return true;
						}
					}

					// Check if the request is running now
					for (i = 0; i < ongoingList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: running now
							req.aborter();
							reqFinish(id);
							checkXHR();
						}
					}

					// Oh no, this request is already finished...
					return false;
				}
			}

			// Remove a certain request from ongoingList
			function reqFinish(id) {
				let i;
				for (i = 0; i < ongoingList.length; i++) {
					const req = ongoingList[i];
					if (req.id === id) {
						ongoingList = delItem(ongoingList, i);
						return true;
					}
				}
				return false;
			}
		}
	}

	function parseDocument(htmlblob, callback, args=[]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const htmlText = reader.result;
			const dom = new DOMParser().parseFromString(htmlText, 'text/html');
			args = [dom].concat(args);
			callback.apply(null, args);
			//callback(dom, htmlText);
		}
		reader.readAsText(htmlblob, 'GBK');
	}

	// Get a url argument from lacation.href
	// also recieve a function to deal the matched string
	// returns defaultValue if name not found
    // Args: name, dealFunc=(function(a) {return a;}), defaultValue=null
	function getUrlArgv(details) {
        typeof(details) === 'string'    && (details = {name: details});
        typeof(details) === 'undefined' && (details = {});
        if (!details.name) {return null;};

        const url = details.url ? details.url : location.href;
        const name = details.name ? details.name : '';
        const dealFunc = details.dealFunc ? details.dealFunc : ((a)=>{return a;});
        const defaultValue = details.defaultValue ? details.defaultValue : null;
		const matcher = new RegExp(name + '=([^&]+)');
		const result = url.match(matcher);
		const argv = result ? dealFunc(result[1]) : defaultValue;

		return argv;
	}

	// Append a style text to document(<head>) with a <style> element
    function addStyle(css, id) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        document.head.appendChild(style);
    }

	function saveTextToFile(text, name) {
		const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	// File download function
	// details looks like the detail of GM_xmlhttpRequest
	// onload function will be called after file saved to disk
	function downloadFile(details) {
		if (!details.url || !details.name) {return false;};

		// Configure request object
		const requestObj = {
			url: details.url,
			responseType: 'blob',
			onload: function(e) {
				// Save file
				saveFile(URL.createObjectURL(e.response), details.name);

				// onload callback
				details.onload ? details.onload(e) : function() {};
			}
		}
		if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
		if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
		if (details.onerror           ) {requestObj.onerror            = details.onerror;};
		if (details.onabort           ) {requestObj.onabort            = details.onabort;};
		if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
		if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

		// Send request
		GM_xmlhttpRequest(requestObj);
	}

	// get '/' splited API array from a url
	function getAPI(url=location.href) {
		return url.replace(/https?:\/\/(.*?\.){1,2}.*?\//, '').replace(/\?.*/, '').match(/[^\/]+?(?=(\/|$))/g);
	}

	// get host part from a url(includes '^https://', '/$')
	function getHost(url=location.href) {
		const match = location.href.match(/https?:\/\/[^\/]+\//);
		return match ? match[0] : match;
	}

    // Your code here...
	// Bypass xbrowser's useless GM_functions
	function bypassXB() {
		if (typeof(mbrowser) === 'object') {
			window.unsafeWindow = window.GM_setClipboard = window.GM_openInTab = window.GM_xmlhttpRequest = window.GM_getValue = window.GM_setValue = window.GM_listValues = window.GM_deleteValue = undefined;
		}
	}

    // GM_Polyfill By PY-DNG
	// 2021.07.18 - 2021.07.19
	// Simply provides the following GM_functions using localStorage, XMLHttpRequest and window.open:
	// Returns object GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled:
	// GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, unsafeWindow(object)
	// All polyfilled GM_functions are accessable in window object/Global_Scope(only without Tempermonkey Sandboxing environment)
	function GM_PolyFill(name='default') {
		const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
		let GM_POLYFILL_storage;
		const GM_POLYFILLED = {
			GM_setValue: true,
			GM_getValue: true,
			GM_deleteValue: true,
			GM_listValues: true,
			GM_xmlhttpRequest: true,
			GM_openInTab: true,
			GM_setClipboard: true,
			unsafeWindow: true,
			once: false
		}

		// Ignore GM_PolyFill_Once
		window.GM_POLYFILLED && window.GM_POLYFILLED.once && (window.unsafeWindow = window.GM_setClipboard = window.GM_openInTab = window.GM_xmlhttpRequest = window.GM_getValue = window.GM_setValue = window.GM_listValues = window.GM_deleteValue = undefined);

		GM_setValue_polyfill();
		GM_getValue_polyfill();
		GM_deleteValue_polyfill();
		GM_listValues_polyfill();
		GM_xmlhttpRequest_polyfill();
		GM_openInTab_polyfill();
		GM_setClipboard_polyfill();
		unsafeWindow_polyfill();

		function GM_POLYFILL_getStorage() {
			let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
			gstorage = gstorage ? JSON.parse(gstorage) : {};
			let storage = gstorage[name] ? gstorage[name] : {};
			return storage;
		}

		function GM_POLYFILL_saveStorage() {
			let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
			gstorage = gstorage ? JSON.parse(gstorage) : {};
			gstorage[name] = GM_POLYFILL_storage;
			localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
		}

		// GM_setValue
		function GM_setValue_polyfill() {
			typeof (GM_setValue) === 'function' ? GM_POLYFILLED.GM_setValue = false: window.GM_setValue = PF_GM_setValue;;

			function PF_GM_setValue(name, value) {
				GM_POLYFILL_storage = GM_POLYFILL_getStorage();
				name = String(name);
				GM_POLYFILL_storage[name] = value;
				GM_POLYFILL_saveStorage();
			}
		}

		// GM_getValue
		function GM_getValue_polyfill() {
			typeof (GM_getValue) === 'function' ? GM_POLYFILLED.GM_getValue = false: window.GM_getValue = PF_GM_getValue;

			function PF_GM_getValue(name, defaultValue) {
				GM_POLYFILL_storage = GM_POLYFILL_getStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			}
		}

		// GM_deleteValue
		function GM_deleteValue_polyfill() {
			typeof (GM_deleteValue) === 'function' ? GM_POLYFILLED.GM_deleteValue = false: window.GM_deleteValue = PF_GM_deleteValue;

			function PF_GM_deleteValue(name) {
				GM_POLYFILL_storage = GM_POLYFILL_getStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
					GM_POLYFILL_saveStorage();
				}
			}
		}

		// GM_listValues
		function GM_listValues_polyfill() {
			typeof (GM_listValues) === 'function' ? GM_POLYFILLED.GM_listValues = false: window.GM_listValues = PF_GM_listValues;

			function PF_GM_listValues() {
				GM_POLYFILL_storage = GM_POLYFILL_getStorage();
				return Object.keys(GM_POLYFILL_storage);
			}
		}

		// unsafeWindow
		function unsafeWindow_polyfill() {
			typeof (unsafeWindow) === 'object' ? GM_POLYFILLED.unsafeWindow = false: window.unsafeWindow = window;
		}

		// GM_xmlhttpRequest
		// not supported properties of details: synchronous binary nocache revalidate context fetch
		// not supported properties of response(onload arguments[0]): finalUrl
		// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
		function GM_xmlhttpRequest_polyfill() {
			typeof (GM_xmlhttpRequest) === 'function' ? GM_POLYFILLED.GM_xmlhttpRequest = false: window.GM_xmlhttpRequest = PF_GM_xmlhttpRequest;

			// details.synchronous is not supported as Tempermonkey
			function PF_GM_xmlhttpRequest(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			}
		}

		// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
		function GM_openInTab_polyfill() {
			typeof (GM_openInTab) === 'function' ? GM_POLYFILLED.GM_openInTab = false: window.GM_openInTab = PF_GM_openInTab;

			function PF_GM_openInTab(url) {
				window.open(url);
			}
		}

		// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
		function GM_setClipboard_polyfill() {
			typeof (GM_setClipboard) === 'function' ? GM_POLYFILLED.GM_setClipboard = false: window.GM_setClipboard = PF_GM_setClipboard;

			function PF_GM_setClipboard(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			}
		}

		return GM_POLYFILLED;
	}

	// Makes a function that returns a unique ID number each time
	function uniqueIDMaker() {
		let id = 0;
		return makeID;
		function makeID() {
			id++;
			return id;
		}
	}

	// Fill number text to certain length with '0'
    function fillNumber(number, length) {
        let str = String(number);
        for (let i = str.length; i < length; i++) {
            str = '0' + str;
        }
        return str;
    }

	// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
	function delItem(arr, delIndex) {
		arr = arr.slice(0, delIndex).concat(arr.slice(delIndex+1));
		return arr;
	}
})();