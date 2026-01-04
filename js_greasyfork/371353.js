// ==UserScript==
// @name        XDA Developers Forum Dark Theme Night Mode - work in prog
// @namespace   english
// @description XDA Developers Forum Dark Theme Night Mode - work in progress
// @include     http*://*forum.xda-developers.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371353/XDA%20Developers%20Forum%20Dark%20Theme%20Night%20Mode%20-%20work%20in%20prog.user.js
// @updateURL https://update.greasyfork.org/scripts/371353/XDA%20Developers%20Forum%20Dark%20Theme%20Night%20Mode%20-%20work%20in%20prog.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                             BODY {/*\n*/    background: #3e3e3e; /*\n*/}#thread-header-bloglike {/*\n*/    background-color: #6b6b6b;/*\n*/    clear: left;/*\n*/    border: 1px solid #838383;/*\n*/}#thread-header-bloglike h1 {/*\n*/    border-bottom: 1px solid #838383;/*\n*/    border-left: 1px solid #838383;/*\n*/    padding: 10px 0 10px 10px;/*\n*/    margin: 0 0 0 101px;/*\n*/}#thread-header-meta {/*\n*/    margin-left: 101px;/*\n*/    padding-left: 10px;/*\n*/    padding: 12px 5px 12px 10px;/*\n*/    border-left: 1px solid #838383;/*\n*/}/*\n*/#thread-header-bloglike  {color: #ccc;}  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}                                                ';
document.getElementsByTagName('head')[0].appendChild(style);



