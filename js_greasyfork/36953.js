// ==UserScript==
// @name         eToro - addon
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  try to take over the world!
// @author       You
// @match        https://www.etoro.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36953/eToro%20-%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/36953/eToro%20-%20addon.meta.js
// ==/UserScript==
// By MbNeo

(function() {
    'use strict';

    setInterval(function(){
        if($(".head-info-stats-value").length>0){
            document.title = $(".head-info-stats-value")[0].innerText + "(" + $(".head-info-stats-change")[0].innerText.split("(")[1].replace(") ","") + ") - " + $(".user-nickname")[0].innerText + ")";
    
            var Sell = parseFloat($("[data-etoro-automation-id='buy-sell-button-rate-value']")[0].innerText.trim());
            var Buy = parseFloat($("[data-etoro-automation-id='buy-sell-button-rate-value']")[1].innerText.trim());
    
    
            if($("#mb_spread").length===0){
                if($("[ng-if=':: !marketCtrl.instrument.isPreview']").length>0){
                    $("[ng-if=':: !marketCtrl.instrument.isPreview']").append('<span id=\'mb_spread\' style=\'color: orange;\'>...</span>');
                }
            } else {
                var fSpread = parseInt((Buy-Sell)*1000)/1000;
                var fSpreadPercent = parseInt(((fSpread/Buy)*100)*10)/10;
        
                $("#mb_spread")[0].innerHTML = "Buy= $" + Buy + " - " + "Spread= $" + fSpread + " (" + fSpreadPercent + "%)";
            }
        }
    },1000);
})();