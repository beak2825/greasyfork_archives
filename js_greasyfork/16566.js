// ==UserScript==
// @name            ViewTube+
// @version         2024.07.10
// @description     Watch videos from video sharing websites without Flash Player.
// @author          sebaro
// @namespace       http://sebaro.pro/viewtube
// @icon            https://gitlab.com/sebaro/viewtube/raw/master/viewtube.png
// @include         http://video.repubblica.it/*
// @include         https://video.repubblica.it/*
// @include         http://*.gelocal.it/*
// @include         https://*.gelocal.it/*
// @include         http://video.corriere.it/*
// @include         https://video.corriere.it/*
// @include         http://www.altoadige.it/*
// @include         https://www.altoadige.it/*
// @include         http://www.ilfattoquotidiano.it/*
// @include         https://www.ilfattoquotidiano.it/*
// @include         http://www.mediasetplay.mediaset.it/*
// @include         https://www.mediasetplay.mediaset.it/*
// @include         http://www.youreporter.it/*
// @include         https://www.youreporter.it/*
// @include         https://drive.google.com/file/d/*
// @include         https://docs.google.com/file/d/*
// @include         http://areena.yle.fi/*
// @include         https://areena.yle.fi/*
// @include         http://archive.org/*
// @include         http://www.archive.org/*
// @include         https://archive.org/*
// @include         https://www.archive.org/*
// @include         http://streamable.com/*
// @include         http://www.streamable.com/*
// @include         https://streamable.com/*
// @include         https://www.streamable.com/*
// @include         http://facebook.com/*
// @include         http://www.facebook.com/*
// @include         https://facebook.com/*
// @include         https://www.facebook.com/*
// @noframes
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/16566/ViewTube%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/16566/ViewTube%2B.meta.js
// ==/UserScript==


/*

  Copyright (C) 2010 - 2024 Sebastian Luncan

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.

  Website: http://sebaro.pro/viewtube
  Contact: http://sebaro.pro/contact

*/


(function() {


// Don't run on frames or iframes
if (window.top != window.self) return;


// ==========Variables========== //

// Userscript
var userscript = 'ViewTube+';
var website = 'http://sebaro.pro/viewtube';
var contact = 'http://sebaro.pro/contact';

// Page
var page = {win: window, doc: window.document, body: window.document.body, url: window.location.href, site: window.location.hostname.match(/([^.]+)\.[^.]+$/)[1]};

// Player
var player = {};
var myPlayerWindow;
var myPlayerPanelHeight = 30;

// Features/Options
var feature = {'definition': true, 'container': true, 'openpagelink': true, 'autoplay': true, 'playdash': false, 'widesize': true, 'fullsize': true};
var option = {'embed': 'Video', 'media': 'Auto', 'definition': 'High Definition', 'container': 'MP4', 'openpagelink': false, 'autoplay': false, 'playdash': false, 'widesize': false, 'fullsize': false};

// Embed
var embedtypes = ['Video', 'Object', 'Embed', 'Protocol'];
var embedcontent = {
	'Video': '<br><br>The video should be loading. If it doesn\'t load, make sure your browser supports HTML5\'s Video and this video codec. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.',
	'Object': '<br><br>The video should be loading. If it doesn\'t load, make sure a video plugin is installed. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.<param name="scale" value="aspect"><param name="stretchtofit" value="true"><param name="autostart" value="true"><param name="autoplay" value="true">',
	'Embed': '<br><br>The video should be loading. If it doesn\'t load, make sure a video plugin is installed. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.<param name="scale" value="aspect"><param name="stretchtofit" value="true"><param name="autostart" value="true"><param name="autoplay" value="true">'
};

// Media
var mediatypes = {'MP4': 'video/mp4', 'WebM': 'video/webm', 'M3U8': 'application/x-mpegURL', 'M3U8*': 'application/vnd.apple.mpegURL', 'VLC': 'application/x-vlc-plugin', 'VLC*': 'application/x-vlc-plugin'}
if (navigator.platform.indexOf('Win') != -1) {
	mediatypes['WMP'] = 'application/x-ms-wmp';
	mediatypes['WMP*'] = 'application/x-mplayer2';
	mediatypes['QT'] = 'video/quicktime';
}
else if (navigator.platform.indexOf('Mac') != -1) {
	mediatypes['QT'] = 'video/quicktime';
}
else {
	mediatypes['Totem'] = 'application/x-totem-plugin';
	mediatypes['Xine'] = 'application/x-xine-plugin';
}
var mediakeys = ['Auto'];
for (var mediakey in mediatypes) {
	mediakeys.push(mediakey);
}

// Sources
var sources = {};

// Intervals
var intervals = [];


// ==========Functions========== //

function createMyElement(type, properties, event, listener) {
	var obj = page.doc.createElement(type);
	for (var propertykey in properties) {
		if (propertykey == 'target') obj.setAttribute('target', properties[propertykey]);
		else obj[propertykey] = properties[propertykey];
	}
	if (event && listener) {
		obj.addEventListener(event, listener, false);
	}
	return obj;
}

function modifyMyElement(obj, properties, event, listener) {
	for (var propertykey in properties) {
		if (propertykey == 'target') obj.setAttribute('target', properties[propertykey]);
		else obj[propertykey] = properties[propertykey];
	}
	if (event && listener) {
		obj.addEventListener(event, listener, false);
	}
}

function styleMyElement(obj, styles) {
	for (var stylekey in styles) {
		obj.style[stylekey] = styles[stylekey];
	}
}

function cleanMyElement(obj, hide) {
	if (hide) {
		for (var i = 0; i < obj.children.length; i++) {
			styleMyElement(obj.children[i], {display: 'none'});
		}
	}
	else {
		if (obj.hasChildNodes()) {
			while (obj.childNodes.length >= 1) {
				obj.removeChild(obj.firstChild);
			}
		}
	}
}

function getMyElement(obj, type, from, value, child, content) {
	var getObj, chObj, coObj;
	var pObj = (!obj) ? page.doc : obj;
	if (type == 'body') {
		getObj = pObj.body;
	}
	else {
		if (from == 'id') getObj = pObj.getElementById(value);
		else if (from == 'class') getObj = pObj.getElementsByClassName(value);
		else if (from == 'tag') getObj = pObj.getElementsByTagName(type);
		else if (from == 'ns') {
			if (pObj.getElementsByTagNameNS) getObj = pObj.getElementsByTagNameNS(value, type);
		}
		else if (from == 'query') {
			if (child > 0) {
				if (pObj.querySelectorAll) getObj = pObj.querySelectorAll(value);
			}
			else {
				if (pObj.querySelector)	getObj = pObj.querySelector(value);
			}
		}
	}
	chObj = (getObj && child >= 0) ? getObj[child] : getObj;
	if (content && chObj) {
		if (type == 'html' || type == 'body' || type == 'div' || type == 'option') coObj = chObj.innerHTML;
		else if (type == 'object') coObj = chObj.data;
		else if (type == 'img' || type == 'video' || type == 'embed') coObj = chObj.src;
		else coObj = chObj.textContent;
		return coObj;
	}
	else {
		return chObj;
	}
}

function appendMyElement(parent, child) {
	parent.appendChild(child);
}

function removeMyElement(parent, child) {
	parent.removeChild(child);
}

function replaceMyElement(parent, orphan, child) {
	parent.replaceChild(orphan, child);
}

function cleanMyContent(content, unesc, extra) {
	if (unesc) content = unescape(content);
	content = content.replace(/\\u0025/g, '%');
	content = content.replace(/\\u0026/g, '&');
	content = content.replace(/\\u002F/g, '/');
	content = content.replace(/\\/g, '');
	content = content.replace(/\n/g, '');
	if (extra) {
		content = content.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/&#034;/g, '\'').replace(/["“”„‘’]/g, '\'');
		content = content.replace(/&#39;/g, '\'').replace(/&#039;/g, '\'').replace(/'/g, '\'');
		content = content.replace(/&amp;/g, 'and').replace(/&/g, 'and');
		//content = content.replace(/[^\x20-\xFF]/g, '');
		content = content.replace(/[\/\|]/g, '-');
		content = content.replace(/[<>#:\*\?]/g, '');
		content = content.replace(/^\s+|\s+$/, '').replace(/\s+/g, ' ').replace(/\.+$/g, '');
	}
	return content;
}

function parseMyContent(content, pattern) {
	var parse, response;
	content = content.replace(/(\r\n|\n|\r)/gm, '');
	parse = content.match(pattern);
	if (parse) {
		response = (/g$/.test(pattern)) ? parse : parse[1];
	}
	return response;
}

function getMyContent(url, pattern) {
	var urle, data, headers, xhr, response;
	if (url.indexOf('|') != -1) {
		headers = url.split('|')[2];
		data = url.split('|')[1];
		url = url.split('|')[0];
	}
	if (data) {
		//console.log('ViewTube: POST [' + pattern + '] ' + url + '\n' + data + '\n' + headers);
		urle = btoa(url + data + headers);
		if (!sources[urle]) {
			xhr = new XMLHttpRequest();
			xhr.open('POST', url, false);
			if (data.indexOf('{') != -1) {
				xhr.setRequestHeader('Content-Type', 'application/json');
			}
			else {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			if (headers) {
				headers = JSON.parse(headers);
				if (headers['withCredentials']) {
					xhr.withCredentials = true;
					delete headers['withCredentials']
				}
				for (var header in headers) {
					xhr.setRequestHeader(header, headers[header]);
				}
			}
			try {
				xhr.send(data);
			}
			catch(e) {
			}
			sources[urle] = (xhr.responseText) ? xhr.responseText : xhr.responseXML;
		}
	}
	else {
		console.log('ViewTube: GET [' + pattern + '] ' + url + '\n' + headers);
		urle = btoa(url + headers);
		if (!sources[urle]) {
			xhr = new XMLHttpRequest();
			xhr.open('GET', url, false);
			if (headers) {
				headers = JSON.parse(headers);
				if (headers['withCredentials']) {
					xhr.withCredentials = true;
					delete headers['withCredentials']
				}
				for (var header in headers) {
					xhr.setRequestHeader(header, headers[header]);
				}
			}
			try {
				xhr.send();
			}
			catch(e) {
			}
			sources[urle] = (xhr.responseText) ? xhr.responseText : xhr.responseXML;
		}
	}
	if (sources[urle]) {
		response = sources[urle];
		if (pattern) {
			response = parseMyContent(response, pattern);
		}
	}
	return response;
}

function getMyContentOld(url, pattern, clean) {
	var myPageContent, myVideosParse, myVideosContent;
	if (!sources[url]) {
		var XHRequest = new XMLHttpRequest();
		XHRequest.open('GET', url, false);
		XHRequest.send();
		sources[url] = (XHRequest.responseText) ? XHRequest.responseText : XHRequest.responseXML;
		//console.log('Request: ' + url + ' ' + pattern);
		//console.log(sources[url]);
	}
	if (pattern == 'TEXT') {
		myVideosContent = sources[url];
	}
	else {
		myPageContent = (sources[url]) ? sources[url] : '';
		if (clean) myPageContent = cleanMyContent(myPageContent, true);
		myVideosParse = myPageContent.match(pattern);
		myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
	}
	return myVideosContent;
}

function createMyPlayer() {
	/* The Content */
	player['contentWidth'] = player['playerWidth'];
	player['contentHeight'] = player['playerHeight'] - myPlayerPanelHeight;
	player['playerContent'] = createMyElement('div');
	styleMyElement(player['playerContent'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px', position: 'relative', color: '#AD0000', backgroundColor: '#000000', fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'bold', textAlign: 'center'});
	appendMyElement(player['playerWindow'], player['playerContent']);

	/* The Video Thumbnail */
	if (player['videoThumb']) {
		player['contentImage'] = createMyElement('img', {src: player['videoThumb'], title: '{Click to start video playback}'}, 'click', function() {
			if (player['showsOptions'] && option['embed'] != 'Protocol') {
				player['showsOptions'] = false;
			}
			playMyVideo(!player['isPlaying']);
		});
		styleMyElement(player['contentImage'], {maxWidth: '100%', maxHeight: '100%', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', margin: 'auto', border: '0px', cursor: 'pointer'});
		player['contentImage'].addEventListener('load', function() {
			if (page.site == 'youtube') {
				if (this.width < 300) {
					player['videoThumb'] = this.src.replace('maxresdefault', 'mqdefault');
					this.src = player['videoThumb'];
				}
			}
			if (this.width/this.height >= player['contentWidth']/player['contentHeight']) {
				this.style.width = '100%';
			}
			else {
				this.style.height = '100%';
			}
		}, false);
	}

	/* The Panel */
	player['playerPanel'] = createMyElement('div');
	styleMyElement(player['playerPanel'], {width: player['playerWidth'] + 'px', height: myPlayerPanelHeight + 'px', fontFamily: 'sans-serif', fontSize: '10px', lineHeight: (myPlayerPanelHeight - 2) + 'px', backgroundColor: '#000000', textAlign: 'center', boxSizing: 'content-box'});
	appendMyElement(player['playerWindow'], player['playerPanel']);

	/* Panel Logo */
	player['panelLogo'] = createMyElement('div', {title: '{ViewTube: click to visit the script wesite}', textContent: userscript}, 'click', function() {
		page.win.location.href = website;
	});
	styleMyElement(player['panelLogo'], {display: 'inline-block', color: '#E24994', fontSize: '14px', fontWeight: 'bold', border: '1px solid #E24994', borderRadius: '2px', padding: '0px 4px', lineHeight: 'normal', verticalAlign: 'middle', marginRight: '10px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['panelLogo']);

	/* Panel Video Menu */
	player['videoMenu'] = createMyElement('select', {title: '{Videos: select the video format for playback}'}, 'change', function() {
		player['videoPlay'] = this.value;
		if (player['isSaving']) {
			cleanMyElement(player['buttonSaveLink'], false);
			player['isSaving'] = false;
		}
		if (player['isPlaying']) playMyVideo(option['autoplay']);
	});
	styleMyElement(player['videoMenu'], {display: 'inline-block', maxWidth: '50%', height: '20px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', padding: '0px 3px', overflow: 'hidden', border: '1px solid #777777', color: '#CCCCCC', backgroundColor: '#000000', lineHeight: 'normal', verticalAlign: 'middle', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['videoMenu']);
	if (feature['openpagelink']) {
		player['videoList']['Page Link'] = page.url;
	}
	var videosProgressive = [];
	var videosAdaptiveHLS = [];
	var videosAdaptiveDASHVideo = [];
	var videosAdaptiveDASHAudio = [];
	var videosAdaptiveDASHMuxed = [];
	var videosExtra = [];
	for (var videoCode in player['videoList']) {
		if (videoCode.indexOf('Video') != -1) videosAdaptiveDASHVideo.push(videoCode);
		else if (videoCode.indexOf('Audio') != -1) videosAdaptiveDASHAudio.push(videoCode);
		else if (player['videoList'][videoCode] == 'DASH') videosAdaptiveDASHMuxed.push(videoCode);
		else if (videoCode.indexOf('M3U8') != -1) videosAdaptiveHLS.push(videoCode);
		else if (videoCode.indexOf('MP4') != -1 || videoCode.indexOf('WebM') != -1) videosProgressive.push(videoCode);
		else videosExtra.push(videoCode);
	}
	if (videosProgressive.length > 0) {
		for (var i = 0; i < videosProgressive.length; i++) {
			player['videoItem'] = createMyElement('option', {value: videosProgressive[i], textContent: videosProgressive[i]});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(player['videoMenu'], player['videoItem']);
		}
	}
	if (videosAdaptiveHLS.length > 0) {
		player['videoItem'] = createMyElement('option', {value: 'HLS', textContent: 'HLS'});
		styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		player['videoItem'].disabled = 'disabled';
		appendMyElement(player['videoMenu'], player['videoItem']);
		for (var i = 0; i < videosAdaptiveHLS.length; i++) {
			player['videoItem'] = createMyElement('option', {value: videosAdaptiveHLS[i], textContent: videosAdaptiveHLS[i]});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(player['videoMenu'], player['videoItem']);
		}
	}
	if (videosAdaptiveDASHVideo.length > 0) {
		player['videoItem'] = createMyElement('option', {value: 'DASH (Video Only)', textContent: 'DASH (Video Only)'});
		styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		player['videoItem'].disabled = 'disabled';
		appendMyElement(player['videoMenu'], player['videoItem']);
		for (var i = 0; i < videosAdaptiveDASHVideo.length; i++) {
			player['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHVideo[i], textContent: videosAdaptiveDASHVideo[i]});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(player['videoMenu'], player['videoItem']);
		}
	}
	if (videosAdaptiveDASHAudio.length > 0) {
		player['videoItem'] = createMyElement('option', {value: 'DASH (Audio Only)', textContent: 'DASH (Audio Only)'});
		styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		player['videoItem'].disabled = 'disabled';
		appendMyElement(player['videoMenu'], player['videoItem']);
		for (var i = 0; i < videosAdaptiveDASHAudio.length; i++) {
			player['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHAudio[i], textContent: videosAdaptiveDASHAudio[i]});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(player['videoMenu'], player['videoItem']);
		}
	}
	if (videosAdaptiveDASHMuxed.length > 0) {
		feature['playdash'] = true;
		if (option['playdash']) {
			player['videoItem'] = createMyElement('option', {value: 'DASH (Video With Audio)', textContent: 'DASH (Video With Audio)'});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
			player['videoItem'].disabled = 'disabled';
			appendMyElement(player['videoMenu'], player['videoItem']);
			for (var i = 0; i < videosAdaptiveDASHMuxed.length; i++) {
				player['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHMuxed[i], textContent: videosAdaptiveDASHMuxed[i]});
				styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
				appendMyElement(player['videoMenu'], player['videoItem']);
			}
		}
		else {
			for (var videoCode in player['videoList']) {
				if (player['videoList'][videoCode] == 'DASH') delete player['videoList'][videoCode];
			}
		}
	}
	if (videosExtra.length > 0) {
		player['videoItem'] = createMyElement('option', {value: 'Extra', textContent: 'Extra'});
		styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		player['videoItem'].disabled = 'disabled';
		appendMyElement(player['videoMenu'], player['videoItem']);
		for (var i = 0; i < videosExtra.length; i++) {
			player['videoItem'] = createMyElement('option', {value: videosExtra[i], textContent: videosExtra[i]});
			styleMyElement(player['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(player['videoMenu'], player['videoItem']);
		}
	}

	/* Panel Options Button */
	player['buttonOptions'] = createMyElement('div', {title: '{Options: click to show the available options}'}, 'click', function() {
		if (player['showsOptions']) {
			player['showsOptions'] = false;
			playMyVideo(option['autoplay']);
		}
		else {
			player['showsOptions'] = true;
			playMyVideo(false);
			createMyOptions();
		}
	});
	styleMyElement(player['buttonOptions'], {width: '1px', height: '8px', borderTop: '4px dotted #CCCCCC', borderBottom: '4px dotted #CCCCCC', borderLeft: '4px dotted #CCCCCC', display: 'inline-block', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['buttonOptions']);

	/* Panel Play Button */
	player['buttonPlay'] = createMyElement('div', {title: '{Play/Stop: click to start/stop video playback}'}, 'click', function() {
		if (player['showsOptions'] && option['embed'] != 'Protocol') {
			player['showsOptions'] = false;
		}
		playMyVideo(!player['isPlaying']);
	});
	styleMyElement(player['buttonPlay'], {width: '0px', height: '0px', display: 'inline-block', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '15px solid #CCCCCC', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['buttonPlay']);

	/* Panel Save Button */
	player['buttonSave'] = createMyElement('div', {title: '{Save: click to download the selected video format}'}, 'click', function() {
		saveMyVideo();
	});
	styleMyElement(player['buttonSave'], {width: '0px', height: '0px', display: 'inline-block', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '15px solid #CCCCCC', lineHeight: 'normal', verticalAlign: 'middle', marginTop: '1px', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['buttonSave']);

	/* Panel Save Button Link */
	player['buttonSaveLink'] = createMyElement('div', {title: '{Save: right click & save as to download the selected video format}'});
	styleMyElement(player['buttonSaveLink'], {display: 'inline-block', color: '#CCCCCC', fontSize: '14px', fontWeight: 'bold', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '5px', marginBottom: '2px', boxSizing: 'content-box'});
	appendMyElement(player['playerPanel'], player['buttonSaveLink']);

	/* Panel Widesize Button */
	if (!player['playerWideWidth']) {
		feature['widesize'] = false;
		option['widesize'] = false;
	}
	if (feature['widesize']) {
		player['buttonWidesize'] = createMyElement('div', {title: '{Widesize: click to enter player widesize or return to normal size}'}, 'click', function() {
			option['widesize'] = (option['widesize']) ? false : true;
			setMyOptions('widesize', option['widesize']);
			resizeMyPlayer('widesize');
		});
		styleMyElement(player['buttonWidesize'], {border: '2px solid #CCCCCC', display: 'inline-block', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
		if (option['widesize']) styleMyElement(player['buttonWidesize'], {width: '16px', height: '8px'});
		else styleMyElement(player['buttonWidesize'], {width: '20px', height: '10px'});
		appendMyElement(player['playerPanel'], player['buttonWidesize']);
	}

	/* Panel Fullsize Button */
	if (feature['fullsize']) {
		player['buttonFullsize'] = createMyElement('div', {title: '{Fullsize: click to enter player fullsize or return to normal size}'}, 'click', function() {
			option['fullsize'] = (option['fullsize']) ? false : true;
			setMyOptions('fullsize', option['fullsize']);
			resizeMyPlayer('fullsize');
		});
		styleMyElement(player['buttonFullsize'], {width: '20px', height: '14px', display: 'inline-block', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
		if (option['fullsize']) styleMyElement(player['buttonFullsize'], {border: '2px solid #CCCCCC'});
		else styleMyElement(player['buttonFullsize'], {border: '2px dashed #CCCCCC'});
		appendMyElement(player['playerPanel'], player['buttonFullsize']);
	}

	/* Definitions Option */
	if (player['videoDefinitions'].length < 2) feature['definition'] = false;

	/* Containers Option */
	if (player['videoContainers'].length < 2) feature['container'] = false;

	/* Resize My Player */
	if (option['widesize']) resizeMyPlayer('widesize');
	if (option['fullsize']) resizeMyPlayer('fullsize');

	/* Select The Video */
	if (feature['definition'] || feature['container'] || feature['openpagelink']) {
		if (!option['definition'] || player['videoDefinitions'].indexOf(option['definition']) == -1) option['definition'] = player['videoPlay'].replace(/Definition.*/, 'Definition');
		if (!option['container'] || player['videoContainers'].indexOf(option['container']) == -1) option['container'] = player['videoPlay'].replace(/.*\s/, '');
		selectMyVideo();
	}

	/* Play The Video */
	playMyVideo(option['autoplay']);
}

function resizeMyPlayer(size) {
	var playerWidth, playerHeight, playerIndex;

	/* Resize The Player */
	if (size == 'widesize') {
		var sidebarMargin;
		if (option['widesize']) {
			if (player['buttonWidesize']) styleMyElement(player['buttonWidesize'], {width: '16px', height: '8px'});
			playerWidth = player['playerWideWidth'];
			playerHeight= player['playerWideHeight'];
			sidebarMargin = player['sidebarMarginWide'];
			playerIndex = '2';
		}
		else {
			if (player['buttonWidesize']) styleMyElement(player['buttonWidesize'], {width: '20px', height: '10px'});
			playerWidth = player['playerWidth'];
			playerHeight= player['playerHeight'];
			sidebarMargin = player['sidebarMarginNormal'];
			playerIndex = 'auto';
		}
		if (player['sidebarWindow']) styleMyElement(player['sidebarWindow'], {marginTop: sidebarMargin + 'px'});
		styleMyElement(player['playerSocket'], {height: playerHeight + 'px'});
		styleMyElement(player['playerWindow'], {width: playerWidth + 'px', height: playerHeight + 'px'});
	}
	else if (size == 'fullsize') {
		var playerPosition;
		if (option['fullsize']) {
			playerPosition = 'fixed';
			playerIndex = '9999999999';
			playerWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
			playerHeight = page.win.innerHeight || page.doc.documentElement.clientHeight;
			if (!player['isFullsize']) {
				if (feature['widesize']) styleMyElement(player['buttonWidesize'], {display: 'none'});
				styleMyElement(player['buttonFullsize'], {border: '2px solid #CCCCCC'});
				appendMyElement(page.body, player['playerWindow']);
				styleMyElement(page.body, {overflow: 'hidden'});
				styleMyElement(page.body.parentNode, {overflow: 'hidden'});
				if (!player['resizeListener']) player['resizeListener'] = function() {resizeMyPlayer('fullsize')};
				page.win.addEventListener('resize', player['resizeListener'], false);
				player['isFullsize'] = true;
				if (player['isPlaying']) {
					if (player['contentVideo'] && player['contentVideo'].paused) player['contentVideo'].play();
				}
			}
		}
		else {
			playerPosition = 'relative';
			playerIndex = (option['widesize']) ? '2' : 'auto';
			playerWidth = (option['widesize']) ? player['playerWideWidth'] : player['playerWidth'];
			playerHeight = (option['widesize']) ? player['playerWideHeight'] : player['playerHeight'];
			if (feature['widesize']) styleMyElement(player['buttonWidesize'], {display: 'inline-block'});
			styleMyElement(player['buttonFullsize'], {border: '2px dashed #CCCCCC'});
			appendMyElement(player['playerSocket'], player['playerWindow']);
			styleMyElement(page.body, {overflow: 'auto'});
			styleMyElement(page.body.parentNode, {overflow: 'auto'});
			page.win.removeEventListener('resize', player['resizeListener'], false);
			player['isFullsize'] = false;
			if (player['isPlaying']) {
				if (player['contentVideo'] && player['contentVideo'].paused) player['contentVideo'].play();
			}
		}
		styleMyElement(player['playerWindow'], {position: playerPosition, top: '0px', left: '0px', width: playerWidth + 'px', height: playerHeight + 'px', zIndex: playerIndex});
	}

	/* Resize The Content */
	player['contentWidth'] = playerWidth;
	player['contentHeight'] = playerHeight - myPlayerPanelHeight;
	styleMyElement(player['playerContent'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px'});
	if (player['isPlaying']) {
		player['contentVideo'].width = player['contentWidth'];
		player['contentVideo'].height = player['contentHeight'];
		styleMyElement(player['contentVideo'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px'});
	}

	/* Resize The Panel */
	styleMyElement(player['playerPanel'], {width: playerWidth + 'px'});
}

function createMyOptions() {
	if (!player['optionsContent']) {
		/* Options Window */
		player['optionsContent'] = createMyElement('div');
		styleMyElement(player['optionsContent'], {width: '100%', height: '100%', position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.7)' , textAlign: 'center'});

		/* Options Object => option: [label, options, new line, change video] */
		var options = {
			'embed': ['Embed video with', embedtypes, true, false],
			'media': ['and play as/with', mediakeys, false, false],
			'definition': ['Select the definition', player['videoDefinitions'], true, true],
			'container': ['and the container', player['videoContainers'], false, true],
			'openpagelink': ['Open Page Link', ['On', 'Off'], true, true],
			'autoplay': ['Autoplay', ['On', 'Off'], true, false],
			'playdash': ['Play DASH (Video With Audio)', ['On', 'Off'], true, false]
		};

		/* Options */
		var optionsBox, optionBox, optionLabel, optionMenu, optionMenuItem;
		for (var o in options) {
			if (feature[o] === false) continue;
			if (options[o][2]) {
				optionsBox = createMyElement('div');
				styleMyElement(optionsBox, {display: 'block', padding: '20px 0px 20px 0px'});
				appendMyElement(player['optionsContent'], optionsBox);
			}
			optionBox = createMyElement('div');
			styleMyElement(optionBox, {display: 'inline-block'});
			optionLabel = createMyElement('div', {textContent: options[o][0]});
			styleMyElement(optionLabel, {display: 'inline-block', color: '#CCCCCC', marginRight: '10px', verticalAlign: 'middle'});
			optionMenu = createMyElement('select', {id: 'viewtube-option-' + o}, 'change', function() {
				var id = this.id.replace('viewtube-option-', '');
				if (this.value == 'On' || this.value == 'Off') {
					option[id] = (this.value == 'On') ? true : false;
				}
				else {
					option[id] = this.value;
				}
				setMyOptions(id, option[id]);
				if (options[id][3]) {
					if (player['isSaving']) {
						cleanMyElement(player['buttonSaveLink'], false);
						player['isSaving'] = false;
					}
					selectMyVideo();
				}
			});
			styleMyElement(optionMenu, {display: 'inline-block', width: 'auto', height: '20px', color: '#CCCCCC', backgroundColor: '#000000', border: '1px solid #777777', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', marginRight: '10px', verticalAlign: 'middle'});
			appendMyElement(optionBox, optionLabel);
			appendMyElement(optionBox, optionMenu);
			appendMyElement(optionsBox, optionBox);
			for (var i = 0; i < options[o][1].length; i++) {
				optionMenuItem = createMyElement('option', {value: options[o][1][i], textContent: options[o][1][i]});
				styleMyElement(optionMenuItem, {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
				appendMyElement(optionMenu, optionMenuItem);
			}
			if (optionMenu.value == 'On' || optionMenu.value == 'Off') {
				if (option[o]) optionMenu.value = 'On';
				else optionMenu.value = 'Off';
			}
			else {
				optionMenu.value = option[o];
			}
		}
	}
	if (!player['contentImage']) cleanMyElement(player['playerContent'], false);
	appendMyElement(player['playerContent'], player['optionsContent']);
}

function setMyOptions(key, value) {
	key = page.site + '_' + userscript.toLowerCase() + '_' + key;
	try {
		localStorage.setItem(key, value);
		if (localStorage.getItem(key) == value) return;
		else throw false;
	}
	catch(e) {
		var date = new Date();
		date.setTime(date.getTime() + (356*24*60*60*1000));
		var expires = '; expires=' + date.toGMTString();
		page.doc.cookie = key + '=' + value + expires + '; path=/';
	}
}

function getMyOptions() {
	for (var opt in option) {
		var key = page.site + '_' + userscript.toLowerCase() + '_' + opt;
		try {
			if (localStorage.getItem(key)) {
				option[opt] = localStorage.getItem(key);
				continue;
			}
			else throw false;
		}
		catch(e) {
			var cookies = page.doc.cookie.split(';');
			for (var i=0; i < cookies.length; i++) {
				var cookie = cookies[i];
				while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
				option[opt] = (cookie.indexOf(key) == 0) ? cookie.substring(key.length + 1, cookie.length) : option[opt];
			}
		}
	}
	if (!option['embed'] || embedtypes.indexOf(option['embed']) == -1) option['embed'] = embedtypes[0];
	if (!option['media'] || mediakeys.indexOf(option['media']) == -1) option['media'] = mediakeys[0];
	var boolOptions = ['openpagelink', 'autoplay', 'playdash', 'widesize', 'fullsize'];
	for (var i = 0; i < boolOptions.length; i++) {
		option[boolOptions[i]] = (option[boolOptions[i]] === true || option[boolOptions[i]] == 'true') ? true : false;
	}
}

function selectMyVideo() {
	if (option['openpagelink']) {
		player['videoPlay'] = 'Page Link';
	}
	else {
		var vdoCont = (option['container'] != 'Any') ? [option['container']] : player['videoContainers'];
		var vdoDef = player['videoDefinitions'];
		var vdoList = {};
		for (var vC = 0; vC < vdoCont.length; vC++) {
			if (vdoCont[vC] != 'Any') {
				for (var vD = 0; vD < vdoDef.length; vD++) {
					var format = vdoDef[vD] + ' ' + vdoCont[vC];
					if (!vdoList[vdoDef[vD]]) {
						for (var vL in player['videoList']) {
							if (vL == format) {
								vdoList[vdoDef[vD]] = vL;
								break;
							}
						}
					}
				}
			}
		}
		var vdoDef2 = [];
		var keepDef = false;
		for (var vD = 0; vD < vdoDef.length; vD++) {
			if (vdoDef[vD] == option['definition'] && keepDef == false) keepDef = true;
			if (keepDef == true) vdoDef2.push(vdoDef[vD])
		}
		for (var vD = 0; vD < vdoDef2.length; vD++) {
			if (vdoList[vdoDef2[vD]]) {
				player['videoPlay'] = vdoList[vdoDef2[vD]];
				break;
			}
		}
	}
	player['videoMenu'].value = player['videoPlay'];
}

function playDASHwithVLC() {
	var contentVideo = player['videoList'][player['videoPlay'].replace('Definition', 'Definition Video')];
	var contentAudio = player['videoList']['High Bitrate Audio WebM'] || player['videoList']['Medium Bitrate Audio WebM']
											|| player['videoList']['Medium Bitrate Audio MP4'] || player['videoList'][player['videoPlay'].replace('Definition', 'Definition Audio')];
	if (option['media'] == 'VLC*') {
		player['contentVideo'] = createMyElement('embed', {id: 'vtVideo', type: mediatypes[option['media']], target: contentVideo, innerHTML: embedcontent['Embed']});
		player['contentAudio'] = createMyElement('embed', {id: 'vtVideo', type: mediatypes[option['media']], target: contentAudio});
	}
	else {
		player['contentVideo'] = createMyElement('embed', {id: 'vtVideo', type: mediatypes[option['media']], src: contentVideo, innerHTML: embedcontent['Embed']});
		player['contentAudio'] = createMyElement('embed', {id: 'vtVideo', type: mediatypes[option['media']], src: contentAudio});
	}
	styleMyElement(player['contentAudio'], {position: 'absolute', zIndex: '-1', width: '1px', height: '1px'});
	appendMyElement(player['playerContent'], player['contentAudio']);
	player['contentVLCInit'] = page.win.setInterval(function() {
		if (player['contentAudio'].wrappedJSObject.playlist && player['contentVideo'].wrappedJSObject.playlist
			&& player['contentAudio'].wrappedJSObject.input && player['contentVideo'].wrappedJSObject.input) {
			player['contentVLCVideoPosition'] = 0;
			player['contentVLCSync'] = page.win.setInterval(function() {
				if (!player['contentVideo'] || !player['contentVideo'].wrappedJSObject || !player['contentVideo'].wrappedJSObject.input) {
					page.win.clearInterval(player['contentVLCSync']);
				}
				if (player['contentVideo'].wrappedJSObject.input.time != player['contentVLCVideoPosition']) {
					if (Math.abs(player['contentVideo'].wrappedJSObject.input.time - player['contentAudio'].wrappedJSObject.input.time) >= 500) {
						player['contentAudio'].wrappedJSObject.input.time = player['contentVideo'].wrappedJSObject.input.time;
					}
					player['contentVLCVideoPosition'] = player['contentVideo'].wrappedJSObject.input.time;
				}
				if (player['contentVideo'].wrappedJSObject.input.state == '4') {
					player['contentAudio'].wrappedJSObject.playlist.pause();
					player['contentAudioPaused'] = true;
				}
				if (player['contentVideo'].wrappedJSObject.input.state == '6') {
					player['contentAudio'].wrappedJSObject.playlist.pause();
					player['contentAudioPaused'] = true;
				}
				if (player['contentVideo'].wrappedJSObject.input.state == '3' && player['contentAudioPaused']) {
					player['contentAudio'].wrappedJSObject.playlist.play();
					player['contentAudioPaused'] = false;
				}
			}, 1000);
			page.win.clearInterval(player['contentVLCInit']);
		}
	}, 500);
}

function playDASHwithHTML5() {
	var contentVideo = player['videoList'][player['videoPlay'].replace('Definition', 'Definition Video')];
	var contentAudio = player['videoList']['High Bitrate Audio WebM'] || player['videoList']['Medium Bitrate Audio WebM']
											|| player['videoList']['Medium Bitrate Audio MP4'] || player['videoList'][player['videoPlay'].replace('Definition', 'Definition Audio')];
	player['contentVideo'] = createMyElement('video', {id: 'vtVideo', type: mediatypes[player['videoPlay'].replace(/.*\s/, '')], src: contentVideo, controls: 'controls', autoplay: 'autoplay', innerHTML: embedcontent['Video']});
	player['contentAudio'] = createMyElement('video', {id: 'vtVideo', type: mediatypes[player['videoPlay'].replace(/.*\s/, '')], src: contentAudio, autoplay: 'autoplay'});
	player['contentAudio'].pause();
	player['contentVideo'].addEventListener('play', function() {
		player['contentAudio'].play();
	}, false);
	player['contentVideo'].addEventListener('pause', function() {
		player['contentAudio'].pause();
	}, false);
	player['contentVideo'].addEventListener('ended', function() {
		player['contentVideo'].pause();
		player['contentAudio'].pause();
	}, false);
	player['contentVideo'].addEventListener('timeupdate', function() {
		if (player['contentAudio'].paused && !player['contentVideo'].paused) {
			player['contentAudio'].play();
		}
		if (Math.abs(player['contentVideo'].currentTime - player['contentAudio'].currentTime) >= 0.30) {
			player['contentAudio'].currentTime = player['contentVideo'].currentTime;
		}
	}, false);
	styleMyElement(player['contentAudio'], {display: 'none'});
	appendMyElement(player['contentVideo'], player['contentAudio']);
}

function playMyVideo(play) {
	if (play) {
		if (option['embed'] == 'Protocol') {
			if (player['videoList'][player['videoPlay']] != 'DASH') {
				page.win.location.href = 'viewtube:' + player['videoList'][player['videoPlay']];
			}
			else {
				var contentVideo = player['videoList'][player['videoPlay'].replace('Definition', 'Definition Video')];
				var contentAudio = player['videoList']['High Bitrate Audio WebM'] || player['videoList']['Medium Bitrate Audio WebM']
														|| player['videoList']['Medium Bitrate Audio MP4'] || player['videoList'][player['videoPlay'].replace('Definition', 'Definition Audio')];
				page.win.location.href = 'viewtube:' + contentVideo + 'SEPARATOR' + contentAudio;
			}
			return;
		}
		player['isPlaying'] = true;
		styleMyElement(player['buttonPlay'], {width: '15px', height: '15px', backgroundColor: '#CCCCCC', border: '0px'});
		cleanMyElement(player['playerContent'], false);
		if (player['videoList'][player['videoPlay']] == 'DASH') {
			if (option['media'] == 'VLC' || option['media'] == 'VLC*') {
				playDASHwithVLC();
			}
			else {
				playDASHwithHTML5();
			}
		}
		else {
			var videoProperties, videoType;
			if (option['media'] == 'Auto') {
				videoType = mediatypes[player['videoPlay'].replace(/.*\s/, '')];
			}
			else {
				videoType = mediatypes[option['media']];
			}
			if (option['embed'] == 'Video') {
				videoProperties = {id: 'vtVideo', type: videoType, src: player['videoList'][player['videoPlay']], controls: 'controls', autoplay: 'autoplay', poster: player['videoThumb'], innerHTML: embedcontent[option['embed']]};
			}
			else if (option['embed'] == 'Object') {
				videoProperties = {id: 'vtVideo', type: videoType, data: player['videoList'][player['videoPlay']], innerHTML: embedcontent[option['embed']]};
			}
			else if (option['embed'] == 'Embed') {
				if (option['media'] == 'VLC*') {
					videoProperties = {id: 'vtVideo', type: videoType, target: player['videoList'][player['videoPlay']], innerHTML: embedcontent[option['embed']]};
				}
				else {
					videoProperties = {id: 'vtVideo', type: videoType, src: player['videoList'][player['videoPlay']], innerHTML: embedcontent[option['embed']]};
				}
			}
			player['contentVideo'] = createMyElement(option['embed'], videoProperties);
		}
		player['contentVideo'].width = player['contentWidth'];
		player['contentVideo'].height = player['contentHeight'];
		styleMyElement(player['contentVideo'], {position: 'relative', width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px', outline: 'none'});
		appendMyElement(player['playerContent'], player['contentVideo']);
		player['contentVideo'].focus();
	}
	else {
		player['isPlaying'] = false;
		styleMyElement(player['buttonPlay'], {width: '0px', height: '0px', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '15px solid #CCCCCC', backgroundColor: '#000000'});
		cleanMyElement(player['playerContent'], false);
		if (player['contentImage']) appendMyElement(player['playerContent'], player['contentImage']);
		else showMyMessage('!thumb');
	}
}

function saveMyVideo() {
	var vdoURL = player['videoList'][player['videoPlay']];
	if (vdoURL == 'DASH') return;
	if (vdoURL == page.url) return;
	var vdoDef = ' (' + player['videoPlay'].split(' ').slice(0, -1).join('').match(/[A-Z]/g).join('') + ')';
	var vdoExt = '.' + player['videoPlay'].split(' ').slice(-1).join('').toLowerCase();
	var vdoTle = (player['videoTitle']) ? player['videoTitle'] : page.url.replace(/https?:\/\//, '').replace(/[^0-9a-zA-Z]/g, '-');;
	if (page.site == 'youtube' && player['videoPlay'] == 'High Definition MP4') {
		page.win.location.href = vdoURL + '&title=' + vdoTle + vdoDef;
	}
	if (!player['isSaving']) {
		var vdoLnk = createMyElement('a', {href: vdoURL, target: '_blank', textContent: '[Link]'});
		styleMyElement(vdoLnk, {color: '#CCCCCC', textDecoration: 'underline'});
		appendMyElement(player['buttonSaveLink'], vdoLnk);
		player['isSaving'] = true;
	}
}

function showMyMessage(cause, content) {
	var myScriptLogo = createMyElement('div', {textContent: userscript});
	styleMyElement(myScriptLogo, {display: 'inline-block', margin: '10px auto', color: '#E24994', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', border: '1px solid #E24994', borderRadius: '2px', padding: '0px 4px'});
	var myScriptMess = createMyElement('div');
	styleMyElement(myScriptMess, {fontSize: '20px', border: '1px solid #777777', margin: '5px auto 5px auto', padding: '10px', backgroundColor: '#000000', color: '#AD0000', textAlign: 'center'});
	if (cause == '!player') {
		var myScriptAlert = createMyElement('div');
		styleMyElement(myScriptAlert, {position: 'absolute', top: '30%', left: '35%', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '10px', backgroundColor: '#FFFFFF', fontSize: '14px', textAlign: 'center', zIndex: '99999'});
		appendMyElement(myScriptAlert, myScriptLogo);
		modifyMyElement(myScriptMess, {innerHTML: 'Couldn\'t get the player element. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
		styleMyElement(myScriptMess, {border: '1px solid #EEEEEE', backgroundColor: '#FFFFFF'});
		appendMyElement(myScriptAlert, myScriptMess);
		var myScriptAlertButton = createMyElement('div', {textContent: 'OK'}, 'click', function() {
			removeMyElement(page.body, myScriptAlert);
		});
		styleMyElement(myScriptAlertButton, {width: '100px', border: '3px solid #EEEEEE', borderRadius: '5px', margin: '0px auto', backgroundColor: '#EEEEEE', color: '#666666', fontSize: '18px', textAlign: 'center', cursor: 'pointer'});
		appendMyElement(myScriptAlert, myScriptAlertButton);
		appendMyElement(page.body, myScriptAlert);
	}
	else if (cause == '!thumb') {
		modifyMyElement(player['playerContent'], {innerHTML: '<br><br>Couldn\'t get the thumbnail for this video. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
	}
	else {
		appendMyElement(myPlayerWindow, myScriptLogo);
		if (cause == '!content') {
			modifyMyElement(myScriptMess, {innerHTML: 'Couldn\'t get the videos content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
		}
		else if (cause == '!videos') {
			modifyMyElement(myScriptMess, {innerHTML: 'Couldn\'t get any video. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
		}
		else if (cause == '!support') {
			modifyMyElement(myScriptMess, {textContent: 'This video uses the RTMP protocol and is not supported.'});
		}
		else if (cause == 'embed') {
			modifyMyElement(myScriptMess, {innerHTML: 'This is an embedded video. You can watch it <a href="' + content + '" style="color:#00892C">here</a>.'});
		}
		else if (cause == 'other') {
			modifyMyElement(myScriptMess, {innerHTML: content});
		}
		appendMyElement(myPlayerWindow, myScriptMess);
	}
}


// ==========Blocker========== //

var blockObject = page.doc;
var blockInterval = 50;

function blockVideos() {
	var elVideos = getMyElement(blockObject, 'video', 'tag', '', -1, false);
	if (elVideos.length > 0) {
		for (var v = 0; v < elVideos.length; v++) {
			var elVideo = elVideos[v];
			if (elVideo && elVideo.id != 'vtVideo' && elVideo.currentSrc) {
				if (!elVideo.paused) {
					elVideo.pause();
					if (page.url.indexOf('youtube.com/watch') == -1) elVideo.src = "#";
					elVideo.addEventListener('play', function() {
						this.pause();
						if (page.url.indexOf('youtube.com/watch') == -1) this.src = "#";
					});
					elVideo.addEventListener('keydown', function (event) {
						event.preventDefault();
						return false;
					});
				}
			}
		}
	}
	var elEmbeds = getMyElement(blockObject, 'embed', 'tag', '', -1, false) || getMyElement(blockObject, 'object', 'tag', '', -1, false);
	if (elEmbeds.length > 0) {
		for (var e = 0; e < elEmbeds.length; e++) {
			var elEmbed = elEmbeds[e];
			if (elEmbed && elEmbed.id != 'vtVideo' && elEmbed.parentNode) {
				removeMyElement(elEmbed.parentNode, elEmbed);
			}
		}
	}
	if (blockObject !== page.doc) {
		var elFrames = getMyElement(blockObject, 'iframe', 'tag', '', -1, false);
		if (elFrames.length > 0) {
			for (var e = 0; e < elFrames.length; e++) {
				var elFrame = elFrames[e];
				if (elFrame && elFrame.parentNode) {
					removeMyElement(elFrame.parentNode, elFrame);
				}
			}
		}
	}
}

blockVideos();


// ==========Websites========== //

function ViewTube() {

	// =====Repubblica/Gelocal===== //

	if (page.url.indexOf('video.repubblica.it') != -1 || page.url.match(/video\.[^\.]*\.gelocal.it/)) {

		/* Get Player Window */
		var repPlayerWindow = getMyElement('', 'div', 'class', 'video-player', 0, false);
		if (!repPlayerWindow) repPlayerWindow = getMyElement('', 'div', 'id', 'player', -1, false);
		if (!repPlayerWindow) repPlayerWindow = getMyElement('', 'div', 'class', 'responsive-video', 0, false);
		if (!repPlayerWindow) {
			//showMyMessage('!player');
			return;
		}

		var repPlayerWidth = 970;
		var repPlayerHeight = 576;
		if (page.url.indexOf('gelocal.it') != -1) {
			repPlayerWidth = 580;
			repPlayerHeight = 326;
		}

		/* My Player Window */
		myPlayerWindow = createMyElement('div');
		styleMyElement(myPlayerWindow, {position: 'relative', width: repPlayerWidth + 'px', height: repPlayerHeight + 'px', textAlign: 'center'});
		styleMyElement(repPlayerWindow, {marginBottom: '30px', background: 'rgba(0, 0, 0, 0)'});
		cleanMyElement(repPlayerWindow, true);
		appendMyElement(repPlayerWindow, myPlayerWindow);

		/* Remove Background Image */
		var repPlayerWrapper = getMyElement('', 'div', 'class', 'wrapper', 0, false);
		if (repPlayerWrapper) styleMyElement(repPlayerWrapper, {backgroundImage: 'none'});

		/* Get Video Thumb */
		var repVideoThumb = getMyContentOld(page.url, 'posterSrc:\\s*\'(.*?)\'', false);

		/* Get Videos */
		var repVideoList = {};
		var repVideoFound, repDefaultVideo;
		var repVideo = getMyContentOld(page.url, '"type":"video\/mp4","src":"(.*?)"', true);
		if (repVideo) {
			repVideoFound = true;
			repVideoList['Low Definition MP4'] = repVideo;
			repDefaultVideo = 'Low Definition MP4';
		}
		repVideo = getMyContentOld(page.url, '"type":"application\/x-mpegURL","src":"(.*?)"', true);
		if (repVideo) {
			repVideoFound = true;
			repVideoList['Low Definition M3U8'] = repVideo;
			repDefaultVideo = 'Low Definition M3U8';
		}
		if (repVideoFound) {
			/* Get Watch Sidebar */
			var repSidebarWindow = getMyElement('', 'div', 'id', 'contB', -1, false);
			if (repSidebarWindow) styleMyElement(repSidebarWindow, {marginTop: '12px'});

			/* Create Player */
			player = {
				'playerSocket': repPlayerWindow,
				'playerWindow': myPlayerWindow,
				'videoList': repVideoList,
				'videoDefinitions': ['Low Definition'],
				'videoContainers': ['MP4'],
				'videoPlay': repDefaultVideo,
				'videoThumb': repVideoThumb,
				'playerWidth': repPlayerWidth,
				'playerHeight': repPlayerHeight
			};
			feature['widesize'] = false;
			createMyPlayer ();
		}
		else {
			var ytVideoId = getMyContentOld(page.url, '\'format\',\\s*\'youtube\',\\s*\'(.*?)\'', false);
			if (ytVideoId) {
				var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
				showMyMessage('embed', ytVideoLink);
			}
			else {
				showMyMessage('!videos');
			}
		}

	}

	// =====Corriere===== //

	else if (page.url.indexOf('video.corriere.it') != -1) {

		/* Archive */
		if (page.url.indexOf('/archivo/') != -1) return;

		/* Redirect First Video */
		var corFirstVideo = getMyElement('', 'div', 'id', 'title-link', -1, false);
		if (corFirstVideo) {
			var corFirstVideoId = getMyContentOld(page.url, '"video":\\[\\{"id":"(.*?)"', false);
			if (corFirstVideoId && page.url.indexOf(corFirstVideoId) == -1) page.win.location.href = page.url + corFirstVideoId;
		}
		if (page.url.indexOf('/video360/') != -1) {
			var corFirstVideoId = getMyContentOld(page.url, '"selected-video"\\s+data-uuid="(.*?)"', false);
			if (corFirstVideoId && page.url.indexOf(corFirstVideoId) == -1) page.win.location.href = page.url + corFirstVideoId;
		}

		/* Get Player Window */
		var corPlayerWindow = getMyElement('', 'div', 'class', 'player_big', 0, false);
		if (!corPlayerWindow) corPlayerWindow = getMyElement('', 'div', 'class', 'player', 0, false);
		if (!corPlayerWindow) {
			showMyMessage('!player');
			return;
		}

		/* Block Replace */
		corPlayerWindow.className = 'corPlayerWindow';
		corPlayerWindow.id = 'corPlayerWindow';
		var corPlayerVideo = getMyElement('', 'div', 'id', 'player_rcs_video', -1, false);
		if (corPlayerVideo) styleMyElement(corPlayerVideo, {display: 'none'});

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: '656px', height: '391px', textAlign: 'center', zIndex: '2'});
		styleMyElement(corPlayerWindow, {marginBottom: '50px'});
		cleanMyElement(corPlayerWindow, true);
		appendMyElement(corPlayerWindow, myPlayerWindow);
		blockObject = corPlayerWindow;

		/* Get Video Thumb */
		var corVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

		/* Get Videos */
		var corVideoList = {};
		var corVideoFound, corDefaultVideo;
		var corVideo = getMyContentOld(page.url, '"mediaFile"\\s*:\\s*\\[\\{\\s*"value"\\s*:\\s*"(.*?)"', true);
		if (corVideo) {
			corVideoFound = true;
			corVideoList['Low Definition MP4'] = corVideo;
			corDefaultVideo = 'Low Definition MP4';
		}
		if (corVideoFound) {
			/* Get Watch Sidebar */
			var corSidebarWindow = getMyElement('', 'div', 'id', 'frame1-container', -1, false);
			if (corSidebarWindow && corSidebarWindow.parentNode) corSidebarWindow = corSidebarWindow.parentNode;

			/* Create Player */
			player = {
				'playerSocket': corPlayerWindow,
				'playerWindow': myPlayerWindow,
				'videoList': corVideoList,
				'videoDefinitions': ['Low Definition'],
				'videoContainers': ['MP4'],
				'videoPlay': corDefaultVideo,
				'videoThumb': corVideoThumb,
				'playerWidth': 656,
				'playerHeight': 391,
				'playerWideWidth': 990,
				'playerWideHeight': 579,
				'sidebarWindow': corSidebarWindow,
				'sidebarMarginNormal': 0,
				'sidebarMarginWide': 740
			};
			createMyPlayer();
			/* Large Player Size */
			if (corPlayerWindow.className.indexOf('player_big') != -1) {
				option['widesize'] = true;
				resizeMyPlayer('widesize');
			}
		}
		else {
			showMyMessage('!videos');
		}

	}

	// =====AltoAdige===== //

	else if (page.url.indexOf('altoadige.it/video') != -1) {

		/* Get Player Window */
		var aaPlayerWindow = getMyElement('', 'div', 'class', 'article--video', 0, false);
		if (!aaPlayerWindow) {
			showMyMessage('!player');
			return;
		}

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: '954px', height: '560px', textAlign: 'center', zIndex: '2'});
		cleanMyElement(aaPlayerWindow, false);
		appendMyElement(aaPlayerWindow, myPlayerWindow);

		/* Get Video Thumb */
		var aaVideoThumb = getMyContentOld(page.url, 'poster="(.*?)"', false);

		/* Get Videos */
		var aaVideoList = {};
		var aaVideoFound, aaDefaultVideo;
		var aaVideo = getMyContentOld(page.url, 'meta\\s+itemprop="contentUrl"\\s+content="(.*?)"', true);
		if (aaVideo) {
			aaVideoFound = true;
			aaVideoList['Low Definition MP4'] = aaVideo;
			aaDefaultVideo = 'Low Definition MP4';
		}
		if (aaVideoFound) {
			/* Create Player */
			player = {
				'playerSocket': aaPlayerWindow,
				'playerWindow': myPlayerWindow,
				'videoList': aaVideoList,
				'videoDefinitions': ['Low Definition'],
				'videoContainers': ['MP4'],
				'videoPlay': aaDefaultVideo,
				'videoThumb': aaVideoThumb,
				'playerWidth': 954,
				'playerHeight': 560
			};
			createMyPlayer();
			/* Fix panel */
			styleMyElement(player['playerContent'], {marginTop: '12px'});
		}
		else {
			showMyMessage('!videos');
		}

	}

	// =====IlFattoQuotidiano===== //

	else if (page.url.indexOf('ilfattoquotidiano.it/') != -1) {

		/* Get Player Window */
		var ifqPlayerWindow = getMyElement('', 'div', 'class', 'videoplayer', 0, false);
		if (!ifqPlayerWindow) {
			//showMyMessage ('!player');
			return;
		}

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: '680px', height: '420px', textAlign: 'center'});
		cleanMyElement(ifqPlayerWindow, true);
		appendMyElement(ifqPlayerWindow, myPlayerWindow);

		/* Get Video Thumb */
		var ifqVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

		/* Get Videos Content */
		var ifqVideosContent = getMyContentOld(page.url, '"sources":\\[(.*?)\\]', false);

		/* Get Videos */
		if (ifqVideosContent) {
			var ifqVideoList = {};
			var ifqVideoFound = false;
			var ifqVideoFormats = {'180p': 'Very Low Definition MP4', '270p': 'Low Definition MP4', '406p': 'Standard Definition MP4'};
			var ifqVideo, ifqPattern;
			for (var vCode in ifqVideoFormats) {
				ifqPattern = '"file":"([^,]*?mp4)"[^\}]*?"label":"' + vCode + '"';
				ifqVideo = ifqVideosContent.match(ifqPattern);
				ifqVideo = (ifqVideo) ? ifqVideo[1] : null;
				if (ifqVideo) {
					if (!ifqVideoFound) ifqVideoFound = true;
					ifqVideoList[ifqVideoFormats[vCode]] = ifqVideo;
				}
			}

			if (ifqVideoFound) {
				/* Create Player */
				var ifqDefaultVideo = 'Low Definition MP4';
				player = {
					'playerSocket': ifqPlayerWindow,
					'playerWindow': myPlayerWindow,
					'videoList': ifqVideoList,
					'videoDefinitions': ['Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4'],
					'videoPlay': ifqDefaultVideo,
					'videoThumb': ifqVideoThumb,
					'playerWidth': 680,
					'playerHeight': 420
				};
				createMyPlayer();
			}
			else {
				showMyMessage('!videos');
			}
		}
		else {
			var ytVideoId = getMyContentOld(page.url, 'youtube.com/embed/(.*?)("|\\?)', false);
			if (ytVideoId) {
				var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
				showMyMessage('embed', ytVideoLink);
			}
			else {
				showMyMessage('!content');
			}
		}

	}

	// =====Mediaset===== //

	else if (page.url.indexOf('mediaset.it/') != -1) {

		function msInit() {

			/* My Player Window */
			myPlayerWindow = createMyElement('div', '', '', '', '');
			styleMyElement(myPlayerWindow, {position: 'relative', width: '760px', height: '480px', textAlign: 'center'});
			styleMyElement(msPlayerWindow, {height: '590px'});
			cleanMyElement(msPlayerWindow, true);
			appendMyElement(msPlayerWindow, myPlayerWindow);

			/* Get Video Thumb */
			var msVideoThumb = getMyContentOld(page.url, '"thumbnailUrl"\\s*:\\s*"(.*?)"', false);

			/* Get Videos */
			var msVideoID, msVideoPID, msVideo;
			msVideoID = getMyContentOld(page.url, '"@id"\\s*:\\s*".*programGuid=(.*?)"', false);
			if (msVideoID) msVideoPID = getMyContentOld('https://feed.entertainment.tv.theplatform.eu/f/PR1GhC/mediaset-prod-ext-programs/guid/-/' + msVideoID, '"pid":"(.*?)"', false);
			if (msVideoPID) msVideo = 'https://link.theplatform.eu/s/PR1GhC/media/' + msVideoPID + '?formats=mpeg4';
			if (msVideo) {
				/* Create Player */
				var msVideoList = {};
				var msDefaultVideo = 'Standard Definition MP4';
				msVideoList[msDefaultVideo] = msVideo;
				player = {
					'playerSocket': msPlayerWindow,
					'playerWindow': myPlayerWindow,
					'videoList': msVideoList,
					'videoDefinitions': ['Standard Definition'],
					'videoContainers': ['MP4'],
					'videoPlay': msDefaultVideo,
					'videoThumb': msVideoThumb,
					'playerWidth': 760,
					'playerHeight': 480
				};
				createMyPlayer();
			}
			else {
				showMyMessage('!videos');
			}

		}

		var msWaitForLoops = 50;
		var msWaitForObjects = 3;
		var msPlayerWindow, msPlayerError, msPlayerErrorPopup;
		var msWaitForObject = page.win.setInterval(function() {
			if (!msPlayerWindow) {
				msPlayerWindow = getMyElement('', 'div', 'class', '_3Xr09', 0, false);
				if (msPlayerWindow) {
					msInit();
					msWaitForObjects--;
				}
			}
			if (!msPlayerError) {
				msPlayerError = getMyElement('', 'div', 'class', 'Iv5CT', 0, false);
				if (msPlayerError) {
					removeMyElement(msPlayerError.parentNode, msPlayerError);
					msWaitForObjects--;
				}
			}
			if (!msPlayerErrorPopup) {
				msPlayerErrorPopup = getMyElement('', 'div', 'class', '_3l53i', 0, false);
				if (msPlayerErrorPopup) {
					removeMyElement(msPlayerErrorPopup.parentNode, msPlayerErrorPopup);
					msWaitForObjects--;
				}
			}
			msWaitForLoops--;
			if (msWaitForLoops == 0 || msWaitForObjects == 0) {
				if (!msPlayerWindow) showMyMessage('!player');
				clearInterval(msWaitForObject);
			}
		}, 1000);
		intervals.push(msWaitForObject);

	}

	// =====YouReporter===== //

	else if (page.url.indexOf('youreporter.it/') != -1) {

		/* Get Player Window */
		var yrPlayerWindow = getMyElement('', 'div', 'class', 'entry-video', 0, false);
		if (!yrPlayerWindow) {
			//showMyMessage ('!player');
			return;
		}

		/* Player Sizes */
		var yrPlayerWidth, yrPlayerHeight;
		function yrSizes() {
			if (yrPlayerWindow) yrPlayerWidth = yrPlayerWindow.clientWidth;
			if (yrPlayerWidth) yrPlayerHeight = Math.ceil(yrPlayerWidth / (16 / 9)) + myPlayerPanelHeight;
		}

		/* Resize Event */
		page.win.addEventListener('resize', function() {
			yrSizes();
			player['playerWidth'] = yrPlayerWidth;
			player['playerHeight'] = yrPlayerHeight;
			resizeMyPlayer('widesize');
		}, false);
		yrSizes();

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: yrPlayerWidth + 'px', height: yrPlayerHeight + 'px', textAlign: 'center'});
		cleanMyElement(yrPlayerWindow, true);
		appendMyElement(yrPlayerWindow, myPlayerWindow);

		/* Get Video Thumb */
		var yrVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

		/* Get Videos Content */
		var yrVideosContent = getMyContentOld(page.url, 'window.testVideo\\s*=\\s*\\[(.*?)\\]', false);

		if (yrVideosContent) {
			var yrVideoList = {};
			var yrVideoFound = false;
			var yrVideoFormats = {'360': 'Low Definition MP4', '540': 'Standard Definition MP4', '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
			var yrVideo, yrPattern;
			for (var vCode in yrVideoFormats) {
				yrPattern = '"value":"([^"]*?)","height":' + vCode;
				yrVideo = yrVideosContent.match(yrPattern);
				yrVideo = (yrVideo) ? yrVideo[1] : null;
				if (yrVideo) {
					if (!yrVideoFound) yrVideoFound = true;
					yrVideoList[yrVideoFormats[vCode]] = cleanMyContent(yrVideo, false);
				}
			}

			if (yrVideoFound) {
				/* Create Player */
				var yrDefaultVideo = 'Low Definition MP4';
				player = {
					'playerSocket': yrPlayerWindow,
					'playerWindow': myPlayerWindow,
					'videoList': yrVideoList,
					'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition'],
					'videoContainers': ['MP4'],
					'videoPlay': yrDefaultVideo,
					'videoThumb': yrVideoThumb,
					'playerWidth': yrPlayerWidth,
					'playerHeight': yrPlayerHeight
				};
				createMyPlayer();
			}
			else {
				showMyMessage('!videos');
			}
		}
		else {
			showMyMessage('!content');
		}

	}

	// =====Google Drive/Docs===== //

	else if (page.url.indexOf('google.com/file/d') != -1) {

		function ggInit() {

			/* Get Player Window */
			var ggPlayerWindow = getMyElement('', 'div', 'class', 'ndfHFb-c4YZDc-aTv5jf', 0, false);
			if (!ggPlayerWindow) {
				showMyMessage('!player');
				return;
			}

			/* My Player Window */
			myPlayerWindow = createMyElement('div', '', '', '', '');
			styleMyElement(myPlayerWindow, {position: 'relative', width: '640px', height: '390px', textAlign: 'center', margin: '50px auto'});
			cleanMyElement(ggPlayerWindow, true);
			appendMyElement(ggPlayerWindow, myPlayerWindow);

			/* Get Video Thumb */
			var ggVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

			/* Get Videos Content */
			var ggVideosContent = getMyContentOld(page.url, '"url_encoded_fmt_stream_map",\\s*"(.*?)"', false);
			if (!ggVideosContent) {
				ggVideosContent = getMyContentOld(page.url.replace('file/d/', 'get_video_info?docid=').replace(/\/[^\/]+$/, ''), 'url_encoded_fmt_stream_map=(.*?)&', false);
				ggVideosContent = cleanMyContent(ggVideosContent, true);
			}

			/* Get Videos */
			if (ggVideosContent) {
				var ggVideoList = {};
				var ggVideoFound = false;
				var ggVideoFormats = {'18': 'Low Definition MP4', '59': 'Standard Definition MP4', '22': 'High Definition MP4', '37': 'Full High Definition MP4'};
				var ggVideos = ggVideosContent.split(',');
				var ggVideoParse, ggVideoCodeParse, ggVideoCode, myVideoCode, ggVideo;
				for (var i = 0; i < ggVideos.length; i++) {
					if (!ggVideos[i].match(/^url/)) {
						ggVideoParse = ggVideos[i].match(/(.*)(url=.*$)/);
						if (ggVideoParse) ggVideos[i] = ggVideoParse[2] + '&' + ggVideoParse[1];
					}
					ggVideos[i] = cleanMyContent(ggVideos[i], false);
					ggVideoCodeParse = ggVideos[i].match(/itag=(\d{1,3})/);
					ggVideoCode = (ggVideoCodeParse) ? ggVideoCodeParse[1] : null;
					if (ggVideoCode) {
						myVideoCode = ggVideoFormats[ggVideoCode];
						if (myVideoCode) {
							ggVideo = cleanMyContent(ggVideos[i], true);
							ggVideo = ggVideo.replace(/url=/, '').replace(/&$/, '');
							if (ggVideo.match(/itag=/) && ggVideo.match(/itag=/g).length > 1) {
								if (ggVideo.match(/itag=\d{1,3}&/)) ggVideo = ggVideo.replace(/itag=\d{1,3}&/, '');
								else if (ggVideo.match(/&itag=\d{1,3}/)) ggVideo = ggVideo.replace(/&itag=\d{1,3}/, '');
							}
							if (ggVideo.match(/clen=/) && ggVideo.match(/clen=/g).length > 1) {
								if (ggVideo.match(/clen=\d+&/)) ggVideo = ggVideo.replace(/clen=\d+&/, '');
								else if (ggVideo.match(/&clen=\d+/)) ggVideo = ggVideo.replace(/&clen=\d+/, '');
							}
							if (ggVideo.match(/lmt=/) && ggVideo.match(/lmt=/g).length > 1) {
								if (ggVideo.match(/lmt=\d+&/)) ggVideo = ggVideo.replace(/lmt=\d+&/, '');
								else if (ggVideo.match(/&lmt=\d+/)) ggVideo = ggVideo.replace(/&lmt=\d+/, '');
							}
							if (ggVideo.match(/type=(video|audio).*?&/)) ggVideo = ggVideo.replace(/type=(video|audio).*?&/, '');
							else ggVideo = ggVideo.replace(/&type=(video|audio).*$/, '');
							if (ggVideo.match(/xtags=[^%=]*&/)) ggVideo = ggVideo.replace(/xtags=[^%=]*?&/, '');
							else if (ggVideo.match(/&xtags=[^%=]*$/)) ggVideo = ggVideo.replace(/&xtags=[^%=]*$/, '');
							ggVideo = cleanMyContent(ggVideo, true);
							if (ggVideo && ggVideo.indexOf('http') == 0) {
								if (!ggVideoFound) ggVideoFound = true;
								ggVideoList[myVideoCode] = ggVideo;
							}
						}
					}
				}

				if (ggVideoFound) {
					/* Create Player */
					var ggDefaultVideo = 'High Definition MP4';
					player = {
						'playerSocket': ggPlayerWindow,
						'playerWindow': myPlayerWindow,
						'videoList': ggVideoList,
						'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition'],
						'videoContainers': ['MP4'],
						'videoPlay': ggDefaultVideo,
						'videoThumb': ggVideoThumb,
						'playerWidth': 640,
						'playerHeight': 390
					};
					createMyPlayer();
				}
				else {
					showMyMessage('!videos');
				}
			}
			else {
				showMyMessage('!content');
			}

		}

		var ggWaitForLoops = 50;
		var ggPlayerWindow;
		var ggWaitForObject = page.win.setInterval(function() {
			if (!ggPlayerWindow) {
				ggPlayerWindow = getMyElement('', 'div', 'class', 'ndfHFb-c4YZDc-aTv5jf', 0, false);
				if (ggPlayerWindow) {
					ggInit();
				}
			}
			ggWaitForLoops--;
			if (ggWaitForLoops == 0) {
				if (!ggPlayerWindow) showMyMessage('!player');
				clearInterval(ggWaitForObject);
			}
		}, 1000);
		intervals.push(ggWaitForObject);

	}

	// =====Areena.yle.fi===== //

	else if (page.url.indexOf('areena.yle.fi/') != -1) {

		page.win.setTimeout(function() {

			/* Page Type */
			var ylePageType = getMyContent(page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"');
			if (!ylePageType || ylePageType.indexOf('video') == -1) return;

			/* Get Player Window */
			var ylePlayerWindow = getMyElement('', 'div', 'query', '[class*="GenericHeader_playControls"]', -1, false);
			if (!ylePlayerWindow) {
				showMyMessage('!player');
				return;
			}
			var ylePlayerImage = getMyElement('', 'div', 'query', '[class*="HeaderImage_wrapper"]', -1, false);
			if (ylePlayerImage) styleMyElement(ylePlayerImage, {display: 'none'});

			/* Player Sizes */
			var ylePlayerWidth, ylePlayerHeight;
			function yleSizes() {
				if (ylePlayerWindow) ylePlayerWidth = ylePlayerWindow.clientWidth * 1.75;
				if (ylePlayerWidth) ylePlayerHeight = Math.ceil(ylePlayerWidth / (16 / 9)) + myPlayerPanelHeight;
			}

			/* Resize Event */
			page.win.addEventListener('resize', function() {
				yleSizes();
				if (player) {
					player['playerWidth'] = ylePlayerWidth;
					player['playerHeight'] = ylePlayerHeight;
					resizeMyPlayer('widesize');
				}
			}, false);
			yleSizes();

			/* Get Video Thumb */
			var yleVideoThumb = getMyContent(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"');
			if (!yleVideoThumb) yleVideoThumb = getMyContent(page.url, 'meta\\s+property="og:image:url"\\s+content="(.*?)"');
			if (!yleVideoThumb) yleVideoThumb = getMyContent(page.url, 'imagesrcset="([^"]*?) 640');

			function ylePlayer() {
				var yleVideosPath = yleVideosContent.match(/"dataUrl":"(.*?)"/);
				yleVideosPath = (yleVideosPath) ? yleVideosPath[1] : null;
				if (yleVideosPath) yleVideosPath = cleanMyContent(yleVideosPath, false, false);
				yleVideosFlavors = yleVideosContent.match(/flavorAssets":\[(.*?)\]/);
				yleVideosFlavors = (yleVideosFlavors) ? yleVideosFlavors[1] : null;

				var yleVideoList = {};
				var yleVideoFound = false;
				var yleVideoFormats = {'240': 'Low Definition MP4', '360': 'Low Definition MP4', '480': 'Standard Definition MP4', '540': 'Standard Definition MP4', '576': 'High Definition MP4', '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
				if (yleVideosPath && yleVideosFlavors) {
					var yleVideo, yleVideoId, ylePattern;
					var yleVideosFlavors = yleVideosFlavors.split('},{');
					for (var vCode in yleVideoFormats) {
						for (var f = 0; f < yleVideosFlavors.length; f++ ) {
							ylePattern = '"height":' + vCode + '.*?"id":"(.*?)"';
							yleVideoId = yleVideosContent.match(ylePattern);
							yleVideoId = (yleVideoId) ? yleVideoId[1] : null;
							if (yleVideoId) {
								if (!yleVideoFound) yleVideoFound = true;
								yleVideoList[yleVideoFormats[vCode]] = yleVideosPath + '/flavorId/' + yleVideoId;
							}
						}
					}
				}
				else {
					var yleVideo = yleVideosContent.match(/"manifest_url":"(.*?)"/);
					yleVideo = (yleVideo) ? yleVideo[1] : null;
					if (yleVideo) {
						yleVideoFound = true;
						yleVideoList['HTTP Live Streaming M3U8'] = yleVideo;
						/*
						yleHLSContent = getMyContent(yleVideo, 'TEXT', false);
						if (yleHLSContent) {
							var yleHLSMatcher = new RegExp('(http.*?m3u8)', 'g');
							var yleHLSVideos = yleHLSContent.match(yleHLSMatcher);
							if (yleHLSVideos) {
								for (var i = 0; i < yleHLSVideos.length; i++) {
									yleHLSVideo = yleHLSVideos[i];
									for (var vCode in yleVideoFormats) {
										if (yleHLSVideo.indexOf('index' + vCode + 'p25') != -1 || yleHLSVideo.indexOf('index-' + vCode + 'p25') != -1 ||
												yleHLSVideo.indexOf('index' + vCode + 'p50') != -1 || yleHLSVideo.indexOf('index-' + vCode + 'p50') != -1) {
											yleVideoList[yleVideoFormats[vCode].replace('MP4', 'M3U8')] = yleHLSVideo;
										}
									}
								}
							}
						}*/
						var yleCaptions = yleVideosContent.match(/"translation","uri":"(.*?)"/);
						yleCaptions = (yleCaptions) ? yleCaptions[1] : null;
						if (yleCaptions) yleVideoList['Subtitles M3U8'] = yleCaptions;
					}
				}

				if (yleVideoFound) {
					/* My Player Window */
					myPlayerWindow = createMyElement('div', '', '', '', '');
					styleMyElement(myPlayerWindow, {position: 'relative', width: ylePlayerWidth + 'px', height: ylePlayerHeight + 'px', textAlign: 'center'});
					cleanMyElement(ylePlayerWindow, true);
					appendMyElement(ylePlayerWindow, myPlayerWindow);

					/* Create Player */
					var yleDefaultVideo = 'Low Definition MP4';
					if (yleVideoList['HTTP Live Streaming M3U8']) yleDefaultVideo = 'HTTP Live Streaming M3U8';
					player = {
						'playerSocket': ylePlayerWindow,
						'playerWindow': myPlayerWindow,
						'videoList': yleVideoList,
						'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition'],
						'videoContainers': ['MP4', 'M3U8'],
						'videoPlay': yleDefaultVideo,
						'videoThumb': yleVideoThumb,
						'playerWidth': ylePlayerWidth,
						'playerHeight': ylePlayerHeight
					};
					createMyPlayer();
					var yleHeaderImage = getMyElement('', 'div', 'class', 'Header_image__DGRLC', 0, false);
					if (yleHeaderImage) removeMyElement(yleHeaderImage.parentNode, yleHeaderImage);
				}
				else {
					//showMyMessage('!videos');
				}
			}

			/* Get Videos Content */
			var yleVideosContent;
			var yleVideosSource = getMyContent(page.url, 'meta\\s+property="og:video:url"\\s+content="(.*?)"');
			if (yleVideosSource) yleVideosContent = getMyContent(yleVideosSource, '"entryResult":\\s*\\{(.*?)\\}\\}');
			if (yleVideosContent) {
				ylePlayer();
			}
			else {
				var ylePageId = page.url.match(/areena.yle.fi\/(.*?)(\/|$|#|\?)/);
				ylePageId = (ylePageId) ? ylePageId[1] : null;
				if (ylePageId) {
					//yleVideosContent = getMyContent('https://player.api.yle.fi/v1/preview/' + ylePageId + '.json?language=fin&ssl=true&countryCode=FI&isInEU=true&host=areenaylefi&app_id=player_static_prod&app_key=8930d72170e48303cf5f3867780d549b', 'TEXT', false);
					yleVideosContent = getMyContent('https://player.api.yle.fi/v1/preview/' + ylePageId + '.json?host=areenaylefi&app_id=player_static_prod&app_key=8930d72170e48303cf5f3867780d549b');
				}
				if (yleVideosContent && yleVideosContent.indexOf('m3u8') != -1) {
					ylePlayer();
				}
				else {
					var yleWaitForLoops = 50;
					var yleWaitForObject = page.win.setInterval(function() {
						var yleEntryId = page.body.innerHTML.match(/id="yle-kaltura-player\d+-\d+-(.*?)"/);
						yleEntryId = (yleEntryId) ? yleEntryId[1] : null;
						if (yleEntryId) {
							var xmlhttp = new XMLHttpRequest();
							xmlhttp.open('POST', 'https://cdnapisec.kaltura.com/api_v3/service/multirequest', false);
							xmlhttp.setRequestHeader('Content-Type', 'application/json');
							var json = '{"1":{"service":"session","action":"startWidgetSession","widgetId":"_1955031"},"2":{"service":"baseEntry","action":"list","ks":"{1:result:ks}","filter":{"redirectFromEntryId":"'+yleEntryId+'"},"responseProfile":{"type":1,"fields":"id,referenceId,name,description,thumbnailUrl,dataUrl,duration,msDuration,flavorParamsIds,mediaType,type,tags,dvrStatus,externalSourceType"}},"3":{"service":"baseEntry","action":"getPlaybackContext","entryId":"{2:result:objects:0:id}","ks":"{1:result:ks}","contextDataParams":{"objectType":"KalturaContextDataParams","flavorTags":"all"}},"4":{"service":"metadata_metadata","action":"list","filter":{"objectType":"KalturaMetadataFilter","objectIdEqual":"'+yleEntryId+'","metadataObjectTypeEqual":"1"},"ks":"{1:result:ks}"},"apiVersion":"3.3.0","format":1,"ks":"","clientTag":"html5:v0.45.8","partnerId":"1955031"}';
							xmlhttp.send(JSON.stringify(JSON.parse(json)));
							yleVideosContent = xmlhttp.responseText;
							if (yleVideosContent) ylePlayer();
						}
						yleWaitForLoops--;
						if (yleWaitForLoops == 0 || yleEntryId) {
							clearInterval(yleWaitForObject);
						}
					}, 1000);
					intervals.push(yleWaitForObject);
				}
			}

		}, 1000);

	}

	// =====Internet Archive===== //

	else if (page.url.indexOf('archive.org/details') != -1) {

		/* Page Type */
		var arcPageType = getMyContentOld(page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"', false);
		if (!arcPageType || (arcPageType != 'video.episode' && arcPageType != 'video.other' && arcPageType != 'video.movie')) return;

		/* Get Player Window */
		var arcPlayerWindow = getMyElement('', 'div', 'id', 'theatre-ia', -1, false);
		if (!arcPlayerWindow) {
			showMyMessage('!player');
			return;
		}

		/* Player Sizes */
		var arcPlayerWidth, arcPlayerHeight;
		function arcSizes() {
			if (arcPlayerWindow) arcPlayerWidth = arcPlayerWindow.clientWidth;
			if (arcPlayerWidth) arcPlayerHeight = Math.ceil(arcPlayerWidth / (16 / 9)) + myPlayerPanelHeight;
		}

		/* Resize Event */
		page.win.addEventListener('resize', function() {
			arcSizes();
			if (player) {
				player['playerWidth'] = arcPlayerWidth;
				player['playerHeight'] = arcPlayerHeight;
				resizeMyPlayer('widesize');
			}
		}, false);
		arcSizes();

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: arcPlayerWidth + 'px', height: arcPlayerHeight + 'px', textAlign: 'center'});
		styleMyElement(arcPlayerWindow, {padding: '0px'});
		cleanMyElement(arcPlayerWindow, true);
		appendMyElement(arcPlayerWindow, myPlayerWindow);


		/* Get Video Thumb */
		var arcVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

		/* Get Videos Content */
		var arcVideosContent = getMyContentOld(page.url, '"sources":\\s*\\[(.*?)\\]', false);

		if (arcVideosContent) {
			var arcVideoList = {};
			var arcVideoFound = false;
			var arcVideoFormats = {'240': 'Very Low Definition MP4', '360': 'Low Definition MP4', '480': 'Standard Definition MP4', '720': 'High Definition MP4'};
			var arcVideo, arcPattern;
			for (var vCode in arcVideoFormats) {
				arcPattern = '"file":"([^,]*?mp4)"[^\}]*?"height":"' + vCode + '"';
				arcVideo = arcVideosContent.match(arcPattern);
				arcVideo = (arcVideo) ? arcVideo[1] : null;
				if (arcVideo) {
					if (!arcVideoFound) arcVideoFound = true;
					arcVideoList[arcVideoFormats[vCode]] = cleanMyContent(arcVideo, false);
				}
			}

			if (arcVideoFound) {
				/* Create Player */
				var arcDefaultVideo = 'Low Definition MP4';
				player = {
					'playerSocket': arcPlayerWindow,
					'playerWindow': myPlayerWindow,
					'videoList': arcVideoList,
					'videoDefinitions': ['High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4'],
					'videoPlay': arcDefaultVideo,
					'videoThumb': arcVideoThumb,
					'playerWidth': arcPlayerWidth,
					'playerHeight': arcPlayerHeight
				};
				createMyPlayer();
			}
			else {
				showMyMessage('!videos');
			}
		}
		else {
			showMyMessage('!content');
		}

	}

	// =====Streamable===== //

	else if (page.url.indexOf('streamable.com/') != -1) {

		/* Page Type */
		var strPageType = getMyContentOld(page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"', false);
		if (!strPageType || (strPageType != 'video.episode' && strPageType != 'video.other' && strPageType != 'video.movie')) return;

		/* Get Player Window */
		var strPlayerWindow = getMyElement('', 'div', 'id', 'media-container', -1, false);
		if (!strPlayerWindow) {
			showMyMessage('!player');
			return;
		}

		/* Player Sizes */
		var strPlayerWidth, strPlayerHeight;
		function strSizes() {
			if (strPlayerWindow) strPlayerWidth = strPlayerWindow.clientWidth;
			if (strPlayerWidth) strPlayerHeight = Math.ceil(strPlayerWidth / (16 / 9)) + myPlayerPanelHeight;
		}

		/* Resize Event */
		page.win.addEventListener('resize', function() {
			strSizes();
			if (player) {
				player['playerWidth'] = strPlayerWidth;
				player['playerHeight'] = strPlayerHeight;
				resizeMyPlayer('widesize');
			}
		}, false);
		strSizes();

		/* My Player Window */
		myPlayerWindow = createMyElement('div', '', '', '', '');
		styleMyElement(myPlayerWindow, {position: 'relative', width: strPlayerWidth + 'px', height: strPlayerHeight + 'px', textAlign: 'center'});
		styleMyElement(strPlayerWindow, {padding: '0px'});
		cleanMyElement(strPlayerWindow, true);
		appendMyElement(strPlayerWindow, myPlayerWindow);


		/* Get Video Thumb */
		var strVideoThumb = getMyContentOld(page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);

		/* Get Videos Content */
		var strVideosContent = getMyContentOld(page.url, '"files":\\s*\\{(.*?)\\};', false);

		if (strVideosContent) {
			var strVideoList = {};
			var strVideoFound = false;
			var strVideoFormats = {'360': 'Low Definition MP4', '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
			var strVideo, strPattern;
			for (var vCode in strVideoFormats) {
				strPattern = '"height":\\s*' + vCode + '.*?"url":\\s*"(.*?)"';
				strVideo = strVideosContent.match(strPattern);
				strVideo = (strVideo) ? strVideo[1] : null;
				if (strVideo) {
					if (!strVideoFound) strVideoFound = true;
					strVideoList[strVideoFormats[vCode]] = cleanMyContent(strVideo, false);
				}
			}

			if (strVideoFound) {
				/* Create Player */
				var strDefaultVideo = 'Low Definition MP4';
				player = {
					'playerSocket': strPlayerWindow,
					'playerWindow': myPlayerWindow,
					'videoList': strVideoList,
					'videoDefinitions': ['Full High Definition', 'High Definition', 'Low Definition'],
					'videoContainers': ['MP4'],
					'videoPlay': strDefaultVideo,
					'videoThumb': strVideoThumb,
					'playerWidth': strPlayerWidth,
					'playerHeight': strPlayerHeight
				};
				createMyPlayer();
			}
			else {
				showMyMessage('!videos');
			}
		}
		else {
			showMyMessage('!content');
		}

	}

	// =====Facebook===== //

	else if (page.url.indexOf('facebook.com/') != -1) {

		var fbPlayerWindow = [];
		var fbVideosParent;
		var fbVideoId;
		var fbVideosContent = {};
		var fbVideosContentx;
		var fbVideoThumb;
		var fbVideoHref;
		var fbVideoSrc = "";
		var fbVideoList = {};

		function fbEventListener() {

			var fbVideos = getMyElement(page.doc, 'video', 'tag', '', -1, false);
			if (fbVideos.length > 0) {
				for (var v = 0; v < fbVideos.length; v++) {
					if (fbVideos[v].id.indexOf('vtVideo') == -1) {
						fbVideoHref = false;
						fbVideosParent = fbVideos[v].closest('.x78zum5 .xdt5ytf');
						if (fbVideosParent) {
							fbVideosParentChildren = fbVideosParent.getElementsByTagName("*");
							for (var c = 0; c < fbVideosParentChildren.length; c++) {
								if (fbVideosParentChildren[c].href && (fbVideosParentChildren[c].href.toString().indexOf('/watch/?v=') != -1 || fbVideosParentChildren[c].href.toString().indexOf('/videos/') != -1)) {
									fbVideoHref = fbVideosParentChildren[c].href.toString().replace('&amp;', '&').replace('watch/?v', 'watch?v');
									break;
								}
							}
						}
						if (!fbVideosParent || !fbVideoHref) {
							//fbVideosParent = fbVideos[v].closest('.x1iyjqo2 .x6ikm8r .x10wlt62');
							fbVideosParent = fbVideos[v].closest('.x1jx94hy .x78zum5 .x5yr21d') || fbVideos[v].closest('.x78zum5 .xdt5ytf .x193iq5w');
							if (fbVideosParent) {
								if (page.url.indexOf('/watch') != -1 || page.url.indexOf('/videos/') != -1) {
									fbVideoHref = page.url;
								}
							}
						}
						if (fbVideoHref) {
							fbHeaders = {'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'};
							fbVideosContent = getMyContent(fbVideoHref + '||' + JSON.stringify(fbHeaders), /"media":(\{.*?\})\}\]/);
							try {
								fbVideosContent = JSON.parse(fbVideosContent);
							}
							catch(e) {
								fbVideosContent = {};
							}
							if (!fbVideosContent['browser_native_sd_url'] || !fbVideosContent['browser_native_hd_url']) {
								fbVideosContent = getMyContent(fbVideoHref + '||' + JSON.stringify(fbHeaders), /"data":{"video":(\{.*?\})\}\]/);
								try {
									fbVideosContent = JSON.parse(fbVideosContent);
								}
								catch(e) {
									fbVideosContent = {};
								}
							}
							if (!fbVideosContent['browser_native_sd_url'] || !fbVideosContent['browser_native_hd_url']) {
								fbVideosContentx = getMyContent(fbVideoHref + '||' + JSON.stringify(fbHeaders), /"browser_native_sd_url":"(.*?)"/);
								if (fbVideosContentx) fbVideosContent['browser_native_sd_url'] = cleanMyContent(fbVideosContentx);
								fbVideosContentx = getMyContent(fbVideoHref + '||' + JSON.stringify(fbHeaders), /"browser_native_hd_url":"(.*?)"/);
								if (fbVideosContentx) fbVideosContent['browser_native_hd_url'] = cleanMyContent(fbVideosContentx);
								fbVideosContentx = getMyContent(fbVideoHref + '||' + JSON.stringify(fbHeaders), /"preferred_thumbnail":\{"image":\{"uri":"(.*?)"/);
								if (fbVideosContentx) {
									fbVideosContent['preferred_thumbnail'] = {};
									fbVideosContent['preferred_thumbnail']['image'] = {}
									fbVideosContent['preferred_thumbnail']['image']['uri'] = cleanMyContent(fbVideosContentx);
								}
							}
						}
						if (fbVideoHref && fbVideosContent && fbVideosContent['browser_native_sd_url']) {
							fbVideoId = 'vtVideo' + Date.now();
							console.log(fbVideoId);
							fbVideos[v].id = fbVideoId;
							fbVideoThumb = (fbVideosContent['preferred_thumbnail']) ? fbVideosContent['preferred_thumbnail']['image']['uri'] : '';
							fbVideoList[fbVideoId] = {};
							fbVideoList[fbVideoId]['Standard Definition MP4'] = fbVideosContent['browser_native_sd_url'];
							fbVideoList[fbVideoId]['High Definition MP4'] = fbVideosContent['browser_native_hd_url'];
							fbPlayerWindow[fbVideoId] = fbVideos[v].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
							//fbPlayerWindow[fbVideoId] = fbVideos[v].parentNode;
							//styleMyElement(fbPlayerWindow[fbVideoId], {padding: '0px', textAlign: 'center'});
							cleanMyElement(fbPlayerWindow[fbVideoId], true);
							fbVideoSrc = '<video id="' + fbVideoId + '" width="100%" controls poster="' + fbVideoThumb + '"></video>';
							fbVideoSrc += '<div style="position:absolute;font-size:24px;left:3%;top:3%;color:#eeeeee;background-color:#000000;border-radius:5px;padding:5px;">ViewTube</div>';
							fbPlayerWindow[fbVideoId].innerHTML = fbVideoSrc;
							fbPlayerWindow[fbVideoId].addEventListener('click', function() {
								if (fbPlayerWindow[this].innerHTML.indexOf('source') != -1) return;
								fbVideoSrc = '<video id="vtVideo" width="100%" controls autoplay>';
								if (fbVideoList[this]['Standard Definition MP4']) {
									fbVideoSrc += '<source src="' + fbVideoList[this]['Standard Definition MP4'] + '" type="video/mp4" label="480p">';
								}
								if (fbVideoList[this]['High Definition MP4']) {
									fbVideoSrc += '<source src="' + fbVideoList[this]['High Definition MP4'] + '" type="video/mp4" label="7200p">';
								}
								fbVideoSrc += '</video>';
								fbPlayerWindow[this].innerHTML = fbVideoSrc;
							}.bind(fbVideoId), false);
						}
					}
				}
			}

		}

		page.win.setTimeout(fbEventListener, 1000);
		page.win.addEventListener('scroll', fbEventListener, false);

	}

}


// ==========Run========== //

getMyOptions();
ViewTube();

page.win.setInterval(function() {
  if (page.url != page.win.location.href.replace(page.win.location.hash, '')) {
    for (var i = 0; i < intervals.length; i++){
      clearInterval(intervals[i]);
    }
    intervals = [];
    if (player['playerWindow'] && player['playerWindow'].parentNode) {
      removeMyElement(player['playerWindow'].parentNode, player['playerWindow']);
    }
    page.doc = page.win.document;
    page.body = page.doc.body;
    page.url = page.win.location.href.replace(page.win.location.hash, '');
    blockInterval = 50;
    if (player['playerSocket']) blockObject = player['playerSocket'];
    blockVideos();
    ViewTube();
  }
  // Block videos
  if (blockObject && blockInterval > 0) {
    blockVideos();
    if (blockInterval > 0) blockInterval--;
  }
}, 500);


})();
