// ==UserScript==
// @name         Font 
// @version      1
// @description  Gota.io font by Prof discord is .proffi
// @author       Prof
// @match        https://gota.io/web/*
// @namespace https://greasyfork.org/users/705337
// @downloadURL https://update.greasyfork.org/scripts/491163/Font.user.js
// @updateURL https://update.greasyfork.org/scripts/491163/Font.meta.js
// ==/UserScript==

var fontURL = "https://fonts.gstatic.com/s/shantellsans/v4/FeUaS0pCoLIo-lcdY7kjvNoQqWVWB0qWpl29ajppTuUTu_kJKmHesPOL-maYi4xZeHCNQ09eBlmv2QcUzJ39-rAISYR8S1ixwv0.woff2"
if(fontURL!=""){
    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)
}