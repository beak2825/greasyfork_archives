// ==UserScript==
// @name           nure-ui-fix
// @name:en        nure-ui-fix
// @icon           https://dl.nure.ua/pluginfile.php/1/theme_moove/favicon/1664384975/favicon.ico
// @namespace      https://tampermonkey.net/
// @version        2025.12.30
// @description    виправлення для темної теми та деяких меню
// @description:en improvements and fixes for dl.nure.ua
// @author         sekomi
// @match          https://dl.nure.ua/*
// @run-at         document-end
// @grant          GM_addStyle
// @license        MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482779/nure-ui-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/482779/nure-ui-fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global $ */

    const enableLayoutChanges = true
    const colorBgDefault = "#151515"
    const colorBgAlt1 = "#1f2022"
    const colorBgAlt2 = "#1c1c1c"
    const colorFgDefault = "#aaaaaa"
    const colorFgBright = "#dddddd"

    const darkModeCss = `
/* nure-ui-fix darkModeCss */
body.moove-darkmode #page, body.moove-darkmode #region-main, body.moove-darkmode #page.drawers .main-inner {
  background-color: ${colorBgDefault};
}
body.moove-darkmode #page-footer, body.moove-darkmode div[role="main"] {
  background-color: ${colorBgDefault};
}
body.moove-darkmode .dashboard-card-deck .dashboard-card .dashboard-card-footer, body.moove-darkmode #region-main .section.main, body.moove-darkmode .course-content .single-section .sectionname, body.moove-darkmode .course-content .section .sectionname {
  background-color: ${colorBgDefault} !important;
}
.description .course-description-item {
  background-color: ${colorBgAlt2};
}
div.description-inner {
  background-color: ${colorBgAlt2};
}
.path-mod .activity-header:not(:empty) {
  background-color: ${colorBgAlt2};
}
.activity-item .activity-completion button.btn, .activity-item .activity-completion a[role="button"].btn {
  color: #deeae7;
  background-color: ${colorBgAlt1};
  border-color: #576470;
}
.activity-item {
  background-color: ${colorBgAlt1};
}
.navbar-toggler-icon {
  background-color: darkslategray;
}
.course-section.hidden .section-item {
  background-color: ${colorBgDefault};
}
.block .block-cards span.categoryname, .block .block-cards .btn-link {
  color: ${colorFgDefault};
}
.text-muted {
  color: rgba(143, 151, 159, 0.75) !important;
}
.mb-0 {
  color: ${colorFgDefault};
}
.me-1 {
  color: ${colorFgDefault};
}
.path-mod-assign td.submissionstatussubmitted, .path-mod-assign div.submissionstatussubmitted, .path-mod-assign a:link.submissionstatussubmitted {
  color: #deeae7;
  background-color: #0c3511;
}
.path-mod-assign td.submissiongraded, .path-mod-assign div.submissiongraded {
  color: #deeae7;
  background-color: #0c3511;
}
.path-mod-assign td.earlysubmission, .path-mod-assign div.earlysubmission {
  color: #deeae7;
  background-color: #0c3511;
}
.path-mod-assign td.latesubmission, .path-mod-assign a:link.latesubmission, .path-mod-assign div.latesubmission {
  color: #deeae7;
  background-color: #411313;
}
.path-mod-assign td.submissionnotgraded, .path-mod-assign div.submissionnotgraded {
  color: #deeae7;
}
.path-mod-assign td.submissionlocked, .path-mod-assign div.submissionlocked {
  color: #deeae7;
  background-color: #262434;
}
.path-mod-assign td.submissionstatusdraft, .path-mod-assign div.submissionstatusdraft, .path-mod-assign a:link.submissionstatusdraft {
  color: #deeae7;
  background-color: #3d3d35;
}
#page-mod-quiz-view table.quizattemptsummary tr.bestrow td {
  background-color: #092a0d;
}
.que .info {
  background-color: ${colorBgAlt1};
  border: 1px solid #56595d;
}
.que .formulation {
  color: #e8eeed;
  background-color: #22262e;
  border-color: #a7b6b8;
}
#quiz-timer-wrapper #quiz-timer {
  border: 1px solid #ca3120;
  background-color: ${colorBgAlt1};
}
.path-mod-quiz .qnbutton {
  border: 1px solid #bbb;
  background-color: ${colorBgAlt2} !important;
}
.path-mod-quiz .qnbutton {
  background: ${colorBgAlt2};
    background-color: rgb(30, 30, 30);
    background-image: none;
}
.path-mod-quiz #mod_quiz_navblock .qnbutton.complete .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.answersaved .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.requiresgrading .trafficlight {
  background-color: #11691b;
}
.path-mod-quiz #mod_quiz_navblock .qnbutton.notyetanswered .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.invalidanswer .trafficlight {
  background-color: #4a3e9e;
}
table.quizreviewsummary th.cell {
  background: ${colorBgAlt1};
}
table.quizreviewsummary td.cell {
  background: ${colorBgAlt1};
}
.qn-question {
  background-color: ${colorBgAlt1};
}
.que.ddwtos .group1 {
  background-color: #161719;
}
.que.ddimageortext .group1, form.mform fieldset#id_previewareaheader .group1 {
  background-color: #161719;
}
.qn-info {
  background: ${colorBgDefault};
}
#page-mod-questionnaire-complete .c0, #page-mod-questionnaire-preview .c0, #page-mod-questionnaire-print .c0, #page-mod-questionnaire-report .individual .c0, #page-mod-questionnaire-myreport .individual .c0 {
  background-color: ${colorBgAlt1};
}
#page-mod-questionnaire-complete .c1, #page-mod-questionnaire-preview .c1, #page-mod-questionnaire-print .c1, #page-mod-questionnaire-report .individual .c1, #page-mod-questionnaire-myreport .individual .c1 {
  background-color: ${colorBgAlt2};
}
#page-mod-questionnaire-complete .raterow:hover, #page-mod-questionnaire-preview .raterow:hover {
  background-color: ${colorBgDefault};
}
#page-mod-questionnaire-complete td.raterow:hover, #page-mod-questionnaire-preview td.raterow:hover {
  border: 1px solid blue;
}
.popover-region-container {
  border: 1px solid #757b7f;
}
body.moove-darkmode .message-app, body.moove-darkmode .navbar .popover-region-container {
  background-color: #1d1d1d;
}
.popover-region-notifications .popover-region-container .popover-region-content-container .content-item-container.unread {
  background-color: #1a1a1a;
}
.popover-region-notifications .popover-region-container .popover-region-content-container .content-item-container {
  background-color: #1a1a1a;
}
.content-item-container.unread {
  background-color: #1a1a1a;
}
.popover-region-notifications .popover-region-container .popover-region-content-container .content-item-container:hover {
  background-color: #1a1a1a;
  color: inherit;
}
.popover-region-footer-container {
  background-color: #202122;
}
.text-dark {
  color: #dfe6ed !important;
}
.simplesearchform .btn-submit {
  background-color: #0f47ad;
}
.simplesearchform .btn-submit {
  border-color: #9facc0;
  color: #dfe6ed;
}
.dropdown-menu {
  background-color: ${colorBgAlt1};
}
.drawer {
  background-color: ${colorBgAlt1};
}
.btn {
  color: #e1e6ec;
}
.courseindex .courseindex-item .courseindex-link, .courseindex .courseindex-item .courseindex-chevron {
  color: #e1e6ec;
}
.courseindex .courseindex-item.dimmed .courseindex-link, .courseindex .courseindex-item.dimmed .courseindex-chevron {
  color: #e1e6ec;
}
.moove-darkmode .courseindex-item:not(.pageitem):hover .icon, .btn.drawertoggle {
  color: ${colorFgDefault} !important;
}
.courseindex .courseindex-item:hover, .courseindex .courseindex-item:focus {
  color: ${colorFgDefault} !important;
}
.courseindex d-flex:hover .courseindex-item:hover .courseindex-link:hover, .courseindex .courseindex-item .courseindex-link:focus, .courseindex .courseindex-item .courseindex-chevron:hover, .courseindex .courseindex-item .courseindex-chevron:focus {
  color: ${colorFgDefault} !important;
}
a:hover {
  color: ${colorFgDefault} !important;
}
.courseindex .courseindex-item:hover .courseindex-link, .courseindex .courseindex-item:hover .courseindex-chevron, .courseindex .courseindex-item:focus .courseindex-link, .courseindex .courseindex-item:focus .courseindex-chevron {
  color: ${colorFgDefault} !important;
}
.fp-icon {
  background: #8ca7db;
}
.maincalendar .calendarmonth .clickable:hover {
  background-color: ${colorBgAlt1};
}
.modal-content {
  background-color: ${colorBgAlt1};
}
.block .block-controls .dropdown-toggle {
  color: #deeae7;
}
.path-grade-report-user .user-grade thead th, .grade-report-user .user-grade thead th {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-report-container, .grade-report-user .user-report-container {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-grade td, .grade-report-user .user-grade td {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-grade .baggt, .path-grade-report-user .user-grade .baggb, .grade-report-user .user-grade .baggt, .grade-report-user .user-grade .baggb {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-grade th.column-itemname:not(.header, .category, .baggt, .baggb), .grade-report-user .user-grade th.column-itemname:not(.header, .category, .baggt, .baggb) {
  background-color: ${colorBgDefault};
}
.path-grade-report-user .user-grade td.item, .grade-report-user .user-grade td.item {
  background-color: ${colorBgDefault};
}
body {
  background-color: ${colorBgDefault} !important;
}
body.moove-darkmode .card, body.moove-darkmode #page-enrol-users #filterform, body.moove-darkmode .que .history, body.moove-darkmode .userprofile .profile_tree section, body.moove-darkmode .groupinfobox, body.moove-darkmode .well {
  background-color: ${colorBgDefault};
  border: #4e5c5c;
  border-style: groove;
}
:root, [data-bs-theme="light"] {
  --bs-body-color: ${colorFgDefault};
}
.fp-iconview .fp-filename-field .fp-filename {
  background: ${colorBgDefault};
}
pre {
  color: ${colorFgDefault};
}
.btn-secondary {
  background-color: ${colorBgAlt1};
}
#page.drawers {
  scrollbar-color: #6a737b #131317;
}
.generaltable tbody tr:nth-of-type(2n)
{
  background-color: ${colorBgDefault};
}
body.moove-darkmode {
  color: #dfe6ed;
}
body.moove-darkmode a {
  color: #79accf;
}
.custom-select:disabled {
  color: #dfe6ed;
  background-color: ${colorBgAlt1};
}
.border {
  border: 1px solid #888 !important;
}
.generaltable th, .generaltable td {
  border-top: 1px solid #6c7175;
}
.table-bordered th, .table-bordered td {
  border: 1px solid #6c7175;
}
.dashboard-card {
  border: 1px solid #a7aeb4;
}
.forumpost.unread .row.header, .path-course-view .unread, span.unread
{
  background-color: ${colorBgAlt1};
}
.page-link {
  background-color: ${colorBgAlt1};
  border: 1px solid #888;
}
.page-link:hover {
  background-color: #afbbd240;
}
.page-item.disabled .page-link {
  color: #6a737b;
  background-color: #161719;
  border: 1px solid #888;
}
.generaltable tbody tr:hover {
  color: #646f7b;
}
.list-group-item {
  background-color: ${colorBgAlt1};
}
[data-region="right-hand-drawer"].drawer .footer-container {
  background-color: #2a2929;
}
.moremenu .nav-link.active:focus, .moremenu .nav-link.active:hover {
  background-color: #222222;
}
.moremenu .nav-link:hover, .moremenu .nav-link:focus {
  background-color: #222222;
}
.card-header {
  background-color: rgba(127, 136, 151, 0.1);
}
.h-100.bg-white {
  background-color: #262626 !important;
}
.bg-light {
  background-color: ${colorBgAlt1} !important;
}
.bg-white {
  background-color: ${colorBgDefault} !important;
}
.dropdown-item {
  color: #dfe6ed;
}
.path-mod-attendance table.allsessions tr.grouper td {
  background-color: ${colorBgDefault};
}
.moodle-dialogue-base .moodle-dialogue-wrap {
  background-color: ${colorBgDefault};
  border: 1px solid #565656;
}
.yui3-button {
  color: rgba(255, 255, 255, 0.8);
}
a.text-dark:hover, a.text-dark:focus {
  color: #fff !important;
}
.close {
  color: #fff;
  text-shadow: 0 1px 0 ${colorFgDefault};
}
.close:hover {
  color: #ccc;
}
.custom-select {
  background: ${colorBgAlt1} url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right .75rem center / 8px 10px no-repeat;
  color: #dfe6ed;
}
.btn-success {
  color: #deeae7;
  background-color: #0c3511;
  border-color: #0f3914;
}
a.dimmed, a.dimmed:link, a.dimmed:visited, a.dimmed_text, a.dimmed_text:link, a.dimmed_text:visited, .dimmed_text, .dimmed_text a, .dimmed_text a:link, .dimmed_text a:visited, .usersuspended, .usersuspended a, .usersuspended a:link, .usersuspended a:visited, .dimmed_category, .dimmed_category a {
  color: #747f88;
}
.tertiary-navigation .navitem-divider {
  background-color: #888;
}
.course-section .availabilityinfo {
  background-color: #2c3033;
}
.dropdown-menu {
  color: #dadcdf;
}
.btn.btn-icon:hover, .btn.btn-icon:focus {
  background-color: #aaaaaa00;
}
div[style]:has(p) {
  background-color: ${colorBgDefault} !important;
}
.pagelayout-frontpage .dashboard-card .course-contacts .contact p.role, .pagelayout-coursecategory .dashboard-card .course-contacts .contact p.role {
  color: #66717b;
}
.message-app .message.send .time {
  background-color: #3f4448 !important;
  color: #deeae7;
}
.message-app .message.send {
  background-color: #3f4448;
  color: #deeae7;
}
.message-app .icon {
  color: #deeae7;
}
.message-app .btn.btn-link.btn-icon:hover, .message-app .btn.btn-link.btn-icon:focus {
  background-color: #5e6164;
}
#MathJax_Zoom {
  background-color: ${colorBgDefault};
}
.bg-secondary {
  background-color: #162d44 !important;
}
.file-picker .fp-content {
  background: ${colorBgDefault};
}
.path-mod .automatic-completion-conditions .badge {
  mix-blend-mode: normal;
}
.card {
  --bs-card-color: ${colorFgDefault};
}
.form-select {
  color: var(--bs-body-color);
  --bs-body-color: ${colorFgBright};
  background-color: ${colorBgAlt1};
`
    const layoutCss = `
/* nure-ui-fix layoutCss */
.content-item-container .view-more {
  bottom: 2px;
  visibility: hidden;
}
.que .specificfeedback, .que .generalfeedback, .que .numpartscorrect .que .rightanswer, .que .im-feedback, .que .feedback, .que p {
  margin: 0 0 .1em;
}
#quiz-timer-wrapper {
  top: 12px;
}
.mt-3, .my-3 {
  margin-top: 0.5rem !important;
}
@media (min-width: 768px) {
  .activity-item:not(.activityinline) {
    padding: 1rem;
    border: 1px solid #484d51;
  }
}
    `

    if (document.body.classList.contains('moove-darkmode')) {
        GM_addStyle(darkModeCss);
    }
    if (enableLayoutChanges) {
        GM_addStyle(layoutCss);
    }
})();