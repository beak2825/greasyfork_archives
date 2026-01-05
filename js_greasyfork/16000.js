// ==UserScript==
// @name         Fix Foreign Character Summary Links
// @namespace    FixForeignLinks
// @version      1.1
// @description  Changes links with '???-mID' or '??-????-mID' to 'name-mID'
// @match        https://sandbox.kat.cr/moderator/media/*
// @match        https://kat.cr/moderator/media/*
// @downloadURL https://update.greasyfork.org/scripts/16000/Fix%20Foreign%20Character%20Summary%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/16000/Fix%20Foreign%20Character%20Summary%20Links.meta.js
// ==/UserScript==

$('a[href^="/???-m"]').each(function()
{
    var link = $(this).attr("href");
    var name = $(this).text();
    link = "/" + name + link.substr(4);
    $(this).attr("href", link);
});

$('a[href^="/??-????-m"]').each(function()
{
    var link = $(this).attr("href");
    var name = $(this).text();
    link = "/" + name + link.substr(8);
    $(this).attr("href", link);
});