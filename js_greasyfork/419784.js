// ==UserScript==
// @name         Free Sound Snap
// @name      Free soundsnap.com
// @name:ru      Бесплатный soundsnap.com
// @namespace    FreeSoundSnap
// @version      0.3
// @icon        https://index.tnwcdn.com/images/2d2e82ceac6513cb8130834a8862e2aeae30cca5.jpg
// @icon64      https://index.tnwcdn.com/images/2d2e82ceac6513cb8130834a8862e2aeae30cca5.jpg
// @description  Free download from soundsnap.com
// @description:ru  Бесплатная загрузка с сайта soundsnap.com
// @author       Wladek prod.
// @match        *://www.soundsnap.com/*
// @grant        none
// @run-at document-body
// @description Free download from soundsnap.com
// @downloadURL https://update.greasyfork.org/scripts/419784/Free%20Sound%20Snap.user.js
// @updateURL https://update.greasyfork.org/scripts/419784/Free%20Sound%20Snap.meta.js
// ==/UserScript==
	
var elements = document.getElementsByClassName("ojoo-button");
for( var i = 0; i < wavesurfer.length; i++ )
{
  var idwave = i;
  if (wavesurfer[idwave] === undefined) continue;
  var downlink = wavesurfer[idwave].backend.song;
  var colorArray2 = document.body.getElementsByClassName("audio-download");
  var innerHtml = "";
  innerHtml += '<a href="'+downlink+'" class="si_buttons si_download mp3-download">free mp3</a>';
  var node = document.querySelector('#node-' + idwave + ' > div > div > div:nth-child(1) > div.audio-download');
  node.innerHTML = innerHtml;
}