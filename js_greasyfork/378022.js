// ==UserScript==
// @name         Tumblr: Old Blue
// @version      1.69
// @description  Make tumblr not suck to look at
// @author       twitter.com/RotomDex
// @match        https://www.tumblr.com/blog/*
// @match        https://www.tumblr.com/*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/248719
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/378022/Tumblr%3A%20Old%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/378022/Tumblr%3A%20Old%20Blue.meta.js
// ==/UserScript==

var url = document.URL;
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)}

//Kill recommended posts/blogs
if(!url.includes('/blog')){
    if(!url.includes('/settings')){
        if(!url.includes('/following')){
            addGlobalStyle('.right_column {display:none}'
                           +'.l-container.l-container--two-column-dashboard .l-content, .l-container.l-container--two-column .l-content {margin-left:8%}'
                           +'.toast, .multi-toasts {margin-left:13%}');}}}
//No fuckin tumblr radar
addGlobalStyle('li.section_header.radar_header, #tumblr_radar {display:none}');

//Colour modficiations
addGlobalStyle('.post_avatar .post_avatar_link{background-color: #35465e; !important;}');
addGlobalStyle('.identity{background-color:#35465e !important;}');
addGlobalStyle('.l-container.l-container--two-column-dashboard .l-content, .l-container.l-container--two-column .l-content{background-color:#35465e !important;}');
addGlobalStyle('.l-container.l-container--two-column-dashboard .right_column,.l-container.l-container--two-column .right_column{background-color:#35465e}');
addGlobalStyle('.l-container.l-container--two-column-dashboard .left_column{background-color:#35465e !important;}');
addGlobalStyle('.l-container.l-container--flex .l-content{background-color:#35465e !important;}');
addGlobalStyle('.identity .right_column:after{background:linear-gradient(180deg,#35465e,rgba(0,25,53,0)) !important;}');
addGlobalStyle('.identity .controls_section.user_list li .follow_list_item_blog:before{background-image:linear-gradient(90deg,rgba(0,25,53,0),#35465e);'
               +'border-right:5px solid #35465e !important;}');
addGlobalStyle('.flag--one-true-post .post-permalink{border-top-color:#35465e;border-right-color:#35465e !important;}');
addGlobalStyle('.popover--base-overlay{background:#35465e !important;}');
addGlobalStyle('.popover_vendor .popover_menu_item:hover{color:#35465e !important;}');
addGlobalStyle('.popover_vendor .popover_menu_item:hover .subtext,.popover_vendor .popover_menu_item:hover .subtext-email{color:#35465e !important;}');
addGlobalStyle('.post_avatar{background-color:#35465e !important;}');
addGlobalStyle('.post_avatar.flat{border-color:#35465e !important;}');
addGlobalStyle('.post_avatar.lighter_blue{background-color:#35465e !important;}');
addGlobalStyle('.post_avatar_link{background-color:none !important;}');
addGlobalStyle('.flag--npf-text-colors .post .post_content .npf_color_frasier{color:#35465e !important;}');
addGlobalStyle('.plus-follow-button{background:hsla(0,0%,100%,.2);background:hsla(0,0%,100%,.4);color:#35465e !important;}');
addGlobalStyle('.logged-out-header .login-button{color:#35465e !important;}');
addGlobalStyle('.tab-bar-container .tab_notice{color:#35465e !important;}');
addGlobalStyle('.l-header-container--refresh{background-color:#35465e !important;}');
addGlobalStyle('.mobile-banner .mobile-banner-button.secondary-cta{border-color:#35465e;background-color:#35465e;color:#00cf35 !important;}');
addGlobalStyle('.mobile-banner .mobile-banner-button.secondary-cta.disabled,.mobile-banner .mobile-banner-button.secondary-cta.disabled.active,.mobile-banner'
               +'.mobile-banner-button.secondary-cta[disabled],.mobile-banner .mobile-banner-button.secondary-cta[disabled]:active'
               +'{border-color:#35465e; background-color:#35465e; color:rgba(0,207,53,.5) !important;}');
addGlobalStyle('.app-gate .mobile-banner{background-color:#35465e !important;}');
addGlobalStyle('.ui_notes .activity-notification.is_friend{color:#35465e;background-color:#f3f8fb !important;}');
addGlobalStyle('.ui_notes .activity-notification.is_friend .activity-notification__activity{color:#35465e !important;}');
addGlobalStyle('.ui_notes .activity-notification.is_friend .activity-notification__activity_main .activity,'
               +'.ui_notes .activity-notification.is_friend .activity-notification__activity_main .activity a{color:#35465e !important;}');
addGlobalStyle('.is-followed .post-activity-note-content .note-text .note-text-link{color:#35465e !important;}');
addGlobalStyle('.is-followed .post-activity-note-content .note-added-tags,.is-followed .post-activity-note-content .note-added-text{color:#35465e !important;}');
addGlobalStyle('.post-activity-header .subscription-status .outer{fill:#35465e !important;}');
addGlobalStyle('.post-activity-header .subscription-status .bolt{fill:#35465e !important;}');
addGlobalStyle('.post-activity-header .subscription-status.is-subscribed .inner{fill:#35465e !important;}');
addGlobalStyle('.tumblr-blue.tx-button{border-color:#35465e;background-color:#35465e !important;}');
addGlobalStyle('.tumblr-blue.disabled.active.tx-button,.tumblr-blue.disabled.tx-button,'
               +'.tumblr-blue[disabled].tx-button,.tumblr-blue[disabled].tx-button:active{border-color:#35465e;background-color:#35465e;color:hsla(0,0%,100%,.5) !important;}');
addGlobalStyle('.tab_notice .tab_notice_value{color:#35465e} !important;}');
addGlobalStyle('.tab-notice--outlined{border-color:#35465e !important;}');
addGlobalStyle('.blog_menu .tab_notice .tab_notice_value{color:#35465e !important;}');
addGlobalStyle('.ui_search .search_query {background:#2e3d52');
addGlobalStyle('.sidebar_link.explore_link{color:#9da6b1 !important;}');
addGlobalStyle('.chrome.blue {background:#5da8d2; border-color:#5da8d2 !important;}');
addGlobalStyle('.compose-button {fill:#5da8d2 !important;}');
addGlobalStyle('.blue.tx-button{border:1px solid #5da8d2;background-color:#5da8d2; !important;}');
addGlobalStyle('.blue.disabled.active.tx-button,.blue.disabled.tx-button,.blue[disabled].tx-button,.blue[disabled].tx-button:active'
               +'{border-color:#5da8d2;background-color:#5da8d2;color:hsla(0,0%,100%,.5) !important;}');
addGlobalStyle('.tab_notice{background-color:#5da8d2; !important;}');
addGlobalStyle('.tab_notice .tab_notice_value{color:#001935 !important;}');
addGlobalStyle('.selected .tab_notice{background:#5da8d2 !important;}');
addGlobalStyle('.post-forms-glass{background-color:rgba(53, 70, 94, 0.9) !important;}');
addGlobalStyle('.identity .controls_section .item:hover .follow:hover{background:#5da8d2;color:#fff !important;}');
addGlobalStyle('.form-container .form-row.checkmark-row .option-radio:checked+.option-label:after{color:#5da8d2 !important;}');
addGlobalStyle('.flag--one-true-post .follow-button--worded .follow-text{color:#5da8d2 !important;}');
addGlobalStyle('.cta-blue-button{background-color:#5da8d2;border-color:#5da8d2 !important;}');
addGlobalStyle('.cta-blue-button .tsp-opacity-overlay{border-color:#5da8d2 !important;}');
addGlobalStyle('.cta-blue-button .cta-color-applied{color:#5da8d2 !important;}');
addGlobalStyle('.form-container.success .success-message .message-text .message-link{color:#5da8d2 !important;}');
addGlobalStyle('.post .post_content_inner.safemode .link,.post .post_content_inner.tagfiltering .link{color:#5da8d2 !important;}');
addGlobalStyle('.post-content-text .tmblr-truncated .tmblr-truncated-link,.post-content-text .tmblr-truncated:after,'
               +'.post .post_body .tmblr-truncated .tmblr-truncated-link,.post .post_body .tmblr-truncated:after,.reblog-content .tmblr-truncated .tmblr-truncated-link,'
               +'.reblog-content .tmblr-truncated:after{color:#5da8d2; !important;}');
addGlobalStyle('body.flag--npf-text-colors .post .post_content .npf_color_rachel{color:#5da8d2 !important;}');
addGlobalStyle('.binary-switch input[type=checkbox]:checked~.binary-switch-track{background:#5da8d2 !important;}');
addGlobalStyle('.ui_dialog .text a{color:#5da8d2 !important;}');
addGlobalStyle('.ui_dialog .chrome.blue{background-color:#5da8d2 !important;}');
addGlobalStyle('.plus-follow-button.blue,.plus-follow-button:hover{background:#5da8d2;color:#fff !important;}');
addGlobalStyle('.reblog_follow_button .follow-text,.worded-follow-button .follow-text{color:#aaaaaa !important;}');
addGlobalStyle('.compose-button{fill:#5da8d2 !important;}');
addGlobalStyle('.messaging-share-post .messaging-share-post-message .compose-text-input-container .submit-button .submit{color:#5da8d2 !important;}');
addGlobalStyle('.blue#glass_overlay, .blue#hello_glass, .blue.glass{ background:rgba(42, 61, 84, .9)!important;}');
addGlobalStyle('.messaging-share-post .messaging-share-post-result .container{color:#5da8d2 !important;}');
addGlobalStyle('.messaging-share-post .messaging-share-post-search .selected-blog{background:#5da8d2 !important;}');
addGlobalStyle('.messaging-share-post .messaging-share-post-external-networks .is-focused.messaging-share-post-external-network{color:#5da8d2 !important;}');
addGlobalStyle('.messaging-inbox .inbox-conversations .is-unread.inbox-conversation .name-container{color:#5da8d2 !important;}');
addGlobalStyle('.messaging-inbox .inbox-compose-toggle .compose-start{color:#5da8d2 !important;}');
addGlobalStyle('.flag--messaging-new-empty-inbox .messaging-inbox .inbox-row .info-container .send-link,'
               +'.messaging-inbox .flag--messaging-new-empty-inbox .inbox-row .info-container .send-link{color:#5da8d2 !important;}');
addGlobalStyle('.messaging-conversation--open .conversation-compose .compose-text-input-container .submit-button .submit{color:#5da8d2 !important;}');
addGlobalStyle('.messaging-conversation--open .conversation-header:not(.has-image){background-color:#5da8d2 !important;}');
addGlobalStyle('.messaging-conversation--open .conversation-message-post .conversation-message-post--chat.message-container .icon{background:#5da8d2 !important;}');
addGlobalStyle('.ui_notes .activity-notification .activity-notification__activity .activity-notification__activity_message '
               +'.activity-notification__activity_reply .activity-notification__activity_reply_link{color:#5da8d2 !important;}');
addGlobalStyle('.ui_notes .activity-notification .activity-notification__icon .note_follow{display:inline-block;color:#5da8d2 !important;}');
addGlobalStyle('.overlay-container .indash_blog .overlay-wrapper .post_content_inner.safemode .link,.overlay-container .indash_blog .overlay-wrapper '
               +'.post_content_inner.tagfiltering .link,.peepr-drawer.overlay-container .overlay-wrapper .post_content_inner.safemode .link,'
               +'.peepr-drawer.overlay-container .overlay-wrapper .post_content_inner.tagfiltering .link{color:#5da8d2 !important;}');
addGlobalStyle('.survey-body .tx-button{background-color:#fff;color:#5da8d2 !important;}');
addGlobalStyle('.answer .post-activity-note-avatar .post-activity-avatar-link:after,.reply .post-activity-note-avatar .post-activity-avatar-link:after{background-color:#5da8d2}');
addGlobalStyle('.post-activity-reply .submit{color:#5da8d2 !important;}');
addGlobalStyle('.post-form--form.blocked{background-color:#5da8d2 !important;}');
addGlobalStyle('.post-form--tag-editor .tag-label.hover-style,.post-form--tag-editor .tag-label.selected{color:#5da8d2 !important;}');
addGlobalStyle('.overlay-button.active .icon{color:#5da8d2 !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button{background-color:#5da8d2 !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button:active{background-color:#5da8d2; !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area,.post-form--controls .controls-container '
               +'.post-form--save-button .split-button .dropdown-area{border-color:#5da8d2;background-color:#5da8d2; !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area.disabled,.post-form--controls .controls-container '
               +'.post-form--save-button .split-button .button-area.disabled.active,.post-form--controls .controls-container .post-form--save-button '
               +'.split-button .button-area[disabled],.post-form--controls .controls-container .post-form--save-button .split-button .button-area[disabled]:active,'
               +'.post-form--controls .controls-container .post-form--save-button .split-button .dropdown-area.disabled,.post-form--controls .controls-container '
               +'.post-form--save-button .split-button .dropdown-area.disabled.active,.post-form--controls .controls-container .post-form--save-button '
               +'.split-button .dropdown-area[disabled],.post-form--controls .controls-container .post-form--save-button .split-button '
               +'.dropdown-area[disabled]:active {border-color:#5da8d2 !important; background-color:#5da8d2 !important;}');
addGlobalStyle('.editor .over-bottom:after,.editor .over-top:before{background-color:#5da8d2 !important;}');
addGlobalStyle('.popover--reblog-graph .reblog-graph-info-button{color:#5da8d2 !important;}');
addGlobalStyle('.yam-plus-ad-container .ad-bg.bg-blue{background-color:#5da8d2 !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area:focus,.post-form--controls .controls-container '
               +'.post-form--save-button .split-button .dropdown-area:focus{border-color:#67b4e0 !important; background-color:#67b4e0 !important;'
               +'color:hsla(0,0%,100%,.9) !important;}');
addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area:active,.post-form--controls .controls-container '
               +'.post-form--save-button .split-button .dropdown-area:active {border-color:#67b4e0; background-color:#67b4e0; color:hsla(0,0%,100%,.8)} !important;}');
addGlobalStyle('body.flag--always-opaque-peepr .ui_peepr_glass {background-color:#35465e !important;}');
addGlobalStyle('.peepr .ui_peepr_glass {opacity:0.9 !important;}');
addGlobalStyle('.post-forms-glass .post-forms-glass_active.active{background-color:rgba(42, 61, 84, .9) !important;}');
addGlobalStyle('.ui_dialog_lock{background:rgba(42, 61, 84, .95) !important;}');
addGlobalStyle('.post_full .post_permalink{border-top-color: #35465e;border-right-color: #35465e;}');
addGlobalStyle('.toast{background:none !important;}');
addGlobalStyle('.toastr .toast .item.post{margin-left:2% !important; background-color:#3d3d3d !important;}');
addGlobalStyle('.toastr .toast .item.question{margin-left:2% !important; background-color:#3d3d3d !important;}');
addGlobalStyle('.audio-player{background: #a77ec4 !important;}');
addGlobalStyle('.notification {border:0px !important;}');
addGlobalStyle('.post_control::before {opacity:.7 !important;}');
addGlobalStyle('.rapid-recs-container .rapid-recs {background-image:none; background-color:#35465e !important;}');
addGlobalStyle('.radar .radar_footer .radar_avatar::before{background-image:none !important;}');
addGlobalStyle('li.section_header.radar_header, #tumblr_radar {display:none}');

// Delayed function to apply to page if it decides it didn't want to do my changes the first time around
$(function(){
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {return}
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style)}
    //Kill recommended posts/blogs
    if(!url.includes('/blog')){
        if(!url.includes('/settings')){
            if(!url.includes('/following')){
                addGlobalStyle('.right_column {display:none}'
                               +'.l-container.l-container--two-column-dashboard .l-content, .l-container.l-container--two-column .l-content {margin-left:8%}'
                               +'.toast, .multi-toasts {margin-left:13%}');}}}
    //No fuckin tumblr radar
    addGlobalStyle('li.section_header.radar_header, #tumblr_radar {display:none}');
    //Colour modficiations
    addGlobalStyle('.post_avatar .post_avatar_link{background-color: #35465e; !important;}');
    addGlobalStyle('.identity{background-color:#35465e !important;}');
    addGlobalStyle('.l-container.l-container--two-column-dashboard .l-content, .l-container.l-container--two-column .l-content{background-color:#35465e !important;}');
    addGlobalStyle('.l-container.l-container--two-column-dashboard .right_column,.l-container.l-container--two-column .right_column{background-color:#35465e}');
    addGlobalStyle('.l-container.l-container--two-column-dashboard .left_column{background-color:#35465e !important;}');
    addGlobalStyle('.l-container.l-container--flex .l-content{background-color:#35465e !important;}');
    addGlobalStyle('.identity .right_column:after{background:linear-gradient(180deg,#35465e,rgba(0,25,53,0)) !important;}');
    addGlobalStyle('.identity .controls_section.user_list li .follow_list_item_blog:before{background-image:linear-gradient(90deg,rgba(0,25,53,0),#35465e);'
                   +'border-right:5px solid #35465e !important;}');
    addGlobalStyle('.flag--one-true-post .post-permalink{border-top-color:#35465e;border-right-color:#35465e !important;}');
    addGlobalStyle('.popover--base-overlay{background:#35465e !important;}');
    addGlobalStyle('.popover_vendor .popover_menu_item:hover{color:#35465e !important;}');
    addGlobalStyle('.popover_vendor .popover_menu_item:hover .subtext,.popover_vendor .popover_menu_item:hover .subtext-email{color:#35465e !important;}');
    addGlobalStyle('.post_avatar{background-color:#35465e !important;}');
    addGlobalStyle('.post_avatar.flat{border-color:#35465e !important;}');
    addGlobalStyle('.post_avatar.lighter_blue{background-color:#35465e !important;}');
    addGlobalStyle('.post_avatar_link{background-color:none !important;}');
    addGlobalStyle('.flag--npf-text-colors .post .post_content .npf_color_frasier{color:#35465e !important;}');
    addGlobalStyle('.plus-follow-button{background:hsla(0,0%,100%,.2);background:hsla(0,0%,100%,.4);color:#35465e !important;}');
    addGlobalStyle('.logged-out-header .login-button{color:#35465e !important;}');
    addGlobalStyle('.tab-bar-container .tab_notice{color:#35465e !important;}');
    addGlobalStyle('.l-header-container--refresh{background-color:#35465e !important;}');
    addGlobalStyle('.mobile-banner .mobile-banner-button.secondary-cta{border-color:#35465e;background-color:#35465e;color:#00cf35 !important;}');
    addGlobalStyle('.mobile-banner .mobile-banner-button.secondary-cta.disabled,.mobile-banner .mobile-banner-button.secondary-cta.disabled.active,.mobile-banner'
                   +'.mobile-banner-button.secondary-cta[disabled],.mobile-banner .mobile-banner-button.secondary-cta[disabled]:active'
                   +'{border-color:#35465e; background-color:#35465e; color:rgba(0,207,53,.5) !important;}');
    addGlobalStyle('.app-gate .mobile-banner{background-color:#35465e !important;}');
    addGlobalStyle('.ui_notes .activity-notification.is_friend{color:#35465e;background-color:#f3f8fb !important;}');
    addGlobalStyle('.ui_notes .activity-notification.is_friend .activity-notification__activity{color:#35465e !important;}');
    addGlobalStyle('.ui_notes .activity-notification.is_friend .activity-notification__activity_main .activity,'
                   +'.ui_notes .activity-notification.is_friend .activity-notification__activity_main .activity a{color:#35465e !important;}');
    addGlobalStyle('.is-followed .post-activity-note-content .note-text .note-text-link{color:#35465e !important;}');
    addGlobalStyle('.is-followed .post-activity-note-content .note-added-tags,.is-followed .post-activity-note-content .note-added-text{color:#35465e !important;}');
    addGlobalStyle('.post-activity-header .subscription-status .outer{fill:#35465e !important;}');
    addGlobalStyle('.post-activity-header .subscription-status .bolt{fill:#35465e !important;}');
    addGlobalStyle('.post-activity-header .subscription-status.is-subscribed .inner{fill:#35465e !important;}');
    addGlobalStyle('.tumblr-blue.tx-button{border-color:#35465e;background-color:#35465e !important;}');
    addGlobalStyle('.tumblr-blue.disabled.active.tx-button,.tumblr-blue.disabled.tx-button,'
                   +'.tumblr-blue[disabled].tx-button,.tumblr-blue[disabled].tx-button:active{border-color:#35465e;background-color:#35465e;color:hsla(0,0%,100%,.5) !important;}');
    addGlobalStyle('.tab_notice .tab_notice_value{color:#35465e} !important;}');
    addGlobalStyle('.tab-notice--outlined{border-color:#35465e !important;}');
    addGlobalStyle('.blog_menu .tab_notice .tab_notice_value{color:#35465e !important;}');
    addGlobalStyle('.ui_search .search_query {background:#2e3d52');
    addGlobalStyle('.sidebar_link.explore_link{color:#9da6b1 !important;}');
    addGlobalStyle('.chrome.blue {background:#5da8d2; border-color:#5da8d2 !important;}');
    addGlobalStyle('.compose-button {fill:#5da8d2 !important;}');
    addGlobalStyle('.blue.tx-button{border:1px solid #5da8d2;background-color:#5da8d2; !important;}');
    addGlobalStyle('.blue.disabled.active.tx-button,.blue.disabled.tx-button,.blue[disabled].tx-button,.blue[disabled].tx-button:active'
                   +'{border-color:#5da8d2;background-color:#5da8d2;color:hsla(0,0%,100%,.5) !important;}');
    addGlobalStyle('.tab_notice{background-color:#5da8d2; !important;}');
    addGlobalStyle('.tab_notice .tab_notice_value{color:#001935 !important;}');
    addGlobalStyle('.selected .tab_notice{background:#5da8d2 !important;}');
    addGlobalStyle('.post-forms-glass{background-color:rgba(53, 70, 94, 0.9) !important;}');
    addGlobalStyle('.identity .controls_section .item:hover .follow:hover{background:#5da8d2;color:#fff !important;}');
    addGlobalStyle('.form-container .form-row.checkmark-row .option-radio:checked+.option-label:after{color:#5da8d2 !important;}');
    addGlobalStyle('.flag--one-true-post .follow-button--worded .follow-text{color:#5da8d2 !important;}');
    addGlobalStyle('.cta-blue-button{background-color:#5da8d2;border-color:#5da8d2 !important;}');
    addGlobalStyle('.cta-blue-button .tsp-opacity-overlay{border-color:#5da8d2 !important;}');
    addGlobalStyle('.cta-blue-button .cta-color-applied{color:#5da8d2 !important;}');
    addGlobalStyle('.form-container.success .success-message .message-text .message-link{color:#5da8d2 !important;}');
    addGlobalStyle('.post .post_content_inner.safemode .link,.post .post_content_inner.tagfiltering .link{color:#5da8d2 !important;}');
    addGlobalStyle('.post-content-text .tmblr-truncated .tmblr-truncated-link,.post-content-text .tmblr-truncated:after,'
                   +'.post .post_body .tmblr-truncated .tmblr-truncated-link,.post .post_body .tmblr-truncated:after,.reblog-content .tmblr-truncated .tmblr-truncated-link,'
                   +'.reblog-content .tmblr-truncated:after{color:#5da8d2; !important;}');
    addGlobalStyle('body.flag--npf-text-colors .post .post_content .npf_color_rachel{color:#5da8d2 !important;}');
    addGlobalStyle('.binary-switch input[type=checkbox]:checked~.binary-switch-track{background:#5da8d2 !important;}');
    addGlobalStyle('.ui_dialog .text a{color:#5da8d2 !important;}');
    addGlobalStyle('.ui_dialog .chrome.blue{background-color:#5da8d2 !important;}');
    addGlobalStyle('.plus-follow-button.blue,.plus-follow-button:hover{background:#5da8d2;color:#fff !important;}');
    addGlobalStyle('.reblog_follow_button .follow-text,.worded-follow-button .follow-text{color:#aaaaaa !important;}');
    addGlobalStyle('.compose-button{fill:#5da8d2 !important;}');
    addGlobalStyle('.messaging-share-post .messaging-share-post-message .compose-text-input-container .submit-button .submit{color:#5da8d2 !important;}');
    addGlobalStyle('.blue#glass_overlay, .blue#hello_glass, .blue.glass{ background:rgba(42, 61, 84, .9)!important;}');
    addGlobalStyle('.messaging-share-post .messaging-share-post-result .container{color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-share-post .messaging-share-post-search .selected-blog{background:#5da8d2 !important;}');
    addGlobalStyle('.messaging-share-post .messaging-share-post-external-networks .is-focused.messaging-share-post-external-network{color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-inbox .inbox-conversations .is-unread.inbox-conversation .name-container{color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-inbox .inbox-compose-toggle .compose-start{color:#5da8d2 !important;}');
    addGlobalStyle('.flag--messaging-new-empty-inbox .messaging-inbox .inbox-row .info-container .send-link,'
                   +'.messaging-inbox .flag--messaging-new-empty-inbox .inbox-row .info-container .send-link{color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-conversation--open .conversation-compose .compose-text-input-container .submit-button .submit{color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-conversation--open .conversation-header:not(.has-image){background-color:#5da8d2 !important;}');
    addGlobalStyle('.messaging-conversation--open .conversation-message-post .conversation-message-post--chat.message-container .icon{background:#5da8d2 !important;}');
    addGlobalStyle('.ui_notes .activity-notification .activity-notification__activity .activity-notification__activity_message '
                   +'.activity-notification__activity_reply .activity-notification__activity_reply_link{color:#5da8d2 !important;}');
    addGlobalStyle('.ui_notes .activity-notification .activity-notification__icon .note_follow{display:inline-block;color:#5da8d2 !important;}');
    addGlobalStyle('.overlay-container .indash_blog .overlay-wrapper .post_content_inner.safemode .link,.overlay-container .indash_blog .overlay-wrapper '
                   +'.post_content_inner.tagfiltering .link,.peepr-drawer.overlay-container .overlay-wrapper .post_content_inner.safemode .link,'
                   +'.peepr-drawer.overlay-container .overlay-wrapper .post_content_inner.tagfiltering .link{color:#5da8d2 !important;}');
    addGlobalStyle('.survey-body .tx-button{background-color:#fff;color:#5da8d2 !important;}');
    addGlobalStyle('.answer .post-activity-note-avatar .post-activity-avatar-link:after,.reply .post-activity-note-avatar .post-activity-avatar-link:after{background-color:#5da8d2}');
    addGlobalStyle('.post-activity-reply .submit{color:#5da8d2 !important;}');
    addGlobalStyle('.post-form--form.blocked{background-color:#5da8d2 !important;}');
    addGlobalStyle('.post-form--tag-editor .tag-label.hover-style,.post-form--tag-editor .tag-label.selected{color:#5da8d2 !important;}');
    addGlobalStyle('.overlay-button.active .icon{color:#5da8d2 !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button{background-color:#5da8d2 !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button:active{background-color:#5da8d2; !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area,.post-form--controls .controls-container '
                   +'.post-form--save-button .split-button .dropdown-area{border-color:#5da8d2;background-color:#5da8d2; !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area.disabled,.post-form--controls .controls-container '
                   +'.post-form--save-button .split-button .button-area.disabled.active,.post-form--controls .controls-container .post-form--save-button '
                   +'.split-button .button-area[disabled],.post-form--controls .controls-container .post-form--save-button .split-button .button-area[disabled]:active,'
                   +'.post-form--controls .controls-container .post-form--save-button .split-button .dropdown-area.disabled,.post-form--controls .controls-container '
                   +'.post-form--save-button .split-button .dropdown-area.disabled.active,.post-form--controls .controls-container .post-form--save-button '
                   +'.split-button .dropdown-area[disabled],.post-form--controls .controls-container .post-form--save-button .split-button '
                   +'.dropdown-area[disabled]:active {border-color:#5da8d2 !important; background-color:#5da8d2 !important;}');
    addGlobalStyle('.editor .over-bottom:after,.editor .over-top:before{background-color:#5da8d2 !important;}');
    addGlobalStyle('.popover--reblog-graph .reblog-graph-info-button{color:#5da8d2 !important;}');
    addGlobalStyle('.yam-plus-ad-container .ad-bg.bg-blue{background-color:#5da8d2 !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area:focus,.post-form--controls .controls-container '
                   +'.post-form--save-button .split-button .dropdown-area:focus{border-color:#67b4e0 !important; background-color:#67b4e0 !important;'
                   +'color:hsla(0,0%,100%,.9) !important;}');
    addGlobalStyle('.post-form--controls .controls-container .post-form--save-button .split-button .button-area:active,.post-form--controls .controls-container '
                   +'.post-form--save-button .split-button .dropdown-area:active {border-color:#67b4e0; background-color:#67b4e0; color:hsla(0,0%,100%,.8)} !important;}');
    addGlobalStyle('body.flag--always-opaque-peepr .ui_peepr_glass {background-color:#35465e !important;}');
    addGlobalStyle('.peepr .ui_peepr_glass {opacity:0.9 !important;}');
    addGlobalStyle('.post-forms-glass .post-forms-glass_active.active{background-color:rgba(42, 61, 84, .9) !important;}');
    addGlobalStyle('.ui_dialog_lock{background:rgba(42, 61, 84, .95) !important;}');
    addGlobalStyle('.post_full .post_permalink{border-top-color: #35465e;border-right-color: #35465e;}');
    addGlobalStyle('.toast{background:#35465e !important;}');
    addGlobalStyle('.toastr .toast .item.post{background-color:#3d3d3d !important;}');
    addGlobalStyle('.toastr .toast .item.question{background-color:#3d3d3d !important;}');
    addGlobalStyle('.audio-player{background: #a77ec4 !important;}');
    addGlobalStyle('.notification {border:0px !important;}');
    addGlobalStyle('.post_control::before {opacity:.7 !important;}');
    addGlobalStyle('.rapid-recs-container .rapid-recs {background-image:none; background-color:#35465e !important;}');
    addGlobalStyle('.radar .radar_footer .radar_avatar::before{background-image:none !important;}');
    addGlobalStyle('li.section_header.radar_header, #tumblr_radar {display:none}');

});