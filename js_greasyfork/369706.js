// ==UserScript==
// @name         War Xanax/Energy
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  advanced search at-a-glance refills + xanax
// @author       You
// @match        https://www.torn.com/userlist.php?*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369706/War%20XanaxEnergy.user.js
// @updateURL https://update.greasyfork.org/scripts/369706/War%20XanaxEnergy.meta.js
// ==/UserScript==

jQuery(document).ready(filter);

function filter () {
    'use strict';

    // Your code here...

    setTimeout(filter, 2000);

    var list = [];
    var myE = 361025;
    var userKey = "";

    $("div.expander.clearfix > a.user.name").load().each(function() {
        var elem = $(this).parent().parent().children(".level-icons-wrap").children(".level");

        if (!elem.text().includes("e:")) {
            console.log("enter search");
            var user = $(this).prop('href');
            var userId = user.split("XID=")[1];
            var total = 'https://api.torn.com/user/' + userId + '?selections=personalstats&key=' + userKey;
            console.log(total);
            var xanax = 0;
            var refills = 0;
            var cans = 0;
            var alcohol = 0;
            var candy = 0;
            var consumes = 0;
            var attacksWon = 0;
            var attacksLost = 0;
            var attacksDraw = 0;
            var attacksAssist = 0;
            fetch('https://api.torn.com/user/' + userId + '?selections=personalstats&key=' + userKey)
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                for (var all in data) {
                    for (var  stat in data[all]) {
                        if (stat == "xantaken") {
                            xanax = parseInt(data[all][stat]);
                        }
                        if (stat == "refills") {
                            refills = parseInt(data[all][stat]);
                        }
                        if (stat == "energydrinkused") {
                            cans = parseInt(data[all][stat]);
                        }
                        if (stat == "candyused") {
                            candy = parseInt(data[all][stat]);
                        }
                        if (stat == "alcoholused") {
                            alcohol = parseInt(data[all][stat]);
                        }
                        if (stat == "consumablesused") {
                            consumes = parseInt(data[all][stat]);
                        }
                        if (stat == "attacksdraw") {
                            attacksDraw = parseInt(data[all][stat]);
                        }
                        if (stat == "attacksassisted") {
                            attacksAssist = parseInt(data[all][stat]);
                        }
                        if (stat == "attackswon") {
                            attacksWon = parseInt(data[all][stat]);
                        }
                        if (stat == "attackslost") {
                            attacksLost = parseInt(data[all][stat]);
                        }
                    }
                }
                //          if (refills < (myRef * 0.6)) {
                //              elem.parent().parent().fadeTo(0,0.2);
                //          }
                //          if (xanax > (myXan * 1.4)) {
                //              elem.parent().parent().fadeTo(0,0.2);
                //          }
                console.log(consumes + " " + alcohol + " " + cans + " " + candy);
                var fhc = consumes - alcohol - cans - candy;
                console.log(fhc);
                var energyUsed = 25*(attacksDraw + attacksAssist + attacksWon + attacksLost);
                var energyGained = 250*xanax + 150*refills + 150*fhc + 25*cans;
                console.log(energyUsed + " " + energyGained);
                var energyTrained = energyGained - energyUsed;

 //               elem.append("<br/>x:" + xanax);
   //             elem.append("<br/>r:" + refills);
     //          elem.append("<br/>fhc:" + fhc);
       //         elem.append("<br/>can:" + cans);
                elem.append("<br/>e: " + numberWithCommas(energyTrained));
                elem.append("<br/>r:  " + Math.round(energyTrained / myE * 100) / 100);
            });
        } else {
            return;
        }
    });
}

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}