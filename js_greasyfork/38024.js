// ==UserScript==
// @name         [deprecated] Tag Incomings Checker
// @version      0.1.9
// @description  Checks for new incomings
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*
// @exclude      https://*/game.php?village=*&screen=overview_villages&mode=incomings*
// @grant        none
// @namespace FunnyPocketBook
// @downloadURL https://update.greasyfork.org/scripts/38024/%5Bdeprecated%5D%20Tag%20Incomings%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/38024/%5Bdeprecated%5D%20Tag%20Incomings%20Checker.meta.js
// ==/UserScript==

var link = $("#incomings_cell").children();
//if (parseInt(localStorage.getItem("incomings")) !== document.getElementById("incomings_amount").innerHTML) {
    localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
//}
var interval = setInterval(function() {
    "use strict";
    localStorage.setItem("incomings2", document.getElementById("incomings_amount").innerHTML);
    if(parseInt(localStorage.getItem("incomings2")) > parseInt(localStorage.getItem("incomings"))) {
        link[0].click();
        localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
        clearInterval(interval);
    } else if (parseInt(localStorage.getItem("incomings2")) < parseInt(localStorage.getItem("incomings"))) {
        localStorage.setItem("incomings", document.getElementById("incomings_amount").innerHTML);
    }
}, 190);