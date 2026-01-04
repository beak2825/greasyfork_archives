// ==UserScript==
// @name         Kanka Map Path Helper
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      4
// @description  Helps turn polygon markers on Kanka maps into lines to represent paths.
// @author       Salvatos
// @match        https://app.kanka.io/*/maps/*/map_markers*
// @match        https://app.kanka.io/*/maps/*/explore*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446372/Kanka%20Map%20Path%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/446372/Kanka%20Map%20Path%20Helper.meta.js
// ==/UserScript==

// Locate form field
const coordbox = document.querySelector('#marker-poly textarea[name="custom_shape"]');

// Create button
var pathMakerInfo = `<label style="margin-top: 10px;">Path Helper<sup> beta</sup></label><p style="color: var(--text-help); margin-bottom: 5px;">Use the button below to turn your coordinates into a continuous line, for example to represent roads or itineraries. Duplicate points will be omitted, which may cause errors if your path visits the same (exact) point multiple times. To prolong an existing path, simply click the new coordinates, activate the button and those points will be added from the previous end of the path. Remember to set your stroke options to make it visible.</p>`;
var pathMakerBtn = `
        <button type="button" id="path-helper" class="note-btn btn btn-default" title="Make into path">
        Make into path
        </button>`;
coordbox.insertAdjacentHTML("afterend", pathMakerBtn);
coordbox.insertAdjacentHTML("afterend", pathMakerInfo);

// Add click event to button
document.getElementById('path-helper').addEventListener('click', function () {
    // Extract all coordinates from input into array
    var coords1 = coordbox.value.trim().split(" ");

    // Remove duplicates (for successive button clicks, prolonging existing paths, etc.)
    var coords2 = uniq(coords1);
    function uniq(a) {
        return Array.from(new Set(a));
    }

    // Start a fresh array with the unique coords in the initial order, then reverse our copy
    let coords = [].concat(coords2);
    coords2.reverse();

    // Iterate through coords backwards and append them
    coords2.forEach(function (item) {
        if (item != coords2[0]) { // Omit extremity
            coords.push(item);
        }
    });

    // Push new coords to textarea
    coordbox.value = coords.join (" ");
});