// ==UserScript==
// @name         Simplified Chinese Characters For Wiktionary
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  When using the English Wiktionary, the search for Simplified Chinese Characters will always suggest the user to navigate to the corresponding Traditional Chinese Characters page. So we automatically redirect the user.
// @author       moraesvic
// @source       https://gist.github.com/moraesvic/5a8ff36c17fcd3feace5c5d6369c5583
// @match        http*://*.wiktionary.org/*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484991/Simplified%20Chinese%20Characters%20For%20Wiktionary.user.js
// @updateURL https://update.greasyfork.org/scripts/484991/Simplified%20Chinese%20Characters%20For%20Wiktionary.meta.js
// ==/UserScript==

/**
 * This script has been published to Greasy Fork at
 * https://greasyfork.org/en/scripts/484991-simplified-chinese-characters-for-wiktionary
 *
 * It can be added as a user script to browsers like Firefox and Chrome, by adding it to a browser extension
 * like TamperMonkey, GreaseMonkey, or ViolentMonkey.
 */

"use strict";

const DEBUG = true;

const debug = (...args) => {
  if (DEBUG) {
    console.debug("[simplified-chinese]", ...args);
  }
};

/**
 * @param {string} x
 */
const $$ = (x) => Array.from(document.querySelectorAll(x));

/**
 * @param {Document} document The current value of `document`
 * @returns {boolean}
 */
const hasChineseEntry = (document) => {
  return document.querySelector("#Chinese") !== null;
};

/**
 * @param {Document} document The current value of `document`
 * @returns {string | null}
 */
const getNewHref = (document) => {
  debug("Starting.");

  if (!hasChineseEntry(document)) {
    debug("Page has no entry for Chinese, leaving.");
    return null;
  }

  const href = $$("i")
    .find((x) => x.innerHTML.startsWith("This term is the simplified form of"))
    ?.nextElementSibling?.querySelector("a")?.href;

  if (href === undefined) {
    debug("Can't find traditional form, leaving.");
    return null;
  }

  return href;
};

const main = () => {
  const href = getNewHref(document);

  if (href === null) {
    return;
  }

  debug("Assigning new location", href);
  location.assign(href);
};

main();
