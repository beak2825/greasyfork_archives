// ==UserScript==
// @name     DS p0t NIGHT VISION
// @include  https://*.die-staemme.de/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.5.4
// @namespace die-staemme.bigger.chat
// @description Schrift dunkler, sonst gleich
// @downloadURL https://update.greasyfork.org/scripts/379835/DS%20p0t%20NIGHT%20VISION.user.js
// @updateURL https://update.greasyfork.org/scripts/379835/DS%20p0t%20NIGHT%20VISION.meta.js
// ==/UserScript==
(function () {
    'use strict';
    GM_addStyle(`
    #info_content td {
        background-color: #394E63 !important;
    }
    #main_layout {
        margin: 0;
        margin-left: 250px;
    }

    #content_value table, .popup_help table {
        background: #394E63 !important;
        border: 1px solid #666666 !important;
    }
    .box-border.red .divider::before, .box-border.red .divider::after {
        background: #091827;
    }
    .logo {
        background: #091827;
    }
    .bg-top {
        background: #091827;
    }
    .box-border.red .middle {
        background: #091827;
    }
    .box-border.red .top-left {
        background: #091827;
    }

    .box-border.red .top-right {
        background: #091827;
    }

    .box-border.red .middle-top {
        background: #091827;
    }

    .box-border.red .middle-bottom {
        background: #091827;
    }

    .box-border.red .middle-left {
        background: #091827;
    }

    .box-border.red .middle-right {
        background: #091827;
    }

    .box-border.red .bottom-left {
        background: #091827;
    }

    .box-border.red .bottom-right {
        background: #091827;
    }
         .spoiler div {
        background: #21354C;
    }
    .questlog_placeholder {
        min-width: 20px;
    }
    .btn, .btn-default {
        background: linear-gradient(to bottom, #947a62 0%,#7b5c3d 22%,#3b2b1b 30%,#352414 100%); !important;
    }
    .questlog {
        left: -250px;
        width: 150px;
    }
    .thread_button span {
        color: black;
    }
    .quest{
        background-color: #394E63;
        border: 1px solid #666666;
        box-shadow: rgba( 60, 30, 0, 0.7 ) 0px 0px 0px;
    }
    .fake-browser-notification {
        background: #21354C;
    }
    .chat-block {
        float: left;
    }

    .chat-body {
        /* Höhe des Chats */
        height: 600px;
        background: #21354C;
    }

    #chat-wrapper {
        margin-bottom: 31px;
    }

    .chat-input {
        background: #21354C;
        color: #FFFFFF;
    }

    .chat-footer {
        border-top: 1px solid #666666;
        background: #21354C;
    }

    body {
        background-image: url( );
        background-color: #091827;
        color: #FFFFFF;
    }

    .chat-new-message-notification {
        background: #394E63;
    }

    a {
        color: #FFFFFF;
    }

    .content-border {
        background: #21354C;
        border: 1px solid #666666;
    }

    #main_layout .bg_left {
        background-image: url( );
        background-color: #091827;
        display: none;
    }

    #main_layout .bg_right {
        background-image: url( );
        background-color: #091827;
    }

    #main_layout .bg_right .bg_right {
        background-image: url( );
        background-color: #091827;
    }

    #main_layout .bg_bottomcenter {
        background-image: url( );
        background-color: #091827;
    }

    #main_layout .bg_bottomleft {
        background-image: url( );
        background-color: #091827;
    }

    #main_layout .bg_bottomright {
        background-image: url( );
        background-color: #091827;
    }

    #main_layout .bg_left .bg_left {
        background-image: url( );
        background-color: #091827;
    }

    .chat-contacts .chat-body {
        background: #21354C;
    }

    .chat-header {
        background-image: url( );
        background-color: #091827;
        border-bottom: 1px solid #666666;
    }

    .chat-contact {
        background: #394E63;
        border-bottom: 1px solid #666666;
    }

    .chat-contact:first-child {
        border-top: 1px solid #666666;
    }

    .chat-window {
        border: 1px solid #666666;
    }

    .server_info {
        color: #FFFFFF;
        background: #394E63;
    }

    .maincell {
        background: #394E63;
    }

    #inner-border {
        border: 1px solid #666666;
    }

    .chat-message {
        background: #394E63;
        color: #cbd3de;
        border: 1px solid #666666
    }

    .chat-author-line {
        color #a75801;

    }

    .chat-row :hover {
        background: #21354C;
    }

    .chat-message.chat-message-other {
        background: #394E63;
    }

    .reportable.chat-row:hover {
        background: #21354C;
    }

    .chat-author-line {
        color: #FFFFFF;
    }

    .chat-row .userimage {
        border: 1px solid #666666;
    }

    .vis td,
    .vis_item {
        background: #091827;
        color: #FFFFFF
    }

    .vis .selected,
    .vis .selected>td,
    .overview_table .selected>td {
        background: #091827 !important;
        color: #FFFFFF !important;
        border: 1px solid #FFFFFF !important;
    }

    .row {
        background: #394E63;
        color: #FFFFFF
    }

    li.help {
        background: #394E63;
        color: #FFFFFF
    }

    .icon-box {
        background: #21354C;
    }

    .box-item {
        color: #FFFFFF;
    }

    .box-item:first-child {
        background: #21354C;
    }

    .box-item.separate {
        background: #21354C;
    }

    .header-border {
        background: #21354C;
    }

    .header-border .box {
        background: #21354C;
    }

    .header-border .firstcell {
        background: #21354C;
    }

    td.shadow div.rightshadow {
        background: #394E63;
    }

    td.shadow div.leftshadow {
        background: #394E63;
    }

    #quickbar_inner .left {
        background: #394E63;
    }

    #quickbar_inner .main {
        background: #21354C;
    }

    #quickbar_inner .right {
        background: #394E63;
    }

    #quickbar_inner .topborder .left {
        background: #394E63;
    }

    #quickbar_inner .topborder .main {
        background: #394E63;
    }

    #quickbar_inner .topborder .right {
        background: #394E63;
    }

    #quickbar_inner .bottomborder .left {
        background: #394E63;
    }

    #quickbar_inner .bottomborder .main {
        background: #394E63;
    }

    #quickbar_inner .bottomborder .right {
        background: #394E63;
    }

    th,
    .vis>h4 {
        background: #091827 !important;
    }

    .row h4 {
        background: #091827 !important;
    }

    .popup_menu {
        background: #091827 !important;
    }

    #inline_popup_menu {
        background: #091827 !important;
    }

    .no-borderimage .bordered-box h3 {
        background: #091827 !important;
    }

    .flag_count {
        background: #091827 !important;
    }

    div.vis {
        border: 1px solid #666666;
    }

    .lit .lit-item {
        background: #394E63 !important;
    }

    .vis .row_a>td,
    .vis.alternating tr:nth-child(2n) td,
    .vis .row_a>tr>td {
        background: #394E63 !important;
    }

    .vis .row_b>td,
    .vis.alternating-rows tr:nth-child(2n+1) td,
    .vis .row_a>tr>td {
        background: #394E63 !important;
    }

    #footer,
    #footer a {
        color: #FFFFFF;
    }

    #footer {
        border-top: 2px solid #666666;
        background: #21354C;
    }

    #.village-item {
        background: #394E63;
    }

    .village-note {
        background-color: #394E63;
        border: 1px solid #666666;
    }

    .village-note-head {
        border-bottom: 1px solid #666666;
    }

    .forum-content {
        background: #21354C;
        border: 1px solid #666666;
    }

    .forum {
        background: #394E63;
        border: 1px solid #666666;
    }

    .selected,
    .selected td {
        background: #394E63 !important;
        border: 1px solid #666666 !important;
    }

    .post {
        border: 1px solid #666666;
        background-color: #394E63;
    }

    .quote .quote_message {
        background-color: #21354C;
        font-size: 9pt;
    }

    .igmline {
        background: #091827;
        border-bottom: 1px solid #666666;
    }

    .chat-message a {
        color: #FF5100 !important;
    }

    .chat-button {
        background-image: url(https://i.imgur.com/lZwekB3.png);
    }

    .chat-typing-indicator {
        background: url(https://i.imgur.com/lZwekB3.png) -48px -16px;
    }

    .chat-contact-group-header span:before {
        background: url(https://i.imgur.com/lZwekB3.png);
    }

    .order-progress,
    .mass-progress {
        border: 1px solid #666666;
    }

    .docked-notebook {
        background: #21354C;
        border: 1px solid #666666;
    }

    .list-item.b {
        background-color: #394E63;
    }

    .list-item.a {
        background-color: #21354C;
    }

    .widget-tabs {
        color: #FFFFFF;
        background: #21354C;
        border-bottom: 1px solid #666666;
    }

    .widget-tabs li a {
        background-color: #394E63;
    }

    .village-item {
        border-bottom: 1px solid #666666;
        background-color: #394E63;
    }

    .village-item:hover {
        background-color: #394E63;
    }

    .target-input {
        border: 1px solid #666666;
    }

    .warn_90 {
        color: #cf0016;
    }

    #plunder_list_filters {
        background: #394E63 !important;
    }

    .borderimage .popup_box {
        border-image: url("http://1x1px.me/FFFFFF-0.png ") 19 19 19 19 repeat;
        border: 3px solid #666666;
    }

    .world_button_active:hover {
        background: #21354C;
        color: white;
    }

    .world_button_active {
        background: #394E63;
        border: 1px solid #666666;
        color: white;
    }
    .world_button_inactive:hover {
        background: #394E63;
        color: white;
    }

    .world_button_inactive {
        background: #21354C;
        border: 1px solid #666666;
        color: white;
    }
    .popup_style {
        border-color: #666666;
        background: #394E63;
    }

    .popup_content {
        background: #394E63;
    }

    .popup_box_content {
        background: #21354C;
    }

    .info_box {
        border: 1px solid #666666;
        background: #21354C;
    }

    .map_container,
    #warplanner {
        background: #394E63 !important;
        border: 1px solid #666666 !important;
    }

    .map-legend-container table {
        border: solid 1px #666666 !important;
        background-color: #394E63 !important;
    }

    #map_coord_y_wrap,
    #map_coord_x_wrap {
        background-color: black;
    }

    .overview_table .nohover {
        background: #394E63;
    }

    #topdisplay:hover {
        background: #394E63;
    }

    .quest:hover {
        background-color: #394E63;
    }

    .item_container .item:hover,
    .item_container .item.active {
        background: #394E63;
    }
    .lit2 .lit-item {
        background-color: #21354C;
    }
    .lit2 .lit-item:hover {
        background-color: #394E63;
    }
    .ui-autocomplete {
        background-color: #21354C;
    }
    #skill_book_knight_selection .knight:hover {
        background-color: #394E63;
    }
    div.memo-tab {
        border: 1px solid #666666;
    }
    div.memo-tab-selected {
        background: #394E63;
    }
    #memo-add-tab-button {
        border: 1px solid #666666;
    }
    .tooltip-style {
        border-color: #666666;
        background: #21354C
    }
    .award-group-head {
        background: #091827;
        border: 1px solid #666666;
    }
    .award-group-content {
        background: #091827;
    }
    .award-group-foot {
        background: #091827;
    }
    .fake-browser-notification {
        background: #091827;
        border: 1px solid #666666;
    }
    .warn {
        color: #DC0000 !important;
    }
    .maincell > .info_box {
        background: url('https://dsde.innogamescdn.com/asset/a5b5e15d/graphic/questionmark.png') no-repeat 4px center !important;
    }
    .inventory_items {
        border: 1px solid #666666;
        background: #21354C;
    }
    .item_container .item {
        border: 1px solid #666666;
        background: #394E63;
    }
    .item_container {
        border: 1px solid #666666;
        background: #394E63;
    }
    .inventory_search {
        background: #394E63;
        border: 1px solid #666666;
    }
    .side-notification {
        background: #21354C !important;
        border-left: 1px solid #666666 !important;
        border-top: 1px solid #666666 !important;
    }
    .inventory_detail {
        border: 1px solid #666666;
        background: #394E63;
    }
    .detail_section {
        padding: 5px;
        border-bottom: 1px solid #666666;
    
    {
    .unit_input_spear
        background: #394E63;
    

    }
    .vis td, .vis_item {
        color: #51677d;

    }
    .td {
        color: #51677d;

    }
    .warn {
        color: #8f0222 !important;

    }

    .btn, .btn-default {

    background: linear-gradient(to bottom, #2b324e 0%,#080442 22%,#000 30%,#475e83 100%);
    color: #9baaba;


    }
    .inactive, .inactive:hover {

        color: #7D623B;

    }
    .quickbar_link {

        color: #9EAAB7;

    }
    .nowrap {

        color: #9EAAB7;

    }
    .ui-sortable {

        color: #9EAAB7;

    }
    .trainqueue_wrap_barracks {

        color: #9EAAB7;

    }
    .btn-build.current-quest {background: url("https://dsde.innogamescdn.com/asset/a5b5e15d/graphic/btn/buttons.png") no-repeat 3px 1px,#0bac00;

        background: url("https://dsde.innogamescdn.com/asset/a5b5e15d/graphic/btn/buttons.png") no-repeat 3px 1px,linear-gradient(to bottom, #0c7505 0%,#0b5d1766 100%);

    }
    .vis, .nowrap {

        color: #9EAAB7;

    }

    a {
        color: #95A1B4;
    }

    body {

        color: #95A1B4;
    }

    #footer, #footer a {

        color: #95A1B4;

    }

   .box-item {

        color: #299E33;
}

`);
})();