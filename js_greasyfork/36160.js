// ==UserScript==
// @name         Zendesk UI Tweaks
// @namespace    plugable.com
// @version      0.2
// @description  This userscript is simple and designed to increase visibility of Zendesk. All use liability is on the end user.
// @author       Derek Nuzum
// @match        https://*.zendesk.com/*
// @grant        none
// @license         MIT - https://opensource.org/licenses/MIT
// @copyright       Copyright (C) 2017, by Derek Nuzum <derek@plugable.com>
// @downloadURL https://update.greasyfork.org/scripts/36160/Zendesk%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/36160/Zendesk%20UI%20Tweaks.meta.js
// ==/UserScript==

//DO NOT TOUCH THIS AREA
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//END DO NOT TOUCH AREA

//CUSTOMIZATION BEGINS HERE

//Change Styling Here
//Internal Note Text Box Color
addGlobalStyle('.rich_text .comment_input:not(.is-public) div[contenteditable] {background: #eef955 !important;}');
//Previous Internal Notes Text Box Color
addGlobalStyle('.event:not(.is-public) .comment{background: #eef955 !important;}');