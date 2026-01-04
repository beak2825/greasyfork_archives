// ==UserScript==
// @name         PVU Water and Crow Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Highlight water less than 100 and crows in plants
// @author       You
// @match        https://marketplace.plantvsundead.com/*
// @icon         https://plantvsundead.com/assets/img/logo-2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431220/PVU%20Water%20and%20Crow%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/431220/PVU%20Water%20and%20Crow%20Highlighter.meta.js
// ==/UserScript==
(function() {
    window.addEventListener("load", function () {
        setInterval(modifyText, 200);
    });
})();

function modifyText() {
    document.getElementsByClassName("plant-attr-number").forEach(x => {
        if(x.firstElementChild.className == "small" || x.style.background == "red") {
            if(x.firstElementChild.innerText < 100){
                x.firstElementChild.classList.remove("small");
                x.firstElementChild.style.fontSize = "20px";
                x.style.background = "red";
            }
            else{
                x.firstElementChild.classList.add("small");
                x.style.background = "green";
            }
        }
    });
    document.getElementsByClassName("tw-absolute crow-icon").forEach(x => {
        if(x.style.display != "none") {
            x.style.width = "100px";
            x.style.background = "red";
        }});
}