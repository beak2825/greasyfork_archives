// ==UserScript==
// @name		LinkTube
// @version		2017.11.23
// @description		Replaces an embedded video with a link to the video page.
// @author		sebaro
// @namespace		http://isebaro.com/linktube
// @license		GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @icon		https://raw.githubusercontent.com/sebaro/linktube/master/linktube.png
// @include		*
// @grant		GM_xmlhttpRequest
// @grant		GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22729/LinkTube.user.js
// @updateURL https://update.greasyfork.org/scripts/22729/LinkTube.meta.js
// ==/UserScript==


/*

  Copyright (C) 2011 - 2017 Sebastian Luncan

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

  Website: http://isebaro.com/linktube
  Contact: http://isebaro.com/contact

*/


(function() {


// ==========Variables========== //

// Userscript
var userscript = 'LinkTube';

// Contact
var contact = 'http://isebaro.com/contact';

// Warning
var warning = 'Couldn\'t get the video link. Please report it <a href="' + contact + '">here</a>.';

// Options
var option = {'secure': true};


// ==========Fixes========== //

// Don't run on frames or iframes
if (window.top != window.self)  return;


// ==========Functions========== //

function createMyElement (type, content) {
  var obj = document.createElement(type);
  if (type == 'div') {
    if (content) obj.innerHTML = content;
  }
  return obj;
}

function getMyElement (element, get, tag) {
  var obj;
  if (get == 'parent') obj = element.parentNode;
  else if (get == 'source') obj = element.src;
  else if (get == 'name') obj = element.name;
  else if (get == 'value') obj = element.value;
  else if (get == 'children') obj = element.getElementsByTagName(tag);
  return obj;
}

function modifyMyElement (obj, type, content, clear) {
  if (type == 'div') {
    if (content) obj.innerHTML = content;
  }
  if (clear) {
    if (obj.hasChildNodes()) {
      while (obj.childNodes.length >= 1) {
        obj.removeChild(obj.firstChild);
      }
    }
  }
}

function styleMyElement (obj, styles) {
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) obj.style[property] = styles[property];
  }
}

function appendMyElement (parent, child) {
  if (parent == 'body') document.body.appendChild(child);
  else parent.appendChild(child);
}

function removeMyElement (parent, child) {
  if (parent == 'body') document.body.removeChild(child);
  else parent.removeChild(child);
}

function replaceMyElement (parent, orphan, child) {
  parent.replaceChild(orphan, child);
}

function cleanMyContent (content, unesc) {
  var myNewContent = content;
  if (unesc) myNewContent = unescape (myNewContent);
  myNewContent = myNewContent.replace (/\\u0025/g,'%');
  myNewContent = myNewContent.replace (/\\u0026/g,'&');
  myNewContent = myNewContent.replace (/\\/g,'');
  myNewContent = myNewContent.replace (/\n/g,'');
  return myNewContent;
}

function YouTube (url, target) {

  /* Decrypt Signature */
  var ytScriptSrc;
  function ytDecryptSignature (s) {return null;}
  function ytDecryptFunction () {
    var ytSignFuncName, ytSignFuncBody, ytSwapFuncName, ytSwapFuncBody, ytFuncMatch;
    ytScriptSrc = ytScriptSrc.replace(/(\r\n|\n|\r)/gm, '');
    ytSignFuncName = ytScriptSrc.match(/"signature"\s*,\s*(.*?)\(/);
    ytSignFuncName = (ytSignFuncName) ? ytSignFuncName[1] : null;
    if (ytSignFuncName) {
      ytFuncMatch = ytSignFuncName.replace(/\$/, '\\$') + '\\s*=\\s*function\\s*' + '\\s*\\(\\w+\\)\\s*\\{(.*?)\\}';
      ytSignFuncBody = ytScriptSrc.match(ytFuncMatch);
      ytSignFuncBody = (ytSignFuncBody) ? ytSignFuncBody[1] : null;
      if (ytSignFuncBody) {
	ytSwapFuncName = ytSignFuncBody.match(/((\$|_|\w)+)\.(\$|_|\w)+\(\w,[0-9]+\)/);
	ytSwapFuncName = (ytSwapFuncName) ? ytSwapFuncName[1] : null;
	if (ytSwapFuncName) {
	  ytFuncMatch = 'var\\s+' + ytSwapFuncName.replace(/\$/, '\\$') + '=\\s*\\{(.*?)\\};';
	  ytSwapFuncBody = ytScriptSrc.match(ytFuncMatch);
	  ytSwapFuncBody = (ytSwapFuncBody) ? ytSwapFuncBody[1] : null;
	}
	if (ytSwapFuncBody) ytSignFuncBody = 'var ' + ytSwapFuncName + '={' + ytSwapFuncBody + '};' + ytSignFuncBody;
	ytSignFuncBody = 'try {' + ytSignFuncBody + '} catch(e) {return null}';
	ytDecryptSignature = new Function('a', ytSignFuncBody);
      }
    }
  }

  /* Parse Videos */
  function ytVideos() {
    var ytVideoFormats = {
      '5': 'Very Low Definition FLV',
      '17': 'Very Low Definition 3GP',
      '18': 'Low Definition MP4',
      '22': 'High Definition MP4',
      '34': 'Low Definition FLV',
      '35': 'Standard Definition FLV',
      '36': 'Low Definition 3GP',
      '37': 'Full High Definition MP4',
      '38': 'Ultra High Definition MP4',
      '43': 'Low Definition WebM',
      '44': 'Standard Definition WebM',
      '45': 'High Definition WebM',
      '46': 'Full High Definition WebM',
      '82': 'Low Definition 3D MP4',
      '83': 'Standard Definition 3D MP4',
      '84': 'High Definition 3D MP4',
      '85': 'Full High Definition 3D MP4',
      '100': 'Low Definition 3D WebM',
      '101': 'Standard Definition 3D WebM',
      '102': 'High Definition 3D WebM',
      '135': 'Standard Definition Video MP4',
      '136': 'High Definition Video MP4',
      '137': 'Full High Definition Video MP4',
      '138': 'Ultra High Definition Video MP4',
      '139': 'Low Bitrate Audio MP4',
      '140': 'Medium Bitrate Audio MP4',
      '141': 'High Bitrate Audio MP4',
      '171': 'Medium Bitrate Audio WebM',
      '172': 'High Bitrate Audio WebM',
      '244': 'Standard Definition Video WebM',
      '247': 'High Definition Video WebM',
      '248': 'Full High Definition Video WebM',
      '266': 'Ultra High Definition Video MP4',
      '272': 'Ultra High Definition Video WebM',
      '298': 'High Definition Video MP4',
      '299': 'Full High Definition Video MP4',
      '302': 'High Definition Video WebM',
      '303': 'Full High Definition Video WebM',
      '313': 'Ultra High Definition Video WebM'
    };
    var ytVideoFound = false;
    var ytVideos = ytVideosContent.split(',');
    var ytVideoParse, ytVideoCodeParse, ytVideoCode, myVideoCode, ytVideo;
    for (var i = 0; i < ytVideos.length; i++) {
      if (!ytVideos[i].match(/^url/)) {
	ytVideoParse = ytVideos[i].match(/(.*)(url=.*$)/);
	if (ytVideoParse) ytVideos[i] = ytVideoParse[2] + '&' + ytVideoParse[1];
      }
      ytVideoCodeParse = ytVideos[i].match (/itag=(\d{1,3})/);
      ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
      if (ytVideoCode) {
	myVideoCode = ytVideoFormats[ytVideoCode];
	if (myVideoCode) {
	  ytVideo = cleanMyContent(ytVideos[i], true);
	  ytVideo = ytVideo.replace(/url=/, '').replace(/&$/, '');
	  if (ytVideo.match(/itag=/) && ytVideo.match(/itag=/g).length > 1) {
	    if (ytVideo.match(/itag=\d{1,3}&/)) ytVideo = ytVideo.replace(/itag=\d{1,3}&/, '');
	    else if (ytVideo.match(/&itag=\d{1,3}/)) ytVideo = ytVideo.replace(/&itag=\d{1,3}/, '');
	  }
	  if (ytVideo.match(/clen=/) && ytVideo.match(/clen=/g).length > 1) {
	    if (ytVideo.match(/clen=\d+&/)) ytVideo = ytVideo.replace(/clen=\d+&/, '');
	    else if (ytVideo.match(/&clen=\d+/)) ytVideo = ytVideo.replace(/&clen=\d+/, '');
	  }
	  if (ytVideo.match(/lmt=/) && ytVideo.match(/lmt=/g).length > 1) {
	    if (ytVideo.match(/lmt=\d+&/)) ytVideo = ytVideo.replace(/lmt=\d+&/, '');
	    else if (ytVideo.match(/&lmt=\d+/)) ytVideo = ytVideo.replace(/&lmt=\d+/, '');
	  }
	  if (ytVideo.match(/type=(video|audio).*?&/)) ytVideo = ytVideo.replace(/type=(video|audio).*?&/, '');
	  else ytVideo = ytVideo.replace(/&type=(video|audio).*$/, '');
	  if (ytVideo.match(/xtags=[^%=]*&/)) ytVideo = ytVideo.replace(/xtags=[^%=]*?&/, '');
	  else if (ytVideo.match(/&xtags=[^%=]*$/)) ytVideo = ytVideo.replace(/&xtags=[^%=]*$/, '');
	  if (ytVideo.match(/&sig=/)) ytVideo = ytVideo.replace(/&sig=/, '&signature=');
	  else if (ytVideo.match(/&s=/)) {
	    var ytSig = ytVideo.match(/&s=(.*?)(&|$)/);
	    if (ytSig) {
	      var s = ytSig[1];
	      s = ytDecryptSignature(s);
	      if (s) ytVideo = ytVideo.replace(/&s=.*?(&|$)/, '&signature=' + s + '$1');
	      else ytVideo = '';
	    }
	    else ytVideo = '';
	  }
	  ytVideo = cleanMyContent(ytVideo, true);
	  if (ytVideo.indexOf('ratebypass') == -1) ytVideo += '&ratebypass=yes';
	  if (ytVideo && ytVideo.indexOf('http') == 0) {
	    if (ytVideoTitle) ytVideo += '&title=' + ytVideoTitle;
	    if (!ytVideoFound) ytVideoFound = true;
	    ytVideoList += '<a href="' + ytVideo + '">' + myVideoCode + '</a><br>';
	  }
	}
      }
    }

    if (!ytVideoFound) {
      if (ytVideosContent.indexOf('conn=rtmp') != -1) ytVideoList = 'ERROR: RTMP!';
      else ytVideoList = 'ERROR: No videos!';
    }
  }

  var ytVideosContent;
  var ytVideoTitle;
  var ytVideoLength;
  var ytVideoList = '';
  try {
    GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
	if (response.readyState === 4 && response.status === 200) {
	  /* Get Page Source */
	  ytPageSource = response.responseText;
	  /* Get Video Title */
	  ytVideoTitle = ytPageSource.match(/"title":"(.*?)","lengthSeconds"/);
	  ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	  if (!ytVideoTitle) {
	    ytVideoTitle = ytPageSource.match(/document.title\s*=\s*"(.*?)"/);
	    ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	  }
	  if (!ytVideoTitle) {
	    ytVideoTitle = ytPageSource.match(/meta\s+itemprop="name"\s+content="(.*?)"/);
	    ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	  }
	  if (!ytVideoTitle) {
	    ytVideoTitle = ytPageSource.match(/meta\s+property="og:title"\s+content="(.*?)"/);
	    ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	  }
	  if (ytVideoTitle) {
	    ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
	    ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
	    ytVideoTitle = ytVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
	    ytVideoTitle = ytVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
	    ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
	    ytVideoTitle = ytVideoTitle.replace(/^YouTube\s-\s/, '');
	  }
	  /* Get Video Length */
	  ytVideoLength = ytPageSource.match(/"lengthSeconds":"(.*?)"/);
	  ytVideoLength = (ytVideoLength) ? ytVideoLength[1] : null;
	  if (ytVideoLength) {
	    ytVideoLength = new Date(ytVideoLength * 1000).toISOString().substr(11, 8).replace(/00:0?/, '');
	  }
	  else {
	    ytVideoLength = ytPageSource.match(/meta\s+itemprop="duration"\s+content="(.*?)"/);
	    ytVideoLength = (ytVideoLength) ? ytVideoLength[1].replace('PT', '').replace('M', ':').replace('S', '') : null;
	  }
	  /* Get Videos Content */
	  var ytVideosEncodedFmts, ytVideosAdaptiveFmts;
	  ytVideosEncodedFmts = ytPageSource.match(/"url_encoded_fmt_stream_map":\s*"(.*?)"/);
	  ytVideosEncodedFmts = (ytVideosEncodedFmts) ? ytVideosEncodedFmts[1] : null;
	  if (ytVideosEncodedFmts) ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, false);
	  ytVideosAdaptiveFmts = ytPageSource.match(/"adaptive_fmts":\s*"(.*?)"/);
	  ytVideosAdaptiveFmts = (ytVideosAdaptiveFmts) ? ytVideosAdaptiveFmts[1] : null;
	  if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, false);
	  if (ytVideosEncodedFmts) {
	    ytVideosContent = ytVideosEncodedFmts;
	  }
	  if (ytVideosAdaptiveFmts) {
	    ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/clen=\d+&/g, '').replace(/&clen=\d+/g, '');
	    ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/lmt=\d+&/g, '').replace(/&lmt=\d+/g, '');
	    if (ytVideosContent) ytVideosContent += ',' + ytVideosAdaptiveFmts;
	    else ytVideosContent = ytVideosAdaptiveFmts;
	  }
	  /* Get Videos */
	  if (ytVideosContent) {
	    if (ytVideosContent.match(/&s=/) || ytVideosContent.match(/,s=/) || ytVideosContent.match(/u0026s=/)) {
	      var ytScriptURL = ytPageSource.match(/"js":\s*"(.*?)"/);
	      ytScriptURL = (ytScriptURL) ? ytScriptURL[1] : null;
	      if (ytScriptURL) {
		ytScriptURL = 'https:' + cleanMyContent(ytScriptURL, false);
		GM.xmlHttpRequest({
		  method: 'GET',
		  url: ytScriptURL,
		  onload: function(response) {
		    if (response.readyState === 4 && response.status === 200) {
		      ytScriptSrc = response.responseText;
		      if (ytScriptSrc) {
			ytDecryptFunction();
			ytVideos();
			ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>' + ytVideoList;
			modifyMyElement (target, 'div', ytVideoList, false);
		      }
		      else {
			ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script!';
			modifyMyElement (target, 'div', ytVideoList, false);
		      }
		    }
		    else {
		      ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script response!';
		      modifyMyElement (target, 'div', ytVideoList, false);
		    }
		  }
		});
	      }
	      else {
		ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script!';
		modifyMyElement (target, 'div', ytVideoList, false);
	      }
	    }
	    else {
	      ytVideos();
	      ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>' + ytVideoList;
	      modifyMyElement (target, 'div', ytVideoList, false);
	    }
	  }
	  else {
	    ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No videos content!';
	    modifyMyElement (target, 'div', ytVideoList, false);
	  }
	}
	else {
	  ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No videos!';
	  modifyMyElement (target, 'div', ytVideoList, false);
	}
      }
    });
  }
  catch(e) {
    try {
      GM_xmlhttpRequest({
	method: 'GET',
	url: url,
	onload: function(response) {
	  if (response.readyState === 4 && response.status === 200) {
	    /* Get Page Source */
	    ytPageSource = response.responseText;
	    /* Get Video Title */
	    ytVideoTitle = ytPageSource.match(/"title":"(.*?)","lengthSeconds"/);
	    ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	    if (!ytVideoTitle) {
	      ytVideoTitle = ytPageSource.match(/document.title\s*=\s*"(.*?)"/);
	      ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	    }
	    if (!ytVideoTitle) {
	      ytVideoTitle = ytPageSource.match(/meta\s+itemprop="name"\s+content="(.*?)"/);
	      ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	    }
	    if (!ytVideoTitle) {
	      ytVideoTitle = ytPageSource.match(/meta\s+property="og:title"\s+content="(.*?)"/);
	      ytVideoTitle = (ytVideoTitle) ? ytVideoTitle[1] : null;
	    }
	    if (ytVideoTitle) {
	      ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
	      ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
	      ytVideoTitle = ytVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
	      ytVideoTitle = ytVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
	      ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
	      ytVideoTitle = ytVideoTitle.replace(/^YouTube\s-\s/, '');
	    }
	    /* Get Video Length */
	    ytVideoLength = ytPageSource.match(/"lengthSeconds":"(.*?)"/);
	    ytVideoLength = (ytVideoLength) ? ytVideoLength[1] : null;
	    if (ytVideoLength) {
	      ytVideoLength = new Date(ytVideoLength * 1000).toISOString().substr(11, 8).replace(/00:0?/, '');
	    }
	    else {
	      ytVideoLength = ytPageSource.match(/meta\s+itemprop="duration"\s+content="(.*?)"/);
	      ytVideoLength = (ytVideoLength) ? ytVideoLength[1].replace('PT', '').replace('M', ':').replace('S', '') : null;
	    }
	    /* Get Videos Content */
	    var ytVideosEncodedFmts, ytVideosAdaptiveFmts;
	    ytVideosEncodedFmts = ytPageSource.match(/"url_encoded_fmt_stream_map":\s*"(.*?)"/);
	    ytVideosEncodedFmts = (ytVideosEncodedFmts) ? ytVideosEncodedFmts[1] : null;
	    if (ytVideosEncodedFmts) ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, false);
	    ytVideosAdaptiveFmts = ytPageSource.match(/"adaptive_fmts":\s*"(.*?)"/);
	    ytVideosAdaptiveFmts = (ytVideosAdaptiveFmts) ? ytVideosAdaptiveFmts[1] : null;
	    if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, false);
	    if (ytVideosEncodedFmts) {
	      ytVideosContent = ytVideosEncodedFmts;
	    }
	    if (ytVideosAdaptiveFmts) {
	      ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/clen=\d+&/g, '').replace(/&clen=\d+/g, '');
	      ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/lmt=\d+&/g, '').replace(/&lmt=\d+/g, '');
	      if (ytVideosContent) ytVideosContent += ',' + ytVideosAdaptiveFmts;
	      else ytVideosContent = ytVideosAdaptiveFmts;
	    }
	    /* Get Videos */
	    if (ytVideosContent) {
	      if (ytVideosContent.match(/&s=/) || ytVideosContent.match(/,s=/) || ytVideosContent.match(/u0026s=/)) {
		var ytScriptURL = ytPageSource.match(/"js":\s*"(.*?)"/);
		ytScriptURL = (ytScriptURL) ? ytScriptURL[1] : null;
		if (ytScriptURL) {
		  ytScriptURL = 'https:' + cleanMyContent(ytScriptURL, false);
		  GM_xmlhttpRequest({
		    method: 'GET',
		    url: ytScriptURL,
		    onload: function(response) {
		      if (response.readyState === 4 && response.status === 200) {
			ytScriptSrc = response.responseText;
			if (ytScriptSrc) {
			  ytDecryptFunction();
			  ytVideos();
			  ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>' + ytVideoList;
			  modifyMyElement (target, 'div', ytVideoList, false);
			}
			else {
			  ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script!';
			  modifyMyElement (target, 'div', ytVideoList, false);
			}
		      }
		      else {
			ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script response!';
			modifyMyElement (target, 'div', ytVideoList, false);
		      }
		    }
		  });
		}
		else {
		  ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No script!';
		  modifyMyElement (target, 'div', ytVideoList, false);
		}
	      }
	      else {
		ytVideos();
		ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>' + ytVideoList;
		modifyMyElement (target, 'div', ytVideoList, false);
	      }
	    }
	    else {
	      ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No videos content!';
	      modifyMyElement (target, 'div', ytVideoList, false);
	    }
	  }
	  else {
	    ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No videos!';
	    modifyMyElement (target, 'div', ytVideoList, false);
	  }
	}
      });
    }
    catch(e) {
      ytVideoList = ytVideoTitle + ' (' + ytVideoLength + ')<br>' + '<a href="' + url + '">' + url + '</a><br>ERROR: No videos!';
      modifyMyElement (target, 'div', ytVideoList, false);
    }
  }
}

function embedMyLinks (element) {
  var elements;
  if (element == 'iframe') elements = iframeElements;
  else if (element == 'object') elements = objectElements;
  else if (element == 'embed') elements = embedElements;
  var child, parent, video, param, name;
  var foundSite;
  var linkID, videoID, videoLink, videoURL;
  var myScriptLogo = [];
  myScriptLogo[element] = [];
  var myScriptMess = [];
  myScriptMess[element] = [];
  var myLinkWindow = [];
  myLinkWindow[element] = [];
  for (var e = elements.length - 1; e >= 0; e--) {
    foundSite = false;
    child = elements[e];
    parent = getMyElement (child, 'parent', '');
    if (element == 'iframe' || element == 'embed') {
      video = getMyElement (child, 'source', '');
    }
    else if (element == 'object') {
      params = getMyElement (child, 'children', 'param');
      for (var p = 0; p < params.length; p++) {
	name = getMyElement (params[p], 'name', '');
	if (name == 'movie' || name == 'src') {
	  video = getMyElement (params[p], 'value', '');
	  if (!video) video = getMyElement (params[p], 'source', '');
	}
      }
    }
    if (video) {
      for (var l = 0; l < linkParsers.length; l++) {
	if (video.match(linkParsers[l]['source'])) {
	  foundSite = true;
	  linkID = l;
	  break;
	}
      }
    }
    if (foundSite) {
      myScriptLogo[element][e] = createMyElement ('div', userscript);
      styleMyElement (myScriptLogo[element][e], {margin: '0px auto', padding: '10px', color: '#FFFFFF', fontSize: '20px', textAlign: 'center', textShadow: '#000000 -1px -1px 1px'});
      myScriptMess[element][e] = createMyElement ('div', '');
      myLinkWindow[element][e] = createMyElement ('div', '');
      appendMyElement (myLinkWindow[element][e], myScriptLogo[element][e]);
      appendMyElement (myLinkWindow[element][e], myScriptMess[element][e]);
      var childStyles = child.getAttribute('style');
      if (childStyles) {
	childStyles = childStyles.replace('absolute', 'relative');
	myLinkWindow[element][e].setAttribute('style', childStyles);
	styleMyElement (myLinkWindow[element][e], {backgroundColor: '#F4F4F4'});
      }
      else styleMyElement (myLinkWindow[element][e], {width: '100%', height: '100%', backgroundColor: '#F4F4F4'});
      styleMyElement (parent, {padding: '0px', height: '100%'});
      replaceMyElement(parent, myLinkWindow[element][e], child);
      videoID = video.match(linkParsers[linkID]['pattern']);
      videoID = (videoID) ? videoID[1] : null;
      if (videoID) {
	videoURL = linkParsers[linkID]['link'] + videoID;
	if (!option['secure']) videoURL = videoURL.replace(/^https/, 'http');
	styleMyElement (myScriptMess[element][e], {border: '3px solid #F4F4F4', margin: '0px auto', padding: '10px', backgroundColor: '#FFFFFF', color: '#00C000', textAlign: 'center', fontSize: '16px'});
	if (videoURL.indexOf('youtube.com') != -1) {
	  YouTube(videoURL, myScriptMess[element][e]);
	}
	else {
	  videoLink = '<a href="' + videoURL + '">' + videoURL + '</a>';
	  modifyMyElement (myScriptMess[element][e], 'div', videoLink, false);
	}
      }
      else {
	styleMyElement (myScriptMess[element][e], {border: '3px solid #F4F4F4', margin: '0px auto', padding: '10px', backgroundColor: '#FFFFFF', color: '#AD0000', textAlign: 'center', fontSize: '16px'});
	modifyMyElement (myScriptMess[element][e], 'div', warning, false);
      }
    }
  }

}


// ==========Websites========== //

/* Parsers */
var linkParsers = [
  {'source': 'youtube(.com|-nocookie.com)/embed/(videoseries|\\?list)', 'pattern': 'list=(.*?)(&|$)', 'link': 'https://www.youtube.com/playlist?list='},
  {'source': 'youtube(.com|-nocookie.com)/embed/', 'pattern': '/embed/(.*?)(\\?|&|$)', 'link': 'https://www.youtube.com/watch?v='},
  {'source': 'youtube(.com|-nocookie.com)/v/', 'pattern': '/v/(.*?)(\\?|&|$)', 'link': 'https://www.youtube.com/watch?v='},
  {'source': 'dailymotion.com/embed/', 'pattern': '/video/(.*?)$', 'link': 'https://www.dailymotion.com/video/'},
  {'source': 'dailymotion.com/swf/(?!video)', 'pattern': '/swf/(.*?)$', 'link': 'https://www.dailymotion.com/video/'},
  {'source': 'dailymotion.com/swf/(?=video)', 'pattern': '/video/(.*?)$', 'link': 'https://www.dailymotion.com/video/'},
  {'source': 'vimeo.com/video/', 'pattern': '/video/(.*?)(\\?|&|$)', 'link': 'https://vimeo.com/'},
  {'source': 'vimeo.com/moogaloop', 'pattern': '/moogaloop.swf\\?clip_id=(.*?)(&|$)', 'link': 'https://vimeo.com/'},
  {'source': 'metacafe.com/embed/', 'pattern': '/embed/(.*?)/', 'link': 'https://www.metacafe.com/watch/'},
  {'source': 'metacafe.com/fplayer/', 'pattern': '/fplayer/(.*?)/', 'link': 'https://www.metacafe.com/watch/'},
  {'source': 'funnyordie.com/embed/', 'pattern': '/embed/(.*?)$', 'link': 'https://www.funnyordie.com/videos/'},
  {'source': 'vk.com/video', 'pattern': 'video_ext.php\\?(.*?)$', 'link': 'http://vk.com/video_ext.php?'},
  {'source': 'hostname=www.twitch.tv', 'pattern': 'channel=(.*?)(&|$)', 'link': 'http://www.twitch.tv/'}
];

/* IFrame */
var iframeElements = getMyElement (document, 'children', 'iframe');
if (iframeElements.length > 0 ) embedMyLinks ('iframe');

/* Object */
var objectElements = getMyElement (document, 'children', 'object');
if (objectElements.length > 0 ) embedMyLinks ('object');

/* Embed */
var embedElements = getMyElement (document, 'children', 'embed');
if (embedElements.length > 0 ) embedMyLinks ('embed');


})();
