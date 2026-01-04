// ==UserScript==
// @name         GOogle Images
// @namespace    http://tampermonkey.net/
// @version      2024-01-15
// @description  random images
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at     document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/484936/GOogle%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/484936/GOogle%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    javascript:(function(){javascript:(function(){var randomBetween = (min,max) => Math.floor(Math.random()*max+min);

var images = ["https://t4.ftcdn.net/jpg/01/24/41/03/360_F_124410367_M538eQuhp4ItuXE2RVt5m75kODW2nTZz.jpg","https://i.pinimg.com/originals/c8/0d/8a/c80d8a27828a06dbf376381ec54a4f57.jpg","https://i.pinimg.com/originals/aa/f7/35/aaf735309aac0a1ee44de035c29b13cc.jpg"];



setInterval(function(){

var els = document.querySelectorAll("*");

els.forEach(v=>{
var r = randomBetween(100,300);


var g = randomBetween(100,300);


var b = randomBetween(100,300);

var i = images[Math.floor(Math.random()*images.length)];



v.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
v.style.backgroundImage = `url(${i})`;
v.style.backgroundPosition = "center";
v.style.backgroundSize = "cover";
v.style.backgroundRepeat = "no-repeat";
})




},0)})();})();



})();