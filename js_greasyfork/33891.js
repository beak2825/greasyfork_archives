// ==UserScript==
// @name        Download Instagram Image
// @author m4x
// @match   https://www.instagram.com/p/*
// @description Add button Download for an Instagram Image
// @version     1.2
// @grant       none
// @namespace https://www.instagram.com/p/*
// @downloadURL https://update.greasyfork.org/scripts/33891/Download%20Instagram%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/33891/Download%20Instagram%20Image.meta.js
// ==/UserScript==

var header = document.getElementsByClassName('_7b8eu _9dpug')[0];
var img = document.getElementsByClassName('_2di5p')[0];
var imgUrl = img.getAttribute('src');
var buttonDown = document.createElement('a');
buttonDown.innerText = 'Download';
buttonDown.setAttribute('id', 'buttonDown');
buttonDown.setAttribute('href', imgUrl);
header.appendChild(buttonDown);