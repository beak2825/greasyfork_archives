// ==UserScript==
// @name        Kill Six Billion Demons and The Other End Comics hovertext
// @version     9
// @grant       none
// @match       *://*.killsixbilliondemons.com/comic*
// @match       *://killsixbilliondemons.com/comic*
// @match       *://*.kohney.com/comic*
// @match       *://kohney.com/comic*
// @description Show hovertext below the comic.
// @namespace   https://greasyfork.org/users/324881
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494850/Kill%20Six%20Billion%20Demons%20and%20The%20Other%20End%20Comics%20hovertext.user.js
// @updateURL https://update.greasyfork.org/scripts/494850/Kill%20Six%20Billion%20Demons%20and%20The%20Other%20End%20Comics%20hovertext.meta.js
// ==/UserScript==

const addAltText = () => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.id = "altTextWrapperDiv";
  wrapperDiv.style.fontSize = "2rem";
  wrapperDiv.textContent = document.getElementsByClassName("comic-table")[0].getElementsByTagName("img")[0].title; // Get the comic's alt text
  document.getElementById("comic").appendChild(wrapperDiv);
}

const moveHeader = () => {
  if (window.location.host.includes("killsixbilliondemons")) {
    const elementsToMove = document.querySelectorAll("#header,#sidebar-menubar,#content-wrapper-head");
    for (const element of elementsToMove) {
      document.getElementById("page").appendChild(element);
    }
  }
}

const largerText = () => {
  if (window.location.host.includes("kohney")) {
    document.getElementsByClassName("comic-nav-container")[0].style.fontSize = "2.5rem";
  }
}

try { moveHeader(); } catch (e) { } // Try catch in case this runs before the DOM is ready.
try { largerText(); } catch (e) { } // Try catch in case this runs before the DOM is ready.
addEventListener("DOMContentLoaded", moveHeader); // Just in case the initial moveHeader() ran before the DOM was ready.
addEventListener("DOMContentLoaded", largerText); // Just in case the initial moveHeader() ran before the DOM was ready.
addEventListener("load", addAltText);
