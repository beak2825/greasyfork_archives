// ==UserScript==
// @name         AutoResolution Youtube
// @name:ru-ru   Автоматическое Качество YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set Video Quality / Resolution static
// @description:ru-ru Установи одно качество для всех видео. Больше никакого Auto и HD, когда не надо
// @author       T6751
// @match        *://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398397/AutoResolution%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/398397/AutoResolution%20Youtube.meta.js
// ==/UserScript==

// Debugged on Firefox, Desktop

/*
7 - 4k
6 - 1080p
5 - 720p
4 - 480p
3 - 360p
2 - 240p
1 - 144p
0 - Auto
*/
// USER SETTINGS BEGIN --------

var Resolution=3 //default 3 (360p)

// USER SETTINGS END ----------


function main() {
//'use strict';

    setTimeout(a,500)
    setTimeout(b,510)
    setTimeout(c,520)
}
function a(){
console.log("a")
document.getElementsByClassName("ytp-button ytp-settings-button")[0].click()
}
function b(){
console.log("b")
document.getElementsByClassName("ytp-menuitem")[document.getElementsByClassName("ytp-menuitem").length-1].click()
}
function c(){
console.log("c")
if (document.getElementsByClassName("ytp-menuitem").length>4)
{
document.getElementsByClassName("ytp-menuitem")[document.getElementsByClassName("ytp-menuitem").length-1-Resolution].click()
}
else
{
document.getElementsByClassName("ytp-menuitem")[document.getElementsByClassName("ytp-menuitem").length-1].click()
}
}
window.addEventListener("yt-navigate-finish", main);
window.addEventListener("spfdone", main);
main()
