// ==UserScript==
// @name         Highlight Word
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.2
// @description  Insructions
// @author       Tjololo
// @match        *://*/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/30368-highlight-words-jquery-library/code/Highlight%20Words%20Jquery%20Library.js?version=199096
// @grant        GM_Log
// @downloadURL https://update.greasyfork.org/scripts/30369/Highlight%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/30369/Highlight%20Word.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.highlight { background-color: yellow }';
document.getElementsByTagName('head')[0].appendChild(style);

var textArray = ["attention", "do not click", "please select", "only select", "in the box", "code"];

$('body').highlight(textArray);