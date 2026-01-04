// ==UserScript==
// @name         Block Visibility Detections/Stop visibility tracking
// @description  Some shitty sites track you to know when you are on that given tab, this script fools the site making it to think you are always with that given tab focused.
// @include        *
// @version      1.0
// @namespace https://greasyfork.org/users/927418
// @downloadURL https://update.greasyfork.org/scripts/447836/Block%20Visibility%20DetectionsStop%20visibility%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/447836/Block%20Visibility%20DetectionsStop%20visibility%20tracking.meta.js
// ==/UserScript==


let events_to_block = [
  "visibilitychange",
  "webkitvisibilitychange",
  "mozvisibilitychange",
  "hasFocus",
  "blur",
  "focus",
  "mouseleave"
]

for (event_name of events_to_block) {
  document.addEventListener(event_name, function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }, true);
}

for (event_name of events_to_block) {
  window.addEventListener(event_name, function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }, true);
}


document.hasFocus = function () { return true; };
document.onvisibilitychange = null;
Object.defineProperty(document, "visibilityState", { value: "visible" });
Object.defineProperty(document, "hidden", { value: false });
Object.defineProperty(document, "mozHidden", { value: false });
Object.defineProperty(document, "webkitHidden", { value: false });
Object.defineProperty(document, "webkitVisibilityState", { value: "visible" });







window.addEventListener('WheelEvent', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('visibilitychange', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('blur', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('mouseleave', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('mouseEvent', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('mouseEvent.button', function (event) { event.stopImmediatePropagation(); }, true);
window.addEventListener('keypress', function (event) { event.stopImmediatePropagation(); }, true);


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