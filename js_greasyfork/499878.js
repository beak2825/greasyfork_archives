// ==UserScript==
// @name         Grundos Cafe Battledome Full Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Complete keyboard controls for battledome
// @author       Dij
// @match        https://www.grundos.cafe/dome/1p/battle/
// @match        https://www.grundos.cafe/dome/1p/endbattle/
// @match        https://www.grundos.cafe/dome/2p/battle/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/499878/Grundos%20Cafe%20Battledome%20Full%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/499878/Grundos%20Cafe%20Battledome%20Full%20Keyboard%20Controls.meta.js
// ==/UserScript==


function toggle(checkbox) {
    checkbox.checked = !checkbox.checked;
}
(function() {
    'use strict';
    document.addEventListener("keydown", (event) => {
        if(event.target.type === "text") {
            console.log(event.target.type);
            return; // Do not run if currently typing in a textbox
        }
        if (event.key === 'Enter') {
            let a = document.querySelector(".button-group > input[type=\"submit\"]");
            if (a) {
                a.click();
                return;
            }
        }
        if (/s|m|w/.test(event.key)) {
            /*Set strength with [S]trong, [M]edium, [W]eak*/
            let strength = {'s':"strong",
                            'm':"medium",
                            'w':"weak"};
            document.getElementById("power").value = strength[event.key];
            return;
        }
        let digit = event.code.match(/^(?:Digit|Numpad)([1-9])$/);
        if (digit) {
            if(event.shiftKey) {
                /*Example ability loadout. To find the number associated with the skill you want,
inspect the skill drop down menu and use the 'Value' number for that option. */
                let abilities = {1:'25', // Species Attack
                                 2:"5", //  Berserk Attack
                                 3:"112", // Meteor Shower
                                 4:"104", // Shadow Health
                                 5:"2", // Normal Attack
                                 6:"1", //Cautious Attack
                                 7:"10", // Species Defend
                                 8:"-1" // Defend
                                };
                /*Shift + number key selects listed ability.*/
                document.getElementById("ability").value = abilities[digit[1]];
            } else {
                /*Select equipment 1-8 with number keys. Unlike clicking normally,
                 You need to manually deselect the previous weapon. */
                let b = document.getElementById("bd-form").querySelectorAll("table td input[type=\"checkbox\"]");
                if(b.length > 0) {
                    toggle(b[Number(digit[1])-1]);
                }
            }
        }
    });
})();