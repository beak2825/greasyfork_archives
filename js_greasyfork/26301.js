// ==UserScript==
// @name        Crunchyroll: Larger Manga Reader
// @icon        http://crunchyroll.com/favicon.ico
// @author      stolemyowncar
// @namespace   http://www.crunchyroll.com/forumtopic-886883/two-suggestions-for-the-manga-reader
// @description Use more space for the manga reader when reading manga at Crunchyroll.
// @include     http://www.crunchyroll.com/comics_read/manga*
// @include     http://www.crunchyroll.com/comics_read/*/manga*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26301/Crunchyroll%3A%20Larger%20Manga%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/26301/Crunchyroll%3A%20Larger%20Manga%20Reader.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
    '#header_beta { position:absolute; width:100%; } ' +
    '#header_beta:hover { z-index:5; }' + 
    '#showmedia_mangareader_title { display:none; }'
);
var container2=document.getElementById('template_container');
var container3=document.getElementById('template_body');
var container=document.getElementById('showmedia_mangareader_container');
container.style.height="1000px";
container.style.width="100%";
container2.style.width="100%";
container3.style.width="95%";
var player=document.getElementById('showmedia_videoplayer_object');
player.style.height="1000px";
var actualplayer=player.getElementsByTagName("embed")[0];
actualplayer.style.height="950px";