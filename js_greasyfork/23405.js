// ==UserScript==
// @name         Custom Google Docs - Micah
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23405/Custom%20Google%20Docs%20-%20Micah.user.js
// @updateURL https://update.greasyfork.org/scripts/23405/Custom%20Google%20Docs%20-%20Micah.meta.js
// ==/UserScript==

(function() {
    'use strict';
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

    addGlobalStyle('#docs-editor { background-image: -webkit-linear-gradient(bottom,#fce869,#a37500,#ffe964) !important; }');
     addGlobalStyle('#docs-toolbar-wrapper { background-image: -webkit-linear-gradient(top,#fce869,#a37500,#ffe964) !important; border-bottom: 3px dashed #0fcc31; border-top: 4px dashed #0fcc31;}');
     addGlobalStyle('#docs-chrome {     background-image: url(https://a2ua.com/money/money-040.jpg); background-size: 20% 60%;};');
   addGlobalStyle('.goog-toolbar-button, .goog-toolbar-menu-button,  .docs-title-save-label { border-color: #0fcc31 !important; border-style: outset !important;border-width: 2px !important; }');
    addGlobalStyle('.kix-page-paginated { box-shadow: 0 0 0 2.75pt #0fcc31,0 0 3pt 0.75pt rgba(204, 204, 204, 0.01) !important;}');
 addGlobalStyle('#docs-menubar {     background-size: 100% 100%; border: dashed 1px; border-color: rgb(147, 149, 137); background-color: rgba(248, 250, 233, 0.7);}');
addGlobalStyle('::-webkit-scrollbar-thumb { background-color: rgba(81, 142, 81, 0.71);');
    addGlobalStyle('.docs-title-save-label,.jfk-button-action,#docs-branding-container.docs-branding-documents { background-image: -webkit-linear-gradient(top,#fce869,#a37500,#ffe964) !important;color: #000;{;');
    
   
    // addGlobalStyle('#portlet_box_content_calendar_cldr { max-width: 900px !important; }');
    
//addGlobalStyle('#portlet_box_content_calendar_week { max-height: 600px !important; width: 450px !important; }');
//addGlobalStyle('#col_1 { width: 450px !important; }');
//    addGlobalStyle('#portlet_box_content_calendar_cldr > table { visibility: hidden !important; height: 0 !important; }');
//addGlobalStyle('.entryBody .content img { max-width: 850px !important; width: auto !important; height: auto !important; max-height: 600px !important;}');
//addGlobalStyle('#portal_body .portlet_box  { background: rgba(41, 29, 214, 0.77) !important;}');
   // addGlobalStyle ('a {color: #ffffff}');
    // Your code here...
})();