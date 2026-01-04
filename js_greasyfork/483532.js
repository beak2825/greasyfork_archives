// ==UserScript==
// @name         Comic sans for gota
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom Font For Gota by Try
// @author       Try
// @match        https://gota.io/web/*
// @grant        none
// @license      Try
// @downloadURL https://update.greasyfork.org/scripts/483532/Comic%20sans%20for%20gota.user.js
// @updateURL https://update.greasyfork.org/scripts/483532/Comic%20sans%20for%20gota.meta.js
// ==/UserScript==
var fontURL = "https://www.dropbox.com/scl/fi/enmvwsc5e9fxazr9g3rvc/LDF-ComicSans.zip?rlkey=fulyblyw455rv0x9e0vd1pfc9&dl=0"
if(fontURL!="")
{
 
    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)
 
}