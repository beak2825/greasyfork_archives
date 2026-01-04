// ==UserScript==
// @name         Blotreterus
// @version      1.0
// @author       gidiigekau
// @license      MIT
// @namespace    null
// @description  BLOkkolt TRollokat ETtőikkel Együtt Rejtő UserScript
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        https://disqus.com/*
// @downloadURL https://update.greasyfork.org/scripts/431376/Blotreterus.user.js
// @updateURL https://update.greasyfork.org/scripts/431376/Blotreterus.meta.js
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
 
addGlobalStyle('.post.minimized{display:none;}');