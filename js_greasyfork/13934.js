// ==UserScript==
// @name         Easier ABF Pickup Request 2
// @namespace https://greasyfork.org/users/4756
// @version      0.1.5
// @description  enter something useful
// @author       You
// @match        https://arcb.com/tools/pickup-request*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13934/Easier%20ABF%20Pickup%20Request%202.user.js
// @updateURL https://update.greasyfork.org/scripts/13934/Easier%20ABF%20Pickup%20Request%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

function EasierABFPickupRequest(){
    try{
        console.log('setup shipper');
        // setup shipper
        document.querySelectorAll('[name=affiliations]')[0].click();
        var a = document.querySelectorAll('[name=contactName]')[0];{
            a.value="Michael Cimino";
            $(a).change();}
        var a = document.querySelectorAll('[name=email]')[0];{
            a.value="michaelc@statcowhse.com";
            $(a).change();}
        var a = document.querySelectorAll('[name=phone]')[0];{
            a.value="2017927000";
            $(a).change();}
        var a = document.querySelectorAll('[name=phoneExt]')[0];{
            a.value="209";
            $(a).change();}
        document.querySelector('[name=paymentTerms]').children[1].selected=true;

        console.log('setup pickup');
        //setup pickup
        var a = document.querySelectorAll('[name=companyName]')[0];{
            a.value='Outerstuff/Statco';
            $(a).change();}
        var a = document.querySelectorAll('[name=address]')[0];{
            a.value="301 16th Street";
            $(a).change();}
        var a = document.querySelectorAll('[name=shipper]')[0];{
            a.value="07310 JERSEY CITY, NJ";
            $(a).change();}
        var a = document.querySelectorAll('[name=contactName]')[1];{
            a.value="Michael Cimino";
            $(a).change();}
        var a = document.querySelectorAll('[name=phone]')[1];{
            a.value="2017927000";
            $(a).change();}
        var a = document.querySelectorAll('[name=phoneExt]')[1];{
            a.value="209";
            $(a).change();}
        document.querySelectorAll('[name=paymentTerms]')[0].children[1].selected=true;

        console.log('setup time and comment');
        var a = document.querySelectorAll('[name=freightReadyTime]')[0];{
            a.value="string:13:00";
            $(a).change();}
        var a = document.querySelectorAll('[name=openTime]')[0];{
            a.value="string:10:00";
            $(a).change();}
        var a = document.querySelectorAll('[name=closeTime]')[0];{
            a.value="string:16:00";
            $(a).change();}
        var a = document.querySelectorAll('[name=instructions]')[0];{
            a.value="First come, first served. Closed for lunch 12:00 - 1:00.";
            $(a).change();}

        document.querySelectorAll('textarea[name=description]')[0].value = "Wearing Apparel";
        document.querySelectorAll('[name=nmfcItem]')[0].value = "049880";

        //No liftgate required
        document.querySelectorAll('abt-pickup-service-option:nth-child(2) > div > div > label > input')[0].checked = false;
        //No residential pickup required
        document.querySelectorAll('abt-pickup-service-option:nth-child(3) > div > div > label > input')[0].checked = false;

        //email copy of pickup request
        setTimeout(function(){
            console.log('setup email request');
            document.querySelectorAll('label.checkbox')[2].click();
            document.querySelectorAll('label.checkbox')[3].click();
            var a = document.querySelectorAll('[name=email]')[1];{
                a.value="michaelc@statcowhse.com";
                $(a).change();}

            document.querySelector('[data-ng-model="vm.pickup.shipper.contact.shouldEmailRequestCopy"]').checked=true;
            document.querySelector('[data-ng-model="vm.pickup.shipper.contact.shouldEmailConfirmationNotice"]').checked=true;
        },2000);
    }
    catch(e){
        setTimeout(window.EasierABFPickupRequest,2500);
    }
    };

window.EasierABFPickupRequest = EasierABFPickupRequest;

setTimeout(window.EasierABFPickupRequest,5000);

})();