// ==UserScript==
// @name         Fix DK5
// @namespace    http://dailykos.com/
// @version      0.1
// @description  Make DK5 apperance less blazingly painful
// @author       Jan Rooth
// @match        http://www.dailykos.com/*
// @match        https://www.dailykos.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13727/Fix%20DK5.user.js
// @updateURL https://update.greasyfork.org/scripts/13727/Fix%20DK5.meta.js
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

addGlobalStyle('body { color: #eee !important; }');
addGlobalStyle('body { background-color: #444 !important; }');
addGlobalStyle('.story-title a { color: #eee !important; }');
addGlobalStyle('.story-social a { color: #eee !important; }');
addGlobalStyle('a { color: #ea7106 !important; }');
addGlobalStyle('.cke_textarea_inline { color: #000 !important; }');
addGlobalStyle('blockquote { background-color: #777 !important; }');
addGlobalStyle('.comment.preview .comment-wrapper { background-color: #777 !important; }');
addGlobalStyle('.num-votes { color: #000 !important; }');
addGlobalStyle('.msg { color: #000 !important; }');
addGlobalStyle('.cke_dialog_ui_button { color: #000 !important; }');
addGlobalStyle('.btn-primary { background-color: #444 !important; }');