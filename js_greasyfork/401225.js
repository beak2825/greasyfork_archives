// ==UserScript==
// @name           RealDebrid Download Helper
// @namespace      https://greasyfork.org/en/users/470040-mikei
// @version        2020.6.5.1
// @author         Mikei
// @description    (updated from kuehlschrank & Ramses) Downloads files, copies URLs and queues magnet links *ONLY* for real-debrid users/accounts.
// @include        http*
// @match          http*
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @connect-src    real-debrid.com

// @downloadURL https://update.greasyfork.org/scripts/401225/RealDebrid%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401225/RealDebrid%20Download%20Helper.meta.js
// ==/UserScript==

'use strict';

var re = RegExp('\\b(' + [
  '1fichier\\.com\\/\\?[a-z0-9]{10,10}',
  '4shared\\.com\\/[a-z0-9]{3,7}\\/[a-zA-Z0-9\\-_]{8,10}',
  'clicknupload\\.co\\/[a-zA-Z0-9]{12}',
  'dailymotion\\.com\\/video\\/[a-z0-9]{7,7}',
  'datafile(host)\\.com\\/d\\/[a-z0-9]{8,8}',
  'ddl\\.to\\/[a-zA-Z0-9]{12}',
  '(deposit|d)files\\.(com|eu)\\/files\\/[a-z0-9]{9,9}',  
  'dl\\.free\\.fr\\/(getfile\\.pl\\?file\\=\\/[a-zA-Z0-9]{8,8}|[a-zA-Z0-9]{8,8})',
  'dropapk\\.to\\/[a-zA-Z0-9]{12}',
  'filefactory\\.com\\/file\\/([a-z0-9]{12,12}|[a-z0-9]{12,12})',
  'filerio\\.(com|in)\\/[a-z0-9]{12,12}',
  'gigapeta\\.com\\/dl\\/[a-z0-9]{14,14}',
  '(docs|drive)\\.google\\.com\\/.+',
  'hitfile\\.net\\/[a-zA-Z0-9]{7,7}',
  'hulkshare\\.com\\/.+',
  'isra\\.cloud\\/[a-z0-9]{12,12}',
  'mediafire\\.com\\/file\\/[a-z0-9]{15,15}',
  'mega\\.nz\\/#![a-zA-Z0-9\\-_!]{52,52}',
  'nitroflare\\.com\\/view\\/[A-Z0-9]{15,15}',  // not officially listed on real-debrid.com but works from time to time.
  'oboom\\.com\\/[A-Z0-9]{8,8}',
  'radiotunes\\.com\\/',
  'rapidgator\\.net\\/file\\/[a-z0-9]{32,32}',
  'redtube\\.com\\/',
  'salefiles\\.com\\/[a-z0-9]+',
  'scribd\\.com\\/.+\\/[0-9]{9,9}',
  'sendspace\\.com\\/file\\/[a-z]{6,6}',
  'solidfiles\\.com\\/v\\/[a-zA-Z0-9]{13,13}',
  'soundcloud\\.com\\/.+',
  'turbobit\\.net\\/[a-z0-9]{12,12}',
  'tusfiles\\.com\\/[a-z0-9]{12,12}',
  'uloz\\.to\\/\\![a-zA-Z0-9]{12,12}',
  'unibytes\\.com\\/[a-z0-9\\-]{24,24}',
  '(uploaded|ul)\\.(net|to)\\/(file\\/[a-z0-9]{8,8}|[a-z0-9]{8,8})',
  'userscloud\\.com\\/[a-z0-9]{12,12}',
  'vidlox\\.tv\\/[a-z0-9]{12,12}',
  'vidoza\\.net\\/[a-z0-9]{12,12}',
  'vimeo\\.com\\/([0-9]{8,8}|.+\\/[0-9]{8,8})',
  'vk\\.com\\/',
  'youtube\\.com\\/watch\\?v\\=[a-zA-Z0-9]{11,11}',
  'zippyshare\\.com\\/v\\/[a-zA-Z0-9]{8,8}\\/file'
  ].join('|') + ')', 'i');

var servs = [
	{
		name:'RealDebrid',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAABEVBMVEUlJSUiISIaGhonJycdHR0pKipCQUJDQ0MzMzIBAgE6OTkwMDFubWknKCgxNTEpLCwqKSZKSkoUExoLJBI/Pz+GhX49PTu8u65nZmJ2dXDv7dionopraV8nLzImKiscKB4fHyYgMSYgMC4mJzMlLTkKCgwTIxczOywPDyMQHSQgJjs8OURUVE90gnPe3th+fnYmJClZWVfd2sq7t6iBgHj69+POzsyGknx4eHDX1cyQj4bb2tHCvreBfYLf3dR3d4Dr6dnJx7j19OzHxLZeXlz6+fBud28fHw+enYWioJLVzrmclX6lopLW09C9taTn5t+LhnklJRW0s5rX1L9ARk6urY40JRvRy7xZRDS+sqM3NjUYasLVAAAAlklEQVQI1xXBBRaCQAAFwA+C7BK2knZ3d3d33/8iPmfg9vnswr8guEGgKDyReCcviQgsOuUqRLkhSwTabFofWdZZbakidMNFT+b+QNmaH9pyfvx+drcr3fYgT+zD98t80nXfD71ZoYP7xdh0SwSBAjz58WPVLqY5MEmO8WRyWa835QDDciwXiSdi0TBAbIBLUUJBJ+/4AVyyEd2aDSSWAAAAAElFTkSuQmCC',
		headers:function(h) { var t = GM_getValue('realdebrid_token'); if(t) h['Authorization'] = 'Bearer ' + t; return h; },
		magnet:'http://www.real-debrid.com/torrents',
		api:function(s) { return 'https://api.real-debrid.com/rest/1.0/unrestrict/link'; },
		post: 'link=%s',
		ref:'https://www.real-debrid.com/',
		parse:function(text) { var o = JSON.parse(text); return {url:o.download?o.download:null,size:o.filesize,error:o.error == 'bad_token' ? 'Bad API token - Click user script command "Set RealDebrid API token"' : o.error}; }
	}
];

var serv = Math.min(parseInt(GM_getValue('service', 0)), servs.length - 1);

function main() {
	if(re.test(location.href)) {
		window.setTimeout(insertBar, 1000);
	} else if(location.hash.indexOf('#magnet') == 0) {
		var inp = document.body.querySelector('input[name="magnet"], input[name="url"], textarea[name="links"]');
		if(inp) {
			inp.value = decodeURIComponent(location.hash.substr(1));
			location.hash = '';
			var btn = document.getElementById('downloadbutton');
			if(btn)
				btn.click();
			else
				inp.form.submit();
		}
	} else {
		insertIcons(document.body);
		new MutationObserver(onMutations).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['href']});
	}
}

function onMutations(muts) {
	for(var i = muts.length, mut; i-- && (mut = muts[i]);) {
		if(mut.type == 'attributes') {
			insertIcons(mut.target);
		} else {
			for(var j = mut.addedNodes.length, node; j-- && (node = mut.addedNodes[j]);) {
				if(node.nodeType == 1) insertIcons(node);
			}
		}
	}
}

function insertIcons(parent) {
	var list = parent.tagName == 'A' ? [parent] : parent.querySelectorAll(location.pathname.indexOf('/folder/') > -1 ? 'a[href]' : 'a[href^="http"]');
	for(var i = list.length, a; i-- && (a = list[i]);) {
		if(!re.test(a.href) || /\b(folder|ref)\b|translate\.google|webcache\.google/.test(a.href)) continue;
		if(!insertIcon(a, onWebClick, "Ctrl+click or middle-click: copy URL, Alt+click: switch service")) continue;
		var tc = a.textContent;
		if(!tc) continue;
		if(/(?:k2s|keep2s(?:hare)?)\.cc\/file\/[a-z0-9]+$/.test(a.href) && /^[a-z0-9\., _-]+\.[a-z2-4]{3}$/i.test(tc)) {
			a.href += '/' + tc.trim().replace(/\s+/g, '_');
		}
		if(a.href.indexOf(tc) > -1 || /^\s*download/i.test(tc) || re.test(tc)) {
			var p = (a.search.length > 1 ? a.search.substr(1) : a.pathname).replace(/(\.html|\/)$/, '');
			var h = a.hostname;
			var fp = p.substr(p.lastIndexOf('/') + 1);
			if(fp) {
				a.textContent = fp + ' @ ' + h.substr(0, h.lastIndexOf('.')).replace('www.', '');
				a.title = tc;
			}
		}
	}
	list = parent.tagName == 'A' && parent.href.indexOf('magnet:') === 0 ? [parent] : parent.querySelectorAll('a[href^="magnet:"]');
	for(var i = list.length, a; i-- && (a = list[i]);) {
		insertIcon(a, onMagnetClick, 'Alt+click : switch service');
	}
}

function insertIcon(a, f, title) {
	var ns = a.nextElementSibling;
	if(a.classList.contains('adh-link') || ns && ns.classList.contains('adh-link')) return;
	if(!insertIcon.styled) {
		updateStyle();
		insertIcon.styled = true;
		GM_registerMenuCommand('Switch unrestrict service', nextServ);
		GM_registerMenuCommand('Set custom torrent converter', setMagnet);
		GM_registerMenuCommand('Set RealDebrid API token', setRealDebridToken);
	}
	var icon = document.createElement('a');
	icon.className = 'adh-link adh-ready' + (f == onMagnetClick ? ' adh-magnet' : '');
	icon.title = title;
	icon.addEventListener('mousedown', f);
	icon.addEventListener('click', drop);
	a.parentNode.insertBefore(icon, a.nextSibling);
	return true;
}

function updateStyle() {
	var style = document.getElementById('adh-style'), inserted;
	if(!style) {
		style = document.createElement('style');
		style.id = 'adh-style';
		style.type = 'text/css';
		document.head.appendChild(style);
		inserted = true;
	}
	var s = servs[serv];
	style.textContent = '\
		#adh-bar { position:fixed;z-index:2147483647;top:-1px;left:350px;right:350px;padding:0;height:20px;border-radius:0 0 5px 5px;background-color:white;border:1px solid gray;margin:0;text-align:center;font-weight:bold;font-family:sans-serif;color:black;font-size:14px;line-height:18px;text-shadow:none; }\
		#adh-bar > a:first-of-type { display:none; }\
		a.adh-link { display:inline-block!important; width:12px!important; height:12px!important; position:relative!important; bottom:-2px!important; margin:0 0 0 4px!important; box-sizing:content-box!important; border:1px solid gray!important; padding:0!important; box-shadow:none!important; border-radius:0!important; opacity:0.6; cursor:pointer; }\
		a.adh-link:hover { opacity:1; }\
		a.adh-ready { background: url(' + s.icon + ') no-repeat !important; }\
		a.adh-busy { background: url(data:image/gif;base64,R0lGODlhDAAMAKIGAIForORZKAgSEz9PUFDH4AOeyf///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAGACwAAAAADAAMAAADK2g6rFbQseFgkU3ZCqfjhfc9XWYQaCqsQZuqrPsSq9AGmwLsoLMDPR1PkQAAIfkECRQABgAsAAAAAAwADAAAAyhoutX7qhX4JGsj68Cl3h32DVxAnEK6AOxJpMLaoqrCAq4F5c5+6o8EACH5BAkUAAYALAAAAAAMAAwAAAMqWGqsxcZB2VZ9kI0dOvjQNnTBB4Sc9wmsmDGs4L7xnBF4Thm5bvE9wi4BACH5BAkUAAYALAAAAAAMAAwAAAMrWGrc+qU5GKV5Io8NesvCNnTAp3EeIzZB26xMG7wb61pErj+Nvi8MX+6RAAAh+QQJFAAGACwAAAAADAAMAAADKlhqrMXGQdlWfZCNHTr40DZ0wQeEnPcJrJgxrOC+8ZwReE4ZuW7xPcIuAQAh+QQFFAAGACwAAAAADAAMAAADKGi61fuqFfgkayPrwKXeHfYNXECcQroA7EmkwtqiqsICrgXlzn7qjwQAOw==) no-repeat white !important; }\
		a.adh-download { background: url(data:image/gif;base64,R0lGODlhDAAMALMKAHi2EqnbOnqzKFmbHYS7J3CrJFmOGWafHZLELaLVL////wAAAAAAAAAAAAAAAAAAACH5BAEAAAoALAAAAAAMAAwAAAQ7UElDq7zKpJ0MlkMiAMnwKSFBlGe6mtIhH4mazDKXIIh+KIUdb5goXAqBYc+IQfKKJ4UgERBEJQIrJgIAOw==) no-repeat white !important; }\
		a.adh-magnet { ' + (s.magnet || GM_getValue('magnet') || !inserted ? '' : 'display:none!important;') + ' }\
		a.adh-error { background:url(data:image/gif;base64,R0lGODlhDAAMAIAAAP///8wzACH5BAAAAAAALAAAAAAMAAwAAAIRjI+pGwBsHGwPSlvnvIzrfxQAOw==) no-repeat !important; }';
}

function insertBar() {
	updateStyle();
	var bar = document.createElement('div');
	bar.id = 'adh-bar';
	bar.textContent = 'Unrestricted direct link : ';
	var a = document.createElement('a');
	a.href = location.href;
	bar.appendChild(a);
	document.body.appendChild(bar);
	insertIcons(a);
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();
}

function onWebClick(e) {
	if(e.which > 2) return;
	drop(e);
	var sel = window.getSelection();
	if(e.altKey) {
		pickServ(e.target);
		this.classList.remove('adh-error');
		this.classList.add('adh-ready');
		this.title = '';
	} else if(sel.rangeCount && sel.getRangeAt(0).toString()) {
		var list = document.body.querySelectorAll('a.adh-link:not(.adh-download)');
		for(var i = list.length, a; i-- && (a = list[i]);) {
			if(sel.containsNode(a.previousSibling, true)) unlock(a, false, true);
		}
	} else if(e.which == 2) {
		unlock(this, false, true);
	} else {
		unlock(this, !e.ctrlKey, e.ctrlKey);
	}
}

function onMagnetClick(e) {
	e.stopPropagation();
	if(e.which != 1) return;
	if(e.altKey) return pickServ(e.target);
	var urls = (GM_getValue('magnet') || servs[serv].magnet || '').split('|'), param = encodeURIComponent(this.previousSibling.href);
	for(var i = urls.length, url; i-- && (url = urls[i].trim());) {
		GM_openInTab(url.indexOf('%s') > -1 ? url.replace('%s', param) : url + '#' + param);
	}
}

function unlock(a, start, copy) {
	a.className = 'adh-link adh-busy';
	if(copy && !req.pending) unlock.links = [];
	req(a.previousSibling.href.replace(/https?:\/\/(hide|blank)refer.com\/\?/, ''), function(data) {
		if(data.error) {
			a.className = 'adh-link adh-error';
			a.title = data.error;
		} else {
			a.className = 'adh-link adh-download';
			a.href = data.url;
			a.removeEventListener('mousedown', onWebClick, false);
			a.removeEventListener('click', drop, false);
			a.title = data.size ? Math.round(parseInt(data.size)/1048576) + ' MB' : '';
			a.rel = 'noreferrer';
			if(copy) unlock.links.push(data.url);
			if(start) location.href = data.url;
		}
		if(!req.pending && unlock.links && unlock.links.length) {
			var data = unlock.links.join('\n');
			if(typeof GM_setClipboard == 'function')
				GM_setClipboard(data);
			else
				window.alert(data);
		}
	});
}

function req(url, f) {
	var s = servs[serv];
	var headers = {'Referer':s.ref,'Content-Type':s.post?'application/x-www-form-urlencoded; charset=UTF-8':''};
	if(typeof req.pending == 'undefined') req.pending = 0;
	req.pending++;
	GM_xmlhttpRequest({
		method: s.post ? 'POST' : 'GET',
		url: s.api(url),
		data: s.post ? s.post.replace('%s', encodeURIComponent(url)) : null,
		headers: s.headers ? s.headers(headers) : headers,
		onload:	 function(r) {
			req.pending--;
			console.log('*** DEBRID DEBUG ***\n' + r.responseText);
			try {
				f(s.parse(r.responseText));
			} catch(ex) {
				f({error:'Parse error'});
			}
		},
		onerror: function() {
			req.pending--;
			f({error:'HTTP error'});
		}
	});
}

function setServ(idx) {
	if(idx >= servs.length) idx = 0;
	serv = idx;
	GM_setValue('service', serv);
	updateStyle();
}

function pickServ(a) {
	var sel = document.createElement('select');
	var save = function() { setServ(sel.selectedIndex); if(sel.parentNode != a) sel.parentNode.replaceChild(a, sel); };
	var onClick = function(e) { if(e.target != sel) save(); };
	var onBlur  = function(e) { if(e.target == sel) save(); };
	sel.innerHTML = servs.map(function(s) { return '<option>' + s.name + '</option>' }).join('');
	sel.selectedIndex = serv;
	sel.addEventListener('click', onClick);
	sel.addEventListener('blur', onBlur);
	a.parentNode.replaceChild(sel, a);
}

function nextServ() {
	setServ(serv + 1);
}

function setMagnet() {
	var url = window.prompt('Type URL for magnet links handling, ex. http://bytebx.com/add?url=%s.\nOmit %s to activate automatic form fill. Use | to separate multiple URLs. Leave blank to restore default', GM_getValue('magnet', ''));
	if(typeof url == 'string') {
		GM_setValue('magnet', url.trim());
	}
}

function setRealDebridToken() {
	var t = window.prompt('Type private API token. You can find it here : https://real-debrid.com/apitoken', GM_getValue('realdebrid_token'));
	if(typeof t == 'string') {
		GM_setValue('realdebrid_token', t.trim());
	}
}

window.setTimeout(main, 100);
