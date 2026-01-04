// ==UserScript==
// @name Style: Omod
// @namespace studiomoxxi.com
// @version 1.0
// @description omod
// @author Ben
// @license BSD
// @grant GM_addStyle
// @run-at document-start
// @match *://*.outwar.com/*
// @downloadURL https://update.greasyfork.org/scripts/455037/Style%3A%20Omod.user.js
// @updateURL https://update.greasyfork.org/scripts/455037/Style%3A%20Omod.meta.js
// ==/UserScript==

(function() {
let css = `

body {
	background-repeat: no-repeat !important;
	background-attachment: fixed !important;
	background-position: center top !important;
}


#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div {
	-webkit-perspective: 1000;
	-webkit-backface-visibility: hidden;
}

div.dataTables_wrapper div.dataTables_length label,
.list-group-item,
.mailbox-inbox .mail-item[id*=unread-] div.mail-item-heading .mail-item-inner .f-body .user-email {
	color: # !important;
}

#UnderlingTable,
.table.table.table-striped {
	border-collapse: collapse;
	background: transparent;
	width: 100%;
}

.bio .widget-content-area h3:after {
	background: transparent !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3>div.widget-content.text-left>div:nth-child(2) {
	color: transparent !important;
}

#sidebar ul.menu-categories li.menu>.dropdown-toggle svg {
	color: # !important;
}

#sidebar ul.menu-categories li.menu>.dropdown-toggle[aria-expanded="true"]:not([data-active="true"]),
.wquesttable,
.tab-title,
.mail-box-container,
.mailbox-inbox,
.widget.box .widget-header,
#infocell,
.simple-tab .nav-tabs .nav-item.show .nav-link,
.simple-tab .nav-tabs .nav-link.active,
#basic>div.statbox.widget.box.box-shadow.mb-1.pt-2.pb-1>div>div>div,
.mail-box-container .avatar .avatar-title,
.page-item.active .page-link {
	background: # !important;
}

.menu a:hover,
.mailbox-inbox .mail-item div.mail-item-heading,
.tab-title #btn-compose-mail,
.dropdown-menu a.dropdown-item:hover,
.skillsbox {
	background-color: # !important;
	color: # !important;
}

#sidebar ul.menu-categories ul.submenu>li a:hover:before {
	background-color: # !important
}

#sidebar ul.menu-categories.ps {
	border: 1px dashed # !important
}

#levelup {
	filter: grayscale(100%);
}

.backpackSlot {
	background: url("https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/frame3.png") !important
}

body img[src*="landing/defroom"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/tile.png") !important;
}

body img[src*="toolbar/Equipment"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon4.png") !important;
}

body img[src*="toolbar/Backpack"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon5.png") !important;
}

body img[src*="toolbar/Attacked"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon7.png") !important;
}

body img[src*="toolbar/Message"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon8.png") !important;
}

body img[src*="toolbar/Spawned"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon9.png") !important;
}

body img[src*="toolbar/Trade"],
body img[src*="img/CrewTrade"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon10.png") !important;
}

body img[src*="toolbar/Achievement"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/icon11.png") !important;
}

img[src*="sbpostfree"],
img[src*="sbpost"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/don_01/shout.png");
	filter: grayscale(100%) !important;
}

body img[src*="explore_world"] {
	opacity: 0 !important;
}

body img[src*="dungeons.gif"] {
	opacity: 0 !important;
}

body img[src*="img/discord"] {
	opacity: 0 !important;
}

body img[src*="store_head"] {
	display:none !important;
}



body img[src*="gemslot2"] {
	width: 13px !important;
}

.sub-header-container .navbar {
	top: 1px !important;
	background: #;
}

.progress .progress-bar.bg-gradient-success {
	background: transparent;
}

.progress {
	background: # !important;
}

.sub-header-container .navbar .sidebarCollapse svg {
	width: 21px;
	height: 21px;
	color: #;
	vertical-align: text-top
}

.select2-container--default .select2-selection--single {
	border: 1px solid # !important;
	border-radius: 8px !important;
	background-color: # !important;
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
	color: # !important;
}

.btn-group .dropdown-menu,
.select2-dropdown,
.form-control,
#basic>div>div.widget-content.widget-content-area>div.row.mt-4>form>div>input,
#basic>div>div.widget-content.widget-content-area>div:nth-child(1)>form>div>input {
	border: 1px !important;
	background-color: # !important;
	color: #
}

.select2-container--default .select2-results__option--highlighted.select2-results__option--selectable {
	background-color: # !important;
	color: # !important;
}

.dropdown-menu a.dropdown-item:hover,
.select2-search__field {
	background-color: # !important;
	color: # !important;
}

.select2-container--default .select2-results__option--selected {
	background-color: # !important;
	color: # !important;
}

.mail-box-container {
	box-shadow: 2px 2px 2px #, -2px -2px 2px # !important
}

.btn-dark,
.form-control,
.btn-primary,
.btn-secondary,
.btn-info,
.btn-group .dropdown-menu,
.dataTables_wrapper .dataTables_length select.form-control,
.dataTables_wrapper .form-control,
div.dataTables_wrapper div.dataTables_info,
.page-item.active .page-link {
	background: # !important;
	color: # !important;
	border: 1px # !important;
}

.custom-dropdown-menu,
#content-header-row>div.col-12.col-xl-9.pl-0.pr-0>div.col-xl-12.col-lg-12.col-sm-12.layout-spacing>div>div:nth-child(2)>div.btn-group.mr-1.mt-2.show>div {
	background: # !important;
}

.btn-group .dropdown-menu a.dropdown-item {
	color: # !important;
}

.table>thead>tr>th {
	color: # !important;
	border-top: # 1px solid !important;
	border-bottom: # solid 1px !important;
}

#content-header-row>div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1>div>div.widget-heading,
#content-header-row>div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1>div>div.widget-content.pt-0 {
	background: transparent !important;
	border: 1px # solid !important;
	padding: 14px !important;
}

#content-header-row>div>div>div>div>div.tab-title,
#mailbox-inbox,
#mailbox-inbox>div.message-box>div.action-center {
	background-color: # !important;
}

.simple-tab .nav-tabs .nav-item.show .nav-link,
.simple-tab .nav-tabs,
.simple-tab .nav-tabs .nav-item.show .nav-link,
.simple-tab .nav-tabs .nav-link.active {
	border-color: # !important;
}

.list-group.list-group-media .list-group-item .media .media-body p {
	color: # !important;
}

#basic>div.widget-content.widget-content-area>div:nth-child(2)>div.col-12.col-lg-5>div.statbox.widget.box.box-shadow.mt-3,
#basic>div.widget-content.widget-content-area>div:nth-child(2)>div.col-12.col-lg-5>div:nth-child(1) {
	background: transparent !important;
	box-shadow: 0 1px 1px 0 rgb(0 0 0 / 0%), 0 1px 1px 0 rgb(0 0 0 / 0%), 0 1px 1px 1px rgb(0 0 0 / 0%)
}

#basic>div.widget-content.widget-content-area>div:nth-child(1)>div:nth-child(1)>div,
#basic>div.widget-content.widget-content-area>div:nth-child(1)>div:nth-child(2)>div {
	background: transparent !important;
}

body img[src*="circumspect.png"] {
	filter: hue-rotate(0deg) grayscale(0%) saturate(1) brightness(1) !important;
}

body img[src*="markdown.png"] {
	filter: hue-rotate(0deg) grayscale(0%) saturate(1) brightness(1) !important;
}

body img[src*="toolbar/DailyQuest"] {
	content: url('https://studiomoxxi.com/ow_themes/custom_jobs/icon3.png') !important;
}



body img[src*="img/news"],
body img[src*="lightbulb"],
body img[src*="img/challenges"] {
	display: none !important;
}

body img[src*="images/rooms"] {
	opacity: 0 !important;
}

body img[src*="achievements"] {
	filter: hue-rotate(235deg) grayscale(100%) saturate(1) brightness(1) !important;
}

body img[src*="point_small"] {
	filter: hue-rotate(235deg) grayscale(100%) saturate(1) brightness(1) !important;
}



body img[src*="assets/img"] {
	filter: hue-rotate(235deg) grayscale(100%) saturate(1) brightness(1) !important;
}

body img[src*="img/world"] {
	filter: hue-rotate(0deg) grayscale(100%) saturate(0.5) brightness(1) !important;
}

body img[src*="assets/img/garrows"] {
	opacity: 0 !important;
}

body img[src*="collections/Header"] {
	opacity: 0 !important;
}

body img[src*="augHeader"] {
	opacity: 0 !important;
}

body img[src*="itHeader"] {
	opacity: 0 !important;
}

body img[src*="underlingsheader"] {
	opacity: 0 !important;
}

body img[src*="landing/header2.jpg"] {
	opacity: 0 !important;
}

body img[src*="achievement_header"] {
	opacity: 0 !important;
}

#content-header-row>div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1>div>div.widget-content>div.tomb-bottom>div>p:nth-child(6) {
	color: transparent !important;
}

#content-header-row>div>div>center>table,
.btn-warning,
.btn-success {
	background-color: # !important;
	border-color: # !important;
}

#content-header-row>div>div>center>table>tbody>tr:nth-child(1)>td,
#content-header-row>div:nth-child(6)>div>div.table-responsive>table>tbody {
	background: # !important;
}

.table-striped tbody tr:nth-of-type(odd) {
	background: # !important
}

#content-header-row>div:nth-child(5)>div>div.mt-3.pt-3 {
	border: 1px !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-8.col-md-7>div>div:nth-child(2)>div>div>center>font {
	color: # !important;
}

#content-header-row>div:nth-child(5)>div>div:nth-child(6)>div>div.mt-2,
#content-header-row>div:nth-child(5)>div>div:nth-child(3),
#content-header-row>div:nth-child(5)>div>div:nth-child(4) {
	border: 1px !important;
	background: transparent !important;
}

body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(9)>p>span:nth-child(1) {
	color: #;
}

.widget-content-area {
	box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0), 0 1px 1px 0 rgba(0, 0, 0, 0), 0 1px 1px 1px rgba(0, 0, 0, 0) !important;
}

#sidebar ul.menu-categories li.menu>.dropdown-toggle[aria-expanded="true"]:not([data-active="true"]),
.wquesttable,
.tab-title,
.mail-box-container,
.mailbox-inbox,
.widget.box .widget-header,
#infocell,
.simple-tab .nav-tabs .nav-item.show .nav-link,
.simple-tab .nav-tabs .nav-link.active,
#basic>div.statbox.widget.box.box-shadow.mb-1.pt-2.pb-1>div>div>div,
.mail-box-container .avatar .avatar-title,
.page-item.active .page-link {
	background: transparent !important;
}

#divProfile>div:nth-child(2) {
	background: transparent !important;
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>h3 {
	color: transparent !important
}

#eqWin_content>div:nth-child(1),
#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(2)>div>div {
	background: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/item_frame.gif") !important;
}

#eqWin_content>div:nth-child(2),
#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(3)>div>div {
	background: url("https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/frame2.png") !important
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left {
	background: transparent !important;
}

.table-striped tbody tr:nth-of-type(odd) {
	background: # !important;
}

#content-header-row>div:nth-child(6)>div,
.table-striped tbody tr {
	background: # !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(1)>div>table>tbody>tr {
	background-color: # !important;
}

#zero-config>tbody>tr {
	background: # !important;
}

#content-header-row>form>div.row.mt-3.w-100>div:nth-child(2)>div>div {
	background: transparent !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(2)>div>h5 {
	color: # !important;
}

.crew_itembox {
	background-image: url("https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/frame3.png") !important;
}

body img[src*="gem_green1"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_green.webp") !important;
	width: 13px !important;
}

body img[src*="gem_blue2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_blue.webp") !important;
	width: 13px !important;
}

body img[src*="gem_red2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_red.webp") !important;
	width: 13px !important;
}

body img[src*="gem_white2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_white.webp") !important;
	width: 13px !important;
}

[id^="message"] {
	visibility: visible !important;
}

body>center>div.sub-header-container2 {
	display: none !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div>div>div>div>div {
	background-color: # !important;
	box-shadow: 2px 2px 5px #, -2px -2px 5px # !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div>div>div>div>div>div.w-100>div>table>tbody>tr {
	background-color: # !important;
	box-shadow: 1px 1px 3px #, -1px -1px 3px # !important;
}



body>center>div.header-container.fixed-top>header>ul:nth-child(1)>li>a>img {
	display: none !important;
}

#sidebar {
	position: fixed;
	top: 101px !important;
	left: 1px !important;
	height: 100% !important;
	box-shadow: 2px 2px 5px #, -2px -2px 5px # !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(2)>div>h5 {
	display: none !important;
}

#content-header-row>div:nth-child(6)>div>div.table-responsive>table>tbody>tr {
	background: # !important;
}

#content-header-row>div:nth-child(3)>form>div>div>table {
	background: # !important;
}

.tab-title,
.tab-title .nav-pills:nth-child(1) .nav-item:first-child a.nav-link,
.tab-title .nav-pills a.nav-link,
.mailbox-inbox .action-center {
	border: 1px !important;
}

.compose-box .compose-content form .mail-to svg,
.compose-box .compose-content form .mail-cc svg,
.compose-box .compose-content form .mail-subject svg {
	color: # !important;
}

#composeMailModal #btn-reply,
#composeMailModal #btn-fwd,
#composeMailModal #btn-send {
	background-color: # !important;
	border: 1px !important;
}

body>div.swal2-container.swal2-center.swal2-fade.swal2-shown>div>div.swal2-actions>button.swal2-confirm.swal2-styled,
.modal-content .modal-footer button.btn[data-dismiss=modal],
#composeMailModal #btn-save,
#composeMailModal #btn-reply-save,
#composeMailModal #btn-fwd-save {
	background-color: # !important;
	border: 1px !important;
}

#composeMailCancel {
	background-color: # !important;
	border: 1px !important;
}

.tab-title .nav-pills a.nav-link svg,
.new-control.new-checkbox {
	color: # !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>h3 {
	display: none !important;
}

body>div.swal2-container.swal2-center.swal2-fade.swal2-shown>div,
.modal-content .modal-header,
#addItem>div.modal-body {
	background: # !important;
	border: 1px !important;
}

body>cloudflare-app,
#content>div.footer-wrapper>div.footer-section.f-section-2>p {
	display: none !important;
}

#comTable>tbody>tr {
	background: # !important;
}

#content-header-row>div:nth-child(4)>div>div>div>table>tbody>tr {
	background: # !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3 {
	background: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/header.png") !important;
	background-size: cover !important;
	background-position: center center !important;
	width: 1241px !important;
	height: 181px !important;
}

#mailbox-inbox>div.content-box>div.d-flex.msg-close,
#mailbox-inbox>div.content-box {
	background: # !important;
}

#divProfile>div.widget.mb-2 {
	width: 1245px !important;
}

body img[src*="images/raidbelt8.gif"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/bwh.png") !important;
}

body>center>div.header-container.fixed-top>header {
	height: 1px !important;
	z-index: -9999 !important;
}

#container {
	position: relative !important;
	top: -71px !important;
}

body>center>div.sub-header-container {
	top: 1px !important;
}

body>center>div.header-container.fixed-top {
	display: none !important;
}

#bpWin_content>div {
	top: 501px !important;
}

#sidebar {
	top: 51px !important;
}

#outerdiv {
	left: -25px !important;
	top: -21px !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3>div.widget-heading.border-bottom-dashed>h6 {
	display: none !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3>div.widget-heading.border-bottom-dashed>span {
	display: none !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3>div.widget-content.text-left>div:nth-child(1)>a {
	display: none !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div {
	margin-top: -41px !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div>table {
	background: # !important;
	border: 1px solid #252959 !important;
	box-shadow: 2px 2px 5px #, -2px -2px 5px # !important
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div {
	background: # !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget.widget-chart-one.mb-3>div.widget-content.text-left>img {
	zoom: 150% !important;
	box-shadow: 1px 1px 2px 2px #040404 !important;
}

#divSkillsCast>img {
	zoom: 120% !important;
	box-shadow: 1px 1px 5px 5px #040404 !important;
}

body img[src*="ProfileSkills"] {
	display: none !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div {
	position: absolute !important;
}

#mailCollapseTwo>div>div.alert.alert-light-warning.border-0.mb-4 {
	background: # !important;
	color: # !important;
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div>div.widget-content.text-left>form>ul>li>div>div>div>a,
#rank-title {
	color: # !important;
}



body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(1)>div>span>span.selection>span,
body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li>p {
	background: transparent !important;
}

.alert-gradient {
	color: #fff;
	border: none;
	background-size: cover;
	background: #
}

body>center>div.sub-header-container>header>a {
	display: none !important;
}

body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(1)>div>span {
	width: 212px !important;
}

#content>div.footer-wrapper {
	display: none !important;
}

#ranks>li>div>div.media-body>p,
#ranks>li>div>div.media-body>h5>a {
	font-size: 14px !important;
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div {
	background: # !important;
	left: 21px !important;
	top: 205px !important;
}

#ranks>li,
#ranks>li>div {
	background: # !important;
	border: 1px solid !important;
}

#ranks>li>div>div.mr-3>div>div.rank-row-number>span {
	background: transparent !important;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
	margin-bottom: -0.3rem !important;
}

.ranksulli {
	padding: 1px 1px !important;
	padding-top: 1px !important;
	padding-right: 1px !important;
	padding-bottom: 1px !important;
	padding-left: 1px !important;
}

#rank-title {
	font-weight: bold !important;
	font-size: 16px !important;
	margin: 1px 1px !important;
}

#ranks>li>div>div.mr-3>div {
	padding: 1px 1px !important;
}

#ranks>li>div>div.media-body>h5>a {
	color: # !important;
}

#content>div.layout-px-spacing>table>tbody>tr>td:nth-child(2) {
	padding: 41px !important;
}

#mailHeadingEleven>div>div>div>div>div.f-body>div.meta-title-tag>p.meta-time.align-self-center>a {
	display: none !important;
}

.new-control.new-checkbox.checkbox-primary>input:checked~span.new-control-indicator {
	transform: none;
	background: #787878 !important;
}

.new-control.new-checkbox .new-control-indicator {
	transform: none;
	background: #787878 !important;
}

.mail-new {
	color: # !important;
}

#ranks>li>div>div.mr-3>div>div.rank-row-number>span {
	display: inline-block;
	text-align: center;
	font-size: 14px;
	line-height: 38px;
	color: #a6a6a6;
	background-color: #;
	width: 38px;
	height: 38px;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	border-radius: 50%;
}

#ranks>li>div>div.mr-3>div>div.rank-row-image {
	display: none !important;
}

#divProfile>div.widget.mb-2 {
	background: # !important;
	background-size: cover !important;
}


#container>div.footer-wrapper>div.footer-section.f-section-1 {
	display: none !important;
}


#content-header-row>div.col-12.col-xl-9.pl-0.pr-0>div.col-xl-12.col-lg-12.col-sm-12.layout-spacing>div>div:nth-child(2) {
	margin-top: -141px !important;
}

.page-item.disabled .page-link {
	background: # !important;
}

.page-item .page-link:hover {
	background: # !important;
}


#content-header-row>div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1>div>div.widget-content>div.tomb-bottom>div>p:nth-child(5) {
	display: none !important;
}

#content-header-row>div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1>div {
	background: #!important;
}

#roomDetails>ul>li {
	background: #!important;
	width: 301px !important;
}

#itemnameqty,
#qtygroup>label,
#content-header-row>div>table>tbody>tr>td>font>b {
	color: # !important;
}

#securityconfirm>div>div>div.modal-body,
#securityconfirm>div>div>form>div {
	background: # !important;
}

::-webkit-scrollbar {
	width: 11px;
}

::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px grey;
	border-radius: 11px;
}

::-webkit-scrollbar-thumb {
	background: #040404;
	border-radius: 11px;
}

::-webkit-scrollbar-thumb:hover {
	background: #;
}

#ranks>li>div,
#ranks {
	background: # !important;
}


#divProfile>div:nth-child(2)>div>div>div.col-xl-8.col-md-7>div>div:nth-child(4),
#divProfile>div:nth-child(2)>div>div>div.col-xl-8.col-md-7>div>div:nth-child(6) {
	display: none !important;
}

#zero-config_wrapper {
	border: 1px SOLID # !important;
	padding: 25px !important;
}

.table>thead>tr>th {
	color: # !important;
	border-top: # 1px solid !important;
	border-bottom: # solid 1px !important
}

#content-header-row>div>div>span>a {
	background: # !important;
	border: # solid 1px !important;
}

#content-header-row>div>table>thead,
#content-header-row>div:nth-child(6)>div>div.table-responsive>table>thead {
	background: # !important;
}

#content-header-row>div.col-12.col-xl-9.pl-0.pr-0>div.col-xl-12.col-lg-12.col-sm-12.layout-spacing {
	background: # !important;
}

.show>.btn-secondary.dropdown-toggle,
.show>.btn-primary.dropdown-toggle {
	color: # !important;
}

#roomDetails>ul {
	background: #!important;
}

#content-header-row>div.col-8.col-lg-3.pl-3.pl-xl-0.pr-1>div {
	left: 101px !important;
}

#treasury_search_form>div>div>div.modal-body,
#treasury_search_form>div>div>div.modal-footer {
	background: # !important;
	border: 1px SOLID # !important;
}

#treasury_search_form>div>div>div.modal-body>div.form-row.mt-3>div>table {
	background: # !important;
}



#content-header-row>table>tbody>tr>td>div>center>div>table>tbody,
#content-header-row>table>tbody>tr>td>div>center>div>table>tbody>tr {
	border: 1px solid # !important;
	background: #!important;
}


.raid_results {
	background: # !important;
	width: 651px !important;
	position: fixed !important;
	top: 65px !important;
	z-index: 1 !important;
	right: 21px !important;
	border: 1px solid # !important;
}


#content-header-row>div>div.col-12.col-lg-6.text-left.pl-5.mt-5.mt-md-0>div.skin-box2.d-flex.justify-content-center.align-items-center.mb-3 {
	display: none !important;
}

#content>div.layout-px-spacing>div.search {
	margin-left: -35px !important;
}

#quWin {
	display: none !important;
}

#sidebar {
	width: 201px !important;
}



.dropdown {
	position: relative;
	display: inline-block;
}

.dropdown-content {
	display: none;
	position: absolute;
	background-color: #;
	min-width: 201px;
	box-shadow: 1px 8px 16px 1px rgba(0, 0, 0, 0.2);
	z-index: 1;
	font-size: 12px;
}

.dropdown-content a {
	color: black;
	padding: 11px;
	text-decoration: none;
	display: block;
}

.dropdown-content a:hover {
	background-color: #;
}

.dropdown:hover .dropdown-content {
	display: block;
}

.dropdown:hover .dropbtn {
	background-color: #;
}

body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(5)>p,
body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(6)>p,
body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(7)>p,
body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(8)>p,
body>center>div.sub-header-container>header>ul.navbar-nav.flex-row.mr-auto.toolbar-nav>li:nth-child(9)>p {
	background: # !important;
	border: # 1px solid !important;
}

#massbuttons>a {
	display: none !important;
}

#key-tab,
#potion-tab,
#orb-tab,
#quest-tab,
#regular-tab {
	padding: 3px !important;
	zoom: 137% !important;
}

#t-text {
	color: # !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(1)>div>table>tbody>tr:nth-child(14)>td>div>div {
	background: # !important;
}





#eqWin_content>div:nth-child(1)>div:nth-child(1) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(2) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(3) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(4) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(5) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(6) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(7) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(8) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(9) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

#eqWin_content>div:nth-child(1)>div:nth-child(10) {
	box-shadow: 1px 1px 1px #, -1px -1px 1px # !important;
}

.simple-tab .nav-tabs .nav-link.active {
	background: # !important;
}



#simpletabContent>div:nth-child(2)>div.col.pr-0>small {
	display: none !important;
}



#eqWin_content {
	transform-origin: right center !important;
}

#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(8) {
	width: 18px !important;
}

#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(9) {
	width: 18px !important;
}

#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(10) {
	width: 18px !important;
}

#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(11) {
	width: 18px !important;
}

#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(12) {
	width: 18px !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(4)>div>div>h6.text-left {
	padding-bottom: 11px !important;
}


body>div.swal2-container.swal2-center.swal2-fade.swal2-shown>div>div.swal2-header>div.swal2-icon.swal2-success.swal2-animate-success-icon {
	display: none !important;
}

#purchaseconfirmdialog>div>div>form,
#purchaseconfirmdialog>div>div>div.modal-body {
	background: # !important;
}


#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(2)>div {
	background: # !important;
	background-position: center center !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-8.col-md-7>div>div:nth-child(5)>div>h5 {
	display: none !important;
}

#content-header-row>table>tbody>tr>td>p>b>font {
	font-size: .8em !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div {
	transform: scale(0.80) !important;
	transform-origin: left top;
	left: -1px !important;
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div {
	left: -171px !important;
	width: 551px !important;
}

#rankings_home {
	margin-left: -21px !important;
	margin-top: -15px !important;
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div>div.widget-heading>h6>hr {
	border-top: # 2px solid !important;
}

body img[src*="images/suppliesheader"] {
	display: none !important;
}

#moxxi_mod_page {
	font-size: 1.5rem !important;
}

#accordionExample > li:nth-child(3) > a {
  text-transform: uppercase !important;
}

#accordionExample > li:nth-child(3) > a > div:nth-child(1) > span {
  margin-left:4px !important;
}

body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(6) > p,body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(7) > p,body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(8) > p,body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(9) > p,body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.progress-top > table > tbody > tr > td:nth-child(1) > div > button,document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(10) > p") {
  box-shadow: 1px 1px 5px -1px # !important;
}

#content-header-row > div.col-12.col-xl-9.pl-0.pr-0 > div.col-xl-12.col-lg-12.col-sm-12.layout-spacing > div > div.table-responsive.mt-3 > table > tbody > tr,#content-header-row > div.col-12.col-xl-9.pl-0.pr-0 > div.col-xl-12.col-lg-12.col-sm-12.layout-spacing > div > div.table-responsive.mt-3 > table > thead > tr {
  background: #040404 !important;border: 1px # solid !important;
}

#roomDetails > ul > li:nth-child(1) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_1.png") !important;
}
#roomDetails > ul > li:nth-child(2) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_2.png") !important;
}
#roomDetails > ul > li:nth-child(3) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_3.png") !important;
}
#roomDetails > ul > li:nth-child(4) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_4.png") !important;
}
#roomDetails > ul > li:nth-child(5) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_5.png") !important;
}
#roomDetails > ul > li:nth-child(6) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_6.png") !important;
}
#roomDetails > ul > li:nth-child(7) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_7.png") !important;
}
#roomDetails > ul > li:nth-child(8) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_8.png") !important;
}
#roomDetails > ul > li:nth-child(9) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_9.png") !important;
}

body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(10) > p{background: # !important;}

img[src*="ammy"] {
    margin-left: -2px !important;
    margin-right: 12px !important;
    margin-top: 7px !important;
}

#skillsbar > img{margin-left: 4px !important;margin-top:4px !important;margin-bottom:4px !important;margin-right:4px !important;}
#skillsbar {background: # !important;margin-left: 6px !important; margin-right:6px !important;}

#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget.widget-chart-one.mb-3{display:none !important;}
#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div{top: 11px !important;}

#divTrade > div > h1{display:none !important;}

#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(1){width:10% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(2){width:15% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(3){width:5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(4){width:5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(5){width:5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(6){width:5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(7){width:5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(8){width:45% !important;}

.sub-header-container .navbar,body > center > div.sub-header-container > header,#content-header-row > h2,#attackmodal > div > div,#eqWin_handle,#bpWin_handle{background: linear-gradient(-45deg, #670000, #, #670000, #670000, #670000, #670000);background-size: 400% 400%;-webkit-animation: gradient 15s ease infinite;animation: gradient 15s ease infinite;}
@-webkit-keyframes gradient {0% {background-position: 0% 50%;}50% {background-position: 100% 50%;}100% {background-position: 0% 50%;}}
@keyframes gradient {0%{background-position: 0% 50%;}50% {background-position: 100% 50%;}100% {background-position: 0% 50%;}}

#content-header-row > div > div > table{background:# !important;}

#EQhome{margin-top: 65px !important; margin-bottom:91px !important;margin-left:65px !important;transform: scale(1.33) !important;}
#EQworld{margin-left:-6px !important;margin-bottom:-61px !important;}


#rankings_home{height:235px !important;overflow-y: scroll !important;margin-left:5px !important;margin-top:11px !important;width:253px !important;}
#rankings_charele{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}
#rankings_crewpow{height:235px !important;overflow-y: scroll !important;margin-left:5px !important;margin-top:11px !important;width:253px !important;}
#rankings_crewele{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}
#rankings_charchaos{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}
#rankings_chargrowth{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}
#rankings_crewchaos{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}
#rankings_crewboss{height:235px !important;overflow-y: scroll !important;margin-left:11px !important;margin-top:11px !important;width:253px !important;}

#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div{width:421px !important;margin-left:5px !important;}

#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div > div:nth-child(2) > div{margin-left:-15px !important; margin-top:25px !important;}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div > div:nth-child(3) > div{margin-left:-15px !important;}

#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div{width:497px !important;margin-left:5px !important;}

#char_rankings{padding: 5px !important;}
#crew_rankings{padding: 5px !important;}

.list-group-item{background:# !important;}

#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div{background: # !important;}

#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing{margin-top:471px !important;}

.dropbtn {
    position: relative !important;
    height: 15px !important;
    margin-right: 15px !important;
    background: #1A1C2D !important;
    color: #FFFF00 !important;
    border:0px SOLID !important;
    font-size:16px !important;
    margin-left: 10px !important;
    font-weight: bold !important;
    }

#toolbar1{margin-top:-8px !important;}

#toolbaralerts{
    margin-right:15px !important;
    margin-top:-8px !important;
    background:# !important;
	letter-spacing: .02rem;
    font-size: 8px;
    height:42px !important;
	font-weight: bold;}

#toolbaralerts img {margin-left:3px !important;margin-right:3px !important;margin-bottom:3px !important;border: # solid 1px !important;}

#toolbarskills{
    margin-right:15px !important;
    margin-top:-8px !important;
    background:# !important;
	letter-spacing: .02rem;
    font-size: 8px;
	font-weight: bold;
	height:42px !important;}

#toolbarskills img {margin-left:3px !important;margin-right:3px !important;margin-bottom:3px !important;}

body img[src*="toolbar/Quests"] {
display:none !important;
}


body img[src*="button_increasestat"] {
	opacity: 1 !important;
    
}

.bio .widget-content-area .b-skills [src$=".gif"] {
	filter: hue-rotate(235deg) grayscale(100%) saturate(1) brightness(1) !important;
}

#sessidbox{background:# !important;border:1px # solid !important;color:# !important;font-size: 11px;margin-left:1px !important;}

body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(4) > div > a > button{height:22px !important;margin-top:5px !important;margin-left:-12px !important;margin-right:1px !important;}

#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(1){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(2){width: 14% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(3){width: 0% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(4){width: 0% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(5){width: 0% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(6){width: 9% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(7){width: 7% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(8){width: 7% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(9){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(10){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(11){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(12){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(13){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(14){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(15){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(16){width: 22% !important;}


#content-header-row > div.col-12.col-xl-9.pl-0.pr-0{top:111px !important;}
#content-header-row > div.col-12.col-xl-9.pl-0.pr-0 > div.col-xl-12.col-lg-12.col-sm-12.layout-spacing > div,#content-header-row > div.col-12.col-xl-9.pl-0.pr-0 > div.col-xl-12.col-lg-12.col-sm-12.layout-spacing{background:# !important;}

#rightbar{position:fixed !important; right: 1px !important; top: 55px !important;padding:11px !important;box-shadow:2px 2px 5px #, -2px -2px 5px # !important; background: # !important;}
#rightbar > center > p > img{margin-bottom:5px !important;margin-top:5px !important; width:36px !important; height:36px !important;}
#toolbaralerts > center > a > img,#toolbaralerts > center > img{margin-left:7px !important;margin-right:7px !important;}
#toolbaralerts > a > img,#toolbaralerts > img{width:36px !important;height:36px !important;margin-top:3px !important;}
#bossloot > b{font-size: 14px !important; margin-left: 3px !important;margin-right: 3px !important;}
#bossloot{margin-right: 2px !important;}
#bossloottable > tbody > tr > td{border:1px SOLID !important;}

#divHeader > h3{background: # !important;padding: 5px !important;}

#rightbar > center > p > img {
    outline: 1px solid #;
    outline-offset: -1px;}
    
#rankings_home,#rankings_charele,#rankings_charchaos,#rankings_crewpow,#rankings_crewele,#rankings_crewchaos{width: 342px !important;height:223px !important;}

#toolbar1 > table > tbody > tr > td:nth-child(1) > div > div > font > a, #toolbar1 > table > tbody > tr > td:nth-child(4) > div > div > font > a, #toolbar1 > table > tbody > tr > td:nth-child(3) > div > div > font > a{background-color:#060818 !important; color:#ffffff !important;border:1px solid #FFFFFF !important;}

#toolbar1 > table > tbody > tr > td > div > div{top:25px !important;}

#rankings_home > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}
#rankings_charele > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}
#rankings_charchaos > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}
#rankings_crewpow > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}
#rankings_crewele > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}
#rankings_crewchaos > li > div > div > div > table > tbody > tr > td{border-bottom:1px SOLID # !important;}

#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing{margin-top: 451px !important;}

#gemcalc{text-align: left !important;}

#itemGemCalc{font-family:verdana;font-size:7pt;color:# !important;margin-top:1px !important;}

#itemGemCalc > table > tbody > tr > td {padding:4px !important;background: rgba(15, 15, 15, 0.9) !important;}

#mouseovergem{margin-top:5px !important;}

#myRank{background:# !important;color: # !important;width:201px !important;font-weight: bold !important;}

#recentraid {position: fixed !important; bottom:25px !important; right:1px !important;padding:11px !important;box-shadow:2px 2px 5px #, -2px -2px 5px # !important; background: # !important;}

#recentraid > center > p > a > img {margin-bottom:5px !important;width:36px !important; height:36px !important;outline: 1px solid # !important; outline-offset: -1px !important;margin-top:5px !important;}

#rightbar{position:fixed !important; right: 1px !important; top: 81px !important;padding:11px !important;box-shadow:2px 2px 5px #, -2px -2px 5px # !important; background: # !important;}

#mvhead{margin-bottom: 11px !important;letter-spacing: .2rem !important;font-family:Snell Roundhand, cursive !important;font-size: 31px !important;}

#beta{margin-top: 21px !important;}

#expbar{display:none !important;}

	
.godstatus > tbody > tr > td {padding:5px !important;}
.godstatus > tbody > tr > td > div > img{border-radius: 8px !important;border: 1.01em solid #ddd !important;}
.godstatus > tbody > tr > td > div{font-size: 14px !important;}

.godbox {
  position: relative !important;
  text-align: center !important;
  color: white !important;
}
.centered {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

#crewpic > center > img{
  outline: 2px solid white !important;
  outline-offset: -2px !important;
  border-color: # !important;
  box-shadow: 0 0 11px # !important;
  margin-bottom:51px !important;
  }
#crewmembers,#crewmembers > tbody > tr{
  background:# !important;
  }
#crewmembers > thead > tr > th{
  position: sticky;top:-2px !important;
  background:# !important;
  z-index: 2 !important;
  background:#111111 !important;
  }
#memberdiv {
  width: 100% !important;
  height: 601px !important;
  overflow: auto !important;
  margin-top:-15px !important;}
#outercrewpro > tbody > tr > td:nth-child(2) > center > div > div.mt-2{
  background: rgba(76, 175, 80, 0.0) !important;
  }
#alliesandenemies{
  margin-top:11px !important;
  background:# !important;
  border:1px SOLID !important;
  }
#outercrewpro > tbody > tr > td:nth-child(2) > table{
  background:# !important;
  border:1px SOLID !important;
  margin-top:1px !important;
  margin-bottom:25px !important;
  }
#crewlinks,#crewlinks > a{
  font-size:11px !important;
  }
#alliesandenemies > tbody > tr > td {
  font-size:14px !important;
  padding: 11px !important;
  }
.crewpro > tbody > tr > td {
  font-size:14px !important;
  padding-right:21px !important;
  padding-left:21px !important;
  padding-top:15px !important;
  padding-bottom:15px !important;
  }
#alliesandenemies > tbody > tr > td > center > div {
  width: 301px !important;
  height: 68px !important;
  overflow: auto !important;
  }
#crewdesc{
  width: 641px !important;
  margin-top: 11px !important;
  background: # !important;
  border: 1px SOLID !important;
  overflow-y: auto !important;
  }
.crewpro{
  margin-top:-21px !important;
  margin-bottom:-25px !important;
  }
#crewmembers > tbody > tr:nth-child(odd) {
  background-color: # !important;
  }
#memberdiv{
  border: 2px solid # !important;
  border-radius: 7px !important;
  outline: none !important;
  border-color: # !important;
  box-shadow: 0 0 11px # !important;
  }
  
#content-header-row > div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.tomb-middle{
  margin-top:31px !important;
}
  
#outercrewpro > tbody > tr > td:nth-child(2) > center{
  font-size:12px !important;
  }
#outercrewpro > tbody > tr > td:nth-child(2) > center > div > div:nth-child(1) > img {
  height:51px !important;
  width:51px !important;
  }
  
  /* freezing top row of moxxivision might need to be moved to tampermonkey if it impacts other content */
  
  #zero-config, #zero-config > thead > tr {
    position: sticky;
    top: 0;
    background: #;
    z-index: 2;
    border: 3px # SOLID !important;
    }

.sub-header-container .navbar, body > center > div.sub-header-container > header, #content-header-row > h2, #attackmodal > div > div, #eqWin_handle, #bpWin_handle {
    background: linear-gradient(-45deg, #1a1c2d, #, #1a1c2d, #1a1c2d, #1a1c2d, #1a1c2d);
    background-size: 400% 400%;
    -webkit-animation: gradient 15s ease infinite;
    animation: gradient 15s ease infinite;
}

#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div {
    background: # !important;
}

.list-group-item {
    background: # !important;
}

#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div>div>div>div>div {
    background-color: # !important;
    box-shadow: 2px 2px 5px #, -2px -2px 5px # !important;
}

a,
.tab-title .nav-pills .nav-link.active svg,
.tab-title .nav-pills .show>.nav-link svg,
.simple-tab .nav-tabs li a {
	color: # !important;
}

.select2-container--default .select2-results__option--highlighted.select2-results__option--selectable {
	background-color: # !important;
	color: # !important;
}

#content-header-row>div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing>div>div.widget-content.text-left>form>ul>li>div>div>div>a,
#rank-title {
	color: # !important;
}

.mail-new {
	color: # !important;
}

#itemnameqty,
#qtygroup>label,
#content-header-row>div>table>tbody>tr>td>font>b {
	color: # !important;
}

::-webkit-scrollbar-thumb:hover {
	background: #;
}

.show>.btn-secondary.dropdown-toggle,
.show>.btn-primary.dropdown-toggle {
	color: # !important;
}

#t-text {
	color: # !important;
}

#sessidbox{background:# !important;border:1px # solid !important;color:# !important;font-size: 11px;margin-left:1px !important;}
			
#content-header-row>div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing>div.widget-content.widget-content-area.text-left>div>div>div>div>div>div>div.w-100>div>table>tbody>tr {
    background-color: # !important;
    box-shadow: 1px 1px 3px #, -1px -1px 3px # !important;
}

#divProfile>div:nth-child(2)>div>div>div.col-xl-4.col-md-5>div>div:nth-child(1)>div>table>tbody>tr {
    background-color: # !important;
}



body {
    color: # !important;
    background-image: linear-gradient(180deg, #, #, #, #, #, #, #, #) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-position: center top !important;
}

#recentraid {
    position: fixed !important;
    bottom: 25px !important;
    right: 1px !important;
    padding: 11px !important;
    box-shadow: 2px 2px 5px #, -2px -2px 5px # !important;
    background: # !important;
}

#sidebar {
    color: # !important;
    border: 1px !important;
    background: # !important;
}

.widget {
    background: # !important;
    box-shadow: 2px 2px 5px #, -2px -2px 5px # !important;
    -webkit-perspective: 1000;
    -webkit-backface-visibility: hidden;
}

#content-header-row > div:nth-child(2) > div > div.btn-group.mb-3.mr-2{
    border: 1px solid # !important;
}

.widget-content-area {
    background: rgba(76, 175, 80, 0) !important;
    }

#basic > div.widget-content.widget-content-area > div:nth-child(2) > div.col-12.col-lg-7.simple-tab > div > ul{box-shadow: 2px 2px 3px #, -1px -1px 3px # !important;}

#myRank {
    background: #191E3A !important;
    color: #FFFFFF !important;
    width: 201px !important;
    font-weight: bold !important;
}
#crewupgrades > center > div > div:nth-child(1) > img{width:51px !important; height:51px !important;}
#crewupgrades > center > div > div.mt-2{background-color:rgba(0, 0, 0, 0.0) !important;}

#spec{background:#191E3A !important;padding:15px !important;margin-left:17px !important;}

#divCollections > div.row > div > div > div{height:386px !important;}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
