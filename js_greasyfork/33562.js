// ==UserScript==
// @name Firefox 57+ autohide scrollbars
// @namespace
// @match *://*/*
// @grant none
// @version 0.111
// @description Autohide scrollbars solution for Firefox 57+ WebExtensions obstacles. Tips for tweaks are appreciated :) source: https://www.reddit.com/r/firefox/comments/6v6otw/webex_replacement_for_hidescrollbars/
// @namespace https://greasyfork.org/users/8770
// @downloadURL https://update.greasyfork.org/scripts/33562/Firefox%2057%2B%20autohide%20scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/33562/Firefox%2057%2B%20autohide%20scrollbars.meta.js
// ==/UserScript==

var HSB_timer;
function HSB_hideScrollbar(){
  var s = document.getElementById('HSB_css');
  if (!s) {
    s = document.createElement('style');
    s.id = 'HSB_css';
    document.body.appendChild(s);
  }
  s.appendChild(document.createTextNode('html, body {overflow-y: hidden !important;}'));
}
function HSB_showScrollbar(){
  var s = document.getElementById('HSB_css');
  if (s && s.childNodes.length > 0) s.firstChild.remove();
  if (HSB_timer) window.clearTimeout(HSB_timer);
  HSB_timer = window.setTimeout(HSB_hideScrollbar, 1000);
}
document.addEventListener("wheel", HSB_showScrollbar, false);
HSB_hideScrollbar();