// ==UserScript==
// @name         Block Visibility Detections
// @namespace    http://twitter.com/D4D4K
// @version      0.1.02
// @description  switch between tabs without informing sites
// @author       Dadak
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416882/Block%20Visibility%20Detections.user.js
// @updateURL https://update.greasyfork.org/scripts/416882/Block%20Visibility%20Detections.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

var s = document.createElement('script');
s.textContent =
  '(function() {' +
  'var a = Node.prototype.addEventListener;' +
  'Node.prototype.addEventListener = function(e) {' +
  "if (e !== 'visibilitychange' && e !== 'webkitvisibilitychange') {" +
  'a.apply(this, arguments)' +
  '}}' +
  '})()'
;
(document.head || document.documentElement).appendChild(s);
s.remove();

Object.defineProperty(document, "hidden", { value : false});

for (var event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
  window.addEventListener(event_name, function(event) {
        event.stopImmediatePropagation();
    }, true);
}