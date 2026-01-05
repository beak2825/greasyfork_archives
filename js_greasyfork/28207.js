// ==UserScript==
// @name        YouTube Player for TKG
// @namespace   www.torrent.kg
// @description Автомат. замена ссылок вида youtu.be на плеер для TorrentPier / Thanks yup from forum.mozilla-russia.org
// @include     http://www.torrent.kg/forum/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28207/YouTube%20Player%20for%20TKG.user.js
// @updateURL https://update.greasyfork.org/scripts/28207/YouTube%20Player%20for%20TKG.meta.js
// ==/UserScript==
//document.body.innerHTML= document.body.innerHTML.replace(/111/g,"222");
var player, i, link, links = document.getElementsByClassName("postLink");
for (i = links.length-1; i >= 0; i--) {
  link = links[i];
  if ((link.nodename == "A") || (link.hostname == "youtu.be")) {
    player = document.createElement("iframe");
    player.src = "https://www.youtube.com/embed" + link.pathname + "?ecver=2";
    player.width = 640;
    player.height = 360;
    player.frameBorder = 0;
    player.allowFullscreen = true;
    link.parentElement.replaceChild(player, link);
  }
}