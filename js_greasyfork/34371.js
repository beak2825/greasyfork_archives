//
// Written by Glenn Wiking
// Script Version: 0.2.1b
// Date of issue: 02/09/17
// Date of resolution: 02/09/17
//
// ==UserScript==
// @name        ShadeRoot Paypal
// @namespace   SRPP
// @description Eye-friendly magic in your browser for Paypal
// @include     https://*paypal.*
// @include     *paypal.*
// @include     https://*paypal-topup.*
// @include     *paypal-topup.*

// @version     0.2.1b
// @icon        https://i.imgur.com/Ob9WKt8.png
// @downloadURL https://update.greasyfork.org/scripts/34371/ShadeRoot%20Paypal.user.js
// @updateURL https://update.greasyfork.org/scripts/34371/ShadeRoot%20Paypal.meta.js
// ==/UserScript==

function ShadeRootPP(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPP (
	//BG COLOR
	'html, .row-fluid, .vx_foreground-container {background-color: #1a2c3c !important;}'
	+
	//TEXT COLOR
	'.headline, h1, h2, h3, h4, h5, h6, li, label, .nav, .besthelp_quicknav_link, .row-fluid [class*="span"]:first-child, .sticky-nav-links, .decisionTable table, #gblFooter ul a, .overpanel-body dt, .card, .cardName, .month-name, .message {color: #c3e1f0 !important;}'
	+
	//TEXT COLOR 2
	'p, .header-buttons a, .btn-signup, .secondaryLink a:not(.btn), a.secondaryLink, .engagementStatusModule, .overpanel-body dd span, .overpanel-body .overpanel-description span {color: #70bce3 !important;}'
	+
	'.pp-header.table-row::after {border-bottom: 1px solid rgba(30, 68, 125, 0.78) !important;}'
	+
	'.pp-header.table-row .header-buttons .btn-small, .pp-header.table-row .header-buttons .btn-small.btn-secondary:focus, .pp-header.table-row .header-buttons .btn-small.btn-signup:focus {box-shadow: 0 0 0 1px #187db4,0 0 0 1px #2866ad !important;}'
	+
	'.btn-signup {background-color: #188df0 !important;}'
	+
	//IMG OPACITY
	'img, .editorial-img {opacity: .8 !important;}'
	//"CIRCLE" COLOR
	+
	'p.circle {border: 1px solid #2674a5 !important;}'
	+
	//DIV COLOR 1
	'.global-footer, .container-fluid, .contents, .besthelp_quicknav_adjustheight, #grandFooter, #besthelp_quicknav, .vx_globalFooter, .falconTray {background-color: #111c24 !important;}'
	+
	'.nav, .progress {background-color: #1d5f8f !important;}'
	+
	//DIV COLOR 2
	'.engagementMainBar-container, .theoverpanel, .wallet {background-color: #143459 !important;}'
	+
	//DIV COLOR 3
	'.engagementStatusModule, .mainBody, .overpanel-wrapper,.overpanel-content, .menu, .overpanel-body {background-color: #0d1b29 !important;}'
	+
	'.emSlideDownContainer {border-top: 1px solid #1C4865 !important; border-bottom: 1px solid #1A547B !important;}'
	+
	'.engagementMainBar-separator {color: #115175 !important; background-color: #155c84 !important;}'
	+
	'.profileStatus::after {border-top-color: #143459 !important;}'
	+
	'.tabs-wrapper .nav-tabs > li > a {color: #c0d9e6 !important};'
	+
	'.selectModule.active::before {border-top-color: 1px solid #1C4865 !important;}'
	+
	'hr {background-color-image: linear-gradient(to right,#1e73a8 50%,rgba(255,255,255,0) 40%) !important;}'
	+
	'.language {border-right: 1px solid #12588c !important;}'
	+
	'.vx_globalNav-main, .vx_globalNav-main_mobile, #besthelp_search_module_outer, .pp-header.table-row, .blue {background-color-image: linear-gradient(100deg, #0d4368, #102b54) !important;}'
	+
	'#besthelp_search_input {background-color: #255d93 !important; border: 1px solid #1f78c5 !important; color: #d6dcdd !important;}'
	+
	'#besthelp_quicknav_container, #besthelp_quicknav_body, #contents, #besthelp_master_container, #gblFooter, #onboardingContent {background-color: #1c5687 !important;}'
	+
	'#besthelp_quicknav_body_inner {border-top: 1px #2a599f solid !important;}'
	+
	'.vx_globalFooter {border-top: 1px solid #0b1e2f !important; text-shadow: 0 1px 1px #145093 !important;}'
	+
	'.vx_globalFooter_secondary {border-top: 1px dotted #1a5784 !important;}'
	+
	'#besthelp_master_container, #besthelp_call_topcontact_container, .panel-default, .panel, .panel-body, #besthelp_critical_alerts_body, #besthelp_critical_alerts_container {background-color: #1C5687 !important;}'
	+
	'a:hover, .vx_globalFooter-list a:hover {color: #4093bd !important;}'
	+
	'.parallax-bg, .hero-bg, .paypal {filter: brightness(.8);}'
	+
	'.pageHeadline {color: #0a6bda !important;}'
	+
	'.box, .emSlideDownContainer {border-top: 1px solid #164069 !important; border-bottom: 1px solid #183c53 !important; background: #1A2C3C !important;}'
	+
	'html[data-device-type="dedicated"] tbody, html[data-device-type="portable"] tbody {border-left: 1px solid #3b789f !important;}'
	+
	'tr {border-bottom: 1px solid #367ba7 !important;}'
	+
	'.four-panel {border-top: 1px solid #15426e !important;}'
	+
	'.pp-header.table-row > div {background: #0e385c33;}'
	+
	'.paypal {border-right: 1px solid #185F8D !important;}'
	+
	'.footer .legalFooter, footer ul {background-color: #102636 !important;}'
	+
	'.textInput input, .textInput textarea {border: 1px solid #175183 !important; background: #0a2a48 !important; color: #93cae4 !important;}'
	+
	'a.button.secondary, a.button.secondary:link, a.button.secondary:visited, .button.secondary {background-color: #0C4A87 !important; color: #BCD8E6 !important;}'
	+
	'.loginSignUpSeparator, .footerNav {border-top: 1px solid #176c9c !important;}'
	+
	'.textInSeparator {background-color: #176c9c !important; color: #cae0ec !important; border-radius: 8px !important;}'
	+
	'.form-container {border-left: 1px solid #163E4E;}'
	+
	'html[data-device-type="dedicated"] .social-img {border-radius: 7em !important;}'
	+
	'.notificationContainer.caret::after {border-color: transparent transparent #26456c !important;}'
	+
	'.notificationContainer.caret::before {border-color: transparent transparent #28679c !important;}'
	+
	'.notificationContainer.caret {border: 1px solid #225e84 !important; background: #124774 !important; text-shadow: 0 1px #2b76bf !important;}'
	+
	'.back-arrow {color: #4EAEE7 !important;}'
	+
	'.decisionTable table tr th:first-child, .decisionTable table tr td:first-child {border-left: 1px solid #2975b6 !important;}'
	+
	'.decisionTable table tr th {background: #12416e !important; border-top: 1px solid #2882bc !important;}'
	+
	'.decisionTable table tr th, .decisionTable table tr td {border-right: 1px solid #1674b0 !important; border-bottom: 1px solid #1d7cb0 !important;}'
	+
	'.decisionTable th {border: 1px solid #1f6eb100 !important;}'
	+
	'#upgradeAccount {border-radius: 1em !important; padding: 1em !important;}'
	+
	'.verticalRule {border-left: 1px solid #238ac2 !important;}'
	+
	'.mask {background-color: #1D5F8F !important;}'
	+
	'.contentContainer header {background: #164c80 !important; padding: .5em;}'
	+
	'.contentContainer {background-color: #173f63 !important; padding: 1em !important;}'
	+
	'a .icon {background: rgba(23, 42, 53, 0.8) !important;}'
	+
	'.vx_globalNav-list li.vx_isActive a, .vx_globalNav-list li.vx_isActive a:active {border-bottom: 1px solid #104272 !important;}'
	+
	'.feature-bundle .vx_globalNav-navContainer .vx_globalFooter-list a:hover {color: #143a53 !important;}'
	+
	'.fiModule-container, .activityModule {border: 1px solid #115d9e !important; background-color: #143254 !important;}'
	+
	'.fiModule-title-header {color: #aed5e9 !important;}'
	+
	'.fiModule-list-item {border-bottom: 1px dotted #368fc5 !important;}'
	+
	'.fiModule-container_shadow {box-shadow: 0 2px 2px #0d3363 !important;}'
	+
	'.setupStep-almostDoneState .setupStep-icon, .setupStep-doneState .setupStep-icon {background: #0e4472 !important; border: 1px solid #1f87ed !important; color: #2186e9 !important;}'
	+
	'.welcomeMessage.active .vx-btn_toggleProfileStatus {background-color: #0b2a44 !important;}'
	+
	'.selectModule.active::before {border-top-color: #185680 !important;}'
	+
	'.col-sm-4 {padding-bottom: 1em !important;}'
	+
	'.help:hover, .help:focus, .help:active {background: #1464b3 !important;}'
	+
	'.overpanel-body .image.pp, .overpanel-body .logo.pp {border: 1px solid #134e81 !important;}'
	+
	'.hasSpinner::after {background: #104b7e !important;}'
	+
	'.fundingSources .moduleHeader {border-bottom: 1px solid #255b98 !important;}'
	+
	'.paypalSourcesContainer {padding: 20px 1em 135px !important;}'
	+
	'.banking, .addFI.card {background: #14568f !important;}'
	+
	'.help-information.open::after, .no-js .help-information::after, .help-information.open::after, .no-js .help-information::before {border-color: transparent transparent #0d568d !important;}'
	+
	'#iban-help-information {background: #103e72 !important; border-radius: 0em 0em 1em 1em !important; padding: .5em !important;}'
	+
	'.help-information-open {text-shadow: none !important;}'
	+
	'.customDates-field {color: #89cbec !important; background: #12476e !important;}'
	+
	'.date-picker-wrapper {background-color: #083853 !important;}'
	+
	'.month-wrapper {background-color: #0f5693 !important; border-right: solid 1px #1667b7 !important;}'
	+
	'.date-selected {background: #25485900 !important;}'
	+
	'.vx_form-control {border: 1px solid #0e6dbd !important; background: #124368 !important; color: #d1e9f6 !important;}'
	+
	'.displayMode-btn {color: #bce2f5 !important;}'
	+
	'.filterTagOval {background-color: #48b2ec !important;}'
	+
	'.vx_form-control_complex input {background: #264a68 !important; color: #d0e5f2 !important;}'
	+
	'.vx_form-control {background: #1a3657 !important;}'
	+
	'.popover {background-color: #154060 !important;}'
	+
	'.popover.bottom > .arrow::after {border-bottom-color: #154060 !important;}'
	+
	'.advancedSearch-txnTypeOval {background-color: #2964bc !important;}'
	+
	'.modal-overlay, .spinner.loading {background-color: #0f2a51 !important;}'
	+
	'.selected {background-color: #12344e !important;}'
	+
	'.challenge-list {border-top: solid #2a4f68 !important;}'
	+
	'.modal-animate {background: #071b27 !important; color: #DDE9EE !important;}'
	+
	'.css-15c4zbn {background-color: #0d2132 !important; border: 1px solid rgb(12, 69, 101) !important; color: rgb(197, 221, 239) !important;}'
	+
	'.css-47cvlc {color: rgb(197, 221, 239) !important;}'
	+
	'.engagementBanner-background_transferMobile, .transferBannerContainer {background-color: #11324b !important;}'
	+
	'.transferActionColumns:not(:last-child) {border-right: 1px solid #2f5d8a !important;}'
	+
	'.engagement-0-listItem .selectModule::after, .engagement-1-listItem .selectModule::after, .engagement-2-listItem .selectModule::after {border-top-color: #123557 !important;}'
	+
	'.moduleHeaderLink::after {border-top: 2px solid #a9ccde !important; border-right: 2px solid #87a3b1 !important;}'
	+
	'.address div, .overpanel-body dd, .overpanel-body .overpanel-description, .moduleHeaderLink, .nemo_moduleHeaderLink {color: #bce2f5 !important;}'
	+
	'.emModule, .js_emModule, .nemo_EM_ShopBanner, .active {filter: brightness(.8) !important;}'
	+
	'.mpiHeader {color: #1a3254 !important;}'
	+
	'.settings .account .vx_panel, .settings .security .vx_panel, .settings .paymentsTab .vx_panel, .settings .logInWithPaypal .vx_panel {background: #17212f !important;}'
	+
	'.profileDetail-container {border-bottom: thin solid #1c4459 !important;}'
	+
	'.lined li {border-bottom: 1px solid #1f4f72 !important;}'
	+
	'.custom-select {background: #193a60 !important; color: #DDE !important;}'
	+
	'.navbar {background: #4f6780 !important; min-height: 70px !important;}'
	+
	'body {background-color: #142130 !important; color: #DDE;}'
	+
	'.jumbotron {background-color: #1b3e66 !important;}'
	+
	'.jumbotron-default {border-top: 1px solid #0f4166 !important; border-bottom: 1px solid #173f62 !important; background: #0f314a !important;}'
	+
	'hr.footer {border-top: 1px solid #1b3f62 !important;}'
	+
	'.row-footer a {color: #c1d5e3 !important;}'
	+
	'.well {background-color: #153f60 !important; border: 1px solid #185a7a !important;}'
	+
	'.ph1-consumer-report, .main-content, #besthelp_guest2_body, #besthelp_quicknav_container {background-color: #163957 !important;}'
	+
	'.slide p {color: #e1f9fb !important;}'
	+
	'.loader-wrapper {background-color: #123047 !important; border: solid 1px #114c74 !important;}'
	+
	'.primary-tab > div > div {border: solid 1px #184869 !important; box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.08), 0 0 4px 0 rgba(0, 0, 0, 0.08) !important; background: #224e7a !important;}'
	+
	'h2, .vx_text-2, .active div span {color: #DDE !important;}'
	+
	'.nav-tabs {border-bottom: 1px solid #154686 !important;}'
	+
	'.vx_hr {border-top: 1px solid #125278 !important;}'
	+
	'.tabs-wrapper .nav-tabs > li.active > a, .tabs-wrapper .nav-tabs > li.active > a:focus, .tabs-wrapper .nav-tabs > li.active > a:hover {background-color: #1b4771 !important; border-bottom-color: transparent !important; color: #c6e4f8 !important;}'
	+
	'.nav-tabs > li > a {background-color: #2b4963 !important; color: #b7d1de !important; border-color: #25496c !important;}'
	+
	'.Select {background-color: #164069 !important;}'
	+
	'.Select-menu-options {background: #23577d;}'
	+
	'.Input {background-color: #123350 !important; border: 1px solid #327a9e !important; color: #c5e0ed !important;}'
	+
	'.tab-item-count {color: #32a0d7 !important;}'
	+
	'.tabs-wrapper .nav-tabs > li > a {color: #ceeaf8 !important; border-color: #214b75 !important;}'
	+
	'.Select-menu-options:hover {background-color: #0e3a56 !important;}'
	+
	'.tabs-wrapper .nav-tabs > li > a:hover {border-color: #184572 !important; background-color: #1a436c !important;}'
	+
	'.filter-text {color: #b5cfdd !important;}'
	+
	'table#dispute td {border-bottom: 1px solid #185684 !important;}'
	+
	'table td {background-color: #172f47 !important;}'
	+
	'table#dispute {border: 1px solid #21486e !important; border-top: 1px solid #245387 !important; background-color: #174b86 !important; color: #DDE !important;}'
	+
	'table#dispute thead th {background: #1e5477 !important; border-left: 1px solid #115496 !important; border-right: 1px solid #1d6bb7 !important; border-bottom: 1px solid #266ea4 !important; color: #DDE !important;}'
	+
	'.caseTable thead th {border-top: 1px solid #1D59A7 !important; color: #DDE !important;}'
	+
	'#inexperienced .info {border: 1px solid #1c4472 !important; background: #10324b !important;}'
	+
	'.tabItems li.top {color: #b5cfdd !important; border-bottom: 1px solid #406596 !important; background: #205a86 !important;}'
	+
	'.tabItems li {background: #1b5383 !important; color: #c9dcef !important;}'
	+
	'.tabItems li a, #navGlobal ul li a {color: #c9dcef !important;}'
	+
	'#html-rosetta {background: #11406e !important;}'
	+
	'.tabContent {border: 1px solid #164d71 !important;}'
	+
	'#navPrimary ul {background: none !important;}'
	+
	'.tabItems .top p, .tabItems li p {background: #1a4474 !important;}'
	+
	'.tips ul li a {color: #3b84d1 !important;}'
	+
	'.row-fluid {background-color: #11457700 !important;}'
	+
	'.callout {border-top: 1px solid #1f496c !important;}'
	+
	'.welcome .last .box {border: 1px solid #144875 !important;}'
	+
	'.welcome .last .box h3 {background-color: #17426e !important;}'
	+
	'.welcome .first .box {border: 1px solid #20497e !important;}'
	+
	'.welcome .first .box .body {border-top: 1px solid #2a516e !important;}'
	+
	'table.basic th {border-bottom: 1px solid #1f5183 !important; border-right: 1px solid #16507b !important; background-color: #244f7a !important;}'
	+
	'table.basic {border: 1px solid #1b4c77 !important;}'
	+
	'table.basic td {border-bottom: 1px solid #15436b !important;}'
	+
	'.datatable .title, .datatable .filters, .datatable .actions, .datatable .pagination {border-top: 1px solid #1c557a !important; border-bottom: 1px solid #1f4f74 !important;}'
	+
	'.datatable {border: 1px solid #245381 !important;}'
	+
	'.datatable .title {background: #0b334d !important;}'
	+
	'.datatable table {border-top: 1px solid #133363 !important; border-bottom: 1px solid #174466 !important;}'
	+
	'.welcome #headline .metadata li a {color: #3b84d1 !important;}'
	+
	'.datatable tr th {border-bottom: 1px solid #0f4675 !important; background-color: #2d4257 !important;}'
	+
	'.datatable tr th {border-right: 1px solid #153a6b !important;}'
	+
	'.datatable .actions {background: #15212a !important;}'
	+
	'.datatable table {border-bottom: 1px solid #163A56;}'
	+
	'.links li a {color: #4594e6 !important;}'
	+
	'.sidebox {border: 1px solid #234f74 !important;}'
	+
	'h3.head {border-bottom: 1px solid #0a4e9b !important; border-top: 1px solid #14588a !important; background-color: #224975 !important;}'
	+
	'.conversionCont {border: 1px solid #27629B !important;}'
	+
	'.messageBox {background-color: #1e507b !important; border: 1px solid #1686da !important;}'
	+
	'.section, .invoice nav#subNav {background-color: #124169 !important;}'
	+
	'.invoice .pageHeader {border-bottom: 1px solid #116398 !important;}'
	+
	'#activity table thead tr th {border-bottom: 1px solid #235a89 !important;}'
	+
	'.form-control {background-color: #22354b !important; border: 1px solid #4077a5 !important; color: #bbd2e3 !important;}'
	+
	'.dropdownBlockLarge .dropDownButton, .dropdownSplitButtonLarge .dropDownButton {background-color: #195ea1 !important; border: 1px solid #1b70a7 !important;}'
	+
	'#basicFilterStatus .tabInActive {background-color: #1f3650 !important; border-color: #1A5690 !important;}'
	+
	'.eightballExperience #basicFilter * *, #advFilter1Value1 * *, #memoText * *, #invoicesummaries .dropdown-menu * *, .modal * *, #itemsummaries .dropdown-menu * *, #recipientEdit * *, #searchContactBook * *, #BusinessInform * *, .itemDescription * *, h3#businessInformation * * {color: #cde1ec !important;}'
	+
	'.invoice nav#subNav ul.tabnav li.main-menu.active > a {color: #D6EFFC !important;}'
	+
	'.invoice nav#subNav hr {border-top-color: #0D6EA4 !important;}'
	+
	'.modal-content {background-color: #164466 !important;}'
	+
	'.modal-header {border-bottom: 1px solid #38649e !important;}'
	+
	'.theme-background-color-white {background-color: #0c2a4b !important;}'
	+
	'.theme-background-color-light {background-color: #121e30 !important;}'
	+
	'.global-footer .footer-main a {color: #aac7d5 !important;}'
	+
	'.panelContent {border: 1px solid #255e84 !important;}'
	+
	'.settings .security li {border-bottom: 1px solid #205f8d;}'
	+
	'.vx_panel-header, .vx_panel-text, .vx_panel-action {color: #d1e5f0 !important;}'
	+
	'.settings .notifications .contact a {color: #63b3ff !important;}'
	+
	'.settings .letmeknow, .settings .statements {color: #309eef !important;}'
	+
	'.settings .notiRow:not(:last-child) {border-bottom: 1px solid #155c98 !important;}'
	+
	'.footer {background-color: #0E2835 !important;}'
	+
	'.theoverpanel .nameEdit .choiceBox {border-color: #17436f !important;}'
	+
	'#stdpage, #page {background-color: #10202F !important;}'
	+
	'#bheader {border-bottom: 1px solid #122F45 !important; text-shadow: 0 1px #194475 !important; box-shadow: 0 2px #123159 !important;}'
	+
	'#bfooter {text-shadow: 0 1px 1px #103f62 !important; border-top: 1px solid #102e4d !important;}'
	+
	'#page #content {background: #14344b !important;}'
	+
	'#bheader > .navbar-inner {background: none repeat scroll 0 0 #1E486C !important;}'
	+
	'#bheader .globalNav a, #bfooter .navbar-inner .inline li a {color: #d8ebf3 !important; text-shadow: 0 1px 1px #15364E !important;}'
	+
	'.backlink a {color: #6ba6e4 !important;}'
	+
	'.react-p2p_wrapper div div div {background: #152739 !important;}'
	+
	'.headerBox_dpbx39, .cardBack_13g6txt {background: #152739 !important;}'
	+
	'.wrapper {background-color: rgba(18, 38, 87, 0.5) !important;}'
	+
	'.transactionRow:nth-child(2n+1), .installmentRow:nth-child(2n+1), .transactionRow.year-title:nth-child(2n+1), .installmentRow.year-title:nth-child(2n+1) {border-left-color: #2255a1 !important; background-color: #162233 !important;}'
	+
	'.transactionDescription, .transactionAmount, .installmentSummary .creditPlanDescription, .installmentSummary .balance, .dateDay, .dateMonth, .transactionAmount .netAmount, .installmentSummary .balance .netAmount, .detailedTable thead th, .detailedTable-transactionColumn_date, .detailedTable-transactionItem_row td {color: #c3d9e4 !important;}'
	+
	'.transactionRow .transactionType, .installmentRow .transactionType, .transactionRow .installmentSummary .creditPlanType, .installmentRow .installmentSummary .creditPlanType {color: #1576bd !important;}'
	+
	'.transactionRow:nth-child(2n+1) .transactionAmount, .installmentRow:nth-child(2n+1) .transactionAmount, .transactionRow.year-title:nth-child(2n+1) .transactionAmount, .installmentRow.year-title:nth-child(2n+1) .transactionAmount, .transactionRow:nth-child(2n+1) .installmentSummary .balance, .installmentRow:nth-child(2n+1) .installmentSummary .balance, .transactionRow.year-title:nth-child(2n+1) .installmentSummary .balance, .installmentRow.year-title:nth-child(2n+1) .installmentSummary .balance {background-color: rgba(0,0,0,0) !important;}'
	+
	'.transactionRowHover:hover .transactionDetailsContainer .transactionAmount::before, .installmentRow:hover:not(.isInactive) .transactionDetailsContainer .transactionAmount::before, .transactionRowHover:hover .installmentSummary .balance::before, .installmentRow:hover:not(.isInactive) .installmentSummary .balance::before {background-image: -moz-linear-gradient(left, rgba(17, 84, 126, 0), #1a55a1) !important;}'
	+
	'.transactionRowHover:hover .transactionDetailsContainer .transactionAmount, .installmentRow:hover:not(.isInactive) .transactionDetailsContainer .transactionAmount, .transactionRowHover:hover .installmentSummary .balance, .installmentRow:hover:not(.isInactive) .installmentSummary .balance {background-color: #1a55a1 !important;}'
	+
	'.detailedTable-transactionColumn_date.detailedTable-transactionColumn_date {background: #122635 !important;}'
	+
	'.transactionRowHover:hover, .installmentRow:hover:not(.isInactive) {background-color: #0e3d72 !important;}'
	+
	'.detailedTable thead th {border-top: 1px solid #0b447d !important;}'
);