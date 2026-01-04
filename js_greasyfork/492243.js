// ==UserScript==
// @name         SD online
// @namespace    http://b2cweb.com
// @version      2024-04-11
// @description  Stable Diffusion online
// @author       cfat
// @match        https://pro.aikobo.cn/?__theme=dark
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aikobo.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492243/SD%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/492243/SD%20online.meta.js
// ==/UserScript==


var intervalId = window.setInterval(function() {
    document.getElementById("esheep-top-nav").style.display = "none";
    document.getElementById("esheep-left-nav").style.display = "none";
    document.querySelector(".element").style.cssText = "margin-top: 0px; margin-left: 0px;";
    document.getElementsByTagName('gradio-app').style.cssText = "margin-top: 0px; margin-left: 0px;";
    document.getElementsByClassName('.element').style.cssText = "margin-top: 0px; margin-left: 0px;";
}, 100);
