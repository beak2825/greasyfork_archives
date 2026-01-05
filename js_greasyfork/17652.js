// ==UserScript==
// @name         Larger Shoutbox
// @namespace    NGU_LargerSB
// @version      0.1
// @description  Doubles the shoutbox length
// @author       You
// @match        http://www.nextgenupdate.com/forums/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17652/Larger%20Shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/17652/Larger%20Shoutbox.meta.js
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

addGlobalStyle('.shoutbox_body { min-height: 410px !important; }');
addGlobalStyle('#nguheader .container-fluid.shoutbox_body_cont { height: 410px !important; }');