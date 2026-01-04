// ==UserScript==
// @name         Supply Store - Raffle Auto fill
// @namespace    https://github.com/LunaFr0st/
// @version      1
// @description  Auto Fill form
// @author       LunaFr0st
// @match        https://www.supplystore.com.au/raffle-*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383438/Supply%20Store%20-%20Raffle%20Auto%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/383438/Supply%20Store%20-%20Raffle%20Auto%20fill.meta.js
// ==/UserScript==
$(document).ready(function(){
    const data = {
        "firstName": "",                                    // Enter First Name
        "lastName": "",                                    // Enter Last Name
        "email":"",                          // Enter Email
        "phone":"",                                   // Enter Phone Number
        "size":"",                                            // Enter US Size
        "street":"",                             // Enter Street
        "suburb":"",                                  // Enter Suburb
        "state":"",                                          // Enter State (Has to be all in caps and short form (ie. NSW, ACT, VIC, etc.)
        "country":"",                                  // Enter Country
        "postcode":""                                       // Enter Postcode
    };
    // Getting Id's
    const fName = $("label:contains('First Name')" ).attr("for");
    const lName = $("label:contains('Last Name')" ).attr("for");
    const email = $("label:contains('Email')" ).attr("for");
    const phone = $("label:contains('Phone Number')" ).attr("for");
    const size = $("label:contains('Size')" ).attr("for");
    const street = $("label:contains('Street')" ).attr("for");
    const suburb = $("label:contains('Suburb/Town')" ).attr("for");
    const state = $("label:contains('State')" ).attr("for");
    const country = $("label:contains('Country')" ).attr("for");
    const postcode = $("label:contains('Post Code')" ).attr("for");
    const sizeCode = $("option:contains(US "+data.size+")").attr("value");
    const stateCode = $("option:contains("+data.state+")").attr("value");
    // Setting Values
    const enterData = () =>{
        $("#"+fName).val(data.firstName);
        $("#"+lName).val(data.lastName);
        $("#"+email).val(data.email);
        $("#"+phone).val(data.phone);
        $("#"+size).val(sizeCode);
        $("#"+street).val(data.street);
        $("#"+suburb).val(data.suburb);
        $("#"+state).val(stateCode);
        $("#"+country).val(data.country);
        $("#"+postcode).val(data.postcode);
        $("#cm-privacy-consent").prop("checked",true);
        $("#acceptTerms").prop("checked",true);
    }
    // Setting Values
    enterData();

});