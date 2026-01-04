// ==UserScript==
// @name         Torn S.O.A.P. - Spies on Attack Page
// @namespace    https://www.torn.com/profiles.php?XID=2834135#/
// @version      1.3
// @description  Get TornStats spies or personal stats information on the attack page.
// @author       echotte [2834135]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_xmlhttpRequest
// @connect      www.tornstats.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485604/Torn%20SOAP%20-%20Spies%20on%20Attack%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/485604/Torn%20SOAP%20-%20Spies%20on%20Attack%20Page.meta.js
// ==/UserScript==

// ===================================================================================
// =    ___________                     _________   _____      _____    __________   =
// =    \__    ___/__________  ____    /   _____/  /  _  \    /  _  \   \______   \  =
// =      |    | /  _ \_  __ \/    \   \_____  \  /  /_\  \  /  /_\  \   |     ___/  =
// =      |    |(  <_> )  | \/   |  \  /        \ \  \_/  / /    |    \  |    |      =
// =      |____| \____/|__|  |___|  / /_______  /  \_____/  \___/ \___/  |____|      =
// =                              \/          \/                                     =
// ===================================================================================
//
//   Note - this userscript complements the "Wall Battle Stats" script by finally:
//
//         https://greasyfork.org/en/scripts/429563-wall-battlestats
// 
//   If you have already set your API key with the Wall Battle Stats script, there is no 
//   need to set it below again. If you are not using the Wall Battle Stats script yet, 
//   it is highly recommended!
//
//   Otherwise, please enter your API key below. This should be the same one used to 
//   register with TornStats, otherwise it won't be able to pull faction spies out.

var api = "ENTER_API_KEY_HERE";

// ---------------------------------------------------------------------------------------

var attackId, enemydata, spyFound = false;

(function attack() {
    'use strict';

    let url = window.location.href;

    if (api == "" || api == "ENTER_API_KEY_HERE") {
        api = localStorage.getItem("finally.torn.api");
        if (api == null) return; // no usable API key, quit script.
    }

    var bsCache, owndata, jobstr, statstr, footerstr, bspstr, bspEstimate, colorgreen, colorred;

    if(url.includes("sid=attack") && url.includes("user2ID"))
    {
        url = new URL(url);
        attackId = url.searchParams.get("user2ID");

        bsCache = localStorage["finally.torn.bs"] !== undefined ? JSONparse(localStorage["finally.torn.bs"]) : {};
        if (document.getElementById("dark-mode-state").checked) {
            colorgreen = "#98FB98";
        } else {
            colorgreen = "#006400";
        }
        colorred = "#EE4B2B";

        Promise.all([
            fetch(`https://api.torn.com/user/${attackId}?selections=profile,personalstats&key=${api}&comment=attack_stats`),
            fetch(`https://api.torn.com/user/?selections=battlestats,profile,personalstats&key=${api}&comment=attack_stats`)
        ]).then(responses => {
            return Promise.all(responses.map(response => {
                return response.json();
            }));
        }).then(data => {

            enemydata = data[0];
            owndata = data[1];

            if (attackId in bsCache) {
                updateStatTextfromCache();
            } else {
                // no cache found, display personalstats
                let diffXan = enemydata.personalstats.xantaken - owndata.personalstats.xantaken;
                let diffRefill = enemydata.personalstats.refills - owndata.personalstats.refills;
                let diffCans = enemydata.personalstats.energydrinkused - owndata.personalstats.energydrinkused;
                let diffSE = enemydata.personalstats.statenhancersused - owndata.personalstats.statenhancersused;

                // --------------

                statstr = `<br />Xanax: ${diffXan==0 ? "SAME as you" : `<b><font color='${diffXan>0 ? colorred : colorgreen}'>${Math.abs(diffXan)} ${diffXan>0 ? " MORE than you" : " LESS than you"}</font></b>`}
                    <br />Refills: ${diffRefill==0 ? "SAME as you" : `<strong><font color='${diffRefill>0 ? colorred : colorgreen}'>${Math.abs(diffRefill)} ${diffRefill>0 ? " MORE than you" : " LESS than you"}</font></strong>`}
                    <br />Cans: ${diffCans==0 ? "SAME as you" : `<strong><font color='${diffCans>0 ? colorred : colorgreen}'>${Math.abs(diffCans)} ${diffCans>0 ? " MORE than you" : " LESS than you"}</font></strong>`}
                    <br />SE: ${diffSE==0 ? "SAME as you" : `<strong><font color='${diffSE>0 ? colorred : colorgreen}'>${Math.abs(diffSE)} ${diffSE>0 ? " MORE than you" : " LESS than you"}</font></strong>`}
                    <br />`;
            }

            // assemble job and current status
            jobstr = enemydata.job.company_type==0 ? enemydata.job.job : companies[enemydata.job.company_type];

            // add the text to the UI
            updateFooterText();
            addButton(statstr + footerstr);

            // get stars of the company job, update UI when ready
            if (enemydata.job.company_type!=0) {
                fetch(`https://api.torn.com/company/${enemydata.job.company_id}?selections=profile&key=${api}`)
                .then(function (response) { return response.json(); }) // Get a JSON object from the response
                .then(function (companydata) {
                    jobstr = `${companydata.company.rating}* ${companies[enemydata.job.company_type]}`;
                    updateFooterText();
                    updateButtonText(statstr + footerstr);
                });
            }

            // Call TornStats, update localSystem cache if results found for faster loading the next time
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.tornstats.com/api/v1/${api}/spy/${attackId}`,
                onload: (r) => {
                    let spydata = JSON.parse(r.responseText);
                    if (spydata.spy.status == true) {
                        spyFound = true;
                        bsCache[attackId] = {
                            total       : spydata.spy.total,
                            strength    : spydata.spy.strength,
                            defense     : spydata.spy.defense,
                            speed       : spydata.spy.speed,
                            dexterity   : spydata.spy.dexterity,
                            ff          : spydata.spy.fair_fight_bonus,
                            timestamp   : spydata.spy.timestamp,
                        };
                        updateStatTextfromCache();
                        updateButtonText(statstr + footerstr);
                        localStorage.setItem("finally.torn.bs", JSON.stringify(bsCache));
                        localStorage.setItem("finally.torn.api", api);                        
                    }
                },
                onerror: (r) => { console.log("Torn S.O.A.P failed to get data from TornStats: "+r); }
            });
        }).catch(function (error) {
            // if there's an error, log it
            console.log(console.log("Torn S.O.A.P encountered an error: "+error));
        });
    }

    function updateFooterText() {
        footerstr = `<br />Last action: <strong>${enemydata.last_action.relative}</strong>
            <br />
            <br />Faction: <strong>${enemydata.faction.faction_name}</strong>
            <br />Job: <strong>${jobstr}</strong>`;
    }

    function updateStatTextfromCache() {
        // save the opponent's stats
        let stats = [0, 0, 0, 0, 0];
        stats[0] = bsCache[attackId].total;
        stats[1] = bsCache[attackId].strength;
        stats[2] = bsCache[attackId].defense;
        stats[3] = bsCache[attackId].speed;
        stats[4] = bsCache[attackId].dexterity;
        let ff = "ff" in bsCache[attackId] ? bsCache[attackId].ff : 0;

        // calculate and format the stat differences
        let statDiff = [0, 0, 0, 0, 0];
        statDiff[0] = stats[0] / owndata.total * 100;
        statDiff[1] = stats[1] / owndata.strength * 100;
        statDiff[2] = stats[2] / owndata.defense * 100;
        statDiff[3] = stats[3] / owndata.speed * 100;
        statDiff[4] = stats[4] / owndata.dexterity * 100;
        for (let i=0; i<statDiff.length; i++) {
            statDiff[i] = `(${statDiff[i]<10 ? statDiff[i].toFixed(1) : parseInt(statDiff[i]).toLocaleString()}% of yours)`;
        }

        // format the opponent's stats
        stats = shortenNumbers(stats);

        // cache found, display stats from cache
        statstr = (`<br /><strong>TOTAL STATS:</strong> <font color='${bsCache[attackId].total > owndata.total ? colorred : colorgreen}'><strong>${stats[0]}</strong> ${statDiff[0]}</font><br />`) +
                (bsCache[attackId].strength>0 ? `<br />STR: <font color='${bsCache[attackId].strength > owndata.strength ? colorred : colorgreen}'>${stats[1]} ${statDiff[1]}</font><br />` : "") +
                (bsCache[attackId].defense>0 ? `DEF: <font color='${bsCache[attackId].defense > owndata.defense ? colorred : colorgreen}'>${stats[2]} ${statDiff[2]}</font><br />` : "") +
                (bsCache[attackId].speed>0 ? `SPD: <font color='${bsCache[attackId].speed > owndata.speed ? colorred : colorgreen}'>${stats[3]} ${statDiff[3]}</font><br />` : "") +
                (bsCache[attackId].dexterity>0 ? `DEX: <font color='${bsCache[attackId].dexterity > owndata.dexterity ? colorred : colorgreen}'>${stats[4]} ${statDiff[4]}</font><br />` : "") +
                `<br />Fair Fight: <strong><font color='${ff<2 ? colorred : colorgreen}'>${ff.toFixed(2)}</font></strong><br />`;
    }
})();


function addButton(newmsg) {

    let outerBox = document.querySelector('.dialogButtons___nX4Bz');
    let attackInfo = document.createElement('div');
    attackInfo.setAttribute('id', 'attackInfo');
    attackInfo.innerHTML = newmsg;
    outerBox.append(attackInfo);

    return;

    /* Finding the join button using jQuery - depreciated but good as a backup
    let joinBtn = $("button:contains(\"Start fight\"), button:contains(\"Join fight\")").closest("button");
    if($(joinBtn).length) {
        $(joinBtn).after(`<div id='attackInfo'> ` + newmsg + `</div>`);
    }*/
}

function updateButtonText(newmsg) {
    document.getElementById("attackInfo").innerHTML = newmsg;
    //$("#attackInfo").html(newmsg);
}

function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (e) { }
    return null;
}

function shortenNumbers(stats) {
    let units = ["K", "M", "B", "T", "Q"];
    for (let i = 0; i < stats.length; i++) {
        let stat = Number.parseInt(stats[i]);
        if (Number.isNaN(stat) || stat == 0) continue;
        let originalStat = stat;
        
        for (let j = 0; j < units.length; j++) {
            stat = stat / 1000;
            if (stat > 1000) continue;

            stat = stat.toFixed(i == 0 ? (stat >= 100 ? 0 : 1) : 2);
            stats[i] = `${stat}${units[j]}`;
            break;
        }
    }
    return stats;
}

function raiseNotification(title, msg) {
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                // Create and show the notification
                var notification = new Notification(title, {
                    body: msg,
                    //icon: "path/to/icon.png" // You can specify an icon for the notification
                });

                // Optional: Add an event listener for clicks on the notification
                //notification.addEventListener("click", function () {
                //    console.log("Notification clicked!");
                //});
            } else {
                console.log("Notification permission denied");
            }
        });
    } else {
        console.log("Notification API not supported in this browser");
    }
}

const companies = {
    1: "Hair Salon", 2: "Law Firm", 3: "Flower Shop", 4: "Car Dealership", 5: "Clothing Store", 6: "Gun Shop", 7: "Game Shop", 8: "Candle Shop",
    9: "Toy Shop", 10: "Adult Novelties", 11: "Cyber Cafe", 12: "Grocery Store", 13: "Theater", 14: "Sweet Shop", 15: "Cruise Line", 16: "Television Network",
    18: "Zoo", 19: "Firework Stand", 20: "Property Broker", 21: "Furniture Store", 22: "Gas Station", 23: "Music Store", 24: "Nightclub", 25: "Pub",
    26: "Gents Strip Club", 27: "Restaurant", 28: "Oil Rig", 29: "Fitness Center", 30: "Mechanic Shop", 31: "Amusement Park", 32: "Lingerie Store", 33: "Meat Warehouse",
    34: "Farm", 35: "Software Corporation", 36: "Ladies Strip Club", 37: "Private Security Firm", 38: "Mining Corporation", 39: "Detective Agency", 40: "Logistics Management",
};