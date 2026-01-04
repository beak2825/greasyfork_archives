//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/13/17
// Date of resolution: 09/13/17
//
// ==UserScript==
// @name        ShadeRoot Bing
// @namespace   SRBI
// @description Eye-friendly magic in your browser for Bing
// @version     1.0.0a
// @icon        https://i.imgur.com/D7y0iqg.png

// @include        http://*.bing.*
// @include        https://*.bing.*
// @downloadURL https://update.greasyfork.org/scripts/33586/ShadeRoot%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/33586/ShadeRoot%20Bing.meta.js
// ==/UserScript==

function ShadeRootBI(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootBI(
	// BG 1
	'html, body, #hp_table, #hp_cellCenter, #hp_vidwrp, #HBContent, .row, .me_sectioncontent, #intrbar_wrapper, #mmvdp, .mm_vdcv_cnt, a#bep.openfo, #bepfo, #id_d, #id_scfo, .header, .dg_b, .sug, #insights, .msmc, .newscontainer, .indicatorText, .cardcommon, .rtNews, #imgDiv, .snapshot, #b_content, #ftrB, .body {background-color: #151618 !important;}'
	+
	'.navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus, .dropdown-toggle {background: #1f2124 !important;}'
	+
	// BG 2
	'#sb_foot, .iuscp, .infnmpt, .modal, .sa_as, .ContentContainer, .container, .navbar-default, .navbar-inverse .navbar-collapse, .navbar-inverse .navbar-form, #rfPane, .touchQuery .carousel .carousel-controls, .touchQuery .carousel .items, .touchQuery .carousel .item, .touchQuery .carousel .carousel-controls .nav_left, .touchQuery .carousel .carousel-controls .nav_right, .carousel, .b_entityTP, .mssn, .cbar, .news, .rtp, .rNewsRtTag, #contentDiv, .backgroundImgDiv, .dirTimePopup, .fc_cal_days {background-color: #1f2124 !important;}'
	+
	'#hp_vidwrp {opacity: 0.2;}'
	+
	// LINK TEXT
	'a, .toggle_item, .b_promoteText, .l_header_portion, .sa_hd, #railContent h1, .nameContainer, .calendarTitle, .text {color: #b2bfcb !important;}'
	+
	'body, .infpd, .b_promoteText, #b_tween a.ftrH, #b_tween a.ftrH:hover, .b_expando, .b_expando h2, .b_expando h3, .b_expando h4, .b_expando .b_defaultText, .b_active a, .b_active a:visited, .b_active a:hover, #b_results > .b_pag a, #b_results .b_no, #b_content a.cbl:visited, #b_content a.cbl, .modal, a#bep.openfo, #bepfo, #id_d, #id_scfo, #fbpgdg, label, span {color: #c2d2da !important;}'
	+
	'img, .backgroundImgDiv {opacity: .85; filter: brightness(.92) !important;}'
	+
	// LINK HOVER TEXT
	'a:hover, strong, .carousel h2, .card .tit, .categoriesBarHeader {color: #5d8dba !important;}'
	+
	'.b_searchbox, input, textarea, select, option, code, pre, .b_searchboxForm {background-color: #4c5c72 !important; color: #C6D3E1 !important;}'
	+
	'.sa_as .sa_sg .sa_tm, .sa_as .b_tHeader, .sa_as .b_demoteText, .sa_as .b_secondaryText, .sa_as .b_attribution, .sa_as .b_factrow, .sa_as #sa_ul .b_focusLabel, .sa_as .b_footnote, .sa_as .b_ad .b_adlabel, .sa_as .b_expando .b_subModule, .sa_as .b_expando .b_suppModule, .sa_as .b_algo .b_vList td, .sa_as .b_expando .b_secondaryText, .sa_as .b_expando .b_attribution, .sa_as .b_expando .b_factrow, .sa_as .b_expando .b_footnote, .sa_as .ctxtb, .sa_as .sa_rmvd, .fdnReason, .sginTxt {color: #cddbe1;}'
	+
	'.b_searchboxForm, .menu, .b_topborder {border: 1px solid #48586e !important;}'
	+
	'#sw_as #sa_ul li, #sw_as .nowrap, .menu, #trd_module, .trd_content {background: #313d4a !important;}'
	+
	// TEXT 1
	'.hbic_col, .hb_title_col, .hb_value_col, .me_subsection h3, .me_subsection_l label, .me-modal .title, body, h1, h2, h3, h4, h5, h6, label, ,.b_dataList li, .infnmpt, .infpd, .b_demoteText, #intrtitle, .fdnReason, .b_scopebar, .b_scopebar a, .b_scopebar a:visited, .id_button, .id_button:visited, .hbic_col, .hb_title_col, .hb_value_col, .news h2 {color: #c9d4e1 !important;}'
	+
	// TEXT 2
	'#railContent h2, .description, .richdescription, .snippet {color: #5290cc !important;}'
	+
	// BG 3
	'.sa_hv, #detail_meta {background: #495666;}'
	+
	'#sa_5004:hover, .sa_hv:hover {background: #4a5c6c !important;}'
	+
	'#sw_as .sa_as, #sw_as li.pp_tile {border-color: #48678a !important;}'
	+
	'#hp_container #sw_as ul#sa_ul div.sa_tm, #hp_container #sw_as #sa_ul .sa_hd, .originalNameContainer {color: #C0CCDD !important;}'
	+
	'#sw_as .sa_as .sa_drw, #sw_as .sa_as li.pp_tile, #sw_as .sa_as .sa_tm strong, #sw_as .sa_as table {color: #5e93c0 !important;}'
	+
	'#sb_form_go {background-color: #007daa !important;}'
	+
	'#HBContent, .me_content .ctxt, .me_content select {border: 1px solid #1e5b7d !important;}'
	+
	'.hb_section:active, .hb_section:hover, .hb_section:visited {background-color: #2d404b !important;}'
	+
	'#me_header, .b_footer, #b_header, #landing_tabs {background-color: #23272a !important;}'
	+
	'.me_subsection, .dirOptsPopup > div, .ppcscb {border-bottom: 1px solid #224d78 !important;}'
	+
	'.me_sidenav a, .me_sidenav a:visited, .float_button_bar {background-color: #30414a !important;}'
	+
	'.btn {border: 1px solid #1d4153 !important; background-color: #192936 !important;}'
	+
	'.float_button_bar {border-top: 2px solid #173553 !important;}'
	+
	'.me-modal {background-color: #22292d !important;}'
	+
	'.sc_active > a {border-bottom: 1px solid #2ba1d8 !important;}'
	+
	'#hdr_spl, .sw_mktsw span, .wpc_module h2, .wpc_module .sb_h3, .wpc_module .cbl {color: #2ba1d8 !important;}'
	+
	'.hb_section:focus {background-color: #1c68a1 !important;}'
	+
	'#landing_tabs, .item {border-top: 1px solid #0e3d60 !important;}'
	+
	'#imgCredText {opacity: .7 !important;}'
	+
	'.varh {border-color: #0c5184 !important;}'
	+
	'.img_cont {border-bottom: 1px solid black;}'
	+
	'.intrgrp {border-left: 1px solid #1d7198 !important;}'
	+
	'.grpitm, .grpsm {background: #334857 !important;}'
	+
	'#intrschpane {border: 1px solid #267392 !important;}'
	+
	'.sel {background: #257ab7 !important;}'
	+
	'#fbpgbt, .newspubhub, .ftrD_MmVert {background: #192329 !important; border: 1px solid #1c5b8a !important;}'
	+
	'#fdnContainer:hover {background: #1f2429 !important;}'
	+
	'.popfeeds, .sgin, .routecategoriesbar {border-top: 1px solid #1e2d3c !important;}'
	+
	'.popfeed a:hover {background: #1b323e !important;}'
	+
	'.sginLnk {background: #366f93 !important; border: 1px solid #236e9e !important; color: #C5D5E1 !important;}'
	+
	'.sginLnk:hover {background: #111c23 !important; border: 1px solid black !important;}'
	+
	'.hbic_col, .hb_title_col, .hb_value_col, .sa_tm, .section-title, .subtitle, .item.small {color: #d1e5ed !important;}'
	+
	'header#b_header {background: #373d44 !important; border-bottom: 1px solid #2d6499 !important;}'
	+
	'.item.learn-explore {border: 1px solid #264b63 !important;}'
	+
	'.icon {background-color: #63caec !important; border-radius: 1.5em !important; padding: .2em !important;}'
	+
	'.img-container, .item img {border: 2px solid #314551 !important; box-shadow: 2px 2px 15px #133247 !important;}'
	+
	'.mc_vtvc {background-color: #0c2736 !important;}'
	+
	'.mm_vdcv_label {border-bottom: 1px solid #0e375a !important;}'
	+
	'.ol_rsi:hover img, .ol_rsi:focus img {border: 1px solid #2a79a4 !important;}'
	+
	'#id_d a:hover {background-color: #215069 !important; color: #BACEDA !important;}'
	+
	'.b_idOpen a#id_l, a#id_rh.openfo {background-color: #164669 !important;}'
	+
	'#fbpgdg textarea {border: 1px solid #1d5671 !important;}'
	+
	'#fbpgdgcnclbt {background: #313942 !important;}'
	+
	'#fbpgdg .button {background-color: #265e87 !important; border: 1px solid #1f599b !important;}'
	+
	'.footer {background-color: #182833 !important;}'
	+
	'#apex_search {background-color: #505a5f !important; border: 1px solid #1374a1 !important;}'
	+
	'.list-group-item {padding: 0 0 1em 1em !important;}'
	+
	'.tilebox {background: #1b2d3b !important;}'
	+
	'.container:first-child {border-bottom: 1px solid #21597d !important;}'
	+
	'.dropdown-menu {background-color: #0d3247 !important; border: 2px solid #165d99 !important;}'
	+
	'.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {background-color: #121a21 !important;}'
	+
	'.dropdown-menu > .active > a, #miniheader table, #miniheader_switch:hover, #miniheader_switch.touch {background-color: #091e2d !important;}'
	+
	'#sb_form_go {background-color: #007DAA !important; border-color: #007DAA !important;}'
	+
	'.sug, .module_wrapper {border-left: 1px solid #2374b9 !important;}'
	+
	'#sb_form_q {border-right: 1px solid #2374b9 !important;}'
	+
	'#detail_meta::before {background-color: #1d485c !important;}'
	+
	'#actionbar, #switcher, #rf_bar {background-color: #174b77 !important;}'
	+
	'.relatedGroup {background: #091E2D !important;}'
	+
	'.item .card {background-color: #144977 !important; outline: 1px solid #0d202f !important;}'
	+
	'.inline_tile .carousel {margin: -10px !important; padding-left: 1em !important;}'
	+
	'.ftrHh, .ftrHh:hover, .ftrVS, .ftrHSe {background: #0a2647 !important;}'
	+
	'.carouselChevRightSvg {opacity: .5;}'
	+
	'#inline_qp .nav_left, #inline_qp .nav_right {background: #092454 !important;}'
	+
	'.background-White, .background-FFFFFF, .background-LightGray {background-color: #132b3c !important;}'
	+
	'#b_results > li {background-color: #0f1315 !important;}'
	+
	'.b_pag a:hover {background-color: #18476f !important;}'
	+
	'.sb_pagS {border-color: #0d4f87 !important;}'
	+
	'.va_title_mmftb::after, .vr_pubinfo_mmftb::after, .cap_exp::before {display: none !important;}'
	+
	'.cap_exp > svg {background-color: #2a7cc2 !important;}'
	+
	'.caption_line {fill: #e1d4d4 !important;}'
	+
	'.b_caption p, .ms_ev_texts {color: #9FA5AB !important;}'
	+
	'.dg_u {background: #0c1c29 !important; border: 1px solid #183c6b !important;}'
	+
	'.vr_pubinfo_mmftb, #b_context .b_entityTitle, #b_results .b_entityTitle, .b_ans h2, .b_algo h2, .b_top, .b_top .b_promoteText {color: #BEC4C9 !important;}'
	+
	'#b_content .cbtn, .cbtn input {background: #0d2c3f !important; border-color: #214c7d !important;}'
	+
	'.b_entityTP {border: 1px solid #0d3154 !important;}'
	+
	'#b_content .cbtn:hover, .cbtn input:hover, #b_content .cbtn:focus, #b_content .cbtn:active, .cbtn input:focus, .cbtn input:active {border-color: #1565aa !important;}'
	+
	'#b_context .b_subModule, #b_results .b_subModule {border-bottom: 1px solid #1b436b !important;}'
	+
	'.dynMap {opacity: .9 !important; filter: brightness(.9) !important;}'
	+
	'.b_poleContent {border-bottom: 1px solid #1c405f !important; border-top: 1px solid #1c405f !important;}'
	+
	'.nav_container .carouselChevLeftSvg, .nav_container .carouselChevRightSvg {background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NiA1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTYgNTYiPg0KCTxjaXJjbGUgZmlsbD0iIzQ0NCIgY3g9IjI4IiBjeT0iMjgiIHI9IjI4Ii8+DQoJPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMwLjI5MyAxOC4yOTNsLTkgOWMtLjM5MS4zOTEtLjM5MSAxLjAyNCAwIDEuNDE0bDkgOWMuMzkxLjM5MSAxLjAyNC4zOTEgMS40MTQgMCAuMzkxLS4zOTEuMzkxLTEuMDI0IDAtMS40MTRsLTguMjkzLTguMjkzIDguMjkzLTguMjkzYy4zOTEtLjM5MS4zOTEtMS4wMjQgMC0xLjQxNC0uMzktLjM5MS0xLjAyNC0uMzkxLTEuNDE0IDB6Ii8+DQo8L3N2Zz4=)}'
	+
	'.carousel .lightcar .item .card:hover, .carousel .lightcar .item .card-hover, .carousel .lightcar .item.sel .card:hover, .carousel .lightcar .item.sel .card-hover {background: #0f3556 !important;}'
	+
	'#b_context, #b_context #wpc_eif {color: #4e8cd1 !important;}'
	+
	'.mssn {border-right: 1px solid #124469 !important;}'
	+
	'.msc_vc {border: 1px solid #14528f !important;}'
	+
	'.msc_vc_crd, .msc_vc_crd:visited {background-color: #172d44 !important;}'
	+
	'.fcst, .cardTitle, .moduleTitle, .tableCell, .lcatetext .catetexto, .rcatetext .catetexto {color: #c3dce1 !important;}'
	+
	'img {background-color: #288DCE !important;}'
	+
	'.MicrosoftMap .taskBar {background: rgba(27, 70, 98, 0.85) !important;}'
	+
	'.taskBar .searchbox {background-color: #4C5C72 !important; border: 1px solid #0968ae !important;}'
	+
	'.MicrosoftMap .taskBar .action a:hover, .MicrosoftMap .taskBar .action a:active, .MicrosoftMap .taskBar a.shareIcon.pressed, .MicrosoftMap .taskBar a.trafficIcon.selected, .MicrosoftMap .taskBar a.moreIcon.selected, .MicrosoftMap .taskBar a.fullScreenIcon.selected {background-color: #1d435c !important;}'
	+
	'.MicrosoftMap .cardFace {background: #133345 !important;}'
	+
	'.listings-item {border-top: 4px solid #0e3c56 !important;}'
	+
	'.listings-item {border-bottom: 4px solid #3b4e5c !important;}'
	+
	'.MicrosoftMap .NavBar_Container.Light .slot.selected, .MicrosoftMap .NavBar_Container.Light .slot:hover, .MicrosoftMap .NavBar_Container.Light .slot.selected:hover {background: linear-gradient(#1c6796,#204b83),linear-gradient(#465565,#2a3a42) !important;}'
	+
	'.MicrosoftMap .NavBar_Container.Light .slot, .MicrosoftMap .NavBar_Container.Light .switchSlot {background: linear-gradient(#525a63,#324250),linear-gradient(#222e36,#20282d) !important; color: #d4dee7 !important;}'
	+
	'.b_vPanel div, .b_vPanel > div:first-child div, .NavBar_MapTypeButtonText {color: #69a2c6 !important;}'
	+
	'.listings-item.hover, .listings-item:hover, .listings-item:focus {background-color: #13222d !important;}'
	+
	'.cardMenuPopOut {border: solid 2px #21659f !important; background-color: #1d3c50 !important;}'
	+
	'.dropdownEntry:hover {background-color: #1a2935 !important;}'
	+
	'.MicrosoftMap .cardTitleText .title {background: #2975b6 !important;}'
	+
	'.temporaryCollectionCard .signInBlock, .collectionsCard.refresh .signInBlock {background-color: #1b3d56 !important;}'
	+
	'.MicrosoftMap .signInButton, .previewButton, .PrintContainer {border-color: #1775d1 !important; background: #135777 !important;}'
	+
	'.tab-menu li {background-color: #425972 !important; color: #c3d3e3 !important;}'
	+
	'.MicrosoftMap .signInMessage, .MicrosoftMap .saveMessage, .MicrosoftMap .seeItLink, .MicrosoftMap .annotateContainer {color: #56a2ed !important;}'
	+
	'.dirMessage {border-top: 1px solid #1f54a2 !important; background-color: #1d2833 !important; color: #C8D7E1 !important;}'
	+
	'.drPanelDimmed, .dirOptsPopup {background-color: #1f2f42 !important;}'
	+
	'.searchboxWithAS, .as_container_directions {background-color: #191d21 !important; border-top: 1px solid #295692 !important;}'
	+
	'.moduleBorder {border: #062236 solid 2px !important;}'
	+
	'.MicrosoftMap {background-color: #131f2d !important; opacity: .85 !important; filter: brightness(.95) !important;}'
	+
	'.Light .cardTitleText .title h2, .cardTitle, .bm_modalDialog > div > div {color: #c9d8e0 !important;}'
	+
	'.printDialog {border: 8px solid #135289 !important; background: #132938 !important;}'
	+
	'.printDlgHdr {color: #cdd8e4 !important; background-color: #0e2536 !important;}'
	+
	'.cardTitle {background-color: #CB7412 !important;}'
	+
	'.MicrosoftMap .printMapAndText.selected, .MicrosoftMap .printMapOnly.selected, .MicrosoftMap .printTextOnly.selected {color: #102844 !important;}'
	+
	'.mapActionsModule, .nf {background-color: #41586c !important;}'
	+
	'.trd_btnbar {background: #63CAEC !important;}'
	+
	'.overlay-taskpane .wpc_module, .overlay-taskpane .mapsCustomInfoCard {border-bottom: 4px solid #0b1d2a !important;}'
	+
	'.b_smText, .news h2, .sechd h2 {color: #3494F3 !important;}'
	+
	'.newsitem {background-color: #10202c !important;}'
	+
	'.trd_card:hover, .trd_card.selected {background-color: #10354a !important;}'
	+
	'.trk a {background-color: #162e45 !important; border: 1px solid #295f87 !important;}'
	+
	'.cbar .ap a, .ppcscb, .lcatearrow, .rcatearrow, .lcatetext .catetexto, .rcatetext .catetexto {background: #1e3856 !important;}'
	+
	'.cbar > li:hover > a {background: #162e3e !important;}'
	+
	'.subcat {background: #223d5c !important; border: 1px solid #175583 !important;}'
	+
	'.subcat > li:hover {background: #0b4d78 !important;}'
	+
	'.pcscb .ap, .traffic.light {color: #3eb4ec !important;}'
	+
	'.menu ul li:hover .l1 {background: #133d62 !important;}'
	+
	'.topText {color: #4C626F !important;}'
	+
	'.b_entityTP {padding: 1em;}'
	+
	'.annotateDropdown {background: #334757 !important; border: 1px solid #226095;}'
	+
	'.popOutTop {border: solid 1px #1c5c9b !important; background-color: #18425d !important;}'
	+
	'.overlay-taskpane {color: #d0e0e7 !important;}'
	+
	'.MicrosoftMap .annotatePopOut .nameEditBox, .MicrosoftMap .annotatePopOut .descriptionEditBox {border-color: #34719e !important;}'
	+
	'.expandArrow, .b_vList > li {color: #CDD6DE !important;}'
	+
	'.suggestLink:hover {background-color: #191d24 !important;}'
	+
	'.dirWp input {border: 1px solid #295f8d !important;}'
	+
	'.spinBox .cell {background-color: #1b6ea4 !important; color: #d7e2e9 !important;}'
	+
	'.MicrosoftMap .radioGroup > div > a:first-child, .MicrosoftMap .radioGroup > div > a.selected + a {border-left-color: #171e26 !important;}'
	+
	'.spinBox + .spinBox {border-left: 2px solid #184266 !important;}'
	+
	'.radioGroup > div > a, .fc_cal_monthChange:hover {background-color: #1b2b33 !important;}'
	+
	'.radioGroup > div > a.selected {background-color: #0081ff !important;}'
	+
	'.single_cal_holder {background-color: #0e1b2d !important;}'
	+
	'.MicrosoftMap .cardContent .dirInstructions .bm_dirInstructionRowGroup:hover, .MicrosoftMap .dirInstructions .bm_dirInstructionRowGroup.hover {background-color: #1e5680 !important;}'
	+
	'.dirInstruction, .bm_dirLeftSpace, .MicrosoftMap .drTitle a, .MicrosoftMap .drTitle a:visited, .MicrosoftMap .drTitle a table, .MicrosoftMap .drTitle a:visited table {color: #D6DDE4 !important;}'
	+
	'.drTitle.selected, .MicrosoftMap .cardContent .drTitle.selected a:hover, .MicrosoftMap .cardContent .drTitle.selected a:hover table {background-color: #164b72 !important;}'
	+
	'.MicrosoftMap .drDuration.selected, .MicrosoftMap .cardContent .drTitle.selected a:hover .drDuration, .MicrosoftMap .drDuration.selected table, .MicrosoftMap .cardContent .drTitle.selected a:hover .drDuration table {background-color: #132d3f !important;}'
	+
	'.drTitleRow td.drDuration {border-color: #1c669c !important;}'
	+
	'.selected .drTitleRow > td {border-color: #15639e !important;}'
	+
	'.mapActionsModule li a:hover {background-color: #1f4162 !important;}'
	+
	'.categoriesBar .category a:hover {background-color: #0f202f !important;}'
	+
	'.radioGroup > div > a.selected {border-left-color: #194a7a !important;}'
	+
	'.single_cal_holder tbody a:hover {background-color: #154569 !important; color: #a7d0de !important;}'
	+
	'.spinBox .column {background-color: #0f2736 !important; border: 1px solid #0f3c5d !important;}'
	+
	'.spinBox ul li, h1.me_title, h2.me_title, h1, h2, .me_subsection h3, .me_subsection_l label, .me-modal .title {color: #BACDDA !important;}'
	+
	'.information_tile, .hv-query {background-color: #106299 !important;}'
	+
	'.hv-settings-clear-button {background-color: #1c4d7e !important; border: 1px solid #326fb3 !important;}'
	+
	'.toggle-dropdown:hover, .toggle-dropdown:active, .toggle-dropdown:focus {background: #1f3f5f !important;}'
	+
	'.expando {border-top: 1px solid #1b4f75 !important;}'
	+
	'.expando-list {border-bottom: 1px solid #1b4f75 !important;}'
	+
	'.table_head_cell {background-color: #123c57 !important; border-top: 1px solid #1b5a99 !important; border-bottom: 1px solid #1c568f !important;}'
	+
	'.table_cell {border-bottom: solid 1px #16507b !important;}'
	+
	'.MORE_INFO_ICON_NOTE {background-color: #0c2745 !important;}'
	+
	'.ent.inlinecap {border: 4px solid #0e4a77 !important;}'
	+
	'#intrschpane_lst {background: #103045 !important; border: 1px solid #18519b !important;}'
	+
	'.newswc, .ftrD > div.b_vPanel {border-top: 1px solid #164c74 !important; background: #12293c !important;}'
	+
	'.localitem, .dictline {border-top: 1px solid #174465 !important;}'
	+
	'.menu ul li ul {border: 1px solid #14578f !important; background-color: #203c4e !important;}'
	+
	'.menu ul li ul li:hover a {background: #122436 !important;}'
	+
	'.nf .fs {background: #152c45 !important;}'
	+
	'.btm_sml a {background: #122738 !important;}'
	+
	'#b_results > .b_top .b_prominentFocusLabel, #b_results > .b_top .b_topTitle, #b_results > .b_top .b_focusTextExtraSmall, #b_results > .b_top .b_focusTextExtraSmall a, #b_results > .b_top .b_focusTextSmall, #b_results > .b_top .b_focusTextSmall a, #b_results > .b_top .b_focusTextMedium, #b_results > .b_top .b_focusTextMedium a, #b_results > .b_top .b_focusTextLarge, #b_results > .b_top .b_focusTextLarge a, .ctxt {color: #3281da !important;}'
	+
	'.dc_mn, .dc_st {color: #6697c0 !important;}'
	+
	'div.b_dropdown .b_selected, #b_tween a.ftrH.b_selected:hover {background: #0f2f4a !important; border-bottom-color: #0b3656 !important;}'
	+
	'#b_tween a.ftrH.b_selected {border-color: #0f4471 !important;}'
	+
	'.b_tHeader, .b_demoteText, .b_secondaryText, .b_attribution, .b_factrow, .b_focusLabel, .b_footnote, .b_ad .b_adlabel, #b_tween .b_dropdown a, .b_expando .b_subModule, .b_expando .b_suppModule, .b_algo .b_vList td, #b_content .b_lowFocusLink a, #b_context .b_secondaryText, #b_context .b_attribution, #b_context .b_factrow, #b_context .b_footnote, #b_context .b_ad .b_adlabel, .b_expando .b_secondaryText, .b_expando .b_attribution, .b_expando .b_factrow, .b_expando .b_footnote {background: #0F1315 !important;}'
	+
	'.b_dropdown {background-color: #173a60 !important; border-color: #1e558c !important;}'
	+
	'.ftrD > div.b_vPanel {border-top: 1px solid #27578d !important;}'
	+
	'.ccal {border: 1px solid #196cb3 !important;}'
	+
	'#CustomRangeFilter .ctxt, .collection__title {color: #BBCDDE !important;}'
	+
	'.b_selected:hover, #h5087, .ftrH {background-image: linear-gradient(to bottom, rgba(28,28,28,1) 0%,rgba(19,19,19,1) 100%) !important; opacity: .8;}'
	+
	'.rb_bar {border-left: 1px solid #38587b !important;}'
	+
	'.mc_vrvc_meta {background: #13222f !important;}'
	+
	'.mc_vrvc {border-bottom: 1px solid #0c385d !important;}'
	+
	'.recGroupMore {background: #0c121b !important; border: 1px solid #134b74 !important;}'
	+
	'.vlp_rb1, .vlp_rb2, .vlp_rb3, .vlp_rb4, .vlp_rb5, .vlp_cin, .ftrH_MmVert:hover, .ftrH_MmVert:focus {background: #142538 !important;}'
	+
	'.vlp_rt, .vlp_cit, .vlp_cin, #ms_ba {color: #5da8e9 !important;}'
	+
	'.vlp_r {background-color: #164b8f !important;}'
	+
	'.vlp_ci {border: 1px solid #1f557d !important;}'
	+
	'#fav_ss_banner {background-color: #0e283b !important;}'
	+
	'.fav_ss_continue {border: 1px #19529e solid !important; background-color: #223242 !important; color: #c8d0de !important;}'
	+
	'.ssHL {background: #1a5098 !important;}'
	+
	'.ssH:hover {background: #1f67b9 !important;}'
	+
	'.ssSSL {background: #1c4268 !important;}'
	+
	'.menu__items {border: 1px solid #1360a1 !important; background-color: #14364e !important;}'
	+
	'.menu-item_type_separator, .fav_grp_c {border-top: 1px solid #15599b !important;}'
	+
	'.menu-item_type_action:hover {background-color: #0e4772 !important;}'
	+
	'#ms_ba {border: 1px solid #274f83 !important; background-color: #152d39 !important;}'
	+
	'#favWndPanel, .fav_gr_it {background: #25282c !important;}'
	+
	'.removeGrpBtn, .createNewGrpBtn {color: #b5c3db !important; border: 1px solid #1870b1 !important; background: #2b4563 !important;}'
	+
	'.as_container_search {background-color: #132e45 !important;}'
	+
	'.asOuterContainer {border-color: #164e78 !important;}'
	+
	'.calendarSyncLabel, .bm_popOutContainer {background-color: #597387 !important;}'
	+
	'.overlay-taskpane ul.searchNearbyModuleIcon.searchNearbyWithLabels li:hover {background-color: #0d2636 !important;}'
	+
	'.transientLensActions {background-color: #0c273e !important; border: solid 1px #0e5c9f !important;}'
	+
	'.transientLensSeparator {background-color: #0d60b1 !important;}'
	+
	'.transientLensActions a:hover {background-color: #136599 !important; color: #E0EDF6 !important;}'
	+
	'.secTextLink {color: #5196e4 !important;}'
	+
	'.geochainContainer {background: #112332 !important;}'
	+
	'.geochainCollapse {border-right: 1px solid #3690d2 !important; background-color: #0E3A65 !important;}'
	+
	'.sa_hv, #detail_meta, .cap_src > a {background: #121b21 !important;}'
	+
	'#detail_viewPage, #att_vi, .expItem {border: 1px solid #0e4c80 !important;}'
	+
	'#detail_viewPage:hover, #att_vi:hover, #isb, #switcher::before {background-color: #133157 !important;}'
	+
	'.exp_block {background: linear-gradient(transparent,#13171a) !important;}'
	+
	'.info, .expandButton, .expItem:hover {background-color: #1a304a !important; border: solid 1px #16528d !important;}'
	+
	'.iol_fsst {border-bottom: 2px solid #176cb4 !important;}'
	+
	'.iol_fst:hover {border-bottom: 2px solid #1f487e !important;}'
	+
	'.expItem .isctit, .expItem .iscbody {color: #5687ab !important;}'
);