// ==UserScript==
// @name         SniptaHF
// @namespace    https://hackforums.net/member.php?action=profile&uid=2525478
// @version      0.2
// @description  Implements Snipta into HF
// @author       TyrantKingBen
// @match        https://hackforums.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/30804/SniptaHF.user.js
// @updateURL https://update.greasyfork.org/scripts/30804/SniptaHF.meta.js
// ==/UserScript==

var width = GM_getValue(GM_info.script.name + "width", "360");
var height = GM_getValue(GM_info.script.name + "height", "560");

(function() {
    var menu = document.getElementsByClassName("menu");
    var calculatorButton = document.createElement("li");
    calculatorButton.innerHTML = "<a href='#' class='navButton'>Snipta</a>";

    calculatorButton.addEventListener("click", function(e) {
        if (e.ctrlKey) {
            width = prompt("Enter a new width (in px)") | "360";
            height = prompt("Enter a new height (in px)") | "560";
            GM_setValue(GM_info.script.name + "width", width);
            GM_setValue(GM_info.script.name + "height", height);

            e.preventDefault();
        }

        showCalculator();
    });

    menu[0].children[0].appendChild(calculatorButton);
})();

function showCalculator() {
    var sniptaContainer = document.createElement("div");
    sniptaContainer.style.width = "100%";
    sniptaContainer.style.height = "100%";
    sniptaContainer.style.position = "fixed";
    sniptaContainer.style.top = "0";
    sniptaContainer.style.left = "0";
    sniptaContainer.style.background = "black";
    sniptaContainer.style.opacity = "0";
    sniptaContainer.style.transition = "opacity 0.5s";

    var sniptaFrame = document.createElement("iframe");
    sniptaFrame.src = "https://snipta.com/";
    sniptaFrame.scrolling = "no";
    sniptaFrame.style.border = "none";
    sniptaFrame.style.width = width + "px";
    sniptaFrame.style.height = height + "px";
    sniptaFrame.style.position = "fixed";
    sniptaFrame.style.top = "50%";
    sniptaFrame.style.left = "50%";
    sniptaFrame.style.transform = "translate(-50%, -50%)";
    sniptaFrame.style.borderRadius = "10px";
    sniptaFrame.style.opacity = "0";
    sniptaFrame.style.transition = "opacity 0.5s";

    document.body.appendChild(sniptaContainer);
    document.body.appendChild(sniptaFrame);

    setTimeout(function() {
        sniptaContainer.style.opacity = "0.5";
        sniptaFrame.style.opacity = "1";
    }, 100);

    sniptaContainer.addEventListener("click", function() {
        sniptaContainer.style.opacity = "0";
        sniptaFrame.style.opacity = "0";

        setTimeout(function() {
            document.body.removeChild(document.body.lastChild);
            document.body.removeChild(document.body.lastChild);
        }, 500);
    });
}