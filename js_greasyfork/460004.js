// ==UserScript==
// @name         Discord Pro Mode
// @namespace    trysten
// @version      0.2.0
// @description  Discord mod mods
// @author       trysten
// @match        https://*.discord.com/app
// @match        https://*.discord.com/channels/*
// @icon         https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460004/Discord%20Pro%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/460004/Discord%20Pro%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function respond(e) {
        // function showChar(e) {
        //     console.debug(`Key Pressed: ${e.key}\nCTRL key pressed: ${e.ctrlKey}\n`);
        // }
        // console.debug(showChar(e));

        if(e.altKey) {
          switch (e.key) {
            // disappear left menu and use ctrl + k to be mega
            case '[':
              var sidebar = document.getElementById('channels').parentElement.parentElement;
              var newstate = sidebar.style.display == "none" ? "" : "none";
              sidebar.style.display = newstate;
              e.preventDefault();
              break;
            // phat search
            case ']':
              var sidebar = document.getElementById('search-results').parentElement.parentElement;
              console.log(sidebar.style.width);
              if (sidebar.style.width == "" || sidebar.style.width == "418px") {
                var newstate = "836px";
              }
              else if (sidebar.style.width == "836px") {
                var newstate = "100%";
              }
              else {
                var newstate = "418px"
              }
                sidebar.style.width = newstate;
                e.preventDefault();
                break;
              default:
                Function.prototype(); //noop lol
                break;
            }
        }
    }
    document.addEventListener('keydown', respond, false);
})();