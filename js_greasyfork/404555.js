// ==UserScript==
// @name         Fuck the custom cursor on Gmodfodder
// @version      0.1
// @description  Removes the custom cursor on Gmodfodder.com
// @author       kaj
// @match        *gmodfodder.com/*
// @grant        none
// @namespace https://greasyfork.org/users/577673
// @downloadURL https://update.greasyfork.org/scripts/404555/Fuck%20the%20custom%20cursor%20on%20Gmodfodder.user.js
// @updateURL https://update.greasyfork.org/scripts/404555/Fuck%20the%20custom%20cursor%20on%20Gmodfodder.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

addGlobalStyle('body { cursor: default!important; }');