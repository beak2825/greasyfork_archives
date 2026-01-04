// ==UserScript==
// @name         Google Docs Classic UI Restore
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bring back the classic look of Google docs!
// @author       Mani Tofigh
// @license      GPL-3.0-or-later
// @match        https://docs.google.com/document/d/*/edit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465791/Google%20Docs%20Classic%20UI%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/465791/Google%20Docs%20Classic%20UI%20Restore.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Run script after everything is loaded.
    //window.addEventListener("load", function(){
//#f0f1f0
      const css = `

body {
    font-familiy: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
}

/* header */

.docs-grille-gm3 #docs-chrome:not(.docs-hub-chrome) {
    background: #fff;
    border-bottom: 0 none;
    margin-bottom: 0;
}
.docs-grille #docs-header {
    height: auto!important;
}
.docs-grille .docs-material #docs-menubar, .docs-grille .docs-material #docs-titlebar-container {
    margin-left: 64px;
}
.docs-grille .docs-material #docs-header #docs-titlebar {
    padding-top: 9px;
}
.docs-grille .docs-material #docs-header .docs-titlebar-buttons {
    height: 64px;
}
.docs-grille #docs-header:not(.docs-hub-appbar) .docs-titlebar-buttons {
    background: #fff;
}
.docs-grille .docs-menubar {
    font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    height: 31px;
    overflow: visible;
}
.docs-grille-gm3 .docs-material #docs-side-toolbar {
    margin-right: 10px;
}

/* menubar */

.docs-grille .docs-menubar .goog-control {
    margin-bottom: 0;
    margin-top: 2px;
    padding: 4px 6px;
    overflow: visible;
    vertical-align: text-bottom;
}
.docs-grille .docs-menubar {
    font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    height: 31px;
    overflow: visible;
}
.docs-grille #docs-menubars {
    height: auto!important;
    margin-top: 0;
    transition-duration: unset;
}


#docs-toolbar-wrapper {
    border-radius: 0px !important;
    border: 1px solid #E3E5E9 !important;
    width: 100% !important;
    z-index: 1000;
}

.kix-appview-editor {
    background-color: #F9F8FA !important;
}

#viewModeButton {
    margin-right: 8px !important;
}

.docs-grille-gm3.docs-gm,
.docs-material,
#docs-toolbar-wrapper {
    margin: 0px !important;
}

#docs-toolbar-wrapper,
#kix-horizontal-ruler,
#docs-align-palette,
.goog-toolbar-button,
.goog-toolbar-combo-button,
.goog-toolbar-menu-button,
.docs-main-toolbars,
.trix-palette,
.docs-horizontal-ruler,
.docs-ruler-face,
#kix-horizontal-ruler-container,
.docs-grille-gm3,
#kix-vertical-ruler,
.docs-vertical-ruler,
.docs-ruler-face{
    background-color: #fff !important;
    z-index: 0;
}

.docs-grille-gm3 #docs-align-palette .goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button.goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3.docs-gm .clean-palette .goog-palette-cell-selected .docs-icon-img, .docs-grille-gm3.docs-gm .trix-palette .goog-palette-cell-selected .docs-icon-img {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496.svg);
}
.docs-grille .docs-material .docs-icon-img:before {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496_grey_medium.svg);
}

.docs-grille-gm3 .docs-material.docs-sheet-active-tab .docs-icon-img, .docs-grille-gm3 .docs-material.docs-sheet-active-tab .docs-icon-img:before {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496_green.svg);
}

.goog-inline-block:hover {
    border-radius: 2px;
    background-color: #f0f1f0;
}

.docs-grille #docs-titlebar-share-client-button .jfk-button {
    background-image: none;
    border: 1px solid transparent!important;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    letter-spacing: .25px;
    line-height: 16px;
    background: #346de8;
    color: #fff;
    padding: 9px 16px 10px 12px;
    text-transform: capitalize;
}
.scb-domain-s900, .scb-lock-s900, .scb-people-s900, .scb-person-add-s900, .scb-public-s900, .scb-warning-s900 {
    height: 21px;
    width: 21px;
	background-repeat: no-repeat;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button .scb-button-icon {
    margin: -3px 2px 0 -5px;
    vertical-align: middle!important;
}
.docs-grille .scb-people-s900 {
    background-position: 0 -932px;
}
.docs-grille .scb-lock-s900 {
    background-position: 0 -932px;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button .scb-button-icon {
    margin: 0 3px 0 -4px;
    vertical-align: middle!important;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button.jfk-button-hover {
    background-image: none;
    border: 1px solid transparent!important;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    letter-spacing: .25px;
    line-height: 16px;
    padding: 9px 24px 11px 24px;
    color: #fff;
    background: #346de9;
    box-shadow: 0 1px 3px 1px rgba(52,168,83,.15);
    padding: 9px 16px 10px 12px;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button.jfk-button-active, .docs-grille #docs-titlebar-share-client-button .jfk-button.jfk-button-checked {
    background-image: none;
    border: 1px solid transparent!important;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    letter-spacing: .25px;
    line-height: 16px;
    color: #fff;
    background: #1958e0;
    box-shadow: 0 2px 6px 2px rgba(52,168,83,.15);
    padding: 9px 16px 10px 12px;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button.jfk-button-hover:focus {
    background-image: none;
    border: 1px solid transparent!important;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    letter-spacing: .25px;
    line-height: 16px;
    padding: 9px 24px 11px 24px;
    color: #fff;
    background: #1958e0;
    box-shadow: 0 1px 3px 1px rgba(52,168,83,.15);
    padding: 9px 16px 10px 12px;
}
.docs-grille #docs-titlebar-share-client-button .jfk-button:focus {
    background-image: none;
    border: 1px solid transparent!important;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;
    font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-weight: 500;
    font-size: 14px;
    height: 36px;
    letter-spacing: .25px;
    line-height: 16px;
    padding: 9px 24px 11px 24px;
    background: #1958e0;
    color: #fff;
    background: #1958e0;
    box-shadow: 0 1px 3px 1px rgba(52,168,83,.15);
    padding: 9px 16px 10px 12px;
    border-color: transparent!important;
}

/* restore old Google call button

.docs-material .docs-icon-meet-24 {
    left: 0;
    top: -1842px;
}
.docs-grille-gm3 #docs-meet-in-editors-entrypointbutton {
    align-items: center;
    background: #fff;
    border: 1px solid #dcdcdc;
	border-radius: 33px;
	box-sizing: border-box;
	cursor: pointer;
    display: inline-block;
    height: 36px;
    margin-right: 12px;
    padding-bottom: 0;
    width: 54px;
}

*/

.docs-grille-gm3 #fontSizeSelect.docs-font-size-inc-dec-combobox .goog-toolbar-combo-button-input {
    margin: 0;
    width: 48px!important;
    height: 20px!important;
    text-align: left;
    padding: 1px 8px;
}

.docs-grille-gm3 .docs-main-toolbars .goog-toolbar-combo-button-input {
    color: rgba(0,0,0,.7);
    font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif!important;
    font-size: 12px!important;
}

.docs-grille-gm3 #fontSizeSelect.docs-font-size-inc-dec-combobox.goog-toolbar-combo-button {
    border: 1px solid transparent!important;
    border-radius: 2px;
}
.docs-grille-gm3 #fontSizeSelect.docs-font-size-inc-dec-combobox {
    margin: 6px 1px;
    width: auto!important;
}
.docs-grille-gm3 #fontSizeSelect.docs-font-size-inc-dec-combobox.goog-toolbar-combo-button-hover {
    border: 1px solid transparent!important;
	background-color: #f1f3f4;
}


.docs-material .docs-icon-redo-rtl-10, .docs-material .docs-icon-undo-10 {
    left: -42px !important;
}
.docs-material .docs-icon-redo-10, .docs-material .docs-icon-undo-rtl-10 {
    left: 0 !important;
}

`;

        var head = document.getElementsByTagName('head')[0];
        if (!head) { return; }

        // /static/document/client/css/3856558134-KixCss_ltr.css

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);

   // });
})();