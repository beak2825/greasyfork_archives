// ==UserScript==
// @name            Always show the control bar below the video
// @name:es       Mostrar siempre la barra de control debajo del vídeo.
// @version         1.6
// @description   Show all the time the control bar below the video with a cheap trick
// @description:es   Muestra todo el tiempo la barra de control debajo del vídeo con un truco barato
// @author          AlExito
// @match          https://www.youtube.com/*
// @license        MIT   feel free to modify improve and share
// @noframes
// @namespace https://greasyfork.org/es/users/758165-AlÉxito
// @downloadURL https://update.greasyfork.org/scripts/474286/Always%20show%20the%20control%20bar%20below%20the%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/474286/Always%20show%20the%20control%20bar%20below%20the%20video.meta.js
// ==/UserScript==
let css = `
.ytp-gradient-top, .ytp-gradient-bottom {display: none !important;} 
.ytp-live .ytp-time-current, .ytp-live .ytp-time-separator{display: inline-table !important;} 
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy { height: 59.3vw; }
ytd-watch-flexy[flexy]:not([is-vertical-video_]) #player-container-inner.ytd-watch-flexy { height: 30px; }
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy { padding-bottom: 40px;}
ytd-player, #container.ytd-player { height: 100%; }
div#[full-bleed-player] ytd-player, #container.ytd-player { height: 103%; }
div#[full-bleed-player] .ytp-chrome-bottom { bottom: -5px !important; }
.ytp-chrome-bottom { bottom: -15px !important; }
.ytp-progress-bar-container { bottom: 40px !important;}  
 
.ytp-popup.ytp-settings-menu { opacity: 0; }
.ytp-popup.ytp-settings-menu:hover { opacity: 1; }
`;
let style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

function funsiona(){
if (window.location.href.indexOf("/watch?v=") > 1) {
   var vid = document.querySelector('video');
     vid.addEventListener('timeupdate', funsionb, false);
function funsionb(){
        var butElement = document.getElementsByClassName("ytp-settings-button")[0];
        var progres = document.querySelector(".ytp-progress-bar-container:hover");
        var menElement = document.getElementsByClassName("ytp-settings-menu")[0];
        if (!progres && menElement.style.display == "none"){
        butElement.dispatchEvent(new Event("click"));
        };
        if (progres){
        vid.removeEventListener('timeupdate', funsionb, false);
        setTimeout(funsiona, 2000);
        };
 };

vid.addEventListener('click', e => {
  if (event.button === 0 ) {
    vid.pause();
   };
  });

 };
};

window.addEventListener('yt-page-data-updated',function(){
setTimeout(funsiona, 1000);
});