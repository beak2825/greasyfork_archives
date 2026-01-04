// ==UserScript==
// @name         Delete TVTropes Adblock Warning
// @namespace    DeleteTVTropesAdblockWarning
// @version      1.0.1
// @description  Deletes the TV Tropes anti-adblock popup that shows on every page
// @author       dpk9
// @include      https://tvtropes.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491645/Delete%20TVTropes%20Adblock%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/491645/Delete%20TVTropes%20Adblock%20Warning.meta.js
// ==/UserScript==

function delete_anti_adblock(){
    const elements = document.getElementsByClassName("fc-ab-root");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

delete_anti_adblock()
//Also rerun the code each time document change (i.e new posts are added when user scroll down)
document.addEventListener("DOMNodeInserted", delete_anti_adblock);
