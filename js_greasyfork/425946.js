// ==UserScript==
// @name         Argel fonts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gota.io pixel font by Prof discord is .proffi
// @author       .proffi discord
// @match        https://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425946/Argel%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/425946/Argel%20fonts.meta.js
// ==/UserScript==
var fontURL = "https://dl.dropboxusercontent.com/scl/fi/zh3zguw0epo6mmdl5b27t/DrPhibes-nRWL0.ttf?rlkey=3kciwcjga0qoiey8jnh8tkd02&dl=0"
if(fontURL!="")
{

    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)

}
