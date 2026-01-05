//
// Written by Glenn Wiking
// Script Version: 1.1.0
// Date of issue: 27/05/16
// Date of resolution: 27/05/16
//
// ==UserScript==
// @name        ShadeRoot PCloud
// @namespace   SRPC
// @include     *.pcloud.*
// @description Eye-friendly magic in your browser for Twitch
// @version     1.1.0
// @grant       none
// @icon		http://i.imgur.com/6wROLhZ.png
// @downloadURL https://update.greasyfork.org/scripts/20018/ShadeRoot%20PCloud.user.js
// @updateURL https://update.greasyfork.org/scripts/20018/ShadeRoot%20PCloud.meta.js
// ==/UserScript==

function ShadeRootPC(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPC (
	'body {color: #D7E0E4 !important;}'
	+
	'.main, #container {background-color: #111A1B !important;}'
	+
	'.lnav, .download-clients, .leftline, .content {background: #3B4242 !important;}'
	+
	'.spacen {border-top: 1px solid #2D363B !important; background-color: #282F2F !important;}'
	+
	'.errorBox {background-color: #A0C0CF !important; border-color: #3967B9 !important;}'
	+
	'hr {border-color: #456062 !important;}'
	+
	'.big-box-6 p .align-botto p {color: #DDD !important;}'
	+
	'.download-clients .platform {border: 1px solid #456062 !important; background-color: #222A2A !important;}'
	+
	/* COLOR */'.menu ul li a, .uplplc ul li a, .download-clients a, .platform, .main, .current, .headerunder, .name, .desc, input, .search-filter, .header .centr input::-moz-placeholder, .newfolder {color: #CEDDEC !important;}'
	+
	'.download-clients a, .platform:hover, .newfolder:hover {background-color: #1B2121 !important; border-color: #466A6C !important;}'
	+
	'.usedbarfill {background: #1BCED8 !important;}'
	+
	'.usedbar {background: #3E5563 !important; box-shadow: 0px 1px 0px rgba(38, 58, 66, 0.5), 0px 2px 1px rgba(0, 0, 0, 0.03) inset !important;}'
	+
	'.headerunder {background: rgb(59, 66, 66) !important; border-top: 1px solid #456062 !important;}'
	+
	'th {background: #222A2A !important; border-top: 1px solid #283C45 !important; border-bottom: 1px solid #283C45 !important;}'
	+
	'th:hover, tr:hover > td, .select_lang a:hover, .mnnew a.active:hover {background-color: #41697B !important}'
	+
	'.gridlist td, .gridlist th, .copyright a, .footer_mini a, .ctrl span {border: 1px solid #364E5D !important; text-shadow: 0px 1px 0px rgba(53, 126, 161, 0.5) !important;}'
	+
	'.file, .copyright a, .footer_mini a, .mnnew a li, .sel, .green-sep p, ._2 p {color: #B8CAD5 !important;}'
	+
	'.gear {background: #63A0BD !important; padding: 2px !important; border-radius: 10px !important;}'
	+
	'.footer_mini {border-top: 1px solid #2D363B !important;}'
	+
	'.select_lang, .mnnew:hover a.active {background: #2F3839 !important; color: #B8CAD5 !important;}'
	+
	'.select_lang a {border-bottom: 1px solid #364E5D !important; color: #B8CAD5 !important;}'
	+
	'.gridmanage, .mnnew a, input {background: #375663 !important; border: 1px solid #4680A5 !important;}'
	+
	'.mnnew a:hover, .mnnew a.opn, .mnnew a.active {background-color: #3B4951 !important;}'
	+
	'.newfolder {background: #222A2A !important; border: 1px solid #446C83 !important;}'
	+
	'.white-tip ul, .mnnew ul, .ctrl span {background: #222A2A !important; border-color: #222A2A !important;}'
	+
	'.tabcontent, .ctrl span:hover {background: #111A1B !important;}'
	+
	'.headerunder {border-bottom: 1px solid rgb(69, 96, 98) !important;}'
	+
	'.ctrl {border-bottom: 1px solid #587B87 !important;}'
	+
	'.ctrl span.sel {background-image: -moz-linear-gradient(50% 0% -90deg, #557486 0%, #123D54 100%) !important;}'
	+
	'.ctrl span, .current-lang, .answer_box, .current_box, .q_1, .textcontent ul li {color: #DDD !important;}'
	+
	'.ctrl span img {background: #D2E5ED !important;}'
	+
	'.hdrundertitle {text-shadow: 0px 1px 0px rgba(53, 126, 161, 0.5) !important; color: #B8CAD5 !important;}'
	+
	'.setbl td {background: #304047 !important; border-bottom: 1px solid #3A4C5C !important;}'
	+
	'h3 {border-bottom: 2px solid #3A4C5C !important;}'
	+
	'ul.lang > li ul {background-color: #283033 !important; color: #DDD !important;}'
	+
	'ul.lang > li ul li:hover {background: #34454D !important; color: #DDD !important;}'
	+
	'ul.lang > li ul li {border-bottom: 1px solid #455B66 !important; color: #DDD !important;}'
	+
	'.search-button {background-color: #4B9BB1 !important;}'
	+
	'.microheader-wrap, .footer-wrapper, .follow-buttons {background-color: #27343B !important;}'
	+
	'h2, h1, .footer-menu ul li a, .chosen, label, textarea, .txt, .textcontent a, .textcontent table tbody tr td, .textcontent p {color: #97CFDB !important;}'
	+
	'.cats {border-bottom: 1px solid #3E5E69 !important;}'
	+
	'.current_box {background-color: #27343B !important; border-bottom: 1px solid #2A586B !important;}'
	+
	'.answer_box {background-color: #0D0D0D !important;}'
	+
	'.micro-content .content .title, .micro-content .content h1 {border-bottom: 1px solid #21485A !important;}'
	+
	'.micro-content .content .question .choices_wrap a.quest_a:hover {background: #27363E url("/ZJb/images/faq-q-hover.png") no-repeat scroll right center !important; color: #C6D7E0 !important;}'
	+
	'.choices_wrap a.quest_a {border-bottom: 1px solid #13232C !important;}'
	+
	'.follow-line {background-color: #51778C !important;}'
	+
	'.flag {background: #36668F !important;}'
	+
	'.lang-box, .input-wrap {background: #13191D !important; box-shadow: 0px 1px 0px 0px #1A2023 !important;}'
	+
	'.footer-menu ul li a.active {border-bottom: 1px solid #779BB6 !important;}'
	+
	'.each-lang.current:hover {background: #304550 !important;}'
	+
	'.lang-box .other-langs {background: rgb(30, 45, 53) !important; box-shadow: 0px 1px 0px 0px #1A2023 !important;}'
	+
	'.first-col, .second-col, .third-col, .fourth-col, .fifth-col, .sixth-col, .seventh-col, .eighth-col {border-bottom: 1px solid #215078 !important;}'
	+
	'.ltr, #p_crypto .crypto_price_btn span, #p_crypto .crypto_free_btn span {color: #CBE5F0 !important;}'
	+
	'.contact-page .content, .press .content, .micro-content-wrap .content, .press_page_wrap {background: #0D0D0D !important;}'
	+
	'.form-control, .micro-content .content input, .micro-content .content select, .micro-content .content textarea {border: 1px solid #257195 !important;}'
	+
	'textarea {background: #617E8A !important;}'
	+
	'.elm-1, .elm-2, .elm-3 {color: #36545A !important;}'
	+
	'.btn-box-holder {background-color: #233530 !important;}'
	+
	'.content-box {background-color: #0E1518 !important;}'
	+
	'#p_crypto .section-2, #p_crypto .section-5, #p_crypto .section-7, #p_crypto .section-11 {background-color: #233530 !important;}'
	+
	'.small-box-12 .txt, .section-4 .txt p, .section-6 .txt p {color: #A6C1C6 !important;}'
	+
	'.t_bottom_txt {color: #19282F !important;}'
	+
	'.top-btn-box, .business-bg-2.loaded, .business-bg-3.loaded, .business-bg-1, .desktop-bg-2.loaded {opacity: .65 !important;}'
	+
	'.inner-box p, .green-sep p {color: #263039 !important;}'
	+
	'#p_business .section-4, #p_business .section-6 {background-color: #233136 !important;}'
	+
	'.section-7 {border-top: 1px solid #273B4E !important;}'
	+
	'.big-box-6 p {color: #ABBAC8 !important;}'
	+
	'.small-box-12 p, .business-bg-3 p {color: #263039 !important;}'
	+
	'.breadcrumb {background: #2C3942 !important;}'
	+
	'.breadcrumb a {background: #244050 !important;}'
	+
	'.payment-heading .inner {background-color: #0D0D0D};}'
	+
	'.pricing-crypto .pbox, h4.info {border-color: #5E6F3D !important; background-color: #353E25 !important;}'
	+
	'.pricing .pricing-crypto .pbox p.info, #p_desktop .section-6 p {color: #97C4D4 !important;}'
	+
	'.payment_box {border: 1px solid #2F4B54 !important; background: #4F5B63 !important;}'
	+
	'.desktop-bg-1 h1, .desktop-bg-1 h2, .drive_avail, #p_desktop .section-1 p {color: #D4E4EC !important;}'
	+
	'#p_desktop .section-1 {background-color: #11171A !important;}'
	+
	'#p_desktop .section-6 {border-bottom: 1px solid #345263 !important;}'
	+
	'#p_desktop .section-3 {background-color: #28404A !important;}'
	+
	'.sep {opacity: 0 !important; display: none !important;}'
	+
	'.desktop-bg-2, .desktop-bg-2 p, .section-4 p {color: #263039 !important;}'
	+
	'.blue_top {border-bottom: 1px solid #345A6C !important;}'
	+
	'.btn_dropdown {border: 1px solid #284556 !important;}'
	+
	'.blue_list {background: #555 !important;}'
	+
	'.blue_btn_drop {background: #293944 !important; border: 1px solid #375E7A !important;}'
	+
	'.blue_top {color: #DDD !important;}'
	+
	'.gear_inner {background-color: #3B5E6C !important; border-bottom: 1px solid #2E3841 !important; border-left: 1px solid #2E3841 !important; border-right: 1px solid #2E3841 !important;}'
	+
	'#p_mobile .small-box-12 p, #p_mobile .section-3 p, #p_mobile .section-1 p, #p_mobile .section-5 p, #p_mobile .section-7 p {color: #B9D0E4 !important;}'
	+
	'img {opacity: .85 !important;}'
	+
	'#p_mobile .section-5 {background-color: #0E1518 !important;}'
	+
	/* COLOR LIGHT */ '#p_web .section-7 p, #p_web .section-4 p, .notifylist-text, .notifylist-text b, .tggl {color: #B9D0E4 !important;}'
	+
	/* COLOR DARK */ ''
	+
	'#p_web .section-2, #p_web .section-4 {background-color: #17242A !important;}'
	+
	'.pbox {border-right: 1px solid #2D3B4A !important; opacity: .65}'
	+
	'.pbox {border-right: 1px solid #2D3B4A !important;}'
	+
	'.pbox.pbox-free.current .btn {background-color: #3E2B2B !important;}'
	+
	'.pricing-crypto .pbox {border-color: #5C654C !important; background-color: #35411D !important;}'
	+
	'.info-more-storage, h4.info {background-color: #26313B !important;}'
	+
	'.notifylist {background: #28343B !important;}'
	+
	'.notifylist-header {background-image: -moz-linear-gradient(50% 0% -90deg, #3E6069 0%, #263850 100%) !important; border-bottom: 1px solid #052E45 !important;}'
	+
	'.notifylist-item {background-color: #2A393E !important; border-bottom: 1px solid #152333 !important; color: #DDD !important;}'
	+
	'.notifylist-item:hover {background-color: #25575C !important;}'
	+
	'.modal-content {background: #37464A !important;}'
	+
	'.butt-area {background: #272829 !important;}'
	+
	'.album h4 {border-top: 1px solid #2E5460 !important; border-bottom: 1px solid #2E5460 !important; background: #1D2732 !important;}'
	+
	'.share-opts {background-color: #283D4A !important; color: #DDD !important;}'
	+
	'.cheader_up {background-color: #222A2A !important; border-color: #446C83 !important;}'
	+
	'.lastsel td {background: #172F4A !important;}'
	+
	'.ctrlcell span, .trg {background-color: #222A2A !important; border-color: #446C83 !important; color: #DDD !important; text-shadow: none !important;}'
	+
	'.infocell, .ftitle, .foldr {color: #DDD !important; text-shadow: none !important;}'
	+
	'.modal-files, .folderlist {border-top: 1px solid #4D5A66 !important; border-bottom: 1px solid #4D5A66 !important; background: #2D3D47 !important; color: #DDD !important;}'
	+
	'.modal {background: #293D3F !important;}'
	+
	'.share-all {background: #252D32 !important;}'
	+
	'.share-collaborators-list {border: 1px solid #254D6F !important; background: #324451 !important;}'
	+
	'.combo-contain {background: #324451 !important; border: 1px solid #254D6F !important;}'
	+
	'.combo-contain.focu {border: 1px solid #345565 !important; background-color: rgb(46, 61, 65) !important; opacity: .6 !important; color: #333 !important;}'
	+
	'.focu input {background: #21282F !important;}'
	+
	'.share-add textarea {border-color: #355B74 !important;}'
	+
	'.share-collaborators-list .share-entity .entity-permission .perm_box:hover, .share-add-holder .share-add-perm .perm_box:hover, .share-collaborators-list .share-entity .entity-permission .perm_box.opn, .share-add-holder .share-add-perm .perm_box.opn {background: #2D4148 !important; color: #DDD !important;}'
	+
	'.buy_crypto img {background: #608698 !important; padding: .5em !important; border-radius: 8px !important;}'
	+
	'.msg {background-color: #256475 !important; border: 1px solid #5E93BA !important; color: #DDD !important;}'
	+
	'.ico {background-color: #1BCED8 !important;}'
	+
	'.uplinfo {background: #282F2F !important;}'
	+
	'.pbox ul li, .pbox h3, .buy_box, .expired_txt {color: #555 !important;}'
	+
	'#main {border-right: 1px solid #2D404B !important;}'
	+
	'.widget li a:hover, a[rel="tag"] {color: #B8CAD5 !important;}'
	+
	'article[id*="post-"] {border-bottom: 1px solid #3B4E57 !important;}'
	+
	'footer[role="contentinfo"] {background-color: #1C4042 !important;}'
	+
	'.pagination li a {background-color: #1C4042 !important; color: #BCC6CE !important;}'
	+
	'.custom-background {background-color: #2F4853 !important;}'
	+
	'.page-header {border-bottom: 1px solid #394A54 !important;}'
	+
	'.entry-meta a, .category-archive-meta a, .more-link:hover, #sidebar .widget li a, .commentlist .vcard cite.fn a:hover, a:hover {color: #C9D4E0 !important;}'
	+
	'li.transfer.active, .secure-transfer.active {background: #407892 !important;}'
	+
	'.right_box input, .right_box textarea {border: 1px solid #28636F !important;}'
	+
	'.top_h1 span, .top_h2 span, .header_reg_link, .text, .txt h3, .txt ul li, .cont_inner, .cont_inner div, .cont_inner ul li {color: #DDD !important;}'
	+
	'.cont_wrap .section._1, .cont_wrap .section._3, .cont_wrap .section._5, .cont_wrap .section._7 {background-color: #21292F !important; border-bottom: 1px solid #163848 !important;}'
	+
	'.footer_in .s_btn {background: #1E6586 !important; border-color: #223E59 !important;}'
	+
	'.form_wrap .sep {background-color: #44697D !important;}'
	+
	'.footer_box {border-top: 1px solid #35667A !important; border-bottom: 1px solid #35667A !important;}'
	+
	'.top_h2 {border-bottom: 1px solid #395A72 !important;}'
	+
	'input:focus, textarea:focus {background-color: #2E4653 !important; border: 1px solid #3F6784 !important;}'
	+
	'.cont_wrap .section {background: #171F24 !important;}'
	+
	'.section._3 .box {background-color: #333F47 !important;}'
	+
	'.section._3 .txt ul {background-color: #333F47 !important;}'
	+
	'.section._5 .inner {background-color: #294B71 !important;}'
	+
	'.section._6 {background-color: #13181B !important;}'
	+
	'.cont_wrap .section._6 a, .cont_wrap .section._6 span {color: #A7CEE7 !important;}'
	+
	'.cont_wrap .section {border-bottom: 1px solid #284974 !important;}'
	+
	'.menu ul, .menu_mob ul {background-color: #334B5F !important; border: 1px solid #2A5F93 !important;}'
	+
	'.menu ul li a, .menu_mob ul li a {border-bottom: 1px solid #4E5E6C !important;}'
	+
	'.mid-content h3 {color: rgb(203, 227, 239) !important;}'
	+
	'.crypto_features ul li {#555 !important;}'
	+
	'.left .menu ul, .left .menu_mob ul {background-color: rgba(51, 75, 95, 0) !important; border: 1px solid rgba(42, 95, 147, 0) !important;}'
	+
	'.share-opts.has {border-color: #3F7486 !important;}'
	+
	'div.ctrlcell span, div.ctrlcellmore span {border: 1px solid #1E5A72 !important; background-image: linear-gradient(180deg, #2363B6 0%, #2E404B 100%) !important;}'
	+
	'.lgrgwrap {background: #2C3F4D !important; border-bottom: 1px solid #112E47 !important;}'
	+
	'.login-fields, .register-fields {background: #2C3F4D !important; border-top: 1px solid #53738A !important; border-bottom: 1px solid #53738A !important;}'
	+
	'.forgotpass {color: #DDD !important;}'
	+
	'label, .forgotpass, .copyright {text-shadow: none !important;}'
	+
	'.login-fields input, .register-fields input, .genericContainer input {box-shadow: 0px 1px 0px rgba(32, 35, 39, 0.5), 0px 2px 1px rgba(23, 42, 56, 0.35) inset !important;}'
	+
	'.checkeredbackground {opacity: .05 !important;}'
	+
	'.sharepublinknew, .dataandshortlink, .shareresults {background: #21323E !important;}'
	+
	'textarea {border-color: #1D576B !important;}'
	+
	'.publinkbottom {border-top: 1px solid #273D4A !important; background: #1D242A !important;}'
	+
	'.modal a {color: #B9C8D7 !important;}'
	+
	'.data {border-bottom: 1px solid #42586E !important;}'
	+
	'.sharebutton, .successBox {background-color: #387D9E !important;}'
	+
	'*::-moz-selection {background: #25374E !important;}'
	+
	'.desktop-bg-2 {background-color: #1A2D35 !important;}'
	+
	'.upload .status, .pupload .pupstatus {background: #293236 !important;}'
	+
	'.upload .tabcontrols {background: #15222C !important;}'
	+
	'.upload-container {background: #15222C !important;}'
	+
	'.upload .tabcontrols div.tabcontent {border-color: #406B83;}'
	+
	'.ina, .dropzone {background: #15222C !important;}'
	+
	'.menu .ina {background: rgba(0,0,0,0) !important;}'
	+
	'.tabcontent {border-color: #486680 !important;}'
	+
	'.dropzone {border: 2px dashed #356C7B !important;}'
	+
	'.dropzone:hover {background: #1B374B !important;}'
	+
	'.upload .status .progress, .pupload .pupstatus .progress, .home-bg-2.loaded, .home-bg-3.loaded {opacity: .85 !important;}'
	+
	'.upload .status .file, .pupload .pupstatus .file {border-bottom: 1px solid #3B6575 !important;}'
	+
	'.mobile-bg-3 h3 {color: rgb(68, 86, 90) !important;}'
	+
	'.footer-menu ul li a, .home_h1, .home_h2 {color: #98C0CB !important;}'
	+
	'.note, .gear_name, .avail_for, .load-bg p, .textcontent h3, .pcloud-accordion > div > div p, .space-note {color: #DDD !important;}'
	+
	'.micro-content .content .contactinv, .micro-content .content .contactsuccess {border-bottom: 1px solid #21485A !important;}'
	+
	'.content select {background-color: #617E8A !important;}'
	+
	'._gear .gear_inner .gear_top.nam {border-bottom: 1px solid #25425C !important;}'
	+
	'.logout_btn {border-top: 1px solid #21435C !important;}'
	+
	'.each-lang:hover {background: #2D5777 !important;}'
	+
	'.menu b, .menu_mob b, #p_home .section-1.loaded {background-image: none !important;}'
	+
	'.home-bg-2 p, .home-bg-3 p {color: #333 !important;}'
	+
	'#p_home .section-4 .current._1 .button, #p_home .section-4 .current._1 .button:hover {background-color: rgb(72, 59, 48) !important;}'
	+
	'.modal .sharetbl, .modal .sharetbl td {background: #263236 !important; border-bottom: 1px solid #2F4D5D !important;}'
	+
	'.modal-small {background: #15191A !important;}'
	+
	'.folderlist .sel {background: #16272F !important;}'
	+
	'.sel td {background: #234756 !important;}'
	+
	'.gridbox {border: 1px solid #35555D !important;}'
	+
	'.afinfo {border-top: 1px solid #273542 !important;}'
	+
	'.gridbox.sel {background: #293D48 !important; border: 1px solid #2B587E !important;}'
	+
	'.pcloud-accordion > div {border-bottom: 1px solid #324D5F !important;}'
	+
	'.pcloud-accordion > div.opened > h2.help-info-icon {background-color: #305462 !important;}'
	+
	'.pcloud-accordion > div.opened > div, .pcloud-accordion > div.changing > div {background: #111A1B !important;}'
	+
	'.pcloud-accordion > div > div .help-line-top {border-top: 1px solid #121F23 !important;}'
	+
	'.pcloud-accordion h3, .content ol li, .terms_privacy_header a {color: #9EC7DE !important;}'
	+
	'.pcloud-accordion > div > h2:hover {background-color: #2B4560 !important;}'
	+
	'.centertabs .tbs {border-bottom: 1px solid #254556 !important;}'
	+
	'.explain {border: 1px solid #2C414E !important; background: #263C4B !important; color: #9EC7DE !important;}'
	+
	'.space-header {opacity: .85 !important;}'
	+
	'.space-list li {background-color: #282F2F !important; border-bottom: 1px solid #394F5C !important;}'
	+
	'.space-list a, .help-text, ._18n {color: #CBDBEA !important;}'
	+
	'#space-content h3, .invite-form, .invites-header {background-color: #395C5F !important; border-top: 1px solid #1E4A4E !important; border-bottom: 1px solid #1E4A4E !important;}'
	+
	'.second-headline {border-top: 1px solid #374B53 !important;}'
	+
	'#invites li {background-color: #2A4651 !important; border-bottom: 1px solid #12313F !important;}'
	+
	'.space-header ._18n {color: #25374E !important;}'
	//+
	//'body {display: none !important;}'
);