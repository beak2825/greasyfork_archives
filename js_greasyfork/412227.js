// ==UserScript==
// @name         BigQuery Platform Modifier
// @namespace    http://tampermonkey.net/
// @version      0.6.9
// @description  BigQuery Platform Modifier modifies BigQuery Platform to display panels side by side.
// @author       Hubertokf
// @match        *://console.cloud.google.com/bigquery*
// @grant        none
// @grant		 GM_addStyle
// @grant		 GM_getValue
// @grant		 GM_setValue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/412227/BigQuery%20Platform%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/412227/BigQuery%20Platform%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    const waitForElementToDisplay = (selector, time) => {
        if(document.querySelector(selector)!=null) {
            addBqSidePanels();
            if(document.querySelector('.darkModeBTText')==null) {
                // Starts listening for changes in the root HTML element of the page.
                addBqDarkMode();
            }
            waitFor('.left-pannel', 2000, () => {waitForElementToDisplay('.p6n-panel-container-inner.p6n-panel-offset-parent.p6n-panel-container-horizontal', 2000)});
            return;
        }
        else {
            setTimeout(() => {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    const waitFor = (selector, time, callback) => {
        if(document.querySelector(selector)==null) {
            callback()
        }
        else {

            setTimeout(() => {
                waitFor(selector, time, callback);
            }, time);
        }
    }

    $(document).ready(()=>{
        $("head").append('<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css" rel="stylesheet" type="text/css">');

        waitFor('.left-pannel', 2000, () => {waitForElementToDisplay('.p6n-panel-container-inner.p6n-panel-offset-parent.p6n-panel-container-horizontal', 2000)});

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
.darkMode ::-webkit-scrollbar {width: 10px;}
.darkMode ::-webkit-scrollbar-track {background: transparent;}
.darkMode ::-webkit-scrollbar-thumb {background: #424450;}
.darkMode ::-webkit-scrollbar-thumb:hover {background: #424450;}
.darkMode .right-pannel, .darkMode .left-pannel {background-color: ${colors.other.BGDark} !important;}
.darkMode {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode body {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode a:visited, .darkMode a:hover{color: #a4a4a4 !important;}

.darkMode .central-page.pcc-default-theme {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
.darkMode .cfc-action-bar-layout-region.cfc-action-bar-section-left * {background-color: ${colors.other.BGDark} !important; color:${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
/*.darkMode .cfc-panel .cfc-panel-side-left * {background-color: ${colors.other.BGDark} !important; color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}*/
.darkMode .cfc-panel .cfc-panel-side-left * {color: ${colors.base.FG} !important; border-color: ${colors.other.BGDarker} !important;}
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
.darkMode .goog-flat-menu-button.jfk-select {background-color: ${colors.other.BGLight} !important; color: ${colors.base.FG} !important;}
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

    const addBqSidePanels = () => {
        console.log("BigQuery Platform Modifier: modifying BQ...");

        $("head").append(`
<style>
.p6n-bq-results-table-scroll-container {max-width: 96%;}
</style>
`);

        var content = $('.p6n-panel-container-inner.p6n-panel-offset-parent.p6n-panel-container-horizontal');
        content.css("flex-direction", "row");

        content.prepend( '<div class="left-pannel"></div>' );
        var leftPanel = $('.left-pannel').css("display", "flex").css("flex-direction", "column").css("width", "860px").css('flex', '0 0 auto').css('border-right', '2px solid #999').css('padding-right', '2px');

        //content.append( '<div class="splitter"></div>' );
        //var splitter = $('.splitter').css("flex", "0 0 auto").css("width", "2px").css("cursor", "col-resize").css("background-color", "#999")

        content.append( '<div class="right-pannel"></div>' );
        var rightPanel = $('.right-pannel');

        $(rightPanel).css("flex-grow", "1").css("flex", "1 1 auto").css("overflow-x", "hidden");

        var title = content.find('.p6n-bq-query-editor-title-container')[0];
        var editor = content.find('.p6n-vulcan-panel.bq-query-editor-panel.p6n-panel')[0];

        $(title).appendTo(leftPanel);
        $(editor).appendTo(leftPanel);
        $(editor).css("height", "100%");

        var results = content.find('.p6n-vulcan-panel-primary.bq-main-panel.p6n-panel.p6n-panel-center')[0];

        var toRemove = content.find('.p6n-panel-splitter.p6n-panel-splitter-horizontal.p6n-panel-splitter-resizable')[0];
        toRemove.remove();

        console.log('rightPanel', rightPanel);
        console.log('results', results);

        const foundResults = !!results;
        while (!foundResults){
            foundResults = !!content.find('.p6n-vulcan-panel-primary.bq-main-panel.p6n-panel.p6n-panel-center')[0]
            console.log(foundResults)
        }

        $(results).appendTo(rightPanel);
        $(results).css("height", "100%");

        $('.left-pannel').resizable({
            handles: 'e',
            resizeHeight: false,
            minWidth: 100
        });

        $('.p6n-vulcan-panel-content-bq-no-padding').css("overflow-x", "hidden");

        console.log("BigQuery Platform Modifier: done modifying BQ...");
    }
})();