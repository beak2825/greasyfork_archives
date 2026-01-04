// ==UserScript==
// @name         Soundcloud Twitch DJ Restricted List Highlight
// @version      2024-08-07
// @license      MIT
// @description  Highlight any songs on Soundcloud song pages that have artists on Twitch DJ Restricted List
// @author       tymdeus
// @match        https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://update.greasyfork.org/scripts/498113/1395364/waitForKeyElements_mirror.js
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1347704
// @downloadURL https://update.greasyfork.org/scripts/502984/Soundcloud%20Twitch%20DJ%20Restricted%20List%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/502984/Soundcloud%20Twitch%20DJ%20Restricted%20List%20Highlight.meta.js
// ==/UserScript==
/* globals $ waitForKeyElements */

(function() {
    'use strict';

    let restrictedList = [
        "Amaryllis",
        "Archolekas",
        "Black Sabbath",
        "Blake Shelton",
        "Bloody Hawk",
        "Bob Marley & The Wailers",
        "Bob Seger",
        "Christos Cholidis",
        "Clout Music",
        "Crosby, Stills & Nash",
        "Dadju",
        "Daphne Lawrence",
        "David Bowie",
        "Def Leppard",
        "Diablo",
        "DJ.Silence",
        "Don Henley",
        "Eagles",
        "Ed Sheeran",
        "Eric Clapton",
        "Etienne Daho",
        "Faber",
        "Flare",
        "Fleetwood Mac",
        "Foals",
        "Frank Sinatra",
        "Genesis",
        "George Harrison",
        "George Mazonakis",
        "Glenn Frey",
        "GODSQUAD",
        "Grateful Dead",
        "Green Day",
        "Harukamirai",
        "Helena Paparizou",
        "Helene Fischer",
        "Herbert Grönemeyer",
        "HKT48",
        "IZ*ONE",
        "Jackson Browne",
        "James Taylor",
        "Jay-Z",
        "John Lennon",
        "K.I.Z",
        "Kenshi Yonezu",
        "Kraftklub",
        "La Clique Music",
        "Led Zeppelin",
        "Lis",
        "Macklemore",
        "Madonna",
        "Maraveyas",
        "Metallica",
        "MG",
        "MILAN",
        "Minami Takahashi",
        "MONSTA X",
        "Morfoula Iakovidou",
        "Mouzourakis",
        "Muse",
        "My Hair Is Bad",
        "Neil Young",
        "NGT48",
        "Nikos Oikonomopoulos",
        "Oge",
        "Panagiotis Chatzipapas",
        "Pantelis Pantelidis",
        "Paul McCartney",
        "Phil Collins",
        "Pink Floyd",
        "Prince",
        "Queen",
        "Rammstein",
        "Red Hot Chili Peppers",
        "Red Hot Chilli Peppers", // common misspelling
        "Rena Morfi",
        "Rihanna",
        "Roberta Flack",
        "Rod Stewart",
        "Sakis Rouvas",
        "Seiko Matsuda",
        "Sheena Ringo",
        "SHINee",
        "Slimane",
        "Slogan",
        "Snik",
        "Solmeister",
        "Spitz",
        "Steely Dan",
        "Steve Miller",
        "Stevie B",
        "TAEMIN",
        "Tamta",
        "Team H",
        "TETSUYA",
        "The Beatles",
        "The Black Keys",
        "The Doors",
        "Tokyo Incidents",
        "Tom Waits",
        "Top Notch",
        "Noah's Ark",
        "TOQUEL",
        "Klaudio Dhespo",
        "Tracy Chapman",
        "Van Halen",
        "Van Morrison",
        "WOMCADOLE",
        "Yumi Arai",
        "Yumi Matsutoya"];

    function checkForRestrictedArtist (str){
        // Check case insensitive and ignore punctuation.
        // Also check with punctuation replaced by spaces for things like dj.silence.
        // Ignore HTML entities of apostrophies
        // If found on restriced list return the artist name IN ARRAY so can explain and/or highlight
        // Need to check against WORDS not just includes due to artists like Lis and MG which turn up in other words
        let strippedStr = str.replace("\n", "").replace("&apos;", "'").trim().toUpperCase();
        console.log("Checking string", strippedStr, "against resticted list");
        let foundArtists = [];
        for (let artist of restrictedList){
            let artistVariants = [artist.replace(/[^a-z0-9 ]+/gi, '').toUpperCase(), artist.replace(/[^a-z0-9 ]+/gi, ' ').toUpperCase()]; // Special chars sometimes replaced with spaces
            let artistTests = [new RegExp('\\b' + artistVariants[0] + '\\b', 'i'), new RegExp('\\b' + artistVariants[1] + '\\b', 'i')];
            if (artistTests[0].test(strippedStr.replace(/[^a-z0-9 ]+/gi, '')) || artistTests[1].test(strippedStr.replace(/[^a-z0-9 ]+/gi, ' '))){
                foundArtists.push(artist);
            }
        }
        return foundArtists;
    }

    function showAlertBar ($el, artistString){
        console.log("Showing alert bar for", artistString);
        let cssAdjust = $el.hasClass("trackItem__content") ? "line-height: 0.8em;" : "font-size: 16px;";
        $el.prepend("<div style='width: 100%; background-color: red; color: black; font-weight: bold; padding: 5px; "+cssAdjust+"'>WARNING: Twitch DJ Restricted Artist "+artistString+" found on this song.</div>");
    }

    function checkTitleSection (el) {
        console.log("waitForKeyElements:", el);
        let $el = $(el);
        let toCheck = [$el.find('.soundTitle__title span, .trackItem__trackTitle').text(), $el.find('.soundTitle__username, .trackItem__username').text()]; // Any field that might have an artist in it. Doesn't seem to be an artist list section on SC.
        let results = [];
        for (let str of toCheck){
            results = results.concat(checkForRestrictedArtist(str));
        }
        console.log("Results:", results);
        if (results.length > 0){
            showAlertBar($el, [...new Set(results)].join(", "));
        }
    }

    waitForKeyElements(".fullHero__title div.soundTitle__usernameTitleContainer, .searchItem div.soundTitle__usernameTitleContainer, .trackItem__content", checkTitleSection);
})();