// ==UserScript==
// @name        case assigner
// @namespace   Eric Stanard
// @description assign cases at random
// @include     https://*.lightning.force.com*
// @version     1.0.2
// @grant       none
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/443580/case%20assigner.user.js
// @updateURL https://update.greasyfork.org/scripts/443580/case%20assigner.meta.js
// ==/UserScript==

const availableAgents = ["Eric Stanard", "Eli Germanotta", "Elyza Reinhart", "Elysabeth Martin", "Kevin McCormick", "Lewis Peterson", "Makenzie Goff", "Amy Hill-Hyman", "Sam Bowman", "Ian Dodd", "Jason Kusterer"];
//assigns all common agents to an array
const randomlyPickedAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
//selects a valid agent from the array at random

setTimeout(giveCases, 5000);
//waits five seconds before trying to assign another case

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//establishes a sleep function called in giveCases to wait 2 seconds for elements to populate


async function giveCases() {
    document.getElementsByClassName("slds-checkbox")[1].click();
    console.log('clicked the box');
	document.getElementsByClassName("forceActionLink")[2].click();
    console.log('clicked change owner');
    await sleep(2000);
	document.getElementsByClassName("uiInput uiInputTextForAutocomplete uiInput--default uiInput--input uiInput uiAutocomplete uiInput--default uiInput--lookup")[0].dispatchEvent(new Event('focus'));
    console.log('focused the box');
    await sleep(2000);
	document.getElementsByClassName("uiInput uiInputTextForAutocomplete uiInput--default uiInput--input uiInput uiAutocomplete uiInput--default uiInput--lookup")[0].value = randomlyPickedAgent;
    console.log('inserted a name at random');
	document.getElementsByClassName("uiInput uiInputTextForAutocomplete uiInput--default uiInput--input uiInput uiAutocomplete uiInput--default uiInput--lookup")[0].dispatchEvent(new Event('change'));
    console.log('told the event listener a change happened');
    await sleep(2000);
	document.getElementsByClassName("uiInput uiInputTextForAutocomplete uiInput--default uiInput--input uiInput uiAutocomplete uiInput--default uiInput--lookup")[0].
dispatchEvent(new MouseEvent("click"));
    await sleep(2000);
    console.log('register a click in the field to trick the event listener');
	document.getElementsByClassName("searchButton itemContainer slds-lookup__item-action--label slds-text-link--reset slds-grid slds-grid--vertical-align-center slds-truncate forceSearchInputLookupDesktopActionItem lookup__header")[0].click();
    console.log('searched for the user');
    await sleep(2000);
	document.getElementsByClassName("content forceChatterCompoundFieldUserNameRenderer")[0].getElementsByTagName("a")[0].click();
    console.log('clicked the user');
	//document.getElementsByClassName("slds-button slds-button--neutral button-brand uiButton--default uiButton--brand uiButton")[0].click();
    setTimeout(giveCases, 5000);
}

//the above function does the following
//1. selects the item in the list in slot 1 (the first, single assignable case)
//2. selects the "change owner" button
//3. dispatches a "focus" event on the input field to make it active
//4. sets the value of the text field to a random agent
//5. tricks the event listener by dispatching a "change" event to it
//6. tricks the event listener by dispatching a "mouse click" to it
//7. clicks the "search" button for the value(random agent) we inserted on step 4
//8. clicks the user in the search window
//9. clicks the "submit" button, assigning the case to the user
