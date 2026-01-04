// ==UserScript==
// @name         Google Sheets UI Restore
// @namespace    https://myjumbledweb.com/
// @version      1.1
// @description  Restore Google Sheets to the classic Material theme
// @author       Alexander Rosenberg
// @license      GPL-3.0-or-later
// @match        https://docs.google.com/spreadsheets/d/*/edit*
// @history      1.1 - 3/29/2023 - add old waffle_k_ltr.css
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462513/Google%20Sheets%20UI%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/462513/Google%20Sheets%20UI%20Restore.meta.js
// ==/UserScript==


var css = `
body {
    font-familiy: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
}

/* restore old header */

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
    margin-right: 4px;
}

/* restore old menubar */

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

/* restore old toolbar search */

.docs-grille-gm3 #docs-omnibox-toolbar .docs-omnibox-input {
    background: #f1f3f4;
    border-radius: 8px;
    color: #202124;
    height: 26px;
    line-height: 26px;
    padding: 1px 7px;
}
.docs-grille-gm3 #docs-omnibox-toolbar .docs-omnibox-autocomplete {
    margin: 6px 4px 6px 1px;
    padding: 0;
}

/* restore old toolbar combo button input */

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

/* restore old share button */

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
    background: #188038;
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
    background: #188038;
    color: #fff;
    background: #2a8947;
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
    background: #62a877;
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
    background: #188038;
    color: #fff;
    background: #62a877;
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
    background: #188038;
    color: #fff;
    background: #4f9e67;
    box-shadow: 0 1px 3px 1px rgba(52,168,83,.15);
    padding: 9px 16px 10px 12px;
    border-color: transparent!important;
}

/* restore old Google call button */

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
.docs-grille-gm3 #docs-meet-in-editors-entrypointbutton.goog-flat-menu-button .goog-flat-menu-button-dropdown {
    border-color: #1a73e8 transparent;
    right: 6px;
    top: 15px;
}

/* restore old toolbar */

.docs-grille-gm3.docs-gm .docs-material #docs-toolbar-wrapper {
    background-color: #fff;
    border-top: 1px solid #dadce0;
    border-bottom: 1px solid #dadce0;
    border-radius: 0;
    font-family: inherit;
    margin: 0;
    min-height: 35px;
	padding: 0 21px 0 30px;
    -webkit-font-smoothing: unset;
}
.docs-grille-gm3 #docs-align-palette .goog-toolbar-button, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-combo-button, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-menu-button, .docs-grille-gm3 .trix-palette .goog-toolbar-menu-button {
    background-color: #fff;
}
.docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button.goog-toolbar-button-checked, .docs-grille-gm3.docs-gm #docs-align-palette .goog-toolbar-button-checked, .docs-grille-gm3.docs-gm .clean-palette .goog-palette-cell-selected, .docs-grille-gm3.docs-gm .trix-palette .goog-palette-cell-selected {
    background-color: #e6f4ea;
    color: #137333;
}
.docs-grille-gm3 #docs-align-palette .goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button.goog-toolbar-button-checked .docs-icon-img, .docs-grille-gm3.docs-gm .clean-palette .goog-palette-cell-selected .docs-icon-img, .docs-grille-gm3.docs-gm .trix-palette .goog-palette-cell-selected .docs-icon-img {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496.svg);
}
.docs-grille .docs-material .docs-icon-img:before {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496_grey_medium.svg);
}
.docs-material .docs-icon-redo-rtl-20, .docs-material .docs-icon-undo-20 {
    left: -42px;
    top: -5350px;
}
.docs-material .docs-icon-redo-20, .docs-material .docs-icon-undo-rtl-20 {
    left: 0;
    top: -9604px;
}
.docs-grille-gm3 .formula-bar-separator-container .formula-bar-separator, .docs-grille-gm3 .formula-bar-with-name-box-wrapper {
    background-color: #eee;
}
.docs-grille-gm3 .waffle-name-box-container {
    border-radius: 0;
    color: #000;
    margin: 0;
}
.docs-grille-gm3 .waffle-name-box-container .waffle-name-box {
    border: none;
    font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    font-size: 13px;
    height: 19px;
    margin: 2px 0 2px 2px;
    padding: 0 8px 0 6px;
    width: 69px;
}

.docs-material .goog-toolbar-button, .docs-material .goog-toolbar-combo-button, .docs-material .goog-toolbar-menu-button {
    box-shadow: none;
    background-color: #fff;
    background-image: none;
    cursor: pointer;
    border-color: transparent!important;
    border-radius: 2px;
    border-width: 1px;
}
.docs-grille-gm3 #t-formula-bar-label {
    width: 45px;
}
.docs-gm #docs-equationtoolbar .goog-toolbar-button, .docs-gm #docs-equationtoolbar .goog-toolbar-menu-button, .docs-gm .goog-toolbar-button, .docs-gm .goog-toolbar-combo-button, .docs-gm .goog-toolbar-menu-button, .docs-gm .trix-palette .goog-palette-cell {
    height: 24px;
    line-height: 24px;
    margin: 6px 1px;
    top: 0;
}
.docs-grille-gm3 .docs-main-toolbars .goog-toolbar-button, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-menu-button, .docs-grille-gm3 .docs-main-toolbars .goog-toolbar-select {
    border-radius: 2px;
    height: 24px;
    line-height: 24px;
    margin: 6px 1px;
    min-width: auto;
	top: 0;
}

/* restore old formula bar */

.docs-grille-gm3 #t-formula-bar-input .cell-input {
    color: inherit;
    font-family: inherit;
    height: 100%;
    margin: 0;
}
.docs-grille-gm3 #t-formula-bar-input {
    font-size: 13px;
}

/* restore old tabs */

.docs-gm .docs-sheet-active-tab {
    background-color: #fff;
    border-top-color: #f1f3f4;
    box-shadow: 0 1px 3px 1px rgba(60,64,67,.15);
}
.docs-gm .docs-sheet-active-tab .docs-sheet-tab-dropdown:hover {
    background-color: #e6f4ea;
}
.docs-gm .docs-sheet-tab .docs-sheet-tab-dropdown {
    border-radius: 2px;
    margin: 0;
    opacity: 1;
}
.docs-grille-gm3 .docs-sheet-active-tab .docs-sheet-tab-name, .docs-grille-gm3 .docs-sheet-active-tab:focus .docs-sheet-tab-name {
    color: #188038;
    font-weight: 500;
}
.docs-grille-gm3 .docs-material.docs-sheet-active-tab .docs-icon .docs-icon-arrow-dropdown {
    left: 0;
    top: -11012px;
}
.docs-grille-gm3 .docs-material.docs-sheet-active-tab .docs-icon-img, .docs-grille-gm3 .docs-material.docs-sheet-active-tab .docs-icon-img:before {
    content: url(//ssl.gstatic.com/docs/common/material_common_sprite496_green.svg);
}
.docs-grille-gm3 .docs-sheet-active-tab.docs-sheet-tab.docs-sheet-tab-hover {
    background-color: #fff;
    border-left: 1px solid #e8eaed;
    border-right: 1px solid #e8eaed;
    border-top: 1px solid #f1f3f4;
}

/* restore old column headers background */
.docs-grille-gm3 div.column-headers-background, .docs-grille-gm3 div.row-headers-background, .docs-grille-gm3 th.column-headers-background, .docs-grille-gm3 th.row-headers-background {
    background: #dddddd; /* original old css had #f8f9fa here, but the correct rule with #dddddd could not be found */
    color: #5f6368;
    font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
}

/* restore old app switcher */

.docs-grille-gm3 .docs-companion-app-switcher-container {
    border-top: 1px solid #d9d9d9;
}
.docs-grille-gm3 .companion-app-switcher-container, .docs-grille-gm3 .docs-companion-app-switcher-container {
    background-color: #fff;
}
.docs-grille-gm3 .companion-app-switcher-container {
    border-left: 1px solid #dadce0;
}

/* restore old sidebars */

.docs-grille-gm3 .waffle-sidebar-container {
    background: #f1f1f1;
    border-radius: 0;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2);
    margin: 2px 0 0 0;
}`;

var head = document.getElementsByTagName('head')[0];
if (!head) { return; }

var style2 = document.createElement('link');
style2.type = 'text/css';
style2.rel = 'stylesheet';
style2.href = "/static/spreadsheets2/client/css/2685466079-waffle_k_ltr.css";
head.appendChild(style2);

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);
