// ==UserScript==
// @name        Simple JSFiddle light theme
// @namespace   Violentmonkey Scripts
// @match       https://jsfiddle.net/*
// @match       https://*.jshell.net/*
// @grant       none
// @version     1.0
// @author      DRSAgile
// @license MIT
// @description 1/3/2022, 6:18:06 PM: this script does not add anything in the UI so to turn it off you have to use *Monkey. Also it might disrupt when JSFiddle might change styling.
// @downloadURL https://update.greasyfork.org/scripts/438001/Simple%20JSFiddle%20light%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438001/Simple%20JSFiddle%20light%20theme.meta.js
// ==/UserScript==

const cssRulesToAppend = `
html
{
    filter: invert(1) hue-rotate(180deg) !important;
    background-color: black !important; /* #1f2227 */
}
body, header, main, div#sidebar, #tabs,
.CodeMirror-gutter, .CodeMirror-lint-markers, .CodeMirror-gutter.CodeMirror-lint-markers, 
#console, .console-output, #console-input, 
.tabsContainer /* this is necessary when 'results' iFrame (@match https://*.jshell.net/*) is not inverted */ 
{
  background-color: black !important; /* #1f2227 */
}
`, // #dadbe2 is an inversion of #1f2227
      head = document.head || document.getElementsByTagName('head')[0],
      styleAttachmentAnchor = head ? head : document.documentElement,
      styleTag = document.createElement('style');
styleTag.type = 'text/css';
if (styleTag.styleSheet)
{
    styleTag.styleSheet.cssText = cssRulesToAppend;
}
else
{
    styleTag.appendChild(document.createTextNode(cssRulesToAppend));
};
styleAttachmentAnchor.appendChild(styleTag);

