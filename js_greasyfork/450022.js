// ==UserScript==
// @name         Dead Frontier Ironman Script
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Stop being distracted by things you can't use.
// @author       Rebekah
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450022/Dead%20Frontier%20Ironman%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/450022/Dead%20Frontier%20Ironman%20Script.meta.js
// ==/UserScript==

setTimeout(function () {

    if ((location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=56') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=pm') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=62') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=29') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=38') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=22') ||
        (location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=61')) { //List of prohibited pages
    
        location.href = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php' //Redirects the player to the main page if they accidentally end up on a page they shouldn't be
    }

    $("button:contains('Marketplace'), button:contains('Storage'), button:contains('Clan HQ'), button:contains('Gambling Den'), button:contains('Meeting Hall'), button:contains('Arcade'), button:contains('Arena'), button:contains('Fast Travel'), button:contains('Records')").empty(); //Removes any prohibited buttons
    $("a:contains('Message'), a:contains('Challenges'), a:contains('Buddies'), a[href='index.php?action=forum'], a[href='index.php?page=28']").remove(); //Removes any prohibited hyperlinks

    for (const levelCheck of document.querySelectorAll("span")) {
        if (levelCheck.textContent.includes("Level 100")) { //Change 'Level 100' to the target level, 'Level 0' if no target
            $("button:contains('Inner City')").empty(); //Prevents you from entering the inner city once you have reached the target level
        }
    }

}, 250); //Ensures the code runs after the webpage has been loaded