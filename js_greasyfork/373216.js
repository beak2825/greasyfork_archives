// ==UserScript==
// @name         Strona MIUIPolska.pl - czarny tryb
// @namespace    https://github.com/kacskrz/miuipolska-dark-mode
// @version      0.5
// @description  Czarny motyw dla strony MIUIPolska.pl
// @author       Orjon (kacskrz@gmail.com)
// @match        *://miuipolska.pl/*
// @exclude     *://miuipolska.pl/forum
// @exclude     *://miuipolska.pl/wp-admin
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373216/Strona%20MIUIPolskapl%20-%20czarny%20tryb.user.js
// @updateURL https://update.greasyfork.org/scripts/373216/Strona%20MIUIPolskapl%20-%20czarny%20tryb.meta.js
// ==/UserScript==
GM_addStyle('#main-container, .tm-toggle-button-wrap a { background-color: #231f1f;');
GM_addStyle('.home-slider-wrap .ls-wp-container { border: 1px solid #3c3030;');
GM_addStyle('h3, h3 a { color: #e7e9ea;');
GM_addStyle('h4.spb-heading span:before, h4.spb-heading span:after, h3.spb-heading span:before, h3.spb-heading span:after, h4.lined-heading span:before, h4.lined-heading span:after { border-color: #c72a00;');
GM_addStyle('.recent-post { background: #231f1f;');
GM_addStyle('h5, h5 a { color: #e7e9ea;');
GM_addStyle('body, input[type="text"], input[type="password"], input[type="email"], textarea, select, .ui-state-default a { color: #ccc3c3;');
GM_addStyle('h4, h4 a, .carousel-wrap > a { color: #e7e9ea;');
GM_addStyle('.recent-posts-list li.mm-miuis { border: 1px solid #e8ddbd;');
GM_addStyle('.recent-posts-list li.mm-miuis a { color: #e7e9c9;');
GM_addStyle('.spb_box_text.whitestroke .box-content-wrap { background-color: #231f1f;');
GM_addStyle('.widget_sf_infocus_widget .infocus-item { background-color: #403b3b;');
GM_addStyle('.widget_sf_infocus_widget .infocus-item h5 a { color: #e7e9ea;');
GM_addStyle('.page-heading { background-color: #191616;');
GM_addStyle('.alt-bg { border-color: #f04e23;');
GM_addStyle('.page-heading h1, .page-heading h3 { color: #ececec;');
GM_addStyle('#breadcrumbs { color: #928e8e;');
GM_addStyle('#breadcrumbs a, #breadcrumb i { color: #8a868a;');
GM_addStyle('.sidebar .widget-heading h4 { color: #ececec;');
GM_addStyle('.alert.alert-success { background-color: #39540b;');
GM_addStyle('.alert { color: #ececcb;');
GM_addStyle('#back-to-top { background-color: #3e3838;');
GM_addStyle('h2, h2 a { color: #e7e9ea;');
GM_addStyle('code { background: #060606;');
GM_addStyle('.recent-posts-list li .recent-post-title { color: #ececec;');
GM_addStyle('a, .ui-widget-content a { color: #c7bbbe;');
GM_addStyle('h1, h1 a { color: #e7e9ea;');
GM_addStyle('.masonry-items .blog-item .masonry-item-wrap { background: #2b2626;');
GM_addStyle('ul.bar-styling li > a, ul.bar-styling li > span, ul.bar-styling li > div, ul.bar-styling li > form input { background-color: #a02808;');
GM_addStyle('#footer .recent-posts-list li .recent-post-title { background: #222222;');
GM_addStyle('h6, h6 a { color: #e7e9ea;');
GM_addStyle('.wp-embed-heading a { color: #d2d6da;');
GM_addStyle('.wp-embed { background: #000;');