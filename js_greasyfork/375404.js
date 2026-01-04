// ==UserScript==
// @name         WME RTL Support
// @namespace    https://greasyfork.org/users/gad_m/wme_rtl
// @version      1.3
// @description  Show WME in right to left language
// @author       gad_m
// @grant    GM_addStyle
// @run-at   document-start
// @include      https://www.waze.com/he/editor
// @include      https://www.waze.com/he/editor*
// @include      https://www.waze.com/he/editor?*
// @downloadURL https://update.greasyfork.org/scripts/375404/WME%20RTL%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/375404/WME%20RTL%20Support.meta.js
// ==/UserScript==

GM_addStyle (
`
    body {
        direction: rtl;
    }

    .restrictions-summary .direction-icons {
        margin-left: 8px;
    }

    .controls-container input[type="checkbox"]:not(:checked):checked + label:before, .controls-container input[type="checkbox"]:checked:checked + label:before {
        left: auto !important;
        right: 12px !important;
    }

    .layer-switcher .controls-container input + label .label-text {
        position: absolute;
        right: 30px;
    }

    .restrictions-summary .btn.do-create {
        margin-right: 32px;
    }

    #edit-panel .edit-restrictions:before, .edit-panel .edit-restrictions:before {
        left: 8px !important;
    }

    #app-head aside #brand {
        padding-right: 15px;
    }

    .nav {
        padding-right: 0px;
        padding-left: auto !important;
    }

    .toolbar .toolbar-group {
        float: right !important;
    }

    .toolbar .toolbar-icon {
        width: 100px !important;
    }

    .layer-switcher .menu {
        left: 0 !important;
        right: auto !important;
    }

    .topbar .location-info-region {
        float: right !important;
    }

    .WazeControlPermalink {
        float: left !important;
    }

    .list-unstyled {
        padding-right: 0px !important;
    }

    .dropdown-menu li a {
        text-align: right
    }

    #WazeMap .map-message {
        left: auto !important;
        right: 23px;
    }

    .tab-content > .active {
        direction: ltr;
    }

    #sidepanel-WMEmagic {
        direction: rtl;
    }

    .feed-issues {
        direction: rtl;
    }

    .settings .side-panel-section {
        direction: rtl;
    }

    .result-list-container {
        direction: rtl;
    }

    .olControlAttribution {
        left: 250px !important;
        right: 20px !important;
        margin-left: auto !important;
        margin-right: 0px !important;
    }

    #sidebar {
        float: right !important;
    }

    #sidebar #advanced-tools {
        padding-top: 45px;
    }

    .row-fluid #sidebar {
        position: absolute !important;
    }

    .toolbar .toolbar-button {
        float: left !important;
    }

    .show-sidebar .row-fluid .fluid-fixed {
        margin-right: 330px !important;
        margin-left: 0 !important;
    }

    .toolbar menu.dropdown-menu {
        right: 0px !important;
    }

    #chat-overlay {
        right: 20px;
        left: auto !important;
    }

    #overlay-buttons {
        right: auto !important;
        left: 12px !important;
    }

    #launchDiv {
        right: 70px !important;
        left: auto !important;
    }

    #edit-buttons .toolbar-group .toolbar-group-item .item-icon {
        right: 0px !important;
    }

    #edit-buttons .toolbar-group .toolbar-group-item .menu-title {
        padding-right: 30px !important;
    }


`);