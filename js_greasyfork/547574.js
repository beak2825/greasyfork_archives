// ==UserScript==
// @name         Fast Code Editor for Textareas
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace laggy textareas with Monaco editor for code-like input
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547574/Fast%20Code%20Editor%20for%20Textareas.user.js
// @updateURL https://update.greasyfork.org/scripts/547574/Fast%20Code%20Editor%20for%20Textareas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Monaco from CDN
    function loadMonaco(callback) {
        if (window.monaco) return callback();
        let loader = document.createElement("script");
        loader.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js";
        loader.onload = () => {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
            require(['vs/editor/editor.main'], callback);
        };
        document.head.appendChild(loader);
    }

    function replaceTextarea(ta) {
        // Skip if already replaced
        if (ta.dataset.monacoApplied) return;
        ta.dataset.monacoApplied = "true";

        // Detect if text "looks like code"
        let val = ta.value || "";
        let looksLikeCode = /[{;}=]|function|\n\s*\w+\(/.test(val);
        if (!looksLikeCode) return; // only replace code-like content

        // Create container
        let div = document.createElement("div");
        div.style.width = ta.offsetWidth + "px";
        div.style.height = ta.offsetHeight + "px";
        ta.style.display = "none";
        ta.parentNode.insertBefore(div, ta);

        // Load Monaco
        loadMonaco(() => {
            let editor = monaco.editor.create(div, {
                value: ta.value,
                language: "javascript", // default, can be smarter
                theme: "vs-dark",
                automaticLayout: true,
                fontSize: 13,
                minimap: { enabled: false }
            });

            // Sync back on form submit
            function syncBack() {
                ta.value = editor.getValue();
            }
            editor.onDidChangeModelContent(syncBack);
            ta.form?.addEventListener("submit", syncBack);
        });
    }

    // Replace all textareas on page load
    document.querySelectorAll("textarea").forEach(replaceTextarea);

})();