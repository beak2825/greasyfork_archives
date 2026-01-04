// ==UserScript==
// @name         Prognocis Tabular Report editor mod
// @namespace    prognocis.com
// @version      2025.01.24.0908
// @description  modifies the height of divs to show more rows in the table editor
// @author       mrkrag
// @match        *.prognocis.com/prognocis/Reports.action2*
// @icon         https://prognocis.com/wp-content/uploads/2020/07/cropped-Fav-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515286/Prognocis%20Tabular%20Report%20editor%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/515286/Prognocis%20Tabular%20Report%20editor%20mod.meta.js
// ==/UserScript==

const datadiv = document.getElementById("datadiv");
// be sure to include the [index] when selecting by class name because it returns an array
const fhttbody = document.getElementsByClassName("fht-tbody")[0];

// Replace the value of the 'height' attributes
datadiv.style.height = "460px";
fhttbody.style.height = "430px";

