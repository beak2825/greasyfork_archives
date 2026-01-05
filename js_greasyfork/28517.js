// ==UserScript==
// @name        KissAnime KissCartoon KissAsian io no ads clean layout
// @description clean up ads and hides login so you can avoid login into io, fork of slim headers by userscripts.org/user/swyter
// @namespace   hebiohime
// @icon        https://kissanime.io/images/icons/favicon_new.ico
// @match       *://kissanime.io/*
// @match       *://kisscartoon.io/*
// @match       *://kissasian.io/*
// @match       *://kissmanga.io/*
// @version     2017.28.3
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/28517/KissAnime%20KissCartoon%20KissAsian%20io%20no%20ads%20clean%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/28517/KissAnime%20KissCartoon%20KissAsian%20io%20no%20ads%20clean%20layout.meta.js
// ==/UserScript==

GM_addStyle(" \
\
\
/*my edits*/ \
#divBookmark {display: none!important;visibility: hidden!important;}\
#divDownload {padding-top: 0px!important;}\
#divDownload {padding-top: 5px;!important;}\
#divTextQua {display: none!important;visibility: hidden!important;}\
#footer {display: none!important;visibility: hidden!important;}\
#info_player {display: none!important;visibility: hidden!important;}\
#next_ep_desk {margin-bottom: -5px!important;margin-top: 5px!important;}\
#selectQuality {margin-left: 10px!important;}\
#selectPlayer {margin-right: 10px!important;}\
#videoAd {display: none!important;visibility: hidden!important;}\
.bigBarContainer {margin-bottom: 0px!important;}\
.closeVideoAd {display: none!important;visibility: hidden!important;}\
.full .watch_container {padding-top: 5px!important;}\
.lbl {display: none!important;visibility: hidden!important;}\
.mb15 {display: none!important;visibility: hidden!important;}\
.note_top_watch {display: none!important;visibility: hidden!important;}\
.watch_container {padding-top: 5px!important;}\
.watch_title {display: none!important;visibility: hidden!important;}\
#topHolderBox {display: none!important;visibility: hidden!important;}\
\
             #head + .clear                     \
             {                                  \
               clear: none;                     \
               height: 76px;                    \
             }                                  \
                                                \
             #head h1                           \
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
             #result_box + div iframe           \
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