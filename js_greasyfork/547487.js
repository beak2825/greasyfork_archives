// ==UserScript==
// @name         ContentScript for TM1
// @namespace    https://greasyfork.org/en/scripts/547487-contentscript-for-tm1
// @version      v1.02
// @description  Tool for TM1 for copying and pasting, works in IBM IFRS9 and Forecast Tool
// @author       Euan
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547487/ContentScript%20for%20TM1.user.js
// @updateURL https://update.greasyfork.org/scripts/547487/ContentScript%20for%20TM1.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.documentElement.addEventListener("tm1webPaste", function(evt) {
    evt.preventDefault();
    window.wrappedJSObject.detail = "";

    if (navigator.clipboard) {
        navigator.clipboard.readText().then(function(clipText) {dispatchPasteRespond(evt, clipText);});
    } else {
        var clipText = "";
        document.addEventListener('paste', function pasteHandler(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            clipText = evt.clipboardData.getData('text/plain');
            document.removeEventListener('paste', pasteHandler, true);
        }, true);
        document.execCommand("paste");

        // Use Promise to prevent "tm1webPasteResponse" event is sent out before it's listener is enabled to capture the event.
        // On TM1Web side(/tm1web/utility/clipboard.js), listener for "tm1webPasteResponse" is only enabled after
        // dispatchEvent("tm1Paste") returns false, which means all listener for "tm1Paste" needs to finish/return before
        // the dispatch of the repsonse.
        Promise.resolve(clipText).then(function(clipText) {dispatchPasteRespond(evt, clipText);});
    }
}, false);

document.documentElement.addEventListener("tm1webCopy", function(evt) {
    evt.preventDefault();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(evt.detail.value);
    } else {
        var valueToCopy = evt.detail.value;
        document.addEventListener('copy', function copyHandler(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.clipboardData.setData('text/plain', valueToCopy);
            document.removeEventListener('copy', copyHandler, true);
        }, true);
        document.execCommand('copy');
    }
});

function dispatchPasteRespond(event, clipText) {
    window.wrappedJSObject.detail = {value: clipText};
    document.documentElement.dispatchEvent(new CustomEvent("tm1webPasteResponse" + event.timeStamp, {
        bubbles: false,
        cancelable: true,
        detail: window.wrappedJSObject.detail
    }));
}
})();