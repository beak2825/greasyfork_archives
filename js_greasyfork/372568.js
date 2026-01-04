// ==UserScript==
// @name         Echo Beta Offline Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves the "you are offline" message to the top of the screen and allows user interaction with the page, but disables "submit" buttons (so users don't lose their work)
// @author       Jacqueb
// @match        https://hillcresths.echo-ntn.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372568/Echo%20Beta%20Offline%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/372568/Echo%20Beta%20Offline%20Mode.meta.js
// ==/UserScript==

(function() {
    function startit1() {
        if(navigator.onLine == false) {setTimeout(function() {startit(); lol1()},500);}
        if(navigator.onLine == true) {if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.transition = "opacity 1s ease out"; document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.opacity = "0"; document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.display = "none"}}
        for(var i = 0; i < 10; i++) {if(navigator.onLine == true) {if(document.getElementsByClassName("xli-submit")[i] != undefined) {document.getElementsByClassName("xli-submit")[i].removeAttribute("disabled")}}}
        for(var j = 0; j < 10; j++) {if(navigator.onLine == true) {if(document.getElementsByClassName("xli-submit")[j] != undefined) {document.getElementsByClassName("xli-cancel")[j].removeAttribute("disabled")}}}
                        }
    function startit() {
        if(document.getElementsByClassName("cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing")[0] != undefined) {document.getElementsByClassName("cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing")[0].style.display="none";}
        if(document.getElementsByClassName("app-backdrop")[0] != undefined) {document.getElementsByClassName("app-backdrop")[0].style.display="none";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.background="white";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.height="60px";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.border="solid 1px white";}
        if(document.getElementsByClassName("xli-modal-body")[0] != undefined) {document.getElementsByClassName("xli-modal-body")[0].style.marginTop="-8px";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.borderRadius="10px";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.boxShadow="none";}
        if(document.getElementsByClassName("xli-flex-enabled app-theme ng-scope xli-ada-color")[0] != undefined) {document.getElementsByClassName("xli-flex-enabled app-theme ng-scope xli-ada-color")[0].id="elColor";}
        if(document.getElementById('elColor') != undefined) {var myColor = document.getElementById('elColor').className.split(' ')[4];}
        if(document.getElementsByClassName("cdk-global-overlay-wrapper")[0] != undefined) {document.getElementsByClassName("cdk-global-overlay-wrapper")[0].style="justify-content: center";}
        if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].getElementsByClassName("ng-star-inserted")[1].innerText="Offline! Submit button will be disabled until a stable internet connection is found."}
        if(navigator.onLine == false) {if(document.getElementsByClassName("xli-submit")[0] != undefined) {document.getElementsByClassName("xli-submit")[0].disabled = true;}}
        if(navigator.onLine == false) {if(document.getElementsByClassName("xli-submit")[0] != undefined) {document.getElementsByClassName("xli-cancel")[0].disabled = true;}}
        if(navigator.onLine == false) {if(document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0] != undefined) {document.getElementsByClassName("mat-dialog-container ng-trigger ng-trigger-slideDialog ng-star-inserted")[0].style.display = "block"}}
        if(document.getElementsByClassName("cdk-overlay-pane")[0] != undefined) {document.getElementsByClassName("cdk-overlay-pane")[0].style.height="60px";}
    }
    function lol() {
        setTimeout(function() {startit1(); lol1()},1500);
    }
    function lol1() {
        setTimeout(function() {startit1(); lol()},1500);
    }
    setTimeout(lol(), 3000);

})();