// ==UserScript==
// @name         FarmRPG: Exchange Center
// @namespace    Tenren
// @version      0.1
// @description  Prevents specific exchanges in Exchange Center
// @author       Tenren
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511911/FarmRPG%3A%20Exchange%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/511911/FarmRPG%3A%20Exchange%20Center.meta.js
// ==/UserScript==

/* 
    Mutation code from Natsulus:
    https://gist.github.com/Natsulus/3fb9d105ec9589d05f01743f8c139696#file-farmrpg-mega-mastery-category-user-js
*/

function locationHashChanged() {
    if (location.hash === "#!/exchange.php") {
        updateECPage();
    }
}

function updateECPage() {
    $("div.page[data-page='exchange'] a.button[data-req='Bacon']").remove();        // Bacon for Honey
    $("div.page[data-page='exchange'] a.button[data-req='Runestone 11']").remove(); // Buddystone for Runestone 11
    $("div.page[data-page='exchange'] a.button[data-req='Skull Coin']").remove();   // Skull Coin for Void Bag 01
}

$(document).ready(function () {
    let target = document.querySelector("#fireworks");
    let observer = new MutationObserver(mutation => {
        if (mutation[0]?.attributeName == "data-page") {
            locationHashChanged();
        }
    });
    let config = {
        attributes: true
    };
    observer.observe(target, config);
});
