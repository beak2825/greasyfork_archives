// ==UserScript==
// @name         selecting district no add
// @namespace   https://onlinebooking.sand.telangana.gov.in/Order/CustomerOrders.aspx
// @version      0.1
// @license      MIT 
// @description  to make easier
// @author       You
// @match        https://onlinebooking.sand.telangana.gov.in/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/464882/selecting%20district%20no%20add.user.js
// @updateURL https://update.greasyfork.org/scripts/464882/selecting%20district%20no%20add.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DISTRICT_ID ='24';
    var RADIO_BUTTON_TEXT = "Bheemavaram SBAB5";
    var changeEvent = new Event('change');
    var clickEvent = new Event('click');
    function waitForTheElement(searchElement, callback) {
        var element;
        var intervalId = setInterval(function () {
             element = searchElement();
            if(element) {
                clearInterval(intervalId);
               callback(element);
            }
        },0);
    }
    function selectDistrict1(nextStep) {
        waitForTheElement(function() {
            return document.querySelector("#ccMain_tblDistricts").querySelector("select");
        }, function(elem) {
            elem.value = DISTRICT_ID;
            elem.dispatchEvent(changeEvent);
            nextStep();
        });
    }

    function selectStockYard(nextStep){
        waitForTheElement(function(){
             var elem = null;
            var trElements = Array.from(document.querySelectorAll(".GridviewScrollTable")[0].querySelectorAll("tr"));
            if(!trElements) {return null;}
    trElements.some(function (tr, index) {
            if (index === 0) { return 0;}
            if (tr.querySelectorAll("td")[2].innerHTML.trim().toLowerCase()== RADIO_BUTTON_TEXT.trim().toLowerCase()) {
                elem = tr.querySelector("input");
                return true;
            }
        }
    );
    return elem;
        },function(elem){
            elem.click();
            nextStep();
        });
    }
    selectDistrict1(function(){
        selectStockYard(function(){
        });
    });
})();