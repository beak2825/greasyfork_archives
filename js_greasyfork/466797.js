// ==UserScript==
// @name        Google Advanced Search Button
// @namespace   Violentmonkey Scripts
// @match       *://www.google.*/*
// @grant       none
// @license     MIT
// @homepageURL https://github.com/slayernominee/userscripts
// @version     1.2
// @author      slayernominee
// @description add an button for the google advanced search in the google home search page instead of the random search button
// @downloadURL https://update.greasyfork.org/scripts/466797/Google%20Advanced%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/466797/Google%20Advanced%20Search%20Button.meta.js
// ==/UserScript==

random_search_button_container = document.getElementsByTagName("center")[1];
random_search_button = random_search_button_container.childNodes[3];

random_search_button.value = "Advanced Search";
random_search_button.setAttribute("aria-label", "Advanced Search");
random_search_button.id = null;
random_search_button.setAttribute("jsaction", "null");
random_search_button.setAttribute("data-ved", "null");
random_search_button.setAttribute("name", "null");

random_search_button.addEventListener('click', function (evt) {
    evt.preventDefault();

    window.location.href = "https://www.google.com/advanced_search";
});
