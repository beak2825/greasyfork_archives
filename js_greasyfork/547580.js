// ==UserScript==
// @name         Prose-Friendly Textarea Virtualizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces all textareas with a clean, writer-focused CodeMirror editor.
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
// @downloadURL https://update.greasyfork.org/scripts/547580/Prose-Friendly%20Textarea%20Virtualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/547580/Prose-Friendly%20Textarea%20Virtualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject the CodeMirror CSS
    const cmCss = GM_getResourceText("CM_CSS");
    GM_addStyle(cmCss);
    // Add the fold gutter CSS
    GM_addStyle(`
        .CodeMirror-foldgutter-open,
        .CodeMirror-foldgutter-folded {
            cursor: pointer;
        }
    `);

    // 2. Function to turn a textarea into a writer-friendly editor
    function virtualizeTextarea(textarea) {
        if (textarea.dataset.cmInitialized) {
            return;
        }
        textarea.dataset.cmInitialized = 'true';

        const editor = CodeMirror.fromTextArea(textarea, {
            mode: null,
            lineNumbers: false,
            lineWrapping: true,
            spellcheck: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        editor.on('focus', () => {
            editor.refresh();
        });
    }

    // 3. Virtualize existing textareas
    document.querySelectorAll('textarea').forEach(virtualizeTextarea);

    // 4. Watch for dynamically added textareas
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

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
