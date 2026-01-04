// ==UserScript==
// @name         MooMoo.io [ Hat Macro]
// @namespace    none
// @version      1
// @description  Hat macro and Starter Resources!
// @author      balls on my pace 
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/466835/MooMooio%20%5B%20Hat%20Macro%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/466835/MooMooio%20%5B%20Hat%20Macro%5D.meta.js
// ==/UserScript==

setInterval(() => window.follmoo && follmoo(), 10);

function Hat(id){
    storeBuy(id);
    storeEquip(id);
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') { // B for Solider
        Hat(6);
    }
    if (e.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox') { // ESC for uneuip hat
        Hat(0);
    }
    if (e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') { // G for Turret gear
        Hat(53);
    }
    if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') { // SHIFT for booster hat
        Hat(12);
    }
    if (e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "," for snow hat
        Hat(15);
    }
    if (e.keyCode == 60 && document.activeElement.id.toLowerCase() !== 'chatbox') { // P for flipper hat
        Hat(31);;
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Z for tank gear
        Hat(40);
    }
    if (e.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') { // J for emp helmet
        Hat(22);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') { // T for bull helmet
        Hat(7);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Y for samurai
        Hat(20);
    }
});

document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
$("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$("#adCard").remove();
$("#mapDisplay").css({background: `url('http://i.imgur.com/Qllo1mA.png')`});
$("#ageBarContainer").append('</br><div id="hacktext"></div><div style="width: 100%;position: absolute;bottom: 94px;text-align: center;color:blue;font-size: 24px;" id="freetext"></div><div style="width: 100%;position: absolute;bottom: 144px;text-align: center;color: #ed3f00;font-size: 24px;" id="ptext"></div><div style="width: 100%;position: absolute;bottom: 224px;text-align: center;color: #9a008b;font-size: 24px;" id="ctext"></div><div style="width: 100%;position: absolute;top: 100px;text-align: center;color: black;font-size: 12px;" id="bilgitext">[Z] Tank Gear | [G] Turret Gear | [T] Bull Helmet | [J] Emp Helmet | [B] Soldier Helmet | [<] Fish Hat | [,] Winter Cap | [Shift] Booster Helmet | [Y] Samurai Armor</div><div style="width: 100%;position: absolute;bottom: 170px;text-align: center;color: darkgreen;font-size: 24px;" id="atext"></div><div style="width: 100%;position: absolute;bottom: 196px;text-align: center;color: black;font-size: 24px;" id="mtext"></div>');
document.getElementById("storeHolder").style = "height: 500px; width: 435px;";

document.title = "simple Hat Macro"

document.querySelector("#leaderboard").appendChild(
  (function() {
    let text = "Ping: ";
    let oldPing = 0;
    const pingSpan = document.createElement("span");
    pingSpan.id = "pingTime";
    pingSpan.textContent = text;
    pingSpan.style.display = "inline-block";
    setInterval(function() {
      typeof pingTime !== "undefined" &&
        oldPing !== pingTime &&
        ((oldPing = pingTime),
        (pingSpan.textContent = text + oldPing),
        (function() {
          if (oldPing <= 100) {
            pingSpan.style.color = "green";
          }
          if (oldPing >= 101 && oldPing <= 250) {
            pingSpan.style.color = "Orange";
          }
          if (oldPing >= 251) {
            pingSpan.style.color = "red";
          }
        })());
    });
    return pingSpan;
  })()
);
