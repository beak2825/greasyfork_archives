// ==UserScript==
// @name         Summoner Stalking
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Se sei uno psicopatico come me, ti serve questo tool di stalkeraggio maniacale
// @author       alexDaleITA
// @match        https://www.leagueofgraphs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470031/Summoner%20Stalking.user.js
// @updateURL https://update.greasyfork.org/scripts/470031/Summoner%20Stalking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract summoner name and region from the URL using regular expressions
    function getSummonerInfoFromURL(url) {
        const regex = /\/summoner\/([a-z]+)\/(.+)/i;
        const match = url.match(regex);
        return match ? { region: match[1], summonerName: match[2] } : null;
    }

    // Function to get the modified region for the fourth button
    function getModifiedRegion(region) {
        // Add conditions or mappings here for specific regions
        if (region === "euw") {
            return "euw1";
        } else if (region === "kr") {
            return "kr"; // The same for kr
        } else if (region === "eune") {
            return "eun1";
        } else if (region === "na") {
            return "na1";
        } else if (region === "na") {
            return "br1";
        } else if (region === "oce") {
            return "oc1";
        }
        // Add more conditions as needed
        // If no specific condition applies, return the original region
        return region;
    }

    function getModifiedRegion2(region) {
        // Add conditions or mappings here for specific regions
        if (region === "euw") {
            return "EUW";
        } else if (region === "kr") {
            return "KR"; // The same for kr
        } else if (region === "eune") {
            return "EUNE";
        } else if (region === "na") {
            return "NA";
        } else if (region === "na") {
            return "BR";
        } else if (region === "oce") {
            return "OCE";
        }
        // Add more conditions as needed
        // If no specific
    }

    const currentURL = window.location.href;
    const summonerInfo = getSummonerInfoFromURL(currentURL);

    if (summonerInfo) {
        const { region, summonerName } = summonerInfo;
        const siteLink = `https://www.op.gg/summoners/${region}/${summonerName}`; // Replace 'example.com' with the desired site link

        const otherGamesLinks = document.getElementById("otherGamesLinks");
        if (otherGamesLinks) {
            // Create the new button
            const newButton = document.createElement("a");
            newButton.href = siteLink;

            // Create the new image for the button (you can use your own icon image)
            const newImage = document.createElement("img");
            newImage.src = "https://play-lh.googleusercontent.com/FeRWKSHpYNEW21xZCQ-Y4AkKAaKVqLIy__PxmiE_kGN1uRh7eiB87ZFlp3j1DRp9r8k=w480-h960-rw"; // Replace 'example.com/your-icon.png' with the URL of the desired icon image
            newImage.classList.add("your-icon-class"); // Replace 'your-icon-class' with any class name you want to apply to the image

            // Append the image to the button
            newButton.appendChild(newImage);

            // Add the CSS style for the margin between the second and third buttons
            newButton.style.marginLeft = "15px"; // You can adjust the value as needed

            // Append the button to the container
            otherGamesLinks.appendChild(newButton);

            // Create the new button
            const newButton2 = document.createElement("a");
            const modifiedRegion = getModifiedRegion(region);
            newButton2.href = `https://u.gg/lol/profile/${modifiedRegion}/${summonerName}`; // Replace 'example.com/another-page' with the URL of the different link

            // Create the new image for the button (you can use your own icon image)
            const newImage2 = document.createElement("img");
            newImage2.src = "https://i.imgur.com/BCAeRZG.png"; // Replace 'example.com/your-icon.png' with the URL of the desired icon image
            newImage2.classList.add("your-icon-class"); // Replace 'your-icon-class' with any class name you want to apply to the image

            // Append the image to the button
            newButton2.appendChild(newImage2);

            // Add the CSS style for the margin between the second and third buttons
            newButton2.style.marginLeft = "15px"; // You can adjust the value as needed

            // Append the button to the container
            otherGamesLinks.appendChild(newButton2);

            // Create the new button
            const newButton3 = document.createElement("a");
             const modifiedRegion2 = getModifiedRegion2(region);
            newButton3.href = `https://rewind.lol/user.html?username=${summonerName}&region=${modifiedRegion2}`; // Replace 'example.com/another-page' with the URL of the different link

            // Create the new image for the button (you can use your own icon image)
            const newImage3 = document.createElement("img");
            newImage3.src = "https://i.imgur.com/1yI85Cq.png"; // Replace 'example.com/your-icon.png' with the URL of the desired icon image
            newImage3.classList.add("your-icon-class"); // Replace 'your-icon-class' with any class name you want to apply to the image

            // Append the image to the button
            newButton3.appendChild(newImage3);

            // Add the CSS style for the margin between the second and third buttons
            newButton3.style.marginLeft = "15px"; // You can adjust the value as needed

            // Append the button to the container
            otherGamesLinks.appendChild(newButton3);

            // Create the new button
            const newButton4 = document.createElement("a");
            newButton4.href = `https://championmastery.gg/summoner?summoner=${summonerName}&region=${modifiedRegion2}&lang=en_US`; // Replace 'example.com/another-page' with the URL of the different link

            // Create the new image for the button (you can use your own icon image)
            const newImage4 = document.createElement("img");
            newImage4.src = "https://i.imgur.com/7YWahBR.png"; // Replace 'example.com/your-icon.png' with the URL of the desired icon image
            newImage4.classList.add("your-icon-class"); // Replace 'your-icon-class' with any class name you want to apply to the image

            // Append the image to the button
            newButton4.appendChild(newImage4);

            // Add the CSS style for the margin between the second and third buttons
            newButton4.style.marginLeft = "15px"; // You can adjust the value as needed

            // Append the button to the container
            otherGamesLinks.appendChild(newButton4);
        }
    }
})();