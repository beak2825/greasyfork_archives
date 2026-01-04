// ==UserScript==
// @name          OmniFocus
// @namespace     https://greasyfork.org/en/users/198860-zyenith
// @author        zyenith
// @version       0.0.1
// @description   Make sure websites always think you are focused on them
// @match         *://*/*
// @run-at        document-start
// @grant         unsafeWindow
// @antifeature   Tracking, for compatibility info
// @require       https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/456851/OmniFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/456851/OmniFocus.meta.js
// ==/UserScript==

const { document } = unsafeWindow;

unsafeWindow.onblur = null;
unsafeWindow.blurred = false;

unsafeWindow.document.hasFocus = function() {
    return true;
};

unsafeWindow.document.onvisibilitychange = undefined;

const _arr = ["visibilitychange", "webkitvisibilitychange", "blur", "mozvisibilitychange", "msvisibilitychange"];
for (const eventName of _arr) {
    unsafeWindow.document.addEventListener(eventName, (event) => {
        event.stopImmediatePropagation();
    }, true);
}

Object.defineProperties(unsafeWindow.document, {
    hidden: {
        value: false
    },
    mozHidden: {
        value: false
    },
    msHidden: {
        value: false
    },
    webkitHidden: {
        value: false
    },
    visibilityState: {
        get() {
            return "visible";
        }
    }
});
