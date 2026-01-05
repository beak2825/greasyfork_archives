// ==UserScript==
// @name         Blake's CSGODOUBLE Script
// @namespace    https://github.com/GamrCorps/CSGODOUBLE/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.csgodouble.com/
// @grant        none
// @updateUrl    https://rawgit.com/GamrCorps/CSGODOUBLE/master/csgodouble4.js
// @downloadURL https://update.greasyfork.org/scripts/17138/Blake%27s%20CSGODOUBLE%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/17138/Blake%27s%20CSGODOUBLE%20Script.meta.js
// ==/UserScript==

//Customizable Options
startingBet = 1
maxBet = 128
maxSteps = 100
pattern = ["black", "black", "black", "red"]
betWrongFactor = 2
resetBetOnGreen = false;

function getNextColor(step){
    return pattern[step % pattern.length]
}

function getNextBet(bet, correct){
    return correct ? startingBet : bet * betWrongFactor
}

function numToColor(num){
    return num==0?"green":num<8?"red":"black"
}

function placeBet(color, bet) {
    input.value = bet.toString()
    if (color == "red") {
        redButton.click()
    } else if (color == "green") {
        greenButton.click()
    } else {
        blackButton.click()
    }
    input.value = ""
}

currentColorStep = 0
currentStep = 0
currentBet = startingBet
banner = document.getElementById('banner')
past = document.getElementById('past')
redButton = document.getElementById('panel1-7').children[0].children[0]
greenButton = document.getElementById('panel0-0').children[0].children[0]
blackButton = document.getElementById('panel8-14').children[0].children[0]
input = document.getElementById('betAmount')
betInStep = false;
lastCorrect = true;

setInterval(function(){
    if (banner.innerHTML == "***ROLLING***") {
        betInStep = false;
    } else if (banner.innerHTML.startsWith("Rolling")  && !betInStep){
        pastColor = numToColor(parseInt(past.children[9].innerHTML))
        color = getNextColor(currentColorStep)
        if (pastColor!=getNextColor(currentColorStep-1)) {
            lastCorrect=false
        } else {
            lastCorrect=true
        }
        amount = getNextBet(currentBet, lastCorrect)
        currentBet = getNextBet(currentBet, lastCorrect)
        if (pastColor=="green") {
            currentColorStep = 0
            if (resetBetOnGreen) {
                amount = startingBet
                currentBet = startingBet
            }
            color = getNextColor(currentColorStep)
        }
        console.log(color+": "+amount.toString())
        placeBet(color, Math.min(amount, maxBet))
        currentColorStep += 1
        currentStep += 1
        betInStep = true
    }
},500);