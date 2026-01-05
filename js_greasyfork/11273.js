// ==UserScript==
// @name         dodds URL
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.2
// @description  1 and 2 opens links.  Keypad selects answers
// @author       ikarma
// @include        https://informationevolution2.crowdcomputingsystems.com/*
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11273/dodds%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/11273/dodds%20URL.meta.js
// ==/UserScript==

var city = $("span:contains('City')").text().split('City: ');
var city1 = city[1];
var city2 = city[2];
var TargetLink = $("a:contains('http')");
var google1 = "https://www.google.com/search?q=" + city1 + ' site:' + TargetLink[0];
var google2 = "https://www.google.com/search?q=" + city2 + ' site:' + TargetLink[1];
var $j = jQuery.noConflict(true);

$("input[value='correct']").eq(0).click();
$("input[value='correct']").eq(1).click();

document.addEventListener("keydown", kas, false);
window.opener.focus();



function kas(i) {
    if (i.keyCode == 49) { //1 
        window.open(google1, "name", 'left=1200, scrollbars=1,'); 
        window.onbeforeunload = function () {
            window.open(google1, "name", 'left=1200, scrollbars=1,').close();
        }; 
    }


    if (i.keyCode == 50) { //2
        window.open(google2, "name", 'left=1200, scrollbars=1,'); 
        window.onbeforeunload = function () {
            window.open(google2, "name", 'left=1200, scrollbars=1,').close();
        };
    }

    if (i.keyCode == 97) { //Numpad 1   
        $j('input[value="address_varies"]').eq(0).click();
    }

    if (i.keyCode == 98) { //Numpad 2   
        $j('input[value="similar_name"]').eq(0).click();
    }

    if (i.keyCode == 99) { //Numpad 3   
        $j('input[value="incorrect"]').eq(0).click();
    }
    if (i.keyCode == 100) { //Numpad 4   
        $j('input[value="address_varies"]').eq(1).click();
    }

    if (i.keyCode == 101) { //Numpad 5   
        $j('input[value="similar_name"]').eq(1).click();
    }

    if (i.keyCode == 102) { //Numpad 6   
        $j('input[value="incorrect"]').eq(1).click();
    }
}
