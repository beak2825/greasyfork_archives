// ==UserScript==
// @name           Debrid Download Helper
// @namespace      http://w9p.co/userscripts/
// @version        2018.6.5
// @author         kuehlschrank (updated by Ramses)
// @description    Downloads files, copies URLs and queues magnet links.
// @include        http*
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @connect-src    alldebrid.com
// @connect-src    real-debrid.com
// @connect-src    simply-debrid.com
// @connect-src    debriditalia.com
// @connect-src    premiumize.me
// @connect-src    premiumax.net
// @connect-src    simply-premium.com
// @connect-src    linksnappy.com
// @downloadURL https://update.greasyfork.org/scripts/369062/Debrid%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/369062/Debrid%20Download%20Helper.meta.js
// ==/UserScript==

'use strict';

var re = RegExp('\\b(' + [
 	'1fichier\\.com\\/\\?[a-z0-9]{10,10}',
  	'4shared\\.com\\/[a-z0-9]{3,7}\\/[a-zA-Z0-9\\-_]{8,10}',
    'big4shared\\.com\\/[a-z0-9]{12,12}',
    'bitporno\\.com\\/\\?v\\=[A-Z0-9]{10,10}',
    'cbs\\.com\\/shows\\/.+',
    'dailymotion\\.com\\/video\\/[a-z0-9]{7,7}',
	'datafile(host)\\.com\\/d\\/[a-z0-9]{8,8}',
  
    'datei\\.to\\\datei',
  
    'datoporn\\.co\\/[a-z0-9]{12,12}',
    '(deposit|d)files\\.(com|eu)\\/files\\/[a-z0-9]{9,9}',  
    'dl\\.free\\.fr\\/(getfile\\.pl\\?file\\=\\/[a-zA-Z0-9]{8,8}|[a-zA-Z0-9]{8,8})',
	'extmatrix\\.com\\/files\\/[A-Z0-9]{8,8}',
  
    'faststore\\.org\\/',
  
	'filefactory\\.com\\/file\\/([a-z0-9]{12,12}|[a-z0-9]{12,12})',
  	'filerio\\.(com|in)\\/[a-z0-9]{12,12}',
  	'filesflash\\.(com|net)\\/[a-z0-9]{8,8}',
  
    'flashx\\.(bz|cc|tv|ws)\\/',  
  
    'gigapeta\\.com\\/dl\\/[a-z0-9]{14,14}',
    '(docs|drive)\\.google\\.com\\/.+',
	'hitfile\\.net\\/[a-zA-Z0-9]{7,7}',
    'hulkshare\\.com\\/.+',
    'isra\\.cloud\\/[a-z0-9]{12,12}',
    'load\\.to\\/[a-zA-Z0-9]{10,10}',
    'mediafire\\.com\\/file\\/[a-z0-9]{15,15}',
	'mega\\.nz\\/#![a-zA-Z0-9\\-_!]{52,52}',
    'nitroflare\\.com\\/view\\/[A-Z0-9]{15,15}',
	'oboom\\.com\\/[A-Z0-9]{8,8}',
	'(o|open)load\\.(co|download)\\/f\\/[a-zA-Z0-9\\-_]{11,11}',
  
    'radiotunes\\.com\\/',
    '(di|sky)\\.fm',
    '(classical|jazz)radio\\.com',
  
	'rapidgator\\.net\\/file\\/[a-z0-9]{32,32}',
  
    'rapidvideo\\.com\\/',
    'redtube\\.com\\/',
    'mycanal\\.fr\\/','canalplus\\.fr\\/','(c|d)8\\.fr\\/',
    'rockfile.(co|eu)',
    'rutube\\.ru\\/video\\/',
	'salefiles\\.com\\/[a-z0-9]+',
  
    'scribd\\.com\\/.+\\/[0-9]{9,9}',
	'sendspace\\.com\\/file\\/[a-z]{6,6}',
    'share-online\\.biz\\/dl\\/[A-Z0-9]{11,11}',
    'solidfiles\\.com\\/v\\/[a-zA-Z0-9]{13,13}',
    'soundcloud\\.com\\/.+',
    'stream(ango|cherry)\\.com\\/f\\/[a-z]{16,16}',
    
    '(thevideo|vev)\\.(io|me|website)\\/',
  
  	'turbobit\\.net\\/[a-z0-9]{12,12}',
	'tusfiles\\.com\\/[a-z0-9]{12,12}',
	'uloz\\.to\\/\\![a-zA-Z0-9]{12,12}',
 	'unibytes\\.com\\/[a-z0-9\\-]{24,24}',
	'(uploaded|ul)\\.(net|to)\\/(file\\/[a-z0-9]{8,8}|[a-z0-9]{8,8})',
	'upto(box|stream)\\.com\\/[a-z0-9]{12,12}',
    'userscloud\\.com\\/[a-z0-9]{12,12}',
    'vidlox\\.tv\\/[a-z0-9]{12,12}',
    'vidoza\\.net\\/[a-z0-9]{12,12}',
    'vimeo\\.com\\/([0-9]{8,8}|.+\\/[0-9]{8,8})',
  
    'vk\\.com\\/',
  
    'youtube\\.com\\/watch\\?v\\=[a-zA-Z0-9]{11,11}',
    '(yunfile|dfpan|tadown)\\.com\\/fs\\/[a-z0-9]{15,15}',
 	'zippyshare\\.com\\/v\\/[a-zA-Z0-9]{8,8}\\/file'
	].join('|') + ')', 'i');

var servs = [
	{
		name:'AllDebrid',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAY1BMVEX5xDs3Kw0SDgQaFQYTDwQWEgUdFwb3wjr5wzoPDAMpHwlUQhMVEAX2wTrvvTiMbiHysSpaRhWxiyo9MA4yJwyUdCPquDiigCbDmS7mtTfjsjaidx0HBQLRpDK2jyuviilmUBie8orCAAAAb0lEQVQI1y3LVxIDIQwDUAOuLN6eXu9/ypjJ/umNJFBxFb1ixicAuIv4gswWWcFhxcKcO1zHLaeBWszU4ZLt9MUOkXPKaRyQOmCKAg7cdkz3f6M6WanbXrkF5loomxXGwMPasr4/iQJzJXrFNRnDD21hBL9x1rxrAAAAAElFTkSuQmCC',
		magnet:'https://alldebrid.com/torrent/',
		api:function(s) { return 'https://alldebrid.com/service.php?link=' + encodeURIComponent(s.replace(/https?(:\/\/www\.oboom\.com\/)#?([a-z0-9]+).*/i, 'https$1#$2').replace('https://www.datafile.com', 'http://www.datafile.com')) + '&nb=0&json=true&pw='; },
		ref:'https://alldebrid.com/service/',
		parse:function(text) { var o = JSON.parse(text); return {url:o.link,size:o.filesize,error:o.error}; }
	},
	{
		name:'RealDebrid',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAABEVBMVEUlJSUiISIaGhonJycdHR0pKipCQUJDQ0MzMzIBAgE6OTkwMDFubWknKCgxNTEpLCwqKSZKSkoUExoLJBI/Pz+GhX49PTu8u65nZmJ2dXDv7dionopraV8nLzImKiscKB4fHyYgMSYgMC4mJzMlLTkKCgwTIxczOywPDyMQHSQgJjs8OURUVE90gnPe3th+fnYmJClZWVfd2sq7t6iBgHj69+POzsyGknx4eHDX1cyQj4bb2tHCvreBfYLf3dR3d4Dr6dnJx7j19OzHxLZeXlz6+fBud28fHw+enYWioJLVzrmclX6lopLW09C9taTn5t+LhnklJRW0s5rX1L9ARk6urY40JRvRy7xZRDS+sqM3NjUYasLVAAAAlklEQVQI1xXBBRaCQAAFwA+C7BK2knZ3d3d33/8iPmfg9vnswr8guEGgKDyReCcviQgsOuUqRLkhSwTabFofWdZZbakidMNFT+b+QNmaH9pyfvx+drcr3fYgT+zD98t80nXfD71ZoYP7xdh0SwSBAjz58WPVLqY5MEmO8WRyWa835QDDciwXiSdi0TBAbIBLUUJBJ+/4AVyyEd2aDSSWAAAAAElFTkSuQmCC',
		headers:function(h) { var t = GM_getValue('realdebrid_token'); if(t) h['Authorization'] = 'Bearer ' + t; return h; },
		magnet:'http://www.real-debrid.com/torrents',
		api:function(s) { return 'https://api.real-debrid.com/rest/1.0/unrestrict/link'; },
		post: 'link=%s',
		ref:'https://www.real-debrid.com/',
		parse:function(text) { var o = JSON.parse(text); return {url:o.download?o.download:null,size:o.filesize,error:o.error == 'bad_token' ? 'Bad API token - Click user script command "Set RealDebrid API token"' : o.error}; }
	},
	{
		name:'SimplyDebrid',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAABC1BMVEUIZJQKZ5gAChIDKDoBIzYAJz8BFyEBDRQCHi0HWYQGUXcBQ2fI1dwJX4wFW4gALEQHRGSes70AAQrAzNMESWweR13T3eFDSk7E0dcABhjCx8olUmoAO14WZY8AR3LB2eUCFR4IVXwHY5MAX5AIU3oHUHcGTHAANFMDLEIPO1QVTWoAEBwAGSkbcZ0idJ4/XW4sNjuJprQVKDIfTmXw8vIxQkkhOkcZMj4WIScALENGcYgLOlJUd4jEy87I0tfJ0da4wMUhQFC3u77CztMsY4FGX21tf4hCiaykyNqAm6hzlqkjZYciV3N5nKxJgZ5SfJMAOGqdu8w4eJoYWHmKudFIjK6Wt8i0zNfu9fq8LLcgAAAAkUlEQVQI1yXHRRaCABQAwE+qgHSn3d3d3a33P4k8nd0AizzXJYgBABIG5+F5m2L8n9PHvdyckI+Nwv31vu5dikpSiRTY8nnHLGyapmUerCN/UHsSo1dzaehvGX1QVxVLELKQ4bocoYwIgpiXAccwDJ+OcdyQlhD0FVpD0VhN2hAhSTJfa5jmrIlC4KeiaR0R/QKsjRG4/u59hgAAAABJRU5ErkJggg==',
		api:function(s) { return 'http://simply-debrid.com/inc/name.php?i=' + encodeURIComponent(btoa(s.replace('//ul.to/', '//uploaded.net/file/').replace('//rg.to/', '//rapidgator.net/file/'))); },
		ref:'http://simply-debrid.com/generate',
		parse:function(text) { var m = /href="(.+?)"/.exec(text); var url = m ? m[1] : null; return {url:url,size:0,error:url?null:text}; }

	},
	{
		name:'DebridItalia',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAulBMVEUxNDstMDYqLTRLTVInKzMuMTcsLzQwMzkuMjgyNTxHSU2SkpNBREoyNjsdISgoKzBzdHUlKS/MzMuoqawaHiZ9fX9GR0o/QUY2Oj+2trecnqGYmJpQUlh0dXgjJizAwcGLjY/ExMQ7PkOAgYTT09RDRkzR0dGdnZy4uLmvra7p6ehwcHFvcHC6urtOT1Kjo6Py8vFWWV+trq9naGloaWlbXmHMzc54eXzJycjHx8eDhYnY2NhiZWiWlpYnta2nAAAAi0lEQVQI1wXBBQKCMAAF0C8MNlaU0o2A3a33P5fvQZq8GGzLoVQplN/x/fJs5jAGyLD9hcHN1XNtYNZPVbcUcd+UEdAIizzy6HJamzA+ky9H4Z7bBcMQBvcsuGpztXXxHOs69VRVpDsbCTd5ZzAd7z0ftk8IoUaSbY4coBbAiBT54gDqUAaHQllU/QHUAAuK7if0AwAAAABJRU5ErkJggg==',
		api:function(s) { return 'http://www.debriditalia.com/api.php?generate=&link=' + escape(s); },
		ref:'http://www.debriditalia.com/downloader.php',
		parse:function(text) { var m = /http[^"><]+/.exec(text); return {url:m ? m[0] : null,size:0,error: m ? null : text}; }
	},
	{
		name:'Premiumize',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAA0lBMVEX///9jCgyMBwCjBAD38/P//vpmAgT//v3//vjl0M6DHwH++/L+10v27unpnBH8uhL/9dD67cvbvLf65qX8+fjEdGivNif75JL7+vfhpKLSoZreqJ6fFgTNPiXmtamNIxnnwrvl2NLw6el4BQJeAADYw8TZw8OPUVH64HHRd2vhd2TMaAv111rEFwDy0r3JQwC+cXn38NatGgaZLyZxFg3OLRDRvLzbtqCABQDWZ1GePj7RpKn1pgCoVVTIdBu6MgTtnSq7Tky/m5muenTGWwjqiA9I5Zs1AAAAeklEQVQI1y3LVRKDQBAE0EHC4sTd3T3BHe5/JdiB/pl5Vd1A0+4tu1CH78/O8/I2KKTp7XcCIE3Eh3s/Qey0sJdYvgbHAUH8U1e7qnQiKqYT25GqAMUryMLcu2NnuPrqhvEYIfgdI+sXblJhz2xllh0jyPogCJuFVL4F9o4KBP9q9U4AAAAASUVORK5CYII=',
		magnet:'https://www.premiumize.me/downloader',
		api:function(s) { return 'https://www.premiumize.me/filehost/getlink'; },
		post:'link=%s',
		ref:'https://www.premiumize.me/downloader',
		parse:function(text) { var o = JSON.parse(text), error = o.status == 'error' ? o.message : null; return {url:o.link,size:0,error:error}; }
	},
	{
		name:'Premiumax',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAABPlBMVEUAAACSVAXLV0i8KgLZcyfmgg/deg+8awpjOQS3ZwbQXVG+JwHWcDTfeR7NXlHGWEjMXVK5EgC4GQDNYkHMYkrbcTnNZjTKYUrZcy3ceBzUbzLbeRTANhbFQwPgbznUVwDDNgDHRQHpagPEZgzedS6+YgbkeynVbQbscwDDcAT0iwP9+PTuhITfVVXHAgL46bvOcHPtZGPJUlW6EgC1DwC7AAD38uz5/OP28tr059Dxz8ro2sX59cTy2MPq0r/0ubbv3bH7/a769qr87aX64p7to5fvtZPmsY/fqY3m2Yflg4Thn3/myHzve3rqr3niwnbcg3bgdXXRm27ZcG3ioGPRXmDKWFnfblPWUlPXUlLkY0bYcETMLSrgOCLaLxzKKxjRKBa0MRW7HhPOExHaFwy/DwvbDwjTCgW6AAHJAADpAk/dAAAAK3RSTlMACP3zvpFwPyAf/v78/Pv5+PXw7+zr6Obm5tjY1tPOzMjGpqWkjo1zcxoYB9ujWwAAAJlJREFUCNcVzkMCwwAUANGf2ratoGFt27Zx/wu0eatZDvwlxDaVQ4IATyoyaRQ6a0jOt5ne4Di+pT1yiItWUwyjKKxHRkBsXObQ1LCMoqQL7IJ5Np9pFkvpgx7Ugkmhk0y2W5U7A05tv7qu13aNEWEAiWU2Pg0Wx+6e8wESvN7el8fr/GRjADIv8yG+BMcG+AdZ2C1UCv1RBH6krhivzCpNqAAAAABJRU5ErkJggg==',
		api:function(s) { return 'http://www.premiumax.net/direct_link.html?rand=0.' + Date.now(); },
		post:'urllist=%s&captcka=&key=indexKEY',
		ref:'http://www.premiumax.net/download.html',
		parse:function(text) { var m = /href=['"](http.+?)['"]/.exec(text); var url = m ? m[1] : null, error = null; if(!url) { var tmp = document.createElement('span'); tmp.innerHTML = text; error = tmp.textContent; } return {url:url,size:0,error:error}; }
	},
	{
		name:'SimplyPremium',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEUAAADdnQDgnwDSlQCPZACbbQB4VQAlGgDlowCHXwBkRgASDQDMkAC+hgCzfwCjcwB8WAB1UwBUPAA/LQAzJAAjGQBhZ8vpAAAAR0lEQVQI143LNxLAMAhEURYboeAc7n9Vy8wgtfoNvGLp7xLJ5B0xzg2BMYKzQzUBomrImGocyEpcf/HNDmzFUdblpdZz2/kAZT4Bdyi6308AAAAASUVORK5CYII=',
		magnet:'https://www.simply-premium.com/torrent.php',
		api:function(s) { return 'https://www.simply-premium.com/premium.php?info&link=' + encodeURIComponent(s); },
		ref:'https://www.simply-premium.com/download.php',
		parse:function(text) { var errors = [0, 'Key invalid', 'Key invalid', 'Traffic exceeded', 'Too many connections', 'Account expired', 'Link invalid', 'Code 7', 'Hoster unavailable', 'File unavailable', 'Hoster unsupported', 'Hoster under maintenance'], url = /<download>(.+?)<\/download>/.exec(text) ? RegExp.$1 : null, code = /<code>(.+?)<\/code>/.exec(text) ? parseInt(RegExp.$1) : -1, error = errors[code]; if(code && !error) error = 'Error ' + code; return {url:url,size:0,error:error}; }
	},
	{
		name:'LinkSnappy',
		icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAnFBMVEX19/f////M19bX4uHR3NvO2dhzdHT+///8///8/f35/Pz3+fnV4N/Cw8Ps8PDd6unT3t3Czcz19vbZ2trS1dXNzs64v76iq6qpqqqdpaSAhoZ7goFscnJkZ2dgY2NbYF9WW1va5OPe39/ExcW5xMO/wMCvuLiqr66ZoaCSmZmQmJePkJCIkI+FjIuAgYF6gH95enp0dXVyc3NsbW0ERuWMAAAAfklEQVQI1y3MRwKDIBBA0WGAICUC9q7pvd//bjHR5Vv8DxAJFQEIIWQIIItYgUzvz4QCkM8uUOs2TjwfsVgGpLgQw3GCTLsVxxlaP3pkE0jITD3gv9lohtw21e/2yigiun1vRrwP1jBqzw0Frdquuub1bdgyCF1Wlrk/nrzDLz1YCFq77KLBAAAAAElFTkSuQmCC',
		api:function(s) { var json = JSON.stringify({link:s,type:'',linkpass:''}); return 'https://linksnappy.com/api/linkgen?genLinks=' + encodeURIComponent(json); },
		ref:'https://linksnappy.com/download',
		parse:function(text) { var o = JSON.parse(text), error = null; if(o.status && o.status.toUpperCase() == 'ERROR') error = o.error; else if(o.links[0].status != 'OK') error = o.links[0].error; return {url:error?null:o.links[0].generated,size:0,error:error}; }
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
