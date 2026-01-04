// ==UserScript==
// @name         GeoGuesser Platinum Explorer Map
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  Sets the country colour if you've got a platinum medal on it
// @author       Crimsonfox
// @match        https://www.geoguessr.com/explorer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474823/GeoGuesser%20Platinum%20Explorer%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/474823/GeoGuesser%20Platinum%20Explorer%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';
//window.addEventListener('load', function() {

    var platinumCount = document.querySelectorAll("[class*=explorer_platinum]").length;
    const platinumHTML = `
    <div class="medal-count_medal___St6Rr"><img alt="Platinum" loading="lazy" width="100" height="84" decoding="async" data-nimg="1" style="color:transparent" src="/_next/static/media/medal-platinum.37cd72ca.svg"><p class="medal-count_medalLabel__g9Xmu">${platinumCount}<span class="medal-count_times__Sn7Qq">x</span> Platinum</p></div>
    `;

    //var medalElements = document.querySelectorAll("div.medal-count_medal___3ivX");
    var medalElements = document.querySelectorAll("[class^=medal-count_medal__]");
    var lastMedalElement = medalElements[medalElements.length -1];
    lastMedalElement.insertAdjacentHTML('afterend', platinumHTML);

    //Hashtable for country to country codes
    let ht = {
        albania:"country-al","american-samoa":"country-as",andorra:"country-ad",argentina:"country-ar",australia:"country-au",austria:"country-at",bangladesh:"country-bd",belgium:"country-be",bhutan:"country-bt",bolivia:"country-bo",botswana:"country-bw",brazil:"country-br",bulgaria:"country-bg",cambodia:"country-kh",canada:"country-ca",chile:"country-cl","christmas-island":"country-cx",colombia:"country-co",croatia:"country-hr",curacao:"country-cw","czech-republic":"country-cz",denmark:"country-dk","dominican-republic":"country-do",ecuador:"country-ec",estonia:"country-ee",eswatini:"country-sz","faroe-islands":"country-fo",finland:"country-fi",france:"country-fr",germany:"country-de",ghana:"country-gh",gibraltar:"country-gi",greece:"country-gr",greenland:"country-gl",guam:"country-gu",guatemala:"country-gt",hongkong:"country-hk",hungary:"country-hu",iceland:"country-is",india:"country-in",indonesia:"country-id",ireland:"country-ie","isle-of-man":"country-im",israel:"country-il",italy:"country-it",japan:"country-jp",jersey:"country-je",jordan:"country-jo",kenya:"country-ke",kyrgyzstan:"country-kg",laos:"country-la",latvia:"country-lv",lesotho:"country-ls",lithuania:"country-lt",luxembourg:"country-lu",madagascar:"country-mg",malaysia:"country-my",malta:"country-mt",mexico:"country-mx",monaco:"country-mc",mongolia:"country-mn",montenegro:"country-me",netherlands:"country-nl","new-zealand":"country-nz",nigeria:"country-ng","north-macedonia":"country-mk","northern-mariana-islands":"country-mp",norway:"country-no",peru:"country-pe",philippines:"country-ph",poland:"country-pl",portugal:"country-pt","puerto-rico":"country-pr",qatar:"country-qa",romania:"country-ro",russia:"country-ru",rwanda:"country-rw","san-marino":"country-sm",senegal:"country-sn",serbia:"country-rs",singapore:"country-sg",slovakia:"country-sk",slovenia:"country-si","south-africa":"country-za","south-korea":"country-kr",spain:"country-es","sri-lanka":"country-lk",sweden:"country-se",switzerland:"country-ch",taiwan:"country-tw",thailand:"country-th",tunisia:"country-tn",turkey:"country-tr",uganda:"country-ug",ukraine:"country-ua",uae:"country-united arab emirates",uk: "country-gb",usa:"country-us",uruguay:"country-uy",panama:"country-pa"
    }

    //Gets country elements from lower list
    var countries = document.querySelectorAll("[class^=explorer_link]")

    Array.prototype.forEach.call(countries, function (country) {
        var countryName = country.href.split("/").pop();
        if (country.parentElement.nextSibling.firstChild == null) {
            return;
        }

        //Get the medal from the element that displays the medal image
        var medal = country.parentElement.nextSibling.firstChild.className;

        if (medal.includes("platinum")){
            var mapElementID = ht[countryName];
            //Get map element and apply colour
            if (document.getElementById(mapElementID)) {
                var mapElement = document.getElementById(mapElementID);
                mapElement.setAttribute("fill","#79c1f7");
            };
        }
    });
//}, false);
})();