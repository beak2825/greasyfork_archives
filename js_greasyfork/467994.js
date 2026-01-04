// ==UserScript==
// @name         GC - BD Challengers Checklist
// @namespace    https://www.grundos.cafe/
// @version      1.1.1
// @description  BD challengers checklist for Grundo's Cafe
// @author       wibreth, soupfaerie, supercow64
// @match        https://www.grundos.cafe/~B/
// @match        https://www.grundos.cafe/~b/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467994/GC%20-%20BD%20Challengers%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/467994/GC%20-%20BD%20Challengers%20Checklist.meta.js
// ==/UserScript==

const textToHTML = (text) => new DOMParser().parseFromString(text, "text/html");

/**
 * Analyse the HTML select element for a list of Challengers the user has collected.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} the list of Challengers as an array of basenames
 */
const getCollectedChallengers = (node = doument) => {
  const allChallengers = Array.from(
    node.querySelectorAll(`.btn-link`)
  );
  return allChallengers.map((e) => e.textContent);
};

/**
 * Returns a Promise that resolves to a listo f Challengers
 * the user has collected.
 *
 * @returns {string[]} list of collected Challengers
 */
const getCollectedChallengersAsync = () =>
  fetch("/dome/1p/select/")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getCollectedChallengers);

/**
 * Analyse the list of Challengers presented on the page ~milk.
 *
 * @param {*} node Node
 * @returns {{ node: Node, src: string}[]} an array of objects with two entries,
 * where `node` is the DOM node of the list element and `src` is the name
 * of the challenger
 */
const getChallengersOnPage = (node = document) =>
  Array.from(node.querySelectorAll(".challenger")).map((e) => ({
    node: e,
    src: e.querySelector(".challengername").childNodes[0].textContent.trim()
  }));


const html = `
<h3 style="order:-3">Challengers You Are Missing</h3>
<h3 style="order:-1">Challengers You Have Unlocked</h3>
`;

function main(collectedChallengers) {
  const root = document.querySelector(".checklist");
  root.insertAdjacentHTML("beforeend", html);

  if (collectedChallengers.length <= 0) {
    console.log('in battle!');
    document.querySelector(".hidden").classList.remove('hidden');
    return;
  }
  getChallengersOnPage().forEach(({ node, src }) => {
    if (!collectedChallengers.includes(src)) {
      node.classList.add('locked');
    }
  });
}

getCollectedChallengersAsync().then(main);
