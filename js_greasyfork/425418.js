// ==UserScript==
// @name         Grammarly for Fiverr Inbox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script will help to run Grammarly software properly on Fiverr.com
// @author       Ramin
// @match        *://*.fiverr.com/inbox/*
// @icon         https://www.google.com/s2/favicons?domain=fiverr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425418/Grammarly%20for%20Fiverr%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/425418/Grammarly%20for%20Fiverr%20Inbox.meta.js
// ==/UserScript==

var css = `
.textarea-container {
    min-height: 38px !important;
}
`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
};
head.appendChild(style);