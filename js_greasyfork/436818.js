// ==UserScript==
// @name         Custom Coloris Palette
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Modifies Coloris color pickers in Kanka to offer the user’s selection of preset colors.
// @author       Salvatos
// @match        https://app.kanka.io/*relations*
// @match        https://app.kanka.io/*entity_events*
// @match        https://app.kanka.io/*map_markers*
// @match        https://app.kanka.io/*presets*
// @match        https://app.kanka.io/*calendars*
// @match        https://app.kanka.io/*families/*/tree*
// @match        https://app.kanka.io/*theme-builder
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436818/Custom%20Coloris%20Palette.user.js
// @updateURL https://update.greasyfork.org/scripts/436818/Custom%20Coloris%20Palette.meta.js
// ==/UserScript==

/*** INSTRUCTIONS
Add your color values in any valid format to the "customColors" setting below.
- Values are enclosed in quotation marks and separated by commas (line breaks are optional).
- All standard web color formats are accepted: named, hexadecimal, RGB(A), HSL, etc.

Example:
var customColorsExample = [
    'navy',
    '#07b',
    '#123321',
    '#00b4d880',
    'rgb(244,162,97)',
    'rgba(0,119,182,0.8)',
    'hsl(0, 100%, 50%)',
];

Remember you can also define a palette on each campaign; details on GreasyFork.
***/

var customColors = [
    
];

// Prepare to check for supported themes in the campaign
var rootFlags = getComputedStyle(document.documentElement);

/* Campaign-specific swatches */
if (rootFlags.getPropertyValue('--coloris-presets')) {
    let campaignSwatches = rootFlags.getPropertyValue('--coloris-presets').split(" ");
    // Merge browser and campaign arrays, removing duplicates
    customColors = customColors.concat(campaignSwatches.filter((item) => customColors.indexOf(item) < 0));
}

/* Build swatches */
var swatches = `<div>`;
for (let i = 0; i < customColors.length; i++) {
    swatches += `<button type="button" id="clr-swatch-${i}" aria-labelledby="clr-swatch-label clr-swatch-${i}" style="color: ${customColors[i]};">${customColors[i]}</button>`;
}
swatches += `</div>`;

/* Select the element to watch for the appearance of a color picker based on the current page */
/* Use the closest parent to input.spectrum that exists at page load to keep MutationObserver lean */

// Buld relations edit modal
if (window.location.href.indexOf("relations") != -1 && window.location.href.indexOf("entities") == -1) {
	document.targetNode = document.getElementById("bulk-edit");
}
// Map marker edit page
else if (window.location.href.indexOf("map_markers") != -1) {
	document.targetNode = document.getElementById("map-marker-form");
}
// Map marker preset edit page
else if (window.location.href.indexOf("presets") != -1) {
    document.targetNode = document.querySelector("section.content .grid");
}
// Family tree relation edit modal
else if (window.location.href.indexOf("tree") != -1) {
	document.targetNode = document.getElementById("family-tree");
}
// Theme Builder
// Form is created at page load, so no need to observe mutations
else if (window.location.href.indexOf("theme-builder") != -1) {
    // Just add the swatches once, but allow a second for Coloris to initialize
    setTimeout(() => {
        document.getElementById("clr-swatches").insertAdjacentHTML("beforeend", swatches);
    }, "1000");

}
// Default (entity relations and reminders, calendar reminders, theme builder, etc.)
else {
	document.targetNode = document.getElementById("primary-dialog");
}

// Start observing the page for the appearance of a "Spectrum" input, except for the Theme Builder
if (document.targetNode) {
    let observer = new MutationObserver(function(mutations) {
        if (document.querySelector(':is(.spectrum, .picker)')) {
            // If swatches have not already been added, append them to the existing container
            if (document.getElementById("clr-swatches").children.length < 1) {
                document.getElementById("clr-swatches").insertAdjacentHTML("beforeend", swatches);
            }
            // Keep the observer running in case the modal is closed and reopened
        }
    });

    observer.observe(document.targetNode, {attributes: false, childList: true, characterData: false, subtree:true});
}