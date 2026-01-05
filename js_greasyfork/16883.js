// ==UserScript==
// @name         Nighty-night Google Docs
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      2.9
// @description  Write at night comfortably!
// @author       Peter Badida
// @copyright    2016+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/Nighty-night-Google-Docs
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://www.google.com/docs/about/favicon.ico
// @include      https://*docs.google.*/document/*
// @include      https://*docs.google.*/sharing/*
// @include      https://*docs.google.*/e/organize*
// @include      https://*docs.google.*/picker*
// @include      https://*docs.google.*/drawings/*
// @include      https://*.google.*/webstore/wall/widget?container=GOOGLE_DOCUMENT*ref=https%3A%2F%2Fdocs.google.*
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @grant        GM_addStyle
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/16883/Nighty-night%20Google%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/16883/Nighty-night%20Google%20Docs.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
// basic colors
var text = '#777777';
var buttons = '#696969';
var disabled = '#888888';

// main backgrounds
var black = '#0c0c0c';
var softBlack = '#191919';
var softGrey = '#555555';

// modal, popup, listbox, other large areas' backgrounds
var darkModal = '#333333';
var lightModal = '#393939';

// hover, selection, active element color
var hover = '#f8f8f8';
var darkHover = '#242424';
var lightHover = '#494949';

var maincss = "\
img#kwu_av:hover {\
    opacity: 1 !important;\
}\
\
*:focus {\
    outline: none;\
}\
/*TOOLBAR*/\
div#docs-chrome, div#docs-toolbar-wrapper, \
div#docs-title-widget div.goog-inline-block, div.goog-toolbar, \
div#docs-toolbar-wrapper.docs-material {\
    color: {text} !important;\
    background-color: {black} !important;\
    background-image: none !important;\
    border: 0;\
    box-shadow: none;\
}\
div.goog-control-hover, div.goog-control-open {\
    background: {lightHover} !important;\
    border-color: {lightHover} !important;\
}\
div#docs-branding-container.docs-branding-documents, div.goog-button-hover {\
    background-color: {softBlack} !important;\
    background: {softBlack};\
}\
div.docs-icon-folder-solid {\
    background-color: {buttons} !important;\
}\
div.jfk-activityIndicator-circle {\
    background-color: {buttons} !important;\
}\
div#docs-toolbar {\
    background-color: {softBlack} !important;\
    border: 0 !important;\
}\
input.goog-toolbar-combo-button-input, input.docs-title-input:focus {\
    color: {darkModal} !important;\
    border-color: gray !important;\
}\
div.goog-toolbar-menu-button-caption {\
    color: {darkModal} !important;\
    border-color: gray !important;\
}\
div.goog-toolbar-separator{\
    visibility: hidden;\
}\
div.goog-toolbar-combo-button {\
    background: {buttons} !important;\
}\
div#boldButton, div#undoButton, div#redoButton, div#printButton, \
div#formatPainterButton, div#underlineButton, div#textColorButton, \
div#insertLinkButton, div#insertCommentButton, div#alignLeftButton, \
div#alignCenterButton, div#alignRightButton, div#alignJustifyButton, \
div#addNumberedBulletButton, div#addBulletButton, div#bulletListPresetButton, \
div#outdentButton, div#indentButton, div#clearFormattingButtonButton, \
div#viewModeButton {\
    background-color: {buttons} !important;\
    border: 0;\
    color: {darkModal} !important;\
}\
div.goog-menuitem.docs-submenuitem {\
    border: 0 !important;\
}\
div.jfk-button.docs-submenuitem-splitbutton, \
div.jfk-button.docs-submenuitem-splitbutton:hover {\
    background-color: {darkHover} !important;\
}\
\
/*BUTTONS*/\
div.goog-toolbar-button, div.goog-toolbar-menu-button {\
    background-color: {buttons} !important;\
    border: 0;\
    color: {darkModal} !important;\
}\
div.jfk-button-disabled, .jfk-button-standard.jfk-button-disabled {\
    background: {disabled} !important;\
    background-image: none;\
    color: {darkModal};\
}\
div#picker:ap:1, div.jfk-button, div.jfk-button-mini, \
div#docs-chrome > div > div > div > div > div > div > div > div > div {\
    color: {darkModal} !important;\
    background-color: {buttons} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
div.jfk-button:hover {\
    color: {darkModal} !important;\
    background-color: {hover} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
div.goog-toolbar-button-hover, div.goog-toolbar-menu-button-hover {\
    background-color: {hover} !important;\
    border: 0 !important;\
    background-image: -webkit-linear-gradient(top,#f8f8f8,#f1f1f1) !important;\
    background-image: -moz-linear-gradient(top,#f8f8f8,#f1f1f1) !important;\
    background-image: -ms-linear-gradient(top,#f8f8f8,#f1f1f1) !important;\
    background-image: -o-linear-gradient(top,#f8f8f8,#f1f1f1) !important;\
    background-image: linear-gradient(top,#f8f8f8,#f1f1f1) !important;\
}\
div.jfk-button-standard.jfk-button-hover, div.jfk-button-hover {\
    background-color: {hover} !important;\
    background-image: none !important;\
}\
div.goog-flat-menu-button {\
    color: {darkModal} !important;\
    background-color: {buttons} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
div.goog-toolbar-combo-button-hover, div.goog-flat-menu-button-hover {\
    background-color: {hover} !important;\
    background-image: none !important;\
}\
div.jfk-button-standard {\
    background-color: {buttons};\
    background-image: none;\
    border: 0 !important;\
}\
\
/*MENUBAR*/\
div.goog-menuseparator {\
    border:0;\
}\
div.goog-menuitem, .goog-option-selected .goog-menuitem-content {\
    color: {text} !important;\
}\
div.goog-menuitem-disabled > div > span, \
div.goog-menuitem-disabled > div >.goog-menuitem-accel {\
    color: {lightHover} !important;\
}\
div#docs-menu-shield, div.goog-menu-vertical {\
    background-color: {lightModal} !important;\
    background: {lightModal};\
}\
\
/*MODAL SHARE*/\
div.modal-dialog, div.modal-dialog-title, div.modal-dialog-content, \
div.modal-dialog-bg {\
    color:{text};\
    background: {lightModal} !important;\
    background-color: {lightModal} !important;\
    border-bottom: 0 !important;\
}\
div.modal-dialog-content > body {\
    background-color: {lightModal} !important;\
    border-top:0;\
}\
span.apc-name {\
    color: {text} !important;\
}\
div.permissions-list-container, div.permissions-list > td{\
    border: 0 !important;\
}\
textarea.simple-sharing-note-text-area {\
    background-color: {text} !important;\
}\
div.inviter-role-area > div.goog-flat-menu-button {\
    color: {darkModal} !important;\
    background-color: {buttons} !important;\
    background-image: none !important;\
    border: 0 !important;\
    } \
div.ia-invite-controls-area {\
    background-color: {lightModal} !important;\
}\
div.link-management-select, div.jfk-button-action, \
button.simple-sharing-primary-button {\
    color: {darkModal};\
    background: {buttons} !important;\
    background-color: {buttons} !important;\
    border: 0 !important;\
    background-image: none !important;\
}\
div.inviter-role-area > div.goog-flat-menu-button-hover, \
div.link-management-select:hover {\
    background-color: {hover} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
div.link-management-url-container {\
    border-color: {buttons} !important;\
}\
td.vs-learn-more-text > a, a.ap-learn-more-link, div.share-fmb, \
div.vs-info-text > a, a.simple-sharing-link-sharing-learn-more, \
span.vpc-change-link {\
    color: {text} !important;\
}\
\
/*MODAL FILE BROWSER*/\
div.picker.modal-dialog, div.picker-iframe.picker-min.goog-menu {\
    border:0;\
}\
div.goog-tree-root {\
    border: 0 !important;\
}\
div.folder-creation-link, div.folder-creation-link:hover {\
    color: {text} !important;\
}\
div.folders-popup-summary {\
    background: transparent !important;\
}\
div.folders-popup {\
    background-color: {text};\
}\
div.picker-min-arrow-inner {\
    border-color: {darkModal} transparent !important;\
}\
\
/*REVISIONS*/\
div#docs-revisions-sidebar {\
    background-color: {darkModal} !important;\
    border-left: 0;\
}\
/*frame around tile-text*/\
textarea.docs-revisions-tile-text-box:focus:enabled {\
    border-color: {text} !important;\
}\
div#docs-revisions-sidebar-header, div.docs-revisions-sidebar-date-group, \
div.docs-revisions-chromecover-content-color-default, \
div#docs-toolbar-iterator-label {\
    background-color: {black} !important;\
    border: 0 !important;\
    color: {text} !important;\
}\
div.docs-revisions-tile-content-wrapper, div.docs-revisions-tile, \
div#docs-revisions-sidebar-actions {\
    border: 0;\
}\
span.docs-revisions-tile-link, .docs-revisions-tile-timestamp, \
textarea.docs-revisions-tile-text-box, \
textarea.docs-revisions-tile-text-box:disabled, \
div.docs-revisions-sidebar-header-text-color-brand, \
div.docs-revisions-sidebar-name-filter-switch-container > label {\
    color: {text} !important;\
}\
div.docs-revisions-tile-selected {\
    background-color: {darkHover} !important;\
}\
div.goog-sa-pane-inner, div.docs-revisions-tile-hover {\
    background-color: {darkHover} !important;\
    background: {darkHover};\
}\
div.docs-revisions-chromecover-titlebar-color-brand {\
    background-color: {buttons} !important;\
    color: {darkModal} !important;\
}\
div.docs-revisions-chromecover-titlebar-color-brand:hover {\
    background-color: {hover} !important;\
}\
div.docs-revisions-chromecover-titlebar-button-action {\
    background-color: {darkModal} !important;\
    background: {darkModal} !important;\
    color: {text} !important;\
}\
div.docs-revisions-sidebar-actions {\
    border-top: 1px solid {lightModal} !important;\
}\
\
/*PUBLISH*/\
div.modal-dialog > a {\
    color: {text} !important;\
}\
hr.pub-dialog-sep {\
    border-top-color: {text} !important;\
}\
div.goog-tab-hover, div.goog-tab.pub-dialog-tab.goog-tab-selected {\
    border: 0 !important;\
    background: {buttons} !important;\
}\
\
/*MAIL ATTACHMENT*/\
textarea.email-attach-medium-text-area {\
    background-color: {softGrey} !important;\
    border-color: {text} !important;\
}\
\
/*PAGE SETTINGS*/\
div.goog-menu {\
    background: {darkModal} !important;\
}\
\
/*DOCUMENT*/\
a, a:link, a:hover, a:visited {\
    color: {text} !important;\
}\
body {\
    background-color: {lightModal} !important;\
    color: {text} !important;\
}\
.docs-bubble-link, .docs-bubble a {\
    color: {text} !important;\
}\
div#docs-editor, div#docs-editor-container {\
    background-color: black !important;\
}\
div#kix-appview {\
    background-color: {softBlack} !important;\
}\
div#docs-equationtoolbar {\
    background: {black} !important;\
    border: 0 !important;\
}\
div.kix-page-paginated {\
    box-shadow: none !important}\
div.kix-print-block, div.kix-page-content-wrapper {\
    background-color: {softGrey} !important;\
}\
td.kix-documentmetricsdialog-row {\
    border-bottom-color: {text} !important;\
}\
\
/*FIND-REPLACE*/\
div.kix-findselectionprovider-underlay-match, \
div.kix-findandreplaceoverlayprovider-match, div.kix-selection-overlay {\
    background-color: {lightHover} !important;\
    border-color: {lightHover};\
}\
table.docs-findinput-container, table.docs-findinput-container-focus {\
    background-color: {text} !important;\
    border: 0;\
}\
\
/*TABLES*/\
td.goog-palette-cell {\
    background-color: {buttons} !important;\
}\
td.goog-palette-cell:hover {\
    background-color: {hover} !important;\
}\
div.kix-equation-toolbar-palette-item {\
    border: 0 !important;\
}\
div.goog-dimension-picker-unhighlighted {\
    background-color: {text} !important;\
}\
\
/*COMPACT TOOLBAR*/\
div.ac-renderer {\
    background-color: {darkModal} !important;\
    border: 0 !important;\
    color: {disabled} !important;\
}\
div.ac-active {\
    background-color: {darkHover} !important;\
}\
div.goog-menuitem-content {\
    color: {text} !important;\
}\
div.goog-menuitem-highlight {\
    background: {darkHover} !important;\
    border: 0;\
}\
\
/*IMAGE*/\
div.goog-slider-thumb, div.docs-rotationhandle-stick, \
div.docs-rotationhandle-circle, div.docs-squarehandleselectionbox-handle {\
    background-color: {text};\
    background-image: none;\
}\
div.docs-squarehandleselectionbox-border{\
    border-color: {text};\
}\
div.docs-image-effect-sidebar, div.docs-image-effect-sidebar-scroll {\
    background-color:{darkModal};\
    border:0;\
}\
div.docs-image-effect-recolor-tile, div.docs-image-effect-adjustment-tile, \
div.docs-image-effect-sidebar-header {\
    border:0;\
    background-color:{darkModal};\
    color: {buttons} !important;\
}\
\
/*BUBBLES*/\
div.docs-bubble, span.docs-bubble-link, div.jfk-bubble {\
    border:0;\
    background-color:{darkModal};\
    color: {buttons} !important;\
}\
div.docs-link-insertlinkbubble-suggestionholder, \
div.docs-link-linksuggestiongroup {\
    background-color: {darkModal} !important;\
    border: 0 !important;\
}\
div.jfk-bubble-arrowimplbefore, div.jfk-bubble-arrowimplafter {\
    border-color: {darkModal} transparent !important;\
}\
\
/*COMMENTS*/\
div.docos-anchoreddocoview-arrow-outer, \
div.docos-anchoreddocoview-arrow-inner {\
    border-right: 20px solid {darkHover} !important;\
}\
div.docos-streampane-content, div.docos-streampane-header, \
div.docos-replyview-quote {\
    border:0;\
    background-color:{darkHover};\
    color: {buttons} !important;\
}\
div.docos-streampane-header .docos-new-comment-button, \
div.docos-streampane-header jfk-button {\
    background-color: {buttons};\
    color: {darkModal} !important;\
}\
div.docos-overflowmenu-outer > .docos-docomenu-dropdown, \
div.docs-docos-activitybox {\
    border: 0;\
}\
div.docos-streamdocoview {\
    border-top-color: {softGrey} !important;\
}\
div#docos-comment-bubble {\
    border: 0 !important;\
    background: {lightHover} !important;\
}\
div.docos-streamrootreplyview, div.docos-streamrootreplyview:hover, \
div.docos-streamreplyview, div.docos-streamdocoview-inputcontainer, \
div.docos-overflowmenu-vertical, div.docos-actionmenu-vertical {\
    background-color: {darkModal} !important;\
}\
div.docos-anchoredreplyview-author, div.docos-streamdocoview-authorname, \
div.docos-streamdocoview-body, span.docos-streamreplyview-body, \
span.docos-replyview-quote {\
    color: {text} !important;\
}\
div.docos-docoview-reopen, div.docos-docoview-comment, \
div.docos-docoview-resolve, div.docos-replyview-edit, \
div.docos-replyview-edit:hover, div.docos-replyview-delete, \
div.docos-replyview-delete:hover, div.docos-showrepliesbutton-collapsed {\
    color: {text} !important;\
}\
div.docos-anchoredreplyview, div.docos-anchoreddocoview-input-pane, \
div.docos-showrepliesbutton {\
    background-color: {darkHover} !important;\
    background: {darkHover} !important;\
    color: {text} !important;\
}\
textarea.docos-input-textarea {\
    background-color: {buttons} !important;\
    border: 0 !important;\
}\
div.docos-anchoredreplyview, div.docos-showrepliesbutton {\
    border-bottom-color: {softGrey} !important;\
}\
div.docos-anchoredreplyview .docos-anchoredreplyview-body, \
div.docos-streamreplyview-author {\
    color: {text} !important;\
}\
div.docos-enable-new-header>.docs-docos-caret-inner, \
div.docs-docos-caret-outer {\
    border-color: {darkModal} transparent !important;\
}\
\
/*SPECIAL CHARS*/\
div.ita-cp-search, div.ita-cp-search.ita-cp-focus, div.ita-cp-hwt, \
input.ita-cp-input, input.label-input-label {\
    background-color: {text} !important;\
    border-color: {text} !important;\
}\
div.goog-char-picker-hovercard {\
    border-color: {lightModal} !important;\
    background-color: {lightHover} !important;\
}\
\
/*ALT TEXT*/\
textarea#alt-text-dialog-description {\
    background-color: {buttons} !important;\
    border: 0 !important;\
}\
\
/*SPELL-CHECK*/\
label.docs-spellcheckslidingdialog-title-text {\
    color: {buttons} !important;\
}\
div.docs-slidingdialog {\
    border:0;\
    background-color:{darkModal};\
    color: {buttons} !important;\
}\
td.docs-spellcheckslidingdialog-replacement-input-container {\
    background-color: {text} !important;\
    border: 0;\
}\
div#docs-spellcheckslidingdialog-suggestion-list {\
    background: {lightHover} !important;\
    border: 0;\
}\
\
/*RESEARCH - NEW EXPLORE SIDEBAR (Ctrl+Alt+Shift+I)*/\
div.docs-explore-sidebar-title {\
    background-color: {darkModal};\
    border: 0;\
}\
div.docs-explore-sidebar, div.docs-dictionary-sidebar {\
    background-color: {lightModal};\
}\
div.goog-sa-searchbox-back-button.jfk-button-disabled, \
div.goog-sa-searchbox-back-button, \
div.goog-sa-searchbox-fwd-button.jfk-button-disabled, \
div.goog-sa-searchbox-fwd-button, \
div.goog-sa-searchbox.goog-sa-component-online .goog-sa-searchbox-selectormenu {\
    background-color: {disabled} !important;\
    background: {disabled} !important;\
    border: 1px solid {text} !important;\
    border-right: none !important;\
}\
div.goog-sa-searchbox-container, div.goog-sa-searchbox-selectormenu, \
div.docs-explore-widget {\
    border-color: {text} !important;\
    background-color: {softGrey} !important;\
}\
div.goog-sa-settings-controls, div.goog-sa-settings-toggle-content, \
div.goog-sa-pane-search {\
    border-color: {text} !important;\
}\
div.goog-sa-welcome-content > a, div.goog-sa-snippet-title-link, \
div.goog-sa-component-active, div.docs-dictionary-titlebar-heading, \
.goog-sa-personal.goog-sa-component-active.goog-sa-component-online \
.goog-sa-snippet-title-link, .goog-sa-personal .goog-sa-snippet-title-link, \
div.goog-sa-pane-title, .goog-sa-content.goog-sa-common-heading \
.goog-sa-content-link, div.docs-explore-topicitem-title, \
div.docs-explore-topicitem-generator-text, div.docs-explore-card-more-button, \
div.docs-explore-card-title-heading, div.docs-explore-tabbar-tab-label, \
div.docs-explore-serp-webresult-snippet, div.docs-explore-emptylist-title, \
div.docs-explore-emptylist-body, div.docs-explore-sidebar-title-heading, {\
    color: {text} !important;\
}\
div.docs-explore-searchbar-suggestion-itemview-title, \
span.docs-explore-widget-text, div.docs-explore-card-more-button {\
    color: {darkHover} !important;\
}\
div.goog-sa-previewpane-closestrip, div.goog-sa-previewpane, \
div.goog-sa-pane-attribution, div.docs-explore-card, \
div.docs-explore-nuggetscardview-container, div.docs-explore-searchbar-ac-active, \
div.docs-explore-serp-webresultsview-card-container {\
    background-color: {lightModal} !important;\
    border-color: {text} !important;\
}\
div.goog-sa-component-online.goog-sa-component-active.goog-sa-sectiongroup-heading, \
div.goog-sa-snippet .goog-sa-button-bar, div.goog-sa-button-bar, \
div.goog-sa-personal.goog-sa-component-active .goog-sa-button-bar, \
div.docs-explore-searchbar-ac-renderer {\
    background-color: {softGrey} !important;\
    border-color: {text} !important;\
}\
div.goog-sa-sectiongroup-heading {\
    border: 0 !important;\
}\
div.goog-sa-common-heading {\
    background-color: transparent;\
}\
div.goog-sa-scrollfloater > div, div.docs-explore-serp-webresultscard-header, \
div.docs-explore-serp-webresultscard-content, \
div.docs-explore-serp-webresultscard, \
div.docs-explore-serp-webresultscard-allresults {\
    background-color: {lightModal} !important;\
    border-color: {text} !important;\
}\
a.goog-sa-common-heading, .goog-sa-content-link, a.goog-sa-snippet-title-link,\
a.goog-sa-snippet-title-link:hover, a.goog-sa-link {\
    color: {text} !important;\
    text-decoration: underline !important;\
}\
div.goog-sa-component-online.goog-sa-component-focus.goog-sa-searchbox .goog-sa-searchbox-selectormenu, \
div.goog-sa-component-online.goog-sa-component-active.goog-sa-snippet {\
    border-color: {text} !important;\
}\
div.goog-sa-sneakpeek, div.goog-sa-sneakpeek:last-child {\
    background-color: {softGrey} !important;\
    border-top-color: {lightHover} !important;\
    border-bottom-color: {lightHover} !important;\
}\
div.docs-explore-tabbar-tab-selected {\
    border-bottom-color: {lightHover} !important;\
}\
\
/*DEFINITION*/\
div.goog-sa-definition {\
    border-color: {text} !important;\
}\
\
/*PREFS*/\
div.docs-preferencesdialog-list-body {\
    background-color: {lightModal};\
    color: {text} !important;\
}\
div.docs-preferencesdialog-list-body::-webkit-scrollbar-thumb {\
    border: 0 !important;\
}\
\
/*USER DICTIONARY*/\
div.docs-userdictionarydialog-row-container {\
    border: 0;\
}\
div.docs-userdictionarydialog-row-container:hover {\
    background: {darkHover} !important;\
    border: 0;\
}\
div.docs-userdictionarydialog-list-container {\
    border:0;\
    background-color:{darkModal};\
    color: {buttons} !important;\
}\
div.docs-userdictionarydialog-button-add-container {\
    border: 0}\
div.modal-dialog-buttons > button, button.goog-buttonset-action {\
    color: {darkModal} !important;\
    background: {buttons} !important;\
    background-color: {buttons} !important;\
    border: 0 !important;\
    background-image: none !important;\
}\
div.modal-dialog-buttons > button:hover, button.goog-buttonset-action:hover {\
    background-color: {hover} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
\
/*KBSHORTCUTS*/\
div.apps-shortcutshelppopup-ac-renderer {\
    background-color: {darkModal} !important;\
    border: 0 !important;\
}\
h3.apps-shortcutshelppopup-search-label, \
div.apps-shortcutshelpcontentimpl-search-label, \
h3.apps-actiondatawidget-content-header, \
h2.apps-shortcutshelpcontentimpl-dialog-title, \
div.apps-navigationwidget {\
    color: {text} !important;\
}\
div.apps-navigationwidget-item-selected {\
    background-color:{darkHover} !important;\
    color: {text} !important;\
}\
div.apps-shortcutshelpcontentimpl-container {\
    background-color: {darkModal} !important;\
    color: {text} !important;\
}\
table.apps-shortcutshelppopup-content {\
    background-color: {lightModal};\
    color: {text} !important;\
}\
td.apps-actiondatawidget-content-element, \
a.apps-shortcutshelppopup-help-center-link {\
    color: {text} !important;\
    border: 0;\
}\
div.apps-shortcutshelppopup, \
div.apps-navigationwidget-item-hover {\
    background-color:{darkHover} !important;\
    box-shadow: none;\
}\
div.apps-shortcutshelppopup-header, div.apps-shortcutshelppopup-container {\
    border: 0 !important;\
}\
\
/*USERPANEL*/\
/*div#gb == div#docs-header > div+div*/\
div#gb > div > div > div > div+div > div+div {\
    background: {darkHover} !important;\
}\
div#gb > div > div > div > div > div > div {\
    background: none !important;\
}\
div#gb > div > div > div > div > div > div > div > div,\
div#gb > div > div > div > div+div > div > a{\
    color: {disabled} !important;\
}\
div#gb > div > div > div > div > div > div > div > a {\
    background-color: {lightModal} !important;\
    border: 0;\
    color: {disabled} !important;\
}\
div#gb > div > div > div > div > div > div > div > a:hover {\
    color: {darkModal} !important;\
    background-color: {hover} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
div#gb > div > div > div > div > div > div {\
    border-bottom-color: {darkHover} !important;\
}\
\
/*RULER*/\
div.kix-ruler-contributed-dragger-container, div#kix-ruler {\
    border:0;\
    background-color: {softBlack} !important;\
}\
div.docs-ruler-background-inner {\
    background-color: {softGrey} !important;\
}\
\
/*INPUTS*/\
input.docs-title-input {\
    color: {text} !important;\
    background-color: {black} !important;\
    background-image: none !important;\
    border: 0;\
    box-shadow: none;\
}\
textarea.jfk-textinput, textarea.jfk-textinput:focus, input.jfk-textinput, \
input.jfk-textinput:focus, div.inviter-recipient-area {\
    background-color: {softGrey} !important;\
    border: 0;\
    color: {darkModal} !important;\
    outline: none;\
}\
input.hsv-input {\
    color: {darkModal} !important;\
    background-color: {softGrey} !important;\
    border-color: gray !important;\
}\
\
/*NAVIGATION*/\
div.docs-icon-close-thin {\
    background-color: {lightHover} !important;\
}\
div.navigation-widget-hat-title {\
    color: {text} !important;\
}\
div.navigation-widget-hat {\
    border-bottom: solid 1px {lightHover};\
}\
div.navigation-widget > div+div+div > div[role=menuitem] > div {\
    color: {text} !important;\
}\
\
/*CONTAINERS*/\
div.webstore-widget {\
    color:{text};\
    background: {lightModal} !important;\
    background-color: {lightModal} !important;\
    border-bottom: 0 !important;\
}\
\
";
var webstorecss = "\
/*WEBSTORE*/\
*:focus {\
    outline: none;\
}\
body > div > div > div > div > span[role=button], \
body > div > div > div > div > div > div > div > div > a > div+div+div > \
div+div > div > div {\
    color: {darkModal} !important;\
    background: {buttons} !important;\
    background-color: {buttons} !important;\
    border: 0 !important;\
    background-image: none !important;\
}\
body > div > div > div > div > span[role=button]:hover, \
body > div > div > div > div > div > div > div > div > a > div+div+div > \
div+div > div > div:hover {\
    background-color: {hover} !important;\
    background-image: none !important;\
    border: 0 !important;\
}\
body > div > div > div > div > div > div > div > div > a > div > div {\
    background-color: {lightModal} !important;\
    border: 0 !important;\
}\
body > div > div > div > div > div > div > div > div > a > div, \
body > div > div > div > div > div > div > div > div > a > div > div > img {\
    border: 0 !important;\
}\
body > div > div > div > div > div > input#searchbox-input {\
    color: {text} !important;\
    background-color: {softGrey} !important;\
    border: 0;\
    box-shadow: none;\
}\
body, body > div > div > div, body > div > div+div+div, \
body > div > div > div > div > div > div > div > div > a > div, \
body > div > div > div > div > div > div > div > div > a > div+div+div {\
    background-color: {darkModal} !important;\
    border: 0 !important;\
    color: {text} !important;\
}\
body > div > div > div > div > div[role=listbox] {\
    background: {darkModal} !important;\
    border: 0 !important;\
}\
body > div > div > div > div > div[role=listbox] > div[role=option] {\
    background: {darkModal} !important;\
}\
body > div > div > div > div > div[role=listbox] > div[role=option]:hover {\
    background: {softBlack} !important;\
}\
body > div > div > div > div > div > div > div > div > div, \
body > div > div > div > div > div > div > div > div > a > div > div > \
div+div > div, body > div > div > div > div > div > div > div > div > a > \
div+div+div > div+div+div > div {\
    color: {text} !important;\
}\
\
";
var opencss = "\
/*MODAL OPEN*/\
*:focus {\
    outline: none;\
}\
body {\
    background-color: {lightModal} !important;\
}\
div[role=button] {\
    color: {darkModal} !important;\
    background-color: {buttons} !important;\
    background-image: none;\
    border: 0 !important;\
}\
div[role=button]:hover {\
    color: {darkModal} !important;\
    background-color: {hover} !important;\
    background-image: none;\
    border: 0 !important;\
    box-shadow: none !important;\
    -webkit-box-shadow: none !important;\
}\
div#doclist > div > div > div > div > div > div > div > \
div > div > div > div[role=listbox], \
div#doclist > div > div > div > div > div+div > div > \
div > div > div, div[role=menu] {\
    background-color: {lightModal} !important;\
}\
div#doclist > div > div > div > div > div > div > div > div+div, \
div#doclist > div > div > div > div > div > div > div > div > div > div+div, \
input {\
    background-color: {lightModal} !important;\
    border-color: {text} !important;\
    color: {text} !important;\
}\
div[role=tab], div[role=heading], div[role=status] {\
    color: {text} !important;\
    border-color: {text} !important;\
}\
div#doclist > div > div > div > div > div, div[target=layout] {\
    background-color: {lightModal} !important;\
    background-image: none;\
    border: 0 !important;\
    box-shadow: none !important;\
    -webkit-box-shadow: none !important;\
}\
div[role=option] > div, div[role=option] > div > div, \
div#doclist > div > div > div > div > div > div > div > div > div > div > \
div > div > div > div > div > div > div > div+div {\
    background-color: {buttons} !important;\
    border: 0 !important;\
}\
div#doclist > div > div > div > div > div > div > div > div > div > div > \
div > div > div > div > div > div+div, div[data-target=layout] {\
    background-color: {lightModal} !important;\
    border:0 !important;\
}\
div#doclist > div > div > div > div > div > div > div > div > div > label, \
div[role=menuitem] > div, div[role=menuitemradio] > div, \
a.picker-actionpane-notice-link {\
    color: {text} !important;\
    border: 0 !important;\
}\
div[role=presentation] > div[role=option] {\
    background-color: none !important;\
}\
\
";
var movecss = "\
*:focus {\
    outline: none;\
}\
div[role=button] {\
    color: {darkModal} !important;\
    background-color: {buttons} !important;\
    background-image: none;\
    border: 0 !important;\
}\
div[role=button]:hover {\
    color: {darkModal} !important;\
    background-color: {hover} !important;\
    background-image: none;\
    border: 0 !important;\
    box-shadow: none !important;\
    -webkit-box-shadow: none !important;\
}\
input {\
    background-color: {lightModal} !important;\
    border-color: {text} !important;\
    color: {text} !important;\
}\
div#doclist > div > div+div > div {\
    background-color: {lightModal} !important;\
}\
div[role=heading], div[role=status] {\
    color: {text} !important;\
    border-color: {text} !important;\
}\
div[role=menuitem] > div > div, div[role=menuitem] > div > div > a {\
    color: {text} !important;\
}\
div[role=menu], div[role=menuitem] > div, div[role=menuitem] > div > \
div+div+div > div {\
    background-color: {lightModal} !important;\
}\
div[role=menuitem]>div:hover, div[role=menuitem] > div > div+div+div > \
div:hover {\
    background-color: {darkHover} !important;\
}\
div[role=group] {\
    border-color: {text} !important;\
}\
\
";

var css;
if (/webstore/i.test(window.location.href)) {
    css = webstorecss;
} else if (/picker.*?kix-fileopen/i.test(window.location.href) ||
          (/picker.*?kix&/i.test(window.location.href))) {
    css = opencss;
} else if (/picker.*?kix-move/i.test(window.location.href)) {
    css = movecss;
} else if (/picker.*?profilePhoto=true/i.test(window.location.href)) {
    css = opencss;
} else {
    css = maincss;
    var panel=document.body;
    var av_style = 'position: relative; opacity: 0.3; border-radius: 5px;';
    var av='<div style="position: absolute; left: 48.5vw; top: 1vh;">\
<a href="https://github.com/KeyWeeUsr/Userscripts">\
<img id="kwu_av" style="' + av_style + '"\
src="https://github.com/identicons/KeyWeeUsr.png" width="24"></img></a></div>';
    panel.insertAdjacentHTML('beforeend', av);
}
css = css.replace(new RegExp('{text}', 'gi'), text);
css = css.replace(new RegExp('{black}', 'gi'), black);
css = css.replace(new RegExp('{lightHover}', 'gi'), lightHover);
css = css.replace(new RegExp('{darkHover}', 'gi'), darkHover);
css = css.replace(new RegExp('{buttons}', 'gi'), buttons);
css = css.replace(new RegExp('{softBlack}', 'gi'), softBlack);
css = css.replace(new RegExp('{darkModal}', 'gi'), darkModal);
css = css.replace(new RegExp('{hover}', 'gi'), hover);
css = css.replace(new RegExp('{lightModal}', 'gi'), lightModal);
css = css.replace(new RegExp('{softGrey}', 'gi'), softGrey);
css = css.replace(new RegExp('{disabled}', 'gi'), disabled);

GM_addStyle(css);
})();

/*
Missing:
1) Docs Help popup
2) Report a problem screen cover
Notify me if there's something missing/undesirable.
*/
