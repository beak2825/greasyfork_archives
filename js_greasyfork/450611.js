// ==UserScript==
// @name        Kill Running Searches - itemalert.com
// @namespace   Violentmonkey Scripts
// @match       https://itemalert.com/*
// @grant       none
// @version     1.0.4
// @author      -
// @description Adds a convenient button to navbar to kill running services
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450611/Kill%20Running%20Searches%20-%20itemalertcom.user.js
// @updateURL https://update.greasyfork.org/scripts/450611/Kill%20Running%20Searches%20-%20itemalertcom.meta.js
// ==/UserScript==

function killRunningSearches(navbarLabel) {
    navbarLabel.textContent = "Killing Searches"
    fetch('/account').then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {

        // Convert the HTML string into a document object
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        // Get list of running searches
        var theList = doc.querySelectorAll('a.btn.btn-danger.btn-xs');

        //Makes theList global so can experiment with it in console.
        //
        //if (unsafeWindow.theList == undefined) {
        // unsafeWindow.theList = theList;
        //}
        var listCounter = 1
        for (const nodeElements of theList) {
          if (nodeElements.href.search("forget") != -1 ){
            fetch(nodeElements.href).then(() => {(listCounter == theList.length) ? navbarLabel.textContent = "Searches Killed" : listcounter++;});
          }
        }
        if (theList.length == 0){
          navbarLabel.textContent = "No Searches Running"
        }

    }).catch(function (err) {
        // There was an error
        navbarLabel.textContent = "Error, Try Again"
        console.warn('Something went wrong.', err);
    });

};

(function () {
    'use strict';

    //Add a button to the navbar, using navbar-right to put it near the account/login/logout button
    var navbar = document.querySelector("ul.nav.navbar-nav.navbar-right").appendChild(document.createElement('li')).appendChild(document.createElement('a'));
    var navbarLabel = navbar.appendChild(document.createElement('b'));
    navbarLabel.textContent = "Kill Running Searches";
    navbar.type = "button";
    navbar.classList.add("btn");
    navbar.classList.add("btn-danger");
    navbar.classList.add("btn-xs");
    navbar.href = "#KillSavedSearches";
    navbar.addEventListener("click",() => { killRunningSearches(navbarLabel);} , false);

})();
