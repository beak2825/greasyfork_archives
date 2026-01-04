// ==UserScript==
// @name         Move attack..
// @namespace    http://tampermonkey.net/
// @version      1.33
// @description  Move attack button on torn..
// @author       
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      personal usage
// @downloadURL https://update.greasyfork.org/scripts/535524/Move%20attack.user.js
// @updateURL https://update.greasyfork.org/scripts/535524/Move%20attack.meta.js
// ==/UserScript==

//1 = primary 2 = secondary 3 = melee
let slot = 3;
const slotFromLocal = localStorage.getItem("torn-attack-slot");

if (slotFromLocal) {
    slot = Number(slotFromLocal);
}
//1 = leave, 2 = mug, 3 = hosp
let attackType = 2;
const typeFromLocal = localStorage.getItem("torn-attack-type");

if (typeFromLocal) {
    attackType = Number(typeFromLocal);
}

let disabled = false;

(function() {
    'use strict';
    let topStyle = "";

    //check slot
    if (slot === 3) {
        topStyle = "220px"
    }
    else if (slot === 2) {
        topStyle = "125px"
    } else if (slot === 1) {
        topStyle = "30px"
    }

    //add styling
    if (!disabled) {
        GM_addStyle ( `
                  .modelWrap___j3kfA {
                      max-width: 100%;
                  }
     .player___wiE8R:nth-child(2) .playerWindow___aDeDI {
         overflow: visible;
     }
     .dialogButtons___nX4Bz {
     z-index: 1000;
     position: absolute;
     top: ${topStyle};
     display: flex;
     left: -300px;
     width: 420px;
     justify-content: center;
     }
     ${attackType === 1 ? `
     .dialogButtons___nX4Bz button:nth-child(1) {
        order: 2;
     }

          .dialogButtons___nX4Bz button:nth-child(2) {
       order: 1;
     }

          .dialogButtons___nX4Bz button:nth-child(3) {
       order: 3;
     }
         ` : attackType === 3 ? `
     .dialogButtons___nX4Bz button:nth-child(1) {
       order: 1;
     }

          .dialogButtons___nX4Bz button:nth-child(2) {
       order: 3;
     }

          .dialogButtons___nX4Bz button:nth-child(3) {
       order: 2;
     }
         ` : ``}
         `);
    }
    setTimeout(() => {
        const container = document.querySelector(".titleContainer___QrlWP");
        const buttonContainer = document.createElement("div");
        const attackSlotHTML = `<span style="padding-right: 5px;">Slot</span><input type="radio" id="primary" name="slot" value="primary" ${slot === 1 ? "checked" : ""}> <label for="primary">Primary</label>
        <input type="radio" id="secondary" name="slot" value="secondary" ${slot === 2 ? "checked" : ""}> <label for="secondary">Secondary</label>
        <input type="radio" id="melee" name="slot" value="melee" ${slot === 3 ? "checked" : ""}> <label for="melee" style="padding-right: 10px;">Melee</label>`

        const attackTypeHTML = `<span style="padding-right: 5px;">Attack type</span><input type="radio" id="leave" name="attackType" value="leave" ${attackType === 1 ? "checked" : ""}> <label for="leave">Leave</label>
        <input type="radio" id="mug" name="attackType" value="mug" ${attackType === 2 ? "checked" : ""}> <label for="mug">Mug</label>
        <input type="radio" id="hosp" name="attackType" value="hosp" ${attackType === 3 ? "checked" : ""}> <label for="hosp">Hosp</label>`


        buttonContainer.innerHTML =`<fieldset>${attackSlotHTML} ${attackTypeHTML}</fieldset>`;
        container.appendChild(buttonContainer);
        buttonContainer.addEventListener("click", (e) => {
            let slot = 0;
            const id = e.target.id;
            if (id === "primary") {
                slot = 1;
            } else if (id === "secondary") {
                slot = 2;
            } else if (id === "melee") {
                slot = 3;
            }
            if (slot > 0) {
                localStorage.setItem("torn-attack-slot", slot);
                location.reload();
            }

            let attackType = 0;
            if (id === "leave") {
                attackType = 1;
            } else if (id === "mug") {
                attackType = 2;
            } else if (id === "hosp") {
                attackType = 3;
            }

            if (attackType > 0) {
                localStorage.setItem("torn-attack-type", attackType);
                location.reload();
            }

        })
    }, 1000)






})();