// ==UserScript==
// @name         【第六】サイレントボイス
// @version      0.5
// @author       You
// @match        https://tw6.jp/gallery/?id=*
// @grant        none
// @namespace http://tampermonkey.net/
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/388063/%E3%80%90%E7%AC%AC%E5%85%AD%E3%80%91%E3%82%B5%E3%82%A4%E3%83%AC%E3%83%B3%E3%83%88%E3%83%9C%E3%82%A4%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/388063/%E3%80%90%E7%AC%AC%E5%85%AD%E3%80%91%E3%82%B5%E3%82%A4%E3%83%AC%E3%83%B3%E3%83%88%E3%83%9C%E3%82%A4%E3%82%B9.meta.js
// ==/UserScript==

(function() {
if(document.getElementsByClassName('btn-b')[0]){

var voice = document.getElementsByClassName('btn-b')[0];
var voice_play = new Audio();
voice_play.src = voice.getAttribute('data-soundfile');

var voice_audio = document.createElement('audio');
voice_audio.setAttribute('controls', '');
voice_audio.setAttribute('preload', "metadata");
voice.parentNode.insertBefore(voice_audio, voice.nextSibling);
var voice_source = document.createElement('source');
voice_source.setAttribute('src', voice_play.src);
voice_source.setAttribute('type', "audio/mp3");
voice_audio.appendChild(voice_source);


}
})();