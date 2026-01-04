// ==UserScript==
// @name         Exclude non-drug crimes
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hide all non-drug crimes
// @author       You
// @match        https://www.torn.com/crimes.php
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390858/Exclude%20non-drug%20crimes.user.js
// @updateURL https://update.greasyfork.org/scripts/390858/Exclude%20non-drug%20crimes.meta.js
// ==/UserScript==

const formSelector = 'form[action="crimes.php?step=docrime"]';
waitForKeyElements(formSelector, function () {
  const items = $(formSelector + ' > ul > li');
  items.each(index => index !== 6 ? $(items[index]).hide() : null);
});