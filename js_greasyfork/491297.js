// ==UserScript==
// @name         Akira/Ren Name Switcher for AO3 (site-wide; REN AMAMIYA PREFERRED)
// @namespace    github.com/forceofcalm
// @version      0.5
// @description  Switches the name Akira Kurusu to Ren Amamiya on AO3 on works tagged as Persona 5.
// @author       calm
// @match        https://archiveofourown.org/works/*
// @icon         [later]
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491297/AkiraRen%20Name%20Switcher%20for%20AO3%20%28site-wide%3B%20REN%20AMAMIYA%20PREFERRED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491297/AkiraRen%20Name%20Switcher%20for%20AO3%20%28site-wide%3B%20REN%20AMAMIYA%20PREFERRED%29.meta.js
// ==/UserScript==

const names = {
  akira: {
    first: "Akira",
    last: "Kurusu",
    regexFirst: new RegExp(String.raw`\bAkira\b`, 'gu'),
    regexFirstLower: new RegExp(String.raw`\bakira\b`, 'gu'),
    regexFirstUpper: new RegExp(String.raw`\bAKIRA\b`, 'gu'),
    regexLast: new RegExp(String.raw`\bKurusu\b`, 'gu'),
    regexLastLower: new RegExp(String.raw`\bkurusu\b`, 'gu'),
    regexLastUpper: new RegExp(String.raw`\bKURUSU\b`, 'gu'),
  },
  ren: {
    first: "Ren",
    last: "Amamiya",
    regexFirst: new RegExp(String.raw`\bRen\b`, 'gu'),
    regexFirstLower: new RegExp(String.raw`\bren\b`, 'gu'),
    regexFirstUpper: new RegExp(String.raw`\bREN\b`, 'gu'),
    regexLast: new RegExp(String.raw`\bAmamiya\b`, 'gu'),
    regexLastLower: new RegExp(String.raw`\bamamiya\b`, 'gu'),
    regexLastUpper: new RegExp(String.raw`\bAMAMIYA\b`, 'gu'),
  },
}

const preferredName = names.ren;
const otherName = names.akira;

(() => {
  'use strict';

  if (!document.querySelector(".fandom.tags ul.commas").querySelectorAll("li").some(tag => tag.textContent === "Persona 5")) return;

  const workText = document.querySelector('#workskin');

  const preferredFirstName = preferredName.regexFirst.test(workText.textContent) || preferredName.regexFirstLower.test(workText.textContent);
  const otherFirstName = otherName.regexFirst.test(workText.textContent) || otherName.regexFirstLower.test(workText.textContent);
  const preferredLastName = preferredName.regexLast.test(workText.textContent) || preferredName.regexLastLower.test(workText.textContent);
  const otherLastName = otherName.regexLast.test(workText.textContent) || otherName.regexLastLower.test(workText.textContent);


  const hasBothNames = (otherFirstName || preferredLastName) && (otherFirstName && otherLastName);

  // check that work only has one of the names
  if (hasBothNames) {
    alert('Akira/Ren Name Switcher: Work contains both Akira and Ren. Please edit the work manually.')
    return;
  }

  // work is already in preferred name
  if (preferredFirstName || preferredLastName) {
    return;
  }

  function replaceWord(node, oldWord, newWord) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(oldWord, newWord);
    } else if (node.hasChildNodes()) {
        node.childNodes.forEach(childNode => {
            replaceWord(childNode, oldWord, newWord);
        });
    }
  }

  // normally cased names
  replaceWord(workText, otherName.regexFirst, preferredName.first);
  replaceWord(workText, otherName.regexLast, preferredName.last);

  // lower cased names
  replaceWord(workText, otherName.regexFirstLower, preferredName.first.toLowerCase());
  replaceWord(workText, otherName.regexLastLower, preferredName.last.toLowerCase());

  // upper cased names
  replaceWord(workText, otherName.regexFirstUpper, preferredName.first.toUpperCase());
  replaceWord(workText, otherName.regexLastUpper, preferredName.last.toUpperCase());
})();