// ==UserScript==
// @name         Extra Croutons (Beta)
// @namespace    None
// @version      1.2 Beta
// @description  Allows you to summon more croutons, or to have the script do so automatically.
// @author       4TSOS
// @match        *crouton.net/*
// @icon         https://i.ibb.co/jTVWGnV/Crouton.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441946/Extra%20Croutons%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441946/Extra%20Croutons%20%28Beta%29.meta.js
// ==/UserScript==

(function() {

})();

Starter_Crouton = document.querySelector('HTML > Body > img');
Starter_Crouton.style.display = "none";
var Watermark = document.createElement('p');
Watermark.innerHTML = "4TSOS Crouton Summoner";
Watermark.style.position = "static";
Watermark.style.textShadow = "1px 1px 1px orange";
document.body.appendChild(Watermark);
var Crouton_Button = document.createElement('button');
Crouton_Button.innerHTML = "Summon Crouton";
Crouton_Button.className = "crouton_button";
Crouton_Button.style.position = "static";
Crouton_Button.onclick = function() {
    var Crouton = document.createElement('img');
    const Crouton_Images = [
                           "crouton.png",
                           "https://i.ibb.co/52sQrFn/1156488.png",
                           "https://i.ibb.co/zS3DQW2/704.png",
                           "https://i.ibb.co/Dt4qVkp/600.jpg",
                           "https://i.ibb.co/dkTbPDM/850.jpg",
                           "https://i.ibb.co/7ycSM7j/65.png"
    ];
    Crouton.src = Crouton_Images[Math.floor(Math.random() * Crouton_Images.length)];
    Crouton.style.cssText = "max-width: 32px; max-height: 30px";
    Crouton.alt = "Crouton";
    Crouton.className = "crouton";
    document.body.appendChild(Crouton);
}
var Auto_Crouton_Button = document.createElement('button');
Auto_Crouton_Button.innerHTML = "Automate Summoning";
Auto_Crouton_Button.className = "auto_crouton_button";
Auto_Crouton_Button.style.position = "static";

var Reset_Button = document.createElement("button");
Reset_Button.innerHTML = "Reset";

       var Summon_Crouton_Button = document.getElementsByClassName("crouton_button");
Auto_Crouton_Button.onclick = function() {
    var Auto_Summon_Confirm = confirm("Do you want to enable auto-summon?");
    if (Auto_Summon_Confirm === true) {
        var Auto_Summon_Delay = prompt("What should the delay between summons be? (MS)");
        var Auto_Summon = setInterval(() => {
            Crouton_Button.click();
        }, Auto_Summon_Delay);
       if (Auto_Summon_Delay > 0) {
           Auto_Summon;
       }
       else if (Auto_Summon_Delay == 0) {
                if (confirm("Are you sure you want to set the delay to 0?")) {
                Auto_Summon;
            }
           else {
               clearInterval(Auto_Summon);
           }
    }
  }
    Reset_Button.onclick = () => {
        clearInterval(Auto_Summon);
    }
}
var Counter = document.createElement("span");
var All_Croutons = document.getElementsByClassName("crouton");
setInterval(() => {
    Counter.innerHTML = `You have ${Intl.NumberFormat("en-us").format(All_Croutons.length)} Croutons`;
}, 1);
Counter.cssText = "font-size: 30px; display: block";

    Reset_Button.onclick = () => {
        // remove all courtons
       while (All_Croutons.length) All_Croutons[0].remove();
    };
document.body.appendChild(Counter);
document.body.appendChild(Auto_Crouton_Button);
document.body.appendChild(Crouton_Button);
document.body.appendChild(Reset_Button);