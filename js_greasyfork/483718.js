// ==UserScript==
// @name         GC - Faerie Quest SW Link
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  Adds a textbox with a link to the shop wizard search on the Faerie Quests page so that you can just copy that and send it to your friends to make it easier for them to find the item for you.
// @author       Twiggies
// @match        https://www.grundos.cafe/faerieland/quests/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483718/GC%20-%20Faerie%20Quest%20SW%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/483718/GC%20-%20Faerie%20Quest%20SW%20Link.meta.js
// ==/UserScript==

const sdbLink = document.querySelector('div#page_content div.searchhelp a[href*="/island/tradingpost/browse/?query="]');

if (sdbLink != undefined) {
    //make the sw link
    let swLink = sdbLink.href.replace('island/tradingpost/browse','market/wizard');
    //Create textarea element.
    let textarea = document.createElement("textarea");
    textarea.value = swLink;
    textarea.id = "shopWizardLinkArea";
    //Create the copy button
    let copyBtn = document.createElement('button');
    copyBtn.id = 'swCopyBtn';
    copyBtn.innerText = 'Copy Link';
    copyBtn.addEventListener("click", function() {
        textarea.select();
        document.execCommand('copy');
    });
    //Insert the elements.
    sdbLink.parentElement.insertAdjacentElement('afterend',copyBtn)
    sdbLink.parentElement.insertAdjacentElement('afterend',textarea)
}