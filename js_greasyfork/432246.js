// ==UserScript==
// @name Fanfiction.net Dark Theme
// @namespace userstyles.world/user/jojotastic777
// @version 20210914.03.21
// @description A comprehensive dark theme for fanfiction.net
// @author jojotastic777
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match https://www.fanfiction.net/
// @match https://www.fanfiction.net/*
// @match https://www.fanfiction.net/u/*
// @match https://www.fanfiction.net/r/*
// @match https://www.fanfiction.net/s/*
// @downloadURL https://update.greasyfork.org/scripts/432246/Fanfictionnet%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/432246/Fanfictionnet%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.fanfiction.net/")) {
  css += `
  :root {
      --main-bg: #2a2a2a;
      --dim-bg: #222;
      --bar-bg: #333;
      --bright-bg: #555;
      --bright-hl-bg: #454;
      
      --dim-fg: #aaa;
      --main-fg: #fff;
      --link-fg: #77c;
      --link-accent-fg: #da9;
  }

  .btn, .btn:hover, .btn:focus {
      background-image: none;
      background-color: var(--bright-bg);
      color: var(--main-fg);
      
      box-shadow: none;
      border: none;
      border-radius: 0.25em !important;
      text-shadow: none;
  }

  .dropdown-toggle.btn .caret {
      display: none;
  }

  .badge, .badge:hover {
      background-color: var(--bright-bg);
  }

  body {
      background-color: var(--bar-bg) !important;
  }

  hr {
      display: none;
  }

  input {
      background-color: var(--bright-bg) !important;
      color: var(--main-fg) !important;
      border: none !important;
  }

  select {
      background-image: none;
      background-color: var(--bright-bg);
      color: var(--main-fg);
      
      box-shadow: none;
      border: none;
      border-radius: 0.25em !important;
      text-shadow: none;
  }

  select.selection_hl {
      background-color: var(--bright-hl-bg)
  }

  ::placeholder {
      color: var(--dim-fg);
  }

  #content_parent {
      background-color: var(--dim-bg) !important;
  }

  #content_wrapper {
      background-color: var(--main-bg) !important;
      color: var(--main-fg);
  }

  #content_wrapper_inner {
      border: none;
  }

  .lc {
      background: none;
  }

  .lc-wrapper::after {
      border: none;
  }

  #content_wrapper a, #p_footer a {
      color: var(--link-fg);
      border-color: var(--link-fg);
  }

  #content_wrapper a.reviews {
      color: var(--link-accent-fg) !important;
  }

  img {
      border: none !important;
  }

  #p_footer {
      color: var(--dim-fg);
  }

  .z-list {
      border: none !important;
  }

  .xgray {
      color: var(--dim-fg);
  }

  .zmenu {
      background-color: var(--bar-bg);
      border: none;
      padding-top: 0 !important;
  }

  a.dropdown-toggle {
      color: var(--main-fg);
      margin: 0;
  }

  a.dropdown-toggle:hover {
      color: var(--dim-fg);
  }

  a.dropdown-toggle:hover {
      text-decoration: none;
  }

  a.dropdown-toggle > b {
      display: none;
  }

  .dropdown-menu {
      background-color: var(--bar-bg);
  }

  .dropdown-menu li a {
      color: var(--main-fg);
  }

  .dropdown-menu li.disabled a {
      color: var(--dim-fg);
  }

  .dropdown-menu li.divider {
      background-color: var(--dim-fg);
      border-color: var(--dim-fg);
  }

  .modal, .modal-body, .modal-footer {
      background-color: var(--main-bg);
      border: none;
      box-shadow: none;
  }

  .icon-chevron-right {
      color: var(--main-fg);
  }

  #follow_area * {
      color: var(--main-fg);
  }

  .panel_normal {
      background-color: var(--main-bg);
      color: var(--main-fg);
      border: none;
  }

  table thead {
      border: none !important;
  }

  .table td {
      border: none;
  }

  .table-bordered {
      border: none !important;
  }

  .table-bordered th {
      border: none;
  }

  .table-striped tbody > tr:nth-child(2n+1) > td {
      background-color: var(--main-bg);
      border: none;
  }

  .tcat {
      background-color: var(--main-bg);
      border: none !important;
  }

  .topnav {
      border: none;
  }

  .underline {
      border: none;
  }

  .modal-wrapper {
      color: var(--main-fg);
  }

  .modal-header {
      border: none;
  }

  .nav.nav-tabs {
      border: none;
  }

  .nav.nav-tabs > .active > a {
      background-color: var(--bright-hl-bg);
      border: none;
  }

  .nav.nav-tabs > li > a {
      background-color: var(--bright-bg);
      border: none;
      color: var(--main-fg) !important;
  }

  .nav.nav-tabs > li > a > .badge {
      background-color: var(--bar-bg);
  }
  `;
}
if (location.href.startsWith("https://www.fanfiction.net/u/")) {
  css += `
  .table-bordered {
      border: none;
  }

  table.table-striped * {
      border: none;
  }

  table.table-striped tbody > tr:nth-child(2n+1) > td {
      background-color: var(--bg-main);
  }

  .tcat {
      background-color: var(--bg-bar);
      border: none !important;
  }
  `;
}
if (location.href.startsWith("https://www.fanfiction.net/r/")) {
  css += `
  .table-bordered {
      border: none;
  }

  .table-bordered th {
      border: none;
  }

  .table td {
      border: none;
  }

  .table-striped tbody > tr:nth-child(2n+1) > td {
      background-color: var(--bar-bg) !important;
  }
  `;
}
if (location.href === "https://www.fanfiction.net/") {
  css += `
  #content_wrapper_inner {
      min-height: 80vh;
  }

  #content_wrapper_inner > table {
      display: none;
  }

  .table-bordered {
      background-color: var(--bar-bg);
      border: none !important;
  }

  .tcat {
      background-color: var(--bright-bg);
      border: none !important;
  }
  `;
}
if (location.href.startsWith("https://www.fanfiction.net/s/")) {
  css += `
  .lc, .lc-left {
      background-color: var(--main-bg) !important;
  }

  textarea {
      background-color: var(--bar-bg);
      border: none;
  }

  .xgray.xcontrast_txt {
      color: var(--dim-fg) !important;
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
