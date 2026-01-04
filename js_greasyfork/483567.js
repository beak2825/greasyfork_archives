// ==UserScript==
// @name         Dark Wiki
// @namespace    Dark Wiki
// @version      2.0
// @description  Turn Torn's wiki dark
// @author       AfricanChild [3157295] 
// @owner        Phillip_J_Fry [2184575]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://wiki.torn.com/wiki/*
// @grant        GM_addStyle
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/483567/Dark%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/483567/Dark%20Wiki.meta.js
// ==/UserScript==

GM_addStyle(`
  /* Body */
  body, body[class], body[id], body[data-theme] {
    background-color: #191919 !important;
  }

  /* Main content */
  .col-12.col-md-8.content-area-wrapper {
    background-color: #333333 !important;
  }

  /* Headers */
  h1, h2, h3, h4 {
    color: #efb300;
    border-bottom: 1px solid #4d4d4d !important;
  }
  .firstHeading {
    border-bottom: none !important;
  }

  /* Paragraphs */
  p {
    color: white !important;
  }

  /* List */
  li {
    color: #a2a9b1 !important;
  }

  /* Link colors */
  a, .toctogglelabel {
    color: #4cc9ff !important;
  }

  /* Button */
  .torn-mass-collapse-control a {
    color: white !important;
    background-color: #4d4d4d !important;
    border: none !important;
  }

  /* Top navigation */
  .card.torn-navigation-header {
    background-image: none !important;
    background-color: #333333 !important;
  }
  .torn-back-button {
    color: white !important;
  }

  /* Bottom navigation */
  .card.torn-navigation-panel {
    background-color: #333333 !important;
  }

  /* Footer */
  .list-inline {
    color: #a2a9b1 !important;
  }
  .catlinks {
    border: 0.5px solid #4d4d4d !important;
  }

  /* Misc */
  pre {
    background-color: #292929 !important;
    color: white !important;
    border: none !important;
  }
  th {
    background-color: #292929 !important;
    color: white !important;
  }
  .content-area-wrapper #content {
    color: #a2a9b1 !important;
  }

  /* Table */
  .table th {
    border: 2px solid #4d4d4d !important;
  }
  .table td {
    border: 1px solid #4d4d4d !important;
  }
  td {
    background-color: #292929 !important;
    color: white !important;
  }
  .content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > th,
  .content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > td {
    background-color: #333333 !important;
    color: white !important;
    border-top: 0.5px solid #737373 !important;
  }
`);