// ==UserScript==
// @name        ProxerStream_LocalStorageVolume
// @author      Dravorle
// @namespace   proxer.me
// @description Speichert die Lautstärke bei Änderung und setzt diese beim Start ein. Simple Version.
// @include     http://stream.proxer.me/embed-*
// @version     1
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/18062/ProxerStream_LocalStorageVolume.user.js
// @updateURL https://update.greasyfork.org/scripts/18062/ProxerStream_LocalStorageVolume.meta.js
// ==/UserScript==

var v = localStorage.getItem("streamVolume");
var player = $("video")[0];
if(v !== null) {
  player.volume = v;
}

$("video").on("volumechange", function() {
  console.log(player.volume);
  localStorage.setItem("streamVolume", player.volume);
});
