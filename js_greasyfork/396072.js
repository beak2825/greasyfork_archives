// ==UserScript==
// @name        Google Docs Clean Night Mode
// @namespace   english
// @description A dark version of google docs that is much cleaner than anything you would ever imagine! Now you can write without hurting your eyes, while not cringing at horrible black/white borders!
// @include     http*://*docs.google.com*
// @version     1.0
// @run-at 
// @grant       
// @downloadURL https://update.greasyfork.org/scripts/396072/Google%20Docs%20Clean%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/396072/Google%20Docs%20Clean%20Night%20Mode.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                       #docs-editor {/*\n*//*\n*/    background: #3b3b3b  !important  ;/*\n*/ /*\n*//*\n*/}#docs-editor-container {/*\n*//*\n*/    background: #2a2a2a  !important  ;/*\n*/ /*\n*//*\n*/}body {/*\n*//*\n*/    background-color: #292929  !important  ;/*\n*/    /*\n*//*\n*/}#contents{background-color: #292929  !important  ;}#docs-chrome {/*\n*/    background: #d8d8d8  !important  ;/*\n*/  /*\n*/}.docs-material #docs-header .docs-titlebar-buttons {/*\n*/     background-color: #d8d8d8  !important  ;/*\n*/  /*\n*/}.docs-material #docs-toolbar-wrapper {/*\n*/    border-top: 1px solid #c9c9c9  !important  ;/*\n*/    border-bottom: 1px solid #c9c9c9  !important  ;/*\n*/    background: #c9c9c9  !important  ;/*\n*/  /*\n*/}.docs-material .goog-toolbar-button, .docs-material .goog-toolbar-combo-button, .docs-material .goog-toolbar-menu-button {/*\n*/   /*\n*/    background-color: #c9c9c9  !important  ;/*\n*/   /*\n*/} .docs-title-input {   background-color: #bdbdbd;} .docs-horizontal-ruler {/*\n*/    border-bottom: 1px solid #656565 !important ;/*\n*/ }.docs-ruler-background-inner {/*\n*/    background-color: #ddd !important ;/*\n*/ }.kix-page-paginated {/*\n*/  /*\n*/    box-shadow: 0 0 0 0.75pt #000,0 0 3pt 0.75pt #0003 !important ;/*\n*/}                             ';
document.getElementsByTagName('head')[0].appendChild(style);




