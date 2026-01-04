// ==UserScript==
// @name         BigQuery Platform Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.6.12
// @description  BigQuery Platform Modifier modifies BigQuery Platform to display panels side by side.
// @author       Hubertokf
// @match        *://console.cloud.google.com/bigquery*
// @grant        none
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/420889/BigQuery%20Platform%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/420889/BigQuery%20Platform%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    const waitFor = (selector, time, callback) => {
        if(document.querySelector(selector) !== null) {
            callback()
        }
        else {
            setTimeout(() => {
                waitFor(selector, time, callback);
            }, time);
        }
    }

    $(document).ready(()=>{
        $("head").append('<script src="src/theme-twilight.js" type="text/javascript" charset="utf-8"></script>');

        waitFor('.cfc-action-bar-content-left', 2000, () => {addBqDarkMode()});
    });

    function addBqDarkMode() {
        $(".cfc-action-bar-content-left").append(`<button aria-label="Dark mode" class="toggle-dark-mode mat-focus-indicator mat-button mat-button-base mat-primary" color="primary" mat-button="">    <span class="mat-button-wrapper">      <ace-icon class="ace-icon ace-icon-lightbulb ace-icon-size-small" icon="light" iconset="bigquery" size="small">        <!---->        <mat-icon class="mat-icon notranslate mat-icon-no-color ng-star-inserted" role="img" aria-hidden="true" data-mat-icon-type="svg" data-mat-icon-name="lightbulb_outline" data-mat-icon-namespace="bigquery-small">          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18px" height="18px"><g><rect fill="none" height="24" width="24"/></g><g><g/><path d="M12,3c-0.46,0-0.93,0.04-1.4,0.14C7.84,3.67,5.64,5.9,5.12,8.66c-0.48,2.61,0.48,5.01,2.22,6.56C7.77,15.6,8,16.13,8,16.69 V19c0,1.1,0.9,2,2,2h0.28c0.35,0.6,0.98,1,1.72,1s1.38-0.4,1.72-1H14c1.1,0,2-0.9,2-2v-2.31c0-0.55,0.22-1.09,0.64-1.46 C18.09,13.95,19,12.08,19,10C19,6.13,15.87,3,12,3z M14,19h-4v-1h4V19z M14,17h-4v-1h4V17z M12.5,11.41V14h-1v-2.59L9.67,9.59 l0.71-0.71L12,10.5l1.62-1.62l0.71,0.71L12.5,11.41z"/></g></svg>        </mat-icon>        <!---->        <!---->        <!---->      </ace-icon>       <span class="darkModeBTText">Apagar as luses</span>     </span>    <span class="mat-button-ripple mat-ripple" matripple=""></span>    <span class="mat-button-focus-overlay"></span>  </button>`)

        var colors = {
            "base": {
                "BG": "#282A36",
                "FG": "#F8F8F2",
                "SELECTION": "#44475A",
                "COMMENT": "#6272A4",
                "CYAN": "#8BE9FD",
                "GREEN": "#50FA7B",
                "ORANGE": "#FFB86C",
                "PINK": "#FF79C6",
                "PURPLE": "#BD93F9",
                "RED": "#FF5555",
                "YELLOW": "#F1FA8C"
            },
            "ansi": {
                "COLOR0": "#21222C",
                "COLOR1": "#FF5555",
                "COLOR2": "#50FA7B",
                "COLOR3": "#F1FA8C",
                "COLOR4": "#BD93F9",
                "COLOR5": "#FF79C6",
                "COLOR6": "#8BE9FD",
                "COLOR7": "#F8F8F2",
                "COLOR8": "#6272A4",
                "COLOR9": "#FF6E6E",
                "COLOR10": "#69FF94",
                "COLOR11": "#FFFFA5",
                "COLOR12": "#D6ACFF",
                "COLOR13": "#FF92DF",
                "COLOR14": "#A4FFFF",
                "COLOR15": "#FFFFFF"
            },
            "brightOther": {
                "TEMP_QUOTES": "#E9F284",
                "TEMP_PROPERTY_QUOTES": "#8BE9FE"
            },
            "other": {
                "LineHighlight": "#44475A75",
                "NonText": "#FFFFFF1A",
                "WHITE": "#FFFFFF",
                "TAB_DROP_BG": "#44475A70",
                "BGLighter": "#424450",
                "BGLight": "#343746",
                "BGDark": "#21222C",
                "BGDarker": "#191A21"
            }
        }

        $("head").append(`
<style>
:root {
  --BG: #282A36;
  --FG: #F8F8F2;
  --SELECTION: #44475A;
  --COMMENT: #6272A4;
  --CYAN: #8BE9FD;
  --GREEN: #50FA7B;
  --ORANGE: #FFB86C;
  --PINK: #FF79C6;
  --PURPLE: #BD93F9;
  --RED: #FF5555;
  --YELLOW: #F1FA8C
  --COLOR0: #21222C;
  --COLOR1: #FF5555;
  --COLOR2: #50FA7B;
  --COLOR3: #F1FA8C;
  --COLOR4: #BD93F9;
  --COLOR5: #FF79C6;
  --COLOR6: #8BE9FD;
  --COLOR7: #F8F8F2;
  --COLOR8: #6272A4;
  --COLOR9: #FF6E6E;
  --COLOR10: #69FF94;
  --COLOR11: #FFFFA5;
  --COLOR12: #D6ACFF;
  --COLOR13: #FF92DF;
  --COLOR14: #A4FFFF;
  --COLOR15: #FFFFFF
  --TEMP_QUOTES: #E9F284;
  --TEMP_PROPERTY_QUOTES: #8BE9FE
  --LineHighlight: #44475A75;
  --NonText: #FFFFFF1A;
  --WHITE: #FFFFFF;
  --TAB_DROP_BG: #44475A70;
  --BGLighter: #424450;
  --BGLight: #343746;
  --BGDark: #21222C;
  --BGDarker: #191A21;
}
.darkMode ::-webkit-scrollbar {width: 10px;}
.darkMode ::-webkit-scrollbar-track {background: transparent;}
.darkMode ::-webkit-scrollbar-thumb {background: #424450;}
.darkMode ::-webkit-scrollbar-thumb:hover {background: #424450;}
.darkMode .right-pannel, .darkMode .left-pannel {background-color: ${colors.other.BGDark} !important;}
.darkMode {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode body {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode a:visited, .darkMode a:hover{color: #a4a4a4 !important;}

.darkMode .central-page.pcc-default-theme {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .cfc-action-bar-layout-region.cfc-action-bar-section-left * {background-color: ${colors.other.BGDarker} !important; color:${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
/*.darkMode .cfc-panel .cfc-panel-side-left * {color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}*/
.darkMode .cfc-panel .cfc-panel-side-left .p6n-bq-header-tree-node.p6n-ellipsis.p6n-dynamic-tree-node-wrapper.p6n-dynamic-tree-node-with-border {background-color: ${colors.other.BGDark} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .layout-column {background-color: ${colors.other.BGDark} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .p6n-bq-pin-project-button-container {background-color: ${colors.other.BGDark} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .p6n-vulcan-toolbar.p6n-action-bar-container.md-menu-toolbar.p6n-action-bar-hd.p6n-action-bar-no-title.p6n-action-bar-with-right-content {background-color: ${colors.other.BGDark} !important;}
.darkMode .cfc-panel-divider.cfc-panel-divider-resizable {background-color: ${colors.other.BGDarker} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .jfk-textinput.label-input-label {background-color: ${colors.other.BGLight} !important;}
.darkMode .cfc-panel-side-left.cfc-panel-content-wrapper {background-color: ${colors.other.BGDark} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .cfc-panel-content.cfc-has-divider {padding-right: 12px !important;}

.darkMode .cfc-panel .cfc-panel-side-left input::placeholder {color: ${colors.base.FG} !important;}
.darkMode .cfc-panel .cfc-panel-side-left .cfc-panel-drag-area {background-color: transparent !important;}
.darkMode .cfc-panel .cfc-panel-side-left .cfc-panel-drag-area .cfc-panel-drag-grip {background-color: ${colors.base.FG} !important;}
.darkMode .p6n-bq-query-panel-container {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color:${colors.other.BGDarker} !important;}
.darkMode .p6n-icon-arrow, .p6n-icon-action, .p6n-icon-pagination {fill: ${colors.base.FG}}
.darkMode .p6n-tag {background-color: ${colors.other.BGLighter} !important; color: ${colors.base.COMMENT} !important;}

.darkMode .p6n-vulcan-panel-content-bq-no-padding {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-vulcan-toolbar.p6n-action-bar-container  {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-action-bar-title h1 {color: ${colors.base.FG} !important;}
.darkMode .p6n-action-bar-button.md-primary.md-button {color: ${colors.base.FG} !important;}
.darkMode .p6n-dropdown-container {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-dropdown-container * {color: ${colors.base.FG} !important;}

.darkMode .p6n-vulcan-panel-content-bq-no-padding * {color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding {background-color: ${colors.other.BGDark}; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-expanding-row {background-color: ${colors.other.BGDark};}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-expanding-row-summary {background-color: ${colors.other.BGDark};}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-expanding-row-details-content {background-color: ${colors.other.BGDark};}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-kv-list-item:nth-child(even) {background-color: ${colors.other.BGDark};}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-kv-list-item:nth-child(odd) {background-color: ${colors.other.BGLight};}

.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-autosuggest-input * {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-autosuggest-input .p6n-filter-bar {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-autosuggest-input .p6n-filter-bar * {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .p6n-autosuggest-input .p6n-filter-bar *:before {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .goog-flat-menu-button.jfk-select {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important; border-color: var(--BGDarker);}
.darkMode .goog-flat-menu-button.jfk-select:after {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .goog-inline-block.goog-flat-menu-button-caption {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .goog-inline-block.goog-flat-menu-button-dropdown {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
.darkMode .p6n-table th {background-color: ${colors.other.BGDarker} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-table tr:nth-child(even) {background-color: ${colors.other.BGDark} !important;}
.darkMode .p6n-table tr:nth-child(odd) {background-color: ${colors.other.BGLight} !important;}

.darkMode .CodeMirror {background-color: ${colors.base.BG} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .CodeMirror-gutters {background-color: ${colors.other.BGLight} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .CodeMirror .cm-keyword {color: ${colors.base.PINK} !important;}
.darkMode .CodeMirror .cm-string {color: ${colors.base.YELLOW} !important;}
.darkMode .CodeMirror .cm-function {color: ${colors.base.CYAN} !important;}
.darkMode .CodeMirror .cm-recognized-field {color: ${colors.base.PURPLE} !important;}
.darkMode .CodeMirror .cm-number {color: ${colors.base.PURPLE} !important;}
.darkMode .CodeMirror .cm-comment {color: ${colors.base.COMMENT} !important;}
.darkMode .CodeMirror .cm-variable {color: ${colors.base.FG} !important;}
.darkMode .CodeMirror .cm-recognized-table {color: ${colors.base.ORANGE} !important;}
.darkMode .CodeMirror .CodeMirror-linenumber {color: ${colors.base.COMMENT} !important;}
.darkMode .CodeMirror .CodeMirror-cursor {border-color: ${colors.base.FG} !important;}
.darkMode .CodeMirror .CodeMirror-selected {color: ${colors.base.FG} !important;  background: ${colors.base.SELECTION} !important;}
.darkMode .p6n-vulcan-panel-content-bq-no-padding .CodeMirror .CodeMirror-lines .CodeMirror-selected {color: ${colors.base.FG} !important;  background: ${colors.base.SELECTION} !important;}
.darkMode .p6n-bq-cm-highlight-tables .p6n-bq-code-mirror .cm-recognized-table, .darkMode .p6n-bq-cm-highlight-tables .p6n-bq-code-mirror .cm-recognized-routine {background-color: ${colors.other.BGLighter} !important;}

.darkMode .p6n-pagination-bar {color: ${colors.base.FG} !important; background-color: ${colors.other.BGDarker} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .cfc-bq-panels .jfk-button:not(.jfk-button-flat):not(.jfk-button-primary), .darkMode .cfc-bq-panels .jfk-button-standard, .darkMode .cfc-bq-panels a.goog-flat-menu-button {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}

.darkMode .p6n-message {background-color: ${colors.other.BGLighter} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .p6n-bq-run-query-row .p6n-tag {background-color: ${colors.other.BGLight} !important; color: ${colors.base.COMMENT} !important;}
.darkMode .p6n-bq-editor-buttons-left .p6n-icon svg {color: ${colors.base.FG} !important;}

.darkMode .mat-form-field-infix { border-color: transparent !important; }
.darkMode .mat-drawer-inner-container {background-color: var(--BGDarker) !important;}
.darkMode .cfc-header-toolbar.cfc-legacy-toolbar-resize.mat-toolbar.mat-toolbar-single-row {background-color: var(--BGDarker);}
.darkMode .cfc-header-toolbar.cfc-legacy-toolbar-resize.mat-toolbar.mat-toolbar-single-row svg path {fill: var(--FG);}
.darkMode .cfc-panel.cfc-panel-color-white.cfc-panel-orientation-horizontal {background-color: var(--BGDark);}
.darkMode #bq-resource-tree {background-color: var(--BGDark);}
.darkMode .cfc-action-bar-menu-overlay { background-color: var(--BG); }
.darkMode .cfc-menu-section  { background-color: var(--BG); color: var(--FG); }
.darkMode .cfc-menu-section .cfc-menu-item-label { color: var(--FG); }
.darkMode #cfc-action-bar-wrapper-0 .cfc-action-bar.md-menu-toolbar.cfc-legacy-toolbar-resize.mat-toolbar.mat-toolbar-single-row {background-color: var(--BGDarker);}
.darkMode #cfc-action-bar-wrapper-1 .cfc-action-bar.md-menu-toolbar.cfc-legacy-toolbar-resize.mat-toolbar.mat-toolbar-single-row {background-color: var(--BGDark);}
.darkMode #cfc-action-bar-wrapper-1 .mat-form-field-infix { border-color: transparent !important; }
.darkMode .cfc-base-layer-panel.mat-drawer.mat-sidenav.mat-drawer-side { border-color: var(--BGDarker); }
.darkMode .cfc-section-nav-body * {color: var(--FG);}
.darkMode .cfc-mode-toggle-button-bar * {color: var(--FG);}
.darkMode .cfc-header-toolbar.cfc-legacy-toolbar-resize * {color: var(--FG) !important;}
.darkMode #bq-resource-tree li.cfc-tree-row.cfc-hover-display-container * {color: var(--FG) !important;}
.darkMode .cfc-virtual-scroll-content-wrapper > div > p {color: var(--FG) !important;}
.darkMode #cfc-action-bar-wrapper-1 * {color: var(--FG) !important;}
.darkMode .p6n-bq-ng1-upgraded-scroll-area {background-color: var(--BG);}
.darkMode .cfc-panel-sub-header.cfc-panel-sub-header-disable-vertical-padding {background-color: var(--BG);}
.darkMode .cfc-height-full.mat-tab-link.mat-focus-indicator {background-color: var(--BG);}
.darkMode .cfc-height-full.mat-tab-link.mat-focus-indicator.mat-tab-label-active {background-color: var(--BGLight);}
.darkMode .cfc-height-full.mat-tab-link.mat-focus-indicator * {color: var(--FG) !important;}
.darkMode .mat-focus-indicator.mat-button.mat-button-base.mat-primary * {color: var(--FG) !important;}
.darkMode .cfc-panel-sub-header.cfc-panel-sub-header-height-xsmall.cfc-panel-sub-header-disable-vertical-padding {background-color: var(--BGDark);}
.darkMode .cfc-button-small.mat-focus-indicator.mat-icon-button.mat-button-base.ace-tooltip-disable-user-select-on-touch-device {color: var(--FG);}
.darkMode .mat-tab-link.mat-focus-indicator {background-color: var(--BGDark); color: var(--FG);}
.darkMode .mat-tab-link.mat-focus-indicator.mat-tab-label-active {background-color: var(--BG);}
.darkMode .g-tab-bar .goog-tab-bar:after { background-color: var(--BGDarker); }
.darkMode .goog-tab-bar.goog-tab-bar-horizontal.goog-tab-bar-top * { color: var(--FG); }
.darkMode table.p6n-table { border-color: var(--BGDarker) !important; }
.darkMode table.p6n-table * { color: var(--FG) !important; }
.darkMode .p6n-bqui-resource-details.p6n-space-below-large.p6n-space-above-large.layout-xs-column.layout-row * { color: var(--FG) !important; }
.darkMode .p6n-space-below-large * { color: var(--FG) !important; }
.darkMode .p6n-kv-list .p6n-kv-list-item:nth-child(even) {background-color: var(--BGDark) !important;}
.darkMode .p6n-kv-list .p6n-kv-list-item:nth-child(odd) {background-color: var(--BGLight) !important;}

.darkMode .p6n-expanding-row.p6n-activity-day { background-color: var(--BG) !important; border-color: var(--BGDarker) !important; }
.darkMode .p6n-expanding-row.p6n-activity-day * { color: var(--FG) !important; }
.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-success * { color: var(--FG); }
.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-success { border-color: var(--BGDarker) !important; }
.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-success:nth-child(even) {background-color: var(--BGDark) !important;}
.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-success:nth-child(odd) {background-color: var(--BGLight) !important;}
.darkMode .cfc-panel-drag-grip { background-color: var(--FG) !important; }

.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-error { background-color: inherit !important; border-color: var(--BGDarker) !important; }
.darkMode pan-expanding-row.p6n-activity-item.p6n-bq-job-details-error * { color: var(--FG); }

.darkMode pan-expanding-row.p6n-activity-item * { color: var(--FG); }
.darkMode pan-expanding-row.p6n-activity-item:nth-child(even) {background-color: var(--BGDark) !important; border-color: var(--BGDarker) !important;}
.darkMode pan-expanding-row.p6n-activity-item:nth-child(odd) {background-color: var(--BGLight) !important; border-color: var(--BGDark) !important;}

.darkMode shared-query-editor.cfc-flex-container.cfc-flex-layout-column.cfc-flex-grow-content mat-toolbar.cfc-action-bar.md-menu-toolbar.cfc-legacy-toolbar-resize.mat-toolbar.mat-toolbar-single-row {background-color: var(--BGLight) !important;}
.darkMode .cfc-truncated-text.ng-star-inserted {color: var(--FG);}

.darkMode shared-query-editor.cfc-flex-container.cfc-flex-layout-column.cfc-flex-grow-content .cfc-flex-container {background-color: var(--BGLight) !important;}

.darkMode .mat-mdc-chip.mdc-chip.mat-mdc-standard-chip {background-color: var(--BGLighter) !important;}
.darkMode .mat-mdc-chip.mdc-chip.mat-mdc-standard-chip * {color: var(--FG);}

.darkMode .p6n-space-below-small.p6n-color-secondary.p6n-bq-screenshot-mask.p6n-ellipsis.flex-none { color: var(--FG) !important; }

.darkMode table.p6n-table * { color: var(--FG) !important; border-color: var(--BGDarker) !important; }
.darkMode button.mat-focus-indicator.mat-button.mat-button-base { color: var(--FG) !important; }

.darkMode .mat-form-field-outline-start, .darkMode .mat-form-field-outline-end {background-color: var(--BGLight) !important;}

.darkMode code { color: var(--FG) !important; }

.darkMode a.mat-focus-indicator.mat-menu-item.ace-tooltip-disable-user-select-on-touch-device.ng-star-inserted svg path {fill: var(--FG) !important; }

.darkMode xap-deferred-loader-outlet.cfc-flex-container.cfc-flex-layout-column.cfc-flex-grow-content.cfc-width-full.xap-deferred-loader-placeholder-centered.xap-deferred-loader-trigger-has-loaded {background-color: var(--BG);}

.darkMode ul.p6n-scorecard { border-color: var(--BGDarker) !important; color: var(--FG) !important; }
.darkMode .p6n-scorecard>li:not(:first-child):before {background-color: var(--BGDarker) !important; }
.darkMode h3.p6n-space-above-small { color: var(--FG) !important; }
.darkMode .p6n-bq-ng1-upgraded-scroll-area * { color: var(--FG) !important; }
.darkMode button.bqui-test-run-query.mat-focus-indicator.mat-raised-button.mat-button-base.mat-primary.mat-button-disabled { color: var(--BGDarker) !important; }
.darkMode .cfc-panel-divider.ng-star-inserted {background-color: var(--BGDarker) !important; }
.darkMode .p6n-filter-bar, .p6n-chips ul.p6n-filter-bar { background-color: var(--BGLight); border-color: var(--BGDarker); }
.darkMode .p6n-filter-bar, .p6n-chips ul.p6n-filter-bar:hover { background-color: var(--BGLight); border-color: var(--BGDarker) !important; }
.darkMode .p6n-filter-bar, .p6n-chips ul.p6n-filter-bar:focus { background-color: var(--BGLight); border-color: var(--BGDarker); }
.darkMode .p6n-filter-bar, .p6n-chips ul.p6n-filter-bar:active { background-color: var(--BGLight); border-color: var(--BGDarker); }
.darkMode .goog-menu.goog-menu-vertical { background-color: var(--BGLight); border-color: var(--BGDarker) !important; }
.darkMode .p6n-chips .worker .display:empty:before { color: var(--FG); }
.darkMode ul.p6n-autosuggest-menu.goog-menu.goog-menu-vertical.p6n-autosuggest-filtering { background-color: var(--BGLight); border-color: var(--BGDarker); }

.darkMode .monaco-editor .minimap-slider .minimap-slider-horizontal { background: rgba(121, 121, 121, 0.2); }
.darkMode .monaco-editor .minimap-slider:hover .minimap-slider-horizontal { background: rgba(100, 100, 100, 0.35); }
.darkMode .monaco-editor .minimap-slider.active .minimap-slider-horizontal { background: rgba(191, 191, 191, 0.2); }
.darkMode .monaco-editor .minimap-shadow-visible { box-shadow: #000000 -6px 0 6px -6px inset; }
.darkMode .monaco-editor .scroll-decoration { box-shadow: #000000 0 6px 6px -6px inset; }
.darkMode .monaco-editor .focused .selected-text { background-color: #264f78; }
.darkMode .monaco-editor .selected-text { background-color: #3a3d41; }
.darkMode .monaco-editor, .darkMode .monaco-editor-background, .darkMode .monaco-editor .inputarea.ime-input { background-color: #1e1e1e; }
.darkMode .monaco-editor, .darkMode .monaco-editor .inputarea.ime-input { color: #d4d4d4; }
.darkMode .monaco-editor .margin { background-color: #1e1e1e; }
.darkMode .monaco-editor .rangeHighlight { background-color: rgba(255, 255, 255, 0.04); }
.darkMode .monaco-editor .symbolHighlight { background-color: rgba(234, 92, 0, 0.33); }
.darkMode .monaco-editor .mtkw { color: rgba(227, 228, 226, 0.16) !important; }
.darkMode .monaco-editor .mtkz { color: rgba(227, 228, 226, 0.16) !important; }
.darkMode .monaco-editor .view-overlays .current-line { border: 2px solid #282828; }
.darkMode .monaco-editor .margin-view-overlays .current-line-margin { border: 2px solid #282828; }
.darkMode .monaco-editor .lines-content .cigr { box-shadow: 1px 0 0 0 #404040 inset; }
.darkMode .monaco-editor .lines-content .cigra { box-shadow: 1px 0 0 0 #707070 inset; }
.darkMode .monaco-editor .line-numbers { color: #858585; }
.darkMode .monaco-editor .current-line ~ .line-numbers { color: #c6c6c6; }
.darkMode .monaco-editor .view-ruler { box-shadow: 1px 0 0 0 #5a5a5a inset; }
.darkMode .monaco-editor .cursors-layer .cursor { background-color: #aeafad; border-color: #aeafad; color: #515052; }

		.darkMode .monaco-editor .contentWidgets .codicon.codicon-light-bulb {
			color: #ffcc00;
			background-color: rgba(30, 30, 30, 0.7);
		}

		.darkMode .monaco-editor .contentWidgets .codicon.codicon-lightbulb-autofix {
			color: #75beff;
			background-color: rgba(30, 30, 30, 0.7);
		}
.darkMode .monaco-editor .codelens-decoration { color: #999999; }
.darkMode .monaco-editor .codelens-decoration .codicon { color: #999999; }
.darkMode .monaco-editor .codelens-decoration > a:hover { color: #4e94ce !important; }
.darkMode .monaco-editor .codelens-decoration > a:hover .codicon { color: #4e94ce !important; }
.darkMode .monaco-editor .findOptionsWidget { background-color: #252526; }
.darkMode .monaco-editor .findOptionsWidget { color: #cccccc; }
.darkMode .monaco-editor .findOptionsWidget { box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.36); }
.darkMode .monaco-editor .squiggly-error { background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23f48771'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") repeat-x bottom left; }
.darkMode .monaco-editor .squiggly-warning { background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23cca700'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") repeat-x bottom left; }
.darkMode .monaco-editor .squiggly-info { background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%2375beff'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") repeat-x bottom left; }
.darkMode .monaco-editor .squiggly-hint { background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%223%22%20width%3D%2212%22%3E%3Cg%20fill%3D%22rgba(238%2C%20238%2C%20238%2C%200.7)%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%225%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") no-repeat bottom left; }
.darkMode .monaco-editor.showUnused .squiggly-inline-unnecessary { opacity: 0.667; }
.darkMode .monaco-editor.showDeprecated .squiggly-inline-deprecated { text-decoration: line-through; text-decoration-color: #d4d4d4}
.darkMode .monaco-editor .bracket-match { background-color: rgba(0, 100, 0, 0.1); }
.darkMode .monaco-editor .bracket-match { border: 1px solid #888888; }
.darkMode .monaco-editor.vs .valueSetReplacement { outline: solid 2px #888888; }
.darkMode .monaco-editor .linked-editing-decoration { background: rgba(255, 0, 0, 0.3); border-left-color: rgba(255, 0, 0, 0.3); }
.darkMode .monaco-editor .detected-link-active { color: #4e94ce !important; }
.darkMode .monaco-editor .darkMode .monaco-editor-overlaymessage .anchor.below { border-top-color: #007acc; }
.darkMode .monaco-editor .darkMode .monaco-editor-overlaymessage .anchor.top { border-bottom-color: #007acc; }
.darkMode .monaco-editor .darkMode .monaco-editor-overlaymessage .message { border: 1px solid #007acc; }
.darkMode .monaco-editor .darkMode .monaco-editor-overlaymessage .message { background-color: #063b49; }
.darkMode .monaco-editor .focused .selectionHighlight { background-color: rgba(173, 214, 255, 0.15); }
.darkMode .monaco-editor .selectionHighlight { background-color: rgba(173, 214, 255, 0.07); }
.darkMode .monaco-editor .wordHighlight { background-color: rgba(87, 87, 87, 0.72); }
.darkMode .monaco-editor .wordHighlightStrong { background-color: rgba(0, 73, 114, 0.72); }
.darkMode .monaco-editor .accessibilityHelpWidget { background-color: #252526; }
.darkMode .monaco-editor .accessibilityHelpWidget { color: #cccccc; }
.darkMode .monaco-editor .accessibilityHelpWidget { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.36); }
.darkMode .monaco-editor .tokens-inspect-widget { border: 1px solid #454545; }
.darkMode .monaco-editor .tokens-inspect-widget .tokens-inspect-separator { background-color: #454545; }
.darkMode .monaco-editor .tokens-inspect-widget { background-color: #252526; }
.darkMode .monaco-editor .tokens-inspect-widget { color: #cccccc; }

			.darkMode .monaco-editor .zone-widget .codicon.codicon-error,
			.markers-panel .marker-icon.codicon.codicon-error,
			.extensions-viewlet > .extensions .codicon.codicon-error {
				color: #f48771;
			}


			.darkMode .monaco-editor .zone-widget .codicon.codicon-warning,
			.markers-panel .marker-icon.codicon.codicon-warning,
			.extensions-viewlet > .extensions .codicon.codicon-warning,
			.extension-editor .codicon.codicon-warning {
				color: #cca700;
			}


			.darkMode .monaco-editor .zone-widget .codicon.codicon-info,
			.markers-panel .marker-icon.codicon.codicon-info,
			.extensions-viewlet > .extensions .codicon.codicon-info,
			.extension-editor .codicon.codicon-info {
				color: #75beff;
			}

.darkMode .monaco-editor .marker-widget a { color: #3794ff; }
.darkMode .monaco-editor .marker-widget a.code-link span:hover { color: #3794ff; }
.monaco-diff-editor .diff-review-line-number { color: #858585; }
.monaco-diff-editor .diff-review-shadow { box-shadow: #000000 0 -6px 6px -6px inset; }
.darkMode .monaco-editor .line-insert, .darkMode .monaco-editor .char-insert { background-color: rgba(155, 185, 85, 0.2); }
.monaco-diff-editor .line-insert, .monaco-diff-editor .char-insert { background-color: rgba(155, 185, 85, 0.2); }
.darkMode .monaco-editor .inline-added-margin-view-zone { background-color: rgba(155, 185, 85, 0.2); }
.darkMode .monaco-editor .line-delete, .darkMode .monaco-editor .char-delete { background-color: rgba(255, 0, 0, 0.2); }
.monaco-diff-editor .line-delete, .monaco-diff-editor .char-delete { background-color: rgba(255, 0, 0, 0.2); }
.darkMode .monaco-editor .inline-deleted-margin-view-zone { background-color: rgba(255, 0, 0, 0.2); }
.monaco-diff-editor.side-by-side .editor.modified { box-shadow: -6px 0 5px -5px #000000; }

			.monaco-diff-editor .diffViewport {
				background: rgba(121, 121, 121, 0.4);
			}


			.monaco-diff-editor .diffViewport:hover {
				background: rgba(100, 100, 100, 0.7);
			}


			.monaco-diff-editor .diffViewport:active {
				background: rgba(191, 191, 191, 0.4);
			}


	.darkMode .monaco-editor .diagonal-fill {
		background-image: linear-gradient(
			-45deg,
			rgba(204, 204, 204, 0.2) 12.5%,
			#0000 12.5%, #0000 50%,
			rgba(204, 204, 204, 0.2) 50%, rgba(204, 204, 204, 0.2) 62.5%,
			#0000 62.5%, #0000 100%
		);
		background-size: 8px 8px;
	}

.darkMode .monaco-editor .findMatch { background-color: rgba(234, 92, 0, 0.33); }
.darkMode .monaco-editor .currentFindMatch { background-color: #515c6a; }
.darkMode .monaco-editor .findScope { background-color: rgba(58, 61, 65, 0.4); }
.darkMode .monaco-editor .find-widget { background-color: #252526; }
.darkMode .monaco-editor .find-widget { box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.36); }
.darkMode .monaco-editor .find-widget { color: #cccccc; }
.darkMode .monaco-editor .find-widget.no-results .matchesCount { color: #f48771; }
.darkMode .monaco-editor .find-widget .monaco-sash { background-color: #454545; }
.darkMode .monaco-editor .find-widget .monaco-inputbox.synthetic-focus { outline-color: #007fd4; }
.darkMode .monaco-editor .folded-background { background-color: rgba(38, 79, 120, 0.3); }

		.darkMode .monaco-editor .cldr.codicon.codicon-folding-expanded,
		.darkMode .monaco-editor .cldr.codicon.codicon-folding-collapsed {
			color: #c5c5c5 !important;
		}

.monaco-hover .hover-contents a.code-link span:hover { color: #3794ff; }
.darkMode .monaco-editor .parameter-hints-widget { border: 1px solid #454545; }
.darkMode .monaco-editor .parameter-hints-widget.multiple .body { border-left: 1px solid rgba(69, 69, 69, 0.5); }
.darkMode .monaco-editor .parameter-hints-widget .signature.has-docs { border-bottom: 1px solid rgba(69, 69, 69, 0.5); }
.darkMode .monaco-editor .parameter-hints-widget { background-color: #252526; }
.darkMode .monaco-editor .parameter-hints-widget a { color: #3794ff; }
.darkMode .monaco-editor .parameter-hints-widget { color: #cccccc; }
.darkMode .monaco-editor .parameter-hints-widget code { background-color: rgba(10, 10, 10, 0.4); }
.darkMode .monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-highlighted-label .highlight { color: #0097fb; }
.darkMode .monaco-editor .suggest-widget, .darkMode .monaco-editor .suggest-details { color: #d4d4d4; }
.darkMode .monaco-editor .suggest-details a { color: #3794ff; }
.darkMode .monaco-editor .suggest-details code { background-color: rgba(10, 10, 10, 0.4); }
.darkMode .monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight { background-color: rgba(234, 92, 0, 0.3); }
.darkMode .monaco-editor .reference-zone-widget .preview .reference-decoration { background-color: rgba(255, 143, 0, 0.6); }
.darkMode .monaco-editor .reference-zone-widget .ref-tree { background-color: #252526; }
.darkMode .monaco-editor .reference-zone-widget .ref-tree { color: #bbbbbb; }
.darkMode .monaco-editor .reference-zone-widget .ref-tree .reference-file { color: #ffffff; }
.darkMode .monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) { background-color: rgba(51, 153, 255, 0.2); }
.darkMode .monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows > .monaco-list-row.selected:not(.highlighted) { color: #ffffff !important; }
.darkMode .monaco-editor .reference-zone-widget .preview .darkMode .monaco-editor .darkMode .monaco-editor-background,.darkMode .monaco-editor .reference-zone-widget .preview .darkMode .monaco-editor .inputarea.ime-input {	background-color: #001f33;}
.darkMode .monaco-editor .reference-zone-widget .preview .darkMode .monaco-editor .margin {	background-color: #001f33;}
.darkMode .monaco-editor .goto-definition-link { color: #4e94ce !important; }
.darkMode .monaco-editor .hoverHighlight { background-color: rgba(38, 79, 120, 0.25); }
.darkMode .monaco-editor .monaco-hover { background-color: #252526; }
.darkMode .monaco-editor .monaco-hover { border: 1px solid #454545; }
.darkMode .monaco-editor .monaco-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid rgba(69, 69, 69, 0.5); }
.darkMode .monaco-editor .monaco-hover hr { border-top: 1px solid rgba(69, 69, 69, 0.5); }
.darkMode .monaco-editor .monaco-hover hr { border-bottom: 0px solid rgba(69, 69, 69, 0.5); }
.darkMode .monaco-editor .monaco-hover a { color: #3794ff; }
.darkMode .monaco-editor .monaco-hover { color: #cccccc; }
.darkMode .monaco-editor .monaco-hover .hover-row .actions { background-color: #2c2c2d; }
.darkMode .monaco-editor .monaco-hover code { background-color: rgba(10, 10, 10, 0.4); }
.darkMode .monaco-editor .snippet-placeholder { background-color: rgba(124, 124, 124, 0.3); outline-color: transparent; }
.darkMode .monaco-editor .finish-snippet-placeholder { background-color: transparent; outline-color: #525252; }


.darkMode .mtk1 { color: #d4d4d4; }
.darkMode .mtk2 { color: #1e1e1e; }
.darkMode .mtk3 { color: #cc6666; }
.darkMode .mtk4 { color: #9cdcfe; }
.darkMode .mtk5 { color: #ce9178; }
.darkMode .mtk6 { color: #b5cea8; }
.darkMode .mtk7 { color: #608b4e; }
.darkMode .mtk8 { color: #569cd6; }
.darkMode .mtk9 { color: #dcdcdc; }
.darkMode .mtk10 { color: #808080; }
.darkMode .mtk11 { color: #f44747; }
.darkMode .mtk12 { color: #c586c0; }
.darkMode .mtk13 { color: #a79873; }
.darkMode .mtk14 { color: #dd6a6f; }
.darkMode .mtk15 { color: #5bb498; }
.darkMode .mtk16 { color: #909090; }
.darkMode .mtk17 { color: #778899; }
.darkMode .mtk18 { color: #ff00ff; }
.darkMode .mtk19 { color: #b46695; }
.darkMode .mtk20 { color: #ff0000; }
.darkMode .mtk21 { color: #4f76ac; }
.darkMode .mtk22 { color: #3dc9b0; }
.darkMode .mtk23 { color: #74b0df; }
.darkMode .mtk24 { color: #4864aa; }
.darkMode .mtki { font-style: italic; }
.darkMode .mtkb { font-weight: bold; }
.darkMode .mtku { text-decoration: underline; text-underline-position: under; }
</style>
`);
        var darkMode = localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false;

        function applyDarkCSS() {
            $("html").addClass('darkMode')
            $(".darkModeBTText").text('Acender as luzes')
        }
        function removeDarkCSS() {
            $("html").removeClass('darkMode')
            $(".darkModeBTText").text('Apagar as luzes')
        }

        if (darkMode) {
            applyDarkCSS();
        }else{
            removeDarkCSS();
        }

        $(".toggle-dark-mode").click(()=>{
            darkMode = !darkMode;
            localStorage.setItem('darkMode', darkMode);
            if (darkMode) {
                applyDarkCSS();
            }else{
                removeDarkCSS();
            }
        })
    }
})();