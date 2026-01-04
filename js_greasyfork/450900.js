// ==UserScript==
// @name         Scratch Upgrade
// @namespace    -
// @version      2
// @description  Upgrade Scratch and Turbowarp to the next level.
// @author       Plantt
// @match        https://scratch.mit.edu
// @match        https://scratch.mit.edu/*
// @match        https://turbowarp.org/*
// @icon         https://scratch.mit.edu/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450900/Scratch%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/450900/Scratch%20Upgrade.meta.js
// ==/UserScript==

var ccInterval;
window.onload = function(event) {
    setTimeout(function(){
        if (document.URL.substring(0, "https://scratch.mit.edu/projects/".length) == "https://scratch.mit.edu/projects/"
         || document.URL.substring(0, "https://turbowarp.org/".length) == "https://turbowarp.org/") {
            setInterval(function() {if (document.getElementById("hcBtn") == null) {
                var hcBtn = document.createElement("button");
                hcBtn.innerText = "Hide Cursor";
                hcBtn.id = "hcBtn";
                hcBtn.style.height = "20px";
                hcBtn.onclick = function() {hideCursor()};
                document.querySelector(".controls_controls-container_2xinB").appendChild(hcBtn);
                var randomVal = document.createElement("input");
                randomVal.type = "number";
                randomVal.value = -1;
                randomVal.step = "any";
                randomVal.id = "rndVal";
                randomVal.size = 3;
                randomVal.style.marginLeft = "10px";
                randomVal.style.height = "20px";
                var randomFunc = Math.random;
                randomVal.onchange = e => {
                    if (e.target.value == "-1") {
                        Math.random = randomFunc;
                    }
                    else {
                        Math.random = () => e.target.value;
                    }
                }
                document.querySelector(".controls_controls-container_2xinB").appendChild(randomVal);
                var sinCosSwap = document.createElement("button");
                sinCosSwap.innerText = "Swap sin() and cos()";
                sinCosSwap.id = "sin-cos-swap";
                sinCosSwap.style.marginLeft = "10px";
                sinCosSwap.style.height = "20px";
                sinCosSwap.onclick = e => {
                    var tmp = Math.sin;
                    Math.sin = Math.cos;
                    Math.cos = tmp;
                }
                document.querySelector(".controls_controls-container_2xinB").appendChild(sinCosSwap);
            }}, 42);
        }
        if (document.URL == location.origin + "/") {
            for (var i = 0; i < document.querySelectorAll("div.box-header").length; i++) {
                makeCollapsible(document.querySelectorAll("div.box-header")[i]);
            }
        }
        if (document.URL.substring(0, (location.origin + "/search").length) == location.origin + "/search"
            || document.URL.substring(0, (location.origin + "/explore").length) == location.origin + "/explore") {
            var btn = document.createElement("button");
            btn.innerText = "Get a random project";
            btn.onclick = goToRandomProject;
            document.querySelector("div.sort-controls").appendChild(btn);
        }
        if (document.URL == "https://scratch.mit.edu/messages/") {
            var delBtn = document.createElement("button");
            delBtn.innerText = "Delete all studio messages";
            delBtn.style = `
                transition: border .5s ease;
                margin-bottom: .75rem;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                background-color: #fefefe;
                padding-right: 4rem;
                padding-left: 1rem;
                width: 100%;
                height: 3rem;
                color: #575e75;
                font-size: .875rem;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            `;
            delBtn.onclick = function() {
                var a = document.querySelectorAll("li.mod-studio-activity");
                for (var i = 0; i < a.length; i++) a[i].remove();
            }
            document.querySelector("div.mod-messages-title").appendChild(delBtn);
        }
    }, 1000);
}
function hideCursor() {
    clearInterval(ccInterval);
    ccInterval = setInterval(function() {
        document.querySelector("div.stage_stage_1fD7k.box_box_2jjDp div canvas").style.cursor = "none";
    }, 42);
    document.getElementById("hcBtn").innerText = "Show cursor";
    document.getElementById("hcBtn").onclick = function(){showCursor();};
}
function showCursor() {
    clearInterval(ccInterval);
    ccInterval = setInterval(function() {
        document.querySelector("div.stage_stage_1fD7k.box_box_2jjDp div canvas").style.cursor = null;
    }, 42);
    document.getElementById("hcBtn").innerText = "Hide cursor";
    document.getElementById("hcBtn").onclick = function(){hideCursor();};
}
function makeCollapsible(header) {
    var btn = document.createElement("button");
    btn.style.marginLeft = "20px";
    expand();
    header.appendChild(btn);
    function collapse() {
        header.parentElement.querySelector("div.box-content").style.display = "none";
        header.parentElement.style.height = "36px";
        btn.innerText = "Expand";
        btn.onclick = expand;
    }
    function expand() {
        header.parentElement.querySelector("div.box-content").style.display = "block";
        header.parentElement.style.height = "";
        btn.innerText = "Collapse";
        btn.onclick = collapse;
    }
}
function goToRandomProject() {
    document.querySelectorAll("div.thumbnail-title")[Math.floor(Math.random() * document.querySelectorAll("div.thumbnail-title").length)].querySelector("a").click();
}