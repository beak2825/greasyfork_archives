// ==UserScript==
// @id             thepiratebaybringbacktorrentfiles
// @name           The Pirate Bay helper
// @version        1.11.16.2
// @namespace      thepiratebayhelper
// @author         V@no
// @description    Control what you want to be highlighted, displays number of files in each release at search result
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @include        http://thepiratebay.*/*
// @include        https://thepiratebay.*/*
// @include        http://www.thepiratebay.*/*
// @include        https://www.thepiratebay.*/*
// @include        http://pirateproxy.*/*
// @include        https://pirateproxy.*/*
// @include        http://x1337x.*/*
// @include        https://x1337x.*/*
// @include        http://1337x.*/*
// @include        https://1337x.*/*
// @include        http://www.1337x.*/*
// @include        https://www.1337x.*/*
// @include        http://1377x.*/*
// @include        https://1377x.*/*
// @include        http://www.1377x.*/*
// @include        https://www.1377x.*/*
// @include        http://pornleech.*/*
// @include        https://pornleech.*/*
// @noframes
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/35915/The%20Pirate%20Bay%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/35915/The%20Pirate%20Bay%20helper.meta.js
// ==/UserScript==
//http://torrents.thepiratebay.org/7077994/The_Amazing_Race_S20E03_HDTV_XviD-2HD%5Bettv%5D.7077994.TPB.torrent
//http://thepiratebay.se/torrent/7077994/The_Amazing_Race_S20E03_HDTV_XviD-2HD%5Bettv%5D
//ajax_details_filelist.php?id=

let showLog = ~~localStorage.getItem("showlog") || 0;
let log = console.log.bind(console);
let isTPB = location.host.indexOf("thepiratebay") != -1,
		isl337x = location.host.indexOf("1337x") != -1,
		isPornleech = location.host.indexOf("pornleech") != -1;

/*
	popup/ad killer
*/


(function ()
{

function TPBH_scriptStop (e, nolog)
{
	let obj = e.target || e,
			r = true,
			save = true;//TPBH_scriptStop.list.indexOf(obj) == -1;
//		if (TPBH_scriptStop.list.indexOf(obj) != -1)
//			return;

	if (
			(obj.text.match("var _wm")
			||	obj.text.match("var miner")
			||	obj.text.match("var magic ")
			||	obj.text.match(/^SetCookie/)
			||	obj.text.match("_gaUserPrefs")
			||	obj.text.match("antiClick")
			||	obj.text.match("function count")
			|| 	obj.text.match(/writeln\("<ht"\+"ml>/)
			||	obj.text.match(/if\s*\(typeof [a-zA-Z0-9]+ === 'undefined'\)\s*\{\s*[a-zA-Z0-9]+\(\);/)
//			||	obj.text.match(/if\s*\(top\.location !=/)
			||	(obj.src
						&&	(
									!(new RegExp("^" + window.location.origin.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "")).test(obj.src)
									||	obj.src.match(/ad[\.\-].*\.js/)
									||	obj.src.match(/\/tpb.js/)
//										||	obj.src.match(/scriptaculous\.js|prototype\.js/)
								)
					)
		 )
		 &&
		 (
			 !obj.src.match(/\/recaptcha\//)
		 )
		)
	{
		if (showLog && save) log(["denied", obj.src, obj.text, e]);
/*
		if (showLog && save) console.table([{
			type: "object",
			status: "denied",
			src: obj.src,
			text: obj.text,
			event: e
		}]);
*/
		if (e !== obj)
		{
			e.stopPropagation();
			e.preventDefault();
		}
		obj.parentNode.removeChild(obj);
		r = false;
	}
	else
	{
		if (showLog && save) log(["allowed", obj.src, obj.text, e]);
/*
		if (showLog && save) console.table([{
			type: "object",
			status: "allowed",
			src: obj.src,
			text: obj.text,
			event: e
		}]);
*/
	}

	if (save)
			TPBH_scriptStop.list[TPBH_scriptStop.list.length] = obj;

	return r;
}//TPBH_scriptStop()

TPBH_scriptStop.list = [];
unsafeWindow.addEventListener("beforescriptexecute", TPBH_scriptStop, true);
let loaded = false;
function TPBH_popFunc(nolog)
{
	let l = [],
			s = document.getElementsByTagName("script");
	for(let i = 0; i < s.length; i++)
		l[l.length] = s[i];

	for(let i = 0; i < l.length; i++)
		TPBH_scriptStop(l[i],nolog);

	s = document.getElementsByTagName("link")
	l = [];
	for(let i = 0; i < s.length; i++)
		l[l.length] = s[i];

	for(let i = 0; i < l.length; i++)
	{
		if (["search", "stylesheet"].indexOf(l[i].rel) == -1)
			l[i].parentNode.removeChild(l[i]);
	}
	s = document.getElementsByTagName("iframe");
	l = null;
	while(l=s[0])
		l.parentNode.removeChild(l);

	if (!loaded)
		TPBH_popFunc.timer = setTimeout(TPBH_popFunc, 0);
}
TPBH_popFunc();
/*
if (document.readyState != "loading")
	TPBH_popFunc();
else
	document.addEventListener("DOMContentLoaded", TPBH_popFunc, true);
*/

window.addEventListener("load", function TPBH_popLoad(e)
{
	loaded = true;

	unsafeWindow.removeEventListener("beforescriptexecute", TPBH_scriptStop, true);
	window.removeEventListener(e.type, arguments.callee, true);
}, true);

	function addEventListener(a,b,c)
	{
	//    let allowed = ["load"].indexOf(a) != -1;
		let allowed = arguments[1].name.match("TPBH_") || [""].indexOf(a) != -1;
		if (showLog) log([allowed ? "event allowed" : "event denied", a, this, b.toString(), c, arguments]);
/*
		if (showLog) console.table([{
			type: "event",
			status: allowed ? "allowed" : "denied",
			event: a,
			node: this,
			func: b.toString(),
			bubble: c,
			args: arguments
		}]);
*/
		if (!allowed)
		{
			this.removeEventListener(a,b,c);
			return false;
		}
		function wrapper(e)
		{
			if (showLog)
				log(["event fired", e]);

			return b(e);
		}
		this._addEventListener(a,wrapper,c);
		if(!this.eventListenerList) this.eventListenerList = {};
		if(!this.eventListenerList[a]) this.eventListenerList[a] = [];
		this.eventListenerList[a].push(b);
	};
/*

	Element.prototype._addEventListener = Element.prototype.addEventListener;
	Element.prototype.addEventListener = addEventListener;
	Window.prototype._addEventListener = Window.prototype.addEventListener;
	Window.prototype.addEventListener = addEventListener;
	HTMLDocument.prototype._addEventListener = HTMLDocument.prototype.addEventListener;
	HTMLDocument.prototype.addEventListener = addEventListener;
*/
/*
	unsafeWindow.window.Element.prototype._addEventListener = Element.prototype.addEventListener;
	unsafeWindow.window.Element.prototype.addEventListener = addEventListener;
	unsafeWindow.window.Window.prototype._addEventListener = Window.prototype.addEventListener;
	unsafeWindow.window.Window.prototype.addEventListener = addEventListener;
	unsafeWindow.window.HTMLDocument.prototype._addEventListener = HTMLDocument.prototype.addEventListener;
	unsafeWindow.window.HTMLDocument.prototype.addEventListener = addEventListener;
*/

	try
	{
		let descriptor = Object.create(null); // no inherited properties
		descriptor.value = {};
		delete unsafeWindow._wm;
		Object.defineProperty(unsafeWindow, "_wm", descriptor);
		descriptor.value = true;
	}
	catch(e)
	{
		log(e);
	}
	(function loop()
	{
		unsafeWindow.onresize = null;
		let iframes = document.getElementsByTagName("iframe");
		for (let i = 0; i < iframes.length; i++)
			iframes[i].parentNode.removeChild(iframes[i]);

		TPBH_popFunc();
		try
		{
	//unsafeWindow._wm = {};
	//unsafeWindow._wm_settings = {};
	//unsafeWindow._wm.format.popunder.isBinded = true;
	//unsafeWindow._wm.format.popunder.isTriggered = true;
	//			Object.defineProperty(unsafeWindow._wm.format.popunder, "isBinded", descriptor);
	//			Object.defineProperty(unsafeWindow._wm.format.popunder, "isTriggered", descriptor);
			unsafeWindow._wm.listener.clear();
		}catch(e){};
		if (!loaded)
		 setTimeout(loop, 0);
	})();
})();

/*
	popup/ad killer end
*/


//md5
!function(n){var r=function(n,r){var t=n[0],f=n[1],i=n[2],a=n[3];t=o(t,f,i,a,r[0],7,-680876936),a=o(a,t,f,i,r[1],12,-389564586),i=o(i,a,t,f,r[2],17,606105819),f=o(f,i,a,t,r[3],22,-1044525330),t=o(t,f,i,a,r[4],7,-176418897),a=o(a,t,f,i,r[5],12,1200080426),i=o(i,a,t,f,r[6],17,-1473231341),f=o(f,i,a,t,r[7],22,-45705983),t=o(t,f,i,a,r[8],7,1770035416),a=o(a,t,f,i,r[9],12,-1958414417),i=o(i,a,t,f,r[10],17,-42063),f=o(f,i,a,t,r[11],22,-1990404162),t=o(t,f,i,a,r[12],7,1804603682),a=o(a,t,f,i,r[13],12,-40341101),i=o(i,a,t,f,r[14],17,-1502002290),f=o(f,i,a,t,r[15],22,1236535329),t=u(t,f,i,a,r[1],5,-165796510),a=u(a,t,f,i,r[6],9,-1069501632),i=u(i,a,t,f,r[11],14,643717713),f=u(f,i,a,t,r[0],20,-373897302),t=u(t,f,i,a,r[5],5,-701558691),a=u(a,t,f,i,r[10],9,38016083),i=u(i,a,t,f,r[15],14,-660478335),f=u(f,i,a,t,r[4],20,-405537848),t=u(t,f,i,a,r[9],5,568446438),a=u(a,t,f,i,r[14],9,-1019803690),i=u(i,a,t,f,r[3],14,-187363961),f=u(f,i,a,t,r[8],20,1163531501),t=u(t,f,i,a,r[13],5,-1444681467),a=u(a,t,f,i,r[2],9,-51403784),i=u(i,a,t,f,r[7],14,1735328473),f=u(f,i,a,t,r[12],20,-1926607734),t=e(t,f,i,a,r[5],4,-378558),a=e(a,t,f,i,r[8],11,-2022574463),i=e(i,a,t,f,r[11],16,1839030562),f=e(f,i,a,t,r[14],23,-35309556),t=e(t,f,i,a,r[1],4,-1530992060),a=e(a,t,f,i,r[4],11,1272893353),i=e(i,a,t,f,r[7],16,-155497632),f=e(f,i,a,t,r[10],23,-1094730640),t=e(t,f,i,a,r[13],4,681279174),a=e(a,t,f,i,r[0],11,-358537222),i=e(i,a,t,f,r[3],16,-722521979),f=e(f,i,a,t,r[6],23,76029189),t=e(t,f,i,a,r[9],4,-640364487),a=e(a,t,f,i,r[12],11,-421815835),i=e(i,a,t,f,r[15],16,530742520),f=e(f,i,a,t,r[2],23,-995338651),t=c(t,f,i,a,r[0],6,-198630844),a=c(a,t,f,i,r[7],10,1126891415),i=c(i,a,t,f,r[14],15,-1416354905),f=c(f,i,a,t,r[5],21,-57434055),t=c(t,f,i,a,r[12],6,1700485571),a=c(a,t,f,i,r[3],10,-1894986606),i=c(i,a,t,f,r[10],15,-1051523),f=c(f,i,a,t,r[1],21,-2054922799),t=c(t,f,i,a,r[8],6,1873313359),a=c(a,t,f,i,r[15],10,-30611744),i=c(i,a,t,f,r[6],15,-1560198380),f=c(f,i,a,t,r[13],21,1309151649),t=c(t,f,i,a,r[4],6,-145523070),a=c(a,t,f,i,r[11],10,-1120210379),i=c(i,a,t,f,r[2],15,718787259),f=c(f,i,a,t,r[9],21,-343485551),n[0]=v(t,n[0]),n[1]=v(f,n[1]),n[2]=v(i,n[2]),n[3]=v(a,n[3])},t=function(n,r,t,o,u,e){return r=v(v(r,n),v(o,e)),v(r<<u|r>>>32-u,t)},o=function(n,r,o,u,e,c,f){return t(r&o|~r&u,n,r,e,c,f)},u=function(n,r,o,u,e,c,f){return t(r&u|o&~u,n,r,e,c,f)},e=function(n,r,o,u,e,c,f){return t(r^o^u,n,r,e,c,f)},c=function(n,r,o,u,e,c,f){return t(o^(r|~u),n,r,e,c,f)},f=function(n){var t,o=n.length,u=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=n.length;t+=64)r(u,i(n.substring(t-64,t)));n=n.substring(t-64);var e=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<n.length;t++)e[t>>2]|=n.charCodeAt(t)<<(t%4<<3);if(e[t>>2]|=128<<(t%4<<3),t>55)for(r(u,e),t=0;t<16;t++)e[t]=0;return e[14]=8*o,r(u,e),u},i=function(n){var r,t=[];for(r=0;r<64;r+=4)t[r>>2]=n.charCodeAt(r)+(n.charCodeAt(r+1)<<8)+(n.charCodeAt(r+2)<<16)+(n.charCodeAt(r+3)<<24);return t},a="0123456789abcdef".split(""),d=function(n){for(var r="",t=0;t<4;t++)r+=a[n>>8*t+4&15]+a[n>>8*t&15];return r},h=function(n){for(var r=0;r<n.length;r++)n[r]=d(n[r]);return n.join("")},v=function(n,r){return n+r&4294967295};"5d41402abc4b2a76b9719d911017c592"!=(n.md5=function(n){return h(f(n))})("hello")&&(v=function(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t})}(window);
if (document.readyState != "loading")
	TPBH_func();
else
	document.addEventListener("DOMContentLoaded", TPBH_func ,true);

function TPBH_func()
{
	function $(id)
	{
		return document.getElementById(id);
	}
	if (!Try)
	{
		var Try = {
			these: function() {
				var returnValue;

				for (var i = 0, length = arguments.length; i < length; i++) {
					var lambda = arguments[i];
					try {
						returnValue = lambda();
						break;
					} catch (e) { }
				}

				return returnValue;
			}
		};
	}
	if (!Ajax)
	{
		var Ajax = {
			getTransport: function()
			{
				return Try.these(
					function() {return new XMLHttpRequest()},
					function() {return new ActiveXObject("Msxml2.XMLHTTP")},
					function() {return new ActiveXObject("Microsoft.XMLHTTP")}
				) || false;
			},
			Updater: function(id, url, param)
			{
				id = id || "";
				url = url || "";
				param = param || "";
				let xmlhttp = Ajax.getTransport();
				this.id = id;
				this.url = url;
				this.param = param;
				this.xmlhttp = xmlhttp;
				xmlhttp.onreadystatechange = function()
				{
					if (xmlhttp.readyState != 4) return;
					if (!xmlhttp.status) //timeout
					{

					}
					else if (xmlhttp.status == 200)
					{
						let c = xmlhttp.responseText;
						if (!c)
							return;

						let obj = document.getElementById(id);
						if (!obj)
							return;

						obj.innerHTML = c;
					}
				};
				let query = param.parameters || "";
				xmlhttp.open(param.method || "GET", url + (url.match(/\?/) ? "&" : "?") + query , true);
				xmlhttp.send(null);
			}
		}
	}
	function eraseCookie( name, path){ document.cookie = name+"=; path="+path+"; expires="+new Date( (new Date).getTime()-1).toGMTString()+";"; }
	function getCookie( name ) {
		var start = document.cookie.indexOf( name + "=" );
		var len = start + name.length + 1;
		if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
			return null;
		}
		if ( start == -1 ) return "";
		var end = document.cookie.indexOf( ";", len );
		if ( end == -1 ) end = document.cookie.length;
		return unescape( document.cookie.substring( len, end ) );
	}

	function setCookie( name, value, expires, path, domain, secure ) {
		var today = new Date();
		today.setTime( today.getTime() );
		if (typeof(expires) == "undefined" || expires === null)
			expires = 9999 * 1000 * 60 * 60 * 24;

		var expires_date = new Date( today.getTime() + (expires) );
		document.cookie = name+"="+escape( value ) +
			( ( expires ) ? ";expires="+expires_date.toGMTString() : "" ) + //expires.toGMTString()
			( ( path ) ? ";path=" + path : "" ) +
			( ( domain ) ? ";domain=" + domain : "" ) +
			( ( secure ) ? ";secure" : "" );
	}
	function clone(obj)
	{
		let r = {};
		for (let i in obj)
			if (typeof(obj[i]) == "object")
				r[i] = clone(obj[i]);
			else
				r[i] = obj[i];

		return r;
	}
	function cs(id, data)
	{
		if (cs.list.indexOf(id) == -1)
			cs.list[cs.list.length] = id;

		let r;
		if (typeof(data) == "undefined")
		{
			r = getCookie(id);
			try
			{
				r = JSON.parse(r);
			}catch(e){}
		}
		else
		{
			try
			{
				r = setCookie(id, JSON.stringify(data), null, location.pathname.match(/(\/[^\/]+\/[^\/]+)/)[1]);
			}
			catch(e){}
		}
		return r;
	}
	cs.list = [];
	function ls(id, key, data, stringify)
	{
		let r;
		if (typeof(data) == "undefined")
		{
			if (id in ls.cache)
			{
				r = ls.cache[id];

				if (typeof(key) != "undefined")
					return r[key];
			}
			else
			{
				r = localStorage.getItem(id);
				if (r !== null)
				{
					try
					{
						r = JSON.parse(r);
						ls.cache[id] = r;
						if (typeof(key) != "undefined")
							return r[key];
					}
					catch(e)
					{
						log(e);
						log([id, key, data, r]);
					}
				}
			}
			return r;
		}

		if (!(id in ls.cache))
			ls.cache[id] = [];

		if (typeof(key) == "undefined")
			ls.cache[id] = data;
		else
		{
			ls.cache[id][0] = Math.round((new Date()).getTime() / 1000);
			ls.cache[id][key] = data;
		}
		r = ls.save(id, key, data, r, stringify);
		return r;
	}
	ls.cache = {};
	ls.max = 50000;//max items to store
	ls.safeKeys = ["options", "dl", "order"];
	ls.save = function(id, key, data, r, stringify, attempt)
	{
		let d = data;
		if (typeof(data) == "undefined" || typeof(key) != "undefined")
			d = ls.cache[id];

		if (typeof(stringify) == "undefined" || stringify)
			d = JSON.stringify(d);

		try
		{
			r = localStorage.setItem(id, d);
		}
		catch(e)
		{
			ls.purge();
			if (typeof(attempt) == "undefined")
				attempt = 0;
log([attempt, key, data, e]);

			if (attempt < 100)
				r = ls.save(id, key, data, r, stringify, ++attempt);

		}
		return r;
	}
	ls.delete = function(id)
	{
		delete ls.cache[id];
		localStorage.removeItem(id);
	}
	ls.files = function(id, data)
	{
		return this(id, 2, data);
	};
	ls.magnet = function(id, data)
	{
		return this(id, 3, data);
	};
	ls.num = function(id, data)
	{
		return this(id, 1, data);
	};
	ls.date = function(id, data)
	{
		return this(id, 0, data);
	};
	ls.downloaded = function(id, data)
	{
		id = ~~id;
		let index = ls._down.indexOf(id);
		if (data === 0)
		{
			try
			{
				this.cache[id].splice(3, 1);
			}catch(e){};

			if (index != -1)
				ls._down.splice(index, 1);

			localStorage.setItem("dl", JSON.stringify(ls._down));
			return;// this.save(id, 3, this.cache[id]);
		}

		data = Number(data);
		if (isNaN(data))
			data = undefined;

		if (data && index == -1)
		{
			index = ls._down.length;
			ls._down[index] = id;
			localStorage.setItem("dl", JSON.stringify(ls._down));
		}
		return index != -1;
//		return this(id, 3, data, undefined, false);
	}
	ls._down = null;
	try
	{
		ls._down = JSON.parse(localStorage.getItem("dl"));
	}catch(e){};
	if (ls._down === null)
	{
		ls._down = [];
		let keys = Object.keys(localStorage);
		for(let i = 0; i < keys.length; i++)
		{
			if (isNaN(keys[i]))
				continue;

			try
			{
				let item = JSON.parse(localStorage.getItem(keys[i])),
						val = Number(item[3]);

				if (val)
				{
					ls._down[ls._down.length] = Number(keys[i]);
					item.splice(3, 1);
				}
				item[0] = Math.round(item[0] / 1000);
				localStorage.setItem(keys[i], JSON.stringify(item));
			}
			catch(e){}
		}
		localStorage.setItem("dl", JSON.stringify(ls._down));
	}

	//clear database;
	ls.purge = function()
	{
		let array = Object.keys(localStorage),
				n = 0;

//		while(localStorage.length > ls.max)
		while(n < ls.max)
		{
			let key = array[n++];
			if (isNaN(Number(key)))
				continue;

//log("Deleting " + key + ": " + localStorage.getItem(key));
			return localStorage.removeItem(key);
		}
	}
//	ls.purge();
	let tpbhName = "The Pirate Bay helper",
			tpbhVersion = "0";
	try
	{
		tpbhName = GM_info.script.name;
		tpbhVersion = GM_info.script.version;
	}catch(e){};
/*
for(let s in localStorage)
{
//	log(s)
}
	setTimeout(function()
	{
		localStorage;
	}, 10000);
*/
//	alert(unsafeWindow.top.document.title)
	var dom = [
		"thepiratebay.org",
		//						 "thepiratebay.ms",
//		"thepiratebay.gd",
//		"thepiratebay.vg",
//		"thepiratebay.mn",
//		"thepiratebay.bid",
		//						 "thepiratebay.pw",
		//						 "thepiratebay.uk.net",
		//						 "pirateproxy.la",
	];
/*
	var timeoutCache,
			filesCache = ls("filesList");
	if (filesCache)
	{
		try
		{
			filesCache = JSON.parse(filesCache);
		}
		catch(e)
		{
			filesCache = {};
		};
	}
	else
	{
		filesCache = {};
	}
*/
	function random(min, max)
	{
		return Math.floor(Math.random() * max) + min;
	}
	function multiline(func)
	{
		func = func.toString();
		return func.slice(func.indexOf("/*") + 2, func.lastIndexOf("*/")).split("*//*").join("*/").replace(/[\n\t]*/g, "");
	}
	function redirect()
	{

		let rand = random(0, dom.length),
				url = window.location.toString().replace(/(thepiratebay|pirateproxy)\.[^/]+/i, dom[rand]);
log(url);
		GM_xmlhttpRequest({
			url: url,
			method: "HEAD",
			onload: function(response)
			{
log(["onload", response]);
				window.location.replace(url);
			},
			onerror: function(response)
			{
log(["onerror", response]);
				//alert(response)
				dom.splice(rand, 1);
				if (dom.length)
					redirect();
			}
		});
	}
//	alert(window.top.document.title)
	if(document.documentURI.substr(0,14)=="about:neterror"
		 || document.documentURI.indexOf("thepiratebay.uk.net") != -1
		 || document.documentURI.indexOf("pirateproxy.") != -1
		)
	{
//		dom = ["org", "la", "gd", "vg", "mn", "am"];
		redirect();
		return;
	}
	if ($("cf_alert_div")
			|| window.top.document.title.match(/\| [0-9]+:/i)
			|| window.top.document.title.match(/offline/i)
			|| document.body.innerHTML.length < 2500)
	{
		let rand = random(1, 30),
				title = window.top.document.title;

		(function func()
		{
			rand--;
			window.top.document.title = rand + " " + title;
			if (rand)
				setTimeout(func, 1000);
			else
				redirect();
		}
		)();
		return;
	}
	var http = window.location.protocol;
	var domain = window.location.hostname.split(".");
	domain = domain[domain.length-2] + "." + domain[domain.length-1];

	//single line view

	if (isTPB)
	{
		let lw = getCookie("lw");

		if ((lw === null || lw === "") && window.location)
		{
			let url = window.location.href;
	/*
			let r = ls("reload"),
					url = window.location.href,
					query = url.replace(/[^\?]+\??/, "");
	console.log(r);
	console.log(query);
			if (r)
			{
				if (r[1] > (new Date()).getTime() -  60000)
				{
					url = window.location.href += ""
				}
				else
					ls.delete("reload");
			}

			ls("reload", [url, (new Date()).getTime()])
	*/
			setCookie("lw", "s", 0, "/", "." + domain);
			window.location.replace(url);
			return
		}
		let title = document.evaluate("/html/body/H2/SPAN", document, null, XPathResult.STRING_TYPE, null).stringValue;
		if (!title.indexOf("Search"))
		{
			document.title = title.replace("Search results: ", "") + " (" + document.title + ")";
		}
		let q = window.location.pathname.match(/^\/search\/([^\/]+)\/([0-9])+\/([0-9]+)\/([0-9]+)([\/#\?]|$)/);

		if (q)
		{
/*
 *     1  - name desc
 *     2  - name asc
 *     3  - date desc
 *     4  - date asc
 *     5  - size desc
 *     6  - size asc
 *     7  - seeds desc
 *     8  - seeds asc
 *     9  - leeches desc
 *     10 - leeches asc
*/
			let sort = {
						1: ["Name", 1],
						2: ["Name", 0],
						3: ["Uploaded", 1],
						4: ["Uploaded", 0],
						5: ["Size", 1],
						6: ["Size", 0],
						7: ["SE", 1],
						8: ["SE", 0],
						9: ["LE", 1],
						10: ["LE", 0],
						11: ["ULed by", 1],
						12: ["ULed by", 0],
						13: ["Type", 1],
						14: ["Type", 0],
					},
					sortby = sort[q[3]];
					th = $("tableHead");

			if (sortby && th && (th = th.querySelectorAll("th")))
			{
				for(let i = 0; i < th.length; i++)
				{
					let a = th[i].getElementsByTagName("a");
					if (!a || !a[0] || a[0].textContent != sortby[0])
						continue;

					a[0].classList.add("sort");
					th[i].classList.add(sortby[1] ? "asc" : "desc");
				}
			}
			
			
		}
	}//if (isTPB)
//l337x
	else if(isl337x)
	{
		let antiClickjack = $("antiClickjack");
		if (antiClickjack)
			antiClickjack.parentNode.removeChild(antiClickjack);

		//a hack to clear all previous setTimeout() and remove ads
		(function ads(t, m)
		{
			if (t)
				ads.t = t;
			if (m)
				ads.m = m;
			m = ads.m;
			while(m--)
			{
				clearTimeout(m);
			}
			let ad = document.getElementsByClassName("box-info"),
					a
			if (ad.length && ad[0].children[0].tagName == "STYLE")
			{
				ad[0].removeChild(ad[0].children[0]);
				ad[0].removeChild(ad[0].children[0]);
			}
			ad = document.getElementsByClassName("ui-helper-hidden-accessible");
			if (ad.length)
			{
				while(a = ad[ad.length-1].nextSibling)
				{
					a.parentNode.removeChild(a);
					ads.t = 0;
				}
			}
			ad = document.querySelector("div.box-info-heading.clearfix");
			if (ad)
			{
				while(a = ad.previousSibling)
				{
					a.parentNode.removeChild(a);
				}
			}
			if (ads.t--)
				setTimeout(ads);
		})(1000, setTimeout(function(){}))
		let title = document.querySelector("div.box-info-heading.clearfix > h1 > span");
		let _title = "",
				loc = location.pathname.replace(/^\/|\/$/g,"").split("/");
		if (title)
		{
			_title = title.textContent + " | 1337x";
		}
		//nothing found
		let el = document.querySelector(".box-info-detail");
		if (el && el.textContent.indexOf("No results were returned") != -1)
		{
			let keyword = "",
					input = $("autocomplete");
			try
			{
				keyword = decodeURIComponent(loc[1]);
			}catch(e){}
			if (keyword)
				_title = keyword + " | 1337x";

			if (input && input.value == "")
			{
				input.value = keyword;
			}
		}
		document.title = _title;
		let sel = document.querySelector("div.box-info-right.sort-by-box form select.select");
		if (sel)
		{
			sel = sel.children;
			let list = {
						"coll-2": "seeders",
						"coll-3": "leechers",
						"coll-date": "time",
						"coll-4": "size",
					},
					thead = document.querySelector("table.table-list > thead"),
					option = sel[1].value.split("/"),
					s = option.length - 4,
					o = option.length - 3,
					sorted;

			if (sorted = sel[0].textContent.match(/Sorted by ([a-z]+) ([a-z]+)/i))
			{
				sorted = [sorted[1].toLowerCase(), sorted[2].toLowerCase() != "asc"];
			}
			else
				sorted = ["", ""];

			for(let i in list)
			{
				let th =  thead.querySelector("th." + i),
						pref = "";

				option[s] = list[i];
				if (sorted[0] == list[i])
				{
					option[o] =  sorted[1] ? "asc" : "desc";
					th.classList.add(option[o]);
				}
				else
					option[o] =  "desc";

				th.innerHTML = '<a href="' + option.join("/") + '" class="sort">' + th.textContent.replace("size info", "size") + '</a>';
			}
		}
setTimeout(function()
{
		let s = document.createElement("script");
		s.innerHTML = multiline(function(){/*
if (jQuery && jQuery.fn.slick)
{
	let slick = $('.movie .slider').slick('getSlick');
	slick.breakpoints = [];
	$('.movie .slider').slick('slickSetOption', {slidesToShow: 8}, true);
}
		*/});
		document.body.appendChild(s);
});

	}//if (isl337x)
//pornleech
	else if(isPornleech)
	{
		let antiClickjack = $("antiClickjack");
		if (antiClickjack)
			antiClickjack.parentNode.removeChild(antiClickjack);

		//a hack to clear all previous setTimeout() and remove ads
		(function ads(t, m)
		{
			if (t)
				ads.t = t;
			if (m)
				ads.m = m;
			m = ads.m;
			while(m--)
			{
				clearTimeout(m);
			}
			let ad = document.getElementsByClassName("box-info"),
					a
			if (ad.length && ad[0].children[0].tagName == "STYLE")
			{
				ad[0].removeChild(ad[0].children[0]);
				ad[0].removeChild(ad[0].children[0]);
			}
			ad = document.getElementsByClassName("ui-helper-hidden-accessible");
			if (ad.length)
			{
				while(a = ad[ad.length-1].nextSibling)
				{
					a.parentNode.removeChild(a);
					ads.t = 0;
				}
			}
			ad = document.querySelector("div.box-info-heading.clearfix");
			if (ad)
			{
				while(a = ad.previousSibling)
				{
					a.parentNode.removeChild(a);
				}
			}
			if (ads.t--)
				setTimeout(ads);
		})(1000, setTimeout(function(){}))
	
	
		let title = document.querySelector("div.box-info-heading.clearfix > h1 > span");
		let _title = "",
				loc = location.pathname.replace(/^\/|\/$/g,"").split("/");
		if (title)
		{
			_title = title.textContent + " | 1337x";
		}
		//nothing found
		let el = document.querySelector(".box-info-detail");
		if (el && el.textContent.indexOf("No results were returned") != -1)
		{
			let keyword = "",
					input = $("autocomplete");
			try
			{
				keyword = decodeURIComponent(loc[1]);
			}catch(e){}
			if (keyword)
				_title = keyword + " | 1337x";

			if (input && input.value == "")
			{
				input.value = keyword;
			}
		}
		document.title = _title;
		let sel = document.querySelector("div.box-info-right.sort-by-box form select.select");
		if (sel)
		{
			sel = sel.children;
			let list = {
						"coll-2": "seeders",
						"coll-3": "leechers",
						"coll-date": "time",
						"coll-4": "size",
					},
					thead = document.querySelector("table.table-list > thead"),
					option = sel[1].value.split("/"),
					s = option.length - 4,
					o = option.length - 3,
					sorted;

			if (sorted = sel[0].textContent.match(/Sorted by ([a-z]+) ([a-z]+)/i))
			{
				sorted = [sorted[1].toLowerCase(), sorted[2].toLowerCase() != "asc"];
			}
			else
				sorted = ["", ""];

			for(let i in list)
			{
				let th =  thead.querySelector("th." + i),
						pref = "";

				option[s] = list[i];
				if (sorted[0] == list[i])
				{
					option[o] =  sorted[1] ? "asc" : "desc";
					th.classList.add(option[o]);
				}
				else
					option[o] =  "desc";

				th.innerHTML = '<a href="' + option.join("/") + '" class="sort">' + th.textContent.replace("size info", "size") + '</a>';
			}
		}
setTimeout(function()
{
		let s = document.createElement("script");
		s.innerHTML = multiline(function(){/*
if (jQuery && jQuery.fn.slick)
{
	let slick = $('.movie .slider').slick('getSlick');
	slick.breakpoints = [];
	$('.movie .slider').slick('slickSetOption', {slidesToShow: 8}, true);
}
		*/});
		document.body.appendChild(s);
});

	}//if (isPornleech)
	let orderby = document.getElementsByName("orderby");
	for (let i = 0; i < orderby.length; i++)
		orderby[i].value = 3;


	function getLink(url, text, p)
	{
		let span = document.createElement("span"),
				reg = (new RegExp("\/torrent\/(([0-9]+)(\/.*)?)", "")).exec(url),
				urlOrig = url,
				min = 1000,
				max = 6000,
				maxAttempts = 10,
				noNum = "?",
				name = "",
				types = [2160,1080,960,720];
		if (reg)
		{
			let id = reg[2],
					urlFiles = isl337x ? url : http + "//" + domain + "/ajax_details_filelist.php?id=" + id;

			if (!span._inited)
			{
				span._inited = true;
				span.attempts = 0;
				span.innerHTML = noNum;
				span.className = "files";
				span.setAttribute("attempt", span.attempts);
				span.addEventListener("click", function TPBH_filesList(e)
				{
					span.attempts = 0;
					showFilesList(noNum, noNum);
					span.setAttribute("attempt", span.attempts);
					download();
				}, false);
			}
			let showFilesList = function showFilesList(title, num, magid)
			{
				if (typeof(num) != "undefined")
				{
					span.innerHTML = num;
					let tr = span.parentNode.parentNode;
					if (!isl337x)
						tr = tr.parentNode;

					if (span.hasAttribute("attempt"))
						tr.setAttribute("attempt", span.attempts);
					else
						tr.removeAttribute("attempt");
					if (Number.isInteger(num))
					{
						span.setAttribute("n", num);
						tr.setAttribute("n", num);
					}
					else if (span.attempts)
					{
						span.removeAttribute("n");
						tr.removeAttribute("n");
					}
				}

				span.title = title;
				if (span.previousSibling)
				{
					let a = span.previousSibling;
					if (typeof(a._title) == "undefined")
						a._title = a.title;

					a.title = a._title + (span.title ? (isl337x ? "" : "\n\n") + span.title : "");
					if (isl337x)
					{
						if (magid && magid != noNum)
						{
							a.href = "magnet:?xt=urn:btih:" + magid;
						}
						else
						{
							a.classList.toggle("disable", true);
						}
					}
					a.setAttribute("ohref", a.href);
					a.href = fixMagnet(a.href);
				}
			};
			let download = function downloadFilesList(url)
			{
				if (typeof(url) == "undefined")
					url = urlFiles;

				span.attempts++;
				let xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function(e)
				{
					if (xmlhttp.readyState != 4) return;

					var c = xmlhttp.responseText;
					if (!c)
						return;

					let num = 0,
							numShow = num,
							magid = "",
							title = "";

					if (isl337x)
					{
						let r = findFilesl337x(c);
						num = r[0];
						title = r[1];
						magid = r[2];
					}
					else
					{
						var m = c.match(/<tr>(.*)<\/tr>/mg);
						if (m && !m[0].match('colspan="2"'))
						{
							num = m.length;
						}
						else
						{
	//						m = ["<td>File list not available</td><td></td>"];
							m = ["<td></td>"];
						}

						var l = [];
						m.forEach(function(t)
						{
							let m = (new RegExp("<td[^>]*>([^<]*)(</td><td[^>]*>([^<]*))?", "g")).exec(t);
							t = m[1] + (m[3] ? "  ( " + m[3] + " )" : "");
							t = t.replace(/&nbsp;/g, " ");
							l.push(t);
						});
						if (num || (!num && span.attempts == 1))
						{
							title = l.join("\n");
						}
					}
					if (!num && span.attempts < maxAttempts)
					{
						numShow = maxAttempts - span.attempts;
						span.setAttribute("attempt", span.attempts);
						setTimeout(function()
						{
							download(urlFiles);
						}, random(min, max));
						if (span.attempts > 3)
						{
							if (!ls.num(id))
								ls.num(id, 0);

							ls.files(id, title);
							if (isl337x)
								ls.magnet(id, magid);
						}
					}
					else
					{
						if (!num && ls.num(id))
							num = ls.num(id);

						ls.num(id, num);

						ls.files(id, title);
						if (isl337x)
							ls.magnet(id, magid);

						if (num)
						{
							numShow = num;
/*
							filesCache[id] = {num: num, files: title};
							if (timeoutCache)
							{
								clearTimeout(timeoutCache);
							}
							timeoutCache = setTimeout(function()
							{
								ls("filesList", JSON.stringify(filesCache));
							}, 1000);
*/
						}
						else
						{
							numShow = ls.num(id);
							if (!numShow)
								numShow = noNum;
						}

						span.removeAttribute("attempt");
					}
					if (title)
						showFilesList(title, numShow, magid);
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send(null);
			}; //download()

			let download2 = function downloadFilesNumber(url)
			{
				if (typeof(url) == "undefined")
					url = urlOrig;

				span.attempts++;
				let xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = function()
				{
					if (xmlhttp.readyState != 4) return;
					let files = ls.files(id) || "",
							magid = ls.magnet(id) || "";

					if (!xmlhttp.status) //timeout
					{

					}
					else if (xmlhttp.status == 200)
					{
						var c = xmlhttp.responseText;
						if (!c)
							return;

						let num;
						if (isl337x)
						{
							let r = findFilesl337x(c);
							num = r[0];
							files = r[1];
							magid = r[2];
							span.attempts = 0;
							span.removeAttribute("attempt");
						}
						else
						{
							num = /<a.*title="Files"[^>]+>([0-9]+)/.exec(c);

							if (num)
							{
								num = Number(num[1]);
								span.attempts = 0;
								span.removeAttribute("attempt");
							}
							else
								num = 0;
						}

						ls.num(id, num);
						ls.files(id, files);
						if (isl337x)
							ls.magnet(id, magid);

						showFilesList(files, num, magid);
					}
				if (!files && !isl337x)
					download();
//<a href="javascript:void(0);" title="Files" onclick="if( filelist &lt; 1 ) { new Ajax.Updater( "filelistContainer", "/ajax_details_filelist.php", {method: "get", parameters: "id=6847093"}); filelist = 1; }; toggleFilelist(); return false;">5</a>
				};

				xmlhttp.open("GET", url, true);
				xmlhttp.send(null);
			}; //download2()
			function findFilesl337x(html)
			{
				let parser = new DOMParser()
				const doc = parser.parseFromString(html, "text/html")

				let files = doc.getElementById("files"),
						l = [],
						num = 0,
						numShow = num,
						title = "",
						magid = doc.querySelector('a[href^="magnet:"]');
//				magid = magid ? magid.href.match(/btih:([a-z0-9]+)/i)[1] || "" : "";
//				magid = magid ? magid.href.match(/btih:(([a-z0-9]+).*?&dn=[^&]+)/i)[1] || "" : "";
				magid = magid ? magid.href.match(/btih:(.+)/i)[1] || "" : "";
				if (files)
				{
					let li = files.getElementsByTagName("li");
					num = li.length;
					for(let i = 0; i < num; i++)
					{
						let n = li[i].textContent.trim();
						if (n)
							l[l.length] = n;
					}
					if (num || (!num && span.attempts == 1))
					{
						title = l.join("\n");
					}
				}
				return [num, title, magid];
			}//findFilesl337x()
//log(text);
			if (!text)
			{
/*
				if (id in filesCache)
				{
					setTimeout(function()
					{
						showFilesList(filesCache[id].files, filesCache[id].num);
						span.removeAttribute("attempt");
					},0);
				}
*/
				let n = ls(id);
				if (n === null || ((!ls.num(id) || !ls.magnet(id)) && (new Date()).getTime() - ls.date(id) * 1000 > 600000))
//if (n === null || (!ls.num(id) && (new Date()).getTime() - ls.date(id) * 1000 > 1000))
				{
					setTimeout(download2, 0);
				}
				else
				{
					setTimeout(function()
					{
						span.removeAttribute("attempt");
						let n = ls.num(id),
								f = ls.files(id),
								magid = ls.magnet(id);
						showFilesList(f, n ? n : noNum, magid ? magid : noNum);
						if (!f && (new Date()).getTime() - ls.date(id) * 1000 > 3600000)
							download();
					},0);
				}
			}
			name = reg[1] + (reg[3] ? "." : "/") + id;
		}//if (reg)
		if (obj.classList.contains("searchResult") || obj.classList.contains("SearchResults"))
		{
//			t.href = http + "//torrents." + domain + "/" + reg[1] + (reg[3] ? "." : "/") + reg[2] + ".TPB.torrent";
			let d = name.toLowerCase();
			let node = p.parentNode.parentNode;
			if ($("tableHead") && $("tableHead").getElementsByClassName("header")[0].cells.length > 4)
				node = node.parentNode;

			let className = [],
					tags = [],
					_class = function(c)
					{
						className[className.length] = c;
					},
					res,
					re = /([^0-9])([0-9]{3,4})[pP]([^a-zA-Z]|$)/g;// /[\.\-_ ]([0-9]{3,4})p/g;

			do
			{
				res = re.exec(d);
				if (!res)
					break;

				let r = ~~res[2];
				tags[tags.length] = r + "p";
				if (listHD.indexOf(r) == -1)
					_class("uknownres");
			}
			while (res);
			if (d.match("xvid"))
			{
				tags.push("xvid");
			}
			else if (d.match(/[^a-z0-9]([xh]\.?264|avc)([^a-z0-9]|$)/i))
			{
				tags.push("h264");
			}
			else if (d.match(/[^a-z0-9]([xh]\.?265|hevc)([^a-z0-9]|$)/i))
			{
				tags.push("h265");
			}
			if (d.match(/[^a-z]hdr(10)?([^a-z0-9]|$)/i))
			{
				tags.push("hdr");
			}
			if (d.match(/[^a-z0-9](web|webrip)([^a-z0-9]|$)/i))
			{
				tags.push("web");
			}
			else if (d.match(/[^a-z0-9]brrip([^a-z0-9]|$)/i))
			{
				tags.push("brrip");
			}
			else if (d.match(/[^a-z0-9]hdtv([^a-z0-9]|$)/i))
			{
				tags.push("tv");
			}
			else if (d.match(/[^a-z0-9](ts|cam|camrip|scr|hdcam)([^a-z0-9]|$)/i))
			{
				tags.push("cam");
			}
			else if (!tags.length && d.match(/[^a-z0-9]bluray([^a-z0-9]|$)/i))
			{
				tags.push("bluray");
			}
			if (d.match(/[^a-z0-9]3d([^a-z0-9]|$)/i))
			{
				tags.push("3d");
			}


			if (name.match(/[\-.][_ ]?(MeGusta|ShAaNiG)/i))
			{
				_class("bad");
			}

			if (!className.length && !tags.length)
				_class("other");

			let td = node.getElementsByTagName("td");
			if (isTPB)
			{
				td[2].setAttribute("nowrap", true);
				td[0].setAttribute("nowrap", true);
				td[0].style.maxWidth = "30em";
				td[0].style.overflow = "hidden";
			}
//			node.getElementsByTagName("td")[1].style.maxWidth = "1000em";
			if ($("main-content"))
				$("main-content").style.margin = 0;

			let link = td[1].getElementsByTagName("a")[0];
			if (isl337x)
				link = td[0].getElementsByTagName("a")[1];

//			link.innerHTML = link.innerHTML.replace(/(.*)(720p|1080p|960p|2160p)/ig, '<span class="hd">HD </span>$1<span class="hd$2">$2</span>');
			link.innerHTML = link.innerHTML.replace(re, function(a,b,c,d)
			{
				let n = types.length,
						num = ~~c;

				if (num < 720)
					return b + c + d;

				while(n--)
				{
					if (num <= types[n])
					{
						num = types[n];
						break;
					}
				}
				return b + '<span class="hd' + num + 'p">' + c + 'p</span>' + d;
//				return '<span class="hd">HD </span>' + b + '<span class="hd' + c.toLowerCase() + '">' + c.toLowerCase() + '</span>';
			});
			let r = function(a,b,c,d,e,f,g)
			{
				_class(cl);
				return b + '<span class="' + cl +'">' + c + '</span>' + e;
//				return '<span class="hd">HD </span>' + b + '<span class="hd' + c.toLowerCase() + '">' + c.toLowerCase() + '</span>';
			};
			let l = [
				[/([^a-z0-9])(1(0|2)\-?bit)([^a-z0-9]|$)/i, "fav"],
				[/([^a-z0-9])((PSA))([^a-z0-9]|$)/, "fav"],
				[/([^a-z0-9])((hdr|hdr10))([^a-z0-9]|$)/i, "hdr"],
				[/([^a-z0-9])((5\.1)|6ch)([^a-z0-9]|$)/gi, "highl"]
			], i = l.length;
			while(i--)
			{
				cl = l[i][1];
				link.innerHTML = link.innerHTML.replace(l[i][0], r);
			}
			let tagsBox = document.createElement("span");
			tagsBox.className = "tags";
			for(let i = 0; i < tags.length; i++)
			{
				let tag = document.createElement("span"),
						clas = (tags[i].match(/^[0-9]/) ? "_" : "") + tags[i];
				_class(clas);
				tag.className = "tag " + clas;
				tag.innerHTML = tags[i];
				tag.title = tags[i];
				tagsBox.appendChild(tag);
			}
			node.className += (node.className ? " " : "") + className.join(" ");
			if (link.parentNode.children[link.parentNode.children.length-1].classList.contains("comments"))
				tagsBox.appendChild(link.parentNode.lastChild);

			if (isl337x)
			{
				link.parentNode.removeAttribute("nowrap");
			}
			link.parentNode.appendChild(tagsBox);
		}//if (obj.classList.contains("searchResult") || obj.classList.contains("SearchResults"))

//		t.innerHTML = text ? text : '<img src="' + http + '//' + domain + '/static/img/icons/dl.gif" alt="Torrent link" />';
		return span;
	}//getLink()
	function fixMagnet(url)
	{
		return prefs.list.track ? url.replace(/&tr.*/g, "") : url;
	}
	let listHD = [720,1080,2160];
	let isCTRL = false;
	document.addEventListener("keydown", function TPBH_keydown(e)
	{
		isCTRL = e.ctrlKey;
	}, true);
	document.addEventListener("keyup", function TPBH_keyup(e)
	{
		isCTRL = e.ctrlKey;
	}, true);

	let resultsTable = [$("searchResult")], tr, tri, i, m, l, li, obj;
	if (!resultsTable[0])
	{
		resultsTable = document.querySelectorAll("table.table-list");
	}

//options
	let prefs = {};
	(function()
	{
		let box = document.createElement("span"),
				box2 = document.createElement("span"),
				defaults = {
					"2160p": 1,
					"1080p": 1,
					"720p": 2,
					h265: 1,
					h264: 2,
					hdr: 2,
					hdtv: 2,
					web: 2,
					xvid: 0,
					cam: 0,
					"3d": 0,
					brrip: 2,
					other: 0,
					track: 1,
					side: 0
				},
				searchResult = document.body,
				opt = function(id, val)
				{
					if (typeof(val) == "undefined")
					{
						return opt.list[String(id)];
					}
					let r = opt.list[String(id)];
					opt.list[String(id)] = val;
					return r;
				};
		prefs = opt;
		box2.className = "opt2";
		box.appendChild(box2);
		box.className = "opt";
		opt.page = cs("options");
		opt.glob = localStorage.getItem("options");
		try
		{
			opt.page = JSON.parse(opt.page);
		}
		catch(e){}
		try
		{
			opt.glob = JSON.parse(opt.glob);
		}
		catch(e){}
		if (opt.glob === null || typeof(opt.glob) != "object")
			opt.glob = clone(defaults);

		if (opt.page && typeof(opt.page) == "object")
		{
			opt.type = 0;
			opt.list = clone(opt.page);
		}
		else
		{
			opt.type = 1;
			opt.list = clone(opt.glob);
			opt.page = clone(opt.glob);
		}
		let sr;
		if (isTPB)
			sr = $("searchResult");
		else if (isl337x)
		{

			let obj = document.querySelector(".box-info-heading");
			if (obj)
			{
				let b = document.createElement("div");
				b.className = "sideBarButton";
				obj.insertBefore(b, obj.children[obj.children.length-1]);
				TPBH_sideBar();
				b.addEventListener("click", TPBH_sideBar, true);
			}
			sr = document.querySelector(".table-list");
		}
		else if (isPornleech)
		{
			sr = document.querySelector('div.b-content>table[width="75%"]');
		}

		if (!sr)
			return;

		if ($("q"))
			$("q").insertBefore(box, $("q").getElementsByTagName("br")[0]);
		else
			sr.parentNode.insertBefore(box, sr);

		if (isl337x)
		{
			let legend = document.createElement("span");
			legend.className = "userLegend";
			legend.innerHTML = '<span class="admin">admin</span><span class="moderator">mod</span><span class="vip">vip</span><span class="uploader">uploader</span><span class="trial-uploader">trial</span><span class="user">user</span>';
			box.parentNode.insertBefore(legend, box.nextSibling);
		}
		function toggle(id, state, fallback)
		{
			if (typeof(fallback) == "undefined")
				fallback = defaults

			let cb = $("cb_" + id);
			if (!cb)
				return;
//log([id, state, cb.value, opt.type]);
			if (!Number.isInteger(state))
				state = fallback[String(id)];

			switch(state)
			{
				case 0:
					searchResult.removeAttribute("show_" + id);
					searchResult.setAttribute("hide_" + id, "");
					break;
				case 1:
					searchResult.removeAttribute("hide_" + id);
					searchResult.setAttribute("show_" + id, "");
					break;
				default:
					searchResult.removeAttribute("show_" + id);
					searchResult.removeAttribute("hide_" + id);
			}
			cb.indeterminate = (state == 2);
			if (state)
				cb.checked = true;
			else
				cb.checked = false;

			cb.value = state;
			return state;
		}
		function saveOpt()
		{
			if (opt.type)
			{
				ls.save("options", undefined, opt.list);
//				localStorage.setItem("options", JSON.stringify(opt.list));
				opt.glob = clone(opt.list);
			}
			else
			{
				cs("options", opt.list);
				opt.page = clone(opt.list);
			}

		}

		function TPBH_sideBar(e)
		{
			let t = typeof(e);
			if (t != "undefined")
			{
				opt.list.side = t == "number" ? e : opt.list.side ? 0 : 1;
				saveOpt();
			}
			document.body.classList.toggle("side", opt.list.side ? true : false);
		}

		let hiddenBox = document.createElement("div");
		hiddenBox.style.display = "none";
		document.body.appendChild(hiddenBox);
		function checkboxCreate(id, text, state, callback, type)
		{
			let	checkbox = document.createElement("input"),
					label = document.createElement("label");

			if (typeof(type) == "undefined")
				type = 2;

			if (typeof(callback) == "undefined")
			{
				callback = function(id, val, e)
				{
					let state = toggle(id, val);
					opt(id, state);
					saveOpt();
				}
			}

			checkbox.setAttribute("type", "checkbox");
			checkbox.id = "cb_" + id;
			label.appendChild(checkbox);
			label.innerHTML += text;
			label.id = "lb_" + id;
			hiddenBox.appendChild(label);
			checkbox = $(checkbox.id);//wtf greasemonkey???
			checkbox.max = type;
			checkbox.addEventListener("change", function TPBH_checkboxChange(e)
			{
				let val = Number(checkbox.value);
				if (++val > type)
					val = 0;

				callback(id, val, e)
			}, false);

			callback(id, state);
			return label;
		}
		for (let i in defaults)
		{
			let state = defaults[i];

			if (!(i in opt.list))
				opt(i, state);
			else
				state = opt(i);

			if (i == "track")
			{
				box.appendChild(checkboxCreate("track", "No trackers", opt.list.track, function(id, val, e)
				{
					let type = toggle(id, val, {"track": opt.list.track});

					let list = document.querySelectorAll("a.magnet");
					if (e)
					{
						opt.list.track = type;
						saveOpt();
					}
					for (let i = 0; i < list.length; i++)
					{
						let l = list[i].getAttribute("ohref");
						if (!l)
							continue;

						list[i].href = fixMagnet(l);
					}
				}, 1));
				continue;
			}
			if (i == "side")
				continue;

			box2.appendChild(checkboxCreate(i, i, state));
		}

		box.appendChild(checkboxCreate("storageType", "Global settings", opt.type, function(id, val, e)
		{
			let type = toggle(id, val, {"storageType": opt.type});
			if (!e)
				return;

			opt.type = type;
			if (opt.type)
			{
				opt.list = clone(opt.glob);
				eraseCookie("options", "/");
				eraseCookie("options", location.pathname.match(/(\/[^\/]+\/[^\/]+)/)[1]);
			}
			else
				opt.list = clone(opt.page);

			for (let i in defaults)
			{
				let state = i in opt.list ? opt.list[i] : defaults[i];
				toggle(i, state);
			}
			saveOpt();
		}, 1));


		let obj;
		if (isTPB)
			obj = $("main-content").nextSibling;
		else if (isl337x)
			obj = document.querySelector(".searchResult");
		else if (isPornleech)
			obj = document.querySelector('div.b-content > table[width="75%"]');

		let pages = (function p(obj)
		{
			if (obj)
			{
				if (obj.tagName == "DIV")
					return obj;

				return p(obj.nextSibling);
			}
			return obj;
		})(obj);
		if (pages)
			pages.className = "pages";

		let footer = null,
				a = document.createElement("a"),
				file = document.createElementNS ("http://www.w3.org/2000/svg", "svg"),
				spacer = document.createElement("span");

		if (isTPB)
			footer = $("foot").getElementsByTagName("p")[0];
		else if (isl337x)
			footer = document.getElementsByTagName("footer")[0].getElementsByTagName("p")[0];
		else if (isPornleech)
			footer = document.querySelector(".footbg");
		file.setAttributeNS(null, "viewBox", "0 0 24 24");
		file.setAttributeNS(null, "class", "file");
		file.innerHTML = '<path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"></path>';
		file.setAttributeNS(null, "title", "Save to file");
		spacer.textContent = " | ";
		box = document.createElement("span");
		box.className = "tools";
		a.href = "#";
		a.title = "Backup settings";
		a.textContent = "Backup";
		box.appendChild(file);
		box.appendChild(a);
		let div = document.createElement("div"),
				html = multiline(function(){/*
<div id="msgBlur"></div>
<div id="msgBox">
	<div id="msgInfo"></div>
	<textarea id="msgField" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" wrap="hard"></textarea>
	<div id="msgStatusBar">
		<div id="msg"></div>
		<input id="btnCopy" type="button" value="Copy"/>
		<input id="btnSave" type="button" value="Save"/>
		<input id="btnClose" type="button" value="Close"/>
	</div>
</div>
		*/});
		div.id = "backupRestoreBox";
		div.innerHTML = html;
		document.body.appendChild(div);
		let msgBox = $("msgBox"),
				msgBlur = $("msgBlur"),
				msgField = $("msgField"),
				msgInfo = $("msgInfo"),
				msg = $("msg"),
				btnCopy = $("btnCopy"),
				btnSave = $("btnSave"),
				btnClose = $("btnClose");

		msgBlur.addEventListener("click", function TPBH_msgBlur(e)
		{
			msgBoxHide();
		}, true);
		msgField.addEventListener("input", function TPBH_msgField(e)
		{
			if (!msgBoxShow.type)
				return;

			btnCopy.disabled = !msgField.value.trim();
		}, false);
		function msgBoxShow(type)
		{
//log("msgBoxShow " + type)
			document.body.setAttribute("msg","");
			msgBox.style.marginLeft = -msgBox.offsetWidth / 2 + "px";
			msgBox.style.marginTop = -msgBox.offsetHeight / 2 + "px";
			msgBoxShow.opened = true;
			msgBoxShow.type = type;
			if (type)
			{
				msg.textContent = "Please enter settings string";
				msgField.removeAttribute("readonly");
				btnSave.disabled = false;
				btnCopy.disabled = true;
				btnCopy.value = "Restore";
				btnSave.value = "Restore from file";
			}
			else
			{
				msgField.setAttribute("readonly", "");
				btnSave.disabled = true;
				btnCopy.disabled = true;
				btnCopy.value = "Copy";
				btnSave.value = "Save as file";
				document.body.setAttribute("msgShow", "");
				msgShow("Please wait, gathering data");
			}
		}
		function msgBoxHide()
		{
//log("msgBoxHide")
			document.body.removeAttribute("msg");
			document.body.removeAttribute("msgShow");
			msgInfo.removeAttribute("anim");
			msgInfo.removeAttribute("anim2");
			msgField.value = "";
			msgField._value = "";
			msgBoxShow.opened = false;
		}
		function centerBox(box)
		{
			box.style.left = 0;
			box.style.top = 0;
			box.style.left = (msgField.offsetWidth + msgField.offsetLeft - box.clientWidth + 4) / 2 + "px";
			box.style.top = (msgField.offsetHeight + msgField.offsetTop - box.clientHeight + 4) / 2 + "px";
		}
		function msgShow(txt, timeout)
		{
			clearTimeout(this.timeout);
			msgInfo.removeAttribute("anim");
			msgInfo.removeAttribute("anim2");
//			document.body.removeAttribute("msgShow");
			msgInfo.setAttribute("anim", "");
			document.body.setAttribute("msgShow", "");
			msgInfo.textContent = txt;
			centerBox(msgInfo);
			if (timeout)
			{
				this.timeout = setTimeout(function()
				{
					msgInfo.setAttribute("anim2", "");
				}, timeout);
			}
		}
/*
		let transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		}
*/
		let anims = {
					"animation"      : "animationend",
					"OAnimation"     : "oAnimationEnd",
					"MozAnimation"   : "animationend",
					"WebkitAnimation": "webkitAnimationEnd"
				},
				animCallback = null;

		for (let t in anims)
		{
			if (msgInfo.style[t] !== undefined)
			{
				msgInfo.addEventListener(anims[t], function TPBH_msginfo(e)
				{
//log(e);
					msgInfo.removeAttribute("anim");
					msgInfo.removeAttribute("anim2");
					if (e.animationName == "msgInfoHide")
					{
						document.body.removeAttribute("msgShow");
					}
					if (animCallback)
						animCallback(e);
				}, false);
				break;
			}
		}


		btnCopy.addEventListener("click", function TPBH_btnCopy(e)
		{
			if (msgBoxShow.type)
			{
				return restoreData();
			}
/*
			if (msgField._value.length > 1000000)
			{
				prompt("Your backup settings\n" + msg.textContent, msgField._value);
				return;
			}
*/
			let ss = msgField.selectionStart,
					se = msgField.selectionEnd,
					r = false;
			if (ss == se)
			{
				msgField.focus();
				msgField.select();
			}


			try
			{
				r = document.execCommand("copy");
			}catch(e){log(e)};
			if (r)
			{
				document.body.setAttribute("msgShow", "");
				msgShow("Copied to clipboard", 2000);
			}
//			msgField.selectionStart = ss;
//			msgField.selectionEnd = se;

		}, false);

		function restoreData(type)
		{
			let data;
			function restore(data)
			{
				try
				{
					data = JSON.parse(data);
				}
				catch(e)
				{
					alert("Error restoring settings");
					return;
				}
				let numCs = 0,
						numLs = 0;

				if ("ls" in data)
				{
					for(let i in data.ls)
					{
						ls.save(i, undefined, data.ls[i], undefined, false);
//						localStorage.setItem(i, data.ls[i]);
						let d;
						try
						{
							d = JSON.parse(data.ls[i]);
						}catch(e)
						{
							continue;
						};
						if (i == "options")
						{
							try
							{
								let opt = d,
										obj = $("cb_storageType"),
										v = ~~obj.value;

								obj.value = 0;
								obj.dispatchEvent(new Event("change"));
								for(let i in opt)
								{
									if (i == "side")
									{
										TPBH_sideBar(opt[i]);
										continue;
									}
									let obj = $("cb_" + i);
									if (!obj)
										continue;

									obj.value = opt[i]-1;
									if (obj.value < 0)
										obj.value = obj.max;

									obj.dispatchEvent(new Event("change"));
									
								}
								if (!v)
									obj.dispatchEvent(new Event("change"));
							}
							catch(e)
							{
								log(e);
							}
						}
						if (i == "order")
						{
							prefs.order._list = d;
							prefs.order.show(d);
						}
						numLs++;
					}
				}
				if ("cs" in data)
				{
					for(let i in data.cs)
					{
						let v,p,
								cp = location.pathname.match(/(\/[^\/]+\/[^\/]+)/)[1];
						if (typeof(data.cs[i]) == "string")
						{
							v = data.cs[i];
							p = cp;
						}
						else
						{
							v = data.cs[i].v;
							p = data.cs[i].p;
						}
						setCookie(i, v, null, p);
						if (i == "options" && p == cp)
						{
							try
							{
								let opt = JSON.parse(v),
										obj = $("cb_storageType");
								obj.value = 1;
								obj.dispatchEvent(new Event("change"));

								for(let i in opt)
								{
									let obj = $("cb_" + i);
									if (!obj)
										continue;

									obj.value = opt[i]-1;
									if (obj.value < 0)
										obj.value = obj.max;

									obj.dispatchEvent(new Event("change"));
								}
							}
							catch(e)
							{
								log(e);
							}
						}
						numCs++;
					}
				}
				let text = [];
				if (numCs)
					text.push(numCs + " cookie" + (numCs != 1 ? "s" : ""));

				if (numLs)
					text.push(numLs + " localStorage item" + (numLs != 1 ? "s" : ""));

				alert("Restored " + text.join(", "));
				msgBoxHide();
			}
			if (type)
				TPBH_fileLoad(restore, ".tpbh");
			else
				restore(msgField.value);
		}
		btnSave.addEventListener("click", function TPBH_btnSave(e)
		{
			if (msgBoxShow.type)
			{
				return restoreData(true);
			}
			let d = new Date(),
					date = d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()),
					data = msgField._value;

			fileSave("TPBH_v" + tpbhVersion + "_settings_" + date + ".tpbh", data, ".tpbh");
		}, false);
		box.addEventListener("click", function TPBH_backup(e)
		{
			e.stopPropagation();
			e.preventDefault();

			let obj = {},
					numLs = 0,
					numCs = 0,
					keys = Object.keys(localStorage);

			for(let i = 0; i < cs.list.length; i++)
			{

				let v = getCookie(cs.list[i]);
				if (v !== null && v !== "")
				{
					if (!("cs" in obj))
						obj.cs = {};

					obj.cs[cs.list[i]] = {v: v, p: location.pathname.match(/(\/[^\/]+\/[^\/]+)/)};
					numCs++;
				}
			}
			function getText(p)
			{
				let text = [];
				if (numCs)
					text.push(numCs + " cookie" + (numCs != 1 ? "s" : ""));
				if (numLs)
					text.push(numLs + " localStorage item" + (numLs != 1 ? "s" : ""));

				text = text.join(", ");
				if (text && p)
					text = " (" + text + ")";

				return text;
			}
			msgBoxShow();
			(function loop(s)
			{
				if (!msgBoxShow.opened)
					return;
				let end = Math.min(s + 399, keys.length);
				for(let i = s; i < end; i++)
				{

					msg.textContent = ((100/keys.length*i) << 0) + "%" + getText(1);
					if (isNaN(keys[i]) && ls.safeKeys.indexOf(keys[i]) == -1)
					{
						continue;
					}

					if (!("ls" in obj))
						obj.ls = {};

					obj.ls[keys[i]] = localStorage[keys[i]];
					numLs++;
				}
				JSON.stringify(obj);
				if (end < keys.length)
				{
					return setTimeout(function()
					{
						loop(end);
					});
				}
				msg.textContent = "99%" + getText(1);
				msgShow("Converting to text");
				msg.textContent = getText();
				let data = JSON.stringify(obj),
						txt = "Trying display " + bytes2x(data.length) + " of text.";

				msg.textContent += " (" + bytes2x(data.length) + ")";
				if (data.length > 500000)
					txt += "\n\nIt might take a minute during which time your browser might freeze.";

				animCallback = function(e)
				{
					animCallback = null;

					msgField._value = data;

					if (data.length > 1000000000)
					{
						msgShow("String is too long to show.\nPress Copy button to copy it to clipboard\n(it might take a while and your browser might freeze during that time)");
					}
					else
					{
						msgField.value = data;
						msgInfo.setAttribute("anim2", "");
					}
					msgField.selectionStart = msgField.value.length-1;
					msgField.selectionEnd = 0;
					msgField.focus();
					btnSave.disabled = false;
					btnCopy.disabled = false;
				};
				msgShow(txt);
			})(0);
		}, false);
		function bytes2x(b, i)
		{
			if (!b)
				return "0 B";

			if (typeof i == "undefined")
				i = Math.floor(Math.log(b) / Math.log(1024));

			return parseFloat((b / Math.pow(1024, i)).toFixed(2)) + " " + ["B", "KB", "MB", "GB", "TB", "PB"][i];
		}
		btnClose.addEventListener("click", function TPBH_btnClose(e)
		{
			msgBoxHide();
		}, false);
		footer.appendChild(box);
		footer.appendChild(spacer);
		box = box.cloneNode(false);
		a = a.cloneNode(true);
		a.title = "Restore settings from string/file";
		file = file.cloneNode(true);
		file.innerHTML = '<path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"></path>';
		file.setAttributeNS(null, "title", "Restore settings from string/file");
		box.addEventListener("click", function TPBH_restore(e)
		{
			msgBoxShow(true);
/*
			if (e.target.tagName == "path" || e.target.className.baseVal == "file")
			{
				TPBH_fileLoad(restore, ".tpbh");
			}
			else
			{
				msgBoxShow(true);
//				restore(prompt("Enter settings"));
			}
*/
			e.stopPropagation();
			e.preventDefault();
		},false);
		a.textContent = "Restore";
		box.appendChild(file);
		box.appendChild(a);
		footer.appendChild(box);

		footer.appendChild(spacer);
		box = box.cloneNode(false);
		a = a.cloneNode(true);
		a.textContent = "Reset sort";
		a.title = "Reset table column order";
		file = file.cloneNode(true);
		file.innerHTML = '<path d="M13.75 7.04h2.75l-4.1 4.1-4.1-4.1h3.77a4.82 4.82 0 0 0-1.43-3.52 4.97 4.97 0 1 0-1.38 8l1.22 1.22a6.62 6.62 0 1 1 3.27-5.7z"/>';
		file.setAttributeNS(null, "title", "Load from a file");
		box.addEventListener("click", function TPBH_reset(e)
		{
			e.stopPropagation();
			e.preventDefault();
			prefs.order._list.sort();
			prefs.order.show();
			prefs.order.save();
		},false);
		box.appendChild(file);
		box.appendChild(a);
		footer.appendChild(box);

		function pad(t)
		{
			return "" + t < 10 ? "0" + t : t;
		}

		function TPBH_fileLoad(callback, ext)
		{
			let f = document.createElement("input");
			f.type = "file";
			if (typeof(ext) == "undefined")
				ext = ".json";

			if (ext)
				f.setAttribute("accept", ext);

			function TPBH_readFile(e)
			{
				f.removeEventListener("change", TPBH_readFile, false);
				let files = f.files;
				if (!f.files.length)
				{
					alert("Please select a file!");
					return;
				}
				let reader = new FileReader();

				reader.onloadend = function(evt)
				{
					if (evt.target.readyState == FileReader.DONE)
					{
						callback(evt.target.result);
					}
				};

				let blob = f.files[0].slice(0, f.files[0].size);
				reader.readAsBinaryString(blob);
			}
			f.addEventListener("change", TPBH_readFile, false);
			f.click();
		}

		function fileSave(name, data, type)
		{
			type = type ? type : "text/json";
			let blob = new Blob([data], {type: type}),
					a = document.createElement("a"),
					d = new Date(),
					date = d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());

			a.download = name;
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = [type, a.download, a.href].join(":");
			document.body.appendChild(a);
			a.click();
			a.parentNode.removeChild(a);
		}
	})();//opt()

	let dnd = {
		parent: function(e, _p, type)
		{

			let p = e;
			if (!_p)
				_p = dnd.el && dnd.el.parentNode;

			while(p && p.parentNode != _p && (!type || (type &&  p.tagName != type)))
			{
				p = p.parentNode;
			}
			return p;
		},
		el: null,
		start: function(e)
		{
			let el = dnd.parent(e.target, document.body, "TH");
			if (!el) return;
			e.stopPropagation();
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", "")
			e.dataTransfer.setDragImage(document.createElement("span"), 0, 0);

			el.parentNode.parentNode.parentNode.setAttribute("drag", el.cellIndex+1);
			dnd.el = el
			dnd.elOver = [];
		},
		over: function(e)
		{
			if (!dnd.el) return;
			e.stopPropagation();
			e.preventDefault(); // Necessary. Allows us to drop.

			let o = e.target;
			while(o && o.tagName != "TD")
			{
				o = o.parentNode;
			}
			let el;
			if (o)
			{
				let i = o.cellIndex;
				if (o.parentNode.parentNode.parentNode == dnd.el.parentNode.parentNode.parentNode) //.classList.contains("searchResult"))
					el = dnd.el.parentNode.children[i];
			}
			if (!el)
				el = dnd.parent(e.target);

			let table = el && el.parentNode.parentNode.parentNode,
					elOver = dnd.elOver[0];
			e.dataTransfer.dropEffect = el ? (el != dnd.el ? "move" : "copyMove") : "none";

			if (elOver && el != elOver)
			{
				let tableOver = dnd.elOver[0] && dnd.elOver[0].parentNode.parentNode.parentNode;
				tableOver.classList.remove("before");
				tableOver.classList.remove("after");
				tableOver.removeAttribute("ind");
			}

			if (el && el != dnd.el)
			{
				let box = elOver == el ? dnd.elOver[1] : el.getBoundingClientRect(),
						w = box.width / 2 + box.x;

				if ((e.clientX <= w && el.previousElementSibling != dnd.el)
						||(e.clientX >= w && el.nextElementSibling == dnd.el))
				{
					dnd.elOver = [el, box];
					table.classList.remove("after");
					table.classList.add("before");
					table.setAttribute("ind", el.cellIndex+1);
					return false;
				}
				else if ((e.clientX >= w && el.nextElementSibling != dnd.el)
								|| (e.clientX <= w && el.previousElementSibling == dnd.el))
				{
					dnd.elOver = [el, box];
					table.classList.remove("before");
					table.classList.add("after");
					table.setAttribute("ind", el.cellIndex+1);
					return false;
				}
			}
			return false;
		},
		drop: function(e)
		{
			if (!dnd.el) return;
			// this / e.target is current target element.
			e.stopPropagation();
			e.preventDefault();
			if (this == dnd.el)
				return false;

			let ob = e.target,
					el;
			while(ob && ob.tagName != "TD")
			{
				ob = ob.parentNode;
			}
			if (ob && ob.parentNode.parentNode.parentNode.classList.contains("searchResult"))
			{
				el = dnd.el.parentNode.children[ob.cellIndex];
			}
			if (!el)
				el = dnd.parent(e.target);

			let table = el.parentNode.parentNode.parentNode,
					n = el.cellIndex,
					o = dnd.el.cellIndex
					before = table.classList.contains("before"),
					after = table.classList.contains("after");

			if (!before && !after)
				return false;

			if (n > o && before)
				n--;
			else if (n < o && after)
				n++;

			prefs.order._list.splice(n,0,prefs.order._list.splice(o,1)[0]);
			prefs.order.show();
			prefs.order.save();
			return false;
		},
		end: function(e)
		{
			// this/e.target is the source node.
			clearTimeout(dnd.t);
			let table = dnd.el.parentNode.parentNode.parentNode;
			table.removeAttribute("drag");
			table.removeAttribute("ind");
			table.classList.remove("after");
			table.classList.remove("before");
			dnd.el = null;
		}
	}//dnd
	for(let rti = 0; rti < resultsTable.length; rti++)
	{
		obj = resultsTable[rti];
		obj.classList.add("searchResult");
		let table = obj;
		tr = obj.getElementsByTagName("tr");
		let list = [],
				box = obj.parentNode.parentNode,
				ev;
		if (isl337x)
		{
			obj.addEventListener("mouseenter", function TPBH_mouseover(e)
			{
				if (e.target.tagName != "TR")
					return;

				clearTimeout(ev);
				document.body.setAttribute("type", e.target.getAttribute("type"));

			}, true);
			obj.addEventListener("mouseleave", function TPBH_mouseover(e)
			{
				if (e.target.tagName != "TR")
					return;

				ev = setTimeout(function(e)
				{
					document.body.removeAttribute("type");
				});

			}, true);
		}
		for(let tri = 0; tri < tr.length; tri++)
		{
			if (isl337x)
			{
				let td;
				if (tr[tri].parentNode.tagName == "THEAD")
				{
					td = document.createElement("th");
					td.innerHTML = "dl";
				}
				else
				{
					td = document.createElement("td");
//					td.innerHTML = '<a class="magnetlink" href="magnet:"><img src="data:image/gif;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw=="></a>';
					td.innerHTML = '<a class="magnetlink" href="magnet:"></a>';
				}
				td.className = "coll-2";
				tr[tri].insertBefore(td, tr[tri].children[4]);
				let cols = tr[tri].children.length - 1;
				let t = tr[tri].children[cols].className.replace("coll-5", "").trim();
				if (t)
				{
					tr[tri].classList.toggle(t, true);
					tr[tri].setAttribute("type", t);
					tr[tri].children[cols].title = t;
				}
			}
			else if (isTPB)
			{
				if (tr[tri].parentNode.tagName == "THEAD")
				{
					tr[tri].children[3].innerHTML = "DL";
				}
			}
			m = tr[tri].getElementsByTagName("a");
			l = "",
			li = 0;
			for(i = 0; i < m.length; i++)
			{
				if (m[i].href.match(/\/torrent\//))
				{
					l = m[i].href;
				}
				else if (l && m[i].href.match(/^magnet:/))
				{
					let a = m[i];
					let link = getLink(l, null, a),
							id = (new RegExp("\/torrent\/(([0-9]+)(\/.*)?)", "")).exec(l)[2],
							dl = ls.downloaded(id) || 0;

					tr[tri].setAttribute("d", dl > 0 ? dl : 0);
					list.push([link, a]);
					a.classList.add("magnet");
					let row = tr[tri];
					a.addEventListener("click", function TPBH_click(e)
					{
						if (isCTRL)
						{
							if (dl > 0)
								dl = -dl;
						}
						else
						{
							if (dl < 0)
								dl = -dl;
							++dl;
						}
						row.setAttribute("d", dl > 0 ? dl : 0);
						ls.downloaded(id, dl);
						if (dl < 1)
						{
							e.stopPropagation();
							e.preventDefault();
						}
//log(id);
//log(e);
					}, false);
				}
				else if (m[i].href.match(/\.torrent$/))
				{
					list[list.length-1][0].href = m[i].href;
					m[i].parentNode.removeChild(m[i]);
				}
			}
		}// for (let tri
		for(let i = 0; i < list.length; i++)
		{
			list[i][1].parentNode.insertBefore(list[i][0], list[i][1].nextSibling);

/*
list[i][1].parentNode.parentNode.parentNode.addEventListener("click", function TPBH_click(e)
{
	if (e.target.tagName == "TD")
	{
		list[i][1].click();
	}
}, true);
*/
//move chat icon to the end;
			let imgs = list[i][1].parentNode.getElementsByTagName("img");

			if (!imgs.length)
				continue;

			for(let n = 0; n < imgs.length; n++)
			{
				let img = imgs[n];
				if (img.getAttribute("src").indexOf("comment") != -1 && img.nextSibling)
					img.parentNode.appendChild(img);
			}
		}

		prefs.order = {
			_list: [],
			_default: [],
			load: function()
			{
				try
				{
					this._list = JSON.parse(localStorage.getItem("order")) || this._default;
				}
				catch(e)
				{
					this._list = this._default;
				}
				return this._list;
			},
			save: function(list)
			{
				localStorage.setItem("order", JSON.stringify(list || this._list));
			},
			show: function(array)
			{
				array = array || this._list;
				for(let o = 0; o < resultsTable.length; o++)
				{
					let ob = resultsTable[o];
					for(let i = 0; i < array.length; i++)
					{
						let obj = ob.querySelector('[ind="' + (array[i]+1) + '"]');
						if (!obj)
							continue;

						let n = obj.cellIndex;
						let tr = obj.parentNode.parentNode.parentNode.getElementsByTagName("tr");
						for (let t = 0; t < tr.length; t++)
						{
							tr[t].appendChild(tr[t].children[n]);
						}
					}
				}
			}
		};//order
		let ths = obj.getElementsByTagName("th"),
				array = [];

		for(let i = 0; i < ths.length; i++)
		{
			let th = ths[i];
			th.setAttribute("draggable", true);
			th.setAttribute("ind", i+1);
			array[i] = i;
		}
		prefs.order._default = array;
		prefs.order.load();
		prefs.order.show(prefs.order._list);
		table.addEventListener("dragstart", dnd.start, false);
		table.addEventListener("dragend", dnd.end, false);
	}//if $("searchResult")
	document.body.addEventListener("dragover", dnd.over, false);
	document.body.addEventListener("drop", dnd.drop, false);

	obj = document.getElementsByClassName("download");
	if (obj)
	{
		for(i = 0; i < obj.length; i++)
		{
			l = obj[i].getElementsByTagName("a");
			var magnet = null;
			var torrent = null;
			for(li = 0; li < l.length; li++)
			{
				if (l[li].href.match(/^magnet:/))
				{
					let parent = l[li].parentNode;
					magnet = l[li];
					let id = (new RegExp("\/torrent\/(([0-9]+)(\/.*)?)", "")).exec(window.location.href)[2],
							dl = ls.downloaded(id) || 0,
							img = document.createElement("img");
//					img.src = magnet.style.backgroundImage.replace(/^[^'"]+['"]([^'"]+)['"]\)$/, "$1");
//					magnet.insertBefore(img, magnet.firstChild);
					parent.setAttribute("d", dl > 0 ? dl : 0);
					magnet.className += " magnet";
					magnet.addEventListener("click", function TPBH_magnet(e)
					{
						if (isCTRL)
						{
							if (dl > 0)
								dl = -dl;
						}
						else
						{
							if (dl < 0)
								dl = -dl;
							++dl;
						}

						if (dl < 1)
						{
							e.preventDefault();
						}

						e.stopPropagation();
						ls.downloaded(id, dl);
						parent.setAttribute("d", dl > 0 ? dl : 0);
//log(id);
//log(e);
					}, true);
				}
				else if (l[li].href.match(/\.torrent$/))
				{
					torrent = l[li];
				}
			}
/*
			if (!torrent && magnet)
			{
				var t = getLink(window.location.href, "Get Torrent File", magnet.parentNode);
				magnet.parentNode.insertBefore(document.createTextNode(")"), magnet.nextSibling);
				magnet.parentNode.insertBefore(t, magnet.nextSibling);
				magnet.parentNode.insertBefore(document.createTextNode(" ("), magnet.nextSibling);
			}
*/
		}
		l = $("details");
		if (l)
		{
			let filesNum = null,
					id = (new RegExp("\/torrent\/(([0-9]+)(\/.*)?)", "")).exec(window.location.href)[2];
			try
			{
				l = l.querySelector('a[title="Files"]');
				if (l)
				{
					(function()
					{
						let filelist = 0,
								fc = $("filelistContainer");

						function toggleFilelist()
						{
							if (fc.style.display=="block")
							{
								fc.style.display="none";
							} else {
								fc.style.display="block";
							}
						}
						eval(l.onclick.toString());
						l.addEventListener("click", onclick, true);
					})();
					filesNum = l.innerHTML;
					let location = window.location.href;
					try
					{
					}
					catch(e){alert(e);}
					l.click();
					setTimeout(function()
					{
						if (location != window.location.href)
						{
							window.history.back();
						}
						let tds = $("filelistContainer").getElementsByTagName("td"),
								list = [];
						for(let i = 0; i < tds.length; i += 2)
						{
							let file = tds[i].textContent,
									size = tds[i+1] ? tds[i+1].textContent : 0;

							list.push(file + (size ? " (" + size + ")" : ""));
						}

						ls.num(id, Math.max(filesNum, list.length));
						ls.files(id, list.join("\n"));
					}, 1000);
				}
//				unsafeWindow.toggleFilelist = unsafeWindow._toggleFilelist;
			}
			catch(e)
			{
				log(e)
			}
		}
	}

//style
	let	style = document.createElement("style"),
			css = function(){/*
body.l337x .table-list td.name .comments,
body.l337x .accordion .accordion-title,
body.l337x .bitcoin-text,
body.l337x .box-info .box-info-heading .heading-title,
body.l337x .box-info .box-info-heading h1,
body.l337x .box-info .box-info-heading.orange-title,
body.l337x .btn,
body.l337x .btn-green,
body.l337x .btn-search,
body.l337x .filter-all h3,
body.l337x .member-tag,
body.l337x .mobile-menu li a,
body.l337x .notification-page .box-info-heading.orange-title .btn-grey,
body.l337x .our-technologies li a,
body.l337x .replies .reply-said,
body.l337x .thread-detail .how-can-help h4,
body.l337x .thread-detail .need-help,
body.l337x .thread-detail .thread-title,
body.l337x .thread-member-detail .member-name,
body.l337x .top-bar-left a,
body.l337x .top-bar-nav a,
body.l337x .trending-torrent-explore .box-info .box-info-heading h2,
body.l337x .user-box li,
body.l337x footer li a,
body.l337x nav li a,
body.l337x .reply-content a,
body.l337x .reply-content h4,
body.l337x .box-heading-pager,
body.l337x .news-featured-heading .left h3,
body.l337x .sub-forum .box-info-left a.main-heading-link,
body.l337x .sub-forum .box-info-left span,
body.l337x .bitcoin-text
{
	font-family: "Oswald Regular",sans-serif;
}
body.l337x #change-email label,
body.l337x #change-password label,
body.l337x #settings h4,
body.l337x #tracker-list h3,
body.l337x .box-info .tab-content h2,
body.l337x .box-info-detail p a,
body.l337x .category-list li strong,
body.l337x .comment-box h2,
body.l337x .comment-info .detail .user-name a,
body.l337x .error-info .box-info-time,
body.l337x .error-info,
body.l337x .head,
body.l337x .highlight-class,
body.l337x .inbox-message-list .table-bordered > tbody > tr > td.active a,
body.l337x .modal.modal-custom a,
body.l337x .movie-torrent .torrent-title .size strong,
body.l337x .torrent-category-detail .list span.leeches,
body.l337x .torrent-category-detail .list span.seeds,
body.l337x .torrent-category-detail .list strong,
body.l337x .torrent-work .torrent-work-heading,
body.l337x b,
body.l337x blockquote .blockquote-content,
body.l337x blockquote header,
body.l337x strong
{
	font-family: "Opensans Bold",sans-serif;
}
body.l337x label,
.pagination li a
{
	font-family: 'Opensans Semibold',sans-serif;
}
body.l337x .filter-list.small-list li a,
body.l337x .search-categories h3,
body.l337x .thread-reply-page .box-info-left a.main-heading-link,
body.l337x .thread-reply-page .box-info-left span,
body.l337x footer li a
{
	font-family: 'Oswald Light',sans-serif;
}

body[msgShow] #msgInfo
{
	margin-top: 0;
}
body[msg]
{
	overflow: hidden;
}
#msg
{
	text-align: start;
}
#msgStatusBar
{
	text-align: end;
	display: table;
	width: 100%;
}
#msgStatusBar > *
{
	display: table-cell;
	vertical-align: middle;
}
#msgStatusBar > input:not(:last-child)
{
	margin: 4px;
}
#msgInfo[anim],
#msgInfo[anim2]
{
	animation-name: msgInfoShow;
	animation-duration: .08s;
	animation-timing-function: easeOutExpo;
}
#msgInfo[anim2]
{
	animation-name: msgInfoHide;
}

@keyframes msgInfoShow
{
	from
	{
		opacity: 0;
	}
	to
	{
		opacity: 1;
	}
}
@keyframes msgInfoHide
{
	from
	{
			opacity: 1;
	}
	to
	{
		opacity: 0;
	}
}
#msgInfo:not([anim])
{
}
#msgInfo
{
	margin-top: 99999999px;
	position: absolute;
	left: 0;
	top: 0;
	white-space: pre-wrap;
	border: 1px solid black;
	border-radius: 3px;
	padding: 1em;
	background-color: lightyellow;
}
#msgField
{
	width: 40em;
	height: 7em;
	border: 1px solid black;
	resize: none;
	overflow-y: auto;
	overflow-x: initial;
	word-wrap: break-word;
	text-align: start;
	white-space: pre-wrap;
	font-size: small;
	font-family: monospace;
}
#msgBlur
{
	z-index: 99998;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: grey;
	opacity: 0.6;
	display: none;
}

#msgBox
{
	z-index: 99999;
	position: fixed;
	left: 50%;
	top: 50%;
	padding: 4px 4px 1px 4px;
	border: 1px solid black;
	background-color: white;
	text-align: center;
	box-shadow: 10px 10px 50px 1px #000;
	opacity: 1;
	display: none;
	font-size: small;
}

body[msg] #msgBlur,
body[msg] #msgBox
{
	display: block;
}

body[msg] > :not(#backupRestoreBox)
{
	filter: blur(3px);
}

body.l337x aside.col-3.pull-right *
{
	overflow: hidden;
	white-space: nowrap;
}
body.l337x:not(.side) aside.col-3.pull-right
{
	width: 0;
	height: 0;
	overflow: hidden;
	position: absolute;
	right: 0;
}
body.l337x,
body.l337x *
{
	transition: all 0.2s;
}
body.l337x .searchResult *
{
	transition: none;
}

body.l337x .box-info-detail
{
	border-radius: 0;
}
body.l337x nav
{
}
body.l337x footer
{
	margin-top: 1.5em;
}
body.l337x:not(.side) div.page-content
{
	width: 100%;
}
body a.magnet,
body.l337x td.name > a
{
	display: inline;
	padding: 4px;
}
body a.magnet
{
	padding: 0 0.2em 0 0;
	margin: 0;
}

a.magnet:before
{
	content: "";
	width: 1em;
	height: 1em;
	min-width: 12px;
	min-height: 12px;
	display: inline-block;
	background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNi42NywxNlY4YzAtMC43NCwwLjYtMS4zMywxLjMzLTEuMzNTOS4zMyw3LjI2LDkuMzMsOHY4SDE2VjhjMC00LjQyLTMuNTgtOC04LThTMCwzLjU4LDAsOHY4SDYuNjd6Ii8+PHBhdGggZD0iTTEwLjY3LDEwLjY3aDRWOGMwLTMuNjgtMi45OC02LjY3LTYuNjctNi42N1MxLjMzLDQuMzIsMS4zMyw4djIuNjdoNFY4YzAtMS40NywxLjE5LTIuNjcsMi42Ny0yLjY3ICBTMTAuNjcsNi41MywxMC42Nyw4VjEwLjY3eiIgZmlsbD0iI0NDMTUwMCIvPjxwYXRoIGQ9Ik0xMiwxMC42N1Y5LjMzYzAtMi4yMS0xLjc5LTQtNC00YzEuNDcsMCwyLjY3LDEuMTksMi42NywyLjY3djIuNjdIMTJ6IiBmaWxsPSIjOEExQzBFIi8+PHBhdGggZD0ibTQgOS4zM3YxLjMzaDEuMzN2LTIuNjZjMC0xLjQ3IDEuMTktMi42NyAyLjY3LTIuNjctMi4yMSAwLTQgMS43OS00IDR6IiBmaWxsPSIjRUMyRjEyIi8+PHBhdGggZD0iTTIuNjcsMTAuNjdIMS4zM1Y4YzAtMy42OCwyLjk4LTYuNjcsNi42Ny02LjY3Yy0yLjk1LDAtNS4zMywyLjM5LTUuMzMsNS4zM1YxMC42N3oiIGZpbGw9IiM4OTFDMEQiLz48cGF0aCBkPSJNOCwxLjMzYzMuNjgsMCw2LjY3LDIuOTgsNi42Nyw2LjY3djIuNjdoLTEuMzN2LTRDMTMuMzMsMy43MiwxMC45NSwxLjMzLDgsMS4zM3oiIGZpbGw9IiNFQzJGMTIiLz48cmVjdCB4PSIxLjMzIiB5PSIxMC42NyIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEwLjY3IiB5PSIxMC42NyIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEzLjMzIiB5PSIxMC42NyIgd2lkdGg9IjEuMzMiIGhlaWdodD0iNCIgZmlsbD0iI0U1RTVFNSIvPjxyZWN0IHg9IjQiIHk9IjEwLjY3IiB3aWR0aD0iMS4zMyIgaGVpZ2h0PSI0IiBmaWxsPSIjRTVFNUU1Ii8+PHJlY3QgeD0iMTAuNjciIHk9IjEwLjY3IiB3aWR0aD0iMS4zMyIgaGVpZ2h0PSI0IiBmaWxsPSIjQjVCNUI1Ii8+PHJlY3QgeD0iMS4zMyIgeT0iMTAuNjciIHdpZHRoPSIxLjMzIiBoZWlnaHQ9IjQiIGZpbGw9IiNCNUI1QjUiLz48L3N2Zz4=");
	background-repeat: no-repeat;
	background-position: center;
	vertical-align: middle;
}
a.magnet > img
{
	display: none;
}

body.l337x .table-list th
{
	text-align: center;
	position: relative;
	padding: 0;
}
body.tpb .searchResult th#sc_6.asc a.sort,
body.tpb .searchResult th#sc_6.desc a.sort,
body.tpb .searchResult th#sc_7.asc a.sort,
body.tpb .searchResult th#sc_7.desc a.sort,
body.tpb .searchResult th.asc .viewswitch,
body.tpb .searchResult th.desc .viewswitch,
body.l337x .searchResult th#sc_1.asc a.sort,
body.l337x .searchResult th#sc_1.desc a.sort,
body.l337x .searchResult th#sc_2.asc a.sort,
body.l337x .searchResult th#sc_2.desc a.sort
{
	margin-right: 0.7em;
}
body.l337x .table-list-wrap
{
	background-color: #f0f0f0;
}
.searchResult th.asc .sort:after,
.searchResult th.desc .sort:after
{
	content: "\25B2";
	font-size: 0.7em;
	display: none;
	position: absolute;
	right: 4px;
	top: 50%;
	-webkit-transform: translate(0, -50%);
	-moz-transform: translate(0, -50%);
	-ms-transform: translate(0, -50%);
	transform: translate(0, -50%);
}
body.tpb .searchResult th.asc .sort:after,
body.tpb .searchResult th.desc .sort:after
{
	font-size: 0.9em;
}
.searchResult th.asc .sort:after
{
	content: "\25BC";
	display: inline-block;
}
.searchResult th.desc .sort:after
{
	display: inline-block;
}
body.l337x .table-list th a
{
	color: inherit;
}
body.l337x .table-list tbody td
{
	word-break: normal;
	font-family: unset;
	vertical-align: baseline;
	line-height: 2.1em;
}
body.l337x .table-list .coll-4
{
	width: 6%;
}
body.l337x .table-list tbody td.coll-4.size
{
	text-align: right;
	white-space: nowrap;
}

.searchResult tr
{
	position: relative;
	vertical-align: top;
}
body.l337x .table-list tbody tr:hover td,
body.l337x .table-striped > tbody > tr:hover:nth-of-type(2n+1) td
{
	background-color: white;
	transition: none;
}
body.l337x .opt
{
	font-family: initial;
	font-size: 10px;
}
.opt
{
	vertical-align: text-bottom;
}
body.l337x .opt > label,
body.l337x .opt2 > *
{
	vertical-align: sub;
}
.opt2
{
	margin: 0 0.5em 0 0.5em;
	padding: 0.5em;
	outline: 1px solid silver;
}
.opt input
{
	vertical-align: sub;
}
body.l337x .container
{
	max-width: 1510px;
}
body.l337x:not(.side) .container
{
	max-width: 1200px;
}

body.l337x .table-list tbody td:not(.name)
{
	padding: 0 6px 0 6px;
}
body.l337x .table-list tbody td.name
{
	padding: 0 4px 0 33px;
}
body.l337x .table-list td.coll-1 .icon
{
	left: 6px;
	top: unset;
	margin: 0;
	padding: 0 0 0 3px;
}

body.l337x .table-list td.name .comments
{
	top: 0;
	right: 0;
	position: relative;
	display: inline-block;
	margin-top: inherit;
}
body.l337x .tools *,
body.l337x .tools svg
{
	fill: #818181;
	color: #818181;
}
body.l337x .tools:hover *,
body.l337x .tools:hover svg
{
	fill: #fff;
	color: #fff;
}

body.l337x .table-striped > tbody > tr td
{
	background-color: #EAEAEA;
}

body.l337x .table-striped > tbody > tr:nth-of-type(2n+1) td
{
	background-color: #f0f0f0;
}
body.l337x .table-list .coll-date,
body.l337x .table-list .coll-2,
body.l337x .table-list .coll-3,
body.l337x .table-list .coll-4
{
	white-space: nowrap;
}
body.l337x .table-list .coll-1
{
	width: 80%;
}
body.l337x .table-list td.coll-5
{
	text-align: left;
}
body.l337x .table-list .coll-2,
body.l337x .table-list .coll-date,
body.l337x .table-list .coll-3
{
	width: unset;
	padding-left: 0.5em;
	padding-right: 0.5em;
}
body.l337x .table-list th.coll-2.asc,
body.l337x .table-list th.coll-2.desc,
body.l337x .table-list th.coll-date.asc,
body.l337x .table-list th.coll-date.desc,
body.l337x .table-list th.coll-3.asc,
body.l337x .table-list th.coll-3.desc
{
	width: unset;
	padding-left: 0.5em;
	padding-right: 1em;
}

body.l337x .userLegend
{
	float: right;
	padding: 0 4px;
	line-height: 1.5em;
}
body.l337x .userLegend > span
{
	font-size: x-small;
	margin: 2px;
	vertical-align: middle;
}
body.l337x[type="admin"] .userLegend .admin,
body.l337x[type="moderator"] .userLegend .moderator,
body.l337x[type="vip"] .userLegend .vip,
body.l337x[type="uploader"] .userLegend .uploader,
body.l337x[type="trial-uploader"] .userLegend .trial-uploader,
body.l337x[type="user"] .userLegend .user
{
	font-size: 1.2em;
}

body.l337x .userLegend .admin,
body.l337x .table-list td.admin a
{
 color: #717171;
}
body.l337x .userLegend .moderator,
body.l337x .table-list td.moderator a
{
  color: #a5df1b;
}
body.l337x .userLegend .vip,
body.l337x .table-list td.vip a
{
  color: #5192b1;
}
body.l337x .userLegend .uploader,
body.l337x .table-list td.uploader a
{
  color: #dbc25e;
}
body.l337x .userLegend .trial-uploader,
body.l337x .table-list td.trial-uploader a
{
  color: #ee7070;
}
body.l337x .userLegend .user,
body.l337x .table-list td.user a
{
 color: #b6b6b6;
}

table.searchResult img
{
	vertical-align: middle;
}
.tools
{
	cursor: pointer;
	margin-top: 2px;
	display: inline-block;
}
.tools > a
{
	vertical-align: top;
}
svg
{
	width: 1.3em;
	vertical-align: middle;
	margin-right: 0.2em;
}

tr.xvid > td > a,
.xvid,
.xvid a
{
	color: gray;
	font-style: italic;
}

tr.h264 > td > a,
.h264,
.h264 a
{
	color: green;
}


tr.web > td > a,
.web,
.web a
{
	color: green;
	font-style: italic;
}

.cam
{
	text-decoration: line-through
}

tr.h265 > td > a,
.h265,
.h265 a
{
	color: darkorange;
}

.hd
{
	font-weight: bold;
	color: red;
}

.hd720p,
.hd960p
{
	font-weight: bold;
	font-size: 1.1em;
	color: red;
}

.hd960p
{
	font-weight: bold;
	font-size: 1.1em;
	color: red;
}

.hd1080p
{
	font-weight: bold;
	font-size: 1.2em;
	color: red;
}

.hd2160p
{
	font-weight: bold;
	font-size: 1.3em;
	color: red;
}

._10bit
{
}

tr.fav td:first-child:before
{
	content: "";
	top: 0;
	bottom: 0;
	width: 4px;
	left: -1px;
	position: absolute;
	background-color: red;
}

span.hdr:not(.tag)
{
	color: royalblue;
	outline: 1px dashed royalblue;
}
span.highl
{
	outline: 1px dashed darkviolet;
}
span.fav
{
	color: teal;
	outline: 1px dashed red;
}

/*
tr[attempt] .files,
.files[attempt]
{
	outline-color: transparent;
	font-weight: initial;
}
*//*
tr:not([n]) .files
{
/*	outline-color: silver;*//*
	outline-color: transparent;
}
.files
{
	text-align: center;
	outline: 1px solid silver;
	margin-left: 3px;
	margin-right: 3px;
	padding-left: 0px;
	padding-right: 0px;
	cursor: default;
	text-decoration: none;
	display: inline-block;
	color: initial;
	min-width: 1em;
	vertical-align: middle;
}
body.l337x .files
{
	margin: 0 2px 0 4px;
	padding: 0;
	line-height: 1em;
}
body.l337x .table-list tr[n="1"]:not([attempt]),
body.l337x .table-list tr[n="1"]:not([attempt]) > td,
tr[n="1"]:not([attempt])
{
	font-weight: bold;
}
/*tr[n="1"]:not([attempt]) .files:not([attempt])*//*
tr[n="1"] .files
{
	color: red;
}



.files[attempt]
{
	animation-name: loading;
	animation-duration: 2s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}
@keyframes loading
{

	0%
	{
		box-shadow: 0px 0px 2px 1px silver;
	}
	50%
	{
		box-shadow: 0px 0px 3px 2px darkgrey;
	}
	100%
	{
		box-shadow: 0px 0px 2px 1px silver;
	}
}

body:not([show_2160p]) tr._2160p td,
body:not([show_1080p]) tr._1080p td,
body:not([show_720p]) tr._720p td,
body:not([show_h265]) tr.h265 td,
body:not([show_h264]) tr.h264 td,
body:not([show_hdtv]) tr.hdtv td,
body:not([show_xvid]) tr.xvid td,
body:not([show_hdr]) tr.hdr td,
body:not([show_3d]) tr._3d td,
body:not([show_web]) tr.web td,
body:not([show_other]) tr.other td,
body:not([show_brrip]) tr.brrip td,
body:not([show_cam]) tr.cam td
{
	opacity: 0.2;
}
body[show_2160p] tr._2160p td,
body[show_1080p] tr._1080p td,
body[show_720p] tr._720p td,
body[show_h265] tr.h265 td,
body[show_h264] tr.h264 td,
body[show_hdtv] tr.hdtv td,
body[show_xvid] tr.xvid td,
body[show_hdr] tr.hdr td,
body[show_3d] tr._3d td,
body[show_web] tr.web td,
body[show_brrip] tr.brrip td,
body[show_other] tr.other td,
body[show_cam] tr.cam td
{
	opacity: 1;
}
body[show_2160p] tr._2160p.bad td,
body[show_1080p] tr._1080p.bad td,
body[show_720p] tr._720p.bad td,
body[show_h265] tr.h265.bad td,
body[show_h264] tr.h264.bad td,
body[show_hdtv] tr.hdtv.bad td,
body[show_xvid] tr.xvid.bad td,
body[show_hdr] tr.hdr.bad td,
body[show_3d] tr._3d.bad td,
body[show_web] tr.web.bad td,
body[show_brrip] tr.web.brrip td,
body[show_other] tr.other.bad td,
body[show_cam] tr.cam.bad td,
.bad td
{
	filter: saturate(0.4);
}

body[hide_2160p] tr._2160p td,
body[hide_1080p] tr._1080p td,
body[hide_720p] tr._720p td,
body[hide_h265] tr.h265 td,
body[hide_h264] tr.h264 td,
body[hide_hdtv] tr.hdtv td,
body[hide_xvid] tr.xvid td,
body[hide_hdr] tr.hdr td,
body[hide_3d] tr._3d td,
body[hide_web] tr.web td td,
body[hide_brrip] tr.brrip td,
body[hide_other] tr.other td,
body[hide_cam] tr.cam td
{
	opacity: 0.2;
}

body tr:hover td
{
	opacity: 1 !important;
	transition: none;
}
body tr.bad:hover td
{
	filter: saturate(1) !important;
}

.pages
{
	font-weight: 700;
	font-size: 1.2em;
}
.pages a
{
	font-weight: initial;
	font-size: 0.8em;
}

body.l337x .tags
{
	font-size: 0.9em;
}
.tags
{
	float: right;
}
.tags .tag
{
	padding: 1px;
	margin: 1px;
	border: 1px solid silver;
	font-family: monospace;
	letter-spacing: 0px;
	font-size: 0.9em;
	color: silver;
	background-color: transparent;
}
.tags *
{
	font-weight: normal;
	font-style: normal;
	text-decoration: none;
}
body[show_2160p] .tag._2160p,
body[show_1080p] .tag._1080p,
body[show_720p] .tag._720p,
body[show_h265] .tag.h265,
body[show_h264] .tag.h264,
body[show_hdtv] .tag.hdtv,
body[show_xvid] .tag.xvid,
body[show_hdr] .tag.hdr,
body[show_3d] .tag._3d,
body[show_web] .tag.web,
body[show_brrip] .tag.brrip,
body[show_other] .tag.other,
body[show_cam] .tag.cam
{
	color: grey;
	background-color: white;
	border-color: darkgrey;
}

/*downloaded*//*
tr:not([d="0"]) .magnet:before,
div.download:not([d="0"]) .magnet:before
{
	-o-transform: rotate(180deg); /* Opera *//*
	-moz-transform: rotate(180deg); /* Firefox *//*
	-ms-transform: rotate(180deg); /* IE 9 *//*
	-webkit-transform: rotate(180deg); /* Chrome, Safari, Opera *//*
	transform: rotate(180deg);
  -o-animation: move 0.5s ease-in-out infinite alternate;
  -moz-animation: move 0.5s ease-in-out infinite alternate;
 	-webkit-animation: move 0.5s ease-in-out infinite alternate;
	animation: move 0.5s ease-in-out infinite alternate;
}

@keyframes move {
	0%
	{
		-o-transform: rotate(160deg); /* Opera *//*
		-moz-transform: rotate(160deg); /* Firefox *//*
		-ms-transform: rotate(160deg); /* IE 9 *//*
		-webkit-transform: rotate(160deg); /* Chrome, Safari, Opera *//*
		transform: rotate(160deg);
	}
	100%
	{
		-o-transform: rotate(200deg); /* Opera *//*
		-moz-transform: rotate(200deg); /* Firefox *//*
		-ms-transform: rotate(200deg); /* IE 9 *//*
		-webkit-transform: rotate(200deg); /* Chrome, Safari, Opera *//*
		transform: rotate(200deg);
	}
}

div.download .magnet
{
	background-image: unset !important;
	padding: inherit;
}

#filelistContainer
{
	max-height: 20em;
	overflow: auto;
}
body.l337x.side .sideBarButton:after
{
	content: "▶";
}
body.l337x:not(.side) .sideBarButton:after
{
	content: "◀";
}
.sideBarButton
{
	float: right;
	display: inline-block;
	cursor: pointer;
	padding: 0.4em 0.1em 0.4em 0.1em;
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: #d63600;
	border: 1px solid #f85c27;
	border-radius: 3px 3px 0 3px;
	color: #fff;
	text-align: center;
	text-shadow: 0 0 2px #000;
}

[draggable] {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  /* Required to make elements draggable in old WebKit *//*
  -khtml-user-drag: element;
  -webkit-user-drag: element;
}
.searchResult th
{
  cursor: move;
	position: relative;
	background-clip: padding-box !important;
}

.searchResult[drag] th
{
	position: relative;
}


.searchResult[drag].before[ind="1"] th:nth-of-type(1):before,
.searchResult[drag].before[ind="2"] th:nth-of-type(2):before,
.searchResult[drag].before[ind="3"] th:nth-of-type(3):before,
.searchResult[drag].before[ind="4"] th:nth-of-type(4):before,
.searchResult[drag].before[ind="5"] th:nth-of-type(5):before,
.searchResult[drag].before[ind="6"] th:nth-of-type(6):before,
.searchResult[drag].before[ind="7"] th:nth-of-type(7):before,
.searchResult[drag].before[ind="8"] th:nth-of-type(8):before,
.searchResult[drag].after[ind="1"] th:nth-of-type(1):after,
.searchResult[drag].after[ind="2"] th:nth-of-type(2):after,
.searchResult[drag].after[ind="3"] th:nth-of-type(3):after,
.searchResult[drag].after[ind="4"] th:nth-of-type(4):after,
.searchResult[drag].after[ind="5"] th:nth-of-type(5):after,
.searchResult[drag].after[ind="6"] th:nth-of-type(6):after,
.searchResult[drag].after[ind="7"] th:nth-of-type(7):after,
.searchResult[drag].after[ind="8"] th:nth-of-type(8):after
{
	content: "";
	position: absolute;
	width: 4px;
	top: 0;
	bottom: 0;
	z-index: 1;
	border-left: 4px solid #d63600;
}

body.tpb .searchResult[drag] th:before,
body.tpb .searchResult[drag] th:after
{
	top: -1px !important;
	bottom: 1px !important;
}

.searchResult[drag].before th:before
{
	left: -3px;
}

.searchResult[drag].after th:after
{
	right: -3px;
}

body.tpb .searchResult[drag] th:not(:last-child):after
{
	right: -6px;
}

body.tpb .searchResult[drag] th:first-child:before
{
	left: -2px;
}

.searchResult[drag="1"] th:nth-of-type(1),
.searchResult[drag="2"] th:nth-of-type(2),
.searchResult[drag="3"] th:nth-of-type(3),
.searchResult[drag="4"] th:nth-of-type(4),
.searchResult[drag="5"] th:nth-of-type(5),
.searchResult[drag="6"] th:nth-of-type(6),
.searchResult[drag="7"] th:nth-of-type(7),
.searchResult[drag="8"] th:nth-of-type(8),
.searchResult[drag="1"] td:nth-of-type(1),
.searchResult[drag="2"] td:nth-of-type(2),
.searchResult[drag="3"] td:nth-of-type(3),
.searchResult[drag="4"] td:nth-of-type(4),
.searchResult[drag="5"] td:nth-of-type(5),
.searchResult[drag="6"] td:nth-of-type(6),
.searchResult[drag="7"] td:nth-of-type(7),
.searchResult[drag="8"] td:nth-of-type(8)
{
	filter: saturate(0);
	position: relative;
	opacity: 0.5;
}

.searchResult[drag="1"] th:nth-of-type(1) *,
.searchResult[drag="2"] th:nth-of-type(2) *,
.searchResult[drag="3"] th:nth-of-type(3) *,
.searchResult[drag="4"] th:nth-of-type(4) *,
.searchResult[drag="5"] th:nth-of-type(5) *,
.searchResult[drag="6"] th:nth-of-type(6) *,
.searchResult[drag="7"] th:nth-of-type(7) *,
.searchResult[drag="8"] th:nth-of-type(8) *,
.searchResult[drag="1"] td:nth-of-type(1) *,
.searchResult[drag="2"] td:nth-of-type(2) *,
.searchResult[drag="3"] td:nth-of-type(3) *,
.searchResult[drag="4"] td:nth-of-type(4) *,
.searchResult[drag="5"] td:nth-of-type(5) *,
.searchResult[drag="6"] td:nth-of-type(6) *,
.searchResult[drag="7"] td:nth-of-type(7) *,
.searchResult[drag="8"] td:nth-of-type(8) *
{
	opacity: 0.5;
}

body.l337x .searchResult th:not(:last-child)
{
  border-right: 1px solid #c0c0c0;
}
body.l337x .searchResult th:not(:first-child)
{
  border-left: 1px solid #f6f6f6;
}
a.magnet[href="magnet:"]
{
	cursor: not-allowed;
	filter: saturate(0.1);
}
*/};
	style.innerHTML = css.toString().slice(14,-3).split("*//*").join("*/");
	document.body.classList.toggle("tpb", isTPB);
	document.body.classList.toggle("l337x", isl337x);
	document.getElementsByTagName("head")[0].appendChild(style);

}//func();
