// ==UserScript==
// @name         Runestone Monaco
// @namespace    https://balt.sno.mba
// @version      1.0
// @description  Makes Runestone use the Monaco Editor.
// @author       Heptor44
// @match        https://runestone.academy/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458572/Runestone%20Monaco.user.js
// @updateURL https://update.greasyfork.org/scripts/458572/Runestone%20Monaco.meta.js
// ==/UserScript==

var _bind = Function.prototype.apply.bind(Function.prototype.bind);
Object.defineProperty(Function.prototype, 'bind', {
    value: function(obj) {
        var boundFunction = _bind(this, arguments);
        boundFunction.boundObject = obj;
        return boundFunction;
    }
});
window.addEventListener('load', function() {
    let script = document.createElement("script");
    script.onload = function () {
        document.querySelectorAll(".CodeMirror").forEach(parent => {
            let language = parent.parentNode.parentNode.lang;
            let runButton = parent.parentElement.parentElement.querySelector(".ac_actions").querySelector(".btn");
            let boxReference = runButton.onclick.boundObject;
            let program = boxReference.editor.getValue();
            parent.innerHTML = "";
            parent.style.overflow = "auto";
            parent.style.resize = "vertical";
            require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
            window.MonacoEnvironment = { getWorkerUrl: () => proxy };

            let proxy = URL.createObjectURL(new Blob([`self.MonacoEnvironment={baseUrl:"https://unpkg.com/monaco-editor@latest/min/"},importScripts("https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js");`], { type: 'text/javascript' }));

            require(["vs/editor/editor.main"], function () {
                var editor = monaco.editor.create(parent, {
                    value: program,
                    language: language,
                    theme: 'vs-' + document.documentElement.getAttribute("data-theme"),
                    automaticLayout: true
                });
                boxReference.editor = editor;
            });
        });
    };
    script.src = "https://unpkg.com/monaco-editor@latest/min/vs/loader.js";
    document.head.appendChild(script);
}, false);