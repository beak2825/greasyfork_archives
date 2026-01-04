// ==UserScript==
// @name          Blogtruyen.com
// @namespace     http://ani-vn.com
// @description	  Design bởi Nguyễn Văn Cao Kỳ
// @author        Ani - VN
// @homepage      http://ani-vn.com
// @icon          http://www.ani-vn.com/favicon.ico
// @include       http://blogtruyen.com/*
// @include       https://blogtruyen.com/*
// @include       http://*.blogtruyen.com/*
// @include       https://*.blogtruyen.com/*
// @include       http://id.blogtruyen.com*
// @exclude       http://forum.blogtruyen.com/*
// @exclude       https://forum.blogtruyen.com/*
// @exclude       http://blogtruyen.com/truyen-theo-doi/*
// @exclude       https://blogtruyen.com/truyen-theo-doi/*
// @exclude       http://id.blogtruyen.com/thanh-vien*
// @exclude       https://id.blogtruyen.com/thanh-vien*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_listValues
// @grant		GM_deleteValue
// @run-at        document-start
// @compatible  chrome
// @compatible  firefox
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @version       2.0
// @downloadURL https://update.greasyfork.org/scripts/35493/Blogtruyencom.user.js
// @updateURL https://update.greasyfork.org/scripts/35493/Blogtruyencom.meta.js
// ==/UserScript==

//==========     Bắt đầu css   ==============

(function() {var css = "";
             if (false || (document.domain == "blogtruyen.com" || document.domain.substring(document.domain.indexOf(".blogtruyen.com") + 1) == "blogtruyen.com"))
                 css += [





                     "a.color-u-1.nguyenvancaoky",
                     "{",
                     "    padding: 6px 6px 6px 6px !important;",
                     "    text-decoration: none;",
                     "    border: none !important;",
                     "    border-radius: 3px !important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E !important;",
                     "    background: linear-gradient(141deg, #662D8C 0, #ED1E79 75%) !important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "#mota {",
                     "    font-size: 10px !important;",
                     "    line-height: 50px !important;",
                     "    margin: 20px !important;",
                     "}",
                     ".manga-detail .description .category {",
                     "    border: none !important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #000!important;",
                     "    background: linear-gradient(141deg,#1b76ac 10%,#00acc3 60%)!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    display: inline;",
                     "    padding: 2px 5px;",
                     "}",
                     ".manga-detail .description .category a {",
                     "    color: #ffffff !important;",
                     "}",
                     ".manga-detail .description .translater {",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #000!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    background: linear-gradient(141deg,#3A3897 10%,#A3A1FF 200%)!important;",
                     "    display: inline;",
                     "    padding: 2px 5px !important;",
                     "}",
                     ".manga-detail .description .translater a {",
                     "    color: white !important;",
                     "}",
                     ".manga-detail .description .like-buttons>.item {",
                     "    font-weight: bold;!important",
                     "    padding: 3px 5px!important;",
                     "    margin: -5px 0 0 5px!important;",
                     "    background-color: #78daf6!important;",
                     "    -webkit-border-radius: 3px!important;",
                     "    background: linear-gradient(141deg,#124784 10%,#4179a4 60%)!important;",
                     "    border: none;!important",
                     "    cursor: pointer;",
                     "    display: inline-block;",
                     "        box-shadow: 6px 6px 25px -6px #000!important;",
                     "}",
                     ".manga-detail .description .like-buttons > .item.wrap-download-all {",
                     "    border: none;!important",
                     "    background: linear-gradient(141deg,#124784 10%,#4179a4 75%)!important;",
                     "        box-shadow: 6px 6px 25px -6px #000!important;",
                     "}",
                     "span.comic-btn-download-all{",
                     "    color: #fff; !important!important",
                     "}",
                     ".color-fuchsia {",
                     "    color: #fff!important;",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #000!important;",
                     "    background: linear-gradient(141deg,#006fb1 10%,#2d4e86 60%)!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    display: inline;",
                     "    padding: 2px 5px;",
                     "}",
                     ".color-hotpink {",
                     "    color: #fff!important;",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #000!important;",
                     "    background: linear-gradient(141deg,#006fb1 10%,#2d4e86 60%)!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    display: inline;",
                     "    padding: 2px 5px;",
                     "}",






                     "body {",
                     "    background: #6e7274 url(http://farm5.staticflickr.com/4216/35079800750_f3b86d6449_o.jpg) center top fixed repeat;",
                     "    background-size: cover !important;",
                     "}",
                     "body#tinymce {",
                     "    color: #fff;",
                     "    background: #fff url(http://farm5.staticflickr.com/4585/38480158626_4f540b87be_o.jpg) center top fixed repeat;",
                     "    background-size: cover !important;",
                     "}",
                     "#mota h1 {",
                     "    color: #fff",
                     "}",
                     ".color-blue, .color-u-1 {",
                     "    color: #fff",
                     "}",
                     "body {",
                     "    color: rgb(255, 255, 255);",
                     "}",
                     "a:hover {",
                     "    color: rgb(255, 255, 255);",
                     "}",
                     "#menu {",
                     "    background: rgba(82, 182, 243, 0.51);",
                     "}",
                     "#banner {",
                     "    display: none;",
                     "}",
                     ".list-mainpage .storyitem footer {",
                     "    background: rgba(69, 194, 255, 0.64);",
                     "}",
                     ".color-red,",
                     ".color-u-4 {",
                     "    color: #fff;",
                     "}",
                     ".bg-cyan {",
                     "    background: #41bcff;",
                     "}",
                     ".bg-lightcoral {",
                     "    background: #41bcff;",
                     "}",
                     ".ui-widget-header {",
                     "    color: #fff;",
                     "}",
                     ".bg-white {",
                     "    background: rgba(0, 121, 181, 0.71) !important;",
                     "}",
                     ".list-mainpage .storyitem h3 a {",
                     "    color: #ffffff;",
                     "}",
                     "#toolbar {",
                     "    background: rgba(0, 115, 130, 0.34);",
                     "}",
                     "img[src*=\"http://4.bp.blogspot.com/-0sEMrAZhKBE/WJ2lW-CwYKI/AAAAAAABOsk/85xbHPtisJE/s0/\"] {",
                     "    display: none;",
                     "}",
                     "#storyPinked {",
                     "    background: rgba(84, 209, 255, 0.38);",
                     "}",
                     "#menu ul.menu>li>a {",
                     "    color: #fff;",
                     "}",
                     "#menu ul.submenu li a {",
                     "    color: rgb(255, 255, 255);",
                     "}",
                     "#menu ul.submenu {",
                     "    background: rgba(37, 205, 255, 0.84);",
                     "}",
                     ".color-blue,",
                     ".color-u-1 {",
                     "    color: rgb(0, 99, 146);",
                     "}",
                     ".nav-tabs {",
                     "    border-bottom: 1px solid #2eb3ff;",
                     "}",
                     ".widget-top-forum {",
                     "    background: rgba(160, 222, 255, 0.55);",
                     "}",
                     ".nav-tabs>li.active>a,",
                     ".nav-tabs>li.active>a:hover,",
                     ".nav-tabs>li.active>a:focus {",
                     "    background-color: rgba(20, 185, 255, 0.46);",
                     "}",
                     ".widget-top-forum .nav-tabs li a {",
                     "    color: white;",
                     "}",
                     ".nav-tabs>li.active>a,",
                     ".nav-tabs>li.active>a:hover,",
                     ".nav-tabs>li.active>a:focus {",
                     "    color: rgb(255, 255, 255);",
                     "}",
                     ".widget-top-forum .nav-tabs li.title {",
                     "    color: #ffffff;",
                     "}",
                     ".widget-top-forum .tab-content ul li a:visited {",
                     "    color: #000000;",
                     "}",
                     ".widget-top-forum .tab-content ul li a {",
                     "    color: #003f82;",
                     "}",
                     ".bg-yellow {",
                     "    background: rgb(65, 188, 255);",
                     "}",
                     ".bg-green {",
                     "    background: #41bcff;",
                     "}",
                     ".bg-coral {",
                     "    background: #41bcff;",
                     "}",
                     ".view-type i.active {",
                     "    color: white;",
                     "}",
                     ".ui-widget-content {",
                     "    background: rgba(0, 165, 255, 0.21) !important;",
                     "}",
                     ".ui-widget-content {",
                     "    color: #fff;",
                     "}",
                     ".color-orange {",
                     "    color: #ffffff;",
                     "}",
                     ".color-green,",
                     ".color-u-3 {",
                     "    color: #ffffff;",
                     "}",
                     ".color-blue,",
                     ".color-u-1 {",
                     "    color: rgb(255, 255, 255);",
                     "}",
                     ".ui-widget-content a {",
                     "    color: #79ffe7;",
                     "}",
                     "#top-newest-comment p img {",
                     "    display: none;",
                     "}",
                     "#tab-hot-story > ul > li.active > a {",
                     "    color: #ffffff;",
                     "}",
                     "#tab-hot-story > div > p > span:first-child a {",
                     "    color: #fff;",
                     "}",
                     ".manga-detail h1.entry-title a {",
                     "    color: #ffffff;",
                     "}",
                     ".manga-detail {",
                     "    background: rgba(166, 247, 255, 0.19);",
                     "}",
                     ".color-u-2 {",
                     "    color: #7b00d6;",
                     "}",
                     ".color-fuchsia {",
                     "    color: #000;",
                     "}",
                     ".color-hotpink {",
                     "    color: #000000;",
                     "}",
                     ".manga-detail .list-chapters .list-wrap p:nth-child(2n+1) {",
                     "    background: rgba(103, 155, 177, 0);",
                     "}",
                     ".manga-detail .list-chapters .list-wrap p a {",
                     "    color: #002f54;",
                     "    display: block;",
                     "    padding: 5px 3px;",
                     "}",
                     ".manga-detail .list-chapters .list-wrap p a:visited,",
                     ".manga-detail .list-chapters .list-wrap p a.visited {",
                     "    color: #003ece;",
                     "}",
                     ".manga-detail .list-chapters .list-wrap p:hover a {",
                     "    color: #ffffff;",
                     "}",
                     ".comic-btn-download-chap {",
                     "    color: rgb(0, 0, 0) !important;",
                     "}",
                     ".manga-detail .social-button {",
                     "    display: none;",
                     "}",
                     ".text-green {",
                     "    color: rgba(255, 255, 255, 0);",
                     "}",
                     ".manga-detail .votes .vote-statictis {",
                     "    color: rgba(0, 237, 255, 0);",
                     "}",
                     ".manga-detail .votes {",
                     "    margin: 20px auto;",
                     "    text-align: center;",
                     "    background: rgba(0, 95, 140, 0.51);",
                     "    border: 3px solid rgba(63, 195, 255, 0.86);",
                     "    padding: 10px 80px;",
                     "}",
                     ".progress-bar-success {",
                     "    background-color: #00d3ff;",
                     "}",
                     ".manga-detail .progress {",
                     "    height: 15px!important;",
                     "    background-color: #ffffff;",
                     "}",
                     ".manga-detail .votes .bt-like,",
                     ".manga-detail .votes .bt-dislike {",
                     "    color: #ffffff;",
                     "}",
                     "#toolbar .frm-q-search input[type=\'text\'] {",
                     "    background: rgb(255, 255, 255);",
                     "}",
                     "#toolbar .frm-q-search input[type=\'submit\'] {",
                     "    background-color: #fff;",
                     "}",
                     "div.fb-comments.fb_iframe_widget {",
                     "    background: rgba(255, 255, 255, 0.8) !important;",
                     "}",
                     ".list-comment .ul-comment .sub-comment .sub-content {",
                     "    border: 1px solid #ccc;",
                     "    padding: 5px;",
                     "    background: rgba(0, 125, 193, 0.44);",
                     "}",
                     ".mce-btn {",
                     "    border: 1px solid #b1b1b1;",
                     "    border-color: transparent transparent transparent transparent;",
                     "    position: relative;",
                     "    text-shadow: 0 1px 1px rgba(255, 255, 255, .75);",
                     "    display: inline-block;",
                     "    background-color: rgba(111, 206, 255, 0.41);",
                     "}",
                     ".mce-panel {",
                     "    border: 0 solid #cacaca;",
                     "    border: 0 solid rgba(0, 0, 0, .2);",
                     "    background-color: rgba(255, 255, 255, 0.07);",
                     "}",
                     "div#sticky {",
                     "    display: none;",
                     "}",
                     "textarea#MangaComment.editorcomment {",
                     "    padding: 0px 270px;",
                     "}",
                     "div.c-content {",
                     "    background: #2f333569;",
                     "}",
                     "img[src*=\"http://3.bp.blogspot.com/-SClhoA8I_sI/TxOkLKBnS8I/AAAAAAAAAH0/HS4apVPTu1c/w50-c/\"] {",
                     "    content: url(https://1.bp.blogspot.com/-4dIRJIVOprs/WhYFXF7tL8I/AAAAAAAA-M0/ldOLTqtmoD4jX5WS_EH0Uj3NQeYTeQFxACHMYCw/s50-c/63176628_p0.png);",
                     "    height: 56px;",
                     "    width: 56px;",
                     "}",
                     "img[src*=\"http://3.bp.blogspot.com/-SClhoA8I_sI/TxOkLKBnS8I/AAAAAAAAAH0/HS4apVPTu1c/s50-c/\"] {",
                     "    content: url(https://1.bp.blogspot.com/-4dIRJIVOprs/WhYFXF7tL8I/AAAAAAAA-M0/ldOLTqtmoD4jX5WS_EH0Uj3NQeYTeQFxACHMYCw/s50-c/63176628_p0.png);",
                     "    height: 56px;",
                     "    width: 56px;",
                     "}",
                     "iframe[src*=\"https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fblogtruyen.page%2F&tabs=timeline%2Cmessages&width=280&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1092402354157500\"] {",
                     "    display: none;",
                     "}",
                     "section.bg-white.comments {",
                     "    width: 620px !important;",
                     "    border-left: 5px solid #50ceff !important;",
                     "    border-right: 5px solid #4fceff !important;",
                     "}",
                     "body section div:nth-child(1) iframe:nth-child(1) {",
                     "    display: none;",
                     "}",
                     "div.fb-comments.fb_iframe_widget {",
                     "    width: 580px !important;",
                     "}",
                     ".fb_iframe_widget iframe {",
                     "    width: 560px !important;",
                     "}",
                     "h3.bold.fs-16 {",
                     "    color: white;",
                     "}",
                     "div#form-comment .pointer {",
                     "    background: #ffffff;",
                     "}",
                     "article#content img:first-child:hover {",
                     "    content: url(http://farm1.staticflickr.com/848/42086871840_be729b5ded_o.jpg);",
                     "}",
                     "#readonline .breadcrumbs a:first-child span:first-child {",
                     "    padding: 6px 6px 6px 6px;",
                     "    text-decoration: none;",
                     "    background: linear-gradient(141deg, #00537E 0, #3AA17E 75%)!important;",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "#readonline .breadcrumbs a:nth-child(2) span:first-child {",
                     "    padding: 6px 6px 6px 6px;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    background: linear-gradient(141deg, #662D8C 0, #ED1E79 75%)!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "#readonline .breadcrumbs a {",
                     "    color: #7a8a7a00;",
                     "}",
                     "#readonline .breadcrumbs {",
                     "    color: #fff;",
                     "}",
                     "#copyright, #copyright a {",
                     "    color: #fff;",
                     "    font-size: 12px;",
                     "    display: none;",
                     "}",
                     "#readonline h1 {",
                     "    font-size: 25px;",
                     "    font-weight: bold;",
                     "    padding: 6px 6px;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    background: linear-gradient(141deg, #662D8C 0, #ED1E79 75%)!important;",
                     "    color: white !important;",
                     "    text-align: center;",
                     "    margin-bottom: 13px;",
                     "    text-shadow: 0 0 4px #fff0, 3px -5px 5px #fff0, 5px -10px 8px #e6e3e300, 7px -15px 12px #cfcbcb00, 15px -25px 18px #5f5e5e00;",
                     "}",
                     ".category-detail .description,",
                     ".author-detail .description {",
                     "    background: #003c58a3;",
                     "}",
                     ".list-manga-bycate .list p,",
                     ".list-manga-bycate .list .p {",
                     "    background-color: #003c58a3;",
                     "    border-bottom: 1px solid #ffffff;",
                     "}",
                     ".list-manga-bycate .list p:hover,",
                     ".list-manga-bycate .list .p:hover {",
                     "    background: #006096;",
                     "}",
                     ".list-manga-bycate .list p:nth-child(1):hover,",
                     ".list-manga-bycate .list .p:nth-child(1):hover {",
                     "    background-color: #006ba7;",
                     "}",
                     ".list-manga-bycate .list p>span:nth-child(1) a, .list-manga-bycate .list .p>span:nth-child(1) a {",
                     "    padding: 19px 19px;",
                     "    font-size: 15px;",
                     "    font-weight: bold;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p:nth-child(2) span:nth-child(2).fs-12 {",
                     "    font-size: 12px;",
                     "    width: 40px;",
                     "    font-weight: bold;",
                     "    margin: 0px 18px;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p:nth-child(2) span:nth-child(3).fs-12 {",
                     "    font-size: 12px;",
                     "    font-weight: bold;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p:nth-child(2) span:nth-child(4).fs-12 {",
                     "    font-size: 12px;",
                     "    font-weight: bold;",
                     "    width: 50px;",
                     "    margin: 0px 10px;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p span:nth-child(4).fs-12 {",
                     "    font-size: 12px;",
                     "    font-weight: bold;",
                     "    width: 50px;",
                     "",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p span:nth-child(3).fs-12 {",
                     "    font-size: 12px;",
                     "    font-weight: bold;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div p span:nth-child(2).fs-12 {",
                     "    font-size: 12px;",
                     "    width: 40px;",
                     "    font-weight: bold;",
                     "",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #41bcff 5%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}",
                     "div.al-j.fs-12 {",
                     "    padding: 19px 19px;",
                     "    font-size: 13px;",
                     "    font-weight: bold;",
                     "    text-decoration: none;",
                     "    border: none!important;",
                     "    background: linear-gradient(141deg, #41bcff 10%, #0090ff 75%)!important;",
                     "    border-radius: 3px!important;",
                     "    box-shadow: 6px 6px 25px -6px #3AA17E!important;",
                     "    transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity;",
                     "    color: white !important;",
                     "}"
                 ].join("\n");
             if (false || (document.location.href.indexOf("http://id.blogtruyen.com") == 0))
                 css += [
                     ".img-backdrop {",
                     "    display: none;",
                     "}"
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

             //============= Thêm Class nguyenvancaoky  =================

             $(document).ready(function(nguyenvancaoky){
                 $("a[data-original-title|='Username: taolataodays2']").addClass("nguyenvancaoky");});

             //=============        Thêm Credit         =================

             $(document).ready(function(mota){
                 var x = document.getElementById("mota");
                 x.querySelector("h1").innerHTML = '<a style="padding: 6px 6px 6px 6px; text-decoration: none; background: linear-gradient(141deg, #312A6C 10%, #852D91 75%)!important; border: none!important; border-radius: 3px!important; box-shadow: 6px 6px 25px -6px #3AA17E!important; transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity; color: white !important;">Giao diện được thiết kế lại bởi " Nguyễn Văn Cao Kỳ " </a>';
             });
             $(document).ready(function(mota){
                 var x = document.getElementById("mota");
                 x.querySelector("span").innerHTML = '<a href="https://facebook.com/nguyenvancaoky" style="padding: 6px 6px 6px 6px; text-decoration: none; background: linear-gradient(141deg, #00537E 0, #3AA17E 75%)!important; border: none!important; border-radius: 3px!important; box-shadow: 6px 6px 25px -6px #3AA17E!important; transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity; color: white !important;">Facebook</a> <a style="padding: 6px 6px 6px 6px; text-decoration: none; border: none!important; border-radius: 3px!important; box-shadow: 6px 6px 25px -6px #3AA17E!important; background: linear-gradient(141deg, #662D8C 0, #ED1E79 75%)!important; transition: .8s cubic-bezier(.08, .52, .52, 1) background, .4s cubic-bezier(.08, .52, .52, 1) opacity; color: white !important;" href="https://facebook.com/nguyenvancaoky" >fb.me/nguyenvancaoky</a> ';
             });

             //=============        Hiển thị ảnh preview tại list truyện         =================

             setInterval(function(){
                 var tiptip = document.getElementsByClassName('tiptip');
                 Array.prototype.forEach.call(tiptip, function(el) {
                     var id = el.dataset.tiptip;
                     var content = document.getElementById(id).cloneNode(true);
                     if(content.className.indexOf('hidden') > -1) {
                         content.className = content.className.replace('hidden', '');
                         content.style.padding = '10px';
                         var title = content.getElementsByClassName("bold al-c fs-12")[0];
                         if(title) {
                             title.parentElement.removeChild(title);
                             el.parentElement.appendChild(content);
                         }
                     }
                 });
             });

             //=============        Thêm chức năng trở về đầu&cuối trang         =================

             (function(window,document){

                 function addEvent(obj, type, fn){
                     return obj.addEventListener ?
                         obj.addEventListener(type, function(e){
                         var ev = window.event ? window.event : (e ? e : null);
                         ev.target = ev.target || ev.srcElement;
                         if( fn.call(obj,ev)===false ){
                             e.cancelBubble = true;
                             e.preventDefault();
                         }
                     }, false)
                     :
                     obj.attachEvent('on' + type, function(e){
                         var ev = window.event ? window.event : (e ? e : null);
                         ev.target = ev.target || ev.srcElement;
                         if(fn.call(obj,ev)===false ){
                             e.cancelBubble = true;
                             return false;
                         }
                     });
                 }

                 function getSize(obj) {
                     return document.documentElement[obj] !== 0 ? document.documentElement[obj] : document.body[obj];
                 }

                 function hasScroll() {
                     return getSize('scrollHeight') > getSize('clientHeight') ? true : false;
                 }

                 function getStyle(obj, attr) {
                     return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
                 }

                 function $(id) {
                     return document.getElementById(id);
                 }
                 function animate(obj,json,cfgjson){
                     clearInterval(obj.animate);
                     obj.animate = setInterval(function() {
                         var bStop = true;
                         for(var attr in json){
                             var objAttr = 0 ;
                             if(attr == 'opacity'){
                                 objAttr = Math.round(parseFloat( getStyle(obj,attr) ) * 100);
                             }else if( attr=="scrollTop" ){
                                 objAttr = parseInt( getSize("scrollTop") );
                             }
                             else{
                                 objAttr = parseInt( getStyle(obj,attr) );
                             }
                             var jsonattr = parseFloat( json[attr] );
                             var speedConfig = (cfgjson && typeof ( cfgjson.speed ) != 'undefined') ? cfgjson.speed : 10;
                             var iSpeed = (jsonattr - objAttr) / speedConfig;
                             iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                             if ( (iSpeed>0 && objAttr <= jsonattr) || (iSpeed<0 && objAttr >= jsonattr) ) {
                                 bStop = false;
                             }
                             if (attr == "opacity") {
                                 obj.style.filter = 'alpha(opacity:' + (objAttr + iSpeed) + ')';
                                 obj.style.opacity = (objAttr + iSpeed) / 100;
                             }else if(attr == "scrollTop"){
                                 document.documentElement.scrollTop=document.body.scrollTop = objAttr+iSpeed;
                             }
                             else {
                                 obj.style[attr] = objAttr + iSpeed + 'px';
                             }
                             if (bStop) {
                                 clearInterval(obj.animate);
                                 if( cfgjson && typeof cfgjson.endFn != 'undefined' ){
                                     cfgjson.endFn.call(obj);
                                 }
                             }
                         }//for
                     },20);
                 }
                 var cssText = '#scrollMars-troy{position:fixed;right:30px;z-index:9999999}#scrollMars-troy #mars-point{width:100px;height:100px;position:absolute;top:0;left:-40px}#scrollMars-troy div div.sroll-btn-troy{width:50px;height:50px;text-align:center;background:#303030;color:#fff;display:block;opacity:0.8;filter:alpha(opacity=80);cursor:pointer;border-radius:50%;box-shadow:2px 2px 40px 2px #303030;line-height:50px;font-size:35px;font-style:inherit;font-weight:bold;font-family:"宋体"}#scrollMars-troy div div.sroll-btn-troy:hover{background:#FF0000}';
                 GM_addStyle(cssText);
                 function scroll(dir) {
                     var position,speed,scrollTop,scrollHeight,clientHeight;
                     clearInterval(document.timerScroll);
                     scrollHeight = getSize('scrollHeight');
                     clientHeight = getSize('clientHeight');
                     document.timerScroll = setInterval(function() {
                         scrollTop = getSize('scrollTop');
                         if (dir > 0) {
                             speed = ( scrollTop/10 ) + 1;
                             position = scrollTop - speed;
                             if (position <= 0) {
                                 document.body.scrollTop = document.documentElement.scrollTop = 0;
                                 clearInterval(document.timerScroll);
                             }
                         } else {
                             speed = ( (scrollHeight-scrollTop-clientHeight) / 10 ) + 1;
                             position = scrollTop + speed;
                             if (position + clientHeight >= scrollHeight) {
                                 document.body.scrollTop = document.documentElement.scrollTop = scrollHeight;
                                 clearInterval(document.timerScroll);
                             }
                         }
                         document.body.scrollTop = document.documentElement.scrollTop = position;
                     }, 20);
                 }

                 function marsMove(dir){
                     var mars = $('scrollMars-troy');
                     var point = $('mars-point');
                     if(dir=="moveIn"){
                         clearTimeout(mars.timerHover);
                         animate(mars,{"right":"30","opacity":"100"});
                         animate(point,{"left":"0"});
                     }else if(dir=="moveOut"){
                         clearTimeout(mars.timerHover);
                         mars.timerHover = setTimeout(function(){
                             animate(mars,{"right":"-30","opacity":"30"});
                             animate(point,{"left":"-40"});
                         },3000);
                     }
                 }

                 function init() {
                     var scrollBtn = $("scrollMars-troy");
                     if( scrollBtn ){
                         scrollBtn.style.top = (getSize('clientHeight') / 3) + 'px';
                     }
                     if (hasScroll() === true && !scrollBtn) {
                         var mars = document.createElement('div'),goTop,goBtm,point;
                         mars.id = "scrollMars-troy";
                         window.top.document.documentElement.appendChild(mars);
                         mars.innerHTML =
                             '<div id=\'mars-point\'></div>'+
                             '<div>'+
                             '    <div id=\'goTop-troy\' title=\'Lên đầu trang\' class=\'sroll-btn-troy\'></div>'+
                             '    <div id=\'goBtm-troy\' title=\'Xuống cuối trang\' class=\'sroll-btn-troy\'></div>'+
                             '</div>';
                         goTop = $("goTop-troy");
                         goBtm = $("goBtm-troy");
                         goTop.innerHTML = "↑";
                         goBtm.innerHTML = "↓";
                         $('scrollMars-troy').style.top = (getSize('clientHeight') / 3) + 'px';
                         addEvent(goTop, "click", function() {
                             scroll(1);
                             return false;
                         });
                         addEvent(goBtm, "click", function() {
                             scroll(-1);
                             return false;
                         });
                         addEvent(mars,'mouseover',function(){
                             marsMove("moveIn");
                             return false;
                         });
                         addEvent(mars,'mouseout',function(){
                             marsMove("moveOut");
                             return false;
                         });
                         addEvent(mars,'mousedown',function(){
                             return false;
                         });
                         marsMove("moveOut");
                     }
                 }

                 addEvent(window,"mousewheel",function(){
                     clearInterval(document.timerScroll);
                 });
                 addEvent(window,"DOMMouseScroll",function(){
                     clearInterval(document.timerScroll);
                 });
                 addEvent(window.top, "resize", function() {
                     init();
                 });

                 addEvent(document, 'DOMContentLoaded', function() {
                     init();
                 });
                 //================    Cài đặt phím    ============
                 addEvent(window, 'keydown', function(e) {
                     if (e.keyCode == 38) {
                         scroll(1);
                     } else if (e.keyCode == 40) {
                         scroll(-1);
                     } else if (e.ctrlKey && e.altKey) {
                         marsMove("moveIn");
                     }
                 });

             })(window,document);
            })();




















