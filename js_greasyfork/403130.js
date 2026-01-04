// ==UserScript==
// @name Webnovel - Dark Theme
// @namespace ew0345
// @version 1.0.9
// @description A dark theme for Webnovel/Qidian International
// @author ew0345
// @grant GM_addStyle
// @run-at document-start
// @match *://*.webnovel.com/*
// @match *://*.passport.webnovel.com/*
// @include /^(?:http(s)://(www.)webnovel.com/(#*))$/
// @include /^(?:http(s)://(www.)webnovel.com/category/.*)$/
// @include /^(?:http(s)://(www.)webnovel.com/ranking/.*)$/
// @include /^(?:http(s)://(www.)webnovel.com/profile/.*)$/
// @include /^(?:http(s)://(www.)webnovel.com/badges)$/
// @include /^(?:http(s)://(www.)webnovel.com/settings)$/
// @include /^(?:http(s)://(www.)webnovel.com/library(.*))$/
// @include /^(?:http(s)://(www.)webnovel.com/history(.*))$/
// @include /^(?:http(s)://(www.)webnovel.com/book/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/403130/Webnovel%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403130/Webnovel%20-%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "webnovel.com" || location.hostname.endsWith(".webnovel.com"))) {
  css += `
      /* Variables */
      :root {
          --bg: #232323;
          --bg_dark: #1f1f1f;
          --bg_light: #303030;
          --bg_light_hover: rgba(100,100,100,0.5);
          --bg_selected: #3b66f5;
          
          --txt: #eee;
          --txt_dark: #aaa;
          --txt_genre: #83848f;
          --txt_title: lightslategray;
          --txt_lcol1: #eb1551;
          --txt_lcol2: #ff8d29;
          --txt_lcol3: #39cca0;
      }
  `;
}
if ((location.hostname === "passport.webnovel.com" || location.hostname.endsWith(".passport.webnovel.com"))) {
  css += `
      /* Sign-in/passport */
      html,
      body div {
          background: var(--bg);
      }
      
      .m-main-hd h3 {
          color: var(--txt_title);
      }
      
      p.m-input input {
          color: var(--txt);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/(#*))\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/category/.*)\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/ranking/.*)\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/profile/.*)\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/badges)\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/settings)\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/library(.*))\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/history(.*))\$").test(location.href) || new RegExp("^(?:http(s)://(www.)webnovel.com/book/.*)\$").test(location.href)) {
  css += `
      /* Header Bar */
      .g_header {
          background-color: var(--bg);
          border-bottom-color: var(--txt_title);
      }
      
      .g_header .g_search svg,
      .g_header .g_search strong {
          color: var(--txt_title);
      }
      
      .g_header .g_hd_link svg,
      .g_header .g_hd_link strong {
          color: var(--txt_title);
      }
      
      /* Header Bar - Search */
      
      .g_search_modal .g_search_header,
      .g_search_modal .g_search_header .g_search_input input {
          background-color: var(--bg_dark);
      }
      
      .g_search_modal .g_search_header .g_search_input input {
          border-color: var(--txt_title);
          color: var(--txt_title);
      }
      
      .g_search_panel,
      .g_search_result_list ul {
          background-color: var(--bg_dark);
      }
      
      .g_search_pop_list a,
      .g_search_result_list a,
      .g_search_result_list svg,
      .j_search_history a {
          color: var(--txt) !important;
      }
      
      .g_search_pop_list a:hover,
      .g_search_result_list a:hover {
          background: var(--bg_light_hover);
      }
      
      .j_search_history .g_search_tags a {
          background-color: var(--bg_light);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/(#*))\$").test(location.href)) {
  css += `
      /* Main Page */
      
      /* Page Body */
      html,
      body {
          background: var(--bg_dark);
          color: var(--txt);
      }
      
      /* Weekly Book */
      div[data-report-blocktitle="Weekly Book"] h3 {
          color: var(--txt_title);
      }
      
      /* Recent Activities */
      div[data-report-blocktitle="Recent Activities"] h3 {
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="Recent Activities"] ul :hover {
          /*background: var(--bg_light_hover);*/
          background: none;
      }
      
      div[data-report-blocktitle="Recent Activities"] ul :hover h4 {
          color: var(--txt_dark) !important;
      }
      
      div[data-report-blocktitle="Recent Activities"] p {
          color: var(--txt_dark) !important;
      }
      
      /* Weekly Featured */
      div[data-report-blocktitle="Weekly Featured"] h3,
      section[data-report-blocktitle="Weekly Featured"] h4, 
      section[data-report-blocktitle="Weekly Featured"] h4 a {
          color: var(--txt_title);
      }
      
      .m-book3 {
          background-color: var(--bg);
      }
      
      /* Limited Free For You */
      div[data-report-blocktitle="Limited Free For You"] h3,
      div[data-report-blocktitle="Limited Free For You"] h3 a {
          color: var(--txt_title);
      }
      
      /* Special For You */
      div[data-report-blocktitle="Special For You"] h3,
      div[data-report-blocktitle="Special For You"] h3 a {
          color: var(--txt_title);
      }
      
      /* Ranking */
      div[data-report-blocktitle="Ranking"] h3,
      div[data-report-blocktitle="Ranking"] h5 a {
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="Ranking"] p a {
          color: var(--txt_genre);
      }
      
      div[data-report-blocktitle="Ranking"] .c_danger {
          color: #eb1551 !important;
      }
      
      div[data-report-blocktitle="Ranking"] .c_warning {
          color: #ff8d29 !important;
      }
      
      div[data-report-blocktitle="Ranking"] .c_success {
          color: #39cca0 !important;
      }
      
      div[data-report-blocktitle="Ranking"] .ff_number {
          color: var(--txt);
      }
      
      /* New Ongoing Release */
      section[data-report-blocktitle="New Ongoing Release"] {
          background: var(--bg_dark);
      }
      
      section[data-report-blocktitle="New Ongoing Release"] h3,
      section[data-report-blocktitle="New Ongoing Release"] h4 a {
          color: var(--txt_title);
      }
      
      /* Potential Starlet */
      div[data-report-blocktitle="Potential Starlet"] h3,
      div[data-report-blocktitle="Potential Starlet"] h3 a{
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="Potential Starlet"] .bc_light_default {
          background: var(--bg);
      }
      
      /* New Tropes */
      div[data-report-blocktitle="New Tropes"] h3,
      div[data-report-blocktitle="New Tropes"] h3 a{
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="New Trops"] p a {
          color: var(--txt_genre);
      }
      
      /* Encouraging Novels */
      section[data-report-blocktitle="Encouraging Novels"] {
          background: var(--bg_dark);
      }
      
      section[data-report-blocktitle="Encouraging Novels"] h3,
      section[data-report-blocktitle="Encouraging Novels"] h4 a {
          color: var(--txt_title);
      }
      
      /* Completed */
      div[data-report-blocktitle="Completed"] h3,
      div[data-report-blocktitle="Completed"] h3 a {
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="Completed"] .bc_light_default {
          background: var(--bg);
      }
      
      /* Promising Novels */
      div[data-report-blocktitle="Promising Novels"] h3,
      div[data-report-blocktitle="Promising Novels"] h3 a {
          color: var(--txt_title);
      }
      
      div[data-report-blocktitle="Promising Novels"] p a {
          color: var(--txt_genre);
      }
      
      /* Trending Original */
      div[data-report-blocktitle="Trending Original"] h3,
      div[data-report-blocktitle="Trending Original"] h4 a {
          color: var(--txt_title);
      }
      
      /* Potential Entrant */
      section[data-report-blocktitle="Potential Entrant"] h3,
      section[data-report-blocktitle="Potential Entrant"] h4 a {
          color: var(--txt_title);
      }
      
      section[data-report-blocktitle="Potential Entrant"] p a {
          color: var(--txt_genre);
      }
      
      section[data-report-blocktitle="Potential Entrant"] {
          background: var(--bg_dark);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/category/.*)\$").test(location.href)) {
  css += `
      /* Browse Page */
      
      /* Page body */
      html,
      body {
          background-color: var(--bg_dark);
          color: var(--txt);
      }
      
      /* Headers */
      h3,
      .j_filter_form h4 {
          color: var(--txt_title);
      }
      
      /* Genre List */
      .m-switch {
          background-color: var(--bg_light);
      }
      .m-switch label {
          color: var(--txt_genre);
      }
      
      .m-switch-0:checked ~ .m-switch label:first-child,
      .m-switch-1:checked ~ .m-switch label:not(:first-child) {
          background-color: var(--bg_selected);
          color: var(--txt);
      }
      
      .m-accordion-bd li a {
          color: var(--txt_genre);
      }
      
      .m-accordion-icon {
          color: var(--txt);
      }
      
      /* Novel List */
      .j_category_wrapper h3 a {
          color: var(--txt_title);
      }
      
      .j_category_wrapper p,
      .j_category_wrapper p strong {
          color: var(--txt_genre)
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/ranking/.*)\$").test(location.href)) {
  css += `
      /* Rankings Pages */
      
      /* Page body */
      html,
      body {
          background-color: var(--bg_dark);
          color: var(--txt);
      }
      
      /* Headers */
      h3,
      .g_hr h4 {
          color: var(--txt_title);
      }
      
      /* Genre List */
      .m-accordion-bd a {
          color: var(--txt_genre);
      }
      
      .m-accordion-icon {
          color: var(--txt);
      }
      
      /* Ranking List */
      .f1 h5 {
          color: var(--txt_genre);
      }
      
      .m-release-item strong,
      .j_show_filter_sel strong,
      .j_show_filter_sel svg {
          color: var(--txt);
      }
      
      .j_rank_wrapper i.c_danger {
          color: var(--txt_lcol1) !important;
      }
      
      .j_rank_wrapper i.c_warning {
          color: var(--txt_lcol2) !important;
      }
      
      .j_rank_wrapper i.c_success {
          color: var(--txt_lcol3) !important;
      }
      
      .j_rank_wrapper .ff_number.tac {
          color: var(--txt);
      }
      
      .j_rank_wrapper h3 a {
          color: var(--txt_title)
      }
      
      .j_rank_wrapper .vam {
          color: var(--txt_genre);
      }
      
      /* Other Filters dropdown */
      .j_show_filter_container {
          background: var(--bg_light);
      }
      
      .j_show_filter_container legend {
          color: var(--txt_genre);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/profile/.*)\$").test(location.href)) {
  css += `
      /* Profile page */
      
      /* Page body */
      html,
      body,
      .header {
          background-color: var(--bg_dark);
          color: var(--txt);
      }
      
      .g_wrap p {
          color: var(--txt);
      }
      
      address svg, 
      address strong {
          color: var(--txt_genre);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/badges)\$").test(location.href)) {
  css += `
      /* Badges Page */
      
      /* Page body */
      html,
      body,
      .g_sub_hd {
          background: var(--bg_dark);
          color: var(--txt);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/settings)\$").test(location.href)) {
  css += `
      /* Settings/Edit Profile Page */
      
      /* Page body */
      html,
      body,
      .header {
          background: var(--bg_dark);
          color: var(--txt);
      }
      
      #settingForm .g_row label,
      #settingForm .g_row strong {
          color: var(--txt);
      }
      
      .fc_sel strong {
          color: black !important;
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/library(.*))\$").test(location.href)) {
  css += `
      /* Library Page */
      
      /* Page body */
      html,
      body,
      .g_sub_hd {
          background: var(--bg_dark);
      }
      
      h2,
      h3 {
          color: var(--txt_title);
      }
      
      a._on[title="Library"] {
          color: var(--txt) !important;
      }
      
      a[title="History"]:hover {
          color: var(--txt_genre) !important;
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/history(.*))\$").test(location.href)) {
  css += `
      /* History Page */
      
      /* Page body */
      html,
      body,
      .g_sub_hd {
          background: var(--bg_dark);
      }
      
      h2 {
          color: var(--txt_title);
      }
      
      a._on[title="History"] {
          color: var(--txt) !important;
      }
      
      a[title="Library"] {
          color: var(--txt_genre) !important;
      }
      
      .g_col h3 a {
          color: var(--txt_title);
      }
      
      .g_star_num small {
          color: var(--txt_genre);
      }
      
      .g_tags a,
      ._oprate a {
          color: var(--bg_selected) !important;
      }
      
      .g_col a {
          color: var(--txt_genre);
      }
  `;
}
if (new RegExp("^(?:http(s)://(www.)webnovel.com/book/.*)\$").test(location.href)) {
  css += `
      /* Book Page */
      
      /* Page Body */
      body,
      .page div {
          background: var(--bg_dark);
          color: var(--txt);
      }
      
      /* Book Info */
      .det-hd .c_000 {
          color: var(--txt_genre);
      }
      
      .det-info h2 {
          color: var(--txt_title);
      }
      
      .det-hd-detail a,
      .det-hd-detail strong {
          color: var(--txt_genre);
      }
      .det-hd address span {
          color: var(--bg_selected);
      }
      
      /* About | Table of Contents Bar */
      .det-tab-nav ._on span {
          color: var(--bg_selected) !important;
      }
      
      /* About */
      #about p.c_000 {
          color: var(--txt);
      }
      
      /* Table of Contents */
      #contents li {
          background: var(--bg_dark);
      }
      #contents li i {
          color: var(--bg_selected);
      }
      #contents li strong {
          color: var(--txt);
      }
      
      /* You may also like */
      .j_books_you_also_like .m-book-title h3 {
          color: var(--txt_title);
      }
      .j_books_you_also_like .g_star_num small {
          color: var(--txt_dark);
      }
      
      /* Reviews */
      #review .g_star_num small {
          color: var(--txt_dark);
      }
      #review .g_tab_nav ._on {
          color: var(--bg_selected);
      }
      .m-comment-tool {
          color: var(--txt_dark);
      }
      .m-comment-ft strong {
          color: var(--txt_dark);
      }
      #pagination .ui-page-x a,
      #pagination .ui-page-x .ui-page-ellipsis {
          color: var(--txt_dark);
      }
      #pagination .ui-page-x .ui-page-prev,
      #pagination .ui-page-x .ui-page-next {
          color: var(--txt);
      }
      
      /* Leave a review */
      #reviewModal .rev-modal-score-list strong {
          color: var(--bg_selected)
      }
      #reviewModal textarea {
          color: var(--txt);
      }
      #reviewModal .btn_rich_modal {
          color: var(--txt)
      }
      #reviewModal .rich_modal_footer strong {
          color: var(--txt);
      }
      
      /* Review Replies */
      #replyDetailModal div {
          background: var(--bg);
          color: var(--txt);
      }
      #replyDetailModal blockquote {
          background: var(--bg_light);
          color: var(--txt);
      }
      #replyDetailModal .g_mod_chat_ft input {
          background: var(--bg);
          color: var(--txt);
      }
      
      /* Review Replies - Add a Comment */
      .rich_modal .g_mod {
          background: var(--bg);
      }
      .rich_modal .g_mod h4 {
          color: var(--txt)
      }
      .rich_modal .g_mod .modal_quote,
      .rich_modal .g_mod .modal_quote div {
          background: var(--bg_light);
          color: var(--txt);
      }
      .rich_modal .g_mod textarea {
          background: var(--bg_light);
          color: var(--txt) !important;
      }
      .rich_modal .g_mod .btn_rich_modal {
          color: var(--txt);
      }
      
      /* Usernames */
      .fans-list a strong,
      .m-comment-hd h3 a {
          color: var(--txt);
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
