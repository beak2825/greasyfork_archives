// ==UserScript==
// @name         CodeGym DARKMODE
// @namespace    http://tampermonkey.net/
// @version      0.2.4 
// @description  fix .list-group-item span.media-body background color 27022022
// @author       C1221G1-NguyenTranThanhNghia @iamnotnghia
// @website      https://github.com/dodooh
// @match        https://james.codegym.vn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440287/CodeGym%20DARKMODE.user.js
// @updateURL https://update.greasyfork.org/scripts/440287/CodeGym%20DARKMODE.meta.js
// ==/UserScript==

function addStyleTag(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// h1 : 36px;
// h2 : 32px;
// h3 : 24px;

// keyframe rainbow
addStyleTag('@keyframes rainbow {   0%{background-position:left}  50%{background-position:right}  100%{background-position:left}}')
// LOGO filter
addStyleTag('span.navbar-brand-logo.mini {filter: grayscale(75%);}')
// body bg
addStyleTag('#page, .main-navigation ul ul{background: #202225 !important;}')
addStyleTag('.navbar .navbar-brand ,.navbar.nav-inverse, .bg-primary{background: #3a4044 !important;}')
addStyleTag('body {color: #ACC8E5 !important; background: #112A46 !important;font-family: \'Montserrat\', Arial, sans-serif !important; }')
// dropdown-menu
addStyleTag('.dropdown-menu {background: #202225 !important; color: #83ba52 !important; }')
// h1 neon
addStyleTag('h1,h2,h3,h4 {letter-spacing: 0.02em !important;text-transform: uppercase !important;text-shadow: 0 0 0.15em #1da9cc !important;white-space: nowrap !important;filter: blur(0.007em) !important;}')
addStyleTag('h1 {font-weight: 700; font-size: 36px; color: #83ba52; }')
addStyleTag('h2 {font-weight: 600; font-size: 28px; color: #fff;')
addStyleTag('h3 {font-weight: 500; font-size: 24px; color: #fff;}')
addStyleTag('h4 {font-weight: 400; font-size: 20px; color: #fff;}')
addStyleTag('h1.page-title.font-size-24.mb-0, a.nav-link.navbar-avatar > span.username  {text-shadow:none;font-size:2.0rem!important;color: white; text-shadow: 0 0 0.05em #fff, 0 0 0.2em #fe05e1, 0 0 0.3em #fe05e1!important;} a.nav-link.navbar-avatar > span.username {font-weight:bold !important;text-transform:uppercase;font-size:1rem !important;} span.avatar{box-shadow:0 0 0.05em #fff, 0 0 0.2em #fe05e1, 0 0 0.3em #fe05e1!important;}')
// .pagelayout-course .course-content .sectionname a {
addStyleTag('.pagelayout-course .course-content .sectionname a { color: #83ba52 !important; font-weight: 600;letter-spacing: 0.02em !important;text-transform: uppercase !important;text-shadow: 0 0 0.15em #1da9cc !important;white-space: nowrap !important;filter: blur(0.007em) !important;}')
// left side nav
addStyleTag('#nav-drawer-container, [data-region="drawer"] .list-group-item.active {background:#3a4044;}')
addStyleTag('.list-group-item-action, .list-group-item {color: #B1FF91 !important;background:#3a4044 !important;text-shadow: 0 0 0.15em #1da9cc;white-space: nowrap !important;}')
addStyleTag('.list-group-item span.media-body  {color: #B1FF91 !important;background:#3a4044 !important;text-shadow: 0 0 0.15em #1da9cc;white-space: nowrap !important;}')
addStyleTag('.list-group-item > a > span.instancename {font-size: 12px !important;}')
addStyleTag('[data-region="drawer"] .site-menubar-footer a {background:#3a4044 !important;} [data-region="drawer"] .site-menubar-footer a .fa{color:#B1FF91 !important;}')
addStyleTag('#activity-nav .list-group-item a {  padding: 8px 16px; }')
//h3.section-title
addStyleTag('h3.section-title {font-weight: 600;font-size: 32px;color: #fff !important;letter-spacing: 0.02em !important;text-shadow: 0 0 0.15em #1da9cc !important;white-space: nowrap !important;}')
addStyleTag('h3.section-title>a:hover {text-decoration: none;}')
// ul.section li
addStyleTag('ul.section > li {border-bottom: 1px #f8edeb solid;} ')
// code
addStyleTag('code {font-family: SFMono-Regular,Consolas, Arial, sans-serif;font-weight: bold ;background: #666;border-radius: 0.5em;white-space: pre;font-size: 16px!important;line-height: 1.75;}')
addStyleTag('.hljs {color: #fff}')
addStyleTag('span.hljs-keyword, span.hljs-number, span.hljs-string {color: #83ba52;}')
// [role="main"] TITLE
//background: linear-gradient(to right, crimson,pink,springgreen);
addStyleTag(' [role="main"] > h2 {white-space: initial !important;filter:none !important;text-shadow: none !important; font-size: 32px; background: linear-gradient(to right, #A2D2FF,#272882,#FF865E,#FEE440);  background-size: 200% 200%;  animation: rainbow 10s ease-in-out infinite;  background-clip: text;  -webkit-background-clip:text;  color:rgba(0,0,0,0);   display:block;  text-align:center;  transition: color .2s ease-in-out;  text-transform:uppercase;  font-weight:900;}')
// card bg
addStyleTag('.pagelayout-course .course-content .section.main,.card, .pagelayout-course #section-0 {background: #262a2d !important;}')
addStyleTag('.hljs {background: #1b1b1b !important;}')
// check-box size
addStyleTag('.icon {width: 20px !important;height: 20px}')
// .instancename title
addStyleTag(' .instancename {font-size: 16px!important; color: rgba(255, 255, 255, 0.8) !important;text-shadow: 0 0 0.10em #1da9cc !important;white-space: nowrap !important;filter: blur(0.007em) !important;}')
addStyleTag(' .instancename:hover {font-size: 18px!important;color: rgba(255, 255, 255, 1);text-shadow: 0 0 0.2em #1da9cc;transition: font-size 0.4s ease;}')
addStyleTag(' .activityinstance>a:hover {text-decoration: none;}')
// a:link a:hover
addStyleTag('a:link{color: #fff important;} a:hover {color: #82d4f0;')
//.activity-count
addStyleTag('.course-content .section-summary .section-summary-activities .activity-count {color:#6db467 !important;}')
// question quiz
addStyleTag('.que .content {background: #26343f;} .que .qtext {    font-size: 1.25rem;background: #314250;} [data-region="blocks-column"], .bg-white {background: #3a4044 !important;} .nav-tabs .nav-link.active .fa {    color: #7eb654!important;}')
// nav
addStyleTag('.nav-tabs .nav-link { color: #5a6970!important;}')
// table
addStyleTag('table, table.generaltable {text-align: left; overflow: hidden; margin: 0 auto;  display: table; padding: 0 0 8em 0;} tr:nth-child(odd) { background-color: #323C50; } tr:nth-child(even) { background-color: #2C3446; } td:first-child { color: #FB667A; }')
addStyleTag('table.generaltable tr:nth-child(odd) {color:white; background-color: #277231  !important; } table.generaltable tr:nth-child(even) {color:white; background-color: #305621  !important; } table.quizreviewsummary td.cell,table.quizreviewsummary th.cell {color:inherit;background-color: inherit !important;}')
addStyleTag('tr.bestrow td {color: black !important; font-weight: 600 !important; font-size:1.15rem !important} tr.lastrow td {color: black !important;}')
// select id="jump-to-activity"
// ResetStyle
addStyleTag('#jump-to-activity.custom-select {  appearance: none;  outline: 0;  border: 0; box-shadow: none; flex: 1; padding: 0 1em; color: #fff; background-color: #2c3e50; background-image: none; cursor: pointer;}')
/* Remove IE arrow */
addStyleTag('#jump-to-activity.custom-select::-ms-expand {   display: none; }')
/* Custom Select wrapper */
addStyleTag('#jump-to-activity.custom-select{ position: relative;  display: flex;   width: 20em;  height: 3em;  border-radius: .25em;  overflow: hidden;}')