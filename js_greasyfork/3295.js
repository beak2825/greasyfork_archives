// ==UserScript==
// @name        chmurkowyjebywacz
// @description Wywala chmurki w lewym dolnym rogu i przycisk Open chat
// @namespace   soowal
// @include     http://*erepublik.com/*
// @include     https://*erepublik.com/*
// @version     1
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/3295/chmurkowyjebywacz.user.js
// @updateURL https://update.greasyfork.org/scripts/3295/chmurkowyjebywacz.meta.js
// ==/UserScript==

function hidethatfuckingshit()
{
    $('div.notification_area, a.newleaderboard em, #cometchat_hidden').hide();
    $('a.newleaderboard em').hide();
}

$(function()
{
    hidethatfuckingshit();
    setInterval(hidethatfuckingshit, 100);
});

hidethatfuckingshit();