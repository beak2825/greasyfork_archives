// ==UserScript==
// @name         Dark Aerfaying
// @namespace    https://github.com/Tim-Fang
// @version      2.7
// @description  Dark Aerfaying Theme User JS
// @author       TimFang4162
// @match        *://*.aerfaying.com/*
// @match        *://*.gitblock.cn/*
// @match        *://*.3eworld.cn/*
// @match        *://*.ccw.site/*
// @match        *://*.codingclip.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      GPLv3
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445337/Dark%20Aerfaying.user.js
// @updateURL https://update.greasyfork.org/scripts/445337/Dark%20Aerfaying.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`/*
define colors
--bgc1: background color 1
--bgc1a: background color 1 with alpha
--bgc2: background color 2
--bgc2a: background color 2 with alpha
--textc: text color
--bgf: backdrop filter
*/
:root {
  --bgc1: #06090f;
  --bgc1a: #06090fdd;
  --bgc2: #0d1117;
  --bgc2a: #0d1117dd;
  --textc: #eeeeee;
  --bgf: blur(20px);
}
html {
  background-color: var(--bgc1) !important;
}
.menu-bar_topnav_3HgyJ {
  color: #fff !important;
  background-color: var(--bgc1a) !important;
  -webkit-box-shadow: 0 2px 5px rgba(6, 9, 15, 0.5) !important;
  box-shadow: 0 2px 5px rgba(6, 9, 15, 0.5) !important;
  backdrop-filter: var(--bgf) saturate(2);
}
body {
  background-color: var(--bgc1) !important;
  color: var(--textc) !important;
}
.home_bgColor_Ffb4T {
  background-image: none !important;
}
h1 {
  color: #fff !important;
}
h2 {
  color: #fff !important;
}
h3 {
  color: #fff !important;
}
h4 {
  color: #fff !important;
}
h5 {
  color: #fff !important;
}
h6 {
  color: #fff !important;
}
.card_wrapper_2Sod3 {
  background: var(--bgc2) !important;
}
.project-card_body_3eTGL .project-card_title_2eD4- {
  color: #fff !important;
}
.project-card_footer_284gK {
  border-top: 1px solid #222 !important;
}
.project-card_owner_2Cok9 span:first-child {
  background: none !important;
}
.project-card_owner_2Cok9 img {
  background: none !important;
  border-color: var(--bgc2) !important;
}
.card_wrapper_2Sod3 .title {
  color: var(--textc) !important;
}
.card_wrapper_2Sod3.card_vertical_1XmvA > a > img,
.card_wrapper_2Sod3.card_vertical_1XmvA > img {
  border-bottom: none !important;
}
.thumb-img_thumb-border_14aaQ {
  border: none !important;
}
.home_userCard_2HTEf {
  background: var(--bgc2) !important;
}
.user-card-large_card_2wUOq a {
  color: var(--textc) !important;
}
.footer-bar_wrapper_10YKs {
  display: none !important;
}
.panel2_panel_1hPqt {
  background-color: var(--bgc2) !important;
}
.profile-head_wrapper_gzLFY {
  background-color: var(--bgc2) !important;
}
.profile-head_name_3PNBk {
  color: #fff !important;
}
.attached-items-bar_ItemIcon_2d2qJ {
  background-color: var(--bgc1) !important;
}
.profile-head_bitStones_1GFkj,
.profile-head_goldCoins_TxdJM > span {
  color: var(--textc) !important;
}
.panel2_wrapper_3UZFE .panel2_panelHead_1Bn6y h2 {
  color: #fff !important;
}
.project-view_box_1Gq_t {
  background-color: var(--bgc2) !important;
}
.editable-text_body_2Qad2 .title {
  color: #fff !important;
}
.home_wrapper_2gKE7 {
  margin-top: calc(80px - 4rem) !important;
}
.home_bgUndefpainting_1oUZ1 > div:nth-child(2) > div:nth-child(1) {
  background-image: none !important;
}
.menu-bar_dropdown_1Nb_k {
  background: var(--bgc1) !important;
}
.menu-bar_dropdown_1Nb_k {
  box-shadow: none !important;
}
.menu-bar_dropdown_1Nb_k .arrow {
  border-bottom-color: var(--bgc1) !important;
}
.menu-bar_main-nav_97WYO > li:nth-child(3) {
  display: none !important;
}
.menu-bar_main-nav_97WYO > li:nth-child(4) {
  display: none !important;
}
ul.user-dropdown-menu_wrapper_3RsXx li a > span {
  border-left: none !important;
  border-right: none !important;
  font-family: Segoe-UI !important;
  font-size: 14px !important;
}
.comment_name_2ZnFZ {
  color: var(--textc) !important;
}
.forum-post-view_wrapper_s5oGn {
  background: var(--bgc2) !important;
}
pre {
  color: var(--textc);
  background-color: #1e2227 !important;
  border: none !important;
}
.markdown_body_1wo0f table td,
.markdown_body_1wo0f table th {
  border: 1px solid #25272d !important;
}
.editable-text_body_2Qad2 .edit-btn {
  background: none !important;
}
.editable-tag-group-submission_add-tags_1M7eK > span,
.editable-tag-group-submission_tipsTags_fO36j > span,
.editable-tag-group-submission_wrapper_90m_g > span {
  border: 1px solid #aaa !important;
  background: none !important;
}
code {
  background-color: #f9f2f411 !important;
}
.forum-post-view_event_Mnv4G i {
  color: var(--textc) !important;
  background-color: var(--bgc2) !important;
  border: 2px solid #1e2227 !important;
}
.forum-post-view_event_Mnv4G::before {
  background-color: #1e2227 !important;
}
.comment_mask_3MCUB {
  background: linear-gradient(hsla(0, 0%, 100%, 0), var(--bgc2)) !important;
}
.comment-list_comment-list_3QYD4 > li {
  border-top: 1px solid #1e2227 !important;
}
.form-control {
  background-color: var(--bgc2) !important;
  border: 1px solid #1e2227 !important;
  color: var(--textc) !important;
}
.btn-submit:hover,
.btn-submit:focus,
.btn-submit:active {
  border: 1px solid #1e2227 !important;
  background-color: #1e222744 !important;
}
.btn-submit {
  background: #1e222722 !important;
  border: 1px solid #1e2227 !important;
}
.btn-default {
  background-color: #1e222722 !important;
  border: 1px solid #1e2227 !important;
  color: #fff !important;
}
.btn-default:hover,
.btn-default:focus,
.btn-default:active {
  background-color: #1e222744 !important;
}
.btn-default.active,
.btn-default.focus,
.btn-default:active,
.btn-default:focus,
.btn-default:hover,
.open > .dropdown-toggle.btn-default {
  color: #fff !important;
  border-color: 1px solid #1e2227 !important;
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background: #1d2026 !important;
  transition: ease-in 0.2s background;
}
.btn-primary {
  background: var(--bgc2) !important;
  border: 1px solid #4c97ff11 !important;
}
.forum-post-view_eventLog_1UwJy {
  border-bottom: 1px solid #1e2227 !important;
}
.forum-post-view_postContent_309bd {
  border-bottom: 1px solid #1e2227 !important;
}
.forum-post-view_infoBar_k3IEq {
  border-bottom: 1px solid #1e2227 !important;
}
hr {
  border-top: 1px solid #1e2227 !important;
}
.editable-text_body_2Qad2 .content.eitable:hover {
  border: 1px dashed #555 !important;
}
.form-control {
  color: #fff;
}
.nav-tabs > li.active > a,
.nav-tabs > li.active > a:focus,
.nav-tabs > li.active > a:hover {
  border: none;
  color: var(--textc);
  background-color: #1e2227;
}
.nav-tabs > li > a:hover {
  border-color: #1e2227;
}
.nav > li > a:focus,
.nav > li > a:hover {
  background-color: #1e2227;
}
.nav-tabs {
  border-bottom: 1px solid #1e2227;
}
.editable-text_body_2Qad2 textarea {
  border: 1px solid #1e2227;
}
.project-view_box_1Gq_t {
  background: var(--bgc2) !important;
}
.studio-home-forum_studioCard_2nMK5 {
  background-color: var(--bgc2) !important;
}
.studio-home-forum_topWrapper_2UJZP {
  background: var(--bgc2) !important;
}
.studio-home-forum_nav_1_STH > .studio-home-forum_navItem_35Wc9 {
  color: var(--textc) !important;
}
.studio-home-forum_card_3tQo7 {
  background: var(--bgc2) !important;
}
.studio-home-forum_nav_1_STH i {
  background: #0f1319 !important;
}
.studio-home-forum_arrow_3eVAt {
  border-top-color: var(--bgc2) !important;
}
.forum-post-card_card_3lvWt .title h2 {
  color: var(--textc) !important;
}
.user-info_wrapper_2acbL {
  color: #888888 !important;
}
.tag-group_wrapper_37evO > span {
  background: var(--bgc2) !important;
}
.panel-top-bar_body_1OptA .search-group > * {
  border-color: #1e2227 !important;
}
.panel-top-bar_body_1OptA .search-group button.btn-search {
  background: #0f1319 !important;
}
.form-control {
  background-color: #0f1319 !important;
}
.forum_forumPosts_nh9dW li + li {
  border-top: 1px solid #1e2227 !important;
}
.user-card-large_showPendantCard_3pa4K {
  background: #0f1319 !important;
}
.store-item-card_wrapper_3Q0XV {
  box-shadow: 0 2px 10px #0f1319 !important;
  background: #0f1319 !important;
}
.project-ads_cardLarge_33fi5 {
  background: var(--bgc1) !important;
}
.tabs-primary_wrapper_3aJ2c.tabs-primary_normal_1IYGx {
  background: #0f1319 !important;
}
.pagination > li > a,
.pagination > li > span {
  background-color: #0f1319 !important;
  border: 1px solid #1e2227 !important;
}
.mission-card-large_wrapper_2-bCL {
  background: var(--bgc2) !important;
}
.modal_modal-content_3brCX > div > .body {
  background: var(--bgc2) !important;
}
.modal_header_1dNxf {
  background-color: #1d2026 !important;
}
.modal_modal-content_3brCX {
  border: 4px solid #1d2026 !important;
  color: var(--textc) !important;
}
.modal_modal-overlay_2_Dgx {
  background-color: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) saturate(2);
}
.user-items_bag_3RyCx,
.user-items_store_1jCDo {
  background: var(--bgc2) !important;
}
.user-items_money_2N4pr div {
  border: 1px solid #1e2227 !important;
}
.user-items_money_2N4pr img:first-child {
  border-right: 1px solid #1e2227 !important;
}
.user-items_money_2N4pr img:last-child {
  border-left: 1px solid #1e2227 !important;
}
.bag-item-card_wrapper_OhZLu {
  box-shadow: 0 2px 10px #000 !important;
}
.bag-item-card_wrapper_OhZLu .bag-item-card_count_1v6Et {
  color: #fff !important;
  background-color: var(--bgc2) !important;
  box-shadow: 0 2px 10px #000 !important;
}
.store-item-card_wrapper_1MpGf {
  box-shadow: 0 2px 10px #000 !important;
}
.popover.bottom > .arrow::after {
  border-bottom-color: #000 !important;
}
.popover.bottom > .arrow::after {
  border-bottom-color: var(--bgc2) !important;
}
.popover {
  background-color: #0d1116 !important;
  border: none !important;
  border: none !important;
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 1) !important;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 1) !important;
}
.popover-title {
  background-color: var(--bgc2) !important;
  border-bottom: 1px solid #222 !important;
}
label {
  color: var(--textc) !important;
}
.modal_modal-content_3brCX .footer button {
  background: var(--bgc2) !important;
}
.robot-digger-modal_mesg_-dSUM {
  color: #ccc !important;
}
.robot-digger-modal_digging-tasks_HZHFi {
  border: none !important;
}
.robot-digger-modal_digging-tasks_HZHFi .robot-digger-modal_finished_1AEs_ {
  background-color: #1e2227 !important;
}
.robot-digger-modal_digging-tasks_HZHFi .robot-digger-modal_task_3E9p8 {
  border: 1px solid #10141a !important;
  background-color: var(--bgc2) !important;
}
.robot-digger-modal_digging-tasks_HZHFi .robot-digger-modal_working_bqeHC {
  background-color: #1e2227;
}
.table-striped > tbody > tr:nth-of-type(2n + 1) {
  background-color: #1e222733 !important;
}
.card_wrapper_2Sod3 {
  -webkit-box-shadow: 0 0 8px rgb(0, 0, 0, 0.5) !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.home_userCard_2HTEf {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.sidebar-nav_wrapper_1VUBP .sidebar-nav_navigations_1X4Qe {
  background-color: var(--bgc2) !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.user-router_card_3eAOc {
  background: var(--bgc2) !important;
}
.sidebar-nav_wrapper_1VUBP .sidebar-nav_navigations_1X4Qe {
  background-color: var(--bgc2) !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.user-router_card_3eAOc {
  background: var(--bgc2) !important;
}
.mission-card-large_wrapper_2-bCL {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.panel-default > .panel-heading {
  background-color: #1d2026 !important;
  border-color: #1d2026 !important;
}
.panel-default > .panel-heading + .panel-collapse > .panel-body {
  border-top-color: #1d2026 !important;
}
.panel-group .panel-heading + .panel-collapse > .list-group,
.panel-group .panel-heading + .panel-collapse > .panel-body {
  border-top: 1px solid #1d2026 !important;
}
.panel-default {
  border-color: #1d2026 !important;
}
.panel {
  background-color: var(--bgc2) !important;
}
#collapse0 {
  background: var(--bgc2) !important;
}
.help_question_2G0NM:focus,
.help_question_2G0NM:hover {
  color: var(--textc) !important;
}
.avatar-lib_wrapper_1TxtU .avatar-lib_title_3GO4N {
  box-shadow: none !important;
}
.avatar-lib_wrapper_1TxtU .avatar-lib_title_3GO4N {
  box-shadow: none !important;
}
.card-large_wrapper_3Gi8W {
  background: var(--bgc2) !important;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5) !important;
}
.card-large_wrapper_3Gi8W .footer {
  border-top: none !important;
}
.bg-warning {
  background-color: #1e2227 !important;
}
.jumbotron {
  background-color: #1e2227 !important;
}
.bg-danger {
  background-color: #1e2227 !important;
  color: #aa2447 !important;
}
.list-group-item {
  background-color: #1e2227 !important;
  border: 1px solid #2d3035 !important;
}
a.list-group-item {
  color: var(--textc) !important;
}
a.list-group-item:focus,
a.list-group-item:hover {
  color: #fff !important;
  background-color: #2d3035 !important;
}
.breadcrumb {
  background-color: #1e2227 !important;
}
.panel2_wrapper_3UZFE.panel-border-bottom .panel2_panelHead_1Bn6y {
  border-bottom: 1px solid #1d2026 !important;
}
.alert-success {
  background-color: #dff0d822 !important;
  border-color: #468847 !important;
}
.alert-info {
  background-color: #d9edf722 !important;
  border-color: #3a87ad !important;
}
.alert {
  background-color: #fcf8e322 !important;
  border: 1px solid #c09853;
}
.alert-danger,
.alert-error {
  background-color: #f2dede22 !important;
  border-color: #b94a48 !important;
}
.robot-checkin-modal_progress-bar_Ud1tg {
  background: #2d3035 !important;
}
.user-home_mask_3NwE4 {
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(hsla(0, 0%, 100%, 0)),
    to(var(--bgc2))
  ) !important;
  background: -o-linear-gradient(hsla(0, 0%, 100%, 0), var(--bgc2)) !important;
  background: linear-gradient(hsla(0, 0%, 100%, 0), var(--bgc2)) !important;
}
.project-card-side_warpper_as34B .title a {
  color: var(--textc) !important;
}
.stage-header_stage-button_4qxON {
  border: 1px solid #2d3035 !important;
  background: var(--bgc2) !important;
}
.stage-header_stage-header-wrapper-overlay_7uuff {
  background-color: var(--bgc1) !important;
}
.stage-wrapper_stage-wrapper_3k56F.stage-wrapper_full-screen_3WIKP {
  background-color: var(--bgc1a) !important;
}
.stage_green-flag-overlay_219KT {
  background: none !important;
  border: none !important;
}
.stage_green-flag-overlay-wrapper_3bCO- {
  background: var(--bgc1a) !important;
  backdrop-filter: blur(10px) saturate(2);
}
.monitor_monitor-container_BKHcx {
  background: #0f1319 !important;
  border: none !important;
}
.menu-bar_menu-bar_1gLUp {
  background-color: var(--bgc1) !important;
}
.menu-bar_remix-button_22R_5 {
  background-color: var(--bgc1) !important;
}
.menu_menu_1rWB9 {
  background-color: var(--bgc1) !important;
}
.gui_body-wrapper_1T2l7 {
  background-color: var(--bgc1) !important;
}
.gui_tab_3k_DV {
  border: 1px solid #1e2227 !important;
  background-color: var(--bgc2) !important;
}
.gui_tab_3k_DV.gui_is-selected_3nXL3 {
  background-color: var(--bgc2) !important;
}
.gui_extension-button-container_sM98M {
  background: var(--bgc2) !important;
  border: none !important;
}
label {
  color: #fff !important;
}
.react-tabs_react-tabs__tab--selected_2o0LJ {
  background: var(--bgc2) !important;
}
.blocklySvg {
  background-color: var(--bgc1) !important;
}
.blocklyFlyoutBackground {
  fill: var(--bgc1) !important;
}
.scratchCategoryMenuItem.categorySelected {
  background: var(--bgc2) !important;
}
.scratchCategoryMenu {
  background: var(--bgc2) !important;
}
.sprite-selector_sprite-selector_1s2N2 {
  background-color: var(--bgc2) !important;
}
.sprite-info_sprite-info_2qOXw {
  background-color: var(--bgc2) !important;
}
.stage-selector_stage-selector_2gOfn {
  background-color: var(--bgc2) !important;
}
.stage-selector_header_Q8vgs {
  background-color: var(--bgc2) !important;
}
.sprite-selector-item_sprite-selector-item_3c9Kl.sprite-selector-item_is-selected_EE4jo {
  background: var(--bgc2) !important;
}
.sprite-selector-item_sprite-selector-item_3c9Kl:hover {
  background: var(--bgc2) !important;
}
.input_input-form_2EIqD {
  background: var(--bgc2) !important;
}
.stage-header_stage-button_4qxON {
  background: var(--bgc2) !important;
}
.blocklyToolboxDiv {
  background-color: var(--bgc2) !important;
}
.share-button_share-button_36Wbh {
  background: #05080d !important;
}
.library_library-scroll-grid_7xk1I {
  background: var(--bgc1) !important;
}
.library-item_library-item_1nZBu {
  background: var(--bgc2) !important;
}
.library-item_library-item-inset-image-container_2oGku {
  border: none !important;
}
.library-item_library-item-name_35ftf {
  color: var(--textc) !important;
}
.library-item_featured-description_1hGaH {
  color: #aaa !important;
}
.blocklyFlyoutLabelText {
  fill: var(--textc) !important;
}
.scratchCategoryMenuItem {
  color: #ddd !important;
}
.asset-panel_wrapper_26zMp {
  background: var(--bgc1) !important;
}
.selector_wrapper_1v6kq {
  background: var(--bgc1) !important;
}
.selector_new-buttons_2iXR0::before {
  background: linear-gradient(rgba(232, 237, 241, 0), var(--bgc1)) !important;
}
.input_input-form_K5SYW {
  border-color: var(--bgc1) !important;
  background: var(--bgc1) !important;
}
.user_card_14OMg {
  background: var(--bgc2) !important;
}
.studio-home_studio-card_2Aj3P {
  background-color: var(--bgc2) !important;
}
.studio-home_handleInfo_3DAit {
  background-color: var(--bgc2) !important;
}
.Popover-body {
  background: var(--bgc1) !important;
  border: 1px solid var(--bgc2) !important;
}
.user-card-large_friend_MGCqU {
  background-image: url(https://asset.mozhua.org:444/Media?name=21ca34a9e42121fa1d88ed1f25ea5490.svg) !important;
}
.dropdown .dropdown-menu {
  background-color: #0f1319 !important;
}
.dropdown .dropdown-menu li:hover {
  background-color: #1e2227 !important;
}
.dropdown-menu > li > a {
  color: var(--textc) !important;
}
.dropdown-menu > li > a:focus,
.dropdown-menu > li > a:hover {
  color: #fff !important;
  background-color: #1e2227 !important;
}
blockquote {
  border-left: 5px solid #1d2026 !important;
}
.user-toplist_userRank_qHDsG {
  background: #345365 !important;
}
.editable-tag-group_add-tags_2S1aZ > span,
.editable-tag-group_tips-tags_1g6-f > span,
.editable-tag-group_wrapper_2pRM8 > span {
  background: var(--bgc2) !important;
}
.popover.right > .arrow::after {
  border-right-color: #0d111600 !important;
}
.popover.right > .arrow {
  border-right-color: #0000 !important;
}
.studio-home-forum_userMore_22IKJ {
  background-image: none !important;
}
.question_question-container_26Z9Q {
  border: 1px solid #1e2227 !important;
  background: var(--bgc2) !important;
}
.question_question-label_1SgY7 {
  color: #fff !important;
}
.input_input-form_2EIqD {
  color: #fff !important;
  border-color: hsla(215, 100%, 65%, 1) !important;
}
.custom-procedures_body_1H7Iq {
  border-color: hsla(215, 100%, 65%, 1) !important;
}
.custom-procedures_option-card_1Gtvt {
  border-color: hsla(215, 100%, 65%, 1) !important;
}
.custom-procedures_button-row_3EJDk button {
  background: #1d2026 !important;
}
.prompt_body_Vgt8G {
  background: var(--bgc1) !important;
}
.prompt_button-row_34Zss button {
  background: #1d2026 !important;
}
.prompt_variable-name-text-input_36E65 {
  color: #fff !important;
  background: #1d2026 !important;
}
.comment_deletes_36EkF {
  background: #25272d40 !important;
}
ul.menu-bar_main-nav_97WYO li a:hover {
  background-color: #1e2227 !important;
  transition: background-color 0.15s ease-in !important;
}
.menu-bar_loged-in_Xwduf:hover {
  background: #06080f !important;
}
.menu-bar_loged-in_Xwduf {
  transition: background-color 0.15s ease-in !important;
}
.mission-panel_mission_18h-O {
  background-color: var(--bgc2) !important;
}
.user-mission-rank {
  background: #e5f0ff10 !important;
}
.crash-message_crash-wrapper_15SLi {
  background-color: var(--bgc1a) !important;
}
.crash-message_reloadButton_35TdL {
  border: 1px solid #aaa !important;
  background: none !important;
  color: var(--textc) !important;
}
.loader_background_1-Rwn {
  background-color: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) saturate(2) !important;
}
.crash-message_reloadButton_35TdL:hover {
  background: #fff1 !important;
  transition: ease-in 0.2s background !important;
}
.user-home_wrapper_32MwP .panel-large,
.user-home_wrapper_32MwP .panel-large .panel-content {
  background: var(--bgc1) !important;
}
.scratchCommentTextarea {
  background-color: var(--bgc1) !important;
}
.scratchCommentTopBar {
  fill: #0f1319 !important;
  fill-opacity: 1 !important;
}
.scratchCommentRect {
  fill: #0f1319 !important;
}
.blocklyScrollbarHandle {
  fill: #555 !important;
  fill-opacity: 0.5 !important;
}
.blocks_blocks_2LOZ2 .blocklyFlyout {
  backdrop-filter: blur(10px) saturate(2) !important;
}
.blocklyFlyout {
  outline: none!important;
}
.action-menu_button_31je5 {
  background: var(--bgc1) !important;
}
.action-menu_main-button_2m3TE {
  box-shadow: 0 0 0 4px #1a1e28bb !important;
}
.action-menu_tooltip_1YpkD::after {
  background-color: #1a1e28 !important;
}
.action-menu_tooltip_1YpkD {
  background-color: #1a1e28 !important;
}
.action-menu_more-buttons-outer_1tVn_ {
  background: #1a1e28 !important;
}
.action-menu_more-button_FdlvY {
  background: var(--bgc1) !important;
}
.action-menu_button_31je5:hover {
  background: #1e2227 !important;
}
.action-menu_main-button_2m3TE:hover {
  box-shadow: 0 0 0 6px #06090faa !important;
}
.custom-procedures_body_1H7Iq {
  background: var(--bgc1) !important;
}
.custom-procedures_option-card_1Gtvt {
  background: #1d2026 !important;
}
.custom-procedures_option-card_1Gtvt {
  border-color: #1d2026 !important;
}
.blocklyFlyoutButton:hover {
  fill: #0004 !important;
}
.blocklyFlyoutButton .blocklyText {
  fill: #ddd !important;
}
.context-menu_context-menu_3Ahoz {
  background-color: #06090fcc !important;
  backdrop-filter: blur(10px) saturate(2) !important;
}
.context-menu_menu-item_2ReLI:hover {
  background: #4d97ff88 !important;
}
.monitor_list-header_2fGXP {
  background: var(--bgc1) !important;
  color: var(--textc) !important;
}
.monitor_list-body_3Yq5K {
  background: var(--bgc1) !important;
}
.monitor_list-index_1h6b3 {
  color: var(--textc) !important;
}
.monitor_list-footer_28WLY {
  background: var(--bgc1) !important;
  color: var(--textc) !important;
}
.blocklyWidgetDiv .goog-menu {
  background: #06090fcc !important;
  border-color: #06090fcc !important;
  backdrop-filter: blur(10px) saturate(2) !important;
}
.blocklyWidgetDiv .goog-menuitem {
  color: var(--textc) !important;
}
.blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-accel,
.blocklyWidgetDiv .goog-menuitem-disabled .goog-menuitem-content,
.blocklyDropDownDiv .goog-menuitem-disabled .goog-menuitem-accel,
.blocklyDropDownDiv .goog-menuitem-disabled .goog-menuitem-content {
  color: #888 !important;
}
.blocklyWidgetDiv .goog-menuitem-highlight,
.blocklyWidgetDiv .goog-menuitem-hover {
  background-color: #4d97ff88 !important;
  border-color: #4d97ff88 !important;
}
.library_filter-bar_8xrjd {
  background-color: #1d2026 !important;
}
.filter_filter_3ERdM {
  background: var(--bgc2) !important;
}
.filter_filter-input_3aL2D::placeholder {
  color: var(--textc) !important;
}
.filter_filter-input_3aL2D {
  color: #fff !important;
}
div#s3devDDOut.vis {
  background-color: #0d1117cc !important;
  backdrop-filter: blur(10px) saturate(2) !important;
}
#s3devInp {
  background: var(--bgc2) !important;
}
.menu-bar_loged-in_Xwduf .menu-bar_user-icon_Td5U0 {
  border-radius: 16px !important;
  width: 28px !important;
}
.menu-bar_name_32fzF > span:nth-child(1) {
  display: none !important;
}
.progress_progress_Gm5t- {
  display: none !important;
}
ul.user-dropdown-menu_wrapper_3RsXx li a {
  color: #999 !important;
  padding: 4px 0 !important;
}
ul.user-dropdown-menu_wrapper_3RsXx li a:hover {
  background: #1f6feb !important;
  color: #fff !important;
}
.menu-bar_topnav_3HgyJ a {
  transition: all 0.03s ease-in !important;
}
ul.user-dropdown-menu_wrapper_3RsXx li.user-dropdown-menu_logout_39YmW {
  border-top: 1px solid #2d333a !important;
}
#navbar {
  margin-right: -31px !important;
}
.user-level_level-0_3HviE {
  color: var(--textc) !important;
  background-color: #3d4147 !important;
  border: 2px solid #515459 !important;
}
.user-level_level-1_uTxh6 {
  background-color: #324327 !important;
  color: #a1df3d !important;
  border: 2px solid #49642b !important;
}
.user-level_level-2_3b_PK {
  background-color: #293e48 !important;
  color: #80dff4 !important;
  border: 2px solid #324e5a !important;
}
.user-level_level_3d3fz {
  border-radius: 10px !important;
  color: #f3c93b;
  background-color: #403c27;
  border: 2px solid #544b28;
}
.item-info_intor_fELdW {
  color: #ddd !important;
}
.item-info_descp_2jqqW {
  color: #ddd !important;
}
.forum-post-add_wrapper_2IFFJ {
  background: var(--bgc2) !important;
}
.mission-challenge-ranking_ranking_RSiUj {
  color: var(--textc) !important;
}
.puzzle-pane_puzzle-pane_3yfW7 {
  background-color: var(--bgc2) !important;
  border-color: var(--bgc2) !important;
}
.mission-helps-modal_body_1x7fQ {
  background: var(--bgc2) !important;
}
.mission-panel_prerequired_3heMD {
  background-color: var(--bgc2) !important;
}
.mission-panel_prerequired_3heMD .mission-panel_content_1-P6J > div a {
  color: var(--textc) !important;
}
.navigation-list_wrapper_1RqLP li:hover {
  background: #1f2228 !important;
  color: #fff !important;
  transition: all 0.1s ease !important;
}
.navigation-list_wrapper_1RqLP li,
.navigation-list_wrapper_1RqLP li.navigation-list_disabled_3oHod:focus,
.navigation-list_wrapper_1RqLP li.navigation-list_disabled_3oHod:hover {
  background: #1f222833 !important;
  color: var(--textc) !important;
}
.navigation-list_wrapper_1RqLP
  li
  .navigation-list_content_2S2K9
  .navigation-list_title_SOF67,
.navigation-list_wrapper_1RqLP
  li.navigation-list_disabled_3oHod:hover
  .navigation-list_content_2S2K9
  .navigation-list_title_SOF67 {
  color: var(--textc) !important;
}
.navigation-list_wrapper_1RqLP li i {
  background: #1f2228 !important;
}
.auction-item-card_card_1JVeQ {
  background: var(--bgc2) !important;
  box-shadow: 0 2px 10px #000 !important;
}
.auction-Item-log_card_1UytO {
  background: var(--bgc2) !important;
  box-shadow: 0 2px 10px #000 !important;
}
.layout_content_20yil > div:nth-child(2) {
  background: var(--bgc1) !important;
}
.studio-home-aisc_card_EPhUw:nth-of-type(2n + 1) {
  background: var(--bgc1) !important;
}
.studio-home-aisc_card_EPhUw:nth-of-type(2n) {
  background: var(--bgc1) !important;
}
.studio-home-aisc_head_1iD9k {
  background: #fcf8e322 !important;
}
.auction-sell-modal_count_2wKUq {
  color: #fff !important;
  background-color: var(--bgc2) !important;
  -webkit-box-shadow: 0 2px 10px #000 !important;
  box-shadow: 0 2px 10px #000 !important;
}
.warning-message_wrapper_2O2sn {
  background-color: var(--bgc1a) !important;
  border: none !important;
}
.blocklyDropDownDiv {
  background-color: var(--bgc2) !important;
  border-color: #1d2026 !important;
}
.menu-bar_navbar_lCik_ {
  background: var(--bgc1a) !important;
  box-shadow: none !important;
}
ul.menu-bar_main-nav_97WYO {
  border-bottom: 1px solid var(--textc) 4 !important;
}
.comment-panel_comment-panel_3pBsc form textarea:focus {
  min-height: 200px !important;
  transition: all ease-in-out 300ms !important;
}
.comment-panel_comment-panel_3pBsc form textarea {
  transition: all ease-in-out 300ms !important;
  transition-delay: 300ms !important;
}
.items-guide_card_QYkCd {
  background: var(--bgc2) !important;
  box-shadow: 0 2px 10px #000 !important;
}
.share-card_body_T97RJ {
  background: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) !important;
}
.share-card_foot_3p3AB {
  background: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) !important;
}
.tips_tips_BetGP {
  color: var(--textc) !important;
}
.user-messages_card_2ITqW {
  background: var(--bgc2) !important;
  border-bottom: none !important;
  box-shadow: 0 0 8px #00000080 !important;
  line-height: 15px !important;
}
.user-messages_title_2snA4 {
  color: #888 !important;
}
.sidebar-nav_wrapper_1VUBP .sidebar-nav_navigations_1X4Qe {
  box-shadow: 0 0 8px #00000080 !important;
}
ul.dropdown-menu{
  background-color: #06090f !important;
}
.studio-home_handleInfo_3DAit > ul > li > :not(.btn .btn-group) {
  color: #888;
}
.studio-home_handleInfo_3DAit > ul > li > label, .btn {
  color: var(--textc) !important;
}
.studio-manage_card_2Wh_z {
  background-color: var(--bgc2) !important;
}
.backpack_backpack-header_Vteeu {
  background-color: var(--bgc2) !important;
  color: var(--textc) !important;
}
.backpack_backpack-item > nav > div{
  color: var(--textc) !important;
}
.sound-editor_button_28oLj {
  background-color: var(--bgc1) !important;
}
.forum-post-view_mask_2Ct5B {
  background: linear-gradient(hsla(0,0%,100%,0),var(--bgc2)) !important;
}
.event-component_wrapper_T9bjV > i {
  border: none !important;
  background-color: #AAA !important;
}
.user-forum-posts_wrapper_vB-WA {
  background-color: var(--bgc2) !important;
  width: 65% !important;
}
.stat-graph_day-0_idJxi {
  background-color: #282d34 !important;
}
.stat-graph_day-1_3GeeK {
  background-color: #2d3c51 !important;
}
.stat-graph_day-2_WowYZ {
  background-color: #35537d !important;
}
.stat-graph_day-3_36etr {
  background-color: #3c69a8 !important;
}
.stat-graph_day-4_3XS42 {
  background-color: #4c97ff !important;
}
/* ccw */
.menu-bar_menu-bar_JcuHF {
  background-color: var(--bgc1) !important;
}
.gui_body-wrapper_-N0sA {
  background-color: var(--bgc1) !important;
}
.gui_tab_27Unf.gui_is-selected_sHAiu {
  background-color: var(--bgc2) !important;
}
.gui_tab_27Unf:hover {
  background-color: var(--bgc2) !important;
}
.gui_tab_27Unf {
  background-color: var(--bgc2) !important;
}
.backpack_backpack-header_6ltCS {
  background: var(--bgc2);
  color: var(--textc) !important;
}
.stage-header_stage-button_hkl9B {
  background: var(--bgc2) !important;
}
.sprite-info_sprite-info_3EyZh {
  background-color: var(--bgc1) !important;
  border-bottom: 1px solid var(--bgc2) !important;
}
.sprite-selector_scroll-wrapper_3NNnc {
  background: var(--bgc1) !important;
}
.sprite-selector_sprite-selector_2KgCX {
  background-color: var(--bgc2) !important;
}
.stage-selector_header_2GVr1, .stage-selector_stage-selector_3oWOr {
  background-color: var(--bgc1) !important;
}
.input_input-form_l9eYg {
  color: var(--textc) !important;
  background: var(--bgc2) !important;
}
.modal_modal-overlay_1Lcbx {
  background-color: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) !important;
}
.modal_header_1h7ps {
  background-color: #1d2026 !important;
}
.custom-procedures_body_SQBv6 {
  background: var(--bgc1) !important;
}
.custom-procedures_option-card_BtHt3 {
  background: #1D2026 !important;
  color: var(--textc) !important;
}
.prompt_body_18Z-I {
  background: var(--bgc1) !important;
}
.prompt_variable-name-text-input_1iu8- {
  color: var(--textc) !important;
  background: #1d2026 !important;
}
.container-19gjB {
  background-color: var(--bgc1) !important;
}
.wrapper-3474e {
  background-color: var(--bgc1) !important;
}
.input-37PPL > input {
  background-color: var(--bgc2) !important;
  color: var(--textc) !important;
}
.focus-HH0Ip {
  color: var(--textc) !important;
}
.thirdPartyTitle-3Icbt > span {
  background-color: var(--bgc2) !important;
}
.title-1x6gJ {
  color: var(--textc) !important;
}
.container-1KOYd {
  background-color: var(--bgc2) !important;
}
.extraItem-lstHT {
  color: #888 !important;
}
.content-OsM4r {
  background-color: var(--bgc2) !important;
}
.footer-e0Syp {
  background-color: var(--bgc2) !important;
}
.title-2b0u7 > span{
  color: #BBB !important;
}
.origin-ab9bh, .reposted-1zvgf {
  background-color: var(--bgc2) !important;
}
.arrowTop-2Fru_ {
  background-color: var(--bgc2) !important;
}
.title-cUpGy, .notionList-1x9JR {
  background-color: var(--bgc2) !important;
}
.content-3Klgd {
  border-bottom-color: #888 !important;
}
.header-background-1Malb {
  background-color: var(--bgc1) !important;
}
.user-select-3I_OX {
  background-color: var(--bgc1) !important;
}
.name-8FNxo {
  color: var(--textc) !important;
}
.search-3rjMu {
  background-color: var(--bgc2) !important;
  color: var(--textc)
}
.discoverTagItem-PAYVw {
  background-color: var(--bgc2) !important;
}
.container-1b1zf {
  background-color: var(--bgc2) !important;
}
.headLeft-CY-mp > span {
  color: var(--textc) !important;
}
.replyCreation-1qr2S {
  background-color: var(--bgc2) !important;
}
.replyCreationHead-17tqk > span {
  color: #4f4dd2 !important;
}
.container-3tI-s {
  background-color: var(--bgc2) !important;
}
.creationTitle-3SxBi > span{
  color: #4f4dd2 !important;
}
.container-2iC-t {
  background-color: var(--bgc2) !important;
}
.studentName-3rrbp {
  color: #4f4dd2 !important;
}
.recommend-1s-HQ {
  display: none;
}
.container-2Mm1d {
  background-color: var(--bgc2) !important;
}
.leftContent-3zu6j :first-child {
  color: #4f4dd2 !important;
}
.logout-3hTAg > img {
  filter: invert(0.8);
}
.personalInfo-15TiZ, .tabWrapper-2mhvI, .tab-1njza, .exhibitionCreationHead-3PiSI, .container-2m0Lv, .container-3tI-s, .introduction-jkWDj, .comments-3I40W, .c-floor-in-floor {
  background-color: var(--bgc2) !important;
}
.bio-3uLlr > input {
  background-color: var(--bgc2) !important;
  color: var(--textc) !important;
}
.bioDisplay-3PigT > p {
  color: var(--textc) !important;
}
.name-n9cKI > span {
  color: var(--textc) !important;
}
.studentTitle-ki3-F > span {
  background-color: var(--bgc2) !important;
}
.c-author {
  color: #4f4dd2 !important;
}
.c-comment-content {
  color: var(--textc) !important;
}
.c-textareaWrapper, .c-textarea {
  background-color: var(--bgc2) !important;
  color: var(--textc) !important;
  font-family: "Microsoft Yahei", Arial, PingFang !important;
}
.c-emoji {
  background-color: var(--bgc2) !important;
}
.c-emoji-header {
  background-color: #7175f5 !important;
}
.c-textarea {
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
  transition-delay: 300ms;
}
.c-textarea:focus {
  height: 200px !important;
  transition-delay: 0s;
}
.content-2IGDF {
  background-color: var(--bgc2) !important;
}
.title-2Lzjd :last-child {
  color: #4f4dd2 !important;
}
.tabContentWrapper-37KNg, .tab-2fo7S {
  background-color: var(--bgc2) !important;
}
.list-1QOpS {
  background-color: var(--bgc2) !important;
}
.content-1LZD8, .footer-2vbHR, .content-1LZD8 {
  background-color: var(--bgc2) !important;
}
.title-278Hm {
  color: #4f4dd2 !important;
}
.worksMainInfoCtn-2iRz3,
.stage-header_stage-menu-wrapper_15JJt,
.stage-header_playerOnly_35dpv,
.monitor_default-monitor_2vCcZ,
.stage-header_stage-header-wrapper-overlay_5vfJa,
.stage-wrapper_stage-wrapper_2bejr,
.stage-wrapper_full-screen_2hjMb,
.info-3SIDw {
  background-color: var(--bgc2) !important;
}
.title-1M2qA {
  color: #4f4dd2 !important;
}
.right-3rAky :first-child {
  color: #4f4dd2 !important;
}
.viewAll-3bwLg {
  background-image: linear-gradient(270.2deg, var(--bgc2) 0.09%, var(--bgc2a) 63.78%, var(--bgc2a) 74.32%, var(--bgc2a) 88.55%);
}
.container-1eeXt {
  background-color: var(--bgc2) !important;
}
.disabledTips-1WKSG {
  color: #000 !important;
}
/* CCW 创造者学院 */
.gh-head {
  background-color: var(--bgc1) !important;
}
.gh-head-student-info-container {
  background-color: var(--bgc1) !important;
}
.gh-head-student-info-name {
  color: var(--textc) !important;
}
/* ClipCC */
.stage_stage-wrapper-overlay_fmZuD {
  background-color: var(--bgc1a) !important;
  backdrop-filter: var(--bgf) !important;
}
.library_library-scroll-grid_1jyXm {
  background: var(--bgc1); !important
}
.library_filter-bar_1W0DW {
  background-color: var(--bgc2) !important;
}
.library-item_library-item_1DcMO {
  color: var(--textc) !important;
  background: var(--bgc2) !important;
}
.filter_filter_1JFal {
  background: var(--bgc1) !important;
}
.filter_filter-input_1iiEt::placeholder {
  color: var(--textc) !important;
}
.asset-panel_wrapper_366X0 {
  background: var(--bgc2) !important;
}
.selector_wrapper_8_BHs {
  background: var(--bgc2) !important;
}
.selector_new-buttons_2qHDd::before {
  background: linear-gradient(#e8edf100,var(--bgc1)) !important;
}
.blocklyMainBackground {
  fill: var(--bgc1) !important;
}
.sprite-selector-item_sprite-selector-item_kQm-i.sprite-selector-item_is-selected_24tQj {
  background: var(--bgc2) !important;
}
.sprite-selector-item_sprite-selector-item_kQm-i:hover {
  background: var(--bgc2) !important;
}
`);
  //================== Global Func =====================
  $("body").prepend(`
<script>function dat_alert(title,name,useTime,markdown) {
        $("body").after(\`
<div class="ReactModalPortal" id="DAT_AlertWindow">
    <div class="ReactModal__Overlay ReactModal__Overlay--after-open modal_modal-overlay_2_Dgx" aria-modal="true">
        <div class="ReactModal__Content ReactModal__Content--after-open modal_modal-content_3brCX" tabindex="-1">
            <div class="box_box_tWy-0" style="flex-direction: column; flex-grow: 1;">
                <div class="modal_header_1dNxf" style="height: 3.125rem;">
                    <div class="modal_header-item_1WbOm modal_header-item-title_1N2BE">\`+title+\`</div>
                    <div class="modal_header-item_1WbOm modal_header-item-close_4akWi">
                        <div aria-label="Close" class="close-button_close-button_t5jqt close-button_large_2cCrv"
                            role="button" tabindex="0" onclick="$('#DAT_AlertWindow').remove();"><img
                                class="close-button_close-icon_ywCI5"
                                src="https://cdn.gitblock.cn/static/images/cb666b99d3528f91b52f985dfb102afa.svg"></div>
                    </div>
                </div>
                <div class="body box_box_tWy-0">
                    <div class="item-attached-thin-modal-body_wrapper_3KdPz">
                        <div>
                            <h1 class="item-attached-thin-modal-body_name_p9cDj">\`+name+\`</h1>
                            <div><span>\`+useTime+\`</span></div>
                        </div>
                    </div>
                    <div class="markdown_body_1wo0f item-isolator-modal_declarationDescp_2g62z">
                        <div class="content">
                            \`+markdown+\`
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>\`);
    }
</script>`);
  //================== Domain Redirect =====================
  var url = window.location.href;
  if (GM_getValue("DAT_domain", null) == null) {
    if (url.search("gitblock.cn") != -1) {
      GM_setValue("DAT_domain", "gitblock");
    }
    if (url.search("aerfaying.com") != -1) {
      GM_setValue("DAT_domain", "aerfaying");
    }
  }
  //console.log(GM_listValues());
  if (GM_getValue("DAT_domain") == "aerfaying") {
    if (url.search("gitblock.cn") != -1) {
      window.location.assign(window.location.href.replace("gitblock.cn", "aerfaying.com"));
    }
  }
  if (GM_getValue("DAT_domain") == "gitblock") {
    if (url.search("aerfaying.com") != -1) {
      window.location.assign(window.location.href.replace("aerfaying.com", "gitblock.cn"));
    }
  }
  //================== Report Center =====================
  if (url.search("/Admin/Reports") != -1) {
    //console.log("In report center, add css");
    GM_addStyle(`;
.user-info_wrapper_2acbL {
  color: #eee !important;
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background: #4c97ff !important;
  transition: none !important;
}
.btn-primary {
  border: 1px solid #fff3 !important;
}
.panel-top-bar_body_1OptA .search-group > * {
  border-color: #fff3 !important;
}
.btn-default {
  border: 1px solid #fff3 !important;
}
.table-striped > tbody > tr:nth-of-type(2n + 1) {
  background-color: #1e2227 !important;
}
a {
  color: #eee !important;
}
.btn-outline-primary {
  color: #fff !important;
  border-color: #fff3 !important;
  background-color: #0D1117 !important;
}
.btn-outline-primary:hover {
  background-color: #4C97FF !important;
}
.dropdown .dropdown-menu {
  border: 1px solid #fff3 !important;
}
.reports_nav_1SVZ3 {
  color: #888 !important;
}
.responsive-table_head_2zj6E th {
  color: #fff !important;
}
.footer-bar-full-screen_wrapper_1EVW- {
  display: none !important;
}
`);
  }

  //================== Redlist =====================

  if (url.search("/Users") != -1) {
    //console.log("In user home, verify redlist");
    var libraLib = {
      isInList: function (id) {
        $.ajax({
          url: "https://www.scpo.top:1120/v2",
          data: {
            method: "isInList",
            platform: "acamp",
            format: "id",
            value: id,
          },
          success: function (result) {
            //console.log(result);
            if (result["message"] == "success") {
              if (result["status"] == true) {
                alert("此人在红名单中,原因是:\n" + result["reason"]);
              }
            }
          },
        });
      },
    };
    libraLib.isInList(url.split("/")[4]);
  }

  //================== Comment ID =====================

  const COMMENT_ID_CLASS = 'dat_comment_id';
  const COMMENT_CLASS = 'comment_comment_P_hgY';
  GM_addStyle(`
    .${COMMENT_ID_CLASS} {
      display: inline;
      color: #888888;
      margin: 0 0.5rem;
      font-size: 12px;
      transition: color 0.1s ease;
    };
    .${COMMENT_ID_CLASS}:hover {
      color: #4C97FF !important;
      transition: color 0.1s ease;
    };
    `);
  setInterval(() => {
    var comments = $('.' + COMMENT_CLASS);
    comments.each(function () {
      var cidel = $('.' + COMMENT_ID_CLASS, this);
      if (cidel.length === 0) {
        var commentId = this.id;
        $('> div.comment_info_2Sjc0 > div:nth-child(2)', this).append(
          ` <a href="` + location.pathname + location.search + `#commentId=` + commentId + `" class="` + COMMENT_ID_CLASS + `">#` + commentId + `</a>`);
      }
    });
  }, 2500);

  //================== ActionStat =====================

  setInterval(() => {
    intervalFunc_actionStat();
  }, 2500);

  function intervalFunc_actionStat() {
    //定时事件
    $(
      "[src='https://cdn.gitblock.cn/static/images/776e7636933f5be6ab8bd9eb5334ba3d.png']"
    ).attr(
      "src",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC"
    );
  }

  //================== View Markdown =====================

  setInterval(() => {
    intervalFunc_ViewMarkdown();
  }, 2500);

  function intervalFunc_ViewMarkdown() {
    if ($(".panel2_panelHead_1Bn6y.panel-head:contains('个人简介')").length != 0 && $("#dat_viewmd").length == 0) {
      $(".panel2_panelHead_1Bn6y.panel-head:contains('个人简介')").children("h2").append(`
<a id="dat_viewmd">Markdown</a>`);
      $("#dat_viewmd").click(function (e) {
        var uid = url.split("/")[4];
        $.ajax({
          url: "/WebApi/Users/" + uid + "/Get",
          type: "POST",
          async: false,
          success: function (result) {
            var markdown = "<pre><code>" + result.user.abstract.replace(/\n/g, "</br>") + "</code></pre>";
            dat_alert("Markdown 原文", result.user.username, "#" + uid, markdown);
          },
        });
      })
    }
  }
})();