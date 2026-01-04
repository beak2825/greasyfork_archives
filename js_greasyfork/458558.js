// ==UserScript==
// @name        Wikipedia Vector 2022 - Better TOC
// @namespace   fabulous.cupcake.jp.net
// @description Better table of contents for mediawiki vector 2022 skin
// @license     MIT
// @match       *://*.wikipedia.org/*
// @version     2023.01.19.1
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/458558/Wikipedia%20Vector%202022%20-%20Better%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/458558/Wikipedia%20Vector%202022%20-%20Better%20TOC.meta.js
// ==/UserScript==

const stylesheet = `

.vector-toc-level-3 { display: none !important; }
.vector-toc-level-1 > button { display: none !important; }

.vector-toc .vector-toc-numb,
.vector-toc .vector-toc-numb:after {
  display: inline !important;
  color: var(--fbc-primary-text);
  white-space: pre;
}

.vector-toc .vector-toc-numb:after {
  content: " ";
}

.vector-toc-text {
  padding: 2px 0 !important;
  display: flex;
  justify-content: flex-start;
  gap: 0.25em
}

.vector-toc .vector-toc-list-item .vector-toc-list-item {
  padding-left: 1em !important;
}


.vector-toc-list-item-active > a {
  background: var(--fbc-gray-20);
}

/* ------------------------------------------------------

Surprisingly the numbers are there just hidden.
In case it's removed we'd have to do it on our own:

.vector-toc li {
  list-style: decimal !important;
  display: list-item !important;
}

.vector-toc li::marker {
  content: counters(list-item, ".") ". " !important;
}

------------------------------------------------------ */
`;


const insertStylesheet = () => {
    const stylesheetEl = document.createElement('style');
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
};

const expandLists = () => {
    const toc1 = document.querySelectorAll(".vector-toc-level-1");
    Array.from(toc1).forEach(el => {
        el.classList.add("vector-toc-list-item-expanded");
    });
}

const isUsingVector2022 = () => {
    return document.body.classList.contains("skin-vector-2022");
}

const main = () => {
    if (!isUsingVector2022()) return;

    insertStylesheet();
    expandLists();
};

main();