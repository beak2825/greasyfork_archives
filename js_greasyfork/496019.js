// ==UserScript==
// @name         Flute'n London
// @namespace    http://tampermonkey.net/
// @version      2024-05-25 v2
// @description  It's all Flute Street?
// @author       Hannah~
// @match        https://www.fallenlondon.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fallenlondon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496019/Flute%27n%20London.user.js
// @updateURL https://update.greasyfork.org/scripts/496019/Flute%27n%20London.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        // changing object thingy. Districts (large all-caps names) should be all-caps, everything else should be capitalized as written
        let replacement = {
            "LADYBONES ROAD": "Literally No Bones Road",
            "VEILGARDEN": "(Hidden) Flute Street",
            "The Clay Quarters": "The Rubbery Quarters",
            "THE SHUTTERED PALACE": "Flute Street but Fancy",
            "St. Fiacre's Cathedral": "Tentacled Entrepreneur's Cathedral",
            "The Crowds of Spite": "The Crowds of Flute Street (Vengeful)",
            "The Orphanage": "The Amberage",
            "The Blind Helmsman": "The Blind Fluke",
            "Area-Diving in Spite": "Area-Diving in Flute Street (Vengeful)",
            "SPITE": "Flute Street (Vengeful)",
            "The Labyrinth of Tigers": "The Labyrinth of Rubbery Hounds",
            "Hood's Bridge": "Thhhooosothorooooothhhhh Bridge",
            "The Bazaar": "The Bazaar, but lemon scented",
            "Hater's Bridge": "Constables' Bridge",
            "WATCHMAKER'S HILL": "Amber Hill",
            "WOLFSTACK DOCKS": "HOUNDSTACK DOCKS",
            "The Royal Bethlehem": "The Royal Axile",
            "THE FORGOTTEN QUARTER": "The Reclaimed Quarter",
            "Dept. of Menace Eradication": "Dept. of Special Constable Re-Education",
            "The Empress' Court": "Flute Street but Extra Fancy",
            "Mahogany Hall": "Deep Amber Hall",
            "Doubt Street": "Fluke Street",
            "The Temple Club": "The ultra-secret easter amber",
            "THE FLIT": "The Flut",
            "Flute Street": "Old Flute Street",
            "WILMOT'S END": "Spooky Scary Spycraft",
            "The Foreign Office": "London's Embassy",
            "Concord Square": "Sqircle",
            "The House of Chimes": "The House of Amber",
            "BAZAAR SIDE-STREETS": "Lemon Bazzar Side-Streets",
            "The University": "Benthic College",
        }
        let whitelist = ["BASE-CAMP", "MRS PLENTY'S CARNIVAL", "THE BRASS EMBASSY", "THE SINGING MANDRAKE", "THE MEDUSA'S HEAD"]

        // beyond this point is boring spaghettii code, proceed at your own risk





        let validNames = ["FLUTE STREET"].concat(whitelist)

        for (let i in replacement) {
            validNames.push(replacement[i].toUpperCase())
        }

        setInterval(function() {
            // get all the destination labels and replace them
            let destinations = document.querySelectorAll(".leaflet-tooltip--fbg__name.leaflet-tooltip--fbg__name--destination div")
            replaceList(destinations)

            // get all the district labels and replace them
            let districts = document.querySelectorAll(".leaflet-tooltip--fbg__name.leaflet-tooltip--fbg__name--district div")
            replaceList(districts)

            // get all the landmark labels and replace them
            let landmarks = document.querySelectorAll(".leaflet-tooltip--fbg__name.leaflet-tooltip--fbg__name--landmark div")
            replaceList(landmarks)

            // get the current location header omg this thing caused so many bugs I'm just commenting it out who needs it.
            //let header = document.querySelectorAll(".heading.heading--2.welcome__current-area")
            //if (header.length == 1 && header[0].innerText.slice(-1) == ",") header[0].innerText = header[0].innerText.slice(0, -1).toUpperCase();
            //replaceList(header, true)
            //if (header.length == 1 && header[0].innerText.slice(-1) != ",") header[0].innerText += ",";
        }, 1000);

        // loop through them changing their text
        function replaceList(list, trace) {
            let listLen = list.length
            if (!listLen) return;
            for (let i = 0; i < listLen; i++) {
                if (!list[i]) continue;
                let getOriginal = list[i].innerText
                if (trace) console.log(getOriginal)
                let upperOriginal = getOriginal.toUpperCase()
                let getReplacement = replacement[getOriginal]
                if (getReplacement) {
                    list[i].innerText = getReplacement
                } else if (!(validNames.includes(upperOriginal))) {
                    list[i].innerText = " Flute Street "
                }
            }
        }
    }, false);
})();