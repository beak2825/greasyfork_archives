// ==UserScript==
// @name         Custom Haiku Theme - Supreme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://ajhs.haikulearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25285/Custom%20Haiku%20Theme%20-%20Supreme.user.js
// @updateURL https://update.greasyfork.org/scripts/25285/Custom%20Haiku%20Theme%20-%20Supreme.meta.js
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
   // addGlobalStyle('#docs-editor { background-color: #4285f4 !important; }');
     addGlobalStyle('#content { background-position-x: -500px !important; background-position-y: 573px !important; background-color: transparent !important;}');
     
    //.goog-toolbar-button, .goog-toolbar-menu-button
    
    
  
 addGlobalStyle('#portal_body { background-image: url(http://www.huhmagazine.co.uk/images/uploaded/supreme_basquiat_01.jpg) !important;}');
    
    
   // addGlobalStyle('#docs-editor { background-color: #4285f4 !important; }');
     //addGlobalStyle('#content { background-position-x: -500px !important; background-position-y: 573px !important; background-image: url(http://toyourdome.com/wp-content/uploads/2016/03/pro-era-53bee3a2ca2da.jpg);}');
    //addGlobalStyle('#content { background-size: contain; background-image: url(http://www.huhmagazine.co.uk/images/uploaded/supreme_basquiat_01.jpg) !important;}');
     addGlobalStyle('#docs-chrome { background-image: -webkit-linear-gradient(bottom,#4785ec,#4c8efb) !important;}');
   addGlobalStyle('#global_top_links,#widecol,#frame { background-color:transparent !important; }');
    //.goog-toolbar-button, .goog-toolbar-menu-button
    
    addGlobalStyle('#header { background-repeat: round !important; background-position: initial;background-size: contain; background-image: url(https://static1.squarespace.com/static/54e65bb9e4b01dbc2504dd68/54e90a93e4b0feaa476e7ad1/54e90b13e4b0bc2e9a969857/1424562048540/Supreme+Logo.png) !important; }');
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