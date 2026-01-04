// ==UserScript==
// @name         [DP] Dark/Orange
// @name:tr      [DP] Koyu/Turuncu
// @version      2.0
// @description  Go gentle into that good night!
// @description:tr  Karanlığı kucakla!
// @author       nht.ctn & hasangdr

// @match        https://www.planetdp.org/
// @match        https://www.planetdp.org/*
// @include      *://*planetdp.org/
// @include      *://*planetdp.org/*

// @icon         data:image/png;base64,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

// @grant        GM_addStyle
// @run-at       document-body
// @namespace https://twitter.com/hasangdr
// @downloadURL https://update.greasyfork.org/scripts/376953/%5BDP%5D%20DarkOrange.user.js
// @updateURL https://update.greasyfork.org/scripts/376953/%5BDP%5D%20DarkOrange.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS'ler

    var styles =`


/* Portal top logo*/
body > section > header > div.head-down > div > nav > div > div.navbar-header > a > img { filter: hue-rotate(337deg);}


/*Footer logo*/
body > section > footer > div > div.footer-down > img { filter: hue-rotate(337deg);}


/* İzleme listem taşma düzeltmesi*/
body > section > section > div > section > div > div.row .row {margin-right: 0px;margin-left: 0px;}


/*Portal üst bar*/
.head-up{ height:auto; background:#222831; }
.head-down{ /* background: url(v2/image/xhead-down-bg.png.pagespeed.ic.ENNSgNobG3.webp) left top repeat-x; */ background: #1a1e25;}


/*Portal top arama butonu*/
.search-btn { /* background: url(v2/image/xsearch-btn.jpg.pagespeed.ic.uN2MD7aDEC.webp) left top repeat-x; */ color: #fff; background: #d65a31; height: 40px; line-height: 40px;}


/*Gezintisi çubuğu*/
.navbar-default .navbar-nav>.active>a, .navbar-default .navbar-nav>.active>a:focus, .navbar-default .navbar-nav>.active>a:hover{ font-size:18px; font-weight:700; color:#cccccc;}
.navbar-default .navbar-nav>li>a{ font-size:18px; font-weight:700; color:#cccccc; padding:23px 20px; background:url(../image/mid-nav-line.png) right top no-repeat;background: #1a1e25;}
.navbar-default .navbar-nav>li>a:focus, .navbar-default .navbar-nav>li>a:hover { color: #d65a31!important;background: #1a1e25;}
.navbar-default .navbar-nav>.open>a, .navbar-default .navbar-nav>.open>a:focus, .navbar-default .navbar-nav>.open>a:hover{ background:#1a1e25; color:#d65a31!important;}


.head-input{background:#222831; border:solid 1px #393e46;}


/*Gezinti çubuğu, kullanıcı düşer menüsü */
.dropdown-menu.user-dropdown{ background:#222831; border:1px solid #393e46;}
.user-dropdown li a{ color:#cccccc;}
.user-dropdown li a:hover{ color:#cccccc;}
.dropdown-menu > li > a:focus, .dropdown-menu > li > a:hover{ color:#d65a31;}
#navbar > ul > li.dropdown.open {background:#222831; color:#cccccc;}
#navbar > ul > li > ul {background:#222831; color:#cccccc;}
#navbar > ul > li > ul:hover {color:#d65a31;}
.nav .open>a, .nav .open>a:focus, .nav .open>a:hover {border-color: #d65a31;}
.navbar-default .navbar-nav>li>a {border-color: #393e46;}
#navbar > ul > li.dropdown.open > ul > li > a {color:#cccccc;}
#navbar > ul > li.dropdown.open > ul > li > a:hover {color:#d65a31;}
.navbar-collapse {border-top: 1px solid transparent;-webkit-box-shadow: inset 0 1px 0 transparent; box-shadow: inset 0 1px 0 transparent;}
.navbar-default .navbar-collapse, .navbar-default .navbar-form { border-color: #e7e7e700;}


/*Kullanıcı menüsü dropdown*/
.user-drop { background: #222831;  border: solid 1px #393e4600;}
.user-drop ul li a { color: #cccccc;}
.user-menu {    background: #222831;    border: solid 1px #393e46;}
.user-menu .seperator {    border-left: 2px solid #393e46;}
.user-menu .dropdown-menu.user-dropdown:after {    border-color: transparent #8e000000 #393e46;}
.user-buttons .open>.dropdown-toggle {    color: #d65a31;}


/*Son tweetler*/
.tweet-list {background: #505865;}
.tweet-list p a:hover {color:#d65a31;}


/*Footer*/
.footer-down span a {color: #d65a31;}
.foot-nav h5 {color: #d65a31;}
.footer {background: #222831;}
.foot-social ul li a:hover {background: #d65a31;}
.foot-social ul li a {background: #393e46;border-radius: 3px;}
.foot-nav ul li a:hover {color: #d65a31;}
.footer-down {border-top: dashed 1px #505865;}


/*Kullanıcı menüsündeki sayaçlar*/
/*#srcform > div > ul > li > ul > li > a > span {background-color: #d65a31;}
#srcform > div > ul > li > a > span {background-color: #d65a31;}
#srcform > div > ul > li > a > span {margin: 0px -3px 19px 0;}*/
.badge {background-color: #d65a31;}
.user-menu>ul>li>a>span.badge { background-color: #d65a31;}


/* En çok indirilen filmler widget*/
.mv-list h6{color:#000000; font-weight:700; padding-bottom:8px;}
.mv-list h6 span{color:#d65a31;}
.mv-list h6 i{color:#d65a31;}
ul.mv-tab{background:#393e46;}
.mv-tab li a{ color:#ffffff;}
#mv-tab1 > div { background: url(v2/image/xmv-bg.png.pagespeed.ic.6NDOMyb7oy.png) right bottom no-repeat #393e46!important;}
#mv-tab2 > div { background: url(v2/image/xmv-bg.png.pagespeed.ic.6NDOMyb7oy.png) right bottom no-repeat #393e46!important;}
#mv-tab3 > div { background: url(v2/image/xmv-bg.png.pagespeed.ic.6NDOMyb7oy.png) right bottom no-repeat #393e46!important;}
#mv-tab4 > div { background: url(v2/image/xmv-bg.png.pagespeed.ic.6NDOMyb7oy.png) right bottom no-repeat #393e46!important;}
.mv-loop:hover{background:#2b2f3599;color:#cccccc!important;}
.mv-loop.active{background:#2b2f35;color:#cccccc!important;}
.mv-loop-left h5{color:#ffffff;}
.mv-loop-left span{color:#ffffff;}
.mv-loop-left p{color:#d65a31!important;}
.mv-loop-left p:hover{color:#d65a31!important;}
.mv-loop-right{background:#2b2f3599; border-bottom:solid 1px #2b2f3599;}
.mv-loop-right em{background:#2b2f3599; border:solid 6px #393e46;color:#fff;}
.mv-loop:hover .mv-loop-right em {border: solid 6px #393e46;}
.mv-loop a:hover {color:#d65a31;}

/* En çok indirilen diziler widget*/
.series .mv-content { background: url(v2/image/xms-bg.png.pagespeed.ic.kipnod9OxV.png) right bottom no-repeat #505865!important;}
#mv-tab6 > div { background: url(v2/image/xms-bg.png.pagespeed.ic.kipnod9OxV.png) right bottom no-repeat #505865!important;}
#mv-tab7 > div { background: url(v2/image/xms-bg.png.pagespeed.ic.kipnod9OxV.png) right bottom no-repeat #505865!important;}
#mv-tab8 > div { background: url(v2/image/xms-bg.png.pagespeed.ic.kipnod9OxV.png) right bottom no-repeat #505865!important;}
.series .mv-loop:hover { background:#363e4a99;}
.series .mv-loop.active{ background:#363e4a99;}
.series.mv-list h6 i{color:#d65a31;}
.series.mv-list h6 span{color:#d65a31;}
.series ul.mv-tab{ background:#505865;}
.series .mv-loop-left p{ color:#d65a31!important;}
.series .mv-loop-right{ background:#363e4a99; border-bottom:solid 6px #363e4a00;}
.series .mv-loop-right em{background:#363e4a99;border:solid 6px #505865;color:#fff;}
.series .mv-loop:hover .mv-loop-right em{border:solid 6px #363e4a99;}
.series .mv-loop.active .mv-loop-right em{border:solid 6px #363e4a99;}
.translation{background:#e7e7e7;}
.series .mv-loop:hover .mv-loop-right em {border: solid 6px #505865;}


/* Haber Sayfası Widget */
.mv-tab .ui-tabs-active .ui-tabs-anchor { opacity: 1; color: #d65a31;}
.mv-tab li a:hover { opacity: 1; color: #d65a31;}
.dropdown-tab-container>.mv-tab {  border: solid #d65a31;   border-width: 0 1px 1px 1px;}
.mv-loopn a:hover { color: #d65a31!important;}

/* En Yeni Haberler Widget*/
.tab-theme1 label { color: #d65a31;}
.tab-theme1 .mv-tab { background: #393e46;}
.tab-theme1 .mv-loopn { background: #393e46;}
.tab-theme1 .mv-loopn:hover { background: #2b2f35;}
.tab-theme1 article .mv-loopn-left p { color: #d65a31;}

/* En Çok Okunan Haberler Widget*/
.tab-theme2 label { color: #d65a31;}
.tab-theme2 .mv-tab { background: #505865;}
.tab-theme2 .mv-loopn { background: #505865;}
.tab-theme2 .mv-loopn:hover { background: #363e4a;}
.tab-theme2 article .mv-loopn-left p { color: #d65a31;}

/* En Çok Yorumlanan Haberler Widget*/
.tab-theme3 label { color: #d65a31;}
.tab-theme3 .mv-tab { background: #393e46;}
.tab-theme3 .mv-loopn { background: #393e46;}
.tab-theme3 .mv-loopn:hover { background: #2b2f35;}
.tab-theme3 article .mv-loopn-left p { color: #d65a31;}

/* En Çok Beğeni Alan Haberler Widget*/
.tab-theme4 label { color: #d65a31;}
.tab-theme4 .mv-tab { background: #505865;}
.tab-theme4 .mv-loopn { background: #505865;}
.tab-theme4 .mv-loopn:hover { background: #363e4a;}
.tab-theme4 article .mv-loopn-left p { color: #d65a31;}

/* En Çok Haber Gönderenler Widget */
.tab-theme5 label { color: #d65a31;}
.tab-theme5 .mv-contentn:not(.sub-tabs) { background: #393e46!important;}
.tab-theme5 .mv-tab {  background: #393e46;}
.tab-theme5 .mv-loop:hover { background: #2b2f35;}
.tab-theme5 article .mv-loop-right {  background: none; border-bottom: solid 1px #393e46;}
.tab-theme5 .mv-loop-right:hover {  border-bottom: solid 1px #2b2f35;}


.dosya_main table tr th{background-color:#d65a31;}
.rowhead th { background-color: #d65a31;}


/*Bugün ne izledim yorum zemini*/
.todaycontainer > .alpa_main_bott > .modal-content { background: #1a1e25!important;}


figcaption > h4 > a { color: #d65a31;}


/*Anasayfa altyazıların devamını göster butonu*/
#hepsi-tab1 > div.select { background: #d65a31;}
/*#hepsi-tab1 > div.select > a > h2 > img { filter: hue-rotate(45deg) contrast(0.5);}*/
#hepsi-tab2 > div.select { background: #d65a31;}
/*#hepsi-tab2 > div.select > a > h2 > img { filter: hue-rotate(45deg) contrast(0.5);}*/
#movie-tab1 > div.select  { background: #d65a31;}
#movie-tab2 > div.select  { background: #d65a31;}
#series-tab1 > div.select { background: #d65a31;}
#series-tab2 > div.select { background: #d65a31;}
#anime-tab1 > div.select  { background: #d65a31;}
#anime-tab2 > div.select  { background: #d65a31;}
#drama-tab1 > div.select  { background: #d65a31;}
#drama-tab2 > div.select  { background: #d65a31;}


body > section > section > div > section > div:nth-child(3) > div.select { background: #393e46;}


.blog .ui-tabs-active .ui-tabs-anchor { background-color: #d65a31!important;}
.blog li a {  background-color: #d65a317d!important; color:#cccccc!important;}
.blog li a:hover { background-color: #d65a31!important;}


.theater-tab .ui-tabs-active .ui-tabs-anchor { border: solid 1px #d65a31!important; background: #000!important;}
.theater-tab li a {  background: #d65a31!important; border: solid 1px #d65a31!important;}


#movielistform > button { background: #d65a31!important; border-color: #c5542e!important;}


body > section > section > div > section.sec-three > div > div.video-sec > div > div.owl-demo.owl-carousel.owl-theme > div.owl-wrapper-outer > div > div > article > p > a { color: #d65a31!important;}


/* Sosyal Medya Widget */
.site-link{ width:100%; float:left; margin-bottom:20px;}
.site-link h5{ color:#fff; background:#505865;}
.site-link ul li a{ background:#505865; color:#ffffff; border-bottom:solid 1px #fff;}
.site-link ul li a span{ color:#cccccc;}
.site-link ul li a:hover{ background:#363e4a; color:#fff;}
.site-link ul li a span:hover{ color:#fff;}
.social-icon ul li a i{ border-right: solid 1px #222831;}


/* Forumdan en son başlıklar tablosu*/
.planet-tab .ui-tabs-active .ui-tabs-anchor {background:#d65a31!important; color:#fff;}
.planet-table .table tr td{ border:none; border-bottom:solid 1px #222831;}
.planet-table .table-striped > tbody > tr:nth-of-type(2n+1){ background:#2d323a;}
.planet-table .table-striped > tbody > tr:nth-of-type(2n+1):hover{ background:#222831;}
.planet-table .table-striped > tbody > tr:nth-of-type(2n+2){ background:#393e46;}
.planet-table .table-striped > tbody > tr:nth-of-type(2n+2):hover{ background:#222831;}
.planet-table .table tr td.t1{ color:#000000;}
.planet-table .table tr td.t1 i{color:#cccccc; margin:0 8px 0 5px;}
.planet-table .table tr td.t2{ width:20%; color:#8eceff;}
.planet-table .table tr td.t2 img{ margin-right:8px; }
.planet-table .table tr td.t3{ width:20%; color:#cccccc;}
.planet-table .table tr td.t3 i{ margin-right:5px;}
.planet-tab li a{ background:#393e46; color:#cccccc;}
.planet-tab li a:hover{background:#2b2f35;}


/*Tooltip*/
.tooltip-inner { background: #2b2f35; color: #cccccc; border-color:#cccccc;}
.tooltip-bottom .tooltip-arrow {background: #2b2f35;border-bottom-color: #2b2f35!important;}
.tooltip-arrow {border-bottom-color: #2b2f35!important;}


/*Altyazı bekleme listesi oku*/
.popover.top>.arrow:after {border-top-color: #393e46;}


/*Yapım listesi Kart overlayer*/
.featured_list figure:hover .infoLayer {    /* background: url(v2/img_hover/xgray_bg.png.pagespeed.ic.lNnT3hNt7I.webp) left top repeat; */    opacity: 1;    display: block;    background: #d65a31c7!important;}


/*Filterleme butonu*/
body > section > section > div > section > div > div > section > form > div > div > div > button {background: #d65a31!important; border-color: #c5542e!important;}
body > section > section > div > section > div > div > section > form > div > div > div > button:hover { background-color: #ea7750!important; border-color: #c5542e!important;}
body > section > section > div > section > div > div > section > section > form > div > div > div > button {background: #d65a31!important; border-color: #c5542e!important;}
body > section > section > div > section > div > div > section > section > form > div > div > div > button:hover {background: #ea7750!important; border-color: #c5542e!important;}


/*Yorum raporlama butonu*/
#btnreport {background: #d65a31!important; border-color: #c5542e!important;}
#btnreport:hover { background-color: #ea7750!important; border-color: #c5542e!important;}


/*Raporlama penceresi*/
#reportglobal > h3 {margin-bottom: 10px;}
#reportModal > div > div > div.modal-header > h3 {margin-bottom: 10px;}


/*Çeviri duyurularında kullanıcı adı*/
body > section > section > div > section > div > div > div.col-md-9.col-sm-9.left-panel > div > div > article > div > div.col-md-9.col-sm-9.translate_list-right > div > span > a {color:#d65a31;}
body > section > section > div > section > div > div > div.col-md-9.col-sm-9.left-panel > div > div > article > div > div.col-md-9.col-sm-9.translate_list-right > div > span > a:hover {color: #cccccc!important;}
body > section > section > div > section > div > div.alpa_main_bott > div > span > a {color:#d65a31;}
body > section > section > div > section > div > div.alpa_main_bott > div > span > a:hover {color: #cccccc!important;}


/* Özet devamını göster butonu*/
body>section>section>div>section.section-one>div.baba_main>div.baba_main_right>div>a[data-readmore-click] {color: #d65a31!important;}


/*Yorumlar devamını göster butonu */
#titlecommentlist > div > a {color: #d65a31!important;}
#titlecommentlist > div > a:hover {color: #cccccc!important;}


/*Yorum ID*/
#titlecommentlist > div > h2 > span > a {color: #d65a31!important;}


/*Yorum Sayfası Yapım İsmi*/
body > section > section > div > section > div > div > div.col-md-9.col-sm-9.left-panel > section > div > div > h2 > a {color:#d65a31;}

/* Yapım kartı oyuncular listesi butonu*/
div.baba_main div.baba_main_right span a[style*="float:right;font-size:15px;color:#0F74BF;font-weight:normal"] { color:#d65a31!important;}

/* Oyuncular özel sayfası yapım ismi*/
body > section > section > div > section > div > div > div > div.form_main_top > h2 > a  { color:#d65a31!important;}

/* Oyuncular özel sayfası oyuncu isimleri */
div > div > ul > li > figure > figcaption > a > center > h4 { color:#d65a31!important;}

/* oyuncuları özel sayfası sekme zemin rengi*/
#exTab > ul > li.active > a {    background-color: #393e46!important;}


/*Yapım kartı daha fazla oyuncu göster*/
body > section > section > div > section.section-one > div.baba_main > div.baba_main_right > strong > ul > li.collapseList_noHide > a {color: #d65a31!important;}
body > section > section > div > section.section-one > div.baba_main > div.baba_main_right > strong > ul > li.collapseList_noHide > a:hover {color: #cccccc!important;}


/*Yapım kartı oyuncu Bağlantıları Hover*/
body > section > section > div > section.section-one > div.baba_main > div.baba_main_right > strong > ul > li > a:hover {color: #d65a31!important;}


/*Haber sliderı title backgroundu*/
.bannertitle {background-color: #393e4699!important;}


/*Yapım kartı butonları*/
.buttongen { background-color: #d65a31!important;color: #ffffff!important;}
.buttongen:hover { background-color: #ea7750!important; color: #ffffff!important;}


.photo_main h1 {    color: #cccccc;}
.photo_main {    background: #222831;}


/*Haber sayfası yorum butonu*/
.yorum_inp_btn {    background-color: #d65a31;    border-radius: 4px;    border: solid 1px #c5542e;}
.yorum_inp_btn:hover {    background-color: #ea7750;    border: solid 1px #c5542e;}


.modal-content {    background-color: #222831; }

.white-popup-block {    background: #222831;}

div.mfp-content .row {    background: #222831!important;}


/*Yapım sayfası ülke, tür, süre ikonlar*/
.abd_main .abd_ticon img {    vertical-align: top; height:36px;filter: invert(80%);}


.cev p {    color: #cccccc;}

.form_main {    background: #222831;}
.form_main_top_left h1 {    color: #cccccc;}
.form_main_top_right h1 { color: #cccccc;}
.form_main_top_right ul li a { background: #d65a31;}
ul#listnum>li>a.notSelected { background: #d65a317d;}


body {    color: #cccccc;}


.baba_main a:hover {    color: #d65a31;}
.baba_main {    background: #222831;    border-bottom: 1px solid #222831;}
.baba_main_right h1 {    color: #cccccc;}
.baba_main_right strong {    color: #cccccc;}
.baba_main a { color: #cccccc;}
.baba_main_left ul li a {    background-color: #d65a31!important;    color: #fff!important;}
.baba_main_left ul li a:hover {    background-color: #ea7750!important;    color: #fff!important;}


.copy_main_right a {    color: #cccccc;}
.copy_main_left {    background: #505865;}
.copy_main_left p {    color: #fff;}
body > section > section > div > section.section-one > div.copy_main > div.copy_main_right {
    background: #393e4600;
}


/* Yapım kartı altyazı tablosu */
.row1 td { background: #181c23!important;}
.row2 td { background: #111419!important;}
.row1ac td {background-color: #222831!important;}
.row2ac td {background-color: #222831!important;}
#subtable .row1:hover td, #listtable .row1:hover td, #subtable .row1:hover + tr td { background: #393e46!important;}
#subtable .row2:hover td, #listtable .row2:hover td, #subtable .row2:hover + tr td {background: #393e46!important;}
#subtable .row1:hover td, #listtable .row1:hover td, #subtable .row1:hover+tr td { background color: #393e46!important;}
#subtable .row2:hover td, #listtable .row2:hover td, #subtable .row2:hover+tr td { background color: #393e46!important;}
.selected_sub td { background-color: #505865!important; color: #fff!important;}


/*Altyaz kalite renkleri*/
.sub_checked { color: green; text-shadow: 1px 1px 1px #1b1b1b;}
.sub_checked_orange { color: #ffa500; text-shadow: 1px 1px 1px #1b1b1b;}
.sub_checked_red { color: red;text-shadow: 1px 1px 1px #1b1b1b;}
.sub_checked_blue { color: #00f; text-shadow: 1px 1px 1px #1b1b1b;}


/*Üye yıldız renkleri*/
.star_color_3 { color: green; text-shadow: 1px 1px 1px #1b1b1b;}
.star_color_2 { color: #ffa500; text-shadow: 1px 1px 1px #1b1b1b;}
.star_color_1 { color: #349bf9; text-shadow: 1px 1px 1px #1b1b1b;}


.download-btn {    color: #9c9c9c!important;}


[data-toggle="calendar"]>.row>.weekend {    background-color: #393e46;}


.alpa_main_top h1 {    color: #cccccc;}
.alpa_main {    background: #222831;}
.alpa_main_bott p {    color: #cccccc;}
.alpa_main_bott h2 {    color: #cccccc;}
.alpa_main_top ul li a {    color: #cccccc;    width: auto;}
.alpa_main_top ul li a:hover {    background: #111419;    width: auto;}
.alpa_main_bott span {    color: #cccccc;}


/*Yorum gönderme penceresi*/
.wysibb {    border: 1px solid #393e46!important;    background: #111419!important;}
.wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn .fonticon {    color: #fff;    text-shadow: 0 1px 0 #1b1b1b;    background: #111419!important;}
.wysibb .wysibb-toolbar {    border-bottom: 1px solid #393e46!important;    background: #111419!important;}
.wysibb .wysibb-toolbar .wysibb-toolbar-container {    border-right: 1px solid #393e46!important;    background: #111419!important;}
.wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.on .fonticon {    text-shadow: none;    color: #d65a31;}
.wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn:hover {    padding: 0 1px;    border: 1px solid transparent;    border-radius: 0;    /* background: #eee; */}
.wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.on, .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.on:hover, .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn:active {    background: #111419!important;box-shadow: inset 0 0 3px #101010;border: 1px solid #393e46!important;}
/*Yorum gönderme penceresi son*/


.bottom-resize-line:hover, .bottom-resize-line.drag {    background: #393e46;}


.img-thumbnail {    background-color: #cccccc!important;    border: 1px solid #393e46!important;}


.video_main h1 {    color: #cccccc;}
.video_main {    background: #222831;}


/*Input kutu rengi*/
.form-control {    background-color: #16181b;    border: 1px solid #23262b;    color: #ccc;    margin-bottom: 1px;}


.banner span {    background-color: #d65a31;}

.content {    background: #222831;}

.mv-list h6 {    color: #cccccc;}
.mv-listn h6 {    color: #cccccc;}


/*Anasayfa seçili altyazı tabı */
.list_main {background: #393e46!important;}


/*Anasayfa seçili tab*/
.movie_list_top_left .ui-tabs-active .ui-tabs-anchor {background: #393e46;}
.list ul li a figure figcaption strong { color: #d65a31;}
.movie_list_top_left li a {    color: #cccccc;    background: #222831;}
div #new_sub_tab .ui-tabs-active .ui-tabs-anchor {    background-color: #222831!important;    color: #d65a31!important;}
.movie_list_top_right {    background: #222831;}
.movie_list_top_right ul li a:hover {    background: none;    color: #d65a31;}
.movie_list_top {    background: #222831;}
.movie_list {    background: #393e4600;}
.list ul li a figure figcaption h4 {    color: #fff;}
.list ul li a figure figcaption span {    color: #cccccc;}


.ha {    color: #fff!important;}


.blog_list-right p {    color: #cccccc;}
.blog_list-right ul {    border: dotted 1px #cccccc;}
.blog_list-right h4 {    color: #ffff;    border-bottom: dotted 1px #cccccc;}
.blog_list-right a i {    color: #cccccc;}
.blog_list-right a:hover{ color:#d65a31!important;}
.blog_list-right a { color: #cccccc!important;}


.video-sec {    background: #222831;}

.sec-three {    background: #222831;}


body > section > section > div > section.sec-three > div > div.row > h4{    background: #d65a31!important;}


/*Anasayfa Videolar bölümü*/
.video-loop h4 a {    color: #cccccc;}
.video-loop p {    color: #cccccc;}
.video-loop figure {    border: solid 1px #393e46!important;}


.sec-four {    background: #222831;}

.site-link ul li a {    border-bottom: solid 1px #222831;}

.bcumb a {    color: #cccccc;}

.blog-sec h3, .blog-articla2 {    color: #fff;    border-color: #393e46!important;}

.blog-sec h3 span {    color: #d65a31;}

.blog-articla {    border-bottom: solid 1px #393e46;}

.blog-sec h5 {    color: #fff;}

.all_text p {    color: #cccccc;}

.read-btn a {    border: dotted 1px #cccccc;}


/*Sayfa numaraları*/
.pagination > li > a, .pagination > li > span {    border: 1px solid #222831;    background-color: #393e46!important;border-radius:5px;}
.pagein .pagination > li > a, .pagination > li > span {    border: solid 1px #222831;    color: #cccccc;border-radius:5px;}
.pagination>.disabled>a, .pagination>.disabled>a:focus, .pagination>.disabled>a:hover, .pagination>.disabled>span, .pagination>.disabled>span:focus, .pagination>.disabled>span:hover {background-color:#393e46!important; border-color: #222831; border-radius:5px;}
.pagein2 .pagination>li>a, .pagination>li>span {    background: #393e46;    color: #ffffff!important;border-radius:5px;}
.pagination>.active>a, .pagination>.active>a:focus, .pagination>.active>a:hover, .pagination>.active>span, .pagination>.active>span:focus, .pagination>.active>span:hover {z-index: 3;color:#fff!important;cursor: default;background-color:#d65a31!important;border-color: #222831!important;border-radius:5px;}
.pagination>li>a, .pagination>li>span { color: #cccccc;background-color: #fff; border: 1px solid #222831;border-radius:5px;}
.pagein2 .pagination>li>a:focus, .pagination>li>a:hover, .pagination>li>span:focus, .pagination>li>span:hover{background:#d65a31; border: solid 1px #222831; color:#d65a31;border-radius:5px;}
.pagein2 .pagination>li>a:focus, .pagination>li>a:focus, .pagination>li>span:focus, .pagination>li>span:focus{background:#d65a31; border: solid 1px #222831; color:#d65a31;border-radius:5px;}
.pagein .pagination>li>a:focus, .pagination>li>a:hover, .pagination>li>span:focus, .pagination>li>span:hover {background:#d65a31; border-radius:5px;}
/*Sayfa numaraları son*/


.yorum_main h5 {    color: #cccccc;    border-bottom: solid 1px #393e46;}
.yorum_inp_msg {    background-color: #111419;    border: solid 1px #393e46;    color: #cccccc;}


.comment-form {    border: solid 1px #393e46;}


#wbbmodal .wbbm {    background: #393e46;    border: 1px solid #393e46;    box-shadow: 0 0 5px #1222624;}
#wbbmodal .wbbm-bottom {    border-top: 1px solid #222831;    background: #393e46;}
#wbbmodal .wbbm-title {    color: #fff;    border-bottom: 1px solid #222831;}
#wbbmodal .wbbm-inp-row input {    border: 1px solid #222831;}
#wbbmodal .div-modal-text {    border: 1px solid #222831;    background:#222831!important;}
#wbbmodal .wbbm-title .wbbclose {    color: #222831;}


.murat {    border-bottom: solid 1px #393e46;}

.Toplam2 {color: #cccccc; background-color: #393e46;width: 100%;}


/*Arama sonucu sayfası toplam sayı zemini*/
.Toplam {    color: #cccccc;    background-color: #393e46;}


/*Arama sonucu sayfası buton hizalanması*/
.search2 {    margin: 0px 0 0px 0px;}


.subtitle1 a {    color: #cccccc!important;}

.translate_list-right h4 {  color: #fff;}
.translate_list-right p {    color: #cccccc;}

.translate_list-right2 h4 {    color: #fff;}
.translate_list-right2 p {    color: #cccccc;}


.input-group-addon {    color: #fff;    background-color: #505865;    border: 1px solid #505865;}

select.input-sm {    color: #cccccc;}

hr {    border-top: 1px solid #393e46;}

.modal-header { border-bottom: 1px solid #393e46;}

.modal-footer {    border-top: 1px solid #393e46;}


.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th { border-top: 1px solid none!important; border-bottom: 1px solid #393e46!important;}
.table-hover>tbody>tr:hover { background-color: #393e46;}


td > button { background-color: #d65a31!important; border-color: #c5542e!important;}
td > button:hover { background-color: #ea7750!important; border-color: #c5542e!important;}


div > td > a { background-color: #d65a31!important; border-color: #c5542e!important;}
div > td > a:hover { background-color: #ea7750!important; border-color: #c5542e!important;}


td > a {color:#d65a31;}
tbody > tr > td > a {color:#d65a31;background-color: #22283100!important; border-color: #22283100!important;}
tbody > tr > td > a:hover {color:#cccccc;background-color: #393e4600!important; border-color: #393e4600!important;}

#subtable a {color:#d65a31;}

body > section > section > div > section > section > div:nth-child(3) > table > tbody > tr > td:nth-child(4) > a {color: #fff;}



.btn-default {    color: #cccccc!important;    background-color: #d65a31!important;    border-color: #c5542e!important;}
.btn-default:hover, .btn-default:focus {    color: #fff!important;   background-color: #ea7750!important;    border-color: #c5542e!important;}


/*Moderasyon sayfası "iptal ve geçmiş moderasyonlar" butonu*/
body > section > section > div > section > section > a.btn.btn-default { color: #cccccc!important; background-color: #393e46!important; border-color: #393e46!important;}
body > section > section > div > section > section > a.btn.btn-default:hover { color: #cccccc!important; background-color: #494f58!important; border-color: #393e46!important;}


.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    border-top: 1px solid #393e46;
    border-bottom: 2px solid #393e46;
}

.table>tbody>tr.active>td, .table>tbody>tr.active>th, .table>tbody>tr>td.active, .table>tbody>tr>th.active, .table>tfoot>tr.active>td, .table>tfoot>tr.active>th, .table>tfoot>tr>td.active, .table>tfoot>tr>th.active, .table>thead>tr.active>td, .table>thead>tr.active>th, .table>thead>tr>td.active, .table>thead>tr>th.active {
    background-color: #393e46;
}


.nav-tabs>li.active>a, .nav-tabs>li.active>a:focus, .nav-tabs>li.active>a:hover {color: #fff; background-color: #222831; border: 1px solid #393e46; border-bottom-color: transparent;}
.nav-tabs > li > a:hover{    color: #4697dc;    border: 1px solid transparent;    border-bottom-color: #transparent;}
.nav>li>a:focus, .nav>li>a:hover {    color: #fff;    text-decoration: none;    background-color: #1a1e25;    border-bottom-color: #transparent;}
.nav-tabs>li>a {    border: 1px solid transparent;    color: #d65a31;}
.nav-tabs {    border-bottom: 1px solid #393e46;    margin-bottom: 3px;}


/*Yapım kartı düzenleme menüsü*/
#movie4 > div:nth-child(1) { margin-bottom: 3px;}


/*Yapım Kartı seri film düzenleme penceresi*/
#movie5 {height: 350px;}
#movie5 div:nth-child(2) { margin-bottom: 3px;}


/*Arama filtreleme menüsü zemini, yönetici sayfası filtreleme menüsü zemini*/
.well { background-color: #393e46; border: 1px solid #393e46;}
.search_sub { background-color: #393e46;}


.table>tbody>tr.info>td, .table>tbody>tr.info>th, .table>tbody>tr>td.info, .table>tbody>tr>th.info, .table>tfoot>tr.info>td, .table>tfoot>tr.info>th, .table>tfoot>tr>td.info, .table>tfoot>tr>th.info, .table>thead>tr.info>td, .table>thead>tr.info>th, .table>thead>tr>td.info, .table>thead>tr>th.info {
    background-color: #1a1e25;
    color: #fff;
}


/*Yapım kartı düzenleme sayfası "Afiş Yükle" kutu rengi*/
.form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {    background-color: #040506;    opacity: 1;}


.movie_list_top_right ul li a { background-color: #d65a31; border: solid 1px #d65a31;}
.list-table .table-striped > tbody > tr :nth-of-type(n+1) { background: #222831;}
.list-table .table-striped > tbody > tr:hover :nth-of-type(n+1) {  background: #393e46;}
.list-table table tr td { color: #cccccc;}


.panel-default>.panel-heading {    color: #fff;    background-color: #393e46;    border-color: #393e46;}
.panel-body {    background: #393e46;}
.panel-default {    border-color: #393e46;}


.alert-info {    color: #fff;    background-color: #505865;    border-color: #505865;}


/* Video ekle butonu*/
#videolistdiv > h1 > a.popup-with-form.read-more {color: #d65a31;}

#videolistdiv > ul > li > ul > div > a {color: #d65a31;}

/*videolar sayfası*/
.videos-loop h4 a {    color: #fff;}
.videos-loop figure {    border: solid 1px #393e46;}


.search_inp {    border: solid 1px #393e46;    color: #fff;}
.search_inp2 {    border: solid 1px #393e46;color: #fff;}
.search_inp8 {    border: solid 1px #393e46;color: #fff;}


.diger_main {    background: #222831;}

.diger_main h1 {    color: #cccccc;}

.murat_right p {    color: #cccccc;}

.murat_right h3 span {    color: #cccccc;}

button, input, select, textarea {    background-color: #222831;}

code {    background-color: #1f1f1f;}

.mfp-close-btn-in .mfp-close {    color: #f00!important;}


/*Popup pencere kapatma işareti*/
.close {    color: #f00;    text-shadow: 0 1px 0 #1b1b1b;    filter: alpha(opacity=20);    opacity: 100;}
.close:hover {    color: #940a0a;    text-shadow: 0 1px 0 #1b1b1b;    filter: alpha(opacity=20);    opacity: 100;}


/* Görüş gönder penceresi*/
.white-popup {background: #222831;}
.commentlistdiv {background: #222831;}


.tt-suggestion {   background: #393e46;}
.tt-menu {    background-color: #393e46;}


.social ul {    border: none!important;}
.social ul li a {    background: #393e46;    border: solid 1px #393e46;}


.search_inp_select {    border: solid 1px #393e46;    background-color: #222831;}



/*Yapım kartı "orijinal başlık" txt rengi*/
div h3[style*="padding-bottom: 5px;color: darkblue;"] {    padding-bottom: 5px;    color: #d65a31!important;}


/*Çeviri çubuğu ilerleme rengi*/
.progress__bar { background: #d65a31!important;}
#side-progress > .progress { background-color: #393e46!important;}
#side-progress > .progress > .progress__label { color: white!important;}
.trans-percentage a {    color: white;}
.progress__label {    color: #cccccc;}
.trans-loading-one .progress {    background: #96969646;}


/*Çeviri çubuğu ilerleme zemini*/
#side-progress>.progress {    background-color: #393e46!important;}


.popover-title {    background-color: #222831;    border-bottom: 1px solid #222831;}
.popover.calendar-event-popover {    color: #cccccc;    background: #393e46;}


#subdetailform a[style*="color: black;"], #subdetailform ul.pd > li > a {
    color: #cccccc!important;
}

#subdetailform ul.pd > li > a:hover {
    color: rgb(253, 96, 0)!important;
}

.mfp-content > .container {    background-color: #222831!important;}

.list-group-item {    background-color: #222831;    border: 1px solid #393e46;}

.panel-default>.panel-heading+.panel-collapse>.panel-body {    border-top-color: #222831;}


/*Beğeni sayısı zemini*/
[data-badge]:after {    background: #eb5663;    color: #1b1b1b;    box-shadow: 0 0 1px #333;}


/*Altyazı beğeni rengi*/
[data-user-liked~="yes"][data-liketype~="icon"] {  color: #065fd4!important;}
[data-user-liked~="no"][data-liketype~="icon"] {    color: #9c9c9c!important;}


/* IMDB, RT, MT puan kutuları*/
.pd li, .pd2 li, .pd4 li, .pd5 li, .pd6 li, .pd7 li {color: #cccccc;border-radius: 0 3px 3px 0;}
.pd li.active, .pd2 li.active, .pd4 li.active, .pd5 li.active {color: #222831;border-radius: 0 3px 3px 0;}


/*Tablo çizgileri*/
.custom-table-style tbody td {border: 1px solid #393e46!important;}
.custom-table-style tbody tr:nth-child(odd) {border-top: 3px solid #393e46!important;}
.custom-table-style tbody tr td:first-child {border-left: 3px solid #393e46!important;}
.custom-table-style tbody tr td:last-child {border-right: 3px solid #393e46!important;}
.custom-table-style th {border: 3px solid #393e46!important;}


.custom-table-style-art tbody tr td:first-child { border: 1px solid #393e46 !important;}
.custom-table-style-art tbody td {	border: 1px solid #393e46 !important;}
.custom-table-style-art tbody tr td:last-child {border-right: 3px solid #393e46 !important;}
.custom-table-style-art tbody tr td:first-child {border-left: 3px solid #393e46 !important;}
.custom-table-style-art tbody tr:nth-child(3n) {border-bottom: 3px solid #393e46 !important;}
.custom-table-style-art tbody tr:nth-child(n) td:first-child {border-left: 1px solid #393e46 !important;}
.custom-table-style-art tbody tr {	border-left: 3px solid #393e46 !important;}
.custom-table-style-art th {border: 3px solid #393e46!important;background-color: #393e46!important;}

table.custom-table-style-art tbody tr td[style*="background: #d9edf7;"] {background: #393e46!important;}


.custom-table-style-gbr tbody tr td:first-child { border: 1px solid #393e46 !important;}
.custom-table-style-gbr tbody td {	border: 1px solid #393e46 !important;}
.custom-table-style-gbr tbody tr td:last-child {border-right: 3px solid #393e46 !important;}
.custom-table-style-gbr tbody tr td:first-child {border-left: 3px solid #393e46 !important;}
.custom-table-style-gbr th {border: 3px solid #393e46 !important;}
.custom-table-style-gbr tbody tr:nth-child(2n) {border-bottom: 3px solid #393e46 !important;}
.custom-table-style-gbr th {border: 3px solid #393e46!important;background-color: #393e46!important;}


.custom-table-style-plot tbody tr td:first-child { border: 3px solid #393e46 !important;}
.custom-table-style-plot tbody td {	border: 1px solid #393e46 !important;}
.custom-table-style-plot tbody tr:nth-child(odd) {border-top: 3px solid #393e46 !important;}
.custom-table-style-plot tbody tr td:last-child {border-right: 3px solid #393e46 !important;}
.custom-table-style-plot th {border: 3px solid #393e46!important;background-color: #393e46!important;}
/*Tablo çizgileri son*/


.calendar-current {    background: #0c1615;}

blockquote {border-left: 5px solid #3f51b5;}

.copy_main {    background: #393e46!important;}

.mfp-container.mfp-ajax-holder.mfp-s-ready .mfp-content .row .text-right a[style*="float:left; color:black"] {    float:left;    color:#cccccc!important;}


/*Video onaylama sayfası "başlık" txti*/
table.custom-table-style-gbr tbody tr td b[style*="color:black;"] {    color: #cccccc!important;}

/*Video onaylama sayfası "link" txti*/
table.custom-table-style-gbr td b[style="color:black"] {color: #cccccc!important;}


input#form_metaurl:-internal-autofill-selected {
background-color: rgb(232, 240, 254) !important;
background-image: none !important;
color: rgb(0, 0, 0) !important;
}


/*Haber arama sayfası tablolar*/
.custom-table-style-srchnews tbody td { border: 3px solid #393e46!important;}
.custom-table-style-srchnews tbody tr td:first-child { border-left: 3px solid #393e46!important;}
.custom-table-style-srchnews tbody tr td:first-child { border: 3px solid #393e46!important;}
.custom-table-style-srchnews tbody tr:nth-child(2n) { border-bottom: 3px solid #393e46!important;}
.custom-table-style-srchnews tbody tr td:last-child { border-right: 3px solid #393e46!important;}
.custom-table-style-srchnews th { border: 3px solid #393e46!important; background: #393e46!important; color: #cccccc!important;}
.srchnwsrow1 td { background: none;}
.srchnwsrow2 td { background: #111419;}
.srchnwsrow1:hover td { background: #2b2f35;}
.srchnwsrow2:hover td { background: #2b2f35;}
.srchnwsrow1:hover td, .srchnwsrow1:hover+.srchnwsrow1 td, .srchnwsrow1.rowhover td, .srchnwsrow2:hover td, .srchnwsrow2:hover+.srchnwsrow2 td, .srchnwsrow2.rowhover td { background: #222831!important;}
.srchnwsrow2:hover td, .srchnwsrow1:hover+.srchnwsrow1 td, .srchnwsrow1.rowhover td, .srchnwsrow2:hover td, .srchnwsrow2:hover+.srchnwsrow2 td, .srchnwsrow2.rowhover td { background: #222831!important;}



/*Altyazı işlem butonları*/
.btn-success { color: #fff!important; background-color: #398439!important; border-color: #306d30!important;}
.btn-success:hover { color: #fff!important; background-color: #5cb85c!important; border-color: #5cb85c!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success { color: #fff!important; background-color: #398439!important; border-color: #306d30!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success:hover { color: #fff!important; background-color: #5cb85c!important; border-color: #5cb85c!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success { color: #fff!important; background-color: #398439!important; border-color: #306d30!important;}
body > section > section > div > ul >  section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success:hover { color: #fff!important; background-color: #5cb85c!important; border-color: #5cb85c!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success { color: #fff!important; background-color: #398439!important; border-color: #306d30!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success:hover { color: #fff!important; background-color: #5cb85c!important; border-color: #5cb85c!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success { color: #fff!important; background-color: #398439!important; border-color: #306d30!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-success:hover { color: #fff!important; background-color: #5cb85c!important; border-color: #5cb85c!important;}


.btn-basic { color: #fff!important; background-color: #424242!important; border-color: #313131!important;}
.btn-basic:hover { color: #fff!important; background-color: #616060!important; border-color: #313131!important;}


.btn-primary { background-color: #d65a31!important; border-color: #c5542e!important;}
.btn-primary:hover { background-color: #ea7750!important; border-color: #c5542e!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary { background-color: #ff6d00!important; border-color: #da5d00!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary:hover { background-color: #ff882f!important; border-color: #ff882f!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary { background-color: #ff6d00!important; border-color: #da5d00!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary:hover { background-color: #ff882f!important; border-color: #ff882f!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary { background-color: #ff6d00!important; border-color: #da5d00!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary:hover { background-color: #ff882f!important; border-color: #ff882f!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary { background-color: #ff6d00!important; border-color: #da5d00!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-primary:hover { background-color: #ff882f!important; border-color: #ff882f!important;}


.btn-info { background: #d65a31!important; border-color: #c5542e!important;}
.btn-info:hover { background-color: #ea7750!important; border-color: #c5542e!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info { background: #3f51b5!important; border-color: #313f8e!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info:hover { background-color: #5bc0de!important; border-color: #46b8da!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info { background: #3f51b5!important; border-color: #313f8e!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info:hover { background-color: #5bc0de!important; border-color: #46b8da!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info { background: #3f51b5!important; border-color: #313f8e!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info:hover { background-color: #5bc0de!important; border-color: #46b8da!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info { background: #3f51b5!important; border-color: #313f8e!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-info:hover { background-color: #5bc0de!important; border-color: #46b8da!important;}


.btn-warning { background-color: #d65a31!important; border-color: #c5542e!important;}
.btn-warning:hover { background-color: #ea7750!important; border-color: #c5542e!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning { background-color: #d58512!important; border-color: #a06714!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning:hover { background-color: #e8a84b!important; border-color: #a06714!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning { background-color: #d58512!important; border-color: #a06714!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning:hover { background-color: #e8a84b!important; border-color: #a06714!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning { background-color: #d58512!important; border-color: #a06714!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning:hover { background-color: #e8a84b!important; border-color: #a06714!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning { background-color: #d58512!important; border-color: #a06714!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-warning:hover { background-color: #e8a84b!important; border-color: #a06714!important;}


.btn-danger { background-color: #c9302c!important; border-color: #ac2925!important;}
.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger { background-color: #c9302c!important; border-color: #ac2925!important;}
body > section > section > div > ul > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger { background-color: #c9302c!important; border-color: #ac2925!important;}
body > section > section > div > ul > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger { background-color: #c9302c!important; border-color: #ac2925!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger { background-color: #c9302c!important; border-color: #ac2925!important;}
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.text-right > button.btn.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}
/*Altyazı işlem butonları son*/

/*Çevirmen tanımları sayfası "sil" butonu*/
body > section > section > div > section > section > table > tbody > tr > td > a.btn.btn-warning { background-color: #c9302c!important;border-color: #ac2925!important;}
body > section > section > div > section > section > table > tbody > tr > td > a.btn.btn-warning:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}


/*Popup pencere "kapat" butonu*/
#bmodal > div > div > div.modal-footer > button.btn.btn-default { color: #cccccc!important; background-color: #393e46!important; border-color: #393e46!important;}
#bmodal > div > div > div.modal-footer > button.btn.btn-default:hover { color: #cccccc!important; background-color: #494f58!important; border-color: #393e46!important;}


/*Çeviri duyur penceresi "geri" butonu*/
#translatedetailform > div > div > div.col-md-12.margintop10.text-right > button.btn.btn-default { background-color: #c9302c!important;border-color: #ac2925!important;}
#translatedetailform > div > div > div.col-md-12.margintop10.text-right > button.btn.btn-default:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}


/*Çeviri duyurusu düzenleme penceresi "iptal et" butonu*/
#translatebutton.btn.btn-danger { background-color: #c9302c!important;border-color: #ac2925!important;}
#translatebutton.btn.btn-danger:hover { background-color: #d9534f!important; border-color: #d43f3a!important;}


/*Çeviri duyur penceresi "kaydet" butonu*/
#translatebutton {background: #d65a31!important;border-color: #c5542e!important;}
#translatebutton:hover { background-color: #ea7750!important; border-color: #c5542e!important;}


/*Haber Yönetimi işlem menüsü*/
div.row  div.col-md-2[style*="color: #3f51b5;padding-top:3px"] {color: #d65a31!important;padding-top:3px;}
#operation_content > a {color: #d65a31!important;}


/*Yapım Kartı Güncelleme Butonu*/
#movie1 > div:nth-child(5) > div:nth-child(3) > button {background-color: #ec971f!important;border-color: #d58512!important;}
#movie1 > div:nth-child(5) > div:nth-child(3) > button:hover {background-color: #e8a84b!important; border-color: #a06714!important;}


/*Bekleme listesi "iptal" butonu*/
.iptal_btn { background: #d65a31!important; border-color: #c5542e!important;}
td.tcontent4 > button.iptal_btn:hover { background-color: #ea7750!important; border-color: #c5542e!important;}


/*Bekleme listesi "iptal" butonu icon zemini*/
.fa-times-circle:before {background: #d65a31;}


/*Rapor sayfası "rapor" yazısı*/
table tbody tr td span  a[style*="font-weight:600;"] {color:#d65a31!important;}


/*Hasan ek */
.mmm {    border: solid 1px #393e46;}

.blog_list-right ul {    border: dotted 1px #393e46;}

.read-btn a {    border: dotted 1px #393e46;}

.blog_list-right h4 {    color: #cccccc!important;    border-bottom: dotted 1px #393e46;}


.list ul li a figure figcaption h4 {    color: #cccccc;}

ul.flag {    border: solid 1px #393e46;}

.translate_list-right2 h4 {    color: #cccccc;}

.btn-md {
    color: #fff;
    padding: 11px 17px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0), inset 0 2px rgba(0, 0, 0, 0);
    -moz-box-shadow: 0 0 10px rgba(0,0,0,.16) , inset 0 2px rgba(255,255,255,.2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0), inset 0 2px rgba(0, 0, 0, 0);
    font: 12px 'Roboto',sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    -webkit-transition: .3s;
    transition: .3s;
}

.btn--warning {    color: #fff;    background-color: #d65a31!important;    border-color: #c5542e!important;}
.btn--warning:hover {    background-color: #ea7750!important;    border-color: #c5542e!important;}


.blog-sec h3, .blog-articla2 {    color: #cccccc;    border-color: #393e46!important;}

.blog-sec h5 {    color: #cccccc;}

navbar-default .navbar-nav>li>a {    color: #cccccc!important;}


/*Anasayfa bugün ne izledim bölümü "bugün ne izledim" texti*/
div>h1>a[href="/todaywatchs"] {    color: #cccccc!important;}


.content_video h3 {    color: #cccccc;}

.foot-nav ul li a {    color: #cccccc;}

body > section > section > div > section.section-one > div > div > div.col-md-9.col-sm-9.left-panel > div.flexslider {background: #1d1c1c;  border: 4px solid #cccccc;}


/* Haber sliderı İleri-Geri Okları */
body > section > section > div > section.section-one > div > div > div.col-md-9.col-sm-9.left-panel > div.flexslider > ul.flex-direction-nav > li > a { filter: hue-rotate(337deg);}


/* Son eklenen videolar ileri-geri okları*/
body > section > section > div > section.sec-three > div > div.video-sec > div > div.customNavigation > a.btn.next { filter: hue-rotate(337deg);}
body > section > section > div > section.sec-three > div > div.video-sec > div > div.customNavigation > a.btn.prev { filter: hue-rotate(337deg);}


/* Vizyon sliderı ileri-geri okları*/
#next1 { filter: hue-rotate(337deg);}
#prev1 { filter: hue-rotate(337deg);}


/* IMDB aktarım butonu*/
body  section  section  div  section  div  div  div.col-md-9.col-sm-9.left-panel  div  div.imdb  a[style*="background-color:#FF8100; color:#fff; width:150px; float:right;"] {background-color:#d65a31!important;color:#fff; width:150px; float:right;}


/*Video arama butonu*/
.ara_search{background: #d65a31;}



/* MOBİL İÇİN DÜZENLEMELER */

/* Haber slider noktaları */
@media only screen and (min-width: 320px) and (max-width: 767px) {
	.flex-control-paging li a.flex-active {background: #000; background: #d65a31;}
	.flex-control-paging li a {background: #666;background: #393e46;}
	.flex-control-paging li a:hover {background: #333;background: #cccccc;}}

/* Arama sonuç sayfasındaki arama butonu */
.ara_search2 {background-color: #d65a31;color: #fff; margin: 0 0px 0 0;}


/* Yapım son güncelleme tarihi, yüklenme tarihi */
body > section > section > div > section > div.copy_main > div.copy_main_left > p {color: #fff!important;}
body > section > section > div > section.section-one > div.copy_main > div.copy_main_left > p {color: #fff!important;}


/*Tablo çevresinde çıkan sınır */
body > section > section > div > section > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.table-responsive {border: 1px solid #ddd0!important;}
#planet-tab1 > div > div {border: 1px solid #ddd0!important;}
body > section > section > div > section > div {border: 1px solid #ddd0!important;}
body > section > section > div > section > div > div > div > div > div.table-responsive.list-table_subtitle {border: 1px solid #ddd0!important;}
body > section > section > div > section.form_main > div.table-responsive.dosya_main > div.tebel-scroll > div.table-responsive {border: 1px solid #ddd0!important;}
body > section > section > div > section > div > div > div.col-md-9.col-sm-9.left-panel > div > div.table-responsive.list-table {border: 1px solid #ddd0!important;}
#bmodalContent > div.table-responsive {border: 1px solid #ddd0!important;}


/*Navigasyon bar focus*/
.navbar-default .navbar-toggle:focus, .navbar-default .navbar-toggle:hover{ background:#d65a31; border:solid 1px #d65a31;}
.navbar-default .navbar-toggle { border-color: #cccccc;}
.navbar-default .navbar-toggle .icon-bar {background: #cccccc;}
.navbar-default .navbar-toggle .icon-bar:focus, .navbar-default .navbar-togglehover .icon-bar:hover {background: #fff;}

/*Mobil kullanıcı menüsü zemini*/
.user-menu>ul {    background: #222831;    border: solid 1px #393e4600;}

/* Mobil header*/
.navbar-header { background-color: #1a1e25;}

/*Mobil header logo*/
.header-brand img { filter: hue-rotate(337deg);}

/* Nihat eklenti */

.forum_main { background: #222831!important;}
.forum_main h1 { color: #ccc!important;}
a#forumButton { background-color: #d65a31!important;}
a#forumButton:hover { background-color: #ea7750!important;}
.forum-dropdown > li { background-color: #d65a31!important;}
.forum-dropdown > li:hover { background-color: #ea7750!important;}
.colColor1 {  background-color: #181c23!important;}
.colColor2 {  background-color: #111419!important;}
.colColor1:hover, .colColor2:hover {  background-color: #393e46!important;}
#topicUrl { color: #d65a31!important;}
#topicUrl:hover { color: #ea7750!important;}

.copy_main ul li a {
    color: #ccc;
}

.copy_main ul li a:hover {
    color: #d65a31;
}

`

    GM_addStyle( styles );




})();