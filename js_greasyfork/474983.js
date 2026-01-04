// ==UserScript==
// @name         GC Block Improver
// @version      0.2.1
// @description  Remove users from shop wizard results and replace their usernames elsewhere
// @author       guribot
// @namespace    https://greasyfork.org/en/users/1142431
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/market/viewshop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474983/GC%20Block%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/474983/GC%20Block%20Improver.meta.js
// ==/UserScript==

/*
MAKE A LOCAL COPY OF THIS SCRIPT!! Paste it directly to Tampermonkey and don't put
it on greasyfork, etc so you do not have to make your username list visible
*/
var usernamesToHide = ["abusiveUser123", "annoyingUser123", "replaceUs"]
var replacementTexts = ["somebody", "Neopian", "anonymous"];

function removeFromShopWizard(username) {
    var usernameElement = $(`div.data:contains(${username})`);
    usernameElement.css("display", "none");
    var itemNameEl = usernameElement.next();
    itemNameEl.css("display", "none");
    var stockEl = itemNameEl.next();
    stockEl.css("display", "none");
    var priceEl = stockEl.next();
    priceEl.css("display", "none");
}

function replaceUsername(username) {
    var usernameElements = $(`div:contains(${username}), a:contains(${username}), p:contains(${username}), span:contains(${username}), li:contains(${username}), strong:contains(${username})`)
    .filter(function() {
        return $(this).text() === username;
    });
    var replacement = replacementTexts[Math.floor(Math.random() * replacementTexts.length)];
    usernameElements.text(replacement);
}


$(document).ready(function(){
    for (let i = 0; i < usernamesToHide.length; i++) {
        var username = usernamesToHide[i];
        if(window.location.href === "https://www.grundos.cafe/market/wizard/"){
            removeFromShopWizard(username);
        } else {
            replaceUsername(username);
        }
    }
});