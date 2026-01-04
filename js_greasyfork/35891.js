// ==UserScript==
// @name         Konoha HTML5 Player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds HTML5 player to Konoha.cz page for Boruto
// @author       MangaHito
// @match        http://147.32.8.168/?q=anime/boruto/*
// @downloadURL https://update.greasyfork.org/scripts/35891/Konoha%20HTML5%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/35891/Konoha%20HTML5%20Player.meta.js
// ==/UserScript==

var video = document.createElement('video');
var pathname = String(window.location);
var episode = pathname.substr(36,3);

$(".nextepisode").prepend ( `
    <div id="HTML5Video">
      <br>
      <center>
      <div style="position: absolute; margin-left: 620px; margin-top: 15px;"><img width=50px src="https://image.ibb.co/imXksm/konoha_leaf_logo_277_E238_E29_seeklogo_com.png"></div>
      <video id="video1" style="width:700px;max-width:100%;" controls="">
          <source src="files/naruto/boruto`+ episode +`.mp4" type="video/mp4">
      </video>
      </center>
    </div>
` );