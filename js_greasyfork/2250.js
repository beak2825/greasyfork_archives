// ==UserScript==
// @name            STS Helper
// @author          7-elephant
// @namespace       iFantz7E.StsHelper
// @version         2.73
// @description     In Steam Translation Server, add many features to make translate easier.
// @match           *://translation.steampowered.com/*
// @icon            https://translation.steampowered.com/public/favicon.ico
// @run-at          document-start
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @license         GPL-3.0-only
// @copyright       2014, 7-elephant
// @supportURL      https://steamcommunity.com/id/7-elephant/
// @contributionURL https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/2250/STS%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/2250/STS%20Helper.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html
// Compatibility: Firefox 14+ from Mutation Observer

// Since 4 Feb 2014
// http://userscripts.org/scripts/show/325610
// https://greasyfork.org/scripts/2250-sts-helper/

(function ()
{
	"use strict";
	// jshint multistr:true
	
function initStyle()
{
	GM_addStyle
	(" \
		/* STSH Modify CSS */ \
		body { color: #acacac; } \
		#logout { \
			position: fixed; z-index: 1001; right: 12px; top: 10px; \
			line-height: 24px; text-align: right; } \
		input[type='button'], input[type='submit'] { \
			cursor: pointer; padding: 1px 9px; } \
		input[type='button']:disabled, input[type='submit']:disabled { \
			cursor: default; color: #777; } \
		#suggestionmain > div:nth-child(4) > form:nth-child(2) > div:nth-child(1) { \
			text-align: left; } \
		.lbAction > div > input[value^='SUBMIT'] { \
			width: 670px; height: 30px; border-color: #777 #333 #777 #777; } \
		.lbAction > div > input[value^='SUBMIT'][disabled] { border-color: #777; } \
		.lbAction > div > input[value^='RESUBMIT'] { \
			width: 561px; height: 30px; border-color: #777 #333 #777 #777; } \
		.lbAction > div > input[value='CANCEL'] { \
			width: 100px; height: 30px; margin-right: 5px; } \
		form.lbAction:nth-child(1) > div:nth-child(2) > input:nth-child(1) { \
			width: 90%; margin-top: 5px; } \
		.suggestion .lbAction textarea { \
			max-width: 700px !important; min-height: 50px; } \
		.progress td { vertical-align: top; } \
		div#suggestions_nav { \
			z-index: 3; position: absolute; width: 440px; \
			left: 543px; top: 2px; text-align: right; line-height: 24px; \
			color: #E1E1E1; } \
		#suggestionmain .smallcopy { width: 855px; min-height: 70px; max-height: 70px; } \
		#suggestionmain .progress { margin-top: -12px; } \
		#suggestionmain > div[style='padding-left: 10px;'] { padding-left: 6px !important; } \
		#suggestions_box { margin-top: 1px !important; position: relative; z-index: 20; } \
		#suggestions_iframe { min-height: 100px !important; } \
		#keylist td:nth-child(1) > div { \
			background-image: none !important; min-height: 43px; } \
		#keylist tr:nth-child(2n) > td:nth-child(1) > div { \
			background-color: #060606 !important; } \
		#keylist tr:nth-child(2n) > td:nth-child(1) > div:hover { \
			background-color: #0D0D0D !important; } \
		#keylist td:nth-child(1) > div:hover { \
			background-repeat: no-repeat; background-position: center; \
			background-color: #0D0D0D !important; \
			background-image: url('./public/images/row_over.gif') !important; } \
		#keylist td.progress { \
			color: #fff; max-width: 430px; overflow: hidden; \
			text-overflow: ellipsis; white-space: nowrap; } \
		.progress h1 { display: inline-block; } \
		div#suggestions_box iframe { background-color: #111 !important; } \
		.suggestions_list { border-right: 0px none; } \
		.suggestions_list:nth-child(2) { border: 0px none; } \
		.suggestion { \
			resize: both; overflow-x: hidden; overflow-y: auto; \
			border: 1px solid #505050; border-top: none; \
			max-width: 953px; min-width: 200px; min-height: 50px; } \
		.suggestion:first-child { border-top: 1px solid #505050; } \
		.suggestion_signature { font-family: Verdana; margin-top: 4px; } \
		.suggestion_signature input:disabled { color: #777 !important; } \
		.lbAction input[value~='COMMENT'] { \
			vertical-align: top; margin-top: 1px; height: 52px; } \
		.lbAction input[value~='DISCUSS'] { \
			vertical-align: top; margin-top: 1px; height: 21px; top: 0px !important; } \
		#votes_container a[title='not translated'] { background-color: #333; } \
		#suggestion_value_new { min-height: 84px; max-width: 960px; min-width: 200px; overflow-y: auto; } \
		#hours > table > tbody > tr:nth-child(2) > th:nth-child(1) { width: 106px; text-align: center; } \
		#hours > table > tbody > tr:nth-child(2) > th:nth-child(3) { text-align: center; } \
		#hours > table > tbody > tr:nth-child(2) > th:nth-child(4) { text-align: center; } \
		#hours > table > tbody > tr > td:nth-child(1) { padding-right: 4px; } \
		#hours > table input[name*='[remarks]'] { width: 520px; } \
		#hours > table input[name*='[hours]'] { width: 100px; } \
		#hours > table input[name*='[minutes]'] { width: 100px; } \
		#suggestions_box_outer { overflow: hidden !important; } \
		#add_to_discussion { height: 19px; min-height: 19px; } \
		.gradienttable td > div { top: 1px !important; } \
		.copysmall > td:nth-child(1) { \
			white-space: nowrap; overflow: hidden; text-overflow: ellipsis; \
			display: inline-block; width: 430px; direction: ltr; } \
		div:hover > table > tbody > tr.copysmall > td:nth-child(1) { \
			direction: rtl; text-shadow: 1px 1px 1px #0D0D0D;} \
		#search input[type='radio'], #search input[type='checkbox'] \
			, #search button, #search label { cursor: pointer; } \
		.suggestion_error { max-width: 600px; margin-left: 80px; } \
		#country_list_id + #hidethis { display: block; margin-top: 8px; } \
		.row0:nth-child(odd), .row1:nth-child(odd), .row-1:nth-child(odd), .row-9:nth-child(odd), .row10:nth-child(odd) { \
			background-color: #161616; } \
		.row0:nth-child(even), .row1:nth-child(even), .row-1:nth-child(even), .row-9:nth-child(even), .row10:nth-child(even) { \
			background-color: #202020; } \
		.row2:nth-child(odd) { background-color: #1C2117; } \
		.row2:nth-child(even) { background-color: #22291B; } \
		#replacementstatus { \
			top: 0px !important; left: 176px !important; \
			display: block !important; opacity: 1.0 !important; } \
		a + br + #replacementstatus { left: 326px !important; } \
		#keylist_container { margin-left: 10px; } \
		img[src='<?=BASE_URL_CURRENT?>public/images/hr.gif'] { background-image: url('./public/images/hr.gif'); } \
	");
	
	GM_addStyle
	(" \
		/* STSH Main CSS */ \
		.stsh_body_crop { overflow-x: hidden; } \
		.stsh_btn { width: 90px; } \
		.stsh_btn_med { min-width: 112px; } \
		.stsh_btn_long { min-width: 136px; } \
		.stsh_btn_short { min-width: 66px; } \
		.stsh_btn_right { position: relative; float: right; } \
		.stsh_text_right { \
			position: relative; float: right; \
			display: block; margin-right: 4px; text-transform: none; \
			font-size: 13px; font-style: normal; padding-top: 2px; } \
		.stsh_border_left { border-right-color: #333 !important; } \
		.stsh_border_right { border-left-color: #333 !important; } \
		.stsh_border_center { border-left-color: #333 !important; border-right-color: #333 !important; } \
		.stsh_border_top { border-bottom-color: #333 !important; } \
		.stsh_border_middle { border-top-color: #333 !important; } \
		.stsh_border_bottom { border-top-color: #333 !important; border-bottom-color: #333 !important; } \
		.stsh_suggestion_header { color: #A4B23C; } \
		.stsh_suggestion_comment:before { background-color: #E15417 !important; } \
		.stsh_suggestion_pending:before { background-color: #DDD !important; } \
		.stsh_suggestion_approved:before { background-color: #A4B23C !important; } \
		.stsh_suggestion_declined:before { background-color: #F22 !important; } \
		.stsh_suggestion_applied:before { background-color: #2EBCEB !important; } \
		.stsh_suggestion_removed:before { background-color: #777 !important; } \
		.stsh_suggestion { list-style: none; } \
		.stsh_suggestion:before { \
			content: ''; display: inline-block; position: relative; height: 6px; width: 6px; \
			border-radius: 3px; background-clip: padding-box; margin-right: -6px; \
			top: -1px; left: -12px; background-color: green; }\
		#stsh_frame { \
			text-align: center; position: fixed; z-index: 10; \
			top: 100px; left: 50%; margin-left: -322px;} \
		#stsh_frame_sub { \
			background-color: #111; width: 600px; display: inline-block; \
			padding: 20px; border: 2px solid #cf9e5f; } \
		.stsh_blue { color: #2EBCEB; } \
		.stsh_blue_light { color: #87BEED; } \
		.stsh_blue_light2 { color: #5C80A1; } \
		.stsh_blue_dark { color: #1B6A85; } \
		.stsh_green { color: #a4b23c !important; } \
		.stsh_green_dark { color: #3a482a; } \
		.stsh_red { color: #F22; } \
		.stsh_red_light { color: #4dc0f0; } \
		.stsh_white { color: #e1e1e1; } \
		.stsh_grey { color: #777 !important; } \
		.stsh_orange { color: #E15417; } \
		.stsh_orange_light { color: #CF8B37; } \
		.stsh_orange_light2 { color: #EDB687; } \
		.stsh_orange_light3 { color: #FFAA40; } \
		.stsh_orange_dark { color: #a75124; } \
		.stsh_aqua { color: #538583; } \
		.stsh_pink { color: pink; } \
		.stsh_yellow { color: #E0B816; } \
		.stsh_yellow_light { color: #E0CA70; } \
		.stsh_greenyellow_light { color: #D1E070; } \
		.stsh_purple { color: #a166f4; } \
		.stsh_border_green { border-color: #76802B !important; } \
		.stsh_border_green_left { border-color: #76802B #474D1A #76802B #76802B !important; } \
		.stsh_cursor_notallowed { cursor: not-allowed !important; } \
		.stsh_cursor_pointer { cursor: pointer !important; } \
		.stsh_cursor_default { cursor: default !important; } \
		.stsh_cursor_help { cursor: help !important; } \
		.stsh_inline { display: inline; } \
		#stsh_showing { \
			color: #CCDAD6; position: fixed; z-index: 1001; \
			right: 12px; bottom: 12px; text-align: right; line-height: 14px;} \
		#stsh_showing_current { \
			color: #CCDAD6; position: fixed; z-index: 1001; \
			right: 12px; bottom: 28px; text-align: right; line-height: 14px;} \
		.stsh_showing_counter { \
			display: inline-block; min-width: 60px; text-align: center; } \
		.stsh_showing_header { \
			color: #CCDAD6; display: inline-block; width: 135px; \
			text-align: center; padding-top: 10px; } \
		.stsh_showing_group { \
			position: fixed; z-index: 3; right: 10px; top: 74px; \
			line-height: 24px; text-align: right; } \
		.stsh_home_header { color: #CCDAD6; display: inline-block; padding-top: 10px; } \
		.stsh_home_group { \
			position: fixed; z-index: 3; right: 0px; top: 74px; \
			line-height: 24px; text-align: center; width: 164px; } \
		.stsh_home_group > div > .stsh_a_button { border-top-color: #333; border-bottom-color: #333; } \
		.stsh_home_group > div > .stsh_a_button:first-child { border-top-color: #777; } \
		.stsh_home_group > div > .stsh_a_button:last-child { border-bottom-color: #777; } \
		.stsh_home_group > div > div > .stsh_a_button { border-top-color: #333; border-bottom-color: #333; } \
		.stsh_home_group > div > div > .stsh_a_button:first-child:not(:last-child) { border-right-color: #333; } \
		.stsh_home_group > div > div > .stsh_a_button:last-child:not(:first-child) { border-left-color: #333; } \
		.stsh_home_group > div > div:first-child > .stsh_a_button { border-top-color: #777; } \
		.stsh_home_group > div > div:last-child > .stsh_a_button { border-bottom-color: #777; } \
		.stsh_home_group .stsh_a_button { cursor: pointer; } \
		.stsh_menu_group { \
			position: fixed; z-index: 3; right: 12px; top: 84px; \
			line-height: 24px; text-align: right; } \
		.stsh_group_space { margin-top: 3px; } \
		.stsh_scroll_header { \
			color: #CCDAD6; display: inline-block; width: 130px; \
			text-align: center; padding-top: 10px; } \
		#stsh_specialEvent { position: absolute; z-index: 2; right: 164px; top: 13px; } \
		@media screen and (min-width: 1500px) { \
			#stsh_specialEvent { position: fixed; } \
		} \
		.stsh_snapshot { \
			position: absolute; top: 320px; left: 790px; \
			width: 140px; text-align: center; color: #FFF; } \
		.stsh_text_comment_header { vertical-align: top; user-select: none; } \
		.stsh_text_comment { vertical-align: top; display: inline-block; max-width: 850px; user-select: text; } \
		.stsh_action_approve, .stsh_action_approve_next { color: #A4B23C; } \
		.stsh_action_decline, .stsh_action_decline_next { color: #F22; } \
		.stsh_action_apply, .stsh_action_apply_next { color: #2EBCEB; } \
		#stsh_autoApprove { vertical-align: -2px; margin-left: 15px; margin-right: 1px; } \
		.stsh_unselectable { \
			-webkit-touch-callout: none !important; \
			-webkit-user-select: none !important; \
			-khtml-user-select: none !important; \
			-moz-user-select: none !important; \
			-ms-user-select: none !important; \
			user-select: none !important; } \
		.stsh_a_button { \
			background-color: #1D1D1D; \
			font-family: tahoma,arial,helvetica,trebuchet ms,sans-serif; \
			color: #E1E1E1; font-size: 13px; border: 1px solid #777; padding: 1px 9px; } \
		.stsh_a_button:link, .stsh_a_button:hover, .stsh_a_button:active, .stsh_a_button:visited { \
			color: #E1E1E1; text-decoration: none; } \
		.stsh_a_button.stsh_btn { \
			display: inline-block; padding: 0px; \
			height: 19px; line-height: 19px; width: 88px; } \
		.stsh_a_button.stsh_btn_short { \
			display: inline-block; padding: 0px; \
			height: 19px; line-height: 19px; min-width: 54px; } \
		.stsh_a_button.stsh_btn_med { \
			display: inline-block; padding: 0px; \
			height: 19px; line-height: 19px; min-width: 110px; } \
		.stsh_a_button.stsh_btn_long { \
			display: inline-block; padding: 0px; \
			height: 19px; line-height: 19px; min-width: 134px; } \
		.stsh_lineCounter_outer { position: relative; } \
		.stsh_lineCounter { \
			position: absolute; width: 30px; left: -35px; top: -28px; \
			line-height: 28px; text-align: right; \
			color: #ACACAC; font-size: 9px; text-shadow: 1px 1px 1px #111; } \
		.stsh_glossary_term { min-width: 50px; display: inline-block; } \
		.stsh_glossary_header { font-family: Verdana; } \
		.stsh_glossary_header, .stsh_glossary_header td { color: #DDD; } \
		.stsh_glossary_header *, .stsh_glossary_header td * { color: #858585; } \
		.stsh_glossary_header > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4) { \
			width: 10px !important; } \
		.stsh_comment_img { \
			display: block; max-width: 400px; max-height: 225px; \
			margin-top: 5px; margin-bottom: 20px; } \
		.stsh_comment_img_zoom { cursor: zoom-in; cursor: -webkit-zoom-in; cursor: -moz-zoom-in; } \
		.stsh_hours_curDate { color: #A4B23C; } \
		.stsh_hours_curDate input { border-color: #A4B23C; } \
		.stsh_text_submit_right { \
			height: 30px; width: 214px; margin-right: 5px; border-color: #777 #777 #777 #333; } \
		.stsh_truncate { \
			white-space: nowrap; overflow: hidden; text-overflow: ellipsis; \
			display: inline-block; vertical-align: bottom; } \
		.stsh_token_name { max-width: 500px; } \
		.stsh_token_share { max-width: 600px; font-size: 0.8em; direction: rtl; } \
		.stsh_token_share:hover { direction: ltr; } \
		.stsh_pad { padding-left: 2px; padding-right: 2px; } \
		.stsh_pad_left { padding-left: 4px; } \
		.stsh_pad_right { padding-right: 4px; } \
		.stsh_margin_left { margin-left: 4px; } \
		.stsh_margin_right { margin-right: 4px; } \
		.stsh_hidden { display: none !important; } \
		table.gradienttable .stsh_curLang td, table.gradienttable .stsh_dst_curLang td \
			, table.gradienttable .stsh_dst_curLang th { \
				background: transparent \
					linear-gradient(to bottom, #171717 0%, rgba(71, 77, 26, 0.66) 40%, #121212 100%) \
					repeat scroll 0% 0% !important; } \
		.stsh_delta #suggestion_value_new { border-color: #1B6A85; } \
		.stsh_delta .stsh_text_submit { \
			color: #2EBCEB; border-color: #1B6A85 #083F52 #1B6A85 #1B6A85 !important; } \
		.stsh_delta .stsh_text_submit_right { \
			color: #2EBCEB; border-color: #1B6A85 #1B6A85 #1B6A85 #083F52 !important; } \
		.stsh_delta .suggestions_list, .stsh_delta .suggestion { \
			border-color: #083F52 !important; } \
		.stsh_usThem tr:nth-child(odd) { background-color: #161616; } \
		.stsh_usThem tr:nth-child(even) { background-color: #202020; } \
		.stsh_usThem_langCur { background-color: #2F3317 !important; color: #E1E1E1; } \
		.stsh_dst_curLang, table.gradienttable .stsh_dst_curLang th, .stsh_dst_curLang a { \
			color: #2ebceb; } \
		.stsh_text_trn .lbAction textarea { max-width: 450px !important; } \
		.stsh_text_trn .lbAction input[value~='COMMENT'] { height: auto; } \
		.stsh_text_trn .stsh_text_submit { width: 190px !important; } \
		.stsh_text_trn .stsh_text_submit_right { \
			width: 184px !important; margin-right: 16px !important; } \
		.stsh_text_trn .suggestion { \
			color: #858585; border-width: 1px solid; \
			margin-top: -2px; padding-top: 0px; } \
		.stsh_text_trn .stsh_counter:after { margin-top: 3px; } \
		.stsh_text_trn .suggestion_error { \
			max-width: 450px; margin-left: 0px; margin-top: 16px; margin-bottom: -14px; } \
		.stsh_text_trn #stsh_autoApprove { display: none; } \
		.stsh_text_trn .stsh_autoApprove_label { display: none; } \
		.stsh_text_trn input[value='+1'] { display: none; } \
		.stsh_text_trn #replacementstatus { left: 140px !important; } \
		.stsh_text_trn .stsh_autoReplace_notice { margin-top: 14px; padding-left: 88px; } \
		.stsh_text_org, .stsh_text_trn { \
			min-height: 21px; display: block; max-width: 470px !important; line-height: 17px; word-break: break-word; } \
		.stsh_text_org { margin-bottom: 3px; } \
		.stsh_text_org img, .stsh_text_trn img { max-width: 100%; max-height: 100%; } \
		.stsh_autoLoginOption { display: inline-block; vertical-align: top; line-height: 69px; padding-left: 30px; } \
		#stsh_autoLogin { margin-right: 0px; } \
		.stsh_moveSuggestionContainer { margin-top: -3px; } \
		#stsh_moveSuggestionBox, #stsh_moveSuggestionList { margin-right: 5px; } \
		#stsh_hoursCalc_from { width: 130px; } \
		#stsh_hoursCalc_to { width: 130px; border-right: 1px #333 solid; } \
		#stsh_hoursCalc_toNow { border-left: 1px #333 solid; } \
		.stsh_nav_prev { border-right-color: #333; } \
		.stsh_nav_next { border-left-color: #333; } \
		.stsh_nav_group { display: inline-block; } \
		.stsh_nav_group .stsh_a_button { \
			display: inline-block; text-align: center; \
			line-height: 17px; min-width: 40px; } \
		.stsh_nav_group .stsh_a_button:first-child:not(:last-child) { border-right-color: #333; } \
		.stsh_nav_group .stsh_a_button:last-child:not(:first-child) { border-left-color: #333; } \
		.stsh_nav_group .stsh_a_button:not(:first-child):not(:last-child) { \
			border-left-color: #333; border-right-color: #333; } \
		.stsh_img_min { max-width: 200px !important; height: auto !important; } \
		.stsh_showHidden { \
			display: inherit !important; background-color: #1d1d1d; padding: 1px 5px; \
			max-height: inherit !important; height: inherit !important; } \
		.stsh_discussion_header input[type='button'] { \
			padding: 1px 6px; } \
		.stsh_counter { display: inline-block; } \
		.stsh_counter[data-counter='Char: 0 :: Word: 0 :: Byte: 0'] { display: none; } \
		.stsh_counter:after { content: attr(data-counter); position: absolute; \
			margin-left: -280px; width: 278px; text-align: right; } \
		.stsh_spanStatusOrg, .stsh_spanStatusTrn { display: block; margin-top: -4px; margin-bottom: 8px; } \
		.stsh_spanStatusSug { display: block; margin-top: 8px; margin-bottom: 12px; } \
		.stsh_autoCopy_header font { color: #a4b23c !important; font-weight: normal; font-family: Verdana;} \
		.stsh_glossary_move { color: #e1e1e1; margin-left: 4px; } \
		.stsh_sametoken_file { display: inline-block; } \
		.stsh_marker { color: #777 !important; display: inline-block; } \
		.stsh_sametoken_header .stsh_marker, .stsh_text_comment .stsh_marker { color: #e1e1e1 !important; } \
		.stsh_glossary_header .insertword { display: inline-block; } \
		.stsh_glossary_header td { padding-left: 16px; padding-right: 6px; } \
		.stsh_glossary_header td .stsh_glossary_term { margin-left: -16px; } \
		.stsh_profile_count { width: 100px; display: inline-block; text-align: center; } \
		.stsh_profile_count_sugg { margin-left: 13px; } \
		.stsh_comment_resolved_label { display: block; width: 300px; margin-bottom: 10px; } \
		.stsh_comment_resolved { vertical-align: -2px; margin-left: 0px; margin-right: 1px; } \
		.stsh_suggestion_comment_detail > strong:first-child, .stsh_comment_resolved_label > strong:first-child { \
			min-width: 64px; display: inline-block; } \
		.stsh_discussion_text { display: inline; max-width: 850px; overflow-wrap: break-word; } \
		.stsh_discussion_text.stsh_discussion_text_long { display: block; margin-left: 20px; } \
		.stsh_date_group { text-align: center; } \
		.stsh_date_group button { line-height: 19px; } \
		.stsh_date_group .stsh_date_cur { border-left-color: #333; border-right-color: #333; \
			margin-top: 22px !important; } \
		.stsh_date_group .stsh_date_prev { border-right-color: #333; margin-left: 2px; } \
		.stsh_date_group .stsh_date_next { border-left-color: #333; } \
		.stsh_autoReplace_header { font-family: Verdana; } \
		.stsh_autoReplace_instruction { width: 870px; } \
		.stsh_autoReplace_text { width: 300px; cursor: auto !important; } \
		.stsh_checkbox_label { margin-left: 10px; } \
		.stsh_checkbox_label > input[type='checkbox'] { vertical-align: -2px; margin-left: 0px; margin-right: 1px; } \
		.stsh_usThem_translation { min-width: 400px; } \
		.stsh_page_userActivity .dial { display: none; } \
		.stsh_page_userActivity table.curved { border: 2px solid #444; } \
		.stsh_page_usAndThem #leftAreaContainer > table > tbody:nth-child(1) > tr > td:nth-child(1) { \
			vertical-align: top; } \
		.stsh_page_usAndThem #leftAreaContainer > table, \
		.stsh_page_usAndThem #leftAreaContainer > table th, \
		.stsh_page_usAndThem #leftAreaContainer > table td { \
			border: 1px solid #333; border-collapse: collapse; padding: 4px; } \
		.stsh_btn_display { border-left-color: #333; border-right-color: #333; } \
		.stsh_btn_display:first-child { border-right-color: #777; } \
		.stsh_btn_display:last-child { border-left-color: #777; } \
		.stsh_autoReplace_notice { text-align: left; padding-left: 208px; } \
		a + br + #replacementstatus + br + .stsh_autoReplace_notice { \
			text-align: center; padding-left: 0px; } \
		.stsh_suggestion_list_empty { \
			border-top: 1px solid #505050 !important; border-left: 1px solid #505050 !important; padding-left: 2px; } \
		.stsh_suggestion_border_approved { border-color: #76802B !important; border-top: 1px solid; } \
		.stsh_suggestion_border_declined { border-color: #720D0D !important; } \
		.stsh_suggestion_border_approved + .stsh_suggestion_border_approved { border-top: none; } \
		.stsh_action_edit { border-left-color: #333; } \
		.stsh_header_org, .stsh_header_trn { width: 484px; position: relative; } \
		.stsh_copy_org, .stsh_copy_trn { position: absolute; margin-left: 8px; margin-top: 22px; border-color: #555; } \
		.stsh_copy_new { width: 80px; height: 30px; border-left-color: #333; border-right-color: #333; } \
		.stsh_copy_sug { border-right-color: #333; } \
		.stsh_suggestion_list_header { width: 961px; } \
		.stsh_suggestion_list_history { padding-left: 2px; } \
		.stsh_suggestion_list_history_related { border-color: #4D6C87; } \
		.stsh_page_home font[style='color:#EDB687;'] { padding-right: 4px; } \
		.stsh_home_discussion_file { cursor: pointer; } \
		.stsh_home_discussion_comment { overflow-wrap: break-word; } \
		.stsh_suggestion_list_history_header { user-select: none; } \
		@media screen and (max-height: 600px) { .stsh_home_section_scroll { display: none; } } \
		.stsh_home_hideOtherLang { margin-left: 16px; margin-top: 10px; width: 152px; } \
	");
}

var timingInit = 
{
	initNameSpace: 100,
	refreshError: 60000,
	cleanLinks: 100,
	removeHorizonScroll: 100,
	resizeTextNew: 100,
	improveGlossary: 200,
	bindLastText: 100,
	insertAtCaret: 500,
	pasteLastComment: 250,
	autoApprove: 2000,
	pasteLastSuggestion: 300,
	hideCursor: 3000,
	expandTextarea: 100,
	focusModAction: 200,
	autoReplaceText: 250,
	findNextUnmatched: 500,
	openFrame: 1000,
	improveStatistics: 100,
	autoLogin: 3000,
	authSubmit: 3000,
	bindObserverKeyList: 200,
	pageUserActivity: 100,
    disableOnClick: 100,
	reenableAfterClick: 1000,
};

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e)
	{
		callback();
	});
}

function attachOnReady(callback)
{
	document.addEventListener("DOMContentLoaded", function (e)
	{
		callback();
	});
}

function insertBeforeElement(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfterElement(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeElement(node)
{
	node.parentElement.removeChild(node);
}

function getByteCount(str) 
{
	str = String(str);

	var count = 0;
	
	for (var i = 0; i < str.length; i++) 
	{
		var c = str.charCodeAt(i);
		count += c < 128 ? 1 :
			c < 2048 ? 2 :
			c < 65536 ? 3 :
			c < 2097152 ? 4 :
			c < 67108864 ? 5 :
			c < 2147483648 ? 6 : 0;
	}
	
	return count;
}

function escapeRegExp(str) 
{
	if (typeof str === "string")
	{
		return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
	}
	return "";
}

function addKey(eleListener, eleClick, keyCodes, keyName, keyTitleMode, keyModifierName, checkModifierCallback)
{
	/* 
		eleClick:
			element, query
		keyCodes:
			code, name, array
		keyTitleMode:
			0: do nothing
			1: append value
			2: add title if not exist
			4: override title
			8: append textContent
			16: append textContent of firstElementChild
		keyModifierName:
			Ctrl, Ctrl+Shift, Alt
	*/
	
	keyCodes = keyCodes || [0];
	keyName = keyName || "";
	keyTitleMode = keyTitleMode || 0;
	keyModifierName = keyModifierName || "";
	
	if (typeof checkModifierCallback !== "function")
	{
		checkModifierCallback = function(ev) 
		{
			return ev.ctrlKey && ev.shiftKey && ev.altKey;
		};
	}
	
	if (typeof eleClick === "string")
	{
		keyTitleMode = 0;
	}
	
	if (!Array.isArray(keyCodes))
	{
		keyCodes = [keyCodes];
	}
	
	if (eleListener && eleClick)
	{
		// apply title
		var keyTitle = keyModifierName ? keyModifierName + "+" + keyName : "";
		if (keyTitle !== "" && keyTitleMode !== 0)
		{
			if ((keyTitleMode & 1) === 1)
			{
				// 1: append value
				if (typeof eleClick.value !== "undefined")
				{
					eleClick.value += " (" + keyTitle + ")";
				}
			}
			if ((keyTitleMode & 2) === 2)
			{
				// 2: add title if not exist
				if (!eleClick.title)
				{
					eleClick.title = keyTitle;
				}
			}
			if ((keyTitleMode & 4) === 4)
			{
				// 4: override title
				eleClick.title = keyTitle;
			}
			if ((keyTitleMode & 8) === 8)
			{
				// 8: append textContent
				eleClick.textContent += " (" + keyTitle + ")";
			}
			if ((keyTitleMode & 16) === 16)
			{
				// 16: append textContent of firstElementChild
				if (eleClick.firstElementChild)
				{
					eleClick.firstElementChild.textContent += " (" + keyTitle + ")";
				}
			}
		}
		
		eleListener.addEventListener("keydown", function (ev)
		{
			if (checkModifierCallback(ev))
			{
				var isSameKey = false;
				
				for (var i = 0; i < keyCodes.length; i++)
				{
					var keyCode = keyCodes[i];
					if (typeof keyCode === "number")
					{
						isSameKey = (ev.keyCode === keyCode);
					}
					else
					{
						// Firefox 32+
						isSameKey = (typeof ev.code !== "undefined" && ev.code === keyCode)
					}
					
					if (isSameKey)
					{
						break;
					}
				}
				
				if (isSameKey)
				{
					ev.preventDefault();
					
					var eleClickCur = null;
					
					if (typeof eleClick === "string")
					{
						eleClickCur = document.querySelector(eleClick);
					}
					else
					{
						eleClickCur = eleClick;
					}					
					
					if (eleClickCur)
					{
						eleClickCur.focus();
						eleClickCur.click();
					}
					
					return false;
				}
			}
		}, true);
	}
}

function addKeyCtrl(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Ctrl", function(ev)
	{
		return ev.ctrlKey && !ev.shiftKey && !ev.altKey;
	});
}

function addKeyCtrlShift(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Ctrl+Shift", function(ev)
	{
		return ev.ctrlKey && ev.shiftKey && !ev.altKey;
	});
}

function addKeyAlt(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Alt", function(ev)
	{
		return !ev.ctrlKey && !ev.shiftKey && ev.altKey;
	});
}

function addKeyCtrlEnter(form, input)
{
	addKeyCtrl(form, input, ["Enter", 13], "Enter", 1|2);
}

function addKeyCtrlShiftEnter(form, input)
{
	addKeyCtrlShift(form, input, ["Enter", 13], "Enter", 1|2);
}

function disableAfterClick(ele)
{
	ele.addEventListener("click", function (e)
	{
		var ele = e.target;
		
		var attrClick = ele.getAttribute("onclick");
		if (attrClick && attrClick.indexOf("confirm") > -1)
		{
			// skip if has confirm
			return;
		}
		
		var tagName = ele.tagName;
		if (tagName === "INPUT")
		{
			// don't change color after disable
			var styleCp = window.getComputedStyle(ele);
			if (styleCp)
			{
				ele.style.setProperty("color", styleCp.color, "important");
			}

			setTimeout(function(ele)
			{
                ele.disabled = true;
			}, timingInit.disableOnClick, ele);
			
			setTimeout(function(ele)
			{
				ele.disabled = false;
			}, timingInit.reenableAfterClick, ele);
		}
		else if (tagName === "IMG")
		{
			setTimeout(function(ele)
			{
                ele.dataset.stshOldonclick = ele.getAttribute("onclick") || "";
                ele.removeAttribute("onclick");
			}, timingInit.disableOnClick, ele);

			setTimeout(function(ele)
			{
				ele.setAttribute("onclick", ele.dataset.stshOldonclick);
			}, timingInit.reenableAfterClick, ele);
		}
		else if (tagName === "A")
		{
			setTimeout(function(ele)
			{
                ele.dataset.stshOldonclick = ele.getAttribute("onclick") || "";
                ele.setAttribute("onclick", "return false;");
			}, timingInit.disableOnClick, ele);
			
			setTimeout(function(ele)
			{
				ele.setAttribute("onclick", ele.dataset.stshOldonclick);
			}, timingInit.reenableAfterClick, ele);
		}
	}, true);
}

function removeAllEventListeners(element)
{
	if (element)
	{
		var clone = element.cloneNode(false);
		while (element.firstChild)
		{
			clone.appendChild(element.firstChild);
		}
		element.parentNode.replaceChild(clone, element);
	}
}

function focusWithoutScroll(selector) 
{
	var ele = null;
	
	if (selector instanceof HTMLElement)
	{
		ele = selector;
	}
	else
	{
		ele = document.querySelector(selector);
	}
	
	if (ele)
	{
		var x = window.scrollX;
		var y = window.scrollY;
		
		ele.focus();
		
		window.scrollTo(x, y);
	}
}

function scrollToId(id, offset)
{
	scrollToElement("#" + id, offset);
}

function scrollToElement(selector, offset)
{
	if (typeof offset === "undefined")
	{
		offset = -20;
	}
	
	var ele = null;
	if (selector)
	{
		if (selector instanceof HTMLElement)
		{
			ele = selector;
		}
		else
		{
			ele = document.querySelector(selector);
		}
		if (ele)
		{
			ele.scrollIntoView(true);
			window.scrollBy(0, offset);
		}
	}
}

function resizeSuggestionBox()
{
	var script = document.createElement('script');
	script.innerHTML = 
" \
/* STSH JS - resizeSuggestionBox */ \
var stsh_showSuggestionsBox_start = getTimeMs(); \
var stsh_showSuggestionsBox_itv = setIntervalCustom(function() \
{ \
	var stsh_showSuggestionsBox_isEnd = false; \
	var stsh_showSuggestionsBox_cur = getTimeMs(); \
	if (typeof showSuggestionsBox !== 'undefined') \
	{ \
		showSuggestionsBox = function(url) \
		{ \
			/* Edit from STS */ \
			g_suggestionsBoxIsOpen = true; \
			$('suggestions_box_outer').appear( \
			{ \
				duration : 0.1 \
			} \
			); \
			$('suggestions_iframe').setAttribute('src', url); \
			if (!Prototype.Browser.IE) \
			{ \
				$('suggestions_iframe').focus(); \
			} \
			$('suggestions_iframe').style.height = (document.viewport.getHeight() * 0.99) + 'px'; \
			return false; \
		}; \
		stsh_showSuggestionsBox_isEnd = true; \
	} \
	if (stsh_showSuggestionsBox_isEnd || stsh_showSuggestionsBox_cur - stsh_showSuggestionsBox_start > 10000) \
	{ \
		clearInterval(stsh_showSuggestionsBox_itv); \
	} \
}, 300); \
";
	
	document.head.appendChild(script);

	window.addEventListener("resize", function()
	{
		var iframe = document.querySelector("#suggestions_iframe");
		if (iframe)
		{
			iframe.style.height = (window.innerHeight * 0.99) + "px";
		}
	});
}

function isRally()
{
	var date = new Date();
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth() + 1;
	var day = date.getUTCDate();
	
	if ((month > 9) || (month === 9 && day >= 22) || (month === 0 && day <= 2))
	{
		return true;
	}
	
	return false;
}

function getQueryByName(name, url)
{
	if (!url)
	{
		url = (!window.location) ? "" : window.location.search;
	}
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	var results = regex.exec(url);
	var retVal = "";
	if (results)
	{
		retVal = results[1].replace(/\+/g, " ");
		try
		{
			retVal = decodeURIComponent(retVal);
		}
		catch (ex)
		{
			console.error("getQueryByName", ex.message);
		}
	}
	return retVal;
}

function padZero(num, size)
{
	return (1e15 + num + "").slice(-size);
}

function padZeroHex(num, size)
{
	return ("00000000000000000000000" + num.toString(16)).slice(-size).toUpperCase();
}

function randNum(min, max)
{
	return Math.round(Math.random() * (max - min) + min);
}

function isLastIndex(src, des)
{
	if (src !== null && src !== "" && des !== null && des !== "")
	{
		if (src.lastIndexOf(des) === src.length - 1)
		{
			return true;
		}
	}
	return false;
}

function isSpecialChar(ch)
{
	var chCode = -1;
	
	if (typeof ch === 'number')
	{
		chCode = ch;
	}
	else
	{
		chCode = ch.charCodeAt(0);
	}
	
	
	if ((chCode > -1 && chCode < 9) 		// 0-8
		|| (chCode > 10 && chCode < 13) 	// 11-12
		|| (chCode > 13 && chCode < 32))	// 14-31
	{
		return true;
	}
	
	return false;
}

function hasSpecialChar(str)
{
	var rgxSpCh = /[\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u000B\u000C\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F]+/;
	
	return rgxSpCh.test(str);
}
	
function checkSpecialCharMatched(str1, str2)
{
	// return (status, numSp1, numSp2)
	// status: 0:Match, 1:NotMatch, 2:NotEqual
	
	str1 = str1 || "";
	str2 = str2 || "";
	
	var strOut1 = "";
	var strOut2 = "";
	
	for (var i = 0; i < str1.length; i++)
	{
		if (isSpecialChar(str1[i]))
		{
			strOut1 += str1[i];
		}
	}
	for (var i = 0; i < str2.length; i++)
	{
		if (isSpecialChar(str2[i]))
		{
			strOut2 += str2[i];
		}
	}
	
	var retVal = 0;
	
	if (strOut1 === strOut2)
		retVal = 0;
	else if (strOut1.length === strOut2.length)
		retVal = 1;
	else
		retVal = 2;
	
	return new Array(retVal, strOut1.length, strOut2.length);
}

function countDiacriticalMark(str)
{
	str = str || "";
	var rgxDct = /[\u0300-\u036F]/g;
	var matchDct = str.match(rgxDct);
	var countDct = matchDct ? matchDct.length : 0;

	return countDct;
}

function countDescendantElement(ele)
{
	var countElement = 0;
	if (ele instanceof Element)
	{
		var children = ele.children;
		countElement = children.length;
		
		for (var i = 0; i < children.length; i++)
		{
			countElement += countDescendantElement(children[i]);
		}
	}	
	return countElement;
}

function trimSpace(str)
{
	if (str !== null)
	{
		return str.replace(/^[ \r\n\t]+/, "").replace(/[ \r\n\t]+$/, "");
	}
	return str;
}

function trimTab(str)
{
	if (str !== null)
	{
		return str.replace(/^[\r\n\t]+/, "").replace(/[\r\n\t]+$/, ""); //.replace(/\t+<\//, "<");
	}
	return str;
}

function trimTabLeft(str)
{
	if (str !== null)
	{
		return str.replace(/^[\r\n\t]+/, "");
	}
	return str;
}

function trimTabRight(str)
{
	if (str !== null)
	{
		return str.replace(/[\r\n\t]+$/, "");
	}
	return str;
}

function trimElement(ele)
{
	if (ele instanceof Element)
	{
		if (!ele.firstElementChild)
		{
			ele.textContent = trimTab(ele.textContent);
		}
		else
		{
			if (ele.firstChild.nodeType === document.TEXT_NODE)
			{
				ele.firstChild.textContent = trimTabLeft(ele.firstChild.textContent);
			}
			if (ele.lastChild.nodeType === document.TEXT_NODE)
			{
				ele.lastChild.textContent = trimTabRight(ele.lastChild.textContent);
			}
		}
	}
	
	return ele;
}

if (!String.prototype.endsWith)
{
	String.prototype.endsWith = function(searchString, position)
	{
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position)
			|| Math.floor(position) !== position || position > subjectString.length)
		{
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

function reload()
{
	var curHref = window.location.href;
	var posHashtag = curHref.indexOf("#");
	if (posHashtag > -1)
	{
		window.location = curHref.substr(0, posHashtag);
	}
	else
	{
		window.location = curHref;
	}
}

function getCookie(c_name) 
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start === -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start === -1) {
		c_value = null;
	}
	else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end === -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

var isVisible = (function()
{
	var stateKey;
	var eventKey;
	var keys =
	{
		hidden: "visibilitychange",
		webkitHidden: "webkitvisibilitychange",
		mozHidden: "mozvisibilitychange",
		msHidden: "msvisibilitychange"
	};
	for (stateKey in keys)
	{
		if (stateKey in document)
		{
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c)
	{
		if (c)
		{
			document.addEventListener(eventKey, c);
		}
		return !document[stateKey];
	}
})();

function isDstUs(year, month, day, hour)
{
	// Support: 2007 - 2029
	// Params: 2016, 3, 1, 15 === 1 Mar 2016 15:00
	
	var isDst = false;
	try
	{
		var y = parseInt(year);
		var m = parseInt(month);
		var d = parseInt(day);
		var h = parseInt(hour);
		
		var checkDstUsa = function(dayMar, dayNov, m, d, h)
		{
			var isDst = false;
			if ((m === 3 && d >= dayMar) || (m > 3 && m < 11) || (m === 11 && d <= dayNov))
				isDst = true;
			if ((m === 3 && d === dayMar && h < 2) || (m === 11 && d === dayNov && h >= 2))
				isDst = false;
			return isDst;
		}
		
		if (y === 2007 || y === 2012 || y === 2018 || y === 2029)
		{
			isDst = checkDstUsa(11, 4, m, d, h);
		}
		else if (y === 2013 || y === 2019 || y === 2024)
		{
			isDst = checkDstUsa(10, 3, m, d, h);
		}
		else if (y === 2008 || y === 2014 || y === 2025)
		{
			isDst = checkDstUsa(9, 2, m, d, h);
		}
		else if (y === 2009 || y === 2015 || y === 2020 || y === 2026)
		{
			isDst = checkDstUsa(8, 1, m, d, h);
		}
		else if (y === 2010 || y === 2021 || y === 2027)
		{
			isDst = checkDstUsa(14, 7, m, d, h);
		}
		else if (y === 2011 || y === 2016 || y === 2022)
		{
			isDst = checkDstUsa(13, 6, m, d, h);
		}
		else if (y === 2017 || y === 2023 || y === 2028)
		{
			isDst = checkDstUsa(12, 5, m, d, h);
		}
		
	}
	catch (ex)
	{
		console.error("isDstUs", ex.message);
	}
	return isDst;
}

function getDateIsoUs(unixTs)
{
	var dateUs = unixTs ? new Date(unixTs * 1000) : new Date();	
	
	dateUs.setTime(dateUs.getTime() - (1000 * 60 * 60 * 8));		// GMT-8
	
	if (isDstUs(dateUs.getUTCFullYear(), dateUs.getUTCMonth() + 1, dateUs.getUTCDate(), dateUs.getUTCHours()))
	{
		dateUs.setTime(dateUs.getTime() + (1000 * 60 * 60 * 1));	// GMT-7
	}
	
	return dateUs.toISOString();
}

function getDateUs(unixTs)
{
	return getDateIsoUs(unixTs).substr(0, 10);
}

function getDateTimeUs(unixTs)
{
	var dateIso = getDateIsoUs(unixTs);
	return dateIso.substr(0, 10) + " " + dateIso.substr(11, 8);
}

function getTimeUs(unixTs)
{
	return getDateIsoUs(unixTs).substr(11, 5);
}

function getDateIsoGmt(unixTs)
{
	var date = unixTs ? new Date(unixTs * 1000) : new Date();
	return date.toISOString();
}

function getDateGmt(unixTs)
{
	return getDateIsoGmt(unixTs).substr(0, 10);
}

function getTimeMs(unixTs)
{
	return unixTs ? new Date(unixTs * 1000).getTime() : new Date().getTime();
}

function getUnixTimestamp(date)
{
	return parseInt((date ? new Date(date) : new Date()).getTime() / 1000);
}
	
var pattUrlTimestamp = 
{
	type1: /\?t=[0-9]{6,}\&/g,
	type2: /\&t=[0-9]{6,}/g,
	type3: /\?t=[0-9]{6,}/g,
	type4: /\&[0-9]{6,}\&/g,
	type5: /\&$/,
};

function cleanUrlTimestamp(eles)
{
	if (!eles || !eles.length)
		return;

	for (var i = 0; i < eles.length; i++)
	{
		var val = "";
		var attr = "";
		
		if (eles[i].tagName === "A")
		{
			attr = "href";
		}
		else if (eles[i].tagName === "FORM")
		{
			attr = "action";
		}
		else if (eles[i].tagName === "DIV")
		{
			attr = "onclick";
		}
		else if (eles[i].tagName === "INPUT")
		{
			attr = "onclick";
			
			if (eles[i].name === "t")
			{
				removeElement(eles[i]);
				continue;
			}
		}
		
		var isEdit = false;
		
		val = eles[i].getAttribute(attr);
		if (pattUrlTimestamp.type1.test(val))
		{
			eles[i].setAttribute(attr, val.replace(pattUrlTimestamp.type1, "?"));
			isEdit = true;
		}
		else if (pattUrlTimestamp.type2.test(val))
		{
			eles[i].setAttribute(attr, val.replace(pattUrlTimestamp.type2, ""));
			isEdit = true;
		}
		else if (pattUrlTimestamp.type3.test(val))
		{
			eles[i].setAttribute(attr, val.replace(pattUrlTimestamp.type3, ""));
			isEdit = true;
		}
		
		if (isEdit)
		{
			val = eles[i].getAttribute(attr);
		}
		
		if (pattUrlTimestamp.type4.test(val))
		{
			eles[i].setAttribute(attr, val.replace(pattUrlTimestamp.type4, "&"));
		}
		
		if (pattUrlTimestamp.type5.test(val))
		{
			eles[i].setAttribute(attr, val.replace(pattUrlTimestamp.type5, ""));
		}
	}
}

var timeoutList = [];
var intervalList = [];

function setTimeoutCustom(func, tm, params)
{
	var id = setTimeout(func, tm, params);
	timeoutList.push(id);
	return id;
}

function clearTimeoutAll()
{
	for (var i = 0; i < timeoutList.length; i++)
	{
		clearTimeout(timeoutList[i]);
	}
}

function setIntervalCustom(func, tm, params)
{
	var id = setInterval(func, tm, params);
	intervalList.push(id);
	return id;
}

function clearIntervalAll()
{
	for (var i = 0; i < intervalList.length; i++)
	{
		clearInterval(intervalList[i]);
	}
}

function main()
{
	var perfStart = 0;
	if (performance && performance.now)
	{
		perfStart = performance.now();
	}
	
	var url = document.documentURI;
	var lang = getCookie("Language");
	var userId = "";
	var userName = "";
	
	if (document.body)
	{
		document.body.classList.add("stsh");
	}
	else
	{
		setTimeoutCustom(function()
		{
			if (document.body)
			{
				document.body.classList.add("stsh");
			}
		}, timingInit.initNameSpace);
	}
	
	// Auto refresh when error
	{
		var h1 = document.querySelector("#leftAreaContainer > h1, body > h1");
		if (h1)
		{
			var text = h1.textContent.trim();
			if (text === "Steam Translation Server - Maintenance Warning"
				|| text === "Forbidden")
			{
				console.log("stsh: refresh");
				setTimeoutCustom(reload, timingInit.refreshError);
				return;
			}
		}
	}

	// Clean links
	{
		setTimeoutCustom(function()
		{
			var eles = document.querySelectorAll("a, form[action], input");
			cleanUrlTimestamp(eles);
		}, timingInit.cleanLinks);
	}
	
	// Fix STS URL paths
	{
		var arrQuery = ["img"];
		var arrAttr = ["src"];
		
		for (var j = 0; j < arrQuery.length; j++)
		{
			var eles = document.querySelectorAll(arrQuery[j]);
			for (var i = 0; i < eles.length; i++)
			{
				var attr = eles[i].getAttribute(arrAttr[j]);
				if (attr)
				{
					var attrNew = attr.replace(/<\?=BASE_URL_CURRENT\?>/g, "/");
					if (attrNew !== attr)
					{
						console.log("STS URL path is missing: " + eles[i].outerHTML);
						eles[i].setAttribute(arrAttr[j], attrNew);
					}
				}
			}
		}
	}
	
	// Set current user
	{
		userId = GM_getValue("user", "");
		userName = GM_getValue("name", "");
		
		if (url.indexOf("/home.php") > -1)
		{
			var eleUser = document.querySelector("#leftAreaContainer > b > a[href^='user_activity.php?user=']");
			if (eleUser)
			{
				var user = getQueryByName("user", eleUser.href);
				if (user && userId !== user)
				{
					userId = user;
					GM_setValue("user", userId);
				}
				
				var name = eleUser.textContent.trim();
				if (name && userName !== name)
				{
					userName = name;
					GM_setValue("name", userName);
				}
			}
		}
	}

	var eleLogout = document.querySelector("#logout");
	if (eleLogout)
	{
		var logoutHtml = 
' \
<a class="stsh_a_button stsh_btn_myProfile stsh_border_left" target="_blank" \
 href="%PROFILE%" title="%NAME%">My Profile</a>\
<input name="login_button" class="stsh_border_right" value="Logout?" \
 type="submit" onclick="return confirm(\'Logout?\');" /> \
';
		logoutHtml = logoutHtml
			.replace("%PROFILE%", "/user_activity.php" + (userId ? "?user=" + userId : ""))
			.replace("%NAME%", userName);
		
		eleLogout.innerHTML = logoutHtml;
		
		// Special event button
		{
			if (isRally())
			{
				var divSpecial = document.createElement("div");
				divSpecial.id = "stsh_specialEvent";
				divSpecial.innerHTML = 
' \
<a class="stsh_a_button" target="_blank" href="/rally.php">Year-End Rally</a> \
';
				eleLogout.parentElement.appendChild(divSpecial);
			}
		}
	}
	
	// Declare functions
	var removeStsHtmlTags = null;
	var displayHtmlTags = null;
	{
		removeStsHtmlTags = function(ele, isRemovedBrowserGenerated)
		{
			isRemovedBrowserGenerated = (typeof isRemovedBrowserGenerated === "undefined")
				? true : !!isRemovedBrowserGenerated;
			
			var html = "";
			if (ele)
			{
				html = (typeof ele.dataset.stshHtml === "undefined") 
					? trimTab(ele.innerHTML) : ele.dataset.stshHtml;
				
				if (ele.classList.contains("stsh_text_org"))
				{
					html = html.replace(/<span style="color:#ff0000;">(.*?)<\/span>/ig, "$1")
						.replace(/<span style="color:#ffffff;">(.*?)<\/span>/ig, "$1")
						.replace(/<font style="BACKGROUND-COLOR: blue">(.+?)<\/font>/ig, "$1")
						.replace(/<font face="Times New Roman">(.+?)<\/font>/ig, "$1");
				}
				else if (ele.classList.contains("stsh_text_trn"))
				{
					html = html.replace(/<span style="color:#ff0000;">(.*?)<\/span>/ig, "$1")
						.replace(/<span style="color:#ffffff;">(.*?)<\/span>/ig, "$1")
						.replace(/<font face="Times New Roman">(.+?)<\/font>/ig, "$1");
				}
				else if (ele.classList.contains("suggestion_text"))
				{
					html = html.replace(/<span style="color:red;">(.*?)<\/span>/ig, "$1")
						.replace(/<font face="Times New Roman">(.+?)<\/font>/ig, "$1");
				}
				
				if (isRemovedBrowserGenerated)
				{
					// Remove browser generated attributes and ending tags
					// Regex .+? is "reluctant" that means "as few characters as it can"
					html = html.replace(/="">/g, ">")
						.replace(/([^\t])\t\t\t\t<\/[^\t ]+>$/, "$1")
						.replace(/<script data-pagespeed-no-defer[\s\S]+?\/script>/ig, "")
						.replace(/ data-pagespeed-url-hash=".+?"/ig, "")
						.replace(/ onload="pagespeed.+?"/ig, "");
				}
			}
			return html;
		}
		
		displayHtmlTags = function(ele)
		{
			if (ele)
			{
				ele.innerHTML = (typeof ele.dataset.stshHtml === "undefined") 
					? trimTab(ele.innerHTML).replace(/\<span[^\>]+class=\"stsh_[\s\S]+?\/span\>/ig, "")
					: ele.dataset.stshHtml;
				
				var isSkip = false;
				var isBb = (ele.textContent.indexOf("[/") > -1);
				
				var isUsThem = false;
				var isReplaceNewline = true;
				var isReplaceScript = true;
				var isDisplayBr = true;
				
				ele.innerHTML = removeStsHtmlTags(ele, false);
				
				if (ele.classList.contains("stsh_text_trn"))
				{
					if (ele.classList.contains("stsh_text_trn_empty"))
					{
						isSkip = true;
					}
				}
				else if (ele.classList.contains("stsh_usThem_translation"))
				{
					isUsThem = true;
					isReplaceNewline = false;
					isReplaceScript = false;
					isDisplayBr = false;
					
					if (ele.innerHTML === "<i>--- Not Yet Translated ---</i>")
					{
						isSkip = true;
					}
				}				
				
				//isReplaceScript = false;
				
				if (!isSkip)
				{
					ele.textContent = trimTab(ele.innerHTML);
					var newHtml = ele.innerHTML;
					if (!isBb)
					{
						if (isReplaceScript)
						{
							newHtml = newHtml
								.replace(/&lt;script([^&]+)[\s\S]+?\/script&gt;/ig, 
									"<br>&lt;script$1&gt;...&lt;/script&gt;<br>")
								.replace(/&lt;style([^&]+)[\s\S]+?\/style&gt;/ig, 
									"<br>&lt;style$1&gt;...&lt;/style&gt;<br>");
						}
						
						if (isReplaceNewline)
						{
							newHtml = newHtml
								.replace(/\n/ig, "\n<br>");
						}
						
						newHtml = newHtml
							
							// Remove browser generated attributes
							.replace(/=""&gt;/ig, "&gt;") 
							
							// Remove browser generated ending tags
							.replace(/([^\t])\t\t\t\t&lt;\/[^\t ]+&gt;$/i, "$1") 
							
							.replace(/&lt;/ig, '<span class="stsh_marker">&lt;')
							.replace(/&gt;/ig, "&gt;</span>")
							.replace(/&lt;li/ig, "<br>&lt;li")
							.replace(/&amp;/ig, "&");
							
						if (isDisplayBr)
						{
							newHtml = newHtml
								.replace(/br([ \/]*)&gt;<\/span>/ig, "br$1&gt;</span><br>");
						}
						else
						{
							newHtml = newHtml
								.replace(/<span class="stsh_marker">&lt;br([ \/]*)&gt;<\/span>/ig, "<br>");
						}
					}
					else
					{
						if (isReplaceNewline)
						{
							newHtml = newHtml
								.replace(/\n/ig, "\n<br>");
						}
						
						newHtml = newHtml
							.replace(/\[/ig, '<span class="stsh_marker">[')
							.replace(/\]/ig, "]</span>")
							.replace(/&lt;font face="Times New Roman"&gt;-&lt;\/font&gt;/ig, "-")
							.replace(/&amp;nbsp;/ig, " ");
					}
					
					if (isUsThem)
					{
						var status = newHtml.substr(67, 8);
						//console.log(status);
						
						if (status === "pending)")
						{
							newHtml = '<font style="color:CF8B37">(pending)</font>' + newHtml.substr(121);
						}
						else if (status === "approved")
						{
							newHtml = '<font style="color:A4B23C">(approved)</font>' + newHtml.substr(122);
						}
						else if (status === "outdated")
						{
							newHtml = '<font style="color:FF0000">(outdated)</font>' + newHtml.substr(122);
						}
					}
					
					ele.innerHTML = newHtml;
				}
			}
		}
	}
	// End Declare functions
	
	if (url.indexOf("Us_And_Them.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_usAndThem");
		
		var h1 = document.querySelector("#leftAreaContainer > h1:nth-child(2)");
		if (h1)
		{
			var header = h1.textContent.trim();
			var key = header.split(" ")[0];
			h1.innerHTML = header.replace(key, "<a href='/translate.php?keyonly=1&search_input="
				+ encodeURIComponent(key) + "' >" + key + "</a>");
			document.title = key + " - " + document.title;
		}
		
		// Hilight cur lang
		{
			var eleTable = document.querySelector("#leftAreaContainer > table");
			if (eleTable)
			{
				eleTable.classList.add("stsh_usThem");
				
				var eleLangCur = null;
			
				var elesLang = eleTable.querySelectorAll("tr > td:nth-child(1) > a");
				for (var i = 1; i < elesLang.length; i++)
				{
					if (lang === elesLang[i].textContent.trim().toLowerCase())
					{
						eleLangCur = elesLang[i].parentElement.parentElement;
						break;
					}
				}
				
				if (eleLangCur)
				{
					eleLangCur.classList.add("stsh_usThem_langCur");
				}
				
				if (elesLang.length > 1)
				{
					elesLang[0].parentElement.parentElement.classList.add("stsh_usThem_langEng")
				}
			}
		}
		
		// Normalize
		// Add start/end marker to English text
		{
			var elesTranslation = document.querySelectorAll(
				".stsh_usThem > tbody:nth-child(1) > tr > td:nth-child(2)");
			for (var i = 0; i < elesTranslation.length; i++)
			{
				elesTranslation[i].classList.add("stsh_usThem_translation");
				
				var eleFirst = elesTranslation[i].firstElementChild;
				if (eleFirst && eleFirst.textContent === "(outdated)")
				{
					// Fix STS inconsistent space
					insertAfterElement(document.createTextNode(" "), eleFirst);
				}
			}
		
			var container = "\"";
			var tdEng = elesTranslation.length > 1 ? elesTranslation[0] : null;
			if (tdEng)
			{
				//tdEng.innerHTML = container + tdEng.innerHTML + container;
			}
		}
		
		// Add scroll to
		// Add move up
		{
			var eleMenu = document.createElement("div");
			document.body.appendChild(eleMenu);
			eleMenu.innerHTML = 
' \
<div class="stsh_menu_group"> \
	&nbsp; <span class="stsh_scroll_header">Scroll To</span>\
	<br> &nbsp; <input value="English"  \
		class="stsh_btn_long" type="button" onclick="scrollToElement(\'.stsh_usThem_langEng\', -8); return false;" > \
	<br> &nbsp; <input value="My lang" \
		class="stsh_btn_long" type="button" onclick="scrollToElement(\'.stsh_usThem_langCur\', -30); return false;" > \
	<div class="stsh_block_scrollToDiscussion stsh_inline"> \
	<br> &nbsp; <input value="Discussion" \
		class="stsh_btn_long" \
		type="button" onclick="scrollToElement(\'a[name=\\\'tokendiscussion\\\']\'); return false;" > \
	</div> \
	<br> \
	<br> &nbsp; <input value="Move up my lang" \
		class="stsh_btn_long stsh_btn_moveLang" type="button" onclick="return false;" > \
	<br> \
	<div class="stsh_block_displayHtml stsh_inline"> \
	<br> &nbsp; <input value="Display HTML tags" \
		class="stsh_btn_long stsh_btn_displayHtmlTags" type="button" onclick="return false;" > \
	<br> \
	</div> \
	<br> &nbsp; <input value="Refresh" \
		class="stsh_btn_long" type="button" onclick="window.location = window.location.href; return false;" /> \
	<br> \
</div> \
';
			if (!document.querySelector("a[name='tokendiscussion']"))
			{
				var eleBlock = document.querySelector(".stsh_block_scrollToDiscussion");
				if (eleBlock)
				{
					eleBlock.classList.add("stsh_hidden");
				}
			}

			var eleMove = eleMenu.querySelector(".stsh_btn_moveLang");
			if (eleMove)
			{
				eleMove.addEventListener("click", function(ev)
				{
					var ele = ev.target;
					ele.disabled = true;
					
					var eleLangEng = document.querySelector(".stsh_usThem_langEng");
					var eleLangCur = document.querySelector(".stsh_usThem_langCur");
					if (eleLangEng && eleLangCur)
					{
						insertAfterElement(eleLangCur, eleLangEng);
					}
				});
			}
			
			// Sample: https://translation.steampowered.com/Us_And_Them.php?token_key_ID=21476726000412883
			var eleHtml = eleMenu.querySelector(".stsh_btn_displayHtmlTags");
			if (eleHtml)
			{
				var eleEng = document.querySelector(".stsh_usThem_langEng > .stsh_usThem_translation");
				if (eleEng.firstElementChild)
				{
					eleHtml.addEventListener("click", function(ev)
					{
						var ele = ev.target;
						ele.disabled = true;
						
						var elesTranslation = document.querySelectorAll(".stsh_usThem_translation");
						for (var i = 0; i < elesTranslation.length; i++)
						{
							displayHtmlTags(elesTranslation[i]);
						}
					});
				}
				else
				{
					var eleBlock = document.querySelector(".stsh_block_displayHtml");
					if (eleBlock)
					{
						eleBlock.classList.add("stsh_hidden");
					}
				}
			}
		}
	
	} // End Us_And_Them.php

	if (url.indexOf("suggestions.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_suggestions");
		
		var eleTextOrg = null;
		var eleTextTrn = null;
		var eleTextNew = null;
		var elesTextSug = null;
		
		var eleTextSubmit =  null;
		var eleTextSubmitNext = null;
		var elesTextRemoveComment = null;
	
		var eleHeaderOrg = null;
		var eleHeaderTrn = null;
		
		// Normalize
		{
			eleTextOrg = document.querySelector(".progress > tbody > tr:last-child > td:nth-child(1)");
			if (eleTextOrg)
			{
				eleTextOrg.classList.add("stsh_text_org");
				trimElement(eleTextOrg);
				eleTextOrg.dataset.stshHtml = eleTextOrg.innerHTML;
			}
			
			eleTextTrn = document.querySelector(".progress > tbody > tr:last-child > td:nth-child(3)");
			if (eleTextTrn)
			{
				eleTextTrn.classList.add("stsh_text_trn");
				trimElement(eleTextTrn);
				
				if (eleTextTrn.textContent === "")
				{
					eleTextTrn.classList.add("stsh_text_trn_empty");
				}
				
				eleTextTrn.dataset.stshHtml = eleTextTrn.innerHTML;
			}
			
			eleTextNew = document.querySelector("#suggestion_value_new");
			
			elesTextSug = document.querySelectorAll(".suggestion_text");
			for (var i = 0; i < elesTextSug.length; i++)
			{
				elesTextSug[i].classList.add("stsh_text_sug");
				elesTextSug[i].dataset.stshHtml = elesTextSug[i].innerHTML;
			}
			
			eleTextSubmit =  document.querySelector(".lbAction[name='suggestion_temp'] input[accesskey='s']");
			if (eleTextSubmit)
			{
				eleTextSubmit.classList.add("stsh_text_submit");
				
				if (eleTextSubmit.value.indexOf("RESUBMIT") > -1)
				{
					eleTextSubmit.classList.add("stsh_text_resubmit");
				}
			}
			
			eleTextSubmitNext = document.querySelector(".lbAction input[type='submit'][accesskey='a']");
			if (eleTextSubmitNext)
			{
				eleTextSubmitNext.value = "Next";
				eleTextSubmitNext.classList.add("stsh_text_submit_right");
			}
			
			elesTextRemoveComment = document.querySelectorAll(".suggestion_signature .lbAction[name^='mymodcomment'] a");
			for (var i = 0; i < elesTextRemoveComment.length; i++)
			{
				elesTextRemoveComment[i].removeAttribute("href");
				elesTextRemoveComment[i].classList.add("stsh_text_removeComment");
			}
			
			var elesTextComment = document.querySelectorAll("textarea[name='suggestion_comment']");
			for (var i = 0; i < elesTextComment.length; i++)
			{
				elesTextComment[i].nextElementSibling.classList.add("stsh_submit_comment");
				elesTextComment[i].classList.add("stsh_text_addComment");
			}
			
			var eleInputPrev = document.querySelector("#suggestions_nav > input[value^='Prev']");
			if (eleInputPrev)
			{
				eleInputPrev.classList.add("stsh_nav_prev");
			}
			
			var eleInputNext = document.querySelector("#suggestions_nav > input[value~='Next']");
			if (eleInputNext)
			{
				eleInputNext.classList.add("stsh_nav_next");
			}
		
			var elesApprove = document.querySelectorAll(".suggestion_signature input[value~='APPROVE']");
			for (var i = 0; i < elesApprove.length; i++)
			{
				elesApprove[i].classList.add("stsh_action_approve");
			}
			
			var elesDecline = document.querySelectorAll(".suggestion_signature input[value~='DECLINE']");
			for (var i = 0; i < elesDecline.length; i++)
			{
				elesDecline[i].classList.add("stsh_action_decline");
			}

			var elesApply = document.querySelectorAll(".suggestion_signature input[value~='APPLY']");
			for (var i = 0; i < elesApprove.length; i++)
			{
				elesApply[i].classList.add("stsh_action_apply");
			}
			
			var elesNext = document.querySelectorAll(".suggestion_signature input[value~='Next']");
			for (var i = 0; i < elesNext.length; i++)
			{
				elesNext[i].value = "Next";
				
				var elePrev = elesNext[i].previousElementSibling;
				if (elePrev)
				{
					if (elePrev.classList.contains("stsh_action_approve"))
					{
						elesNext[i].classList.add("stsh_action_approve_next");
					}
					else if (elePrev.classList.contains("stsh_action_decline"))
					{
						elesNext[i].classList.add("stsh_action_decline_next");
					}
					else if (elePrev.classList.contains("stsh_action_apply"))
					{
						elesNext[i].classList.add("stsh_action_apply_next");
					}
				}
			}
			
			var elesRemove = document.querySelectorAll(".suggestion_signature input[value='REMOVE']");
			for (var i = 0; i < elesRemove.length; i++)
			{
				elesRemove[i].classList.add("stsh_action_remove");
				elesRemove[i].classList.add("stsh_yellow_light");
			}
			
			var elesEdit = document.querySelectorAll("input[value='Edit']");
			for (var i = 0; i < elesEdit.length; i++)
			{
				elesEdit[i].classList.add("stsh_action_edit");
				elesEdit[i].classList.add("stsh_blue_light");
			}
			
			var elesRemoveMyComment = document.querySelectorAll(
				".suggestion_signature .lbAction[name^='myFrm'] a[onclick*='.submit()']");
			for (var i = 0; i < elesRemoveMyComment.length; i++)
			{
				elesRemoveMyComment[i].removeAttribute("href");
				elesRemoveMyComment[i].classList.add("stsh_text_removeMyComment");
			}
			
			var elesFriendDiscuss = document.querySelectorAll(".friend_block_discussions");
			for (var i = 0; i < elesFriendDiscuss.length; i++)
			{
				var eleDiscuss = elesFriendDiscuss[i].parentElement.nextElementSibling;
				if (eleDiscuss)
				{
					eleDiscuss.classList.add("stsh_discussion");
				}
			}
			
			var eleSugList = document.querySelector(".suggestions_list:nth-child(2)");
			if (eleSugList)
			{
				if (eleSugList.childElementCount === 0)
				{
					eleSugList.classList.add("stsh_suggestion_list_empty");
				}
				else
				{
					for (var i = 0; i < eleSugList.children.length; i++)
					{
						if (eleSugList.children[i].querySelector(".suggestion_status_approved"))
						{
							eleSugList.children[i].classList.add("stsh_suggestion_border_approved");
						}
						else if (eleSugList.children[i].querySelector(".suggestion_status_declined"))
						{
							eleSugList.children[i].classList.add("stsh_suggestion_border_declined");
						}
						else
						{
							eleSugList.children[i].classList.add("stsh_suggestion_border_pending");
						}
					}
				}
			}
			
			var eleSugHistory = document.querySelector(".suggestions_list:nth-child(5)");
			if (eleSugHistory)
			{
				eleSugHistory.classList.add("stsh_suggestion_list_history");
			}
			
			var elesH1 = document.querySelectorAll(".progress > tbody:nth-child(2) > tr:nth-child(1) > td > h1:nth-child(1)");
			if (elesH1.length >= 2)
			{
				eleHeaderOrg = elesH1[0].parentElement;
				eleHeaderOrg.classList.add("stsh_header_org");
				eleHeaderTrn = elesH1[1].parentElement;
				eleHeaderTrn.classList.add("stsh_header_trn");
			}
			
			var eleSugListHeader = document.querySelector("#suggestionmain > div > h2");
			if (eleSugListHeader)
			{
				eleSugListHeader.classList.add("stsh_suggestion_list_header");
			}
		}
		
		// Remove horizon scroll
		{
			setTimeoutCustom(function()
			{
				var eleMain = document.querySelector("#suggestionmain");
				if (eleMain)
				{
					if (eleMain.scrollWidth < 1000)
					{
						eleMain.classList.add("stsh_body_crop");
					}
				}
			}, timingInit.removeHorizonScroll);
		}
		
		// Move region
		{
			if (eleTextTrn && eleTextTrn.classList.contains("stsh_text_trn_empty"))
			{
				var moveSuggestionBox = function()
				{
					var eleTextTrn = document.querySelector(".stsh_text_trn.stsh_text_trn_empty");
					if (eleTextTrn)
					{
						eleTextTrn.innerHTML = "";
						var eleTarget = document.querySelector("#suggestionmain > div:nth-child(4) > .lbAction");
						if (eleTarget)
						{
							eleTextTrn.appendChild(eleTarget);
							eleTextTrn.style.padding = "0px";
							
							var textarea = document.querySelector("#suggestion_value_new");
							if (textarea)
							{
								textarea.style.width = "98%";
								textarea.style.marginLeft = "0px";
								if (textarea.scrollHeight < 500)
								{
									textarea.style.height = (textarea.scrollHeight + 20) + "px";
								}
								else
								{
									textarea.style.height = "500px";
								}
								textarea.focus();
							}
							
							var eleTextOrg = document.querySelector(".stsh_text_org");
							if (eleTextOrg)
							{
								eleTextOrg.style.display = "table-cell";
								eleTextOrg.style.paddingTop = "6px";
							}
						}
					}
				}
				
				var moveSuggestionList = function()
				{
					var eleTextTrn = document.querySelector(".stsh_text_trn.stsh_text_trn_empty");
					if (eleTextTrn && eleTextTrn.textContent.trim() === "")
					{
						eleTextTrn.innerHTML = "";
						var eleTarget = document.querySelector(".suggestion");
						if (eleTarget)
						{
							eleTextTrn.appendChild(eleTarget);
							eleTextTrn.style.padding = "0px";
						}
					}
				}
				
				var eleDiv = document.createElement("div");
				eleDiv.classList.add("stsh_moveSuggestionContainer");
				eleTextTrn.appendChild(eleDiv);
					
				var eleMoveBox = document.createElement("input");
				eleMoveBox.id = "stsh_moveSuggestionBox";
				eleMoveBox.setAttribute("value", "Move Box Here");
				eleMoveBox.setAttribute("type", "button");
				eleDiv.appendChild(eleMoveBox);
				
				eleMoveBox.addEventListener("click", function(e)
				{
					moveSuggestionBox();
				});
				
				if (document.querySelector(".suggestion"))
				{
					var eleMoveList = document.createElement("input");
					eleMoveList.id = "stsh_moveSuggestionList";
					eleMoveList.setAttribute("value", "Move Suggestion Here");
					eleMoveList.setAttribute("type", "button");
					eleDiv.appendChild(eleMoveList);
					
					eleMoveList.addEventListener("click", function(e)
					{
						moveSuggestionList();
					});
				}
			}
		}
	
		// Resize suggestion textarea
		if (eleTextNew)
		{
			eleTextNew.style.width = "960px";
			eleTextNew.style.height = "64px";
			eleTextNew.style.marginLeft = "3px";
				
			var resizeTextNew = function(eleTextNew)
			{
				eleTextNew.focus();
				
				if (eleTextNew.scrollHeight < 500)
				{
					eleTextNew.style.height = (eleTextNew.scrollHeight + 20) + "px";
				}
				else
				{
					eleTextNew.style.height = "500px";
				}
				
				if (eleTextNew.scrollHeight > 200 && document.querySelector(".suggestion"))
				{
					eleTextNew.scrollIntoView();
				}
			};
			
			if (isVisible())
			{
				resizeTextNew(eleTextNew);
			}
			else
			{
				// Fix size error when inactive
				setTimeoutCustom(resizeTextNew, timingInit.resizeTextNew, eleTextNew);
			}
		}
	
		// Add nav menu
		{
			/* // Unknown reason
			var br = document.querySelector("form.lbAction:nth-child(2) > div:nth-child(2) > br:nth-child(1)");
			if (br)
			{
				removeElement(br);
			}
			*/
			
			var key = "";
		
			var eleNav = document.querySelector("div#suggestions_nav");
			if (!eleNav)
			{
				// Add when error occured
				eleNav = document.createElement("div");
				eleNav.id = "suggestions_nav";
				document.body && document.body.appendChild(eleNav);
			}
			if (eleNav)
			{
				var insert = "";
				var insertSearch = "";
				var insertView = "";
				
				var spliter = "_";
				var regApp = /[0-9]{4,}/;
			
				var aKey = document.querySelector(".smallcopy > font:nth-child(2) > a:nth-child(1)");
				if (aKey)
				{
					key = encodeURIComponent(aKey.textContent.trim());
				
					if (key === "token-key")
					{
						aKey = document.querySelector(".smallcopy > a:nth-child(3)");
						if (aKey)
						{
							key = encodeURIComponent(aKey.textContent.trim());
						}
					}
				
					if (key !== "")
					{
						document.title = key + " - " + document.title;
						
						if (key.split(spliter).length > 1)
						{
							if (key.indexOf("%23") === 0)
							{
								var firstSpliter = key.indexOf(spliter);
								var keySharp = key.substring(0, firstSpliter);
								insertSearch += '<a class="stsh_a_button" target="_blank" '
									+ ' href="/translate.php?keyonly=1&paginationrows=1000&search_input='
									+ keySharp + '">Hashtag</a>';
							}
						
							var lastSpliter = key.lastIndexOf(spliter);
							var keyGroup = key.substring(0, lastSpliter);
							insertSearch += '<a class="stsh_a_button" target="_blank" '
								+ ' href="/translate.php?keyonly=1&paginationrows=1000&search_input='
								+ keyGroup + '">Group</a>';
						}
						insertSearch += '<a class="stsh_a_button" target="_blank" '
							+ ' href="/translate.php?keyonly=1&search_input='
							+ key + '">Key</a>';
					}
				}
				
				if (eleTextOrg)
				{
					var text = encodeURIComponent(eleTextOrg.textContent.trim())
						.replace(/(%20|%09)/g,"+")
						.replace(/'/g,"\\'")
						.replace("%0A", "+")
						.replace(/\++/g, "+")
						.substr(0, 80);
					
					if (text.length >= 80)
					{
						// Find last space
						var last = text.lastIndexOf("+");
						last = last < 0 ? 80 : last;
						text = text.substr(0, last);
					}
					
					if (text.indexOf(". ") > 20)
					{
						// Find first .
						text = text.substr(0, text.indexOf(". ") + 1);
					}
					
					if (text.indexOf("%5C") > 10)
					{
						// Find first \ 
						text = text.substr(0, text.indexOf("%5C"));
					}
					
					/* // Unknown reason
					if (eleTextSubmit)
					{
						var elePrev = eleTextSubmit.previousElementSibling;
						if (!elePrev || elePrev.tagName !== "BR")
						{
							var eleNew = document.createElement("br");
							insertBeforeElement(eleNew, eleTextSubmit);
						}
					}
					*/
					
					if (text !== "")
					{
						insertSearch += '<a class="stsh_a_button" target="_blank" '
							+ ' href="/translate.php?keyonly=2&paginationrows=1000&search_input='
							+ text + '">String</a>';
						
						if (eleTextSubmitNext)
						{							
							var eleForm = eleTextSubmitNext.parentElement.parentElement;
							if (eleForm.tagName === "FORM")
							{
								addKeyCtrlShiftEnter(eleForm, eleTextSubmitNext);
							}
						}
						else
						{
							if (eleTextSubmit)
							{
								eleTextSubmitNext = document.createElement("input");
								eleTextSubmitNext.id = "stsh_text_submit_next";
								eleTextSubmitNext.classList.add("stsh_text_submit_right");
								eleTextSubmitNext.setAttribute("type", "submit");
								eleTextSubmitNext.setAttribute("value", "Next");
								eleTextSubmitNext.setAttribute("name", "submitandnext");
								insertAfterElement(eleTextSubmitNext, eleTextSubmit);
								
								eleTextSubmitNext.addEventListener("click", function(ev)
								{
									var textOrg = "";
									var textTrn = "";
									var textCur = "";
									
									var eleTextOrg = document.querySelector(".stsh_text_org");
									if (eleTextOrg)
									{
										textOrg = trimSpace(eleTextOrg.textContent);
									}
									var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
									if (eleTextTrn)
									{
										textTrn = trimSpace(eleTextTrn.textContent);
									}
									var eleTextCur = document.querySelector("#suggestion_value_new");
									if (eleTextCur)
									{
										textCur = trimSpace(eleTextCur.value);
									}
									
									if (textCur === "" || textOrg === textCur || textTrn === textCur)
									{
										ev.preventDefault();
										
										var eleTextSubmit = document.querySelector(".stsh_text_submit");
										if (eleTextSubmit)
										{
											eleTextSubmit.click();
										}
									}
								});
								
								var eleForm = eleTextSubmit.parentElement.parentElement;
								if (eleForm.tagName === "FORM")
								{
									addKeyCtrlShiftEnter(eleForm, eleTextSubmitNext);
								}
							}
						}
						
						if (eleTextSubmitNext)
						{
							var canNext = !!(document.querySelector(".stsh_nav_next:not(:disabled)"));
							if (!canNext)
							{
								// Display as disabled
								eleTextSubmitNext.classList.add("stsh_grey");
								eleTextSubmitNext.classList.add("stsh_cursor_default");
							}
						}
					}
					else 
					{
						// (text === "")
						
						if (eleTextNew && eleTextSubmit && !eleTextSubmit.classList.contains("stsh_text_resubmit"))
						{
							var eleNew = document.createElement("input");
							eleNew.id = "stsh_text_submit_space";
							eleNew.classList.add("stsh_text_submit_right");
							eleNew.setAttribute("type", "button");
							//eleNew.setAttribute("value", "Submit Space (Alt+0160)");
							eleNew.setAttribute("value", "Submit Empty (2 Newlines)");
							insertAfterElement(eleNew, eleTextSubmit);
							
							eleNew.addEventListener("click", function(ev)
							{
								var eleTextNew = document.querySelector("#suggestion_value_new");
								if (eleTextNew)
								{
									// Space char
									//eleTextNew.value = String.fromCharCode(160);
									
									// Two newlines result in one newline when export
									eleTextNew.value = "\n\n";
									
									eleTextNew.focus();
									
									ev.preventDefault();
									
									var eleTextSubmit = document.querySelector(".stsh_text_submit");
									if (eleTextSubmit)
									{
										eleTextSubmit.click();
									}
								}
							});
						}
					}
				}
			
			
				var qBranch = getQueryByName("branch");
				if (qBranch.indexOf("games") !== 0)
				{
					var app = regApp.exec(key.replace("%23", ""));
					if (app && key.indexOf("faq") < 0 && key.indexOf("glossary") < 0)
					{
						if (key.indexOf("SharedFiles_App_") === 0)
						{
							insertView += '<a class="stsh_a_button" target="_blank" '
								+ ' href="https://steamcommunity.com/workshop/browse?appid='
								+ app + '">Workshop</a>';
						}
					
						insertView += '<a class="stsh_a_button" target="_blank" '
							+ ' href="https://steamcommunity.com/app/'
							+ app + '">Community</a>'
					
						insertView += '<a class="stsh_a_button" target="_blank" '
							+ ' href="https://store.steampowered.com/app/'
							+ app + '">App</a>';
					}
				}
				
				if (insertSearch)
				{
					insert += ' <br> &nbsp; Search: <div class="stsh_nav_group"> ' + insertSearch + " </div>";
				}
				
				if (insertView)
				{
					insert += ' <br> &nbsp; View: <div class="stsh_nav_group"> ' + insertView + " </div>";
				}
			
				var insertBefore = 
' \
<input id="stsh_refresh" value="Refresh" onclick="return false;" type="button"> \
<a class="stsh_a_button" target="_blank" href="' + url + '">Frame</a> \
';

				var innerNew = eleNav.innerHTML
					.replace('<input value="Previous', '&nbsp;&nbsp;<input value="Prev')
					.replace('<input value="Close X', '&nbsp;&nbsp;<input value="Close (ESC)');
			
				eleNav.innerHTML = insertBefore + innerNew + insert + " <br> ";
				
				var eleRefresh = document.querySelector("#stsh_refresh");
				if (eleRefresh)
				{
					eleRefresh.addEventListener("click", function()
					{
						reload();
					});
				}
			}
		}
	
		// Regroup glossary
		// Auto replace matched string
		{
			setTimeoutCustom(function()
			{
				var br = "<br>";
				var brSpace = " <br> ";
				var tag = "<a";
				var colon = ">: ";
				var comma = ",";
				var bracket = " (";
				var isEdit = false;
				
				var p = null;
				
				var aGls = document.querySelectorAll("a[href='glossary.php']");
				for (var i = 0; i < aGls.length; i++)
				{
					if (aGls[i].textContent.trim() === "GLOSSARY FEATURE")
					{
						p = aGls[i].parentElement;
						break;
					}
				}
				
				if (p)
				{
					var glosOuters = [];
					var glosInnerStart = 0;
					var countGl = 0;
					var glossaries = p.innerHTML.split(br);
					if (glossaries.length > 2)
					{
						glosOuters = [p];
						glosInnerStart = 2;
					}
					else
					{
						glosOuters = p.nextSibling.querySelectorAll("td");
						glosInnerStart = 0;
					}
					
					var rgxKey = />[^><]+</;
					var rgxKeyClean = /[><]+/g;
					var rgxKeyPunct = /[\(\)\[\]\:\!]/g;
					var rgxContentClean = /<[^<]*>/g;
					var textNew = "";
					var textEng = "";
					var textNewFull = "";
					var textEngFull = "";
					var isTextReplaced = false;
					var isOutdated = false;

					var eleBtnResummit = document.querySelector(".stsh_text_submit[value^='RESUBMIT']");
					if (eleBtnResummit)
					{
						isTextReplaced = true;
					}
					else
					{
						if (eleTextNew)
						{
							textNewFull = trimTab(eleTextNew.value.toLowerCase());
							textNew = textNewFull.trim();
						}
						if (textNew === "" || textNew.length > 300)
						{
							// Not replace on empty and long strings
							isTextReplaced = true;
						}
					}
					
					if (!isTextReplaced)
					{
						var eleTrs = document.querySelectorAll(".progress tr");
						isOutdated = (eleTrs.length >= 3);
						if (isOutdated)
						{
							textEngFull = trimTab(eleTrs[eleTrs.length - 1].firstElementChild.textContent.toLowerCase());
							textEng = textEngFull.trim();
						}
					}
					
					for (var i = 0; i < glosOuters.length; i++)
					{
						var glosOuter = glosOuters[i];
						
						var glosInners = glosOuter.innerHTML.split(br);
						
						isEdit = false;
						
						for (var j = glosInnerStart; j < glosInners.length; j++)
						{
							var glossary = glosInners[j].trim();
							if (glossary.length > 0 && glossary.indexOf(tag) === 0)
							{
								var colonIndex = glossary.indexOf(colon);
								var contentHead = glossary.substr(0, colonIndex + 3);
								var contentAll = glossary.substr(colonIndex + 3);
								var contentWords = contentAll.split(comma);
								var contentFirst = contentWords[0].trim();
								
								for (var k = 0; k < contentWords.length; k++)
								{
									var contentNew = contentWords[k].trim();
									var contentSub = null;
									
									var bracketPos = contentNew.indexOf(" (");
									if (bracketPos > -1)
									{
										contentSub = contentNew.substr(bracketPos);
										contentNew = contentNew.substr(0, bracketPos);
									}
									
									contentNew = " <span id='stsh_gls_" + countGl
										+ "' onclick='clickToSelect(this)'>"
										+ contentNew + "</span>";
										//+ "<span style='color: white; cursor: pointer;'>^</span>";
										
									if (contentSub)
									{
										contentNew +=  "<span "
											+ "onclick='clickToSelect(this.previousElementSibling)'>"
											+ contentSub + "</span>";
									}
									
									contentWords[k] = contentNew;
									countGl++;
								}
							
								if (!isTextReplaced)
								{
									var keys = contentHead.match(rgxKey);
									if (keys && keys.length > 0)
									{
										var key = keys[0].replace(rgxKeyClean, "").trim().toLowerCase();
										var contentClean = contentFirst.replace(rgxContentClean, "");
										var contentLower = contentClean.toLowerCase();
										var textCur = "";
										if (key === textNew.replace(rgxKeyPunct, ""))
										{
											textCur = textNewFull;
										}
										else if (key === textEng.replace(rgxKeyPunct, ""))
										{
											textCur = textEngFull;
										}
										
										if (textCur !== "" && key !== contentLower)
										{
											if (eleTextNew)
											{
												var rgxReplace = new RegExp(key, "i");
												eleTextNew.value = textCur.replace(rgxReplace, contentClean);
												isTextReplaced = true;
											}
										}
									}
								}
								
								glosInners[j] = contentHead + contentWords.join(comma);
								isEdit = true;
							}
						}
						if (isEdit && false)
						{
							// old feature
							glosOuter.innerHTML = glosInners.join(brSpace);
						}
					}
				}
			}, timingInit.improveGlossary);
		}
		
		// Insert clicked word in last textarea
		{
			var eleTextLast = null;
			
			setTimeoutCustom(function()
			{
				if (document.activeElement && document.activeElement.tagName === "TEXTAREA")
				{
					eleTextLast = document.activeElement;
				}
				
				var elesText = document.querySelectorAll
				(" \
					#suggestion_value_new \
					, .stsh_text_addComment \
					, #add_to_discussion \
					, textarea[name^='autoreplace'] \
					, .stsh_autoReplace_text \
				");
				for (var i = 0; i < elesText.length; i++)
				{
					elesText[i].addEventListener('focus', function(ev)
					{
						eleTextLast = ev.target;
					});
				}
			}, timingInit.bindLastText);
			
			setTimeoutCustom(function()
			{
				var elesInsert = document.querySelectorAll(".insertword");
				for (var i = 0; i < elesInsert.length; i++)
				{
					removeAllEventListeners(elesInsert[i]);
				}
				
				var insertAtCaret = function(txtarea, text)
				{
					// Edit from STS
					
					var scrollPos = txtarea.scrollTop;
					var strPos = 0;
					var strLength = 0;
					var br = ((txtarea.selectionStart || txtarea.selectionStart === 0) ? "ff" : (document.selection ? "ie" : false));
					if (br === "ie")
					{
						txtarea.focus();
						var range = document.selection.createRange();
						range.moveStart('character', -txtarea.value.length);
						strPos = range.text.length;
					}
					else if (br === "ff")
					{
						strPos = txtarea.selectionStart;
						strLength = txtarea.selectionEnd - txtarea.selectionStart;
					}
					var front = (txtarea.value).substring(0, strPos);
					var back = (txtarea.value).substring(strPos + strLength, txtarea.value.length);
					txtarea.value = front + text + back;
					strPos = strPos + text.length;
					if (br === "ie")
					{
						txtarea.focus();
						var range = document.selection.createRange();
						range.moveStart('character', -txtarea.value.length);
						range.moveStart('character', strPos);
						range.moveEnd('character', 0);
						range.select();
					}
					else if (br === "ff")
					{
						txtarea.selectionStart = strPos;
						txtarea.selectionEnd = strPos;
						txtarea.focus();
					}
					txtarea.scrollTop = scrollPos;
				}
			
				elesInsert = document.querySelectorAll(".insertword");
				for (var i = 0; i < elesInsert.length; i++)
				{
					//elesInsert[i].classList.add("stsh_unselectable");
					elesInsert[i].addEventListener("click", function(ev)
					{
						if (eleTextLast)
						{
							insertAtCaret(eleTextLast , ev.target.textContent.trim());
						}
					});
				}
			}, timingInit.insertAtCaret);
		}
		
		// Restyle glossary
		{
			var eleP = null;
				
			var elesA = document.querySelectorAll("a[href='glossary.php']");
			for (var i = 0; i < elesA.length; i++)
			{
				if (elesA[i].textContent.trim() === "GLOSSARY FEATURE")
				{
					eleP = elesA[i].parentElement;
					break;
				}
			}
			
			if (eleP)
			{
				var nodeText = eleP.firstElementChild.nextSibling;
				if (nodeText.nodeType === document.TEXT_NODE)
				{
					var ele = document.createElement("span");
					ele.textContent = nodeText.textContent;
					
					removeElement(nodeText);
					
					insertAfterElement(ele, eleP.firstElementChild);
				}
				
				var eleHead;
				
				if (eleP.nextElementSibling.tagName === "TABLE")
				{
					eleHead = eleP.nextElementSibling;
				}
				else
				{
					eleHead = eleP;
				}
				
				eleHead.classList.add("stsh_glossary_header");
				
				var elesTerm = eleHead.querySelectorAll(
					"a[href*='//translation.steampowered.com/translate.php?search_input=']");
				for (var i = 0; i < elesTerm.length; i++)
				{
					elesTerm[i].classList.add("stsh_glossary_term");
					
					// Clean glossary links
					{
						var href = elesTerm[i].href;
						var hrefNew = href.replace("http://", "//")
							.replace(/\?search_input=([^"])([^&]+)&keyonly=0&listfilter=0&listsort=0&liststatus=0&paginationrows=50/i
								, '\?keyonly=2&paginationrows=1000&search_input="$1$2"');
						elesTerm[i].href = hrefNew;
					}
				}
				
				{
					var eleSpan = null;
					if (eleHead.tagName === "TABLE")
					{
						eleSpan = eleHead.previousElementSibling.querySelector("span");
					}
					else
					{
						eleSpan = eleHead.querySelector("span");
					}
					eleSpan.textContent = eleSpan.textContent
						.replace(" (click to copy to top)", "");
					eleSpan.title = "Click to copy to suggestion or comment";
					eleSpan.classList.add("stsh_cursor_help");
					eleSpan.classList.add("stsh_glossary_help");
				}
			}
			
			var eleTd = document.querySelector(".stsh_glossary_header \
				> tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)");
			if (eleTd)
			{
				if (eleTd.childElementCount === 0)
				{
					removeElement(eleTd);
				}
			}
		}
		
		// Restyle same token
		{
			/* // Unknown reason
			var p = document.querySelector("#suggestionmain > div:nth-child(5) > p:nth-child(4)");
			if (p)
			{
				for (var i = 0; i < p.childNodes.length; i++)
				{
					var child = p.childNodes[i];
					if (child.nodeName === "#text")
					{
						child.nodeValue = child.nodeValue.trim();
					}
				}
			}
			*/
		
			var widthMax = 0;
			
			var elesFile = document.querySelectorAll(
				"#suggestionmain > div > p > a[href*='/translate.php?keyonly=1&search_input=']");
			for (var i = 0; i < elesFile.length; i++)
			{
				elesFile[i].classList.add("stsh_sametoken_file");
				
				var width = elesFile[i].offsetWidth;
				if (width > widthMax)
				{
					widthMax = width;
				}
			}
			
			for (var i = 0; i < elesFile.length; i++)
			{
				elesFile[i].style.minWidth = (widthMax + 4) + "px";
			}
			
			var eleHeader = null;
			
			if (elesFile.length > 0)
			{
				eleHeader = elesFile[0].parentElement;
			}
			
			if (eleHeader)
			{
				eleHeader.classList.add("stsh_sametoken_header");
				
				eleHeader.innerHTML = eleHeader.innerHTML.replace(
					"&lt;--- currently in view above", 
					'<span class="stsh_blue_light stsh_sametoken_current">&lt;--- currently in view above</span>');
			}
		}
		
		// Auto link http
		// Format comment
		// Show images
		{
			var countSugStatus = document.querySelectorAll(
				".suggestions_list span[class^='suggestion_status_']").length;
				
			var rgxUrl = /https?:[^ "]+/ig;
			var rgxHostUrl = /^https?:\/\/translation\.steampowered\.com\//i;
			var hostReplace = "/";
			var eleComments = document.querySelectorAll
			(" \
				.suggestion_signature > i:nth-child(3) \
				, .suggestion_signature div:nth-child(1) > i:nth-child(4) \
				, .suggestion_signature div:nth-child(1) > i:nth-child(6) \
				, *[class^='row'] > td:nth-child(2) \
			");
			for (var i = 0; i < eleComments.length; i++)
			{
				var comment = eleComments[i].innerHTML + " ";
				if (comment.indexOf("<a") === -1)
				{
					var commentUrls = comment.match(rgxUrl) || [];
					for (var j = 0; j < commentUrls.length; j++)
					{
						var urlDecode = commentUrls[j];
						try
						{
							urlDecode = decodeURIComponent(commentUrls[j])
								.replace(/#/g, "%23").replace(/&amp;/g, "&");
							//console.log(urlDecode);
							
							if (countSugStatus === 0 && rgxHostUrl.test(urlDecode))
							{
								var query = getQueryByName("search_input", urlDecode);
								
								if (query !== "")
								{
									urlDecode = query;
								}
								else
								{
									urlDecode = urlDecode.replace(rgxHostUrl, hostReplace);
								}
							}
						}
						catch (ex)
						{
							console.error("FormatComment", ex.message);
						}
						var commentUrl = commentUrls[j] + " ";
						comment = comment.replace(commentUrl, "<a target='_blank' href='"
							+ commentUrls[j] + "' >" + urlDecode + "</a> ");
					}
				}
				
				comment = comment.trim();
				var commentHead = "";
				var commentFoot = "";
		
				if (comment.indexOf("Comment:") === 0)
				{
					eleComments[i].classList.add("stsh_text_comment_header");
					comment = comment.substr(9);
					commentHead = "Comment: <span class='stsh_text_comment'>";
					commentFoot = "</span>";
				}
				else
				{
					var indexHead = comment.indexOf(":</font>");
					if (indexHead > -1)
					{
						commentHead = comment.substr(0, indexHead + 8);
						comment = comment.substr(indexHead + 8);
					}
				}
				
				comment = comment
					.replace(/([ \n])([\/~]{1,})([ \n])/g, "$1<span class='stsh_white stsh_pad'>$2</span>$3")
					//.replace(/\/ /g, "<span class='stsh_white stsh_pad'>/</span> ")
					//.replace(/ \//g, " <span class='stsh_white stsh_pad'>/</span>")
					.replace(/(\-+)\&gt\;/g, "<span class='stsh_white stsh_pad'>$1&gt;</span>")
					.replace(/ &gt; /g, " <span class='stsh_white stsh_pad'>&gt;</span> ")
					.replace(/(\-{2,})([^\&])/g, "<span class='stsh_white stsh_pad'>$1</span>$2")
					//.replace(/([^<>,]+)(\, +)([^<>,]+)/g, "$1<span class='stsh_white stsh_pad'>$2</span>$3")
					//.replace(/([^<>,]+)(\, +)([^<>,]+)/g, "$1<span class='stsh_white stsh_pad'>$2</span>$3")
					.replace(/\| /g, "<span class='stsh_white stsh_pad'>| </span>")
					.replace(/ \* /g, " <span class='stsh_white stsh_pad'>*</span> ")
					.replace(/ \.\.\.([ \n])/g, " <span class='stsh_white stsh_pad'>...</span>$1")
					.replace(/\n/g, "<br>")
					.replace(/Past application on (.{20})/g, 
						"<span class='stsh_white stsh_pad'><br>Past application on $1</span>");
				
				eleComments[i].innerHTML = commentHead + comment + commentFoot;
				
				var eleAs = eleComments[i].querySelectorAll("a");
				for (var j = 0; j < eleAs.length; j++)
				{
					var href = eleAs[j].getAttribute("href");
					if (href.indexOf("#") > -1)
					{
						eleAs[j].setAttribute("href", href.replace(/\#/g,"%23"));
					}
				}
				
				//if (comment.indexOf("Comment:") !== 0)
				{
					// Discussion comment
					
					var rgxImg = /(\.(jpg|png|gif)|\/ugc\/)/i;
					var rgxImgur = /^https?:\/\/imgur\.com\/([a-z0-9]+)\/?$/i;
					var rgxLongUrl = /^https?\:\/\/translation\.steampowered\.com\/translate\.php\?search_input\=/i;
					
					var elesA = eleComments[i].querySelectorAll("a");
					for (var j = 0; j < elesA.length; j++)
					{
						var href = elesA[j].getAttribute("href");
						
						if (rgxImgur.test(href))
						{
							href = href.replace(rgxImgur, "https://i.imgur.com/$1.png");
						}
						
						if (rgxImg.test(href))
						{
							if (elesA[j].querySelectorAll("img").length === 0)
							{
								var ele = document.createElement("img");
								ele.classList.add("stsh_comment_img");
								ele.setAttribute("src", href);
								ele.setAttribute("title", href);
								ele.dataset.modeNext = "unmin";
							
								insertAfterElement(ele, elesA[j]);
								
								if (ele.naturalWidth === 0 || ele.naturalWidth > 400 || ele.naturalHeight > 225)
								{
									ele.classList.add("stsh_comment_img_zoom");
									
									ele.addEventListener("click", function(ev)
									{
										var eleTarget = ev.target;
										var mode = "min";
										if (eleTarget.dataset.modeNext === "min")
										{
											mode = "min";
											eleTarget.dataset.modeNext = "unmin";
										}
										else
										{
											mode = "unmin";
											eleTarget.dataset.modeNext = "min";
										}
										
										if (eleTarget.naturalWidth < 400 && eleTarget.naturalHeight < 225)
										{
											eleTarget.classList.remove("stsh_comment_img_zoom");
										}
										
										var isHorizontal = eleTarget.naturalWidth > eleTarget.naturalHeight;
										if (isHorizontal)
										{
											eleTarget.style.maxHeight = "none";
											
											if (mode === "unmin")
											{
												eleTarget.style.minWidth = eleTarget.naturalWidth < 850 
													? eleTarget.naturalWidth + "px" : "850px";
											}
											else
											{
												eleTarget.style.minWidth = eleTarget.naturalWidth < 400 
													? eleTarget.naturalWidth + "px" : "400px";
											}
										}
										else
										{
											eleTarget.style.maxWidth = "none";
											
											if (mode === "unmin")
											{
												eleTarget.style.minHeight = eleTarget.naturalHeight < 850 
													? eleTarget.naturalHeight + "px" : "850px";
											}
											else
											{
												eleTarget.style.minHeight = eleTarget.naturalHeight < 225 
													? eleTarget.naturalHeight + "px" : "225px";
											}
										}
									});
								}
							}
						}
						else
						{
							var content = elesA[j].textContent;
							if (rgxLongUrl.test(content))
							{
								//console.log(elesA[j]);
								if (!elesA[j].parentElement.parentElement.parentElement
									.querySelector(".suggestion_signature .lbAction[name^='mymodcomment']"))
								{
									elesA[j].textContent = content.replace(rgxLongUrl, "").replace(/\+/g, " ");
								}
							}
						}
					}
				}
			}
		}
		
		// Add space between comment and button
		{
			var elesAction = document.querySelectorAll(".stsh_action_remove, .stsh_action_edit");
			for (var i = 0; i < elesAction.length; i++)
			{
				if (elesAction[i].previousElementSibling
					&& elesAction[i].previousElementSibling.previousElementSibling
					&& elesAction[i].previousElementSibling.previousElementSibling
						.classList.contains("stsh_text_comment_header"))
				{
					insertBeforeElement(document.createElement("br"), elesAction[i]);
				}
			}
		}
	
		// Restyle token info
		{
			var divIntro = document.querySelector("#suggestionmain > div.smallcopy");
			if (divIntro)
			{
				var qBranch = getQueryByName("branch");
				
				var htmlEdit = "You are editing";
				var htmlEditReplace = "";
				
				var htmlToken = "Token <";
				var htmlTokenReplace = "Token: <";
				
				var htmlToken2 = "token-key";
				var htmlToken2Replace = "Token";
				
				var htmlLiveLinkMoved = 
'\
<font style="color:red;">This FAQ likely does not exist anymore!</font>\
 The generated <a href="https://support.steampowered.com/kb_article.php?ref="\
 target="_blank">live link</a> seems dead or is redirecting.\
';
				var htmlLiveLinkMovedReplace = 
'\
<font class="stsh_red stsh_cursor_help"\
 title="The generated live link seems dead or is redirecting.">\
This FAQ likely does not exist anymore!</font>\
';
					
				var htmlLiveLinkMovedWithLiveLink = 
'\
<font style="color:red;">This FAQ likely does not exist anymore!</font> The generated \
<a href="https://support.steampowered.com/kb_article.php?ref=\
';
				var htmlLiveLinkMovedWithLiveLinkReplace = 
'<a href="https://support.steampowered.com/kb_article.php?ref=';
					
				var htmlLiveLinkMovedWithLiveLink2 = 
'" target="_blank">live link</a> seems dead or is redirecting.';
				var htmlLiveLinkMovedWithLiveLink2Replace = 
'\
" target="_blank">Live link</a> - \
<font class="stsh_red stsh_cursor_help"\
 title="The generated live link seems dead or is redirecting.">\
This FAQ likely does not exist anymore!</font>';
				
				var htmlLiveLink = 'target="_blank">Live link';
				var htmlLiveLinkReplace = 'target="_blank">Live link';	// Change in condition
				
				var htmlFile = " of <";
				var htmlFileReplace = 
' <br>File: <font class="stsh_info_file stsh_blue" onclick="clickToSelect(this)">' + qBranch + '</font> >> <';
				
				var htmlFrom = "<br>Added on <";
				var htmlFromReplace = " &nbsp;&nbsp;Added: <";
				
				var htmlUpdated = ">. Updated on <";
				var htmlUpdatedReplace = "> &nbsp;&nbsp;Updated: <";
				
				var htmlUpdated2 = "<br> Updated on <";
				var htmlUpdated2Replace = " &nbsp;&nbsp;Updated: <";
				
				var htmlSugg = 'You have  <font style="';
				var htmlSuggReplace = 
'You have <font title="Enter and submit new suggestions below.  Do not alter HTML tags or variables." class="stsh_cursor_help" style="';
				
				var htmlIntro = 
"Enter and submit new suggestions below. Do not alter HTML tags or variables.";
				var htmlIntroReplace =
' \
&nbsp;&nbsp;\
<a href="mailto:translationserver@valvesoftware.com" \
 title="Please report token issues by posting a TOKEN DISCUSSION \r\nor email to translationserver@valvesoftware.com" \
 class="stsh_cursor_help">\
<font class="stsh_white">Report Tokens</font></a>\
';
				
				var htmlContact = 
'\
<br>Please report token issues by posting a <font style="color:#a4b23c;">TOKEN DISCUSSION</font> tagged\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'truncated\')" value="[sts_admin][truncated]" type="button">or\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'typo\');" value="[sts_admin][typo]" type="button">or\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'unlockpls\')" value="[sts_admin][unlockpls]" type="button">or by \
<a href="mailto:translationserver@valvesoftware.com">email</a>.\
';
				var htmlContactReplace = '';
				
				var htmlContact2 = 
'\
<br>Please report token issues by posting a <font style="color:#a4b23c;">TOKEN DISCUSSION</font> tagged\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;" type="button"\
 onclick="tosts(\'truncated\')" value="[sts_admin][truncated]">or\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;" type="button"\
 onclick="tosts(\'typo\');" value="[sts_admin][typo]">or\
<input style="border:none; color:#FFFFFF; background-color:#111111; cursor:pointer;" type="button"\
 onclick="tosts(\'unlockpls\')" value="[sts_admin][unlockpls]">or by \
<a href="mailto:translationserver@valvesoftware.com">email</a>.\
';
				var htmlContact2Replace = '';
				
				var rgxTestEmail = 
/<br><font style="color:#a4b23c;">This is part of email message .+ - you can test it by following this link:<\/font> /i;
				var htmlTestEmailReplace = '';
				
				var rgxTestEmail2 = 
/<a href="test_email\.php\?filename=.+\&amp;lang=[a-z]+" target="_blank">Test<\/a>/i;
				var htmlTestEmail2Replace = '';
				
				var htmlsTestEmail = rgxTestEmail.exec(divIntro.innerHTML);
				if (htmlsTestEmail)
				{
					var htmlTestEmail = htmlsTestEmail[0]
						.replace('<br><font style="color:#a4b23c;">This is part of email message ', "")
						.replace(' - you can test it by following this link:</font> ', "");
					
					var htmlTestEmail2 = "";
					
					var htmlsTestEmail2 = rgxTestEmail2.exec(divIntro.innerHTML);
					if (htmlsTestEmail2)
					{
						htmlTestEmail2 = htmlsTestEmail2[0].replace('<a href="', "")
							.replace('" target="_blank">Test</a>', "");
					}
					
					htmlIntroReplace += ' &nbsp;&nbsp;Test: <a href="' + htmlTestEmail2 
						+ '"  title="You can test email by following this link." target="_blank">' 
						+ htmlTestEmail + '</a>';
				}
				
				if (key !== "")
				{
					htmlIntroReplace += 
' \
<br>Share: \
<font class="stsh_token_share stsh_green stsh_truncate" onclick="clickToSelect(this)">\
https://translation.steampowered.com/translate.php?search_input=' + key + '\
</font> <br>\
';
				}
				
				var urlLiveLink = "https://support.steampowered.com/kb_article.php?ref=";
				var eleLiveLink = divIntro.querySelector("a[href^='" + urlLiveLink + "']");
				if (eleLiveLink)
				{
					htmlLiveLinkReplace = 'target="_blank" title="Live link">' 
						+ eleLiveLink.getAttribute("href").replace(urlLiveLink, "");
				}
				
				var isComplete = (divIntro.innerHTML.indexOf(htmlContact) > -1);
				
				divIntro.innerHTML = divIntro.innerHTML
					.replace(htmlEdit, htmlEditReplace)
					.replace(htmlToken, htmlTokenReplace)
					.replace(htmlToken2, htmlToken2Replace)
					.replace(htmlLiveLinkMoved, htmlLiveLinkMovedReplace)
					.replace(htmlLiveLinkMovedWithLiveLink, htmlLiveLinkMovedWithLiveLinkReplace)
					.replace(htmlLiveLinkMovedWithLiveLink2, htmlLiveLinkMovedWithLiveLink2Replace)
					.replace(htmlLiveLink, htmlLiveLinkReplace)
					.replace(htmlFile, htmlFileReplace)
					.replace(htmlFrom, htmlFromReplace)
					.replace(htmlUpdated, htmlUpdatedReplace)
					.replace(htmlUpdated2, htmlUpdated2Replace)
					.replace(htmlSugg, htmlSuggReplace)
					.replace(htmlIntro, htmlIntroReplace)
					.replace(htmlContact, htmlContactReplace)
					.replace(htmlContact2, htmlContact2Replace)
					.replace(rgxTestEmail, htmlTestEmailReplace)
					.replace(rgxTestEmail2, htmlTestEmail2Replace)
					.trim();
					
				var eleToken = document.querySelector("a[href^='Us_And_Them.php?']");
				if (eleToken)
				{
					if (eleToken.textContent !== "Token")
					{
						eleToken.classList.add("stsh_token_name");
						eleToken.classList.add("stsh_truncate");
					}
				}
				
				if (!isComplete)
				{
					var stsh_introReplace_start = getTimeMs();
					var stsh_introReplace_itv = setIntervalCustom(function(params)
					{
						var divIntro = params[0];
						var htmlContact = params[1];
						var htmlContactReplace = params[2];
						
						var stsh_introReplace_isEnd = false;
						var stsh_introReplace_cur = getTimeMs();
						
						if (divIntro.innerHTML.indexOf(htmlContact) > -1)
						{
							divIntro.innerHTML = divIntro.innerHTML
								.replace(htmlContact, htmlContactReplace);
								
							stsh_introReplace_isEnd = true;
						}
						
						if (stsh_introReplace_isEnd || stsh_introReplace_cur - stsh_introReplace_start > 10000)
						{
							clearInterval(stsh_introReplace_itv);
						}
					}, 100, [divIntro, htmlContact, htmlContactReplace]);
				}
			}
		}
		
		// Restyle token discussion
		{
			var eleDiscuss = document.querySelector("a[name='tokendiscussion']");
			if (eleDiscuss)
			{
				var htmlHeader = "TOKEN DISCUSSION (keep global comments English please!):";
				var htmlHeaderReplace = "TOKEN DISCUSSION:";
				
				var eleHeader = eleDiscuss.nextElementSibling;
				if (eleHeader)
				{
					eleHeader.setAttribute("title", "Keep global comments English please!");
					eleHeader.classList.add("stsh_cursor_help");
					eleHeader.textContent = eleHeader.textContent.replace(htmlHeader, htmlHeaderReplace);
				}
				
				var eleParent = eleDiscuss.parentElement;
				eleParent.classList.add("stsh_discussion_header");
				
				if (eleParent.nextElementSibling)
				{
					eleParent.nextElementSibling.classList.add("stsh_discussion_section");
				}
				
				var elesInput = document.querySelectorAll("input[value='[stsadmin]']");
				if (elesInput.length === 2)
				{
					removeElement(elesInput[1]);
				}
				
				var eleSpan = document.createElement("span");
				eleSpan.innerHTML = 
'\
<input style="border:none; color:#888888; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'truncated\')" value="[sts_admin][truncated]" type="button">\
<input style="border:none; color:#888888; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'typo\');" value="[sts_admin][typo]" type="button">\
<input style="border:none; color:#888888; background-color:#111111; cursor:pointer;"\
 onclick="tosts(\'unlockpls\')" value="[sts_admin][unlockpls]" type="button">\
';
				
				eleParent.appendChild(eleSpan);
			}
				
			var eleAutoCopy = document.querySelector("#autocopy");
			if (eleAutoCopy)
			{
				var eleAutoCopyHeader = eleAutoCopy.previousElementSibling;
				eleAutoCopyHeader.classList.add("stsh_autoCopy_header");
				eleAutoCopyHeader.firstElementChild.firstElementChild.textContent = "AUTO-REPLACEMENT";
				
				eleAutoCopy.appendChild(document.createElement("br"));
			}
			
			var eleTableDiscuss = null;
			var eleFriendDiscuss = document.querySelector(".friend_block_discussions");
			if (eleFriendDiscuss)
			{
				if (eleAutoCopy)
				{
					insertBeforeElement(document.createElement("br"), eleAutoCopy.previousElementSibling);
				}
				
				eleTableDiscuss = eleFriendDiscuss.parentElement.parentElement.parentElement.parentElement;
				if (eleTableDiscuss.tagName === "TABLE")
				{
					eleTableDiscuss.classList.add("stsh_discussion_table");
				}
			}
			
			var elesDiscuss = document.querySelectorAll(".stsh_discussion");
			for (var i = 0; i < elesDiscuss.length; i++)
			{
				var nodesChild = elesDiscuss[i].childNodes;
				if (nodesChild.length > 2)
				{
					var arrNode = [];
					for (var j = 3; j < nodesChild.length; j++)
					{
						arrNode.push(nodesChild[j]);
					}
					
					var eleDiv = document.createElement("div");
					eleDiv.classList.add("stsh_discussion_text");
					
					for (var j = 0; j < arrNode.length; j++)
					{
						eleDiv.appendChild(arrNode[j]);
					}
					
					elesDiscuss[i].appendChild(eleDiv);
					
					eleDiv.classList.add("stsh_discussion_text_long");
					
				}
			}
		}
		
		// Decode URI in discussion
		{
			var elesA = document.querySelectorAll(".stsh_discussion_text > a[href*='%']");
			for (var i = 0; i < elesA.length; i++)
			{
				if (elesA[i].childElementCount === 0)
				{
					try
					{
						elesA[i].textContent = decodeURIComponent(elesA[i].textContent);
					}
					catch (ex)
					{
						console.error("DecodeUriDiscussion", ex.message);
					}
				}
			}
		}
		
		// Move up glossary
		{
			var moveUpGlossary = function()
			{
				var eleDiscuss = document.querySelector(".stsh_discussion_header");
				if (eleDiscuss)
				{
					var eleGlosGroup = document.createElement("div");
					eleGlosGroup.classList.add("stsh_glossary_group");
					
					insertBeforeElement(eleGlosGroup, eleDiscuss);
					
					var eleHead = document.querySelector(".stsh_glossary_header");
					if (eleHead)
					{
						if (!(eleHead.childNodes.length === 5 
							&& eleHead.childNodes[4].nodeType === document.TEXT_NODE
							&& eleHead.childNodes[4].nodeValue === "No results"))
						{
							eleGlosGroup.appendChild(document.createElement("br"));
							
							if (eleHead.tagName === "TABLE")
							{
								eleGlosGroup.appendChild(eleHead.previousElementSibling);
							}
							
							eleGlosGroup.appendChild(eleHead);
						}
					}
				}
			}
			
			var eleAutoCopy = document.querySelector(".stsh_autoCopy_header");
			if (eleAutoCopy)
			{
				var eleHead = document.querySelector(".stsh_glossary_header");
				if (eleHead)
				{
					insertAfterElement(eleAutoCopy.nextElementSibling, eleHead);
					insertAfterElement(eleAutoCopy, eleHead);
					insertAfterElement(document.createElement("br"), eleHead);
					insertAfterElement(document.createElement("br"), eleAutoCopy.nextElementSibling);
				}
			}
			
			var eleFriendDiscuss = document.querySelector(".friend_block_discussions");
			if (!eleFriendDiscuss)
			{
				moveUpGlossary();
			}
			else
			{
				var eleHelp = document.querySelector(".stsh_glossary_help");
				if (eleHelp)
				{
					var eleBtn = document.createElement("input");
					eleBtn.classList.add("stsh_glossary_move");
					eleBtn.setAttribute("type", "button");
					eleBtn.setAttribute("onclick", "return false;");
					eleBtn.value = "Move up";
					eleBtn.title = "Glossary is displayed below when discussion is active. "
						+ "\nClick here to move glossary up.";
					
					insertAfterElement(eleBtn, eleHelp);
					
					eleBtn.addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.classList.add("stsh_hidden");
						moveUpGlossary();
					});
				}
			}
		}
	
		// Add shortcut keys
		{
			var elesForm = document.querySelectorAll(".lbAction");
			for (var i = 0; i < elesForm.length; i++)
			{
				var eleForm = elesForm[i];
				var eleSubmit = eleForm.querySelector("input[type='submit']:not([name='admindecision'])");
				if (eleSubmit)
				{
					addKeyCtrlEnter(eleForm, eleSubmit);
				}
			}

			var elesInputApplyNext = document.querySelectorAll(".stsh_action_apply_next:not([disabled])");
			if (elesInputApplyNext.length > 0)
			{
				var eleBind = elesInputApplyNext[0];
				eleBind.title = "Should remove all other suggestions then APPROVE and APPLY."

				if (document.querySelectorAll(".stsh_action_remove").length === 1)
				{
					addKeyAlt(document, eleBind, ["KeyI", 73, "KeyD", 68], "I", 1);		// I D
					disableAfterClick(eleBind);
				}
			}
			
			var elesInputApprove = document.querySelectorAll(".stsh_action_approve");
			if (elesInputApprove.length > 0)
			{
				var eleBind = elesInputApprove[0];
				addKeyAlt(document, eleBind, ["BracketLeft", 219, "KeyO", 79, "KeyA", 65], "O", 2); // [ O A
				disableAfterClick(eleBind);
			}
			
			var eleInputApproveNext = document.querySelector(".stsh_action_approve_next");
			if (eleInputApproveNext)
			{
				var eleBind = null;
				
				if (!eleInputApproveNext.disabled)
				{
					// Can go next
					if (elesInputApprove.length === 1)
					{
						// Go next if only 1 suggestion
						
						if (document.querySelector(".suggestion_status_approved"))
						{
							// Don't go next if 1 or more approved suggestion
							eleBind = elesInputApprove[0];
						}
						else
						{
							eleBind = eleInputApproveNext;
						}
					}
					else if (elesInputApprove.length > 1)
					{
						// Only approve if more than 1 suggestion
						eleBind = elesInputApprove[0];
					}
				}
				else
				{
					// Can't go next
					
					if (elesInputApprove.length > 0)
					{
						eleBind = elesInputApprove[0];
					}
				}
					
				if (eleBind)
				{
					addKeyAlt(document, eleBind, ["BracketRight", 221, 171, "KeyP", 80, "KeyS", 83]);	// ] P S
					addKeyCtrl(document, eleBind, ["Backslash", 220, "Insert", 45], "Ins", 1|2);		// Backslash, INS
					disableAfterClick(eleBind);
				}
			}
		
			var eleInputDecline = document.querySelector(".stsh_action_decline");
			if (eleInputDecline)
			{
				var eleBind = eleInputDecline;
				var titleMode = 1|2;
				if (eleInputDecline.name === "admindecision")
				{
					titleMode = 2;
				}
				addKeyCtrl(document, eleBind, ["Delete", 46], "Del", titleMode);	// DEL
				disableAfterClick(eleBind);
				
				var eleInputDeclineNext = eleInputDecline.nextElementSibling;
				if (eleInputDeclineNext && eleInputDeclineNext.value.indexOf("Next") > -1
					&& !eleInputDeclineNext.disabled)
				{
					var eleBind = eleInputDeclineNext;
					addKeyCtrlShift(document, eleBind, ["Delete", 46], "Del", 2);	// DEL
					disableAfterClick(eleBind);
				}
			}
			else
			{
				var eleReconsider = document.querySelector(".suggestion_status_approved > a, .suggestion_status_declined > a");
				if (eleReconsider)
				{
					if (eleReconsider.parentElement.classList.contains("suggestion_status_approved"))
					{
						var elesReconsiderApprove = document.querySelectorAll(".suggestion_status_approved > a");
						if (elesReconsiderApprove.length > 0)
						{
							// Bind to last approve
							var eleBind = elesReconsiderApprove[elesReconsiderApprove.length - 1];
							addKeyCtrl(document, eleBind, ["Delete", 46], "Del", 2|16);		// DEL
						}
					}
					else
					{
						if (!eleReconsider.parentElement.parentElement
							.querySelector(".suggestion_signature .lbAction[name^='mymodcomment']"))
						{
							var eleBind = eleReconsider;
							addKeyAlt(document, eleBind, ["BracketRight", 221, 171, "KeyP", 80, "KeyS", 83]);	// ] P S
							addKeyCtrl(document, eleBind, ["Backslash", 220, "Insert", 45], "Ins", 2|16);		// Backslash INS
						}
					}
				}
			}
			
			if (elesTextRemoveComment.length > 0)
			{
				// Remove last comment
				var i = elesTextRemoveComment.length - 1;

				var eleBind = elesTextRemoveComment[i];
				addKeyCtrl(document, eleBind, ["Backspace", 8], "Bksp", 2|16);			// Backspace
			}
			
			var eleInputPrev = document.querySelector(".stsh_nav_prev");
			if (eleInputPrev)
			{
				var eleBind = eleInputPrev;
				addKeyCtrl(document, eleBind, ["BracketLeft", 219], "[", 1|2);			// [
				disableAfterClick(eleBind);
				
				// Remove space
				removeElement(eleBind.nextSibling);
			}
			
			var eleInputNext = document.querySelector(".stsh_nav_next");
			if (eleInputNext)
			{
				var eleBind = eleInputNext;
				addKeyCtrl(document, eleBind, ["BracketRight", 221, 171], "]", 1|2);	// ]
				disableAfterClick(eleBind);
			}
		}
	
		// Check special chars
		// Check combining diacritical marks
		// Check HTML elements count
		{
			if (eleHeaderOrg && eleHeaderTrn)
			{
				if (eleTextOrg && eleTextTrn)
				{
					var strOrg = trimTab(eleTextOrg.textContent);
					var strTrn = "";
					
					if (!eleTextTrn.classList.contains("stsh_text_trn_empty"))
					{
						strTrn = trimTab(eleTextTrn.textContent);
					}
					
					var elesSug = elesTextSug;
					
					// Check special chars
					{
						var statusTrnArr = checkSpecialCharMatched(strOrg, strTrn);
						var statusTrnMatched = statusTrnArr[0];
						var spOrg = statusTrnArr[1];
						var spTrn = statusTrnArr[2];
						
						if (spOrg > 0 || spTrn > 0)
						{
							var spTitle = "Please check special chars by pressing Display special chars button.";
							
							var spanSpOrg = document.createElement("span");
							spanSpOrg.id = "stsh_spanSpOrg";
							spanSpOrg.classList.add("stsh_spanStatusOrg");
							spanSpOrg.classList.add("stsh_blue");
							spanSpOrg.classList.add("stsh_cursor_help");
							spanSpOrg.title = spTitle;
								
							spanSpOrg.innerHTML = " SpecialChar: " + spOrg;
							eleHeaderOrg.appendChild(spanSpOrg);
						
							// Translated
							if (strTrn !== "")
							{
								var spanSpTrn = document.createElement("span");
								spanSpTrn.id = "stsh_spanSpTrn";
								spanSpTrn.classList.add("stsh_spanStatusTrn");
								spanSpTrn.classList.add("stsh_cursor_help");
								spanSpTrn.title = spTitle;
								
								if (statusTrnMatched === 0)
								{
									spanSpTrn.classList.add("stsh_green");
								}
								else
								{
									spanSpTrn.classList.add("stsh_red");
									spanSpTrn.classList.add("stsh_status_unmatched");
								}
								
								var outputTrn = " SpecialChar: " + spTrn;
								if (statusTrnMatched === 0)
								{
									outputTrn += " (Matched)";
								}
								else if (statusTrnMatched === 1)
								{
									outputTrn += " (Order not matched)";
								}
								else
								{
									outputTrn += " (Not matched)";
								}
								
								spanSpTrn.innerHTML = outputTrn;
								eleHeaderTrn.appendChild(spanSpTrn);
							}
							
							// Suggested
							for (var i = 0; i < elesSug.length; i++)
							{
								var eleSug = elesSug[i];
								var strSug = trimSpace(eleSug.textContent);
							
								var statusSugArr = checkSpecialCharMatched(strOrg, strSug);
								var statusSugMatched = statusSugArr[0];
								var spSug = statusSugArr[2];
								
								
								var spanSpSug = document.createElement("span");
								spanSpSug.classList.add("stsh_spanSpSug");
								spanSpSug.classList.add("stsh_spanStatusSug");
								spanSpSug.classList.add("stsh_cursor_help");
								spanSpSug.title = spTitle;
								
								if (statusSugMatched === 0)
								{
									spanSpSug.classList.add("stsh_green");
									spanSpSug.classList.add("stsh_status_matched");
								}
								else
								{
									spanSpSug.classList.add("stsh_red");
									spanSpSug.classList.add("stsh_status_unmatched");
								}
								
								var outputSug = " SpecialChar: " + spSug;
								if (statusSugMatched === 0)
								{
									outputSug += " (Matched)";
								}
								else if (statusSugMatched === 1)
								{
									outputSug += " (Order not matched)";
								}
								else
								{
									outputSug += " (Not matched)";
								}
								
								spanSpSug.innerHTML = outputSug;
								
								insertBeforeElement(spanSpSug, eleSug);
							}
						}
					}
					
					// Check diacritical marks
					{
						var hasDct = false;
						
						// Translated
						var dctTrn = countDiacriticalMark(strTrn);
						if (dctTrn > 0)
						{
							hasDct = true;
						}
						
						var countsSug = [];
						
						// Suggested
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							var strSug = trimSpace(eleSug.textContent);
						
							var dctSug = countDiacriticalMark(strSug);
							if (dctSug > 0)
							{
								hasDct = true;
							}
							
							countsSug.push(dctSug);
						}
						
						if (hasDct)
						{
							var dctTitleGood = "Combining Diacritical Marks not found. \nThis is good typing method.";
							var dctTitleBad = "Combining Diacritical Marks found. \nPlease change typing method.";
							
							var spanDctTrn = document.createElement("span");
							spanDctTrn.id = "stsh_spanDctTrn";
							spanDctTrn.classList.add("stsh_spanStatusTrn");
							spanDctTrn.classList.add("stsh_cursor_help");
							
							if (dctTrn > 0)
							{
								spanDctTrn.classList.add("stsh_red");
								spanDctTrn.classList.add("stsh_status_unmatched");
								spanDctTrn.title = dctTitleBad;
							}
							else
							{
								spanDctTrn.classList.add("stsh_green");
								spanDctTrn.title = dctTitleGood;
							}
							
							var outputDctTrn = " DiacriticalMark: " + dctTrn;
							
							spanDctTrn.innerHTML = outputDctTrn;
							eleHeaderTrn.appendChild(spanDctTrn);
							
							for (var i = 0; i < elesSug.length; i++)
							{
								var eleSug = elesSug[i];
								var dctSug = countsSug[i];
								
								var spanDctSug = document.createElement("span");
								spanDctSug.classList.add("stsh_spanDctSug");
								spanDctSug.classList.add("stsh_spanStatusSug");
								spanDctSug.classList.add("stsh_cursor_help");
								
								if (dctSug > 0)
								{
									spanDctSug.classList.add("stsh_red");
									spanDctSug.classList.add("stsh_status_unmatched");
									spanDctSug.title = dctTitleBad;
								}
								else
								{
									spanDctSug.classList.add("stsh_green");
									spanDctSug.title = dctTitleGood;
								}
							
								var outputDctSug = " DiacriticalMark: " + dctSug;
								
								spanDctSug.innerHTML = outputDctSug;
								
								insertBeforeElement(spanDctSug, eleSug);
							}
						}
					}
					
					// Check HTML elements count
					// Sample: https://translation.steampowered.com/translate.php?search_input=%23Email_Partner_KeyRequest_Doc_Instructions
					// Sample: https://translation.steampowered.com/translate.php?search_input=turret.sp_sabotage_factory_defect
					{
						var hasElement = false;
						
						var queryCount = ':not([style="color:red;"])'
							+ ':not([style="color:#ff0000;"])'
							+ ':not([style="color:#ffffff;"])'
							+ ':not([style="BACKGROUND-COLOR: blue"])'
							+ ':not([face="Times New Roman"])'
							+ ':not([data-pagespeed-no-defer])';
						
						var countEleOrg = eleTextOrg.querySelectorAll(queryCount).length;
						var countEleTrn = -1;	// -1 means Not Translated
						
						if (!eleTextTrn.classList.contains("stsh_text_trn_empty"))
						{
							countEleTrn = eleTextTrn.querySelectorAll(queryCount).length;
						}
						
						var countsSug = [];
						
						// Suggested
						var elesSug = elesTextSug;
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							var countEle = eleSug.querySelectorAll(queryCount).length;;
							if (countEle > 0)
							{
								hasElement = true;
							}
							
							countsSug.push(countEle);
						}
						
						hasElement = hasElement || countEleOrg > 0 || countEleTrn > 0;
						
						if (hasElement)
						{
							var countTitleGood = "You can check HTML elements by pressing Display HTML tags button. "
								+ "\nSome tags and attributes were generated or removed by STS "
								+ "\n(such as <script>, <br> and <img> tags). "
								+ "\nIf you can submit, then it's OK.";
							var countTitleBad = "HTML elements count not matched. \n" + countTitleGood;
							
							var spanCountOrg = document.createElement("span");
							spanCountOrg.id = "stsh_spanCountEleOrg";
							spanCountOrg.classList.add("stsh_spanStatusOrg");
							spanCountOrg.classList.add("stsh_blue");
							spanCountOrg.classList.add("stsh_cursor_help");
							spanCountOrg.title = countTitleGood;
								
							spanCountOrg.innerHTML = " HtmlElementCount: " + countEleOrg;
							eleHeaderOrg.appendChild(spanCountOrg);
						
							// Translated
							if (countEleTrn > -1)
							{
								var spanCountTrn = document.createElement("span");
								spanCountTrn.id = "stsh_spanCountEleTrn";
								spanCountTrn.classList.add("stsh_spanStatusTrn");
								spanCountTrn.classList.add("stsh_cursor_help");
								
								var outputTrn = " HtmlElementCount: " + countEleTrn;
								
								if (countEleOrg === countEleTrn)
								{
									spanCountTrn.classList.add("stsh_green");
									spanCountTrn.title = countTitleGood;
									outputTrn += (countEleOrg > 0) ? " (Matched)" : "";
								}
								else
								{
									spanCountTrn.classList.add("stsh_blue");
									spanCountTrn.classList.add("stsh_status_unmatched");
									spanCountTrn.title = countTitleBad;
									outputTrn += (countEleOrg > 0) ? " (Not matched)" : "";
								}
								
								spanCountTrn.innerHTML = outputTrn;
								eleHeaderTrn.appendChild(spanCountTrn);
							}
							
							// Suggested
							for (var i = 0; i < elesSug.length; i++)
							{
								var eleSug = elesSug[i];
								var countEleSug = countsSug[i];
								
								var spanCountSug = document.createElement("span");
								spanCountSug.classList.add("stsh_spanCountEleSug");
								spanCountSug.classList.add("stsh_spanStatusSug");
								spanCountSug.classList.add("stsh_cursor_help");
								
								var outputSug = " HtmlElementCount: " + countEleSug;
								
								if (countEleOrg === countEleSug)
								{
									spanCountSug.classList.add("stsh_green");
									spanCountSug.title = countTitleGood;
									outputSug += (countEleOrg > 0) ? " (Matched)" : "";
								}
								else
								{
									spanCountSug.classList.add("stsh_blue");
									spanCountSug.classList.add("stsh_status_unmatched");
									spanCountSug.title = countTitleBad;
									outputSug += (countEleOrg > 0) ? "/" + countEleOrg + " (Not matched)" : "";
								}
								
								spanCountSug.innerHTML = outputSug;
								
								insertBeforeElement(spanCountSug, eleSug);
							}
						}
					}
				}
			}
		}
		
		// Display newlines
		// Display spaces
		// Display specialChars
		// Display HTML tags
		// Display hidden contents
		// Minimize images
		{
			var eleSugListHeader = document.querySelector(".stsh_suggestion_list_header");
			if (eleSugListHeader && eleTextOrg && eleTextTrn)
			{
				var htmlOrg = eleTextOrg.dataset.stshHtml;
				var htmlTrn = eleTextTrn.classList.contains("stsh_text_trn_empty") ? "" : eleTextTrn.dataset.stshHtml;
				
				var elesSug = elesTextSug;
				
				var eleGroup = null;
				var elesBtn = [null, null, null, null, null, null, null, null]
				
				var enableDisplay = false;
				var enableNewline = false;
				var enableSpace = false;
				var enableSpecialChar = false;
				var enableHtmlTag = false;
				var enableHidden = false;
				var enableMinImg = false;
				
				var rgxSpaceTagOpen = /(<[^\/][^>]+>)( +)([^< \r\n])/g;
				var rgxSpaceTagClose = /([^> \r\n])( +)(<\/[^>]+>)/g;
				
				var hasNewline = function(html)
				{
					return html.indexOf("\n") > -1 || html.indexOf("\\n") > -1;
				}
				
				var hasSpace = function(html)
				{
					return html.indexOf(" ") === 0 || isLastIndex(html, " ")
						|| rgxSpaceTagOpen.test(html) || rgxSpaceTagClose.test(html);
				}
				
				var hasHtmlTag = function(html)
				{
					return html.indexOf("<") > -1 || html.indexOf("[/") > -1;
				}
				
				var hasHidden = function(eleTextOrg, eleTextTrn, elesSug)
				{
					var returnValue = false;
					
					returnValue = !!(eleTextOrg.querySelector("*[style='display: none;']") 
						|| eleTextTrn.querySelector("*[style='display: none;']"));
					
					if (!returnValue)
					{
						if (elesSug.length > 0)
						{
							returnValue = !!(elesSug[0].querySelector("*[style='display: none;']"));
						}
					}
					
					if (returnValue)
					{
						var countHidden = 0;
						var elesHidden = eleTextOrg.querySelectorAll("*[style='display: none;']");
						for (var i = 0; i < elesHidden.length; i++)
						{
							if (elesHidden[i].childElementCount > 1
								|| (elesHidden[i].firstElementChild
									&& elesHidden[i].firstElementChild.tagName !== "STYLE"))
							{
								countHidden++;
								break;
							}
						}
						returnValue = countHidden > 0;
					}
					
					if (!returnValue)
					{
						returnValue = !!(eleTextOrg.querySelector(".collapse, .dropdown-before") 
							|| eleTextTrn.querySelector(".collapse, .dropdown-before"));
					}
					
					return returnValue;
				}
				
				var hasImage = function(eleTextOrg, eleTextTrn)
				{
					return !!(eleTextOrg.querySelector("img") || eleTextTrn.querySelector("img"));
				}
				
				enableNewline = hasNewline(htmlOrg) || hasNewline(htmlTrn);
				enableSpace = hasSpace(htmlOrg) || hasSpace(htmlTrn);
				enableSpecialChar = hasSpecialChar(htmlOrg) || hasSpecialChar(htmlTrn);
				enableHtmlTag = hasHtmlTag(htmlOrg) || hasHtmlTag(htmlTrn);
				enableHidden = hasHidden(eleTextOrg, eleTextTrn, elesSug);
				enableMinImg = hasImage(eleTextOrg, eleTextTrn);
				
				for (var i = 0; i < elesSug.length; i++)
				{
					var htmlSug = elesSug[i].dataset.stshHtml;
					
					enableNewline = enableNewline || hasNewline(htmlSug);
					enableSpace = enableSpace || hasSpace(htmlSug);
					enableSpecialChar = enableSpecialChar || hasSpecialChar(htmlSug);
				}
				
				enableDisplay = enableNewline || enableSpace || enableSpecialChar 
					|| enableHtmlTag || enableHidden || enableMinImg;
					
				if (enableDisplay)
				{
					elesBtn[0] = document.createElement("input");
					elesBtn[0].id = "stsh_btn_restoreContents";
					elesBtn[0].classList.add("stsh_btn_right");
					elesBtn[0].classList.add("stsh_margin_left");
					elesBtn[0].setAttribute("type", "button");
					elesBtn[0].setAttribute("value", "Restore contents");
					elesBtn[0].setAttribute("title", "Restore original contents");
					elesBtn[0].disabled = true;
					
					eleSugListHeader.appendChild(elesBtn[0]);
					
					var restoreContents = function(ele)
					{
						if (ele)
						{
							ele.innerHTML = ele.dataset.stshHtml;
						}
					};
					
					elesBtn[0].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.disabled = true;
						
						for (var i = 1; i < elesBtn.length; i++)
						{
							if (elesBtn[i])
							{
								elesBtn[i].disabled = false;
								elesBtn[i].focus();
							}
						}
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						restoreContents(eleTextOrg);
						restoreContents(eleTextTrn);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							restoreContents(eleSug);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
					
					eleGroup = document.createElement("div");
					eleGroup.classList.add("stsh_group_display");
					eleGroup.classList.add("stsh_btn_right");
					
					eleSugListHeader.appendChild(eleGroup);
					
				}
				
				// Display newlines
				if (enableNewline)
				{
					elesBtn[1] = document.createElement("input");
					elesBtn[1].id = "stsh_btn_displayNewlines";
					elesBtn[1].classList.add("stsh_btn_right");
					elesBtn[1].classList.add("stsh_btn_display");
					elesBtn[1].setAttribute("type", "button");
					elesBtn[1].setAttribute("value", "Newlines");
					elesBtn[1].setAttribute("title", "Display newlines (\\n and <br>)");
					
					eleGroup.appendChild(elesBtn[1]);
					
					var displayNewlines = function(ele)
					{
						if (ele)
						{
							ele.innerHTML = ele.dataset.stshHtml
								.replace(/\<span[^\>]+class=\"stsh_[\s\S]+?\/span\>/ig, "")
								.replace(/\n/g, "\n<br>")
								.replace(/(\\r)? *\\n/g, ' <span class="stsh_marker">$&</span><br>')
								.replace(/\<br\>[\s]+/g, "<br>&nbsp;");
						}
					};
			
					elesBtn[1].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.disabled = true;
						
						for (var i = 0; i < elesBtn.length; i++)
						{
							if (elesBtn[i] && elesBtn[i] !== eleTarget)
							{
								elesBtn[i].disabled = false;
							}
						}
						
						elesBtn[0].focus();
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						displayNewlines(eleTextOrg);
						displayNewlines(eleTextTrn);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							displayNewlines(eleSug);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
				
				// Display spaces
				// Sample: Use regexp ^[ ]+[^/W]|[^/W][ ]+$ to search
				// Sample: https://translation.steampowered.com/translate.php?search_input=portal_lyrics_17
				// Sample: https://translation.steampowered.com/translate.php?search_input=portal_lyrics_23
				if (enableSpace)
				{
					elesBtn[2] = document.createElement("input");
					elesBtn[2].id = "stsh_btn_displaySpaces";
					elesBtn[2].classList.add("stsh_btn_right");
					elesBtn[2].classList.add("stsh_btn_display");
					elesBtn[2].setAttribute("type", "button");
					elesBtn[2].setAttribute("value", "Spaces");
					elesBtn[2].setAttribute("title", "Strings may have leading or trailing spaces.");
					
					eleGroup.appendChild(elesBtn[2]);
					
					var displaySpaces = function(ele)
					{
						if (ele)
						{
							ele.innerHTML = ele.dataset.stshHtml
								.replace(/(^ +| +$)/g, function(match, p1) 
								{
									return '<span class="stsh_marker">' + p1.replace(/ /g,"_") + '</span>';
								})
								.replace(rgxSpaceTagOpen, function(match, p1, p2, p3)
								{
									return p1 + '<span class="stsh_marker">' + p2.replace(/ /g,"_") + '</span>' + p3;
								})
								.replace(rgxSpaceTagClose, function(match, p1, p2, p3)
								{
									return p1 + '<span class="stsh_marker">' + p2.replace(/ /g,"_") + '</span>' + p3;
								});
						}
					}
			
					elesBtn[2].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.disabled = true;
						
						for (var i = 0; i < elesBtn.length; i++)
						{
							if (elesBtn[i] && elesBtn[i] !== eleTarget)
							{
								elesBtn[i].disabled = false;
							}
						}
						
						elesBtn[0].focus();
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						displaySpaces(eleTextOrg);
						displaySpaces(eleTextTrn);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							displaySpaces(eleSug);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
				
				// Display specialChars
				// Sample: https://translation.steampowered.com/translate.php?search_input=Item_Traded
				if (enableSpecialChar)
				{
					elesBtn[3] = document.createElement("input");
					elesBtn[3].id = "stsh_btn_displaySpecialChars";
					elesBtn[3].classList.add("stsh_btn_right");
					elesBtn[3].classList.add("stsh_btn_display");
					elesBtn[3].setAttribute("type", "button");
					elesBtn[3].setAttribute("value", "Special chars");
					elesBtn[3].setAttribute("title", "Special chars usually use in Valve games as color symbols.");
					
					eleGroup.appendChild(elesBtn[3]);
					
					var replaceSpecialChars = function(str, unicodeNumber)
					{
						var rgx = new RegExp("\\u" + padZeroHex(unicodeNumber, 4), "g");
						return str.replace(rgx, '<span class="stsh_marker">[' + padZeroHex(unicodeNumber, 2) + ']</span>');
					}
					
					var displaySpecialChars = function(ele)
					{
						if (ele)
						{
							var strInner = (typeof ele.dataset.stshHtml === "undefined") 
								? trimTab(ele.innerHTML) : ele.dataset.stshHtml;
							
							for (var i = 0; i < 32; i++)
							{
								if (hasSpecialChar(strInner))
								{
									if (isSpecialChar(i))
									{
										strInner = replaceSpecialChars(strInner, i);
									}
								}
								else
								{
									break;
								}
							}
							
							ele.innerHTML = strInner;
						}
					}
			
					elesBtn[3].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.disabled = true;
						
						for (var i = 0; i < elesBtn.length; i++)
						{
							if (elesBtn[i] && elesBtn[i] !== eleTarget)
							{
								elesBtn[i].disabled = false;
							}
						}
						
						elesBtn[0].focus();
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						displaySpecialChars(eleTextOrg);
						displaySpecialChars(eleTextTrn);
							
						var elesSug = document.querySelectorAll(
							".suggestion_text, .stsh_sametoken_header .insertword, .stsh_text_comment");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							displaySpecialChars(eleSug);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
			
				// Display HTML tags
				if (enableHtmlTag)
				{
					elesBtn[4] = document.createElement("input");
					elesBtn[4].id = "stsh_btn_displayHtmlTags";
					elesBtn[4].classList.add("stsh_btn_right");
					elesBtn[4].classList.add("stsh_btn_display");
					elesBtn[4].setAttribute("type", "button");
					elesBtn[4].setAttribute("value", "HTML tags");
					elesBtn[4].setAttribute("title"
						, "Some closing tags and attributes were autogenerated by web browser.");
					
					eleGroup.appendChild(elesBtn[4]);
			
					elesBtn[4].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						eleTarget.disabled = true;
						
						for (var i = 0; i < elesBtn.length; i++)
						{
							if (elesBtn[i] && elesBtn[i] !== eleTarget)
							{
								elesBtn[i].disabled = false;
							}
						}
						
						elesBtn[0].focus();
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						displayHtmlTags(eleTextOrg);
						displayHtmlTags(eleTextTrn);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							displayHtmlTags(eleSug);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
				
				// Display hidden contents
				// Sample: https://translation.steampowered.com/translate.php?search_input=faq_4181_answer
				if (enableHidden)
				{
					elesBtn[5] = document.createElement("input");
					elesBtn[5].id = "stsh_btn_displayHidden";
					elesBtn[5].classList.add("stsh_btn_right");
					elesBtn[5].classList.add("stsh_btn_display");
					elesBtn[5].setAttribute("type", "button");
					elesBtn[5].setAttribute("value", "Hidden contents");
					elesBtn[5].setAttribute("title", "Toggle show/hide contents that hidden by CSS."
						+ " \nHidden contents shown in gray boxes.");
					elesBtn[5].dataset.modeNext = "show";
					
					eleGroup.appendChild(elesBtn[5]);
					
					var showHidden = function(ele, mode)
					{
						if (ele)
						{
							if (mode === "show")
							{
								var elesHidden = ele.querySelectorAll(
									"*[style='display: none;'], .collapse, .dropdown-before");
								for (var i = 0; i < elesHidden.length; i++)
								{
									elesHidden[i].classList.add("stsh_showHidden");
								}
							}
							else
							{
								var elesHidden = ele.querySelectorAll(".stsh_showHidden");
								for (var i = 0; i < elesHidden.length; i++)
								{
									elesHidden[i].classList.remove("stsh_showHidden");
								}
							}
						}
					}
			
					elesBtn[5].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						
						var mode = "show";
						if (eleTarget.dataset.modeNext === "show")
						{
							mode = "show";
							eleTarget.dataset.modeNext = "hide";
						}
						else
						{
							mode = "hide";
							eleTarget.dataset.modeNext = "show";
						}
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						showHidden(eleTextOrg, mode);
						showHidden(eleTextTrn, mode);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							showHidden(eleSug, mode);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
				
				// Minimize images
				// Sample: https://translation.steampowered.com/translate.php?search_input=faq_4192_answer
				if (enableMinImg)
				{
					elesBtn[6] = document.createElement("input");
					elesBtn[6].id = "stsh_btn_minimizeImages";
					elesBtn[6].classList.add("stsh_btn_right");
					elesBtn[6].classList.add("stsh_btn_display");
					elesBtn[6].setAttribute("type", "button");
					elesBtn[6].setAttribute("value", "Minimize images");
					elesBtn[6].setAttribute("title", "Toggle reduced/normal image sizes");
					elesBtn[6].dataset.modeNext = "min";
					
					eleGroup.appendChild(elesBtn[6]);
					
					var minimizeImages = function(ele, mode)
					{
						if (ele)
						{
							if (mode === "min")
							{
								var elesImg = ele.querySelectorAll("img:not(.stsh_img_min)");
								for (var i = 0; i < elesImg.length; i++)
								{
									elesImg[i].classList.add("stsh_img_min");
								}
							}
							else
							{
								var elesImg = ele.querySelectorAll("img.stsh_img_min");
								for (var i = 0; i < elesImg.length; i++)
								{
									elesImg[i].classList.remove("stsh_img_min");
								}
							}
						}
					}
			
					elesBtn[6].addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						
						var mode = "min";
						if (eleTarget.dataset.modeNext === "min")
						{
							mode = "min";
							eleTarget.dataset.modeNext = "unmin";
						}
						else
						{
							mode = "unmin";
							eleTarget.dataset.modeNext = "min";
						}
						
						var topOld = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						
						var eleTextOrg = document.querySelector(".stsh_text_org");
						var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
						minimizeImages(eleTextOrg, mode);
						minimizeImages(eleTextTrn, mode);
							
						var elesSug = document.querySelectorAll(".suggestion_text");
						for (var i = 0; i < elesSug.length; i++)
						{
							var eleSug = elesSug[i];
							minimizeImages(eleSug, mode);
						}
						
						var topNew = Math.floor(eleTarget.getBoundingClientRect().top) || 0;
						if (topOld !== topNew)
						{
							window.scrollBy(0, topNew - topOld);
						}
					});
				}
				
				if (enableDisplay)
				{					
					var eleDiv = document.createElement("div");
					eleDiv.classList.add("stsh_text_right");
					eleDiv.classList.add("stsh_margin_right");
					eleDiv.textContent = "Display:";
					
					eleSugListHeader.appendChild(eleDiv);
				}
			}
		}
		
		// Open comment when decline
		// Paste last comment
		{
			var countComment = 0;
			var elesComment = [];
			
			var countSug = document.querySelectorAll(".suggestions_list .suggestion").length;
			if (countSug > 0)
			{
				var textOrg = "";
				if (eleTextOrg)
				{
					textOrg = eleTextOrg.dataset.stshHtml.substr(0, 3000).toLowerCase();
				}
				
				var isSameTextOrg = textOrg === GM_getValue("textLastOrg_Comment", "");
				var textLastCur = GM_getValue("textLastCur_Comment", "");
				var isSetComment = false;
					
				var countSugDeclined = document.querySelectorAll(
					".suggestions_list span[class='suggestion_status_declined']").length;
				
				if (countSug !== countSugDeclined)
				{
					var elesSugCheck = document.querySelectorAll(".suggestions_list span[class^='suggestion_status_']");
					if (countSug === elesSugCheck.length)
					{
						var eleSugDeclined = document.querySelector(".suggestions_list span[class='suggestion_status_declined']");
						if (eleSugDeclined && eleSugDeclined === elesSugCheck[0] && eleSugDeclined.querySelector("a"))
						{
							countSugDeclined = countSug;
						}
					}
				}
				
				if (countSug === countSugDeclined)
				{
					var elesSugA = document.querySelectorAll(".suggestions_list span[class^='suggestion_status_'] a");
					for (var i = 0; i < elesSugA.length; i++)
					{
						var eleComment = elesSugA[i].parentElement.parentElement.nextSibling;
						if (eleComment.nodeName === "DIV" && eleComment.classList.contains("copy"))
						{
							if (elesSugA[i].parentElement.classList.contains("suggestion_status_declined"))
							{
								countComment++;
								elesComment.push(eleComment);
							}
						}
					}
					
					if (countComment === elesSugA.length)
					{
						var isFocus = false;
						for (var i = 0; i < elesComment.length; i++)
						{
							elesComment[i].style.display = "block";
							if (!isFocus)
							{
								var eleTxt = elesComment[i].querySelector(".stsh_text_addComment");
								if (eleTxt)
								{
									eleTxt.focus();
									
									// Auto paste last comment
									{
										if (isSameTextOrg)
										{
											if (textLastCur !== "")
											{
												eleTxt.value = textLastCur;
												isSetComment = true;
											}
											
											setTimeoutCustom(function(ele)
											{
												// paste again after script ran
												if (ele)
												{
													var textLastCur = GM_getValue("textLastCur_Comment", "");
													if (textLastCur !== "")
													{
														ele.value = textLastCur;
														
														//ele.selectionStart = 0;
														//ele.selectionEnd = ele.value.length;
													}
												}
											}, timingInit.pasteLastComment, eleTxt);
										}
									}
									
									/*
									// Typonion
									var eleSugOuter = elesComment[i].parentElement.parentElement.parentElement.parentElement;
									if (eleSugOuter.classList.contains("suggestion"))
									{
										var eleOnion = eleSugOuter.querySelector(".suggestion_text font[style='color:#01ec00;']");
										if (eleOnion)
										{
											eleTxt.value = "onion";
										}
									}
									*/
				
									var eleSugComment = elesComment[i].parentElement
										.parentElement.parentElement.querySelector(".stsh_text_comment font");
									if (eleSugComment && eleSugComment.textContent.trim() ==
										"ATTENTION - English string was updated. This suggestion might be outdated.")
									{
										eleTxt.value = "outdated";
										isSetComment = true;
									}
									
									isFocus = true;
								}
							}
						}
					}
				}
				
				if (isSameTextOrg && !isSetComment && textLastCur !== "")
				{
					// paste last comment to all hidden comment inputs
					var elesTxt = document.querySelectorAll(".stsh_text_addComment");
					for (var i = 0; i < elesTxt.length; i++)
					{
						elesTxt[i].value = textLastCur;
						isSetComment = true;
					}
				}
			}
		}
		
		// Convert time
		{
			var rgxTime = /\d{2}-\d{2}-\d{4}, \d{2}:\d{2} [AP]M/;
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			
			var eleFriends = document.querySelectorAll(".friend_block_avatar, .stsh_discussion, .suggestions_list");
			for (var i = 0; i < eleFriends.length; i++)
			{
				var nodes = [];
				
				if (eleFriends[i].classList.contains("friend_block_avatar"))
				{
					nodes = eleFriends[i].childNodes;
					if (nodes.length === 1)
					{
						// Correct HTML tags that auto generated
						nodes = eleFriends[i].childNodes[0].childNodes;
					}
				}
				else if (eleFriends[i].classList.contains("stsh_discussion"))
				{
					nodes = eleFriends[i].childNodes[2].childNodes;
				}
				else if (eleFriends[i].classList.contains("suggestions_list"))
				{
					if (!eleFriends[i].querySelector(".suggestion"))
					{
						nodes = eleFriends[i].childNodes;
					}
				}
				
				for (var j = 0; j < nodes.length; j++)
				{
					var nodeVal = nodes[j].nodeValue;
					if (nodeVal)
					{
						var dateTimes = rgxTime.exec(nodeVal);
						if (dateTimes)
						{
							var dateTime = dateTimes[0];
							var month = dateTime.substr(0, 2);
							var day = dateTime.substr(3, 2);
							var year = dateTime.substr(6, 4);
							var hour = dateTime.substr(12, 2);
							var minute = dateTime.substr(15, 2);
							var period = dateTime.substr(18, 2);
							if (period === "AM")
							{
								if (hour === "12")
								{
									hour = "00"
								}
							}
							else if (period === "PM")
							{
								hour = parseInt(hour) + 12;
								if (hour === 24)
								{
									hour = 12;
								}
							}
							
							var dateTimeStd = year + "-" + month + "-" + day;
									
							if (isDstUs(year, month, day, hour))
							{
								dateTimeStd += "T" + hour + ":" + minute + ":00-0700";
							}
							else
							{
								dateTimeStd += "T" + hour + ":" + minute + ":00-0800";
							}
							
							var dateStd = new Date(dateTimeStd);
							if (dateStd.toLocaleString() !== "Invalid Date")
							{
								var gmt = dateStd.getTimezoneOffset() / 60 * -1;
								var gmtStr = " GMT";
								if (gmt > 0)
								{
									gmtStr += "+" + gmt;
								}
								else if (gmt < 0)
								{
									gmtStr += "-" + gmt;
								}
								var dateNew = dateStd.getDate()
									+ " " + months[dateStd.getMonth()]
									+ " " + dateStd.getFullYear()
									+ ", " + padZero(dateStd.getHours(), 2)
									+ ":" + padZero(dateStd.getMinutes(), 2)
									+ gmtStr;
								
								//console.log("Time: " + dateTimeStd);
								//console.log("Time: " + dateTime + " -> " + dateNew);
									
								//var dateNew2 = dateStd.toLocaleString() + gmtStr;
								//console.log("Time: " + dateTime + " -> " + dateNew2);
								
								var nodeValBegin = nodeVal.substr(0, nodeVal.indexOf(dateTime));
								var nodeValEnd = nodeVal.substr(nodeVal.indexOf(dateTime) + dateTime.length);
								
								nodes[j].nodeValue = nodeValBegin;
								
								var ele = document.createElement("span");
								ele.classList.add("stsh_time_convert");
								ele.classList.add("stsh_cursor_help");
								ele.setAttribute("title", dateTime);
								ele.textContent = dateNew;
								insertAfterElement(ele, nodes[j]);
								
								if (nodeValEnd !== "")
								{
									insertAfterElement(document.createTextNode(nodeValEnd), ele);
								}
							}
							else
							{
								console.log("Invalid Date: " + dateTimeStd);
							}
						}
					}
				}
			}
		}
		
		// Fix STS PM functions
		{
			var elesSpan = document.querySelectorAll(".friend_block_avatar > span[onclick^='totranslator']");
			for (var i = 0; i < elesSpan.length; i++)
			{
				var eleUser = elesSpan[i].parentElement.firstElementChild;
				if (eleUser.tagName === "A")
				{
					var execUser = /user=([0-9]+)/i.exec(eleUser.getAttribute("href"));
					if (execUser && execUser.length === 2)
					{
						var attrClick = elesSpan[i].getAttribute("onclick");
						var execTranslator = /totranslator\('([0-9]+)'\)/i.exec(attrClick);
						if (execTranslator && execTranslator.length === 2)
						{
							if (execUser[1] !== execTranslator[1])
							{
								elesSpan[i].setAttribute("onclick", "totranslator('" + execUser[1] + "')");
							}
						}
					}
				}
			}
		}
		
		// Add Steam profile links
		{
			var elesSpan = document.querySelectorAll("span[title='Send this user a private message']");
			for (var i = 0; i < elesSpan.length; i++)
			{
				var attrClick = elesSpan[i].getAttribute("onclick");
				var execTranslator = /totranslator\('([0-9]+)'\)/i.exec(attrClick);
				if (execTranslator && execTranslator.length === 2)
				{
					var ele = document.createElement("a");
					ele.classList.add("stsh_steamProfile");
					ele.setAttribute("target", "_blank");
					ele.setAttribute("title", "View Steam profile");
					ele.setAttribute("href", "https://steamcommunity.com/profiles/" + execTranslator[1]);
					
					var name = "Steam";
					
					var eleParent = elesSpan[i].parentElement;
					if (eleParent.classList.contains("friend_block_avatar"))
					{
						var eleImg = eleParent.querySelector("a[href^='user_activity.php'] > img");
						if (eleImg && eleImg.title && eleImg.title.trim())
						{
							name = eleImg.title.trim();
						}
					}
					else if (eleParent.tagName === "TD")
					{
						var eleImg = eleParent.parentElement.querySelector(
							"td > .friend_block_discussions > a[href^='user_activity.php'] > img");
						if (eleImg && eleImg.title && eleImg.title.trim())
						{
							name = eleImg.title.trim();
						}
					}
					
					ele.textContent = " " + name + " ";
					
					var eleNext = elesSpan[i].nextSibling;
					if (eleNext && eleNext.textContent.trim() === "")
					{
						eleNext.textContent = " | ";
					}
					
					insertAfterElement(ele, elesSpan[i]);
				}
			}
		}
		
		// Add auto approve
		{
			if (elesInputApprove.length > 0 && document.querySelector(".stsh_action_approve_next"))
			{
				var eleInput = document.createElement("input");
				eleInput.id = "stsh_autoApprove";
				eleInput.setAttribute("type", "checkbox");
				eleInput.setAttribute("value", "auto");
				
				var eleLabel = document.createElement("label");
				eleLabel.classList.add("stsh_autoApprove_label");
				eleLabel.classList.add("stsh_unselectable");
				eleLabel.setAttribute("for", "stsh_autoApprove");
				eleLabel.setAttribute("title", "Please use with care!");
				eleLabel.textContent = " Auto Approve Next ";
				
				elesInputApprove[0].parentElement.appendChild(eleInput);
				elesInputApprove[0].parentElement.appendChild(eleLabel);
				
				var autoApprove = function()
				{
					console.log("AutoApprove: Next in " + timingInit.autoApprove + "ms");
					setTimeoutCustom(function ()
					{
						var eleCheck = document.querySelector("#stsh_autoApprove");
						if (eleCheck && eleCheck.checked)
						{
							var isClicked = false;
							
							var ele = document.querySelector(".stsh_action_approve_next");
							
							if (ele && !ele.disabled && isVisible())
							{
								var isSkip = false;
								var eleSugComment = ele.parentElement
									.parentElement.parentElement.querySelector(".stsh_text_comment font");
								if (eleSugComment && eleSugComment.textContent.trim() ==
									"ATTENTION - English string was updated. This suggestion might be outdated.")
								{
									isSkip = true;
								}
								
								if (!isSkip)
								{
									var eleStatusUnmatched = document.querySelector(".stsh_spanSpSug.stsh_status_unmatched");
									if (eleStatusUnmatched)
									{
										isSkip = true;
									}
								}
								
								if (!isSkip)
								{
									isClicked = true;
									GM_setValue("timeAutoApproveLast", getUnixTimestamp());
									ele.click();
								}
							}
							
							if (!isClicked)
							{
								eleCheck.checked = false;
								GM_setValue("isAutoApprove", "false");
							}
						}
					}, timingInit.autoApprove);
				}
				
				var tmDiff = getUnixTimestamp() - GM_getValue("timeAutoApproveLast", 0);
				if (tmDiff > 120)
				{
					// > 120s
					eleInput.checked = false;
					GM_setValue("isAutoApprove", "false");
				}
				
				if (window !== window.parent)
				{
					var eleOuter = window.parent.document.querySelector("#suggestions_box_outer");
					if (eleOuter)
					{
						if (eleOuter.style.display === "none")
						{
							// Closed iFrame
							eleInput.checked = false;
							GM_setValue("isAutoApprove", "false");
						}
					}
				}
						
				if (GM_getValue("isAutoApprove", 0) === "true")
				{
					eleInput.checked = true;
					autoApprove();
						
					var uncheckAutoApprove = function (ev)
					{
						var eleTarget = ev.target;
						if (eleTarget.id !== "stsh_autoApprove"
							&& !eleTarget.classList.contains("stsh_autoApprove_label")
							&& !eleTarget.classList.contains("stsh_action_approve_next"))
						{
							// Skip auto click
							
							var eleAuto = document.querySelector("#stsh_autoApprove");
							if (eleAuto)
							{
								console.log("AutoApprove: Stop");
								eleAuto.checked = false;
								GM_setValue("isAutoApprove", "false");
								document.removeEventListener("click", uncheckAutoApprove);
							}
						}
					};
					
					// Stop with any clicked
					document.addEventListener("click", uncheckAutoApprove);
				}

				eleInput.addEventListener("click", function (e)
				{
					var ele = e.target;
					if (ele.checked)
					{
						GM_setValue("isAutoApprove", "true");
						autoApprove();
					}
					else
					{
						GM_setValue("isAutoApprove", "false");
					}
				});
			}
		}
		
		// Warn when remove
		// Suggest to remove
		// Add remove & next
		{
			var canNext = !!(document.querySelector(".stsh_nav_next:not(:disabled)"));
			
			var elesRemove = document.querySelectorAll(".stsh_action_remove");
			for (var i = 0; i < elesRemove.length; i++)
			{
				var isDisabled = false;
				
				var oldClick = elesRemove[i].getAttribute("onclick");
				if (oldClick && oldClick.indexOf("location.href") === 0)
				{
					var eleSug = elesRemove[i].parentElement.parentElement.parentElement.parentElement;
					if (eleSug.classList.contains("suggestion"))
					{
						/*
						// Typonion
						var eleOnion = eleSug.querySelector(".suggestion_text font[style='color:#01ec00;']");
						if (eleOnion)
						{
							var newClick = "if (!confirm(\"Warning: You will delete your onion. Press Cancel to go back.\")) return false; "
								+ oldClick;
							elesRemove[i].setAttribute("onclick", newClick);
							elesRemove[i].setAttribute("title", "Do not remove your onion!");
							elesRemove[i].classList.add("stsh_grey");
							elesRemove[i].classList.add("stsh_cursor_notallowed");
						}
						else
						*/
						{
							var eleModComment = elesRemove[i].parentElement.querySelector(".stsh_text_comment_header");
							if (eleModComment)
							{
								// Mod commented, suggest to do not remove
								var newClick = "if (!confirm(\"Warning: You should not remove this suggestion."
									+ " Press OK if you really want.\")) return false; "
									+ oldClick;
								elesRemove[i].setAttribute("onclick", newClick);
								elesRemove[i].setAttribute("title", 
									"Your suggestion has a mod's comment! \nShould not remove this suggestion.");
								elesRemove[i].classList.add("stsh_grey");
								elesRemove[i].classList.add("stsh_cursor_notallowed");
								
								isDisabled = true;
							}
							else
							{
								var eleUserComment = elesRemove[i].parentElement.parentElement.parentElement
									.querySelector(".stsh_text_comment_header");
								if (eleUserComment)
								{
									// User commented
									var comment = eleUserComment.textContent.trim();
									if (comment.indexOf("ATTENTION - English string was updated.") > -1)
									{
										// Outdated, suggest to edit and remove
										elesRemove[i].setAttribute("title", 
											"Please edit and remove this outdated suggestion.");
										elesRemove[i].classList.add("stsh_green");
										elesRemove[i].classList.add("stsh_border_green");
										
										isDisabled = true;
									}
								}
							}
							
							if (!isDisabled)
							{
								var eleDeclined = elesRemove[i].parentElement.querySelector(".suggestion_status_declined");
								if (eleDeclined)
								{
									// Declined without comment, suggest to remove
									elesRemove[i].setAttribute("title", 
										"Please remove this suggestion to save admin time.");
									elesRemove[i].classList.add("stsh_green");
									elesRemove[i].classList.add("stsh_border_green");
								}
							}
						}
					}
				}
				
				// Add remove & next
				{
					elesRemove[i].classList.add("stsh_border_left");

					var eleNext = elesRemove[i].nextElementSibling;
					if (!eleNext || eleNext.value !== "Next")
					{
						eleNext = document.createElement("input");
						insertAfterElement(eleNext, elesRemove[i]);
					}
					eleNext.value = "Next";
					eleNext.classList.add("stsh_action_remove_next");
					eleNext.classList.add("stsh_border_right");
					eleNext.setAttribute("type", "button");
					
					if (canNext && !isDisabled)
					{
						eleNext.title = "Remove & Next";
						eleNext.classList.add("stsh_yellow_light");
						if (!eleNext.getAttribute("onclick"))
						{
							var onclick = elesRemove[i].getAttribute("onclick")
							.replace("';", "&ynext=true';");
							eleNext.setAttribute("onclick", onclick);
						}
					}
					else
					{
						eleNext.disabled = true;
					}
				}
			}
		}
		
		// Suggest to decline outdated
		{
			if (document.querySelector(".stsh_action_approve"))
			{
				var elesAttention = document.querySelectorAll(".stsh_text_comment > font > i > b");
				for (var i = 0; i < elesAttention.length; i++)
				{
					if (elesAttention[i].textContent.trim()
						=== "ATTENTION - English string was updated. This suggestion might be outdated.")
					{
						var eleAction = elesAttention[i]
							.parentElement.parentElement
							.parentElement.parentElement
							.nextElementSibling;
						
						var eleApprove = eleAction.querySelector(".stsh_action_approve");
						var eleApproveNext = null;
						var eleDecline = null;
						
						if (eleApprove)
						{
							eleApproveNext = eleApprove.nextElementSibling;
							
							var oldClick = eleApprove.getAttribute("onclick");
							if (oldClick && oldClick.indexOf("location.href") === 0)
							{
								var newClick = "if (!confirm(\"Warning: Please decline outdated suggestion."
									+ " Press OK if you really want to approve.\")) return false; "
									+ oldClick;
								eleApprove.setAttribute("onclick", newClick);
								eleApprove.setAttribute("title", "Please decline outdated suggestion.");
								eleApprove.classList.add("stsh_grey");
								eleApprove.classList.add("stsh_cursor_notallowed");
							}
						}
						
						if (eleApproveNext)
						{
							eleDecline = eleApproveNext.nextElementSibling;
							
							if (!eleApproveNext.disabled)
							{
								var oldClick = eleApproveNext.getAttribute("onclick");
								if (oldClick && oldClick.indexOf("location.href") === 0)
								{
									var newClick = "if (!confirm(\"Warning: Please decline outdated suggestion."
										+ " Press OK if you really want to approve.\")) return false; "
										+ oldClick;
									eleApproveNext.setAttribute("onclick", newClick);
									eleApproveNext.setAttribute("title", "Please decline outdated suggestion.");
									eleApproveNext.classList.add("stsh_grey");
									eleApproveNext.classList.add("stsh_cursor_notallowed");
								}
							}
						}
						
						if (eleDecline)
						{
							eleDecline.setAttribute("title", "Please decline outdated suggestion.");
							eleDecline.classList.add("stsh_green");
							eleDecline.classList.add("stsh_border_green_left");
						}
					}
				}
			}
		}
		
		// Clean language markers that link to Steam
		{
			var rgxLang = /[\?&]l=[a-z]+$/i;
			
			var elesDiscussText = document.querySelectorAll(".stsh_discussion_text");
			for (var i = 0; i < elesDiscussText.length; i++)
			{
				var elesA = elesDiscussText[i].querySelectorAll("a[href*='steam']");
				for (var j = 0; j < elesA.length; j++)
				{
					var href = elesA[j].getAttribute("href");
					if (rgxLang.test(href))
					{
						elesA[j].setAttribute("href", href.replace(rgxLang, ""));
					}
				}
			}
		}
		
		// Auto paste last suggestion
		{
			if (!/edit/i.test(getQueryByName("action")))
			{
				if (eleTextOrg)
				{
					var textOrg = eleTextOrg.dataset.stshHtml.toLowerCase();
					var textLastCur = "";
					
					if (textOrg === GM_getValue("textLastOrg", ""))
					{
						textLastCur = GM_getValue("textLastCur", "");
					}
					else if (textOrg === GM_getValue("textLastOrg_Comment", ""))
					{
						//textLastCur = GM_getValue("textLastCur_Comment", "");
					}
					
					var eleTextCur = document.querySelector("#suggestion_value_new");
					if (eleTextCur)
					{
						if (textLastCur !== "")
						{
							eleTextCur.value = textLastCur;
						}
					}
					
					if (textLastCur !== "")
					{
						setTimeoutCustom(function(textLastCur)
						{
							var eleTextCur = document.querySelector("#suggestion_value_new");
							if (eleTextCur)
							{
									eleTextCur.value = textLastCur;
							}
						}, timingInit.pasteLastSuggestion, textLastCur);
					}
				}
			}
			
			var elesTextSubmit = document.querySelectorAll(".stsh_text_submit, #stsh_text_submit_next");
			for (var i = 0; i < elesTextSubmit.length; i++)
			{
				elesTextSubmit[i].addEventListener("click", function()
				{
					var eleTextOrg = document.querySelector(".stsh_text_org");
					if (eleTextOrg)
					{
						var textOrg = eleTextOrg.dataset.stshHtml;
						if (textOrg.length < 3000)
						{
							var eleTextCur = document.querySelector("#suggestion_value_new");
							if (eleTextCur)
							{
								var textCur = eleTextCur.value;
								
								GM_setValue("textLastOrg", textOrg.toLowerCase());
								GM_setValue("textLastCur", textCur);
								
								//console.log("Store suggestion: " + textOrg.length);
							}
						}
					}
				});
			}
		}
		
		// Auto store last comment
		{
			//console.log("textLastOrg_Comment: " + GM_getValue("textLastOrg_Comment", ""));
			//console.log("textLastCur_Comment: " + GM_getValue("textLastCur_Comment", ""));
			
			var storeLastComment = function(eleTextComment, isRemoved)
			{
				if (eleTextComment)
				{
					var eleTextOrg = document.querySelector(".stsh_text_org");
					if (eleTextOrg)
					{
						var textOrg = eleTextOrg.dataset.stshHtml.substr(0, 3000).toLowerCase();
						
						if (isRemoved)
						{
							if (textOrg === GM_getValue("textLastOrg_Comment", ""))
							{
								// When remove comment, don't store if original text is the same
								return;
							}
						}
					
						var textCur = trimSpace(eleTextComment.value || eleTextComment.textContent);
						if (textCur !== "outdated")
						{
							GM_setValue("textLastOrg_Comment", textOrg);
							GM_setValue("textLastCur_Comment", textCur);
						}
					}
				}
			}
			
			for (var i = 0; i < elesTextRemoveComment.length; i++)
			{
				elesTextRemoveComment[i].addEventListener("click", function(ev)
				{
					var target = null;
					if (ev.target.tagName === "FONT")
					{
						target = ev.target.parentElement;
					}
					else
					{
						target = ev.target;
					}
					
					var eleTextComment = target
						.parentElement.parentElement.parentElement.parentElement
						.querySelector(".stsh_text_comment");
					
					storeLastComment(eleTextComment, true);
				});
			}
			
			var elesSubmitComment = document.querySelectorAll(".stsh_submit_comment");
			for (var i = 0; i < elesSubmitComment.length; i++)
			{
				elesSubmitComment[i].addEventListener("click", function(ev)
				{
					var eleTextComment = ev.target.previousElementSibling;
					if (eleTextComment.tagName !== "TEXTAREA")
					{
						eleTextComment = eleTextComment.previousElementSibling;
					}
						
					storeLastComment(eleTextComment, false);
				});
			}
		}
		
		// Mark showing
		{
			var eleStatus = window.parent.document.querySelector("#stsh_showing_random");
			if (eleStatus)
			{
				eleStatus.dataset.random = getTimeMs();
			}
		}
		
		// Delta
		{
			var eleFile = document.querySelector(".stsh_info_file");
			if (eleFile)
			{
				if (eleFile.textContent.trim() === "STEAM/DELTA")
				{
					document.body && document.body.classList.add("stsh_delta");
				}
			}
		}
				
		// Hide cursor when typing
		// Expand textarea when typing
		{
			var tmTextChange = 0;
			
			var autoHideCursor = function(ele)
			{
				if (ele)
				{
					ele.addEventListener("input", function(ev)
					{
						var ele = ev.target;
						ele.style.setProperty("cursor", "none", "important");
						
						clearTimeout(tmTextChange);
						tmTextChange = setTimeoutCustom(function(ele)
						{
							ele.style.setProperty("cursor", "auto", "important");
						}, timingInit.hideCursor, ele);
					});
					
					ele.addEventListener("mousemove", function(ev)
					{
						var ele = ev.target;
						clearTimeout(tmTextChange);
						ele.style.setProperty("cursor", "auto", "important");
					});
				}
			}
			
			var autoExpandEvent = function(ev)
			{
				var ele = ev.target;
				var maxHeight = ele.param_MaxHeight;
				var styleHeight = parseInt(ele.style.height) 
					|| parseInt(window.getComputedStyle(ele).height) 
					|| maxHeight;
				
				var heightDiff = ele.scrollHeight - styleHeight;
				
				//console.log("ele.scrollHeight:"+ele.scrollHeight+", styleHeight:"+styleHeight+", heightDiff:"+heightDiff);
				
				// When press a button
				// Chrome: heightDiff === 4
				// Firefox: heightDiff === 0
				
				if ((heightDiff > 0 && heightDiff !== 4) && ele.scrollHeight < maxHeight)
				{
					ele.style.height = (ele.scrollHeight + 2) + "px";
				}
				else if (ele.scrollHeight > maxHeight && ele.scrollHeight - maxHeight < 100)
				{
					ele.style.height = maxHeight + "px";
				}
				
			}
			
			var autoExpandEventTextarea = function(ele, maxHeight)
			{
				if (ele)
				{
					ele.param_MaxHeight = maxHeight;
					ele.addEventListener("input", autoExpandEvent);
					ele.addEventListener("keyup", autoExpandEvent);
				}
			}
			
			setTimeoutCustom(function()
			{
				var elesTextarea = document.querySelectorAll("textarea");
				for (var i = 0; i < elesTextarea.length; i++)
				{
					autoExpandEventTextarea(elesTextarea[i], 500);
					autoHideCursor(elesTextarea[i]);
				}
			}, timingInit.expandTextarea);
		}
		
		// Focus on mod action
		{
			var elesFormRemoveComment = document.querySelectorAll(".suggestion_signature .lbAction[name^='mymodcomment']");
			for (var i = 0; i < elesFormRemoveComment.length; i++)
			{
				var action = elesFormRemoveComment[i].getAttribute("action");
				if (action.indexOf("#stsh_modcomment") < 0)
				{
					elesFormRemoveComment[i].setAttribute("action", action + "#stsh_modcomment");
				}
			}
			
			var elesSubmitComment = document.querySelectorAll(
				".suggestion_signature > div > div > .copy > form > div > .stsh_submit_comment");
			for (var i = 0; i < elesSubmitComment.length; i++)
			{
				var eleForm = elesSubmitComment[i].parentElement.parentElement;
				if (eleForm.tagName === "FORM")
				{
					var action = eleForm.getAttribute("action");
					if (action.indexOf("#stsh_modcomment") < 0)
					{
						eleForm.setAttribute("action", action + "#stsh_modcomment");
					}
				}
			}
			
			if (/reconsider|approve|decline/i.test(getQueryByName("action")) || url.indexOf("#stsh_modcomment") > -1)
			{
				setTimeoutCustom(function()
				{
					if (eleTextNew && eleTextOrg)
					{						
						if (eleTextNew.scrollHeight > 480 || eleTextOrg.scrollHeight > 480)
						{
							scrollToElement(".suggestions_list", -40);
						}
						else if (eleTextNew.scrollHeight > 120 || eleTextOrg.scrollHeight > 200)
						{
							var elesEdit = document.querySelectorAll(".stsh_action_edit");
							if (elesEdit.length > 1)
							{
								scrollToElement(".suggestions_list", -40);
							}
						}
					}
				}, timingInit.focusModAction);
			}
		}
		
		// Add char, word and byte count
		{
			var countCharWordByte = function(ele)
			{
				var countChar = 0;
				var countWord = 0;
				var countByte = 0;
				if (ele)
				{
					var text = ele.value || (ele.value === "" ? "" : ele.textContent);
					countChar = text.length;
					var arrWord = trimSpace(text).split(/\s+/);
					if (arrWord.length === 1)
					{
						if (trimSpace(arrWord[0]).length > 0)
						{
							countWord = 1;
						}
					}
					else
					{
						countWord = arrWord.length;
					}
					countByte = getByteCount(text);
				}
				return "Char: " + countChar + " :: Word: " + countWord + " :: Byte: " + countByte;
			}

			var elesText = document.querySelectorAll("#suggestion_value_new, .stsh_text_addComment, #add_to_discussion");
			for (var i = 0; i < elesText.length; i++)
			{
				var eleCounter = document.createElement("div");
				eleCounter.classList.add("stsh_counter");
				eleCounter.classList.add("stsh_blue_light");
				eleCounter.classList.add("stsh_cursor_help");
				eleCounter.dataset.counter = countCharWordByte(elesText[i]);
				eleCounter.title = "Chars and words are approximate values. "
					+ "\nYou should add a comment or a discussion using less than 1020 bytes.";
				insertAfterElement(eleCounter, elesText[i]);
				
				elesText[i].addEventListener("input", function(ev)
				{
					var eleTarget = ev.target;
					var eleCounter = eleTarget.nextElementSibling;
					if (eleCounter && eleCounter.classList.contains("stsh_counter"))
					{
						eleCounter.dataset.counter = countCharWordByte(eleTarget);
					}
				});
			}
			
			/*elesText = document.querySelectorAll(".stsh_text_org, .stsh_text_trn:not(.stsh_text_trn_empty), .suggestion_text");
			for (var i = 0; i < elesText.length; i++)
			{
				////
			}*/
		}
		
		// Warn before closing frame
		{
			if (window !== window.parent)
			{
				var eleOuter = window.parent.document.querySelector("#suggestions_box_outer");
				if (eleOuter)
				{
					eleOuter.dataset.stshTextEdited = "false";
					eleOuter.title = "";
					
					var markEdited = function(ev)
					{
						if (!ev.ctrlKey && !ev.altKey)
						{
							if (eleOuter && eleOuter.dataset)
							{
								eleOuter.dataset.stshTextEdited = "true";
								eleOuter.title = "When some texts were edited. \nYou must double click to close suggestion box.";
								removeEventsMarkEdited();
							}
						}
					};
					
					var removeEventsMarkEdited = function()
					{
						var elesText = document.querySelectorAll("#suggestion_value_new, .stsh_text_addComment, #add_to_discussion");
						for (var i = 0; i < elesText.length; i++)
						{
							elesText[i].removeEventListener("keydown", markEdited);
						}
					};
					
					var elesText = document.querySelectorAll("#suggestion_value_new, .stsh_text_addComment, #add_to_discussion");
					for (var i = 0; i < elesText.length; i++)
					{
						elesText[i].addEventListener("keydown", markEdited);
					}
				}
			}
		}
		
		// Open auto replace form when applied
		{
			var eleStatus = document.querySelector("#replacementstatus");
			if (eleStatus)
			{
				var eleAutoCopy = document.querySelector("#autocopy");
				if (eleAutoCopy)
				{
					eleAutoCopy.style.display = "";
				}
			}
		}
		
		// Add auto-replacement for suggestion box
		{
			var eleAutoCopy = document.querySelector("#autocopy");
			if (eleAutoCopy)
			{
				var eleBlock = null;
				var eleHeader = null;
				var eleForm = null;
				var eleInstruction = null;
				var eleMarker = null;
				var eleDefine = null;
				var eleMore = null;
				var eleEnabled = null;
				var eleEnabledLabel = null;
				var eleEnabledContent = null;
				var eleCase = null;
				var eleCaseLabel = null;
				var eleCaseContent = null;
				var eleRgx = null;
				var eleRgxLabel = null;
				var eleRgxContent = null;
				
				var addAutoReplaceText = function(eleMarker, textOrg, textDef)
				{
					textOrg = (typeof textOrg !== "undefined") ? textOrg : "";
					textDef = (typeof textDef !== "undefined") ? textDef : "";
					
					if (eleMarker)
					{
						var eleTextOrg = document.createElement("textarea");
						eleTextOrg.classList.add("stsh_autoReplace_text");
						eleTextOrg.classList.add("stsh_autoReplace_text_org");
						eleTextOrg.setAttribute("rows", "1");
						eleTextOrg.setAttribute("placeholder", "Your language or english text to be autoreplaced");
						eleTextOrg.value = textOrg;
						
						var eleTextDef = document.createElement("textarea");
						eleTextDef.classList.add("stsh_autoReplace_text");
						eleTextDef.classList.add("stsh_autoReplace_text_def");
						eleTextDef.setAttribute("rows", "1");
						eleTextDef.setAttribute("placeholder", "Translation");
						eleTextDef.value = textDef;
						
						insertBeforeElement(eleTextOrg, eleMarker);
						insertBeforeElement(document.createTextNode(" "), eleMarker);
						insertBeforeElement(eleTextDef, eleMarker);
						insertBeforeElement(document.createElement("br"), eleMarker);
					}
				}
				
				// Add elements
				{
					eleBlock = document.createElement("div");
					eleBlock.classList.add("stsh_autoReplace_block");
					
					insertAfterElement(eleBlock, eleAutoCopy);
					
					eleHeader = document.createElement("div");
					eleHeader.classList.add("stsh_autoReplace_header");
					eleHeader.classList.add("stsh_green");
					eleHeader.classList.add("stsh_cursor_pointer");
					eleHeader.textContent = "AUTO-REPLACEMENT FOR SUGGESTION BOX";
					eleHeader.setAttribute("onclick", "$('.stsh_autoReplace_form').toggle('blind', 300);");
					
					eleBlock.appendChild(document.createElement("br"));
					eleBlock.appendChild(eleHeader);
					
					eleForm = document.createElement("form");
					eleForm.classList.add("stsh_form");
					eleForm.classList.add("stsh_autoReplace_form");
					eleForm.style.display = "none";
					
					eleBlock.appendChild(eleForm);
					
					eleInstruction = document.createElement("div");
					eleInstruction.classList.add("stsh_autoReplace_instruction");
					eleInstruction.innerHTML = 
" \
Auto-replacements for current text in suggestion box. These will replace anything in your current text in suggestion box. \
<br> You can use these to replace translated strings that you need to correct them. \
These will be processed after other replacements applied. \
<br> You can enable/disable replacements, case-sensitive mode and RegExp mode by using checkboxes below. \
";
				
					eleForm.appendChild(eleInstruction);
					eleForm.appendChild(document.createElement("br"));
					
					eleMarker = document.createElement("div");
					eleMarker.classList.add("stsh_autoReplace_marker");
					
					eleForm.appendChild(eleMarker);
					
					eleDefine = document.createElement("input");
					eleDefine.classList.add("stsh_autoReplace_define");
					eleDefine.setAttribute("onclick", "return false;");
					eleDefine.type = "submit";
					eleDefine.value = "Define";
					eleDefine.title = "Define auto-replacements and refresh this page";
					
					eleMore = document.createElement("input");
					eleMore.classList.add("stsh_autoReplace_more");
					eleMore.setAttribute("onclick", "return false;");
					eleMore.type = "button";
					eleMore.value = "Add More";
					eleMore.title = "Add a new auto-replacement";
					
					// Checkbox enabled
					{
						eleEnabled = document.createElement("input");
						eleEnabled.classList.add("stsh_autoReplace_enabled");
						eleEnabled.setAttribute("type", "checkbox");
						eleEnabled.setAttribute("value", "true");
						
						eleEnabledLabel = document.createElement("label");
						eleEnabledLabel.classList.add("stsh_checkbox_label");
						eleEnabledLabel.classList.add("stsh_autoReplace_enabled_label");
						eleEnabledLabel.classList.add("stsh_unselectable");
						eleEnabledLabel.classList.add("stsh_cursor_pointer");
						
						eleEnabledContent = document.createElement("span");
						eleEnabledContent.textContent = " Enable Auto-replacements";
						
						eleEnabledLabel.appendChild(eleEnabled);
						eleEnabledLabel.appendChild(eleEnabledContent);
					}
					
					// Checkbox case
					{
						eleCase = document.createElement("input");
						eleCase.classList.add("stsh_autoReplace_case");
						eleCase.setAttribute("type", "checkbox");
						eleCase.setAttribute("value", "true");
						
						eleCaseLabel = document.createElement("label");
						eleCaseLabel.classList.add("stsh_checkbox_label");
						eleCaseLabel.classList.add("stsh_autoReplace_case_label");
						eleCaseLabel.classList.add("stsh_unselectable");
						eleCaseLabel.classList.add("stsh_cursor_pointer");
						
						eleCaseContent = document.createElement("span");
						eleCaseContent.textContent = " Case-sensitive";
						
						eleCaseLabel.appendChild(eleCase);
						eleCaseLabel.appendChild(eleCaseContent);
					}
					
					// Checkbox regexp
					{
						eleRgx = document.createElement("input");
						eleRgx.classList.add("stsh_autoReplace_rgx");
						eleRgx.setAttribute("type", "checkbox");
						eleRgx.setAttribute("value", "true");
						
						eleRgxLabel = document.createElement("label");
						eleRgxLabel.classList.add("stsh_checkbox_label");
						eleRgxLabel.classList.add("stsh_autoReplace_rgx_label");
						eleRgxLabel.classList.add("stsh_unselectable");
						eleRgxLabel.classList.add("stsh_cursor_pointer");
						
						eleRgxContent = document.createElement("span");
						eleRgxContent.textContent = " Use RegExp";
						
						eleRgxLabel.appendChild(eleRgx);
						eleRgxLabel.appendChild(eleRgxContent);
					}
					
					eleForm.appendChild(document.createElement("br"));
					eleForm.appendChild(eleDefine);
					eleForm.appendChild(document.createTextNode(" "));
					eleForm.appendChild(eleMore);
					eleForm.appendChild(document.createTextNode(" "));
					eleForm.appendChild(eleEnabledLabel);
					eleForm.appendChild(document.createTextNode(" "));
					eleForm.appendChild(eleCaseLabel);
					eleForm.appendChild(document.createTextNode(" "));
					eleForm.appendChild(eleRgxLabel);
					eleForm.appendChild(document.createElement("br"));
					eleForm.appendChild(document.createElement("br"));
					
				} // Add elements
				
				// Bind events
				{
					var defineAutoReplaceText = function()
					{
						var objText = {};
						
						var elesTextOrg = document.querySelectorAll(".stsh_autoReplace_text_org");
						for (var i = 0; i < elesTextOrg.length; i++)
						{
							var eleTextOrg = elesTextOrg[i];
							var eleTextDef = eleTextOrg.nextElementSibling;
							var textOrg = eleTextOrg.value;
							var textDef = eleTextDef.value;
							var index = "text" + i;
							
							objText[index] = {};
							objText[index].textOrg = textOrg;
							objText[index].textDef = textDef;
						}
						
						GM_setValue("autoReplace_text", objText);
						
						reload();
					};
					
					eleDefine.addEventListener("click", defineAutoReplaceText);
					
					eleMore.addEventListener("click", function()
					{
						var eleMarker = document.querySelector(".stsh_autoReplace_marker");
						addAutoReplaceText(eleMarker);
					});
					
					eleEnabled.addEventListener("click", function (ev)
					{
						var ele = ev.target;
						GM_setValue("autoReplace_enabled", ele.checked ? "true" : "false");
					});
					
					eleCase.addEventListener("click", function (ev)
					{
						var ele = ev.target;
						GM_setValue("autoReplace_case", ele.checked ? "true" : "false");
					});
					
					eleRgx.addEventListener("click", function (ev)
					{
						var ele = ev.target;
						GM_setValue("autoReplace_rgx", ele.checked ? "true" : "false");
					});
					
					addKeyCtrlEnter(eleForm, eleDefine);
					
				} // Bind events
				
				// User defined value
				{
					var valEnabled = GM_getValue("autoReplace_enabled", 0);
					if (valEnabled === "true")
					{
						eleEnabled.checked = true;
					}
					
					var valCase = GM_getValue("autoReplace_case", 0);
					if (valCase === "true")
					{
						eleCase.checked = true;
					}
					
					var valRgx = GM_getValue("autoReplace_rgx", 0);
					if (valRgx === "true")
					{
						eleRgx.checked = true;
					}
					
					var autoReplaceTextCount = 4;
					
					var objText = GM_getValue("autoReplace_text", 0);
					if (!objText)
					{
						objText = {};			
					}
					else
					{						
						for (var i = Object.keys(objText).length - 1; i > autoReplaceTextCount - 1; i--)
						{
							var index = "text" + i;
							if (objText[index].textOrg !== "" || objText[index].textDef !== "")
							{
								autoReplaceTextCount = i + 1;
								break;
							}
						}
						
						// Auto replace text
						if (valEnabled === "true")
						{					
							var isTextReplaced = false;
							
							// Skip this
							/*
							if (document.referrer === document.documentURI)
							{
								isTextReplaced = true;
							}
							*/
							
							if (!isTextReplaced && getQueryByName("action"))
							{
								isTextReplaced = true;
							}
							
							if (!isTextReplaced)
							{
								var eleError = document.querySelector(".suggestion_error");
								if (eleError && eleError.textContent.trim() !== "")
								{
									isTextReplaced = true;
								}
							}
							
							if (!isTextReplaced)
							{
								var eleBtnResummit = document.querySelector(".stsh_text_submit[value^='RESUBMIT']");
								if (eleBtnResummit)
								{
									isTextReplaced = true;
								}
							}							
							
							if (!isTextReplaced)
							{
								setTimeoutCustom(function(objText) 
								{
									var isTextReplaced = false;
									
									var isRgx = (GM_getValue("autoReplace_rgx") === "true");
									var isCase = (GM_getValue("autoReplace_case") === "true");
									
									var keysText = Object.keys(objText);
									for (var i = 0; i < keysText.length; i++)
									{
										var textOrg = objText[keysText[i]].textOrg;
										if (textOrg !== "")
										{
											var textDef = objText[keysText[i]].textDef;
											
											var eleTextNew = document.querySelector("#suggestion_value_new");
											if (eleTextNew)
											{
												var textOld = eleTextNew.value;
												var textNew = "";
												
												var rgxOrg = null;
												var rgxFlag = isCase ? "g" : "ig";
												
												if (isRgx)
												{
													rgxOrg = new RegExp(textOrg, rgxFlag);
												}
												else
												{
													rgxOrg = new RegExp(escapeRegExp(textOrg), rgxFlag);
												}
												
												textNew = textOld.replace(rgxOrg, textDef);
												
												if (textOld !== textNew)
												{
													isTextReplaced = true;
													eleTextNew.value = textNew;
												}
											}
										}
									}
									
									if (isTextReplaced)
									{
										var eleForm = document.querySelector(".stsh_autoReplace_form");
										if (eleForm)
										{
											eleForm.style.display = "";
										}
										
										if (eleTextSubmit)
										{
											var eleDiv = document.createElement("div");
											eleDiv.classList.add("stsh_autoReplace_notice");
											eleDiv.classList.add("stsh_orange_light3");
											eleDiv.textContent = "Auto-replacement for suggestion applied!";
											eleTextSubmit.parentElement.appendChild(eleDiv);
										}										
									}
								}, timingInit.autoReplaceText, objText);
							}
						}
					}
					
					for (var i = 0; i < autoReplaceTextCount; i++)
					{
						var textOrg = "";
						var textDef = "";
						var index = "text" + i;
						
						if (typeof objText[index] !== "undefined")
						{
							textOrg = objText[index].textOrg;
							textDef = objText[index].textDef;
						}
						
						addAutoReplaceText(eleMarker, textOrg, textDef);
					}
					
					// Add one more empty row
					addAutoReplaceText(eleMarker);
					
				} // User defined value
			}
		} // Add auto-replacement for suggestion box
		
		// Add scroll to top
		// Find next unmatched
		{
			var eleInvert = document.querySelector("input[value='Invert display']");
			if (eleInvert)
			{
				eleInvert.value = "Invert Display";
				
				// Add scroll to top
				{
					var eleScroll = document.createElement("input");
					eleScroll.classList.add("stsh_scrollToTop");
					eleScroll.setAttribute("onclick", "return false;");
					eleScroll.type = "button";
					eleScroll.value = "Scroll to Top";
					
					eleScroll.addEventListener("click", function (ev)
					{
						window.scrollTo(0, 0); 
					});
					
					var eleContainer = document.createElement("div");
					eleContainer.classList.add("stsh_bottom_container");
					eleContainer.classList.add("stsh_inline");
					
					eleContainer.appendChild(document.createTextNode(" "));
					eleContainer.appendChild(eleScroll);
					
					insertAfterElement(eleContainer, eleInvert);
				}
				
				// Find next unmatched
				// Sample: https://translation.steampowered.com/translate.php?paginationrows=1000&search_input=%01
				{
					var eleUnmatched = document.createElement("input");
					eleUnmatched.classList.add("stsh_nextUnmatched");
					eleUnmatched.setAttribute("type", "checkbox");
					eleUnmatched.setAttribute("value", "true");
					
					var eleUnmatchedLabel = document.createElement("label");
					eleUnmatchedLabel.classList.add("stsh_checkbox_label");
					eleUnmatchedLabel.classList.add("stsh_nextUnmatched_label");
					eleUnmatchedLabel.classList.add("stsh_unselectable");
					eleUnmatchedLabel.classList.add("stsh_cursor_pointer");
					eleUnmatchedLabel.title = 
						"Find next unmatched for special chars, combining diacritical marks, \nand HTML elements count. "
						+ "\nClick any position to stop finding.";
					
					var eleUnmatchedContent = document.createElement("span");
					eleUnmatchedContent.classList.add("stsh_nextUnmatched_content");
					eleUnmatchedContent.textContent = " Find Next Unmatched";
			
					eleUnmatchedLabel.appendChild(eleUnmatched);
					eleUnmatchedLabel.appendChild(eleUnmatchedContent);
					
					eleContainer.appendChild(document.createTextNode(" "));
					eleContainer.appendChild(eleUnmatchedLabel);
					
					var findNextUnmatched = function(isInitial)
					{
						isInitial = isInitial || false;
						
						console.log("FindNextUnmatched: In " + timingInit.findNextUnmatched + "ms");
						setTimeoutCustom(function()
						{
							var eleUnmatched = document.querySelector(".stsh_nextUnmatched");
							if (eleUnmatched && eleUnmatched.checked)
							{
								var isClicked = false;
								
								var eleNext = document.querySelector(".stsh_nav_next:not(:disabled)");
								if (eleNext)
								{
									if (!isInitial)
									{
										var eleStatusUnmatched = document.querySelector(".stsh_status_unmatched");
										if (eleStatusUnmatched)
										{
											isClicked = false;
											
											if (eleStatusUnmatched.classList.contains("stsh_spanStatusTrn"))
											{
												if (document.querySelector(".stsh_spanStatusSug.stsh_status_matched"))
												{
													isClicked = true;
												}
											}
										}
										else
										{
											isClicked = true;
										}
									}
									else
									{
										isClicked = true;
									}
								}
								
								if (!isClicked)
								{
									eleUnmatched.checked = false;
									GM_setValue("nextUnmatched", "false");
								}
								else
								{
									GM_setValue("timeNextUnmatchedLast", getUnixTimestamp());
									eleNext.click();
								}
							}
						}, timingInit.findNextUnmatched);
					}
				
					var tmDiff = getUnixTimestamp() - GM_getValue("timeNextUnmatchedLast", 0);
					if (tmDiff > 10)
					{
						// > 10s
						eleUnmatched.checked = false;
						GM_setValue("nextUnmatched", "false");
					}
					
					if (window !== window.parent)
					{
						var eleOuter = window.parent.document.querySelector("#suggestions_box_outer");
						if (eleOuter)
						{
							if (eleOuter.style.display === "none")
							{
								// Closed iFrame
								eleUnmatched.checked = false;
								GM_setValue("nextUnmatched", "false");
							}
						}
					}
					
					if (GM_getValue("nextUnmatched", 0) === "true")
					{
						eleUnmatched.checked = true;
						findNextUnmatched();
						
						var uncheckFindNextUnmatched = function (ev)
						{
							var eleTarget = ev.target;
							if (eleTarget.id !== "stsh_btn_displaySpecialChars"
								&& !eleTarget.classList.contains("stsh_nextUnmatched")
								&& !eleTarget.classList.contains("stsh_nextUnmatched_content")
								&& !eleTarget.classList.contains("stsh_nav_next"))
							{
								// Skip auto click
								
								var eleUnmatched = document.querySelector(".stsh_nextUnmatched");
								if (eleUnmatched)
								{
									console.log("FindNextUnmatched: Stop");
									eleUnmatched.checked = false;
									GM_setValue("nextUnmatched", "false");
									document.removeEventListener("click", uncheckFindNextUnmatched);
								}
							}
						};
						
						// Stop finding with any clicked
						document.addEventListener("click", uncheckFindNextUnmatched);
						
						// Display specialChars
						var eleSpecialChars = document.querySelector("#stsh_btn_displaySpecialChars");
						if (eleSpecialChars)
						{
							eleSpecialChars.click();
						}
					}
					
					eleUnmatched.addEventListener("click", function (ev)
					{
						var eleTarget = ev.target;
						if (eleTarget.checked)
						{
							GM_setValue("nextUnmatched", "true");
							findNextUnmatched(true);
						}
						else
						{
							GM_setValue("nextUnmatched", "false");
						}
					});
					
				}
			}
		}
		
		// Add copy button
		{
			if (eleTextSubmit)
			{
				var eleInput = document.createElement("input");
				eleInput.classList.add("stsh_copy_new");
				eleInput.type = "button";
				eleInput.value = "Copy";
				eleInput.title = "Copy current suggestion to clipboard";
				
				insertAfterElement(eleInput, eleTextSubmit);
				
				eleInput.addEventListener("click", function()
				{
					var eleTextNew = document.querySelector("#suggestion_value_new");
					if (eleTextNew)
					{
						GM_setClipboard(eleTextNew.value);
						focusWithoutScroll(eleTextNew);
					}
				});
			}
			
			var titleExtra = "\nSome tags and attributes were generated or removed by STS. "
				+ "\nSingle quote ' may be changed to double quote \" "
				+ "\n and double quote \" may be added for attribute values by browser. ";
				
			var elesEdit = document.querySelectorAll(".stsh_action_edit");
			for (var i = 0; i < elesEdit.length; i++)
			{
				var eleInput = document.createElement("input");
				eleInput.classList.add("stsh_copy_sug");
				eleInput.classList.add("stsh_blue_light");
				eleInput.type = "button";
				eleInput.value = "Copy";
				eleInput.title = "Copy this suggestion to clipboard. " + titleExtra;
				
				insertBeforeElement(eleInput, elesEdit[i]);
			
				eleInput.addEventListener("click", function(ev)
				{
					var eleTarget = ev.target;
					
					var eleSug = eleTarget.parentElement.parentElement
						.parentElement.parentElement
						.querySelector(".stsh_text_sug");
					if (eleSug)
					{
						var html = removeStsHtmlTags(eleSug);
						if (html)
						{
							GM_setClipboard(html);
							focusWithoutScroll("#suggestion_value_new");
						}
					}
				});
			}
			
			if (eleHeaderOrg)
			{
				var eleInput = document.createElement("input");
				eleInput.classList.add("stsh_copy_org");
				eleInput.type = "button";
				eleInput.value = "Copy";
				eleInput.title = "Copy original string to clipboard. " + titleExtra;
				
				insertAfterElement(eleInput, eleHeaderOrg.firstElementChild);
				
				eleInput.addEventListener("click", function(ev)
				{
					var eleTextOrg = document.querySelector(".stsh_text_org");
					if (eleTextOrg)
					{
						var html = removeStsHtmlTags(eleTextOrg);
						if (html)
						{
							GM_setClipboard(html);
							focusWithoutScroll("#suggestion_value_new");
						}
					}
				});
			}
			
			if (eleHeaderTrn && eleTextTrn && !eleTextTrn.classList.contains("stsh_text_trn_empty"))
			{
				var eleInput = document.createElement("input");
				eleInput.classList.add("stsh_copy_trn");
				eleInput.type = "button";
				eleInput.value = "Copy";
				eleInput.title = "Copy translated string to clipboard. " + titleExtra;
				
				insertAfterElement(eleInput, eleHeaderTrn.firstElementChild);
				
				eleInput.addEventListener("click", function(ev)
				{
					var eleTextTrn = document.querySelector(".stsh_text_trn:not(.stsh_text_trn_empty)");
					if (eleTextTrn)
					{
						var html = removeStsHtmlTags(eleTextTrn);
						if (html)
						{
							GM_setClipboard(html);
							focusWithoutScroll("#suggestion_value_new");
						}
					}
				});
			}
		}
		
		// Add border to related action
		{
			if (userName)
			{
				var eleSugHistory = document.querySelector(".stsh_suggestion_list_history");
				if (eleSugHistory)
				{
					var isRelated = false;
					var strName = "by " + userName + " ";
					
					eleSugHistory.innerHTML = eleSugHistory.innerHTML.replace("<br>String: ", 
						'<br><span class="stsh_suggestion_list_history_header">String: </span>');
					
					for (var i = 0; i < eleSugHistory.childNodes.length; i++)
					{
						var node = eleSugHistory.childNodes[i];
						if (node.nodeType === document.TEXT_NODE)
						{
							var index = (node.textContent + " ").indexOf(strName);
							if (index > -1 && index < 12)
							{
								isRelated = true;
								break;
							}
						}
					}
					
					if (isRelated)
					{
						eleSugHistory.classList.add("stsh_suggestion_list_history_related");
						
						var eleDiv = document.createElement("div");
						eleDiv.innerHTML = eleSugHistory.innerHTML
							.replace(new RegExp("by (" + escapeRegExp(userName) + ")", "g")
								, function(match, p1, offset, string) 
								{
									return 'by <span class="stsh_profile_name stsh_blue_light2 stsh_cursor_help"'
										+ ' title="This string is related with your action.">' 
										+ p1.replace(/\</g, "&lt;") + '</span>';
								});
								
						eleSugHistory.innerHTML = eleDiv.innerHTML;
					}
				}
			}
		}
		
	} // End suggestions.php

	if (url.indexOf("translate.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_translate");
		
		var searchText = getQueryByName("search_input");
		if (searchText !== "")
		{
			if (searchText.indexOf("SUGGESTIONS FROM: ") === 0)
			{
				document.title = searchText.replace("SUGGESTIONS FROM: ", "") + " - " + document.title;
			}
			else if (searchText.indexOf("REVIEWS FROM: ") === 0)
			{
				document.title = searchText.replace("REVIEW: ", "") + " - " + document.title;
			}
			else
			{
				document.title = searchText + " - " + document.title;
			}
		}
		else
		{
			var fileID = getQueryByName("file_ID");
			if (fileID !== "")
			{
				var eleFile = document.querySelector("#leftAreaContainer label[for='chosenfile']");
				if (eleFile)
				{
					var file = eleFile.textContent.trim();
					if (file.indexOf("Limit search results to CURRENT FILE: ") === 0)
					{
						file = file.replace("Limit search results to CURRENT FILE: ", "");
						var fileNew = file.split("#").reverse().join(" # ").trim();
						document.title = fileNew + " - " + document.title;
					}
				}
			}
			else
			{
				var eleInput = document.querySelector("#search_input");
				if (eleInput)
				{
					var valInput = eleInput.value.trim();
					if (valInput.indexOf("SUGGESTIONS FROM: ") === 0)
					{
						document.title = valInput.replace("SUGGESTIONS FROM: ", "") + " - " + document.title;
					}
					else if (valInput.indexOf("REVIEWS FROM: ") === 0)
					{
						document.title = valInput.replace("REVIEWS FROM: ", "REVIEW: ") + " - " + document.title;
					}
					else if (valInput === "---DAYLIGHT SAVINGS BATTLE---")
					{
						document.title = "DAYLIGHT SAVINGS BATTLE - " + document.title;
					}
				}
			}
		}
	
		var outer = document.querySelector("#suggestions_box_outer");
		if (outer)
		{
			outer.setAttribute("onclick", "doubleClickHideSuggestion(this);");
			outer.dataset.stshHideSuggestion = 0;
			outer.dataset.stshTextEdited = "false";
		}
	
		var divBtn = document.createElement("div");
		document.body.appendChild(divBtn);
		divBtn.innerHTML = 
' \
<div class="stsh_showing_group"> \
	<span class="stsh_showing_header">Hide</span>\
	<br> &nbsp; <input id="stsh_showing_keyApp"		value="App"		data-hidekey="0" class="stsh_btn_short stsh_showing_key" type="button" /> \
				<input id="stsh_showing_keyGame"	value="Game"	data-hidekey="1" class="stsh_btn_short stsh_showing_key" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_keyFaq"		value="FAQ"		data-hidekey="2" class="stsh_btn_short stsh_showing_key" type="button" /> \
				<input id="stsh_showing_keySupport"	value="Support"	data-hidekey="3" class="stsh_btn_short stsh_showing_key" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_keyPromo"	value="Promo"	data-hidekey="4" class="stsh_btn_short stsh_showing_key" type="button" /> \
				<input id="stsh_showing_keyEmail"	value="Email"	data-hidekey="5" class="stsh_btn_short stsh_showing_key" type="button" /> \
	<br> \
	<br> &nbsp; <input id="stsh_showing_strNotMatch" value="Hide not similar" data-hidestr="0" class="stsh_btn_long stsh_showing_str" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_strLong"	 value="Hide very long"	  data-hidestr="1" class="stsh_btn_long stsh_showing_str" type="button" /> \
	 \
	<br> &nbsp; <span class="stsh_showing_header">Hide Suggestions</span>\
	<br> &nbsp; <input id="stsh_showing_notTranslated" value="Not Translated (0)" data-hidestatus="0" class="stsh_btn_long stsh_showing_status" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_suggested"	   value="Suggested (0)"	  data-hidestatus="1" class="stsh_btn_long stsh_showing_status" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_resuggested"   value="Resuggested (0)"	  data-hidestatus="2" class="stsh_btn_long stsh_showing_status" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_approved"	   value="Approved (0)"		  data-hidestatus="3" class="stsh_btn_long stsh_showing_status" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_declined"	   value="Declined (0)"		  data-hidestatus="4" class="stsh_btn_long stsh_showing_status" type="button" /> \
	<br> &nbsp; <input id="stsh_showing_translated"	   value="Translated (0)"	  data-hidestatus="5" class="stsh_btn_long stsh_showing_status" type="button" /> \
	 \
	<br> &nbsp; <span class="stsh_showing_header">Sort by</span>\
	<br> &nbsp; <input id="stsh_sort_key"	 value="Key"	data-sort="0" class="stsh_btn_short stsh_sort" type="button" /> \
				<input id="stsh_sort_string" value="String"	data-sort="1" class="stsh_btn_short stsh_sort" type="button" /> \
	<br> &nbsp; <input id="stsh_sort_word"	 value="Word"	data-sort="2" class="stsh_btn_short stsh_sort" type="button" /> \
				<input id="stsh_sort_length" value="Length"	data-sort="3" class="stsh_btn_short stsh_sort" type="button" /> \
	<br> \
	<br> &nbsp; <input id="stsh_showing_refresh" value="Refresh"  class="stsh_btn" type="button" onclick="hideSuggestionsBox(); return false;" /> \
	<br> &nbsp; <input id="stsh_showing_all"	 value="Show All" class="stsh_btn" type="button" /> \
	<br> \
</div> \
<div id="stsh_showing_current"></div> \
<div id="stsh_showing"></div> \
';

		// Count showing
		var countShowing = function()
		{
			var trKeys = document.querySelectorAll("#keylist > table:nth-child(1) > tbody:nth-child(1) > tr");
			var countAll = document.querySelectorAll("#keylist .copysmall").length;
			var countShow = 0;
			var countSuggest = 0;
			var countResuggest = 0;
			var countApprove = 0;
			var countDecline = 0;
			var countNotTranslated = 0;
			var countTranslated = 0;
			
			var txtApprove = "ready for Admin";
			var txtDecline = "ready for removal";
			var txtSuggest = "suggestion";
			
			for (var i = 0; i < trKeys.length; i++)
			{
				if (!trKeys[i].classList.contains("stsh_hidden"))
				{
					var eleCounter = trKeys[i].querySelector("tr.copysmall > td:nth-child(3)");
					if (eleCounter)
					{
						countShow++;
						var txtCounter = eleCounter.textContent.trim();
						if (txtCounter.indexOf(txtApprove) > -1)
						{
							countApprove++;
						}
						else if (txtCounter.indexOf(txtDecline) > -1)
						{
							countDecline++;
						}
						else if (txtCounter.indexOf(txtSuggest) > -1)
						{
							var eleNotTranslated = trKeys[i].querySelector("span.token_nottranslated");
							if (eleNotTranslated)
							{
								countSuggest++;
							}
							else
							{
								countResuggest++;
							}
						}
						else
						{
							var eleNotTranslated = trKeys[i].querySelector("span.token_nottranslated");
							if (eleNotTranslated)
							{
								countNotTranslated++;
							}
							else
							{
								countTranslated++;
							}
						}
					}
					else
					{
						var eleTd = trKeys[i].querySelector("td");
						if (eleTd)
						{
							if (eleTd.textContent.trim() === "")
							{
								removeElement(trKeys[i]);
							}
						}
					}
				}
			}
			
			var eleShowing = document.querySelector("#stsh_showing");
			if (eleShowing)
			{
				var newHtml = "Showing: <span class=\"stsh_showing_counter\">" + countShow + " of " + countAll + "</span>"
					+ "<!-- " + countNotTranslated + ", " + countSuggest + ", " + countResuggest
					+ ", " + countApprove + ", " + countDecline + ", " + countTranslated + " -->";
					
				if (eleShowing.innerHTML !== newHtml)
				{
					eleShowing.innerHTML = newHtml;

					var elesBtnShowingStatus = document.querySelectorAll(".stsh_showing_status");
					if (elesBtnShowingStatus.length === 6)
					{
						var counterArr = [countNotTranslated, countSuggest, countResuggest
							, countApprove, countDecline, countTranslated ];
						var counterTextArr = ["Not Translated", "Suggested", "Resuggested"
							, "Approved", "Declined", "Translated" ];

						for (var i = 0; i < elesBtnShowingStatus.length; i++)
						{
							elesBtnShowingStatus[i].value = counterTextArr[i] + " ("+ counterArr[i] +")" ;
						};
					}
				}
			}
			
			var eleShowingCur = document.querySelector("#stsh_showing_current");
			if (eleShowingCur)
			{
				var eleOuter = document.querySelector("#suggestions_box_outer");
				if (eleOuter)
				{
					if (eleOuter.style.display !== "none")
					{
						if (eleShowingCur.style.display !== "initial")
							eleShowingCur.style.display = "initial";
						
						var eleIframe = document.querySelector("#suggestions_iframe");
						if (eleIframe)
						{
							var iUrl = eleIframe.contentWindow.location.href;
							var listId = parseInt(getQueryByName("list_id", iUrl)) || 0;
							
							listId += 1;
							
							var newHtml = "Current: <span class=\"stsh_showing_counter\">" + listId + " of " + countShow + "</span>";
							if (eleShowingCur.innerHTML !== newHtml)
							{
								eleShowingCur.innerHTML = newHtml;
							}
						}
					}
					else
					{
						if (eleShowingCur.style.display !== "none")
						{
							eleShowingCur.style.display = "none";
							eleShowingCur.innerHTML = "";
						}
					}
				}
			}
		};
		countShowing();
		
		// Waiting for iframe
		{
			var obTarget_countRand = document.createElement("div");
			obTarget_countRand.id = "stsh_showing_random";
			obTarget_countRand.dataset.random = "0";
			document.body.appendChild(obTarget_countRand);
			
			var obMu_countRand = new MutationObserver(function(mutations)
			{
				mutations.forEach(function(mutation)
				{
					countShowing();
				});
			});

			var obConfig_countRand = { attributes: true, attributeFilter: ["data-random"] };
			obMu_countRand.observe(obTarget_countRand, obConfig_countRand);
		}
		
		// End Count showing

		// Line Counter
		var addLineCounter = function()
		{
			var elesCounter = document.querySelectorAll(".stsh_lineCounter");
			if (elesCounter.length > 0)
			{
				var j = 1;
				for (var i = 0; i < elesCounter.length; i++)
				{
					if (!elesCounter[i].parentElement.parentElement.parentElement
						.parentElement.classList.contains("stsh_hidden"))
					{
						if (elesCounter[i].textContent.trim() != j)
						{
							// Compare string with int using loose equality
							elesCounter[i].textContent = j;
						}
						j++;
					}
				}
			}
			else
			{
				var elesDiv = document.querySelectorAll("#keylist td:nth-child(1) > div");
				for (var i = 0; i < elesDiv.length; i++)
				{
					var eleNew = document.createElement("span");
					eleNew.classList.add("stsh_lineCounter_outer");
					eleNew.innerHTML =
						' <span class="stsh_lineCounter"> ' + (i + 1) + ' </span> ';
					
					elesDiv[i].appendChild(eleNew);
				}
			}
		};
		addLineCounter();
		
		// End Line Counter
		
		// Hide & sort suggestions
		{
			var hideStatus = function(mode)
			{
				/* 
					mode:
						0: notTranslated
						1: suggested
						2: resuggested
						3: approved
						4: declined
						5: translated
				*/

				//console.log("hideStatus: " + mode);
			
				if (mode < 0 || mode > 5) return;

				var display = "none";
				var txtApprove = "ready for Admin";
				var txtDecline = "ready for removal";
				var txtSuggest = "suggestion";
				 
				var trKeys = document.querySelectorAll("#keylist > table:nth-child(1) > tbody:nth-child(1) > tr");
				for (var i = 0; i < trKeys.length; i++)
				{
					if (!trKeys[i].classList.contains("stsh_hidden"))
					{
						var curMode = -1;

						var eleCounter = trKeys[i].querySelector("tr.copysmall > td:nth-child(3)");
						if (eleCounter)
						{

							var txtCounter = eleCounter.textContent.trim();
							if (txtCounter.indexOf(txtApprove) > -1)
							{
								curMode = 3;	// Approved
							}
							else if (txtCounter.indexOf(txtDecline) > -1)
							{
								curMode = 4;	// Declined
							}
							else if (txtCounter.indexOf(txtSuggest) > -1)
							{
								var eleNotTranslated = trKeys[i].querySelector("span.token_nottranslated");
								if (eleNotTranslated)
								{
									curMode = 1;	// Suggested
								}
								else
								{
									curMode = 2;	// Resuggested
								}
							}
							else
							{
								var eleNotTranslated = trKeys[i].querySelector("span.token_nottranslated");
								if (eleNotTranslated)
								{
									curMode = 0;	// Not Translated
								}
								else
								{
									curMode = 5;	// Translated
								}
							}
						}

						if (curMode === mode)
						{
							trKeys[i].classList.add("stsh_hidden");
						}
					}
				}
			}
			
			var sortKey = function(mode)
			{
				/*
					mode:
						0: key
						1: string
						2: word
						3: length
				*/
				
				if (mode < 0) return;
				
				var keyArr = [];
				var valArr = [];
				
				var dot = "...";
				var dotLengthMinus = 0 - dot.length;
				var strNotTranslated = "NOT TRANSLATED";
				var strTr = "";
				var rgxAlphabet = /[a-z0-9]/i;
				
				var eleKeys = document.querySelectorAll
				(" \
					#keylist > table:nth-child(1) \
					> tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) \
					> table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) \
				");
				for (var i = 0; i < eleKeys.length; i++)
				{
					try
					{
						/*
							key:
								tr: is translated
								sg: is suggested
								dt: has dot
								sb: spacebar count
								sc: special char count
								sp: has special char
								ln: length
								lt: length translated
								st: spacebar count translated
						*/
						
						var dot = "...";
						var dotLengthMinus = 0 - dot.length;
						var isDot = false;
						var isSuggested = false;
						var isTranslated = false;
						
						var key = eleKeys[i].textContent.trim() + "  ";
						var str = "";
						
						if (mode !== 0)
						{
							str = eleKeys[i].parentElement.nextSibling.nextSibling.firstElementChild.textContent.trim();
							isDot = (str.substr(dotLengthMinus) === dot);
							
							isSuggested = (eleKeys[i].nextElementSibling.nextElementSibling.textContent.trim() !== "");
							strTr = eleKeys[i].parentElement.nextElementSibling.lastElementChild.textContent.trim();
							isTranslated = (strTr !== strNotTranslated);
						}
						
						if (mode === 0)
						{
							// mode: key
							if (key.indexOf("GLOSSARY") === 0)
							{
								key = "0" + key;
							}
						}
						if (mode === 1)
						{
							// mode: string
							key = (isTranslated ? "tr00_ " : "tr99_ ") + strTr 
								+ (isSuggested ? "  _sg00" : "  _sg99") + " ___ " + key;
							if (str.length > 0 && !rgxAlphabet.test(str[0]))
							{
								key = "zzzzz" + str + "  ___ " + key;
							}
							else
							{
								key = str + "  ___ " + key;
							}
						}
						else if (mode === 2)
						{
							// mode: word
							key = (isTranslated ? "tr00_" : "tr99_") 
								+ "st" + padZero(strTr.split(" ").length, 2) + "_"
								+ "lt" + padZero(strTr.length, 3) + " " 
								+ strTr + (isSuggested ? "  _sg00" : "  _sg99") + " ___ " + key;
							key = (isDot ? "dt99_" : "dt00_")
								+ "sb" + padZero(str.split(" ").length, 2) 
								+ "_sc" + padZero(str.split(/[^a-z0-9 ]/i).length, 2)
								+ " ___ " + str + "  ___ " + key;
						}
						else if (mode === 3)
						{
							// length
							var length = 0;
							if (str[0] === "<" || str[0] === "[")
							{
								length = str.length + 800;
							}
							else if (str.indexOf("<") > 0 || str.indexOf("[") > 0)
							{
								length = str.length + 600;
							}
							else
							{
								length = str.length;
							}
							
							key = (isTranslated ? "tr00_" : "tr99_") + "lt" + padZero(strTr.length, 3) + " " 
								+ strTr + (isSuggested ? "  _sg00" : "  _sg99") + " ___ " + key;
							key = (isDot ? "dt99_" : "dt00_")
								+ "sp" + (str.split(/[^a-z0-9]/i).length > 1 ? "99_" : "00_")
								+ "ln" + padZero(length, 3)
								+ " ___ " + str + "  ___ " + key;
						}
						
						key = key.toLowerCase();
						keyArr.push(key);
						
						var eleParent = eleKeys[i].parentElement.parentElement.parentElement
							.parentElement.parentElement.parentElement;
							
						//eleParent.dataset.stshKey = key;
						//console.log("Key: " + key);
						
						valArr[key] = eleParent.outerHTML.trim();
					}
					catch (ex)
					{
						console.error("sortKey", ex.message);
					}
				}
				
				var keyArrTmp = keyArr.slice();
				keyArr.sort();
				
				var isSame = true;
				for (var i = 0; i < keyArr.length; i++)
				{
					if (keyArr[i] !== keyArrTmp[i])
					{
						isSame = false;
					}
				}
				
				if (!isSame)
				{
					var eleTable = document.querySelector("#keylist > table:nth-child(1) > tbody:nth-child(1)");
					if (eleTable)
					{
						var newInner = "";
						
						for (var i = 0; i < keyArr.length; i++)
						{
							newInner += valArr[keyArr[i]];
						}
						
						eleTable.innerHTML = newInner;
					}
				}
			}
			
			var activeHideStatus = [0, 0, 0, 0, 0, 0];
				// notTranslated, suggested, resuggested, approved, declined, translated
				
			var activeHideKey = [0, 0, 0, 0, 0, 0];
				// app, game, faq, support, promo, email
				
			var activeHideStr = [0, 0];
				// notMatch, long
				
			var activeSort = -1;
				
			var eleBtnShowAll = document.querySelector("#stsh_showing_all");
			if (eleBtnShowAll)
			{
				eleBtnShowAll.addEventListener("click", function()
				{
					var elesBtnShowing = document.querySelectorAll(
						".stsh_showing_status, .stsh_showing_key, .stsh_showing_str");
					for (var i = 0; i < elesBtnShowing.length; i++)
					{
						elesBtnShowing[i].disabled = false;
					}
					
					for (var i = 0; i < activeHideStatus.length; i++)
					{
						activeHideStatus[i] = 0;
					}
					
					for (var i = 0; i < activeHideKey.length; i++)
					{
						activeHideKey[i] = 0;
					}
					
					for (var i = 0; i < activeHideStr.length; i++)
					{
						activeHideStr[i] = 0;
					}
					
					activeSort = -1;
					
					hideKey(-1);	// Show all
					
					countShowing();
				});
			}

			var elesBtnShowingStatus = document.querySelectorAll(".stsh_showing_status");
			for (var i = 0; i < elesBtnShowingStatus.length; i++)
			{
				elesBtnShowingStatus[i].addEventListener("click", function(ev)
				{
					var mode = parseInt(ev.target.dataset.hidestatus) || 0;
					
					activeHideStatus[mode] = 1;
					hideStatus(mode);
					
					ev.target.disabled = true;
				});
			}
			
			var obTarget_hider = document.querySelector("#keylist_container");
			if (obTarget_hider)
			{
				var obMu_hider = new MutationObserver(function(mutations)
				{
					mutations.forEach(function(mutation)
					{
						//console.log("obMu_hider");
						
						for (var i = 0; i < activeHideStatus.length; i++)
						{
							if (activeHideStatus[i] === 1)
							{
								hideStatus(i);
							}
						}
						
						for (var i = 0; i < activeHideKey.length; i++)
						{
							if (activeHideKey[i] === 1)
							{
								hideKey(i);
							}
						}
						
						for (var i = 0; i < activeHideStr.length; i++)
						{
							if (activeHideStr[i] === 1)
							{
								hideStr(i);
							}
						}
						
						sortKey(activeSort);
					});
				});
				
				var obConfig_hider = { childList: true };
				obMu_hider.observe(obTarget_hider, obConfig_hider);
			}

			var elesBtnSort = document.querySelectorAll(".stsh_sort");
			for (var i = 0; i < elesBtnSort.length; i++)
			{
				elesBtnSort[i].addEventListener("click", function(ev)
				{
					var mode = parseInt(ev.target.dataset.sort) || 0;
					
					activeSort = mode;
					sortKey(activeSort);
				});
			}

			var setVisibleKey = function(startKey, visible)
			{
				// Use ("", true) to show all
				
				startKey = startKey.toLowerCase();
				var display = visible !== true ? "none" : "";
				var eleKeys = document.querySelectorAll
				(" \
					#keylist > table:nth-child(1) \
					> tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) \
					> table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) \
				");
				for (var i = 0; i < eleKeys.length; i++)
				{
					try
					{
						if (eleKeys[i].textContent.trim().toLowerCase().indexOf(startKey) > -1)
						{
							var eleTarget = eleKeys[i].parentElement.parentElement.parentElement
								.parentElement.parentElement.parentElement;
							if (visible && eleTarget.classList.contains("stsh_hidden"))
							{
								eleTarget.classList.remove("stsh_hidden");
							}
							else if (!visible && !eleTarget.classList.contains("stsh_hidden"))
							{
								eleTarget.classList.add("stsh_hidden");
							}
						}
					}
					catch (ex)
					{
						console.error("setVisibleKey", ex.message);
					}
				}
			}
			
			var hideKey = function(mode)
			{
				/*
					mode:
						-1: showAll
						0: app
						1: game
						2: faq
						3: support
						4: promo
						5: email
				*/
				
				if (mode === -1)		// showAll
				{
					setVisibleKey("", true);
				}
				else if (mode === 0)	// app
				{
					setVisibleKey("# storefront_english_apps.txt #", false);
					setVisibleKey("# storefront_english_main.txt # #app_", false);
					setVisibleKey("# community_english.txt # SharedFiles_App_", false);
					setVisibleKey("# appmgmt_english.txt #", false);
					setVisibleKey("STEAM/VR", false);
				}
				else if (mode === 1)	// game
				{
					setVisibleKey("GAMES/", false);
					setVisibleKey("TF_", false);
				}
				else if (mode === 2)	// faq
				{
					setVisibleKey("# support_faq_english.txt #", false);
				}
				else if (mode === 3)	// support
				{
					setVisibleKey("# supportui_english.txt #", false);
					setVisibleKey("# help_english.txt #", false);
				}
				else if (mode === 4)	// promo
				{
					setVisibleKey("#promo", false);
					setVisibleKey("#hardware", false);
					setVisibleKey("ControllerBinding", false);
					setVisibleKey("Library_Controller", false);
					setVisibleKey("STEAM/HARDWARE", false);
					setVisibleKey("STEAM/DELTA", false);
					setVisibleKey("GAMES/KILLINGFLOOR2", false);
				}
				else if (mode === 5)	// email
				{
					setVisibleKey("#email", false);
				}
			}
			
			var elesBtnShowingKey = document.querySelectorAll(".stsh_showing_key");
			for (var i = 0; i < elesBtnShowingKey.length; i++)
			{
				elesBtnShowingKey[i].addEventListener("click", function(ev)
				{
					var mode = parseInt(ev.target.dataset.hidekey) || 0;
					
					activeHideKey[mode] = 1;
					hideKey(mode);
					
					ev.target.disabled = true;
				});
			}
			
			var hideStr = function(mode)
			{
				/*
					mode:
						0: notMatch
						1: long
				*/
				
				if (mode === 0)			// notMatch
				{
					var searchStr = decodeURIComponent(getQueryByName("search_input")).replace(/\\+/g," ").trim();
					searchStr = searchStr.toLowerCase();
					
					var eleStrs = document.querySelectorAll
					(" \
						#keylist \
						> table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) \
						> table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) \
					");
					for (var i = 0; i < eleStrs.length; i++)
					{
						try
						{
							var valStr = eleStrs[i].children[0].textContent.trim().toLowerCase();
							var valTrn = eleStrs[i].children[2].textContent.trim().toLowerCase();
							if (valStr !== searchStr && valTrn !== searchStr)
							{
								var eleTarget = eleStrs[i].parentElement.parentElement
									.parentElement.parentElement.parentElement;
								if (!eleTarget.classList.contains("stsh_hidden"))
								{
									eleTarget.classList.add("stsh_hidden");
								}
							}
						}
						catch (ex)
						{
							console.error("hideStrNotMatch", ex.message);
						}
					}
				}
				else if (mode === 1)	// long
				{
					var dot = "...";
					var dotLengthMinus = 0 - dot.length;
					
					var eleStrs = document.querySelectorAll
					(" \
						#keylist \
						> table:nth-child(1) > tbody:nth-child(1) > tr > td:nth-child(1) > div:nth-child(1) \
						> table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(1) \
					");
					for (var i = 0; i < eleStrs.length; i++)
					{
						try
						{
							var valStr = eleStrs[i].textContent.trim();
							if (valStr.substr(dotLengthMinus) === dot)
							{
								var eleTarget = eleStrs[i].parentElement.parentElement
									.parentElement.parentElement.parentElement.parentElement;
								if (!eleTarget.classList.contains("stsh_hidden"))
								{
									eleTarget.classList.add("stsh_hidden");
								}
							}
						}
						catch (ex)
						{
							console.error("hideStrLong", ex.message);
						}
					}
				}
			}
			
			var elesBtnShowingStr = document.querySelectorAll(".stsh_showing_str");
			for (var i = 0; i < elesBtnShowingStr.length; i++)
			{
				elesBtnShowingStr[i].addEventListener("click", function(ev)
				{
					var mode = parseInt(ev.target.dataset.hidestr) || 0;
					
					activeHideStr[mode] = 1;
					hideStr(mode);
					
					ev.target.disabled = true;
				});
			}
			
		} // End Hide & sort suggestions

		resizeSuggestionBox();
	
		// Add Frame button when iframe load failed
		{
			var obTarget_ifrm = document.querySelector("#suggestions_iframe");
			if (obTarget_ifrm)
			{
				var obMu_ifrm = new MutationObserver(function(mutations) 
				{
					mutations.forEach(function(mutation) 
					{
						var divFrame = document.querySelector("#stsh_frame");
						if (!divFrame)
						{
							var divOuter = document.querySelector("#suggestions_box_outer");
							if (divOuter)
							{
								divFrame = document.createElement("div");
								divFrame.id = "stsh_frame";
								divOuter.appendChild(divFrame);
							}
						}
						if (divFrame)
						{
							var ifrm = document.querySelector("#suggestions_iframe");
							if (ifrm)
							{
								var src = ifrm.getAttribute("src");
								var token = getQueryByName("token_key", src);
								
								divFrame.innerHTML = 
' \
<br><br> \
<div id="stsh_frame_sub"> \
	Token: <span class="stsh_blue">' + token + '</span> \
	<br><br> \
	<a class="stsh_a_button" target="_blank" href="' + src + '">Frame</a> \
	<br><br> \
	This frame may be blocked by ad blocker software. \
	<br> \
	Please whitelist https://translation.steampowered.com to prevent this missing frame. \
</div> \
';
							}
						}
					});
				});

				var obConfig_ifrm = { attributes: true, attributeFilter: ["src"] };
				obMu_ifrm.observe(obTarget_ifrm, obConfig_ifrm);
			}
		}
		
		// Open frame if only one string
		{
			setTimeoutCustom(function()
			{
				var elesCopy = document.querySelectorAll("#keylist .copysmall");
				if (elesCopy.length === 1)
				{
					var eleDiv = elesCopy[0].parentElement.parentElement.parentElement;
					
					if (eleDiv.tagName === "DIV")
					{
						if (!isVisible())
						{
							eleDiv.click();
						}
					}
				}
			}, timingInit.openFrame);
		}
		
		// Fix STS search options
		{
			for (var i = 0; i < 6; i++)
			{
				var elesSort = document.querySelectorAll("#search #sort" + i);
				if (elesSort.length === 2)
				{
					elesSort[1].id = "status" + i;
				}
			}
			
			var elesLabel = document.querySelectorAll("#search label[for='sort0']");
			if (elesLabel.length === 2)
			{
				elesLabel[1].setAttribute("for", "status0");
			}
			
			var eleLabelEntire = document.querySelector("label[for='keys']");
			if (eleLabelEntire && eleLabelEntire.textContent.trim() === "ENTIRE DB")
			{
				eleLabelEntire.setAttribute("for", "all");
			}
		}
		
		// Add date navigation
		{
			var eleInput = document.querySelector("input#search_input");
			if (eleInput)
			{
				var date = "";
				
				var valInput = eleInput.value.trim();
				if (valInput.indexOf("DATE: ") === 0)
				{
					date = valInput.replace("DATE: ", "");
				}
				
				var eleBtn = document.querySelector("button#search_input");
				if (eleBtn)
				{
					if (!date)
					{
						if (eleBtn.value.indexOf("DATE: ") === 0)
						{
							date = eleBtn.value.replace("DATE: ", "");
						}
					}
					
					if (date)
					{
						eleBtn.classList.add("stsh_date_cur");
						eleBtn.title = eleBtn.value.replace("DATE: ", "");
						eleBtn.textContent = "TODAY";
						eleBtn.removeAttribute("id");
						eleBtn.removeAttribute("name");
							
						var eleDiv = document.createElement("div");
						eleDiv.classList.add("stsh_date_group");
						
						if (eleBtn.previousSibling.nodeType === document.TEXT_NODE)
						{
							// Remove all &nbsp;
							removeElement(eleBtn.previousSibling);
						}
						
						insertAfterElement(eleDiv, eleBtn.previousElementSibling);
						eleDiv.appendChild(eleBtn);
						
						// Calc prev and next date
						{
							var ts = getUnixTimestamp(date);
							var sDay = 86400;
							
							var datePrev = getDateGmt(ts - sDay);
							var dateNext = getDateGmt(ts + sDay);
							
							var eleBtnLeft = document.createElement("button");
							eleBtnLeft.classList.add("stsh_date_prev");
							eleBtnLeft.setAttribute("type", "submit");
							eleBtnLeft.value = "DATE: " + datePrev;
							eleBtnLeft.title = datePrev;
							eleBtnLeft.textContent = "<<";
							
							insertBeforeElement(eleBtnLeft, eleBtn);
							
							var eleBtnRight = document.createElement("button");
							eleBtnRight.classList.add("stsh_date_next");
							eleBtnRight.setAttribute("type", "submit");
							eleBtnRight.value = "DATE: " + dateNext;
							eleBtnRight.title = dateNext;
							eleBtnRight.textContent = ">>";
							
							insertAfterElement(eleBtnRight, eleBtn);
							
							var applyInputDate = function(ev)
							{
								var eleTarget = ev.target;
								var eleInput = document.querySelector("input#search_input");
								if (eleInput)
								{
									eleInput.value = eleTarget.value;
								}
							};
							
							eleBtn.addEventListener("click", applyInputDate);
							eleBtnLeft.addEventListener("click", applyInputDate);
							eleBtnRight.addEventListener("click", applyInputDate);
						}
					}
				}
			}
		}
		
		// Add shortcut keys for pagination
		var bindPagination = function()
		{
			var elesPrev = document.querySelectorAll(".pagination > a:first-child");
			if (elesPrev.length === 2)
			{
				elesPrev[0].textContent = "Prev";
				elesPrev[1].textContent = "Prev";
				addKeyCtrl(document, elesPrev[0], ["BracketLeft", 219], "[", 2|8);			// [
				disableAfterClick(elesPrev[0]);
			}
			
			var elesNext = document.querySelectorAll(".pagination > a:last-child");
			if (elesNext.length === 2)
			{
				elesNext[0].textContent = "Next";
				elesNext[1].textContent = "Next";
				addKeyCtrl(document, elesNext[0], ["BracketRight", 221, 171], "]", 2|8);	// ]
				disableAfterClick(elesNext[0]);
			}
		};
		bindPagination();
		
		// Clean pagination urls
		var cleanPagination = function()
		{
			var elesPage = document.querySelectorAll(".pagination > a");
			cleanUrlTimestamp(elesPage);
		};
		cleanPagination();
		
		// Bind observer for keyList
		{
			var obTarget_keyList = document.querySelector("#keylist_container");
			if (obTarget_keyList)
			{
				var tmOb_keyList = -1;
				var obMu_keyList = new MutationObserver(function(mutations)
				{
					mutations.forEach(function(mutation)
					{
						if ((mutation.type !== "attributes"
							|| mutation.target.tagName === "TR")
								&& mutation.target.tagName !== "A")
						{
							clearTimeout(tmOb_keyList);
							tmOb_keyList = setTimeoutCustom(function(mutation)
							{
								countShowing();
								addLineCounter();
								bindPagination();
								cleanPagination();
								
								//console.log("keyList: " + tmOb_keyList);
							}, timingInit.bindObserverKeyList, mutation);
						}
					});
				});
				
				var obConfig_keyList = { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] };
				obMu_keyList.observe(obTarget_keyList, obConfig_keyList);
			}
		}
	
	} // End translate.php

	if (url.indexOf("user_activity.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_userActivity");
		
		setTimeoutCustom(function() 
	{
		var isMyProfile = false;
		
		// Resolve mixed content
		{
			var hostTag = 
			[
				["img", "src"],
				["img", "src"],
				["img", "src"],
				["a", "href"],
				["a", "href"],
			];
			
			var hostOld = 
			[
				"http://cdn.akamai.steamstatic.com/", 
				"http://media.steampowered.com/",
				"http://cdn.edgecast.steamstatic.com/",
				"http://steamcommunity.com/",
				"http://translation.steampowered.com",
			];
			
			var hostReplace = 
			[
				"https://steamcdn-a.akamaihd.net/",
				"https://steamcdn-a.akamaihd.net/",
				"https://steamcdn-a.akamaihd.net/",
				"https://steamcommunity.com/",
				"https://translation.steampowered.com",
			];
			
			for (var j = 0; j < hostOld.length; j++)
			{
				var eles = document.querySelectorAll(hostTag[j][0] + "[" + hostTag[j][1] + "^='" + hostOld[j] + "']");
				for (var i = 0; i < eles.length; i++)
				{
					eles[i].setAttribute(hostTag[j][1]
						, eles[i].getAttribute(hostTag[j][1]).replace(hostOld[j], hostReplace[j]));
				}
			}
		}
		
		// Check current profile is my profile or not
		{
			if (userId)
			{
				var userPage = getQueryByName("user", url);
				if (userId === userPage)
				{
					isMyProfile = true;
				}
			}
			
			if (!isMyProfile)
			{
				var eleASug = document.querySelector(".friend_block_avatar > a[href*='//translation.steampowered.com/translate.php'");
				if (eleASug && eleASug.textContent.trim() === "YOUR SUGGESTIONS")
				{
					isMyProfile = true;
				}
			}
			
			if (!isMyProfile)
			{
				if (document.querySelector("#moderator_announcement"))
				{
					isMyProfile = true;
				}
			}
		}
		
		var user = "";
		var eleAvatar = document.querySelector(".friend_block_avatar > a[href^='https://steamcommunity.com']");
		if (eleAvatar)
		{			
			if (eleAvatar.href.indexOf("https://steamcommunity.com/profiles/") === 0)
			{
				user = eleAvatar.href.replace("https://steamcommunity.com/profiles/", "");
			}
			
			var name = eleAvatar.firstElementChild.getAttribute("title");
			if (name === "")
			{
				name = user;
			}
			
			document.title = name + " - " + document.title;
		}

		var stsh_activityAddLink_start = getTimeMs();
		var stsh_activityAddLink_itv = setIntervalCustom(function(user)
		{
			// Add more links in user activity
			
			var stsh_activityAddLink_isEnd = false;
			var stsh_activityAddLink_cur = getTimeMs();
	
			var h3s = document.querySelectorAll("#leftAreaContainer h3");
			if (h3s.length === 2)
			{
				var td = h3s[1].parentElement;
				var matchArr = td.innerHTML.match(/<\/h3>.+<br>/i);
				if (matchArr)
				{
					var name = matchArr[0]
						.replace("</h3>-", "")
						.replace("-<br>", "")
						.replace("<br>", "")
						.trim();
						
					if (name === "")
					{
						name = user;
					}
					if (name === "")
					{
						name = "Steam";
					}
					
					var tagNew = "";
					if (user === "")
					{
						tagNew = 
"\
</h3>\
<a id='stsh_sectionId' class='stsh_blue' target='_blank' href='https://steamcommunity.com/my'>\
" + name + "</a>, \
<a class='stsh_green' target='_blank' href='/WhereIsEsty.php'>Esty</a><br><br>\
";
					}
					else
					{
						tagNew = 
"\
</h3>\
<a id='stsh_sectionId' class='stsh_blue' target='_blank' href='https://steamcommunity.com/profiles/" + user + "'>\
" + name + "</a>, \
<a class='stsh_green' target='_blank' href='/WhereIsEsty.php?collectionof=" + user + "'>Esty</a>\
"
							/*
							// Typonion
							+ ", <a class='stsh_green' target='_blank' href='/translate.php?user="
							+ user + "&onionhunter=1&liststatus=1'>Onion</a>
							*/
							+ " <br><br> ";
					}
					
					td.innerHTML = td.innerHTML.replace(/<\/h3>.+<br>/i, tagNew);
					
					stsh_activityAddLink_isEnd = true;
				}
				
				if (stsh_activityAddLink_isEnd || stsh_activityAddLink_cur - stsh_activityAddLink_start > 10000)
				{
					clearInterval(stsh_activityAddLink_itv);
				}
			}
		}, 300, user);
		
		var countWord = "";
		var countSugg = "";
		
		var inputDials = document.querySelectorAll("#leftAreaContainer input.dial");
		if (inputDials.length === 2)
		{
			countWord = inputDials[0].getAttribute("title").replace("words", "").trim();
			countSugg = inputDials[1].getAttribute("title").replace("suggestions", "").trim();
		}
		
		var tdCount = document.querySelector("#leftAreaContainer td[align='left']");
		if (tdCount)
		{
			tdCount.innerHTML = 
'\
<div class="stsh_profile_count stsh_profile_count_word">Word: ' + countWord + '</div> \
<div class="stsh_profile_count stsh_profile_count_sugg">Suggestion: ' + countSugg + '</div>\
';
		}
		
		var sug = document.body.textContent;
	
		var regComment = /VIEW COMMENT/g;
		var regSuggest = /VIEW SUGGESTION/g;
	
		var strComment = "...RECEIVED A MODERATOR COMMENT";
		var strPending = "...ARE PENDING";
		var strApproved = "...WERE APPROVED";
		var strDeclined = "...WERE DECLINED";
		var strApplied = "...HAVE BEEN APPLIED WITHIN THE LAST 14 DAYS";
		var strRemoved = "...HAVE BEEN REMOVED WITHIN THE LAST 14 DAYS";
	
		var startComment = sug.indexOf(strComment);
		var startPending = sug.indexOf(strPending);
		var startApproved = sug.indexOf(strApproved);
		var startDeclined = sug.indexOf(strDeclined);
		var startApplied = sug.indexOf(strApplied);
		var startRemoved = sug.indexOf(strRemoved);
	
		var sugComment = sug.substring(startComment,startPending);
		var sugPending = sug.substring(startPending,startApproved);
		var sugApproved = sug.substring(startApproved,startDeclined);
		var sugDeclined = sug.substring(startDeclined,startApplied);
		var sugApplied = sug.substring(startApplied,startRemoved);
		var sugRemoved = sug.substring(startRemoved);
	
		var countComment = (sugComment.match(regComment) || []).length;
		var countPending = (sugPending.match(regSuggest) || []).length;
		var countApproved = (sugApproved.match(regSuggest) || []).length;
		var countDeclined = (sugDeclined.match(regSuggest) || []).length;
		var countApplied = (sugApplied.match(regSuggest) || []).length;
		var countRemoved = (sugRemoved.match(regSuggest) || []).length;
	
		var divBtn = document.createElement("div");
		document.body.appendChild(divBtn);
		divBtn.innerHTML = 
' \
<div class="stsh_menu_group"> \
	&nbsp; <input id="stsh_btnToProgress" value="To Progress" class="stsh_btn_long" type="button" \
		onclick="scrollToId(\'stsh_sectionId\', -50); return false;" /><br> \
	 \
	&nbsp; <span class="stsh_scroll_header">Scroll To</span>\
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_comment"><input value="Comment (' + countComment + ')"  \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionComment\'); return false;" ></li> \
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_pending"><input value="Pending (' + countPending + ')" \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionPending\'); return false;" ></li> \
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_approved"><input value="Approved (' + countApproved + ')" \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionApproved\'); return false;" ></li> \
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_declined"><input value="Declined (' + countDeclined + ')" \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionDeclined\'); return false;" ></li> \
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_applied"><input value="Applied (' + countApplied + ')" \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionApplied\'); return false;" ></li> \
	<li class="stsh_suggestion_btn stsh_suggestion stsh_suggestion_removed"><input value="Removed (' + countRemoved + ')" \
		class="stsh_btn_long" type="button" onclick="scrollToId(\'stsh_sectionRemoved\'); return false;" ></li> \
	<br> \
	&nbsp; <input id="stsh_btnHideSuggestion" value="Suggestions" class="stsh_btn_long" type="button" \
		onclick="return false;" title="Toggle hidden/shown suggestion list" /><br> \
	<br> \
	&nbsp; <input value="Refresh" class="stsh_btn_long" type="button" onclick="window.location = window.location.href; return false;" /> \
	<br> \
</div> \
';

		var divContainer = document.querySelector("#leftAreaContainer");
		if (divContainer)
		{
			var inner = divContainer.innerHTML;
			
			var htmlPending = /\.\.\.ARE \<a [^\<]+\>PENDING\<\/a\>/i.exec(inner);
			var htmlApproved = /\.\.\.WERE \<a [^\<]+\>APPROVED\<\/a\>/i.exec(inner);
			var htmlDeclined = /\.\.\.WERE \<a [^\<]+\>DECLINED\<\/a\>/i.exec(inner);
			
			if (htmlPending && htmlApproved && htmlDeclined)
			{
				divContainer.innerHTML = inner
					.replace("...RECEIVED A MODERATOR COMMENT",
						"<span id='stsh_sectionComment' class='stsh_suggestion_header'>"
						+ "...RECEIVED A MODERATOR COMMENT ("
						+ countComment + ")</span>")
					.replace(htmlPending,
						"<span id='stsh_sectionPending' class='stsh_suggestion_header'>" + htmlPending + " ("
						+ countPending + ")</span>")
					.replace(htmlApproved,
						"<span id='stsh_sectionApproved' class='stsh_suggestion_header'>" + htmlApproved + " ("
						+ countApproved + ")</span>")
					.replace(htmlDeclined,
						"<span id='stsh_sectionDeclined' class='stsh_suggestion_header'>" + htmlDeclined + " ("
						+ countDeclined + ")</span>")
					.replace("...HAVE BEEN APPLIED WITHIN THE LAST 14 DAYS",
						"<span id='stsh_sectionApplied' class='stsh_suggestion_header'>"
						+ "...HAVE BEEN APPLIED WITHIN THE LAST 14 DAYS ("
						+ countApplied + ")</span>")
					.replace("...HAVE BEEN REMOVED WITHIN THE LAST 14 DAYS",
						"<span id='stsh_sectionRemoved' class='stsh_suggestion_header'>"
						+ "...HAVE BEEN REMOVED WITHIN THE LAST 14 DAYS ("
						+ countRemoved + ")</span>");
			}
		}
		
		if (document.querySelector("#hours"))
		{
			var eleBtn = document.querySelector("#stsh_btnToProgress");
			if (eleBtn)
			{
				var ele = document.createElement("input");
				ele.classList.add("stsh_btn_long");
				ele.setAttribute("value", "To Hours");
				ele.setAttribute("type", "button");
				ele.setAttribute("onclick", "scrollToElement(\"input[name*='[remarks]']\", -48); return false;");
				insertAfterElement(ele, eleBtn);
				
				ele = document.createTextNode(" \u00A0 ");
				insertAfterElement(ele, eleBtn);
				
				ele = document.createElement("br");
				insertAfterElement(ele, eleBtn);
			}
		}
		
		var cans = document.querySelectorAll("canvas");
		for (var i = 0; i < cans.length; i++)
		{
			removeElement(cans[i]);
		}
		
		/* // Unknown reason
		var aKeys = document.querySelectorAll("#leftAreaContainer li > a:nth-child(1)");
		for (var i = 0; i < aKeys.length; i++)
		{
			var key = aKeys[i].textContent;
			var keyArr = key.substr(21).trim().split(" >> ");
			keyArr[0] = "<span style='color: #FFF !important;'>" + keyArr[0] + "</span>";
			var keyNew = key.substr(0,21) + keyArr.join(" >> ") + "";
			aKeys[i].innerHTML = keyNew;
		}
		*/
	
		var sugModeComment = 0;
		var sugModePending = 1;
		var sugModeApproved = 2;
		var sugModeDeclined = 3;
		var sugModeApplied = 4;
		var sugModeRemoved = 5;
		
		var sugMode = sugModeComment;
		
		var eleSugFirst = document.querySelector
		(" \
			#leftAreaContainer > a[href^='translate.php?search_input='] \
			, #leftAreaContainer > form > a[href^='translate.php?search_input='] \
		");
		if (eleSugFirst)
		{
			var eleSugHeadPrev = eleSugFirst.previousElementSibling.previousElementSibling;
			if (eleSugHeadPrev.id === "stsh_sectionRemoved")
			{
				sugMode = sugModeRemoved;
			}
			else if (eleSugHeadPrev.id === "stsh_sectionApplied")
			{
				sugMode = sugModeApplied;
			}
			else if (eleSugHeadPrev.id === "stsh_sectionDeclined")
			{
				sugMode = sugModeDeclined;
			}
			else if (eleSugHeadPrev.id === "stsh_sectionApproved")
			{
				sugMode = sugModeApproved;
			}
			else if (eleSugHeadPrev.id === "stsh_sectionPending")
			{
				sugMode = sugModePending;
			}
			
			var eleSugNext = eleSugFirst;
			while (eleSugNext)
			{
				if (eleSugNext.tagName === "A")
				{
					var attrHref = eleSugNext.getAttribute("href");
					if (attrHref && attrHref.indexOf("translate.php?search_input=") === 0)
					{
						eleSugNext.classList.add("stsh_suggestion");
						
						if (sugMode === sugModeComment)
						{
							eleSugNext.classList.add("stsh_suggestion_comment");
						}
						else if (sugMode === sugModePending)
						{
							eleSugNext.classList.add("stsh_suggestion_pending");
						}
						else if (sugMode === sugModeApproved)
						{
							eleSugNext.classList.add("stsh_suggestion_approved");
						}
						else if (sugMode === sugModeDeclined)
						{
							eleSugNext.classList.add("stsh_suggestion_declined");
						}
						else if (sugMode === sugModeApplied)
						{
							eleSugNext.classList.add("stsh_suggestion_applied");
						}
						else if (sugMode === sugModeRemoved)
						{
							eleSugNext.classList.add("stsh_suggestion_removed");
						}
					}
				}
				else if (eleSugNext.tagName === "SPAN" && eleSugNext.classList.contains("stsh_suggestion_header"))
				{
					if (eleSugNext.id === "stsh_sectionRemoved")
					{
						sugMode = sugModeRemoved;
					}
					else if (eleSugNext.id === "stsh_sectionApplied")
					{
						sugMode = sugModeApplied;
					}
					else if (eleSugNext.id === "stsh_sectionDeclined")
					{
						sugMode = sugModeDeclined;
					}
					else if (eleSugNext.id === "stsh_sectionApproved")
					{
						sugMode = sugModeApproved;
					}
					else if (eleSugNext.id === "stsh_sectionPending")
					{
						sugMode = sugModePending;
					}
				}
				
				eleSugNext = eleSugNext.nextElementSibling;
			}
			
		}
		
		// Change language & correct url
		{
			var aProgresses = document.querySelectorAll("div > .friend_block_avatar a[onmouseout]");
			for (var i = 0; i < aProgresses.length; i++)
			{
				var langCur = getQueryByName("lang", aProgresses[i].href);
				if (langCur === "")
				{
					aProgresses[i].href = aProgresses[i].href + lang;
				}
				else
				{
					if (langCur !== lang)
					{
						//var langQuery = (url.indexOf("?") > -1) ? "&lang=" : "?lang=";
						//window.location = url + langQuery + langCur;
						console.log("Lang: " + langCur);
					}
				}
				
				var aContent = aProgresses[i].textContent.trim();
				if (aContent.indexOf("SUGGESTIONS") > -1)
				{
					aProgresses[i].href = aProgresses[i].href + "&listsort=5&liststatus=1&paginationrows=1000";
				}
				else if (aContent.indexOf("REVIEWS") > -1)
				{
					aProgresses[i].href = aProgresses[i].href + "&listsort=5&liststatus=3&paginationrows=1000";
				}
			}
		}
		
		// Hours
		if (document.querySelector("#hours"))
		{
			var calculateHours = function()
			{
				var rgxDate = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
				var rgxTime = /^(\d{1,2}:\d{2}(:\d{2})?|\d{1,2}\.\d{2})$/;
				
				var eleFrom = document.querySelector("#stsh_hoursCalc_from");
				var eleTo = document.querySelector("#stsh_hoursCalc_to");
				var eleRes = document.querySelector("#stsh_hoursCalc_result");
				
				if (eleFrom && eleTo && eleRes)
				{
					var rawFrom = eleFrom.value.trim();
					var rawTo = eleTo.value.trim();
					
					var valFrom = 0;
					var valTo = 0;
					
					if (rgxDate.test(rawFrom))
					{
						rawFrom = rawFrom.substr(11);
					}
					if (rgxTime.test(rawFrom))
					{
						var arrTime = rawFrom.split(":");
						if (arrTime.length === 1)
						{
							arrTime = rawFrom.split(".");
						}
						valFrom = parseInt(arrTime[1]) + (parseInt(arrTime[0]) * 60);
					}
					
					if (rgxDate.test(rawTo))
					{
						rawTo = rawTo.substr(11);
					}
					if (rgxTime.test(rawTo))
					{
						var arrTime = rawTo.split(":");
						if (arrTime.length === 1)
						{
							arrTime = rawTo.split(".");
						}
						valTo = parseInt(arrTime[1]) + (parseInt(arrTime[0]) * 60);
					}
					
					var valDiff = Math.abs(valTo - valFrom);
					
					var valHr = parseInt(valDiff / 60);
					var valMn = valDiff % 60;
					
					eleRes.textContent = padZero(valHr, 2) + ":" + padZero(valMn, 2);
				}
			}
			
			var curDateStr = getDateUs();
			
			// Add hours calculator
			{
				var eleFinalize = document.querySelector("#hours input[name='Finalize']");
				if (eleFinalize)
				{
					var eleFinalizeParent = eleFinalize.parentElement;
					eleFinalizeParent.setAttribute("colspan", "2");
					eleFinalizeParent.style.verticalAlign = "top";
					
					var elePad = document.createElement("td");
					insertBeforeElement(elePad, eleFinalizeParent);
					
					var eleCalc = document.createElement("td");
					eleCalc.classList.add("stsh_hoursCalc");
					
					insertBeforeElement(eleCalc, eleFinalizeParent);
										
					if (eleCalc.parentElement.previousElementSibling.querySelector("input[type='radio']"))
					{
						eleCalc.appendChild(document.createElement("br"));
					}
					
					var ele = document.createElement("b");
					ele.textContent = " Hours Calculator (Estimated) ";
					eleCalc.appendChild(ele);
					
					eleCalc.appendChild(document.createElement("br"));
					
					ele = document.createElement("span");
					ele.innerHTML = 
' \
Enter date or time to calculate range (calculate only hours and minutes). \
<br>You can enter date "2016-01-01 08:05:00" or time "8:05" or time "8.05".\
';
					ele.setAttribute("style", "display: inline-block; padding-bottom: 4px;");
					eleCalc.appendChild(ele);
					
					eleCalc.appendChild(document.createElement("br"));
					
					ele = document.createElement("span");
					ele.textContent = " From: ";
					eleCalc.appendChild(ele);
					
					ele = document.createElement("input");
					ele.id = "stsh_hoursCalc_from";
					ele.setAttribute("type", "text");
					ele.setAttribute("onkeypress", "return event.keyCode !== 13;");
					ele.setAttribute("autocomplete", "off");
					ele.addEventListener("keyup", function()
					{
						calculateHours();
					});
					eleCalc.appendChild(ele);
					
					ele = document.createElement("span");
					ele.innerHTML = "&nbsp;&nbsp; To: ";
					eleCalc.appendChild(ele);
					
					ele = document.createElement("input");
					ele.id = "stsh_hoursCalc_to";
					ele.setAttribute("type", "text");
					ele.setAttribute("onkeypress", "return event.keyCode !== 13;");
					ele.setAttribute("autocomplete", "off");
					ele.addEventListener("keyup", function()
					{
						calculateHours();
					});
					eleCalc.appendChild(ele);
					
					ele = document.createElement("input");
					ele.id = "stsh_hoursCalc_toNow";
					ele.setAttribute("type", "button");
					ele.setAttribute("value", "Now");
					ele.setAttribute("onclick", "return false;");
					ele.addEventListener("click", function()
					{
						var eleTo = document.querySelector("#stsh_hoursCalc_to");
						eleTo.value = getTimeUs();
						calculateHours();
					});
					eleCalc.appendChild(ele);
										
					ele = document.createElement("span");
					ele.innerHTML = "&nbsp;&nbsp; Result: ";
					eleCalc.appendChild(ele);
					
					ele = document.createElement("b");
					ele.id = "stsh_hoursCalc_result"
					ele.textContent = " 00:00 ";
					eleCalc.appendChild(ele);
				}
			}
			
			// Hilight current date
			{
				
				var elesTd = document.querySelectorAll("#hours > table > tbody > tr > td:nth-child(1)");
				for (var i = 0; i < elesTd.length; i++)
				{
					if (elesTd[i].textContent.indexOf(curDateStr) > -1)
					{
						elesTd[i].parentElement.id = "stsh_hours_curDate";
						elesTd[i].parentElement.classList.add("stsh_hours_curDate");
						
						break;
					}
				}
			}
			
			// Auto calculate hours in current date
			{
				var timePendingFirst = "";
				var timePendingLast = "";
				
				var elesPending = document.querySelectorAll("#mainbody .stsh_suggestion_pending");
				for (var i = 0; i < elesPending.length; i++)
				{
					var content = elesPending[i].textContent.trim().substr(0, 19);
					if (content.substr(0, 10) === curDateStr)
					{
						timePendingFirst = content.substr(11, 5);
						if (timePendingLast === "")
						{
							timePendingLast = timePendingFirst;
						}
					}
					else
					{
						break;
					}
				}
				
				var timeApprovedFirst = "";
				var timeApprovedLast = "";
				
				var elesApproved = document.querySelectorAll("#mainbody .stsh_suggestion_approved");
				for (var i = 0; i < elesApproved.length; i++)
				{
					var content = elesApproved[i].textContent.trim().substr(0, 19);
					if (content.substr(0, 10) === curDateStr)
					{
						timeApprovedFirst = content.substr(11, 5);
						if (timeApprovedLast === "")
						{
							timeApprovedLast = timeApprovedFirst;
						}
					}
					else
					{
						break;
					}
				}
				
				if (timePendingFirst === "")
				{
					timePendingFirst = timeApprovedFirst;
				}
				if (timeApprovedFirst === "")
				{
					timeApprovedFirst = timePendingFirst;
				}
				if (timePendingLast === "")
				{
					timePendingLast = timeApprovedLast;
				}
				if (timeApprovedLast === "")
				{
					timeApprovedLast = timePendingLast;
				}
				
				var timeFirst = timeApprovedFirst < timePendingFirst ? timeApprovedFirst : timePendingFirst;
				var timeLast = timeApprovedLast > timePendingLast ? timeApprovedLast : timePendingLast;
				
				if (timeFirst !== "")
				{
					var eleFrom = document.querySelector("#stsh_hoursCalc_from");
					if (eleFrom)
					{
						eleFrom.value = timeFirst;
					}
					var eleTo = document.querySelector("#stsh_hoursCalc_to");
					if (eleTo)
					{
						eleTo.value = timeLast;
					}
					
					calculateHours();
				}
			}
			
			// Make minutes add to hours
			setTimeoutCustom(function()
			{
				var elesMn = document.querySelectorAll("#hours input[name*='[minutes]']");
				for (var i = 0; i < elesMn.length; i++)
				{
					elesMn[i].setAttribute("min", "-15");
					elesMn[i].setAttribute("max", "60");
					elesMn[i].addEventListener("change", function(ev)
					{
						var eleMn = ev.target;
						var eleHr = eleMn.parentElement.previousElementSibling.firstElementChild;
						var valMn = parseInt(eleMn.value) || 0;
						var valHr = parseInt(eleHr.value) || 0;
						
						if (valMn < 0)
						{
							if (valHr > 0)
							{
								eleHr.value = valHr - 1;
								eleMn.value = 45;
							}
							else
							{
								eleMn.value = 0;
							}
						}
						else if (valMn > 59)
						{
							if (valHr < 23)
							{
								eleHr.value = valHr + 1;
								eleMn.value = 0;
							}
							else
							{
								eleMn.value = 45;
							}
						}
					});
				}
			}, 500);
			
			// Make deferred can be clicked
			{
				var eleDeferred = document.querySelector("#hours td > i > span[title^='DATE']");
				if (eleDeferred)
				{
					eleDeferred.dataset.title = eleDeferred.title;
					eleDeferred.title = "Click to reveal";
					
					eleDeferred.addEventListener("click", function(ev)
					{
						var ele = ev.target;
						
						var eleDetail = document.querySelector(".stsh_deferred");
						if (!eleDetail)
						{
							eleDetail = document.createElement("div");
							eleDetail.classList.add("stsh_deferred");
							ele.parentElement.parentElement
								.parentElement.parentElement
								.lastElementChild.firstElementChild
								.appendChild(eleDetail);
						}
						
						var space = String.fromCharCode(160);
						var space3 = space + space + space;
						eleDetail.innerHTML = "<br>TOTAL DEFERRED HOURS" + space3 + " <br>" 
							+ ele.dataset.title.substr(61).trim()
								.replace(/\n/g, space3 + " <br>")
							+ space3;
					});
				}
			}
			
			// Hide past date
			{
				var hidePast = function ()
				{
					var isHidden = false;
					
					var elesMn = document.querySelectorAll("#hours input[name*='[minutes]']");
					if (elesMn.length > 0)
					{
						if (elesMn[0].name === "date[1969-12-31][minutes]")
						{
							isHidden = true;
						}
					}
					
					if (isHidden)
					{
						for (var i = 1, l = elesMn.length - 1; i < l; i++)
						{
							elesMn[i].parentElement.parentElement.classList.add("stsh_hidden");
						}
					}
				};
				
				setTimeoutCustom(hidePast, 500);
			}
		}
		
		// Hide wallet 
		// Hide email noti
		{			
			if (!isMyProfile)
			{
				var elesAWallet = document.querySelectorAll("a[id^='walletkeys']");
				for (var i = 0; i < elesAWallet.length; i++)
				{
					var eleCur = elesAWallet[i];
					for (var j = 0; j < 5; j++)
					{
						eleCur.classList.add("stsh_hidden");
						eleCur = eleCur.nextElementSibling;
					}
				}
				
				var eleSub = document.querySelector("#subscribe");
				if (eleSub)
				{
					eleSub.classList.add("stsh_hidden");
					eleSub.previousElementSibling.classList.add("stsh_hidden");
					eleSub.previousElementSibling.previousElementSibling.classList.add("stsh_hidden");
					eleSub.nextElementSibling.classList.add("stsh_hidden");
					eleSub.nextElementSibling.nextElementSibling.classList.add("stsh_hidden");
				}
			}
		}
		
		// Set visible suggestion list
		{
			var setVisibleSuggestion = function(visible)
			{
				var display = visible !== true ? "none" : "";
				var eles = document.querySelectorAll(".copy");
				for (var i = 0; i < eles.length; i++)
				{
					if (eles[i].id && eles[i].id.indexOf("showwalletkeys") < 0
						&& eles[i].id !== "abuse_report"
						&& eles[i].id !== "moderator_announcement")
					{
						if (eles[i].style.display !== display)
						{
							eles[i].style.display = display;
						}
					}
				}
			}
			
			var eleHide = document.querySelector("#stsh_btnHideSuggestion");
			if (eleHide)
			{
				var isHide = GM_getValue("profileHideSuggestion", 0);
				if (isHide)
				{
					eleHide.dataset.modeNext = "show";
					eleHide.value = "Suggestions: Hide";
					setVisibleSuggestion(false);
				}
				else
				{
					eleHide.dataset.modeNext = "hide";
					eleHide.value = "Suggestions: Show";
					setVisibleSuggestion(true);
				}
				
				eleHide.addEventListener("click", function(ev)
				{
					var eleHide = ev.target;
					if (eleHide.dataset.modeNext === "show")
					{
						eleHide.dataset.modeNext = "hide";
						eleHide.value = "Suggestions: Show";
						setVisibleSuggestion(true);
						GM_setValue("profileHideSuggestion", 0);
					}
					else
					{
						eleHide.dataset.modeNext = "show";
						eleHide.value = "Suggestions: Hide";
						setVisibleSuggestion(false);
						GM_setValue("profileHideSuggestion", 1);
					}
				});
			}
		}
		
		// Add resolved comment checkbox
		{
			if (isMyProfile)
			{
				var objComment = GM_getValue("profile_comment", 0);
				//console.log(GM_getValue("profile_comment"));
				
				if (!objComment)
				{
					objComment = {};			
				}
				if (!objComment[userId])
				{
					objComment[userId] = {};
				}
				
				var elesSugComment = document.querySelectorAll("#mainbody .stsh_suggestion_comment");
				for (var i = 0; i < elesSugComment.length; i++)
				{
					var eleComment = elesSugComment[i].nextElementSibling.nextElementSibling
						.nextElementSibling.lastElementChild;
					if (eleComment)
					{
						eleComment.classList.add("stsh_suggestion_comment_detail");
						
						var eleInput = document.createElement("input");
						eleInput.classList.add("stsh_comment_resolved");
						eleInput.setAttribute("type", "checkbox");
						eleInput.setAttribute("value", "true");
						
						var eleStrong = document.createElement("strong");
						eleStrong.textContent = "Resolved:";
						
						var eleDate = document.createElement("span");
						eleDate.classList.add("stsh_comment_resolved_date");
						
						var eleLabel = document.createElement("label");
						eleLabel.classList.add("stsh_comment_resolved_label");
						eleLabel.classList.add("stsh_unselectable");
						eleLabel.classList.add("stsh_blue_light");
						eleLabel.classList.add("stsh_cursor_pointer");
						eleLabel.setAttribute("title", "Mark this comment as resolved. "
							+ "\nThis helps you indicated this string was corrected or not.");
							
						eleLabel.appendChild(eleStrong);
						eleLabel.appendChild(document.createTextNode(" "));
						eleLabel.appendChild(eleInput);
						eleLabel.appendChild(document.createTextNode(" "));
						eleLabel.appendChild(eleDate);
						
						insertAfterElement(eleLabel, eleComment);
						
						var comment = eleComment.lastChild.textContent.trim();
						var key = elesSugComment[i].textContent.trim();
						var identifer = key + " ___ " + comment;
						
						eleInput.dataset.stshUser = userId;
						eleInput.dataset.stshIdentifier = identifer;
						
						if (objComment[userId][identifer])
						{
							if (objComment[userId][identifer].resolved === "true")
							{
								eleInput.checked = true;
								eleLabel.lastElementChild.textContent =
									getDateTimeUs(objComment[userId][identifer].time);
							}
						}
						else
						{
							objComment[userId][identifer] = 
							{					
								resolved: "false",
								time: getUnixTimestamp(),
							};
						}
						
						eleInput.addEventListener("click", function (ev)
						{
							var ele = ev.target;
							var userId = ele.dataset.stshUser;
							var identifer = ele.dataset.stshIdentifier;
							
							var objComment = GM_getValue("profile_comment", 0);
							if (!objComment)
							{
								objComment = {};			
							}							
							if (!objComment[userId])
							{
								objComment[userId] = {};
							}
							
							objComment[userId][identifer] = 
							{					
								resolved: ele.checked ? "true" : "false",
								time: getUnixTimestamp(),
							};
							
							GM_setValue("profile_comment", objComment);	
							//console.log(GM_getValue("profile_comment"));
							
							if (ele.checked && ele.nextElementSibling)
							{
								ele.nextElementSibling.textContent = "Now";
							}
						});
					}
				}
				
				// Clean up
				{
					
				}
				
				// Save
				GM_setValue("profile_comment", objComment);
			}
		}
		
		// Check mod status
		{
			if (isMyProfile)
			{
				var isMod = !!document.querySelector("#moderator_announcement");
				
				var userMod = GM_getValue("mod", "");
				if (userId && userId !== userMod)
				{
					GM_setValue("mod", userId);
				}
			}
		}
		
	}, timingInit.pageUserActivity);
	} // End user_activity.php
	
	if (/\/rally[0-9]{0,4}/.test(url))
	{
		document.body && document.body.classList.add("stsh_page_rally");
		
		resizeSuggestionBox();
	
		var outer = document.querySelector("#suggestions_box_outer");
		if (outer)
		{
			outer.setAttribute("onclick", "hideSuggestionsBox();");
		}
		
		// Set cur lang to first
		{
			var first = document.querySelector(".gradienttable tr:nth-child(6)");
			if (first)
			{
				var cur = null;
				
				var tdLangs = document.querySelectorAll(".gradienttable tr > td:nth-child(1)");
				for (var i = 0; i < tdLangs.length; i++)
				{
					if (lang === tdLangs[i].textContent.trim().toLowerCase())
					{
						cur = tdLangs[i].parentElement;
						break;
					}
				}
				
				if (cur)
				{
					cur.classList.add("stsh_curLang");
					first.parentElement.insertBefore(cur, first);
				}
			}
		}
		
		// Change rows per page
		{
			var eleAs = document.querySelectorAll(".gradienttable tr:nth-child(6) a[href^='translate.php?']");
			for (var i = 0; i < eleAs.length; i++)
			{
				eleAs[i].href = eleAs[i].href + "&paginationrows=1000";
			}
		}
		
		var inputClose = document.querySelector("td:nth-child(3) > input:nth-child(1)");
		if (inputClose)
		{
			inputClose.value = "Close (Esc)";
		}
		
	} // End rally.php
	
	if (/\/rally_results_?[0-9]{0,4}/.test(url))
	{
		document.body && document.body.classList.add("stsh_page_rallyResults");
		
		var h3 = document.querySelector("table.curved h3");
		if (h3)
		{
			document.title = h3.textContent.trim();
		}
		
		var eleTable = document.querySelector("body > div:nth-child(1) > table:nth-child(1)");
		if (eleTable)
		{
			eleTable.style.width = "";
		}
		
		var inputClose = document.querySelector("td:nth-child(3) > input:nth-child(1)");
		if (inputClose)
		{
			inputClose.value = "Close (Esc)";
			inputClose.focus();
		}
		
		// Add frame and background button
		{
			var eleTdFirst = document.querySelector("td:nth-child(1)");
			if (eleTdFirst)
			{
				var eleTdFrame = document.createElement("td");
				eleTdFrame.setAttribute("align", "right");
				eleTdFrame.innerHTML = 
					' <a class="stsh_a_button" target="_blank" href="' + url + '">Frame</a> ';
				insertBeforeElement(eleTdFrame, eleTdFirst);
				
				var img = document.body.style.backgroundImage;
				if (img.indexOf("url(\"") === 0)
				{
					img = img.replace("url(\"", "").replace("\")", "");
					
					var eleTdImage = document.createElement("td");
					eleTdImage.setAttribute("align", "right");
					eleTdImage.innerHTML = 
						' <a class="stsh_a_button" target="_blank" href="' + img + '">View Background</a> ';
					insertAfterElement(eleTdImage, eleTdFrame);
				}
			}
		}
		
		var inputPrev = document.querySelector("input[value^='Prev']");
		if (inputPrev)
		{
			addKeyCtrl(document, inputPrev, ["BracketLeft", 219], "[", 1|2);			// [
			disableAfterClick(inputPrev);
		}
		
		var inputNext = document.querySelector("input[value^='Next']");
		if (inputNext)
		{
			addKeyCtrl(document, inputNext, ["BracketRight", 221, 171], "]", 1|2);		// ]
			disableAfterClick(inputNext);
		}
		
		// Hilight cur lang
		{
			var elesLang = document.querySelectorAll("table.curved > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > h2:nth-child(1)");
			for (var i = 0; i < elesLang.length; i++)
			{
				if (lang === elesLang[i].textContent.trim().toLowerCase())
				{
					var eleParent = elesLang[i].parentElement.parentElement.parentElement.parentElement;
					//eleParent.style.backgroundColor = "#474D1A";
					eleParent.classList.add("stsh_curLang");
					eleParent.setAttribute("bgcolor", "#474D1A");
					eleParent.setAttribute("onmouseout", "this.bgColor='#474D1A'");
					eleParent.setAttribute("onmouseover", "this.bgColor='#76802B'");
					break;
				}
			}
		}
		
		// Reset points position
		{
			var eleSpan = document.querySelector("h5 > span");
			if (eleSpan)
			{
				eleSpan.parentElement.parentElement.removeAttribute("style");
			}
		}
		
	} // End rally_results.php
	
	if (/\/rallyreplay_?[0-9]{0,4}/.test(url))
	{
		document.body && document.body.classList.add("stsh_page_rallyReplay");
		
		// Set cur lang to first
		{
			var elesFrame = document.querySelectorAll("#leftAreaContainer div[id^='frame']");
			for (var i = 0; i < elesFrame.length; i++)
			{
				var first = elesFrame[i].querySelector(".gradienttable tr:nth-child(6)");
				if (first)
				{
					var cur = null;
					
					var tdLangs = elesFrame[i].querySelectorAll(".gradienttable tr > td:nth-child(1)");
					for (var j = 0; j < tdLangs.length; j++)
					{
						if (lang === tdLangs[j].textContent.trim().toLowerCase())
						{
							cur = tdLangs[j].parentElement;
							break;
						}
					}
					
					if (cur)
					{
						cur.classList.add("stsh_curLang");
						first.parentElement.insertBefore(cur, first);
					}
				}
			}
		}
		
		var eleBtn = document.querySelector("input[value='FASTEST']");
		if (eleBtn)
		{
			var ele = document.createElement("input");
			ele.setAttribute("type", "button");
			ele.setAttribute("value", "RESTART");
			ele.setAttribute("style", "padding: 0; border: none; background: none;");
			ele.setAttribute("onclick", 
" \
indexReplay = 0; \
elsFrame.eq(indexReplay).fadeOut(0, function() \
{ \
	indexReplay = (indexReplay + 1) % lenFrame; \
	elsFrame.eq(indexReplay).fadeIn(0); \
}); \
");
				
			insertAfterElement(ele, eleBtn);
			
			insertAfterElement(document.createTextNode(" | "), eleBtn);
		}
		
	} // End rallyreplay.php
	
	if (url.indexOf("/WhereIsEsty.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_whereIsEsty");
		
		resizeSuggestionBox();
	
		var outer = document.querySelector("#suggestions_box_outer");
		if (outer)
		{
			outer.setAttribute("onclick", "hideSuggestionsBox();");
		}
		
		var divContainer = document.querySelector("#pageContainer");
		if (divContainer)
		{
			var ele = document.createElement("div");
			ele.id = "logout";
			ele.innerHTML = 
				' <a class="stsh_a_button" target="_blank" href="/home.php">Home</a> ';
			divContainer.appendChild(ele);
		}

		var divContent = document.querySelector("#leftAreaContainer > div");
		if (divContent)
		{
			var countSnap = document.querySelectorAll("div.box").length;
			var user = "";
			var name = "";

			var eleImg = document.querySelector("#leftAreaContainer > div > div > a > img ");
			if (eleImg)
			{
				name = eleImg.getAttribute("title");
				user = eleImg.parentElement.getAttribute("href").replace("https://steamcommunity.com/profiles/", "");
			}
			var ele = document.createElement("div");
			ele.classList.add("stsh_snapshot");
			ele.innerHTML = "<a class='stsh_blue' target='_blank' href='/user_activity.php?user="
				+ user + "'>" + name + "</a>"
				+ "<br>Snapshot: " + countSnap;

			divContent.appendChild(ele);
		}
		
	} // End WhereIsEsty.php
	
	if (url.indexOf("/stickerbox.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_stickerbox");
		
		document.querySelector("textarea[name='add_comment']").focus();
		
		var inputPrev = document.querySelector("img[src*='z0lEQVRIx5WWaWxVRRTH'");
		if (inputPrev)
		{
			addKeyCtrl(document, inputPrev, ["BracketLeft", 219]);			// [
			disableAfterClick(inputPrev);
		}
		
		var inputNext = document.querySelector("img[src*='40lEQVRIx5WWe0xXZRjH'");
		if (inputNext)
		{
			addKeyCtrl(document, inputNext, ["BracketRight", 221, 171]);	// ]
			disableAfterClick(inputNext);
		}
	} // End stickerbox.php
	
	if (/\/(home\.php|index\.php)/i.test(url))
	{
		document.body && document.body.classList.add("stsh_page_home");
		
		// Add class
		{
			var elesH1 = document.querySelectorAll("#leftAreaContainer h1");
			for (var i = 0; i < elesH1.length; i++)
			{
				var text = elesH1[i].textContent.trim();
				if (text === "Current Serverwide Focus")
				{
					elesH1[i].classList.add("stsh_home_focus");
				}
				else if (text.indexOf("Oldest") === 0)
				{
					elesH1[i].classList.add("stsh_home_application");
				}
				else if (text.indexOf("Most Outdated") === 0)
				{
					elesH1[i].classList.add("stsh_home_untranslated");
				}
				else if (text === "Latest 10 Cross-Language Discussions About Certain Tokens")
				{
					elesH1[i].classList.add("stsh_home_discussion");
				}
				else if (text === "Overall Progress")
				{
					elesH1[i].classList.add("stsh_home_progress");
				}
			}
			
			var elesLi = document.querySelectorAll("#alldiscussions > ul > li > ul > li");
			for (var i = 0; i < elesLi.length; i++)
			{
				elesLi[i].classList.add("stsh_home_discussion_comment");
				
				var eleFirst = elesLi[i].firstElementChild;
				if (eleFirst && eleFirst.tagName === "FONT")
				{
					elesLi[i].classList.add("stsh_home_discussion_langCur");
				}
				else
				{
					elesLi[i].classList.add("stsh_home_discussion_langOther");
				}
			}
		}
		
		// Decode URI in discussion
		{
			var rgxUrl = /https?:[^ ]+/ig;;
			
			var elesPost = document.querySelectorAll(".stsh_home_discussion_comment");
			for (var i = 0; i < elesPost.length; i++)
			{
				for (var j = 0; j < elesPost[i].childNodes.length; j++)
				{
					if (elesPost[i].childNodes[j].nodeType === document.TEXT_NODE)
					{
						var isChanged = false;
						
						var comment = elesPost[i].childNodes[j].textContent + " ";
						
						var commentUrls = comment.match(rgxUrl) || [];
						for (var k = 0; k < commentUrls.length; k++)
						{
							if (commentUrls[k].indexOf("%") > -1)
							{
								var urlDecode = commentUrls[k];
								try
								{
									urlDecode = decodeURIComponent(commentUrls[k]);
									isChanged = true;
								}
								catch (ex)
								{
									console.error("DecodeUriDiscussion", ex.message);
								}
								
								comment = comment.replace(commentUrls[k], urlDecode);
							}
						}
						
						if (isChanged)
						{
							elesPost[i].childNodes[j].textContent = comment;
						}
					}
				}
			}
		}
		
		// Set cur lang to first
		{
			var first = null;
			var cur = null;
			var curLang = lang.substring(0, 4);
			
			if (curLang === "schi")
				curLang = "sim.";
			else if (curLang === "tchi")
				curLang = "tra.";
			
			var eleLangs = document.querySelectorAll("#overall .progress");
			if (eleLangs.length > 0)
			{
				first = eleLangs[0];
				for (var i = 0; i < eleLangs.length; i++)
				{
					if (curLang === eleLangs[i].textContent.trim().substring(0, 4).toLowerCase())
					{
						cur = eleLangs[i];
						break;
					}
				}
				
				if (cur)
				{
					cur.classList.add("stsh_blue");
					var curSib1 = cur.nextSibling;
					var curSib2 = curSib1.nextSibling;
					var curSib3 = curSib2.nextSibling;
					var curSib4 = curSib3.nextSibling;
					var curSib5 = curSib4.nextSibling;
					var curSib6 = curSib5.nextSibling;
					
					insertBeforeElement(cur, first);
					insertAfterElement(curSib6, cur);
					insertAfterElement(curSib5, cur);
					insertAfterElement(curSib4, cur);
					insertAfterElement(curSib3, cur);
					insertAfterElement(curSib2, cur);
					insertAfterElement(curSib1, cur);
				}
			}
		}
		
		if (document.querySelector("#logout"))
		{
			var tmplHome = 
' \
<div class="stsh_home_group"> \
	<span class="stsh_home_header">Shortcuts</span> \
	<div> \
		<a class="stsh_a_button stsh_btn_med" target="_blank" \
			href="/translate.php?search_input=DATE%3A+%DATE%&paginationrows=1000">New Today</a \
		><a class="stsh_a_button stsh_btn_med" target="_blank" href="/glossary.php">Glossary</a> \
	</div> \
	%PROFILE% \
	<span class="stsh_home_header">Rally</span> \
	<div> \
		<a class="stsh_a_button stsh_btn_med" target="_blank" href="/rally.php">Rally</a \
		>%RALLY% \
	</div> \
	<span class="stsh_home_header">Events</span> \
	<div> \
		<a class="stsh_a_button stsh_btn_med stsh_grey" target="_blank" href="/rallyreplay.php">Rally Replay</a \
		><a class="stsh_a_button stsh_btn_med stsh_grey" target="_blank" href="/onionolooorm.php">Typonion</a \
		><a class="stsh_a_button stsh_btn_med" target="_blank" href="/dstbattle.php">DST Battle</a \
		><a class="stsh_a_button stsh_btn_med" target="_blank" href="/dota2.php">DOTA 2</a> \
	</div> \
	<span class="stsh_home_header stsh_home_section_scroll">Scroll To</span> \
	<div class="stsh_home_section_scroll"> \
		<a class="stsh_a_button stsh_btn_med" onclick="window.scrollTo(0, 0); return false;" >Focus</a \
		><a class="stsh_a_button stsh_btn_med" onclick="scrollToElement(\'.stsh_home_untranslated\', -4); return false;" >Untranslated</a \
		><a class="stsh_a_button stsh_btn_med" onclick="scrollToElement(\'.stsh_home_discussion\', -4); return false;" >Discussion</a \
		><a class="stsh_a_button stsh_btn_med" onclick="scrollToElement(\'.stsh_home_progress\', -4); return false;" >Progress</a> \
	</div> \
	<br> \
	<div><a class="stsh_a_button stsh_btn_med" target="_self" href="/home.php">Refresh</a></div> \
</div> \
';
			
			tmplHome = tmplHome.replace("%DATE%", getDateUs());
			
			// Rally
			{
				var date = new Date();
				var yearLast = date.getUTCFullYear();
				var yearFirst = 2013;
				var yearDisabled = [2015, 2018];
				var isEven = (yearLast - yearFirst + (isRally() ? 1 : 0)) % 2 === 0;
				var count = 0;
				
				var strRally = "";
				
				for (var i = yearLast; i >= yearFirst; i--)
				{
					if (i < yearLast || isRally())
					{
						if (count % 2 === (isEven ? 0 : 1))
						{
							strRally += '<div>';
						}
						
						if (count === 0 && !isEven)
						{
							strRally += '<div><a class="stsh_a_button stsh_btn_med'
								+ (yearDisabled.indexOf(i) > -1 ? " stsh_grey" : "")
								+ '" target="_blank" '
								+ 'href="/rally' + i + '.php">Rally ' + i + '</a></div>';
						}
						else
						{
							strRally += '<a class="stsh_a_button stsh_btn_short'
								+ (yearDisabled.indexOf(i) > -1 ? " stsh_grey" : "")
								+ '" target="_blank" '
								+ 'href="/rally' + i + '.php">' + i + '</a>';
						}
						
						if (count > 0 && count % 2 === (isEven ? 1 : 0))
						{
							strRally += '</div>';
						}
						
						count++;
					}
				}
				
				tmplHome = tmplHome.replace("%RALLY%", strRally);
			}
			
			// Profile
			{
				var strProfile = "";
				
				if (userId)
				{
					strProfile = '<div class="stsh_group_space">'
						+ '<a class="stsh_a_button stsh_btn_med" target="_blank" '
						+ 'href="/translate.php?user=' + userId 
						+ '&listsort=5&liststatus=1&paginationrows=1000">My Suggestions</a>';
						
					var userMod = GM_getValue("mod", "");
					if (userMod === userId)
					{
						strProfile += '<a class="stsh_a_button stsh_btn_med" target="_blank" '
							+ 'href="/translate.php?user=' + userId 
							+ '&moderator=1&listsort=5&liststatus=3&paginationrows=1000">My Reviews</a>';
					}
					
					strProfile += '</div>';
				}
				
				
				tmplHome = tmplHome.replace("%PROFILE%", strProfile);
			}			
			
			var eleNew = document.createElement("div");
			
			eleNew.innerHTML = tmplHome;
			
			document.body.appendChild(eleNew);
		}
		
		// Fix STS JS error
		{
			var eleTimer = document.querySelector("#timer");
			if (!eleTimer)
			{
				var ele = document.createElement("div");
				ele.id = "timer";
				ele.classList.add("stsh_hidden");
				document.body.appendChild(ele);
			}
		}
		
		// Add rows per page
		{
			var eleAs = document.querySelectorAll("#leftAreaContainer > div:not([id]) >.progress a[href^='translate.php?']");
			for (var i = 0; i < eleAs.length; i++)
			{
				eleAs[i].href = eleAs[i].href + "&paginationrows=1000";
			}
		}
		
		// Add counter to title
		{
			var counter = [0, 0];
			
			var eleComment = document.querySelector("#leftAreaContainer > b > a[href^='user_activity.php?user=']:nth-child(3)");
			if (eleComment)
			{
				counter[0] = eleComment.textContent.trim();
			}
			
			var elePrivate = document.querySelector("#titleprivatemessages");
			if (elePrivate)
			{
				var rgxPrivate = /Private Messages \((\d) new\)/i;
				counter[1] =(elePrivate.textContent.match(rgxPrivate) || [0, 0])[1];
			}
			
			if (counter[0] && counter[1])
			{
				document.title = "(" + counter[0] + "," + counter[1] + ") " + document.title;
			}
			else if (counter[0] || counter[1])
			{
				document.title = "(" + (counter[0] || counter[1]) + ") " + document.title;
			}
		}
		
		// Toggle file discussion
		{
			var elesLi = document.querySelectorAll("#alldiscussions > ul > li");
			for (var i = 0; i < elesLi.length; i++)
			{
				var node = elesLi[i].firstChild;
				if (node && node.nodeType === document.TEXT_NODE)
				{
					var eleSpan = document.createElement("span");
					eleSpan.classList.add("stsh_home_discussion_file");
					eleSpan.textContent = node.textContent;
					elesLi[i].replaceChild(eleSpan, node);
					
					eleSpan.addEventListener("click", function(ev)
					{
						var eleTarget = ev.target;
						var eleUl = eleTarget.nextElementSibling;
						if (eleUl && eleUl.tagName === "UL")
						{
							if (eleUl.style.display === "none")
							{
								eleUl.style.display = "block";
							}
							else
							{
								eleUl.style.display = "none";
							}
						}
					});
				}
			}
		}
		
		// Hide other languages
		{
			var eleAllDiscuss = document.querySelector("#alldiscussions");
			if (eleAllDiscuss)
			{
				var strHide = "Hide other languages";
				var strShow = "Show other languages";
				
				var eleBtn = document.createElement("input");
				eleBtn.classList.add("stsh_home_hideOtherLang");
				eleBtn.type = "button";
				eleBtn.value = strHide;
				eleBtn.dataset.modeNext = "hide";
				
				insertBeforeElement(eleBtn, eleAllDiscuss.firstElementChild);

				eleBtn.addEventListener("click", function(ev)
				{
					var eleTarget = ev.target;
					var mode = "hide";
					if (eleTarget.dataset.modeNext === "hide")
					{
						mode = "hide";
						eleTarget.dataset.modeNext = "show";
						eleTarget.value = strShow;
					}
					else
					{
						mode = "show";
						eleTarget.dataset.modeNext = "hide";
						eleTarget.value = strHide;
					}
					
					if (mode === "hide")
					{
						var elesLang = document.querySelectorAll(".stsh_home_discussion_langOther");
						for (var i = 0; i < elesLang.length; i++)
						{
							elesLang[i].classList.add("stsh_hidden");
						}
					}
					else
					{
						var elesLang = document.querySelectorAll(".stsh_home_discussion_langOther.stsh_hidden");
						for (var i = 0; i < elesLang.length; i++)
						{
							elesLang[i].classList.remove("stsh_hidden");
						}
					}
				});
			}
		}
		
		// Correct app links
		{
			var strIncludeApps = "&includeapps=1";
			
			var elesApp = document.querySelectorAll("a[href^='translate.php?lang=thai&search_input=%23app_']");
			for (var i = 0; i < elesApp.length; i++)
			{
				var href = elesApp[i].getAttribute("href");
				if (href.indexOf(strIncludeApps) < 0)
				{
					elesApp[i].setAttribute("href", href + strIncludeApps);
				}
			}
		}
		
	} // End home.php
	
	if (url.indexOf("/glossary.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_glossary");
		
		// Add shortcuts
		{
			var contentGlos = 
' \
<div class="stsh_home_group"> \
	<span class="stsh_home_header">Shortcuts</span> \
	<br> &nbsp; \
	<a class="stsh_a_button stsh_btn_med" target="_blank" \
		href="/translate.php?chosenfile=1&listfilter=1&listsort=3&paginationrows=1000&branch_ID=49&file_ID=226"> \
			Glossary</a> &nbsp; \
	<br> &nbsp; \
	<a class="stsh_a_button stsh_btn_med" target="_blank" \
		href="/translate.php?chosenfile=1&listfilter=1&listsort=3&paginationrows=1000&branch_ID=49&file_ID=232"> \
			Phrases</a> &nbsp; \
	<br> \
</div> \
';
			
			var eleNew = document.createElement("div");
			eleNew.innerHTML = contentGlos;
			document.body.appendChild(eleNew);
		}
		
		// Improve glossary links
		{
			var elesLink = document.querySelectorAll("#votes_container > .lbAction a[href^='./translate.php?search_input=']");
			for (var i = 0; i < elesLink.length; i++)
			{
				elesLink[i].href = elesLink[i].href.replace("keyonly=0", "keyonly=2")
					.replace("listsort=0", "listsort=4")
					.replace("paginationrows=50", "paginationrows=1000");
			}
		}
		
	} // End glossary.php
	
	if (url.indexOf("/dstbattle.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_dstbattle");
		
		// Hilight cur lang
		{
			var cur = null;
			
			var elesLang = document.querySelectorAll(".gradienttable > tbody:nth-child(1) > tr > th:nth-child(1)");
			for (var i = 1; i < elesLang.length; i++)
			{
				if (lang === elesLang[i].textContent.trim().replace(/[0-9]+\. /, "").toLowerCase())
				{
					cur = elesLang[i].parentElement;
					break;
				}
			}
			
			if (cur)
			{
				cur.classList.add("stsh_dst_curLang");
			}
		}
		
	} // End dstbattle.php
	
	if (url.indexOf("/statistics.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_statistics");
		
		setTimeoutCustom(function()
		{
			var qBranch = getQueryByName("branch_ID");
			var qFile = getQueryByName("file_ID");
			
			if (qBranch === "" && qFile === "")
			{
				var getProgress = function(content)
				{
					content = content.trim();
					var rgxNum = /[0-9]+/g;
					var data = "";
					if (content.indexOf("<15") > -1)
					{
						data = "014"
					}
					else if (content.indexOf("100") < 0)
					{
						data = "0" + (content.match(rgxNum) || ["00"])[0];
					}
					else
					{
						data = "100";
					}
					return data;
				}
					
				var branch = "";
				var elesTr = document.querySelectorAll(".tableprogress tr");
				for (var i = 0; i < elesTr.length; i++)
				{
					var eleH = elesTr[i].querySelector("h2");
					if (eleH)
					{
						branch = eleH.textContent.trim();
					}
					else
					{
						var eleA = elesTr[i].querySelector("td:nth-child(2) > a:nth-child(1)[href^='translate.php']");
						if (eleA)
						{
							elesTr[i].classList.add("stsh_stat_progress");
							
							elesTr[i].dataset.translated = getProgress(eleA.textContent);
							elesTr[i].dataset.approved = getProgress(
								eleA.parentElement.nextElementSibling.firstElementChild.textContent);
								
							elesTr[i].dataset.branch = branch;
							elesTr[i].dataset.file = elesTr[i].firstElementChild.textContent.trim();
						}
					}
				}
								
				var eleDiv = document.createElement("div");
				document.body.appendChild(eleDiv);
				eleDiv.innerHTML = 
' \
<div class="stsh_showing_group"> \
	<span class="stsh_showing_header">Hide</span>\
	<br> &nbsp; <input id="stsh_stat_hideGame" value="Game" class="stsh_btn_short" type="button" /> \
	<input id="stsh_stat_hideSteam" value="Steam" class="stsh_btn_short" type="button" /> \
	<br> &nbsp; <input id="stsh_stat_hideApproved" value="Approved" class="stsh_btn_long" type="button" /> \
	<br> &nbsp; <input id="stsh_stat_hideCompleted" value="Completed" class="stsh_btn_long" type="button" /> \
	<br> \
	<br> &nbsp; <input id="stsh_stat_showAll" value="Show All" class="stsh_btn_long" type="button" /> \
</div> \
';

				var eleHideGame = document.querySelector("#stsh_stat_hideGame");
				eleHideGame.addEventListener("click", function()
				{
					var elesProgress = document.querySelectorAll(".stsh_stat_progress:not(.stsh_hidden)");
					for (var i = 0; i < elesProgress.length; i++)
					{
						if (elesProgress[i].dataset.branch.indexOf("games/") === 0)
						{
							elesProgress[i].classList.add("stsh_hidden");
						}
					}
				});
				
				var eleHideSteam = document.querySelector("#stsh_stat_hideSteam");
				eleHideSteam.addEventListener("click", function()
				{
					var elesProgress = document.querySelectorAll(".stsh_stat_progress:not(.stsh_hidden)");
					for (var i = 0; i < elesProgress.length; i++)
					{
						if (elesProgress[i].dataset.branch.indexOf("steam") === 0)
						{
							elesProgress[i].classList.add("stsh_hidden");
						}
					}
				});
				
				var eleHideApproved = document.querySelector("#stsh_stat_hideApproved");
				eleHideApproved.addEventListener("click", function()
				{
					var elesProgress = document.querySelectorAll(".stsh_stat_progress:not(.stsh_hidden)");
					for (var i = 0; i < elesProgress.length; i++)
					{
						if (elesProgress[i].dataset.translated === elesProgress[i].dataset.approved)
						{
							elesProgress[i].classList.add("stsh_hidden");
						}
					}
				});
				
				var eleHideCompleted = document.querySelector("#stsh_stat_hideCompleted");
				eleHideCompleted.addEventListener("click", function()
				{
					var elesProgress = document.querySelectorAll(".stsh_stat_progress:not(.stsh_hidden)");
					for (var i = 0; i < elesProgress.length; i++)
					{
						if (elesProgress[i].dataset.translated === "100" && elesProgress[i].dataset.approved === "100")
						{
							elesProgress[i].classList.add("stsh_hidden");
						}
					}
				});
				
				var eleShowAll = document.querySelector("#stsh_stat_showAll");
				eleShowAll.addEventListener("click", function()
				{
					var elesProgress = document.querySelectorAll(".stsh_stat_progress.stsh_hidden");
					for (var i = 0; i < elesProgress.length; i++)
					{
						elesProgress[i].classList.remove("stsh_hidden");
					}
				});
			}
			
			// Add rows per page
			{
				var eleAs = document.querySelectorAll("#leftAreaContainer a[href^='translate.php?']");
				for (var i = 0; i < eleAs.length; i++)
				{
					eleAs[i].href = eleAs[i].href + "&paginationrows=1000";
				}
			}
			
		}, timingInit.improveStatistics);
		
	} // End statistics.php
	
	if (url.indexOf("index.php") > -1 
		|| url === "https://translation.steampowered.com/")
	{
		document.body && document.body.classList.add("stsh_page_index");
		
		var eleDes = document.querySelector("#verify-form > form");
		if (eleDes)
		{
			var eleSpan = document.createElement("span");
			eleSpan.classList.add("stsh_autoLoginOption");

			var eleInput = document.createElement("input");
			eleInput.id = "stsh_autoLogin";
			eleInput.setAttribute("type", "checkbox");
			eleInput.setAttribute("value", "auto");
			
			var autoLogin = function()
			{
				var eleImage = document.querySelector("#verify-form > form > input[class='image']");
				if (eleImage)
				{
					setTimeoutCustom(function()
					{
						var eleInput = document.querySelector("#stsh_autoLogin");
						if (eleInput && eleInput.checked)
						{
							eleImage.click();
						}
					}, timingInit.autoLogin);
				}
			}
			
			if (GM_getValue("autoLogin", 0) === "true")
			{
				eleInput.checked = true;
				autoLogin();
			}

			eleInput.addEventListener("click", function (e)
			{
				var ele = e.target;
				if (ele.checked)
				{
					GM_setValue("autoLogin", "true");
					autoLogin();
				}
				else
				{
					GM_setValue("autoLogin", "false");
				}
			});

			var eleLabel = document.createElement("label");
			eleLabel.setAttribute("for", "stsh_autoLogin");
			eleLabel.textContent = " Auto Login";
			eleLabel.title = "Auto click login button"

			eleSpan.appendChild(eleInput);
			eleSpan.appendChild(eleLabel);
			eleDes.appendChild(eleSpan);
		}
		
	} // End index.php
	
	if (url.indexOf("try_auth.php") > -1)
	{
		document.body && document.body.classList.add("stsh_page_tryAuth");
		
		setTimeoutCustom(function()
		{
			document.forms[0].submit();
		}, timingInit.authSubmit);
		
	} // End try_auth.php
	
	window.addEventListener("beforeunload", function (e)
	{
		clearTimeoutAll();
		clearIntervalAll();
	});
	
	if (perfStart > 0)
	{
		var perfEnd = performance.now();
		//console.log("STS Helper - Perf: " + (perfEnd - perfStart).toFixed(2) + "ms, Page: " + window.location.pathname);
	}
	
} // End Main

function client()
{
	var clientScript = 
' \
/* STSH JS - clientScript */ \
var timeoutList = []; \
var intervalList = []; \
 \
function setTimeoutCustom(func, tm, params) \
{ \
	var id = setTimeout(func, tm, params); \
	timeoutList.push(id); \
	return id; \
} \
 \
function clearTimeoutAll() \
{ \
	for (var i = 0; i < timeoutList.length; i++) \
	{ \
		clearTimeout(timeoutList[i]); \
	} \
} \
 \
function setIntervalCustom(func, tm, params) \
{ \
	var id = setInterval(func, tm, params); \
	intervalList.push(id); \
	return id; \
} \
 \
function clearIntervalAll() \
{ \
	for (var i = 0; i < intervalList.length; i++) \
	{ \
		clearInterval(intervalList[i]); \
	} \
} \
 \
function scrollToId(id, offset) \
{ \
	scrollToElement("#" + id, offset); \
} \
 \
function scrollToElement(selector, offset) \
{ \
	if (typeof offset === "undefined") \
	{ \
		offset = -20; \
	} \
	 \
	var ele = document.querySelector(selector); \
	if (ele) \
	{ \
		ele.scrollIntoView(true); \
		window.scrollBy(0, offset); \
	} \
} \
 \
function getTimeMs() \
{ \
	return (new Date()).getTime(); \
} \
 \
function registerHideSuggestion() \
{ \
	if (typeof hideSuggestionsBox !== "undefined" || (parent && parent.hideSuggestionsBox)) \
	{ \
		document.addEventListener("keydown", function(e) \
		{ \
			if (e.keyCode === 27) \
			{ \
				if (parent) \
				{ \
					parent.hideSuggestionsBox(); \
				} \
				else \
				{ \
					hideSuggestionsBox(); \
				} \
			} \
			return false; \
		}); \
	} \
} \
registerHideSuggestion(); \
 \
function doubleClickHideSuggestion(ele) \
{ \
	var maxDiff = 3000; \
	var msDiff = maxDiff; \
	var isEdited = false; \
	 \
	if (ele && ele.dataset) \
	{ \
		msDiff = getTimeMs() - (ele.dataset.stshHideSuggestion || 0); \
		isEdit = ele.dataset.stshTextEdited === "true"; \
	} \
	 \
	if (!isEdit || msDiff < maxDiff) \
	{ \
		hideSuggestionsBox(); \
		ele.dataset.stshHideSuggestion = 0; \
	} \
	else \
	{ \
		ele.dataset.stshHideSuggestion = getTimeMs(); \
	} \
} \
 \
function clickToSelect(ele) \
{ \
	var range = document.createRange(); \
	range.setStartBefore(ele.firstChild); \
	range.setEndAfter(ele.lastChild); \
	var sel = window.getSelection(); \
	sel.removeAllRanges(); \
	sel.addRange(range); \
} \
 \
function syncUrlArray() \
{ \
	var strStart = "showSuggestionsBox( \'"; \
	var strEnd = "\' ); return false;"; \
	var strCur = "&list_id="; \
	var strAll = "&endnext="; \
	var regPos = /&list_id=\\d+&endnext=\\d+/g; \
	var isEdit = false; \
	var eleDivs = []; \
	var urls = []; \
	 \
	var pattUrlTimestamp = \
	{ \
		type2: /\\&t=[0-9]{6,}/g, \
		type4: /\\&[0-9]{6,}\\&/g, \
	}; \
 	 \
	var trKeys = document.querySelectorAll("#keylist > table:nth-child(1) > tbody:nth-child(1) > tr"); \
	for (var i = 0; i < trKeys.length; i++)  \
	{ \
		if (!trKeys[i].classList.contains("stsh_hidden")) \
		{ \
			var eleDiv = trKeys[i].childNodes[0].childNodes[0]; \
			if (typeof eleDiv.getAttribute !== "undefined" \
				&& eleDiv.getAttribute("onclick")) \
			{ \
				eleDivs.push(eleDiv); \
			} \
		} \
	} \
	 \
	for (var i = 0, l = eleDivs.length; i < l; i++) \
	{ \
		var evOld = eleDivs[i].getAttribute("onclick"); \
		if (evOld) \
		{ \
			var url = evOld.replace(strStart,"").replace(strEnd,"").replace(regPos,""); \
			url = url + strCur + i + strAll + l; \
				\
			if (pattUrlTimestamp.type2.test(url)) \
			{ \
				url = url.replace(pattUrlTimestamp.type2, ""); \
			} \
			if (pattUrlTimestamp.type4.test(url)) \
			{ \
				url = url.replace(pattUrlTimestamp.type4, "&"); \
			} \
			 \
			urls.push(url); \
			 \
			var evNew = strStart + url + strEnd; \
			if (evOld !== evNew) \
			{ \
				eleDivs[i].setAttribute("onclick", evNew); \
				isEdit = true; \
			} \
		} \
	} \
	 \
	if (isEdit || typeof URLarray === "undefined" || URLarray.length !== urls.length) \
	{ \
		URLarray = urls; \
	} \
} \
 \
function setFrameColor(color) \
{ \
	var frame = document.querySelector("div#suggestions_box iframe"); \
	if (frame) \
	{ \
		if (frame.style.backgroundColor !== color) \
		{ \
			frame.style.setProperty("background-color", color, "important"); \
		} \
	} \
} \
 \
function padZero(num, size) \
{ \
	return (1e15+num+"").slice(-size); \
} \
 \
function doInstant() \
{ \
	var url = document.documentURI; \
	 \
	/* Fix STS JS error */ \
	setTimeoutCustom(function() \
	{ \
		if (typeof hide_list === "undefined") \
		{ \
			hide_list = function() { /*console.log("sts: hide_list");*/ }; \
		} \
		 \
		if (typeof changeIt === "undefined") \
		{ \
			changeIt = function() { /*console.log("sts: changeIt");*/ }; \
		} \
		 \
		if (typeof getendnext === "undefined") \
		{ \
			getendnext = function() { /*console.log("sts: getendnext");*/ return ""; }; \
		} \
	}, 1000); \
	 \
	if (url.indexOf("user_activity.php") > -1) \
	{ \
		setTimeoutCustom(function() \
		{ \
			if (typeof $ !== "undefined") \
			{ \
				/* Restore drawing progress */ \
				$(".dial").css("display", "inline"); \
				$(".dial").knob( \
				{ \
					"draw": function() \
					{ \
						$(this.i).val(this.cv + "%"); \
					} \
				}); \
			} \
		}, 500); \
	} \
	else if (url.indexOf("translate.php") > -1) \
	{ \
		getsuggestionURL = function(urlno) \
		{ \
			/* Overwrite STS to remove timestamp */ \
			return URLarray[urlno]; \
		}; \
		 \
		var obTarget_sync = document.querySelector("#keylist_container");  \
		if (obTarget_sync) \
		{ \
			var tmOb_sync = -1; \
			var obMu_sync = new MutationObserver(function(mutations) \
			{ \
				mutations.forEach(function(mutation) \
				{ \
					if (mutation.type !== "attributes" \
						|| mutation.target.tagName === "TR") \
					{ \
						clearTimeout(tmOb_sync); \
						tmOb_sync = setTimeoutCustom(function() \
						{ \
							syncUrlArray(); \
							/*console.log("syncUrlArray: " + tmOb_sync);*/ \
						}, 50); \
					} \
				}); \
			}); \
			 \
			var obConfig_sync = { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }; \
			obMu_sync.observe(obTarget_sync, obConfig_sync); \
		} \
	} \
	else if (url.indexOf("suggestions.php") > -1) \
	{ \
		if (parent !== window) \
		{ \
			var main = document.querySelector("#suggestionmain"); \
			if (main) \
			{ \
				var styleCp = window.getComputedStyle(main); \
				if (styleCp) \
				{ \
					var color = styleCp.backgroundColor; \
					parent.setFrameColor(color); \
				} \
			} \
		} \
	} \
	 \
	window.addEventListener("beforeunload", function (e) \
	{ \
		clearTimeoutAll(); \
		clearIntervalAll(); \
	}); \
	 \
} \
doInstant(); \
 \
';

	var eleClientScript = document.createElement("script");
	eleClientScript.innerHTML = clientScript;
	document.head.appendChild(eleClientScript);
} // End client

attachOnReady(initStyle);
attachOnReady(client);
attachOnReady(main);

})();

// End
