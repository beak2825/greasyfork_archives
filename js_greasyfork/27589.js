// ==UserScript==
// @name         No Comic
// @description  Removes all occurrences of Comic Sans from websites.
// @namespace    https://scrumplex.net/
// @version      0.4.2
// @match        *://*/*
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/27589/No%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/27589/No%20Comic.meta.js
// ==/UserScript==


const MATCH_FONTS = /(['"]?([\w|\s|-]+)['"]?)(?:,\s?)?/gm;
const MATCH_COMIC = /[C|c]omics?[\s|-|_][S|s]ans/gm;

function ensureStyle(elem) {
  if (elem.style.fontFamily !== elem.getAttribute("data-new-font-family")) {
    elem.style.setProperty("font-family", elem.getAttribute("data-new-font-family"), "important");
  }
}
        
function handleNewElem(elem) {
  let fontFamily = getComputedStyle(elem).fontFamily;
  
  let fonts = [];
  let changed = false;

  for (const item of fontFamily.matchAll(MATCH_FONTS)) {
    if (item[2].match(MATCH_COMIC)) {  // font name without quotes
      changed = true;
    } else {
      fonts.push(item[1]);  // font name with quotes
    }
  }

  if (changed) {
    let newFontFamily = fonts.join(", ");
    if (newFontFamily.length === 0)
      newFontFamily = "inherit";

    elem.setAttribute("data-original-font-family", fontFamily);
    elem.setAttribute("data-new-font-family", newFontFamily);
    elem.style.setProperty("font-family", newFontFamily, "important");
  }
}

function handleRecursively(element) {
  if (element != null && element.nodeType === 1) {
    handleNewElem(element);
    element.childNodes.forEach(handleRecursively);
  }
}

function init() {
  handleRecursively(document.body);
}

if (document.readyState == 'complete') {
    init();
} else {
    window.addEventListener("load", init);
}

const config = {childList: true, subtree: true, attributes: true};

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(handleRecursively);
    } else if (mutation.type === "attributes") {
      ensureStyle(mutation.target);
    }
  }
});
observer.observe(document, config);