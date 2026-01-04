/* global $: true */
/* global waitForKeyElements: true */

// ==UserScript==
// @name Geocaching Puzzle Solution Hider
// @description Hides the stuff from myster caches
// @match http://www.geocaching.com/geocache/*
// @match https://www.geocaching.com/geocache/*
// @match http://geocaching.com/geocache/*
// @match https://geocaching.com/geocache/*
// @match http://www.geocaching.com/play/*
// @match https://www.geocaching.com/play/*
// @match http://geocaching.com/play/*
// @match https://geocaching.com/play/*
// @match http://www.geocaching.com/plan/*
// @match https://www.geocaching.com/plan/*
// @match http://geocaching.com/plan/*
// @match https://geocaching.com/plan/*
// @match https://www.certitudes.org/*
// @match http://www.certitudes.org/*
// @version 1.2
// @namespace    https://greasyfork.org/en/scripts/529637-geocaching-puzzle-solution-hider/code
// @homepage     https://greasyfork.org/en/scripts/529637-geocaching-puzzle-solution-hider/code
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/529637/Geocaching%20Puzzle%20Solution%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/529637/Geocaching%20Puzzle%20Solution%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hideFirstElementWithClassX(abc) {
    // Find the first element with class name 'xxx'
    var element = document.querySelector(abc);

    // Check if the element exists
    if (element) {
        // Hide the element by setting its display style to none
        element.style.display = 'none';
    }
}
    function setDistanceToZero(abc) {
    // Select all elements with the class 'distance-cell'
    var elements = document.getElementsByClassName(abc);

    // Iterate through the selected elements and set their inner text
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerText = '0.0 mi';
    }
}



// Call the function to set the distances
setDistanceToZero('distance-cell');
    setDistanceToZero('list-geocache-distance');



// Call the function to hide the element
  //  hideFirstElementWithClassX(".Note.PersonalCacheNote");
   hideFirstElementWithClassX(".LocationData.FloatContainer");
    hideFirstElementWithClassX("#coordinate-div");
  //  hideFirstElementWithClassX("#uxlrgMap");
    hideFirstElementWithClassX("#solution");
    hideFirstElementWithClassX("#viewCacheNote");
    hideFirstElementWithClassX("#map_canvas");
})();