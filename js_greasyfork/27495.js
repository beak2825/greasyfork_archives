// ==UserScript==
// @name        Bigger Viz Manga Reader
// @description Forces the flash player to use all available real-estate
// @namespace   https://greasyfork.org/en/users/10848
// @match       http://www.viz.com/*
// @match       https://www.viz.com/*
// @version     1.0.1
// @author      sergio91pt
// @license     GPLv3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27495/Bigger%20Viz%20Manga%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/27495/Bigger%20Viz%20Manga%20Reader.meta.js
// ==/UserScript==

GM_addStyle ("                 \
  #modal-reader-header {       \
      display: none;           \
  }                            \
                               \
  .reader {                    \
      padding: 0;              \
  }                            \
                               \
  .reader-close {              \
      position: fixed;         \
      right: 8px;              \
      top: 8px;                \
      z-index: 1000;           \
      cursor: pointer;         \
  }                            \
                               \
  #reader_wrapper {            \
      padding-top: 0;          \
  }                            \
                               \
  html,                        \
  body,                        \
  .modal-reader,               \
  #reader_window,              \
  #reader_wrapper {            \
      width: 100%;             \
      height: 100%;            \
  }                            \
                               \
  #reader_container_fl {       \
      width: 100% !important;  \
      height: 100% !important; \
  }                            \
");