// ==UserScript==
// @name         Grundo's Cafe Avatar Checklist
// @namespace    https://www.grundos.cafe/
// @version      1.1
// @description  Avatar checklist for Grundo's Cafe, visit https://www.grundos.cafe/~Milk
// @author       soupfaerie, supercow64
// @match        https://www.grundos.cafe/~Milk*
// @match        https://www.grundos.cafe/~milk*
// @match        https://www.grundos.cafe/~MILK*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449842/Grundo%27s%20Cafe%20Avatar%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/449842/Grundo%27s%20Cafe%20Avatar%20Checklist.meta.js
// ==/UserScript==

const textToHTML = (text) => new DOMParser().parseFromString(text, "text/html");

/**
 * Analyse the HTML select element for a list of avatars the user has collected.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} the list of avatars as an array of basenames
 */
const getCollectedAvatars = (node = doument) => {
  // The list of avatars is partitioned into default avatars
  // and collected secret avatas. The option with the text ---
  // (6 dashes) is the inclusive cutoff. All avatars at and below
  // the cutoff are collected secret avatars
  const allAvatars = Array.from(
    node.querySelectorAll(`[name="new_avatar"] option`)
  );
  const i = allAvatars.findIndex((e) => e.textContent.includes("---"));
  return allAvatars.slice(i).map((e) => e.value);
};

/**
 * Returns a Promise that resolves to a listo f avatars
 * the user has collected.
 *
 * @returns {string[]} list of collected avatars
 */
const getCollectedAvatarsAsync = () =>
  fetch("/neoboards/preferences/")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getCollectedAvatars);

/**
 * Analyse the list of avatars presented on the page ~milk.
 *
 * @param {*} node Node
 * @returns {{ node: Node, src: string}[]} an array of objects with two entries,
 * where `node` is the DOM node of the list element and `src` is the complete
 * image URL of the avatar
 */
const getAvatarsOnPage = (node = document) =>
  Array.from(node.querySelectorAll("ul.imglist")).map((e) => ({
    node: e,
    src: e.querySelector("img").src,
  }));

/**
 * For static assets, returns the basename of the asset indicated
 * in the url.
 *
 * ```js
 * basename("https://example.com/foo/bar/baz.gif") == "baz.gif"
 * ```
 *
 * @param {string} url path to the file with slashes
 * @returns {string} the basename
 */
const basename = (url) => url.split("/").slice(-1)[0];

const html = `
<h3 style="order:-1">Not collected</h3>
<h3 style="order:3">Collected</h3>
<style>
div.imglist { display: flex; flex-flow: column nowrap;}
[data-collected] { order: 4; }
div.imglist center { order: 5 }
</style>
`;

function main(collectedAvatars) {
  // set up DOM
  const root = document.querySelector("div.imglist");
  root.insertAdjacentHTML("beforeend", html);
  getAvatarsOnPage().forEach(({ node, src }) => {
    if (collectedAvatars.includes(basename(src))) {
      node.dataset.collected = "";
    }
  });
}

// You can save a list of basenames in sessionStorage for testing, otherwise
// the script fetches live data from your Neoboard settings
const debugData = sessionStorage["__debug_list_of_avatars"];
if (debugData) {
  main(JSON.parse(debugData));
} else {
  getCollectedAvatarsAsync().then(main);
}
