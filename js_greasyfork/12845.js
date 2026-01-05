// ==UserScript==
// @name         Background changer
// @namespace    lat.netne.net
// @version      0.1
// @include     http://*
// @include     https://*
// @include     https://www.youtube.com/
// @include     https://www.google.com/
// @description  changes background on the web
// @author        Warsoldier
// @downloadURL https://update.greasyfork.org/scripts/12845/Background%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/12845/Background%20changer.meta.js
// ==/UserScript==

window.onload = BG_change;
var isVisible = true;

function BG_change(){
   
    if(isVisible){
     document.body.style.backgroundImage = "url('http://www.hdwallpapery.com/static/images/cool-wallpapers-hd-8087-8418-hd-wallpapers_r11UrHZ.jpg')";//change the url address to your image you want around the web
    }
}