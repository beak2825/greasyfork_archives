// ==UserScript==
// @name         ArcGIS Online Pop-up Docker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces functionality of maximize button in older ArcGIS Online webmap & app pop-ups, to dock the pop-up in top-right corner instead of filling the whole screen uselessly (newer Experience Builder apps added docking)
// @author       mky
// @supportURL   https://greasyfork.org/en/scripts/375717-arcgis-online-pop-up-docker/feedback
// @match        *.maps.arcgis.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375717/ArcGIS%20Online%20Pop-up%20Docker.user.js
// @updateURL https://update.greasyfork.org/scripts/375717/ArcGIS%20Online%20Pop-up%20Docker.meta.js
// ==/UserScript==

(function() {
    'use strict';

//always dock pop-up --comment out to go back to default (pop-up next to/covering feature)
    addGlobalStyle('.esriPopupWrapper {top: 60px !important;}');
    addGlobalStyle('.esriPopup .outerPointer {display:none !important}');
    //no longer needed //addGlobalStyle('.esriPopup .pointer {display:none !important}');

   //always dock original height
    addGlobalStyle('.esriPopupVisible { top:auto !important; left:auto !important;  right: 306px !important; top: 10px !important; }');

   //always dock auto-height
    //addGlobalStyle('.esriPopup { left:auto !important; right: 356px !important; top: 10px !important;}');
    //addGlobalStyle('.esriPopup .sizer {!important; width:320px !important; max-width:320px !important;}');
    //addGlobalStyle('.esriPopup .sizer .contentPane { height:auto !important;  max-height:550px !important;}');

//dock on pop-up maximize click (wider/auto-height)

    addGlobalStyle('.esriPopupMaximized { left:auto !important; right: 340px !important; top: 10px !important;}');
    addGlobalStyle('.esriPopupMaximized .sizer {!important; width:320px !important; max-width:320px !important;}');
    addGlobalStyle('.esriPopupMaximized .sizer .contentPane { height:auto !important;  max-height:550px !important;}');

//Legend resize skinny

    addGlobalStyle('#widgets_Legend_Widget_18_panel { width:200px !important;}');
    addGlobalStyle('#widgets_Legend_Widget_16_panel { width:200px !important;}');


    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();