// ==UserScript==
// @name         KongNewGameLink
// @namespace    http://alphaoverall.com
// @version      0.1
// @description  Adds a Kong Newest Games link easy find
// @author       AlphaOverall
// @include      http://www.kongregate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10917/KongNewGameLink.user.js
// @updateURL https://update.greasyfork.org/scripts/10917/KongNewGameLink.meta.js
// ==/UserScript==

window.onload = function () {
    // On any page, add the Newest featured link to the Games>Categories list
    var nav = document.getElementsByClassName("main_nav_category_list")[0];
    var newgames = document.createElement("LI");
    newgames.className = "featured";
    // And I completely made up a random id for this :P Probably wasn't even necessary...
    newgames.innerHTML = '<a data-metric-tracker="js-wa-tc-Navigation-Feature" href="/games?sort=newest"><tr8n translation_key_id="8261" id="7y98mzd5ae8igkggqjm8vmjf3629xalb">Newest</tr8n></a>';
    nav.insertBefore(newgames, nav.children[9]);
    // If we're on the game viewing page, we can add a Newest Games tab to the left
    try {
        // This finds the ul element with classname man... Originally just used get element by man, but that's such a boring and simple classname, yah?
        // This way I make sure we're on the games page instead of randomly adding elements to any poor element of class man
        var man = document.getElementsByClassName("browser_categories browser_categories_personal browser_new_browser")[0].children[1];
        var newest = document.createElement("LI");
        newest.className = "browser-sidebar-newest-games";
        newest.innerHTML = '<a href="/games?sort=newest">Newest Games</a>';
        man.appendChild(newest);
    }
    catch (ex) {
        // We must not be on the games browsing section... If we somehow 
    }
}