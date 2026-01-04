// ==UserScript==
// @name         Aternos Board Check Server Status
// @namespace    https://greasyfork.org/en/users/980321-abodiey
// @version      0.1
// @description  makes you able to click the minecraft server's ip in aternos's board and check right away if its online.
// @author       Abodiey
// @match        https://board.aternos.org/thread/
// @match        https://board.aternos.org/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454400/Aternos%20Board%20Check%20Server%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/454400/Aternos%20Board%20Check%20Server%20Status.meta.js
// ==/UserScript==
var tries=0
var loading = setInterval(function () {
    tries+=1
    if (document.getElementsByTagName('dd')[2]) {
        const old=document.getElementsByTagName('dd')[2].innerHTML
        document.getElementsByTagName('dd')[2].innerHTML= '<a href="https://mcsrvstat.us/server/'+old+'"class="externalURL" target="_blank" rel="nofollow noopener noreferrer ugc">'+old+'</a>'
        clearInterval(loading);
    }
    if (tries>3000) {clearInterval(loading);}
}, 20); // Checks every 100ms(0.1s)