// ==UserScript==
// @name         Darkmode Favro ZP
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Custom darkmode for Zonneplan
// @author       Aurorion
// @match        https://favro.com/organization/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421488/Darkmode%20Favro%20ZP.user.js
// @updateURL https://update.greasyfork.org/scripts/421488/Darkmode%20Favro%20ZP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('test');

    GM_addStyle('*::-webkit-scrollbar { width: 11px !important; height: 11px !important; background: #000000 !important; }');

    GM_addStyle('*::-webkit-scrollbar-thumb { background-color: #1A1D21 !important; border-left: 2px solid #1A1D21 !important; border-right: 2px solid #1A1D21 !important; border: 0px !important; }');

    GM_addStyle('*::-webkit-scrollbar-track { background-color: #F2F2F2 !important; border: 5px solid #1A1D21 !important; }');

    GM_addStyle (`

* {
--real-white: #FFFFFF;
--real-black: #000000;
--cheerfull-green: #76CC2B;
--kelly-green: #00AA65;
--dark-forest-green: #0E352F;
--sunbeam-orange: #ED5F18;
--horizon-gray: #F2F2F2;
--midnight-black: #080D14;
--slack-black: #1A1D21;
}

/* loading screen */
.fui-loading {
transition: background-color 500ms ease-out 2s;
background-color: var(--real-black) !important;
}

pre {
background: var(--real-black) !important;
}

.popup {
--popup-bgcolor: var(--real-black) !important;
}

.popup-content {
border: 2px solid var(--real-black) !important;
}

/* card modal */
.commentspane, .contentwrapper,
.cardeditor-topbar {
background: var(--slack-black) !important;
border-bottom: 1px solid var(--real-black) !important;
}

tokenlist .token-member .name {
color: black !important;
}

/* card modal fields */
.cardattributes .cardfield>.edit {
border: none !important;
}

/* card modal comment background */
.commentspane .cardcomment .details {
background: var(--real-black) !important;
}

.prosemirror-quickinsert.layout-default {
background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,#fff 15%,#2e4662);
}

.favro-checklistitem:hover,
.favro-checklistitem.is-active {
background-color: var(--slack-black) !important;
}

.input {
color: black !important;
border-radius: 3px !important;
}

body {
color: var(--real-white) !important;
}

body, body .backlogfullscreen-main {
background-color: var(--real-black) !important;
}

.widget, .widget-minimized, .boardcolumn-summaries, .widget-title-summaries, .widget-title .widget-title-name-text {
color: var(--real-white) !important;
}

.card-title-text {
color: var(--real-white) !important;
}

.card-field-section .card-field-name {
color: var(--real-white) !important;
}

.popup-userfield {
color: var(--real-white) !important;
}

.pagesearch .ui-searchmodal-results {
background-color: #2f4562 !important;
}

.page-search-item {
background-color: var(--real-black) !important;
border: none !important;
color: var(--real-white) !important;
}

/* card in board */
.card.layout-board,
.ui-textfield-input textarea {
background-color: var(--real-black) !important;
border: none !important;
color: var(--real-white) !important;
}

.card.layout-board .cardfield.cardfield-relations .relationslist {
display: none !important;
}

.singlewidgetfeed .item .details .info .name, .close {
color: var(--real-white) !important;
}

.ui-modal-header {
border: none !important;
}

.fui-menu2-item:not(.is-disabled):not(.color-textlink):hover {
background-color: var(--slack-black) !important;
}

.tokenlist,
.addtoken {
background-color: var(--slack-black) !important;
}

.tokenlist .token-member,
.tokenlistpicker {
background-color: var(--slack-black) !important;
}

.tokenlistpicker {
border: 1px solid var(--slack-black) !important;
}

.singlewidgetfeed .date {
background-color: var(--real-black) !important;
}

span.textwithlink.style-link {
color: var(--real-white) !important;
font-weight: 600;
}

.fui-dropdown-listitem {
color: var(--real-white) !important;
}

.popup-window-middle,
.popup-window-topbar,
.search-edit {
background-color: var(--real-black) !important;
color: var(--real-white) !important;
}

.search-widget-wrapper:hover {
background-color: #2f4562 !important;
}

/* links */

/** add board link */
.widget-board-add {
color: var(--horizon-gray) !important;
}

/* link to collection relation in card modal */
.cardrelations .relation .text {
color: var(--kelly-green) !important;
}

.fui-btn.mod-textlink.color-secondary {
color: var(--kelly-green);
}

.workspace-widgets {
background: var(--real-black) !important;
}

/* sidebar */
.workspace .navpane {
background-color: var(--real-black) !important;
}

.workspace .navpane.mod-collapsable:hover {
background-color: var(--slack-black) !important;
}

.navpane-item.is-selected .item-content {
background-color: var(--cheerfull-green) !important;
}

/* board */
.workspace-widgets .widget {
background: var(--slack-black) !important;
}

.pageheader, .board-stickyheader {
background-color: var(--real-black) !important;
border-bottom: none !important;
}

/* board top bar lane */
.card.card-as-lane {
display: none !important;
}

.widget-title.mod-sticky, .widget-title:hover {
background: inherit !important;
}

/* notifications */
.notificationbadge[title=Edited], .notificationbadge[title=Moved], .notificationbadge[title=Mentioned]:not(.is-major) {
display: none !important
}

.unreadindicator {
display: none !important
}

/* tree view */
.ui-tableheaders.sheet-table-headers .columnheader {
background-color: var(--slack-black) !important;
border-bottom: 1px solid var(--real-black) !important;
}

.ui-tableheaders.sheet-table-headers {
border-left: 0px solid var(--real-black) !important;
border-bottom: 0px solid var(--real-black) !important;
}
.singlewidgetpageapp.is-sheet .group-row .cell {
background-color: var(--slack-black) !important;
border-bottom: 1px solid rgba(23,37,51,.24) !important;
border-left: 1px solid rgba(23,37,51,.24) !important;
}

.sheet-table-headers .columnheader+.columnheader, .singlewidgetpageapp.is-sheet .columnheader+.columnheader {
border-left: 1px solid var(--real-black) !important;
}

.sheet-addcolumn {
background-color: var(--slack-black) !important;
border-bottom: 1px solid var(--real-black) !important;
border-left: 1px solid var(--real-black) !important;
}

/* between board lanes */
.workspace-widgets .widget.widget.widgettype-board .boardcolumn:not(.mod-dragged):after {
border-right: 1px solid rgba(23,37,51,.24) !important;
}

/* form text */
.form-splitsection .form-subtext {
color: var(--real-white) !important;
}

.ui-fullscreenmodal-content {
color: var(--real-white) !important;
}

.desktop .ui-temporary-overrides h1, .desktop .ui-temporary-overrides h2, .desktop .ui-temporary-overrides h3, .desktop .ui-temporary-overrides h4, .desktop .ui-temporary-overrides h5, .desktop .ui-temporary-overrides h6 {
color: var(--real-white) !important;
}

.desktop .fui-expandable .fui-expandable-header:not(.mod-noexpand):hover {
color: var(--real-white) !important;
}

/* Herres */
.navpane-item .item-content .badge {
background-color: var(--sunbeam-orange) !important;
}

.fui-btn .fui-badge, .fui-icon-button .fui-badge {
background-color: var(--sunbeam-orange) !important;
}

.tokenlistpicker .listitem.is-current {
border-color: var(--real-black) !important;
background-color: var(--real-black) !important;
}

.tokenlist-popup>.tokenlist {
border: 1px solid var(--cheerfull-green) !important
}

.widget-buttons .widget-mode-switcher-btn {
background: var(--real-black) !important;
}

.widget-minimized .widget-title .widget-title-content .widget-title-arrow .symbol-arrowhead-down,
.widget .widget-title .widget-title-content .widget-title-arrow .symbol-arrowhead-down {
fill: var(--real-black) !important;
stroke: var(--real-black) !important;
}

.card-enter {
background-color: var(--real-black) !important;
}

.card-enter .card-num-children {
color: var(--cheerfull-green) !important;
}

.card-enter .card-enter-img .symbol-chevron-right {
stroke: var(--cheerfull-green) !important;
}

.mention-user {
color: var(--cheerfull-green) !important;
}

.hyperlink, a {
color: var(--cheerfull-green) !important;
}

.commentspane {
border-left: 1px solid var(--real-black) !important;
}

.prosemirror-toolbar {
background-color: var(--real-black) !important;
}

.favro-checklist .toolbar {
background: var(--real-black) !important;
}

.pageheader>.actions .search {
background-color: var(--slack-black) !important;
border: 0px !important;
}

.pageheader>.actions .search:hover .text {
color: var(--cheerfull-green) !important;
}

.pageheader>.actions .search:hover .fui-icon {
stroke: var(--cheerfull-green) !important;
}

.pageheader>.details>.info .starred.is-starred .symbol-star {
fill: var(--cheerfull-green) !important;
stroke: var(--cheerfull-green) !important;
}

.desktop .fui-icon-button.mod-active,
.desktop .fui-icon-button:hover{
border-color: var(--slack-black) !important;
}

.singlewidgetpageapp.is-sheet .sheet-group-add-spacer {
background-image: var(--slack-black) !important;
}

.fui-timelinesheet .fui-timelinesheet-header {
background: var(--slack-black) !important;
border-bottom: 1px solid var(--real-black) !important;
}

.timeline-view-controlbar {
background: var(--slack-black) !important;
}

.board-timeline-view .fui-timelinesheet-header .dateheader-content .datelabels .sticky-label-mark .bold,
.fullscreen-header-custom-wrapper .fui-timelinesheet-header .dateheader-content .datelabels .sticky-label-mark .bold,
.sticky-header-custom-wrapper .fui-timelinesheet-header .dateheader-content .datelabels .sticky-label-mark .bold {
color: var(--horizon-gray) !important;
}

.loading-shimmer {
background: var(--real-black) !important;
}

.sheet-row-placeholder {
border-bottom: 1px solid var(--real-black) !important;
border-right: 1px solid var(--real-black) !important;
}

.desktop .scrollablelist {
background: var(--slack-black) !important;
}

.automation-header, .automations .content {
background: var(--slack-black) !important;
border: 2px solid var(--real-black) !important;
}

.automations .sidebar {
background: var(--slack-black) !important;
border-right: 1px solid var(--real-black) !important;
}

.automation-header.mod-preset {
background: var(--real-black) !important;
border: 1px solid var(--real-black) !important;
}

.automations .sidebar>.category .fui-icon.style-filled, .automations .sidebar>.category .fui-icon.style-filledonly {
fill: var(--cheerfull-green) !important;
}

.automations .sidebar>.category .fui-icon:not(.style-filledonly) {
stroke: var(--cheerfull-green) !important;
}

.automations .sidebar>.category.is-selected, .automations .sidebar>.category:hover {
color: var(--horizon-grey) !important;
background: var(--sunbeam-orange) !important;
}

.automations .sidebar .custom-automation, .fui-btn.color-light {
color: var(--cheerfull-green) !important;
background-color: var(--real-black) !important;
border: 0px !important;
}

.widget-display-mode-switcher {
border: 0px !important;
}

.quick-edit-card-button .icon-pen .fui-icon {
fill: var(--sunbeam-orange) !important;
stroke: var(--sunbeam-orange) !important;
}

.fui-dropdown .fui-dropdown-text {
color: var(--horizon-gray) !important;
}

.singlewidgetfeed .date:after, .singlewidgetfeed .date:before {
background-color: var(--slack-black) !important;
}

.cardeditor-topbar .divider, .pageheader>.details>.info .divider {
opacity: 0 !important;
}

.desktop .ui-temporary-overrides .popup-userfield {
background-color: var(--slack-black) !important;
border: 0px !important;
}

.fui-btn {
background-color: var(--slack-black) !important;
border: 0px !important;
color: var(--horizon-grey) !important;
}

.ui-tab {
color: var(--horizon-grey) !important;
}

.cardeditor-topbar {
background: var(--real-black) !important;
border-bottom: 1px solid var(--real-black) !important;
}
.cardeditor-topbar:hover {
background-color: var(--real-black) !important;
}
.cardeditor-topbar .topbar-activity {
background-color: var(--slack-black) !important;
border: 1px solid var(--slack-black) !important;
}
.divider {
opacity: 0 !important;
}

.board-stickycolumnheaders {
background-color: var(--slack-black) !important;
}

.fui-timelinesheet-background {
background-color: var(--real-black) !important;
}

.timeline-view-controlbar .control {
background-color: var(--real-black) !important;
color: var(--horizon-gray) !important;
border: 0px !important;
}

.timeline-view-controlbar .timeline-view-datecontrols {
border: 0px !important;
}

.backlog-breadcrumbs .backlog-breadcrumb-link, .backlog-breadcrumb-next {
color: var(--cheerfull-green) !important;
}

.singlewidgetpageapp.is-sheet .sheet-group-add-spacer {
background-color: var(--slack-black) !important;
opacity: 100 !important;
margin-bottom: 0px !important;
}

.textdiff>.added {
background-color: var(--real-black) !important;
color: var(--kelly-green) !important;
}

.textdiff>.removed {
background-color: var(--real-black) !important;
color: var(--sunbeam-orange) !important;
text-decoration: line-through;
}

.gotocard-button:hover {
background-color: var(--cheerfull-green) !important;
color: var(--real-black) !important;
cursor: pointer;
}

.gotocard-button {
border: 1px solid var(--cheerfull-green) !important;
color: var(--cheerfull-green) !important;
}

.singlewidgetfeed .item .viewautomation-button:hover {
background: var(--cheerfull-green) !important;
color: var(--real-black) !important;
}

.singlewidgetfeed .item .viewautomation-button {
border: 1px solid var(--cheerfull-green) !important;
color: var(--cheerfull-green) !important;
}

.commentspane .cardcomment.is-new .details {
border: 0px !important;
}

.cardeditor-topbar .actions .fui-icon-button {
background-color: var(--slack-black) !important;
}

.popup-content.widgetviews-list-popup .itemslist .widgetview-item {
background-color: var(--cheerfull-green) !important;
color: var(--real-black) !important;;
}

.popup-content.widgetviews-list-popup .itemslist {
border-bottom: 0px !important;
}

.popup-content.widgetviews-list-popup .search-box {
border-bottom: 0px !important;
}

.activity-dialog-content .pagenewsfeed .activityfeed .item.mod-active,
.activity-dialog-content .pagenewsfeed .activityfeed .item:hover,
.activity-dialog-content .pagenewsfeed .paged-list .item.mod-active,
.activity-dialog-content .pagenewsfeed .paged-list .item:hover,
.activity-dialog-content .pagenotifications .activityfeed .item.mod-active,
.activity-dialog-content .pagenotifications .activityfeed .item:hover,
.activity-dialog-content .pagenotifications .paged-list .item.mod-active,
.activity-dialog-content .pagenotifications .paged-list .item:hover {
background-color: var(--slack-black) !important;
}

.pagesearch .ui-searchmodal-results {
background-color: var(--slack-black) !important;
}

.highlight {
background-color: var(--sunbeam-orange) !important;
color: var(--horizon-gray) !important;
}

.page-search-item.card-item .widgetname .text {
color: var(--horizon-gray) !important;
}

.page-search-item.card-item .widgetname .widgetname-text {
color: var(--horizon-gray) !important;
}

.widget-item .details .name .pagename {
color: var(--real-white) !important;
opacity: 0.7 !important;
}

.ui-searchmodal .ui-searchmodal-topbar+.ui-searchmodal-results {
border-top: 0px !important;
}

.fui-link {
color: var(--cheerfull-green) !important;
}

.board-timeline-view .timeline-indicator, .fullscreen-header-custom-wrapper .timeline-indicator, .sticky-header-custom-wrapper .timeline-indicator {
background-color: var(--slack-black) !important;
color: var(--horizon-gray) !important;
opacity: 1 !important;
}

.page-search-item.is-focused {
border-color: var(--cheerfull-green) !important;
box-shadow: 0 0 0 1px var(--cheerfull-green) !important;
}

.ui-searchmodal .ui-searchmodal-topbar .search-toolbar .search-clear {
border-right: 0px !important;
}

.singlewidgetpageapp.is-sheet .group-row:not(.is-summary) {
border-right: 1px solid var(--real-black) !important;
}

.automation-field {
    background: var(--real-black) !important;
    border: 0px !important;
}

.fui-dropdown.has-border {
    background-color: #fff0 !important;
}

.automation-editor .editor-actions {
    background: var(--slack-black) !important;
    border-top: 0px !important;
}

.automation-item .content .controls {
    border-left: 2px solid var(--real-black) !important;
}

.snippet .threadanchor-text {
    background-color: var(--kelly-green) !important;
}

.attachment .card {
    background: var(--real-black) !important;
}

.commenteditor .editinput{
   background-color: var(--slack-back) !important;
}

.widget-minimized .board-column-addcard>.text, .widget .board-column-addcard>.text {
background-color: var(--slack-black) !important;
}

.dialog-wrapper .dialog .popup-userfield, .popup-dialog .dialog .popup-userfield {
    background-color: var(--slack-black) !important;
    border: none !important;
}
`);

    // Your code here...
})();