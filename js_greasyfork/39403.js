// ==UserScript==
// @name        ajax log
// @namespace   https://greasyfork.org/users/174399
// @description library for log ajax requests and save logs as a file
// @version     0.5.1
// ==/UserScript==

(function(window){
	var DEBUG = false;
	var tracker = {},
		proto = window.XMLHttpRequest.prototype,
		eventList = ['readystatechande', 'load'],
		methodList = ['open', 'send', 'setRequestHeader', 'abort'],
		attrList = ['readyState', 'status', 'statusText', 'response'],
		totalResponse = [],
		flushAndSave = null,
		blank = function(){},
		log = function(){window.console.log.apply(this, arguments);},
		clog = blank,
		link;
	if( DEBUG )
		clog = log;
	methodList.forEach(function(m){
		tracker[m] = {
			'original': null,
			'ready': null,
		};
	});
	function setTracker(type, fun)
	{
		var t = tracker[type];
		if(!t || t.ready)
			return;
		t.original = proto[type];
		proto[type] = function()
		{
			fun.apply(this, arguments);
			t.original.apply(this, arguments);
		};
		t.ready = true;
	}
	setTracker('open', function(method, url, async){
		var req = this,
			cntx = getVal(req, 'context'),
			time = getVal(cntx, 'time');
		clog("[open] req: ", req);
		cntx.method = method.toUpperCase();
		cntx.url = getLocation(url, 'href');
		cntx.async = (async === undefined ? null: async);
		time.msec = Date.now();
		time.date = getDate();
		var aEL = req.addEventListener;
		req.addEventListener = function(ev, cb)
		{
			clog("[addEventListener] ", aEL, [].slice(arguments));
			if(eventList.indexOf(ev) == -1)
				aEL.apply(req, arguments);
		};
	});
	setTracker('setRequestHeader', function(name, val){
		var cntx = getVal(this, 'context'),
			headers = getVal(cntx, 'headers');
		clog("[header] " + name + ": " + val);
		headers[name] = val;
	});
	setTracker('abort', function(){
		var cntx = getVal(this, 'context');
		cntx.onabort = true;
	});
	setTracker('send', function(data){
		var req = this,
			cntx = getVal(req, 'context');
		cntx.data = toObj(data);
		clog("[send] context: ", JSON.stringify(cntx, null, 2));
		clog("[send] req: ", req);
		var rsc = req.onreadystatechange;
		var ld = req.onload || blank;
		clog("[onreadystatechange] ", rsc);
		req.onreadystatechange = function(e)
		{
			var t = e.target;
			if(t.readyState == 4 )
			{
				clog("[onreadystatechange] response: ", t.response);
				var cntx = getVal(t, 'context'),
					o = getVal(cntx, 'onreadystatechange'),
					time = getVal(o, 'time');
				setResponse(o, t);
				time.msec = Date.now();
				time.date = getDate();
				o.responseHeaders = getHeaders(t);
				totalResponse.push(extend({}, cntx) );
				saveLog();
			}
			rsc.apply(req, arguments);
		};
		clog("[onload] ", ld);
		req.onload = function(e)
		{
			var t = e.target,
				cntx = getVal(t, 'context'),
				o = getVal(cntx, 'onload'),
				time = getVal(o, 'time');
			clog("[onload] response: ", t.response);
			setResponse(o, t);
			o.responseHeaders = getHeaders(t);
			time.msec = Date.now();
			time.date = getDate();
			totalResponse.push(extend({}, cntx) );
			saveLog();
			ld.apply(req, arguments);
		};
	});
	function extend(t, o)
	{
		t = t || {};
		var k, v;
		for(k in o)
		{
			v = o[k];
			if( v !== undefined && o.hasOwnProperty(k) )
				t[k] = v;
		}
		return t;
	}
	function setResponse(o, t)
	{
		for(var k of attrList)
			o[k] = t[k];
		return o;
	}
	function getHeaders(t)
	{
		var headers = t.getAllResponseHeaders(), o = {}, s, h, p;
		s = headers.split(/[\r\n]+/g);
		for(h of s)
		{
			h = h.split(': ');
			p = h[0] || '';
			if( !(p = p.trim()) )
				continue;
			o[p] = h.slice(1).join(': ');
		}
		return o;
	}
	function keyboard(e)
	{
		if(!e.shiftKey)
			return;
		var code = e.keyCode || e.which,
			ch = String.fromCharCode(code).toUpperCase();
		switch(ch)
		{
			case 'S':
			flushAndSave = true;
			saveLog();
			break;
			case 'D':
			clog = (DEBUG = !DEBUG) ? log : blank;
			break;
		}
	}
	window.addEventListener('keydown', function(e){keyboard(e);});
	function saveLog()
	{
		if( totalResponse.length && flushAndSave )
		{
			saveFile('xmlHttpRequest-' + getDate() + '.txt',
				createFile(JSON.stringify(totalResponse, null, 2), 'text/plain; charset=UTF-8'));
			totalResponse.length = 0;
			flushAndSave = false;
		}
	}
	function pad(num, len){return ('000000000000' + num).slice(-len);}
	function getDate(date)
	{
		date = date || new Date();
		return '' +
		date.getFullYear() + '-' +
		pad(date.getMonth() + 1, 2) + '-' +
		pad(date.getDate(), 2) + '@' +
		pad(date.getHours(), 2) + '-' +
		pad(date.getMinutes(), 2) + '-' +
		pad(date.getSeconds(), 2) + '.' +
		pad(date.getMilliseconds(), 3);
	}
	function saveFile(name, resource)
	{
		var a = document.createElement('a');
		a.href = resource;
		a.download = name;
		document.querySelector('body').appendChild(a);
		a.click();
		a.parentNode.removeChild(a);
	}
	function createFile(data, type)
	{
		var wu = window.URL || window.webkitURL,
			b = new Blob([data], {type: type}),
			u = wu.createObjectURL(b);
		setTimeout(function(){wu.revokeObjectURL(b);}, 1e4);
		return u;
	}
	function toObj(str)
	{
		if( !str )
			return null;
		switch(typeof str)
		{
			case 'object': return str;
			case 'string':
			var o = {}, s = str.split('&'), v, p;
			for(p of s)
			{
				v = p.split('=');
				o[v[0]] = v[1] || '';
			}
			return o;
			default: return null;
		}
	}
	function getLocation(url, p)
	{
		link = link || document.createElement('a');
		link.href = url;
		return link[p||'href'];
	}
	function getVal(obj, name)
	{
		var c = obj[name] = obj[name] || {};
		return c;
	}
})(window);