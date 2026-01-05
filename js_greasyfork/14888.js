// ==UserScript==
// @name        KissAnime KissCartoon KissAsian no-ads clean layout
// @description clean up ads and prioritize vertical spacing, fork of slim headers by userscripts.org/user/swyter
// @namespace   hebiohime
// @match       *://kissanime.com/*
// @match       *://kisscartoon.me/*
// @match       *://kissanime.to/*
// @match       *://kissasian.com/*
// @match       *://kissmanga.com/*
// @match       *://readcomiconline.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.se/*
// @match       *://kissasian.ch/*
// @match       *://kimcartoon.me/*
// @version     2017.35
// @require     https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @grant       GM.addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/14888/KissAnime%20KissCartoon%20KissAsian%20no-ads%20clean%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/14888/KissAnime%20KissCartoon%20KissAsian%20no-ads%20clean%20layout.meta.js
// ==/UserScript==
GM.addStyle(" \
\
\
/*my edits*/ \
#divTextQua, #clear1, #clear2, #clear3, #clear4, #clear5, #clear6 {height: 0px; padding-top: 0px; display: none;} #navcontainer #liRequest, #li1, #result_box + div iframe {display: none !important;} form#formSearch > div:last-child {margin-top: 0px !important; float: right;}\
.lbl, #adsIfrme7, #divBookmark, .clsTempMSg, #footer, #liFlappy, #divAds, #divAds2, #adsIfrme1, #adsIfrme3, #adsIfrme6, #adsIfrme8 , #adsIfrme11, #divFloatRight, #divFloatLeft, #adsIfrme10, #divCloseBut, .divCloseBut {display: none!important;visibility: hidden!important;}\
\
#selectPlayer {width: 70px!important;}\
#selectEpisode {width: 200px!important; margin-bottom: 5px!important;}\
#divDownload {padding-top:5px!important;}\
.barContent {padding-top:10px!important;}\
#selectServer {margin-right:5px!important;}\
#selectPlayer {margin-right:5px!important;}\
#selectEpisode {margin-right:5px!important;}\
.bigBarContainer {margin-bottom:0px!important;}\
#switch {width: 16px!important;margin-top: 5px!important}\
\
\
             #head + .clear                     \
             {                                  \
               clear: none;                     \
               height: 76px;                    \
             }                                  \
                                                \
             #head h1 /* for kisscartoon */     \
             {                                  \
               margin-top: 10px !important;     \
             }                                  \
                                                \
             #head h1 a.logo[title^=KissAnime]  \
             {                                  \
               width: 243px !important;         \
               height: 65px !important;         \
             }                                  \
             #head h1 a.logo[title*=kissmanga]  \
             {                                  \
               width: 240px !important;         \
               height: 68px !important;         \
             }                                  \
             #head h1 a.logo[title^=KissAsian]  \
             {                                  \
               height: 60px !important;         \
             }                                  \
                                                \
             #search                            \
             {                                  \
               z-index: 2;                      \
             }                                  \
                                                \
             #search::after                     \
             {                                  \
               content: '';                     \
               position: absolute;              \
               display: inline-block;           \
                                                \
               z-index: -1;                     \
                                                \
               width: 100%;                     \
               height: 30px;                    \
                                                \
               background: #2C2C2C;             \
               border-radius: 7px 7px 0 0;      \
                                                \
               top: -10px;                      \
               left: 0;                         \
             }                                  \
                                                \
             #navcontainer ul                   \
             {                                  \
               position: absolute;              \
             }                                  \
                                                \
             #navcontainer #liRequest, #li1,    \
             #result_box + div iframe,          \
             #navcontainer #liChatRoom,         \
             #navcontainer #liFlappy            \
             {                                  \
               display: none !important;        \
             }                                  \
                                                \
             form#formSearch > div:last-child   \
             {                                  \
               margin-top: 0 !important;        \
               float: right;                    \
             }                                  \
                                                \
             #imgSearch                         \
             {                                  \
               background: transparent;         \
             }");

/* Small tweaks for all those sites people requested */
if (document.domain !== 'kissmanga.com')
  return;

GM_addStyle("#head h1                           \
             {                                  \
               position: absolute;              \
               top: 10px;                       \
               border-radius: 16px;             \
               margin-left: 2px !important;     \
             }                                  \
                                                \
             #search input.text                 \
             {                                  \
               width: 134px !important;         \
             }                                  \
                                                \
             #topHolderBox                      \
             {                                  \
               height: 30px !important;         \
             }");