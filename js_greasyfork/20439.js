// ==UserScript==
// @name        Infinity Metin Wiki
// @description Ingrandisce il content della wiki in base alla larghezza dello schermo
// @namespace   infinitymetin.net
// @author      SCOLAPASTA
// @date        2016-06-10
// @include     http://wiki.infinitymetin.net/wiki/*
// @version     1
// @grant       GM_addStyle
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/20439/Infinity%20Metin%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/20439/Infinity%20Metin%20Wiki.meta.js
// ==/UserScript==

// oppure basta modificare: http://wiki.infinitymetin.net/wiki/skins/monobook/main.css?301

styleMediaSize = "\
@media (min-width:992px){                        \
  #content {                                     \
    width: 800px !important;                     \
  }                                              \
  #img {                                         \
    z-index: 1 !important;                       \
    left: 946px !important;                      \
  }                                              \
}                                                \
@media (min-width:1200px){                       \
  #content {                                     \
    width: 1000px !important;                    \
  }                                              \
  #img {                                         \
    z-index: 1 !important;                       \
    left: 1146px !important;                     \
  }                                              \
}                                                \
@media (min-width:1600px){                       \
  #content {                                     \
    width: 1250px !important;                    \
  }                                              \
  #img {                                         \
    z-index: 1 !important;                       \
    left: 1396px !important;                     \
  }                                              \
}                                                \
";

GM_addStyle (styleMediaSize);