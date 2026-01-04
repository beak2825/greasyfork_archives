// ==UserScript==
// @name            Waze Darkmode
// @name:de         Waze Darkmode (schön augen schonen)
// @namespace       https://github.com/SaiCode-DEV
// @version         0.75
// @description     A darkmode for WME / Waze
// @description:de  Dunkler Modus für WME / Waze
// @author          SaiCode
// @match           /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @match           https://www.waze.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant           GM_addStyle
// @license         MIT
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/495318/Waze%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/495318/Waze%20Darkmode.meta.js
// ==/UserScript==

GM_addStyle(`

p {
  color: #aaa !important;
}

h2 {
  color: var(--text-color) !important;
}

.ToolboxMeasurementTool {
  background-color: #222 !important;
}

.ToolboxMeasurementTool .header {
  background-color: #0c4151 !important;
}

#WMETB_Clear_Road_Geometry {
  filter: brightness(1.2);
}

#WMETB_CreateJunctions {
  filter: invert(1);
}

#WMETB_NavBar {
  background-color: rgba(17, 17, 17, 0.9) !important;
  color: var(--text-color) !important;
  opacity: 1;
}

WWSUFooter a {
  color: #6fc1e6 !important;
}

#WWSU-Container {
  background-color: var(--background_default) !important;
}

#WWSU-script-update-info {
  background-color: #222 !important;
}

.add-opening-hour .section {
  background-color: #222 !important;
}

#app-head wz-header #left-app-head #logo-and-env #waze-logo {
  filter: invert(1);
}

.dialog-lightbox nav button {
  margin: 0 auto;
  outline: 0;
  border: 3px solid #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #2f2f2f),
    color-stop(50%, #2f2f2f),
    color-stop(50%, #1a1a1a),
    color-stop(100%, #1a1a1a)
  );
  padding: 3px;
  color: var(--text-color);
}

.dialog-lightbox nav button:hover:enabled {
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #0077b6),
    color-stop(50%, #0077b6),
    color-stop(50%, #023e8a),
    color-stop(100%, #023e8a)
  );
  cursor: pointer;
  color: var(--text-color);
}

[dir] .wz-footer {
  background-color: #333 !important;
}

[dir] .wz-nav {
  background-color: #333 !important;
}

.form-control {
  background-color: #333 !important;
  color: #d6dae7 !important;
}

.form-search .search-query {
  background-color: #222 !important;
  color: #89c4ff !important;
}

.form-search input.search-query::placeholder {
  color: #666 !important;
}

#header {
  border-bottom: 2px solid #50c9f2 !important;
  background-color: #11242a !important;
}

#header .user-avatar {
  color: #6fc1e6 !important;
}

#header .user-headline .header-info {
  background-color: #2c484f !important;
}

.house-number-marker {
  background: #353535 !important;
}

#issue-tracker-filter-region {
  background-color: var(--background_default) !important;
}

.issues-tracker-wrapper .issues-tracker-footer {
  background-color: var(--background_default) !important;
}

div.c2821834349 > input:checked + label {
  background-color: #333 !important;
}

div.c2821834349 > input:enabled + label:hover {
  background-color: #444 !important;
}

div.c2821834349 > label {
  background-color: #222 !important;
}

div.c2952996808 {
  background-color: #222 !important;
}

div[class^="changesLog--"] {
  --wz-tooltip-content-background-color: #222 !important;
  color: #eee !important;
}

#jaOptions .disabled::after {
  color: rgba(31, 31, 31, 0.67) !important;
}

.layer-switcher .menu {
  background-color: var(--background_default) !important;
}

.layer-switcher .menu > .title {
  color: #eee !important;
}

.ls-link:hover {
  background-color: #333 !important;
}

.ls-modal {
  background-color: var(--background_default) !important;
  color: #d6dae7 !important;
}

.modal-content {
  background-color: var(--background_default) !important;
}

body {
  color: var(--text-color) !important;
  background-color: var(--background_default) !important;
}

.panel.panel--to-be-deprecated > * {
  background-color: #222 !important;
}

#password {
  background-color: #333 !important;
  color: #d6dae7 !important;
}

#ptsm-Allgem {
  color: #a4eeee !important;
}

#ptsm-Baustell {
  color: #1de1b9 !important;
}

#ptsm-Bilder {
  color: #00ff00 !important;
}

#ptsm-Blitzer {
  color: #00ffff !important;
}

#ptsm-GeoPort {
  color: #9abeff !important;
}

#ptsm-Misc {
  color: #ff15ba !important;
}

#recent-edits .recent-edits-list .recent-edits-list-header {
  background-color: var(--background_default) !important;
}

#recent-edits .recent-edits-list .recent-edits-list-items .transaction-header {
  background-color: var(--background_default) !important;
}

#recent-edits .recent-edits-list .recent-edits-load-more {
  background-color: var(--background_default) !important;
}

#recent-edits .recent-edits-map .map {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

:root {
  --background_default: #111 !important;
  --background_variant: #222 !important;
  --content_default: #a7a7a7 !important;
  --surface_default: #1e1e1e !important;
  --surface_variant: #333 !important;
  --surface_variant_blue: #003a5e !important;
  --surface_variant_green: #003f10 !important;
  --surface_variant_orange: #421200 !important;
  --surface_variant_purple: #2e0042 !important;
  --surface_variant_red: #420000 !important;
  --surface_variant_yellow: #565201 !important;
  --surface_alt: #1e2122 !important;
  --text-color: #fff !important;
  --content_p1: #d6dae7 !important;
  --content_p2: #bbb !important;
  --content_p3: #666 !important;
}

#sidebar {
  background-color: var(--background_default) !important;
}

#sidebar .nav-tabs {
  background: #222 !important;
}

#sidebar .nav-tabs li a {
  color: #ddd !important;
}

#sidebar .nav-tabs li.active a {
  background: #333 !important;
}

#sidepanel-ptsm button {
  background-color: #222 !important;
}

.tb-feature-label-image {
  filter: invert(1);
}

.tb-tab-tab {
  background-color: #222 !important;
}

.tb-tab-tab.active {
  background-color: #333 !important;
}

.tb-tabContainer {
  background-color: var(--background_default) !important;
}

.transaction-header:hover {
  background-color: #222 !important;
}

#tutorial-dialog .modal-body {
  background-image: linear-gradient(-179deg, #222 0%, #313131 100%);
}

#username {
  background-color: #333 !important;
  color: #d6dae7 !important;
}

.welcome_popup_container--MpGOT {
  background-color: var(--background_default) !important;
}

.welcome_popup_image--SSxnF {
  filter: brightness(93.2%) invert(1) hue-rotate(180deg);
}

.wm-card.is-routing {
  background-color: var(--background_default) !important;
}

.wm-map__leaflet {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

.wm-routes {
  border-top: 8px solid #222 !important;
  background-color: var(--background_default) !important;
}

.wm-routes-item-desktop.is-active {
  background-color: #222 !important;
}

.wm-routes-item-desktop__header {
  color: var(--text-color) !important;
}

.wm-routes__header {
  background-color: var(--background_default) !important;
}

.wm-routing-actions {
  background-color: var(--background_default) !important;
}

.wm-routing-poi {
  border-top: 8px solid #222 !important;
  background-color: var(--background_default) !important;
}

.wm-routing-poi-card section.wide:last-child {
  background-color: var(--background_default) !important;
}

.wm-routing-schedule {
  background-color: var(--background_default) !important;
}

.wm-routing-schedule .wz-react-dropdown__head {
  color: #d6dae7 !important;
}

.wm-routing-status {
  border-top: 8px solid #222 !important;
  background-color: var(--background_default) !important;
}

.wm-routing__sticky-delimeter {
  background-color: #333 !important;
}

.wm-routing__title {
  background-color: var(--background_default) !important;
  color: #d6dae7 !important;
}

.wm-search__secondary {
  color: #bbb !important;
}

.wz-button.shadowed {
  background-color: #222 !important;
}

.wz-cc-container {
  background-color: #333 !important;
  color: #d6dae7 !important;
}

.wz-footer-meta-logo {
  filter: invert(1);
}

.wz-footer-meta-social-link-container {
  filter: invert(1);
}

.wz-footer-meta-social-link-container::marker {
  opacity: 0;
}

.wz-map-ol-control-mouse-position {
  color: #eee !important;
}

.wz-map-ol-footer {
  background-color: var(--background_default) !important;
}

.wz-react-dropdown__head::after {
  border-top-color: #d6dae7 !important;
}

.wz-search-from-to {
  background-color: var(--background_default) !important;
}

.wz-search-from-to .wm-search .wm-search__selected {
  background-color: #333 !important;
}

.wz-search-from-to .wm-search__primary {
  color: #d7def2 !important;
}

.wz-sidebar {
  background-color: var(--background_default) !important;
}

.wz-sidebar-toggle-label {
  color: #ddd !important;
}

.wz-tabs__button {
  color: #d6dae7 !important;
}

.wz-tooltip-content-holder {
  background-color: #222 !important;
}

.wz-venue h6 {
  color: #c8cee1 !important;
}

#RAUtilWindow {
  background-color: var(--background_default) !important;
}

#rotationAmount,
#shiftAmount {
  background-color: #333 !important;
  color: #d6dae7 !important;
}

div.c3584528711 > span {
  background-color: rgb(57, 57, 29) !important;
}

div.c3336571891 > span {
  background-color: rgb(6, 61, 6) !important;
}

div.note {
  background-color: #10101C !important;
}
div.note a {
  color: #0c5b7f  !important;
}
div.note a:visited {
  color: #107f0c  !important;
}

img#slackPermalink {
  filter: invert(1);
}

.restrictions-summary .restrictions-table th {
  background: #003342 !important;
}

.restrictions-summary .restrictions-table tr {
  background-color: #222 !important;
}

.restrictions-summary .restriction-list-item:hover td {
  background: #333 !important;
}

.restriction-editing-region .restriction-editing-section .restriction-editing-container {
  background-color: #222 !important;
}

#WazeMap .snapshot-message .snapshot-mode-message {
  background-color: var(--background_default) !important;
}

.container--wzXTu {
  background-color: var(--background_default) !important;
  display: none;
}

#abAlerts {
  background-color: var(--background_default) !important;
  box-shadow: var(--background_default) 5px 5px 10px !important;
  border-color: #333 !important;
}

#sidebar {
  color: var(--text-color) !important;
}

.toolbar .toolbar-button {
  color: var(--content_p1) !important;
}

.layer-switcher .layer-switcher-toggler-tree-category > .label-text {
  color: var(--text-color) !important;
}

`);
