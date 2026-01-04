// ==UserScript==
// @name         Gym Energy Estimate
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Adds an estimate of energy required to level gyms
// @author       Sam, Dead Mechanic
// @match        https://www.torn.com/gym.php*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/404390/Gym%20Energy%20Estimate.user.js
// @updateURL https://update.greasyfork.org/scripts/404390/Gym%20Energy%20Estimate.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

const gymEnergies = [200, 500, 1000, 2000, 2750, 3000, 3500, 4000, 6000, 7000, 8000, 11000, 12420, 18000, 18100, 24140, 31260, 36610, 46640, 56520, 67775, 84535, 106305]


function findPercentage() {
    var divs = document.getElementsByTagName('div')
    for (var i = 0; i<divs.length; i++){
        if (divs[i].className.startsWith("percentage")){
            return divs[i];
        }
    }
    return -1
}

function parseNum(numIn){
    return String(numIn).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

$(window).load(function() {
    setTimeout(function(){
        var gymPercentID = findPercentage();
        if (gymPercentID == -1) {return -1}
        var gymPercentage = Number(gymPercentID.innerText.replace("%", ""));

        var buttonID = gymPercentID.parentElement.parentElement.parentElement;
        var gymNum = Number(buttonID.id.replace("gym-", ""));

        var gymListID = buttonID.parentElement.parentElement;

        $(gymListID).append($('<div class="title-black" id="EnergyLeft" aria-level="5" style="margin-top: 10px; text-align: center; border-radius:5px"></div>'))
        var energyLeft = document.getElementById("EnergyLeft")

        var estimatedRemaining = Math.round((gymEnergies[gymNum-1]) - (gymEnergies[gymNum-1])*(gymPercentage/100));

        energyLeft.innerHTML = "Estimated " + estimatedRemaining + " Energy to Next Gym!"
    }, 1000);
})