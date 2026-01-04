// ==UserScript==
// @name         Replace Poe Prompt Input with Monaco Editor
// @name:zh-CN   把Poe聊天框变成Monaco Editor
// @namespace    your-namespace
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  1.Replace Poe chat box with Monaco Editor; 2.Allow adjusting input box height;3.Change Enter Event to Ctrl+Enter.
// @description:zh-CN  1.把Poe聊天框变成Monaco Editor; 2.可调整输入框高度; 3. 回车改为Ctrl + Enter
// @match        *://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @require      https://greasyfork.org/scripts/465571-poe-style-enhancement-font-modification-wide-screen-adaptation-and-overall-element-scaling/code/Poe%20Style%20Enhancement:%20Font%20Modification,%20Wide%20Screen%20Adaptation,%20and%20Overall%20Element%20Scaling.user.js
// @grant        none
// @license      MIT
// @author       mercutiojohn
// @downloadURL https://update.greasyfork.org/scripts/465570/Replace%20Poe%20Prompt%20Input%20with%20Monaco%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/465570/Replace%20Poe%20Prompt%20Input%20with%20Monaco%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Monaco Editor script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/loader.js';
    document.head.appendChild(script);

    script.onload = function() {
        // Load Monaco Editor modules
        window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' }});
        window.require(['vs/editor/editor.main'], function() {


            // Find the textarea element
            const textarea = document.querySelector('textarea[class^="ChatMessageInputView_textInput"]');
            document.querySelector("[class^=ChatMessageInputView_textInput__]").style.maxHeight = "unset";
            const inputEl = document.querySelector("[class^=ChatMessageInputView_textInput__]");

            // Create an input element as a draggable slider
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'heightSlider';
            slider.min = 100;
            slider.max = 500;
            slider.step = 10;
            slider.value = 300;

            // Add the input element to the page.
            const parent = inputEl.parentNode;
            parent.insertBefore(slider, inputEl);
            // let height = 300;
            let height = slider.value;
            inputEl.style.height = height + "px";

            // create a new div to replace it
            const editorContainer = document.createElement('div');
            // editorContainer.style.width = textarea.offsetWidth + 'px';
            editorContainer.style.width = '100%';
            editorContainer.style.height = textarea.offsetHeight + 'px';
            editorContainer.style.border = '1.11px solid #000';
            editorContainer.style.borderRadius = '10px';
            editorContainer.style.overflow = 'hidden';
            editorContainer.style.position = 'absolute';

            // Replace the textarea element with the editor container
            textarea.parentNode.insertBefore(editorContainer, textarea);
            // textarea.style.display = 'none';

            const button = document.querySelector('.ChatMessageInputView_sendButton__reEpT');

            // Create the Monaco Editor instance
            const editor = window.monaco.editor.create(editorContainer, {
                value: textarea.value,
                language: 'markdown',
                theme: 'vs',
                fontFamily: 'Fira Code, MiSans, Consolas, monaco, monospace',
                lineNumbers:'off',
                fontSize: 16,
                lineHeight: 1.2,
                minimap: {
                    enabled: true
                }
            });

            // Update the textarea value when the editor contents change
            editor.onDidChangeModelContent(function(event) {
                textarea.value = editor.getValue();
            });

            // Add keybinding to trigger Enter event when Ctrl+Enter is pressed
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
                console.log("[Ctrl+Enter]");
                const event = new KeyboardEvent('keydown', { keyCode: 13, bubbles: true });
                textarea.dispatchEvent(event);
                setTimeout(()=>{
                    editor.setValue('');
                },5);
            });

            // Update the editor container size when the textarea size changes
            const resizeObserver = new ResizeObserver(function(entries) {
                for (let entry of entries) {
                    if (entry.target === textarea) {
                        editorContainer.style.width = entry.target.offsetWidth + 'px';
                        editorContainer.style.height = entry.target.offsetHeight + 'px';
                        editor.layout();
                    }
                }
            });
            resizeObserver.observe(textarea);

            // Update the editor container size when the textarea size changes
            slider.addEventListener('input', function(event) {
                const height = event.target.value;
                inputEl.style.height = height + "px";
                // editor.layout();
            });
        });
    };

})();