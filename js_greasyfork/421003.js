// ==UserScript==
// @name         PSARips Dark Theme
// @version      1.0.0
// @description  Go gentle into that good night!
// @author       apalapuciaa
// @icon         https://psarips.uk/favicon.ico

// @match        https://psarips.uk/
// @match        https://psarips.uk/*
// @match        https://PSArips.com/
// @match        https://psarips.com/*
// @match        https://PSArips.xyz/
// @match        https://psarips.xyz/*
// @match        https://PSArips.one/
// @match        https://psarips.one/*
// @match        https://get-to.link/*
// @match        https://psa.one/
// @match        https://psa.one/*
// @match        https://PSArips.in/
// @match        https://PSArips.in/*
// @match        https://PSArips.net/
// @match        https://PSArips.net/*
// @match        https://PSArips.org/
// @match        https://PSArips.org/*
// @match        https://PSArips.eu/
// @match        https://PSArips.eu/*


// @grant        GM_addStyle
// @run-at       document-body
// @namespace https://greasyfork.org/users/25284
// @downloadURL https://update.greasyfork.org/scripts/421003/PSARips%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/421003/PSARips%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS'ler

    var styles =`

body {   background: #171717;    color: #666;}

body {   background-color: #171717!important;}

#footer {    background: #0c0c0c;    color: #bdbdbd;}

h1, h2, h3, h4, h5, h6 {    color: #bdbdbd;}

#footer a {   color: #bdbdbd;}

#footer .alx-posts li, #footer .alx-tab li, #footer .widget_archive ul li, #footer .widget_calendar td, #footer .widget_calendar th, #footer .widget_categories ul li, #footer .widget_links ul li, #footer .widget_meta ul li, #footer .widget_nav_menu ul li a, #footer .widget_pages ul li a, #footer .widget_recent_comments ul li, #footer .widget_recent_entries ul li, #footer .widget_rss ul li
{
    border-color: #3e3e3e;
}

.alx-posts li, .alx-tab li, .widget_archive ul li, .widget_categories ul li, .widget_links ul li, .widget_meta ul li, .widget_nav_menu ul li a, .widget_pages ul li a, .widget_recent_comments ul li, .widget_recent_entries ul li, .widget_rss ul li
{
    border-bottom: 1px solid #3e3e3e;
}

#wp-calendar > thead > tr > th { background: #000;}

#footer-bottom {    background: #171717;}

#footer-bottom #back-to-top {    background: #000000;    color: #bdbdbd;}

#footer-bottom #back-to-top:hover {    color: #fff;}

.main {    background-color: #0c0c0c!important;    color: #bdbdbd;}

.main-inner {     background: #0c0c0c!important;}

#wpd-post-rating .wpd-rating-wrap .wpd-rating-value {    background-color: #3c3c3c;    border: 1px dashed #3c3c3c;}

#wpd-post-rating .wpd-rating-wrap .wpd-rating-value span {    color: #bdbdbd;}

#wpd-post-rating .wpd-rating-wrap .wpd-rating-left  {   border-bottom: 1px dashed #3c3c3c;}

#wpd-post-rating .wpd-rating-wrap .wpd-rating-right {   border-bottom: 1px dashed #3c3c3c;}

.post-title {    color: #bdbdbd;}

.page-title {  background: #0c0c0c;    border-bottom: 1px solid #3c3c3c;    color: #bdbdbd;}

.hr, hr {   background: #0c0c0c;    border-bottom: 2px solid #3c3c3c;}

.sp-wrap-steelblue {   background: none repeat scroll 0% 0% #171717;    border-color: #171717;}

.sp-wrap-steelblue .sp-head {   color: #bdbdbd;}

.sp-wrap-steelblue .sp-body {    background: #292929;    border-top: 1px solid #171717;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 1px solid #9eef93; height:; background-color:#ffffff;    "] {    border: 1px solid #0c0c0c!important;  height:;  background-color: #0c0c0c!important;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 1px solid #fa8787; height:; background-color:#defde9;    "] {    border: 1px solid #0c0c0c!important;  height:;  background-color: #0c0c0c!important;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 1px solid lime; height:; background-color:white;    "] {    border: 1px solid #0c0c0c!important;  height:;  background-color: #0c0c0c!important;}

.post-tags a {    background: #333333;    color: #bdbdbd;}

.post-title a {   color: #bdbdbd;}

.related-posts {    border-bottom: 2px solid #3c3c3c;}

#wpdcom .wpd-form-head {    border-bottom: 1px solid #3c3c3c;}

#wpdcom .wpd-form-wrap .wpd-login-to-comment {   color: #bdbdbd;}

#wpdcom .wpd-thread-head {    border-bottom: 2px solid #3c3c3c;}

.wpd-comment-text {    color: #bdbdbd !important;}

#wpdcom.wpd-layout-2 .wpd-comment.wpd-reply .wpd-comment-wrap {     background-color: #0c0c0c;    border-left: 3px solid #3c3c3c;}

.widget, .widget a {    color: #bdbdbd;}

.sidebar .sidebar-content, .sidebar .sidebar-toggle {   background: #000000;}

.alx-posts .post-item-title a, .alx-tab .tab-item-comment a, .alx-tab .tab-item-title a {    color: #bdbdbd;}

.post-list .post-row {    border-bottom: 1px solid #3c3c3c;}

.search-form input[type=search], .themeform input[type=number], .themeform input[type=text], .themeform input[type=password], .themeform input[type=email], .themeform input[type=url], .themeform input[type=tel], .themeform select, .themeform textarea {    background: #171717;    border: 2px solid #171717;    color: #bdbdbd;  }

.search-form input[type=search]:focus, .themeform input[type=number]:focus, .themeform input[type=text]:focus, .themeform input[type=password]:focus, .themeform input[type=email]:focus, .themeform input[type=url]:focus, .themeform input[type=tel]:focus, .themeform select:focus, .themeform textarea:focus {    border-color: #171717;    color: #bdbdbd;    -webkit-box-shadow: 0 0 3px rgba(0,0,0,.1);    box-shadow: 0 0 3px rgb(0 0 0);}

.notebox {    background: #171717;    color: #bdbdbd;}

.notebox:before {   border-bottom: 8px solid #171717;}

.notebox:after  {   border-bottom: 6px solid #171717;}

.featured, .featured.flexslider {    border-bottom: 1px solid #3c3c3c;}

.wp-pagenavi a:active, .wp-pagenavi a:hover, .wp-pagenavi span.current {    border-top: 1px solid #0c0c0c;}

.wp-pagenavi a {   border-bottom: 3px solid #0c0c0c;    border-top: 1px solid #0c0c0c;}

.login form {    background: #0c0c0c;    border: 1px solid #0c0c0c;    box-shadow: 0 1px 3px #0c0c0c00;}

.login #login_error, .login .message, .login .success {   background-color: #0c0c0c; color: #bdbdbd;}

.login label {    color: #bdbdbd;}

.login form .input, .login form input[type=checkbox], .login input[type=text] {   background: #171717; color: #bdbdbd;}

.wp-core-ui .button-primary {    color: #000;}

.form-table th, .form-wrap label {    color: #bdbdbd;}

.color-option.selected, .color-option:hover {    background: #0c0c0c;}

input[type=color], input[type=date], input[type=datetime-local], input[type=datetime], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week], select, textarea { border: 1px solid #3c3c3c;    background-color: #3c3c3c;    color: #bdbdbd;}

#password > td > button {      border-color: #0c0c0c;    background: #0c0c0c;}

.wp-core-ui .button-disabled, .wp-core-ui .button-secondary.disabled, .wp-core-ui .button-secondary:disabled, .wp-core-ui .button-secondary[disabled], .wp-core-ui .button.disabled, .wp-core-ui .button:disabled, .wp-core-ui .button[disabled] {    color: #bdbdbd!important;    border-color: #000!important;    background: #000000!important; }

.wp-core-ui select {    color: #ccc;    border-color: #0c0c0c;    background: #0c0c0c url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%206l5%205%205-5%202%201-7%207-7-7%202-1z%22%20fill%3D%22%23555%22%2F%3E%3C%2Fsvg%3E) no-repeat right 5px top 55%;}

.postbox {    border: 1px solid #0c0c0c;    background: #0c0c0c;}

.community-events-footer {    border-top: 1px solid #3c3c3c;}

.postbox-header {    border-bottom: 1px solid #3c3c3c;}

.community-events li:first-child {    border-top: 1px solid #0c0c0c;}

.community-events .activity-block.last {    border-bottom: 1px solid #0c0c0c;}

.community-events ul {    background-color: #000;}

#dashboard-widgets h3, #dashboard-widgets h4, #dashboard_quick_press .drafts h2 {   color: #bdbdbd;}

#community-events-location-message {   color: #bdbdbd;}

.activity-block {    border-bottom: 1px solid #3c3c3c;}

#latest-comments #the-comment-list .comment-meta {   color: #bdbdbd;}

#activity-widget #the-comment-list .comment-item {    background: #0c0c0c;}

#dashboard-widgets .postbox-container .empty-container {    outline: 3px dashed #3c3c3c;}

ul#adminmenu a.wp-has-current-submenu:after, ul#adminmenu>li.current>a.current:after {   border-right-color: #171717;}

#contextual-help-wrap, #screen-options-wrap {    background: #0c0c0c;}

#screen-meta {    background-color: #0c0c0c;    border: 1px solid #0c0c0c;  }

#contextual-help-wrap h5, #screen-options-wrap h5, #screen-options-wrap legend {    color: #bdbdbd;}

.wp-die-message, p {    color: #bdbdbd;}

#screen-meta-links .show-settings {    border: 1px solid #0c0c0c;    background: #0c0c0c;    color: #bdbdbd;}

#screen-meta-links .show-settings:hover {color: #ccc;}

#screen-meta-links .show-settings:focus {color: #ccc;}

#contextual-help-back {    border: 1px solid #000000;    background: #000000;}

.contextual-help-tabs .active {    background: #000000;}

.contextual-help-tabs .active a {    border-color: #000000;    color: #bdbdbd;}

#wpadminbar {    background: #26272b;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 2px solid orange; height:; background-color:white;    "] {background-color:#0c0c0c!important;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 2px solid green; height:; background-color:white;    "] {background-color:#0c0c0c!important;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 2px solid red; height:; background-color:white;    "] {background-color:#0c0c0c!important;}

div div.dropshadowboxes-drop-shadow.dropshadowboxes-rounded-corners.dropshadowboxes-inside-and-outside-shadow.dropshadowboxes-lifted-both.dropshadowboxes-effect-default[style*=" border: 2px solid purple; height:; background-color:white;    "] {background-color:#0c0c0c!important;}

#wpdcom .ql-editor > * {    color: #bdbdbd;}

#wpdcom .ql-editor {    border-bottom-color: #171717;}

div#wpd-editor-wraper-0_0 div#wpd-editor-0_0.ql-container.ql-snow[style*="border-bottom: 1px solid rgb(221, 221, 221);"] {border-bottom: 1px solid #171717!important;}

#wpdcom .ql-container {    border: 1px solid #171717; background: #171717; border-bottom-color: #171717;}

#wpdcom > div.wpd-form-wrap > div.wpd-form-head > div > div {    color: #bdbdbd;}

.entry .wp-caption, .entry table tr.alt { background: #171717;}

div.wpforms-container-full .wpforms-form .wpforms-field-label {    color: #bdbdbd;}

div.wpforms-container-full .wpforms-form input[type=date], div.wpforms-container-full .wpforms-form input[type=datetime], div.wpforms-container-full .wpforms-form input[type=datetime-local], div.wpforms-container-full .wpforms-form input[type=email], div.wpforms-container-full .wpforms-form input[type=month], div.wpforms-container-full .wpforms-form input[type=number], div.wpforms-container-full .wpforms-form input[type=password], div.wpforms-container-full .wpforms-form input[type=range], div.wpforms-container-full .wpforms-form input[type=search], div.wpforms-container-full .wpforms-form input[type=tel], div.wpforms-container-full .wpforms-form input[type=text], div.wpforms-container-full .wpforms-form input[type=time], div.wpforms-container-full .wpforms-form input[type=url], div.wpforms-container-full .wpforms-form input[type=week], div.wpforms-container-full .wpforms-form select, div.wpforms-container-full .wpforms-form textarea
{ background-color: #171717;    color: #bdbdbd;    border: 1px solid #171717;}

div.wpforms-container-full .wpforms-form input[type=submit], div.wpforms-container-full .wpforms-form button[type=submit], div.wpforms-container-full .wpforms-form .wpforms-page-button {background-color: #171717;border: 1px solid #171717; color: #ccc;}

div.wpforms-container-full .wpforms-form input[type=submit]:hover, div.wpforms-container-full .wpforms-form input[type=submit]:focus, div.wpforms-container-full .wpforms-form input[type=submit]:active, div.wpforms-container-full .wpforms-form button[type=submit]:hover, div.wpforms-container-full .wpforms-form button[type=submit]:focus, div.wpforms-container-full .wpforms-form button[type=submit]:active, div.wpforms-container-full .wpforms-form .wpforms-page-button:hover, div.wpforms-container-full .wpforms-form .wpforms-page-button:active, div.wpforms-container-full .wpforms-form .wpforms-page-button:focus
{  background-color: #000;  border: 1px solid #000; color: #fff;}

.sidebar.s2 .sidebar-top, .sidebar.s2 .sidebar-toggle, .post-comments, .jp-play-bar, .jp-volume-bar-value, .sidebar.s2 .widget_calendar caption {   border-radius: 0px 10px 10px 0px;}

.sp-wrap-steelblue .spdiv {    color: #bdbdbd;}

.comment code:not([lang]), .entry code:not([lang]) {   background: #3c3c3c;}



/* Getlink START */

.footer-bottom {   border-top: 1px solid #0c0c0c;}

.site-footer   {   background-color: #0c0c0c;}

/* Getlink END */

`

    GM_addStyle( styles );



    })();