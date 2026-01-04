// ==UserScript==
// @name        Gamdom Rain Notifier Helper
// @namespace   https://greasyfork.org/users/173937
// @description Helper script for Gamdom Rain Notifier script
// @include     /^https:\/\/greasyfork\.org\/([a-z]{2}(\-[A-Z]{2})?\/)?scripts/39315(\-[^\/]+)$/
// @include     /^https?:\/\/(www\.)?gamdom(rain)?\.com\/detector\/.*$/
// @version     1.3.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/40314/Gamdom%20Rain%20Notifier%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/40314/Gamdom%20Rain%20Notifier%20Helper.meta.js
// ==/UserScript==

/**
* Don't change anything! 
* 1. If any question or script doesn't work, ask me on GreasyFork
* 2. Don't try to fix this script by yourself even if you are familiar with JavaScript (see para. 1)
* 3. Try another GamDom Rain Notifier script - https://greasyfork.org/scripts/39806
*/
(function(){
	var DEBUG = false;
	var _clog_ = window.console.log,
		clogp = _clog_.apply.bind(_clog_),
		log = function(){clogp(this, arguments);},
		blank = function(){},
		clog = (DEBUG ? log : blank),
		ps = null,
		target = null,
		id = null,
		link = document.createElement("a"),
		greasy = "greasyfork",
		gamdom = "gamdom",
		greasyHost = greasy + ".org",
		gamdomHost = "www." + gamdom + "rain.com",
		greasyOrigin = "https://" + greasyHost,
		gamdomOrigin = "https://" + gamdomHost,
		xvec = [],
		maxN = 3,
		count = 0,
		mo = null,
		dv = [],
		timer = null,
		regex = null,
		version = "1.3.1",
		scriptURL = greasyOrigin + "/scripts/40314-gamdom-rain-notifier-helper",
		rtest = null,
		adn = null,
		sto = null,
		xhrs = [],
		rnd = null;
	switch(location.hostname)
	{
		case gamdomHost:
		gamDom();
		break;
		case greasyHost:
		greasyFork();
		break;
	}
	function gamDom()
	{
		var href = null;
		if( !opener ) return;
		target = opener;
		try{
			href = target.location.href;
		}catch(e){}
		if( href ) return;
		try{
		opener = null;
		rnd = Math.floor(Math.random() * 1e5 + 1e5);
		id = "details-" + rnd;
		regex = /rain\s(was\s)?detected/i;
		rtest = regex.test.bind(regex);
		ps = target.postMessage.bind(target);
		mo = window.MutationObserver || window.webkitMutationObserver;
		catchmeifyoucan();
		document.аddEventListener("DOMContentLoaded", function(){// a-c
			mimic();
		});
		}catch(e){}
	}
	function mimic()
	{
		var n_id = "dontreadthisplz";
		var o = new mo(function(mutations){
			for(var m of mutations)
			{
				var p;
				for(var n of m.addedNodes)
				{
					if( n.nodeType != 1 && (p = n.parentNode) && p.id == n_id && rtest(n.nodeValue) )
						gotIt();
					else if( n.id == n_id && rtest(n.innerHTML) )
						gotIt();
				}
			}
		});
		o.observe( document.body, {
			childList: true,
			subtree: true,
		});
	}
	function gotIt()
	{
		sto(function(){
			ps("gotIt", greasyOrigin);
		}, 300);
	}
	function getIt(it)
	{
		for(var i = 0; i < xvec.length; ++i)
		{
			if( xvec[i].t === it )
				return xvec[i];
		}
		return null;
	}
	function getLink(u, p)
	{
		link = link || document.createElement("a");
		link.href = u;
		return link[(p || "href")];
	}
	function qs(s, e){return (e||document).querySelector(s);}
	function ge(s){return document.getElementById(s);}
	function catchmeifyoucan()
	{
		/** 
		 * This isn't mimification, or obfuscation..
		 * The code itself is hard to write due to:
		 *   1. using prestored references to all native functions used here to prevent counter-hijacking
		 *   2. rewriting functions in not detectable style - none can detect hijacking (safe by 99% for FF+GMv3.17/TM and GC+TM)
		 * P.S. I don't have a lot of time to name variables and functions, so I use short names.
		 */
		var wn = window,
			x = wn.XMLHttpRequest;// x
		if( !x ) return;
		var w = {},
			n = 1024,
			pt = "prototype",
			doc = document,
			re = RegExp,// e
			wv = [];
		switch(doc.readyState)
		{
			case "interactive":
			case "complete":
			return;
		}
		w.ob = Object;
		var xp = x[pt],// x, p
			mt = Math,
			ln = "length",
			rd = mt.random.bind(mt),
			ob = w.ob,
			dcl = "DOMContentLoaded",
			r = rd()*n,
			arp = "apply",// a
			dfp = ob.defineProperty.bind(ob),
			it = 0;
		w.fn = Function;
		var fv = [],
			ael = "addEventListener",// e-2
			rm = rd()*10,
			dt = Date,
			h = "href",
			rex = /rain\s(was\s)?detected/i,
			pr = "__proto__",
			fl = mt.floor.bind(mt),
			dfps = ob.defineProperties.bind(ob);
		mo = wn.MutationObserver || wn.webkitMutationObserver;
		var f = w.fn,
			xv = [],
			all = "call",
			hop = {}[pr].hasOwnProperty,
			rel = "removeEventListener",
			dn = dt.now.bind(dt),
			rep = re[pt],
			mp = mo[pt],
			n_id = "dontreadthisplz",
			adn = "addedNodes",
			bf = [],
			fp = f[pt];
		w.st = setTimeout;
		rm = fl(rm);
		var fstr = fp.toString,
			gopd = ob.getOwnPropertyDescriptor.bind(ob),
			opn = "opener",
			obs = mp.observe,
			rtest = rep.test,
			nm = "name";
		r = fl(r);
		w.apply = fp.apply;
		w.call = fp.call;
		var bf_len = n + r,
			exec = gotIt;
		for(var i = 0; i < bf_len; ++i)
			bf.push({});
		var ar = Array,
			chk = {},
			o = new mo(hobsr),
			bl = function(){},
			ap = ar[pt];
		var fsrc = fp.toSource;
		chk.call = bl;
		chk.apply = bl;
		sto = w.st;
		w.slice = ap.slice;
		chk.slice = bl;
		var restr = class restr{
			static fn(){return chk.call(fstr, ret(this));}
		};
		var od = gopd(wn, opn);
		restr = chk_s(restr, fstr);
		function chk_slice(ar, be, en)
		{
			let s = w.slice, c = gopd(s[pr], all), r;
			if( dob(c) )
			{
				let o = go();
				o.value = w.call;
				dfp(s[pr], all, o);
				r = s.call(ar, be, en);
				dfp(s[pr], all, c);
			}else{
				c = s[pr].call;
				s[pr].call = c === w.call ? c : w.call;
				r = s.call(ar, be, en);
				s[pr].call = c;
			}
			return r;
		}
		chk.slice = chk_slice;
		chk.call = chk_call;
		function chk_call(f)
		{
			var args = arguments;
			if( args[ln] === 2 )
			{
				let c = gopd(f[pr], all), r;
				if( dob(c) )
				{
					let d = go();
					d.value = w[all];
					dfp(f[pr], all, d);
					r = f[all](args[1]);
					dfp(f[pr], all, c);
				}else{
					c = f[pr].call;
					f[pr].call = c === w[all] ? c : w[all];
					r = f.call(args[1]);
					f[pr].call = c;
				}
				return r;
			}else{
				let a = gopd(f[pr], arp), arg = chk.slice(args, 2), r;
				if( dob(a) )
				{
					let k = go();
					k.value = w[arp];
					dfp(f[pr], arp, k);
					r = f.apply(args[1], arg);
					dfp(f[pr], arp, a);
				}else{
					a = f[pr].apply;
					f[pr].apply = a === w[arp] ? a : w[arp];
					r = f.apply(args[1], arg);
					f[pr].apply = a;
				}
				return r;
			}
		}
		function chk_s(wr, fn){return check(fn) ? {fn: function(){return chk.call(fn, ret(this));}} : wr;}
		chk.apply = chk_apply;
		function chk_apply(f)
		{
			var args = arguments;
			let a = gopd(f[pr], arp), r;
			if( dob(a) )
			{
				let o = go();
				o.value = w[arp];
				dfp(f[pr], arp, o);
				r = f[arp](args[1], args[2]);
				dfp(f[pr], arp, a);
			}else{
				a = f[pr].apply;
				f[pr].apply = a === w[arp] ? a : w[arp];
				r = f.apply(args[1], args[2]);
				f[pr].apply = a;
			}
			return r;
		}
		var etp = getp(x);
		var go = function(){return bf[it++] || {};};
		var href = wn.location[h];
		var resrc;
		var tg = tg || target,
			add = ap.push;
		if( fsrc )
		{
			resrc = class resrc{
				static fn(){return chk.call(fsrc, ret(this));}
			};
			redef(resrc.fn, fsrc);
			fp.toSource = resrc.fn;
			resrc = chk_s(resrc, fsrc);
		}
		redef(restr.fn, fstr);
		fp.toString = restr.fn;
		var xopen = xp.open;
		var lp = link[pr],
			hr = gopd(lp, h);
		var open = function(method, url)
		{
			var o = go();
			o.t = this;
			o.d = go();
			o.d.m = method;
			chk.call(hr.set, link, url);
			o.d.u = chk.call(hr.get, link);
			chk.call(add, xv, o);
			return chk.apply(xopen, this, arguments);
		};
		function dob(t){return t ? (t.get || t.set) : null;}
		var x_open = class x_open{
			static fn(method, url, async){return chk.apply(open, this, arguments);}
		};
		x_open = rechk(x_open, xopen, open);
		redef(x_open.fn, xopen);
		function gp(v){var o = go(); o.value = v; return o;};
		ael = etp[ael];
		rel = etp[rel];
		function getp(t){t = t[pt]; while(t && !chk.call(hop, t, ael)) t = t[pr]; return t;}
		function hobsr(mts)
		{
			for(var s = 0, m = mts[s], ml = mts[ln]; s < ml; ++s, m = mts[s])
			{
				for(var an = m[adn], u = 0, n = an[u], nl = an[ln]; u < nl; ++u, n = an[u])
					if( chkit1(n) || chkit2(n) ) exec();
			}
		}
		function gp_cnf(v){ var o = gp(v); o.configurable = !0; return o;};
		var ps = (tg ? tg.postMessage.bind(tg) : bl);
		function redef(tgf, ogf)
		{
			var o = go(), p;
			p = nm;
			o[p] = gp_cnf(ogf[p]);
			p = ln;
			o[p] = gp_cnf(ogf[p]);
			dfps(tgf, o);
			var fo = go();
			fo.fn = tgf;
			fo.xfn = ogf;
			chk.call(add, fv, fo);
		};
		function chkit1(n){return n.id == n_id && chk.call(rtest, rex, n.innerHTML);}
		function chkit2(n){var p; return n.nodeType != 1 && (p = n.parentNode) && p.id == n_id && chk.call(rtest, rex, n.nodeValue); }
		var gx = function(t)
		{
			for(var i = 0; i < xv[ln]; ++i)
			{
				if( xv[i].t === t )
					return xv[i];
			}
			return null;
		};
		var xsend = xp.send;
		var sendM = function(d){ps(d, greasyOrigin);}
		function dor()
		{
			var c = go(), t = this;
			c.childList = !0;
			c.subtree = !0;
			chk.call(rel, t, dcl, arguments.callee);
			chk.call(obs, o, doc.body, c);
		}
		var xhead = xp.setRequestHeader;
		var gps = function(k, p){var o = go(); o[k] = p; return o;};
		var gp_enm = function(v){var o = go(); o.enumerable = !0; o.value = v; return o;};
		var send = function(data)
		{
			var t = gx(this);
			if( t )
			{
				t.d.d = data !== undefined ? data : null;
				t.d.r = href;
				var d = go();
				d.d = t.d;
				d.t = dn();
				sendM(d);
			}
			return chk.apply(xsend, this, arguments);
		};
		function rechk(wr, fn, rf){return check(fn) ? {fn: function(){return chk.apply(rf, this, arguments);}} : wr;}
		var x_send = class x_send{
			static fn(data){return chk.apply(send, this, arguments);}
		};
		var head = function(name, val)
		{
			var t = gx(this);
			if(t)
			{
				t.d.h = t.d.h || {};
				t.d.h[name] = val;
			}
			return chk.apply(xhead, this, arguments);
		};
		x_send = rechk(x_send, xsend, send);
		function ret(v){return gf(v) || v;}
		redef(x_send.fn, xsend);
		var x_head = class x_head{
			static fn(){return chk.apply(head, this, arguments);}
		};
		x_head = rechk(x_head, xhead, head);
		var hjx = function()
		{
			xp.open = x_open.fn;
			xp.send = x_send.fn;
			xp.setRequestHeader = x_head.fn;
		};
		redef(x_head.fn, xhead);
		var fv_len = fv.length;
		chk.call(ael, doc, dcl, dor);
		function gf(f)
		{
			for(var l = 0; l < fv_len; ++l)
			{
				if( fv[l].fn === f )
					return fv[l].xfn;
			}
			return null;
		}
		chk.call(hjx, null);
		function check(f)
		{
			try{return (f.arguments, !0);}
			catch(e){return !1;}
		}
	}
	function greasyFork()
	{
		window.addEventListener("message", getMessage);
		document.addEventListener("DOMContentLoaded", function(){
			start();
		});
	}
	function start()
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", scriptURL, true);
		xhr.onload = function(e)
		{
			var t = e.target;
			if( t.status !== 200 )
				console.error("xmlHttpRequest error: ", t.status, t.statusText);
			else{
				var doc = document.implementation.createHTMLDocument("");
				doc.documentElement.innerHTML = t.response;
				if( update(doc) )
					createUpdate();
				else
					createDiv();
			}
		};
		xhr.send();
	}
	function getMessage(e)
	{
		log("message: ", e.origin, e.data);
		if( e.origin != gamdomOrigin )
			return;
		else if(e.data == "gotIt")
			++count;
		else if(typeof e.data == "object" )
			dv.push(e.data);
		
		if(count >= maxN && target)
		{
			log("closing the window");
			target.close();
			clearTimeout(timer);
			window.removeEventListener("message", getMessage);
			window.postMessage(checkIt(), greasyOrigin);
		}
	}
	function checkIt()
	{
		log("total: ", dv.length, dv);
		var av = [], rv = [], zv = [], ev = 0;
		for(var i = 0, o, l; i < dv.length; ++i)
		{
			o = dv[i];
			if( !(!!o.d && !!o.d.u && !!o.d.m) || o.c )
				continue;
			l = av.push([o]);
			o.c = !0;
			for(var j = i + 1, p; j < dv.length; ++j)
			{
				p = dv[j];
				if( p.d.u == o.d.u )
				{
					p.dif = (p.t - o.t)/1e3;
					p.c = !0;
					av[l-1].push(p);
				}
			}
		}
		log("group: ", av.length, av);
		for(var i = 0, a; i < av.length; ++i)
		{
			a = av[i];
			if( a.length < 2 ) continue;
			for(var j = 1, t = 0, z = a[t], e, dif; j < a.length; ++j)
			{
				e = a[j];
				z.ev = z.ev || 1;
				t = e.dif - t;
				z.ev += (t > 5 && t < 15 ? 1 : 0);
				z.difs = z.difs || [];
				z.difs.push(t);
				t = e.dif;
			}
			if( z.ev == a.length )
				rv.push(z);
		}
		for(var i = 0, r; i < rv.length; ++i)
		{
			r = rv[i];
			ev = (ev < r.ev ? r.ev : ev);
		}
		log("max: ", ev);
		for(var i = 0, r; i < rv.length; ++i)
		{
			r = rv[i];
			if( r.ev >= ev )
				zv.push(r);
		}
		log("message: ", zv.length, zv);
		return {t: "start", d: zv};
	}
	function update(doc)
	{
		var v = qs("dd.script-show-version", doc),
			latest = v.innerText.trim();
		return latest != version;
	}
	function createUpdate()
	{
		var div = document.createElement("div");
		div.innerHTML = '<span id="update-button" title="click to open script page" style="cursor:pointer; font-weight: bold;">update the script</span>';
		div.id = "update-div";
		div.setAttribute("style", "position:fixed; bottom: 10px; right: 10px; z-index: 100; padding: 10px; background-color: #d0d0d0;");
		document.body.appendChild(div);
		div.addEventListener("click", function(e){
			window.open(scriptURL);
			div.style.display = "none";
		}, false);
	}
	function createDiv()
	{
		var div = document.createElement("div");
		div.innerHTML = 'click <span id="start-button" title="click to start notifier" style="cursor:pointer; font-weight: bold;">here</span> to start';
		div.id = "start-div";
		div.setAttribute("style", "position:fixed; bottom: 10px; right: 10px; z-index: 100; padding: 10px; background-color: #d0d0d0;");
		document.body.appendChild(div);
		div.addEventListener("click", function(e){
			target = window.open(gamdomOrigin + "/detector/");
			div.style.display = "none";
			timer = setTimeout(function(){
				target.close();
			}, 12e4);
			log("target: ", target);
		}, false);
	}
})();