// ==UserScript==
// @name         Gym energy estimate
// @namespace    http://tampermonkey.net/
// @version      0.4.8
// @description  Adds an estimate of energy required to level gyms
// @author       Sam
// @match        https://www.torn.com/gym.php*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/404383/Gym%20energy%20estimate.user.js
// @updateURL https://update.greasyfork.org/scripts/404383/Gym%20energy%20estimate.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

const gymEnergies = [200, 500, 1000, 2000, 2750, 3000, 3500, 4000, 6000, 7000, 8000, 11000, 12420, 18000, 18100, 24140, 31260, 36610, 46640, 56520, 67775, 84535, 106305]
var musicStore = 0

if (window.localStorage.getItem('musicStore') == null){
    musicStore = false
} else {
    musicStore = (window.localStorage.getItem('musicStore') == 'true')
}

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

function hoverToolTip(energyIn){
    if (musicStore == true){
        return "Music store: On (click to change)<br>~"+String(Math.round(energyIn/(720+750)))+" days"
    } else {
        return "Music store: Off (click to change)<br>~"+String(Math.round(energyIn/(720+750)))+" days"
    }
}

function clickToolTip(gymNum,gymPercentage){
    musicStore = !musicStore
    window.localStorage.setItem('musicStore', musicStore)

    var eToGym = gymEnergies[gymNum-2]
    if (musicStore){
        eToGym = Math.round(eToGym/1.3)
    }
    var energyLeft = document.getElementById("EnergyLeft")
    var stringGym = energyLeft.innerHTML.split(" ")

    var energyIn = Math.round(eToGym*((100-gymPercentage)/100)/100)*100

    stringGym[1] = parseNum(energyIn) + "E/" + parseNum(eToGym)
    energyLeft.innerHTML = stringGym.join(" ")
    console.log(energyLeft.innerHTML)

    document.getElementById("toolMusic").addEventListener("mouseover", function() { document.getElementById("toolMusic").title = hoverToolTip(energyIn)} )
    document.getElementById("toolMusic").addEventListener("mousedown", function() { clickToolTip(gymNum,gymPercentage)} )
    document.getElementById("toolMusic").addEventListener("mouseout", function() { removeToolTips()} )
}

function removeToolTips(){
    var divs = document.getElementsByTagName("div")
    for ( var i in divs ){
        if (divs[i].id != undefined) {
            if (divs[i].id.includes("tooltip")){ divs[i].remove() }
        }
    }
}

$(window).load(function() {
    setTimeout(function(){
        var gymPercentID = findPercentage();
        if (gymPercentID == -1) {return -1}
        var gymPercentage = Number(gymPercentID.innerText.replace("%", ""));

        var buttonID = gymPercentID.parentElement.parentElement.parentElement;
        var gymNum = Number(buttonID.id.replace("gym-", ""));

        var eToGym = gymEnergies[gymNum-2]
        if (musicStore){
                eToGym = Math.round(eToGym/1.3)
        }

        var gymListID = buttonID.parentElement.parentElement;

        $(gymListID).append($('<div class="title-black top-round" id="EnergyLeft" aria-level="5" style="margin-top: 10px; text-align: center">Sam was here</div>'))
        var energyLeft = document.getElementById("EnergyLeft")

        var energyIn = Math.round(eToGym*((100-gymPercentage)/100)/100)*100
        energyLeft.innerHTML = "Estimated " + parseNum(energyIn) + "E/" + parseNum(eToGym) + "E to next gym<sup id='toolMusic' title='test' href='#'><i>[?]</i></sup>"

        document.getElementById("toolMusic").addEventListener("mouseover", function() { document.getElementById("toolMusic").title = hoverToolTip(energyIn)} )
        document.getElementById("toolMusic").addEventListener("mousedown", function() { clickToolTip(gymNum,gymPercentage)} )
        document.getElementById("toolMusic").addEventListener("mouseout", function() { removeToolTips()} )
    }, 1000);
})