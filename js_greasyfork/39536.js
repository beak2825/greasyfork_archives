// ==UserScript==
// @name        Wikipedia article name with language
// @version     1.0.2
// @namespace   http://www.agj.cl/
// @description In the 'Languages' list in the left sidebar, the language name linking to the same article in that language is complemented with the name of that article.
// @license     Unlicense
// @include     http*://*.wikipedia.org/wiki/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39536/Wikipedia%20article%20name%20with%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/39536/Wikipedia%20article%20name%20with%20language.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("Executing Wikipedia article name with language.");

  // Utilities.

  const sel = document.querySelector.bind(document);
  const selAll = document.querySelectorAll.bind(document);
  const eq = (a) => (b) => a === b;
  const test = (regex) => (text) => regex.test(text);
  const testOn = (text) => (regex) => regex.test(text);
  const prepend = (a) => (b) => a + b;
  const makeEl = (tag, attrs, ...content) => {
    const el = document.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach((attr) => el.setAttribute(attr, attrs[attr]));
    content
      .map((obj) =>
        typeof obj === "string" ? document.createTextNode(obj) : obj,
      )
      .forEach((node) => el.appendChild(node));
    return el;
  };
  const pipe = (...fs) =>
    fs.reduce(
      (left, right) =>
        (...args) =>
          right(left(...args)),
    );
  const uniq = (list) => {
    const seen = [];
    return list.filter((item) =>
      seen.some(eq(item)) ? false : (seen.push(item), true),
    );
  };
  const not =
    (f) =>
    (...args) =>
      !f(...args);

  //

  const elements = Array.from(selAll(".interlanguage-link"));

  elements.forEach((el) => {
    const a = el.getElementsByTagName("a")[0];
    const langName = a.textContent;
    const titleAndLanguage = a.getAttribute("title");
    const titleMatcher = [
      /(.+) – .+/, // English, etc.
      /(.+) +\(.+\)/, // Spanish, etc.
      /.+: (.+)/, // Japanese, etc.
    ].find(testOn(titleAndLanguage));
    const title = titleAndLanguage.replace(titleMatcher, "$1");
    a.textContent = "";
    a.appendChild(makeEl("span", { class: "language-name" }, langName));
    a.appendChild(document.createTextNode(" "));
    a.appendChild(makeEl("span", { class: "article-title" }, title));
  });

  // Styles.

  sel("head").appendChild(
    makeEl(
      "style",
      null,
      `
		.interlanguage-link .language-name {
			display: block;
			text-transform: uppercase;
			font-size: 0.7em;
		}
		`,
    ),
  );
})();
