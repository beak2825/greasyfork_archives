// ==UserScript==
// @name         glitch-theme-VORTEX
// @version      1
// @match        https://glitch.com/edit/
// @grant        GM_addStyle
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @description Tema VORTEX para glitch.com
// @downloadURL https://update.greasyfork.org/scripts/403108/glitch-theme-VORTEX.user.js
// @updateURL https://update.greasyfork.org/scripts/403108/glitch-theme-VORTEX.meta.js
// ==/UserScript==

window.onload = () => GM_addStyle(`
::-webkit-scrollbar {
border: 12px solid rgba(10, 13, 20, 0.4); width: 12px; height: 12px;
}

.CodeMirror-vscrollbar {
margin-right: 5.51px;
}

.CodeMirror-hscrollbar {
margin-bottom: 5.51px;
}

::-webkit-scrollbar-thumb {
border: 12px solid rgba(222, 231, 255, 0.15);
}

* {
color: #e8e8e8;
  --variable-shim-pop-shadow: 0px 2px 10px rgba(0, 0, 0, 0.6);
  --variable-shim-line-on-secondary-background: none;
  --variable-shim-secondary-background-active: none;
  --variable-shim-secondary-background-hover: none;
  --variable-shim-secondary-background-hover: none;
  --variable-shim-section-line: none;
  --variable-shim-input-border: none;
  --variable-shim-primary-background: #1d1f2b;
  --variable-shim-secondary-background: none;
  --variable-shim-primary: none;
  --variable-shim-tertiary: none;
  --variable-shim-secondary: none;
}

.CodeMirror, .CodeMirror-gutters {
  background-color: #13141a !important;
  color: #f8f8f2 !important;
}

.CodeMirror .CodeMirror-gutters {
  color: #13141a; //282a36
}

.CodeMirror .CodeMirror-cursor {
  border-left: solid thin #f8f8f0;
}

.CodeMirror .CodeMirror-linenumber {
  color: #585f75;
}

.CodeMirror .CodeMirror-selected {
  background: rgba(255, 255, 255, 0.10);
}

.CodeMirror .CodeMirror-line::selection, .cm-s-dracula .CodeMirror-line > span
::selection, .cm-s-dracula .CodeMirror-line > span > span::selection {
  background: rgba(255, 255, 255, 0.10);
}

.CodeMirror .CodeMirror-line
::-moz-selection, .cm-s-dracula .CodeMirror-line > span::-moz-selection, .cm-s-dracula .CodeMirror-line > span > span
::-moz-selection {
  background: rgba(255, 255, 255, 0.9);
}
.CodeMirror span.cm-comment {
  color: #6272a4;
}
.CodeMirror span.cm-string, .cm-s-dracula span.cm-string-2 {
  color: #f1fa8c;
}

.CodeMirror span.cm-number {
  color: #bd93f9;
}
.CodeMirror span.cm-variable {
  color: #50fa7b;
}

.CodeMirror span.cm-variable-2 {
  color: white;
}

.CodeMirror span.cm-def {
  color: #50fa7b;
}

.CodeMirror span.cm-operator {
  color: #6b0d43; //ff79c6
}
.CodeMirror span.cm-keyword {
 color: #6b0d43; //ff79c6
}

.CodeMirror span.cm-atom {
  color: #bd93f9;
}
.CodeMirror span.cm-meta { color: #f8f8f2; }

.CodeMirror span.cm-tag { color: #ff79c6; } //ff79c6

.CodeMirror span.cm-attribute { color: #50fa7b; }

.CodeMirror span.cm-qualifier { color: #50fa7b; }

.CodeMirror span.cm-property { color: #66d9ef; }

.CodeMirror span.cm-builtin { color: #50fa7b; }

.CodeMirror span.cm-variable-3, .cm-s-dracula span.cm-type { color: #ffb86c; }

.CodeMirror .CodeMirror-activeline-background { background: rgba(255,255,255,0.1); }

.CodeMirror .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }

header { background: #16161c; }

.editor-helper { background: #282a36; }

.pop-over, #tools-pop-button, #new-file, #share-project, #switch-project, #remix-project, #new-project, .button-small,

.icon-collapse, .button-wrap button { box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.6); }

.icon-collapse { opacity: 1; border-radius: 5px; }

.sidebar .sidebar-section:nth-child(1) { border-bottom: 1px solid #16161c; }

.pop-over section .input-wrap input { border-bottom: 1px solid #595a5e; }

.search-input, .CodeMirror-search-field { border-color: transparent; }`);