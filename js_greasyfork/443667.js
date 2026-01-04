// ==UserScript==
// @name         STILL don't know my NAME!!
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  STILL don't know my NAME!! (HiveMicro)
// @author       jeanpirelag
// @match        https://hivemicro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hivemicro.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443667/STILL%20don%27t%20know%20my%20NAME%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/443667/STILL%20don%27t%20know%20my%20NAME%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
        document.querySelectorAll("div > span")[3].click();
            setTimeout(function(){
                history.back();
            }, 2000);
        }
});

async function keys() {
    window.onkeydown = function (event, index){

        if (event.keyCode == '220'){
            document.evaluate("//span[text()='Nothing to Bound']", document).iterateNext().click();
            setTimeout(function(){
                document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '70'){
            document.evaluate("//div[text()='person']", document).iterateNext().click()
            setTimeout(function(){
                // document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '67'){
            document.evaluate("//div[text()='company']", document).iterateNext().click()
            setTimeout(function(){
                // document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }



    }
}

keys();

})();