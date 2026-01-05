// ==UserScript==
// @name         Add Item Market link TEST
// @namespace    test
// @description  Adds a direct link to item market
// @version      0.3
// @match        *.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23814/Add%20Item%20Market%20link%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/23814/Add%20Item%20Market%20link%20TEST.meta.js
// ==/UserScript==

var menu = document.getElementsByClassName('areas');
var hospIcon = document.getElementById('icon15');
var jailIcon = document.getElementById('icon16');
var inHosp = false;
var inJail = false;
var statusOk = false;
if(hospIcon){if(hospIcon.className === 'iconShow'){inHosp = true;}}
if(jailIcon){if(jailIcon.className === 'iconShow'){inJail = true;}}
if(!inHosp && !inJail){statusOk = true;}

function addMarketLink(){
    //var menu = document.getElementsByClassName('areas');
    var iMarketLink = document.createElement('li');
    iMarketLink.className = "";
    iMarketLink.innerHTML = '<div class="list-link" id="nav-item-market"><a href="/imarket.php"><i class="dog-tags-icon left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Item Market</span></a></div>';
    if(menu[0] && statusOk){menu[0].insertBefore(iMarketLink, menu[0].children[2]);}
}

function addTravelLink(){
    //var menu = document.getElementsByClassName('areas');
    var travelLink = document.createElement('li');
    travelLink.className = "";
    travelLink.innerHTML = '<div class="list-link" id="nav-travel-agency"><a href="/travelagency.php"><i class="witch-navigation-icons left"></i><span class="border-l"></span><span class="border-r"></span><span class="list-link-name">Travel Agency</span></a></div>';
    if(menu[0] && statusOk){menu[0].insertBefore(travelLink, menu[0].children[4]);}
}

$(addMarketLink);
$(addTravelLink);