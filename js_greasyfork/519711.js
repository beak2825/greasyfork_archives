// ==UserScript==
// @name         1337x NSFW Hider
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  Hides 18+ content
// @author       DamienKnight
// @match        *.1337x.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519711/1337x%20NSFW%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/519711/1337x%20NSFW%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dictionary of terms to search for (case-insensitive)
    const terms = ["Affair", "Anal", "Ass", "Audition", "BBC", "BFF", "Bitch", "Black", "Bloomer", "Blow", "Boss", "Brat", "Brazzers", "Brother", "Busty", "Caught", "Cheat", "Cheek", "Come", "Commando", "Creampie", "Cum", "Deep", "Delivery", "Desire", "Dick", "Exploit", "Family", "Fuck", "Gangbang", "Girl", "Horny", "Hot", "Husband", "Love", "Lust", "Mature", "MILF", "Mom", "Mother", "Neighbor", "NewSensations", "Office", "Oiled", "Onlyfans", "Passionate", "Perfect", "Perv", "Pussy", "Racy", "Raw", "Rough", "Secret", "Seduce", "Sex", "Sister", "Slick", "Slut", "Squirt", "Step", "Stroke", "Suck", "Swap", "Taboo", "Therapy", "Tight", "Tits", "Wife", "Young", "XXX"];

    // Function to check if href contains any term from the dictionary (case-insensitive)
    const containsTerm = href => terms.some(term => href.toLowerCase().includes(term.toLowerCase()));

    // Hide <li> with links containing any term in the dictionary
    document.querySelectorAll('li a[href]').forEach(link => {
        if (containsTerm(link.href)) {
            link.closest('li').style.display = 'none';
        }
    });

    // Hide <tr> with links containing any term in the dictionary
    document.querySelectorAll('tr a[href]').forEach(link => {
        if (containsTerm(link.href)) {
            link.closest('tr').style.display = 'none';
        }
    });

    // Hide <div> with the class "list-box hidden-sm" (Affiliate Links on the Sidebar)
    document.querySelectorAll('div.list-box.hidden-sm').forEach(div => {
        div.style.display = 'none';
    });

})();