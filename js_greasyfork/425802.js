// ==UserScript==
// @name         Custom Font Skyrxss X
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Custom Font For Gota by Skyrxss X
// @author       Skyrxss X
// @match        https://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425802/Custom%20Font%20Skyrxss%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/425802/Custom%20Font%20Skyrxss%20X.meta.js
// ==/UserScript==
///////////////////////////
///EVENG YARRAĞIMI YESİN///
///////////////////////////
var fontURL = "https://www.dl.dropboxusercontent.com/s/yza8e1ivesk2255/Comfortaa-Bold.ttf?"
if(fontURL!="")
{

    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)

}
