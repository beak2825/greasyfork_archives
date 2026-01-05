// ==UserScript==
// @name        SABnzb and frame
// @namespace   armeagle.nl
// @include     http://192.168.18.26:8006/
// @version     1
// @description Add a frame with next-episode.net to SABnzbd
// @downloadURL https://update.greasyfork.org/scripts/3037/SABnzb%20and%20frame.user.js
// @updateURL https://update.greasyfork.org/scripts/3037/SABnzb%20and%20frame.meta.js
// ==/UserScript==

//try {
var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.textContent = ''+
'#master-width {'+
'	width: 70% !important;'+
'	margin: 0;'+
'}' +
'#side-frame {'+
'	position: absolute;'+
'	right: 0px;'+
'	top: 0px;'+
'   overflow: scroll'+
'}';
document.head.appendChild(style);


var masterDiv = document.querySelector('#master-width');
masterDiv.setAttribute('style', 'width: 70%; margin: 0;');

var sideFrame = document.createElement('object');
sideFrame.setAttribute('type', 'text/html');
sideFrame.setAttribute('width', '30%');
sideFrame.setAttribute('height', '100%');
sideFrame.setAttribute('data', 'http://next-episode.net');
sideFrame.setAttribute('id', 'side-frame');

masterDiv.parentNode.insertBefore(sideFrame, masterDiv);
//} catch (e) {
//	alert(e);
//}