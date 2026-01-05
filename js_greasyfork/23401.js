// ==UserScript==
// @name         Custom Google Docs Theme - Gabi
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23401/Custom%20Google%20Docs%20Theme%20-%20Gabi.user.js
// @updateURL https://update.greasyfork.org/scripts/23401/Custom%20Google%20Docs%20Theme%20-%20Gabi.meta.js
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
    addGlobalStyle('#docs-editor { background-color: #000 !important; }');
     addGlobalStyle('#docs-toolbar-wrapper { border-width: 0px !important; background-image: -webkit-linear-gradient(top,rgba(255, 0, 0, 0),rgba(255, 255, 255, 0.85)) !important; background-color: transparent !important;}');
     addGlobalStyle('#docs-chrome {     border-color: black; border-width: 5px; border-bottom-width: 0px; background-image: url(https://static1.squarespace.com/static/54e65bb9e4b01dbc2504dd68/54e90a93e4b0feaa476e7ad1/54e90b13e4b0bc2e9a969857/1424562048540/Supreme+Logo.png) !important; background-size: contain;}');
   addGlobalStyle('.goog-toolbar-button, .goog-toolbar-menu-button { border-color: #000 !important; border-style: outset !important;border-width: 2px !important; }');
    addGlobalStyle('::-webkit-scrollbar-thumb {     background-color: rgba(255, 0, 0, 0.72); border-style: solid; border-color: white; border-width: thin;}');
    addGlobalStyle('.kix-page-paginated { box-shadow: 0 0 0 2.75pt rgb(0, 0, 0),0 0 3pt 0.75pt rgba(204, 204, 204, 0.01) !important;}');
 
    // addGlobalStyle('#portlet_box_content_calendar_cldr { max-width: 900px !important; }');
    
//addGlobalStyle('#portlet_box_content_calendar_week { max-height: 600px !important; width: 450px !important; }');
//addGlobalStyle('#col_1 { width: 450px !important; }');
//    addGlobalStyle('#portlet_box_content_calendar_cldr > table { visibility: hidden !important; height: 0 !important; }');
//addGlobalStyle('.entryBody .content img { max-width: 850px !important; width: auto !important; height: auto !important; max-height: 600px !important;}');
//addGlobalStyle('#portal_body .portlet_box  { background: rgba(41, 29, 214, 0.77) !important;}');
   // addGlobalStyle ('a {color: #ffffff}');
    // Your code here...
})();