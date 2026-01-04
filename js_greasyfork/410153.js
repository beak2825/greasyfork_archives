// ==UserScript==
// @name          htmlToElements
// @namespace     https://greasyfork.org
// @version       0.1.1
// @description   Convert html source text to dom elements.
// @match         *://*/*
// @grant         none
// ==/UserScript==

/**
 * https://stackoverflow.com/a/35385518
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
const htmlToElements = (htmlSrc) => {
  let template = document.createElement('template');
  template.innerHTML = htmlSrc;
  return template.content;
};
