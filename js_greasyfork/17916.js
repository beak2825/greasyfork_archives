// ==UserScript==
// @name         Soylent Stuff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  spicing up the soylent
// @author       You
// @match        http*://diy.soylent.com/recipes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17916/Soylent%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/17916/Soylent%20Stuff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add function to format currency
    Number.prototype.formatMoney = function(c, d, t){
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d === undefined ? "." : d;
        t = t === undefined ? "," : t;
        var n = this,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    // modify scaling selector
    $('.amount-selector').attr("id","select");
    for (var week = 5; week<=52;week++){
        $('#select').append($("<option></option>").attr("value",week * 7).text(week + " weeks"));
    }

    // target total row
    $('table.ingredients > tbody:nth-child(3) > tr').attr("id","total-row");

    // change daily cost label
    $('#total-row > td:nth-child(1) > div:nth-child(2)').text('Total Cost');

    // add data-daily to total cost
    $('#total-row > td:nth-child(2)').attr("id","cost");
    $('#cost').attr("data-daily",$('#cost').text().replace("$", ""));

    // add data-daily to table
    $('table.ingredients > tbody:first() > tr > td:nth-child(4)').each(function (index,element) {$(element).addClass("cost");$(element).attr("data-daily",$(element).text().replace("$",""));});

    $('#select').on("change",function () {
        $('[data-daily]').each(function(index){$(this).text("$" + Number.parseFloat($(this).attr("data-daily") * $('#select').val()).formatMoney("."));});
    });

    var amountNodes         = $("[data-amount]");
    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
    var amountObserver      = new MutationObserver (amountHandler);
    var amountConfig        = { childList: true, characterData: true, attributes: true, subtree: true };

    //--- Add a target node to the observer. Can only add one node at a time.
    amountNodes.each ( function () {
        //console.log($(this));
        amountObserver.observe (this, amountConfig);
    } );
    
    var factor = 1;
    function amountHandler (mutationRecords) {
        //console.info ("amountHandler:");

        
        mutationRecords.forEach ( function (mutation) {
          // debugger;
           // console.log (mutation.type);
//debugger
            var amount = mutation.addedNodes[0].parentElement;
            var cost = $(amount.parentElement).find("td.cost");
            var newFactor = $(amount).text()/$(amount).attr("data-amount");
            if (factor==1) {factor = newFactor;}
            console.log(factor);
            var newCost = $(cost).attr("data-daily")*factor;
            cost.text("$"+newCost.formatMoney("."));

            if (typeof mutation.removedNodes == "object") {
                var jq = $(mutation.removedNodes);
                //console.log (jq);
                //console.log (jq.is("span.myclass2"));
                //console.log (jq.find("span") );
            }
        } );
        factor = 1;
    }
















})();