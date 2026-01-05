// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         youtube-stop-autostart
// @version      0.02
// @description  Stop autostart videos on youtube
// @icon         http://s.ytimg.com/yts/img/favicon_48-vfl1s0rGh.png
// @include      /^(https?:)?\/\/(www\.)?youtube\.com\/*.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/18280/youtube-stop-autostart.user.js
// @updateURL https://update.greasyfork.org/scripts/18280/youtube-stop-autostart.meta.js
// ==/UserScript==
// v0.01: document.querySelector('#movie_player').cueVideoByPlayerVars(document.querySelector('#movie_player').getVideoData());
// v0.02:
function ytStopVideo(i){i&&(i=document.querySelector(i))&&i.cueVideoByPlayerVars(i.getVideoData())}
if(/^\/(channel|user)\//i.exec(location.pathname)) // '/channel/CHANNEL_ID' or '/user/UserName'
 (new MutationObserver(function(m){ytStopVideo('#c4-player')})).observe(document.querySelector('#upsell-video'),{childList:true});
else // '/watch?v=VIDEO_ID'
 ytStopVideo('#movie_player');
