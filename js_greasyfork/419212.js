// ==UserScript==
// @name         Flight Rising: Dragon BBCode Gen.
// @namespace    https://greasyfork.org/en/users/721326-dionysus
// @version      0.1
// @description  Visit a dragon's profile to automatically gather appearance information and generate a simple 2-column BBCode layout for use in the forums.
// @author       Dionysus of Greasy Fork
// @match        https://www1.flightrising.com/dragon/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419212/Flight%20Rising%3A%20Dragon%20BBCode%20Gen.user.js
// @updateURL https://update.greasyfork.org/scripts/419212/Flight%20Rising%3A%20Dragon%20BBCode%20Gen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Script will generate a simple BBCode format with the dragon's information on their profile page.
    // The script will replace the dragon's bio content with a textarea containing the code for easy copy & paste.
    // Toggle on and off as needed. WARNING! SCRIPT WILL FAIL IN SCENIC VIEW.

    // dragonInfo is an array that holds all the dragon's info gathered from the page.
    // Here is a Guide to what each index holds so you can decipher the code and potentially make your own format:
    // 0 = Dragon's Name, 1 = ID, 2 = Primary, 3 = Primary Gene, 4 = Secondary, 5 = Secondary Gene, 6 = Tert, 7 = Tert Gene,
    // 8 = Hatchday, 9 = Breed, 10 = Flight, 11 = Eye Type, 12 = Gender, 13 = Color Pattern (XYZ, XXY...)
    // 14 = G1 (1 = true), 15 = Bred or Unbred, 16 = # of Offspring,
    // 17 = Silhouette Scroll Status (1 = true), 18 = Eternal Youth Status (1 = true)

    var statIconValues = document.querySelectorAll('.dragon-profile-stat-icon-value'),
        dragonInfo = [],
        bbcodeString = "";

    // Add Name & ID to dragonInfo
    dragonInfo.push(document.querySelector("#dragon-profile-header .dragon-profile-header-name").innerText);
    dragonInfo.push(document.querySelector("#dragon-profile-header .dragon-profile-header-number").innerText.substring(2, document.querySelector("#dragon-profile-header .dragon-profile-header-number").innerText.length - 1));

    // Add all color/breed/etc. information gathered from Physical Attributes section of profile to dragonInfo
    for (var i = 0; i < statIconValues.length; i++) {
        var string = statIconValues[i].innerText,
            stringArr = string.split("\n");
        if (i == 3) {
            // skip (# years ago) from Hatchdate section
            dragonInfo.push(stringArr[0]);
        } else if (i == 4) {
            // skip 'Adult' or 'Hatchling' label of Breed section
            dragonInfo.push(stringArr[1]);
        } else {
            dragonInfo.push(stringArr[0],stringArr[1]);
        }
    }
    // Add Gender to dragonInfo
    dragonInfo.push(document.querySelector('#dragon-profile-secondary .dragon-profile-icons #dragon-profile-icon-sex-tooltip strong').innerText);

    // Add color pattern to dragonInfo
    if (dragonInfo[2] == dragonInfo[4]) {
        dragonInfo.push("XXY");
    } else if (dragonInfo[2] == dragonInfo[6]) {
        dragonInfo.push("XYX");
    } else if (dragonInfo[4] == dragonInfo[6]) {
        dragonInfo.push("XYY");
    } else {
        dragonInfo.push("XYZ");
    }

    // Add boolean to determine so we can determine if it's a G1 or not later
    if (document.querySelector(".dragon-profile-lineage-parents li em")) {
        dragonInfo.push("1");
    } else {
        dragonInfo.push("0");
    }
    // Add if Bred/Unbred and # of offspring
    if (document.querySelector(".dragon-profile-lineage-offspring li em")) {
        dragonInfo.push("Unbred");
        dragonInfo.push("0");
    } else {
        dragonInfo.push("Bred");
        dragonInfo.push(document.querySelectorAll(".dragon-profile-lineage-offspring li").length);
    }

    // Add boolean values for later. This one is for Silhouette Scroll...
    if (document.querySelector("#dragon-profile-icon-silhouette-tooltip")) {
        dragonInfo.push("1");
    } else {
        dragonInfo.push("0");
    }
    // ...and this is for Eternal Youth
    if (document.querySelector("#dragon-profile-icon-eternal-youth-tooltip")) {
        dragonInfo.push("1");
    } else {
        dragonInfo.push("0");
    }

    // Finally, it's time to built the BBcode using the values stored in the Array:

    // Column 1 uses the Widget code from the site's Dragon Share Pop-Up.
    bbcodeString = "[columns]\n" + document.querySelectorAll("#dragon-profile-share-dialog .dragon-profile-share-field input")[1].value;

    // Column 2 starts with the Dragon's name (which is also a link to their profile), and their ID number. Colors match the profile page layout just for kicks.
    bbcodeString += "\n[nextcol][center][size=6][url=https://www1.flightrising.com/dragon/" + dragonInfo[1] + "][color=#731d08][b]" + dragonInfo[0] + "[/b][/color][/url][/size][size=4]\n[color=#666](#" + dragonInfo[1] + ")[/color]\n\n";
    // Next adds Hatchday (8), Breed (9) Gender (12), Element (10) Eye Type (11), and Bred/Unbred (15)
    bbcodeString += "Born " + dragonInfo[8] + "\n" + dragonInfo[9] + " " + dragonInfo[12] + "\n" + dragonInfo[10] + " " + dragonInfo[11] + "\n" + dragonInfo[15];

    // If it's been bred, also adds the # of offspring.
    if (dragonInfo[16] != "0") {
        bbcodeString += ", " + dragonInfo[16] + " Offspring";
    }

    // Adds color pattern information.
    bbcodeString += "\n" + dragonInfo[13];

    // If it's a G1, add the G1 label
    if (dragonInfo[14] == "1") {
        bbcodeString += " G1";
    }

    // Add the dragon's colors and genes.
    bbcodeString += "\n\n" + dragonInfo[2] + " " + dragonInfo[3] + "\n" + dragonInfo[4] + " " + dragonInfo[5] + "\n" + dragonInfo[6] + " " + dragonInfo[7] + "\n";

    // Add Silhouette Scroll label if applicable
    if (dragonInfo[17] == "1") {
        bbcodeString += "\n[emoji=silhouette size=1] Has Silhouette Scroll";
    }
    // Add Eternal Youth label if applicable
    if (dragonInfo[18] == "1") {
        bbcodeString += "\n[emoji=eternal youth size=1] Is Eternally Youthful";
    }
    // This is here to keep spacing consistent
    if (dragonInfo[17] == "1" || dragonInfo[18] == "1") {
        bbcodeString += "\n";
    }
    // Finally, add a simple section for you to edit however you want
    bbcodeString += "\n[/size][size=5][b]PRICE[/b][/size]\n[/center][/columns]";

    // Changes the dragon's bio to a textarea that holds the BBCode result to make it easy to copy and paste.
    document.querySelector(".dragon-profile-bio-text").innerHTML = '<textarea id="bbcodeString" style="width:100%;height:200px;">' + bbcodeString + '</textarea>';

})();