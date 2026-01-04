// ==UserScript==
// @name           Retro hyperlinks
// @namespace      Violentmonkey Scripts
// @description    Make hyperlinks more visible. Guaranteed to make most pages uglier.
// @match          http://*/*
// @match          https://*/*
// @version        2.1
// @author         pnppl
// @downloadURL https://update.greasyfork.org/scripts/403933/Retro%20hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/403933/Retro%20hyperlinks.meta.js
// ==/UserScript==

const COLOR_BLUE = '#00278E'; // dark theme: #77B6FF
const COLOR_PURPLE = '#6C00A2'; // #CE6BFF

function addGlobalStyle(css) { // fair use from “Greasemonkey Hacks by Mark Pilgrim, Copyright © 2006 O’Reilly Media, Inc., 0-596-10165-1.”
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(' a, a:link { color: ' + COLOR_BLUE + ' !important; text-decoration: underline !important } '); 
addGlobalStyle(' a:hover, a:link:hover { color: '+ COLOR_BLUE + ' !important; text-decoration: none !important } ');
addGlobalStyle(' a:visited { color: ' + COLOR_PURPLE + ' !important; text-decoration: underline !important } ');
addGlobalStyle(' a:visited:hover { color: ' + COLOR_PURPLE + ' !important; text-decoration: none !important } ');
