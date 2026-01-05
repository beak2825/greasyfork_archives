// ==UserScript==
// @name        AutoOnMusic
// @namespace   edikxl,music,vk
// @include     https://vk.com/audios156543993
// @version     1
// @grant       none
// @description Nice code!
// @downloadURL https://update.greasyfork.org/scripts/24750/AutoOnMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/24750/AutoOnMusic.meta.js
// ==/UserScript==
var musicCool = document.getElementsByClassName('audio_playlist_wrap _audio_playlist');
musicCool[0].childNodes[0].click();