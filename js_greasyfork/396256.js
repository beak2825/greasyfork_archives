// ==UserScript==
// @name         一键舔婊-raider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      *gbfraiders.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396256/%E4%B8%80%E9%94%AE%E8%88%94%E5%A9%8A-raider.user.js
// @updateURL https://update.greasyfork.org/scripts/396256/%E4%B8%80%E9%94%AE%E8%88%94%E5%A9%8A-raider.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var origin='https://81365443.ngrok.io/';
    waitForElementToDisplay('#raid-table',1000);
    var iframeA;
    function addListenerForRaidTable(){
        let table=document.getElementById('raid-table');
        table.addEventListener('click',(trigger)=>{
            console.error(trigger.target.closest('tr').id);
            iframeA.contentWindow.postMessage(trigger.target.closest('tr').id,'*');
        });
    };

    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)!=null) {
            iframeA=document.createElement('iframe');
            iframeA.src=origin+'bridge.html';
            iframeA.style.display = "none";
            document.body.appendChild(iframeA);
            addListenerForRaidTable();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }
    // Your code here...
})();