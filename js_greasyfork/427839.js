// ==UserScript==
// @name         Auto update Xero XPM custom fields
// @namespace    https://practicemanager.xero.com/
// @version      0.6
// @license      MIT
// @description  Automatically update custom fields to reflect XPM defailt fields, which aren't available in reports
// @author       Kyle Drayton CPA
// @match        https://practicemanager.xero.com/Client/Client/Edit/*
// @match        https://practicemanager.xero.com/Client/Client/New
// @icon         https://www.google.com/s2/favicons?domain=xero.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427839/Auto%20update%20Xero%20XPM%20custom%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/427839/Auto%20update%20Xero%20XPM%20custom%20fields.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Declare default bank fields
    //For the uninitiated, to find these right click on the corresponding textbox, click "inspect", then copy the ID and paste it between the quotes.

    //XPM default fields
    var srcBSB = "text-1091-inputEl";
    var srcAcc = "text-1092-inputEl";
    var srcAccName = "text-1093-inputEl";
    var srcFFR = "checkbox-1096";
    var srcFFRb = "checkbox-1096-inputEl";

    //Your custom fields
    var destCliNum = "text-1090-inputEl"; //Save XPM ID in default "Client Code" field.
    var destBSB = "text-1140-inputEl";
    var destAcc = "text-1141-inputEl";
    var destAccName = "text-1142-inputEl";
    var destFFR = "checkbox-1139";
    var destFFRb = "checkbox-1139-inputEl";

    //Set script strings to keep the code clean.
    var saveCliNum = "document.getElementById(destCliNum).value = srcCliNum;"
    var saveBSB = "document.getElementById(destBSB).value = document.getElementById(srcBSB).value;"
    var saveAcc = "document.getElementById(destAcc).value = document.getElementById(srcAcc).value;"
    var saveAccName = "document.getElementById(destAccName).value = document.getElementById(srcAccName).value;"

    //Set XPM ID - will alert user for new clients, as this isn't available for them
    try {
        var tmpNum = window.location.href.toString().match(/\d+/); //Get XPM ID from URL
        var srcCliNum = tmpNum.toString(); //Set XPM ID as string
        window.onLoad = function(){eval(saveCliNum);}
    }
    catch(err){
        alert("Remember to go back into edit client and hit save.\nXPM ID won't be saved otherwise!");
        srcCliNum;
    }

    //Automatically populate on page load - for those who have an existing client database that needs to be updated.
    //To do this automatically, check out my UI.Vision script on Github:

    $(document).ready(function(){
        eval(saveBSB);
        eval(saveAcc);
        eval(saveAccName);

        //Double check boxes are synced, as I'm a JS n00b and can't figure out how to change state of this code without clicking
        //By default this will sync to the inbuilt FFR field

        var srcChk = document.getElementById(srcFFR).classList.contains('x-form-cb-checked');
        var destChk = document.getElementById(destFFR).classList.contains('x-form-cb-checked');

        if (srcChk == destChk){
            return false;}
        else if (srcChk == true || destChk == false) {
            document.getElementById(destFFRb).click();}
        else {
            document.getElementById(srcFFRb).click();}

        //Set event listeners to change destination fields
        document.getElementById(srcBSB).onblur = function(){eval(saveBSB)}
        document.getElementById(srcAcc).onblur = function(){eval(saveAcc)}
        document.getElementById(srcAccName).onblur = function(){eval(saveAccName)}

        $(document.getElementById(srcFFRb)).on('click', function(){
            if (document.getElementById(srcFFR).classList.contains('x-form-cb-checked')
                == document.getElementById(destFFR).classList.contains('x-form-cb-checked')) {
                return false;}
            else {
                document.getElementById(destFFRb).click();;
            }});

        $(document.getElementById(destFFRb)).on('click', function(){
            if (document.getElementById(srcFFR).classList.contains('x-form-cb-checked')
                == document.getElementById(destFFR).classList.contains('x-form-cb-checked')) {
                return false;}
            else {
                document.getElementById(srcFFRb).click();;
            }});

        $("body").append('<div id="TMScriptDone"></div>');
    })
})();