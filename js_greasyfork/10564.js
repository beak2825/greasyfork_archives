// ==UserScript==
// @name Youtube true 720p player
// @description Allows you to watch youtube videos in not distorted (scaled) 720p resolution.
// @author Jan harvalík harvalikjan@gmail.com
// @version 4.0
// @date 2017-1-4
// @include http://www.youtube.com/watch?*
// @include https://www.youtube.com/watch?*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant         GM_info 
// @grant         GM_getValue 
// @grant         GM_log 
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand 
// @grant         GM_setValue 
// @grant         GM_xmlhttpRequest 
// @grant         GM_addStyle 
// @grant         GM_getResourceText 
// @grant         GM_getResourceURL 
// @license     MIT License
// @namespace https://greasyfork.org/users/12627
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/10564/Youtube%20true%20720p%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/10564/Youtube%20true%20720p%20player.meta.js
// ==/UserScript==
GM_addStyle("\
  ::-webkit-scrollbar { display: none !important;}\
  body {background: black;}\
\
  #masthead-positioner:hover { opacity: 1; }\
  #masthead-positioner { opacity: 0; }\
\
  #yt-masthead-container {\
    padding-bottom: 0px;\
    padding-top: 0px;\
    height: 28px;\
  }\
  #yt-masthead-logo-container, #yt-masthead-user, #masthead-search {margin-top:0px;}\
  .appbar-hidden #masthead-positioner-height-offset {height: 24px;}\
\
  .watch-stage-mode .player-width {\
    width: 1280px;\
    left: -640px;}\
  .watch-stage-mode .player-height {\
    height: 720px;\
  }\
  #placeholder-player {margin-bottom: 90px;}\
  .ytp-scrubber-button { \
    background-color: #ffff00; /* yellow */\
    width:4px;\
  }\
  .ytp-scrubber-container {\
    top:-6px;\
    left:-2px;\
  }\
  .ytp-chrome-bottom, .ytp-gradient-bottom {display:none;}\
");
var countdown;
function startCountdown() {
	clearCountdown();

    countdown = setTimeout(function(){
        if (document.getElementsByClassName('playing-mode').length){
            document.body.style.cursor="none";
            document.getElementsByClassName('ytp-chrome-bottom')[0].style.display="none";
            document.getElementsByClassName('ytp-gradient-bottom')[0].style.display="none";
        }
    }, 400);
}

function clearCountdown() {
    document.body.style.cursor="default";
    clearTimeout(countdown);

    // these css rules need to updated
    document.getElementsByClassName('ytp-chrome-bottom')[0].style.display="block";
    document.getElementsByClassName('ytp-gradient-bottom')[0].style.display="block";
    
	document.getElementsByClassName('ytp-scrubber-button')[0].style.height="32px";
	document.getElementsByClassName('ytp-progress-bar-container')[0].style.height="20px";
}

document.getElementsByTagName('video')[0].onmousemove = function() {startCountdown();};
document.getElementsByTagName('video')[0].onmouseout = function() {clearCountdown();};


window.onresize = function (event) {
    if (window.screen.height == window.innerHeight) {
         window.scrollTo(0, 0);
    }
};