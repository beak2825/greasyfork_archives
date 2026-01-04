// ==UserScript==
// @name         Custom font for Prof by Skyrxss X
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Oldu mu
// @author       Skyrxss X
// @match        https://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425944/Custom%20font%20for%20Prof%20by%20Skyrxss%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/425944/Custom%20font%20for%20Prof%20by%20Skyrxss%20X.meta.js
// ==/UserScript==
///////////////////////////
///EVENG YARRAĞIMI YESİN///
///////////////////////////
var fontURL = "https://www.dl.dropboxusercontent.com/s/76madqsf4wsqj3d/NavineDemo-SemiCondensed%20.ttf??"
if(fontURL!="")
{

    var cssString = "@font-face {font-family: 'Verdana'; font-weight: normal; font-style: normal; src: url('"+fontURL+"')}"
    var head = document.getElementsByTagName('head')[0]
    var newCss = document.createElement('style')
    newCss.type = "text/css"
    newCss.innerHTML = cssString
    head.appendChild(newCss)

}
