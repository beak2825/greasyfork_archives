// ==UserScript==
// @name         SteamGifts Auto Join Giveaway
// @namespace    http://sergiosusa.com/
// @version      0.12
// @description  Auto Join for Steamgifts giveaway
// @author       Sergio Susa (http://sergiosusa.com)
// @match        https://www.steamgifts.com/*
// @grant        none
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13538/SteamGifts%20Auto%20Join%20Giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/13538/SteamGifts%20Auto%20Join%20Giveaway.meta.js
// ==/UserScript==

var interval = 5*60*1000;
var minLevel = 2;
var tries = 0;
var joinDLC = false;
var minimunPoints = 15;

$(document).ready(function() {

    if (tryToJoinGiveaway()) {
        return;
    }

    showDLC(joinDLC);

    setInterval(function(){

        if (tries > 1) {
            realoadPage(1000);
        }

        if (enoughPoints(minimunPoints)) {

            if (minLevel > 0) {
                var validLevelGiveaways =  $(".giveaway__column--contributor-level--positive");

                for (var x = 0; x < validLevelGiveaways.length ; x++) {
                    if ( validateMinimunLevel(validLevelGiveaways[x].innerHTML, minLevel) && !validateAlreadyEnter(validLevelGiveaways[x]) ) {
                            addClassToItem(validLevelGiveaways[x].parentNode.parentNode.parentNode, " i_giveaway");
                    }
                }

                var linksEasySteamGifts = $("div.i_giveaway > div > h2 > a.giveaway__heading__name");

                clickLinks(linksEasySteamGifts, 8);

            } else {

                var linksEasySteamGifts = $("a.giveaway__heading__name");

                clickLinks(linksEasySteamGifts, 8);
            }

            realoadPage(10000);
        }

        tries ++;
    }, interval);

});

function showDLC (show) {

    if ( show === false) {

        var items = $(".giveaway__heading__name");
        for (var x = 0; x < items.length; x++) {
            if (items[x].innerHTML.indexOf("DLC") != -1) {
                console.log(items[x].innerHTML);
                items[x].closest('.giveaway__row-outer-wrap').remove();
            }
        }
    }
}

function enoughPoints(minimunPoints) {

    var points = document.getElementsByClassName("nav__points")[0].innerHTML;
    if (points > minimunPoints) {
        return true;
    }
    return false;
}

function tryToJoinGiveaway() {

    if (window.location.href.indexOf("giveaway") != -1) {
        closePage(10000);
        $(".sidebar__entry-insert")[0].click();
        return true;
    } else {
        return false;
    }
}

function validateMinimunLevel(dirtyLevel, minimunLevel) {

    if (dirtyLevel.replace("Level ", "").replace("+", "") >= minimunLevel) {
        return true;
    } else {
        return false;
    }
}

function validateAlreadyEnter($object) {

    if($object.parentNode.parentNode.parentNode.className.indexOf("is-faded") == -1) {
        return false;
    } else {
        return true;
    }

}

function clickLinks(links, maxClicks) {

    var clicks = 0;

    for (var x = 0; x < links.length && clicks < maxClicks ; x++) {
        addTargetBlankToAnchor(links[x]);
        links[x].click();
        clicks++;
    }

}

/***********************************************************
 *  Utility Functions
 **********************************************************/

function realoadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}

function closePage(miliseconds) {
    setInterval(function(){
        window.close();
    }, miliseconds);
}

function addClassToItem(item, cls) {
    item.className =  item.className + cls;
}

function addTargetBlankToAnchor(anchor) {
    anchor.setAttribute('target', '_blank');
}