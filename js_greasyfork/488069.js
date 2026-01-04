// ==UserScript==
// @name         Direct Prompt Link Button
// @namespace    https://greasyfork.org
// @version      1.1
// @description  Puts a "Direct Link to Prompt" button on each prompt of an AO3 Prompt Meme.
// @author       merelydovely
// @license      Creative Commons
// @match        http://archiveofourown.org/*/requests*
// @match        https://archiveofourown.org/*/requests*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488069/Direct%20Prompt%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/488069/Direct%20Prompt%20Link%20Button.meta.js
// ==/UserScript==

(function() {

const buttonPacks = document.querySelectorAll("li.blurb.group ul.actions") //grabs all the unordered lists (packs of buttons) at the bottom of the prompt blurbs as a nodelist
//console.log(buttonPacks);
function addButton(thisPack) {
    if (thisPack.querySelector("form.button_to") == null) {
        return; //checks to see if there IS a claim button and skips this prompt blurb if there isn't one
    } else {
    let thisForm = thisPack.querySelector("form.button_to") //looks at the claim form of this specific prompt blurb and puts it in a variable
    let claimLink = new URL(thisForm.action, "https://archiveofourown.org"); //gets the realtive URL from the 'action' part of the claim form in the variable above (and puts the AO3 domain at the front for good measure)
    console.log(claimLink);
    let promptID = claimLink.searchParams.get("prompt_id"); //gets the prompt ID from the URL in the claim form 'action'
    //console.log(promptID);
    let promptLink = "prompts/"+promptID; //concatenates the prompt ID to the correct relative address for prompt pages
    let promptLinkCode = '<li><a href="'+promptLink+'">Link to prompt</a></li>' //create the HTML for a new button that links to the prompt page
    //console.log(promptLinkCode);
    thisPack.insertAdjacentHTML("beforeend", promptLinkCode); //put the HTML for the new button in at the end of this button pack on this prompt, as the final <li> inside the <ul>
    }
};
buttonPacks.forEach(addButton); //loop over every button pack in the buttonPacks nodelist and add a Link to Prompt button into each one

})()