// ==UserScript==
// @name            Remove useless buttons
// @name:es       Quitar botones inútiles
// @namespace   https://greasyfork.org/es/users/758165-alexito
// @match           https://www.youtube.com/*
// @grant            none
// @version         1.3
// @author          AlExito
// @description       Remove useless buttons from the menu: download, share, dislike, report, clip, thankyou
// @description:es   Quitar botones inútiles del menu: descargar, compartir, dislike, denunciar, recortar,gracias
// @noframes
// @license        MIT   feel free to modify improve and share
// @downloadURL https://update.greasyfork.org/scripts/476799/Remove%20useless%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/476799/Remove%20useless%20buttons.meta.js
// ==/UserScript==
(function () {
  actiona();
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
function check(changes, observer) {
  let menuObj = document.querySelector("tp-yt-iron-dropdown");
  if(menuObj){
    actionb();
setTimeout(actiona, 5000);
  };
 };

function actiona() {
var butmenu = document.querySelector('#button-shape > button > div > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="M7.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm4.5-1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"]');
if(butmenu){
   butmenu.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
 };
};

function actionb() {
var butdowloada = document.querySelector("ytd-download-button-renderer");
if(butdowloada){
    butdowloada.remove();
};
var butclip = document.querySelector('ytd-menu-service-item-renderer > tp-yt-paper-item > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z"]');
if(butclip){
    butclip.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butclipb = document.querySelector('ytd-button-renderer > yt-button-shape > button > div > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z"]');
if(butclipb){
    butclipb.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butthankyou = document.querySelector("ytd-button-renderer > yt-button-shape > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d='M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z']")
if(butthankyou){
    butthankyou.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butthankyoub = document.querySelector("ytd-menu-service-item-renderer > tp-yt-paper-item > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d='M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm5.5-15c-1.74 0-3.41.88-4.5 2.28C10.91 2.88 9.24 2 7.5 2 4.42 2 2 4.64 2 7.99c0 4.12 3.4 7.48 8.55 12.58L12 22l1.45-1.44C18.6 15.47 22 12.11 22 7.99 22 4.64 19.58 2 16.5 2zm-3.75 17.85-.75.74-.74-.73-.04-.04C6.27 14.92 3 11.69 3 7.99 3 5.19 4.98 3 7.5 3c1.4 0 2.79.71 3.71 1.89L12 5.9l.79-1.01C13.71 3.71 15.1 3 16.5 3 19.02 3 21 5.19 21 7.99c0 3.7-3.28 6.94-8.25 11.86z']")
if(butthankyoub){
    butthankyoub.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butreport = document.querySelector('ytd-menu-service-item-renderer > tp-yt-paper-item > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z"]');
if(butreport){
    butreport.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butshare = document.querySelector('ytd-menu-service-item-renderer > tp-yt-paper-item > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"]');
if(butshare){
    butshare.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
};
var butdownload = document.querySelector("ytd-menu-service-item-download-renderer");
if(butdownload){
butdownload.remove();
 };
var butupvideo = document.querySelector("#buttons > ytd-topbar-menu-button-renderer:nth-child(3)");
if(butupvideo){
butupvideo.remove();
 };
var butdislike = document.querySelector("#segmented-dislike-button");
if(butdislike){
butdislike.remove();
 };
var butshareb = document.querySelector('#top-level-buttons-computed > ytd-button-renderer > yt-button-shape > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"]');
if(butshareb){
  butshareb.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
 };

var butsharec = document.querySelector("#top-level-buttons-computed > yt-button-view-model > button-view-model > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-icon-shape > icon-shape > div > svg > path[d='M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z']");
if(butsharec){
  butsharec.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
 };

};

})();