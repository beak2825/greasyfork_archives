// ==UserScript==
// @name        Itukalapadu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://onlinebooking.sand.telangana.gov.in/BOOKING1/Order/CustomerOrders.aspx?KLM*
// @match        https://onlinebooking.sand.telangana.gov.in/Order/CustomerOrders.aspx?KLM*
// @match        https://onlinebooking.sand.telangana.gov.in/BOOKING2/Order/CustomerOrders.aspx?KLM*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381269/Itukalapadu.user.js
// @updateURL https://update.greasyfork.org/scripts/381269/Itukalapadu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DISTRICT_ID = 23;
    var RADIO_BUTTON_TEXT =" Itukalapadu";
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
        },100);
    }
    function selectDistrict1(nextStep) {
        waitForTheElement(function() {1

// ==UserScript==

2

// @name        6

3

// @namespace    http://tampermonkey.net/

4

// @version      0.1
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
            if(!trElements) {return null};
    trElements.some(function (tr, index) {
            if (index == 0) { return 0;}
            if (tr.querySelectorAll("td")[2].innerHTML.trim().toLowerCase() == RADIO_BUTTON_TEXT.trim().toLowerCase()) {
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

    function selectPurpose(nextStep){
        waitForTheElement(function(){
            return document.querySelector("select[name='ctl00$ccMain$ddlsandpurpose']");
        },function(elem){
            elem.value = "1";
            //document.querySelector('select[name="ctl00$ccMain$ddlVehicleType"]').value = "L";
            document.querySelector('input[name="ctl00$ccMain$txtVNo"]').value = "CG23B0252";
            nextStep();
        });
    }
    function selectDistrict2(nextStep) {
        waitForTheElement(function(){
            var district2 = document.querySelector('select[onchange="PopulateDelMandals()"]');
            console.log(district2.querySelectorAll("option").length);
            return district2.querySelectorAll("option").length > 1 ? district2 : false;
        },function(elem){
            elem.value = 16;
            elem.dispatchEvent(changeEvent);
            nextStep();
        });
    }
    function selectMandal(nextStep) {
        waitForTheElement(function(){
            var mandal = document.querySelector('select[onchange="PopulateDelVillages()"]');
            console.log(mandal.querySelectorAll("option").length);
            return mandal.querySelectorAll("option").length > 1 ? mandal : false;
        },function(elem){
            elem.value =78;
            elem.dispatchEvent(changeEvent);
            nextStep();
        });
    }
    function selectVillage() {
        waitForTheElement(function(){
            var village = document.querySelector('select[name="ctl00$ccMain$ddldelvillage"]');
            console.log(village.querySelectorAll("option").length);
            return village.querySelectorAll("option").length > 1 ? village : false;
        },function(elem){
            elem.value = "166";
            elem.dispatchEvent(changeEvent);
document.querySelector("#ccMain_rbtPG_1").click();
        });
    }
    selectDistrict1(function(){
        selectStockYard(function(){
            selectPurpose(function(){
                selectDistrict2(function(){
                    selectMandal(selectVillage);
					$("#btnRegister").click();
                });
            });
        });
    });
})();
//