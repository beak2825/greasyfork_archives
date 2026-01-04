// ==UserScript==
// @name           YouTube Link Title
// @description    Adds video titles, shows previews and embeds on click. Also supported: Vimeo, LiveLeak, Dailymotion, vidme, WorldStarHipHop, Vine, Coub, Streamable
// @namespace      http://w9p.co/userscripts/
// @version        2017.2.28
// @author         kuehlschrank
// @homepage       http://w9p.co/userscripts/ytlt
// @icon           https://w9p.co/userscripts/ytlt/icon.png
// @include        http*
// @exclude        http*//*.google.*/*
// @exclude        *//*.googleapis.com/*
// @exclude        *//vimeo.com/*
// @exclude        *//*.vimeo.com/*
// @exclude        *//*.worldstarhiphop.com/*
// @exclude        *//vine.co/*
// @exclude        *//*.dailymotion.com/*
// @exclude        *//coub.com/*
// @exclude        *//vid.me/*
// @exclude        *//*.vid.me/*
// @exclude        *://disqus.com/embed/*worldstarhiphop*
// @exclude        *//streamable.com/*
// @exclude        *//*.streamable.com/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @connect-src    googleapis.com
// @connect-src    vimeo.com
// @connect-src    vine.co
// @connect-src    liveleak.com
// @connect-src    worldstarhiphop.com
// @connect-src    dailymotion.com
// @connect-src    coub.com
// @connect-src    vid.me
// @connect-src    streamable.com
// @downloadURL https://update.greasyfork.org/scripts/390656/YouTube%20Link%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/390656/YouTube%20Link%20Title.meta.js
// ==/UserScript==

'use strict';

function onLoad() {
	if(location.hostname.indexOf('liveleak.com') > -1) {
		if(location.pathname == '/ll_embed' && location.hash == '#play') document.body.querySelector('video').play();
		return;
	} else if(location.hostname.indexOf('youtube.com') > -1 || location.hostname.indexOf('youtube-nocookie.com') > -1) {
		if(location.pathname.indexOf('/embed/') == 0 && window.top != window.self) {
			document.body.querySelector('.ytp-chrome-controls a[href*="www.youtube.com"]').addEventListener('click', function(e) {
				window.parent.postMessage({YTLT:'close'}, '*');
			});
		}
		return;
	}
	cfg.load();
	var q = 'a[href*="//t.co/"]';
	for(var sid in sites) {
		q += sites[sid].patterns.reduce(function(prev, cur) { return  prev + ',a[href*="' + cur +'"]'; }, '');
	}
	links.query = q;
	links.process(d.body);
	var M = window.MutationObserver;
	if(M) {
		var opts = location.hostname == 'www.facebook.com' ? {childList:true, subtree:true, attributes:true, attributeFilter:['href']} : {childList:true, subtree:true};
		new M(onMutations).observe(d.body, opts);
	} else {
		d.body.addEventListener('DOMNodeInserted', onNodeInserted);
	}
	window.addEventListener('message', onMessage);
	GM_registerMenuCommand('Set up YouTube Link Title', setup.show);
}

function onNodeInserted(e) {
	var t = e.target;
	if(t.nodeType == 1) window.setTimeout(links.process, 100, t);
}

function onMutations(muts) {
	for(var i = muts.length, m; i-- && (m = muts[i]);) {
		if(m.type == 'attributes') {
			window.setTimeout(links.process, 100, m.target);
		} else {
			for(var j = m.addedNodes.length, node; j-- && (node = m.addedNodes[j]);) {
				if(node.nodeType == 1) window.setTimeout(links.process, 100, node);
			}
		}
	}
}

function onMessage(e) {
	if(typeof e.data != 'object' || !e.data.YTLT) return;
	var li = e.data.YTLT;
	if(li == 'close') return popup.close();
	if(window.frames.length > 1) {
		li.self = true;
		e.source.postMessage({YTLT:li}, '*');
	} else {
		popup.show(li);
	}
}

function ce(n, props) {
	var n = d.createElement(n);
	if(props) {
		forEach(props, function(p) {
			if(p == 'click' || p == 'mousedown' || p == 'mousedown') {
				n.addEventListener(p, props[p]);
			} else {
				n[p] = props[p];
			}
		});
	}
	return n;
}

function forEach(o, f) {
	var props = Object.keys(o);
	for(var i = props.length, p; i-- && (p = props[i]);) {
		if(o.hasOwnProperty(p)) f(p);
	}
}

function rm(id) {
	var node = $(id);
	if(node) node.parentNode.removeChild(node);
}

var d = document, $ = function(id) { return d.getElementById(id); }, log = function(s) { console.log(s); };

var setup = {
	id: 'YTLT-setup',
	html: function() {
		var h = '<div>YouTube Link Title</div><ul>';
		this.forEach(function(n) {
			var s = cfg.settings[n];
			if(typeof s.default == 'boolean') {
				h += '<li><input type="checkbox" name="'+ n +'"> ' + s.title + '</li>'
			} else if(s.options) {
				h += '<li>' + s.title + ': <select name="' + n + '">';
				forEach(s.options, function(on) {
					h += '<option value="' + on + '">' + s.options[on] +'</option>';
				});
				h += '</select></li>';
			} else if(typeof s.default == 'string') {
				h += '<li>' + s.title + ': <input type="text" name="'+ n +'" maxlength="' + s.maxlength + '" style="width:' + s.maxlength*12 +'px"></li>';
			}
		});
		return h += '</ul><div><button name="save">Save settings</button></div></div>';
	},
	q: function(n) {
		return d.querySelector('#' + this.id + ' *[name="' + n + '"]');
	},
	get: function(n) {
		var s = cfg.settings[n];
		if(typeof s.default == 'boolean') return this.q(n).checked;
		if(s.options) {	var sel = this.q(n); return sel.options[sel.selectedIndex].value; }
		if(typeof s.default == 'string') return this.q(n).value;
	},
	set: function(n, val) {
		var s = cfg.settings[n];
		if(typeof s.default == 'boolean') {
			this.q(n).checked = val;
		} else if(s.options) {
			var sel = this.q(n);
			for(var i = sel.options.length; i--;) {	if(sel.options[i].value == val) sel.selectedIndex = i; }
		} else if(typeof s.default == 'string') {
			this.q(n).value = val.trim();
		}
	},
	forEach: function(f) {
		forEach(cfg.settings, function(n) { if(cfg.settings[n].title) f(n); });
	},
	show: function() {
	    rm(setup.id);
	    GM_addStyle('\
	        #'+setup.id+' { position:fixed;z-index:2147483647;top:40px;right:40px;padding:20px 30px;background-color:white;width:auto;border:1px solid black }\
	        #'+setup.id+' * { color:black;text-align:left;line-height:normal;font-size:12px }\
	        #'+setup.id+' div { text-align:center;font-weight:bold;font-size:14px }\
	        #'+setup.id+' ul { margin:15px 0 15px 0;padding:0;list-style:none }\
	        #'+setup.id+' li { margin:0;padding:3px 0 3px 0;vertical-align:middle }'
	    );
		d.body.appendChild(ce('div', {id:setup.id,innerHTML:setup.html()}));
		setup.q('save').addEventListener('click', function() {
			if(setup.get('country') != cfg.country) cache.clear('yt');
			setup.forEach(function(n) { cfg[n] = setup.get(n); });
			cfg.x = cfg.y = false;
			cfg.save();
			this.disabled = true;
			this.innerHTML = 'Reloading...';
			location.reload();
		});
		setup.forEach(function(n) {
			setup.set(n, cfg[n]);
			setup.q(n).addEventListener('change', setup.update);
		});
		setup.update();
	},
	update: function() {
		setup.forEach(function(n) {
			var s = cfg.settings[n];
			if(!s.depends) return;
			setup.q(n).parentNode.style.display = (Object.keys(s.depends).every(function(dn) { return s.depends[dn].test(setup.get(dn)); })) ? '' : 'none';
		});
	}
}

var links = {
	process: function(node) {
		var i = 0, list = node.tagName.toUpperCase() == 'A' ? [node] : node.querySelectorAll(links.query), isFB = location.hostname == 'www.facebook.com';
		if(list.length < 1) return;
		function processChunk() {
			var a, li, vi, num = 0, ae = d.activeElement;
			while(a = list[i++]) {
				if(!(li = links.parseInfo(a)) || ae && ae != d.body && ae.contains(a) || isFB && (a.parentNode.outerHTML.indexOf('shareLink') > -1 || a.parentNode.outerHTML.indexOf('ScaledImageContainer') > -1)) continue;
				if((vi = cache.get(li.sid, li.vid)) || cfg.urls_only && !li.url) {
					links.decorate(a, li, vi);
				} else {
					(function(a, li) {
						net.info(li, function(vi) { links.decorate(a, li, vi); });
					})(a, li);
				}
				if(++num == 15) return window.setTimeout(processChunk, 100);
			}
			list = null;
		}
		node = null;
		processChunk();
	},
	parseInfo: function(a) {
		var url = a.getAttribute('data-expanded-url') || a.getAttribute('data-full-url') || a.href;
		try { url = decodeURIComponent(url.replace(/^https?:\/\/(?:www\.facebook\.com\/.+|sys\.4chan\.org\/derefer\?url=|out\.reddit\.com.+)(http.+)/, '$1')).replace(/&token=[^&]+/, ''); } catch(ex) {};
		var test = function(pattern) { return this.indexOf(pattern.toLowerCase()) != -1; };
		for(var sid in sites) {
			var s = sites[sid], info;
			if(!sites[sid].patterns.some(test, url.toLowerCase())) continue;
			if(info = sites[sid].parse(url)) return {sid:sid,vid:info.vid,t:info.t,url:sites[sid].patterns.some(test, a.textContent.toLowerCase()),oUrl:url};
		}
		return null;
	},
	decorate: function(a, li, vi) {
		if(['wh'].indexOf(li.sid) > -1 && !vi.status && location.protocol == 'https:') vi.status = 5;
		if(a.className.indexOf('YTLT-') > -1) {
			a.removeEventListener('click', this.onClick, false);
			a.removeEventListener('mouseover', this.onMouseOver, false);
		} else {
			if(!this.styleAdded) {
				var css = '\
					#YTLT-preview { position:fixed;z-index:2147483645;width:320px;padding:0;border:1px solid black;background-color:black; }\
					#YTLT-preview img { max-height:240px;width:inherit;vertical-align:bottom; }\
					#YTLT-preview div { padding:4px 2px;width:316px;text-align:center;font-family:sans-serif;font-size:13px;color:white;font-weight:bold; }\
					a.YTLT-na { text-decoration: line-through!important; }\
					a.YTLT-text { font-weight:bold!important;font-style:italic!important; }\
					a.YTLT-icon { padding-left:18px!important; }\
					a.YTLT-icon.YTLT-na:hover, a.YTLT-icon.YTLT-ne:hover { background:transparent url(data:image/gif;base64,R0lGODlhEAAQAKIGAO/v7+vr676+vmVlZZqamv///////wAAACH5BAEAAAYALAAAAAAQABAAAAM/aLrc/tAIQisRj4DCOSAZN4xDATpEV4zmMlVdWZ6GxqWr2Cq4mau0nk0VCHZelsuiBwypbpkNkcZAWjCRrCIBADs=) center left no-repeat!important; }';
				for(var sid in sites) {
					css += 'a.YTLT-icon-' + sid + ' { background:transparent url(' + sites[sid].icon + ') center left no-repeat!important; }';
				}
				GM_addStyle(css);
				this.styleAdded = true;
			}
			var c = ' YTLT-link';
			if(li.url || location.hostname == 'twitter.com') {
				c += ' YTLT-text YTLT-icon YTLT-icon-' + li.sid;
				if(vi) a.innerHTML = vi.title;
			} else {
				if(vi && !cfg.previews && vi.title) a.title = vi.title;
				if(a.hasChildNodes() && a.innerHTML.indexOf('<img') == -1 && a.textContent.trim()) {
					c += ' YTLT-icon YTLT-icon-' + li.sid;
				}
			}
			if(vi.status == 3 || vi.status == 4) {
				c += ' YTLT-na';
			} else if(vi.status == 5) {
				c += ' YTLT-ne';
			}
			a.className += c;
			if(cfg.rewrite && sites[li.sid].url) {
				a.href = sites[li.sid].url(li.vid, li.t, li.oUrl);
			}
		}
		if(cfg.embed_mode != 'off') {
			a.target = '_blank';
			if(!vi.status) {
				a.onclick = null;
				a.addEventListener('click', this.onClick);
			}
		}
		if(cfg.previews && (vi && vi.preview || sites[li.sid].preview) && !a.querySelector('iframe')) {
			var url = embedding.preview(vi, li);
			if(['twitter.com', 'github.com'].indexOf(location.hostname) > -1) {
				a.title = '';
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					overrideMimeType: 'text/plain; charset=x-user-defined',
					headers: {'Accept':'image/png,image/*;q=0.8,*/*;q=0.5'},
					onload: function(res) {
						var txt = res.responseText, ui8 = new Uint8Array(txt.length), fr = new FileReader();
						for(var i = txt.length; i--;) ui8[i] = txt.charCodeAt(i);
						fr.onload = function() { a.setAttribute('data-ytlt-preview', fr.result); };
						fr.readAsDataURL(new Blob([ui8.buffer], {type:'image/jpeg'}));
					}
				});
			} else {
				a.setAttribute('data-ytlt-preview', url);
				new Image().src = url;
			}
			a.setAttribute('data-ytlt-title', vi.title);
			a.addEventListener('mouseover', this.onMouseOver);
		}
	},
	onClick: function(e) {
		if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.button != 0) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		rm('YTLT-preview');
		embedding.play(this);
	},
	onMouseOver: function(e) {
		rm('YTLT-preview');
		var url = this.getAttribute('data-ytlt-preview'), title = this.getAttribute('data-ytlt-title');
		var qm = d.compatMode == 'BackCompat';
		var w = qm ? d.body.clientWidth : d.documentElement.clientWidth, h = qm ? d.body.clientHeight : d.documentElement.clientHeight;
		var div = ce('div', {id:'YTLT-preview'});
		if(url) {
			var img = ce('img', {src:url});
			div.appendChild(img);
		}
		if(title && this.textContent.toLowerCase().indexOf(title.toLowerCase()) == -1) div.appendChild(ce('div', {innerHTML:title}));
		d.body.appendChild(div);
		var r = (this.firstElementChild || this).getBoundingClientRect();
		var dw = Math.max(div.offsetWidth, 320), dh = Math.max(div.offsetHeight, 240);
		if(h - r.height > 2*dh) {
			if(r.top + r.bottom > h) {
				div.style.bottom = h - r.top + 15 + 'px';
			} else {
				div.style.top = r.bottom + 15 + 'px';
			}
			div.style.left = Math.min(w - dw - 10, Math.max(10, e.pageX - dw/2)) + 'px';
		} else {
			if(r.right + r.left > w) {
				div.style.right = w - r.right + r.width + 15 + 'px';
			} else {
				div.style.left = r.left + r.width + 15 + 'px';
			}
			if(r.top+r.bottom > h) {
				div.style.bottom = Math.max(20, h - r.top - r.height/2 - dh/2) + 'px';
			} else {
				div.style.top = Math.max(10, r.top + r.height/2 - dh/2) + 'px';
			}
		}
		d.addEventListener('mouseout', links.onMouseOut);
	},
	onMouseOut: function(e) {
		d.removeEventListener('mouseout', links.onMouseOut, false);
		rm('YTLT-preview');
	}
};

var net = {
	info: function(li, f) {
		var id = li.sid + li.vid;
		if(typeof net.pending[id] != 'object') {
			net.pending[id] = [f];
			sites[li.sid].request(li.vid, function(vi) {
				if(vi) {
					cache.set(li.sid, li.vid, vi);
					for(var i = net.pending[id].length; i--;) {
						window.setTimeout(net.pending[id][i], 0, vi);
					}
				}
				delete net.pending[id];
				});
		} else {
			net.pending[id].push(f);
		}
	},
	pending: {},
	json: function(url, f) {
		GM_xmlhttpRequest({
			method:	'GET',
			url:	url,
			onload:	function(req) {
				var obj;
				try {
					obj = JSON.parse(req.responseText);
				} catch(ex) {
					log('JSON data from ' + url + ' could not be parsed: ' + ex + '\nHTTP: ' + req.status + '\nResponse: ' + req.responseText);
				}
				window.setTimeout(f, 0, req.status, obj, req.responseText);
			},
			onerror: function(req) {
				log('Request to ' + url + ' failed.');
				window.setTimeout(f, 0, req.status, null, req.responseText);
			}
		});
	},
	text: function(url, re, f) {
		GM_xmlhttpRequest({
			method:	'GET',
			url:	url,
			onload:	function(req) {
				var m = [], txt = req.responseText;
				for(var i = 0, len = re.length; i < len; i++) {
					m.push(re[i].exec(txt));
				}
				window.setTimeout(f, 0, req.status, m);
			},
			onerror: function(req) {
				log('Request to ' + url + ' failed.');
				window.setTimeout(f, 0, req.status, []);
			}
		});
	}
};

var embedding = {
	play: function(a) {
		var li = links.parseInfo(a);
		if(cfg.embed_mode == 'inline') {
			var embed = embedding.embed(li, cfg.big);
			a.parentNode.replaceChild(embed, a);
			window.setTimeout(window.scrollTo, 0, 0, window.scrollY + embed.getBoundingClientRect().top - window.innerHeight/2 + embed.offsetHeight/2);
		} else if(cfg.embed_mode == 'window' || location.hostname == 'api.solidopinion.com' && location.search.indexOf('nextbigfuture.com')) {
			var embed = embedding.embed(li, cfg.big);
			var w = parseInt(embed.style.width), h = parseInt(embed.style.height);
			embed.style.width = '100%';
			embed.style.height = '100%';
			var div = ce('div');
			div.appendChild(embed);
			var features = 'left='+(window.screen.width/2-w/2)+',top='+(window.screen.height/2-h/2)+',width='+w+',height='+h+',status=no,scrollbars=no,location=no,menubar=no,toolbar=no,personalbar=no,dependent=no';
			window.open('data:text/html,<html><title>Video Player</title><body style="padding:0;margin:0;overflow:hidden;background:black">' + encodeURIComponent(div.innerHTML) + '</body></html>', 'YouTube Link Title', features);
			div.removeChild(embed);
		} else if(cfg.embed_mode == 'player') {
			popup.show(li);
		}
	},
	embed: function(li, big) {
		var site = sites[li.sid], embed = ce('iframe', {className:'YTLT-embed'});
		embed.setAttribute('webkitAllowFullScreen', '');
		embed.setAttribute('allowfullscreen', '');
		embed.setAttribute('YTLT-sid', li.sid);
		embedding.resize(embed, big);
		embed.src = site.embed(li.vid, li.t);
		embed.style.display = 'block';
		return embed;
	},
	resize: function(embed, big) {
		var site = sites[embed.getAttribute('YTLT-sid')];
		var w = site.sizes[big?1:0][0];
		var h = site.sizes[big?1:0][1];
		embed.style.width = w + 'px';
		embed.style.height = h + 'px';
	},
	preview: function(vi, li) {
		if(vi && vi.preview) {
			 return vi.preview;
		} else if(sites[li.sid].preview) {
			return sites[li.sid].preview(li.vid);
		}
	}
};

var popup = {
	show: function(li) {
		if(window.top != window.self && !li.self) return window.parent.postMessage({YTLT:li}, '*');
		this.close();
		if(!this.styleAdded) {
			GM_addStyle('\
				#YTLT-bg { position:fixed;z-index:2147483647;top:0;right:0;bottom:0;left:0;background-color:black;opacity:0.9; }\
				#YTLT-player { display:block;position:fixed;z-index:2147483647;line-height:normal;background-color:black;border:2px solid black;font-size:13px;line-height:16px;padding:0;margin:0;left:auto;top:auto;right:auto;bottom:auto; }\
				#YTLT-player-titlebar { display:block;line-height:17px;padding:0;background:#1b1b1b;border-bottom:2px solid black;text-align:'+(cfg.reverse_buttons?'left':'right')+'; }\
				#YTLT-player-left { display:block;position:absolute;left:-6px;top:6px;bottom:6px;width:8px;padding:0;margin:0;background:none;cursor:ew-resize;s }\
				#YTLT-player-bottom { display:block;position:absolute;left:6px;right:6px;bottom:-6px;height:8px;padding:0;margin:0;background:none;cursor:ns-resize;s }\
				#YTLT-player-darken { padding:0px 11px 3px 11px; }\
				#YTLT-player-resize { padding:1px 11px 2px 11px; }\
				#YTLT-player-close { padding:0px 28px 3px 28px; }\
				#YTLT-player .YTLT-embed { border:0;line-height:normal; }\
				#YTLT-player .YTLT-player-titlebar-button { vertical-align:top;display:inline-block;margin:0;font-weight:bold;font-size:14px;text-decoration:none;border:0;border-'+(cfg.reverse_buttons?'right':'left')+':2px solid black;color:#757575;text-decoration:none;cursor:pointer;font-family:"segoe ui",verdana,sans-serif; }\
				#YTLT-player .YTLT-player-titlebar-button:hover { color:#959595!important; }\
				.YTLT-embed { display:block;background-color:black;border:2px solid black;margin:0;padding:0; }\
				#YTLT-player.YTLT-player-moving { opacity:0.8;cursor:move;border:2px solid white; }\
				#YTLT-player.YTLT-player-resizing { opacity:0.8; }\
				#YTLT-player.YTLT-player-moving .YTLT-embed, #YTLT-player.YTLT-player-resizing .YTLT-embed { visibility:hidden; }\
				.YTLT-noselect { -moz-user-select:none;-webkit-user-select:none;-o-user-select:none; }'
			);
			this.styleAdded = true;
		}
		this.li = li;
		var titlebar = ce('div', {id:'YTLT-player-titlebar',mousedown:this.onTitlebarMouseDown});
		var buttons = [
			ce('a', {id:'YTLT-player-darken',className:'YTLT-player-titlebar-button YTLT-noselect',innerHTML:'&#9788;',click:this.onDarkenClick}),
			ce('a', {id:'YTLT-player-resize',className:'YTLT-player-titlebar-button YTLT-noselect',click:this.onResizeClick}),
			ce('a', {id:'YTLT-player-close',className:'YTLT-player-titlebar-button YTLT-noselect',innerHTML:'X',click:this.onCloseClick})
		];
		if(cfg.reverse_buttons) buttons.reverse();
		for(var i = 0; i < buttons.length; i++) {
			titlebar.appendChild(buttons[i]);
		}
		var player = ce('div', {id:'YTLT-player'});
		player.appendChild(titlebar);
		player.appendChild(ce('div', {id:'YTLT-player-left',mousedown:this.onBorderMouseDown}));
		player.appendChild(ce('div', {id:'YTLT-player-bottom',mousedown:this.onBorderMouseDown}));
		player.appendChild(embedding.embed(li, cfg.big));
		if(cfg.darken) d.body.appendChild(ce('div', {id:'YTLT-bg'}));
		d.body.appendChild(player);
		this.update();
		var w = player.offsetWidth, h = player.offsetHeight;
		var x = parseFloat(cfg.x), y = parseFloat(cfg.y);
		var qm = d.compatMode == 'BackCompat';
		var cw = qm ? d.body.clientWidth : d.documentElement.clientWidth;
		var ch = qm ? d.body.clientHeight : d.documentElement.clientHeight;
		var mx = cw - x - w/2;
		var isPosValid = mx > 0 && mx < cw && y > -5 && y < ch - h/2;
		player.style.right = (isPosValid ? x : 80) + 'px';
		player.style.top   = (isPosValid ? y : ch/2 - h/2) + 'px';
		d.addEventListener('keydown', this.onKeyDown);
	},
	close: function() {
		rm('YTLT-player');
		rm('YTLT-bg');
		d.removeEventListener('keydown', popup.onKeyDown, true);
	},
	update: function(e) {
		$('YTLT-player-resize').innerHTML = cfg.big ? '&#65293;' : '&#65291;';
	},
	onCloseClick: function(e) {
		e.preventDefault();
		popup.close();
	},
	onResizeClick: function(e) {
		e.preventDefault();
		cfg.big = !cfg.big;
		cfg.save();
		var embed = d.body.querySelector('#YTLT-player .YTLT-embed');
		embedding.resize(embed, cfg.big);
		popup.update();
	},
	onDarkenClick: function(e) {
		if($('YTLT-bg')) {
			rm('YTLT-bg');
			cfg.darken = false;
			cfg.save();
		} else {
			var player = $('YTLT-player');
			player.parentNode.insertBefore(ce('div', {id:'YTLT-bg'}), player);
			cfg.darken = true;
			cfg.save();
		}
	},
	onKeyDown: function(e) {
		if(e.keyCode == 27) popup.close();
	},
	onTitlebarMouseDown: function(e) {
		var t = e.target;
		if(t.id != 'YTLT-player-titlebar') return;
		t.parentNode.className = 'YTLT-player-moving';
		var r = t.getBoundingClientRect();
		t.dx = e.clientX - r.left;
		t.dy = e.clientY - r.top;
		d.body.className += ' YTLT-noselect';
		d.addEventListener('mousemove', popup.onTitlebarMouseMove);
		d.addEventListener('mouseup', popup.onTitlebarMouseUp);
	},
	onTitlebarMouseMove: function(e) {
		var titlebar = $('YTLT-player-titlebar');
		titlebar.parentNode.style.right = (d.compatMode == 'BackCompat' ? d.body.clientWidth : d.documentElement.clientWidth) - e.clientX - titlebar.offsetWidth + titlebar.dx - 2 + 'px';
		titlebar.parentNode.style.top = e.clientY - titlebar.dy - 2 + 'px';
	},
	onTitlebarMouseUp: function(e) {
		var titlebar = $('YTLT-player-titlebar');
		titlebar.parentNode.className = '';
		titlebar.dx = null;
		titlebar.dy = null;
		d.removeEventListener('mousemove', popup.onTitlebarMouseMove, false);
		d.removeEventListener('mouseup', popup.onTitlebarMouseUp, false);
		d.body.className = d.body.className.replace('YTLT-noselect', '');
		cfg.x = parseInt(titlebar.parentNode.style.right);
		cfg.y = titlebar.parentNode.style.top;
		cfg.save();
	},
	onBorderMouseDown: function(e) {
		var embed = d.body.querySelector('#YTLT-player .YTLT-embed');
		embed.parentNode.className = 'YTLT-player-resizing';
		var r = embed.getBoundingClientRect();
		embed.ratio = r.width/r.height;
		embed.anchor = [r.right, r.top];
		embed.control = e.target.id;
		d.body.className += ' YTLT-noselect';
		d.addEventListener('mousemove', popup.onBorderMouseMove);
		d.addEventListener('mouseup', popup.onBorderMouseUp);
	},
	onBorderMouseMove: function(e) {
		var embed = d.body.querySelector('#YTLT-player .YTLT-embed'), w, h;
		if(embed.control == 'YTLT-player-left') {
			var dx = embed.anchor[0] - e.clientX;
			w = dx;
			h = dx / embed.ratio;
		} else {
			var dy = e.clientY - embed.anchor[1];
			w = embed.ratio * dy;
			h = dy;
		}
		embed.style.width = w + 'px';
		embed.style.height = h + 'px';
	},
	onBorderMouseUp: function(e) {
		var embed = d.body.querySelector('#YTLT-player .YTLT-embed');
		embed.parentNode.className = '';
		embed.x = null;
		embed.y = null;
		embed.w = null;
		embed.h = null;
		d.removeEventListener('mousemove', popup.onBorderMouseMove, false);
		d.removeEventListener('mouseup', popup.onBorderMouseUp, false);
		d.body.className = d.body.className.replace('YTLT-noselect', '');
	},
};

var sites = {
	'yt':{
		patterns:["youtube.com", "youtu.be", "youtube.googleapis.com"],
		parse:function(url) { return /^https?:\/\/((www\.|m\.)?youtu(\.be|be\.(googleapis\.)?com).+v[=\/]|#p\/[a-z]\/.+\/|youtu\.be\/)([a-z0-9_-]{8,})(.*[#&\?]t=([0-9hms]+))?/i.exec(url) ? {vid:RegExp.$5, t:RegExp.$7} : null; },
		sizes:[[640,360],[853,480]],
		embed:function(vid, t) { var m = /((\d+)h)?((\d+)m)?(\d+)?/.exec(t); t = parseInt(m[2] || 0)*3600 + parseInt(m[4] || 0)*60 + parseInt(m[5] || 0); return 'https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=1' + (t ? '&start=' + t : ''); },
		url:function(vid, t, oUrl) { return 'https://www.youtube.com/watch?v=' + vid + (/\b(list=[a-z0-9_-]+)/i.exec(oUrl) ? '&' + RegExp.$1 : '') + (t ? '#t=' + t : ''); },
		preview:function(vid) { return 'https://img.youtube.com/vi/' + vid + '/0.jpg'; },
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAMZQTFRFkQ0IyBILyBILkQ0IyBILkQ0IkQ0IyBILyBILkQ0IpA8JmQ4JlQ4Ing4JuxEKtRAKwBEKxBELyBILkQ0IAAAA+fn5wRcQtR0Yvh8YqRsWrx0XoxsV56Wj8vLy9+/vyTMttxgS252b6Ojo0WNfnRcTy8jIlg4JzL+/XAgFjjAtdAoHiFNRmA4IbxQQgQwI05qYmw4JrI2M8fHx1dXV5+fn3d3dkQ0IpA8JtRAKyBILng4Jqg8JrxAKuxEKmQ4JwBEKxBELlQ4ItxbjVAAAABV0Uk5TCaUJBvmihNKi2PzMh+rq/MyHzMwAD5S0KQAAAItJREFUGNOFz8cWgjAARNGxKx2CvWDvFRILCuj//5QJcYMuvKt3Zjdwv+BnyOec4u2j4lRd2M8MG1bCNXpeIlkwIq5VH0yilAHzyjV9vz8aijLxEDqU0vEhTdyFNmNssUoTyoXrBsFptxWlQA+56WyzPooIdagxN1/uY0mF9srQgBIhZ6lGSLmAv2/fr2gov1/MElQAAAAASUVORK5CYII=',
		request:function(vid, f) {
			var part = ['snippet', 'status'], fields = ['id', 'snippet/title', 'status/privacyStatus', 'status/embeddable'], country;
			if(cfg.country) {
				country = cfg.country.toUpperCase();
				part.push('contentDetails');
				fields.push('contentDetails/regionRestriction');
			}
			net.json('https://www.googleapis.com/youtube/v3/videos?id=' + vid + '&part=' + part.join(',') + '&fields=items(' + fields.join(',') + ')&' + String.fromCharCode.apply(String, [107,101,121,61,65,73,122,97,83,121,68,87,120,79,114,52,76,105,52,65,54,72,116,89,120,57,107,55,98,86,98,67,81,54,56,118,112,119,74,74,117,111,99]), function(code, obj, txt) {
				if(code != 200) return window.setTimeout(f, 0);
				var item = obj.items[0];
				if(!item) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(item.status.privacyStatus == 'private') {
					window.setTimeout(f, 0, {title:'Private video', status:3});
				} else {
					var status;
					if(item.contentDetails && item.contentDetails.regionRestriction) {
						var rr = item.contentDetails.regionRestriction;
						if(rr.blocked && rr.blocked.indexOf(country) > -1 || rr.allowed && rr.allowed.indexOf(country) < 0) status = 3;
					} else if(!item.status.embeddable) {
						status = 5;
					}
					window.setTimeout(f, 0, {title:item.snippet.title, status:status});
				}
			});
		}
	},
	'vm':{
		patterns:["vimeo.com"],
		parse:function(url) { return /^https?:\/\/vimeo\.com\/(m\/)?([0-9]+)/i.exec(url) ? {vid:RegExp.$2} : null; },
		sizes:[[640,360],[853, 480]],
		embed:function(vid, t) { return 'https://player.vimeo.com/video/' + vid + '?title=1&portrait=1&byline=1&color=aa0000&autoplay=1'; },
		url:function(vid, t) { return 'https://vimeo.com/' + vid; },
		icon:'data:image/gif;base64,R0lGODlhEAAQAMQfAAuUuQynzzu83u/09Ryy2Su320rC4IbW6mKOngqHq5GvuoO3xhVbc0m92zV7keDo60R8j8Hc5KHEzwuawGSluaTg8Ah1lfD5/BmPsJPI13fR6LLd6f///wuavg2t1gAAACH5BAEAAB8ALAAAAAAQABAAAAVu4NeNZFmKgqeurCqMbbzCbrEWh0ao9MFdNgNnWOF1CJUhR+PZDIYRY2MRGWYIFsVQYgRYHNBAc4gwqiaPoUfIkQDMKsnwkB5YZp0VRTmEsGgeGHwIb3grAVoDCAktgB4WEAyMjY4AYpQiJpojHyEAOw==',
		request:function(vid, f) {
			net.json('https://vimeo.com/api/oembed.json?url=http://vimeo.com/' + vid, function(code, obj) {
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(code == 403) {
					window.setTimeout(f, 0, {title:'Unknown video', status:5});
				} else if(code == 200 && obj) {
					window.setTimeout(f, 0, {title:obj.title ? obj.title : 'Unknown video', preview:obj.thumbnail_url});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'vn':{
		patterns:["vine.co"],
		parse:function(url) { return /^https?:\/\/(www\.)?vine\.co\/v\/([a-z0-9]+)/i.exec(url) ? {vid:RegExp.$2} : null; },
		sizes:[[500,500],[660,660]],
		embed:function(vid) { return 'https://vine.co/v/' + vid + '/card?audio=1'; },
		url:function(vid) { return 'https://vine.co/v/' + vid; },
		icon:'data:image/gif;base64,R0lGODlhEAAQALMAAAqnfLXk1/b7+jS1ks3t5JvZyFbBpOf28onSvhirhHLLswCjdgCkdwCjd////wCkeCH5BAAAAAAALAAAAAAQABAAAARp8Mk5TQgoNbqrcGCgMQZiUISDHcK5IE4xDezQBI6yvOpcPzjdwtCbBAEpF+1gkygchIEis0kkdwwr1DUpFCUDnOAgHI6bTtABQcGJGA1tYeTJSWBMLAU//ZQ5AF4fMQCAe36FhhQGXBQRADs=',
		request:function(vid, f) {
			net.text('https://vine.co/v/' + vid, [/"og:title" content="(.+?)">/, /"og:image" content="(.+?)"/], function(code, m) {
				var title = m[0], preview = m[1];
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(code == 200 && title) {
					window.setTimeout(f, 0, {title:title ? title[1] : 'Unknown video', preview:preview ? preview[1] : null});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'll':{
		patterns:["liveleak.com/view"],
		parse: function(url) { return /^https?:\/\/(m|www)\.liveleak\.com\/view.+i=([0-9a-z_]+)/i.exec(url) ? {vid:RegExp.$2} : null; },
		sizes:[[625,352],[852,480]],
		embed:function(vid) { return 'https://www.liveleak.com/ll_embed?i=' + vid + '#play'; },
		url:function(vid) { return 'https://www.liveleak.com/view?i=' + vid; },
		icon:'data:image/gif;base64,R0lGODlhEAAQAIAAAPz8/JcAACH5BAAAAAAALAAAAAAQABAAAAIrjI+pB+1gWoLhRcqurDhqumXcFnoj2FXfNa1ce7IISqb0DcJPPi+f4wsWAAA7',
		request:function(vid, f) {
			net.text('https://www.liveleak.com/view?i=' + vid, [/Item not found!/i, /<title>LiveLeak\.com - (.+?)<\/title>/i, /"og:image" content="(.+?)"/], function(code, m) {
				var notfound = m[0], title = m[1], preview = m[2];
				if(notfound) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(code == 200 && title) {
					window.setTimeout(f, 0, {title:title ? title[1] : 'Unknown video', preview:preview ? preview[1].replace('_thumb_', '_sf_') : null});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'wh':{
		patterns:["worldstarhiphop.com"],
		parse: function(url) { return /^https?:\/\/(www\.|m\.)?worldstarhiphop\.com\/.+v=([a-z0-9]+)/i.exec(url) ? {vid:RegExp.$2} : null; },
		sizes:[[448,374],[640,534]],
		embed:function(vid) { return 'http://www.worldstarhiphop.com/videos/ea/16711680/' + vid; },
		url:function(vid) { return 'http://www.worldstarhiphop.com/videos/video.php?v=' + vid; },
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXpJREFUeNpsUt1KAkEY/Ry2yx6gF4gQIXoakZAQkegqQiJ6gIiIJSQkRGSRiPCqNzGjve8JvOoq+Tz2nZnZbakGnf1+ztlz5tuprV9mEpdzIrAHBI7PMnE+BYhIFEowK0kkqGw1m1b7ms2YIHGJYRIDusQIiigALRXC8u8C68QoFVRqoff5PKUHtqVxeJQ/TU2+0WrnVofz73DbrTZ9L6fZjtEVK9X4E1mFNATQkBps+Zg5VV1ko712R+OijxiWgaoBFtnYAp4dQD4Z1zs9ixrdHo+D8BcrWt/2fDKiXdj8YKehrvV3uydmYz4aWnEFzMdDkHNsu6WgPdgASKCxh3t68ONQVOyJsFUUah/DQRiPxI1JUWASZx6HyO+gJaF+2pcCVyXkg7RC8IfjDfB5fpcW4J8VMKHqCYjstYmcUWQj8Ytu/P6e3pSaCeDVHMf4ll47+hd/44J1t9+/QCz5C+cJEmZ/cH4p/y14F/DDSKqN19urvwq/yN8CDAB9dTAcPA3GZgAAAABJRU5ErkJggg==',
		request:function(vid, f) {
			net.text('http://www.worldstarhiphop.com/videos/video.php?v=' + vid, [/<title>(Video: )?(.+?)\s*(\(\*Warning|<\/title>)/i, /"image_src" href="(.+?)"/], function(code, m) {
				var title = m[0], preview = m[1];
				if(title) {
					window.setTimeout(f, 0, {title:title[2], preview:preview ? preview[1] : null});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'dm':{
		patterns:["dailymotion.com/video"],
		parse:function(url) { return /^https?:\/\/www\.dailymotion\.com\/video\/([a-z0-9]+)(.+start=([0-9]+))?/i.exec(url) ? {vid:RegExp.$1,t:RegExp.$3} : null; },
		sizes:[[620,352],[853,480]],
		embed:function(vid, t) { return 'https://www.dailymotion.com/embed/video/' + vid + '?logo=0&autoplay=1' + (t ? '&start=' + t : ''); },
		url:function(vid, t) { return 'https://www.dailymotion.com/video/' + vid + (t ? '?start=' + t : ''); },
		icon:'data:image/gif;base64,R0lGODlhEAAQAMQAAGB0hvHXCi5aq6mYZThltsiUCEd1ydmlAXSImMi1g7KCDePUZdO3TjJWl5dpBf7wAT5jpNrPkNCsJyVQnOzBBJ6klcCYLx1Jmdvh62WT5fLiKYV3V9W8Gr27tUlrqjVYlyH5BAAAAAAALAAAAAAQABAAAAWfIAZ5ZGmSkJgZbOuyGQQZRF1Xnl0bMm0jHISOwJv9FhSJ0Mb76CqLg2JAENg+TisBoTk4NoKw9dOoCjyVQOHrERMaDcFk4mEEvIoORAyXQwYcDwcFBxYJewJ9Fx0SAYIHFAoFHxOJDRMXCQWOB5CSCHNwmAMKD48UBQUJFxNwFxcWEqadqIavlwIXHwARCxYWDBEAEBdyGK1YycpkExghADs=',
		request:function(vid, f) {
			net.json('https://www.dailymotion.com/services/oembed?format=json&url=http://www.dailymotion.com/video/' + vid, function(code, obj) {
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(code == 200 && obj) {
					window.setTimeout(f, 0, {title:obj.title ? obj.title : 'Unknown video', preview:obj.thumbnail_url});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'cb':{
		patterns:["coub.com/view/"],
		parse:function(url) { return /^https?:\/\/coub\.com\/view\/([a-z0-9]+)/i.exec(url) ? {vid:RegExp.$1} : null; },
		sizes:[[640,360],[853,480]],
		embed:function(vid, t) { return 'https://coub.com/embed/' + vid + '?muted=false&autostart=true&noSiteButtons=true'; },
		url:function(vid, t) { return 'https://coub.com/view/' + vid; },
		icon:'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAWlBMVEUAAAADM/8AIP8DMv8AK/8DMv8DMv8AMP8EMv8EMv8EM/8DMv////8UQP+Dmv9kgf/t8P/M1v/j6f8dSP96k//Z4f+Mov/Bzf8MOf+0wv87X/91j/+Yq/9rhv9szalUAAAACnRSTlMAvwjCBpSYKo/huP286QAAAHpJREFUGNNlj9sSgyAMRGkrBQ4R1Kq9//9vCiqOo+ctmWx2V2WMdd47a9RCpVm5X+f5wsatSgvNDp30QD02ItKMDzDKprmVto+hkwhWOQjyfuW7bw1OeXjKh4I/LthL+ixZnw4hhkH+YBfb0GXbX7Y9BjtFP5cr9Sn1JyOZCa2SfTdfAAAAAElFTkSuQmCC',
		request:function(vid, f) {
			net.json('https://coub.com/api/oembed.json?url=http://coub.com/view/' + vid, function(code, obj) {
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else if(code == 403) {
					window.setTimeout(f, 0, {title:'Unknown video', status:5});
				} else if(code == 200 && obj) {
					window.setTimeout(f, 0, {title:obj.title ? obj.title : 'Unknown video', preview:obj.thumbnail_url});
				} else {
					window.setTimeout(f, 0);
				}
			});
		}
	},
	'vd':{
		patterns:["vid.me/"],
		parse:function(url) { return /^https?:\/\/vid\.me\/(e\/)?([a-z0-9]+)$/i.exec(url) ? {vid:RegExp.$2} : null; },
		sizes:[[640,360],[853,480]],
		embed:function(vid, t) { return 'https://vid.me/e/' + vid + '?autoplay=1'; },
		url:function(vid, t) { return 'https://vid.me/' + vid; },
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAjVBMVEUAAAA+Pj4pKSkqKionJycrKystLS1KSkpJSUk0NDQ0NDQtLS3///8tLS0rKyspKSlvb281NTXKysrDw8O/v79OTk7b29ujo6ONjY2KiopnZ2dYWFjX19e4uLg8PDz29vbt7e3Ozs6xsbGnp6eWlpaHh4d3d3dmZmZaWlpISEgwMDC5ubl1dXVqampoaGjlr6SgAAAADHRSTlMA/KqVSxoH8O/m5bPyShVZAAAAt0lEQVQY02WPRxKDMAxFjXGAAHLD9N5Lyv2PF9vDLm+hGX1p8T7SeAQ/HeeJiYcsDzcoVdOoMnAfdo94FlsyHunEc/kQ3wzc9RAJ7P3+CQjCZdw387ptaz72cYlRqEbeUWYQh1IhcpKaifMCuE7B0sTRQSqW6U0pnxZhgrCtRN3VAHV3iKoNES5yqgEwIy8wIr7cGVhYJX1ixOQXGKUMdqnFrLqcP2la5dKo23J+8UqStvBNub/6P7zKDtYRJLbHAAAAAElFTkSuQmCC',
		request:function(vid, f) {
			net.text('https://vid.me/' + vid, [/"og:title" content="(.+?)">/, /"og:image" content="(.+?)"/], function(code, m) {
				var title = m[0], preview = m[1];
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else {
					window.setTimeout(f, 0, {title:title ? title[1] : 'Unknown video', preview:preview ? preview[1] : null});
				}
			});
		}
	},
	'st':{
		patterns:["streamable.com/"],
		parse:function(url) { return /^https?:\/\/streamable\.com\/([a-z0-9]+)$/i.exec(url) ? {vid:RegExp.$1} : null; },
		sizes:[[650,360],[870,480]],
		embed:function(vid, t) { return 'https://streamable.com/e/' + vid + '?autoplay=1'; },
		url:function(vid, t) { return 'https://streamable.com/' + vid; },
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAArlBMVEUAAAAPkPoPkPoOkPoPkPoOkPoPkPoPkPoTkvoPkPoPkPoOkPoPkPoPkPoPkPoOkPopnPornfoPkPoPkPpnufxruvwPkPoPkPqExv0PkPqExv0PkPoNj/oLjvr///87pPsimPv8/v/a7v5TsPwnm/v3/P/z+f9puvxCqPsblfoUkvrv9/7p9f7g8f6m1v1mufxhtvzN6P6/4f684P2t2f10v/xMrPtJq/sxoPsunvtCVzXKAAAAG3RSTlMA+fEFz5SJJvTVso2GgCAK2Na+ppSQgn4uLijfEpSVAAAAtElEQVQY003P5ZICQQwE4Oywctjd4dIZWRfc4f1fDGYp5PuV7qpUJWT9dl0h3E5AT42ug5rjN+o8wFvLNhN8aT/2HTAnlUSlSwnMaQzWkVrEJlLZVvKIXGAVbdfmsDzt0gQ9EtBKs4zDgpNwwz+PolAXRnSUKOvCRbVc5fvM5Nd1avBPHfB5obJYhyrNJQ8pcMBlYVje4kQCUyIfXzx7euuT+3/1M/7rOc9mK2g3hWh6MzvfAS/bFwknO2huAAAAAElFTkSuQmCC',
		request:function(vid, f) {
			net.text('https://streamable.com/' + vid, [/<h1[^>]*>(.+?)</, /"og:image" content="(.+?)"/], function(code, m) {
				var title = m[0], preview = m[1];
				if(code == 404) {
					window.setTimeout(f, 0, {title:'Video not found', status:4});
				} else {
					window.setTimeout(f, 0, {title:title ? title[1] : 'Unknown video', preview:preview ? preview[1].replace('http://', 'https://') : null});
				}
			});
		}
	},
};

var cache = {
	get: function(sid, vid) {
		if(!cache.obj) cache.load();
		var data = cache.obj[sid + vid];
		if(!data) return false;
		data = data.split('\t');
		return data[0] ? {title:data[0],status:data[1],preview:data[2]} : false;
	},
	set: function(sid, vid, info) {
		if(!info) return;
		cache.load();
		cache.obj[sid + vid] = [info.title,info.status,info.preview].join('\t').trim();
		cache.save();
	},
	save: function() {
		if(!cache.obj) return;
		try {
			cache.clean();
			GM_setValue('cache', JSON.stringify(cache.obj));
		} catch(ex) { log('Error while saving cache: ' + ex); }
		cache.obj = null;
	},
	load: function() {
		try {
			cache.obj = JSON.parse(GM_getValue('cache'));
		} catch(ex) { }
		if(cache.obj == null || typeof(cache.obj) != 'object') cache.obj = {};
	},
	clean: function() {
		var overflow = Object.keys(cache.obj).length - 300;
		if(overflow < 1) return;
		var i = 0, f = Object.prototype.hasOwnProperty;
		for(var p in cache.obj) {
			if(f.call(cache.obj, p)) {
				delete cache.obj[p];
				if(++i == overflow + 20) return;
			}
		}
	},
	clear: function(sid) {
		cache.load();
		var f = Object.prototype.hasOwnProperty;
		for(var p in cache.obj) {
			if(p.indexOf(sid) == 0 && f.call(cache.obj, p)) {
				delete cache.obj[p];
			}
		}
		cache.save();
	}
};

var cfg = {
	settings: {
		country: { title:'Check for restrictions? Enter your <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements" target="_blank" style="text-decoration:underline!important;" title="e.g. US, GB or DE">country code</a>', default:'', maxlength:2},
		reverse_buttons: { title:'Move buttons to the left', default:false, depends:{embed_mode:/player/} },
		big: { title:'480p instead of 360p', default:false, depends:{embed_mode:/window|inline/} },
		embed_mode: { title:'Embed on click', default:'player', options:{off:'off', player:'in-page popup', inline:'inline', window:'popup window'} },
		rewrite: { title:'Rewrite addresses to non-mobile HTTPS URLs', default:true },
		urls_only: { title:'Look up info only when link text is URL', default:false },
		previews: { title:'Show preview image on hover', default:true },
		darken: {},
		x: {},
		y: {}
	},
	load: function() {
		forEach(cfg.settings, function(n) { cfg[n] = GM_getValue(n, cfg.settings[n].default); });
	},
	save: function() {
		forEach(cfg.settings, function(n) { if(typeof cfg[n] != 'undefined') GM_setValue(n, cfg[n]); });
	}
};

window.setTimeout(onLoad, 100);
