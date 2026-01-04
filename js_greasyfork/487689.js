// ==UserScript==
// @name         aws ext
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  aws ext.
// @author       You
// @match        https://*.hromo.cn/r/w?sid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hromo.cn
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/show-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/anyword-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/javascript-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/html-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/sql-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/xml-hint.js
// @require     https://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/css-hint.js
// @resource     showHintCSShttps://mdm-test.hromo.cn/commons/plug-in/CodeMirror/5.58.3/addon/hint/show-hint.css
// @downloadURL https://update.greasyfork.org/scripts/487689/aws%20ext.user.js
// @updateURL https://update.greasyfork.org/scripts/487689/aws%20ext.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var showHintCSS = GM_getResourceText('showHintCSS');
    // GM_addStyle(showHintCSS);


    GM_addStyle(`
.CodeMirror-hints {
 z-index: 9999999 !important;
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;

  margin: 0;
  padding: 2px;

  -webkit-box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  -moz-box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  border-radius: 3px;
  border: 1px solid silver;

  background: white;
  font-size: 90%;
  font-family: monospace;

  max-height: 20em;
  overflow-y: auto;
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 4px;
  border-radius: 2px;
  max-width: 19em;
  overflow: hidden;
  white-space: pre;
  color: black;
  cursor: pointer;
}

li.CodeMirror-hint-active {
  background: #08f;
  color: white;
}
    `);

    function enableAutocomplete(editor) {
        editor.setOption("extraKeys", {
            "Ctrl-Space": "autocomplete"
        });
        editor.setOption("autoCloseBrackets", true);
        editor.setOption("lineWrapping", true);
        editor.on("inputRead", function(cm, event) {
            if (!cm.state.completionActive && event.text[0].match(/[^\s]/)) {
                CodeMirror.commands.autocomplete(cm, null, {
                    completeSingle: false
                });
            }
        });
    }

    function findAndEnableCodeMirror() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const possibleCodeMirrorEditors = document.querySelectorAll('.CodeMirror');
            possibleCodeMirrorEditors.forEach(editorElement => {
                if (editorElement.CodeMirror) {
                    enableAutocomplete(editorElement.CodeMirror);
                }
            });
        });
    }

    function observeDOMChanges() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    findAndEnableCodeMirror();
                }
            });
        });

        var config = {
            childList: true,
            subtree: true
        };

        var target = document.body;

        observer.observe(target, config);
    }

    // findAndEnableCodeMirror();
    observeDOMChanges();
})();