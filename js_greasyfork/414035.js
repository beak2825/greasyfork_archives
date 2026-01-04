// ==UserScript==
// @name         JeSuisRyssen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        http://www.jeuxvideo.com/*
// @match        http://m.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @match        https://m.jeuxvideo.com/*
// @author       Ryssen
// @description  Remplace le logo sur Jeuxvideo.com
// @downloadURL https://update.greasyfork.org/scripts/414035/JeSuisRyssen.user.js
// @updateURL https://update.greasyfork.org/scripts/414035/JeSuisRyssen.meta.js
// ==/UserScript==

var logo = document.getElementsByClassName('jv-global-web')[0];
logo.innerHTML = "";

var yes = document.createElement("div");
yes.setAttribute("class", "ryssen");
yes.setAttribute("style", "color:white;");
logo.appendChild(yes);

var newlogo = document.getElementsByClassName('ryssen')[0];
newlogo.innerHTML = "#JeSuisRyssen";




