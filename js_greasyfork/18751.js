// ==UserScript==
// @name         Mendelu portlet bar sticked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stick left portletbar when scrolling
// @author       Jakub
// @match        https://is.mendelu.cz/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/18751/Mendelu%20portlet%20bar%20sticked.user.js
// @updateURL https://update.greasyfork.org/scripts/18751/Mendelu%20portlet%20bar%20sticked.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function(){
$(".portletbar").css("position", "fixed");
});

