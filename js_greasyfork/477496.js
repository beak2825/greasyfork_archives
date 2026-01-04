// ==UserScript==
// @name         obsługa budynku
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  otworz samochody - policz ludzi
// @author       niby informatyk
// @match        https://www.operatorratunkowy.pl/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477496/obs%C5%82uga%20budynku.user.js
// @updateURL https://update.greasyfork.org/scripts/477496/obs%C5%82uga%20budynku.meta.js
// ==/UserScript==

var $ = window.jQuery;



(function() {
    'use strict';





$("#iframe-inside-container > dl > dd:nth-child(8) > div").append('<a class="btn btn-default btn-xs"><span id="open_all_button" title="Open all" class="glyphicon glyphicon-pencil" style="width: 100px;"></span></a>');
document.querySelector("#open_all_button").addEventListener ("click", function() { otworzy_wszystkie_wozy(); } , false);

policz_osoby();


})();


function otworzy_wszystkie_wozy() {
    const odd = document.querySelectorAll("#vehicle_table > tbody > tr > td:nth-child(3) > a");
    console.log("otwieram");
    odd.forEach((element) => {


        console.log("text: " + element.parentNode.parentNode.getElementsByTagName("td")[5].innerHTML);

        if (element.parentNode.parentNode.getElementsByTagName("td")[5].innerHTML > 2) {
            window.open(element.href, "_blank")
        }

   });
}


function policz_osoby() {
    const odd = document.querySelectorAll("#vehicle_table > tbody > tr > td:nth-child(6)");
    var ile_osob = 0;
    odd.forEach((element) => {
        ile_osob = ile_osob + parseInt(element.innerText);
    });
    console.log(ile_osob);
    $("#iframe-inside-container > dl > dd:nth-child(8) > div").append('zajęte:  ' + ile_osob);


}








