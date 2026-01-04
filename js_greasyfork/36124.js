// ==UserScript==
// @name Patreon Pledge Predictor
// @description Calculates the new patreon pledge amount
// @author compujosh
// @version 1.02
// @namespace compujosh
// @match https://www.patreon.com/bePatron?c=*&rid=*
// @match https://www.patreon.com/join/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/36124/Patreon%20Pledge%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/36124/Patreon%20Pledge%20Predictor.meta.js
// ==/UserScript==

function roundToTwo(num) {
    return Math.round(parseFloat(num)*100)/100;
}

function calcPledge(pledgeAmnt, worksNum) {
    var precisionAmnt = (Math.floor(Math.log10(pledgeAmnt))+1) + 4; // Num whole digits + 4

    var formula = worksNum * roundToTwo((pledgeAmnt + (pledgeAmnt * 0.029) + 0.35).toPrecision(precisionAmnt));
    return formula.toFixed(2);
}

function updatePrediction() {
    // React app, so make sure we have the right page
    if ((/https?:\/\/www.patreon.com\/join\/.*\/checkout/).test(document.baseURI)) {
        // Monthly confirmation page

        // Check max per month is enabled
        if ($('.react-numeric-input').length === 0) {
            // Remove calculation if N/A
            $('#realPledgeAmnt').html("");
            return;
        }

        // Put est container back in
        if ($('#realPledgeAmnt').length === 0) $('.react-numeric-input').parent().parent().parent().parent().parent().after('<div id="realPledgeAmnt" style="color:gray;font-size:95%;"></div>');

        var pledgeAmnt = parseFloat($('span.mr-sm span')[0].innerHTML.split("+")[0].replace("$",""));
        var monthlyMax = parseFloat($("input.form-control").prop("value"));
        $('#realPledgeAmnt').html("Total: $"+calcPledge(pledgeAmnt,monthlyMax));
    }
    else if ((/^https?:\/\/www.patreon.com\/bePatron\?c=[0-9]*&rid=[0-9]*/).test(document.baseURI)) {
        // Put est container back in after changing reward tier
        if ($('#realPledgeAmnt').length === 0) $('.react-numeric-input').after('<div id="realPledgeAmnt" style="color:gray;font-size:95%;"></div>');

        var pledgeAmnt = parseFloat($("input.form-control").prop("value"));
        $('#realPledgeAmnt').html("$"+calcPledge(pledgeAmnt,1));
    }
    else {
        // Wrong page
    }
}


//setInterval(updatePrediction, 250);

