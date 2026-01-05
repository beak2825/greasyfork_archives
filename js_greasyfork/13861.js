// ==UserScript==
// @name        TSR After Dark
// @author      + polarity -
// @namespace   http://www.thestudentroom.co.uk/
// @description Dark Theme for TSR
// @icon		https://static.thestudentroom.co.uk/59a67990df13b/images/base/logo-header.png
// @include     https://www.thestudentroom.co.uk/*
// @include     https://*.thestudentroom.co.uk/
// @version     1.26
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/13861/TSR%20After%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/13861/TSR%20After%20Dark.meta.js
// ==/UserScript==

(function() {var css = [
	"#page-columns, #page_member, #simple_aboutme_link, #visitor_message_tabs, #page-section-top, #wiki_content, #visitor_messaging .block_row, .editor_smiliebox fieldset, .blockbody.formcontrols, div.blockrow, .floatcontainer, .carousel-page.current, .aboutme_singleline, .statistics_group, .submenu, .vm_blockrow, .post-attachments span.legend, div#edit_area.blockrow, .postbit-lite, .posttext.restore, .alt1.smallfont.block_row, .panelsurround, .post.threadpost::before, .post-footer::before",
	"	{background-color: #333 !important;}",
	"",
	"html, #page_vbcms, #page_member, #page_showthread, #page_home, #header div.page-section, div.post-user, .bb-expand, .sticky, #announcements .important, .quote_block, .advert-block, div.select.plain.unverified, div.widget-subtitle",
	"	{background-color: #202020 !important;}", // tested with black and 282828
	"",	
	"#username_box strong, #username_box h1, #username_box h2, #username_box h3, #profile_tabs h4, #collapseobj_stats li, #last_online, #breadcrumb, #datetime, #rank, #social-buttons, #share-links, table#threadlist td.title, #cont_useful-resources, #cont_moderators, #cont_latest-content p, .content p, .content h2, .subforums h4, dd, legend, .profile_body_wrapper p, .section-header p, .column-content h1, .thread-list .last-post, .meta-info, #cont_poll .title, .related-discussions .title, .snippet-h2, #cont_discussions, #wiki_content, #new_pm fieldset, #new_pm legend, #profile_tabs .block_row, .article-meta, .tagpost-target, li.current, li.date, .aboutme_divtitle, .aboutme_divcontent, .reputation-points, .post_title, .info, .origin, .description, .posted, .shade, .date_text, .replies, div.post-user, .post-tags span, .newpost .ordered-form span, .visitor_message_date, .thead.block_row, .profile_tab_header, .aboutme_single_title, .aboutme_single_value, .submenu .heading, .widget-action, .text.standard, .vm_blockrow .restore, .byline, .by, .voters, .poll_result_container, .post-edited, .post-reputation .score.zero, .post-content, .post-footer .label, form.editpost span, .reg_home_intro, .signature, .museo, .review-username, .review-title, .review-message, div.fieldset.noborder, .article-body, .widget .expand, .poll-container .result-footer, .poll-close-date, .follow-feed .user, .follow-feed .date, .follow-feed .username, .mw-headline, #bodyContent table, .floatcontainer .smallfont, .posttext.restore, .postbit-title, #searchfaq .panel, .poll-body, .postbit-preview, .fieldset table, .fieldset legend, .custom_description, .poll-option-text label",
	"	{color: white !important;}", // removed label
	"",	
	".vm_wrapper, .info_bar .noborder",
	"	{background-color: #909090 !important;}",
	"",
	// puts a white background behind smilies and images, not too sure about it tbh
	"blockquote img",
	"	{background-color: white !important;}",
	"",	
	"div.post-user",
	"	{border-top: 1px solid #3AA6D0 !important; border-bottom: 1px dotted #3AA6D0 !important;}", // #CCC
	"",
	".post-meta",
	"	{border-top: 1px solid #3AA6D0 !important; border-bottom: none !important;}",
	"",
	".post-number a::before",
	"	{background: none !important;}",
	"",
	".submenu a, .post-tags a, input",
	"	{color: #3BB5E0 !important;}",
	"",
	".sgicon p, #wysiwyg_block label, div.ed-toolbar span, #edit_area label, .ed-dropdown.list, .group_info_left h1, .bbcode_code, span.info, .ui-autocomplete-input, .online-status, .reg_home_intro, #quick-reply label span",
	"	{color: #666 !important;}",
	"",
	// hiding some items related to infinite scrolling
	/*"li.discussions_in_posts, li.announcements_in_posts, span.banner-ad-page-row",
	"	{display: none !important;}",
	"",*/
	// hiding some widgets
	"#widget-study-resources, #widget-scrolling-discussions, #widget-latest-content, #widget-learn-together-search, #widget-featured-stories, #widget-unimatch-course-search, #announcements, #mobile_quick_reply",
	"	{display: none !important;}",
	"",
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}

)();