// ==UserScript==
// @name FogbugzDarkMode
// @namespace https://greasyfork.org/users/690175
// @version 1.0
// @description Change most elements in FogBugz to a dark visual style
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/411897/FogbugzDarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/411897/FogbugzDarkMode.meta.js
// ==/UserScript==

(function() {
let css = `.case-list tr.bug-grid-row.alt {
  background-color: #111 !important;
}

.case-list tr.bug-grid-row {
  background-color: #222 !important;
  border-style: solid !important;
  border-color: #111 !important;
}

a.case.not-visited {
  color: #6FAEBE !important;
}

a.case.visited {
  color: #A280C6 !important;
}

.bug-grid-header {
  background-color: #000 !important;
}

.case-list th, .case-list .grid-column-header-drag-helper {
  background-color: #000 !important;
  border-color: #000 !important;
  border-style: solid !important;
}

a.header-sort-toggle {
  color: #8EC4CF !important;
  padding-left: 3px !important;
  padding-top: 0px !important;
  border-top-width: 0px !important;
  margin-top: 0px !important;
}

div.grid-column-contents {
  border-color: #F1F1F1 !important;
  border-style: none !important;
  color: #C4C3C3 !important;
}

span.grid-title-extra {
  color: #9A9898 !important;
}

input.grid-row-checkbox {
  background-color: #3F3F3F !important;
}

div svg use {
  fill: rgb(153, 153, 153)
}

div svg.svg-icon use {
  fill: rgb(87, 131, 136) !important !important;
}

#main {
  background-color: #191919 !important;
  
}

body {
  background-color: #000000 !important;
  color: #ccc !important;
}

#filter-bar-title {
  color: #eee !important;
}

#filter-bar {
  background-color: #000000 !important;
  border-style: none !important;
  color: #ccc !important;
}

span[class$="clickable"] {
  color: #619DA1 !important;
}

.action-bar>.action-button.disabled {
  background-color: #020202 !important;
  border-color: #020202 !important;
  color: #676767 !important;
}

#filter-view-selector {
  background-color: #222 !important;
  border-color: #000000 !important;
}

span.action-button {
  background-color: #030303 !important;
}

.action-button:not(.disabled) {
  background-color: #111 !important;
  border-style: solid !important;
  border-color: #000000 !important;
  color: #ddd !important;
}

div.gw-nav-pane {
  background-color: #030303 !important;
}

.gw-btn {
  background-color: #333 !important;
  border-style: solid !important;
  border-color: #000000 !important;
}

.gw-header-main {
  background-color: #000000 !important;
}

a.gw-nav-cases {
  background-color: #000000 !important;
  border-color: #222 !important;
}

form.gw-search.submit-on-enter.has-search-guide {
  background-color: #000000 !important;
  border-color: #222 !important;
}

input.search-box {
  background-color: #000000 !important;
  border-style: solid !important;
  border-color: #222 !important;
  color: #FFFFFF !important;
}

input.search-box:placeholder {
  color: #FCFCFC !important;
}

.auto-complete-panel.panel {
  background-color: #000 !important;
  border-color: #222 !important;
}

tbody tr th {
  background-color: #010101 !important;
  color: #ccc !important;
  border-color: #222 !important;
}

table.mini-report {
  border-color: #222 !important;
  background-color: #000000 !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  border-style: solid !important;
}

#case-list-mini-report tbody tr {
  border-color: #000000 !important;
}

tbody tr td {
  border-color: #222 !important;
  color: #8C8C8C !important;
}

.list-group-table::-webkit-scrollbar {
  display: none !important;
}

a.gw-logo.gw-logo-full.nav-unless-mobile {
  background-color: #000000 !important;
}

.gw-nav-link-icon img {
  border-radius:5px !important;
  filter: brightness(85%)
}

.gw-nav-link.active {
  background-color: #333 !important;
}

.gw-nav-submenu.active {
  background-color: #333 !important;
  color: #ddd !important;
}

.notification-container {
  border-color: #000000 !important;
}

#notification-list li {
  border-color: #000000 !important;
}

.notifications-popup.dropdown-menu {
  border-style: none !important;
}

#notification-list {
  border-color: #000000 !important;
  color: #ccc !important;
}

.gw-wrapper h1, .gw-wrapper h2, .gw-wrapper h3 {
  color: #ccc !important;
}

.notification-text span {
  color: #ccc !important;
}

.notification-container.notification-unread {
  background-color: #000000 !important;
}

.gw-nav-submenu ul:not(.item-actions)>li a {
  color: #619DA1 !important;
}

.popup  {
  background-color: #222 !important;
  color: #ddd !important;
}

.popup .case-popup {
  background-color: #070707 !important;
}

.popup .case-popup dl {
  background-color: #222 !important;
  border-color: #000000 !important;
}

.popup .case-popup .comment {
  background-color: #333 !important;
  border-color: #000000 !important;
}

.case-list th .grid-column-contents, .wiki-page-list th .grid-column-contents, .case-list .wiki-grid-header .grid-column-contents, .wiki-page-list .wiki-grid-header .grid-column-contents, .case-list .grid-column-header-drag-helper .grid-column-contents, .wiki-page-list .grid-column-header-drag-helper .grid-column-contents {
  padding-top: 4px !important;
}

div a span {
  color: #619DA1 !important;
}

.filterbar-choices-root .list-choices-item, .filterbar-refine-further-popup .list-choices-item, .filterbar-more-popup .list-choices-item, .filterbar-view-popup .list-choices-item {
  color: #ddd !important;
}

.list-choices-item:hover {
  background-color: #000 !important;
}

.case-list tr.bug-grid-row.selected {
  background-color: #2C3C3B !important;
  border-color: #2C3C3B !important;
  border-style: solid !important;
}

.gw-wrapper:not(.nav-is-mobile) .gw-nav-submenu {
  border-color: #000000 !important;
}

.bug-grid-row.selected {
  background-color: #E5A313 !important;
  border-style: none !important;
}

checkbox-grid-column {
  border-color: #000000 !important;
}

.case-list td {
  border-style: none !important;
}

.gw-nav-submenu ul:not(.item-actions)>li:hover {
  background-color: #222 !important;
}

#filter-bar #filter-description .filter-axis-clickable, .case-list th .header-sort-toggle, .case-list .grid-column-header-drag-helper .header-sort-toggle, a:link, a.novisited:visited, #mainArea a.novisited:visited, #filter-bar #filter-description .filter-description-sort-element .filter-sort-clickable {
  color: #6FAEBE !important;
}

.selected {
  background-color: #222 !important;
}

.case .top {
  background-color: #222 !important;
}

div section article {
  background-color: #222 !important;
  border-color: #0B0B0B !important;
  color: #ccc !important;
}

div section article h1 {
  color: #ddd !important;
  border-color: #010101 !important;
}

div.top.clearfix {
  border-color: #030303 !important;
}

label, label div {
  color: #ccc !important;
}

a.case {
  color: #619DA1 !important;
}

nav.clear.active {
  background-color: #111 !important;
  border-style: none !important;
  border-color: #FFFFFF !important;
}

.case input, .case textarea {
  background-color: #050505 !important;
  color: #ddd !important;
  border-style: none !important;
}

div.select-droplist.droplist {
  border-color: #111 !important;
  border-style: solid !important;
  background-color: #090909 !important;
}

.droplist-popup-item {
  background-color: #222 !important;
  color: #619DA1 !important;
}

.droplist-popup-item:hover {
  background-color: #000000 !important;
}

.droplist-popup {
  border-color: #030303 !important;
}

.chunky-droplist.droplist {
  background-color: #000000 !important;
  border-style: none !important;
  border-radius: 5px !important;
}

.droplist-chunks {
  border-style: none !important;
}

.changes div {
  color: #999 !important;
}

.event.email .event-content .body {
  background-color: #222 !important;
  color: #eee !important;
}

.event.email .event-content .body .body-content {
  background-color: #333 !important;
}

.event.email .event-content .body .bodycontent {
  background-color: #222 !important;
}

.event.email .event-content {
  background-color: #111 !important;
}

.event-content {
  color: #ccc !important;
}

.event .emailFields {
  color: #aaa !important;
}

#account-info {
  background-color: #111 !important;
  border-style: none !important;
  border-radius: 5px !important;
  padding: 2px 5px !important;
}

#account-info .image {
  border-radius: 2px !important;
  margin-right: 3px !important;
}

#bc-payments {
  border-color: #151515 !important;
  color: #ddd !important;
  box-shadow: 0 1px 20px -5px black
}

.m-btn {
  background-color: #111 !important;
  border-color: #050505 !important;
  color: #bbb !important;
}

.event .buttons #btnSubmit, .event .buttons #btnSendAndClose, .event .buttons #btnResolveAndClose {
  background-color: #194038 !important;
}

span.status {
  box-shadow: 0 1px 1px #000 !important;
}

.case-list .bug-grid {
  border-style: none !important;
}

.list-choices-popup a {
  color: #bbb !important;
}

.event .buttons #btnSendAndClose:not(.hidden)+#btnSubmit, .event .buttons #btnResolveAndClose:not(.hidden)+#btnSubmit {
  color: #ddd !important;
  background-color: #444 !important;
}

#sEvent:active {
  border-style: none !important;
}

#sEvent:focus {
  border-style: none !important;
}

.event .editor>textarea:active, .event .editor>textarea:focus, .event .editor>textarea.active {
      box-shadow: 0 0 0 2px #4ba2d477 !important;
}

.href {
  color: #68B0A1 !important;
  border-style: none !important;
  border-color: #68B0A1 !important;
}

span.droplist-chunk-text {
  color: #030E08 !important;
}

.chunky-droplist .droplist-chunk .droplist-chunk-remove svg use {
  fill: rgba(0,0,0,0.7) !important;
}

.case-lightbox-mask {
  background-color: rgb(0, 11, 14) !important;
  opacity: 0.75
}

span.list-add-case.disabled {
  color: #E3E0E0 !important;
}

.favorite-toggle.favorite svg use {
  fill: rgb(255, 196, 0) !important;
  stroke: rgb(175, 134, 0); !important;
}

button.gw-nav-link {
  cursor: pointer !important;
}

button.gw-nav-link.active {
  color: #bbb !important;
}

.gw-overflow .gw-overflow-menu {
  background-color: #222 !important;
  padding-top: 5px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
}

.gw-overflow .gw-overflow-menu li:hover {
  background-color: #111 !important;
}

input {
  background-color: #000000 !important;
  color: #ddd !important;
}

textarea {
  overflow-x: hidden !important;
  overflow-y: scroll !important;
}

section.case.case-status-active {
  box-shadow: 0 5px 40px -10px black !important;
}

.event .body {
  background-color: #111 !important;
}

.event .body:before {
  border-color: transparent #111 transparent transparent !important;
}

span.package-title {
  color: #bbb !important;
  
}

#bc-payments span :not(a) {
  color: #bbb !important;
}

.event.borrowed>header {
  background-color: #2D2740 !important;
}

span.toggle-borrowed-email.merge-toggle.enabled {
  background-color: #00000011 !important;
  color: #ccc !important;
  border-color: #00000099 !important;
}

nav.clear.resolved {
  background-color: #111 !important;
}

section.events-selector-option {
  border-style: none !important;
}

.case .events-selector .events-selector-container {
  border-color: #000000 !important;
}

#bulkEventListHeader {
  background-color: #000000 !important;
}

#bc-payments li.highlight {
  background-color: #000000 !important;
  border-color: #E2CF15 !important;
  border-style: solid !important;
  border-width: 1px
}

.bc-dropdown .bc-dropdown-items {
  background-color: #222 !important;
  border-color: #000000 !important;
}

.bc-dropdown .bc-dropdown-submenu {
  background-color: #222 !important;
  border-color: #000000 !important;
}

.bc-dropdown .bc-dropdown-items .bc-dropdown-item:hover, .bc-dropdown .bc-dropdown-items .bc-dropdown-submenu-link:hover {
  background-color: #000000 !important;
}

.bc-dropdown .bc-dropdown-submenu-link.open {
  background-color: #111 !important;
  color: #68B0A1 !important;
}

.bc-dropdown .bc-dropdown-submenu-link {
  color: #68B0A1 !important;
}

.bc-dropdown.open .bc-dropdown-icon {
  background-color: #222 !important;
  border-color: #000000 !important;
  box-shadow: 0px 1px black !important;
  color: #68B0A1
}

.bc-dropdown .bc-dropdown-submenu-link:before {
  color: #bbb !important;
}

#sEvent {
  color: #eee !important;
}

.bc-dropdown.email-switcher-dropdown {
  background-color: #00000000 !important;
}

.bc-dropdown.email-switcher-dropdown .bc-dropdown-icon {
  background-color: #00000000 !important;
}

#bc-payments .release-title {
  color: #ccc !important;
}

#snippet-helper {
  background-color: #222 !important;
  box-shadow: 0 1px 10px black !important;
}

select {
  background-color: #000000 !important;
  color: #eee !important;
}

::-webkit-scrollbar {
  background: #444 !important;
}

::-webkit-scrollbar-track {
  background: #444 !important;
}

::-webkit-scrollbar-thumb {
    background: #222 !important;
    border-radius: 100px !important;
    border: 2px solid #444
}

::-webkit-scrollbar-corner {
  background: #444 !important;
}

::-webkit-resizer {
  border: none !important;
  outline: none !important;
  color: white !important;
  background: #444 !important;
}

li.divider {
  background-color: #111 !important;
  border-color: #000000 !important;
}

#bc-payments .item.highlight {
  background-color: #000000 !important;
  border-color: #FFB7F0 !important;
  border-style: solid !important;
  border-width: 1px !important;
  margin: 8px 0 !important;
  margin-left: 3px !important;
  margin-right: 3px !important;
}

#bc-payments li {
  border-color: #555 !important;
}

.case nav {
  background-color: #111 !important;
}

.case #bulkCaseSelector .bulk-case-row:hover {
  background-color: #000000 !important;
}

span.clientID:hover {
  background-color: #151515 !important;
}

div.droplist-popup-item.selected {
  background-color: #000 !important;
}

.chunky-droplist .droplist-chunks.active, .chunky-droplist .droplist-chunks:focus, .chunky-droplist .droplist-chunks:active, .case input:active, .case textarea:active, .case input:focus, .case textarea:focus, .case input.active, .case textarea.active {
  box-shadow: 0 0 0 2px #4ba2d477
}

.case input.droplist-input:active, .case input.droplist-input:focus {
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.droplist-popup {
  background: #222 !important;
  box-shadow: none !important;
}

div.left .field {
  overflow: visible !important;
}

.case nav .controls .control:hover {
  color: #00638E !important;
}

span.useragent {
  filter: invert(97%) !important;
  border: none !important;
  padding-top: 5px !important;
}

#Customizations textarea {
  background-color: #111 !important;
  color: #eee !important;
}

a:visited {
  color: #A280C6 !important;
}

span.quantity {
  color: #ccc !important;
}

span.merch.icon {
  color: #548CFF !important;
}

iframe.oldbugz-frame.oldbugz-frame-active.oldbugz-frame-visible div {
  background-color: #000 !important;
}

div.editableTablePane {
  background-color: #222 !important;
}

iframe form>div {
  background-color: #000000 !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
