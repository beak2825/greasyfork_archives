// ==UserScript==
// @name        Download FOX+CN+CC Videos as MP4
// @description Скачать видео каналов FOX, Cartoon Network, Comedy Central одним кликом. Прямые ссылки на видео под плеером (fox-fan.ru, cn-fan.ru, cc-fan.tv)
// @namespace   https://greasyfork.org/users/136230
// @include     *://*.fox-fan.ru/series.php*
// @include     *://*.fox-fan.tv/series.php*
// @include     *://*.cn-fan.ru/series.php*
// @include     *://*.cn-fan.tv/series.php*
// @include     *://*.cc-fan.tv/series.php*
// @include     *://*.cc-fan.ru/series.php*
// @include     *://*.fox-fan.ru/video*
// @include     *://88.150.190.2/video*
// @include     *://81.94.196.236/video*
// @include     *://109.169.87.137/video*
// @connect     fox-fan.tv
// @connect     fox-fan.ru
// @connect     cn-fan.tv
// @connect     cn-fan.ru
// @connect     cc-fan.tv
// @connect     88.150.190.2
// @connect     81.94.196.236
// @connect     109.169.87.137
// @version     1.3.1
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/33503/Download%20FOX%2BCN%2BCC%20Videos%20as%20MP4.user.js
// @updateURL https://update.greasyfork.org/scripts/33503/Download%20FOX%2BCN%2BCC%20Videos%20as%20MP4.meta.js
// ==/UserScript==

var RANDOM = 1687511;//Math.round(Math.random()*1.e6 + 1.e6);
(function(){
	var clog = console.log;
    var { hostname, pathname } = window.location;
    clog('fox-cn-cc-downloader', self === top ? 'top' : 'child', hostname + pathname);
    function DOMReady(callback){
        var handler = {};
        var promise = new Promise(function(resolve){
            handler.resolve = resolve;
        });
        var fn = function(){
            handler.resolve();
            if (typeof callback === 'function') {
                callback();
            }
        };
        switch (document.readyState) {
            case 'loading':
                document.addEventListener('DOMContentLoaded', function(e){ fn(e); });
                break;
            default:
                setTimeout(fn, 10);
        }
        return promise;
    }
	var userOptions = initOptions();
	userOptions.set({
		'delim': ' - ',
		'space': ' ', 
		'addEpisodeEng': true,// добавить англ. название эпизода
		'delay': 500,
	});
	var isSource = downloadFromSource();
	if( isSource )
		return;
	else
		document.addEventListener('DOMContentLoaded', start, false);
	function downloadFromSource()
	{
		var hash = window.location.hash,
			json, name, source;
		if( hash )
		{
			json = hash.slice(1);
			json = decodeURIComponent(json);
            try {
                json = json ? JSON.parse(json) : {};
            } catch (e) {
                json = {};
            }
            clog('download data: ', json);
            source = json.source;
            name = json.name;
			// source = window.location.origin + window.location.pathname;
			//alert("name: " + name + "\nsource: " + source);
		}else
			return false;
		if( source && name && /\.mp4$/.test(name) )
		{
			var sendMessage = function(){
                clog('send message', 'close-iframe');
                window.parent.postMessage({msg: 'close-iframe', 'id': window.self.name,}, '*');
            }, closeWindow = function(){
                clog('close window', window.location.href);
                window.close();
            }, videoClose = function(){
                clog('close video');
				remove(document.querySelector('video'));
				if( window.self !== window.parent )
					setTimeout( sendMessage, userOptions.val('delay') );
				else
					setTimeout( closeWindow, userOptions.val('delay') );
			};
            clog('dom.readyState: ', document.readyState);
            DOMReady(function(){
				fileDownloader(name, source, videoClose);
				var video = document.querySelector('video');
				if( video ) video.addEventListener('error', videoClose, false);
            });
			// document.addEventListener('readystatechange', function(event){
                // clog('document.readyState: ', this.readyState);
				// if( this.readyState === 'interactive' )
				// {
					// fileDownloader(name, source);
					// var video = document.querySelector('video');
					// if( video ) video.addEventListener('error', videoClose, false);
				// }
				// else if( this.readyState === 'complete' )
					// videoClose();
			// }, false);
			return true;
		}
		return false;
	}
	function fileDownloader( name, resource, callback )
	{
		var a = document.createElement('a'),
			body = document.body || document.getElementsByTagName('body')[0];
		a.href = resource;
		a.setAttribute('download', name);
		body.appendChild(a);
		a.click();
        setTimeout(function(){
            body.removeChild(a);
            if (typeof callback === 'function') {
                callback();
            }
        }, 10);
	}
	function start()
	{
		console.log("start Download FOX+CN+CC Videos as MP4..");
		getLinks();
		showDetail('description');// описание
		//showAll();
	}
	function getLinks()
	{
		var links = document.querySelectorAll('div#voice a');
		for( var i = 0, href; i < links.length; ++i)
		{
			href = links[i].href;
            clog('makeRequest', href);
			GM.xmlHttpRequest({
				url: href,
				method: 'GET',
				onload: handleXHR,
			});
		}
	}
	function handleXHR( xhr )
	{
		var doc = document.implementation.createHTMLDocument("");
		doc.documentElement.innerHTML = xhr.responseText;
		setLink(doc, xhr.finalUrl);
	}
	function setLink(doc, url)
	{
		doc = doc || document;
		var script = doc.querySelector('#centerSeries > script'),
			video_obj, video_src, subt, div, video_div, video_link, file_name, player;
		if( !script )
		{
			player = doc.querySelector('div[id*="player"]');
			if( player )
				script = player.nextElementSibling;
		}
        video_obj = script ? getVideoObject( script.innerHTML ) : null;
        if( video_obj )
        {
            video_src = video_obj.file;
            subt = video_obj.subtitle;
        }
        if( !video_src )
        {
            player = doc.querySelector('div[id*="player"]');
            video_div = player ? player.querySelector('video') : null;
            video_src = video_div ? video_div.src : null;
        }
        if( !video_src )
        {
            var _scripts = doc.querySelectorAll('script');
            _scripts = [].filter.call(_scripts, function(s){ return !s.src; });
            _scripts.forEach(function(s, i){
                var html = s.innerHTML || '';
                var idx = html.indexOf('player.api(');
                if (idx === -1) {
                    return;
                }
                html = html.split('\n').join(' ');
                var match = html.match(/player\.api\([^\)]+\)/g);
                if (!match) {
                    return;
                }
                match = [].slice.call(match);
                match = match.map(function(s){
                    s = s.replace(/^(player\.api\()([^\)]+)(\))$/, function(m, p1, p2, p3){
                        return p2.replace(/'/g, '"');
                    });
                    return JSON.parse('[' + s + ']');
                });
                match = match.reduce(function(acc, cur){
                    if (cur.indexOf('play') !== -1) {
                        if (!acc.play) {
                            acc.play = cur;
                        } else if (Array.isArray(acc.play)) {
                            acc.play.push.apply(acc.play, cur);
                        } else {
                            acc.play = [acc.play, cur];
                        }
                    }
                    if (cur.indexOf('subtitle') !== -1) {
                        if (!acc.subtitle) {
                            acc.subtitle = cur;
                        } else if (Array.isArray(acc.subtitle)) {
                            acc.subtitle.push.apply(acc.subtitle, cur);
                        } else {
                            acc.subtitle = [acc.subtitle, cur];
                        }
                    }
                    return acc;
                }, {});
                if (match.play) {
                    video_src = match.play.find(function(item){
                        return /^((https?)?\:)?\/\/([^\/]+)([^?]+)?([^#]+)?(.*)$/.test(item);
                    });
                }
                if (match.subtitle) {
                    subt = match.subtitle.find(function(item){
                        return /^((https?)?\:)?\/\/([^\/]+)([^?]+)?([^#]+)?(.*)$/.test(item);
                    });
                }
            });
        }
        clog('video_src: ', video_src);
        clog('subtitles: ', subt);
		if( video_src )
		{
			div = document.getElementById('video-links-' + RANDOM) || createVideoDiv('video-links-' + RANDOM);
			video_div = document.createElement('div');
			file_name = getFileName(doc);
			clog("file name: " + file_name);
			video_div.innerHTML = '<a href="' + video_src + '" title="Скачать" ' +
				'data-file-name="' + file_name + '" data-file-ext="mp4" data-file-source="' + video_src + '" ' +
				(subt ? ('data-subtitle="' + subt + '"') : '') + ' ' +
				'class="video-link">' + file_name + '</a>';
			div.appendChild( video_div );
			video_link = video_div.querySelector('a');
			video_link.addEventListener('click', handleDownloadEvent, false);
            clog('makeRequest HEAD ', video_src);
			GM.xmlHttpRequest({
				url: video_src,
				method: 'HEAD',
				context: {url: video_src},
				onload: function(xhr){
					if( xhr.status != 200 )
					{
						console.error("Error: xhr.status = ", xhr.status, xhr.statusText);
						return;
					}
					var videoSize = getContentLength(xhr.responseHeaders),
						smartSize = "" + (videoSize/(1024*1024)).toFixed(1) + " Mb";
					video_link.setAttribute('title', "Скачать, " + smartSize );
					console.log("source: ", xhr.context.url, "size: ", smartSize);
				},
			});
		}else{
			console.error("can't find video source");
		}
	}
	function getContentLength(headersStr)
	{
		var headers = headersStr.split('\r\n');
		for( var i = 0, h; i < headers.length; ++i )
		{
			h = headers[i];
			if( h.indexOf('Content-Length') != -1 )
				return parseInt(h.match(/\d+/)[0], 10);
		}
		return 0;
	}
	function createVideoDiv( id )
	{
		var div = document.createElement('div');
		div.setAttribute('id', id);
		var html = '' +
		'<font class="size18 link_20" title="Нажмите на ссылку, чтобы скачать">Ссылки на видео</font>' +
		'<br><div id="tochki2" class="tocka"></div>';
		div.innerHTML = html;
		var insPlace = document.getElementById('4');
		return insPlace.parentNode.insertBefore( div, insPlace.nextSibling );
	}
	function getVideoObject( text )
	{
		if( !text )
			return null;
		var str = text.match(/{.*}/)[0];
		str = str.replace(/([\w]+)\:([^\/]{1})/g, function(m, p1, p2){
			return '"' + p1 + '":' + p2;
		});
		str = str.replace(/'/g, '"');
		return JSON.parse( str );
	}
	function getFileName( doc )
	{
		this.fn_count = this.fn_count || 0;
		++this.fn_count;
		var delim = userOptions.val('delim'),
			space = userOptions.val('space');
		doc = doc || document;
		var topContent = doc.querySelector('.topContent'),
			topContentDiv, topContentLinks;
		if( topContent )
		{
			topContentDiv = doc.querySelector('.topContent > div');
			topContentLinks = doc.querySelectorAll('.topContent > a');
		}else{
			topContentDiv = doc.querySelector('table.content tr > td > div');
			topContentLinks = doc.querySelectorAll('table.content tr > td > a');
		}
		var voiceId, videoId, videoIdStr,
			seasonNum, episodeNum;
		if( topContentDiv )
		{
			// ID озвучки и ID видео
			voiceId = topContentDiv.querySelector('#voice').innerHTML;
			videoId = topContentDiv.querySelector('#actual').innerHTML;
		}
		if( videoId )
		{
			var videoIdStr = videoId.toString(),
				videoIdMatch = videoIdStr.match(/(\d+)(\D)?/);
			// номер сезон и номер эпизода
			seasonNum = videoIdMatch[1].slice(0, -2);
			episodeNum = videoIdMatch[1].slice(-2) + (videoIdMatch[2] || '');
		}
		var seriesRus, episodeRus, episodeEng, voiceRus;
		if( topContentLinks )
		{
			// название серий и название эпизода (рус.)
			seriesRus = topContentLinks[1].innerText;
			var lastLink = last(topContentLinks),
				regExp = new RegExp('id=' + videoId);
			if( videoId && lastLink && regExp.test(getLocation(lastLink.href, 'search')) )
				episodeRus = lastLink.innerText;
		}
		var titleSeriesEng = doc.querySelector('#titleSeriesEng > span'),
			titleSeries = doc.querySelector('#titleSeries');
		// название эпизода (англ.)
		if( titleSeriesEng )
			episodeEng = titleSeriesEng.innerText;
		if( !episodeRus && titleSeries )
			episodeRus = titleSeries.innerText;
		var voice = doc.querySelectorAll('#voice .voiceOn a');
		if( voice )
		{
			// название озвучки (рус.)
			if( voice.length == 1 )
				voiceRus = voice[0].innerText;
			else if( voiceId !== undefined )
			{
				for( var i = 0, regExp = new RegExp('voice=' + voiceId + '\\D?'); i < voice.length; ++i )
				{
					if( regExp.test(getLocation(voice[i].href, 'search')) )
						voiceRus = voice[i].innerText;
				}
			}
		}
		var fileName = '';
		fileName += seriesRus.replace(/\s+/g, space) + delim;
		if( seasonNum )
			fileName += 'сезон' + space + padRight(seasonNum, 2, '0') + delim;
		if( episodeNum )
			fileName += 'серия' + space + padRight(episodeNum, 2, '0') + delim;
		if( episodeRus )
			fileName += episodeRus.replace(/\s+/g, space) + delim;
		else if( videoId )
			fileName += 'видео' + space + videoId + delim;
		else
			fileName += 'видео' + space + padRight(this.fn_count, 4, '0') + delim;
		if( episodeEng && userOptions.val('addEpisodeEng') )
			fileName += episodeEng.replace(/\s+/g, space) + delim;
		if( voiceRus )
			fileName += voiceRus.replace(/\s+/g, space);
		else
			fileName = fileName.slice(0, -delim.length);
		return fileName;
	}
	function handleDownloadEvent(event)
	{
		if( event.ctrlKey )
			return;
		event.preventDefault();
		var fileName = this.getAttribute('data-file-name') + '.' + this.getAttribute('data-file-ext');
		downloadFile( fileName, this.getAttribute('data-file-source') );
		var subtitle = this.getAttribute('data-subtitle'),
			subtitleExt = subtitle ? subtitle.match(/\.([^\.]+)$/)[1] : null;
		if( subtitle )
			GM_fileDownloader( this.getAttribute('data-file-name') + '.' + subtitleExt, subtitle );
	}
	function downloadFile( name, source )
	{
        var json = JSON.stringify({ source, name });
        var orig = getLocation(source, 'origin');
		if( orig === window.location.origin )
			fileDownloader( name, source );
		else{
            var hash = '#' + encodeURIComponent(json);
			clog("name: ", name);
			window.open( orig + '/videos' + hash );
			// makeIFrame( orig + '/videos' + hash );
		}
	}
	function makeIFrame( resource )
	{
		this.num = this.num || 0;
		++this.num;
		var iframe = document.createElement('iframe'),
			body = document.body || document.getElementsByTagName('body')[0];
		iframe.src = resource;
		iframe.id = 'iframe-' + this.num;
		iframe.setAttribute('name', 'iframe-' + this.num);
		iframe.setAttribute('style', 'display: none;');
		body.appendChild(iframe);
	}
	function GM_fileDownloader( name, source )
	{
		GM.xmlHttpRequest({
			url: source,
			method: 'GET',
			responseType: 'blob',
			onload: function(xhr){
				if( xhr.status !== 200 )
				{
					console.error("ERROR: status = ", xhr.status, xhr.statusText);
					console.error("url: ", this.url);
					return;
				}
				var wURL = window.webkitURL || window.URL,
					resource = wURL.createObjectURL(xhr.response);
				fileDownloader( name, resource );
				wURL.revokeObjectURL( resource );
			},
		});
	}
	function initOptions()
	{
		function _setDef( v ){this.val = this.def;}
		var retVal = {
			data: {
				'delim': {
					val: null,
					def: ' - ',
					setDef: _setDef,
				},
				'space': {
					val: null,
					def: ' ',
					setDef: _setDef,
				},
				'addEpisodeEng': {
					val: null,
					def: true,
					setDef: _setDef,
				},
				'delay': {
					val: null,
					def: 500,
					setDef: _setDef,
				},
			},
			setDefs: function(){
				for( var key in this.data )
					this.data[key].setDef();
			},
			val: function( prop, v ){
				if( this.data[prop] )
				{
					if( v !== undefined )
						this.data[prop].val = v;
					return this.data[prop].val;
				}
				return null;
			},
			set: function( obj ){
				for( var key in obj )
					this.val( key, obj[key] );
			},
		};
		retVal.setDefs();
		return retVal;
	}
	function getIDs( n )
	{
		this.ids = this.ids || ['zero1', 'zero2', 'description', 'trivia', 'parody', 'criticism', 'awards', 'censorship'];
		if( n !== undefined )
			return this.ids[n];
		return this.ids;
	}
	function showDetail( id )
	{
		var ids, n, elm;
		if( typeof id === 'number' ){
			elm = document.getElementById(id);
		}else{
			ids = getIDs();
			n = ids.indexOf(id);
			elm = document.getElementById(n);
		}
		if( elm )
			elm.style.display = 'block';
	}
	function showAll()
	{
		for( var i = 1, len = getIDs().length; i < len; ++i )
			showDetail( i );
	}
	function padRight( t, n, fill )
	{
		if( !t || !n )
			return t;
		fill = (fill === undefined ? ' ' : fill );
		t = t.toString();
		while( t.length < n )
			t = fill + t;
		return t;
	}
	function getLocation( url, prop )
	{
		var a = document.createElement('a');
		a.href = url;
		return a[prop];
	}
	function last( arr )
	{
		if( arr && arr.length > 0 )
			return arr[arr.length-1];
		return null;
	}
	function indexOfAttr( arr, attr, val )
	{
		if( !arr || !attr || !val )
			return -1;
		for( var i = 0, len = arr.length, elm; i < len; ++i )
		{
			elm = arr[i];
			if( elm[attr] == val )
				return i;
		}
		return -1;
	}
	function remove( elm )
	{
		if( elm && elm.parentNode )
			return elm.parentNode.removeChild(elm);
		return elm;
	}
	window.addEventListener('message', recieveMessage, false);
	function recieveMessage(event)
	{
		if( event.data && event.data.msg === ('close-iframe') && event.data.id )
		{
			var iframe = document.querySelector('iframe[name="' + event.data.id + '"]');
			clog("close iframe: ", iframe);
			setTimeout(function(){
				remove(iframe);
			}, userOptions.val('delay') );
		}
	}
})();