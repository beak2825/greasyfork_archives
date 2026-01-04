// ==UserScript==
// @name         Forum MIUIPolska.pl - czarny tryb
// @namespace    https://github.com/kacskrz/miuipolska-dark-mode
// @version      1.0.1.4
// @description  Czarny motyw dla forum MIUIPolska.pl
// @author       Orjon (kacskrz@gmail.com)
// @match        *://miuipolska.pl/forum/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371679/Forum%20MIUIPolskapl%20-%20czarny%20tryb.user.js
// @updateURL https://update.greasyfork.org/scripts/371679/Forum%20MIUIPolskapl%20-%20czarny%20tryb.meta.js
// ==/UserScript==
GM_addStyle('body { background-color: #272222; color: #aba3a3;');
GM_addStyle('#ipsLayout_footer a, #ipsLayout_footer p { color: #dbdee0;');
GM_addStyle('.ipsBreadcrumb [data-action="defaultStream"], .ipsBreadcrumb [data-action="markSiteRead"] { color: #f0f1f3;');
GM_addStyle('.fa { color: #fff;');
GM_addStyle('.ipsBreadcrumb > ul > li > a { color: floralwhite;');
GM_addStyle('.ipsAreaBackground_reset { background: #2f2e2e;');
GM_addStyle('a { color: #dee1e2;');
GM_addStyle('.ipsStreamItem_snippet .ipsType_richText { color: #b3b1b1;');
GM_addStyle('.ipsNavBar_secondary > li.ipsNavBar_active a { color: #d5d8da;');
GM_addStyle('.ipsNavBar_secondary > li > a { color: rgba(203, 205, 206, 0.63);');
GM_addStyle('.ipsType_pageTitle { color: #e0dddd;');
GM_addStyle('.ipsNavBar_secondary { background: #272727;');
GM_addStyle('#ipsLayout_header nav { background: #444444;');
GM_addStyle('.ipsBox:not( .ipsBox_transparent ):not( .ipsModerated ) { background-color: #211f1f;');
GM_addStyle('.ipsNavBar_primary:not( .ipsNavBar_noSubBars ) > ul:before { background: #272727;');
GM_addStyle('.ipsComment:not( .ipsModerated ) .ipsComment_header { background: #424242; border-top: 1px solid #4b4c4c;');
GM_addStyle('.ipsComment { background: #333232;');
GM_addStyle('.ipsType_richText { color: #dee1e2;');
GM_addStyle('.ipsApp .ipsButton_light { background: #737070; color: white;');
GM_addStyle('#cke_1_contents > div { background-color: #635e5e;');
GM_addStyle('.cMessage_active { background: #434e54;');
GM_addStyle('.ipsDataList.ipsDataList_zebra .ipsDataItem:not( .ipsDataItem_selected ):not( .ipsModerated ):not( .ipsDataItem_new ):not( .ipsDataItem_success ):not( .ipsDataItem_warning ):not( .ipsDataItem_error ):not( .ipsDataItem_info ):not( .ipsDataItem_status ):nth-child(even) { background: #3e3d3d;');
GM_addStyle('.ipsDataItem_unread { background: #423737;');
GM_addStyle('.ipsDataList_readStatus .ipsDataItem:not( .ipsDataItem_unread ):not( .ipsDataItem_selected ):not( .ipsModerated ) { background: #544343;');
GM_addStyle('.ipsMenu_headerBar, .ipsMenu_footerBar { background: #696868;');
GM_addStyle('.ipsType_sectionHead { color: #ded3d3;');
GM_addStyle('html[dir="ltr"] .cMessage { background: #544343;');
GM_addStyle('.ipsNavBar_secondary > li > a:hover { color: rgba(128, 136, 142, 0.8);');
GM_addStyle('.ipsBreadcrumb > ul > li { color: #e8dcdc;');
GM_addStyle('.ipsSpoiler, .ipsStyle_spoiler { background: #504c4c;');
GM_addStyle('.ipsQuote { background: #4a4747;');
GM_addStyle('.cke_wysiwyg_frame, .cke_wysiwyg_div > p { color: black;');
GM_addStyle('.ipsOnlineStatus, .ipsOnlineStatus_online { color: #249168;');
GM_addStyle('.ipsAreaBackground { background: #36393e;');
GM_addStyle('.ipsAreaBackground_light { background: #423e3e;');
GM_addStyle('.cke_top { background: #e2dcdc');
GM_addStyle('#elSearchExpanded .ipsMenu_title { background: #292525;');
GM_addStyle('#elSearchExpanded {background: #444;');
GM_addStyle('#elSearchExpanded .ipsSideMenu_list { background: #3a3030;');
GM_addStyle('.ipsTabs_panel { background: #2f2e2e;');
GM_addStyle('.cProfileSidebarBlock.ipsLeaderboard_trophy_1 { color: #ffffff;');
GM_addStyle('.ipsDialog_content { background: #544b4b;');
GM_addStyle('hr.ipsHr { border-color: rgba(0, 0, 0, 0.18);');
GM_addStyle('.ipsDialog_close { color: #ccc2c2;');
GM_addStyle('.cPost.ipsModerated, .cPost.ipsModerated .cAuthorPane { background: #676465;');
GM_addStyle('.ipsModerated { background: #676465; color: #e0c9d5;');
GM_addStyle('.ipsModerated a { color: #e0c9d5;');
GM_addStyle('.ipsModerated .ipsType_light { color: #c7bcc2;');
GM_addStyle('.ipsApp .ipsButton_link.ipsFollow, .ipsApp .ipsButton_link.ipsPromote { background: #272222;');
GM_addStyle('.ipsFollow .ipsCommentCount { background: #f1c2c2;');
GM_addStyle('.ipsRepBadge_positive, .ipsRepBadge_positive:hover { color: #b9d89e;');
GM_addStyle('.ipsHovercard { background: #423e3e;');
GM_addStyle('.cPastLeaders_title span { background: #2f2e2e;');
GM_addStyle('.cPastLeaders_cell { background: #191616;');
GM_addStyle('.cPastLeaders_cell:after { color: #fff; opacity: 0.4;');
GM_addStyle('.ipsDialog_title { color: #fff; background: #060606;');
GM_addStyle('.ipsDialog_title ~ .ipsHr { margin: 1px 15px 0 15px;');
GM_addStyle('body[data-role="internalEmbed"] { background: #251e1e;');
GM_addStyle('.ipsApp .ipsDataItem_new, .ipsApp .ipsDataItem_success { background-color: #544343;');