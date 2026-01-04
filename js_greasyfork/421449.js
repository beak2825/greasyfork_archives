// ==UserScript==
// @name         Webtekno Dark Theme
// @version      1.0
// @description  Go gentle into that good night!
// @author       hasangdr
// @icon         https://www.webtekno.com/favicon.ico

// @match        https://www.webtekno.com/
// @match        https://www.webtekno.com/*

// @grant        GM_addStyle
// @run-at       document-body
// @namespace https://greasyfork.org/users/25284
// @downloadURL https://update.greasyfork.org/scripts/421449/Webtekno%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/421449/Webtekno%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS'ler

    var styles =`


/* Haber Sayfası */

body {background: #1b1b1b!important;}

body > div.wt-container > div.global-container.container > div.content > div.news.content-detail-page > article > div.content-body { color: #bdbdbd!important; background: #1b1b1b!important;}

.content-body__detail {  color: #bdbdbd!important;  background: #1b1b1b!important;}

.content-title h1 {  color: #bdbdbd!important;  background: #1b1b1b!important;}

.content-title {  color: #bdbdbd!important;  background: #1b1b1b!important;}

.sidebar-mosts__item__title { color: #bdbdbd;}

.sidebar-trend__item__link { color: #bdbdbd;}

body > div.wt-container > div.global-container.container > div.content > div.news.content-detail-page > article > div.content-info.clearfix > div.content-esimited-read { color: #000;}

.content-font__item__icon {   filter: invert(1);}



/* Okunma Süresi Kutusu */

.content-esimited-read {  background: #bdbdbd;}



/* İlgili Haber */

body > div.wt-container > div.global-container.container > div.content > div.news.content-detail-page > article > div.content-body > div.content-body--right > div.content-body__detail > div.content-card.material-shadow--1dp.clearfix > div {  background: #000!important;}

.content-card__detail {  background: #000!important;}

.content-card__title a {  color: #bdbdbd!important;}



/* Haber Yorum Kutusu */

.content-comments__form__comment {    color: #bdbdbd;  background: #0a0a0a;  border: 1px solid #0a0a0a;}



/* Kaynak bloğu */

.content-source-url:hover { background: #000;}
.content-source-url   { border: 1px dashed #3c3c3c;}



/* Yorum Listesi */

.content-comments__sub-title span { color: #bdbdbd;}

.content-comments__item__author__name { color: #bdbdbd;}

.content-comments__item__message { color: #bdbdbd;}

.content-comments__sub-title {  border-bottom: 1px solid #3c3c3c;}



/* Sosyal Medya Widget */

.sidebar-social__item {  background: #0c0c0c;  color: #bdbdbd; border-right: 3px solid #1b1b1b;}

.sidebar-social__item__caption {  background-color: #0c0c0c;}

.sidebar-social__item__count {  color: #fff;}



/* Haber Listesi */

.content-timeline__detail__title { color: #bdbdbd;}

.content-timeline__time { background-color: #1b1b1b;}

.content-timeline--left:after, .content-timeline--left:before { background-color: #f64d38;}



/* Sayfa Numaraları */

.pagination__box {  background: #0c0c0c;  border-right: 1px solid #1b1b1b;  color: #bdbdbd;}

body > div.wt-container > div.global-container.container > div.content > center > ol > li > a:hover { color: #fff; background: #f44336;}



/* Anasayfa Filtreleme */

.content-timeline__tab__filter__select { color: #bdbdbd;  background-color: #1b1b1b;  border-bottom: 1px solid #f34737;}



/* Yazar Listesi */

.content-author__detail__name {  color: #bdbdbd;}



/* Anasayfa Headline */

.headline {  background-color: #000;}



/* Düşer Liste */

.dropdown-container {  background-color: #0a0a0a;}

.dropdown-container__item a {  color: #bdbdbd;}

.dropdown-container__item a:hover {  color: #fff; background-color: #f44336;}



/* Profil Düzenleme */

.login__container {  background-color: #1b1b1b;}

.login__form-element input { color: #bdbdbd;  border: 1px solid #3c3c3c;}

.login__form-element textarea {  color: #bdbdbd;  border: 1px solid #3c3c3c;}

.login__close { color: #bdbdbd;}



/* Giriş Penceresi Alternatif Barı */

.login__or span {    color: #bdbdbd;    border: 2px solid #3c3c3c;     background-color: #3c3c3c;}

.login__or:before {    background-color: #3c3c3c;}



/* Anasayfa Navbar */

.header__appbar--left__menu__list__item>a.is-active, .header__appbar--left__menu__list__item>a:hover {  box-shadow: inset 0 -2px 0 0 #000;}



/* Drawer */

.drawer {  background-color: #1b1b1b;}

.drawer__menu__item__title { color: #bdbdbd;}

.drawer__menu__item--active a, .drawer__menu__item:hover a { background-color: #000;}

.drawer__header {  border-bottom: 1px solid #707577;}

.drawer__menu__item--border {  border-top: 1px solid #707577;}

.drawer__social {  border-top: 1px solid #707577;}



/* Enler Sayfaları */

.content-mosts__item__link {  color: #bdbdbd;}

.content-mosts--watched .content-mosts__item:before {  background: #f85139!important;}

.content-mosts--shared .content-mosts__item:before {  background: #f85139!important;}

.content-mosts--readed .content-mosts__item:before {  background: #f85139!important;}

.content-mosts__navigation__tab.is-active {  color: #f85039;}

.content-mosts__navigation__tab.is-active:after {   background-color: #f85039!important;}



/* Hakkımızda Sayfası */

.info-sidebar__item.is-active {  background: #0a0a0a;}

.info-sidebar__item.is-active a, .info-sidebar__item:hover a { color: #bdbdbd;}



/* Ödüllerimiz */

.content-card {  background-color: #000;}



/* Künye */

.copyright--row a { color: #bdbdbd!important;}

.copyright--row { border-bottom: 1px solid #707577;}

.copyright--row__text {  color: #bdbdbd;}



/* İletişim */

.material .material-input input, .material .material-input textarea {  border-bottom: 1px solid #0a0a0a; background-color: #0a0a0a;}

.material .material-input label { color: #bdbdbd;}

.material .material-select>label { color: #bdbdbd;  border-bottom: 1px solid #707577;}

.material .material-select ul {   background-color: #000;    box-shadow: 0 2px 2px #f74f38d1;}

.material .material-select ul li label {  color: #bdbdbd;}

.material .material-select ul li label:hover { background-color: #232323;}

.material-button {  color: #fa543a;}

.material-shadow--2dp {    box-shadow: 0 2px 2px 0 #00000024, 0 3px 1px -2px #00000033, 0 1px 5px 0 #f74f38d1;}



/* Çerezler Tabı */

body div.cookies[style*="position: fixed; bottom: 0; left: 0; right: 0; background-color: #fff; border-top: 1px solid #eee; box-shadow: 0px 0px 10px 0px rgba(0,0,0,.1); padding: 8px; z-index: 99999; font-size: 13px; text-align: center;"]
{  position: fixed; bottom: 0; left: 0; right: 0; background-color: #222!important; border-top: 1px solid #222!important; box-shadow: 0px 0px 10px 0px rgba(0,0,0,.1); padding: 8px; z-index: 99999; font-size: 13px; text-align: center;color: #bdbdbd!important;}

body div.cookies div span a[style*="color: #000;"] {color: #ccc!important;}



/* Resim Altı Background */

.content-timeline__media--inset {  background-color: #1b1b1b;}



/* Emoji Listesi */

.content-smile__list {    background-color: #0c0c0c;}



/* Sıralama Numaraları Kenarlık */

.sidebar-mosts__item:before {   border: 3px solid #1b1b1b;}



/* Sıralama Numaraları Zemini */

.sidebar-mosts--readed .sidebar-mosts__item--1:before {    background: #e62f2f!important;}

.sidebar-mosts--readed .sidebar-mosts__item--2:before {    background: #e62f2f!important;}

.sidebar-mosts--readed .sidebar-mosts__item--3:before {    background: #e62f2f!important;}

.sidebar-mosts--readed .sidebar-mosts__item--4:before {    background: #e62f2f!important;}

.sidebar-mosts--readed .sidebar-mosts__item--5:before {    background: #e62f2f!important;}

.sidebar-mosts--readed li:before {    background: #e62f2f!important;}



/* Facebook Paylaşma Butonu Ara Çizgi */

.content-share__item.facebook-save {   border-top: 1px solid #1b1b1b;}





`

    GM_addStyle( styles );



    })();