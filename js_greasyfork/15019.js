// ==UserScript==
// @name         freebird
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  Freebird helper script
// @author       mat
// @match        https://na65.salesforce.com/lead/leadconvert.jsp*
// @match        https://indow.my.salesforce.com/lead/leadconvert.jsp*
// @match        https://na65.salesforce.com/00T/*
// @match        https://indow.my.salesforce.com/00T/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15019/freebird.user.js
// @updateURL https://update.greasyfork.org/scripts/15019/freebird.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
if (window.location.pathname.indexOf("/lead/") == 0){
document.getElementById("cstatus").selectedIndex = "3";
    if($("#noopptt").val() == "IW - Self Measure-"){
$("#noopptt").val("IW - Self Measure -" + $(".pageDescription:first").text());
        $("#accid option:contains(Attach to Existing: IW - Self Measure - Exp)").prop('selected',true);
    }
    if($("#noopptt").val() == "IW - Self Measure - Dealer Reassign-"){
     $("#noopptt").val("IW - Self Measure - Dealer Reassign -" + $(".pageDescription:first").text());
        $("#accid option:contains(Attach to Existing: IW - Self Measure - Dealer Reassign)").prop('selected',true);
    }   
}
if (window.location.pathname.indexOf('/00T/') == 0) {
    var relatedto = $('#tsk3_mlktp option:selected').text();
    var nametype = $("#tsk2_mlktp option:selected").text();
            var opp = $('#tsk3').val();
    var opp = opp.split('-');
var opp = opp.pop();
var opp = opp.trim();
    if (relatedto === "Opportunity" && nametype === "Contact" && opp != ''){
        
$('#tsk2').val(opp);
    }

}