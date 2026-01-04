// ==UserScript==
// @name        Shorten Names for Proving for Fun
// @namespace   do-proof-in-tum-de-addons
// @match       https://do.proof.in.tum.de/*
// @grant       none
// @version     0.1
// @author      Max Lang
// @license     0BSD
// @description Hide annoyingly long names.
// @downloadURL https://update.greasyfork.org/scripts/455518/Shorten%20Names%20for%20Proving%20for%20Fun.user.js
// @updateURL https://update.greasyfork.org/scripts/455518/Shorten%20Names%20for%20Proving%20for%20Fun.meta.js
// ==/UserScript==


(function() {

  const rules = [
    [".navbar-text strong", /(\S+)/d],
    [".scoretnb, .scoretn", /(\S+)/d],
    [".container div", /Submitted by (\S+) @/d]
  ];

  for (const [selector, pattern] of rules) {
    for (const el of document.querySelectorAll(selector)) {
      for (const child of [...el.childNodes]) {
        if (child.nodeType != 3) continue;
        const match = child.textContent.match(pattern);
        if (match === null) continue;

        const span = document.createElement("span");
        const spanText = child.textContent.substring(...match.indices[1]);
        span.textContent = spanText;
        span.title = spanText;

        span.style.display = "inline-block";
        span.style.width = "10em";
        span.style.overflow = "hidden";
        span.style.textOverflow = "ellipsis";
        span.style.verticalAlign = "bottom";

        child.replaceWith(
          child.textContent.substring(0, match.indices[1][0]),
          span,
          child.textContent.substring(match.indices[1][1])
        );
      }
    }
  }

})();
