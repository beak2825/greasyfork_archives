// ==UserScript==
// @name         EXList: Vendor search Enhanced
// @namespace    I don't have a namespace
// @version      0.2
// @description  Adds more data to the EXList view
// @author       Me
// @match        http://vendors.uoex.net/
// @grant        none
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.7/js/jquery.tablesorter.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.7/js/jquery.tablesorter.widgets.min.js
// @downloadURL https://update.greasyfork.org/scripts/28914/EXList%3A%20Vendor%20search%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/28914/EXList%3A%20Vendor%20search%20Enhanced.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    observeTabsIfAvailable();
    var css = ".tablesorter .filtered {\
        display: none;\
    }\
    \
    .tablesorter .tablesorter-errorRow td {\
        text-align: center;\
        cursor: pointer;\
        background-color: #e6bf99;\
    }\
    .tablesorter .tablesorter-filter {\
    width: 60px;\
    }";
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
});

function observeTabsIfAvailable() {
    // select the 'tabs' node
    var target = $("#tabs")[0];
    if(!target) {
        //The node we need does not exist yet.
        //Wait 500ms and try again
        window.setTimeout(observeTabsIfAvailable,500);
        return;
    }
    // create an observer instance
    var observer = new MutationObserver(populateSearchTabs);

    // configuration of the observer:
    var config = { childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
}

function populateSearchTabs(mutations) {
    // the search tabs all have class ui-tabs-panel
    var targets = $(".ui-tabs-panel");
    var idOffset = 0;
    for(var k = 0; k < targets.length; k++) {
        var curId = targets[k].id;
        var offset = parseInt(curId.substring(curId.lastIndexOf("-") + 1,curId.length));
        console.log(curId + " " + offset);
        if(idOffset < offset) {
            idOffset = offset;
        }
    }
    // and everytime I search, I know two will be generated, and the second to last is the one which has content
    var target = $("#ui-tabs-" + idOffset)[0];
    // but it takes them a second to populate so we set another observer...
    var observer = new MutationObserver(populateData);
    // configuration of the observer:
    var config = { childList: true, characterData: true };
    observer.observe(target, config);
}

function populateData(mutations) {
    var target = mutations[0].target;
    // (notice how i copy-pasted the 4 lines above, i should have made a method and DRY'd it up, but i live life fast and hard)
    // next we find the table head
    var headerRow = $(target).find("#box-table-a > thead > tr");
    if (!headerRow || headerRow.length === 0) {
        console.log("search not populated yet");
        //window.setTimeout(populateData(mutations),500);
    }
    // and add some headers (but we do it the lazy way because more LOC = more problems
    headerRow.append("<th>Effective Spending Points</th><th>Combat Spending Points</th><th>Relayer Spending Points</th><th>Crafted?</th><th>Weapon Level</th>");
    // then we want to populate data under those headings
    // so we find the rows
    var dataRows = $(target).find("#box-table-a > tbody > tr");
    // we iterate over each
    for(var i = 0, len = dataRows.length; i < len; i++) {
        var cur = dataRows[i];
        // i magically know that the props are in the second td element
        var props = $(cur).find("td")[1];
        var propsString = $(props).html();
        var propsArr = propsString.split("<br>");
        var isCrafted = false;
        var esp, csp, rsp, tsp, lvl;
        lvl = esp = csp = rsp = tsp = 0;
        // now we can iterate over the props and do some things- ehehehe
        for(var j = 0, jlen = propsArr.length; j < jlen; j++) {
            var curProp = propsArr[j].trim();
            // the level prop is wonky and has to be handled separate
            if (curProp.indexOf("Level:") > -1) {
                lvl = parseInt(curProp.substring(7, 11));
            }
            // we need to figure out the prop we are looking at in order to compute spending points
            switch(curProp.substring(0, curProp.lastIndexOf(" "))) {
                case "Stamina Regeneration":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length));
                    break;
                case "Hit Point Regeneration":
                case "Spell Damage Increase":
                case "Enhance Potions":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 2;
                    break;
                case "Defense Chance Increase":
                case "Hit Chance Increase":
                case "Reflect Physical Damage":
                case "Hit Point Increase":
                case "Stamina Increase":
                case "Mana Increase":
                case "Luck":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 3;
                    break;
                case "Damage Increase":
                case "Swing Speed Increase":
                case "Strength Bonus":
                case "Dexterity Bonus":
                case "Intelligence Bonus":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 4;
                    break;
                case "Faster Cast Recovery":
                case "Lower Mana Cost":
                case "Lower Reagent Cost":
                case "Physical Resist":
                case "Fire Resist":
                case "Cold Resist":
                case "Poison Resist":
                case "Energy Resist":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 5;
                    break;
                case "Mana Regeneration":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 6;
                    break;
                case "Faster Casting":
                    rsp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 50;
                    break;
                case "Spell":
                    // we assume that this is Spell Channeling (because we stripped off channeling because spell channeling doesn't have a intensity)
                    // we'll see if this bites me later
                    rsp += 150;
                    break;
                case "Hit Life Leech":
                case "Hit Stamina Leech":
                case "Hit Mana Leech":
                case "Hit Lower Attack":
                case "Hit Lower Defense":
                    csp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 3;
                    break;
                case "Hit Magic Arrow":
                case "Hit Harm":
                case "Hit Fireball":
                case "Hit Lightning":
                case "Hit Cold Area":
                case "Hit Fire Area":
                case "Hit Poison Area":
                case "Hit Energy Area":
                case "Hit Physical Area":
                    csp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 4;
                    break;
                case "Self Repair":
                    csp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 12;
                    break;
                case "Use Best Weapon":
                    csp += parseInt(curProp.substring(curProp.lastIndexOf(" "), curProp.length)) * 50;
                    break;
            }
            // a keen eye notes that i omit mage weapon, lower stat requirement, and dispel, that's because i was lazy and dispel/lower stat requirement is basically useless
        }
        if(propsString.indexOf("Crafted") > -1 || propsString.indexOf("crafted") > -1) {
            isCrafted = true;
        }
        var pointsToAdd = 0;
        // if an item shows it has lvls on it, i pessimistically assume the points have been spent
        if (isCrafted) {
            pointsToAdd = (100 - lvl) * 3;
        } else {
            pointsToAdd = (100 - lvl) * 5;
        }
        esp = csp + rsp + pointsToAdd;
        $(cur).append("<td>" + esp + "</td><td>" + csp + "</td><td>" + rsp + "</td><td>" + isCrafted + "</td><td>" + lvl + "</td>");
    }
    // lastly, let's make the table sortable
    $(target).find("#box-table-a").tablesorter({sortList: [[6,1]], widgets: ["filter"], widgetOptions: {filter_columnFilters: true, filter_placeholder: { search : 'Filter...' }}}).addClass("tablesorter");
}