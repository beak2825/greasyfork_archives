// ==UserScript==
// @name         ProtonDB Remove Steam Deck
// @namespace    https://greasyfork.org/en/users/5801-murk
// @version      0.1
// @description  This script removes Steam Deck results from games on ProtonDB.
// @author       Murk
// @match        https://www.protondb.com/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457457/ProtonDB%20Remove%20Steam%20Deck.user.js
// @updateURL https://update.greasyfork.org/scripts/457457/ProtonDB%20Remove%20Steam%20Deck.meta.js
// ==/UserScript==

const observer = new MutationObserver(removeElement);
observer.observe(document, {childList: true, subtree: true});

// Remove the first instance of the gameReports container class
function removeElement(mutationList, observer) {
    const ele = document.querySelector(".GameReports__Container-sc-ntxesq-0");
    if(ele){
        observer.disconnect();
        ele.remove();
    }
}
