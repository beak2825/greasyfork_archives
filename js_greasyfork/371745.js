// ==UserScript==
// @name        chrome extension  BG Dark Mode Night Theme
// @namespace   english
// @description chrome extension BG Dark Mode Night Theme - simple grey red 
// @include     *chrome-extension://*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371745/chrome%20extension%20%20BG%20Dark%20Mode%20Night%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371745/chrome%20extension%20%20BG%20Dark%20Mode%20Night%20Theme.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        body,html,html body{background-color: #262626 !important ;background: #262626 !important ;  }     ';

document.getElementsByTagName('head')[0].appendChild(style);
