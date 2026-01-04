// ==UserScript==
// @name          Always on focus
// @namespace     
// @description   Prevent websites from knowing that you switched tabs
// @author        me
// @version       1.1
// @description   Trick websites into thinking the tab is always on focus
// @include       *
// @run-at        document-start
// @license       Balls
// @downloadURL https://update.greasyfork.org/scripts/445714/Always%20on%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/445714/Always%20on%20focus.meta.js
// ==/UserScript==

unsafeWindow.onblur = null;
unsafeWindow.blurred = false;

unsafeWindow.document.hasFocus = function () {return true;};
unsafeWindow.window.onFocus = function () {return true;};

Object.defineProperty(document, "hidden", { value : false});
Object.defineProperty(document, "mozHidden", { value : false});
Object.defineProperty(document, "msHidden", { value : false});
Object.defineProperty(document, "webkitHidden", { value : false});
Object.defineProperty(document, 'visibilityState', { get: function () { return "visible"; } });

unsafeWindow.document.onvisibilitychange = undefined;

for (event_name of ["visibilitychange",
                    "webkitvisibilitychange",
                    "blur", // may cause issues on some websites
                    "mozvisibilitychange",
                    "msvisibilitychange"]) {
  window.addEventListener(event_name, function(event) {
        event.stopImmediatePropagation();
    }, true);
}
