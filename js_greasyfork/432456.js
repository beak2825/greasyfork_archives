// ==UserScript==
// @name         Tio.run Monaco Editor
// @namespace    https://greasyfork.org/en/scripts/432456-tio-run-monaco-editor
// @version      0.3
// @description  Tio.run with Monaco Editor.
// @author       cgiosy
// @match        https://tio.run/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/432456/Tiorun%20Monaco%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/432456/Tiorun%20Monaco%20Editor.meta.js
// ==/UserScript==

'use strict';

let mainExecuted = false;

const main = () => {
    if (mainExecuted) return;
    mainExecuted = true;

    const head = document.getElementsByTagName('head')[0];

    const monacoStylesheet = document.createElement('style');
    monacoStylesheet.textContent = `
        * { cursor: inherit; }
        .monaco-editor .inputarea { background: none; }
    `;
    head.appendChild(monacoStylesheet);

    const monacoLoaderScript = document.createElement('script');
    monacoLoaderScript.defer = 'true';
    monacoLoaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/loader.js';
    monacoLoaderScript.onload = () => {
        const getLanguage = (languageId) => {
            const languages = ['abap', 'aes', 'apex', 'azcli', 'bat', 'bicep', 'c', 'cameligo', 'clojure', 'coffeescript', 'cpp', 'csharp', 'csp', 'css', 'dart', 'dockerfile', 'ecl', 'elixir', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl', 'html', 'ini', 'java', 'javascript', 'json', 'julia', 'kotlin', 'less', 'lexon', 'liquid', 'lua', 'm3', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'plaintext', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'qsharp', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala', 'scheme', 'scss', 'shell', 'sol', 'sparql', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'twig', 'typescript', 'vb', 'verilog', 'xml', 'yaml'];
            let max = 0, lang = 'cpp';
            if (!languageId) return lang;
            for (const language of languages) {
                let common = 0;
                if (languageId === language)
                    common += 10000000;
                if (languageId.split('-')[0] === language || languageId.indexOf(language) === 0)
                    common += 1000;
                for (let i = 0, j = 0; i < languageId.length; i++, j++) {
                    while (j < language.length && languageId[i] !== language[j]) j++;
                    if (j === language.length) break;
                    common++;
                }
                if (max < common) {
                    max = common;
                    lang = language;
                }
            }
            return lang;
        };

        const fn = () => {
            self.MonacoEnvironment = {
                baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/'
            };
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/base/worker/workerMain.js');
        };
        window.MonacoEnvironment = {
            getWorkerUrl: (workerId, label) => 'data:text/javascript;charset=utf-8,' + encodeURIComponent(`(${fn})()`),
        };
        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' }});

        require(['vs/editor/editor.main'], () => {
            const prevCodeEditor = document.getElementById('code');
            const prevOnInput = prevCodeEditor.oninput;
            const text = prevCodeEditor.value;

            const codeEditor = document.createElement('div');
            codeEditor.id = 'code';
            codeEditor.style = 'width: 100%;';
            codeEditor.dataset.mask = 'null';
            prevCodeEditor.replaceWith(codeEditor);

            let prevLanguage = languageId;
            const monacoEditor = monaco.editor.create(codeEditor, {
                value: text,
                language: getLanguage(prevLanguage),
                insertSpaces: false,
                tabSize: 4,
                automaticLayout: true,
                wordWrap: 'on',
                minimap: {
                    enabled: false,
                },
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                    handleMouseWheel: false,
                },
                scrollBeyondLastLine: false,
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
            });
            Object.defineProperty(codeEditor, 'value', {
                get: () => monacoEditor.getValue(),
                set: (value) => monacoEditor.setValue(value),
            });
            monacoEditor.onDidContentSizeChange(() => {
                codeEditor.style.height = monacoEditor.getContentHeight() + 'px';
                monacoEditor.layout();
            });

            const monacoEditorModel = monacoEditor.getModel();
            codeEditor.oninput = (() => {
                prevOnInput();
                if (prevLanguage === languageId) return;
                monaco.editor.setModelLanguage(monacoEditorModel, getLanguage(languageId));
                prevLanguage = languageId;
            });
            monacoEditorModel.onDidChangeContent(codeEditor.oninput);

            window.removeEventListener("beforeunload", saveState);
            byteStringToTextArea = (byteString, textArea) => {
                textArea.value = byteStringToText(byteString);
                if (textArea !== codeEditor)
                    resize(textArea);
            };
            saveState = (saveIfEmpty) => {
                if (!languageId)
                    return;
                var stateString = languageId;
                var saveTextArea = function(textArea) {
                    if (textArea.readOnly)
                        return;
                    stateString += fieldSeparator + textToByteString(textArea.value);
                }
                iterate($$("#interpreter > textarea, #code, #interpreter > :not([data-mask]) textarea"), saveTextArea);
                iterate($$("#interpreter > [data-mask=false]"), function(element) {
                    if ($("textarea", element) === null)
                        return;
                    stateString += startOfExtraFields + (element.dataset.if || element.dataset.ifNot);
                    iterate($$("textarea", element), saveTextArea);
                });
                var settings = getSettings();
                if (settings != "/")
                    stateString += startOfSettings + settings.slice(1,-1);
                if (saveIfEmpty || ! rEmptyStateString.test(stateString))
                    history.replaceState({}, "", "##" + byteStringToBase64(byteArrayToByteString(deflate(stateString))));
            };
            window.addEventListener("beforeunload", saveState);
        });

        const keyPressed = {};
        window.addEventListener('keyup', (e) => {
            keyPressed[e.key.toLowerCase()] = false;
        });
        window.addEventListener('keydown', (e) => {
            keyPressed[e.key.toLowerCase()] = true;
            if (keyPressed['control'] === true && keyPressed['s'] === true) {
                e.preventDefault();
                saveState();
                document.getElementById('run').click();
            }
        });
    };
    head.appendChild(monacoLoaderScript);
};

const scripts = [...document.querySelectorAll('script[src^="/static/"]')];
let scriptLoadCount = 0;

scripts.forEach((script) => {
    script.onload = () => ++scriptLoadCount === scripts.length && main();
});

window.onload = () => main();
