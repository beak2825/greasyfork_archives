// ==UserScript==
// @name         JIRA Cloud
// @namespace    http://tampermonkey.net/
// @version      0.9.5
// @description  Re-theming script for JIRA Cloud
// @author       David Wipperfurth
// @match        https://*.atlassian.net/*
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/441102/JIRA%20Cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/441102/JIRA%20Cloud.meta.js
// ==/UserScript==

// The really old version of jQuery is to appease FireFox, who doesn't think jQuery exists without the call-out
// and to keep Chrome from complaining when it sees two wildly different versions of jQuery on the system.

(function() {
    'use strict';

    var css = document.createElement('style');
    css.type = 'text/css';
    css.name = "custom-css";
    css.innerHTML = `

html, html body#jira {
    background-color: #eee;
}
body .cWzlMc, body .css-zvta6n, body .jsSCtF,
body .cSnBhI, body .kCUjSv, body .kZKcTI,
body .dHydut, body #jira-issue-header-actions,
body .kSNbSf, body .jzKtnn, body .skNbo, body .iETRNE
{
    background-color: #eee;
}
body .cHauVX    /* block columns */
{
     background-color: #eee;
}

body .izWGlW {
    background-color: #fff;
}

body .dgbPQn {
    background-color: #fff;
    margin: 24px 12px 32px 24px;
    border-radius: 4px;
    border: solid 1px #ccc;
}

body .bzpsgq {
    overflow: visible;
    width: calc(100% - 720px);
}

body .kfVduZ {
    width: auto;
    overflow: visible;
}

body .ihzd {
    display: none;
}

body .yjkY {
    min-width: 0;
}

body .dgMUBn {
    display: inline-block;
    position: absolute;
}

body .bzpsgq {
    padding-left: 0;
}

body .klZhqF {
    padding: 0;
}

body .kZKcTI      /* ticket icon container (above fields widget) */
{
    float: right;
    margin: 0;
    padding: 0;
}

body .kZKcTI > div > div > div
{
    margin: 0;
}

body .kZKcTI button .css-1ncnk3i,    /* ticket icon (above fields widget) */
body .kZKcTI button .css-1ncnk3i > svg    /* SVG for ticket icons (above fields widget) */
{
    width: 16px;
    height: 16px;
}

body .hlFJLM /* Collapsed custom fields widget's content */
{
    max-width: 20ex;
}

body .jkTZZQ    /* widget content frame */
{
    padding-bottom: 4px;
}

body .ksLAlg .fuBDPm    /* enviroment field value container */
{
    max-width: 300px;
}

body .ksLAlg .fuBDPm .iwmwPQ    /* enviroment field value */
{
    overflow-x: scroll;
    white-space: nowrap;
}

body table.issue-table tbody tr.issuerow    /* ticket table row */
{
    border-bottom: solid 1px #eee;
}

.ioAami {    /* section heading containers */
    border-bottom: solid #0052CC;
    margin-bottom: 8px;
    padding-bottom: 4px;
    font-size: 1.2em;
}
.LlqtS .ioAami {
    margin-top: 56px;
}

body .mffpf0-0.dgbPQn .qwux5g-0.lpaOtj    /* "activity header */
{
    display: none;
}

body .ss4jvk-4.gycPRd    /* chat message */
{
    border-top: solid 1px #eee;
    padding-top: 8px;
    margin-top: 0px;
}

body .eANdKV    /* initial chat box container */
{
    box-shadow: none;
}

body .guBgLL    /* ticket toolbar */
{
    margin: 0 0 0 calc(100% - 220px);
}

body .fxeFNT    /* ticket title */
{
    width: calc(100% - 280px);
    margin-bottom: -42px;
}

body .css-1s4q3yq    /* comment edit toolbar */
{
    visibility: hidden;
    position: absolute;
    top: 0px;
    right: 0px;
    margin-top: 0px;
}
body .gycPRd:hover .css-1s4q3yq    /* comment edit toolbar */
{
    visibility: visible
}

html body#jira.wcw-white-background,
html.wcw-white-background
{
    background: white;
}

.guBgLL span.css-19r5em7    /* ticket inner toolbar icon text*/
{
    display: none;
}

.body .jpWHfS iframe    /* Zephyr Region */
{
    border-radius: 4px;
}

/*******************************************
**********     Confluence     **************
********************************************/

body .kkPmar,    /* page header frame */
body .e1vqopgf0,    /* page content frame */
body .xJxJe,    /* another page content frame */
body .hJVqco,    /* another page content frame */
body .sc-dqBHgY,
body .sc-lnmtFM,
body .fabric-editor-popup-scroll-parent > div > div,
body .ak-renderer-wrapper > div
{
    margin: 0 0 0 0;
    max-width: none;
}

body .rAVIf    /* floating table header */
{
    display: none;
}

body .eg76fx70    /* quick start floating button */
{
    display: none;
}

/******************************************
********        editor      ***************
*******************************************/

.wcw-edit-container {
    margin: 16px 0;
}
.wcw-editor {
    width: 100%;
    height: 10em;
    border: solid 1px #eee;
    border-radius: 4px;
}
`;
    document.getElementsByTagName('head')[0].appendChild(css);

    // Add Mark-up Editor
    jQuery(document).load(
    setTimeout(function(){
        var ticket = jQuery('#jira-issue-header .css-47yo1b .css-1we84oz').text();

        console.log(ticket);
        jQuery('.czMqAP').append(`<button class="wcw-old css-1y6dd5y"> Mark-up Editor </button>`);
        jQuery('.wcw-old').on('click', function(){
            jQuery('.mEYYF, .dHydut').parent().html(`<div class="wcw-edit-container"><textarea class="wcw-editor"></textarea><button class="wcw-edit-submit css-1y6dd5y">Add</button></div>`);
            jQuery('.wcw-edit-submit').on('click', function(){
                jQuery.ajax({
                    type: 'POST',
                    url: '../rest/api/2/issue/'+ticket+'/comment',
                    data: JSON.stringify({body: jQuery('.wcw-editor').val()}),
                    contentType: "application/json",
                    dataType: "json",
                    success:  function(){
                        location.reload();
                    }
                });
            });
        });
    }, 1000));

    // Move center Fields to side bar
    jQuery(document).load(
    setTimeout(function(){
        console.log('Move center Fields to side bar');
        jQuery('.ei7vuq-1.jGULOR > .ksLAlg, .ei7vuq-1.jGULOR > .gbXyYv').appendTo('[data-test-id$="ui.context-group.details-group"]');
    }, 1000));

    // Add external create ticket link
    jQuery(document).load(function(){
        console.log('Setup for external create ticket link');
        var toolbarChecker = setInterval(function(){
            if (jQuery('.inKQpX').length == 0) {
                return;
            }
            if (jQuery('.inKQpX .wcw-add-button').length > 0) {
                clearInterval(toolbarChecker);
                return;
            }
            console.log('Add external create ticket link');
            jQuery('.inKQpX').append(`
            <a class="wcw-add-button" href="https://webcourseworks.atlassian.net/CreateIssue.jspa" target="_blank">
                <button class="css-11oxvjq" type="button" tabindex="0">
                    <span class="css-1ujqpe8">
                        <span role="img" aria-label="Create" class="css-pxzk9z" style="--icon-primary-color:currentColor; --icon-secondary-color:var(--ds-background-default, #FFFFFF);">
                            <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                                <path d="M13 11V7a1 1 0 00-2 0v4H7a1 1 0 000 2h4v4a1 1 0 002 0v-4h4a1 1 0 000-2h-4z" fill="currentColor" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                    </span>
                </button>
            </a>`);
        }, 500);
    }());

    // white background on create page
    jQuery(document).load(
    setTimeout(function(){
        console.log('white background on create page');
        jQuery('body:has(#issue-create), html:has(#issue-create)').addClass('wcw-white-background');
    }, 100));

})();