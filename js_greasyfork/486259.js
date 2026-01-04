// ==UserScript==
// @name         Land of Ice modifikace Extra
// @description  Auto armada, Auto Pridavani jednotek
// @author       kartin
// @match        *://*.landofice.com/main.php*
// @match        *://*.landofice.com/market*
// @match        *://*.landofice.com/utok*
// @match        *://*.landofice.com/settings*
// @match        *://*.landofice.com/klanarmy_vybaveni*
// @match        *://*.landofice.com/aliance/banka*
// @match        *://*.landofice.com/stavby/portal*
// @match        *://*.landofice.com/chat*
// @match        *://*.landofice-simulator.4fan.cz/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=landofice.com
// @license MIT
// @version 0.0.1.20240201221000
// @namespace https://greasyfork.org/users/1256209
// @downloadURL https://update.greasyfork.org/scripts/486259/Land%20of%20Ice%20modifikace%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/486259/Land%20of%20Ice%20modifikace%20Extra.meta.js
// ==/UserScript==
const AUTOMATICKY_NASTAVIT_ULOZENOU_ARMADU = "auto_set_army_when_opening_attack_window"
if (location.href.indexOf("utok") != -1) {
    let submitButton = document.querySelector("input[value='Zaútočit']");
        if (submitButton) {

            var customArmyButtonDiv = document.createElement('p');
            customArmyButtonDiv.classList.add('t-c');

            let deleteDefaultsButton = document.createElement("input");
            deleteDefaultsButton.type = "button";
            deleteDefaultsButton.className = "button";
            deleteDefaultsButton.value = "Smazat Sestavu";
            deleteDefaultsButton.onclick = deleteCustomArmyValues;

            let storeDefaultsButton = document.createElement("input");
            storeDefaultsButton.type = "button";
            storeDefaultsButton.className = "button";
            storeDefaultsButton.value = "Uložit Sestavu";
            storeDefaultsButton.onclick = storeCustomArmyValues;

            let applyDefaultsButton = document.createElement("input");
            applyDefaultsButton.type = "button";
            applyDefaultsButton.className = "button";
            applyDefaultsButton.value = "Načíst Sestavu";
            applyDefaultsButton.onclick = applyCustomArmyValues;
            if (GM_getValue(AUTOMATICKY_NASTAVIT_ULOZENOU_ARMADU, true) == true) {
                applyCustomArmyValues();
            }


            customArmyButtonDiv.appendChild(deleteDefaultsButton);
            customArmyButtonDiv.appendChild(storeDefaultsButton);
            customArmyButtonDiv.appendChild(applyDefaultsButton);
            var existingButtonDiv = document.querySelector('.utok-formular p.t-c');
            existingButtonDiv.appendChild(customArmyButtonDiv)
        }
    return;
}


// ATTACKING WITH CUSTOM SAVED ARMY
function storeCustomArmyValues() {
    var inputs = document.getElementsByTagName('input');
    let header = document.getElementsByTagName('h2');
    let title = header[0].getInnerHTML();
    title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var customArmyRoster = JSON.parse(localStorage.getItem('customArmyRoster')) || {}; // Retrieve the existing map or create a new one if it doesn't exist

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'text') {
            var customArmyValue = inputs[i].value;
            var inputId = inputs[i].id;
            if (!customArmyRoster.hasOwnProperty(title)) {
                customArmyRoster[title] = {};
            }
            customArmyRoster[title][inputId] = customArmyValue;
        }
    }
    localStorage.setItem('customArmyRoster', JSON.stringify(customArmyRoster));
}

function applyCustomArmyValues() {
    if (location.href.indexOf("utok") != -1)
    {
    let header = document.getElementsByTagName('h2');
    let title = header[0].getInnerHTML();
    title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var customArmyRoster = JSON.parse(localStorage.getItem('customArmyRoster'));
    if (customArmyRoster && customArmyRoster.hasOwnProperty(title)) {
        var defaultValues = customArmyRoster[title];
        for (var inputId in defaultValues) {
            var field = document.getElementById(inputId);
            if (field) {
                field.value = defaultValues[inputId];
            }
        }
    }
  }
}

function deleteCustomArmyValues() {
    let header = document.getElementsByTagName('h2');
    let title = header[0].innerText;
    title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var customArmyRoster = JSON.parse(localStorage.getItem('customArmyRoster'));
    if (customArmyRoster && customArmyRoster.hasOwnProperty(title)) {
        var defaultValues = customArmyRoster[title];
        for (var inputId in defaultValues) {
        if (defaultValues.hasOwnProperty(inputId)) {
            delete defaultValues[inputId];
            localStorage.setItem('customArmyRoster', JSON.stringify(customArmyRoster));
        }
      }
    }
}
//// ATTACKING WITH CUSTOM SAVED ARMY END

appendConfigurationInputToDiv(div, AUTOMATICKY_NASTAVIT_ULOZENOU_ARMADU, "Automaticky nastavit uloženou armádu při útoku");