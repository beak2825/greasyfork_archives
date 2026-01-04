// ==UserScript==
// @name         EC2 Cost Calculator
// @namespace    com.epidemico.ec2costcalc
// @version      0.25
// @description  Calculates the approximate monthly and yearly price for an instance (based on 30.4369 days/month and 365.2425 days/year)
// @author       Jesse Jones
// @match        https://aws.amazon.com/ec2/pricing/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37613/EC2%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/37613/EC2%20Cost%20Calculator.meta.js
// ==/UserScript==

var en = true;

$( document ).ajaxComplete(function() { costCalc(); });

var costCalc = function(e) {
    if (Object.keys($(".rate")).length > 0 && en) {
        $(".rate").each(function(i) {
            var txt = $(this).text();
            var hourly = txt.match(/\$(\d+\.\d+) per Hour/);
            if (!!hourly) {
                if (hourly.length > 1) {
                    var monthly = Math.round(hourly[1] * 730.4856); //  30.4369 days * 24 hours =  730.4856 hours per month
                    var yearly = Math.round(hourly[1] * 8765.8200); // 365.2425 days * 24 hours = 8765.8200 hours per  year
                    $(this).attr("title","$" + monthly + " per Month\n$" + yearly + " per Year");
                }
            }
            en = false;
        });
    } else if (en === false) {
        console.log("[[" + GM.info.script.name + "]] Cost calculations complete.");
        costCalc = function() {};
    }
};