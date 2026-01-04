// ==UserScript==
// @name         Vim Mode for editor.p5js.org
// @namespace    https://gist.github.com/sflanker/85899dd893f60ff47f52efd56765d5ec#file-vim-mode-editor-p5js-org-js
// @version      0.2
// @description  Vim mode in code mirror (p5js.org)
// @author       dragulceo, sflanker
// @license      unlicense
// @match        https://editor.p5js.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437714/Vim%20Mode%20for%20editorp5jsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/437714/Vim%20Mode%20for%20editorp5jsorg.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Enabling Vim Mode for p5js.org!');

  let tries = 0;
  const MAX_TRIES = 1000;
  const RETRY_EVERY_MS = 1000;

  let hasVimJs = false;
  let hasVimStylesheet = false;

  function enableVimMode() {
    console.log('enableVim');
    let enabled = false;
    const editors = document.querySelectorAll('.CodeMirror');
    if(editors && editors[0] && editors[0].CodeMirror) {
      // p5js.org privately imports CodeMirror
      if (!window.CodeMirror) {
        console.log('Exporting CodeMirror globally');
        window.CodeMirror = editors[0].CodeMirror.constructor;
      }

      if (!window.CodeMirror.Vim || !window.CodeMirror.keyMap.vim) {
        if (!hasVimJs) {
          // Install vim keymap extension
          console.log('Installing vim keymap JavaScript.');
          const vimScript = document.createElement('script');
          vimScript.src='https://cdn.jsdelivr.net/npm/codemirror@5.58.2/keymap/vim.js';
          vimScript.crossorigin = 'anonymous';
          document.head.appendChild(vimScript);
          hasVimJs = true;
        } else {
          console.log('Waiting for vim keymap installation.');
        }
      } else {
        const editor = editors[0].CodeMirror;
        if(editor) {
          editor.setOption('keyMap', 'vim');
          editor.setOption('showCursorWhenSelecting', true);
          enabled = true;
          console.log ('Vim keymap successfully enabled.');
        }
      }
    } else {
      console.log('CodeMirror editor not found.');
    }
    if (!hasVimStylesheet) {
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
      hasVimStylesheet = true;
    }
    tries++;
    if(!enabled && tries < MAX_TRIES) {
      setTimeout(enableVimMode, RETRY_EVERY_MS);
    }
  }

  enableVimMode();
})();