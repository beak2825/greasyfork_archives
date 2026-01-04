// ==UserScript==
// @name 【帮帮影视】
// @description 脚本功能视频解析
// @contributionURL https://gitee.com/slzx543/raw/raw/master/142857-1.png
// @author nlm
// @version 142857
// @include */tv/*
// @include */acg/*
// @include */mov/*
// @include *=http*
// @include *&type=1ting*
// @include *&type=ximalaya*
// @include *&autoplay=1&metareferer=*
// @include *://www.bumimi*
// @include *://v.youku.com/v_show/id_*
// @include *://v.qq.com/x/cover/*
// @include *://v.qq.com/variety/p/topic/*
// @include *://w.mgtv.com/b/*
// @include *://www.mgtv.com/b/*
// @include *://tw.iqiyi.com/v_*
// @include *://www.iqiyi.com/v_*
// @include *://www.iqiyi.com/a_*
// @include *://www.iqiyi.com/w_*
// @include *://www.iqiyi.com/kszt/*
// @include *://tv.sohu.com/v/*
// @include *://film.sohu.com/album/*
// @include *://www.le.com/ptv/vplay/*
// @include *://v.pptv.com/show/*
// @include *://vip.1905.com/play/*
// @include *://www.bilibili.com/bangumi/play/*
// @include *://www.acfun.cn/bangumi/*
// @match *://*/*/tv/*
// @match *://*/*/acg/*
// @match *://*/*/mov/*
// @match *://*/*=http*
// @match *://*/*&type=1ting*
// @match *://*/*&type=ximalaya*
// @match *://*/*&autoplay=1&metareferer=*
// @match *://www.douyin.com/video/*
// @match *://www.kuaishou.com/*
// @match *://www.bilibili.com/blackboard/*
// @match *://www.bilibili.com/*video/*
// @match *://player.bilibili.com/*
// @match *://*.tudou.com/v/*
// @match *://*.tudou.com/*/id_*
// @match *://v-wb.youku.com/v_show/id_*
// @match *://vku.youku.com/live/*
// @match *://w.mgtv.com/l/*
// @match *://w.mgtv.com/s/*
// @match *://www.mgtv.com/l/*
// @match *://www.mgtv.com/s/*
// @match *://www.mgtv.com/act/*
// @match *://haokan.baidu.com/v*
// @match *://haokan.hao123.com/v*
// @match *://tieba.baidu.com/p/*
// @match *://www.jiaomh.com/search.php?searchword=*
// @match *://www.jiaomh.com/kmahua/*
// @match *://www.555dy6.com/vodsearch/*
// @match *://www.555dy6.com/vodplay/*
// @match *://pgso.cnjsjf.com/?*
// @match *://miao101.com/search*
// @match *://miao101.com/video*
// @match *://www.wbdy.tv/*
// @match *://www.ikukk.com/*
// @match *://www.cupfox.com/search?key=*
// @match *://movie.douban.com/subject/*
// @match *://www.9ku.com/play/*
// @match *://m.9ku.com/play/*
// @match *://www.acfun.cn/*/ac*
// @match *://m.youku.com/*/id_*
// @match *://m.mgtv.com/b/*
// @match *://m.pptv.com/show/*
// @match *://m.tv.sohu.com/v*
// @match *://m.tv.sohu.com/u/*
// @match *://m.tv.sohu.com/phone_play_film*
// @match *://m.le.com/vplay_*
// @match *://m.iqiyi.com/v_*
// @match *://m.v.qq.com/*
// @match *://3g.v.qq.com/*
// @match *://v.qq.com/x/page/*
// @match *://z1.m1907.cn/*
// @match *://www.yinyuetai.com/play?id=*
// @match *://m.acfun.cn/v/*
// @match *://m.douban.com/movie/subject/*
// @match *://music.163.com/*
// @match *://y.music.163.com/*
// @match *://kuwo.cn/*
// @match *://bd.kuwo.cn/*
// @match *://www.kuwo.cn/*
// @match *://m.kuwo.cn/newh5*
// @match *://www.kugou.com/song/*
// @match *://www.kugou.com/mvweb/*
// @match *://m3ws.kugou.com/kgsong/*
// @match *://m3ws.kugou.com/mv/*
// @match *://m.kugou.com/*
// @match *://y.qq.com/*
// @match *://i.y.qq.com/*
// @match *://www.xiami.com/*
// @match *://h.xiami.com/*
// @match *://m.xiami.com/*
// @match *://music.migu.cn/*
// @match *://m.music.migu.cn/*
// @match *://5sing.kugou.com/*
// @match *://kg.qq.com/node/*
// @match *://www.app-echo.com/*
// @match *://radio.sky31.com/*
// @match *://www.lrts.me/playlist*
// @match *://m.ximalaya.com/*
// @match *://www.ximalaya.com/*
// @match *://www.1ting.com/*
// @match *://www.zhaojiaoben.cn/*
// @grant GM_setValue
// @grant GM_getValue
// @noframes
// @run-at document-end
// @namespace nlm
// @downloadURL https://update.greasyfork.org/scripts/454757/%E3%80%90%E5%B8%AE%E5%B8%AE%E5%BD%B1%E8%A7%86%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/454757/%E3%80%90%E5%B8%AE%E5%B8%AE%E5%BD%B1%E8%A7%86%E3%80%91.meta.js
// ==/UserScript==


(function() {
	try {
		if (self != top) {
			return false;
		} else if (document.title.match(/^\s*?[45]0[234]\s/i) != null) {
			return false;
		} else {
			if (window.location.href.match(/\.163\..+?\/store/)) {} else {
				try {
					if (!document.querySelector("\u5b81\u5c0f\u5f71")) {
						document.body.appendChild(document.createElement("宁小影"));
						try {
							if (document.location.protocol.indexOf("http") != -1 && (document.referrer.indexOf(location.href.split("/")[2]) == -1 || document.referrer.indexOf(location.href.split("/")[2]) > 10)) {
								parent.window.opener = null
							} else {}
						} catch (err) {}
						try {
							try {
								var clipboard = new Clipboard('body', {
									text: function() {
										return
									}
								});
								clipboard.on('success', function(e) {
									return
								});
								clipboard.on('error', function(e) {
									return
								})
							} catch (err) {}
							document.head.insertAdjacentHTML('beforeend', '<jiangxiaobai></jiangxiaobai>');
							jxbvipobj();
						} catch (err) {
							if (!document.querySelector("jiangxiaobai")) {
								document.head.appendChild(document.createElement("jiangxiaobai"));
								jxbvipobj();
							} else {}
						}
					} else {
						return false;
					}
					function jxbvipobj() {
						var arra = [],
							arrb = [],
							arrahttpsjk, arrbhttpsjk, httpsjk, vipzdjx, vipjxtb, vipjxss, vipjxkjj, gbdmobj, vipvideotg, gbkjjjobj, jstgggobj, pdssgjcobj, mgzdgq, lkzdzt, zdbfqp, zdwbfobj, sjtzjx, jxbzdjxdsqobj, jishu;
						const obj = window.location.href, objj = window.location.host, objjj = window.location.search, log = console.log;
						const ttblwobj = obj.match(/^https?:\/\/(?:w(?:ww)?\.mgtv\.com\/(?!b)[a-z]\/|(?:player|live)\.bilibili\.com|www\.bilibili\.com\/(?:cheese\/play|.*?video|blackboard)\/|www\.acfun\.cn\/player\/ac)/);
						const pcliwaiobj = obj.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\/|w(?:ww)?\.mgtv\.com\/(?:b|act)\/|www\.iqiyi\.com\/(?:[awv]_|kszt\/)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|v\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/bangumi\/)/);
						const sjliwaiobj = obj.match(/^https?:\/\/(?:m\.youku\.com\/.+?\/id_|m\.mgtv\.com\/b\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|m\.le\.com\/vplay_|m\.iqiyi\.com\/v_|(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)|m\.bilibili\.com\/bangumi\/play\/|m\.acfun\.cn\/v\/)/);
						const iqiyialiwaiobj = obj.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/) && document.title.match(new RegExp("在线观看")), iqiyibliwaiobj = obj.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/) && document.title.match(new RegExp("名师课堂")), iqiyicliwaiobj = obj.match(/^https?:\/\/m\.iqiyi\.com\/v_/) && document.title.match(new RegExp("[部季集话部期>》)）:：].*?(?:预告|片花|花絮|彩蛋|看点)"));
						const jxjkwzobj = /^https?:\/\/.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:\w+?_\w+?|search|jx|url|id|v|&[^\/]+?|\w+?\.html\?\w+?)[#=\?]https?:\/\/[^\/]+?\.(?:youku|mgtv|sohu|pptv|1905|iqiyi|le|qq|bilibili|acfun)\.)/, jxjkobj = obj.match(jxjkwzobj);
						const kjjlwobj = !ttblwobj;
						const vipzdjxwzobj = (pcliwaiobj || sjliwaiobj) && !iqiyialiwaiobj && !iqiyibliwaiobj;
						const ttbkjjliobj = objj.match(/(?:music\.163|kuwo|kugou|(?:y|kg)\.qq|xiami|migu|ximalaya|eggvod|app-echo)/);
						const jxbpcobj = !/(?:phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(window.navigator.userAgent);
						const jxbpclwobj = /(?:Firefox|Opera)/i.test(navigator.userAgent);
						const mmkjjtjobj = obj.match(/^https?:\/\/(?:v\.qq\.com\/x\/page\/|www\.yinyuetai\.com\/play\?id=)/);
						function h5zdbfobj() {
							(function() {
								function H5zdbfobj() {
									(function() {
										let zdbf = 0;
										let zdbfdsq = setInterval(function() {
											function zdqpobj() {
												let obj = window.location.href;
												if (obj.match(/^https?:\/\/www\.acfun\.cn\/player\/ac/)) {
													document.querySelector("#ACPlayer>div>div.container-video>div>div.container-controls>div.control-bar-top>div.box-right>div.fullscreen.fullscreen-screen>div").click()
												} else if (obj.match(/^https?:\/\/player\.bilibili\.com\/player\.html\?aid=/)) {
													document.querySelector('i[data-text="进入全屏"]').click()
												} else {}
											};
											function zdbfobj() {
												let d = document;
												let f = d.getElementsByTagName('video');
												let a = "autoplay";
												for (let i = 0; i < f.length; i++) {
													if (!f[i].getAttribute("autoplay")) {
														f[i].setAttribute("data-ad", "false");
														f[i].setAttribute("muted", "muted");
														f[i].setAttribute("loop", "loop");
														f[i].setAttribute("autoplay", "true");
														f[i].src = f[i].src
													}
												}
											};
											let zdbfaobj = document.querySelector("video");
											let zdbfbobj = document.getElementsByTagName("video")[0];
											if (zdbfaobj) {
												window.scrollTo(0, zdbfaobj.offsetTop);
												try {
													document.querySelector("head>style").click();
													zdbfaobj.play();
													zdqpobj()
												} catch (err) {
													zdbfobj()
												}
												log("%c宁小影--01-H5视频自动播放", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												clearInterval(zdbfdsq);
												return false
											} else if (zdbfbobj) {
												window.scrollTo(0, zdbfbobj.offsetTop);
												try {
													document.querySelector("head>style").click();
													zdbfbobj.play()
												} catch (err) {
													zdbfobj()
												}
												log("%c宁小影--02-视频自动播放", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
												clearInterval(zdbfdsq);
												return false
											}++zdbf;
											if (zdbf > 25) {
												clearInterval(zdbfdsq);
												return false
											}
										}, 1111)
									})()
								};
								setTimeout(H5zdbfobj, 1234)
							})()
						};
						function jqjs() {
							(function() {
								try {
									if (document.getElementById('jiangxiaobaijqjs')) {
										return
									}
									if (typeof jQuery == 'undefined') {
										(function(window, undefined) {
											var readyList, rootjQuery, core_strundefined = typeof undefined,
												location = window.location,
												document = window.document,
												docElem = document.documentElement,
												_jQuery = window.jQuery,
												_$ = window.$,
												class2type = {},
												core_deletedIds = [],
												core_version = "1.10.2",
												core_concat = core_deletedIds.concat,
												core_push = core_deletedIds.push,
												core_slice = core_deletedIds.slice,
												core_indexOf = core_deletedIds.indexOf,
												core_toString = class2type.toString,
												core_hasOwn = class2type.hasOwnProperty,
												core_trim = core_version.trim,
												jQuery = function(selector, context) {
													return new jQuery.fn.init(selector, context, rootjQuery)
												},
												core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
												core_rnotwhite = /\S+/g,
												rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
												rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
												rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
												rvalidchars = /^[\],:{}\s]*$/,
												rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
												rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
												rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
												rmsPrefix = /^-ms-/,
												rdashAlpha = /-([\da-z])/gi,
												fcamelCase = function(all, letter) {
													return letter.toUpperCase()
												},
												completed = function(event) {
													if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
														detach();
														jQuery.ready()
													}
												},
												detach = function() {
													if (document.addEventListener) {
														document.removeEventListener("DOMContentLoaded", completed, false);
														window.removeEventListener("load", completed, false)
													} else {
														document.detachEvent("onreadystatechange", completed);
														window.detachEvent("onload", completed)
													}
												};
											jQuery.fn = jQuery.prototype = {
												jquery: core_version,
												constructor: jQuery,
												init: function(selector, context, rootjQuery) {
													var match, elem;
													if (!selector) {
														return this
													}
													if (typeof selector === "string") {
														if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
															match = [null, selector, null]
														} else {
															match = rquickExpr.exec(selector)
														}
														if (match && (match[1] || !context)) {
															if (match[1]) {
																context = context instanceof jQuery ? context[0] : context;
																jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
																if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
																	for (match in context) {
																		if (jQuery.isFunction(this[match])) {
																			this[match](context[match])
																		} else {
																			this.attr(match, context[match])
																		}
																	}
																}
																return this
															} else {
																elem = document.getElementById(match[2]);
																if (elem && elem.parentNode) {
																	if (elem.id !== match[2]) {
																		return rootjQuery.find(selector)
																	}
																	this.length = 1;
																	this[0] = elem
																}
																this.context = document;
																this.selector = selector;
																return this
															}
														} else if (!context || context.jquery) {
															return (context || rootjQuery).find(selector)
														} else {
															return this.constructor(context).find(selector)
														}
													} else if (selector.nodeType) {
														this.context = this[0] = selector;
														this.length = 1;
														return this
													} else if (jQuery.isFunction(selector)) {
														return rootjQuery.ready(selector)
													}
													if (selector.selector !== undefined) {
														this.selector = selector.selector;
														this.context = selector.context
													}
													return jQuery.makeArray(selector, this)
												},
												selector: "",
												length: 0,
												toArray: function() {
													return core_slice.call(this)
												},
												get: function(num) {
													return num == null ? this.toArray() : (num < 0 ? this[this.length + num] : this[num])
												},
												pushStack: function(elems) {
													var ret = jQuery.merge(this.constructor(), elems);
													ret.prevObject = this;
													ret.context = this.context;
													return ret
												},
												each: function(callback, args) {
													return jQuery.each(this, callback, args)
												},
												ready: function(fn) {
													jQuery.ready.promise().done(fn);
													return this
												},
												slice: function() {
													return this.pushStack(core_slice.apply(this, arguments))
												},
												first: function() {
													return this.eq(0)
												},
												last: function() {
													return this.eq(-1)
												},
												eq: function(i) {
													var len = this.length,
														j = +i + (i < 0 ? len : 0);
													return this.pushStack(j >= 0 && j < len ? [this[j]] : [])
												},
												map: function(callback) {
													return this.pushStack(jQuery.map(this, function(elem, i) {
														return callback.call(elem, i, elem)
													}))
												},
												end: function() {
													return this.prevObject || this.constructor(null)
												},
												push: core_push,
												sort: [].sort,
												splice: [].splice
											};
											jQuery.fn.init.prototype = jQuery.fn;
											jQuery.extend = jQuery.fn.extend = function() {
												var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {},
													i = 1,
													length = arguments.length,
													deep = false;
												if (typeof target === "boolean") {
													deep = target;
													target = arguments[1] || {};
													i = 2
												}
												if (typeof target !== "object" && !jQuery.isFunction(target)) {
													target = {}
												}
												if (length === i) {
													target = this;
													--i
												}
												for (; i < length; i++) {
													if ((options = arguments[i]) != null) {
														for (name in options) {
															src = target[name];
															copy = options[name];
															if (target === copy) {
																continue
															}
															if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
																if (copyIsArray) {
																	copyIsArray = false;
																	clone = src && jQuery.isArray(src) ? src : []
																} else {
																	clone = src && jQuery.isPlainObject(src) ? src : {}
																}
																target[name] = jQuery.extend(deep, clone, copy)
															} else if (copy !== undefined) {
																target[name] = copy
															}
														}
													}
												}
												return target
											};
											jQuery.extend({
												expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
												noConflict: function(deep) {
													if (window.$ === jQuery) {
														window.$ = _$
													}
													if (deep && window.jQuery === jQuery) {
														window.jQuery = _jQuery
													}
													return jQuery
												},
												isReady: false,
												readyWait: 1,
												holdReady: function(hold) {
													if (hold) {
														jQuery.readyWait++
													} else {
														jQuery.ready(true)
													}
												},
												ready: function(wait) {
													if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
														return
													}
													if (!document.body) {
														return setTimeout(jQuery.ready)
													}
													jQuery.isReady = true;
													if (wait !== true && --jQuery.readyWait > 0) {
														return
													}
													readyList.resolveWith(document, [jQuery]);
													if (jQuery.fn.trigger) {
														jQuery(document).trigger("ready").off("ready")
													}
												},
												isFunction: function(obj) {
													return jQuery.type(obj) === "function"
												},
												isArray: Array.isArray ||
												function(obj) {
													return jQuery.type(obj) === "array"
												},
												isWindow: function(obj) {
													return obj != null && obj == obj.window
												},
												isNumeric: function(obj) {
													return !isNaN(parseFloat(obj)) && isFinite(obj)
												},
												type: function(obj) {
													if (obj == null) {
														return String(obj)
													}
													return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call(obj)] || "object" : typeof obj
												},
												isPlainObject: function(obj) {
													var key;
													if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
														return false
													}
													try {
														if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
															return false
														}
													} catch (e) {
														return false
													}
													if (jQuery.support.ownLast) {
														for (key in obj) {
															return core_hasOwn.call(obj, key)
														}
													}
													for (key in obj) {}
													return key === undefined || core_hasOwn.call(obj, key)
												},
												isEmptyObject: function(obj) {
													var name;
													for (name in obj) {
														return false
													}
													return true
												},
												error: function(msg) {
													throw new Error(msg);
												},
												parseHTML: function(data, context, keepScripts) {
													if (!data || typeof data !== "string") {
														return null
													}
													if (typeof context === "boolean") {
														keepScripts = context;
														context = false
													}
													context = context || document;
													var parsed = rsingleTag.exec(data),
														scripts = !keepScripts && [];
													if (parsed) {
														return [context.createElement(parsed[1])]
													}
													parsed = jQuery.buildFragment([data], context, scripts);
													if (scripts) {
														jQuery(scripts).remove()
													}
													return jQuery.merge([], parsed.childNodes)
												},
												parseJSON: function(data) {
													if (window.JSON && window.JSON.parse) {
														return window.JSON.parse(data)
													}
													if (data === null) {
														return data
													}
													if (typeof data === "string") {
														data = jQuery.trim(data);
														if (data) {
															if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
																return (new Function("return " + data))()
															}
														}
													}
													jQuery.error("Invalid JSON: " + data)
												},
												parseXML: function(data) {
													var xml, tmp;
													if (!data || typeof data !== "string") {
														return null
													}
													try {
														if (window.DOMParser) {
															tmp = new DOMParser();
															xml = tmp.parseFromString(data, "text/xml")
														} else {
															xml = new ActiveXObject("Microsoft.XMLDOM");
															xml.async = "false";
															xml.loadXML(data)
														}
													} catch (e) {
														xml = undefined
													}
													if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
														jQuery.error("Invalid XML: " + data)
													}
													return xml
												},
												noop: function() {},
												globalEval: function(data) {
													if (data && jQuery.trim(data)) {
														(window.execScript ||
														function(data) {
															window["eval"].call(window, data)
														})(data)
													}
												},
												camelCase: function(string) {
													return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
												},
												nodeName: function(elem, name) {
													return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase()
												},
												each: function(obj, callback, args) {
													var value, i = 0,
														length = obj.length,
														isArray = isArraylike(obj);
													if (args) {
														if (isArray) {
															for (; i < length; i++) {
																value = callback.apply(obj[i], args);
																if (value === false) {
																	break
																}
															}
														} else {
															for (i in obj) {
																value = callback.apply(obj[i], args);
																if (value === false) {
																	break
																}
															}
														}
													} else {
														if (isArray) {
															for (; i < length; i++) {
																value = callback.call(obj[i], i, obj[i]);
																if (value === false) {
																	break
																}
															}
														} else {
															for (i in obj) {
																value = callback.call(obj[i], i, obj[i]);
																if (value === false) {
																	break
																}
															}
														}
													}
													return obj
												},
												trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
												function(text) {
													return text == null ? "" : core_trim.call(text)
												} : function(text) {
													return text == null ? "" : (text + "").replace(rtrim, "")
												},
												makeArray: function(arr, results) {
													var ret = results || [];
													if (arr != null) {
														if (isArraylike(Object(arr))) {
															jQuery.merge(ret, typeof arr === "string" ? [arr] : arr)
														} else {
															core_push.call(ret, arr)
														}
													}
													return ret
												},
												inArray: function(elem, arr, i) {
													var len;
													if (arr) {
														if (core_indexOf) {
															return core_indexOf.call(arr, elem, i)
														}
														len = arr.length;
														i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
														for (; i < len; i++) {
															if (i in arr && arr[i] === elem) {
																return i
															}
														}
													}
													return -1
												},
												merge: function(first, second) {
													var l = second.length,
														i = first.length,
														j = 0;
													if (typeof l === "number") {
														for (; j < l; j++) {
															first[i++] = second[j]
														}
													} else {
														while (second[j] !== undefined) {
															first[i++] = second[j++]
														}
													}
													first.length = i;
													return first
												},
												grep: function(elems, callback, inv) {
													var retVal, ret = [],
														i = 0,
														length = elems.length;
													inv = !! inv;
													for (; i < length; i++) {
														retVal = !! callback(elems[i], i);
														if (inv !== retVal) {
															ret.push(elems[i])
														}
													}
													return ret
												},
												map: function(elems, callback, arg) {
													var value, i = 0,
														length = elems.length,
														isArray = isArraylike(elems),
														ret = [];
													if (isArray) {
														for (; i < length; i++) {
															value = callback(elems[i], i, arg);
															if (value != null) {
																ret[ret.length] = value
															}
														}
													} else {
														for (i in elems) {
															value = callback(elems[i], i, arg);
															if (value != null) {
																ret[ret.length] = value
															}
														}
													}
													return core_concat.apply([], ret)
												},
												guid: 1,
												proxy: function(fn, context) {
													var args, proxy, tmp;
													if (typeof context === "string") {
														tmp = fn[context];
														context = fn;
														fn = tmp
													}
													if (!jQuery.isFunction(fn)) {
														return undefined
													}
													args = core_slice.call(arguments, 2);
													proxy = function() {
														return fn.apply(context || this, args.concat(core_slice.call(arguments)))
													};
													proxy.guid = fn.guid = fn.guid || jQuery.guid++;
													return proxy
												},
												access: function(elems, fn, key, value, chainable, emptyGet, raw) {
													var i = 0,
														length = elems.length,
														bulk = key == null;
													if (jQuery.type(key) === "object") {
														chainable = true;
														for (i in key) {
															jQuery.access(elems, fn, i, key[i], true, emptyGet, raw)
														}
													} else if (value !== undefined) {
														chainable = true;
														if (!jQuery.isFunction(value)) {
															raw = true
														}
														if (bulk) {
															if (raw) {
																fn.call(elems, value);
																fn = null
															} else {
																bulk = fn;
																fn = function(elem, key, value) {
																	return bulk.call(jQuery(elem), value)
																}
															}
														}
														if (fn) {
															for (; i < length; i++) {
																fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)))
															}
														}
													}
													return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet
												},
												now: function() {
													return (new Date()).getTime()
												},
												swap: function(elem, options, callback, args) {
													var ret, name, old = {};
													for (name in options) {
														old[name] = elem.style[name];
														elem.style[name] = options[name]
													}
													ret = callback.apply(elem, args || []);
													for (name in options) {
														elem.style[name] = old[name]
													}
													return ret
												}
											});
											jQuery.ready.promise = function(obj) {
												if (!readyList) {
													readyList = jQuery.Deferred();
													if (document.readyState === "complete") {
														setTimeout(jQuery.ready)
													} else if (document.addEventListener) {
														document.addEventListener("DOMContentLoaded", completed, false);
														window.addEventListener("load", completed, false)
													} else {
														document.attachEvent("onreadystatechange", completed);
														window.attachEvent("onload", completed);
														var top = false;
														try {
															top = window.frameElement == null && document.documentElement
														} catch (e) {}
														if (top && top.doScroll) {
															(function doScrollCheck() {
																if (!jQuery.isReady) {
																	try {
																		top.doScroll("left")
																	} catch (e) {
																		return setTimeout(doScrollCheck, 50)
																	}
																	detach();
																	jQuery.ready()
																}
															})()
														}
													}
												}
												return readyList.promise(obj)
											};
											jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
												class2type["[object " + name + "]"] = name.toLowerCase()
											});
											function isArraylike(obj) {
												var length = obj.length,
													type = jQuery.type(obj);
												if (jQuery.isWindow(obj)) {
													return false
												}
												if (obj.nodeType === 1 && length) {
													return true
												}
												return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj)
											}
											rootjQuery = jQuery(document);
											(function(window, undefined) {
												var i, support, cachedruns, Expr, getText, isXML, compile, outermostContext, sortInput, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -(new Date()),
													preferredDoc = window.document,
													dirruns = 0,
													done = 0,
													classCache = createCache(),
													tokenCache = createCache(),
													compilerCache = createCache(),
													hasDuplicate = false,
													sortOrder = function(a, b) {
														if (a === b) {
															hasDuplicate = true;
															return 0
														}
														return 0
													},
													strundefined = typeof undefined,
													MAX_NEGATIVE = 1 << 31,
													hasOwn = ({}).hasOwnProperty,
													arr = [],
													pop = arr.pop,
													push_native = arr.push,
													push = arr.push,
													slice = arr.slice,
													indexOf = arr.indexOf ||
												function(elem) {
													var i = 0,
														len = this.length;
													for (; i < len; i++) {
														if (this[i] === elem) {
															return i
														}
													}
													return -1
												}, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rsibling = new RegExp(whitespace + "*[+~]"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
													"ID": new RegExp("^#(" + characterEncoding + ")"),
													"CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
													"TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
													"ATTR": new RegExp("^" + attributes),
													"PSEUDO": new RegExp("^" + pseudos),
													"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
													"bool": new RegExp("^(?:" + booleans + ")$", "i"),
													"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
												}, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"), funescape = function(_, escaped, escapedWhitespace) {
													var high = "0x" + escaped - 0x10000;
													return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00)
												};
												try {
													push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
													arr[preferredDoc.childNodes.length].nodeType
												} catch (e) {
													push = {
														apply: arr.length ?
														function(target, els) {
															push_native.apply(target, slice.call(els))
														} : function(target, els) {
															var j = target.length,
																i = 0;
															while ((target[j++] = els[i++])) {}
															target.length = j - 1
														}
													}
												}
												function Sizzle(selector, context, results, seed) {
													var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
													if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
														setDocument(context)
													}
													context = context || document;
													results = results || [];
													if (!selector || typeof selector !== "string") {
														return results
													}
													if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
														return []
													}
													if (documentIsHTML && !seed) {
														if ((match = rquickExpr.exec(selector))) {
															if ((m = match[1])) {
																if (nodeType === 9) {
																	elem = context.getElementById(m);
																	if (elem && elem.parentNode) {
																		if (elem.id === m) {
																			results.push(elem);
																			return results
																		}
																	} else {
																		return results
																	}
																} else {
																	if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
																		results.push(elem);
																		return results
																	}
																}
															} else if (match[2]) {
																push.apply(results, context.getElementsByTagName(selector));
																return results
															} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
																push.apply(results, context.getElementsByClassName(m));
																return results
															}
														}
														if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
															nid = old = expando;
															newContext = context;
															newSelector = nodeType === 9 && selector;
															if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
																groups = tokenize(selector);
																if ((old = context.getAttribute("id"))) {
																	nid = old.replace(rescape, "\\$&")
																} else {
																	context.setAttribute("id", nid)
																}
																nid = "[id='" + nid + "'] ";
																i = groups.length;
																while (i--) {
																	groups[i] = nid + toSelector(groups[i])
																}
																newContext = rsibling.test(selector) && context.parentNode || context;
																newSelector = groups.join(",")
															}
															if (newSelector) {
																try {
																	push.apply(results, newContext.querySelectorAll(newSelector));
																	return results
																} catch (qsaError) {} finally {
																	if (!old) {
																		context.removeAttribute("id")
																	}
																}
															}
														}
													}
													return select(selector.replace(rtrim, "$1"), context, results, seed)
												}
												function createCache() {
													var keys = [];
													function cache(key, value) {
														if (keys.push(key += " ") > Expr.cacheLength) {
															delete cache[keys.shift()]
														}
														return (cache[key] = value)
													}
													return cache
												}
												function markFunction(fn) {
													fn[expando] = true;
													return fn
												}
												function assert(fn) {
													var div = document.createElement("div");
													try {
														return !!fn(div)
													} catch (e) {
														return false
													} finally {
														if (div.parentNode) {
															div.parentNode.removeChild(div)
														}
														div = null
													}
												}
												function addHandle(attrs, handler) {
													var arr = attrs.split("|"),
														i = attrs.length;
													while (i--) {
														Expr.attrHandle[arr[i]] = handler
													}
												}
												function siblingCheck(a, b) {
													var cur = b && a,
														diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
													if (diff) {
														return diff
													}
													if (cur) {
														while ((cur = cur.nextSibling)) {
															if (cur === b) {
																return -1
															}
														}
													}
													return a ? 1 : -1
												}
												function createInputPseudo(type) {
													return function(elem) {
														var name = elem.nodeName.toLowerCase();
														return name === "input" && elem.type === type
													}
												}
												function createButtonPseudo(type) {
													return function(elem) {
														var name = elem.nodeName.toLowerCase();
														return (name === "input" || name === "button") && elem.type === type
													}
												}
												function createPositionalPseudo(fn) {
													return markFunction(function(argument) {
														argument = +argument;
														return markFunction(function(seed, matches) {
															var j, matchIndexes = fn([], seed.length, argument),
																i = matchIndexes.length;
															while (i--) {
																if (seed[(j = matchIndexes[i])]) {
																	seed[j] = !(matches[j] = seed[j])
																}
															}
														})
													})
												}
												isXML = Sizzle.isXML = function(elem) {
													var documentElement = elem && (elem.ownerDocument || elem).documentElement;
													return documentElement ? documentElement.nodeName !== "HTML" : false
												};
												support = Sizzle.support = {};
												setDocument = Sizzle.setDocument = function(node) {
													var doc = node ? node.ownerDocument || node : preferredDoc,
														parent = doc.defaultView;
													if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
														return document
													}
													document = doc;
													docElem = doc.documentElement;
													documentIsHTML = !isXML(doc);
													if (parent && parent.attachEvent && parent !== parent.top) {
														parent.attachEvent("onbeforeunload", function() {
															setDocument()
														})
													}
													support.attributes = assert(function(div) {
														div.className = "i";
														return !div.getAttribute("className")
													});
													support.getElementsByTagName = assert(function(div) {
														div.appendChild(doc.createComment(""));
														return !div.getElementsByTagName("*").length
													});
													support.getElementsByClassName = assert(function(div) {
														div.innerHTML = "<div class='a'></div><div class='a i'></div>";
														div.firstChild.className = "i";
														return div.getElementsByClassName("i").length === 2
													});
													support.getById = assert(function(div) {
														docElem.appendChild(div).id = expando;
														return !doc.getElementsByName || !doc.getElementsByName(expando).length
													});
													if (support.getById) {
														Expr.find["ID"] = function(id, context) {
															if (typeof context.getElementById !== strundefined && documentIsHTML) {
																var m = context.getElementById(id);
																return m && m.parentNode ? [m] : []
															}
														};
														Expr.filter["ID"] = function(id) {
															var attrId = id.replace(runescape, funescape);
															return function(elem) {
																return elem.getAttribute("id") === attrId
															}
														}
													} else {
														delete Expr.find["ID"];
														Expr.filter["ID"] = function(id) {
															var attrId = id.replace(runescape, funescape);
															return function(elem) {
																var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
																return node && node.value === attrId
															}
														}
													}
													Expr.find["TAG"] = support.getElementsByTagName ?
													function(tag, context) {
														if (typeof context.getElementsByTagName !== strundefined) {
															return context.getElementsByTagName(tag)
														}
													} : function(tag, context) {
														var elem, tmp = [],
															i = 0,
															results = context.getElementsByTagName(tag);
														if (tag === "*") {
															while ((elem = results[i++])) {
																if (elem.nodeType === 1) {
																	tmp.push(elem)
																}
															}
															return tmp
														}
														return results
													};
													Expr.find["CLASS"] = support.getElementsByClassName &&
													function(className, context) {
														if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
															return context.getElementsByClassName(className)
														}
													};
													rbuggyMatches = [];
													rbuggyQSA = [];
													if ((support.qsa = rnative.test(doc.querySelectorAll))) {
														assert(function(div) {
															div.innerHTML = "<select><option selected=''></option></select>";
															if (!div.querySelectorAll("[selected]").length) {
																rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")")
															}
															if (!div.querySelectorAll(":checked").length) {
																rbuggyQSA.push(":checked")
															}
														});
														assert(function(div) {
															var input = doc.createElement("input");
															input.setAttribute("type", "hidden");
															div.appendChild(input).setAttribute("t", "");
															if (div.querySelectorAll("[t^='']").length) {
																rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")")
															}
															if (!div.querySelectorAll(":enabled").length) {
																rbuggyQSA.push(":enabled", ":disabled")
															}
															div.querySelectorAll("*,:x");
															rbuggyQSA.push(",.*:")
														})
													}
													if ((support.matchesSelector = rnative.test((matches = docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)))) {
														assert(function(div) {
															support.disconnectedMatch = matches.call(div, "div");
															matches.call(div, "[s!='']:x");
															rbuggyMatches.push("!=", pseudos)
														})
													}
													rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
													rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
													contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ?
													function(a, b) {
														var adown = a.nodeType === 9 ? a.documentElement : a,
															bup = b && b.parentNode;
														return a === bup || !! (bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16))
													} : function(a, b) {
														if (b) {
															while ((b = b.parentNode)) {
																if (b === a) {
																	return true
																}
															}
														}
														return false
													};
													sortOrder = docElem.compareDocumentPosition ?
													function(a, b) {
														if (a === b) {
															hasDuplicate = true;
															return 0
														}
														var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);
														if (compare) {
															if (compare & 1 || (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
																if (a === doc || contains(preferredDoc, a)) {
																	return -1
																}
																if (b === doc || contains(preferredDoc, b)) {
																	return 1
																}
																return sortInput ? (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) : 0
															}
															return compare & 4 ? -1 : 1
														}
														return a.compareDocumentPosition ? -1 : 1
													} : function(a, b) {
														var cur, i = 0,
															aup = a.parentNode,
															bup = b.parentNode,
															ap = [a],
															bp = [b];
														if (a === b) {
															hasDuplicate = true;
															return 0
														} else if (!aup || !bup) {
															return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) : 0
														} else if (aup === bup) {
															return siblingCheck(a, b)
														}
														cur = a;
														while ((cur = cur.parentNode)) {
															ap.unshift(cur)
														}
														cur = b;
														while ((cur = cur.parentNode)) {
															bp.unshift(cur)
														}
														while (ap[i] === bp[i]) {
															i++
														}
														return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0
													};
													return doc
												};
												Sizzle.matches = function(expr, elements) {
													return Sizzle(expr, null, null, elements)
												};
												Sizzle.matchesSelector = function(elem, expr) {
													if ((elem.ownerDocument || elem) !== document) {
														setDocument(elem)
													}
													expr = expr.replace(rattributeQuotes, "='$1']");
													if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
														try {
															var ret = matches.call(elem, expr);
															if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
																return ret
															}
														} catch (e) {}
													}
													return Sizzle(expr, document, null, [elem]).length > 0
												};
												Sizzle.contains = function(context, elem) {
													if ((context.ownerDocument || context) !== document) {
														setDocument(context)
													}
													return contains(context, elem)
												};
												Sizzle.attr = function(elem, name) {
													if ((elem.ownerDocument || elem) !== document) {
														setDocument(elem)
													}
													var fn = Expr.attrHandle[name.toLowerCase()],
														val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
													return val === undefined ? support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null : val
												};
												Sizzle.error = function(msg) {
													throw new Error("Syntax error, unrecognized expression: " + msg);
												};
												Sizzle.uniqueSort = function(results) {
													var elem, duplicates = [],
														j = 0,
														i = 0;
													hasDuplicate = !support.detectDuplicates;
													sortInput = !support.sortStable && results.slice(0);
													results.sort(sortOrder);
													if (hasDuplicate) {
														while ((elem = results[i++])) {
															if (elem === results[i]) {
																j = duplicates.push(i)
															}
														}
														while (j--) {
															results.splice(duplicates[j], 1)
														}
													}
													return results
												};
												getText = Sizzle.getText = function(elem) {
													var node, ret = "",
														i = 0,
														nodeType = elem.nodeType;
													if (!nodeType) {
														for (;
														(node = elem[i]); i++) {
															ret += getText(node)
														}
													} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
														if (typeof elem.textContent === "string") {
															return elem.textContent
														} else {
															for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
																ret += getText(elem)
															}
														}
													} else if (nodeType === 3 || nodeType === 4) {
														return elem.nodeValue
													}
													return ret
												};
												Expr = Sizzle.selectors = {
													cacheLength: 50,
													createPseudo: markFunction,
													match: matchExpr,
													attrHandle: {},
													find: {},
													relative: {
														">": {
															dir: "parentNode",
															first: true
														},
														" ": {
															dir: "parentNode"
														},
														"+": {
															dir: "previousSibling",
															first: true
														},
														"~": {
															dir: "previousSibling"
														}
													},
													preFilter: {
														"ATTR": function(match) {
															match[1] = match[1].replace(runescape, funescape);
															match[3] = (match[4] || match[5] || "").replace(runescape, funescape);
															if (match[2] === "~=") {
																match[3] = " " + match[3] + " "
															}
															return match.slice(0, 4)
														},
														"CHILD": function(match) {
															match[1] = match[1].toLowerCase();
															if (match[1].slice(0, 3) === "nth") {
																if (!match[3]) {
																	Sizzle.error(match[0])
																}
																match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
																match[5] = +((match[7] + match[8]) || match[3] === "odd")
															} else if (match[3]) {
																Sizzle.error(match[0])
															}
															return match
														},
														"PSEUDO": function(match) {
															var excess, unquoted = !match[5] && match[2];
															if (matchExpr["CHILD"].test(match[0])) {
																return null
															}
															if (match[3] && match[4] !== undefined) {
																match[2] = match[4]
															} else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
																match[0] = match[0].slice(0, excess);
																match[2] = unquoted.slice(0, excess)
															}
															return match.slice(0, 3)
														}
													},
													filter: {
														"TAG": function(nodeNameSelector) {
															var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
															return nodeNameSelector === "*" ?
															function() {
																return true
															} : function(elem) {
																return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
															}
														},
														"CLASS": function(className) {
															var pattern = classCache[className + " "];
															return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
																return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "")
															})
														},
														"ATTR": function(name, operator, check) {
															return function(elem) {
																var result = Sizzle.attr(elem, name);
																if (result == null) {
																	return operator === "!="
																}
																if (!operator) {
																	return true
																}
																result += "";
																return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false
															}
														},
														"CHILD": function(type, what, argument, first, last) {
															var simple = type.slice(0, 3) !== "nth",
																forward = type.slice(-4) !== "last",
																ofType = what === "of-type";
															return first === 1 && last === 0 ?
															function(elem) {
																return !!elem.parentNode
															} : function(elem, context, xml) {
																var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling",
																	parent = elem.parentNode,
																	name = ofType && elem.nodeName.toLowerCase(),
																	useCache = !xml && !ofType;
																if (parent) {
																	if (simple) {
																		while (dir) {
																			node = elem;
																			while ((node = node[dir])) {
																				if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
																					return false
																				}
																			}
																			start = dir = type === "only" && !start && "nextSibling"
																		}
																		return true
																	}
																	start = [forward ? parent.firstChild : parent.lastChild];
																	if (forward && useCache) {
																		outerCache = parent[expando] || (parent[expando] = {});
																		cache = outerCache[type] || [];
																		nodeIndex = cache[0] === dirruns && cache[1];
																		diff = cache[0] === dirruns && cache[2];
																		node = nodeIndex && parent.childNodes[nodeIndex];
																		while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
																			if (node.nodeType === 1 && ++diff && node === elem) {
																				outerCache[type] = [dirruns, nodeIndex, diff];
																				break
																			}
																		}
																	} else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
																		diff = cache[1]
																	} else {
																		while ((node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop())) {
																			if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
																				if (useCache) {
																					(node[expando] || (node[expando] = {}))[type] = [dirruns, diff]
																				}
																				if (node === elem) {
																					break
																				}
																			}
																		}
																	}
																	diff -= last;
																	return diff === first || (diff % first === 0 && diff / first >= 0)
																}
															}
														},
														"PSEUDO": function(pseudo, argument) {
															var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
															if (fn[expando]) {
																return fn(argument)
															}
															if (fn.length > 1) {
																args = [pseudo, pseudo, "", argument];
																return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
																	var idx, matched = fn(seed, argument),
																		i = matched.length;
																	while (i--) {
																		idx = indexOf.call(seed, matched[i]);
																		seed[idx] = !(matches[idx] = matched[i])
																	}
																}) : function(elem) {
																	return fn(elem, 0, args)
																}
															}
															return fn
														}
													},
													pseudos: {
														"not": markFunction(function(selector) {
															var input = [],
																results = [],
																matcher = compile(selector.replace(rtrim, "$1"));
															return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
																var elem, unmatched = matcher(seed, null, xml, []),
																	i = seed.length;
																while (i--) {
																	if ((elem = unmatched[i])) {
																		seed[i] = !(matches[i] = elem)
																	}
																}
															}) : function(elem, context, xml) {
																input[0] = elem;
																matcher(input, null, xml, results);
																return !results.pop()
															}
														}),
														"has": markFunction(function(selector) {
															return function(elem) {
																return Sizzle(selector, elem).length > 0
															}
														}),
														"contains": markFunction(function(text) {
															return function(elem) {
																return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1
															}
														}),
														"lang": markFunction(function(lang) {
															if (!ridentifier.test(lang || "")) {
																Sizzle.error("unsupported lang: " + lang)
															}
															lang = lang.replace(runescape, funescape).toLowerCase();
															return function(elem) {
																var elemLang;
																do {
																	if ((elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {
																		elemLang = elemLang.toLowerCase();
																		return elemLang === lang || elemLang.indexOf(lang + "-") === 0
																	}
																} while ((elem = elem.parentNode) && elem.nodeType === 1);
																return false
															}
														}),
														"target": function(elem) {
															var hash = window.location && window.location.hash;
															return hash && hash.slice(1) === elem.id
														},
														"root": function(elem) {
															return elem === docElem
														},
														"focus": function(elem) {
															return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !! (elem.type || elem.href || ~elem.tabIndex)
														},
														"enabled": function(elem) {
															return elem.disabled === false
														},
														"disabled": function(elem) {
															return elem.disabled === true
														},
														"checked": function(elem) {
															var nodeName = elem.nodeName.toLowerCase();
															return (nodeName === "input" && !! elem.checked) || (nodeName === "option" && !! elem.selected)
														},
														"selected": function(elem) {
															if (elem.parentNode) {
																elem.parentNode.selectedIndex
															}
															return elem.selected === true
														},
														"empty": function(elem) {
															for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
																if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4) {
																	return false
																}
															}
															return true
														},
														"parent": function(elem) {
															return !Expr.pseudos["empty"](elem)
														},
														"header": function(elem) {
															return rheader.test(elem.nodeName)
														},
														"input": function(elem) {
															return rinputs.test(elem.nodeName)
														},
														"button": function(elem) {
															var name = elem.nodeName.toLowerCase();
															return name === "input" && elem.type === "button" || name === "button"
														},
														"text": function(elem) {
															var attr;
															return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type)
														},
														"first": createPositionalPseudo(function() {
															return [0]
														}),
														"last": createPositionalPseudo(function(matchIndexes, length) {
															return [length - 1]
														}),
														"eq": createPositionalPseudo(function(matchIndexes, length, argument) {
															return [argument < 0 ? argument + length : argument]
														}),
														"even": createPositionalPseudo(function(matchIndexes, length) {
															var i = 0;
															for (; i < length; i += 2) {
																matchIndexes.push(i)
															}
															return matchIndexes
														}),
														"odd": createPositionalPseudo(function(matchIndexes, length) {
															var i = 1;
															for (; i < length; i += 2) {
																matchIndexes.push(i)
															}
															return matchIndexes
														}),
														"lt": createPositionalPseudo(function(matchIndexes, length, argument) {
															var i = argument < 0 ? argument + length : argument;
															for (; --i >= 0;) {
																matchIndexes.push(i)
															}
															return matchIndexes
														}),
														"gt": createPositionalPseudo(function(matchIndexes, length, argument) {
															var i = argument < 0 ? argument + length : argument;
															for (; ++i < length;) {
																matchIndexes.push(i)
															}
															return matchIndexes
														})
													}
												};
												Expr.pseudos["nth"] = Expr.pseudos["eq"];
												for (i in {
													radio: true,
													checkbox: true,
													file: true,
													password: true,
													image: true
												}) {
													Expr.pseudos[i] = createInputPseudo(i)
												}
												for (i in {
													submit: true,
													reset: true
												}) {
													Expr.pseudos[i] = createButtonPseudo(i)
												}
												function setFilters() {}
												setFilters.prototype = Expr.filters = Expr.pseudos;
												Expr.setFilters = new setFilters();
												function tokenize(selector, parseOnly) {
													var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
													if (cached) {
														return parseOnly ? 0 : cached.slice(0)
													}
													soFar = selector;
													groups = [];
													preFilters = Expr.preFilter;
													while (soFar) {
														if (!matched || (match = rcomma.exec(soFar))) {
															if (match) {
																soFar = soFar.slice(match[0].length) || soFar
															}
															groups.push(tokens = [])
														}
														matched = false;
														if ((match = rcombinators.exec(soFar))) {
															matched = match.shift();
															tokens.push({
																value: matched,
																type: match[0].replace(rtrim, " ")
															});
															soFar = soFar.slice(matched.length)
														}
														for (type in Expr.filter) {
															if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
																matched = match.shift();
																tokens.push({
																	value: matched,
																	type: type,
																	matches: match
																});
																soFar = soFar.slice(matched.length)
															}
														}
														if (!matched) {
															break
														}
													}
													return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0)
												}
												function toSelector(tokens) {
													var i = 0,
														len = tokens.length,
														selector = "";
													for (; i < len; i++) {
														selector += tokens[i].value
													}
													return selector
												}
												function addCombinator(matcher, combinator, base) {
													var dir = combinator.dir,
														checkNonElements = base && dir === "parentNode",
														doneName = done++;
													return combinator.first ?
													function(elem, context, xml) {
														while ((elem = elem[dir])) {
															if (elem.nodeType === 1 || checkNonElements) {
																return matcher(elem, context, xml)
															}
														}
													} : function(elem, context, xml) {
														var data, cache, outerCache, dirkey = dirruns + " " + doneName;
														if (xml) {
															while ((elem = elem[dir])) {
																if (elem.nodeType === 1 || checkNonElements) {
																	if (matcher(elem, context, xml)) {
																		return true
																	}
																}
															}
														} else {
															while ((elem = elem[dir])) {
																if (elem.nodeType === 1 || checkNonElements) {
																	outerCache = elem[expando] || (elem[expando] = {});
																	if ((cache = outerCache[dir]) && cache[0] === dirkey) {
																		if ((data = cache[1]) === true || data === cachedruns) {
																			return data === true
																		}
																	} else {
																		cache = outerCache[dir] = [dirkey];
																		cache[1] = matcher(elem, context, xml) || cachedruns;
																		if (cache[1] === true) {
																			return true
																		}
																	}
																}
															}
														}
													}
												}
												function elementMatcher(matchers) {
													return matchers.length > 1 ?
													function(elem, context, xml) {
														var i = matchers.length;
														while (i--) {
															if (!matchers[i](elem, context, xml)) {
																return false
															}
														}
														return true
													} : matchers[0]
												}
												function condense(unmatched, map, filter, context, xml) {
													var elem, newUnmatched = [],
														i = 0,
														len = unmatched.length,
														mapped = map != null;
													for (; i < len; i++) {
														if ((elem = unmatched[i])) {
															if (!filter || filter(elem, context, xml)) {
																newUnmatched.push(elem);
																if (mapped) {
																	map.push(i)
																}
															}
														}
													}
													return newUnmatched
												}
												function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
													if (postFilter && !postFilter[expando]) {
														postFilter = setMatcher(postFilter)
													}
													if (postFinder && !postFinder[expando]) {
														postFinder = setMatcher(postFinder, postSelector)
													}
													return markFunction(function(seed, results, context, xml) {
														var temp, i, elem, preMap = [],
															postMap = [],
															preexisting = results.length,
															elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
															matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
															matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
														if (matcher) {
															matcher(matcherIn, matcherOut, context, xml)
														}
														if (postFilter) {
															temp = condense(matcherOut, postMap);
															postFilter(temp, [], context, xml);
															i = temp.length;
															while (i--) {
																if ((elem = temp[i])) {
																	matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem)
																}
															}
														}
														if (seed) {
															if (postFinder || preFilter) {
																if (postFinder) {
																	temp = [];
																	i = matcherOut.length;
																	while (i--) {
																		if ((elem = matcherOut[i])) {
																			temp.push((matcherIn[i] = elem))
																		}
																	}
																	postFinder(null, (matcherOut = []), temp, xml)
																}
																i = matcherOut.length;
																while (i--) {
																	if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
																		seed[temp] = !(results[temp] = elem)
																	}
																}
															}
														} else {
															matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
															if (postFinder) {
																postFinder(null, results, matcherOut, xml)
															} else {
																push.apply(results, matcherOut)
															}
														}
													})
												}
												function matcherFromTokens(tokens) {
													var checkContext, matcher, j, len = tokens.length,
														leadingRelative = Expr.relative[tokens[0].type],
														implicitRelative = leadingRelative || Expr.relative[" "],
														i = leadingRelative ? 1 : 0,
														matchContext = addCombinator(function(elem) {
															return elem === checkContext
														}, implicitRelative, true),
														matchAnyContext = addCombinator(function(elem) {
															return indexOf.call(checkContext, elem) > -1
														}, implicitRelative, true),
														matchers = [function(elem, context, xml) {
															return (!leadingRelative && (xml || context !== outermostContext)) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml))
														}];
													for (; i < len; i++) {
														if ((matcher = Expr.relative[tokens[i].type])) {
															matchers = [addCombinator(elementMatcher(matchers), matcher)]
														} else {
															matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
															if (matcher[expando]) {
																j = ++i;
																for (; j < len; j++) {
																	if (Expr.relative[tokens[j].type]) {
																		break
																	}
																}
																return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
																	value: tokens[i - 2].type === " " ? "*" : ""
																})).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens((tokens = tokens.slice(j))), j < len && toSelector(tokens))
															}
															matchers.push(matcher)
														}
													}
													return elementMatcher(matchers)
												}
												function matcherFromGroupMatchers(elementMatchers, setMatchers) {
													var matcherCachedRuns = 0,
														bySet = setMatchers.length > 0,
														byElement = elementMatchers.length > 0,
														superMatcher = function(seed, context, xml, results, expandContext) {
															var elem, j, matcher, setMatched = [],
																matchedCount = 0,
																i = "0",
																unmatched = seed && [],
																outermost = expandContext != null,
																contextBackup = outermostContext,
																elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context),
																dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
															if (outermost) {
																outermostContext = context !== document && context;
																cachedruns = matcherCachedRuns
															}
															for (;
															(elem = elems[i]) != null; i++) {
																if (byElement && elem) {
																	j = 0;
																	while ((matcher = elementMatchers[j++])) {
																		if (matcher(elem, context, xml)) {
																			results.push(elem);
																			break
																		}
																	}
																	if (outermost) {
																		dirruns = dirrunsUnique;
																		cachedruns = ++matcherCachedRuns
																	}
																}
																if (bySet) {
																	if ((elem = !matcher && elem)) {
																		matchedCount--
																	}
																	if (seed) {
																		unmatched.push(elem)
																	}
																}
															}
															matchedCount += i;
															if (bySet && i !== matchedCount) {
																j = 0;
																while ((matcher = setMatchers[j++])) {
																	matcher(unmatched, setMatched, context, xml)
																}
																if (seed) {
																	if (matchedCount > 0) {
																		while (i--) {
																			if (!(unmatched[i] || setMatched[i])) {
																				setMatched[i] = pop.call(results)
																			}
																		}
																	}
																	setMatched = condense(setMatched)
																}
																push.apply(results, setMatched);
																if (outermost && !seed && setMatched.length > 0 && (matchedCount + setMatchers.length) > 1) {
																	Sizzle.uniqueSort(results)
																}
															}
															if (outermost) {
																dirruns = dirrunsUnique;
																outermostContext = contextBackup
															}
															return unmatched
														};
													return bySet ? markFunction(superMatcher) : superMatcher
												}
												compile = Sizzle.compile = function(selector, group) {
													var i, setMatchers = [],
														elementMatchers = [],
														cached = compilerCache[selector + " "];
													if (!cached) {
														if (!group) {
															group = tokenize(selector)
														}
														i = group.length;
														while (i--) {
															cached = matcherFromTokens(group[i]);
															if (cached[expando]) {
																setMatchers.push(cached)
															} else {
																elementMatchers.push(cached)
															}
														}
														cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers))
													}
													return cached
												};
												function multipleContexts(selector, contexts, results) {
													var i = 0,
														len = contexts.length;
													for (; i < len; i++) {
														Sizzle(selector, contexts[i], results)
													}
													return results
												}
												function select(selector, context, results, seed) {
													var i, tokens, token, type, find, match = tokenize(selector);
													if (!seed) {
														if (match.length === 1) {
															tokens = match[0] = match[0].slice(0);
															if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
																context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
																if (!context) {
																	return results
																}
																selector = selector.slice(tokens.shift().value.length)
															}
															i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
															while (i--) {
																token = tokens[i];
																if (Expr.relative[(type = token.type)]) {
																	break
																}
																if ((find = Expr.find[type])) {
																	if ((seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context))) {
																		tokens.splice(i, 1);
																		selector = seed.length && toSelector(tokens);
																		if (!selector) {
																			push.apply(results, seed);
																			return results
																		}
																		break
																	}
																}
															}
														}
													}
													compile(selector, match)(seed, context, !documentIsHTML, results, rsibling.test(selector));
													return results
												}
												support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
												support.detectDuplicates = hasDuplicate;
												setDocument();
												support.sortDetached = assert(function(div1) {
													return div1.compareDocumentPosition(document.createElement("div")) & 1
												});
												if (!assert(function(div) {
													div.innerHTML = "<a href='#'></a>";
													return div.firstChild.getAttribute("href") === "#"
												})) {
													addHandle("type|href|height|width", function(elem, name, isXML) {
														if (!isXML) {
															return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2)
														}
													})
												}
												if (!support.attributes || !assert(function(div) {
													div.innerHTML = "<input/>";
													div.firstChild.setAttribute("value", "");
													return div.firstChild.getAttribute("value") === ""
												})) {
													addHandle("value", function(elem, name, isXML) {
														if (!isXML && elem.nodeName.toLowerCase() === "input") {
															return elem.defaultValue
														}
													})
												}
												if (!assert(function(div) {
													return div.getAttribute("disabled") == null
												})) {
													addHandle(booleans, function(elem, name, isXML) {
														var val;
														if (!isXML) {
															return (val = elem.getAttributeNode(name)) && val.specified ? val.value : elem[name] === true ? name.toLowerCase() : null
														}
													})
												}
												jQuery.find = Sizzle;
												jQuery.expr = Sizzle.selectors;
												jQuery.expr[":"] = jQuery.expr.pseudos;
												jQuery.unique = Sizzle.uniqueSort;
												jQuery.text = Sizzle.getText;
												jQuery.isXMLDoc = Sizzle.isXML;
												jQuery.contains = Sizzle.contains
											})(window);
											var optionsCache = {};
											function createOptions(options) {
												var object = optionsCache[options] = {};
												jQuery.each(options.match(core_rnotwhite) || [], function(_, flag) {
													object[flag] = true
												});
												return object
											}
											jQuery.Callbacks = function(options) {
												options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : jQuery.extend({}, options);
												var firing, memory, fired, firingLength, firingIndex, firingStart, list = [],
													stack = !options.once && [],
													fire = function(data) {
														memory = options.memory && data;
														fired = true;
														firingIndex = firingStart || 0;
														firingStart = 0;
														firingLength = list.length;
														firing = true;
														for (; list && firingIndex < firingLength; firingIndex++) {
															if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
																memory = false;
																break
															}
														}
														firing = false;
														if (list) {
															if (stack) {
																if (stack.length) {
																	fire(stack.shift())
																}
															} else if (memory) {
																list = []
															} else {
																self.disable()
															}
														}
													},
													self = {
														add: function() {
															if (list) {
																var start = list.length;
																(function add(args) {
																	jQuery.each(args, function(_, arg) {
																		var type = jQuery.type(arg);
																		if (type === "function") {
																			if (!options.unique || !self.has(arg)) {
																				list.push(arg)
																			}
																		} else if (arg && arg.length && type !== "string") {
																			add(arg)
																		}
																	})
																})(arguments);
																if (firing) {
																	firingLength = list.length
																} else if (memory) {
																	firingStart = start;
																	fire(memory)
																}
															}
															return this
														},
														remove: function() {
															if (list) {
																jQuery.each(arguments, function(_, arg) {
																	var index;
																	while ((index = jQuery.inArray(arg, list, index)) > -1) {
																		list.splice(index, 1);
																		if (firing) {
																			if (index <= firingLength) {
																				firingLength--
																			}
																			if (index <= firingIndex) {
																				firingIndex--
																			}
																		}
																	}
																})
															}
															return this
														},
														has: function(fn) {
															return fn ? jQuery.inArray(fn, list) > -1 : !! (list && list.length)
														},
														empty: function() {
															list = [];
															firingLength = 0;
															return this
														},
														disable: function() {
															list = stack = memory = undefined;
															return this
														},
														disabled: function() {
															return !list
														},
														lock: function() {
															stack = undefined;
															if (!memory) {
																self.disable()
															}
															return this
														},
														locked: function() {
															return !stack
														},
														fireWith: function(context, args) {
															if (list && (!fired || stack)) {
																args = args || [];
																args = [context, args.slice ? args.slice() : args];
																if (firing) {
																	stack.push(args)
																} else {
																	fire(args)
																}
															}
															return this
														},
														fire: function() {
															self.fireWith(this, arguments);
															return this
														},
														fired: function() {
															return !!fired
														}
													};
												return self
											};
											jQuery.extend({
												Deferred: function(func) {
													var tuples = [
														["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
														["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
														["notify", "progress", jQuery.Callbacks("memory")]
													],
														state = "pending",
														promise = {
															state: function() {
																return state
															},
															always: function() {
																deferred.done(arguments).fail(arguments);
																return this
															},
															then: function() {
																var fns = arguments;
																return jQuery.Deferred(function(newDefer) {
																	jQuery.each(tuples, function(i, tuple) {
																		var action = tuple[0],
																			fn = jQuery.isFunction(fns[i]) && fns[i];
																		deferred[tuple[1]](function() {
																			var returned = fn && fn.apply(this, arguments);
																			if (returned && jQuery.isFunction(returned.promise)) {
																				returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify)
																			} else {
																				newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments)
																			}
																		})
																	});
																	fns = null
																}).promise()
															},
															promise: function(obj) {
																return obj != null ? jQuery.extend(obj, promise) : promise
															}
														},
														deferred = {};
													promise.pipe = promise.then;
													jQuery.each(tuples, function(i, tuple) {
														var list = tuple[2],
															stateString = tuple[3];
														promise[tuple[1]] = list.add;
														if (stateString) {
															list.add(function() {
																state = stateString
															}, tuples[i ^ 1][2].disable, tuples[2][2].lock)
														}
														deferred[tuple[0]] = function() {
															deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
															return this
														};
														deferred[tuple[0] + "With"] = list.fireWith
													});
													promise.promise(deferred);
													if (func) {
														func.call(deferred, deferred)
													}
													return deferred
												},
												when: function(subordinate) {
													var i = 0,
														resolveValues = core_slice.call(arguments),
														length = resolveValues.length,
														remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
														deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
														updateFunc = function(i, contexts, values) {
															return function(value) {
																contexts[i] = this;
																values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
																if (values === progressValues) {
																	deferred.notifyWith(contexts, values)
																} else if (!(--remaining)) {
																	deferred.resolveWith(contexts, values)
																}
															}
														},
														progressValues, progressContexts, resolveContexts;
													if (length > 1) {
														progressValues = new Array(length);
														progressContexts = new Array(length);
														resolveContexts = new Array(length);
														for (; i < length; i++) {
															if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
																resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues))
															} else {
																--remaining
															}
														}
													}
													if (!remaining) {
														deferred.resolveWith(resolveContexts, resolveValues)
													}
													return deferred.promise()
												}
											});
											jQuery.support = (function(support) {
												var all, a, input, select, fragment, opt, eventName, isSupported, i, div = document.createElement("div");
												div.setAttribute("className", "t");
												div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
												all = div.getElementsByTagName("*") || [];
												a = div.getElementsByTagName("a")[0];
												if (!a || !a.style || !all.length) {
													return support
												}
												select = document.createElement("select");
												opt = select.appendChild(document.createElement("option"));
												input = div.getElementsByTagName("input")[0];
												a.style.cssText = "top:1px;float:left;opacity:.5";
												support.getSetAttribute = div.className !== "t";
												support.leadingWhitespace = div.firstChild.nodeType === 3;
												support.tbody = !div.getElementsByTagName("tbody").length;
												support.htmlSerialize = !! div.getElementsByTagName("link").length;
												support.style = /top/.test(a.getAttribute("style"));
												support.hrefNormalized = a.getAttribute("href") === "/a";
												support.opacity = /^0.5/.test(a.style.opacity);
												support.cssFloat = !! a.style.cssFloat;
												support.checkOn = !! input.value;
												support.optSelected = opt.selected;
												support.enctype = !! document.createElement("form").enctype;
												support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";
												support.inlineBlockNeedsLayout = false;
												support.shrinkWrapBlocks = false;
												support.pixelPosition = false;
												support.deleteExpando = true;
												support.noCloneEvent = true;
												support.reliableMarginRight = true;
												support.boxSizingReliable = true;
												input.checked = true;
												support.noCloneChecked = input.cloneNode(true).checked;
												select.disabled = true;
												support.optDisabled = !opt.disabled;
												try {
													delete div.test
												} catch (e) {
													support.deleteExpando = false
												}
												input = document.createElement("input");
												input.setAttribute("value", "");
												support.input = input.getAttribute("value") === "";
												input.value = "t";
												input.setAttribute("type", "radio");
												support.radioValue = input.value === "t";
												input.setAttribute("checked", "t");
												input.setAttribute("name", "t");
												fragment = document.createDocumentFragment();
												fragment.appendChild(input);
												support.appendChecked = input.checked;
												support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
												if (div.attachEvent) {
													div.attachEvent("onclick", function() {
														support.noCloneEvent = false
													});
													div.cloneNode(true).click()
												}
												for (i in {
													submit: true,
													change: true,
													focusin: true
												}) {
													div.setAttribute(eventName = "on" + i, "t");
													support[i + "Bubbles"] = eventName in window || div.attributes[eventName].expando === false
												}
												div.style.backgroundClip = "content-box";
												div.cloneNode(true).style.backgroundClip = "";
												support.clearCloneStyle = div.style.backgroundClip === "content-box";
												for (i in jQuery(support)) {
													break
												}
												support.ownLast = i !== "0";
												jQuery(function() {
													var container, marginDiv, tds, divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
														body = document.getElementsByTagName("body")[0];
													if (!body) {
														return
													}
													container = document.createElement("div");
													container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
													body.appendChild(container).appendChild(div);
													div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
													tds = div.getElementsByTagName("td");
													tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
													isSupported = (tds[0].offsetHeight === 0);
													tds[0].style.display = "";
													tds[1].style.display = "none";
													support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0);
													div.innerHTML = "";
													div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
													jQuery.swap(body, body.style.zoom != null ? {
														zoom: 1
													} : {}, function() {
														support.boxSizing = div.offsetWidth === 4
													});
													if (window.getComputedStyle) {
														support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
														support.boxSizingReliable = (window.getComputedStyle(div, null) || {
															width: "4px"
														}).width === "4px";
														marginDiv = div.appendChild(document.createElement("div"));
														marginDiv.style.cssText = div.style.cssText = divReset;
														marginDiv.style.marginRight = marginDiv.style.width = "0";
														div.style.width = "1px";
														support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight)
													}
													if (typeof div.style.zoom !== core_strundefined) {
														div.innerHTML = "";
														div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
														support.inlineBlockNeedsLayout = (div.offsetWidth === 3);
														div.style.display = "block";
														div.innerHTML = "<div></div>";
														div.firstChild.style.width = "5px";
														support.shrinkWrapBlocks = (div.offsetWidth !== 3);
														if (support.inlineBlockNeedsLayout) {
															body.style.zoom = 1
														}
													}
													body.removeChild(container);
													container = div = tds = marginDiv = null
												});
												all = select = fragment = opt = a = input = null;
												return support
											})({});
											var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
												rmultiDash = /([A-Z])/g;
											function internalData(elem, name, data, pvt) {
												if (!jQuery.acceptData(elem)) {
													return
												}
												var ret, thisCache, internalKey = jQuery.expando,
													isNode = elem.nodeType,
													cache = isNode ? jQuery.cache : elem,
													id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
												if ((!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string") {
													return
												}
												if (!id) {
													if (isNode) {
														id = elem[internalKey] = core_deletedIds.pop() || jQuery.guid++
													} else {
														id = internalKey
													}
												}
												if (!cache[id]) {
													cache[id] = isNode ? {} : {
														toJSON: jQuery.noop
													}
												}
												if (typeof name === "object" || typeof name === "function") {
													if (pvt) {
														cache[id] = jQuery.extend(cache[id], name)
													} else {
														cache[id].data = jQuery.extend(cache[id].data, name)
													}
												}
												thisCache = cache[id];
												if (!pvt) {
													if (!thisCache.data) {
														thisCache.data = {}
													}
													thisCache = thisCache.data
												}
												if (data !== undefined) {
													thisCache[jQuery.camelCase(name)] = data
												}
												if (typeof name === "string") {
													ret = thisCache[name];
													if (ret == null) {
														ret = thisCache[jQuery.camelCase(name)]
													}
												} else {
													ret = thisCache
												}
												return ret
											}
											function internalRemoveData(elem, name, pvt) {
												if (!jQuery.acceptData(elem)) {
													return
												}
												var thisCache, i, isNode = elem.nodeType,
													cache = isNode ? jQuery.cache : elem,
													id = isNode ? elem[jQuery.expando] : jQuery.expando;
												if (!cache[id]) {
													return
												}
												if (name) {
													thisCache = pvt ? cache[id] : cache[id].data;
													if (thisCache) {
														if (!jQuery.isArray(name)) {
															if (name in thisCache) {
																name = [name]
															} else {
																name = jQuery.camelCase(name);
																if (name in thisCache) {
																	name = [name]
																} else {
																	name = name.split(" ")
																}
															}
														} else {
															name = name.concat(jQuery.map(name, jQuery.camelCase))
														}
														i = name.length;
														while (i--) {
															delete thisCache[name[i]]
														}
														if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
															return
														}
													}
												}
												if (!pvt) {
													delete cache[id].data;
													if (!isEmptyDataObject(cache[id])) {
														return
													}
												}
												if (isNode) {
													jQuery.cleanData([elem], true)
												} else if (jQuery.support.deleteExpando || cache != cache.window) {
													delete cache[id]
												} else {
													cache[id] = null
												}
											}
											jQuery.extend({
												cache: {},
												noData: {
													"applet": true,
													"embed": true,
													"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
												},
												hasData: function(elem) {
													elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
													return !!elem && !isEmptyDataObject(elem)
												},
												data: function(elem, name, data) {
													return internalData(elem, name, data)
												},
												removeData: function(elem, name) {
													return internalRemoveData(elem, name)
												},
												_data: function(elem, name, data) {
													return internalData(elem, name, data, true)
												},
												_removeData: function(elem, name) {
													return internalRemoveData(elem, name, true)
												},
												acceptData: function(elem) {
													if (elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9) {
														return false
													}
													var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
													return !noData || noData !== true && elem.getAttribute("classid") === noData
												}
											});
											jQuery.fn.extend({
												data: function(key, value) {
													var attrs, name, data = null,
														i = 0,
														elem = this[0];
													if (key === undefined) {
														if (this.length) {
															data = jQuery.data(elem);
															if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
																attrs = elem.attributes;
																for (; i < attrs.length; i++) {
																	name = attrs[i].name;
																	if (name.indexOf("data-") === 0) {
																		name = jQuery.camelCase(name.slice(5));
																		dataAttr(elem, name, data[name])
																	}
																}
																jQuery._data(elem, "parsedAttrs", true)
															}
														}
														return data
													}
													if (typeof key === "object") {
														return this.each(function() {
															jQuery.data(this, key)
														})
													}
													return arguments.length > 1 ? this.each(function() {
														jQuery.data(this, key, value)
													}) : elem ? dataAttr(elem, key, jQuery.data(elem, key)) : null
												},
												removeData: function(key) {
													return this.each(function() {
														jQuery.removeData(this, key)
													})
												}
											});
											function dataAttr(elem, key, data) {
												if (data === undefined && elem.nodeType === 1) {
													var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
													data = elem.getAttribute(name);
													if (typeof data === "string") {
														try {
															data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data
														} catch (e) {}
														jQuery.data(elem, key, data)
													} else {
														data = undefined
													}
												}
												return data
											}
											function isEmptyDataObject(obj) {
												var name;
												for (name in obj) {
													if (name === "data" && jQuery.isEmptyObject(obj[name])) {
														continue
													}
													if (name !== "toJSON") {
														return false
													}
												}
												return true
											}
											jQuery.extend({
												queue: function(elem, type, data) {
													var queue;
													if (elem) {
														type = (type || "fx") + "queue";
														queue = jQuery._data(elem, type);
														if (data) {
															if (!queue || jQuery.isArray(data)) {
																queue = jQuery._data(elem, type, jQuery.makeArray(data))
															} else {
																queue.push(data)
															}
														}
														return queue || []
													}
												},
												dequeue: function(elem, type) {
													type = type || "fx";
													var queue = jQuery.queue(elem, type),
														startLength = queue.length,
														fn = queue.shift(),
														hooks = jQuery._queueHooks(elem, type),
														next = function() {
															jQuery.dequeue(elem, type)
														};
													if (fn === "inprogress") {
														fn = queue.shift();
														startLength--
													}
													if (fn) {
														if (type === "fx") {
															queue.unshift("inprogress")
														}
														delete hooks.stop;
														fn.call(elem, next, hooks)
													}
													if (!startLength && hooks) {
														hooks.empty.fire()
													}
												},
												_queueHooks: function(elem, type) {
													var key = type + "queueHooks";
													return jQuery._data(elem, key) || jQuery._data(elem, key, {
														empty: jQuery.Callbacks("once memory").add(function() {
															jQuery._removeData(elem, type + "queue");
															jQuery._removeData(elem, key)
														})
													})
												}
											});
											jQuery.fn.extend({
												queue: function(type, data) {
													var setter = 2;
													if (typeof type !== "string") {
														data = type;
														type = "fx";
														setter--
													}
													if (arguments.length < setter) {
														return jQuery.queue(this[0], type)
													}
													return data === undefined ? this : this.each(function() {
														var queue = jQuery.queue(this, type, data);
														jQuery._queueHooks(this, type);
														if (type === "fx" && queue[0] !== "inprogress") {
															jQuery.dequeue(this, type)
														}
													})
												},
												dequeue: function(type) {
													return this.each(function() {
														jQuery.dequeue(this, type)
													})
												},
												delay: function(time, type) {
													time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
													type = type || "fx";
													return this.queue(type, function(next, hooks) {
														var timeout = setTimeout(next, time);
														hooks.stop = function() {
															clearTimeout(timeout)
														}
													})
												},
												clearQueue: function(type) {
													return this.queue(type || "fx", [])
												},
												promise: function(type, obj) {
													var tmp, count = 1,
														defer = jQuery.Deferred(),
														elements = this,
														i = this.length,
														resolve = function() {
															if (!(--count)) {
																defer.resolveWith(elements, [elements])
															}
														};
													if (typeof type !== "string") {
														obj = type;
														type = undefined
													}
													type = type || "fx";
													while (i--) {
														tmp = jQuery._data(elements[i], type + "queueHooks");
														if (tmp && tmp.empty) {
															count++;
															tmp.empty.add(resolve)
														}
													}
													resolve();
													return defer.promise(obj)
												}
											});
											var nodeHook, boolHook, rclass = /[\t\r\n\f]/g,
												rreturn = /\r/g,
												rfocusable = /^(?:input|select|textarea|button|object)$/i,
												rclickable = /^(?:a|area)$/i,
												ruseDefault = /^(?:checked|selected)$/i,
												getSetAttribute = jQuery.support.getSetAttribute,
												getSetInput = jQuery.support.input;
											jQuery.fn.extend({
												attr: function(name, value) {
													return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1)
												},
												removeAttr: function(name) {
													return this.each(function() {
														jQuery.removeAttr(this, name)
													})
												},
												prop: function(name, value) {
													return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1)
												},
												removeProp: function(name) {
													name = jQuery.propFix[name] || name;
													return this.each(function() {
														try {
															this[name] = undefined;
															delete this[name]
														} catch (e) {}
													})
												},
												addClass: function(value) {
													var classes, elem, cur, clazz, j, i = 0,
														len = this.length,
														proceed = typeof value === "string" && value;
													if (jQuery.isFunction(value)) {
														return this.each(function(j) {
															jQuery(this).addClass(value.call(this, j, this.className))
														})
													}
													if (proceed) {
														classes = (value || "").match(core_rnotwhite) || [];
														for (; i < len; i++) {
															elem = this[i];
															cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");
															if (cur) {
																j = 0;
																while ((clazz = classes[j++])) {
																	if (cur.indexOf(" " + clazz + " ") < 0) {
																		cur += clazz + " "
																	}
																}
																elem.className = jQuery.trim(cur)
															}
														}
													}
													return this
												},
												removeClass: function(value) {
													var classes, elem, cur, clazz, j, i = 0,
														len = this.length,
														proceed = arguments.length === 0 || typeof value === "string" && value;
													if (jQuery.isFunction(value)) {
														return this.each(function(j) {
															jQuery(this).removeClass(value.call(this, j, this.className))
														})
													}
													if (proceed) {
														classes = (value || "").match(core_rnotwhite) || [];
														for (; i < len; i++) {
															elem = this[i];
															cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");
															if (cur) {
																j = 0;
																while ((clazz = classes[j++])) {
																	while (cur.indexOf(" " + clazz + " ") >= 0) {
																		cur = cur.replace(" " + clazz + " ", " ")
																	}
																}
																elem.className = value ? jQuery.trim(cur) : ""
															}
														}
													}
													return this
												},
												toggleClass: function(value, stateVal) {
													var type = typeof value;
													if (typeof stateVal === "boolean" && type === "string") {
														return stateVal ? this.addClass(value) : this.removeClass(value)
													}
													if (jQuery.isFunction(value)) {
														return this.each(function(i) {
															jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal)
														})
													}
													return this.each(function() {
														if (type === "string") {
															var className, i = 0,
																self = jQuery(this),
																classNames = value.match(core_rnotwhite) || [];
															while ((className = classNames[i++])) {
																if (self.hasClass(className)) {
																	self.removeClass(className)
																} else {
																	self.addClass(className)
																}
															}
														} else if (type === core_strundefined || type === "boolean") {
															if (this.className) {
																jQuery._data(this, "__className__", this.className)
															}
															this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || ""
														}
													})
												},
												hasClass: function(selector) {
													var className = " " + selector + " ",
														i = 0,
														l = this.length;
													for (; i < l; i++) {
														if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
															return true
														}
													}
													return false
												},
												val: function(value) {
													var ret, hooks, isFunction, elem = this[0];
													if (!arguments.length) {
														if (elem) {
															hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
															if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
																return ret
															}
															ret = elem.value;
															return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret
														}
														return
													}
													isFunction = jQuery.isFunction(value);
													return this.each(function(i) {
														var val;
														if (this.nodeType !== 1) {
															return
														}
														if (isFunction) {
															val = value.call(this, i, jQuery(this).val())
														} else {
															val = value
														}
														if (val == null) {
															val = ""
														} else if (typeof val === "number") {
															val += ""
														} else if (jQuery.isArray(val)) {
															val = jQuery.map(val, function(value) {
																return value == null ? "" : value + ""
															})
														}
														hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
														if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
															this.value = val
														}
													})
												}
											});
											jQuery.extend({
												valHooks: {
													option: {
														get: function(elem) {
															var val = jQuery.find.attr(elem, "value");
															return val != null ? val : elem.text
														}
													},
													select: {
														get: function(elem) {
															var value, option, options = elem.options,
																index = elem.selectedIndex,
																one = elem.type === "select-one" || index < 0,
																values = one ? null : [],
																max = one ? index + 1 : options.length,
																i = index < 0 ? max : one ? index : 0;
															for (; i < max; i++) {
																option = options[i];
																if ((option.selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
																	value = jQuery(option).val();
																	if (one) {
																		return value
																	}
																	values.push(value)
																}
															}
															return values
														},
														set: function(elem, value) {
															var optionSet, option, options = elem.options,
																values = jQuery.makeArray(value),
																i = options.length;
															while (i--) {
																option = options[i];
																if ((option.selected = jQuery.inArray(jQuery(option).val(), values) >= 0)) {
																	optionSet = true
																}
															}
															if (!optionSet) {
																elem.selectedIndex = -1
															}
															return values
														}
													}
												},
												attr: function(elem, name, value) {
													var hooks, ret, nType = elem.nodeType;
													if (!elem || nType === 3 || nType === 8 || nType === 2) {
														return
													}
													if (typeof elem.getAttribute === core_strundefined) {
														return jQuery.prop(elem, name, value)
													}
													if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
														name = name.toLowerCase();
														hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)
													}
													if (value !== undefined) {
														if (value === null) {
															jQuery.removeAttr(elem, name)
														} else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
															return ret
														} else {
															elem.setAttribute(name, value + "");
															return value
														}
													} else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
														return ret
													} else {
														ret = jQuery.find.attr(elem, name);
														return ret == null ? undefined : ret
													}
												},
												removeAttr: function(elem, value) {
													var name, propName, i = 0,
														attrNames = value && value.match(core_rnotwhite);
													if (attrNames && elem.nodeType === 1) {
														while ((name = attrNames[i++])) {
															propName = jQuery.propFix[name] || name;
															if (jQuery.expr.match.bool.test(name)) {
																if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
																	elem[propName] = false
																} else {
																	elem[jQuery.camelCase("default-" + name)] = elem[propName] = false
																}
															} else {
																jQuery.attr(elem, name, "")
															}
															elem.removeAttribute(getSetAttribute ? name : propName)
														}
													}
												},
												attrHooks: {
													type: {
														set: function(elem, value) {
															if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
																var val = elem.value;
																elem.setAttribute("type", value);
																if (val) {
																	elem.value = val
																}
																return value
															}
														}
													}
												},
												propFix: {
													"for": "htmlFor",
													"class": "className"
												},
												prop: function(elem, name, value) {
													var ret, hooks, notxml, nType = elem.nodeType;
													if (!elem || nType === 3 || nType === 8 || nType === 2) {
														return
													}
													notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
													if (notxml) {
														name = jQuery.propFix[name] || name;
														hooks = jQuery.propHooks[name]
													}
													if (value !== undefined) {
														return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : (elem[name] = value)
													} else {
														return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name]
													}
												},
												propHooks: {
													tabIndex: {
														get: function(elem) {
															var tabindex = jQuery.find.attr(elem, "tabindex");
															return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1
														}
													}
												}
											});
											boolHook = {
												set: function(elem, value, name) {
													if (value === false) {
														jQuery.removeAttr(elem, name)
													} else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
														elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name)
													} else {
														elem[jQuery.camelCase("default-" + name)] = elem[name] = true
													}
													return name
												}
											};
											jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
												var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;
												jQuery.expr.attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ?
												function(elem, name, isXML) {
													var fn = jQuery.expr.attrHandle[name],
														ret = isXML ? undefined : (jQuery.expr.attrHandle[name] = undefined) != getter(elem, name, isXML) ? name.toLowerCase() : null;
													jQuery.expr.attrHandle[name] = fn;
													return ret
												} : function(elem, name, isXML) {
													return isXML ? undefined : elem[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null
												}
											});
											if (!getSetInput || !getSetAttribute) {
												jQuery.attrHooks.value = {
													set: function(elem, value, name) {
														if (jQuery.nodeName(elem, "input")) {
															elem.defaultValue = value
														} else {
															return nodeHook && nodeHook.set(elem, value, name)
														}
													}
												}
											}
											if (!getSetAttribute) {
												nodeHook = {
													set: function(elem, value, name) {
														var ret = elem.getAttributeNode(name);
														if (!ret) {
															elem.setAttributeNode((ret = elem.ownerDocument.createAttribute(name)))
														}
														ret.value = value += "";
														return name === "value" || value === elem.getAttribute(name) ? value : undefined
													}
												};
												jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords = function(elem, name, isXML) {
													var ret;
													return isXML ? undefined : (ret = elem.getAttributeNode(name)) && ret.value !== "" ? ret.value : null
												};
												jQuery.valHooks.button = {
													get: function(elem, name) {
														var ret = elem.getAttributeNode(name);
														return ret && ret.specified ? ret.value : undefined
													},
													set: nodeHook.set
												};
												jQuery.attrHooks.contenteditable = {
													set: function(elem, value, name) {
														nodeHook.set(elem, value === "" ? false : value, name)
													}
												};
												jQuery.each(["width", "height"], function(i, name) {
													jQuery.attrHooks[name] = {
														set: function(elem, value) {
															if (value === "") {
																elem.setAttribute(name, "auto");
																return value
															}
														}
													}
												})
											}
											if (!jQuery.support.hrefNormalized) {
												jQuery.each(["href", "src"], function(i, name) {
													jQuery.propHooks[name] = {
														get: function(elem) {
															return elem.getAttribute(name, 4)
														}
													}
												})
											}
											if (!jQuery.support.style) {
												jQuery.attrHooks.style = {
													get: function(elem) {
														return elem.style.cssText || undefined
													},
													set: function(elem, value) {
														return (elem.style.cssText = value + "")
													}
												}
											}
											if (!jQuery.support.optSelected) {
												jQuery.propHooks.selected = {
													get: function(elem) {
														var parent = elem.parentNode;
														if (parent) {
															parent.selectedIndex;
															if (parent.parentNode) {
																parent.parentNode.selectedIndex
															}
														}
														return null
													}
												}
											}
											jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
												jQuery.propFix[this.toLowerCase()] = this
											});
											if (!jQuery.support.enctype) {
												jQuery.propFix.enctype = "encoding"
											}
											jQuery.each(["radio", "checkbox"], function() {
												jQuery.valHooks[this] = {
													set: function(elem, value) {
														if (jQuery.isArray(value)) {
															return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0)
														}
													}
												};
												if (!jQuery.support.checkOn) {
													jQuery.valHooks[this].get = function(elem) {
														return elem.getAttribute("value") === null ? "on" : elem.value
													}
												}
											});
											var rformElems = /^(?:input|select|textarea)$/i,
												rkeyEvent = /^key/,
												rmouseEvent = /^(?:mouse|contextmenu)|click/,
												rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
												rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
											function returnTrue() {
												return true
											}
											function returnFalse() {
												return false
											}
											function safeActiveElement() {
												try {
													return document.activeElement
												} catch (err) {}
											}
											jQuery.event = {
												global: {},
												add: function(elem, types, handler, data, selector) {
													var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
													if (!elemData) {
														return
													}
													if (handler.handler) {
														handleObjIn = handler;
														handler = handleObjIn.handler;
														selector = handleObjIn.selector
													}
													if (!handler.guid) {
														handler.guid = jQuery.guid++
													}
													if (!(events = elemData.events)) {
														events = elemData.events = {}
													}
													if (!(eventHandle = elemData.handle)) {
														eventHandle = elemData.handle = function(e) {
															return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined
														};
														eventHandle.elem = elem
													}
													types = (types || "").match(core_rnotwhite) || [""];
													t = types.length;
													while (t--) {
														tmp = rtypenamespace.exec(types[t]) || [];
														type = origType = tmp[1];
														namespaces = (tmp[2] || "").split(".").sort();
														if (!type) {
															continue
														}
														special = jQuery.event.special[type] || {};
														type = (selector ? special.delegateType : special.bindType) || type;
														special = jQuery.event.special[type] || {};
														handleObj = jQuery.extend({
															type: type,
															origType: origType,
															data: data,
															handler: handler,
															guid: handler.guid,
															selector: selector,
															needsContext: selector && jQuery.expr.match.needsContext.test(selector),
															namespace: namespaces.join(".")
														}, handleObjIn);
														if (!(handlers = events[type])) {
															handlers = events[type] = [];
															handlers.delegateCount = 0;
															if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
																if (elem.addEventListener) {
																	elem.addEventListener(type, eventHandle, false)
																} else if (elem.attachEvent) {
																	elem.attachEvent("on" + type, eventHandle)
																}
															}
														}
														if (special.add) {
															special.add.call(elem, handleObj);
															if (!handleObj.handler.guid) {
																handleObj.handler.guid = handler.guid
															}
														}
														if (selector) {
															handlers.splice(handlers.delegateCount++, 0, handleObj)
														} else {
															handlers.push(handleObj)
														}
														jQuery.event.global[type] = true
													}
													elem = null
												},
												remove: function(elem, types, handler, selector, mappedTypes) {
													var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
													if (!elemData || !(events = elemData.events)) {
														return
													}
													types = (types || "").match(core_rnotwhite) || [""];
													t = types.length;
													while (t--) {
														tmp = rtypenamespace.exec(types[t]) || [];
														type = origType = tmp[1];
														namespaces = (tmp[2] || "").split(".").sort();
														if (!type) {
															for (type in events) {
																jQuery.event.remove(elem, type + types[t], handler, selector, true)
															}
															continue
														}
														special = jQuery.event.special[type] || {};
														type = (selector ? special.delegateType : special.bindType) || type;
														handlers = events[type] || [];
														tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
														origCount = j = handlers.length;
														while (j--) {
															handleObj = handlers[j];
															if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
																handlers.splice(j, 1);
																if (handleObj.selector) {
																	handlers.delegateCount--
																}
																if (special.remove) {
																	special.remove.call(elem, handleObj)
																}
															}
														}
														if (origCount && !handlers.length) {
															if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
																jQuery.removeEvent(elem, type, elemData.handle)
															}
															delete events[type]
														}
													}
													if (jQuery.isEmptyObject(events)) {
														delete elemData.handle;
														jQuery._removeData(elem, "events")
													}
												},
												trigger: function(event, data, elem, onlyHandlers) {
													var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [elem || document],
														type = core_hasOwn.call(event, "type") ? event.type : event,
														namespaces = core_hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
													cur = tmp = elem = elem || document;
													if (elem.nodeType === 3 || elem.nodeType === 8) {
														return
													}
													if (rfocusMorph.test(type + jQuery.event.triggered)) {
														return
													}
													if (type.indexOf(".") >= 0) {
														namespaces = type.split(".");
														type = namespaces.shift();
														namespaces.sort()
													}
													ontype = type.indexOf(":") < 0 && "on" + type;
													event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
													event.isTrigger = onlyHandlers ? 2 : 3;
													event.namespace = namespaces.join(".");
													event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
													event.result = undefined;
													if (!event.target) {
														event.target = elem
													}
													data = data == null ? [event] : jQuery.makeArray(data, [event]);
													special = jQuery.event.special[type] || {};
													if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
														return
													}
													if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
														bubbleType = special.delegateType || type;
														if (!rfocusMorph.test(bubbleType + type)) {
															cur = cur.parentNode
														}
														for (; cur; cur = cur.parentNode) {
															eventPath.push(cur);
															tmp = cur
														}
														if (tmp === (elem.ownerDocument || document)) {
															eventPath.push(tmp.defaultView || tmp.parentWindow || window)
														}
													}
													i = 0;
													while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
														event.type = i > 1 ? bubbleType : special.bindType || type;
														handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
														if (handle) {
															handle.apply(cur, data)
														}
														handle = ontype && cur[ontype];
														if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
															event.preventDefault()
														}
													}
													event.type = type;
													if (!onlyHandlers && !event.isDefaultPrevented()) {
														if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && jQuery.acceptData(elem)) {
															if (ontype && elem[type] && !jQuery.isWindow(elem)) {
																tmp = elem[ontype];
																if (tmp) {
																	elem[ontype] = null
																}
																jQuery.event.triggered = type;
																try {
																	elem[type]()
																} catch (e) {}
																jQuery.event.triggered = undefined;
																if (tmp) {
																	elem[ontype] = tmp
																}
															}
														}
													}
													return event.result
												},
												dispatch: function(event) {
													event = jQuery.event.fix(event);
													var i, ret, handleObj, matched, j, handlerQueue = [],
														args = core_slice.call(arguments),
														handlers = (jQuery._data(this, "events") || {})[event.type] || [],
														special = jQuery.event.special[event.type] || {};
													args[0] = event;
													event.delegateTarget = this;
													if (special.preDispatch && special.preDispatch.call(this, event) === false) {
														return
													}
													handlerQueue = jQuery.event.handlers.call(this, event, handlers);
													i = 0;
													while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
														event.currentTarget = matched.elem;
														j = 0;
														while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
															if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
																event.handleObj = handleObj;
																event.data = handleObj.data;
																ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
																if (ret !== undefined) {
																	if ((event.result = ret) === false) {
																		event.preventDefault();
																		event.stopPropagation()
																	}
																}
															}
														}
													}
													if (special.postDispatch) {
														special.postDispatch.call(this, event)
													}
													return event.result
												},
												handlers: function(event, handlers) {
													var sel, handleObj, matches, i, handlerQueue = [],
														delegateCount = handlers.delegateCount,
														cur = event.target;
													if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {
														for (; cur != this; cur = cur.parentNode || this) {
															if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
																matches = [];
																for (i = 0; i < delegateCount; i++) {
																	handleObj = handlers[i];
																	sel = handleObj.selector + " ";
																	if (matches[sel] === undefined) {
																		matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length
																	}
																	if (matches[sel]) {
																		matches.push(handleObj)
																	}
																}
																if (matches.length) {
																	handlerQueue.push({
																		elem: cur,
																		handlers: matches
																	})
																}
															}
														}
													}
													if (delegateCount < handlers.length) {
														handlerQueue.push({
															elem: this,
															handlers: handlers.slice(delegateCount)
														})
													}
													return handlerQueue
												},
												fix: function(event) {
													if (event[jQuery.expando]) {
														return event
													}
													var i, prop, copy, type = event.type,
														originalEvent = event,
														fixHook = this.fixHooks[type];
													if (!fixHook) {
														this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}
													}
													copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
													event = new jQuery.Event(originalEvent);
													i = copy.length;
													while (i--) {
														prop = copy[i];
														event[prop] = originalEvent[prop]
													}
													if (!event.target) {
														event.target = originalEvent.srcElement || document
													}
													if (event.target.nodeType === 3) {
														event.target = event.target.parentNode
													}
													event.metaKey = !! event.metaKey;
													return fixHook.filter ? fixHook.filter(event, originalEvent) : event
												},
												props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
												fixHooks: {},
												keyHooks: {
													props: "char charCode key keyCode".split(" "),
													filter: function(event, original) {
														if (event.which == null) {
															event.which = original.charCode != null ? original.charCode : original.keyCode
														}
														return event
													}
												},
												mouseHooks: {
													props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
													filter: function(event, original) {
														var body, eventDoc, doc, button = original.button,
															fromElement = original.fromElement;
														if (event.pageX == null && original.clientX != null) {
															eventDoc = event.target.ownerDocument || document;
															doc = eventDoc.documentElement;
															body = eventDoc.body;
															event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
															event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)
														}
														if (!event.relatedTarget && fromElement) {
															event.relatedTarget = fromElement === event.target ? original.toElement : fromElement
														}
														if (!event.which && button !== undefined) {
															event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)))
														}
														return event
													}
												},
												special: {
													load: {
														noBubble: true
													},
													focus: {
														trigger: function() {
															if (this !== safeActiveElement() && this.focus) {
																try {
																	this.focus();
																	return false
																} catch (e) {}
															}
														},
														delegateType: "focusin"
													},
													blur: {
														trigger: function() {
															if (this === safeActiveElement() && this.blur) {
																this.blur();
																return false
															}
														},
														delegateType: "focusout"
													},
													click: {
														trigger: function() {
															if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
																this.click();
																return false
															}
														},
														_default: function(event) {
															return jQuery.nodeName(event.target, "a")
														}
													},
													beforeunload: {
														postDispatch: function(event) {
															if (event.result !== undefined) {
																event.originalEvent.returnValue = event.result
															}
														}
													}
												},
												simulate: function(type, elem, event, bubble) {
													var e = jQuery.extend(new jQuery.Event(), event, {
														type: type,
														isSimulated: true,
														originalEvent: {}
													});
													if (bubble) {
														jQuery.event.trigger(e, null, elem)
													} else {
														jQuery.event.dispatch.call(elem, e)
													}
													if (e.isDefaultPrevented()) {
														event.preventDefault()
													}
												}
											};
											jQuery.removeEvent = document.removeEventListener ?
											function(elem, type, handle) {
												if (elem.removeEventListener) {
													elem.removeEventListener(type, handle, false)
												}
											} : function(elem, type, handle) {
												var name = "on" + type;
												if (elem.detachEvent) {
													if (typeof elem[name] === core_strundefined) {
														elem[name] = null
													}
													elem.detachEvent(name, handle)
												}
											};
											jQuery.Event = function(src, props) {
												if (!(this instanceof jQuery.Event)) {
													return new jQuery.Event(src, props)
												}
												if (src && src.type) {
													this.originalEvent = src;
													this.type = src.type;
													this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse
												} else {
													this.type = src
												}
												if (props) {
													jQuery.extend(this, props)
												}
												this.timeStamp = src && src.timeStamp || jQuery.now();
												this[jQuery.expando] = true
											};
											jQuery.Event.prototype = {
												isDefaultPrevented: returnFalse,
												isPropagationStopped: returnFalse,
												isImmediatePropagationStopped: returnFalse,
												preventDefault: function() {
													var e = this.originalEvent;
													this.isDefaultPrevented = returnTrue;
													if (!e) {
														return
													}
													if (e.preventDefault) {
														e.preventDefault()
													} else {
														e.returnValue = false
													}
												},
												stopPropagation: function() {
													var e = this.originalEvent;
													this.isPropagationStopped = returnTrue;
													if (!e) {
														return
													}
													if (e.stopPropagation) {
														e.stopPropagation()
													}
													e.cancelBubble = true
												},
												stopImmediatePropagation: function() {
													this.isImmediatePropagationStopped = returnTrue;
													this.stopPropagation()
												}
											};
											jQuery.each({
												mouseenter: "mouseover",
												mouseleave: "mouseout"
											}, function(orig, fix) {
												jQuery.event.special[orig] = {
													delegateType: fix,
													bindType: fix,
													handle: function(event) {
														var ret, target = this,
															related = event.relatedTarget,
															handleObj = event.handleObj;
														if (!related || (related !== target && !jQuery.contains(target, related))) {
															event.type = handleObj.origType;
															ret = handleObj.handler.apply(this, arguments);
															event.type = fix
														}
														return ret
													}
												}
											});
											if (!jQuery.support.submitBubbles) {
												jQuery.event.special.submit = {
													setup: function() {
														if (jQuery.nodeName(this, "form")) {
															return false
														}
														jQuery.event.add(this, "click._submit keypress._submit", function(e) {
															var elem = e.target,
																form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
															if (form && !jQuery._data(form, "submitBubbles")) {
																jQuery.event.add(form, "submit._submit", function(event) {
																	event._submit_bubble = true
																});
																jQuery._data(form, "submitBubbles", true)
															}
														})
													},
													postDispatch: function(event) {
														if (event._submit_bubble) {
															delete event._submit_bubble;
															if (this.parentNode && !event.isTrigger) {
																jQuery.event.simulate("submit", this.parentNode, event, true)
															}
														}
													},
													teardown: function() {
														if (jQuery.nodeName(this, "form")) {
															return false
														}
														jQuery.event.remove(this, "._submit")
													}
												}
											}
											if (!jQuery.support.changeBubbles) {
												jQuery.event.special.change = {
													setup: function() {
														if (rformElems.test(this.nodeName)) {
															if (this.type === "checkbox" || this.type === "radio") {
																jQuery.event.add(this, "propertychange._change", function(event) {
																	if (event.originalEvent.propertyName === "checked") {
																		this._just_changed = true
																	}
																});
																jQuery.event.add(this, "click._change", function(event) {
																	if (this._just_changed && !event.isTrigger) {
																		this._just_changed = false
																	}
																	jQuery.event.simulate("change", this, event, true)
																})
															}
															return false
														}
														jQuery.event.add(this, "beforeactivate._change", function(e) {
															var elem = e.target;
															if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
																jQuery.event.add(elem, "change._change", function(event) {
																	if (this.parentNode && !event.isSimulated && !event.isTrigger) {
																		jQuery.event.simulate("change", this.parentNode, event, true)
																	}
																});
																jQuery._data(elem, "changeBubbles", true)
															}
														})
													},
													handle: function(event) {
														var elem = event.target;
														if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
															return event.handleObj.handler.apply(this, arguments)
														}
													},
													teardown: function() {
														jQuery.event.remove(this, "._change");
														return !rformElems.test(this.nodeName)
													}
												}
											}
											if (!jQuery.support.focusinBubbles) {
												jQuery.each({
													focus: "focusin",
													blur: "focusout"
												}, function(orig, fix) {
													var attaches = 0,
														handler = function(event) {
															jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true)
														};
													jQuery.event.special[fix] = {
														setup: function() {
															if (attaches++ === 0) {
																document.addEventListener(orig, handler, true)
															}
														},
														teardown: function() {
															if (--attaches === 0) {
																document.removeEventListener(orig, handler, true)
															}
														}
													}
												})
											}
											jQuery.fn.extend({
												on: function(types, selector, data, fn, one) {
													var type, origFn;
													if (typeof types === "object") {
														if (typeof selector !== "string") {
															data = data || selector;
															selector = undefined
														}
														for (type in types) {
															this.on(type, selector, data, types[type], one)
														}
														return this
													}
													if (data == null && fn == null) {
														fn = selector;
														data = selector = undefined
													} else if (fn == null) {
														if (typeof selector === "string") {
															fn = data;
															data = undefined
														} else {
															fn = data;
															data = selector;
															selector = undefined
														}
													}
													if (fn === false) {
														fn = returnFalse
													} else if (!fn) {
														return this
													}
													if (one === 1) {
														origFn = fn;
														fn = function(event) {
															jQuery().off(event);
															return origFn.apply(this, arguments)
														};
														fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)
													}
													return this.each(function() {
														jQuery.event.add(this, types, fn, data, selector)
													})
												},
												one: function(types, selector, data, fn) {
													return this.on(types, selector, data, fn, 1)
												},
												off: function(types, selector, fn) {
													var handleObj, type;
													if (types && types.preventDefault && types.handleObj) {
														handleObj = types.handleObj;
														jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
														return this
													}
													if (typeof types === "object") {
														for (type in types) {
															this.off(type, selector, types[type])
														}
														return this
													}
													if (selector === false || typeof selector === "function") {
														fn = selector;
														selector = undefined
													}
													if (fn === false) {
														fn = returnFalse
													}
													return this.each(function() {
														jQuery.event.remove(this, types, fn, selector)
													})
												},
												trigger: function(type, data) {
													return this.each(function() {
														jQuery.event.trigger(type, data, this)
													})
												},
												triggerHandler: function(type, data) {
													var elem = this[0];
													if (elem) {
														return jQuery.event.trigger(type, data, elem, true)
													}
												}
											});
											var isSimple = /^.[^:#\[\.,]*$/,
												rparentsprev = /^(?:parents|prev(?:Until|All))/,
												rneedsContext = jQuery.expr.match.needsContext,
												guaranteedUnique = {
													children: true,
													contents: true,
													next: true,
													prev: true
												};
											jQuery.fn.extend({
												find: function(selector) {
													var i, ret = [],
														self = this,
														len = self.length;
													if (typeof selector !== "string") {
														return this.pushStack(jQuery(selector).filter(function() {
															for (i = 0; i < len; i++) {
																if (jQuery.contains(self[i], this)) {
																	return true
																}
															}
														}))
													}
													for (i = 0; i < len; i++) {
														jQuery.find(selector, self[i], ret)
													}
													ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
													ret.selector = this.selector ? this.selector + " " + selector : selector;
													return ret
												},
												has: function(target) {
													var i, targets = jQuery(target, this),
														len = targets.length;
													return this.filter(function() {
														for (i = 0; i < len; i++) {
															if (jQuery.contains(this, targets[i])) {
																return true
															}
														}
													})
												},
												not: function(selector) {
													return this.pushStack(winnow(this, selector || [], true))
												},
												filter: function(selector) {
													return this.pushStack(winnow(this, selector || [], false))
												},
												is: function(selector) {
													return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length
												},
												closest: function(selectors, context) {
													var cur, i = 0,
														l = this.length,
														ret = [],
														pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
													for (; i < l; i++) {
														for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
															if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
																cur = ret.push(cur);
																break
															}
														}
													}
													return this.pushStack(ret.length > 1 ? jQuery.unique(ret) : ret)
												},
												index: function(elem) {
													if (!elem) {
														return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1
													}
													if (typeof elem === "string") {
														return jQuery.inArray(this[0], jQuery(elem))
													}
													return jQuery.inArray(elem.jquery ? elem[0] : elem, this)
												},
												add: function(selector, context) {
													var set = typeof selector === "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector),
														all = jQuery.merge(this.get(), set);
													return this.pushStack(jQuery.unique(all))
												},
												addBack: function(selector) {
													return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector))
												}
											});
											function sibling(cur, dir) {
												do {
													cur = cur[dir]
												} while (cur && cur.nodeType !== 1);
												return cur
											}
											jQuery.each({
												parent: function(elem) {
													var parent = elem.parentNode;
													return parent && parent.nodeType !== 11 ? parent : null
												},
												parents: function(elem) {
													return jQuery.dir(elem, "parentNode")
												},
												parentsUntil: function(elem, i, until) {
													return jQuery.dir(elem, "parentNode", until)
												},
												next: function(elem) {
													return sibling(elem, "nextSibling")
												},
												prev: function(elem) {
													return sibling(elem, "previousSibling")
												},
												nextAll: function(elem) {
													return jQuery.dir(elem, "nextSibling")
												},
												prevAll: function(elem) {
													return jQuery.dir(elem, "previousSibling")
												},
												nextUntil: function(elem, i, until) {
													return jQuery.dir(elem, "nextSibling", until)
												},
												prevUntil: function(elem, i, until) {
													return jQuery.dir(elem, "previousSibling", until)
												},
												siblings: function(elem) {
													return jQuery.sibling((elem.parentNode || {}).firstChild, elem)
												},
												children: function(elem) {
													return jQuery.sibling(elem.firstChild)
												},
												contents: function(elem) {
													return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes)
												}
											}, function(name, fn) {
												jQuery.fn[name] = function(until, selector) {
													var ret = jQuery.map(this, fn, until);
													if (name.slice(-5) !== "Until") {
														selector = until
													}
													if (selector && typeof selector === "string") {
														ret = jQuery.filter(selector, ret)
													}
													if (this.length > 1) {
														if (!guaranteedUnique[name]) {
															ret = jQuery.unique(ret)
														}
														if (rparentsprev.test(name)) {
															ret = ret.reverse()
														}
													}
													return this.pushStack(ret)
												}
											});
											jQuery.extend({
												filter: function(expr, elems, not) {
													var elem = elems[0];
													if (not) {
														expr = ":not(" + expr + ")"
													}
													return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
														return elem.nodeType === 1
													}))
												},
												dir: function(elem, dir, until) {
													var matched = [],
														cur = elem[dir];
													while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
														if (cur.nodeType === 1) {
															matched.push(cur)
														}
														cur = cur[dir]
													}
													return matched
												},
												sibling: function(n, elem) {
													var r = [];
													for (; n; n = n.nextSibling) {
														if (n.nodeType === 1 && n !== elem) {
															r.push(n)
														}
													}
													return r
												}
											});
											function winnow(elements, qualifier, not) {
												if (jQuery.isFunction(qualifier)) {
													return jQuery.grep(elements, function(elem, i) {
														return !!qualifier.call(elem, i, elem) !== not
													})
												}
												if (qualifier.nodeType) {
													return jQuery.grep(elements, function(elem) {
														return (elem === qualifier) !== not
													})
												}
												if (typeof qualifier === "string") {
													if (isSimple.test(qualifier)) {
														return jQuery.filter(qualifier, elements, not)
													}
													qualifier = jQuery.filter(qualifier, elements)
												}
												return jQuery.grep(elements, function(elem) {
													return (jQuery.inArray(elem, qualifier) >= 0) !== not
												})
											}
											function createSafeFragment(document) {
												var list = nodeNames.split("|"),
													safeFrag = document.createDocumentFragment();
												if (safeFrag.createElement) {
													while (list.length) {
														safeFrag.createElement(list.pop())
													}
												}
												return safeFrag
											}
											var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
												rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
												rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
												rleadingWhitespace = /^\s+/,
												rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
												rtagName = /<([\w:]+)/,
												rtbody = /<tbody/i,
												rhtml = /<|&#?\w+;/,
												rnoInnerhtml = /<(?:script|style|link)/i,
												manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
												rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
												rscriptType = /^$|\/(?:java|ecma)script/i,
												rscriptTypeMasked = /^true\/(.*)/,
												rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
												wrapMap = {
													option: [1, "<select multiple='multiple'>", "</select>"],
													legend: [1, "<fieldset>", "</fieldset>"],
													area: [1, "<map>", "</map>"],
													param: [1, "<object>", "</object>"],
													thead: [1, "<table>", "</table>"],
													tr: [2, "<table><tbody>", "</tbody></table>"],
													col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
													td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
													_default: jQuery.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
												},
												safeFragment = createSafeFragment(document),
												fragmentDiv = safeFragment.appendChild(document.createElement("div"));
											wrapMap.optgroup = wrapMap.option;
											wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
											wrapMap.th = wrapMap.td;
											jQuery.fn.extend({
												text: function(value) {
													return jQuery.access(this, function(value) {
														return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value))
													}, null, value, arguments.length)
												},
												append: function() {
													return this.domManip(arguments, function(elem) {
														if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
															var target = manipulationTarget(this, elem);
															target.appendChild(elem)
														}
													})
												},
												prepend: function() {
													return this.domManip(arguments, function(elem) {
														if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
															var target = manipulationTarget(this, elem);
															target.insertBefore(elem, target.firstChild)
														}
													})
												},
												before: function() {
													return this.domManip(arguments, function(elem) {
														if (this.parentNode) {
															this.parentNode.insertBefore(elem, this)
														}
													})
												},
												after: function() {
													return this.domManip(arguments, function(elem) {
														if (this.parentNode) {
															this.parentNode.insertBefore(elem, this.nextSibling)
														}
													})
												},
												remove: function(selector, keepData) {
													var elem, elems = selector ? jQuery.filter(selector, this) : this,
														i = 0;
													for (;
													(elem = elems[i]) != null; i++) {
														if (!keepData && elem.nodeType === 1) {
															jQuery.cleanData(getAll(elem))
														}
														if (elem.parentNode) {
															if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
																setGlobalEval(getAll(elem, "script"))
															}
															elem.parentNode.removeChild(elem)
														}
													}
													return this
												},
												empty: function() {
													var elem, i = 0;
													for (;
													(elem = this[i]) != null; i++) {
														if (elem.nodeType === 1) {
															jQuery.cleanData(getAll(elem, false))
														}
														while (elem.firstChild) {
															elem.removeChild(elem.firstChild)
														}
														if (elem.options && jQuery.nodeName(elem, "select")) {
															elem.options.length = 0
														}
													}
													return this
												},
												clone: function(dataAndEvents, deepDataAndEvents) {
													dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
													deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
													return this.map(function() {
														return jQuery.clone(this, dataAndEvents, deepDataAndEvents)
													})
												},
												html: function(value) {
													return jQuery.access(this, function(value) {
														var elem = this[0] || {},
															i = 0,
															l = this.length;
														if (value === undefined) {
															return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined
														}
														if (typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
															value = value.replace(rxhtmlTag, "<$1></$2>");
															try {
																for (; i < l; i++) {
																	elem = this[i] || {};
																	if (elem.nodeType === 1) {
																		jQuery.cleanData(getAll(elem, false));
																		elem.innerHTML = value
																	}
																}
																elem = 0
															} catch (e) {}
														}
														if (elem) {
															this.empty().append(value)
														}
													}, null, value, arguments.length)
												},
												replaceWith: function() {
													var args = jQuery.map(this, function(elem) {
														return [elem.nextSibling, elem.parentNode]
													}),
														i = 0;
													this.domManip(arguments, function(elem) {
														var next = args[i++],
															parent = args[i++];
														if (parent) {
															if (next && next.parentNode !== parent) {
																next = this.nextSibling
															}
															jQuery(this).remove();
															parent.insertBefore(elem, next)
														}
													}, true);
													return i ? this : this.remove()
												},
												detach: function(selector) {
													return this.remove(selector, true)
												},
												domManip: function(args, callback, allowIntersection) {
													args = core_concat.apply([], args);
													var first, node, hasScripts, scripts, doc, fragment, i = 0,
														l = this.length,
														set = this,
														iNoClone = l - 1,
														value = args[0],
														isFunction = jQuery.isFunction(value);
													if (isFunction || !(l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test(value))) {
														return this.each(function(index) {
															var self = set.eq(index);
															if (isFunction) {
																args[0] = value.call(this, index, self.html())
															}
															self.domManip(args, callback, allowIntersection)
														})
													}
													if (l) {
														fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, !allowIntersection && this);
														first = fragment.firstChild;
														if (fragment.childNodes.length === 1) {
															fragment = first
														}
														if (first) {
															scripts = jQuery.map(getAll(fragment, "script"), disableScript);
															hasScripts = scripts.length;
															for (; i < l; i++) {
																node = fragment;
																if (i !== iNoClone) {
																	node = jQuery.clone(node, true, true);
																	if (hasScripts) {
																		jQuery.merge(scripts, getAll(node, "script"))
																	}
																}
																callback.call(this[i], node, i)
															}
															if (hasScripts) {
																doc = scripts[scripts.length - 1].ownerDocument;
																jQuery.map(scripts, restoreScript);
																for (i = 0; i < hasScripts; i++) {
																	node = scripts[i];
																	if (rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {
																		if (node.src) {
																			jQuery._evalUrl(node.src)
																		} else {
																			jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""))
																		}
																	}
																}
															}
															fragment = first = null
														}
													}
													return this
												}
											});
											function manipulationTarget(elem, content) {
												return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType === 1 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem
											}
											function disableScript(elem) {
												elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
												return elem
											}
											function restoreScript(elem) {
												var match = rscriptTypeMasked.exec(elem.type);
												if (match) {
													elem.type = match[1]
												} else {
													elem.removeAttribute("type")
												}
												return elem
											}
											function setGlobalEval(elems, refElements) {
												var elem, i = 0;
												for (;
												(elem = elems[i]) != null; i++) {
													jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"))
												}
											}
											function cloneCopyEvent(src, dest) {
												if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
													return
												}
												var type, i, l, oldData = jQuery._data(src),
													curData = jQuery._data(dest, oldData),
													events = oldData.events;
												if (events) {
													delete curData.handle;
													curData.events = {};
													for (type in events) {
														for (i = 0, l = events[type].length; i < l; i++) {
															jQuery.event.add(dest, type, events[type][i])
														}
													}
												}
												if (curData.data) {
													curData.data = jQuery.extend({}, curData.data)
												}
											}
											function fixCloneNodeIssues(src, dest) {
												var nodeName, e, data;
												if (dest.nodeType !== 1) {
													return
												}
												nodeName = dest.nodeName.toLowerCase();
												if (!jQuery.support.noCloneEvent && dest[jQuery.expando]) {
													data = jQuery._data(dest);
													for (e in data.events) {
														jQuery.removeEvent(dest, e, data.handle)
													}
													dest.removeAttribute(jQuery.expando)
												}
												if (nodeName === "script" && dest.text !== src.text) {
													disableScript(dest).text = src.text;
													restoreScript(dest)
												} else if (nodeName === "object") {
													if (dest.parentNode) {
														dest.outerHTML = src.outerHTML
													}
													if (jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
														dest.innerHTML = src.innerHTML
													}
												} else if (nodeName === "input" && manipulation_rcheckableType.test(src.type)) {
													dest.defaultChecked = dest.checked = src.checked;
													if (dest.value !== src.value) {
														dest.value = src.value
													}
												} else if (nodeName === "option") {
													dest.defaultSelected = dest.selected = src.defaultSelected
												} else if (nodeName === "input" || nodeName === "textarea") {
													dest.defaultValue = src.defaultValue
												}
											}
											jQuery.each({
												appendTo: "append",
												prependTo: "prepend",
												insertBefore: "before",
												insertAfter: "after",
												replaceAll: "replaceWith"
											}, function(name, original) {
												jQuery.fn[name] = function(selector) {
													var elems, i = 0,
														ret = [],
														insert = jQuery(selector),
														last = insert.length - 1;
													for (; i <= last; i++) {
														elems = i === last ? this : this.clone(true);
														jQuery(insert[i])[original](elems);
														core_push.apply(ret, elems.get())
													}
													return this.pushStack(ret)
												}
											});
											function getAll(context, tag) {
												var elems, elem, i = 0,
													found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || "*") : undefined;
												if (!found) {
													for (found = [], elems = context.childNodes || context;
													(elem = elems[i]) != null; i++) {
														if (!tag || jQuery.nodeName(elem, tag)) {
															found.push(elem)
														} else {
															jQuery.merge(found, getAll(elem, tag))
														}
													}
												}
												return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], found) : found
											}
											function fixDefaultChecked(elem) {
												if (manipulation_rcheckableType.test(elem.type)) {
													elem.defaultChecked = elem.checked
												}
											}
											jQuery.extend({
												clone: function(elem, dataAndEvents, deepDataAndEvents) {
													var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
													if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
														clone = elem.cloneNode(true)
													} else {
														fragmentDiv.innerHTML = elem.outerHTML;
														fragmentDiv.removeChild(clone = fragmentDiv.firstChild)
													}
													if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
														destElements = getAll(clone);
														srcElements = getAll(elem);
														for (i = 0;
														(node = srcElements[i]) != null; ++i) {
															if (destElements[i]) {
																fixCloneNodeIssues(node, destElements[i])
															}
														}
													}
													if (dataAndEvents) {
														if (deepDataAndEvents) {
															srcElements = srcElements || getAll(elem);
															destElements = destElements || getAll(clone);
															for (i = 0;
															(node = srcElements[i]) != null; i++) {
																cloneCopyEvent(node, destElements[i])
															}
														} else {
															cloneCopyEvent(elem, clone)
														}
													}
													destElements = getAll(clone, "script");
													if (destElements.length > 0) {
														setGlobalEval(destElements, !inPage && getAll(elem, "script"))
													}
													destElements = srcElements = node = null;
													return clone
												},
												buildFragment: function(elems, context, scripts, selection) {
													var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length,
														safe = createSafeFragment(context),
														nodes = [],
														i = 0;
													for (; i < l; i++) {
														elem = elems[i];
														if (elem || elem === 0) {
															if (jQuery.type(elem) === "object") {
																jQuery.merge(nodes, elem.nodeType ? [elem] : elem)
															} else if (!rhtml.test(elem)) {
																nodes.push(context.createTextNode(elem))
															} else {
																tmp = tmp || safe.appendChild(context.createElement("div"));
																tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
																wrap = wrapMap[tag] || wrapMap._default;
																tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
																j = wrap[0];
																while (j--) {
																	tmp = tmp.lastChild
																}
																if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
																	nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]))
																}
																if (!jQuery.support.tbody) {
																	elem = tag === "table" && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === "<table>" && !rtbody.test(elem) ? tmp : 0;
																	j = elem && elem.childNodes.length;
																	while (j--) {
																		if (jQuery.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
																			elem.removeChild(tbody)
																		}
																	}
																}
																jQuery.merge(nodes, tmp.childNodes);
																tmp.textContent = "";
																while (tmp.firstChild) {
																	tmp.removeChild(tmp.firstChild)
																}
																tmp = safe.lastChild
															}
														}
													}
													if (tmp) {
														safe.removeChild(tmp)
													}
													if (!jQuery.support.appendChecked) {
														jQuery.grep(getAll(nodes, "input"), fixDefaultChecked)
													}
													i = 0;
													while ((elem = nodes[i++])) {
														if (selection && jQuery.inArray(elem, selection) !== -1) {
															continue
														}
														contains = jQuery.contains(elem.ownerDocument, elem);
														tmp = getAll(safe.appendChild(elem), "script");
														if (contains) {
															setGlobalEval(tmp)
														}
														if (scripts) {
															j = 0;
															while ((elem = tmp[j++])) {
																if (rscriptType.test(elem.type || "")) {
																	scripts.push(elem)
																}
															}
														}
													}
													tmp = null;
													return safe
												},
												cleanData: function(elems, acceptData) {
													var elem, type, id, data, i = 0,
														internalKey = jQuery.expando,
														cache = jQuery.cache,
														deleteExpando = jQuery.support.deleteExpando,
														special = jQuery.event.special;
													for (;
													(elem = elems[i]) != null; i++) {
														if (acceptData || jQuery.acceptData(elem)) {
															id = elem[internalKey];
															data = id && cache[id];
															if (data) {
																if (data.events) {
																	for (type in data.events) {
																		if (special[type]) {
																			jQuery.event.remove(elem, type)
																		} else {
																			jQuery.removeEvent(elem, type, data.handle)
																		}
																	}
																}
																if (cache[id]) {
																	delete cache[id];
																	if (deleteExpando) {
																		delete elem[internalKey]
																	} else if (typeof elem.removeAttribute !== core_strundefined) {
																		elem.removeAttribute(internalKey)
																	} else {
																		elem[internalKey] = null
																	}
																	core_deletedIds.push(id)
																}
															}
														}
													}
												},
												_evalUrl: function(url) {
													return jQuery.ajax({
														url: url,
														type: "GET",
														dataType: "script",
														async: false,
														global: false,
														"throws": true
													})
												}
											});
											jQuery.fn.extend({
												wrapAll: function(html) {
													if (jQuery.isFunction(html)) {
														return this.each(function(i) {
															jQuery(this).wrapAll(html.call(this, i))
														})
													}
													if (this[0]) {
														var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
														if (this[0].parentNode) {
															wrap.insertBefore(this[0])
														}
														wrap.map(function() {
															var elem = this;
															while (elem.firstChild && elem.firstChild.nodeType === 1) {
																elem = elem.firstChild
															}
															return elem
														}).append(this)
													}
													return this
												},
												wrapInner: function(html) {
													if (jQuery.isFunction(html)) {
														return this.each(function(i) {
															jQuery(this).wrapInner(html.call(this, i))
														})
													}
													return this.each(function() {
														var self = jQuery(this),
															contents = self.contents();
														if (contents.length) {
															contents.wrapAll(html)
														} else {
															self.append(html)
														}
													})
												},
												wrap: function(html) {
													var isFunction = jQuery.isFunction(html);
													return this.each(function(i) {
														jQuery(this).wrapAll(isFunction ? html.call(this, i) : html)
													})
												},
												unwrap: function() {
													return this.parent().each(function() {
														if (!jQuery.nodeName(this, "body")) {
															jQuery(this).replaceWith(this.childNodes)
														}
													}).end()
												}
											});
											var iframe, getStyles, curCSS, ralpha = /alpha\([^)]*\)/i,
												ropacity = /opacity\s*=\s*([^)]*)/,
												rposition = /^(top|right|bottom|left)$/,
												rdisplayswap = /^(none|table(?!-c[ea]).+)/,
												rmargin = /^margin/,
												rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
												rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
												rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"),
												elemdisplay = {
													BODY: "block"
												},
												cssShow = {
													position: "absolute",
													visibility: "hidden",
													display: "block"
												},
												cssNormalTransform = {
													letterSpacing: 0,
													fontWeight: 400
												},
												cssExpand = ["Top", "Right", "Bottom", "Left"],
												cssPrefixes = ["Webkit", "O", "Moz", "ms"];
											function vendorPropName(style, name) {
												if (name in style) {
													return name
												}
												var capName = name.charAt(0).toUpperCase() + name.slice(1),
													origName = name,
													i = cssPrefixes.length;
												while (i--) {
													name = cssPrefixes[i] + capName;
													if (name in style) {
														return name
													}
												}
												return origName
											}
											function isHidden(elem, el) {
												elem = el || elem;
												return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem)
											}
											function showHide(elements, show) {
												var display, elem, hidden, values = [],
													index = 0,
													length = elements.length;
												for (; index < length; index++) {
													elem = elements[index];
													if (!elem.style) {
														continue
													}
													values[index] = jQuery._data(elem, "olddisplay");
													display = elem.style.display;
													if (show) {
														if (!values[index] && display === "none") {
															elem.style.display = ""
														}
														if (elem.style.display === "" && isHidden(elem)) {
															values[index] = jQuery._data(elem, "olddisplay", css_defaultDisplay(elem.nodeName))
														}
													} else {
														if (!values[index]) {
															hidden = isHidden(elem);
															if (display && display !== "none" || !hidden) {
																jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))
															}
														}
													}
												}
												for (index = 0; index < length; index++) {
													elem = elements[index];
													if (!elem.style) {
														continue
													}
													if (!show || elem.style.display === "none" || elem.style.display === "") {
														elem.style.display = show ? values[index] || "" : "none"
													}
												}
												return elements
											}
											jQuery.fn.extend({
												css: function(name, value) {
													return jQuery.access(this, function(elem, name, value) {
														var len, styles, map = {},
															i = 0;
														if (jQuery.isArray(name)) {
															styles = getStyles(elem);
															len = name.length;
															for (; i < len; i++) {
																map[name[i]] = jQuery.css(elem, name[i], false, styles)
															}
															return map
														}
														return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name)
													}, name, value, arguments.length > 1)
												},
												show: function() {
													return showHide(this, true)
												},
												hide: function() {
													return showHide(this)
												},
												toggle: function(state) {
													if (typeof state === "boolean") {
														return state ? this.show() : this.hide()
													}
													return this.each(function() {
														if (isHidden(this)) {
															jQuery(this).show()
														} else {
															jQuery(this).hide()
														}
													})
												}
											});
											jQuery.extend({
												cssHooks: {
													opacity: {
														get: function(elem, computed) {
															if (computed) {
																var ret = curCSS(elem, "opacity");
																return ret === "" ? "1" : ret
															}
														}
													}
												},
												cssNumber: {
													"columnCount": true,
													"fillOpacity": true,
													"fontWeight": true,
													"lineHeight": true,
													"opacity": true,
													"order": true,
													"orphans": true,
													"widows": true,
													"zIndex": true,
													"zoom": true
												},
												cssProps: {
													"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
												},
												style: function(elem, name, value, extra) {
													if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
														return
													}
													var ret, type, hooks, origName = jQuery.camelCase(name),
														style = elem.style;
													name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
													hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
													if (value !== undefined) {
														type = typeof value;
														if (type === "string" && (ret = rrelNum.exec(value))) {
															value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
															type = "number"
														}
														if (value == null || type === "number" && isNaN(value)) {
															return
														}
														if (type === "number" && !jQuery.cssNumber[origName]) {
															value += "px"
														}
														if (!jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
															style[name] = "inherit"
														}
														if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
															try {
																style[name] = value
															} catch (e) {}
														}
													} else {
														if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
															return ret
														}
														return style[name]
													}
												},
												css: function(elem, name, extra, styles) {
													var num, val, hooks, origName = jQuery.camelCase(name);
													name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
													hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
													if (hooks && "get" in hooks) {
														val = hooks.get(elem, true, extra)
													}
													if (val === undefined) {
														val = curCSS(elem, name, styles)
													}
													if (val === "normal" && name in cssNormalTransform) {
														val = cssNormalTransform[name]
													}
													if (extra === "" || extra) {
														num = parseFloat(val);
														return extra === true || jQuery.isNumeric(num) ? num || 0 : val
													}
													return val
												}
											});
											if (window.getComputedStyle) {
												getStyles = function(elem) {
													return window.getComputedStyle(elem, null)
												};
												curCSS = function(elem, name, _computed) {
													var width, minWidth, maxWidth, computed = _computed || getStyles(elem),
														ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
														style = elem.style;
													if (computed) {
														if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
															ret = jQuery.style(elem, name)
														}
														if (rnumnonpx.test(ret) && rmargin.test(name)) {
															width = style.width;
															minWidth = style.minWidth;
															maxWidth = style.maxWidth;
															style.minWidth = style.maxWidth = style.width = ret;
															ret = computed.width;
															style.width = width;
															style.minWidth = minWidth;
															style.maxWidth = maxWidth
														}
													}
													return ret
												}
											} else if (document.documentElement.currentStyle) {
												getStyles = function(elem) {
													return elem.currentStyle
												};
												curCSS = function(elem, name, _computed) {
													var left, rs, rsLeft, computed = _computed || getStyles(elem),
														ret = computed ? computed[name] : undefined,
														style = elem.style;
													if (ret == null && style && style[name]) {
														ret = style[name]
													}
													if (rnumnonpx.test(ret) && !rposition.test(name)) {
														left = style.left;
														rs = elem.runtimeStyle;
														rsLeft = rs && rs.left;
														if (rsLeft) {
															rs.left = elem.currentStyle.left
														}
														style.left = name === "fontSize" ? "1em" : ret;
														ret = style.pixelLeft + "px";
														style.left = left;
														if (rsLeft) {
															rs.left = rsLeft
														}
													}
													return ret === "" ? "auto" : ret
												}
											}
											function setPositiveNumber(elem, value, subtract) {
												var matches = rnumsplit.exec(value);
												return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value
											}
											function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
												var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0,
													val = 0;
												for (; i < 4; i += 2) {
													if (extra === "margin") {
														val += jQuery.css(elem, extra + cssExpand[i], true, styles)
													}
													if (isBorderBox) {
														if (extra === "content") {
															val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles)
														}
														if (extra !== "margin") {
															val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles)
														}
													} else {
														val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
														if (extra !== "padding") {
															val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles)
														}
													}
												}
												return val
											}
											function getWidthOrHeight(elem, name, extra) {
												var valueIsBorderBox = true,
													val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
													styles = getStyles(elem),
													isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";
												if (val <= 0 || val == null) {
													val = curCSS(elem, name, styles);
													if (val < 0 || val == null) {
														val = elem.style[name]
													}
													if (rnumnonpx.test(val)) {
														return val
													}
													valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
													val = parseFloat(val) || 0
												}
												return (val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles)) + "px"
											}
											function css_defaultDisplay(nodeName) {
												var doc = document,
													display = elemdisplay[nodeName];
												if (!display) {
													display = actualDisplay(nodeName, doc);
													if (display === "none" || !display) {
														iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(doc.documentElement);
														doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
														doc.write("<!doctype html><html><body>");
														doc.close();
														display = actualDisplay(nodeName, doc);
														iframe.detach()
													}
													elemdisplay[nodeName] = display
												}
												return display
											}
											function actualDisplay(name, doc) {
												var elem = jQuery(doc.createElement(name)).appendTo(doc.body),
													display = jQuery.css(elem[0], "display");
												elem.remove();
												return display
											}
											jQuery.each(["height", "width"], function(i, name) {
												jQuery.cssHooks[name] = {
													get: function(elem, computed, extra) {
														if (computed) {
															return elem.offsetWidth === 0 && rdisplayswap.test(jQuery.css(elem, "display")) ? jQuery.swap(elem, cssShow, function() {
																return getWidthOrHeight(elem, name, extra)
															}) : getWidthOrHeight(elem, name, extra)
														}
													},
													set: function(elem, value, extra) {
														var styles = extra && getStyles(elem);
														return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles) : 0)
													}
												}
											});
											if (!jQuery.support.opacity) {
												jQuery.cssHooks.opacity = {
													get: function(elem, computed) {
														return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1)) + "" : computed ? "1" : ""
													},
													set: function(elem, value) {
														var style = elem.style,
															currentStyle = elem.currentStyle,
															opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
															filter = currentStyle && currentStyle.filter || style.filter || "";
														style.zoom = 1;
														if ((value >= 1 || value === "") && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
															style.removeAttribute("filter");
															if (value === "" || currentStyle && !currentStyle.filter) {
																return
															}
														}
														style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity
													}
												}
											}
											jQuery(function() {
												if (!jQuery.support.reliableMarginRight) {
													jQuery.cssHooks.marginRight = {
														get: function(elem, computed) {
															if (computed) {
																return jQuery.swap(elem, {
																	"display": "inline-block"
																}, curCSS, [elem, "marginRight"])
															}
														}
													}
												}
												if (!jQuery.support.pixelPosition && jQuery.fn.position) {
													jQuery.each(["top", "left"], function(i, prop) {
														jQuery.cssHooks[prop] = {
															get: function(elem, computed) {
																if (computed) {
																	computed = curCSS(elem, prop);
																	return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed
																}
															}
														}
													})
												}
											});
											if (jQuery.expr && jQuery.expr.filters) {
												jQuery.expr.filters.hidden = function(elem) {
													return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none")
												};
												jQuery.expr.filters.visible = function(elem) {
													return !jQuery.expr.filters.hidden(elem)
												}
											}
											jQuery.each({
												margin: "",
												padding: "",
												border: "Width"
											}, function(prefix, suffix) {
												jQuery.cssHooks[prefix + suffix] = {
													expand: function(value) {
														var i = 0,
															expanded = {},
															parts = typeof value === "string" ? value.split(" ") : [value];
														for (; i < 4; i++) {
															expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0]
														}
														return expanded
													}
												};
												if (!rmargin.test(prefix)) {
													jQuery.cssHooks[prefix + suffix].set = setPositiveNumber
												}
											});
											var r20 = /%20/g,
												rbracket = /\[\]$/,
												rCRLF = /\r?\n/g,
												rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
												rsubmittable = /^(?:input|select|textarea|keygen)/i;
											jQuery.fn.extend({
												serialize: function() {
													return jQuery.param(this.serializeArray())
												},
												serializeArray: function() {
													return this.map(function() {
														var elements = jQuery.prop(this, "elements");
														return elements ? jQuery.makeArray(elements) : this
													}).filter(function() {
														var type = this.type;
														return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !manipulation_rcheckableType.test(type))
													}).map(function(i, elem) {
														var val = jQuery(this).val();
														return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
															return {
																name: elem.name,
																value: val.replace(rCRLF, "\r\n")
															}
														}) : {
															name: elem.name,
															value: val.replace(rCRLF, "\r\n")
														}
													}).get()
												}
											});
											jQuery.param = function(a, traditional) {
												var prefix, s = [],
													add = function(key, value) {
														value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
														s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value)
													};
												if (traditional === undefined) {
													traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional
												}
												if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
													jQuery.each(a, function() {
														add(this.name, this.value)
													})
												} else {
													for (prefix in a) {
														buildParams(prefix, a[prefix], traditional, add)
													}
												}
												return s.join("&").replace(r20, "+")
											};
											function buildParams(prefix, obj, traditional, add) {
												var name;
												if (jQuery.isArray(obj)) {
													jQuery.each(obj, function(i, v) {
														if (traditional || rbracket.test(prefix)) {
															add(prefix, v)
														} else {
															buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add)
														}
													})
												} else if (!traditional && jQuery.type(obj) === "object") {
													for (name in obj) {
														buildParams(prefix + "[" + name + "]", obj[name], traditional, add)
													}
												} else {
													add(prefix, obj)
												}
											}
											jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
												jQuery.fn[name] = function(data, fn) {
													return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name)
												}
											});
											jQuery.fn.extend({
												hover: function(fnOver, fnOut) {
													return this.mouseenter(fnOver).mouseleave(fnOut || fnOver)
												},
												bind: function(types, data, fn) {
													return this.on(types, null, data, fn)
												},
												unbind: function(types, fn) {
													return this.off(types, null, fn)
												},
												delegate: function(selector, types, data, fn) {
													return this.on(types, selector, data, fn)
												},
												undelegate: function(selector, types, fn) {
													return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn)
												}
											});
											var ajaxLocParts, ajaxLocation, ajax_nonce = jQuery.now(),
												ajax_rquery = /\?/,
												rhash = /#.*$/,
												rts = /([?&])_=[^&]*/,
												rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
												rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
												rnoContent = /^(?:GET|HEAD)$/,
												rprotocol = /^\/\//,
												rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
												_load = jQuery.fn.load,
												prefilters = {},
												transports = {},
												allTypes = "*/".concat("*");
											try {
												ajaxLocation = location.href
											} catch (e) {
												ajaxLocation = document.createElement("a");
												ajaxLocation.href = "";
												ajaxLocation = ajaxLocation.href
											}
											ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
											function addToPrefiltersOrTransports(structure) {
												return function(dataTypeExpression, func) {
													if (typeof dataTypeExpression !== "string") {
														func = dataTypeExpression;
														dataTypeExpression = "*"
													}
													var dataType, i = 0,
														dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];
													if (jQuery.isFunction(func)) {
														while ((dataType = dataTypes[i++])) {
															if (dataType[0] === "+") {
																dataType = dataType.slice(1) || "*";
																(structure[dataType] = structure[dataType] || []).unshift(func)
															} else {
																(structure[dataType] = structure[dataType] || []).push(func)
															}
														}
													}
												}
											}
											function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
												var inspected = {},
													seekingTransport = (structure === transports);
												function inspect(dataType) {
													var selected;
													inspected[dataType] = true;
													jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
														var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
														if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
															options.dataTypes.unshift(dataTypeOrTransport);
															inspect(dataTypeOrTransport);
															return false
														} else if (seekingTransport) {
															return !(selected = dataTypeOrTransport)
														}
													});
													return selected
												}
												return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*")
											}
											function ajaxExtend(target, src) {
												var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
												for (key in src) {
													if (src[key] !== undefined) {
														(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key]
													}
												}
												if (deep) {
													jQuery.extend(true, target, deep)
												}
												return target
											}
											jQuery.fn.load = function(url, params, callback) {
												if (typeof url !== "string" && _load) {
													return _load.apply(this, arguments)
												}
												var selector, response, type, self = this,
													off = url.indexOf(" ");
												if (off >= 0) {
													selector = url.slice(off, url.length);
													url = url.slice(0, off)
												}
												if (jQuery.isFunction(params)) {
													callback = params;
													params = undefined
												} else if (params && typeof params === "object") {
													type = "POST"
												}
												if (self.length > 0) {
													jQuery.ajax({
														url: url,
														type: type,
														dataType: "html",
														data: params
													}).done(function(responseText) {
														response = arguments;
														self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText)
													}).complete(callback &&
													function(jqXHR, status) {
														self.each(callback, response || [jqXHR.responseText, status, jqXHR])
													})
												}
												return this
											};
											jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(i, type) {
												jQuery.fn[type] = function(fn) {
													return this.on(type, fn)
												}
											});
											jQuery.extend({
												active: 0,
												lastModified: {},
												etag: {},
												ajaxSettings: {
													url: ajaxLocation,
													type: "GET",
													isLocal: rlocalProtocol.test(ajaxLocParts[1]),
													global: true,
													processData: true,
													async: true,
													contentType: "application/x-www-form-urlencoded; charset=UTF-8",
													accepts: {
														"*": allTypes,
														text: "text/plain",
														html: "text/html",
														xml: "application/xml, text/xml",
														json: "application/json, text/javascript"
													},
													contents: {
														xml: /xml/,
														html: /html/,
														json: /json/
													},
													responseFields: {
														xml: "responseXML",
														text: "responseText",
														json: "responseJSON"
													},
													converters: {
														"* text": String,
														"text html": true,
														"text json": jQuery.parseJSON,
														"text xml": jQuery.parseXML
													},
													flatOptions: {
														url: true,
														context: true
													}
												},
												ajaxSetup: function(target, settings) {
													return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target)
												},
												ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
												ajaxTransport: addToPrefiltersOrTransports(transports),
												ajax: function(url, options) {
													if (typeof url === "object") {
														options = url;
														url = undefined
													}
													options = options || {};
													var parts, i, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders, s = jQuery.ajaxSetup({}, options),
														callbackContext = s.context || s,
														globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,
														deferred = jQuery.Deferred(),
														completeDeferred = jQuery.Callbacks("once memory"),
														statusCode = s.statusCode || {},
														requestHeaders = {},
														requestHeadersNames = {},
														state = 0,
														strAbort = "canceled",
														jqXHR = {
															readyState: 0,
															getResponseHeader: function(key) {
																var match;
																if (state === 2) {
																	if (!responseHeaders) {
																		responseHeaders = {};
																		while ((match = rheaders.exec(responseHeadersString))) {
																			responseHeaders[match[1].toLowerCase()] = match[2]
																		}
																	}
																	match = responseHeaders[key.toLowerCase()]
																}
																return match == null ? null : match
															},
															getAllResponseHeaders: function() {
																return state === 2 ? responseHeadersString : null
															},
															setRequestHeader: function(name, value) {
																var lname = name.toLowerCase();
																if (!state) {
																	name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
																	requestHeaders[name] = value
																}
																return this
															},
															overrideMimeType: function(type) {
																if (!state) {
																	s.mimeType = type
																}
																return this
															},
															statusCode: function(map) {
																var code;
																if (map) {
																	if (state < 2) {
																		for (code in map) {
																			statusCode[code] = [statusCode[code], map[code]]
																		}
																	} else {
																		jqXHR.always(map[jqXHR.status])
																	}
																}
																return this
															},
															abort: function(statusText) {
																var finalText = statusText || strAbort;
																if (transport) {
																	transport.abort(finalText)
																}
																done(0, finalText);
																return this
															}
														};
													deferred.promise(jqXHR).complete = completeDeferred.add;
													jqXHR.success = jqXHR.done;
													jqXHR.error = jqXHR.fail;
													s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
													s.type = options.method || options.type || s.method || s.type;
													s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(core_rnotwhite) || [""];
													if (s.crossDomain == null) {
														parts = rurl.exec(s.url.toLowerCase());
														s.crossDomain = !! (parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443"))))
													}
													if (s.data && s.processData && typeof s.data !== "string") {
														s.data = jQuery.param(s.data, s.traditional)
													}
													inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
													if (state === 2) {
														return jqXHR
													}
													fireGlobals = s.global;
													if (fireGlobals && jQuery.active++ === 0) {
														jQuery.event.trigger("ajaxStart")
													}
													s.type = s.type.toUpperCase();
													s.hasContent = !rnoContent.test(s.type);
													cacheURL = s.url;
													if (!s.hasContent) {
														if (s.data) {
															cacheURL = (s.url += (ajax_rquery.test(cacheURL) ? "&" : "?") + s.data);
															delete s.data
														}
														if (s.cache === false) {
															s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + ajax_nonce++) : cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++
														}
													}
													if (s.ifModified) {
														if (jQuery.lastModified[cacheURL]) {
															jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL])
														}
														if (jQuery.etag[cacheURL]) {
															jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL])
														}
													}
													if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
														jqXHR.setRequestHeader("Content-Type", s.contentType)
													}
													jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
													for (i in s.headers) {
														jqXHR.setRequestHeader(i, s.headers[i])
													}
													if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
														return jqXHR.abort()
													}
													strAbort = "abort";
													for (i in {
														success: 1,
														error: 1,
														complete: 1
													}) {
														jqXHR[i](s[i])
													}
													transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
													if (!transport) {
														done(-1, "No Transport")
													} else {
														jqXHR.readyState = 1;
														if (fireGlobals) {
															globalEventContext.trigger("ajaxSend", [jqXHR, s])
														}
														if (s.async && s.timeout > 0) {
															timeoutTimer = setTimeout(function() {
																jqXHR.abort("timeout")
															}, s.timeout)
														}
														try {
															state = 1;
															transport.send(requestHeaders, done)
														} catch (e) {
															if (state < 2) {
																done(-1, e)
															} else {
																throw e;
															}
														}
													}
													function done(status, nativeStatusText, responses, headers) {
														var isSuccess, success, error, response, modified, statusText = nativeStatusText;
														if (state === 2) {
															return
														}
														state = 2;
														if (timeoutTimer) {
															clearTimeout(timeoutTimer)
														}
														transport = undefined;
														responseHeadersString = headers || "";
														jqXHR.readyState = status > 0 ? 4 : 0;
														isSuccess = status >= 200 && status < 300 || status === 304;
														if (responses) {
															response = ajaxHandleResponses(s, jqXHR, responses)
														}
														response = ajaxConvert(s, response, jqXHR, isSuccess);
														if (isSuccess) {
															if (s.ifModified) {
																modified = jqXHR.getResponseHeader("Last-Modified");
																if (modified) {
																	jQuery.lastModified[cacheURL] = modified
																}
																modified = jqXHR.getResponseHeader("etag");
																if (modified) {
																	jQuery.etag[cacheURL] = modified
																}
															}
															if (status === 204 || s.type === "HEAD") {
																statusText = "nocontent"
															} else if (status === 304) {
																statusText = "notmodified"
															} else {
																statusText = response.state;
																success = response.data;
																error = response.error;
																isSuccess = !error
															}
														} else {
															error = statusText;
															if (status || !statusText) {
																statusText = "error";
																if (status < 0) {
																	status = 0
																}
															}
														}
														jqXHR.status = status;
														jqXHR.statusText = (nativeStatusText || statusText) + "";
														if (isSuccess) {
															deferred.resolveWith(callbackContext, [success, statusText, jqXHR])
														} else {
															deferred.rejectWith(callbackContext, [jqXHR, statusText, error])
														}
														jqXHR.statusCode(statusCode);
														statusCode = undefined;
														if (fireGlobals) {
															globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error])
														}
														completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
														if (fireGlobals) {
															globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
															if (!(--jQuery.active)) {
																jQuery.event.trigger("ajaxStop")
															}
														}
													}
													return jqXHR
												},
												getJSON: function(url, data, callback) {
													return jQuery.get(url, data, callback, "json")
												},
												getScript: function(url, callback) {
													return jQuery.get(url, undefined, callback, "script")
												}
											});
											jQuery.each(["get", "post"], function(i, method) {
												jQuery[method] = function(url, data, callback, type) {
													if (jQuery.isFunction(data)) {
														type = type || callback;
														callback = data;
														data = undefined
													}
													return jQuery.ajax({
														url: url,
														type: method,
														dataType: type,
														data: data,
														success: callback
													})
												}
											});
											function ajaxHandleResponses(s, jqXHR, responses) {
												var firstDataType, ct, finalDataType, type, contents = s.contents,
													dataTypes = s.dataTypes;
												while (dataTypes[0] === "*") {
													dataTypes.shift();
													if (ct === undefined) {
														ct = s.mimeType || jqXHR.getResponseHeader("Content-Type")
													}
												}
												if (ct) {
													for (type in contents) {
														if (contents[type] && contents[type].test(ct)) {
															dataTypes.unshift(type);
															break
														}
													}
												}
												if (dataTypes[0] in responses) {
													finalDataType = dataTypes[0]
												} else {
													for (type in responses) {
														if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
															finalDataType = type;
															break
														}
														if (!firstDataType) {
															firstDataType = type
														}
													}
													finalDataType = finalDataType || firstDataType
												}
												if (finalDataType) {
													if (finalDataType !== dataTypes[0]) {
														dataTypes.unshift(finalDataType)
													}
													return responses[finalDataType]
												}
											}
											function ajaxConvert(s, response, jqXHR, isSuccess) {
												var conv2, current, conv, tmp, prev, converters = {},
													dataTypes = s.dataTypes.slice();
												if (dataTypes[1]) {
													for (conv in s.converters) {
														converters[conv.toLowerCase()] = s.converters[conv]
													}
												}
												current = dataTypes.shift();
												while (current) {
													if (s.responseFields[current]) {
														jqXHR[s.responseFields[current]] = response
													}
													if (!prev && isSuccess && s.dataFilter) {
														response = s.dataFilter(response, s.dataType)
													}
													prev = current;
													current = dataTypes.shift();
													if (current) {
														if (current === "*") {
															current = prev
														} else if (prev !== "*" && prev !== current) {
															conv = converters[prev + " " + current] || converters["* " + current];
															if (!conv) {
																for (conv2 in converters) {
																	tmp = conv2.split(" ");
																	if (tmp[1] === current) {
																		conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
																		if (conv) {
																			if (conv === true) {
																				conv = converters[conv2]
																			} else if (converters[conv2] !== true) {
																				current = tmp[0];
																				dataTypes.unshift(tmp[1])
																			}
																			break
																		}
																	}
																}
															}
															if (conv !== true) {
																if (conv && s["throws"]) {
																	response = conv(response)
																} else {
																	try {
																		response = conv(response)
																	} catch (e) {
																		return {
																			state: "parsererror",
																			error: conv ? e : "No conversion from " + prev + " to " + current
																		}
																	}
																}
															}
														}
													}
												}
												return {
													state: "success",
													data: response
												}
											}
											jQuery.ajaxSetup({
												accepts: {
													script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
												},
												contents: {
													script: /(?:java|ecma)script/
												},
												converters: {
													"text script": function(text) {
														jQuery.globalEval(text);
														return text
													}
												}
											});
											jQuery.ajaxPrefilter("script", function(s) {
												if (s.cache === undefined) {
													s.cache = false
												}
												if (s.crossDomain) {
													s.type = "GET";
													s.global = false
												}
											});
											jQuery.ajaxTransport("script", function(s) {
												if (s.crossDomain) {
													var script, head = document.head || jQuery("head")[0] || document.documentElement;
													return {
														send: function(_, callback) {
															script = document.createElement("script");
															script.async = true;
															if (s.scriptCharset) {
																script.charset = s.scriptCharset
															}
															script.src = s.url;
															script.onload = script.onreadystatechange = function(_, isAbort) {
																if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
																	script.onload = script.onreadystatechange = null;
																	if (script.parentNode) {
																		script.parentNode.removeChild(script)
																	}
																	script = null;
																	if (!isAbort) {
																		callback(200, "success")
																	}
																}
															};
															head.insertBefore(script, head.firstChild)
														},
														abort: function() {
															if (script) {
																script.onload(undefined, true)
															}
														}
													}
												}
											});
											var oldCallbacks = [],
												rjsonp = /(=)\?(?=&|$)|\?\?/;
											jQuery.ajaxSetup({
												jsonp: "callback",
												jsonpCallback: function() {
													var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (ajax_nonce++));
													this[callback] = true;
													return callback
												}
											});
											jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
												var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
												if (jsonProp || s.dataTypes[0] === "jsonp") {
													callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
													if (jsonProp) {
														s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName)
													} else if (s.jsonp !== false) {
														s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName
													}
													s.converters["script json"] = function() {
														if (!responseContainer) {
															jQuery.error(callbackName + " was not called")
														}
														return responseContainer[0]
													};
													s.dataTypes[0] = "json";
													overwritten = window[callbackName];
													window[callbackName] = function() {
														responseContainer = arguments
													};
													jqXHR.always(function() {
														window[callbackName] = overwritten;
														if (s[callbackName]) {
															s.jsonpCallback = originalSettings.jsonpCallback;
															oldCallbacks.push(callbackName)
														}
														if (responseContainer && jQuery.isFunction(overwritten)) {
															overwritten(responseContainer[0])
														}
														responseContainer = overwritten = undefined
													});
													return "script"
												}
											});
											var xhrCallbacks, xhrSupported, xhrId = 0,
												xhrOnUnloadAbort = window.ActiveXObject &&
											function() {
												var key;
												for (key in xhrCallbacks) {
													xhrCallbacks[key](undefined, true)
												}
											};
											function createStandardXHR() {
												try {
													return new window.XMLHttpRequest()
												} catch (e) {}
											}
											function createActiveXHR() {
												try {
													return new window.ActiveXObject("Microsoft.XMLHTTP")
												} catch (e) {}
											}
											jQuery.ajaxSettings.xhr = window.ActiveXObject ?
											function() {
												return !this.isLocal && createStandardXHR() || createActiveXHR()
											} : createStandardXHR;
											xhrSupported = jQuery.ajaxSettings.xhr();
											jQuery.support.cors = !! xhrSupported && ("withCredentials" in xhrSupported);
											xhrSupported = jQuery.support.ajax = !! xhrSupported;
											if (xhrSupported) {
												jQuery.ajaxTransport(function(s) {
													if (!s.crossDomain || jQuery.support.cors) {
														var callback;
														return {
															send: function(headers, complete) {
																var handle, i, xhr = s.xhr();
																if (s.username) {
																	xhr.open(s.type, s.url, s.async, s.username, s.password)
																} else {
																	xhr.open(s.type, s.url, s.async)
																}
																if (s.xhrFields) {
																	for (i in s.xhrFields) {
																		xhr[i] = s.xhrFields[i]
																	}
																}
																if (s.mimeType && xhr.overrideMimeType) {
																	xhr.overrideMimeType(s.mimeType)
																}
																if (!s.crossDomain && !headers["X-Requested-With"]) {
																	headers["X-Requested-With"] = "XMLHttpRequest"
																}
																try {
																	for (i in headers) {
																		xhr.setRequestHeader(i, headers[i])
																	}
																} catch (err) {}
																xhr.send((s.hasContent && s.data) || null);
																callback = function(_, isAbort) {
																	var status, responseHeaders, statusText, responses;
																	try {
																		if (callback && (isAbort || xhr.readyState === 4)) {
																			callback = undefined;
																			if (handle) {
																				xhr.onreadystatechange = jQuery.noop;
																				if (xhrOnUnloadAbort) {
																					delete xhrCallbacks[handle]
																				}
																			}
																			if (isAbort) {
																				if (xhr.readyState !== 4) {
																					xhr.abort()
																				}
																			} else {
																				responses = {};
																				status = xhr.status;
																				responseHeaders = xhr.getAllResponseHeaders();
																				if (typeof xhr.responseText === "string") {
																					responses.text = xhr.responseText
																				}
																				try {
																					statusText = xhr.statusText
																				} catch (e) {
																					statusText = ""
																				}
																				if (!status && s.isLocal && !s.crossDomain) {
																					status = responses.text ? 200 : 404
																				} else if (status === 1223) {
																					status = 204
																				}
																			}
																		}
																	} catch (firefoxAccessException) {
																		if (!isAbort) {
																			complete(-1, firefoxAccessException)
																		}
																	}
																	if (responses) {
																		complete(status, statusText, responses, responseHeaders)
																	}
																};
																if (!s.async) {
																	callback()
																} else if (xhr.readyState === 4) {
																	setTimeout(callback)
																} else {
																	handle = ++xhrId;
																	if (xhrOnUnloadAbort) {
																		if (!xhrCallbacks) {
																			xhrCallbacks = {};
																			jQuery(window).unload(xhrOnUnloadAbort)
																		}
																		xhrCallbacks[handle] = callback
																	}
																	xhr.onreadystatechange = callback
																}
															},
															abort: function() {
																if (callback) {
																	callback(undefined, true)
																}
															}
														}
													}
												})
											}
											var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/,
												rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"),
												rrun = /queueHooks$/,
												animationPrefilters = [defaultPrefilter],
												tweeners = {
													"*": [function(prop, value) {
														var tween = this.createTween(prop, value),
															target = tween.cur(),
															parts = rfxnum.exec(value),
															unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),
															start = (jQuery.cssNumber[prop] || unit !== "px" && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)),
															scale = 1,
															maxIterations = 20;
														if (start && start[3] !== unit) {
															unit = unit || start[3];
															parts = parts || [];
															start = +target || 1;
															do {
																scale = scale || ".5";
																start = start / scale;
																jQuery.style(tween.elem, prop, start + unit)
															} while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations)
														}
														if (parts) {
															start = tween.start = +start || +target || 0;
															tween.unit = unit;
															tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2]
														}
														return tween
													}]
												};
											function createFxNow() {
												setTimeout(function() {
													fxNow = undefined
												});
												return (fxNow = jQuery.now())
											}
											function createTween(value, prop, animation) {
												var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]),
													index = 0,
													length = collection.length;
												for (; index < length; index++) {
													if ((tween = collection[index].call(animation, prop, value))) {
														return tween
													}
												}
											}
											function Animation(elem, properties, options) {
												var result, stopped, index = 0,
													length = animationPrefilters.length,
													deferred = jQuery.Deferred().always(function() {
														delete tick.elem
													}),
													tick = function() {
														if (stopped) {
															return false
														}
														var currentTime = fxNow || createFxNow(),
															remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
															temp = remaining / animation.duration || 0,
															percent = 1 - temp,
															index = 0,
															length = animation.tweens.length;
														for (; index < length; index++) {
															animation.tweens[index].run(percent)
														}
														deferred.notifyWith(elem, [animation, percent, remaining]);
														if (percent < 1 && length) {
															return remaining
														} else {
															deferred.resolveWith(elem, [animation]);
															return false
														}
													},
													animation = deferred.promise({
														elem: elem,
														props: jQuery.extend({}, properties),
														opts: jQuery.extend(true, {
															specialEasing: {}
														}, options),
														originalProperties: properties,
														originalOptions: options,
														startTime: fxNow || createFxNow(),
														duration: options.duration,
														tweens: [],
														createTween: function(prop, end) {
															var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
															animation.tweens.push(tween);
															return tween
														},
														stop: function(gotoEnd) {
															var index = 0,
																length = gotoEnd ? animation.tweens.length : 0;
															if (stopped) {
																return this
															}
															stopped = true;
															for (; index < length; index++) {
																animation.tweens[index].run(1)
															}
															if (gotoEnd) {
																deferred.resolveWith(elem, [animation, gotoEnd])
															} else {
																deferred.rejectWith(elem, [animation, gotoEnd])
															}
															return this
														}
													}),
													props = animation.props;
												propFilter(props, animation.opts.specialEasing);
												for (; index < length; index++) {
													result = animationPrefilters[index].call(animation, elem, props, animation.opts);
													if (result) {
														return result
													}
												}
												jQuery.map(props, createTween, animation);
												if (jQuery.isFunction(animation.opts.start)) {
													animation.opts.start.call(elem, animation)
												}
												jQuery.fx.timer(jQuery.extend(tick, {
													elem: elem,
													anim: animation,
													queue: animation.opts.queue
												}));
												return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always)
											}
											function propFilter(props, specialEasing) {
												var index, name, easing, value, hooks;
												for (index in props) {
													name = jQuery.camelCase(index);
													easing = specialEasing[name];
													value = props[index];
													if (jQuery.isArray(value)) {
														easing = value[1];
														value = props[index] = value[0]
													}
													if (index !== name) {
														props[name] = value;
														delete props[index]
													}
													hooks = jQuery.cssHooks[name];
													if (hooks && "expand" in hooks) {
														value = hooks.expand(value);
														delete props[name];
														for (index in value) {
															if (!(index in props)) {
																props[index] = value[index];
																specialEasing[index] = easing
															}
														}
													} else {
														specialEasing[name] = easing
													}
												}
											}
											jQuery.Animation = jQuery.extend(Animation, {
												tweener: function(props, callback) {
													if (jQuery.isFunction(props)) {
														callback = props;
														props = ["*"]
													} else {
														props = props.split(" ")
													}
													var prop, index = 0,
														length = props.length;
													for (; index < length; index++) {
														prop = props[index];
														tweeners[prop] = tweeners[prop] || [];
														tweeners[prop].unshift(callback)
													}
												},
												prefilter: function(callback, prepend) {
													if (prepend) {
														animationPrefilters.unshift(callback)
													} else {
														animationPrefilters.push(callback)
													}
												}
											});
											function defaultPrefilter(elem, props, opts) {
												var prop, value, toggle, tween, hooks, oldfire, anim = this,
													orig = {},
													style = elem.style,
													hidden = elem.nodeType && isHidden(elem),
													dataShow = jQuery._data(elem, "fxshow");
												if (!opts.queue) {
													hooks = jQuery._queueHooks(elem, "fx");
													if (hooks.unqueued == null) {
														hooks.unqueued = 0;
														oldfire = hooks.empty.fire;
														hooks.empty.fire = function() {
															if (!hooks.unqueued) {
																oldfire()
															}
														}
													}
													hooks.unqueued++;
													anim.always(function() {
														anim.always(function() {
															hooks.unqueued--;
															if (!jQuery.queue(elem, "fx").length) {
																hooks.empty.fire()
															}
														})
													})
												}
												if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
													opts.overflow = [style.overflow, style.overflowX, style.overflowY];
													if (jQuery.css(elem, "display") === "inline" && jQuery.css(elem, "float") === "none") {
														if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === "inline") {
															style.display = "inline-block"
														} else {
															style.zoom = 1
														}
													}
												}
												if (opts.overflow) {
													style.overflow = "hidden";
													if (!jQuery.support.shrinkWrapBlocks) {
														anim.always(function() {
															style.overflow = opts.overflow[0];
															style.overflowX = opts.overflow[1];
															style.overflowY = opts.overflow[2]
														})
													}
												}
												for (prop in props) {
													value = props[prop];
													if (rfxtypes.exec(value)) {
														delete props[prop];
														toggle = toggle || value === "toggle";
														if (value === (hidden ? "hide" : "show")) {
															continue
														}
														orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop)
													}
												}
												if (!jQuery.isEmptyObject(orig)) {
													if (dataShow) {
														if ("hidden" in dataShow) {
															hidden = dataShow.hidden
														}
													} else {
														dataShow = jQuery._data(elem, "fxshow", {})
													}
													if (toggle) {
														dataShow.hidden = !hidden
													}
													if (hidden) {
														jQuery(elem).show()
													} else {
														anim.done(function() {
															jQuery(elem).hide()
														})
													}
													anim.done(function() {
														var prop;
														jQuery._removeData(elem, "fxshow");
														for (prop in orig) {
															jQuery.style(elem, prop, orig[prop])
														}
													});
													for (prop in orig) {
														tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
														if (!(prop in dataShow)) {
															dataShow[prop] = tween.start;
															if (hidden) {
																tween.end = tween.start;
																tween.start = prop === "width" || prop === "height" ? 1 : 0
															}
														}
													}
												}
											}
											function Tween(elem, options, prop, end, easing) {
												return new Tween.prototype.init(elem, options, prop, end, easing)
											}
											jQuery.Tween = Tween;
											Tween.prototype = {
												constructor: Tween,
												init: function(elem, options, prop, end, easing, unit) {
													this.elem = elem;
													this.prop = prop;
													this.easing = easing || "swing";
													this.options = options;
													this.start = this.now = this.cur();
													this.end = end;
													this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px")
												},
												cur: function() {
													var hooks = Tween.propHooks[this.prop];
													return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this)
												},
												run: function(percent) {
													var eased, hooks = Tween.propHooks[this.prop];
													if (this.options.duration) {
														this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration)
													} else {
														this.pos = eased = percent
													}
													this.now = (this.end - this.start) * eased + this.start;
													if (this.options.step) {
														this.options.step.call(this.elem, this.now, this)
													}
													if (hooks && hooks.set) {
														hooks.set(this)
													} else {
														Tween.propHooks._default.set(this)
													}
													return this
												}
											};
											Tween.prototype.init.prototype = Tween.prototype;
											Tween.propHooks = {
												_default: {
													get: function(tween) {
														var result;
														if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
															return tween.elem[tween.prop]
														}
														result = jQuery.css(tween.elem, tween.prop, "");
														return !result || result === "auto" ? 0 : result
													},
													set: function(tween) {
														if (jQuery.fx.step[tween.prop]) {
															jQuery.fx.step[tween.prop](tween)
														} else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
															jQuery.style(tween.elem, tween.prop, tween.now + tween.unit)
														} else {
															tween.elem[tween.prop] = tween.now
														}
													}
												}
											};
											Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
												set: function(tween) {
													if (tween.elem.nodeType && tween.elem.parentNode) {
														tween.elem[tween.prop] = tween.now
													}
												}
											};
											jQuery.each(["toggle", "show", "hide"], function(i, name) {
												var cssFn = jQuery.fn[name];
												jQuery.fn[name] = function(speed, easing, callback) {
													return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback)
												}
											});
											jQuery.fn.extend({
												fadeTo: function(speed, to, easing, callback) {
													return this.filter(isHidden).css("opacity", 0).show().end().animate({
														opacity: to
													}, speed, easing, callback)
												},
												animate: function(prop, speed, easing, callback) {
													var empty = jQuery.isEmptyObject(prop),
														optall = jQuery.speed(speed, easing, callback),
														doAnimation = function() {
															var anim = Animation(this, jQuery.extend({}, prop), optall);
															if (empty || jQuery._data(this, "finish")) {
																anim.stop(true)
															}
														};
													doAnimation.finish = doAnimation;
													return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation)
												},
												stop: function(type, clearQueue, gotoEnd) {
													var stopQueue = function(hooks) {
															var stop = hooks.stop;
															delete hooks.stop;
															stop(gotoEnd)
														};
													if (typeof type !== "string") {
														gotoEnd = clearQueue;
														clearQueue = type;
														type = undefined
													}
													if (clearQueue && type !== false) {
														this.queue(type || "fx", [])
													}
													return this.each(function() {
														var dequeue = true,
															index = type != null && type + "queueHooks",
															timers = jQuery.timers,
															data = jQuery._data(this);
														if (index) {
															if (data[index] && data[index].stop) {
																stopQueue(data[index])
															}
														} else {
															for (index in data) {
																if (data[index] && data[index].stop && rrun.test(index)) {
																	stopQueue(data[index])
																}
															}
														}
														for (index = timers.length; index--;) {
															if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
																timers[index].anim.stop(gotoEnd);
																dequeue = false;
																timers.splice(index, 1)
															}
														}
														if (dequeue || !gotoEnd) {
															jQuery.dequeue(this, type)
														}
													})
												},
												finish: function(type) {
													if (type !== false) {
														type = type || "fx"
													}
													return this.each(function() {
														var index, data = jQuery._data(this),
															queue = data[type + "queue"],
															hooks = data[type + "queueHooks"],
															timers = jQuery.timers,
															length = queue ? queue.length : 0;
														data.finish = true;
														jQuery.queue(this, type, []);
														if (hooks && hooks.stop) {
															hooks.stop.call(this, true)
														}
														for (index = timers.length; index--;) {
															if (timers[index].elem === this && timers[index].queue === type) {
																timers[index].anim.stop(true);
																timers.splice(index, 1)
															}
														}
														for (index = 0; index < length; index++) {
															if (queue[index] && queue[index].finish) {
																queue[index].finish.call(this)
															}
														}
														delete data.finish
													})
												}
											});
											function genFx(type, includeWidth) {
												var which, attrs = {
													height: type
												},
													i = 0;
												includeWidth = includeWidth ? 1 : 0;
												for (; i < 4; i += 2 - includeWidth) {
													which = cssExpand[i];
													attrs["margin" + which] = attrs["padding" + which] = type
												}
												if (includeWidth) {
													attrs.opacity = attrs.width = type
												}
												return attrs
											}
											jQuery.each({
												slideDown: genFx("show"),
												slideUp: genFx("hide"),
												slideToggle: genFx("toggle"),
												fadeIn: {
													opacity: "show"
												},
												fadeOut: {
													opacity: "hide"
												},
												fadeToggle: {
													opacity: "toggle"
												}
											}, function(name, props) {
												jQuery.fn[name] = function(speed, easing, callback) {
													return this.animate(props, speed, easing, callback)
												}
											});
											jQuery.speed = function(speed, easing, fn) {
												var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
													complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
													duration: speed,
													easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
												};
												opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
												if (opt.queue == null || opt.queue === true) {
													opt.queue = "fx"
												}
												opt.old = opt.complete;
												opt.complete = function() {
													if (jQuery.isFunction(opt.old)) {
														opt.old.call(this)
													}
													if (opt.queue) {
														jQuery.dequeue(this, opt.queue)
													}
												};
												return opt
											};
											jQuery.easing = {
												linear: function(p) {
													return p
												},
												swing: function(p) {
													return 0.5 - Math.cos(p * Math.PI) / 2
												}
											};
											jQuery.timers = [];
											jQuery.fx = Tween.prototype.init;
											jQuery.fx.tick = function() {
												var timer, timers = jQuery.timers,
													i = 0;
												fxNow = jQuery.now();
												for (; i < timers.length; i++) {
													timer = timers[i];
													if (!timer() && timers[i] === timer) {
														timers.splice(i--, 1)
													}
												}
												if (!timers.length) {
													jQuery.fx.stop()
												}
												fxNow = undefined
											};
											jQuery.fx.timer = function(timer) {
												if (timer() && jQuery.timers.push(timer)) {
													jQuery.fx.start()
												}
											};
											jQuery.fx.interval = 13;
											jQuery.fx.start = function() {
												if (!timerId) {
													timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval)
												}
											};
											jQuery.fx.stop = function() {
												clearInterval(timerId);
												timerId = null
											};
											jQuery.fx.speeds = {
												slow: 600,
												fast: 200,
												_default: 400
											};
											jQuery.fx.step = {};
											if (jQuery.expr && jQuery.expr.filters) {
												jQuery.expr.filters.animated = function(elem) {
													return jQuery.grep(jQuery.timers, function(fn) {
														return elem === fn.elem
													}).length
												}
											}
											jQuery.fn.offset = function(options) {
												if (arguments.length) {
													return options === undefined ? this : this.each(function(i) {
														jQuery.offset.setOffset(this, options, i)
													})
												}
												var docElem, win, box = {
													top: 0,
													left: 0
												},
													elem = this[0],
													doc = elem && elem.ownerDocument;
												if (!doc) {
													return
												}
												docElem = doc.documentElement;
												if (!jQuery.contains(docElem, elem)) {
													return box
												}
												if (typeof elem.getBoundingClientRect !== core_strundefined) {
													box = elem.getBoundingClientRect()
												}
												win = getWindow(doc);
												return {
													top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
													left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
												}
											};
											jQuery.offset = {
												setOffset: function(elem, options, i) {
													var position = jQuery.css(elem, "position");
													if (position === "static") {
														elem.style.position = "relative"
													}
													var curElem = jQuery(elem),
														curOffset = curElem.offset(),
														curCSSTop = jQuery.css(elem, "top"),
														curCSSLeft = jQuery.css(elem, "left"),
														calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
														props = {},
														curPosition = {},
														curTop, curLeft;
													if (calculatePosition) {
														curPosition = curElem.position();
														curTop = curPosition.top;
														curLeft = curPosition.left
													} else {
														curTop = parseFloat(curCSSTop) || 0;
														curLeft = parseFloat(curCSSLeft) || 0
													}
													if (jQuery.isFunction(options)) {
														options = options.call(elem, i, curOffset)
													}
													if (options.top != null) {
														props.top = (options.top - curOffset.top) + curTop
													}
													if (options.left != null) {
														props.left = (options.left - curOffset.left) + curLeft
													}
													if ("using" in options) {
														options.using.call(elem, props)
													} else {
														curElem.css(props)
													}
												}
											};
											jQuery.fn.extend({
												position: function() {
													if (!this[0]) {
														return
													}
													var offsetParent, offset, parentOffset = {
														top: 0,
														left: 0
													},
														elem = this[0];
													if (jQuery.css(elem, "position") === "fixed") {
														offset = elem.getBoundingClientRect()
													} else {
														offsetParent = this.offsetParent();
														offset = this.offset();
														if (!jQuery.nodeName(offsetParent[0], "html")) {
															parentOffset = offsetParent.offset()
														}
														parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
														parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true)
													}
													return {
														top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
														left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
													}
												},
												offsetParent: function() {
													return this.map(function() {
														var offsetParent = this.offsetParent || docElem;
														while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
															offsetParent = offsetParent.offsetParent
														}
														return offsetParent || docElem
													})
												}
											});
											jQuery.each({
												scrollLeft: "pageXOffset",
												scrollTop: "pageYOffset"
											}, function(method, prop) {
												var top = /Y/.test(prop);
												jQuery.fn[method] = function(val) {
													return jQuery.access(this, function(elem, method, val) {
														var win = getWindow(elem);
														if (val === undefined) {
															return win ? (prop in win) ? win[prop] : win.document.documentElement[method] : elem[method]
														}
														if (win) {
															win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop())
														} else {
															elem[method] = val
														}
													}, method, val, arguments.length, null)
												}
											});
											function getWindow(elem) {
												return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false
											}
											jQuery.each({
												Height: "height",
												Width: "width"
											}, function(name, type) {
												jQuery.each({
													padding: "inner" + name,
													content: type,
													"": "outer" + name
												}, function(defaultExtra, funcName) {
													jQuery.fn[funcName] = function(margin, value) {
														var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
															extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
														return jQuery.access(this, function(elem, type, value) {
															var doc;
															if (jQuery.isWindow(elem)) {
																return elem.document.documentElement["client" + name]
															}
															if (elem.nodeType === 9) {
																doc = elem.documentElement;
																return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])
															}
															return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra)
														}, type, chainable ? margin : undefined, chainable, null)
													}
												})
											});
											jQuery.fn.size = function() {
												return this.length
											};
											jQuery.fn.andSelf = jQuery.fn.addBack;
											if (typeof module === "object" && module && typeof module.exports === "object") {
												module.exports = jQuery
											} else {
												window.jQuery = window.$ = jQuery;
												if (typeof define === "function" && define.amd) {
													define("jquery", [], function() {
														return jQuery
													})
												}
											}
										})(window);
									} else {}
								} catch (err) {
									return false;
								}
							})();
						};
						function zdztsp() {
							(function() {
								let volumea_counter = 0;
								let volumea_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName('video')[0].volume != 0) {
											document.getElementsByTagName('video')[0].volume = 0;
											document.getElementsByTagName('video')[0].pause();
											clearInterval(volumea_jiankong);
											return false
										}++volumea_counter;
										if (volumea_counter > 20) {
											clearInterval(volumea_jiankong);
											return false
										}
									} catch (err) {}
								}, 123)
							})();
							(function() {
								let volumeb_counter = 0;
								let volumeb_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName('video')[0].volume != 0) {
											document.getElementsByTagName('video')[0].volume = 0;
											document.getElementsByTagName('video')[0].pause();
											clearInterval(volumeb_jiankong);
											return false
										}++volumeb_counter;
										if (volumeb_counter > 20) {
											clearInterval(volumeb_jiankong);
											return false
										}
									} catch (err) {}
								}, 234)
							})();
							(function() {
								let volumec_counter = 0;
								let volumec_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName("video")[0]) {
											let v_player = document.getElementsByTagName("video");
											for (let i = 0, length = v_player.length; i < length; i++) {
												v_player[i].volume = 0;
												v_player[i].pause();
												break;
												return
											}
											clearInterval(volumec_jiankong);
											return false
										}++volumec_counter;
										if (volumec_counter > 20) {
											clearInterval(volumec_jiankong);
											return false
										}
									} catch (err) {}
								}, 345)
							})();
						};
						async function remove(removeobj) {
							const removeall = document.querySelectorAll.bind(document)(removeobj);
							for (let removealli = 0; removealli < removeall.length; removealli++) {
								if (removeall[removealli]) {
									removeall[removealli].remove();
								} else {}
							};
						};
						async function cssobj(css) {
							document.head.insertAdjacentHTML("beforeend", '<style type="text/css" class="cssobj-jiangxiaobai" media="screen">' + css + "{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}</style>");
						};
						async function ggobj(gg) {
							setTimeout(function() {
								if (document.querySelector(gg)) {
									try {
										document.querySelector(gg).remove()
									} catch (err) {}
								} else {}
							}, 250)
						};
						async function ggallobj(all) {
							setTimeout(function() {
								if (document.querySelectorAll(all)) {
									try {
										document.querySelectorAll(all)[0].remove()
									} catch (err) {}
								} else {}
							}, 345)
						};
						async function qpobj(quanping) {
							try {
								var element = (quanping);
								element.style.width = "100%";
								var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
								if (requestMethod) {
									try {
										requestMethod.call(element)
									} catch (err) {}
								} else if (typeof window.ActiveXObject !== "undefined") {
									try {
										var wscript = new ActiveXObject("WScript.Shell");
										if (wscript !== null) {
											wscript.SendKeys("{F11}")
										} else {}
									} catch (err) {}
								} else {}
							} catch (err) {}
						};
						function dssxaobj() {
							setTimeout(function() {
								window.location.reload();
							}, 666);
						};
						function mgzdgqobj() {
							if (localStorage.getItem("mgzdgq") != null) {
								mgzdgq = localStorage.getItem("mgzdgq")
							} else {
								localStorage.setItem("mgzdgq", "1");
								dssxaobj();
							}
						};
						function bdzdjxbyobj() {
							if (localStorage.getItem("vipzdjx") != null) {
								vipzdjx = localStorage.getItem("vipzdjx")
							} else {
								localStorage.setItem("vipzdjx", "1");
								dssxaobj();
							}
						};
						let jxbtupiana = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAMCAMAAACHgmeRAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURX//AIH8BobyGoT/CZP/J4nxIIL5C5T8LJj0PW2hJpgAAAAeSURBVAjXY2BlY4QABiZGBiigNouVGQoYONhZIAAAEpYAdsB2b4AAAAAASUVORK5CYII=";
						let jxbtupianb = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAiUlEQVQImSWOUQ7CQAhEB5bsX/3oEexpvYyH8D7WZGttTVmQIoQEyPAYut0fzsyQIvDI3juICO4OM4s9A6oHTDUF7oZaKy7DAOICqSKgUJ9BQXKLCsq+f5Ik63sBczQhNPVEn/HdNHuZpivGccyhtSUut/SRxJPQlhXP+YUjPJT4WaT8DXYLb4ofKatP2+i53B4AAAAASUVORK5CYII=";
						let jxbtupianc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAFUlEQVQImWPMPHPpPwMSYGJAA4QFAMZ5Aw4eXQtVAAAAAElFTkSuQmCC";
						async function jkpddjobj() {
							try {
								const sjjkslobj = document.querySelectorAll("#httpsvipul>li");
								var arr = [],
									arrhttpsjk;
								for (let sjjkslobji = 0; sjjkslobji < sjjkslobj.length; sjjkslobji++) {
									if (sjjkslobj[sjjkslobji].style.display != 'none') {
										arr.push(sjjkslobj[sjjkslobji].querySelector('a2').innerText);
									}
								};
								arrhttpsjk = arr[Math.floor((Math.random() * arr.length))];
								localStorage.setItem('httpsjk', arrhttpsjk);
								setTimeout(function() {
									try {
										$("ul#httpsvipul>li>span").css("backgroundImage", "");
										document.querySelector("ul#httpsvipul>li:nth-child(" + arrhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
									} catch (err) {}
									document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("httpsjk") + ")").click();
								}, 567);
								document.querySelector('#httpsvipul>li:nth-child(' + arrhttpsjk + ')').click();
							} catch (err) {
								document.querySelector("#httpsvipul>li:nth-child(1)").click();
							}
						};
						async function jkpdobj() {
							if (jxbpcobj) {
								if (objj.match(/bilibili\./)) {
									httpsjk = '2';
									localStorage.setItem("httpsjk", "2");
								} else if (objj.match(/acfun\./)) {
									httpsjk = '3';
									localStorage.setItem("httpsjk", "3");
								} else if (objj.match(/qq\./)) {
									httpsjk = '5';
									localStorage.setItem("httpsjk", "5");
								} else {
									httpsjk = '5';
									localStorage.setItem("httpsjk", "5");
								}
							} else {
								if (objj.match(/bilibili\./)) {
									httpsjk = '6';
									localStorage.setItem("httpsjk", "6");
								} else if (objj.match(/qq\./)) {
									httpsjk = '4';
									localStorage.setItem("httpsjk", "4");
								} else {
									httpsjk = '8';
									localStorage.setItem("httpsjk", "8");
								}
							}
						};
						function bdtbobj() {
							if (localStorage.getItem("vipjxtb") != null) {
								vipjxtb = localStorage.getItem("vipjxtb")
							} else {
								localStorage.setItem("vipjxtb", "1");
							}
							vipjxss = '1';
						};
						function zdjyobj() {
							if (localStorage.getItem("zdpddy") != null) {} else {
								localStorage.setItem('zdpddy', '1');
								location.reload();
							}
							if (localStorage.getItem("httpsjk") != null) {
								httpsjk = localStorage.getItem("httpsjk")
							} else {
								jkpdobj();
								location.reload();
							}
							bdtbobj();
						};
						function jxbzdjxobj() {
							if (localStorage.getItem("vipzdjx") != null) {
								vipzdjx = localStorage.getItem("vipzdjx")
							} else {
								localStorage.setItem("vipzdjx", "2");
								dssxaobj();
							}
							cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxli{display:block!important}963540817');
							zdjyobj();
						};
						function bdvipzdjxobj() {
							if ((localStorage.getItem("vipzdjx") != null || localStorage.getItem("vipzdjx") === "1")) {
								vipzdjx = localStorage.getItem("vipzdjx");
							} else {
								localStorage.setItem("vipzdjx", "2");
								dssxaobj();
							}
						};
						function zdvipvideotg() {
							cssobj('div.maomibtn li#vipvideotgli{display:block!important}963540817');
							if (localStorage.getItem("vipvideotg") != null) {
								vipvideotg = localStorage.getItem("vipvideotg");
							} else {
								localStorage.setItem("vipvideotg", "1");
								dssxaobj();
							}
						};
						function zdymyypdobj() {
							cssobj('div.maomibtn li#ymyypdobjli{display:block!important}963540817');
							if (localStorage.getItem("ymyypdobj") != null) {
								ymyypdobj = localStorage.getItem("ymyypdobj");
							} else {
								localStorage.setItem("ymyypdobj", "0");
								dssxaobj();
							}
						};
						function zdgbkjjjobj() {
							cssobj('div.maomibtn li#gbkjjjobjli{display:block!important}963540817');
							if (localStorage.getItem("gbkjjjobj") != null) {
								gbkjjjobj = localStorage.getItem("gbkjjjobj");
							} else {
								localStorage.setItem("gbkjjjobj", "0");
								dssxaobj();
							}
							if (gbkjjjobj == 1) {
								cssobj('div.maomibtn li#ckkjjjobjli{display:none!important}963540817');
							} else {}
						};
						function zdgbdmobj() {
							cssobj('div.maomibtn li#gbdmobjli{display:block!important}963540817');
							if (localStorage.getItem("gbdmobj") != null) {
								gbdmobj = localStorage.getItem("gbdmobj");
							} else {
								localStorage.setItem("gbdmobj", "0");
								dssxaobj();
							}
						};
						function jxbzdjxhyobj() {
							if (localStorage.getItem("vipzdjx") == '1') {
								if (jxbpclwobj) {
									localStorage.setItem('vipzdjx', '2');
									location.reload();
								} else {}
							} else {
								bdvipzdjxobj();
								zdjyobj();
								cssobj('div.maomibtn li#vipjxtbli,div.maomibtn li#vipzdjxhyli{display:block!important}963540817');
							}
						};
						function jxqtwzobj() {
							zdjyobj();
							cssobj('div.maomibtn li#vipjxtbli{display:block!important}963540817');
						};
						function jxqtwzhyobj() {
							bdtbobj();
							cssobj('div.maomibtn li#vipjxtbli{display:block!important}div.maomibtn li>a[target="_blank"]:not([class="maomi"]):not([href*="//wpa.qq.com/msgrd"]):not([href*="/00/raw/master/"])');
						};
						function apddjobj() {
							let pdssgjcobj_counter = 0;
							let pdssgjcobj_jiankong = setInterval(function() {
								let pdssgjcobj_btn = $(pdssgjcobj).length == 1;
								if (pdssgjcobj_btn) {
									window.location.href = document.querySelector(pdssgjcobj + ':first-child').href;
									clearInterval(pdssgjcobj_jiankong);
									return false
								}++pdssgjcobj_counter;
								if (pdssgjcobj_counter > 10) {
									clearInterval(pdssgjcobj_jiankong);
									return false
								}
							}, 456)
						};
						function jxbvolumeaobj() {
							(function() {
								let videovolumea_counter = 0;
								let videovolumea_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName('video')[0].volume == 0) {
											document.getElementsByTagName('video')[0].volume = 1;
											clearInterval(videovolumea_jiankong);
											return false
										}++videovolumea_counter;
										if (videovolumea_counter > 20) {
											clearInterval(videovolumea_jiankong);
											return false
										}
									} catch (err) {}
								}, 789)
							})();
							(function() {
								let videovolumeb_counter = 0;
								let videovolumeb_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName('video')[0].volume == 0) {
											document.getElementsByTagName('video')[0].volume = 1;
											clearInterval(videovolumeb_jiankong);
											return false
										}++videovolumeb_counter;
										if (videovolumeb_counter > 20) {
											clearInterval(videovolumeb_jiankong);
											return false
										}
									} catch (err) {}
								}, 987)
							})();
							(function() {
								let videovolumec_counter = 0;
								let videovolumec_jiankong = setInterval(function() {
									try {
										if (document.getElementsByTagName("video")[0]) {
											let v_player = document.getElementsByTagName("video");
											for (let i = 0, length = v_player.length; i < length; i++) {
												v_player[i].muted = false;
												v_player[i].volume = 1;
												break;
												return
											}
											clearInterval(videovolumec_jiankong);
											return false
										}++videovolumec_counter;
										if (videovolumec_counter > 20) {
											clearInterval(videovolumec_jiankong);
											return false
										}
									} catch (err) {}
								}, 1234)
							})();
						};
						async function jxbvolumebobj() {
							(function() {
								try {
									let videovolumec_counter = 0;
									let videovolumec_jiankong = setInterval(function() {
										try {
											if (document.getElementsByTagName("video")[0]) {
												let v_player = document.getElementsByTagName("video");
												for (let i = 0, length = v_player.length; i < length; i++) {
													v_player[i].pause();
													v_player[i].volume = 0;
												}
												clearInterval(videovolumec_jiankong);
												return false
											} else if (document.querySelector("video")) {
												let v_player = document.querySelector("video");
												for (let i = 0, length = v_player.length; i < length; i++) {
													v_player[i].pause();
													v_player[i].volume = 0;
												}
												clearInterval(videovolumec_jiankong);
												return false
											} else if (document.querySelectorAll("embed,object,iframe[frameborder]")) {
												let v_player = document.querySelectorAll("embed,object,iframe[frameborder]");
												for (let i = 0, length = v_player.length; i < length; i++) {
													v_player[i].parentNode.removeChild(v_player[i]);
													break;
												}
												clearInterval(videovolumec_jiankong);
												return false
											}++videovolumec_counter;
											if (videovolumec_counter > 100) {
												clearInterval(videovolumec_jiankong);
												return false
											}
										} catch (err) {
											return false
										}
									}, 100)
								} catch (err) {
									return false
								}
							})();
						};
						function lkzdztobj() {
							if (localStorage.getItem("lkzdzt") != null) {
								lkzdzt = localStorage.getItem("lkzdzt")
							} else {
								localStorage.setItem("lkzdzt", "0");
								dssxaobj();
							}
							cssobj('div.maomibtn li#lkzdztbyli{display:block!important}963540817');
						};
						function jxzdqpobj() {
							if (localStorage.getItem("jxzdqp") != null) {
								jxzdqp = localStorage.getItem("jxzdqp")
							} else {
								localStorage.setItem("jxzdqp", "0");
								dssxaobj();
							}
							cssobj('div.maomibtn li#pcjxzdqpli{display:block!important}963540817');
						};
						function jzcopy() {
							try {
								document.addEventListener('copy', function(e) {
									e.preventDefault();
									e.stopPropagation();
								});
							} catch (err) {}
						};
						function dwobj(dingwei) {
							try {
								window.scrollTo(0, document.querySelector(dingwei).offsetTop);
							} catch (err) {}
						};
						function diyobj(zdydm) {
							try {
								document.head.insertAdjacentHTML('beforeend', zdydm);
							} catch (err) {}
						};
						function jkdsflyobj() {
							if (document.location.protocol.indexOf("http") != -1 && (document.referrer.indexOf(location.href.split("/")[2]) == -1 || document.referrer.indexOf(location.href.split("/")[2]) > 10)) {
								parent.window.opener = null
							} else {}
						};
						function jxqzsxobj() {
							try {
								if (document.querySelector("iframe#宁小影")) {
									document.querySelector("div#宁小影").innerHTML = '<img id="宁小影" src="https://api.btstu.cn/sjbz/zsy.php" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;">';
								} else if (document.querySelector("img#宁小影")) {} else {
									if (!document.querySelector("jxbvideo") && !document.querySelector("\u5b81\u5c0f\u5f71\u662f\u6211")) {
										document.body.appendChild(document.createElement("宁小影是我"));
										try {
											if (document.querySelector("div#宁小影>iframe#宁小影")) {} else if (document.querySelector("div#宁小影>img#宁小影")) {} else {
												(function() {
													try {
														pausetimer = setInterval(function() {
															try {
																if (document.getElementsByTagName("video")[0]) {
																	var v_player = document.getElementsByTagName("video");
																	for (var i = 0, length = v_player.length; i < length; i++) {
																		try {
																			try {
																				v_player[i].paused;
																			} catch (err) {}
																			try {
																				v_player[i].volume = 0;
																			} catch (err) {}
																			try {
																				v_player[i].pause();
																			} catch (err) {}
																			try {
																				v_player[i].parentNode.innerHTML = v_player[i].parentNode;
																			} catch (err) {}
																			try {
																				v_player[i].paused;
																			} catch (err) {}
																			try {
																				v_player[i].volume = 0;
																			} catch (err) {}
																			try {
																				v_player[i].pause();
																			} catch (err) {}
																		} catch (err) {}
																	}
																	clearInterval(pausetimer)
																} else if (document.getElementsByTagName("object")[0]) {
																	var v_player = document.getElementsByTagName("object");
																	for (var i = 0, length = v_player.length; i < length; i++) {
																		try {
																			v_player[i].parentNode.removeChild(v_player[i])
																		} catch (err) {}
																	}
																	clearInterval(pausetimer)
																}
															} catch (err) {}
														}, 123)
													} catch (err) {
														return false
													}
												})();
											}
										} catch (err) {}
										if (!document.querySelector("\u5f3a\u5236\u5237\u65b0")) {
											document.body.appendChild(document.createElement("\u5f3a\u5236\u5237\u65b0"));
											let url = window.location.href;
											setInterval(function() {
												let newUrl = window.location.href;
												if (newUrl != url) {
													url = window.location.href;
													location.reload();
												}
											});
										} else {}
									} else {}
								}
							} catch (err) {}
						};
						function jxqzsxobjzdbt() {
							try {
								if (document.title.match(/第\s*?\d+?\s*?集/)) {
									jishu = document.title.replace(/^.+?第\d*?(\d+?)\s*?集/, "$1");
								} else {}
							} catch (err) {}
							try {
								if (jishu.match(/^\s*?\d+?\s*?$/)) {
									try {
										GM_setValue('集数', jishu);
									} catch (err) {}
									try {
										GM_setValue('视频自动全屏', '开启');
									} catch (err) {}
								} else {}
							} catch (err) {}
							try {
								GM_setValue('视频自动全屏', '开启');
							} catch (err) {}
						};
						function jxqzsxobjzdbtobj() {
							if (localStorage.getItem("httpsjk") == '2') {
								jxqzsxobjzdbt();
							} else {}
						}; if (iqiyialiwaiobj) {} else if (pcliwaiobj || sjliwaiobj || jxjkobj || mmkjjtjobj || objj.match(/(?:pgso|555dy6|miao101|douyin|kuaishou|douban|bilibili|acfun|douban|yinyuetai|kuwo|kugou|m1907|qq|xiami|migu|ximalaya|app-echo|1ting|lrts|haokan|baidu|wbdy|web3v|9ku)\./)) {
							cssobj('[class^="myBtnxx"],[id^="myBtnxx"],[class*="app"][class*="-ad-view-box"],[id*="app"][id*="-ad-view-box"],[class*="app-topbanner"],[id*="app-topbanner"],[class*="_bg_ad"],[id*="_bg_ad"],[class*="advertise"],[id*="advertise"],[class^="bd_ad"],[id^="bd_ad"],[class*=" area ad"],[id*=" area ad"],[class*="ad"][class*="banner"],[id*="ad"][id*="banner"],[class^="ad_inner"],[id^="ad_inner"],[class^="slide-gg"],[id^="slide-gg"],[class^="side_gg"],[id^="side_gg"],[class^="slide_ad"],[id^="slide_ad"],[class^="side_ad"],[id^="side_ad"],[class^="mod_ad"],[id^="mod_ad"],[class^="ad-client"],[id^="ad-client"],[class*="play-tips-ad"],[id*="play-tips-ad"],[class^="ad-slider"],[class^="ad-festival"],[id^="ad-slider"],[id^="ad-festival"],[class^="ad-"][class*="fixed"],[id^="ad-"][id*="fixed"],[class*="modAdv"],[id*="modAdv"],[class*="boxAdv"],[id*="boxAdv"],[class*="-ad-bottom"],[id*="-ad-bottom"]');
							cssobj('ad,ads,marquee,foot,footer,div;not([style]);not([class]);not([id])>a[style*="block"][style*="!important"],[data-adzone],div[adid^="ad-"],div[class^="adv "],div[id^="adv "],div[class*="corneradv "],div[id*="corneradv "],div[class$="-browser"][style*="fixed"],[class*="qinfan"],[id*="qinfan"],[class*="qianfan"],[id*="qianfan"],[class*="header"][class*="ownload"],[id*="header"][id*="ownload"],[class*="app"][class*="ownload"],[id*="app"][id*="ownload"],[class$="-fullscreen-tip"],[_stat*="浮层"],div[class*="foot"],div[id*="foot"],div[class*="bottom"][class*="recommend"],div[id*="bottom"][id*="recommend"],div[class^="right-activity"],div[id^="right-activity"],[data-adpid-checked],[data-ad-client],[data-adext],[ad-status],div[class*="pause"]:not([id]):not([class*="player-paused"]):not([aria-label]):not([class*="bilibili"]):not([class*="auto"]):not([class*="hide"]):not([class*="shadow"]):not([class*="icon"]):not([class*="btn"]):not([class*="svg"]):not([class*="definition"]),div[id*="pause"]:not([class]):not([id*="player-paused"]):not([aria-label]):not([id*="bilibili"]):not([id*="auto"]):not([id*="hide"]):not([id*="shadow"]):not([id*="icon"]):not([id*="btn"]):not([id*="svg"]):not([id*="definition"]),[data-role*="pause"]');
							cssobj('[class*="open"][class*="mobile"],[id*="open"][id*="mobile"],[node-type*="open"][node-type*="mobile"],a[title*="领"][title*="礼包"],[class^="ad-"][class*="bottom"],[id^="ad-"][id*="bottom"],[class^="ad-platform"],[id^="ad-platform"],[class^="mod_ad"],[id^="mod_ad"],[class*="_ad_center_"],[id*="_ad_center_"],[class*="download"][class*="bottom"][class*="bar"],[id*="download"][id*="bottom"][id*="bar"],[class*="-link-box"],[id*="-link-box"],[class$="_gg"],[id$="_gg"],[class*="bottom"][class*="operation"][class*="box"],[id*="bottom"][id*="operation"][id*="box"],a[onclick*="ga"][onclick*="click"],div[class^="activity"]:not([class*="main"]),div[id^="activity"]:not([id*="main"]),div[class$="activity"],div[id$="activity"],[class*="Adv"],[id*="Adv"],[data-ad-client],[data-type*="oogle"],[data-target-url*="activity"][class*="box"][class*="details"][class*="ads"],[id*="box"][id*="details"][id*="ads"],[class*="bottom"][class*="banner"],[id*="bottom"][id*="banner"],[class^="foot"],[id^="foot"],[class*="footer"]:not([class*="clearfix"]):not([class^="p"]),[id*="footer"]:not([id*="clearfix"]):not([id^="pb"])');
							cssobj('[class="undefined"],[id="undefined"],[tl="undefined"],[data-title="undefined"],[class*="title"][class*="title"][class*="box"],[class$="-advert"],[id$="-advert"],[class^="gg_"],[id^="gg_"],[class*="logo"][class*="box"],[id*="logo"][id*="box"]');
							cssobj('[class*="m-"][class*="diversion"][class*="fix"],[id*="m-"][id*="diversion"][id*="fix"],[class*="m-"][class*="diversion"][class*="popup"],[id*="m-"][i*="diversion"][id*="popup"],[data-adzone],[adid],[class*="ause"][class*="ox"],[id*="ause"][id*="ox"],a[data-href*="/gbook/report"],[class*="foot-info"],[class*="video-player"] [class*="open"],[class*="open-app"],[id*="open-app"],[class="goods"],[id="goods"],[class*="tips"][class*="box"][style^="background"],[id*="tips"][id*="box"][style^="background"],[class^="tips"]:not(em):not(dd):not([class*="ox"]),[id^="tips"]:not(em):not(dd):not([id*="ox"]),ul[class*="player"]>li[class*="down"], ul[class*="player"]>li>a[href^="javascript:AddFav"],ul[class*="player"]>li[class*="down"], ul[class*="player"]>li>a[href^="javascript:AddFav"],ul[class*="player"]>li[class*="down"],ul[class*="player"]>li>a[href^="javascript:AddFav"],[class*="digg"],[id*="digg"],li>a[href^="javascript"][onclick*="eload("],li>a[href^="javascript"][onclick*="ogin("],li>a[href*="页面地址http"],ul[class$=" clearfix"]>li>a[href*="book"][title*="反馈"],iframe[data-aa],iframe[style*="height:90px"],iframe[style*="height: 90px"],iframe[style*="height:250px"],iframe[style*="height:250px"],video[src^="blob:http"]~:not(nav):not(header):not([class*="header"]):not([id*="header"]) [class*="logo"],video[src^="blob:http"]~:not(nav):not(header):not([class*="header"]):not([id*="header"]) [id*="logo"],video[src^="blob:http"]~:not(nav):not(header):not([class*="header"]):not([id*="header"]) [class*="Logo"],video[src^="blob:http"]~:not(nav):not(header):not([class*="header"]):not([id*="header"]) [id*="Logo"]');
							cssobj('div[class*="side"][class*="bar"][class*="own"],div[id*="side"][id*="bar"][id*="own"],[style*="app-banner-bottom"],[class*="pp"][class*="anner"],[id*="pp"][id*="anner"],[dt-eid*="pen"][dt-eid*="pp"],[dt-eid*="pen"][dt-eid*="ottom"],[dt-eid*="pp"][dt-eid*="ottom"]');
							cssobj('[class^="open-app-"],[id^="open-app-"],[class^="open_app_"],[id^="open_app_"],[class*="down-app-button"],[class*="-oper-pos"],[ad-dom-img],[data-player-hook*="logo"],[class^="adv "],[id^="adv "],[class^="adv-"],[id^="adv-"],a[pb-click][target*="_blank"]:not([href^="/"]):not([data-pb-txid]),[style^="position:fixed;bottom:0px"],[style^="position: fixed; bottom: 0px"],[style^="position:fixed;right: 0px"],[style^="position: fixed; right: 0px"],[class^="BAIDU_"],[id^="BAIDU_"],[data-appurl],[data-appurlios],[class*="Daoliu"],[id*="Daoliu"],section[class*="game"],section[id*="game"],[class*="detail_ad"],[id*="detail_ad"],[class*="layout_ad"],[id*="layout_ad"],[class*="ad ad_"],[id*="ad ad_"],[class*="qianfan"],[id*="qianfan"],iframe[width="960"][height="90"],[class*="AdPic"],[id*="AdPic"],[class^="vip-banner"],[id^="vip-banner"],[adata],html>head+body~div:not([style]):not([class]):not([id]),[class*="hongbao"],[id*="hongbao"],[ad-status],[class*=" cl ad_"],[id*=" cl ad_"],[class*=" cr ad_"],[id*=" cr ad_"],[class^="hd-ad"],[id^="hd-ad"],[class^="AD"],[class^="AD"],[id^="AD"],[id^="AD"],[class*="ad_microlen"],[id*="ad_microlen"],[class*="vip"][class*="guide"],[id*="vip"][id*="guide"],[width="300"][height="250"],[width="250"][height="300"],[src*=".cnzz."],[href*=".cnzz."]');
							let jxbscysobj = Array('[tj_id^="sb_"]', '[src*="/hm.js?"]', '[src*="?id=UA-"]', '[class$="-ie-tips"]', '[id$="-ie-tips"]', '[class*="miaozhenad"]', '[id*="miaozhenad"]', '[class*="BAIDU_DUP_"]', '[id*="BAIDU_DUP_"]', 'iframe[src*="/game/"]', '[width="250"][height="300"]', '[width="300"][height="250"]', '[class*="-ad-"][id*="banner"]', '[id*="-ad-"][id*="banner"]', 'iframe[width="960"][height="90"]', 'iframe[class*="open"][class*="app"]', 'iframe[id*="open"][id*="app"]', '[class*="google"]', '[id*="google"]', '[name*="google"]', '[class*="cnzz"]', '[id*="cnzz"]', '[src*=".cnzz."]', '[href*=".cnzz."]', 'gg', 'guanggao', 'ad', 'ads', 'adx', 'marquee');
							remove(jxbscysobj);
						} else {} if (!jxjkobj && !document.querySelector("\u5b81\u5c0f\u5f71")) {
							window.close();
						} else {} if (jxjkobj || objj.match(/m1907\./) || obj.match(/&autoplay=1&metareferer=/)) {
							jzcopy();
							if (objj.match(/(?:jx\.2bjx\.com|4321s\.cc)/)) {
								zdgbxjanobj = setInterval(function() {
									if (document.querySelector('div[class^="llqplayer-home show"]')) {
										document.querySelector('button[onclick*="llqplayerHome"]').click();
										clearInterval(zdgbxjanobj);
									} else {}
									setTimeout(function() {
										clearInterval(zdgbxjanobj);
									}, 23456);
								}, 456);
							} else {}
							if (!objj.match(/(?:parwix|ufanw|jx\.13tv)\./)) {
								(function() {
									for (let e = new Array("a", "img"), n = 0; n < 2; n++) {
										let i = document.getElementsByTagName(e[n]);
										if (i && i.length > 0) for (let a = 0; a < i.length; a++) {
											let l = i[a], s = l.getAttribute("id"), d = l.getAttribute("class");
											d && "A" == l.tagName && -1 != d.indexOf("; ") && l.getAttribute("onclick") && l.getAttribute("target") && l.href && (l.style.display = "none"), s && d && s == d && d.length > 10 && "LI" == l.tagName && (l.style.display = "none"), s && (s.length > 30 && -1 == s.indexOf("-") && (l.style.display = "none"), /^[0-9]*$/.test(s) && s.length > 1 && (l.style.display = "none"), s.length > 7 && /[0-9]/.test(s) && /[a-z]/i.test(s) && l.getAttribute("style") && (l.style.display = "none")), s && d && (-1 != d.indexOf(" ") && -1 != d.indexOf(s) && l.getAttribute("style") && (l.style.display = "none"), s == d && /[0-9]/.test(s) && /[a-z]/i.test(s) && (l.style.display = "none"))
										}
									}
								})();
							} else {}(function() {
								'use strict';
								let iframes = document.getElementsByTagName("iframe");
								for (let i = 0; i < iframes.length; i++) {
									iframes[i].setAttribute("allowfullscreen", true)
								}
							})();
							if (objj.match(/(?:eggvod|eofelis)\./)) {
								cssobj('*');
								window.close();
							} else if (!objj.match(/(?:m1907|beijixs)\./)) {
								if ((document.querySelector("body>div") == null) && (document.querySelector("video") == null) && (document.querySelector("iframe") == null)) {
									if (obj.match(/\?963540817\?url=/)) {
										if (document.querySelector("body").innerText.match(/\u817e\u8baf\u89e3\u6790/mg) != null) {
											window.location.href = document.body.innerText.replace(/^[\W\S]+?>\s*?(https?:\/\/[^<]+?)\s*?<\/\w+?>\s*?<\s*?.+?\u817e\u8baf\u89e3\u6790[\W\S]+$/mg, "$1").replace(/\\\//g, "/") + window.location.search.substr(15);
										}
									} else {
										if (document.querySelector("body").innerText.match(/"\s*?code\s*?"\s*?:\s*?(?:"\s*?)?[45]0[234]/) != null) {
											alert('此接口暂时无法解析，请自行更换 接口');
											window.close();
										} else if (document.querySelector("body").innerText.match(/"\s*?msg\s*?"\s*?:\s*?"?[^"]*?(?:盗链|\\u76d7\\u94fe|失败|\\u5931\\u8d25|丢失|\\u4e22\\u5931|修复|\\u4fee\\u590d|对不起|\\u5bf9\\u4e0d\\u8d77|客户端|\\u5ba2\\u6237\\u7aef)/img) != null) {
											alert('此接口暂时无法解析，请自行更换 接口');
											window.close();
										} else if (document.querySelector("body").innerText.match(/"\s*?url\s*?"\s*?:\s*?"\s*?:?(?:\/\/|\\\/\\\/)/img) != null) {
											alert('此接口暂时无法解析，请自行更换 接口');
											window.close();
										} else if (document.querySelector("body").innerText.match(/"\s*?url\s*?"\s*?:\s*?"\s*?https?(?:%3A%2F%2F[\W\S]+?%|:\\\/\\\/[\W\S]+?\\\/|:\/\/)/img) != null) {
											window.location.href = "https://www.555dy.vip/p.php?url=" + encodeURIComponent(document.body.innerText.replace(/^[\W\S]+?"\s*?url\s*?"\s*?:\s*?"([^"]+?)"[\W\S]*$/i, "$1").replace(/\\\//g, "/")) + "&autoplay=1&metareferer=undefined";
										} else {}
									}
								} else {
									cssobj('div[class^="iziToast"][class*="topCenter"],div[id="banne"][class^="top_"],[class^="divbox"],[id^="divbox"],[value*="捐"],[value*="券"],[value="包"],[value*="赏"]');
									cssobj('body>:not(section):not(center):not(iframe):not(embed):not(object):not(video):not(main):not(span):not(nav):not(div):not(hr):not(p),:not(embed):not(object):not(video) img:not([src*="/?url="]):not([src^="data:image/]),div[class="a1"]~script~[style*="fixed"],div[id="a1"]~script~[style*="fixed"],div[class*="play"]~script~[style*="fixed"],div[id*="play"]~script~[style*="fixed"],div[class*="layer"]+script[src^="http"]~:not(video),div[id*="layer"]+script[src^="http"]~:not(video)');
									cssobj('[class*="player_pause"],[id*="player_pause"],[class^="layui-layer-"],[id^="layui-layer-"],[class*="jiaqun"],[id*="jiaqun"],[class*="qqun"],[id*="qqun"],[class*="weixin"],[id*="weixin"],div[class^="links"],div[class^="htmle"][class*="-"],div[class*="roll"][class*="switch"],div[class*="live"][class*="barrage"],[class^="dating"],[class="waifu"],[class*="layui-layer"][class*="tips"],[class*="Toast"][class*="Center"],[style*="block"][class*="banne"],[style*="block"][id*="banne"],[id*="bottom"],[style*="position:fixed;"][style*="bottom:0px;"],[style*="position: fixed;"][style*="bottom: 0px;"],[style*="position:fixed;"][style*="left:0px;"],[style*="position: fixed;"][style*="left: 0px;"],[style^="display:inline-block"],[style^=" display"][style*="none"]+[style*="fixed"],[style^="display"][style*="none"]+[style*="fixed"],div[style^="display"][style*="none"] script,div[style^=" display"][style*="none"] script,span[style^="display"][style*="none"] img,span[style^=" display"][style*="none"] img,span[style^="display"][style*="none"]+script,span[style^=" display"][style*="none"]+script,span[style^="display"][style*="none"]+script+div,span[style^=" display"][style*="none"]+script+div,script+span[style^="display"][style*="none"]+div,script+span[style^=" display"][style*="none"]+div,[style*="bottom:0px;left:0px;"][style*="position:fixed"],[style*="bottom: 0px; left: 0px;"][style*="position: fixed"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar{width:0px!important;height:0px!important}963540817');
									pcspzdqpobj = setInterval(function() {
										if (document.querySelector('video')) {
											qpobj(document.querySelector('video'));
											setTimeout(jxbjkspbfjsobj, 3333);
											clearInterval(pcspzdqpobj);
										} else {}
										setTimeout(function() {
											clearInterval(pcspzdqpobj);
										}, 6666);
									}, 666);
								}
							} else {}
						} if (jxbpcobj) {
							document.body.appendChild(document.createElement("宁小影电脑网页"));
							function jxbjkspbfjsobj() {
								(function() {
									if (!document.querySelector("\u5b81\u5c0f\u5f71\u76d1\u63a7\u89c6\u9891\u64ad\u653e\u7ed3\u675f")) {
										if (objj.match(/(?:m1907\.|jx\.2bjx\.com|4321s\.cc)/)) {} else {
											document.body.appendChild(document.createElement("\u5b81\u5c0f\u5f71\u76d1\u63a7\u89c6\u9891\u64ad\u653e\u7ed3\u675f"));
											try {
												if (document.querySelector('video')) {
													if (obj.match(/&autoplay=1&metareferer=undefined$/)) {
														if (document.title.indexOf('\u5b81\u5c0f\u5f71') < 0) {
															document.title = '\u2265\u25b3\u2264 \u5b81\u5c0f\u5f71 \u2265\u25b3\u2264';
														} else {}
													} else {}
													let elevideo = document.querySelector('video');
													if (elevideo.duration - elevideo.currentTime <= 30) {
														elevideo.currentTime = 1;
														elevideo.play();
													}
													elevideo.addEventListener("timeupdate", () => {
														if (Math.floor(elevideo.duration - elevideo.currentTime) <= 30) {
															window.close();
														}
													}, false);
													elevideo.addEventListener('ended', () => {
														window.close();
													}, false);
												} else {}
											} catch (err) {}
										}
									} else {}
								})();
							}; if (jxbpclwobj) {
								cssobj('div#jxbhttps{top:70px!important;left:5px!important;transform:scale(0.5)!important;}ul#httpsvipul>li{margin:-7.5px -17.5px -7.5px -17.5px!important;transform:scale(0.75)!important;}ul#httpsvipul{top:115px!important;width:450px!important;}963540817');
							} else {}
							function jszdqc() {
								setTimeout(function() {
									try {
										if (GM_getValue('集数').match(/^\s*?\d+?\s*?$/) && !GM_getValue('集数').match(/^\s*?选集\s*?$/)) {
											GM_setValue('集数', '选集')
										} else {}
									} catch (err) {}
								}, 6789)
							};
							function pcjkzdyj() {
								if (localStorage.getItem("pcjkzdyj") != null) {} else {
									localStorage.setItem('pcjkzdyj', '1');
									location.reload();
								}
								cssobj('div.maomibtn li#pcjkzdyjli{display:block!important}963540817');
							};
							if (obj.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|vku\.youku\.com\/live\/)/)) {
								if (obj.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
									jxbzdjxobj();
									pcjkzdyj();
									jxzdqpobj();
									zdgbkjjjobj();
									zdgbdmobj();
									lkzdztobj();
									if (localStorage.getItem("vipzdjx") != '1') {
										zdvipvideotg();
									} else {} if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										cssobj('[class*="error-layer"],[id*="error-layer"],[class*="preplay-background"],[id*="preplay-background"],[class*="vip_info"],[id*="vip_info"],[class*="vip_limit_box"],[id*="vip_limit_box"]');
									} else {} if (localStorage.getItem("vipzdjx") == '1') {
										jxbvolumebobj();
									} else {}
									cssobj('div[class^="g-so_"],.control-icon.control-phonewatch,.control-scroll-info.active,div[class^="u-app_"],div[class^="u-vip_"],.h5-ext-layer iframe,.h5-ext-layer iframe+div[style*="margin-left:"],.h5-ext-layer iframe,.h5-ext-layer iframe+div [style*="cursor"][style*="pointer"],li[class^="g-view_"][class*="top-nav-more-large_"]:last-of-type,.vip_limit_content_sid p,.vip_limit_content_sid em,[data-spm*="shoujikan"],[class^="panel_"][class*=" u-panel_"],[class^="logout-header_"],div.youku-layer-logo,#right-title-ad-banner');
									cssobj('div[class*="-position-"][style*="fixed"],div[class^="change-skin"],div[class^="top_area"],.control-scroll-infotop,.h5-ext-layer>div[style*="left:50%"][style*="top:50%"],.h5-ext-layer>div[style*="left: 50%"][style*="top: 50%"],span[class="iconfont iconshoucang"],div[class^="ab_"],div[id^="ab_"],.h5-ext-layer img,div[class^="switch-img"][class*="setconfig"],div[id^="Boh"]:not([id*="mment"]),div[class^="boh"]:not([class*="mment"]),div[class^="leftarea_"],[class*="foot"],[class^="fixed_bar_"] a[target*="_blank"],ul.play-fn,.js-top-icon');
									cssobj('div[class^="rightarea_"]{margin-left:auto!important;}[class^="fixed_bar_"]{background-color:transparent!important;}div.barrage-normal-container{float:left!important;width:100%!important;text-align:center;}div#ykPlayer{z-index:999999999!important}div[data-spm*="login"]>div[style*="block"][style*="fixed"]{z-index:2000000000!important;}div[id^="header-contain"]{position:absolute!important;}963540817');
								} else {
									jxqtwzhyobj();
									lkzdztobj();
									cssobj('h2.caption{margin-left:calc(100vw/4)!important;width:auto!important;text-align:center;}.content{margin-top:auto!important;}body{background-image:none!important;background-color:#333333!important;}::-webkit-scrollbar{width:0px!important;height:0px!important;}div.description,div.outlets,div.action,div.maomibtn li#ckkjjjobjli');
								}
							} else if (obj.match(/^https?:\/\/[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)/)) {
								jxbzdjxobj();
								pcjkzdyj();
								zdgbkjjjobj();
								jxzdqpobj();
								lkzdztobj();
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class*="error-layer"],[id*="error-layer"],[class*="preplay-background"],[id*="preplay-background"],[class*="vip_info"],[id*="vip_info"],[class*="vip_limit_box"],[id*="vip_limit_box"]');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('div[class^="u-app_"],div[class^="top_area"],.td-interactbox,.td-play__baseinfo,[class*="playbase"],[data-spm*="foot"],[data-js*="Down"],[class*="td-side-bar"] li:not([data-js-gotop*="gotop"])');
								cssobj('[class*="login"][class*="pop"],[id*="login"][id*="pop"]{z-index:2147483648!important}963540817');
							} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/(?:cover|page)|variety\/p\/topic)\//)) {
								if (!obj.match(/\/x\/page\//)) {
									zdymyypdobj();
									jxbzdjxobj();
									pcjkzdyj();
									jxzdqpobj();
									zdgbkjjjobj();
									zdgbdmobj();
									if (localStorage.getItem("vipzdjx") != '1') {
										zdvipvideotg();
									} else {} if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										cssobj('[data-role^="txp-"][data-role*="-error"],[class*="mod_vip_popup"],[id*="mod_vip_popup"]');
									} else {} if (localStorage.getItem("vipzdjx") == '1') {
										jxbvolumebobj();
									} else {}
								} else {
									jxqtwzhyobj();
									cssobj('[data-role^="txp-ui-closetoendrecommend-container"],[class^="txp_recommend_popup"],[data-role^="txp-ui-closetoendrecommend-list"],a[class="btn_collect _btn_follow"]');
								}
								lkzdztobj();
								cssobj('.quick_vip.quick_item>.quick_link,.video_score,._site_channel_more,.txp_popup_download,txpdiv.txp_shadow,.icon_vip_pic,.quick_tips_inner,.video_info_wrap,[_r-component="c-mood"],.tips_promotion,[_hot*="客户端"],[class*="txp_ad_link"],[class*="txp_ad_more"],[data-role*="ad"][data-role*="pause"],.txp_comment_hot,.mod_action .action_wrap,div[_r-component="c-cover-recommend"],.txp-watermark-action,txpdiv.txp-watermark,[class*="_bg_ad"],[id*="_bg_ad"],[class^="mod_ad "],[data-role="txp-ui-favorite"],#mask_layer,.site_footer,._player_helper.player_helper,#shortcut');
								cssobj('[class="player_side_hd"],[data-role^="txp-ui-title-mod"],[data-role^="txp-ui-screen-percent-wrap"],[data-role^="txp-ui-clock"],div[class="mod_row_box _movie_contact"],div[class="mod_row_box mod_row_loading"],.x_layer_card,.mod_row_box_casts.mod_row_box,div[class="mod_row_box"]:not([class*="forCommentsEntry"]):not([id*="forCommentsEntry"]),[_wind^="columnname="][_wind*="热区"],[_wind^="columnname="][_wind*="图片"],[_r-component="c-player-helper"],.mod_client_bubble.mod_quick_tips,div[_r-component="c-new-tv-preheat"],.container_short .txp_mod_barrage,.site_channel a:not([_stat*="电"]):not([_stat*="动"]):not([_stat*="综艺"]):not([_stat*="会员"]):not([_stat*="全部"])');
								cssobj('.player_headline{text-align:center;}.player_container .txp_mod_barrage{left:0!important;text-align:center;}div.mod_hanger{background-color:transparent!important;}div.site_container.container_main{background-color:#0f0f1e;}.wrapper_side .mod_title .title,div.figure_detail_row{color:#d8d4d3;}963540817');
								remove('div[_r-component="c-new-tv-preheat"],div.figure_video');
								if (obj.match(/\/variety\/p\/topic\//)) {
									cssobj('body::-webkit-scrollbar{width:0!important;height:0!important}div[class*="module"][_wind="columnname=播放器"]{top:2.5vh!important}div[data-index="3"][_wind="columnname=视频列表"]{top:50vh!important}div[class="mod_column"]{margin-top:-50px}html,body,div[class*="background"]{background-color:#2e2e36!important}div[class*="background"] div{background:none!important;height:auto!important}div[class^="main-container"]{height:auto!important}.jimu-module .module-video_list .btn_change{top:-25%}.jimu-module .module-video_list .figures_list li.list_item a,.jimu-module .module-video_list .figures_list li.list_item a:active,.jimu-module .module-video_list .figures_list li.list_item a:hover,.jimu-module .module-video_list .figures_list li.list_item a:visited{color:aliceblue!important}.jimu-module .module-video_list .btn_change .icon-a{top:75%}div[class="mod_text_tabs"]{visibility:hidden!important}[_wind^="columnname="]:not([_wind*="播放器"]):not([_wind*="列表"]):not([_wind*="往期"]),div[data-index][_wind="columnname=视频列表"]:not([data-index="3"]),.txp_btn_loop.txp_btn');
									(function() {
										try {
											let b = document.querySelectorAll('ul[class*="list"] a[href*="/x/"][target*="_blank"]');
											for (let i = 0, len = b.length; i < len; i++) {
												b[i].setAttribute('target', '_top')
											}
										} catch (err) {
											return false
										}
									})();
								} else {} if (localStorage.getItem("vipzdjx") != '1') {
									setTimeout(function() {
										if (localStorage.getItem("vipzdjx") == '0' || localStorage.getItem("vipzdjx") == '2') {
											(function() {
												let qqzdgbyla_counter = 0;
												let qqzdgbyla_jiankong = setInterval(function() {
													let qqzdgbyla_btn = document.querySelector('[aria-label*="音量"]');
													if (qqzdgbyla_btn) {
														try {
															if (document.querySelector('[data-status="mute"]')) {
																$(".txp_popup_volume").css("display", "block");
																document.querySelector('[data-status="mute"]').click();
																$(".txp_popup_volume").css("display", "none")
															} else {}
														} catch (err) {
															clearInterval(qqzdgbyla_jiankong);
															return false
														}
														clearInterval(qqzdgbyla_jiankong);
														return false
													}++qqzdgbyla_counter;
													if (qqzdgbyla_counter > 5) {
														clearInterval(qqzdgbyla_jiankong);
														return false
													}
												}, 500)
											})()
										} else {}
									}, 1234);
								} else {}
							} else if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\//)) {
								if (!obj.match(/^https?:\/\/www\.mgtv\.com\/act\//)) {
									mgzdgqobj();
									if (localStorage.getItem("vipzdjx") != '1') {
										zdvipvideotg();
									} else {} if (localStorage.getItem("vipzdjx") != '1') {
										jxbvolumeaobj();
									} else {}
									lkzdztobj();
								} else {
									jxqtwzobj();
									if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										cssobj('[class*="player"][class*="paytips"],[id*="player"][id*="paytips"]');
									} else {} if (localStorage.getItem("vipzdjx") == '1') {
										jxbvolumebobj();
									} else {}
									cssobj('html,body{background:none!important;background-color:#1b1b1b!important;}div.wp-main.wp.page-section{margin-top:calc(10vh);}a.u-post{width:auto!important;}div.screen-top,[class*="qrcode"],div.mitem-index.mitem,div[class="c-header-panel-mod"]:not([id="honey-header-user"])');
									(function() {
										$("body").on('mouseover', 'a[class*="listbox"][href*=".mgtv.com/"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
											let jxbzqxjobj = $(this), href = jxbzqxjobj.attr('href') || jxbzqxjobj.data("href");
											jxbzqxjobj.off('click.chrome');
											jxbzqxjobj.on('click.chrome', function() {
												window.location.href = href
											}).attr('data-href', href).css({
												cursor: 'pointer'
											}).removeAttr('href')
										})
									})();
								}
								cssobj('mango-control-status,.m-report-tipoff-dialog,[class*="footer"],[class*="mgad_"],[id*="mgad_"],ul.menu.clearfix a:not([href*="/show/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"]):not([href*="/vip/"]),[class*="rightnav"] ul li:not([mg-stat-mod*="history"]):not([class*="user"])');
								cssobj('div.mms-wrap,.control-right,[style*="top: 0px;left:0px;bottom:0px;right:0px"],[style*="top: 0px; left: 0px; bottom: 0px; right: 0px"],span[class$="bg"],.video-info.enable,.play-control .control-left .dos,.g-play .g-container-playcet .mod-wrap-side,.big-poster-conent,ul.honey-feedback-list li:not([class*="backtop"])');
								cssobj('.u-control-danmu-control.state-bottom{right:25%!important;text-align:center;}div.maomibtn li#mgzdgqli{display:block!important}div.login-main{z-index:2000000000!important;}963540817');
								if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\/b\//)) {
									jxbzdjxobj();
									pcjkzdyj();
									jxzdqpobj();
									zdgbkjjjobj();
									zdgbdmobj();
								} else {
									if (obj.match(/^https?:\/\/w(?:ww)?\.mgtv\.com\/s\//)) {
										zdgbdmobj();
										cssobj('div.maomibtn li#ckkjjjobjli');
									} else {} if (!obj.match(/^https?:\/\/www\.mgtv\.com\/act\//)) {
										jxqtwzhyobj();
										cssobj('div.maomibtn li#ckkjjjobjli');
									} else {}
								}
							} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/(?:[avw]_|kszt\/)/)) {
								if (iqiyibliwaiobj) {
									jxqtwzobj();
									jxbvolumeaobj();
									lkzdztobj();
									cssobj('div[class^="qy-header-login-pop-v"][class$=" selected"],[id*="_game"],[id*="_appDown"],[class^="player-mnb-left"],[class^="player-mnb-right"],aside[class="detail-sd"],ul[class="scroll-anchor"],div[data-player-hook^="shot-entrance"]');
								} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/w_/)) {
									jqjs();
									zdgbkjjjobj();
									zdymyypdobj();
									jxbzdjxobj();
									pcjkzdyj();
									jxzdqpobj();
									jxbvolumeaobj();
									lkzdztobj();
									if (localStorage.getItem("vipzdjx") != '1') {
										zdvipvideotg();
									} else {}
								} else if (iqiyialiwaiobj || iqiyibliwaiobj) {} else {
									jqjs();
									zdgbkjjjobj();
									zdgbdmobj();
									if (localStorage.getItem("vipzdjx") != '1') {
										zdvipvideotg();
									} else {} if (localStorage.getItem("vipzdjx") != '1') {
										jxbvolumeaobj();
									} else {}
									lkzdztobj();
									if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										cssobj('[class*="player"][class*="vip"][class*="popup"],[id*="player"][id*="vip"][id*="popup"]');
									} else {} if (localStorage.getItem("vipzdjx") == '1') {
										jxbvolumebobj();
									} else {} if (localStorage.getItem("vipzdjx") === "0") {} else {
										cssobj('div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"]){z-index:2000000000!important;}963540817');
									}
									cssobj('[data-player-hook*="top"],div#iProgress,div#userdata_el,#titleRow,[data-player-hook*="follow"],.vippay-btn-tip,[class*="-adv-under"],[id*="-adv-under"],[class^="100000"],[id^="100000"],[data-player-hook*="logo"],iqpdiv.iqp-logo-box,.pca-bg.qy-player-pca,div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id),div[style^="position:fixed"][style*="left:0"][style*="top:0"]:not([style*="visibility:visible"]):not(class):not(id)');
									cssobj('[id^="nav_renewBtn"],[data-player-hook="blankarea"],[rseat*="feedback"],.vip-btn .link-wrap,[data-player-hook*="scoretask"],[class*="footer"],[id="block-F"],[id="block-G"],[id="block-BD"],[id="block-JJ"],[class="qy-mod-wrap"][data-asyn-pb="true"],[id*="appDown"],[id*="game"],.qy-flash-func,[class*="-ai-"][data-player-hook],[class*="hot"][data-player-hook],div.nav-channel a:not([rseat*="dian"]):not([rseat*="zongyi"]):not([rseat*="dongman"]),li[class^="anchor-list"]:not([class="anchor-list"])');
									cssobj('[data-barrage*="BarrageVue"]{text-align:center;margin-left:25%!important;}.flash-box.videoWindow{top:0!important;left:0!important;position:relative!important;z-index:300!important;width:100%!important;height:100%!important}iqpdiv[class*="img"][data-player-hook="progress-imageWrapper"]{bottom:20px!important;}iqpdiv[data-player-hook="progress-line"],iqpdiv[data-player-hook="heatmap"],[data-player-hook="pca"]');
									remove('div[class^="qy-header-login-pop-"][class$="selected"]');
									if (obj.match(/^https?:\/\/www\.iqiyi\.com\/v_/)) {
										zdymyypdobj();
										jxbzdjxobj();
										pcjkzdyj();
										jxzdqpobj();
									} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/(?:a_|kszt\/)/)) {
										zdymyypdobj();
										jxqtwzobj();
										diyobj('<style>li#ymyypdobjli,[lequ-componenttitle*="正片"]~script~:not([lequ-componenttitle*="正片"]):not([lequ-componenttitle*="回顾"]):not([lequ-componenttitle*="独播"]),div[class^="videoBackGround"],div[class^="lequ-component lequ-comId"][data-block="PCW_lequ_code"][cpnm]>div.section0#section0,div[class*="weiboreyi-component"][data-block*="pinlun"],div[class^="banner"][class$="-outer"],div[id^="banner"][id$="-outer"],div.album-head-btn>a.qy-album-collect.J_collect_data,[class*="download"],[j-role*="scrollDiamondSign"],[class*="signin-btn"],#J-header-upload,#widget-playhistory-new,div.header-sideItem.header-vip,div.header-sideItem.header-download,div.header-sideItem.header-info,[class$=" cms-component-blank"][style="margin-bottom:0px;"]>*:not([class^="sec-"]):not([id^="sec-"]),[class*="sec-head-ad"],[class="relatedWork"],.slider-bar,[class*="djgm"],[class*="lhzz"],[class="sec-head show"] *:not([class*="title"]) img,[class="mod-footer-editor"],[class^="dhome"],[class="heat-info"],[class="episodePlot"][data-series-ele="juqing"],[id="widget-albumQiyu"],[class="albumRanklist"],[class="rank-num rank-active fl"],[data-tab-type="albumcomment"],[class="intro-effect clearfix"],[class="albumFocus-container"],[class^="top-"]>img[src*=".iqiyipic.com/common/20"][alt=""][class],li[class^="nav-L nav-"][data-nav-to^="#section"]:not([data-nav-to="#section1"]),[class="_mask_"],[class="vote-banner-box"],[class^="section"][class*=" section"],[class="nav-L nav-L2 nav_D"],div[class^="section2"],div[class^="section3"],div[class^="section4"],div[class^="section5"],div[class^="section6"],div[class^="section7"],div[class^="section8"],div[class^="section9"],[class^="footer"],div[class^="cms-component com-"][com-type="default"][style="margin-bottom:0px;"],div[class^="section"][id^="section-"]>img,.cms-wrapper>.layout-1020.cms-layout>.cms-row>.col-12.cms-block>.cms-component>.sec-head{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}::-webkit-scrollbar{width:0!important;height:0!important}.cms-wrapper{background:none!important;background-color:black!important}[style^="display:block;float:right"],[style^="display: block; float: right"],.lequ-component-box>[class^="lequ-component lequ-comId"][class*=" com-"] [class^="show"]{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important}html,.lequ-component-box{background-color:#232325!important}.lequ-content{text-align:center;margin-left:25%}.lequ-header{margin-left:-25%!important}</style>');
									}(function() {
										try {
											let aElement = document.querySelectorAll('div[class*="list"] a[href*="/v_"][href*=".html"][target="_blank"]');
											for (let i = 0; i < aElement.length; i++) {
												aElement[i].getAttributeNode('target').value = "_top"
											}
										} catch (err) {
											return false
										}
									})();
								};
							} else if (obj.match(/^https?:\/\/tw\.iqiyi\.com\/v_/)) {
								jqjs();
								jxqtwzobj();
								if (localStorage.getItem("vipzdjx") != '1') {
									jxbvolumeaobj();
								} else {}
								lkzdztobj();
								cssobj('.main-content{padding-bottom:inherit;}[class*="vip-side-wrap"],[id*="vip-side-wrap"],.tw-play-con,.tw-play-side,.tw-play-tag,.tw-play-num,.tw-play-intro,.collect');
							} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
								jxbzdjxobj();
								pcjkzdyj();
								jxzdqpobj();
								zdgbkjjjobj();
								zdgbdmobj();
								if (localStorage.getItem("vipzdjx") != '1') {
									zdvipvideotg();
								} else {} if (localStorage.getItem("vipzdjx") != '1') {
									jxbvolumeaobj();
								} else {}
								lkzdztobj();
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class*="player"][class*="vipTips"],[id*="player"][id*="vipTips"]');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('a[target*="_blank"][pb-click]:not([title]):not([data-title]),[class^="x-"][class*="hot"][class$="-btn"],[class^="x-clock"],[class^="x-webg"],[class^="x-pugc-title"],[class^="x-gradient-top"],[class^="x-info-panel"],#newplayNavCrumbs,.seeBox,div#content,.x_poster_card,.side-set,div.mod-column-main.l,[class*="share"],[id*="share"],div[class^="vBox vBox-"]');
								cssobj('[class*="foot"],[id*="foot"],[data-pb-txid*="qianfan"],[class*="zhibo"],#tvphb,span.btn-tips,a[class*="-adv-"][target*="_blank"],a[id*="-adv-"][target*="_blank"],.ad,.adv,#ad,#adv,.x-hdr-btn,.x-fox-btn,#leftBar,div.side-set div,div.side-set a:not([class*="top"]),div#navLocker div:not([class*="history"]):not([class*="upload"]):not([class*="user"]):not([class*="login"])');
								cssobj('html{background-color:#313136;}div.mod-column-side.r,div.right{width:inherit!important;}div#toolBar{text-align:center;width:calc(100vw/2)!important;}div[class^="globallogin"]{z-index:2000000000!important;}#player{z-index:999999999!important;}963540817');
								remove('iframe[src*="//tv.sohu."][width="0"][height="0"]');
							} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
								jxbzdjxobj();
								pcjkzdyj();
								jxzdqpobj();
								zdgbkjjjobj();
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class*="play-end-pop],[id*="play-end-pop],[class*="player-bg"],[id*="player-bg"],[class*="play-end-overlay"],[id*="play-end-overlay"]');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('#宁小影{position:relative!important;}div[class^="globallogin"]{z-index:2000000000!important;}[class^="pop-operates"],[id^="pop-operates"]');
								cssobj('#go-top,.visible.J_vip_buttons_info.movie-info-vip-wrap,i.nav-new,a[href*="film.sohu.com/vip.html"],a[href*="film.sohu.com/vipAct.html"],div.player-content-bg,div.top_template,div.tm-wel1,.x-info-panel,.x-gradient-top,.x-hdr-btn,.x-fox-btn,div.content_main_hasrank,div.bg_main,.footer');
							} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
								jxbzdjxobj();
								pcjkzdyj();
								jxzdqpobj();
								zdgbkjjjobj();
								zdgbdmobj();
								if (localStorage.getItem("vipzdjx") != '1') {
									zdvipvideotg();
								} else {} if (localStorage.getItem("vipzdjx") != '1') {
									jxbvolumeaobj();
								} else {}
								lkzdztobj();
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class*="play"][class*="box"][class*="vipTip"],[id*="play"][id*="box"][id*="vipTip"]');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('[style^="position:"][style*="hidden"],.hv_topbar,.vipTabBanner,[data-statectn*="right"],.hv_buy,.tj_title,#j-hotguess,div.rank_box,.Foot,.user_bar .user_vip,.player-content-bg,.pop-operates,.QR_code,[class^="Banner_"],[id^="Banner_"],[class^="JS_banner_"],[id^="JS_banner_"],[id^="JS_banner_"]+div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body,[id^="JS_banner_"]+div.column_title~div.column_title,[id^="JS_banner_"]+div.column_title+div.column_body~div.column_body');
								cssobj('div#LEPass_LOGIN_IFRAME{z-index:2000000000!important;}963540817');
								remove('.rightFix_tool,iframe[onload*="union"],[style^="position:"][style*="hidden"],[class="x-screenshot-btn"]');
								remove('[style^="position:"][style*="hidden"]');
							} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
								jxbzdjxobj();
								pcjkzdyj();
								jxzdqpobj();
								zdgbkjjjobj();
								zdgbdmobj();
								if (localStorage.getItem("vipzdjx") != '1') {
									zdvipvideotg();
								} else {} if (localStorage.getItem("vipzdjx") != '1') {
									jxbvolumeaobj();
								} else {}
								lkzdztobj();
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class*="tryOver"],[id*="tryOver"]{opacity:0;}[class*="tryOver"]>iframe,[id*="tryOver"]>iframe');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('a#update_btn,.button-box .right,img[class^="roll-"],img[id^="roll-"],a[tj_id],[class^="module-video"][class$="newupload"],[class*="copyright"],[class*="banneradv"],#video-maincont,[id*="game"],[class*="side-adv"],[class^="afp-"],[id^="afp-"],[class^="afp_"],[id^="afp_"]');
								cssobj('.buy_vod.down.login-a-tryover,.focusPeople,div#wxPop,[tj_id^="sb_"],[class*="download"],[class^="module-video"][class$="-ops cf"],div.sus-cont a,div.sus-cont li:not([class*="top"]),div.hot.cf a:not([href*="tv.pptv."]):not([href*="movie.pptv."]):not([href*="zongyi.pptv."]):not([href*="cartoon.pptv."])');
								cssobj('div[class^="layer loginlayer"]{z-index:2000000000!important;}');
							} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
								jxbzdjxobj();
								pcjkzdyj();
								jxzdqpobj();
								zdgbkjjjobj();
								remove('iframe[src]');
								remove('iframe[data-sharesrc]');
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									cssobj('[class^="sc-content clearfix"],[id^="sc-content clearfix"]');
								} else {} if (localStorage.getItem("vipzdjx") == '1') {
									jxbvolumebobj();
								} else {}
								cssobj('div[class="qrcode_r fl"],div.player-widget,ul.ecope_emailsuggest,iframe#bubbleMsg,.pay-mod-notlogin,.playerBox-info-rightPart,#zhichiBtnBox,[class^="fl popBox ele_uc ticket hidden"],figure,footer,#sideBar_help_webSite,[class*="-adver"],[id*="-adver"]');
								cssobj('div[class^="common-popup"]{z-index:2000000000!important;}');
							} else if (obj.match(/^https?:\/\/(?:www|player|live)\.bilibili\.com\//)) {
								if (!obj.match(/\/activity/)) {
									lkzdztobj();
									h5zdbfobj();
									cssobj('div.unlogin-popover-avatar.unlogin-popover,div[class="lt-row"],[class*="-player-video-btn-jump"][class$="-player-video-btn-bilibili-logo"],[class*="-suspension-bar"],[class*="qrcode"],[class^="flip-view p-relative over-hidden"],[class*="player-video-top"],div#heimu,.bilibili-player-video-top.bilibili-player-video-top-pgc,[class*="-app-download"],.expand-more,#toolbar_module,div.clearfix.recom-item:nth-child(n+10),li.nav-link-item a[href*="/app.bilibili.com"],li.nav-link-item a[href*="/game.bilibili.com"]');
									if (!obj.match(/^https?:\/\/live\.bilibili\.com\//)) {
										zdgbdmobj();
									} else {} if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
										zdgbkjjjobj();
										jxbzdjxobj();
										pcjkzdyj();
										jxzdqpobj();
										if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
											cssobj('[class^="player_mask"],[id^="player_mask"]');
										} else {} if (localStorage.getItem("vipzdjx") == '1') {
											jxbvolumebobj();
										} else {}
									} else {
										jxqtwzhyobj();
										cssobj('div.maomibtn li#ckkjjjobjli');
									}
								} else {}
							} else if (obj.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
								zdgbdmobj();
								lkzdztobj();
								h5zdbfobj();
								jxbvolumeaobj();
								if (obj.match(/\/bangumi\//)) {
									zdgbkjjjobj();
									jxbzdjxobj();
									pcjkzdyj();
								} else {
									jxqtwzhyobj();
									cssobj('div.maomibtn li#ckkjjjobjli');
								}
							} else if (obj.match(/^https?:\/\/haokan\.(?:baidu|hao123)\.com\/v/)) {
								jxbmmanzxobj();
								jxqtwzhyobj();
								lkzdztobj();
								cssobj('div.maomibtn li#ckkjjjobjli,li.land-item:nth-child(n+10),[class*="ownload"],[id*="ownload"],div[class="videoinfo-text clearfix"]>div,div[class="videoinfo-text clearfix"]>span:not([class*="left"])');
							} else if (obj.match(/^https?:\/\/tieba\.baidu\.com\/p\//)) {
								if (document.querySelector("video")) {
									jxqtwzhyobj();
									lkzdztobj();
									cssobj('div.maomibtn li#ckkjjjobjli');
								} else {}
							} else if (obj.match(/^https?:\/\/movie\.douban\.com\/subject\//)) {
								(function() {
									try {
										let myScriptStyle = document.createElement("style");
										myScriptStyle.innerHTML = '[id*="download"],#footer{display:none!important;}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{text-decoration:line-through;color:#000}.c-aside-body a.available{background-color:#5ccccc;color:#006363;border-radius:10px;font-weight:bold;}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}';
										document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
										let aside_html = '<div class=c-aside > <h2><i class=""></i> · · · · · · </h2> <div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';
										if (!document.getElementById("seBwhA") && document.title.indexOf('豆瓣') !== -1) {
											var seBwhA = document.createElement("a");
											seBwhA.id = "seBwhA";
											document.getElementsByTagName("html")[0].appendChild(seBwhA);
											$(document).ready(function() {
												let parseURL = function(url) {
													return {}
												};
												var site_online, site_sub, update_site_offline_sites;
												site_online = $(aside_html);
												update_site_online_sites = function(title, en) {
													var i, l, link, link_parsed, n, name, site_online_sites;
													title = encodeURI(title);
													site_online_sites = {
														'布米米': 'http://www.bumimi99.com/search/' + title,
														'麻花影视': 'https://www.jiaomh.com/search.php?searchword=' + title,
														'茶杯狐': 'https://www.cupfox.com/search?key=' + title
													};
													for (name in site_online_sites) {
														link = site_online_sites[name];
														link_parsed = parseURL(link);
														link = $('<a></a>').attr('href', link);
														link.attr('data-host', link_parsed.host);
														link.attr('target', '_blank').attr('rel', 'nofollow');
														link.addClass('available');
														link.html(name);
														$('#content div.site-online-body ul').append(link)
													}
												};
												site_online.addClass('site_online');
												site_online.find('div.c-aside-body').addClass('site-online-body');
												site_online.find('h2 i').text('搜索播放');
												$('#content div.tags').before(site_online);
												var title, title_en, title_sec;
												title = title_sec = $('#content>h1>span')[0].textContent.split(' ');
												title = title.shift();
												title_sec = title_sec.join(' ').trim();
												title_en = '';
												update_site_online_sites(title)
											})
										}
									} catch (err) {}
								})();
								(function() {
									try {
										let pcjxbdbobj = document.querySelector("#content>h1");
										pcjxbdbobj.innerHTML = '<a href="https://z1.m1907.cn/?jx=' + pcjxbdbobj.innerText.replace(/^\s*?(.+?第[^部季][部季]).*$/, "$1").replace(/^\s*?(?!.+?第[^部季][部季])(.+?)(?:\s+?(?:第)?.*)?$/, "$1") + '" onclick="window.open(this.href,\'bkmk_popup\',\'esizable=1,scrollbars=1,toolbar=0,status=0,width=1100,height=600,allowfullscreen=allowfullscreen,left=\'+(screen.availWidth-1100)/2+\',top=\'+(screen.availHeight-600)/2);return false" title="解析观看--' + pcjxbdbobj.innerText.replace(/^\s*?(.+?)\(.+?\).*$/, "$1") + '--资源">' + pcjxbdbobj.innerText.replace(/^\s*?(.+?)\(.+?\).*$/, "$1") + '</a><span class="year">' + pcjxbdbobj.innerText.replace(/^\s*?.+?(\(.+?\)).*$/, "$1") + '</span>';
									} catch (err) {
										return false;
									}
								})();
							} else if (obj.match(/^https?:\/\/(?:www\.bumimi.+?\/search\/|[^\/]+?\/(?:tv|acg|mov)\/)/)) {
								function bmmsc() {
									try {
										const bmmtxt = document.querySelectorAll('li');
										for (let bmmtxti = 0; bmmtxti < bmmtxt.length; bmmtxti++) {
											const bmmtxtmsa = bmmtxt[bmmtxti].querySelectorAll('a');
											for (let bmmtxtia = 0; bmmtxtia < bmmtxtmsa.length; bmmtxtia++) {
												if (bmmtxtmsa[bmmtxtia].innerText.match(/^\s*?废\s*?$/gm)) {
													bmmtxt[bmmtxti].remove();
												}
											};
										};
									} catch (err) {}
								};
								if (obj.match(/^https?:\/\/www\.bumimi.+?\/search\//)) {
									pdssgjcobj = 'ul#result>li>a';
									apddjobj();
									setTimeout(function() {
										if (pdssgjcobj.length == 1) {} else {
											try {
												GM_setValue('集数', '选集');
												bmmsc();
											} catch (err) {}
										}
										try {
											if (document.querySelector("#result").innerText.match(/抱歉\s*?[,，]\s*?未找到相关视频/)) {
												window.location.href = window.location.href.replace(/^.+?\/search\/(.*)$/, "https://www.jiaomh.com/search.php?searchword=$1");
											} else {}
										} catch (err) {}
									}, 1234);
								} else if (obj.match(/^https?:\/\/[^\/]+?\/(?:tv|acg)\/\d+?\/$/)) {
									setTimeout(function() {
										try {
											if (GM_getValue('集数').match(/^\s*?\d+?\s*?$/) && !GM_getValue('集数').match(/^\s*?选集\s*?$/)) {
												window.location.href = document.querySelector('ul:first-child>li>a[href$=".html"]:not([style])').href.replace(/^(http.+?\/\d+?\/)\d+?(\.html).*$/, "$1" + GM_getValue('集数') + "$2");
												GM_setValue('集数', '选集');
											} else {
												GM_setValue('集数', '选集');
											}
										} catch (err) {}
									}, 1234);
								} else if (obj.match(/^https?:\/\/[^\/]+?\/mov\/\d+?\/$/)) {
									setTimeout(function() {
										try {
											let bmmmov = document.querySelector('ul:first-child>li>a[href$=".html"]:not([style])');
											(bmmmov.innerText.match(/^\s*?正片\s*?\s*?/)) && (window.location.href = bmmmov.href);
										} catch (err) {}
									}, 1234);
								} else if (obj.match(/^https?:\/\/[^\/]+?\/(?:tv|acg|mov)\/$/)) {
									bmmsc();
								} else if (obj.match(/^https?:\/\/[^\/]+?\/(?:tv|acg|mov)\/\d+?\/\d+?\.html/)) {
									jszdqc();
									setTimeout(function() {
										if (document.querySelector('[class$=" clearfix"] a[href$=".html"]:not([style])') != null) {} else {
											try {
												GM_setValue('集数', '选集');
											} catch (err) {}
											alert('当前集数还没更新，请自行更换 接口');
											window.close();
										}
									}, 2345);
								} else {}
							} else if (obj.match(/^https?:\/\/www\.jiaomh\.com\/(?:kmahua\/|search\.php\?searchword=)/)) {
								setTimeout(() => {
									if (obj.match(/\/search\.php\?searchword=/)) {
										try {
											if ($('ul[class="fed-list-info fed-part-rows"]>li').length == 1) {
												window.location.href = document.querySelector('ul[class="fed-list-info fed-part-rows"]>li>a[href]:first-child').href;
											} else {}
										} catch (err) {}
										try {
											if (document.querySelector('ul[class="fed-list-info fed-part-rows"]').innerText.match(/对不起\s*?[,，]\s*?没有找到任何记录/)) {
												window.location.href = location.href.replace(/^.+?\/search\.php\?searchword=(.*)$/, "http://www.wbdy.tv/index.php?m=vod-search&wd=$1");
											} else {}
										} catch (err) {}
									} else {
										try {
											if ($('ul[class="fed-list-head fed-part-rows fed-padding"]').length == 2) {
												if ($('ul[class="fed-list-head fed-part-rows fed-padding"]>li:first-child').length == 2) {
													if ($('div[class="fed-tabs-boxs"] ul[class^="stui-content"][class*="playlist"][class$="clearfix"]>li').length == 1) {
														if ($('div[class="fed-tabs-boxs"] ul[class^="stui-content"][class*="playlist"][class$="clearfix"]>li>a[href]').length == 1) {
															window.location.href = document.querySelector('div[class="fed-tabs-boxs"] ul[class^="stui-content"][class*="playlist"][class$="clearfix"]>li>a[href]:first-child').href;
														} else {}
													} else {}
												} else {}
											} else {}
										} catch (err) {}
									}
								}, 1234);
							} else if (obj.match(/^https?:\/\/pgso\.cnjsjf\.com\/?/)) {
								if (obj.match(/\/\?s\//)) {
									setTimeout(function() {
										if (document.querySelectorAll('ul[class="stui-vodlist clearfix"]>li>a[href*="/?"]').length == 1) {
											try {
												if (GM_getValue('集数').match(/^\s*?\d+?\s*?$/) && !GM_getValue('集数').match(/^\s*?选集\s*?$/)) {
													window.location.href = document.querySelector('ul[class="stui-vodlist clearfix"]>li>a[href*="/?"]').href.replace(/^(http.+?\/\?p\/\d+?)(?:-\d+?)?(\.html).*/, "$1-" + GM_getValue('集数') + "$2");
													GM_setValue('集数', '选集');
												} else {
													window.location.href = document.querySelector('ul[class="stui-vodlist clearfix"]>li>a[href*="/?"]').href;
												}
											} catch (err) {}
										} else if (document.querySelectorAll('ul[class="stui-vodlist clearfix"]>li>a[href*="/?"]').length == 0) {
											window.location.href = window.location.href.replace(/^.+?\/\?s\/([^\.]+?)\.html.*$/, "http://www.bumimi99.com/search/$1");
										} else {
											try {
												GM_setValue('集数', '选集');
											} catch (err) {}
										}
									}, 678);
								} else if (obj.match(/\/\?p\//)) {
									jxqtwzobj();
									jxzdqpobj();
									zdbt();
									cssobj('div.maomibtn li#ckkjjjobjli,div.maomibtn a.maomi+ul>li:not([style]):not([id])');
									setTimeout(function() {
										try {
											GM_setValue('集数', '选集');
										} catch (err) {}
										try {
											if (document.querySelector('iframe[id="bofang"][src^="http"][src*="=http"]')) {
												try {
													if (localStorage.getItem("jxzdqp") == '1') {
														pcspzdqpobj = setInterval(function() {
															if (document.querySelector('iframe[id="bofang"][src^="http"][src*="=http"]')) {
																qpobj(document.querySelector('iframe[id="bofang"][src^="http"][src*="=http"]'));
																clearInterval(pcspzdqpobj);
															} else {}
														}, 1234);
													} else {}
												} catch (err) {}
											} else {
												alert('当前集数还没更新，请自行更换 接口');
												window.close();
											}
										} catch (err) {}
									}, 1234);
								}
							} else if (obj.match(/^https?:\/\/www\.yinyuetai\.com\/play\?id=/)) {
								jxqtwzhyobj();
								lkzdztobj();
								h5zdbfobj();
							} else if (jxjkobj && !objj.match(/ikukk/)) {
								function titleobj(titlebt) {
									if (document.title.match(/(?:出现.*?错误|没有.*?输入)/) != null) {} else {
										let titleTime;
										document.title = titlebt;
										document.addEventListener('visibilitychange', function() {
											let videoaobj = document.querySelector("video");
											if (document.hidden) {
												if (videoaobj) {
													videoaobj.pause();
												} else {}
												document.title = '≥△≤ 已自动隐藏 ≥△≤';
												clearTimeout(titleTime);
											} else {
												if (videoaobj) {
													videoaobj.play();
												} else {}
												document.title = '欢迎回来继续看视频';
												titleTime = setTimeout(function() {
													document.title = titlebt
												}, 2345);
											}
										})
									}
								};
								if (obj.match(/^https?:\/\/zy\.aoxtv\.com\//)) {
									cssobj('body{background-color:black!important;}963540817');
								} else {} if (document.title.match(/(?:出现.*?错误|没有.*?输入)/) != null) {} else {
									if (objjj.match(/\.youku\./)) {
										titleobj('优酷视频解析中');
									} else if (objjj.match(/\.mgtv\./)) {
										titleobj('芒果视频解析中');
									} else if (objjj.match(/\.sohu\./)) {
										titleobj('搜狐视频解析中');
									} else if (objjj.match(/\.pptv\./)) {
										titleobj('PPTV视频解析中');
									} else if (objjj.match(/\.1905\./)) {
										titleobj('1905视频解析中');
									} else if (objjj.match(/\.iqiyi\./)) {
										titleobj('爱奇艺视频解析中');
									} else if (objjj.match(/\.le\./)) {
										titleobj('乐视视频解析中');
									} else if (objjj.match(/\.qq\./)) {
										titleobj('腾讯视频解析中');
									} else if (objjj.match(/\.bilibili\./)) {
										titleobj('B站视频解析中');
									} else if (objjj.match(/\.acfun\./)) {
										titleobj('A站视频解析中');
									} else {}
								}
							} else {
								jxbmmanzxobj();
							}
						} else {
							document.body.appendChild(document.createElement("宁小影手机网页"));
							var sjpdpthyobj;
							cssobj('ul#httpsvipul>li>span>a1,ul#httpsvipul>li>span>a3');
							function sjmmss() {
								cssobj('ul#jxbewjul span#sjzdwss');
							};
							(function() {
								try {
									let zdjkhttpsjk_counter = 0;
									let zdjkhttpsjk_jiankong = setInterval(function() {
										let zdjkhttpsjk_btn = document.querySelector("ul#httpsvipul>li:last-of-type");
										if (zdjkhttpsjk_btn) {
											try {
												$('ul#httpsvipul>li').click(function() {
													try {
														document.getElementById('jjxxkka').style.display = 'none';
													} catch (err) {}
													if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
														try {
															let httpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
															if (obj.match(/^https?:\/\/m\.acfun\.cn\/v\//)) {
																if (document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																	localStorage.setItem("httpsjk", httpsjksz)
																} else {}
															} else {
																if (!document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																	localStorage.setItem("httpsjk", httpsjksz);
																} else {}
															}
														} catch (err) {}
													}
												})
											} catch (err) {
												return false
											}
											clearInterval(zdjkhttpsjk_jiankong);
											return false
										}++zdjkhttpsjk_counter;
										if (zdjkhttpsjk_counter > 50) {
											clearInterval(zdjkhttpsjk_jiankong);
											return false
										}
									}, 500)
								} catch (err) {}
							})();
							if (obj.match(/^https?:\/\/m\.youku\.com\/.+?\/id_/)) {
								function sjykjxbzqobj() {
									cssobj('div.x-top-control,.showMore,.brief-more,[sourcetype],[class^="brief-reserve"],[class^="h5-detail-feed"],div.uplader,#ykPlayer,.Push-container,.Corner-container,.h5-detail-ad,.h5-detail-guide.clipboard,.h5-detail-recommend,#comment-frame,.yk-footer,.brief-btm,#YKComment');
									if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										zdztsp();
									} else {}
								}; if (!obj.match(/\/id_[a-zA-Z0-9]{12,18}(?:=?=?(?:$|\.html|[^a-zA-Z0-9]))/)) {
									(function() {
										try {
											let host = document.domain;
											let ystr = location.href;
											let pos = ystr.indexOf('?');
											if (pos > -1) {
												ystr = ystr.substring(0, pos)
											}
											ystr = ystr.replace("/alipay_video/", "/video/");
											if (host.indexOf('youku.com') > -1 && ystr.indexOf(".html") > -1 && ystr.length > 53 && ystr.indexOf("=") == -1) {
												let xm = document.querySelector("DIV.anthologyStageStyle0.stageActive");
												if (xm) {
													xm.click()
												}
												xm = document.querySelector("DIV.stageStyle1ImgContainer");
												if (xm) {
													xm.click()
												}
											}
										} catch (err) {
											return false
										}
									})();
								} else {
									jqjs();
									jxbzdjxhyobj();
									sjykjxbzqobj()
								}
							} else if (obj.match(/^https?:\/\/m\.mgtv\.com\/b\//)) {
								jqjs();
								jxbzdjxobj();
								sjpdpthyobj = 1;
								cssobj('html{background:#2a282b;}[class="mg-subtitle auto-hide"],.vip-no-try .new-user,.v5-area-details .m-details,div.m-vip-list,div.mg-app-swip,.mgui-btn-nowelt.mgui-btn,.clearfix.bd,[class^="mgui-card"]:not([class*="xuanji"]),.m-vip-list+div,.video-about.mg-stat,div#comment-id,[class*="footer"],.more,div#nav-bar a:not([href*="/show/"]):not([href*="/vip/"]):not([href*="/tv/"]):not([href*="/movie/"]):not([href*="/cartoon/"])');
								if (localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/m\.pptv\.com\/show\//)) {
								jqjs();
								jxbzdjxobj();
								sjpdpthyobj = 1;
								cssobj('.pp-details-infos,.pp-details-infos .mod_bd{min-height:auto;}963540817');
								cssobj('#pp-details-titbits,#pp-details-lookAgain,#pp-details-relevant,#pp-details-guessLike,a.about,.mod_subtitle,.video_func,.layout-list.layout,.layout-discuss.layout,.openapp-bg.player-info,#pgotop,.trivia-wrap.trivia,.plist-w.plist6.plist,.comment-container,.m_copyright,.footbanner,.hide.vod-intor.player-info,.download,.star-page-enter');
								if (localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
								jqjs();
								jxbzdjxhyobj();
								remove('iframe[src]');
								remove('iframe[data-sharesrc]');
								cssobj('a#pay_href,section.actorModule.adContainer,section#exclusive_movie,section.app_search,section#fix_member,section#hot_movie,section#hot_telve,div#SOHUCS,.openApp,#app_store,.wakeAppBtn.fl,.openMembershipBtn,.downLoadBtn.commonPic,.open-app,.no-marg.f_song,.ad,.iconList');
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)/)) {
								if (!obj.match(/^https?:\/\/m\.tv\.sohu\.com\/u\//)) {
									jqjs();
									jxbzdjxhyobj();
									if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										jxbvolumebobj();
									} else {}
								} else {
									cssobj('.main-rec-view-box.main-view-box.app-view-box,.app-commentJS-box.app-vbox,.t_titlearrowup,.btn-xz-app');
								}
								if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/v/)) {
									cssobj('[class^="x-download-"],.app-vbox-head a.extra,.app-vbox.app-star-vbox,.winbox-mask.__mask,.G-browser,.js-app-topbanner.actv-banner,.btn-xz-app,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.main-rec-view-box.main-view-box.app-view-box,#CommentTarget,footer,.twinfo_iconwrap,.t_titlearrowup,.js-btn-newhy.btn-new-hy');
								} else if (obj.match(/^https?:\/\/m\.tv\.sohu\.com\/phone_play_film\?aid=/)) {
									cssobj('.player_film_bg,.p_f_pannel,.btn-xz-app,.twinfo_iconwrap,#film_top_banner,.ph-vbox.app-vbox,.app-guess-vbox.app-vbox,.foot.sohu-swiper,#CommentTarget,footer,.player_film_cover,.t_titlearrowup');
								}
							} else if (obj.match(/^https?:\/\/m\.le\.com\/vplay_/)) {
								jqjs();
								jxbzdjxhyobj();
								cssobj('[class^="j-Banner"],[id^="j-Banner"],#j-leappMore,#j-zhoubian,#j-spoiler,#j-recommend,.leapp_btn,#j-toolbar>.animate1.column_box,.gamePromotionTxt,section#j-recommend,#j-comment,section.search_top,.footer,.intro_cnt dd,.up-letv');
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/m\.iqiyi\.com\/v_/)) {
								if (iqiyicliwaiobj) {
									cssobj('div[id="jxbhttps"]');
								} else {
									jqjs();
									jxbzdjxhyobj();
								}
								cssobj('[class^="m-iqyGuide-"],[id^="m-iqyGuide-"],[class*="paopao"],[id*="paopao"],div[__dfp][style^="visibility:"],div[class^="m-iqyGuide-layer"],section>a:first-child[href^="javascript:"]+a[href^="javascript:"],[name="m-vipWatch"]+div[class="m-box"],.m-title-anthology.m-title>.c-des,.m-linkMore,.m-hotSpot-update,.m-dom-loading-gray,[name="m-paopao"],[name="m-videoRec"]+div[class="m-box"],section.m-videoPlay-toolBar,.vue-portal-target,.m-iqylink-guide,.videoInfoFold-data,#openDesc,#comment,.page-c-items,.m-pp-entrance,.m-videoUser-spacing,[name="m-aroundVideo"],[name="m-videoRec"]');
								cssobj('section.m-hotWords-bottom,section.m-loading-info,[name="m-extendBar"]+div+div[class="m-box"],section.m-recommend-player,section.m-recommend-player+div[class="m-box-items m-box-items-full"],[name="m-extendBar"],.m-video-player .playCount-time,section.sourceHandle,div[is-call-app="true"]~div[class="m-box"],[class*="-banner"],[name="m-movieRec"],[name="m-movieHot"],[name="m-vipWatch"],[name="m-vipRights"],.video-data,.m-video-extendBar,.m-ipRelation-spacing.m-ipRelation-home.m-ipRelation');
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com/)) {
								if (!obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)/)) {
									function sjqqxckdkobj() {
										(function() {
											try {
												if (!document.querySelector("jxbsjqq")) {
													document.body.appendChild(document.createElement("jxbsjqq"));
													try {
														const observer = new MutationObserver(function() {
															const sjqqaljobj = sjqqgbdkfsobj();
															if (sjqqaljobj) {
																observer.disconnect()
															}
														});
														observer.observe(document.body, {
															childList: true,
															subtree: true
														});
														function sjqqgbdkfsobj() {
															try {
																if (document.querySelector('a[href*="/x/"]:not([target="_blank"])')) {
																	for (let i = 0, len = document.querySelectorAll('a[href*="/x/"]').length; i < len; i++) {
																		document.querySelectorAll('a[href*="/x/"]')[i].setAttribute('target', '_blank')
																	}
																} else {}
															} catch (err) {}
														}
													} catch (err) {}
												} else {}
											} catch (err) {}
										})();
									};
									sjqqxckdkobj();
									setTimeout(sjqqxckdkobj, 234);
									setTimeout(sjqqxckdkobj, 666);
									setTimeout(sjqqxckdkobj, 1234);
								} else {
									jqjs();
									jxbzdjxhyobj();
									cssobj('[dt-params*="推荐"],[dt-params*="会员特权"],[open-app]:not(li),.video_function.video_function_new,.mod_source,.U_color_b.video_types_new.video_types,.mod_promotion,.mod_recommend.mod_box,.mod_clips.mod_box,.mod_comment.mod_box,.mod_multi_figures_h.mod_sideslip_h.mod_box,.mod_game_rec.mod_box');
									if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
										jxbvolumebobj();
									} else {}
								}
							} else if (obj.match(/^https?:\/\/m\.bilibili\.com\/bangumi\/play\//)) {
								jqjs();
								jxbzdjxhyobj();
								cssobj('div.recom-wrapper,div[class*="footer"],[class^="bili-app"],[class^="open-app"]');
								if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
									jxbvolumebobj();
								} else {}
							} else if (obj.match(/^https?:\/\/m\.acfun\.cn\/v\//)) {
								jqjs();
								jxbzdjxhyobj();
								cssobj('div[id="mPlayer"]>img[class*="-bg-"]+div[class="acmplayer-wrapper"]~div[class="acmplayer-wrapper"],div[class^="js-"][class*="-fixed"],div[id^="js-"][id*="-fixed"],div[data-impr-config],div[class^="recommend"],div[id^="recommend"],div[class^="side-lights-"],div[class^="recommend-bangumi-"],div[class^="more-main-comment flex-"],div[class^="header-ico"],div[class="content"][id="recommend"],div[style^="visibility:"][style*="visible"]:not([class*="ist"]):not([id*="ist"]),span#vipzdjxhy');
							} else if (obj.match(/^https?:\/\/m\.douban\.com\/movie\/subject\//)) {
								cssobj('div#subject-header-container{margin-top:50px!important;}div[class="sub-original-title"],section[class="subject-mark mark-movie"],a[class="write-comment"],a[class="write-review"],div.TalionNav-static,[class*="-banner"],.sub-vendor,.show-all,.score-write,section+div.center');
								(function() {
									try {
										let sjjxbaobj = document.querySelector("#subject-header-container>div.sub-info div.sub-title"), sjjxbbobj = document.querySelector("#subject-header-container>div.sub-info div.sub-original-title");
										sjjxbaobj.innerHTML = '<a href="https://z1.m1907.cn/?jx=' + sjjxbaobj.innerText.replace(/^\s*?(.+?第[^部季][部季]).*$/, "$1").replace(/^\s*?(?!.+?第[^部季][部季])(.+?)(?:\s+?(?:第)?.*)?$/, "$1") + '" onclick="window.open(this.href,\'bkmk_popup\');return false">' + sjjxbbobj.innerText.replace(/^\s*?(.+?)\(.+?\).*$/, "$1") + '</a>';
									} catch (err) {
										return false;
									}
								})();
							} else {
								jxbmmanzxobj();
							}
						}
						function jxbmmanzxobj() {
							if (objj.match(/(?:ximalaya|1ting|music)\./) && !objj.match(/music\.163\./)) {
								var jxbyyxzaobj = 'http://music.yujianweb.cn/?id=',
									jxbyyxzbobj = 'https://music.eofelis.com/?id=';
							} else if (!obj.match(/^https?:\/\/y\.music\.163\.com\/m\/song\?id=/) && !jxbpcobj) {
								cssobj('[class="m-hmhot"]>[class="hotop"],[class="hotdn"],[class*="top"][class*="fr"],[class*="ft-fixed"],[class^="more-wrap"],[class^="cmt_more"],footer');
							} else {} if (obj.match(/^https?:\/\/(?!.+?\.(?:og[gv]|m(?:p[34]|4a)|w(?:ebm|av)|flv)($|\?.+))(?:music\.163\.com\/|y\.music\.163\.com\/m\/(?:song|dj)\?id=|(?:(?:bd|www)\.)?kuwo\.cn\/|m\.kuwo\.cn\/newh5|www\.kugou\.com\/(?:song|mvweb)\/|m3ws\.kugou\.com\/(?:kgsong|mv)\/|m\.kugou\.com\/|(?:i\.)?y\.qq\.com\/|(?:www|h|m)\.xiami\.com\/|(?:m\.)?music\.migu\.cn\/|5sing\.kugou\.com\/|(?:www|m)\.ximalaya\.com\/|kg\.qq\.com\/node\/|www\.app-echo\.com\/|radio\.sky31\.com\/|www\.1ting\.com\/|(?:www|m)\.9ku\.com\/play\/|www\.lrts\.me\/playlist|www\.douyin\.com\/video\/|www\.kuaishou\.com\/|haokan\.(?:baidu|hao123)\.com\/v)/)) {
								if (objj.match(/music\.163\./)) {
									cssobj('div[class*="play"] a[href*="/artist?id="],[href*="/store/product"],#g-topbar>div.m-top li.lst,SPAN.u-btn u-btn-red,#btn-open-id,I.arr ani,DIV.m-musicStreetWakeUp');
								} else if (objj.match(/kuwo/)) {
									if (jxbpcobj) {
										cssobj('[class*="foot"],[id*="foot"],[class*="copy"],[id*="copy"],[class^="qrcode-container"],[class*="xiuchang"]');
									} else {
										cssobj('div[id="top"],[class^="Bottom_"],[class*="download"],[class^="nav_title"],[class="tokuwo"],div[class="Mvplay_getbutt"],[class="Progress_body"]~*,.top .right');
									}
								} else if (objj.match(/kugou/)) {
									if (jxbpcobj) {
										cssobj('[aria-describedby*="down"],[class*="_banner_wrap"],[id*="_banner_wrap"],ul[class="subNav"],a[id="productCenter"],div[class="btnArea2 clearfix"],[class*="spread"]');
									} else {
										cssobj('[class*="down"],[id*="down"],[class*="openAppBtn"],[id*="openAppBtn"],[class*="comment_more"],[id*="comment_more"],[class*="mod_singer"],[id*="mod_singer"],[class*="morelrc"],[id*="morelrc"]');
									}
								} else if (objj.match(/y\.qq\.com/)) {
									cssobj('a[href^="javascript:"][class*="bottom"][class*="openplayer"]+div[class="popup_guide"],[class*="nav"][class*="own"],div[class^="lyric_action"],div[class^="flotage js_pg_flotage"],p[class="comment__rule"],div[id="limitButton"],[data-stat*="top.artists"],[data-tj*="_$qm"]:not([data-tj$="_$qm"]),[data-tj][data-ksongmid],[data-tj$="_$qm"]:not([data-tj*="yric"]):not([data-tj*="song"]):not([data-tj*="inger"]),[data-expose="songsheet_$qm"],[data-expose="video_$qm"]');
								} else if (objj.match(/xiami/)) {
									cssobj('[class*="toApp"],[id*="toApp"],[class*="download"],[id*="download"]');
								} else if (objj.match(/kuaishou/)) {
									cssobj('p[class^="video-info-title"]>a[target*="_blank"]');
								} else if (obj.match(/^https?:\/\/haokan\.(?:baidu|hao123)\.com\/v/)) {
									if (jxbpcobj) {} else {
										cssobj('div[class^="video-player-shade"],div[class*="download"],div[class^="top-video-list-container"],div[class^="video-relate-list-container"],div[class^="gather"],div[class^="author-info"]');
									}
								} else if (objj.match(/\.9ku\.com/)) {
									cssobj('li[id^="sprri"],[class^="xx"],[class="songText2"],fotter,iframe,[class^="fot"],[class^="dongBox "],a[class*="down"],[class^="you"],[style*="width: 960px"],[style*="width:960px"],[id^="asyncbox_"]');
								} else if (objj.match(/1ting\./)) {
									cssobj('[class^="NA_"],[id^="NA_"],[class="todaySong"],[class^="tingx_"],[id^="tingx_"],div[class="main"][id="widget"],[style*="height:90px"],[style*="height: 90px"],[class^="mobile"],[id^="mobile"],a[href*="/mv/song/player/"],a[class*="nice"],li[id^="feedback"]');
								} else if (objj.match(/music\.migu\./)) {
									if (jxbpcobj) {
										cssobj('body>div:first-child[id*="top"]');
									} else if (!jxbpcobj && document.querySelector("div.migu-user")) {
										cssobj('span#jxbmmnnobj{top:50px!important;}963540817');
									} else {}
									cssobj('a[class="yinliuBtn"][href^="javascript:"],section[class^="music-active"],section[id^="music-active"],[class="app-mv"],[class^="windowImg"]');
								} else if (objj.match(/ximalaya/)) {
									cssobj('[class="box sY_"],a:not([to^="/"]):not([to^="http"])[to*="://open"],[class^="dl-pc "],[id^="dl-pc "],[class*="-card _"],[id*="-card _"],[href*="download"],[href*=".tmall.com"]');
								} else {}(function() {
									let btn = document.createElement("span");
									btn.addEventListener('click', function() {
										if (obj.match(/music\.163\./)) {
											if (jxbpcobj) {
												try {
													if (document.querySelector('a[hidefocus="true"][class="ply j-flag pas"]')) {
														document.querySelector('a[hidefocus="true"][class="ply j-flag pas"]').click();
													} else {}
												} catch (err) {}
												if (obj.match(/^https?:\/\/y\.music\.163\.com\/m\/(?:song|dj)\?id=/)) {
													window.open("https://music.163.com/song/media/outer/url?id=" + window.location.href.replace(/^.*?\/(?:song|dj)\?id=(\d+)$/, "$1"), "bkmk_popup");
												} else if (document.querySelector('div[class*="play"] a[hidefocus="true"][href*="?id="]').href.match(/^https?:\/\/music\.163\.com\/(?:song|dj)\?id=/)) {
													window.open("https://music.163.com/song/media/outer/url?id=" + document.querySelector('div[class*="play"] a[hidefocus="true"][href*="?id="]').href.replace(/^.*?\/(?:song|dj)\?id=(\d+)$/, "$1"), "bkmk_popup");
												} else {
													return false;
												}(function() {
													if (!document.querySelector("jxbyyxzjk")) {
														document.head.appendChild(document.createElement("jxbyyxzjk"));
														(function() {
															try {
																(function() {
																	document.addEventListener('visibilitychange', function() {
																		if (document.hidden) {} else if (!document.querySelector('a[hidefocus="true"][class="ply j-flag pas"]')) {
																			try {
																				document.querySelector('a[hidefocus="true"][class="ply j-flag"]').click()
																			} catch (err) {}
																		} else {}
																	})
																})()
															} catch (err) {}
														})()
													} else {}
												})()
											} else {
												if (document.querySelector('div[class*="newfst"] div[class*="playing"]')) {
													try {
														if (document.querySelector("div.m-song-clickarea.m-song-clickarea2")) {
															document.querySelector("div.m-song-clickarea.m-song-clickarea2").click();
														} else {}
													} catch (err) {}
													window.open("https://music.163.com/song/media/outer/url?id=" + window.location.href.replace(/^.*?\/(?:song|dj)\?id=(\d+)(?:[^\d].*)?$/, "$1"), "bkmk_popup");
												} else {
													return false;
												}(function() {
													document.addEventListener('visibilitychange', function() {
														if (document.hidden) {} else if (!document.querySelector("div.m-song-clickarea.m-song-clickarea2")) {
															try {
																document.querySelector("div.m-song-clickarea").click();
															} catch (err) {}
														} else {}
													})
												})()
											}
										} else if (objj.match(/douyin/)) {
											try {
												if (document.querySelector('video>source')) {
													if (document.querySelector("video").play()) {
														document.querySelector("video").pause();
													} else {}
													window.open(document.querySelector('video>source').src, "bkmk_popup");
												} else if (document.querySelector('video[src]')) {
													if (document.querySelector("video").play()) {
														document.querySelector("video").pause();
													} else {}
													window.open(document.querySelector('video[src]').src, "bkmk_popup");
												} else {}
											} catch (err) {}(function() {
												if (!document.querySelector("jxbyyxzjk")) {
													document.head.appendChild(document.createElement("jxbyyxzjk"));
													(function() {
														try {
															(function() {
																document.addEventListener('visibilitychange', function() {
																	if (document.hidden) {} else if (document.querySelector("video>source")) {
																		try {
																			document.querySelector("video").play()
																		} catch (err) {}
																	} else {}
																})
															})()
														} catch (err) {}
													})()
												} else {}
											})()
										} else if (objj.match(/(?:haokan|kuaishou|kuwo|kugou|(?:y|kg)\.qq|xiami|migu|app-echo|radio\.sky31|lrts|9ku)\./)) {
											(function() {
												if (!document.querySelector("jxbyyxzjk")) {
													document.head.appendChild(document.createElement("jxbyyxzjk"));
													(function() {
														try {
															(function() {
																document.addEventListener('visibilitychange', function() {
																	let audiovideoaobj = document.querySelectorAll("audio,video")[0];
																	if (document.hidden) {} else if (audiovideoaobj.src.match(new RegExp("^http"))) {
																		try {
																			audiovideoaobj.play()
																		} catch (err) {}
																	} else {}
																})
															})()
														} catch (err) {}
													})()
												} else {}
											})(); if (!objj.match(/radio\.sky31\./)) {
												if (document.querySelectorAll("audio,video")[0].src.match(new RegExp("^http"))) {
													if (document.querySelector("video")) {
														try {
															document.querySelector("video").pause();
														} catch (err) {}
														window.open(document.querySelector("video").src, "bkmk_popup");
														return false;
													} else if (document.querySelector("audio")) {
														try {
															document.querySelector("audio").pause();
														} catch (err) {}
														window.open(document.querySelector("audio").src, "bkmk_popup");
														return false;
													} else {
														return false;
													}
												} else {
													return false;
												}
											} else {
												if (document.querySelectorAll("audio")[0].src.match(new RegExp("^http"))) {
													if (document.querySelector("audio")) {
														try {
															document.querySelector("audio").pause();
														} catch (err) {}
														window.open(document.querySelector("audio").src, "bkmk_popup");
														return false;
													} else {
														return false;
													}
												} else {
													return false;
												}
											}
										} else if (objj.match(/1ting\./)) {
											try {
												if (document.querySelector('li[class="playing"]>input[type=checkbox][value][hidefocus="true"]')) {
													try {
														if (document.querySelector("audio").play()) {
															document.querySelector("audio").pause();
														} else {}
													} catch (err) {}
													window.open(jxbyyxzaobj + document.querySelector('li[class="playing"]>input[type=checkbox][value][hidefocus="true"]').value + "&type=1ting", "bkmk_popup");
												} else {}(function() {
													if (!document.querySelector("jxbyyxzjk")) {
														document.head.appendChild(document.createElement("jxbyyxzjk"));
														(function() {
															try {
																(function() {
																	document.addEventListener('visibilitychange', function() {
																		if (document.hidden) {} else if (document.querySelector("audio")) {
																			try {
																				document.querySelector("audio").play()
																			} catch (err) {}
																		} else {}
																	})
																})()
															} catch (err) {}
														})()
													} else {}
												})()
											} catch (err) {}
										} else if (objj.match(/ximalaya\./)) {
											if (document.querySelector('div[class*="player-body"]>a[class*="title"][href]:not([href="/"])') && obj.match(/^https?:\/\/www\./)) {
												try {
													if (document.querySelector('div[class*="player"] a[class="pause"]')) {
														document.querySelector('div[class*="player"] a[class="pause"]').click();
													} else {}
												} catch (err) {}
												window.open(jxbyyxzaobj + document.querySelector('div[class*="player-body"]>a[class*="title"][href]').href.replace(/^https?:\/\/.*?\/(\d+)$/, "$1") + "&type=ximalaya", "bkmk_popup");
											} else if (document.querySelector('i.icon-list_pause+.titleWrapper .title._Qw') && obj.match(/^https?:\/\/m\./)) {
												window.open(jxbyyxzaobj + document.querySelector('i.icon-list_pause+.titleWrapper .title._Qw').parentNode.parentNode.parentNode.parentNode.href.replace(/^https?:\/\/.*?\/(\d+)$/, "$1") + "&type=ximalaya", "bkmk_popup");
											} else if (document.querySelector('div[class^="player-box"] a[to^="iting://open?msg_type="][to*="&track_id="]') && obj.match(/^https?:\/\/m\./)) {
												window.open(jxbyyxzaobj + window.location.href.replace(/^https?:\/\/.*?\/(\d+)$/, "$1") + "&type=ximalaya", "bkmk_popup");
											} else {
												return false;
											}(function() {
												if (!document.querySelector("jxbyyxzjk")) {
													document.head.appendChild(document.createElement("jxbyyxzjk"));
													(function() {
														try {
															if (obj.match(/^https?:\/\/www\./)) {
																(function() {
																	document.addEventListener('visibilitychange', function() {
																		if (document.hidden) {} else {
																			try {
																				if (document.querySelector('div[class*="player"] a[class="play"]')) {
																					document.querySelector('div[class*="player"] a[class="play"]').click()
																				} else {}
																			} catch (err) {}
																		}
																	})
																})()
															} else {}
														} catch (err) {}
													})()
												} else {}
											})()
										} else {
											return false;
										}
									}, false);
									btn.id = "jxbmmnnobj";
									btn.setAttribute('style', 'display:inline-block;font-size:15px;color:white;width:35px;height:35px;line-height:35px;text-align:center;background-size:100% 100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAUVBMVEVHcEz20ZvppDoAAAD0rDtYPhbKkDD/tkT/7NX/6MP/szr///8WEQr4rjd7VhvEiSs2JgvpozTs7OxUOhKpdyXZmDBKSkqrq6vKyspqamqBgYGckC4AAAAACnRSTlMAHEb/yDqu8TdN02L+YQAABGVJREFUeNrdm+uCsyoMRaetVceCCOpUff8HPU35KHLR4gXEs39OVdYQSAKEnx9Nl0ue/3pSnl8uP990KMD1miSZZyXJ9ToPkHhufwoAGi8CyQpxORbges2yEE1j3LYYF0WWaQihARIV4H733/0YE1KWVYVQWXIz3O/xAKSp/8brGqHbW1UFRiiKNI0F4H7nf1BFKXmrbSm1/e4uSstSNM5FCMf6Z4TDAewGaBr+MHqpquq6LAlZA0JIVd008WH4McLBAJeLfQoSor8GIEsxmkbtfHUYJskrPPsEwC4AeW53wm1rexUw6toVwt48fINS+D3L8vx4gN9fOwCl9pe5AEJ1NUJjI05+AbXtJgC0EQC5ABS4rm8zgqBCads2TVnWdfURTNimadspE45d0SwAXgyA9gUoirK8fRE4qaW/cDXNGQBmRvFmnQMAYzOM7CWnQXg4gMsw/L8DzDuT9XJzxR4Bbq4A39zx+h5wCMdRAPhyRiIlOwOAHyOItPwMAH6mIg9FZwHY4pAR+nvrhmyTMCAAOgIAoWFg7PESe6nvJURYALYZwDYREer751t698onns+HoudTPrloEO4DwNYDmEu0vz9uW/M/kxqGhyb26PtVjmgegDkDPNYC6I5I/f9BXacjICSeYWwYwFzqcwuCUQQA6lYNQl03sivjDQ2DbiTxBP+Fv8WYAFiQkEQHID8NnQuuFj6tG0E+xYcoNwljr6hweoC+lwC8UfiL7NwPAJND9PkUMUGawDEtNwGGD0A3D/DwBDDuAQgw3OXqAHIa2qfrBhMM4QFURzTuXDkNTVcke0o+K4bgQgA6CcDCAKjbFKojUt3NbDhm42fqeoEr9gFQLQLQUjKXYCSSlq5jb3Wd7P7F4bg4HkA/unDJiOR2JSRt+iQVG90rAXpngNs+ANTYroOUez4pnZOYA84A+GgAeYS35w7ZuQD226ZASCxK4gPAGM8cUlO6x8Y1HPOM29AB8GEAGPPiCn7kxMtMzLxgKwJ0v/rleAD0xYf9cJbSLUNRP+qMDcBcXoIpzOnYNMsNAabVOz82AP5hM2zaXls2GOdLHrwDIFcAUWZGCBxFjzfUVMcBoEvCr/p27ABThUcigYTOXzoNYfCJTUl3AKwAoPAAWvkRTyGXdv63CR0/wNjx1rVZjrYlDTkLgExCIDjtm4qdBWDfAyt5THEmALxrCYNpBId1wcEA+x5dS6d+FgDXxYgoe4WUHgSlbWYp13hReg4AWKx8TzahdI8QvfQZFnmQ3ggYwDOT8tgB5sMvBFm30tbXops6JaWeAPBKgGknDKFpPtFyVxwA9sLmqQHoXtS8CQCHBLAVt9uLmqeWmOs1WV0fFMB2wcFW2g9lzHtffpm8YREYwLzkogNUlc2Rbr/8M3nLJjCAaYSxG/LT+SMDRAGgX3aTm9P2bZp9puDMbbvgACYCLEf5tm1RBGg+AgBASFM/nW1OvzQ1mo8AIMzF58Th5nV20M3r8eV3f3K8fR8S4D/eG/opuPbAOQAAAABJRU5ErkJggg==);text-align:center;overflow:hidden;user-select:none;position:fixed;right:0;top:0;bottom:280px;z-index:999999;border-radius:10px');
									document.body.appendChild(btn);
								})();
							} else if (obj.match(/^https?:\/\/music\..+?\?id=\d+?&type=(?:ximalaya|1ting)/)) {
								document.title = '音乐下载';
								cssobj('*{background:black!important;}*');
								(function() {
									let mmyydsfzx_counter = 0;
									let mmyydsfzx_jiankong = setInterval(function() {
										let mmyydsfzx_btna = document.querySelector('span[class="am-input-group-btn"]>a[id="j-src-btn"][target="_blank"]').href.match(new RegExp("^http"));
										let mmyydsfzx_btnb = document.querySelector("form input+div").innerText.match(new RegExp("没有找到"));
										if (mmyydsfzx_btna) {
											if (document.querySelector('span[class="am-input-group-btn"]>a[id="j-src-btn"][target="_blank"][href^="http"]:not([href$="="])')) {
												window.location.href = document.querySelector('span[class="am-input-group-btn"]>a[id="j-src-btn"][target="_blank"][href^="http"]:not([href$="="])').href;
											} else {}
											clearInterval(mmyydsfzx_jiankong);
											return false
										}
										if (mmyydsfzx_btnb) {
											clearInterval(mmyydsfzx_jiankong);
											window.close();
											return false
										}++mmyydsfzx_counter;
										if (mmyydsfzx_counter > 50) {
											clearInterval(mmyydsfzx_jiankong);
											return false
										}
									}, 234);
									setTimeout(function() {
										if (jxbyyxzbobj == null || jxbyyxzbobj == undefined || jxbyyxzbobj == '') {
											window.close()
										} else if (document.location.href.indexOf(jxbyyxzaobj) == 0) {
											window.location.href = window.location.href.replace(/^.+?=(\d+?)&type=(.*)$/, jxbyyxzbobj + "$1&type=$2");
										} else {
											window.close()
										}
									}, 2345);
									setTimeout(function() {
										window.close()
									}, 3456);
								})();
							} else {}
							if (obj.match(/^https?:\/\/(?:www\.wbdy\.tv|www\.ikukk\.com)\//)) {
								if (obj.match(/^https?:\/\/[^\/]+?\/$/)) {} else {
									cssobj('.navbar,.panel{border:none;margin-bottom:auto}.glyphicon-triangle-right:before,.glyphicon-play:before,ol.breadcrumb,nav,[role*="alert"],[class="panel-heading"],[class="panel-heading"]+[class="panel-body content"],[class="panel-footer"]');
									if (obj.match(/\/index.php\?m=vod-search/)) {
										pdssgjcobj = 'div.thumbnail>a.figure';
										apddjobj();
										setTimeout(function() {
											try {
												if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
													if (pdssgjcobj.length == 1) {} else {
														try {
															GM_setValue('集数', '选集');
														} catch (err) {}
														try {
															GM_setValue('视频自动全屏', '关闭');
														} catch (err) {}
													}
												} else {}
											} catch (err) {}
											try {
												if (document.querySelector('div.panel-heading').innerText.match(/共\s*?0\s*?条/) || document.querySelector('div.panel-footer.page').innerText.match(/共\s*?0\s*?条/)) {
													window.location.href = window.location.href.replace(/^.+?\/index\.php\?m=vod-search&wd=(.*)$/, "https://www.cupfox.com/search?key=$1");
												} else {}
											} catch (err) {}
										}, 1234);
									} else if (obj.match(/(?:\/play|url=http)/)) {
										if (obj.match(/\/play\//)) {
											(function() {
												setTimeout(function() {
													if (document.querySelector('iframe[src*="/?url=&id="]') && !document.querySelector('iframe[src*="/?url=http"]')) {
														alert('当前集数还没更新，请自行更换 接口');
														window.close();
													} else if (document.querySelector('iframe[src*="/?url=http"]') && !document.querySelector('iframe[src*="/?url=&id="]')) {
														return false;
													} else {
														return false;
													}
												}, 2345);
											})();
										} else {}
										try {
											if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
												if (obj.match(/^https?:\/\/www\.wbdy\.tv\/play\/\d+?[^\/]+?\.html/)) {
													jxqtwzobj();
													jxzdqpobj();
													cssobj('div.maomibtn li#ckkjjjobjli,div.maomibtn a.maomi+ul>li:not([style]):not([id])');
													jszdqc();
												} else {}
												try {
													if (obj.match(/^https?:\/\/www\.wbdy\.tv\/play\/\d+?[^\/]+?\.html/) && GM_getValue('集数').match(/^\s*?\d+?\s*?$/) && !GM_getValue('集数').match(/^\s*?选集\s*?$/)) {
														window.location.href = window.location.href.replace(/^(http.+?\/play\/\d[^\/]+?_)\d+?(\.html).*$/, "$1" + GM_getValue('集数') + "$2");
														GM_setValue('集数', '选集');
													} else {
														try {
															if (GM_getValue('视频自动全屏').match(/^\s*?开启\s*?$/) && !GM_getValue('视频自动全屏').match(/^\s*?关闭\s*?$/) && localStorage.getItem("jxzdqp") == '1') {
																setTimeout(function() {
																	qpobj(document.querySelector('iframe[allowfullscreen][width="100%"]'));
																	try {
																		GM_setValue('视频自动全屏', '关闭');
																	} catch (err) {}
																}, 1234);
															} else {
																try {
																	GM_setValue('视频自动全屏', '关闭');
																} catch (err) {}
															}
														} catch (err) {}
													}
												} catch (err) {}
											} else {}
										} catch (err) {}
										cssobj('.panel-body .btn-list .btn{min-width:auto!important;}.panel-footer{border-top:none!important;}.nav-tabs{border-bottom:none!important;}body,.panel,.panel-footer,.panel.panel-info{background:black!important;}div.panel-body.tab-content{display:initial!important;;text-align:center!important;;}.panel-body,.navbar{background-color:transparent!important;}.btn-success{color:red;background-color:black;}.btn-info{color:black;background-color:darkgreen;border-color:darkgoldenrod;}.panel-heading.navhead');
										setTimeout(function() {
											try {
												const jxbsssp = document.querySelectorAll('a.btn.btn-sm');
												for (let jxbssspi = 0; jxbssspi < jxbsssp.length; jxbssspi++) {
													if (jxbsssp[jxbssspi].innerText.match(/^[^第]+?第\s*?\d+?\s*?集\s*?$/g)) {
														jxbsssp[jxbssspi].innerText = jxbsssp[jxbssspi].innerText.replace(/^[^第]+?第\s*?(\d+?\s*?集)\s*?$/, "$1");
													} else if (jxbsssp[jxbssspi].innerText.match(/^[^\_]+?\_\s*?(\d+?)\s*?(?:集?\s*?)?$/g)) {
														jxbsssp[jxbssspi].innerText = jxbsssp[jxbssspi].innerText.replace(/^[^\_]+?\_\s*?(\d+?)\s*?(?:集?\s*?)?$/, "$1集");
													}
												};
											} catch (err) {}
										}, 1234);
										if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
											cssobj('div.btn-list{width:auto!important;float:none!important;text-align:center!important;}.btn-group-sm>.btn,.btn-sm{font-size:unset;}963540817');
										} else {}
										try {
											const reg = /^[^\-]+?\-.*?在线/;
											let title = document.title;
											title = title.replace(reg, '');
											document.title = title;
										} catch (e) {}
									} else {}
								}
							} else if (obj.match(/^https?:\/\/miao101\.com\/video/)) {
								cssobj('html,body{background:black;background-color:black;}.font-weight-bold{color:darkgreen;}.col-8{color:firebrick;display:grid;}.badge-light{color:aliceblue;background-color:black;}@media(min-width:768px){.col-md-9{-ms-flex:inherit;flex:auto;max-width:inherit;}}.mt-3,.my-3{margin-top:auto!important;}.btn-outline-dark{color:cadetblue;}nav,[class*="nav"],span[class^="badge badge"],iframe[data-aa]~:not([class^="tab-content"])');
								(function() {
									try {
										const miao101 = document.querySelectorAll('div[aria-labelledby]');
										for (let miao101i = 0; miao101i < miao101.length; miao101i++) {
											const miao101msa = miao101[miao101i].querySelectorAll('a[href*="/video/"]');
											for (let miao101ia = 0; miao101ia < miao101msa.length; miao101ia++) {
												if (miao101msa[miao101ia].innerText.match(/^\s*?第\s*?\d+?\s*?集\s*?$/g)) {
													miao101msa[miao101ia].innerText = miao101msa[miao101ia].innerText.replace(/^\s*?第\s*?0?(\d+?)\s*?集\s*?$/g, "$1")
												}
											}
										};
									} catch (err) {}
								})();
							} else if (obj.match(/^https?:\/\/www\.555dy6\.com\/(?:vodsearch|vodplay)\//)) {
								cssobj('div[class*="nav"][class$="tabbar"],div[class^="col-md-wide-"][class*="-sidebar"],ul[class$="extra clearfix"],ul[class*="header"][class*="nav"]>li[class*="hidden-md hidden-sm hidden-xs"],[class*="foot"],[id*="foot"]');
								if (obj.match(/\/vodsearch\//)) {
									cssobj('@media(min-width:1024px){.col-md-wide-7{width:inherit;}}');
									setTimeout(function() {
										try {
											if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
												if (document.querySelectorAll("ul#searchList>li.clearfix").length == 1) {
													if (GM_getValue('集数').match(/^\s*?\d+?\s*?$/) && !GM_getValue('集数').match(/^\s*?选集\s*?$/)) {
														window.location.href = document.querySelector('ul#searchList>li.clearfix a[href*="/vodplay/"]').href.replace(/^(http.+?\/vodplay\/[^\/]+?-)\d+?(\.html)/, "$1" + GM_getValue('集数') + "$2");
													} else {
														try {
															GM_setValue('集数', '选集');
														} catch (err) {}
														window.location.href = document.querySelector('ul#searchList>li.clearfix a[href*="/vodplay/"]').href;
													}
												} else {
													try {
														GM_setValue('集数', '选集');
													} catch (err) {}
												}
											} else {}
										} catch (err) {}
									}, 1234);
								} else if (obj.match(/\/vodplay\//)) {
									if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
										jxqtwzobj();
										jxzdqpobj();
										zdbt();
									} else {}
									cssobj('body>:not(nav):not(header):not([class*="player"]):not([id*="player"]),div[id*="player"][id*="sidebar"] div[class^="col-"][class*="mb10"]>a[href]:not([href^="/"])>img,div.maomibtn li#ckkjjjobjli,div.maomibtn a.maomi+ul>li:not([style]):not([id])');
									cssobj('.maomibtn{position:fixed!important;}body>:not(nav):not(header):not([class*="player"]):not([id*="player"])~div:not([class]):not([id]){display:block!important;max-width:none!important;max-height:none!important;overflow:auto!important;position:relative;left:auto;}963540817');
									setTimeout(function() {
										try {
											if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
												GM_setValue('集数', '选集');
											} else {}
										} catch (err) {}
										if (document.querySelector('table iframe[src*="https"][allowfullscreen]')) {
											try {
												if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") && (localStorage.getItem("jxzdqp") == '1')) {
													pcspzdqpobj = setInterval(function() {
														if (document.querySelector('table iframe[src*="https"][allowfullscreen]')) {
															qpobj(document.querySelector('table iframe[src*="https"][allowfullscreen]'));
															clearInterval(pcspzdqpobj);
														} else {}
													}, 1234);
												} else {}
											} catch (err) {}
										} else {
											alert('当前集数还没更新，请自行更换 接口');
											window.close();
										}
									}, 1234);
								} else {}
							} else if (obj.match(/^https?:\/\/www\.zhaojiaoben\.cn\//)) {
								(function() {
									let aljtupd_counter = 0;
									let aljtupd_jiankong = setInterval(function() {
										let aljtupd_btn = document.querySelector('div[class^="tags has-addons"]>span[class^="tag is-success is-medium"] a[href]:not([href^="/"])');
										if (aljtupd_btn) {
											try {
												const zhaojiaoben = document.querySelectorAll('div[class^="tags has-addons"]>span[class^="tag is-success is-medium"] a[href]:not([href^="/"])');
												setTimeout(function() {
													Array.prototype.map.call(document.querySelectorAll('div[class^="tags has-addons"]>span[class^="tag is-success is-medium"] a[href]:not([href^="/"])'), function(element, index) {
														element.onclick = function() {
															const zhaojiaoben = document.querySelectorAll('div[class^="tags has-addons"]>span[class^="tag is-success is-medium"] a[href]:not([href^="/"])');
															for (let zhaojiaobeni = 0; zhaojiaobeni < zhaojiaoben.length; zhaojiaobeni++) {
																let zhaojiaobena = zhaojiaoben[zhaojiaobeni];
																let szhaojiaobena = zhaojiaobena.getAttribute('href');
																if (szhaojiaobena && /\/963540817-1\.png/ig.test(szhaojiaobena)) {} else {
																	if (zhaojiaoben[zhaojiaobeni]) {
																		zhaojiaoben[zhaojiaobeni].href = atob('aHR0cHM6Ly9naXRlZS5jb20vcTIyNTcyMjcyODkvMDAvcmF3L21hc3Rlci85NjM1NDA4MTctMS5wbmc=')
																	}
																}
															}
														}
													})
												}, 1500)
											} catch (e) {}
											clearInterval(aljtupd_jiankong);
											return false
										}++aljtupd_counter;
										if (aljtupd_counter > 100) {
											clearInterval(aljtupd_jiankong);
											return false
										}
									}, 666)
								})();
							} else if (obj.match(/^https?:\/\/(?![^\/]*?cupfox\.(?:[^\/]+?\/$|.+?&id=))[^\/]*?cupfox\./)) {
								jkdsflyobj();
								localStorage.setItem('websiteTime', '20');
								cssobj('script+p,[class*="img"],[id*="img"],img,[class$="search-other-names"],div>[style^="z-index:"],[class*="block"],[class$="movie border-shadow"],[class*="sidebar"],ul[class$="fixed-nav"],div[class$=" nav"]>span:not([class*="title"]):not([class*="xuanpian"]):not([class*="bangdan"]),img[width*="%"],[class$="movie border-shadow"]+[style^="z-index:"],[class$="title-wrapper"]~[class$="mobile-detail-block"],[class$="fixed-nav"]+[class$="movie border-shadow"],[class$="mobile-container"]+[class$="mobile-nav"],[class$="card border-shadow"],[class*="burger-button"],[id^="page-wrap"]>[style^="z-index:"],[id^="hjuj"]');
							} else {}
						}; if (vipzdjxwzobj) {
							(function() {
								document.body.appendChild(document.createElement("我是宁小影生活很简单"));
								let aa = 1, bb = '<span><a1 style="display:none"></a1><a2 style="display:none">', cc = '<span><a1 style="color:darkgreen">搜索</a1><a2 style="display:none">', dd = '<span><a1 style="color:darkgreen">跳转</a1><a2 style="display:none">', ee = '<span><a1 style="color:darkgreen">小窗</a1><a2 style="display:none">', eee = '<span style="background-color:cyan"><a1 style="color:darkgreen">Json</a1><a2 style="display:none">', ff = '<span><a1 style="color:darkgreen">大窗</a1><a2 style="display:none">', ii = '<span style="background-color:hotpink"><a1 style="color:darkgreen"></a1><a2 style="display:none">', kk = '<span style="display:grid;background-color:skyblue;font-weight:bold;border:5px outset buttonface;border-radius:5px;"><a1 style="border:5px outset buttonface;border-radius:5px;">小影自用</a1><a2 style="display:none">', kkk = '<span style="display:grid;background-color:skyblue;font-weight:bold;border:5px outset buttonface;border-radius:5px;"><a1 style="display:none">小影自用</a1><a2 style="display:none">', jj = '<span style="background-color:darkorange"><a1 style="color:darkgreen"></a1><a2 style="display:none">', gg = '</a2><a3 style="color:#2196F3;zoom:0.8;font-weight:bold;">\u27bd</a3><a4>', hh = '</a2><a3 style="display:none"></a3><a4>', https = [{
									name: bb + aa+++hh + "\u900f\u660e\u65e0\u63a5\u53e3",
									vip: "\u900f\u660e\u65e0\u63a5\u53e3"
								}, {
									name: cc + aa+++gg + "\u5e03\u7c73\u7c73",
									vip: "\u5e03\u7c73\u7c73"
								}, {
									name: cc + aa+++gg + "\u89c6\u9891\u9009\u96c6",
									vip: "\u89c6\u9891\u9009\u96c6"
								}, {
									name: jj + aa+++hh + "01",
									url: "https://z1.m1907.top/?jx=",
									title: "集数如果不对，请手动选集"
								}, {
									name: jj + aa+++hh + "02",
									url: "https%3A%2F%2Fjx.4kdv.com%2F%3Furl%3D",
									title: "可以自动播放下一集"
								}, {
									name: jj + aa+++hh + "03",
									url: "https%3A%2F%2Flecurl.cn%2F%3Furl%3D",
									title: "可以自动播放下一集"
								}, {
									name: jj + aa+++hh + "04",
									url: "https://www.gai4.com/?url="
								}, {
									name: ii + aa+++hh + "乐多",
									url: "https%3A%2F%2Fapi.leduotv.com%2Fwp-api%2Fifr.php%3FisDp%3D1%26vid%3D"
								}, {
									name: ii + aa+++hh + "05",
									url: "https://okjx.cc/?url="
								}, {
									name: ii + aa+++hh + "06",
									url: "https://jx.rdhk.net/?v="
								}, {
									name: ii + aa+++hh + "麒麟",
									url: "https%3A%2F%2Fssvip.sujx.top%2F%3Furl%3D"
								}, {
									name: ii + aa+++hh + "虾米",
									url: "aHR0cHM6Ly9qeC54bWZsdi5jb20vP3VybD0="
								}, {
									name: ii + aa+++hh + "久播",
									url: "https://vip.jiubojx.com/vip/?url="
								}, {
									name: ii + aa+++hh + "夜幕",
									url: "aHR0cHM6Ly93d3cueWVtdS54eXovP3VybD0="
								}, {
									name: ii + aa+++hh + "木穆",
									url: "https%3A%2F%2Fjx.m3u8.tv%2Fjiexi%2F%3Furl%3D"
								}, {
									name: ii + aa+++hh + "哔哩",
									url: "https%3A%2F%2Fwww.mtosz.com%2Fm3u8.php%3Furl%3D",
									title: "B站可以用"
								}, {
									name: bb + aa+++hh + "PAR",
									url: "https://vip.parwix.com:4433/player/?url="
								}, {
									name: bb + aa+++hh + "CKP",
									url: "https%3A%2F%2Fwww.ckplayer.vip%2Fjiexi%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "OK",
									url: "https://okjx.cc/?url="
								}, {
									name: bb + aa+++hh + "淘A",
									url: "https%3A%2F%2Fjx.1080jx.top%2Fvipjx%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "淘B",
									url: "https%3A%2F%2Fjx.1080jx.top%2Fbt%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "淘C",
									url: "https%3A%2F%2Fjx.1080jx.top%2Fm3u8%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "影A",
									url: "https%3A%2F%2Fjx.baiyu.buzz%2Faa%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "影B",
									url: "https%3A%2F%2Fjx.baiyu.buzz%2Fbb%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "影C",
									url: "https%3A%2F%2Fjx.baiyu.buzz%2Fcc%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "07",
									url: "https://jx.blbo.cc:4433/?url="
								}, {
									name: bb + aa+++hh + "08",
									url: "https://jsap.attakids.com/?url="
								}, {
									name: bb + aa+++hh + "神马",
									url: "https%3A%2F%2Fjxx.smys8.cn%2Findex.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "刺客",
									url: "https%3A%2F%2Fckmov.ccyjjd.com%2Fckmov%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "盘古",
									url: "https%3A%2F%2Fpanguapi.ntryjd.net%2Fjiexi%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "09",
									url: "https://jx.dj6u.com/?url="
								}, {
									name: bb + aa+++hh + "10",
									url: "https://im1907.top/?jx="
								}, {
									name: bb + aa+++hh + "奇米",
									url: "https%3A%2F%2Fqimihe.com%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "解啦",
									url: "https%3A%2F%2Fapi.jiexi.la%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "无尽",
									url: "https%3A%2F%2F51wujin.net%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "核桃",
									url: "https%3A%2F%2Fav.htoo.vip%2Fm3u8.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "七哥",
									url: "https%3A%2F%2Fjx.mmkv.cn%2Ftv.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "大影",
									url: "https%3A%2F%2Fapi.myzch.cn%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "百度",
									url: "https%3A%2F%2Fbd.bdjxfw.com%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "人人",
									url: "https%3A%2F%2Fjx.renrenmi.cc%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "扫描",
									url: "aHR0cHM6Ly9qeHguc215czguY24vaW5kZXgucGhwP3VybD0="
								}, {
									name: bb + aa+++hh + "无名",
									url: "https://www.administratorw.com/index.php?url="
								}, {
									name: bb + aa+++hh + "漂流",
									url: "https%3A%2F%2Fwww.playm3u8.cn%2Fjiexi.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "依托",
									url: "https%3A%2F%2Fjiexi.us%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "11",
									url: "https://jx.bozrc.com:4433/player/?url="
								}, {
									name: bb + aa+++hh + "和巴",
									url: "https%3A%2F%2Fwww.h8jx.com%2Fjiexi.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "12",
									url: "https://okjx.cc/?url="
								}, {
									name: bb + aa+++hh + "垫片",
									url: "aHR0cHM6Ly92aXAubGFvYmFuZHEuY29tL2ppZXhpLnBocD91cmw9"
								}, {
									name: bb + aa+++hh + "诺讯",
									url: "https%3A%2F%2Fwww.nxflv.com%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "速云",
									url: "https%3A%2F%2Fwww.akkdm.com%2Fb%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "迪奥",
									url: "https%3A%2F%2F123.1dior.cn%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "爱跟",
									url: "https%3A%2F%2Fvip.bljiex.com%2F%3Fv%3D"
								}, {
									name: bb + aa+++hh + "13",
									url: "https://www.yemu.xyz/?url="
								}, {
									name: bb + aa+++hh + "14",
									url: "https://jx.m3u8.tv/jiexi/?url="
								}, {
									name: bb + aa+++hh + "15",
									url: "https://jx.blbo.cc:4433/?url="
								}, {
									name: bb + aa+++hh + "16",
									url: "https://jx.blbo.cc:4433/?url="
								}, {
									name: bb + aa+++hh + "17",
									url: "https://jx.nnxv.cn/tv.php?url="
								}, {
									name: bb + aa+++hh + "18",
									url: "https://api.qianqi.net/vip/?url="
								}, {
									name: bb + aa+++hh + "19",
									url: "https://jx.playerjy.com/?url="
								}, {
									name: bb + aa+++hh + "20",
									url: "https://jx.bozrc.com:4433/player/?url="
								}, {
									name: bb + aa+++hh + "21",
									url: "https://jx.aidouer.net/?url="
								}, {
									name: bb + aa+++hh + "22",
									url: "https%3A%2F%2Fjiexi.fqzy.cc%2Fplayer%2Fjx.php%3Furl%3D"
								}, {
									name: bb + aa+++hh + "23",
									url: "https%3A%2F%2Fjx.aidouer.net%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "九八",
									url: "https%3A%2F%2Fjx.youyitv.com%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "24",
									url: "aHR0cHM6Ly9sZWN1cmwuY24vP3VybD0="
								}, {
									name: bb + aa+++hh + "25",
									url: "https%3A%2F%2Fjx.dj6u.com%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "冰豆",
									url: "https%3A%2F%2Fapi.qianqi.net%2Fvip%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "思云",
									url: "https%3A%2F%2Fjx.ap2p.cn%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "星驰",
									url: "https%3A%2F%2Fvip.swuii.top%2F%3Furl%3D"
								}, {
									name: bb + aa+++hh + "26",
									url: "https://jx.dj6u.com/?url="
								}, {
									name: ee + aa+++gg + "17云",
									url: "http://17kyun.com/api.php?url="
								}, {
									name: ee + aa+++gg + "七彩",
									url: "https://www.xymav.com/?url=",
									vip: "强制弹小窗"
								}, {
									name: ee + aa+++gg + "猪蹄",
									url: "https://jx.iztyy.com/svip/?url=",
									vip: "强制弹小窗"
								}, {
									name: ff + aa+++gg + "2090",
									url: "https://m2090.com/?url=",
									vip: "强制弹大窗",
								}, {
									name: ff + aa+++gg + "法克",
									url: "https%3A%2F%2Fjx.4321s.cc%2F%3Furl%3D",
									vip: "强制弹大窗",
									title: "可以自动播放下一集"
								}, {
									name: ff + aa+++gg + "爱酷",
									url: "http%3A%2F%2Fwww.ikukk.com%2F%3Fac%3D0%26url%3D",
									vip: "强制弹大窗"
								}, {
									name: dd + aa+++gg + "教案",
									url: "https%3A%2F%2Fv.jx.yh0523.cn%2Fs3%2Fapi.php%3Furl%3D",
									vip: "&danmu=0强制跳转"
								}, {
									name: dd + aa+++gg + "文案",
									url: "https%3A%2F%2Fapi.jx.yh0523.cn%2Fapi%2Fpgjx-1%2Fapi.php%3Furl%3D",
									vip: "&metareferer=undefined强制跳转"
								}, {
									name: dd + aa+++gg + "方案",
									url: "https%3A%2F%2Fjson.m3u8.tv%3A7788%2Fjson.php%3Furl%3D",
									vip: "&metareferer=undefined强制跳转"
								}, {
									name: dd + aa+++gg + "学案",
									url: "https%3A%2F%2Fjson.pangujiexi.com%3A7788%2Fjson.php%3Furl%3D",
									vip: "&metareferer=undefined强制跳转"
								}, {
									name: cc + aa+++gg + "555电影",
									vip: "555电影"
								}, {
									name: cc + aa+++gg + "古云搜索",
									vip: "古云搜索"
								}, {
									name: cc + aa+++gg + "旋风视频",
									vip: "旋风视频"
								}, {
									name: cc + aa+++gg + "Youtube",
									vip: "Youtube",
									title: "需要 科学上网 环境"
								}, {
									name: cc + aa+++gg + "麻花影视",
									vip: "麻花影视"
								}, {
									name: bb + aa+++hh + "\u81ea\u52a8\u55c5\u63a2",
									vip: "\u624b\u673a\u7c73\u4fa0\u6d4f\u89c8\u5668"
								}];
								function createSelecthttps(https) {
									let httpsvipul = document.createElement("ul");
									httpsvipul.id = "httpsvipul";
									if (jxbpcobj) {
										httpsvipul.setAttribute("style", "display:none");
									} else {
										httpsvipul.setAttribute("style", "display:none;background:#18222d;width:99vw;max-width:728px;height:150px;margin:0;padding:0;position:fixed;bottom:7px;left:50%;transform:translateX(-50%);z-index:99999;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-radius:5.3px;");
									}
									for (var i = 0; i < https.length; i++) {
										let httpsvipli = document.createElement("li");
										if (jxbpcobj) {} else {
											httpsvipli.setAttribute("style", "width:23%;padding:0 1px 0 1px;margin:0;border-radius:10px;display:block;list-style:none;float:left;font-size:16px;color:#999!important;font-weight:900;height:47.5px;text-align:center;line-height:63.5px;letter-spacing:0;border-bottom:0.5px solid #333;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;cursor:pointer;");
										}(function(num) {
											try {
												if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
													if (https[num].name.match(/(?:\u900f\u660e\u65e0\u63a5\u53e3|\u81ea\u52a8\u55c5\u63a2)/g)) {} else {
														if (https[num].url != null || https[num].url != undefined) {
															if (https[num].title != null || https[num].title != undefined) {
																try {
																	httpsvipli.title = '\u7279\u522b\u8bf4\u660e\uff1a\uff08' + https[num].title + '\uff09\u203b \u63a5\u53e3\u5730\u5740\uff1a\uff08' + atob(https[num].url.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, "")) + '\uff09';
																} catch (err) {
																	httpsvipli.title = '\u7279\u522b\u8bf4\u660e\uff1a\uff08' + https[num].title + '\uff09\u203b \u63a5\u53e3\u5730\u5740\uff1a\uff08' + unescape(https[num].url.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, "")) + '\uff09';
																}
															}
															if (https[num].title == null || https[num].title == undefined) {
																try {
																	httpsvipli.title = '\u63a5\u53e3\u5730\u5740\uff1a\uff08' + atob(https[num].url.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, "")) + '\uff09';
																} catch (err) {
																	httpsvipli.title = '\u63a5\u53e3\u5730\u5740\uff1a\uff08' + unescape(https[num].url.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, "")) + '\uff09';
																}
															}
														}
														if (https[num].url == null || https[num].url == undefined) {
															if (https[num].title == null || https[num].title == undefined) {
																httpsvipli.title = https[num].name.replace(/^.+?>\s*?([^<]+?)\s*?<\/a1>.+?<a4>\s*?(.+)\s*?$/gm, "使用“$2”进行$1");
															}
															if (https[num].title != null || https[num].title != undefined) {
																httpsvipli.title = https[num].name.replace(/^.+?>\s*?([^<]+?)\s*?<\/a1>.+?<a4>\s*?(.+)\s*?$/gm, "使用“$2”进行$1") + '\uff08' + https[num].title + '\uff09';
															}
														}
													}
												} else {}
											} catch (err) {}
											httpsvipli.onclick = function() {
												try {
													var obj = window.location.href,
														objj = window.location.host,
														zdydssjobj, pczdydssjobj, sjzdydssjobj, jishu;
													(function() {
														if (!document.querySelector("jxbvideo")) {
															document.body.appendChild(document.createElement("jxbvideo"));
															try {
																if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																	const sjjkslobj = document.querySelectorAll("#httpsvipul>li");
																	let arra = [], arrb = [], arrahttpsjk, arrbhttpsjk;
																	for (let sjjksloji = 0; sjjksloji < sjjkslobj.length; sjjksloji++) {
																		if ((sjjkslobj[sjjksloji].style.display != 'none') && (sjjkslobj[sjjksloji].querySelector('a1').innerText == "")) {
																			arra.push(sjjkslobj[sjjksloji].querySelector('a2').innerText)
																		}
																		if ((sjjkslobj[sjjksloji].style.display != 'none') && (sjjkslobj[sjjksloji].querySelector('a1').innerText.match(/^\s*?[小大]窗\s*?$/))) {
																			arrb.push(sjjkslobj[sjjksloji].querySelector('a2').innerText)
																		}
																	};
																	sessionStorage.setItem('原网页接口数量', JSON.stringify(arra));
																	sessionStorage.setItem('弹窗接口数量', JSON.stringify(arrb));
																} else {}
															} catch (err) {}
															try {
																if (document.querySelector("div#宁小影>iframe#宁小影")) {} else if (document.querySelector("div#宁小影>img#宁小影")) {} else {
																	(function() {
																		try {
																			pausetimer = setInterval(function() {
																				try {
																					if (document.getElementsByTagName("video")[0]) {
																						var v_player = document.getElementsByTagName("video");
																						for (var i = 0, length = v_player.length; i < length; i++) {
																							try {
																								try {
																									v_player[i].paused;
																								} catch (err) {}
																								try {
																									v_player[i].volume = 0;
																								} catch (err) {}
																								try {
																									v_player[i].pause();
																								} catch (err) {}
																								try {
																									v_player[i].innerText = v_player[i];
																									v_player[i].parentNode.innerText = v_player[i].parentNode;
																									v_player[i].parentNode.parentNode.innerText = v_player[i].parentNode.parentNode;
																									v_player[i].parentNode.parentNode.parentNode.innerText = v_player[i].parentNode.parentNode.parentNode;
																								} catch (err) {}
																								try {
																									v_player[i].paused;
																								} catch (err) {}
																								try {
																									v_player[i].volume = 0;
																								} catch (err) {}
																								try {
																									v_player[i].pause();
																								} catch (err) {}
																							} catch (err) {}
																						}
																						clearInterval(pausetimer)
																					} else if (document.getElementsByTagName("object")[0]) {
																						var v_player = document.getElementsByTagName("object");
																						for (var i = 0, length = v_player.length; i < length; i++) {
																							try {
																								v_player[i].parentNode.removeChild(v_player[i])
																							} catch (err) {}
																						}
																						clearInterval(pausetimer)
																					}
																				} catch (err) {}
																			}, 123)
																		} catch (err) {
																			return false
																		}
																	})();
																}
															} catch (err) {
																return false
															}
														} else {
															return false;
														}
													})();
													let arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"], bxjImg = Math.floor(Math.random() * arr.length), jxbimg = atob("aHR0cHM6Ly9jZW8zMC5jb2RpbmcubmV0L3AvcHRwdC9kL3B0L2dpdC9yYXcvbWFzdGVyLw==") + arr[bxjImg] + atob("LmpwZw==");
													var jxbjxurl, jjxxaa, jjxxbb, jjxxcc, jxb;
													jjxxbb = "aHR0cHM6Ly96eS5hb3h0di5jb20vP3VybD0=";
													try {
														jjxxcc = atob(jjxxbb.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, ""));
													} catch (err) {
														jjxxcc = unescape(jjxxbb.replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, ""));
													}
													function jxqzsxobj() {
														if (!document.querySelector("\u5f3a\u5236\u5237\u65b0")) {
															document.body.appendChild(document.createElement("\u5f3a\u5236\u5237\u65b0"));
															let url = window.location.href;
															setInterval(function() {
																let newUrl = window.location.href;
																if (newUrl != url) {
																	url = window.location.href;
																	try {
																		if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																			if (sessionStorage.getItem("原网页接口数量") == null) {} else {
																				sessionStorage.removeItem('原网页接口数量');
																				sessionStorage.removeItem('弹窗接口数量');
																			}
																		} else {}
																	} catch (err) {}
																	location.reload();
																}
															});
														} else {}
													};
													let tctha = '<div id="宁小影" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"><img id="宁小影" src="https://api.btstu.cn/sjbz/" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"></img></div>';
													let tcthb = '<div id="宁小影" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"><img id="宁小影" src="' + jxbimg + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"></img></div>';
													try {
														if (document.querySelector("div#宁小影") != null) {
															zdydssjobj = '123';
														} else {
															zdydssjobj = '3456';
														}
													} catch (err) {
														zdydssjobj = '3456';
													}
													try {
														if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
															try {
																if (!document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111")) {
																	document.body.appendChild(document.createElement("宁小影电脑"));
																} else {} if (document.querySelector('div#宁小影')) {
																	pczdydssjobj = '123';
																} else if (localStorage.getItem("vipzdjx") == '0') {
																	pczdydssjobj = '123';
																} else if (localStorage.getItem("vipzdjx") == '1') {
																	pczdydssjobj = '987';
																} else if (localStorage.getItem("vipzdjx") == '2') {
																	pczdydssjobj = '123';
																}
															} catch (err) {
																pczdydssjobj = '987';
															}
															if (objj.indexOf('youku') > 0) {
																jxbjxurl = obj.replace(/^.+?\/id_([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function pcyoukudszx() {
																	if (document.querySelector('#player')) {
																		vipobj('#player');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('.youku-film-player');
																		cssobj('#ykPlayer,.nav-mamu,[class*="error-layer"],[id*="error-layer"],[class*="preplay-background"],[id*="preplay-background"],[class*="vip_info"],[id*="vip_info"],[class*="vip_limit_box"],[id*="vip_limit_box"]');
																	}
																};
																setTimeout(pcyoukudszx, pczdydssjobj);
															} else if (objj.indexOf('tudou') > 0) {
																jxbjxurl = obj.replace(/^.+?\/v\/([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^.+?\/id_([^\.=]+?)==.*$/, "http://v.youku.com/v_show/id_$1==.html");
																function pctudoudszx() {
																	if (document.querySelector('.td-playbox')) {
																		vipobj('.td-playbox');
																	} else if (document.querySelector('#player')) {
																		vipobj('#player');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		remove('.td-interactbox');
																		cssobj('[class*="error-layer"],[id*="error-layer"],[class*="preplay-background"],[id*="preplay-background"],[class*="vip_info"],[id*="vip_info"],[class*="vip_limit_box"],[id*="vip_limit_box"]');
																	}
																};
																setTimeout(pctudoudszx, pczdydssjobj);
															} else if (objj.indexOf('qq') > 0) {
																if (obj.indexOf('/x/cover/') > 0) {
																	jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																} else if (obj.indexOf('/variety/p/topic/') > 0) {
																	jxbjxurl = document.querySelector(".current .figure_title").offsetParent.href.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																	if (!document.querySelector("影宁")) {
																		document.body.appendChild(document.createElement("影宁"));
																		(function() {
																			try {
																				let aElement = document.querySelectorAll('[_wind*="列表"] ul li a[href*="/x/"][target]');
																				for (let i = 0; i < aElement.length; i++) {
																					aElement[i].getAttributeNode('target').value = "_top"
																				}
																			} catch (err) {
																				return false
																			}
																		})();
																	}
																}
																function pcqqdszx() {
																	if (document.querySelector('#mod_player')) {
																		vipobj('#mod_player');
																	} else {} if (!document.querySelector("小宁")) {
																		document.body.appendChild(document.createElement("小宁"));
																		ggobj('#dark_layer');
																		ggallobj('div[class*="_vip_popup"]');
																		remove('txpdiv,[class*="poplay"],[id*="poplay"],[class^="x_"],[id^="x_"],[class^="mod_action "],[id^="mod_action "],[class*="_vip_popup"],[class*="_vip_popup"],[id*="_vip_popup"],script[crossorigin="anonymous"],[_r-component="player"],[_r-component="c-popups"]');
																		cssobj('.mod_player_section.cf{background-color:transparent}.mod_vip_popup.wrapper,.cf.mod_action,[data-role^="txp-"][data-role*="-error"],[class*="mod_vip_popup"],[id*="mod_vip_popup"]');
																	}
																};
																setTimeout(pcqqdszx, pczdydssjobj);
															} else if (objj.indexOf('mgtv') > 0) {
																if (obj.indexOf('mgtv.com/b/') > 0) {
																	jxbjxurl = obj.replace(/^.+?\/b\/(.+?)\.html.*$/, "http://www.mgtv.com/b/$1.html");
																	if (document.querySelector('#mgtv-player-wrap')) {
																		vipobj('#mgtv-player-wrap');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('#mgtv-player-wrap container');
																		cssobj('outer-bottom,container,[class*="player"][class*="paytips"],[id*="player"][id*="paytips"]');
																	}
																} else if (obj.indexOf('mgtv.com/act/') > 0) {
																	function pcmgtvdszx() {
																		try {
																			jxbjxurl = document.querySelector('li[class^="play-item is-full is-"][class$=" on"]').getAttribute("data-vurl").replace(/^.*?\/b\/(.+?)\.html.*$/ig, "http://www.mgtv.com/b/$1.html");
																			vipobj('.c-player-video');
																		} catch (err) {}
																	};
																	pcmgtvdszx();
																	if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		remove('[class^="frag-list-box"]');
																	}
																	if (!document.querySelector("#宁小影") && document.querySelector("ul.v-lists")) {
																		let qisdjxa = document.querySelector("ul.v-lists");
																		qisdjxa.onclick = function(e) {
																			setTimeout(pcmgtvdszx, pczdydssjobj);
																		};
																	} else {}
																}
															} else if (objj.indexOf('iqiyi') > 0) {
																jxbjxurl = obj.replace(/^https?:\/\/(?:t|ww)w\./, "http://www.").replace(/html[\W_].*?$/, "html");
																function pciqiyidszx() {
																	if (document.querySelector('#flashbox')) {
																		vipobj('#flashbox');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("小宁"));
																		ggobj('#secondFrame');
																		remove('div#scrollTip,.qy-glide,#qy-glide,[class^="qy-glide"],[id^="qy-glide"],svg[display="none"][aria-hidden="true"],div[class*="player-side-ear"],div[class^="player-mnb"][data-asyn-pb]');
																		cssobj('[class*="player-vippay-popup"],div[style*="visibility"][style*="visible"]:not([class]):not([id]):not([style*="fixed"]),div[class*="player-side-ear"],div[class^="player-mnb"][data-asyn-pb],[class*="player"][class*="vip"][class*="popup"],[id*="player"][id*="vip"][id*="popup"]');
																	}
																};
																setTimeout(pciqiyidszx, pczdydssjobj);
																if (obj.indexOf('iqiyi.com/v_') > 0) {
																	if (!document.querySelector("影宁")) {
																		document.body.appendChild(document.createElement("影宁"));
																		(function() {
																			$("body").on('mouseover', 'ul li [href*="/v_"][href*=".html"]:not([href*="=http"]):not([href*="?http"]):not([href*="#http"])', function(e) {
																				let jxbzqxjobj = $(this), href = jxbzqxjobj.attr('href') || jxbzqxjobj.data("href");
																				jxbzqxjobj.off('click.chrome');
																				jxbzqxjobj.on('click.chrome', function() {
																					window.location.href = href
																				}).attr('data-href', href).css({
																					cursor: 'pointer'
																				}).removeAttr('href')
																			})
																		})();
																		try {
																			setTimeout(function() {
																				(document.querySelector('a[href="javascript:void(0)"][rseat$="_listbox_positive"][class="select-link"]:not([data-href])').innerText == '更多') && (document.querySelector('a[href="javascript:void(0)"][rseat$="_listbox_positive"][class="select-link"]:not([data-href])').parentNode.remove())
																			}, 6666);
																		} catch (err) {}
																	}
																} else if (obj.indexOf('iqiyi.com/a_') > 0 || obj.indexOf('iqiyi.com/kszt/') > 0) {
																	if (!document.querySelector("小宁")) {
																		document.body.appendChild(document.createElement("小宁"));
																		try {
																			cssobj('div.lequPlayer{height:' + document.querySelector("div.play-dianbo").offsetHeight + 'px!important;width:' + document.querySelector("div.play-dianbo").offsetWidth + 'px!important;}');
																		} catch (err) {}
																		remove('div[class*="-list-box"][class*="-lianboList"],div[class$="-side-icon"],div[id*="scrollBox"],div[class*="tem_voteEnter"]');
																	}
																} else {}
															} else if (obj.indexOf('tv.sohu.com/v/') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function pcsohuadszx() {
																	if (document.querySelector('#player')) {
																		vipobj('#player');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		cssobj('#player_vipTips,#toolBar,[class*="player"][class*="vipTips"],[id*="player"][id*="vipTips"]');
																	}
																};
																setTimeout(pcsohuadszx, pczdydssjobj);
															} else if (obj.indexOf('film.sohu.com/album/') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function pcsohubdszx() {
																	if (document.querySelector('#playerWrap')) {
																		vipobj('#playerWrap');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('#detail_btn_play');
																		remove('.player-content-bg,.pop-operates');
																		cssobj('[class*="play-end-pop],[id*="play-end-pop],[class*="player-bg"],[id*="player-bg"],[class*="play-end-overlay"],[id*="play-end-overlay"]');
																	}
																};
																setTimeout(pcsohubdszx, pczdydssjobj);
															} else if (objj.indexOf('.le') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function pcledszx() {
																	if (document.querySelector('#fla_box')) {
																		vipobj('#fla_box');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		cssobj('[class*="play"][class*="box"][class*="vipTip"],[id*="play"][id*="box"][id*="vipTip"]');
																	}
																};
																setTimeout(pcledszx, pczdydssjobj);
															} else if (objj.indexOf('pptv') > 0) {
																jxbjxurl = obj.replace(/^https?:\/\//, "http://").replace(/\.html\?.+$/, ".html");
																function pcpptvdszx() {
																	if (document.querySelector('#pptv_playpage_box')) {
																		vipobj('#pptv_playpage_box');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('.sidebarbtn');
																		cssobj('div[class^="module-video"][class*="-ops"],[class*="tryOver"]>iframe,[id*="tryOver"]>iframe');
																	}
																};
																setTimeout(pcpptvdszx, pczdydssjobj);
															} else if (objj.indexOf('1905.com') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function pcyjlwdszx() {
																	if (document.querySelector('#playBox')) {
																		vipobj('#playBox');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('object');
																		remove('.sc-content,.sc-paper,.sc-error');
																		cssobj('.player-widget,[class^="sc-content clearfix"],[id^="sc-content clearfix"]');
																	}
																};
																setTimeout(pcyjlwdszx, zdydssjobj);
															} else if (objj.indexOf('bilibili') > 0) {
																jxbjxurl = obj.replace(/^.+?\/(\w+)\/\?.*$/, "http://www.bilibili.com/bangumi/play/$1").replace(/\?spm_id_.*?$/, "");
																function pcbilibilidszx() {
																	if (document.querySelector('#player_module')) {
																		vipobj('#player_module');
																	} else {} if (!document.querySelector("影小宁")) {
																		document.body.appendChild(document.createElement("影小宁"));
																		ggobj('#player_mask_module');
																		cssobj('[class^="player_mask"],[id^="player_mask"]');
																	}
																};
																setTimeout(pcbilibilidszx, pczdydssjobj);
															} else if (objj.indexOf('acfun.cn') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://");
																if (document.querySelector('#player')) {
																	vipobj('#player');
																} else {}
															} else {
																jxbjxurl = obj.replace(/^https:\/\//, "http://");
																vipobj('万能元素');
															}
														} else {
															try {
																if (document.querySelector('div#宁小影')) {
																	sjzdydssjobj = '123';
																} else if (localStorage.getItem("vipzdjx") == '0') {
																	sjzdydssjobj = '123';
																} else if (localStorage.getItem("vipzdjx") == '1' || localStorage.getItem("vipzdjx") == '2') {
																	sjzdydssjobj = '1234';
																}
															} catch (err) {
																sjzdydssjobj = '1234';
															}
															if (objj.indexOf('youku') > 0) {
																jxbjxurl = obj.replace(/^.+?\/id_([^\.=]+?)=?=.*$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^.+?\/id_([^\?]{1,})=?=?(\?.*)?$/, "http://v.youku.com/v_show/id_$1==.html").replace(/^https:\/\//, "http://").replace(/html[\W_].*?$/, "html");
																function sjyoukudszx() {
																	if (document.querySelector('#player')) {
																		vipobj('#player');
																	} else {}
																};
																setTimeout(sjyoukudszx, sjzdydssjobj);
															} else if (objj.indexOf('mgtv') > 0) {
																jxbjxurl = obj.replace(/^.+?\/b\/(.+?)\.html.*$/, "http://www.mgtv.com/b/$1.html");
																function sjmgtvdszx() {
																	if (document.querySelector('.video-area')) {
																		vipobj('.video-area');
																	} else {}
																}; if (localStorage.getItem("vipzdjx") != '2') {
																	setTimeout(sjmgtvdszx, sjzdydssjobj);
																} else {
																	setTimeout(function() {
																		setTimeout(sjmgtvdszx, sjzdydssjobj);
																	}, sjzdydssjobj);
																}
															} else if (objj.indexOf('pptv') > 0) {
																jxbjxurl = obj.replace(/^https?:\/\/m\./, "http://v.").replace(/\.html\?.+$/, ".html");
																function sjpptvdszx() {
																	if (document.querySelector('#playerbox')) {
																		vipobj('#playerbox');
																	} else if (document.querySelector('section[class*="mod_box"][class*="video"]')) {
																		vipobj('section[class*="mod_box"][class*="video"]');
																	} else {}
																};
																setTimeout(sjpptvdszx, sjzdydssjobj);
															} else if (objj.indexOf('1905.com') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/\.shtml\?.+$/, ".shtml");
																function sjyjlwdszx() {
																	if (document.querySelector('#player')) {
																		vipobj('#player');
																	} else {}
																};
																setTimeout(sjyjlwdszx, sjzdydssjobj);
															} else if (obj.indexOf('tv.sohu.com') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/^.+?vid=(\w+).*$/, "http://m.tv.sohu.com/v$1.shtml").replace(/\.shtml\?.*$/, ".shtml");
																function sjsohudszx() {
																	if (document.querySelector('.player')) {
																		vipobj('.player');
																	} else {}
																};
																setTimeout(sjsohudszx, sjzdydssjobj);
															} else if (objj.indexOf('.le') > 0) {
																jxbjxurl = obj.replace(/^.+?\/vplay_(.+?)\.html.*$/, "http://www.le.com/ptv/vplay/$1.html");
																function sjledszx() {
																	if (!document.querySelector("影宁")) {
																		document.body.appendChild(document.createElement("影宁"));
																		try {
																			cssobj('section.column.playB{height:' + document.querySelector('section.column.playB').offsetHeight + 'px!important;}963540817');
																		} catch (err) {}
																	}
																	if (document.querySelector('section.column.playB')) {
																		vipobj('section.column.playB');
																	} else {}
																};
																setTimeout(sjledszx, sjzdydssjobj);
															} else if (objj.indexOf('iqiyi') > 0) {
																jxbjxurl = obj.replace(/^.+?\/v_(.+?)\.html.*$/, "http://www.iqiyi.com\/v_$1.html");
																function sjiqiyidszx() {
																	if (document.querySelector('div[time*=":"][class="m-box"]>div[style]:not([class]):not([id])')) {
																		if (document.querySelector('.m-box-items.m-box-items-full')) {
																			vipobj('.m-box-items.m-box-items-full');
																		} else {} if (!document.querySelector("影宁")) {
																			document.body.appendChild(document.createElement("影宁"));
																			remove('div[class="m-box"]:not([total-pages])');
																		}
																	} else if (document.querySelector('.m-video-player')) {
																		vipobj('.m-video-player');
																	} else {} if (!document.querySelector("小宁")) {
																		document.body.appendChild(document.createElement("小宁"));
																		cssobj('[name="m-videoInfo"]{margin-top:7.5%;}.m-video-player{background:black!important;}.m-video-player-wrap{top:-202px!important}963540817');
																		remove('[id*="open_app_iframe"],[style*="hidden"][style*="absolute"]');
																	}
																};
																setTimeout(sjiqiyidszx, sjzdydssjobj);
															} else if (objj.indexOf('qq.com') > 0) {
																function sjqqdszx() {
																	try {
																		if (document.querySelector('h2[class^="mod_title"]').innerText.match(/^\s*?(?:剧集|看点)\s*?$/g)) {
																			if (document.querySelector('div#player')) {
																				vipobj('div#player');
																			} else {
																				try {
																					if (!document.querySelector("影宁")) {
																						document.body.appendChild(document.createElement("影宁"));
																						cssobj('section.mod_player{height:' + document.querySelector('section[class="mod_player"]').offsetHeight + 'px!important;}963540817');
																					}
																				} catch (err) {}
																				if (document.querySelector('section.mod_player')) {
																					vipobj('section.mod_player');
																				} else if (document.querySelector('[data-modid="player"]')) {
																					vipobj('[data-modid="player"]');
																				} else if (document.querySelector('[dt-params*="主视频"][dt-params*="播放"]')) {
																					vipobj('[dt-params*="主视频"][dt-params*="播放"]');
																				} else {}
																			}
																		} else {
																			try {
																				if (!document.querySelector("小宁")) {
																					document.body.appendChild(document.createElement("小宁"));
																					cssobj('section.mod_player{height:' + document.querySelector('div#player').offsetHeight + 'px!important;}963540817');
																				}
																			} catch (err) {}
																			if (document.querySelector('section.mod_player')) {
																				vipobj('section.mod_player');
																			} else if (document.querySelector('[data-modid="player"]')) {
																				vipobj('[data-modid="player"]');
																			} else {
																				vipobj('[dt-params*="主视频"][dt-params*="播放"]');
																			}
																		}
																	} catch (err) {}
																};
																if (obj.match(/[cv]id=/)) {
																	jxbjxurl = obj.replace(/^.+?cid=(\w+)(?:&vid=)?$/, "http://v.qq.com/x/cover/$1.html").replace(/^.+?cid=(\w+)&vid=(\w+).*$/, "http://v.qq.com/x/cover/$1/$2.html").replace(/^.+?\/(?![^\/]+?cid=)([^\/]+?)\.html\?vid=(\w+)$/, "http://v.qq.com/x/cover/$1/$2.html");
																	setTimeout(sjqqdszx, sjzdydssjobj);
																} else if (obj.match(/^https?:\/\/(?!.+?[cv]id=).{1,}\/\d+?\/[a-z0-9]+?\/[a-z0-9]+?\.html/)) {
																	jxbjxurl = obj.replace(/^https?:\/\/(?!.+?[cv]id=).{1,}\/\d+?\/([a-z0-9]+?\/[a-z0-9]+?)\.html.*$/, "http://v.qq.com/x/cover/$1.html");
																	setTimeout(sjqqdszx, sjzdydssjobj);
																} else {
																	jxbjxurl = obj.replace(/^https?:\/\/(?!.+?[cv]id=).{1,}\/(\w+?)\.html.*$/, "http://v.qq.com/x/cover/$1.html");
																	setTimeout(sjqqdszx, sjzdydssjobj);
																}
																if (!document.querySelector("小影宁")) {
																	document.body.appendChild(document.createElement("小影宁"));
																	cssobj('.site_player_inner,#vipPosterContent');
																}
															} else if (objj.indexOf('bilibili') > 0) {
																jxbjxurl = obj.replace(/^https?:\/\/m\.bilibili\.com\/bangumi\/play\/(\w*).*$/, "http://www.bilibili.com/bangumi/play/$1");
																function sjbilibilidszx() {
																	if (document.querySelector('div.player-mask.relative')) {
																		vipobj('div.player-mask.relative');
																		if (!document.querySelector("影宁")) {
																			document.body.appendChild(document.createElement("影宁"));
																			remove('div#bofqi');
																			cssobj('.player-mask img{-webkit-transform:none!important;-ms-transform:inherit!important;transform:none!important;-webkit-filter:none!important;filter:none!important;}963540817');
																		}
																	} else if (document.querySelector('div.player-wrapper')) {
																		try {
																			if (!document.querySelector("小宁")) {
																				document.body.appendChild(document.createElement("小宁"));
																				cssobj('div.player-wrapper{height:' + document.querySelector("div.player-wrapper").offsetHeight + 'px!important;}963540817');
																			}
																		} catch (err) {}
																		vipobj('div.player-wrapper');
																	} else {}
																};
																setTimeout(sjbilibilidszx, sjzdydssjobj);
															} else if (objj.indexOf('acfun.cn') > 0) {
																jxbjxurl = obj.replace(/^https:\/\//, "http://").replace(/^.+?\/v\/\?\w+?=(\d+)(?:&.*)?$/, "http://www.acfun.cn/bangumi/aa$1").replace(/^.+?\/v\/\?\w+?=(\d+?)_(\d+)(?:&.*)?$/, "http://www.acfun.cn/bangumi/aa$1_0_$2");
																if (document.querySelector('#mPlayer')) {
																	vipobj('#mPlayer');
																} else {}
															} else {
																jxbjxurl = obj.replace(/^https:\/\//, "http://");
																vipobj('万能元素');
															}
														}
													} catch (err) {}
													function vipobj(vip) {
														try {
															if (document.querySelector("div#宁小影") != null) {
																if (document.querySelector("img#宁小影") != null) {} else {
																	document.querySelector("div#宁小影").remove();
																}
															} else {
																document.querySelector(vip).innerHTML = document.querySelector(vip);
															}
														} catch (err) {}
														try {
															if (objj.match(/qq\./) && https[num].name.match(/(?:思古)/) && localStorage.getItem("vipzdjx") != null) {
																try {
																	jjxxaa = jjxxcc + atob(https[num].url) + jxbjxurl + https[num].vip;
																} catch (err) {
																	jjxxaa = jjxxcc + unescape(https[num].url) + jxbjxurl + https[num].vip;
																}
															} else if (objj.match('acfun') || (pcliwaiobj && localStorage.getItem("jxywyfsgbobj") != null & !(sessionStorage.getItem("jxywygdfsgbobj") == '1'))) {
																if (https[num].name.match(/(?:乐多|久播|920|IK)/i) && !https[num].name.match(/强制(?:弹[小大]窗|跳转)/)) {
																	try {
																		jjxxaa = jjxxcc + atob(https[num].url) + jxbjxurl + https[num].vip;
																	} catch (err) {
																		jjxxaa = jjxxcc + unescape(https[num].url) + jxbjxurl + https[num].vip;
																	}
																} else {
																	try {
																		jjxxaa = atob(https[num].url) + jxbjxurl + https[num].vip;
																	} catch (err) {
																		jjxxaa = unescape(https[num].url) + jxbjxurl + https[num].vip;
																	}
																}
															} else {
																try {
																	jjxxaa = atob(https[num].url) + jxbjxurl + https[num].vip;
																} catch (err) {
																	jjxxaa = unescape(https[num].url) + jxbjxurl + https[num].vip;
																}
															}
															jxb = jjxxaa.replace(/^(.+?)undefined\s*?$/img, "$1").replace(/^[^:\/]*?(https?:\/\/)/igm, "$1").replace(/%20/gm, "").replace(/\s{1,}/gm, "");
															setTimeout(function() {
																function tcthaobj() {
																	if (document.querySelector("img#宁小影") != null) {} else {
																		if (document.querySelector(vip)) {
																			document.querySelector(vip).innerHTML = tctha;
																		} else {}
																	}
																}; if (jxb.match(new RegExp("^https:\/\/(?!.+?强制(?:弹[小大]窗|跳转))")) && !jxb.match(new RegExp("(?:透明无接口|布米米|视频选集|米侠|Youtube|麻花影视|旋风视频|555电影|古云搜索)"))) {
																	if (objj.match('acfun') || (pcliwaiobj && localStorage.getItem("jxywyfsgbobj") != null & !(sessionStorage.getItem("jxywygdfsgbobj") == '1'))) {
																		if (objj.match('acfun') || localStorage.getItem("jxywyfsgbobj") == '1') {
																			tcthaobj();
																			window.open(jxb, "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=" + (screen.availWidth - screen.availWidth * 0.0066) + ",height=" + (screen.availHeight - 55));
																		} else if (localStorage.getItem("jxywyfsgbobj") == '2') {
																			tcthaobj();
																			window.open(jxb, "bkmk_popup");
																		} else if (localStorage.getItem("jxywyfsgbobj") == '3') {
																			tcthaobj();
																			window.open(jxb, "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
																		}
																	} else {
																		try {
																			sessionStorage.removeItem('jxywygdfsgbobj');
																			sessionStorage.removeItem('jxyxkdfsgbobj');
																		} catch (err) {}
																		if (document.querySelector(vip)) {
																			document.querySelector(vip).innerHTML = '<div id="宁小影" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;background-color:black;display:flex;justify-content:center;align-items:center;flex-direction:column;font-size:20px;"><div style="letter-spacing:2px;color:#f8964c;display:flex;justify-content:space-evenly;align-items:center;width:100%;max-width:50%;"><strong>\u5b81</strong><strong>\u5c0f</strong><strong>\u5f71</strong></div><iframe id="宁小影" data-ad="false" autoLoad="true" autoplay="autoplay" loading="lazy" allowtransparency="true" frameborder="0" scrolling="no" security="restricted" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen" src="' + jxb + '" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"></iframe></div>';
																		} else {
																			window.open(jxb, "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
																		}
																	}
																	jxqzsxobj();
																} else {
																	function tcthbobj() {
																		if (document.querySelector("img#宁小影") != null) {} else {
																			if (document.querySelector(vip)) {
																				document.querySelector(vip).innerHTML = tcthb;
																			} else {}
																			jxqzsxobj();
																		}
																	};
																	if (jxb.match(new RegExp("透明无接口"))) {
																		try {
																			jkpddjobj();
																			jxqzsxobj();
																		} catch (err) {
																			if (document.querySelector(vip)) {
																				document.querySelector(vip).innerHTML = '<div id="宁小影" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;"><img id="宁小影" src="https://ceo30.coding.net/p/ceo30/d/sjtp/git/raw/master/1.png" marginwidth="0" marginheight="0" width="100%" height="100%" style="width:100%;height:100%;border:none;outline:none;margin:0;padding:0;position:absolute;z-index:963540817;" onclick="document.getElementById(\'jxbhttps\').click();"></img></div>';
																				jxqzsxobj();
																			} else {}
																		}
																	} else if (jxb.match(new RegExp("布米米"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("布米米")) {
																					document.body.appendChild(document.createElement("布米米"));
																					maomizdjxaobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]') != null) {
																							try {
																								if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																									try {
																										if (document.title.match(/第\s*?\d+?\s*?集/)) {
																											jishu = document.title.replace(/^.+?第\d*?(\d+?)\s*?集/, "$1");
																										} else {}
																									} catch (err) {}
																									try {
																										if (jishu.match(/^\s*?\d+?\s*?$/)) {
																											try {
																												GM_setValue('集数', jishu);
																											} catch (err) {}
																										} else {}
																									} catch (err) {}
																								} else {}
																							} catch (err) {}
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]').href, "_blank");
																							} catch (err) {}
																							document.querySelector("布米米").remove();
																							clearInterval(maomizdjxaobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxaobj);
																						document.querySelector("布米米").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("视频选集"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("视频选集")) {
																					document.body.appendChild(document.createElement("视频选集"));
																					maomizdjxbobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="://www.wbdy.tv"]') != null) {
																							try {
																								if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																									try {
																										if (document.title.match(/第\s*?\d+?\s*?集/)) {
																											jishu = document.title.replace(/^.+?第\d*?(\d+?)\s*?集/, "$1");
																										} else {}
																									} catch (err) {}
																									try {
																										if (jishu.match(/^\s*?\d+?\s*?$/)) {
																											try {
																												GM_setValue('集数', jishu);
																											} catch (err) {}
																											try {
																												GM_setValue('视频自动全屏', '开启');
																											} catch (err) {}
																										} else {}
																									} catch (err) {}
																								} else {}
																							} catch (err) {}
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="://www.wbdy.tv"]').href, "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=" + (screen.availWidth - screen.availWidth * 0.0066) + ",height=" + (screen.availHeight - 55));
																							} catch (err) {}
																							document.querySelector("视频选集").remove();
																							clearInterval(maomizdjxbobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxbobj);
																						document.querySelector("视频选集").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("Youtube"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("Youtube")) {
																					document.body.appendChild(document.createElement("Youtube"));
																					maomizdjxcobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.youtube.com"]') != null) {
																							try {
																								if (document.title.match(/第\s*?\d+?\s*?[集话]/) != null) {
																									window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.youtube.com"]').href + '+' + document.title.match(/第\s*?\d+?\s*?[集话]/), "_blank");
																								} else if (document.title.match(/第\s*?\d+?\s*?期/) != null) {
																									window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.youtube.com"]').href + '+' + document.title.match(/第\s*?\d+?\s*?期/) + "&sp=EgIYAg%253D%253D", "_blank");
																								} else {
																									window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.youtube."]').href, "_blank");
																								}
																							} catch (err) {}
																							document.querySelector("Youtube").remove();
																							clearInterval(maomizdjxcobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxcobj);
																						document.querySelector("Youtube").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("麻花影视"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("麻花影视")) {
																					document.body.appendChild(document.createElement("麻花影视"));
																					maomizdjxeobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.jiaomh.com"]') != null) {
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.jiaomh.com"]').href, "_blank");
																							} catch (err) {}
																							document.querySelector("麻花影视").remove();
																							clearInterval(maomizdjxeobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxeobj);
																						document.querySelector("麻花影视").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("旋风视频"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("旋风视频")) {
																					document.body.appendChild(document.createElement("旋风视频"));
																					maomizdjxfobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//miao101.com"]') != null) {
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//miao101.com"]').href, "_blank");
																							} catch (err) {}
																							document.querySelector("旋风视频").remove();
																							clearInterval(maomizdjxfobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxfobj);
																						document.querySelector("旋风视频").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("555电影"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("唔唔电影")) {
																					document.body.appendChild(document.createElement("唔唔电影"));
																					maomizdjxgobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.555dy6.com"]') != null) {
																							try {
																								if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																									try {
																										if (document.title.match(/第\s*?\d+?\s*?集/)) {
																											jishu = document.title.replace(/^.+?第\d*?(\d+?)\s*?集/, "$1");
																										} else {}
																									} catch (err) {}
																									try {
																										if (jishu.match(/^\s*?\d+?\s*?$/)) {
																											try {
																												GM_setValue('集数', jishu);
																											} catch (err) {}
																										} else {}
																									} catch (err) {}
																								} else {}
																							} catch (err) {}
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.555dy6.com"]').href, "_blank");
																							} catch (err) {}
																							document.querySelector("唔唔电影").remove();
																							clearInterval(maomizdjxgobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxgobj);
																						document.querySelector("唔唔电影").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("古云搜索"))) {
																		tcthbobj();
																		(function() {
																			try {
																				if (!document.querySelector("古云搜索")) {
																					document.body.appendChild(document.createElement("古云搜索"));
																					maomizdjxhobj = setInterval(function() {
																						if (document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//pgso.cnjsjf.com"]') != null) {
																							try {
																								if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
																									try {
																										if (document.title.match(/第\s*?\d+?\s*?集/)) {
																											jishu = document.title.replace(/^.+?第\d*?(\d+?)\s*?集/, "$1");
																										} else {}
																									} catch (err) {}
																									try {
																										if (jishu.match(/^\s*?\d+?\s*?$/)) {
																											try {
																												GM_setValue('集数', jishu);
																											} catch (err) {}
																										} else {}
																									} catch (err) {}
																								} else {}
																							} catch (err) {}
																							try {
																								window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//pgso.cnjsjf.com"]').href, "_blank");
																							} catch (err) {}
																							document.querySelector("古云搜索").remove();
																							clearInterval(maomizdjxhobj);
																						} else {}
																					}, 123);
																				} else {
																					try {
																						clearInterval(maomizdjxhobj);
																						document.querySelector("古云搜索").remove();
																					} catch (err) {
																						return false;
																					}
																				}
																			} catch (err) {
																				return false;
																			}
																		})();
																	} else if (jxb.match(new RegExp("(?:米侠|嗅探)"))) {
																		tcthbobj();
																		setTimeout(function() {
																			try {
																				window.mx_browser_obj.showSniff();
																			} catch (err) {
																				try {
																					jkpddjobj();
																				} catch (err) {
																					document.querySelector("#httpsvipul>li:nth-child(1)").click();
																				}
																			}
																		}, 1234);
																	} else {
																		if (jxb.match(new RegExp("^https?:\/\/.+?强制跳转"))) {
																			tcthbobj();
																			window.open(jxb.replace(/强制跳转.*?$/, ""), "bkmk_popup");
																		} else if (jxb.match(new RegExp("^https?:\/\/.+?强制弹大窗"))) {
																			tcthbobj();
																			window.open(jxb.replace(/强制弹大窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=" + (screen.availWidth - screen.availWidth * 0.0066) + ",height=" + (screen.availHeight - 55));
																		} else if (jxb.match(new RegExp("^https?:\/\/(?:.+?强制弹小窗)?"))) {
																			if (sessionStorage.getItem("jxyxkdfsgbobj") == '1') {
																				try {
																					sessionStorage.removeItem('jxywygdfsgbobj');
																					sessionStorage.removeItem('jxyxkdfsgbobj');
																				} catch (err) {}
																				tcthbobj();
																				window.open(jxb.replace(/强制弹小窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
																			} else if (localStorage.getItem("jxcxkfsgbobj") == '1') {
																				tcthaobj();
																				window.open(jxb.replace(/强制弹小窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=" + (screen.availWidth - screen.availWidth * 0.0066) + ",height=" + (screen.availHeight - 55));
																			} else if (localStorage.getItem("jxcxkfsgbobj") == '2') {
																				tcthaobj();
																				window.open(jxb.replace(/强制弹小窗.*?$/, ""), "bkmk_popup");
																			} else {
																				tcthbobj();
																				window.open(jxb.replace(/强制弹小窗.*?$/, ""), "bkmk_popup", "allowfullscreen=true,allowfullscreen=allowfullscreen,esizable=1,scrollbars=1,toolbar=0,status=0,width=1050,height=600,left=" + (screen.availWidth - 1050) / 2 + ",top=" + (screen.availHeight - 600) / 2);
																			}
																		}
																	}
																}
																try {
																	sessionStorage.removeItem('jxywygdfsgbobj');
																	sessionStorage.removeItem('jxyxkdfsgbobj');
																} catch (err) {}
																try {
																	window.scrollTo(0, document.querySelector("div#宁小影").offsetTop);
																} catch (err) {}
															}, 123);
														} catch (err) {}
														if (localStorage.getItem("pcjkzdyj") == '0') {} else {
															if (!document.querySelector("\u6211\u662f\u5b81\u5c0f\u5f71")) {
																document.body.appendChild(document.createElement("我是宁小影"));
																(function() {
																	try {
																		let zdjkhttpsjk_counter = 0;
																		let zdjkhttpsjk_jiankong = setInterval(function() {
																			let zdjkhttpsjk_btn = document.querySelector("ul#httpsvipul>li:last-of-type");
																			if (zdjkhttpsjk_btn) {
																				try {
																					$('ul#httpsvipul>li').click(function() {
																						if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
																							let httpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
																							if (obj.match(/^https?:\/\/m\.acfun\.cn\/v\//)) {
																								if (document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																									localStorage.setItem("httpsjk", httpsjksz)
																								} else {}
																							} else {
																								if (!document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																									if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
																										if (localStorage.getItem("pcjkzdyj") == '1') {
																											localStorage.setItem("httpsjk", httpsjksz);
																										} else {}
																									} else {
																										localStorage.setItem("httpsjk", httpsjksz);
																									}
																								} else {}
																							}
																						}
																					})
																				} catch (err) {
																					return false
																				}
																				clearInterval(zdjkhttpsjk_jiankong);
																				return false
																			}++zdjkhttpsjk_counter;
																			if (zdjkhttpsjk_counter > 20) {
																				clearInterval(zdjkhttpsjk_jiankong);
																				return false
																			}
																		}, 500)
																	} catch (err) {}
																})();
															} else {}
														} if (localStorage.getItem("jxzdqp") == '1') {
															setTimeout(function() {
																try {
																	if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
																		try {
																			if (document.querySelector("img#宁小影") && !jxb.match(new RegExp("视频选集"))) {
																				try {
																					GM_setValue('视频自动全屏', '关闭');
																				} catch (err) {}
																			} else if (document.querySelector("iframe#宁小影") && GM_getValue('视频自动全屏').match(/^\s*?开启\s*?$/) && !GM_getValue('视频自动全屏').match(/^\s*?关闭\s*?$/) && !jxb.match(new RegExp("视频选集"))) {
																				try {
																					qpobj(document.querySelector('iframe#宁小影'));
																					setTimeout(function() {
																						qpobj(document.querySelector('iframe#宁小影'));
																					}, 1234);
																					setTimeout(function() {
																						qpobj(document.querySelector('iframe#宁小影'));
																					}, 1680);
																					pcspzdqpaobj = setInterval(function() {
																						if (document.querySelector("iframe#宁小影").offsetWidth == document.body.offsetWidth) {
																							clearInterval(pcspzdqpaobj);
																						} else {
																							qpobj(document.querySelector('iframe#宁小影'));
																						}
																					});
																					pcspzdqpbobj = setInterval(function() {
																						if (document.querySelector("iframe#宁小影").offsetWidth == document.body.offsetWidth) {
																							clearInterval(pcspzdqpbobj);
																						} else {
																							qpobj(document.querySelector('iframe#宁小影'));
																						}
																					}, 1234);
																					pcspzdqpcobj = setInterval(function() {
																						if (document.querySelector("iframe#宁小影").offsetWidth == document.body.offsetWidth) {
																							clearInterval(pcspzdqpcobj);
																						} else {
																							qpobj(document.querySelector('iframe#宁小影'));
																						}
																					}, 1680);
																				} catch (e) {}
																				try {
																					GM_setValue('视频自动全屏', '关闭');
																				} catch (err) {}
																			} else {}
																		} catch (err) {}
																	} else {}
																} catch (err) {}
															}, 1680);
														} else {} if ((document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) && (localStorage.getItem("vipvideotg") == '1') && (localStorage.getItem("vipzdjx") != '1')) {
															try {
																document.querySelector("jxqspggtg").click();
															} catch (err) {}
														} else {}
													};
												} catch (err) {}
											};
										})(i);
										httpsvipli.innerHTML = https[i].name;
										httpsvipul.appendChild(httpsvipli)
									};
									document.body.appendChild(httpsvipul)
								};
								if (jxbpcobj) {
									function createMenuhttps() {
										let jxbhttps = document.createElement("div");
										jxbhttps.id = "jxbhttps";
										jxbhttps.title = "点击 此按钮 弹出 解析接口 选择";
										jxbhttps.setAttribute('style', 'top:135px;left:25px;zoom:0.6!important;font-size:15px;width:35px;height:35px;line-height:35px;text-align:center;background-size:100% 100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADyUlEQVRYhc2UbWhbVRjHf7dpZzXGBemmU2FtM1uEZssoOOhmXbsXXLPVidqydTiZzQfpGPhlH2T95GKKzDGwijgdTJlbohXUdU5aypbqHDIYKih1rg4VphtoJY1U23L8cM7NufcmWe6tRX3gcF7+z3Oe33nOuRf+R3YIuAAI4DfgA+BupTUAo0oTauycrwaOAuOWdau+B1hyo+TOIEFoi+CZMYFh5GtzaIZhTKjD5NkFQHx5GZERiJ8nVZCvUhB9WQAifkBqGYHY2yt1c95/WCcZ/0Wvm23oEx0D/F6oEocA8WZKB8V6LFVAbmJqofriAM7k1paDMBacNBOXyW7hVYD3BzTRiogaXBkCIKzm5z+Fy2PFblLb0dchYEB0HWSzcm3Hk0r0L41ya+fjEsDf9hCJiT58lQwktXPj/cp5dopYD/j9cvr5+dLJrZYegXePy3FNrVqcvAQdz6ao6tpexr7BjwCo3gDAZ6PSp2E5hOrlOFcN4MhhbwAAty0sIrTvPVaWm6zcJgHOaf3RDtk3t8rebfmtFuuBjW06HoBgOKdrgJr1ALzwnA5uCMsqmKXzUv6d3ZARcLBfXl82C6++pMR7owUAAovgriYbaaQRWtfrTT8+5R7AtOvXYPg0dLTDQBII1EN4WwEAgJVdgD5pTa2+/+/H5YOiKoIbM7+C2jvgkU1m7Cpo67f52QHq5HGtJ93ZLfv0iFoItbgCyFnFIli6GdbEof018C8uAjALLK6DqgjpEXliq6XUp0Sk0xtAw3ZYF4e6zXJu2GUNUKl6dcLciXGUv3qVNwCnCeCWcgvA/i1dNgd1wt0xeYcBA5aH7HDmYzX13TEdnre2pNEO4C+HP2bk+MMX9/iY/vYrzgxfpHWXfJrBe2DZJrj6NWR+lI5VEflytx6U8+rV8MNFrQfD0HoArn8HU9fsa3eu0MmDFZBRyVPxp5l4+xV9I74HouxPn8SLCeDKGExPgWHc2DdYARPTcvxOopvMiTfA9ghHB9n3YLRg8FzNZCqS3A4AMJs+NW8QBrJCty8omjwfYL4gzOQAv/6lksefciYvDGBC9K7daFv70wOAcMyTiSfIpI4Uci0MADBzdsgGcZNHCGvy7Im3isnFAeYDokTy0gA5iJYNniGSz+8oldwdAMDMmWF6m9fmQRhmc/wDUn2dZJPH3GztDgBgZvRsHsQUMO0oR6qvk8njKbfbugcoBFHp0D0m/wfW1ExCCBJCsOsL2W5++LF/IbHVAk05AO7bOtddyku7FLPMuRbfe2t+CvuDl/hmcO77/Mf2N6TgrX4E/h5BAAAAAElFTkSuQmCC);text-align:center;background-color:transparent;overflow:hidden;user-select:none;position:absolute;z-index:963540817;bottom:280px;border-radius:10px');
										jxbhttps.onclick = function() {
											let httpsvipul = document.getElementById("httpsvipul");
											httpsvipul.setAttribute('tabindex', '1');
											let redHide = document.getElementById('httpsvipul');
											redHide.onblur = (() => {
												redHide.style.display = 'none';
												this.style.transform = "rotateZ(0deg)";
											});
											if (httpsvipul.style.display == "none") {
												httpsvipul.style.display = "block";
												this.style.transform = "rotateZ(-90deg)";
											} else {
												httpsvipul.style.display = "none";
												this.style.transform = "rotateZ(0deg)";
											}
										};
										document.body.appendChild(jxbhttps);
									};
									createSelecthttps(https);
									createMenuhttps();
									document.head.insertAdjacentHTML('beforeend', '<style>ul#httpsvipul>li{margin:-4px 0px}ul#httpvipul>li{margin:-4px 0px}ul#httpsvipul{width:350px;top:125px;left:5px;zoom:1!important;position:fixed;z-index:2147483647!important;font-size:13px;user-select:none;color:black;transition:all .5s ease 0s;overflow:hidden}ul#httpsvipul>li{width:33.3%!important}ul#httpsvipul>li{color:black;display:flex;cursor:pointer;float:left;line-height:25px;padding:0;font-size:17px;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize;text-decoration:none;vertical-align:baseline;position:relative;zoom:.6}ul#httpsvipul>li>span{text-align:center;font-weight:bold;color:black;display:inline-block;padding:5px;margin:5px;font-size:18px;line-height:1;border:1px solid #fcfcfc;border-radius:10px;text-decoration:none;background-color:blanchedalmond;width:100%;box-shadow:1px 1px 4px #444,inset -2px -2px 4px #fff,inset 2px 2px 4px #aaa}ul#httpsvipul>li>span:hover{background-image:url(' + jxbtupiana + ');}ul#httpsvipul *:active{border-radius:100%;}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold;}</style>');
									document.querySelector('#httpsvipul>li:first-child').setAttribute('style', 'display:none!important');
									document.querySelector('#httpsvipul>li:last-of-type').setAttribute('style', 'display:none!important');
								} else {
									function createMenuhttps() {
										var jxbhttps = document.createElement("div");
										jxbhttps.id = "jxbhttps";
										jxbhttps.innerHTML = '<svg id ="vipsvg" style="font-weight:bold;cursor:pointer;bottom:50px;width:40px;height:40px;position:fixed;right:0.5vmin;z-index:100000;text-align:center;border-radius:10px;"</svg><svg viewBox="128 128 256 256"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6z"/><path d="M222.2 303.4v-94.6l90.7 47.3L222.2 303.4z" fill="#18222d"/></svg>';
										jxbhttps.setAttribute("style", "color:#008000;fill:#008000;");
										jxbhttps.onclick = function() {
											try {
												let httpsvipul = document.getElementById("httpsvipul"), jjxxkka = document.getElementById("jjxxkka"), vipsvg = document.querySelector("svg#vipsvg");
											} catch (err) {}
											httpsvipul.setAttribute('tabindex', '1');
											let redHide = document.getElementById('httpsvipul');
											try {
												if (httpsvipul.style.display == "none") {
													try {
														if (jjxxkka.style.display == "none") {
															try {
																document.querySelector("#jxbewanobj").click();
															} catch (err) {}
															try {
																vipsvg.style.bottom = "195px";
															} catch (err) {}
														} else {
															try {
																jjxxkka.style.display = "none";
																httpsvipul.style.display = "block";
															} catch (err) {}
															try {
																vipsvg.style.bottom = "50px";
															} catch (err) {}
														}
													} catch (err) {}
												} else {
													try {
														document.querySelector("#jxbewanobj").click();
													} catch (err) {}
													try {
														vipsvg.style.bottom = "50px";
													} catch (err) {}
												}
											} catch (err) {}
											if (localStorage.getItem("pcjkzdyj") == '0') {} else {
												(function() {
													let pdjqjssfczobj_counter = 0;
													let pdjqjssfczobj_jiankong = setInterval(function() {
														let pdjqjssfczobj_btn = document.querySelector("script#jiangxiaobaijqjs");
														if (pdjqjssfczobj_btn) {
															try {
																$('ul#httpsvipul>li').click(function() {
																	try {
																		document.getElementById('jjxxkka').style.display = 'none';
																		document.getElementById('jjxxkkb').style.display = 'none';
																	} catch (err) {}
																	if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
																		try {
																			let httpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
																			if (!document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																				if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
																					if (localStorage.getItem("pcjkzdyj") == '1') {
																						localStorage.setItem("httpsjk", httpsjksz);
																					} else {}
																				} else {
																					localStorage.setItem("httpsjk", httpsjksz);
																				}
																			} else {}
																		} catch (err) {}
																	}
																});
															} catch (err) {
																return false
															}
															clearInterval(pdjqjssfczobj_jiankong);
															return false
														}++pdjqjssfczobj_counter;
														if (pdjqjssfczobj_counter > 100) {
															clearInterval(pdjqjssfczobj_jiankong);
															return false
														}
													}, 50)
												})();
											}
											redHide.onblur = (() => {
												document.querySelector("#jxbhttps").click();
											});
											if (httpsvipul.style.display == "none") {
												httpsvipul.style.display = "block";
												this.style.cssText += "color:#cd7f32;fill:#cd7f32;background:0"
											} else {
												httpsvipul.style.display = "none";
												this.style.cssText += "color:#fff;fill:#008000;background:0"
											}
										};
										document.body.appendChild(jxbhttps)
									};
									createMenuhttps();
									createSelecthttps(https);
									try {
										if (window.mx_browser_obj.getTitle()) {} else {}
									} catch (err) {
										document.querySelector('#httpsvipul>li:last-of-type').setAttribute('style', 'display:none!important');
									}(function() {
										try {
											const jxbqcsjjk = document.querySelectorAll('ul#httpsvipul li');
											let sjtzsjzdylwobj, sjqjpbzdylwbobj, sjqjpbzdylwaobj, sjyyyzdypbobj;
											sjqjpbzdylwbobj = /(?:影玉|冰豆|麒麟|依托|芒果|法克|垫片|爱读|猪蹄|大影|丝瓜|无尽|宁湖|乐多|思古|历程|三二|17云|锦云|回响|夜空|1717|8090|唯多|无名|墨鱼|哔哩|淘影|诺讯|大亨|小蒋|玩嗨|九八|恐龙|福星|漂流|极速|刺客|七彩|音萌|PAR|CKP|OK|Youtube|大师|解啦|一零|六六|盘古|和巴|星驰|云端|奇米|片库|狼云|透明无接口)/i, sjtzsjzdylwobj = /[教文方学]案/, sjqjpbzdylwaobj = /(?:古思|乐乐|听乐|开放|暮光|口袋|专享|迪迪|沐影|猝然|酷吧|影视|番茄|达人|星空|挨斗|速搜|溜溜|八二|七夕)/i, sjyyyzdypbobj = /(?:人人|[淘影][ABC]|核桃|懒猫|木穆|巴陵|扫描|夜幕|七哥|虾米|百度|月亮|看剧|玻璃|海绵|我爱|神马|酷看|七彩|久播|恶灵|吉塔|盖斯|思[云念]|蘑菇|速云|迪奥|618G?|147|256|365|920|973|4080|黑云|九八|金桥|爱跟)/i;
											for (let jxbqcsjjki = 0; jxbqcsjjki < jxbqcsjjk.length; jxbqcsjjki++) {
												if (localStorage.getItem("sjjkpbpbobj") == '1') {
													try {
														if (document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem('httpsjk') + ")").style.display == 'none') {
															jkpdobj();
														} else {}
													} catch (err) {}
													try {
														if (window.mx_browser_obj.getTitle()) {} else {}
													} catch (err) {
														if (document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem('httpsjk') + ")>span>a4").innerText.match(/(?:米侠|嗅探)/)) {
															jkpdobj();
														} else {}
													}
												} else {}
												const jxbqcsjjkmsa = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a1');
												for (let jxbqcsjjkia = 0; jxbqcsjjkia < jxbqcsjjkmsa.length; jxbqcsjjkia++) {
													if (!localStorage.getItem("sjqbjkobj") == '1') {
														if (!jxbqcsjjk[jxbqcsjjki].innerText.match(sjtzsjzdylwobj) && jxbqcsjjkmsa[jxbqcsjjkia].innerText.match(/(?:搜索|跳转|[小大]窗|(?:小影)?自用|Json)/)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														}
													} else {
														if (jxbqcsjjkmsa[jxbqcsjjkia].innerText.match(/(?:搜索|(?:小影)自用|Json)/i)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important');
														}
														if (!jxbqcsjjkmsa[jxbqcsjjkia].innerText.match(/(?:(?:[小大]窗)|跳转)/)) {
															const sjqbjka = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a4');
															if (objj.match(/acfun\./)) {
																for (let sjqbjkai = 0; sjqbjkai < sjqbjka.length; sjqbjkai++) {
																	sjqbjka[sjqbjkai].innerText = sjqbjka[sjqbjkai].innerText.replace(/^(?!(?:(?:原|跳))?-|.*?嗅探)(.+?)$/, "跳-$1");
																};
															} else {
																for (let sjqbjkai = 0; sjqbjkai < sjqbjka.length; sjqbjkai++) {
																	sjqbjka[sjqbjkai].innerText = sjqbjka[sjqbjkai].innerText.replace(/^(?!(?:(?:原|跳))?-|.*?嗅探)(.+?)$/, "原-$1");
																};
															}
														}
														if (jxbqcsjjkmsa[jxbqcsjjkia].innerText.match(/(?:(?:[小大]窗)|跳转|自用|Json)/i)) {
															const sjqbjkb = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a4');
															for (let sjqbjkbi = 0; sjqbjkbi < sjqbjkb.length; sjqbjkbi++) {
																sjqbjkb[sjqbjkbi].innerText = sjqbjkb[sjqbjkbi].innerText.replace(/^(?!(?:(?:原|跳))?-)(.+?)$/, "跳-$1");
															};
														}
													}
												};
												if (!localStorage.getItem("sjqbjkobj") == '1') {
													const jxbqcsjjkmsb = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a4');
													for (let jxbqcsjjkib = 0; jxbqcsjjkib < jxbqcsjjkmsb.length; jxbqcsjjkib++) {
														let jkmcobj = (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjqjpbzdylwbobj)) || (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjyyyzdypbobj));
														let jkmclwobj = jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjtzsjzdylwobj);
														if (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjqjpbzdylwaobj) && objj.match(/\.bilibili\./)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														} else if (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(/PAR/i) && objj.match(/\.le\./)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														} else {} if (jkmcobj) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														}
														if (objj.match(/acfun\./)) {
															if (!jkmcobj && !jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(/(?:米侠|嗅探)/) && !jkmclwobj) {
																jxbqcsjjkmsb[jxbqcsjjkib].innerText = jxbqcsjjkmsb[jxbqcsjjkib].innerText.replace(/^(?!(?:(?:原|跳))?-)(.+?)$/, "跳-$1");
															}
														} else {
															if (!jkmcobj && !jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(/(?:米侠|嗅探)/) && !jkmclwobj) {
																jxbqcsjjkmsb[jxbqcsjjkib].innerText = jxbqcsjjkmsb[jxbqcsjjkib].innerText.replace(/^(?!(?:(?:原|跳))?-)(.+?)$/, "原-$1");
															}
														}
														if (jkmclwobj) {
															jxbqcsjjkmsb[jxbqcsjjkib].innerText = jxbqcsjjkmsb[jxbqcsjjkib].innerText.replace(/^(?!(?:(?:原|跳))?-)(.+?)$/, "跳-$1");
														}
													}
												} else {
													const jxbqcsjjkmsb = jxbqcsjjk[jxbqcsjjki].querySelectorAll('a4');
													for (let jxbqcsjjkib = 0; jxbqcsjjkib < jxbqcsjjkmsb.length; jxbqcsjjkib++) {
														let jkmcobj = jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjqjpbzdylwbobj);
														let jkmclwobj = jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjtzsjzdylwobj);
														if (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(sjqjpbzdylwaobj) && objj.match(/\.bilibili\./)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														} else if (jxbqcsjjkmsb[jxbqcsjjkib].innerText.match(/PAR/i) && objj.match(/\.le\./)) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														} else {} if (jkmcobj) {
															jxbqcsjjk[jxbqcsjjki].setAttribute('style', 'display:none!important')
														}
													}
												}
											}
										} catch (err) {}
									})();
									document.head.insertAdjacentHTML('beforeend', '<style>ul#httpsvipul *:active{color:chartreuse;background-color:black;}ul#httpsvipul .wsjxbshhjd{color:black;border:2.5px outset rgb(126,255,1);border-radius:5px;background-image:url(' + jxbtupiana + ');}ul#httpsvipul .wsjxbshhjd a1{color:black!important}ul#httpsvipul>li:nth-child(1)>span,ul#httpsvipul>li:nth-child(2)>span,ul#httpsvipul>li:nth-child(3)>span,ul#httpsvipul>li:nth-child(4)>span{background-color:gold}ul#httpsvipul span[style^="background-color"]{background-color:transparent!important}::-webkit-scrollbar{width:0px!important;height:0px!important;}</style>');
									(function() {
										let jxbewj = '', jxbwjstyle = 'float:left;border-radius:3.5px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px,rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;padding:5px 2.5px 5px 2.5px;border:2.5px outset buttonface;text-decoration:none;background-color:#4CAF50;', jxbhttpsew = [{
											name: jxbewj + '<a style="' + jxbwjstyle + '" onclick="document.getElementById(\'jjxxkka\').style.display=\'none\';document.getElementById(\'jxbhttps\').click();" href="https://jq.qq.com/?_wv=1027&k=tFMqx2nr" target="_blank">\u52a0\u7fa4</a>'
										}];
										function createSelectew(jxbhttpsew) {
											let jxbewjul = document.createElement("ul");
											jxbewjul.id = "jxbewjul";
											document.body.insertAdjacentHTML('beforeend', '<style type="text/css">div[id^="jjxxkk"]{margin:0px;padding:0px;position:fixed;width:max-content;bottom:75px;left:50%;transform:translateX(-50%);z-index:102030;overflow:auto hidden;text-align:center;}div[id^="jjxxkk"]>span,div[id^="jjxxkk"]>a{font-weight:bold;float:left;border-radius:25%;padding:10px 5px 10px 5px;font-size:large;border:4px outset buttonface;color:midnightblue;text-decoration:none;background-color:violet;}</style><div id="jjxxkka" style="display:none;"><span id="sjzdws">备用解析</span><span id="sjzdwss">搜索视频</span><span id="sjzdwsss">旋风视频</span><br><span id="sjzdwssss" style="margin-left:25%;">555电影</span><span id="chabeihu">茶杯狐</span></div>');
											jxbewjul.setAttribute("style", "display:none;margin:0;padding:0;position:fixed;bottom:150px;left:50%;transform:translateX(-50%);z-index:102030;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;white-space:nowrap;text-align:center;");
											for (let i = 0; i < jxbhttpsew.length; i++) {
												let jxbewjli = document.createElement("li");
												jxbewjli.setAttribute("style", "margin:0;display:inline-block;height:40px;text-align:center;");
												(function(jxbewj) {
													jxbewjli.onclick = function() {
														jxbhttpsew[jxbewj]
													}
												})(i);
												jxbewjli.innerHTML = jxbhttpsew[i].name;
												jxbewjul.appendChild(jxbewjli)
											}
											document.body.appendChild(jxbewjul)
										}
										function createMenuew() {
											let jxbewjBtn = document.createElement("div");
											jxbewjBtn.id = "jxbewanobj";
											jxbewjBtn.onclick = function() {
												try {
													document.getElementById('jjxxkka').style.display = 'none';
													document.getElementById('jjxxkkb').style.display = 'none';
												} catch (err) {}
												let jxbewjul = document.getElementById("jxbewjul");
												if (jxbewjul.style.display == "none") {
													jxbewjul.style.display = "block";
												} else {
													jxbewjul.style.display = "none";
												}
											};
											document.body.appendChild(jxbewjBtn)
										}
										createMenuew();
										createSelectew(jxbhttpsew)
									})();
									function dssxbobj() {
										setTimeout(function() {
											window.location.reload();
										}, 666)
									};
									if (sjpdpthyobj == '1') {
										(function() {
											if (localStorage.getItem("vipzdjx") == '0') {
												document.getElementById('vipzdjxhy').innerText = '手动';
												document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("vipzdjx") == '2') {
												document.getElementById('vipzdjxhy').innerText = '全部';
												document.querySelector("#vipzdjxhy").style.backgroundColor = 'brown';
											} else if (localStorage.getItem("vipzdjx") == '1') {
												document.getElementById('vipzdjxhy').innerText = '会员';
												document.querySelector("#vipzdjxhy").style.backgroundColor = '#49a34c';
											}
											document.getElementById('vipzdjxhy').onclick = function() {
												if (this.innerHTML == '手动') {
													localStorage.setItem("vipzdjx", "2");
													this.innerText = '全部';
													document.querySelector("#vipzdjxhy").style.backgroundColor = 'brown';
													alert('你已经选择自动解析\n全部视频功能');
													dssxbobj();
												} else if (this.innerHTML == '全部') {
													localStorage.setItem("vipzdjx", "1");
													this.innerText = '会员';
													document.querySelector("#vipzdjxhy").style.backgroundColor = '#49a34c';
													alert('你已经选择自动解析\n会员视频功能');
												} else if (this.innerHTML == '会员') {
													localStorage.setItem("vipzdjx", "0");
													this.innerText = '手动';
													document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
													alert('你已经关闭自动功能\n要想解析,请自己选择接口');
												}
											};
										})();
									} else {
										(function() {
											if (localStorage.getItem("vipzdjx") == '0') {
												document.getElementById('vipzdjxhy').innerText = '手动';
												document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("vipzdjx") == '2') {
												document.getElementById('vipzdjxhy').innerText = '自动';
												document.querySelector("#vipzdjxhy").style.backgroundColor = '#49a34c';
											}
											document.getElementById('vipzdjxhy').onclick = function() {
												if (this.innerHTML == '手动') {
													localStorage.setItem("vipzdjx", "2");
													this.innerText = '自动';
													document.querySelector("#vipzdjxhy").style.backgroundColor = '#49a34c';
													alert('你已经选择自动解析\n全部视频功能');
													dssxbobj();
												} else if (this.innerHTML == '自动') {
													localStorage.setItem("vipzdjx", "0");
													this.innerText = '手动';
													document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
													alert('你已经关闭自动功能\n要想解析,请自己选择接口');
													dssxbobj();
												}
											}
										})();
									}(function() {
										if (localStorage.getItem("vipjxtb") == '0') {
											let enable = false;
											let handler = 0;
											let dbclick = function() {
												enable = !enable;
												clearTimeout(handler);
												if (enable) {
													aScroll()
												}
											};
											document.body.removeEventListener('dblclick', dbclick);
											document.body.addEventListener('dblclick', dbclick);
											let aScroll = function() {
												try {
													document.querySelector("div#jxbhttps").click();
												} catch (err) {}
											};
											document.getElementById('vipjxtbhy').innerText = '默认';
											document.querySelector("#vipjxtbhy").style.backgroundColor = '#268dcd'
										} else if (localStorage.getItem("vipjxtb") == '2') {
											document.getElementById('vipjxtbhy').innerText = '双击';
											document.querySelector("#vipjxtbhy").style.backgroundColor = '#4CAF50'
										}
										document.getElementById('vipjxtbhy').onclick = function() {
											if (this.innerHTML == '默认') {
												localStorage.setItem("vipjxtb", "2");
												this.innerText = '双击';
												document.querySelector("#vipjxtbhy").style.backgroundColor = '#4CAF50';
												alert('图标已经恢复显示');
												dssxbobj()
											} else if (this.innerHTML == '双击') {
												localStorage.setItem("vipjxtb", "0");
												this.innerText = '默认';
												document.querySelector("#vipjxtbhy").style.backgroundColor = '#268dcd';
												alert('你已经选择了\n隐藏 图标 功能\n要想显示图标\n请双击网页空影处\n或者点击图标原来的位置');
												dssxbobj()
											}
										}
									})();
									(function() {
										if (localStorage.getItem("sjqbjkobj") == '0') {
											document.getElementById('sjqbvipjk').innerText = '全部';
											document.querySelector("#sjqbvipjk").style.backgroundColor = '#49a34c';
										} else if (localStorage.getItem("sjqbjkobj") == '1') {
											document.getElementById('sjqbvipjk').innerText = '精简';
											document.querySelector("#sjqbvipjk").style.backgroundColor = '#268dcd';
										}
										document.getElementById('sjqbvipjk').onclick = function() {
											if (this.innerHTML == '全部') {
												localStorage.setItem("sjqbjkobj", "1");
												this.innerText = '精简';
												document.querySelector("#sjqbvipjk").style.backgroundColor = '#268dcd';
												alert('已经显示 全部接口\n此模式 容易出现 接口广告\n请自行安装 广告过滤');
												dssxbobj();
											} else if (this.innerHTML == '精简') {
												localStorage.removeItem('sjqbjkobj');
												localStorage.setItem("sjjkpbpbobj", "1");
												this.innerText = '全部';
												document.querySelector("#sjqbvipjk").style.backgroundColor = '#49a34c';
												alert('已经禁止 部分 广告接口\n请自行安装 广告过滤');
												dssxbobj();
											}
										}
									})();
								}
								setTimeout(() => {
									try {
										try {
											if (jxbpcobj) {} else {
												document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("httpsjk") + ")>span").style.color = "black";
												document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("httpsjk") + ")>span").style.border = "2.5px outset #7eff01";
												document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("httpsjk") + ")>span").style.borderRadius = "5px";
											}
										} catch (err) {}
										$("ul#httpsvipul>li>span").css("backgroundImage", "");
										document.querySelector("ul#httpsvipul>li:nth-child(" + localStorage.getItem("httpsjk") + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
									} catch (err) {}
									let a = document.querySelectorAll('ul#httpsvipul>li>span');
									let l = a.length;
									for (let i = 0; i < l; i++) {
										a[i].onclick = function() {
											for (let j = 0; j < l; j++) {
												if (this == a[j]) {
													try {
														if (jxbpcobj) {
															if (localStorage.getItem("pcjkzdyj") == '1') {
																$('ul#httpsvipul>li>span').css("backgroundImage", "");
															} else {
																$('ul#httpsvipul>li>span:not([style*="AIH8BobyGoT"])').css("backgroundImage", "");
															}
														} else {
															$("ul#httpsvipul>li>span").css("backgroundImage", "");
															$("ul#httpsvipul>li>span").css("color", "");
															$("ul#httpsvipul>li>span").css("border", "");
															$("ul#httpsvipul>li>span").css("borderRadius", "");
														}
													} catch (err) {}
													this.className = "wsjxbshhjd";
													try {
														if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {} else {
															document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').style.color = 'red';
														}
													} catch (err) {}
													if ((localStorage.getItem("pcjkzdyj") == '1') || (document.querySelector("\u5b81\u5c0f\u5f71\u624b\u673a\u7f51\u9875") != null)) {
														this.style.backgroundImage = "url(" + jxbtupiana + ")";
													} else if (localStorage.getItem("pcjkzdyj") == '2') {
														this.style.backgroundImage = "url(" + jxbtupianb + ")";
													} else {
														this.style.backgroundImage = "url(" + jxbtupianc + ")";
													}
												} else {
													a[j].className = ""
												}
											}
										}
									}
									function sjssdqspobj(sjssdqsp) {
										try {
											document.getElementById('jjxxkka').style.display = 'none';
										} catch (err) {}
										if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com/)) {
											location.replace(sjssdqsp + document.querySelector('section[dt-params*="标题"]').innerText);
										} else {
											let jxbzdws = document.title.replace(/(?:动[漫画]|电(?:视剧|影)|综艺)\s*?_/, "").replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/（[^）]+?）\s*?第/, "第").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|片花|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（\[【]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\[【\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\[【\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1").replace(/([^\\u4e00-\\u9fa5]+?)[a-zA-Z0-9]+?((?:\s+|$))/, "$1$2").replace(/^([^\(（]+?)[\(（].*$/, "$1").replace(/(^\w+?)\s*?[\s*?:/,"$1:").replace(/^[^《<]+?[《<]/, "");
											location.replace(sjssdqsp + jxbzdws);
										}
									};
									let sjzdwsbtn = document.getElementById('sjzdws'), sjzdwssbtn = document.getElementById('sjzdwss'), sjzdwsssbtn = document.getElementById('sjzdwsss'), sjzdwssssbtn = document.getElementById('sjzdwssss'), sjchabeihubtn = document.getElementById('chabeihu');
									function sjzdwsbtnClick() {
										try {
											document.getElementById('jjxxkka').style.display = 'none';
										} catch (err) {}
										location.replace("https://www.ikukk.com/?url=" + window.location.href);
									};
									function sjssa() {
										sjssdqspobj('http://www.wbdy.tv/index.php?m=vod-search&wd=');
									};
									function sjssb() {
										sjssdqspobj('https://www.cupfox.com/search?key=');
									};
									function sjssc() {
										sjssdqspobj('https://miao101.com/search?q=');
									};
									function sjssd() {
										sjssdqspobj('https://www.555dy6.com/vodsearch/-------------.html?wd=');
									};
									try {
										sjzdwsbtn.addEventListener('click', sjzdwsbtnClick, false);
										sjzdwssbtn.addEventListener('click', sjssa, false);
										sjchabeihubtn.addEventListener('click', sjssb, false);
										sjzdwsssbtn.addEventListener('click', sjssc, false);
										sjzdwssssbtn.addEventListener('click', sjssd, false);
									} catch (err) {}
								}, 2345)
							})();
							if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {} else {
								try {
									document.querySelector('ul#httpsvipul>li:nth-child(' + localStorage.getItem('httpsjk') + ')>span>a4').style.color = 'red';
								} catch (err) {}
							}
							setTimeout(function() {
								if (document.querySelector("#宁小影") == null) {
									if (!obj.match(/^https?:\/\/(?:3g|m)\./) && (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null)) {
										if (objj.match(/mgtv/)) {
											setTimeout(function() {
												if (!document.querySelector("\u6211\u662f\u7535\u8111\u8292\u679c")) {
													document.body.appendChild(document.createElement("我是电脑芒果"));
												} else {}
											}, 60000);
										} else {}
									} else {}
								}
							}, 9876);
							(function() {
								if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
									let jxqvipimg = document.createElement("jxqvipimg");
									jxqvipimg.addEventListener('click', function() {
										jxqzsxobj();
									}, false);
									document.body.appendChild(jxqvipimg);
								} else {}
							})();
						} else {}
						function zdbt() {
							if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
								if (document.querySelector("\u5b81\u5c0f\u5f71\u6807\u9898") != null) {
									document.querySelector("\u5b81\u5c0f\u5f71\u6807\u9898").remove();
									document.body.appendChild(document.createElement("宁小影标题"));
								} else {
									document.body.appendChild(document.createElement("宁小影标题"));
								}
								if (document.querySelector("\u5b81\u5c0f\u5f71\u6807\u9898") != null) {
									if (document.title.match(/^[^：]+?：\s*?第.+?[部季集话部期]\s*?(?:[上下]\s*?)?$/) != null) {} else {
										let jxbzdws = document.title.replace(/(?:动[漫画]|电(?:视剧|影)|综艺)\s*?_/, "").replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/（[^）]+?）\s*?第/, "第").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|片花|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（\[【]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\[【\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\[【\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1").replace(/([^\\u4e00-\\u9fa5]+?)[a-zA-Z0-9]+?((?:\s+|$))/, "$1$2").replace(/^([^\(（]+?)[\(（].*$/, "$1").replace(/(^\w+?)\s*?[\s*?:/,"$1:").replace(/^[^《<]+?[《<]/, "");
										let jxbzdwsjs = document.title.replace(/\s+?/, "").replace(/会员\w+?版/, "").replace(/^(?!.*?(?:(?:\s*?[\-\—\_<《\(（]\s*?)?[^\s:：]+?\d{1,3}?\s*?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?)|\d+?\s*?集|(?:第\s*?.{1,3}|20\d{4,})\s*?[部季集话部期]|第\s*?\d{4}-\d{2}-\d{2}\s*?[部季集话部期]|先导片|彩蛋|看点|花絮|预告|片花|神剧亮了)).*?$/, "").replace(/^[^—_\-]+?(?!第)(\d+?集)[—_\-].+$/, "第$1").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|片花|神剧亮了|[部季集话部期]\s*?[上下]|第\s*?.{1,3}\s*?[部季].*?第\s*?\d{4}-\d{2}-\d{2}\s*?期)).*((?:(?:第\s*?.{1,3}|(?:第\s*?|\s+?)20\d{4,})\s*?(?<![\-_])[部季集话部期])).*?$/i, "$1").replace(/.+?(先导片|彩蛋|看点|花絮|预告|片花|神剧亮了|第\s*?.{1,3}\s*?[部季集话部期]\s*?[上下][部季集话部期]?).*?$/, "$1").replace(/^[^:：]+?(20\d{6})\s*?(期).*$/, "第$1$2").replace(/^(?!.+?(?:先导片|彩蛋|看点|花絮|预告|片花|神剧亮了|[部季集话部期]\s*?[上下])).+?(第)\s*?(\d{4})-(\d{2})-(\d{2})\s*?([期]).*?$/, "$1$2$3$4$5").replace(/^.+?[》>]\s*?20\d{2}-(\d{1,2})-(\d{1,2}期).*$/, "第$1$2").replace(/20\d{2}(\d{4}期)/, "$1");
										if (jxbzdwsjs == null || jxbzdwsjs == undefined || jxbzdwsjs == '') {
											document.title = jxbzdws + jxbzdwsjs;
										} else {
											document.title = jxbzdws + '：' + jxbzdwsjs;
										}
									}
								} else {}
							} else {}
						};
						function zddjjk() {
							if (jxbpcobj) {
								let jihao1 = 'ul#httpsvipul>li:nth-child(' + httpsjk + ')';
								let jihaoa = [jihao1];
								for (i = 0; i < jihaoa.length; i++) {
									if (exist(jihaoa[i]).style.display != "none") {
										exist(jihaoa[i]).click();
										log("%c电脑会员视频自动判断--成功点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px")
									} else {
										try {
											jkpddjobj();
										} catch (err) {
											document.querySelector("#httpsvipul>li:nth-child(1)").click();
										}
									}
								}
								function exist(jihaoa) {
									if (document.querySelector(jihaoa)) {
										return document.querySelector(jihaoa)
									} else {
										return false
									}
								}
							} else if (!document.querySelector('ul#httpsvipul>li:nth-child(' + httpsjk + ')>span>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
								let jihao1 = 'ul#httpsvipul>li:nth-child(' + httpsjk + ')';
								let jihaoa = [jihao1];
								for (i = 0; i < jihaoa.length; i++) {
									if (exist(jihaoa[i]).style.display != "none") {
										exist(jihaoa[i]).click();
										if (sessionStorage.getItem("jxbviplog") == '1') {
											sessionStorage.removeItem('jxbviplog');
										} else {
											log("%c手机会员视频自动判断--成功点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px")
										}
									} else {
										try {
											jkpddjobj();
										} catch (err) {
											document.querySelector("#httpsvipul>li:nth-child(1)").click();
										}
									}
								}
								function exist(jihaoa) {
									if (document.querySelector(jihaoa)) {
										return document.querySelector(jihaoa)
									} else {
										return false
									}
								}
							} else {}
						};
						function zddj() {
							zdbt();
							if (vipzdjx == 1 || vipzdjx == 2 || vipjxss == 0) {
								if ((jxbpcobj && (vipzdjx == 2 || vipjxss == 0)) || !jxbpcobj && (vipzdjx == 1 || vipzdjx == 2)) {
									zddjjk()
								} else if (jxbpcobj && vipzdjx == 1) {
									$(function() {
										var qjzdjk_counter = 0;
										var qjzdjk_jiankong = setInterval(function() {
											var qjzdjk_btn = $("ul#httpsvipul>li");
											if (qjzdjk_btn) {
												zddjjk();
												clearInterval(qjzdjk_jiankong);
												return false
											}++qjzdjk_counter;
											if (qjzdjk_counter > 50) {
												clearInterval(qjzdjk_jiankong);
												return false
											}
										}, 500)
									})
								}
							}
							return false;
						};
						function zddjobj() {
							if (!document.querySelector("\u5b81\u5c0f\u5f71\u81ea\u52a8\u70b9\u51fb\u63a5\u53e3")) {
								document.body.appendChild(document.createElement("宁小影自动点击接口"));
								try {
									if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
										try {
											GM_setValue('视频自动全屏', '开启');
										} catch (err) {}
									} else {}
								} catch (err) {}
								if (document.querySelector("div#宁小影>iframe#宁小影")) {} else if (document.querySelector("div#宁小影>img#宁小影")) {} else {
									if (document.querySelector("jiangxiaobai")) {
										if (document.querySelector("div#宁小影>iframe#宁小影")) {} else if (document.querySelector("div#宁小影>img#宁小影")) {} else {
											document.querySelector("jiangxiaobai").remove();
											if (!document.querySelector("zddj")) {
												document.body.appendChild(document.createElement("zddj"));
												zddj();
											}
										}
									} else {
										if (document.querySelector("div#宁小影>iframe#宁小影")) {} else if (document.querySelector("div#宁小影>img#宁小影")) {} else {
											if (!document.querySelector("zddj")) {
												document.body.appendChild(document.createElement("zddj"));
												zddj();
											}
										}
									}
								}
								if (localStorage.getItem("vipzdjx") == '0') {} else {
									if (jxbpcobj) {
										jxbzdjxdsqobj = 2345;
									} else {
										if (localStorage.getItem("vipzdjx") == '1') {
											jxbzdjxdsqobj = 3333;
										} else if (localStorage.getItem("vipzdjx") == '2') {
											jxbzdjxdsqobj = 2345;
										}
									}
									if (obj.match(/^https?:\/\/m\.mgtv\./)) {} else {
										setTimeout(function() {
											if (document.querySelector("div#宁小影>iframe#宁小影")) {
												return false;
											} else if (document.querySelector("div#宁小影>img#宁小影")) {
												return false;
											} else {
												try {
													document.querySelector("jiangxiaobai").remove();
												} catch (err) {}
												if (!document.querySelector("zddj")) {
													document.body.appendChild(document.createElement("zddj"));
													zddj();
												}
											}
										}, jxbzdjxdsqobj);
									}
								}
							} else {}
						}; if (objj.match(/(?:bilibili|acfun|youku|qq|iqiyi|mgtv|sohu|le|pptv)\./)) {
							if (vipzdjx != 1 && vipvideotg == 1) {
								var jxbvideoada, jxbvideoadb, videoada, videoadb, videoadc;
								function spzddj(spzddja) {
									let spjyzddja = 0;
									let spjyzddjb = setInterval(function() {
										let spjyzddjc = document.querySelector(spzddja);
										if (spjyzddjc) {
											try {
												spjyzddjc.click();
												log("%c宁小影-已经恢复音量", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
											} catch (e) {}
											clearInterval(spjyzddjb);
											return false;
										}++spjyzddj;
										if (spjyzddj > 25) {
											clearInterval(spjyzddjb);
											return false;
										}
									}, 123)
								};
								function jxbspad() {
									if (!document.querySelector("\u8df3\u8fc7\u5e7f\u544a")) {
										document.body.appendChild(document.createElement("\u8df3\u8fc7\u5e7f\u544a"));
										if (objj.match(/\.qq\./)) {
											jxbvideoada = setInterval(function() {
												videoada = document.querySelectorAll(".txp_ad video");
												if (videoada.length) {
													for (let i = 0; i < videoada.length; i++) {
														videoada[i].currentTime = 1000;
													}
												}
											}, 1000);
										} else if (objj.match(/\.youku\./)) {
											jxbvideoada = setInterval(function() {
												videoada = document.querySelectorAll(".h5-ext-layer div");
												if (videoada && videoada.length > 0) {
													Array.from(videoada).forEach(i => i.remove());
													videoadb = document.getElementsByClassName("control-play-icon");
													if (videoadb && videoadb.length > 0) {
														videoadb[0].click();
													}
													clearInterval(jxbvideoada);
												} else {}
											}, 100);
										} else if (objj.match(/\.iqiyi\./)) {
											function videoadobj() {
												jxbvideoadb = setInterval(function() {
													videoada = document.querySelectorAll(".skippable-after");
													if (videoada && videoada.length > 0) {
														videoada[0].click();
														videoadc = document.querySelectorAll(".cd-time");
														if (videoadc && videoadc.length > 0 && parseInt(videoadc[0].innerText) > 1) {
															videoadc[0].innerText = 1;
														}
														clearInterval(jxbvideoadb);
													} else {}
												}, 1000);
											};
											videoadobj();
											jxbvideoada = setInterval(function() {
												videoada = document.querySelectorAll(".cd-time");
												if (videoada && videoada.length > 0 && parseInt(videoada[0].innerText) > 1) {
													videoadobj();
												} else {}
											}, 1000);
										} else if (objj.match(/\.le\./)) {
											jxbvideoada = setInterval(function() {
												if (document.getElementsByClassName('vdo_post_time')[0]) {
													Array.from(document.getElementsByTagName('video')).forEach(function(video_) {
														video_.setAttribute('src', null)
													})
												}
											}, 1000);
										} else {
											jxbvideoada = setInterval(() => {
												videoada = $('body').find('video');
												if (videoada) {
													if (videoada.get()) {
														videoadb = videoada.get();
														for (let video of videoadb) {
															videoadc = $(video).attr('src');
															if (videoadc && !videoadc.startsWith('blob:')) {
																video.currentTime = 1000;
															}
														}
													}
												}
											}, 1000);
										}
									} else {}
								};
								(() => {
									if (!document.querySelector("jxqspggtg")) {
										let jxqspggtg = document.createElement("jxqspggtg");
										jxqspggtg.addEventListener('click', function() {
											try {
												clearInterval(jxbvideoada);
											} catch (err) {}
											try {
												clearInterval(jxbvideoadb);
											} catch (err) {}
											try {
												document.querySelector("\u8df3\u8fc7\u5e7f\u544a").remove();
											} catch (err) {}
										}, false);
										document.body.appendChild(jxqspggtg);
									} else {}
								})();
								setTimeout(() => {
									try {
										clearInterval(jxbvideoada);
									} catch (err) {}
									try {
										clearInterval(jxbvideoadb);
									} catch (err) {}
									document.querySelector("\u8df3\u8fc7\u5e7f\u544a").remove();
								}, 23456);
							} else {} if (gbdmobj == 1) {
								function tongyongdanmu() {
									cssobj('[class*="danmu"],[id*="danmu"],[class*="danmaku"],[id*="danmaku"],[class*="barrage"],[id*="barrage"],[name*="danmuku"]');
								};
								if (obj.match(/^https?:\/\/www\.iqiyi\.com\/(?:[av]_|kszt\/)/)) {
									let iqiyidanmu = 'div[class^="player-mnb-mid"],div[id^="player-mnb-mid"],div[class*="_voteEnter"],div[id*="_voteEnter"]';
									tongyongdanmu();
									cssobj(iqiyidanmu);
									remove(iqiyidanmu);
								} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
									let sohudanmu = 'div[class^="toolBar"],div[id^="toolBar"]';
									tongyongdanmu();
									cssobj(sohudanmu);
									remove(sohudanmu);
								} else if (obj.match(/^https?:\/\/[^\/]+?\.bilibili\./)) {
									if (obj.match(/\/html5player\.html\?aid=/)) {
										let bilibilidanmu = '[class*="sendbar"],[id*="sendbar"]';
										tongyongdanmu();
										remove(bilibilidanmu);
									} else {
										setTimeout(function() {
											jxbzdgbdmobj = setInterval(function() {
												if (document.querySelector('[class*="player"][class*="-dm-wrap"]') != null) {
													setTimeout(function() {
														try {
															if (document.querySelector('span[class="choose_danmaku"]') == null) {} else {
																(document.querySelector('span[class="choose_danmaku"]').innerText.match(/关闭/)) && (document.querySelector('[aria-label*="弹幕"] input[checked]').click())
															}
														} catch (err) {}
													}, 3456);
													setTimeout(function() {
														try {
															document.querySelector('[class$="player-sending-area"]').remove()
														} catch (err) {}
													}, 4567);
													const scdmobj = document.querySelectorAll('[class*="player"][class*="-dm-wrap"]');
													for (let scdmobji = 0; scdmobji < scdmobj.length; scdmobji++) {
														if (scdmobj[scdmobji]) {
															scdmobj[scdmobji].remove()
														}
													};
													clearInterval(jxbzdgbdmobj)
												} else {}
												setTimeout(function() {
													clearInterval(jxbzdgbdmobj)
												}, 6789)
											}, 123)
										}, 1234);
									}
								} else {
									(function() {
										"use strict";
										let selector;
										const selectoracfuna = {
											on: "div[data-bind-key='danmaku_enabled'][data-bind-attr='true']",
											off: "div[data-bind-key='danmaku_enabled'][data-bind-attr='false']",
										};
										const selectoryoukua = {
											on: 'div[id="barrage-controller"] [class^="switch-img_"][class*="turn-on_"]',
											off: 'div[id="barrage-controller"] [class^="switch-img_"][class*="turn-off_"]',
										};
										const selectorqqa = {
											on: 'div[class*="barrage_switch"][class*="open"]',
											off: 'div[class*="barrage_switch"]:not([class*="open"])',
										};
										const selectormgtva = {
											on: 'div[class*="danmu-switcher"][class*="on"]',
											off: 'div[class*="danmu-switcher"]:not([class*="on"])',
										};
										const selectorlea = {
											on: 'label[class*="switch-btn"][class*="active"]',
											off: 'label[class*="switch-btn"]:not([class*="active"])',
										};
										const selectorpptva = {
											on: 'div[class*="w-barrage-open"]:not([class*="close"]',
											off: 'div[class*="w-barrage-close"]:not([class*="open"])',
										};
										if (obj.match(/^https?:\/\/(?:www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|live\.acfun\.cn\/live\/)/)) {
											selector = selectoracfuna;
										} else if (obj.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
											selector = selectoryoukua;
										} else if (obj.match(/^https?:\/\/v\.qq\.com\/x\/cover\//)) {
											selector = selectorqqa;
										} else if (obj.match(/^https?:\/\/www\.mgtv\.com\/[bs]\//)) {
											selector = selectormgtva;
										} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
											selector = selectorlea;
										} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
											selector = selectorpptva;
										} else {}
										function disableDanmaku() {
											let buttonOn = document.querySelector(selector.on);
											if (buttonOn !== null) {
												buttonOn.click();
											}
											setTimeout(() => {
												if (document.querySelector(selector.off) === null) {
													disableDanmaku()
												}
											}, 500)
										}
										function detectPJAX() {
											let prevButtonOn;
											setInterval(() => {
												try {
													let buttonOn = document.querySelector(selector.on);
													if (buttonOn !== null && prevButtonOn !== buttonOn) {
														disableDanmaku();
														prevButtonOn = buttonOn
													}
												} catch (err) {
													return false;
												}
											}, 500)
										}
										detectPJAX();
									})();
								}
							} else {}
						} else {}
						try {
							if (mgzdgq == 1 || mgzdgq == 2 || vipzdjx == 1 || vipzdjx == 2 || localStorage.getItem("zdpddy") == '1' || document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") && (obj.match(/&autoplay=1&metareferer=/) || (vipzdjx != 1 && vipvideotg == 1))) {
								function panduanshebeiobj() {
									const observer = new MutationObserver(function() {
										const jxbvipobj = jiangxiaobaiviphyzdpd();
										if (jxbvipobj) {
											observer.disconnect();
										}
									});
									observer.observe(document.body, {
										childList: true,
										subtree: true
									});
									function zdpddyobj() {
										if (!document.querySelector("\u5b81\u5c0f\u5f71\u81ea\u52a8\u5224\u65ad\u591a\u4f59")) {
											document.body.appendChild(document.createElement("宁小影自动判断多余"));
										} else {}
									}; if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") !== null) {
										function dnzdpdobj() {
											if (!document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u81ea\u52a8\u5224\u65ad")) {
												document.body.appendChild(document.createElement("宁小影电脑自动判断"));
											} else {}
										};
										function dnmgqxdpdobj() {
											if (!document.querySelector("\u6211\u662f\u7535\u8111\u8292\u679c")) {
												document.body.appendChild(document.createElement("我是电脑芒果"));
											} else {}
										};
										function dnzddjobj(zddjlog) {
											document.querySelector("jiangxiaobai").remove();
											zdztsp();
											zddjobj();
											dnzdpdobj();
											log(zddjlog, "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										};
										function dnjxbspad(jxbspadlog) {
											jxbspad();
											log(jxbspadlog, "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										};
										function jiangxiaobaiviphyzdpd() {
											if (obj.match(/&autoplay=1&metareferer=/)) {
												if (document.fullscreen) {} else if (document.fullscreenElement) {} else {
													if (document.querySelector("\u5b81\u5c0f\u5f71\u5168\u5c4f")) {} else {
														try {
															window.scrollTo(0, document.documentElement.clientHeight);
														} catch (err) {}
														try {
															if (document.querySelector('video')) {
																try {
																	qpobj(document.querySelector('video').parentNode.parentNode);
																} catch (err) {
																	qpobj(document.querySelector('video'));
																}
																setTimeout(jxbjkspbfjsobj, 3333);
																setTimeout(function() {
																	if (document.querySelector("video").currentTime > 0) {} else {
																		if (!document.querySelector("\u5b81\u5c0f\u5f71\u5168\u5c4f")) {
																			document.body.appendChild(document.createElement("宁小影全屏"));
																		} else {}
																		alert('此接口暂时无法解析，请自行更换 接口');
																		window.close();
																	}
																}, 6789);
															} else {
																try {
																	document.querySelector('button[data-balloon*="全屏"]').click();
																} catch (err) {
																	if (!document.querySelector("\u5b81\u5c0f\u5f71\u5168\u5c4f")) {
																		document.body.appendChild(document.createElement("宁小影全屏"));
																	} else {}
																}
															}
														} catch (err) {
															document.querySelector('button[data-balloon*="全屏"]').click();
														}
														if (!document.querySelector("\u5b81\u5c0f\u5f71\u5168\u5c4f")) {
															document.body.appendChild(document.createElement("宁小影全屏"));
														} else {}
													}
												}
											} else {
												if (!document.querySelector("\u5b81\u5c0f\u5f71\u81ea\u52a8\u5224\u65ad\u591a\u4f59") && localStorage.getItem("zdpddy") == '1') {
													if (!document.querySelector("#jxbhttps")) {
														window.close();
													} else {} if (document.querySelector('div.maomibtn')) {
														if (!document.querySelector('a[href*="963540817"]')) {
															window.close();
														} else if (!document.querySelector('a[href*="tFMqx2nrL"]')) {
															window.close();
														} else {}
													} else {} if ((document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])') != null) && document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').src.match(jxjkwzobj)) {
														try {
															if ((document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').src.match(jxjkwzobj)) && document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').getAttribute('id') != '\u5b81\u5c0f\u5f71') {
																try {
																	window.close();
																} catch (err) {
																	zdpddyobj();
																}
															} else {} if (document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong") != null) {
																if ((document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong:first-child").innerText.match(/^\u5b81$/)) && (document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong:last-of-type").innerText.match(/^\u5f71$/))) {} else {
																	try {
																		window.close();
																	} catch (err) {
																		zdpddyobj();
																	}
																}
															} else {}
														} catch (err) {
															zdpddyobj();
														}
													} else if (document.querySelector('[style*="eggvod"]') != null) {
														try {
															document.querySelector('[style*="eggvod"]').parentNode.remove();
														} catch (err) {
															zdpddyobj();
														}
													} else if (document.querySelector('[href^="javascript"][style*="data"][style*="image"]') != null) {
														try {
															document.querySelector('[href^="javascript:"][style*="data:image/"]').parentNode.remove();
														} catch (err) {
															zdpddyobj();
														}
													} else if (document.querySelector('[href^="javascript"][target*="_blank"]') != null) {
														try {
															document.querySelector('[href^="javascript"][target*="_blank"]').remove();
														} catch (err) {
															zdpddyobj();
														}
													} else {}
												} else {}
											} if (!document.querySelector('div#宁小影') && document.querySelector("jiangxiaobai") && !document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u81ea\u52a8\u5224\u65ad") && ((mgzdgq == 1 || mgzdgq == 2 || vipzdjx == 1 || vipzdjx == 2 || (vipzdjx != 1 && vipvideotg == 1)))) {
												if (!document.querySelector("\u8df3\u8fc7\u5e7f\u544a") && vipzdjx != 1 && vipvideotg == 1) {
													if (objj.match(/\.youku\./)) {
														if ($('div[class$="youku_vip_pay_btn"][data-promotions]:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-优酷视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.qq\./)) {
														if ($('[data-role="adplayer-video-skip-text"]:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-腾讯视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.mgtv\./)) {
														if ($('[class*="video"][class*="modal"][class*="group"] span:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-电脑-芒果TV视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.iqiyi\./)) {
														if ($('[class*="time"] span[class$="vip-text"]:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-电脑-爱奇艺视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.sohu\./)) {
														if ($('[class*="time"] [class*="skip"]:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-电脑-搜狐视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.le\./)) {
														if ($('[class*="time"] a:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-电脑-乐视视频-跳过广告-01-工作中");
														} else {}
													} else if (objj.match(/\.pptv\./)) {
														if ($('[class*="video-vastad"] [class*="countdown"]:contains("广告")')[0]) {
															dnjxbspad("%c宁小影-电脑-PPTV视频-跳过广告-01-工作中");
														} else {}
													} else {}
												} else {} if ((mgzdgq == 1 || mgzdgq == 2 || vipzdjx == 2) && vipzdjx != 1) {
													try {
														if (obj.match(/^https?:\/\/v(?:-wb)?\.youku\.com\/v_show\/id_/)) {
															if ($("#toast_text:contains('试看')")[0] || $("#toast_text:contains('完整')")[0] || $("#toast_text:contains('购买')")[0]) {
																dnzddjobj("%c宁小影-电脑-优酷会员自动解析-01-工作中");
															} else if ($("#vip_limit_content:contains('试看')")[0] || $("#vip_limit_content:contains('完整')")[0] || $("#vip_limit_content:contains('购买')")[0]) {
																dnzddjobj("%c宁小影-电脑-优酷会员自动解析-02-工作中");
															} else if ($(".vip_player_payment_toast p:contains('试看')")[0] || $(".vip_player_payment_toast p:contains('完整')")[0] || $(".vip_player_payment_toast p:contains('购买')")[0]) {
																dnzddjobj("%c宁小影-电脑-优酷会员自动解析-03-工作中");
															} else if (!document.querySelector("#ykPlayer>div.youku-film-player>video") && !document.querySelector("div.youku-layer-logo") && document.querySelector('div.preplay-layer>img[src*=".ykimg.com/"][style^="display:"][style*="block"]')) {
																if ($("div.drm-error-layer div.note_normal_tit:contains('版权'):contains('加密'):contains('不支持')")[0] && document.querySelector('div.preplay-layer>img[src*="/"]') && $("div.note_error_item_title:contains('换'):contains('浏览器')")[0]) {
																	dnzddjobj("%c宁小影-电脑-优酷会员自动解析-04-工作中");
																} else {}
															} else {}
														} else if (obj.match(/^https?:\/\/[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)/)) {
															if ($("div.information-tips:contains('看'):contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-土豆会员自动解析-01-工作中");
															} else if ($("div.vip_info:contains('看'):contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-土豆会员自动解析-02-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\//)) {
															if (localStorage.getItem("ymyypdobj") == '0') {
																if ((((!document.querySelector('[class*="item"][class$=" current"]:not([tabindex])[tl]') && document.querySelector('[class*="item"][class$=" current"]:not([tabindex]) i[class="mark_v"]>img[src*="_vip"]:not([alt])[src$=".png"]:not([src*="_trai"]):not([src*="_only"]):not([src*="_self"]):not([src*="_full"]):not([src*="_number"]):not([src*=".png/"])[srcset*="_vip"][srcset$=".png 2x"]:not([srcset*="_trai"]):not([srcset*="_only"]):not([srcset*="_self"]):not([srcset*="_full"]):not([srcset*="_number"]):not([srcset*=".png/"])')) || (document.querySelector('[class*="item"][class$=" current"]:not([tabindex])[tl] i[class="mark_v"]>img[src*="_vip"][alt][src$=".png"]:not([src*=".png/"])[srcset*="_vip"][srcset$=".png 2x"]:not([srcset*=".png/"])') && document.querySelector('[class*="item"][class$=" current"]:not([tabindex]) i[class="mark_v"]>img[src*="_vip"][src$=".png"]:not([src*="_trai"]):not([src*="_only"]):not([src*="_self"]):not([src*="_full"]):not([src*="_number"]):not([src*=".png/"])[srcset*="_vip"][srcset$=".png 2x"]:not([srcset*="_trai"]):not([srcset*="_only"]):not([srcset*="_self"]):not([srcset*="_full"]):not([srcset*="_number"]):not([srcset*=".png/"])')) || document.querySelector('[class*="item"][class$=" current"]:not([tabindex])[tl] i[class="mark_v"]>img[src*="_vip"]:not([alt])[src$=".png"]:not([src*="_trai"]):not([src*="_only"]):not([src*="_self"]):not([src*="_full"]):not([src*="_number"]):not([src*=".png/"])[srcset*="_vip"][srcset$=".png 2x"]:not([srcset*="_trai"]):not([srcset*="_only"]):not([srcset*="_self"]):not([srcset*="_full"]):not([srcset*="_number"]):not([srcset*=".png/"])')) && document.querySelector("video") != null) && !$("txpdiv.txp_ad_inner txpdiv.txp_ad_control txpdiv.txp_ad_skip_text:contains('关闭'):contains('广告')")[0]) {
																	setTimeout(dnzdpdobj, 1680);
																	setTimeout(zdztsp, 1680);
																	setTimeout(zddjobj, 2345);
																	document.querySelector("jiangxiaobai").remove();
																	log("%c宁小影-电脑-腾讯会员自动解析-00-a-工作中");
																}
															} else {}
															if ($("txpdiv.txp_alert_info:contains('试看')")[0] && $("txpdiv.txp_alert_info txpdiv:contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-01-工作中");
															} else if ($("div.wrapper.mod_vip_popup:contains('会员'):contains('看')")[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-02-工作中");
															} else if (!document.querySelector("#video_scroll_wrap div.mod_episode") && $("txpdiv.txp_ad_inner txpdiv.txp_ad_control txpdiv.txp_ad_skip_text:contains('关闭'):contains('广告')")[0] && $("#_vip_player_sec a:contains('会员'):contains('看')")[0]) {
																let qqggbtn = document.querySelector("txpdiv.txp_ad_inner txpdiv.txp_ad_control button");
																if (qqggbtn) {
																	qqggbtn.click();
																	qqggbtn.remove();
																} else {}
																zdztsp();
																document.querySelector("jiangxiaobai").remove();
																zddjobj();
																log("%c宁小影-电脑-腾讯会员自动解析-03-工作中");
															} else if (!(document.querySelector("#video_scroll_wrap div.mod_episode") || $("#video_scroll_wrap>div.mod_text_tabs>a.tab_item.current:contains('往期')")[0]) && $("#_vip_player_sec a:contains('会员')")[0] && $("#_vip_player_sec a:contains('购买')")[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-04-工作中");
															} else if ($('[data-role*="ui-error"]:contains("版权"):contains("加密"):contains("不支持"):contains("播放")')[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-05-工作中");
															} else if ($(".content h1:contains('会员'):contains('超前'):contains('点播')")[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-06-工作中");
															} else if ($('txpdiv[data-role*="tips"][data-role*="text"]:contains("试看"):contains("分钟")')[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-07-工作中");
															} else if ($('[data-role*="txp-ui-tips"]:contains("版权"):contains("购买")')[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-08-工作中");
															} else if ($('[data-role^="txp-ui-tips"]:contains("会员"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-腾讯会员自动解析-09-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/(?:ww)?w\.mgtv\.com\/[a-z]\//)) {
															try {
																if ((mgzdgq == 1 || mgzdgq == 2) && document.querySelector(".m-player-h5-new .u-control-clarity .btn") && document.querySelector(".m-player-h5-new .u-control-clarity .btn").innerText.match(/^\s*?自动/) && vipzdjx != 1 && !document.querySelector("\u6211\u662f\u7535\u8111\u8292\u679c")) {
																	if (mgzdgq == 1) {
																		if (document.querySelector('a[data-name="超清"][data-purview="true"]')) {
																			dnmgqxdpdobj();
																			document.querySelector('a[data-name="超清"][data-purview="true"]').click();
																		} else if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
																			dnmgqxdpdobj();
																			document.querySelector('a[data-name="高清"][data-purview="true"]').click();
																		} else {}
																	} else if (mgzdgq == 2) {
																		if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
																			dnmgqxdpdobj();
																			document.querySelector('a[data-name="高清"][data-purview="true"]').click();
																		} else {}
																	}
																} else {}
															} catch (err) {}
															if (vipzdjx == 2 && obj.match(/^https?:\/\/(?:ww)?w\.mgtv\.com\/b\//)) {
																if ($("div.control-tips-line>p:contains('费'):contains('看')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-01-工作中");
																} else if ($("mango-center-state>mango-center-state-error h2:contains('版权'):contains('限制')")[0] && $("mango-center-state>mango-center-state-error p:contains('扫码'):contains('看')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-02-工作中");
																} else if ($("mango-center-state div.m-player-paytips-title:contains('费'):contains('看')")[0] && $("mango-center-state div.m-player-paytips-buttons.onerow a:contains('费'):contains('看')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-03-工作中");
																} else if ($("mango-control-tip p:contains('看'):contains('分钟')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-04-工作中");
																} else if ($(".m-player-paytips-wrapper div.m-player-paytips-title:contains('会员'):contains('看')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-05-工作中");
																} else if ($("mango-center-state-payment:contains('购买')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-06-工作中");
																} else if ($("mango-control-tip:contains('完整')")[0]) {
																	dnzddjobj("%c宁小影-电脑-芒果TV会员自动解析-07-工作中");
																} else {}
															} else {}
														} else if (obj.match(/^https?:\/\/www\.iqiyi\.com\/(?:[av]_|kszt\/)/)) {
															if (localStorage.getItem("ymyypdobj") == '0') {
																if ((document.querySelector('ul>li[class*="item"][class$=" selected"] img[src*="/vip"][src$=".png"]:not([src*=".png/"])[srcset*="/vip"][srcset*=".png"]:not([srcset*=".png/"])') || document.querySelector('ul>li[class*="item"][class$=" selected"] img[src*="/VIP"][src$=".png"]:not([src*=".png/"])[srcset*="/VIP"][srcset*=".png"]:not([srcset*=".png/"])')) && document.querySelector('[tabindex="-1"][data-player-hook]>video[src^="blob:http"]')) {
																	dnzdpdobj();
																	setTimeout(function() {
																		zdztsp();
																		document.querySelector("jiangxiaobai").remove();
																		zddjobj();
																		log("%c宁小影-电脑-爱奇艺会员自动解析-00-a-工作中");
																	}, 2345);
																} else if ((document.querySelector('ul>li[class*="item"][class$=" selected"] img[src*="/vip"][src$=".png"]:not([src*=".png/"])[srcset*="/vip"][srcset*=".png"]:not([srcset*=".png/"])') || document.querySelector('ul>li[class*="item"][class$=" selected"] img[src*="/VIP"][src$=".png"]:not([src*=".png/"])[srcset*="/VIP"][srcset*=".png"]:not([srcset*=".png/"])')) && document.querySelector('i+a[class="logo-channel"] h1').innerText.match(/^\s*?动漫\s*?$/)) {
																	dnzdpdobj();
																	setTimeout(function() {
																		zdztsp();
																		document.querySelector("jiangxiaobai").remove();
																		zddjobj();
																		log("%c宁小影-电脑-爱奇艺会员自动解析-00-b-工作中");
																	}, 2345);
																} else if ($('iqpdiv[class="iqp-layer-main"]:contains("播放"):contains("失败")')[0]) {
																	dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-00-c-工作中");
																} else {}
															} else {} if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-bottom iqpspan>i+a")) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-01-工作中");
															} else if (document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv") && document.querySelector("#flashbox>iqpdiv iqpdiv.iqp-layer.iqp-layer-error>iqpdiv>a") && document.querySelector("#rightPlayList>div.side-content>article a")) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-02-工作中");
															} else if (document.querySelector("div.qy-player-vippay-popup div.popup-main>p") && document.querySelector("div.qy-player-vippay-popup a.vippay-btn")) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-03-工作中");
															} else if ($("iqpspan:contains('试看')")[0] || $("iqpspan:contains('完整')")[0] || $("iqpspan:contains('开通')")[0] || $("iqpspan:contains('购买')")[0]) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-04-工作中");
															} else if ($('[class^="vippay"][class*="-popup"] p:contains("点播")')[0] || $('[class^="vippay"][class*="-popup"] p:contains("付费")')[0]) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-05-工作中");
															} else if (!($('[class^="vippay"][class*="-popup"] p:contains("专享"):contains("互动")')[0]) && ($('[class^="vippay"][class*="-popup"] p:contains("会员"):contains("专享")')[0])) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-06-工作中");
															} else if ($('[class^="vippay"][class*="-popup"] a:contains("费")a:contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-爱奇艺会员自动解析-07-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/tv\.sohu\.com\/v\//)) {
															if (!$("#player_vipTips:contains('以上画质')")[0] && $("#player_vipTips p:contains('会员'):contains('看')")[0]) {
																dnzddjobj("%c宁小影-电脑-搜狐电视会员自动解析-01-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/film\.sohu\.com\/album\//)) {
															if ($("div.x-dash-tip-panel>span:contains('看'):contains('分钟')")[0]) {
																dnzddjobj("%c宁小影-电脑-搜狐电影会员自动解析-01-工作中");
															} else if ($('[class="x-tip-btn x-tip-vip"]:contains("购买")')[0]) {
																dnzddjobj("%c宁小影-电脑-搜狐电影会员自动解析-02-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/www\.le\.com\/ptv\/vplay\//)) {
															if ($("div.playbox_vip_tip_bg.j-vipTip:contains('会员'):contains('看')")[0]) {
																dnzddjobj("%c宁小影-电脑-乐视会员自动解析-01-工作中");
															} else if ($("div.hv_tip1.js-tip:contains('看'):contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-乐视会员自动解析-02-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/v\.pptv\.com\/show\//)) {
															if ($('[class*="tips-content"]:contains("费"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-PPTV会员自动解析-01-工作中");
															} else if ($('[class*="buyGuidance"]:contains("费"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-PPTV会员自动解析-02-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/vip\.1905\.com\/play\//)) {
															if ($("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("div.pay-mod-notlogin>div.notlogin-login:contains('会员'):contains('看')")[0]) {
																dnzddjobj("%c宁小影-电脑-1905会员自动解析-01-工作中");
															} else if (document.querySelector("#pDialog") && $("div.sb-toggle-card.card-pay.card-active:contains('费')")[0] && $("#pSidebar>div.sb-content>div.sb-mod-pay p:contains('版权'):contains('二维码'):contains('下载'):contains('看')")[0]) {
																dnzddjobj("%c宁小影-电脑-1905会员自动解析-02-工作中");
															} else if (!document.querySelector("div.sc-content.clearfix.hidden") && $("div.clearfix.rightCon_player>div.style_one.clearfix>p>a:contains('开通'):contains('会员')")[0] && $("div.sc-content.clearfix:contains('看'):contains('会员'):contains('完整')")[0]) {
																dnzddjobj("%c宁小影-电脑-1905会员自动解析-03-工作中");
															} else if ($('[class*="how"] [class*="ip"]:contains("费"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-1905会员自动解析-04-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/www\.bilibili\.com\/bangumi\/play\//)) {
															if ($("#player_mask_module div.twp-title:contains('会员'):contains('看')")[0] && $("#player_mask_module div.twp-btns:contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-01-工作中");
															} else if ($(".mask-info:contains('地区'):contains('无法')")[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-02-工作中");
															} else if ($(".twp-title:contains('会员')")[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-03-工作中");
															} else if ($('[class*="player"][class*="toast"]:contains("会员"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-04-工作中");
															} else if ($('[class*="player"][class*="toast"]:contains("费"):contains("看")')[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-05-工作中");
															} else if ($('[class*="player"][class*="toast"]:contains("试看")')[0]) {
																dnzddjobj("%c宁小影-电脑-哔哩哔哩会员自动解析-06-工作中");
															} else {}
														} else if (obj.match(/^https?:\/\/www\.acfun\.cn\/bangumi\//)) {
															if (document.querySelector('li[class="single-p active"][data-href] span').innerText.match(/^\s*?(?:vip|付费|抢鲜)\s*?$/i)) {
																dnzddjobj("%c宁小影-电脑-AcFun会员自动解析-01-工作中");
															} else {}
														} else {}
													} catch (err) {}
												}
												if (vipzdjx == 1) {
													document.querySelector("jiangxiaobai").remove();
													setTimeout(function() {
														zdztsp();
														zddjobj();
														dnzdpdobj();
														log("%c宁小影-电脑全局自动解析-工作中", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
													}, 123);
												} else {}
											} else {}
										}
									} else {
										function sjzdpdobj() {
											if (!document.querySelector("\u5b81\u5c0f\u5f71\u624b\u673a\u81ea\u52a8\u5224\u65ad")) {
												document.body.appendChild(document.createElement("宁小影手机自动判断"));
											} else {}
										};
										function sjzddjobj(zddjlog) {
											document.querySelector("jiangxiaobai").remove();
											zdztsp();
											zddjobj();
											sjzdpdobj();
											log(zddjlog, "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
										};
										function jiangxiaobaiviphyzdpd(ele) {
											if (!document.querySelector("\u5b81\u5c0f\u5f71\u81ea\u52a8\u5224\u65ad\u591a\u4f59")) {
												if (!document.querySelector("#jxbhttps")) {
													window.close();
												} else {} if (document.querySelector('ul#jxbewjul')) {
													if (!document.querySelector('a[href*="963540817"]')) {
														window.close();
													} else if (!document.querySelector('a[href*="tFMqx2nr"]')) {
														window.close();
													} else {}
												} else {} if ((document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])') != null) && document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').src.match(jxjkwzobj)) {
													try {
														if ((document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').src.match(jxjkwzobj)) && document.querySelector('iframe[src^="http"][src*="=http"][allowfullscreen]:not([style*="display:none"]):not([style*="display: none"])').getAttribute('id') != '\u5b81\u5c0f\u5f71') {
															try {
																window.close();
															} catch (err) {
																zdpddyobj();
															}
														} else {} if (document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong") != null) {
															if ((document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong:first-child").innerText.match(/^\u5b81$/)) && (document.querySelector("div#\u5b81\u5c0f\u5f71>div>strong:last-of-type").innerText.match(/^\u5f71$/))) {} else {
																try {
																	window.close();
																} catch (err) {
																	zdpddyobj();
																}
															}
														} else {}
													} catch (err) {
														zdpddyobj();
													}
												} else if (document.querySelector('[style*="eggvod"]') != null) {
													try {
														document.querySelector('[style*="eggvod"]').parentNode.remove();
													} catch (err) {
														zdpddyobj();
													}
												} else if (document.querySelector('[href^="javascript"][style*="data"][style*="image"]') != null) {
													try {
														document.querySelector('[href^="javascript:"][style*="data:image/"]').parentNode.remove();
													} catch (err) {
														zdpddyobj();
													}
												} else if (document.querySelector('[href^="javascript"][target*="_blank"]') != null) {
													try {
														document.querySelector('[href^="javascript"][target*="_blank"]').remove();
													} catch (err) {
														zdpddyobj();
													}
												} else {}
											} else {} if (!document.querySelector('div#宁小影') && document.querySelector("jiangxiaobai") && !document.querySelector("\u5b81\u5c0f\u5f71\u624b\u673a\u81ea\u52a8\u5224\u65ad")) {
												if (vipzdjx == 1) {
													if (obj.match(/^https?:\/\/m\.mgtv\.com\/b\//)) {
														if ($('[class*="box"]:contains("费"):contains("看")')[0]) {
															sjzddjobj("%c宁小影-手机-芒果TV会员自动解析-01-工作中");
														} else if ($('[class*="error"]:contains("版权"):contains("限制")')[0]) {
															sjzddjobj("%c宁小影-手机-芒果TV会员自动解析-02-工作中");
														} else {}
													} else if (obj.match(/^https?:\/\/m\.pptv\.com\/show\//)) {
														if ($('[class*="tip"]:contains("看"):contains("费")')[0]) {
															sjzddjobj("%c宁小影-手机-PPTV会员自动解析-01-工作中");
														} else if ($('[class*="info"]>[class*="title"] i[class*="icon"]:contains("VIP")')[0] && $('[id*="play-complete-"]:contains("看"):contains("完整")')[0]) {
															sjzddjobj("%c宁小影-手机-PPTV会员自动解析-02-工作中");
														} else {}
													} else {}
												} else if (vipzdjx == 2) {
													sjzdpdobj();
													document.querySelector("jiangxiaobai").remove();
													zddjobj();
												} else {}
											} else {}
										}
									}
								};
								try {
									if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") && obj.match(/&autoplay=1&metareferer=/)) {
										panduanshebeiobj();
									} else {
										pczdjxycobj = setInterval(function() {
											if (document.querySelector("\u6211\u662f\u5b81\u5c0f\u5f71\u751f\u6d3b\u5f88\u7b80\u5355") && document.querySelector("div#jxbhttps")) {
												if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
													if (vipzdjx == 1) {
														(() => {
															let qjzdjxjjjxbvolumebobj_counter = 0;
															let qjzdjxjjjxbvolumebobj_jiankong = setInterval(() => {
																let qjzdjxjjjxbvolumebobj_btn = document.querySelector("video");
																if (qjzdjxjjjxbvolumebobj_btn.volume != 0) {
																	jxbvolumebobj();
																	clearInterval(qjzdjxjjjxbvolumebobj_jiankong);
																	return false;
																}++qjzdjxjjjxbvolumebobj_counter;
																if (qjzdjxjjjxbvolumebobj_counter > 25) {
																	clearInterval(qjzdjxjjjxbvolumebobj_jiankong);
																	return false;
																}
															}, 2345)
														})();
													} else {
														panduanshebeiobj();
													}
												} else {
													panduanshebeiobj();
												}
												clearInterval(pczdjxycobj);
											} else {}
										}, 234);
										function sjjxbvipzcjxobj() {
											if (document.querySelector("\u5b81\u5c0f\u5f71\u624b\u673a\u7f51\u9875") && (vipzdjx == 1 || vipzdjx == 2)) {
												if (obj.match(/^https?:\/\/(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)/)) {
													if (document.querySelector("div#宁小影") == null) {
														try {
															document.querySelector("jiangxiaobai").remove();
														} catch (err) {}
														sessionStorage.setItem('jxbviplog', '1');
														zddjjk();
														log("%c手机会员视频自动判断--再次点击", "border-left:5px solid #03A9F4;color:#03A9F4;padding:3px");
													} else {}
												}
											} else {}
										};
										setTimeout(sjjxbvipzcjxobj, 4567);
										setTimeout(sjjxbvipzcjxobj, 6789);
									}
								} catch (err) {
									panduanshebeiobj();
								}
							}
						} catch (err) {}
						document.onreadystatechange = function() {
							"complete" == document.readyState && setTimeout(function() {
								if (window.location.href.match(/^https?:\/\/(?:v(?:-wb)?\.youku\.com\/v_show\/id_|m\.youku\.com\/.+?\/id_|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/cover|variety\/p\/topic)\/|(?:3g|m)\.v\.qq\.com\/.*?(?:[cv]id=|cover\/)|w(?:ww)?\.mgtv\.com\/(?:b|act)\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[awv]_|kszt\/)|tw\.iqiyi\.com\/v_|m\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|film\.sohu\.com\/album\/|m\.tv\.sohu\.com\/(?:v|phone_play_film\?aid=)|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|v\.pptv\.com\/show\/|m\.pptv\.com\/show\/|vip\.1905\.com\/play\/|www\.bilibili\.com\/bangumi\/play\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/bangumi\/|m\.acfun\.cn\/v\/)/) && !(window.location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/(?:a_|kszt\/)/) && document.title.match(new RegExp("在线观看"))) && !(window.location.href.match(/^https?:\/\/(?:www|m)\.iqiyi\.com\/v_/) && document.title.match(new RegExp("名师课堂")))) {
									if (document.querySelector("div#jxbhttps") != null) {
										if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
											zdbt();
											if (vipzdjx == 1) {
												panduanshebeiobj();
											}
										} else {}
									} else {
										location.reload();
									}
								} else if (window.location.href.match(/^https?:\/\/[^\/]+?\/(?:tv|acg|mov)\/\d+?\/\d+?\.html/)) {
									if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875")) {
										zdbt();
									} else {}
								} else {} if (lkzdzt == 1) {
									(function() {
										try {
											let titleTime;
											let OriginTitile = document.title;
											document.addEventListener('visibilitychange', function() {
												let videoaobj = document.querySelector("video"), videobobj = document.querySelector('div#宁小影');
												if (document.hidden && videoaobj && !videobobj) {
													videoaobj.pause();
													document.title = '自动暂停';
													clearTimeout(titleTime);
												} else if (videoaobj && !videobobj) {
													videoaobj.play();
													document.title = '恢复播放';
													titleTime = setTimeout(function() {
														document.title = OriginTitile;
													}, 1234);
												} else {}
											});
										} catch (err) {}
									})();
								} else if (lkzdzt == 0) {}
								if (pcliwaiobj) {
									if (localStorage.getItem("pcjkzdyj") == '0') {} else {
										(function() {
											let zdjkhttpsjk_counter = 0;
											let zdjkhttpsjk_jiankong = setInterval(function() {
												let zdjkhttpsjk_btn = document.querySelector("ul#httpsvipul>li:last-of-type");
												if (zdjkhttpsjk_btn) {
													try {
														$('ul#httpsvipul>li').click(function() {
															if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2") == null) {} else {
																let httpsjksz = document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd>a2").textContent;
																if (obj.match(/^https?:\/\/m\.acfun\.cn\/v\//)) {
																	if (document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																		localStorage.setItem("httpsjk", httpsjksz)
																	} else {}
																} else {
																	if (!document.querySelector('ul#httpsvipul>li>span.wsjxbshhjd>a4').innerText.match(new RegExp("^\s*?跳\s*?-"))) {
																		if (document.querySelector("\u5b81\u5c0f\u5f71\u7535\u8111\u7f51\u9875") != null) {
																			if (localStorage.getItem("pcjkzdyj") == '1') {
																				localStorage.setItem("httpsjk", httpsjksz);
																			} else {}
																		} else {
																			localStorage.setItem("httpsjk", httpsjksz);
																		}
																	} else {}
																}
															}
														})
													} catch (err) {
														return false
													}
													clearInterval(zdjkhttpsjk_jiankong);
													return false
												}++zdjkhttpsjk_counter;
												if (zdjkhttpsjk_counter > 20) {
													clearInterval(zdjkhttpsjk_jiankong);
													return false
												}
											}, 500)
										})();
									}
								} else {} if (jxbpcobj && vipjxss == 1 && !ttbkjjliobj && !objj.match(/(?:pan|yun)\.baidu/)) {
									(function() {
										try {
											let jxbzdwss = document.title.replace(/(?:动[漫画]|电(?:视剧|影)|综艺)\s*?_/, "").replace(/^动态漫画\s*?[\W_]\s*?/, "").replace(/(?:会员|升级|加长)\w*?\s*?版/, "").replace(/（[^）]+?）\s*?第/, "第").replace(/^(\W+?)\s*?（[^\w）:：]+?）\s*?([：:].*)$/, "$1$2").replace(/^([^：]+?)\s*?：(?:先导片|彩蛋|看点|花絮|预告|片花|神剧亮了)\s*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)\s*?\d+?.*?\1\s*?第.+?$/i, "$1").replace(/^(?:\s*?[\-\—\_<《\(（\[【]\s*?)?([^\s:：]+?)(?:\d{1,3}\s*?)?(?:\-|\—|\_|>|》|\)|）|:|：|\s+?).*?$/, "$1").replace(/^#([^\s]+?)\s*?\(\s*?[^\\u4e00-\\u9fa5a-z].*?$/i, "$1").replace(/^([^\\u4e00-\\u9fa5a-z\s:：\-]+?)[\[【\(（:：]?第?\s*?\d+?\s*?[部季集话部期].*?$/i, "$1").replace(/^([^\-\s]+?)(?:\(|第)\s*?.{1,3}[部季集话部期].*?$/, "$1").replace(/^([^\\u4e00-\\u9fa5a-z]+?)(?:电视剧|剧集|电影|综艺|动漫)\W*?\s*?[\[【\(（].*?$/i, "$1").replace(/^([^\.\_\-]+?)\.[_\-].*?$/, "$1").replace(/^([^:：\(]+?)。.*?$/, "$1").replace(/^([^\-\s]+?)—[^\\u4e00-\\u9fa5a-z]+?—.*?$/i, "$1").replace(/([^\\u4e00-\\u9fa5]+?)[a-zA-Z0-9]+?((?:\s+|$))/, "$1$2").replace(/^([^\(（]+?)[\(（].*$/, "$1").replace(/(^\w+?)\s*?[\s*?:/,"$1:").replace(/^[^《<]+?[《<]/, "");
											let maomibtn = document.createElement("div");
											maomibtn.innerHTML = '<div class="maomibtn"><ul><li><a class="maomi">\u5f39</a><ul><li id="jxbqyjxli"><hr><a href="' + atob("aHR0cHM6Ly9jZW8zMC5jb2RpbmcubmV0L3AvY2VvMzAvZC9jZW8zMC9naXQvcmF3L21hc3Rlci85NjM1NDA4MTctMS5wbmc=") + '" target="_blank" style="border-radius:1px;color:#000!important;box-shadow:inset rgba(255,254,255,.6) 0 0.3em 0.3em,inset rgba(0,0,0,.15) 0 -0.1em 0.3em,#d82661 0 0.1em 3px,#b7144a 0 0.3em 1px, rgba(0,0,0,.2) 0 0.5em 5px;background:0 0;font-weight:700;font-size:16px;text-decoration:none;background-color:#4CAF50;margin-top:1px;">\u53cb\u60c5\u8d5e\u52a9</a></li><br><li id="jxbqqjq"><a target="_blank" href="https://jq.qq.com/?_wv=1027&k=tFMqx2nrL" style="background:aqua;color:midnightblue;">加入QQ群</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="http://www.bumimi99.com/search/' + jxbzdwss + '" target="_blank">布米米</a></li>' + '<li><a onclick="document.querySelector(\'jxqvipimg\').click();" href="https://www.cupfox.com/search?key=' + encodeURIComponent(jxbzdwss) + '" target="_blank">茶杯狐</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="https://www.jiaomh.com/search.php?searchword=' + encodeURIComponent(jxbzdwss) + '" target="_blank">麻花影视</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="http://www.wbdy.tv/index.php?m=vod-search&wd=' + encodeURIComponent(jxbzdwss) + '" target="_blank">网吧电影</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(jxbzdwss) + '" target="_blank">Youtube</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="https://miao101.com/search?q=' + encodeURIComponent(jxbzdwss) + '" target="_blank">旋风影视</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="https://www.555dy6.com/vodsearch/-------------.html?wd=' + encodeURIComponent(jxbzdwss) + '" target="_blank">555电影</a></li><li style="display:none;"><a onclick="document.querySelector(\'jxqvipimg\').click();" href="http://pgso.cnjsjf.com/?s/' + encodeURIComponent(jxbzdwss) + '.html" target="_blank">古云搜索</a></li><li><a href="http://ivi.bupt.edu.cn/" target="_blank" style="background-color:yellow;">电视直播</a></li>' + '<li id="ckkjjjobjli"><a id="jxbkjj" style="background-color:darksalmon;" href="javascript:(function(){try{alert(\'快捷键 Alt + Ctrl + / 恢复 脚本默认设置 并刷新当前网页，\\n快捷键 Alt + Ctrl + ; 将 原网页解析 变成 弹大窗解析，再按恢复，\\n快捷键 Alt + Ctrl + \\\' 将 原网页解析 变成 跳转解析，再按恢复，\\n快捷键 Alt + Ctrl + \\\\ 将 原网页解析 变成 小窗口解析，再按恢复，\\n快捷键 Alt + Ctrl + , 将 小窗口解析 变成 弹大窗解析，再按恢复，\\n快捷键 Alt + Ctrl + . 将 小窗口解析 变成 跳转解析，再按恢复，\\n快捷键 Alt + Ctrl + - 开启 或 关闭 离开自动暂停功能，\\n快捷键 Alt + / 显示图标 或者 隐藏图标，\\n快捷键 Alt + ; 查看此脚本快捷键，\\n快捷键 Alt + . 开启 或 关闭 自动关闭弹幕功能，\\n快捷键 Ctrl + \\\' 开启 或 关闭 当前网站 的 自动解析，\\n快捷键 , 使用--布米米资源--搜索当前视频资源，\\n快捷键 ; 显示--接口列表，\\n快捷键 \\\' 普通视频 原始全屏，\\n快捷键 \\\\ 普通视频 开启画中画，\\n快捷键 - 使用随机接口 弹窗解析，\\n快捷键 = 使用随机接口 原网页解析。\');}catch(err){return false;}})();">快捷键</a></li>' + '<hr><li id="gbkjjjobjli" style="display:none;"><a id="gbkjjjobj" style="color:beige;">关闭快捷</a></li><li id="vipjxtbli" style="display:none;"><a id="vipjxtb" style="color:beige;">显示图标</a></li><li id="vipvideotgli" style="display:none;"><a id="vipvideotg" style="color:beige;">跳过广告</a></li><li id="mgzdgqli" style="display:none;"><a id="mgzdgq" style="color:beige;">超清画质</a></li><li id="ymyypdobjli" style="display:none;"><a id="ymyypdobj" style="color:beige;">没有会员</a></li><li id="gbdmobjli" style="display:none;"><a id="gbdmobj" style="color:beige;">关闭弹幕</a></li><li id="vipzdjxli" style="display:none;"><a id="vipzdjx" style="color:beige;">解析会员</a></li><li id="vipzdjxhyli" style="display:none;"><a id="vipzdjxhy" style="color:beige;">解析会员</a></li><li id="lkzdztbyli" style="display:none;"><a id="lkzdztby" style="color:beige;">自动暂停</a></li><li id="pcjxzdqpli" style="display:none;"><a id="pcjxzdqp" style="color:beige;">全屏默认</a></li><li id="pcjkzdyjli" style="display:none;"><a id="pcjkzdyj" style="color:beige;">关闭记忆</a></li></ul></li></ul></div>';
											document.body.appendChild(maomibtn);
											let style = document.createElement("style");
											style.type = "text/css";
											style.innerHTML = ".maomibtn{font-family:arial,sans-serif;padding:0;margin:50px;z-index:963540817;position:absolute;top:30px;transform:scale(0.8);right:-45px;font-size:30px}.maomibtn ul{padding:0;margin:0;list-style-type:none}.maomibtn ul li{float:left;position:relative;list-style-type:none}.maomibtn ul li a,.maomibtn ul li a:visited{display:block;text-align:center;text-decoration:none;width:100px;height:30px;color:#000;border:2px solid #4CAF50;background:#c9c9a7;line-height:30px;font-size:20px}.maomibtn ul li ul{display:none}.maomibtn ul li:hover ul{display:block;position:absolute;top:30px;right:0;width:105px}.maomibtn ul li:hover ul li a{display:block;background:#faeec7;color:#000}.maomibtn ul li:hover ul li a:hover{background:#dfc184!important;color:#000!important}a.maomi{width:25px!important;height:auto!important;border-radius:10px}";
											document.querySelector(".maomibtn").appendChild(style);
										} catch (err) {}
										function dssxbobj() {
											setTimeout(function() {
												window.location.reload();
											}, 666);
										};
										(function() {
											if (localStorage.getItem("lkzdzt") == '0') {
												document.getElementById('lkzdztby').innerText = '暂停默认';
												document.querySelector("#lkzdztby").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("lkzdzt") == '1') {
												document.getElementById('lkzdztby').innerText = '自动暂停';
												document.querySelector("#lkzdztby").style.backgroundColor = '#005200';
											}
											document.getElementById('lkzdztby').onclick = function() {
												if (this.innerHTML == '暂停默认') {
													localStorage.setItem("lkzdzt", "1");
													this.innerText = '自动暂停';
													document.querySelector("#lkzdztby").style.backgroundColor = '#005200';
													alert('已经开启 当前网站 的 自动暂停普通视频 功能');
													dssxbobj();
												} else if (this.innerHTML == '自动暂停') {
													localStorage.setItem("lkzdzt", "0");
													this.innerText = '暂停默认';
													document.querySelector("#lkzdztby").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 自动暂停普通视频 功能');
													dssxbobj();
												}
											}
										})();
										(function() {
											if (localStorage.getItem("jxzdqp") == '0') {
												document.getElementById('pcjxzdqp').innerText = '全屏默认';
												document.querySelector("#pcjxzdqp").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("jxzdqp") == '1') {
												document.getElementById('pcjxzdqp').innerText = '解析全屏';
												document.querySelector("#pcjxzdqp").style.backgroundColor = '#005200';
											}
											document.getElementById('pcjxzdqp').onclick = function() {
												if (this.innerHTML == '全屏默认') {
													localStorage.setItem("jxzdqp", "1");
													this.innerText = '解析全屏';
													document.querySelector("#pcjxzdqp").style.backgroundColor = '#005200';
													alert('已经开启 当前网站 的 自动原网页解析全屏');
													dssxbobj();
												} else if (this.innerHTML == '解析全屏') {
													localStorage.setItem("jxzdqp", "0");
													this.innerText = '全屏默认';
													document.querySelector("#pcjxzdqp").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 自动原网页解析全屏');
													dssxbobj();
												}
											}
										})();
										(function() {
											if (localStorage.getItem("mgzdgq") == '0') {
												document.getElementById('mgzdgq').innerText = '默认画质';
												document.querySelector("#mgzdgq").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("mgzdgq") == '1') {
												document.getElementById('mgzdgq').innerText = '强制超清';
												document.querySelector("#mgzdgq").style.backgroundColor = '#005200'
											} else if (localStorage.getItem("mgzdgq") == '2') {
												document.getElementById('mgzdgq').innerText = '强制高清';
												document.querySelector("#mgzdgq").style.backgroundColor = 'brown'
											}
											document.getElementById('mgzdgq').onclick = function() {
												if (this.innerHTML == '默认画质') {
													localStorage.setItem("mgzdgq", "1");
													this.innerText = '强制超清';
													document.querySelector("#mgzdgq").style.backgroundColor = '#005200';
													alert('电脑芒果TV-强制超清');
													if (document.querySelector('a[data-name="超清"][data-purview="true"]')) {
														document.querySelector('a[data-name="超清"][data-purview="true"]').click();
													} else if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
														document.querySelector('a[data-name="高清"][data-purview="true"]').click();
													} else {
														document.querySelector('a[data-name="高清"][data-purview="true"]').click()
													}
													dssxbobj()
												} else if (this.innerHTML == '强制超清') {
													localStorage.setItem("mgzdgq", "2");
													this.innerText = '强制高清';
													document.querySelector("#mgzdgq").style.backgroundColor = 'brown';
													alert('电脑芒果TV-强制高清');
													if (document.querySelector('a[data-name="高清"][data-purview="true"]')) {
														document.querySelector('a[data-name="高清"][data-purview="true"]').click()
													} else {
														document.querySelector('a[data-name="高清"][data-purview="true"]').click()
													}
													dssxbobj()
												} else if (this.innerHTML == '强制高清') {
													localStorage.setItem("mgzdgq", "0");
													this.innerText = '默认画质';
													document.querySelector("#mgzdgq").style.backgroundColor = '#268dcd';
													alert('电脑芒果TV-默认画质');
													dssxbobj();
												}
											}
										})();
										(function() {
											if (localStorage.getItem("vipzdjx") == '0') {
												document.getElementById('vipzdjx').innerText = '手动解析';
												document.querySelector("#vipzdjx").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("vipzdjx") == '1') {
												document.getElementById('vipzdjx').innerText = '解析全部';
												document.querySelector("#vipzdjx").style.backgroundColor = '#005200';
											} else if (localStorage.getItem("vipzdjx") == '2') {
												document.getElementById('vipzdjx').innerText = '解析会员';
												document.querySelector("#vipzdjx").style.backgroundColor = 'brown';
											}
											document.getElementById('vipzdjx').onclick = function() {
												if (this.innerHTML == '手动解析') {
													localStorage.setItem("vipzdjx", "1");
													this.innerText = '解析全部';
													document.querySelector("#vipzdjx").style.backgroundColor = '#005200';
													alert('已经开启 当前网站 的 全部视频自动解析 功能');
													dssxbobj();
												} else if (this.innerHTML == '解析全部') {
													localStorage.setItem("vipzdjx", "2");
													this.innerText = '解析会员';
													document.querySelector("#vipzdjx").style.backgroundColor = 'brown';
													alert('已经开启 当前网站 的 会员自动解析 功能');
												} else if (this.innerHTML == '解析会员') {
													localStorage.setItem("vipzdjx", "0");
													this.innerText = '手动解析';
													document.querySelector("#vipzdjx").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 自动解析 功能\n要想解析，请从 网页左三角的钻石按钮\n自行选择接口');
												}
											};
										})();
										(function() {
											if (localStorage.getItem("vipzdjx") == '0') {
												document.getElementById('vipzdjxhy').innerText = '手动解析';
												document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
											} else if (localStorage.getItem("vipzdjx") == '2') {
												document.getElementById('vipzdjxhy').innerText = '解析会员';
												document.querySelector("#vipzdjxhy").style.backgroundColor = 'blue';
											}
											document.getElementById('vipzdjxhy').onclick = function() {
												if (this.innerHTML == '手动解析') {
													localStorage.setItem("vipzdjx", "2");
													this.innerText = '解析会员';
													document.querySelector("#vipzdjxhy").style.backgroundColor = 'blue';
													alert('已经开启 当前网站 的 会员自动解析 功能');
													dssxbobj();
												} else if (this.innerHTML == '解析会员') {
													localStorage.setItem("vipzdjx", "0");
													this.innerText = '手动解析';
													document.querySelector("#vipzdjxhy").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 自动解析 功能\n要想解析，请从 网页左三角的钻石按钮\n自行选择接口');
													dssxbobj();
												}
											}
										})();
										(function() {
											if (localStorage.getItem("pcjkzdyj") == '0') {
												document.getElementById('pcjkzdyj').innerText = '关闭记忆';
												document.querySelector("#pcjkzdyj").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("pcjkzdyj") == '1') {
												document.getElementById('pcjkzdyj').innerText = '自动记忆';
												document.querySelector("#pcjkzdyj").style.backgroundColor = '#005200'
											} else if (localStorage.getItem("pcjkzdyj") == '2') {
												document.getElementById('pcjkzdyj').innerText = '快捷记忆';
												document.querySelector("#pcjkzdyj").style.backgroundColor = 'brown'
											}
											document.getElementById('pcjkzdyj').onclick = function() {
												if (this.innerHTML == '关闭记忆') {
													localStorage.setItem("pcjkzdyj", "1");
													this.innerText = '自动记忆';
													document.querySelector("#pcjkzdyj").style.backgroundColor = '#005200';
													alert('已经开启 当前网站 的 自动记忆使用接口 功能');
													location.reload();
												} else if (this.innerHTML == '自动记忆') {
													localStorage.setItem("pcjkzdyj", "2");
													this.innerText = '快捷记忆';
													document.querySelector("#pcjkzdyj").style.backgroundColor = 'brown';
													alert('已经关闭鼠标点击接口记忆，\n只记忆快捷键随机解析接口记忆')
												} else if (this.innerHTML == '快捷记忆') {
													localStorage.setItem("pcjkzdyj", "0");
													this.innerText = '关闭记忆';
													document.querySelector("#pcjkzdyj").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 自动记忆使用接口 功能')
												}
											}
										})();
										(function() {
											if (localStorage.getItem("vipvideotg") == '0') {
												document.getElementById('vipvideotg').innerText = '默认广告';
												document.querySelector("#vipvideotg").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("vipvideotg") == '1') {
												document.getElementById('vipvideotg').innerText = '跳过广告';
												document.querySelector("#vipvideotg").style.backgroundColor = '#005200'
											}
											document.getElementById('vipvideotg').onclick = function() {
												if (this.innerHTML == '跳过广告') {
													localStorage.setItem("vipvideotg", "0");
													this.innerText = '默认广告';
													document.querySelector("#vipvideotg").style.backgroundColor = '#005200';
													alert('当前网站 的 跳过视频广告 功能，已经关闭');
													dssxbobj()
												} else if (this.innerHTML == '默认广告') {
													localStorage.setItem("vipvideotg", "1");
													this.innerText = '跳过广告';
													document.querySelector("#vipvideotg").style.backgroundColor = '#268dcd';
													alert('当前网站 的 跳过视频广告 功能，已经开启');
													dssxbobj()
												}
											}
										})();
										(function() {
											if (localStorage.getItem("ymyypdobj") == '0') {
												document.getElementById('ymyypdobj').innerText = '没有会员';
												document.querySelector("#ymyypdobj").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("ymyypdobj") == '1') {
												document.getElementById('ymyypdobj').innerText = '已有会员';
												document.querySelector("#ymyypdobj").style.backgroundColor = '#005200'
											}
											document.getElementById('ymyypdobj').onclick = function() {
												if (this.innerHTML == '已有会员') {
													localStorage.setItem("ymyypdobj", "0");
													this.innerText = '没有会员';
													document.querySelector("#ymyypdobj").style.backgroundColor = '#005200';
													dssxbobj()
												} else if (this.innerHTML == '没有会员') {
													localStorage.setItem("ymyypdobj", "1");
													this.innerText = '已有会员';
													document.querySelector("#ymyypdobj").style.backgroundColor = '#268dcd';
													dssxbobj()
												}
											}
										})();
										(function() {
											if (localStorage.getItem("gbkjjjobj") == '0') {
												document.getElementById('gbkjjjobj').innerText = '关闭快捷';
												document.querySelector("#gbkjjjobj").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("gbkjjjobj") == '1') {
												document.getElementById('gbkjjjobj').innerText = '开启快捷';
												document.querySelector("#gbkjjjobj").style.backgroundColor = '#005200'
											}
											document.getElementById('gbkjjjobj').onclick = function() {
												if (this.innerHTML == '开启快捷') {
													localStorage.setItem("gbkjjjobj", "0");
													this.innerText = '关闭快捷';
													document.querySelector("#gbkjjjobj").style.backgroundColor = '#005200';
													alert('已经开启 当前网站 的 VIP脚本快捷键 功能');
													dssxbobj()
												} else if (this.innerHTML == '关闭快捷') {
													localStorage.setItem("gbkjjjobj", "1");
													this.innerText = '开启快捷';
													document.querySelector("#gbkjjjobj").style.backgroundColor = '#268dcd';
													alert('已经关闭 当前网站 的 VIP脚本快捷键 功能');
													dssxbobj()
												}
											}
										})();
										(function() {
											if (localStorage.getItem("gbdmobj") == '0') {
												document.getElementById('gbdmobj').innerText = '默认弹幕';
												document.querySelector("#gbdmobj").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("gbdmobj") == '1') {
												document.getElementById('gbdmobj').innerText = '关闭弹幕';
												document.querySelector("#gbdmobj").style.backgroundColor = '#005200'
											}
											document.getElementById('gbdmobj').onclick = function() {
												if (this.innerHTML == '关闭弹幕') {
													localStorage.setItem("gbdmobj", "0");
													this.innerText = '默认弹幕';
													document.querySelector("#gbdmobj").style.backgroundColor = '#005200';
													alert('当前网站 的 普通视频 弹幕功能，已经自动关闭');
													dssxbobj()
												} else if (this.innerHTML == '默认弹幕') {
													localStorage.setItem("gbdmobj", "1");
													this.innerText = '关闭弹幕';
													document.querySelector("#gbdmobj").style.backgroundColor = '#268dcd';
													alert('当前网站 的 普通视频 弹幕功能，已经恢复默认');
													dssxbobj()
												}
											}
										})();
										(function() {
											function vipjxtbxs() {
												document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps,div.maomibtn{opacity:1}</style>');
											};
											function vipjxtbgb() {
												document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>');
											};
											function vipjxtbzs() {
												document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobai" media="screen">div#jxbhttps{opacity:1}div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
											};
											if (localStorage.getItem("vipjxtb") == '0') {
												document.getElementById('vipjxtb').innerText = '关闭图标';
												document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd'
											} else if (localStorage.getItem("vipjxtb") == '1') {
												document.getElementById('vipjxtb').innerText = '显示图标';
												document.querySelector("#vipjxtb").style.backgroundColor = '#005200'
											} else if (localStorage.getItem("vipjxtb") == '2' && (pcliwaiobj)) {
												document.getElementById('vipjxtb').innerText = '只显钻石';
												document.querySelector("#vipjxtb").style.backgroundColor = '#0087ff'
											} else if (localStorage.getItem("vipjxtb") == '2' && ttblwobj) {
												document.getElementById('vipjxtb').innerText = '显示图标';
												document.querySelector("#vipjxtb").style.backgroundColor = '#005200'
											}
											document.getElementById('vipjxtb').onclick = function() {
												if (pcliwaiobj || ttblwobj) {
													if (this.innerHTML == '关闭图标') {
														if (pcliwaiobj) {
															localStorage.setItem("vipjxtb", "2");
															this.innerText = '只显钻石';
															document.querySelector("#vipjxtb").style.backgroundColor = '#0087ff';
															vipjxtbzs();
															alert('只显示 网页左三角 钻石图标');
														} else if (ttblwobj) {
															localStorage.setItem("vipjxtb", "1");
															this.innerText = '显示图标';
															document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
															vipjxtbxs();
															alert('图标恢复默认显示');
														}
													} else if (this.innerHTML == '只显钻石') {
														localStorage.setItem("vipjxtb", "1");
														this.innerText = '显示图标';
														document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
														vipjxtbxs();
														alert('图标恢复默认显示');
													} else if (this.innerHTML == '显示图标') {
														localStorage.setItem("vipjxtb", "0");
														this.innerText = '关闭图标';
														document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd';
														vipjxtbgb();
														alert('图标已经关闭显示\n鼠标移动到图标原来的位置，可以暂时显示\n或者按 快捷键 Alt + / 可以恢复');
													}
												} else {
													if (this.innerHTML == '关闭图标') {
														localStorage.setItem("vipjxtb", "1");
														this.innerText = '显示图标';
														document.querySelector("#vipjxtb").style.backgroundColor = '#005200';
														vipjxtbxs();
														alert('图标恢复默认显示');
													} else if (this.innerHTML == '显示图标') {
														localStorage.setItem("vipjxtb", "0");
														this.innerText = '关闭图标';
														document.querySelector("#vipjxtb").style.backgroundColor = '#268dcd';
														vipjxtbgb();
														alert('图标已经关闭显示\n鼠标移动到图标原来的位置，可以暂时显示\n或者按 快捷键 Alt + / 可以恢复');
													}
												}
											}
										})()
									})();
								} else if (vipjxss == 0) {}
							}, 666);
						};
						if (vipjxtb == 0) {
							try {
								function viptbjiangxiaobaia() {
									document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaia" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>')
								};
								try {
									viptbjiangxiaobaia()
								} catch (err) {
									viptbjiangxiaobaia()
								};
								function viptbjiangxiaobaiadsq() {
									if (!document.querySelector("head>style.viptb-jiangxiaobaia")) {
										viptbjiangxiaobaia()
									} else {}
								};
								setTimeout(viptbjiangxiaobaiadsq, 3333)
							} catch (err) {
								function viptbjiangxiaobaia() {
									document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaia" media="screen">div#jxbhttps,div.maomibtn{opacity:0}div#jxbhttps:hover,div.maomibtn:hover{opacity:1}</style>')
								};
								try {
									viptbjiangxiaobaia()
								} catch (err) {
									viptbjiangxiaobaia()
								};
								function viptbjiangxiaobaiadsq() {
									if (!document.querySelector("head>style.viptb-jiangxiaobaia")) {
										viptbjiangxiaobaia()
									} else {}
								};
								setTimeout(viptbjiangxiaobaiadsq, 3333)
							}
						} else if (vipjxtb == 2) {
							try {
								function viptbjiangxiaobaib() {
									document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaib" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
								};
								try {
									viptbjiangxiaobaib()
								} catch (err) {
									viptbjiangxiaobaib()
								};
								function viptbjiangxiaobaibdsq() {
									if (!document.querySelector("head>style.viptb-jiangxiaobaib")) {
										viptbjiangxiaobaib()
									} else {}
								};
								setTimeout(viptbjiangxiaobaibdsq, 3333)
							} catch (err) {
								function viptbjiangxiaobaib() {
									document.head.insertAdjacentHTML("beforeend", '<style class="viptb-jiangxiaobaib" media="screen">div.maomibtn{opacity:0}div.maomibtn:hover{opacity:1}</style>')
								};
								try {
									viptbjiangxiaobaib()
								} catch (err) {
									viptbjiangxiaobaib()
								};
								function viptbjiangxiaobaibdsq() {
									if (!document.querySelector("head>style.viptb-jiangxiaobaib")) {
										viptbjiangxiaobaib()
									} else {}
								};
								setTimeout(viptbjiangxiaobaibdsq, 3333)
							}
						} else if (vipjxtb == 1) {}
						try {
							if (kjjlwobj && localStorage.getItem("gbkjjjobj") != '1') {
								if (jxbpcobj && (pcliwaiobj || ttbkjjliobj || mmkjjtjobj || obj.match(/^https?:\/\/(?:www\.bilibili\.com\/(?!bangumi\/play\/)|www\.acfun\.cn\/(?!bangumi\/))/))) {
									try {
										function ywyjklb() {
											if (pcliwaiobj) {
												(function() {
													try {
														document.querySelector("div#jxbhttps").click();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function zdssspa() {
											if (pcliwaiobj) {
												try {
													document.querySelector("jxqvipimg").click();
												} catch (err) {}
												zdbt();
												jxqzsxobjzdbt();
												(function() {
													try {
														window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.bumimi"]').href, "bkmk_popup");
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function zdssspb() {
											if (pcliwaiobj) {
												try {
													document.querySelector("jxqvipimg").click();
												} catch (err) {}
												zdbt();
												jxqzsxobjzdbt();
												(function() {
													try {
														window.open(document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.wbdy.tv"]').href, "bkmk_popup");
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function zdssspc() {
											if (pcliwaiobj) {
												(function() {
													try {
														window.location.href = document.querySelector('div.maomibtn>ul>li>ul>li>a[href*="//www.jiaomh.com"]').href;
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function jxywyfsgba() {
											if (pcliwaiobj && !objj.match('acfun')) {
												(function() {
													try {
														if (localStorage.getItem("jxywyfsgbobj") != null && !(localStorage.getItem("jxywyfsgbobj") == '2' || localStorage.getItem("jxywyfsgbobj") == '3')) {
															localStorage.removeItem('jxywyfsgbobj');
															alert('现在已经恢复 原网页解析 方式');
														} else {
															localStorage.setItem('jxywyfsgbobj', '1');
															alert('现在是将 原网页解析 强制改成 弹大窗解析 方式');
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function jxywyfsgbb() {
											if (pcliwaiobj && !objj.match('acfun')) {
												(function() {
													try {
														if (localStorage.getItem("jxywyfsgbobj") != null && !(localStorage.getItem("jxywyfsgbobj") == '1' || localStorage.getItem("jxywyfsgbobj") == '3')) {
															localStorage.removeItem('jxywyfsgbobj');
															alert('现在已经恢复 原网页解析 方式');
														} else {
															localStorage.setItem('jxywyfsgbobj', '2');
															alert('现在是将 原网页解析 强制改成 跳转解析 方式');
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function jxywyfsgbc() {
											if (pcliwaiobj && !objj.match('acfun')) {
												(function() {
													try {
														if (localStorage.getItem("jxywyfsgbobj") != null && !(localStorage.getItem("jxywyfsgbobj") == '1' || localStorage.getItem("jxywyfsgbobj") == '2')) {
															localStorage.removeItem('jxywyfsgbobj');
															alert('现在已经恢复 原网页解析 方式');
														} else {
															localStorage.setItem('jxywyfsgbobj', '3');
															alert('现在是将 原网页解析 强制改成 小窗口解析 方式');
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function jxywyfsgbd() {
											if (pcliwaiobj && !objj.match('acfun')) {
												(function() {
													try {
														if (localStorage.getItem("jxcxkfsgbobj") != null && !(localStorage.getItem("jxcxkfsgbobj") == '2')) {
															localStorage.removeItem('jxcxkfsgbobj');
															alert('现在已经恢复 小窗口解析 方式');
														} else {
															localStorage.setItem('jxcxkfsgbobj', '1');
															alert('现在是将 小窗口解析 强制改成 弹大窗解析 方式');
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function jxywyfsgbe() {
											if (pcliwaiobj && !objj.match('acfun')) {
												(function() {
													try {
														if (localStorage.getItem("jxcxkfsgbobj") != null && !(localStorage.getItem("jxcxkfsgbobj") == '1')) {
															localStorage.removeItem('jxcxkfsgbobj');
															alert('现在已经恢复 小窗口解析 方式');
														} else {
															localStorage.setItem('jxcxkfsgbobj', '2');
															alert('现在是将 小窗口解析 强制改成 跳转解析 方式');
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function sdzdqjobj() {
											if (pcliwaiobj) {
												if (localStorage.getItem("vipzdjx") == '0') {
													try {
														localStorage.removeItem('jxywyfsgbobj');
														localStorage.setItem('lkzdzt', '1');
														localStorage.setItem('vipzdjx', '2');
														localStorage.setItem('zdpddy', '1');
														alert('宁小影 自动解析 模式');
														location.reload();
													} catch (err) {}
												} else {
													try {
														localStorage.removeItem('jxywyfsgbobj');
														localStorage.setItem('lkzdzt', '0');
														localStorage.setItem('vipzdjx', '0');
														localStorage.setItem('zdpddy', '0');
														alert('宁小影 手动解析 模式');
														location.reload();
													} catch (err) {}
												}
											} else {}
										};
										function gbkqzdjx() {
											if (pcliwaiobj) {
												(function() {
													try {
														if (localStorage.getItem("vipzdjx") == '0') {
															alert('已经开启 当前网站 的 自动解析会员视频 功能');
															localStorage.setItem('vipzdjx', '2');
														} else {
															alert('已经关闭 当前网站 的 自动解析会员视频 功能');
															localStorage.setItem('vipzdjx', '0');
														}
														location.reload();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function qkjbsz() {
											if (!ttbkjjliobj) {
												(function() {
													try {
														localStorage.clear();
														alert('当前网站 已经恢复 脚本默认设置');
														location.reload();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function tbxsyca() {
											if (!ttbkjjliobj) {
												(function() {
													try {
														document.querySelector("div.maomibtn li#vipjxtbli>a#vipjxtb").click();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function ckjxbkjj() {
											if ((!ttbkjjliobj || objj.match('(?:bilibili|acfun)'))) {
												(function() {
													try {
														document.querySelector("div.maomibtn li>a#jxbkjj").click();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function tbxsycb() {
											if ((!ttbkjjliobj || objj.match('(?:bilibili|acfun)'))) {
												(function() {
													try {
														document.querySelector("div.maomibtn li#lkzdztbyli>a#lkzdztby").click();
														location.reload();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function tbxsycc() {
											if ((!ttbkjjliobj || objj.match('(?:bilibili|acfun)'))) {
												(function() {
													try {
														if (localStorage.getItem("gbdmobj") == '1') {
															alert('已经关闭 当前网站 的 自动关闭普通视频弹幕 功能')
														} else {
															alert('已经开启 当前网站 的 自动关闭普通视频弹幕 功能')
														}
														document.querySelector("div.maomibtn li#gbdmobjli>a#gbdmobj").click();
														location.reload();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function sddja() {
											if (pcliwaiobj || ttbkjjliobj) {
												if (pcliwaiobj) {
													(function() {
														try {
															if (document.querySelector("iframe#宁小影")) {
																try {
																	if (!document.querySelector("img#宁小影")) {
																		try {
																			qpobj(document.querySelector('iframe#宁小影'));
																		} catch (err) {}
																	} else {}
																} catch (err) {}
															} else {
																$(function() {
																	var qjsdjk_counter = 0;
																	var qjsdjk_jiankong = setInterval(function() {
																		var qjsdjk_btn = $("ul#httpsvipul>li");
																		if (qjsdjk_btn) {
																			jxqzsxobjzdbtobj();
																			zddjjk();
																			if (!document.querySelector("img#宁小影")) {
																				(function() {
																					try {
																						let sdjxyywzdqp_counter = 0;
																						let sdjxyywzdqp_jiankong = setInterval(function() {
																							let sdjxyywzdqp_btn = document.querySelector("iframe#宁小影");
																							if (sdjxyywzdqp_btn) {
																								try {
																									qpobj(document.querySelector('iframe#宁小影'))
																								} catch (err) {}
																								clearInterval(sdjxyywzdqp_jiankong);
																								return false
																							}++sdjxyywzdqp_counter;
																							if (sdjxyywzdqp_counter > 5) {
																								clearInterval(sdjxyywzdqp_jiankong);
																								return false
																							}
																						}, 500)
																					} catch (err) {}
																				})();
																			} else {}
																			clearInterval(qjsdjk_jiankong);
																			return false
																		}++qjsdjk_counter;
																		if (qjsdjk_counter > 5) {
																			clearInterval(qjsdjk_jiankong);
																			return false
																		}
																	}, 500)
																})
															}
														} catch (err) {
															return false;
														}
													})();
												} else if (ttbkjjliobj) {
													(function() {
														try {
															document.querySelector("span#jxbmmnnobj").click();
														} catch (err) {
															return false;
														}
													})();
												} else {}
											} else {}
										};
										function sddjb() {
											if (pcliwaiobj || ttbkjjliobj) {
												jxqzsxobjzdbtobj();
												zddjjk();
											} else {}
										};
										function pyspqp() {
											if ((pcliwaiobj && !jxbpclwobj) || objj.match('(?:bilibili|acfun)')) {
												(function() {
													try {
														let element = document.querySelector("video");
														if (element.requestFullScreen) {
															element.requestFullScreen()
														} else if (element.mozRequestFullScreen) {
															element.mozRequestFullScreen()
														} else if (element.webkitRequestFullScreen) {
															element.webkitRequestFullScreen()
														}
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function ptsphzh() {
											if ((pcliwaiobj && !jxbpclwobj) || objj.match('(?:bilibili|acfun)')) {
												(function() {
													try {
														(async() => {
															const videos = Array.from(!document.querySelector("#宁小影") && document.querySelectorAll('video')).filter(video => video.readyState != 0).filter(video => video.disablePictureInPicture == false).sort((v1, v2) => {
																const v1Rect = v1.getClientRects()[0];
																const v2Rect = v2.getClientRects()[0];
																return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height))
															});
															if (videos.length === 0) return;
															const video = videos[0];
															if (video.hasAttribute('__pip__')) {
																await document.exitPictureInPicture()
															} else {
																await video.requestPictureInPicture();
																video.setAttribute('__pip__', true);
																video.addEventListener('leavepictureinpicture', event => {
																	video.removeAttribute('__pip__')
																}, {
																	once: true
																})
															}
														})();
													} catch (err) {
														return false;
													}
												})();
											} else {}
										};
										function sjsyjkjxa() {
											if (pcliwaiobj) {
												try {
													sessionStorage.setItem('jxywygdfsgbobj', '1');
													if (sessionStorage.getItem("弹窗接口数量") == null) {} else {
														arrb = JSON.parse(sessionStorage.getItem('弹窗接口数量'));
														sessionStorage.removeItem('弹窗接口数量');
														Array.prototype.removeByValue = function(val) {
															for (let i = 0; i < this.length; i++) {
																if (this[i] == val) {
																	this.splice(i, 1);
																	break
																}
															}
														}
													}
													if (arrb.length == '0') {
														(function() {
															try {
																const nullsjjkslobjb = document.querySelectorAll("#httpsvipul>li");
																let nullarrb = [], nullarrbhttpsjk;
																for (let nullsjjkslobjbi = 0; nullsjjkslobjbi < nullsjjkslobjb.length; nullsjjkslobjbi++) {
																	if ((nullsjjkslobjb[nullsjjkslobjbi].style.display != 'none') && (nullsjjkslobjb[nullsjjkslobjbi].querySelector('a1').innerText.match(/^\s*?[小大]窗\s*?$/))) {
																		nullarrb.push(nullsjjkslobjb[nullsjjkslobjbi].querySelector('a2').innerText)
																	}
																};
																nullarrbhttpsjk = nullarrb[Math.floor((Math.random() * nullarrb.length))];
																document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrbhttpsjk + ")").click();
																sessionStorage.setItem('nullarrbhttpsjk', nullarrbhttpsjk);
																if (localStorage.getItem("pcjkzdyj") == '1') {
																	$('ul#httpsvipul>li>span').css("backgroundImage", "");
																	try {
																		if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd")) {
																			document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																		} else {}
																	} catch (err) {}
																} else {
																	$('ul#httpsvipul>li>span:not([style*="AIH8BobyGoT"])').css("backgroundImage", "");
																	try {
																		if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage.match(/AIH8BobyGoT/)) {
																			document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																		} else {}
																	} catch (err) {}
																}
																if (localStorage.getItem("pcjkzdyj") == '1') {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
																	localStorage.setItem('httpsjk', nullarrbhttpsjk)
																} else if (localStorage.getItem("pcjkzdyj") == '2') {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianb + ")";
																	localStorage.setItem('httpsjk', nullarrbhttpsjk)
																} else {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianc + ")"
																}
															} catch (err) {
																return false
															}
														})()
													} else {
														try {
															if (sessionStorage.getItem("nullarrbhttpsjk") == null) {} else {
																arrb.removeByValue(sessionStorage.getItem("nullarrbhttpsjk"));
																sessionStorage.removeItem("nullarrbhttpsjk")
															}
														} catch (err) {}
														arrbhttpsjk = arrb[Math.floor((Math.random() * arrb.length))];
														document.querySelector("ul#httpsvipul>li:nth-child(" + arrbhttpsjk + ")").click();
														if (localStorage.getItem("pcjkzdyj") == '1') {
															$('ul#httpsvipul>li>span').css("backgroundImage", "");
															try {
																if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd")) {
																	document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																} else {}
															} catch (err) {}
														} else {
															$('ul#httpsvipul>li>span:not([style*="AIH8BobyGoT"])').css("backgroundImage", "");
															try {
																if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage.match(/AIH8BobyGoT/)) {
																	document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																} else {}
															} catch (err) {}
														}
														if (localStorage.getItem("pcjkzdyj") == '1') {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
															localStorage.setItem('httpsjk', arrbhttpsjk)
														} else if (localStorage.getItem("pcjkzdyj") == '2') {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianb + ")";
															localStorage.setItem('httpsjk', arrbhttpsjk)
														} else {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrbhttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianc + ")"
														}
														arrb.removeByValue(arrbhttpsjk)
													}
												} catch (err) {
													return false
												}
											} else {}
										};
										function sjsyjkjxb() {
											if (pcliwaiobj) {
												try {
													sessionStorage.setItem('jxywygdfsgbobj', '1');
													if (sessionStorage.getItem("原网页接口数量") == null) {} else {
														arra = JSON.parse(sessionStorage.getItem('原网页接口数量'));
														sessionStorage.removeItem('原网页接口数量');
														Array.prototype.removeByValue = function(val) {
															for (let i = 0; i < this.length; i++) {
																if (this[i] == val) {
																	this.splice(i, 1);
																	break
																}
															}
														}
													}
													if (arra.length == '0') {
														(function() {
															try {
																const nullsjjkslobjb = document.querySelectorAll("#httpsvipul>li");
																let nullarra = [], nullarrahttpsjk;
																for (let nullsjjkslobjbi = 0; nullsjjkslobjbi < nullsjjkslobjb.length; nullsjjkslobjbi++) {
																	if ((nullsjjkslobjb[nullsjjkslobjbi].style.display != 'none') && (nullsjjkslobjb[nullsjjkslobjbi].querySelector('a1').innerText == "")) {
																		nullarra.push(nullsjjkslobjb[nullsjjkslobjbi].querySelector('a2').innerText)
																	}
																};
																nullarrahttpsjk = nullarra[Math.floor((Math.random() * nullarra.length))];
																document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrahttpsjk + ")").click();
																sessionStorage.setItem('nullarrahttpsjk', nullarrahttpsjk);
																if (localStorage.getItem("pcjkzdyj") == '1') {
																	$('ul#httpsvipul>li>span').css("backgroundImage", "");
																	try {
																		if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd")) {
																			document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																		} else {}
																	} catch (err) {}
																} else {
																	$('ul#httpsvipul>li>span:not([style*="AIH8BobyGoT"])').css("backgroundImage", "");
																	try {
																		if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage.match(/AIH8BobyGoT/)) {
																			document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																		} else {}
																	} catch (err) {}
																}
																if (localStorage.getItem("pcjkzdyj") == '1') {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
																	localStorage.setItem('httpsjk', nullarrahttpsjk)
																} else if (localStorage.getItem("pcjkzdyj") == '2') {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianb + ")";
																	localStorage.setItem('httpsjk', nullarrahttpsjk)
																} else {
																	document.querySelector("ul#httpsvipul>li:nth-child(" + nullarrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianc + ")"
																}
															} catch (err) {
																return false
															}
														})()
													} else {
														try {
															if (sessionStorage.getItem("nullarrahttpsjk") == null) {} else {
																arra.removeByValue(sessionStorage.getItem("nullarrahttpsjk"));
																sessionStorage.removeItem("nullarrahttpsjk")
															}
														} catch (err) {}
														arrahttpsjk = arra[Math.floor((Math.random() * arra.length))];
														document.querySelector("ul#httpsvipul>li:nth-child(" + arrahttpsjk + ")").click();
														if (localStorage.getItem("pcjkzdyj") == '1') {
															$('ul#httpsvipul>li>span').css("backgroundImage", "");
															try {
																if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd")) {
																	document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																} else {}
															} catch (err) {}
														} else {
															$('ul#httpsvipul>li>span:not([style*="AIH8BobyGoT"])').css("backgroundImage", "");
															try {
																if (document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage.match(/AIH8BobyGoT/)) {
																	document.querySelector("ul#httpsvipul>li>span.wsjxbshhjd").style.backgroundImage = 'none'
																} else {}
															} catch (err) {}
														}
														if (localStorage.getItem("pcjkzdyj") == '1') {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupiana + ")";
															localStorage.setItem('httpsjk', arrahttpsjk)
														} else if (localStorage.getItem("pcjkzdyj") == '2') {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianb + ")";
															localStorage.setItem('httpsjk', arrahttpsjk)
														} else {
															document.querySelector("ul#httpsvipul>li:nth-child(" + arrahttpsjk + ")>span").style.backgroundImage = "url(" + jxbtupianc + ")"
														}
														arra.removeByValue(arrahttpsjk)
													}
												} catch (err) {
													return false
												}
											} else {}
										};
										function pcllfxjkdy() {
											if (pcliwaiobj) {
												if (localStorage.getItem("zdpddy") == '1') {
													localStorage.setItem('zdpddy', '0');
													alert('\u5df2\u7ecf\u5173\u95ed \u76d1\u63a7\u591a\u4f59\u6309\u94ae \u529f\u80fd');
													location.reload();
												} else {
													localStorage.setItem('zdpddy', '1');
													alert('\u5df2\u7ecf\u5f00\u542f \u76d1\u63a7\u591a\u4f59\u6309\u94ae \u529f\u80fd');
													location.reload();
												}
											} else {}
										};
										try {
											document.onkeydown = function(e) {
												if (window.event) {
													e = window.event
												}
												let code = event.key;
												if (e.altKey && e.ctrlKey && code == '/') {
													qkjbsz();
												} else if (e.altKey && e.ctrlKey && code == ';') {
													jxywyfsgba();
												} else if (e.altKey && e.ctrlKey && code == '\'') {
													jxywyfsgbb();
												} else if (e.altKey && e.ctrlKey && code == '\\') {
													jxywyfsgbc();
												} else if (e.altKey && e.ctrlKey && code == ',') {
													jxywyfsgbd();
												} else if (e.altKey && e.ctrlKey && code == '.') {
													jxywyfsgbe();
												} else if (e.altKey && e.ctrlKey && code == '-') {
													tbxsycb();
												} else if (e.altKey && e.ctrlKey && code == '=') {
													pcllfxjkdy();
												} else if (e.altKey && code == '/') {
													tbxsyca();
												} else if (e.altKey && code == ';') {
													ckjxbkjj();
												} else if (e.altKey && code == ',') {
													zdssspb();
												} else if (e.altKey && code == '.') {
													tbxsycc();
												} else if (e.altKey && code == '\'') {
													sdzdqjobj();
												} else if (e.ctrlKey && code == '\'') {
													gbkqzdjx();
												} else if (e.ctrlKey && code == ',') {
													zdssspc();
												} else if (code == ',') {
													zdssspa();
												} else if (code == '.') {
													sddjb();
												} else if (code == '/') {
													sddja();
												} else if (code == ';') {
													ywyjklb();
												} else if (code == '\'') {
													pyspqp();
												} else if (code == '\\') {
													ptsphzh();
												} else if (code == '-') {
													sjsyjkjxa();
												} else if (code == '=') {
													sjsyjkjxb();
												} else {}
											}
										} catch (err) {}
									} catch (err) {}
								} else {}
							} else {}
						} catch (err) {}
					};
				} catch (err) {
					return false;
				}
			}
		}
		return false;
	} catch (err) {
		return false;
	}
})();