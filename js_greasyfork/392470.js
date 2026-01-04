// ==UserScript==
// @name         Free Sound Snap
// @name:en      Free soundsnap.com
// @name:ru      Бесплатный soundsnap.com
// @namespace    FreeSoundSnap
// @version      0.1
// @icon        https://index.tnwcdn.com/images/2d2e82ceac6513cb8130834a8862e2aeae30cca5.jpg
// @icon64      https://index.tnwcdn.com/images/2d2e82ceac6513cb8130834a8862e2aeae30cca5.jpg
// @description:en  Free download from soundsnap.com
// @description:ru  Бесплатная загрузка с сайта soundsnap.com
// @author       Wladek prod.
// @match        *://www.soundsnap.com/*
// @grant        none
// @run-at document-body
// @description Free download from soundsnap.com
// @downloadURL https://update.greasyfork.org/scripts/392470/Free%20Sound%20Snap.user.js
// @updateURL https://update.greasyfork.org/scripts/392470/Free%20Sound%20Snap.meta.js
// ==/UserScript==
	
	var elements = document.getElementsByClassName("ojoo-button");
    for( var i = 0; i < wavesurfer.length; i++ )
    {
      	var idwave = i;
      	var downlink = wavesurfer[idwave].backend.song;
      	var colorArray2 = document.body.getElementsByClassName("audio-download");
        var innerHtml = "";
        innerHtml += '<b>Free MP3 Download      <b><a href="'+downlink+'" class=" si_buttons si_download  mp3-download">free</a>';
        colorArray2[i].innerHTML = innerHtml;
    }