// ==UserScript==
// @name         Yandex it
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Сделает яндекс в ночной теме
// @author       HLOP
// @match        https://www.yandex.ru/
// @include     *yandex.ru*
//  *music.yandex.ru*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31281/Yandex%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/31281/Yandex%20it.meta.js
// ==/UserScript==


var styleSheet = "" +
".text_black_yes {" +
  "color:rgba(255, 255, 255, 0.84);" +
 // "margin-left: 20px !important;" +
//  "margin-right: 20px !important;" +
//  "min-width: 980px;" +
"}" +
".rows {" +
  " position: relative;" +
  "-webkit-box-orient: vertical;" +
  " -webkit-box-direction: normal;" +
  " -ms-flex-direction: column" +
  "flex-direction: column;"+
  "width: 100%;"+
  " background-color: rgba(34, 34, 41, 0.86);"+
"}" +
".home-link_blue_yes, .home-link_blue_yes:visited {"+
   "color: #0f0;"+
"}"+
".link_blue_yes.link_pseudo_yes, .link_blue_yes:link, .link_blue_yes:visited {"+
  " color: #0f0;"  +
"}"+

".content-tabs__head-item_active_false .home-link {"+
  " cursor: pointer;"  +
  "color: #1abb1a;"+
"}"+

" .i-ua_browser_desktop .link:hover{"+
  "color: #00ccb1;"  +
    "text-shadow: 1px -2px 12px black;"+
"}"+
  " .input__control {"+
    "z-index: 3;"+
    "width: 100%;"+
   "margin: 0;"+
    "padding: 0;"+
   " vertical-align: top;"+
   " font-size: 110%;"+
  "  color: #00c2ff;"+
 "  border: 0 solid transparent;"+
   " outline: 0;"+
   " background: 0 0;"+
   " -webkit-tap-highlight-color: rgba(19, 12, 12, 0);"+
  "  -webkit-appearance: none;"+
  "  background-color: #66666f;"+
 "   /* box-shadow: -4px -6px 20px 0px black; */"+
  "  /* color: #020101; */"+
"}"+
   " .home-logo__default, .m-svg .home-logo__default {"+
  "  background: url(//yastatic.net/www-skins/_/MTF01GJJ4wU-HanDOBMy6Izqi-U.webp);"+
"}"+
  "  .serp-header {"+

  "  background-color: #0a0a0a;"+
    /* color: #a93030; */
"}"+
".navigation_type_horizontal .navigation__region {"+

  "  background-color: #222229;"+
 "   color: rgba(0, 255, 0, 0.78);"+
"}"+
".organic__url {"+

  "  color: #0f0;"+
"}"+
".link:visited {"+
   " color: #00c2ff;"+
"}"+
".main {"+
   " background-color: #414147;"+
"}"+
".serp-item {"+
    "color: rgba(255, 255, 255, 0.77);"+
"}"+
".navigation_type_horizontal .navigation__item_state_selected .service__name::after, .navigation_type_horizontal .navigation__more_state_selected .service__name::after {"+
   " border-top: 3px solid #0f0;"+
"}"+
 "   .serp-header__wrapper {"+
  "  background-color: #222229;"+
"}"+
   " .organic__url {"+
    "color: #0f0;"+
"}"+
   " :root {"+
    "--color-link-active: #0f0;"+
  "  --color-blue-link: #0f0;"+
   "}"+
   " .b-page__body {"+
   " color: #000;"+
   " background: #222229;"+
"}"+
   " .user .user__name {"+
    "color: rgba(255, 255, 255, 0.77);"+
"}"+
    ".user__first-letter {"+
   " color: #0f0;"+
"}"+
    ".features__item, .header2__arrow-logo, .header2__yaobject-logo {"+
  "  background-color: #222229;"+
"}"+
    ".header2__main {"+
   " background: #222229;"+
"}"+
    ".promo-page {"+
   " background-color: #414147;"+
"}"+
    ".header__main {"+
    "background: #222229;"+
"}"+
" .b-menu-horiz__selected {"+
    "color: rgba(255, 255, 255, 0.77);"+
"}"+
".b-content__card_type_many {"+
   " border: 1px solid #414147;"+
   " background: #222229;"+
   " box-shadow: 5px 5px 10px rgba(0,0,0,.4);"+
"}"+
".b-content__card_type_many:after {"+
   " background: #222229;"+
"}"+
".b-description__desc {"+
   " color: rgba(255, 255, 255, 0.77);"+
"}"+
   " .app__desc {"+
   "color: rgba(255, 255, 255, 0.77);"+
"}"+
    ".header {"+
   " background: #222229; "+
"}"+
    ".promo-page__header {"+
  "  background: #222229;"+
"}"+
    ".b-description__item {"+
   " color: rgba(255, 255, 255, 0.77);"+
"}"+
    ".y-header_yablogs__menu-level {"+
    "background: #222229;"+
"}"+
    ".page {"+
 "background-color: #222229;"+
"}"+
    //яндекс музыка
    /*
   " .bar_megafon.bar .progress__bar.progress__progress .progress__line,.bar_megafon.bar.bar_dark.bar .progress__bar.progress__progress .progress__line{background:#00c2ff}"+//цвет прогрес бара
".browser-desktop .head__wrap {"
    "line-height: 70px;"+
    "background-color: #414147;"+
"}"+
 ".nav__tab, .nav__tab:active {"+
   " color: rgba(0, 255, 0, 0.71);"+
"}"+
".centerblock {"+
  "  padding: 30px 30px 60px;"+
 "   min-height: 600px;"+
 "  background-color: #222229;"+
"}"+
    ".tabs__tab_current {"+
   " border-bottom-color: #0f0;"+
"}"+
    ".link:hover {"+
   " color: #00c2ff!important;"+
"}"+
    "body {"+
    "background: rgba(65, 65, 71, 0.91);"+
  "  height: 100%;"+
    "overflow: visible!important;"+
"}"+
    ".sidebar__under {"+
//
    "background-color: #414147;"+
"}"+
   " .link_major {"+
    "color: rgba(0, 255, 0, 0);"+
"}"+
   " .footer {"+
   " background-color: #222229;"+
"}"+
   " .link {"+
    "color: rgba(255, 255, 255, 0.77);"  +
"}"+
    ".player-controls {"+
    "background-color: rgba(34, 34, 41, 0.88);"+
"}"+
   " .progress__progress_muted .progress__line{background:rgba(0, 255, 192, 0.92)}"+
    ".progress__bg{position:absolute;left:0;bottom:0;width:100%;height:5px;background:rgba(0, 0, 0, 0.89)}"+
".bar_megafon.bar .bar__megafon-container .bar__megafon-image, .bar_megafon.bar.bar_dark.bar .bar__megafon-container .bar__megafon-image {"+
   " display: adawd; "+
   "width: 100%;"+
    "height: 31px;"+
    "background-image: url(/i/bGB0lLVNKDiIARf2uXoLStPhkX4.png);"+
  "  background-size: contain;"+
    "background-repeat: no-repeat;"+
"}"+*/
//"img[Attributes Style]{"+
//  ""  +
//  ""+
//"}"+
"";



(function () {
  var s = document.createElement('style');
   s.type = "text/css";
  s.innerHTML = styleSheet;
  (document.head || document.documentElement).appendChild(s);
})();
