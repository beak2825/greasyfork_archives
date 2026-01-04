// ==UserScript==
// @name         goToOnlineshop-Preise.ch
// @namespace    http://c-dev.ch/
// @version      0.3
// @description  Den Preisverlauf von Artikeln aus dem digitec.ch Shop über die Webseite onlineshop-preise.ch anzeigen.
// @author       kaepten neisgei
// @match        https://www.digitec.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415629/goToOnlineshop-Preisech.user.js
// @updateURL https://update.greasyfork.org/scripts/415629/goToOnlineshop-Preisech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){console.log("first time render"); render();}, 500);

    window.setInterval(function(){
        console.log("interval render");
        var exists = document.getElementById("preisverlauf");
        if(exists == null){
            render();
        }
    }, 2000);



    function render() {

        var exists = document.getElementById("preisverlauf");
        if(exists != null){
            return;
        }

        var aTags = document.getElementsByTagName("div");
        var searchText = "Teilen";
        var found;

        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
                found = aTags[i];
                break;
            }
        }

        if(found == null) return;
        
        console.log("...do render!...");

        var divAreaE = found.parentNode.parentNode.parentNode;

        var oldUrl = window.location.href;
        var newUrl = 'https://www.onlineshop-preise.ch/'
        newUrl = oldUrl.replace("https:\/\/www\.digitec\.ch\/",newUrl);

        var divP = document.createElement('div');
        divP.id = "preisverlauf";
        divAreaE.appendChild(divP);

        divP.innerHTML = "<button id=\"prBtn\" type=\"button\" style=\"margin-top: 20px; padding: 10px 10px;    position: relative;    display: inline-block;    border: 0px;    font-family: Roboto, Arial, sans-serif;    letter-spacing: normal;    line-height: 1.4;    text-align: center;    cursor: pointer;    vertical-align: middle;    text-decoration: none;    border-radius: var(--dg-spacingHalf);    appearance: none;    transition: padding 100ms ease 0s;    white-space: nowrap;    font-size: 1rem;    background: #FFA500;    color: #000000; width: 100%\"><span>Preisverlauf - onlineshop-preise</span></button>";
        divP.onclick = function() {window.open(newUrl, '_blank');};

        var prBtn = document.getElementById("prBtn");
        prBtn.addEventListener("mouseover", function () {prBtn.style.background = "#B22222"; prBtn.style.color = "#FFFFFF";});
        prBtn.addEventListener("mouseout", function () {prBtn.style.background = "#FFA500"; prBtn.style.color = "#000000";});

        return true;
    }

})();