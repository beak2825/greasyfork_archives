// ==UserScript==
// @name         toggle fov
// @description  NEEDS CODE INJECTOR TO RUN- https://greasyfork.org/en/scripts/446636-code-injector-starblast-io
// @version      1.2
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @match        https://starblast.io/
// @icon         https://cdn.upload.systems/uploads/pMm90TX9.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481488/toggle%20fov.user.js
// @updateURL https://update.greasyfork.org/scripts/481488/toggle%20fov.meta.js
// ==/UserScript==

const modName = "M-Client";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");

function injector(sbCode) {
  let src = sbCode;

  // Replace the code with a callback function
  src = src.replace(/(this\.IOIlO\.position\.z=)(\d+)(,this\.welcome)/g, function(match, p1, p2, p3) {
    let currentPositionZ = parseInt(p2, 10) || 70;

    // Add event listener for 'U' or 'u' key press
    document.addEventListener("keydown", function(event) {
      if (event.key === 'U' || event.key === 'u') {
        // Toggle between 70 and 110 for position.z
        currentPositionZ = (currentPositionZ === 70) ? 110 : 70;
        
        // Log the current position.z value (optional)
        console.log("Position.z toggled to:", currentPositionZ);
      }
    });

    // Return the updated string with the new position.z value
    return p1 + currentPositionZ + p3;
  });

  if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
  window.sbCodeInjectors.push(injector);

  log(`Mod loaded`);
}