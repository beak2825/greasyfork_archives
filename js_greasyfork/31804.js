// ==UserScript==
// @name         Clickb8io art script
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  '=' to max out drawing cursor
// @author       meatman2tasty
// @match        http://clickb8.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31804/Clickb8io%20art%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31804/Clickb8io%20art%20script.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // press 'x' to fill chat
    if (a.keyCode == 187) {
        mainContext.lineWidth = 2000;
    }
}, false);

var imageLoader = document.createElement('input');
imageLoader.type = "file"
imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('thumbnailPaintCanvas');
var ctx = canvas.getContext('2d');
function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}
document.getElementById('createVideoContainer').appendChild(imageLoader);