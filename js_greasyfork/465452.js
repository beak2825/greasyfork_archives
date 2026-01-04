// ==UserScript==
// @name         SUESAM Auto Claim Twitch drop
// @version      1.1.2
// @description  Auto clicking "Click to claim a drop" under the chat
// @author       SUESAM
// @match        https://www.twitch.tv/drops/inventory*
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1038803
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465452/SUESAM%20Auto%20Claim%20Twitch%20drop.user.js
// @updateURL https://update.greasyfork.org/scripts/465452/SUESAM%20Auto%20Claim%20Twitch%20drop.meta.js
// ==/UserScript==

setInterval(function() {
    let buttons = document.querySelectorAll("button");
    let atualizar = true;
    buttons.forEach((button, ia) => {
        let encontrou = false;

        button.querySelectorAll("div").forEach((div, ib) => {
            if (div.textContent === "Resgate agora") {
                encontrou = true;
                return false;
            }
        });

        if (encontrou) {
            atualizar = false;
            button.click();
            setTimeout(function (){
             window.location.reload();
            },10000);
            console.log(button.getAttribute("class"));
            return;
        }
    });
  if(atualizar){
    window.location.reload();
  }
}, 10000);