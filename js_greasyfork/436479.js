// ==UserScript==
// @name         CRN Filler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills in CRN and submits for you
// @author       You
// @match        https://banweb.lau.edu.lb/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436479/CRN%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/436479/CRN%20Filler.meta.js
// ==/UserScript==

//$(document).on("keyup", function(e) {
 //   if (e.key === "Escape") {
    script();
 //   }
//});
function script() {
    'use strict';
    document.getElementById("crn_id1").value = 23374;
    document.getElementById("crn_id2").value = 23367;
    document.getElementById("crn_id3").value = 23023;
    document.getElementById("crn_id4").value = 23603;
    document.getElementById("crn_id5").value = 23615;
    document.getElementById("crn_id6").value = 23117;
    document.getElementById("crn_id7").value = 23908;
    document.getElementById("crn_id8").value = 22322;
    //document.getElementById("crn_id9").value = 100;
    //document.getElementById("crn_id10").value = 100;
    setTimeout(submit,1000);
}

function submit(){
    document.querySelector("input[value=\"Submit Changes\"]").click();
}