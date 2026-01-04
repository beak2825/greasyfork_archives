// ==UserScript==
// @name         StripChat hide favourites
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  High favourite cams from listing so you can see only new ones to you
// @author       GordonFreeman
// @match        https://*stripchat.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484425/StripChat%20hide%20favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/484425/StripChat%20hide%20favourites.meta.js
// ==/UserScript==

setInterval(function() {

    var modelLinks = document.querySelectorAll(".model-list-item-lower");

    // Loop through each element
    modelLinks.forEach(function(link) {
      // Get all span elements within the current link
      var spanElements = link.querySelectorAll("span");

      // Loop through each span element
      spanElements.forEach(function(span) {
        // Check if the class contains the string "favorite"
        if (span.className.indexOf("favorite") !== -1) {
          // Hide the parent div with class "model-list-item"
          link.closest(".model-list-item").style.display = "none";
        }
      });
    });

    // Find the div with id "chat"
    var chatDiv = document.querySelector(".chat");

    // Check if the div is found
    if (chatDiv) {

      // Hide the div by setting its style.display property to "none"
      chatDiv.style.display = "none";
    }


}, 3000);