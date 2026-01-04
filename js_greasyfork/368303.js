// ==UserScript==
// @name        CORS Enable
// @namespace   https://greasyfork.org/users/174399
// @description This script enables cross origin ajax requests for XMLHttpRequest (for Tampermonkey only)
// @version     0.4.13
// @include     *://*
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @run-at      document-start;
// @downloadURL https://update.greasyfork.org/scripts/368303/CORS%20Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/368303/CORS%20Enable.meta.js
// ==/UserScript==

window.safeWindow = window;
var clog = console.log;
var RANDOM = Math.floor(Math.random() * 1.0e10 + 1.0e10);
clog("safeWindow: ", safeWindow);
clog("RANDOM: ", RANDOM);
(function(window){
	if( GM_info.scriptHandler !== "Tampermonkey" )
	{
		clog("It needs Tampermonkey scriptHandler, but you have " + GM_info.scriptHandler);
		return;
	}
	start();
})(safeWindow);
function start()
{
	getWindow(safeWindow).then(function(window){
		var ajax = safeWindow.GM_xmlhttpRequest || GM_xmlhttpRequest;
		Object.defineProperty( window, "get_ajax", {
			get(){return ajax;}
		});
		clog("ajax: ", window.get_ajax);
		DOMReady(function(){
			var d = document;
			var script = d.createElement("script");
			script.innerHTML = "(" + advancedAJAX.toString() + ")();";
			d.body.appendChild(script);
		});
	});
}
function advancedAJAX()
{
	var clog = console.log;
	var x = window.XMLHttpRequest,
		xp = x.prototype,
		xlist = [],
		link = null;
	clog("XMLHttpRequest: ", x);
	clog("XMLHttpRequest.prototype: ", xp);
	var glob = {};
	window.XMLHttpRequest = function()
	{
		var t = {};
		t.xhr = new x();
		xlist.push(t);
		return t.xhr;
	};
	XMLHttpRequest.prototype = xp;
	Object.defineProperties(window.XMLHttpRequest, {
		"DONE": {
			value: 4,
			enumerable: true,
		}, "LOADING": {
			value: 3,
			enumerable: true,
		}, "HEADERS_RECEIVED": {
			value: 2,
			enumerable: true,
		}, "OPENED": {
			value: 1,
			enumerable: true,
		}, "UNSENT": {
			value: 0,
			enumerable: true,
		},
	});
	var getEvP = function(obj)
	{
		if( !obj ) return null;
		var cnt = 0;
		while( !obj.hasOwnProperty("addEventListener") && cnt++ < 10 )
			obj = obj.__proto__;
		return cnt < 10 ? obj : null;
	};
	var evp = getEvP(xp);
	clog("EventTargetPrototype: ", evp);
	var addEvent = evp.addEventListener;
	evp.addEventListener = function(type, callback)
	{
		var t = getX(this);
		if( !t )
			return addEvent.apply(this, arguments);
		var e = t.event = t.event || {},
			et = e[type] = e[type] || {},
			el = et.list = et.list || [];
		el.push({fn: callback});
	};
	var xopen = xp.open;
	xp.open = function(method, url, async)
	{
		var x = getX(this);
		x.cross = location.origin !== getLink(url, "origin");
		if( !x.cross )
			return xopen.apply(this, arguments);
		var d = x.details = x.details || {};
		d.method = method;
		d.url = getLink(url);
		d.synchronous = !async;
		Object.defineProperties(this, {
			"readyState": {
				value: XMLHttpRequest.OPENED,
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"status": {
				value: 0,
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"statusText": {
				value: "",
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"timeout": {
				value: this.timeout,
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"responseURL": {
				value: "",
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"responseType": {
				value: this.responseType,
				enumerable: true,
				writable: true,
				configurable: true,
			},
			"response": {
				value: "",
				enumerable: true,
				writable: true,
				configurable: true,
			},
		});
	};
	var xhead = xp.setRequestHeader;
	xp.setRequestHeader = function(name, val)
	{
		var x = getX(this);
		if( !x.cross )
			return xhead.apply(this, arguments);
		var d = x.details,
			h = d.headers = d.headers || {};
		h[name] = val;
	};
	var xsend = xp.send;
	xp.send = function(data)
	{
		var x = getX(this);
		if( !x.cross )
			return xsend.apply(this, arguments);
		var d = x.details,
			t = x.xhr,
			pseudoEvent = {target: t};
		d.data = data || null;
		d.timeout = t.timeout;
		d.responseType = t.responseType;
		d.onreadystatechange = function(r)
		{
			t.status = r.status;
			t.readyState = r.readyState;
			t.responseURL = r.finalUrl;
			t.response = r.response || "";
			t.responseText = t.response;
			if( t.onreadystatechange )
				t.onreadystatechange.call(t, pseudoEvent);
			var e = x.event ? x.event["readystatechange"] : null;
			if( !e )
				return;
			for( var i = 0, len = e.list.length; i < len; ++i )
				e.list[i].fn.call(t, pseudoEvent);
		};
		d.onload = function(r)
		{
			if( t.onload )
				t.onload.call(t, pseudoEvent);
			var e = x.event ? x.event["load"] : null;
			if( !e )
				return;
			for( var i = 0, len = e.list.length; i < len; ++i )
				e.list[i].fn.call(t, pseudoEvent);
		};
		clog("x: ", x);
		window.get_ajax(d);
	};
	/* TEST */
	var t = new XMLHttpRequest();
	t.addEventListener("readystatechange", function foo(e){
		console.log("Ho-ho-ho!", t.readyState);
	});
	clog("xlist: ", xlist);
	t.open("GET", "https://github.com", true);
	clog("t: ", t);
	t.onload = function()
	{
		clog("----->response-length: ", t.response.length);
	};
	t.onreadystatechange = function()
	{
		if( t.status == 200 && t.readyState == 4 )
			clog("He-he", t.readyState, t.status, t.statusText);
	};
	clog("t.onload: ", t.onload);
	t.send();
	/*
	clog("----get_ajax----");
	window.get_ajax({
		url: "https://github.com",
		method: "GET",
		onload: function(r){
			console.log("resp-len: ", r.response.length);
		},
		responseType: "",
		timeout: 0,
		synchronous: false,
	});
	*/
	/* END TEST */
	function __get__(t, attr)
	{
		if( !t ) return null;
		attr = attr || "xhr";
		for(var i = 0, len = xlist.length; i < len; ++i)
		{
			if( xlist[i][attr] === t )
				return xlist[i];
		}
		return null;
	}
	function getX(t){return __get__(t, "xhr");}
	function getLink(url, attr)
	{
		if( !url ) return null;
		link = link || document.createElement("a");
		link.href = url;
		return link[attr || "href"];
	}
}
function getWindow(wnd)
{
	wnd = wnd || window;
	return new Promise(function(resolve, reject){
		var handler = function(event)
		{
			wnd.removeEventListener("message", handler);
			if( event.source )
				resolve(event.source);
			else
				reject({error: "source not found"});
		};
		wnd.addEventListener("message", handler);
		wnd.postMessage("message-content", "*");
	}).catch(function(err){
		console.error(err);
	});
}
function DOMReady(callback)
{
	var d = document;
	switch(d.readyState)
	{
		case "loading":
		d.addEventListener("DOMContentLoaded", function(e){callback();}, false);
		break;
		case "interactive":
		case "complete":
		callback();
		break;
	}
}
function getLink(url, prop)
{
	if( !url )
		return null;
	var link = safeWindow.link = safeWindow.link || document.createElement("a");
	link.href = url;
	return link[prop || "href"];
}
function extend(t, o)
{
	t = t || {};
	if( !o )
		return t;
	for( var k in o )
	{
		if( o.hasOwnProperty(k) )
			t[k] = o[k];
	}
	return t;
}