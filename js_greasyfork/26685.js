
// ==UserScript==
// @name            Pyszniejsze - zakresy
// @author          jasieksor (ja@mojzesz.com)
// @namespace	    http://mojzesz.com/userscripts/pyszniejsze-zakresy
// @description     Changes filtering options to the pyszne.pl food delivery site
// @include         https://pyszne.pl/restauracja*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/26685/Pyszniejsze%20-%20zakresy.user.js
// @updateURL https://update.greasyfork.org/scripts/26685/Pyszniejsze%20-%20zakresy.meta.js
// ==/UserScript==

// Change this variable to 1 to get ranges instead of "to" values
var rangeValues = 1;

/*
    Koszt dostawy
*/

var deliveryCostDiv = document.getElementsByClassName("atom-filter-wrapper")[1];

while (deliveryCostDiv.children[2]) {
    deliveryCostDiv.removeChild(deliveryCostDiv.lastChild);    
}

for (var i = 1; i < 5; i++) {
    var newParentLabel = document.createElement("label");
    newParentLabel.setAttribute("class", "atom-filter");

    var newOption = document.createElement("input");
    newOption.setAttribute("type", "radio");
    newOption.setAttribute("name", "jig-filter-deliverycost-button");
    newOption.setAttribute("id", i);
    newOption.setAttribute("class", "jig-filter-radio-button jig-filter-radio-button-" + i);

    if (rangeValues == 0)
        newOption.setAttribute("data-range", "[0, " + i*5 + "]");
    else if (i <= 1)
        newOption.setAttribute("data-range", "[" + (i-1)*5 + ", " + i*5 + "]");
    else 
        newOption.setAttribute("data-range", "[" + (i-1)*5 + ".1, " + i*5 + "]");
    
    var newLabel = document.createElement("span");
    newLabel.setAttribute("class", "filter-label");

    if (rangeValues == 0)
        newLabel.innerHTML = "Do " + i*5 + " zł";
    else 
        newLabel.innerHTML = (i-1)*5 + "-" + i*5 + " zł";

    newParentLabel.appendChild(newOption);
    newParentLabel.appendChild(newLabel);

    deliveryCostDiv.appendChild(newParentLabel);
}

/*
    Minimalny koszt zamówienia
*/

var minimumOrderDiv = document.getElementsByClassName("atom-filter-wrapper")[2];

while (minimumOrderDiv.children[1]) {
    minimumOrderDiv.removeChild(minimumOrderDiv.lastChild);    
}

for (var i = 1; i < 6; i++) {
    var newParentLabel = document.createElement("label");
    newParentLabel.setAttribute("class", "atom-filter");

    var newOption = document.createElement("input");
    newOption.setAttribute("type", "radio");
    newOption.setAttribute("name", "jig-filter-mincart-button");
    newOption.setAttribute("id", i);
    newOption.setAttribute("class", "jig-filter-radio-button jig-filter-radio-button-" + i);

    if (rangeValues == 0)
        newOption.setAttribute("data-range", "[0, " + i*5 + "]");
    else if (i <= 1)
        newOption.setAttribute("data-range", "[" + (i-1)*5 + ", " + i*5 + "]");
    else 
        newOption.setAttribute("data-range", "[" + (i-1)*5 + ".1, " + i*5 + "]");
    
    var newLabel = document.createElement("span");
    newLabel.setAttribute("class", "filter-label");

    if (rangeValues == 0)
        newLabel.innerHTML = "Do " + i*5 + " zł";
    else 
        newLabel.innerHTML = (i-1)*5 + "-" + i*5 + " zł";

    newParentLabel.appendChild(newOption);
    newParentLabel.appendChild(newLabel);

    minimumOrderDiv.appendChild(newParentLabel);
}

