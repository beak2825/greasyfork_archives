// ==UserScript==
// @name                    SingleFile Pure - Pure html downloader
// @name:zh                 SingleFile Pure - 保存纯HTML
// @namespace               https://gist.github.com/KnIfER
// @version                 3
// @description             将当前网页保存为一个纯文本的.html网页文件，不保存二进制
// @description:en          Save webpages into one pure html file, without binary data.
// @author                  PY-DNG
// @license                 MIT
// @grant                   GM_registerMenuCommand
// @grant                   GM_unregisterMenuCommand
// @grant                   unsafeWindow
// @icon                    data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE5MCIgaGVpZ2h0PSIxOTAiPgo8c3R5bGU+LnB7ZmlsbDojMjY4NGZjfTwvc3R5bGU+CjxwYXRoIGNsYXNzPSJwIiBkPSJtMTU5IDUydjEzMWwtMTMwIDB2LTE3Nmw4NiAwbS00My41IDU1LjVjMCAxMC4yLjEgMTAuNSAyIDEwIDEtMCA1LjYtMSA5LjUtMiA0LTEgOC0xLjUgOS0xLjUgMiAwIDIgMSAyIDM2LjV2MzYuNWgtMjF2MTBoNTN2LTEwbC0yMC41LS41LS41LTgzLjVjLTEyIDAtMjAgMS0yNSAyLjR6Ii8+Cjwvc3ZnPg==
// @match                   *://*/*
// @include                 *
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/478707/SingleFile%20Pure%20-%20Pure%20html%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/478707/SingleFile%20Pure%20-%20Pure%20html%20downloader.meta.js
// ==/UserScript==

// based on @PY-DNG https://greasyfork.org/zh-CN/scripts/419798-singlefile-单文件保存网页

(function() { 
	'use strict';
	function debug(...args) {
		console.log("%c SingleFile: ", "color:#333!important;background:#0FF;", ...args);
	}

	var win = window.unsafeWindow || window, doc=document, d=doc
	, bank=win._sfpr_bank;
	var rM=debug, rMd=debug, err=console.error;
	if(!bank) {
		bank = win._sfpr_bank = {};
		rM = GM_registerMenuCommand;
		rMd = GM_unregisterMenuCommand;
	} else try{
		bank.unreg();
	} catch(e){debug(e)}
	bank.unreg = uninstall;var unregs = [];
	
	function uninstall() { // hot-reload
		for(var i=0;i<unregs.length;i++) {
			unregs[i]();
		}
		return 1;
	}
	
	function addEvent(a, b, c, d) {
		if(!d) d = win;
		((a, b, c, d)=>{
			d.addEventListener(a, b, c);
			unregs.push(function(){ d.removeEventListener(a, b, c)} );
		})(a, b, c, d);
	}
	
	const MSG = {
		'zh': {
			SavePage: '保存纯网页',
			Saving: '保存中……'
		},
		'en': {
			SavePage: 'Save pure webpage',
			Saving: 'Saving, please wait……'
		},
	}
	var btn, evtSt="single-file-on-before-capture-request", evtEd=evtSt.replace('before', 'after');
	addEvent(evtSt, (e) => {
		btn = doc.getElementById('sf-pure');
		if(btn) btn.remove();
	});
	addEvent(evtEd, (e) => {
		if(btn) {
			doc.body.append(btn);
			btn = 0;
		}
	});
	
	var t = navigator.language;
	if(t.includes('-')) t = t.slice(0, t.indexOf('-'));
	

	// GUI
	var GT=MSG[t]||MSG['en'], fnMenu, menu = rM(GT.SavePage, fnMenu = function() {
		Generate_Single_File({
			onfinish: (FinalHTML) => {
				var title = doc.title;
				saveTextToFile(FinalHTML, '{Title}.html'.replace('{Title}', title).replace('{Time}', getTime('-', '-')));
				dispatchEvent(new CustomEvent(evtEd));
				rMd(menu);
				menu = rM(GT.SavePage, fnMenu);
			}
		});
	});
	
	addEvent("single-file-pure-save", (e) => {
		fnMenu();
		stop(e);
	});
	
	if(!win.saveAsTaken)
		addEvent('keydown', (e) => {
			if(e.key=='s' && e.altKey && e.ctrlKey) {
				fnMenu();
				stop(e);
			}
		});
	
		
	function Generate_Single_File(details) {
		debug('Generate started...');
		if(!bank.init) {
			dispatchEvent(new CustomEvent("single-file-user-script-init"));
			bank.init = 1;
		}
		dispatchEvent(new CustomEvent(evtSt));
		// Init DOM
		var html, tmp, dom = doc;

		// Functions
		var _J = (args) => {const a = []; for (let i = 0; i < args.length; i++) {a.push(args[i]);}; return a;};
		var $ = function() {return dom.querySelector.apply(dom, _J(arguments))};
		var $_ = function() {return dom.querySelectorAll.apply(dom, _J(arguments))};
		var $C = function() {return dom.createElement.apply(dom, _J(arguments))};
		var $A = (a,b) => (a.appendChild(b));
		var $R = (e) => (e.parentElement ? e.parentElement.removeChild(e) : null);
		function ishttp(s) {
			// !/^[^\/:]*:/.test(s)
			if(s) return  s.startsWith('/') || s.startsWith('http')
		}
		dom = doc.cloneNode(1);
		
		const ElmProps = new (function() {
			const props = this.props = {};
			const cssMap = this.cssMap = new Map();
			this.getCssPath = function(elm) {
				return cssMap.get(elm) || (cssMap.set(elm, cssPath(elm)), cssMap.get(elm));
			}
			this.add = function(elm, type, value) {
				var path = cssPath(elm), store=props[path];
				if(!store) store = props[path] = [];
				store.push({type:type, value:value});
			}
		});
		
		 // Generate info button!
		function about() {
			var t=$C('A');
			t.id = 'sf-pure';
			t.style = 'position:fixed;right:16px;top:16px;width:24px;height:24px;color:#2d2d2d;background-color:#737373;border:2px solid;border-color:#eee;border-radius:16px;z-index:2147483647;opacity:0.7;display:flex;justify-content:center;align-items:center;';
			t.innerHTML = '<svg style=\'width:65%;height:65%;margin-left:1px;\' xmlns="http://www.w3.org/2000/svg"viewBox="0 0 64 64"width="64"height="64"><style>.p{fill:#f0f0f0}</style><path class="p"d="M30 3A3 3 0 1130 21 3 3 0 1130 3ZM16 25 23 29 23 58 16 63 46 63 39 58 39 25Z"/></svg>';
			t.name = Date.now()+'';
			t.title = doc.title;
			t.href = location.ohref || location.href;
			t.target = 'blank';
			return t;
		}

		const AM = new AsyncManager();
		AM.onfinish = function() {
			// Add applyProps script
			var script = $C('script');
			script.innerHTML = "window.addEventListener('load', function(){"+
				// show info button
				"setTimeout(function(){var btn=document.getElementById('sf-pure');btn.title=new Date(parseInt(btn.name))+'\\n\\n'+btn.title;location.ohref=btn.href;btn.oncontextmenu=function(e){btn.style.display='none';e.preventDefault()}}, 800);"
				+
				// {FUNC}
				"(function(c){var fs={Canvas_DataUrl:function(a,b){var e=new Image(),v=a.getContext('2d');e.onload=function(){v.drawImage(e,0,0)};e.src=b},Input_Value:function(a,b){a.value=b}};for(var i=0,arr=Object.entries(c),t,el;i<arr.length;i++){try{t=arr[i];if(el=document.querySelector(t[0]))for(var p of t[1])fs[p.type](el,p.value)}catch(e){console.error(e)}}}"
				+")("+ 
				// {PROPS}
				JSON.stringify(ElmProps.props)
				+")})";
			$A(dom.head, script);
			$A(dom.body, about());
			// Generate html
			var FinalHTML = dom.querySelector('html').outerHTML;
			debug('Generation Complete.', FinalHTML.length)
			details.onfinish(FinalHTML)
		};

		// debug('Setting charset');
		if (doc.characterSet !== 'UTF-8') {
			const meta = $('meta[http-equiv="Content-Type"][content*="charset"]');
			meta && (meta.content = meta.content.replace(/charset\s*=\s*[^;\s]*/i, 'charset=UTF-8'));
		}

		// debug('strip scripts');
		for (var tmp of $_('script')) {
			$R(tmp);
		}

		// debug('strip inline scripts');
		for (var tmp of $_('*')) {
			var ISKeys = ['onabort', 'onerror', 'onresize', 'onscroll', 'onunload', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onbegin', 'onend', 'onrepeat'];
			for (var key of ISKeys) {
				tmp.removeAttribute(key);
				tmp[key] = undefined;
			}
		}

		// debug('strip preload scripts');
		for (var tmp of $_('link[rel*=modulepreload]')) {
			$R(tmp);
		}

		// debug('strip meta headers');
		for (var tmp of $_('meta[http-equiv="Content-Security-Policy"]')) {
			$R(tmp);
		}

		//debug('Resolve style urls');
		for (var tmp of $_('link[rel*=stylesheet][href]')) {
			resolveStyleLinked(tmp)
		}
		for (var elm of $_('style')) {
			//debug('style elm=', elm.id, elm)
			resolveStyle(elm.innerText, (style, elm) => (elm.innerHTML = style), elm);
		}

		//debug('Resolve links');
		for (const link of $_('link[href]')) {
			// Only for http[s] links
			if (!link.href) {continue;}
			if (!ishttp(link.href)) {continue;}

			// Only for links that rel includes one of the following:
			//   icon, apple-touch-icon, apple-touch-startup-image, prefetch, preload, prerender, manifest, stylesheet
			// And in the same time NOT includes any of the following:
			//   alternate
			var deal = false;
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
					resolveStyleLinked(link);
				}
				AM.finish();
			}, link);
		}
		var arr = dom.links;
		for(var i=0;tmp=arr[i++];) {
			tmp.href = fullUrl(tmp.href);
		}

		//debug('Resolve image src');
		for (var img of $_('img[src], source[src]')) {
			// Get full src
			// if (img.src.length > 3999) {continue;}
			if (!img.src) {continue;}
			if (!ishttp(img.src)) {continue;}
			img.src = fullUrl(img.src);
		}

		//debug('Resolve image srcset');
		for (var img of $_('img[srcset], source[srcset]')) {
			if (img.srcset) {
				var list = img.srcset.split(',');
				for (let i = 0; i < list.length; i++) { // Get all srcs list
					var srcitem = list[i].trim();
					if (srcitem.length > 3999) {continue;}
					if (!srcitem) {continue}
					var parts = srcitem.replaceAll(/(\s){2,}/g, '$1').split(' ');
					if (!ishttp(parts[0])) {continue};
					var src = fullUrl(parts[0]);
					list[i] = {
						src: src,
						rest: parts.slice(1, parts.length).join(' '),
						parts: parts,
						dataurl: null,
						string: null
					};
				}
				img.srcset = list.join(',');
			}
		}

		//debug('Resolve canvas');
		for (var tmp of $_('canvas')) {
			try {
				var url = img2url(tmp);
				ElmProps.add(tmp, 'Canvas_DataUrl', url);
			} catch (e) {}
		}
		
		debug('Resolve styles', dom);
		for (var tmp of $_('style')) {
			try {
				if(!tmp.firstChild) {
					var oelm = doc.querySelector(ElmProps.getCssPath(tmp));
					debug('cssRulesX', tmp, oelm);
					if(oelm && oelm.sheet?.cssRules?.length) {
						var cssRules = oelm.sheet.cssRules; 
						var text = '';
						for (var i = 0; i < cssRules.length; i++) {
							var rule = cssRules[i];
							text += rule.cssText;
							text += '\n';
						}
						//debug('cssRules', text);
						tmp.innerHTML = text;
					}
				}
			} catch (e) {}
		}

		//debug('Resolve background-images');
		var urlReg = /^\s*url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)\s*$/;
		for (var elm of $_('*')) {
			var url = elm.style.backgroundImage;
			if(url && url.length < 3999 // CONST.Number.MaxUrlLength
				 && url.lastIndexOf('data:', 10)==-1) { // not /^data:/.test(url)
				url = url.match(urlReg);
				if (url) { // Get full image url
					url = fullUrl(url[1]);
					elm.style.backgroundImage = 'url('+url+')';
				}
			}
		}

		//debug('Resolve input/textarea/progress values');
		for (var tmp of $_('input,textarea,progress')) {
			// Query origin element's value
			var oelm = doc.querySelector(ElmProps.getCssPath(tmp));
			// Add to property map
			oelm.value && ElmProps.add(tmp, 'Input_Value', oelm.value);
		}

		// Get favicon.ico if no icon found
		debug('Resolve favicon.ico');
		if (!$('link[rel*=icon]')) {
			var icon = $C('link');
			icon.rel = 'icon';
			icon.href = getHost() + 'favicon.ico',
			$A(dom.head, icon);
		}

		// Start generating the finish event
		debug('Waiting for async tasks to be finished');
		AM.finishEvent = true;

		function resolveStyle(style, callback, args=[]) {
			const argvs = [style].concat(args);
			if(!style) {
				return callback.apply(null, argvs);
			}
			const re = /url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)/;
			const rg = /url\(\s*['"]?([^\(\)'"]+)['"]?\s*\)/g;
			const replace = (durl, urlexp, arg1, arg2, arg3) => {
				// Replace style text
				const durlexp = 'url("'+durl+'")';
				style = style.replaceAll(urlexp, durlexp);
				// Get args
				argvs[0]=style;
				callback.apply(null, argvs);
				AM.finish();
			};

			const all = style.match(rg);
			if (!all) {return;}
			for (const urlexp of all) {
				// Check url
				if (urlexp.length > 3999) {continue;}
				const osrc = urlexp.match(re)[1];
				const baseurl = args instanceof HTMLLinkElement && args.ohref ? args.ohref : location.href;
				if (!ishttp(osrc)) {continue;}
				const src = fullUrl(osrc, baseurl);

				// Request
				AM.add();
				requestDataURL(src, replace, [urlexp].concat(args));
			}
		}
		function resolveStyleLinked(link) {
			const durl = link.href;
			if ((durl||'')[0]!=='d') {return;} // not /^data:/.test()
			const blob = dataURLToBlob(durl);
			const reader = new FileReader();
			reader.onload = () => {
				resolveStyle(reader.result, (style, link) => {
					const blob = new Blob([style],{type:"text/css"});
					AM.add();
					blobToDataURL(blob, function(durl, link) {
						//debug('style elm=', link.id, link)
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

	var t0 = doc.createElement('a');
	
	function fullUrl(url, baseurl) {
		if(url) {
			if (url.startsWith('//')) {url = location.protocol + url;}
			if (!url.startsWith('http')) {
				var base = (baseurl||location.href).replace(/(.+\/).*?$/, '$1');
				t0.href = base + url;
				url = t0.href;
			}
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

	function requestDataURL(url, callback, args=[]) {
		try{
			//debug('requestDataURL::', url, args);
			const argvs = [url].concat(args);
			callback.apply(null, argvs);
		}catch(e){err(e)}
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
		var cvs = doc.createElement('canvas');
		var v = cvs.getContext('2d');
		cvs.width = img.width;
		cvs.height = img.height;
		v.drawImage(img, 0, 0)
		return cvs.toDataURL();
	}

	// Format timecode like 1970-01-01 00:00:00
	// if data-sep provided false, there will be no data part.
    function getTime(dateSep='-', timeSep=':') {
        var d = new Date(), fulltime = ''
		fulltime += dateSep ? f0(d.getFullYear(), 4) + dateSep + f0((d.getMonth() + 1), 2) + dateSep + f0(d.getDate(), 2) : '';
		fulltime += dateSep && timeSep ? ' ' : '';
		fulltime += timeSep ? f0(d.getHours(), 2) + timeSep + f0(d.getMinutes(), 2) + timeSep + f0(d.getSeconds(), 2) : '';
        return fulltime;
    }
	
    function f0(number, ln) {
        var str = String(number);
        for (var i = str.length; i < ln; i++) {
            str = '0' + str;
        }
        return str;
    }

	function stop(e) {
		try{
			e.stopPropagation();
			e.preventDefault();
		} catch(e) {debug(e)}
	}

	function saveTextToFile(text, name) {
		const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
		const url = URL.createObjectURL(blob);
		const a = doc.createElement('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	// get host part from a url(includes '^https://', '/$')
	function getHost(url=location.href) {
		const match = location.href.match(/https?:\/\/[^\/]+\//);
		return match ? match[0] : match;
	}

})();