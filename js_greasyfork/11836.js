//
// Written by Glenn Wiking
// Script Version: 1.2.2d
// Date of issue: 06/12/14
// Date of resolution: 28/08/15
//
// ==UserScript==
// @name        ShadeRoot Facebook
// @namespace   SRFB
// @description Eye-friendly magic in your browser for Facebook
// @version     1.2.2d
// @icon        http://i.imgur.com/y5uD7fi.png

// @include        http://*.facebook.*
// @include        https://*.facebook.*

// @downloadURL https://update.greasyfork.org/scripts/11836/ShadeRoot%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/11836/ShadeRoot%20Facebook.meta.js
// ==/UserScript==

function ShadeRootFB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootFB(
  'body {background: none repeat scroll 0% 0% #080C15;}'
  /*+
  '.share_action_link:after {content:"ete" !important;}'*/
  +
  '._li, ._2-d1 {background: rgba(8, 12, 21, 1) !important;}'
  +
  '._2-d1 li a {border-left-color: rgba(158, 190, 230, 1) !important; color: rgba(62, 117, 192, 1) !important;}'
  +
  '._2-d1 ._3rrn > a {border-left-color: rgba(58, 103, 198, 1) !important; color: rgba(10, 86, 185, 1) !important;}'
  +
  '._4f7n, ._2s1x ._2s1y {background-image: -moz-linear-gradient(center bottom , rgba(26, 54, 114, 1), rgba(14, 72, 147, 1)) !important;}'
  +
  '.fbChatSidebarBody {background-color: rgba(21, 63, 137, 1) !important;}'
  +
  '._5pr2 .fbChatOrderedList ._42fz a:hover {background-color: rgba(60, 87, 165, 1) !important; border-color: rgba(45, 74, 159, 0.52) !important; box-shadow: 1px 0px 0px rgba(21, 39, 74, 1) inset !important;}'
  +
  '#fbTimelineHeadline .profilePic {background-color: rgba(29, 90, 215, 1) !important; border: 4px solid rgba(23, 64, 147, 1) !important;}'
  +
  '.fbTimelineSectionTransparent {background-color: #080C15 !important;}'
  +
  '._42fz a {color: rgba(147, 171, 237, 1) !important;}'
  +
  '._5vb_, ._5vb_ #contentCol {background-color: rgba(19, 32, 71, 1) !important;}'
  +
  '._4-u8 {background-color: rgba(26, 53, 108, 1);}'
  +
  '._4-u2, ._la, ._5vb_ ._5pr2.fbChatSidebar, .fbCalendar ._5pr2.fbChatSidebar, ._1t4w ._5pr2.fbChatSidebar, .timelineLayout ._5pr2.fbChatSidebar {border-color: rgba(45, 68, 143, 1) rgba(30, 62, 128, 1) rgba(21, 39, 110, 1) !important;}'
  +
  '._5v3q ._5pcp, ._5v3q ._5pcp a.uiLinkSubtle, ._5v3q ._5ptz, ._5v3q a._5pcq {color: rgba(113, 142, 200, 1);}'
  +
  '._18--, ._5t_y ._1dsp, ._5t_y ._1dsl {border-bottom: 1px solid rgba(28, 35, 50, 1); border-color: rgba(32, 56, 108, 1) !important;}'
  +
  '._59ap ._2r3x > ._ohe, ._la {background: rgba(18, 69, 135, 1);}'
  +
  'body .hasLeftCol {background: rgba(14, 68, 129, 1);}'
  +
  '._sg1 {background-color: #628bdd; border-left: 1px solid #3a64b9; color: #365899;}'
  +
  '.smurfbarTopBorder, .smurfbarBottomBorder, .uiSearchInput .inputtext, #fbpoptsdiv input, #fbpoptsdiv select, #fbpoptsdiv textarea {background: rgba(75, 149, 222, 1) !important; color: #DDE !important;}'
  +
  '.uiSearchInput {background: #4B95DE;}'
  +
  '._5vb_, ._5vb_ #contentCol, ._545p, ._4p23, ._54nh {color: rgba(173, 189, 234, 1) !important;}'
  +
  '._5pbx a, .userContent a, ._6m6 a, .js_9 a, .profileLink a, .fwb a, .fcg a, ._2dpb {color: rgba(57, 143, 255, 1);}'
  +
  '._55d0, ._5t_y ._1dsp._42jz {background-color: rgba(26, 80, 152, 1) !important;}'
  +
  '._5t_y ._1dsl li:after {background: rgba(67, 99, 135, 1) !important;}'
  +
  '._2jq5 {border-left: 1px solid #436387;}'
  +
  '.fbNub._50mz .titlebar .titlebarText, .fbNub._50mz.highlightTab .fbNubButton .name, .fbNub._50mz.highlightTab .fbNubButton, .fbNub._50mz.focusedTab .fbNubButton .name {color: #6693e3 !important;}'
  +
  '.litestandClassicWelcomeBox.fbxWelcomeBox a, .litestandClassicWelcomeBox.fbxWelcomeBoxSmall a, ._bui ._5afe, ._bui .subitem, ._519b ._9lb, ._4l4 a, ._4l5 a, .UFILikeLinkIcon span, ._2ezy, ._50nd ._50nc, ._50ne ._50nc {color: rgba(57, 143, 255, 1);}'
  +
  '.uiHeaderSection, .uiSideHeader {border-top: 1px solid #436387;}'
  +
  '._5vb_ ._dcs {box-shadow: 0px 0px 0px 1px rgba(34, 95, 186, 0.25) inset, 0px 1px 1px rgba(24, 117, 195, 0.05);}'
  +
  '._6m2 {background-color: #124587;}'
  +
  '._517h, ._59pe:focus, ._59pe:hover, ._517h._42fr:active, ._517h._42fr._42fs, .ego_action a button, .action a {border-color: rgba(28, 107, 174, 1) rgba(33, 87, 195, 1) rgba(20, 68, 165, 1) !important; color: #4E5665 !important; text-shadow: 0px 1px 0px rgba(168, 209, 239, 1);}'
  +
  '._5pcp._4l4 ._4l5 a {color: #2683FF !important;}'
  +
  '._558b ._54ng {background-color: #2E5493; border: 1px solid #2E5493; box-shadow: 0px 3px 8px #2E5493;}'
  +
  '._558b ._54nc {border-color: #2E74C3;}'
  +
  '._558b ._54ak {border-bottom: 1px solid rgba(39, 80, 162, 1);}'
  +
  '._2iwq div {background-color: #124587 !important;}'
  +
  '._5vb_ ._dcs .__c_, ._5vb_ ._6l- {background-color: #124587;}'
  +
  '._la {background: #1A356C; border-left: 1px solid rgba(31, 78, 158, 1); border-right: 1px solid rgba(33, 76, 173, 1);}'
  +
  '._18s5, ._4kt > li {border-bottom: 1px solid rgba(3, 66, 161, 1); border-color: rgba(3, 66, 161, 1);}'
  +
  '._5v3q ._5mxv {border-top-color: #2D448F !important;}'
  +
  '._1ui8 div {border-bottom: 1px solid #2D448F !important;}'
  +
  '._5va1 {border: 1px solid rgba(37, 87, 162, .8) !important;}'
  +
  '._4jy0, ._59pe:focus, ._59pe:hover {background-color: rgba(27, 111, 195, 1);}'
  +
  '._5pr2 ._4oes:after, ._5pr2 ._4oes, ._51mz, .uiGrid tbody, ._51mx {background-color: rgba(24, 99, 173, 1);}'
  +
  '._51m- a {background-color: rgba(34, 94, 162, 1); color: rgba(69, 126, 255, 1); text-shadow: none;}'
  +
  '._5vb_ ._5pr2 ._4oes, ._5vb_, ._5pr2, ._5q83, ._5pr2 ._4oes:after {background-color: rgba(14, 66, 125, 1); border-top: 1px solid rgba(16, 80, 192, 0.25);}'
  +
  '._5pr2 .fbSidebarGripper ~ .fbChatSidebarBody:before {border-bottom: 1px solid rgba(28, 88, 194, 1);}'
  +
  '.fbChatSidebar ._51x_, .fbChatSidebar ._51x- {background-color: #132047 !important;}'
  +
  '._5vb_ ._5pr2.fbChatSidebar, .fbCalendar ._5pr2.fbChatSidebar, ._1t4w ._5pr2.fbChatSidebar, .timelineLayout ._5pr2.fbChatSidebar {background-color: rgba(35, 67, 164, 1); box-shadow: 1px 0px 0px rgba(35, 70, 192, 1) inset;}'
  +
  '.timelineLayout ._5pr2 ._4oes, .fbCalendar ._5pr2 ._4oes, ._1t4w ._5pr2 ._4oes, ._5vb_ ._5pr2 ._4oes {background-color: rgba(13, 67, 149, 1);}'
  +
  '._la {background-color: #1A356C; border-left: 1px solid rgba(15, 73, 171, 1); border-right: 1px solid rgba(15, 73, 171, 1);}'
  +
  '._51mx {background-color: #1A356C;}'
  +
  '._558b ._54nc {border-style: none;}'
  +
  '._5pr2 ._4oes:after {background-color: #153F89;}'
  +
  '._5qqe {background: none repeat scroll 0% 0% #153F89 !important;}'
  +
  '.linkWrap span, .noCount span {color: rgba(80, 138, 239, 1);}'
  +
  '._42ft, ._4jy0, ._55pi, ._5vto, ._55_p, ._2agf, ._4jy3, ._517h, ._51sy, .ego_action a button, ._5ymq a button, .gecko ._4jy0:focus {background-color: #47639E !important; color: #DDE; text-shadow: none;}'
  +
  '._42ft, ._4jy0, ._11b, ._4jy3, ._4jy1, .selected, ._51sy {}'
  +
  '._517h, ._59pe:focus, ._59pe:hover, ._517h._42fr:active, ._517h._42fr._42fs, .ego_action a button {border-color: #1C6BAE #2157C3 #1444A5; color: rgba(225, 235, 255, 1); text-shadow: 0px 1px 0px rgba(15, 75, 119, 1);}'
  +
  '._5vb_ ._55y4 ._bui ._5afe:hover, ._5vb_ ._55y4 ._bui ._5afe:focus, ._5vb_ ._55y4 ._bui ._5afe:active, ._5vb_ ._55y4 ._bui ._5afd ._5afe {background-color: rgba(39, 70, 149, 1);}'
  +
  '._5pr2 ._4oes:after {background: none repeat scroll 0% 0% #153F89;}'
  +
  '._1ht9 {background-color: #153F89 !important;}'
  +
  '._1ht9 {background: none repeat scroll 0% 0% rgba(19, 92, 164, 1) !important; border-left: 1px solid rgba(18, 95, 182, 1) !important; box-shadow: 1px 0px 0px rgba(1, 51, 140, 1) inset !important;}'
  +
  '._5pr2 .fbSidebarGripper ~ .fbChatSidebarBody:before {border-bottom: 1px solid #153F89 !important;}'
  +
  '.generic_dialog_modal, .generic_dialog_fixed_overflow {background-color: rgba(10, 27, 45, 0.9);}'
  +
  '.pop_content .dialog_buttons {background: none repeat scroll 0% 0% rgba(33, 59, 104, 1);}'
  +
  '.pop_content .dialog_body {border-bottom: 1px solid rgba(17, 74, 129, 1);}'
  +
  '.pop_container_advanced {background: none repeat scroll 0% 0% rgba(14, 44, 89, 0.7);}'
  +
  '.fbIndex .gradient {background: linear-gradient(rgba(15, 44, 81, 1), rgba(4, 12, 26, 1)) repeat scroll 0% 0% transparent;}'
  +
  '.loggedout_menubar_container {background-color: rgba(10, 48, 105, 1);}'
  +
  '.loggedout_menubar .fb_logo:after {content: "Nightly"; position: relative; left: 11.5em; top: -.2em;}'
  +
  '.copyright div span:after {content: " - Shaderoot theme by CodeWiking"}'
  +
  '._6wl {background: linear-gradient(rgba(54, 114, 173, 1), rgba(19, 68, 125, 1)) repeat scroll 0% 0% rgba(78, 129, 167, 1); box-shadow: 0px 1px 1px rgba(136, 179, 227, 1) inset; border-color: rgba(34, 72, 110, 1) rgba(34, 78, 110, 1) rgba(21, 47, 81, 1);}'
  +
  '.fcb, ._2e9n, ._4-xi, ._5p3j {color: rgba(53, 130, 216, 1);}'
  +
  '._5iyx, ._52lp._59d- ._52lr, ._58mr {color: rgba(21, 93, 174, 1);}'
  +
  '._58mf ._58mg, .inputtext, .inputpassword, #u_0_c span select {border-color: rgba(17, 68, 155, 1) !important; background: rgba(18, 57, 117, 1) !important; color: #BBC !important;}'
  +
  '#u_0_c span select {border: 1px solid #11449B !important;}'
  +
  '._58mt {color: #3582D8;}'
  +
  '.uiScaledImageContainer, ._6m5, .fbStoryAttachmentImage, .img, .scaledImageFitWidth, ._bsl._3htz, ._ox1, .swfObject {opacity: .9 !important;}'
  +
  '._5h55 div, ._1ui5 div {border-bottom: 1px solid rgba(18, 66, 128, 1) !important;}'
  +
  '.fbRemindersTitle, .fbRemindersTitle strong {color: #BBC !important;}'
  +
  '#pageFooter div table tbody tr._51mx {background-color: #1A356C !important;}'
  +
  '._51m- a {background-color: #1A356C;}'
  +
  '._2d14 {background-color: #080C15;}'
  +
  '._5x_7 {border-color: rgba(30, 63, 162, 1);}'
  +
  '._2e9n, ._4-xi {border-bottom: 1px solid rgba(35, 65, 141, 1);}'
  +
  '._p0k ._5hzs {border-top: 1px solid rgba(35, 65, 141, 1);}'
  +
  '._4-u2, ._5x_7 {border-color: #2D448F #1E3E80 #15276E !important; border: none;}'
  +
  '#contentCurve {border-bottom: 1px solid rgba(20, 53, 90, 1);}'
  +
  '.uiSearchInput span {padding: none;}'
  +
  '._5afe:hover, ._5r-_ .fbReminders .fbRemindersStory:hover {background-color: rgba(9, 53, 119, 1);}'
  +
  '.linkWrap span, .noCount span {color: rgba(49, 114, 226, 1) !important;}'
  +
  '._5qqe {background: none repeat scroll 0% 0% #1A356C !important;}'
  +
  '._42fu, ._42gx:focus, ._42gx:hover, ._4jy0, ._59pe:focus, ._59pe:hover {border-color: rgba(29, 96, 195, 1) rgba(18, 82, 164, 1) rgba(6, 63, 162, 1); background-image: none;}'
  +
  '._3q96 {background-color: #1A356C !important; border-color: rgb(24, 89, 162) !important;}'
  +
  '.UFIShareLink, .UFIShareLink span, .UFIPagerLink, .UFIPagerLink span, .mbs, .mbs a, ._6m6, ._6m6 a {color: #BBC !important;}'
  +
  '._5kyp .action a {border-color: rgba(18, 101, 171, 1) !important;}'
  // DROPDOWN UI
  +
  '.uiTypeaheadView .bucketed .header {background-color: #1A356C;}'
  +
  '.uiTypeaheadView .bucketed .header .text, .recentSearchEditLink {color: rgba(78, 154, 240, 1) !important;}'
  +
  '.uiTypeaheadView ul {background: none repeat scroll 0% 0% #1A356C;}'
  +
  '.uiTypeaheadView li {border-color: rgba(11, 37, 84, 1);}'
  +
  '.recent a span, .recent span, ._5h55 ._1ui7 {color: rgba(81, 160, 249, 1);}'
  +
  '.roundedBox .uiTypeahead {background-color: #4B95DE !important;}'
  +
  '._5pr2 ._4oes:after, .uiGrid, ._51mz, ._51x_ table {background-color: #153F89 !important;}'
  +
  '.__wu ._539-.roundedBox .uiSearchInput button {background-position: -1px -1322px;}'
  +
  '.Friendbutton button, .FriendRequestAdd, .addButton {background-image: none;}'
  +
  '.UFIList, .UFIRow, .UFIComment, .UFIComponent {background-color: #1A356C}'
  +
  /**/'h1, h2, h3, h4, h5, h6, textarea, .uiHeader h2 a, h1 a, h3 a, ._6a div a, ._6-7, .fbTimelineUnit, ._2-s, ._6-7, ._42us div a, .uiButtonText, .uiButton input, ._1sdd:hover, ._1sdd, ._33e, ._33d, ._33c, ._34e, ._c24, ._5h55 ._1ui6, ._51m- a, .uiHeader h2, .facade_text, ._5p3y[dir="ltr"] td, .seeMore span, ._5p3y[dir="ltr"] {color: #BBC !important;}'
  +
  '._3nzk ._3nzq ul li {border-bottom: 1px solid #1C2332;}'
  +
  '.__tw .jewelHeader {background-color: #1A346B;}'
  +
  '.uiScrollableAreaWithTopShadow.contentBefore:before, .uiScrollableAreaWithShadow.contentAfter:after {background-color: #254D9F;}'
  +
  '._3nzk .fbRequestList .listGray {background-color: #1A356C;}'
  +
  '._1y2l .jewelContent a.messagesContent {border-bottom: 1px solid rgba(28, 78, 165, 1); border-top: 1px solid rgba(6, 25, 57, 1);}'
  +
  '._5pr2.fbChatSidebar {background-color: #153F89 !important; border-left-color: #153F89 !important;}'
  +
  '.phl {background: #1A356C;}'
  +
  '._5i-8 {border-bottom: 1px solid rgba(25, 81, 144, 1);}'
  +
  '._5i-7 {background-color: rgba(14, 92, 168, 1);}'
  +
  '._30d {background-color: #1A356C; border-color: rgba(26, 82, 200, 1);}'
  +
  '._5m65 {border-color: rgba(26, 82, 200, 1);}'
  +
  '._5ewi ._5mtx {border-bottom: 1px solid rgba(16, 56, 125, 1); color: #BBC;}'
  +
  '.uiHeaderTopAndBottomBorder {border-bottom: 1px solid #254D9F;}'
  //+
  //'.clearfix, .pas {background-color: #124587;}'
  +
  '.__tw .jewelFooter a {background-color: rgba(42, 105, 168, 1); border-top: 1px solid rgba(53, 114, 206, 1);}'
  +
  '.__tw .jewelFooter a:hover, .__tw .jewelFooter a:active, .__tw .jewelFooter a:focus {background-color: rgba(42, 75, 138, 1); border-top: 1px solid rgba(53, 114, 186, 1);}'
  +
  'a._1d9n, ._1y2l .author, ._1y2l a.messagesContent:hover .author, ._1y2l a.messagesContent:hover .author span, ._1y2l .subject, ._1y2l a.messagesContent:hover .subject {color: #2483FF !important;}'
  +
  '._4ks > li {border-color: #254D9F;}'
  +
  '.uiList, ._4kg {background-color: #1A356C;}'
  +
  '.__tw .jewelHeader, ._3nzp .uiScrollableArea.contentAfter, ._3nzk li {border-bottom: 1px solid rgba(29, 73, 150, 1); border-color: rgba(29, 73, 150, 1) !important;}'
  +
  '.__tw {background: none repeat scroll 0% 0% #1A356C; border: 1px solid #235198; box-shadow: 0px 3px 8px #1A356C;}'
  +
  '._5vb_ ._5pr2.fbChatSidebar, .fbCalendar ._5pr2.fbChatSidebar, ._1t4w ._5pr2.fbChatSidebar, .timelineLayout ._5pr2.fbChatSidebar, ._33c, ._4af {background-color: #153F89; box-shadow: 1px 0px 0px rgba(27, 78, 182, .5) inset;}'
  +
  '._4af ._33e {background: none repeat scroll 0% 0% #164D8C; border-color: rgba(45, 88, 173, 1);}'
  +
  '._4af ._33e:hover, ._4af:hover ._33e {background: none repeat scroll 0% 0% #162D6C; border-color: rgba(45, 78, 153, 1);}'
  +
  '._3nzl ._3nzk .hasPYMK, ._3nzl ._3nzk .friendConfirmedNotifsUnitDisaggregated, ._3nzl ._3nzk .friendConfirmedNotifsUnitAggregated, ._3nzl ._3nzk ._3nzm ._3nzn {border-bottom: 1px solid rgba(24, 75, 150, 1);}'
  +
  '.uiHeader h3, .uiHeader h4, .uiHeader h5, .fwb {color: rgba(104, 175, 255, 1);}'
  +
  '._5pcm {border-left: 2px solid #1C2332;}'
  +
  'div.uiTypeaheadView li.calltoaction, div.uiTypeaheadView li.browseUpsell, ._33c:hover ._33e, ._33c ._33e:focus, ._9ot:hover {background: none repeat scroll 0% 0% #1A356C; border-bottom: medium none rgba(8, 43, 131, 1); border-color: rgba(14, 52, 149, 1);}'
  +
  '.uiTypeaheadView .search .text {color: rgba(80, 120, 255, 1);}'
  +
  '.uiTypeaheadView .bucketed .header {border-top: 1px solid #103E79;}'
  +
  '._33c {border-bottom: 1px solid rgba(9, 50, 113, 1);}'
  +
  '._1y2l li a.messagesContent:hover {background-color: rgba(24, 72, 146, 1);}'
  +
  '._kj3 {background: #1A356C; border: 1px solid rgba(22, 69, 147, 1);}'
  +
  '._417c {border-bottom: 1px solid rgba(22, 62, 144, 1);}'
  +
  '._z6j {background-color: #1A356C; border: 1px solid rgba(20, 63, 135, 1);}'
  +
  '._5ep8 {background: rgba(17, 80, 152, 1);}'
  +
  '._4-i2, ._5a8u, ._4-i0 {background-color: #0D4099;}'
  +
  '._5lnf {border-top: 1px solid rgba(15, 40, 104, 1);}'
  +
  '._4-i0 {border-bottom: 1px solid rgba(15, 40, 104, 1);}'
  +
  '.uiBoxWhite {background-color: #1A356C; border: 1px solid rgba(13, 39, 72, 1);}'
  +
  '#create_frame .box {background-color: rgba(26, 101, 174, 1); border: 5px solid rgba(48, 70, 135, 1);}'
  +
  '#create_frame .facade {background-color: rgba(22, 61, 129, 1);}'
  +
  '#create_frame .box:hover .facade {background-color: rgba(30, 69, 149, 1);}'
  +
  '.uiTypeahead, .uiTypeahead .wrap {background: none repeat scroll 0% 0% #0E5CA8; border-color: rgba(7, 61, 153, 1);}'
  +
  '.uiSearchInput span {border-color: rgba(32, 96, 168, 1) -moz-use-text-color -moz-use-text-color;}'
  +
  '._552h {border-top: 1px solid rgba(17, 62, 126, 1) !important;}'
  /*+
  'u_jsonp_3_c {}'*/
  +
  '.uiTypeahead .uiSearchInput, .innerWrap .textInput {background-color: #4B95DE !important;}'
  +
  '#fbTimelineHeadline {background: none repeat scroll 0% 0% #1A356C;}'
  +
  '._6-d .fbTimelineSection {border: 1px solid rgba(28, 70, 140, 1);}'
  +
  '._6_7 {border-left: 1px solid rgba(46, 80, 183, 1);}'
  +
  '._6-6 {border-right: 1px solid #2E50B7 !important;}'
  +
  '._6-6:hover, ._6-7:hover, ._9rx.openToggler, ._9ry:hover, html ._9rw._54ne ._54nc {background: none repeat scroll 0% 0% rgba(9, 44, 89, 1);}'
  +
  '._5p3y .fsm, ._5p3y .uiHeader h3, ._5p3y .UFICommentContent ._5v47 {background: #1A346B !important;}'
  +
  '._5vb_ ._55y4 ._bui ._5afe:hover, ._5vb_ ._55y4 ._bui ._5afe:focus, ._5vb_ ._55y4 ._bui ._5afe:active, ._5vb_ ._55y4 ._bui ._5afd ._5afe {background-color: rgba(29, 51, 107, 1) !important;}'
  +
  'html ._mj ._1dsl {border-bottom-color: rgba(21, 50, 135, 1) !important;}'
  +
  '.fbTimelineCapsule .fbTimelineUnit[data-type="s"] .bottomBorder, .fbTimelineCapsule .fbTimelineUnit[data-type="s"] .topBorder {background-image: none;}'
  +
  'html ._4__g {border-color: #154199 rgba(23, 67, 141, 1) !important;}'
  +
  '._6dh ._1dsp {background-color: #1A356C; border-top-color: rgba(29, 61, 156, 1);}'
  +
  '._4lh .fbTimelineCapsule .timelineUnitContainer {border-left: 1px solid rgba(15, 57, 128, 1); border-right: 1px solid rgba(15, 57, 129, 1);}'
  +
  '.fbTimelineStickyHeader .back {background-color: #1A356C !important; border-color: -moz-use-text-color rgba(26, 72, 123, 1) rgba(20, 84, 167, 1) !important;}'
  +
  '.uiButtonGroup .buttonItem .uiButtonOverlay, .uiButtonGroup .buttonItem .uiButtonOverlay:hover, .uiButtonGroup span .uiButtonOverlay, .uiButtonGroup span .uiButtonOverlay:hover {background-image: none; background-color: #47639E;}'
  +
  '.uiButtonGroup .uiButtonGroupItem {border-color: rgba(25, 97, 179, 1);}'
  +
  '.uiButtonGroup span .uiButtonOverlay:active, .uiButtonGroup span .uiButtonOverlay:focus, .topBorder, .bottomBorder {background-image: none !important;}'
  +
  '._4lh .timelineReportContainer {background: none repeat scroll 0% 0% rgba(3, 34, 104, 1);}'
  +
  '._4lh .timelineReportContainer, ._4lh .fbTimelineCapsule .timelineUnitContainer {border-left: 1px solid #113F8D; border-right: 1px solid #113F8D;}'
  +
  '._596n, ._54j8 {background-color: rgba(0, 31, 69, 1); border-color: #1E3D7A #1E3D7A #1E3D7A !important;}'
  +
  '._4jul ._ph5, ._52c6._52c6 {border-color: rgba(34, 61, 141, 1) rgba(64, 86, 152, 1) !important;}'
  +
  '._5vsj .UFIRow.UFIFirstComponent, ._5vsj .UFIShareRow, ._5vsj .UFILikeSentence, ._5vsj .UFIFirstCommentComponent {border-top: 1px solid rgba(14, 64, 114, 1);}'
  +
  '._5vsj .UFIRow {background-color: #1A346B !important;}'
  +
  '._1ln2 .uiList > li {border-color: #032268 !important;}'
  +
  '.escapeHatchMinimal {background-color: #1A356C !important;}'
  +
  '.UFICommentBody span, ._5vsj, ._5vsj._5vsj._5vsj, .UFICommentActorName span, ._4b0e div a {color: #BBC;}'
  +
  '._502f .rhcFooterWrap, ._502f .rhcFooterWrap a {text-shadow: 0px 1px rgba(26, 90, 174, .8) !important;}'
  +
  '._5vsj .UFIAddComment .UFIAddCommentInput, ._5vsj .UFIAddComment .UFIAddCommentInput._1osc {border-color: rgba(22, 56, 141, 1); background: #4B95DE !important; color: #BBC !important;}'
  +
  '._5108 .addFriendText, ._5108 .FollowLink {color: #BBC !important;}'
  +
  '._6l-:after {border: 1px solid rgba(8, 62, 123, 1);}'
  +
  '._dcs .__c_:after, ._dcs:hover ._52c6 {border-color: rgba(18, 92, 189, 1) rgba(14, 78, 161, 1) rgba(8, 78, 156, 1);}'
  +
  '._5vg {border-bottom: 1px solid #1A356C !important; border-top: 1px solid #1A356C !important;}'
  +
  '._5vf h3.uiHeaderTitle, ._5vf .uiHeaderActions {background-color: #1A356C;}'
  +
  '._5vf h3.uiHeaderTitle, ._5vf .uiHeaderActions a {color: #BBC; text-shadow: 0px 1px 0px rgba(16, 66, 116, 1) !important;}'
  +
  '._538q {border: 1px solid rgba(24, 90, 191, 1) !important;}'
  +
  '._2i12 ._gx7, ._5dtt ._gx7 {color: rgba(88, 137, 243, 1) !important;}'
  +
  '._1zw4, ._18dl, article div {background-color: rgba(13, 94, 173, 1) !important; border-left: 1px solid rgba(26, 65, 162, 1) !important; border-right: 1px solid rgba(20, 62, 168, 1) !important;}'
  +
  '._4lcc {border-top: 1px solid rgba(11, 37, 104, 1);}'
  +
  '._1zw6 ._1er_, ._8ff:hover {background-color: rgba(16, 72, 170, 1);}'
  +
  '._70l {background: none repeat scroll 0% 0% rgba(23, 69, 116, 1); border-bottom: 1px solid rgba(24, 53, 140, 1);}'
  +
  '._4lh ._51nc, ._4lh .timelineReportContainer .likeUnit {background: #1A346B;}'
  +
  '._4lh .likeUnit .likeUnitName {border-color: -moz-use-text-color rgba(67, 90, 158, 1) rgba(39, 56, 107, 1);}'
  +
  '.fbTimelineCapsule .timelineUnitContainer {background: none repeat scroll 0% 0% #1A346B;}'
  +
  'html ._4lh ._1zw6, ._5pwr:hover ._5pws, ._47__ ._5pws, ._3c_:hover ._3sz, ._3s- ._3sz, ._33hy ._554b:hover, ._4o52:hover ._3sz, ._3c- a {color: #BBC;}'
  +
  '._4lcc {border-top: 1px solid rgba(31, 64, 147, 1);}'
  +
  'html ._6-d .fbTimelineSection {border: 1px solid rgba(11, 61, 144, 1);}'
  +
  '._30v- {background-color: rgba(13, 66, 159, 1); border: 1px solid rgba(35, 118, 188, 0.8); box-shadow: 0px 0px 6px rgba(1, 43, 146, 0.6);}'
  +
  '._513x {background-image: none;}'
  +
  '._54nc li.selected {background-color: rgba(31, 64, 147, 1);}'
  +
  '._54nc li {background-color: rgba(31, 74, 167, 1);}'
  +
  '._3cz {background: none repeat scroll 0% 0% rgba(9, 32, 78, 1); border-bottom: 1px solid rgba(15, 55, 122, 1);}'
  +
  '._2w3 > ._30f {background: none repeat scroll 0% 0% rgba(16, 56, 140, 1); border: 1px solid rgba(6, 44, 108, 1);}'
  +
  '._4ms4 {border-left: 1px solid rgba(32, 77, 120, 1);}'
  +
  '._1qp6 .fbProfileBrowserListContainer .fbProfileBrowserListItem, html ._262m ._698 {border: 1px solid rgba(22, 86, 168, 1);}'
  +
  '.uiSearchInput button {background-color: #4B95DE;}'
  +
  '._3t3 {background: none repeat scroll 0% 0% rgba(18, 41, 89, 1); border-top: 1px solid rgba(14, 45, 96, 1);}'
  +
  '._3t3:hover {background: none repeat scroll 0% 0% rgba(25, 70, 116, 1);}'
  +
  '._33hy {background: none repeat scroll 0% 0% rgba(20, 69, 134, 1); border-top: 1px solid rgba(25, 63, 144, 1);}'
  +
  '._3c_:hover ._3sz, ._3s- ._3sz, ._33hy ._554b:hover, ._4o52:hover ._3sz, ._3c- a {color: #BCC;}'
  +
  '._3i9 {opacity: 0.8;}'
  +
  '._4_zu {background-color: #153F89 !important;}'
  +
  '._2i12 {border-top: 1px solid rgba(23, 67, 129, 1) !important; background: #1A346B !important;}'
  +
  '._1_cb {border-color: rgba(38, 96, 153, 1) rgba(56, 97, 177, 1) !important;}'
  +
  '._262m ._698, ._1qp6 .fbProfileBrowserListContainer .fbProfileBrowserListItem {border: 1px solid rgba(40, 91, 182, 1) !important;}'
  +
  '._14b9 ._r95, ._14b9 ._gx6 {border-color: -moz-use-text-color rgba(62, 98, 161, 1) rgba(30, 71, 132, 1);}'
  +
  '._12wb {background-color: rgba(9, 43, 113, 1) !important;}'
  +
  '._4ms4 {border-left: 1px solid rgba(27, 81, 177, 1) !important;}'
  +
  '._52bu ._3ow- {background-color: rgba(29, 77, 137, 1); border-bottom: 1px solid rgba(38, 76, 134, 1);}'
  +
  '._14b9 ._r95, ._14b9 ._gx6 {border-color: -moz-use-text-color rgba(34, 83, 168, 1) rgba(32, 68, 176, 1);}'
  +
  '._gx7, .fcb ._6nw._cf_ #globalContainer ._4_zv.fcb, ._4_zu ._4_zv.fcb, ._4bn5, ._5pws {color: #BBC;}'
  +
  '._58rn {background: none repeat scroll 0% 0% rgba(15, 24, 44, 1);}'
  +
  '._58s1 {background-color: #0F182C;}'
  //+
  //'._5vb2, #js_b {opacity: .6;}'
  +
  '._4psd {border: 1px dashed rgba(40, 106, 182, 1);}'
  +
  '._517h:active, ._517h._42fs, html ._6r5, html ._6r5 .wrap {border-color: rgba(9, 58, 143, 1) !important;}'
  +
  '._6-6 {color: #99A}'
  +
  'html {background-color: #080C15 !important}'
  +
  '._569t ._54ng {background-color: #225CA8 !important; border-color: rgba(23, 76, 110, 1) !important; color: #BBC !important; border-color: rgba(18, 79, 147, 1);}'
  +
  '._569t ._54ak {border-bottom: 1px solid rgba(19, 70, 137, 1);}'
  +
  '._58s1 {background-color: rgba(14, 34, 74, 1) !important;}'
  +
  '._58rn {background: rgba(14, 34, 74, 1) !important;}'
  +
  '._4psd {border: 1px dashed rgba(28, 113, 224, 1) !important;}'
  +
  '._42ft ._4jy0, ._4jy4 ._517h, ._51sy ._42fs {color: #BBC !important;}'
  +
  '.policiesPolicy {border: 1px solid rgba(17, 87, 155, 1);}'
  +
  '.policiesPolicy:hover {background-color: rgba(38, 62, 134, 1); border-color: rgba(37, 84, 183, 1);}'
  +
  '._5vb_, ._5vb_ #contentCol {background-color: rgba(20, 31, 66, 1);}'
  +
  '._5vb_ ._55y4 ._bui ._5afe:hover, ._5vb_ ._55y4 ._bui ._5afe:focus, ._5vb_ ._55y4 ._bui ._5afe:active, ._5vb_ ._55y4 ._bui ._5afd ._5afe {background-color: rgba(7, 54, 114, 1);}'
  +
  '._50mz .chatAttachmentShelf {background-color: rgba(19, 63, 153, 1); border-top: 1px solid #133F99;}'
  +
  'html ._5t_y ._2wr, html ._5p3y ._5t_y ._2wr {background-image: none !important;}'
  +
  '._55d0, ._5t_y ._1dsp._42jz {background-color: #1A356C !important;}'
  +
  '.nameText {color: #BBC !important;}'
  +
  '._53ij {background-color: #183B77 !important;}'
  +
  '._53ii ._53ij {box-shadow: 0px 0px 0px 1px rgba(9, 27, 50, 0.52), 0px 1px 10px rgba(18, 36, 69, 0.8) !important;}'
  +
  '._5pr2 ._4oes:after {background-color: #153F89 !important;}'
  +
  '.UFIReplyList {background-color: #1A356C !important;}'
  +
  '._4-u2 div, ._3oc7 div, ._4-u8 div {background-color: rgba(26, 53, 108, 0);}'
    +
  '._4-u8, ._4-u2 {background-color: rgba(26, 53, 108, 1) !important;}'
  +
  '._54b_ {border-bottom: 1px solid rgba(15, 33, 56, 1) !important;}'
  +
  '.actorImage .img, .actorImage img, ._1oyp img {opacity: .8 !important;}'
  +
  '._4h7j {background-color: #2E5493 !important;}'
  +
  '._42ft, ._4jy0, .layerCancel, .uiOverlayButton, ._4jy3, ._517h, ._51sy, ._4uuf {color: #BBC !important}'
  +
  '._1ln2 .uiList > li {border-color: rgba(12, 32, 92, 1) !important;}'
  // // // // // EXTRAS
  +
  '._5ugg, ._3z_5 {background-color: rgba(15, 94, 183, 1) !important; background-image: linear-gradient(rgba(49, 183, 236, 1), rgba(7, 117, 224, 1)) !important;}'
  +
  '.uiBoxYellow {background-color: #1A356C;}'
  +
  '.sp_JdEoqv15PQ- {transform:scale(2.0); opacity: .8;}'
  +
  '._8-b ._26y1 {background-clip: padding-box; background-color: rgba(10, 57, 119, 1); border-bottom: 1px solid rgba(25, 83, 170, 0.22);}'
  +
  '._26y3 {background-color: rgba(19, 45, 98, 1); border-top: 1px solid rgba(8, 54, 150, 1);}'
  +
  '.uiScaledImageContainer img {opacity:.82;}'
  +
  '._18s4 {background-color: #124587;}'
  +
  '._2x8l {background-color: rgba(32, 46, 90, 1);}'
  +
  '._3bzc {background-color: rgba(12, 30, 66, 1);}'
  +
  '._4zsl {border: 1px solid rgba(25, 46, 98, 1);}'
  +
  '._2e4a {background-color: rgba(19, 67, 164, 0.36);}'
  +
  '._2x8p {background-color: #0C1E42; border-bottom: 1px solid rgba(14, 54, 107, 1);}'
  +
  '._2v9_ {border-top: 1px solid #1A5098;}'
  +
  '#contentCol {background-color: #1A356C;}'
  +
  '#u_f_49 {background-color: #202E5A;}'
  +
  '._588p hr {background-color: #195599;}'
  +
  'html ._55r1 {background-color: rgba(19, 81, 152, 1); border: 1px solid rgba(24, 84, 185, 1);}'
  +
  '._5f_7 {background-color: rgba(42, 101, 191, 1);}'
  +
  '._4mq3 .fbChatOrderedList, ._4mq3 .fbChatTypeaheadView {background: #1A356C !important;}'
  +
  '._3sod {background-color: #1A356C !important; border: 1px solid #214590 !important;}'
  +
  '._3sod:hover {background-color: #29488A !important;}'
  +
  '.stageContainer {background-color: #1A356C !important;}'
  +
  '.spotlight, .stage img {opacity: .8 !important;}'
  +
  '._40zk {border-top: 1px solid rgba(41, 93, 221, 1) !important;}'
  // // // // // CHAT
  +
  '._5q5b ._5238 ._51sn {background-position: 0px -374px !important; margin-right: 2px !important; transform: scale(1.5) !important;}'
  +
  '._552h {border-top: 1px solid rgba(18, 50, 117, 1);}'
  +
  '._5q5b ._50mz .fbNubFlyoutFooter:after {background-color: rgba(10, 86, 171, 1);}'
  +
  '.fbDockChatTabFlyout .fbNubFlyoutBody {background-color: rgba(19, 77, 179, 1);}'
  +
  '._5q5b .fbNubFlyoutHeader, ._5q5b .fbNubFlyoutBody, ._5q5b .fbNubFlyoutFooter, ._5q5b .fbNubFlyoutAttachments {border-color: rgba(25, 67, 156, 1);}'
  +
  '.uiTextareaAutogrow, ._552m, ._5q5b ._552h, ._5p3y[dir="ltr"] textarea {background-color: rgba(9, 33, 83, 1);}'
  +
  '._5ys_:after, ._1nc7 ._3okg:after, ._1nc6 ._3okg:after, ._1nc7 ._5w1r, ._1nc7 ._3okg:before, ._5w1r, ._5wdf, ._3okg {background-image: none !important;}'
  +
  '._3okg:after, ._3okg:before {width: 0px !important;}'
  +
  '._5w1r,  ._5pwr, ._47__ {color: #BBC !important;}'
  +
  '._5w1r {border-color: rgba(0,0,0,0) !important;}'
  +
  '._5w1r {box-shadow: 0px 1px 0px rgba(24, 74, 149, 1) !important;}'
  +
  '._1nc6 ._5w1r, ._1nc6 ._3okg:before, ._1nc7 ._5w1r, ._1nc7 ._3okg:before {background-color: rgba(0,0,0,0) !important;}'
  +
  '._3okg:before {bottom: 0px; clip: rect(5px, 13px, 18px, 0px); top: 0px; background-color: rgba(26, 53, 108, 0) !important;}'
  +
  '._3e2s {background-color: #779;}'
  +
  '._1nc7 ._d97 {background: -moz-linear-gradient(top, rgba(40, 150, 231, 1) 0%, rgba(8, 79, 170, 1) 100%);}'
  +
  '._1nc6 ._d97 {background: -moz-linear-gradient(top, rgba(41, 81, 197, 1) 0%, rgba(15, 61, 155, 1) 100%);}'
  +
  '._5w1r {text-shadow: 0px 1px 0px rgba(165, 195, 255, 0.2); color: #BBC;}'
  +
  '._1sk6 {background-color: rgba(2, 45, 89, 1); border-bottom: 1px solid rgba(7, 52, 132, 0.98);}'
  +
  '._5w1r {box-shadow: 0px 1px 0px rgba(29, 96, 195, 1); text-shadow: 0px 1px 0px rgba(13, 71, 120, 0.5) !important;}'
  +
  '.fbNubFlyoutTitlebar {background-color: #1A346B;}'
  +
  '._5q5b .fbNubFlyoutTitlebar {background-image: none !important;}'
  +
  '.fbDockChatTabFlyout .fbNubFlyoutBody {background-color: rgba(18, 58, 180, 1);}'
  +
  '._5q5b .fbNubFlyoutHeader, ._5q5b .fbNubFlyoutBody, ._5q5b .fbNubFlyoutFooter, ._5q5b .fbNubFlyoutAttachments {border-color: rgba(14, 62, 162, 1) !important;}'
  +
  '._5q5b .fbNubFlyoutTitlebar {background-image: none !important; background-color: #1A346B !important;}'
  +
  '._2qh {border-bottom: 1px solid rgba(14, 80, 153, 1) !important; border-top: 1px solid rgba(14, 80, 153, 1) !important; background-color: #1A356C !important; color: #BBC !important;}'
  +
  '._5q5b ._50mz .fbNubFlyoutFooter:before {background-color: #1A356C !important; border-color: rgba(25, 52, 116, 1) !important;}'
  +
  '.fbNubFlyoutAttachments {background-color: #092153 !important;}'
  +
  '._50mz .chatAttachmentShelf {background-color: #1A356C !important; border-top: 1px solid rgba(12, 43, 87, 1) !important;}'
  +
  '._52kr {opacity: .8 !important;}'
  +
  '._1sk6 {background-color: rgba(10, 104, 225, 1) !important; border-bottom: 1px solid rgba(12, 78, 192, 1) !important;}'
  +
  '._1skd, .fcg {color: #BBC !important;}'
  +
  '.mvs, ._3e7u span div {opacity: .8 !important;}'
  +
  '.emoteTogglerImg {background-color: rgba(26, 138, 233, 1) !important; background-position: -27px -466px !important;}'
  +
  '._3e2s {background-color: #1A356C;}'
  // // // // // GAMES
    +
    '._5aeq, ._5aeq:hover, ._5aeq a, ._5aeq a:hover, ._2yiu {color: #BCC;}'
    +
    '._18su ._18c4 {background-color: rgba(9, 40, 87, 1) !important;}'
    +
    '._5aeq:hover {background-color: rgba(30, 101, 173, 1) !important;}'
    +
    '._5pk3 li:hover {background-color: rgba(30, 101, 173, 1) !important;}'
    +
    '._5pk3 a li {border-bottom: 1px solid #4C73C3 !important;}'
    +
    '._uiList, ._4kg {border-bottom: 1px solid #1C2332 !important; border-top: 1px solid #1C2332 !important;}'
    +
    '._1a8t {background: linear-gradient(rgba(11, 102, 159, 1), rgba(19, 81, 144, 1)) repeat scroll 0% 0% transparent !important;}'
    +
    '._5057 {background-color: #0F3072 !important; color: #BBC !important;}'
    +
    '._1xy2 {background: linear-gradient(#0B659E, #135190) repeat scroll 0% 0% transparent !important;}'
    +
    '._2yix {background-color: #1A356C !important;}'
    +
    '._49l4 span span a span span, ._2yiu {color: #BBC !important;}'
    +
    '._4-u2 > ._4-u3 {border-top: 1px solid rgba(12, 56, 105, 1) !important;}'
    +
    '._5w-6 {background-color: #1A356C !important;}'
    +
    '._ab4 ._3yv8._5aer ._5aeo {background-color: #092857 !important;}'
    +
    '._3yv8._5aer ._5aeo {background-image: none;}'
    +
    '._30_7 {background-color: rgba(35, 97, 177, 1) !important;}'
    +
    '._5f_7 {background-color: rgba(76, 115, 195, 1) !important;}'
    +
    '._3yv8 li, ._5aeq li, ._5aer li, ._5aep li, ._5aeq li, ._22qy {color: #BBC !important;}'
    +
    'html ._55r1 {background-color: #4B95DE !important; border: 1px solid rgba(22, 82, 183, 1) !important;}'
    +
    '._2qds {opacity: .8;}'
    +
    '._5pr2 .fbSidebarGripper {border-top: 1px solid #1948B9 !important;}'
    +
    '._3te {background: #1948B9 !important;}'
    +
    '._3ts, _3tr, ._3tr a {text-shadow: 0px 1px rgba(23, 74, 150, 0) !important;}'
  // // // // // MESSAGES
    +
    '.wmMasterView:after {background-color: rgba(29, 90, 168, 1); border-color: #1D5AA8;}'
    +
    'ul._281 {border-bottom: 1px solid rgba(39, 74, 179, 1);}'
    +
    '._k- {border-color: rgba(2, 22, 83, 1);}'
    +
    '._k-:hover {background-color: rgba(10, 30, 62, 1);}'
    +
    '._l1 {color: #BBC;}'
    +
    '._3j5 {background-color: #092153;}'
    +
    '._3b {border-bottom: 1px solid rgba(23, 63, 110, 1);}'
    +
    '._3b ._3c {border: 1px solid rgba(0, 74, 170, 1);}'
    +
    '._5q5b .fbNubButton:after, ._5q5b .fbNubButton:before, ._5q5b .fbNubButton {background-image: none !important;}'
    +
    '._5q5b .fbNubButton {background-color: rgba(19, 121, 222, 1);}'
    +
    '._ksg {background-color: #1F4AB6; border-color: rgba(31, 74, 182, 1);}'
    +
    '.fbNubButton {background-color: #153F89 !important;}'
    +
    '._5q5b ._50mz .fbChatTab .name, ._r7, ._r7 a {color: #BBC;}'
    +
    '._2nb {border-left: 1px solid #1F4AB6;}'
    +
    '._3db {border-bottom: 1px solid rgba(17, 76, 152, 1);}'
    +
    '._4rw ._82 .uiSideHeader, ._82 .rhcFooterBorder {border-color: rgba(12, 59, 176, 0);}'
    +
    '.rhcFooterBorder {border-bottom: 1px solid rgba(59, 118, 183, 1);}'
    +
    '._1rs {background-color: #1A356C; border-top: 1px solid rgba(12, 82, 152, 1);}'
    +
    '._2pt {background-color: #092153; border-color: rgba(22, 82, 141, 1) rgba(27, 90, 137, 1) -moz-use-text-color;}'
    +
    '._1rw {background-color: #1F4AB6; border-color: -moz-use-text-color rgba(14, 86, 156, 1) rgba(22, 91, 149, 1);}'
    +
    '._2pu {border-top: 1px solid rgba(19, 93, 134, 1);}'
    +
    'div._211 ._213:active, div._211 ._214:active, div._211 ._213, div._211 ._214 {border-color: -moz-use-text-color rgba(40, 103, 143, 1) -moz-use-text-color -moz-use-text-color;}'
    +
    '.fbTimelineSection {background-color: rgba(3, 28, 60, 1);}'
    // // // // // ABOUT
    +
    '._6-d .fbTimelineSection {border: 1px solid rgba(29, 74, 149, 1);}'
    +
    '._3cz {background-color: rgba(26, 66, 117, 1) !important; border-bottom: 1px solid rgba(25, 60, 120, 1) !important;}'
    +
    '._2w3 > ._30f {background-color: rgba(13, 22, 32, 1) !important; border: 1px solid rgba(28, 72, 146, 1) !important;}'
    +
    '._h71 {border-bottom: 1px solid rgba(18, 31, 63, 1) !important;}'
    +
    '._6_7 {border-left: 1px solid rgba(46, 78, 176, 1) !important;}'
    +
    '._6-6 {border-right: 1px solid rgba(46, 78, 176, 1 !important);}'
    +
    '._5pwr:hover ._5pws, ._47__ ._5pws, ._3c_:hover ._3sz, ._3s- ._3sz, ._33hy ._554b:hover, ._4o52:hover ._3sz, ._3c- a, .uiInputLabelLegacy label, .user .text, ._6z- .uiSideNav .item, ._6z- .uiSideNav .subitem, ._2a-0 ._2rib a, #fbPhotoSnowliftAuthorName a, .fbPhotoContributorName a {color: #EDD !important;}'
    +
    '._6-6:hover, ._9rx.openToggler, ._9ry:hover, html ._9rw._54ne ._54nc {background-color: rgba(9, 38, 68, 1) !important;}'
    +
    '._14b9 ._r95, ._14b9 ._gx6 {border-color: -moz-use-text-color rgba(19, 61, 188, 1) rgba(29, 66, 179, 1) !important;}'
    +
    '._1eds {background-color: #172F5D !important;}'
    +
    '._2jq5 {border-left: 1px solid rgba(38, 69, 164, 1) !important;}'
    +
    '.openToggler ._2jq5, ._2jq5:focus, ._2jq5:hover {background-color: rgba(33, 53, 111, 1) !important;}'
    +
    '._4-i2, ._4t2a, ._5a8u {background-color: #1A356C !important;}'
    +
    'hr {background-color: rgba(16, 37, 72, 1) !important;}'
    +
    '.uiTokenizer {background-color: #1A356C !important;}'
    +
    '.uiInlineTokenizer {border: 1px solid rgba(21, 73, 161, 1) !important;}'
    +
    '._z6j {background-color: rgba(30, 80, 129, 1); border: 1px solid rgba(21, 69, 149, 1);}'
    +
    '._kj3 {background: none repeat scroll 0% 0% rgba(13, 44, 84, 1); border: 1px solid rgba(20, 62, 132, 1);}'
    +
    '._kj3 .uiSearchInput {border-color: rgba(22, 68, 144, 1);}'
    +
    '._6z- .uiHeaderNav {background-image: none;}'
    +
    '.uiHeaderNav {border-color: rgba(13, 41, 123, 1);}'
    +
    '._6z- .uiSideNav .selectedItem > .item, ._6z- .uiSideNav .selectedItem > .subitem {background-color: rgba(11, 68, 143, 1); border-bottom: 1px solid rgba(18, 75, 171, 1); border-top: 1px solid rgba(20, 73, 161, 1);}'
    +
    '._6z- .uiSideNav .selectedItem > .item:hover, ._6z- .uiSideNav .selectedItem > .subitem:hover {background-color: rgba(20, 92, 165, 1) !important;}'
    +
    '._6z- .uiSideNav .item:hover, ._6z- .uiSideNav .subitem:hover {background-color: rgba(17, 96, 174, 1) !important;}'
    +
    '._2a-c {border-left: 1px solid rgba(27, 86, 189, 1) !important;}'
    +
    '._2a-3 ._2a-4, ._5lxg ._2a-4 {border-bottom: 1px solid rgba(15, 31, 80, 1);}'
    +
    '._2az_ ._2a-c ._2a-6 {border-bottom: 1px solid rgba(38, 89, 165, 1);}'
    +
    '.pam, ._711 {background-color: rgba(25, 50, 126, 1) !important;}'
    +
    '._4o-f, ._4o-d, ._4o-f:hover, ._4o-d:hover {background-color: rgba(25, 50, 126, 1) !important;}'
    +
    '.timelineLayout {background-color: rgba(25, 50, 126, 1) !important;}'
    +
    'html ._4lh, ._4lh .fbTimelineTimePeriod, ._4lh .fbTimelineSectionExpandPager .uiMorePagerLoader, ._4lh .fbTimelineCapsule li.anchorUnit:last-child, ._4lh .fbTimelineSectionLoading .loadingIndicator, ._4lh .timelineTourStarted ._2xgb, ._4lh .timelineTourStarted ._2xgc, ._4lh .lifeEventAddPhoto:hover {background-color: rgba(25, 50, 126, 1) !important;}'
    +
    '._4d3w .rhc {background-color: #1A356C !important;}'
    +
    '._5yk1 {background-color: rgba(40, 117, 192, 1) !important; border: 1px solid rgba(15, 75, 176, 1) !important;}'
    +
    '.fbxPhoto .fbPhotosPhotoActions .separatorLine {border-top: 1px solid rgba(14, 65, 131, 1);}'
    +
    '._42i {border-color: rgba(40, 100, 203, 1) -moz-use-text-color -moz-use-text-color !important;}'
    +
    '._58zf {border-top: 1px solid rgba(0, 65, 129, 1) !important;}'
    // // // // // OVERLAYS
    +
    '._3tmp .contextualHelp, ._3tmp .navigation {background-color: #123975 !important; border: 1px solid rgba(17, 62, 153, 1) !important;}'
    +
    '.contextualHelp li.topic {border-top: 1px solid rgba(26, 89, 143, 1) !important;}'
    +
    '._3tmp .navSubmenu {border-bottom: 1px solid #123975 !important; border-top: 1px solid rgba(18, 40, 72, 1) !important;}'
    +
    '.contextualHelp li.topic.last {border-bottom: 1px solid rgba(21, 78, 134, 1) !important;}'
    +
    '.contextualHelp .searchArea {border: 1px solid rgba(43, 84, 171, 1) !important;}'
    +
    '.contextualHelp .topicsArea li.topic:hover, .contextualHelp .topicsArea li.topic:hover + li.topic {border-color: rgba(25, 68, 176, 1) !important;}'
    +
    '.contextualHelp li.topic:hover {background-color: rgba(0, 86, 171, 1) !important;}'
    +
    '._53il ._558b + ._53io {background-image: none !important;}'
    /*+
    '._4-u2 div, ._3oc7 div, ._4-u8 div {background-color: #1A356C !important;}'*/
    +
    '._pc {background-color: rgba(0, 66, 131, 1);}'
    +
    '._57d8 {background-color: #1A356C;}'
    +
    'html ._55r1 {background-color #0085E4; border: 1px solid rgba(14, 57, 129, 1);}'
    +
    '._50f9 {color: #BBC !important;}'
    +
    '._55y4 ._bui ._5afe:hover, ._55y4 ._bui ._5afd ._5afe, ._55y4 ._bui ._5afe:hover ._5aff {background-color: rgba(4, 40, 102, 1) !important;}'
    +
    '#navItem_account > a {background-color: #1A356C;}'
    +
    '.uiSideNav .item, .uiSideNav .subitem {color: #BBC; border-bottom: 1px solid rgba(14, 58, 135, 1);}'
    +
    '.fbSettingsNavigation .divider {background-color: #080C15 !important;}'
    +
    '.hasLeftCol #contentCol {border-left: 1px solid rgba(34, 80, 120, 1);}'
    +
    '.hasLeftCol #mainContainer {border-right: 1px solid rgba(34, 80, 120, 1);}'
    +
    '.fbSettingsList {border-bottom: 1px solid rgba(10, 37, 63, 1); border-top: 1px solid rgba(8, 34, 78, 1);}'
    +
    '.fbSettingsList a.fbSettingsListLink:hover {background-color: rgba(3, 41, 90, 1) !important;}'
    +
    '.uiBoxGray {background-color: #1A356C !important; border: 1px solid rgba(8, 68, 135, 1);}'
    +
    '.uiButton, .uiButtonSuppressed:active, .uiButtonSuppressed:focus, .uiButtonSuppressed:hover {background-color: rgba(29, 63, 162, 1) !important; border-color: rgba(24, 95, 186, 1) rgba(29, 99, 177, 1) rgba(19, 89, 158, 1);}'
    +
    '._5p3y .uiSideNav .item, ._5uqr:hover ._5x-c, ._5uqs ._5x-c {color: #BBC;}'
    +
    '.stat_elem a:hover {background-color: rgba(10, 50, 102, 1) !important;}'
    +
    '.hasLeftCol #pageFooter {background-color: #1A356C !important;}'
    +
    '.hasLeftCol #contentCurve {border-color: -moz-use-text-color rgba(37, 73, 128, 1) rgba(32, 68, 155, 1);}'
    +
    '._585r {background-color: rgba(0, 58, 116, 1) !important;}'
    +
    '._4al {border-bottom: 1px solid rgba(14, 33, 62, 1) !important;}'
    +
    '.homeFixedLayout #rightCol .cardRightCol .uiHeader.uiSideHeader._3g37 {border-bottom: 1px solid rgba(20, 81, 188, 1) !important;}'
    +
    '._412b + ._4lxk, ._412b + ._412b {border-top: 1px solid rgba(60, 92, 191, 1);}'
    +
    '._j-s {border-bottom: 1px solid rgba(30, 75, 189, 1) !important;}'
    +
    '._j-r {background: none repeat scroll 0% 0% rgba(31, 123, 213, 1) !important; border: 1px solid rgba(15, 102, 216, 1) !important;}'
    +
    '._j-q {border: 1px solid rgba(24, 122, 218, 1) !important;}'
    +
    '.fbTimelineMapBorder {background-color: #1A356C !important;}'
    +
    '._2w3 > ._30f {background-color: #1A356C !important;}'
    +
    '._53io {background-image: none !important;}'
    +
    '._2iwq {background: -moz-linear-gradient(left center , #0D52AB 0%, #0D52AB 20%, #0D52AB 40%, #F6F7F8 100%) no-repeat scroll 0% 0% / 800px 104px #0D52AB !important;}'
    +
    '.photoImage {border: 1px solid rgba(23, 71, 125, 1) !important;}'
    // // // // // ANNOUNCEMENTS
    +
    '.advertisingNavigationItem, .advertisingNavigationItemSelected, .advertisingSuccessStories {background-image: none;}'
    +
    '.advertisingNavigation {border-right: 1px solid rgba(0, 0, 0, 0);}'
    +
    '._2xq {background-color: rgba(7, 31, 63, 1);}'
    +
    '.advertisingSuccessStoriesBox {background-color: rgba(20, 73, 141, 1) !important; border: 1px solid rgba(17, 63, 134, 1);}'
    +
    '.advertisingSuccessStory div img {opacity: .8;}'
    +
    '.advertisingHeaderWash {background-color: rgba(3, 28, 80, 1) !important; border-bottom: 1px solid rgba(10, 29, 63, 1);}'
    +
    '.advertisingHeaderContent {opacity: .7;}'
    +
    '._3ma, ._3m9, .advertisingSubtitle, ._6o, ._6u, ._mf, .mtm, ._6q, .mtm a, ._6q a {color: #BBC; text-shadow: 0px 0px 3px #000; opacity: 1; background-color: rgba(35, 52, 95, 0.35);}'
    +
    '._6q, ._6v, ._6m6 a, ._3v07, .groupsCleanLink.groupsCleanLinksSelected, .groupsCleanLink {color: #BBC !important;}'
    +
    '.advertisingTitle {text-shadow: 1px 2px rgba(28, 41, 138, 1);}'
    +
    '._4-u8 {background-color: #1A356C;}'
    +
    '.uiHeaderSection, .uiSideHeader {border-top: 1px solid rgba(15, 26, 62, 1) !important;}'
    +
    '._1y2l li.jewelItemNew a.messagesContent {background-color: rgba(19, 38, 78, 1) !important;}'
    +
    '._4962 .beeperNubWrapper .beeperNub, #js_r {background-image: none !important;}'
    +
    '.pal {background-color: #1A356C !important;}'
    +
    '.uiMenu {background-color: #1A356C !important;}'
    +
    '.uiMenuItem .itemAnchor {border-color: #1A356C !important;}'
    +
    '._3v07 .groupsJumpBarTop .groupsCleanLinkBorder:after {background-color: rgba(48, 82, 186, 1) !important;}'
    +
    '.groupsJumpBarTop .groupsCleanLinksSelected .groupsJumpTitle, .groupsJumpBarTop .groupsCleanLinksSelected {background-color: rgba(26, 39, 78, 1) !important;}'
    +
    '.groupsJumpBarTop {border-top: 1px solid rgba(68, 18, 18, 0);}'
    +
    '._12-i .pollResultsFacepile .fbQuestionFacepileMoreItem {background-color: rgba(13, 36, 69, 1) !important; border: 1px solid rgba(43, 79, 171, 1) !important;}'
    +
    '._g2z {border: 1px solid rgba(14, 33, 71, 1) !important;}'
    +
    '._12-i .pollOptions .selectedPollOption div {border-color: #0E2147 !important;}'
    +
    '._12-h span {border: 1px dashed rgba(6, 26, 48, 1) !important;}'
    +
    '.uiOverlayContent {background-color: rgba(13, 33, 63, 1) !important;}'
    +
    '.uiHeaderSection, .uiSideHeader {background-color: #1A346B !important;}'
    +
    '.fbQuestionsPollResultsBar {background-color: rgba(17, 36, 77, 1) !important; border-color: rgba(35, 76, 138, 1) rgba(40, 98, 174, 1) rgba(32, 65, 144, 1) !important;}'
    +
    '.fbQuestionsPollResultsBar .auxlabel {background-color: #1A356C !important;}'
    +
    '.fbQuestionsPollResultsBar, .shaded {background-color: rgba(26, 88, 212, 1) !important; border-color: rgba(20, 46, 99, 1) !important;}'
    +
    '.shaded {background-color: rgba(16, 93, 194, 1) !important;}'
    +
    '.fbQuestionFacepileMoreItem {border: 1px solid rgba(34, 76, 182, 1) !important;}'
    +
    '._43q8._49c8 {background-color: rgba(17, 38, 80, 1) !important;}'
    +
    '._3qw ._3ixn {background-color: rgba(11, 22, 34, 0.8) !important;}'
    +
    '._6lm {border: 3px solid rgba(7, 96, 183, 1) !important;}'
    +
    '.sp_1vhXLuAIRj_ {opacity: 0.2 !important;}'
    +
    '._4b6:after {background-color: rgba(28, 53, 126, 1) !important;}'
    +
    '._3dvv {border-bottom: 1px solid rgba(24, 77, 123, 1) !important;}'
    +
    '._4b5 > ._4b6 + ._4b6 {border-left: 1px solid rgba(46, 80, 162, 1);}'
    +
    '._4b6, ._4b7, ._2r80, ._559e, ._2s6f, ._5vwy a {color: #BBC !important;}'
    +
    '._3r7b {border-bottom: 1px solid rgba(14, 30, 62, 1) !important;}'
    +
    '._412b + ._4lxk, ._412b + ._412b {border-top: 1px solid rgba(43, 74, 165, 1) !important;}'
    +
    '._5vb_ ._5plv .uiSideNav .item:hover, ._5vb_ ._5plv .uiSideNav .item:focus, ._5vb_ ._5plv .uiSideNav .item:active, ._5vb_ ._5plv .uiSideNav .loading .item {background-color: rgba(43, 70, 140, 1) !important;}'
    +
    '.userSuggestionList .userSuggestionRow {border-bottom: 1px solid rgba(39, 79, 149, 1) !important;}'
    +
    '._4b5 > ._4b6 + ._4b6 {border-left: 1px solid rgba(39, 111, 221, 1) !important;}'
    +
    '.truncatedNameWithTooltip {color: #BBC !important;}'
    // // // // // INFO EDIT PAGE
    +
    '.editExperienceForm {background-color: #1A356C !important;}'
    +
    '._5yzw, ._53d9 {border-top: 1px solid rgba(14, 31, 75, 1) !important;}'
    +
    '._53d9 {border-bottom: 1px solid rgba(14, 31, 75, 1) !important;}'
    +
    '.fbPhotoStarGridElement .uiMediaThumb i, .fbPhotoStarGridElement .uiVideoLink i {background-color: rgba(16, 38, 68, 1) !important;}'
    +
    '.uiMenuItem .itemAnchor, .name {color: #BBC !important;}'
    +
    '.uiMenuItem a:focus, .uiMenuItem a:active {background-color: #1A356C !important;}'
    +
    '.uiMenuSeparator {border-bottom: 1px solid rgba(52, 112, 203, 1) !important;}'
    +
    '._53ij {background: rgba(16, 87, 168, 1) !important;}'
    +
    '._52bu ._3ow- {background-color: #1A346B !important; border-bottom: 1px solid rgba(33, 83, 159, 1) !important;}'
    // // // // // USER PAGES
    +
    '._5otg:after {border-color: rgba(24, 65, 134, 1) !important;}'
    +
    '._5otg {background-color: #1A356C !important;}'
    +
    '._2l03 {border-color: rgba(17, 36, 93, 1);}'
    +
    '._g3h {border-bottom: 1px solid rgba(17, 30, 63, 1);}'
    +
    '._6dh ._1dsl, ._6dh ._3s2r {border-bottom: 1px solid rgba(15, 30, 69, 1);}'
    +
    'html ._6dh ._519b ._2wr {background-image: none;}'
    +
    '._5vx4 ._5vwz, ._5vx4 ._45hd {border-left: 1px solid rgba(38, 69, 162, 1);}'
    +
    '._5vx7 ._45hd a, ._5vwz a, ._75e, ._2fb2, ._g3j, .UFINoWrap, ._2kcr, ._42ef, ._g3i, ._50f3 a, ._50f7 a,  .UFILikeLink,  .UFILikeLink span, ._3i-4 {color: #BBC;}'
    +
    '.UFIReplyList .UFIRow {background-color: #1A346B !important;}'
    +
    '.UFIReplyList {background-color: #1A346B !important;}'
    +
    '._5vsj .UFIReplyList .UFIComponent {border-left: 2px solid rgba(60, 87, 153, 1) !important;}'
    +
    '._18fs {border-bottom: 1px solid rgba(36, 74, 122, 1);}'
    +
    'html ._6-d .fbTimelineSection {border: 1px solid rgba(24, 72, 153, 1) !important;}'
    +
    '._4lh .timelineReportContainer {background-color: #1A356C !important;}'
    +
    '._4lh .timelineReportContainer, ._4lh .fbTimelineCapsule .timelineUnitContainer {border-left: 1px solid rgba(19, 68, 149, 1) !important; border-right: 1px solid rgba(16, 68, 156, 1) !important;}'
    +
    'html ._4__g {border-color: rgba(32, 61, 149, 1) rgba(25, 65, 132, 1);}'
    +
    '._4ks > li {border-color: rgba(10, 25, 72, 1) !important;}'
    +
    '._4kt > li {border-color: rgba(34, 73, 143, 1);}'
    +
    '._4jy2, ._4jy2._42fr:active, ._4jy2._42fr._42fs {border-color: rgba(46, 102, 166, 1) rgba(24, 88, 159, 1) rgba(1, 50, 151, 1) !important;}'
    +
    '._4jy0, ._59pe:focus, ._59pe:hover {background-image: none;}'
    +
    '._5rsw {border: 1px solid rgba(50, 85, 171, 1);}'
    +
    '.UFIArrow > i {background-image: none !important;}'
    +
    '._5ciw .uiSideHeader {border-bottom: 1px solid rgba(12, 20, 42, 1) !important;}'
    +
    '._5k35 ._5k3a {border: 1px solid rgba(24, 83, 171, 1) !important;}'
    +
    '._3cz {background-color: #1A356C !important;}'
    +
    '._2w3 > ._30f {background-color:  #1A356C; !important}'
    +
    '._3t3 {background-color: rgba(5, 33, 62, 1) !important; border-top: 1px solid rgba(13, 39, 83, 1) !important;}'
    +
    '.fbEventsDashboardSection + .fbEventsDashboardSection > .fbEventsDashboardSection > ._4ag3, .fbEventsDashboardSection + .fbEventsDashboardSection > ._4ag3, ._4cbb + ._4ag3 {border-top: 1px solid rgba(20, 27, 35, 1) !important;}'
    +
    '._1qdd, ._1qdd a, ._1e9r, ._1e9r a, .fbCalendar .fbCalendarBoxHeader, ._5plv .uiSideNav .sideNavItem .linkWrap {color: #BBC !important;}'
    +
    '.fbEventsDashboardSection + .fbEventsDashboardSection > ._4cbb, ._4cbb + ._4cbb {border-top: 1px solid #141B23 !important;}'
    +
    '.fbCalendar, .fbCalendar #contentCol {background-color: rgba(30, 48, 101, 1) !important;}'
    +
    '.fbCalendarGridRoot .fbCalendarBox {background-color: rgba(11, 33, 78, 1) !important; border-color: rgb(19, 59, 141) !important;}'
    +
    '.fbCalendarGrid .fbCalendarGridRow {background-color: rgba(11, 33, 78, 1) !important;}'
    +
    '.fbCalendarGrid .fbCalendarDayItem {border-top: 1px solid rgba(11, 29, 60, 1) !important;}'
    +
    '.fbCalendarGrid .fbCalendarGridCellEmpty .fbCalendarDayItem:hover, .fbCalendarGrid .fbCalendarDayItem:hover, .fbCalendarGrid .fbCalendarGridToday .fbCalendarDayItem:hover {background-color: rgba(12, 24, 42, 1) !important; border-top-color: rgba(8, 19, 42, 1) !important;}'
    +
    '.fbCalendarGridRoot #fbCalendarWrapper {background-color: #1E3065 !important;}'
    +
    '.fbCalendarGrid .fbCalendarGridCell.fbCalendarGridToday .fbCalendarDayItem {background-color: rgba(11, 49, 105, 1) !important;}'
    +
    '.fbCalendar.fbCalendarGridView .fbCalendarSpacer {border-left: 1px solid rgba(50, 77, 171, 1) !important;}'
    +
    '._5izg {border-bottom: 1px solid rgba(42, 77, 183, 1);}'
    +
    '._2uob {border-bottom: 1px solid rgba(52, 83, 174, 1) !important;}'
    +
    '._2uob:hover, ._2uod {background-color: rgba(2, 35, 72, 1) !important;}'
    +
    '._1ceo {border-bottom: 1px solid rgba(35, 65, 153, 1); border-top: 1px solid rgba(41, 71, 162, 1);}'
    +
    '._5mac {border-color: rgba(33, 57, 129, 1) rgba(30, 63, 161, 1) -moz-use-text-color !important;}'
    +
    '._596n {background-color: #1A346B !important; border-color: #1A346B !important;}'
    +
    '._5vx4 ._5vwz, ._5vx4 ._45hd {border-left: 1px solid rgba(57, 89, 186, 1);}'
    +
    '._5vx7 ._45hd a, ._5vwz a, ._5l2d, ._4yrd, ._75e, ._2fb2, ._g3i, ._3od9 ._3_xs, ._558b ._54nc {color: #BBC !important;}'
    +
    '._21es {background-color: rgba(26, 75, 173, 1) !important;}'
    +
    '._-6e ._-6h, ._2x6q ._53ik ._53io {border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 9px solid #1A4BAD;}'
    +
    '._g3h {border-bottom: rgba(17, 29, 65, 1) !important;}'
    +
    '._5otg:after, ._5otg, ._5vx4 ._5vx7 {background-color: #1A356C !important; border-color: #0F3574 !important;}'
    +
    '._2l03 {border-color: rgba(17, 29, 65, 1) !important;}'
    +
    '._xlg {opacity: .8;}'
    +
    '._4-u2 > ._4-u3 {background: rgba(10, 67, 131, 1) !important;}'
    +
    '._3od9 ._3odc {background-color: #2E5493;}'
    +
    '._5vsj .UFIReplyList .UFIComponent.UFILastComponent:after, ._5vsj .UFIReplyList .UFIComponent.UFIFirstComponent:after {border-left: 2px solid rgba(12, 22, 48, 1) !important;}'
    +
    '.UFIReplyList .UFIRow:last-child {border-bottom: 1px solid rgba(27, 47, 129, 1) !important;}'
    +
    '._4d3w .fbPhotoSnowliftContainer .fbPhotosSnowliftFeedbackForm ._467y:after {background-color: rgba(93, 24, 24, 0) !important;}'
    +
    '.UFIReplyList .UFIRow {border-top: 1px solid rgba(8, 21, 72, 1) !important;}'
    +
    '.fbxPhoto .fbPhotosPhotoActions, .fbPhotosPhotoActions .actionListButton.rotateButtons {border-top: 1px solid rgba(13, 30, 57, 1) !important;}'
    +
    '.UFIAddComment .UFIAddCommentInput._1osc {background-color: rgba(0, 94, 174, 1) !important; border: 1px solid rgba(15, 63, 144, 1) !important;}'
    +
    '._5q6p, .fwb {color: #BBC !important;}'
    +
    '._5v3q ._5g-l {border-bottom-color: rgba(7, 32, 60, 1) !important;}'
    +
    '._5ywa, ._209g, ._2vxa, ._54-z, ._54-z div {background-color: #4B95DE !important;}'
    +
    '._4d6h {border-bottom: 1px solid rgba(14, 55, 95, 0) !important;}'
    +
    '._2uog {background-position: 0px -42px !important;}'
    +
    '._2dck {border-top: none !important;}'
    +
    '._5rsw {border: 1px solid rgba(44, 93, 215, 1) !important;}'
    +
    '._tum {background: none repeat scroll 0% 0% rgba(14, 78, 143, 1) !important; border-color: #1346C8 #1346C8 -moz-use-text-color !important;}'
    +
    '._tun {background: none repeat scroll 0% 0% #1A356C !important; border: 1px solid rgba(24, 79, 134, 1) !important;}'
    +
    '._tup {border-left: 1px solid rgba(33, 68, 153, 1) !important;}'
    +
    '._502h {border-bottom: 1px solid rgba(43, 78, 152, 1) !important;}'
    +
    '.selected ._tus, ._tuq:hover ._tus {color: #BBC !important;}'
    +
    '._5vwz ._13xf {background-color: #1E4490 !important;}'
    +
    '._5vx4 ._4jq5, ._5vx4 ._45hd ._45hc {border-left: 1px solid #1D2B53 !important;}'
    +
    '#fbTimelineHeadline .profilePic, #fbTimelineHeadline .newProfilePic {background-color: rgba(255, 255, 255, 0) !important; border: 4px solid #3462C0 !important;}'
    +
    '._58gh {color: #5D97D8 !important;}'
    // // // // // SEE FRIENDSHIP
    +
    '.fbTimelineNavigationWrapper {background-color: #132047 !important;}'
    +
    '.friendshipAbout .detail {border: 1px solid rgba(45, 75, 167, 1) !important;}'
    +
    '.fbTimelineNavigationWrapper .detail {background-color: rgba(14, 95, 200, 1) !important;}'
    +
    '.fbProfileBylineFragment, #fbTimelineHeadline h2 a, #fbTimelineHeadline h2 {color: #BBC !important;}'
    +
    '#fbProfileCover .coverNoImage {background-color: rgba(26, 45, 104, 1) !important;}'
    +
    '._5kxe {background-color: #153F89 !important;}'
    +
    '._5kxd {background: none repeat scroll 0% 0% rgba(25, 85, 144, 1) !important; border: 1px solid rgba(33, 61, 146, 1) !important;}'
    // // // // // GUIDELINES
    +
    '._5tkn {background: none repeat scroll 0% 0% #080C15 !important;}'
    +
    '._3ma, ._3m9 {background-color: rgba(20, 37, 80, 1) !important;}'
    +
    '._3539 {opacity: .8 !important;}'
    +
    '._b_1 {border-bottom: 1px solid rgba(26, 62, 132, 1) !important;}'
    +
    '._5tkp {border-left: 1px solid rgba(26, 62, 132, 1) !important;}'
    +
    '._575h, ._3h8s {background-color: rgba(26, 46, 96, 1) !important; border-bottom: 1px solid rgba(26, 62, 132, 1) !important;}'
    +
    '._3h8s:hover, ._575j:hover {background-color: rgba(18, 33, 71, 1) !important;}'
    +
    '._3h8t, ._1tvz, ._1rf2 h2, ._5tkp h2, ._3m9 h2 {color: #BBC !important;}'
    +
    '._3539 {background-image: none !important;}'
    +
    '._xpq {background-color: rgba(19, 61, 134, 1) !important;}'
    +
    '._1hcb, ._1hcc {border: 3px solid rgba(19, 61, 134, 1) !important;}'
    +
    '._1hcc {background-color: rgba(19, 61, 134, 1) !important;}'
    +
    '._575j a {color: rgba(69, 131, 246, 1) !important;}'
    +
    '._17it ._b_1:hover, ._17it, ._xps, ._17ix, ._3m9, ._17iv, ._17iy, ._17iw, ._17iu, ._3pg2 {opacity: 0.8 !important;}'
    +
    '.fbDockChatTabFlyout .fbNubFlyoutBody {background-color: #1A356C !important;}'
    // // // // // SEARCH
    +
    '._gli {border-bottom: 1px solid rgba(18, 52, 123, 1) !important;}'
    +
    '._gll a {color: #BBC !important;}'
    +
    '._pac, ._pac a {color: rgba(121, 162, 237, 1) !important;}'
    // // // // // HELPCENTER
    +
    '._4tvn {background-color: rgba(9, 59, 110, 1) !important;}'
    +
    '._5k-2 {background-color: rgba(5, 24, 62, 1) !important;}'
    +
    'i._mx0 {opacity: .8 !important;}'
    +
    '._3nb6 ._3nb9 {background: none repeat scroll 0% 0% rgba(11, 58, 128, 1) !important; border: 1px solid rgba(13, 61, 179, 1) !important;}'
    +
    '._1awm a, ._5t-2, ._42ef h2 a, ._31h, ._31h a, ._2i6c, .uiBoxLightblue, .lfloat strong a, ._ohe strong a {color: #BBC !important;}'
    +
    '.uiBoxLightblue {border: 1px solid rgba(16, 76, 170, 1) !important;}'
    +
    'li._58yf {border-bottom: 1px solid rgba(12, 62, 126, 1) !important;}'
    +
    'a._2wx:hover, a._2wx:focus {background-color: rgba(17, 42, 92, 1) !important;}'
    +
    'a._2wx, li._58md {border-bottom: 1px solid rgba(22, 63, 135, 1) !important; text-shadow: 0px 1px 0px rgba(20, 50, 104, 0.5) !important;}'
    +
    '._3nb9 input {color: #BBC !important;}'
    +
    '._3nba {background-color: rgba(12, 39, 80, 1) !important;}'
    +
    '._53mo {background: none repeat scroll 0% 0% #1A356C !important;}'
    +
    '._53x6, ._53x6 li {background-color: #1A356C !important;}'
    +
    '._53ft a, div._53fs div._53ft a {background-color: rgba(255, 255, 255, 0) !important; color: #BBC !important;}'
    +
    '._53fs {border-bottom: 1px solid rgba(28, 59, 122, 1) !important;}'
    +
    '._53ft ._53fu {background-image: none !important;}'
    +
    '#intl-region {border-left: 1px solid rgba(12, 31, 53, 1) !important;}'
    +
    '._1yw {background-color: rgba(12, 33, 75, 1) !important;}'
    +
    '.suggestedLocale .uiButtonText, .localeLink .suggestedLocale {background-color: rgba(22, 89, 189, 1) !important;}'
    +
    '.uiBoxYellow {color: #BBC !important;}'
    +
    '._syg {border-bottom: 1px solid rgba(8, 36, 74, 1) !important;}'
    +
    '.sp_jLXi9cTL3yX {opacity: 0.7 !important;}'
    +
    '._5u_6._5wcf, ._5voi._5wcf, ._5xmz._5wcf {background-color: #1A346B !important;}'
    +
    '.UFIBlingBox:hover {background-color: #124587 !important;}'
    +
    'li._2i a, li._2i a:hover, li._c7 {color: #BBC !important;}'
    +
    'img._294 {background-color: rgba(31, 58, 105, 1) !important;}'
    +
    '._io {background-color: #151515 !important;}'
    +
    'div._14n, div._14o {border-color: rgba(32, 92, 195, 1) -moz-use-text-color -moz-use-text-color !important;}'
    // // // // // ACTIVITY LOG
    +
    '._417b {border-bottom: 2px solid rgba(14, 55, 117, 1) !important;}'
    +
    '._40pu {border-bottom: 1px solid rgba(9, 47, 110, 1) !important;}'
    +
    '._40pv {background-color: rgba(9, 47, 110, 1) !important; color: #BBC !important;}'
    +
    '.uiSelectorNormal .uiSelectorButton:hover, .uiSelectorNormal .uiButtonSuppressed:hover {background-image: none !important;}'
    +
    '.pbs .pam, .pbs ._711 {background-color: #1A356C !important;}'
    +
    '.uiHeaderTop .uiHeaderTitle, .rfloat .uiList {background-color: #0D2C54 !important;}'
    +
    '.uiBoxYellow {border: 1px solid rgba(30, 53, 87, 1) !important;}'
    +
    '._42ft, ._4jy0, ._4jy3, ._517h, ._51sy, button, .ego_action a, .ego_action button {color: #BBC !important;}'
    +
    '.fbChatSidebar .fbChatSidebarMessage {background-color: rgba(1, 109, 215, 1) !important; border-top: 1px solid rgba(35, 101, 200, 1) !important; box-shadow: 0px 1px rgba(5, 87, 156, 1) inset !important;}'
    +
    '.fbChatReconnectLink {color: rgba(128, 183, 236, 1) !important;}'
    // // // // // GROUPS
    +
    '._5mo5 ._5r2h {color: #BBC !important;}'
    +
    '.uiBoxRed {border: 1px solid rgba(14, 84, 227, 1) !important;}'
    +
    '._o8s, .u_n_9 a, .prl ~ div a, .groupsRecommendedTitle, .UFISeenCount span, .userSuggestionListMoreLink a, #count_text {color: rgba(83, 130, 228, 1) !important;}'
    +
    '.uiToken {background: none repeat scroll 0% 0% rgba(28, 90, 198, 1) !important; border: 1px solid rgba(29, 112, 194, 1) !important; color: #BBC !important;}'
    +
    '.borderItem {border-right: 1px solid rgba(25, 87, 180, 1) !important;}'
    +
    '._21av:hover {background-color: rgba(23, 38, 84, 1) !important;}'
    +
    '._5e4h._5e2k, ._5e4h ._5e2k {background-color: rgba(40, 100, 203, 1) !important; border-color: rgba(49, 121, 216, 1) rgba(64, 140, 215, 1) rgba(78, 136, 212, 1);}'
    +
    '.uiTextareaNoResize, .uiTextareaAutogrow, ._21ax {border: 1px solid rgba(41, 91, 176, 1) !important;}'
    +
    '._552h .uiTextareaAutogrow, ._n4k .uiTextareaAutogrow, ._n4k ._552m, ._552h ._552m {border: 0px solid rgba(0,0,0,0) !important;}'
    +
    '._6a .uiList, ._6d .uiList {border-radius: 8px !important; padding: 0.5em !important;}'
    +
    '.uiComboInput {border: 1px solid rgba(30, 83, 173, 1) !important;}'
    +
    '.uiSelectorButton, .uiSelectorButton:active, .uiSelectorButton:focus, .uiSelectorButton:hover, .uiButtonSuppressed:active, .uiButtonSuppressed:focus, .uiButtonSuppressed:hover {background-image: none !important; background-color: rgba(33, 106, 189, 1) !important;}'
    +
    '._4h6j {opacity: 0.7 !important;}'
    +
    '._55xm {border-bottom: 1px solid rgba(9, 72, 134, 1) !important;}'
    +
    '.fbTimelineSection {background-color: rgba(10, 29, 57, 1) !important; border-color: rgba(20, 56, 131, 1) !important;}'
    +
    '.fbTimelineFeedbackActions {background-color: rgba(29, 51, 117, 1) !important;}'
    +
    '.fbTimelineUFI {background-color: rgba(21, 48, 90, 1) !important;}'
    +
    '.groupsJumpHeaderSearch .uiSearchInput {border-color: #1E4598 #244DA2 #1D469C !important;}'
    +
    '.fbCalendar .fbCalendarHeader {background-color: #0D2C54 !important;}'
    +
    '._55r3 {background-color: #154FB1 !important; border: 1px solid rgba(30, 89, 186, 1) !important;}'
    +
    '._5e4h._5e2k, ._5e4h ._5e2k, .groupProfileCompletionProgressBar {background-color: rgba(21, 76, 159, 1) !important; border-color: rgba(51, 118, 204, 1) rgba(17, 105, 191, 1) rgba(29, 95, 180, 1) !important;}'
    +
    '._1dsp, ._4-, ._5t_y ._1dsp {background-color: #1A356C !important;}'
    +
    '.filterBox {border-bottom: 1px solid rgba(26, 79, 132, 1) !important;}'
    +
    '.multiColumnCheckable .anchor {border-color: rgba(7, 34, 65, 1) !important;}'
    +
    '.multiColumnCheckable .anchor:hover {background-color: rgba(29, 46, 98, 1) !important; border-color: rgba(14, 36, 102, 1) !important;}'
    +
    'form.async_saving ._42fu._42g-, a.async_saving._42fu._42g-, ._42g-._42fr, ._42g-._42fr:active, ._42g-._42fr:focus, ._42g-._42fr:hover {background: none repeat scroll 0% 0% rgba(29, 70, 155, 1) !important; border-color: rgba(35, 86, 192, 1) !important;}'
    +
    '.pop_content .dialog_summary {background: none repeat scroll 0% 0% rgba(21, 75, 129, 1) !important; border-bottom: 1px solid rgba(10, 54, 111, 1) !important;}'
    +
    '.pop_content .dialog_body {border-bottom: 1px solid #114A81 !important; background-color: rgba(9, 36, 71, 1) !important;}'
    +
    '.pop_content h2.dialog_title {background-color: rgba(27, 58, 122, 1) !important;}'
    +
    '.fbEditCover .instructions {background-color: rgba(43, 79, 180, 0.4);}'
    +
    '._42fu._42fr {background-color: rgba(38, 96, 153, 1) !important; border-color: rgba(64, 101, 189, 1) !important;}'
    // // // // // UPLOAD
    +
    '._7r2 {background-color: rgba(20, 22, 74, 1) !important; border-right: 1px solid rgba(25, 72, 153, 1) !important;}'
    +
    '._4t2a. _4-i2, ._4t2a ._4t2a, ._4t2a ._5a8u {background-color: rgba(10, 24, 53, 1) !important;}'
    +
    '._1l-7 {border: 1px solid rgba(23, 59, 149, 1) !important;}'
    +
    '.__5y ._4p89, .__5y ._4p8a {border: 1px solid rgba(12, 33, 68, 1) !important; background: #1A356C !important;}'
    +
    '._3bg {background-color: #14164A !important; border-top: 1px solid rgba(21, 72, 150, 1) !important;}'
    +
    '.__5y ._4p89 label {padding-bottom: 22px !important;}'
    +
    '.__5y ._4p87 input, .uiTypeaheadView li {color: #BBC !important;}'
    +
    '.PlacesTypeaheadViewPopulated {background-color: #1A356C !important;}'
    +
    '._a3f, .uiMediaThumbImg {opacity: .75 !important;}'
    +
    '.uiMediaThumbWrap {background: none repeat scroll 0% 0% rgba(33, 102, 170, 1) !important; border: 1px solid rgba(23, 84, 162, 1) !important;}'
    +
    '._5ssz ._4jo-.addPhotosEnabled ._5h6w, ._5ssz ._4jo-.addPhotosDisabled ._5h6u {border: 1px dashed #173B95 !important;}'
    +
    '.uiMediaThumb {background: none repeat scroll 0% 0% rgba(23, 51, 101, 1) !important; border: 1px solid rgba(69, 107, 173, 1) !important;}'
    +
    '._33_l ._33_i {background-color: rgba(15, 39, 87, 1) !important; border-top: 1px solid rgba(30, 70, 168, 1) !important;}'
    +
    '._33_l {border: 1px solid rgba(31, 72, 173, 1) !important;}'
    +
    '._33_b {background-color: #0F2757 !important;}'
    +
    '._5nlo {background-color: rgba(19, 112, 218, 1) !important; border: 1px solid rgba(46, 142, 236, 1) !important;}'
    // // // // // BLOCKS
    +
    '.SettingsPage_Content .fbSettingsList .fbSettingsListItemLabel, .uiInfoTable .label {color: #BBC !important;}'
    +
    '._iw3 {background-color: rgba(6, 44, 83, 1) !important; border-bottom: 1px solid rgba(14, 46, 144, 1) !important; border-top: 1px solid rgba(29, 59, 150, 1) !important;}'
    +
    '._4q_r {background-color: rgba(9, 77, 195, 1) !important;}'
    +
    '.uiSideNav .selectedItem .item {background-color: rgba(48, 96, 192, 1) !important;}'
    +
    '.uiSideNav .item, .uiSideNav .subitem {border-bottom: 1px solid rgba(26, 67, 128, 1) !important;}'
    +
    '.pls strong, ._51mz {color: #BBC !important;}'
    +
    '._6cx {border-top: 1px solid rgba(39, 85, 144, 1) !important;}'
    +
    '._6cw {border-bottom: 1px solid rgba(40, 78, 128, 1) !important;}'
    +
    '.fbSettingsSections .fbSettingsSectionsItem.fbSettingsSectionsItemBorderTop {border-top: 1px solid rgba(26, 78, 158, 1) !important;}'
    +
    '.fbSettingsList .fbSettingsListItemSaved, .fbSettingsList .fbSettingsListItemEdit, .mvm a , .uiP a, .fsm a {color: rgba(49, 130, 222, 1) !important;}'
    +
    '._5e8l {border: 1px solid rgba(20, 61, 165, 1) !important;}'
    // // // // // APPS
    +
    '._57ne, ._57nf:hover, ._4na1, ._29x7, ._5vrk, ._tph ._tpl {color: #BBC !important;}'
    +
    '._4n9s, ._4na3 {background-color: rgba(24, 66, 140, 1) !important;}'
    +
    '._4n9u, ._4mq3 .fbNubButton .label .count {color: rgba(88, 168, 236, 1) !important;}'
    +
    '._3fig:hover {background: none repeat scroll 0% 0% rgba(34, 98, 195, 1) !important;}'
    +
    '._d4t {border: 1px solid rgba(48, 76, 161, 1) !important;}'
    +
    '._3fij {border-top: 1px solid rgba(54, 78, 152, 1) !important;}'
    +
    '._3q73 {background: none repeat scroll 0% 0% #153F89 !important;}'
    +
    '._498i, ._5vrs a, .ptm a, a[href="/safety"], a[href="/safety/bullying"] , a[href="/about/safetycheck"], a[href="/communitystandards"] {color: rgba(52, 136, 245, 1) !important;}'
    +
    '._11sf {border-bottom: 1px solid rgba(39, 71, 167, 1) !important;}'
    +
    '._4g7g {border-top: 1px solid rgba(39, 71, 167, 1) !important;}'
    +
    'form.async_saving .uiButton.uiButtonConfirm, .uiButtonConfirm.uiButtonDisabled, .uiButtonConfirm.uiButtonDisabled:active, .uiButtonConfirm.uiButtonDisabled:focus, .uiButtonConfirm.uiButtonDisabled:hover {background-color: rgba(18, 53, 128, 1) !important; border-color: rgba(39, 93, 206, 1) !important;}'
    +
    '._tpp {border-top: 1px solid rgba(30, 73, 147, 1) !important;}'
    +
    '._3oxc {border-color: rgba(27, 73, 134, 1) -moz-use-text-color -moz-use-text-color !important;}'
    +
    '._6lp .fsm, ._6lp ._4kg {background-color: rgba(0,0,50,.4) !important;}'
    // // // // // SAFETY
    +
    '.safetyIntro {background-color: rgba(20, 31, 65, 1) !important; border-bottom: 1px solid rgba(15, 48, 98, 1) !important;}'
    +
    '.safetyStreamHeader {border-bottom: 1px solid rgba(25, 69, 137, 1) !important;}'
    +
    'a i.img, .blockImage, ._9_d .img, ._8o .img {opacity: .8 !important;}'
    // // // // // UPLOAD INLINE
    +
    '._2oh {border: 2px dashed rgba(39, 98, 188, 1) !important;}'
    +
    '._5t_y ._1dsv ._1dsr {background-color: rgba(18, 100, 170, 1) !important;}'
    +
    '._5t_y ._509o, ._5t_y ._509o:hover {background-color: rgba(17, 77, 156, 1) !important; border-color: rgba(39, 81, 143, 1) !important;}'
    // // // // // SITE PAGES
    +
    '._5ybo {border-bottom: 1px solid rgba(15, 39, 81, 1) !important; border-top: 1px solid #0F2751 !important;}'
    +
    '._5em9 {background-color: #1A356C !important; text-shadow: 0px 1px 0px rgba(41, 79, 116, 1) !important;}'
    +
    '._12u8 {background: none repeat scroll 0% 0% #1A356C !important;}'
    +
    '._5dro {background-image: none !important;}'
    +
    '._5vg- {background-color: #003A74 !important; border-bottom: 1px solid rgba(22, 63, 146, 1) !important;}'
    +
    '._5vgz, .sidebarMode #globalContainer ._5vgz.fixed_elem {background-color: rgba(10, 43, 86, 1) !important; border: 1px solid rgba(14, 58, 168, 1) !important;}'
    +
    '._5y4o, ._5cag, ._5cag span {color: #BBC !important;}'
    +
    '._5cag:hover {background-color: #154FB1 !important;}'
    +
    '._5y4o {border-bottom: 1px solid rgba(10, 43, 128, 1) !important;}'
    +
    '._5cag, .uiPopover ._5cag, ._5cag:hover {border-left: 1px solid rgba(44, 84, 206, 1) !important;}'
    +
    '.uiContextualDialogArrowTop .uiContextualDialogArrow, .uiOverlayFooterButtons a, ._5dro {background-image: none !important;}'
    +
    '._5dro {border-bottom: 1px solid #1A346B !important;}'
    +
    '._cd2 {border-bottom: 1px solid rgba(26, 76, 152, 1) !important;}'
    +
    '._cc- {border: 1px solid rgba(33, 51, 105, 1) !important;}'
    +
    '._ccz, ._ccz label, ._29d1 {background-color: rgba(28, 68, 150, 1) !important;}'
    +
    '._29d1:hover {background-color: rgba(22, 44, 89, 1) !important; border: 1px solid rgba(26, 64, 161, 1) !important;}'
    +
    '.fbStarGridAsTimelineUnit .fbStarGrid {background: none repeat scroll 0% 0% rgba(16, 74, 174, 1) !important; border-color: rgba(29, 89, 215, 1) !important;}'
    +
    '._53f0 {background-color: rgba(12, 34, 78, 1) !important; border: 2px dashed rgba(39, 78, 174, 1) !important;}'
    +
    '.fbPhotosRedesignNavItem {background-color: rgba(32, 70, 147, 1) !important;}'
    +
    '.fbPhotosRedesignNavItem:hover {background-color: rgba(26, 43, 93, 1) !important;}'
    +
    '.fbPhotosRedesignNavSubtitle, ._5vh0, ._5vh1, ._5hue > a, ._5dw9 ._38my, ._38my, ._3sts {color: #BBC !important;}'
    +
    '._5hue > a:hover {background-color: rgba(20, 46, 99, 1) !important;}'
    +
    '._47ol, ._1f1h ._1f1d, ._5ato, ._5ato a, ._4-u2 a {color: rgba(90, 140, 248, 1) !important;}'
    +
    '._50f4 a {color: rgba(44, 98, 212, 1) !important;}'
    +
    '._1f1h > span:nth-child(2) {border-left: 1px solid rgba(59, 97, 212, 1) !important;}'
    +
    '._5xdz span {color: #A3C0FF !important;}'
    +
    '._525w {border-left: 1px solid rgba(41, 66, 140, 1) !important; border-right: 1px solid rgba(27, 58, 153, 1) !important;}'
    +
    '._1f1f {border-bottom: 1px solid rgba(21, 79, 167, 1) !important; border-top: 1px solid rgba(17, 78, 147, 1) !important;}'
    +
    'div._3a0_ div._3a10 {background-color: #0A4383 !important;}'
    +
    '._4za_ {background: none repeat scroll 0% 0% rgba(16, 41, 93, 1) !important; border: 1px solid rgba(16, 59, 168, 1) !important;}'
    +
    '._56h9 {border: 1px dashed rgba(39, 100, 207, 1) !important;}'
    +
    'img[src="/images/blank-profilepic.png"] {opacity: .5 !important;}'
    +
    '.ptm .uiButton {background-image: none !important;}'
    +
    '._kj3 {background: none repeat scroll 0% 0% #1A274E !important; border: 1px solid rgba(20, 62, 132, 1) !important;}'
    +
    '._6z- .uiSideNav .selectedItem > .item, ._6z- .uiSideNav .selectedItem > .subitem {border-top: 1px solid rgba(19, 44, 84, 1) !important;}'
    +
    '._z6j {background-color: #1A356C !important; border: 1px solid rgba(11, 72, 197, 1) !important;}'
    +
    '.uiSideNav .item:active, .uiSideNav .subitem:active {background-color: rgba(17, 92, 168, 1) !important;}'
    +
    '.__wu ._539-.roundedBox .uiSearchInput button {background-position: -1px -1347px !important;}'
    +
    '._t {background-color: #1A356C !important;}'
    +
    '#fbProfileCover ._xlg, #fbTimelineHeadline .profilePicThumb .img  {opacity: .8 !important;}'
    +
    '._1lor {background-color: rgba(31, 97, 162, 1) !important; border-color: rgba(40, 81, 186, 1) rgba(25, 64, 161, 1) -moz-use-text-color !important;}'
    +
    '._1lot {background-color: #103266 !important; border: 1px solid #1B3F99 !important;}'
    +
    '._1lou {border-left: 1px solid rgba(43, 74, 152, 1) !important;}'
    +
    '._54ni._3ew_:before {background-color: #2E5493 !important;}'
    +
    '._58gm ._51xa {background: none repeat scroll 0% 0% padding-box rgba(28, 79, 168, 1) !important;}'
    +
    '._3y89 {border: 1px solid rgba(14, 96, 189, 1) !important;}'
    +
    '._jlw {background: #1A356C !important; border-color: #1854AE !important;}'
    +
    '._4m78 {background: #0A62AE !important;}'
    +
    '._5esr, ._5fdd {color: #6B9CF2 !important;}'
    +
    '._5esn {border-bottom: 1px solid #305DBA !important;}'
    +
    '._5n7j {text-shadow: 0px 1px 0px #0A4D98 !important;}'
    +
    '._1ta1, ._1zuq {border-top: 1px solid #2A4B9F !important;}'
    +
    '._4-lt, ._4kt > li {border-color: #2A4B9F;}'
    +
    '#js_2b {color #7EA3F0 !important;}'
    +
    '._35sm ._4-lt {border-color: #002163 !important;}'
    // // // // // INFO
    +
    '._3p9 td:nth-child(odd), ._3p9 th {background: none repeat scroll 0% 0% rgba(14, 53, 122, 1) !important; color: #BBC !important; border: 1px solid rgba(11, 37, 72, 1) !important;}'
    +
    '.fcb a, ._3p8 a {color: rgba(128, 165, 243, 1) !important;}'
    // // // // // UPLOADED INLINE
    +
    '._5esl td._5esw {background: #1A356C none repeat scroll 0% 0% !important;}'
    +
    '._5esl td._5esm:first-child {background: #0A4383 none repeat scroll 0% 0% !important; border-right: 1px dotted #264EB0 !important;}'
    +
    '._59_m, ._58ak {background-color: #1A356C !important; border: 1px solid #0D4793 !important;}'
    +
    '._50hx, ._50hx:hover {background-color: #0A4383 !important; border-left: 1px solid #103678 !important; border-right: 1px solid #103678 !important;}'
    +
    '.__9u {border: 2px dashed #2773E6 !important;}'
    +
    '._jfc::after {border: 1px solid #2773E6 !important;}'
    +
    '._jfc img {opacity: .82 !important;}'
    +
    '._5itl:hover, ._5itl:focus {background-color: #0A4383 !important;}'
    +
    '.stat_elem a:hover {background-color: rgba(0,0,0,0) !important;}'
    +
    '._3xen:hover {background-color: #1456AB !important;}'
    +
    '._42ft {border: 1px solid rgba(14, 50, 125, 0.6) !important;}'
    +
    '._5cy7:hover {background-color: #124587 !important;}'
    // // // // // UPDATE PROFILE PIC
    +
    '._4liw {background-color: #0A1C35 none repeat scroll 0% 0% !important;}'
    +
    '._4on7, ._3mk2, ._1k3w {opacity: .82 !important;}'
    +
    '._5h2b, ._2qsi {border-bottom: 1px solid #295EAE !important;}'
    +
    '._5h2c::after {background-color: #2349BA !important; border-left: 4px solid #1A4695 !important; border-right: 4px solid #1A4695 !important;}'
    +
    '._5uaq:hover {background-color: #2053AB !important;}'
    +
    '._5ww7._5ww9 {background-color: #1A356C !important; border-color: #16509B !important;}'
    +
    '._5ww7 {color: #5B85D5 !important;}'
    +
    '.separatorLine {border-top: 1px solid #0F1921 !important;}'
    // // // // // OVERRIDES
    +
    'label, ._8_k, ._8_k a, ._5qtp, ._gx7, ._71u, ._3s_ {color: #BBC !important; background-image: none !important;}'
    +
    '._513x {background-image: none !important;}'
    +
    '.uiHeaderTitle {background-color: #0E5CA8 !important;}'
    +
    '._5qtq, ._5qtq:after {border-bottom: 0px solid rgba(0,0,0,0) !important; border-left: 0px solid transparent; border-right: 0px solid transparent;}'
    +
    '.uiButtonGroup .uiButtonGroupItem {border-left: 1px solid rgba(16, 88, 170, 1) !important;}'
    +
    '.name .uiButtonGroup {background-color: rgba(15, 67, 134, 1) !important; border: 1px solid rgba(15, 87, 149, 0.35) !important;}'
    +
    '._54ja {border-top: 1px solid rgba(12, 56, 134, 1) !important;}'
    +
    '._5izg {border-bottom: 1px solid rgba(28, 64, 171, 1) !important;}'
    +
    '._1zw4, ._18dl, article div {background-color: #1A356C !important;}'
    +
    '._1zw4 ._4kg, ._1kny .uiList {border-top: none !important; border-bottom: none !important;}'
    +
    '._42ft, ._4jy0, ._55pi, ._5vto, ._55_p, ._2agf, ._4jy3, ._517h, ._51sy, .ego_action a button, ._5ymq a button, .gecko ._4jy0:focus {background-color: rgba(21, 79, 177, 1) !important;}'
    +
    '._1dsl {border-bottom: 1px solid rgba(10, 92, 185, 1) !important;}'
    +
    '._5t_y ._1dsp {border-top-color: rgba(233, 234, 237, 0) !important;}'
    +
    '._5t_y ._1dsl li:after {background: none repeat scroll 0% 0% rgba(16, 95, 198, 1) !important;}'
    +
    '._5q5b ._50mz .emoticonsPanel ._5r8f.panelFlyout, ._51mz {background-color: #1A356C !important;}'
    +
    '._5r8e {border-bottom: 1px solid rgba(24, 95, 174, 1) !important;}'
    +
    '._5r86 {border-left: 1px solid rgba(24, 95, 174, 1) !important;}'
    +
    '._5r8a._5r8b {background: none repeat scroll 0% 0% rgba(4, 35, 98, 1) !important;}'
    +
    '._5r8h:hover {background-color: rgba(18, 90, 162, 1) !important;}'
    +
    '._2c44 ._2f6b {background: linear-gradient(rgba(19, 134, 233, 1), rgba(20, 106, 192, 1)) repeat scroll 0% 0% padding-box transparent !important;}'
    +
    '._5r8i, .fbPhotoImage, ._29s2 {opacity: .8 !important;}'
    +
    '.panelFlyoutArrow {background-image: none !important;}'
    +
    '._eb3:before {background-color: rgba(20, 87, 173, 1) !important;}'
    +
    '.emoticonsTable table tbody {background-color: #1A356C !important;}'
    +
    '.sp_lfN_4lQwte7 {background-color: #1A356C !important;}'
    +
    '._5rai, ._5r5l, ._5r5m, .ellipsis span {color: #BBC !important;}'
    +
    '._5r5i {background: none repeat scroll 0% 0% #1A356C !important;}'
    +
    '.sp_lfN_4lQwte7 {background-color: rgba(17, 58, 141, 0) !important;}'
    +
    '._5r5f {background: none !important;}'
    +
    '._18s4 {background-color: rgb(18, 69, 135) !important;}'
    +
    '.mtm a, ._6q a {background-color: rgba(0,0,0,0);}'
    +
    '._5wvt ._5lz7, ._5wvt ._5oln, ._5wvt ._578f {color: #BBC !important;}'
    +
    '._517h, ._59pe:focus, ._59pe:hover, ._517h._42fr:active, ._517h._42fr._42fs {text-shadow: 0px 1px 0px rgba(86, 100, 119, 1) !important;}'
    +
    '._4jy0, ._59pe, ._59pe:focus, ._59pe:hover {background-image: none !important;}'
    +
    '.fbTimelineMapContainer {background: none repeat scroll 0% 0% rgba(9, 23, 51, 1) !important;}'
    +
    '.uiButtonGroup {background-color: rgba(35, 85, 161, 0.52) !important;}'
    +
    '._3sz, ._4un7 a, .uiBoxGray a {color: rgba(129, 160, 227, 1) !important;}'
    +
    '._569t ._54nc {border-color: #225CA8 !important;}'
    +
    '._3v07 .groupsJumpBarTop .groupsCleanLinkBorder:after {background: none repeat scroll 0% 0% rgba(52, 85, 185, 1) !important;}'
    +
    '._3v07 .groupsJumpBarTop, .fbWantsDragDrop, ._4g6z {background-color: #1A356C !important;}'
    +
    '._4g6x {background-color: rgba(41, 71, 141, 0.95) !important; border: 2px dashed rgba(38, 110, 210, 1) !important;}'
    +
    '._5yk1 {background-color: #1A356C !important;}'
    +
    '._4h96 {height: 32px !important;}'
    +
    '.UFILikeSentenceText span span a, .profileLink {color: rgba(83, 152, 255, 1) !important;}'
    +
    '._5b_0 ._5p3y .fsm, ._5bgz ._5p3y .fsm, ._578n, #u_0_y .fsm, #u_0_y .fwb {background: rgba(0,0,0,0) !important; font-size: 1.2em !important;}'
    +
    '._5b_0 ._5p3y, ._5bgz ._5p3y, ._5b_0 .fsm, ._5bgz .fsm {background-color: rgba(26, 52, 107, 0) !important;}'
    +
    '.rhcFooterWrap .fsm, .rhcFooterWrap .fwn, .rhcFooterWrap .fcg {background-color: rgba(26, 52, 107, 0) !important;}'
    +
    '._2i-0:hover {background-color: rgba(7, 43, 80, 1) !important;}'
    +
    '.groupsJumpBarTop {border-top: 1px solid rgba(24, 60, 101, 0) !important;}'
    +
    '.uiHeaderTop .uiHeaderTitle, .rfloat .uiList {background-color: #1A274E !important;}'
    +
    '._57fo {background-color: rgba(22, 61, 128, 1) !important;}'
    +
    '.fbStarGrid .uiMediaThumb:before {background-color: rgba(0, 23, 47, 0) !important; background-image: none !important;}'
    +
    '._2uhm ._2ui0 {background: linear-gradient(to right, rgba(17, 58, 119, 1), transparent) repeat scroll 0% 0% transparent !important;}'
    +
    '._5aeo {backround: rgba(0,0,0,0) !important;}'
    +
    '._ab4 ._3yv8._5aer ._5aeo {background-color: rgba(9, 40, 87, 0) !important;}'
    +
    '._5vx4 ._5vwz, ._5vx4 ._45hd {border-left: 1px solid rgba(41, 86, 179, 1) !important;}'
    +
    '.sp_1vhXLuAIRj_ {background-image: -moz-linear-gradient(top, rgba(20,40,80,0) 0%, rgba(20,40,80,1) 100%) !important; background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(20,40,80,0)), color-stop(100%, rgba(20,40,80,1))) !important; background: -webkit-linear-gradient(top, rgba(20,40,80,0) 0%, rgba(20,40,80,1) 100%) !important; background: -o-linear-gradient(top, rgba(20,40,80,0) 0%, rgba(20,40,80,1) 100%) !important; background: -ms-linear-gradient(top, rgba(20,40,80,0) 0%, rgba(20,40,80,1) 100%) !important; background: linear-gradient(to bottom, rgba(20,40,80,0) 0%, rgba(20,40,80,1) 100%) !important;}'
    +
    '.fbTimelineSection {background: none repeat scroll 0% 0% rgba(17, 51, 111, 1) !important;}'
    +
    'div.uiTypeaheadView li.calltoactionV2 {background-color: #1A356C !important; border-color: #1A356C !important;}'
    +
    '.fbRemindersContent .fbRemindersContentHeader {border-bottom: 1px solid rgba(41, 86, 179, 1) !important;}'
    +
    '.PlacesTypeaheadMapWrapper {opacity: .8 !important;}'
    +
    '._5l2e ._5l2f ._5l2i, ._5l2e ._4bl9 ._5l2i {background: #0A4383 !important;}'
    +
    '._3p8, ._5cff {color: #BBC !important;}'
    +
    '._2pi9 a, ._2pie a {color: rgba(110, 147, 224, 1) !important;}'
    +
    '._y5i {border-top: 1px solid rgba(25, 62, 110, 1) !important;}'
    +
    '._4w6q {border-top: 1px dashed rgba(25, 72, 143, 1) !important;}'
    +
    '._4w6q:last-child {border-bottom: 1px dashed rgba(25, 72, 143, 1) !important;}'
    +
    '._4x1u {background-color: #1A356C !important; border: 1px solid rgba(32, 71, 145, 1) !important;}'
    +
    '._if {color: #BBC !important;}'
    +
    '.litestandClassicWelcomeBox.fbxWelcomeBox a, .litestandClassicWelcomeBox.fbxWelcomeBoxSmall a {color: rgba(81, 162, 254, 1) !important;}'
    +
    '.uiHeaderBottomBorder {border-bottom: 1px solid rgba(23, 78, 140, 1) !important;}'
    +
    '._4-dc {opacity: 0.5 !important;}'
    +
    '.friendListItem .outline {border: 3px solid rgba(26, 99, 195, 1) !important;}'
    +
    '.friendListItem .anchor {border: 1px solid rgba(20, 88, 165, 1) !important;}'
    +
    '.friendListItem:hover .outline {border-color: rgba(86, 159, 230, 1) !important;}'
    +
    '._4un6 {text-shadow: 0px 1px 0px rgba(87, 132, 201, 1) !important;}'
    +
    '#timeline_tab_content .fbTimelineSection {background-color: #132047 !important;}'
    +
    '._rzn {border: 1px solid #254BAD !important;}'
    +
    '._39s2 {border-bottom: 1px solid #254BAD !important;}'
    +
    '._43rz {color: #4E8CF8 !important;}'
    +
    '._51m- a {background-color: rgba(0,0,0,0) !important;}'
    +
    '.__6k, .__6l, __6j div {color: #8092C3 !important;}'
    +
    '._r38 {border-top: 1px solid rgba(204, 204, 204, 0) !important;}'
    +
    '.reDesignedBtn {background: transparent -moz-linear-gradient(center top, #338BEF 0%, #0E468F 100%) repeat scroll 0% 0% !important; background-position: 0px 0px !important;}'
    +
    '.__wu ._539-.roundedBox .uiSearchInput button {background-position: 0px 0px !important;}'
    +
    '._54nc {background-color: rgba(0,0,0,0) !important;}'
    +
    '._1cis ._54ak {border-bottom: 1px solid #224393 !important;}'
    +
    '._3odc {background-color: #133070 !important;}'
    +
    '._42td {background-color: #1F6CD1 !important; border: 1px solid #1B6DCB !important; opacity: .7 !important;}'
    +
    '._4l9a {border-right: 1px solid #0A4383 !important;}'
    +
    '._4-u2 div, ._3oc7 div, ._4-u8 div {background-color: none !important;}'
    +
    '.jewelItemResponded, .jewelItemNew {background: #0E255F !important;}'
    +
    '._36zg {color: #6DA6F2 !important;}'
    +
    '._6dh ._1dsp {border-top-color: #0F3A7B !important;}'
    +
    '.UFIUnseenItem {border-left: 2px solid #134AAA !important;}'
    +
    '._1qmt.recommendedPagesContentCarouselUI ._58rc {border-left: 1px solid #114FA1 !important; border-right: 1px solid #114FA1 !important;}'
    +
    '._3aer {border-bottom: 1px solid #172A42 !important;}'
    +
    '._5v54 {color: #6DA1E6 !important;}'
    +
    '._5y02:hover, ._5f_8:hover {background-color: #0F59A2 !important;}'
    +
    '._fwu {color: #B9C9F3 !important;}'
    +
    '._fww {color: #5A8CF8 !important;}'
    +
    '._18s5 {border-bottom: 1px solid #0141B1 !important;}'
    +
    '._5q5b ._552n {background: rgb(26, 53, 108) !important;}'
    +
    '.fbPhotosPhotoActions .iconActionLinks {border-bottom: 1px solid #0A1F50 !important;}'
    +
    '._5u8u {background-color: #274D92 !important;}'
    +
    '._3e7u ._1ekr {box-shadow: 0px 0px 1px #071E47 inset, 0px 1px 0px 0px rgba(0, 0, 0, 0.04) !important;}'
    +
    '._3e7u ._1ekr {background-color: #0C3169 !important;}'
    +
    '._3e7u ._1ekr {border-color: #103E9C #0B3F8F !important;}'
    +
    '._1ekr ._29ey {color: #7199EF !important;}'
    +
    '.fbNubFlyoutHeader, .fbNubFlyoutBody, .fbNubFlyoutFooter, .fbNubFlyoutAttachments {background-color: #092156 !important;}'
    +
    '.fbNubFlyoutAttachments, .fbNubFlyoutHeader, .fbNubFlyoutBody, .fbNubFlyoutFooter {border-color: #0B1B3C !important;}'
    +
    '.fbNubFlyoutTitlebar {background: #0B204D !important; border-color: #051841 !important;}'
    +
    '._a7s, .UFIRow._4204, .UFIList .UFIRow, .UFILikeSentence, ._5vsj ._48pi, .UFIComment, ._4oep {border-top: 1px solid #12234E !important;}'
    +
    '._5vsj.UFIContainer .UFIReplyList ._4oep._2o9m::after, ._5vsj.UFIContainer .UFIReplyList ._4oep._4204::after {border-left: 2px solid #0C2668 !important;}'
    +
    '.uiScrollableAreaContent {background: #0F2C5D !important;}'
    +
    '._5vsj._5vsj._5vsj {background-color: #103A63 !important;}'
    +
    '._4xdg {border-top: 1px solid #083166 !important;}'
    +
    '.fbPhotosSnowboxFeedbackInput .UFIRow {background-color: #1A356C !important;}'
    +
    '._5vsj ._4_dr._4_dr {background: #1A356C !important;}'
    +
    '._5ugf {background-color: #1268D8 !important; color: #BFCFEC !important;}'
    +
    '._18fs {border-bottom: 1px solid #143F75 !important;}'
    +
    '._5vsj .UFIRow._2o9m {background: #1A356C !important;}'
    +
    '._46-5 {border-top: 1px solid #18358C !important;}'
    +
    'a ._blb, ._r8r {color: #D2DAF0 !important;}'
    +
    '._221x {background: url("/rsrc.php/v2/yZ/r/a-ZN6WoEOje.png") -101px -417px !important;}'
    /* PEOPLE YOU KNOW */
    +
    '._32jy ul {min-height: 240px !important;}'
    +
    '._32jv {top: 165px !important;}'
    +
    '._2xq {background-color: rgba(7, 31, 63, 0) !important;}'
    /* HARD-TO-SEE ICONS */
    +
    '#js_*, #js_g, #js_d, #js_c, ._m, .UFICommentStickerButton, .UFICommentPhotoIcon, .UFIPhotoAttachLinkWrapper, .UFICommentAttachmentButtons {background-color: rgba(20, 111, 230, 1) !important;}'
    +
    '.emoteTogglerImg {background-position: -27px -442px !important;}'
    +
    'a[role="button"], button[type="submit"], ._42ft, ._4jy0, ._55pi, ._5vto, ._55_p, ._2agf, ._4jy3, ._517h, ._51sy, .ego_action a button, ._5ymq a button, .gecko ._4jy0:focus {color: #BBC !important;}'
    +
    '.pam, ._711 {background-color: #1A356C !important;}'
    +
    '.emoticonsPanel .panelCell:hover {outline: 1px solid rgba(36, 96, 174, 1) !important;}'
    +
    '.friendConfirmedNotifsUnread {background-color: #1E519C !important;}'
    +
    '.fbChatOrderedList i.img, .fbChatOrderedList i._586_ {transform: scale(2) !important;}'
    +
    '.UFIList {background-color: #1A356C !important;}'
    +
    '._519b ._2wr {opacity: .65 !important;}'
    +
    '._2f6g {color: #DDE !important;}'
    +
    '._1g5v + ._4arz {background: #1A356C !important;}'
    +
    '.fbNubButton {background-image: none !important;}'
    +
    '._4d3w._u77 ._3t09 {background: #0F2C5D !important;}'
    +
    '._5140 {background-color: #074FAE !important; border-bottom: 4px solid #133051 !important;}'
    +
    '._5141 ._5144::after {background: #1A2F44 !important;}'
    +
    '._5146, a._kro[role="button"] span {color: #DDE7EE !important;}'
    +
    '._3rnu {background: #4B95DE !important;}'
    +
    '._bkx {border-top: 1px solid #173887 !important;}'
    +
    '._5hp4 {background: #162D5B !important;}'
    +
    '._5q91 {border-bottom: 1px solid #0D1D2F !important;}'
    +
    '._4q6d {background: #13264D !important;}'
    +
    '._2_k6:hover {background-color: #114890 !important;}'
    +
    '._50f4, ._5z0i, ._3hdt, ._585r, ._50f4, ._5z0i, ._2jmp a, ._e0v {color: #DDE !important;}'
    +
    '._4te0 {background-color: #1A356C !important;}'
    +
    '._4te4 {background-color: #0E192A !important;}'
    +
    '._2jmp {background-color: #003A74 !important; border-bottom: 1px solid #143C81 !important;}'
    +
    '._3ru1 {border-color: #0F3356 !important;}'
    +
    '._3rt_ ._3ru1 > label {background: #1F4474 !important;}'
    +
    '._585r {background: #003A74 !important;}'
    +
    '._5fvg ._3ala:hover {background: #132345 !important;}'
    +
    '._585o {background-color: #1459C0 !important; border-color: #1459C0 !important;}'
    +
    '._2is9 ._5rec {background-color: #1A356C !important;}'
    +
    '.fbPhotoTagger ._570u {background: rgb(26, 52, 107) !important;}'
    +
    '.UFILikeSentence ._ipn a {color: #9DC9EF !important;}'
    +
    '._2246 {background-color: #10589F !important;}'
    +
    '._2sl4 {color: DDE !important;}'
    +
    '.timelineLayout {background-color: rgba(25, 50, 126, 1) !important;}'
    +
    '._ei_ {border-top: 1px solid #1A356C !important;}'
    +
    '._14ux {border: 1px solid #225FAE !important;}'
    +
    '._2rl {border-top: 1px solid #1C3053 !important;}'
    +
    '._5iwm ._58al {background-color: #132047 !important; color: rgb(111, 154, 228) !important;}'
    +
    '._5iwn ._58ak::before {background-color: #4B95DE !important; border-radius: 3px !important;}'
    +
    '.fbChatTypeahead ._5t4c {background-color: #3971B0 !important;}'
    +
    '._iwu {color: #7A99D4 !important;}'
    +
    '._394q {background-color: #0A4383 !important;}'
    +
    '._6lh ._6li {background: #071648 !important;}'
    +
    '._2jyf {color: #B2C3E4 !important;}'
    +
    '._4uyh {border-bottom: 1px solid #466D93 !important;}'
    +
    '._1g_ {border-right: 1px solid #2854AF !important;}'
    +
    '._4uyj div, ._53w0 {color: #D5D5D5 !important;}'
    +
    '._1eu-, ._5u8_, ._iu- {background-color: #1A356C !important; border-color: #3A68AD !important;}'
    +
    '._3-vq {background-color: #2D5DA7 !important;}'
    +
    '._5kjv {border: 1px solid #243C65 !important;}'
    +
    '._21nf, ._5j34 {border: 1px solid #4984BF !important; color: #BECFF0 !important;}'
    +
    '._1032 {color: #A9C8E6 !important;}'
    +
    '._4fby {border: 1.5px solid #16519E !important;}'
    +
    '._4oyq {background: rgba(12, 40, 77, 0.9) !important;}'
    +
    '._4oc4 {border-bottom: 1px solid #3A5F96 !important;}'
    +
    '._46ye {border-top: 1px solid #355990 !important;}'
    +
    '._4nk5 {background-color: #1B2E54 !important; border: 1px solid #3C5B8A !important;}'
    +
    '._2x8l {background-color: #172E50 !important;}'
    +
    '._3bzd {background-color: #1B3B7B !important;}'
    +
    '._4zsl {border: 1px solid #2F5CA1 !important;}'
    +
    '#u_p_e, #u_p_g, #u_p_i {background-color: rgb(27, 59, 123) !important;}'
    +
    '._3bze::before {border-top: 1px solid #21557B !important;}'
    +
    '._5s1e, ._3-96, ._2x8l {color: #CBD7EC !important;}'
    +
    '._2x8p {background-color: #1B3B7B !important; border-bottom: 1px solid #204F7B !important;}'
    +
    '._2x8q {background-color: #1B3B7B !important;}'
    +
    '._2x8x {background-color: #1B3B7B !important; border: 1px solid #6183B7 !important;}'
    +
    '._3upl, ._3upg, ._3upg .UFIRow {background-color: #1A356C !important;}'
    +
    '.UFICommentActorName {color: #C3D0E9 !important;}'
    +
    '._5vsj {border-top: 1px solid #0E2E4E !important;}'
    +
    '._4fzb, ._5m65 {border-color: #3466B1 !important;}'
    +
    '._4fzb ._5pco, ._4fzb ._5pco p {color: #BBC !important;}'
    +
    '._5y0l {color: #BCDCFB !important;}'
    +
    '._5x_m {border-right: 1px solid #3B8EEC !important;}'
    +
    '._5x_n {border-bottom: 1px solid #2C66BD !important;}'
    +
    '.sp_ZYWdrIxAs4u, .sx_bd94fd, ._18b8 a i {background-image: none !important;}'
    +
    '._61y {border-color: #29589F !important;}'
    +
    '._4127, ._4127 a {color: #6296F2 !important;}'
    +
    '._54-h:hover {background: #2351AB !important;}'
    +
    '._5jkw {background-color: #1A356C !important;}'
    +
    '._4p6i:nth-child(2) {border-top: 1px solid #102D57 !important;}'
    +
    '._4p6i {background-color: #182D57 !important;}'
    +
    '._nxj {border-bottom: 1px solid #172B54 !important;}'
    +
    '._5a5j {background: #285EBD !important;}'
    +
    '._5a4- {color: #74ADF8 !important;}'
    +
    '._4-i0 {background-color: #1C4EB3 !important; border-bottom: 1px solid #1C3C7D !important;}'
    +
    '._5lnf {border-top: 1px solid #144C9F !important;}'
    +
    'span .UFIFailureMessage {color: #59B3FF !important;}'
    +
    '._5pcm {border-left: 2px solid #081D27 !important;}'
    +
    '._2yq ._4-u2::before {border-color: #2863BC #1E4698 #20306C !important;}'
    +
    '._2yaa:hover, ._2yau:hover {background-color: #2863BC !important;}'
    +
    '._3s19, ._3s1a {background: #215B8C none repeat scroll 0% 0% !important; border-color: #2445A7 !important; color: #CBE1F6 !important;}'
    +
    '.fbProfileBrowserSummaryBox {border-bottom: 1px solid #1B5CB0 !important;}'
    +
    '._5i-8 {border-bottom: 1px solid #234F9C !important;}'
    +
    '._5i-7 {background-color: #1F5A9C !important;}'
    +
    '._30d {background-color: #1A274E !important; border-color: #2A71C2 #1E51AB #133890 !important;}'
    +
    '._3-z {border-top: 1px solid #2D5FC5 !important;}'
    +
    '._2yaa:hover::after, ._2yap._2yaa::after, ._2yap ._2yaa::after {background: #194486 none repeat scroll 0% 0% !important; border: 1px solid #2158AB !important;}'
    +
    '._2yav {color: #BCCDEF !important;}'
    +
    '._5lc6 {background-color: #152742 !important; border: 1px solid #14386E !important;}'
    +
    '._2wma {color: #C7D6F3 !important;}'
    +
    '._3nm {background-color: #1A356C !important; border-color: #1B6CBC #245097 #184691 !important;}'
    +
    '._3q9 {color: #8BBFF2 !important;}'
    +
    '._3nj ._gl, ._3ni ._gl._498 {background: #1A356C !important; border-color: #1B6CBC #245097 #184691 !important;}'
    +
    '.fbPhotoTagger .faceboxSuggestion, .fbPhotoTagger .typeaheadBackdrop, .fbPhotoTagger .uiTypeaheadView {background: #1E559C !important;}'
    +
    '.uiTokenizer {background: #0F2C5D !important;}'
    +
    '.fbPhotoTagger .photoTagTypeahead, .fbPhotoTagger .photoTagTypeahead .wrap {border-color: #103254 !important;}'
    +
    '._d4d {border-left: 1px solid #4175C3 !important;}'
    +
    '._d4g {border: 1px solid #2662BD !important;}'
    +
    '._bv4._4dlr {border: 1px solid #2F6FCF !important;}'
    +
    '._3wsu {border-bottom: 1px solid #1A5CB3 !important;}'
    +
    '._52r2 {border-left: 1px solid #2763B1 !important;}'
    +
    '._xu {background-color: rgb(69, 110, 150) !important;}'
    +
    '._1oyt {border: 1px solid #2A64BA !important;}'
    +
    '._5f9g {background: #1A356C !important;}'
    +
    '._5f9e, ._5f9e b {color: #DDE !important;}'
    +
    '._15wh, ._3m__ {border-bottom: 1px solid #13233C !important;}'
    +
    '._3n00, ._4xbk ._40jq + ._40jq, ._40jq {border-top: 1px solid #13233C !important;}'
    +
    '._1wc- {border: 1px solid #13233C !important;}'
    +
    '._4f3b:hover, ._4f3b:focus, ._1u6r:hover, ._1u6r:focus {background: #1A3B6E !important;}'
    +
    'body._131._6nw, body._131._5vb_ {background: #183766 !important;}'
    +
    '._4bl9, ._1gsz {color: #CBCED8 !important;}'
    +
    '._4pbi, ._5uys, ._x1g, ._3rth {border-color: #3874CF !important;}'
    +
    '.fbChatTypeahead ._4p-s {background-color: #134186 !important;}'
    +
    '._364g, ._iyc {color: #B1D4F6 !important;}'
    +
    '.fbChatTypeahead ._225b {color: #76B1EC !important;}'
    +
    '._3q34 {color: #ABCBEF !important;}'
    +
    '._3q35, ._42ef div a {color: #5EADFB !important;}'
    +
    '.fbPhotosRedesign .photoText {border-color: -moz-use-text-color #3563A8 #357FED !important;}'
    +
    '._1crz {border-color: #3874CF !important;}'
    +
    '._ei_ {background: #10285A !important;}'
    +
    '._16vf {border-top: 1px solid #16253C !important;}'
    +
    '._2aha {color: #A9C1EC !important;}'
    +
    '._cue, ._d9- {background-color: #121F39 !important;}'
    +
    '._4qzk, ._4qzn, ._iqn {color: #D8E0F0 !important;}'
    +
    '._4ka9 {color: #B6D0FF !important; opacity: 0.6 !important;}'
    +
    '._4ka8:hover ._4ka9 {opacity: 1 !important;}'
    +
    '._5i04:not(:last-child) {border-bottom: 1px solid #203451 !important;}'
    +
    '._146r {background: #0E151D !important;}'
    +
    '._146q, ._1477 {color: #779EED !important;}'
    +
    '._1475:not(:last-child) {border-right: 1px solid #2D5FAB !important;}'
    +
    '._1474 {border: 1px solid #2A4E86 !important;}'
    +
    '._3uh7 {background: #4267B2 !important;}'
    +
    '._3uh8 {color: #C9D7F0 !important;}'
    +
    '._3uh4._21yg ._3uh8:hover, ._3uh4._21yh ._3uh8:focus {background: #37538C !important;}'
    +
    '._59gp {color: #B7D0F2 !important;}'
    +
    '._4nqn {background-color: rgb(16, 88, 182) !important;}'
    +
    '._4nr6 font, ._4nr7 font {color: rgb(197, 210, 246) !important;}'
    +
    '.ego_unit + .ego_unit, .ego_unit + .ego_appended_units .ego_unit, .ego_appended_units + .ego_unit {border-top: 1px solid #365277 !important;}'
    +
    '._5pbx p {color: #DDE7EE !important;}'
    +
    '._70l {background: #3c62ad !important; border-bottom: 1px solid #354d96 !important;}'
    +
    '.fbFeedTickerBorder {border-top: 1px solid #2e4fb1 !important;}'
    +
    '._4ejc {background-color: #0F2C5D !important;}'
    +
    '._1949, .uiHeaderTopBorder {border-top: solid 1px #3460b9 !important;}'
    +
    '._194u {border-bottom: solid 1px #3460b9 !important;}'
    +
    '.titlebarText span span {color: #85a7e3 !important;}'
    +
    '.fbNubButton {border: 1px solid #1F4E95;}'
    +
    '.fbNubButton {color: #C7D9E6 !important;}'
    +
    '._3db {border-bottom: 1px solid #1d4178 !important;}'
    +
    '._r6 {background-color: #0F2C5D !important;}'
    +
    '._r7 a {color: #5FA8F0 !important;}'
    +
    '._2n3 {border-top: 1px solid #236db6 !important; color: #bbc8de !important;}'
    +
    '#webMessengerRecentMessages .timestamp {background-color: #11538c !important; border-radius: 2px !important;}'
    +
    '._2nb {border-left: 1px solid #3670b1 !important;}'
    +
    '._ksg {background-color: #1a5096 !important; border-color: #21539f !important;}'
    +
    '._1rs {background-color: #0d2653 !important; border-top: 1px solid #1d4266 !important;}'
    +
    '._2pt {background-color: #1a356c !important; border: 1px solid #1a3e54 !important;}'
    +
    '._1rw {background-color: #0F2C5D !important; border: 1px solid #144b89 !important;}'
    +
    '._2pu {border-top: 1px solid #0e2f4b !important;}'
    +
    '._3b {border-bottom: 1px solid #153c80 !important;}'
    +
    '._3j5 {background-color: #0f2c5d !important;}'
    +
    '._281 {border-bottom: 1px solid #2c4d80 !important;}'
    +
    '._l1 {color: #CFD9E6 !important;}'
    +
    '._3c {border: 1px solid #0f4e84 !important;}'
    +
    '.uiSearchInput span {border-color: rgba(32, 96, 168, 1);}'
    +
    '._k- {border-color: #31568d !important;}'
    +
    '._k-:hover {background-color: #244a8c !important;}'
    +
    '.wmMasterView::after {background-color: #19283f !important; border-color: #19283f !important;}'
    +
    '._59gq {background-color: #1F579F !important; border: 1px solid #4272BC !important;}'
    +
    '._kx {background-color: #102B5A !important;}'
    +
    '.p_16qr32exoz .o_16qr32exoy, .p_16qr32exoz .i_16qr32exox {color: #93AEE9 !important;}'
    +
    '.UFIReplyList .UFIPartialBorder {border-left: 2px solid #427dd7 !important;}'
    +
    '._1g_n {background-color: #184681 !important; border-color: #2D5BA1 !important;}'
    +
    '._1qqu {border: 1.5px solid #3E80CB !important;}'
    +
    '._56w3, ._5yuc {background-color: #112D68 !important;}'
    +
    '._4r61 {border-right: 1px solid #284C81 !important;}'
    +
    '._3b68 {color: #C3D6F6 !important;}'
    +
    '._5y-s {background: #123975 !important;}'
    +
    '._2v19 {background-color: rgb(22, 112, 188) !important; border: 1px solid #467ED4 !important;}'
    +
    '._18bd {background-color: #16446C !important; border-color: -moz-use-text-color #2569CE !important;}'
    +
    'li._2ddh {border: 1px solid #5E8FDA !important; background: #172944 !important;}'
    +
    'li._2ddh._2ddj {background: #24539F !important; border: 1px solid #5890FF !important;}'
    +
    '._5yut {background: #123159 !important;}'
    +
    '._4184 {border-bottom: 1px solid #3E6FBA !important; background: #2665C5 !important;}'
    +
    '._1nme {background-color: #0A4796 !important; color: #A2DDF5 !important;}'
    +
    '._2ll4 {background-color: #183A72 !important;}'
    +
    '._371u a {color: rgb(173, 191, 227) !important;}'
    +
    '._371u + ._371u {border-left: 1px solid #4270B4 !important;}'
    +
    '._3bwv > ._3bwy {background: #4998DB !important;}'
    +
    '._1w38 {background: #0D1929 !important;}'
    +
    '._j3t {border-bottom: 1px solid #275496 !important;}'
    +
    '._5i_t {border-color: #224B89 !important;}'
    +
    '._150p, #u_0_o {color: #74B9EC !important;}'
    +
    '._30v- {border: 1px solid rgba(34, 113, 201, 0.8) !important;}'
    +
    '.fbProfileEditExperiences div {background: #102550 !important;}'
    +
    '.box {background-color: #2F5A9B !important; border: 5px solid #3068BC !important;}'
    +
    '.contextualHelp {background: #16253C !important;}'
    +
    '.inContext > div {background-color: rgb(10, 36, 57) !important;}'
    +
    '.facade, ._41nt, #globalContainer, ._55fl {background-color: #131D32 !important; border: none !important;}'
    +
    '._41nt, ._iu-, ._1oxk {border-radius: 16px !important;}'
    +
    '.UIFaq_Answer .mvm, .fsm {color: #82B3E4 !important;}'
    +
    '._4-h7:hover {background-color: #3662BC !important;}'
    +
    '._n57 {border-bottom: 1px solid #224E90 !important;}'
    +
    '._2nob {border-top: 1px solid #224E90 !important;}'
    +
    '._3etu, ._3etw {background: #234A6B !important; border: 1px solid #2065CC !important;}'
    +
    '._5dwm {border-bottom: 1px solid #1E3565 !important; color: #7690C5 !important;}'
    +
    '._59tx {border-bottom: 1px solid #2858A1 !important;}'
    +
    '._5jm3::before {background-image: linear-gradient(to right, #2664B4, rgba(8, 33, 69, 0.1)) !important;}'
    +
    '._4kaa, ._58-r, ._3549 {color: #BED3FF !important;}'
    +
    '._3545 {border-color: #2C4F84 !important;}'
    +
    '._3547:not(:last-child) {border-right: 1px solid #1C417A !important;}'
    +
    '._4kab {border-top: 1px solid #29569B !important;}'
    +
    '._4kac {color: #84B1FF !important;}'
    +
    'iframe html, iframe #main {background: #0B1929 !important; opacity: .6 !important;}'
    +
    '.fbNubButton::before, .fbNubButton::after, ._55fl {display: none;}'
    +
    '.uiScrollableAreaGripper {background-color: #0C294B !important; border: 1px solid #0E2238 !important;}'
    +
    '#fbpfirstrundiv, #fbpoptsdiv {background: rgb(16, 36, 53) !important; border: 3px solid rgb(17, 28, 50) !important;}'
    +
    '#fbpurityinfobar {background: rgb(14, 30, 62) !important; opacity: .5 !important;}'
    +
    '#fbpfirstrundiv table tbody tr td[width="66%"] {opacity: .8 !important;}'
    +
    'tr[style="background-color:#ECEFF5 !important"] td, #custextheader, #custextdesc, span[style="color:black"], tr[style="background-color:lightgrey"] {background: rgb(31, 53, 98) !important; color: #90949C !important;}'
    +
    '#custextta {border: 1px solid black !important;}'
    +
    '#localeproblem, div[style="color:red;font-weight:bold;margin-left:25px;margin-right:25px;margin-bottom:10px"] {color: rgb(163, 195, 231) !important;}'
    +
    'tr[style="background-color:lightgrey !important"] {display: none !important;}'
    +
    '._4v9u {border-top: 1px solid #0C1E39 !important;}'
    +
    '.sideNavItem {border-top: 1px solid #132239 !important;}'
    +
    '#contentArea ._bui ._5afe, #contentArea ._bui .subitem {border-bottom: 1px solid #0359BA !important;}'
    +
    '._2nb ._2ne .unreadHighlight, ._2nb ._2ne .unreadFading {background: #112441 !important; border-color: #153D65 !important;}'
    +
    '._5rp8 ._1mf, ._1mj {color: #BBD6E1 !important;}'
    +
    '._3ma, ._3m9, .advertisingSubtitle, ._6o, ._6u, ._mf, .mtm, ._6q, .mtm a, ._6q a {text-shadow: none !important;}'
    +
    '._fmi {border: 1px solid #1d56ad !important;}'
    +
    '._31qy {background-color: #1883c8 !important;}'
    +
    '._31q_, ._4mp0 {color: #bfcfef !important;}'
    +
    '._31rf {color: #b4c6e9 !important;}'
    +
    '._3ubp {border-bottom: 0px solid #4585e6 !important;}'
    +
    '_2-gy {background-color: #17336c !important;}'
    +
    '._5-9o {border-top: 1px solid #194fa1 !important;}'
    +
    '._3m75 .sideNavItem ._5afe::after {background-color: #273f71 !important; border: 1px solid #154a99 !important;}'
    +
    '._1z7g span {color: #bfd1f5 !important;}'
    +
    '._3m75 .selectedItem ._55yu > a, ._3m75 .sideNavItem:hover ._55yu > a, ._3m75 .selectedItem .uiSideNavEditButton a, ._3m75 .sideNavItem:hover .uiSideNavEditButton a {background-color: #1b315f !important; border-color: #0d2e71 !important;}'
    +
    '._16ve {border-top: 1px solid #3160a7 !important;}'
    +
    '._2-gy {background-color: #0b1726 !important;}'
    +
    '._3el6, ._4idn {border: 1px solid #2c5a9f !important;}'
    +
    '._3o_h::after, ._2yaa ._2yau::after {background: #2c60c9 !important; border: 1px solid #356bbd !important;}'
    +
    '._4z-w {border-top: 1px solid #0e5c9e !important;}'
    +
    '._4z-w:hover {background: #0b1d42 !important;}'
    +
    '._fmi {background: #0d1c30 !important;}'
    +
    '._3upp {background-color: #1A356C !important;}'
    +
    '.UFICommentLiveVideoAnnouncement, .UFILivePinnedComment {border-left: 16px solid #17366b !important; border-right: 16px solid #17366b !important;}'
);