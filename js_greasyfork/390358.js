// ==UserScript==
// @name          invidious auto-dash
// @description   Automatically appends "quality=dash" to an invidio.us URL if "the media could not be loaded"
// @author        nullgemm
// @version       0.1.6
// @grant         none
// @match         *://invidious.snopyta.org/watch?v=*
// @run-at        document-idle
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/390358/invidious%20auto-dash.user.js
// @updateURL https://update.greasyfork.org/scripts/390358/invidious%20auto-dash.meta.js
// ==/UserScript==

var elem = document.getElementsByClassName("vjs-modal-dialog-content")[0];
var url = new URL(window.location);

function mutation_callback(mutations) {
  if (elem.childNodes.length == 1) {
    url.searchParams.set("quality", "dash")
    window.location.replace(url);
  }
}

function mutation_caller(mutations, observer) {
  mutation_callback(mutations);
}

var obs = new window.MutationObserver(mutation_caller);
obs.observe(elem, {childList:true, subtree:true});