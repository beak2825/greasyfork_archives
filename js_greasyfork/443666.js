// ==UserScript==
// @name         Fill up the Shopping Cart
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Fill up the Shopping Cart (HiveMicro)
// @author       jeanpirelag
// @match        https://hivemicro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hivemicro.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443666/Fill%20up%20the%20Shopping%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/443666/Fill%20up%20the%20Shopping%20Cart.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
        document.querySelectorAll("div > span")[3].click();
        }
});

async function keys() {
    window.onkeydown = function (event, index){

        if (event.keyCode == '220'){
            document.querySelectorAll("a")[8].click();
        }

        if (event.keyCode == '49'){
            document.querySelectorAll('div[title="Strongly Relevant"]')[0].click();
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '50'){
            document.evaluate("//div[text()='Relevant']", document).iterateNext().click()
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '51'){
            document.evaluate("//div[text()='Somewhat Relevant']", document).iterateNext().click()
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '52'){
            document.evaluate("//div[text()='Not Relevant']", document).iterateNext().click()
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '53'){
            document.evaluate("//div[text()='Offensive']", document).iterateNext().click()
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

    }
}

keys();

})();