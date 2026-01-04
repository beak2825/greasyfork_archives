// ==UserScript==
// @name         signature for what? [sfw]
// @namespace    http://tampermonkey.net/
// @version      1.25
// @description  Read premium content from Observador (www.observador.pt) website media without paying.
// @author       greedisgood
// @match        https://observador.pt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392283/signature%20for%20what%20%5Bsfw%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/392283/signature%20for%20what%20%5Bsfw%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

//alert(document.getElementsByClassName("premium")[0].textContent)
document.getElementsByClassName("fixed")[0].innerHTML += "<p style=\"position:relative;top:-14%;padding:2px;text-align:center;font-size:9pt;background-color:white;\">greedisgood: <b style=\"color:red;\">To access premium content choose by clicking on its TITLE, if you choose by clicking on the IMAGE IT WILL NOT WORK!</b></p>";

window.addEventListener("click", function(event) {
    if(event.target.toString().substring(0, 22) == "https://observador.pt/"){ location.href = event.target; }
});

var premium = document.getElementsByClassName("premium")[0];
if(premium.textContent == "/premium" || premium.textContent == " /premium"){ window.stop(); console.log(window.performance.now()); }

var check = setInterval(delay, 1500), blockId = document.getElementById("paywall-block");

function delay(){
    if(blockId.className == "fbg-col-4 fbg-col-lg-2 center-column premium-paywall-block paywall-gradient"){ location.reload(true); }
    stop(check);
}

function stop(clock){ clearInterval(clock); }

})();