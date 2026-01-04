// ==UserScript==
// @name         5-Anker to BO
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  5-Anker to Back-Office
// @author       Aurel
// @match        https://connect.5-anker.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492353/5-Anker%20to%20BO.user.js
// @updateURL https://update.greasyfork.org/scripts/492353/5-Anker%20to%20BO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
        var btn = document.createElement("button");
        btn.innerHTML = "Open Boat in BO";
        btn.style.position = "fixed";
        btn.style.left = "20px";
        btn.style.bottom = "20px";
        btn.style.zIndex = "10000";

        btn.onclick = function() {
            var valeurElement = document.querySelector('.layer-header h3');
            if (valeurElement) {
                var fullText = valeurElement.innerText;
                var match = fullText.match(/^#(\d+)/);
                if (match) {
                    var numero = match[1];
                    var url = "https://www.clickandboat.com/en/back-office/gds/boat/index?localization=&boatTypes=&buildYeargte=&cabinsNumbergte=&apiId=" + numero;
                    window.open(url, '_blank');
                } else {
                    alert("Le numéro n'a pas pu être extrait.");
                }
            } else {
                alert("Open a Boat to open it in BO");
            }
        };

        document.body.appendChild(btn);
   
})();
