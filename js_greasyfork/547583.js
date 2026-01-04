// ==UserScript==
// @name         Prose-Friendly Textarea Virtualizer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces all textareas with a clean, writer-focused CodeMirror editor (supports all keyboards & paste methods). 
// @author       You
// @match        *://*/*
// @resource     CM_CSS https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldcode.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/foldgutter.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/brace-fold.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/xml-fold.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/indent-fold.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/markdown-fold.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/fold/comment-fold.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/547583/Prose-Friendly%20Textarea%20Virtualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/547583/Prose-Friendly%20Textarea%20Virtualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CodeMirror CSS
    const cmCss = GM_getResourceText("CM_CSS");
    GM_addStyle(cmCss);
    GM_addStyle(`
        .CodeMirror-foldgutter-open,
        .CodeMirror-foldgutter-folded {
            cursor: pointer;
        }
    `);

    function virtualizeTextarea(textarea) {
        if (textarea.dataset.cmInitialized) return;
        textarea.dataset.cmInitialized = 'true';

        const editor = CodeMirror.fromTextArea(textarea, {
            mode: null,
            lineNumbers: false,
            lineWrapping: true,
            spellcheck: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        // Refresh rendering when focused
        editor.on('focus', () => editor.refresh());

        // --- Sync CM → textarea ---
        editor.on('change', () => {
            const val = editor.getValue();
            if (textarea.value !== val) {
                textarea.value = val;
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });

        // --- Sync textarea → CM ---
        function syncFromTextarea() {
            const val = textarea.value;
            if (val !== editor.getValue()) {
                editor.setValue(val);
            }
        }

        // Covers SwiftKey, Gboard, Samsung Keyboard, iOS, etc.
        textarea.addEventListener('input', syncFromTextarea);

        // Covers Ctrl+V, right-click paste, long-press paste
        textarea.addEventListener('paste', () => {
            // Defer to let the paste actually happen first
            setTimeout(syncFromTextarea, 0);
        });

        // Extra safety: observe .value changes (some IMEs & scripts bypass events)
        const observer = new MutationObserver(syncFromTextarea);
        observer.observe(textarea, { attributes: true, attributeFilter: ['value'] });
    }

    // Virtualize existing textareas
    document.querySelectorAll('textarea').forEach(virtualizeTextarea);

    // Watch for dynamically added textareas
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'TEXTAREA') {
                        virtualizeTextarea(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('textarea').forEach(virtualizeTextarea);
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();