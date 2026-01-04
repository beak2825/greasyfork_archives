// ==UserScript==
// @name			Tumbl OG BG
// @namespace		http://pisspasta.tumblr.com/
// @version			1.9
// @author			dripdad
// @description		Original bg color
// @icon			https://pbs.twimg.com/profile_images/467963365172576256/_5NLD8Uq_normal.jpeg
// @include			https://www.tumblr.com/blog*
// @include			https://www.tumblr.com/dashboard*
// @include			https://www.tumblr.com/inbox*
// @include			https://www.tumblr.com/tagged*
// @include			https://www.tumblr.com/likes*
// @include			https://www.tumblr.com/reblog*
// @include			https://www.tumblr.com/settings*
// @include			https://www.tumblr.com/explore*
// @include			https://www.tumblr.com/privacy*
// @include			https://www.tumblr.com/search*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/377294/Tumbl%20OG%20BG.user.js
// @updateURL https://update.greasyfork.org/scripts/377294/Tumbl%20OG%20BG.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

/* GENERAL BACKGROUND */
addGlobalStyle('.post_avatar,.l-header-container--refresh,.l-container.l-container--two-column-dashboard .right_column,.l-container.l-container--two-column .right_column,.l-container.l-container--two-column-dashboard .l-content, .l-container.l-container--two-column .l-content,.identity.flag--accessibility-design-update .user_list li .follow_list_item_blog:before, .flag--accessibility-design-update .radar .radar_footer .radar_avatar::before, .identity.flag--accessibility-design-update .right_column:after, .toastr .toast:not(:hover), .accessibility-design-update .toastr .toast:not(:hover), .discover_actions_discover.flag--accessibility-design-update .elevator, .search_actions_search.flag--accessibility-design-update .elevator, .flag--accessibility-design-update .l-container.l-container--flex .l-content, .flag--accessibility-design-update .post-forms-glass, body.flag--always-opaque-peepr .ui_peepr_glass, body.flag--always-opaque-peepr.flag--accessibility-design-update .ui_peepr_glass, .flag--accessibility-design-update .l-header-container--refresh, .flag--accessibility-design-update .l-container.l-container--two-column-dashboard .right_column, .flag--accessibility-design-update .l-container.l-container--two-column .right_column, .flag--accessibility-design-update .post_avatar, .flag--accessibility-design-update .l-container.l-container--two-column-dashboard .left_column, .l-container.l-container--two-column-dashboard .left_column, .flag--accessibility-design-update .ui_dialog_lock, .identity, .flag--accessibility-design-update .identity, .identity.flag--accessibility-design-update, .flag--accessibility-design-update .l-container.l-container--two-column-dashboard .l-content, .flag--accessibility-design-update .l-container.l-container--two-column .l-content {background-color: #36465d !important;}');
addGlobalStyle('.identity.flag--accessibility-design-update .user_list li .follow_list_item_blog:before, .flag--accessibility-design-update .radar .radar_footer .radar_avatar::before, .identity.flag--accessibility-design-update .right_column:after {background: none !important;}');
addGlobalStyle('.identity.flag--accessibility-design-update .user_list li .follow_list_item_blog:before {border-right: 0 none transparent !important;}');
addGlobalStyle('.post-forms-glass {background-color: rgba(54,70,93,.95) !important;}');

/* POST PERMALINK CORNER PAGE TURN */
addGlobalStyle('.post_full .post_permalink, .flag--accessibility-design-update .post_full .post_permalink {border-right-color: #36465d;}');
addGlobalStyle('.post_full .post_permalink, .flag--accessibility-design-update .post_full .post_permalink {border-top-color: #36465d;}');

/* GENDERAL TAB COLORS */
addGlobalStyle('.tab-notice--outlined,.flag--accessibility-design-update .tab-notice--outlined {border-color: #36465d;}');
addGlobalStyle('.flag--accessibility-design-update .tab_notice .tab_notice_value {color: #36465d;}');

/* INBOX TAB COLORS */
addGlobalStyle('#inbox_button .tab_notice, .flag--accessibility-design-update .tab_inbox .tab_notice {background-color: #ff0000 !important;}');
addGlobalStyle('#inbox_button .tab_notice_value, .flag--accessibility-design-update .tab_inbox .tab_notice_value {color: #fff !important;}');
