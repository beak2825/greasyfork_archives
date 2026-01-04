// ==UserScript==
// @name         TV5Monde2KG
// @namespace    https://www.cinelounge.org/
// @version      1.01
// @description  Browse KG from TV5 Monde Plus
// @author       tadanobu
// @match        https://www.tv5mondeplus.com/en/details/vod/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tv5mondeplus.com
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456733/TV5Monde2KG.user.js
// @updateURL https://update.greasyfork.org/scripts/456733/TV5Monde2KG.meta.js
// ==/UserScript==

$(document).ready(function()
{
    $(document.body).append('<div style="position:fixed;top:44px;right:240px;border:1px solid white;font-size:14px;"><a href="https://karagarga.in/browse.php?search=&quot;' + $(document).find("title").text().split(' en streaming')[0] + '&quot;&search_type=torrent" target="_blank"><span style="color: #ffffff !important">KG</span></a></div>');
});