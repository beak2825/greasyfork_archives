// ==UserScript==
// @name [Main] Google Docs Dark Mode
// @namespace theusaf.org
// @version 1.4.1
// @description Google Docs Dark Mode - Main
// @author theusaf
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://docs.google.com/document*
// @downloadURL https://update.greasyfork.org/scripts/435331/%5BMain%5D%20Google%20Docs%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/435331/%5BMain%5D%20Google%20Docs%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `

  /* Custom colors for the dark mode */

  :root {
      --gray-50: #dddddd;
      --gray-100: #bdbdbd;
      --gray-150: #646464;
      --gray-200: #555555;
      --gray-300: #444444;
      --gray-400: #313131;
      --gray-500: #1C1C1C;
      --gray-600: #171717;
      --white-100: #f5f5f5;
      --white-200: #ededed;
      --white-300: #e3e3e3;
  }

  .modal-dialog-content {
    color: var(--white-200) !important;
  }

  /* keyboard shortcuts */
  .apps-shortcutshelpcontentimpl-container {
    background: var(--gray-200) !important;
  }

  .apps-navigationwidget-item-hover {
    background: var(--gray-150) !important;
  }

  .apps-actiondatawidget-content-element,
  .kix-smart-summary-text-container {
    color: var(--white-200) !important;
  }

  .apps-shortcutshelpcontentimpl-dialog-title,
  .apps-navigationwidget-item:not([aria-selected="true"]),
  .apps-actiondatawidget-content-header {
    color: var(--white-300) !important;
  }

  .apps-shortcutshelppopup {
    border: 0;
  }

  /* page setup fixes */
  .kix-pagesetupdialog-title,
  .kix-pagesetupdialog-orientation-controls,
  .kix-pagesetupdialog-margin-table {
    color: var(--white-100) !important;
  }

  /* right button stuff */
  .app-switcher-button-icon {
    fill: var(--white-100);
  }

  /* Remove outline gradient */
  #navigation-widget-bottom-fade {
    display: none;
  }

  /* Menu item fixes */
  .docs-parent-collections-container-text,
  .ac-highlighted,
  .docs-omnibox-row-content.goog-inline-block {
      color: var(--white-100) !important;
  }

  /* Pop up windows */

  .docs-docos-activitybox,
  .docos-streampane-content,
  .docos-streampane-header {
      background-color: var(--gray-300) !important;
      border-color: var(--gray-300) !important;
  }

  /* Menu searching when toolbar is hidden */

  .docs-omnibox-input {
      background-color: var(--gray-300) !important;
      border: 1px solid var(--gray-400) !important;
      color: var(--white-100) !important;
  }

  .docs-omnibox-input::placeholder {
      color: var(--white-300) !important;
  }

  .ac-renderer {
      background-color: var(--gray-300) !important;
  }

  .ac-active {
      background-color: var(--gray-100) !important;
  }

  .ac-row>div>div>.docs-icon {
      background-color: transparent !important;
  }

  /* Menus for different toolbar options */

  .goog-menu,
  .goog-menuitem {
      background-color: var(--gray-400) !important;
      color: var(--white-100) !important;
  }

  .ac-active .goog-menu,
  .ac-active .goog-menuitem {
      background-color: var(--gray-100) !important;
  }

  .goog-menuitem-highlight>*,
  .goog-option>* {
      color: var(--white-100) !important;
      font-weight: bold !important;
  }

  /* Icons for some toolbar options */

  .goog-menuitem-icon {
      background-color: var(--gray-50) !important;
      border-radius: 2px !important;
  }

  /* Navigation tab LEFT */

  .docs-navigation-tab-button {
      background-color: var(--gray-100) !important;
      border-color: var(--white-300) !important;
      filter: invert(100%) !important;
  }

  /* Navigation tab expanded */

  .navigation-widget {
      background-color: var(--gray-400) !important;
  }

  #navigation-widget-hat-list-icon {
      background-color: var(--gray-100) !important;
      border-radius: 3px;
  }

  .navigation-widget-hat-title,
  .navigation-item-content {
      color: var(--white-100) !important;
  }

  .goog-button-hover>* {
      color: var(--gray-400) !important;
      font-weight: bold !important;
      background-color: var(--gray-150) !important;
  }

  .navigation-widget-hat-close-button-icon {
      background-color: var(--gray-50);
      border-radius: 50%;
  }

  /* Top toolbar with File, Edit.. options */

  #docs-chrome {
      background-color: var(--gray-400) !important;
  }

  /* Share, user pic.. wrapper */

  .docs-titlebar-buttons {
      background-color: var(--gray-400) !important;
  }

  /* Comment button */

  #docs-docos-commentsbutton {
      background-color: var(--gray-100) !important;
      filter: invert(100%) !important;
  }

  .jfk-button-checked>.docs-icon,
  .jfk-button-active>.docs-icon {
      filter: invert(100%) !important;
  }

  .docs-docos-activitybox {
      background-color: var(--gray-300) !important;
  }

  .docos-new-comment-button {
      height: auto !important;
      background-color: var(--gray-400) !important;
  }

  .goog-flat-menu-button {
      background-color: var(--gray-400) !important;
  }

  .docos-ns-caption-text {
      color: var(--white-100);
  }

  /* The input for the document title */

  .docs-title-input,
  .docs-title-input-label {
      background-color: var(--gray-500) !important;
      color: var(--white-100) !important;
  }

  .docs-title-input:hover {
      border-color: transparent !important;
  }

  /* Add to Drive icon next to input for document title*/

  #docs-folder {
      filter: brightness(1.5) !important;
  }

  /* The star for saving the doc as favorite */

  #docs-star {
      background-color: var(--gray-500);
      border-radius: 5px;
  }

  /* The File, Edit.. options */

  .menu-button {
      color: var(--white-200) !important;
  }

  .goog-control-hover,
  .goog-control-open {
      color: var(--gray-500) !important;
  }

  /* Tool icon wrapper. undo, redo... */

  #docs-toolbar-wrapper {
      background-color: var(--gray-300) !important;
      border-top: 1px solid var(--gray-400) !important;
      border-bottom: 1px solid var(--gray-400) !important;
  }

  /* Tool icons, undo, redo... */

  .goog-toolbar-button-inner-box,
  .goog-color-menu-button-indicator {
      background-color: var(--gray-100) !important;
      filter: invert(100%) !important;
  }

  .docs-toolbar-small-separator,
  .goog-toolbar-separator {
      border: 1px solid var(--gray-400) !important;
      background-color: var(--gray-400) !important;
  }

  .docs-icon-mode-edit {
      filter: invert(100%) !important;
  }

  .docs-icon-bold {
      filter: invert(100%) !important;
  }

  .docs-icon-bold {
      filter: none !important;
  }

  .goog-toolbar-button-checked>div>div>div,
  .goog-toolbar-button-active>div>div>div {
      filter: invert(100%) !important;
  }

  .goog-toolbar-toggle-button,
  .goog-toolbar-button {
      background-color: var(--gray-400) !important;
  }

  .goog-toolbar-select {
      background-color: var(--gray-400) !important;
  }

  .goog-toolbar-menu-button {
      background-color: var(--gray-400) !important;
  }

  .goog-toolbar-menu-button-arrow-hidden {
      background-color: var(--gray-400) !important;
  }

  .docs-icon-line-spacing {
      filter: invert(100%) !important;
  }

  .docs-icon-image-type {
      filter: invert(100%) !important;
  }

  .goog-toolbar-menu-button-open>div>div>div>div>.docs-icon-line-spacing,
  .goog-toolbar-menu-button-open>div>div>div>div>.docs-icon-image-type {
      filter: none !important;
  }

  .goog-toolbar-menu-button-hover>div>div>div>div>.docs-icon-line-spacing {
      filter: none !important;
  }

  /* Combo box input backgrounds*/

  .goog-toolbar-combo-button-caption {
      background-color: var(--gray-400) !important;
      color: var(--white-200) !important;
  }

  .goog-toolbar-menu-button-caption {
      background-color: var(--gray-400) !important;
      color: var(--white-200) !important;
      text-align: center !important;
  }

  .goog-toolbar-menu-button-open>div>div>div>div>div>div {
      filter: invert(100%) !important;
  }

  /* Combo boxes, zoom, image format... */

  #docs-toolbar-wrapper>.goog-inline-block {
      background-color: var(--gray-50) !important;
  }

  /* Background for large combo boxes */

  .goog-toolbar-combo-button {
      background-color: var(--gray-400) !important;
  }

  /* Combo box inputs */

  .goog-toolbar-combo-button-input {
      color: var(--white-200) !important;
  }

  .goog-toolbar-combo-button-open>div>div>div>input {
      color: var(--white-200) !important;
      background-color: var(--gray-200) !important;
  }

  /* Drop down labels */

  .goog-menu.goog-menu-vertical.goog-menu-noaccel>.goog-menuitem>.goog-menuitem-label {
      color: var(--white-100) !important;
  }

  /* Last edited message */

  .docs-title-save-label-text {
      color: var(--white-300) !important;
  }

  /* Background of the pages */

  .kix-appview-editor {
      background-color: var(--gray-300) !important;
  }

  /* Toggleable sidebar RIGHT */

  .companion-app-switcher-container,
  .docs-companion-app-switcher-container {
      background-color: var(--gray-200) !important;
      border: none !important;
  }

  /* Toggeable sidebar RIGHT icons */

  .app-switcher-button-icon-container {
      background-color: var(--gray-150) !important;
  }

  /* Explore sidebar RIGHT */

  .docs-explore-sidebar {
      background-color: var(--gray-400) !important;
  }

  .docs-explore-sidebar>* {
      background-color: var(--gray-400) !important;
      color: var(--white-100) !important;
  }

  .docs-explore-sidebar-title {
      border-top: 1px solid var(--gray-400);
      border-color: var(--gray-500) !important;
  }

  .docs-explore-searchbar-labelinput,
  .docs-explore-searchbar-ac-row {
      background-color: var(--gray-400) !important;
      color: var(--white-100) !important;
  }

  .docs-explore-emptylist-title {
      color: var(--white-100) !important;
  }

  /* Right side scrollbar */

  .docs-gm-sidebars ::-webkit-scrollbar-thumb {
      background-color: var(--gray-400) !important;
  }

  /* Rulers */

  .docs-ruler {
      background-color: var(--gray-200) !important;
      border-bottom: 1px solid var(--gray-400) !important;
  }

  .docs-vertical-ruler {
      border-right: 1px solid var(--gray-400) !important;
  }

  .docs-ruler-face {
      background-color: var(--gray-100) !important;
  }

  .docs-ruler-face-minor-division,
  .docs-ruler-face-major-division {
      background-color: var(--gray-500) !important;
  }

  .docs-ruler-face-number {
      color: var(--gray-500) !important;
  }

  /* Bottom left explore icon */

  .docs-explore-widget {
      background-color: var(--gray-400) !important;
  }

  .docs-explore-icon>svg {
      filter: invert(100%) !important;
  }

  .docs-explore-widget-text {
      color: var(--white-100) !important;
  }

  /* Edit image options */

  .docs-tiled-sidebar,
  .docs-tiled-sidebar>div {
      background-color: var(--gray-400) !important;
  }

  .docs-tiled-sidebar-header {
      border-color: var(--gray-400) !important;
  }

  .docs-sidebar-header-text {
      color: var(--white-100) !important;
      font-weight: bold !important;
  }

  .docs-sidebar-tile-header {
      background-color: var(--gray-300) !important;
      color: var(--white-100) !important;
  }

  .docs-sidebar-tile-controls {
      background-color: var(--gray-500) !important;
      color: var(--white-100) !important;
      padding-top: 15px !important;
  }

  .docs-material-gm-select-outer-box {
      background-color: var(--gray-400) !important;
      border-color: var(--gray-200) !important;
      color: var(--white-100) !important;
  }

  .docs-image-effect-recolor-caption {
      color: var(--white-100) !important;
  }

  .docs-sidebar-tile-label {
      color: var(--white-100) !important;
  }

  .docs-image-effect-adjustment-reset-button {
      transform: translateX(-50%);
      left: 50%;
      background-color: var(--gray-100) !important;
      border-color: var(--gray-100) !important;
      color: var(--gray-500) !important;
  }

  /* Equation toolbar */

  #docs-equationtoolbar {
      background-color: var(--gray-200) !important;
      border-bottom: 1px solid var(--gray-400) !important;
  }

  #docs-equationtoolbar .goog-toolbar-menu-button,
  #docs-equationtoolbar .goog-toolbar-menu-button-caption {
      background-color: var(--gray-50) !important;
  }

  #docs-equationtoolbar .goog-toolbar-button-inner-box {
      background-color: var(--gray-400) !important;
      color: white !important;
      filter: none !important;
  }

  .kix-equation-toolbar-palette-icon {
      background-color: var(--gray-100) !important;
      border: 1px solid var(--gray-500) !important;
  }

  /* Special character modal */

  .modal-dialog,
  .modal-dialog div,
  .modal-dialog input[type="text"] {
      background-color: var(--gray-300) !important;
  }

  .modal-dialog input[type="text"] {
      background-color: var(--white-100) !important;
  }

  .modal-dialog .goog-flat-button {
      background-color: var(--gray-100) !important;
      border: 1px solid var(--gray-500) !important;
  }

  .modal-dialog .modal-dialog-title-text,
  .modal-dialog .goog-flat-menu-button-caption {
      color: var(--white-100) !important;
  }

  .modal-dialog .goog-flat-menu-button {
      border-color: var(--gray-500) !important;
  }

  /* Word counter */

  .kix-documentmetricsdialog-table td {
      color: var(--white-200);
      border-bottom: var(--gray-100) 2px solid;
  }

  .docs-material-gm-labeled-checkbox-label {
      color: var(--white-200) !important;
  }

  .docs-material-gm-labeled-checkbox-checkbox {
      border-color: var(--gray-100);
  }

  .modal-dialog-title-close {
      background-color: var(--gray-50) !important;
  }

  .modal-dialog-title-close:hover {
      background-color: var(--white-100);
  }

  .kix-documentmetrics-widget {
      border-color: var(--gray-300) !important;
      background-color: var(--gray-500) !important;
  }

  .kix-documentmetrics-widget .docs-material-gm-select-outer-box {
      background-color: var(--gray-400) !important;
  }

  .docs-material-gm-select-dropdown.docs-gm-arrow.goog-inline-block.docs-material .docs-icon.goog-inline-block {
      background-color: var(--gray-100);
      border-radius: 4px;
  }

  .docs-material-gm-select-caption {
      color: var(--white-100) !important;
  }

  .kix-documentmetrics-widget {
      box-shadow: 0 2px 6px 2px rgba(255, 255, 255, .1);
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
