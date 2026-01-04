// ==UserScript==
// @name         ROBLOX 2011 BC Page
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  A script that restores the 2011 Roblox BC Page.
// @author       Xammand
// @match        *://*.roblox.com/premium/membership*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/542802/ROBLOX%202011%20BC%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/542802/ROBLOX%202011%20BC%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append($(`
    <style>
    a {
  text-decoration:none;
}
a img {
  border:none;
}
a:link,
a:visited,
a:active {
  color:#095fb5;
}
a:hover {
  text-decoration:underline;
}
abbr,
acronym {
  cursor:help;
  border-bottom:1px dotted #000;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin:0;
  padding:0;
  font-size:100%;
  font-weight:inherit;
  display:inline-block;
  *display:inline;
}
pre {
  white-space:pre-wrap;
  white-space:-moz-pre-wrap!important;
  white-space:-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
}
input.Text {
  border-color:#777;
  border-style:dashed;
}
.AdminPanel {
  border-color:Orange;
  border-style:dotted;
  padding:10px;
}
.ImageButton {
  cursor:pointer;
  padding:0;
  border:0;
  text-decoration:none;
  margin:0;
  display:inline-block;
}
.Button {
  cursor:pointer;
  background-color:#fff;
  border:solid 1px #333;
  color:#333;
  font-family:Verdana,Sans-Serif;
  font-size:.9em;
  padding:3px 10px 3px 10px;
  text-decoration:none;
}
.Button:link,
.Button:visited {
  border:solid 1px #777;
  color:#777;
}
.Button:hover,
.Button:active {
  background-color:#6e99c9;
  border:solid 1px #000;
  color:#fff;
}
.Bullet {
  float:left;
  margin-right:10px;
  margin-bottom:4px;
}
.Ads_RightSidebar {
  border:solid 1px #000;
  float:right;
  text-align:right;
  width:160px;
}
.MultilineTextBox {
  border:dashed 2px Gray;
  font-family:Verdana,Sans-Serif;
  font-size:1.2em;
  line-height:1.5em;
  padding:5px 5px;
}
.TextBox {
  border:1px solid #ccc;
  font-family:Verdana,Sans-Serif;
  font-size:1.2em;
  padding:5px;
}
.Label {
  font-weight:bold;
}
.BigButton {
  background-color:#F5CD2F;
  color:#000;
  height:2.5em;
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:20px;
  font-weight:bold;
}
.BigButtonDisabled {
  background-color:#C0C0C0;
  color:#000;
  height:2.5em;
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:20px;
  font-weight:bold;
}
.ErrorReporting,
.ErrorReportingThanks {
  width:500px;
  margin:16px auto 16px auto;
  padding:10px;
}
.YesNoButtons {
  text-align:right;
}
.YesButton,
.NoButton {
  background-color:#F5CD2F;
  color:#000;
  margin-left:10px;
}
.popupControl {
  background-color:#fff;
  border:1px outset #fff;
  position:absolute;
  visibility:hidden;
  z-index:1;
}
.ColorPickerItem {
  border-color:#fff;
  border-style:solid;
  border-width:2px;
}
.ColorPickerItem:hover {
  border-color:Blue;
  border-style:solid;
  border-width:2px;
}
.modalBackground {
  background-color:Gray;
  filter:alpha(opacity=30);
  opacity:.3;
}
.modalPopup {
  background-color:#ffd;
  border-width:3px;
  border-style:solid;
  border-color:Gray;
  padding:3px;
}
.newModalPopup {
  padding:3px;
}
.GuestModePromptText {
  font-size:14px;
  color:#333;
  margin-left:30px;
}
.GuestModePromptText li {
  font-weight:bolder;
}
.PopupMenu {
  background-color:#fff;
  border:solid 1px #666;
  padding:10px;
  z-index:1;
}
.PopupMenu .Button {
  line-height:2.5em;
}
.PopupMenu .Button:hover {
  background-color:#6e99c9;
  color:#fff;
}
.Attention {
  color:Red;
}
.AttentionBold {
  font-weight:bold;
  color:Red;
}
.OKCancelButton {
  width:80px;
}
.MenuItem {
  color:White;
  font-size:18px;
  line-height:2em;
}
a.MenuItem:link,
a.MenuItem:visited,
a.MenuItem:active {
  color:White;
  text-decoration:none;
}
a.MenuItem:hover {
  text-decoration:underline;
}
.Toolbox {
  background-color:ButtonFace;
  padding:2px;
}
.ToolboxItem {
  border-color:Window;
  border-style:solid;
  border-width:2px;
  width:52px;
  height:52px;
}
.Grid {
  background-color:White;
  border-color:#CCC;
  border-width:1px;
  border-style:solid;
}
.GridHeader {
  color:White;
  background-color:#6E99C9;
}
.GridItem {
  color:#006;
}
.GridItemAlt {
  color:#006;
  background:#EEE;
}
.GridItem:hover {
  background-color:#DDD;
}
.GridItemAlt:hover {
  background-color:#DDD;
}
.GridFooter {
  color:White;
  background-color:#6E99C9;
}
.GridPager {
  color:White;
  background-color:#6E99C9;
  text-align:center;
  font-weight:bold;
}
.Title {
  font-size:18px;
}
a.Title:link,
a.Title:visited,
a.Title:active {
  text-decoration:none;
}
a.Title:hover {
  text-decoration:underline;
}
.Header {
  font-size:14px;
}
.Banner {
  padding:8px;
}
.BannerText {
  font-weight:bold;
  color:white;
}
a.BannerText:link,
a.BannerText:visited,
a.BannerText:active {
  text-decoration:none;
  color:white;
}
a.BannerText:hover {
  text-decoration:underline;
  color:white;
}
.PageSelector {
  font-family:Verdana,Sans-Serif;
  margin:0 0 0 10px;
}
.PageSelector label {
  font-weight:bold;
}
.DisplayFilters {
  margin-right:3px;
  min-width:0;
  position:relative;
}
.SearchBar {
  background-color:#eee;
  border:solid 1px #bbb;
  height:30px;
  margin:-5px 0 5px 0;
  padding:0;
  text-align:center;
}
.SearchBar .SearchBox,
.SearchBar .SearchButton {
  height:30px;
  margin:0;
  padding:0;
}
.SearchBar .TextBox {
  border:solid 1px #000;
  height:19px;
  margin:2px 0 0 0;
  padding:2px 3px 0 3px;
  width:250px;
}
.SearchLinks {
  display:inline;
  font-family:Verdana,Sans-Serif;
  z-index:9;
}
.SearchLinks a span {
  display:none;
}
.SearchLinks a:hover {
  border:none;
  text-decoration:none;
}
.SearchLinks a:hover span {
  background-color:#6e99c9;
  border-color:Gray;
  border-style:ridge;
  border-width:1px;
  color:white;
  display:block;
  font:11px Verdana,sans-serif;
  left:15%;
  line-height:1.4em;
  margin:5px;
  padding:5px;
  position:absolute;
  text-align:center;
  text-decoration:none;
  top:20px;
  width:60%;
  z-index:10;
}
.SearchError {
  clear:both;
  margin:2px;
  float:none;
  padding:2px;
  text-align:center;
  color:Red;
}
div.SystemAlert {
  width:906px;
  margin:0 auto 5px;
  border:1px solid gray;
  background-color:#FFF;
  text-align:center;
  color:#FFF;
  padding:1px;
}
.SystemAlertText {
  font-size:16px;
  font-weight:bold;
  background-color:#F00;
  padding:2px;
}
.SystemAlert a {
  color:White;
}
.Exclamation {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Icons/exclamation.png) no-repeat;
  height:16px;
  width:16px;
  float:left;
}
.EmailTemplateTable {
  border-collapse:collapse;
}
.EmailTemplateH1 {
  font-size:18px;
  color:#6E99C9;
}
.EmailTemplateLogoRow {
  padding:3px;
  margin-bottom:5px;
}
.EmailTemplateRow {
  padding:3px;
  margin-bottom:3px;
  font-size:14px;
  font-family:Verdana,Helvetica,Sans-Serif;
}
.EmailTemplateRow input {
  font-size:14px;
  padding:2px;
  border:1px solid #CCC;
}
.EmailTemplateRow input:hover {
  font-size:14px;
  padding:2px;
  border:1px solid #CCC;
  background:#6E99C9;
}
.subMenu {
  background:#A3514F;
  background-repeat:repeat-x;
  color:White;
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:14px;
  height:26px;
  position:relative;
  border-left:solid 3px #6E99C9;
  border-right:solid 3px #6E99C9;
  border-bottom:solid 3px #6E99C9;
  z-index:5;
}
.subMenu ul {
  padding:0;
  margin:0;
  list-style-type:none;
}
.subMenu li {
  float:left;
  position:relative;
}
.subMenu a,
.subMenu a:visited {
  display:block;
  padding:5px;
  border-right:1px solid #FFF;
  font-size:14px;
  color:#FFF;
}
.subMenu .subMenuItemselected {
  display:block;
  padding:5px;
  border-right:1px solid #FFF;
  font-size:14px;
  color:#FFF;
  font-weight:bold;
  text-decoration:none;
}
.subMenu ul ul a.subMenudrop,
.menu ul ul a.subMenudrop:visited {
  font-weight:bold;
  text-decoration:underline;
}
.subMenu ul ul ul a,
.subMenu ul ul ul a:visited {
  background:#A3514F;
}
.subMenu ul ul ul a:hover {
  text-decoration:underline;
}
.subMenu ul ul {
  visibility:hidden;
  position:absolute;
  height:0;
  left:0;
}
.subMenu ul ul ul {
  left:141px;
  top:0;
  width:149px;
}
.subMenu ul ul ul.left {
  left:-149px;
}
.subMenu ul ul a,
.subMenu ul ul a:visited {
  background:#A3514F;
  color:#FFF;
  height:auto;
  padding:4px 6px;
  line-height:1em;
  width:148px;
  margin-left:-1px;
  border-left:1px solid #FFF;
  border-right:none;
}
.subMenu a:hover,
.subMenu ul ul a:hover {
  text-decoration:underline;
  background:#573333;
}
.subMenu :hover>a,
.subMenu ul ul :hover>a {
  text-decoration:underline;
}
.subMenu ul li:hover ul,
.subMenu ul a:hover ul {
  visibility:visible;
}
.subMenu ul :hover ul ul {
  visibility:hidden;
}
.subMenu ul :hover ul :hover ul {
  visibility:visible;
}
.subMenu table {
  position:absolute;
  top:0;
  margin-top:15px;
  left:0;
  border-collapse:collapse;
  background:#A3514F;
  display:none;
}
.subMenu table a,
.subMenu table a:visited {
  border:none;
  width:148px;
  padding-top:8px;
}
#LeftGutterAdContainer,
#GamesTakeoverGutterAdLeft {
  position:fixed;
  top:0;
  left:50%;
  margin-left:-850px;
}
#RightGutterAdContainer,
#GamesTakeoverGutterAdRight {
  position:fixed;
  top:0;
  left:50%;
  margin-left:450px;
}
.partnerLogo {
  margin-right:30px;
  vertical-align:middle;
}
.errorMsg {
  font-weight:bold;
  text-align:center;
  display:block;
  font-size:1.5em;
  margin:.83em 0;
  letter-spacing:1px;
}
.facebook-connect-btn {
  display:block;
  width:186px;
  height:25px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Facebook/btn-fb_connect.png) no-repeat;
}
.facebook-connect-btn:hover {
  background-position:0 -25px;
}
.facepile {
  min-height:0;
}
.btn-ok {
  cursor:pointer;
  width:102px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-ok.png);
}
.btn-ok:hover {
  background-position:0 50px;
}
.JSPager_Container a {
  margin:0 2px;
}
.JSPager_Container a:hover {
  cursor:pointer;
}
.JSPager_Container a.disabled:hover {
  cursor:text;
}
.JSPager_Container a.disabled {
  color:#000;
  text-decoration:none;
}
.blueAndWhite {
  border:2px solid #6e99c9;
  background-color:#fff;
  color:#000;
}
.blueAndWhite .titleBar {
  background-color:#000;
  color:#FFF;
  font-weight:bold;
  padding:2px 2px 2px 2px;
  margin-bottom:5px;
  font-size:13px;
}
#ResetPassword,
#ResetPassword input {
  font-size:16px;
}
#ResetPassword #ResetPasswordTable td {
  padding:5px;
}
div.ParentsLearningContent div.StandardBoxLightHeader a {
  color:White!important;
  cursor:pointer;
}
.ParentsLearningContent {
  font-size:14px;
}
.ParentsLearningContent .ParentsLearningHeader {
  text-decoration:none;
}
.StandardBoxLight {
  float:inherit;
  border:1px solid #3B526B;
  padding:10px 10px 10px 10px;
  margin-bottom:10px;
  display:block;
}
.StandardBoxLightHeader {
  float:inherit;
  background-color:#3B526B;
  text-align:center;
  color:#FFF;
  text-align:left;
  font-size:16px;
  font-weight:bold;
  padding:5px 10px 5px 20px;
  display:block;
}
.ParentsLearningContent .StandardBoxLightHeader {
  margin:10px 0;
}
.LoginParentAccount {
  text-align:left;
}
.ParentsControlPanel,
.ParentsControlPanel input {
  font-size:14px;
}
.ParentsControlPanelTable table {
  border-collapse:collapse;
  border-spacing:0;
}
.ParentsControlPanelTable table td,
.ParentsControlPanelTable table th {
  border:1px solid #EEE;
  padding:5px;
}
.ParentsControlPanelTable table tr:first-child td,
.ParentsControlPanelTable table tr:first-child th {
  border-top:0;
}
.ParentsControlPanelTable table tr:last-child td {
  border-bottom:0;
}
.ParentsControlPanelTable table tr td:first-child,
.ParentsControlPanelTable table tr th:first-child {
  border-left:0;
}
.ParentsControlPanelTable table tr td:last-child,
.ParentsControlPanelTable table tr th:last-child {
  border-right:0;
}
.ContinueButtonFix {
  text-align:center;
}
.ParentCenterAlignedTable table {
  margin:0 auto;
}
.JustWhiteBox {
  float:inherit;
  background-color:White;
  margin-bottom:10px;
  display:block;
}
.MediumButton {
  background-color:#F5CD2F;
  color:#000;
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:15px;
  font-weight:bold;
  padding:5px;
  display:inline-block;
  border:1px solid #6E99C9;
  text-align:center;
  cursor:pointer;
}
.MediumButton:hover {
  background-color:#FF9D2F;
}
.MediumButtonSignup {
  background-color:#8CE16F;
  color:#000;
  height:2.5em;
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:15px;
  font-weight:bold;
}
.catalog_nav {
  color:White;
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:14px;
  position:relative;
  z-index:5;
  float:right;
}
.catalog_nav ul {
  padding:0;
  margin:0;
  list-style-type:none;
}
.catalog_nav li {
  float:left;
  position:relative;
  text-align:center;
}
.catalog_nav a,
.catalog_nav a:visited {
  background:#b9cee5 url(/web/20120611211431im_/http://www.roblox.com/images/tabmiddle.png) repeat-x;
  display:block;
  padding:5px;
  margin-right:4px;
  font-size:14px;
  color:#FFF;
  height:18px;
  cursor:pointer;
}
.catalog_nav .catalog_navselected {
  display:block;
  background:#6E99C9 url(/web/20120611211431im_/http://www.roblox.com/images/tabmiddleselected.png) repeat-x;
  padding:5px 10px;
  margin-right:4px;
  font-size:14px;
  color:#FFF;
  font-weight:bold;
  text-decoration:none;
  height:18px;
}
.catalog_nav ul ul a.catalog_navdrop,
t.menu ul ul a.catalog_navdrop:visited {
  font-weight:bold;
  text-decoration:none;
}
.catalog_nav ul ul ul a:hover {
  text-decoration:underline;
}
.catalog_nav ul ul {
  visibility:hidden;
  position:absolute;
  height:0;
  left:0;
  z-index:20;
}
.catalog_nav ul ul ul {
  left:141px;
  top:0;
  width:89px;
}
.catalog_nav ul ul ul.left {
  left:-149px;
}
.catalog_nav ul ul a,
.catalog_nav ul ul a:visited {
  color:#FFF;
  background:#6E99C9;
  height:auto;
  padding:4px 6px;
  line-height:1em;
  width:78px;
  margin-right:4px;
  z-index:20;
  height:18px;
}
.catalog_nav img {
  border:0;
  margin-right:3px;
  vertical-align:middle;
}
.catalog_nav a:hover {
  text-decoration:none;
  background:#6E99C9 url(/web/20120611211431im_/http://www.roblox.com/images/tabmiddleselected.png) repeat-x;
}
.catalog_nav ul ul a:hover {
  text-decoration:none;
  background:#517194;
}
.catalog_nav :hover>a,
.catalog_nav ul ul :hover>a {
  text-decoration:none;
}
.catalog_nav ul li:hover ul,
.catalog_nav ul a:hover ul {
  visibility:visible;
}
.catalog_nav ul :hover ul ul {
  visibility:hidden;
}
.catalog_nav ul :hover ul :hover ul {
  visibility:visible;
}
.catalog_nav table {
  position:absolute;
  top:0;
  margin-top:15px;
  left:0;
  border-collapse:collapse;
  background:#6E99C9;
  display:none;
}
.catalog_nav table a,
.catalog_nav table a:visited {
  border:none;
  width:78px;
  padding-top:8px;
}
.Step1 {
  float:left;
  font-size:16px;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/step1.png) no-repeat 0;
  line-height:32px;
  padding-left:32px;
}
.Step2 {
  float:left;
  font-size:16px;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/step2.png) no-repeat 0;
  line-height:32px;
  padding-left:32px;
}
.Step3 {
  float:left;
  font-size:16px;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/step3.png) no-repeat 0;
  line-height:32px;
  padding-left:32px;
}
.CatalogOptions {
  float:left;
  padding:20px;
  background:#8bc2ff url(/web/20120611211431im_/http://www.roblox.com/images/catalog_options_back.png) repeat-x;
  border:0;
  margin-bottom:0;
  display:none;
  width:176px;
  overflow:hidden;
}
#ApplyFilters input {
  font-size:17px;
  cursor:pointer;
}
.CatalogOptionsSections {
  float:left;
  margin:5px 20px 0 5px;
}
.CatalogOptionsHelp {
  margin-top:-5px;
  float:left;
}
.CatalogOptionsHelp ul {
  list-style:none;
}
.CatalogOptionsHelp ul li {
  margin-top:3px;
}
.CatalogOptionsHelp ul li a {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/smallmetallicbutton.png) repeat-x;
  border:2px solid transparent;
  padding:3px;
  font-size:12px;
  cursor:pointer;
  text-decoration:none;
  display:block;
  width:120px;
  text-align:center;
}
.CatalogOptionsHelp ul li a:hover {
  border-color:#333;
}
.bc_iconset,
#BuildersClubContainer div.icons {
  background-image:url(/images/bc_page_icon_sprites.png?v=2);
  background-repeat:no-repeat;
  width:32px;
  display:inline-block;
  text-align:center;
}
#BuildersClubContainer div.maps_icon {
  background-position:0 1px;
  height:30px;
}
#BuildersClubContainer div.money_icon {
  background-position:0 -28px;
  height:28px;
}
#BuildersClubContainer div.shirt_icon {
  background-position:0 -55px;
  height:30px;
}
#BuildersClubContainer div.ads_icon {
  background-position:0 -85px;
  height:30px;
}
.bc_icon,
#BuildersClubContainer div.bc_icon {
  background-position:0 -115px;
  height:31px;
}
#BuildersClubContainer div.gear_icon {
  background-position:0 -146px;
  height:30px;
}
#BuildersClubContainer div.groups_icon {
  background-position:0 -173px;
  height:23px;
}
#BuildersClubContainer div.badges_icon {
  background-position:0 -196px;
  height:30px;
}
#BuildersClubContainer div.beta_icon {
  background-position:0 -228px;
  height:31px;
}
#BuildersClubContainer div.tbc_icon {
  background-position:0 -263px;
  height:31px;
}
#BuildersClubContainer div.obc_icon {
  background-position:0 -297px;
  height:31px;
}
#BuildersClubContainer div.personalserver_icon {
  background-position:0 -329px;
  height:30px;
}
#BuildersClubContainer div.upgrades_enabled {
  background-image:var(--bc_sprites_2011);
  background-repeat:no-repeat;
  display:inline-block;
  height:95px;
  width:128px;
}
#BuildersClubContainer div.upgrades_disabled {
  background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEdCAYAAAB62N8iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1RTNBOTI0NDJBMjA2ODExODcxRkZBNkREMTFGN0RDRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDQTA1RDE4QThFOEIxMUUwQTEyM0Q3NzVBOUY2NDJCMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDQTA1RDE4OThFOEIxMUUwQTEyM0Q3NzVBOUY2NDJCMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQzRThDQjI3MUUyNTY4MTE5OTRDRDI0RjkzNTUyN0UyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVFM0E5MjQ0MkEyMDY4MTE4NzFGRkE2REQxMUY3RENGIi8+IDwvcmRmOkRlc2NyaXB0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");
  background-repeat:no-repeat;
  display:inline-block;
  height:95px;
  width:128px;
}
#BuildersClubContainer div.bcmonthly {
  background-position:0 0;
}
#BuildersClubContainer div.bc6 {
  background-position:-128px 0;
}
#BuildersClubContainer div.bc12 {
  background-position:-256px 0;
}
#BuildersClubContainer div.bclife {
  background-position:-384px 0;
}
#BuildersClubContainer div.tbcmonthly {
  background-position:0 -95px;
}
#BuildersClubContainer div.tbc6 {
  background-position:-128px -95px;
}
#BuildersClubContainer div.tbc12 {
  background-position:-256px -95px;
}
#BuildersClubContainer div.tbclife {
  background-position:-384px -95px;
}
#BuildersClubContainer div.obcmonthly {
  background-position:0 -191px;
}
#BuildersClubContainer div.obc6 {
  background-position:-128px -191px;
}
#BuildersClubContainer div.obc12 {
  background-position:-256px -191px;
}
#BuildersClubContainer div.obclife {
  background-position:-384px -191px;
}
#BuildersClubContainer .bctotbcconversion {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/BuyBC/bc_lifetime_tbc_lifetime_discount.png);
  background-repeat:no-repeat;
  height:95px;
  width:128px;
}
#BuildersClubContainer .bctoobcconversion {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/BuyBC/bc_lifetime_obc_lifetime_discount.png);
  background-repeat:no-repeat;
  height:95px;
  width:128px;
}
#BuildersClubContainer .tbctoobcconversion {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/BuyBC/tbc_lifetime_obc_lifetime_discount.png);
  background-repeat:no-repeat;
  height:95px;
  width:128px;
}
#BuildersClubContainer upgrade_button {
  cursor:pointer;
}
.OBCSellSheet ul {
  list-style:armenian;
  width:500px;
}
.OBCSellSheet ul li {
  padding:10px;
  border-bottom:1px solid #abc;
  position:relative;
}
.OBCSellSheet ul li em {
  -moz-background-clip:border;
  -moz-background-inline-policy:continuous;
  -moz-background-origin:padding;
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/obctip.png) no-repeat scroll 0 0;
  display:none;
  font-style:normal;
  height:45px;
  left:-10px;
  padding:15px 0;
  position:absolute;
  text-align:center;
  top:-40px;
  width:300px;
  z-index:2;
  color:#FFF;
}
.hoverover {
  cursor:pointer;
}
.bold {
  font-weight:bold;
}
.clear {
  clear:both;
}
.alignCenter {
  text-align:center;
}
#GiftCardCrossLink {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Gifting/img-gifting160-1.jpg) no-repeat;
  width:160px;
  height:600px;
}
#GiftCardCrossLink:hover {
  background-position:bottom;
}
#BCGiftCardXLink {
  background:url("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QNvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MSA2NC4xNDA5NDksIDIwMTAvMTIvMDctMTA6NTc6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6QkJBOUU1MzBDNEY1RTAxMUJCQUJBQzgxMTBERUM4MEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTdGMUUwNTY4N0ZBMTFFMThGNjJGMTU0OTBFRTZDNTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTdGMUUwNTU4N0ZBMTFFMThGNjJGMTU0OTBFRTZDNTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQUJGNkRDNEVDODdFMTExQTc5REMwQzFBRDdFMUYxMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQkE5RTUzMEM0RjVFMDExQkJBQkFDODExMERFQzgwQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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") no-repeat;
  background-color:White;
  margin-bottom:10px;
}
#BCGiftCardXLink:hover {
  background-position:bottom;
}
div.FrontPageLoginBox {
  float:left;
  padding:0 10px;
  background:#e1e1e1;
  border:1px solid #bcbcbc;
  height:248px;
  width:160px;
  margin-right:10px;
  text-align:center;
}
div.FrontPageVideoIntro {
  display:inline;
  padding:0 5px;
}
a.ControlLoginButton {
  padding:6px 0!important;
  margin:0 auto;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/UI/btn-big_silver_tile.png") top left;
  display:block;
  width:88px;
  font-family:Arial;
  font-size:16px;
  font-weight:bold;
  color:#000;
  height:18px;
  border:1px solid #bcbcbc;
}
a.ControlLoginButton:hover {
  background-position:bottom left;
}
div.DGBContainerLong,
div.DGBContainerShort {
  height:auto;
  text-align:left;
}
div.TextInputLogin {
  margin:0;
  padding:0 0 0 2px;
}
.BannerAndFeaturedGamesBox {
  height:390px;
  padding:0;
}
div.TopPanel {
  min-height:252px;
  float:left;
  border-bottom:1px solid #ccc;
  padding:5px 0;
}
.SidePanel #RobloxNews {
  font-size:12px;
}
#RobloxNews a {
  margin-right:5px;
}
.FeaturedGameButton {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/buttons/btn-playnow_big2.png) no-repeat;
  height:214px;
  width:214px;
  height:214px;
  overflow:hidden;
}
.FeaturedGameButton:hover {
  background-position:0 -214px;
}
.GiftCards #GiftForm span#remainingCharacters {
  color:Black;
  font-size:10px;
}
div.FeaturedGameInfo {
  font-size:10px;
  white-space:nowrap;
  overflow:hidden;
  float:right;
  line-height:140%;
  width:155px;
}
a.BadAdButton {
  color:#808080;
  font-family:Arial,Helvetica,sans-serif;
}
a.BadAdButton:hover {
  border:0;
  text-decoration:underline;
}
div.VisitButtonsRight {
  text-align:left;
  float:right;
  width:40%;
}
div.VisitButtonsLeft {
  float:left;
  width:55%;
}
div.VisitButtonSoloPlay {
  display:block;
  width:auto;
}
#ItemContainer .SellCollectible .StandardBoxHeader,
#ItemContainer .SellCollectible .StandardBox {
  width:auto;
}
div.FeaturedGameImage {
  float:left;
}
.separateSignUpFromLoginWithBorder {
  margin-top:10px;
  border-top:1px solid #bdbdbd;
}
div.ParentsSpacing a {
  font-weight:bold;
  margin:0 10px;
}
div.SidePanel h2 {
  display:block;
  font-size:16px;
  font-weight:bold;
  color:black;
  text-transform:uppercase;
  margin-bottom:10px;
}
div.SidePanel {
  border-top:1px solid #CCC;
  font-family:Arial;
  padding-top:10px;
  padding-bottom:10px;
  padding-left:10px;
}
div.SidePanel p {
  color:#000;
  margin:0 0 8px;
}
div.SidePanel img {
  margin-right:10px;
}
div.FeaturedGameInfo .PlaceStatValue {
  margin:0 0 8px;
  font-size:12px;
}
div.FeaturedGameInfo .PlaceStatLabel {
  color:#464646;
  font-size:10px;
}
div.FeaturedGame {
  padding:10px 0;
}
span.placeName {
  font-size:16px;
  font-weight:bold;
  color:#000;
  text-transform:uppercase;
}
.FeaturedGameBox {
  border-bottom:1px solid #ccc;
  height:320px;
  font-family:Arial;
  padding-top:5px;
}
.FeaturedGameBox h2 {
  font-size:40px;
  font-weight:bold;
  color:#363636;
  letter-spacing:-2px;
  display:block;
}
.FeaturedGameAssetImage {
  float:left;
}
a.PlayThisFeaturedGame {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/UI/btn-play_this.png") top left;
  display:block;
  width:112px;
  height:34px;
  margin:0 0 15px;
}
a.PlayThisFeaturedGame:hover {
  background-position:bottom left;
}
a.SignupButtonImage {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/UI/btn-sign_up.png") top left;
  display:block;
  width:102px;
  height:34px;
  margin:0 auto;
}
a.SignupButtonImage:hover {
  background-position:bottom left;
}
a.RobloxFreeBuildingBanner {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/UI/img-free_building_banner.jpg") top left;
  display:block;
  height:90px;
  width:578px;
}
a.RobloxFreeBuildingBanner:hover {
  background-position:bottom left;
}
div.forceSpace {
  padding-top:62px;
}
div.forceSpaceUnderSubmenu {
  padding-bottom:13px;
}
.loginNewStyle {
  padding-top:63px;
  height:655px;
}
div.testingSitePanel {
  margin:0 auto 8px;
  width:870px;
  text-align:center;
  border:3px #FFE066 solid;
  padding:10px 5px;
  background:white;
}
div.mySubmenuFixed {
  position:fixed;
  top:68px;
  width:100%;
  z-index:800;
}
.BannerCenterContainer {
  width:970px;
  margin-left:auto;
  margin-right:auto;
  text-align:center;
}
div#Nav {
  position:fixed;
  display:block;
  top:38px;
  z-index:1000;
}
img#over13icon {
  float:left;
  padding-left:7px;
  padding-top:1px;
  position:relative;
  top:18px;
  height:11px;
  width:20px;
}
a.loginButton {
  margin-left:7px;
}
a.logoutButton {
  margin-left:-2px;
  padding-top:2px;
  position:static;
  top:auto;
}
a.btn-logo,
a.btn-logo:visited {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/btn-logo.png?v=2") top left;
  display:inline-block;
  width:123px;
  height:38px;
  float:left;
}
a.btn-logo:hover {
  background-position:bottom left;
}
a.btn-playnow,
a.btn-playnow:visited {
  background-position:top left;
  display:block;
  width:117px;
  height:34px;
  float:right;
  position:relative;
  top:2px;
}
a.btn-playnow:hover {
  background-position:bottom left;
}
#SmallHeaderContainer #Banner .LoggedOutAuthenticationButton {
  top:0;
  margin-top:0;
  left:0!important;
  width:60px;
  height:28px;
}
div#containerWrapper {
  width:970px;
  background:white;
  margin-left:auto;
  margin-right:auto;
}
a.ReturnHomeButton,
a.ReturnHomeButton:visited {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/ui/error/btn-return_home.png") top left;
  width:100px;
  height:23px;
  display:block;
  float:right;
}
a.GoToPreviousPageButton,
a.GoToPreviousPageButton:visited {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/ui/error/btn-go_to_previous.png") top left;
  width:144px;
  height:23px;
  display:block;
  float:left;
}
a.GoToPreviousPageButton:hover,
a.ReturnHomeButton:hover {
  background-position:bottom left;
}
div#ErrorPage {
  text-align:center;
  margin-bottom:20px;
}
div#ErrorPage pre {
  text-align:left;
  font:normal 8pt Courier;
}
div#ErrorPage h1 {
  font-size:40px;
  font-weight:bold;
  color:#363636;
  letter-spacing:-2px;
  margin-bottom:10px;
  display:block;
}
img.ErrorAlert {
  display:block;
  margin:25px auto 10px;
}
div#ErrorPage h3 {
  color:#363636;
  font-weight:bold;
  font-size:16px;
}
div#ErrorPage .divideTitleAndBackButtons {
  margin:20px auto;
  height:1px;
  width:55%;
  border-top:1px solid #ccc;
}
div#ErrorPage div.CenterNavigationButtonsForFloat {
  width:253px;
  margin:0 auto;
}
a.menuTextLink {
  padding:0 5px;
  border-left:1px solid black;
}
#MyAccountBalanceContainer {
  font-family:Verdana,Helvetica,Sans-Serif;
}
#MyAccountBalanceContainer h2 {
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  letter-spacing:.4em;
  line-height:1em;
  margin:10px 0 0 -2px;
  padding:0;
}
#MyAccountBalanceContainer h3 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  font-family:Verdana,Helvetica,Sans-Serif;
  font-size:1.7em;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:1em;
  margin:0;
  padding:5px;
  text-align:center;
}
#MyAccountBalanceContainer h4 {
  font-family:Verdana,Sans-Serif;
  font-size:13px;
  font-weight:bold;
  margin:5px 0;
  padding:5px 5px 5px 15px;
  color:#900;
}
#MyAccountBalanceContainer #AboutRobux {
  border-bottom:solid 1px #000;
  border-left:solid 1px #000;
  border-right:solid 1px #000;
  float:right;
  margin-top:20px;
  width:275px;
}
#MyAccountBalanceContainer #AboutRobux h3 {
  border-top:solid 1px #000;
}
#MyAccountBalanceContainer #AboutRobux p {
  margin:0;
  padding:10px 15px;
}
#MyAccountBalanceContainer #Earnings {
  border:solid 1px #000;
  margin-top:20px;
  padding-bottom:10px;
  width:600px;
}
#MyAccountBalanceContainer .Earnings_Period {
  margin-bottom:20px;
}
#MyAccountBalanceContainer .Earnings_LoginAward,
#MyAccountBalanceContainer .Earnings_PlaceTrafficAward,
#MyAccountBalanceContainer .Earnings_Ambassador {
  padding:0 0 0 50px;
  height:16px;
  background-color:#eee;
}
#MyAccountBalanceContainer .Earnings_SaleOfGoods,
#MyAccountBalanceContainer .Earnings_PeriodTotal,
#MyAccountBalanceContainer .Earnings_LoginAwardBC,
#MyAccountBalanceContainer .Earnings_Currency {
  padding:0 0 0 50px;
  height:16px;
}
#MyAccountBalanceContainer .Earnings_LoginAward .Label,
#MyAccountBalanceContainer .Earnings_LoginAwardBC .Label,
#MyAccountBalanceContainer .Earnings_PlaceTrafficAward .Label,
#MyAccountBalanceContainer .Earnings_SaleOfGoods .Label,
#MyAccountBalanceContainer .Earnings_Ambassador .Label,
#MyAccountBalanceContainer .Earnings_Currency .Label {
  float:left;
  width:380px;
}
#MyAccountBalanceContainer .Earnings_PeriodTotal .Label {
  float:left;
  padding-right:10px;
  text-align:right;
  width:370px;
}
#MyAccountBalanceContainer .Earnings_PeriodTotal .Field {
  color:Blue;
  font-weight:bold;
}
#MyAccountBalanceContainer .Field {
  float:right;
  width:75px;
}
#MyAccountBalanceContainer .Zebra {
  background-color:#eee;
}
body.adminStyle {
  background:#eaeaea;
}
body.pageStyle {
  background:white;
}
body.pageStyle .adminContent {
  background:ivory;
  border:1px solid #333;
  padding:1em;
}
div.adminContent {
  margin-top:35px;
}
.adminStyle * {
  font-size:12px;
  font-family:Verdana,Arial,Helvetica,sans-serif;
}
.adminStyle .TightRadio div {
  width:16em;
}
.adminStyle .TopFloat {
  padding:5px;
  width:100%;
  border-bottom-style:solid;
  border-bottom-width:thin;
}
.adminStyle fieldset {
  padding:1em;
}
.adminStyle legend {
  padding-bottom:.5em;
}
.adminStyle td,
th {
  padding:2px .5em 2px .5em;
}
.adminStyle .TreeView td {
  padding:0;
}
.adminStyle .Panel {
  padding:6px;
  border:solid 1px #000;
}
.adminStyle .GameGenres {
  font-size:14px;
}
.adminStyle .GameGenres,
.GameGenres input,
.GameGenres textarea {
  font-size:14px;
}
.adminStyle .GameGenres h1 {
  padding:5px;
  width:100%;
  clear:both;
}
.adminStyle .GameGenres h1 span {
  font-size:40px;
  font-weight:bold;
  font-family:Delicious,Verdana,Times New Roman,sans-serif;
}
.adminStyle .adminStyle .GameGenres ul {
  list-style:none;
  margin-bottom:10px;
  float:left;
}
.adminStyle .GameGenres ul li {
  float:left;
  margin:5px;
}
.adminStyle .GameGenres ul li a {
  padding:5px;
  border:1px outset #94A;
  cursor:pointer;
  text-decoration:none;
  color:#000;
}
.adminStyle .GameGenres ul li a:hover {
  background:#EEE;
  border-style:inset;
}
.adminStyle .GameGenresTable {
  clear:both;
  margin-top:10px;
}
.adminStyle .GameGenresTable table {
  border-collapse:collapse;
  border-spacing:0;
}
.adminStyle .GameGenresTable table td,
.GameGenresTable table th {
  border:1px solid #EEE;
  padding:5px;
}
.adminStyle .GameGenresTable table tr:first-child td,
.GameGenresTable table tr:first-child th {
  border-top:0;
}
.adminStyle .GameGenresTable table tr:last-child td {
  border-bottom:0;
}
.adminStyle .GameGenresTable table tr td:first-child,
.GameGenresTable table tr th:first-child {
  border-left:0;
}
.adminStyle .GameGenresTable table tr td:last-child,
.GameGenresTable table tr th:last-child {
  border-right:0;
}
div#BigImageOverlayDiv {
  padding:50px;
  position:fixed;
  top:30%;
  left:40%;
  z-index:2000;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Moderation/Checkerboardforimages.gif);
}
.adminStyle * {
  padding:0;
  margin:0;
}
.adminStyle ul {
  padding-left:1em;
  margin-left:0;
}
.adminStyle .tight {
  margin-top:-10px;
  margin-left:8px;
  padding-left:8px;
}
.adminStyle img {
  padding:0;
  margin:0;
  border:0;
}
.adminStyle table {
  padding:0;
  margin:0;
  border:0;
}
.adminStyle .spacer {
  clear:both;
  float:none;
  height:1px;
  margin:0;
  padding:0;
  overflow:hidden;
}
.adminStyle p {
  padding:.6em 0 .6em 0;
}
.adminStyle .lessair {
  margin:2px 0 4px 0;
  padding:0;
}
.adminStyle .air {
  line-height:1.6em;
}
.adminStyle .small {
  font-size:11px;
  line-height:12px;
}
.adminStyle .left {
  float:left;
}
.adminStyle .right {
  float:right;
}
.adminStyle html {
  padding:0;
  margin:0;
}
.adminStyle body {
  font-family:Verdana,Arial,Helvetica,sans-serif;
  font-size:10px;
  line-height:12px;
  color:#444;
}
.adminStyle a:link,
.adminStyle a:visited,
.adminStyle a:active {
  color:#1e52d5;
  text-decoration:none;
}
.adminStyle a:hover {
  text-decoration:underline;
}
.adminStyle #master_container {
  width:100%;
}
.adminStyle #container {
  width:960px;
  margin:0 auto 0 auto;
}
.adminStyle .header {
  margin:0 0 9px 0;
}
.adminStyle .logo {
  float:left;
  display:inline;
  width:244px;
  height:66px;
  margin:22px 0 0 4px;
}
.adminStyle .logo_spacer {
  width:244px;
  height:66px;
}
.adminStyle .ad_banner {
  float:right;
  display:inline;
  width:468px;
  height:60px;
  margin:20px 30px 0 0;
}
.adminStyle .login {
  float:right;
  display:inline;
  width:172px;
  padding:0 0 3px 0;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/bg_login_bottom.png) no-repeat bottom left;
}
.adminStyle .login_placeholder {
  float:right;
  display:inline;
  width:172px;
  height:50px;
}
.adminStyle .login_header {
  width:170px;
  height:18px;
  border-left:#2a2a2a 1px solid;
  border-right:#2a2a2a 1px solid;
  border-bottom:#639ddb 1px solid;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/bg_login_header.gif) repeat-x top left;
}
.adminStyle .login_header p {
  color:#fff;
  font-size:11px;
  font-weight:bold;
  padding:4px 0 0 9px;
}
.adminStyle .login_content {
  width:160px;
  padding:3px 0 0 10px;
  border-left:#2a2a2a 1px solid;
  border-right:#2a2a2a 1px solid;
  background:#fff;
}
.adminStyle .login_content p {
  line-height:14px;
  padding:3px 0 4px 0;
}
.adminStyle .login_input {
  width:80px;
  height:12px;
}
.adminStyle .nav_container {
  width:960px;
  height:28px;
  display:block;
  margin:0 0 2px 0;
  clear:both;
  float:none;
}
.adminStyle .nav {
  width:942px;
  height:28px;
  float:left;
  display:block;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/nav-bg.gif) repeat-x;
  line-height:26px;
  overflow:hidden;
}
.adminStyle .nav_left {
  width:9px;
  height:28px;
  float:left;
  display:block;
}
.adminStyle .nav_right {
  width:9px;
  height:28px;
  float:left;
  display:block;
}
.adminStyle .nav_button_container {
  margin:1px auto 1px auto;
}
.adminStyle .nav_button_div {
  width:2px;
  height:26px;
  float:left;
  display:block;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/nav-div.gif) no-repeat;
}
.adminStyle .nav a:link,
.adminStyle .nav a:visited,
.adminStyle .nav a:active {
  height:26px;
  display:block;
  float:left;
  color:#fff;
  font-size:12px;
  font-weight:bold;
  padding:0 20px 0 20px;
  text-decoration:none;
}
.adminStyle .nav a.news:link,
.adminStyle .nav a.news:visited,
.adminStyle .nav a.news:active {
  padding:0 5px 0 20px;
}
.adminStyle .nav a.news_feed:link,
.adminStyle .nav a.news_feed:visited,
.adminStyle .nav a.news_feed:active {
  padding:5px 20px 0 5px;
}
.adminStyle .nav a:hover {
  text-decoration:underline;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/nav-bg-hover.gif) repeat-x;
}
.adminStyle .nav a.nav_on:link,
.adminStyle .nav a.nav_on:visited,
.adminStyle .nav a.nav_on:active {
  text-decoration:none;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/nav-bg-on.gif) repeat-x;
}
.adminStyle .breadcrumb {
  font-weight:bold;
  color:#000;
  margin:8px 0 6px 7px;
  padding:0 0 0 9px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/arrow-breadcrumb.gif) no-repeat left;
}
.adminStyle .breadcrumb_placeholder {
  height:7px;
}
.adminStyle .homepage_flash {
  width:960px;
  height:266px;
  margin:0 0 10px 0;
}
.adminStyle .panel_1col {
  width:314px;
  display:block;
  margin:0 0 9px 0;
}
.adminStyle .panel_home_height {
  height:296px;
}
.adminStyle .panel_right_margin {
  margin-right:9px;
}
.adminStyle .panel_2col {
  width:637px;
  display:block;
  margin:0 0 10px 0;
}
.adminStyle .panel_3col {
  width:960px;
  display:block;
  margin:0 0 10px 0;
}
.adminStyle .panel_3col_with_ad {
  width:805px;
  display:block;
  margin:0 0 10px 0;
}
.adminStyle .panel_header {
  display:block;
  height:28px;
}
.adminStyle .rollover_header {
  display:block;
  height:10px;
}
.adminStyle .panel_header_left {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-left.png) no-repeat top left;
}
.adminStyle .panel_header_left2 {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-left2.png) no-repeat top left;
}
.adminStyle .panel_header_left_white {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-left-white.gif) no-repeat top left;
}
.adminStyle .rollover_header_left {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/rollover-corner-top-left.png) no-repeat top left;
}
.adminStyle .panel_header_right {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-right.png) no-repeat top right;
}
.adminStyle .panel_header_right2 {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-right2.png) no-repeat top right;
}
.adminStyle .panel_header_right_white {
  height:28px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-top-right-white.gif) no-repeat top right;
}
.adminStyle .rollover_header_right {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/rollover-corner-top-right.png) no-repeat top right;
}
.adminStyle .panel_header_content {
  display:block;
  width:auto;
  height:28px;
  margin:0 10px 0 10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-header-bg.png) repeat-x;
}
.adminStyle .panel_header_content2 {
  display:block;
  width:auto;
  height:28px;
  margin:0 10px 0 10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-header-bg2.png) repeat-x;
}
.adminStyle .panel_header_content_white {
  display:block;
  width:auto;
  height:28px;
  margin:0 10px 0 10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-header-bg-white.gif) repeat-x;
}
.adminStyle .rollover_header_content {
  display:block;
  width:auto;
  height:10px;
  margin:0 10px 0 10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-header-bg-white.gif) repeat-x;
}
.adminStyle .panel_header_content p {
  color:#fff;
  font-size:12px;
  font-weight:bold;
  height:20px;
  padding:8px 0 0 10px;
}
.adminStyle .panel_header_content2 p {
  color:#fff;
  font-size:12px;
  font-weight:bold;
  height:20px;
  padding:8px 0 0 10px;
}
.adminStyle .header_online_indicator {
  margin:6px 0 0 10px;
}
.adminStyle .header_online_indicator_text {
  color:#fff;
  font-size:12px;
  font-weight:bold;
  height:20px;
  padding:8px 0 0 5px;
}
.adminStyle .panel_header_rightside {
  float:right;
  padding:8px 10px 0 0;
}
.adminStyle .panel_header_rightside a:link,
.adminStyle .panel_header_rightside a:visited,
.adminStyle .panel_header_rightside a:active {
  color:#ff9;
  font-size:10px;
  font-weight:bold;
  text-decoration:none;
}
.adminStyle .panel_header_rightside a:hover {
  text-decoration:underline;
}
.adminStyle .panel_header_rightside img {
  padding:0 0 1px 7px;
  vertical-align:middle;
}
.adminStyle .panel_content_small {
  background:#fff;
  font-size:9px;
  border-left:#2a2a2a 2px solid;
  border-right:#2a2a2a 2px solid;
}
.adminStyle .panel_content_small2 {
  background:#000;
  color:#fff;
  font-size:9px;
  border-left:#2a2a2a 2px solid;
  border-right:#2a2a2a 2px solid;
}
.adminStyle .panel_content {
  background:#fff;
  border-left:#2a2a2a 2px solid;
  border-right:#2a2a2a 2px solid;
}
.adminStyle .panel_content2 {
  color:#fff;
  background:#000;
  border-left:#2a2a2a 2px solid;
  border-right:#2a2a2a 2px solid;
}
.adminStyle .panel_content_body {
  padding:15px 20px 0 20px;
}
.adminStyle .rollover_content_body {
  padding:0 20px 0 20px;
}
.adminStyle .panel_content_bottom_margin {
  padding-bottom:25px;
}
.adminStyle .panel_content_bottom_margin10 {
  padding-bottom:10px;
}
.adminStyle .panel_content_body p.top {
  padding:0 0 10px 0;
}
.adminStyle .panel_content_body li {
  margin-left:30px;
}
.adminStyle .panel_content_body_3col {
  padding:15px 60px 25px 60px;
}
.adminStyle .panel_content a:link,
.adminStyle .panel_content a:visited,
.adminStyle .panel_content a:active {
  color:#1e52d5;
  text-decoration:none;
}
.adminStyle .panel_content a:hover {
  text-decoration:underline;
}
.adminStyle .panel_footer {
  display:block;
}
.adminStyle .panel_footer_left {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-bottom-left.png) no-repeat left;
}
.adminStyle .panel_footer_left2 {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-bottom-left2.png) no-repeat left;
}
.adminStyle .panel_footer_right {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-bottom-right.png) no-repeat right;
}
.adminStyle .panel_footer_right2 {
  height:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/panel-corner-bottom-right2.png) no-repeat right;
}
.adminStyle .panel_footer_main {
  height:8px;
  margin:0 10px 0 10px;
  background:#fff;
  border-bottom:#2a2a2a 2px solid;
}
.adminStyle .panel_footer_main2 {
  height:8px;
  margin:0 10px 0 10px;
  background:#000;
  border-bottom:#2a2a2a 2px solid;
}
.adminStyle *html .panel_footer_main {
  margin:-4px 10px 0 10px;
}
.adminStyle *html .panel_footer_main2 {
  margin:-4px 10px 0 10px;
}
.adminStyle .games {
  width:118px;
  font-weight:bold;
}
.adminStyle .games img {
  width:118px;
  height:68px;
  margin:0 0 2px 0;
  border:1px solid #2a2a2a;
}
.adminStyle .games_right_margin {
  margin-right:30px;
}
.adminStyle .games2 {
  width:270px;
  margin:0 0 14px 0;
}
.adminStyle .games2 img {
  float:left;
  width:118px;
  height:68px;
  margin:0 8px 0 0;
  border:1px solid #2a2a2a;
}
.adminStyle .top_rule {
  border-top:#e1eaf3 1px solid;
  margin:6px 0 0 0;
  padding:5px 0 0 0;
}
.adminStyle .online_now {
  width:90px;
  float:left;
  text-align:center;
  margin-bottom:18px;
}
.adminStyle .online_now img {
  margin:0 auto 3px auto;
}
.adminStyle .online_indicator {
  padding:0 2px 0 0;
}
.adminStyle .online {
  padding:0 0 0 11px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/online_indicator_on.gif) no-repeat;
}
.adminStyle .offline {
  padding:0 0 0 11px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/online_indicator_off.gif) no-repeat;
}
.adminStyle .footer_container {
  height:140px;
  text-align:center;
  background:#287241 url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/bg_footer.jpg) no-repeat center top;
}
.adminStyle .footer {
  padding:10px 0 0 0;
  line-height:18px;
  text-align:center;
  color:#dedede;
}
.adminStyle .footer a:link,
.adminStyle .footer a:active,
.adminStyle .footer a:visited {
  color:#aef08e;
  text-decoration:none;
}
.adminStyle .footer a:hover {
  color:#fff;
}
.adminStyle h2 {
  font-weight:bold;
  font-size:12px;
  color:#000;
  padding-bottom:5px;
  margin-bottom:14px;
  border-bottom:1px solid #e1eaf3;
}
.adminStyle h2.highlight {
  font-weight:bold;
  font-size:12px;
  color:#1a773b;
  padding-bottom:5px;
  margin:30px 0 5px 0;
  border-bottom:1px solid #e1eaf3;
}
.adminStyle h3 {
  font-size:11px;
  font-weight:bold;
  color:#000;
  margin-top:30px;
}
.adminStyle h3.less_air {
  font-size:11px;
  font-weight:bold;
  color:#000;
  margin:0 0 4px 0;
  padding:0;
}
.adminStyle h4 {
  font-size:10px;
  font-weight:bold;
  color:#000;
  margin:15px 0 4px 0;
  padding:0 0 2px 0;
  border-bottom:1px solid #e1eaf3;
}
.adminStyle .button_small_gray {
  width:auto;
  height:17px;
}
.adminStyle .button_small_gray_left {
  float:left;
  width:9px;
  height:17px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-gray-left.gif) no-repeat;
}
.adminStyle .button_small_gray_right {
  float:left;
  width:9px;
  height:17px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-gray-right.gif) no-repeat;
}
.adminStyle .button_small_gray_content {
  display:block;
  float:left;
  color:#fff;
  text-align:center;
  height:15px;
  padding:2px 5px 0 5px;
  background:#2b2b2b;
}
.adminStyle .button_small_gray_content a:link,
.adminStyle .button_small_gray_content a:visited,
.adminStyle .button_small_gray_content a:active {
  color:#fff;
  font-weight:bold;
  text-decoration:none;
}
.adminStyle .button_small_gray_content a:hover {
  text-decoration:underline;
}
.adminStyle .panel_buttons {
  height:19px;
  vertical-align:bottom;
  padding:15px 20px 0 20px;
}
.adminStyle .buttons_prev_next {
  float:right;
}
.adminStyle .button_blue {
  width:auto;
  height:19px;
}
.adminStyle .button_blue_left {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-blue-left.gif) no-repeat;
}
.adminStyle .button_blue_right {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-blue-right.gif) no-repeat;
}
.adminStyle .button_blue_content {
  display:block;
  float:left;
  color:#fff;
  text-align:center;
  height:15px;
  padding:2px 5px 0 5px;
  background:#639ddb;
  border-top:#2463a6 1px solid;
  border-bottom:#2463a6 1px solid;
}
.adminStyle .button_blue_content a:link,
.adminStyle .button_blue_content a:visited,
.adminStyle .button_blue_content a:active {
  color:#fff;
  text-decoration:none;
}
.adminStyle .button_blue_content a:hover {
  text-decoration:underline;
}
.adminStyle .button_black {
  width:auto;
  height:19px;
}
.adminStyle .button_black_left {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-black-left.gif) no-repeat;
}
.adminStyle .button_black_right {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-black-right.gif) no-repeat;
}
.adminStyle .button_black_content {
  display:block;
  float:left;
  color:#fff;
  text-align:center;
  height:16px;
  padding:3px 5px 0 5px;
  background:#639ddb;
}
.adminStyle .button_black_content a:link,
.adminStyle .button_black_content a:visited,
.adminStyle .button_black_content a:active {
  color:#fff;
  text-decoration:none;
}
.adminStyle .button_black_content a:hover {
  text-decoration:underline;
}
.adminStyle .button_gray {
  width:auto;
  height:19px;
}
.adminStyle .button_gray_left {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-light-gray-left.gif) no-repeat;
}
.adminStyle .button_gray_right {
  float:left;
  width:9px;
  height:19px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-light-gray-right.gif) no-repeat;
}
.adminStyle .button_gray_content {
  display:block;
  float:left;
  color:#fff;
  text-align:center;
  height:15px;
  padding:2px 5px 0 5px;
  background:#a0a0a0;
  border-top:#444 1px solid;
  border-bottom:#444 1px solid;
}
.adminStyle .button_gray_content a:link,
.adminStyle .button_gray_content a:visited,
.adminStyle .button_gray_content a:active {
  color:#fff;
  text-decoration:none;
}
.adminStyle .button_gray_content a:hover {
  text-decoration:underline;
}
.adminStyle .button_glossy {
  width:auto;
  height:38px;
}
.adminStyle .button_glossy_left {
  float:left;
  width:16px;
  height:38px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-glossy-left.gif) no-repeat;
}
.adminStyle .button_glossy_right {
  float:left;
  width:20px;
  height:38px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-glossy-right.gif) no-repeat;
}
.adminStyle .button_glossy_content {
  display:block;
  float:left;
  color:#fff;
  text-align:center;
  height:29px;
  padding:9px 12px 0 12px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/btn-glossy-middle.gif) repeat-x;
}
.adminStyle .button_glossy_content a:link,
.adminStyle .button_glossy_content a:visited,
.adminStyle .button_glossy_content a:active {
  color:#fff;
  font-size:11px;
  font-weight:bold;
  text-decoration:none;
}
.adminStyle .button_glossy_content a:hover {
  text-decoration:underline;
}
.adminStyle .button_small_blue {
  float:left;
  display:inline;
  margin:0 0 0 4px;
  vertical-align:bottom;
}
.adminStyle .button_small_prev {
  float:left;
  display:inline;
  margin:0 4px 0 0;
}
.adminStyle .button_small_next {
  float:left;
  display:inline;
  margin:0 0 0 6px;
}
.adminStyle .fpo {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon-fpo.gif) no-repeat;
}
.adminStyle .item_hats {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_hats.gif) no-repeat;
}
.adminStyle .item_backdrops {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_backdrops.gif) no-repeat;
}
.adminStyle .item_buidlings {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_buildings.gif) no-repeat;
}
.adminStyle .item_shirts {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_shirts.gif) no-repeat;
}
.adminStyle .item_furniture {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_furniture.gif) no-repeat;
}
.adminStyle .item_all {
  clear:both;
  float:left;
  display:inline;
  height:17px;
  margin:1px 0 0 0;
  padding:0 0 0 20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon_all.gif) no-repeat;
}
.adminStyle .left_col {
  width:195px;
  display:block;
  padding:0 30px 0 0;
}
.adminStyle .left_col_nav {
  padding:0 0 0 12px;
}
.adminStyle .left_col_selected {
  height:17px;
  font-weight:bold;
  color:#fff;
  margin:0 0 0 -12px;
  padding:0 0 0 12px;
  background:#a0a0a0 url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/arrow-breadcrumb.gif) no-repeat left;
}
.adminStyle .double_wide_col {
  width:680px;
  display:block;
}
.adminStyle .parents_main {
  width:200px;
  margin:0 25px 40px 0;
}
.adminStyle .parents_main img {
  margin:0 auto 10px auto;
}
.adminStyle .faq_question_width {
  width:420px;
  display:block;
}
.adminStyle .wide_col {
  width:536px;
}
.adminStyle .sort_by {
  width:260px;
  padding:10px 0 0 0;
}
.adminStyle .games_big {
  float:left;
  font-size:9px;
  width:162px;
  margin:12px 0 16px 0;
}
.adminStyle .games_big img {
  width:160px;
  height:100px;
  margin:0 0 2px 0;
  border:1px solid #2a2a2a;
}
.adminStyle .games_big_right_margin {
  margin-right:25px;
}
.adminStyle .games_big a:link,
.adminStyle .games_big a:visited,
.adminStyle .games_big a:active {
  color:#1e52d5;
  text-decoration:none;
}
.adminStyle .games_big a:hover {
  text-decoration:underline;
}
.adminStyle .mailbox_height {
  min-height:562px;
}
.adminStyle .mailbox_header {
  font-weight:bold;
  color:#000;
  padding:4px 0 4px 0;
  margin-bottom:10px;
  background:#ccc;
  border-bottom:1px solid #000;
}
.adminStyle .mailbox {
  border-top:#e1eaf3 1px solid;
  padding:4px 0 4px 0;
}
.adminStyle .mailbox_checkbox {
  float:left;
  width:26px;
  padding:0 0 0 10px;
}
.adminStyle .mailbox_subject {
  float:left;
  width:258px;
  font-weight:bold;
}
.adminStyle .mailbox_from {
  float:left;
  width:265px;
}
.adminStyle .mailbox_date {
  float:left;
}
.adminStyle .mailbox_buttons {
  float:right;
  margin:14px 0 0 0;
}
.adminStyle .mailbox_button_margin {
  margin:0 8px 0 0;
}
.adminStyle .builders_club_icon {
  width:40px;
  padding:0 0 14px 0;
}
.adminStyle .builders_club_reasons {
  font-weight:bold;
  color:#000;
  padding:0 20px 14px 0;
}
.adminStyle .shaded_box {
  background:#e1eaf3;
  padding:10px 20px 20px 20px;
  margin:30px 0 30px 0;
}
.adminStyle .builders_club_form {
  font-weight:bold;
  color:#000;
  padding:0 10px 2px 0;
}
.adminStyle .builders_club_form_input {
  padding:0 20px 0 0;
}
.adminStyle .ca_form {
  width:76px;
  font-size:9px;
  font-weight:bold;
  color:#000;
  text-align:right;
  padding:0 4px 10px 0;
}
.adminStyle .ca_textarea {
  width:185px;
  height:100px;
}
.adminStyle .avatar {
  width:110px;
  float:left;
  margin:0 0 30px 0;
}
.adminStyle .avatar_margin {
  margin:0 10px 0 0;
}
.adminStyle .avatar_image_box {
  width:108px;
  height:108px;
  margin:0 0 3px 0;
  border:1px solid #a0a0a0;
}
.adminStyle .x_icon {
  width:9px;
  height:9px;
  position:relative;
  top:1px;
  left:98px;
}
.adminStyle .avatar_height {
  min-height:614px;
}
.adminStyle .my_form {
  width:77px;
  font-size:9px;
  text-align:right;
  padding:0 4px 10px 0;
}
.adminStyle .my_textarea {
  width:190px;
  height:100px;
}
.adminStyle .places_main_left {
  width:418px;
  padding:0 20px 20px 0;
}
.adminStyle .places_main_image {
  width:418px;
  height:228px;
  border:1px solid #fff;
}
.adminStyle .places_main_right {
  width:154px;
}
.adminStyle .places {
  width:74px;
  height:46px;
  margin:2px 4px 0 0;
  border:1px solid #fff;
  float:left;
}
.adminStyle .avatar_left {
  width:122px;
  float:left;
}
.adminStyle .badges {
  width:67px;
  float:left;
  text-align:center;
  margin-bottom:10px;
  display:block;
}
.adminStyle .badges img {
  margin:0 auto 3px auto;
}
.adminStyle .myroblox_height {
  min-height:978px;
}
.adminStyle .four_col {
  width:122px;
  float:left;
  padding:0 0 10px 0;
  margin:0 0 30px 0;
}
.adminStyle .four_col_margin {
  margin:0 15px 0 0;
}
.adminStyle .four_col_image_box {
  width:120px;
  height:120px;
  margin:0 0 3px 0;
  border:1px solid #a0a0a0;
  text-align:center;
}
.adminStyle .people_height {
  height:778px;
}
.adminStyle .comments_av {
  width:64px;
  float:left;
  margin:0 10px 0 0;
}
.adminStyle .comments_text {
  width:400px;
  float:left;
  margin:0 20px 0 0;
}
.adminStyle .comments_abuse {
  width:45px;
  float:right;
  padding:0 0 0 12px;
  margin:5px 0 0 0;
  text-align:right;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon-abuse.gif) no-repeat;
}
.adminStyle .related_items {
  clear:both;
}
.adminStyle .related_items_margin {
  clear:both;
}
.adminStyle .related_items_height {
  height:397px;
}
.adminStyle .one_col_image_box {
  float:left;
  width:78px;
  height:78px;
  margin:0 10px 15px 0;
  border:1px solid #a0a0a0;
}
.adminStyle .one_col_image_box_last {
  float:left;
  width:78px;
  height:78px;
  margin:0 10px 0 0;
  border:1px solid #a0a0a0;
}
.adminStyle .shop_detail_main_image {
  float:left;
  width:248px;
  height:248px;
  margin:0 20px 0 0;
  border:1px solid #a0a0a0;
}
.adminStyle .shop_detail_main_text {
  width:315px;
  float:left;
}
.adminStyle .games_in_progress {
  height:19px;
  margin:4px 0 0 0;
  padding:4px 0 0 0;
  border-top:1px solid #444;
}
.adminStyle .in_progress_left {
  float:left;
  padding:4px 0 0 0;
}
.adminStyle .in_progress_left a:link,
.adminStyle .in_progress_left a:visited,
.adminStyle .in_progress_left a:active {
  color:#6cf;
  text-decoration:none;
}
.adminStyle .in_progress_left a:hover {
  text-decoration:underline;
}
.adminStyle .ua_fieldset_col1,
.adminStyle .ua_fieldset_col2 {
  margin-top:5px;
  width:580px;
}
.adminStyle .ua_fieldset_col2 {
  width:360px;
}
.adminStyle .ua_component_col1,
.adminStyle .ua_component_col2_div,
.adminStyle .ua_component_col2_table {
  background:lightsteelblue;
  display:block;
  padding:5px;
  width:100%;
}
.adminStyle .ua_component_col2_div {
  width:327px;
}
.adminStyle .UserNotesContainer {
  max-height:300px;
  overflow:auto;
  margin-top:5px;
}
.adminStyle .tabs {
  height:25px;
  margin:0 0 15px 0;
  border-bottom:1px solid #444;
}
.adminStyle .tabs p {
  padding:6px 14px 0 14px;
  display:block;
  float:left;
  font-weight:bold;
}
.adminStyle .tab_on {
  float:left;
  width:auto;
  height:25px;
  color:#fff;
  text-align:center;
  background:#444;
}
.adminStyle .tab_on .tab_left {
  float:left;
  width:6px;
  height:25px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/tab-left.gif) no-repeat;
}
.adminStyle .tab_on .tab_right {
  float:left;
  width:6px;
  height:25px;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/tab-right.gif) no-repeat;
}
.adminStyle .tab_off {
  float:left;
  height:25px;
  width:auto;
  text-align:center;
}
.adminStyle .tab_off p {
  padding:6px 21px 0 21px;
}
.adminStyle .margin_top15 {
  margin-top:15px;
}
.adminStyle .margin_top25 {
  margin-top:25px;
}
.adminStyle .margin_right15 {
  margin-right:15px;
}
.adminStyle .light {
  color:#afafaf;
}
.adminStyle .players_online {
  color:#1a773b;
  font-weight:bold;
}
.adminStyle .selected {
  font-weight:bold;
}
.adminStyle .search_box {
  width:160px;
  height:18px;
  margin:0 0 4px 0;
}
.adminStyle .input_short {
  width:120px;
  height:18px;
  margin:0 0 4px 0;
}
.adminStyle .input_shorter {
  width:60px;
  height:16px;
  margin:0 0 4px 5px;
}
.adminStyle .input_long {
  width:200px;
  height:18px;
  margin:0 0 4px 0;
}
.adminStyle .text_area {
  width:200px;
  height:100px;
  margin:0 0 4px 0;
}
.adminStyle .arrow_down {
  display:inline;
  margin:0 0 0 5px;
}
.adminStyle .dark {
  color:#000;
}
.adminStyle .highlight {
  color:#1a773b;
}
.adminStyle .highlight2 {
  color:#c60;
}
.adminStyle .icon_public {
  padding:0 0 5px 16px;
  margin:0 0 3px 0;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon-public.gif) no-repeat;
}
.adminStyle .icon_robux {
  padding:0 0 0 20px;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon-robux.gif) no-repeat;
}
.adminStyle .icon_tix {
  padding:0 0 4px 20px;
  font-weight:bold;
  background:url(/web/20120611211431im_/http://www.roblox.com/CSS/Base/graphics/icon-tix.gif) no-repeat;
}
.adminStyle .ad2 {
  margin:-10px auto 0 auto;
}
.adminStyle .rollovers {
  width:220px;
}
table.stats {
  text-align:center;
  font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;
  font-weight:normal;
  font-size:11px;
  color:#fff;
  width:280px;
  background-color:#666;
  border:0;
  border-collapse:collapse;
  border-spacing:0;
}
table.stats td {
  background-color:#CCC;
  color:#000;
  padding:4px;
  text-align:left;
  border:1px #fff solid;
}
table.stats td.hed {
  background-color:#666;
  color:#fff;
  padding:4px;
  text-align:left;
  border-bottom:2px #fff solid;
  font-size:12px;
  font-weight:bold;
}
#VerifyImageHolder {
  float:left;
  margin-right:4px;
  margin-top:8px;
}
#VerificationText-Top {
  font-family:Arial;
  font-size:40px;
  font-weight:bold;
  color:#363636;
}
#VerificationText-Bottom {
  font-family:Arial;
  font-size:14px;
  font-weight:normal;
  color:#000;
}
#RightColumn {
  width:300px;
  float:right;
}
#VerificationResult {
  text-align:center;
  width:50%;
  margin:0 auto;
}
#VerifyUserInfo {
  color:#000;
  font-family:Arial;
  font-size:15px;
  font-weight:bold;
  margin:46px 0 18px;
}
#ChildPrivacyLevel {
  margin-bottom:18px;
}
#ChildPrivacyLevelText {
  color:#000;
  font-family:Arial;
  font-size:15px;
  font-weight:bold;
}
.GreenSubmitButton {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/btn-submit.png");
  height:50px;
  width:134px;
  border:0;
  padding:0;
  cursor:pointer;
}
.GreenSubmitButton:hover {
  background-position:0 -50px;
  cursor:pointer;
}
#ExtraText {
  margin-top:16px;
  font:11px Arial;
  color:#666;
}
#RobloxForParents {
  text-align:left;
  border-left:1px solid #CCC;
}
#GoPremium {
  text-align:left;
  border-left:1px solid #CCC;
  border-bottom:1px solid #CCC;
}
#RobloxGiftCards {
  text-align:left;
  border-left:1px solid #CCC;
}
#BLueLink {
  margin-top:16px;
  padding-bottom:17px;
  margin-left:10px;
}
#SideBarHeader {
  font:Bold 16px Arial;
  color:Black;
  margin-bottom:19px;
  padding-top:21px;
  margin-left:10px;
}
#SideText {
  font-family:Arial;
  font-size:12px;
  font-weight:normal;
  color:Black;
  margin-left:10px;
}
#AssetContainer {
  margin:0 auto;
  width:620px;
}
#AssetContainer h2 {
  color:#333;
  font-size:x-large;
  margin-bottom:5px;
}
#AssetContainer #Asset {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
}
#BadgesContainer {
  border:solid 1px #000;
}
#BadgesContainer .Legend .BadgesList {
  color:#666;
  float:left;
  list-style:none;
  margin:0;
  padding:0;
}
#BadgesContainer .Legend .BadgesList li {
  background-color:#fff;
  background-position:0 5px;
  background-repeat:no-repeat;
  margin:10px 0 20px 0;
  padding:0 0 7px 80px;
  border:solid 1px #000;
}
#CommunityBadges .Legend,
#FriendshipBadges .Legend,
#CombatBadges .Legend,
#VisitsBadges .Legend {
  float:left;
  padding:5px 15px 5px 5px;
  width:500px;
}
#StatisticsRankingsPane_Friendship,
#StatisticsRankingsPane_Combat,
#StatisticsRankingsPane_Visits,
#FeaturedBadge_Community {
  float:right;
  margin:15px;
  width:300px;
}
#FeaturedBadge_Community {
  border:solid 1px #000;
  margin-top:20px;
  width:325px;
  background-color:White;
}
#TurboBuildersClubBadge_Community {
  border:solid 1px #000;
  margin:15px 15px 15px 15px;
  background-color:White;
  float:left;
}
#OutrageousBuildersClubBadge_Community {
  border:solid 1px #000;
  margin:15px 15px 15px 15px;
  background-color:White;
  float:left;
}
#FeaturedBadge_Community h4,
#OutrageousBuildersClubBadge_Community h4 {
  background-color:#6e99c9;
  border-bottom:solid 1px #000;
  color:#fff;
  font-size:1.4em;
  font-weight:bold;
  letter-spacing:.2em;
  margin:0;
  padding:3px;
  text-align:center;
}
#OutrageousBuildersClubBadge_Community h4 {
  background-color:#000;
  color:#FFF;
  border-bottom:solid 1px #000;
}
#OutrageousBuildersClubBadge_Community h4 .OutrageousSpan {
  color:White;
}
.FeaturedOBCContent .FeaturedOBCDescription {
  color:#222;
  margin:10px 10px 10px 10px;
  font-size:14px;
}
.FeaturedOBCIcon {
  margin:10px 10px 10px 10px;
  float:left;
  vertical-align:text-top;
  width:150px;
}
#OutrageousBuildersClubBadge_Community {
  margin:10px 10px 10px;
}
#FeaturedBadge_Community h4,
#TurboBuildersClubBadge_Community h4 {
  background-color:#6e99c9;
  border-bottom:solid 1px #000;
  color:#fff;
  font-size:1.4em;
  font-weight:bold;
  letter-spacing:.2em;
  margin:0;
  padding:3px;
  text-align:center;
}
#TurboBuildersClubBadge_Community h4 {
  background-color:#B94542;
  color:#6e99FF;
  border-bottom:solid 1px #000;
}
#TurboBuildersClubBadge_Community h4 .TurboSpan {
  color:White;
}
.BadgeHint {
  border:dashed 1px #000;
  padding:5px 5px 5px 5px;
  background-color:#E8EDFF;
}
.FeaturedBadgeContent {
  margin:0;
  padding:0 15px 10px 15px;
}
.FeaturedBadgeContent p {
  color:#222;
  font-family:Verdana,Sans-Serif;
  margin-top:10px;
}
.FeaturedBadgeIcon {
  float:left;
  margin:auto 10px auto 10px;
  vertical-align:text-top;
  width:125px;
}
.FeaturedTBCContent .FeaturedTBCDescription {
  color:#222;
  font-size:14px;
  margin:10px 10px 10px 10px;
}
.FeaturedTBCIcon {
  margin:10px 10px 10px 10px;
  float:left;
  vertical-align:text-top;
  width:150px;
}
#TurboBuildersClubBadge_Community {
  margin:10px 10px 10px;
}
#StatisticsRankingsPane_Community {
  border:none;
}
#BadgesContainer .Legend h4 {
  background-color:#fff;
  font-size:1.4em;
  font-weight:bold;
  margin:5px 0 5px 0;
}
#BadgesContainer #CommunityBadges .Legend #Administrator {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Administrator-75x75.png?v=2);
}
#BadgesContainer #CommunityBadges .Legend #ForumModerator {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/ForumModerator-75x75.png?v=2);
}
#BadgesContainer #CommunityBadges .Legend #ImageModerator {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/ImageModerator-75x75.png?v=2);
}
#BadgesContainer #FriendshipBadges .Legend #Friendship {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Friendship-75x75.png?v=2);
}
#BadgesContainer #FriendshipBadges .Legend #Inviter {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Inviter-75x75.png?v=2);
}
#BadgesContainer #CombatBadges .Legend #CombatInitiation {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/CombatInitiation-75x75.png?v=2);
}
#BadgesContainer #CombatBadges .Legend #Warrior {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Warrior-75x75.png?v=2);
}
#BadgesContainer #CombatBadges .Legend #Bloxxer {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Bloxxer-75x75.png?v=2);
}
#BadgesContainer #VisitsBadges .Legend #Homestead {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Homestead-70x75.png?v=2);
}
#BadgesContainer #VisitsBadges .Legend #Bricksmith {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Badges/Bricksmith-54x75.png?v=2);
}
#BadgesContainer .AccordionHeader,
#BadgesContainer .TopAccordionHeader,
#BadgesContainer .BottomAccordionHeader {
  background-color:#ccc;
  cursor:pointer;
  font-size:1.4em;
  margin:0 0 1px 0;
  padding:5px;
  text-align:center;
}
#BadgesContainer .AccordionHeader,
#BadgesContainer .BottomAccordionHeader {
  border-bottom:solid 1px #000;
  border-top:solid 1px #000;
}
#BadgesContainer .TopAccordionHeader {
  border-bottom:solid 1px #000;
  border-top:none;
}
#BadgesContainer .AccordionHeader:hover,
#BadgesContainer .TopAccordionHeader:hover,
#BadgesContainer .BottomAccordionHeader:hover {
  background-color:#6e99c9;
  color:#fff;
}
.StatisticsRankings {
  background-color:#eee;
}
.StatisticsRankings h4 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-size:1.2em;
  margin:0;
  text-align:center;
}
.StatisticsRankingsHeader_Rank,
.StatisticsRankingsHeader_Item,
.StatisticsRankingsHeader_Score {
  border:solid 1px #000;
  float:left;
  font-weight:bold;
  padding:2px 0 2px 0;
  text-align:center;
}
.StatisticsRankingsHeader_Rank {
  margin-right:1px;
  width:45px;
}
.StatisticsRankingsHeader_Item {
  margin-right:1px;
  width:150px;
}
.StatisticsRankingsHeader_Score {
  width:95px;
}
.StatisticsRanking,
.StatisticsRanking_AlternatingRow,
.StatisticsRanking_UserCentric,
.StatisticsRanking_UserCentric_AlternatingRow {
  font:normal .9em/normal Verdana,sans-serif;
}
.StatisticsRanking_UserCentric a,
.StatisticsRanking_UserCentric a:link,
.StatisticsRanking_UserCentric a:visited,
.StatisticsRanking_UserCentric a:active,
.StatisticsRanking_UserCentric_AlternatingRow a,
.StatisticsRanking_UserCentric_AlternatingRow a:link,
.StatisticsRanking_UserCentric_AlternatingRow a:visited,
.StatisticsRanking_UserCentric_AlternatingRow a:active {
  color:#fff;
}
.StatisticsRanking .StatisticsRanking_Rank,
.StatisticsRanking .StatisticsRanking_Item,
.StatisticsRanking .StatisticsRanking_Score,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Rank,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Item,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Score {
  border:solid 1px #000;
  float:left;
  padding:2px 0 2px 0;
  text-align:center;
}
.StatisticsRanking .StatisticsRanking_Rank,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Rank {
  margin-right:1px;
  width:45px;
}
.StatisticsRanking .StatisticsRanking_Item,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Item {
  margin-right:1px;
  width:150px;
}
.StatisticsRanking .StatisticsRanking_Score,
.StatisticsRanking_AlternatingRow .StatisticsRanking_Score {
  width:95px;
}
.StatisticsRanking_UserCentric .StatisticsRanking_Rank,
.StatisticsRanking_UserCentric .StatisticsRanking_Item,
.StatisticsRanking_UserCentric .StatisticsRanking_Score,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Rank,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Item,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Score {
  background-color:#6e99c9;
  border:solid 1px #000;
  color:#fff;
  float:left;
  font-weight:bold;
  padding:2px 0 2px 0;
  text-align:center;
}
.StatisticsRanking_UserCentric .StatisticsRanking_Rank,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Rank {
  margin-right:1px;
  width:45px;
}
.StatisticsRanking_UserCentric .StatisticsRanking_Item,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Item {
  margin-right:1px;
  width:150px;
}
.StatisticsRanking_UserCentric .StatisticsRanking_Score,
.StatisticsRanking_UserCentric_AlternatingRow .StatisticsRanking_Score {
  width:95px;
}
.StatisticsRankingsFooter {
  border-top:solid 1px #000;
  padding:2px 1px 2px 1px;
}
.RankingsPeriodSelector {
  font-family:Verdana,Sans-Serif;
  font-size:xx-small;
  width:100%;
}
.TileBadges {
  float:left;
  margin:10px 10px;
  text-align:center;
}
.CarouselPager {
  text-align:center;
}
.CarouselPager .arrow-up,
.CarouselPager .arrow-down {
  height:13px;
  width:36px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/btn-arrowsprite-up_down.png');
  margin:5px 0;
  display:inline-block;
}
.CarouselPager .arrow-up {
  background-position:left top;
}
.CarouselPager .arrow-down {
  background-position:right top;
}
.CarouselPager .arrow-up:hover {
  background-position:left -13px;
}
.CarouselPager .arrow-down:hover {
  background-position:right -13px;
}
.CarouselPager .arrow-up.disabled {
  background-position:left bottom;
}
.CarouselPager .arrow-down.disabled {
  background-position:right bottom;
}
#CatalogContainer {
  font-family:Verdana,Sans-Serif;
  min-width:0;
  position:relative;
}
#CatalogContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:24px;
  padding:0;
  color:#555;
  font-size:14px;
  margin-left:10px;
}
#BrowseMode ul li h3 a {
  font-weight:normal;
  font-size:14px;
}
#CatalogContainer ul {
  font-family:Verdana,Sans-Serif;
  list-style:none;
  margin:0 0 20px 0;
  padding-left:0;
}
#CatalogContainer ul li {
  margin:5px 0 5px 10px;
  font-family:Arial,Helvetica,sans-serif;
  padding-left:20px;
  font-size:14px;
}
#CatalogContainer .Selected {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/gamesPage_filterArrow.png') no-repeat scroll 0 1px transparent;
}
#CatalogContainer .DisplayFilters {
  width:185px;
  background-color:White;
  border:solid 2px #6e99c9;
}
#CatalogContainer .Assets {
  float:left;
  min-width:0;
  overflow:hidden;
  padding-bottom:10px;
  padding-left:0;
  padding-right:0;
  position:relative;
  width:680px;
}
#CatalogContainer .SearchBar {
  background-color:#eee;
  border:solid 1px #bbb;
  height:30px;
  margin:-5px 0 5px 0;
  padding:0;
  text-align:center;
}
#CatalogContainer .SearchBar .SearchBox,
#CatalogContainer .SearchBar .SearchButton {
  height:30px;
  margin:0;
  padding:0;
}
#CatalogContainer .SearchBar .TextBox {
  border:solid 1px #000;
  height:19px;
  margin:2px 0 0 0;
  padding:2px 3px 0 3px;
  width:250px;
}
#CatalogContainer .SearchLinks {
  z-index:9;
  display:inline;
}
#CatalogContainer .SearchLinks a span {
  display:none;
}
#CatalogContainer .SearchLinks a:hover {
  text-decoration:none;
  border:none;
}
#CatalogContainer .SearchLinks a:hover span {
  display:block;
  position:absolute;
  top:20px;
  left:15%;
  width:60%;
  padding:5px;
  margin:5px;
  z-index:10;
  color:white;
  background-color:#6e99c9;
  border-width:1px;
  border-color:Gray;
  border-style:ridge;
  text-decoration:none;
  line-height:1.4em;
  font:11px Verdana,sans-serif;
  text-align:center;
}
#CatalogContainer .SearchError {
  clear:both;
  margin:2px;
  float:none;
  padding:2px;
  text-align:center;
  color:Red;
}
#CatalogContainer .Assets .HeaderPager,
#CatalogContainer .Assets .FooterPager {
  padding:2px 0;
  text-align:right;
}
#CatalogContainer .Assets .HeaderPager {
  margin-bottom:10px;
}
#CatalogContainer .Assets .HeaderPager .Label,
#CatalogContainer .Assets .FooterPager .Label {
  font-size:1em;
  vertical-align:middle;
}
#CatalogContainer .Asset {
  margin:-1px 0 15px -1px;
  vertical-align:top;
  width:122px;
}
#CatalogContainer .Asset .AssetThumbnail {
  border:solid 1px #EEE;
  height:110px;
  text-align:center;
  width:110px;
  background-color:#FFF;
}
#CatalogContainer .Asset .AssetDetails {
  font-family:Verdana,Sans-Serif;
  overflow:hidden;
  padding:2px 0 6px 0;
  width:110px;
}
#CatalogContainer .AssetName a {
  font-size:.9em;
  font-weight:bold;
  line-height:1.5em;
  vertical-align:top;
}
.AssetsBullet {
  padding-right:3px;
}
#CatalogContainer .Label,
#CatalogContainer .Detail,
#CatalogContainer .DetailHighlighted,
#CatalogContainer .PriceInRobux,
#CatalogContainer .PriceInTickets {
  font-size:.8em;
}
#CatalogContainer .PriceInRobux {
  color:Green;
  font-weight:bold;
}
#CatalogContainer .PriceInTickets {
  color:#fbb117;
  font-weight:bold;
}
#CatalogContainer .AssetsDisplaySet {
  float:left;
  font-family:Comic Sans MS,Arial,Sans-Serif;
  font-size:1.5em;
}
.Assets .StandardBoxHeader {
  width:660px;
}
.Assets .StandardBox {
  width:660px;
}
.CustomizeCharacterContainer {
  font-family:Verdana,Sans-Serif;
  margin:0;
}
.CustomizeCharacterContainer h4 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-family:Comic Sans MS,Verdana,Sans-Serif;
  margin:0;
  text-align:center;
}
.CustomizeCharacterContainer .NoResults {
  padding:15px;
  text-align:center;
}
.CustomizeCharacterContainer .TileGroup {
  clear:left;
  text-align:center;
}
.CustomizeCharacterContainer .Asset {
  float:left;
  margin:5px 7px 5px 0;
  text-align:left;
  vertical-align:top;
  width:112px;
}
.CustomizeCharacterContainer .Asset .AssetThumbnail {
  height:110px;
  position:relative;
  text-align:center;
  width:110px;
}
.CustomizeCharacterContainer .Asset .AssetDetails {
  overflow:hidden;
  padding:2px 0 6px 0;
  text-align:left;
  width:110px;
}
.CustomizeCharacterContainer .AssetName a {
  font-size:.9em;
  font-weight:bold;
  line-height:1.5em;
  vertical-align:top;
}
.CustomizeCharacterContainer .Label,
.CustomizeCharacterContainer .Detail,
.CustomizeCharacterContainer .DetailHighlighted {
  font-size:.8em;
}
.CustomizeCharacterContainer .FooterPager {
  border-top:solid 1px #000;
  clear:left;
  margin:10px 0 0 0;
  padding:3px 0;
  text-align:center;
}
.AttireChooser {
  border:solid 1px #000;
  float:left;
  margin:0;
  min-width:0;
  padding:0;
  position:relative;
  text-align:left;
  width:530px;
}
.Accoutrements {
  border:solid 1px #000;
  clear:left;
  margin-top:10px;
  min-width:0;
  padding:0;
  position:relative;
  text-align:left;
  width:530px;
}
.AttireChooser .AttireCategory {
  border-bottom:solid 1px #000;
  margin:0 0 10px 0;
  padding:3px 0;
  text-align:center;
}
.AttireChooser .AttireOptions {
  margin:5px;
}
.AttireCategory .AttireCategorySelector_Selected {
  font-weight:bold;
}
.AttireChooser .HeaderPager,
.AttireChooser .HeaderPager {
  margin-bottom:10px;
}
.AttireChooser .HeaderPager .Label,
.AttireChooser .FooterPager .Label {
  font-size:1em;
  vertical-align:middle;
}
.CharacterViewer {
  border:solid 1px #000;
  float:right;
  width:354px;
}
.CharacterViewer .ReDrawAvatar {
  font-size:1em;
  vertical-align:bottom;
  text-align:center;
}
.Mannequin {
  clear:right;
  margin-top:10px;
  text-align:center;
  width:354px;
}
.Mannequin .ColorChooserFrame {
  margin:0 auto;
}
.TeeShirtBuilder {
  border:solid 1px #000;
  clear:both;
  margin-top:10px;
}
.CharSelectCombined {
  width:836px;
  padding:25px;
  display:none;
  background-color:#DEF;
}
.CharSelectCombined .closeBtnCircle_35h {
  cursor:pointer;
  margin-left:375px;
  position:absolute;
  top:-10px;
  right:-10px;
}
.CharSelectCombined .ChooseCharText {
  height:28px;
  font-size:23px;
  font-family:Arial,Sans-Serif;
  font-weight:bold;
  padding-bottom:10px;
  width:418px;
  clear:none;
  float:left;
}
.CharSelectCombined .AlreadyHaveText {
  height:20px;
  padding-top:8px;
  font-family:Arial,Sans-Serif;
  font-size:15px;
  vertical-align:baseline;
  font-weight:bold;
  padding-bottom:10px;
  width:418px;
  clear:right;
  text-align:right;
  float:right;
}
.CharSelectCombined .PlayAsButton {
  width:380px;
  height:168px;
  background-position:0 336px;
  float:left;
  cursor:pointer;
}
.CharSelectCombined .Boy {
  margin:15px 12px 30px 22px;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-play_as_boy_AB.png);
}
.CharSelectCombined .Girl {
  margin:15px 0 30px 0;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-play_as_girl_AB.png);
}
.CharSelectCombined .PlayAsButton:hover {
  background-position:0 168px;
}
.CharSelectCombined .PlayAsButton.Faded {
  background-position:0 0;
  cursor:default;
}
.CharSelectCombined .PlayAsButton.Faded:hover {
  background-position:0 0;
}
div.AspNet-DetailsView-Data ul {
  margin:0;
  padding:0;
}
div.AspNet-DetailsView-Data li {
  margin:0;
  padding:0;
  list-style-type:none;
  position:relative;
}
ul.AspNet-Menu {
  position:relative;
}
ul.AspNet-Menu,
ul.AspNet-Menu ul {
  margin:0;
  padding:0;
  display:block;
}
ul.AspNet-Menu li {
  position:relative;
  list-style:none;
}
ul.AspNet-Menu li a,
ul.AspNet-Menu li span {
  display:block;
  text-decoration:none;
}
ul.AspNet-Menu ul {
  position:absolute;
  display:none;
}
ul.AspNet-Menu li:hover ul ul,
ul.AspNet-Menu li:hover ul ul ul,
ul.AspNet-Menu li.AspNet-Menu-Hover ul ul,
ul.AspNet-Menu li.AspNet-Menu-Hover ul ul ul {
  display:none;
}
ul.AspNet-Menu li:hover ul,
ul.AspNet-Menu li li:hover ul,
ul.AspNet-Menu li li li:hover ul,
ul.AspNet-Menu li.AspNet-Menu-Hover ul,
ul.AspNet-Menu li li.AspNet-Menu-Hover ul,
ul.AspNet-Menu li li li.AspNet-Menu-Hover ul {
  display:block;
}
.AspNet-Menu-Horizontal ul.AspNet-Menu li {
  float:left;
}
.AspNet-Menu-Horizontal ul.AspNet-Menu li li {
  float:none;
}
div.AspNet-TreeView {
  margin:0;
  padding:0;
}
div.AspNet-TreeView ul {
  list-style:none;
  margin:0;
  padding:0;
}
.AspNet-TreeView-Hide {
  display:none;
}
#ContentBuilderContainer {
  margin-top:10px;
}
#ContentBuilderContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0;
  padding:0;
}
#ContentBuilderContainer h3 {
  background-color:#ccc;
  font-size:16px;
  font-weight:bold;
  padding:5px;
  text-align:center;
}
#ContentBuilderContainer blockquote {
  margin:0 auto;
}
#ContentBuilderContainer .UploaderPanel,
#ContentBuilderContainer .UpsellPanel {
  text-align:center;
}
#ContentBuilderContainer .SelectorArea {
  margin:0 auto;
  margin-bottom:20px;
  margin-top:20px;
  text-align:center;
}
#ContentBuilderContainer .DisclaimerLink {
  z-index:9;
  display:inline;
  font-size:1.2em;
}
#ContentBuilderContainer .DisclaimerLink a span {
  display:none;
}
#ContentBuilderContainer .DisclaimerLink a:hover {
  text-decoration:none;
  border:none;
}
#ContentBuilderContainer .DisclaimerLink a:hover span {
  display:block;
  position:absolute;
  top:50%;
  left:12%;
  width:75%;
  padding:5px;
  margin:5px;
  z-index:10;
  color:white;
  background-color:#6e99c9;
  border-width:1px;
  border-color:Gray;
  border-style:ridge;
  text-decoration:none;
  line-height:1.4em;
  font:12px Verdana,sans-serif;
  text-align:left;
}
.ContestsPage .historyContainer {
  float:right;
  z-index:1;
  height:30px;
  margin-top:-5px;
}
.ContestsPage .contestNavigation {
  position:relative;
  width:890px;
  margin-left:5px;
  z-index:1;
  clear:left;
}
.ContestsPage .ContestTitle {
  font-weight:bold;
  font-family:Arial,Helvetica;
}
.ContestsPage .ContestBox {
  z-index:0;
  border-top:1px solid #9e9e9e;
  margin:-1px 0 5px 0;
  min-height:150px;
}
#ContestMain {
  float:left;
  width:600px;
}
.ContestsPage .SponsoredBy {
  float:left;
  font-size:24px;
  margin:5px;
  color:#3E606F;
}
#timer_countdown {
  letter-spacing:0;
  color:#444;
  float:left;
  font-size:16px;
  width:100%;
  margin:5px 0;
}
.ContestsPage .contestdates {
  display:none;
  font-size:11px;
  font-weight:bold;
}
.ContestsPage .ContestButtonContainer {
  float:left;
  width:100%;
  margin-top:5px;
  display:none;
}
.ContestsPage .DescriptionInfo {
  clear:left;
}
.ContestsPage .ContestTitle {
  margin-bottom:10px;
}
#UpdateCCButton {
  width:166px;
  height:50px;
  cursor:pointer;
  margin-left:auto;
  margin-right:auto;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-updatenow.png);
}
#UpdateCCButton:hover {
  background-position:0 50px;
}
.GameContainer {
  position:absolute;
  width:100%;
}
.GameContainerInner {
  background-position:center;
  background-repeat:no-repeat;
}
.GameContainerInner .GameDetails {
  height:1000px;
  margin:0 auto;
  position:relative;
  top:0;
  width:704px;
}
.GameContainerInner .Thumbnail {
  width:657px;
  height:378px;
  position:relative;
  top:190px;
  left:22px;
  cursor:pointer;
}
.GameContainerInner .Details {
  width:261px;
  height:130px;
  position:absolute;
  top:605px;
  left:31px;
  background-color:white;
}
.GameContainerInner .Summary {
  width:349px;
  height:169px;
  position:absolute;
  top:590px;
  left:322px;
  background-color:white;
}
.GameContainerInner .FacebookLike {
  padding:5px;
  width:649px;
  height:120px;
  position:absolute;
  top:791px;
  left:22px;
  background-color:white;
}
#CuratedGames .NavArrow {
  position:absolute;
  width:32px;
  height:32px;
  background-color:#099;
  top:200px;
  color:#EEE;
  font:bold 28px Arial;
  border-radius:12px;
  cursor:pointer;
  z-index:10;
}
#CuratedGames #NavArrowRight {
  right:20px;
}
#CuratedGames #NavArrowLeft {
  left:20px;
}
#CuratedGames .NavButton,
#CuratedGames .NavButtonSelected {
  background-repeat:none;
  display:inline-block;
  *display:inline;
  width:31px;
  height:30px;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Games/CuratedGames/navButton-off.jpg);
  margin:5px;
  cursor:pointer;
}
#CuratedGames .NavButtonSelected {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Games/CuratedGames/navButton-on.jpg);
}
#CuratedGames #NavButtonsOuter {
  position:absolute;
  top:510px;
  z-index:10;
  left:50%;
}
#CuratedGames #NavButtonsInner {
  margin:0 auto;
  width:400px;
  position:relative;
  text-align:center;
  right:50%;
}
.GameContainerInner .CuratedPlayButton {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Games/CuratedGames/CuratedGames-playBtn.png);
  position:absolute;
  top:220px;
  right:20px;
  width:326px;
  height:82px;
}
.GameContainerInner .CuratedPlayButton:hover {
  background-position:0 -82px;
  cursor:pointer;
}
.GameContainerInner .PlayersInGame {
  color:#fff;
  font:bold 18px Arial,Helvetica,Sans-Serif;
  position:relative;
  top:55px;
  left:70px;
}
.LoginField {
  height:25px;
  width:95px;
  border:1px solid #666;
  color:#000;
}
.LoginLabel {
  color:#999;
  position:absolute;
  top:-1px;
  left:10px;
}
.LoginButton {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Games/CuratedGames/btn_25px_white.png);
  color:black!important;
  border:1px solid #666;
  height:25px;
  padding:5px 6px;
  cursor:pointer;
  font-weight:bold;
}
.LoginButton:hover {
  background-position:0 -25px;
  border:1px solid #b2b2b2;
  text-decoration:none!important;
}
.SignupButton {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn_25px_blue.png) top;
  color:white!important;
  border:1px solid #029;
  height:25px;
  padding:5px 6px;
  cursor:pointer;
  font-weight:bold;
}
.SignupButton:hover {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn_25px_blue.png) bottom;
  border:1px solid #029;
  text-decoration:none!important;
}
#TradeCurrencyContainer {
  margin-top:10px;
}
#TradeCurrencyContainer .TradeBox {
  width:100px;
}
#TradeCurrencyContainer h2 {
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0 0 15px 0;
  padding:0;
  text-align:center;
}
#TradeCurrencyContainer .LeftColumn {
  float:left;
  width:230px;
}
#TradeCurrencyContainer .CenterColumn {
  float:left;
  width:410px;
}
#TradeCurrencyContainer .RightColumn {
  float:left;
  width:230px;
}
#TradeCurrencyContainer h4 {
  border-bottom:solid 1px #000;
  font-size:1em;
  font-weight:bold;
  margin:0;
  padding:5px;
  text-align:center;
  display:block;
}
#TradeCurrencyContainer .AccordionHeader {
  background-color:#ccc;
  border:solid 1px #000;
  cursor:pointer;
  font-size:1em;
  font-weight:bold;
  letter-spacing:.1em;
  margin:1px 0;
  padding:1px 1em;
  text-align:center;
}
#TradeCurrencyContainer .AccordionHeader:hover {
  background-color:#6e99c9;
  color:#fff;
}
#CurrencyOffersPane {
  float:right;
}
.TradingDashboard {
  margin-bottom:10px;
}
.CurrencyQuote,
.CurrencyTrade,
.CurrencyOffers,
.CurrencyBids,
.TradingDashboard {
  width:350px;
}
.CurrencyQuote,
.CurrencyTrade,
.CurrencyOffers,
.CurrencyBids,
.OpenBids,
.OpenOffers,
.TradeHistory {
  border:solid 1px #000;
  padding:0;
}
.CurrencyQuote,
.CurrencyTrade,
.TradingDashboard,
.OpenBids,
.OpenOffers,
.TradeHistory,
.TradingDashboard .FooterPager {
  margin:0 auto;
}
.CurrencyTrade,
.TradingDashboard {
  margin-top:20px;
}
.CurrencyTradeDetails {
  padding:5px;
}
.CurrencyTradeDetail,
.TradingDashboard .FooterPager {
  padding-top:5px;
  text-align:center;
}
.CurrencyOffers,
.CurrencyBids {
  width:200px;
}
.CurrencyOffer,
.AlternatingCurrencyOffer,
.CurrencyBid,
.AlternatingCurrencyBid {
  padding:5px;
  text-align:center;
}
.CurrencyQuote .TableHeader,
.CurrencyOffers .TableHeader,
.CurrencyBids .TableHeader {
  font-weight:bold;
}
.CurrencyQuote .TableRow,
.CurrencyOffers .TableRow,
.CurrencyBids .TableRow {
  border-top:solid 1px #000;
}
.CurrencyQuote .Pair,
.CurrencyQuote .Rate,
.CurrencyQuote .Spread,
.CurrencyQuote .HighLow {
  float:left;
  padding:5px;
  text-align:center;
  width:77px;
}
.MyMoneyPage #TradeCurrencyContainer .LeftColumn,
.MyMoneyPage #TradeCurrencyContainer .RightColumn {
  float:left;
  width:auto;
}
.MyMoneyPage #TradeCurrencyContainer .RightColumn {
  *width:180px;
}
.MyMoneyPage #TradeCurrencyContainer .CenterColumn {
  float:left;
  width:350px;
  margin:0 5px;
}
.MyMoneyPage .CurrencyOffers,
.MyMoneyPage .CurrencyBids {
  width:155px;
  margin:0 12px;
}
.DarkGradientBox {
  border:solid 2px #7DADE0;
}
.DarkGradientBox .DGB_Header {
  border-bottom:solid 2px #6e99c9;
}
.DarkGradientBox .DGB_Button {
  cursor:pointer;
  background-color:#435D77;
  color:White;
  text-decoration:none;
  border:solid 1px #777;
  padding:6px 10px 6px 10px;
  font-family:Verdana,Sans-Serif;
  font-size:12px;
  font-weight:bold;
  text-align:center;
  white-space:nowrap;
}
.DarkGradientBox .DGB_Button:link,
.DarkGradientBox .DGB_Button:visited {
  background-color:#435D77;
  color:White;
  text-decoration:none;
}
.DarkGradientBox .DGB_Button:hover,
.DarkGradientBox .DGB_Button:active {
  background-color:#B6CCE4;
  color:#435D77;
  text-decoration:none;
}
#FriendliestFolkPane {
  border-color:#000;
  border-style:solid;
  border-width:1px;
  height:184px;
  margin-top:10px;
  overflow:auto;
  width:770px;
}
#FriendliestFolk h4 {
  font-size:10pt;
  font-weight:bold;
  line-height:1em;
  margin-bottom:5px;
  margin-top:5px;
}
#GamesContainer {
  font-family:Verdana,Sans-Serif;
}
#GamesContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0;
  padding:0;
}
#GamesContainer h4 {
  font-family:Verdana,Sans-Serif;
  font-size:1.3em;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:1em;
  margin:15px 0;
  padding:0;
}
#GamesContainer ul {
  font-family:Verdana,Sans-Serif;
  list-style:none;
  margin:10px 0 30px 0;
  padding-left:0;
}
#GamesContainer ul li {
  font-family:Verdana,Sans-Serif;
  margin-bottom:.5em;
}
#GamesContainer ul a {
  font-size:1.1em;
}
#GamesContainer .DisplayFilters {
  width:170px;
}
#GamesContainer #Games {
  float:left;
  padding-bottom:10px;
  padding-left:0;
  padding-right:0;
  width:720px;
  overflow:visible;
}
.GameList {
  overflow:visible;
}
#GamesContainer .Ads_WideSkyscraper {
  float:right;
  text-align:right;
  width:160px;
}
#GamesContainer #Games .FooterPager {
  margin:20px 24px 0 0;
  padding:2px 0;
  text-align:right;
}
#GamesContainer #Games .HeaderPager {
  margin:0 24px 0 100px;
  padding:30px 0;
  text-align:left;
}
#GamesContainer #Games .HeaderPager .Label,
#GamesContainer #Games .FooterPager .Label {
  font-size:1em;
  vertical-align:middle;
}
#GamesContainer .Game {
  margin:0 10px 15px 10px;
  vertical-align:top;
  width:162px;
}
#GamesContainer .Game .GameThumbnail {
  border:solid 1px #000;
  width:160px;
  height:100px;
  text-align:center;
}
#GamesContainer .Game .GameDetails {
  font-family:Verdana,Sans-Serif;
  overflow:hidden;
  padding:2px 0 6px 0;
  width:152px;
}
.GameName {
  font-weight:bold;
  font-size:12px;
}
#GamesContainer .GameName a {
  font-size:.9em;
  font-weight:bold;
  line-height:1.5em;
  vertical-align:top;
}
.GamesBullet {
  padding-right:3px;
}
#GamesContainer .Label,
#GamesContainer .Detail,
#GamesContainer .DetailHighlighted {
  font-size:.8em;
}
#GamesContainer .DetailHighlighted {
  color:Red;
  font-weight:bold;
}
#GamesContainer .GamesDisplaySet {
  float:left;
  font-family:Comic Sans MS,Arial,Sans-Serif;
  font-size:1.5em;
}
.GamesInfoIcon,
.GenreIcon,
.GearIcon {
  margin-top:1px;
  margin-right:1px;
  position:relative;
  top:3px;
}
div.GamesInfoIcon {
  height:14px;
  width:16px;
  display:inline-block;
  top:0;
  padding:0;
  margin-right:3px;
}
.AllowedGearRepeater_Container div.GamesInfoIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/CategoryIcons/CategorySprite.png);
}
.AssetGenreRepeater_Container div.GamesInfoIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/GenreIcons/GenreIconsSprite.png);
  height:14px;
}
.AllowedGearRepeater_Container,
.AssetGenreRepeater_Container {
  clear:both;
  padding-top:1px;
  padding-bottom:1px;
}
.AllowedGearRepeater_Container div,
.AssetGenreRepeater_Container div {
  float:left;
  position:relative;
  top:.25em;
  padding-top:1px;
  padding-bottom:1px;
}
div.GamesInfoIcon.Melee {
  background-position:48px 0;
}
div.GamesInfoIcon.Ranged {
  background-position:64px 16px;
}
div.GamesInfoIcon.Explosive {
  background-position:-16px 0;
}
div.GamesInfoIcon.PowerUps {
  background-position:-16px -16px;
}
div.GamesInfoIcon.Navigation {
  background-position:16px 0;
  z-index:inherit;
}
div.GamesInfoIcon.Music {
  background-position:32px 0;
}
div.GamesInfoIcon.Social {
  background-position:48px 16px;
}
div.GamesInfoIcon.Building {
  background-position:0 0;
}
div.GamesInfoIcon.PersonalTransport {
  background-position:0 16px;
}
div.GamesInfoIcon.Adventure {
  background-position:0 0;
}
div.GamesInfoIcon.War {
  background-position:16px -3px;
}
div.GamesInfoIcon.Funny {
  background-position:32px 0;
}
div.GamesInfoIcon.Scary {
  background-position:49px 0;
}
div.GamesInfoIcon.Fantasy {
  background-position:-16px 0;
}
div.GamesInfoIcon.Town.City {
  background-position:-32px 0;
}
div.GamesInfoIcon.All {
  background-position:-47px 1px;
}
div.GamesInfoIcon.Ninja {
  background-position:0 16px;
}
div.GamesInfoIcon.Wild.West {
  background-position:16px 15px;
}
div.GamesInfoIcon.Tutorial {
  background-position:32px 16px;
}
div.GamesInfoIcon.Sports {
  background-position:49px 16px;
}
div.GamesInfoIcon.Pirate {
  background-position:-16px 16px;
}
div.GamesInfoIcon.Sci-Fi {
  background-position:-32px 16px;
}
div.GamesInfoIcon.Skate.Park {
  background-position:-48px 16px;
  width:15px;
}
div.GamesInfoIcon.FPS {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/GenreIcons/FPS.png) no-repeat;
  height:16px;
}
div.GamesInfoIcon.RPG {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/GenreIcons/RPG.png) no-repeat;
  height:16px;
}
.SearchBoxBack .StandardBox {
  background:#6e99c9;
}
.GameFilter {
  color:#555;
  margin-left:10px;
  font-size:14px;
}
.GameFilter ul {
  list-style-type:none;
  padding-left:0;
  margin:0;
}
.GameFilter ul li {
  margin:5px 0;
}
.GameFilter .SelectedFilter,
.GameFilter .SelectedGenre,
.GameFilter .SelectedSort {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/gamesPage_filterArrow.png) no-repeat 0 1px;
  cursor:pointer;
  padding-left:20px;
  font-weight:normal;
}
.GameFilter .GamesFilter,
.GameFilter .GamesGenre,
.GameFilter .GamesSort {
  padding-left:20px;
  display:inline-block;
}
.GamesGenre h3 {
  display:inline-block;
  cursor:pointer;
  font-weight:normal;
}
#PlayTabs a {
  text-decoration:none;
}
.SelectedFilter,
.SelectedGenre,
.SelectedSort {
  font-weight:normal;
}
a.DisabledFilter,
a.DisabledFilter:hover {
  color:gray;
  text-decoration:none;
  cursor:default;
}
a.GamesGenre.DisabledFilter h3,
a.GamesGenre.DisabledFilter:hover h3 {
  cursor:default;
}
#BCOnlyPlaces {
  position:relative;
  width:410px;
  text-align:center;
  float:left;
  margin-top:8px;
  margin-bottom:6px;
}
#BCOnlyPlaces .StandardBoxHeaderGray {
  width:410px;
  height:27px;
  padding:9px 2px 0 2px;
  *padding:5px 2px 0 2px;
}
#BCOnlyPlaces .StandardBox {
  height:188px;
  padding:2px 0;
}
#BCOnlyPlacesTitle {
  display:inline;
  font-weight:bold;
  font-size:19px;
  position:relative;
  *margin-left:5px;
}
#BCOnlyGamesContent {
  width:370px;
  margin:0 auto;
}
#BCOnlyGamesContentPrevNavButton {
  position:absolute;
  top:105px;
  left:10px;
  visibility:hidden;
}
#BCOnlyGamesContentNextNavButton {
  position:absolute;
  top:105px;
  right:10px;
}
#GenreDescriptionPanel {
  float:left;
  width:695px;
  font-size:.9em;
  padding:10px;
  border-top:1px solid #AAA;
}
.SearchIconButton {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/searchIcon.png) no-repeat;
  cursor:pointer;
  width:16px;
  height:16px;
  position:absolute;
  top:5px;
  right:4px;
}
.GameItem {
  padding:6px;
  margin-left:8px;
  margin-bottom:8px;
  position:relative;
  text-align:left;
}
.GameItem:hover {
  display:block;
  z-index:99;
}
.GameItem .AlwaysShown {
  position:relative;
  width:160px;
  height:130px;
}
.GameItem:hover .AlwaysShown {
  z-index:999;
}
.GameItem .HoverShown {
  display:none;
  position:absolute;
  width:160px;
  padding:158px 15px 15px;
  top:-10px;
  left:-10px;
  border:solid 1px #888;
  background:#fff;
  font-size:11px;
  text-align:left;
  color:#888;
  -moz-border-radius:5px;
  -webkit-border-radius:5px;
}
.GameItem .CreatorName {
  position:relative;
  top:-5px;
  font-size:11px;
  color:#888;
}
.GameItem .BCOverlay {
  position:absolute;
  top:81px;
  left:0;
}
.PersonalServerOverlay_Small {
  position:absolute;
  bottom:1px;
  right:1px;
  width:34px;
  height:18px;
  background-image:url('/web/20120611211431im_/http://www.roblox.com/images/icons/overlay_personal_small.png');
  background-repeat:no-repeat;
}
.PersonalServerOverlay_Big {
  position:absolute;
  bottom:0;
  right:0;
  width:137px;
  height:38px;
  background-repeat:no-repeat;
  background-image:url('/web/20120611211431im_/http://www.roblox.com/images/icons/overlay_personal_big.png');
}
.GameItem .MegaOverlay {
  position:absolute;
  top:81px;
  right:0;
}
.GameItem .GenreIcon,
.GameItem .GearIcon {
  position:static;
  top:0;
  margin-top:0;
  margin-right:0;
}
#GamesLeftColumn {
  width:136px;
}
.GroupMember {
  float:left;
  display:block;
  width:50px;
  margin:0 3px;
}
#mid-column .FooterPager {
  clear:both;
  text-align:center;
  margin:0;
  padding-top:10px;
  *padding:0;
}
#mid-column .FooterPager input {
  width:30px;
}
#mid-column .FooterPager span {
  display:inline-block;
}
#mid-column .FooterPager span span,
#mid-column .FooterPager span a {
  display:inline-block;
  width:12px;
  height:12px;
}
#mid-column .FooterPager span span,
#mid-column .FooterPager span a,
#mid-column .FooterPager span div {
  float:left;
}
#mid-column .FooterPager span a:hover {
  background-color:#fff;
  text-decoration:none;
}
#mid-column .FooterPager input {
  text-align:center;
}
.pagerbtns {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/blue_arrow_btns_12x12_sprite.png') no-repeat;
  position:relative;
  top:4px;
}
.pagerbtns.previous {
  background-position:0 -24px;
}
a.pagerbtns.previous:hover {
  background-position:0 -36px;
}
span.pagerbtns.previous {
  background-position:0 -60px;
}
.pagerbtns.next {
  background-position:0 0;
}
a.pagerbtns.next:hover {
  background-position:0 -12px;
}
span.pagerbtns.next {
  background-position:0 -48px;
}
.previous {
  *position:relative;
  *top:18px;
}
#mid-column .FooterPager div.paging_pagenums_container {
  display:inline;
  float:none;
}
#mid-column .FooterPager .paging_wrapper {
  margin:0 5px;
  position:relative;
  top:2px;
  *top:0;
  *margin-left:17px;
}
#mid-column .FooterPager .paging_wrapper input,
#mid-column .FooterPager .paging_wrapper span,
#mid-column .FooterPager .paging_wrapper div,
#mid-column .FooterPager .paging_wrapper {
  font-size:11px;
  height:11px;
  line-height:1em;
}
#mid-column .FooterPager .paging_wrapper input {
  *vertical-align;
}
.Members_DropDown {
  text-align:right;
  margin-bottom:5px;
}
.Members_DropDown .ReportAbuse {
  margin-right:6px;
}
.Members_DropDown select {
  margin-right:5px;
}
.GroupMember .OnlineStatus {
  position:absolute;
  padding:2px;
}
pre {
  font:normal 8pt/normal Verdana,sans-serif;
}
textarea {
  resize:none;
}
#GroupsPeopleContainer .StandardTabGrayActive,
#GroupsPeopleContainer .StandardTabGray {
  position:relative;
  cursor:pointer;
}
.groupEmblemThumbnail position:relative;
top:-4px;
cursor:pointer;
}
.groupEmblemThumbnail {
  margin-top:10px;
  margin-bottom:10px;
  margin-left:8px;
  margin-right:8px;
  text-align:center;
  width:105px;
  overflow:hidden;
}
#GroupThumbnails {
  text-align:center;
  margin-bottom:10px;
}
.GroupDescriptionThumbnail {
  float:left;
  clear:none;
  margin:0 10px 10px 0;
}
.GroupMembers {
  width:100%;
}
.GroupMembers tr {
  padding-bottom:10px;
}
.GroupMembers td {
  padding:0 5px 10px 5px;
  text-align:center;
}
.IncompleteFormField {
  color:red;
}
.GroupWallPostButton {
  width:69px;
  height:53px;
  margin:3px 0 4px 0;
  float:right;
}
.GroupWallPostText {
  width:375px;
  height:53px;
  float:left;
}
.GroupDescriptionEdit {
  border:none;
  border-style:none;
}
.EmblemAdminImage {
  margin:0x;
}
.CreateNewGroup {
  padding-bottom:10px;
  margin-bottom:10px;
  display:block;
  text-align:center;
  font-size:12px;
  cursor:pointer;
}
.CreateNewGroupError {
  color:Red;
}
.GroupMembersAdminTable tr {
  text-align:left;
}
.GroupMembersAdminTable td {
  width:85px;
  margin:2px;
}
#GroupSearchResults thead tr {
  background-color:#B0C4DE;
  color:Black;
}
#GroupSearchResults .GroupEmblemImg {
  border:solid 2px #B0C4DE;
  padding:2px;
}
.selectedSmallThumb {
  border:solid 2px #FFE390;
}
.nonSelectedSmallThumb {
  border:solid 2px transparent;
}
#left-column,
#mid-column,
#right-column {
  float:left;
  position:relative;
  min-height:100px;
}
#left-column .StandardBox,
#mid-column .StandardBox,
#right-column .StandardBox {
  background:var(--standardBox_01_bkg) top repeat-x white;
  color:#000;
}
#left-column .StandardBox a,
#mid-column .StandardBox a,
#right-column .StandardBox a {
  color:#095fb5;
}
#left-column .StandardBox .ReportAbuse .AbuseButton a,
#mid-column .StandardBox .ReportAbuse .AbuseButton a,
#right-column .StandardBox .ReportAbuse .AbuseButton a {
  color:Red;
}
#left-column {
  width:166px;
  margin:0 0 0 5px;
}
#right-column {
  width:166px;
}
#mid-column {
  width:505px;
  margin:0 20px;
}
#mid-column.GroupsPage {
  width:661px;
}
#mid-column .ReportAbuse {
  text-align:right;
}
#GroupThumbnails {
  overflow:hidden;
  margin:0;
  width:100%;
  position:relative;
}
.GroupListItemContainer {
  clear:left;
  padding:5px 0 5px 14px;
}
.GroupListItemContainer a {
  display:block;
}
.GroupListItemContainer:hover,
.GroupListItemContainer.selected:hover {
  background-color:#fff;
  cursor:pointer;
}
.GroupListItemContainer.selected {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/gamesPage_filterArrow.png') 4px center no-repeat;
}
.selected .GroupListName {
  font-weight:bold;
}
.GroupListImageContainer,
.GroupListName {
  float:left;
  font-size:11px;
}
.GroupListName a,
.GroupListName a:hover,
.GroupListName a:visited {
  color:#000;
  text-decoration:none;
}
.GroupListImageContainer img {
  background-color:#fff;
  border:1px solid #fff;
}
.GroupListName {
  overflow:hidden;
  width:90px;
  height:32px;
  text-align:left;
  position:relative;
  padding:0 7px;
  padding-top:12px;
}
#left-column .StandardBox {
  overflow:hidden;
  float:left;
  text-align:center;
  width:100%;
  background:#E8E8E8;
}
#CreateGroupBtn {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/sets_btn_create.png');
  height:50px;
  width:150px;
  position:relative;
  left:8px;
  *left:0;
  margin:5px 0 10px 0;
}
#CreateGroupBtn:hover {
  cursor:pointer;
  background-position:bottom left;
}
.GroupPanelContainer {
  overflow:hidden;
  padding:10px;
}
.GroupPanelContainer .left-col {
  width:25%;
  float:left;
  margin-right:2%;
  overflow:hidden;
}
.GroupPanelContainer .left-col div {
  text-align:left;
}
.GroupPanelContainer .right-col {
  float:left;
  width:73%;
}
.GroupPanelContainer .right-col p {
  overflow:hidden;
}
.GroupOwner {
  color:gray;
  width:100%;
  text-align:center;
  margin-top:10px;
}
.MyRank {
  width:100%;
  font-size:14px;
  color:Gray;
  margin-top:10px;
}
.MyRank span {
  color:#000;
}
.AdvertiseGroup {
  margin-top:10px;
}
.ReportAbuse {
  font-size:11px;
}
#GroupRoleSetsMembersPane .ReportAbusePanel {
  float:right;
  margin-top:2px;
}
.GroupWallPostBtn {
  padding:3px 6px;
  position:relative;
  top:32px;
  left:5px;
}
.GroupControlsBox div {
  margin:6px 0;
  text-align:center;
}
#SearchControls {
  width:865px;
  height:28px;
  clear:both;
  display:block;
  background:#C4C4C4;
  border:1px solid #AAA;
  margin:0 0 15px 0;
  left:5px;
  position:relative;
  padding:2px 5px;
  top:-5px;
}
.MyGroupsPage #SearchControls {
  top:0;
  text-align:center;
}
#SearchControls .content {
  text-align:center;
}
.content .SearchKeyword {
  width:350px;
}
#SearchControls .label {
  font-weight:bold;
  width:200px;
  font-size:16px;
  position:relative;
  top:1px;
  margin-right:7px;
}
.FooterPager {
  font-family:Arial,Helvetica,sans-serif;
}
.ClaimOwnershipPanel {
  border:2px solid black;
  padding:2px;
  margin-bottom:10px;
}
.GroupListContainer {
  padding:0;
}
.JoinGroupDiv {
  height:50px;
  width:150px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/groups_btn_join.png');
  display:inline-block;
  margin-top:10px;
}
.AlreadyRequestedInvite {
  height:50px;
  width:150px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/groups_btn_joinpending.png');
  display:inline-block;
  margin-top:10px;
}
.JoinGroupDiv:hover {
  cursor:pointer;
  background-position:left bottom;
}
.RepeaterImage {
  width:20%;
  overflow:hidden;
  float:left;
}
.RepeaterImage img {
  clear:both;
}
.RepeaterText {
  width:75%;
  float:right;
}
.GroupWall_PostContainer {
  overflow:hidden;
  width:100%;
  font-weight:bold;
  font-style:italic;
  margin-bottom:5px;
}
input.default {
  font-style:italic;
  color:#888;
}
.GroupWallPane {
  padding-bottom:10px;
  position:relative;
  overflow:hidden;
}
.GroupWallPane .AlternatingItemTemplateEven {
  background-color:#fff;
  clear:both;
  padding:10px;
}
.GroupWallPane .AlternatingItemTemplateOdd {
  background-color:#F2F2F2;
  clear:both;
  padding:10px;
}
.GroupControlsBox input,
.GroupControlsBox button {
  width:125px;
}
.InsideBoxHeader {
  font-size:18px;
  font-weight:bold;
  color:#000;
  display:block;
  clear:both;
  padding:3px;
  margin-bottom:5px;
}
.StatusView .top {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/bg-speech_top.png') no-repeat;
  padding:5px;
  width:317px;
}
.StatusView .bottom {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Groups/bg-speech_bottom.png') no-repeat;
  padding:5px;
  padding-right:0;
}
.StatusView .bottom .content {
  float:left;
  position:relative;
  left:28px;
}
.StatusView .ReportAbuse {
  display:inline-block;
  float:right;
}
#GroupDescP {
  word-wrap:break-word;
}
#GroupDescP a:hover {
  cursor:pointer;
}
.GroupsPeopleTabs_Container {
  display:block;
  height:30px;
}
.GroupsPeopleTabs_Container div {
  float:left;
  margin:0;
}
#GroupRoleSetsMembersPane .loading {
  display:none;
  height:69px;
  width:100%;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/spinners/spinner16x16.gif') no-repeat center;
  *float:left;
}
.GroupWallPane .loading {
  display:none;
  position:absolute;
  top:0;
  height:100%;
  width:100%;
}
.GroupWallPane .loading .content {
  position:absolute;
  top:0;
  height:100%;
  width:100%;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/spinners/spinner100x100.gif') no-repeat center;
  z-index:1;
}
.GroupWallPane .loading .background {
  position:absolute;
  top:0;
  height:100%;
  width:100%;
  background:#fff;
}
#Help {
  border-style:ridge;
  border-color:#ddd;
  border-width:5px;
  background-color:#eee;
  height:600px;
  padding:1px;
}
#Help h1 {
  text-indent:10px;
}
#Help .salesForce,
#Help .salesForce iframe {
  margin-left:5px;
  margin-bottom:10px;
  float:left;
  width:625px;
  height:500px;
}
#Help .avatar {
  text-align:center;
  display:block;
  float:right;
  clear:right;
  margin-right:auto;
  margin-left:auto;
  padding-left:0;
  padding-right:0;
}
#Help .descriptionPanels {
  background-color:Transparent;
  background-image:url('/web/20120611211431im_/http://www.roblox.com/images/Speech Bubble 225.gif');
  width:225px;
  height:235px;
  background-repeat:no-repeat;
  margin-top:40px;
}
#Help .descriptionPanels p {
  font-family:Comic Sans MS;
  padding-top:20px;
  padding-right:40px;
  padding-left:25px;
  text-align:left;
  color:Navy;
  font-size:9pt;
}
#Help .navigation {
  clear:left;
  color:#6e99c9;
  border:none;
  background-color:Transparent;
  font-family:'Comic Sans MS',Verdana,sans-serif;
  font-size:10pt;
  font-weight:normal;
  text-decoration:none;
  text-align:center;
}
#Help .navigation .MenuItem {
  color:#6e99c9;
  font-size:16px;
  line-height:2em;
}
#Help .navigation a.MenuItem:link,
#Help .navigation a.MenuItem:visited,
#Help .navigation a.MenuItem:active {
  color:#6e99c9;
  text-decoration:none;
}
#Help .navigation a.MenuItem:hover {
  text-decoration:underline;
}
#Help .forumLinks {
  font-family:Sans-Serif;
  border-width:3px;
  border-color:#ddd;
  border-style:groove;
  visibility:hidden;
  display:none;
  filter:alpha(opacity=93);
  opacity:.93;
  background-color:#eee;
  background-image:url('/web/20120611211431im_/http://www.roblox.com/images/help_gradient.png');
  background-repeat:repeat-y;
  background-position:left top;
  width:150px;
  font-size:10pt;
  text-align:center;
  padding:5px;
  line-height:2em;
}
.iframeHeader #Nav {
  width:100%!important;
}
.MiniHeaderBG {
  margin-top:-3px;
  z-index:1;
  width:100%;
  height:173px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/MiniclipHeader_BG.PNG) white bottom repeat-x;
}
#MiniWrapper {
  width:960px;
  overflow:hidden;
  margin-left:auto;
  margin-right:auto;
  margin-top:-1px;
  margin-bottom:0;
  padding:0;
}
.MiniclipHeader {
  padding:0;
  border:none;
  margin-top:-2px;
  margin-left:-7px;
  display:block;
}
#iFrameLogin {
  position:absolute;
  top:27px;
  right:0;
  width:340px;
  height:128x;
  border:1px solid #0C3060;
  border-top:none;
}
.fbSplashPageConnect {
  margin:5px 0;
}
#facebookSignIn {
  text-align:center;
  margin-top:8px;
  margin-bottom:10px;
}
.fbLoginButton {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/Facebook/btn-login_w_fb.png") no-repeat;
  background-position:0 0;
  width:153px;
  height:22px;
  display:inline-block;
}
.fbLoginButton:hover {
  background-position:0 -22px;
}
.LoginFormLabel {
  font:normal 11px arial;
  color:black;
}
.LoginFormInput {
  width:150px;
  height:19px;
  border:1px solid #A7A7A7;
  background:#fff;
  padding-left:4px;
  *margin-left:-10px;
}
.LoginFormFieldSet {
  position:relative;
  height:39px;
  *margin-top:-10px;
}
.UserNameDiv {
  float:left;
  width:156px;
}
.PasswordDiv {
  float:right;
  width:158px;
  position:relative;
}
.ResetPassword {
  font:normal 11px Arial;
  color:#095FB5;
  right:0;
  position:absolute;
}
.newLogin {
  margin:10px;
}
#SocialNetworkSignIn {
  border-top:1px solid #ACACAC;
}
.iFrameBlueLogin {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/btn-login.png") no-repeat;
  background-position:0 0;
  height:23px;
  width:54px;
  position:absolute;
  right:0;
  top:50%;
  margin-top:-12px;
}
.iFrameBlueLogin:hover {
  background-position:0 -23px;
}
.iFrameLoginSignUp {
  margin-top:6px;
  float:right;
  position:relative;
}
.loginFrame {
  height:100%;
  width:100%;
}
#InboxContainer {
  margin-top:10px;
}
#InboxContainer #InboxPane {
  float:left;
  position:relative;
  top:-2px;
  width:700px;
}
.InboxDateField {
  text-align:right;
}
#InboxContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  letter-spacing:.5em;
  line-height:1em;
  margin:0 0 10px 0;
  padding:0;
}
#InboxContainer .Ads_WideSkyscraper {
  float:right;
  text-align:right;
  width:160px;
}
#InboxContainer #Inbox {
  border:solid 1px #000;
}
#InboxContainer .Buttons {
  margin:10px 0;
  text-align:center;
}
#InboxContainer .InboxHeader {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/topNav_black.png);
  border:none;
  color:#fff;
  font:1.2em/normal Verdana,sans-serif;
  font-weight:lighter;
  letter-spacing:.15em;
  text-align:center;
}
#InboxContainer .InboxRow {
  cursor:pointer;
  font:normal 1em/normal Verdana,sans-serif;
}
#InboxContainer .InboxRow_Unread {
  cursor:pointer;
  font:bold 1em/normal Verdana,sans-serif;
}
#InboxContainer .InboxRow:hover,
#InboxContainer .InboxRow_Unread:hover,
#InboxContainer .SystemAlertMessage:hover,
#InboxContainer .SystemAlertMessage_Unread:hover {
  background-color:#6e99c9;
  color:#fff;
}
#InboxContainer .InboxHeader a,
#InboxContainer .InboxPager a,
#InboxContainer .InboxRow:hover a,
#InboxContainer .InboxRow_Unread:hover a,
#InboxContainer .SystemAlertMessage:hover a,
#InboxContainer .SystemAlertMessage_Unread:hover a {
  color:#fff;
}
#InboxContainer .InboxPager {
  background-color:#999;
  font:bold 1.2em/normal Verdana,sans-serif;
  letter-spacing:.15em;
  text-align:center;
}
#InboxContainer .SystemAlertMessage,
#InboxContainer .SystemAlertMessage_Unread {
  cursor:pointer;
  font:normal 1em/normal Verdana,sans-serif;
  color:#F00;
}
#InboxContainer .SystemAlertMessage a,
#InboxContainer .SystemAlertMessage_Unread a {
  color:#F00;
}
#InboxContainer .SystemAlertMessage_Unread {
  font:bold 1em/normal Verdana,sans-serif;
}
#InfoContainer {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
  margin:0 auto;
  width:620px;
}
#InfoContainer h2 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-size:x-large;
  margin:0;
  text-align:center;
}
#InfoContainer #Content {
  font:normal 1em/normal Verdana,sans-serif;
  line-height:1.5em;
  padding:10px 20px 10px 20px;
}
#AlreadyInstalled {
  font-size:large;
  margin:44px 44px 44px 44px;
}
#AlreadyInstalled a {
  text-decoration:underline;
}
#ItemContainer {
  margin-top:10px;
  font-family:Verdana,Helvetica,Sans-Serif;
}
.PlaceItemContainer {
  font-family:Arial,Helvetica,Sans-Serif!important;
}
.PlaceItemContainer #Summary {
  border:none!important;
  background:none!important;
}
.PlaceItemContainer .item-header {
  color:#000;
  font:bold 18px Arial,Helvetica,Sans-Serif;
  padding-bottom:5px;
}
.PlaceItemContainer #Actions_Place {
  border:none!important;
  background:none!important;
  float:right!important;
  text-align:right!important;
  width:auto!important;
  padding:0!important;
}
.PlaceItemContainer .PlayGames {
  border:none!important;
  background:none!important;
}
#ItemContainer .StandardBoxHeader,
#ItemContainer .StandardBox {
  width:709px;
}
#ItemContainer h2 {
  background-color:#036;
  border-bottom:solid 1px #555;
  color:#fff;
  font-size:x-large;
  margin:0;
  text-align:center;
}
#ItemContainer h3 {
  font-size:1.5em;
  font-weight:normal;
  letter-spacing:.15em;
  line-height:1em;
  margin:0 0 .5em 0;
  padding:0;
}
#ItemContainer #Item {
  color:#555;
  float:left;
  width:705px;
}
.PlaceItem {
  font-family:Arial,Sans-Serif;
  padding:0 5px!important;
}
#ItemContainer #Details {
  margin:10px;
}
#ItemContainer #Thumbnail,
#ItemContainer #Thumbnail_Place {
  border:solid 1px #eee;
  padding:0;
  text-align:left;
  min-width:0;
}
#ItemContainer #Thumbnail {
  height:420px;
  width:420px;
}
#ItemContainer #Thumbnail_Place {
  width:420px;
}
#ItemContainer #Actions,
#ItemContainer #Actions_Place {
  background-color:#fff;
  min-width:0;
  overflow:hidden;
  top:420px;
  width:408px;
  padding:5px;
  text-align:left;
}
#ItemContainer #Actions {
  padding:5px;
  text-align:left;
  width:230px;
}
.AddRemoveFavorite {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/favoriteStar_20h.png) no-repeat 0 -20px;
  margin:0;
  display:inline-block;
  position:relative;
  top:3px;
  *display:inline;
  *zoom:1;
  padding-top:4px;
  padding-left:25px;
  height:18px;
}
.AddRemoveFavorite:hover,
.AddRemoveFavorite.Favorited {
  background-position:0 0;
}
#ItemContainer #Summary {
  background-color:#fff;
  border:dashed 1px #555;
  display:inline;
  float:right;
  padding:7px;
  width:235px;
}
#ItemContainer #Summary #Creator {
  clear:left;
}
#ItemContainer #Summary #DescriptionLabel {
  margin-bottom:.4em;
  margin-top:.7em;
}
.label {
  margin-bottom:.5em;
}
#ItemContainer #Summary .Description {
  border:solid 1px #555;
  font-weight:normal;
  font-size:1em;
  line-height:normal;
  max-height:136px;
  line-height:1.5em;
  padding:4px;
  overflow:auto;
  text-align:left;
}
#ItemContainer #Summary #ReportAbuse {
  margin:0 auto;
  padding:4px;
  text-align:center;
}
#ItemContainer #Summary #PublicDomainPurchase {
  float:left;
}
#ItemContainer #Summary #PublicDomainPurchase #PricePublicDomain {
  color:Blue;
  float:left;
  font-weight:bold;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary .ButtonGreyed {
  cursor:default;
  background-color:#A69FA1;
  border:solid 1px #000;
  color:Gray;
  font:.9em Arial,Helvetica,Sans-Serif;
  padding:3px 10px;
}
#ItemContainer #Summary .ButtonGreyed:hover {
  text-decoration:none;
  color:Gray;
}
#ItemContainer #Summary #PublicDomainPurchase #BuyForFree {
  float:left;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary #PublicDomainPurchase #BuyForFree .Button:hover {
  background-color:#6e99c9;
  border:solid 1px #000;
}
#ItemContainer #Summary #PublicDomainPurchase #BuyForFree a:hover {
  color:#fff;
}
#ItemContainer #Summary #RobuxPurchase #PriceInRobux {
  color:Green;
  float:left;
  font-weight:bold;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary #RobuxPurchase #BuyWithRobux {
  float:left;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary #RobuxPurchase #BuyWithRobux .Button:hover {
  background-color:#49b745;
  border:solid 1px #000;
}
#ItemContainer #Summary #RobuxPurchase #BuyWithRobux a:hover {
  color:#fff;
}
#ItemContainer #Summary #TicketsPurchase {
  clear:left;
}
#ItemContainer #Summary #TicketsPurchase #PriceInTickets {
  color:#fbb117;
  float:left;
  font-weight:bold;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary #TicketsPurchase #BuyWithTickets {
  float:left;
  line-height:2em;
  width:100px;
}
#ItemContainer #Summary #TicketsPurchase #BuyWithTickets .Button:hover {
  background-color:#fdd017;
  border:solid 1px #000;
}
#ItemContainer #Summary #TicketsPurchase #BuyWithTickets a:hover {
  color:#fff;
}
#ItemContainer #Configuration {
  background-color:#fff;
  border-bottom:dashed 1px #555;
  border-left:dashed 1px #555;
  border-right:dashed 1px #555;
  clear:right;
  float:right;
  margin-left:10px;
  margin-top:-10px;
  padding:5px 10px;
  text-align:center;
  width:249px;
}
.PurchaseModalClose {
  cursor:pointer;
  position:absolute;
  right:-18px;
  top:-18px;
}
.PurchaseModal {
  width:435px;
  display:none;
  position:absolute;
  border:2px solid #272727;
  background-color:#E1E1E1;
  padding:5px;
}
.PurchaseModal .titleBar {
  background-color:#E1E1E1;
  font:bold 27px Arial,Helvetica,Sans-Serif;
  letter-spacing:-1px;
  color:#363636;
  height:38px;
}
.PurchaseModalBody {
  background-color:#fff;
}
.PurchaseModalMessage {
  padding:10px;
  font:bold 15px Arial,Helvetica,Sans-Serif;
  color:#000;
  height:110px;
}
.PurchaseModalMessageImage {
  display:inline-block;
  *display:inline;
  *zoom:1;
}
.PurchaseModalMessageText {
  display:inline-block;
  *display:inline;
  *zoom:1;
  width:275px;
  vertical-align:top;
  padding-top:28px;
}
.PurchaseModalButtonContainer {
  clear:left;
  padding-top:10px;
  text-align:center;
}
.PurchaseModalFooter {
  color:#666;
  font:normal 12px Arial,Helvetica,Sans-Serif;
  text-align:center;
  margin:10px auto 0;
  padding-bottom:5px;
}
.ProcessingModal {
  width:300px;
  min-height:50px;
  display:none;
  position:absolute;
}
.ProcessingModalBody {
  margin:15px auto;
  text-align:center;
  vertical-align:middle;
  font:bold 18px arial,helvetica,sans-serif;
  background:none;
  color:#fff;
}
.CurrencyColor1 {
  color:#080;
  padding-left:20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/head_infobox_icons.png) no-repeat 0 -42px;
}
.CurrencyColor2 {
  color:#A61;
  padding-left:20px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/head_infobox_icons.png) no-repeat 0 -122px;
}
.CurrencyColorFree {
  color:#080;
}
.ItemVerb {
  background-color:#fff;
  border:dashed 1px #555;
  text-align:center;
  height:20px;
  margin-top:5px;
}
.OwnerPlaceActionPanel {
  position:absolute;
  text-align:right;
  width:250px;
}
.OwnerPlaceAction {
  height:20px;
  margin-top:5px;
}
.PlaceItemHR {
  background-color:#848484;
  border:0;
  color:#848484;
  height:1px;
  margin-left:0;
  margin-top:0;
}
#ItemContainer .Ownership {
  clear:right;
  color:#f00;
  float:right;
  margin-left:10px;
  margin-top:0;
  padding:10px 10px;
  text-align:center;
  width:230px;
}
#ItemContainer .PlayGames {
  background-color:#ccc;
  border:dashed 1px Green;
  color:Green;
  margin-top:10px;
  padding:10px 5px;
  text-align:center;
  width:408px;
}
#ItemContainer .BadgeStats {
  width:720px;
  padding:10px 0;
}
#ItemContainer .RunningGames {
  background-color:#ccc;
  border:dashed 1px #555;
  color:#555;
  margin-top:10px;
  padding:10px 5px;
  text-align:center;
  width:408px;
}
#ItemContainer .GameInstances {
  background-color:#fff;
  border:solid 1px #000;
  color:#555;
  width:408px;
}
#ItemContainer .RefreshRunningGames {
  margin:10px 0;
  text-align:center;
}
#ItemContainer #Ownership .Button,
#ItemContainer .PlayGames .Button {
  background-color:#fff;
}
#ItemContainer #Ownership .Button:Hover {
  background-color:#fff;
  border:solid 1px #f00;
  color:#f00;
}
#ItemContainer .PlayGames .Button:Hover {
  background-color:#fff;
  border:solid 1px Green;
  color:Green;
}
#ItemContainer .CommentsContainer,
#ItemContainer .TabbedInfoContainer {
  margin:10px;
  margin-top:0;
  width:665px;
}
#ItemContainer .TabbedInfoContainer h3 {
  padding:5px;
}
#ItemContainer .CommentsContainer .HeaderPager,
#ItemContainer .CommentsContainer .FooterPager {
  padding:5px 0;
  text-align:right;
}
#ItemContainer .CommentsContainer .Comments {
  border:dashed 1px #555;
  overflow:hidden;
  width:663px;
}
#ItemContainer .CommentsContainer .Comment,
#ItemContainer .CommentsContainer .AlternateComment {
  padding:7px 10px;
}
#ItemContainer .CommentsContainer .Comment {
  background-color:#fff;
}
#ItemContainer .CommentsContainer .AlternateComment {
  background-color:#eee;
}
#ItemContainer .CommentsContainer .Commenter {
  float:left;
  width:110px;
}
#ItemContainer .CommentsContainer .Avatar {
  border:solid 1px #555;
  height:100px;
  width:100px;
}
.Avatar {
  padding:0 0 8px 0;
}
#ItemContainer .CommentsContainer .Post {
  float:left;
  width:80%;
}
#ItemContainer .CommentsContainer .Content {
  margin:10px 0;
  overflow:hidden;
}
#ItemContainer .CommentsContainer .PostAComment {
  margin:10px 0 0 0;
}
#ItemContainer .CommentsContainer .PostAComment .Buttons {
  margin:10px 0 0 0;
}
#ItemContainer .CommentsContainer .MultilineTextBox,
#ItemContainer .CommentsContainer textarea {
  min-height:0;
  width:400px;
}
#EditItem {
  color:#555;
  float:left;
  font-family:Arial,Sans-Serif;
  margin:0;
}
#EditItemContainer h2 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-family:Comic Sans MS,Sans-Serif;
  font-size:x-large;
  margin:0;
  text-align:center;
}
#EditItemContainer fieldset {
  font-size:1.2em;
  margin:0;
  color:#000;
}
#EditItemContainer #Confirmation {
  border:dashed 1px #f00;
  background-color:#ccc;
  color:#f00;
  margin:0 auto;
  margin-top:10px;
  padding:10px 5px;
  width:410px;
}
#EditItemContainer #ItemName {
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#EditItemContainer #ItemThumbnail {
  border:solid 1px #555;
  height:230px;
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#EditItemContainer #ItemDescription {
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#EditItemContainer #Comments,
#EditItemContainer #PlaceAccess,
#EditItemContainer #PlaceCopyProtection,
#EditItemContainer #AllowGear,
#EditItemContainer #SetGenres,
#EditItemContainer #VersionHistory,
#EditItemContainer #PublicDomain,
#EditItemContainer #SellThisItem,
#EditItemContainer #PlaceReset,
#EditItemContainer #PlaceBuildAccess,
.MyItemOptions {
  padding:5px;
  margin:10px;
}
#EditItemContainer #SellThisItem #Pricing {
  background-color:#fff;
  border:dashed 1px #000;
  margin:15px 5px 5px 5px;
  padding:5px;
}
#EditItemContainer #SellThisItem #Price {
  margin-top:10px;
}
#EditItemContainer #SellThisItem #Price .TextBox {
  padding:2px 4px;
  width:75px;
}
#EditItemContainer .CopyProtectionRow,
#EditItemContainer .EnableCommentsRow,
#EditItemContainer .PlayerLimit,
#EditItemContainer .PlaceType,
#EditItemContainer .PublicDomainRow,
#EditItemContainer .SellThisItemRow,
#EditItemContainer .ChatSettings,
#EditItemContainer .GearSettings,
#EditItemContainer .GenreSettings,
#EditItemContainer .MembershipLevelSettings {
  font-size:.9em;
  margin:10px 35px;
}
#EditItemContainer .GenreSettings {
  margin:10px 0;
}
#EditItemContainer .GearSettings {
  margin:10px 40px;
}
#EditItemContainer .PlaceAccessRow,
#EditItemContainer .ResetPlaceRow {
  font-size:.9em;
  margin:10px 0;
  text-align:center;
}
#EditItemContainer .PlaceAccessRow {
  margin:10px 0 10px 100px;
  text-align:left;
}
#EditItemContainer .PlayerLimit .ClassicPlace {
  float:left;
}
#EditItemContainer .PlayerLimit .MegaPlace {
  position:relative;
  left:20px;
}
#EditItemContainer .PlayerLimit .ClassicPlace .NumPlayers {
  margin:5px 0 0 22px;
}
#ConfigurePlaceContainer .ResetPlaceRow .Button {
  margin:0 auto;
}
#EditItemContainer .PricingLabel {
  float:left;
  font-weight:bold;
  margin-right:5px;
  text-align:right;
  width:155px;
}
#EditItemContainer .PricingField_Robux {
  float:left;
  margin-left:5px;
  text-align:left;
  width:110px;
}
#EditItemContainer .PricingField_Tickets {
  float:left;
  margin-left:5px;
  text-align:left;
  width:110px;
}
#EditItemContainer .Buttons {
  margin:0 auto;
  margin-top:10px;
  margin-bottom:10px;
  text-align:center;
}
#EditItemContainer .Button {
  border-color:#555;
  color:#555;
  cursor:pointer;
}
#EditItemContainer .Button:hover {
  background-color:#6e99c9;
  color:#fff;
}
#EditItemContainer .Label {
  font-size:1.2em;
  margin:0;
  padding:0;
}
#EditItemContainer .TextBox {
  border:dashed 1px #555;
  margin:0;
  padding:5px 10px;
  width:400px;
}
#EditItemContainer .Multiline {
  border:dashed 1px #555;
  margin:0;
  padding:5px 10px;
  width:400px;
}
#EditItemContainer .Suggestion {
  font:normal .8em/normal Verdana,sans-serif;
  padding-left:9px;
}
#EditItemContainer .ItemConfigRadioButton {
  margin-left:20px;
}
#EditItemContainer .ItemConfigNotice {
  margin:10px 20px;
  font-size:.8em;
  color:red;
}
#ItemContainer .Ads_WideSkyscraper,
#EditItemContainer .Ads_WideSkyscraper {
  float:right;
  text-align:right;
  width:160px;
}
.GroupBuildRunningGameItem {
  border:solid 2px #50F;
}
.VisitButton,
.VisitButtonDisabled {
  display:inline;
  width:10px;
}
.VisitButtonDisabled {
  opacity:.5;
  filter:alpha(opacity=50);
}
.MultiplayerVisit,
.MultiplayerVisitDisabled {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Play.png);
  width:250px;
  height:48px;
}
.MultiplayerVisitDisabled {
  cursor:default;
  display:none;
}
.SoloVisit {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/PlaySolo.png);
  width:143px;
  height:48px;
}
.SoloVisitText {
  display:none;
}
.BuildSolo {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/BuildSolo2.png);
  width:143px;
  height:48px;
}
div.VisitButtonsRight a.BuildSolo {
  float:left;
  margin-top:3px;
}
.EditButton {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/EditMode2.png);
  width:143px;
  height:48px;
  float:left;
  margin-top:10px;
  margin-bottom:10px;
  display:inline;
}
.PersonalServerAccessDenied {
  color:red;
  line-height:1.5em;
  text-align:left;
  margin:15px 0;
}
.PlaceInfoIcons {
  text-align:center;
}
.iPublic,
.iLocked,
.iUnlocked,
.SharedIcon,
.CopyLockedIcon,
.AllGearIcon,
.GenreGearIcon,
.NoGearIcon {
  display:inline-block;
  width:16px;
  height:16px;
}
.iPublic {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/public.png);
}
.iLocked {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/locked.png);
}
.iUnlocked {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/unlocked.png);
}
.SharedIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Shared.png);
}
.CopyLockedIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/CopyLocked.png);
}
.AllGearIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Suitcase16x16.png);
}
.GenreGearIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/GenreSuitcase16x16.png);
}
.NoGearIcon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/NoSuitcase16x16.png);
}
#BadgeStatsHeader {
  color:#666;
  font:bold 13px Arial,Helvetica,Sans-Serif;
  padding-left:5px;
}
.BadgeStatsHR {
  margin-left:0;
  *margin-left:-10px;
  width:708px;
}
#BadgeStats {
  font-size:10px;
  width:708px;
}
.PlaceItemContainer .BadgeStatsHR {
  width:720px;
}
.PlaceItemContainer #BadgeStats {
  width:720px;
}
#BadgeStats .BadgeTable {
  border:0;
  border-spacing:0;
  font:normal 12px arial,helvetica,sans-serif;
  width:100%;
}
#BadgeStats .BadgeTable a {
  color:#496780;
}
#BadgeStats .BadgeRow,
#BadgeStats .AlternatingBadgeRow {
  height:100px;
}
#BadgeStats .AlternatingBadgeRow {
  background-color:#dddde0;
  color:#000;
}
#BadgeStats .BadgeIconColumn {
  text-align:center;
  width:100px;
}
#BadgeStats .BadgeDescriptionColumn {
  width:60%;
  padding-right:50px;
  padding-left:5px;
}
#BadgeStats .BadgeStatsColumn {
  width:26%;
  padding-left:5px;
}
#BadgeStats .BadgeEmptyTableColumn {
  width:100%;
}
#BadgesShowContainer {
  text-align:center;
  margin-top:5px;
  font:bold 12px Arial,Helvetica,sans-serif;
}
#BadgesShowMore {
  cursor:pointer;
  color:#00f;
}
.item-header h1 {
  margin:0;
  padding:0;
  font-size:16px;
  font-style:inherit;
  display:inline;
}
.section {
  padding:8px 0 0 0;
}
.expires-div {
  margin:16px 0 8px 0;
}
#timer {
  color:Red;
  margin:8px 0;
}
.item-detail div,
.creator-name {
  line-height:1.5em;
}
#assetContainer,
#placeContainer {
  float:left;
  width:420px;
  overflow:hidden;
}
.updateSetsDiv {
  float:right;
  width:248px;
  border:2px dashed maroon;
  margin-top:5px;
}
.newVersionMsg {
  padding:5px 0 5px 0;
  text-align:center;
  color:Yellow;
  background-color:Maroon;
  float:right;
  width:100%;
}
#updateSetContainer {
  padding:5px;
  float:right;
  width:100%;
}
#updateSetContainer p {
  cursor:pointer;
  font-size:12px;
  float:right;
  width:100%;
}
.resaleError {
  padding:5px;
  background-color:#F00;
}
.resaleConfirmation {
  padding:5px;
  background-color:#0F0;
}
.sellCollectibleMsg {
  font-family:Verdana,Helvetica,sans-serif;
  font-weight:bold;
  font-size:14px;
}
.groupBuildingGameText {
  font-size:16px;
  font-weight:bold;
  font-style:italic;
  line-height:24px;
}
#ProcessPurchase_Free,
#ProcessPurchase_Robux,
#ProcessPurchase_Tickets,
#ProcessRenew_Free,
#ProcessRenew_Robux,
#ProcessRenew_Tickets,
#ProcessROBLOXPurchase {
  margin:2.5em auto;
  display:none;
}
#Processing_Free,
#Processing_Robux,
#Processing_Tickets,
#Processing_FreeRenew,
#Processing_RobuxRenew,
#Processing_TicketsRenew,
.processingMsg {
  margin:0 auto;
  text-align:center;
  vertical-align:middle;
}
.createSetPanelPopup {
  width:400px;
  height:100%;
  padding:0;
  float:left;
  display:none;
}
.GetAFreeAccount:hover {
  background-position:0 56px;
}
.GetAFreeAccount {
  width:316px;
  height:56px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/getAFreeAccount.png);
}
.PlayAsGuest:hover {
  background-position:0 56px;
}
.PlayAsGuest {
  width:316px;
  height:56px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/playAsGuest.png);
}
.closeBtnCircle_35h:hover {
  background-position:0 35px;
}
.closeBtnCircle_35h {
  width:35px;
  height:35px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/closeBtnCircle_35h.png);
}
.closeBtnCircle_20h:hover {
  background-position:0 20px;
}
.closeBtnCircle_20h {
  width:20px;
  height:20px;
  cursor:pointer;
  margin-left:395px;
  position:absolute;
  top:5px;
  left:5px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-x.png);
}
.fblike {
  display:inline-block;
  float:left;
  background-color:White;
}
.btn-buynow {
  cursor:pointer;
  padding-top:10px;
  margin-left:135px;
  width:117px;
  height:40px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-buynow.png);
}
.btn-buynow:hover {
  background-position:0 50px;
}
.btn-buynow2 {
  width:127px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-buynow-2.png) no-repeat;
}
.btn-buynow2:hover {
  background-position:0 -50px;
}
.btn-cancel {
  width:96px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-cancel.png) no-repeat;
}
.btn-cancel:hover {
  background-position:0 -50px;
}
.btn-continueshopping {
  cursor:pointer;
  padding-top:10px;
  width:213px;
  height:40px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-continue_shopping.png);
}
.btn-continueshopping:hover {
  background-position:0 50px;
}
.btn-tradecurrency {
  cursor:pointer;
  width:200px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-trade_currency.png) no-repeat;
}
.btn-tradecurrency:hover {
  background-position:0 -50px;
}
.btn-sellnow {
  cursor:pointer;
  width:129px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-sell_now.png) no-repeat;
}
.btn-sellnow:hover {
  background-position:0 -50px;
}
.btn-buyrobux {
  cursor:pointer;
  width:159px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-buy_robux.png) no-repeat;
}
.btn-buyrobux:hover {
  background-position:0 -50px;
}
.RecommendationHeader2 {
  color:#666;
  font:bold 13px Arial,Helvetica,Sans-Serif;
  padding-left:5px;
}
.WideAspectRatio {
  font:bold 11px Arial,Helvetica,Sans-Serif;
  padding:0 7px;
  width:160px!important;
}
.WideAspectRatio .AssetThumbnail {
  background-color:#FFF;
  border:1px #000;
  height:100px;
  width:160px;
}
.WideAspectRatio .AssetDetails {
  overflow:hidden;
  padding:5px;
  height:90px;
  width:158px;
}
.WideAspectRatio .AssetName a {
  line-height:1.5em;
  vertical-align:top;
}
.RegisterBlueButton {
  background-image:url("/web/20120611211431im_/http://www.roblox.com/images/Buttons/Register-blue.png");
  height:20px;
  width:92px;
}
.RegisterBlueButton:hover {
  background-position:0 -20px;
  cursor:pointer;
}
.SignupRedButton {
  background-image:url("/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-signup.png");
  height:50px;
  width:111px;
}
.SignupRedButton:hover {
  background-position:0 -50px;
  cursor:pointer;
}
.DescriptionSeeMore {
  color:#00f;
  cursor:pointer;
}
.GenreInfo .GamesInfoIcon {
  display:inline-block;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/GenreIcons/GenreIconsSprite.png);
  width:16px;
  height:16px;
}
.SignupButtonBlue,
.SignupButtonBlue:hover {
  width:120px;
  height:50px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-sign_up-blue-lg.png) no-repeat top;
  margin:0 auto;
}
.SignupButtonBlue:hover {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-sign_up-blue-lg.png) no-repeat bottom;
}
.PlaceItemContainer .RecommendationHeader2 {
  text-align:left;
  width:247px;
}
#logo {
  width:155px;
  margin-left:15px;
  float:left;
}
#login {
  position:relative;
  margin:15px 24px 0 0;
  float:right;
  color:#fff;
  font-size:12px;
}
#loginButton {
  display:inline-block;
  cursor:pointer;
  padding:2px 2px 5px 0;
  background-position:bottom;
  position:relative;
}
#loginButton:hover {
  color:#d8e6fc;
}
#loginButton span {
  padding:2px 15px 5px 0;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/loginArrow.png) no-repeat 40px 7px;
}
#loginButton:hover span {
  background-position:40px -41px;
}
#loginBox {
  position:absolute;
  top:22px;
  right:0;
  color:#000;
  display:none;
  width:230px;
  background:#edeff3;
}
#loginButton.active {
  color:#00218c;
  background-color:#edeff3;
}
#loginButton.active span {
  background-position:40px -86px;
}
#loginBox fieldset {
  margin:0 0 5px 0;
  display:block;
  border:0;
  padding:0;
}
fieldset#body {
  padding:10px 15px;
  margin:0;
}
#loginBox #body fieldset label {
  display:block;
  float:none;
  margin:0;
}
#loginBox input {
  width:92%;
  border:1px solid #899caa;
  color:#3a454d;
  padding:3px 7px;
  font-size:12px;
}
#loginBox #loginSubmit {
  width:auto;
  float:right;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/login_btn.png) repeat-x;
  color:#fff;
  padding:3px 10px 3px 10px;
  border:1px solid #339cdf;
  margin:5px 0 5px 0;
  cursor:pointer;
  position:relative;
}
#loginBox #body fieldset a {
  color:#757d85;
  text-decoration:underline;
  font-size:12px;
}
#line {
  width:100%;
  height:1px;
  background:#0047ba;
}
#facebook_btn {
  width:230px;
  height:30px;
  margin:10px 0 0 0;
  background:#edeff3;
  text-align:center;
}
input:focus {
  outline:none;
}
#container {
  width:990px;
  margin:0 auto;
}
#videoContainer {
  width:950px;
  height:371px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/video_bg.png) no-repeat;
  margin:0 0 15px 16px;
  float:left;
}
#video {
  margin:6px 0 0 5px;
  float:left;
}
#link_text {
  width:280px;
  margin:150px 0 0 20px;
  float:left;
}
a.crossroads,
a.crossroads:visited {
  width:330px;
  height:298px;
  display:block;
  margin-right:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/crossroads.gif) bottom no-repeat;
  cursor:pointer;
  float:left;
}
a.crossroads:hover {
  background-position:top;
}
a.swordfight,
a.swordfight:visited {
  width:300px;
  height:298px;
  display:block;
  margin-right:10px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/swordfight.gif) bottom no-repeat;
  cursor:pointer;
  float:left;
}
a.swordfight:hover {
  background-position:top;
}
a.seemoregames,
a.seemoregames:visited {
  width:330px;
  height:298px;
  display:block;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/LandingGames/seeMoreGames.gif) bottom no-repeat;
  cursor:pointer;
  float:left;
}
a.seemoregames:hover {
  background-position:top;
}
#footer {
  font-size:12px;
  color:#457cb1;
  background-color:#75a6d8;
  margin:50px auto 0 auto;
  text-align:center;
}
.LinkCountContainer {
  width:200px;
  margin:0;
  padding:5px;
}
.LinkStatusImage {
  float:left;
}
#ManageAccountButton img,
#CancelButtonImg,
#ChangeCreditCardInfoImg {
  border:none;
}
#ManageAccountButton {
  text-align:center;
}
#GoTurboPopupPanel,
#TurnOffTurboPopupPanel {
  width:550px;
  text-align:center;
}
#CurrentAccountUpgrades {
  width:90%;
  margin:auto;
  text-align:center;
}
#CurrentAccountUpgrades table {
  border-collapse:collapse;
  margin-bottom:15px;
  text-align:center;
  background-color:#d0d6e0;
  width:225px;
  margin-left:auto;
  margin-right:auto;
}
#CurrentAccountUpgrades th {
  border-bottom:solid 1px #999;
  text-align:center;
}
.rightCellWall {
  border:1px solid #999;
}
.CancelBuildersClubMembership,
.ChangeCreditCardInfo {
  text-align:center;
  margin-top:5px;
}
#BCCompareModal {
  background-color:White;
  border:solid 2px #6e99c9;
  margin:5px;
  padding:10px;
}
#BuyBCComparePanelTopInfo {
  text-align:center;
  padding:10px 40px 10px 40px;
  width:340px;
}
.BuyBCComparePanelTable {
  font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif;
  font-size:12px;
  background:#fff;
  width:340px;
  margin:0 40px 0 40px;
  border-collapse:collapse;
  margin-bottom:15px;
}
.BCCompareHeaderRow {
  color:#2163A5;
  padding:10px 8px;
  border-bottom:1px solid #D3D3D3;
  text-align:left;
}
.BBCCompareRow td {
  color:#2163A5;
  border-bottom:1px solid #D3D3D3;
  padding-top:10px;
  padding-left:10px;
  padding-bottom:10px;
}
.BCCompareModalRow {
  width:130px;
  border-left:1px solid #000;
  border-right:1px solid #000;
  background-color:#DFEFFF;
}
#BCCompareButtons {
  text-align:center;
  width:340px;
  margin:0 40px 0 40px;
}
#upgrades-membership-options .leftBorder {
  border-left:1px solid #D3D3D3;
}
#upgrades-membership-options .odd #upgrades-membership-options .LeftText {
  text-align:left;
}
.daysConversion {
  color:Red;
}
.AspNet-Login input {
  font-size:1em;
}
.AspNet-Login label em {
  text-decoration:underline;
  font-style:normal;
}
.AspNet-Login .AspNet-Login-FailurePanel {
  color:#F00;
}
.AspNet-Login .AspNet-Login-UserPanel,
.AspNet-Login .AspNet-Login-PasswordPanel,
.AspNet-Login .AspNet-Login-RememberMePanel,
.AspNet-Login .AspNet-Login-SubmitPanel {
  padding:.25em .1em 0 0;
}
.AspNet-Login .AspNet-Login-UserPanel,
.AspNet-Login .AspNet-Login-PasswordPanel,
.AspNet-Login .AspNet-Login-SubmitPanel {
  text-align:left;
}
.AspNet-Login .AspNet-Login-UserPanel label,
.AspNet-Login .AspNet-Login-PasswordPanel label,
#PaneLogin .TextboxLabel {
  font-weight:bold;
}
.AspNet-Login .AspNet-Login-UserPanel input,
.AspNet-Login .AspNet-Login-PasswordPanel input {
  width:9em;
}
#PaneNewUser {
  float:right;
  width:170px;
  background-color:#dcdcdc;
  padding:0 22px 22px;
}
#PaneLogin {
  width:18em;
  padding:0;
}
#PaneLogin .AspNet-Login div {
  margin:10px;
}
#LoginView {
  border:solid 1px Black;
  width:150px;
  height:250px;
}
#LoginView h5 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  margin:0;
}
#LoginView #AlreadySignedIn {
  background-color:#eee;
}
#LoginView .Label {
  font-weight:bold;
}
#LoginView .Text {
  width:133px;
}
#LoginView .AspNet-Login {
  height:225px;
  background-color:#eee;
}
#LoginView .AspNet-Login .AspNet-Login-InstructionPanel,
#LoginView .AspNet-Login .AspNet-Login-HelpPanel,
#LoginView .AspNet-Login .AspNet-Login-UserPanel,
#LoginView .AspNet-Login .AspNet-Login-PasswordPanel,
#LoginView .AspNet-Login .AspNet-Login-RememberMePanel {
  padding:3px 5px 3px 5px;
  text-align:left;
}
#LoginView .AspNet-Login .AspNet-Login-SubmitPanel,
#LoginView .AspNet-Login .AspNet-Create-Account {
  padding:10px 5px 5px 10px;
  text-align:center;
}
#LoginView .AspNet-Login .AspNet-Login-PasswordRecoveryPanel {
  padding:5px 5px 5px 5px;
  text-align:center;
}
#LoginView .AspNet-Login .AspNet-Login-PasswordRecoveryPanel a {
  color:#999;
  font:normal 9px/normal Verdana,sans-serif;
  padding:5px 5px 5px 5px;
  text-align:center;
}
#LoginView .AspNet-Login .AspNet-Login-PasswordRecoveryPanel a:hover {
  color:Blue;
}
#Sidebars {
  float:right;
  width:250px;
}
#AlreadyRegistered,
#TermsAndConditions {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
  font:normal 12px/normal Verdana,sans-serif;
  margin-top:10px;
  padding:0 20px 10px 20px;
}
#AlreadyRegistered h3,
#TermsAndConditions h3 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-weight:bold;
  margin:0 -20px 0 -20px;
  padding:4px;
  text-align:center;
}
#TermsAndConditions {
  margin-top:20px;
}
.Registration {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
  float:left;
  margin-top:10px;
  width:620px;
}
.Registration h2 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-size:x-large;
  margin:0;
  text-align:center;
}
.Registration h3 {
  margin:10px 0 0 0;
  text-align:center;
}
.Registration fieldset {
  font-size:1.2em;
  margin:15px 0 0 0;
}
.Registration .TextBox {
  vertical-align:middle;
  width:150px;
}
.Registration .Label {
  vertical-align:middle;
}
.Registration #EnterUsername,
.Registration #EnterPassword,
.Registration #EnterEmail,
.Registration #EnterAgeGroup,
.Registration #EnterChatMode {
  margin:0 auto;
  width:80%;
}
.Registration .PasswordRow,
.Registration .ConfirmPasswordRow,
.Registration .EmailRow {
  height:5em;
  line-height:5em;
  padding:3px;
  text-align:right;
}
.Registration .UsernameRow {
  height:5em;
  line-height:5em;
  padding:3px;
  text-align:left;
}
.Registration .PasswordErrorMessage {
  font-size:11px;
  font-weight:bold;
}
.Registration .PasswordRow,
.Registration .ConfirmPasswordRow {
  height:3em;
  line-height:3em;
}
.Registration .AgeGroupRow,
.Registration .ChatModeRow {
  font-size:.9em;
  margin:10px 0 10px 100px;
}
.Registration .Confirm {
  margin:20px 0 20px 0;
  text-align:center;
}
.Registration .Validators {
  margin-left:9px;
}
.Registration .Legend {
  color:Blue;
  margin-left:9px;
}
.Registration .Suggestion {
  font:normal .8em/normal Verdana,sans-serif;
  padding-left:9px;
}
.Registration label {
  margin-right:5px;
}
.AgeOptions {
  margin:0 auto;
  margin-top:20px;
  width:490px;
}
.AgeOptions #Under13,
.AgeOptions #Over12 {
  margin:0;
  padding:0 20px;
  width:200px;
  text-align:center;
}
.AgeOptions #ParentAccount {
  margin:0;
  padding:0 0 0 40px;
  width:400px;
  text-align:center;
}
#AgeOptions .Label {
  text-align:center;
}
.MessageContainer .MultilineTextBox {
  min-height:50px;
}
.MessageContainer #AdsPane {
  float:left;
  width:160px;
}
.MessageContainer #MessagePane {
  float:left;
  margin:0 0 0 60px;
  width:650px;
}
.MessageContainer h3 {
  text-align:left;
  width:622px;
}
.MessageContainer #MessagePane .Buttons {
  width:622px;
}
.MessageContainer #MessagePane .Buttons .Button {
  margin:10px 0 0 10px;
  display:inline-block;
}
.MessageContainer .Label {
  font-weight:bold;
  padding:6px 0 3px 0;
}
.MessageContainer .MessageReaderContainer {
  border:solid 1px #000;
  padding:10px;
  width:95%;
}
.MessageReaderContainer #Message {
  text-align:left;
}
#Message #DateSent {
  text-align:left;
}
#Message #Author {
  margin:0;
  text-align:left;
}
#Message #Subject {
  display:inline-block;
  *display:inline;
  font-weight:bold;
  margin:0;
  text-align:center;
  overflow:hidden;
  width:350px;
  *zoom:1;
}
#Message .Body {
  text-align:left;
  vertical-align:top;
}
#MessageEditorContainer {
  border:solid 1px #000;
  padding:10px;
  width:95%;
}
.EmptyInbox {
  text-align:center;
  margin:20px 0;
}
.MessageEditor {
  text-align:left;
}
.MessageEditor #From {
  text-align:left;
  width:39%;
}
.MessageEditor #To {
  margin:5px 0 0 0;
  text-align:left;
  width:39%;
}
.MessageEditor .CannedResponsesPanel {
  background-color:#eee;
  border:solid 1px #000;
  margin:30px 0;
  width:200px;
}
.MessageEditor .CannedResponsesPanel h4 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  font-size:1.3em;
  margin:0;
  text-align:center;
  display:block;
}
.MessageEditor #CannedResponses {
  margin:0;
  padding:5px 0;
  width:200px;
}
.MessageEditor .CannedResponse {
  margin:0;
  padding:7px 5px;
  text-align:center;
  width:190px;
}
.MessageEditor #CannedResponses .Button {
  padding:3px 5px;
}
.MessageEditor .Body {
  text-align:left;
  vertical-align:top;
}
.MessageContainer #Confirmation h3 {
  text-align:left;
  width:422px;
}
.MessageContainer #Confirmation .Buttons {
  width:422px;
}
.MessageContainer #Confirmation #Message {
  border:solid 1px #000;
  padding:10px;
  width:95%;
}
.MessageReaderContainer #Message {
  float:left;
  text-align:left;
}
.ReportAbuse {
  position:relative;
  text-align:left;
}
.ReportAbuse .AbuseButton a {
  color:#F99;
  background:none;
  padding-left:16px;
  padding-bottom:2px;
}
.ReportAbuse .AbuseButton a:hover {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/abuse.png") no-repeat scroll 0 2px transparent;
  color:#F00;
}
.ReportAbuse img {
  display:none;
}
div.MyMoneyPage {
  *padding-top:10px;
  position:relative;
}
.MyMoneyPage ul {
  padding:0;
  *position:relative;
  *left:-40px;
}
.MyMoneyPage select {
  font-size:11px;
}
.MyMoneyPage .Ads_WideSkyscraper {
  float:right;
  text-align:right;
  width:160px;
}
.SquareTabGray {
  list-style:none;
  float:left;
  background-color:#D6D6D6;
  padding:7px;
  border:1px solid #9e9e9e;
  font:bold 15px arial;
  color:#363636;
  margin:4px 2px 0 1px;
  border-bottom-width:0;
  position:relative;
  top:2px;
}
.SquareTabGray a {
  text-decoration:none;
  color:#363636;
  cursor:pointer;
}
.SquareTabGray a:hover {
  text-decoration:none;
  background-color:#e9e9e9;
}
.SquareTabGray.selected a:hover {
  text-decoration:none;
  background-color:#fff;
}
.SquareTabGray:hover {
  background-color:#e9e9e9;
  cursor:pointer;
}
.SquareTabGray.selected,
.SquareTabGray.selected:hover {
  background-color:#fff;
  margin-top:0;
  padding:9px 7px 12px 7px;
  border-bottom:1px solid #fff;
  position:relative;
  top:1px;
  border-color:#ccc;
}
.StandardPanelContainer {
  position:relative;
  clear:both;
}
.StandardPanelContainer .StandardPanelWhite {
  background-color:#fff;
  position:relative;
  left:-5px;
  top:-1px;
  width:100%;
  *width:888px;
  padding:6px;
  margin-bottom:-6px;
}
.WhiteSquareTabsContainer {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Icons/MyMoney_fakeborderbg2.png') bottom repeat-x;
  width:100%;
  position:relative;
  left:-5px;
  padding:0 5px;
  display:inline-block;
}
.MyMoneyPage #TabsContentContainer {
  width:898px;
}
.MyMoneyPage div.TabContent {
  display:none;
  float:left;
  width:725px;
  position:relative;
}
.MyMoneyPage div.TabContent.selected {
  display:block;
}
.MyMoneyPage .tipsy {
  text-align:left;
}
.MyMoneyPage .BuyRobuxButton {
  position:absolute;
  right:10px;
  *right:18px;
  top:9px;
  *top:8px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-buyrobux.png') no-repeat left top;
  width:141px;
  height:34px;
}
.MyMoneyPage .BuyRobuxButton:hover {
  background-position:left -34px;
  cursor:pointer;
}
.MyMoneyPage .SortFilterLabel {
  font:12px arial;
  color:#000;
  font-weight:bold;
}
.MyMoneyPage .SortsAndFilters {
  margin:5px 0 7px 5px;
}
.MyMoneyPage .SortsAndFilters div {
  float:left;
}
.MyMoneyPage .roblox-avatar-image,
.MyMoneyPage td.Member div.Roblox {
  float:left;
}
.MyMoneyPage .roblox-avatar-image img,
.MyMoneyPage td.Member div.Roblox {
  width:24px;
  height:24px;
}
#Summary_tab .loading {
  position:absolute;
  top:0;
  left:0;
  background:#fff url('/web/20120611211431im_/http://www.roblox.com/images/Spinners/spinner100x100.gif') no-repeat center;
  width:100%;
  height:100%;
}
#Summary_tab .RobuxColumn,
#Summary_tab .TicketsColumn {
  float:left;
  background-color:#fff;
  margin:0 3px;
  width:355px;
  *width:352px;
}
#Summary_tab .RobuxColumn {
  padding-right:2px;
  *padding-right:6px;
  border-right:1px solid #ccc;
}
#Summary_tab table,
#Summary_tab table tr,
#Summary_tab table td,
#MyTransactions_tab table,
#MyTransactions_tab table tr,
#MyTransactions_tab table td {
  margin:0;
  padding:0;
}
#Summary_tab table td,
#MyTransactions_tab table td {
  padding:5px;
  border-top:1px solid #ccc;
  margin:0;
  float:left;
}
#Summary_tab table .header td,
#MyTransactions_tab table {
  border-top:1px solid #9e9e9e;
}
#Summary_tab tr.title td {
  border:none;
}
#Summary_tab tr.title td,
#Summary_tab tr.header td,
.MyMoneyPage .total td,
#MyTransactions_tab tr.header td {
  font-weight:bold;
  background-color:#f1f1f1;
}
#Summary_tab .RobuxColumn tr.title td {
  padding-left:23px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Icons/img-robux.png') no-repeat center left;
}
#Summary_tab .TicketsColumn tr.title td {
  padding-left:20px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Tickets.png?v=2') no-repeat center left;
}
#Summary_tab tr.title img {
  position:relative;
  top:1px;
}
#Summary_tab .total .money {
  font-weight:normal;
}
#Summary_tab table,
#MyTransactions_tab table {
  width:100%;
}
#Summary_tab td.Categories {
  width:177px;
}
#Summary_tab td.Debit,
#Summary_tab td.Credit {
  width:72px;
}
#Summary_tab .header td.Debit,
#Summary_tab .header td.Credit {
  width:71px;
}
#Summary_tab .header td.Debit {
  padding:0;
  width:83px;
}
#Summary_tab .header td.Debit span {
  border-left:1px solid #ccc;
  border-right:1px solid #ccc;
  display:block;
  width:71px;
  height:100%;
  padding:5px;
}
#Summary_tab .header td.Debit.NoBorder span {
  border-left:none;
  border-right:none;
}
#Summary_tab .total td {
  width:341px;
  border-top:1px solid #ccc;
  text-align:right;
}
#Summary_tab .RobuxColumn .total td {
  padding-top:9px;
}
#Summary_tab .total img {
  padding:0 3px;
  position:relative;
  top:2px;
}
#MyTransactions_tab .TransactionsContainer {
  clear:both;
}
#MyTransactions_tab .SortsAndFilters .Currency {
  padding-right:5px;
  border-right:1px solid #ccc;
}
#MyTransactions_tab .SortsAndFilters .Currency .SortFilterLabel {
  position:relative;
  top:-2px;
}
#MyTransactions_tab .SortsAndFilters .TimePeriod {
  margin-left:5px;
}
#MyTransactions_tab .SortsAndFilters .TimePeriod input {
  font-size:1em;
  height:1em;
  width:60px;
}
#MyTransactions_tab table {
  width:720px;
}
#MyTransactions_tab .header td {
  border-right:1px solid #CCC;
  border-top:none;
}
#MyTransactions_tab .header td.Amount {
  border-right:1px solid #F1F1F1;
}
#MyTransactions_tab td.Date {
  width:85px;
}
#MyTransactions_tab .datarow td.Date {
  width:86px;
}
#MyTransactions_tab td.Member {
  width:126px;
}
#MyTransactions_tab .datarow td.Member {
  width:126px;
}
#MyTransactions_tab td.Description {
  width:365px;
}
#MyTransactions_tab .datarow td.Description {
  width:367px;
}
#MyTransactions_tab td.Amount {
  width:100px;
}
#MyTransactions_tab .datarow td.Amount {
  padding-left:31px;
  width:75px;
}
#MyTransactions_tab td.Amount.Robux {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Icons/img-robux.png') no-repeat 10px 12px;
}
#MyTransactions_tab td.Amount.Tickets {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Tickets.png?v=2') no-repeat 10px 9px;
}
#MyTransactions_tab .Member span {
  padding-left:3px;
  top:4px;
  position:relative;
}
.MyMoneyPage td.Member div.Roblox {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Icons/roblox-icon-round-tiny.jpg') no-repeat top left;
}
#MyTransactions_tab .datarow .Date,
#MyTransactions_tab .datarow .Description,
#MyTransactions_tab .datarow .Amount {
  padding-top:10px;
}
#MyTransactions_tab .empty {
  width:710px;
  text-align:center;
}
#MyTransactions_tab .loading {
  background:#fff url('/web/20120611211431im_/http://www.roblox.com/images/Spinners/spinner100x100.gif') no-repeat center;
  height:150px;
  position:relative;
  width:710px;
}
#MyTransactions_tab .morerecords td {
  text-align:center;
  width:100%;
  border-top:none;
  padding-top:20px;
}
#MyTransactions_tab .morerecords td a:hover {
  cursor:pointer;
}
#ParentsContainer #BreadcrumbsContainer {
  margin-bottom:20px;
}
#ParentsContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0 0 20px 0;
}
#ParentsContainer #LeftColumn {
  float:left;
  padding:0 15px 0 0;
  width:400px;
}
#ParentsContainer #RightColumn {
  float:right;
  padding:0 0 0 15px;
  width:400px;
}
#ParentsContainer .ParentsSection {
  background-color:#fff;
  border:solid 1px #ccc;
  height:120px;
  margin-bottom:20px;
  padding:15px 15px;
  width:370px;
}
#ParentsContainer h3,
dt {
  color:Blue;
  font-family:Verdana,Sans-Serif;
  font-size:1.3em;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:1em;
}
#ParentsContainer .SectionIcon {
  float:left;
  margin-right:20px;
}
#ParentsContainer .PageImage {
  float:right;
}
.MyRobloxContainer .Column1a .StandardBox em {
  display:none;
  font-style:normal;
  position:absolute;
  z-index:2;
  background:#3B526B;
  color:#FFF;
  padding:3px;
  border:4px solid #C6D9FD;
  width:200px;
}
.MyRobloxContainer .Column1a .StandardBox ul li {
  padding:4px;
}
#partycontainer {
  bottom:110px;
  right:10px;
}
.partyWindow {
  color:#666;
  font-family:Verdana,Geneva,sans-serif;
  font-size:11px;
  width:250px;
}
.partyWindow .title {
  background:transparent url('/web/20120611211431im_/http://www.roblox.com/images/friendsbar/tab_blue19h_l.gif') no-repeat left top;
  display:block;
  text-decoration:none;
  padding-left:2px;
  height:19px;
  width:248px;
  cursor:pointer;
}
.partyWindow .title span {
  background:transparent url('/web/20120611211431im_/http://www.roblox.com/images/friendsbar/tab_blue19h_r.gif') no-repeat right top;
  display:block;
  height:15px;
  padding:2px 15px 2px 7px;
  text-decoration:none;
  color:#fff;
}
.partyWindow .title_flash {
  background:transparent url('/web/20120611211431im_/http://www.roblox.com/images/friendsbar/tab_white19h_l2.gif') no-repeat left top;
}
.partyWindow .title_flash span {
  background:transparent url('/web/20120611211431im_/http://www.roblox.com/images/friendsbar/tab_white19h_r2.gif') no-repeat right top;
  color:#444;
}
.partyWindow .title strong {
  display:block;
  padding:2px 15px 4px 6px;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/tab_blue21h_r.png") no-repeat right top;
  color:#fff;
  width:227px;
  font-weight:bold;
}
.partyWindow .closeparty {
  width:10px;
  height:9px;
  margin:5px 9px 0 0;
  cursor:pointer;
  position:absolute;
  right:0;
  top:0;
  color:#fff;
  font-weight:bold;
  font-size:14px;
}
.partyWindow .main {
  clear:both;
  width:248px;
  height:auto;
  margin:0;
  background:#f2f2f2;
  border:1px solid #a6a6a6;
  border-top:0 none;
  overflow:auto;
}
.partyWindow .kickuser {
  float:right;
  padding-right:5px;
  color:Red;
  cursor:pointer;
}
#new_party p {
  text-align:center;
  padding:40px 0 0 0;
}
#party_none .main .btn_green21h {
  margin:15px 0 0 77px;
}
.clear {
  clear:both;
}
.main #new_party_clear {
  padding:40px 0 0 0;
}
.btn_green21h {
  float:left;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_green21h_l.png") no-repeat left top;
  padding:0 0 0 2px;
}
.btn_green21h a {
  display:block;
  padding:2px 14px 4px 10px;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_green21h_r.png") no-repeat right top;
  color:White;
  font-family:verdana;
  font-weight:bold;
  text-decoration:none;
}
.btn_green21h:hover {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_green21h_over_l.png") no-repeat left top;
}
.btn_green21h:hover a {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_green21h_over_r.png") no-repeat right top;
}
.btn_red21h {
  float:left;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_red21h_l.png") no-repeat left top;
  padding:0 0 0 2px;
}
.btn_red21h a {
  display:block;
  padding:2px 14px 4px 10px;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_red21h_r.png") no-repeat right top;
  color:White;
  font-family:verdana;
  font-weight:bold;
  text-decoration:none;
}
.btn_red21h:hover {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_red21h_over_l.png") no-repeat left top;
}
.btn_red21h:hover a {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_red21h_over_r.png") no-repeat right top;
}
.btn_black21h {
  float:left;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_black21h_l.png") no-repeat left top;
  padding:0 0 0 2px;
  color:White;
}
.btn_black21h a {
  display:block;
  padding:2px 14px 4px 10px;
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_black21h_r.png") no-repeat right top;
  color:#FFF;
  font-family:verdana;
  font-weight:bold;
  text-decoration:none;
}
.btn_black21h:hover {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_black21h_over_l.png") no-repeat left top;
}
.btn_black21h:hover a {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/chat/btn_black21h_over_r.png") no-repeat right top;
}
.main h1 {
  padding:15px 20px 15px 20px;
  font-size:130%;
  text-align:center;
}
.main #invite_status {
  padding:10px 0 10px 0;
}
.main p {
  padding:0 0 7px 0;
}
.main .btn_green21h {
  float:left;
  margin:0 0 0 35px;
}
.main .btn_black21h {
  float:right;
  margin:0 35px 0 0;
}
.main #invite_clear {
  padding:15px 0 0 0;
}
dt {
  float:left;
}
dd {
  margin-left:30px;
}
.grey9 {
  color:gray;
  font-size:9px;
}
.status {
  color:gray;
  font-size:11px;
}
.name_me {
  font-weight:bold;
  color:#06c;
}
.name_other {
  font-weight:bold;
  color:#007b00;
}
.name_status {
  font-weight:bold;
}
.partyWindow {
  color:black;
  font-size:11px;
  height:auto;
}
.members dl {
  padding:0 0 0 5px;
}
.members dt {
  padding:4px 0 0 0;
}
.members dd {
  padding:4px 0 1px 0;
}
.main p {
  padding:10px 0 5px 0;
  text-align:center;
}
#chat_messages {
  padding:0 3px 3px 3px;
  margin:5px 5px 0 5px;
  height:217px;
  overflow:auto;
  background-color:white;
  border-style:solid;
  border-width:1px;
  border-color:#aaa;
}
#chat_messages li {
  padding:6px 0 0 0;
  list-style-type:none;
}
#party_game_thumb {
  width:75px;
  margin-right:5px;
  float:left;
}
#party_current_game {
  margin:5px;
}
#party_game_name {
  width:140px;
  float:left;
}
#party_game_follow_me {
  margin-top:5px;
}
#chat_input {
  margin:5px 5px 0 5px;
  padding-right:2px;
}
#chat_input input {
  border:1px solid #ccc;
  width:236px;
  height:40px;
}
#chat_input textarea {
  border:1px solid #aaa;
  overflow:auto;
  width:100%;
  height:50px;
}
.main #leader_clear {
  padding:15px 0 0 0;
}
#party_my .main .btn_black21h {
  margin:15px 70px 0 0;
}
.tbxPeople {
  color:gray;
  border-color:gray;
  font-style:italic;
}
.btnAdd {
  border:1px solid black;
  cursor:pointer;
}
.btnAdd :hover {
  background-color:Blue;
}
.pplList {
  overflow-y:auto;
  overflow-x:hidden;
  border:none;
  max-height:147px;
}
.pplList div img {
  margin-right:6px;
}
.PersonalServerRoleSet {
  width:195px;
  font-size:11px;
  float:left;
}
.PersonalServerRoleSet div {
  margin-bottom:5px;
  margin-top:5px;
}
.papCheckBox {
  margin-left:0;
}
.papListRemoveUserIcon {
  cursor:pointer;
  font-weight:bold;
  border:0;
  vertical-align:middle;
  height:13px;
  width:13px;
}
.papListRemoveUserName {
  margin-left:5px;
  font-size:12px;
  vertical-align:middle;
}
#PlaceAccessPrivileges .AccessSection {
  margin:5px;
}
#PlaceAccessPrivileges .AccessSection .header {
  font-size:12px;
  font-weight:bold;
  margin-top:5px;
}
#PlaceAccessPrivileges .AccessSection .subtext {
  font-size:11px;
  color:#888;
  font-style:italic;
  font-weight:normal;
}
#PlaceAccessPrivileges .AccessSection .main {
  font-size:12px;
  margin-top:8px;
}
#PlaceAccessPrivileges .AccessSection select {
  width:150px;
}
#PlaceAccessPrivileges .divider {
  background-color:#ccc;
  height:1px;
  margin-bottom:12px;
}
.GuestPlayAvatarImage {
  border:solid 3px green;
}
.GuestPlayAvatarImage:Hover {
  border:solid 3px #0C0;
}
#ConfigurePlaceContainer {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
  margin:0 auto;
  width:620px;
}
#ConfigurePlaceContainer h2 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-size:x-large;
  margin:0;
  text-align:center;
}
#ConfigurePlaceContainer fieldset {
  font-size:1.2em;
  margin:0;
}
#ConfigurePlaceContainer #PlaceName {
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#ConfigurePlaceContainer #PlaceThumbnail {
  border:solid 1px #555;
  height:230px;
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#ConfigurePlaceContainer #PlaceDescription {
  margin:0 auto;
  margin-top:10px;
  padding:0;
  text-align:left;
  width:420px;
}
#ConfigurePlaceContainer #PlaceAccess,
#ConfigurePlaceContainer #PlaceCopyProtection,
#ConfigurePlaceContainer #Comments,
#ConfigurePlaceContainer #PlaceIsDefault,
#ConfigurePlaceContainer #PlaceReset,
#ConfigurePlaceContainer #AllowGear,
#ConfigurePlaceContainer #SetGenres,
#ConfigurePlaceContainer #PlaceBuildAccess {
  margin:0 auto;
  margin-top:10px;
  width:420px;
}
#ConfigurePlaceContainer .PlaceAccessRow,
#ConfigurePlaceContainer .CopyProtectionRow,
#ConfigurePlaceContainer .EnableCommentsRow,
#ConfigurePlaceContainer .PlaceIsDefaultRow,
.MyItemIndentedOption {
  font-size:.9em;
  margin:10px 0 10px 100px;
}
#ConfigurePlaceContainer .ResetPlaceRow {
  font-size:.9em;
  margin:10px 0;
  text-align:center;
}
#ConfigurePlaceContainer .ResetPlaceRow .Button {
  margin:0 auto;
}
#ConfigurePlaceContainer .Buttons {
  margin:0 auto;
  margin-top:10px;
  margin-bottom:10px;
  text-align:center;
}
#ConfigurePlaceContainer .Button {
  border-color:#555;
  color:#555;
  cursor:pointer;
}
#ConfigurePlaceContainer .Button:hover {
  background-color:#6e99c9;
  color:#fff;
}
#ConfigurePlaceContainer .Label {
  font-size:1.2em;
  margin:0;
  padding:0;
}
#ConfigurePlaceContainer .TextBox {
  border:dashed 1px #555;
  margin:0;
  padding:5px 10px;
  width:400px;
}
#ConfigurePlaceContainer .MultilineTextBox {
  border:dashed 1px #555;
  margin:0;
  padding:5px 10px;
  width:400px;
}
#ConfigurePlaceContainer .Suggestion {
  font:normal .8em/normal Verdana,sans-serif;
  padding-left:9px;
}
#ConfigurePlaceContainer .popupControl {
  border-color:#000;
}
#ConfigurePlaceContainer .PopUpOption {
  font:normal .8em/normal Verdana,sans-serif;
  padding:4px;
}
#ConfigurePlaceContainer .PopUpInstruction {
  font:normal 1.1em/normal Verdana,sans-serif;
  padding:4px;
  text-align:center;
}
#Place_PlacePanel {
  float:left;
  width:490px;
  margin-right:10px;
}
#Place_AuthorPanel {
  float:left;
  width:200px;
}
#Place_GamesPanel {
  margin-top:10px;
  width:700px;
  clear:left;
}
#ConfigureShowcase {
  font-family:Verdana,sans-serif;
}
#ConfigureShowcase h2 {
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0;
  padding:0;
}
#ConfigureShowcase .CallbackStyle {
  border:thin blue inset;
}
#ConfigureShowcase .DragHandle {
  width:161px;
  height:101px;
  cursor:move;
  border:outset 1px white;
}
#ConfigureShowcase .ItemArea {
  float:left;
  font-size:1.2em;
  height:82px;
  padding:10px;
  text-align:left;
  width:500px;
}
#ConfigureShowcase .ActionsArea {
  float:left;
  font-weight:bold;
  height:82px;
  padding:10px;
  text-align:right;
  width:155px;
}
#ConfigureShowcase .ReorderCue {
  border:dashed thin black;
  width:100%;
  height:101px;
}
#ConfigureShowcase ul,
#ConfigureShowcase ol {
  margin:0;
}
#ConfigureShowcase li {
  background:#EEE;
  border:solid 1px #000;
  color:#000;
  list-style:none;
  margin:3px 0;
  width:100%;
}
#ConfigureShowcase blockquote li {
  border-style:none;
  list-style-type:circle;
  margin-left:20px;
}
.ABGuestPlayAvatarImage {
  padding-top:5px;
}
.ABImageSelected {
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/img-check.png) no-repeat;
  position:absolute;
  height:35px;
  width:33px;
  right:-3px;
  top:-7px;
}
.ABCloseCircle {
  cursor:pointer;
  position:absolute;
  top:-10px;
  right:-10px;
}
.ABPopUp {
  background-color:#fff;
  width:516px;
  height:470px;
  font-family:Arial,Sans-Serif;
}
.ABPopUpHeader {
  height:30px;
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/bg-gutter.png) repeat-x;
  font:9px Arial;
  color:#404040;
  text-decoration:none;
}
.CurvedBanner {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/head_bkg_t1.png) no-repeat left top;
  display:inline-block;
  float:left;
  position:relative;
  height:28px;
  width:3px;
  top:0;
  margin-left:4px;
}
.HeaderBanner {
  margin:0;
  top:0;
  float:left;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/head_bkg_t2.png) no-repeat scroll right top transparent;
  display:inline-block;
  height:28px;
  padding:6px 0 0 4px;
  width:128px;
}
.HeaderBanner a {
  color:#fff;
  height:18px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/btn_blue18h.png) repeat-x;
  background-position:0 0;
  margin:0 5px;
  font-weight:bold;
  font-size:10px;
  padding:2px 5px;
  cursor:pointer;
}
.HeaderBanner a:hover {
  color:#fff;
  background-position:0 -18px;
  text-decoration:none;
}
.ABPopUpBody {
  height:300px;
  text-align:center;
  padding:30px 40px 30px 40px;
  position:relative;
}
.BodyHeaderText {
  font:bold 18px Arial;
  display:inline-block;
  padding-bottom:15px;
}
.Avatars {
  height:125px;
  width:115px;
  position:relative;
  cursor:pointer;
}
.Avatars span {
  font:bold 14px Arial;
}
.UnselectedAvatar {
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/bg-character.png) no-repeat top center;
}
.SelectedAvatar,
.UnselectedAvatar:hover {
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/bg-character.png) no-repeat center bottom;
}
.ABPopUpFooter {
  height:79px;
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/bg-gutter.png) repeat-x;
  padding:0 10px 0 10px;
}
.SecureImgs {
  margin-top:7px;
  background:#fff;
  float:left;
  border:1px solid #404040;
  font:13px Arial;
  color:#404040;
  text-align:center;
  width:220px;
  padding:5px;
}
.ABPopUpFooter .SecureImgs span {
  display:inline-block;
  padding-bottom:10px;
}
.ABPopUpFooter a,
.ABPopUpFooter a:hover {
  text-decoration:none;
}
.Message {
  margin-top:12px;
  float:right;
  width:200px;
  font:12px Arial;
  color:#404040;
  text-align:left;
  padding:0;
}
.ABDownloadButton,
.ABPlayButton {
  width:300px;
  margin:auto;
  margin-top:60px;
  cursor:pointer;
  height:54px;
}
.ABDownloadButton {
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/btn-download.png) no-repeat top center;
}
.ABPlayButton {
  background:transparent url(/web/20120611211431im_/http://www.roblox.com/images/btn-play.png) no-repeat top center;
}
.ABPlayButton:hover,
.ABDownloadButton:hover {
  background-position:center bottom;
}
#DownloadText {
  font:13px Arial;
  color:#404040;
  display:inline-block;
  padding-top:3px;
}
.PlaceLauncherStatus {
  color:#333;
  display:none;
  font-size:16px;
  font-weight:bolder;
  line-height:19px;
}
.PlaceLauncherStatusBackBuffer {
  position:relative;
  display:none;
}
.CancelPlaceLauncherButton {
  background-color:White;
  border:none;
  color:Blue;
  cursor:pointer;
  font-size:12px;
}
.CancelPlaceLauncherButton:Hover,
.CancelPlaceLauncherButton:Active {
  background-color:White;
  border:none;
  color:Blue;
  cursor:pointer;
  text-decoration:underline;
}
.PlaceLauncherModal {
  border:none;
  color:Black;
  height:125px;
  margin:1.5em;
  padding:10px;
  text-align:center;
  width:360px;
}
#FeaturedGameButtonContainer,
#FeaturedGameButtonContainerABTest {
  border:none;
  width:330px;
  height:267px;
}
.FeaturedGameButton {
  cursor:pointer;
  position:absolute;
  right:60px;
  top:28px;
}
.FeaturedGameButtonABTest,
.FeaturedGameButtonABTest:hover {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/buttons/playRoblox01.png);
  background-position:0 0;
  background-repeat:no-repeat;
  position:absolute;
  top:20px;
  right:65px;
  height:214px;
  width:215px;
  cursor:pointer;
}
.FeaturedGameButtonABTest:hover {
  background-position:0 -214px;
}
.VisitButtonsGuestCharacter {
  display:inline-block;
  *display:inline;
  padding:10px 5px;
  cursor:pointer;
}
legend span {
  color:#777;
  line-height:6px;
}
#EditProfileContainer {
  background-color:#eee;
  border:solid 1px #000;
  color:#555;
  margin:0 auto;
  width:620px;
}
#EditProfileContainer h2 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-size:x-large;
  margin:0;
  text-align:center;
}
#EditProfileContainer h3 {
  text-align:center;
}
#EditProfileContainer fieldset {
  font-size:1.2em;
  margin:15px 0 0 0;
}
#EditProfileContainer .MultilineTextBox {
  width:250px;
}
#EditProfileContainer .TextBox {
  vertical-align:middle;
  width:150px;
}
#EditProfileContainer .Label {
  vertical-align:middle;
}
#EditProfileContainer #Confirmation {
  border:dashed 1px #f00;
  background-color:#ccc;
  color:#f00;
  font-family:Verdana,Sans-Serif;
  margin:0 auto;
  margin-top:10px;
  padding:10px 5px;
  text-align:center;
  width:410px;
}
#EditProfileContainer #AgeGroup,
#EditProfileContainer #ChatMode,
#EditProfileContainer #PrivacyMode,
#EditProfileContainer #ResetPassword,
#EditProfileContainer #Blurb {
  margin:0 auto;
  width:60%;
}
#EditProfileContainer #EnterEmail {
  margin:0 auto;
  width:60%;
  text-align:left;
}
#EditProfileContainer .Buttons {
  margin:20px 0 20px 0;
  text-align:center;
}
#EditProfileContainer .AgeGroupRow,
#EditProfileContainer .ChatModeRow {
  font-size:.9em;
  margin:10px 0 10px 100px;
}
#EditProfileContainer .ResetPasswordRow {
  margin:10px 0;
  text-align:center;
}
#EditProfileContainer .BlurbRow {
  padding:10px 4px 10px 4px;
  text-align:right;
}
#EditProfileContainer .Legend {
  color:Blue;
  margin-left:9px;
}
#EditProfileContainer .Suggestion {
  font:normal .8em/normal Verdana,sans-serif;
  padding-left:9px;
}
#EditProfileContainer .Validators {
  margin-left:9px;
}
.FrontPagePanel {
  float:left;
  border:solid 1px black;
  margin:5px;
  background-color:White;
}
#SignInPane {
  border:none;
  margin-left:0;
  width:152px;
  height:250px;
}
#Movie {
  width:424px;
  height:250px;
}
#FrontPageRectangleAd {
  margin:5px 0 5px 5px;
  width:300px;
  height:250px;
  background-color:Transparent;
}
#SalesPitch {
  margin-left:0;
  width:586px;
  height:90px;
}
#WhatsNew {
  margin-left:0;
  width:586px;
  height:280px;
}
#RandomFacts {
  float:right;
  margin-right:0;
  width:300px;
  height:150px;
}
.RandomFactoid {
  text-align:center;
  height:32px;
  width:290px;
  padding:2px;
  overflow:hidden;
}
#marqueecontainer {
  position:relative;
  width:300px;
  height:100px;
  background-color:white;
  overflow:hidden;
}
.RandomFactoid img {
  float:left;
}
#ParentsCorner {
  margin-right:0;
  width:300px;
  height:220px;
  _height:240px;
}
#ParentsCorner #Inside {
  padding:10px;
}
.ShieldImage {
  float:left;
  padding:5px;
}
.TrusteeSeal {
  float:left;
  width:140px;
  padding:5px;
}
#NewsFeeder {
  margin-right:0;
  width:158px;
}
#FrontPageBannerAd {
  margin-left:0;
  width:728px;
  height:90px;
  background-color:Transparent;
}
.BadAdButton {
  background-color:Transparent;
  border:0;
  font-size:.8em;
  z-index:100;
  font-family:Verdana;
  padding:0;
  position:relative;
  text-align:center;
  height:8px;
  top:-1px;
  right:0;
}
.BadAdButton:hover {
  background-color:#fff;
  border:solid 1px #000;
  text-decoration:none;
}
.Revised .VisitButtonGirlGuest,
.Revised .VisitButtonBoyGuest,
.Revised .VisitButtonGirlGuest:hover,
.Revised .VisitButtonBoyGuest:hover {
  width:180px;
  background-repeat:no-repeat;
  height:228px;
  display:inline-block;
  padding:0;
}
.Revised .VisitButtonGirlGuest {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/AB-female_character.jpg);
  background-position:center;
}
.Revised .VisitButtonBoyGuest {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/AB-male_character.jpg);
  background-position:center;
  margin-right:25px;
}
.Revised .VisitButtonGirlGuest:hover {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/AB-female_character.jpg);
  background-position:bottom;
}
.Revised .VisitButtonBoyGuest:hover {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/AB-male_character.jpg);
  background-position:bottom;
  margin-right:25px;
}
.Revised .Title {
  text-align:center;
  color:#333;
  font-size:24px;
  font-weight:bold;
  padding:5px 0;
}
.RevisedCharacterSelectBody {
  background-color:#fff;
  padding:10px;
}
.RevisedCharacterSelectSignup {
  width:72px;
  height:20px;
  float:left;
}
.RevisedCharacterSelectSignup {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/sign_up_small.png);
  background-position:top;
}
.RevisedCharacterSelectSignup:hover {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/sign_up_small.png);
  background-position:bottom;
}
.Revised .HaveAccount {
  float:right;
  color:#095fb5;
  font-family:Arial;
  font-size:14px;
  cursor:pointer;
}
.Revised.GuestModePromptModal {
  width:475px;
  border:2px solid #333;
  padding:0 5px 5px 5px;
  background-color:#e1e1e1;
}
.RevisedFooter {
  height:38px;
  width:90%;
  margin:0 auto;
  border-top:1px solid #e1e1e1;
  text-align:center;
}
textarea {
  resize:none;
}
#MySets_Tab,
#SubscribedSets_Tab {
  float:left;
}
#SetsContainer {
  margin:15px;
}
#SetsPane {
  position:relative;
  top:-2px;
  clear:both;
  min-height:300px;
  color:#000;
}
#SelectedSetDescription a {
  color:#095fb5;
}
#SetsPane.StandardBox {
  background:var(--standardBox_01_bkg) top repeat-x white;
}
#SetsList a {
  color:#000;
}
#SetInfoPane {
  float:left;
  margin:5px 5px 20px 5px;
  *margin:5px 5px 10px 5px;
  width:675px;
  position:relative;
}
#DeleteUnsubscribe_delete,
#DeleteUnsubscribe_unsubscribe,
#EditButtonDiv,
#SortButtonDiv,
.setspage_subscribe_btn {
  position:relative;
  float:left;
  font-size:11px;
  margin-left:5px;
  top:8px;
  *top:0;
}
#EditButtonDiv {
  margin-left:0;
  clear:left;
  *margin-left:5px;
}
#DeleteUnsubscribe_delete a,
#DeleteUnsubscribe_unsubscribe a,
#EditButtonDiv a,
#SortButtonDiv a,
.setspage_subscribe_btn a {
  *line-height:2.5em;
}
#DeleteUnsubscribe_delete a:hover,
#DeleteUnsubscribe_unsubscribe a:hover,
#EditButtonDiv a:hover,
#SortButtonDiv a:hover,
.setspage_subscribe_btn a:hover {
  *border:1px solid #000;
  *background-color:#6e99c9;
  *text-decoration:underline;
}
.setspage_subscribe_btn {
  top:4px;
}
.ReportAbusePanel {
  float:right;
  clear:right;
  margin:8px;
  font-size:11px;
}
.AbuseButton a {
  color:#000;
}
#SetsPane #DeleteUnsubscribe_delete a:hover,
#SetsPane #DeleteUnsubscribe_unsubscribe a:hover,
#EditButtonDiv a:hover,
#SortButtonDiv a:hover,
.setspage_subscribe_btn a:hover {
  cursor:pointer;
}
.SetNameLong {
  font-size:15px;
  font-weight:bold;
  padding:0;
  padding-bottom:5px;
  float:left;
}
#SetInfoPane .SetIcon {
  float:left;
}
#SetInfoPane .SetInfo {
  float:left;
  padding-left:10px;
}
#SetSubscribersOwner {
  font-size:11px;
  font-style:italic;
  position:relative;
  top:3px;
  float:left;
  margin-left:10px;
}
#SelectedSetDescription {
  float:left;
  clear:left;
  padding:5px;
  padding-left:0;
  width:400px;
  overflow:hidden;
  word-wrap:break-word;
}
#SetsList {
  overflow:auto;
  background:#E8E8E8;
  border:1px solid #AAA;
}
#AssetSetItemsContainer {
  float:left;
  width:685px;
}
#AssetSetItems {
  min-height:300px;
  text-align:center;
  position:relative;
}
#horizontal-rule {
  width:685px;
  float:left;
}
#SetsListContainer {
  float:left;
  width:150px;
  text-align:center;
  margin:5px;
  position:relative;
}
#SetDescriptionDiv {
  position:absolute;
  width:220px;
}
#SetDescriptionDiv_content {
  min-height:25px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/setspop_header.png') no-repeat;
  padding:10px;
  padding-left:25px;
}
#SetDescriptionDiv_footer {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/setspop_footer.png');
  height:7px;
}
.content.left {
  float:left;
  width:80px;
}
.content.right {
  float:left;
  width:380px;
  padding:0 10px;
}
.SetList-Set {
  margin:0;
  list-style-type:none;
  width:100%;
  overflow:hidden;
  padding-bottom:5px;
  height:35px;
}
.SetList-Set:hover {
  cursor:pointer;
}
.SetList-SetContainer {
  clear:both;
  padding:5px 13px;
  position:relative;
}
.SetList-SetContainer img {
  margin-right:5px;
  background-color:#fff;
}
.SetList-SetContainer div {
  float:left;
}
.SetList-SetContainer .name {
  text-decoration:none;
  font-size:11px;
  text-align:left;
  float:left;
  position:relative;
  top:6px;
  width:85px;
}
.SetList-SetContainer .name a:hover {
  text-decoration:none;
}
.SetList-SetContainer .deleteunsubscribe {
  font-size:11px;
  text-align:right;
  font-weight:normal;
  position:absolute;
  left:47px;
  top:23px;
}
.SetList-Set.selected {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/gamesPage_filterArrow.png') no-repeat 3px center;
  font-weight:bold;
}
.SetList-Set:hover {
  background-color:#fff;
}
#SetsList ul {
  margin:0;
  padding:0;
}
#CreateFind_Button {
  position:relative;
  margin-bottom:10px;
  height:50px;
  width:150px;
  float:right;
}
#CreateFind_Button.create {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/sets_btn_create.png');
}
#CreateFind_Button.create:hover {
  background-position:left 50px;
  cursor:pointer;
}
#CreateFind_Button.find {
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/sets_btn_find.png');
}
#CreateFind_Button.find:hover {
  background-position:left 50px;
  cursor:pointer;
}
#CreateFind_Button a {
  width:140px;
}
#HasNoSubscribedSetsPanel,
#HasNoOwnedSetsPanel {
  text-align:center;
  width:100%;
}
#SetUrlDiv {
  text-align:center;
  font-size:11px;
  padding:15px;
}
.editSetPanelPopup {
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width:100%;
}
.editSetPanelPopup .mask {
  background:#fff;
  -moz-opacity:.50;
  filter:alpha(opacity=50);
  opacity:.50;
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width:100%;
}
.Paging_Input {
  width:20px;
  text-align:center;
  font-size:12px;
}
#editSetContainerDiv .sort-msg {
  width:100%;
  clear:both;
  text-align:center;
  font-style:italic;
  position:relative;
  top:20px;
}
.ButtonDiv {
  text-align:right;
  float:right;
  position:relative;
}
.ButtonDiv.bottom {
  float:none;
  text-align:center;
}
#NameDisplay {
  font-weight:bold;
  font-style:italic;
}
#MoreDescButton:hover {
  cursor:pointer;
}
#PagingContainerDivTop,
#PagingContainerDivBottom {
  text-align:center;
  margin:5px 0 0 0;
}
#PagingContainerDivBottom {
  margin:5px 0 5px 0;
}
#PagingContainerDivTop div,
#PagingContainerDivBottom div {
  display:-moz-inline-stack;
  display:inline-block;
  zoom:1;
  *display:inline;
}
.paging_pagenums_container a {
  padding:0 3px;
}
.paging_previous:hover {
  cursor:pointer;
  background-position:left 77px;
}
.paging_next:hover {
  cursor:pointer;
  background-position:left 125px;
}
.paging_pagenums_container .selected {
  font-weight:bold;
}
.paging_previous,
.paging_next {
  height:24px;
  width:24px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/blue_arrow_btns_sprite.png');
  background-position:left top;
}
.paging_previous {
  background-position:left 101px;
}
.paging_previous.disabled {
  background-position:left 29px;
  cursor:default;
}
.paging_next.disabled {
  background-position:left 53px;
  cursor:default;
}
.paging_wrapper {
  position:relative;
  top:-6px;
  *top:-3px;
  margin:0 10px;
}
.paging_wrapper input {
  *position:relative;
  *top:1px;
}
#AssetSetItems .item {
  width:115px;
  height:140px;
  float:left;
  margin:10px;
  border:1px solid #E5E5E5;
  position:relative;
  text-align:center;
  z-index:500;
}
.item .link_container {
  overflow:hidden;
  width:110px;
  height:140px;
  display:inline-block;
}
#AssetSetItems .setitem_options {
  position:absolute;
  top:2px;
  right:2px;
  display:none;
  height:20px;
  width:20px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/btn-gear_sprite.png') left -1px;
}
#AssetSetItems .setitem_options:hover {
  background-position:left bottom;
  cursor:pointer;
  display:none;
}
#AssetSetItems .setitem_options:hover {
  display:block;
}
#AssetSetItems .item:hover .setitem_options,
#AssetSetItems .setitem_options.true,
#AssetSetItems .setitem_options.true2 {
  display:block;
}
.setitem_options .spacer {
  position:absolute;
  top:0;
  right:-2px;
  width:115px;
  height:75px;
  display:none;
  background:#fff;
  opacity:0;
  -ms-filter:â€œalpha(opacity=0)â€;
  filter:alpha(opacity=0);
  -khtml-opacity:0;
  -moz-opacity:0;
}
.setitem_options .container.outer {
  position:absolute;
  top:20px;
  right:-2px;
  width:115px;
  overflow:hidden;
  display:none;
}
.setitem_options .container.inner {
  position:relative;
  text-align:left;
  border:1px solid #aaa;
  background-color:#fff;
  top:-75px;
  font-size:11px;
}
#AssetSetItems .item:hover {
  background-color:#F5F5F5;
  border-color:#C2C2C2;
}
#AssetSetItems .link_container.handle:hover {
  cursor:move;
}
#AssetSetItems .item a {
  text-decoration:none;
  color:#000;
}
#AssetSetItems .item img {
  width:100px;
  height:100px;
  margin-top:8px;
}
#PrivateSetText {
  position:relative;
  top:9px;
  left:38%;
}
.PagingIndicators {
  font-size:18px;
  font-weight:bold;
  letter-spacing:-.1em;
  vertical-align:middle;
  cursor:pointer;
  display:none;
}
.newVersionInfo {
  position:absolute;
  top:94px;
  left:0;
  font-size:10px;
  text-align:center;
  width:100%;
  height:10px;
  z-index:400;
}
.NewVersionInfo:hover {
  text-decoration:none;
}
.newversion_banner {
  height:14px;
  width:93px;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Sets/update_available.png') top left no-repeat;
  position:absolute;
  top:5px;
  left:3px;
}
.NewVersionDropDown {
  position:absolute;
  border:1px solid gray;
  background-color:#fff;
  display:none;
  width:113px;
  z-index:900;
}
.NewVersionDropDownItem {
  display:block;
  cursor:pointer;
  width:100%;
  padding:2px;
}
.NewVersionDropDownItem:hover {
  background-color:#6e99c9;
  color:#fff;
}
.SetsPagePopupContainer {
  background-color:#fff;
  padding:1px 20px;
}
.SetsPagePopupContainer p {
  margin:0;
  padding:0;
  margin-top:10px;
}
.SetsPagePopupContainer textarea {
  width:355px;
  height:100px;
  resize:none;
}
.CreateEditSetTitle,
.MoveItemModalTitle {
  text-align:center;
  font-size:16px;
  font-weight:bold;
  padding:10px 10px 0 10px;
}
.moveItemContainerDiv {
  text-align:center;
  width:380px;
  padding:20px 10px;
  float:left;
}
#SetsPane .loading {
  width:688px;
  height:99%;
  position:absolute;
  top:0;
  right:0;
  background-color:white;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/Spinners/spinner100x100.gif') center no-repeat #fff;
  margin:5px;
  z-index:5000;
  opacity:.75;
  -ms-filter:â€œalpha(opacity=75)â€;
  filter:alpha(opacity=75);
  -khtml-opacity:.75;
  -moz-opacity:.75;
}
.Centered {
  margin-left:auto;
  margin-right:auto;
}
.ShadowedStandardBox {
  position:relative;
  z-index:0;
  _padding-bottom:6px;
  _overflow-y:hidden;
  margin-bottom:10px;
}
.ShadowedStandardBox .Header {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/HeaderGradientW800.png) repeat-y top left;
  text-align:center;
  color:White;
  height:20px;
  line-height:20px;
  font-size:15px;
  font-weight:bold;
  display:block;
  position:relative;
  z-index:0;
  white-space:nowrap;
}
.ShadowedStandardBox .Content {
  position:relative;
  z-index:0;
  border:2px solid #6e99c9;
  background-color:White;
  height:100%;
  _height:3000px;
  padding:10px 10px 10px 10px;
}
.Shadow {
  display:block;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/ShadowAlpha.png) no-repeat bottom right!important;
  background:#D3DEFF;
  height:100%;
  _height:3000px;
  width:100%;
  position:absolute;
  top:6px;
  left:6px;
  z-index:-1;
}
.ShadowedStandardBox .Button {
  cursor:pointer;
  background-color:#B6CCE4;
  color:#435D77;
  text-decoration:none;
  border:solid 1px #ccc;
  padding:3px 10px 3px 10px;
  font-family:Verdana;
  font-size:10px;
  font-weight:bold;
  text-align:center;
  white-space:nowrap;
}
.ShadowedStandardBox .Button:link,
.ShadowedStandardBox .Button:visited {
  background-color:#B6CCE4;
  color:#435D77;
  text-decoration:none;
}
.ShadowedStandardBox .Button:hover,
.ShadowedStandardBox .Button:active {
  background-color:#5F84A8;
  color:White;
  text-decoration:none;
}
.OutlineBox {
  z-index:0;
  position:relative;
  margin-top:16px;
  padding-top:14px;
  margin-bottom:10px;
  border:solid 2px #B6CCE4;
}
.OutlineBox .OB_HeaderPositioner {
  z-index:1;
  position:absolute;
  top:-16px;
  left:0;
  width:100%;
}
.OutlineBox .OB_Header {
  z-index:1;
  display:block;
  width:90%;
  margin-left:auto;
  margin-right:auto;
  background-color:White;
  border:solid 2px #B6CCE4;
  text-align:center;
  font-size:18px;
  font-weight:bold;
  padding:2px 2px 2px 2px;
}
.OutlineBox .OB_Content {
  padding-top:5px;
}
#InviteAFriendContainer {
  margin-top:10px;
}
#InviteAFriendContainer h3 {
  margin:0 auto;
  padding:0 0 10px 0;
  text-align:left;
  width:700px;
}
#InviteAFriendContainer #Exposition {
  margin:0 auto;
  padding:0 0 10px 0;
  width:700px;
}
#InviteAFriendContainer .Button {
  border:solid 1px #000;
  color:#000;
  font-family:Verdana,Sans-Serif;
  margin:0 0 0 10px;
  padding:3px 10px 3px 10px;
  text-decoration:none;
}
#InviteAFriendContainer .MultilineTextBox {
  border:2px solid #CCC;
  font-family:Arial,Sans-Serif;
  line-height:1.5em;
  padding:5px 5px 5px 5px;
  width:92%;
}
#InviteAFriendContainer .TextBox {
  border:2px solid #CCC;
  font-family:Arial,Sans-Serif;
  padding:5px 5px 5px 5px;
  width:92%;
}
#InviteAFriendContainer .Label {
  font-weight:bold;
}
#InviteAFriendContainer #InvitationElements {
  margin:0 auto;
  padding:5px 5px 5px 5px;
  width:688px;
}
#InviteAFriendContainer #Name,
#InviteAFriendContainer #Recipients,
#InviteAFriendContainer #Message {
  margin:15px 0 0 0;
}
#InviteAFriendContainer .FormLabel {
  float:left;
  width:94px;
}
#InviteAFriendContainer .FormField {
  float:left;
  width:317px;
}
#InviteAFriendContainer .FormNotes {
  float:right;
  font-family:Verdana;
  font-size:xx-small;
  width:277px;
  text-align:left;
}
#InviteAFriendContainer #Confirmation h3 {
  margin:0 auto;
  text-align:left;
  width:400px;
}
#InviteAFriendContainer #Confirmation #Message {
  border:solid 1px #000;
  margin:0 auto;
  padding:10px 10px 10px 10px;
  width:380px;
}
#InviteAFriendContainer #Confirmation .Buttons {
  margin:0 auto;
  width:400px;
}
#ShareRobloxRibbon {
  margin:15px 0;
  padding:3px;
  text-align:center;
}
#ShareRobloxRibbon a {
  text-decoration:none;
  color:#000;
}
.ShareRobloxButton {
  padding:4px;
  margin:4px 6px;
  border:3px solid #B2C1D2;
  background:#A5D0FF;
  color:#000;
  cursor:pointer;
  font-size:16px;
}
.ShareRobloxButtonCurrent {
  padding:4px;
  margin:4px 6px;
  border:3px solid #B2C1D2;
  background:#527396;
  color:#FFF;
  cursor:pointer;
  font-size:16px;
  text-decoration:none;
}
.ShareRobloxButton:hover {
  background:#527396;
  color:#FFF;
}
.clearing {
  clear:both;
}
#PleaseUpgradeMeContainer {
  margin-top:10px;
}
#StoreContainer {
  font-family:Verdana,Sans-Serif;
}
#StoreContainer h2 {
  font-family:Verdana,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  letter-spacing:.5em;
  line-height:1em;
  margin:0;
  padding:0;
}
#StoreContainer h3 {
  font-family:Verdana,Sans-Serif;
  font-size:1.5em;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:1em;
  margin:5px 0;
  padding:0;
}
#StoreContainer ul {
  list-style:none;
  margin:10px 0 30px 0;
}
#StoreContainer ul li {
  margin-bottom:.5em;
}
#StoreContainer ul a {
  font-size:1.1em;
}
#StoreContainer .DisplayFilters {
  width:150px;
}
#StoreContainer #Products {
  float:left;
  padding-bottom:10px;
  padding-left:0;
  padding-right:0;
  width:585px;
}
#StoreContainer #Products #AdditionalPlace {
  margin:0 auto;
  width:420px;
}
#StoreContainer #AdsPane {
  border:solid 1px #000;
  float:right;
  text-align:right;
  width:160px;
}
#StoreContainer .Label,
#StoreContainer .Detail,
#StoreContainer .DetailHighlighted {
  font-size:.8em;
}
#StoreContainer .DetailHighlighted {
  color:Red;
  font-weight:bold;
}
#StoreContainer .Thumbnail {
  border:solid 1px #000;
  height:230px;
  width:420px;
}
#StoreContainer .Price {
  font-weight:bold;
  margin:5px 0;
}
#StoreContainer .InsufficientFunds {
  color:Red;
}
.tipsy {
  padding:5px;
  font-size:10px;
  opacity:.8;
  filter:alpha(opacity=80);
  background-repeat:no-repeat;
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tipsy.gif);
}
.tipsy-inner {
  padding:5px 8px 4px 8px;
  background-color:black;
  color:white;
  max-width:200px;
  text-align:center;
}
.tipsy-inner {
  -moz-border-radius:3px;
  -webkit-border-radius:3px;
}
.tipsy-north {
  background-position:top center;
}
.tipsy-south {
  background-position:bottom center;
}
.tipsy-east {
  background-position:right center;
}
.tipsy-west {
  background-position:left center;
}
#ToolboxContainer {
  text-align:center;
}
#ToolboxControls {
  text-align:left;
  width:200px;
}
#ToolboxSelector {
  margin:0 0 5px 0;
}
#ToolboxSearch {
  margin:0 0 5px 0;
}
#ToolboxItems {
  background-color:window;
  border:solid 1px Black;
  min-height:100px;
  padding:10px 10px 10px 10px;
  width:178px;
}
#Button {
  background-color:White;
  border:solid 1px black;
  cursor:pointer;
  float:right;
  height:16px;
  margin:0 0 0 5px;
  padding:1px 0 0 0;
  text-align:center;
  width:50px;
}
#ToolboxContainer .Navigation {
  font-size:8pt;
  width:200px;
  padding:3px 0 0 0;
}
#ToolboxContainer .Navigation a {
  color:#00c;
  text-decoration:none;
}
#ToolboxContainer .Navigation a:hover {
  font-weight:bold;
  letter-spacing:-.5pt;
}
#ToolboxContainer .Navigation #Previous {
  float:left;
  width:60px;
  text-align:left;
}
#ToolboxContainer .Navigation #Location {
  float:left;
  text-align:center;
  width:74px;
}
#ToolboxContainer .Navigation #Next {
  float:right;
  text-align:right;
  width:60px;
}
.ButtonText {
  border-width:1px;
  font-size:8pt;
  color:Black;
  text-decoration:none;
}
.ButtonText:hover {
  font-weight:bold;
  letter-spacing:-.1em;
}
.NavigationIndicators {
  font-size:6pt;
  font-weight:bold;
  letter-spacing:-.1em;
  vertical-align:middle;
}
.Search {
  border:solid 1px Black;
  float:left;
  font-family:Verdana,Sans-Serif;
  font-size:8pt;
  height:15px;
  line-height:1.3em;
  padding:1px 2px 1px 2px;
  width:130px;
}
.Page {
  background-color:ButtonFace;
  font-family:Verdana,Sans-Serif;
}
.Toolboxes {
  font-family:Verdana,Sans-Serif;
  font-size:9pt;
  font-weight:bold;
  width:200px;
}
.ToolboxItem {
  border:solid 2px Window;
  height:64px;
  margin:10px 10px 10px 10px;
  width:64px;
  vertical-align:middle;
}
#ToolboxContainer .SearchError {
  clear:both;
  margin:1px;
  float:none;
  padding:1px;
  text-align:center;
  color:Red;
  font-size:small;
}
#SetTabs {
  background:#7c7c7c;
  color:#fff;
  padding-top:4px;
  height:25px;
  clear:both;
  font-family:Arial;
  font-size:11px;
}
#SetTabs div {
  float:left;
  padding:5px 5px 0 5px;
  background:#a3a3a3;
  cursor:pointer;
  height:20px;
}
#SetTabs div.Selected {
  background:#f0f0f0;
  color:#000;
}
#MySets {
  margin:0 4px 0 2px;
}
#RobloxSets {
  margin:0 2px 0 5px;
}
#OtherSets {
  margin:0 2px;
}
.unifiedModal {
  background-color:#e1e1e1;
  font:bold 27px Arial;
  letter-spacing:-2px;
  color:#363636;
  border:2px solid #272727;
  text-align:center;
  position:relative;
}
.unifiedModalContent {
  text-align:left;
  background-color:White;
  color:#000;
  font:Bold 15px Arial;
  margin-left:5px;
  margin-right:5px;
  margin-bottom:5px;
  letter-spacing:normal;
}
.unifiedModalSubtext {
  color:#666;
  font:bold 12px Arial;
  border:none;
  letter-spacing:normal;
  cursor:pointer;
  text-align:center;
  margin-top:10px;
  padding-bottom:5px;
}
.smallModal {
  width:425px;
}
.closeBtnCircle_20h:hover {
  background-position:0 20px;
}
.closeBtnCircle_20h {
  width:20px;
  height:20px;
  cursor:pointer;
  position:absolute;
  top:5px;
  left:5px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-x.png);
}
.unifiedModal .smallModal .closeBtnCircle_20h {
  margin-left:395px;
}
#CancelBuildersClubContainer,
#PaymentMethodsContainer,
#PaymentContainer,
#PayPalContainer,
#CashContainer {
  background-color:#fff;
  font-family:Arial,Sans-Serif;
  margin:0 auto;
  padding:20px 80px;
}
#UpgradeCompleteContainer,
#CancelAccountUpgradeContainer,
#ManageAccountUpgradesContainer,
#AccountUpgradesConfirmationContainer {
  background-color:#fff;
  font-family:Arial,Sans-Serif;
  margin:0 auto;
}
#AccountUpgradesConfirmationContainer,
#CancelAccountUpgradeContainer {
  border:solid 2px #6e99c9;
  padding:10px 10px 20px 10px;
}
#CancelBuildersClubContainer h2,
#PaymentMethodsContainer h2,
#PaymentContainer h2,
#PayPalContainer h2,
#CashContainer h2,
#UpgradeCompleteContainer h2,
#ManageAccountUpgradesContainer h2,
#CancelAccountUpgradeContainer h2,
#AccountUpgradesConfirmationContainer h2 {
  font-family:Arial,Sans-Serif;
  font-size:2.5em;
  font-weight:normal;
  line-height:1em;
  margin:0;
  padding:0;
}
#UpgradeCompleteContainer h2,
#CancelAccountUpgradeContainer h2,
#ManageAccountUpgradesContainer h2,
#AccountUpgradesConfirmationContainer h2 {
  font-size:2em;
  letter-spacing:.1em;
  line-height:1.5em;
  margin:0 auto;
  margin-top:10px;
  width:600px;
}
#UpgradeCompleteContainer p,
#ManageAccountUpgradesContainer p,
#AccountUpgradesConfirmationContainer p {
  line-height:1.6em;
}
#RobloxCentralBank {
  border-bottom:solid 1px #000;
}
#MembershipOptions .Label {
  text-align:center;
}
#PaymentMethodsContainer .PaymentMethods {
  border:none;
  margin:20px auto;
  padding:10px;
  width:600px;
}
#PaymentMethodsHeader {
  margin:0 auto;
  padding-left:60px;
  width:600px;
}
.PaymentMethodRow {
  font-family:Arial,Helvetica,Sans-Serif;
  background-color:transparent;
  color:#090;
}
.PaymentMethodRow:hover {
  background-color:#f2f2f2;
  cursor:pointer;
  color:#00d900;
}
.PaymentMethodRowUnavailable a {
  color:#090;
}
.PaymentMethodRow td,
.PaymentMethodRowUnavailable td {
  border:none;
  padding:20px;
}
#PaymentMethodsContainer .PaymentMethodName {
  color:#333;
  font-weight:bold;
  font-size:medium;
}
#Legend {
  margin-top:10px;
}
#CurrentBalance {
  color:#333;
}
#PaymentContainer #Account,
#PaymentContainer #BillingInfo,
#PaymentContainer #ProductAndPricing,
#PaymentContainer #ProductAndPricing1,
#PaymentContainer #CreditCard,
#PayPalContainer #ConfirmDetails,
#CashContainer #ConfirmDetails,
#PayPalContainer #Notes,
#CashContainer #Notes {
  margin-bottom:20px;
}
#PaymentContainer #Pay,
#PayPalContainer #Continue {
  margin:0 auto;
  text-align:center;
}
.PaymentDropDownList {
  padding:5px;
  width:95%;
}
#PaymentContainer .Label,
#PayPalContainer .Label,
#CashContainer .Label {
  float:left;
  font-size:1.25em;
  height:40px;
  line-height:40px;
  padding:0 10px;
  vertical-align:middle;
  width:250px;
}
#PaymentContainer .BokuLabel {
  float:none;
  font-size:1em;
  font-weight:bold;
  height:20px;
  line-height:20px;
  padding:0 6px 0 0;
  vertical-align:middle;
}
#ConfirmDetails .Detail {
  background-color:#EEE;
  border-bottom:solid 1px #CCC;
  border-top:solid 1px #CCC;
  height:40px;
  line-height:40px;
}
#PaymentContainer .Field,
#PayPalContainer .Field,
#CashContainer .Field {
  float:left;
  height:40px;
  line-height:40px;
  padding:0 10px;
  vertical-align:middle;
  width:400px;
}
#PaymentContainer .BokuField {
  float:none;
  font-size:1em;
  height:20px;
  line-height:20px;
  padding:0 6px 0 0;
  ;
  vertical-align:middle;
}
#BokuOrderSummary {
  font-weight:bold;
  font-size:1.25em;
  padding:0 20px 0 5px;
  vertical-align:middle;
}
#PaymentContainer .Button,
#PayPalContainer .Button {
  font-size:16px;
  margin:0 3px;
}
#PaymentMethodsContainer .ExistingSubscription {
  font-size:16px;
  color:Blue;
  width:50%;
  text-align:center;
}
#PayPalContainer .PayPalDisallowedMessage {
  font-size:16px;
  padding-bottom:12px;
  color:Blue;
  width:90%;
}
#ProductAndPricing,
#ProductAndPricing1 {
  float:left;
  width:865px;
}
#ProductAndPricing .TotalRowName,
#ProductAndPricing .TotalRowPrice {
  font-size:14px;
  font-weight:bold;
  padding-top:10px;
}
.TotalRowName,
.TotalRowPrice,
.ProductName,
.SuperchargeProductName,
.ProductPrice,
.SuperchargeProductPrice {
  float:left;
  font-weight:bold;
}
.ProductName,
.TotalRowName,
.SuperchargeProductName {
  width:640px;
}
.ProductPrice,
.TotalRowPrice,
.SuperchargeProductPrice {
  width:200px;
}
.SuperchargeProductName,
.SuperchargeProductPrice {
  color:#E6B800;
}
#PaymentDetails #Account .Field,
#PaymentDetails #ProductAndPricing .Field,
#PayPalContainer #ConfirmDetails .Field,
#CashContainer #ConfirmDetails .Field {
  font-size:1.25em;
  font-weight:bold;
}
#PaymentDetailsTable {
  width:400px;
}
#UpgradeCompleteContainer #Message,
#CancelAccountUpgradeContainer #Message,
#ManageAccountUpgradesContainer #CurrentAccountUpgrades,
#AccountUpgradesConfirmationContainer #Message {
  background-color:#eee;
  border:solid 1px #ccc;
  margin:0 auto;
  margin-top:15px;
  padding:10px;
  width:580px;
}
#ManageAccountUpgradesContainer #CurrentAccountUpgrades {
  margin-top:25px;
  font-family:Arial,Helvetica,Sans-Serif;
}
.ExtensionNote {
  margin:10px 0;
}
.UpgradeStatus {
  font-weight:bold;
  margin:20px;
  text-align:center;
}
#BuildersClubContainer {
  font-family:Arial,Sans-Serif;
  margin:0 auto;
  width:900px;
}
#BuildersClubContainer #LeftColumn {
  background-color:#fff;
  width:575px;
  float:left;
  margin-top:10px;
}
#BuildersClubContainer #LeftColumn #MembershipOptions {
  margin-bottom:50px;
  padding:10px 10px 0 10px;
}
#BuildersClubContainer #LeftColumn #MembershipOptions .MembershipButton {
  margin:0 4px 0 4px;
  float:left;
  width:130px;
}
#BuildersClubContainer #LeftColumn #MembershipOptions .BCButtonLabel {
  color:#6e99c9;
  margin-top:4px;
  text-align:center;
}
#BuildersClubContainer #LeftColumn h1 {
  font-size:20px;
  color:#6e99c9;
  font-style:italic;
  font-weight:bold;
}
#MembershipOptionsTable {
  width:500px;
  margin:auto;
}
#MembershipOptionsTable tr {
  text-align:center;
}
#MembershipOptionsTable td {
  width:100px;
  margin:38px;
}
#MembershipOptionsTable td .BCButton {
  padding-left:35px;
  padding-right:0;
}
#MembershipOptionsTable .BCText {
  padding-right:20px;
  width:150px;
  text-align:left;
}
.TurboSpan {
  color:#72942E;
}
#upgrades-membership-options {
  font-family:"Lucida Sans Unicode","Lucida Grande",Sans-Serif;
  font-size:13px;
  background:#fff;
  padding-top:10px;
  clear:left;
  width:100%;
  border-collapse:collapse;
  text-align:center;
}
#upgrades-membership-options th {
  font-size:15px;
  font-weight:normal;
  color:#2163A5;
  padding:5px 8px;
  border-bottom:1px solid #D3D3D3;
  line-height:32px;
}
#upgrades-membership-options th img {
  float:left;
}
#upgrades-membership-options td {
  color:#2163A5;
  padding:5px 10px;
}
#upgrades-membership-options tbody tr:hover td {
  color:Maroon;
}
#upgrades-membership-options .leftBorder {
  border-left:1px solid #D3D3D3;
  width:150px;
}
#upgrades-membership-options .odd {
  background:#e8edff;
}
#upgrades-membership-options .LeftText {
  text-align:left;
}
#BuildersClubContainer #LeftColumn #WindowsOnlyWarning {
  padding-left:10px;
  padding-bottom:1px;
}
#BuildersClubContainer #RightColumn {
  margin:10px 0 10px 5px;
  width:290px;
  float:right;
}
.RightColumnBox,
#UpgradeCompleteContainer {
  border:2px solid #6e99c9;
  margin-bottom:20px;
  padding:10px;
  background-color:#fff;
}
.RightColumnBox a {
  text-decoration:underline;
}
.RightColumnBox h2 {
  float:left;
  font-size:14px;
  color:Maroon;
}
.RightColumnBox h3 {
  text-align:left;
  font-size:11px;
  clear:both;
}
.RightColumnBox h1 {
  float:left;
  font-size:16px;
  color:Maroon;
  padding-left:10px;
  font-weight:bold;
}
.RightColumnManageAccount {
  border-left:2px solid #6e99c9;
  border-bottom:2px solid #6e99c9;
  border-right:2px solid #6e99c9;
  background-color:#fff;
  margin-bottom:20px;
}
#CancelMembership {
  padding-top:10px;
  padding-bottom:10px;
  text-align:center;
}
#RightColumn #ManageAccountBody {
  padding:10px;
}
#RightColumn #ManageAccount #CancelMembershipButton,
#RedirectToLoginLink {
  text-align:center;
}
.OBCSellButton {
  border:0;
  cursor:pointer;
  top:218px;
  position:absolute;
}
.BuyRobuxBtn {
  display:inline-block;
  width:205px;
  height:44px;
  background:url("data:image/png;base64,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") no-repeat;
}
.BuyRobuxBtn:hover {
  background-position:0 -44px;
  cursor:pointer;
}
.cardPanelLeft {
  margin:25px 0 15px 12px;
  float:left;
}
.cardPanelRight {
  margin-right:12px;
  margin-top:10px;
  float:right;
}
.centeredImage {
  margin-bottom:10px;
}
#GameCardButtonContainer {
  clear:both;
  margin:15px 0;
}
.WhereToBuyTableCell,
WhereToBuyTableCellRight {
  width:320px;
  padding:10px 0;
}
.WhereToBuyTableCellRight {
  text-align:left;
}
.AwardAssetDisplayList {
  display:inline-block;
  *display:inline;
  *zoom:1;
  vertical-align:top;
  width:100px;
  height:135px;
}
.PaymentTextBox {
  padding:5px;
  width:90%;
}
.PaymentLabel {
  width:120px;
  font-weight:bold;
}
.PaymentPadding {
  padding:5px;
}
.AutoRecurText {
  color:Red;
  display:none;
}
.PayTypesLeftColumn,
.PayTypesRightColumn {
  float:left;
  clear:none;
  margin:0;
  padding:0;
  padding-bottom:12px;
  text-align:right;
  width:115px;
}
.PayTypesRightColumn {
  padding-left:18px;
  width:133px;
  text-align:left;
}
.PayTypesCenter {
  text-align:center;
}
div.GiftCards {
  height:625px;
}
.GiftCards #Column1 {
  display:inline-block;
  float:left;
  left:14px;
  position:relative;
}
.GiftCards #Column2 {
  display:inline-block;
  float:right;
  height:496px;
  position:relative;
  right:14px;
}
.GiftCards #Products {
  position:relative;
  top:-4px;
  cursor:pointer;
}
.GiftCards #GiftForm {
  padding:10px;
  background:#E1E1E1;
  width:400px;
  color:black;
  border:1px solid #A7A7A7;
}
.GiftCards #ErrorDiv {
  color:orange;
  font-weight:bold;
}
.GiftCards #PurchaseButtonContainer {
  text-align:right;
  margin-top:16px;
  font-weight:bold;
  color:black;
}
.GiftCards #CreateHeader {
  color:#363636;
  font:bold 40px Arial;
  margin:10px 0 0 14px;
  letter-spacing:-2px;
}
.GiftCards .GiftHeader {
  color:black;
  font:normal 16px Arial;
  margin:10px 0;
  text-transform:uppercase;
  font-weight:bold;
}
.GiftCards .GCProduct {
  background-repeat:no-repeat;
  height:109px;
  width:421px;
  margin:12px 0;
  position:relative;
}
.GiftCards .GCTheme {
  display:inline-block;
  *display:inline;
  *zoom:1;
  background-repeat:no-repeat;
  height:77px;
  width:103px;
  margin:0 12px 0 0;
  position:relative;
  cursor:pointer;
}
.GiftCards #GCTheme1 {
  *margin:-14px 12px 0 132px;
}
.GiftCards #GCTheme2 {
  *margin:-14px 12px 0 0;
}
.GiftCards .CheckMark {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Gifting/img-unchecked.png);
  position:absolute;
  top:7px;
  right:7px;
  width:25px;
  height:24px;
}
.GiftCards .GCProductSelected .CheckMark {
  background-image:url(/web/20120611211431im_/http://www.roblox.com/images/Gifting/img-checked.png);
}
.GiftCards .ThemeCheckMark {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Gifting/img-checked-small.png) no-repeat 0 -25px;
  position:absolute;
  top:3px;
  right:4px;
  height:17px;
  width:19px;
}
.GiftCards .GCThemeSelected .ThemeCheckMark {
  background-position:0 0;
}
.GiftCards #Product0 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/new/gifting_bc.jpg") center no-repeat;
}
.GiftCards #Product0:hover {
  background-color:#283d68;
}
.GiftCards #Product1 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/new/gifting_tbc.jpg") center no-repeat;
}
.GiftCards #Product1:hover {
  background-color:#630;
}
.GiftCards #Product2 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/new/gifting_obc.jpg") center no-repeat;
}
.GiftCards #Product2:hover {
  background-color:#000;
}
.GiftCards #Product3 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/new/gifting_anyAmount.jpg") center no-repeat;
}
.GiftCards #Product3:hover {
  background-color:#004d00;
}
.GiftCards .GCThemeClassic {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-thumb-classic.png") no-repeat 0 0;
}
.GiftCards .GCThemeClassic:hover {
  background-position:0 -77px;
}
.GiftCards .GCThemeChristmas {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-thumb-christmas.png") no-repeat 0 0;
}
.GiftCards .GCThemeChristmas:hover {
  background-position:0 -77px;
}
.GiftCards .GCThemeJustForYou1 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-thumb-justforyou1.png") no-repeat 0 0;
}
.GiftCards .GCThemeJustForYou1:hover {
  background-position:0 -77px;
}
.GiftCards .GCThemeJustForYou2 {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-thumb-justforyou2.png") no-repeat 0 0;
}
.GiftCards .GCThemeJustForYou2:hover {
  background-position:0 -77px;
}
.GiftCards .ThemePreview {
  position:absolute;
  width:261px;
  height:194px;
  top:30px;
  right:20px;
  display:none;
}
.GiftCards .GCThemeClassic .ThemePreview {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-preview-classic.png") no-repeat 0 0;
}
.GiftCards .GCThemeChristmas .ThemePreview {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-preview-christmas.png") no-repeat 0 0;
}
.GiftCards .GCThemeJustForYou1 .ThemePreview {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-preview-justforyou1.png") no-repeat 0 0;
}
.GiftCards .GCThemeJustForYou2 .ThemePreview {
  background:url("/web/20120611211431im_/http://www.roblox.com/images/gifting/theme-preview-justforyou2.png") no-repeat 0 0;
}
.GiftCards .Hint {
  color:Orange;
  font:bold 19px Arial,Helvetica,Sans-Serif;
}
.GiftCards .GCProduct input {
  color:#888;
}
.GiftCards .GCProductSelected input {
  color:#000;
}
.GiftCards .GiftFieldInput {
  width:240px;
}
.GiftCards .GiftFieldLabel {
  color:black;
  display:inline-block;
  font-weight:bold;
  padding-left:10px;
  width:120px;
}
.GiftCards #CustomValueDollars {
  text-align:right;
  width:50px;
}
.GiftCards #CustomValueCents {
  width:20px;
}
.PreviewGiftCard,
.EditGiftCard {
  color:#00f;
  text-decoration:underline;
  cursor:pointer;
  font-weight:bold;
}
.PreviewGiftCard:hover,
.EditGiftCard:hover {
  color:#00d;
}
.OrderSummary #ThankYou {
  font:bold 18px Arial,Helvetica,Sans-Serif;
}
.OrderSummary #SummaryText {
  margin:12px 0 18px 10px;
  line-height:1.5em;
}
.OrderSummary #GiftCardContainer {
  margin:0 0 10px 10px;
}
.OrderSummary #GiftCardTable .Header {
  font-weight:bold;
}
.OrderSummary .PurchaseAnother {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/Buttons/btn-purchase_another.png) no-repeat;
  display:inline-block;
  *display:inline;
  width:219px;
  height:50px;
}
.OrderSummary .PurchaseAnother:hover {
  background-position:0 -50px;
}
.MicroNode {
  display:block;
  margin-left:auto;
  margin-right:auto;
}
#post-image-main,
#upload-video-main {
  font-size:16pt;
  font-weight:bold;
  text-align:center;
}
#post-image-main a,
#post-image-main a:hover,
#upload-video-main a,
#upload-video-main a:hover {
  text-decoration:none;
}
#post-image-ul,
#upload-video-ul {
  text-align:left;
  font-weight:normal;
  font-size:12pt;
}
#post-image-small,
#upload-video-small {
  font-weight:normal;
  font-size:12pt;
}
#post-image-footer,
#upload-video-footer {
  text-align:right;
}
#post-image-footer a,
#upload-video-footer a {
  font-size:12pt;
  font-weight:bold;
  text-decoration:none;
}
#post-image-footer a:hover,
#upload-video-footer a:hover {
  text-decoration:none;
}
#UserContainer {
  font-family:Verdana,Sans-Serif;
}
#UserContainer #LeftBank {
  float:left;
  text-align:center;
  width:444px;
}
#UserContainer #RightBank {
  float:right;
  text-align:center;
  width:444px;
}
#UserContainer #LeftBank #UserPageLargeRectangleAd {
  border:none;
}
#UserPlacesPane {
  clear:both;
  background-color:#FFF;
}
#UserPlacesPane {
  clear:both;
  background-color:#FFF;
}
.FriendRequestsPane,
#UserModelsContainer,
#UserAssetsPane {
  clear:both;
  margin:10px 0 0 0;
  text-align:center;
}
#UserBadgesPane,
#UserStatisticsPane {
  margin:10px 0 0 0;
}
#UserStatisticsPane {
  text-align:left;
}
#FriendsPane,
#FavoritesPane {
  clear:right;
  margin:10px 0 0 0;
}
#UserAssetsPane {
  margin-bottom:10px;
}
#UserBadgesPane #UserBadges {
  background-color:#fff;
  text-align:center;
}
#ProfilePane h4 {
  background-color:#ccc;
  border-top:solid 1px #000;
  color:#333;
  font-family:Comic Sans MS,Verdana,Sans-Serif;
  font-size:1.3em;
  margin:0;
  text-align:center;
}
#ProfilePane p {
  margin:.9em 0;
  line-height:1.6em;
}
#UserAssetsPane #UserAssets h4,
#UserBadgesPane #UserBadges h4,
#UserPlacesPane #UserPlaces h4,
#UserStatisticsPane #UserStatistics h4,
#FavoritesPane #Favorites h4 {
  background-color:#ccc;
  border-bottom:solid 1px #000;
  color:#333;
  font-family:Comic Sans MS,Verdana,Sans-Serif;
  margin:0;
  text-align:center;
}
#UserPlacesPane #UserPlaces h4 {
  background-color:#6e99c9;
  color:#fff;
  font-family:Verdana,Sans-Serif;
  font-size:1.4em;
  font-weight:normal;
  letter-spacing:.1em;
  line-height:1.5em;
}
#UserStatisticsPane #UserStatistics {
  background-color:#eee;
  padding-bottom:10px;
}
#UserStatisticsPane #UserStatistics h4 {
  margin-bottom:5px;
}
#UserStatisticsPane #UserStatistics .Statistic {
  line-height:1.8em;
  margin:0 auto;
  width:385px;
}
#UserStatisticsPane #UserStatistics .Label {
  float:left;
  text-align:right;
  width:178px;
}
#UserStatisticsPane #UserStatistics .Value {
  float:right;
  width:177px;
}
#UserModelsContainer {
  text-align:left;
}
#Friends {
  margin-top:10px;
}
#Friends h4,
#FriendRequests h4 {
  font-size:10pt;
  font-weight:bold;
  line-height:1em;
  margin-bottom:5px;
  margin-top:5px;
}
.NoResults {
  line-height:1.3em;
  padding:10px;
  text-align:center;
}
.Badge {
  margin:10px 10px;
  text-align:center;
}
.FriendsPager {
  margin-left:auto;
  margin-right:auto;
}
.Friend {
  width:125px;
  height:180px;
  overflow:hidden;
}
.FriendContainer {
  float:left;
  margin:10px;
}
.Friend .Avatar {
  text-align:center;
}
.Friend .Summary,
.Friend .Options {
  margin-top:5px;
  text-align:center;
}
#UserContainer .CollapsiblePanelHint {
  color:#999;
  padding:5px;
  text-align:center;
}
#UserContainer #AssetsMenu {
  float:left;
  width:158px;
}
#UserContainer #AssetSearchOption {
  float:left;
}
#UserContainer #AssetUploadOption {
  float:right;
}
#UserContainer #AssetsList {
  clear:both;
}
#UserAssetsPane .AssetsMenuItem {
  border:solid 1px #777;
  margin:15px;
  padding:3px 10px;
  width:100px;
}
#UserAssetsPane .AssetsMenuItem:hover {
  border:solid 1px #000;
  cursor:pointer;
  margin:15px;
  width:100px;
}
#UserAssetsPane .AssetsMenuItem_Selected {
  background-color:#6e99c9;
  border:solid 1px #000;
  margin:15px;
  padding:3px 10px;
  width:100px;
}
#UserAssetsPane .AssetsMenuButton {
  color:#777;
  font:normal 14px/normal Verdana,sans-serif;
}
#UserAssetsPane .AssetsMenuButton:hover {
  color:#000;
  text-decoration:none;
}
#UserAssetsPane .AssetsMenuButton_Selected {
  color:#fff;
  font:normal 14px/normal Verdana,sans-serif;
  text-decoration:none;
}
#UserPlaces .PanelFooter,
#GroupPlaces .PanelFooter,
#Favorites .PanelFooter {
  background-color:#fff;
  color:#333;
  font-family:Verdana,Sans-Serif;
  margin:0;
  padding:3px;
  text-align:center;
}
#UserPlaces .AccordionHeader {
  background-color:#ccc;
  border:solid 1px #000;
  cursor:pointer;
  font:bold 1em/normal Verdana,sans-serif;
  letter-spacing:.1em;
  margin:1px 0;
  padding:1px 1em;
  text-align:left;
}
#UserPlaces .AccordionHeader:hover {
  background-color:#6e99c9;
  color:#fff;
}
#UserPlaces .Place .PlayStatus {
  margin:5px 0 0 0;
  display:inline;
}
#UserPlaces .Place .PlayOptions {
  margin:5px 0 0 0;
  display:block;
  min-height:48px;
}
#UserPlaces .Place .PlayOptions .Button {
  border-color:#333;
  color:#333;
  margin:0 3px;
}
#UserPlaces .Place .PlayOptions .Button:hover {
  background-color:#6e99c9;
  color:#fff;
}
#UserPlaces .Place .Statistics {
  border-top:dashed 1px #555;
  border-left:dashed 1px #555;
  border-right:dashed 1px #555;
  color:#555;
  font:normal 1em/normal Verdana,sans-serif;
  letter-spacing:.1em;
  line-height:1.7em;
  margin:0;
  margin-top:10px;
}
#UserPlaces .Place .Thumbnail {
  border:solid 1px #555;
  margin:0;
}
#UserPlaces .Place .Description {
  border:dashed 1px #555;
  color:#555;
  font:normal 1em/normal Verdana,sans-serif;
  max-height:75px;
  line-height:1.7em;
  margin:5px 0 0 0;
  padding:5px 10px;
  overflow:auto;
  text-align:left;
}
#UserPlaces .Place .Configuration {
  border-bottom:dashed 1px #555;
  border-left:dashed 1px #555;
  border-right:dashed 1px #555;
  font:normal 1em/normal Verdana,sans-serif;
  line-height:1.7em;
  padding:5px 10px;
}
#UserContainer #AssetsContent {
  float:left;
  font-family:Verdana,Sans-Serif;
  margin:0 auto;
  margin-left:28px;
  margin-right:28px;
  min-width:0;
  padding-bottom:10px;
  padding-left:0;
  padding-right:0;
  position:relative;
  text-align:left;
  width:662px;
}
#UserContainer #AssetsContent .HeaderPager,
#UserContainer #FavoritesContent .HeaderPager,
#UserContainer #AssetsContent .FooterPager,
#UserContainer #FavoritesContent .FooterPager {
  clear:both;
  margin:0 12px 0 10px;
  padding:2px 0;
  text-align:center;
}
#UserContainer #AssetsContent .HeaderPager,
#UserContainer #FavoritesContent .HeaderPager {
  margin-bottom:10px;
}
#UserContainer #AssetsContent .HeaderPager .Label,
#UserContainer #FavoritesContent .HeaderPager .Label,
#UserContainer #AssetsContent .FooterPager .Label,
#UserContainer #FavoritesContent .FooterPager .Label {
  font-size:1em;
  vertical-align:middle;
}
#UserContainer .Asset {
  margin:0 10px 15px 10px;
  vertical-align:top;
  width:112px;
}
#UserContainer .Asset .AssetThumbnail {
  border:solid 1px #000;
  height:110px;
  position:relative;
  text-align:center;
  width:110px;
}
#UserContainer .Asset .AssetDetails {
  overflow:hidden;
  padding:2px 0 6px 0;
  text-align:left;
  width:110px;
}
#UserContainer .AssetName a {
  font-size:.9em;
  font-weight:bold;
  line-height:1.5em;
  vertical-align:top;
}
.AssetsBullet {
  padding-right:3px;
}
#UserContainer .Label,
#UserContainer .Detail,
#UserContainer .DetailHighlighted,
#UserContainer .PriceInRobux,
#UserContainer .PriceInTickets {
  font-size:.8em;
}
#UserContainer .DetailHighlighted {
  color:Red;
  font-weight:bold;
}
#UserContainer .PriceInRobux {
  color:Green;
  font-weight:bold;
}
#UserContainer .PriceInTickets {
  color:#fbb117;
  font-weight:bold;
}
.UserOnlineMessage {
  font-family:Verdana;
  font-size:8pt;
  color:Red;
}
.UserOfflineMessage {
  font-family:Verdana;
  font-size:8pt;
  color:Gray;
}
.AdPanel {
  position:relative;
  margin:0 auto;
  display:inline;
}
.BanishButtonOverlay {
  background-color:#eee;
  border:solid 1px #444;
  font-size:.8em;
  padding:1px 3px 2px 3px;
  position:absolute;
  text-align:center;
  top:0;
  right:0;
}
.BanishButtonOverlay:hover {
  background-color:#fff;
  border:solid 1px #000;
  text-decoration:none;
}
.DeleteButtonOverlay {
  background-color:#eee;
  border:solid 1px #444;
  font-size:.8em;
  padding:1px 3px 2px 3px;
  position:absolute;
  right:2px;
  text-align:center;
  top:2px;
}
.DeleteFavoriteOverlay {
  background-color:#eee;
  border:solid 1px #444;
  font-size:.8em;
  padding:1px 3px 2px 3px;
  position:relative;
  left:-57px;
  text-align:center;
  top:-97px;
}
.DeleteButtonOverlay:hover {
  background-color:#fff;
  border:solid 1px #000;
  text-decoration:none;
}
.PlaceAccessIndicator {
  color:#000;
}
.SubscriptionStatusPanel {
  width:348px;
  font-weight:bold;
  margin-top:5px;
  padding:5px 5px 5px 5px;
  border:solid 1px black;
  background-color:#ccc;
}
.ProfileAlertPanel {
  width:348px;
  padding:5px 5px 5px 5px;
  background-color:#FFF;
  border:solid 1px black;
  height:64px;
}
.UserBlurb {
  overflow:hidden;
  width:348px;
  padding:5px 5px 5px 5px;
  line-height:20px;
  background-color:#FFF;
  margin-bottom:10px;
}
#AccountSettingsForm {
  font-size:11px;
  line-height:18px;
}
#AccountSettingsForm fieldset {
  border:1px solid #ddd;
  padding:5px 5px 5px 5px;
}
#OwnedSetsContainerDiv,
#SubscribedSetsContainerDiv {
  text-align:center;
  padding-bottom:25px;
  height:auto;
}
#OwnedSetsContainerDiv .TiledSets,
#SubscribedSetsContainerDiv .TiledSets {
  width:110px;
  height:90px;
}
.TiledSets {
  float:left;
  margin:10px 10px;
  text-align:center;
}
#OwnedSetsContainerDiv .AssetCreator,
#SubscribedSetsContainerDiv .AssetCreator {
  font-size:.8em;
}
#OwnedSetsContainerDiv .SetsPager_Container,
#SubscribedSetsContainerDiv .SetsPager_Container {
  clear:both;
  text-align:center;
  position:absolute;
  bottom:11px;
  width:100%;
  *left:0;
}
#OwnedSetsContainerDiv .loading,
#SubscribedSetsContainerDiv .loading {
  text-align:center;
  height:350px;
  position:relative;
  background:url('/web/20120611211431im_/http://www.roblox.com/images/spinners/spinner100x100.gif') center no-repeat;
}
#OwnedSetsContainerDiv .NoSets,
#SubscribedSetsContainerDiv .NoSets {
  position:relative;
  top:10px;
}
#ToggleBetweenOwnedSubscribedSets:hover {
  cursor:pointer;
}
.MyRobloxContainer {
  font-family:Verdana,Sans-Serif;
  margin:0 auto;
  width:900px;
}
.ThemeStandardColorBackground {
  background:#6e99c9;
}
.StandardBox,
.StandardBoxWhite,
.StandardBoxGray {
  float:none;
  border:2px solid #6e99c9;
  background-color:White;
  padding:10px 10px 10px 10px;
  margin-bottom:10px;
  display:block;
}
.StandardBoxWhite {
  *zoom:1;
}
.StandardBoxGrey {
  float:inherit;
  border:2px solid #6e99c9;
  background-color:#A6A6A6;
  padding:10px 10px 10px 10px;
  margin-bottom:10px;
  display:block;
}
.StandardBoxHeader,
.StandardBoxHeaderGray,
.StandardTabWhite,
.StandardTabGray,
.StandardTabGrayActive {
  float:none;
  background-color:#6e99c9;
  text-align:center;
  color:White;
  font-size:16px;
  font-weight:bold;
  padding:5px 12px 5px 12px;
  display:block;
  *display:inline;
  *zoom:1;
}
.StandardBoxHeaderGray {
  background-color:#A6A6A6;
}
.StandardTabWhite,
.StandardTabGrayActive,
.StandardTabGray {
  display:inline-block;
  height:26px;
  z-index:2;
  position:relative;
  *display:inline;
  *zoom:1;
}
.StandardTabWhite span {
  *padding-right:14px;
}
.StandardTabGray {
  background-color:#b4cde9;
  margin-right:4px;
}
.StandardTabGrayActive {
  margin-right:4px;
}
.StandardTabGray a,
.StandardTabGrayActive a {
  color:White;
}
.StandardTabGray a:hover,
.StandardTabGrayActive a:hover {
  text-decoration:none;
}
.StandardTabGray:hover,
.StandardTabGrayActive {
  background-color:#6c98cb;
  color:White;
}
#GroupsPeopleContainer .StandardTabGray,
#GroupsPeopleContainer .StandardTabGrayActive {
  position:relative;
  top:-4px;
}
.Column1a {
  width:290px;
  float:left;
  margin-top:10px;
}
.Column2a {
  margin-top:10px;
  width:600px;
  float:right;
}
.Column1a .StandardBox {
  width:266px;
}
.Column1a .StandardBoxHeader,
.Column1a .StandardBoxHeaderGray {
  width:266px;
}
.Column2a .StandardBox {
  width:576px;
}
.Column2a .StandardBoxHeader,
.Column2a .StandardBoxHeaderGray {
  width:576px;
}
.Column1b {
  margin-top:10px;
  width:190px;
  float:left;
  margin-right:15px;
}
.Column2b {
  margin-top:10px;
  width:490px;
  float:left;
}
.Column3b {
  margin-top:10px;
  width:190px;
  float:right;
}
.Column1b .StandardBox {
  width:166px;
}
.Column1b .StandardBoxHeader,
.Column1b .StandardBoxHeaderGray {
  width:166px;
}
.Column2b .StandardBox {
  width:466px;
}
.Column2b .StandardBoxHeader,
.Column2b .StandardBoxHeaderGray {
  width:466px;
}
.Column3b .StandardBox {
  width:166px;
}
.Column3b .StandardBoxHeader,
.Column3b .StandardBoxHeaderGray {
  width:166px;
}
.Column1c {
  margin-top:10px;
  width:590px;
  float:left;
}
.Column2c {
  margin-top:10px;
  width:290px;
  float:right;
}
.Column1c .StandardBox {
  width:556px;
}
.Column1c .StandardBoxHeader,
.Column1c .StandardBoxHeaderGray {
  width:556px;
}
.Column2c .StandardBox {
  width:266px;
}
.Column2c .StandardBoxHeader,
.Column2c .StandardBoxHeaderGray {
  width:266px;
}
.Column1d {
  margin-top:10px;
  width:440px;
  float:left;
}
.Column2d {
  margin-top:10px;
  width:440px;
  float:right;
}
.Column1d .StandardBox,
.Column1d .StandardBoxWhite {
  width:416px;
}
.Column1d .StandardBoxHeader,
.Column1d .StandardBoxHeaderGray,
.Column1d .StandardTabWhite {
  width:416px;
}
.Column2d .StandardBox,
.Column2d .StandardBoxWhite {
  width:416px;
}
.Column2d .StandardBoxHeader,
.Column2d .StandardBoxHeaderGray,
.Column2d .StandardTabWhite {
  width:416px;
}
.Column1e {
  margin-top:10px;
  width:150px;
  float:left;
}
.Column2e {
  margin-top:10px;
  width:740px;
  margin-left:10px;
  float:left;
}
.Column1e .StandardBox {
  width:136px;
}
.Column1e .StandardBoxHeader,
.Column1e .StandardBoxHeaderGray {
  width:126px;
}
.Column2e .StandardBoxGray {
  width:726px;
  padding:5px;
}
.Column2e .StandardBoxHeader,
.Column2e .StandardBoxHeaderGray {
  width:356px;
}
.Column1f {
  margin-top:10px;
  width:380px;
  float:left;
}
.Column2f {
  margin-top:10px;
  width:500px;
  float:right;
}
.Column1f .StandardBox {
  width:356px;
}
.Column1f .StandardBoxHeader,
.Column1f .StandardBoxHeaderGray {
  width:356px;
}
.Column2f .StandardBox {
  width:476px;
}
.Column2f .StandardBoxHeader,
.Column2f .StandardBoxHeaderGray {
  width:476px;
}
.Repeater {
  border:0;
  width:100%;
}
.Repeater .AlternatingItemTemplateOdd {
  background-color:#F3F3F3;
  padding:5px 5px 5px 5px;
}
.Repeater .AlternatingItemTemplateEven {
  background-color:#fff;
  padding:5px 5px 5px 5px;
}
.Repeater .RepeaterImage {
  float:left;
  vertical-align:top;
  margin:5px 5px 5px 5px;
}
.Repeater .RepeaterText {
  float:left;
  vertical-align:top;
  margin:5px 5px 5px 5px;
}
.Repeater .RepeaterImageNoFloat {
  text-align:left;
  vertical-align:top;
  padding-left:5px;
}
.Repeater .RepeaterTextNoFloat {
  text-align:left;
  vertical-align:top;
  padding:5px;
}
.Repeater thead {
  font-size:15px;
  font-weight:normal;
  color:#2163A5;
  border-bottom:1px solid #D3D3D3;
}
.Column2b .Repeater .AlternatingItemTemplateOdd,
.Column2b .Repeater .AlternatingItemTemplateEven {
  width:466;
  height:50px;
}
.GreySearchBar {
  background-color:#7F7F7F;
  border-color:#385D8A;
  width:150px;
  color:White;
  cursor:default;
}
.GreySearchButton {
  background-color:#7F7F7F;
  border-color:#385D8A;
  width:50px;
  color:White;
}
.DescriptionText {
  font-size:14px;
  padding:10px;
  background:#D2E3F7;
}
.tab_white_31h_container .ajax__tab_header {
  font-family:verdana,tahoma,helvetica;
  font-size:11px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-line.gif) repeat-x bottom;
}
.tab_white_31h_container .ajax__tab_outer {
  margin:0;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-right.gif) no-repeat right;
  height:21px;
}
.tab_white_31h_container .ajax__tab_inner {
  padding-left:3px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-left.gif) no-repeat;
}
.tab_white_31h_container .ajax__tab_tab {
  height:13px;
  padding:4px;
  margin:0;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab.gif) repeat-x;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_outer {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-hover-right.gif) no-repeat right;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_inner {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-hover-left.gif) no-repeat;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_tab {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-hover.gif) repeat-x;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_outer {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-active-right.gif) no-repeat right;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_inner {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-active-left.gif) no-repeat;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_tab {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/tab-active.gif) repeat-x;
}
.tab_white_31h_container .ajax__tab_body {
  font-family:verdana,tahoma,helvetica;
  font-size:10pt;
  border:1px solid #999;
  border-top:0;
  padding:8px;
  background-color:#fff;
}
.rbx2only {
  display:none;
}
.GreenButton,
.RedButton,
.RedButton2 {
  display:inline-block;
  font:bold 14px Arial,Helvetica,Sans-Serif;
  cursor:pointer;
  *display:inline;
  *zoom:1;
}
.GreenButton span,
.RedButton span,
.RedButton2 span {
  margin:0 0 0 4px;
  display:block;
  padding:7px 12px 0 5px;
  cursor:pointer;
  color:White;
}
.GreenButton span a,
.RedButton span a,
.RedButton2 span a {
  color:White;
  text-decoration:none;
}
.GreenButton:hover,
.RedButton:hover {
  background-position:0 -30px;
  cursor:pointer;
}
.GreenButton span:hover,
.RedButton span:hover {
  background-position:right -30px;
  cursor:pointer;
}
.GreenButton:hover,
.RedButton:hover,
.RedButton2:hover {
  text-decoration:none;
}
.GreenButton {
  height:30px;
  background:url(/images/btn_green_30h_t1.png) no-repeat;
}
.GreenButton span {
  height:23px;
  background:url(/images/btn_green_30h_t2.png) no-repeat top right;
}
.Column2b .StandardBoxGrey {
  width:454px;
}
#CancelBuildersClubContainer h2,
#PaymentMethodsContainer h2,
#PaymentContainer h2,
#PayPalContainer h2,
#CashContainer h2,
#UpgradeCompleteContainer h2,
#ManageAccountUpgradesContainer h2,
#CancelAccountUpgradeContainer h2,
#AccountUpgradesConfirmationContainer h2 {
  font-family:Arial,Helvetica,Sans-Serif;
  color:#444;
  font-size:32px;
  font-weight:bold;
  letter-spacing:0;
}
#BuildersClubContainer #LeftColumn {
  margin-left:5px;
}
#BuildersClubContainer #RightColumn {
  margin-right:5px;
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:14px;
  color:#000;
  width:285px;
}
#BuildersClubContainer #RightColumn .StandardBox {
  width:273px;
}
#BuildersClubContainer #RightColumn .StrongRed {
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:14px;
  font-weight:bold;
  color:#f00;
}
#BuildersClubContainer #RightColumn h3 {
  font-weight:bold;
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:18px;
  color:#333;
}
#BuildersClubContainer #RightColumn .RefCode {
  font-weight:bold;
  font-family:Arial,Helvetica,Sans-Serif;
  font-size:30px;
  color:#666;
  display:block;
  margin-bottom:16px;
}
.StandardBox {
  padding:5px;
  margin-bottom:8px;
  background:var(--standardBox_01_bkg) top repeat-x #fff;
  border:1px solid #aaa;
  z-index:0;
}
.StandardBoxHeader,
.StandardBoxHeaderGray {
  height:33px;
  padding:0 7px 0 5px;
  text-align:left;
  z-index:2;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_black_33h_t1.png) no-repeat left top;
  font-family:Arial,Helvetica,sans-serif;
  font-size:20px;
  font-weight:bold;
  color:#fff;
  z-index:0;
}
.StandardBoxHeaderGray {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_gray_33h_t1.png) no-repeat left top;
}
.StandardBoxHeader span,
.StandardBoxHeaderGray span {
  display:block;
  width:100%;
  height:29px;
  padding:5px 5px 0 2px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_black_33h_t2.png) no-repeat right top;
  overflow:hidden;
}
.StandardBoxHeaderGray span {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_gray_33h_t2.png) no-repeat right top;
}
.StandardTabWhite {
  background:var(--tab_white_26h_t1) no-repeat left top;
  padding:0 4px;
  float:none;
  text-align:left;
}
.StandardTabWhite span {
  display:block;
  width:100%;
  *width:115%;
  height:26px;
  padding:5px 5px 0 9px;
  *padding-right:14px;
  background:var(--tab_white_26h_t2) no-repeat right top;
  font-family:Arial,Helvetica,sans-serif;
  font-size:14px;
  color:#000;
  font-weight:normal;
}
.StandardBoxWhite {
  position:relative;
  top:-1px;
  background:#fff;
  border:1px solid #ccc;
  padding:8px;
  color:Black;
}
.StandardTabGray,
.StandardTabGrayActive {
  position:relative;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t1.png) no-repeat left top;
  background-position:left 0;
  height:31px;
  padding:0;
  text-align:left;
  cursor:pointer;
  margin:0;
}
.StandardTabGray span,
.StandardTabGrayActive span {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t2.png) no-repeat right top;
  background-position:right 0;
  height:25px;
  padding:6px 16px 0 8px;
  margin:0 0 0 4px;
  color:#333;
  font-family:Arial,Helvetica,sans-serif;
  font-size:16px;
  font-weight:bold;
  display:block;
}
.StandardTabGray a,
.StandardTabGrayActive a {
  color:#333;
}
.StandardTabGrayActive {
  background-position:left -62px;
}
.StandardTabGrayActive span {
  background-position:right -62px;
}
.StandardTabGray:hover {
  position:relative;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t1.png) no-repeat left top;
  background-position:left -31px;
  height:31px;
  padding:0;
  z-index:2;
  text-align:left;
  margin:0;
}
.StandardTabGray span:hover {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t2.png) no-repeat right top;
  background-position:right -31px;
  height:25px;
  padding:6px 16px 0 8px;
  margin:0 0 0 4px;
  color:#333;
  font-family:Arial,Helvetica,sans-serif;
  font-size:16px;
  font-weight:bold;
  display:block;
}
.StandardBoxGray {
  position:relative;
  top:-2px;
  padding:8px 5px;
  background:var(--standardBox_01_bkg) top repeat-x #fff;
  border:1px solid #aaa;
}
#GroupsPeopleContainer .StandardTabGray,
#GroupsPeopleContainer .StandardTabGrayActive {
  position:relative;
  top:2px;
}
.tab_white_31h_container .ajax__tab_header {
  background:none;
}
.tab_white_31h_container .ajax__tab_outer {
  background:none;
  height:auto;
}
.tab_white_31h_container .ajax__tab_inner {
  position:relative;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t1.png) no-repeat left top;
  height:31px;
  padding-left:0;
  z-index:2;
}
.tab_white_31h_container .ajax__tab_header .ajax__tab_tab {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t2.png) no-repeat right top;
  height:25px;
  padding:6px 16px 0 8px;
  margin:0 0 0 4px;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_outer {
  background:none;
  height:auto;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_inner {
  position:relative;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t1.png) no-repeat left top;
  background-position:left -31px;
  height:31px;
  padding-left:0;
  z-index:2;
}
.tab_white_31h_container .ajax__tab_hover .ajax__tab_tab {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t2.png) no-repeat right top;
  background-position:right -31px;
  height:25px;
  padding:6px 16px 0 8px;
  margin:0 0 0 4px;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_outer {
  background:none;
  height:auto;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_inner {
  position:relative;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t1.png) no-repeat left top;
  background-position:left -62px;
  height:31px;
  padding-left:0;
  z-index:2;
}
.tab_white_31h_container .ajax__tab_active .ajax__tab_tab {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_white_31h_t2.png) no-repeat right top;
  background-position:right -62px;
  height:25px;
  padding:6px 16px 0 8px;
  margin:0 0 0 4px;
}
.tab_white_31h_container .ajax__tab_body {
  position:relative;
  top:-2px;
  padding:8px 5px;
  background:var(--standardBox_01_bkg) top repeat-x #fff;
  border:1px solid #aaa;
}
.Column2a {
  float:left;
}
.Column3b {
  float:left;
}
.Column2c {
  float:left;
  margin-left:10px;
}
.Column2d {
  float:left;
}
.Column1e {
  width:140px;
}
.Column2e .StandardBoxHeaderGray {
  margin:0;
  width:726px;
}
.Column2e .StandardBoxGray {
  width:726px;
}
.Column2f {
  float:left;
}
div.rbx2only {
  display:block;
}
.rbx2only {
  display:inline;
}
.rbx2hide {
  display:none;
}
#RobloxCentralBank {
  overflow:hidden;
}
.transparentBkg {
  background-color:Transparent;
}
.FriendRequestsPane {
  width:890px;
}
.Shadow {
  display:none;
}
.ShadowedStandardBox .Header {
  height:33px;
  padding:0 7px 0 5px;
  text-align:left;
  z-index:2;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_black_33h_t1.png) no-repeat left top;
  font-family:Arial,Helvetica,sans-serif;
  font-size:20px;
  font-weight:bold;
  color:#fff;
}
.ShadowedStandardBox .Header span {
  display:block;
  width:100%;
  height:29px;
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/tab_black_33h_t2.png) no-repeat right top;
  overflow:hidden;
  height:26px;
  padding:7px 4px 0 3px;
}
.ShadowedStandardBox .Content {
  padding:5px;
  margin-bottom:8px;
  background:none;
  border:0;
  border-bottom:1px solid #ccc;
}
a.rss_icon {
  background:url(/web/20120611211431im_/http://www.roblox.com/images/cssspecific/rbx2/topNav_rss.png) no-repeat;
}
.Column1d .StandardTabWhite,
.Column2d .StandardTabWhite {
  width:auto;
}
.MyRobloxContainer {
  width:890px;
}
.BCHat {
  margin-top:1px;
}

    </style>`));

    $('#premium-landing-page').replaceWith(`<div id="BuildersClubContainer">
        <!--<div id="JoinBuildersClubNow"><img id="ctl00_cphRoblox_HeaderImage" src="../images/JoinBuildersClubNow.png" alt="Join Builders Club Now!" style="border-width:0px;" /></div>!-->
        <div id="LeftColumn" class="StandardBox">
            <div id="ctl00_cphRoblox_MembershipPanelStyle2">
                <div id="MembershipOptions" style="margin-bottom: 18px; position: relative; float: left">
                    <span style="position: absolute; top: 10px; right: 0px">
                        <input type="image" name="ctl00$cphRoblox$ctl00" src="/images/Buttons/questionmark-25x25.png" onclick="window.open('/Parents/BuildersClub.aspx');" style="width:25px;border-width:0px;position: absolute;
                            right: 35px; top: 3px">
                        <div onclick="showBC();" class="bc_iconset bc_icon" style="position: absolute; right: 0px;
                            cursor: pointer; border: none" title="Classic Builders Club">
                        </div>
                    </span>
                    <input type="hidden" id="HasBCMembership" value="False">
                    <div id="BCRow" style="float: left; margin-bottom: 10px; display: block;">
                        <div style="height: 35px;">
                            <h1 id="BuildersClubTitle" style="width: 480px; margin: 0;">
                                Builders Club</h1>
                        </div>
                        <div id="OneMonth" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_BCMonthlyImageLinkButton" href="/upgrades/paymentmethods?ap=480"><div id="ctl00_cphRoblox_BCMonthlyImageLink" class="upgrades_enabled bcmonthly">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">
                            </div>
                        </div>
                        <div id="SixMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_BC6MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_BC6MonthsImageLink" class="upgrades_enabled bc6">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="TwelveMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_BC12MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_BC12MonthsImageLink" class="upgrades_enabled bc12">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="Lifetime" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_BCLifetimeImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_BCLifetimeImageLink" class="upgrades_enabled bclife">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                    </div>
                    <div id="TBCRow" style="float: left; margin-bottom: 10px">
                        <div style="clear: both; height: 35px;">
                            <h1 id="TurboBuildersClubTitle" style="margin: 0;">
                                <span class="TurboSpan">Turbo</span> Builders Club</h1>
                        </div>
                        <div id="TurboMonthly" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_TBCMonthlyImageLinkButton" href="/upgrades/paymentmethods?ap=481"><div id="ctl00_cphRoblox_TBCMonthlyImageLink" class="upgrades_enabled tbcmonthly">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="TurboSixMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_TBC6MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_TBC6MonthsImageLink" class="upgrades_enabled tbc6">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="TurboTwelveMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_TBC12MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_TBC12MonthsImageLink" class="upgrades_enabled tbc12">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="TurboLifetime" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_TBCLifetimeImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_TBCLifetimeImageLink" class="upgrades_enabled tbclife">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                    </div>
                    <div id="OBCRow" style="float: left; margin-bottom: 10px">
                        <div style="clear: both; height: 35px;">
                            <h1 id="OutrageousBuildersClubTitle" style="margin: 0;">
                                <span class="OutrageousSpan">Outrageous</span> Builders Club
                            </h1>
                        </div>
                        <div id="OutrageousMonthly" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_OBCMonthlyImageLinkButton" href="/upgrades/paymentmethods?ap=482"><div id="ctl00_cphRoblox_OBCMonthlyImageLink" class="upgrades_enabled obcmonthly">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="OutrageousSixMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_OBC6MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_OBC6MonthsImageLink" class="upgrades_enabled obc6">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="OutrageousTwelveMonths" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_OBC12MonthsImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_OBC12MonthsImageLink" class="upgrades_enabled obc12">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                        <div id="OutrageousLifetime" class="MembershipButton">
                            <div class="BuildersClubButton">
                                <a id="ctl00_cphRoblox_OBCLifetimeImageLinkButton" href="javascript:void(0)"><div id="ctl00_cphRoblox_OBCLifetimeImageLink" class="upgrades_enabled obclife">
                                    </div></a>
                            </div>
                            <div class="BCButtonLabel">

                            </div>
                        </div>
                    </div>

                </div>

</div>
            <br>
            <br>
            <div style="height: 15px; clear: both">
                &nbsp;</div>
            <!-- Spacer -->
            <table id="upgrades-membership-options" style="padding-top: 10px;">
                <thead>
                    <tr>
                        <th scope="col">
                        </th>
                        <th scope="col" class="LeftText">
                            Benefits
                        </th>
                        <th scope="col" class="leftBorder">
                            <p style="line-height: 20px">
                                Free Account</p>
                        </th>
                        <th scope="col" class="leftBorder BCColumn" style="display: table-cell;">
                            <div>
                                <p style="line-height: 20px">
                                    Builders Club</p>
                            </div>
                        </th>
                        <th scope="col" class="leftBorder">
                            <div>
                                <p style="line-height: 20px">
                                    Turbo Builders Club</p>
                            </div>
                        </th>
                        <th scope="col" class="leftBorder">
                            <div>
                                <p style="line-height: 20px">
                                    Outrageous Builders Club</p>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="odd">
                        <td>
                            <div class="icons maps_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Active Places
                        </td>
                        <td class="leftBorder">
                            1
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            10
                        </td>
                        <td class="leftBorder">
                            25
                        </td>
                        <td class="leftBorder">
                            100
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="icons money_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Daily ROBUX
                        </td>
                        <td class="leftBorder">
                            None
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            15 R$
                        </td>
                        <td class="leftBorder">
                            35 R$
                        </td>
                        <td class="leftBorder">
                            60 R$
                        </td>
                    </tr>
                    <tr class="odd">
                        <td>
                            <div class="icons shirt_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Sell Stuff
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="icons ads_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            See Ads
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            No
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                    </tr>
                    <tr class="odd">
                        <td>
                            <div class="icons bc_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Virtual Hat
                        </td>
                        <td class="leftBorder">
                            None
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            <div class="icons bc_icon">
                            </div>
                        </td>
                        <td class="leftBorder">
                            <div class="icons tbc_icon">
                            </div>
                        </td>
                        <td class="leftBorder">
                            <div class="icons obc_icon">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="icons gear_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Bonus Gear Item
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            No
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                    </tr>
                    <tr class="odd">
                        <td>
                            <div class="icons money_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Signing Bonus
                        </td>
                        <td class="leftBorder">
                            None
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            100 R$ for initial purchase
                        </td>
                        <td class="leftBorder">
                            100 R$ for initial purchase
                        </td>
                        <td class="leftBorder">
                            100 R$ for initial purchase
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="icons groups_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Create Groups
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes (10)
                        </td>
                        <td class="leftBorder">
                            Yes (20)
                        </td>
                        <td class="leftBorder">
                            Yes (100)
                        </td>
                    </tr>
                    <tr class="odd">
                        <td>
                            <div class="icons groups_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Join Groups
                        </td>
                        <td class="leftBorder">
                            Yes (5)
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes (10)
                        </td>
                        <td class="leftBorder">
                            Yes (20)
                        </td>
                        <td class="leftBorder">
                            Yes (100)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="icons badges_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Create Badges
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                    </tr>
                    <tr class="odd">
                        <td>
                            <div class="icons beta_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            BC Beta Features
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                    </tr>

                    <tr class="even">
                        <td>
                            <div class="icons personalserver_icon">
                            </div>
                        </td>
                        <td class="LeftText">
                            Personal Servers
                        </td>
                        <td class="leftBorder">
                            No
                        </td>
                        <td class="leftBorder BCColumn" style="display: table-cell;">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                        <td class="leftBorder">
                            Yes
                        </td>
                    </tr>

                </tbody>
            </table>
            <div id="WindowsOnlyWarning">
                <p>
                    For more information, read our
                    <a id="ctl00_cphRoblox_FAQHyperLink" href="/Parents/BuildersClub.aspx">Builders Club FAQs</a>.</p>
                <p>
                    All items and gear are virtual.</p>
                    <p></p>
                <p>
                   All Sales are final. Please see our <a href="/info/TermsOfService.aspx">Terms &amp; Conditions</a> for more information.
                 </p>
            </div>
        </div>
        <div id="RightColumn">
            <div class="StandardTabWhite">
                <span>Manage Account</span></div>
            <div class="StandardBoxWhite" style="float: none">

                <div id="ctl00_cphRoblox_LoggedOutPanel">

                    <div id="ManageAccountButton">
                        <a href="/Login/Default.aspx?ReturnURL=%2fUpgrades%2fBuildersClubMemberships.aspx">
                            <img src="data:image/png;base64,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" name="manageaccountbuttonimg" onmouseout="document.manageaccountbuttonimg.src='data:image/png;base64,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'" onmouseover="document.manageaccountbuttonimg.src='data:image/png;base64,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'" alt="You must login to view your account.">
                        </a>
                    </div>
                    <p>
                        If you forgot your username or password, or you want to cancel the membership of
                        one or more accounts, please contact customer service at info@roblox.com.
                    </p>

</div>


<div id="bcPromo" class="modalPopup blueAndWhite" style="width: 410px; min-height: 200px; display: none; *position:absolute; *top: -200px;">
    <div id="Div1" class="simplemodal-close">
        <a onclick="BCPromo.close()" class="ImageButton closeBtnCircle_35h" style="cursor: pointer; margin-left:415px; position:absolute; top:-18px; left:-10px"></a>
    </div>
    <div style="padding: 0px 0px 10px 0px; text-align:center;">
        <div class="titleBar">
            Recurring Builders Club 1 cent Promo
        </div>
        <div style="padding: 0px 10px;">
            <div style="margin-top: 20px;">
                <div id="modal_success" class="SuccessBox"><img src="https://s3.amazonaws.com/images.roblox.com/6acd50d6f06cb4801309f2334d6728ab.png" alt="Success"><span class="BoxTextAligned">You have successfully upgraded your account!</span></div>
                <div style="float:left; padding-right:5px;">

                   <img src="https://s3.amazonaws.com/images.roblox.com/40e8e87027161ccd81486cabbca65af9.png" alt="Buy BC">

                </div>
                <div style="display:inline; line-height:15px; margin-top:20px;">
                    Sign up for recurring Builders Club and you will receive the first month for $0.01.
Following the first month your credit card will be automatically billed for 5.95 per month for continuing Builders Club.
You may cancel any time after trying Builders Club for 10 days.
                </div>
            </div>
            <br><br>
            <div style="clear: left; padding-top: 10px;">
                <a onclick="BCPromo.close()" style="color: Green; padding-right: 25px;">
                    <span>No Thanks.</span>
                </a>
                <a href="/Upgrades/Payment.aspx?ap=1&amp;promo=473-4-31" class="GreenButton">
                    <span>Take Me There NOW!</span>
                </a>
            </div>
        </div>
    </div>

    <input name="ctl00$cphRoblox$BCPromo$PrepaidRedeemed" type="button" id="ctl00_cphRoblox_BCPromo_PrepaidRedeemed" style="display:none">
</div>


<script type="text/javascript" language="javascript">
    BCPromo = new Object();
    BCPromo.open = function() {
        var modalProperties = { overlayClose: true, escClose: true, opacity: 80, overlayCss: { backgroundColor: "#000"} };
        $("#bcPromo").modal(modalProperties);
    }
    BCPromo.close = function() {
        $.modal.close(".bcPromo");
    }
    $(function() {
        if ("False" == "True") { BCPromo.open(); }
    });

</script>


            </div>


<div class="StandardBoxWhite" style="text-align:center;margin-bottom:8px;"><a class="BuyRobuxBtn" href="/Upgrades/Robux.aspx"></a></div>

<div id="RobuxBCPane" class="StandardBoxWhite" style="text-align:center;">
    <div class="cardPanelLeft">
        <a href="/Gamecard"><img src="data:image/png;base64,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"></a>
    </div>
    <div class="cardPanelRight">

            <a href="/Gamecard"><img class="centeredImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAAAZCAYAAADUicu/AAAHXklEQVRo3u2aeVBXVRTHDyLmUiiuqFhZY7iAS5mYmluOgmamlrlgCoW5samI9Iczua9TTZk6Wq5hkssPEQlwScqsQEYTl5pUdDRFHTSXEtTf69wf580cz9z3+/3AGYZpfn98Bt4599133/3e5Zz7ftB4xnfgwX1g0hGYvmwxGJkvQenO/uVlPHKLuIS0KG8dHhEqV7B5iMEI8ghWtQWLZGKVIo08glVtwYYxwa4jNT2CVYJgM5cvQsFerIhg/ZhgZypwv0ew8guWD4nLF4KRpQQbwDuzD5KKtHPS4R2ZYL+5EOcDZDvi5RHscQSbehhCP1oHxu6eYE99zexIH+QqCWFHJlqI0AApoXL7LcrUQtYxYT+Vgj2NNEH8kZqaRvqTvylSXfi8yK7KPIt4u/ni3ZEFyHxkRhUWqDHSGglEmimbT9z30HxmOpTsCEXRelhFf4pt1PlSENOfqvF1Rwo1dQVxwf5CSpBS5AvR4DCym/4Fwj8XuU++Y+UQTAllMKqqYF+xNmYqm9+0bKgWfQh+3vguGPvbQikKhx0ZhuRrOvoCEipE+Rg5hLwh7Ema+xW7kAAu2K+sUbmiwUmiY/cJfz7zbS5HR8Sx+85VYcE2sXYeUDb/GRlQMzYHmqBwp7YOAyO7vSmaYgzyk6bTlyHVLZbAlkiO5p5NSBdd0PEha9Qd5EnW4C+FYEViWSxivon/Q8E2sHammPamCekAk/OgQfwBOLdtcFmIvyNMnmjkCgFqWQjWX5TbgXR2FiX2EqKEsAafET5FMPkChP1psndCJtOytxiZTjZXgrVCRhHmoBiNLEJm0z5i3t+WBpryjbPo7C7IVFrGlyDTkCBNGfOZ9ckWSe1+gv6a7cxDBiNDkRdM0VpMz4Ri7EgjvRuUPBo1KsKRNJp5ziJCFWSkOBOKC9ZQdPxIFmyYNr5sDiX/cGbLJ1uKRmCTT1wIlsBs6v/Pxf12pA3SR1N3Oqu7BnLQSTsWsrLJzD6KRDWv/Wiw6epYWjbT9gBEFcCo+avBntEFHtj6VSQ3q1AexveiWWQbStdXxUiLJ/9Szf51ntmuIQ/Fi75D5eI1gkU66WRep5UvhkWut1zc87om+DkiytQTg4iz2LGfOQQ7CcPnrgUjIwQeVqJgS1hjtgvbCWQAjXB1/TX5U9k975NNdUQ0UpeNYj5TTpBtIrMVki1cdMoxsu3TdFgsEkHRqWk7zZ45DJmE1GG2jazsYbLN1NSdRjNNzdTlYpXpT5Hz8w6xMIkOStwFN1Eoe3p33ZKo9rJfkLlORKhNgUo28rK7gkWwhv0pIqRcGrXn2UiU+9szmj3kVRJwBSv3r0acQrZfmbZ7TPQ6QpgV7BlzmL0Y8dG0Q+3Rg5D1oqzyTdHNHIug49tHgg4UqyX+fwOTZ4ug47QIJqw+pcSKcmm66FAK1o417CbZsul6JV0fYiM5mC0719kLPkUj+YbFUnJPI44p2Bgxu3jHnWC+t5j9TWb/m4ms9uVvkNsW7TAHTpRomxR8DfPvUbYmGNbXiPkRAhPT4AqKZGR1ciTR1KFjkTxNiK5yrzpiVpn/ByIHNffsREKcnSWeZY1TM+4P9r/yb6Hri7TsPaDrZPLXF3UojiIF7PofjTg6wY6Ijjsq2mbaR4qB5k0R5mVNO06z69t0/wRmu4JUcyWY77S94BOTA5dShmDi3AZKtoeZ54i/azr9vCZxtiHFyAQ3E+csxE8n2GbWuGw63TBoSVH+eXR9Q+wHkeRfyGwqUOlJ9hA3BQsXHczbdpz53mP20ZplLpHZLiBdyT7QhWBFmqO5tcxvU7Z6mDD7xPwAB9ZHgrE3GO6Xza4ITUfbxKwCOsh9QP7dmiWvB4ks62qsE2yceCFzmagnXvihiLyaiyXUEEdc/SpJsCtky2K2ORazUSeYGmS1xHPXyVMe/4QMqB130LEsntwywrF/0ZLITzisDn/9mWA5FmVqIBtYXeOtlsT2mrWeH0U11Ph5ZMY7qoAS6UCx/9x1EnSMeUzBisiWKY7aAijRPiv2Oxmt6gTjS2IJpSMjMejwg0l50HqWDey7e4A9rSdQULEKae8kyuvMhChwERFOQT5jn2U6qGeASDhlzrJKvMBF4bcxX7yTHOmWOOjl4lwk21ghOH/uKeaLYvZwzawZr0m45cphUOQbJZZUKdgIi/fp2AhnGkw4DhtWJvCl0RUDmGCFbuZevkgylZ8tQ+CO4nwwXPi70kjURWxelMPJl5tKs/MYXVcTHV2qidgui+de0yTIQPkff5a5B2Vo2hFBn0tM8X3FMxW1NWnBVp1g6hDYK/owtE7aCXcxDzN29Xan899mghWLaNEKb+Q5JFj9BkR3BleX9qteFmd0vuR7xcI/iBLSaBoA3NeNhG1GCaiiN/nUd7VQopvm+5npC2D2plSHsvelVcL0DaEAROVaHZi9OtXvTXWZ7ejr5PPQQKoriZZhxwF5w4SynwzY1kS7+5OBGBFMNPf8RKASaaS+QE/OheTVcY58zI0Oj2W/S7yDtCqvYP8BizUxi4cDBMUAAAAASUVORK5CYII="></a><br>

            <a href="/Gamecard"><img class="centeredImage" src="data:image/png;base64,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"></a><br>

            <a href="/Gamecard"><img class="centeredImage" src="data:image/png;base64,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"></a><br>

            <a href="/Gamecard"><img class="centeredImage" src="data:image/png;base64,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"></a>
            <a href="/Gamecard" style="margin-left:8px;"><img class="centeredImage" src="data:image/png;base64,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"></a><br>

            <a href="/Gamecard"><img class="centeredImage" src="data:image/png;base64,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"></a><br>

    </div>
    <div id="GameCardButtonContainer">
        <a href="/Gamecard" class="GreenButton"><span>ROBLOX Card</span></a>
    </div>
</div>


                <a href="/Upgrades/GiftCards.aspx"><div id="BCGiftCardXLink" style="height:90px; width:285px;"></div></a>


<div class="StandardBoxWhite" style="text-align:center; overflow:hidden;">
    <div id="ctl00_cphRoblox_rbxMicroPayBCPane_MicroPayLink" class="PayTypesLeftColumn" style="padding-top: 8px;">
        <a href="/Micropay"><img alt="Boku" src="data:image/png;base64,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"></a>
    </div>
    <div class="PayTypesLeftColumn">
        <a href="/RixtyPIN"><img alt="Rixty" src="data:image/png;base64,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"></a>
    </div>
    <div class="PayTypesRightColumn" style="float:none; margin-left:auto;margin-right:auto;">
        <a href="https://itunes.apple.com/us/app/roblox-mobile/id431946152?mt=8"><img alt="iTunes" src="data:image/png;base64,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"></a>
    </div>
    <div class="PayTypesCenter"></div>
</div>


<div class="StandardTabWhite"><span>Parents</span></div>
<div id="ParentsBCPane" class="StandardBoxWhite">
    <p style="clear: left;">Learn more about builders club and how we help keep kids safe.</p>
    <p style="text-align:center;"><a href="/Parents/BuildersClub.aspx" class="GreenButton" style="margin:15px 0;"><span>ROBLOX Parents</span></a></p>
    <h3>Other Accounts</h3>
    <p>To cancel the membership for one or more other accounts, please contact customer service at <a href="mailto:info@roblox.com">info@roblox.com</a>.</p>
    <p><span class="StrongRed">Please Note:</span> You can cancel monthly recurring membership any time before the renewal date. 6 and 12 month memberships cannot be canceled.  Memberships are not refundable.</p>

</div>
            <div class="StandardTabWhite">
                <span>Refer a Friend</span></div>
            <div id="ctl00_cphRoblox_ReferAFriend" class="StandardBoxWhite">
                <a href="/My/Share/ReferralLeaderboards.aspx" title="Referral Leaderboards" style="text-decoration: none;
                    cursor: pointer"></a>
                <p style="clear: left">
                    Win a <span class="StrongRed">
                        400
                        ROBUX bonus</span> when you invite friends to join the Builders Club. Remember
                    to give them your account name: your friends will need to tell us who referred them.
                </p>
            </div>


<div class="StandardTabWhite"><span>Please Upgrade Me!!</span></div>
<div id="UpgradeMeBCPane" class="StandardBoxWhite">
    <h3>Need Builders Club Now?</h3>
    <p style="clear: left">Fill out our fun, interactive form, and print it out or send it to your friends and family!</p>
    <p style="text-align:center"><a href="/My/Share/PleaseUpgradeMe.aspx" class="GreenButton" style="margin:6px 0;"><span>Please Upgrade Me!</span></a></p>
    <p><span class="StrongRed">Warning:</span> "Please Upgrade Me!" may be very convincing.</p>
</div>


        </div>
        <div style="clear: both;">
        </div>
    </div>`);
    if ($('[data-ispremiumuser="true"]').length >0) {
        $('.upgrades_enabled').removeClass('upgrades_enabled').addClass('upgrades_disabled');
        $('.upgrades_disabled a').attr('href','javascript:void(0)');
    };
    if ($('#HeaderContainer').length >0 | $('#SmallHeaderContainer').length >0) {
        $('#AdvertisingLeaderboard').append($(`<img src="/images/buildersclubad728x90.jpg" alt="Buy Builders Club" style="margin-bottom: 11px">`));
    };
})();