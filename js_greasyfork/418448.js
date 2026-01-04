// ==UserScript==
// @name         Anime-Planet Tag Search
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      0.1.4
// @description  Adds a search bar to the tags tab
// @author       Quin15
// @match        https://www.anime-planet.com/*
// @icon         https://www.google.com/s2/favicons?domain=anime-planet.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/418448/Anime-Planet%20Tag%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/418448/Anime-Planet%20Tag%20Search.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (document.getElementById('multipletags')) {
        var TagSearch = document.createElement("input");
        TagSearch.setAttribute("type", "text");
        TagSearch.setAttribute("class", "searchBarName");
        TagSearch.setAttribute("placeholder", "search by tag");
        TagSearch.setAttribute("id", "searchTagBar");
        TagSearch.setAttribute("style", "margin: 10px 0px");
        document.getElementById('multipletags').prepend(TagSearch);

        var tagList = document.querySelectorAll('#multipletags ul li a');

        $(TagSearch).on("change textInput input", function() {
            if (document.getElementById('advanced_more_tags').style.display == "none") {
                document.getElementById('advanced_more_tags').style.display = "";
            };

            var tagSearchVal = document.getElementById('searchTagBar').value.toLowerCase();
            for (var i = 0; i < tagList.length; i++) {
                if (!(tagList[i].innerText.toLowerCase().indexOf(tagSearchVal) > -1)) {
                    if(tagList[i].parentElement.style.display != "none") {
                        tagList[i].parentElement.style.display = "none";
                    };
                } else {
                    if (tagList[i].parentElement.style.display != "") {
                        tagList[i].parentElement.style.display = "";
                    };
                };
            };
        });
    };
});