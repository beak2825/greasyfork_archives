// ==UserScript==
// @name         anime4up Links Grabber
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Grab Links from anime4up
// @author       alsaibi
// @match        https://anime4up.com/episode/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401332/anime4up%20Links%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/401332/anime4up%20Links%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let servers_bar = document.querySelector("#episode-servers");
        let button = document.createElement("Li");
        let atag = document.createElement("a");
        atag.innerText = "الروابط";
        button.appendChild(atag);
        servers_bar.appendChild(button);
        function get_links(){
             servers_bar.removeChild(button);
             let servers = servers_bar
              let win = window.open("new:blank");
              for(let i = 0; i < servers.childElementCount; i++) {
                       win.document.write("<p>" + servers.children[i].children[0].dataset.epUrl + "</p>");
                       console.log(servers[i]);
                 }
        }
        if (button) {
    button.addEventListener ("click", get_links , false);
    }
})();