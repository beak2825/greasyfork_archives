// ==UserScript==
// @name         DarkFuhrer
// @namespace    https://hackforums.net
// @include      http://www.hackforums.net/*
// @include      http://hackforums.net/*
// @version      1.1
// @description  Replaces DARK's userbar on Hackforums with the correct version
// @author       Shockwave
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/15152/DarkFuhrer.user.js
// @updateURL https://update.greasyfork.org/scripts/15152/DarkFuhrer.meta.js
// ==/UserScript==

function replaceImages() {
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        if (images[i].src.indexOf('http://hackforums.net/images/modern_bl/groupimages/english/dark.jpg') !== -1) {
            images[i].src = images[i].src.replace("http://hackforums.net/images/modern_bl/groupimages/english/dark.jpg", "https://i.imgur.com/Z5d8rZz.png");
        }
    }
}

replaceImages();

setInterval(function() {
    replaceImages();
}, 300);

window.addEventListener('load', function() {
    replaceImages();
}, false);
