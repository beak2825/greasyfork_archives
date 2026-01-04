// ==UserScript==
// @name         Restore Left-Aligned Street View Info Card
// @namespace    tiau
// @version      1.1
// @description  Does what the title says.
// @author       tiau
// @include      https://*.google.com/maps*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maps.google.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/472299/Restore%20Left-Aligned%20Street%20View%20Info%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/472299/Restore%20Left-Aligned%20Street%20View%20Info%20Card.meta.js
// ==/UserScript==

const UPDATE_CHECK_INTERVAL = 200;

/* Show/Hide Search Box */
function showHideSearch() {
  try {
    const mode = document.querySelector('[role="application"]').ariaLabel;
    const searchBox = document.getElementById("searchbox");

    if (mode == "Street View") {
      searchBox.style.display = "none";
    } else {
      searchBox.style.display = "block";
    }
  } catch (err) { console.error(err) }
}

// SV enabled check
waitForKeyElements('[role="navigation"]', showHideSearch);
// SV disabled check
waitForKeyElements('[aria-label="Restaurants"]', showHideSearch);

/* Modify Page CSS */
let stylesheet = document.createElement("style");
stylesheet.textContent = `
    /* Move street view card back to the left side */
    [jsaction="focus:titlecard.main"] {
        left: 20px;
        max-width: 20em;
        top: 20px;
    }
  `;
document.head.appendChild(stylesheet);



/* Dependencies */


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. Forked for use without JQuery.
*/
function waitForKeyElements(e,t,n){(o=document.querySelectorAll(e))&&o.length>0?(a=!0,o.forEach(function(e){"alreadyFound"!=e.dataset.found&&(t(e)?a=!1:e.dataset.found="alreadyFound")})):a=!1;var o,a,l=waitForKeyElements.controlObj||{},r=e.replace(/[^\w]/g,"_"),d=l[r];a&&n&&d?(clearInterval(d),delete l[r]):d||(d=setInterval(function(){waitForKeyElements(e,t,n)},UPDATE_CHECK_INTERVAL),l[r]=d),waitForKeyElements.controlObj=l}