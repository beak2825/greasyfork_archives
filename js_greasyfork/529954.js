// ==UserScript==
// @name         Auto Change War Type to Raid
// @namespace    https://politicsandwar.com/
// @version      1.0
// @description  Automatically changes war type to Raid before declaring war.
// @author       MangoTheGoat
// @match        https://politicsandwar.com/nation/war/declare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529954/Auto%20Change%20War%20Type%20to%20Raid.user.js
// @updateURL https://update.greasyfork.org/scripts/529954/Auto%20Change%20War%20Type%20to%20Raid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeWarTypeToRaid() {
        let warTypeDropdown = document.querySelector('#war_type');
        if (warTypeDropdown) {
            warTypeDropdown.value = "raid";
            warTypeDropdown.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("War type set to Raid");
        }
    }

    window.addEventListener('load', changeWarTypeToRaid);
})();
