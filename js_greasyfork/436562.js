// ==UserScript==
// @name         Better MAL Favs
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      10
// @description  Choose how you want profile favorites to look like.
// @author       hacker09 & Shishio-kun
// @include      /https:\/\/myanimelist\.net\/profile\/[^\/]+(\/)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/436562/Better%20MAL%20Favs.user.js
// @updateURL https://update.greasyfork.org/scripts/436562/Better%20MAL%20Favs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand("Choose MAL Favs Styles", function() { //Creates a new function
    GM_setValue("Choice", prompt('1 Actual style showing all favs titles and names\n\n2 Vertical style\n\n3 Vertical style with big images\n\n4 Vertical style without franchise name/year\n\n5 Vertical style with big images and without franchise name/year\n*Write only your choice number and click OK')); //Gets the user input and defines the variable as the UserInput
    location.reload(); //Reloads the page
  }); //Adds an option to the menu and finishes the function

  switch (GM_getValue("Choice")) {
    case undefined: //If the variable doesn't exist yet
      alert('Click on the TamperMonkey extension icon, and click on the button "Choose MAL Favs Styles", to chose how you want the MAL favs to look like by default.'); //Shows how to config the script
      break;
    case '1': //If the user chose option 1
      document.head.insertAdjacentHTML('beforeend', '<style>.fav-slide-block .fav-slide .btn-fav .link .title, .fav-slide-block .fav-slide .btn-fav .link .users {opacity: unset;}</style>'); //Show the titles by default
      break;
    case '2': //If the user chose option 2
      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://userstyles.org/styles/221397.css"/>`); //Original MAL Favorites Style
      break;
    case '3': //If the user chose option 3
      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://userstyles.org/styles/221398.css"/>`); //Original MAL Favorites Style (big pics version)
      break;
    case '4': //If the user chose option 4
      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://userstyles.org/styles/221276.css"/>`); //Make Favorites Vertical Again! (Minimal/Small ver)
      break;
    case '5': //If the user chose option 5
      document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="https://userstyles.org/styles/221277.css"/>`); //Make Favorites Vertical Again! (Minimal/Big ver)
      break;
  } //Finishes the switch condition
})();