// ==UserScript==
// @name Replaces the X logo with the old Twitter logo
// @description Replaces the X logo with the old Twitter logo by Biast12
// @icon https://abs.twimg.com/favicons/twitter.ico
// @version 1.0.4
// @author Biast12
// @namespace https://twitter.com/Biast12
// @homepageURL https://gist.github.com/biast12/04f66af3297b9395ec489f7eb16a9286
// @supportURL https://gist.github.com/biast12/04f66af3297b9395ec489f7eb16a9286
// @contributionURL https://www.paypal.com/donate/?hosted_button_id=RWB2QFK7CKUM2
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include https://twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/471636/Replaces%20the%20X%20logo%20with%20the%20old%20Twitter%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/471636/Replaces%20the%20X%20logo%20with%20the%20old%20Twitter%20logo.meta.js
// ==/UserScript==

(function() {
let css = `
[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"] {
    d: path("M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z")
}
[aria-label="Loading…"] g {
    color: rgb(29, 155, 240);
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

var favicon_link_html = document.createElement("link");
favicon_link_html.rel = "shortcut icon";
favicon_link_html.href = "https://abs.twimg.com/favicons/twitter.ico";
favicon_link_html.type = "image/x-icon";

try {
  document.getElementsByTagName("head")[0].appendChild( favicon_link_html );
}
catch(e) { }

function fixTitle() {
  var title = document.title;

  if (title === "X") {
    document.title = "Twitter";
  }

  if (title.endsWith("/ X")) {
    var new_title = title.slice(0, -3) + "/ Twitter";
    document.title = new_title;
  }
}

window.addEventListener("load", function () {
  new MutationObserver(function (mutations) {
    // Ignore changes to <head> apart from when <title> is added
    if (
      !mutations.some((mutation) =>
        [...mutation.addedNodes].some((node) => node.nodeName === "TITLE"),
      )
    )
      return;

    // Fix initially added title
    fixTitle();

    // Watch the new title element for any change now it exists
    new MutationObserver(function () {
      fixTitle();
    }).observe(document.querySelector("title"), {
      characterData: true,
      attributes: true,
      childList: true,
      subtree: true,
    });
  }).observe(document.querySelector("head"), { childList: true });
});