// ==UserScript==
// @name         MVNU Moodle - Dark Mode
// @namespace    https://onyxsimple.com
// @version      0.2.6
// @description  Injects CSS to style MVNU's Moodle distribution with a dark theme.
// @author       Jason Fraley (Z8MB1E)
// @match        https://courses.mvnu.edu/*
// @exclude      https://courses.mvnu.edu/login/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412757/MVNU%20Moodle%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/412757/MVNU%20Moodle%20-%20Dark%20Mode.meta.js
// ==/UserScript==

var style = `
    .page {
        background: #2b2e2f;
    }
    .page-aside *, .site-navbar .navbar-container, .navbar-container .container-fluid, .list-group-item, .navbar-brand-logo {
        background: #222;
    }
    .site-menubar {
        background: #15191b;
    }
    a .active, .nav-link .active {
        color: white;
    }
    a, .nav-link {
        color: lightgrey;
    }
    h1,h2,h3,h4,h5,h6, .day, .weekend day{
        color:ghostwhite !important;
    }
    p,span {
        color: ghostwhite;
    }
    div {
        color: lightgrey;
    }
    .btn {
        color: ghostwhite;
        background: transparent;
    }
    .btn-group .btn {
        color: lightgrey;
        border-color: #2e5061;
    }
    .btn-group .btn-default.focus, .btn-default:focus, .btn-default:hover {
        color: white;
        border-color: #2e5061;
        background: transparent;
    }
    .btn-outline.btn-default {
        border-color: #323738a6;
    }
    .btn-outline.btn-default:hover {
        border-color: #394448;
    }
    .btn-default.active, .btn-default:active, .open>.btn-default.dropdown-toggle {
        color: white;
        background: #263238;
        border-color: #2e5061;
    }
    .btn-default.active.focus, .btn-default.active:focus, .btn-default.active:hover, .btn-default:active.focus, .btn-default:active:focus, .btn-default:active:hover, .open>.btn-default.dropdown-toggle.focus, .open>.btn-default.dropdown-toggle:focus, .open>.btn-default.dropdown-toggle:hover {
        border-color: #2870a0;
        background: #2870a0;
    }
    .nav-tabs-line .nav-item.open .nav-link, .nav-tabs-line .nav-item.open .nav-link:focus, .nav-tabs-line .nav-item.open .nav-link:hover, .nav-tabs-line .nav-item.show .nav-link, .nav-tabs-line .nav-item.show .nav-link:focus, .nav-tabs-line .nav-item.show .nav-link:hover, .nav-tabs-line .nav-link.active, .nav-tabs-line .nav-link.active:focus, .nav-tabs-line .nav-link.active:hover {
        color: ghostwhite;
    }
    .nav-tabs .nav-link {
        color: lightgrey;
    }
    .dropdown-menu-media .dropdown-menu-header {
        background: #222;
        border: none;
    }
    .dropdown-menu-media>.dropdown-menu-footer {
        border-top: 1px solid #444;
        background-color: #202a2f;
    }
    .dropdown-menu {
        border: none;
        background: #222;
    }
    .card-block {
        background: #222;
        color: white;
    }
    .card-block .card-title a {
        color: white !important;
    }
    .section .activity.page {
        background: #222;
    }
    .page-aside-right .page-aside .page-aside-inner {
        border-left: 1px solid #333;
    }
    .section .activity.list-group-item:first-child, .list-group-dividered .list-group-item {
        border-top-color: #526069;
    }
    .to-top {
        box-shadow: 0 0 10px 2px #161d21;
    }
    .form-control.focus, .form-control:focus {
        border-color: #57c7d4;
        color: ghostwhite;
    }
    .page-aside-section::after {
        border-bottom: 1px solid #526069;
    }
    .forumpost.unread .row.header, .path-course-view .unread, span.unread {
        background: unset;
    }
    .form-control {
        background: #333;
        color: ghostwhite;
    }
    .chat-left .chat-content {
        background: linear-gradient(#f96868,#f2a654);
    }
    .messaging-area-container .messaging-area .messages-area .response, .messaging-area-container .messaging-area .contacts-area .tabs .tab {
        background-color: #333;
    }
    .messaging-area-container .status .offline-text, .messaging-area-container .status .online-text {
        margin-left: 15px;
    }
    #page-enrol-users #filterform, .card, .groupinfobox, .que .history, .userprofile .profile_tree section, .well, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax #chat-messages .chat-message.course-theme, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax .yui-layout-unit-bottom, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax .yui-layout-unit-right {
        background: #333;
    }
    .nav-tabs-line .nav-item.open .nav-link, .nav-tabs-line .nav-item.open .nav-link:focus, .nav-tabs-line .nav-item.open .nav-link:hover, .nav-tabs-line .nav-item.show .nav-link, .nav-tabs-line .nav-item.show .nav-link:focus, .nav-tabs-line .nav-item.show .nav-link:hover, .nav-tabs-line .nav-link.active, .nav-tabs-line .nav-link.active:focus, .nav-tabs-line .nav-link.active:hover {
        border-bottom: 2px solid ghostwhite;
    }
    .generaltable, .table, table.collection, table.flexible {
        color: ghostwhite;
    }
    .category_subcategories tbody tr:hover, .forumheaderlist tbody tr:hover, .generaltable tbody tr:hover, .table-hover tbody tr:hover, table#modules tbody tr:hover, table#permissions tbody tr:hover, table.flexible tbody tr:hover, table.grading-report tbody tr:hover {
        background: #444;
        color: white;
    }
    .path-grade-report-user .user-grade.generaltable .levelodd, .path-grade-report-user .user-grade.generaltable .leveleven {
        background-color: #424444;
    }
    #page-admin-course-index .editcourse tbody tr:nth-of-type(odd), .forumheaderlist tbody tr:nth-of-type(odd), .generaltable tbody tr:nth-of-type(odd), .table-striped tbody tr:nth-of-type(odd), form#movecourses table tbody tr:nth-of-type(odd), table#defineroletable tbody tr:nth-of-type(odd), table#explaincaps tbody tr:nth-of-type(odd), table#listdirectories tbody tr:nth-of-type(odd), table.collection tbody tr:nth-of-type(odd), table.flexible tbody tr:nth-of-type(odd), table.grading-report tbody tr:nth-of-type(odd), table.rolecaps tbody tr:nth-of-type(odd), table.userenrolment tbody tr:nth-of-type(odd) {
        background-color: #444;
    }
    #page-admin-course-index .editcourse tbody td a, .forumheaderlist tbody td a, .generaltable tbody td a, form#movecourses table tbody td a, table#defineroletable tbody td a, table#explaincaps tbody td a, table#listdirectories tbody td a, table.collection tbody td a, table.flexible tbody td a, table.grading-report tbody td a, table.rolecaps tbody td a, table.userenrolment tbody td a {
        color: ghostwhite;
    }
    .category_subcategories tbody tr:hover, .forumheaderlist tbody tr:hover, .generaltable tbody tr:hover, .table-hover tbody tr:hover, table#modules tbody tr:hover, table#permissions tbody tr:hover, table.flexible tbody tr:hover, table.grading-report tbody tr:hover, .category_subcategories tbody tr:hover, .forumheaderlist tbody tr:hover, .generaltable tbody tr:hover, .table-hover tbody tr:hover, table#modules tbody tr:hover, table#permissions tbody tr:hover, table.flexible tbody tr:hover, table.grading-report tbody tr:hover {
        background-color: #37474f;
    }
    #page-enrol-users #filterform, .card, .groupinfobox, .que .history, .userprofile .profile_tree section, .well, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax #chat-messages .chat-message.course-theme, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax .yui-layout-unit-bottom, .yui-skin-sam .yui-layout.path-mod-chat-gui_ajax .yui-layout-unit-right {
        background: #222;
    }
    .panel {
        background: #222;
    }
    .que .info {
        background: none;
    }
    .que .content {
        border: 1px solid #2f2f2f;
    }
    .path-mod-quiz #mod_quiz_navblock .qnbutton .thispageholder {
        background: none;
    }
    .modal-content, .moodle-dialogue-base .moodle-dialogue-wrap.moodle-dialogue-content {
        background-color: #333;
    }
    #page-admin-index .adminwarning, .alert-warning, .que .comment, .que .outcome, .uninstalldeleteconfirmexternal {
        background-color: rgb(56 56 56 / 80%);
    }
     table.quizreviewsummary th.cell, table.quizreviewsummary td.cell {
        background: #263238 !important;
    }
    #gridshadebox_content {
        background: #222;
        border: solid 2px #263238;
    }
    .ui-widget-content, .ui-widget-header {
        background: #333 !important;
        color: lightgrey;
    }
    .listbar, .listbar input, .listbar select {
        border: 1px solid #444;
        background: #333;
    }
    .partDetails {
        border: 1px solid #444;
    }
    .ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active {
        background: lightgrey;
    }
    table.dataTable, table.dataTable th, table.dataTable td {
        color: black;
    }
    .path-mod-assign td.submissionnotgraded, .path-mod-assign div.submissionnotgraded {
        color: ghostwhite;
        background-color: #526069;
    }
    .ftoggler {
        background: #333;
    }
    .fcontainer {
        border: 4px solid #333;
    }
    div.editor_atto_toolbar div.atto_group, div.editor_atto_toolbar, div.editor_atto_toolbar button {
        background: #222;
    }
    div.editor_atto_toolbar button+button {
        border: none;
    }
    .file-picker .fp-content {
        background: #333;
    }
    .alert-success, .que .comment {
        background: rgb(82 115 101 / 80%);
        border: none;
    }
    .quiztimer {
        display: none;
    }
`;

// document.getElementById('darkModeStyle').innerHTML = style;

function setCookie(cname, cvalue, exdays) {
    if (exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

(function () {
    'use strict';

    var nodes = document.getElementsByTagName("*");

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("bg-white");
    }

    // Determine if Dark Mode is activated
    var darkmode = false;

    function toggleDarkMode(force) {
        if (force) {
            setCookie("darkmode", "true");
            document.body.appendChild(css);
            document.getElementById('toggleDarkModeIcon').classList.replace("fa-moon-o", "fa-sun-o");
        }
        if (!darkmode) {
            setCookie("darkmode", "true");
            document.body.appendChild(css);
            document.getElementById('toggleDarkModeIcon').classList.replace("fa-moon-o", "fa-sun-o");
        } else {
            setCookie("darkmode", "false");
            document.getElementById('darkModeStyle').remove();
            document.getElementById('toggleDarkModeIcon').classList.replace("fa-sun-o", "fa-moon-o");
        }
        darkmode = !darkmode;
    }

    // Establish the new Dark Mode theme
    var css = document.createElement('style');

    css.id = "darkModeStyle";
    css.innerHTML = style;


    // Add a toggle button for toggling dark mode on the webpage
    var darkModeBtn = document.createElement('li');
    darkModeBtn.classList.add("nav-item");
    darkModeBtn.id = "toggleDarkMode";
    darkModeBtn.innerHTML = "<a id=\"toggleDarkModeLink\" class=\"nav-link\" role=\"button\" href=\"#\"><i id=\"toggleDarkModeIcon\" class=\"icon fa fa-moon-o\" aria-hidden=\"true\"></i></a>";

    document.getElementsByClassName("nav navbar-toolbar navbar-right navbar-toolbar-right")[0].insertAdjacentElement("afterbegin", darkModeBtn);

    document.getElementById('toggleDarkMode').onclick = function () {
        toggleDarkMode()
    };

    // Finalize and apply all changes
    // document.body.appendChild(darkmode);
    if (getCookie("darkmode") == "true") {
        toggleDarkMode(true);
    }

    // REMOVE UNWANTED ELEMENTS FROM THE PAGE //
    document.getElementsByClassName("alert alert-success dark text-center rounded-0")[0].style.display = 'none';
})();