// ==UserScript==
// @name         Webgame - Technologie - tlacitka
// @version      0.2.1
// @description  Webgame - Technologie - tlacitka na vyresetovani produkce
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=technologie
// @match        *://webgame.cz/wg/index.php?p=technologie
// @match        *://*.webgame.cz/wg/index.php?p=technologie&s=technologie
// @match        *://webgame.cz/wg/index.php?p=technologie&s=technologie
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457649/Webgame%20-%20Technologie%20-%20tlacitka.user.js
// @updateURL https://update.greasyfork.org/scripts/457649/Webgame%20-%20Technologie%20-%20tlacitka.meta.js
// ==/UserScript==

let content = document.getElementById("icontent");

let form = document.forms.nastavit;

let button = createButton("Reset všechny techy", resetAll);
content.insertBefore(button, form);

button = createButton("Reset hospo techy", resetEconomicTechnologies);
content.insertBefore(button, form);

button = createButton("Reset vojenské techy", resetMilitaryTechnologies);
content.insertBefore(button, form);



/**
 * Vytvori tlacitko na strance s funkci na klik
 * @param  {string} text        obsah na tlacitku
 * @param  {function} func      funkce na klik
 * @return {HTMLButtonElement}  vyplnene tlacitko
 */
function createButton(text, func) {
    let button = document.createElement("button");
    button.innerHTML = text;
    button.type = "button";
    button.classList.add("submit");
    button.addEventListener('click', e => {
        func();
    });
    return button;
}

/**
 * Vyresetuje ekonomicke techy
 */
function resetEconomicTechnologies() {
    let elements = getElements();
    for (let i=0; i < elements.length/2; i++) {
        elements[i].value = 0;
    }
}

/**
 * Vyresetuje vojenske technologie
 */
function resetMilitaryTechnologies() {
    let elements = getElements();
    for (let i=elements.length/2; i < elements.length; i++) {
        elements[i].value = 0;
    }
}

/**
 * Vyresetuje vsechny technologie
 */
function resetAll() {
    resetEconomicTechnologies();
    resetMilitaryTechnologies();
}

/**
 * Ziska inputy, do kterych se vyplnuje %
 * @return {NodeList} inputy
 */
function getElements() {
    return document.querySelectorAll("input.ushort");
}
