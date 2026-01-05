// ==UserScript==
// @name         AutoJoin IndieGala Giveaways
// @namespace    http://sergiosusa.com
// @version      0.2
// @description  Autojoin for IndieGala Giveaways!
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.indiegala.com/giveaways*
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20041/AutoJoin%20IndieGala%20Giveaways.user.js
// @updateURL https://update.greasyfork.org/scripts/20041/AutoJoin%20IndieGala%20Giveaways.meta.js
// ==/UserScript==

var reloading = 600000; // 10 minutes
var trying = 10000 ; // 20 seconds
var minPoints = 5;
var minLevel = 1;
var includeAreadyHave = false;

(function() {
    'use strict';


    if (window.location.href.indexOf('www.indiegala.com/giveaways/detail') != -1) {

        if ($(".on-steam-library-rotated").length === 0 || includeAreadyHave === true ) {
            $(".giv-coupon")[0].click();
        }

        setInterval(function(){
            window.close();
        }, 5000);

        return;
    }

    removeWithLevelRestriction();

    realoadPage(reloading);

    if ($(".coins-amount strong").html() < minPoints ) {
        realoadPage(reloading);
        return;
    }

    if ($(".giv-coupon-link").length > 0) {

        for (var i = 0; i < $(".giv-coupon-link").length && i < 5 ; i++) {
            window.open($(".giv-coupon-link")[i].href,'_blank');
        }
    }

    setInterval(function(){


        var page = calculateNextPage();

        console.log(page);

        if (page > 50) {
            page = 1;
        }

        window.location="https://www.indiegala.com/giveaways/[NUM_PAGE]/expiry/asc".replace("[NUM_PAGE]", page);


    }, trying);


})();

/***********************************************************
 *  Utility Functions
 **********************************************************/

function calculateNextPage()
{
    var page = window.location.href.replace("https://www.indiegala.com/giveaways/","").replace("/expiry/asc","");
    return parseInt(page)+1;
}

function realoadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}

function removeWithLevelRestriction()
{

    $(".cover-cont").remove();

    var aEliminar = [];
    console.log(1);
    for (var i = 0; i < $(".type-level-cont").length ; i++) {

        for (var x = minLevel + 1; x < 10 ; x++)
        {
            if ($(".type-level-cont")[i].innerHTML.indexOf(x+"+") != -1)
            {
                aEliminar.push($(".type-level-cont")[i]);
            }
        }
    }

    console.log("tamano inicial: " + aEliminar.length);

    while (aEliminar.length > 0) {
        var node = aEliminar.pop();
        node.remove();
        console.log("a borrar" + aEliminar.length);
    }
}

/***********************************************************
 *  Override Functions
 **********************************************************/
window.confirm = function (message, callback, caption) {
    return true;
};