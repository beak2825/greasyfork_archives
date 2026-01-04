// ==UserScript==
// @name         Hide Name
// @version      0.1
// @description  Hide the name when /hide is entered
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1254447
// @downloadURL https://update.greasyfork.org/scripts/485908/Hide%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/485908/Hide%20Name.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
  const name = document.querySelector('.name'); // Replace '.name' with the actual selector of the name element
  if (event.key === '/' && event.shiftKey) {
    name.style.visibility = 'hidden';
  }
});
