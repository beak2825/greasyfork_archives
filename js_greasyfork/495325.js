// ==UserScript==
// @name         Hide AI Generation from Google Search
// @namespace    https://discord.gg/7eMDmtNeNg
// @version      1.0.0
// @description  Hides the AI Generation from Google search results.
// @author       Kabasaki
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?domain=https://google.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495325/Hide%20AI%20Generation%20from%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/495325/Hide%20AI%20Generation%20from%20Google%20Search.meta.js
// ==/UserScript==

const h1Element = Array.from(document.querySelectorAll('h1'))
  .find(h1 => h1.textContent.includes('AI Overview'));

if (h1Element) {
  const parentElement = h1Element.parentElement;
  const siblingDivs = parentElement.querySelectorAll('div');
  siblingDivs[0].style.display = "none";
  console.log(siblingDivs[0]);
}
