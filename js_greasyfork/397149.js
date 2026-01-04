// ==UserScript==
// @name BIT-Moodle-Enhance
// @namespace https://github.com/fky2015/
// @version 0.1.7
// @description provide mordern theme design for moodle system.
// @author FKYnJYQ
// @grant GM_addStyle
// @include http://lexue.bit.edu.cn/*
// @include https://lexue.bit.edu.cn/*
// @include http://*.lexue.bit.edu.cn/*
// @include https://*.lexue.bit.edu.cn/*
// @include http://online.bit.edu.cn/moodle*
// @downloadURL https://update.greasyfork.org/scripts/397149/BIT-Moodle-Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/397149/BIT-Moodle-Enhance.meta.js
// ==/UserScript==

(function() {
  "use strict";

  if (window.location.href.endsWith(".bit.edu.cn/")) {
    let t = window.location.href + "my/";
    window.location = t;
  }
  $("a.brand").attr("href", "/my/");

  let css = `
    :root {
  --main-gap-color: #181a26;
  --main-bg-color: #282a36;
  --main-selection-color: #44475a;
  --main-header-color: #f1fa8c;
  --main-fg-color: #f8f8f2;
  --main-block-color: var(--main-bg-color);
  --main-comment-color: #6272a4;
  --main-red: #ff5555;
  --main-green: #50fa7b;
  --main-cyan: #8be9fd;
  --main-pink: #ff79c6;
}

#page-content {
  max-width: 100% !important;
}

html,
#page-course-search > div.text-center {
  background: var(--main-bg-color);
}

/* 导航栏 */
header,
#page,
.navbar .brand,
.navbar-inner,
#search,
#coursesearchbox,
.navbar .nav > li > a:focus,
.navbar .nav > li > a:hover,
.navbar .nav > .active > a,
.navbar .nav > .active > a:hover,
.navbar .nav > .active > a:focus,
.navbar .nav li.dropdown.open > .dropdown-toggle,
.navbar .nav li.dropdown.active > .dropdown-toggle,
.navbar .nav li.dropdown.open.active > .dropdown-toggle {
  background: var(--main-bg-color) !important;
  max-width: 100%;
}

.navbar .dropdown-menu {
  border-bottom: 0px solid #438eb9;
}

.navbar .dropdown-menu > li > a,
.navbar .dropdown-menu > li > a:focus {
  background-color: var(--main-red) !important;
  color: var(--main-fg-color);
}

#page-mod-hvp-view > div.text-center,
#page-enrol-index > div.text-center,
#page-mod-page-view > div.text-center,
#page-course-view-topics > div.text-center,
#page-course-view-weeks > div.text-center,
.text-center {
  background: var(--main-bg-color);
}

button,
input,
select,
.navbar .btn-navbar {
  background: var(--main-bg-color) !important;
  border: 1px solid var(--main-fg-color) !important;
  color: var(--main-fg-color) !important;
}

input[type="image"],
#coursesearchbox {
  border-width: 0 !important;
}

#search input[type="submit"] {
  background: var(--main-bg-color)
    url(/theme/image.php/lambda/theme/1582254235/bg/icon-search) no-repeat
    center center !important;
  border-width: 0px !important;
}

header span[tabindex="0"] {
  color: var(--main-green);
}

table#form td.submit,
.form-buttons,
.path-admin .buttons,
#fitem_id_submitbutton,
.fp-content-center form + div,
div.backup-section + form,
#fgroup_id_buttonar {
  background-color: var(--main-bg-color);
}

.singleselect form,
.singleselect select,
.moodle-actionmenu[data-enhanced].show .menu {
  background-color: var(--main-bg-color);
  color: var(--main-fg-color);
}

/* 功能块 */
.block {
  background: var(--main-block-color);
  margin-bottom: 0px;
  border: 0;
  border-bottom: 2px solid var(--main-gap-color);
}

.generaltable tbody > tr:nth-child(odd) > td,
.forumpost,
#newmessageoverlay {
  background: var(--main-bg-color);
}

/* 主体 */
body {
  color: var(--main-fg-color);
}

.content h3.sectionname,
.bx-prev,
.bx-next,
.course-content .current .content {
  background: var(--main-bg-color);
}

.course-content .current {
  background: var(--main-bg-color) !important;
  border: 5px solid var(--main-selection-color) !important;
}

.fa-chevron-circle-up:before {
  color: var(--main-selection-color);
}

/* 代码编辑 */
.path-mod-programming td.programming-io span {
  background-color: var(--main-selection-color);
}

.nav-tabs,
.nav-tabs > .active > a {
  background-color: var(--main-bg-color);
  border: 0;
  color: var(--main-fg-color);
}

.nav-tabs > li > a {
  background-color: var(--main-bg-color);
  color: var(--main-fg-color);
}

.nav-tabs > .active > a[href],
.nav-tabs > li.active {
  color: var(--main-green);
  border-bottom: 1px solid var(--main-green);
  border-top: 0;
  margin-bottom: -1px;
  margin-top: -2px;
}

.path-mod-programming #test-result-detail .passed,
.path-mod-programming #test-result-detail .passed .cell {
  background-color: var(--main-bg-color);
}

.passed a {
  color: var(--main-green);
}

.nav > .disabled > a {
  background: var(--main-bg-color);
}
.nav > .disabled > a:hover {
  background: var(--main-bg-color) !important;
  transform: none !important;
  border: none;
}

.dp-highlighter ol li,
.dp-highlighter .columns div {
  line-height: 24px;
}

body {
  font-size: 18px;
}

.content h3.sectionname {
  border-color: #4f0f0f;
  border-width: 0px;
}

table#explaincaps tbody > tr:nth-child(odd) > td,
table#defineroletable tbody > tr:nth-child(odd) > td,
table.grading-report tbody > tr:nth-child(odd) > td,
table#listdirectories tbody > tr:nth-child(odd) > td,
table.rolecaps tbody > tr:nth-child(odd) > td,
table.userenrolment tbody > tr:nth-child(odd) > td,
table#form tbody > tr:nth-child(odd) > td,
form#movecourses table tbody > tr:nth-child(odd) > td,
#page-admin-course-index .editcourse tbody > tr:nth-child(odd) > td,
.forumheaderlist tbody > tr:nth-child(odd) > td,
table.flexible tbody > tr:nth-child(odd) > td,
.generaltable tbody > tr:nth-child(odd) > td,
table#explaincaps tbody > tr:nth-child(odd) > th,
table#defineroletable tbody > tr:nth-child(odd) > th,
table.grading-report tbody > tr:nth-child(odd) > th,
table#listdirectories tbody > tr:nth-child(odd) > th,
table.rolecaps tbody > tr:nth-child(odd) > th,
table.userenrolment tbody > tr:nth-child(odd) > th,
table#form tbody > tr:nth-child(odd) > th,
form#movecourses table tbody > tr:nth-child(odd) > th,
#page-admin-course-index .editcourse tbody > tr:nth-child(odd) > th,
.forumheaderlist tbody > tr:nth-child(odd) > th,
table.flexible tbody > tr:nth-child(odd) > th,
.generaltable tbody > tr:nth-child(odd) > th {
  background-color: var(--main-bg-color);
}

/* footer */
#page-footer {
  background: var(--main-bg-color);
  border-top: 3px solid var(--main-gap-color);
  text-align: center;
  margin-top: 0px;
}

.footerlinks {
  line-height: 15px;
  background: var(--main-bg-color);
  border-top: 0;
  padding: 0;
  margin: auto;
}

.breadcrumb > li {
  text-shadow: 0 0;
}

#page-footer .footnote {
  float: none;
  color: var(--main-header-color);
  margin-left: 0px;
}

#dock .dockedtitle,
.calendar-event-panel,
.block .calendar-event-panel .yui3-overlay-content,
.path-calendar .maincalendar .eventlist * {
  background: var(--main-bg-color) !important;
  background-color: var(--main-bg-color);
}

.block .calendar-event-panel {
  border: none;
}
.block .calendar-event-panel .yui3-overlay-content,
.path-calendar .maincalendar .eventlist * {
  box-shadow: none;
  border-color: var(--main-fg-color);
}

.calendar_event_course {
  background-color: var(--main-selection-color);
}

#dock .dockedtitle .css3transform {
  position: static !important;
  transform: none !important;
  top: auto !important;
  width: auto !important;
  padding: 1px !important;
  line-height: 20px !important;
}

#dockeditempanel .dockeditempanel_content {
  background-color: var(--main-bg-color);
  -webkit-box-shadow: none;
  box-shadow: none;
}

/* 消除老代码影响 */
.skip-block-to {
  height: 0px;
}

#site-news-forum,
#frontpage-course-list,
#frontpage-category-combo,
#frontpage-category-names {
  background-image: none;
}

.course-content ul li.section.main {
  background: var(--main-bg-color);
  border-bottom: 3px solid var(--main-gap-color);
}

a,
a:visited,
.instancename {
  color: var(--main-fg-color) !important;
}

.usermenu .moodle-actionmenu[data-enhanced] .menu .menu-action.icon img,
.usermenu .moodle-actionmenu[data-enhanced] .menu .menu-action.icon:hover img {
  color: var(--main-fg-color);
}

.path-mod-assign td.submissionnotgraded,
.path-mod-assign div.submissionnotgraded {
  color: var(--main-red);
  background-color: var(--main-bg-color);
}

.block .header .title {
  background: var(--main-block-color);
}

.header .title h2:before,
.coursebox > .info > .coursename a:before,
.coursebox > .info > .name a:before {
  background: var(--main-block-color) !important;
}

/* 课程名称 */
.coursebox > .info > .coursename a {
  color: var(--main-fg-color);
}

#fitem_id_submitbutton {
  background: var(--main-bg-color);
}

h1,
h2,
h3,
h4,
h5,
h6,
.back-to-top,
.socials p,
#socialheading,
.forumpost .subject {
  color: var(--main-header-color) !important;
}

.section .activity .actions {
  background: rgba(255, 255, 255, 0);
}

li {
  line-height: inherit;
}

/* file manager */
.ffilemanager * {
  background: var(--main-bg-color) !important;
}

.moodle-dialogue-base .moodle-dialogue-wrap *,
.moodle-dialogue-base .moodle-dialogue-wrap {
  background: var(--main-bg-color) !important;
}

.moodle-dialogue-base .moodle-dialogue-wrap .moodle-dialogue-hd,
.moodle-dialogue-base .moodle-dialogue-wrap .moodle-dialogue-hd.yui3-widget-hd {
  text-shadow: none;
}
.moodle-dialogue-base .moodle-dialogue .moodle-dialogue-bd {
  color: var(--main-fg-color);
}
.moodle-dialogue-base .moodle-dialogue-wrap {
  border: none;
  -webkit-border-radius: 0px;
  border-radius: 0px;
}
div.filemanager-loading > img {
  display: none;
}
/* 课程 */
.coursebox {
  border: 1px solid var(--main-gap-color);
  border-radius: 0;
  border-width: 0 0 1px 0;
  background-color: var(--main-bg-color) !important;
  margin-bottom: 0px;
}

/* 颜色覆盖 */
.green {
  background-color: #50fa7b;
}

.purple {
  background-color: #bd93f9;
}

.orange {
  background-color: #ffb86c;
}

.lightblue {
  background-color: #8be9fd;
}

.yellow {
  background-color: #fdb53f;
}

.turquoise {
  background-color: #f1fa8c;
}

a:hover {
  color: var(--main-pink) !important;
  transition: all 0.3s ease 0.1s !important;
  text-decoration: none !important;
}

.nav-tabs > .active > a,
.nav-tabs > .active > a:hover,
.nav-tabs > .active > a:focus,
.navbar .dropdown-menu > li > a:hover,
.navbar .dropdown-menu > li > a:focus,
a:hover,
.block:hover,
.coursebox:hover,
.generaltable tbody tr:hover > td,
.block:hover .header .title,
.block:hover .header .title h2:before,
.coursebox:hover > .info > .coursename a:before,
.coursebox:hover > .info > .name a:before,
#dock .dockedtitle:hover,
#dock .dockedtitle:focus {
  background: var(--main-selection-color) !important;
}

.usermenu .moodle-actionmenu .menu .menu-action.icon a:hover img {
  background-color: transparent;
}

/* scrollbar */
::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--main-bg-color);
}

::-webkit-scrollbar-track {
  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(95, 95, 95, 0);
  transition: all 1s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--main-selection-color);
}
    `;
  GM_addStyle(css);
})();
