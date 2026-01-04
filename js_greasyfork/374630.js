// ==UserScript==
// @name         Bugdetbytes american to international unit converter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert freedom units to international units
// @author       Histidin
// @match        https://www.budgetbytes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374630/Bugdetbytes%20american%20to%20international%20unit%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/374630/Bugdetbytes%20american%20to%20international%20unit%20converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Convert fractions x/y into floating point numbers
    function numberize(number) {
        if(number.includes("/")) {
            var division = []
            division = number.split("/")
            number = parseFloat(division[0]) / parseFloat(division[1])
        }
        return number
    }

    // Unit converter
    function FreedomToSI(amount, unit) {
        // normal units


        // cup
        var cup = ["cup", "cups"]
        if (cup.includes(unit)) {
                amount = amount*236.588
                unit = "ml"
        }

        // pounds
        var lb = ["lb", "lbs", "lb.", "lbs."]
        if (lb.includes(unit)) {
            amount = amount*453.592
            unit = "g"
        }

        // Ounce
        var oz = ["oz.", "oz", "oz. block", "oz. can", "oz can"]
        if (oz.includes(unit)) {
                amount = amount*28.3495
                unit = "g"
        }

        // Messed up unit in amount
        if (unit == "can") {
            if(amount.includes(" oz")) {
                amount = amount.split(" ")
                var canSI = FreedomToSI(amount[0], "oz")
                amount = canSI[0]
                unit = "g canned"
            }
        }

        // Converts oz. cans to g cans
        var regex = /(\d+)\s?oz\. (can|box)/
        if(unit.match(regex)) {
            var cansize = unit.match(regex);
            var canSI = FreedomToSI(cansize[1], "oz")
            unit = canSI[0]+"g "+cansize[2]
        }
        // Round number above threshold. Threshold is necessary to avoid 0 when amount is small
        if(amount > 20) {
            amount = Math.round(amount)
        }
        return([amount,unit])
    }

    var rootnode=document.getElementsByClassName("wprm-recipe-ingredient")

    var i = 0
    for(i = 0; i < rootnode.length; i++) {
        var node = rootnode[i]
        if(node.childElementCount == 4) {
            var SIamount = [];
            var amount = node.children[0].textContent
            var unit = node.children[1].textContent
            amount = numberize(amount)
            SIamount = FreedomToSI(amount, unit)
            node.children[0].textContent = SIamount[0]
            node.children[1].textContent = SIamount[1]
        }
    }
})();