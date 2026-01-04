// ==UserScript==
// @name            ctrlv.sk - auto close banner window
// @name:sk         ctrlv.sk - automaticky zavrie reklamný baner
// @name:cs         ctrlv.sk - automaticky zavře reklamny baner
// @namespace       https://greasyfork.org/users/1103427-sperhak
// @homepageURL     https://greasyfork.org/sk/scripts/474295
// @supportURL      https://greasyfork.org/sk/scripts/474295/feedback
// @version         1.1
// @description     For automatic closing banner window
// @description:sk  Pre automatické zavretie reklamného baneru
// @description:cs  Pro automatické zavřetí reklamního baneru
// @author          Sperhak
// @match           *://*.ctrlv.sk/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/474295/ctrlvsk%20-%20auto%20close%20banner%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/474295/ctrlvsk%20-%20auto%20close%20banner%20window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hladaný text
    const searchText = "Pomôžte nám zostať neobmedzení";

    // Hladanie prvkov na stránke obsahujúce zadaný text
    const elementsContainingText = Array.from(document.querySelectorAll('*')).filter(element => element.textContent.includes(searchText));

    if (elementsContainingText.length > 0) {
      //  console.log(`ID prvkov obsahujúcich text "${searchText}":`);
        elementsContainingText.forEach(element => {
            if (element.id) {
         //       console.log(`- ID: ${element.id}`)
                element.remove();;
            }
        });
    }
})();

