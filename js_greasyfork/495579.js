// ==UserScript==
// @name Todoist New
// @description Makes Todoist prettier
// @include *.todoist.*
// @include https://todoist.com/*
// @version 1.0
// @grant none

// @namespace https://greasyfork.org/users/1304495
// @downloadURL https://update.greasyfork.org/scripts/495579/Todoist%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/495579/Todoist%20New.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
var head,
style;
head = document.getElementsByTagName('head') [0];
if (!head) {
return;
}
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);
}

// ---------------------------------
// FONTS ALLGEMEIN
// ---------------------------------
addGlobalStyle('.richtext_editor, body, .adUC4xS, input, textarea, #page_background, #left-menu, * {font-family: "SF UI Text", sans-serif !important; baackground: #fff! important}');

// Links
addGlobalStyle(' .task_content a, .task_item_content_text a, .theme_neutral .task_description a {text-decoration: none !important; color: #125fa4}');

// TASKS GENERALLY
addGlobalStyle(' .date {padding:2px 4px 2px 4px !important;border-radius:3px}');
addGlobalStyle(' .task_list_item__info_tags .date.date_today:not(.date_overdue) {color: #8c7d00 !important; background: #fffbde}');
addGlobalStyle('.task_list_item__info_tags .date.date_overdue{color: #890101 !important; background: #ffe6e6}');
addGlobalStyle(' .date_tom {color: #247600 !important; background: #e9fce1}');
addGlobalStyle(' .task_list_item__info_tags .date.date_next_week{color: #330a9d !important; background: #f6f3ff}');

// BOARD

// Board sections
addGlobalStyle(' .board_section {margin-right: 16px; border-right:1px solid rgb(200,200,200); border-radius: 0px; width: 300px}');
addGlobalStyle(' .board_section__task_count{display:none}');
addGlobalStyle(' .board_section__menu_trigger {opacity: 0.5}');
addGlobalStyle(' .board_section__footer__add_task{opacity:0.5}');
addGlobalStyle(' .board_view__add_section{opacity:0.5}');

// Board tasks
addGlobalStyle(' .board_task {border: none; box-shadow: none; padding: 6px; baackground:rgb(245,245,245); border-radius:5px; margin-bottom:10px!important}');
addGlobalStyle('.xHowOPS {padding-bottom: 1px !important}');

// List view
addGlobalStyle(' .plus_add_button {opacity: 0.5 }');
addGlobalStyle(' [aria-label="Share options"], [aria-label="Comments"] {display:none}');
// Titel
addGlobalStyle(' .board_section .task_content  {font-weight: 500 }');
addGlobalStyle(' .board_task__details__content__inner_content {font-size: 14px}');
addGlobalStyle('.list_editor .task_content  {font-weight: 400 !important }');

// Details
addGlobalStyle(' .task_list_item__info_tags .date{font-size: 12px !important}');
addGlobalStyle(' .board_task__meta {padding-top: 2px !important}');
addGlobalStyle('.board_section .calendar_icon, .board_section .task_list_item__info_tags__label, .board_section .task_list_item__project svg, .board_section .task_list_item__info_tags__label,.board_section .task_list_item__info_tags .task_list_item__info_tags__subtasks--show-complete {display: none !important}');

// LIST
addGlobalStyle(' .section_list, .view_content .list_holder, .view_content .section, .z9PJyaa.c0PV7ab>div {max-width: 100% !important; width: 100%!important}');
addGlobalStyle(' .task_list_item {border: none !important}');
addGlobalStyle(' .task_list_item .task_list_item__content {padding-top:2px !important}');
addGlobalStyle(' .task_list_item .task_checkbox {margin-top:2px !important}');
addGlobalStyle(' .task_list_item__info_tags {min-height:0px !important}');
// Checkbox
addGlobalStyle(' .qfNv_xy {--circle-diameter:14px !important}');

// HEADER
addGlobalStyle(' .svjDM1I  {display:none}');

// SIDEBAR LINKS
addGlobalStyle('.CyYcjJUieBpMa9EpeaMCgT06VDxGmHUC>a {padding:1px !important}');
addGlobalStyle('.X_3UwghUggmfmKrS8M8uwnLl4hgJenHE {font-size: 13px !important}');
addGlobalStyle('.hRQZFMhX5N2W_D53QQAgHGqMJtAEbRXE {display: none !important}');

// BACKGROUND
addGlobalStyle('.empty-state{display:none}');


