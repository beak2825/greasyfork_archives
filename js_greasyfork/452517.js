// ==UserScript==
// @name        Fixed sort:score Button
// @namespace   Violentmonkey Scripts
// @version     1
// @author      usnkw, hetisnietgay
// @description Fixed version of the sort:score button
// @license MIT
// @match       *://rule34.xxx/*
// @downloadURL https://update.greasyfork.org/scripts/452517/Fixed%20sort%3Ascore%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/452517/Fixed%20sort%3Ascore%20Button.meta.js
// ==/UserScript==
// Don't need so many comments, it's clear what we're doing

// Removed on ready/load call since grease/violent/tampermonkey
// scripts are executed on DOMContentLoaded

(() => {
    'use strict';

     // Create our button
    var newButton = document.createElement("Button");
    newButton.innerHTML = "sort:score";
    newButton.style.cursor = "pointer";

    // Better not to use inline events
    newButton.addEventListener('click', (e) => {

        var searchField = document.getElementsByName("tags")[0];

        if (searchField.value.toLowerCase().indexOf("sort:score") == -1) {
            searchField.value += " sort:score"
        }

        e.preventDefault();
    });

    // Search box has class awesomplete, add our button after it
    document.getElementsByClassName("awesomplete")[0].appendChild(newButton);

})();