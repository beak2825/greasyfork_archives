// ==UserScript==
// @name         Enable Tab Character Inside Textarea
// @namespace    userscript
// @version      1.0
// @description  Allows you to type Tab character to textarea (Multi-line text box)
// @author       Anonymous, YFdyh000
// @include      http*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32606/Enable%20Tab%20Character%20Inside%20Textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/32606/Enable%20Tab%20Character%20Inside%20Textarea.meta.js
// ==/UserScript==

// https://jsfiddle.net/2wAzx/13/
function enableTab(el) {
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}
for (let el of document.querySelectorAll('textarea')) {
    enableTab(el);
}
