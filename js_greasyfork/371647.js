// ==UserScript==
// @name         Neoboard avatar Search bar
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      2.0
// @description  Adds a search bar above the avatar dropdown allowing you to search for the avatar you want!
// @author       RealisticError
// @match        http://www.neopets.com/neoboards/preferences.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371647/Neoboard%20avatar%20Search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/371647/Neoboard%20avatar%20Search%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Add case insensitive selector to Jquery
    $.extend($.expr[':'], {
        'containsi': function(elem, i, match, array)
        {
            return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });


    var avatarSelectList = $("Select[Name='activeAv']'");

    avatarSelectList.parent()[0].innerHTML = "<b>Search: </b><input id='AvatarSearch' /><button id='searchAvatarButton' type='button' style='display: none'>Go</button><br />"
        + avatarSelectList.parent()[0].innerHTML;

    var searchInput = $("#AvatarSearch")[0];
    var searchButton = $("#searchAvatarButton");

    var allAvatarNames = [];

for(var i = 0; i < $("Select[Name='activeAv'] > option").length; i++) {
    allAvatarNames.push($("Select[Name='activeAv'] > option")[i].innerText)
}

    var SearchAvatars = function() {

        var searchFor = searchInput.value;

        $("Select[Name='activeAv'] > option:containsi('" + searchFor + "')").show();
        $("Select[Name='activeAv'] > option:not(:containsi('" + searchFor + "'))").hide();

    }

    searchButton.click(SearchAvatars);

    searchInput.addEventListener("keydown", function(event) {

        if (event.keyCode === 13) {

            event.preventDefault();
            searchButton.click();
        } else {

            searchButton.click();
        }
    });

})();