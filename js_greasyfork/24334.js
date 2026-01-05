// ==UserScript==
// @name        Ascunderea butonului de notificări pe TMD
// @namespace   XXN@TMD
// @description Script pentru ascunderea butonului de notificări
// @author      XXN
// @include     *torrentsmd.com/*
// @include     *torrentsmd.eu/*
// @include     *torrentsmd.me/*
// @include     *topicmd.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24334/Ascunderea%20butonului%20de%20notific%C4%83ri%20pe%20TMD.user.js
// @updateURL https://update.greasyfork.org/scripts/24334/Ascunderea%20butonului%20de%20notific%C4%83ri%20pe%20TMD.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;
$('td[style*="padding: 10px; background-color: #7777ce"]').hide();

//var linknotif = '<a href="/notifs.php">Notificări</a> | ';
//$('div[style*="float:right"]').prepend(linknotif);