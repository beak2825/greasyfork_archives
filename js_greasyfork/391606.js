// ==UserScript==
// @name       Jira Mingle
// @namespace  http://dillards.com/
// @version    0.1.2
// @description  Adds border color based on project color.
// @match      https://dillards.atlassian.net/*
// @copyright  2019 dillards.com
// @require http://code.jquery.com/jquery-latest.js
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391606/Jira%20Mingle.user.js
// @updateURL https://update.greasyfork.org/scripts/391606/Jira%20Mingle.meta.js
// ==/UserScript==

$(document).ready(function() {

    setInterval(border,1000);
    function border(){
        $('.ghx-issue').each(function(i, obj) {
            var borderColor = $(this).find('.ghx-grabber').css('background-color');
            $(this).css('border-color', borderColor);
            $(this).css('border-style', 'solid');
            $(this).css('border-width', '2px');
            $(this).find('.ghx-grabber').css('display', 'none');
        });
    }

    GM_addStyle('.ghx-top-header {height: 9px !important};');
    GM_addStyle('#ghx-quick-filters {display: none !important};');
    GM_addStyle('#breadcrumbs-container {height: 0px !important};');
    GM_addStyle('#ghx-swimlane-header-stalker {display: none};');
    GM_addStyle('.ghx-first {display: none};');


    /*Increase dialog width */
    GM_addStyle('.css-wgk558 {width: 95%};');

    /*Increase Image Size */
    GM_addStyle('.media-single {width: 100%};');

    /* give non white background-color to kanban board */
    GM_addStyle('div#ghx-pool,#ghx-column-header-group.ghx-fixed,body:not(.adg3) .ghx-column-headers .ghx-column,.ghx-column-headers .ghx-column, .ghx-columns .ghx-column { background-color: #efefef; border-color: #efefef;}');

    /* align column titles with the cards underneath them */
    GM_addStyle('body:not(.adg3) .ghx-column-headers .ghx-column { padding-left: 10px; }');

    /* increase the font size of column titles */
    GM_addStyle('.ghx-column-headers h2 {font-size: 24px;}');

    /* make the card "colour" cover the whole card */
    GM_addStyle('.ghx-issue .ghx-grabber {border-color:inherit !important}');

    /* give cards a white background - it looks better when the grabber */
    GM_addStyle('.ghx-issue {background-color: white; border-color: #999;}');
    GM_addStyle('.ghx-issue.ghx-selected {background-color: #d9e9f9;}');

    /* raise card content so it appear above the grabber */
    GM_addStyle('.ghx-issue section {position: relative; z-index: 1;}');

    /* give cards a white background by default */
    GM_addStyle('.ghx-issue .ghx-grabber[style="background-color:#ededed;"] {opacity: 0;}');

    /* fix overlay div covering cards when moving card with drag-n-drop */
    GM_addStyle('.ghx-zone-overlay {z-index: 2;};');

    /* adjust swimlanes look */
    GM_addStyle('.ghx-swimlane-header {border-top: 1px solid white; border-bottom: 1px solid #ccc; background-color: #e7e7e7;}');

    /* remove white gradient from swimlanes */
    GM_addStyle('.ghx-swimlane-header:after {background-color: transparent; box-shadow: none; -webkit-box-shadow: none;}');

    /* hide not so useful icons */
    GM_addStyle('.ghx-issue .ghx-field-icon[data-tooltip="Task"], .ghx-issue .ghx-field-icon[data-tooltip="Medium priority"] {display: none;}');

    /* make labels more visible */
    GM_addStyle('.ghx-issue .ghx-extra-field[data-tooltip~="Labels:"] {font-weight: bold; font-size: 14px; color: #333;}');

    /* hide when there are no labels */
    GM_addStyle('.ghx-issue .ghx-extra-field[data-tooltip="Labels: None"] {display: none;}');

    /* remove padding to right in full screen and alter width*/
    GM_addStyle('.bcCLha .sc-bTXUnW .iLESlR {width: 60px; padding-right: 0px;}');

    /* remove padding to right in dialog mode.  Change width and position to almost full screeen */
    GM_addStyle('.css-1yfnrso {width: 1825px; margin-left: -384px;}');

    GM_addStyle('.eIhpOl {width: calc(0.1 * min(1400px, 100%) + 12px);}');

});