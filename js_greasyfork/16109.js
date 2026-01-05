// ==UserScript==
// @name		SaveTube+
// @version		2018.11.12
// @description		Download videos from web sites.
// @author		sebaro
// @namespace		http://sebaro.pro/savetube
// @icon		https://gitlab.com/sebaro/savetube/raw/master/savetube.png
// @include		*
// @noframes
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/16109/SaveTube%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/16109/SaveTube%2B.meta.js
// ==/UserScript==


/*

  Copyright (C) 2014 - 2018 Sebastian Luncan

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

  Website: http://sebaro.pro/savetube
  Contact: http://sebaro.pro/contact

*/


(function() {


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube';

// Contact
var contact = 'http://sebaro.pro/contact';


// ==========Fixes========== //

// Don't run on frames or iframes
if (window.top && window.top != window.self)  return;


// ==========Websites========== //

/* Page Source */
var xmlHTTP = new XMLHttpRequest();
xmlHTTP.open('GET', window.location.href, false);
xmlHTTP.send();
var source = xmlHTTP.responseText + document.getElementsByTagName('html')[0].innerHTML;
if (!source) return;

/* Video Patterns */
var patterns = [
  '=(http[^=\'"]*?\\.(mp4|flv|webm|m3u8).*?)&',
  'file\s*:\s*"(http[^")]*?\\.(mp4|flv|webm|m3u8).*?)"',
  'src="(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '"(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '\'(http[^\']*?\\.(mp4|flv|webm|m3u8).*?)\''
  ];

/* Video Matcher */
var pattern, matches, matcher, video, type;
var links = '';
for (var i = 0; i < patterns.length; i++) {
  pattern = new RegExp(patterns[i], 'g');
  matches = source.match(pattern);
  if (matches) {
    for (var v = 0; v < matches.length; v++) {
      matcher = matches[v].match(patterns[i]);
      video = (matcher) ? matcher[1] : null;
      if (video) {
	video = video.replace(/\\/g, '');
	if (video.indexOf('%') != -1) video = unescape(video);
	if (video.indexOf('&amp;') != -1) video = video.replace(/&amp;/g, '&');
	if (video.indexOf('http') == 0 && !video.match(/(thumb|\.jpg|\.png|\.gif|\.htm|format=|\/\/[^\/]*?(mp4|flv|webm|m3u8))/)) {
	  if (video.indexOf('.mp4') != -1) type = 'MP4';
	  else if (video.indexOf('.flv') != -1) type = 'FLV';
	  else if (video.indexOf('.webm') != -1) type = 'WebM';
	  else if (video.indexOf('.m3u8') != -1) type = 'M3U8';
	  else type = 'Video';
	  if (links.indexOf(video) == -1) links += ' <a href="' + video + '" style="color:#2C72C7">' + type + '</a>';
	}
      }
    }
  }
}
if (links) {
  var panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '0px';
  panel.style.right = '25px';
  panel.style.zIndex = '2000000000';
  panel.style.color = '#336699';
  panel.style.backgroundColor = '#FFFFFF';
  panel.style.padding = '5px 5px 10px 5px';
  panel.style.fontSize = '12px';
  panel.style.fontWeight = 'bold';
  panel.style.borderLeft = '3px solid #EEEEEE';
  panel.style.borderRight = '3px solid #EEEEEE';
  panel.style.borderTop = '3px solid #EEEEEE';
  panel.style.borderRadius = '5px 5px 0px 0px';
  panel.innerHTML = '<a href="' + contact + '" style="color:#336699; font-weight:bold; text-decoration:none">' + userscript + '</a>: ' + links;
  var button = document.createElement('div');
  button.innerHTML = '<';
  button.style.height = '12px';
  button.style.border = '1px solid #CCCCCC';
  button.style.borderRadius = '3px';
  button.style.padding = '0px 5px';
  button.style.display = 'inline';
  button.style.color = '#CCCCCC';
  button.style.fontSize = '12px';
  button.style.textShadow = '0px 1px 1px #CCCCCC';
  button.style.cursor = 'pointer';
  button.style.marginLeft = '10px';
  button.addEventListener('click', function() {
    if (panel.style.right == '25px') {
      panel.style.left = '25px';
      panel.style.right = 'auto';
      button.innerHTML = '>';
    }
    else {
      panel.style.left = 'auto';
      panel.style.right = '25px';
      button.innerHTML = '<';
    }
  }, false);
  panel.appendChild(button);
  document.body.appendChild(panel);
}

})();
