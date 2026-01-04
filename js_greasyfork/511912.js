// ==UserScript==
// @name         FarmRPG: Flea Market
// @namespace    Tenren
// @version      0.1
// @description  Shows tradable Gold only in Flea Market
// @author       Tenren
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511912/FarmRPG%3A%20Flea%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/511912/FarmRPG%3A%20Flea%20Market.meta.js
// ==/UserScript==

/* 
    Mutation code from Natsulus:
    https://gist.github.com/Natsulus/3fb9d105ec9589d05f01743f8c139696#file-farmrpg-mega-mastery-category-user-js
*/

function locationHashChanged() {
    if (location.hash === "#!/flea.php") {
        updateFleaMarketPage();
    }
}

function updateFleaMarketPage() {
    let pagecontent = $("div.page[data-page='flea'] .content-block").children();

    // Remove rotating Current Items
    pagecontent[1].remove();
    pagecontent[2].remove();
    // Remove Juices & More
    pagecontent[3].remove();
    pagecontent[4].remove();
    // Remove Greeting Cards
    pagecontent[5].remove();
    pagecontent[6].remove();
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
