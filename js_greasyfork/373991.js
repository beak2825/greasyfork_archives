// ==UserScript==
// @name         MouseHunt - Sum Up Living Garden Essences
// @author       Yigit Sever (drocan#9084 @Discord)
// @namespace    https://greasyfork.org/en/users/223891-yigit-sever
// @version      1.1
// @description  sums up looted living garden essences so you can see how many aleth you just looted
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/373991/MouseHunt%20-%20Sum%20Up%20Living%20Garden%20Essences.user.js
// @updateURL https://update.greasyfork.org/scripts/373991/MouseHunt%20-%20Sum%20Up%20Living%20Garden%20Essences.meta.js
// ==/UserScript==

function collateEssences() {
    // create an associative list, best drop is fel
    var essenceNames = ["Aleth", "Ber", "Cynd", "Dol", "Est", "Fel", "Gur", "Hix", "Icuri"];
    var essenceDict = {};

    let a = 1;
    for (var name of essenceNames){
        essenceDict[name] = a;
        // to promote an essence, you need to craft 3 of them together (with an essence prism, but we don't care about that)
        a *= 3;
    }

    var lootRegex = /(\d+) (\w+) Essence/g;

    $('.journaltext').each(function() {
        var entry = $(this).text();

        // due to ajax successes, we might have added our stuff already, check it
        // there must be a better way, people who know js knows them
        if (entry.endsWith("Essences)") || entry.endsWith("(Just 1)")) {
            return;
        }

        var match;
        let total = 0;
        while (match = lootRegex.exec(entry)) {
            var amt = match[1];
            var name = match[2];
            total += essenceDict[name] * amt;
        }
        if (total == 1) {
            $( this ).append(" (Just 1)");
        } else if (total > 1) {
            $( this ).append(" (" + total + " Essences)");
        }
    });

}
$(document).ajaxSuccess(function () {
    var pageTitle = document.title;
    if (pageTitle.includes("Hunter's Camp") || pageTitle.includes("Journal Page")) {
        collateEssences();
    }
});

$(document).ready(function() {
    //If current page is main camp or journal
    var pageTitle = document.title;
    if (pageTitle.includes("Hunter's Camp") || pageTitle.includes("Journal Page")) {
        collateEssences();
    }
});