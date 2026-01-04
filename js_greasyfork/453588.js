// ==UserScript==
// @name         Genre & Theme list filters for MyAnimeList (MAL)
// @namespace    https://greasyfork.org/users/153517
// @version      2.1
// @description  Adds genre, theme, and demographics filters to the header in the form of a dropdown menu.
// @author       Kanda
// @license      MIT
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @icon         https://icons.duckduckgo.com/ip2/myanimelist.net.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453588/Genre%20%20Theme%20list%20filters%20for%20MyAnimeList%20%28MAL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453588/Genre%20%20Theme%20list%20filters%20for%20MyAnimeList%20%28MAL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    function insertDropdown() {
        // Create the form
        var form = document.createElement("form");
        // Create the dropdown
        var select = document.createElement("select");
        select.id = "genre-selector";
        // Create the options
        var options;
        if (/\/animelist/.test (location.pathname) ) {
            options = [
                { value: "", text: "--Genre filter--" },
                { value: "1", text: "Action" },
                { value: "2", text: "Adventure" },
                { value: "5", text: "Avant Garde" },
                { value: "46", text: "Award Winning" },
                { value: "28", text: "Boys Love" },
                { value: "4", text: "Comedy" },
                { value: "8", text: "Drama" },
                { value: "9", text: "Ecchi" },
                { value: "49", text: "Erotica" },
                { value: "10", text: "Fantasy" },
                { value: "26", text: "Girls Love" },
                { value: "47", text: "Gourmet" },
                { value: "12", text: "Hentai" },
                { value: "14", text: "Horror" },
                { value: "7", text: "Mystery" },
                { value: "22", text: "Romance" },
                { value: "24", text: "Sci-Fi" },
                { value: "36", text: "Slice of Life" },
                { value: "30", text: "Sports" },
                { value: "37", text: "Supernatural" },
                { value: "41", text: "Suspense" },
                { value: "50", text: "Adult Cast" },
                { value: "51", text: "Anthropomorphic" },
                { value: "52", text: "CGDCT" },
                { value: "53", text: "Childcare" },
                { value: "54", text: "Combat Sports" },
                { value: "81", text: "Crossdressing" },
                { value: "55", text: "Delinquents" },
                { value: "39", text: "Detective" },
                { value: "56", text: "Educational" },
                { value: "57", text: "Gag Humor" },
                { value: "58", text: "Gore" },
                { value: "35", text: "Harem" },
                { value: "59", text: "High Stakes Game" },
                { value: "13", text: "Historical" },
                { value: "60", text: "Idols (Female)" },
                { value: "61", text: "Idols (Male)" },
                { value: "62", text: "Isekai" },
                { value: "63", text: "Iyashikei" },
                { value: "64", text: "Love Polygon" },
                { value: "65", text: "Magical Sex Shift" },
                { value: "66", text: "Mahou Shoujo" },
                { value: "17", text: "Martial Arts" },
                { value: "18", text: "Mecha" },
                { value: "67", text: "Medical" },
                { value: "38", text: "Military" },
                { value: "19", text: "Music" },
                { value: "6", text: "Mythology" },
                { value: "68", text: "Organized Crime" },
                { value: "69", text: "Otaku Culture" },
                { value: "20", text: "Parody" },
                { value: "70", text: "Performing Arts" },
                { value: "71", text: "Pets" },
                { value: "40", text: "Psychological" },
                { value: "3", text: "Racing" },
                { value: "72", text: "Reincarnation" },
                { value: "73", text: "Reverse Harem" },
                { value: "74", text: "Romantic Subtext" },
                { value: "21", text: "Samurai" },
                { value: "23", text: "School" },
                { value: "75", text: "Showbiz" },
                { value: "29", text: "Space" },
                { value: "11", text: "Strategy Game" },
                { value: "31", text: "Super Power" },
                { value: "76", text: "Survival" },
                { value: "77", text: "Team Sports" },
                { value: "78", text: "Time Travel" },
                { value: "82", text: "Urban Fantasy" },
                { value: "32", text: "Vampire" },
                { value: "79", text: "Video Game" },
                { value: "83", text: "Villainess" },
                { value: "80", text: "Visual Arts" },
                { value: "48", text: "Workplace" },
                { value: "43", text: "Josei" },
                { value: "15", text: "Kids" },
                { value: "42", text: "Seinen" },
                { value: "25", text: "Shoujo" },
                { value: "27", text: "Shounen" }
            ];
        } else if (/\/mangalist/.test (location.pathname) ) {
            options = [
                { value: "", text: "--Genre filter--" },
                { value: "1", text: "Action" },
                { value: "2", text: "Adventure" },
                { value: "5", text: "Avant Garde" },
                { value: "46", text: "Award Winning" },
                { value: "28", text: "Boys Love" },
                { value: "4", text: "Comedy" },
                { value: "8", text: "Drama" },
                { value: "9", text: "Ecchi" },
                { value: "49", text: "Erotica" },
                { value: "10", text: "Fantasy" },
                { value: "26", text: "Girls Love" },
                { value: "47", text: "Gourmet" },
                { value: "12", text: "Hentai" },
                { value: "14", text: "Horror" },
                { value: "7", text: "Mystery" },
                { value: "22", text: "Romance" },
                { value: "24", text: "Sci-Fi" },
                { value: "36", text: "Slice of Life" },
                { value: "30", text: "Sports" },
                { value: "37", text: "Supernatural" },
                { value: "45", text: "Suspense" },
                { value: "50", text: "Adult Cast" },
                { value: "51", text: "Anthropomorphic" },
                { value: "52", text: "CGDCT" },
                { value: "53", text: "Childcare" },
                { value: "54", text: "Combat Sports" },
                { value: "44", text: "Crossdressing" },
                { value: "55", text: "Delinquents" },
                { value: "39", text: "Detective" },
                { value: "56", text: "Educational" },
                { value: "57", text: "Gag Humor" },
                { value: "58", text: "Gore" },
                { value: "35", text: "Harem" },
                { value: "59", text: "High Stakes Game" },
                { value: "13", text: "Historical" },
                { value: "60", text: "Idols (Female)" },
                { value: "61", text: "Idols (Male)" },
                { value: "62", text: "Isekai" },
                { value: "63", text: "Iyashikei" },
                { value: "64", text: "Love Polygon" },
                { value: "65", text: "Magical Sex Shift" },
                { value: "66", text: "Mahou Shoujo" },
                { value: "17", text: "Martial Arts" },
                { value: "18", text: "Mecha" },
                { value: "67", text: "Medical" },
                { value: "68", text: "Memoir" },
                { value: "38", text: "Military" },
                { value: "19", text: "Music" },
                { value: "6", text: "Mythology" },
                { value: "69", text: "Organized Crime" },
                { value: "70", text: "Otaku Culture" },
                { value: "20", text: "Parody" },
                { value: "71", text: "Performing Arts" },
                { value: "72", text: "Pets" },
                { value: "40", text: "Psychological" },
                { value: "3", text: "Racing" },
                { value: "73", text: "Reincarnation" },
                { value: "74", text: "Reverse Harem" },
                { value: "75", text: "Romantic Subtext" },
                { value: "21", text: "Samurai" },
                { value: "23", text: "School" },
                { value: "76", text: "Showbiz" },
                { value: "29", text: "Space" },
                { value: "11", text: "Strategy Game" },
                { value: "31", text: "Super Power" },
                { value: "77", text: "Survival" },
                { value: "78", text: "Team Sports" },
                { value: "79", text: "Time Travel" },
                { value: "83", text: "Urban Fantasy" },
                { value: "32", text: "Vampire" },
                { value: "80", text: "Video Game" },
                { value: "81", text: "Villainess" },
                { value: "82", text: "Visual Arts" },
                { value: "48", text: "Workplace" },
                { value: "42", text: "Josei" },
                { value: "15", text: "Kids" },
                { value: "41", text: "Seinen" },
                { value: "25", text: "Shoujo" },
                { value: "27", text: "Shounen" }
            ];
        }
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.value = options[i].value;
            option.text = options[i].text;
            select.add(option);
        }
        // Create the submit button
        var button = document.createElement("button");
        button.innerHTML = "Submit";
        // Add the dropdown and button to the form
        form.appendChild(select);
        form.appendChild(button);
        // Set the form's action and method
        form.action = "";
        form.method = "GET";
        // Add an event listener to the form's submit event
        form.addEventListener("submit", function(event) {
            // Prevent the form from submitting
            event.preventDefault();
            // Get the selected option
            var selectedOption = select.options[select.selectedIndex].value;
            // Get the current URL
            var currentURL = window.location.href;
            // Update the current URL with the selected option appended
            var updatedURL = updateQueryStringParameter(currentURL, "genre", selectedOption);
            // Load the new page
            window.location.href = updatedURL;
        });
        // Find the element to insert the form after
        var headerGenres = document.createElement("div");
        headerGenres.classList.add("header-info");
        var headerInfo = document.querySelector(".header-menu");
        // Insert the form after the element
        headerInfo.appendChild(headerGenres);
        headerGenres.appendChild(form);
    }

    insertDropdown();

})();