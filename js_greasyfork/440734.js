// ==UserScript==
// @name        Steam complimentary product remover
// @namespace   Violentmonkey Scripts
// @match       https://store.steampowered.com/account/licenses/
// @grant       none
// @version     1.0.4
// @author      -
// @license     MIT
// @description Automatically removes complimentary products from your Steam account, edit "allowedDates" to tell the script which dates are allowed to be removed from.
// @downloadURL https://update.greasyfork.org/scripts/440734/Steam%20complimentary%20product%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/440734/Steam%20complimentary%20product%20remover.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// ADD DATES HERE FOR REMOVAL (Script only removes products on specified dates)
// Dates should be in the exact format as used on the steam licenses page (ex: "10 Oct, 2020" or "NN MMM, YYYY")
var allowedDates = [
    "1 Sep, 2021",
    "2 Sep, 2021",
]

var idMatch =/(?<=\( )(\d*)/;
var codeMatch = /(?<=')(.*)(?=')/

var loop = setInterval(() => {
    // if class newmodal is present, click the OK button
    if (document.querySelector(".newmodal")) {
        if(document.querySelector(".btn_green_steamui")){
            document.querySelector(".btn_green_steamui").click()
        } else {
            document.querySelector(".btn_grey_steamui").click();

        }
    } else {
        // Find all divs with class "free_license_remove_link"
        var removeLinks = document.querySelectorAll('.free_license_remove_link');
        let linkClicked = false;
        removeLinks.forEach(link => {
            // check if the date is in the allowed dates array
            if(!linkClicked && allowedDates.includes(link.parentElement.previousElementSibling.innerText)) {
                linkClicked = true;
                let linkhref = link.children[0].href
                var id = linkhref.match(idMatch)[0];
                var code = linkhref.match(codeMatch)[0];
                console.log("Attempting to remove " + link.parentElement.innerText + "\n Code: " + code + "\n ID: " + id);
                RemoveFreeLicense(id, code);
            }
        });
    }
}, 500);