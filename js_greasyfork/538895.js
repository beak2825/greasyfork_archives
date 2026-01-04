// ==UserScript==
// @name         Neopets - Neolodge fill-in
// @version      0.1.1.1
// @license      Unlicense 
// @description  auto adds all pets for max number of days
// @author       Someday I Wish
// @match        http*://www.neopets.com/neolodge.phtml*
// @namespace https://greasyfork.org/users/810491
// @downloadURL https://update.greasyfork.org/scripts/538895/Neopets%20-%20Neolodge%20fill-in.user.js
// @updateURL https://update.greasyfork.org/scripts/538895/Neopets%20-%20Neolodge%20fill-in.meta.js
// ==/UserScript==
// SETTINGS - After saving this file, refresh the page to see the effects!===============================================

var hotel_choice = 1; // 1 is cockroach towers, 2 is fleapit hotel, etc etc. Goes until 10.
var nights_staying = 0; // keep at 0 for default (max). otherwise, premium goes to 90 days, nonpremium goes until 28
var hide_premium = true; // true or false. if true, hides the reminder for premium--make sure it's in lowercase!

// ACTUAL SCRIPT ========================================================================================================

const hotel_cost_list = [0,5,10,20,30,40,50,80,100,200,500]
const np_value = document.getElementById('npanchor').text;

document.getElementById("book_all").checked = true; //books all
document.getElementsByName("hotel_rate")[0].selectedIndex = hotel_choice;

var nights = document.getElementsByName('nights')[0];

if (nights_staying === 0) {
    var nights_selected = nights.options.length-1; //default (0), sets to max # of nights ( 90 if premium, 28 if not.)
}
else {
    var nights_selected = nights_staying; //sets to whatever you chose
}

nights.selectedIndex = nights_selected;
var np_cost_total = +hotel_cost_list[hotel_choice] * +nights_selected;
var np_subtract = +np_value - np_cost_total;
var confirm_text;

warningText();

if(document.URL.indexOf("neolodge.phtml/") == -1) {
    hidePremium();
}

function warningText(){ //directs you to bank if you don't have enough np on hand.

    if (np_subtract < 0) {
        var np_check = "<font color=\"red\">(You need <b>" + Math.abs(np_subtract) +
            "</b> NP more.)<br><br><a href=\"https://www.neopets.com/bank.phtml\">Visit the bank!</a></p></center>";
    }
    else {
        var np_check = "<font color=\"green\"><b>Go ahead :)</b></font></p></center>";
    }

    document.getElementsByTagName("form")[1].insertAdjacentHTML("beforeend", "<center><p>This will cost you <b>" +
                                                                np_cost_total + "</b> NP.<br>" + np_check);
}

function hidePremium(){

    if (hide_premium === true) {
        var premium_promo = document.getElementsByClassName("premium-promo")[0];
        premium_promo.style.display = "none";
       }

}