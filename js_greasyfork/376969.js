// ==UserScript==
// @name         Poll tally
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the ~~world~~ intermediate book club!
// @author       You
// @match        https://community.wanikani.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376969/Poll%20tally.user.js
// @updateURL https://update.greasyfork.org/scripts/376969/Poll%20tally.meta.js
// ==/UserScript==

let difficulties = ['No effort at all', 'Minimal effort','Just right','Challenging','Impossible, even with everyone’s help'];

function updatePollResults(){
   jQuery(".poll").each(function(){
    console.log(jQuery(this).children().eq(0).children().eq(1));
    jQuery(this).children().eq(0).children().eq(1).children().each(function (index){
            if(index > 0){
                jQuery(this).remove();
            }
        });
    jQuery(this).children().eq(0).children().eq(1).append("<span>Score: "+getPollResult(this).toFixed(2)+"</span>");
});
}

function getPollResult(poll){
    var total = 0;
    var totalPeop = parseInt(jQuery(".info-number",poll)[0].textContent);
    var count = 0;
    jQuery("li div.option p",poll).each(function (index){
        var text = jQuery(this).children().eq(1)[0].textContent;
        var value = jQuery(this).children().eq(0)[0].textContent;
        value = parseFloat(value.substring(0,value.length-1))/100.0;
        var ind = difficulties.findIndex(function(elem){
            return elem == text});
        //console.log(value+" "+ind);
        if(ind != -1){
            var nPeople = Math.round(value*totalPeop);
            total += nPeople * (ind + 1);
            count += nPeople;
        }
    });
    //console.log("total "+total.toFixed(2));
    return total/(count>0?count:1.0);
}

(function() {
    'use strict';

    updatePollResults();
})();