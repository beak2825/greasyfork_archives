// ==UserScript==
// @name        Adslgate+
// @namespace   https://www.in4sser.com
// @match       *://www.adslgate.com/*
// @grant       none
// @icon        https://www.adslgate.com/dsl/favicon.png
// @version     1.1
// @author      iN4sser
// @grant       GM_addStyle
// @description تفعيل الثيم الليلي في المنتدى
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442639/Adslgate%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/442639/Adslgate%2B.meta.js
// ==/UserScript==

// Styling
GM_addStyle ( `
  body
  {
    background: #15202b;
  }
  .vbmenu_control
  {
    background: #203244;
  }
  .tcat
  {
    background: #203244;
  }
  .tborder
  {
    background: #101921;
  }
  .thead
  {
    background: #203244;
  }
  .alt1, .alt1Active
  {
    background: #15202b;
  }
  strong
  {
    color: white;
  }
  .smallfont
  {
    color: #c5c5c5;
  }
  .navbar
  {
    color: aliceblue;
  }
  a:link, body_alink
  {
    color: #c3c3c3;
  }
  .alt2, .alt2Active
  {
    background: #203244;
    color: #ffffff;
    border: 1px solid #101921 !important;
  }
  a:visited, body_avisited
  {
    color: black;
  }
  .time
  {
    color: #ffffff;
  }
  td.thead, div.thead
  {
    border: 1px solid #101921 !important;
  }
  .alt1, .alt1Active
  {
    border: 1px solid #101921 !important;
  }
  .AdslGate-image
  {
    background: #203244;
  }
  .footer
  {
    background-color: #000000;
    border-top: 1px solid #15202b;
  }
  .footer li a
  {
    color: #bbbbbb;
  }
  a:visited, body_avisited
  {
    color: #c3c3c3;
  }
  .alt1, .alt1Active
  {
    color: #cccccc;
  }
  .shortcutlinks
  {
    background-color: #000000;
    border-bottom: 1px solid #15202b;
  }
  textarea, .bginput
  {
    background: #203244;
    color: white;
  }
  .panel
  {
    background: none;
    border: none;
  }
  .panelsurround
  {
    background: none;
    border: none;
  }
  legend
  {
    color: white;
  }
  label
  {
    color: white;
  }
  input[type="text"]
  {
    background: #324d69;
    border: 1px solid #15202b !important;
  }
  .vBulletin_editor
  {
    background: #203244;
  }
  .fieldset, .fieldset td, .fieldset p, .fieldset li
  {
    color: white;
  }
  .tcat a:hover, .tcat a:active, .tcat_ahover
  {
    color: #00ceff;
  }
  .quote-form
  {
    background: #324d69;
    border: 1px solid rgb(21, 32, 43);
  }
  div#main_text
  {
    color: white;
  }
` );