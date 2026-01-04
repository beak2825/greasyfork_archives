// ==UserScript==
// @name        China? Sounds more like my ex-wife!!
// @namespace   hilarious_hijinx
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @version     1.3
// @author      stinx
// @description Inspired by a tweet by Dan Boeckner (https://twitter.com/DanBoeckner/status/1384018553817374721), replace all instances of "China" with "my ex-wife."
// @downloadURL https://update.greasyfork.org/scripts/425261/China%20Sounds%20more%20like%20my%20ex-wife%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/425261/China%20Sounds%20more%20like%20my%20ex-wife%21%21.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const matcher = /\b(the\s+)?(china|chinese)\b/gi;

/**
 * @param {string?} text
 */
function getReplacement(text) {
  if (!text) return text;
  return text.replaceAll(matcher, (_substr, p1, p2) => {
    const replacement = p1 === "The" ? "My ex-wife" : "my ex-wife";
    if (/chinese/i.test(p2)) return `${replacement}'s`;
    return replacement;
  });
}

/**
 * @param {Node} node
 */
function replaceNode(node) {
  if (matcher.test(/** @type string */ (node.textContent))) {
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (n) =>
          matcher.test(/** @type string */ (n.textContent))
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT,
      },
      false
    );

    let childNode;
    while ((childNode = walker.nextNode())) {
      childNode.textContent = getReplacement(childNode.textContent);
    }
  }
}

function replaceAndWatch() {
  if (matcher.test(document.title)) {
    document.title = /** @type string */ (getReplacement(document.title));
  }

  replaceNode(document.body);

  const observer = new MutationObserver((mutList) => {
    for (const mut of mutList) replaceNode(mut.target);
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(replaceAndWatch, 1);
} else {
  document.addEventListener("DOMContentLoaded", replaceAndWatch);
}
