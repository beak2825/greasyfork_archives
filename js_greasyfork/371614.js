// ==UserScript==
// @name        Urban Dictionary Dark Theme Night Mode
// @namespace   english
// @description Urban Dictionary Dark Theme Night Mode - simplify 
// @include     http*://*urbandictionary.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371614/Urban%20Dictionary%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371614/Urban%20Dictionary%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '            /*\n*//*\n*//*\n*/body, html, html body {/*\n*/    background: #252525 !important;/*\n*/    background-color: #252525 !important;/*\n*/    background-image: none important;/*\n*/}.top-bar .title-area {/*\n*/ /*\n*/     display: none;/*\n*/}#urban-top-bar {/*\n*/    background-color: #151515;/*\n*/}.autocomplete {/*\n*/    background-color: #9a9a9a !important;/*\n*/}.aa-dropdown-menu {/*\n*/    background-color: #b5b5b5;/*\n*/    right: 0 !important;/*\n*/    box-shadow: 0 3px 3px #ccc;/*\n*/}.new-mug-ad {/*\n*/   /*\n*/    display: none;/*\n*/}.def-panel .def-footer {/*\n*/    margin-top: 1.25rem;/*\n*/    opacity: 0.45;/*\n*/}.def-panel {/*\n*/    /*\n*/    border-color: #e3e3e3;/*\n*/ /*\n*/    background: #484848;/*\n*/    color: #cccccc;/*\n*/    box-shadow: 1px 1px 2px #292929;/*\n*/ /*\n*/}.def-panel .def-header .word {/*\n*/    color: #c6d6ff;/*\n*/  /*\n*/}.def-panel .meaning a, .def-panel .example a {/*\n*/  /*\n*/    color: #c6d6ff;/*\n*/}a {/*\n*/    color: #c6d6ff;/*\n*/   /*\n*/}a:hover, a:focus {/*\n*/    color: #a8faff;/*\n*/}.def-panel .meaning, .def-panel .example {/*\n*/    margin-top: 1em;/*\n*/    margin-bottom: 1em;/*\n*/    color: #d8d8d8;/*\n*/}.category.sex {/*\n*/    background-color: #ff000026;/*\n*/}.def-panel .ribbon {/*\n*/    text-transform: uppercase;/*\n*/   /*\n*/    font-size: 1.4rem;/*\n*/     /*\n*/    background-color: #efff0012;/*\n*/    padding: 5px 1em;/*\n*/    margin-bottom: 0.5em;/*\n*/     display: table;/*\n*/    width: auto;/*\n*/}.panel {/*\n*/    box-shadow: 1px 1px 2px #00000085;/*\n*/}.panel {/*\n*/    border-style: solid;/*\n*/    border-width: 0px;/*\n*/    border-color: #000000;/*\n*/    margin-bottom: 1.25rem;/*\n*/    padding: 1.25rem;/*\n*/    background: #232323;/*\n*/    color: #d0d0d0;/*\n*/}.panel h1, .panel h2, .panel h3, .panel h4, .panel h5, .panel h6, .panel p, .panel li, .panel dl {/*\n*/    color: #c1c1c1;/*\n*/}  .monthly-activity {   filter: invert(100%)hue-rotate(160deg); }  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}       ';

document.getElementsByTagName('head')[0].appendChild(style);
