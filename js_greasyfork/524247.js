// ==UserScript==
// @name         Ebay Sponsor Block
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Find and remove sponsored results on Ebay
// @author       Catpuccino
// @match        *://*.ebay.com/sch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.com
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524247/Ebay%20Sponsor%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/524247/Ebay%20Sponsor%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const wait_until_element_appear = setInterval(() => {
        if ($('#mainContent').length !== 0) {
              detectSponsors();
            }
    }, 0);
})();

String.prototype.toNum = function(){
    return parseInt(this, 10);
};

String.prototype.pullNum = function(){
    return this.match(/-?\d+/)[0].toNum();
}

Array.prototype.last = function() { return this[this.length-1]; };

function detectSponsors(){
    var sponsorElementList = $('.s-item__detail.s-item__detail--primary > span > span> div:contains("Sponsored")')

    $.each(sponsorElementList, function(index){
        if (index < 2){ return; };
        var obj = sponsorElementList.eq(index);
        //console.log(obj)
        var padding = obj.css('padding-top').pullNum();
        var margin = obj.css('margin-top').pullNum();

        var transformMatrix =
            obj.css("-webkit-transform") ||
            obj.css("-moz-transform")    ||
            obj.css("-ms-transform")     ||
            obj.css("-o-transform")      ||
            obj.css("transform");
        var yAxis = transformMatrix.split(',').last().pullNum();
        //console.log([padding, margin, yAxis]);
        //console.log(padding - margin - yAxis);
        var sponsored = (padding - margin - yAxis ) > 0
        if (sponsored) {
            //console.log("Sponsorship status: " + sponsored);
            removeSponsor(obj);
            return;
        };

    });
};

function removeSponsor(obj){
    obj.closest('.s-item.s-item__pl-on-bottom').remove();
}