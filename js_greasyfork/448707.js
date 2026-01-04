// ==UserScript==
// @name         Snahp.eu urls decoder
// @match        https://*.snahp.*/viewtopic.php*
// @icon         https://cdn-icons-png.flaticon.com/512/2362/2362269.png
// @description  This script detects base64 encoded urls present in snahp pages and decodes them automatically without having to go to other websites :)
// @version 0.0.1.20220731075744
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/448707/Snahpeu%20urls%20decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/448707/Snahpeu%20urls%20decoder.meta.js
// ==/UserScript==

console.log("Script engaged");

function copy_text(e) {
  Clipboard.copy(e.target.innerText);
}

document.querySelectorAll("code").forEach((e) => {
  try {
    e.innerText = atob(e.innerText);
  } catch (error) {}
});

document.querySelectorAll("dd").forEach((e) => {
  try {
    e.innerText = atob(e.innerText);
    e.onclick = copy_text;
    e.style.cursor = "pointer";
  } catch (error) {}
});
