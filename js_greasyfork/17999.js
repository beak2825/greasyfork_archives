// ==UserScript==
// @name         JIRA: Copy GIT commit message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Works on https://jira.gtnexus.info/browse/
// @author       You
// @match        https://jira.gtnexus.info/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17999/JIRA%3A%20Copy%20GIT%20commit%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/17999/JIRA%3A%20Copy%20GIT%20commit%20message.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
$( document ).ready(
    $("<input type=\"text\" value=\"Copy Commit Comment\" id=\"_copycommit\" style=\"cursor: pointer; border: 1px solid rgb(204, 204, 204); border-radius: 3px; padding: 4px 10px; margin-left: 5px; width: 150px; font-size: 12px; text-align: center; background: linear-gradient(rgb(255, 255, 255) 0%, rgb(242, 242, 242) 100%);\" onclick=\"$(this).val($($('.issue-link')[0]).text() + ': ' + $('#summary-val').text());$(this).select();document.execCommand('copy');$('#_copycommit').val('Copied to clipboard!').css('font-weight','bold').css('cursor','default').attr('disabled','disabled');setTimeout(function (){$('#_copycommit').val('Copy Commit Comment').css('font-weight','').css('cursor','pointer').removeAttr('disabled')}, 2000);\">")
    .insertAfter($($('.issue-link')[0]))
);