// ==UserScript==
// @name         Halloweek Equipment Alert
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Show an alert if you're about to fly without one or more of special Halloween weapons/armor.
// @author       Vrocks [2577848]
// @match        https://www.torn.com/travelagency.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514924/Halloweek%20Equipment%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/514924/Halloweek%20Equipment%20Alert.meta.js
// ==/UserScript==

// START - CONFIGURATION
const API_KEY = "REPLACE_THIS_WITH_YOUR_API_KEY";

const CHECK_MELEE = true;
const CHECK_ARMOR = true;
const CHECK_TEMPORARY = true;
// END - CONFIGURATION

const ID_CRYSTALINE_FALCATA = 1173;
const ID_STARSHIELD_BREASTPLATE = 1174;
const ID_STYGIAN_DARKNESS = 1175;

const getPlayerEquipment = async () => {
    const url = "https://api.torn.com/user/?selections=equipment&comment=HEAlert&key=" + API_KEY;
    const response = await fetch(url);

    try {
        if (!response.ok) {
            return null;
        }

        const responseJson = await response.json();

        if (!"equipment" in responseJson) {
            return null;
        }

        return responseJson.equipment
    } catch (error) {
        console.error(error);
        return null;
    }
};

const checkPlayerEquipment = async () => {
    const equipmentArray = await getPlayerEquipment();

    if (!equipmentArray) {
        alert(`Halloweek Equipment Alert\n\nSomething went wrong while checking your equipment.\n- The API key is missing\n- The API key you provided may not have access to your inventory\n- Torn API is acting up\nPlease make sure to check your equipment manually.`)
        return
    }

    window.equipmentArray =equipmentArray
    const hasMelee = equipmentArray.some(
        (item) => item.ID === ID_CRYSTALINE_FALCATA
    );
    const hasArmor = equipmentArray.some(
        (item) => item.ID === ID_STARSHIELD_BREASTPLATE
    );
    const hasTemporary = equipmentArray.some(
        (item) => item.ID === ID_STYGIAN_DARKNESS
    );

    if (CHECK_MELEE && !hasMelee) {
        alert("Halloweek Equipment Alert\n\nYou have not equipped the melee weapon - Crystalline Falcata.");
    }

    if (CHECK_ARMOR && !hasArmor) {
        alert("Halloweek Equipment Alert\n\nYou have not equipped the armor - Starshield Breastplate.");
    }

    if (CHECK_TEMPORARY && !hasTemporary) {
        alert("Halloweek Equipment Alert\n\nYou have not equipped the temporary weapon - Stygian Darkness.");
    }
};
(function() {
    'use strict';
    checkPlayerEquipment()
})();