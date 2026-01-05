// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         youtube-nsfw
// @version      0.01
// @description  NSFW Youtube
// @icon         http://s.ytimg.com/yts/img/favicon_48-vfl1s0rGh.png
// @include      /^(?:https?:)?\/\/(www\.)?youtube\.com\/.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/18564/youtube-nsfw.user.js
// @updateURL https://update.greasyfork.org/scripts/18564/youtube-nsfw.meta.js
// ==/UserScript==
//
if(document.getElementById('watch7-player-age-gate-content'))
{
 document.getElementById('player-unavailable').classList.add('hid');
 var p=document.getElementById('player-api');
 p.classList.remove('off-screen-target');
 p.innerHTML='<iframe class="player-width player-height" src="//www.youtube.com/embed/'+document.querySelector('meta[itemprop="videoId"]').getAttribute('content')+'?autoplay=1"/>';
}
