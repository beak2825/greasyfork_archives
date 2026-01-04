// ==UserScript==
// @name       Traders Lounge Ph
// @namespace  tradersloungeph
// @version    1.0.5
// @date       05-05-2020
// @author     nijevazno
// @description  Night Themes for Traders' Lounge
// @match      https://tradersloungeph.com/forum/*
// @copyright  nijevazno 2020
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @license    GPLv3
// @run-at     document-start
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402666/Traders%20Lounge%20Ph.user.js
// @updateURL https://update.greasyfork.org/scripts/402666/Traders%20Lounge%20Ph.meta.js
// ==/UserScript==

$(document).ready(function () {

    GM_addStyle("body, .ast-separate-container {background-color: #24344d;}.ast-theme-transparent-header .main-header-bar, .ast-theme-transparent-header.ast-header-break-point .main-header-bar-wrap .main-header-menu, .ast-theme-transparent-header.ast-header-break-point .main-header-bar-wrap .main-header-bar {background-color: #192231;color:color: rgba(225,235,245,.9);}.elementor-column-gap-narrow>.elementor-row>.elementor-column>.elementor-element-populated {padding: 0;}.elementor-18 .elementor-element.elementor-element-5d6e61e:not(.elementor-motion-effects-element-type-background), .elementor-18 .elementor-element.elementor-element-5d6e61e > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-image: none;}#wpforo-wrap, #wpforo-wrap .wpf-breadcrumb div:after {color: rgba(225,235,245,.9);background: #24344d;}#wpforo-wrap .wpf-breadcrumb a, #wpforo-wrap #wpforo-title {color: rgba(225,235,245,.9);}#wpforo-wrap .wpf-breadcrumb div.active {background: #1c2636;color: rgba(225,235,245,.9);}#wpforo-wrap .wpf-breadcrumb div.active:after {background: #1c2636;}#wpforo-wrap .wpfl-2 .wpforo-post .wpf-right {background: #24344d;color: #fff;}#wpforo-wrap .wpfl-2 .wpforo-post .wpf-left {background: #24344d;color: #fff;}#wpforo-wrap .wpfl-2 .wpforo-post .wpf-right .wpforo-post-content-bottom { border-top: #43536d 1px solid; background: #24344d;}#wpforo-wrap .wpfl-2 .wpforo-post {background-color: #24344d;}#wpforo-wrap .wpfl-2 .post-wrap { margin-bottom: 10px; border: #ced9e5 solid 1px;}.elementor-18 .elementor-element.elementor-element-73512933 > .elementor-widget-container{border:none;}#wpforo-wrap html, #wpforo-wrap body, #wpforo-wrap div, #wpforo-wrap span, #wpforo-wrap applet, #wpforo-wrap object, #wpforo-wrap iframe, #wpforo-wrap h1, #wpforo-wrap h2, #wpforo-wrap h3, #wpforo-wrap h4, #wpforo-wrap h5, #wpforo-wrap h6, #wpforo-wrap p, #wpforo-wrap blockquote, #wpforo-wrap pre, #wpforo-wrap abbr, #wpforo-wrap acronym, #wpforo-wrap address, #wpforo-wrap big, #wpforo-wrap cite, #wpforo-wrap code, #wpforo-wrap del, #wpforo-wrap dfn, #wpforo-wrap em, #wpforo-wrap img, #wpforo-wrap ins, #wpforo-wrap kbd, #wpforo-wrap q, #wpforo-wrap s, #wpforo-wrap samp, #wpforo-wrap small, #wpforo-wrap strike, #wpforo-wrap sub, #wpforo-wrap sup, #wpforo-wrap tt, #wpforo-wrap var, #wpforo-wrap b, #wpforo-wrap u, #wpforo-wrap i, #wpforo-wrap center, #wpforo-wrap dl, #wpforo-wrap dt, #wpforo-wrap dd, #wpforo-wrap ol, #wpforo-wrap ul, #wpforo-wrap li, #wpforo-wrap fieldset, #wpforo-wrap form, #wpforo-wrap label, #wpforo-wrap legend, #wpforo-wrap table, #wpforo-wrap caption, #wpforo-wrap tbody, #wpforo-wrap tfoot, #wpforo-wrap thead, #wpforo-wrap tr, #wpforo-wrap th, #wpforo-wrap td, #wpforo-wrap article, #wpforo-wrap aside, #wpforo-wrap canvas, #wpforo-wrap details, #wpforo-wrap embed, #wpforo-wrap figure, #wpforo-wrap figcaption, #wpforo-wrap footer, #wpforo-wrap header, #wpforo-wrap hgroup, #wpforo-wrap menu, #wpforo-wrap nav, #wpforo-wrap output, #wpforo-wrap ruby, #wpforo-wrap section, #wpforo-wrap summary, #wpforo-wrap time, #wpforo-wrap mark, #wpforo-wrap audio, #wpforo-wrap video {padding: 0 5px;}#wpforo-wrap .wpforo-subtop, #wpforo-wrap .wpf-head-bar {padding: 0 5px;}#wpforo-wrap .wpfl-2 .wpforo-post .wpf-right .wpforo-post-content a {color: #81c7f9;}#wpforo-wrap .wpforo-post .wpforo-post-signature {border-top: #ced9e5 1px dotted;color: #c1bfbf;}#wpforo-wrap .wpforo-post blockquote, #wpforo-wrap .wpforo-revision-body blockquote { background: #566275;}#wpforo-wrap a {color: #81c7f9;}#wpforo-wrap div, .wpf-prof-data span {color: #fff!Important;}.wpfbg-9 {background-color: #24344d!important;}#wpforo-wrap #wpf-post-create {border: solid #ced9e5 1px;background-color: #24344d;}div.mce-panel {background: #24344d!Important;}.mce-toolbar .mce-btn-group .mce-btn.mce-active, .mce-toolbar .mce-btn-group .mce-btn:active, .qt-dfw.active {background: #3f516d!Important;}.mce-toolbar .mce-btn-group .mce-btn:focus, .mce-toolbar .mce-btn-group .mce-btn:hover, .qt-dfw:focus, .qt-dfw:hover {background: #425571!Important;}#wpforo-wrap .mce-caret {border-top: 4px solid #fff!important;} .mce-toolbar .mce-btn:hover .mce-open{border: #fff;}#wpforo-wrap .wpf-navi .wpf-navi-wrap .wpf-page-info {color: #fafafa;}#wpforo-wrap .wpf-breadcrumb div:hover,#wpforo-wrap .wpf-breadcrumb div:hover:after {background: #1c2636;}#wpforo-wrap .wpfl-2 .wpforo-forum, #wpforo-wrap .wpfl-2 .topic-wrap, #wpforo-wrap .wpfl-2 .wpforo-topic, #wpf-widget-profile .wpf-prof-notifications .wpf-notifications {background-color: #192231;}#wpforo-wrap .wpfl-2 .forum-wrap, #wpforo-wrap .wpfl-2 .topic-wrap {border-top: 0;margin-bottom: 10px;}#wpforo-wrap #wpforo-stat-body { border: #24344d 1px solid;background: #24344d;}#wpforo-wrap #wpforo-stat-body .wpf-stat-item i, #wpforo-wrap #wpforo-stat-body .wpf-stat-item .wpf-stat-value, #wpforo-wrap #wpforo-stat-body .wpf-stat-item .wpf-stat-label {color: #fff!Important;}#wpforo-wrap .wpforo-content {width: 70%;}#wpforo-wrap .wpforo-right-sidebar {width: 30%;}#wpforo-wrap pre { border: 0; background: #566275; padding: 5px!Important;}#wpf-widget-profile .wpf-widget-alerts.wpf-new i, #wpf-widget-profile .wpf-widget-alerts .wpf-alerts-count {color: #f42d2c;}#wpf-widget-profile .wpf-notifications .wpf-notification-content li:hover {background: #0367bf;}#wpforo-wrap .wpforo-recent-wrap .wpforo-recent-content .wpf-ttr, #wpforo-wrap .wpf-table .wpfw-1 .wpf-field:nth-child(even), #wpforo-wrap .wpforo-profile-wrap .h-header .wpfy {background: #1c2636;}.wpfcl-1 {color: #fff!important;}#wpforo-wrap .wpforo-profile-wrap .h-header .wpfy { width: 100%;left: 0;}#wpforo-wrap .wpf-field input[type=text], #wpforo-wrap .wpf-field input[type=password], #wpforo-wrap .wpf-field input[type=email], #wpforo-wrap .wpf-field input[type=date], #wpforo-wrap .wpf-field input[type=number], #wpforo-wrap .wpf-field input[type=url], #wpforo-wrap .wpf-field input[type=tel], #wpforo-wrap .wpf-field textarea, #wpforo-wrap .wpf-field select {box-shadow: none !Important;color: #000;}#wpforo-wrap .wpf-tools, #wpforo-wrap .wpforo-sbn-content .wpf-sbs-bulk-options .wpf-sbs-cat {background: #1c2636;border-bottom: none; outline: none;}#wpforo-wrap .wpforo-sbn-content .wpf-sbs-bulk-options {background: #1c2636; border: none;border-left: none;}#wpforo-wrap .wpforo-login-wrap .wpforo-login-content h3 {color: #fafafa;}#wpforo-wrap .wpforo-login-wrap .wpforo-login-table, #wpforo-wrap .wpforo-login-wrap .wpforo-table .wpfw-1 .wpf-field:nth-child(even) {background-color: #192231;}#wpforo-wrap .wpfl-1 .wpforo-post, #wpforo-wrap .wpfl-1 .wpforo-forum {background-color: #1c2636;}#wpforo-wrap .wpfl-1 .post-wrap {border-bottom: none!Important;}#wpforo-wrap .wpforo-post blockquote, #wpforo-wrap .wpforo-revision-body blockquote {border: none;}#wpforo-wrap .wpforo-profile-wrap .h-picture .avatar {box-shadow: none;}.wpfbg-7 {background-color: #1c2636!important;}#wpforo-wrap .wpfl-1 .wpforo-topic {background-color: #1c2636;}#wpforo-wrap .wpforo-post .wpforo-post-content img, #wpforo-wrap .wpforo-revision-body img {border: none;background: none;}#wpforo-wrap.wpf-dark .wpf-notifications .wpf-notification-content li:hover, #wpf-widget-profile.wpf-dark .wpf-notifications .wpf-notification-content li:hover {background: #8e0026a3;}");
    
    var customCSS = '<style>.scrollup{width:21px;height:21px;text-indent:-9999px;z-index:9999;opacity:.5;position:fixed;bottom:40px;right:20px;display:none;background:url(https://raw.githubusercontent.com/macsabile/TipidPColor/master/src/img/scrollUp.png) no-repeat}.scrollup:hover{opacity:1}</style>';
    var settingDialog = '<a href="#" class="scrollup" title="Scroll to Top">Scroll to Top</a>';

    $('#colophon').remove();
    $('#wpforo-poweredby').remove();

    $('head').append(customCSS);
    $('body').append(settingDialog);

    //add scroll to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
});
