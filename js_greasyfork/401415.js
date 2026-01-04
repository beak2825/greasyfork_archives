// ==UserScript==
// @name         Patreon Autosize Post Editor
// @namespace    https://greasyfork.org/en/users/522702-liquidream
// @version      0.1
// @description  Removes the fixed height of editor while creating/editing posts
// @author       Liquidream
// @match        https://www.patreon.com/posts/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401415/Patreon%20Autosize%20Post%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/401415/Patreon%20Autosize%20Post%20Editor.meta.js
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

addGlobalStyle('._3XQ-pages-make_a_post-components-PostEditor--richTextEditor {max-height: none}');

