// ==UserScript==
// @name         ChooseWeapons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Live good life!
// @author       anonym
// @match        https://alpha.e-sim.org/battle.html?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429176/ChooseWeapons.user.js
// @updateURL https://update.greasyfork.org/scripts/429176/ChooseWeapons.meta.js
// ==/UserScript==

(function() {
    const chooseWeapons = () => {
        const listWeapons = document.getElementById('selectable6');
        const q0Weapons = listWeapons.firstElementChild;
        const q5Weapons = listWeapons.lastElementChild;
        const weaponQuality = document.getElementById('weaponQuality');
            q0Weapons.classList.remove('ui-selected');
            q5Weapons.classList.add('ui-selected');
            weaponQuality.value = 5;
    };

let script = document.createElement('script');
	script.textContent = '(' + chooseWeapons + ')(jQuery, window);';
	document.body.appendChild(script);
})();