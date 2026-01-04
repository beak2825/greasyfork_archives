// ==UserScript==
// @name         maxlength changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  changes maxlenghth to 999999
// @author       joshclark756
// @include http://*/*
// @include https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488774/maxlength%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/488774/maxlength%20changer.meta.js
// ==/UserScript==

setInterval(() => {
  document.querySelectorAll('[maxlength]').forEach(element => {
    const originalValue = '999999';
    const currentValue = element.getAttribute('maxlength');

    // Check if the current value is different from the original value
    if (currentValue !== originalValue) {
      // If different, set it back to the original value
      element.setAttribute('maxlength', originalValue);
      console.log(`Changed maxlength for element: ${element.tagName}`);
    }
  });
}, 10);