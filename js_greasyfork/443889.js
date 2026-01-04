// ==UserScript==
// @name         Manipulation Hunter
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Manipulation Hunter (HiveMicro)
// @author       jeanpirelag
// @match        https://hivemicro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hivemicro.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443889/Manipulation%20Hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/443889/Manipulation%20Hunter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
        document.querySelectorAll("div > span")[3].click();
            setTimeout(function(){
                history.back();
            }, 1800);
        }
});

async function keys() {
    window.onkeydown = function (event, index){

        if (event.keyCode == '49'){
            document.querySelectorAll('div')[101].click();
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '50'){
            document.evaluate("//div[text()='Manipulated']", document).iterateNext().click()
            setTimeout(function(){
                 document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '51'){
            document.evaluate("//div[text()='Does Not Match']", document).iterateNext().click()
            setTimeout(function(){
                 document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }



    }
}

keys();

})();