// ==UserScript==
// @name         Reload Broken Image
// @description  Search for images that didn't load on a page and if it finds, tell the browser to try to load them. You probably should only use this on some occasions, I think.
// @namespace    replbackgroundiwithimgtag
// @version      1.0.4
// @author       k3abird
// @include      *example.com*
// @downloadURL https://update.greasyfork.org/scripts/448355/Reload%20Broken%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/448355/Reload%20Broken%20Image.meta.js
// ==/UserScript==

(function loop() {
  setTimeout(function () {
    (async () => { for (const x of document.querySelectorAll("img:-moz-broken")) { x.src = x.src; await new Promise(r => setTimeout(r, 100)); console.log(x) }; console.log("done") })()
  }, 10000);
}());

(function loop() {
  setTimeout(function () {
    (async () => { for (const x of document.querySelectorAll("img")) { if (!x.naturalWidth) { x.src = x.src; await new Promise(r => setTimeout(r, 100)); console.log(x) } }; console.log("done") })()
  }, 10000);
}());