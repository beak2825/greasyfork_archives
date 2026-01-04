// ==UserScript==
// @name        SuperSaas inschrijfnaam - cs030.nl
// @name:en     SuperSaas name - cs030.nl
// @namespace   Violentmonkey Scripts
// @match       https://www.cs030.nl/
// @grant       none
// @version     1.0
// @license     MIT
// @author      Matthijs
// @description .
// @description:en .
// @downloadURL https://update.greasyfork.org/scripts/469861/SuperSaas%20inschrijfnaam%20-%20cs030nl.user.js
// @updateURL https://update.greasyfork.org/scripts/469861/SuperSaas%20inschrijfnaam%20-%20cs030nl.meta.js
// ==/UserScript==

// Zoek de div om invoerveld aan toe te voegen
let div = null;
const forms = document.getElementsByTagName("form");
for(let i = 0; i < forms.length; i++) {
    if(forms.item(i).action === "https://www.supersaas.com/api/users") {
        div = forms.item(i).parentElement.parentElement.parentElement;
        break;
    }
}

const input = document.createElement("input");
input.name = "supersaasNaam";
input.size = 20;
input.value = localStorage.getItem("supersaasNaam") || document.getElementsByName("user[full_name]")[0].value;
input.addEventListener("change", e => {
    const inschrijfNaam = input.value;
    document.getElementsByName("user[full_name]").forEach(el => el.value = inschrijfNaam);
    localStorage.setItem("supersaasNaam", inschrijfNaam);
});
// Bij laden van pagina inschrijfnaam in forms aanpassen vanuit localStorage
input.dispatchEvent(new Event("change"));

const span = document.createElement("span");
span.innerText = "Naam bij inschrijving: ";
div.appendChild(span);
div.appendChild(input);
