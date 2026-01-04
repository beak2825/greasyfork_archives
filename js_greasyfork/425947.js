// ==UserScript==
// @name         Autobus bold font
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Gota.io pixel font by Prof discord is .proffi
// @author       discord .proffi
// @match        https://gota.io/web/*
// @grant        none
// @license      Prof
// @downloadURL https://update.greasyfork.org/scripts/425947/Autobus%20bold%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/425947/Autobus%20bold%20font.meta.js
// ==/UserScript==
var fontURL = "https://dl.dropboxusercontent.com/scl/fi/oi8qtd5u4jzu7doczmpmj/Autobus-Bold.ttf?rlkey=hvooosqex70j31ojmh415sfqy&dl=0?"
if(fontURL!="")
{

    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)

}
