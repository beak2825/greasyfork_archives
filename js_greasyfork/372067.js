// ==UserScript==
// @name         fysh's Queso Canyon Resource Calculator | Blend Highlight
// @description  Highlight the most efficient blend in the calculator
// @namespace    http://fabulous.cupcake.jp.net
// @version      20180909
// @author       FabulousCupcake
// @match        https://fyshhh.github.io/mh_tools/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/372067/fysh%27s%20Queso%20Canyon%20Resource%20Calculator%20%7C%20Blend%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/372067/fysh%27s%20Queso%20Canyon%20Resource%20Calculator%20%7C%20Blend%20Highlight.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const indexTable = [
  'Bland Queso',
  'Mild Queso',
  'Medium Queso',
  'Hot Queso',
  'Flamin\' Queso'
];

const highlightSection = index => {
  const divs = document.querySelectorAll(".container > div");
  const indexOne = 2 + (index * 2);
  const indexTwo = indexOne + 1;

  divs.forEach(div => div.style.boxShadow = '');
  divs.forEach(div => div.style.fontSize = '75%');
  divs.forEach(div => div.style.lineHeight = '0');
  divs[indexOne].style.boxShadow = "-12px 0 white, -16px 0 orange";
  divs[indexTwo].style.boxShadow = "-12px 0 white, -16px 0 orange";
  divs[indexOne].style.fontSize = "100%";
  divs[indexTwo].style.fontSize = "100%";
  divs[indexOne].style.lineHeight = '1';
  divs[indexTwo].style.lineHeight = '1';
}

const updateHighlight = () => {
  const highlight = document.querySelector('#bestQ').textContent;
  const highlightIndex = indexTable.indexOf(highlight);
  highlightSection(highlightIndex);
}

const container = document.querySelector('.container');
const config = { childList: true, subtree: true };
const observer = new MutationObserver(() => updateHighlight());
observer.observe(container, config);

highlightSection(0);