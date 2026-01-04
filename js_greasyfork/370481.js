// ==UserScript==
// @name         Always show video metadata/time on YT Leanback.
// @namespace    http://thelmgn.com/
// @version      0.1
// @description  Shows a scaled down version of the play bar and video metadata on YT Leanback (https://youtube.com/tv)
// @author       theLMGN
// @match        https://www.youtube.com/tv*
// @licence      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370481/Always%20show%20video%20metadatatime%20on%20YT%20Leanback.user.js
// @updateURL https://update.greasyfork.org/scripts/370481/Always%20show%20video%20metadatatime%20on%20YT%20Leanback.meta.js
// ==/UserScript==

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

(function() {
    'use strict';
    addStyleString(`#transport-controls.hidden>#fresh-rows-container>.main-row,.hidden>.player-meta{display:block!important;opacity:1!important;left:50%!important;position:fixed!important}#transport-controls.hidden>#fresh-rows-container>.main-row{bottom:0!important;transform:translate(-50%) scale(.5)!important}.hidden>.player-meta{top:0!important;transform:translate(-50%,-50%) scale(.5)!important}.title-card.hidden{opacity:1}.title-card.hidden::after{background:linear-gradient(to top,#000,transparent 15%)!important;width:100%!important;height:25%!important;position:fixed!important;top:0!important;left:0!important;z-index:100!important}.title-card{background:linear-gradient(to bottom,#000,transparent 30%)!important}#transport-controls.hidden{opacity:1!important;background:linear-gradient(to top,#000,transparent 15%)!important}#transport-controls.hidden>#fresh-rows-container>.controls-row,#transport-controls.hidden>#fresh-rows-container>.main-row>#progress-bar>.progress-bar-line>.progress-bar-loaded,#transport-controls.hidden>#fresh-rows-container>.main-row>#progress-bar>.progress-bar-playhead{display:none!important}`);
    setInterval(function() {
        document.querySelector("#transport-controls.hidden > #fresh-rows-container > .main-row > #progress-bar> .progress-bar-line > .progress-bar-played").style.width = `${document.querySelector("video").getCurrentTime() / document.querySelector("video").getDuration() * 100}%`
        document.querySelector("#transport-controls.hidden > #fresh-rows-container > .main-row > #player-time-elapsed").innerText = millisToMinutesAndSeconds(document.querySelector("video").getCurrentTime() * 1000)
        document.querySelector("#transport-controls.hidden > #fresh-rows-container > .main-row > .player-time-total").innerText = millisToMinutesAndSeconds(document.querySelector("video").getDuration() * 1000)


    }, 60)
})();