// ==UserScript==
// @name Github-code-font
// @namespace https://github.com/tjysdsg/github-code-font
// @description github code font changer
// @include https://github.com/*/*
// @version 1
// @author tjysdsg
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/381529/Github-code-font.user.js
// @updateURL https://update.greasyfork.org/scripts/381529/Github-code-font.meta.js
// ==/UserScript==

var fontsize ="15px";
var fontfamily ="Noto Sans Regular";

// Function helper to inject css
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Apply the font-family definition to code styles.
addGlobalStyle(
    '.blob-code { font-size: ' + fontsize + '; font-family: ' + fontsize + '; } ' +
    '.blob-num { font-size: ' + fontsize + '; font-family: ' + fontsize + '; } ' +
    '');
