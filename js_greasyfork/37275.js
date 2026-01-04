// ==UserScript==
// @name         Zendesk Dark Mode - RES Version
// @namespace    plugable.com
// @version      0.2
// @description  This userscript is simple and designed to increase visibility of the Internal Comment 'haze'.
// @author       Derek Nuzum, Sam Morgan
// @match        https://*.zendesk.com/*
// @grant        none
// @license         MIT - https://opensource.org/licenses/MIT
// @copyright       Copyright (C) 2017, by Derek Nuzum <derek@plugable.com>
// @downloadURL https://update.greasyfork.org/scripts/37275/Zendesk%20Dark%20Mode%20-%20RES%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/37275/Zendesk%20Dark%20Mode%20-%20RES%20Version.meta.js
// ==/UserScript==

//DO NOT TOUCH THIS AREA
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//END DO NOT TOUCH AREA

//CUSTOMIZATION BEGINS HERE

//Change Styling Here

//Highest Level Container
addGlobalStyle('.container {background-color: #262626;};');
//Header
addGlobalStyle('#branding_header {background: #696969 !important; border-bottom: 1px #333333 solid; border-color: #333333 !important;}');
//Left Navbar
addGlobalStyle('#main_navigation {background: #696969 !important; border-right: 1px #333333 solid; border-color: #333333 !important;}');
//Tabs
addGlobalStyle('#branding_header #tabs .add {background: #262626; height: inherit; width: auto;};');
addGlobalStyle('#tabs .tab {border-bottom: 1px solid #333333;};');
addGlobalStyle('#tabs .tab > .tab-content-holder .tab_text {color: #CCCCCC !important;};');
addGlobalStyle('#tabs .tab > .tab-content-holder .close {color: #333333;};');
addGlobalStyle('#tabs .tab.selected .tab-content-holder {background: #262626 !important;};');
addGlobalStyle('#tabs .tab:not(.add):not(.overflow-tab) {background: #262626; border-right: 1px solid #333333; border-left: 0 solid #333333; border-bottom: 1px solid #333333;};');
//Tab Popover
addGlobalStyle('.ticket-tab-hover .popover-inner {background-color: #262626;};');
addGlobalStyle('.ticket-tab-hover .popover-title {background: #262626; color: #333333;};');
addGlobalStyle('.ticket-tab-hover .popover-content {background: #262626; color: #DEDEDE;};');
//Header Right Side Menus
addGlobalStyle('.channels-control #voice-control {display: none !important;};');
addGlobalStyle('#zd-product-tray {color: #DEDEDE;};');
addGlobalStyle('.zd-product-tray-toggle {color: #3D6EC5;};');
addGlobalStyle('#zd-product-tray > div {background-color: #333333;};');
//Header SVG Icons
addGlobalStyle('#tabs .mail.tab > .tab-content-holder .icon, #tabs .mail.selected > .tab-content-holder .icon {background-color: #333333; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .overflow-tab.tab > .tab-content-holder .icon, #tabs .overflow-tab.selected > .tab-content-holder .icon {background-color: #333333; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .add.tab > .tab-content-holder .icon, #tabs .add.selected > .tab-content-holder .icon {background-color: #333333; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .web.tab > .tab-content-holder .icon, #tabs .web.selected > .tab-content-holder .icon {background-color: #333333; border: 1px solid; border-radius: 5px;};');
//More Menu
addGlobalStyle('#tabs .tab.overflow-tab .overflow-tabs-container {background: #262626;};');
addGlobalStyle('#tabs .search.tab > .tab-content-holder .icon, #tabs .search.selected > .tab-content-holder .icon {background-color: #333333; border: 1px solid; border-radius: 5px;};');
addGlobalStyle('#tabs .tab.overflow-tab .overflow-tabs-container .tab:hover {background: #262626};');
//Add Menu
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner {background: #262626; color: #DEDEDE; border: 1px solid #333333;};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .popover-title {background: #262626; color: #DEDEDE; border-color: #333333};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .popover-content {background: #262626; color: #DEDEDE;};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .links-section a {color: #8cb3d9};');
addGlobalStyle('#tabs .tab .popover.bottom.add .popover-inner .links-section li:hover {background: #8cb3d9;};');
addGlobalStyle('#tabs .tab .recent-ticket:hover {background: #262626;};');
//Profile Menu
addGlobalStyle('.c-menu {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.c-menu__item {color: #DEDEDE;};');
addGlobalStyle('.c-menu__item.is-selected, .c-menu__item:hover {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.c-menu__separator {border-bottom: 1px solid #333333;};');
//Search
addGlobalStyle('#branding_header #user_options .header-search.collapsed .search-dropdown .zd-searchmenu-base {background-color: #262626 !important; border: none 1px #333333 !important;};');
addGlobalStyle('#branding_header #user_options .header-search.expanded .zd-searchmenu-base {background-color: #262626 !important; color: #DEDEDE !important; border: solid 1px #333333 !important;};');
addGlobalStyle('#branding_header #user_options .header-search.expanded > .search-icon {color: #DEDEDE !important;};');
addGlobalStyle('#branding_header #user_options .header-search.collapsed > .search-icon {color: #DEDEDE !important;};');
addGlobalStyle('#tabs .tab.selected.search .tab-content-holder {border-bottom: #333333;};');

//Ticket View
addGlobalStyle('.main_panes > header, .workspace > header {background-color: #262626; border-bottom: 1px #333333 solid;};');
addGlobalStyle('.main_panes > header .pane .btn, .workspace > header .pane .btn {background-color: #262626; color: #DEDEDE; border: 1px solid #333333;};');
addGlobalStyle('.main_panes > header .pane .btn:active, .main_panes > header .pane .btn.active, .main_panes > header .pane .btn:hover, .workspace > header .pane .btn:active, .workspace > header .pane .btn.active, .workspace > header .pane .btn:hover {background-color: #262626 !important;};');
addGlobalStyle('.main_panes > header .pane .btn-group span:last-of-type, .workspace > header .pane .btn-group span:last-of-type {#333333; background-color: #212121 !important; border-color: #333333;};');
addGlobalStyle('.section.ticket .notice {background: #212121; border-bottom: 1px dotted #333333;};');
addGlobalStyle('.section.ticket .notice p.pre {color: #DEDEDE;};');


//Ticket View > Sidebar
addGlobalStyle('.left.pane .property_box_container {background: #262626;};');
addGlobalStyle('.ticket-sidebar .property_box {background: #262626; border-bottom: 1px solid #333333;};');
addGlobalStyle('.form_field label {color: #DEDEDE;};');
addGlobalStyle('.ticket-sidebar .zd-selectmenu-base, .ticket-sidebar .zd-tag-menu-root {color: #DEDEDE !important; background-color: #333333 !important; border: 1px solid #333333 !important;};');
addGlobalStyle('.zd-selectmenu-root, .zd-searchmenu-root, .zd-combo-selectmenu-root {color: #DEDEDE;};');
addGlobalStyle('select:focus, textarea:focus, .editable:focus, .editable input[type="text"]:focus, .focused, .token_list.ui-state-focus, .ui-selectmenu:focus, .zd-state-focus .zd-selectmenu-base, .zd-state-focus .zd-searchmenu-base {color: #DEDEDE !important; background-color: #333333 !important; border: 1px solid #333333 !important;};');
addGlobalStyle('.ticket-sidebar .form_field > input, .ticket-sidebar .form_field textarea, .ticket-sidebar .form_field .token_list, .ticket-sidebar .form_field .zd-menu-list-holder {color: #DEDEDE; background-color: #333333; border: 1px solid #333333;};');
addGlobalStyle('.zd-tag-item {background-color: #262626; border: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('.zd-tag-item a {color: #DEDEDE; font-weight: 500;};');
addGlobalStyle('.ticket-sidebar .form_field > input:focus, .ticket-sidebar .form_field textarea:focus {border-color: #333333 !important;};');
addGlobalStyle('.ticket_collision {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.notification.v2 {background-color: #262626; border: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('.left.pane.ticket-sidebar.section {background-color: #262626;};');
addGlobalStyle('.notification.v2 .btn {background-color: #212121; border-color: #333333; color: #DEDEDE;};');
addGlobalStyle('.zd-menu-item.zd-item-focus {background-color: #262626;};');
addGlobalStyle('.zd-menu-root {background-color: #262626;};');
addGlobalStyle('.zd-menu-link > a {color: #DEDEDE;};');
addGlobalStyle('.zd-selectmenu-base-content {color: #DEDEDE;};');
addGlobalStyle('.zd-menu-back-link > a {#8cb3d9 !important;};');
addGlobalStyle('.user-picker-menu .zd-menu-footer, .ccs-menu .zd-menu-footer, .requester-menu .zd-menu-footer {border: 1px solid #333333 !important; background-color: #262626;};');
addGlobalStyle('.user-picker-menu .add-user, .ccs-menu .add-user, .requester-menu .add-user {color: #DEDEDE;};');
addGlobalStyle('.zd-combo-selectmenu .zd-highlight, .zd-selectmenu .zd-highlight, .zd-searchmenu .zd-highlight {color: #DEDEDE !important;};');


//Ticket View > Ticket
addGlobalStyle('.section.ticket {background: #262626; color: #DEDEDE;};');
addGlobalStyle('.ticket .mast {background: #262626; border-bottom: 1px solid #333333;};');
addGlobalStyle('.mast .editable input {color: #DEDEDE;};');
addGlobalStyle('.mast .source {color: #DEDEDE;};');
addGlobalStyle('.mast .source a.email {color: #6A98AF;};');
addGlobalStyle('a {color: #5994BB; text-decoration: none;};');
addGlobalStyle('.icon-file {color: #5994BB;};');
addGlobalStyle('a:hover {color: #5994BB; text-decoration: underline;};');
addGlobalStyle('.btn-group.open .btn.dropdown-toggle:not(.btn-inverse) {#333333 !important;};');
addGlobalStyle('.mast .object_options .dropdown-menu {background-color: #262626;};');
addGlobalStyle('.dropdown-menu li a {color: #DEDEDE;};');
addGlobalStyle('.dropdown-menu li a:hover {color: #DEDEDE; background-color: #262626;};');
addGlobalStyle('.rich_text .comment-actions .btn.active {color: #DEDEDE; border-bottom-color: #DEDEDE;};');
addGlobalStyle('.rich_text .comment-actions .btn.active:hover {color: #DEDEDE;};');
addGlobalStyle('.comment_input {border-top: none !important;};');
addGlobalStyle('.comment_input .btn {color: #DEDEDE;};');
addGlobalStyle('.rich_text .comment-actions .btn:hover {color: #DEDEDE; text-decoration: underline;};');
addGlobalStyle('.zendesk-editor--toolbar {border: 1px solid #333333; background-color: #262626;};');
addGlobalStyle('.zendesk-editor--group li.active {box-shadow: 0px 0px 0px 1px #333333; background: #212121;};');
addGlobalStyle('.zendesk-editor--group li, .zendesk-editor--group li * {color: #DEDEDE;};');
addGlobalStyle('.zendesk-editor--menu {border: 1px solid #333333; background-color: #ff0000;};');
addGlobalStyle('.event .header .actor .name a {color: #6A98AF;};');
addGlobalStyle('ul.attachments li {background-color: #121212;};');
addGlobalStyle('.zendesk-editor--rich-text-comment code, .markdown_formatting code, .markdown_preview code, .event .comment code {border: 1px solid #333333; background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.zendesk-editor--rich-text-comment pre, .markdown_formatting pre, .markdown_preview pre, .event .comment pre {background-color: #262626; border: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('.event .header .meta .comment_menu .dropdown-menu {background-color: #262626;};');
addGlobalStyle('.main_panes > .pane.right, .workspace > .pane.right {border-left: 1px solid #333333;};');
addGlobalStyle('.section.ticket .tab-controls-container {border-bottom: 1px solid #333333;};');
addGlobalStyle('.dropdown-container .dropdown-toggle {color: #DEDEDE;};');
addGlobalStyle('.open .dropdown-menu {background-color: #262626;};');
addGlobalStyle('.dropdown-menu .selected::after {border: 1px solid #333333;};');
addGlobalStyle('.section.ticket .conversation-nav:after {border-right: 1px solid #333333;};');
addGlobalStyle('.c-tab__list {color: #DEDEDE};');
addGlobalStyle('.c-tab__list .c-tab__list__item.is-selected, .c-tab__list__dropdown .c-tab__list__item.is-selected {border-bottom-color: #DEDEDE; color: #DEDEDE;};');
addGlobalStyle('.c-tab__list .c-tab__list__item.is-selected:after, .c-tab__list__dropdown .c-tab__list__item.is-selected:after {background-color: #212121; color: #DEDEDE; border-color: #333333;};');
addGlobalStyle('.event {border-top: 1px solid #333333;};');
addGlobalStyle('.event.is-new {background-color: #262626; border-left-color: #333333;};');
addGlobalStyle('.event.is-new .is_new_flag {color: #DEDEDE;};');
addGlobalStyle('#editor-tooltip {background-color: #262626; border: 1px solid #333333; };');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment {border:1px solid #333333; background-color: #212121;};');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner:before {border-bottom: 14px solid #333333;};');
addGlobalStyle('.zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner:after {border-bottom: 12px solid #333333;};');
addGlobalStyle('.comment_input .zendesk-editor--attachments .zendesk-editor--attachment:not(.zendesk-editor--image) .zendesk-editor--corner {background-color: #262626;};');

//Ticket View > Events
addGlobalStyle('.event .audit-events {background: #262626;};');
addGlobalStyle('.event .audit-events .info label {color: #DEDEDE;};');

//Ticket View > Footer
addGlobalStyle('.ticket .ticket-resolution-footer {background: #212121; border-top: 1px solid #333333; border-left: 1px solid #333333;};');
addGlobalStyle('footer .object_options .dropdown-toggle, .footer .object_options .dropdown-toggle {color: #DEDEDE;};');
addGlobalStyle('.ticket_submit_buttons .save strong {color: #DEDEDE;};');
addGlobalStyle('.btn.btn-primary:hover, .btn.btn-inverse:hover {#DEDEDE;};');
addGlobalStyle('.ticket_submit_buttons li:hover:not(.disabled) {background-color: #262626;};');
addGlobalStyle('.ticket_submit_buttons li.status:not(.disabled) {color: #DEDEDE;};');
addGlobalStyle('.macro-selector .zd-selectmenu-base-content {color: #DEDEDE;};');
addGlobalStyle('.zd-selectmenu-base {background-color: #262626; border: 1px solid #333333;};');
addGlobalStyle('.zd-menu-list-holder {background-color: #262626;};');
addGlobalStyle('.zd-menu-item {background-color: #262626;};');
addGlobalStyle('.zd-menu-item > a {color: #DEDEDE;};');
addGlobalStyle('.macro-selector .zd-item-focus {background-color: #373737;};');
addGlobalStyle('.zd-menu-item.zd-item-focus a {color: #DEDEDE !important;};');
addGlobalStyle('.macro-selector .zd-menu-item.zd-menu-link:not(.zd-item-focus) > a {color: #DEDEDE !important;};');
addGlobalStyle('.macro-selector .zd-menu-root {background-color: #262626;};');
addGlobalStyle('.macro-selector:hover .zd-selectmenu-base-content {color: #DEDEDE;};');

//Dashboard > Header
addGlobalStyle('.main_panes > header h1, .workspace > header h1 {color: #DEDEDE;};');

//Dashboard > Activity Feed
addGlobalStyle('.activities h4, .activities .no-updates {color: #61d73a;};'); //Figure out where this is
addGlobalStyle('.activities .item {border: 1px solid #333333; background-color: #262626};');
addGlobalStyle('.activities .description {color: #DEDEDE;};');
addGlobalStyle('.activities .description strong {color: #DEDEDE;};');
addGlobalStyle('.activities .comment_value {color: #DEDEDE;};');
addGlobalStyle('.activities time {color: #DEDEDE};');

//Dashboard > Main Panel > Ticket Stats
addGlobalStyle('.indicators {background-color: #262626; border-bottom: 1px solid #333333;};');
addGlobalStyle('.indicators h4 {color: #DEDEDE;};');
addGlobalStyle('.indicators h4 > span {color: #DEDEDE};');
addGlobalStyle('.indicators ul {background-color: #262626; border: 1px solid #333333;};');
addGlobalStyle('.indicators .cell-value {color: #DEDEDE;};');
addGlobalStyle('.indicators .cell-title {color: #DEDEDE;};');

//Dashboard > Main Panel > Details
addGlobalStyle('h4.list-heading {background-color: #262626; border-bottom: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('h4.list-heading .link {color: #8CB3D9;};');
addGlobalStyle('.dashboard .filter-grid-list {background-color: #262626;};');

//Ticket List View > Sidebar
addGlobalStyle('.main_panes > .pane.left, .workspace > .pane.left {background-color: #262626;};');
addGlobalStyle('section.filters .left header h1, section.user_filters .left header h1, section.incidents .left header h1 {color: #DEDEDE !important; border-bottom: 1px solid #333333 !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.selected, .user_filters > .pane.left ul.filters li.selected, .user > .pane.left ul.filters li.selected {background-color: #262626 !important; color: #DEDEDE !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li a, .user_filters > .pane.left ul.filters li a, .user > .pane.left ul.filters li a {color: #DEDEDE !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.legacy-styling .count, .user_filters > .pane.left ul.filters li.legacy-styling .count, .user > .pane.left ul.filters li.legacy-styling .count {color: #DEDEDE !important;};');
addGlobalStyle('.filters > .pane.left .filter-group-heading, .user_filters > .pane.left .filter-group-heading, .user > .pane.left .filter-group-heading {border-bottom: 1px dotted #333333 !important; color: #DEDEDE; !important};');
addGlobalStyle('.filters > .pane.left .filters.more, .user_filters > .pane.left .filters.more, .user > .pane.left .filters.more {border-top: 1px dotted #333333 !important;};');
addGlobalStyle('.filters > .pane.left .filters.more a, .user_filters > .pane.left .filters.more a, .user > .pane.left .filters.more a {color: #DEDEDE !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li:not(.selected):hover, .user_filters > .pane.left ul.filters li:not(.selected):hover, .user > .pane.left ul.filters li:not(.selected):hover {background-color: #373737 !important;};');
addGlobalStyle('.filters > .pane.left ul.filters li.suspended_tickets a, .filters > .pane.left ul.filters li.deleted_tickets a, .user_filters > .pane.left ul.filters li.suspended_tickets a, .user_filters > .pane.left ul.filters li.deleted_tickets a, .user > .pane.left ul.filters li.suspended_tickets a, .user > .pane.left ul.filters li.deleted_tickets a {color: #bd322c !important;};');

//Ticket List View > Focused Panel
addGlobalStyle('section.filters .right header, section.user_filters .right header, section.incidents .right header {background-color: #262626;};');
addGlobalStyle('.split_pane.collapsible .pane.right {background-color: #262626;};');
addGlobalStyle('section.filters .right header h1, section.user_filters .right header h1, section.incidents .right header h1 {color: #DEDEDE;};');
addGlobalStyle('section.filters .right header .header-count, section.user_filters .right header .header-count, section.incidents .right header .header-count {color: #DEDEDE;};');
addGlobalStyle('.filter_tickets th a, .filter_tickets td a {color: #DEDEDE !important; border-color: #333333;};');
addGlobalStyle('.filter_tickets th, .filter_tickets td {color: #DEDEDE !important;};');
addGlobalStyle('.filter_tickets th {color: #DEDEDE !important;};');
addGlobalStyle('.filter_tickets:not(.deleted) .regular:hover td {background-color: #373737 !important;};');
//addGlobalStyle('.filter_tickets td {border-top: 1px solid #333333;};');
addGlobalStyle('.filter_tickets:not(.deleted) .regular:hover td a, .filter_tickets:not(.deleted) .regular:hover td .link {color: #8CB3D9 !important;};');

//Ticket List View > Hover Popover
addGlobalStyle('.ticket_summary .popover-inner {border: 1px solid #333333 !important;};');
addGlobalStyle('.ticket_summary h3 {color: #DEDEDE !important; background-color: #373737 !important;};');
addGlobalStyle('.popover-content {background-color: #373737 !important;};');
addGlobalStyle('.ticket_summary .popover-content {color: #DEDEDE !important;};');
addGlobalStyle('.ticket_summary .popover-content p {color: #DEDEDE !important;};');
addGlobalStyle('.ticket_summary .last-comment-header, .ticket_summary .next-sla-header, .ticket_summary .comments-header {color: #DEDEDE !important;};');
addGlobalStyle('.ticket_summary .summary-date {color: #DEDEDE !important;};');
addGlobalStyle('.ticket_summary .other-viewers {background-color: #212121 !important; color: #DEDEDE !important; border-bottom: 1px solid #333333 !important;};');
addGlobalStyle('.ticket_summary .comment.private-comment {border: 1px solid #333333 !important; background-color: #000000 !important;};');

//Settings > Main Page
addGlobalStyle('.stacked_menu_settings .section .title {border-bottom: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('#admin_content .overview header {background-color: #262626 !important; border-bottom: 1px solid #333333 !important;};');
addGlobalStyle('#admin_content .overview header h1 {color: #DEDEDE !important;};');
addGlobalStyle('#admin_content .overview header .right {color: #DEDEDE !important;};');
addGlobalStyle('#admin_content .overview header .right a {color: #DEDEDE !important;};');
addGlobalStyle('#admin_content .overview .overview_content {background-color: #262626;};');
addGlobalStyle('#admin_content .overview h3 {color: #DEDEDE !important; border-bottom: 1px solid #333333;};');
addGlobalStyle('#admin_content .overview .overview_content .feature_usages .feature_usage {border: 1px solid #333333 !important;};');
addGlobalStyle('#admin_content .overview .overview_content a {color: #DEDEDE !important;};');
addGlobalStyle('#admin_content .overview .overview_content .feature_usages .feature_usage .stat {color: #DEDEDE !important;};');
addGlobalStyle('#admin_content {background-color: #262626;};');
addGlobalStyle('#admin_content .overview .overview_content .system_updates li:hover {background-color: #262626 !important;};');
addGlobalStyle('#admin_content .overview .overview_content a:hover {color: #DEDEDE !important; text-decoration: none !important;};');
addGlobalStyle('#admin_content .overview .overview_content .system_updates .controls .newer, #admin_content .overview .overview_content .system_updates .controls .older {border: 1px solid #333333 !important; box-shadow: none !important;};');
addGlobalStyle('.nav-stacked > li.active a, .nav-stacked > li.active a:hover {color: #DEDEDE; background-color: #212121; box-shadow: none !important;};');
addGlobalStyle('.nav-stacked > li a:hover {background-color: #212121;};');

//Settings > Macros
addGlobalStyle('.macros-page {background-color: #262626;};');
addGlobalStyle('.macros-page .page__header header h1 {color: #333333 !important;};');
addGlobalStyle('.u-fg-oil {color: #333333 !important;};');
addGlobalStyle('.macros-page .page__description {color: #DEDEDE;};');
addGlobalStyle('.rule-search .z-field--input--text {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.z-field--date__input:focus, .z-field--input--text:focus, .z-field--textarea:focus {border-color: #333333 !important;};');
addGlobalStyle('.z-field--date__input, .z-field--input--text, .z-field--textarea {border: 1px solid #333333;};');
addGlobalStyle('.rule-search .z-field--input--text::placeholder {color: #DEDEDE;};');
addGlobalStyle('.rule-actions__tabs {border-bottom: 1px solid #333333;};');
addGlobalStyle('.z-tab.active {border-bottom: 3px solid #DEDEDE !important; color: #DEDEDE;};');
addGlobalStyle('.z-tab {color: #DEDEDE;};');
addGlobalStyle('.z-dropdown__toggle {color: #DEDEDE;};');
addGlobalStyle('.z-dropdown__menu {background-color: #262626; };');
addGlobalStyle('.z-dropdown__menu-item {color: #DEDEDE};');
addGlobalStyle('.z-dropdown__menu-item:not(.z-dropdown__menu-item--disabled):focus, .z-dropdown__menu-item:not(.z-dropdown__menu-item--disabled):hover {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.rule-table__row .rule-table__data a, .rule-table__row .rule-table__header {color: #DEDEDE;};');
addGlobalStyle('.rule-table__row .rule-table__data[data-column-id=name] a {color: #DEDEDE;};');
addGlobalStyle('.rule-table__row.hover:not(.rule-table__headers) {background-color: #262626;};');
addGlobalStyle('.rule-table__row .rule-table__data[data-column-id=name] a:hover {color: #DEDEDE; text-decoration: none;};');

//Settings > Macros > Add Macro
addGlobalStyle('.z-field__label__text {color: #DEDEDE;};');
addGlobalStyle('.rule-page--edit .z-field--input--text[name=title], .rule-page--edit .z-field--textarea[name=description] {background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('.rule-page--edit .z-field--input--text[name=title], .rule-page--edit .z-field--textarea[name=description]::placeholder {color: #DEDEDE !important;};');
addGlobalStyle('.z-fieldset__legend__heading {color: #DEDEDE;};');
addGlobalStyle('.z-fieldset__legend__description {color: #DEDEDE;};');
addGlobalStyle('.c-btn.c-btn--primary:not(:disabled) {border-color: none; color: #DEDEDE;};');
addGlobalStyle('.c-btn.c-btn--primary:not(:disabled):focus, .c-btn.c-btn--primary:not(:disabled):hover, .c-btn.c-btn--primary:not(:disabled):hover:hover {border-color: #333333; color: #DEDEDE;};');
addGlobalStyle('.zd-menu-root:first-child .zd-menu-label a {border-bottom: 1px solid #333333; color: #DEDEDE;};');
addGlobalStyle('.z-card {background-color: #262626; border: 1px solid #333333;};');

//Search
addGlobalStyle('.workspace.search {background-color: #262626 !important};');
addGlobalStyle('.query-box .query-container .query-field {border: 1px solid #333333 !important; background-color: #262626; color: #DEDEDE;};');
addGlobalStyle('body.voltron .query-box.is-focused input, body.voltron .query-box.is-focused .clear-search {border: 1px solid #333333 !important;};');
addGlobalStyle('.query-box .query-container .clear-search {border: 1px solid #333333 !important; background-color: #262626 !important; color: #DEDEDE;};');
addGlobalStyle('body.voltron .query-box.is-focused input, body.voltron .query-box.is-focused .clear-search {border: 1px solid #333333 !important;};');
addGlobalStyle('.query-box .query-container .advanced-search {border: 1px solid #333333 !important; background-color: #262626 !important; color: #DEDEDE !important;};');
addGlobalStyle('.workspace.search nav.content-type-nav {border-bottom: 1px solid #333333;};');
addGlobalStyle('.navigation-item {color: #DEDEDE !important;};');
addGlobalStyle('.navigation-item.active {border-bottom-color: #333333;};');
addGlobalStyle('.workspace.search nav.content-type-nav {border-bottom: 1px solid #333333 !important;};');
addGlobalStyle('.navigation-item:hover {border-bottom-color: #333333 !important;};');
addGlobalStyle('.ticket_summary .popover-header {background-color: #262626 !important; border-bottom: 1px solid #333333 !important; color: #DEDEDE;};');

//Internal Note Text Input Box Color
addGlobalStyle('.rich_text .comment_input:not(.is-public) div[contenteditable] {background: #000000 !important; color: #DEDEDE; border: 2px solid #333333;}');
//Public Reply Text Box Color
addGlobalStyle('.rich_text .comment_input.is-public div[contenteditable] {background: #333333; color: #DEDEDE; border: 2px solid #333333;};');
//Previous Internal Notes Text Box Color
addGlobalStyle('.event:not(.is-public) .comment{background: #000000 !important; border: 2px solid #333333; color: #DEDEDE;}');