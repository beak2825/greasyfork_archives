// ==UserScript==
// @name         Sci-Hub Sidebar Collapse
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  Hide Sci-Hub Sidebar for convient reading on Web Browser
// @author       Benyamin Limanto
// @include      https://sci-hub.*/*
// @icon         https://icons.duckduckgo.com/ip2/sci-hub.se.ico
// @downloadURL https://update.greasyfork.org/scripts/430146/Sci-Hub%20Sidebar%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/430146/Sci-Hub%20Sidebar%20Collapse.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var menu = document.getElementById("minu");
    var newBtnCollapse = document.getElementById("roll");
    var useLegacy = true;

    var img = document.querySelector("#rollback img");
    var defaultCollapsed = true; // Change to true so when the page loaded, the sidebar will be collapsed! or change to false if you not need it

    if (menu != undefined && useLegacy) {
        // Hide new button, use legacy
        document.querySelector("body #roll").style = "visibility: hidden !important";
        img.style.display = "none";
        var div = document.createElement("div");
        div.innerHTML = `<div id="collapse-div" style="position: relative; width: 1px; left: calc(20vw - 30px);">
  <button id="btnCollapse" style="position: absolute;top: 40px; padding: 4px; font-weight: bold; font-size: 18px">&lt;</button>
  </div>`;
        div.style.position = "absolute";
        div.style.top = "10vw";
        div.style.zIndex = "999";
        menu.after(div);
        function legacyCollapse(e) {
            menu.style.width = 0;
            document.getElementById("collapse-div").style.left = 0;
            document.getElementById("article").style.width = "100vw";
            document.getElementById("article").style.marginLeft = 0;
            document.getElementById("article").style.left = 0;
            e.target.innerText = ">";
        }

        function legacyExpand(e) {
            menu.style.width = "20vw";
            menu.style.left = 0;
            document.getElementById("collapse-div").style.left = "calc(-30px + 20vw)";
            document.getElementById("article").style.width = "80vw";
            document.getElementById("article").style.marginLeft = "20vw";
            e.target.innerText = "<";
        }
        var btn = document.getElementById("btnCollapse");

        btn.onclick = function(e) {
            if (e.target.innerText == "<") {
                legacyCollapse(e);
            } else {
                legacyExpand(e);
            }
        }

        if (defaultCollapsed) {
         btn.click();
            btn.innerText = ">";
        }
    }

    if (newBtnCollapse != null && !useLegacy) {
        // make expand button smaller than it should be
        img.style.width = "3vw";
        // Collapse default
        if (defaultCollapsed) {
            // This function is new sci-hub function
            rollup();
        }
    }
})();