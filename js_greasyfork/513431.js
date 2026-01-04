// ==UserScript==
// @name Wigle.net Dark Mode (Beta)
// @namespace https://userstyles.world/user/Nick2bad4u
// @version 20241018.02.34
// @description Dark Mode (Beta) for Wigle.net
// @author Nick2bad4u
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wigle.net/*
// @downloadURL https://update.greasyfork.org/scripts/513431/Wiglenet%20Dark%20Mode%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513431/Wiglenet%20Dark%20Mode%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
let css = `
  body,
  .panel-body,
  .toolsSection,
  td,
  #resultColumn,
  ul,
  div#newsBar,
  .newsItem,
  .contentall.contentwithheader.row,
  .dd-selected,
  ol.breadcrumb,
  .searchControl,
  #wigleMain > ul > li.active > a {
    background-color: #121212;
    color: #ffffff;
  }
  .navbar,
  .footer,
  .dropdown-menu,
  .modal-content {
    background-color: #1e1e1e;
    border-color: #444;
  }
  .navbar-brand img,
  .navbar-toggle .icon-bar,
  .navbar-nav > li > a,
  .dropdown-menu > li > a,
  #map_ext_wrapper,
  input.mapfilter,
  input#savelinkhereID {
    filter: invert(1);
  }
  input,
  select,
  textarea {
    background-color: #333;
    color: #ffffff;
    border: 1px solid #666;
  }
  a {
    color: #bb86fc;
  }
  .btn,
  .btn-default,
  .btn-block {
    background-color: #333;
    color: #ffffff;
    border: 1px solid #666;
  }
  .form-control {
    background-color: #333;
    color: #ffffff;
  }
  .mapBarItem,
  .mapForm,
  .mapFilter,
  .mapBarSlider,
  .mapBarStatus,
  .mapBarShowHide,
  .mapBarItem table,
  .mapBarItem input,
  .mapBarItem select,
  .mapBarItem label {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  .statsGraphInner,
  .statsgraphcontainer,
  .graphContextLinks,
  .graphCaption {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  .hilite-stats {
    color: #bb86fc;
  }
  .modal-header,
  .modal-footer,
  .jumbotron {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  .modal-header .close {
    color: #ffffff;
  }
  .modal-body {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  .container,
  .row,
  .col-sm-12,
  .col-sm-9,
  .col-sm-3,
  .col-sm-2,
  .col-sm-1 {
    background-color: #1e1e1e;
    color: #fff;
  }
  #newsBar,
  .graphCaption,
  .pageControls {
    color: #000000;
  }
  #uploadsTable,
  #mapBar {
    filter: invert(1);
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
