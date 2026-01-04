// ==UserScript==
// @name         [0000000001]Stake.com HiLo Bot pattern tt
// @description  Aint got an Stake.com account yet, use my reflink to support my work here:
// @description  https://stake.com/?c=StakeGiveaways
// @description  to run the bot open https://stake.com/casino/games/hilo
// @description  set up amount by hand
// @description  Click button  "Payout" to choose your favourite Cashout-Multiplayer
// @description  EG enter 5 for 5x multiplayer
// @description  The bot picks the lower payout cart
// @match        https://stake.com/casino/games/hilo
// @version      5.1
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @description  The bot doesnt work on Tablat modus. Settings-dashbord needs to be visible on the left site.
// @downloadURL https://update.greasyfork.org/scripts/418746/%5B0000000001%5DStakecom%20HiLo%20Bot%20pattern%20tt.user.js
// @updateURL https://update.greasyfork.org/scripts/418746/%5B0000000001%5DStakecom%20HiLo%20Bot%20pattern%20tt.meta.js
// ==/UserScript==








window.addEventListener('load', function () {
var patternInput = prompt("Pattern");
  var isRunning = false;

function clickPattern(pattern, index = 0) {
    var buttons = document.querySelectorAll("button.cvZAjo");
    var higherBtn = buttons[0],
        lowerBtn = buttons[1];
    var higherBtnChance = parseFloat(higherBtn.innerText.split("\n")[1].replace("%", "")),
        lowerBtnChance = parseFloat(lowerBtn.innerText.split("\n")[1].replace("%", ""));

    var p = pattern.split(",");

    if(index < p.length) {
        var element = p[index];

        if(element == "n") {
            higherBtn.click();
        }
        else if(element == "s") {
            lowerBtn.click();
        }
        else if(element == "e") {
            if(higherBtnChance > lowerBtnChance) higherBtn.click();
            else lowerBtn.click();
        }
        else if(element == "w") {
            if(higherBtnChance < lowerBtnChance) higherBtn.click();
            else lowerBtn.click();
        }
        index++;

        if (isRunning){
            setTimeout(clickPattern, 800, pattern, index);}
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    var btnSet4 = document.createElement("button");
        btnSet4.textContent = "Pattern";
        btnSet4.id = "Pattern"
        btnSet4.style.position ="absolute";
        btnSet4.style.backgroundColor="white"
        btnSet4.style.bottom="150";
        btnSet4.style.left="0";
        btnSet4.style.display="block";
        btnSet4.gridtemplatecolumns="1fr 1fr";
        btnSet4.gridgap="10px";
        btnSet4.style.padding="10px 24px";
        btnSet4.style.left = "0px";
        btnSet4.style.bottom = "180px";
        btnSet4.style.width="200px";
        btnSet4.style.left = "auto";
        btnSet4.style.fontSize="17px"
        btnSet4.style.zIndex = "auto";
        btnSet4.style.margin="4px 2px";
        btnSet4.style.borderColor="black";
        btnSet4.style.borderRadius="4px";
        btnSet4.style.backgroundColor="white";
        btnSet4.addEventListener("click", function(){
        var patternInput = prompt("Pattern");
        btnSet4.innerHTML = 'Start';
        //setTimeout(function(){
        //document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").value = p ;
        //setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepUp(1);setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepDown(1);},220);},220)
        //},2020);



    btnSet4.addEventListener('click', (e) => {
        if(btnSet4.innerHTML == 'Start') {
            isRunning = true;
            btnSet4.innerHTML = 'Stop';
            patternInput.setAttribute('disabled', 'disabled');
            clickPattern(patternInput.value, 0);
        } else {
            isRunning = false;
            btnSet4.innerHTML = 'Start';
            patternInput.removeAttribute('disabled');
        }
    })
                    },2020)
        document.body.appendChild(btnSet4);
        },2020)
})



