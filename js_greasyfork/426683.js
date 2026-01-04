// ==UserScript==
// @name         Pixel font 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gota.io pixel font by Prof discord is .proffi
// @author       discord .proffi
// @match        https://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426683/Pixel%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/426683/Pixel%20font.meta.js
// ==/UserScript==
var fontURL = "https://dl.dropbox.com/scl/fi/yrdqtkwdufc9ecgv0rvrk/vtf-misterpixel.regular.otf?rlkey=9zmt2u8ub6nb0rm39uhywuota&dl=0"
if(fontURL!="")
{

    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)

}
