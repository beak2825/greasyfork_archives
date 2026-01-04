// ==UserScript==
// @name         CSA Report Setter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sets date for CSA report: SetupActionBreakdownByProduct
// @author       jack@autoloop.com
// @include      *https://csa.autoloop.us*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/375228/CSA%20Report%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/375228/CSA%20Report%20Setter.meta.js
// ==/UserScript==
'use strict';

if (window.location.href.includes('https://csa.autoloop.us/Report/SetupActionBreakdownByProduct')) {
    //start date
    var startD = new Date();
    var startDate = (startD.getMonth()+1) + "/" + startD.getDate() + "/" + (startD.getFullYear()-1);

    //end date
    var endD = new Date();
    var endDate = (endD.getMonth()+1) + "/" + endD.getDate() + "/" + (endD.getFullYear());

    $('#f_SignupDayFrom').val(startDate); //start date
    $('#f_SignupDayTo').val(endDate); //end date
}





