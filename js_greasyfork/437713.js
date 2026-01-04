// ==UserScript==
// @name         Vim Mode for OpenProcessing
// @namespace    https://gist.github.com/sflanker/cab8e86bf29b221017f58ac2df42cdf7#file-openprocessing_codemirror_vim-user-js
// @version      0.2
// @description  Vim mode in code mirror (openprocessing)
// @author       dragulceo, sflanker
// @license      unlicense
// @match        https://openprocessing.org/sketch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437713/Vim%20Mode%20for%20OpenProcessing.user.js
// @updateURL https://update.greasyfork.org/scripts/437713/Vim%20Mode%20for%20OpenProcessing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Enabling Vim Mode for OpenProcessing!');

    let tries = 0;
    const MAX_TRIES = 1000;
    const RETRY_EVERY_MS = 1000;

    const scr = document.createElement('script');
    scr.src='https://www.openprocessing.org/assets/js/vendor/node_modules/codemirror/keymap/vim.js';
    document.head.appendChild(scr);


    function enableVimMode() {
        console.log('enableVim');
        let enabled = false;
        if(window.jQuery && window.CodeMirror && window.CodeMirror.Vim) {
            var editors = window.jQuery('.CodeMirror');
            if(editors && editors[0] && editors[0].CodeMirror) {
                var editor = editors[0].CodeMirror;
                if(editor) {
                    editor.setOption('keyMap', 'vim');
                    editor.setOption('showCursorWhenSelecting', true);
                    enabled = true;
                }
            }
            if (!window.hasVimStylesheet) {
                let vimStyles = document.createElement('style');
                document.head.appendChild(vimStyles);
                vimStyles.type = 'text/css';
                vimStyles.appendChild(document.createTextNode(
                    '.cm-fat-cursor .CodeMirror-cursor { width: auto !important; border: none !important; }\n' +
                    '.cm-s-neo.cm-fat-cursor .CodeMirror-cursor { background-color: rgba(0, 0, 128, 0.5) !important; }\n' +
                    // '.cm-s-neo.cm-fat-cursor .CodeMirror-cursor { background-color: rgba(255, 255, 255, 0.5); }\n' +
                    '#codePanel .CodeMirror-dialog-bottom { background: #333; top: unset; bottom: 0; left: 0; width: calc(100% - 15px); display: flex; transform: none; box-shadow: unset; border-radius: unset; }\n' +
                    '#codePanel .CodeMirror-dialog span:first-child { padding-left: 0.5em; flex-grow: 1; color: white; }\n' +
                    '#codePanel .CodeMirror-dialog input { width: calc(100% - 1em); background-color: transparent; border: none; padding-left: 4px; }'
                ));
                window.hasVimStylesheet = true;
            }
        }
        tries++;
        if(!enabled && tries < MAX_TRIES) {
            setTimeout(enableVimMode, RETRY_EVERY_MS);
        }
    }

    enableVimMode();
})();