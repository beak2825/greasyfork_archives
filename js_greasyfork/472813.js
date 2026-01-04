// ==UserScript==
// @name         SoundCloud Go+
// @namespace    https://blades.gay/sosa
// @version      1.0
// @description  SoundCloud With No Ads
// @author       @sosarust
// @match        *https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472813/SoundCloud%20Go%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/472813/SoundCloud%20Go%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){

var source = document.getElementsByTagName('html')[0].innerHTML;
var found = source.search("Advertisement");

if(found != -1){
  window.location.reload(true);
}


 }, 1000);

function alertFunction() {

setTimeout(function(){
    var btn = document.querySelector(".playControls__play");
    btn.click();
}, 3000);


}

window.onload = alertFunction;
})();