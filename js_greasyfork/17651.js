// ==UserScript==
// @name         Edited Footer
// @namespace    NGU_Footer
// @version      0.1
// @description  This increases the size of the homepage footer, and reduces the size of the Staff Online 
// @author       You
// @match        http://www.nextgenupdate.com/forums/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17651/Edited%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/17651/Edited%20Footer.meta.js
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

addGlobalStyle('.jb_footer_col.scol { height: 460px !important; }');
addGlobalStyle('.jb_footer_staffuser_avatar { height: 30px !important; width: 30px !important; }');
addGlobalStyle('#jb_footer_staffonline a.username { font-size: 12pt !important; }');
addGlobalStyle('.jb_footer_staffuser_box { border-bottom: 1px solid #d6d9dc !important; }');
addGlobalStyle('.jb_footer_col.lcol { height: 460px !important; }');