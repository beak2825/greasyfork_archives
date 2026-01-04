// ==UserScript==
// @name         Fast Textarea Replacement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace laggy textareas with lightweight editors for large text
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547571/Fast%20Textarea%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/547571/Fast%20Textarea%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTextarea(ta) {
        // Create a new editable <pre>
        let pre = document.createElement('pre');
        pre.contentEditable = true;
        pre.style.cssText = `
            white-space: pre;
            outline: none;
            border: 1px solid #ccc;
            padding: 5px;
            font-family: monospace;
            font-size: 13px;
            width: ${ta.offsetWidth}px;
            height: ${ta.offsetHeight}px;
            overflow: auto;
        `;
        pre.innerText = ta.value;

        // Sync changes back to original textarea on form submit
        ta.style.display = "none";
        ta.parentNode.insertBefore(pre, ta);

        function syncBack() {
            ta.value = pre.innerText;
        }
        pre.addEventListener("input", syncBack);
        ta.form?.addEventListener("submit", syncBack);
    }

    // Replace all textareas on page load
    document.querySelectorAll("textarea").forEach(replaceTextarea);

})();